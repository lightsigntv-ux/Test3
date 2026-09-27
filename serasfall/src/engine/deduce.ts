// Schlussfolgerungen und Endrekonstruktion.
import type { Deduction, GameState } from './types';
import { applyEffects, clone, knows, timeLabel, type Content, type GameEvent } from './core';

export function visibleDeductions(s: GameState, c: Content): Deduction[] {
  return Object.values(c.deductions).filter((d) => d.chapter <= Math.max(s.chapter, 1) && s.chapter >= 1 && d.trigger.some((t) => knows(s, t)));
}

export function openDeductions(s: GameState, c: Content): Deduction[] {
  return visibleDeductions(s, c).filter((d) => !s.deductions[d.id]);
}

export function supportCount(s: GameState, d: Deduction): number {
  return d.support.filter((x) => knows(s, x)).length;
}

export type AttemptResult =
  | { kind: 'solved'; state: GameState; events: GameEvent[] }
  | { kind: 'guess'; line: string }
  | { kind: 'wrong'; line: string; state: GameState };

export const GUESS_LINES = [
  'Ich rate. Mir fehlt noch etwas, das ich in der Hand halten kann.',
  'Das fühlt sich richtig an. Aber „fühlt sich an“ steht in keinem Notizbuch.',
  'Vielleicht. Ich brauche noch einen zweiten Beweis, einen, der nicht nur in meinem Kopf wohnt.',
];

export function attempt(state: GameState, c: Content, id: string, answers: number[]): AttemptResult {
  const d = c.deductions[id];
  const correct = d.slots.every((sl, i) => sl.correct.includes(answers[i]));
  if (!correct) {
    const s = clone(state);
    const k = `doubt_${id}`;
    const i = s.presentRot[k] ?? 0;
    s.presentRot[k] = i + 1;
    return { kind: 'wrong', line: d.doubt[i % d.doubt.length], state: s };
  }
  if (supportCount(state, d) < d.need) {
    const i = (state.presentRot[`guess_${id}`] ?? 0) % GUESS_LINES.length;
    return { kind: 'guess', line: GUESS_LINES[i] };
  }
  const s = clone(state);
  const events: GameEvent[] = [];
  s.deductions[id] = timeLabel(s);
  events.push({ type: 'deduction', id });
  applyEffects(s, d.effects, events);
  return { kind: 'solved', state: s, events };
}

export function hintFor(state: GameState, c: Content, id: string): { state: GameState; line: string } {
  const s = clone(state);
  const d = c.deductions[id];
  const lvl = Math.min(2, s.hintLevel[id] ?? 0);
  s.hintLevel[id] = lvl + 1;
  return { state: s, line: d.hints[lvl] };
}

export function reconOpen(s: GameState, c: Content) {
  return c.recon.filter((q) => s.recon[q.id] === undefined);
}

export function reconAnswer(state: GameState, c: Content, qid: string, pick: number): { ok: boolean; state: GameState; line: string } {
  const q = c.recon.find((r) => r.id === qid)!;
  if (pick !== q.correct) return { ok: false, state, line: q.doubt };
  const s = clone(state);
  s.recon[qid] = pick;
  return { ok: true, state: s, line: q.after ?? '' };
}
