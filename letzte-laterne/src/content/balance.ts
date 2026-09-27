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
  statPerLevel: 0.08,
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
  normalOdds: { common: 0.6, rare: 0.35, legendary: 0.05 },
  eliteOdds: { common: 0.25, rare: 0.6, legendary: 0.15 },
  campOdds: { common: 0, rare: 0.85, legendary: 0.15 },
  eliteRelicChance: 0.6,
  healAlternativePct: 0.15, // kleine Gruppenheilung statt Gegenstand
  longNightLegendaryBonus: 0.1, // Modifikator „Karges Lager“
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
  1: { hp: 2.4, dmg: 1.5 },
  2: { hp: 2.6, dmg: 1.6 },
  3: { hp: 2.8, dmg: 1.7 },
};

export const LONG_NIGHT = {
  swiftWindupMult: 0.7,
  swiftSpecialCdMult: 0.75,
};
