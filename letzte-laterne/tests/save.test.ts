import { describe, expect, it } from 'vitest';
import * as A from '../src/game/actions';
import { CombatSim } from '../src/sim/combat';
import { CORRUPT_KEY, SAVE_KEY, exportSave, importSave, loadSave, newSave, writeSave, type StorageLike } from '../src/game/save';

function memStorage(init: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...init };
  return {
    data,
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => void (data[k] = v),
    removeItem: (k) => void delete data[k],
  };
}

describe('Spielstand', () => {
  it('speichert und lädt verlustfrei (inkl. Relikte, Katzenentscheidung, Siegel, Story)', () => {
    let s = A.startNewGame();
    s.meta.light = 7;
    s.meta.sealsOwned = ['glut1'];
    s.meta.sealsActive = ['glut1'];
    s.meta.story.courierSaved = true;
    s.meta.firstEliteLegendaryGiven = true;
    s = A.startRun(s, 1, { seed: 123 });
    s.run!.relics = ['mondgloeckchen', null];
    s.meta.catGuaranteeUsed = true;
    const st = memStorage();
    writeSave(st, s);
    const loaded = loadSave(st);
    expect(loaded.status).toBe('ok');
    expect(loaded.save.run).toEqual(s.run);
    expect(loaded.save.meta).toEqual(s.meta);
  });

  it('Neuladen im Kampf startet denselben Kampf mit demselben Seed', () => {
    let s = A.startRun(newSave(), 1, { seed: 55 });
    s = A.enterStation(s);
    const st = memStorage();
    writeSave(st, s);
    const re = loadSave(st).save;
    expect(re.run!.phase).toBe('combat');
    expect(A.buildCombatSetup(re)).toEqual(A.buildCombatSetup(s));
  });

  it('Neuladen bei einer Belohnung zeigt dasselbe Angebot, keine doppelte Beute', () => {
    let s = A.startRun(newSave(), 1, { seed: 55 });
    s = A.enterStation(s);
    s = A.combatFinished(s, { result: 'victory', heroHp: { fritz: 100, ivo: 80, sera: 80 }, stats: new CombatSim(A.buildCombatSetup(s)!).stats, enemiesAlive: [] });
    const st = memStorage();
    writeSave(st, s);
    const re = loadSave(st).save;
    expect(re.run!.reward).toEqual(s.run!.reward);
    const after = A.chooseReward(re, 0, { type: 'hero', hero: 'fritz', idx: 0 });
    writeSave(st, after);
    const re2 = loadSave(st).save;
    expect(re2.run!.phase).not.toBe('reward');
    expect(A.chooseReward(re2, 0, { type: 'hero', hero: 'ivo', idx: 0 })).toBe(re2);
  });

  it('beschädigter Spielstand: Sicherung, Hinweis, neues Spiel', () => {
    const st = memStorage({ [SAVE_KEY]: '{kaputt' });
    const r = loadSave(st);
    expect(r.status).toBe('corrupt');
    expect(r.save.notice).toBeTruthy();
    expect(st.data[CORRUPT_KEY]).toBe('{kaputt');
  });

  it('ungültige Expedition wird verworfen, dauerhafter Fortschritt bleibt', () => {
    const s = A.startRun(newSave(), 1, { seed: 1 });
    s.meta.light = 9;
    const raw = JSON.parse(JSON.stringify(s));
    raw.run.relics = ['mondgloeckchen', 'mondgloeckchen']; // Einzigartigkeit verletzt
    const st = memStorage({ [SAVE_KEY]: JSON.stringify(raw) });
    const r = loadSave(st);
    expect(r.status).toBe('recovered');
    expect(r.save.run).toBeNull();
    expect(r.save.meta.light).toBe(9);
  });

  it('migriert ältere Stände ohne Versionsnummer', () => {
    const old = newSave() as unknown as Record<string, unknown>;
    delete old.version;
    delete old.settings;
    delete old.dialogQueue;
    const m = (old.meta as Record<string, unknown>);
    delete m.longNight;
    const st = memStorage({ [SAVE_KEY]: JSON.stringify(old) });
    const r = loadSave(st);
    expect(r.status).toBe('ok');
    expect(r.save.version).toBe(1);
    expect(r.save.settings.volume).toBeGreaterThan(0);
    expect(r.save.meta.longNight.wins).toBe(0);
  });

  it('lehnt Stände aus neueren Versionen und fremde Dateien beim Import ab', () => {
    expect(importSave(JSON.stringify({ ...newSave(), version: 99 })).ok).toBe(false);
    expect(importSave('{"hallo":1}').ok).toBe(false);
    expect(importSave('nicht json').ok).toBe(false);
    const good = importSave(exportSave(A.startRun(newSave(), 1, { seed: 1 })));
    expect(good.ok).toBe(true);
  });
});
