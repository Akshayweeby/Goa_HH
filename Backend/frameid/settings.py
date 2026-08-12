"""
Django settings for HH Goa 2026 Frame ID Generator.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY", "dev-insecure-key-change-in-production"
)

DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "corsheaders",
    "cards",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

# CORS: allow the frontend (Vercel, local dev, etc.) to call this API.
# Set CORS_ALLOWED_ORIGINS env var as a comma-separated list in production,
# e.g. "https://your-frontend.vercel.app,http://localhost:5173"
_cors_origins = os.environ.get("CORS_ALLOWED_ORIGINS", "")
if _cors_origins:
    CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors_origins.split(",") if o.strip()]
else:
    # Fallback for local development only.
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

ROOT_URLCONF = "frameid.urls"

WSGI_APPLICATION = "frameid.wsgi.application"

DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.environ.get("DB_PATH", str(DATA_DIR / "db.sqlite3")),
    }
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Frame ID config
PUBLIC_BASE_URL = os.environ.get(
    "PUBLIC_BASE_URL", "http://localhost:8000"
)

TEMPLATE_PATH = os.environ.get("TEMPLATE_PATH", str(BASE_DIR / "assets" / "front_template.png"))
BACK_TEMPLATE_PATH = os.environ.get("BACK_TEMPLATE_PATH", str(BASE_DIR / "assets" / "back_template.png"))

OUTPUT_DIR = os.environ.get("OUTPUT_DIR", str(BASE_DIR / "output"))

FONT_REGULAR = os.environ.get("FONT_REGULAR", str(BASE_DIR / "assets" / "fonts" / "Aldrich-Regular.ttf"))
FONT_BOLD = os.environ.get("FONT_BOLD", str(BASE_DIR / "assets" / "fonts" / "Aldrich-Regular.ttf"))

MAX_FILE_SIZE_MB = 8
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".heic", ".heif"]
MAX_NAME_LENGTH = 30
MAX_ROLE_LENGTH = 30
MAX_TEAM_NAME_LENGTH = 15

# Django rejects uploads above this BEFORE our own MAX_FILE_SIZE_MB check runs,
# so it must be set higher than MAX_FILE_SIZE_MB or valid uploads get silently 400'd.
DATA_UPLOAD_MAX_MEMORY_SIZE = (MAX_FILE_SIZE_MB + 2) * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = (MAX_FILE_SIZE_MB + 2) * 1024 * 1024

# Guards against decompression-bomb style uploads (huge pixel dimensions in a
# small file). A 1080x1080 output card never needs a source bigger than this.
MAX_IMAGE_PIXELS = 40_000_000  # ~40 megapixels
