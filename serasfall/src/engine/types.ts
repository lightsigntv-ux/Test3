// Kern-Datentypen. Keine Story-Inhalte in Bezeichnern – nur neutrale IDs.

export type NpcId = 'harriet' | 'lionel' | 'clara' | 'penrose' | 'hobbes' | 'pryce' | 'tilly' | 'dunning';
export const NPCS: NpcId[] = ['harriet', 'lionel', 'clara', 'penrose', 'hobbes', 'pryce', 'tilly', 'dunning'];

/** Sprecher einer Zeile. inner = Seras innere Stimme, narr = Erzählung/Bühnenbeschreibung, yuumi = Katzenlaute/Gesten. */
export type SpeakerId = NpcId | 'sera' | 'inner' | 'narr' | 'yuumi' | 'letter';

export type LocId =
  | 'wohnung' | 'zwischen'
  | 'halle' | 'salon' | 'arbeit' | 'dunkel' | 'biblio' | 'dienst' | 'galerie' | 'toten'
  | 'kammer' | 'gewaechs' | 'stall' | 'kapelle' | 'london';

export type Expr = 'neutral' | 'warm' | 'sad' | 'tense' | 'angry' | 'surprised';
export const EXPRS: Expr[] = ['neutral', 'warm', 'sad', 'tense', 'angry', 'surprised'];

export type TimeOfDay = 'morgen' | 'mittag' | 'nachmittag' | 'abend' | 'nacht';

export type Stance = 'mitfuehlend' | 'direkt' | 'ausweichend' | 'ehrlich' | 'schweigen' | 'humor' | 'luege' | 'neutral';

export type DialogueKind = 'scene' | 'topic' | 'smalltalk' | 'present' | 'examine' | 'event' | 'yuumi';

/** Bedingungen – alle Angaben müssen erfüllt sein (UND). */
export interface Cond {
  chapterIn?: number[];
  minChapter?: number;
  maxChapter?: number;
  flagsAll?: string[];
  flagsNone?: string[];
  flagsAny?: string[];
  knows?: string[];
  knowsAny?: string[];
  knowsNone?: string[];
  trustMin?: Partial<Record<NpcId, number>>;
  trustBelow?: Partial<Record<NpcId, number>>;
  timeOfDay?: TimeOfDay[];
  timeNot?: TimeOfDay[];
  location?: LocId[];
  locationNot?: LocId[];
  yuumiPresent?: boolean;
  suspicionMin?: number;
  suspicionBelow?: number;
  seen?: string[];
  notSeen?: string[];
  controlling?: 'sera' | 'yuumi';
}

export interface Effects {
  trust?: Partial<Record<NpcId, number>>;
  flags?: string[];
  unflags?: string[];
  addClue?: string[];
  addStatement?: string[];
  suspicion?: number;
  setTime?: TimeOfDay;
  sfx?: string;
  music?: string;
  goto?: { loc: LocId; x: number };
  chapter?: number;
  special?: string; // z. B. recon, ending:<id>, yuumi_lost, plate
}

export interface Choice {
  text: string;
  stance: Stance;
  cond?: Cond;
  effects?: Effects;
  next: string; // Knoten-ID oder 'END'
}

export interface DNode {
  id: string;
  speaker?: SpeakerId;
  expr?: Expr;
  text?: string;
  next?: string;
  choices?: Choice[];
  /** bedingte Sprünge, der erste zutreffende gewinnt, sonst next */
  branch?: { cond: Cond; next: string }[];
  effects?: Effects;
  reveals?: string[];
  hints?: string[];
  lie?: string;
  pause?: number;
  mood?: string;
  /** Knoten ohne Text, nur Verzweigung/Effekt */
  silent?: boolean;
}

export interface Dialogue {
  id: string;
  kind: DialogueKind;
  npc?: NpcId;
  title?: string;
  target?: string; // Hotspot-ID bei examine/yuumi
  items?: string[]; // bei present; '*' = Standardreaktion
  when?: Cond;
  priority: number;
  repeat: boolean;
  important: boolean;
  start: string;
  nodes: Record<string, DNode>;
  order: string[];
  source?: string;
}

export type ClueKind = 'gegenstand' | 'dokument' | 'beobachtung' | 'erinnerung';
export interface Clue {
  id: string;
  name: string;
  kind: ClueKind;
  note: string; // Notizbuchtext in Seras Stimme
  /** optional: spätere Neudeutung im Notizbuch */
  later?: { cond: Cond; note: string }[];
}

export interface Statement {
  id: string;
  speaker: NpcId | 'sera';
  text: string;
  /** nur intern */
  truth: 'wahr' | 'luege' | 'irrtum';
}

export interface Deduction {
  id: string;
  chapter: number;
  question: string;
  /** Satz mit Lücken {0} {1} … */
  template: string;
  slots: { options: string[]; correct: number[] }[];
  support: string[];
  need: number;
  trigger: string[];
  contradiction?: boolean;
  result: string; // Notizbuch-Eintrag nach Lösung
  doubt: string[]; // Seras Zweifel bei falscher Lösung
  hints: [string, string, string];
  effects?: Effects;
}

export interface Hotspot {
  id: string;
  label: string;
  x: number; // 0..1 relativ zur Raumbreite
  y: number; // 0..1 relativ zur Raumhöhe (Bildkoordinaten)
  r: number; // Reichweite
  kind: 'examine' | 'npc' | 'exit' | 'cat';
  when?: Cond;
  to?: LocId; // bei exit
  arriveX?: number;
  npc?: NpcId;
  /** Katzenpunkte: nur als Yuumi erreichbar */
  catOnly?: boolean;
  /** Beschriftung, sobald Sera mehr weiß (erste zutreffende gewinnt) */
  labelWhen?: [Cond, string][];
}

export interface Location {
  id: LocId;
  name: string;
  floorY: [number, number]; // begehbares Band (0..1)
  xRange: [number, number];
  hotspots: Hotspot[];
  ambience: string[];
  catAllowed: boolean;
}

export interface Chapter {
  n: number;
  title: string;
  day: string;
  intro: string[];
  start: { loc: LocId; x: number; time: TimeOfDay };
  /** wenn erfüllt, wird die Schlussszene ausgelöst */
  endScene: string;
}

export interface Placement {
  npc: NpcId;
  loc: LocId;
  x: number;
  when?: Cond;
}

export interface GameState {
  version: number;
  chapter: number;
  time: TimeOfDay;
  loc: LocId;
  x: number;
  y: number;
  controlling: 'sera' | 'yuumi';
  yuumiLoc: LocId;
  flags: Record<string, true>;
  clues: Record<string, string>; // id -> wann (Label)
  statements: Record<string, string>;
  deductions: Record<string, string>;
  trust: Record<NpcId, number>;
  suspicion: number;
  seen: Record<string, number>;
  presentRot: Record<string, number>;
  hintLevel: Record<string, number>;
  recon: Record<string, number>;
  ending?: string;
  log: { s: SpeakerId; t: string }[];
  active?: { dlg: string; node: string };
  playMinutes: number;
}

export type Knowable = { kind: 'clue' | 'statement' | 'deduction'; id: string };
