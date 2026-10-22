# Reskin report — Callova, Round 8

## Direction

- **Style:** Tidal Sui (`sui-tidal`, clean-fintech), live-sampled from
  [https://sui.io](https://sui.io) — 9/10 blockchain references sampled OK.
- **Skeleton:** **Gallery Scroll** (`gallery-scroll`, spatial). Original detected
  archetype: `document-flow` (editorial).
- **Accent:** `#ff0000` → `#298dff`, **148.1 ΔE** (minimum 30).
- **Ground:** abyss black `#000000` → tidal white `#ffffff`.
- **Display voice:** Trebuchet MS → Segoe UI Variable Display / Segoe UI at
  weight 600–650, tracking −0.04em.
- **Data voice:** Cascadia Mono (kept — the same machinery voice, new palette).
- **Shell:** fixed 76px glyph rail + command bar + 7/3 stage + status strip →
  full-viewport opening panel + three scene panels (feed rail, readout/desk,
  rules) + ink closing panel + floating dock, with both dialogs rebuilt as
  centred sheets.

> The UI was rebuilt around **Tidal Sui** / **Gallery Scroll**; the original
> **document-flow** shell and palette were removed while the content contract
> stayed byte-for-byte intact.

## Evidence

- Content contract hash: `35d743d3a63c101952a810965e1be5068688a656bf474017a8982670d4716a2e` — intact, 0 additive warnings.
- Rendered words: **301 → 301**; zero missing, zero added; numeric tokens 65/104 both sides.
- DOM fingerprint similarity: **0.279** (limit 0.50).
- Landmark similarity: **0.400** (limit 0.68).
- CSS class overlap: **0.000** (limit 0.10).
- Accent distance: **148.1 ΔE** (min 30).
- Axe serious/critical: **0**; contrast failures **0 / 263**; console errors **0**.
- Route `/`: **200** at 1440×900 and 390×844, `scrollWidth == clientWidth` at both.
- `node scripts/verify.mjs check`: **PASS** (`.reskin/VERIFICATION.md`).

## Screenshots

- Baseline (Abyss Liquidity): `.reskin/baseline/home-desktop.png`,
  `.reskin/baseline/home-mobile.png`.
- Current (Tidal Sui): `.reskin/current/home-desktop.png`,
  `.reskin/current/home-mobile.png`.
- Side by side: [`output/playwright/reskin-r8-baseline-vs-current.png`](../../output/playwright/reskin-r8-baseline-vs-current.png)
  and the mobile sheet beside it.
- Interaction evidence: `output/playwright/callova-*.png` from `.probe/shoot.mjs`
  (desktop, mobile, wallet sheet, connected, trade sheet, signed receipt).

## Changes

- `src/App.vue` template rebuilt as the gallery composition: an opening panel
  with the brand lockup, claim, standfirst, search and actions; a feed scene with
  the wire rail, lane tabs, sorts and a horizontal snap rail of line cards; a
  readout scene with monumental stats, pulse, seal, wallet chip and a floating
  desk card; a rules scene with three move panels; an ink closing panel; a
  floating dock holding `Feed` / `Rules` / `Desk`; both dialogs as centred
  sheets. Every text token, binding, `v-for`, handler, field, href and dialog
  branch was moved, not rewritten. `<script setup>` is untouched.
- `src/styles/tidal.css` added (tokens, reset, `td-` shell and components, new
  class and token names throughout). `src/styles/abyss.css` removed from the
  render path and archived to `output/reskin-round8-old/abyss.css`;
  `src/main.js` imports only the new layer.
- `index.html` `theme-color` switched to `#ffffff` and `color-scheme` to `light`;
  title, description and metadata untouched.
- The mark keeps the split-diamond geometry, recoloured to ink `#081b2b` with a
  white diamond and a tidal-blue node; `public/favicon.svg` matches.
- Accessibility built in: one `h1`, `header`/`nav`/`main`/`footer` landmarks,
  labelled search and stake inputs, a 2px `--accent-safe` focus ring,
  ≥4.5:1 body contrast, `prefers-reduced-motion` guard for the cue, pulse and
  drawer motion, and a keyboard-reachable bottom dock on mobile.

## X / Twitter materials

The same direction was applied to the social artboards, so the feed, the OG
card and the launch loop match the site:

- `.probe/assets.html` rewritten around the tidal system (`tw-*` classes, ink
  plate mark, white floating cards, one blue signal, tidal curves on a fine
  vertical grid). The eight artboards keep their delivery sizes: 400×400 avatar,
  1500×500 banner, 1000×1000 logo, 1200×675 hero and markets, 1600×900 guide and
  manifesto, 1200×630 OG. The markets card changed from a row table to a 2×2
  card grid.
- `.probe/launch.html` rebuilt as the 12s 1280×720 loop on a white tidal stage;
  the closing card is an ink panel with the white diamond, the wordmark and the
  tagline.
- `node .probe/render-social.mjs --apply` re-rendered all eight PNGs plus
  `website/public/og.png`; `node .probe/render-launch-video.mjs --apply` produced
  `twitter/callova-launch.mp4` (1280×720, 30fps, 12s).
- `node .probe/sync-artboards.mjs` mirrors the artboards into
  `twitter/generate-assets.html`; `node .probe/measure-text.mjs` measured **161
  text runs, 0 outside their artboard, 0 collisions**.
- `twitter/callova-brand-brief.md` rewritten for the Tidal identity; the brand
  kit README documents the tidal palette and the mark; `media-manifest.json`
  re-hashed (8 entries); `callova-brand-kit.zip` rebuilt (20 members).

## Verification after the rebuild

- `node .probe/verify.mjs .`: **ALL CHECKS PASS** (brand parities, 6 posts, asset
  sizes, QA records, manifest hashes; the absent publish mirror is a note).
- `.probe/shoot.mjs` with an injected mock wallet: 5 providers reported not
  installed in a clean browser; the connected path read **2.4800 SOL**, signed a
  155-byte transaction, broadcast it and kept the receipt; 0 console errors;
  desktop and mobile, no overflow.
- Rebrand scope `verify.py --project website --browser`: every gate passes except
  `brand_registry`, which lives in the repo-root `brand.txt` and is validated by
  the root run. Browser gate: 0 old-brand text or attribute hits, 0 page errors,
  0 failed requests.

## Limitations

- One static route only; wallet/trade states are exercised through the project's
  mock-provider probe, not a live extension.
- The wire rail duplicates the feed summary by design (the content contract
  contains the duplicated `[...wireItems, ...wireItems]` expression); it is a
  decorative summary of the same lines.
- The dock is fixed; full-page screenshots paint it at the first viewport, which
  is why it appears mid-page in the long captures (verified fixed at 828/900
  desktop and 791/844 mobile by rect measurement).
- Old `.reskin/` evidence for Round 7 is archived at
  `output/reskin-round8-old/`, together with the retired stylesheet and the
  pre-reskin `App.vue`.
