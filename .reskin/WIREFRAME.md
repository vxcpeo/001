# Wireframe — Spectrum Terminal / Terminal Console

Style: `solana-spectrum` (performance-brutalist) · Skeleton: `terminal-console` (linear)
Original: `gallery-scroll` (spatial) / light / accent `#298dff`

## Shell

`TxShell` — one route, `/`. Four landmarks:

| Landmark | Element | Job |
|---|---|---|
| `header` | `.tx-bar` sticky, 34px | brand lockup, imprint, LIVE LED, `Feed`/`Rules`/`Desk` commands |
| `main` | `.tx-console` + `.tx-log` | 3-pane console (rail / data / readout) and the rules log |
| `footer` | `.tx-hints` | brand, tagline, network, live line, cluster/settlement meta |

No marketing hero: the claim sits in a compact command banner (`.tx-charge`) above the
console; the data pane is the visual centre of gravity.

## Route `/` composition

1. **Status bar** — brand link (`#feed`), `Prediction arena · Solana`, the three route
   commands, `LIVE`.
2. **Command banner** — `h1` claim on two display lines (`PRICE THE FUTURE.` / `SIGN THE CALL.`),
   standfirst in a mono block with a purple rule.
3. **Console**
   - **Rail (260px)**: `the feed` label, `N of N lines shown`, search field, lane chips,
     sort chips, `Open the feed`, wallet action, seal.
   - **Data (fluid)**: `OPEN LINES` header, wallet chip, doubled wire ticker, eight ruled
     line rows (code · lane · clock / question / quote + spark / yes-no split / move ·
     volume · traders / yes-no trade buttons / signed slip), empty state.
   - **Readout (320px)**: `arena readout` + `streaming`, 2×2 stats, pulse bars; desk block
     with `your desk`, nodes, actions, receipts; network facts; a ruled scope buffer.
4. **Rules log** — `three moves` / `HOW A POSITION GETS MADE` as three ruled log entries
   (01/02/03) plus the settlement note.
5. **Hint strip** — brand `Probvyn / 2026`, tagline, `Solana {cluster} · explorer`,
   program state, cluster / settlement / your key.
6. **Dialogs** — trade and wallet sheets restyled as terminal panels (square, hairline,
   mono tables); same branches, bindings and handlers.

Mobile (≤760px): the status bar wraps to two rows (brand + LIVE, then the three commands);
the banner stacks; console becomes one column in rail → data → readout order; rules log
stacks; dialogs become full-height sheets with internal scroll. No horizontal page
overflow; the only horizontal scroller is the wire ticker.

## Content mapping

- Every existing text fragment keeps its own node and its exact string; markup around it
  moves. `h1` stays a single `h1`; `h2` stays `OPEN LINES` and `HOW A POSITION GETS MADE`.
- Link counts stay `#feed` ×3, `#rules` ×1, `#desk` ×1 (brand, `Open the feed`, top-bar commands).
- The wire ticker keeps the `[...wireItems, ...wireItems]` duplicate expression.
- `forms`: one search input (`Search lines`) and one number input (`Stake in SOL`).
- No new visible copy. Decoration comes from borders, rules, gradients and pseudo-elements.

## Files

- New: `src/styles/terminal.css` (`--tx-*` tokens, `tx-` selectors, resets, console grid,
  components, dialogs, dock, responsive, reduced-motion).
- Rewritten: `src/App.vue` template only (`<script setup>` untouched).
- Removed from the render path: `src/styles/tidal.css` (archived to
  `output/reskin-round8-tidal/`), `td-*` classes and `--bg/--ink/--accent` token names.
- `src/main.js`: imports `./styles/terminal.css` only.
