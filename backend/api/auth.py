from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, validator
from typing import Optional
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from database import get_db
from models import User
from rate_limiter import rate_limit
import re

router = APIRouter()

# ========== PYDANTIC МОДЕЛИ ==========

class UserCreate(BaseModel):
    username: str
    email: str
    name: Optional[str] = None  # Сделаем необязательным
    phone: Optional[str] = None  # Сделаем необязательным
    password: str
    
    @validator('username')
    def validate_username(cls, v):
        if not v or len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if len(v) > 50:
            raise ValueError('Username must be less than 50 characters')
        # Разрешены буквы, цифры, подчеркивание
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers and underscore')
        return v.strip()
    
    @validator('email')
    def validate_email(cls, v):
        if not v:
            raise ValueError('Email is required')
        
        # Простая, но эффективная проверка email
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, v):
            raise ValueError('Invalid email format')
        
        # Проверка на временные домены (опционально)
        disposable_domains = ['tempmail.com', 'mailinator.com', '10minutemail.com']
        domain = v.split('@')[1].lower()
        if domain in disposable_domains:
            raise ValueError('Disposable email addresses are not allowed')
        
        return v.lower().strip()
    
    @validator('name')
    def validate_name(cls, v):
        if v:  # Если имя предоставлено
            if len(v) < 2:
                raise ValueError('Name must be at least 2 characters long')
            if len(v) > 100:
                raise ValueError('Name must be less than 100 characters')
            return v.strip()
        return v or ""  # Если нет имени, возвращаем пустую строку
    
    @validator('phone')
    def validate_phone(cls, v):
        if v:  # Если телефон предоставлен
            # Очищаем от пробелов и спецсимволов
            phone_clean = re.sub(r'[\s\-\(\)\+]', '', v)
            
            if not phone_clean.isdigit():
                raise ValueError('Phone number must contain only digits')
            
            if len(phone_clean) < 10:
                raise ValueError('Phone number must contain at least 10 digits')
            
            if len(phone_clean) > 15:
                raise ValueError('Phone number must contain at most 15 digits')
            
            return v
        return v or ""  # Если нет телефона, возвращаем пустую строку
    
    @validator('password')
    def validate_password(cls, v):
        if not v or len(v) < 6:  # Минимум 6 символов для тестирования
            raise ValueError('Password must be at least 6 characters long')
        
        if len(v) > 128:
            raise ValueError('Password must be less than 128 characters')
        
        # Рекомендации, но не обязательные требования
        if not re.search(r"[A-Z]", v):
            raise ValueError('Password should contain at least one uppercase letter')
        
        if not re.search(r"[a-z]", v):
            raise ValueError('Password should contain at least one lowercase letter')
        
        if not re.search(r"[0-9]", v):
            raise ValueError('Password should contain at least one digit')
        
        return v

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    name: Optional[str] = None
    role: str
    phone: Optional[str] = None

# ========== ЭНДПОИНТЫ ==========

@router.post("/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Регистрация нового пользователя
    """
    print(f"Registering user: {user_data.username}")  # Для отладки
    
    # Проверка существующего пользователя
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this username already exists"
            )
    
    # Хеширование пароля
    hashed_password = get_password_hash(user_data.password)
    
    # Создание пользователя
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        name=user_data.name or "",
        phone=user_data.phone or "",
        password_hash=hashed_password,
        role="user"
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        print(f"Database error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )
    
    # Создание токена
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.username,
            "name": new_user.name,
            "role": new_user.role,
            "phone": new_user.phone
        }
    }

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Вход пользователя"""
    
    # Поиск по username или email
    user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.username)
    ).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password"
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "name": user.name,
            "role": user.role,
            "phone": user.phone
        }
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Получение информации о текущем пользователе"""
    return current_user

# ========== ДОПОЛНИТЕЛЬНЫЙ ЭНДПОИНТ ДЛЯ ПРОВЕРКИ ==========

@router.post("/check-password")
def check_password(password_data: dict):
    
    try:
        validate_password(password_data.get("password", ""))
        return {"valid": True, "message": "Password is strong"}
    except HTTPException as e:
        return {"valid": False, "message": e.detail}

@router.post("/check-email")
def check_email(email_data: dict):
    """
    Эндпоинт для проверки email без регистрации
    """
    try:
        validated = validate_email_real(email_data.get("email", ""))
        return {"valid": True, "email": validated}
    except HTTPException as e:
        return {"valid": False, "message": e.detail}