// Charakterbau: Talentpunkte (Attribute) und Ausprägungen (Archetypen) der drei Hauptfiguren.
import type { HeroId } from './types';

export type AttrId = 'vit' | 'str' | 'arm' | 'eva' | 'spd';
export const ATTR_IDS: AttrId[] = ['vit', 'str', 'arm', 'eva', 'spd'];

export interface AttrDef {
  id: AttrId;
  name: string;
  icon: string;
  per: number; // Wirkung je Punkt
  max: number; // höchstens so viele Punkte je Held
  text: (points: number) => string;
}

const pct = (x: number) => `${Math.round(x * 100)} %`;

export const ATTRS: Record<AttrId, AttrDef> = {
  vit: { id: 'vit', name: 'Lebenskraft', icon: '❤', per: 0.12, max: 5, text: (p) => `+${pct(0.12 * p)} Lebenspunkte` },
  str: { id: 'str', name: 'Stärke', icon: '⚔', per: 0.1, max: 5, text: (p) => `+${pct(0.1 * p)} Schaden, Heilung und Schilde` },
  arm: { id: 'arm', name: 'Rüstung', icon: '🛡', per: 0.06, max: 5, text: (p) => `−${pct(0.06 * p)} erlittener Schaden` },
  eva: { id: 'eva', name: 'Ausweichen', icon: '💨', per: 0.06, max: 5, text: (p) => `${pct(0.06 * p)} Chance, direkten Angriffen auszuweichen` },
  spd: { id: 'spd', name: 'Tempo', icon: '⏱', per: 0.07, max: 5, text: (p) => `−${pct(0.07 * p)} Zeit zwischen Angriffen` },
};

export const ATTR_POINTS = { start: 6, perLevel: 2 };

export type Attrs = Record<AttrId, number>;
export const emptyAttrs = (): Attrs => ({ vit: 0, str: 0, arm: 0, eva: 0, spd: 0 });

export type ArchetypeId =
  | 'guardian'
  | 'blades'
  | 'bulwark'
  | 'fire'
  | 'frost'
  | 'storm'
  | 'keeper'
  | 'poison'
  | 'light';

export interface ArchetypeDef {
  id: ArchetypeId;
  hero: HeroId;
  name: string;
  tagline: string;
  /** Veränderungen der Grundwerte */
  hpMult: number;
  atkMult: number;
  intervalMult: number;
  auto: string;
  ability: { name: string; cost: number; cooldown: number; text: string };
  color: string;
}

export const ARCHETYPES: Record<ArchetypeId, ArchetypeDef> = {
  guardian: {
    id: 'guardian',
    hero: 'fritz',
    name: 'Stadtwächter',
    tagline: 'Schild und Schutzlaterne. Schützt alle.',
    hpMult: 1,
    atkMult: 1,
    intervalMult: 1,
    auto: 'Nahkampfangriff',
    ability: { name: 'Laternenwall', cost: 2, cooldown: 8, text: 'Schild für alle, unterbricht das Fokusziel' },
    color: '#5b8bd6',
  },
  blades: {
    id: 'blades',
    hero: 'fritz',
    name: 'Zwei Klingen',
    tagline: 'Zwei Schwerter statt Schild: schnell und tödlich, aber verwundbarer.',
    hpMult: 0.78,
    atkMult: 0.95,
    intervalMult: 0.6,
    auto: 'Schnelle Doppelschläge',
    ability: { name: 'Klingenwirbel', cost: 2, cooldown: 7, text: '3 Schläge aufs Fokusziel, unterbricht es' },
    color: '#c9d3e0',
  },
  bulwark: {
    id: 'bulwark',
    hero: 'fritz',
    name: 'Bollwerk',
    tagline: 'Turmschild: hält alles aus und zieht jeden Angriff auf sich.',
    hpMult: 1.3,
    atkMult: 0.7,
    intervalMult: 1.1,
    auto: 'Schildstoß',
    ability: { name: 'Herausforderung', cost: 2, cooldown: 9, text: 'Alle Gegner greifen 5 s nur Fritz an, großer Schild, unterbricht' },
    color: '#8a93a6',
  },
  fire: {
    id: 'fire',
    hero: 'ivo',
    name: 'Funkengelehrter',
    tagline: 'Brand, der sich ausbreitet.',
    hpMult: 1,
    atkMult: 1,
    intervalMult: 1,
    auto: 'Funke + 1 Brand',
    ability: { name: 'Funkensturm', cost: 3, cooldown: 9, text: 'Schaden + Brand an allen' },
    color: '#e0823a',
  },
  frost: {
    id: 'frost',
    hero: 'ivo',
    name: 'Frostgelehrter',
    tagline: 'Verlangsamt Gegner und schiebt ihre Spezialangriffe hinaus.',
    hpMult: 1.05,
    atkMult: 0.85,
    intervalMult: 1,
    auto: 'Eissplitter: verlangsamt 3 s',
    ability: { name: 'Frostnova', cost: 3, cooldown: 10, text: 'Schaden an allen, verlangsamt 5 s, Vorbereitungen +1,5 s' },
    color: '#7fd0ff',
  },
  storm: {
    id: 'storm',
    hero: 'ivo',
    name: 'Blitzgelehrter',
    tagline: 'Springende Blitze für schnellen Einzelschaden.',
    hpMult: 0.9,
    atkMult: 1.1,
    intervalMult: 1,
    auto: 'Blitz springt mit 50 % weiter',
    ability: { name: 'Kettenblitz', cost: 3, cooldown: 8, text: 'Großer Treffer aufs Fokusziel, springt auf 3 weitere' },
    color: '#ffe066',
  },
  keeper: {
    id: 'keeper',
    hero: 'sera',
    name: 'Hüterin',
    tagline: 'Heilt, wer am meisten leidet.',
    hpMult: 1,
    atkMult: 1,
    intervalMult: 1,
    auto: 'Angriff + kleine Heilung',
    ability: { name: 'Erinnerung bewahren', cost: 3, cooldown: 10, text: 'Heilt die zwei Verletztesten' },
    color: '#f2c25b',
  },
  poison: {
    id: 'poison',
    hero: 'sera',
    name: 'Giftmischerin',
    tagline: 'Keine Heilung – dafür Gift, das Gegner schwächt.',
    hpMult: 1,
    atkMult: 1.1,
    intervalMult: 0.95,
    auto: 'Giftpfeil: +1 Gift',
    ability: { name: 'Giftwolke', cost: 3, cooldown: 10, text: '2 Gift an allen, Gegner 5 s geschwächt (−25 % Schaden)' },
    color: '#7ed36a',
  },
  light: {
    id: 'light',
    hero: 'sera',
    name: 'Lichtweberin',
    tagline: 'Webt Schilde statt Wunden zu schließen.',
    hpMult: 1.05,
    atkMult: 0.9,
    intervalMult: 1,
    auto: 'Angriff + Lichtschild',
    ability: { name: 'Lichtkuppel', cost: 3, cooldown: 11, text: 'Schild für alle + kleine Heilung' },
    color: '#fff2c0',
  },
};

export const ARCHETYPES_BY_HERO: Record<HeroId, ArchetypeId[]> = {
  fritz: ['guardian', 'blades', 'bulwark'],
  ivo: ['fire', 'frost', 'storm'],
  sera: ['keeper', 'poison', 'light'],
};

export const DEFAULT_ARCHETYPE: Record<HeroId, ArchetypeId> = { fritz: 'guardian', ivo: 'fire', sera: 'keeper' };

// Werte der neuen Fähigkeiten & Zustände (zentral fürs Balancing)
export const ARCH_VALUES = {
  bladesHits: 3,
  bladesHitDamage: 8,
  bulwarkShield: 26,
  bulwarkProvoke: 5,
  frostSlow: 0.35, // Anteil langsamer
  frostAutoDuration: 3,
  frostNovaDamage: 6,
  frostNovaDuration: 5,
  frostNovaDelay: 1.5,
  stormChain: 0.5,
  chainDamage: 16,
  chainJumps: 3,
  chainFalloff: 0.7,
  poisonPerStack: 1.3,
  poisonMax: 6,
  poisonDuration: 6,
  poisonCloudStacks: 2,
  weakenMult: 0.75,
  weakenDuration: 5,
  lightAutoShield: 5,
  lightDomeShield: 14,
  lightDomeHeal: 8,
};

// Haltungen im Kampf
export type Stance = 'offense' | 'balanced' | 'defense';
export const STANCES: Record<Stance, { name: string; icon: string; dealt: number; taken: number }> = {
  offense: { name: 'Offensiv', icon: '🗡', dealt: 1.25, taken: 1.2 },
  balanced: { name: 'Ausgewogen', icon: '⚖', dealt: 1, taken: 1 },
  defense: { name: 'Defensiv', icon: '🛡', dealt: 0.7, taken: 0.65 },
};
export const STANCE_COOLDOWN = 2;
export const SWAP = { cost: 1, cooldown: 6 };
