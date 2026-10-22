# Reskin inventory — callova

Generated: 2026-10-21T18:28:50.497Z

## Project

| Field | Value |
|---|---|
| Root | `E:/workspace/chuangye/solana/001/website` |
| Vue | latest |
| Package manager | npm |
| Nuxt | no |
| CSS frameworks | none detected |
| Files scanned | 4 (1 SFCs) |

## Original skeleton

- Archetype: **document-flow** (editorial)
- Traits: cards, grid, tabs, modal, sticky
- Max template depth: 11
- Top-level tags: div

The replacement skeleton must not be `document-flow` and must not be in the same family (`editorial`).

## Routes

- `/`

## Palette (most used first)

`#000000` (18) · `#ff0000` (16) · `#ffffff` (11) · `#0b1219` (4) · `#182533` (3) · `#0d141c` (2) · `#111a24` (2) · `#2ebac6` (2) · `#5ce1a0` (2) · `#ff2d2d` (2)

## Content lock

- Static visible text tokens: **103**
- Binding expressions: **85**
- Event handlers: **20**
- Contract hash: `35d743d3a63c101952a810965e1be5068688a656bf474017a8982670d4716a2e`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/001/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/001/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
