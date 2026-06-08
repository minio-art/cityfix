from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

class LanguageMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Определяем язык из заголовков или параметров
        accept_language = request.headers.get("Accept-Language", "ru")
        
        # Поддерживаемые языки
        supported_languages = ["ru", "kk"]
        
        # Получаем предпочтительный язык
        lang = accept_language.split(",")[0].split("-")[0]
        
        if lang not in supported_languages:
            lang = "ru"
        
        # Сохраняем язык в request state
        request.state.language = lang
        
        # Добавляем язык в заголовки ответа
        response = await call_next(request)
        response.headers["Content-Language"] = lang
        
        return response