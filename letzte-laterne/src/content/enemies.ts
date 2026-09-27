import type { EnemyId, ExpeditionId } from './types';

export type Targeting = 'front' | 'back';

export type WindupEffect =
  | { kind: 'hitFront'; damage: number; vulnerable?: number }
  | { kind: 'hitAll'; damage: number; burn?: number }
  | { kind: 'cleanse'; damage: number }; // entfernt Brand bei allen Gegnern und Schilde bei allen Helden

export type EnemyAbility =
  | {
      type: 'windup';
      name: string;
      first: number;
      every: number;
      windup: number;
      interruptible: boolean;
      effect: WindupEffect;
      hint: string;
    }
  | { type: 'shieldAlly'; name: string; first: number; every: number; amount: number }
  | { type: 'healAlly'; name: string; first: number; every: number; amount: number; cleanse: boolean }
  | { type: 'taunt'; name: string; first: number; every: number; duration: number; shield: number }
  | { type: 'summon'; name: string; first: number; every: number; enemy: EnemyId; max: number }
  | { type: 'shieldSelf'; name: string; first: number; every: number; amount: number; pulseEvery: number; pulseDamage: number };

export interface EnemyPhase {
  below: number; // Phase beginnt, wenn HP-Anteil ≤ below (Phase 0: 1)
  name: string;
  announce: string;
  intervalMult: number;
  abilities: EnemyAbility[];
}

export interface EnemyDef {
  id: EnemyId;
  name: string;
  kind: 'normal' | 'elite' | 'boss' | 'summon';
  role: string;
  description: string;
  maxHp: number;
  atk: number;
  interval: number;
  targeting: Targeting;
  attackBurn?: number;
  phases: EnemyPhase[];
  cycle?: { pressure: number; exhausted: number; exhaustBonus: number };
  color: string;
  size: number;
}

const single = (abilities: EnemyAbility[]): EnemyPhase[] => [
  { below: 1, name: '', announce: '', intervalMult: 1, abilities },
];

export const ENEMIES: Record<EnemyId, EnemyDef> = {
  nebelgaenger: {
    id: 'nebelgaenger',
    name: 'Nebelgänger',
    kind: 'normal',
    role: 'Nahkämpfer',
    description: 'Greift die vorderste Figur an.',
    maxHp: 34,
    atk: 5,
    interval: 2.0,
    targeting: 'front',
    phases: single([]),
    color: '#6f86a8',
    size: 1,
  },
  irrlichtschuetze: {
    id: 'irrlichtschuetze',
    name: 'Irrlichtschütze',
    kind: 'normal',
    role: 'Fernkämpfer',
    description: 'Zielt auf die hintere Reihe (die hintere Figur mit den wenigsten HP).',
    maxHp: 22,
    atk: 5,
    interval: 2.4,
    targeting: 'back',
    phases: single([]),
    color: '#8fd3ff',
    size: 0.85,
  },
  nebelschild: {
    id: 'nebelschild',
    name: 'Nebelschild',
    kind: 'normal',
    role: 'Schildträger',
    description: 'Gibt alle 7 s dem verletztesten Verbündeten einen Schild.',
    maxHp: 42,
    atk: 4,
    interval: 2.6,
    targeting: 'front',
    phases: single([{ type: 'shieldAlly', name: 'Nebelmantel', first: 3, every: 7, amount: 7 }]),
    color: '#7d9ab0',
    size: 1.05,
  },
  saengerin: {
    id: 'saengerin',
    name: 'Verblasste Sängerin',
    kind: 'normal',
    role: 'Heilerin',
    description: 'Heilt alle 6 s den verletztesten Verbündeten und löscht dabei dessen Brand.',
    maxHp: 26,
    atk: 3,
    interval: 2.8,
    targeting: 'back',
    phases: single([{ type: 'healAlly', name: 'Wiegenlied', first: 4, every: 6, amount: 7, cleanse: true }]),
    color: '#b49ad8',
    size: 0.9,
  },
  aschenwirker: {
    id: 'aschenwirker',
    name: 'Aschenwirker',
    kind: 'normal',
    role: 'Brandwirker',
    description: 'Jeder Angriff setzt 1 Brandstapel auf die vorderste Figur.',
    maxHp: 28,
    atk: 3,
    interval: 2.4,
    targeting: 'front',
    attackBurn: 1,
    phases: single([]),
    color: '#d06a4a',
    size: 0.95,
  },
  nebelkoloss: {
    id: 'nebelkoloss',
    name: 'Nebelkoloss',
    kind: 'normal',
    role: 'Schwerer Angreifer',
    description: 'Bereitet „Zermalmen“ vor: schwerer Schlag gegen die vorderste Figur. Unterbrechbar.',
    maxHp: 52,
    atk: 5,
    interval: 2.8,
    targeting: 'front',
    phases: single([
      {
        type: 'windup',
        name: 'Zermalmen',
        first: 7,
        every: 11,
        windup: 3,
        interruptible: true,
        effect: { kind: 'hitFront', damage: 28 },
        hint: '20 Schaden an der vordersten Figur',
      },
    ]),
    color: '#55637a',
    size: 1.25,
  },
  hauptmann: {
    id: 'hauptmann',
    name: 'Grauer Hauptmann',
    kind: 'elite',
    role: 'Elite: Provokateur',
    description:
      'Provoziert regelmäßig (alle Einzelangriffe müssen ihn treffen) und bereitet „Sturmhieb“ vor: Schaden + Verwundbar. Unterbrechbar.',
    maxHp: 115,
    atk: 7,
    interval: 2.2,
    targeting: 'front',
    phases: single([
      { type: 'taunt', name: 'Provokation', first: 5, every: 14, duration: 4, shield: 12 },
      {
        type: 'windup',
        name: 'Sturmhieb',
        first: 9,
        every: 12,
        windup: 2.5,
        interruptible: true,
        effect: { kind: 'hitFront', damage: 24, vulnerable: 4 },
        hint: '18 Schaden + Verwundbar an der vordersten Figur',
      },
    ]),
    color: '#8a93a6',
    size: 1.3,
  },
  aschenhexe: {
    id: 'aschenhexe',
    name: 'Aschenhexe',
    kind: 'elite',
    role: 'Elite: Brandwirkerin',
    description: 'Angriffe setzen Brand auf die hintere Reihe. Bereitet „Aschenregen“ vor: Schaden und 2 Brandstapel auf alle. Unterbrechbar.',
    maxHp: 90,
    atk: 5,
    interval: 2.4,
    targeting: 'back',
    attackBurn: 1,
    phases: single([
      {
        type: 'windup',
        name: 'Aschenregen',
        first: 6,
        every: 13,
        windup: 3,
        interruptible: true,
        effect: { kind: 'hitAll', damage: 8, burn: 2 },
        hint: '6 Schaden + 2 Brand an allen Helden',
      },
    ]),
    color: '#c4553a',
    size: 1.25,
  },
  glockenwaechter: {
    id: 'glockenwaechter',
    name: 'Der Glockenwächter',
    kind: 'boss',
    role: 'Boss der Vorstadt',
    description: 'Phase 1: angekündigte Glockenschläge. Phase 2 (ab 50 %): Schutzphasen mit Schild, dessen Nachhall die Gruppe trifft.',
    maxHp: 360,
    atk: 7,
    interval: 2.3,
    targeting: 'front',
    phases: [
      {
        below: 1,
        name: 'Wacht',
        announce: '',
        intervalMult: 1,
        abilities: [
          {
            type: 'windup',
            name: 'Glockenschlag',
            first: 6,
            every: 12,
            windup: 3,
            interruptible: true,
            effect: { kind: 'hitFront', damage: 34 },
            hint: '26 Schaden an der vordersten Figur',
          },
        ],
      },
      {
        below: 0.5,
        name: 'Sturmläuten',
        announce: 'Der Glockenwächter läutet Sturm! Schutzphasen: Brich seinen Schild, sonst trifft der Nachhall alle.',
        intervalMult: 1,
        abilities: [
          { type: 'shieldSelf', name: 'Glockenmantel', first: 1, every: 16, amount: 40, pulseEvery: 3, pulseDamage: 5 },
          {
            type: 'windup',
            name: 'Glockenschlag',
            first: 8,
            every: 10,
            windup: 2.5,
            interruptible: true,
            effect: { kind: 'hitFront', damage: 34 },
            hint: '26 Schaden an der vordersten Figur',
          },
        ],
      },
    ],
    color: '#9a8a5a',
    size: 1.8,
  },
  seitenwaechter: {
    id: 'seitenwaechter',
    name: 'Seitenhüter',
    kind: 'summon',
    role: 'Beschworene Unterstützung',
    description: 'Von der Archivarin herbeigerufen. Schwach, aber lästig.',
    maxHp: 20,
    atk: 4,
    interval: 2.0,
    targeting: 'front',
    phases: single([]),
    color: '#a7a2c9',
    size: 0.8,
  },
  archivarin: {
    id: 'archivarin',
    name: 'Die namenlose Archivarin',
    kind: 'boss',
    role: 'Boss des Archivs',
    description:
      'Phase 1: ruft Seitenhüter herbei. Phase 2 (ab 50 %): bereitet „Tilgen“ vor – entfernt Brand bei ihren Verbündeten und Schilde bei deinen Helden. Unterbrechbar.',
    maxHp: 400,
    atk: 5,
    interval: 2.4,
    targeting: 'back',
    phases: [
      {
        below: 1,
        name: 'Katalog',
        announce: '',
        intervalMult: 1,
        abilities: [{ type: 'summon', name: 'Seitenhüter rufen', first: 2, every: 14, enemy: 'seitenwaechter', max: 2 }],
      },
      {
        below: 0.5,
        name: 'Tilgung',
        announce: 'Die Archivarin beginnt zu tilgen! Unterbrich „Tilgen“, sonst verschwinden Brand und Schilde.',
        intervalMult: 0.9,
        abilities: [
          {
            type: 'windup',
            name: 'Tilgen',
            first: 3,
            every: 10,
            windup: 2,
            interruptible: true,
            effect: { kind: 'cleanse', damage: 8 },
            hint: 'Entfernt Brand bei Gegnern und Schilde bei Helden, 6 Schaden an allen',
          },
          { type: 'summon', name: 'Seitenhüter rufen', first: 8, every: 16, enemy: 'seitenwaechter', max: 1 },
        ],
      },
    ],
    color: '#8c7fb8',
    size: 1.7,
  },
  hueter: {
    id: 'hueter',
    name: 'Der Hüter des letzten Lichts',
    kind: 'boss',
    role: 'Boss im Herz der Laterne',
    description:
      'Wechselt zwischen Druckphasen (10 s) und Erschöpfung (4 s, +50 % erlittener Schaden). Ab 50 %: „Letztes Licht“ trifft alle hart und ist NICHT unterbrechbar – Schilde und Heilung vorbereiten!',
    maxHp: 560,
    atk: 7,
    interval: 2.0,
    targeting: 'front',
    cycle: { pressure: 10, exhausted: 4, exhaustBonus: 0.5 },
    phases: [
      {
        below: 1,
        name: 'Glut',
        announce: '',
        intervalMult: 1,
        abilities: [
          {
            type: 'windup',
            name: 'Lichtflut',
            first: 4,
            every: 8,
            windup: 2.5,
            interruptible: true,
            effect: { kind: 'hitAll', damage: 11 },
            hint: '9 Schaden an allen Helden',
          },
        ],
      },
      {
        below: 0.5,
        name: 'Letzte Flamme',
        announce: 'Der Hüter lodert auf! „Letztes Licht“ kann nicht unterbrochen werden – halte Schilde und Heilung bereit.',
        intervalMult: 0.85,
        abilities: [
          {
            type: 'windup',
            name: 'Letztes Licht',
            first: 3,
            every: 13,
            windup: 3.5,
            interruptible: false,
            effect: { kind: 'hitAll', damage: 24 },
            hint: '20 Schaden an allen Helden – nicht unterbrechbar',
          },
          {
            type: 'windup',
            name: 'Lichtflut',
            first: 8,
            every: 9,
            windup: 2.5,
            interruptible: true,
            effect: { kind: 'hitAll', damage: 11 },
            hint: '9 Schaden an allen Helden',
          },
        ],
      },
    ],
    color: '#f0c070',
    size: 1.9,
  },
};

export interface EncounterPools {
  easy: EnemyId[][];
  normal: EnemyId[][];
  hard: EnemyId[][];
  elite: EnemyId[][];
  boss: EnemyId[];
}

export const ENCOUNTERS: Record<ExpeditionId, EncounterPools> = {
  1: {
    easy: [
      ['nebelgaenger', 'irrlichtschuetze'],
      ['nebelgaenger', 'nebelgaenger'],
    ],
    normal: [
      ['nebelgaenger', 'nebelschild', 'irrlichtschuetze'],
      ['nebelkoloss', 'irrlichtschuetze'],
      ['nebelgaenger', 'nebelkoloss'],
    ],
    hard: [
      ['nebelkoloss', 'nebelschild', 'irrlichtschuetze'],
      ['nebelgaenger', 'nebelkoloss', 'irrlichtschuetze'],
    ],
    elite: [['hauptmann', 'irrlichtschuetze']],
    boss: ['glockenwaechter'],
  },
  2: {
    easy: [
      ['nebelgaenger', 'saengerin'],
      ['aschenwirker', 'irrlichtschuetze'],
    ],
    normal: [
      ['nebelschild', 'aschenwirker', 'saengerin'],
      ['nebelgaenger', 'aschenwirker', 'irrlichtschuetze'],
      ['nebelkoloss', 'saengerin'],
    ],
    hard: [
      ['nebelkoloss', 'aschenwirker', 'saengerin'],
      ['nebelschild', 'irrlichtschuetze', 'irrlichtschuetze', 'saengerin'],
    ],
    elite: [['aschenhexe', 'nebelschild']],
    boss: ['archivarin'],
  },
  3: {
    easy: [
      ['nebelgaenger', 'aschenwirker', 'irrlichtschuetze'],
      ['nebelschild', 'irrlichtschuetze', 'saengerin'],
    ],
    normal: [
      ['nebelkoloss', 'aschenwirker', 'saengerin'],
      ['nebelgaenger', 'nebelschild', 'irrlichtschuetze', 'aschenwirker'],
      ['nebelkoloss', 'irrlichtschuetze', 'saengerin'],
    ],
    hard: [
      ['nebelkoloss', 'nebelkoloss', 'saengerin'],
      ['nebelschild', 'aschenwirker', 'irrlichtschuetze', 'saengerin'],
    ],
    elite: [
      ['hauptmann', 'saengerin'],
      ['aschenhexe', 'nebelgaenger'],
    ],
    boss: ['hueter'],
  },
};

// Modifikator „Verstärkt“: zusätzlicher Unterstützer je Gruppe (abwechselnd)
export const REINFORCEMENTS: EnemyId[] = ['saengerin', 'nebelschild'];
