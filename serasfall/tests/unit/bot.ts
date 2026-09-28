// Headless-Durchspiel-Bot: simuliert eine gründliche Spielerin, die nur nutzt, was das Spiel ihr zeigt.
import { newGame, type Content } from '../../src/engine/core';
import type { GameState } from '../../src/engine/types';
import { advance, startDialogue, type StepResult } from '../../src/engine/dialogue';
import { act, settle } from '../../src/engine/session';
import { attempt, reconAnswer, reconOpen } from '../../src/engine/deduce';
import { plan, chooseIndex, KIND, HARSH, type Policy } from '../shared/planner';

export { KIND, HARSH };
export type { Policy };

export interface BotResult {
  state: GameState;
  steps: number;
  stuck?: string;
  chapterKnowledge: Record<number, Set<string>>;
  deductionChapter: Record<string, number>;
  seenDialogues: Set<string>;
  lines: number;
  transcript: string[];
}

export function runBot(c: Content, p: Policy, maxSteps = 60000): BotResult {
  let s = newGame();
  const chapterKnowledge: Record<number, Set<string>> = {};
  const deductionChapter: Record<string, number> = {};
  let steps = 0;
  let lines = 0;
  let pending: StepResult | undefined;
  const transcript: string[] = [];
  let lastChapter = -1;
  const failedExits = new Set<string>();
  let gate: { id: string; loc: string } | null = null;
  const result = (stuck?: string): BotResult => ({ state: s, steps, stuck, chapterKnowledge, deductionChapter, seenDialogues: new Set(Object.keys(s.seen)), lines, transcript });

  const handleStep = (r: StepResult) => {
    const settled = settle(r.state, c, r.events);
    let st = settled.state;
    for (const sp of settled.specials) if (sp === 'recon') for (const q of reconOpen(st, c)) st = reconAnswer(st, c, q.id, q.correct).state;
    s = st;
    if (r.view) {
      pending = r; lines++;
      if (s.chapter !== lastChapter) { transcript.push(`\n===== Kapitel ${s.chapter} =====`); lastChapter = s.chapter; }
      const v = r.view;
      if (v.text) transcript.push(`[${v.dlg}] ${v.speaker}${v.expr ? '(' + v.expr + ')' : ''}: ${v.text}`);
      if (v.choices) transcript.push(v.choices.map((ch) => `    · [${ch.stance}] ${ch.text}`).join('\n'));
    } else pending = undefined;
  };

  while (!s.ending && steps < maxSteps) {
    steps++;
    chapterKnowledge[s.chapter] = new Set([...Object.keys(s.clues), ...Object.keys(s.statements), ...Object.keys(s.deductions)]);
    if (pending) {
      const idx = chooseIndex(pending.view!, s, c, p);
      if (idx !== undefined) transcript.push(`    → gewählt: ${pending.view!.choices!.find((x) => x.index === idx)?.text}`);
      handleStep(advance(s, c, idx));
      continue;
    }
    if (gate) { if (s.loc === gate.loc) failedExits.add(gate.id); else failedExits.clear(); gate = null; }
    const pl = plan(s, c, p, failedExits);
    if (!pl) return result(`festgefahren in Kapitel ${s.chapter} (${s.loc}, ${s.time})`);
    if (pl.type === 'deduce') {
      const r = attempt(s, c, pl.id, pl.answers);
      if (r.kind === 'solved') {
        transcript.push(`    ✎ Schlussfolgerung ${pl.id}: ${c.deductions[pl.id].result}`);
        s = settle(r.state, c, r.events).state;
        deductionChapter[pl.id] = s.chapter;
        failedExits.clear();
      }
      continue;
    }
    if (pl.type === 'move') {
      const r = act(s, c, { type: 'exit', hotspot: pl.hotspot });
      if (!r) { failedExits.add(pl.hotspot.id); continue; }
      if ('moved' in r) s = r.moved; else { gate = { id: pl.hotspot.id, loc: s.loc }; handleStep(r); }
      continue;
    }
    failedExits.clear();
    handleStep(startDialogue(s, c, pl.dlg));
  }
  return result(s.ending ? undefined : 'Schrittgrenze');
}
