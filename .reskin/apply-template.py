from pathlib import Path
W = Path(r"E:\workspace\chuangye\solana\001\website")
app = W/"src/App.vue"
text = app.read_text(encoding="utf-8")
marker = "<template>"
head, _ = text.split(marker, 1)
head = head.replace(
    "Paper Protocol skin: paper ground, ether-blue rules, serif display voice, mono gutters.",
    "Cobalt Blueprint skin: cobalt accent on a cool blueprint ground, Inter Tight display voice, mono data gutters.",
)
new_template = (W/".reskin/new-template.html").read_text(encoding="utf-8")
if not new_template.rstrip().endswith("</template>"):
    raise SystemExit("template file must end with </template>")
app.write_text(head + new_template.rstrip() + "\n", encoding="utf-8")
main = W/"src/main.js"
main.write_text(
    "import { createApp } from 'vue'\n"
    "import App from './App.vue'\n"
    "import './styles/blueprint.css'\n"
    "import './styles/blueprint-bento.css'\n"
    "\n"
    "createApp(App).mount('#app')\n",
    encoding="utf-8",
)
print("App.vue lines:", app.read_text(encoding='utf-8').count('\n'))
print("main.js rewritten")
