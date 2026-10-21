# Wireframe commitment — Oddix, Round 7

Direction: **Abyss Liquidity** (`aave-abyss`, dark-technical) × **Command Rail**
(`command-rail`, linear). Original: `dashboard-shell` (bento + sticky index, light).

## Shell

- `OxShell.vue` is not a separate component: the shell is the root `<div class="ox-page">`
  in `App.vue`, the only route component. Old shell classes (`bp-*`) are gone from the
  render path; `blueprint.css` / `blueprint-bento.css` are removed from `main.js` and
  archived.
- New global sheet: `src/styles/abyss.css` (tokens + reset + shell + components,
  `ox-` prefix only).
- One route `/` → Command Rail layout.

## Region map (desktop ≥ 1024px)

| Region | Element | Content it carries |
|---|---|---|
| Fixed spine | `nav.ox-rail` (aria-label `Primary`), 76px, left edge | the three nav targets: Feed, Rules, Desk as glyph + rotated micro-label; no logo block |
| Floating command bar | `header.ox-command`, sticky 18px from top | brand lockup (`ODD`/`IX` + diamond mark, `href="#feed"`), imprint `Prediction arena · Solana`, the search field (`Search lines`), `Open the feed`, `Attach a wallet` / `Your desk` |
| Running head | `section.ox-head` | `h1` `PRICE THE / FUTURE. / SIGN THE CALL.` at display scale, then the lede paragraph as a standfirst |
| Tape | `aside.ox-tape` (aria-label `Latest lines`) | the `wireItems` marquee, unchanged v-for |
| Data stage | `div.ox-stage`: `section#feed` (1.55fr) + `aside.ox-margin` (.45fr) | feed: lanes, sorts, book rows, empty state. margin: arena readout (`08`, `$1.53M`, `6,916`, `0.20%`, pulse, seal, wallet chip, facts) then `section#desk` (wallet nodes, actions, receipts) |
| Moves | `section#rules.ox-moves` | `three moves`, `HOW A POSITION GETS MADE`, 01/02/03, note |
| Status strip | `footer.ox-status` | brand/2026, tagline, network nav, `LIVE`, program line, cluster/settlement |
| Trade + wallet | `div.ox-veil` + `section.ox-drawer` (right drawer, role=dialog) | unchanged dialogs, restyled as a right-hand command drawer |
| Toast | `p.ox-toast` (role=status) | unchanged |

## Mobile (≤ 720px)

- The rail becomes a fixed bottom glyph bar (three links, visible labels, 74px),
  keyboard reachable, no hamburger, no hidden nav.
- Command bar collapses to two rows: brand + actions, search full width.
- Stage becomes a single linear column: head → tape → feed → readout → desk →
  rules → status. Nothing is hidden or reordered out of existence.
- Display type clamps down; every control stays ≥ 44px tall.

## Deletions / retentions

- Deleted from render path: `bp-page` shell, `bp-topbar`, `bp-wire`, `bp-canvas`,
  bento tiles, `bp-footer`, bento CSS. Archived under `output/reskin-round7-old/`.
- Retained as content-only markup: the wire aside, readout `dl`, facts, receipts,
  lane tabs, sorts, search, book rows, dialogs, toast — all bindings, handlers and
  text tokens moved verbatim.
- New CSS token file and breakpoints: 1280 / 1024 / 720 / 480.

## Rules of the rebuild

- Zero `bp-` classes, zero `--bp-` tokens, zero shared selectors.
- No new visible copy; no duplicated tokens; no CSS `content:` copy.
- Accent `#ff0000` fills, `#ff6b6b` for accent text on glass; teal/magenta glow only
  as decoration behind content.
- `prefers-reduced-motion` guards the marquee, the pulse and the drawer.
