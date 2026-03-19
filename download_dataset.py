from google_images_search import GoogleImagesSearch
import os
import time

# ТВОИ КЛЮЧИ (вставь сюда)
GCS_DEVELOPER_KEY = "AIzaSyDFtOxd4XNJ6RecvELFNh_8E-1JG387EL0"  # вставь свой API ключ
GCS_CX = "b7fa2184d5d3e4a88"  # вставь свой CX

# Создаем папки
for category in ['roads', 'light', 'trash', 'graffiti', 'water']:
    os.makedirs(f'training_data/{category}', exist_ok=True)

gis = GoogleImagesSearch(GCS_DEVELOPER_KEY, GCS_CX)

# Категории и поисковые запросы
searches = {
    'roads': ['pothole street', 'road crack', 'asphalt damage', 'broken road'],
    'light': ['broken street light', 'street lamp broken', 'damaged street light'],
    'trash': ['garbage dump street', 'overflowing trash can', 'illegal dumping'],
    'graffiti': ['wall graffiti', 'vandalism graffiti', 'street graffiti'],
    'water': ['water leak street', 'broken pipe water', 'flooded street'],
}

total_downloaded = 0

for category, queries in searches.items():
    print(f"\n📁 Скачиваем для категории: {category}")
    
    for query in queries:
        print(f"  🔍 Поиск: {query}")
        
        _search_params = {
            'q': query,
            'num': 50,
            'safe': 'off',
            'fileType': 'jpg|png',
            'imgSize': 'medium',  # можно medium, large, icon
        }
        
        try:
            gis.search(search_params=_search_params)
            
            for idx, image in enumerate(gis.results()):
                # Уникальное имя файла
                filename = f"{category}_{int(time.time())}_{idx}.jpg"
                image.download(f'training_data/{category}/', filename)
                total_downloaded += 1
                print(f"    ✓ Скачано: {filename}")
                
                time.sleep(0.5)  # пауза между фото
                
        except Exception as e:
            print(f"    ❌ Ошибка для запроса '{query}': {e}")
        
        time.sleep(2)  # пауза между запросами

print(f"\n✅ Всего скачано: {total_downloaded} фото")