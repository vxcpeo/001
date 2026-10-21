from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(r"E:\workspace\chuangye\solana\001")
base = Image.open(root / "website" / ".reskin" / "baseline" / "home-desktop.png").convert("RGB")
cur = Image.open(root / "website" / ".reskin" / "current" / "home-desktop.png").convert("RGB")

width = 720
def fit(img, width):
    height = round(img.height * width / img.width)
    return img.resize((width, height), Image.LANCZOS)

base, cur = fit(base, width), fit(cur, width)
gap, top, pad = 28, 64, 28
height = top + max(base.height, cur.height) + pad
canvas = Image.new("RGB", (pad * 2 + width * 2 + gap, height), "#f3f0e8")
draw = ImageDraw.Draw(canvas)
font = ImageFont.truetype(r"C:\Windows\Fonts\georgiab.ttf", 24)
small = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 14)
draw.text((pad, 18), "BEFORE — orbital / #670de5", font=font, fill="#1b1b1b")
draw.text((pad + width + gap, 18), "AFTER — Paper Protocol / Documentary Ledger", font=font, fill="#1b1b1b")
draw.text((pad, top - 24), "baseline/home-desktop.png", font=small, fill="#6b675f")
draw.text((pad + width + gap, top - 24), "current/home-desktop.png", font=small, fill="#6b675f")
canvas.paste(base, (pad, top))
canvas.paste(cur, (pad + width + gap, top))
out = root / "output" / "playwright" / "reskin-r5-baseline-vs-current.png"
out.parent.mkdir(parents=True, exist_ok=True)
canvas.save(out, optimize=True)
print(out, canvas.size)
