# Rebrand report — website scope (Signaris → Prismel)

> Scope note: this directory holds the **web-surface** run of the rebrand verifier.
> The authoritative report, naming record and evidence live in the repo-root
> `.rebrand/REPORT.md`; this file records what the `website/` scope can prove.

- Date: 2026-10-21 (Round 6)
- Old brand: **Signaris** → New brand: **Prismel** (`prismel.xyz` / `@prismel`)
- Registry: repo-root `brand.txt` — `history: NEONLINE, Probenox, Signaris`,
  `current: Prismel`
- Run: `verify.py --project website --out website/.rebrand --browser --no-install`

## Gates

| Gate | Result | Note |
|---|---|---|
| old_brand_source | **PASS** | 0 old-brand text or path hits in the site source |
| new_brand_presence | **PASS** | Prismel in HTML, App.vue, package names |
| assets | **PASS** | `public/favicon.svg` (vector prism), `public/og.png` 1200×630 |
| references | **PASS** | `/favicon.svg`, `/og.png`, `/src/main.js`, `/fonts/*` all resolve |
| build_test | **PASS** | `vite build` |
| availability | **PASS** | `prismel` from the root evidence set |
| brand_registry | **FAIL — structural** | the single `brand.txt` lives at the repo root; the root run validates it |
| browser | **PASS** | real Chrome at 1440×900 and 390×844: 0 old-brand text/attribute hits, 0 console errors, 0 page errors, 0 failed local requests |
| report | **PASS** | this file |

The only failing gate is structural: there is one brand registry for the whole
repository, so a `website/`-rooted run cannot find it. It is validated by the
root run, which in turn cannot resolve the Vite app's root-absolute asset URLs —
hence the two complementary runs.

## Screenshots

- `screenshots/root-desktop.png` (1440×900)
- `screenshots/root-mobile.png` (390×844)

These are post-rebrand **and** post-reskin captures: the Cobalt Blueprint / Bento
Canvas UI described in `website/.reskin/REPORT.md`.
