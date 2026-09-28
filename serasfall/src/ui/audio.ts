// Klang: Silbenstimmen, Katzenlaute, Geräusche, Umgebung und ruhige prozedurale Musik. Alles synthetisch (WebAudio), keine Sprachsynthese.
import { CHARACTERS } from '../content/characters';

export interface Volumes { master: number; voice: number; music: number; ambience: number; sfx: number; muted: boolean }

type Ctx = AudioContext;

let ctx: Ctx | null = null;
let master: GainNode, voiceBus: GainNode, musicBus: GainNode, ambBus: GainNode, sfxBus: GainNode, duck: GainNode;
let reverb: ConvolverNode;
let noiseBuf: AudioBuffer, brownBuf: AudioBuffer;
let vol: Volumes = { master: 0.8, voice: 0.7, music: 0.5, ambience: 0.6, sfx: 0.8, muted: false };

function mkNoise(c: Ctx, secs: number, brown = false): AudioBuffer {
  const b = c.createBuffer(1, c.sampleRate * secs, c.sampleRate);
  const d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
  }
  return b;
}

function mkImpulse(c: Ctx, secs: number, decay: number): AudioBuffer {
  const b = c.createBuffer(2, c.sampleRate * secs, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, decay);
  }
  return b;
}

export function audioReady(): boolean { return !!ctx; }

/** Muss nach einer Nutzeraktion aufgerufen werden. */
export function initAudio(): void {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AC) return;
  ctx = new AC() as Ctx;
  master = ctx.createGain();
  master.connect(ctx.destination);
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 3;
  comp.connect(master);
  reverb = ctx.createConvolver();
  reverb.buffer = mkImpulse(ctx, 3.2, 2.4);
  const revGain = ctx.createGain(); revGain.gain.value = 0.35;
  reverb.connect(revGain); revGain.connect(comp);
  voiceBus = ctx.createGain(); voiceBus.connect(comp);
  duck = ctx.createGain(); duck.connect(comp);
  musicBus = ctx.createGain(); musicBus.connect(duck); musicBus.connect(reverb);
  ambBus = ctx.createGain(); ambBus.connect(comp);
  sfxBus = ctx.createGain(); sfxBus.connect(comp); sfxBus.connect(reverb);
  noiseBuf = mkNoise(ctx, 2);
  brownBuf = mkNoise(ctx, 4, true);
  applyVolumes(vol);
}

export function applyVolumes(v: Volumes): void {
  vol = v;
  if (!ctx) return;
  const t = ctx.currentTime;
  master.gain.setTargetAtTime(v.muted ? 0 : v.master, t, 0.05);
  voiceBus.gain.setTargetAtTime(v.voice * 0.5, t, 0.05);
  musicBus.gain.setTargetAtTime(v.music * 0.55, t, 0.1);
  ambBus.gain.setTargetAtTime(v.ambience * 0.6, t, 0.1);
  sfxBus.gain.setTargetAtTime(v.sfx * 0.7, t, 0.05);
}

export function setDucking(on: boolean): void {
  if (!ctx) return;
  duck.gain.setTargetAtTime(on ? 0.35 : 1, ctx.currentTime, 0.6);
}

// ---------------------------------------------------------------- Silbenstimmen
let syllable = 0;
const VOWEL_SHIFT: Record<string, number> = { a: 0, e: 2, i: 4, o: -2, u: -3, ä: 1, ö: -1, ü: 3, y: 3 };

export function voiceBlip(speaker: string, ch: string, mood: 'normal' | 'sad' | 'angry' | 'soft' = 'normal'): void {
  if (!ctx) return;
  const def = CHARACTERS[speaker];
  if (!def || def.voice.every >= 90) return;
  const low = ch.toLowerCase();
  if (!/[a-zäöüß]/.test(low)) return;
  syllable++;
  if (syllable % def.voice.every !== 0) return;
  const v = def.voice;
  const t = ctx.currentTime;
  const shift = (VOWEL_SHIFT[low] ?? (Math.random() - 0.5) * v.spread) + (mood === 'sad' ? -2 : mood === 'angry' ? 1.5 : 0);
  const f = v.base * Math.pow(2, shift / 12) * (1 + (Math.random() - 0.5) * 0.02);
  const o = ctx.createOscillator();
  o.type = v.wave;
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * (mood === 'sad' ? 0.94 : 0.985), t + v.length / 1000);
  const flt = ctx.createBiquadFilter();
  flt.type = 'lowpass'; flt.frequency.value = v.bright * (mood === 'angry' ? 1.4 : mood === 'soft' || mood === 'sad' ? 0.7 : 1); flt.Q.value = 2;
  const g = ctx.createGain();
  const len = (v.length * (mood === 'sad' ? 1.25 : 1)) / 1000;
  const peak = speaker === 'inner' ? 0.08 : 0.16;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(flt); flt.connect(g); g.connect(voiceBus);
  o.start(t); o.stop(t + len + 0.02);
}

// Kurzes, eigentümliches Nuscheln am Zeilenanfang: [Halbton, Dauer ms, Lautstärke]
const LEADS: Record<string, [number, number, number][]> = {
  sera: [[4, 70, 1], [7, 110, 0.8]],            // helles „Hm?“
  harriet: [[0, 160, 1], [-3, 200, 0.8]],       // strenges „Hm.“
  lionel: [[3, 60, 1], [0, 60, 0.9], [-2, 90, 0.7]], // knappes „Hah-hm“
  clara: [[5, 45, 1], [2, 60, 0.7]],            // scharfes „Tss“
  penrose: [[0, 120, 0.8], [4, 110, 1], [7, 180, 0.7]], // singendes „Mmh-ah“
  hobbes: [[-2, 90, 0.8], [-2, 70, 0.6]],        // Räuspern
  pryce: [[2, 80, 1], [-1, 110, 0.8]],          // „Na?“
  tilly: [[5, 40, 1], [8, 40, 0.9], [5, 40, 0.8], [10, 50, 0.9]], // Plappern
  dunning: [[-3, 180, 0.9]],                    // Brummen
};
export function voiceLead(speaker: string, mood: 'normal' | 'sad' | 'angry' | 'soft' = 'normal'): void {
  if (!ctx) return;
  const def = CHARACTERS[speaker]; const pat = LEADS[speaker];
  if (!def || !pat) return;
  const v = def.voice;
  const moodShift = mood === 'sad' ? -3 : mood === 'angry' ? 2 : mood === 'soft' ? -1 : 0;
  const slow = mood === 'sad' ? 1.3 : mood === 'angry' ? 0.8 : 1;
  let t = ctx.currentTime + 0.01;
  for (const [semi, ms, amp] of pat) {
    const d = (ms * slow) / 1000;
    const f = v.base * Math.pow(2, (semi + moodShift) / 12);
    const o = ctx.createOscillator(); o.type = v.wave;
    o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * (mood === 'sad' ? 0.92 : 0.97), t + d);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 6; const lg = ctx.createGain(); lg.gain.value = f * 0.015; lfo.connect(lg); lg.connect(o.frequency);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = Math.min(v.bright * 0.8, 3500); bp.Q.value = 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22 * amp, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(bp); bp.connect(g); g.connect(voiceBus);
    o.start(t); lfo.start(t); o.stop(t + d + 0.02); lfo.stop(t + d + 0.02);
    t += d * 0.85;
  }
}

// ---------------------------------------------------------------- Bausteine
function env(g: GainNode, t: number, a: number, peak: number, d: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}

function tone(f: number, t: number, dur: number, peak: number, type: OscillatorType, bus: AudioNode, attack = 0.005) {
  const c = ctx!;
  const o = c.createOscillator(); o.type = type; o.frequency.value = f;
  const g = c.createGain(); env(g, t, attack, peak, dur);
  o.connect(g); g.connect(bus); o.start(t); o.stop(t + attack + dur + 0.05);
  return o;
}

function noiseBurst(t: number, dur: number, peak: number, filterType: BiquadFilterType, freq: number, q: number, bus: AudioNode, brown = false) {
  const c = ctx!;
  const s = c.createBufferSource(); s.buffer = brown ? brownBuf : noiseBuf; s.loop = true;
  const f = c.createBiquadFilter(); f.type = filterType; f.frequency.value = freq; f.Q.value = q;
  const g = c.createGain(); env(g, t, 0.005, peak, dur);
  s.connect(f); f.connect(g); g.connect(bus);
  s.start(t, Math.random()); s.stop(t + dur + 0.1);
  return { s, f, g };
}

function bell(t: number, base: number, peak: number, bus: AudioNode, decay = 1.2) {
  [1, 2.76, 5.4, 8.93].forEach((m, i) => { if (base * m < 16000) tone(base * m, t, decay / (i + 1), peak / (i + 1.5), 'sine', bus, 0.002); });
}

// ---------------------------------------------------------------- Geräusche
export function sfx(id: string): void {
  if (!ctx) return;
  const t = ctx.currentTime + 0.01;
  const B = sfxBus;
  switch (id) {
    case 'bell': // Yuumis Glöckchen
      bell(t, 2350 + Math.random() * 120, 0.12, B, 0.9);
      bell(t + 0.09, 2400 + Math.random() * 120, 0.07, B, 0.7);
      break;
    case 'bellFar': // Dienstbotenglocke, fern
      bell(t, 880, 0.12, B, 2.2);
      break;
    case 'bellBoat':
      for (let i = 0; i < 3; i++) bell(t + i * 0.35, 1320, 0.06, B, 0.8);
      break;
    case 'meow': meow(t, 1); break;
    case 'meowAngry': { const n = noiseBurst(t, 0.5, 0.12, 'bandpass', 2600, 1.5, B); n.f.frequency.linearRampToValueAtTime(1800, t + 0.5); meow(t + 0.5, 0.8); break; }
    case 'purr': purr(t, 2.2); break;
    case 'knock': for (let i = 0; i < 4; i++) noiseBurst(t + i * 0.28 + Math.random() * 0.04, 0.09, 0.35, 'lowpass', 380, 4, B, true); break;
    case 'door': noiseBurst(t, 0.5, 0.12, 'bandpass', 450, 6, B); noiseBurst(t + 0.45, 0.18, 0.4, 'lowpass', 200, 2, B, true); break;
    case 'doorFar': noiseBurst(t, 0.25, 0.1, 'lowpass', 180, 2, B, true); tone(2000, t + 0.5, 0.05, 0.02, 'square', B); break;
    case 'curtain': case 'cloth': noiseBurst(t, 0.6, 0.08, 'highpass', 2500, 0.5, B); break;
    case 'paper': for (let i = 0; i < 3; i++) noiseBurst(t + i * 0.07, 0.07, 0.06, 'highpass', 3500, 0.7, B); break;
    case 'liquid': for (let i = 0; i < 8; i++) tone(500 + Math.random() * 500, t + i * 0.08, 0.06, 0.03, 'sine', B); break;
    case 'water': noiseBurst(t, 1.2, 0.08, 'lowpass', 600, 1, B, true); break;
    case 'thunder': {
      const n = noiseBurst(t, 4, 0.8, 'lowpass', 180, 1, B, true);
      n.f.frequency.setValueAtTime(900, t); n.f.frequency.exponentialRampToValueAtTime(90, t + 3);
      break;
    }
    case 'gong': [1, 1.5, 2.1].forEach((m) => tone(180 * m, t, 2.5, 0.08, 'sine', B)); break;
    case 'whisper': noiseBurst(t, 2.2, 0.05, 'bandpass', 1800, 3, B); break;
    case 'transition': {
      const n = noiseBurst(t, 3, 0.15, 'lowpass', 2000, 0.5, B, true);
      n.f.frequency.exponentialRampToValueAtTime(120, t + 3);
      tone(220, t, 3, 0.05, 'sine', B, 1.5);
      break;
    }
    case 'radiator': for (let i = 0; i < 6; i++) tone(3000, t + i * 0.55, 0.02, 0.05, 'square', B); break;
    case 'fridge': tone(55, t, 3, 0.06, 'sawtooth', B, 0.6); break;
    case 'sunrise': [392, 494, 587, 784].forEach((f, i) => tone(f, t + i * 0.4, 3, 0.04, 'sine', B, 0.8)); break;
    case 'bird': for (let i = 0; i < 4; i++) { const o = tone(2600, t + i * 0.18, 0.1, 0.03, 'sine', B); o.frequency.linearRampToValueAtTime(3400, t + i * 0.18 + 0.08); } break;
    case 'voiceFar': for (let i = 0; i < 6; i++) tone(130 + Math.random() * 30, t + i * 0.13, 0.1, 0.03, 'sawtooth', B); break;
    case 'step': noiseBurst(t, 0.06, 0.05, 'lowpass', 300, 1, B, true); break;
    case 'page': noiseBurst(t, 0.25, 0.06, 'highpass', 3000, 0.5, B); break;
    case 'pen': for (let i = 0; i < 5; i++) noiseBurst(t + i * 0.06, 0.04, 0.03, 'highpass', 5000, 1, B); break;
    case 'clue': bell(t, 1568, 0.035, B, 0.8); break;
    case 'deduce': [523, 659, 784].forEach((f, i) => tone(f, t + i * 0.12, 1.4, 0.035, 'triangle', B)); break;
    default: break;
  }
}

function meow(t: number, amp: number) {
  const c = ctx!;
  const o = c.createOscillator(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(520, t);
  o.frequency.linearRampToValueAtTime(820, t + 0.18);
  o.frequency.linearRampToValueAtTime(480, t + 0.55);
  const f1 = c.createBiquadFilter(); f1.type = 'bandpass'; f1.Q.value = 5;
  f1.frequency.setValueAtTime(900, t); f1.frequency.linearRampToValueAtTime(1700, t + 0.2); f1.frequency.linearRampToValueAtTime(800, t + 0.55);
  const g = c.createGain(); env(g, t, 0.05, 0.12 * amp, 0.5);
  o.connect(f1); f1.connect(g); g.connect(sfxBus);
  o.start(t); o.stop(t + 0.7);
}

function purr(t: number, dur: number) {
  const c = ctx!;
  const s = c.createBufferSource(); s.buffer = brownBuf; s.loop = true;
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 260;
  const am = c.createGain(); am.gain.value = 0;
  const lfo = c.createOscillator(); lfo.frequency.value = 24;
  const lg = c.createGain(); lg.gain.value = 0.5;
  lfo.connect(lg); lg.connect(am.gain);
  const g = c.createGain(); env(g, t, 0.3, 0.5, dur);
  s.connect(f); f.connect(am); am.connect(g); g.connect(sfxBus);
  s.start(t); lfo.start(t); s.stop(t + dur + 0.5); lfo.stop(t + dur + 0.5);
}

// ---------------------------------------------------------------- Umgebung
interface Loop { stop: () => void }
let ambience: { key: string; loops: Loop[]; timers: number[] } = { key: '', loops: [], timers: [] };

function loopNoise(freq: number, type: BiquadFilterType, q: number, gain: number, brown: boolean, lfoRate = 0, lfoDepth = 0): Loop {
  const c = ctx!;
  const s = c.createBufferSource(); s.buffer = brown ? brownBuf : noiseBuf; s.loop = true;
  const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = c.createGain(); g.gain.value = 0;
  g.gain.setTargetAtTime(gain, c.currentTime, 1.2);
  s.connect(f); f.connect(g); g.connect(ambBus);
  let lfo: OscillatorNode | null = null;
  if (lfoRate) {
    lfo = c.createOscillator(); lfo.frequency.value = lfoRate;
    const lg = c.createGain(); lg.gain.value = lfoDepth;
    lfo.connect(lg); lg.connect(g.gain); lfo.start();
  }
  s.start(0, Math.random() * 2);
  return {
    stop: () => {
      g.gain.setTargetAtTime(0, c.currentTime, 0.6);
      setTimeout(() => { try { s.stop(); lfo?.stop(); } catch { /* */ } }, 3000);
    },
  };
}

function every(ms: number, jitter: number, fn: () => void): number {
  let id = 0;
  const tick = () => { fn(); id = window.setTimeout(tick, ms + Math.random() * jitter); ambience.timers.push(id); };
  id = window.setTimeout(tick, Math.random() * ms);
  ambience.timers.push(id);
  return id;
}

function amb(freq: number, dur: number, peak: number, type: BiquadFilterType, q = 1, brown = false) {
  if (!ctx) return;
  noiseBurst(ctx.currentTime, dur, peak, type, freq, q, ambBus, brown);
}

export function setAmbience(ids: string[], weather: 'rain' | 'storm' | 'calm' | 'fog' = 'rain'): void {
  if (!ctx) return;
  const key = ids.join(',') + '|' + weather;
  if (key === ambience.key) return;
  ambience.loops.forEach((l) => l.stop());
  ambience.timers.forEach((t) => clearTimeout(t));
  ambience = { key, loops: [], timers: [] };
  const L = ambience.loops;
  const rainAmt = weather === 'calm' ? 0 : weather === 'fog' ? 0.3 : weather === 'storm' ? 1.4 : 1;
  for (const id of ids) {
    switch (id) {
      case 'rain': if (rainAmt) { L.push(loopNoise(1400, 'bandpass', 0.6, 0.05 * rainAmt, false, 0.1, 0.01)); every(90, 120, () => amb(3000 + Math.random() * 2000, 0.03, 0.02 * rainAmt, 'bandpass', 4)); } break;
      case 'rainFar': if (rainAmt) L.push(loopNoise(700, 'lowpass', 0.6, 0.04 * rainAmt, true)); break;
      case 'rainClose': if (rainAmt) { L.push(loopNoise(2000, 'bandpass', 0.5, 0.05 * rainAmt, false)); every(70, 90, () => amb(4000, 0.02, 0.03 * rainAmt, 'highpass', 1)); } break;
      case 'rainGlass': if (rainAmt) { L.push(loopNoise(2600, 'bandpass', 0.7, 0.06 * rainAmt, false)); every(40, 60, () => amb(5000 + Math.random() * 2000, 0.015, 0.03 * rainAmt, 'bandpass', 6)); } break;
      case 'rainOpen': if (rainAmt) L.push(loopNoise(1800, 'bandpass', 0.4, 0.08 * rainAmt, false)); break;
      case 'rainModern': L.push(loopNoise(1600, 'bandpass', 0.6, 0.035, false)); break;
      case 'fire': case 'kitchenFire':
        L.push(loopNoise(300, 'lowpass', 0.7, 0.05, true, 0.3, 0.02));
        every(160, 500, () => amb(1500 + Math.random() * 3000, 0.02, 0.06 * Math.random(), 'bandpass', 3));
        break;
      case 'hallClock': case 'mantelClock':
        every(1000, 0, () => { if (ctx) tone(id === 'hallClock' ? 1800 : 2600, ctx.currentTime, 0.03, 0.02, 'square', ambBus); });
        break;
      case 'hallClockFar': every(1000, 0, () => { if (ctx) tone(1600, ctx.currentTime, 0.02, 0.008, 'square', ambBus); }); break;
      case 'drip': every(1400, 1800, () => { if (ctx) { const o = tone(900, ctx.currentTime, 0.12, 0.03, 'sine', ambBus); o.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.08); } }); break;
      case 'wind': L.push(loopNoise(500, 'bandpass', 1.5, 0.05, true, 0.08, 0.03)); break;
      case 'water': every(2500, 2500, () => amb(400, 1.2, 0.03, 'lowpass', 1, true)); break;
      case 'horses': every(9000, 9000, () => amb(700, 0.5, 0.04, 'bandpass', 2)); break;
      case 'candles': L.push(loopNoise(200, 'lowpass', 0.5, 0.01, true)); break;
      case 'kettle': break;
      case 'fridge': L.push(loopNoise(60, 'lowpass', 2, 0.03, true)); break;
      case 'under': L.push(loopNoise(160, 'lowpass', 1, 0.08, true, 0.15, 0.04)); break;
      case 'cityWinter': L.push(loopNoise(250, 'lowpass', 0.7, 0.03, true)); every(6000, 6000, () => { if (ctx) for (let i = 0; i < 4; i++) noiseBurst(ctx.currentTime + i * 0.25, 0.05, 0.02, 'lowpass', 400, 2, ambBus, true); }); break;
      default: break;
    }
  }
  if (weather === 'storm') every(14000, 16000, () => sfx('thunder'));
}

// ---------------------------------------------------------------- Musik
// Ruhige, prozedurale Stücke: je Stimmung Tonart, Tempo, Leitmotiv, Dichte. Viel Stille.
interface Theme { root: number; scale: number[]; motif: number[]; tempo: number; density: number; wave: OscillatorType; bass: boolean; pause: number }
const MAJ = [0, 2, 4, 5, 7, 9, 11], MIN = [0, 2, 3, 5, 7, 8, 10], DOR = [0, 2, 3, 5, 7, 9, 10];
// Leitmotive (Stufen): „Haus“ – absteigend; „Tilly“ – kleine Frage; „Glas“ – schwebend
const HOUSE = [4, 3, 2, 0, 1, -1, 0];
const TILLY = [0, 2, 4, 2, 5, 4];
const GLASS = [7, 4, 9, 7, 11, 9];
const THEMES: Record<string, Theme> = {
  home: { root: 60, scale: MAJ, motif: [0, 4, 7, 4, 2, 4], tempo: 76, density: 0.5, wave: 'triangle', bass: true, pause: 6 },
  echo: { root: 57, scale: MIN, motif: GLASS, tempo: 50, density: 0.3, wave: 'sine', bass: false, pause: 8 },
  k1: { root: 57, scale: MIN, motif: HOUSE, tempo: 64, density: 0.45, wave: 'triangle', bass: true, pause: 8 },
  grief: { root: 55, scale: MIN, motif: HOUSE, tempo: 52, density: 0.35, wave: 'sine', bass: true, pause: 10 },
  kitchen: { root: 62, scale: DOR, motif: TILLY, tempo: 84, density: 0.5, wave: 'triangle', bass: true, pause: 7 },
  quiet: { root: 64, scale: MAJ, motif: TILLY, tempo: 56, density: 0.3, wave: 'sine', bass: false, pause: 12 },
  laying: { root: 53, scale: MIN, motif: HOUSE, tempo: 48, density: 0.3, wave: 'sine', bass: true, pause: 12 },
  dark: { root: 50, scale: DOR, motif: GLASS, tempo: 56, density: 0.3, wave: 'sine', bass: true, pause: 10 },
  evening: { root: 55, scale: MIN, motif: HOUSE, tempo: 60, density: 0.4, wave: 'triangle', bass: true, pause: 9 },
  vigil: { root: 57, scale: MIN, motif: TILLY, tempo: 50, density: 0.3, wave: 'sine', bass: true, pause: 12 },
  k3: { root: 55, scale: DOR, motif: HOUSE, tempo: 62, density: 0.4, wave: 'triangle', bass: true, pause: 9 },
  yard: { root: 60, scale: DOR, motif: [0, 2, 0, -3, 0], tempo: 70, density: 0.35, wave: 'triangle', bass: true, pause: 10 },
  chapel: { root: 50, scale: MIN, motif: [0, 7, 5, 3, 2, 0], tempo: 46, density: 0.3, wave: 'sine', bass: true, pause: 12 },
  develop: { root: 52, scale: MIN, motif: GLASS, tempo: 54, density: 0.35, wave: 'sine', bass: true, pause: 8 },
  k4: { root: 57, scale: MIN, motif: GLASS, tempo: 60, density: 0.4, wave: 'triangle', bass: true, pause: 9 },
  tension: { root: 50, scale: MIN, motif: [0, 1, 0, -1, 0], tempo: 70, density: 0.4, wave: 'triangle', bass: true, pause: 6 },
  worry: { root: 52, scale: MIN, motif: TILLY, tempo: 80, density: 0.45, wave: 'triangle', bass: true, pause: 5 },
  truth: { root: 57, scale: MIN, motif: TILLY, tempo: 46, density: 0.25, wave: 'sine', bass: false, pause: 14 },
  window: { root: 60, scale: MAJ, motif: GLASS, tempo: 50, density: 0.3, wave: 'sine', bass: false, pause: 10 },
  k5: { root: 55, scale: DOR, motif: HOUSE, tempo: 52, density: 0.3, wave: 'sine', bass: true, pause: 12 },
  letter: { root: 60, scale: MAJ, motif: HOUSE, tempo: 50, density: 0.3, wave: 'sine', bass: true, pause: 12 },
  lionel: { root: 53, scale: MIN, motif: [0, 3, 2, 0, -2, 0], tempo: 52, density: 0.3, wave: 'triangle', bass: true, pause: 12 },
  dawn: { root: 62, scale: MAJ, motif: TILLY, tempo: 52, density: 0.35, wave: 'sine', bass: true, pause: 10 },
  london: { root: 60, scale: MAJ, motif: TILLY, tempo: 70, density: 0.45, wave: 'triangle', bass: true, pause: 8 },
  title: { root: 57, scale: MIN, motif: GLASS, tempo: 54, density: 0.35, wave: 'sine', bass: true, pause: 9 },
};

let musicId = '';
let musicTimer = 0;
let musicGen = 0;

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
function degree(th: Theme, d: number): number {
  const n = th.scale.length;
  const oct = Math.floor(d / n);
  const idx = ((d % n) + n) % n;
  return th.root + oct * 12 + th.scale[idx];
}

function pluck(freq: number, t: number, dur: number, peak: number, wave: OscillatorType) {
  const c = ctx!;
  const o = c.createOscillator(); o.type = wave; o.frequency.value = freq;
  const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2.001;
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(freq * 6, t); f.frequency.exponentialRampToValueAtTime(freq * 1.5, t + dur);
  const g = c.createGain(); env(g, t, 0.01, peak, dur);
  const g2 = c.createGain(); env(g2, t, 0.01, peak * 0.2, dur * 0.4);
  o.connect(f); f.connect(g); g.connect(musicBus);
  o2.connect(g2); g2.connect(musicBus);
  o.start(t); o2.start(t); o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
}

export function setMusic(id: string): void {
  if (!ctx || id === musicId) return;
  musicId = id;
  musicGen++;
  clearTimeout(musicTimer);
  if (id === 'none' || !THEMES[id]) return;
  const gen = musicGen;
  const th = THEMES[id];
  const beat = 60 / th.tempo;
  const phrase = () => {
    if (!ctx || gen !== musicGen) return;
    const t0 = ctx.currentTime + 0.1;
    const variant = Math.random();
    const shift = variant < 0.3 ? 0 : variant < 0.6 ? 2 : variant < 0.8 ? -1 : 4;
    let t = t0;
    th.motif.forEach((d, i) => {
      if (Math.random() < th.density * 0.25 && i > 0) { t += beat; return; } // Lücke
      const len = beat * (i === th.motif.length - 1 ? 3 : Math.random() < 0.3 ? 2 : 1);
      pluck(mtof(degree(th, d + shift) + 12), t, len * 2.2, 0.06, th.wave);
      if (th.bass && i % 3 === 0) pluck(mtof(degree(th, d + shift - 7) - 12), t, beat * 4, 0.05, 'sine');
      t += len;
    });
    const rest = (t - t0) + th.pause * (0.6 + Math.random() * 0.8);
    musicTimer = window.setTimeout(phrase, rest * 1000);
  };
  musicTimer = window.setTimeout(phrase, 800);
}

export function currentMusic(): string { return musicId; }
