// Gemeinsamer Planer für den Headless-Bot und den Browser-Durchlauf: entscheidet wie eine gründliche Spielerin,
// nutzt nur, was das Spiel an diesem Ort, zu dieser Zeit anbietet.
import type { Content } from '../../src/engine/core';
import type { GameState, Hotspot, LocId, NpcId, Stance } from '../../src/engine/types';
import type { LineView } from '../../src/engine/dialogue';
import { autoScene, NO_CAT } from '../../src/engine/session';
import { examineFor, hotspotsIn, npcsIn, presentFor, presentables, smalltalkFor, topicsFor } from '../../src/engine/world';
import { openDeductions, supportCount } from '../../src/engine/deduce';

export interface Policy {
  name: string;
  order: Stance[];
  npcOrder?: Partial<Record<NpcId, Stance[]>>;
  ending: 'go' | 'stay';
  minimal?: boolean;
}

export const KIND: Stance[] = ['ehrlich', 'mitfuehlend', 'schweigen', 'humor', 'neutral', 'ausweichend', 'direkt', 'luege'];
export const HARSH: Stance[] = ['direkt', 'ausweichend', 'luege', 'neutral', 'humor', 'schweigen', 'ehrlich', 'mitfuehlend'];

export type Plan =
  | { type: 'scene'; dlg: string }
  | { type: 'deduce'; id: string; answers: number[] }
  | { type: 'examine'; hotspot: Hotspot; dlg: string }
  | { type: 'yuumi'; hotspot: Hotspot; dlg: string }
  | { type: 'topic'; npc: NpcId; dlg: string; title: string }
  | { type: 'smalltalk'; npc: NpcId; dlg: string }
  | { type: 'present'; npc: NpcId; item: string; dlg: string }
  | { type: 'pet'; dlg: string }
  | { type: 'move'; hotspot: Hotspot; target: LocId };

export function chooseIndex(v: LineView, s: GameState, c: Content, p: Policy): number | undefined {
  if (!v.choices) return undefined;
  if (v.dlg === 'k5_dawn') {
    const want = p.ending === 'go' ? 'Nach Hause' : 'Bleiben';
    const hit = v.choices.find((ch) => ch.text.includes(want));
    if (hit) return hit.index;
  }
  const npc = c.dialogues[v.dlg].npc;
  const order = (npc && p.npcOrder?.[npc]) || p.order;
  const sorted = [...v.choices].sort((a, b) => order.indexOf(a.stance) - order.indexOf(b.stance));
  const tries = Math.max(0, (s.seen[v.dlg] ?? 1) - 1);
  return sorted[tries % sorted.length]?.index;
}

function candidates(st: GameState, c: Content, loc: LocId, p: Policy): Plan[] {
  const t = { ...st, loc, yuumiLoc: st.flags['g_yuumi_lost'] || NO_CAT.has(loc) ? st.yuumiLoc : loc };
  const out: Plan[] = [];
  const sc = autoScene(t, c);
  if (sc) out.push({ type: 'scene', dlg: sc.id });
  for (const h of hotspotsIn(t, c, loc)) {
    if (h.kind === 'examine' || h.kind === 'exit') {
      const d = examineFor(t, c, h.id);
      if (d && !t.seen[d.id]) out.push({ type: 'examine', hotspot: h, dlg: d.id });
    }
    if (h.kind === 'cat' && c.locations[loc].catAllowed && !t.flags['g_yuumi_lost'] && t.yuumiLoc === loc) {
      const d = examineFor(t, c, h.id, 'yuumi');
      if (d && !t.seen[d.id]) out.push({ type: 'yuumi', hotspot: h, dlg: d.id });
    }
  }
  for (const { npc } of npcsIn(t, c, loc)) {
    for (const d of topicsFor(t, c, npc)) out.push({ type: 'topic', npc, dlg: d.id, title: d.title ?? '' });
    if (!p.minimal) {
      const st2 = smalltalkFor(t, c, npc);
      if (st2 && !t.seen[st2.id]) out.push({ type: 'smalltalk', npc, dlg: st2.id });
      for (const item of presentables(t)) {
        const { dlg } = presentFor(t, c, npc, item);
        if (dlg && dlg.items?.[0] !== '*' && !t.seen[dlg.id]) out.push({ type: 'present', npc, item, dlg: dlg.id });
      }
    }
  }
  if (!p.minimal && t.yuumiLoc === loc && !t.flags['g_yuumi_lost']) {
    const pet = examineFor(t, c, 'pet', 'yuumi');
    if (pet && !pet.repeat && !t.seen[pet.id]) out.push({ type: 'pet', dlg: pet.id });
  }
  return out;
}

export function plan(s: GameState, c: Content, p: Policy, failedExits: Set<string>): Plan | null {
  const sc = autoScene(s, c);
  if (sc) return { type: 'scene', dlg: sc.id };
  for (const d of openDeductions(s, c)) {
    if (supportCount(s, d) >= d.need) return { type: 'deduce', id: d.id, answers: d.slots.map((sl) => sl.correct[0]) };
  }
  const here = candidates(s, c, s.loc, p);
  if (here.length) return here[0];
  const exitsOf = (loc: LocId) => hotspotsIn({ ...s, loc }, c, loc).filter((h) => h.kind === 'exit' && h.to);
  const start = s.loc;
  const prev = new Map<LocId, { from: LocId; hs: Hotspot }>();
  const queue: LocId[] = [start];
  const visited = new Set<LocId>([start]);
  let target: LocId | null = null;
  while (queue.length) {
    const l = queue.shift()!;
    if (l !== start && candidates(s, c, l, p).length) { target = l; break; }
    for (const h of exitsOf(l)) {
      const to = h.to as LocId;
      if (visited.has(to) || failedExits.has(h.id)) continue;
      visited.add(to);
      prev.set(to, { from: l, hs: h });
      queue.push(to);
    }
  }
  if (!target) return null;
  let step: LocId = target;
  while (prev.get(step)!.from !== start) step = prev.get(step)!.from;
  return { type: 'move', hotspot: prev.get(step)!.hs, target };
}
