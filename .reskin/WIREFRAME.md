# Wireframe commitment — Agora Violet / Orbital

Committed before any markup edit. Every route uses this archetype; there is no fallback shell.

## Direction

- Style: **Agora Violet** (`polygon-agora`, technical-editorial) — black ground, violet bloom,
  hairline geometry, mono metadata gutters, index numerals.
- Skeleton: **orbital** (spatial). Original was `sidebar-workspace` (shell).
- Accent: `#670de5` (201.7 ΔE from the original `#c6ff2e`).

## New shell

`OrbitalShell` is not a component file; the shell is the root of `App.vue` (single-route SPA, no router).

```
div.orbital-shell
├─ div.orb-sky                     (decorative bloom + horizon arc, aria-hidden)
├─ main.orb-main
│  ├─ section.orb-tape             (the ticker, moved to the very top as a signal tape)
│  ├─ div.orb-stage
│  │  ├─ div.orb-masthead          (hairline · circular brand seal · hairline)
│  │  ├─ div.orb-ring              (square orbit field)
│  │  │  ├─ div.orb-halos          (3 concentric circles + conic sweep, aria-hidden)
│  │  │  ├─ nav.orb-stations       (Feed / Rules / Desk on the ring)
│  │  │  └─ div.orb-core           (circular core: kicker, h1 claim, CTA pair)
│  │  ├─ div.orb-aperture          (focused panel: lede + three facts)
│  │  └─ aside.orb-metrics         (secondary arc of metrics + radial pulse + seal)
│  ├─ section#feed.orb-lines       (centered plate head, orbit tablets, ray ledger)
│  ├─ section#rules.orb-moves      (diagonal arc of three numbered stations)
│  └─ section#desk.orb-desk        (wallet disc + arc of nodes + slip ledger)
└─ footer.orb-foot                 (outer-ring band + relocated LIVE/cluster strip)
   + trade sheet, wallet sheet, toast (overlays, unchanged behaviour)
```

Landmarks: `main`, `nav` (inside the ring), `aside` (metrics), `footer`. **No `header` element
anywhere** — the original landmark sequence (header, nav, main, aside, 9×header, footer) is gone.

## Route-to-layout mapping (`/` only)

| Region | Holds (content moved, never retyped) |
|---|---|
| `section.orb-tape` | ticker `v-for` over `[...tickerItems, ...tickerItems]` |
| `nav.orb-stations` | the three static nav links `Feed` / `Rules` / `Desk` |
| `div.orb-core` | `Prediction arena · Solana`, h1 spans, `Open the feed` + `{{ connected ? 'Your desk' : 'Attach a wallet' }}` |
| `div.orb-aperture` | the hero lede paragraph + `Network` / `Latest blockhash` / `Wallet` facts |
| `aside.orb-metrics` | `arena readout` / `streaming`, `arenaStats` v-for, the 22 pulse bars, `PROBENOX-01`, the wallet chip, wallet status |
| `section.orb-lines` | `the feed` / `OPEN LINES` / count, lanes tablist, sort group, search input, 8 `article` rays, empty state |
| `section.orb-moves` | `three moves` / `HOW A POSITION GETS MADE` / 3 numbered items / closing note |
| `section.orb-desk` | `your desk`, wallet h2, Address / Balance / Signed positions nodes, actions, receipt slips |
| `footer.orb-foot` | brand `/ 2026`, tagline, cluster + explorer link, then the LIVE + cluster/settlement strip |

## Composition change per region (not a recolor)

- Masthead: no top bar, no logo-left / nav-center / CTA-right. The brand is a **circular seal flanked
  by hairlines**, centered. The wallet chip that used to sit in the top bar is relocated into the
  **arena-readout console foot** (next to `PROBENOX-01` and the wallet state line), so the corner
  capsule of the old top bar disappears completely.
- Navigation: was a horizontal 3-link row in a top bar → now **three stations positioned on the
  orbit ring** at −34°/0°/+34°, counter-rotated to stay upright; on mobile a **vertical arc**
  (staircased column) at the top of the stage.
- Hero: was a 2-column split (copy left / stat panel right) → now a **circular core** with the
  claim centered, a wide **aperture panel** below it, and the metrics as a **shallow arc** of nodes.
- Ticker: was a strip after the hero → now the **first band of the page** (signal tape).
- Feed: was a responsive **3-column card grid** → now a staggered **ray ledger**: one row per
  market with a circular odds dial, metadata gutter, and stacked YES/NO actions.
- Rules: was **three equal cards in a row** → now a **diagonal arc** of numbered stations with a
  hairlined connector.
- Desk: was a **horizontal strip** with 3 inline stats → now a **wallet disc** with the status h2
  inside, an arc of three nodes under it, and a slip ledger.
- Footer: single row → **outer-ring band** plus the LIVE/cluster strip relocated from the top.

## Old components / CSS removed from the render path

- `src/style.css` (arena skin, 35 KB) — deleted; `main.js` no longer imports it.
- All original class names (`.nl`, `.strip`, `.bar`, `.hero`, `.panel`, `.ticker`, `.card`,
  `.rules`, `.desk`, `.foot`, `.sheet`, `.veil`, `.toast`, …) disappear from the DOM.
- No layout component files existed; the template is rewritten in place.

## New CSS

- `src/styles/meridian.css` — tokens, reset, base type, focus, motion guard.
- `src/styles/meridian-orbit.css` — shell, orbit, tape, lines, moves, desk, foot, sheets, responsive.
- Token names are new (`--bg`, `--surface`, `--accent`, `--accent-safe`, `--line`, `--space-*`,
  `--radius-*`, `--font-*`); the only names shared with the style guide are the SAML DNA tokens,
  never the old product tokens (`--hot`, `--volt`, `--ice`, `--void`, `--slab`, …).
- Class namespace: `orb-` / `orbital-`. Breakpoints: 1180, 980, 860 (nav), 640.

## Access and responsive commitments

- One `h1` (the core claim); `h2` per section; `h3` per ray and per rule.
- Focus ring: 2px `--accent-safe`, 3px offset, on every interactive element.
- Mobile: ring collapses (halos hidden), core becomes a rounded panel, stations become a vertical
  arc, ray ledger becomes one column, every control stays visible (nothing hidden to fit).
- All motion (tape drift, bloom pulse) wrapped in `@media (prefers-reduced-motion: no-preference)`.
