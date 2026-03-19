import requests

url = "http://localhost:8000/api/issues"

data = {
    "title": "Тестовая яма на дороге",
    "description": "Большая яма на дороге",
    "category": "roads",
    "district": "Алматы",
    "latitude": 43.2389,
    "longitude": 76.8897,
    "address": "ул. Абая, Алматы",
    "user_id": "1"  # ИСПРАВЛЕНО: используем существующего пользователя
}

response = requests.post(url, data=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")