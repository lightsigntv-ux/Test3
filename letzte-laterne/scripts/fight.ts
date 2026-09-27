// Einzelkampf-Analyse: EXP=2 ENC=archivarin LEVEL=4 npx tsx scripts/fight.ts
import { EXPEDITION_SCALE } from '../src/content/balance';
import { CombatSim, type CombatSetup } from '../src/sim/combat';
import { combatPolicy } from '../src/game/bot';
import { heroStats } from '../src/game/derive';
import type { EnemyId, ExpeditionId, RelicId } from '../src/content/types';
const exp = Number(process.env.EXP ?? 2) as ExpeditionId;
const enc = (process.env.ENC ?? 'archivarin').split('+') as EnemyId[];
const level = Number(process.env.LEVEL ?? 4);
const kind = (process.env.KIND ?? 'boss') as any;
function setup(seed: number, relics: RelicId[]): CombatSetup {
  const run = { level, upgrades: [], runHpBonus: {} } as any;
  return { seed, kind, enemies: enc, relics, upgrades: [], seals: [], mods: [], focusBonus: 0, hpScale: EXPEDITION_SCALE[exp].hp, dmgScale: EXPEDITION_SCALE[exp].dmg, flags: { courierHelps: !!process.env.COURIER, namesFreed: false },
    heroes: (['fritz', 'ivo', 'sera'] as const).map((id) => { const s = heroStats(run, id); return { id, hp: s.maxHp, maxHp: s.maxHp, atk: s.atk, heal: s.heal, mult: s.mult, items: [] }; }) };
}
for (const skill of ['good', 'casual'] as const) for (const relics of [[], ['mondgloeckchen'], ['chor'], ['wappen']] as RelicId[][]) {
  let w = 0, t = 0; const deaths: string[] = []; let dmg: Record<string, number> = {};
  for (let i = 0; i < 20; i++) { const s = new CombatSim(setup(i + 1, relics)); s.runToEnd((x) => combatPolicy(x, skill)); if (s.result === 'victory') w++; t += s.time; for (const [k, v] of Object.entries(s.stats.damageTaken)) dmg[k] = (dmg[k] ?? 0) + v / 20; if (i === 0) deaths.push(...s.stats.heroDeaths.map(d => `${d.hero}@${d.time.toFixed(0)}`)); }
  console.log(skill.padEnd(6), (relics[0] ?? '-').padEnd(15), `win ${w * 5}%`, `t ${(t / 20).toFixed(0)}s`, JSON.stringify(Object.fromEntries(Object.entries(dmg).map(([k, v]) => [k, Math.round(v)]))), deaths.join(' '));
}
