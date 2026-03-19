from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import math
from datetime import datetime
from pathlib import Path

# Импортируем из наших файлов
from database import SessionLocal
from models import Issue, Cluster, User
from ai_model import CityFixAIModel
ai_model = CityFixAIModel()
router = APIRouter()

# Зависимость для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Функция для расчета расстояния между координатами (в км)
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

# Создание новой проблемы
@router.post("/issues")
async def create_issue(
    title: str = Form(...),
    description: str = Form(None),
    category: str = Form(...),
    district: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    address: str = Form(...),
    user_id: str = Form(...),
    photos: List[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    try:
        photo_urls = []
        photo_hash = None

        # Сохраняем фото если есть
        if photos and photos[0].filename:
            upload_dir = Path("uploads")
            upload_dir.mkdir(exist_ok=True)
            
            for photo in photos:
                if photo.filename:
                    file_ext = Path(photo.filename).suffix
                    file_name = f"{uuid.uuid4()}{file_ext}"
                    file_path = upload_dir / file_name
                    
                    content = await photo.read()
                    with open(file_path, "wb") as f:
                        f.write(content)
                    
                    photo_urls.append(f"/uploads/{file_name}")

                    if not photo_hash:
                        try:
                            await photo.seek(0)
                            content = await photo.read()
                            result = ai_model.predict(content)
                            photo_hash = result['phash']
                            print(f"Photo hash calculated: {photo_hash}")
                        except Exception as e:
                            print(f"Error calculating photo hash: {e}")
        
        # Ищем существующий кластер поблизости
        clusters = db.query(Cluster).filter(
            Cluster.category == category,
            Cluster.status != "resolved"
        ).all()
        
        nearby_cluster = None
        for cluster in clusters:
            distance = calculate_distance(
                latitude, longitude,
                cluster.center_lat, cluster.center_lon
            )
            if distance <= 2.0:
                nearby_cluster = cluster
                break
        
        # Создаем проблему
        issue = Issue(
            title=title,
            description=description,
            category=category,
            district=district,
            latitude=latitude,
            longitude=longitude,
            address=address,
            photo_before=",".join(photo_urls) if photo_urls else None,
            photo_hash=photo_hash,
            user_id=int(user_id) if user_id.isdigit() else 1,
            status="new"
        )
        
        if nearby_cluster:
            # Присоединяем к существующему кластеру
            issue.cluster_id = nearby_cluster.id
            nearby_cluster.issue_count += 1
            db.add(nearby_cluster)
        else:
            # Создаем новый кластер
            db.add(issue)
            db.flush()
            
            new_cluster = Cluster(
                category=category,
                center_lat=latitude,
                center_lon=longitude,
                issue_count=1,
                priority="medium",
                status="new",
                title=title,
                district=district
            )
            db.add(new_cluster)
            db.flush()
            
            issue.cluster_id = new_cluster.id
        
        db.add(issue)
        db.commit()
        db.refresh(issue)
        
        return {
            "success": True,
            "issue_id": issue.id,
            "cluster_id": issue.cluster_id,
            "message": "Проблема успешно создана",
            "photos": photo_urls
        }
        
    except Exception as e:
        print(f"Ошибка: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/issues")
def get_issues(
    category: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Issue)
    
    if category:
        query = query.filter(Issue.category == category)
    if status:
        query = query.filter(Issue.status == status)
    
    issues = query.offset(skip).limit(limit).all()
    return issues

@router.get("/issues/{issue_id}")
def get_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Проблема не найдена")
    return issue

@router.get("/clusters")
def get_clusters(db: Session = Depends(get_db)):
    clusters = db.query(Cluster).all()
    return [
        {
            "id": c.id,
            "position": [c.center_lat, c.center_lon],
            "type": c.category,
            "priority": c.priority,
            "count": c.issue_count,
            "status": c.status,
            "title": c.title,
            "district": c.district
        }
        for c in clusters
    ]

@router.post("/issues/{issue_id}/vote")
def vote_issue(issue_id: int, user_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Проблема не найдена")
    
    # TODO: добавить таблицу votes
    issue.votesCount = (issue.votesCount or 0) + 1
    db.commit()
    
    return {"success": True, "message": "Голос учтен"}