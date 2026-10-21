# Reskin report — Prismel, Round 6

## Direction

- **Style:** Cobalt Blueprint (`base-cobalt`, optimistic-modern), live-sampled from
  [https://www.base.org](https://www.base.org) — 9/10 references sampled OK.
- **Skeleton:** **Bento Canvas** (`bento-canvas`, spatial). Original detected
  archetype: `marketing-stack` (editorial).
- **Accent:** `#0c5681` → `#0000ff`, **114.22 ΔE** (minimum 30).
- **Ground:** paper white `#ffffff` → blueprint ground `#dde3e9`.
- **Display voice:** Iowan Old Style / Palatino serif → Inter Tight / Segoe UI sans,
  weight 620–700, tracking −0.035em.
- **Data voice:** Courier New → Geist Mono / Cascadia Mono.
- **Shell:** masthead + index line + wire band + 7/3 ledger + marginalia + colophon
  → sticky slim index + full-bleed wire aside + 12-column bento canvas + thin
  footer, with an ink instrument panel for the live readout.

> The UI was rebuilt around **Cobalt Blueprint** / **Bento Canvas**; the original
> **marketing-stack** shell and palette were removed while the content contract
> stayed byte-for-byte intact.

## Evidence

- Content contract hash: `73b5e20bf78b27c263d33928c71fa07b05861c1d16639feefde97b032f1962fc` — intact, 0 additive warnings.
- Rendered words: **302 → 302**; numeric tokens **65 / 104 → 65 / 104**.
- DOM fingerprint similarity: **0.299** (limit 0.50).
- Landmark similarity: **0.500** (limit 0.68).
- CSS class overlap: **0.000** (limit 0.10).
- Accent distance: **114.22 ΔE** (min 30).
- Axe serious/critical: **0**; contrast failures **0 / 263**; console errors **0**.
- Route `/`: **200** at 1440×900 and 390×844, no horizontal overflow.
- `node scripts/verify.mjs check`: **PASS** (`.reskin/VERIFICATION.md`).

## Screenshots

- Baseline (Paper Protocol, after the rebrand): `.reskin/baseline/home-desktop.png`,
  `.reskin/baseline/home-mobile.png`.
- Current (Cobalt Blueprint): `.reskin/current/home-desktop.png`,
  `.reskin/current/home-mobile.png`.
- Side by side: `output/playwright/reskin-r6-baseline-vs-current.png`.
- Dialog / interaction evidence: `output/playwright/prismel-*.png`
  (desktop, mobile, wallet sheet, connected, trade sheet, signed).

## Changes

- `src/App.vue` template rewritten into the bento composition (sticky index,
  wire aside, hero tile, ink readout tile, brief tile, desk tile, full-bleed feed
  band, three move tiles, note, thin footer, trade sheet, wallet sheet, toast).
  Every text token, binding, `v-for`, handler, field, link and dialog branch was
  moved, not rewritten. The `<script setup>` block is unchanged apart from one
  presentation-only comment.
- `src/styles/blueprint.css` + `src/styles/blueprint-bento.css` added (tokens,
  reset, base type, `bp-` shell and components). All class and token names are new.
- `src/styles/paper.css` and `src/styles/paper-ledger.css` removed from the render
  path and archived to `output/reskin-round6-old/`; `main.js` imports only the new
  layer.
- `index.html` `theme-color` switched to `#dde3e9`; content, title, description and
  metadata untouched.
- Accessibility built in: one `h1`, `header`/`nav`/`main`/`aside`/`footer`
  landmarks with unique named complementary regions, labelled search and stake
  inputs, visible 2px cobalt focus ring, 4.5:1 body contrast, 24px+ targets,
  `prefers-reduced-motion` guard, keyboard-reachable index and mobile layout.

## X / Twitter materials

The social artboards were reskinned to the same direction, so the feed, the OG
card and the launch loop match the site instead of the retired neon board:

- `.probe/assets.html` rewritten around the cobalt blueprint system (`bd-*`
  classes, prism mark, white tiles on graph-paper ground, ink instrument panels,
  mixed tile spans per asset). The eight artboards keep their delivery sizes:
  400×400 avatar, 1500×500 banner, 1000×1000 logo, 1200×675 hero and markets,
  1600×900 guide and manifesto, 1200×630 OG.
- `.probe/launch.html` rebuilt as a 12s 1280×720 loop in the same system; the
  closing cobalt card carries the prism mark and tagline.
- `node .probe/render-social.mjs --apply` re-rendered all eight PNGs plus
  `website/public/og.png`; `node .probe/render-launch-video.mjs --apply` produced
  `twitter/prismel-launch.mp4` (1280×720, 30fps, 12s, 812,831 bytes).
- `node .probe/sync-artboards.mjs` mirrors the artboards into
  `twitter/generate-assets.html`; `node .probe/measure-text.mjs` measured **145
  text runs, 0 outside their artboard, 0 collisions** (two records rewritten).
- `twitter/logo.svg`, `twitter/prismel-logo.svg` and `website/public/favicon.svg`
  redrawn as the prism mark; `media-manifest.json` re-hashed (8 entries);
  `prismel-brand-kit.zip` rebuilt (20 members).

## Verification after the rebuild

- `node .probe/verify.mjs .`: **ALL CHECKS PASS** (brand parities, 6 posts, asset
  sizes, QA records, manifest hashes; the absent publish mirror is a note).
- `.probe/shoot.mjs` with an injected mock wallet: 5 providers reported not
  installed in a clean browser; the connected path read **2.4800 SOL**, signed a
  153-byte transaction, broadcast it and kept the receipt (`you signed YES ·
  0.100 SOL`); 0 console errors; desktop and mobile, no overflow.
- Rebrand scope `verify.py --project website --browser`: every gate passes except
  `brand_registry`, which lives in the repo-root `brand.txt` and is validated by
  the root run.

## Limitations

- One static route only; wallet/trade states are exercised through the project's
  mock-provider probe, not a live extension.
- The verifier's archetype heuristic labels the new page `dashboard-shell` (it
  detects the sticky top index and the data band); its `bento` trait is true and
  the measured skeleton is the bento canvas described above.
- One non-blocking warning: `aria-label="Network"` was added to the footer nav so
  the second navigation landmark has a unique accessible name.
- Old `.reskin/` evidence for Round 5 is archived at
  `output/reskin-round5-paper/`.
