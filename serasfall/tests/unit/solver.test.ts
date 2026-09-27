import { buildContent } from '../../src/content';
import { runBot, KIND, HARSH } from './bot';

const C = buildContent();
const runs = [
  runBot(C, { name: 'echo', order: KIND, ending: 'go' }),
  runBot(C, { name: 'siegel', order: KIND, npcOrder: { lionel: HARSH }, ending: 'go' }),
  runBot(C, { name: 'zeugin', order: KIND, ending: 'stay' }),
  runBot(C, { name: 'minimal', order: HARSH, ending: 'go', minimal: true }),
];

describe('Deduktions-Solver (Fairness)', () => {
  it('jede Schlussfolgerung ist spätestens in ihrem Kapitel lösbar – nur mit erreichbaren Hinweisen', () => {
    const r = runs[0];
    const late: string[] = [];
    for (const d of Object.values(C.deductions)) {
      const ch = r.deductionChapter[d.id];
      if (ch === undefined) late.push(`${d.id}: nie gelöst`);
      else if (ch > d.chapter) late.push(`${d.id}: erst in Kapitel ${ch} (geplant ${d.chapter})`);
    }
    expect(late).toEqual([]);
  });

  it('auch der ungeduldige Weg löst alle Schlussfolgerungen, die das Ende braucht', () => {
    const r = runs[3];
    const need = ['d01', 'd03', 'd05', 'd06', 'd08', 'd10', 'd11', 'd16'];
    expect(need.filter((d) => !r.state.deductions[d])).toEqual([]);
  });

  it('jede Stütze einer Schlussfolgerung ist vor deren Kapitelende erreichbar (mind. zwei)', () => {
    const r = runs[0];
    const bad: string[] = [];
    for (const d of Object.values(C.deductions)) {
      const known = r.chapterKnowledge[d.chapter] ?? new Set();
      const n = d.support.filter((x) => known.has(x)).length;
      if (n < 2) bad.push(`${d.id}: nur ${n} Stützen bis Kapitel ${d.chapter}`);
    }
    expect(bad).toEqual([]);
  });

  it('Endrekonstruktion: benötigtes Wissen ist erreichbar', () => {
    const r = runs[0];
    const all = new Set([...Object.keys(r.state.clues), ...Object.keys(r.state.statements), ...Object.keys(r.state.deductions)]);
    const bad = C.recon.flatMap((q) => q.needs.filter((n) => !all.has(n)).map((n) => `${q.id}: ${n}`));
    expect(bad).toEqual([]);
  });

  it('Abdeckung: fast alle Dialoge werden in mindestens einem Durchlauf erreicht', () => {
    const seen = new Set<string>();
    runs.forEach((r) => r.seenDialogues.forEach((d) => seen.add(d)));
    const unseen = Object.values(C.dialogues).filter((d) => !seen.has(d.id) && d.kind !== 'present').map((d) => d.id);
    console.log('nicht erreicht (Bot):', unseen.join(', '));
    console.log('Enden:', runs.map((r) => r.state.ending).join(', '), '| Zeilen:', runs.map((r) => r.lines).join(', '));
    expect(unseen.length).toBeLessThan(25);
  });
});
