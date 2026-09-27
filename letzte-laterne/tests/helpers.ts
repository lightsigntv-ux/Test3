import type { EnemyId, HeroId, ItemId, RelicId, SealId, UpgradeId } from '../src/content/types';
import { heroStats } from '../src/game/derive';
import { ITEMS, type EquipItem } from '../src/content/items';

/** Gegenstände in Tests: standardmäßig „Magisch“, Einzelstücke „Legendär“. */
export const eq = (i: ItemId | EquipItem): EquipItem => (typeof i === 'string' ? { id: i, q: ITEMS[i].unique ? 'legendary' : 'magic' } : i);
import { CombatSim, type CombatSetup } from '../src/sim/combat';

export interface SetupOpts {
  enemies?: EnemyId[];
  items?: Partial<Record<HeroId, (ItemId | EquipItem)[]>>;
  relics?: RelicId[];
  upgrades?: UpgradeId[];
  seals?: SealId[];
  hp?: Partial<Record<HeroId, number>>;
  formation?: HeroId[];
  kind?: 'normal' | 'elite' | 'boss';
  seed?: number;
  hpScale?: number;
  dmgScale?: number;
  focusBonus?: number;
  atk?: Partial<Record<HeroId, number>>;
}

export function setup(o: SetupOpts = {}): CombatSetup {
  const run = { level: 1, upgrades: o.upgrades ?? [], runHpBonus: {} };
  const formation = o.formation ?? ['fritz', 'ivo', 'sera'];
  return {
    seed: o.seed ?? 1,
    kind: o.kind ?? 'normal',
    enemies: o.enemies ?? ['nebelgaenger'],
    relics: o.relics ?? [],
    upgrades: o.upgrades ?? [],
    seals: o.seals ?? [],
    mods: [],
    focusBonus: o.focusBonus ?? 0,
    hpScale: o.hpScale ?? 1,
    dmgScale: o.dmgScale ?? 1,
    flags: { courierHelps: false, namesFreed: false },
    heroes: formation.map((id) => {
      const s = heroStats(run, id);
      return { id, hp: o.hp?.[id] ?? s.maxHp, maxHp: s.maxHp, atk: o.atk?.[id] ?? s.atk, heal: s.heal, mult: 1, items: (o.items?.[id] ?? []).map(eq) };
    }),
  };
}

export function sim(o: SetupOpts = {}): CombatSim {
  return new CombatSim(setup(o));
}

export function stepFor(s: CombatSim, seconds: number) {
  const n = Math.round(seconds / 0.05);
  for (let i = 0; i < n && !s.result; i++) s.step();
}
