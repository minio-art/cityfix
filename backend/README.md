# CityFix Backend

Python FastAPI бэкенд для CityFix.

## Запуск

```bash
cd backend
python -m venv venv
source venv/bin/activate  # на Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000