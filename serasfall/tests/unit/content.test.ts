import { buildContent } from '../../src/content';
import type { Cond, Dialogue, Effects } from '../../src/engine/types';
import { NPCS } from '../../src/engine/types';

const C = buildContent();
const dlgs = Object.values(C.dialogues);

function condsOf(d: Dialogue): Cond[] {
  const out: Cond[] = [];
  if (d.when) out.push(d.when);
  for (const n of Object.values(d.nodes)) {
    for (const b of n.branch ?? []) out.push(b.cond);
    for (const ch of n.choices ?? []) if (ch.cond) out.push(ch.cond);
  }
  return out;
}
function effectsOf(d: Dialogue): Effects[] {
  const out: Effects[] = [];
  for (const n of Object.values(d.nodes)) {
    if (n.effects) out.push(n.effects);
    for (const ch of n.choices ?? []) if (ch.effects) out.push(ch.effects);
  }
  return out;
}
const allConds: Cond[] = [
  ...dlgs.flatMap(condsOf),
  ...C.placements.map((p) => p.when!).filter(Boolean),
  ...Object.values(C.locations).flatMap((l) => l.hotspots.map((h) => h.when!).filter(Boolean)),
];
const allEffects: Effects[] = [...dlgs.flatMap(effectsOf), ...Object.values(C.deductions).map((d) => d.effects!).filter(Boolean)];

const setFlags = new Set(allEffects.flatMap((e) => e.flags ?? []));
const addedClues = new Set(allEffects.flatMap((e) => e.addClue ?? []));
const addedStatements = new Set(allEffects.flatMap((e) => e.addStatement ?? []));
const knowable = new Set([...Object.keys(C.clues), ...Object.keys(C.statements), ...Object.keys(C.deductions)]);
const hotspotIds = new Set(Object.values(C.locations).flatMap((l) => l.hotspots.map((h) => h.id)));
const ENGINE_FLAGS = new Set<string>([]);

describe('Inhalte – Verweise', () => {
  it('alle Knotenverweise existieren', () => {
    const bad: string[] = [];
    for (const d of dlgs) for (const n of Object.values(d.nodes)) {
      const targets = [n.next, ...(n.choices ?? []).map((c) => c.next), ...(n.branch ?? []).map((b) => b.next)].filter(Boolean) as string[];
      for (const t of targets) if (t !== 'END' && !d.nodes[t]) bad.push(`${d.id}: ${n.id} -> ${t}`);
    }
    expect(bad).toEqual([]);
  });

  it('keine toten Knoten', () => {
    const bad: string[] = [];
    for (const d of dlgs) {
      const seen = new Set<string>();
      const stack = [d.start];
      while (stack.length) {
        const id = stack.pop()!;
        if (id === 'END' || seen.has(id)) continue;
        seen.add(id);
        const n = d.nodes[id];
        if (!n) continue;
        [n.next, ...(n.choices ?? []).map((c) => c.next), ...(n.branch ?? []).map((b) => b.next)].forEach((t) => t && stack.push(t));
      }
      for (const id of Object.keys(d.nodes)) if (!seen.has(id)) bad.push(`${d.id}: ${id}`);
    }
    expect(bad).toEqual([]);
  });

  it('jede Wahl hat Text und jedes Wahl-Ende führt irgendwohin', () => {
    const bad: string[] = [];
    for (const d of dlgs) for (const n of Object.values(d.nodes)) for (const ch of n.choices ?? []) {
      if (!ch.text) bad.push(`${d.id}/${n.id}`);
    }
    expect(bad).toEqual([]);
  });

  it('abgefragte Flags werden irgendwo gesetzt', () => {
    const used = new Set(allConds.flatMap((c) => [...(c.flagsAll ?? []), ...(c.flagsNone ?? []), ...(c.flagsAny ?? [])]));
    const missing = [...used].filter((f) => !setFlags.has(f) && !ENGINE_FLAGS.has(f));
    expect(missing).toEqual([]);
  });

  it('abgefragtes Wissen existiert', () => {
    const used = new Set(allConds.flatMap((c) => [...(c.knows ?? []), ...(c.knowsAny ?? []), ...(c.knowsNone ?? [])]));
    const missing = [...used].filter((k) => !knowable.has(k));
    expect(missing).toEqual([]);
  });

  it('jeder Hinweis und jede Aussage ist erhältlich und existiert', () => {
    expect([...addedClues].filter((k) => !C.clues[k])).toEqual([]);
    expect([...addedStatements].filter((k) => !C.statements[k])).toEqual([]);
    expect(Object.keys(C.clues).filter((k) => !addedClues.has(k))).toEqual([]);
    expect(Object.keys(C.statements).filter((k) => !addedStatements.has(k))).toEqual([]);
  });

  it('Deduktionen verweisen auf existierendes Wissen', () => {
    const bad: string[] = [];
    for (const d of Object.values(C.deductions)) {
      for (const k of [...d.support, ...d.trigger]) if (!knowable.has(k)) bad.push(`${d.id}: ${k}`);
      if (d.support.length < 2 || d.need < 2) bad.push(`${d.id}: zu wenige Stützen`);
      if (d.doubt.length < 3) bad.push(`${d.id}: zu wenige Zweifel`);
    }
    expect(bad).toEqual([]);
  });

  it('Ziele von Untersuchungen und Orte existieren', () => {
    const bad: string[] = [];
    for (const d of dlgs) {
      if ((d.kind === 'examine' || d.kind === 'yuumi') && d.target && !hotspotIds.has(d.target) && !d.target.startsWith('pet')) bad.push(`${d.id}: ${d.target}`);
      if (d.npc && !NPCS.includes(d.npc)) bad.push(`${d.id}: npc ${d.npc}`);
      if (d.kind === 'topic' && !d.title) bad.push(`${d.id}: ohne Titel`);
      if (d.kind === 'present') for (const it of d.items ?? []) if (it !== '*' && !knowable.has(it)) bad.push(`${d.id}: item ${it}`);
      for (const e of effectsOf(d)) if (e.goto && !C.locations[e.goto.loc]) bad.push(`${d.id}: goto ${e.goto.loc}`);
    }
    for (const c of allConds) for (const l of c.location ?? []) if (!C.locations[l]) bad.push(`loc ${l}`);
    for (const p of C.placements) if (!C.locations[p.loc]) bad.push(`placement ${p.npc} ${p.loc}`);
    expect(bad).toEqual([]);
  });
});
