from database import engine, Base
from models import User, Issue, Cluster

print("=" * 50)
print("Создание таблиц CityFix...")
print("=" * 50)

try:
    # Создаем все таблицы
    Base.metadata.create_all(bind=engine)
    print("✅ Таблицы успешно созданы!")
    print("\nСписок таблиц:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")
        
except Exception as e:
    print(f"❌ Ошибка при создании таблиц: {e}")

print("=" * 50)