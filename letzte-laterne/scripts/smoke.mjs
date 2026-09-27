// Browser-Rauchtest: startet ein neues Spiel und spielt durch die ersten Bildschirme.
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:4173/';
const OUT = process.env.OUT ?? '/tmp/claude-0/shots';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 1366, height: 820 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(URL);
await page.screenshot({ path: `${OUT}/01-title.png` });
await page.getByRole('button', { name: 'Neues Spiel' }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/02-intro.png` });
// Intro-Dialog durchklicken
for (let i = 0; i < 12; i++) { const b = page.getByRole('button', { name: /Weiter|Fertig/ }); if (await b.count()) await b.first().click(); else break; }
await page.screenshot({ path: `${OUT}/03-hub.png` });
await page.getByRole('button', { name: 'Aufbrechen' }).click();
await page.waitForTimeout(200);
for (let i = 0; i < 6; i++) { const b = page.getByRole('button', { name: /Weiter \(Enter\)|Fertig/ }); if (await b.count()) await b.first().click(); else break; }
await page.screenshot({ path: `${OUT}/04-prepare.png` });
await page.getByRole('button', { name: /Aufbrechen ➜/ }).click();
await page.waitForTimeout(200);
for (let i = 0; i < 6; i++) { const b = page.getByRole('button', { name: /Weiter \(Enter\)|Fertig/ }); if (await b.count()) await b.first().click(); else break; }
await page.screenshot({ path: `${OUT}/04-map.png` });
await page.getByRole('button', { name: /Weiter: Kampf/ }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/05-precombat.png` });
await page.getByRole('button', { name: /Kampf beginnen/ }).click();
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/06-combat.png` });
console.log('errors:', errors);
await browser.close();
