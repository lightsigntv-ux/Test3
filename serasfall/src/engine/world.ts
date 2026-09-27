// Auswahl von Szenen, Themen, Untersuchungen, Vorlagen. Reine Funktionen.
import type { Dialogue, GameState, Hotspot, NpcId } from './types';
import { evalCond, placementsAt, type Content } from './core';

interface Index { byTarget: Map<string, Dialogue[]>; byNpcKind: Map<string, Dialogue[]>; scenes: Dialogue[] }
const cache = new WeakMap<Content, Index>();
function idx(c: Content): Index {
  let i = cache.get(c);
  if (i) return i;
  i = { byTarget: new Map(), byNpcKind: new Map(), scenes: [] };
  for (const d of Object.values(c.dialogues)) {
    if (d.target) { const k = `${d.kind}:${d.target}`; (i.byTarget.get(k) ?? i.byTarget.set(k, []).get(k)!).push(d); }
    if (d.npc) { const k = `${d.kind}:${d.npc}`; (i.byNpcKind.get(k) ?? i.byNpcKind.set(k, []).get(k)!).push(d); }
    if (d.kind === 'scene' || d.kind === 'event') i.scenes.push(d);
  }
  cache.set(c, i);
  return i;
}
const byNpc = (c: Content, kind: string, npc: string) => idx(c).byNpcKind.get(`${kind}:${npc}`) ?? [];

function available(s: GameState, d: Dialogue): boolean {
  if (!d.repeat && s.seen[d.id]) return false;
  return evalCond(s, d.when);
}

function best(list: Dialogue[]): Dialogue | undefined {
  return [...list].sort((a, b) => b.priority - a.priority)[0];
}

/** Szene oder Ereignis, das beim Betreten eines Ortes oder nach einem Gespräch ausgelöst wird. */
export function pendingScene(s: GameState, c: Content): Dialogue | undefined {
  const list = idx(c).scenes.filter((d) => available(s, d));
  // Szenen brauchen einen passenden Ort in ihrer Bedingung oder gelten überall
  return best(list);
}

export function topicsFor(s: GameState, c: Content, npc: NpcId): Dialogue[] {
  return byNpc(c, 'topic', npc)
    .filter((d) => available(s, d))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
}

export function smalltalkFor(s: GameState, c: Content, npc: NpcId): Dialogue | undefined {
  const fresh = byNpc(c, 'smalltalk', npc).filter((d) => !s.seen[d.id] && evalCond(s, d.when));
  if (fresh.length) return best(fresh);
  const idle = byNpc(c, 'smalltalk', npc).filter((d) => d.repeat && evalCond(s, d.when));
  return best(idle);
}

export function examineFor(s: GameState, c: Content, target: string, kind: 'examine' | 'yuumi' = 'examine'): Dialogue | undefined {
  const list = (idx(c).byTarget.get(`${kind}:${target}`) ?? []).filter((d) => available(s, d));
  return best(list);
}

/** Vorlegen: spezifische Reaktion oder figurentypische Standardreaktion (rotierend). */
export function presentFor(s: GameState, c: Content, npc: NpcId, item: string): { dlg?: Dialogue; rotKey?: string } {
  const all = byNpc(c, 'present', npc);
  const specific = all.filter((d) => d.items?.includes(item) && available(s, d));
  if (specific.length) return { dlg: best(specific) };
  const defaults = all
    .filter((d) => d.items?.includes('*') && evalCond(s, d.when))
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
/** Gegenstände, die Sera nicht mehr bei sich hat. */
const GIVEN_AWAY: Record<string, string> = { c03: 'g_watch_given' };

export function presentables(s: GameState): string[] {
  return [
    ...Object.keys(s.clues).filter((k) => !k.startsWith('e') && !(GIVEN_AWAY[k] && s.flags[GIVEN_AWAY[k]])),
    ...Object.keys(s.statements),
    ...Object.keys(s.deductions),
  ];
}
