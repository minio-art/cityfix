from google_images_search import GoogleImagesSearch
import os
import time

# Настройки (получи API ключ на https://developers.google.com/custom-search/v1/introduction)
GCS_DEVELOPER_KEY = "твой_API_ключ"
GCS_CX = "твой_search_engine_ID"

gis = GoogleImagesSearch(GCS_DEVELOPER_KEY, GCS_CX)

# Категории и поисковые запросы
searches = {
    'roads': ['pothole street', 'road crack', 'asphalt damage'],
    'light': ['broken street light', 'street lamp broken'],
    'trash': ['garbage dump street', 'overflowing trash can'],
    'graffiti': ['wall graffiti', 'vandalism graffiti'],
    'water': ['water leak street', 'broken pipe water'],
}

for category, queries in searches.items():
    for query in queries:
        # Поиск и скачивание
        _search_params = {
            'q': query,
            'num': 50,  # 50 фото на запрос
            'safe': 'off',
            'fileType': 'jpg|png',
        }
        
        gis.search(search_params=_search_params)
        
        # Сохраняем в папку
        for image in gis.results():
            image.download(f'training_data/{category}/')
            time.sleep(1)  # пауза чтобы не забанили