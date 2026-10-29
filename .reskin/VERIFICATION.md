# Reskin verification — PASS

Generated: 2026-10-22T15:39:15.511Z

- Project: **probvyn**
- URL: http://127.0.0.1:4317/
- Original skeleton: `gallery-scroll` (spatial)
- New skeleton: `sidebar-workspace` (shell)
- Accent: #298dff -> #9945ff (58.87 ΔE; min 30)
- Source contract: intact (`680139aed206`)

| Route | Result | DOM similarity | Landmark similarity | Axe serious | Screenshot |
|---|---|---:|---:|---:|---|
| `/` | PASS | 0.291 | 0.429 | 0 | [desktop](current/home-desktop.png) |

## Blocking issues

- None.

## Warnings

- /: aria attribute added: aria-label=Network facts
- /: aria attribute added: aria-label=The feed

## Thresholds

- DOM fingerprint similarity <= 0.5
- Landmark sequence similarity <= 0.68
- CSS class overlap <= 0.1
- Accent distance >= 30 ΔE
- Contrast failures <= 0
- Axe serious/critical <= 0

All content is compared as a multiset of visible words plus rendered attribute values. Reordering is allowed, rewriting/removing/adding visible copy is not. Dynamic numeric values are reported as warnings, never silently accepted.
