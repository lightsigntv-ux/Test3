import type { BuildTag, HeroId, ItemId, SealId, UpgradeId } from './types';

export interface UpgradeDef {
  id: UpgradeId;
  hero: HeroId;
  name: string;
  tags: BuildTag[];
  description: string;
}

export const UPGRADE_VALUES = {
  breiterWallBonus: 8, // +Schild je Held bei Laternenwall
  standhaftMult: 0.4, // Schilde auf Fritz +40 %
  schildstossDamage: 12,
  schildstossVulnerable: 3, // s Verwundbar
  lauffeuerStacks: 1, // an alle anderen Gegner
  heisseAscheMult: 0.5,
  nachzuendungDelay: 1.5,
  nachzuendungPower: 0.5,
  nachhallPerSecond: 3,
  nachhallDuration: 3,
  behutsameBonus: 4,
  klarerGedankeDiscount: 1,
};

export const UPGRADES: Record<UpgradeId, UpgradeDef> = {
  breiterWall: {
    id: 'breiterWall',
    hero: 'fritz',
    name: 'Breiter Wall',
    tags: ['bastion'],
    description: 'Laternenwall gibt +8 Schild je Held.',
  },
  standhaft: {
    id: 'standhaft',
    hero: 'fritz',
    name: 'Standhaft',
    tags: ['bastion'],
    description: 'Alle Schilde, die Fritz erhält, sind 40 % stärker (auch Yuumis Schnurrschutz).',
  },
  schildstoss: {
    id: 'schildstoss',
    hero: 'fritz',
    name: 'Schildstoß',
    tags: ['bastion', 'glut'],
    description: 'Laternenwall trifft zusätzlich das Fokusziel: 12 Schaden und 3 s Verwundbar.',
  },
  lauffeuer: {
    id: 'lauffeuer',
    hero: 'ivo',
    name: 'Lauffeuer',
    tags: ['glut'],
    description: 'Stirbt ein brennender Gegner, erhalten alle anderen Gegner 1 Brandstapel.',
  },
  heisseAsche: {
    id: 'heisseAsche',
    hero: 'ivo',
    name: 'Heiße Asche',
    tags: ['glut'],
    description: 'Von Ivo verursachter Brand ist 50 % stärker.',
  },
  nachzuendung: {
    id: 'nachzuendung',
    hero: 'ivo',
    name: 'Nachzündung',
    tags: ['glut', 'echo'],
    description: 'Funkensturm trifft 1,5 s später erneut mit 50 % Wirkung (zählt nicht als manueller Einsatz).',
  },
  nachhall: {
    id: 'nachhall',
    hero: 'sera',
    name: 'Nachhall',
    tags: ['bastion', 'echo'],
    description: 'Erinnerung bewahren heilt die Ziele 3 s lang um 3 HP pro Sekunde weiter.',
  },
  behutsameHaende: {
    id: 'behutsameHaende',
    hero: 'sera',
    name: 'Behutsame Hände',
    tags: ['bastion'],
    description: 'Seras automatische Heilung heilt +4.',
  },
  klarerGedanke: {
    id: 'klarerGedanke',
    hero: 'sera',
    name: 'Klarer Gedanke',
    tags: ['echo'],
    description: 'Erinnerung bewahren kostet 1 Fokus weniger (mindestens 1).',
  },
};

export interface SealDef {
  id: SealId;
  branch: BuildTag;
  tier: 1 | 2 | 3;
  name: string;
  cost: number;
  load: number;
  description: string;
  startItem?: ItemId;
}

export const SEAL_VALUES = {
  glut2Stacks: 2,
  glut3Heal: 12,
  bastion2Shield: 8,
  bastion3Focus: 1,
  echo2CdMult: 0.6,
  echo3Every: 3,
  echo3Reduce: 1.5,
};

export const SEALS: Record<SealId, SealDef> = {
  glut1: {
    id: 'glut1',
    branch: 'glut',
    tier: 1,
    name: 'Siegel der Zunder',
    cost: 2,
    load: 1,
    startItem: 'zunderring',
    description: 'Du startest mit einem Zunderring (Träger wählbar).',
  },
  glut2: {
    id: 'glut2',
    branch: 'glut',
    tier: 2,
    name: 'Siegel des ersten Funkens',
    cost: 4,
    load: 1,
    description: 'Der erste Funkensturm jedes Kampfes fügt +2 Brandstapel zu.',
  },
  glut3: {
    id: 'glut3',
    branch: 'glut',
    tier: 3,
    name: 'Siegel der warmen Asche',
    cost: 6,
    load: 2,
    description: 'Der erste besiegte brennende Gegner jedes Kampfes heilt alle Helden um 12.',
  },
  bastion1: {
    id: 'bastion1',
    branch: 'bastion',
    tier: 1,
    name: 'Siegel der Spange',
    cost: 2,
    load: 1,
    startItem: 'schildspange',
    description: 'Du startest mit einer Schildspange (Träger wählbar).',
  },
  bastion2: {
    id: 'bastion2',
    branch: 'bastion',
    tier: 2,
    name: 'Siegel der Wachsamkeit',
    cost: 4,
    load: 1,
    description: 'Alle Helden beginnen jeden Kampf mit 8 Schild.',
  },
  bastion3: {
    id: 'bastion3',
    branch: 'bastion',
    tier: 3,
    name: 'Siegel des Widerhalls',
    cost: 6,
    load: 2,
    description: 'Der erste gebrochene Schild jeder Hauptfigur pro Kampf erzeugt 1 Fokus.',
  },
  echo1: {
    id: 'echo1',
    branch: 'echo',
    tier: 1,
    name: 'Siegel der Stimmgabel',
    cost: 2,
    load: 1,
    startItem: 'stimmgabel',
    description: 'Du startest mit einer Stimmgabel (Träger wählbar).',
  },
  echo2: {
    id: 'echo2',
    branch: 'echo',
    tier: 2,
    name: 'Siegel des schnellen Atems',
    cost: 4,
    load: 1,
    description: 'Die erste aktive Fähigkeit jeder Hauptfigur pro Kampf hat 40 % kürzere Abklingzeit.',
  },
  echo3: {
    id: 'echo3',
    branch: 'echo',
    tier: 3,
    name: 'Siegel des Kanons',
    cost: 6,
    load: 2,
    description: 'Jeder 3. manuelle Fähigkeitseinsatz der Gruppe verkürzt alle laufenden Abklingzeiten um 1,5 s.',
  },
};

export const SEAL_ORDER: SealId[] = [
  'glut1',
  'glut2',
  'glut3',
  'bastion1',
  'bastion2',
  'bastion3',
  'echo1',
  'echo2',
  'echo3',
];
