// Sichtprüfung Grafik: Titel, Stube, Karte, Beute (Aufdecken), Kampf, Sammlung
import { chromium } from 'playwright';
import * as A from '../src/game/actions';
import { newSave, SAVE_KEY } from '../src/game/save';
const URL = process.env.URL ?? 'http://localhost:4173/';
const OUT = process.env.OUT ?? '/tmp/claude-0/shots';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1366, height: 860 } });
const errors: string[] = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
async function load(save: any, cont = true) {
  save.dialogQueue = [];
  await page.goto(URL);
  await page.evaluate(([k, v]) => localStorage.setItem(k as string, v as string), [SAVE_KEY, JSON.stringify(save)]);
  await page.reload();
  if (cont) await page.getByRole('button', { name: /fortsetzen|Weiterspielen/ }).click();
  await page.waitForTimeout(400);
}
const base = newSave();
base.meta.seenDialogs.push('intro', 'exp1_start', 'exp2_start', 'exp3_start', 'boss1_pre');
base.meta.tutorialsSeen.push('combat', 'windup', 'focusFull', 'purr', 'taunt', 'summon');
base.meta.runsStarted = 2;
base.meta.discoveredItems = ['zunderring', 'glutherz', 'ascheglas', 'taktgeber', 'schildspange'];
base.meta.discoveredRelics = ['mondgloeckchen', 'wappen'];
base.meta.yuumiDiscovered = true;
base.meta.unlockedExpedition = 3;
const only = process.env.ONLY?.split(',');
const want = (n: string) => !only || only.includes(n);

if (want('title')) { await load(base, false); await page.screenshot({ path: `${OUT}/g-title.png` }); }
if (want('hub')) { await load(base); await page.screenshot({ path: `${OUT}/g-hub.png` }); await page.click('text=Sammlung'); await page.screenshot({ path: `${OUT}/g-collection.png` }); }
if (want('reward')) {
  let r = A.startRun(structuredClone(base), 1, { seed: 5 });
  r = A.enterStation(r);
  r = A.combatFinished(r, { result: 'victory', heroHp: { fritz: 120, ivo: 70, sera: 80 }, stats: (new (await import('../src/sim/combat')).CombatSim(A.buildCombatSetup(r)!)).stats, enemiesAlive: [] });
  r.run!.reward!.options = [ { kind: 'item', id: 'glutherz', q: 'legendary' }, { kind: 'item', id: 'ascheglas', q: 'rare' }, { kind: 'item', id: 'schildspange', q: 'magic' } ];
  r.run!.phase = 'reward';
  await load(r);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/g-reward-0.png` });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/g-reward-1.png` });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/g-reward-2.png` });
  await page.locator('.loot-card').nth(0).click();
  await page.locator('.slot-tile').nth(2).click();
  await page.screenshot({ path: `${OUT}/g-reward-3.png` });
}
if (want('map')) {
  const r = A.startRun(structuredClone(base), 2, { seed: 5 });
  r.run!.station = 2;
  r.run!.equipment.ivo = [{ id: 'glutherz', q: 'legendary' }, { id: 'zunderring', q: 'rare' }];
  r.run!.relics = ['mondgloeckchen', null];
  await load(r);
  await page.screenshot({ path: `${OUT}/g-map.png` });
}
if (want('combat')) {
  for (const exp of [1, 3] as const) {
    let r = A.startRun(structuredClone(base), exp, { seed: 5 });
    r.run!.relics = ['mondgloeckchen', null];
    r = A.enterStation(r);
    await load(r);
    await page.click('text=Kampf beginnen');
    await page.waitForTimeout(3300);
    await page.screenshot({ path: `${OUT}/g-combat-${exp}.png` });
  }
  let r = A.startRun(structuredClone(base), 2, { seed: 5 });
  r.run!.station = 7;
  r = A.enterStation(r);
  await load(r);
  await page.click('text=Kampf beginnen');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${OUT}/g-boss-2.png` });
}
console.log('errors', errors);
await browser.close();
