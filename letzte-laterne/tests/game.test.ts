import { describe, expect, it } from 'vitest';
import { LEVEL } from '../src/content/balance';
import * as A from '../src/game/actions';
import { playRun } from '../src/game/bot';
import { yuumiPresent } from '../src/game/derive';
import { makeCombatReward } from '../src/game/rewards';
import { newSave } from '../src/game/save';
import type { SaveData } from '../src/game/types';
import { CombatSim } from '../src/sim/combat';

function fresh(): SaveData {
  return newSave();
}

function winCombat(s: SaveData): SaveData {
  const sim = new CombatSim(A.buildCombatSetup(s)!);
  return A.combatFinished(s, {
    result: 'victory',
    heroHp: { fritz: sim.heroes.find((h) => h.heroId === 'fritz')!.hp, ivo: 50, sera: 0 },
    stats: sim.stats,
    enemiesAlive: [],
  });
}

function loseCombat(s: SaveData): SaveData {
  const sim = new CombatSim(A.buildCombatSetup(s)!);
  return A.combatFinished(s, { result: 'defeat', heroHp: { fritz: 0, ivo: 0, sera: 0 }, stats: sim.stats, enemiesAlive: [] });
}

describe('Run-Aufbau', () => {
  it('erzeugt 8 Stationen in der vorgegebenen Reihenfolge', () => {
    const s = A.startRun(fresh(), 1, { seed: 3 });
    expect(s.run!.stations.map((x) => x.type)).toEqual(['fight', 'choice', 'fight', 'story', 'elite', 'camp', 'hardFight', 'boss']);
  });

  it('garantiert „Ein Miauen im Nebel“ an Station 2 der ersten Vorstadt-Expedition, Kampfroute bleibt wählbar', () => {
    let s = A.startRun(fresh(), 1, { seed: 3 });
    expect(s.run!.stations[1].alt!.event).toBe('miauen');
    expect(s.run!.stations[1].alt!.catGuaranteed).toBe(true);
    s = winCombat(A.enterStation(s));
    s = A.declineReward(s, true);
    while (s.run!.phase === 'levelup') s = A.chooseUpgrade(s, s.run!.levelOffer![0]);
    expect(s.run!.station).toBe(1);
    const viaFight = A.enterStation(s, 'fight');
    expect(viaFight.run!.phase).toBe('combat');
    expect(viaFight.meta.catGuaranteeUsed).toBe(true);
    // nächster Run: nicht mehr garantiert
    const next = A.startRun({ ...viaFight, run: null }, 1, { seed: 3 });
    expect(next.run!.stations[1].alt!.catGuaranteed).toBe(false);
  });

  it('Katzenereignis: Mitnehmen gibt das Relikt und −1 Fokus im nächsten Kampf', () => {
    let s = A.startRun(fresh(), 1, { seed: 3 });
    s.run!.station = 1;
    s = A.enterStation(s, 'event');
    expect(s.run!.event!.id).toBe('miauen');
    const taken = A.chooseEventOption(s, 0);
    expect(taken.run!.relics).toContain('mondgloeckchen');
    expect(yuumiPresent(taken.run)).toBe(true);
    expect(taken.run!.nextFocusBonus).toBe(-1);
    expect(taken.meta.yuumiDiscovered).toBe(true);
    expect(taken.dialogQueue).toContain('cat_join');
    const rest = A.chooseEventOption(s, 1);
    expect(rest.run!.relics).not.toContain('mondgloeckchen');
    expect(rest.run!.nextFocusBonus).toBe(0);
  });

  it('Katzenereignis mit zwei belegten Reliktplätzen: Ersetzen mit Vergleich oder Ablehnen ohne Nachteil', () => {
    let s = A.startRun(fresh(), 1, { seed: 3 });
    s.run!.station = 1;
    s.run!.relics = ['wappen', 'docht'];
    s = A.chooseEventOption(A.enterStation(s, 'event'), 0);
    expect(s.run!.phase).toBe('reward');
    expect(s.run!.reward!.options).toEqual([{ kind: 'relic', id: 'mondgloeckchen' }]);
    const declined = A.declineReward(s, false);
    expect(declined.run!.nextFocusBonus).toBe(0);
    expect(declined.run!.relics).toEqual(['wappen', 'docht']);
    const replaced = A.chooseReward(s, 0, { type: 'relic', idx: 1 });
    expect(replaced.run!.relics).toEqual(['wappen', 'mondgloeckchen']);
    expect(replaced.run!.nextFocusBonus).toBe(-1);
    // Relikt ablegen entfernt Yuumi
    const removed = A.discardRelic(replaced, 1);
    expect(yuumiPresent(removed.run)).toBe(false);
    const setup = A.buildCombatSetup(A.enterStation(removed));
    expect(setup!.relics).not.toContain('mondgloeckchen');
  });

  it('Yuumis Entdeckung aktiviert sie nicht dauerhaft im nächsten Run', () => {
    const s = fresh();
    s.meta.yuumiDiscovered = true;
    const r = A.startRun(s, 1, { seed: 9 });
    expect(yuumiPresent(r.run)).toBe(false);
  });
});

describe('Belohnungen', () => {
  it('keine Duplikate, ausgerüstete Relikte werden nicht angeboten, Erstfund-Legendär einmalig', () => {
    for (let seed = 1; seed < 60; seed++) {
      const s = A.startRun(fresh(), 1, { seed });
      s.run!.relics = ['mondgloeckchen', null];
      const meta = s.meta;
      const elite = makeCombatReward(s.run!, meta, 'elite');
      const ids = elite.options.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).not.toContain('mondgloeckchen');
      expect(elite.options[0].kind === 'item' && ['glutherz', 'eidDesBollwerks', 'echochronik'].includes(elite.options[0].id)).toBe(true);
      expect(meta.firstEliteLegendaryGiven).toBe(true);
      const again = makeCombatReward(s.run!, meta, 'elite');
      expect(again.note).toBeUndefined();
      const normal = makeCombatReward(s.run!, meta, 'normal');
      expect(new Set(normal.options.map((o) => o.id)).size).toBe(3);
    }
  });

  it('gleicher Seed → gleiches Angebot (reproduzierbar)', () => {
    const a = A.startRun(fresh(), 1, { seed: 77 });
    const b = A.startRun(fresh(), 1, { seed: 77 });
    expect(makeCombatReward(a.run!, a.meta, 'normal')).toEqual(makeCombatReward(b.run!, b.meta, 'normal'));
  });

  it('mindestens eine Option passt zum bestehenden Build', () => {
    for (let seed = 1; seed < 40; seed++) {
      const s = A.startRun(fresh(), 1, { seed });
      s.run!.equipment.ivo = [{ id: 'ascheglas', q: 'rare' }, { id: 'zunderring', q: 'common' }];
      const o = makeCombatReward(s.run!, s.meta, 'normal');
      expect(o.options.some((x) => x.kind === 'item' && ['zunderring', 'funkenfaenger', 'ascheglas', 'glutherz'].includes(x.id))).toBe(true);
    }
  });

  it('doppeltes Klicken auf eine Belohnung vergibt nur einmal', () => {
    let s = A.startRun(fresh(), 1, { seed: 5 });
    s = winCombat(A.enterStation(s));
    expect(s.run!.phase).toBe('reward');
    const once = A.chooseReward(s, 0, { type: 'hero', hero: 'fritz', idx: 0 });
    const twice = A.chooseReward(once, 1, { type: 'hero', hero: 'fritz', idx: 1 });
    expect(twice).toBe(once);
    expect(twice.run!.equipment.fritz[1]).toBeNull();
  });

  it('gewählte Ausrüstung wirkt im nächsten Kampf', () => {
    let s = A.startRun(fresh(), 1, { seed: 5 });
    s = winCombat(A.enterStation(s));
    s.run!.reward!.options[0] = { kind: 'item', id: 'stimmgabel', q: 'magic' };
    s = A.chooseReward(s, 0, { type: 'hero', hero: 'sera', idx: 0 });
    while (s.run!.phase === 'levelup') s = A.chooseUpgrade(s, s.run!.levelOffer![0]);
    const setup = A.buildCombatSetup(A.enterStation(s, 'fight'))!;
    expect(new CombatSim(setup).focus).toBe(5);
  });
});

describe('Level und Rückkehr nach Siegen', () => {
  it('steigt bei den XP-Schwellen auf und bietet nur ungewählte Verbesserungen', () => {
    let s = A.startRun(fresh(), 1, { seed: 11 });
    s = winCombat(A.enterStation(s));
    expect(s.run!.level).toBe(2);
    s = A.declineReward(s, false);
    expect(s.run!.phase).toBe('levelup');
    const pick = s.run!.levelOffer![0];
    s = A.chooseUpgrade(s, pick);
    expect(s.run!.upgrades).toEqual([pick]);
    s.run!.pendingLevelUps = 1;
    s.run!.phase = 'reward';
    s.run!.reward = { source: 'normal', title: '', options: [], healAlt: 0, oddsText: '' };
    s = A.declineReward(s, false);
    expect(s.run!.levelOffer).not.toContain(pick);
    expect(LEVEL.thresholds).toEqual([10, 30, 55]);
  });

  it('besiegte Helden kehren nach einem Sieg mit 20 % zurück', () => {
    let s = A.startRun(fresh(), 1, { seed: 11 });
    s = winCombat(A.enterStation(s));
    expect(s.run!.hp.sera).toBe(Math.round(95 * 1.08 * 0.2));
  });
});

describe('Erinnerungslicht und Siegel', () => {
  it('sofortiges Aufgeben bringt kein Licht; Niederlage behält verdientes Licht', () => {
    const quit = A.abandonRun(A.startRun(fresh(), 1, { seed: 1 }));
    expect(quit.run!.result!.lightEarned).toBe(0);
    expect(quit.meta.light).toBe(0);
    let s = A.startRun(fresh(), 1, { seed: 1 });
    s = winCombat(A.enterStation(s));
    s = A.declineReward(s, true);
    while (s.run!.phase === 'levelup') s = A.chooseUpgrade(s, s.run!.levelOffer![0]);
    s = loseCombat(A.enterStation(s, 'fight'));
    expect(s.run!.result!.outcome).toBe('defeat');
    expect(s.meta.light).toBe(1);
    expect(s.run!.result!.analysis.length).toBeGreaterThan(0);
    s = A.closeResult(s);
    expect(s.run).toBeNull();
    expect(s.meta.light).toBe(1);
  });

  it('Kauf braucht Vorgänger und Licht; max. 3 aktiv, Belastung ≤ 4, Aktivierung ohne aktiven Vorgänger', () => {
    let s = fresh();
    s.meta.light = 100;
    expect(A.buySeal(s, 'glut2')).toBe(s);
    s = A.buySeal(s, 'glut1');
    s = A.buySeal(s, 'glut2');
    s = A.buySeal(s, 'glut3');
    expect(s.meta.sealsActive).toEqual(['glut1', 'glut2', 'glut3']); // Belastung 1+1+2 = 4
    s = A.buySeal(s, 'echo1');
    expect(s.meta.sealsOwned).toContain('echo1');
    expect(s.meta.sealsActive).not.toContain('echo1'); // schon 3 aktiv
    expect(A.canActivateSeal(s.meta, 'echo1').ok).toBe(false);
    s = A.toggleSeal(s, 'glut1');
    s = A.toggleSeal(s, 'glut2');
    s = A.toggleSeal(s, 'echo1');
    expect(s.meta.sealsActive).toEqual(['glut3', 'echo1']); // Stufe 3 ohne aktiven Vorgänger
    s.meta.sealsOwned.push('bastion1', 'bastion2');
    s = A.toggleSeal(s, 'bastion1');
    expect(A.canActivateSeal(s.meta, 'bastion2').reason).toMatch(/Höchstens 3/);
    s = A.toggleSeal(s, 'bastion1');
    s = A.toggleSeal(s, 'glut1');
    expect(A.sealLoad(s.meta.sealsActive)).toBe(4);
    expect(A.canActivateSeal(s.meta, 'bastion1').ok).toBe(false);
    expect(s.meta.light).toBe(100 - 2 - 4 - 6 - 2);
  });

  it('Startgegenstände aus aktiven Siegeln landen beim gewählten Träger', () => {
    const s = fresh();
    s.meta.sealsOwned = ['bastion1', 'echo1'];
    s.meta.sealsActive = ['bastion1', 'echo1'];
    const r = A.startRun(s, 1, { seed: 2, bearers: { schildspange: 'sera' } });
    expect(r.run!.equipment.sera.map((x) => x?.id)).toContain('schildspange');
    expect(r.run!.equipment.sera.map((x) => x?.id)).toContain('stimmgabel');
    expect(r.run!.equipment.sera.every((x) => x?.q === 'magic')).toBe(true);
  });
});

describe('Story, Bosse und Enden', () => {
  it('Botin gerettet → Archivarin-Kampf verändert; Namen befreit → Hüter geschwächt', () => {
    const s = fresh();
    s.meta.unlockedExpedition = 3;
    s.meta.story.courierSaved = true;
    s.meta.story.namesFreed = true;
    const r2 = A.startRun(s, 2, { seed: 4 });
    r2.run!.station = 7;
    const setup2 = A.buildCombatSetup(A.enterStation(r2))!;
    expect(setup2.flags.courierHelps).toBe(true);
    const archivarin = new CombatSim(setup2).enemies[0];
    expect(archivarin.vulnerable).toBeGreaterThan(0);
    const r3 = A.startRun(s, 3, { seed: 4 });
    r3.run!.station = 7;
    const hueter = new CombatSim(A.buildCombatSetup(A.enterStation(r3))!).enemies[0];
    expect(hueter.hp).toBeLessThan(hueter.maxHp);
  });

  it('Bossieg schaltet die nächste Expedition frei und gibt Erstsieg-Bonus', () => {
    let s = A.startRun(fresh(), 1, { seed: 4 });
    s.run!.station = 7;
    s = winCombat(A.enterStation(s));
    expect(s.meta.unlockedExpedition).toBe(2);
    expect(s.meta.light).toBe(4 + 3);
    expect(s.run!.phase).toBe('result');
    expect(s.dialogQueue).toContain('boss1_after');
  });

  it('beide Enden – mit und ohne Yuumi – und danach Lange Nacht', () => {
    for (const ending of ['keep', 'extinguish'] as const) {
      for (const cat of [true, false]) {
        const base = fresh();
        base.meta.unlockedExpedition = 3;
        let s = A.startRun(base, 3, { seed: 8 });
        if (cat) s.run!.relics[0] = 'mondgloeckchen';
        s.run!.station = 7;
        s = winCombat(A.enterStation(s));
        expect(s.run!.phase).toBe('ending');
        s = A.chooseEnding(s, ending);
        expect(s.meta.story.ending).toBe(ending);
        expect(s.meta.story.endingWithYuumi).toBe(cat);
        expect(s.dialogQueue).toContain(`ending_${ending}`);
        s = A.closeResult(s);
        const ln = A.startRun(s, 1, { seed: 1, mods: ['swift', 'reinforced', 'meagerCamp'] });
        expect(ln.run!.longNight).toBe(true);
        expect(ln.run!.memory).toBe(true);
        expect(ln.run!.stations[0].encounter!.length).toBeGreaterThan(s.run === null ? 1 : 0);
        // Yuumi bleibt regulär auffindbar (hier noch garantiert, da die Vorstadt-Station 2 nie erreicht wurde)
        expect(ln.run!.stations[1].alt!.event).toBe('miauen');
      }
    }
  });

  it('Lange Nacht ist vor dem Storyabschluss gesperrt', () => {
    const s = A.startRun(fresh(), 1, { mods: ['swift'] });
    expect(s.run).toBeNull();
  });
});

describe('Vollständige Runs (Bot)', () => {
  it('spielt alle drei Expeditionen ohne Fehler bis zum Ergebnis', () => {
    for (const exp of [1, 2, 3] as const) {
      for (let seed = 1; seed <= 4; seed++) {
        const s = fresh();
        s.meta.unlockedExpedition = 3;
        const r = playRun(A.startRun(s, exp, { seed }));
        expect(r.save.run!.phase).toBe('result');
        expect(r.save.meta.light).toBe(r.save.run!.lightEarned);
      }
    }
  });

  it('Lange Nacht mit allen Modifikatoren ist spielbar und wird protokolliert', () => {
    const s = fresh();
    s.meta.unlockedExpedition = 3;
    s.meta.story.ending = 'keep';
    const r = playRun(A.startRun(s, 1, { seed: 3, mods: ['swift', 'reinforced', 'meagerCamp'] }));
    expect(r.save.meta.longNight.history.length).toBe(1);
  });
});
