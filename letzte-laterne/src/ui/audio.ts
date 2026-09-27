// Kleine, synthetisierte Klänge (keine Audiodateien). Alle Geräusche – auch Yuumis –
// laufen über denselben Lautstärkeregler und denselben Ein/Aus-Schalter.

type SoundId = 'hit' | 'heal' | 'shield' | 'ability' | 'windup' | 'interrupt' | 'purr' | 'meow' | 'bell' | 'victory' | 'defeat' | 'click' | 'burn' | 'explode';

let ctx: AudioContext | null = null;
let enabled = true;
let volume = 0.5;
const lastPlayed: Partial<Record<SoundId, number>> = {};

export function configureAudio(on: boolean, vol: number) {
  enabled = on;
  volume = vol;
}

function ac(): AudioContext | null {
  if (!enabled || volume <= 0) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, when = 0, slideTo?: number) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain * volume, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function play(id: SoundId) {
  if (!enabled) return;
  const now = performance.now();
  if ((lastPlayed[id] ?? 0) > now - 70) return; // Klangflut vermeiden
  lastPlayed[id] = now;
  switch (id) {
    case 'hit':
      tone(160, 0.08, 'square', 0.05, 0, 90);
      break;
    case 'burn':
      tone(300, 0.06, 'sawtooth', 0.02, 0, 180);
      break;
    case 'heal':
      tone(660, 0.18, 'sine', 0.06);
      tone(880, 0.2, 'sine', 0.05, 0.06);
      break;
    case 'shield':
      tone(520, 0.25, 'triangle', 0.06);
      tone(780, 0.25, 'triangle', 0.04, 0.03);
      break;
    case 'ability':
      tone(420, 0.18, 'triangle', 0.07, 0, 840);
      break;
    case 'windup':
      tone(220, 0.35, 'sawtooth', 0.04, 0, 330);
      break;
    case 'interrupt':
      tone(900, 0.12, 'square', 0.05, 0, 300);
      break;
    case 'explode':
      tone(120, 0.3, 'sawtooth', 0.08, 0, 40);
      break;
    case 'purr':
      for (let i = 0; i < 6; i++) tone(55 + (i % 2) * 6, 0.09, 'sine', 0.08, i * 0.08);
      break;
    case 'meow':
      tone(700, 0.35, 'sine', 0.06, 0, 1100);
      tone(1100, 0.2, 'sine', 0.04, 0.3, 650);
      break;
    case 'bell':
      tone(1320, 0.8, 'sine', 0.04);
      tone(1980, 0.6, 'sine', 0.02);
      break;
    case 'victory':
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.3, 'triangle', 0.06, i * 0.11));
      break;
    case 'defeat':
      [392, 330, 262].forEach((f, i) => tone(f, 0.45, 'sine', 0.06, i * 0.18));
      break;
    case 'click':
      tone(880, 0.04, 'sine', 0.03);
      break;
  }
}
