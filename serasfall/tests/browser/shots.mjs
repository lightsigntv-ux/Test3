// Screenshots aller Orte/Tageszeiten zur Sichtprüfung. Aufruf: node tests/browser/shots.mjs <url> <outdir>
import { chromium } from 'playwright';
import fs from 'node:fs';
const url = process.argv[2] ?? 'http://localhost:4173/';
const out = process.argv[3] ?? 'tests/browser/out';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(url);
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/00_title.png` });
const scenes = JSON.parse(process.argv[4] ?? 'null') ?? [
  ['wohnung', 0, 'abend'], ['halle', 1, 'morgen'], ['salon', 1, 'morgen'], ['arbeit', 1, 'morgen'], ['dienst', 1, 'morgen'],
  ['biblio', 1, 'morgen'], ['kammer', 1, 'mittag'], ['galerie', 2, 'nachmittag'], ['toten', 2, 'nacht'], ['dunkel', 2, 'nachmittag'],
  ['gewaechs', 3, 'morgen'], ['stall', 3, 'mittag'], ['kapelle', 3, 'nachmittag'], ['stall', 4, 'nachmittag'], ['halle', 5, 'nacht'], ['london', 6, 'mittag'],
];
for (const [loc, ch, tod, extra] of scenes) {
  await page.evaluate(([loc, ch, tod, extra]) => {
    const c = window.__serasfall;
    c.startNew(); c.closeCard();
    c.game.chapter = ch; c.game.time = tod; c.game.flags.k1_dressed = true; c.game.flags.tut_move = true;
    Object.assign(c.game.flags, extra ?? {});
    c.goTo(loc, 0.5);
    c.view = undefined; c.overlay = 'none'; c.fade = 0;
    c.emit();
  }, [loc, ch, tod, extra]);
  await page.waitForTimeout(700);
  await page.evaluate(() => { const c = window.__serasfall; c.view = undefined; c.overlay = 'none'; c.emit(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${loc}_${ch}_${tod}.png` });
}
console.log('Konsolenfehler:', errors.length ? errors : 'keine');
await browser.close();
