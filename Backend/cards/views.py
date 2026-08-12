import json
import secrets
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image

from .image_processor import _create_share_image, generate_card_image
from .models import Card
from .title_generator import generate_title
from .utils import escape_html, validate_upload


def health(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"status": "ok"})


@csrf_exempt
def generate_card(request: HttpRequest) -> JsonResponse:
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed."}, status=405)

    upload = request.FILES.get("photo")
    name = request.POST.get("name", "").strip()
    role = request.POST.get("role", "").strip()
    team_name = request.POST.get("teamName", "").strip()
    errors = validate_upload(upload, name, role, team_name)
    if errors:
        return JsonResponse({"errors": errors}, status=400)

    try:
        title = generate_title(role, name)
        letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
        builder_id = (
            f"{secrets.choice(letters)}{secrets.choice('0123456789')}"
            f"{secrets.choice(letters)}{secrets.choice('0123456789')}"
            f"{secrets.choice(letters)}"
        )
        image_path, share_id, back_image_path = generate_card_image(upload, name, role, title, builder_id, team_name)
        Card.objects.create(
            share_id=share_id,
            image_path=image_path,
            name=name,
            role=role,
            title=title,
        )
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)
    except Exception as error:
        detail = str(error) if settings.DEBUG else None
        payload = {"error": "Failed to generate card. Please try again."}
        if detail:
            payload["detail"] = detail
        return JsonResponse(payload, status=500)

    image_url = f"{settings.PUBLIC_BASE_URL}/api/card/{share_id}/image"
    back_image_url = f"{settings.PUBLIC_BASE_URL}/api/card/{share_id}/back-image"
    return JsonResponse({"imageUrl": image_url, "backImageUrl": back_image_url, "shareId": share_id})


def card_page(request: HttpRequest, share_id: str) -> HttpResponse:
    try:
        card = Card.objects.get(share_id=share_id)
    except Card.DoesNotExist:
        return HttpResponse("Card not found.", status=404)

    image_url = f"{settings.PUBLIC_BASE_URL}/api/card/{card.share_id}/image"
    share_image_url = f"{settings.PUBLIC_BASE_URL}/api/card/{card.share_id}/share-image"
    page_url = f"{settings.PUBLIC_BASE_URL}/api/card/{card.share_id}"
    title = f"{escape_html(card.name)} — {escape_html(card.title)}"
    description = (
        f"{escape_html(card.name)} is attending HH Goa 2026 as a "
        f"{escape_html(card.role)}."
    )
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta property="og:type" content="article"><meta property="og:title" content="{title}">
<meta property="og:description" content="{description}"><meta property="og:image" content="{share_image_url}">
<meta property="og:image:secure_url" content="{share_image_url}"><meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="2000"><meta property="og:image:height" content="1000">
<meta property="og:url" content="{page_url}"><meta property="og:site_name" content="HH Goa 2026 Frame ID">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}"><meta name="twitter:image" content="{share_image_url}">
</head>
<body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0d0d0d;font-family:system-ui,sans-serif">
<img src="{image_url}" alt="{title}" style="max-width:90vw;max-height:90vh">
</body></html>"""
    return HttpResponse(html, content_type="text/html")


def card_image(request: HttpRequest, share_id: str) -> HttpResponse:
    try:
        card = Card.objects.get(share_id=share_id)
    except Card.DoesNotExist:
        return HttpResponse("Card not found.", status=404)

    image_path = Path(card.image_path)
    if not image_path.exists():
        return HttpResponse("Image file not found.", status=404)
    content_type = "image/jpeg" if image_path.suffix.lower() in {".jpg", ".jpeg"} else "image/png"
    return FileResponse(image_path.open("rb"), content_type=content_type)


def card_back_image(request: HttpRequest, share_id: str) -> HttpResponse:
    try:
        card = Card.objects.get(share_id=share_id)
    except Card.DoesNotExist:
        return HttpResponse("Card not found.", status=404)
    back_path = Path(card.image_path).with_name(f"{share_id}-back{Path(card.image_path).suffix}")
    if not back_path.exists():
        return HttpResponse("Back image file not found.", status=404)
    content_type = "image/jpeg" if back_path.suffix.lower() in {".jpg", ".jpeg"} else "image/png"
    return FileResponse(back_path.open("rb"), content_type=content_type)


def card_share_image(request: HttpRequest, share_id: str) -> HttpResponse:
    try:
        card = Card.objects.get(share_id=share_id)
    except Card.DoesNotExist:
        return HttpResponse("Card not found.", status=404)

    share_path = Path(card.image_path).with_name(f"{share_id}-share{Path(card.image_path).suffix}")
    if not share_path.exists():
        image_path = Path(card.image_path)
        back_path = image_path.with_name(f"{share_id}-back{image_path.suffix}")
        if not image_path.exists() or not back_path.exists():
            return HttpResponse("Share image not found.", status=404)
        with Image.open(image_path).convert("RGBA") as front, Image.open(back_path).convert("RGBA") as back:
            _create_share_image(front, back, share_path)
    content_type = "image/jpeg" if share_path.suffix.lower() in {".jpg", ".jpeg"} else "image/png"
    return FileResponse(share_path.open("rb"), content_type=content_type)
