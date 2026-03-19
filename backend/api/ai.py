from fastapi import APIRouter, UploadFile, File, HTTPException
from database import SessionLocal
from models import Issue
import io
from ai_model import CityFixAIModel
import os

router = APIRouter()

# Создаем экземпляр модели при старте
ai_model = CityFixAIModel()

@router.post("/ai/analyze")
async def analyze_photo(photo: UploadFile = File(...)):
    """
    Анализирует фото и определяет категорию проблемы
    Возвращает топ-3 категории с уверенностью
    """
    try:
        # Проверяем размер файла (макс 10MB)
        contents = await photo.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
        
        # Получаем предсказания от AI
        result = ai_model.predict(contents)
        
        # Проверяем на дубликаты в БД
        db = SessionLocal()
        try:
            similar_issue = db.query(Issue).filter(
                Issue.photo_hash == result['phash']
            ).first()
        finally:
            db.close()
        
        response = {
            "success": True,
            "category": result['top_category'],
            "confidence": result['top_confidence'],
            "all_predictions": result['predictions']
        }
        
        if similar_issue:
            response["is_duplicate"] = True
            response["similar_issue_id"] = similar_issue.id
            response["similar_issue_title"] = similar_issue.title
        else:
            response["is_duplicate"] = False
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in AI analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/analyze-batch")
async def analyze_photos(photos: list[UploadFile] = File(...)):
    """
    Анализирует несколько фото (максимум 5)
    """
    if len(photos) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 photos allowed")
    
    results = []
    for photo in photos:
        contents = await photo.read()
        result = ai_model.predict(contents)
        results.append({
            "filename": photo.filename,
            "category": result['top_category'],
            "confidence": result['top_confidence']
        })
    
    return {
        "success": True,
        "results": results
    }