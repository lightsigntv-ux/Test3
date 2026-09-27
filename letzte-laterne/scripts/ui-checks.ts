// Gezielte Browserprüfungen: Neuladen im Kampf / bei Belohnung, Import, beide Enden mit/ohne Yuumi, Lange Nacht.
// Aufruf (Vorschau-Server muss laufen): npx tsx scripts/ui-checks.ts
import { chromium, type Page } from 'playwright';
import * as A from '../src/game/actions';
import { newSave, SAVE_KEY } from '../src/game/save';
const URL = process.env.URL ?? 'http://localhost:4173/';
const OUT = process.env.OUT ?? '/tmp/claude-0/shots';
const results: [string, boolean, string?][] = [];
const check = (name: string, ok: boolean, info?: string) => results.push([name, ok, info]);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1366, height: 860 } });
const errors: string[] = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('dialog', (d) => d.accept());

async function load(save: unknown) {
  await page.goto(URL);
  await page.evaluate(([k, v]) => localStorage.setItem(k as string, v as string), [SAVE_KEY, JSON.stringify(save)]);
  await page.reload();
  await page.getByRole('button', { name: /fortsetzen|Weiterspielen/ }).click();
}
async function skipDialogs(p: Page) {
  for (let i = 0; i < 10 && (await p.locator('.dialog-back').count()); i++) await p.keyboard.press('Escape');
}

// 1) Neuladen während eines Kampfes
{
  let s = A.startRun(newSave(), 1, { seed: 4242 });
  s.meta.seenDialogs.push('intro', 'exp1_start');
  s.meta.tutorialsSeen.push('combat', 'windup', 'focusFull', 'purr', 'taunt', 'summon');
  s = A.enterStation(s);
  await load(s);
  await skipDialogs(page);
  await page.click('text=Kampf beginnen');
  await page.waitForTimeout(2500);
  const hpBefore = await page.locator('.unit.enemy .bar-label').first().innerText();
  await page.reload();
  await page.getByRole('button', { name: /fortsetzen/ }).click();
  const pre = await page.locator('.precombat').count();
  await page.click('text=Kampf beginnen');
  const hpAfter = await page.locator('.unit.enemy .bar-label').first().innerText();
  check('Neuladen im Kampf → derselbe Kampf beginnt neu (Vorbereitung sichtbar)', pre === 1, `${hpBefore} → ${hpAfter}`);
  // Kampf ausspielen
  for (let i = 0; i < 200 && !(await page.locator('.end-overlay').count()); i++) {
    await page.keyboard.press('2');
    await page.keyboard.press('1');
    await page.waitForTimeout(250);
  }
  await page.click('.end-overlay button');
  await page.waitForTimeout(2000);
  const offer1 = await page.locator('.loot-name').allInnerTexts();
  await page.reload();
  await page.getByRole('button', { name: /fortsetzen/ }).click();
  await page.waitForTimeout(2000);
  const offer2 = await page.locator('.loot-name').allInnerTexts();
  check('Neuladen bei Belohnung → identisches Angebot', offer1.length === 3 && offer1.join() === offer2.join(), offer1.join(', '));
  await page.locator('.loot-card').first().click();
  await page.locator('.slot-tile').first().click();
  await page.locator('button.btn.primary.big').click();
  await page.reload();
  await page.getByRole('button', { name: /fortsetzen/ }).click();
  const stillReward = await page.locator('.reward-screen').count();
  check('Neuladen nach Belohnung → keine erneute Belohnung', stillReward === 0);
  const saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), SAVE_KEY);
  const eqCount = Object.values(saved.run.equipment).flat().filter(Boolean).length;
  check('Genau ein Gegenstand ausgerüstet', eqCount === 1, String(eqCount));
}

// 2) Katzenereignis → Neuladen
{
  let s = A.startRun(newSave(), 1, { seed: 99 });
  s.meta.seenDialogs.push('intro', 'exp1_start');
  s.run!.station = 1;
  await load(s);
  await skipDialogs(page);
  await page.click('text=Dem Miauen folgen');
  await page.screenshot({ path: `${OUT}/chk-cat-event.png` });
  await page.click('text=Das Laternenlicht mit Yuumi teilen');
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/chk-cat-dialog.png` });
  const dialogShown = await page.locator('.dialog-back').count();
  await page.reload();
  await page.getByRole('button', { name: /fortsetzen/ }).click();
  await skipDialogs(page);
  const pill = await page.locator('.yuumi-pill').count();
  const saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), SAVE_KEY);
  check('Katzenereignis: Dialog, Relikt nach Neuladen erhalten, kein erneutes Ereignis', dialogShown === 1 && pill === 1 && saved.run.station === 2 && saved.run.relics.includes('mondgloeckchen'));
  await page.click('.preview button.btn.primary');
  await skipDialogs(page);
  await page.screenshot({ path: `${OUT}/chk-cat-precombat.png` });
  const startFocus = await page.locator('.focus-meter b').innerText();
  check('Nächster Kampf beginnt mit 1 Fokus weniger', startFocus === '2', startFocus);
  await page.click('text=Kampf beginnen');
  await page.waitForTimeout(3600);
  await page.screenshot({ path: `${OUT}/chk-yuumi-combat.png` });
  // Neuladen eines Kampfes mit Yuumi
  await page.reload();
  await page.getByRole('button', { name: /fortsetzen/ }).click();
  await page.click('text=Kampf beginnen');
  check('Neuladen eines Kampfes mit Yuumi: sie ist wieder da', (await page.locator('.yuumi-unit').count()) === 1);
}

// 3) Import (ungültig / gültig)
{
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  const s = newSave();
  s.meta.seenDialogs.push('intro');
  s.meta.runsStarted = 1;
  await load(s);
  await page.click('text=Einstellungen');
  await page.fill('.import-area', '{"kaputt": true}');
  await page.click('text=Text importieren');
  const err = await page.locator('.notice-text').innerText();
  const good = newSave();
  good.meta.light = 17;
  good.meta.runsStarted = 3;
  await page.fill('.import-area', JSON.stringify(good));
  await page.click('text=Text importieren');
  const light = await page.locator('.light-count').innerText();
  check('Import: ungültig abgelehnt, gültig übernommen', /kein gültiger/.test(err) && light.includes('17'), `${err} | ${light}`);
}

// 4) Beide Enden, mit und ohne Yuumi, danach Lange Nacht
for (const [ending, cat] of [['keep', true], ['extinguish', false]] as const) {
  const s = newSave();
  s.meta.unlockedExpedition = 3;
  s.meta.bossesDefeated = ['glockenwaechter', 'archivarin'];
  s.meta.seenDialogs.push('intro', 'exp3_start', 'boss3_pre');
  let r = A.startRun(s, 3, { seed: 5 });
  if (cat) r.run!.relics[0] = 'mondgloeckchen';
  r.run!.station = 7;
  r = A.enterStation(r);
  r = A.combatFinished(r, { result: 'victory', heroHp: { fritz: 50, ivo: 50, sera: 50 }, stats: new (await import('../src/sim/combat')).CombatSim(A.buildCombatSetup(r)!).stats, enemiesAlive: [] });
  r.dialogQueue = [];
  await load(r);
  await page.screenshot({ path: `${OUT}/chk-ending-${ending}.png` });
  await page.click(ending === 'keep' ? 'text=Die Laterne bewahren' : 'text=Die Laterne löschen');
  const texts: string[] = [];
  for (let i = 0; i < 12 && (await page.locator('.dialog-back').count()); i++) {
    texts.push(await page.locator('.dialog-text p').innerText());
    if (i === 3) await page.screenshot({ path: `${OUT}/chk-ending-dialog-${ending}.png` });
    await page.locator('.dialog-box .btn.primary').click();
  }
  const yuumiLine = texts.some((t) => t.includes('Yuumi'));
  check(`Ende „${ending}“ ${cat ? 'mit' : 'ohne'} Yuumi: Yuumi-Moment ${cat ? 'vorhanden' : 'fehlt korrekt'}`, yuumiLine === cat, `${texts.length} Zeilen`);
  await page.click('text=Zurück zur Laternenstube');
  await skipDialogs(page);
  const night = await page.locator('text=Die lange Nacht').count();
  await page.screenshot({ path: `${OUT}/chk-hub-after-${ending}.png` });
  check('Nach dem Abschluss: Lange Nacht verfügbar', night > 0);
  if (ending === 'extinguish') {
    await page.locator('.mod-row input').first().check();
    await page.locator('.mod-row input').nth(1).check();
    await page.screenshot({ path: `${OUT}/chk-longnight.png` });
    await page.click('text=In die lange Nacht aufbrechen');
    await skipDialogs(page);
    const pill = await page.locator('.pill.night').innerText();
    check('Lange Nacht startet mit sichtbaren Modifikatoren', pill.includes('2'), pill);
  }
}

console.log(results.map(([n, ok, i]) => `${ok ? '✔' : '✘'} ${n}${i ? `  (${i})` : ''}`).join('\n'));
console.log('Seitenfehler:', errors);
await browser.close();
