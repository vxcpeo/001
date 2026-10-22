# Reskin wireframe — Round 8 (Tidal Sui / Gallery Scroll)

## Shell

- New shell: **Tidal Gallery** (`td-` namespace), one route `/`.
- The old shell (`ox-page` fixed glyph rail + command bar + feed/margin stage + status
  strip) is deleted from the render path. `src/styles/abyss.css` stops being imported;
  the new token + layout layer is `src/styles/tidal.css`.
- Landmarks: `header` (opening panel), `nav` (floating dock), `main` (three scenes),
  `footer` (closing panel). Dialogs stay outside every landmark.

## Route `/` mapping

| Scene | Anchor | Holds |
|---|---|---|
| Opening panel | — | brand lockup `CALL/OVA`, imprint, `h1`, standfirst, search field, `Open the feed`, wallet button |
| The feed | `#feed` | kicker + `OPEN LINES` + tally, wire rail, lane tabs, sorts, horizontal snap rail of 8 line cards, empty state |
| Arena readout + desk | `#desk` | four monumental stats, pulse glyph, seal + streaming, wallet chip + facts, desk card with nodes, actions, receipts |
| Three moves | `#rules` | kicker + `HOW A POSITION GETS MADE`, three tall move panels, closing note |
| Closing panel | — | brand `/ 2026`, tagline, network + explorer link, LIVE strip, cluster/settlement |
| Floating dock | — | `Feed` / `Rules` / `Desk` anchors: the only navigation |

## Composition change vs the original

- Zero conventional header: the brand, claim and actions live inside a full-viewport
  opening panel, not a sticky command bar.
- The market table becomes a horizontal, snap-scrolling rail of framed cards; the
  margin readout becomes a full scene with typographic stats.
- Navigation moves from a fixed left glyph rail to a floating bottom dock.
- The footer becomes a dark full-bleed closing panel instead of a thin status strip.
- Mobile: scenes stay linear, the rail keeps horizontal snap with visible cues, the
  dock becomes a full-width bottom bar; nothing is hidden.

## Tokens and breakpoints

- Tokens come from `.reskin/STYLE.md` (white ground, `#298dff` accent, ink `#081B2B`,
  Segoe UI Variable Display / Cascadia Mono mood, radius 12/22/36).
- Breakpoints: `1080px` (readout splits), `760px` (single column, dock bar),
  `520px` (tight type scale).

## Content contract

Every static token, binding, handler, href, form field, placeholder and accessibility
name in `.reskin/content-contract.json` is moved into the new markup unchanged, with
the same multiplicity.
