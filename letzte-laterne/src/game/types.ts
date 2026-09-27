import type { CombatKind } from '../sim/combat';
import type { EquipItem } from '../content/items';
import type {
  BossId,
  EnemyId,
  EventId,
  ExpeditionId,
  GeneralEventId,
  HeroId,
  ItemId,
  LongNightMod,
  Rarity,
  RelicId,
  SealId,
  StationType,
  UpgradeId,
} from '../content/types';

export const SAVE_VERSION = 2;

export interface Settings {
  sound: boolean;
  volume: number; // 0..1 Gesamtlautstärke
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  voice: boolean; // Sprachausgabe
  autoAdvance: boolean; // Dialoge nach der Sprachzeile automatisch weiterschalten
  animations: boolean;
  defaultSpeed: 1 | 2;
}

export interface LongNightRecord {
  expedition: ExpeditionId;
  mods: LongNightMod[];
  won: boolean;
  seed: number;
}

export interface MetaState {
  light: number;
  lightEarnedTotal: number;
  sealsOwned: SealId[];
  sealsActive: SealId[];
  unlockedExpedition: ExpeditionId; // höchste spielbare Expedition
  bossesDefeated: BossId[];
  discoveredItems: ItemId[];
  discoveredRelics: RelicId[];
  yuumiDiscovered: boolean;
  story: {
    courierSaved: boolean | null;
    namesFreed: boolean | null;
    ending: 'keep' | 'extinguish' | null;
    endingWithYuumi: boolean;
  };
  seenDialogs: string[];
  tutorialsSeen: string[];
  firstEliteLegendaryGiven: boolean;
  catGuaranteeUsed: boolean;
  runsStarted: number;
  runsWon: number;
  longNight: { wins: number; bestMods: number; history: LongNightRecord[] };
}

export interface Station {
  index: number; // 0..7
  type: StationType;
  encounter?: EnemyId[]; // für Kampfstationen
  alt?: { encounter: EnemyId[]; event: GeneralEventId; catGuaranteed: boolean }; // Station 2
}

export type RunPhase = 'map' | 'combat' | 'reward' | 'levelup' | 'event' | 'camp' | 'ending' | 'result';

export type RewardOption = { kind: 'item'; id: ItemId; q: Rarity } | { kind: 'relic'; id: RelicId };

export interface RewardOffer {
  source: 'normal' | 'elite' | 'camp' | 'event';
  title: string;
  options: RewardOption[];
  healAlt: number; // 0 = keine Heilungsalternative
  oddsText: string;
  note?: string;
  catPenalty?: boolean; // Katzenereignis: nächster Kampf −1 Fokus, falls genommen
}

export interface CombatCheckpoint {
  kind: CombatKind;
  encounter: EnemyId[];
  seed: number;
  stationType: StationType;
}

export interface EventState {
  id: EventId;
}

export interface RunStats {
  combatsWon: number;
  damageDealt: Record<string, number>;
  damageTaken: Record<string, number>;
  interrupts: number;
  missedInterrupts: number;
  focusCappedTime: number;
  yuumiDamage: number;
  yuumiShield: number;
  explosions: number;
  echoRepeats: number;
  healing: number;
  shieldAbsorbed: number;
}

export interface CombatAnalysis {
  reasons: string[];
  enemies: string;
}

export interface RunResult {
  outcome: 'victory' | 'defeat' | 'abandoned';
  lightEarned: number;
  lightBreakdown: string[];
  analysis: string[];
  highlights: string[];
  newlyAffordable: SealId[];
  suggestions: string[];
  unlocked: string[];
}

export interface RunState {
  seed: number;
  expedition: ExpeditionId;
  mods: LongNightMod[];
  longNight: boolean;
  seals: SealId[]; // beim Start aktive Siegel (fest für den Run)
  memory: boolean; // nach Storyabschluss: „spielbare Erinnerung“
  stations: Station[];
  station: number; // aktuelle Station 0..7
  route: ('fight' | 'event')[]; // gewählte Route je Station (nur Station 2 relevant)
  phase: RunPhase;
  hp: Record<HeroId, number>;
  formation: HeroId[];
  equipment: Record<HeroId, (EquipItem | null)[]>;
  relics: (RelicId | null)[];
  xp: number;
  level: number;
  upgrades: UpgradeId[];
  pendingLevelUps: number;
  levelOffer: UpgradeId[] | null;
  reward: RewardOffer | null;
  event: EventState | null;
  combat: CombatCheckpoint | null;
  nextFocusBonus: number;
  runFocusBonus: number; // gilt für jeden Kampf dieses Runs (Kapitel 3)
  runHpBonus: Partial<Record<HeroId, number>>; // max-HP-Bonus (Anteil)
  lightEarned: number;
  lightBreakdown: string[];
  stats: RunStats;
  lastCombatAnalysis: string[];
  result: RunResult | null;
  yuumiEverInRun: boolean;
  manualUses: Record<HeroId, number>; // manuelle Fähigkeitseinsätze im Run (Echochronik)
}

export interface SaveData {
  version: number;
  meta: MetaState;
  run: RunState | null;
  settings: Settings;
  dialogQueue: string[];
  notice: string | null; // einmaliger Hinweis (z. B. beschädigter Spielstand)
}
