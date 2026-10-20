import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
const ROOT = 'E:/workspace/chuangye/solana/001/website';
const PORT = 4452;
const require = createRequire(path.join(ROOT, '.reskin', 'tools', 'package.json'));
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1247/chrome-win64/chrome.exe';
const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: ['ignore','ignore','ignore'], windowsHide: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 40; i += 1) { try { const r = await fetch(`http://127.0.0.1:${PORT}/`); if (r.status < 500) break; } catch {} await sleep(400); }
const browser = await chromium.launch({ headless: true, executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
const info = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return sel + ' MISSING';
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return `${sel} w=${r.width.toFixed(1)} h=${r.height.toFixed(1)} fs=${cs.fontSize} fw=${cs.fontWeight} pad=${cs.padding} cw=${el.clientWidth} sw=${el.scrollWidth}`;
  };
  return [
    pick('.orb-desk-disc'), pick('.orb-desk-title'), pick('.orb-core'), pick('.orb-claim'),
    pick('.orb-ring'), pick('.orb-station'), pick('.orb-metrics'), pick('.orb-pulse'),
  ];
});
console.log(info.join('\n'));
await browser.close(); server.kill();
