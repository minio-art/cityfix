import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import os
import numpy as np
import imagehash

class CityFixAIModel:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")
        
        # Категории проблем
        self.categories = ['roads', 'light', 'water', 'trash', 'graffiti', 'buildings', 'trees', 'other']
        self.num_classes = len(self.categories)
        
        # Используем ResNet50 (более мощная модель)
        self.model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
        
        # Заменяем последний слой
        self.model.fc = nn.Linear(self.model.fc.in_features, self.num_classes)
        
        self.model = self.model.to(self.device)
        self.model.eval()
        
        # Трансформации для изображений
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        # Загружаем веса, если есть
        model_path = os.path.join(os.path.dirname(__file__), "models", "cityfix_model.pth")
        if os.path.exists(model_path):
            print(f"Loading model from {model_path}")
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            print("Model loaded successfully!")
        else:
            print("No pre-trained model found. Using default ResNet50.")
    
    def predict(self, image_bytes):
        """
        Предсказывает категорию изображения
        Возвращает топ-3 категории с уверенностью
        """
        try:
            # Открываем изображение
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            
            # Вычисляем хэш для проверки дубликатов
            phash = str(imagehash.phash(image))
            
            # Преобразуем для модели
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Получаем предсказания
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            
            # Получаем топ-3 предсказания
            top3_prob, top3_idx = torch.topk(probabilities, 3)
            
            results = []
            for i in range(3):
                results.append({
                    'category': self.categories[top3_idx[i]],
                    'confidence': float(top3_prob[i])
                })
            
            return {
                'predictions': results,
                'phash': phash,
                'top_category': results[0]['category'],
                'top_confidence': results[0]['confidence']
            }
            
        except Exception as e:
            print(f"Error in prediction: {e}")
            return {
                'predictions': [{'category': 'other', 'confidence': 1.0}],
                'phash': '',
                'top_category': 'other',
                'top_confidence': 1.0
            }
    
    def predict_batch(self, image_bytes_list):
        """Предсказание для нескольких изображений"""
        results = []
        for image_bytes in image_bytes_list:
            results.append(self.predict(image_bytes))
        return results