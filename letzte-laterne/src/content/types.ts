export type HeroId = 'fritz' | 'ivo' | 'sera';
export const HERO_IDS: HeroId[] = ['fritz', 'ivo', 'sera'];

export type BuildTag = 'glut' | 'bastion' | 'echo';
export type Rarity = 'common' | 'rare' | 'legendary';

export type ItemId =
  | 'zunderring'
  | 'schildspange'
  | 'stimmgabel'
  | 'funkenfaenger'
  | 'ascheglas'
  | 'dornenschild'
  | 'sanftesLeinen'
  | 'taktgeber'
  | 'resonanzkristall'
  | 'glutherz'
  | 'eidDesBollwerks'
  | 'echochronik';

export type RelicId =
  | 'docht'
  | 'aschekompass'
  | 'wappen'
  | 'glocke'
  | 'taschenuhr'
  | 'chor'
  | 'mondgloeckchen';

export type UpgradeId =
  | 'breiterWall'
  | 'standhaft'
  | 'schildstoss'
  | 'lauffeuer'
  | 'heisseAsche'
  | 'nachzuendung'
  | 'nachhall'
  | 'behutsameHaende'
  | 'klarerGedanke';

export type SealId =
  | 'glut1'
  | 'glut2'
  | 'glut3'
  | 'bastion1'
  | 'bastion2'
  | 'bastion3'
  | 'echo1'
  | 'echo2'
  | 'echo3';

export type EnemyId =
  | 'nebelgaenger'
  | 'irrlichtschuetze'
  | 'nebelschild'
  | 'saengerin'
  | 'aschenwirker'
  | 'nebelkoloss'
  | 'hauptmann'
  | 'aschenhexe'
  | 'glockenwaechter'
  | 'archivarin'
  | 'seitenwaechter'
  | 'hueter';

export type BossId = 'glockenwaechter' | 'archivarin' | 'hueter';

export type ExpeditionId = 1 | 2 | 3;

export type LongNightMod = 'swift' | 'reinforced' | 'meagerCamp';

export type StationType = 'fight' | 'choice' | 'story' | 'elite' | 'camp' | 'hardFight' | 'boss';

export type GeneralEventId = 'miauen' | 'brunnen' | 'werkstatt' | 'wachstube' | 'kinderlied' | 'haendler';
export type StoryEventId = 'botin' | 'register' | 'flamme';
export type EventId = GeneralEventId | StoryEventId;
