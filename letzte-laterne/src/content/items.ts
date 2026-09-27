import type { BuildTag, ItemId, Rarity, RelicId } from './types';

export interface ItemDef {
  id: ItemId;
  name: string;
  /** Legendäre Einzelstücke gibt es nur in der Stufe „Legendär“; alle anderen in Gewöhnlich/Magisch/Selten. */
  unique: boolean;
  tags: BuildTag[];
  /** Kurzer Effekt mit den Werten der jeweiligen Stufe (v liefert den Stufenwert eines Schlüssels). */
  text: (v: (key: string) => number) => string;
  synergy: string;
}

/** Ein konkretes Exemplar: Gegenstand + Qualitätsstufe. */
export interface EquipItem {
  id: ItemId;
  q: Rarity;
}

// Feste Werte der legendären Einzelstücke und sonstige Konstanten
export const ITEM_VALUES = {
  glutherzTarget: 18,
  glutherzSplash: 9,
  glutherzConsume: 3,
  eidShield: 12,
  eidDamage: 15,
  eidCooldown: 7,
  echoEvery: 3,
  echoPower: 0.6,
  echoDelay: 0.6,
};

/** Stufenwerte [Gewöhnlich, Magisch, Selten] der normalen Gegenstände. */
export const TIER_VALUES: Partial<Record<ItemId, Record<string, [number, number, number]>>> = {
  zunderring: { stacks: [1, 2, 3] },
  schildspange: { shield: [8, 12, 17] },
  stimmgabel: { focus: [1, 2, 3] },
  funkenfaenger: { stacks: [2, 3, 4] },
  ascheglas: { mult: [0.3, 0.5, 0.75] },
  dornenschild: { damage: [5, 8, 12] },
  sanftesLeinen: { ratio: [0.35, 0.55, 0.8] },
  taktgeber: { every: [4, 3, 3], max: [3, 4, 5] },
  resonanzkristall: { cd: [0.15, 0.25, 0.35] },
};

export function tierValue(id: ItemId, key: string, q: Rarity): number {
  const t = TIER_VALUES[id]?.[key];
  if (!t) return 0;
  return t[q === 'common' ? 0 : q === 'magic' ? 1 : 2];
}

const pct = (x: number) => `${Math.round(x * 100)} %`;

export const ITEMS: Record<ItemId, ItemDef> = {
  zunderring: {
    id: 'zunderring',
    name: 'Zunderring',
    unique: false,
    tags: ['glut'],
    text: (v) => `Fähigkeitstreffer des Trägers: +${v('stacks')} Brand`,
    synergy: 'Ideal für Ivo – Funkensturm trifft alle Gegner.',
  },
  schildspange: {
    id: 'schildspange',
    name: 'Schildspange',
    unique: false,
    tags: ['bastion'],
    text: (v) => `Eigene Fähigkeit: +${v('shield')} Schild für den Träger`,
    synergy: 'Mit Dornenschild oder Eid des Bollwerks wird der Schild zur Waffe.',
  },
  stimmgabel: {
    id: 'stimmgabel',
    name: 'Stimmgabel',
    unique: false,
    tags: ['echo'],
    text: (v) => `Kampfbeginn: +${v('focus')} Fokus`,
    synergy: 'Früher Fokus für Taschenuhr, Chor der Namen und Echochronik.',
  },
  funkenfaenger: {
    id: 'funkenfaenger',
    name: 'Funkenfänger',
    unique: false,
    tags: ['glut'],
    text: (v) => `Brennender Gegner stirbt: bis zu ${v('stacks')} Brand springen über`,
    synergy: 'Stark gegen große Gruppen, mit Lauffeuer und Glutherz.',
  },
  ascheglas: {
    id: 'ascheglas',
    name: 'Ascheglas',
    unique: false,
    tags: ['glut'],
    text: (v) => `Brand des Trägers +${pct(v('mult'))} stärker`,
    synergy: 'Gehört zu Ivo, stapelt mit „Heiße Asche“.',
  },
  dornenschild: {
    id: 'dornenschild',
    name: 'Dornenschild',
    unique: false,
    tags: ['bastion'],
    text: (v) => `Geschützt getroffen: ${v('damage')} Gegenschaden`,
    synergy: 'Vorne tragen, mit Schildspange oder Laternenwall.',
  },
  sanftesLeinen: {
    id: 'sanftesLeinen',
    name: 'Sanftes Leinen',
    unique: false,
    tags: ['bastion'],
    text: (v) => `${pct(v('ratio'))} der Überheilung werden Schild`,
    synergy: 'Macht Seras Heilungen immer nützlich.',
  },
  taktgeber: {
    id: 'taktgeber',
    name: 'Taktgeber',
    unique: false,
    tags: ['echo'],
    text: (v) => `Jeder ${v('every')}. Angriff: +1 Fokus (max. ${v('max')}× je Kampf)`,
    synergy: 'Schnelle Angreifer (Ivo) laden ihn zuerst.',
  },
  resonanzkristall: {
    id: 'resonanzkristall',
    name: 'Resonanzkristall',
    unique: false,
    tags: ['echo'],
    text: (v) => `Abklingzeit der Fähigkeit −${pct(v('cd'))}`,
    synergy: 'Mit Echochronik erreichst du den dritten Einsatz früher.',
  },
  glutherz: {
    id: 'glutherz',
    name: 'Glutherz',
    unique: true,
    tags: ['glut'],
    text: () =>
      `5 Brand durch den Träger: Explosion (${ITEM_VALUES.glutherzTarget} Schaden, ${ITEM_VALUES.glutherzSplash} an allen anderen), verbraucht ${ITEM_VALUES.glutherzConsume} Stapel`,
    synergy: 'Funkensturm + Zunderring erreichen schnell 5 Stapel.',
  },
  eidDesBollwerks: {
    id: 'eidDesBollwerks',
    name: 'Eid des Bollwerks',
    unique: true,
    tags: ['bastion'],
    text: () =>
      `Schild des Trägers bricht: andere +${ITEM_VALUES.eidShield} Schild, Angreifer ${ITEM_VALUES.eidDamage} Schaden (alle ${ITEM_VALUES.eidCooldown} s)`,
    synergy: 'Schildspange, Standhaft und Yuumis Schnurrschutz lassen Schilde oft brechen.',
  },
  echochronik: {
    id: 'echochronik',
    name: 'Echochronik',
    unique: true,
    tags: ['echo'],
    text: () => `Jeder 3. Fähigkeitseinsatz (über den Run) wird gratis mit ${pct(ITEM_VALUES.echoPower)} wiederholt`,
    synergy: 'Die Wiederholung zählt nicht als eigener Einsatz.',
  },
};

/** Effekttext eines Exemplars mit seinen tatsächlichen Werten. */
export function itemText(e: EquipItem): string {
  return ITEMS[e.id].text((k) => tierValue(e.id, k, e.q));
}

export const UNIQUE_ITEMS = (Object.keys(ITEMS) as ItemId[]).filter((i) => ITEMS[i].unique);
export const NORMAL_ITEMS = (Object.keys(ITEMS) as ItemId[]).filter((i) => !ITEMS[i].unique);

export interface RelicDef {
  id: RelicId;
  name: string;
  rarity: Rarity;
  tags: BuildTag[];
  short: string;
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
    short: 'Brand hält +3 s länger',
    tags: ['glut'],
    description: 'Brand hält 3 s länger (7 statt 4 s).',
    synergy: 'Stapel bleiben länger bei 5 – gut für Glutherz.',
  },
  aschekompass: {
    id: 'aschekompass',
    name: 'Aschekompass',
    rarity: 'magic',
    short: 'Gegner starten mit 1 Brand',
    tags: ['glut'],
    description: 'Alle Gegner beginnen den Kampf mit 1 Brandstapel.',
    synergy: 'Gibt Funkenfänger und Lauffeuer sofort etwas zum Weitergeben.',
  },
  wappen: {
    id: 'wappen',
    name: 'Wappen der Wache',
    rarity: 'magic',
    short: 'Alle Schilde der Gruppe +50 %',
    tags: ['bastion'],
    description: 'Alle von der Gruppe erzeugten Schilde sind 50 % stärker (gruppenweit, auch Yuumis Schnurrschutz).',
    synergy: 'Verstärkt Laternenwall, Schildspange, Sanftes Leinen und Yuumi.',
  },
  glocke: {
    id: 'glocke',
    name: 'Gesprungene Glocke',
    rarity: 'rare',
    short: 'Erster Schildbruch im Kampf: +2 Fokus',
    tags: ['bastion', 'echo'],
    description: 'Der erste gebrochene Schild eines Verbündeten pro Kampf erzeugt 2 Fokus.',
    synergy: 'Verbindet Bastion und Echo.',
  },
  taschenuhr: {
    id: 'taschenuhr',
    name: 'Taschenuhr ohne Zeiger',
    rarity: 'magic',
    short: 'Erste Fähigkeit im Kampf −2 Fokus',
    tags: ['echo'],
    description: 'Die erste aktive Fähigkeit des Kampfes kostet 2 Fokus weniger (mindestens 0).',
    synergy: 'Sofortiger Funkensturm oder Laternenwall zum Kampfbeginn.',
  },
  chor: {
    id: 'chor',
    name: 'Chor der Namen',
    rarity: 'rare',
    short: 'Jede 3. Fähigkeit heilt alle um 8',
    tags: ['echo', 'bastion'],
    description: 'Jeder 3. manuelle Fähigkeitseinsatz der Gruppe heilt alle lebenden Helden um 8.',
    synergy: 'Viele günstige Fähigkeiten (Laternenwall, Klarer Gedanke) füllen den Chor schnell.',
  },
  mondgloeckchen: {
    id: 'mondgloeckchen',
    name: 'Yuumis Mondglöckchen',
    rarity: 'rare',
    short: 'Yuumi kämpft mit: Pfotenhieb & Schnurrschutz',
    tags: ['glut', 'bastion', 'echo'],
    description:
      'Ruft Yuumi als automatisch kämpfende Begleiterin: Pfotenhieb (4 Schaden alle 3 s auf das Fokusziel); jeder 3. Pfotenhieb gibt der verletztesten Hauptfigur 5 Schild (Schnurrschutz). Einzigartig.',
    flavor: '„Ein silbernes Glöckchen, das auch im dichtesten Nebel leise klingt. Wenn es läutet, ist Yuumi nie weit entfernt.“',
    synergy: 'Schnurrschutz wird von Wappen der Wache und Standhaft verstärkt. Belegt einen Reliktplatz, gilt nur für diesen Run.',
  },
};

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Gewöhnlich',
  magic: 'Magisch',
  rare: 'Selten',
  legendary: 'Legendär',
};
export const RARITY_SYMBOL: Record<Rarity, string> = {
  common: '●',
  magic: '◆',
  rare: '✦',
  legendary: '★',
};
export const TAG_LABEL: Record<BuildTag, string> = { glut: 'Glut', bastion: 'Bastion', echo: 'Echo' };
export const TAG_SYMBOL: Record<BuildTag, string> = { glut: '🔥', bastion: '🛡️', echo: '🔁' };
