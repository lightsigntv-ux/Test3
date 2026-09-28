// Prüft die Offline-Einzeldatei über file://: Start, erste Szene, Speichern, keine Konsolenfehler.
// Aufruf: npx tsx tests/browser/offline.ts [pfad/zur/index.html] [shotdir]
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const file = path.resolve(process.argv[2] ?? 'dist-single/index.html');
const out = process.argv[3] ?? 'tests/browser/out';
fs.mkdirSync(out, { recursive: true });

async function main() {
  if (!fs.existsSync(file)) throw new Error(`Datei fehlt: ${file} (vorher npm run build:single)`);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const requests: string[] = [];
  page.on('request', (r) => { if (!r.url().startsWith('file://') && !r.url().startsWith('data:')) requests.push(r.url()); });
  await page.goto('file://' + file);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/offline_title.png` });
  await page.getByRole('button', { name: 'Neues Spiel' }).click();
  await page.keyboard.press('Space');
  await page.waitForTimeout(1500);
  // Fonts geladen?
  const fonts = await page.evaluate(async () => { await (document as any).fonts.ready; return ['EB Garamond', 'IM Fell English', 'Caveat'].map((f) => (document as any).fonts.check(`20px "${f}"`)); });
  for (let i = 0; i < 8; i++) { await page.keyboard.press('Space'); await page.waitForTimeout(120); }
  await page.screenshot({ path: `${out}/offline_play.png` });
  const saved = await page.evaluate(() => !!localStorage.getItem('serasfall.save'));
  console.log(`Offline-Datei: ${path.basename(file)} (${Math.round(fs.statSync(file).size / 1024)} KB)`);
  console.log(`Schriften eingebettet: ${fonts.every(Boolean) ? 'ja' : 'NEIN ' + fonts}`);
  console.log(`Externe Anfragen: ${requests.length ? requests.join(', ') : 'keine'}`);
  console.log(`Spielstand gespeichert: ${saved ? 'ja' : 'nein'}`);
  console.log(`Konsolenfehler: ${errors.length ? errors.join(' | ') : 'keine'}`);
  await browser.close();
  if (errors.length || requests.length || !fonts.every(Boolean)) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
