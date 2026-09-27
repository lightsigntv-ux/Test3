// Prüft Musikwechsel, Sprachausgabe und Absenken der Musik im echten Browser.
import { chromium } from 'playwright';
import * as A from '../src/game/actions';
import { newSave, SAVE_KEY } from '../src/game/save';
const URL = process.env.URL ?? 'http://localhost:4173/';
const results: [string, boolean, string?][] = [];
const check = (n: string, ok: boolean, i?: unknown) => results.push([n, ok, i === undefined ? undefined : JSON.stringify(i)]);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1366, height: 860 } });
const errors: string[] = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const st = () => page.evaluate(() => (window as any).__laterneAudio.state());
await page.goto(URL);
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.getByRole('button', { name: 'Neues Spiel' }).click();
await page.waitForTimeout(1800);
let s = await st();
check('Nach erstem Klick: ruhige Musik (Castle Dawn) läuft', s.mood === 'calm' && s.music.calm && !s.music.calm.paused && s.music.calm.time > 0.3, s.music);
check('Intro-Dialog wird gesprochen, Musik abgesenkt', !!s.voice && s.voice.src.startsWith('narrator') && s.duck < 0.6, { v: s.voice, duck: s.duck });
const first = s.voice?.src;
await page.keyboard.press('Enter');
await page.waitForTimeout(600);
s = await st();
check('Nächste Zeile → nächste Aufnahme', !!s.voice && s.voice.src !== first, s.voice);
await page.keyboard.press('Escape');
await page.waitForTimeout(1500);
s = await st();
check('Nach Überspringen: Einleitung verstummt, danach spricht Fritz in der Laternenstube', !!s.voice && s.voice.src.startsWith('fritz'), { v: s.voice, duck: s.duck });
await page.waitForTimeout(4500);
s = await st();
check('Nach dem Satz: Musik wieder in voller Lautstärke', !s.voice && s.duck > 0.9, { v: s.voice, duck: s.duck });

// Kampf
let save = A.startRun(newSave(), 1, { seed: 4242 });
save.meta.seenDialogs.push('intro', 'exp1_start');
save.meta.tutorialsSeen.push('combat', 'windup', 'focusFull', 'purr', 'taunt', 'summon');
save = A.enterStation(save);
save.dialogQueue = [];
await page.evaluate(([k, v]) => localStorage.setItem(k as string, v as string), [SAVE_KEY, JSON.stringify(save)]);
await page.reload();
await page.getByRole('button', { name: /fortsetzen/ }).click();
await page.waitForTimeout(1500);
s = await st();
check('Kampfvorbereitung: noch ruhige Musik', s.mood === 'calm', s.mood);
await page.click('text=Kampf beginnen');
await page.waitForTimeout(2200);
s = await st();
check('Kampf läuft: Kampfmusik (Clans Last Stand) aktiv, ruhige Musik ausgeblendet', s.mood === 'action' && !s.music.action.paused && s.music.action.time > 0.5 && s.music.calm.volume < 0.05, s.music);
for (let i = 0; i < 200 && !(await page.locator('.end-overlay').count()); i++) {
  await page.keyboard.press('2');
  await page.keyboard.press('1');
  await page.waitForTimeout(250);
}
await page.waitForTimeout(1800);
s = await st();
check('Nach Kampfende: zurück zur ruhigen Musik', s.mood === 'calm' && !s.music.calm.paused, s.music);

// Elite- und Bosskampf: eigene Musik
for (const [station, mood, file] of [[4, 'elite', 'boar-iron-crescendo.mp3'], [7, 'boss', 'cathedrals-last-chant.mp3']] as const) {
  let b = A.startRun(newSave(), 1, { seed: 77 });
  b.meta.seenDialogs.push('intro', 'exp1_start', 'boss1_pre');
  b.meta.tutorialsSeen.push('combat', 'windup', 'focusFull', 'purr', 'taunt', 'summon');
  b.run!.station = station;
  b = A.enterStation(b);
  b.dialogQueue = [];
  await page.evaluate(([k, v]) => localStorage.setItem(k as string, v as string), [SAVE_KEY, JSON.stringify(b)]);
  await page.reload();
  await page.getByRole('button', { name: /fortsetzen/ }).click();
  await page.waitForTimeout(800);
  await page.click('text=Kampf beginnen');
  await page.waitForTimeout(2200);
  s = await st();
  const m = s.music[mood];
  check(`${mood === 'boss' ? 'Bosskampf' : 'Elitekampf'}: ${file} läuft, andere Musik ausgeblendet`, s.mood === mood && m && m.src === file && !m.paused && m.time > 0.5 && (!s.music.action || s.music.action.volume < 0.05) && s.music.calm.volume < 0.05, s.music);
}

// Ereignis: sequentielles Vorlesen
let ev = A.startRun(newSave(), 1, { seed: 99 });
ev.meta.seenDialogs.push('intro', 'exp1_start');
ev.run!.station = 1;
ev = A.enterStation(ev, 'event');
ev.dialogQueue = [];
await page.evaluate(([k, v]) => localStorage.setItem(k as string, v as string), [SAVE_KEY, JSON.stringify(ev)]);
await page.reload();
await page.getByRole('button', { name: /fortsetzen/ }).click();
await page.waitForTimeout(1500);
s = await st();
const hl = await page.locator('.speaking-line').count();
check('Ereignis „Ein Miauen im Nebel“: Zeilen werden vorgelesen und hervorgehoben', !!s.voice && hl === 1, s.voice);
await page.locator('.voice-btn').nth(1).click();
await page.waitForTimeout(400);
s = await st();
check('🔊-Knopf spielt Seras Zeile', !!s.voice && s.voice.src.startsWith('sera'), s.voice);
// Stimme aus
await page.evaluate(([k]) => { const d = JSON.parse(localStorage.getItem(k as string)!); d.settings.voice = false; localStorage.setItem(k as string, JSON.stringify(d)); }, [SAVE_KEY]);
await page.reload();
await page.getByRole('button', { name: /fortsetzen/ }).click();
await page.waitForTimeout(1500);
s = await st();
check('Sprachausgabe aus: keine Stimme', !s.voice, s.voice);
console.log(results.map(([n, ok, i]) => `${ok ? '✔' : '✘'} ${n}${ok ? '' : '  ' + i}`).join('\n'));
console.log('Fehler:', errors);
await browser.close();
