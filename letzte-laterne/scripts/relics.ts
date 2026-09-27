import * as A from '../src/game/actions';
import { playRun } from '../src/game/bot';
import { newSave } from '../src/game/save';
import type { ExpeditionId, RelicId } from '../src/content/types';
const N = Number(process.env.N ?? 40);
const exp = Number(process.env.EXP ?? 2) as ExpeditionId;
for (const relic of [null, 'docht', 'aschekompass', 'wappen', 'glocke', 'taschenuhr', 'chor', 'mondgloeckchen'] as (RelicId | null)[]) {
  let wins = 0, light = 0;
  for (let i = 0; i < N; i++) {
    let s = newSave(); s.meta.unlockedExpedition = 3; s.meta.catGuaranteeUsed = true;
    s = A.startRun(s, exp, { seed: 5000 + i * 104729 });
    if (relic) s.run!.relics[1] = relic;
    const r = playRun(s, { skill: 'casual', takeCat: false, avoidRelic: 'x' });
    if (r.outcome === 'victory') wins++; light += r.save.run!.lightEarned;
  }
  console.log(`${String(relic).padEnd(16)} casual E${exp}: win ${(wins / N * 100).toFixed(0)}%  light ${(light / N).toFixed(1)}`);
}
