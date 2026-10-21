# Wireframe — Cobalt Blueprint / Bento Canvas

Committed direction for the Round 6 rebuild. The selected style and skeleton come
from `.reskin/style.json`; this file records how the existing content was moved
into that skeleton before the template was written.

## Shell

| Item | Old (Paper Protocol / Documentary Ledger) | New (Cobalt Blueprint / Bento Canvas) |
|---|---|---|
| Shell class | `ledger-page` | `bp-page` |
| Top region | full-width masthead with imprint + index line | slim sticky top index: brand lockup, mono imprint, pill navigation |
| Data band | `ledger-wire` section under the masthead | `bp-wire` **aside** (full-bleed ticker, horizontal scroll) |
| Body | one main column + a narrow marginal rail inside it | 12-column bento canvas of white tiles on a graph-paper ground |
| Main composition | opening claim, ledger rows, essay, register | anchor hero tile + ink readout tile; brief tile + desk tile; full-bleed feed band; rules row |
| Footer | editorial colophon | thin footer: brand / tagline / network nav + live strip |
| Dialogs | full-screen veil + centred plate | same semantics, `bp-veil` + `bp-sheet`, restyled only |

## Route-to-layout mapping

Only one static route exists (`/`).

| Region | Tile span | Existing content it carries |
|---|---|---|
| `header.bp-topbar` | full width | brand `PRIS`/`MEL`, `Prediction arena · Solana`, nav `Feed` / `Rules` / `Desk` |
| `aside.bp-wire` | full width | `wireItems` ticker: code, question, yes %, move |
| `section.bp-hero` | 8 cols (anchor) | `h1` claim, `Open the feed`, `{{ connected ? 'Your desk' : 'Attach a wallet' }}` |
| `aside.bp-readout` | 4 cols, ink | `arena readout`, `streaming`, four `arenaStats`, pulse bars, `PRISMEL-01`, wallet chip, wallet state, three facts |
| `section.bp-brief` | 4 cols | the lede paragraph |
| `section#desk.bp-desk` | 8 cols | `your desk`, wallet-state `h2`, `Address` / `Balance on …` / `Signed positions`, four actions, receipt slips |
| `section#feed.bp-feed` | 12 cols, band | feed head, tally, lanes tablist, sorts, search input, 8 market rows (code, lane, clock, question, spark, split, delta, volume, heat, quote, YES/NO buttons, receipt line), empty state |
| `section#rules` | 12 cols | `three moves`, `HOW A POSITION GETS MADE`, three numbered move tiles, program note |
| `footer.bp-footer` | full width | brand / `2026`, tagline, network + `explorer` (`nav[aria-label=Network]`), `LIVE`, program text, cluster / settlement strip |
| `bp-veil` sheets | overlay | trade sheet and wallet sheet, all branches preserved |
| `transition name="pop"` | overlay | toast |

## Components

- **Deleted from the render path:** the whole `ledger-*` template, `paper.css`,
  `paper-ledger.css` (archived to `output/reskin-round6-old/`), the old serif /
  Courier type stacks and every `--pp-*` token.
- **Kept as content only:** the wallet catalogue, market data, dialog branches,
  receipt list, empty state, toast; the `<script setup>` block is unchanged
  except one presentation comment.
- **New:** `bp-` shell + tiles + sheet primitives, inline prism mark in the header
  and desk glyph, ink instrument panel, blueprint hairline ground, cobalt
  focus ring.

## Tokens and breakpoints

- `src/styles/blueprint.css` — tokens, reset, typographic base, focus, motion,
  `.bp-kicker` / `.bp-h2` / status colours.
- `src/styles/blueprint-bento.css` — shell, 12-column canvas, tiles, feed bands,
  sheets, footer, responsive rules.
- Breakpoints: `1100px` (hero/readout/brief/desk become full width), `860px`
  (moves stack, desk nodes stack, feed rows become `id | quote`, `main`,
  `sides` grid areas), `620px` (index wraps under the brand, claim shrinks,
  tools go full width).
- Mobile keeps every string visible; nothing is hidden to avoid layout work.
