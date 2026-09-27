// Alle Zustandsübergänge als reine Funktionen SaveData → SaveData.
// Ungültige Aktionen (falsche Phase, doppelte Klicks) geben den Stand unverändert zurück.

import { CAMP, ESCALATION, EXPEDITION_SCALE, LEVEL, LIGHT, REVIVE_RATIO, REWARD, SEALS as SEAL_RULES } from '../content/balance';
import { ENCOUNTERS, ENEMIES, REINFORCEMENTS } from '../content/enemies';
import { RELICS } from '../content/items';
import { SEALS, SEAL_ORDER, UPGRADES } from '../content/progression';
import { DIALOGS, EXPEDITIONS, STORY_EVENT_BY_EXPEDITION } from '../content/story';
import type {
  EnemyId,
  ExpeditionId,
  GeneralEventId,
  HeroId,
  ItemId,
  LongNightMod,
  SealId,
  StationType,
  UpgradeId,
} from '../content/types';
import { HERO_IDS } from '../content/types';
import type { CombatKind, CombatSetup, CombatStats } from '../sim/combat';
import { hashString, newSeed, rngFor } from '../sim/rng';
import { affordableSeals, analyzeDefeat, highlightLines, suggestions } from './analysis';
import { heroStats, yuumiPresent } from './derive';
import { makeCombatReward, makeItemEventOffer, makeLevelOffer, makeRelicOffer } from './rewards';
import { newSave } from './save';
import type { MetaState, RewardOffer, RunResult, RunState, RunStats, SaveData, Station } from './types';

export type Slot = { type: 'hero'; hero: HeroId; idx: number } | { type: 'relic'; idx: number };

const clone = <T>(x: T): T => structuredClone(x);

// ---------------- Dialoge & Hinweise ----------------

export function queueDialog(save: SaveData, id: string) {
  if (!DIALOGS[id]) return;
  if (save.meta.seenDialogs.includes(id) || save.dialogQueue.includes(id)) return;
  save.dialogQueue.push(id);
}

export function dismissDialog(prev: SaveData): SaveData {
  if (!prev.dialogQueue.length) return prev;
  const s = clone(prev);
  const id = s.dialogQueue.shift()!;
  if (!s.meta.seenDialogs.includes(id)) s.meta.seenDialogs.push(id);
  return s;
}

export function markTutorial(prev: SaveData, id: string): SaveData {
  if (prev.meta.tutorialsSeen.includes(id)) return prev;
  const s = clone(prev);
  s.meta.tutorialsSeen.push(id);
  return s;
}

export function clearNotice(prev: SaveData): SaveData {
  if (!prev.notice) return prev;
  return { ...prev, notice: null };
}

export function startNewGame(prev?: SaveData): SaveData {
  const s = newSave();
  if (prev) s.settings = clone(prev.settings);
  s.dialogQueue = ['intro'];
  return s;
}

// ---------------- Siegel ----------------

export function sealPrereq(id: SealId): SealId | null {
  const s = SEALS[id];
  if (s.tier === 1) return null;
  return SEAL_ORDER.find((x) => SEALS[x].branch === s.branch && SEALS[x].tier === s.tier - 1) ?? null;
}

export function canBuySeal(meta: MetaState, id: SealId): { ok: boolean; reason?: string } {
  const s = SEALS[id];
  if (meta.sealsOwned.includes(id)) return { ok: false, reason: 'Bereits geprägt.' };
  const pre = sealPrereq(id);
  if (pre && !meta.sealsOwned.includes(pre)) return { ok: false, reason: `Benötigt zuerst „${SEALS[pre].name}“.` };
  if (meta.light < s.cost) return { ok: false, reason: `Benötigt ${s.cost} Erinnerungslicht (du hast ${meta.light}).` };
  return { ok: true };
}

export function sealLoad(active: SealId[]): number {
  return active.reduce((a, id) => a + SEALS[id].load, 0);
}

export function canActivateSeal(meta: MetaState, id: SealId): { ok: boolean; reason?: string } {
  if (!meta.sealsOwned.includes(id)) return { ok: false, reason: 'Noch nicht geprägt.' };
  if (meta.sealsActive.includes(id)) return { ok: true };
  if (meta.sealsActive.length >= SEAL_RULES.maxActive) return { ok: false, reason: `Höchstens ${SEAL_RULES.maxActive} Siegel gleichzeitig aktiv.` };
  if (sealLoad(meta.sealsActive) + SEALS[id].load > SEAL_RULES.loadBudget)
    return { ok: false, reason: `Belastung zu hoch (${sealLoad(meta.sealsActive)} + ${SEALS[id].load} > ${SEAL_RULES.loadBudget}).` };
  return { ok: true };
}

export function buySeal(prev: SaveData, id: SealId): SaveData {
  if (prev.run || !canBuySeal(prev.meta, id).ok) return prev;
  const s = clone(prev);
  s.meta.light -= SEALS[id].cost;
  s.meta.sealsOwned.push(id);
  if (canActivateSeal(s.meta, id).ok) s.meta.sealsActive.push(id);
  return s;
}

export function toggleSeal(prev: SaveData, id: SealId): SaveData {
  if (prev.run) return prev;
  const s = clone(prev);
  if (s.meta.sealsActive.includes(id)) {
    s.meta.sealsActive = s.meta.sealsActive.filter((x) => x !== id);
    return s;
  }
  if (!canActivateSeal(s.meta, id).ok) return prev;
  s.meta.sealsActive.push(id);
  return s;
}

// ---------------- Run erzeugen ----------------

export interface StartOptions {
  mods?: LongNightMod[];
  bearers?: Partial<Record<ItemId, HeroId>>;
  seed?: number;
  formation?: HeroId[];
}

/** Startgegenstände aus Siegeln kommen in magischer Qualität. */
export const START_ITEM_QUALITY = 'magic' as const;

export const DEFAULT_BEARER: Partial<Record<ItemId, HeroId>> = { zunderring: 'ivo', schildspange: 'fritz', stimmgabel: 'sera' };

export function generateStations(meta: MetaState, expedition: ExpeditionId, seed: number, mods: LongNightMod[]): Station[] {
  const rng = rngFor(seed, 'map');
  const pools = ENCOUNTERS[expedition];
  let reinforceIdx = 0;
  const enc = (list: EnemyId[]): EnemyId[] => {
    const out = list.slice();
    if (mods.includes('reinforced')) out.push(REINFORCEMENTS[reinforceIdx++ % REINFORCEMENTS.length]);
    return out;
  };
  const catGuaranteed = expedition === 1 && !meta.catGuaranteeUsed;
  const generalEvents: GeneralEventId[] = ['brunnen', 'werkstatt', 'wachstube', 'kinderlied', 'haendler', 'miauen'];
  const event: GeneralEventId = catGuaranteed ? 'miauen' : rng.pick(generalEvents);
  return [
    { index: 0, type: 'fight', encounter: enc(rng.pick(pools.easy)) },
    { index: 1, type: 'choice', alt: { encounter: enc(rng.pick(pools.normal)), event, catGuaranteed } },
    { index: 2, type: 'fight', encounter: enc(rng.pick(pools.normal)) },
    { index: 3, type: 'story' },
    { index: 4, type: 'elite', encounter: enc(rng.pick(pools.elite)) },
    { index: 5, type: 'camp' },
    { index: 6, type: 'hardFight', encounter: enc(rng.pick(pools.hard)) },
    { index: 7, type: 'boss', encounter: enc([...pools.boss]) },
  ];
}

function emptyStats(): RunStats {
  return {
    combatsWon: 0,
    damageDealt: {},
    damageTaken: {},
    interrupts: 0,
    missedInterrupts: 0,
    focusCappedTime: 0,
    yuumiDamage: 0,
    yuumiShield: 0,
    explosions: 0,
    echoRepeats: 0,
    healing: 0,
    shieldAbsorbed: 0,
  };
}

export function canStartExpedition(meta: MetaState, expedition: ExpeditionId, mods: LongNightMod[]): { ok: boolean; reason?: string } {
  if (expedition > meta.unlockedExpedition) return { ok: false, reason: 'Noch nicht freigeschaltet – besiege den vorherigen Gebietsboss.' };
  if (mods.length && !meta.story.ending) return { ok: false, reason: '„Die lange Nacht“ wird nach dem Storyabschluss freigeschaltet.' };
  return { ok: true };
}

export function startRun(prev: SaveData, expedition: ExpeditionId, opts: StartOptions = {}): SaveData {
  const mods = [...new Set(opts.mods ?? [])];
  if (prev.run || !canStartExpedition(prev.meta, expedition, mods).ok) return prev;
  const s = clone(prev);
  const seed = opts.seed ?? newSeed();
  const seals = s.meta.sealsActive.slice();
  const run: RunState = {
    seed,
    expedition,
    mods,
    longNight: mods.length > 0,
    seals,
    memory: s.meta.story.ending !== null,
    stations: generateStations(s.meta, expedition, seed, mods),
    station: 0,
    route: [],
    phase: 'map',
    hp: { fritz: 0, ivo: 0, sera: 0 },
    formation: opts.formation && opts.formation.length === 3 ? opts.formation.slice() : ['fritz', 'ivo', 'sera'],
    equipment: { fritz: [null, null], ivo: [null, null], sera: [null, null] },
    relics: [null, null],
    xp: 0,
    level: 1,
    upgrades: [],
    pendingLevelUps: 0,
    levelOffer: null,
    reward: null,
    event: null,
    combat: null,
    nextFocusBonus: 0,
    runFocusBonus: 0,
    runHpBonus: {},
    lightEarned: 0,
    lightBreakdown: [],
    stats: emptyStats(),
    lastCombatAnalysis: [],
    result: null,
    yuumiEverInRun: false,
    manualUses: { fritz: 0, ivo: 0, sera: 0 },
  };
  for (const h of HERO_IDS) run.hp[h] = heroStats(run, h).maxHp;
  // Startgegenstände aus aktiven Siegeln
  for (const id of seals) {
    const item = SEALS[id].startItem;
    if (!item) continue;
    const bearer = opts.bearers?.[item] ?? DEFAULT_BEARER[item] ?? 'fritz';
    const slots = run.equipment[bearer];
    const free = slots.indexOf(null);
    if (free >= 0) slots[free] = { id: item, q: START_ITEM_QUALITY };
    else {
      const other = HERO_IDS.find((h) => run.equipment[h].includes(null));
      if (other) run.equipment[other][run.equipment[other].indexOf(null)] = { id: item, q: START_ITEM_QUALITY };
    }
    if (!s.meta.discoveredItems.includes(item)) s.meta.discoveredItems.push(item);
  }
  s.run = run;
  s.meta.runsStarted++;
  queueDialog(s, `exp${expedition}_start`);
  if (run.memory) queueDialog(s, 'memory_run');
  return s;
}

// ---------------- Karte & Stationen ----------------

export function setFormation(prev: SaveData, formation: HeroId[]): SaveData {
  const r = prev.run;
  if (!r || (r.phase !== 'map' && r.phase !== 'combat')) return prev;
  if (formation.length !== 3 || !HERO_IDS.every((h) => formation.includes(h))) return prev;
  const s = clone(prev);
  s.run!.formation = formation.slice();
  return s;
}

function combatSeed(run: RunState): number {
  return hashString(`${run.seed}|combat|${run.station}`);
}

function startCombat(run: RunState, kind: CombatKind, encounter: EnemyId[], stationType: StationType) {
  run.combat = { kind, encounter: encounter.slice(), seed: combatSeed(run), stationType };
  run.phase = 'combat';
}

export function enterStation(prev: SaveData, route?: 'fight' | 'event'): SaveData {
  const r = prev.run;
  if (!r || r.phase !== 'map') return prev;
  const st = r.stations[r.station];
  if (st.type === 'choice' && !route) return prev;
  const s = clone(prev);
  const run = s.run!;
  switch (st.type) {
    case 'fight':
      startCombat(run, 'normal', st.encounter!, 'fight');
      break;
    case 'hardFight':
      startCombat(run, 'normal', st.encounter!, 'hardFight');
      break;
    case 'elite':
      startCombat(run, 'elite', st.encounter!, 'elite');
      break;
    case 'boss':
      startCombat(run, 'boss', st.encounter!, 'boss');
      queueDialog(s, `boss${run.expedition}_pre`);
      break;
    case 'choice': {
      run.route[run.station] = route!;
      if (st.alt!.catGuaranteed) s.meta.catGuaranteeUsed = true;
      if (route === 'fight') startCombat(run, 'normal', st.alt!.encounter, 'fight');
      else {
        run.event = { id: st.alt!.event };
        run.phase = 'event';
      }
      break;
    }
    case 'story':
      run.event = { id: STORY_EVENT_BY_EXPEDITION[run.expedition] };
      run.phase = 'event';
      break;
    case 'camp':
      run.phase = 'camp';
      break;
  }
  return s;
}

export function buildCombatSetup(save: SaveData): CombatSetup | null {
  const run = save.run;
  if (!run || run.phase !== 'combat' || !run.combat) return null;
  const cp = run.combat;
  const scale = EXPEDITION_SCALE[run.expedition];
  return {
    seed: cp.seed,
    kind: cp.kind,
    heroes: run.formation.map((id) => {
      const st = heroStats(run, id);
      return {
        id,
        hp: run.hp[id],
        maxHp: st.maxHp,
        atk: st.atk,
        heal: st.heal,
        mult: st.mult,
        items: run.equipment[id].filter((i): i is NonNullable<typeof i> => !!i),
      };
    }),
    enemies: cp.encounter,
    relics: run.relics.filter((x): x is NonNullable<typeof x> => !!x),
    upgrades: run.upgrades.slice(),
    seals: run.seals.slice(),
    hpScale: scale.hp,
    dmgScale: scale.dmg,
    focusBonus: run.nextFocusBonus + run.runFocusBonus,
    mods: run.mods.slice(),
    manualUsesStart: { ...(run.manualUses ?? {}) },
    flags: {
      courierHelps: cp.kind === 'boss' && run.expedition === 2 && save.meta.story.courierSaved === true,
      namesFreed: cp.kind === 'boss' && run.expedition === 3 && save.meta.story.namesFreed === true,
    },
  };
}

// ---------------- Kampfende ----------------

export interface CombatOutcome {
  result: 'victory' | 'defeat';
  heroHp: Record<HeroId, number>;
  manualUses?: Record<HeroId, number>;
  stats: CombatStats;
  enemiesAlive: { name: string; hpPct: number; role: string }[];
}

function addXp(run: RunState, n: number) {
  run.xp += n;
  while (run.level < LEVEL.maxLevel && run.xp >= LEVEL.thresholds[run.level - 1]) {
    const before = HERO_IDS.map((h) => heroStats(run, h).maxHp);
    run.level++;
    run.pendingLevelUps++;
    HERO_IDS.forEach((h, i) => {
      if (run.hp[h] > 0) run.hp[h] += heroStats(run, h).maxHp - before[i];
    });
  }
}

function mergeStats(run: RunState, st: CombatStats) {
  const t = run.stats;
  for (const [k, v] of Object.entries(st.damageDealt)) t.damageDealt[k] = (t.damageDealt[k] ?? 0) + v;
  for (const [k, v] of Object.entries(st.damageTaken)) t.damageTaken[k] = (t.damageTaken[k] ?? 0) + v;
  t.interrupts += st.interrupts;
  t.focusCappedTime += st.focusCappedTime;
  t.yuumiDamage += st.yuumiDamage;
  t.yuumiShield += st.yuumiShield;
  t.explosions += st.explosions;
  t.echoRepeats += st.echoRepeats;
  t.healing += st.healing;
  t.shieldAbsorbed += st.shieldAbsorbed;
  for (const sp of Object.values(st.specials)) if (sp.interruptible) t.missedInterrupts += sp.hits;
}

function earnLight(s: SaveData, n: number, why: string) {
  if (n <= 0) return;
  s.meta.light += n;
  s.meta.lightEarnedTotal += n;
  s.run!.lightEarned += n;
  s.run!.lightBreakdown.push(`+${n} ${why}`);
}

export function combatFinished(prev: SaveData, outcome: CombatOutcome): SaveData {
  const r = prev.run;
  if (!r || r.phase !== 'combat' || !r.combat) return prev;
  const s = clone(prev);
  const run = s.run!;
  const cp = run.combat!;
  const startHpPct =
    HERO_IDS.reduce((a, h) => a + run.hp[h], 0) / HERO_IDS.reduce((a, h) => a + heroStats(run, h).maxHp, 0);
  mergeStats(run, outcome.stats);
  run.nextFocusBonus = 0;

  if (outcome.result === 'defeat') {
    for (const h of HERO_IDS) run.hp[h] = 0;
    run.lastCombatAnalysis = analyzeDefeat(outcome.stats, { enemiesAlive: outcome.enemiesAlive, startHpPct });
    run.combat = null;
    if (run.longNight) recordLongNight(s, false);
    finishRun(s, 'defeat', []);
    return s;
  }

  for (const h of HERO_IDS) run.hp[h] = Math.max(0, outcome.heroHp[h]);
  if (outcome.manualUses) run.manualUses = { ...outcome.manualUses };
  run.stats.combatsWon++;
  const xpKey = cp.stationType === 'hardFight' ? 'hardFight' : cp.kind === 'elite' ? 'elite' : cp.kind === 'boss' ? 'boss' : 'fight';
  addXp(run, LEVEL.xp[xpKey]);
  for (const h of HERO_IDS) {
    if (run.hp[h] <= 0) run.hp[h] = Math.max(1, Math.round(heroStats(run, h).maxHp * REVIVE_RATIO));
    run.hp[h] = Math.min(run.hp[h], heroStats(run, h).maxHp);
  }
  run.combat = null;
  if (yuumiPresent(run)) run.yuumiEverInRun = true;

  if (cp.kind === 'boss') {
    bossVictory(s);
    return s;
  }
  earnLight(s, cp.kind === 'elite' ? LIGHT.elite : LIGHT.fight, cp.kind === 'elite' ? 'Elitekampf gewonnen' : 'Kampf gewonnen');
  run.reward = makeCombatReward(run, s.meta, cp.kind === 'elite' ? 'elite' : 'normal');
  run.phase = 'reward';
  return s;
}

function recordLongNight(s: SaveData, won: boolean) {
  const run = s.run!;
  s.meta.longNight.history.unshift({ expedition: run.expedition, mods: run.mods.slice(), won, seed: run.seed });
  s.meta.longNight.history = s.meta.longNight.history.slice(0, 20);
  if (won) {
    s.meta.longNight.wins++;
    s.meta.longNight.bestMods = Math.max(s.meta.longNight.bestMods, run.mods.length);
  }
}

function bossVictory(s: SaveData) {
  const run = s.run!;
  const exp = EXPEDITIONS[run.expedition];
  const unlocked: string[] = [];
  earnLight(s, LIGHT.boss, `${ENEMIES[exp.boss].name} besiegt`);
  if (!s.meta.bossesDefeated.includes(exp.boss)) {
    s.meta.bossesDefeated.push(exp.boss);
    earnLight(s, LIGHT.firstBossBonus, 'Erster Sieg über diesen Boss');
  }
  if (run.longNight) {
    earnLight(s, LIGHT.longNightPerMod * run.mods.length, `Lange Nacht (${run.mods.length} Modifikator${run.mods.length === 1 ? '' : 'en'})`);
    recordLongNight(s, true);
  }
  if (run.expedition < 3 && s.meta.unlockedExpedition <= run.expedition) {
    s.meta.unlockedExpedition = (run.expedition + 1) as ExpeditionId;
    unlocked.push(`Neue Expedition: ${EXPEDITIONS[(run.expedition + 1) as ExpeditionId].name}`);
  }
  s.meta.runsWon++;
  queueDialog(s, `boss${run.expedition}_after`);
  if (run.expedition === 3 && !s.meta.story.ending) {
    run.phase = 'ending';
    return;
  }
  finishRun(s, 'victory', unlocked);
}

export function chooseEnding(prev: SaveData, ending: 'keep' | 'extinguish'): SaveData {
  const r = prev.run;
  if (!r || r.phase !== 'ending') return prev;
  const s = clone(prev);
  s.meta.story.ending = ending;
  s.meta.story.endingWithYuumi = yuumiPresent(s.run);
  queueDialog(s, `ending_${ending}`);
  finishRun(s, 'victory', ['Die Geschichte ist abgeschlossen.', 'Neu: „Die lange Nacht“ – Expeditionen mit wählbaren Modifikatoren.']);
  return s;
}

function finishRun(s: SaveData, outcome: RunResult['outcome'], unlocked: string[]) {
  const run = s.run!;
  const result: RunResult = {
    outcome,
    lightEarned: run.lightEarned,
    lightBreakdown: run.lightBreakdown.slice(),
    analysis: outcome === 'defeat' ? run.lastCombatAnalysis.slice() : [],
    highlights: highlightLines(run),
    newlyAffordable: affordableSeals(s.meta),
    suggestions: suggestions(s.meta, run),
    unlocked,
  };
  if (outcome === 'abandoned') result.analysis = ['Du hast die Expedition abgebrochen. Bereits verdientes Erinnerungslicht bleibt erhalten.'];
  run.result = result;
  run.phase = 'result';
  run.reward = null;
  run.event = null;
  run.levelOffer = null;
}

export function abandonRun(prev: SaveData): SaveData {
  const r = prev.run;
  if (!r || r.phase === 'result' || r.phase === 'ending') return prev;
  const s = clone(prev);
  s.run!.combat = null;
  if (s.run!.longNight) recordLongNight(s, false);
  finishRun(s, 'abandoned', []);
  return s;
}

export function closeResult(prev: SaveData): SaveData {
  const r = prev.run;
  if (!r || r.phase !== 'result') return prev;
  const s = clone(prev);
  if (r.result?.outcome === 'defeat') queueDialog(s, 'first_defeat');
  s.run = null;
  return s;
}

// ---------------- Weiter nach Entscheidungen ----------------

function advance(run: RunState) {
  run.reward = null;
  run.event = null;
  if (run.pendingLevelUps > 0) {
    run.levelOffer = makeLevelOffer(run);
    run.phase = 'levelup';
    return;
  }
  run.levelOffer = null;
  run.station = Math.min(7, run.station + 1);
  run.phase = 'map';
}

function healPct(run: RunState, pct: number) {
  for (const h of HERO_IDS) {
    const max = heroStats(run, h).maxHp;
    if (run.hp[h] > 0) run.hp[h] = Math.min(max, run.hp[h] + Math.round(max * pct));
  }
}

function hurtPct(run: RunState, pct: number) {
  for (const h of HERO_IDS) {
    const max = heroStats(run, h).maxHp;
    if (run.hp[h] > 0) run.hp[h] = Math.max(1, run.hp[h] - Math.round(max * pct));
  }
}

export function chooseUpgrade(prev: SaveData, id: UpgradeId): SaveData {
  const r = prev.run;
  if (!r || r.phase !== 'levelup' || !r.levelOffer?.includes(id) || r.upgrades.includes(id)) return prev;
  const s = clone(prev);
  const run = s.run!;
  const before = HERO_IDS.map((h) => heroStats(run, h).maxHp);
  run.upgrades.push(id);
  HERO_IDS.forEach((h, i) => (run.hp[h] += heroStats(run, h).maxHp - before[i]));
  run.pendingLevelUps--;
  run.levelOffer = null;
  advance(run);
  return s;
}

export function slotCompatible(offerKind: 'item' | 'relic', slot: Slot): boolean {
  return offerKind === 'item' ? slot.type === 'hero' : slot.type === 'relic';
}

export function chooseReward(prev: SaveData, optionIndex: number, slot: Slot): SaveData {
  const r = prev.run;
  if (!r || r.phase !== 'reward' || !r.reward) return prev;
  const opt = r.reward.options[optionIndex];
  if (!opt || !slotCompatible(opt.kind, slot)) return prev;
  const s = clone(prev);
  const run = s.run!;
  if (opt.kind === 'item' && slot.type === 'hero') {
    if (slot.idx < 0 || slot.idx > 1) return prev;
    run.equipment[slot.hero][slot.idx] = { id: opt.id, q: opt.q };
  } else if (opt.kind === 'relic' && slot.type === 'relic') {
    if (slot.idx < 0 || slot.idx > 1) return prev;
    if (run.relics.some((x, i) => x === opt.id && i !== slot.idx)) return prev; // einzigartig
    run.relics[slot.idx] = opt.id;
    if (opt.id === 'mondgloeckchen') onYuumiJoined(s, !!r.reward.catPenalty);
  }
  advance(run);
  return s;
}

function onYuumiJoined(s: SaveData, catPenalty: boolean) {
  const run = s.run!;
  run.yuumiEverInRun = true;
  s.meta.yuumiDiscovered = true;
  if (!s.meta.discoveredRelics.includes('mondgloeckchen')) s.meta.discoveredRelics.push('mondgloeckchen');
  if (catPenalty) run.nextFocusBonus -= 1;
  queueDialog(s, 'cat_join');
}

export function declineReward(prev: SaveData, takeHeal: boolean): SaveData {
  const r = prev.run;
  if (!r || r.phase !== 'reward' || !r.reward) return prev;
  const s = clone(prev);
  const run = s.run!;
  if (takeHeal && run.reward!.healAlt > 0) healPct(run, run.reward!.healAlt);
  advance(run);
  return s;
}

export function campChoice(prev: SaveData, choice: 'heal' | 'loot'): SaveData {
  const r = prev.run;
  if (!r || r.phase !== 'camp') return prev;
  const s = clone(prev);
  const run = s.run!;
  if (choice === 'heal') {
    healPct(run, run.mods.includes('meagerCamp') ? CAMP.meagerHealPct : CAMP.healPct);
    advance(run);
  } else {
    run.reward = makeCombatReward(run, s.meta, 'camp');
    run.phase = 'reward';
  }
  return s;
}

export function chooseEventOption(prev: SaveData, idx: number): SaveData {
  const r = prev.run;
  if (!r || r.phase !== 'event' || !r.event) return prev;
  if (idx !== 0 && idx !== 1) return prev;
  const s = clone(prev);
  const run = s.run!;
  const meta = s.meta;
  const id = run.event!.id;
  const seenKey = `event:${id}`;
  if (!meta.seenDialogs.includes(seenKey)) meta.seenDialogs.push(seenKey);
  addXp(run, LEVEL.xp.event);
  const key = `${id}:${idx}`;
  const toOffer = (offer: RewardOffer) => {
    run.event = null;
    if (!offer.options.length) {
      advance(run);
      return;
    }
    run.reward = offer;
    run.phase = 'reward';
  };

  switch (key) {
    case 'miauen:0': {
      meta.yuumiDiscovered = true;
      if (!meta.discoveredRelics.includes('mondgloeckchen')) meta.discoveredRelics.push('mondgloeckchen');
      if (run.relics.includes('mondgloeckchen')) {
        advance(run);
        break;
      }
      const free = run.relics.indexOf(null);
      if (free >= 0) {
        run.relics[free] = 'mondgloeckchen';
        onYuumiJoined(s, true);
        advance(run);
      } else {
        toOffer({
          source: 'event',
          title: 'Yuumis Mondglöckchen',
          options: [{ kind: 'relic', id: 'mondgloeckchen' }],
          healAlt: 0,
          oddsText: 'Feste Belohnung aus dem Ereignis.',
          note: 'Beide Reliktplätze sind belegt. Ersetze ein Relikt, um Yuumi mitzunehmen – oder lehne ab (dann entfällt auch der Fokusnachteil).',
          catPenalty: true,
        });
      }
      break;
    }
    case 'miauen:1':
      meta.yuumiDiscovered = true;
      healPct(run, 0.12);
      queueDialog(s, 'cat_rest');
      advance(run);
      break;
    case 'brunnen:0':
      healPct(run, 0.25);
      advance(run);
      break;
    case 'brunnen:1':
      hurtPct(run, 0.1);
      toOffer(makeRelicOffer(run, meta, 'brunnen'));
      break;
    case 'werkstatt:0':
      addXp(run, 12);
      advance(run);
      break;
    case 'werkstatt:1':
      toOffer(makeItemEventOffer(run, meta, 'werkstatt', 3, REWARD.workshopOdds, 'glut'));
      break;
    case 'wachstube:0':
      toOffer(makeRelicOffer(run, meta, 'wachstube', 'wappen'));
      break;
    case 'wachstube:1':
      healPct(run, 0.15);
      run.nextFocusBonus += 1;
      advance(run);
      break;
    case 'kinderlied:0':
      healPct(run, 0.2);
      run.nextFocusBonus += 1;
      advance(run);
      break;
    case 'kinderlied:1':
      toOffer(makeRelicOffer(run, meta, 'kinderlied', 'chor'));
      break;
    case 'haendler:0':
      hurtPct(run, 0.15);
      toOffer(makeItemEventOffer(run, meta, 'haendler', 2, REWARD.merchantOdds));
      break;
    case 'haendler:1':
      addXp(run, 5);
      advance(run);
      break;
    case 'botin:0':
      hurtPct(run, 0.15);
      meta.story.courierSaved = true;
      advance(run);
      break;
    case 'botin:1':
      healPct(run, 0.25);
      if (meta.story.courierSaved !== true) meta.story.courierSaved = false;
      toOffer(makeItemEventOffer(run, meta, 'botin', 3, REWARD.normalOdds));
      break;
    case 'register:0':
      healPct(run, 0.3);
      meta.story.namesFreed = true;
      advance(run);
      break;
    case 'register:1':
      if (meta.story.namesFreed !== true) meta.story.namesFreed = false;
      toOffer(makeRelicOffer(run, meta, 'register'));
      break;
    case 'flamme:0': {
      run.runHpBonus.fritz = 0.25;
      for (const h of HERO_IDS) run.hp[h] = heroStats(run, h).maxHp;
      advance(run);
      break;
    }
    case 'flamme:1':
      run.runFocusBonus += 1;
      healPct(run, 0.3);
      advance(run);
      break;
    default:
      return prev;
  }
  return s;
}

// ---------------- Ausrüstung außerhalb des Kampfes ----------------

const EDIT_PHASES = ['map', 'reward', 'levelup', 'camp', 'event'];

export function canEditEquipment(run: RunState | null): boolean {
  return !!run && EDIT_PHASES.includes(run.phase);
}

export function moveItem(prev: SaveData, from: Slot, to: Slot): SaveData {
  const r = prev.run;
  if (!canEditEquipment(r) || from.type !== 'hero' || to.type !== 'hero') return prev;
  const s = clone(prev);
  const eq = s.run!.equipment;
  const a = eq[from.hero][from.idx];
  eq[from.hero][from.idx] = eq[to.hero][to.idx];
  eq[to.hero][to.idx] = a;
  return s;
}

export function discardItem(prev: SaveData, slot: Slot): SaveData {
  if (!canEditEquipment(prev.run) || slot.type !== 'hero') return prev;
  const s = clone(prev);
  s.run!.equipment[slot.hero][slot.idx] = null;
  return s;
}

export function discardRelic(prev: SaveData, idx: number): SaveData {
  if (!canEditEquipment(prev.run) || idx < 0 || idx > 1) return prev;
  const s = clone(prev);
  s.run!.relics[idx] = null; // Yuumi verschwindet automatisch, wenn es ihr Glöckchen war
  return s;
}

export function updateSettings(prev: SaveData, patch: Partial<SaveData['settings']>): SaveData {
  return { ...prev, settings: { ...prev.settings, ...patch } };
}

export function escalationTimeFor(kind: CombatKind): number {
  return ESCALATION[kind];
}

export const RELIC_NAMES = Object.fromEntries(Object.entries(RELICS).map(([k, v]) => [k, v.name]));
export const UPGRADE_LIST = UPGRADES;

export function canBuySealAny(meta: MetaState): boolean {
  return SEAL_ORDER.some((id) => canBuySeal(meta, id).ok);
}
