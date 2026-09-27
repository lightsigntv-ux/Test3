import { describe, expect, it } from 'vitest';
import { STATUS } from '../src/content/balance';
import { ITEM_VALUES, RELIC_VALUES } from '../src/content/items';
import { SimClock } from '../src/sim/clock';
import { CombatSim } from '../src/sim/combat';
import { setup, sim, stepFor } from './helpers';

describe('Kampfende', () => {
  it('endet mit Sieg und danach passiert nichts mehr', () => {
    const s = sim({ enemies: ['nebelgaenger'] });
    s.runToEnd();
    expect(s.result).toBe('victory');
    const snapshot = JSON.stringify({ t: s.time, h: s.heroes.map((h) => [h.hp, h.shield]), e: s.enemies.map((e) => e.hp), f: s.focus });
    for (let i = 0; i < 200; i++) s.step();
    expect(JSON.stringify({ t: s.time, h: s.heroes.map((h) => [h.hp, h.shield]), e: s.enemies.map((e) => e.hp), f: s.focus })).toBe(snapshot);
    expect(s.command('ivo')).toBe(false);
  });

  it('endet mit Niederlage, wenn alle Helden fallen', () => {
    const s = sim({ enemies: ['nebelkoloss', 'nebelkoloss'], hpScale: 5, dmgScale: 4 });
    s.runToEnd();
    expect(s.result).toBe('defeat');
    expect(s.heroes.every((h) => !h.alive)).toBe(true);
  });

  it('gleichzeitiger Tod mehrerer Helden durch Flächenangriff', () => {
    const s = sim({ enemies: ['aschenhexe'], hp: { fritz: 140, ivo: 3, sera: 3 }, hpScale: 10 });
    s.enemies[0].abilityTimers[0] = 0.05; // Aschenregen sofort vorbereiten
    stepFor(s, 4);
    const dead = s.stats.heroDeaths.map((d) => d.hero).sort();
    expect(dead).toEqual(['ivo', 'sera']);
    expect(s.stats.heroDeaths[0].time).toBeCloseTo(s.stats.heroDeaths[1].time, 5);
    expect(s.result).toBeNull(); // Fritz lebt noch
  });

  it('letzter Gegner stirbt an Brand → Sieg', () => {
    const s = sim({ enemies: ['irrlichtschuetze'], atk: { fritz: 0, ivo: 0, sera: 0 } });
    const e = s.enemies[0];
    e.hp = 2;
    s.applyBurn({ unit: s.hero('ivo')!, kind: 'basic', label: 'Ivo' }, e, 2, 1);
    stepFor(s, 1.2);
    expect(s.result).toBe('victory');
    expect(s.stats.burnDamage).toBeGreaterThan(0);
  });

  it('ist deterministisch bei gleichem Seed', () => {
    const run = () => {
      const s = sim({ enemies: ['nebelgaenger', 'irrlichtschuetze', 'nebelkoloss'], seed: 42, hpScale: 2 });
      s.runToEnd((x) => {
        if (x.focus >= 3) x.command('ivo');
      });
      return JSON.stringify([s.result, s.time.toFixed(2), s.heroes.map((h) => h.hp)]);
    };
    expect(run()).toBe(run());
  });

  it('Zeitlimit: angekündigte Eskalation beendet auch Kämpfe ohne Schaden', () => {
    const s = sim({ enemies: ['nebelschild'], atk: { fritz: 0, ivo: 0, sera: 0 }, hp: { ivo: 0 }, dmgScale: 0.0001 });
    s.runToEnd(undefined, 400);
    expect(s.result).not.toBeNull();
    expect(s.escalationWarned).toBe(true);
    expect(s.stats.escalated).toBe(true);
    expect(s.time).toBeLessThan(s.escalationAt + 60);
  });
});

describe('Geschwindigkeit und Bildrate', () => {
  it('liefert bei 2× und beliebigen Bildraten denselben Zustand zur selben Simulationszeit', () => {
    const a = sim({ enemies: ['nebelgaenger', 'nebelkoloss'], hpScale: 3, seed: 7 });
    const b = sim({ enemies: ['nebelgaenger', 'nebelkoloss'], hpScale: 3, seed: 7 });
    const ca = new SimClock();
    const cb = new SimClock();
    // A: 60 FPS, 1×, 20 s Echtzeit. B: unregelmäßige Bilder, 2×, 10 s Echtzeit.
    for (let i = 0; i < 1200; i++) for (let k = ca.advance(1 / 60, 1, false); k > 0; k--) a.step();
    let t = 0;
    const frames = [0.007, 0.033, 0.016, 0.05, 0.021];
    let i = 0;
    while (t < 10 - 1e-9) {
      const dt = Math.min(frames[i++ % frames.length], 10 - t);
      t += dt;
      for (let k = cb.advance(dt, 2, false); k > 0; k--) b.step();
    }
    expect(Math.abs(a.time - b.time)).toBeLessThan(0.051);
    // gleiche Schrittzahl → identischer Zustand
    while (a.time < b.time - 1e-9) a.step();
    while (b.time < a.time - 1e-9) b.step();
    expect(a.heroes.map((h) => h.hp)).toEqual(b.heroes.map((h) => h.hp));
    expect(a.enemies.map((h) => h.hp)).toEqual(b.enemies.map((h) => h.hp));
  });

  it('Pause führt keine Schritte aus; vorbereitete Befehle laufen beim Fortsetzen', () => {
    const s = sim({ enemies: ['nebelgaenger'], hpScale: 5 });
    const c = new SimClock();
    expect(c.advance(1, 1, true)).toBe(0);
    expect(s.command('fritz')).toBe(true);
    expect(s.hero('fritz')!.abilityCd).toBe(0); // noch nicht ausgeführt
    s.step();
    expect(s.hero('fritz')!.abilityCd).toBeGreaterThan(0);
    expect(s.heroes.every((h) => h.shield > 0)).toBe(true);
  });
});

describe('Zustände', () => {
  it('Brand: maximal 5 Stapel, Erneuerung der Dauer, Ablauf', () => {
    const s = sim({ enemies: ['nebelgaenger'], hpScale: 50, atk: { fritz: 0, ivo: 0, sera: 0 }, hp: { ivo: 0 } });
    const e = s.enemies[0];
    const src = { unit: s.hero('fritz')!, kind: 'proc' as const, label: 'test' };
    s.applyBurn(src, e, 3, 1);
    s.applyBurn(src, e, 4, 1);
    expect(e.burnStacks).toBe(STATUS.burnMaxStacks);
    stepFor(s, 3);
    s.applyBurn(src, e, 1, 1);
    expect(e.burnTime).toBeCloseTo(STATUS.burnDuration, 5);
    stepFor(s, STATUS.burnDuration + 0.2);
    expect(e.burnStacks).toBe(0);
  });

  it('Docht der Morgenröte verlängert Brand der Gruppe', () => {
    const s = sim({ enemies: ['nebelgaenger'], relics: ['docht'] });
    s.applyBurn({ unit: s.hero('ivo')!, kind: 'basic', label: 'Ivo' }, s.enemies[0], 1, 1);
    expect(s.enemies[0].burnTime).toBe(STATUS.burnDuration + RELIC_VALUES.dochtExtra);
  });

  it('Schild absorbiert zuerst, ist begrenzt und verschwindet nach dem Kampf', () => {
    const s = sim({ enemies: ['nebelgaenger'] });
    const f = s.hero('fritz')!;
    s.addShield(f, 1000, { unit: null, kind: 'relic', label: 't' });
    expect(f.shield).toBe(Math.round(f.maxHp * STATUS.shieldCapRatio));
    const hp = f.hp;
    s.dealDamage({ unit: s.enemies[0], kind: 'enemy', label: 'x' }, f, 10, true);
    expect(f.hp).toBe(hp);
    s.runToEnd();
    expect(s.heroes.every((h) => h.shield === 0)).toBe(true);
  });

  it('Verwundbar erhöht erlittenen Schaden um 25 %', () => {
    const s = sim({ enemies: ['nebelgaenger'], hpScale: 10 });
    const e = s.enemies[0];
    const before = e.hp;
    e.vulnerable = 2;
    s.dealDamage({ unit: s.hero('fritz')!, kind: 'basic', label: 'F' }, e, 20, true);
    expect(before - e.hp).toBe(25);
  });

  it('Laternenwall unterbricht nur die Vorbereitung des Fokusziels', () => {
    const s = sim({ enemies: ['nebelkoloss', 'nebelkoloss'], hpScale: 10 });
    const [a, b] = s.enemies;
    a.abilityTimers[0] = 0.05;
    b.abilityTimers[0] = 0.05;
    stepFor(s, 0.2);
    expect(a.windup && b.windup).toBeTruthy();
    s.setFocusTarget(b.uid);
    s.command('fritz');
    s.step();
    expect(b.windup).toBeNull();
    expect(a.windup).not.toBeNull();
    expect(s.stats.interrupts).toBe(1);
  });
});

describe('Kosten, Abklingzeiten, Effektketten', () => {
  it('Taschenuhr: erste Fähigkeit −2 Fokus; Klarer Gedanke mindestens 1', () => {
    const s = sim({ relics: ['taschenuhr'], upgrades: ['klarerGedanke'] });
    expect(s.abilityState('sera').cost).toBe(0); // 3 −1 (min 1) = 2, dann −2 = 0
    expect(s.abilityState('ivo').cost).toBe(1);
    s.command('ivo');
    s.step();
    expect(s.abilityState('sera').cost).toBe(2);
  });

  it('Abklingzeiten haben eine Untergrenze von 3 s', () => {
    const s = sim({ items: { fritz: ['resonanzkristall', 'resonanzkristall'] }, seals: ['echo2'] });
    expect(s.cooldownFor(s.hero('fritz')!)).toBeGreaterThanOrEqual(STATUS.minCooldown);
  });

  it('Echochronik zählt über Kämpfe hinweg (Startwert aus dem Run)', () => {
    const s = sim({ enemies: ['nebelgaenger'], hpScale: 50, items: { fritz: ['echochronik'] } });
    const s2 = new CombatSim({ ...setup({ enemies: ['nebelgaenger'], hpScale: 50, items: { fritz: ['echochronik'] } }), manualUsesStart: { fritz: 2 } });
    s2.command('fritz');
    s2.step();
    stepFor(s2, 1);
    expect(s2.stats.echoRepeats).toBe(1);
    s.command('fritz');
    s.step();
    stepFor(s, 1);
    expect(s.stats.echoRepeats).toBe(0);
  });

  it('Echochronik: Wiederholung zählt nicht als manueller Einsatz und löst keine Schildspange aus', () => {
    const s = sim({ enemies: ['nebelgaenger'], hpScale: 50, items: { fritz: ['echochronik', 'schildspange'] }, focusBonus: 3 });
    const f = s.hero('fritz')!;
    for (let i = 0; i < 3; i++) {
      f.abilityCd = 0;
      s.focus = 6;
      s.command('fritz');
      s.step();
    }
    expect(f.manualUses).toBe(3);
    const shieldBefore = f.shield;
    stepFor(s, 1);
    expect(s.stats.echoRepeats).toBe(1);
    expect(f.manualUses).toBe(3);
    // Wiederholung gibt Wallschild (50 %), aber keine Schildspange (10)
    const wall = Math.round(12 * 0.5);
    expect(f.shield - shieldBefore).toBeLessThanOrEqual(wall);
  });

  it('Glutherz reagiert nur auf primären Brand des Trägers; Explosion verbraucht Stapel', () => {
    const s = sim({ enemies: ['nebelgaenger', 'nebelgaenger'], hpScale: 50, items: { ivo: ['glutherz'] } });
    const ivo = s.hero('ivo')!;
    const [e1] = s.enemies;
    s.applyBurn({ unit: ivo, kind: 'proc', label: 'x' }, e1, 5, 1);
    expect(s.stats.explosions).toBe(0);
    e1.burnStacks = 4;
    s.applyBurn({ unit: ivo, kind: 'basic', label: 'Ivo' }, e1, 1, 1);
    expect(s.stats.explosions).toBe(1);
    expect(e1.burnStacks).toBe(2);
  });

  it('Funkenfänger gibt beim Tod Brand weiter – aber nicht nach Tötung durch Zusatzeffekte', () => {
    const s = sim({ enemies: ['nebelgaenger', 'nebelgaenger', 'nebelgaenger'], hpScale: 10, items: { ivo: ['funkenfaenger'] }, atk: { fritz: 0, ivo: 0, sera: 0 } });
    const [a, b, c] = s.enemies;
    const ivo = s.hero('ivo')!;
    s.applyBurn({ unit: ivo, kind: 'basic', label: 'Ivo' }, a, 4, 1);
    s.dealDamage({ unit: ivo, kind: 'basic', label: 'Ivo' }, a, 9999, true);
    expect(b.burnStacks + c.burnStacks).toBe(3);
    const before = s.stats.transfers;
    b.burnStacks = 3;
    s.dealDamage({ unit: ivo, kind: 'proc', label: 'Explosion' }, b, 9999, false);
    expect(s.stats.transfers).toBe(before);
  });

  it('Taktgeber erzeugt nur begrenzt Fokus pro Kampf', () => {
    const s = sim({ enemies: ['nebelgaenger'], hpScale: 100, items: { ivo: ['taktgeber'] }, atk: { fritz: 0, ivo: 0.001, sera: 0 } });
    stepFor(s, 60);
    expect(s.hero('ivo')!.taktgeberProcs).toBe(ITEM_VALUES.taktgeberMax);
  });
});

describe('Yuumi', () => {
  it('ist nur mit ihrem Relikt anwesend', () => {
    expect(sim().yuumi).toBeNull();
    expect(sim({ relics: ['mondgloeckchen'] }).yuumi).not.toBeNull();
  });

  it('Pfotenhieb alle 3 s, Schnurrschutz nach dem 3. Hieb auf die relativ verletzteste Hauptfigur', () => {
    const s = sim({ enemies: ['nebelgaenger'], relics: ['mondgloeckchen'], hpScale: 50, atk: { fritz: 0, ivo: 0, sera: 0 }, hp: { ivo: 30 } });
    stepFor(s, 2.9);
    expect(s.yuumi!.paws).toBe(0);
    stepFor(s, 0.2);
    expect(s.yuumi!.paws).toBe(1);
    expect(s.stats.yuumiDamage).toBe(RELIC_VALUES.pawDamage);
    stepFor(s, 6);
    expect(s.yuumi!.paws).toBe(3);
    expect(s.yuumi!.purrs).toBe(1);
    expect(s.hero('ivo')!.shield).toBe(RELIC_VALUES.purrShield);
    expect(s.focus).toBeGreaterThanOrEqual(3); // verbraucht keinen Fokus
  });

  it('Schnurrschutz wird von Wappen der Wache (gruppenweit) und Standhaft (auf Fritz) verstärkt', () => {
    const s = sim({ enemies: ['nebelgaenger'], relics: ['mondgloeckchen', 'wappen'], upgrades: ['standhaft'], hpScale: 50, atk: { fritz: 0, ivo: 0, sera: 0 }, hp: { fritz: 20 } });
    stepFor(s, 9.1);
    expect(s.yuumi!.purrs).toBe(1);
    expect(s.hero('fritz')!.shield).toBe(Math.round(RELIC_VALUES.purrShield * (1 + RELIC_VALUES.wappenMult + 0.4)));
  });

  it('Pfotenhiebe lösen keine Heldengegenstände aus und zählen nicht als Heldenangriffe', () => {
    const s = sim({ enemies: ['nebelgaenger', 'nebelgaenger'], relics: ['mondgloeckchen'], items: { ivo: ['funkenfaenger', 'taktgeber'] }, hpScale: 10, atk: { fritz: 0, ivo: 0, sera: 0 } });
    const [a] = s.enemies;
    a.hp = 1;
    a.burnStacks = 3;
    a.burnTime = 99;
    s.yuumi!.timer = 0.01;
    s.step();
    expect(a.alive).toBe(false);
    expect(s.stats.transfers).toBe(0);
    expect(s.hero('ivo')!.autoCount).toBe(0);
  });

  it('Letzter Gegner stirbt durch Yuumi → Sieg, danach keine Katzenaktionen mehr', () => {
    const s = sim({ enemies: ['nebelgaenger'], relics: ['mondgloeckchen'], atk: { fritz: 0, ivo: 0, sera: 0 } });
    s.enemies[0].hp = 1;
    stepFor(s, 3.1);
    expect(s.result).toBe('victory');
    const paws = s.yuumi!.paws;
    for (let i = 0; i < 200; i++) s.step();
    expect(s.yuumi!.paws).toBe(paws);
  });

  it('Niederlage trotz anwesender Yuumi', () => {
    const s = sim({ enemies: ['nebelkoloss', 'nebelkoloss'], relics: ['mondgloeckchen'], hpScale: 10, dmgScale: 6 });
    s.runToEnd();
    expect(s.result).toBe('defeat');
  });

  it('Zähler beginnt in jedem Kampf bei null', () => {
    const a = sim({ relics: ['mondgloeckchen'] });
    stepFor(a, 7);
    const b = new CombatSim(setup({ relics: ['mondgloeckchen'] }));
    expect(b.yuumi!.paws).toBe(0);
  });
});
