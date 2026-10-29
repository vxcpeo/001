# Reskin inventory — probvyn

Generated: 2026-10-22T14:59:35.151Z

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

- Archetype: **gallery-scroll** (spatial)
- Traits: cards, grid, tabs, modal, sticky, gallery
- Max template depth: 9
- Top-level tags: div

The replacement skeleton must not be `gallery-scroll` and must not be in the same family (`spatial`).

## Routes

- `/`

## Palette (most used first)

`#ffffff` (8) · `#f3f9ff` (6) · `#000000` (4) · `#081b2b` (4) · `#0b4f9e` (3) · `#e8f3ff` (3) · `#0a63c7` (2) · `#0d71e3` (2) · `#4da2ff` (2) · `#cfe4fb` (2)

## Content lock

- Static visible text tokens: **103**
- Binding expressions: **85**
- Event handlers: **20**
- Contract hash: `680139aed2063275746c98c18f51c05b5485242f40df7ad027e392f60792f1df`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/001/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/001/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
