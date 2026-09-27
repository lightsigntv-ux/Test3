// Audio-Engine: Musik (Überblendung ruhig ↔ Kampf, Absenken bei Sprache), Sprachausgabe
// und synthetisierte Effekte. Alle Geräusche – auch Yuumis – hängen am Hauptschalter.

import type { DialogLine } from '../content/story';
import { spokenText, voiceFile } from '../content/voice';

export type SoundId =
  | 'point'
  | 'unpoint'
  | 'poison'
  | 'frost'
  | 'dodge'
  | 'swap'
  | 'stance'
  | 'hit'
  | 'heal'
  | 'shield'
  | 'ability'
  | 'windup'
  | 'interrupt'
  | 'purr'
  | 'meow'
  | 'bell'
  | 'victory'
  | 'defeat'
  | 'click'
  | 'hover'
  | 'confirm'
  | 'back'
  | 'page'
  | 'transition'
  | 'levelup'
  | 'lootCommon'
  | 'lootRare'
  | 'lootLegendary'
  | 'stamp'
  | 'step'
  | 'denied'
  | 'bossPhase'
  | 'fog'
  | 'burn'
  | 'explode'
  | 'death'
  | 'shieldBreak'
  | 'focus';

export type Mood = 'calm' | 'action' | 'elite' | 'boss';

export interface AudioConfig {
  sound: boolean;
  volume: number; // Gesamt
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  voice: boolean;
}

let cfg: AudioConfig = { sound: true, volume: 0.6, musicVolume: 0.5, sfxVolume: 0.7, voiceVolume: 0.9, voice: true };
let unlocked = false;

// ---------------- Musik ----------------

const TRACKS: Record<Mood, string> = {
  calm: 'audio/music/castle-dawn.mp3',
  action: 'audio/music/clans-last-stand.mp3',
  elite: 'audio/music/boar-iron-crescendo.mp3',
  boss: 'audio/music/cathedrals-last-chant.mp3',
};
const MOODS: Mood[] = ['calm', 'action', 'elite', 'boss'];
const music: Partial<Record<Mood, HTMLAudioElement>> = {};
const level: Record<Mood, number> = { calm: 0, action: 0, elite: 0, boss: 0 }; // aktuelle Überblend-Stufe 0..1
let wantedMood: Mood | null = null;
let duck = 1; // 1 = normal, <1 während Sprache
let duckTarget = 1;
let ticker: number | null = null;

function track(m: Mood): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null;
  if (!music[m]) {
    const a = new Audio(TRACKS[m]);
    a.loop = true;
    a.preload = m === 'calm' ? 'auto' : 'metadata';
    a.volume = 0;
    music[m] = a;
  }
  return music[m]!;
}

function musicGain(): number {
  return cfg.sound ? cfg.volume * cfg.musicVolume : 0;
}

function tick() {
  let busy = false;
  const step = 0.035; // ~1,4 s Überblendung bei 25 Schritten/s
  duck += Math.sign(duckTarget - duck) * Math.min(Math.abs(duckTarget - duck), 0.08);
  if (Math.abs(duckTarget - duck) > 0.001) busy = true;
  for (const m of MOODS) {
    const target = wantedMood === m ? 1 : 0;
    const cur = level[m];
    const next = cur + Math.sign(target - cur) * Math.min(Math.abs(target - cur), step);
    level[m] = next;
    if (Math.abs(target - next) > 0.001) busy = true;
    const a = music[m];
    if (!a) continue;
    a.volume = Math.max(0, Math.min(1, next * musicGain() * duck));
    if (next <= 0.001 && !a.paused) {
      a.pause();
      if (m !== 'calm') a.currentTime = 0; // Kampfmusik beginnt jedes Mal von vorn
    }
    if (next > 0.001 && a.paused && unlocked && musicGain() > 0) void a.play().catch(() => {});
  }
  if (!busy && ticker !== null) {
    clearInterval(ticker);
    ticker = null;
  }
}

function ensureTicker() {
  if (ticker === null && typeof window !== 'undefined') ticker = window.setInterval(tick, 40);
}

/** Setzt die gewünschte Stimmung; die Musik blendet weich über. */
export function setMusic(mood: Mood | null) {
  if (wantedMood === mood) return;
  wantedMood = mood;
  if (mood) track(mood);
  ensureTicker();
}

// ---------------- Freischalten nach erster Interaktion ----------------

export function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  const c = ac();
  if (c && c.state === 'suspended') void c.resume();
  ensureTicker();
  tick(); // noch innerhalb der Nutzergeste starten
}

if (typeof window !== 'undefined') {
  const once = () => unlockAudio();
  window.addEventListener('pointerdown', once, { capture: true });
  window.addEventListener('keydown', once, { capture: true });
}

export function configureAudio(next: Partial<AudioConfig>) {
  cfg = { ...cfg, ...next };
  if (!cfg.sound || !cfg.voice) stopVoice();
  ensureTicker();
  tick();
}

// ---------------- Sprache ----------------

let voiceEl: HTMLAudioElement | null = null;
let voiceToken = 0;
const voiceListeners = new Set<(playing: boolean) => void>();

export function onVoiceChange(fn: (playing: boolean) => void): () => void {
  voiceListeners.add(fn);
  return () => voiceListeners.delete(fn);
}

function setVoicePlaying(p: boolean) {
  duckTarget = p ? 0.3 : 1;
  ensureTicker();
  for (const f of voiceListeners) f(p);
}

export function isVoicePlaying(): boolean {
  return !!voiceEl && !voiceEl.paused && !voiceEl.ended;
}

export function stopVoice() {
  voiceToken++;
  if (voiceEl) {
    voiceEl.pause();
    voiceEl = null;
    setVoicePlaying(false);
  }
}

/**
 * Spricht eine Zeile. Liefert ein Promise, das nach dem Ende (oder sofort, wenn es nichts zu
 * sprechen gibt bzw. Stimmen aus sind) erfüllt wird. Eine neue Zeile beendet die alte.
 */
export function speak(line: Pick<DialogLine, 'speaker' | 'text'>): Promise<void> {
  stopVoice();
  const token = voiceToken;
  if (line.speaker === 'yuumi') play(/schnurr|purr/i.test(line.text) ? 'purr' : 'meow');
  if (!cfg.sound || !cfg.voice || typeof Audio === 'undefined') return Promise.resolve();
  const file = spokenText(line) ? voiceFile(line) : null;
  if (!file) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const a = new Audio(file);
    a.volume = Math.max(0, Math.min(1, cfg.volume * cfg.voiceVolume));
    voiceEl = a;
    const done = () => {
      if (voiceEl === a) {
        voiceEl = null;
        setVoicePlaying(false);
      }
      resolve();
    };
    a.onended = done;
    a.onerror = done;
    a.onpause = () => {
      if (token !== voiceToken) resolve();
    };
    setVoicePlaying(true);
    a.play().catch(done);
  });
}

// ---------------- Effekte (synthetisiert) ----------------

let ctx: AudioContext | null = null;
let noiseBuf: AudioBuffer | null = null;
const lastPlayed: Partial<Record<SoundId, number>> = {};

function ac(): AudioContext | null {
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended' && unlocked) void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function sfxGain(): number {
  return cfg.sound ? cfg.volume * cfg.sfxVolume : 0;
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, when = 0, slideTo?: number) {
  const c = ac();
  const g0 = sfxGain();
  if (!c || g0 <= 0) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain * g0), t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

/** Gefiltertes Rauschen – für Wind, Rascheln, Schritte, Einschläge. */
function noise(dur: number, gain: number, when = 0, filter: { type: BiquadFilterType; from: number; to?: number; q?: number } = { type: 'lowpass', from: 1200 }) {
  const c = ac();
  const g0 = sfxGain();
  if (!c || g0 <= 0) return;
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = c.currentTime + when;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  const f = c.createBiquadFilter();
  f.type = filter.type;
  f.frequency.setValueAtTime(filter.from, t);
  if (filter.to) f.frequency.exponentialRampToValueAtTime(filter.to, t + dur);
  f.Q.value = filter.q ?? 0.8;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain * g0), t + Math.min(0.05, dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t, Math.random());
  src.stop(t + dur + 0.05);
}

const MIN_GAP: Partial<Record<SoundId, number>> = { hover: 60, hit: 60, burn: 90, heal: 90, shield: 90, click: 40, poison: 120, frost: 150, dodge: 80 };

export function play(id: SoundId) {
  if (!cfg.sound) return;
  const now = performance.now();
  if ((lastPlayed[id] ?? 0) > now - (MIN_GAP[id] ?? 70)) return;
  lastPlayed[id] = now;
  switch (id) {
    case 'hit':
      noise(0.09, 0.12, 0, { type: 'bandpass', from: 900, q: 1.2 });
      tone(150, 0.08, 'triangle', 0.05, 0, 80);
      break;
    case 'burn':
      noise(0.12, 0.05, 0, { type: 'highpass', from: 2500 });
      break;
    case 'heal':
      tone(660, 0.22, 'sine', 0.05);
      tone(990, 0.26, 'sine', 0.035, 0.07);
      break;
    case 'shield':
      tone(520, 0.3, 'triangle', 0.05);
      tone(780, 0.3, 'triangle', 0.03, 0.03);
      break;
    case 'shieldBreak':
      noise(0.25, 0.08, 0, { type: 'highpass', from: 3000 });
      tone(900, 0.2, 'triangle', 0.04, 0, 400);
      break;
    case 'ability':
      noise(0.25, 0.05, 0, { type: 'bandpass', from: 600, to: 2400, q: 2 });
      tone(420, 0.2, 'triangle', 0.06, 0, 840);
      break;
    case 'windup':
      tone(196, 0.5, 'sawtooth', 0.035, 0, 294);
      tone(98, 0.5, 'sine', 0.05, 0, 147);
      break;
    case 'interrupt':
      noise(0.12, 0.1, 0, { type: 'bandpass', from: 2000, q: 3 });
      tone(900, 0.14, 'square', 0.04, 0, 300);
      break;
    case 'explode':
      noise(0.5, 0.18, 0, { type: 'lowpass', from: 1800, to: 120 });
      tone(90, 0.4, 'sine', 0.1, 0, 40);
      break;
    case 'death':
      tone(260, 0.5, 'sine', 0.05, 0, 110);
      noise(0.4, 0.04, 0.05, { type: 'lowpass', from: 800, to: 200 });
      break;
    case 'purr':
      for (let i = 0; i < 8; i++) tone(52 + (i % 2) * 7, 0.1, 'sine', 0.09, i * 0.075);
      noise(0.6, 0.02, 0, { type: 'lowpass', from: 300 });
      break;
    case 'meow':
      tone(620, 0.32, 'sine', 0.06, 0, 1050);
      tone(1050, 0.28, 'sine', 0.045, 0.28, 560);
      tone(1250, 0.2, 'sine', 0.012, 0.05, 1900);
      break;
    case 'bell':
      tone(1320, 0.9, 'sine', 0.04);
      tone(1980, 0.7, 'sine', 0.02);
      break;
    case 'bossPhase':
      [196, 392, 588].forEach((f, i) => tone(f, 2.2, 'sine', 0.06 / (i + 1)));
      noise(1.2, 0.03, 0, { type: 'lowpass', from: 400 });
      break;
    case 'fog':
      noise(2.4, 0.07, 0, { type: 'lowpass', from: 200, to: 600 });
      tone(55, 2.2, 'sine', 0.06);
      break;
    case 'focus':
      tone(1568, 0.12, 'sine', 0.018);
      break;
    case 'victory':
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.35, 'triangle', 0.06, i * 0.11));
      tone(1568, 0.8, 'sine', 0.03, 0.45);
      break;
    case 'defeat':
      [392, 330, 262, 196].forEach((f, i) => tone(f, 0.55, 'sine', 0.06, i * 0.2));
      break;
    case 'click':
      tone(1100, 0.035, 'sine', 0.03);
      noise(0.03, 0.03, 0, { type: 'highpass', from: 4000 });
      break;
    case 'hover':
      tone(1800, 0.025, 'sine', 0.008);
      break;
    case 'confirm':
      tone(660, 0.09, 'triangle', 0.045);
      tone(990, 0.16, 'triangle', 0.045, 0.07);
      break;
    case 'back':
      tone(700, 0.08, 'triangle', 0.035, 0, 500);
      break;
    case 'page':
      noise(0.18, 0.05, 0, { type: 'bandpass', from: 3000, to: 1500, q: 0.7 });
      break;
    case 'step':
      noise(0.07, 0.06, 0, { type: 'lowpass', from: 500 });
      noise(0.07, 0.05, 0.18, { type: 'lowpass', from: 450 });
      break;
    case 'transition':
      // Aufbruch in den Kampf: Windstoß, Trommel, Glocke
      noise(0.9, 0.12, 0, { type: 'bandpass', from: 300, to: 3500, q: 1.5 });
      tone(70, 0.5, 'sine', 0.14, 0.5, 45);
      noise(0.25, 0.12, 0.5, { type: 'lowpass', from: 400 });
      tone(880, 1.0, 'sine', 0.03, 0.55);
      break;
    case 'levelup':
      [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.3, 'sine', 0.045, i * 0.07));
      break;
    case 'lootCommon':
      tone(880, 0.15, 'triangle', 0.035);
      break;
    case 'lootRare':
      tone(988, 0.2, 'triangle', 0.04);
      tone(1318, 0.25, 'triangle', 0.035, 0.08);
      break;
    case 'lootLegendary':
      [784, 988, 1175, 1568, 1976].forEach((f, i) => tone(f, 0.5, 'sine', 0.04, i * 0.06));
      noise(0.8, 0.02, 0.1, { type: 'highpass', from: 6000 });
      break;
    case 'stamp':
      noise(0.12, 0.14, 0, { type: 'lowpass', from: 350 });
      tone(110, 0.2, 'sine', 0.1);
      tone(1320, 0.5, 'sine', 0.025, 0.12);
      break;
    case 'denied':
      tone(180, 0.12, 'square', 0.025);
      break;
    case 'point':
      tone(784, 0.12, 'sine', 0.04);
      tone(1175, 0.22, 'sine', 0.035, 0.06);
      tone(2349, 0.3, 'sine', 0.008, 0.08);
      break;
    case 'unpoint':
      tone(988, 0.1, 'sine', 0.03, 0, 660);
      break;
    case 'poison':
      for (let i = 0; i < 3; i++) tone(300 + i * 90, 0.08, 'sine', 0.03, i * 0.06, 520 + i * 90);
      break;
    case 'frost':
      tone(2093, 0.35, 'sine', 0.02);
      tone(2637, 0.3, 'sine', 0.015, 0.05);
      noise(0.3, 0.03, 0, { type: 'highpass', from: 5000 });
      break;
    case 'dodge':
      noise(0.16, 0.06, 0, { type: 'bandpass', from: 1200, to: 4000, q: 1.2 });
      break;
    case 'swap':
      noise(0.3, 0.06, 0, { type: 'bandpass', from: 500, to: 2500, q: 1 });
      tone(330, 0.12, 'triangle', 0.04, 0.12, 495);
      break;
    case 'stance':
      tone(220, 0.14, 'triangle', 0.05);
      noise(0.1, 0.05, 0, { type: 'lowpass', from: 700 });
      break;
  }
}

// ---------------- Globale UI-Klänge ----------------

/** Hängt dezente Klick-/Hover-Klänge an alle Knöpfe; data-sfx="…" wählt einen anderen Klang, "none" schaltet ab. */
export function installUiSounds() {
  if (typeof document === 'undefined') return;
  document.addEventListener(
    'click',
    (e) => {
      const b = (e.target as HTMLElement | null)?.closest('button, [role="button"], .tab, input[type="checkbox"]') as HTMLElement | null;
      if (!b) return;
      const sfx = b.getAttribute('data-sfx');
      if (sfx === 'none') return;
      if ((b as HTMLButtonElement).disabled) return play('denied');
      play((sfx as SoundId) || 'click');
    },
    true,
  );
  let lastHover: Element | null = null;
  document.addEventListener(
    'pointerover',
    (e) => {
      const b = (e.target as HTMLElement | null)?.closest('button:not(:disabled), .tab') ?? null;
      if (b && b !== lastHover) play('hover');
      lastHover = b;
    },
    true,
  );
}

// Diagnose (für automatisierte Browserprüfungen)
if (typeof window !== 'undefined') {
  (window as unknown as { __laterneAudio: unknown }).__laterneAudio = {
    state: () => ({
      unlocked,
      mood: wantedMood,
      duck: Number(duck.toFixed(2)),
      music: Object.fromEntries(
        Object.entries(music).map(([k, a]) => [k, { src: a!.src.split('/').pop(), paused: a!.paused, volume: Number(a!.volume.toFixed(2)), time: Number(a!.currentTime.toFixed(1)) }]),
      ),
      voice: voiceEl ? { src: voiceEl.src.split('/').pop(), paused: voiceEl.paused } : null,
    }),
  };
}
