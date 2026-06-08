import io
import os
import hashlib
from PIL import Image, ImageStat
import numpy as np
import imagehash

class CityFixAIModel:
    def __init__(self):
        print("Initializing simplified AI model...")
        
        # Категории проблем
        self.categories = ['roads', 'light', 'water', 'trash', 'graffiti', 'buildings', 'trees', 'other']
        
        # Ключевые слова для определения категорий
        self.category_keywords = {
            'roads': ['яма', 'трещина', 'дорога', 'асфальт', 'разбитая', 'road', 'pothole', 'crack'],
            'light': ['фонарь', 'освещение', 'свет', 'ламп', 'light', 'lamp', 'streetlight'],
            'water': ['вода', 'труба', 'протечка', 'потоп', 'водоснабжение', 'water', 'pipe', 'leak'],
            'trash': ['мусор', 'свалка', 'отходы', 'баки', 'trash', 'garbage', 'waste', 'dump'],
            'graffiti': ['граффити', 'надпись', 'разрисован', 'graffiti', 'tag', 'spray'],
            'buildings': ['здание', 'фасад', 'крыша', 'дом', 'building', 'facade', 'roof'],
            'trees': ['дерево', 'ветка', 'парк', 'газон', 'tree', 'branch', 'park', 'lawn'],
            'other': ['другое', 'other']
        }
    
    def extract_image_features(self, image):
        """Извлекает простые признаки изображения"""
        stat = ImageStat.Stat(image)
        
        r_mean, g_mean, b_mean = stat.mean[:3]
        brightness = (r_mean + g_mean + b_mean) / 3 / 255
        
        return {
            'brightness': brightness,
            'r_mean': r_mean / 255,
            'g_mean': g_mean / 255,
            'b_mean': b_mean / 255,
            'avg_color': 'green' if g_mean > r_mean and g_mean > b_mean else 
                        'blue' if b_mean > r_mean and b_mean > g_mean else 
                        'gray' if brightness < 0.3 else 'other'
        }
    
    def predict_by_text(self, title, description):
        """Предсказание на основе текстового описания"""
        text = (title + " " + description).lower()
        
        scores = {cat: 0 for cat in self.categories}
        
        for category, keywords in self.category_keywords.items():
            for keyword in keywords:
                if keyword.lower() in text:
                    scores[category] += 1
        
        total = sum(scores.values())
        if total > 0:
            best_category = max(scores, key=scores.get)
            confidence = min(0.9, scores[best_category] / total)
        else:
            best_category = 'other'
            confidence = 0.5
        
        return best_category, confidence
    
    def predict_by_image(self, image_bytes):
        """Предсказание на основе изображения"""
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            phash = str(imagehash.phash(image))
            features = self.extract_image_features(image)
            
            if features['avg_color'] == 'green':
                primary_category = 'trees'
                confidence = 0.6
            elif features['avg_color'] == 'blue':
                primary_category = 'water'
                confidence = 0.5
            elif features['avg_color'] == 'gray' or features['brightness'] < 0.3:
                primary_category = 'roads'
                confidence = 0.5
            else:
                primary_category = 'other'
                confidence = 0.4
            
            return {
                'primary_category': primary_category,
                'confidence': confidence,
                'phash': phash
            }
        except Exception as e:
            print(f"Error in image analysis: {e}")
            return {
                'primary_category': 'other',
                'confidence': 0.5,
                'phash': ''
            }
    
    def predict(self, image_bytes=None, title="", description=""):
        """Комбинированное предсказание"""
        results = []
        
        if title or description:
            text_category, text_confidence = self.predict_by_text(title, description)
            results.append({'source': 'text', 'category': text_category, 'confidence': text_confidence})
        
        if image_bytes:
            image_result = self.predict_by_image(image_bytes)
            results.append({'source': 'image', 'category': image_result['primary_category'], 
                          'confidence': image_result['confidence'], 'phash': image_result['phash']})
        
        if len(results) == 2:
            combined_scores = {}
            for cat in self.categories:
                text_score = next((r['confidence'] for r in results if r['source'] == 'text' and r['category'] == cat), 0)
                image_score = next((r['confidence'] for r in results if r['source'] == 'image' and r['category'] == cat), 0)
                combined_scores[cat] = text_score * 0.7 + image_score * 0.3
            best_category = max(combined_scores, key=combined_scores.get)
            best_confidence = combined_scores[best_category]
        elif len(results) == 1:
            best_category = results[0]['category']
            best_confidence = results[0]['confidence']
        else:
            best_category = 'other'
            best_confidence = 0.5
        
        all_predictions = [
            {'category': best_category, 'confidence': best_confidence},
            {'category': 'other', 'confidence': max(0.1, 1 - best_confidence)},
            {'category': 'roads', 'confidence': 0.1}
        ]
        
        return {
            'predictions': all_predictions[:3],
            'top_category': best_category,
            'top_confidence': best_confidence,
            'phash': results[0].get('phash', '') if results else ''
        }

model = CityFixAIModel()

def get_model():
    return model