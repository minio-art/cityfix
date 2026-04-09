# download_dataset_bing.py
from icrawler.builtin import BingImageCrawler
import os
import time

# Создаем папки
for category in ['roads', 'light', 'trash', 'graffiti', 'water']:
    os.makedirs(f'training_data/{category}', exist_ok=True)

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
        
        crawler = BingImageCrawler(
            storage={'root_dir': f'training_data/{category}'},
            downloader_threads=4
        )
        
        crawler.crawl(
            keyword=query,
            max_num=50,
            filters={
                'size': 'medium',
                'type': 'photo',
            }
        )
        
        time.sleep(3)

print(f"\n✅ Скачивание завершено!")