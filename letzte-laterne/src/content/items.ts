import type { BuildTag, ItemId, Rarity, RelicId } from './types';

export interface ItemDef {
  id: ItemId;
  name: string;
  rarity: Rarity;
  tags: BuildTag[];
  description: string;
  synergy: string;
}

// Werte der Gegenstandseffekte – zentral für Balancing
export const ITEM_VALUES = {
  zunderringStacks: 1,
  schildspangeShield: 10,
  stimmgabelFocus: 1,
  funkenfaengerStacks: 3,
  ascheglasMult: 0.5,
  dornenDamage: 6,
  leinenRatio: 0.5,
  taktgeberEvery: 4,
  taktgeberMax: 3,
  resonanzMult: 0.25,
  glutherzTarget: 14,
  glutherzSplash: 7,
  glutherzConsume: 3,
  eidShield: 10,
  eidDamage: 12,
  eidCooldown: 8,
  echoEvery: 3,
  echoPower: 0.5,
  echoDelay: 0.6,
};

export const ITEMS: Record<ItemId, ItemDef> = {
  zunderring: {
    id: 'zunderring',
    name: 'Zunderring',
    rarity: 'common',
    tags: ['glut'],
    description: 'Jeder direkte Fähigkeitstreffer des Trägers fügt +1 Brandstapel zu.',
    synergy: 'Ideal für Ivo (Funkensturm trifft alle). Bei Fritz nur mit „Schildstoß“ wirksam.',
  },
  schildspange: {
    id: 'schildspange',
    name: 'Schildspange',
    rarity: 'common',
    tags: ['bastion'],
    description: 'Der Träger erhält beim Einsatz seiner aktiven Fähigkeit 10 Schild.',
    synergy: 'Mit Dornenschild oder Eid des Bollwerks wird der Schild zur Waffe.',
  },
  stimmgabel: {
    id: 'stimmgabel',
    name: 'Stimmgabel',
    rarity: 'common',
    tags: ['echo'],
    description: 'Die Gruppe beginnt jeden Kampf mit +1 Fokus (höchstens 6).',
    synergy: 'Früher Fokus für Taschenuhr, Chor der Namen und Echochronik.',
  },
  funkenfaenger: {
    id: 'funkenfaenger',
    name: 'Funkenfänger',
    rarity: 'rare',
    tags: ['glut'],
    description:
      'Solange der Träger lebt: Stirbt ein brennender Gegner, gehen bis zu 3 seiner Brandstapel auf den Gegner mit den wenigsten Stapeln über.',
    synergy: 'Stark gegen große Gruppen. Mit „Lauffeuer“ und Glutherz entstehen Brandketten über mehrere Gegner.',
  },
  ascheglas: {
    id: 'ascheglas',
    name: 'Ascheglas',
    rarity: 'rare',
    tags: ['glut'],
    description: 'Vom Träger verursachter Brand ist 50 % stärker.',
    synergy: 'Gehört zu Ivo. Stapelt mit „Heiße Asche“.',
  },
  dornenschild: {
    id: 'dornenschild',
    name: 'Dornenschild',
    rarity: 'rare',
    tags: ['bastion'],
    description: 'Trifft ein direkter Angriff den Träger, während er einen Schild hat, erhält der Angreifer 6 Schaden.',
    synergy: 'Am besten auf dem vorderen Platz mit Schildspange oder Laternenwall.',
  },
  sanftesLeinen: {
    id: 'sanftesLeinen',
    name: 'Sanftes Leinen',
    rarity: 'rare',
    tags: ['bastion'],
    description: '50 % der vom Träger verursachten Überheilung werden zu Schild auf dem Geheilten.',
    synergy: 'Macht Seras Heilungen auch bei voller Gesundheit nützlich.',
  },
  taktgeber: {
    id: 'taktgeber',
    name: 'Taktgeber',
    rarity: 'rare',
    tags: ['echo'],
    description: 'Jeder 4. Grundangriff des Trägers erzeugt 1 Fokus (höchstens 3-mal pro Kampf).',
    synergy: 'Schnelle Angreifer (Ivo) laden ihn zuerst. Mehr Fokus = mehr Fähigkeiten.',
  },
  resonanzkristall: {
    id: 'resonanzkristall',
    name: 'Resonanzkristall',
    rarity: 'rare',
    tags: ['echo'],
    description: 'Die Abklingzeit der aktiven Fähigkeit des Trägers sinkt um 25 % (mindestens 3 s).',
    synergy: 'Mit Echochronik erreichst du den dritten Einsatz früher.',
  },
  glutherz: {
    id: 'glutherz',
    name: 'Glutherz',
    rarity: 'legendary',
    tags: ['glut'],
    description:
      'Erreicht ein Gegner durch Brand des Trägers 5 Stapel, explodiert er: 14 Schaden an ihm, 7 an allen anderen Gegnern; 3 Stapel werden verbraucht.',
    synergy: 'Funkensturm + Zunderring erreicht schnell 5 Stapel. Die Explosion selbst löst nichts weiter aus.',
  },
  eidDesBollwerks: {
    id: 'eidDesBollwerks',
    name: 'Eid des Bollwerks',
    rarity: 'legendary',
    tags: ['bastion'],
    description:
      'Bricht der Schild des Trägers, erhalten die anderen Helden 10 Schild und der Angreifer 12 Schaden (Abklingzeit 8 s).',
    synergy: 'Mit Schildspange, Standhaft und Yuumis Schnurrschutz bricht häufig ein Schild.',
  },
  echochronik: {
    id: 'echochronik',
    name: 'Echochronik',
    rarity: 'legendary',
    tags: ['echo'],
    description:
      'Jeder 3. manuelle Fähigkeitseinsatz des Trägers wird nach 0,6 s einmal mit 50 % Wirkung wiederholt.',
    synergy: 'Die Wiederholung kostet nichts und zählt nicht als manueller Einsatz.',
  },
};

export interface RelicDef {
  id: RelicId;
  name: string;
  rarity: Rarity;
  tags: BuildTag[];
  description: string;
  flavor?: string;
  synergy: string;
}

export const RELIC_VALUES = {
  dochtExtra: 3,
  kompassStacks: 1,
  wappenMult: 0.5,
  glockeFocus: 2,
  taschenuhrDiscount: 2,
  chorEvery: 3,
  chorHeal: 8,
  pawDamage: 4,
  pawInterval: 3,
  purrEvery: 3,
  purrShield: 5,
};

export const RELICS: Record<RelicId, RelicDef> = {
  docht: {
    id: 'docht',
    name: 'Docht der Morgenröte',
    rarity: 'common',
    tags: ['glut'],
    description: 'Brand hält 3 s länger (7 statt 4 s).',
    synergy: 'Stapel bleiben länger bei 5 – gut für Glutherz.',
  },
  aschekompass: {
    id: 'aschekompass',
    name: 'Aschekompass',
    rarity: 'rare',
    tags: ['glut'],
    description: 'Alle Gegner beginnen den Kampf mit 1 Brandstapel.',
    synergy: 'Gibt Funkenfänger und Lauffeuer sofort etwas zum Weitergeben.',
  },
  wappen: {
    id: 'wappen',
    name: 'Wappen der Wache',
    rarity: 'common',
    tags: ['bastion'],
    description: 'Alle von der Gruppe erzeugten Schilde sind 50 % stärker (gruppenweit, auch Yuumis Schnurrschutz).',
    synergy: 'Verstärkt Laternenwall, Schildspange, Sanftes Leinen und Yuumi.',
  },
  glocke: {
    id: 'glocke',
    name: 'Gesprungene Glocke',
    rarity: 'rare',
    tags: ['bastion', 'echo'],
    description: 'Der erste gebrochene Schild eines Verbündeten pro Kampf erzeugt 2 Fokus.',
    synergy: 'Verbindet Bastion und Echo.',
  },
  taschenuhr: {
    id: 'taschenuhr',
    name: 'Taschenuhr ohne Zeiger',
    rarity: 'common',
    tags: ['echo'],
    description: 'Die erste aktive Fähigkeit des Kampfes kostet 2 Fokus weniger (mindestens 0).',
    synergy: 'Sofortiger Funkensturm oder Laternenwall zum Kampfbeginn.',
  },
  chor: {
    id: 'chor',
    name: 'Chor der Namen',
    rarity: 'rare',
    tags: ['echo', 'bastion'],
    description: 'Jeder 3. manuelle Fähigkeitseinsatz der Gruppe heilt alle lebenden Helden um 8.',
    synergy: 'Viele günstige Fähigkeiten (Laternenwall, Klarer Gedanke) füllen den Chor schnell.',
  },
  mondgloeckchen: {
    id: 'mondgloeckchen',
    name: 'Yuumis Mondglöckchen',
    rarity: 'rare',
    tags: ['glut', 'bastion', 'echo'],
    description:
      'Ruft Yuumi als automatisch kämpfende Begleiterin: Pfotenhieb (4 Schaden alle 3 s auf das Fokusziel); jeder 3. Pfotenhieb gibt der verletztesten Hauptfigur 5 Schild (Schnurrschutz). Einzigartig.',
    flavor: '„Ein silbernes Glöckchen, das auch im dichtesten Nebel leise klingt. Wenn es läutet, ist Yuumi nie weit entfernt.“',
    synergy: 'Schnurrschutz wird von Wappen der Wache und Standhaft verstärkt. Belegt einen Reliktplatz, gilt nur für diesen Run.',
  },
};

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Gewöhnlich',
  rare: 'Selten',
  legendary: 'Legendär',
};
export const RARITY_SYMBOL: Record<Rarity, string> = {
  common: '●',
  rare: '◆',
  legendary: '★',
};
export const TAG_LABEL: Record<BuildTag, string> = { glut: 'Glut', bastion: 'Bastion', echo: 'Echo' };
export const TAG_SYMBOL: Record<BuildTag, string> = { glut: '🔥', bastion: '🛡️', echo: '🔁' };
