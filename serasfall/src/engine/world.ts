// Auswahl von Szenen, Themen, Untersuchungen, Vorlagen. Reine Funktionen.
import type { Dialogue, GameState, Hotspot, NpcId } from './types';
import { evalCond, placementsAt, type Content } from './core';

function available(s: GameState, d: Dialogue): boolean {
  if (!d.repeat && s.seen[d.id]) return false;
  return evalCond(s, d.when);
}

function best(list: Dialogue[]): Dialogue | undefined {
  return list.sort((a, b) => b.priority - a.priority)[0];
}

/** Szene oder Ereignis, das beim Betreten eines Ortes oder nach einem Gespräch ausgelöst wird. */
export function pendingScene(s: GameState, c: Content): Dialogue | undefined {
  const list = Object.values(c.dialogues).filter((d) => (d.kind === 'scene' || d.kind === 'event') && available(s, d));
  // Szenen brauchen einen passenden Ort in ihrer Bedingung oder gelten überall
  return best(list);
}

export function topicsFor(s: GameState, c: Content, npc: NpcId): Dialogue[] {
  return Object.values(c.dialogues)
    .filter((d) => d.kind === 'topic' && d.npc === npc && available(s, d))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
}

export function smalltalkFor(s: GameState, c: Content, npc: NpcId): Dialogue | undefined {
  const fresh = Object.values(c.dialogues).filter((d) => d.kind === 'smalltalk' && d.npc === npc && !s.seen[d.id] && evalCond(s, d.when));
  if (fresh.length) return best(fresh);
  const idle = Object.values(c.dialogues).filter((d) => d.kind === 'smalltalk' && d.npc === npc && d.repeat && evalCond(s, d.when));
  return best(idle);
}

export function examineFor(s: GameState, c: Content, target: string, kind: 'examine' | 'yuumi' = 'examine'): Dialogue | undefined {
  const list = Object.values(c.dialogues).filter((d) => d.kind === kind && d.target === target && available(s, d));
  return best(list);
}

/** Vorlegen: spezifische Reaktion oder figurentypische Standardreaktion (rotierend). */
export function presentFor(s: GameState, c: Content, npc: NpcId, item: string): { dlg?: Dialogue; rotKey?: string } {
  const specific = Object.values(c.dialogues).filter(
    (d) => d.kind === 'present' && d.npc === npc && d.items?.includes(item) && available(s, d),
  );
  if (specific.length) return { dlg: best(specific) };
  const defaults = Object.values(c.dialogues)
    .filter((d) => d.kind === 'present' && d.npc === npc && d.items?.includes('*') && evalCond(s, d.when))
    .sort((a, b) => a.id.localeCompare(b.id));
  if (!defaults.length) return {};
  const key = `present_${npc}`;
  const i = (s.presentRot[key] ?? 0) % defaults.length;
  return { dlg: defaults[i], rotKey: key };
}

export function hotspotsIn(s: GameState, c: Content, loc: string): Hotspot[] {
  const L = c.locations[loc];
  if (!L) return [];
  return L.hotspots.filter((h) => evalCond(s, h.when));
}

export function npcsIn(s: GameState, c: Content, loc: string) {
  return placementsAt(s, c, loc);
}

/** Alles, was die Spielerin vorlegen kann. */
export function presentables(s: GameState): string[] {
  return [
    ...Object.keys(s.clues).filter((k) => !k.startsWith('e')),
    ...Object.keys(s.statements),
    ...Object.keys(s.deductions),
  ];
}
