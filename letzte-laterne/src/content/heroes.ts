import type { HeroId } from './types';

export interface AbilityDef {
  name: string;
  cost: number;
  cooldown: number;
  description: string;
  key: string;
}

export interface HeroDef {
  id: HeroId;
  name: string;
  title: string;
  role: string;
  color: string;
  symbol: string;
  maxHp: number;
  atk: number;
  interval: number;
  heal: number; // nur Sera: Heilung beim Grundangriff
  autoDescription: string;
  ability: AbilityDef;
  bio: string;
}

export const ABILITY_VALUES = {
  wallShield: 12, // Laternenwall: Schild für jede Heldin/jeden Helden
  stormDamage: 7, // Funkensturm: Schaden an allen Gegnern
  stormBurn: 2, // Funkensturm: Brandstapel je Gegner
  memoryHeal: 24, // Erinnerung bewahren: Heilung für zwei Verbündete
};

export const HEROES: Record<HeroId, HeroDef> = {
  fritz: {
    id: 'fritz',
    name: 'Fritz',
    title: 'ehemaliger Stadtwächter',
    role: 'Schutz & Kontrolle',
    color: '#5b8bd6',
    symbol: '🛡',
    maxHp: 140,
    atk: 8,
    interval: 2.4,
    heal: 0,
    autoDescription: 'Nahkampfangriff gegen das Fokusziel.',
    ability: {
      name: 'Laternenwall',
      cost: 2,
      cooldown: 8,
      key: '1',
      description:
        'Gibt allen lebenden Helden einen Schild. Unterbricht die unterbrechbare Vorbereitung des Fokusziels.',
    },
    bio: 'Direkt, verlässlich, schweigsam über das Tor, das er einst schließen ließ.',
  },
  ivo: {
    id: 'ivo',
    name: 'Ivo',
    title: 'verbannter Funkengelehrter',
    role: 'Schaden & Brand',
    color: '#e0823a',
    symbol: '✦',
    maxHp: 90,
    atk: 9,
    interval: 2.2,
    heal: 0,
    autoDescription: 'Magischer Angriff gegen das Fokusziel, fügt 1 Brandstapel zu.',
    ability: {
      name: 'Funkensturm',
      cost: 3,
      cooldown: 9,
      key: '2',
      description: 'Schaden und Brandstapel auf alle Gegner.',
    },
    bio: 'Erklärt alles – besonders, wenn er selbst unsicher ist.',
  },
  sera: {
    id: 'sera',
    name: 'Sera',
    title: 'Hüterin verlorener Namen',
    role: 'Heilung & Unterstützung',
    color: '#f2c25b',
    symbol: '❀',
    maxHp: 95,
    atk: 6,
    interval: 2.6,
    heal: 4,
    autoDescription:
      'Schwacher Angriff gegen das Fokusziel; heilt dabei den am stärksten verletzten lebenden Verbündeten (niedrigster HP-Anteil).',
    ability: {
      name: 'Erinnerung bewahren',
      cost: 3,
      cooldown: 10,
      key: '3',
      description: 'Heilt die zwei am stärksten verletzten lebenden Verbündeten.',
    },
    bio: 'Warmherzig und aufmerksam. Sie kennt die Laterne besser, als sie zugibt.',
  },
};
