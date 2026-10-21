from pathlib import Path

p = Path(r"E:\workspace\chuangye\solana\001\.probe\shoot.mjs")
text = p.read_text(encoding="utf-8")
pairs = [
    (".chip--cta", ".ledger-chip"),
    (".wallet-list", ".ledger-wallet-list"),
    (".wallet-pick", ".ledger-wallet-pick"),
    (".sheet--tight .sheet-note", ".ledger-plate .ledger-plate-note"),
    (".chip--on", ".ledger-chip"),
    (".toast", ".ledger-toast"),
    (".pick--yes", ".ledger-side--yes"),
    (".pick--no", ".ledger-side--no"),
    (".sheet .btn--hot", ".ledger-plate .ledger-action--fill"),
    (".card-slip", ".ledger-slip"),
    (".sheet-error", ".ledger-error"),
    ("'.sheet'", "'.ledger-plate'"),
]
for old, new in pairs:
    if old not in text:
        print("missing", old)
    text = text.replace(old, new)
p.write_text(text, encoding="utf-8")
print("shoot selectors updated")
