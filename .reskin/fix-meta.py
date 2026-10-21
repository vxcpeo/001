from pathlib import Path

p = Path(r"E:\workspace\chuangye\solana\001\website\index.html")
text = p.read_text(encoding="utf-8")
text = text.replace('<meta name="theme-color" content="#050508" />', '<meta name="theme-color" content="#ffffff" />')
text = text.replace('<meta name="color-scheme" content="dark" />', '<meta name="color-scheme" content="light" />')
p.write_text(text, encoding="utf-8")
print("theme metadata switched to paper")
