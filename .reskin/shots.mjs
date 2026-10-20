import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'E:/workspace/chuangye/solana/001/website';
const OUT = path.join(ROOT, '.reskin', 'shots');
const PORT = 4451;
const require = createRequire(path.join(ROOT, '.reskin', 'tools', 'package.json'));
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1247/chrome-win64/chrome.exe';

await fs.mkdir(OUT, { recursive: true });
const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
  cwd: ROOT,
  stdio: ['ignore', 'ignore', 'ignore'],
  windowsHide: true,
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ready = false;
for (let i = 0; i < 40; i += 1) {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/`);
    if (res.status < 500) { ready = true; break; }
  } catch { /* wait */ }
  await sleep(400);
}
if (!ready) { server.kill(); throw new Error('server not ready'); }

const browser = await chromium.launch({ headless: true, executablePath: EXE, args: ['--no-sandbox', '--hide-scrollbars'] });
const errors = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

await page.screenshot({ path: path.join(OUT, 'desktop-top.png') });
await page.screenshot({ path: path.join(OUT, 'desktop-full.png'), fullPage: true });

// wallet sheet
await page.getByRole('button', { name: /attach a wallet/i }).first().click();
await page.waitForTimeout(350);
await page.screenshot({ path: path.join(OUT, 'wallet-sheet.png') });
const walletText = await page.locator('.orb-sheet').innerText().catch(() => '');
await page.keyboard.press('Escape');
await page.waitForTimeout(250);

// trade sheet
await page.locator('.orb-ray').first().getByRole('button', { name: /^yes/i }).click();
await page.waitForTimeout(350);
await page.screenshot({ path: path.join(OUT, 'trade-sheet.png') });
const tradeText = await page.locator('.orb-sheet').innerText().catch(() => '');
// switch side + stake
await page.locator('.orb-side--no').click();
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(OUT, 'trade-no.png') });
await page.keyboard.press('Escape');
await page.waitForTimeout(250);

// filters
await page.getByRole('tab', { name: /Crypto/i }).click();
await page.waitForTimeout(250);
const cryptoCount = await page.locator('.orb-ray').count();
await page.getByRole('tab', { name: /All lanes/i }).click();
await page.getByRole('button', { name: /Closing/i }).click();
await page.waitForTimeout(250);
const closingFirst = await page.locator('.orb-ray-q').first().innerText();
await page.getByRole('button', { name: /Heat/i }).click();
await page.locator('.orb-search-field').fill('pixel');
await page.waitForTimeout(250);
const searchCount = await page.locator('.orb-ray').count();
await page.locator('.orb-search-field').fill('zzzz');
await page.waitForTimeout(250);
const emptyVisible = await page.locator('.orb-empty').isVisible();
await page.screenshot({ path: path.join(OUT, 'empty-state.png') });
await page.locator('.orb-search-field').fill('');
await page.waitForTimeout(200);

// keyboard focus walk
const focusShot = [];
for (let i = 0; i < 6; i += 1) {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(60);
  focusShot.push(await page.evaluate(() => {
    const el = document.activeElement;
    const cs = el ? getComputedStyle(el) : null;
    return el ? `${el.tagName}.${el.className}:${cs.outlineWidth} ${cs.outlineColor}` : 'none';
  }));
}

// mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const mp = await mobile.newPage();
await mp.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
await mp.waitForTimeout(400);
await mp.screenshot({ path: path.join(OUT, 'mobile-top.png') });
await mp.locator('.orb-ray').first().getByRole('button', { name: /^yes/i }).click();
await mp.waitForTimeout(350);
await mp.screenshot({ path: path.join(OUT, 'mobile-trade.png') });
const mobileOverflow = await mp.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));

console.log('errors:', errors.length ? errors : 'none');
console.log('wallet sheet chars:', walletText.length);
console.log('trade sheet chars:', tradeText.length);
console.log('crypto rows:', cryptoCount, '| closing first:', closingFirst, '| search pixel:', searchCount, '| empty state:', emptyVisible);
console.log('focus:', focusShot.join('\n        '));
console.log('mobile overflow:', JSON.stringify(mobileOverflow));

await browser.close();
server.kill();
