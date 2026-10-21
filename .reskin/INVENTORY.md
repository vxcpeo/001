# Reskin inventory — prismel

Generated: 2026-10-21T13:07:17.727Z

## Project

| Field | Value |
|---|---|
| Root | `E:/workspace/chuangye/solana/001/website` |
| Vue | latest |
| Package manager | npm |
| Nuxt | no |
| CSS frameworks | none detected |
| Files scanned | 5 (1 SFCs) |

## Original skeleton

- Archetype: **marketing-stack** (editorial)
- Traits: cards, hero, grid, tabs, modal, charts, sticky
- Max template depth: 11
- Top-level tags: div

The replacement skeleton must not be `marketing-stack` and must not be in the same family (`editorial`).

## Routes

- `/`

## Palette (most used first)

`#1b1b1b` (3) · `#ede9df` (2) · `#083a58` (1) · `#0c5681` (1) · `#2f6b4f` (1) · `#3a3733` (1) · `#6b675f` (1) · `#8a5a00` (1) · `#8b9dff` (1) · `#a83a2a` (1)

## Content lock

- Static visible text tokens: **103**
- Binding expressions: **85**
- Event handlers: **20**
- Contract hash: `73b5e20bf78b27c263d33928c71fa07b05861c1d16639feefde97b032f1962fc`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/001/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/001/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
