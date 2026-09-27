// Charakterbau: Vorbereitung, Talentpunkte, Ausprägungen und taktische Befehle im Kampf.
import { describe, expect, it } from 'vitest';
import { ARCH_VALUES, ATTR_POINTS, STANCES, SWAP } from '../src/content/builds';
import * as A from '../src/game/actions';
import { heroStats } from '../src/game/derive';
import { newSave } from '../src/game/save';
import { playRun } from '../src/game/bot';
import { sim, stepFor } from './helpers';

describe('Vorbereitung & Talentpunkte', () => {
  it('Run beginnt in der Vorbereitung mit 6 Punkten; Verteilen, Zurücknehmen, Obergrenze', () => {
    let s = A.startRun(newSave(), 1, { seed: 1 });
    expect(s.run!.phase).toBe('prepare');
    expect(s.run!.attrPoints).toBe(ATTR_POINTS.start);
    const hp0 = heroStats(s.run!, 'fritz').maxHp;
    for (let i = 0; i < 6; i++) s = A.allocAttr(s, 'fritz', 'vit', 1);
    expect(s.run!.attrs.fritz.vit).toBe(5); // höchstens 5 je Wert
    expect(s.run!.attrPoints).toBe(1);
    expect(heroStats(s.run!, 'fritz').maxHp).toBe(Math.round(hp0 * 1.6));
    s = A.allocAttr(s, 'fritz', 'vit', -1);
    expect(s.run!.attrPoints).toBe(2);
    s = A.setArchetype(s, 'fritz', 'blades');
    expect(A.setArchetype(s, 'fritz', 'poison')).toBe(s); // falsche Figur
    s = A.confirmPrepare(s);
    expect(s.run!.phase).toBe('map');
    expect(s.run!.hp.fritz).toBe(heroStats(s.run!, 'fritz').maxHp);
    expect(s.meta.lastArchetypes!.fritz).toBe('blades');
    // nach der Vorbereitung: nur noch verteilen, nicht zurücknehmen
    expect(A.allocAttr(s, 'fritz', 'vit', -1)).toBe(s);
    expect(A.setArchetype(s, 'fritz', 'guardian')).toBe(s);
    const before = s.run!.hp.ivo;
    s = A.allocAttr(s, 'ivo', 'vit', 1);
    expect(s.run!.hp.ivo).toBeGreaterThan(before);
  });

  it('Werte wirken: Zwei Klingen schneller und zerbrechlicher, Tempo, Rüstung, Ausweichen', () => {
    const base = { level: 1, upgrades: [], runHpBonus: {} };
    const g = heroStats({ ...base, archetype: { fritz: 'guardian', ivo: 'fire', sera: 'keeper' } }, 'fritz');
    const b = heroStats({ ...base, archetype: { fritz: 'blades', ivo: 'fire', sera: 'keeper' } }, 'fritz');
    expect(b.maxHp).toBeLessThan(g.maxHp);
    expect(b.interval).toBeLessThan(g.interval);
    const attrs = { fritz: { vit: 0, str: 0, arm: 3, eva: 2, spd: 2 }, ivo: { vit: 0, str: 0, arm: 0, eva: 0, spd: 0 }, sera: { vit: 0, str: 0, arm: 0, eva: 0, spd: 0 } };
    const t = heroStats({ ...base, attrs }, 'fritz');
    expect(t.armor).toBeCloseTo(0.18);
    expect(t.dodge).toBeCloseTo(0.12);
    expect(t.interval).toBeCloseTo(g.interval * 0.86);
  });

  it('Levelaufstieg gibt 2 Talentpunkte; der Bot verteilt alles', () => {
    const r = playRun(A.startRun(newSave(), 1, { seed: 21 }), { skill: 'good' });
    const run = r.save.run!;
    expect(run.attrPoints).toBe(0);
    const spent = Object.values(run.attrs).reduce((a, x) => a + Object.values(x).reduce((p, q) => p + q, 0), 0);
    expect(spent).toBe(ATTR_POINTS.start + ATTR_POINTS.perLevel * (run.level - 1));
  });
});

describe('Ausprägungen im Kampf', () => {
  it('Zwei Klingen: Klingenwirbel trifft mehrfach und unterbricht', () => {
    const s = sim({ enemies: ['nebelkoloss'], hpScale: 5, archetypes: { fritz: 'blades' }, focusBonus: 3 });
    stepFor(s, 7.2);
    const k = s.aliveEnemies()[0];
    expect(k.windup).not.toBeNull();
    const hp = k.hp;
    expect(s.command('fritz')).toBe(true);
    s.step();
    expect(k.windup).toBeNull();
    expect(hp - k.hp).toBeGreaterThanOrEqual(ARCH_VALUES.bladesHits * ARCH_VALUES.bladesHitDamage);
  });

  it('Bollwerk: Herausforderung zieht Angriffe auf Fritz, auch wenn er hinten steht', () => {
    const s = sim({ enemies: ['nebelgaenger', 'nebelgaenger'], archetypes: { fritz: 'bulwark' }, formation: ['ivo', 'fritz', 'sera'], focusBonus: 3 });
    s.command('fritz');
    s.step();
    const ivo = s.hero('ivo')!;
    const fritz = s.hero('fritz')!;
    const ivoHp = ivo.hp;
    stepFor(s, 4.5);
    expect(ivo.hp).toBe(ivoHp);
    expect(fritz.provoke).toBeGreaterThan(0);
    expect(fritz.shield + fritz.maxHp - fritz.hp).toBeGreaterThan(0);
  });

  it('Frost: Frostnova verlangsamt und schiebt Vorbereitungen hinaus', () => {
    const s = sim({ enemies: ['nebelkoloss'], hpScale: 5, archetypes: { ivo: 'frost' }, focusBonus: 3 });
    const k = s.aliveEnemies()[0];
    while (!k.windup && s.time < 30) s.step();
    expect(s.time).toBeGreaterThan(7.5); // Eissplitter verlangsamen schon den Aufbau
    const rem = k.windup!.remaining;
    s.command('ivo');
    s.step();
    expect(k.slow).toBeGreaterThan(0);
    expect(k.windup!.remaining).toBeGreaterThan(rem + ARCH_VALUES.frostNovaDelay - 0.2);
  });

  it('Blitz: Kettenblitz trifft mehrere Gegner', () => {
    const s = sim({ enemies: ['nebelgaenger', 'nebelgaenger', 'nebelgaenger'], archetypes: { ivo: 'storm' }, focusBonus: 3 });
    s.command('ivo');
    s.step();
    expect(s.aliveEnemies().filter((e) => e.hp < e.maxHp).length).toBe(3);
  });

  it('Gift: Giftwolke vergiftet und schwächt; Gift verursacht Schaden über Zeit', () => {
    const s = sim({ enemies: ['nebelgaenger', 'nebelgaenger'], archetypes: { sera: 'poison' }, focusBonus: 3, hp: { fritz: 60 } });
    s.command('sera');
    s.step();
    for (const e of s.aliveEnemies()) {
      expect(e.poisonStacks).toBe(ARCH_VALUES.poisonCloudStacks);
      expect(e.weaken).toBeGreaterThan(0);
    }
    stepFor(s, 3);
    expect(s.stats.poisonDamage).toBeGreaterThan(0);
    expect(s.stats.healing).toBe(0); // die Giftmischerin heilt nicht
  });

  it('Sängerin reinigt Gift und Frost', () => {
    const s = sim({ enemies: ['saengerin', 'nebelgaenger'], archetypes: { sera: 'poison' } });
    const g = s.enemies[1];
    s.applyPoison(g, 4, s.hero('sera')!);
    s.applySlow(g, 20);
    g.hp -= 10;
    stepFor(s, 4.2);
    expect(g.poisonStacks).toBe(0);
    expect(g.slow).toBe(0);
  });

  it('Licht: automatische Lichtschilde und Lichtkuppel für alle', () => {
    const s = sim({ enemies: ['nebelgaenger'], archetypes: { sera: 'light' }, focusBonus: 3 });
    s.command('sera');
    s.step();
    for (const h of s.aliveHeroes()) expect(h.shield).toBeGreaterThan(0);
  });
});

describe('Taktik: Haltung, Positionstausch, Rüstung, Ausweichen', () => {
  it('Offensiv erhöht verursachten und erlittenen Schaden, Defensiv senkt beides; Wechsel hat Abklingzeit', () => {
    const run = (st: 'offense' | 'balanced' | 'defense') => {
      const s = sim({ enemies: ['nebelgaenger'], seed: 4, hpScale: 5 });
      if (st !== 'balanced') expect(s.setStance(st)).toBe(true);
      stepFor(s, 4);
      const e = s.enemies[0];
      const taken = s.heroes.reduce((a, h) => a + h.maxHp - h.hp, 0);
      return { dealt: e.maxHp - e.hp, taken, s };
    };
    const o = run('offense');
    const b = run('balanced');
    const d = run('defense');
    expect(o.dealt).toBeGreaterThan(b.dealt);
    expect(d.dealt).toBeLessThan(b.dealt);
    expect(o.taken).toBeGreaterThanOrEqual(b.taken);
    expect(d.taken).toBeLessThan(b.taken);
    expect(STANCES.offense.dealt).toBeGreaterThan(1);
    expect(o.s.setStance('defense')).toBe(true);
    expect(o.s.setStance('offense')).toBe(false); // Abklingzeit
  });

  it('Positionstausch kostet Fokus, ändert das Ziel der Gegner und hat Abklingzeit', () => {
    const s = sim({ enemies: ['nebelgaenger'] });
    const f0 = s.focus;
    expect(s.swapReason('fritz')).toMatch(/bereits vorn/);
    expect(s.swapToFront('sera')).toBe(true);
    expect(s.focus).toBe(f0 - SWAP.cost);
    expect(s.frontHero()!.heroId).toBe('sera');
    expect(s.formation()).toEqual(['sera', 'ivo', 'fritz']);
    expect(s.swapToFront('fritz')).toBe(false);
    stepFor(s, 2.5);
    expect(s.hero('sera')!.hp).toBeLessThan(s.hero('sera')!.maxHp);
    expect(s.hero('fritz')!.hp).toBe(s.hero('fritz')!.maxHp);
  });

  it('Rüstung senkt Schaden, Ausweichen lässt Grundangriffe verfehlen', () => {
    const a = sim({ enemies: ['nebelgaenger'], seed: 3 });
    const b = sim({ enemies: ['nebelgaenger'], seed: 3, armor: { fritz: 0.3 } });
    stepFor(a, 10);
    stepFor(b, 10);
    const lossA = a.hero('fritz')!.maxHp - a.hero('fritz')!.hp;
    const lossB = b.hero('fritz')!.maxHp - b.hero('fritz')!.hp;
    expect(lossB).toBeLessThan(lossA);
    const c = sim({ enemies: ['nebelgaenger', 'nebelgaenger'], seed: 3, dodge: { fritz: 0.4 }, hp: { fritz: 500 } });
    stepFor(c, 30);
    expect(c.stats.dodges).toBeGreaterThan(0);
  });

  it('Angriffsbalken: Fortschritt steigt bis zum Angriff und fällt dann zurück', () => {
    const s = sim({ enemies: ['nebelgaenger'] });
    const f = s.hero('fritz')!;
    const p0 = s.attackProgress(f);
    stepFor(s, 0.5);
    expect(s.attackProgress(f)).toBeGreaterThan(p0);
    const e = s.enemies[0];
    expect(s.attackProgress(e)).toBeGreaterThanOrEqual(0);
    expect(s.attackProgress(e)).toBeLessThanOrEqual(1);
  });
});
