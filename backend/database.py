from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Берем URL базы данных из переменной окружения
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set! "
        "Please add it in Render Dashboard or .env file"
    )

# Добавляем sslmode=require если его нет
if "sslmode=require" not in DATABASE_URL:
    # Добавляем ? или & в зависимости от того, есть ли уже параметры
    separator = '?' if '?' not in DATABASE_URL else '&'
    DATABASE_URL += f"{separator}sslmode=require"

print(f"📁 Connecting to PostgreSQL at: {DATABASE_URL.split('@')[1].split('?')[0] if '@' in DATABASE_URL else 'database'}")

# Создаем engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False  # Поставьте True только для отладки
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()