from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from datetime import datetime
from api import issues
from api import ai
from api import feedback
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

# Подключаем статику для загруженных фото
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
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