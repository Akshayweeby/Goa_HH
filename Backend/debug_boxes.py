import sys
import os
from PIL import Image, ImageDraw


def draw_boxes():
    base_dir = r"c:\Users\mbvis\OneDrive\Desktop\Engineering\Projects\Goa\Backend"
    img_path = os.path.join(base_dir, "assets", "front_template.png")
    out_path = os.path.join(base_dir, "output", "debug3.png")

    TEMPLATE_SLOTS = {
        "photo": {"x": 405, "y": 197, "width": 554, "height": 554, "shape": "diamond"},
    }

    TEXT_FIELDS = {
        "name": {
            "x": 995,
            "y": 400,
            "width": 445,
            "height": 60,
        },
        "builder_id": {
            "x": 995,
            "y": 555,
            "width": 215,
            "height": 60,
        },
        "team_name": {
            "x": 1235,
            "y": 555,
            "width": 205,
            "height": 60,
        },
        "role": {
            "x": 905,
            "y": 788,
            "width": 515,
            "height": 60,
        },
    }

    img = Image.open(img_path).convert("RGBA")
    draw = ImageDraw.Draw(img)

    p = TEMPLATE_SLOTS["photo"]
    draw.rectangle(
        [p["x"], p["y"], p["x"] + p["width"], p["y"] + p["height"]],
        outline="red",
        width=5,
    )

    for k, v in TEXT_FIELDS.items():
        draw.rectangle(
            [v["x"], v["y"], v["x"] + v["width"], v["y"] + v["height"]],
            outline="blue",
            width=5,
        )

    img.save(out_path)
    print("Debug image saved to", out_path)


if __name__ == "__main__":
    draw_boxes()
