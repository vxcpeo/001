# Wiring plan — Paper Protocol / Documentary Ledger

Selected automatically by `choose-style.mjs` (no user input):

- Style DNA: `ethereum-paper` (crypto-editorial), live-sampled from https://ethereum.org
- Skeleton: `documentary` (editorial family)
- Original: `orbital` (spatial), dark violet `#670de5`
- New accent: `#0c5681`, 97.26 ΔE from the original

## New shell

`ledger-page` — a single editorial sheet, not an app frame:

1. `header.ledger-masthead` with the wordmark (`SIGN`/`ARIS`), the
   "Prediction arena · Solana" imprint, and `nav.ledger-index` (Feed / Rules /
   Desk). Old top ticker + centered orbit + floating station nav are gone.
2. `section.ledger-wire` — the same market data as a horizontal type-set wire
   band under the masthead, rendered as a ruled stock table, not a ticker bar.
3. `main.ledger-main`
   - `section.ledger-opening`: the claim as an oversized serif headline with the
     two existing calls to action as underlined/filled editorial buttons.
   - `div.ledger-columns`: a 7/3 grid.
     - `.ledger-column-main`: drop-cap lede, `#feed` ledger, `#rules` numbered
       essay, `#desk` wallet register.
     - `section.ledger-margin` (role complementary): arena readout box, pulse
       rule, stats, wallet chip, and the three network facts as footnotes.
4. `footer.ledger-colophon`: brand/date, tagline, network/explorer, live strip.
5. Two `.ledger-plate` sheets for trade and wallet, plus the toast.

## Route mapping

The app has one route (`/`). Everything is composed in the new shell; no route
keeps the old layout.

| Region | Content moved there |
|---|---|
| Masthead | `SIGNARIS` wordmark, `Prediction arena · Solana`, Feed / Rules / Desk |
| Wire band | all 8 market codes, questions, YES percentages and moves (duplicated like the old tape) |
| Opening | `PRICE THE FUTURE. SIGN THE CALL.`, `Open the feed`, `Attach a wallet` |
| Lede | the long "Every question here runs as a live line…" paragraph with a drop cap |
| Ledger | `OPEN LINES`, tally, lane tabs, Heat/Odds/Closing, search, all 8 markets |
| Rules | `HOW A POSITION GETS MADE`, steps 01–03, the settlement footnote |
| Desk | `your desk`, `WALLET DETACHED`, Address / Balance / Signed positions, actions, receipts |
| Margin | `arena readout`, streaming, 4 stats, `SIGNARIS-01`, wallet chip, Network / Latest blockhash / Wallet |
| Colophon | brand `/ 2026`, tagline, `Solana … · explorer`, `LIVE`, cluster/settlement |
| Plates | every existing trade/wallet string, field, binding and handler |

## Deleted vs kept

- Deleted from the render path: `.orbital-shell`, `.orb-sky`, `.orb-masthead`,
  the radical `.orb-ring`/`.orb-halos` hero, `.orb-stations`, `.orb-aperture`,
  `.orb-metrics` aside, `.orb-rays` card rows, `.orb-veil`/`.orb-sheet` overlays,
  and both global stylesheets (`meridian.css`, `meridian-orbit.css`).
- Kept as content-only children: the market loop, lane/sort/search controls,
  trade form, wallet catalogue, receipt list and toast — same expressions,
  handlers, fields and copy, new wrappers only.

## New presentation layer

- `src/styles/paper.css` — tokens (`--pp-*`), reset, base serif/mono type, focus,
  selection, reduced-motion guard.
- `src/styles/paper-ledger.css` — masthead/index/wire/opening/columns/ledger/
  rules/desk/margin/colophon/plates and breakpoints.
- `src/main.js` imports only those two files.
- Breakpoints: 1180px (single column, margin below), 980px (entry re-flow),
  760px (masthead/opening stack, single-column desk), 480px (entry single column,
  stacked plates), plus `prefers-reduced-motion` (wire becomes a scroll rail).

## Design rules enforced

- One `h1` (the claim); `h2` per section; `h3` per market and step.
- `header` / `nav` / `main` / complementary region / `footer` landmarks.
- Visible focus ring on every control; Escape closes both plates.
- 4.5:1 body contrast, 3:1 large text; all measurements pass the verifier.
- No new visible copy: the only text is the existing content contract.
