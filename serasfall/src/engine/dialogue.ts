// Dialogablauf als reine Zustandsübergänge.
import type { Dialogue, DNode, Expr, GameState, SpeakerId, Stance } from './types';
import { applyEffects, clone, evalCond, type Content, type GameEvent } from './core';

export interface ChoiceView { text: string; stance: Stance; index: number }
export interface LineView {
  dlg: string;
  node: string;
  speaker?: SpeakerId;
  expr?: Expr;
  text?: string;
  choices?: ChoiceView[];
  pause?: number;
  mood?: string;
  important: boolean;
  npc?: string;
}

export interface StepResult {
  state: GameState;
  view?: LineView;
  events: GameEvent[];
  ended?: string;
}

const LOG_MAX = 400;
function log(s: GameState, sp: SpeakerId, t: string) {
  s.log.push({ s: sp, t });
  if (s.log.length > LOG_MAX) s.log.splice(0, s.log.length - LOG_MAX);
}

export function visibleChoices(s: GameState, n: DNode): ChoiceView[] {
  return (n.choices ?? [])
    .map((ch, index) => ({ ch, index }))
    .filter(({ ch }) => evalCond(s, ch.cond))
    .map(({ ch, index }) => ({ text: ch.text, stance: ch.stance, index }));
}

function view(s: GameState, d: Dialogue, n: DNode): LineView {
  return {
    dlg: d.id, node: n.id, speaker: n.speaker, expr: n.expr, text: n.text,
    choices: n.choices ? visibleChoices(s, n) : undefined,
    pause: n.pause, mood: n.mood, important: d.important, npc: d.npc,
  };
}

/** Betritt Knoten, führt stille Knoten aus, bis ein anzeigbarer Knoten oder das Ende erreicht ist. */
function enter(s: GameState, c: Content, d: Dialogue, nodeId: string | undefined, out: GameEvent[]): StepResult {
  let guard = 0;
  let id = nodeId;
  while (id && id !== 'END') {
    if (++guard > 500) throw new Error(`Endlosschleife in ${d.id}`);
    const n = d.nodes[id];
    if (!n) throw new Error(`Knoten ${id} fehlt in ${d.id}`);
    applyEffects(s, n.effects, out);
    if (n.silent) {
      if (n.choices) {
        s.active = { dlg: d.id, node: n.id };
        return { state: s, view: view(s, d, n), events: out };
      }
      const br = n.branch?.find((b) => evalCond(s, b.cond));
      id = br ? br.next : n.next;
      continue;
    }
    if (n.text && n.speaker) log(s, n.speaker, n.text);
    s.active = { dlg: d.id, node: n.id };
    return { state: s, view: view(s, d, n), events: out };
  }
  s.active = undefined;
  return { state: s, events: out, ended: d.id };
}

export function startDialogue(state: GameState, c: Content, dlgId: string, rotKey?: string): StepResult {
  const s = clone(state);
  const d = c.dialogues[dlgId];
  if (!d) throw new Error(`Dialog ${dlgId} fehlt`);
  s.seen[d.id] = (s.seen[d.id] ?? 0) + 1;
  if (rotKey) s.presentRot[rotKey] = (s.presentRot[rotKey] ?? 0) + 1;
  return enter(s, c, d, d.start, []);
}

/** Aktuelle Anzeige wiederherstellen (z. B. nach dem Laden), ohne Effekte erneut auszuführen. */
export function currentView(s: GameState, c: Content): LineView | undefined {
  if (!s.active) return;
  const d = c.dialogues[s.active.dlg];
  const n = d?.nodes[s.active.node];
  if (!d || !n) return;
  return view(s, d, n);
}

export function advance(state: GameState, c: Content, choiceIndex?: number): StepResult {
  const s = clone(state);
  if (!s.active) return { state: s, events: [] };
  const d = c.dialogues[s.active.dlg];
  const n = d.nodes[s.active.node];
  const out: GameEvent[] = [];
  let next = n.next;
  if (n.choices) {
    const vis = visibleChoices(s, n);
    const pick = vis.find((v) => v.index === choiceIndex) ?? (vis.length ? undefined : null);
    if (pick === undefined) return { state: s, view: view(s, d, n), events: out };
    if (pick) {
      const ch = n.choices[pick.index];
      log(s, 'sera', ch.text);
      applyEffects(s, ch.effects, out);
      next = ch.next;
    }
  } else if (n.branch) {
    const br = n.branch.find((b) => evalCond(s, b.cond));
    if (br) next = br.next;
  }
  return enter(s, c, d, next, out);
}
