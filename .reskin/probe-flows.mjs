import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = 'E:/workspace/chuangye/solana/001/website'
const out = path.join(root, '.reskin', 'shots-r5')
mkdirSync(out, { recursive: true })
const require = createRequire(pathToFileURL(path.join(root, '.reskin', 'tools', 'package.json')))
const { chromium } = require('playwright-core')

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const errors = []

async function shoot(name, page, opts = {}) {
  await page.screenshot({ path: path.join(out, `${name}.png`), ...opts })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  console.log(`${name}: overflow=${overflow}`)
}

// Desktop
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
  await page.goto('http://127.0.0.1:4317/', { waitUntil: 'networkidle' })
  await shoot('desktop-top', page)

  // search empty state
  await page.fill('input[type="search"]', 'zzzz')
  await page.waitForTimeout(150)
  await shoot('desktop-empty', page)
  await page.fill('input[type="search"]', '')

  // lane filter
  await page.getByRole('tab', { name: /Sports/ }).click()
  await page.waitForTimeout(150)
  const rows = await page.locator('.ledger-entry').count()
  console.log(`sports rows=${rows}`)
  await page.getByRole('tab', { name: /All lanes/ }).click()

  // trade sheet
  await page.locator('.ledger-side--yes').first().click()
  await page.waitForTimeout(200)
  await shoot('desktop-trade', page)
  console.log(`trade title=${await page.locator('#trade-title').innerText()}`)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(150)

  // wallet sheet
  await page.locator('.ledger-action', { hasText: 'Attach a wallet' }).click()
  await page.waitForTimeout(250)
  await shoot('desktop-wallet', page)
  console.log(`wallet title=${await page.locator('#wallet-title').innerText()}`)
  await page.keyboard.press('Escape')

  // feed deep view
  await page.locator('#feed').scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)
  await shoot('desktop-feed', page)
  await page.close()
}

// Mobile
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  page.on('pageerror', (e) => errors.push(`mobile pageerror: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && errors.push(`mobile console: ${m.text()}`))
  await page.goto('http://127.0.0.1:4317/', { waitUntil: 'networkidle' })
  await shoot('mobile-top', page)
  await page.locator('#feed').scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)
  await shoot('mobile-feed', page)
  await page.locator('.ledger-side--yes').first().click()
  await page.waitForTimeout(250)
  await shoot('mobile-trade', page)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(150)
  await page.close()
}

console.log(`errors=${errors.length}`)
if (errors.length) console.log(errors.join('\n'))
await browser.close()
