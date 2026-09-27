// Abgeleitete Werte aus dem Run-Zustand. Nichts davon wird gespeichert.
import { LEVEL } from '../content/balance';
import { HEROES } from '../content/heroes';
import { ITEMS, RELICS } from '../content/items';
import { UPGRADES, UPGRADE_VALUES } from '../content/progression';
import type { BuildTag, HeroId, ItemId, RelicId } from '../content/types';
import { HERO_IDS } from '../content/types';
import type { RunState } from './types';

export interface HeroStats {
  maxHp: number;
  atk: number;
  heal: number;
  mult: number;
}

export function levelMult(level: number): number {
  return 1 + LEVEL.statPerLevel * (level - 1);
}

export function heroStats(run: Pick<RunState, 'level' | 'upgrades' | 'runHpBonus'>, id: HeroId): HeroStats {
  const def = HEROES[id];
  const m = levelMult(run.level);
  const hpBonus = run.runHpBonus[id] ?? 0;
  let heal = def.heal;
  if (id === 'sera' && run.upgrades.includes('behutsameHaende')) heal += UPGRADE_VALUES.behutsameBonus;
  return {
    maxHp: Math.round(def.maxHp * m * (1 + hpBonus)),
    atk: def.atk * m,
    heal: heal * m,
    mult: m,
  };
}

/** Yuumis Anwesenheit wird ausschließlich aus dem ausgerüsteten Relikt abgeleitet. */
export function yuumiPresent(run: Pick<RunState, 'relics'> | null | undefined): boolean {
  return !!run && run.relics.includes('mondgloeckchen');
}

export function equippedItems(run: RunState): ItemId[] {
  const out: ItemId[] = [];
  for (const h of HERO_IDS) for (const i of run.equipment[h]) if (i) out.push(i.id);
  return out;
}

export function equippedRelics(run: RunState): RelicId[] {
  return run.relics.filter((r): r is RelicId => !!r);
}

export function tagCounts(run: RunState): Record<BuildTag, number> {
  const c: Record<BuildTag, number> = { glut: 0, bastion: 0, echo: 0 };
  for (const i of equippedItems(run)) for (const t of ITEMS[i].tags) c[t]++;
  for (const r of equippedRelics(run)) if (r !== 'mondgloeckchen') for (const t of RELICS[r].tags) c[t]++;
  for (const u of run.upgrades) for (const t of UPGRADES[u].tags) c[t]++;
  return c;
}

export function dominantTag(run: RunState): BuildTag | null {
  const c = tagCounts(run);
  let best: BuildTag | null = null;
  let n = 0;
  for (const t of ['glut', 'bastion', 'echo'] as BuildTag[]) {
    if (c[t] > n) {
      n = c[t];
      best = t;
    }
  }
  return best;
}

export function xpForNext(level: number): number | null {
  if (level >= LEVEL.maxLevel) return null;
  return LEVEL.thresholds[level - 1];
}
