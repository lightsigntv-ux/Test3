import { describe, expect, it } from 'vitest';
import { REWARD } from '../src/content/balance';
import { ITEMS, itemText, tierValue } from '../src/content/items';
import * as A from '../src/game/actions';
import { makeCombatReward } from '../src/game/rewards';
import { SAVE_KEY, loadSave, newSave, type StorageLike } from '../src/game/save';
import { setup } from './helpers';
import { CombatSim } from '../src/sim/combat';

describe('Beute-Qualitätsstufen', () => {
  it('normale Kämpfe: Verteilung entspricht den angegebenen Chancen, Legendär ist wirklich selten', () => {
    const count = { common: 0, magic: 0, rare: 0, legendary: 0 };
    let n = 0;
    for (let seed = 1; seed <= 1500; seed++) {
      const s = A.startRun(newSave(), 1, { seed });
      s.meta.firstEliteLegendaryGiven = true;
      for (const o of makeCombatReward(s.run!, s.meta, 'normal').options) {
        if (o.kind === 'item') {
          count[o.q]++;
          n++;
        }
      }
    }
    for (const q of ['common', 'magic', 'rare', 'legendary'] as const) {
      expect(Math.abs(count[q] / n - REWARD.normalOdds[q]), q).toBeLessThan(0.03);
    }
    expect(count.legendary / n).toBeLessThan(0.04);
  });

  it('legendäre Stufe gibt es nur für Einzelstücke, Einzelstücke nur legendär', () => {
    for (let seed = 1; seed <= 400; seed++) {
      const s = A.startRun(newSave(), 1, { seed });
      for (const src of ['normal', 'elite', 'camp'] as const) {
        for (const o of makeCombatReward(s.run!, s.meta, src).options) {
          if (o.kind !== 'item') continue;
          expect(ITEMS[o.id].unique).toBe(o.q === 'legendary');
        }
      }
    }
  });

  it('höhere Stufe = stärkerer Effekt (Werte steigen monoton, Text zeigt die Zahl)', () => {
    for (const id of Object.keys(ITEMS) as (keyof typeof ITEMS)[]) {
      if (ITEMS[id].unique) continue;
      const texts = (['common', 'magic', 'rare'] as const).map((q) => itemText({ id, q }));
      expect(new Set(texts).size, id).toBeGreaterThan(1);
    }
    expect(tierValue('schildspange', 'shield', 'rare')).toBeGreaterThan(tierValue('schildspange', 'shield', 'common'));
    const shieldOf = (q: 'common' | 'rare') => {
      const s = new CombatSim(setup({ items: { fritz: [{ id: 'schildspange', q }] } }));
      s.command('fritz');
      s.step();
      return s.hero('fritz')!.shield;
    };
    expect(shieldOf('rare')).toBeGreaterThan(shieldOf('common'));
  });

  it('Spielstand Version 1 (Gegenstände als Text) wird auf Stufen migriert', () => {
    const s = A.startRun(newSave(), 1, { seed: 3 });
    const raw = JSON.parse(JSON.stringify(s));
    raw.version = 1;
    raw.run.equipment.ivo = ['glutherz', 'ascheglas'];
    raw.run.equipment.fritz = ['schildspange', null];
    const data: Record<string, string> = { [SAVE_KEY]: JSON.stringify(raw) };
    const st: StorageLike = { getItem: (k) => data[k] ?? null, setItem: (k, v) => void (data[k] = v), removeItem: () => {} };
    const r = loadSave(st);
    expect(r.status).toBe('ok');
    expect(r.save.run!.equipment.ivo).toEqual([{ id: 'glutherz', q: 'legendary' }, { id: 'ascheglas', q: 'rare' }]);
    expect(r.save.run!.equipment.fritz[0]).toEqual({ id: 'schildspange', q: 'common' });
  });
});
