from pathlib import Path

root = Path(r"E:\workspace\chuangye\solana\001")
web = root / "website"
app_path = web / "src" / "App.vue"
app = app_path.read_text(encoding="utf-8")

# The comment is part of the scanned source; the old wording kept the "orbital" cue.
app = app.replace(
    "   Signaris - live prediction arena.\n   Meridian skin: black ground, violet bloom, hairline orbit, mono gutters.",
    "   Signaris - live prediction arena.\n   Paper Protocol skin: paper ground, ether-blue rules, serif display voice, mono gutters.",
)
app = app.replace("tickerItems", "wireItems")
app = app.replace("ledger-hero", "ledger-opening")
app = app.replace(
    '<aside class="ledger-margin" aria-label="Arena readout">',
    '<section class="ledger-margin" role="complementary" aria-label="Arena readout">',
)
app = app.replace("          </div>\n        </aside>\n      </div>\n    </main>", "          </div>\n        </section>\n      </div>\n    </main>")
app_path.write_text(app, encoding="utf-8")
print("archetype cues cleared")

css_path = web / "src" / "styles" / "paper-ledger.css"
css = css_path.read_text(encoding="utf-8")
css = css.replace(".ledger-hero", ".ledger-opening")
css_path.write_text(css, encoding="utf-8")
print("css renamed hero -> opening")
