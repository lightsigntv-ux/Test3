// Vergleicht die Ausprägungen: je Figur eine Ausprägung tauschen, Rest Standard.
// Kennzahl über Elite-, Schwer- und Bosskämpfe aller Expeditionen (good & casual Bot).
import { ENCOUNTERS } from '../src/content/enemies';
import { EXPEDITION_SCALE, STATION_RAMP } from '../src/content/balance';
import { ARCHETYPES_BY_HERO, DEFAULT_ARCHETYPE, emptyAttrs, type ArchetypeId } from '../src/content/builds';
import { CombatSim, type CombatSetup } from '../src/sim/combat';
import { combatPolicy } from '../src/game/bot';
import { heroStats } from '../src/game/derive';
import type { EnemyId, ExpeditionId, HeroId } from '../src/content/types';

const HEROES: HeroId[] = ['fritz', 'ivo', 'sera'];
function setup(exp: ExpeditionId, enemies: EnemyId[], station: number, level: number, seed: number, kind: any, arch: Record<HeroId, ArchetypeId>): CombatSetup {
  const attrs = { fritz: { ...emptyAttrs(), vit: 2, arm: 2 }, ivo: { ...emptyAttrs(), str: 2, vit: 1 }, sera: { ...emptyAttrs(), vit: 2, str: 1 } };
  const run = { level, upgrades: [], runHpBonus: {}, archetype: arch, attrs } as any;
  return {
    seed, kind, enemies, relics: [], upgrades: [], seals: [], mods: [], focusBonus: 0,
    hpScale: EXPEDITION_SCALE[exp].hp * (1 + STATION_RAMP.hp * station), dmgScale: EXPEDITION_SCALE[exp].dmg * (1 + STATION_RAMP.dmg * station),
    flags: { courierHelps: false, namesFreed: false },
    heroes: HEROES.map((id) => { const s = heroStats(run, id); return { id, hp: s.maxHp, maxHp: s.maxHp, atk: s.atk, heal: s.heal, mult: s.mult, items: [], interval: s.interval, armor: s.armor, dodge: s.dodge, archetype: arch[id] }; }),
  };
}
const fights: [ExpeditionId, EnemyId[], number, number, string][] = [];
for (const exp of [1, 2, 3] as ExpeditionId[]) {
  const p = ENCOUNTERS[exp];
  for (const e of p.normal) fights.push([exp, e, 2, 2, 'normal']);
  for (const e of p.hard) fights.push([exp, e, 5, 3, 'normal']);
  for (const e of p.elite) fights.push([exp, e, 4, 3, 'elite']);
  fights.push([exp, p.boss, 7, 4, 'boss']);
}
const variants: [string, Record<HeroId, ArchetypeId>][] = [['Standard', { ...DEFAULT_ARCHETYPE }]];
for (const h of HEROES) for (const a of ARCHETYPES_BY_HERO[h]) if (a !== DEFAULT_ARCHETYPE[h]) variants.push([`${h}:${a}`, { ...DEFAULT_ARCHETYPE, [h]: a }]);
const N = Number(process.env.N ?? 12);
for (const [label, arch] of variants) {
  const out: string[] = [];
  for (const skill of ['good', 'casual'] as const) {
    let wins = 0, hp = 0, n = 0, t = 0;
    const bossHp: number[] = [];
    for (const [exp, enemies, station, level, kind] of fights) {
      for (let i = 0; i < N; i++) {
        const sim = new CombatSim(setup(exp, enemies, station, level, i + 1, kind, arch));
        sim.runToEnd((s) => combatPolicy(s, skill));
        n++; t += sim.time;
        if (sim.result === 'victory') wins++;
        const left = sim.heroes.reduce((a, h) => a + Math.max(0, h.hp), 0) / sim.heroes.reduce((a, h) => a + h.maxHp, 0);
        hp += left;
        if (kind === 'boss') bossHp.push(sim.result === 'victory' ? 1 : 0);
      }
    }
    out.push(`${skill}: win ${(wins / n * 100).toFixed(0).padStart(3)}% hpLeft ${(hp / n * 100).toFixed(0).padStart(3)}% boss ${(bossHp.reduce((a, b) => a + b, 0) / bossHp.length * 100).toFixed(0).padStart(3)}% ${(t / n).toFixed(0)}s`);
  }
  console.log(`${label.padEnd(16)} ${out.join(' | ')}`);
}
