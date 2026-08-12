import html
import secrets
from pathlib import Path

from django.conf import settings


def generate_share_id() -> str:
    return secrets.token_urlsafe(12).replace("-", "").replace("_", "")[:16]


def validate_upload(upload: object, name: str, role: str, team_name: str) -> list[str]:
    errors: list[str] = []

    if upload is None:
        errors.append("A photo file is required.")
    else:
        file_name = getattr(upload, "name", "")
        content_type = getattr(upload, "content_type", "") or ""
        extension = Path(file_name).suffix.lower()
        allowed_types = {"image/jpeg", "image/png", "image/heic", "image/heif"}
        if extension not in settings.ALLOWED_EXTENSIONS and content_type not in allowed_types:
            errors.append("Unsupported file type. Allowed: JPG, PNG, HEIC, or HEIF.")
        if getattr(upload, "size", 0) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
            errors.append(f"File exceeds the {settings.MAX_FILE_SIZE_MB}MB limit.")

    if not name:
        errors.append("Name is required.")
    elif len(name) > settings.MAX_NAME_LENGTH:
        errors.append(f"Name must be {settings.MAX_NAME_LENGTH} characters or fewer.")

    if not role:
        errors.append("Role is required.")
    elif len(role) > settings.MAX_ROLE_LENGTH:
        errors.append(f"Role must be {settings.MAX_ROLE_LENGTH} characters or fewer.")

    if len(team_name) > settings.MAX_TEAM_NAME_LENGTH:
        errors.append(f"Team name must be {settings.MAX_TEAM_NAME_LENGTH} characters or fewer.")

    return errors


def escape_html(value: str) -> str:
    return html.escape(value, quote=True)
