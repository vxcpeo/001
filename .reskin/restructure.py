from pathlib import Path
app = Path(r"E:\workspace\chuangye\solana\001\website\src\App.vue")
text = app.read_text(encoding="utf-8")
pairs = [
    ('<section class="bp-wire" aria-label="Latest lines">', '<aside class="bp-wire" aria-label="Latest lines">'),
    ('</section>\n\n    <main class="bp-canvas">', '</aside>\n\n    <main class="bp-canvas">'),
    ('<section class="bp-tile bp-brief" aria-label="How the lines work">', '<section class="bp-tile bp-brief">'),
    ('<div class="bp-feed-head">', '<header class="bp-feed-head">'),
    ('          <p class="bp-tally">{{ visibleMarkets.length }} of {{ markets.length }} lines shown</p>\n        </div>',
     '          <p class="bp-tally">{{ visibleMarkets.length }} of {{ markets.length }} lines shown</p>\n        </header>'),
    ('        <span class="bp-footer-net">\n          Solana {{ clusterLabel }} &middot;\n          <a :href="`https://explorer.solana.com/?cluster=${wallet.cluster}`" target="_blank" rel="noreferrer">explorer</a>\n        </span>',
     '        <nav class="bp-footer-net" aria-label="Network">\n          Solana {{ clusterLabel }} &middot;\n          <a :href="`https://explorer.solana.com/?cluster=${wallet.cluster}`" target="_blank" rel="noreferrer">explorer</a>\n        </nav>'),
]
for old, new in pairs:
    if text.count(old) != 1:
        raise SystemExit(f"expected exactly one match, got {text.count(old)}: {old[:60]!r}")
    text = text.replace(old, new)
app.write_text(text, encoding="utf-8")
print("landmark restructure applied")
