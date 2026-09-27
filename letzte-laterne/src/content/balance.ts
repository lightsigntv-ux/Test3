// Zentrale Balancewerte. Alle Zahlen, die das Spielgefühl bestimmen, stehen hier
// oder in den jeweiligen Inhaltstabellen (heroes, enemies, items, …).

export const SIM = {
  dt: 0.05, // fester Simulationsschritt in Sekunden
};

export const FOCUS = {
  max: 6,
  start: 3,
  regenInterval: 5,
};

export const STATUS = {
  burnMaxStacks: 5,
  burnDuration: 4,
  burnDamagePerStack: 1.5, // Schaden je Stapel und Sekunde (Stärke 1)
  enemyBurnPotency: 0.5, // gegnerischer Brand: Stärke = 0,5 × Schadensfaktor der Expedition
  vulnerableDuration: 4,
  vulnerableBonus: 0.25,
  shieldCapRatio: 0.6, // Schild höchstens 60 % der max. HP
  minCooldown: 3,
};

export const ESCALATION = {
  normal: 75,
  elite: 90,
  boss: 150,
  warnAhead: 15,
  pctPerSecondPerSecond: 0.005, // Nebelschaden: 0,5 % max HP × Sekunden seit Eskalation
  healMult: 0.5,
};

export const LEVEL = {
  thresholds: [10, 30, 55], // XP für Level 2, 3, 4
  maxLevel: 4,
  statPerLevel: 0.04,
  xp: { fight: 10, hardFight: 15, elite: 20, event: 5, boss: 0 },
};

export const REVIVE_RATIO = 0.2;

export const LIGHT = {
  fight: 1,
  elite: 2,
  boss: 4,
  firstBossBonus: 3,
  longNightPerMod: 1,
};

export const REWARD = {
  // Qualität je Beute-Option (wie in Diablo): Gewöhnlich / Magisch / Selten / Legendär
  normalOdds: { common: 0.55, magic: 0.3, rare: 0.13, legendary: 0.02 },
  eliteOdds: { common: 0.15, magic: 0.45, rare: 0.32, legendary: 0.08 },
  campOdds: { common: 0, magic: 0.5, rare: 0.44, legendary: 0.06 },
  workshopOdds: { common: 0.45, magic: 0.4, rare: 0.15, legendary: 0 },
  merchantOdds: { common: 0, magic: 0, rare: 0.78, legendary: 0.22 },
  eliteRelicChance: 0.6,
  healAlternativePct: 0.15, // kleine Gruppenheilung statt Gegenstand
  longNightLegendaryBonus: 0.05, // Modifikator „Karges Lager“
};

export const CAMP = {
  healPct: 0.4,
  meagerHealPct: 0.2,
};

export const SEALS = {
  maxActive: 3,
  loadBudget: 4,
};

// Gegnerstärke je Expedition
export const EXPEDITION_SCALE: Record<1 | 2 | 3, { hp: number; dmg: number }> = {
  1: { hp: 3.1, dmg: 1.4 },
  2: { hp: 3.3, dmg: 1.45 },
  3: { hp: 3.4, dmg: 1.5 },
};

/** Steigerung innerhalb einer Expedition je Station (0–7): spätere Kämpfe sind härter. */
export const STATION_RAMP = { hp: 0.03, dmg: 0.03 };

export const LONG_NIGHT = {
  swiftWindupMult: 0.7,
  swiftSpecialCdMult: 0.75,
};
