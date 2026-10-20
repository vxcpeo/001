# Reskin inventory — probenox

Generated: 2026-10-19T18:47:20.421Z

## Project

| Field | Value |
|---|---|
| Root | `E:/workspace/chuangye/solana/001/website` |
| Vue | latest |
| Package manager | npm |
| Nuxt | no |
| CSS frameworks | none detected |
| Files scanned | 6 (2 SFCs) |

## Original skeleton

- Archetype: **sidebar-workspace** (shell)
- Traits: sidebar, cards, hero, grid, tabs, modal, sticky, ticker
- Max template depth: 8
- Top-level tags: div, div

The replacement skeleton must not be `sidebar-workspace` and must not be in the same family (`shell`).

## Routes

- `/`

## Palette (most used first)

`#c6ff2e` (12) · `#00f0c8` (10) · `#ff2d9b` (8) · `#000000` (6) · `#05050a` (6) · `#14000b` (4) · `#17000c` (4) · `#f4f4ff` (4) · `#030307` (2) · `#06705f` (2)

## Content lock

- Static visible text tokens: **206**
- Binding expressions: **170**
- Event handlers: **40**
- Contract hash: `b3ed45a1b94b4d2c1aed12cc31974e2a03d287b913e4a483bdd222c20391f1f6`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/001/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/001/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
