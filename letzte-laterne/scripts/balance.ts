import * as A from '../src/game/actions';
import { playRun } from '../src/game/bot';
import { newSave } from '../src/game/save';
import type { ExpeditionId, SealId } from '../src/content/types';

const N = Number(process.env.N ?? 60);
function trial(exp: ExpeditionId, label: string, opts: { seals?: SealId[]; skill?: 'good' | 'casual' | 'passive'; takeCat?: boolean; mods?: any[]; yuumi?: boolean } = {}) {
  let wins = 0; let stations = 0; let time = 0; let combats = 0; const deaths: Record<number, number> = {}; let light = 0;
  for (let i = 0; i < N; i++) {
    let s = newSave();
    s.meta.unlockedExpedition = 3;
    s.meta.catGuaranteeUsed = opts.takeCat === undefined;
    s.meta.sealsOwned = opts.seals ?? [];
    s.meta.sealsActive = opts.seals ?? [];
    if (opts.mods) s.meta.story.ending = 'keep';
    s = A.startRun(s, exp, { seed: 1000 + i * 7919, mods: opts.mods });
    if (opts.yuumi) s.run!.relics[1] = 'mondgloeckchen';
    const r = playRun(s, { skill: opts.skill, takeCat: opts.takeCat });
    if (r.outcome === 'victory') wins++; else deaths[r.station] = (deaths[r.station] ?? 0) + 1;
    stations += r.station; time += r.combatTime; combats += r.combats; light += r.save.run!.lightEarned;
    if (process.env.V && i < 3) console.log(r.log.join('\n'));
  }
  console.log(`${label.padEnd(34)} win ${(wins / N * 100).toFixed(0).padStart(3)}%  avgCombat ${(time / combats).toFixed(0)}s  totalCombat ${(time / N / 60).toFixed(1)}min  light ${(light/N).toFixed(1)}  deathsAt ${JSON.stringify(deaths)}`);
}
const which = process.env.EXP ? [Number(process.env.EXP) as ExpeditionId] : [1, 2, 3] as ExpeditionId[];
for (const e of which) {
  trial(e, `Exp ${e} good`);
  trial(e, `Exp ${e} good + 3 seals`, { seals: ['bastion1', 'bastion2', 'glut1'] });
  trial(e, `Exp ${e} casual`, { skill: 'casual', takeCat: false });
  trial(e, `Exp ${e} casual + yuumi`, { skill: 'casual', takeCat: false, yuumi: true });
  trial(e, `Exp ${e} casual + 3 seals`, { skill: 'casual', takeCat: false, seals: ['bastion1', 'bastion2', 'glut1'] });
  trial(e, `Exp ${e} good + yuumi`, { takeCat: false, yuumi: true });
}
