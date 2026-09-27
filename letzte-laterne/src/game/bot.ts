// Einfacher Spielbot für Balancing-Simulationen und Tests (nutzt nur öffentliche Aktionen).
import { ITEMS } from '../content/items';
import type { HeroId, ItemId } from '../content/types';
import { HERO_IDS } from '../content/types';
import { CombatSim } from '../sim/combat';
import * as A from './actions';
import { heroStats } from './derive';
import type { SaveData } from './types';

export interface BotOptions {
  skill?: 'good' | 'casual' | 'passive';
  takeCat?: boolean;
  avoidRelic?: string;
  stopBeforeBoss?: boolean;
}

export function combatPolicy(sim: CombatSim, skill: 'good' | 'casual' | 'passive' = 'good') {
  if (skill === 'passive') return;
  // „casual“: reagiert nur alle 1,5 s und unterbricht nicht gezielt
  if (skill === 'casual' && Math.round(sim.time / 0.05) % 30 !== 0) return;
  const enemies = sim.aliveEnemies();
  if (!enemies.length) return;
  const winder = skill === 'good' ? enemies.find((e) => e.windup && e.windup.interruptible) : undefined;
  const healer = enemies.find((e) => e.enemyId === 'saengerin');
  void healer;
  if (skill === 'good') {
    const desired = winder ?? healer ?? enemies.reduce((a, b) => (b.hp < a.hp ? b : a));
    if (sim.focusTargetUid !== desired.uid) sim.setFocusTarget(desired.uid);
  }
  const f = sim.abilityState('fritz');
  const i = sim.abilityState('ivo');
  const s = sim.abilityState('sera');
  const heroes = sim.aliveHeroes();
  const hurt = heroes.some((h) => h.hp / h.maxHp < 0.55);
  const bigWindup = enemies.some((e) => e.windup && !e.windup.interruptible && e.windup.remaining < 1.2);
  if (f.ready && ((winder && sim.focusTargetUid === winder.uid) || bigWindup || sim.focus >= 5)) sim.command('fritz');
  else if (s.ready && (hurt || sim.focus >= 5)) sim.command('sera');
  else if (i.ready && sim.focus >= 3 && (enemies.length >= 2 || sim.focus >= 5 || enemies[0].def!.kind === 'boss')) sim.command('ivo');
}

function bestBearer(save: SaveData, id: ItemId): { hero: HeroId; idx: number } {
  const run = save.run!;
  const tag = ITEMS[id].tags[0];
  const pref: HeroId = tag === 'glut' ? 'ivo' : tag === 'bastion' ? 'fritz' : 'sera';
  const order = [pref, ...HERO_IDS.filter((h) => h !== pref)];
  for (const h of order) {
    const free = run.equipment[h].indexOf(null);
    if (free >= 0) return { hero: h, idx: free };
  }
  return { hero: pref, idx: 0 };
}

/** Spielt einen kompletten Run. Liefert den Endstand und Kennzahlen. */
export function playRun(start: SaveData, opts: BotOptions = {}) {
  let save = start;
  let combatTime = 0;
  let combats = 0;
  const log: string[] = [];
  let guard = 0;
  while (save.run && save.run.phase !== 'result' && guard++ < 200) {
    save = { ...save, dialogQueue: [] };
    const run = save.run!;
    switch (run.phase) {
      case 'map': {
        const st = run.stations[run.station];
        if (st.type === 'choice') {
          const cat = st.alt!.event === 'miauen';
          save = A.enterStation(save, cat && opts.takeCat !== false ? 'event' : cat ? 'fight' : 'event');
        } else save = A.enterStation(save);
        break;
      }
      case 'combat': {
        if (opts.stopBeforeBoss && run.combat?.kind === 'boss') return { save, combatTime, combats, log, outcome: 'none', station: run.station };
        const setup = A.buildCombatSetup(save)!;
        const sim = new CombatSim(setup);
        sim.runToEnd((s) => combatPolicy(s, opts.skill));
        combatTime += sim.time;
        combats++;
        log.push(`${run.station}:${setup.kind}:${sim.result}:${sim.time.toFixed(0)}s:${setup.enemies.join('+')}`);
        const heroHp = { fritz: 0, ivo: 0, sera: 0 } as Record<HeroId, number>;
        const manualUses = { fritz: 0, ivo: 0, sera: 0 } as Record<HeroId, number>;
        for (const h of sim.heroes) {
          heroHp[h.heroId!] = h.alive ? h.hp : 0;
          manualUses[h.heroId!] = h.manualUses;
        }
        save = A.combatFinished(save, {
          result: sim.result ?? 'defeat',
          heroHp,
          manualUses,
          stats: sim.stats,
          enemiesAlive: sim.aliveEnemies().map((e) => ({ name: e.name, hpPct: e.hp / e.maxHp, role: e.def!.role })),
        });
        break;
      }
      case 'reward': {
        const offer = run.reward!;
        const idx = offer.options.findIndex((o) => o.kind === 'item' || (o.kind === 'relic' && o.id !== opts.avoidRelic));
        if (idx < 0) {
          save = A.declineReward(save, true);
          break;
        }
        const o = offer.options[idx];
        if (o.kind === 'item') {
          const b = bestBearer(save, o.id);
          save = A.chooseReward(save, idx, { type: 'hero', hero: b.hero, idx: b.idx });
        } else {
          const free = run.relics.indexOf(null);
          const slot = free >= 0 ? free : run.relics[0] === 'mondgloeckchen' ? 1 : 0;
          save = A.chooseReward(save, idx, { type: 'relic', idx: slot });
        }
        break;
      }
      case 'levelup':
        save = A.chooseUpgrade(save, run.levelOffer![0]);
        break;
      case 'event': {
        const id = run.event!.id;
        const choice = id === 'miauen' ? (opts.takeCat === false ? 1 : 0) : id === 'haendler' ? 1 : 0;
        save = A.chooseEventOption(save, choice);
        break;
      }
      case 'camp': {
        const avg = HERO_IDS.reduce((a, h) => a + run.hp[h] / heroStats(run, h).maxHp, 0) / 3;
        save = A.campChoice(save, avg < 0.75 ? 'heal' : 'loot');
        break;
      }
      case 'ending':
        save = A.chooseEnding(save, 'keep');
        break;
    }
  }
  return { save, combatTime, combats, log, outcome: save.run?.result?.outcome ?? 'none', station: save.run?.station ?? -1 };
}
