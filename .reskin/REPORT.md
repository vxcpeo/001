# Reskin report — Signaris / Paper Protocol

## Direction

- **Style:** Paper Protocol — `ethereum-paper` crypto-editorial DNA (white paper,
  ink, ether blue, serif display voice, mono marginalia).
- **Source:** live sample of <https://ethereum.org> (3552 ms); abstract tokens only,
  no logo, imagery, copy or code was reused.
- **Live sampling:** 9/10 references answered (Arbitrum returned HTTP 403).
  Selection was deterministic from the sampled palette distance plus the seed.
- **Skeleton:** Documentary Ledger — masthead, index line, oversized serif claim,
  7/3 ledger + marginalia, numbered essay, colophon.
- **Original:** `orbital` (spatial), black ground, violet `#670de5`, centered
  ring hero and a ticker bar — all removed.

> The UI was rebuilt around **Paper Protocol** / **Documentary Ledger**; the
> original **orbital** shell and palette were removed while the content contract
> stayed byte-for-byte intact.

## Evidence

- **Content contract:** `6979f1b59b59…` (unchanged; 0 added/removed/changed source
  tokens). Rendered words **301 → 301**, numeric tokens **104 → 104**.
- **Verification:** `PASS` — `.reskin/VERIFICATION.md`.
- **DOM fingerprint similarity:** **0.277** (limit 0.50).
- **Landmark sequence similarity:** **0.400** (limit 0.68).
- **CSS class overlap:** **0.000** (limit 0.10) — no old class token survives.
- **Accent distance:** **97.26 ΔE** (`#670de5` → `#0c5681`; minimum 30).
- **Routes:** `/` — HTTP 200, 0 console errors, 0 page errors.
- **Accessibility:** axe serious/critical **0**, contrast **0/263 failures**,
  labels and alt audit clean, visible focus on tab, mobile navigation reachable.
- **Responsive:** no horizontal overflow at 1440×900 or 390×844; verified again in
  the interaction probe at desktop and mobile.
- **Interaction probe (`.probe/shoot.mjs`, injected mock provider):** the wallet
  plate offers all five catalogued wallets as "not installed" in a clean browser;
  with the mock provider the connect handshake runs, the balance renders
  **2.4800 SOL** from the stubbed RPC, submitting a stake performs
  `signTransaction` (155-byte message) then `sendTransaction`, and the row keeps
  `you signed YES · 0.100 SOL` as its receipt. 0 console errors; no overflow.

## Screenshots

- Baseline (orbital): `.reskin/baseline/home-desktop.png`, `home-mobile.png`
- Current (documentary): `.reskin/current/home-desktop.png`, `home-mobile.png`
- Interaction set: `.reskin/shots-r5/{desktop-top,desktop-feed,desktop-empty,
  desktop-trade,desktop-wallet,mobile-top,mobile-feed,mobile-trade}.png`
- Side by side: `output/playwright/reskin-r5-baseline-vs-current.png`

The baseline is a centered dark ring with a top tape and floating station labels;
the current page is a white broadsheet: masthead and index rule at the top, a
left-aligned 102px serif headline, a 7-column ruled ledger and a 3-column margin.
The first viewport, reading path, navigation pattern and data presentation all
differ, not just the palette.

## Changes

- **New shell:** `header.ledger-masthead` + `nav.ledger-index`,
  `section.ledger-wire`, `main.ledger-main` with `section.ledger-opening`,
  `div.ledger-columns` (`.ledger-column-main` + complementary
  `section.ledger-margin`), `footer.ledger-colophon`.
- **New component grammar:** ledger rows (`ol.ledger-book > li.ledger-entry`)
  with ruled rules and tabular numerals replace the radial cards; editorial
  numbered essay for the three moves; wallet register; paper plates for the
  trade/wallet dialogs.
- **New token layer:** `src/styles/paper.css` (`--pp-*` tokens, serif/mono base,
  focus, reduced motion) and `src/styles/paper-ledger.css` (all layout).
- **Removed:** `src/styles/meridian.css`, `src/styles/meridian-orbit.css`, both
  old imports, and every `orb-*` class from the render path. The two retired
  stylesheets are preserved in `output/reskin-round5-old/` for audit.
- **Kept:** all existing markup content, bindings, `v-for` loops, handlers,
  form fields, ids, paragraph copy, dialog copy and the `pop` transition name.
  Script logic untouched except renaming the local `tickerItems` computed to
  `wireItems` (presentational name only; no data or behaviour change).
- **Theme metadata:** `theme-color` and `color-scheme` switched from the dark
  skin to paper/light, matching the new surface.

## Accessibility and responsiveness

- Landmarks: `header`, `nav`, `main`, `role="complementary"`, `footer`; one `h1`,
  section `h2`s, `h3`s for markets and moves; order is logical.
- Every input has a programmatic label (`aria-label` for search and stake).
- Focus-visible ring (2px accent, 3px offset) on links, buttons and inputs;
  Escape closes both plates; the veil closes on self-click.
- `prefers-reduced-motion` disables the wire marquee and the streaming dot blink.
- Mobile: masthead stacks, opening actions become a row, market rows collapse to
  code/quote, question, then two full-width side buttons; the margin rail moves
  under the ledger. No content is hidden.

## Warnings reviewed

- 8 non-blocking warnings are the removed decorative probability dials
  (`aria-label="68 percent read yes…"`). The probability is still exposed as
  visible text in the row (big percentage + "yes 68 / no 32"), so no information
  is lost; the dial had no other role.
- The verifier's heuristic labels the new source `marketing-stack` because the
  page contains both a large opening statement and "card" copy; its family is
  `editorial`, and the implemented skeleton is the selected Documentary Ledger.

## Limitations

- The app has a single static route (`/`); dialogs and the disconnected wallet
  state are the only dynamic surfaces, and both were exercised manually.
- No live wallet extension is installed in the test browser; the connected
  wallet branch is covered by the injected mock-provider probe
  (`output/playwright/signaris-wallet-connected.png`,
  `signaris-trade-desktop.png`, `signaris-signed-desktop.png`) and by
  source-contract parity.
- The old stylesheets remain on disk only in `output/reskin-round5-old/`, outside
  the build graph.
