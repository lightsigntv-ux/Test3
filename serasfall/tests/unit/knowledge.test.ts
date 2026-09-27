import { buildContent } from '../../src/content';
import { LEARN, MATRIX } from '../../src/content/knowledge';
import type { Dialogue, NpcId } from '../../src/engine/types';
import { NPCS } from '../../src/engine/types';

const C = buildContent();

function flagsSetIn(d: Dialogue): Set<string> {
  const s = new Set<string>();
  for (const n of Object.values(d.nodes)) {
    n.effects?.flags?.forEach((f) => s.add(f));
    n.choices?.forEach((c) => c.effects?.flags?.forEach((f) => s.add(f)));
  }
  return s;
}

/** Hat die Figur die Tatsache in diesem Dialog wissen können? */
function mayKnow(npc: NpcId, fact: string, d: Dialogue, allowAhnt: boolean): boolean {
  const st = MATRIX[npc]?.[fact];
  if (st === 'W' || st === 'V' || st === 'L') return true; // wer lügt, kennt die Wahrheit
  if (allowAhnt && st === 'A') return true;
  const flagsReq = new Set([...(d.when?.flagsAll ?? [])]);
  const setHere = flagsSetIn(d);
  return LEARN.some((l) => l.npc === npc && l.fact === fact && (flagsReq.has(l.flag) || setHere.has(l.flag)));
}

describe('Wissensmatrix', () => {
  it('jede markierte Zeile passt zum Wissensstand der Sprecherin', () => {
    const bad: string[] = [];
    for (const d of Object.values(C.dialogues)) for (const n of Object.values(d.nodes)) {
      const sp = n.speaker as NpcId;
      if (!NPCS.includes(sp)) continue;
      for (const f of n.reveals ?? []) if (!mayKnow(sp, f, d, false)) bad.push(`${d.id}/${n.id}: ${sp} reveals ${f} (${MATRIX[sp][f]})`);
      for (const f of n.hints ?? []) if (!mayKnow(sp, f, d, true)) bad.push(`${d.id}/${n.id}: ${sp} hints ${f} (${MATRIX[sp][f]})`);
      if (n.lie && MATRIX[sp][n.lie] !== 'L') bad.push(`${d.id}/${n.id}: ${sp} lie ${n.lie} (${MATRIX[sp][n.lie]})`);
    }
    expect(bad).toEqual([]);
  });

  it('Lügen-Aussagen stammen nur von Figuren mit LÜGT-Status', () => {
    // Aussagen mit truth=luege müssen in einem Knoten mit lie: vorkommen
    const bad: string[] = [];
    for (const d of Object.values(C.dialogues)) for (const n of Object.values(d.nodes)) {
      for (const sid of n.effects?.addStatement ?? []) {
        const st = C.statements[sid];
        if (st?.truth === 'luege' && !n.lie) bad.push(`${d.id}/${n.id}: ${sid} ohne lie-Markierung`);
        if (st && st.speaker !== 'sera' && n.speaker && NPCS.includes(n.speaker as NpcId) && n.speaker !== st.speaker) bad.push(`${d.id}/${n.id}: ${sid} gehört ${st.speaker}, gesprochen von ${n.speaker}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('Matrix vollständig', () => {
    for (const npc of NPCS) expect(Object.keys(MATRIX[npc]).length).toBe(27);
  });
});
