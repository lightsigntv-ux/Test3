// Screenshots ausgewählter Zustände für die Sichtprüfung.
import { chromium } from 'playwright';
import * as A from '../src/game/actions';
import { newSave, SAVE_KEY } from '../src/game/save';
import { CombatSim } from '../src/sim/combat';
const URL = process.env.URL ?? 'http://localhost:4173/';
const OUT = process.env.OUT ?? '/tmp/claude-0/shots';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1366, height: 860 } });
const errors: string[] = [];
page.on('pageerror', (e) => errors.push(String(e)));
async function load(save: unknown) {
  await page.goto(URL);
  await page.evaluate(([k, v]) => localStorage.setItem(k as string, v as string), [SAVE_KEY, JSON.stringify(save)]);
  await page.reload();
  await page.getByRole('button', { name: /fortsetzen|Weiterspielen/ }).click();
  for (let i = 0; i < 10 && (await page.locator('.dialog-back').count()); i++) await page.keyboard.press('Escape');
}
const base = newSave();
base.meta.seenDialogs.push('intro', 'exp1_start', 'exp2_start', 'exp3_start', 'boss1_pre', 'boss2_pre', 'boss3_pre');
base.meta.tutorialsSeen.push('combat', 'windup', 'focusFull', 'purr', 'taunt', 'summon');
base.meta.runsStarted = 3;
base.meta.light = 9;
base.meta.sealsOwned = ['glut1', 'bastion1', 'bastion2'];
base.meta.sealsActive = ['bastion1', 'bastion2'];
base.meta.discoveredItems = ['zunderring', 'schildspange', 'glutherz', 'ascheglas', 'taktgeber'];
base.meta.discoveredRelics = ['mondgloeckchen', 'wappen'];
base.meta.yuumiDiscovered = true;
base.meta.bossesDefeated = ['glockenwaechter'];
base.meta.unlockedExpedition = 2;

await load(base);
await page.click('text=Siegel');
await page.screenshot({ path: `${OUT}/s-seals.png` });
await page.click('text=Sammlung');
await page.screenshot({ path: `${OUT}/s-collection.png`, fullPage: true });

// Build-Übersicht mitten im Run
let r = A.startRun(structuredClone(base), 2, { seed: 31 });
r.run!.equipment.ivo = ['glutherz', 'zunderring'];
r.run!.equipment.fritz[1] = 'dornenschild';
r.run!.relics = ['mondgloeckchen', 'wappen'];
r.run!.upgrades = ['standhaft', 'heisseAsche'];
r.run!.level = 3;
r.run!.station = 3;
await load(r);
await page.screenshot({ path: `${OUT}/s-map-mid.png` });
await page.keyboard.press('b');
await page.screenshot({ path: `${OUT}/s-build.png` });
await page.keyboard.press('Escape');
await page.click('text=Die Laterne bewahren').catch(() => {});

// Storyereignis Kapitel 2 mit Botin
const b2 = structuredClone(base);
b2.meta.story.courierSaved = true;
let r2 = A.startRun(b2, 2, { seed: 31 });
r2.run!.station = 3;
r2.run!.relics[0] = 'mondgloeckchen';
r2 = A.enterStation(r2);
await load(r2);
await page.screenshot({ path: `${OUT}/s-register.png` });

// Bosskampf Phase 2 (Glockenwächter)
let r3 = A.startRun(structuredClone(base), 1, { seed: 8 });
r3.run!.station = 7;
r3.run!.level = 4;
r3 = A.enterStation(r3);
await load(r3);
await page.click('text=Kampf beginnen');
await page.evaluate(() => {});
for (let i = 0; i < 90; i++) {
  await page.keyboard.press('2');
  await page.keyboard.press('1');
  await page.waitForTimeout(300);
  if (await page.locator('.st-exh, .badge.boss:has-text("Sturmläuten")').count()) break;
}
await page.keyboard.press(' ');
await page.screenshot({ path: `${OUT}/s-boss-phase2.png` });

// Niederlage mit Analyse
let r4 = A.startRun(structuredClone(base), 2, { seed: 12 });
r4 = A.enterStation(r4);
const sim = new CombatSim(A.buildCombatSetup(r4)!);
sim.runToEnd(); // ohne Fähigkeiten → vermutlich verloren oder knapp
const s4 = A.combatFinished(r4, { result: 'defeat', heroHp: { fritz: 0, ivo: 0, sera: 0 }, stats: sim.stats, enemiesAlive: sim.aliveEnemies().map((e) => ({ name: e.name, hpPct: e.hp / e.maxHp, role: e.def!.role })) });
await load(s4);
await page.screenshot({ path: `${OUT}/s-defeat.png` });
console.log('errors', errors);
await browser.close();
