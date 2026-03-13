from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CityFix API",
    description="API для платформы городских проблем",
    version="1.0.0"
)

# Настройка CORS для Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "CityFix API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": "2024-01-01T00:00:00Z"}

@app.get("/api/clusters")
def get_clusters():
    """
    Временный эндпоинт для тестирования
    """
    return [
        {
            "id": "1",
            "position": [43.2389, 76.8897],
            "type": "road",
            "priority": "high",
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
