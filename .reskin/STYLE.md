# Reskin art direction — Agora Violet

> Selected automatically. Do not ask the user to confirm or choose another direction.

- **Style DNA:** `polygon-agora` (technical-editorial)
- **Skeleton:** `orbital` (spatial)
- **Seed:** `f6b28c4bad8e4dbacbbd08626a4193849c370abc84423fe189e1a8fa8099cc36`
- **Source DNA:** [https://polygon.technology](https://polygon.technology)
- **Live sampled:** yes — https://polygon.technology (1888 ms)
- **Original:** sidebar-workspace / light / accent #c6ff2e

## Why this direction

The selector sampled 9/10 blockchain references, scored every direction for perceptual distance from the original accent (#c6ff2e) and background (#f4f4ff), added a deterministic seed jitter, and chose Agora Violet because it is 202 ΔE away from the original accent and pairs with Orbital, a spatial skeleton rather than the original sidebar-workspace.

## Live reference sampling

| Style | URL | Result | Accent sampled | Ground sampled |
|---|---|---|---|---|
| ethereum-paper | https://ethereum.org | ok (1174 ms) | #0c5681 | #ffffff |
| polygon-agora | https://polygon.technology | ok (1888 ms) | #670de5 | #000000 |
| base-cobalt | https://www.base.org | ok (2627 ms) | #0000ff | #dde3e9 |
| solana-spectrum | https://solana.com | ok (2547 ms) | #9945ff | #000000 |
| arbitrum-signal | https://arbitrum.io | failed: HTTP 403 | — | — |
| uniswap-bubblegum | https://uniswap.org | ok (1506 ms) | — | #ffffff |
| aave-abyss | https://aave.com | ok (1238 ms) | #ff0000 | #000000 |
| cosmos-orbit | https://cosmos.network | ok (2053 ms) | #40b3ff | #000000 |
| optimism-poster | https://www.optimism.io | ok (3823 ms) | #ff0421 | #fafaf9 |
| sui-tidal | https://sui.io | ok (2303 ms) | #298dff | #ffffff |

Live sampling is evidence, not a copy target. Never download or reuse a reference site's logo, imagery, copy, or code. Use only the abstract tokens below.

## Candidate ranking

| Candidate | Score | Accent ΔE from original | Layout | Live |
|---|---:|---:|---|---|
| Agora Violet | 0.9752 | 201.7 | orbital | yes |
| Cosmos Orbit | 0.9734 | 137.4 | orbital | yes |
| Signal Navy | 0.9231 | 126.4 | command-rail | no |
| Paper Protocol | 0.9037 | 133.9 | split-stage | yes |
| Spectrum Terminal | 0.8928 | 202.2 | terminal-console | yes |
| Abyss Liquidity | 0.865 | 130.9 | command-rail | yes |
| Cobalt Blueprint | 0.847 | 235.6 | command-rail | yes |
| Poster Optimism | 0.8432 | 127.8 | ticker-stage | yes |
| Bubblegum Exchange | 0.7696 | 146.5 | split-stage | yes |
| Tidal Sui | 0.7593 | 166.8 | split-stage | yes |

## Skeleton brief

**Orbital** — centered radial composition with concentric rings; route navigation arranged around the primary object; content revealed in a focused panel inside the orbit; very few straight edges; circular masks and arcs; large empty space around the core.

Navigation: Circular route ring around the core with accessible names; keyboard tab order follows the ring; mobile becomes a vertical arc.

Structure:
1. core object with the page's primary figure
1. orbit ring with routes
1. focused content panel
1. secondary arc of metrics
1. footer on the outer ring

Content mapping: The primary metric becomes the core. Secondary metrics sit on the inner ring. Tables become a focused panel with a record switcher. Forms become a side panel that opens from the ring.

Recipe: `.orbit{position:relative;min-height:100svh;display:grid;place-items:center}.ring{position:absolute;inset:8%;border:1px solid var(--line);border-radius:50%}.core{width:min(46vw,520px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,var(--surfaceAlt),var(--surface))}.route{position:absolute;left:50%;top:50%;transform:rotate(var(--a)) translateX(var(--r)) rotate(calc(-1 * var(--a)))}`

Risks: circular layouts can break reading order; DOM order must match visual order; must collapse to a linear layout on mobile

## Design tokens

```css
:root {
  --bg: #000000;
  --surface: #141415;
  --surface-alt: #1F1E20;
  --ink: #F2F3F7;
  --muted: #A0A1A6;
  --accent: #670de5;
  --accent-safe: #9f45ff;
  --accent-2: #A97BFF;
  --line: #2B2930;
  --success: #5CE1A0;
  --danger: #FF8A8A;
  --warning: #F2C94C;

  --font-display: "Space Grotesk", "Century Gothic", "Segoe UI", sans-serif;
  --font-body: "Inter", "Segoe UI", system-ui, sans-serif;
  --font-mono: "PolySans Mono", "Cascadia Mono", ui-monospace, monospace;
  --display-weight: 520;
  --display-tracking: -0.045em;
  --label-tracking: 0.14em;

  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 12px;
  --border: 1px solid var(--line);
  --shadow: 0 0 0 1px rgba(169, 123, 255, 0.08), 0 30px 90px rgba(0, 0, 0, 0.55);

  --motion-duration: 260ms;
  --motion-ease: cubic-bezier(.16,1,.3,1);
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

- Surface: 1px solid var(--line); radius 6px; shadow 0 0 0 1px rgba(169, 123, 255, 0.08), 0 30px 90px rgba(0, 0, 0, 0.55).
- Type: display **"Space Grotesk", "Century Gothic", "Segoe UI", sans-serif** at weight 520, tracking -0.045em; body **"Inter", "Segoe UI", system-ui, sans-serif**; numerals and micro-labels **"PolySans Mono", "Cascadia Mono", ui-monospace, monospace**.
- Texture: violet bloom, index numerals, hairline rules, mono metadata gutters.
- Motion: measured, 260ms, cubic-bezier(.16,1,.3,1). Always wrap non-essential motion in `@media (prefers-reduced-motion: no-preference)`.
- Density: compact. Keep body text >= 14px and body contrast >= 4.5:1.
- Use `--accent-safe` for text and icons on `--bg`; use `--accent` for fills and large shapes.

## Originality guard

The replacement must satisfy all of these:

1. The source inventory archetype is `sidebar-workspace`; the new skeleton is `orbital`. Do not fall back to the old shell during implementation.
2. Do not reuse any original class name, CSS selector, design token name, or original accent family.
3. Rewrite templates, not only CSS. Every route must visibly use the new skeleton.
4. Keep every token in `.reskin/content-contract.json`; move it, never rewrite it.
5. Run `node scripts/verify.mjs check` and do not stop until content, structure, accessibility and responsive checks pass.

## Commit statement

Use this sentence in the final report: "The UI was rebuilt around Agora Violet / Orbital; the original sidebar-workspace shell and palette were removed while the content contract stayed byte-for-byte intact."
