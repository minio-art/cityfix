# backend/ai_service.py
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import imagehash
import io
import numpy as np
from typing import Dict, List, Tuple
import hashlib

class CityFixAIService:
    def __init__(self):
        # Загружаем предобученную модель для классификации
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = models.resnet18(pretrained=True)
        self.model.eval()
        self.model.to(self.device)
        
        # Трансформации для изображений
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Категории проблем (можно обучить на своих данных)
        self.categories = {
            'roads': ['pothole', 'crack', 'road damage'],
            'light': ['street light', 'broken lamp'],
            'trash': ['garbage', 'waste', 'dump'],
            'graffiti': ['graffiti', 'vandalism']
        }

    async def predict_category(self, image_data: bytes) -> Dict:
        """
        Определяет категорию проблемы по фото
        """
        try:
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            
            # Здесь нужно заменить на свои классы
            # Пока возвращаем заглушку
            return {
                'category': 'roads',  # Определенная категория
                'confidence': 0.85,
                'probabilities': {}
            }
        except Exception as e:
            return {'error': str(e)}

    def calculate_image_hash(self, image_data: bytes) -> Dict:
        """
        Вычисляет хэши изображения для поиска дубликатов
        """
        try:
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            
            # MD5 для точных дубликатов
            md5_hash = hashlib.md5(image_data).hexdigest()
            
            # Perceptual hash для похожих изображений
            phash = str(imagehash.phash(image))
            
            # Difference hash
            dhash = str(imagehash.dhash(image))
            
            return {
                'md5': md5_hash,
                'phash': phash,
                'dhash': dhash
            }
        except Exception as e:
            return {'error': str(e)}

    async def find_duplicates(self, image_data: bytes, radius_km: float, db_session) -> List[Dict]:
        """
        Ищет похожие проблемы рядом
        """
        hashes = self.calculate_image_hash(image_data)
        
        # Ищем проблемы с похожими хэшами в радиусе
        # TODO: реализовать запрос к БД с geo-поиском
        
        return []  # Список похожих проблем

# Создаем глобальный экземпляр
ai_service = CityFixAIService()