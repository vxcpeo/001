from pathlib import Path

root = Path(r"E:\workspace\chuangye\solana\001")
web = root / "website"

# Preserve the retired skin for auditability.
archive = root / "output" / "reskin-round5-old"
archive.mkdir(parents=True, exist_ok=True)
for name in ("meridian.css", "meridian-orbit.css"):
    src = web / "src" / "styles" / name
    if src.exists():
        (archive / name).write_bytes(src.read_bytes())

app_path = web / "src" / "App.vue"
app = app_path.read_text(encoding="utf-8")
start = app.index("<template>")
end = app.rindex("</template>") + len("</template>")
new_template = (web / ".reskin" / "new-template.vue").read_text(encoding="utf-8").rstrip() + "\n"
app_path.write_text(app[:start] + new_template + app[end:], encoding="utf-8")
print("spliced template:", len(new_template), "chars")

main_path = web / "src" / "main.js"
main_path.write_text(
    "import { createApp } from 'vue'\n"
    "import App from './App.vue'\n"
    "import './styles/paper.css'\n"
    "import './styles/paper-ledger.css'\n"
    "\n"
    "createApp(App).mount('#app')\n",
    encoding="utf-8",
)
print("rewrote main.js")

for name in ("meridian.css", "meridian-orbit.css"):
    src = web / "src" / "styles" / name
    if src.exists():
        src.unlink()
        print("removed", name)
