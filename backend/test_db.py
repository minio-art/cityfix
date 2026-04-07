from database import engine, Base
from backend.models import Issue, Cluster

try:
    # Попробуй создать таблицы
    Base.metadata.create_all(bind=engine)
    print("✅ База данных подключена и таблицы созданы!")
    print("📊 Таблицы: issues, clusters")
    
    # Проверка соединения
    with engine.connect() as conn:
        print("✅ Соединение с БД активно")
        
except Exception as e:
    print(f"❌ Ошибка: {e}")
    