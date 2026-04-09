import psycopg2
from sqlalchemy import create_engine, text

# Тест 1: прямое подключение через psycopg2
try:
    conn = psycopg2.connect(
        host="127.0.0.1",
        port=5432,
        database="cityfix",
        user="postgres",
        password="postgres"
    )
    print("✅ psycopg2: Подключение успешно!")
    conn.close()
except Exception as e:
    print(f"❌ psycopg2: Ошибка: {e}")

# Тест 2: подключение через SQLAlchemy
try:
    engine = create_engine("postgresql://postgres:postgres@127.0.0.1:5432/cityfix")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ SQLAlchemy: Подключение успешно!")
except Exception as e:
    print(f"❌ SQLAlchemy: Ошибка: {e}")