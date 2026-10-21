# Reskin art direction — Paper Protocol

> Selected automatically. Do not ask the user to confirm or choose another direction.

- **Style DNA:** `ethereum-paper` (crypto-editorial)
- **Skeleton:** `documentary` (editorial)
- **Seed:** `46637b75bf175cde03d5231c50eef00593a888d411b0832f58630428b8a41000`
- **Source DNA:** [https://ethereum.org](https://ethereum.org)
- **Live sampled:** yes — https://ethereum.org (3552 ms)
- **Original:** orbital / dark / accent #670de5

## Why this direction

The selector sampled 9/10 blockchain references, scored every direction for perceptual distance from the original accent (#670de5) and background (#000000), added a deterministic seed jitter, and chose Paper Protocol because it is 97 ΔE away from the original accent and pairs with Documentary Ledger, a editorial skeleton rather than the original orbital.

## Live reference sampling

| Style | URL | Result | Accent sampled | Ground sampled |
|---|---|---|---|---|
| base-cobalt | https://www.base.org | ok (3623 ms) | #0000ff | #dde3e9 |
| ethereum-paper | https://ethereum.org | ok (3552 ms) | #0c5681 | #ffffff |
| polygon-agora | https://polygon.technology | ok (3915 ms) | #670de5 | #000000 |
| solana-spectrum | https://solana.com | ok (4148 ms) | #9945ff | #000000 |
| arbitrum-signal | https://arbitrum.io | failed: HTTP 403 | — | — |
| aave-abyss | https://aave.com | ok (3319 ms) | #ff0000 | #000000 |
| cosmos-orbit | https://cosmos.network | ok (3119 ms) | #40b3ff | #000000 |
| uniswap-bubblegum | https://uniswap.org | ok (7139 ms) | — | #ffffff |
| optimism-poster | https://www.optimism.io | ok (8017 ms) | #ff0421 | #fafaf9 |
| sui-tidal | https://sui.io | ok (7852 ms) | #298dff | #ffffff |

Live sampling is evidence, not a copy target. Never download or reuse a reference site's logo, imagery, copy, or code. Use only the abstract tokens below.

## Candidate ranking

| Candidate | Score | Accent ΔE from original | Layout | Live |
|---|---:|---:|---|---|
| Paper Protocol | 0.9529 | 97.3 | documentary | yes |
| Poster Optimism | 0.8386 | 148 | ticker-stage | yes |
| Abyss Liquidity | 0.785 | 155.7 | terminal-console | yes |
| Signal Navy | 0.7476 | 104.2 | terminal-console | no |
| Cosmos Orbit | 0.7409 | 97.3 | documentary | yes |
| Bubblegum Exchange | 0.7118 | 92.7 | split-stage | yes |
| Tidal Sui | 0.7046 | 62.2 | split-stage | yes |
| Cobalt Blueprint | 0.5542 | 21.3 | command-rail | yes |
| Agora Violet | 0.5255 | 18.4 | documentary | yes |
| Spectrum Terminal | 0.4435 | 17.5 | ticker-stage | yes |

## Skeleton brief

**Documentary Ledger** — masthead instead of app bar; serif or high-contrast display voice with running-text rhythm; numbered sections and marginalia; tables styled as ledger rules, not cards; navigation is an index line under the masthead.

Navigation: Masthead with the brand as a wordmark, route names as an index line, and a thin rule. No pills, no filled app bar, no sidebar.

Structure:
1. masthead with issue/date line
1. index line of routes
1. hero statement spanning 9 columns
1. two-column body: 7-column ledger + 3-column marginalia
1. footnotes and colophon

Content mapping: Turn dashboard metrics into a lede paragraph with displayed figures. Tables become ledger rows with rules and tabular numerals. Forms become a typeset questionnaire. Keep every label and value; restyle hierarchy only.

Recipe: `.masthead{display:grid;grid-template-columns:1fr auto;align-items:end;border-bottom:2px solid var(--ink);padding-bottom:12px}.index{display:flex;gap:28px;border-bottom:1px solid var(--line);padding:12px 0;font:500 12px/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase}.body{display:grid;grid-template-columns:minmax(0,7fr) minmax(220px,3fr);gap:clamp(24px,5vw,72px)}.lede{font-size:clamp(2rem,4vw,4.6rem);line-height:.98}`

Risks: serif font alone is not a skeleton change; dense dashboards need tabular numerals and generous line-height

## Design tokens

```css
:root {
  --bg: #ffffff;
  --surface: #FFFDF8;
  --surface-alt: #EDE9DF;
  --ink: #1B1B1B;
  --muted: #6B675F;
  --accent: #0c5681;
  --accent-safe: #0c5681;
  --accent-2: #8B9DFF;
  --line: #D9D3C7;
  --success: #2F6B4F;
  --danger: #A83A2A;
  --warning: #8A5A00;

  --font-display: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  --font-body: "Charter", "Georgia", "Segoe UI", serif;
  --font-mono: "Courier New", ui-monospace, monospace;
  --display-weight: 500;
  --display-tracking: -0.025em;
  --label-tracking: 0.12em;

  --radius-sm: 0px;
  --radius-md: 2px;
  --radius-lg: 4px;
  --border: 1px solid var(--line);
  --shadow: none;

  --motion-duration: 300ms;
  --motion-ease: ease-out;
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

- Surface: 1px solid var(--line); radius 2px; shadow none.
- Type: display **"Iowan Old Style", "Palatino Linotype", Georgia, serif** at weight 500, tracking -0.025em; body **"Charter", "Georgia", "Segoe UI", serif**; numerals and micro-labels **"Courier New", ui-monospace, monospace**.
- Texture: newsprint rules, drop caps, marginalia labels, ether gradient wash.
- Motion: quiet, 300ms, ease-out. Always wrap non-essential motion in `@media (prefers-reduced-motion: no-preference)`.
- Density: comfortable. Keep body text >= 14px and body contrast >= 4.5:1.
- Use `--accent-safe` for text and icons on `--bg`; use `--accent` for fills and large shapes.

## Originality guard

The replacement must satisfy all of these:

1. The source inventory archetype is `orbital`; the new skeleton is `documentary`. Do not fall back to the old shell during implementation.
2. Do not reuse any original class name, CSS selector, design token name, or original accent family.
3. Rewrite templates, not only CSS. Every route must visibly use the new skeleton.
4. Keep every token in `.reskin/content-contract.json`; move it, never rewrite it.
5. Run `node scripts/verify.mjs check` and do not stop until content, structure, accessibility and responsive checks pass.

## Commit statement

Use this sentence in the final report: "The UI was rebuilt around Paper Protocol / Documentary Ledger; the original orbital shell and palette were removed while the content contract stayed byte-for-byte intact."
