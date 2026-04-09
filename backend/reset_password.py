from database import SessionLocal
from backend.models import User
from auth import get_password_hash

db = SessionLocal()

# Обновляем пароль для admin
user = db.query(User).filter(User.username == "admin").first()
if user:
    user.password_hash = get_password_hash("admin123")
    db.commit()
    print(f"✅ Пароль для {user.username} обновлен!")
else:
    # Создаем нового админа
    new_admin = User(
        email="admin@cityfix.kz",
        username="admin",
        name="Администратор",
        phone="+77770000000",
        password_hash=get_password_hash("admin123"),
        role="admin",
        is_active=True
    )
    db.add(new_admin)
    db.commit()
    print(f"✅ Создан новый администратор: {new_admin.username}")

# Проверяем всех админов
admins = db.query(User).filter(User.role == "admin").all()
print("\n📋 Список администраторов:")
for a in admins:
    print(f"  - {a.username} ({a.email})")

db.close()