// Tooltips mit tatsächlich berechneten Werten des aktuellen Builds.
import { STATUS } from '../content/balance';
import type { WindupEffect } from '../content/enemies';
import { ABILITY_VALUES, HEROES } from '../content/heroes';
import { ITEMS, ITEM_VALUES, RELIC_VALUES, tierValue, type EquipItem } from '../content/items';
import { SEAL_VALUES, UPGRADE_VALUES } from '../content/progression';
import type { HeroId, ItemId } from '../content/types';
import { heroStats } from './derive';
import { ARCHETYPES, ARCH_VALUES, DEFAULT_ARCHETYPE, type ArchetypeId } from '../content/builds';
import type { RunState } from './types';

const r = (n: number) => Math.round(n);

export function shieldMultFor(run: RunState, target: HeroId): number {
  let m = 1;
  if (run.relics.includes('wappen')) m += RELIC_VALUES.wappenMult;
  if (target === 'fritz' && run.upgrades.includes('standhaft')) m += UPGRADE_VALUES.standhaftMult;
  return m;
}

function eq(run: RunState, h: HeroId): EquipItem[] {
  return run.equipment[h].filter((x): x is EquipItem => !!x);
}
function items(run: RunState, h: HeroId): ItemId[] {
  return eq(run, h).map((x) => x.id);
}
function tv(run: RunState, h: HeroId, id: ItemId, key: string): number {
  return eq(run, h).reduce((a, x) => a + (x.id === id ? tierValue(id, key, x.q) : 0), 0);
}

function archOf(run: RunState, h: HeroId): ArchetypeId {
  return run.archetype?.[h] ?? DEFAULT_ARCHETYPE[h];
}

export function abilityCost(run: RunState, h: HeroId): number {
  let c = ARCHETYPES[archOf(run, h)].ability.cost;
  if (h === 'sera' && run.upgrades.includes('klarerGedanke')) c = Math.max(1, c - 1);
  return c;
}

export function abilityCooldown(run: RunState, h: HeroId): number {
  return Math.max(STATUS.minCooldown, ARCHETYPES[archOf(run, h)].ability.cooldown * Math.max(0, 1 - tv(run, h, 'resonanzkristall', 'cd')));
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
  const arch = archOf(run, h);
  const zunder = tv(run, h, 'zunderring', 'stacks');
  const bash = () => {
    if (run.upgrades.includes('schildstoss'))
      lines.push(`Schildstoß: ${r(UPGRADE_VALUES.schildstossDamage * m)} Schaden + ${UPGRADE_VALUES.schildstossVulnerable} s Verwundbar am Fokusziel`);
  };
  if (arch === 'guardian') {
    const base = (ABILITY_VALUES.wallShield + (run.upgrades.includes('breiterWall') ? UPGRADE_VALUES.breiterWallBonus : 0)) * m;
    lines.push(`Schild je Held: ${r(base * shieldMultFor(run, 'ivo'))}${run.upgrades.includes('standhaft') ? `, Fritz selbst ${r(base * shieldMultFor(run, 'fritz'))}` : ''}`);
    lines.push('Unterbricht die unterbrechbare Vorbereitung des Fokusziels.');
    bash();
  } else if (arch === 'blades') {
    const hits = ARCH_VALUES.bladesHits + (run.upgrades.includes('klingentanz') ? UPGRADE_VALUES.klingentanzHits : 0);
    lines.push(`${hits} Schläge à ${r(ARCH_VALUES.bladesHitDamage * m)} Schaden aufs Fokusziel`);
    lines.push('Unterbricht die unterbrechbare Vorbereitung des Fokusziels.');
  } else if (arch === 'bulwark') {
    lines.push(`Fritz erhält ${r(ARCH_VALUES.bulwarkShield * m * shieldMultFor(run, 'fritz'))} Schild; ${ARCH_VALUES.bulwarkProvoke} s lang greifen alle Gegner nur ihn an`);
    lines.push('Unterbricht die unterbrechbare Vorbereitung des Fokusziels.');
    bash();
  } else if (arch === 'fire') {
    const stacks = ABILITY_VALUES.stormBurn + zunder;
    const extra = run.seals.includes('glut2') ? ` (erster Funkensturm im Kampf +${SEAL_VALUES.glut2Stacks})` : '';
    lines.push(`${r(ABILITY_VALUES.stormDamage * m)} Schaden an allen Gegnern, je ${stacks} Brandstapel${extra}`);
    lines.push(`Brand: ${burnPerStack(run, h).toFixed(1).replace('.', ',')} Schaden je Stapel und Sekunde`);
    if (run.upgrades.includes('nachzuendung')) lines.push(`Nachzündung: nach 1,5 s nochmals ${r(ABILITY_VALUES.stormDamage * m * 0.5)} Schaden + 1 Stapel`);
  } else if (arch === 'frost') {
    const dur = ARCH_VALUES.frostNovaDuration + (run.upgrades.includes('eiseskaelte') ? UPGRADE_VALUES.eiseskaelteDuration : 0);
    lines.push(`${r(ARCH_VALUES.frostNovaDamage * m)} Schaden an allen, ${dur} s verlangsamt (−${Math.round(ARCH_VALUES.frostSlow * 100)} % Tempo)`);
    lines.push(`Laufende Vorbereitungen dauern +${String(ARCH_VALUES.frostNovaDelay).replace('.', ',')} s länger`);
    if (run.upgrades.includes('eiseskaelte')) lines.push(`Verlangsamte Gegner erleiden +${Math.round(UPGRADE_VALUES.eiseskaelteBonus * 100)} % Schaden`);
  } else if (arch === 'storm') {
    let d = ARCH_VALUES.chainDamage * m;
    const parts: number[] = [];
    for (let i = 0; i <= ARCH_VALUES.chainJumps; i++, d *= ARCH_VALUES.chainFalloff) parts.push(r(d));
    lines.push(`Blitz aufs Fokusziel, springt weiter: ${parts.join(' → ')} Schaden`);
    if (run.upgrades.includes('nachzuendung')) lines.push('Nachzündung: nach 1,5 s ein zweiter Blitz mit 50 %');
  } else if (arch === 'keeper') {
    lines.push(`Heilt die zwei verletztesten Verbündeten um je ${r(ABILITY_VALUES.memoryHeal * m)}`);
    if (run.upgrades.includes('nachhall')) lines.push(`Nachhall: danach 3 s lang ${r(UPGRADE_VALUES.nachhallPerSecond * m)} HP/s`);
  } else if (arch === 'poison') {
    lines.push(`${ARCH_VALUES.poisonCloudStacks} Gift an allen Gegnern; ${ARCH_VALUES.weakenDuration} s geschwächt (−${Math.round((1 - ARCH_VALUES.weakenMult) * 100)} % Schaden)`);
    lines.push(`Gift: ${poisonPerStack(run, h).toFixed(1).replace('.', ',')} Schaden je Stapel und Sekunde, max. ${ARCH_VALUES.poisonMax + (run.upgrades.includes('nervengift') ? UPGRADE_VALUES.nervengiftStacks : 0)} Stapel`);
  } else {
    lines.push(`Alle erhalten ${r(ARCH_VALUES.lightDomeShield * m * shieldMultFor(run, 'ivo'))} Schild und ${r(ARCH_VALUES.lightDomeHeal * m)} Heilung`);
    if (run.upgrades.includes('nachhall')) lines.push(`Nachhall: danach 3 s lang ${r(UPGRADE_VALUES.nachhallPerSecond * m)} HP/s`);
  }
  if (its.includes('schildspange')) lines.push(`Schildspange: ${h === 'fritz' ? 'Fritz' : HEROES[h].name} erhält ${r(tv(run, h, 'schildspange', 'shield') * m * shieldMultFor(run, h))} Schild`);
  if (its.includes('echochronik')) lines.push(`Echochronik: jeder 3. Einsatz wird mit ${Math.round(ITEM_VALUES.echoPower * 100)} % wiederholt`);
  return lines;
}

export function burnPerStack(run: RunState, h: HeroId): number {
  let p = 1 + tv(run, h, 'ascheglas', 'mult');
  if (h === 'ivo' && run.upgrades.includes('heisseAsche')) p += UPGRADE_VALUES.heisseAscheMult;
  return STATUS.burnDamagePerStack * p * heroStats(run, h).mult;
}

export function poisonPerStack(run: RunState, h: HeroId): number {
  const nerv = run.upgrades.includes('nervengift') ? 1 + UPGRADE_VALUES.nervengiftMult : 1;
  return ARCH_VALUES.poisonPerStack * (1 + tv(run, h, 'ascheglas', 'mult')) * nerv * heroStats(run, h).mult;
}

export function autoLine(run: RunState, h: HeroId): string {
  const st = heroStats(run, h);
  const iv = st.interval.toFixed(1).replace('.', ',');
  const base = `Alle ${iv} s: ${r(st.atk)} Schaden`;
  switch (archOf(run, h)) {
    case 'keeper':
      return `${base}, heilt den verletztesten Verbündeten um ${r(st.heal)}`;
    case 'poison':
      return `${base} + 1 Gift`;
    case 'light': {
      const b = ARCH_VALUES.lightAutoShield + (run.upgrades.includes('behutsameHaende') ? UPGRADE_VALUES.behutsameBonus : 0);
      return `${base}, ${r(b * st.mult)} Lichtschild für den verletztesten Verbündeten`;
    }
    case 'fire':
      return `${base} + 1 Brandstapel`;
    case 'frost':
      return `${base}, verlangsamt ${ARCH_VALUES.frostAutoDuration} s`;
    case 'storm':
      return `${base}, springt mit ${Math.round(ARCH_VALUES.stormChain * 100)} % auf einen zweiten Gegner`;
    default:
      return `${base} (Nahkampf)`;
  }
}

export function windupText(e: WindupEffect, dmgScale: number): string {
  const d = r(e.damage * dmgScale);
  if (e.kind === 'hitFront') return `${d} Schaden an der vordersten Figur${e.vulnerable ? ` + ${e.vulnerable} s Verwundbar` : ''}`;
  if (e.kind === 'hitAll') return `${d} Schaden an allen Helden${e.burn ? ` + ${e.burn} Brand` : ''}`;
  return `Entfernt Brand bei Gegnern und Schilde bei Helden, dann ${d} Schaden an allen`;
}

export function itemBearerNote(id: ItemId, h: HeroId, run: RunState): string | null {
  const a = archOf(run, h);
  const hitsEnemies = a === 'blades' || a === 'fire' || a === 'frost' || a === 'storm' || a === 'poison' || ((a === 'guardian' || a === 'bulwark') && run.upgrades.includes('schildstoss'));
  if (id === 'zunderring' && !hitsEnemies) return `Wirkungslos bei ${ARCHETYPES[a].name}: die Fähigkeit trifft keine Gegner${a === 'guardian' || a === 'bulwark' ? ' (ohne „Schildstoß“)' : ''}.`;
  if (id === 'sanftesLeinen' && a !== 'keeper' && a !== 'light') return 'Wirkt nur bei Heilungen des Trägers – ideal für Sera als Hüterin oder Lichtweberin.';
  if (id === 'ascheglas' && a === 'poison') return 'Verstärkt bei der Giftmischerin ihr Gift.';
  if (id === 'ascheglas' && !hitsEnemies) return `${ARCHETYPES[a].name} verursacht normalerweise keinen Brand.`;
  if (id === 'dornenschild' && h !== run.formation[0]) return 'Wirkt am besten auf dem vorderen Platz (wird am häufigsten direkt angegriffen).';
  return null;
}

export function itemName(id: ItemId): string {
  return ITEMS[id].name;
}
