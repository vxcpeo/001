# Reskin report — Probenox

Generated: 2026-10-20 · project `E:/workspace/chuangye/solana/001/website` (Vue 3 + Vite, single route)

## Direction

| Field | Value |
|---|---|
| Style | **Agora Violet** (`polygon-agora`, technical-editorial) |
| Source DNA | [https://polygon.technology](https://polygon.technology) — live sampled, 9/10 references reachable |
| Live sampling | **yes** (polygon 1888 ms; arbitrum.io returned HTTP 403 and was excluded) |
| Seed | `f6b28c4bad8e4dbacbbd08626a4193849c370abc84423fe189e1a8fa8099cc36` |
| Skeleton | **Orbital** (`orbital`, family `spatial`) |
| Original skeleton | `sidebar-workspace` (family `shell`) |
| Accent | `#670de5` — **215.58 ΔE** from the original `#c6ff2e` |
| Typography | local Archivo (grotesque, weight axis) + IBM Plex Mono, re-declared as `Meridian Grotesk` / `Meridian Gutter`; no webfont download, so the build stays offline-safe |

Only abstract design DNA was taken from the sampled references: palette family, hairline geometry,
mono metadata gutters, index-numeral texture, measured 260 ms motion. No reference logo, image,
copy, or code was used, and no reference brand name appears in the UI.

## Skeleton: what changed

The old shell was a top bar over a hero split (copy left / stat panel right), a ticker strip, a
3-column card grid, a 3-card rules row, a horizontal desk strip and a single-line footer. That whole
composition is gone.

| Region | Original | Now |
|---|---|---|
| Brand | top-left logo + centered nav + right wallet chip | centered **masthead seal** between two hairlines, no top bar, no corner chip |
| Navigation | 3 links in a horizontal top bar | 3 **stations positioned on the orbit ring** (−34° / 0° / +34°, counter-rotated upright); mobile → staircased **vertical arc** |
| Hero | two-column split, 88 px left-aligned claim | **circular core** holding the claim + CTA pair, concentric halos, 72-tick ring and a conic sweep |
| Metrics | right-hand stat panel with a histogram | **secondary arc** of four nodes + a radial pulse burst, with the wallet chip moved into the console foot |
| Lede / facts | inside the hero column | **aperture panel** opening from under the ring; facts become a three-cell ruled gutter |
| Ticker | strip under the hero | **signal tape**, now the first band of the page (seamless two-run drift) |
| Feed | responsive 3-column card grid | staggered **ray ledger**: one row per line with a conic odds dial, metadata gutter and stacked YES/NO |
| Rules | three equal cards in a row | **diagonal arc** of numbered stations (`01/02/03`) with a dashed footnote |
| Desk | horizontal strip with three inline stats | **wallet disc** with the status heading inside, an arc of three nodes, then the slip ledger |
| Footer | one row | **outer-ring band** plus the LIVE / cluster / settlement strip relocated from the top |
| Landmarks | header, nav, main, aside, 9×header, footer (14) | main, nav, aside, footer (4) — **no `header` element anywhere** |

DOM depth, child-count distribution, landmark sequence and every class name were rebuilt from
scratch: the rendered DOM shares **no class name at all** with the original.

## Verification

`node scripts/verify.mjs check --project . --out .reskin` → **PASS** (exit 0, no warnings).

| Gate | Threshold | Result |
|---|---|---|
| Source content contract | unchanged | **intact** — `b3ed45a1b94b4d2c1aed12cc31974e2a03d287b913e4a483bdd222c20391f1f6`, 0 issues, 0 additive warnings |
| Rendered word parity | no removals / additions | 302 word tokens, identical multiset |
| Rendered attribute parity | no non-aria changes | 16 attributes, identical multiset (`placeholder="Search lines"` preserved once) |
| Form parity | identical | `input::search` visible on load; `input::number` inside the closed sheet |
| DOM fingerprint similarity | ≤ 0.50 | **0.392** |
| Landmark sequence similarity | ≤ 0.68 | **0.214** |
| CSS class overlap | ≤ 0.10 | **0.000** (0 of 84 original classes reused) |
| Accent distance | ≥ 30 ΔE | **215.58** |
| Contrast failures | 0 | **0 / 263** text runs (baseline had 33) |
| axe WCAG 2.x serious/critical | 0 | **0** (also 0 moderate) |
| Console / page errors | 0 | **0** |
| Horizontal overflow 1440 / 390 | none | **0 / 0** (scrollWidth 390 = clientWidth 390) |
| Horizontal overflow 360 / 768 / 1024 / 1280 / 1920 | none | **0 / 0** at every width (the tape is clipped by design) |
| Labels, alt text, accessible names | none missing | **0 issues** |
| Keyboard focus visibility | ≥ 1 visible ring | visible 2 px `#bc97ff` ring on tab traversal |
| Mobile navigation reachable | ≥ 1 visible route link | reachable (`#feed`, `#rules`, `#desk`) |

Interaction pass in real Chrome (Playwright, headless): lane tabs filter (Crypto → 3 rows), sort
switching (Closing puts `SOL out-earns BTC on daily fees` first), search filter (`pixel` → 1 row),
empty state (`zzzz` → “No line matches that…”), trade sheet open / side switch / close on Escape,
wallet sheet open / close. No console errors in any state.

## Screenshots

- Baseline desktop — `.reskin/baseline/home-desktop.png`
- Baseline mobile — `.reskin/baseline/home-mobile.png`
- Current desktop — `.reskin/current/home-desktop.png`
- Current mobile — `.reskin/current/home-mobile.png`
- Interaction states — `.reskin/shots/` (wallet sheet, trade sheet, NO side, empty state, mobile feed)

Side-by-side review: the baseline reads as a dense dark editorial board (top bar, magenta/lime/cyan
signal, 3-column cards); the current build reads as a violet orbital instrument (bloom, ring, core,
ledger). No shared silhouette: the largest element in the first viewport is a circle in the new UI
versus a left-aligned headline block in the old one, navigation is on a ring rather than in a bar,
and the data route is a ruled ledger rather than a card grid.

## Changes

- `src/App.vue` — template fully rewritten (script block unchanged apart from its header comment):
  new shell, orbit, tape, aperture, metrics console, ray ledger, step arc, wallet disc, foot, and
  restyled trade / wallet sheets. Every static string, binding, handler, link, form field,
  `aria-label`, `placeholder` and the Vue `transition name="pop"` were moved verbatim.
- `src/styles/meridian.css` — **new** token/base layer: palette (`--accent #670de5`,
  `--accent-safe #bc97ff`), type scale, reset, focus ring, motion guard.
- `src/styles/meridian-orbit.css` — **new** layout layer: orbit, stations, core, aperture, metrics,
  tape, lines, steps, desk, foot, sheets, responsive (1180 / 980 / 860 / 700 / 560).
- `src/styles/style.css` — **deleted** (old arena skin, 35 KB) and removed from `src/main.js`.
- `src/main.js` — imports the two new stylesheets.
- `xa1001sol/` publish mirror — synced byte-for-byte with the new `src/` (mirror `style.css` removed)
  so `copy.bat` stays a no-op for the source tree.
- `.probe/verify.mjs` — the repo's own QA harness hard-coded the deleted stylesheet and its old
  tokens (`src/style.css`, `--hot`, `--volt`, `--ice`); those assertions and the mirror parity list
  now point at the two new stylesheets and their tokens. Every other assertion is untouched and
  `node .probe/verify.mjs .` reports **ALL CHECKS PASS**.
- No application logic, route, endpoint, env var or store action was touched.

## Accessibility and responsive results

- One `h1` (the core claim) with `h2` per section and `h3` per line / step; landmarks `main`,
  `nav`, `aside`, `footer` all named; no duplicate ids.
- Every control has an accessible name: the brand link, lane tabs, sort group, pick buttons, sheets
  and close buttons; the search field is wrapped in a `<label>` plus `aria-label`.
- Focus: 2 px `--accent-safe` ring with 3 px offset on all links, buttons and inputs; arrow-free
  DOM order matches the visual order of the stations on the ring.
- Contrast measured on the rendered page: **0 failures across 263 text runs** (body `#f2f3f7`,
  meta `#a0a1a6` ≥ 7.1:1, accent text `#bc97ff` ≥ 7.9:1 on every surface; `#670de5` is used only as
  a fill under white text at 7.6:1).
- Status is never colour-only: `LIVE`, `streaming`, `WALLET ONLINE/DETACHED` are words.
- Responsive: 1440 → ring + stations + core; 980 → ledger collapses to two columns; 860 → halos
  hidden, core becomes a rounded panel, stations become a vertical arc; 700 → facts stack; 560 →
  metrics 2×2, smaller dial, grouped ray metadata. Nothing is hidden to fit and no horizontal
  overflow at 390 px.
- `prefers-reduced-motion: reduce` disables the tape drift, the sweep rotation and the pulse,
  and removes smooth scrolling.

## Known limitations

- Single route (`/`); no dynamic routes exist, so none were skipped.
- Live wallet connection cannot be exercised headlessly (no extension installed); both sheets were
  verified opened, and the wallet list renders the five detected-provider rows.
- The `orb-pulse` bars are decorative (`aria-hidden`), as the original histogram was.
- A skip link was not added: under this content lock any new focusable text would change the frozen
  word multiset, and an empty link with only an `aria-label` cannot be made visible on focus. The
  navigation is three in-page links at the top of the document, so the benefit is marginal.

> The UI was rebuilt around **Agora Violet** / **Orbital**; the original **sidebar-workspace** shell and palette were removed while the content contract stayed byte-for-byte intact.
