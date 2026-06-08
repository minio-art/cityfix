from pathlib import Path
from babel.support import Translations
from fastapi import Request
import gettext

# Создаем переводчики для каждого языка
translations = {
    'ru': Translations.load(Path('locales'), 'ru'),
    'kk': Translations.load(Path('locales'), 'kk')
}

def get_translation(locale: str):
    """Получить функцию перевода для указанной локали"""
    return translations.get(locale, translations['ru']).gettext

def translate_string(locale: str, text: str, **kwargs):
    """Перевести строку с подстановкой параметров"""
    _ = get_translation(locale)
    translated = _(text)
    if kwargs:
        translated = translated.format(**kwargs)
    return translated