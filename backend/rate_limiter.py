from fastapi import HTTPException, Request
from functools import wraps
import time
from collections import defaultdict

# Хранилище для лимитов (в памяти)
# В продакшене используй Redis!
rate_limits = defaultdict(list)

def rate_limit(limit: int = 5, window: int = 3600):
    """
    rate_limit(limit=5, window=3600) - 5 запросов в час
    limit: количество запросов
    window: временное окно в секундах
    """
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            # Ищем request в аргументах
            request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            
            if not request:
                request = kwargs.get('request')
            
            if request:
                # Получаем IP или user_id
                client_id = request.client.host if request.client else "unknown"
                
                # Если есть user (из аутентификации), используем его ID
                if hasattr(request.state, 'user') and request.state.user:
                    client_id = f"user_{request.state.user.id}"
                
                # Получаем текущее время
                now = time.time()
                
                # Очищаем старые записи
                rate_limits[client_id] = [
                    t for t in rate_limits[client_id] 
                    if now - t < window
                ]
                
                # Проверяем лимит
                if len(rate_limits[client_id]) >= limit:
                    raise HTTPException(
                        status_code=429,
                        detail=f"Too many requests. Limit: {limit} per {window // 60} minutes"
                    )
                
                # Добавляем текущий запрос
                rate_limits[client_id].append(now)
            
            return await func(*args, **kwargs)
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            # Ищем request в аргументах
            request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            
            if not request:
                request = kwargs.get('request')
            
            if request:
                # Получаем IP или user_id
                client_id = request.client.host if request.client else "unknown"
                
                # Если есть user (из аутентификации), используем его ID
                if hasattr(request.state, 'user') and request.state.user:
                    client_id = f"user_{request.state.user.id}"
                
                # Получаем текущее время
                now = time.time()
                
                # Очищаем старые записи
                rate_limits[client_id] = [
                    t for t in rate_limits[client_id] 
                    if now - t < window
                ]
                
                # Проверяем лимит
                if len(rate_limits[client_id]) >= limit:
                    raise HTTPException(
                        status_code=429,
                        detail=f"Too many requests. Limit: {limit} per {window // 60} minutes"
                    )
                
                # Добавляем текущий запрос
                rate_limits[client_id].append(now)
            
            return func(*args, **kwargs)
        
        # Определяем, является ли функция асинхронной
        import inspect
        if inspect.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    return decorator