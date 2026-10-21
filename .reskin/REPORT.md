# Reskin report — Oddix, Round 7

## Direction

- **Style:** Abyss Liquidity (`aave-abyss`, dark-technical), live-sampled from
  [https://aave.com](https://aave.com) — 8/10 references sampled OK.
- **Skeleton:** **Command Rail** (`command-rail`, linear). Original detected
  archetype: `dashboard-shell` (shell).
- **Accent:** `#0000ff` → `#ff0000`, **176.33 ΔE** (minimum 30).
- **Ground:** blueprint white `#dde3e9` → abyss black `#000000`.
- **Display voice:** Inter Tight / Segoe UI sans → Trebuchet MS / Segoe UI,
  weight 700, tracking −0.042em.
- **Data voice:** Geist Mono → Cascadia Mono.
- **Shell:** sticky top index + wire band + bento canvas + 7/3 ledger → fixed
  76px glyph rail + floating command bar + oversized running head + wire tape +
  1.55/0.45 data stage + bottom status strip, with the dialogs rebuilt as
  right-hand command drawers.

> The UI was rebuilt around **Abyss Liquidity** / **Command Rail**; the original
> **dashboard-shell** shell and palette were removed while the content contract
> stayed byte-for-byte intact.

## Evidence

- Content contract hash: `8f04bb8dd0587d2d28600ef045ba1223069fca28ee8a17962316aad4ccfac67f` — intact, 0 additive warnings.
- Rendered words: **302 → 302**.
- DOM fingerprint similarity: **0.16** (limit 0.50).
- Landmark similarity: **0.50** (limit 0.68).
- CSS class overlap: **0.000** (limit 0.10).
- Accent distance: **176.33 ΔE** (min 30).
- Axe serious/critical: **0**; contrast failures **0 / 263**; console errors **0**.
- Route `/`: **200** at 1440×900 and 390×844, no horizontal overflow.
- `node scripts/verify.mjs check`: **PASS** (`.reskin/VERIFICATION.md`).

## Screenshots

- Baseline (Cobalt Blueprint): `.reskin/baseline/home-desktop.png`,
  `.reskin/baseline/home-mobile.png`.
- Current (Abyss Liquidity): `.reskin/current/home-desktop.png`,
  `.reskin/current/home-mobile.png`.
- Side by side: `output/playwright/reskin-r7-baseline-vs-current.png`.
- Interaction evidence: `output/playwright/oddix-*.png` (desktop, mobile, wallet
  drawer, connected, trade drawer, signed) from `.probe/shoot.mjs`.

## Changes

- `src/App.vue` template rewritten into the command-rail composition: fixed rail
  with rotated micro-labels, sticky command bar with the brand lockup, imprint,
  search and page actions, oversized running head plus standfirst, wire tape,
  feed + marginal readout/desk stage, three-move band, status strip, two
  drawers, toast. Every text token, binding, `v-for`, handler, field, link and
  dialog branch was moved, not rewritten. The `<script setup>` block is unchanged
  apart from comments and the brand strings the rebrand had already replaced.
- `src/styles/abyss.css` added (tokens, reset, `ox-` shell and components).
  All class and token names are new; 0 shared selectors with the old sheet.
- `src/styles/blueprint.css` and `src/styles/blueprint-bento.css` removed from the
  render path and archived to `output/reskin-round7-old/`; `main.js` imports only
  the new layer.
- `index.html` `theme-color` switched to `#000000` and `color-scheme` to `dark`;
  content, title, description and metadata untouched.
- The brand mark is redrawn as the split diamond (favicon, site lockup, rail
  crest, desk glyph, drawer glyphs); all inline SVGs use the same geometry.
- Accessibility built in: one `h1`, `header`/`nav`/`main`/`footer` landmarks plus
  named sections, labelled search and stake inputs, visible 2px red focus ring,
  ≥4.5:1 body contrast, `prefers-reduced-motion` guard for the tape, pulse,
  blink and drawer motion, keyboard-reachable bottom navigation on mobile.

## X / Twitter materials

The same direction was applied to the social artboards, so the feed, the OG card
and the launch loop match the site:

- `.probe/assets.html` rewritten around the abyss system (`ab-*` classes,
  split-diamond mark, glass panels on the instrument grid, red signal line,
  magenta/teal glow). The eight artboards keep their delivery sizes: 400×400
  avatar, 1500×500 banner, 1000×1000 logo, 1200×675 hero and markets, 1600×900
  guide and manifesto, 1200×630 OG.
- `.probe/launch.html` rebuilt as a 12s 1280×720 loop; the closing red card
  carries the white diamond mark, the wordmark and the tagline.
- `node .probe/render-social.mjs --apply` re-rendered all eight PNGs plus
  `website/public/og.png`; `node .probe/render-launch-video.mjs --apply` produced
  `twitter/oddix-launch.mp4` (1280×720, 30fps, 12s).
- `node .probe/sync-artboards.mjs` mirrors the artboards into
  `twitter/generate-assets.html`; `node .probe/measure-text.mjs` measured **157
  text runs, 0 outside their artboard, 0 collisions**.
- `twitter/oddix-brand-brief.md` rewritten for the Oddix identity; the brand kit
  README now documents the abyss palette and the split-diamond mark;
  `media-manifest.json` re-hashed (8 entries); `oddix-brand-kit.zip` rebuilt
  (20 members).

## Verification after the rebuild

- `node .probe/verify.mjs .`: **ALL CHECKS PASS** (brand parities, 6 posts, asset
  sizes, QA records, manifest hashes; the absent publish mirror is a note).
- `.probe/shoot.mjs` with an injected mock wallet: 5 providers reported not
  installed in a clean browser; the connected path read **2.4800 SOL**, signed a
  153-byte transaction, broadcast it and kept the receipt; 0 console errors;
  desktop and mobile, no overflow.
- Rebrand scope `verify.py --project website --browser`: every gate passes except
  `brand_registry`, which lives in the repo-root `brand.txt` and is validated by
  the root run. Browser gate: 0 old-brand text or attribute hits, 0 page errors,
  0 failed requests.

## Limitations

- One static route only; wallet/trade states are exercised through the project's
  mock-provider probe, not a live extension.
- The verifier's archetype heuristic labels the new page `document-flow` (it
  detects the running head and long copy); the measured skeleton is the command
  rail described above.
- The wire tape is a CSS marquee; at the 1440×900 capture the first item is
  mid-scroll, which is expected motion, not clipping.
- Old `.reskin/` evidence for Round 6 is archived at
  `output/reskin-round6-cobalt/`; the Round 7 old stylesheet is at
  `output/reskin-round7-old/`.
