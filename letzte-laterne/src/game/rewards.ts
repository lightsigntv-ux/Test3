import { REWARD } from '../content/balance';
import { ITEMS, NORMAL_ITEMS, RELICS, UNIQUE_ITEMS } from '../content/items';
import { UPGRADES } from '../content/progression';
import type { BuildTag, ItemId, Rarity, RelicId, UpgradeId } from '../content/types';
import { RARITY_ORDER } from '../content/types';
import { rngFor, type Rng } from '../sim/rng';
import { dominantTag, equippedRelics } from './derive';
import type { MetaState, RewardOffer, RewardOption, RunState } from './types';

export type Odds = Record<Rarity, number>;

const ALL_RELICS = Object.keys(RELICS) as RelicId[];

export function adjustedOdds(base: Odds, run: RunState): Odds {
  if (!run.mods.includes('meagerCamp')) return base;
  const bonus = REWARD.longNightLegendaryBonus;
  const fromCommon = Math.min(base.common, bonus);
  const fromMagic = Math.min(base.magic, bonus - fromCommon);
  return {
    common: base.common - fromCommon,
    magic: base.magic - fromMagic,
    rare: base.rare - (bonus - fromCommon - fromMagic),
    legendary: base.legendary + bonus,
  };
}

export function oddsText(o: Odds): string {
  const p = (x: number) => `${Math.round(x * 1000) / 10} %`.replace('.', ',');
  return `Gewöhnlich ${p(o.common)} · Magisch ${p(o.magic)} · Selten ${p(o.rare)} · Legendär ${p(o.legendary)}`;
}

export function rollRarity(rng: Rng, o: Odds): Rarity {
  const r = rng.next();
  if (r < o.legendary) return 'legendary';
  if (r < o.legendary + o.rare) return 'rare';
  if (r < o.legendary + o.rare + o.magic) return 'magic';
  return 'common';
}

function atLeast(q: Rarity, min: Rarity): Rarity {
  return RARITY_ORDER.indexOf(q) < RARITY_ORDER.indexOf(min) ? min : q;
}

/** Zieht ein Exemplar der Stufe q. Legendär = eines der Einzelstücke; sonst ein normaler Gegenstand. */
function pickItem(rng: Rng, q: Rarity, exclude: Set<ItemId>, tag?: BuildTag): RewardOption | null {
  const poolFor = (legendary: boolean) =>
    (legendary ? UNIQUE_ITEMS : NORMAL_ITEMS).filter((i) => !exclude.has(i) && (!tag || ITEMS[i].tags.includes(tag)));
  let pool = poolFor(q === 'legendary');
  if (!pool.length && q === 'legendary') {
    pool = poolFor(false);
    q = 'rare';
  }
  if (!pool.length) return null;
  return { kind: 'item', id: rng.pick(pool), q };
}

export function relicPool(run: RunState, exclude: Set<RelicId> = new Set()): RelicId[] {
  const eq = new Set(equippedRelics(run));
  return ALL_RELICS.filter((r) => !eq.has(r) && !exclude.has(r));
}

/** Stellt sicher, dass mindestens eine Option zur dominanten Build-Richtung passt. */
function ensureBuildFit(run: RunState, rng: Rng, options: RewardOption[], fixedFirst: boolean) {
  const tag = dominantTag(run);
  if (!tag) return;
  const fits = options.some((o) => (o.kind === 'item' ? ITEMS[o.id].tags : RELICS[o.id].tags).includes(tag));
  if (fits) return;
  // letzte Gegenstandsoption (nicht die garantierte erste) aus der passenden Richtung neu ziehen
  for (let i = options.length - 1; i >= (fixedFirst ? 1 : 0); i--) {
    const o = options[i];
    if (o.kind !== 'item') continue;
    const exclude = new Set(options.filter((x) => x.kind === 'item').map((x) => x.id as ItemId));
    const repl = pickItem(rng, o.q, exclude, tag);
    if (repl) {
      options[i] = repl;
      return;
    }
  }
}

function discover(meta: MetaState, options: RewardOption[]) {
  for (const o of options) {
    if (o.kind === 'item' && !meta.discoveredItems.includes(o.id)) meta.discoveredItems.push(o.id);
    if (o.kind === 'relic' && !meta.discoveredRelics.includes(o.id)) meta.discoveredRelics.push(o.id);
    if (o.kind === 'relic' && o.id === 'mondgloeckchen') meta.yuumiDiscovered = true;
  }
}

/** Erzeugt ein Belohnungsangebot. Verändert meta (Entdeckungen, Erstfund-Bonus). */
export function makeCombatReward(run: RunState, meta: MetaState, source: 'normal' | 'elite' | 'camp'): RewardOffer {
  const rng = rngFor(run.seed, 'reward', source, run.station);
  const options: RewardOption[] = [];
  const used = new Set<ItemId>();
  let note: string | undefined;
  let text: string;

  const addItem = (rarity: Rarity, tag?: BuildTag) => {
    const opt = pickItem(rng, rarity, used, tag);
    if (opt) {
      used.add(opt.id as ItemId);
      options.push(opt);
    }
  };

  if (source === 'normal') {
    const o = adjustedOdds(REWARD.normalOdds, run);
    for (let i = 0; i < 3; i++) addItem(rollRarity(rng, o));
    ensureBuildFit(run, rng, options, false);
    text = oddsText(o);
  } else if (source === 'camp') {
    const o = adjustedOdds(REWARD.campOdds, run);
    for (let i = 0; i < 3; i++) addItem(rollRarity(rng, o));
    ensureBuildFit(run, rng, options, false);
    text = oddsText(o);
  } else {
    const o = adjustedOdds(REWARD.eliteOdds, run);
    let first = rollRarity(rng, o);
    first = atLeast(first, 'rare');
    if (!meta.firstEliteLegendaryGiven) {
      first = 'legendary';
      meta.firstEliteLegendaryGiven = true;
      note = 'Erster Elite-Sieg: Eine legendäre Option ist garantiert – probiere sie gleich in diesem Run aus!';
    }
    addItem(first);
    addItem(rollRarity(rng, o));
    const relics = relicPool(run);
    const relicChance = REWARD.eliteRelicChance + (run.mods.includes('meagerCamp') ? 0.2 : 0);
    if (relics.length && rng.next() < relicChance) options.push({ kind: 'relic', id: rng.pick(relics) });
    else addItem(rollRarity(rng, o));
    ensureBuildFit(run, rng, options, true);
    text = `${oddsText(o)} · Option 1 mindestens Selten · Option 3 zu ${Math.round(relicChance * 100)} % ein Relikt`;
  }

  discover(meta, options);
  const healAlt = source === 'normal' ? REWARD.healAlternativePct : 0;
  const titles = { normal: 'Beute', elite: 'Elitebeute', camp: 'Zusätzliche Ausrüstung' };
  return { source, title: titles[source], options, healAlt, oddsText: text, note };
}

export function makeRelicOffer(run: RunState, meta: MetaState, key: string, featured?: RelicId): RewardOffer {
  const rng = rngFor(run.seed, 'relicOffer', key, run.station);
  const pool = relicPool(run);
  const options: RewardOption[] = [];
  if (featured && pool.includes(featured)) options.push({ kind: 'relic', id: featured });
  const rest = rng.shuffle(pool.filter((r) => !options.some((o) => o.id === r)));
  while (options.length < 2 && rest.length) options.push({ kind: 'relic', id: rest.shift()! });
  discover(meta, options);
  return {
    source: 'event',
    title: 'Relikt wählen',
    options,
    healAlt: 0,
    oddsText: featured ? 'Eine feste Option, eine zufällige aus allen nicht ausgerüsteten Relikten.' : 'Zufällig aus allen nicht ausgerüsteten Relikten.',
  };
}

export function makeItemEventOffer(
  run: RunState,
  meta: MetaState,
  key: string,
  count: number,
  odds: Odds,
  tag?: BuildTag,
): RewardOffer {
  const rng = rngFor(run.seed, 'itemEvent', key, run.station);
  const used = new Set<ItemId>();
  const options: RewardOption[] = [];
  for (let i = 0; i < count; i++) {
    const opt = pickItem(rng, rollRarity(rng, odds), used, i === 0 ? tag : undefined);
    if (opt) {
      used.add(opt.id as ItemId);
      options.push(opt);
    }
  }
  discover(meta, options);
  return { source: 'event', title: 'Gegenstand wählen', options, healAlt: 0, oddsText: oddsText(odds) };
}

export function makeLevelOffer(run: RunState): UpgradeId[] {
  const rng = rngFor(run.seed, 'level', run.level, run.upgrades.length);
  const pool = (Object.keys(UPGRADES) as UpgradeId[]).filter((u) => {
    const d = UPGRADES[u];
    return !run.upgrades.includes(u) && (!d.archetypes || !run.archetype || d.archetypes.includes(run.archetype[d.hero]));
  });
  // möglichst je Held eine Option
  const byHero = ['fritz', 'ivo', 'sera'].map((h) => rng.shuffle(pool.filter((u) => UPGRADES[u].hero === h)));
  const out: UpgradeId[] = [];
  for (const list of byHero) if (list.length) out.push(list[0]);
  const rest = rng.shuffle(pool.filter((u) => !out.includes(u)));
  while (out.length < 3 && rest.length) out.push(rest.shift()!);
  return out.slice(0, 3);
}
