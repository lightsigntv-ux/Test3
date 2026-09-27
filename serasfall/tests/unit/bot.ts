// Headless-Durchspiel-Bot: simuliert eine gründliche Spielerin, die nur nutzt, was das Spiel ihr zeigt.
import { newGame, evalCond, type Content } from '../../src/engine/core';
import type { GameState, LocId, NpcId, Stance } from '../../src/engine/types';
import { NPCS } from '../../src/engine/types';
import { advance, startDialogue, currentView, type StepResult } from '../../src/engine/dialogue';
import { act, autoScene, enterLocation, settle } from '../../src/engine/session';
import { examineFor, hotspotsIn, npcsIn, presentFor, presentables, smalltalkFor, topicsFor } from '../../src/engine/world';
import { attempt, openDeductions, reconAnswer, reconOpen, supportCount } from '../../src/engine/deduce';

export interface Policy {
  name: string;
  order: Stance[];
  /** Figurenspezifische Reihenfolge (z. B. harsch zum Captain) */
  npcOrder?: Partial<Record<NpcId, Stance[]>>;
  ending: 'go' | 'stay';
  /** optionale Inhalte auslassen (minimaler Weg) */
  minimal?: boolean;
}

export const KIND: Stance[] = ['ehrlich', 'mitfuehlend', 'schweigen', 'humor', 'neutral', 'ausweichend', 'direkt', 'luege'];
export const HARSH: Stance[] = ['direkt', 'ausweichend', 'luege', 'neutral', 'humor', 'schweigen', 'ehrlich', 'mitfuehlend'];

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

  const snapshot = () => {
    chapterKnowledge[s.chapter] = new Set([...Object.keys(s.clues), ...Object.keys(s.statements), ...Object.keys(s.deductions)]);
  };

  const handleStep = (r: StepResult) => {
    let st = r.state;
    const settled = settle(st, c, r.events);
    st = settled.state;
    for (const sp of settled.specials) {
      if (sp === 'recon') {
        for (const q of reconOpen(st, c)) st = reconAnswer(st, c, q.id, q.correct).state;
      }
    }
    s = st;
    if (r.view) {
      pending = r; lines++;
      if (s.chapter !== lastChapter) { transcript.push(`\n===== Kapitel ${s.chapter} =====`); lastChapter = s.chapter; }
      const v = r.view;
      if (v.text) transcript.push(`[${v.dlg}] ${v.speaker}${v.expr ? '(' + v.expr + ')' : ''}: ${v.text}`);
      if (v.choices) transcript.push(v.choices.map((ch) => `    · [${ch.stance}] ${ch.text}`).join('\n'));
    } else pending = undefined;
  };

  const choose = (r: StepResult): number | undefined => {
    const v = r.view!;
    if (!v.choices) return undefined;
    if (v.dlg === 'k5_dawn') {
      const want = p.ending === 'go' ? 'Nach Hause' : 'Bleiben';
      const hit = v.choices.find((ch) => ch.text.includes(want));
      if (hit) return hit.index;
    }
    const npc = c.dialogues[v.dlg].npc;
    const order = (npc && p.npcOrder?.[npc]) || p.order;
    const sorted = [...v.choices].sort((a, b) => order.indexOf(a.stance) - order.indexOf(b.stance));
    // wiederholte Dialoge: andere Antworten probieren, wie eine Spielerin es täte
    const tries = Math.max(0, (s.seen[v.dlg] ?? 1) - 1);
    return sorted[tries % sorted.length]?.index;
  };

  const locCandidates = (st: GameState, loc: LocId): (() => StepResult | null)[] => {
    const t = { ...st, loc, yuumiLoc: st.flags['g_yuumi_lost'] ? st.yuumiLoc : loc };
    const out: (() => StepResult | null)[] = [];
    const sc = autoScene(t, c);
    if (sc) out.push(() => startDialogue(s, c, sc.id));
    for (const h of hotspotsIn(t, c, loc)) {
      if (h.kind === 'examine') {
        const d = examineFor(t, c, h.id);
        if (d && !t.seen[d.id]) out.push(() => startDialogue(s, c, d.id));
      }
      if (h.kind === 'exit') {
        const d = examineFor(t, c, h.id);
        if (d && !t.seen[d.id]) out.push(() => startDialogue(s, c, d.id));
      }
      if (h.kind === 'cat' && c.locations[loc].catAllowed && !t.flags['g_yuumi_lost']) {
        const d = examineFor(t, c, h.id, 'yuumi');
        if (d && !t.seen[d.id]) out.push(() => startDialogue(s, c, d.id));
      }
    }
    for (const { npc } of npcsIn(t, c, loc)) {
      for (const d of topicsFor(t, c, npc)) out.push(() => startDialogue(s, c, d.id));
      if (!p.minimal) {
        const st2 = smalltalkFor(t, c, npc);
        if (st2 && !t.seen[st2.id]) out.push(() => startDialogue(s, c, st2.id));
        for (const item of presentables(t)) {
          const { dlg } = presentFor(t, c, npc, item);
          if (dlg && dlg.items?.[0] !== '*' && !t.seen[dlg.id]) out.push(() => startDialogue(s, c, dlg.id));
        }
      }
    }
    if (!p.minimal && t.yuumiLoc === loc && !t.flags['g_yuumi_lost']) {
      const pet = examineFor(t, c, 'pet', 'yuumi');
      if (pet && !pet.repeat && !t.seen[pet.id]) out.push(() => startDialogue(s, c, pet.id));
    }
    return out;
  };

  const exitsOf = (st: GameState, loc: LocId) => hotspotsIn({ ...st, loc }, c, loc).filter((h) => h.kind === 'exit' && h.to);

  while (!s.ending && steps < maxSteps) {
    steps++;
    if (process.env.BOTDBG && s.chapter >= +process.env.BOTDBG) console.log('step', steps, s.chapter, s.loc, s.time, pending?.view?.dlg, pending?.view?.node);
    snapshot();
    if (pending) {
      const idx = choose(pending);
      if (idx !== undefined) transcript.push(`    → gewählt: ${pending.view!.choices!.find((c) => c.index === idx)?.text}`);
      handleStep(advance(s, c, idx));
      continue;
    }
    // automatische Szenen
    const sc = autoScene(s, c);
    if (sc) { handleStep(startDialogue(s, c, sc.id)); continue; }
    // Schlussfolgerungen
    let solved = false;
    for (const d of openDeductions(s, c)) {
      if (supportCount(s, d) >= d.need) {
        const r = attempt(s, c, d.id, d.slots.map((sl) => sl.correct[0]));
        if (r.kind === 'solved') {
          transcript.push(`    ✎ Schlussfolgerung ${d.id}: ${d.result}`);
          const st = settle(r.state, c, r.events);
          s = st.state;
          deductionChapter[d.id] = s.chapter;
          solved = true;
          break;
        }
      }
    }
    if (solved) continue;
    // Aktionen am Ort
    const here = locCandidates(s, s.loc);
    if (here.length) {
      const r = here[0]();
      if (r) { handleStep(r); continue; }
    }
    // Weg zum nächsten Ort mit Inhalt (Breitensuche über Ausgänge)
    const start = s.loc;
    const prev = new Map<LocId, { from: LocId; hs: any }>();
    const queue: LocId[] = [start];
    const visited = new Set<LocId>([start]);
    let target: LocId | null = null;
    while (queue.length) {
      const l = queue.shift()!;
      if (l !== start && locCandidates(s, l).length) { target = l; break; }
      for (const h of exitsOf(s, l)) {
        const to = h.to as LocId;
        if (visited.has(to) || failedExits.has(h.id)) continue;
        visited.add(to);
        prev.set(to, { from: l, hs: h });
        queue.push(to);
      }
    }
    if (!target) {
      return { state: s, steps, stuck: `festgefahren in Kapitel ${s.chapter} (${s.loc}, ${s.time})`, chapterKnowledge, deductionChapter, seenDialogues: new Set(Object.keys(s.seen)), lines, transcript };
    }
    // ersten Schritt gehen
    let step: LocId = target;
    while (prev.get(step)!.from !== start) step = prev.get(step)!.from;
    const hs = prev.get(step)!.hs;
    if (process.env.BOTDBG && s.chapter >= +process.env.BOTDBG) console.log('  move', s.loc, '->', target, 'via', hs.id);
    const r = act(s, c, { type: 'exit', hotspot: hs });
    if (!r) { failedExits.add(hs.id); continue; }
    if ('moved' in r) s = r.moved;
    else handleStep(r);
  }
  return { state: s, steps, stuck: s.ending ? undefined : 'Schrittgrenze', chapterKnowledge, deductionChapter, seenDialogues: new Set(Object.keys(s.seen)), lines, transcript };
}

export { evalCond, NPCS, currentView };
