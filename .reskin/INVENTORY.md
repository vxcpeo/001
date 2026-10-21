# Reskin inventory — oddix

Generated: 2026-10-21T14:22:53.225Z

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

- Archetype: **dashboard-shell** (shell)
- Traits: sidebar, topbar, cards, hero, grid, tabs, modal, sticky, bento
- Max template depth: 9
- Top-level tags: div

The replacement skeleton must not be `dashboard-shell` and must not be in the same family (`shell`).

## Routes

- `/`

## Palette (most used first)

`#ffffff` (9) · `#0a0b0d` (4) · `#9aa3b1` (3) · `#dde3e9` (3) · `#0000ff` (2) · `#006c48` (2) · `#b3310a` (2) · `#0000d6` (1) · `#1a1d23` (1) · `#333a44` (1)

## Content lock

- Static visible text tokens: **103**
- Binding expressions: **85**
- Event handlers: **20**
- Contract hash: `8f04bb8dd0587d2d28600ef045ba1223069fca28ee8a17962316aad4ccfac67f`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/001/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/001/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
