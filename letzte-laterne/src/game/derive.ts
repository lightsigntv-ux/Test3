// Abgeleitete Werte aus dem Run-Zustand. Nichts davon wird gespeichert.
import { LEVEL } from '../content/balance';
import { ARCHETYPES, ATTRS, DEFAULT_ARCHETYPE, emptyAttrs } from '../content/builds';
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
  mult: number; // Faktor für Fähigkeiten (Level × Stärke)
  interval: number;
  armor: number; // Anteil weniger Schaden
  dodge: number; // Ausweichchance
}

export function levelMult(level: number): number {
  return 1 + LEVEL.statPerLevel * (level - 1);
}

type StatRun = Pick<RunState, 'level' | 'upgrades' | 'runHpBonus'> & Partial<Pick<RunState, 'archetype' | 'attrs'>>;

export function heroStats(run: StatRun, id: HeroId): HeroStats {
  const def = HEROES[id];
  const arch = ARCHETYPES[run.archetype?.[id] ?? DEFAULT_ARCHETYPE[id]];
  const a = run.attrs?.[id] ?? emptyAttrs();
  const lm = levelMult(run.level);
  const str = 1 + ATTRS.str.per * a.str;
  const m = lm * str;
  const hpBonus = run.runHpBonus[id] ?? 0;
  let heal = def.heal;
  if (id === 'sera' && run.upgrades.includes('behutsameHaende')) heal += UPGRADE_VALUES.behutsameBonus;
  return {
    maxHp: Math.round(def.maxHp * arch.hpMult * lm * (1 + ATTRS.vit.per * a.vit) * (1 + hpBonus)),
    atk: def.atk * arch.atkMult * m,
    heal: heal * m,
    mult: m,
    interval: Math.max(0.6, def.interval * arch.intervalMult * (1 - ATTRS.spd.per * a.spd)),
    armor: Math.min(0.5, ATTRS.arm.per * a.arm),
    dodge: Math.min(0.4, ATTRS.eva.per * a.eva),
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
