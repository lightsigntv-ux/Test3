// Tooltips mit tatsächlich berechneten Werten des aktuellen Builds.
import { STATUS } from '../content/balance';
import type { WindupEffect } from '../content/enemies';
import { ABILITY_VALUES, HEROES } from '../content/heroes';
import { ITEMS, ITEM_VALUES, RELIC_VALUES } from '../content/items';
import { SEAL_VALUES, UPGRADE_VALUES } from '../content/progression';
import type { HeroId, ItemId } from '../content/types';
import { heroStats } from './derive';
import type { RunState } from './types';

const r = (n: number) => Math.round(n);

export function shieldMultFor(run: RunState, target: HeroId): number {
  let m = 1;
  if (run.relics.includes('wappen')) m += RELIC_VALUES.wappenMult;
  if (target === 'fritz' && run.upgrades.includes('standhaft')) m += UPGRADE_VALUES.standhaftMult;
  return m;
}

function items(run: RunState, h: HeroId): ItemId[] {
  return run.equipment[h].filter((x): x is ItemId => !!x);
}

export function abilityCost(run: RunState, h: HeroId): number {
  let c = HEROES[h].ability.cost;
  if (h === 'sera' && run.upgrades.includes('klarerGedanke')) c = Math.max(1, c - 1);
  return c;
}

export function abilityCooldown(run: RunState, h: HeroId): number {
  const n = items(run, h).filter((i) => i === 'resonanzkristall').length;
  return Math.max(STATUS.minCooldown, HEROES[h].ability.cooldown * Math.max(0, 1 - ITEM_VALUES.resonanzMult * n));
}

/** Zeilen mit berechneter Wirkung der aktiven Fähigkeit. */
export function abilityLines(run: RunState, h: HeroId): string[] {
  const st = heroStats(run, h);
  const m = st.mult;
  const its = items(run, h);
  const lines: string[] = [];
  const cost = abilityCost(run, h);
  lines.push(`Kosten: ${cost} Fokus${run.relics.includes('taschenuhr') ? ' (erste Fähigkeit im Kampf −2)' : ''} · Abklingzeit ${abilityCooldown(run, h).toFixed(1).replace('.', ',')} s${
    run.seals.includes('echo2') ? ' (erster Einsatz −40 %)' : ''
  }`);
  if (h === 'fritz') {
    const base = (ABILITY_VALUES.wallShield + (run.upgrades.includes('breiterWall') ? UPGRADE_VALUES.breiterWallBonus : 0)) * m;
    lines.push(`Schild je Held: ${r(base * shieldMultFor(run, 'ivo'))}${run.upgrades.includes('standhaft') ? `, Fritz selbst ${r(base * shieldMultFor(run, 'fritz'))}` : ''}`);
    lines.push('Unterbricht die unterbrechbare Vorbereitung des Fokusziels.');
    if (run.upgrades.includes('schildstoss'))
      lines.push(`Schildstoß: ${r(UPGRADE_VALUES.schildstossDamage * m)} Schaden + ${UPGRADE_VALUES.schildstossVulnerable} s Verwundbar am Fokusziel`);
  } else if (h === 'ivo') {
    let stacks = ABILITY_VALUES.stormBurn + its.filter((i) => i === 'zunderring').length;
    const extra = run.seals.includes('glut2') ? ` (erster Funkensturm im Kampf +${SEAL_VALUES.glut2Stacks})` : '';
    lines.push(`${r(ABILITY_VALUES.stormDamage * m)} Schaden an allen Gegnern, je ${stacks} Brandstapel${extra}`);
    lines.push(`Brand: ${burnPerStack(run, h).toFixed(1).replace('.', ',')} Schaden je Stapel und Sekunde`);
    if (run.upgrades.includes('nachzuendung')) lines.push(`Nachzündung: nach 1,5 s nochmals ${r(ABILITY_VALUES.stormDamage * m * 0.5)} Schaden + 1 Stapel`);
    stacks = 0;
  } else {
    lines.push(`Heilt die zwei verletztesten Verbündeten um je ${r(ABILITY_VALUES.memoryHeal * m)}`);
    if (run.upgrades.includes('nachhall')) lines.push(`Nachhall: danach 3 s lang ${r(UPGRADE_VALUES.nachhallPerSecond * m)} HP/s`);
  }
  if (its.includes('schildspange')) lines.push(`Schildspange: ${h === 'fritz' ? 'Fritz' : HEROES[h].name} erhält ${r(ITEM_VALUES.schildspangeShield * m * shieldMultFor(run, h))} Schild`);
  if (its.includes('echochronik')) lines.push('Echochronik: jeder 3. Einsatz wird mit 50 % wiederholt');
  return lines;
}

export function burnPerStack(run: RunState, h: HeroId): number {
  const its = items(run, h);
  let p = 1 + ITEM_VALUES.ascheglasMult * its.filter((i) => i === 'ascheglas').length;
  if (h === 'ivo' && run.upgrades.includes('heisseAsche')) p += UPGRADE_VALUES.heisseAscheMult;
  return STATUS.burnDamagePerStack * p * heroStats(run, h).mult;
}

export function autoLine(run: RunState, h: HeroId): string {
  const st = heroStats(run, h);
  const iv = HEROES[h].interval.toFixed(1).replace('.', ',');
  if (h === 'sera') return `Alle ${iv} s: ${r(st.atk)} Schaden, heilt den verletztesten Verbündeten um ${r(st.heal)}`;
  if (h === 'ivo') return `Alle ${iv} s: ${r(st.atk)} Schaden + 1 Brandstapel`;
  return `Alle ${iv} s: ${r(st.atk)} Nahkampfschaden`;
}

export function windupText(e: WindupEffect, dmgScale: number): string {
  const d = r(e.damage * dmgScale);
  if (e.kind === 'hitFront') return `${d} Schaden an der vordersten Figur${e.vulnerable ? ` + ${e.vulnerable} s Verwundbar` : ''}`;
  if (e.kind === 'hitAll') return `${d} Schaden an allen Helden${e.burn ? ` + ${e.burn} Brand` : ''}`;
  return `Entfernt Brand bei Gegnern und Schilde bei Helden, dann ${d} Schaden an allen`;
}

export function itemBearerNote(id: ItemId, h: HeroId, run: RunState): string | null {
  if (id === 'zunderring' && h === 'fritz' && !run.upgrades.includes('schildstoss')) return 'Bei Fritz wirkungslos, solange „Schildstoß“ fehlt (Laternenwall trifft sonst keine Gegner).';
  if (id === 'zunderring' && h === 'sera') return 'Bei Sera wirkungslos: ihre Fähigkeit trifft keine Gegner.';
  if (id === 'sanftesLeinen' && h !== 'sera') return 'Wirkt nur bei Heilungen des Trägers – ideal für Sera.';
  if (id === 'ascheglas' && h === 'fritz' && !run.upgrades.includes('schildstoss')) return 'Fritz verursacht normalerweise keinen Brand.';
  if (id === 'ascheglas' && h === 'sera') return 'Sera verursacht keinen Brand.';
  if (id === 'dornenschild' && h !== run.formation[0]) return 'Wirkt am besten auf dem vorderen Platz (wird am häufigsten direkt angegriffen).';
  return null;
}

export function itemName(id: ItemId): string {
  return ITEMS[id].name;
}
