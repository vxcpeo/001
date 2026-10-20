import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
const ROOT = 'E:/workspace/chuangye/solana/001/website';
const PORT = 4454;
const require = createRequire(path.join(ROOT, '.reskin', 'tools', 'package.json'));
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1247/chrome-win64/chrome.exe';
const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: ['ignore','ignore','ignore'], windowsHide: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 40; i += 1) { try { const r = await fetch(`http://127.0.0.1:${PORT}/`); if (r.status < 500) break; } catch {} await sleep(400); }
const browser = await chromium.launch({ headless: true, executablePath: EXE, args: ['--no-sandbox'] });
for (const [w, h] of [[360, 780], [768, 1024], [1024, 800], [1280, 900], [1920, 1080]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  const r = await page.evaluate(() => {
    const de = document.documentElement;
    const offenders = [];
    for (const el of document.body.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number.parseFloat(cs.opacity) < 0.06) continue;
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      if (b.right > de.clientWidth + 2 && cs.position !== 'fixed') offenders.push(`${el.tagName}.${[...el.classList].join('.')} right=${Math.round(b.right)}`);
      if (offenders.length > 3) break;
    }
    return { sw: de.scrollWidth, cw: de.clientWidth, offenders };
  });
  console.log(`${w}x${h}: scrollWidth=${r.sw} clientWidth=${r.cw} overflow=${r.sw > r.cw + 2} offenders=${r.offenders.slice(0,3).join(' | ') || 'none'}`);
  await page.close();
}
await browser.close(); server.kill();
