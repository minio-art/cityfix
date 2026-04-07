from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from datetime import datetime
from api import issues, ai, auth, feedback
from database import SessionLocal 
from models import Cluster, Issue
from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
from datetime import datetime
from api import issues, ai, auth, feedback

# Создаем папку для uploads
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="CityFix API",
    description="API для платформы городских проблем",
    version="1.0.0"
)

# Настройка CORS - ДОЛЖНА БЫТЬ ПЕРВОЙ!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Временно разрешаем все для теста
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Явный обработчик для OPTIONS запросов
@app.options("/{path:path}")
async def options_handler(request: Request):
    """Handle OPTIONS requests for CORS preflight"""
    response = JSONResponse(
        content={"message": "OK"},
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "3600",
        }
    )
    return response

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