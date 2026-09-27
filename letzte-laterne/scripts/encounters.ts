// Prüft einzelne Begegnungen mit festen Level/Item-Ständen (casual & good).
import { ENCOUNTERS } from '../src/content/enemies';
import { EXPEDITION_SCALE } from '../src/content/balance';
import { CombatSim, type CombatSetup } from '../src/sim/combat';
import { combatPolicy } from '../src/game/bot';
import { heroStats } from '../src/game/derive';
import type { EnemyId, ExpeditionId } from '../src/content/types';

function setup(exp: ExpeditionId, enemies: EnemyId[], level: number, seed: number, kind: any): CombatSetup {
  const run = { level, upgrades: [], runHpBonus: {} } as any;
  return {
    seed, kind, enemies, relics: [], upgrades: [], seals: [], mods: [], focusBonus: 0,
    hpScale: EXPEDITION_SCALE[exp].hp, dmgScale: EXPEDITION_SCALE[exp].dmg, flags: { courierHelps: false, namesFreed: false },
    heroes: (['fritz', 'ivo', 'sera'] as const).map((id) => { const s = heroStats(run, id); return { id, hp: s.maxHp, maxHp: s.maxHp, atk: s.atk, heal: s.heal, mult: s.mult, items: [] }; }),
  };
}
for (const exp of [1, 2, 3] as ExpeditionId[]) {
  const p = ENCOUNTERS[exp];
  const rows: [string, EnemyId[], number, string][] = [
    ...p.easy.map((e) => ['easy', e, 1, 'normal'] as [string, EnemyId[], number, string]),
    ...p.normal.map((e) => ['normal', e, 2, 'normal'] as [string, EnemyId[], number, string]),
    ...p.elite.map((e) => ['elite', e, 3, 'elite'] as [string, EnemyId[], number, string]),
    ...p.hard.map((e) => ['hard', e, 3, 'normal'] as [string, EnemyId[], number, string]),
    ['boss', p.boss, 4, 'boss'],
  ];
  for (const [tier, enemies, level, kind] of rows) {
    const res: string[] = [];
    for (const skill of ['good', 'casual'] as const) {
      let t = 0, hp = 0, wins = 0; const n = 20;
      for (let i = 0; i < n; i++) {
        const sim = new CombatSim(setup(exp, enemies, level, i + 1, kind));
        sim.runToEnd((s) => combatPolicy(s, skill));
        t += sim.time; if (sim.result === 'victory') wins++;
        hp += sim.heroes.reduce((a, h) => a + Math.max(0, h.hp), 0) / sim.heroes.reduce((a, h) => a + h.maxHp, 0);
      }
      res.push(`${skill}: win ${(wins / n * 100).toFixed(0).padStart(3)}% ${(t / n).toFixed(0).padStart(3)}s hpLeft ${(hp / n * 100).toFixed(0).padStart(3)}%`);
    }
    console.log(`E${exp} ${tier.padEnd(6)} L${level} ${enemies.join('+').padEnd(58)} ${res.join(' | ')}`);
  }
}
