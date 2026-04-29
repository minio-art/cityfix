from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
from datetime import datetime
from api import issues, ai, auth, feedback
from database import SessionLocal 
from models import Cluster, Issue

# Создаем папку для uploads
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="CityFix API",
    description="API для платформы городских проблем",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cityfix-mv20.onrender.com",  # ваш фронтенд
        "http://localhost:3000",
        "http://localhost:8001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Обработчик OPTIONS для CORS preflight
@app.options("/{path:path}")
async def options_handler(request: Request):
    return JSONResponse(
        content={"message": "OK"},
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "https://cityfix-mv20.onrender.com",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Подключаем статику
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Подключаем роутеры
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(issues.router, prefix="/api", tags=["issues"])
app.include_router(ai.router, prefix="/api", tags=["ai"])
app.include_router(feedback.router, prefix="/api", tags=["feedback"])

@app.get("/")
def root():
    return {
        "message": "CityFix API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/clusters")
def get_clusters():
    return [
        {
            "id": "1",
            "position": [43.2389, 76.8897],
            "type": "roads",
            "priority": "critical",
            "count": 12,
            "status": "active"
        },
        {
            "id": "2",
            "position": [43.2221, 76.8512],
            "type": "light",
            "priority": "medium",
            "count": 5,
            "status": "in_progress"
        }
    ]

# Функция для расчета приоритета (добавьте её!)
def calculate_priority(issues_count, category, days_old, total_votes):
    """Расчет приоритета кластера"""
    # Базовая логика - вы можете настроить под свои нужды
    priority_score = 0
    
    # Чем больше проблем, тем выше приоритет
    if issues_count > 20:
        priority_score += 3
    elif issues_count > 10:
        priority_score += 2
    elif issues_count > 5:
        priority_score += 1
    
    # Чем старше проблема, тем выше приоритет
    if days_old > 30:
        priority_score += 3
    elif days_old > 14:
        priority_score += 2
    elif days_old > 7:
        priority_score += 1
    
    # По голосам
    if total_votes > 50:
        priority_score += 3
    elif total_votes > 20:
        priority_score += 2
    elif total_votes > 10:
        priority_score += 1
    
    # Приоритет по категориям
    high_priority_categories = ['roads', 'light', 'water']
    if category in high_priority_categories:
        priority_score += 2
    
    # Преобразуем в текст
    if priority_score >= 5:
        return "critical"
    elif priority_score >= 3:
        return "high"
    elif priority_score >= 1:
        return "medium"
    else:
        return "low"

def update_all_priorities():
    """Обновляет приоритеты всех кластеров"""
    print(f"🔄 Updating priorities at {datetime.now()}")
    db = SessionLocal()
    try:
        clusters = db.query(Cluster).all()
        updated = 0
        for cluster in clusters:
            issues = db.query(Issue).filter(Issue.cluster_id == cluster.id).all()
            total_votes = sum(i.votesCount or 0 for i in issues)
            days_old = (datetime.now() - cluster.created_at).days if cluster.created_at else 0
            
            new_priority = calculate_priority(
                len(issues), 
                cluster.category, 
                days_old, 
                total_votes
            )
            
            if cluster.priority != new_priority:
                cluster.priority = new_priority
                updated += 1
        
        db.commit()
        print(f"✅ Updated {updated} clusters")
    except Exception as e:
        print(f"Error updating priorities: {e}")
        db.rollback()
    finally:
        db.close()

# Опционально: запускаем обновление приоритетов при старте
@app.on_event("startup")
def startup_event():
    print("🚀 CityFix API starting...")
    # Можно раскомментировать, если нужно обновить приоритеты при старте
    # update_all_priorities()