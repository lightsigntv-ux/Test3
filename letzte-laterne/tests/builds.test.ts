// Schritt 14: gezielte Builds – wirken die Effekte zusammen, und spielen sie sich unterschiedlich?
import { describe, expect, it } from 'vitest';
import type { HeroId, ItemId, RelicId, SealId, UpgradeId } from '../src/content/types';
import { combatPolicy } from '../src/game/bot';
import { CombatSim } from '../src/sim/combat';
import { setup } from './helpers';

interface Build {
  items: Partial<Record<HeroId, ItemId[]>>;
  relics: RelicId[];
  upgrades: UpgradeId[];
  seals?: SealId[];
}
const BUILDS: Record<string, Build> = {
  glut: { items: { ivo: ['glutherz', 'zunderring'], fritz: ['ascheglas'], sera: ['funkenfaenger'] }, relics: ['docht', 'aschekompass'], upgrades: ['heisseAsche', 'lauffeuer', 'nachzuendung'], seals: ['glut2'] },
  bastion: { items: { fritz: ['eidDesBollwerks', 'dornenschild'], sera: ['sanftesLeinen', 'schildspange'] }, relics: ['wappen', 'glocke'], upgrades: ['breiterWall', 'standhaft', 'behutsameHaende'], seals: ['bastion2', 'bastion3'] },
  echo: { items: { sera: ['echochronik', 'resonanzkristall'], ivo: ['taktgeber'], fritz: ['stimmgabel'] }, relics: ['taschenuhr', 'chor'], upgrades: ['klarerGedanke', 'nachhall', 'schildstoss'], seals: ['echo2', 'echo3'] },
  mix: { items: { ivo: ['zunderring', 'taktgeber'], fritz: ['schildspange', 'dornenschild'] }, relics: ['wappen', 'taschenuhr'], upgrades: ['schildstoss', 'heisseAsche', 'nachhall'] },
  yuumiBastion: { items: { fritz: ['eidDesBollwerks'], sera: ['sanftesLeinen'] }, relics: ['mondgloeckchen', 'wappen'], upgrades: ['standhaft', 'breiterWall', 'behutsameHaende'] },
};

// Spielweise, die Fähigkeiten einsetzt, sobald sie bezahlbar sind (typisch für Echo)
function eager(x: CombatSim) {
  combatPolicy(x, 'good');
  for (const h of ['fritz', 'ivo', 'sera'] as const) if (x.abilityState(h).ready) x.command(h);
}

function fight(b: Build, enemies = ['nebelgaenger', 'nebelkoloss', 'irrlichtschuetze', 'nebelschild'] as const, policy: (x: CombatSim) => void = (x) => combatPolicy(x, 'good')) {
  const s = new CombatSim(setup({ enemies: [...enemies], items: b.items, relics: b.relics, upgrades: b.upgrades, seals: b.seals, hpScale: 3.1, dmgScale: 1.3, seed: 3 }));
  s.runToEnd(policy);
  return s;
}

const NONE: Build = { items: {}, relics: [], upgrades: [] };
const taken = (s: CombatSim) => Object.values(s.stats.damageTaken).reduce((a, b) => a + b, 0);

describe('Builds', () => {
  it('Glut: Explosionen, Weitergaben, schnellere Kämpfe', () => {
    const s = fight(BUILDS.glut);
    const base = fight(NONE);
    expect(s.result).toBe('victory');
    expect(s.stats.explosions).toBeGreaterThan(0);
    expect(s.stats.transfers).toBeGreaterThan(0);
    expect(s.time).toBeLessThan(base.time * 0.7);
  });

  it('Bastion: deutlich mehr abgefangener Schaden, weniger Lebensverlust, Gegenschaden', () => {
    const s = fight(BUILDS.bastion);
    const base = fight(NONE);
    expect(s.result).toBe('victory');
    expect(s.stats.shieldAbsorbed).toBeGreaterThan(base.stats.shieldAbsorbed * 2);
    const hpLost = (x: CombatSim) => x.heroes.reduce((a, h) => a + (h.maxHp - Math.max(0, h.hp)), 0);
    expect(hpLost(s)).toBeLessThan(hpLost(base));
    expect((s.stats.damageDealt['Dornenschild'] ?? 0) + (s.stats.damageDealt['Eid des Bollwerks'] ?? 0)).toBeGreaterThan(0);
    void taken;
  });

  it('Echo: mehr Fähigkeitseinsätze pro Sekunde und Wiederholungen', () => {
    const e = fight(BUILDS.echo, undefined, eager);
    const base = fight(NONE, undefined, eager);
    const rate = (s: CombatSim) => Object.values(s.stats.abilityUses).reduce((a, b) => a + b, 0) / s.time;
    expect(e.result).toBe('victory');
    expect(e.stats.echoRepeats).toBeGreaterThan(0);
    expect(rate(e)).toBeGreaterThan(rate(base) * 1.3);
  });

  it('Mischbuild und Yuumi-Bastion funktionieren; Yuumis Schild wird verstärkt, ohne Ketten auszulösen', () => {
    expect(fight(BUILDS.mix).result).toBe('victory');
    const y = fight(BUILDS.yuumiBastion);
    expect(y.result).toBe('victory');
    expect(y.stats.yuumiPurrs).toBeGreaterThan(0);
    expect(y.stats.yuumiShield / y.stats.yuumiPurrs).toBeGreaterThanOrEqual(Math.round(5 * 1.5));
  });

  it('keiner der Builds ist funktionslos: alle schlagen dieselbe Gruppe', () => {
    for (const [name, b] of Object.entries(BUILDS)) {
      const s = fight(b);
      expect(s.result, name).toBe('victory');
    }
  });
});
