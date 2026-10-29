# Reskin art direction — Spectrum Terminal

> Selected automatically. Do not ask the user to confirm or choose another direction.

- **Style DNA:** `solana-spectrum` (performance-brutalist)
- **Skeleton:** `terminal-console` (linear)
- **Seed:** `7d7e75433e309a8f524d7d974202b0617bc32eab40fb525a2db662692fa30d34`
- **Source DNA:** [https://solana.com](https://solana.com)
- **Live sampled:** yes — https://solana.com (6027 ms)
- **Original:** gallery-scroll / light / accent #298dff

## Why this direction

The selector sampled 8/10 blockchain references, scored every direction for perceptual distance from the original accent (#298dff) and background (#ffffff), added a deterministic seed jitter, and chose Spectrum Terminal because it is 59 ΔE away from the original accent and pairs with Terminal Console, a linear skeleton rather than the original gallery-scroll.

## Live reference sampling

| Style | URL | Result | Accent sampled | Ground sampled |
|---|---|---|---|---|
| ethereum-paper | https://ethereum.org | ok (3808 ms) | #0c5681 | #ffffff |
| base-cobalt | https://www.base.org | ok (4772 ms) | #0000ff | #dde3e9 |
| polygon-agora | https://polygon.technology | ok (5955 ms) | #670de5 | #000000 |
| solana-spectrum | https://solana.com | ok (6027 ms) | #9945ff | #000000 |
| arbitrum-signal | https://arbitrum.io | failed: HTTP 403 | — | — |
| aave-abyss | https://aave.com | ok (5949 ms) | #ff0000 | #000000 |
| cosmos-orbit | https://cosmos.network | ok (5405 ms) | #40b3ff | #000000 |
| uniswap-bubblegum | https://uniswap.org | ok (12094 ms) | — | #ffffff |
| optimism-poster | https://www.optimism.io | ok (13207 ms) | #ff0421 | #fafaf9 |
| sui-tidal | https://sui.io | failed: timeout | — | — |

Live sampling is evidence, not a copy target. Never download or reuse a reference site's logo, imagery, copy, or code. Use only the abstract tokens below.

## Candidate ranking

| Candidate | Score | Accent ΔE from original | Layout | Live |
|---|---:|---:|---|---|
| Spectrum Terminal | 0.9364 | 58.9 | terminal-console | yes |
| Cobalt Blueprint | 0.8273 | 83.9 | command-rail | yes |
| Abyss Liquidity | 0.8195 | 148.1 | command-rail | yes |
| Agora Violet | 0.7673 | 59.4 | documentary | yes |
| Paper Protocol | 0.7572 | 45.3 | documentary | yes |
| Signal Navy | 0.7395 | 38.7 | command-rail | no |
| Cosmos Orbit | 0.7194 | 28.8 | documentary | yes |
| Poster Optimism | 0.713 | 139.1 | ticker-stage | yes |
| Bubblegum Exchange | 0.4914 | 90.9 | split-stage | yes |
| Tidal Sui | 0.3907 | 22.2 | bento-canvas | no |

## Skeleton brief

**Terminal Console** — thin status bar at the very top; monospace micro-labels and tabular data everywhere; dense two-pane console with a resizable-feeling gutter; no marketing hero; the data is the hero; bottom command hint strip.

Navigation: Top status bar with route names as commands; keyboard shortcuts shown; a command palette is the primary way to move.

Structure:
1. 24-32px status bar
1. command/title line
1. dense 3-pane console: filters, data, detail
1. bottom hint strip

Content mapping: Preserve every table row and label. Turn filters into console chips, metrics into sparkline headers, forms into inline command rows. Detail panel shows the selected row's existing fields.

Recipe: `.statusbar{position:sticky;top:0;display:flex;justify-content:space-between;padding:6px 12px;border-bottom:1px solid var(--line);font:11px/1.4 var(--font-mono)}.console{display:grid;grid-template-columns:200px minmax(0,1fr) 280px;min-height:calc(100vh - 64px)}.pane+.pane{border-left:1px solid var(--line)}.console table{font-variant-numeric:tabular-nums}`

Risks: dense does not mean tiny: body text must stay >=14px and contrast >=4.5; three panes collapse badly on mobile; use a single column + drawer

## Design tokens

```css
:root {
  --bg: #000000;
  --surface: #0B0B0C;
  --surface-alt: #161618;
  --ink: #FFFFFF;
  --muted: #9B9B9F;
  --accent: #9945ff;
  --accent-safe: #9945ff;
  --accent-2: #14F195;
  --line: #29292D;
  --success: #14F195;
  --danger: #FF5C7A;
  --warning: #FFD166;

  --font-display: "Arial Narrow", "Helvetica Neue", "Segoe UI", sans-serif;
  --font-body: "Helvetica Neue", "Segoe UI", sans-serif;
  --font-mono: "IBM Plex Mono", "Cascadia Mono", ui-monospace, monospace;
  --display-weight: 800;
  --display-tracking: -0.055em;
  --label-tracking: 0.2em;

  --radius-sm: 0px;
  --radius-md: 2px;
  --radius-lg: 4px;
  --border: 1px solid var(--line);
  --shadow: 0 0 40px rgba(153, 69, 255, 0.24);

  --motion-duration: 120ms;
  --motion-ease: cubic-bezier(.2,.9,.1,1);
  --space-1: clamp(4px, .35vw, 6px);
  --space-2: clamp(8px, .7vw, 12px);
  --space-3: clamp(14px, 1.2vw, 20px);
  --space-4: clamp(22px, 2vw, 32px);
  --space-5: clamp(36px, 3.4vw, 56px);
  --space-6: clamp(56px, 5vw, 88px);
  --page-pad: clamp(18px, 4vw, 64px);
  --max-width: 1440px;
}
```

## Component grammar

- Surface: 1px solid var(--line); radius 2px; shadow 0 0 40px rgba(153, 69, 255, 0.24).
- Type: display **"Arial Narrow", "Helvetica Neue", "Segoe UI", sans-serif** at weight 800, tracking -0.055em; body **"Helvetica Neue", "Segoe UI", sans-serif**; numerals and micro-labels **"IBM Plex Mono", "Cascadia Mono", ui-monospace, monospace**.
- Texture: spectrum gradient shards, scanline grain, status LEDs, ticker strips.
- Motion: fast, 120ms, cubic-bezier(.2,.9,.1,1). Always wrap non-essential motion in `@media (prefers-reduced-motion: no-preference)`.
- Density: dense. Keep body text >= 14px and body contrast >= 4.5:1.
- Use `--accent-safe` for text and icons on `--bg`; use `--accent` for fills and large shapes.

## Originality guard

The replacement must satisfy all of these:

1. The source inventory archetype is `gallery-scroll`; the new skeleton is `terminal-console`. Do not fall back to the old shell during implementation.
2. Do not reuse any original class name, CSS selector, design token name, or original accent family.
3. Rewrite templates, not only CSS. Every route must visibly use the new skeleton.
4. Keep every token in `.reskin/content-contract.json`; move it, never rewrite it.
5. Run `node scripts/verify.mjs check` and do not stop until content, structure, accessibility and responsive checks pass.

## Commit statement

Use this sentence in the final report: "The UI was rebuilt around Spectrum Terminal / Terminal Console; the original gallery-scroll shell and palette were removed while the content contract stayed byte-for-byte intact."
