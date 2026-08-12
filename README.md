# HH Goa 2026 Frame ID Generator — Django Backend

Django backend for generating branded Builder ID Cards from an uploaded photo,
name, and role.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at `http://localhost:8000`.

## Before generating cards

1. Add the template PNG at `assets/template.png`.
2. Optionally add `assets/fonts/Inter-Regular.ttf` and `assets/fonts/Inter-Bold.ttf`.
3. Update `cards/config.py` with the final photo slot and text coordinates.

## API

### `POST /api/generate`

Send `multipart/form-data` with:

- `photo`: JPG, PNG, HEIC, or HEIF, up to 8MB
- `name`: required, up to 40 characters
- `role`: required, up to 60 characters

Returns:

```json
{"imageUrl":"https://your-domain/api/card/<shareId>/image","shareId":"<shareId>"}
```

### `GET /api/card/<shareId>`

Returns an HTML page containing Open Graph and X/Twitter Card metadata pointing
to the generated image.

### `GET /api/card/<shareId>/image`

Serves the generated PNG directly.

### `GET /health/`

Returns `{ "status": "ok" }`.

## Configuration

- `PUBLIC_BASE_URL`: public URL used in share links and metadata
- `TEMPLATE_PATH`: template PNG path
- `OUTPUT_DIR`: generated image directory
- `DB_PATH`: SQLite database path
- `DJANGO_SECRET_KEY`: production Django secret
- `DJANGO_DEBUG`: set to `False` in production

## Fixes applied in this pass

- Django's default upload limit (2.5MB) was rejecting files below the stated
  8MB max — `DATA_UPLOAD_MAX_MEMORY_SIZE`/`FILE_UPLOAD_MAX_MEMORY_SIZE` are now
  set to `MAX_FILE_SIZE_MB + 2`.
- Added `django-cors-headers` so a frontend on a different domain (e.g.
  Vercel) can call this API. Set `CORS_ALLOWED_ORIGINS` (comma-separated) in
  production.
- `frameid/urls.py` no longer mounts the full API under `/health/` as a
  side effect — `/health/` now points directly at the health view.
- Added a real image check (`Image.verify()`) before processing, so a file
  with a spoofed extension/content-type is rejected with a clean 400 instead
  of crashing later or being processed as something it isn't.
- Added `Image.MAX_IMAGE_PIXELS` cap to guard against decompression-bomb
  style uploads (tiny file, huge decoded resolution).
- Added `assets/` folder structure and `.env.example` so the required files
  are obvious.

**Still needed from teammates:** `assets/template.png` from Vikram (with
final slot coordinates for `cards/config.py`), and confirmation of the exact
field names Akshay's frontend sends to `/api/generate`.

**Note on Render's free tier:** its disk is not persistent — generated
images and the SQLite DB are wiped on every redeploy/restart. Fine for a
demo, but don't redeploy mid-demo or old share links will 404.

## Deploy to Render

The included `render.yaml` installs dependencies, runs migrations, and starts
Gunicorn. Add the template and font assets to the repository, then set
`PUBLIC_BASE_URL` to the deployed service URL.
