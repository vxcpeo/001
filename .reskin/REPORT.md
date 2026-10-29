# Reskin report — Probvyn, Round 9

## Direction

- **Style:** Spectrum Terminal (`solana-spectrum`, performance-brutalist), live-sampled
  from [https://solana.com](https://solana.com) — 8/10 blockchain references sampled OK.
- **Skeleton:** **Terminal Console** (`terminal-console`, linear). Original detected
  archetype: `gallery-scroll` (spatial).
- **Accent:** `#298dff` → `#9945ff`, **58.9 ΔE** (minimum 30).
- **Ground:** tidal white `#ffffff` → console black `#000000`.
- **Display voice:** Segoe UI Variable / Archivo at 600 → **Archivo 800** with −0.055em
  tracking, uppercase; the self-hosted variable font is now declared and used by both the
  site and the artboards.
- **Data voice:** Cascadia Mono → **IBM Plex Mono** (self-hosted, 400–700), tabular figures.
- **Shell:** full-viewport gallery scenes + floating dock + centred cards →
  sticky 34px status bar with the route commands, a command line with the claim, a
  three-pane console (rail / data table / readout & desk), a ruled rules log, and a hint
  strip; both dialogs rebuilt as square terminal panels with a spectrum top rule.

> The UI was rebuilt around **Spectrum Terminal** / **Terminal Console**; the original
> **gallery-scroll** shell and palette were removed while the content contract stayed
> byte-for-byte intact.

## Evidence

- Content contract hash: `680139aed2063275746c98c18f51c05b5485242f40df7ad027e392f60792f1df` —
  intact, 0 additive warnings.
- Rendered words: **302 → 302**; zero missing, zero added; numeric tokens 65/104 both sides.
- DOM fingerprint similarity: **0.291** (limit 0.50).
- Landmark similarity: **0.429** (limit 0.68).
- CSS class overlap: **0.000** (limit 0.10).
- Accent distance: **58.9 ΔE** (min 30).
- Axe serious/critical: **0**; contrast failures **0 / 263**; console errors **0**.
- Route `/`: **200** at 1440×900 and 390×844, no horizontal overflow at either.
- `node scripts/verify.mjs check`: **PASS** (`.reskin/VERIFICATION.md`).

## Screenshots

- Baseline (Tidal Sui): `.reskin/baseline/home-desktop.png`, `.reskin/baseline/home-mobile.png`.
- Current (Spectrum Terminal): `.reskin/current/home-desktop.png`,
  `.reskin/current/home-mobile.png`.
- Side by side: [`output/playwright/reskin-r9-baseline-vs-current.png`](../../output/playwright/reskin-r9-baseline-vs-current.png).
- Interaction evidence: `output/playwright/probvyn-{desktop,mobile,wallet-desktop,wallet-connected,trade-desktop,trade-mobile}.png`
  from `.probe/shoot.mjs` (mock provider; 0 console errors, no overflow).

## Changes

- `src/App.vue` template rebuilt as the terminal console: status bar (brand, imprint,
  LIVE, `Feed`/`Rules`/`Desk` as commands), command line (`h1` claim + standfirst),
  3-pane console — rail (`the feed`, tally, search, lane chips, sorts, `Open the feed`,
  wallet action, seal), line table (wire ticker, eight ruled rows with quote, sparkline,
  split, move/volume/traders, YES/NO trade buttons, signed slip, empty state), readout
  (`arena readout`, streaming, 2×2 stats, pulse, scope buffer, network facts) and desk
  (`your desk`, wallet title, nodes, actions, receipts). The rules section became a ruled
  log. Every text token, binding, `v-for`, handler, field, href and dialog branch was
  moved, not rewritten. `<script setup>` is untouched.
- `src/styles/terminal.css` added (`--tx-*` tokens, reset, `tx-` shell and components,
  dialogs, responsive rules, reduced-motion guard). The retired `src/styles/tidal.css` is
  removed from `src/` and archived to `output/reskin-round8-tidal/tidal.css`;
  `src/main.js` imports only the new layer.
- The mark keeps the split-diamond geometry, recoloured to white on black with a green
  node and a purple frame; `public/favicon.svg` matches.
- `index.html` metadata untouched (title, description, OG/Twitter tags, theme colour).
- Accessibility built in: one `h1`, `header`/`nav`/`main`/`footer` landmarks, labelled
  search and stake inputs, 2px green focus ring, ≥4.5:1 body contrast,
  `prefers-reduced-motion` guard for the LED, pulse and transitions, keyboard-reachable
  top-bar navigation on mobile.

## X / Twitter materials

The same direction was applied to the social artboards, so the feed, the OG card and the
launch loop match the site:

- `.probe/assets.html` rewritten as the Spectrum Terminal system (`sp-*` classes, black
  console field, purple signal, green data, hairline panels, mono micro-labels). The eight
  artboards keep their delivery sizes: 400×400 avatar, 1500×500 banner, 1000×1000 logo,
  1200×675 hero and markets, 1600×900 guide and manifesto, 1200×630 OG. The markets card
  changed to a 2×2 grid with per-line sparklines; the guide gained a signed-position ticket.
- `.probe/launch.html` rebuilt as the 12s 1280×720 loop: black stage, spectrum sweep,
  terminal readout panel, closing card with the mark and the tagline.
- Both artboards embed the self-hosted Archivo / IBM Plex Mono latin subsets as base64, so
  `file://` renders use the same type as the site.
- `node .probe/render-social.mjs --apply` re-rendered all eight PNGs plus
  `website/public/og.png`; `node .probe/render-launch-video.mjs --apply` produced
  `twitter/probvyn-launch.mp4` (1280×720, 30fps, 12s).
- `node .probe/sync-artboards.mjs` mirrors the artboards into
  `twitter/generate-assets.html`; `node .probe/measure-text.mjs` measured **207 text runs,
  0 outside their artboard, 0 collisions**.
- `twitter/probvyn-brand-brief.md` rewritten for the Spectrum identity; the brand-kit README
  records the new palette; `media-manifest.json` re-hashed (8 entries);
  `probvyn-brand-kit.zip` rebuilt (20 members).

## Verification after the rebuild

- `node .probe/verify.mjs .`: **ALL CHECKS PASS** (brand parities, 6 posts, 22 asset sizes,
  QA records, manifest hashes; the absent publish mirror is a note).
- `.probe/shoot.mjs` with an injected mock wallet: 5 providers reported not installed in a
  clean browser; the connected path read **2.4800 SOL**, signed a 155-byte transaction,
  broadcast it and kept the receipt; 0 console errors; desktop and mobile, no overflow.
- Rebrand scope `verify.py --project website --browser`: every gate passes except
  `brand_registry`, which lives in the repo-root `brand.txt` and is validated by the root
  run. Browser gate: 0 old-brand text or attribute hits, 0 page errors, 0 failed requests.

## Limitations

- One static route only; wallet/trade states are exercised through the project's
  mock-provider probe, not a live extension.
- The wire ticker duplicates the feed summary by design (the content contract contains the
  duplicated `[...wireItems, ...wireItems]` expression); it is a decorative summary of the
  same lines.
- The status bar is sticky; full-page screenshots paint it at the first viewport, which is
  why it appears near the top of the long captures (measured pinned at 0–34px).
- Old `.reskin/` evidence for Round 8 is archived at `output/reskin-round8-tidal/`,
  together with the retired stylesheet and the pre-reskin `App.vue`.
- The project QA harness (`.probe/verify.mjs`, `.probe/shoot.mjs`) had its skin-specific
  expectations and selectors updated to the new layer; its behavioural assertions are
  unchanged.
