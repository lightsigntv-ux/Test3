import * as A from '../src/game/actions';
import { playRun } from '../src/game/bot';
import { newSave } from '../src/game/save';
import type { ExpeditionId, SealId } from '../src/content/types';

import { EXPEDITION_SCALE, STATION_RAMP } from '../src/content/balance';
if (process.env.SCALE) Object.assign(EXPEDITION_SCALE, JSON.parse(process.env.SCALE));
if (process.env.RAMP) Object.assign(STATION_RAMP, JSON.parse(process.env.RAMP));
const N = Number(process.env.N ?? 60);
function trial(exp: ExpeditionId, label: string, opts: { seals?: SealId[]; skill?: 'good' | 'casual' | 'passive'; takeCat?: boolean; mods?: any[]; yuumi?: boolean; arch?: any; allocate?: boolean } = {}) {
  let wins = 0; let stations = 0; let time = 0; let combats = 0; const deaths: Record<number, number> = {}; let light = 0;
  for (let i = 0; i < N; i++) {
    let s = newSave();
    s.meta.unlockedExpedition = 3;
    s.meta.catGuaranteeUsed = opts.takeCat === undefined;
    s.meta.sealsOwned = opts.seals ?? [];
    s.meta.sealsUnlocked = !!opts.seals;
    s.meta.sealsActive = opts.seals ?? [];
    if (opts.mods) s.meta.story.ending = 'keep';
    s = A.startRun(s, exp, { seed: 1000 + i * 7919, mods: opts.mods, archetypes: opts.arch });
    if (opts.yuumi) s.run!.relics[1] = 'mondgloeckchen';
    const r = playRun(s, { skill: opts.skill, takeCat: opts.takeCat, allocate: opts.allocate });
    if (r.outcome === 'victory') wins++; else deaths[r.station] = (deaths[r.station] ?? 0) + 1;
    stations += r.station; time += r.combatTime; combats += r.combats; light += r.save.run!.lightEarned;
    if (process.env.V && i < 3) console.log(r.log.join('\n'));
  }
  console.log(`${label.padEnd(34)} win ${(wins / N * 100).toFixed(0).padStart(3)}%  avgCombat ${(time / combats).toFixed(0)}s  totalCombat ${(time / N / 60).toFixed(1)}min  light ${(light/N).toFixed(1)}  deathsAt ${JSON.stringify(deaths)}`);
}
const which = process.env.EXP ? [Number(process.env.EXP) as ExpeditionId] : [1, 2, 3] as ExpeditionId[];
const S3: SealId[] = ['bastion1', 'bastion2', 'glut1'];
const S3b: SealId[] = ['bastion2', 'bastion3', 'echo1'];
for (const e of which) {
  trial(e, `Exp ${e} casual (erster Run)`, { skill: 'casual', takeCat: false });
  trial(e, `Exp ${e} casual ohne Punkte`, { skill: 'casual', takeCat: false, allocate: false });
  trial(e, `Exp ${e} good`, { takeCat: false });
  trial(e, `Exp ${e} casual + 3 Siegel`, { skill: 'casual', takeCat: false, seals: S3 });
  trial(e, `Exp ${e} casual + 3 Siegel (b)`, { skill: 'casual', takeCat: false, seals: S3b });
  trial(e, `Exp ${e} good + 3 Siegel`, { takeCat: false, seals: S3 });
  trial(e, `Exp ${e} casual + Siegel + Yuumi`, { skill: 'casual', takeCat: false, seals: S3, yuumi: true });
  if (process.env.ARCH) {
    for (const [label, arch] of [
      ['Klingen/Frost/Gift', { fritz: 'blades', ivo: 'frost', sera: 'poison' }],
      ['Bollwerk/Blitz/Licht', { fritz: 'bulwark', ivo: 'storm', sera: 'light' }],
      ['Klingen/Blitz/Hüterin', { fritz: 'blades', ivo: 'storm', sera: 'keeper' }],
      ['Wächter/Frost/Licht', { fritz: 'guardian', ivo: 'frost', sera: 'light' }],
      ['Bollwerk/Feuer/Gift', { fritz: 'bulwark', ivo: 'fire', sera: 'poison' }],
    ] as const) trial(e, `Exp ${e} casual+S ${label}`, { skill: 'casual', takeCat: false, seals: S3, arch });
  }
}
