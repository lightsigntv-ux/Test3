// Spielablauf zwischen Gesprächen: Ortswechsel, automatische Szenen, Sonderaktionen. Rein, ohne DOM.
import type { GameState, Hotspot, LocId, NpcId } from './types';
import { clone, evalCond, type Content, type GameEvent } from './core';
import { examineFor, pendingScene, presentFor, smalltalkFor, topicsFor, hotspotsIn, npcsIn } from './world';
import { startDialogue, advance, type StepResult } from './dialogue';

export interface Outcome {
  state: GameState;
  events: GameEvent[];
  /** UI-Hinweise, Rekonstruktion, Ende … */
  specials: string[];
  step?: StepResult;
}

export function enterLocation(state: GameState, c: Content, loc: LocId, x: number): GameState {
  const s = clone(state);
  s.loc = loc;
  s.x = x;
  if (!s.flags['g_yuumi_lost'] && c.locations[loc]?.catAllowed !== false) s.yuumiLoc = loc;
  else if (!s.flags['g_yuumi_lost']) s.yuumiLoc = loc;
  s.controlling = 'sera';
  return s;
}

/** Verarbeitet Ereignisse eines Dialogschritts, die den Zustand betreffen (Ortswechsel, Kapitel, Sonderaktionen). */
export function settle(state: GameState, c: Content, events: GameEvent[]): { state: GameState; specials: string[] } {
  let s = state;
  const specials: string[] = [];
  for (const e of events) {
    if (e.type === 'goto') s = enterLocation(s, c, e.loc as LocId, e.x);
    if (e.type === 'chapter') {
      s = clone(s);
      s.controlling = 'sera';
      delete s.flags['g_yuumi_lost'];
      specials.push(`chapter:${e.n}`);
    }
    if (e.type === 'special') {
      if (e.id === 'control_sera') { s = clone(s); s.controlling = 'sera'; }
      else if (e.id.startsWith('ending:')) { s = clone(s); s.ending = e.id.slice(7); specials.push(e.id); }
      else specials.push(e.id);
    }
  }
  return { state: s, specials };
}

export function autoScene(s: GameState, c: Content) {
  if (s.active) return undefined;
  return pendingScene(s, c);
}

export type Action =
  | { type: 'examine'; target: string }
  | { type: 'exit'; hotspot: Hotspot }
  | { type: 'topic'; npc: NpcId; dlg: string }
  | { type: 'smalltalk'; npc: NpcId }
  | { type: 'present'; npc: NpcId; item: string }
  | { type: 'yuumi'; target: string }
  | { type: 'pet' };

/** Startet eine Aktion. Gibt null zurück, wenn es nichts zu tun gibt. */
export function act(state: GameState, c: Content, a: Action): StepResult | { moved: GameState } | null {
  switch (a.type) {
    case 'examine': {
      const d = examineFor(state, c, a.target);
      return d ? startDialogue(state, c, d.id) : null;
    }
    case 'exit': {
      const gate = examineFor(state, c, a.hotspot.id);
      if (gate) return startDialogue(state, c, gate.id);
      if (!a.hotspot.to) return null;
      return { moved: enterLocation(state, c, a.hotspot.to, a.hotspot.arriveX ?? 0.5) };
    }
    case 'topic':
      return startDialogue(state, c, a.dlg);
    case 'smalltalk': {
      const d = smalltalkFor(state, c, a.npc);
      return d ? startDialogue(state, c, d.id) : null;
    }
    case 'present': {
      const { dlg, rotKey } = presentFor(state, c, a.npc, a.item);
      return dlg ? startDialogue(state, c, dlg.id, rotKey) : null;
    }
    case 'yuumi': {
      const d = examineFor(state, c, a.target, 'yuumi');
      return d ? startDialogue(state, c, d.id) : null;
    }
    case 'pet': {
      const d = examineFor(state, c, 'pet', 'yuumi');
      return d ? startDialogue(state, c, d.id) : null;
    }
  }
}

export { advance, startDialogue, topicsFor, smalltalkFor, hotspotsIn, npcsIn, examineFor, presentFor, evalCond };
