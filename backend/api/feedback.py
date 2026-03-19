from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import SessionLocal
from models import Issue
from datetime import datetime

router = APIRouter()

class FeedbackData(BaseModel):
    issue_id: int
    user_selected_category: str
    ai_suggested_category: str
    ai_confidence: float

@router.post("/ai/feedback")
async def ai_feedback(feedback: FeedbackData):
    """
    Сохраняет обратную связь от пользователя для улучшения AI
    """
    db = SessionLocal()
    try:
        issue = db.query(Issue).filter(Issue.id == feedback.issue_id).first()
        
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        
        # Сохраняем feedback в отдельную таблицу или JSON поле
        if not hasattr(issue, 'ai_feedback'):
            # Создаем поле если его нет
            from sqlalchemy import Column, JSON
            # В реальном проекте добавьте поле в models.py
        
        # Пока сохраняем в отдельную таблицу
        # TODO: создать таблицу ai_feedback
        
        # Записываем в лог для будущего обучения
        with open('ai_feedback.log', 'a') as f:
            f.write(f"{datetime.now()},{feedback.issue_id},"
                   f"{feedback.ai_suggested_category},{feedback.user_selected_category},"
                   f"{feedback.ai_confidence}\n")
        
        return {
            "success": True,
            "message": "Feedback saved for improving AI"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@router.get("/ai/feedback/stats")
async def get_feedback_stats():
    """
    Получает статистику обратной связи для оценки качества AI
    """
    try:
        total = 0
        correct = 0
        
        with open('ai_feedback.log', 'r') as f:
            for line in f:
                total += 1
                parts = line.strip().split(',')
                if len(parts) >= 4:
                    if parts[2] == parts[3]:  # ai_category == user_category
                        correct += 1
        
        accuracy = (correct / total * 100) if total > 0 else 0
        
        return {
            "total_feedback": total,
            "correct_predictions": correct,
            "accuracy": round(accuracy, 2)
        }
    except FileNotFoundError:
        return {
            "total_feedback": 0,
            "correct_predictions": 0,
            "accuracy": 0
        }