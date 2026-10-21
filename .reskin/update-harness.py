from pathlib import Path

root = Path(r"E:\workspace\chuangye\solana\001")
p = root / ".probe" / "verify.mjs"
text = p.read_text(encoding="utf-8")

old = """  ['website/src/styles/meridian.css', 'Meridian'],
  ['website/src/styles/meridian.css', '--accent'],
  ['website/src/styles/meridian.css', '--accent-safe'],
  ['website/src/styles/meridian-orbit.css', 'orbital-shell'],"""
new = """  ['website/src/styles/paper.css', 'Paper Protocol'],
  ['website/src/styles/paper.css', '--pp-accent'],
  ['website/src/styles/paper.css', '--pp-font-display'],
  ['website/src/styles/paper-ledger.css', 'ledger-masthead'],
  ['website/src/styles/paper-ledger.css', 'ledger-columns'],"""
if old not in text:
    raise SystemExit("style assertions not found")
text = text.replace(old, new)
p.write_text(text, encoding="utf-8")
print("updated harness style assertions")
