# Reskin inventory — signaris

Generated: 2026-10-20T15:48:52.423Z

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

- Archetype: **orbital** (spatial)
- Traits: sidebar, cards, grid, tabs, modal, sticky, orbital
- Max template depth: 9
- Top-level tags: div

The replacement skeleton must not be `orbital` and must not be in the same family (`spatial`).

## Routes

- `/`

## Palette (most used first)

`#000000` (11) · `#121116` (7) · `#2a0b57` (6) · `#bc97ff` (6) · `#141415` (5) · `#ffffff` (5) · `#100f14` (4) · `#5ce1a0` (3) · `#670de5` (3) · `#0a0910` (2)

## Content lock

- Static visible text tokens: **103**
- Binding expressions: **85**
- Event handlers: **20**
- Contract hash: `6979f1b59b59959d557d1f9781b30cffb8190062c1ff82701a0a90441297b497`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/001/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/001/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
