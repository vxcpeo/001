# Rebrand report — web scope (Round 8)

> The Vite app lives in `website/`, so the root-absolute asset URLs in
> `index.html` (`/favicon.svg`, `/og.png`, `/fonts/*`, `/src/main.js`) only resolve
> with `website/` as the project root. This scope re-verifies the built site and
> captures the browser evidence; the brand registry is validated by the repo-root
> run. Every gate passes here except `brand_registry`, which is structural.

- Generated: 2026-10-22
- Project: `E:\workspace\chuangye\solana\001\website`
- Old brand: **Oddix**
- New brand: **Callova** (`callova.xyz` / `@callova`)
- Verdict: **PASS in scope** (8 of 9 gates; `brand_registry` is repo-root only)

## Gates

| Gate | Result | Detail |
|---|---|---|
| old_brand_source | PASS | 0 file hit(s), 0 path hit(s) |
| new_brand_presence | PASS | 3 surface(s): title, meta, package |
| assets | PASS | 2 web assets (favicon SVG, 1200×630 OG) |
| references | PASS | 7 local references resolve from `website/` |
| build_test | PASS | `vite build` |
| availability | PASS | selected `callova` via chrome-cdp |
| brand_registry | FAIL | `brand.txt` is the repo-root file, validated by the root run |
| browser | PASS | 2 screenshots, 0 old-brand text/attribute hits, 0 console/page errors, 0 failed requests |
| report | PASS | this file |

## What this scope covers

- `index.html` metadata: title `Callova // Live prediction lines on Solana`,
  description, Open Graph and Twitter card, favicon and OG image references.
- `public/favicon.svg` — vector split-diamond mark, ink plate, white diamond,
  tidal-blue node.
- `public/og.png` — 1200×630 link card re-rendered from the artboard pipeline.
- `src/App.vue` — brand lockup `CALL`/`OVA`, arena seal `CALLOVA-01`, receipt
  storage key `callova.receipts.v1`, SPL-memo note prefix `Callova|…`.
- `src/solana.js` — session key and header only; wallet logic untouched.
- `package.json` / `package-lock.json` — package name `callova`.
- `src/styles/tidal.css` — the Round 8 presentation layer (the rebrand did not
  restyle; the reskin did).

## Browser evidence

- `screenshots/root-desktop.png` (1440×900) and `screenshots/root-mobile.png`
  (390×844), captured after the Round 8 reskin.
- `.rebrand/verification.json` → `browser`: 0 old-brand hits, 0 errors, 0 failed
  requests.
- Availability evidence is shared with the root run (`availability.json`,
  `availability/*.png`).

## Related reports

- Full rebrand evidence: [`../../.rebrand/REPORT.md`](../../.rebrand/REPORT.md).
- Presentation rebuild: [`../.reskin/REPORT.md`](../.reskin/REPORT.md).
