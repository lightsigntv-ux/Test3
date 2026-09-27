// Sichtprüfung Charakterbau: Vorbereitung, Siegel-Sperre, Talentfenster, Levelaufstieg, Kampf mit Taktik
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
base.meta.tutorialsSeen.push('combat', 'windup', 'focusFull', 'purr', 'taunt', 'summon', 'tactics');
base.meta.runsStarted = 1;
base.meta.unlockedExpedition = 3;
const only = process.env.ONLY?.split(',');
const want = (n: string) => !only || only.includes(n);

if (want('locked')) {
  await load(base);
  await page.click('text=🔒 Siegel');
  await page.screenshot({ path: `${OUT}/c-seals-locked.png` });
}
if (want('prepare')) {
  let r = A.startRun(structuredClone(base), 1, { seed: 5 });
  await load(r);
  await page.screenshot({ path: `${OUT}/c-prepare-0.png` });
  // Klingen + Gift wählen, Punkte verteilen
  await page.getByRole('radio', { name: /Zwei Klingen/ }).click();
  await page.getByRole('radio', { name: /Giftmischerin/ }).click();
  await page.getByRole('radio', { name: /Frostgelehrter/ }).click();
  for (const n of ['Lebenskraft erhöhen', 'Rüstung erhöhen']) await page.getByRole('button', { name: n }).first().click();
  await page.getByRole('button', { name: 'Stärke erhöhen' }).nth(1).click();
  await page.getByRole('button', { name: 'Tempo erhöhen' }).nth(2).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/c-prepare-1.png` });
  await page.click('text=Aufbrechen');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/c-map.png` });
  await page.click('text=Talentpunkte verteilen');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/c-talents.png` });
}
if (want('combat')) {
  for (const [name, arch, exp, station] of [
    ['a', { fritz: 'blades', ivo: 'frost', sera: 'poison' }, 1, 0],
    ['b', { fritz: 'bulwark', ivo: 'storm', sera: 'light' }, 2, 4],
  ] as const) {
    let r = A.startRun(structuredClone(base), exp, { seed: 5, archetypes: arch as any });
    r = A.confirmPrepare(r);
    r.run!.station = station;
    r = A.enterStation(r);
    await load(r);
    await page.click('text=Kampf beginnen');
    await page.waitForTimeout(1500);
    if (name === 'a') await page.keyboard.press('3');
    if (name === 'b') { await page.keyboard.press('1'); await page.keyboard.press('e'); }
    await page.waitForTimeout(2500);
    if (name === 'a') await page.keyboard.press('2');
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/c-combat-${name}.png` });
    if (name === 'b') {
      await page.getByRole('button', { name: /nach vorn/ }).first().click();
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${OUT}/c-combat-swap.png` });
    }
  }
}
if (want('levelup')) {
  let r = A.startRun(structuredClone(base), 1, { seed: 5, archetypes: { fritz: 'bulwark', ivo: 'storm', sera: 'light' } });
  r = A.confirmPrepare(r);
  r.run!.attrPoints = 2;
  r.run!.level = 2;
  r.run!.pendingLevelUps = 1;
  r.run!.levelOffer = ['schildstoss', 'nachzuendung', 'behutsameHaende'];
  r.run!.phase = 'levelup';
  await load(r);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/c-levelup.png` });
}
console.log('errors', errors);
await browser.close();
