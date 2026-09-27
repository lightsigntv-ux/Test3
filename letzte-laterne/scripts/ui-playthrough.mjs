// Spielt eine komplette Expedition über die echte Oberfläche (Klicks & Tasten) durch.
// Aufruf: node scripts/ui-playthrough.mjs [anzahlRuns]
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:4173/';
const OUT = process.env.OUT ?? '/tmp/claude-0/shots';
const RUNS = Number(process.argv[2] ?? 1);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1366, height: 860 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('dialog', (d) => d.accept());
await page.goto(URL);
if (process.env.RESET) { await page.evaluate(() => localStorage.clear()); await page.reload(); }
const shots = new Set();
async function shot(name) { if (shots.has(name)) return; shots.add(name); await page.screenshot({ path: `${OUT}/ui-${name}.png` }); }
const vis = async (sel) => (await page.locator(sel).count()) > 0 && (await page.locator(sel).first().isVisible());
const t0 = Date.now();
let runsDone = 0;
const log = [];
// Titel
if (await vis('text=Weiterspielen')) await page.click('text=Weiterspielen');
else if (await vis('text=Expedition fortsetzen')) await page.click('text=Expedition fortsetzen');
else await page.getByRole('button', { name: 'Neues Spiel' }).click();
let lastPhase = '';
let runStart = Date.now();
let endingSeen = false;
for (let iter = 0; iter < 5000 && runsDone < RUNS; iter++) {
  if (await vis('.dialog-back')) { const title = await page.locator('.dialog-title').innerText(); if (!log.includes('📜 ' + title)) log.push('📜 ' + title); await shot('dialog'); await page.keyboard.press('Escape'); continue; }
  if (await vis('.modal-back')) { const ok = page.locator('.modal-back .btn.primary'); if (await ok.count()) await ok.first().click(); else await page.keyboard.press('Escape'); continue; }
  if (await vis('.hint-wrap')) { await shot('hint-' + iter); await page.click('.hint-wrap button'); continue; }
  if (await vis('.precombat')) { await shot('precombat'); await page.click('text=Kampf beginnen'); await page.keyboard.press('s'); lastPhase = 'combat'; continue; }
  if (await vis('.end-overlay')) { await shot('combat-end'); await page.click('.end-overlay button'); continue; }
  if (await vis('.combat')) {
    await shot('combat-running');
    // Gegner mit unterbrechbarer Vorbereitung als Fokus markieren
    const w = page.locator('.unit.enemy:has(.windup.int)');
    if (await w.count()) { await w.first().click({ position: { x: 20, y: 90 } }).catch(() => {}); await page.keyboard.press('1'); }
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    await page.keyboard.press('1');
    await page.waitForTimeout(400);
    continue;
  }
  if (await vis('.reward-screen')) {
    await shot('reward');
    await page.waitForTimeout(1900);
    await page.locator('.loot-card').first().click();
    const slots = page.locator('.slot-tile');
    if (await slots.count()) await slots.first().click();
    const eq = page.locator('button.btn.primary.big');
    if (await eq.isEnabled()) await eq.click(); else await page.click('text=Nichts nehmen');
    continue;
  }
  if (await vis('.event-screen')) { await shot('event-' + (await page.locator('h2').first().innerText()).slice(0, 12)); await page.locator('.choice-card').first().click(); continue; }
  if (await vis('.camp-screen')) { await shot('camp'); await page.locator('.choice-card').first().click(); continue; }
  if (await vis('.ending-screen')) { await shot('ending'); endingSeen = true; await page.locator('.choice-card').first().click(); continue; }
  if (await vis('.result-screen')) {
    await shot('result-' + runsDone);
    const exp = await page.locator('.run-top b').first().innerText();
    log.push(`${exp}: ${await page.locator('.result-screen h2').innerText()} nach ${Math.round((Date.now() - runStart) / 1000)} s`);
    await page.click('text=Zurück zur Laternenstube');
    runsDone++;
    runStart = Date.now();
    if (endingSeen && process.env.UNTIL_ENDING) break;
    continue;
  }
  if (await vis('.map-screen')) {
    await shot('map');
    if (await vis('text=Dem Miauen folgen')) await page.click('text=Dem Miauen folgen');
    else if (await vis('text=Ereignis wählen')) await page.click('text=Ereignis wählen');
    else await page.locator('.preview button.btn.primary').first().click();
    continue;
  }
  if (await vis('.reward-card') && await vis('text=Run-Level')) { await shot('levelup'); await page.locator('.reward-card').first().click(); continue; }
  if (await vis('.hub')) {
    await shot('hub');
    if (runsDone >= RUNS) break;
    await page.getByRole('button', { name: /Aufbrechen|Erinnerung erleben/ }).click();
    continue;
  }
  await page.waitForTimeout(200);
}
console.log(JSON.stringify({ runsDone, results: log, seconds: Math.round((Date.now() - t0) / 1000), errors }, null, 1));
await browser.close();
