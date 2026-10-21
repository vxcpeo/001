import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const here = 'E:/workspace/chuangye/solana/001/website'
const require = createRequire(pathToFileURL(path.join(here, '.reskin', 'tools', 'package.json')))
const { chromium } = require('playwright-core')

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('http://127.0.0.1:4317/', { waitUntil: 'networkidle' })
const info = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    const cs = getComputedStyle(el)
    return { color: cs.color, size: cs.fontSize, family: cs.fontFamily.slice(0, 40) }
  }
  return {
    brand: pick('.ledger-brand-word'),
    brandEm: pick('.ledger-brand-word em'),
    claim: pick('.ledger-claim'),
    claim3: pick('.ledger-claim span:nth-child(3)'),
    body: pick('body'),
    quote: pick('.ledger-quote'),
  }
})
console.log(JSON.stringify(info, null, 1))
await browser.close()
