# ai_model.py - Оптимизированная версия для Render Free Tier

import os
import io
from PIL import Image
import imagehash
import numpy as np

# TensorFlow Lite будет использоваться вместо PyTorch
try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
    print("TensorFlow Lite mode enabled")
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("Running in lightweight mode without ML libraries")

class CityFixAIModel:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CityFixAIModel, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        self.device = "cpu"
        self.categories = ['roads', 'light', 'water', 'trash', 'graffiti', 'buildings', 'trees', 'other']
        self.num_classes = len(self.categories)
        
        # Пытаемся загрузить TensorFlow Lite модель (легковесная)
        self.model = None
        self.use_tflite = False
        
        if TENSORFLOW_AVAILABLE:
            model_path = os.path.join(os.path.dirname(__file__), "models", "cityfix_model.tflite")
            if os.path.exists(model_path):
                try:
                    self.interpreter = tf.lite.Interpreter(model_path=model_path)
                    self.interpreter.allocate_tensors()
                    self.use_tflite = True
                    print("TensorFlow Lite model loaded successfully!")
                except Exception as e:
                    print(f"Failed to load TFLite model: {e}")
        
        if not self.use_tflite:
            print("Running in rule-based mode (no ML model loaded)")
        
        self._initialized = True
    
    def _simple_classifier(self, image):
        """Простые правила для классификации без ML модели"""
        # Конвертируем в numpy для анализа
        img_array = np.array(image)
        
        # Проверяем средние значения цветов для базовой классификации
        mean_r = np.mean(img_array[:, :, 0])
        mean_g = np.mean(img_array[:, :, 1])
        mean_b = np.mean(img_array[:, :, 2])
        
        # Определяем категорию на основе цветов
        if mean_g > mean_r and mean_g > mean_b and mean_g > 100:
            return 'trees'  # Зеленый → деревья
        elif mean_b > mean_r and mean_b > mean_g and mean_b > 100:
            return 'water'   # Синий → вода
        elif mean_r > mean_g and mean_r > mean_b and mean_r > 120:
            return 'trash'   # Красноватый → мусор
        elif np.std(img_array) < 30:
            return 'roads'   # Низкая вариативность → дороги
        else:
            return 'other'
    
    def predict(self, image_bytes):
        """
        Предсказывает категорию изображения
        Использует TFLite если доступен, иначе простые правила
        """
        try:
            # Открываем изображение
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            
            # Вычисляем хэш для проверки дубликатов
            phash = str(imagehash.phash(image))
            
            # Если используем TensorFlow Lite
            if self.use_tflite:
                # Ресайзим изображение до нужного размера (например, 224x224)
                image_resized = image.resize((224, 224))
                input_data = np.array(image_resized, dtype=np.float32)
                input_data = (input_data / 127.5) - 1.0  # Нормализация
                input_data = np.expand_dims(input_data, axis=0)
                
                # Запускаем инференс
                input_details = self.interpreter.get_input_details()
                output_details = self.interpreter.get_output_details()
                
                self.interpreter.set_tensor(input_details[0]['index'], input_data)
                self.interpreter.invoke()
                
                predictions = self.interpreter.get_tensor(output_details[0]['index'])[0]
                
                # Получаем топ-3
                top3_idx = np.argsort(predictions)[-3:][::-1]
                top3_prob = predictions[top3_idx]
                
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
            
            else:
                # Режим без ML - используем простые правила
                top_category = self._simple_classifier(image)
                return {
                    'predictions': [
                        {'category': top_category, 'confidence': 0.6},
                        {'category': 'other', 'confidence': 0.2},
                        {'category': 'roads', 'confidence': 0.2}
                    ],
                    'phash': phash,
                    'top_category': top_category,
                    'top_confidence': 0.6
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