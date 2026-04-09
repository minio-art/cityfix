FROM python:3.11-slim

WORKDIR /app

# Устанавливаем зависимости системы для torch
RUN apt-get update && apt-get install -y \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements.txt
COPY backend/requirements.txt .

# Устанавливаем torch из специального индекса (CPU версия, легче)
RUN pip install --no-cache-dir torch==2.1.0 --index-url https://download.pytorch.org/whl/cpu

# Устанавливаем остальные зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь код бэкенда
COPY backend/ .

# Создаем папки
RUN mkdir -p uploads models

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]