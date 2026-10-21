# Reskin verification — PASS

Generated: 2026-10-21T13:40:08.724Z

- Project: **prismel**
- URL: http://127.0.0.1:4317/
- Original skeleton: `marketing-stack` (editorial)
- New skeleton: `dashboard-shell` (shell)
- Accent: #0c5681 -> #0000ff (114.22 ΔE; min 30)
- Source contract: intact (`73b5e20bf78b`)

| Route | Result | DOM similarity | Landmark similarity | Axe serious | Screenshot |
|---|---|---:|---:|---:|---|
| `/` | PASS | 0.299 | 0.5 | 0 | [desktop](current/home-desktop.png) |

## Blocking issues

- None.

## Warnings

- /: aria attribute added: aria-label=Network

## Thresholds

- DOM fingerprint similarity <= 0.5
- Landmark sequence similarity <= 0.68
- CSS class overlap <= 0.1
- Accent distance >= 30 ΔE
- Contrast failures <= 0
- Axe serious/critical <= 0

All content is compared as a multiset of visible words plus rendered attribute values. Reordering is allowed, rewriting/removing/adding visible copy is not. Dynamic numeric values are reported as warnings, never silently accepted.
