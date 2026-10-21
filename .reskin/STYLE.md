# Reskin art direction — Cobalt Blueprint

> Selected automatically. Do not ask the user to confirm or choose another direction.

- **Style DNA:** `base-cobalt` (optimistic-modern)
- **Skeleton:** `bento-canvas` (spatial)
- **Seed:** `8f80267ea62c5ce4829ee456fca0896593da40719d9b94efdd68edd38f782881`
- **Source DNA:** [https://www.base.org](https://www.base.org)
- **Live sampled:** yes — https://www.base.org (2737 ms)
- **Original:** marketing-stack / dark / accent #0c5681

## Why this direction

The selector sampled 9/10 blockchain references, scored every direction for perceptual distance from the original accent (#0c5681) and background (#0a0a0a), added a deterministic seed jitter, and chose Cobalt Blueprint because it is 114 ΔE away from the original accent and pairs with Bento Canvas, a spatial skeleton rather than the original marketing-stack.

## Live reference sampling

| Style | URL | Result | Accent sampled | Ground sampled |
|---|---|---|---|---|
| ethereum-paper | https://ethereum.org | ok (2468 ms) | #0c5681 | #ffffff |
| base-cobalt | https://www.base.org | ok (2737 ms) | #0000ff | #dde3e9 |
| polygon-agora | https://polygon.technology | ok (3007 ms) | #670de5 | #000000 |
| solana-spectrum | https://solana.com | ok (3428 ms) | #9945ff | #000000 |
| arbitrum-signal | https://arbitrum.io | failed: HTTP 403 | — | — |
| aave-abyss | https://aave.com | ok (3027 ms) | #ff0000 | #000000 |
| cosmos-orbit | https://cosmos.network | ok (3581 ms) | #40b3ff | #000000 |
| optimism-poster | https://www.optimism.io | ok (7179 ms) | #ff0421 | #fafaf9 |
| uniswap-bubblegum | https://uniswap.org | ok (7263 ms) | — | #ffffff |
| sui-tidal | https://sui.io | ok (5191 ms) | #298dff | #ffffff |

Live sampling is evidence, not a copy target. Never download or reuse a reference site's logo, imagery, copy, or code. Use only the abstract tokens below.

## Candidate ranking

| Candidate | Score | Accent ΔE from original | Layout | Live |
|---|---:|---:|---|---|
| Cobalt Blueprint | 0.9566 | 114.2 | bento-canvas | yes |
| Bubblegum Exchange | 0.9158 | 81.2 | split-stage | yes |
| Abyss Liquidity | 0.8472 | 130.1 | orbital | yes |
| Poster Optimism | 0.7943 | 119.7 | ticker-stage | yes |
| Tidal Sui | 0.7838 | 43.6 | split-stage | yes |
| Spectrum Terminal | 0.7541 | 89.2 | ticker-stage | yes |
| Agora Violet | 0.7529 | 89.5 | bento-canvas | yes |
| Signal Navy | 0.6638 | 42.5 | terminal-console | no |
| Cosmos Orbit | 0.5873 | 39.1 | orbital | yes |
| Paper Protocol | 0.4222 | 0 | split-stage | yes |

## Skeleton brief

**Bento Canvas** — no persistent sidebar; 12-column modular tile grid with mixed spans; one oversized anchor tile per page; tiles touch a shared canvas instead of sitting in a content well; navigation is a slim top index, not a full-width app bar.

Navigation: Slim top index with section names; active item is a filled chip; actions live in the hero tile or a floating corner dock.

Structure:
1. slim top index
1. oversized anchor tile (8 columns) + two stacked support tiles (4 columns)
1. three equal data tiles
1. full-bleed data band
1. thin footer line

Content mapping: Put the page's primary number or title in the anchor tile. Distribute secondary metrics into support tiles. Tables become full-bleed bands with sticky column labels. Forms become a two-column tile with the submit action in the tile footer.

Recipe: `display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:clamp(10px,1.2vw,18px); .tile{grid-column:span 4;border:1px solid var(--line);background:var(--surface);border-radius:var(--radius-md)} .tile--anchor{grid-column:span 8;min-height:clamp(280px,38vh,460px)}`

Risks: tiles can become the old cards with new paint; must vary spans and alignment, not just card radius

## Design tokens

```css
:root {
  --bg: #dde3e9;
  --surface: #FFFFFF;
  --surface-alt: #EFEFEA;
  --ink: #0A0B0D;
  --muted: #6F6F6F;
  --accent: #0000ff;
  --accent-safe: #0000ff;
  --accent-2: #7575FF;
  --line: #E2E2DC;
  --success: #00875A;
  --danger: #C4320A;
  --warning: #9A6700;

  --font-display: "Inter Tight", "Segoe UI", system-ui, sans-serif;
  --font-body: "Inter", "Segoe UI", system-ui, sans-serif;
  --font-mono: "Geist Mono", "Cascadia Mono", ui-monospace, monospace;
  --display-weight: 620;
  --display-tracking: -0.035em;
  --label-tracking: 0.08em;

  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 30px;
  --border: 1px solid var(--line);
  --shadow: 0 24px 60px rgba(10, 11, 13, 0.08);

  --motion-duration: 170ms;
  --motion-ease: cubic-bezier(.2,.8,.2,1);
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

- Surface: 1px solid var(--line); radius 18px; shadow 0 24px 60px rgba(10, 11, 13, 0.08).
- Type: display **"Inter Tight", "Segoe UI", system-ui, sans-serif** at weight 620, tracking -0.035em; body **"Inter", "Segoe UI", system-ui, sans-serif**; numerals and micro-labels **"Geist Mono", "Cascadia Mono", ui-monospace, monospace**.
- Texture: blueprint hairlines, cobalt focus rings, monochrome diagrams, large numeric counters.
- Motion: crisp, 170ms, cubic-bezier(.2,.8,.2,1). Always wrap non-essential motion in `@media (prefers-reduced-motion: no-preference)`.
- Density: airy. Keep body text >= 14px and body contrast >= 4.5:1.
- Use `--accent-safe` for text and icons on `--bg`; use `--accent` for fills and large shapes.

## Originality guard

The replacement must satisfy all of these:

1. The source inventory archetype is `marketing-stack`; the new skeleton is `bento-canvas`. Do not fall back to the old shell during implementation.
2. Do not reuse any original class name, CSS selector, design token name, or original accent family.
3. Rewrite templates, not only CSS. Every route must visibly use the new skeleton.
4. Keep every token in `.reskin/content-contract.json`; move it, never rewrite it.
5. Run `node scripts/verify.mjs check` and do not stop until content, structure, accessibility and responsive checks pass.

## Commit statement

Use this sentence in the final report: "The UI was rebuilt around Cobalt Blueprint / Bento Canvas; the original marketing-stack shell and palette were removed while the content contract stayed byte-for-byte intact."
