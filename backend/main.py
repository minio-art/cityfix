from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from datetime import datetime, timedelta
from api import issues
from api import ai
from api import auth
from api import feedback
from database import SessionLocal 
from models import Cluster, Issue
from apscheduler.schedulers.background import BackgroundScheduler
# Создаем папку для uploads, если её нет
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="CityFix API",
    description="API для платформы городских проблем",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_user_to_state(request: Request, call_next):
    # Пробуем получить user из токена (если есть)
    from auth import get_current_user
    from database import SessionLocal
    from sqlalchemy.orm import Session
    from fastapi import Depends
    
    # Это упрощенная версия - лучше использовать Depends
    response = await call_next(request)
    return response

# Подключаем статику для загруженных фото
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(issues.router, prefix="/api", tags=["issues"])
app.include_router(ai.router, prefix="/api", tags=["ai"])
app.include_router(feedback.router, prefix="/api", tags=["feedback"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

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
    # TODO: подключить реальные данные из БД
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

def update_all_priorities():
    """Обновляет приоритеты всех кластеров"""
    db = SessionLocal()
    try:
        clusters = db.query(Cluster).all()
        for cluster in clusters:
            # Получаем все проблемы в кластере
            issues = db.query(Issue).filter(Issue.cluster_id == cluster.id).all()
            
            # Считаем голоса
            total_votes = sum(i.votesCount or 0 for i in issues)
            
            # Время существования
            days_old = (datetime.now() - cluster.created_at).days
            
            # Обновляем приоритет
            new_priority = calculate_priority(
                len(issues), 
                cluster.category, 
                days_old, 
                total_votes
            )
            
            if cluster.priority != new_priority:
                cluster.priority = new_priority
                print(f"Cluster {cluster.id} priority updated: {cluster.priority} -> {new_priority}")
        
        db.commit()
    except Exception as e:
        print(f"Error updating priorities: {e}")
    finally:
        db.close()

# Запускаем обновление каждые 6 часов
scheduler = BackgroundScheduler()
scheduler.add_job(update_all_priorities, 'interval', hours=6)
scheduler.start()