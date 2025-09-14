import sys
from pathlib import Path
from PIL import Image

TARGETS = [
    (1280, 720),  # large
    (640, 360),   # thumb
]

def center_crop_to_aspect(img: Image.Image, aspect_w: int, aspect_h: int) -> Image.Image:
    w, h = img.size
    target_ratio = aspect_w / aspect_h
    src_ratio = w / h
    if src_ratio > target_ratio:
        # too wide -> crop width
        new_w = int(h * target_ratio)
        x = (w - new_w) // 2
        box = (x, 0, x + new_w, h)
    else:
        # too tall -> crop height
        new_h = int(w / target_ratio)
        y = (h - new_h) // 2
        box = (0, y, w, y + new_h)
    return img.crop(box)

def process_dir(root: Path):
    images = list(root.glob('**/*'))
    images = [p for p in images if p.suffix.lower() in {'.jpg', '.jpeg', '.png'}]
    if not images:
        print(f"No raster images found under {root}")
        return
    for path in images:
        try:
            img = Image.open(path).convert('RGB')
        except Exception as e:
            print(f"Skip {path}: {e}")
            continue
        cropped = center_crop_to_aspect(img, 16, 9)
        for w, h in TARGETS:
            out = path.with_name(f"{path.stem}_{w}x{h}.jpg")
            resized = cropped.resize((w, h), Image.LANCZOS)
            resized.save(out, quality=88, optimize=True)
            print(f"Wrote {out}")

if __name__ == '__main__':
    base = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('img')
    if not base.exists():
        print(f"Directory not found: {base}")
        sys.exit(1)
    # Process pubs and projects under img
    for sub in [base / 'pubs', base / 'projects']:
        if sub.exists():
            process_dir(sub)
        else:
            print(f"Skip missing {sub}")

