# Rebrand report — web surface (`website/`)

- Project scope: `E:\workspace\chuangye\solana\001\website`
- Old brand: **Prismel** · New brand: **Oddix** (`oddix.xyz` / @oddix)
- This run covers only the Vite app; the repo-root run in `../.rebrand/` covers
  the registry, contracts, social assets and the rest of the tree.
- Verdict for this scope: **all applicable gates pass** — `brand_registry` is the
  one exception, by construction: the registry is the repo-root `brand.txt`, which
  does not exist inside `website/` and is validated by the root run.

## Gates

| Gate | Result | Detail |
|---|---|---|
| old_brand_source | PASS | 0 file hits, 0 path hits |
| new_brand_presence | PASS | title, meta, package surfaces found |
| assets | PASS | favicon + OG recorded, hash-matched |
| references | PASS | 7 checked, 0 problems |
| build_test | PASS | `vite build` (test script not defined) |
| availability | PASS | selected oddix via chrome-cdp |
| brand_registry | FAIL | registry lives at the repo root |
| browser | PASS | 2 screenshots, 0 old-brand DOM hits, 0 page errors, 0 failed requests |

## Browser evidence

- `/` at 1440×900: `screenshots/root-desktop.png`
- `/` at 390×844: `screenshots/root-mobile.png`
- `browser.json` holds the rendered-DOM audit: no old-brand text or attributes,
  no console or page errors, no failed requests.

## Notes

- The generated template for this file is written in the skill's default text and
  reports the registry failure as a whole-scope FAIL; this report replaces it with
  the scope-accurate verdict.
- Round 7 evidence for the presentation rebuild is in `../.reskin/REPORT.md`.
