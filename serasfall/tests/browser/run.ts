// Echter Browser-Durchlauf (Playwright/Chromium): spielt das Spiel über Tastatur und Klicks bis zu einem Ende.
// Aufruf: npx tsx tests/browser/run.ts <url> <policy:echo|siegel|zeugin> <shotdir>
import { chromium, type Page } from 'playwright';
import fs from 'node:fs';
import { buildContent } from '../../src/content';
import { plan, chooseIndex, KIND, HARSH, type Policy } from '../shared/planner';
import type { GameState, Hotspot } from '../../src/engine/types';
import type { LineView } from '../../src/engine/dialogue';
import { STATEMENT_BY_ID } from '../../src/content/statements';
import { CLUE_BY_ID } from '../../src/content/clues';
import { DEDUCTION_BY_ID } from '../../src/content/deductions';

const url = process.argv[2] ?? 'http://localhost:4173/';
const which = process.argv[3] ?? 'echo';
const shots = process.argv[4] ?? 'tests/browser/out';
fs.mkdirSync(shots, { recursive: true });
const POLICIES: Record<string, Policy> = {
  echo: { name: 'echo', order: KIND, ending: 'go' },
  siegel: { name: 'siegel', order: KIND, npcOrder: { lionel: HARSH }, ending: 'go' },
  zeugin: { name: 'zeugin', order: KIND, ending: 'stay' },
};
const policy = POLICIES[which];
const C = buildContent();

interface Snap { game: GameState; view?: LineView; overlay: string; talkNpc?: string; seraX: number; catX: number; fade: number; ending: string | null }
const snap = (page: Page): Promise<Snap> => page.evaluate(() => {
  const c = (window as any).__serasfall;
  return JSON.parse(JSON.stringify({ game: c.game, view: c.view, overlay: c.overlay, talkNpc: c.talkNpc, seraX: c.seraX, catX: c.catX, fade: c.fade, ending: c.ending }));
});

const errors: string[] = [];
const report: string[] = [];
const shot = async (page: Page, name: string) => { await page.screenshot({ path: `${shots}/${which}_${name}.png` }); };
const shotOnce = new Set<string>();
const shotFirst = async (page: Page, key: string) => { if (shotOnce.has(key)) return; shotOnce.add(key); await page.waitForTimeout(250); await shot(page, key); };

/** Mit ↓ durch überlappende Ziele schalten, bis das gewünschte gewählt ist (wie eine Spielerin). */
async function focusOn(page: Page, id: string) {
  for (let i = 0; i < 6; i++) {
    const cur = await page.evaluate(() => { const n = (window as any).__serasfall.nearest(); return n?.kind === 'hotspot' ? n.h.id : n?.kind ?? null; });
    if (cur === id) return;
    await page.keyboard.press('ArrowDown');
  }
}

async function main() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await ctx.addInitScript(() => {
    try { if (!localStorage.getItem('serasfall.settings')) localStorage.setItem('serasfall.settings', JSON.stringify({ textSpeed: 'sofort', reducedMotion: true, volumes: { muted: true } })); } catch { /* */ }
  });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e}`));
  await page.goto(url);
  await page.waitForTimeout(500);
  await shot(page, '00_title');
  await page.getByRole('button', { name: 'Neues Spiel' }).click();
  await page.waitForTimeout(300);
  await shot(page, '01_card');

  const failed = new Set<string>();
  let lastKey = '';
  let same = 0;
  let iter = 0;
  let reloaded = false;
  let walked = 0;
  let lastPlan = '', planRepeat = 0;
  let gate: { id: string; loc: string } | null = null;
  const t0 = Date.now();
  while (iter++ < 20000) {
    const s = await snap(page);
    const key = JSON.stringify([s.view?.dlg, s.view?.node, s.overlay, s.talkNpc, s.game.loc, Object.keys(s.game.seen).length, Object.keys(s.game.deductions).length, Object.keys(s.game.recon).length, s.game.controlling]);
    if (iter % 50 === 0) console.log(`[${iter}] ${Math.round((Date.now() - t0) / 1000)}s ${key}`);
    same = key === lastKey ? same + 1 : 0;
    lastKey = key;
    if (same > 60) throw new Error(`Festgefahren: ${key}`);
    if (s.overlay === 'ending') { await page.waitForTimeout(600); await shot(page, '99_ending'); report.push(`Ende erreicht: ${s.ending} nach ${iter} Schritten, ${Math.round((Date.now() - t0) / 1000)} s`); break; }
    if (s.overlay === 'card') { await shotFirst(page, `card_${s.game.chapter}`); await page.keyboard.press('Space'); await page.waitForTimeout(60); continue; }
    if (s.overlay === 'recon') {
      await shotFirst(page, 'recon');
      const open = C.recon.find((q) => s.game.recon[q.id] === undefined);
      const weiter = page.getByRole('button', { name: 'Weiter', exact: true });
      if (await weiter.count()) { await weiter.click(); continue; }
      if (!open) { await shotFirst(page, 'recon_done'); await page.getByRole('button', { name: 'Das Notizbuch zuklappen' }).click(); continue; }
      // einmal bewusst falsch antworten (Zweifel ohne Strafe prüfen)
      if (open.id === 'r1' && !shotOnce.has('recon_wrong')) {
        await page.locator('.recon-opts .choice').nth(open.correct === 0 ? 1 : 0).click();
        await shotFirst(page, 'recon_wrong');
        continue;
      }
      await page.locator('.recon-opts .choice').nth(open.correct).click();
      continue;
    }
    if (s.overlay !== 'none') { await page.keyboard.press('Escape'); continue; }
    if (s.view) {
      if (s.view.speaker && s.view.speaker !== 'narr' && s.view.speaker !== 'inner') await shotFirst(page, `talk_${s.view.speaker}`);
      if (s.view.speaker === 'letter') await shotFirst(page, 'letter');
      if (s.view.choices) await shotFirst(page, 'choices');
      // Neuladen mitten im Gespräch
      if (!reloaded && s.game.chapter === 2 && !s.view.choices) {
        const before = `${s.view.dlg}/${s.view.node}`;
        await page.reload(); await page.waitForTimeout(500);
        await page.getByRole('button', { name: 'Fortsetzen' }).click(); await page.waitForTimeout(300);
        const after = await snap(page);
        const now = after.view ? `${after.view.dlg}/${after.view.node}` : 'kein Dialog';
        report.push(`Neuladen mitten im Gespräch: vorher ${before}, nachher ${now} → ${before === now ? 'OK' : 'FEHLER'}`);
        if (before !== now) throw new Error('Neuladen hat den Dialog nicht wiederhergestellt');
        reloaded = true;
        continue;
      }
      if (s.view.choices) {
        const idx = chooseIndex(s.view, s.game, C, policy);
        const pos = s.view.choices.findIndex((c) => c.index === idx);
        await page.keyboard.press(String(pos + 1));
      } else await page.keyboard.press('Space');
      await page.waitForTimeout(15);
      continue;
    }
    // Freies Spiel
    if (s.fade > 0.45) { await page.waitForTimeout(80); continue; }
    if (gate) { if (s.game.loc === gate.loc) failed.add(gate.id); else failed.clear(); gate = null; }
    const pl = plan(s.game, C, policy, failed);
    if (!pl) throw new Error(`Planer ratlos in Kapitel ${s.game.chapter}, ${s.game.loc}`);
    const pk = JSON.stringify(pl);
    planRepeat = pk === lastPlan ? planRepeat + 1 : 0; lastPlan = pk;
    if (planRepeat > 25) throw new Error(`Gleicher Plan ohne Fortschritt: ${pk.slice(0, 200)}`);
    if (pl.type === 'scene') { if (s.talkNpc) await page.keyboard.press('Escape'); await page.waitForTimeout(80); continue; }
    if (s.talkNpc && !('npc' in pl && pl.npc === s.talkNpc)) { await page.keyboard.press('Escape'); continue; }
    if (pl.type === 'deduce') {
      await page.keyboard.press('n'); await page.waitForTimeout(80);
      await shotFirst(page, 'notebook');
      const q = DEDUCTION_BY_ID[pl.id];
      const art = page.locator('article.question', { hasText: q.question }).first();
      const sels = art.locator('select');
      for (let i = 0; i < pl.answers.length; i++) await sels.nth(i).selectOption(String(pl.answers[i]));
      await art.getByRole('button', { name: 'Festhalten' }).click();
      await page.waitForTimeout(60);
      await shotFirst(page, 'notebook_solved');
      await page.keyboard.press('Escape');
      continue;
    }
    const inCat = s.game.controlling === 'yuumi';
    if (pl.type === 'yuumi') {
      if (!inCat) { await page.keyboard.press('y'); await page.waitForTimeout(40); continue; }
      await page.evaluate((x) => { (window as any).__serasfall.catX = x; }, pl.hotspot.x);
      await focusOn(page, pl.hotspot.id);
      await shotFirst(page, 'yuumi_control');
      await page.keyboard.press('e');
      continue;
    }
    if (inCat) { await page.keyboard.press('y'); await page.waitForTimeout(40); continue; }
    const goTo = async (x: number) => {
      // Gelegentlich wirklich laufen (Tastatur), sonst direkt hinsetzen
      if (walked < 12 && Math.abs(x - s.seraX) > 0.05) {
        walked++;
        const k = x > s.seraX ? 'ArrowRight' : 'ArrowLeft';
        await page.keyboard.down(k);
        for (let i = 0; i < 80; i++) { await page.waitForTimeout(25); const sx = await page.evaluate(() => (window as any).__serasfall.seraX); if (Math.abs(sx - x) < 0.02 || (k === 'ArrowRight' ? sx > x : sx < x)) break; }
        await page.keyboard.up(k);
      }
      await page.evaluate((x) => { (window as any).__serasfall.seraX = x; }, x);
    };
    if (pl.type === 'examine' || pl.type === 'move') {
      await goTo(pl.hotspot.x);
      await focusOn(page, pl.hotspot.id);
      await page.keyboard.press('e');
      await page.waitForTimeout(30);
      if (pl.type === 'move') gate = { id: pl.hotspot.id, loc: s.game.loc }; else failed.clear();
      continue;
    }
    if (pl.type === 'pet') {
      await page.evaluate(() => {
        const c = (window as any).__serasfall;
        const [a, b] = c.loc.xRange;
        for (let x = a; x <= b; x += 0.01) { c.seraX = x; c.catX = x + 0.001; c.catTarget = null; const n = c.nearest(); if (n && n.kind === 'cat') return; }
      });
      await page.keyboard.press('e'); await page.waitForTimeout(30);
      continue;
    }
    // Gespräch
    const npcX: number | undefined = await page.evaluate((n) => (window as any).__serasfall.npcs().find((x: any) => x.npc === n)?.x, pl.npc);
    if (!s.talkNpc) {
      if (npcX !== undefined) await goTo(npcX + 0.0005);
      await page.keyboard.press('e');
      await page.waitForTimeout(40);
      const n = await snap(page);
      if (n.talkNpc !== pl.npc) { if (n.view) continue; await page.evaluate((npc) => (window as any).__serasfall.openTalk(npc), pl.npc); }
      await shotFirst(page, 'talkmenu');
      continue;
    }
    if (pl.type === 'topic') { await page.locator('.talk-list .choice', { hasText: pl.title }).first().click(); continue; }
    if (pl.type === 'smalltalk') { await page.getByRole('button', { name: 'Ein paar Worte wechseln' }).click(); continue; }
    if (pl.type === 'present') {
      await page.getByRole('button', { name: 'Etwas vorlegen …' }).click();
      await page.waitForTimeout(40);
      await shotFirst(page, 'present');
      const label = CLUE_BY_ID[pl.item]?.name ?? DEDUCTION_BY_ID[pl.item]?.question;
      if (label) await page.locator('.pitem', { hasText: label }).first().click();
      else if (STATEMENT_BY_ID[pl.item]) await page.locator('.pitem', { hasText: STATEMENT_BY_ID[pl.item].text.slice(0, 30) }).first().click();
      continue;
    }
  }
  const fin = await snap(page);
  report.push(`Endzustand: Kapitel ${fin.game.chapter}, Ende ${fin.ending ?? 'keins'}`);
  const real = errors.filter((e) => !/favicon/i.test(e));
  report.push(`Konsolenfehler/-warnungen: ${real.length ? '\n  ' + real.join('\n  ') : 'keine'}`);
  console.log(report.join('\n'));
  await browser.close();
  if (!fin.ending || real.length) process.exit(1);
}

main().catch((e) => { console.error('FEHLER', e); console.log(report.join('\n')); process.exit(1); });
