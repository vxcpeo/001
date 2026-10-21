# Rebrand report

> 摘要：已将 **Probenox** 更换为 **Signaris**（`signaris.xyz` / @signaris），验证结论：**未通过**。

- Generated: 2026-10-20T23:58:56+08:00
- Project: `E:\workspace\chuangye\solana\001\website`
- Old brand: **Probenox**
- New brand: **Signaris**
- Domain: `signaris.xyz`
- X: `@signaris`
- Email: `hello@signaris.xyz`
- Verdict: **FAIL**

## Gates

| Gate | Result | Detail |
|---|---|---|
| old_brand_source | PASS | 0 file hit(s), 0 path hit(s) |
| new_brand_presence | PASS | 3 surface(s) found: title, meta, package |
| assets | PASS | 0 problem(s) |
| references | PASS | 7 checked, 0 problem(s) |
| build_test | PASS | test skipped: script not defined |
| availability | PASS | selected signaris via chrome-cdp |
| brand_registry | FAIL | current None; history 0 entries |
| browser | PASS | 2 screenshot(s), 0 problem(s) |

## Availability evidence

- Method: `chrome-cdp`
- Selected: `signaris`
- Evidence directory: `.rebrand/availability/`


## Brand registry

- File: `brand.txt`
- Current: `None`
- History: (none)

## Changes

- Files changed: 0
- Replacements: 0
- Renames: 0
- Assets replaced: 0
- Backup: `None`

## Build and test

| Check | Baseline | Current |
|---|---|---|
| build | True | True |
| test | True | True |

## Browser

- Routes: /
- Screenshots: `.rebrand/screenshots/`
- Baseline screenshots: `.rebrand/baseline/`

## Protected / residual

- **thirdParty**: `@vitejs/plugin-vue`, `amazon`, `angular`, `anthropic`, `apple`, `aws`, `bootstrap`, `cloudflare`, `deepseek`, `digitalocean`, `discord`, `django`, `docker`, `facebook`, `fastapi`, `figma`, `flask`, `github`, `gitlab`, `google`, `googleanalytics`, `googletagmanager`, `heroku`, `hotjar`, `instagram`, `intercom`, `javascript`, `jquery`, `kubernetes`, `laravel`

## Rollback

```bash
python "<skill>/scripts/rollback.py" --project "E:\workspace\chuangye\solana\001\website" --out "E:\workspace\chuangye\solana\001\website\.rebrand" --latest
```

Availability is a snapshot. This report does not register the domain or create the X account.

