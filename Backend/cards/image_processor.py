from pathlib import Path

from django.conf import settings
from PIL import Image, ImageDraw, ImageFont, ImageOps
from pillow_heif import register_heif_opener

from .config import TEMPLATE_SLOTS, TEXT_FIELDS
from .utils import generate_share_id

register_heif_opener()

# Cap decoded pixel count so a small file can't claim a huge resolution and
# blow up memory/CPU during processing (classic "decompression bomb").
Image.MAX_IMAGE_PIXELS = getattr(settings, "MAX_IMAGE_PIXELS", 40_000_000)


def _verify_real_image(uploaded_file: object) -> None:
    """Confirm the upload is actually a decodable image, not just a file
    with a spoofed extension/content-type. Raises ValueError if invalid."""
    uploaded_file.seek(0)
    try:
        with Image.open(uploaded_file) as probe:
            probe.verify()
    except Exception as exc:
        raise ValueError("Uploaded file is not a valid image.") from exc
    finally:
        uploaded_file.seek(0)


def _font(field: dict, size: int | None = None) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    font_path = settings.FONT_BOLD if field.get("font_weight") == "bold" else settings.FONT_REGULAR
    if not Path(font_path).exists():
        font_path = "C:/Windows/Fonts/arialbd.ttf" if field.get("font_weight") == "bold" else "C:/Windows/Fonts/arial.ttf"
    if Path(font_path).exists():
        return ImageFont.truetype(font_path, size or field["font_size"])
    return ImageFont.load_default()


def _fit_text(draw: ImageDraw.ImageDraw, text: str, field: dict) -> tuple[str, ImageFont.FreeTypeFont | ImageFont.ImageFont]:
    """Use the largest readable one-line font that fits a card field."""
    max_size = field["font_size"]
    min_size = field.get("min_font_size", 14)

    for size in range(max_size, min_size - 1, -1):
        font = _font(field, size)
        if draw.textlength(text, font=font) <= field["width"]:
            return text, font

    font = _font(field, min_size)
    suffix = "..."
    truncated = text
    while truncated and draw.textlength(f"{truncated}{suffix}", font=font) > field["width"]:
        truncated = truncated[:-1]
    return f"{truncated}{suffix}" if truncated != text else text, font


def _draw_fitted_text(draw: ImageDraw.ImageDraw, text: str, field: dict) -> None:
    if not text:
        return

    value, font = _fit_text(draw, text.upper(), field)
    bounds = draw.textbbox((0, 0), value, font=font)
    text_width = bounds[2] - bounds[0]
    text_height = bounds[3] - bounds[1]
    x = field["x"] + (field["width"] - text_width) / 2 - bounds[0]
    y = field["y"] + (field["height"] - text_height) / 2 - bounds[1]
    draw.text((x, y), value, font=font, fill=field["color"])


def _create_share_image(front: Image.Image, back: Image.Image, output_path: Path) -> None:
    """Create a 2:1 social preview that shows both sides of the Builder ID."""
    canvas = Image.new("RGBA", (2000, 1000), "#031b25")
    card_size = (940, 588)
    front_preview = ImageOps.contain(front, card_size, method=Image.Resampling.LANCZOS)
    back_preview = ImageOps.contain(back, card_size, method=Image.Resampling.LANCZOS)

    for image, x in ((front_preview, 40), (back_preview, 1020)):
        y = (canvas.height - image.height) // 2
        canvas.alpha_composite(image, (x, y))

    if output_path.suffix.lower() == ".png":
        canvas.save(output_path, format="PNG", compress_level=1)
    else:
        canvas.convert("RGB").save(output_path, format="JPEG", quality=88, optimize=True, progressive=True)


def generate_card_image(uploaded_file: object, name: str, role: str, title: str, builder_id: str = "", team_name: str = "") -> tuple[str, str, str]:
    template_path = Path(settings.TEMPLATE_PATH)
    if not template_path.exists():
        raise FileNotFoundError(f"Template not found at {template_path}")

    _verify_real_image(uploaded_file)
    source = Image.open(uploaded_file)
    if source.format in {"HEIC", "HEIF"}:
        source = source.convert("RGB")
    else:
        source.load()

    template = Image.open(template_path).convert("RGBA")
    slot = TEMPLATE_SLOTS["photo"]
    photo = ImageOps.fit(
        source.convert("RGB"),
        (slot["width"], slot["height"]),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    ).convert("RGBA")
    if slot.get("shape") == "diamond":
        mask = Image.new("L", photo.size, 0)
        ImageDraw.Draw(mask).polygon([(photo.width // 2, 0), (photo.width - 1, photo.height // 2), (photo.width // 2, photo.height - 1), (0, photo.height // 2)], fill=255)
        photo.putalpha(mask)
    template.alpha_composite(photo, (slot["x"], slot["y"]))

    draw = ImageDraw.Draw(template)
    _draw_fitted_text(draw, name, TEXT_FIELDS["name"])
    _draw_fitted_text(draw, builder_id, TEXT_FIELDS["builder_id"])
    _draw_fitted_text(draw, role, TEXT_FIELDS["role"])
    _draw_fitted_text(draw, team_name, TEXT_FIELDS["team_name"])

    share_id = generate_share_id()
    output_dir = Path(settings.OUTPUT_DIR)
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{share_id}.jpg"
    template.convert("RGB").save(output_path, format="JPEG", quality=90, optimize=True, progressive=True)
    back = Image.open(settings.BACK_TEMPLATE_PATH).convert("RGBA")
    back_path = output_dir / f"{share_id}-back.jpg"
    back.convert("RGB").save(back_path, format="JPEG", quality=90, optimize=True, progressive=True)
    return str(output_path), share_id, str(back_path)
