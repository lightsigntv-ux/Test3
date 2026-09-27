// Niederlagenanalyse, Höhepunkte und Kombinationsvorschläge für die Ergebnisübersicht.
import { HEROES } from '../content/heroes';
import { ITEMS, RELICS } from '../content/items';
import { SEALS, SEAL_ORDER } from '../content/progression';
import type { SealId } from '../content/types';
import type { CombatStats } from '../sim/combat';
import { equippedItems } from './derive';
import type { MetaState, RunState } from './types';

export interface CombatContext {
  enemiesAlive: { name: string; hpPct: number; role: string }[];
  startHpPct: number;
}

/** Wichtigste Ursachen einer Niederlage, nach Gewicht sortiert (max. 4). */
export function analyzeDefeat(stats: CombatStats, ctx: CombatContext): string[] {
  const reasons: { w: number; text: string }[] = [];
  const total = Object.values(stats.damageTaken).reduce((a, b) => a + b, 0) || 1;

  for (const s of Object.values(stats.specials)) {
    if (s.hits === 0) continue;
    const share = s.damage / total;
    if (s.interruptible) {
      reasons.push({
        w: 50 + share * 100,
        text: `„${s.name}“ (${s.enemy}) traf ${s.hits}× ungehindert und verursachte ${s.damage} Schaden. Markiere den Gegner als Fokusziel und unterbrich mit Fritz’ Laternenwall, sobald die Vorbereitung erscheint.`,
      });
    } else {
      reasons.push({
        w: 40 + share * 100,
        text: `„${s.name}“ ist nicht unterbrechbar und verursachte ${s.damage} Schaden. Laternenwall kurz vor dem Einschlag und Seras Heilung danach fangen ihn ab.`,
      });
    }
  }

  const first = stats.heroDeaths[0];
  if (first) {
    const back = first.hero !== 'fritz';
    reasons.push({
      w: 35,
      text: `${HEROES[first.hero].name} fiel zuerst (nach ${Math.round(first.time)} s, durch ${first.by}).${
        back ? ' Fernkämpfer und Flächenangriffe treffen die hintere Reihe – Schilde oder eine andere Aufstellung helfen.' : ''
      }`,
    });
  }

  if (stats.focusCappedTime >= 8) {
    reasons.push({
      w: 30 + stats.focusCappedTime,
      text: `Der Fokus lag ${Math.round(stats.focusCappedTime)} s lang ungenutzt am Maximum. Jede volle Fokusleiste ist verschenkte Regeneration.`,
    });
  }

  const healer = ctx.enemiesAlive.find((e) => e.role.includes('Heiler'));
  if (healer) {
    reasons.push({ w: 32, text: `${healer.name} überlebte bis zum Ende und hat ihre Gruppe geheilt. Heilerinnen zuerst als Fokusziel markieren.` });
  }

  if (stats.escalated) {
    reasons.push({ w: 28, text: 'Der Kampf dauerte bis in die Nebel-Eskalation. Mehr Schaden (Brand, Funkensturm) beendet Kämpfe rechtzeitig.' });
  }

  if (ctx.startHpPct < 0.5) {
    reasons.push({
      w: 25,
      text: `Die Gruppe ging mit nur ${Math.round(ctx.startHpPct * 100)} % Lebenspunkten in den Kampf. Lager, Heilungsalternative bei Beute oder Heil-Ereignisse vorher nutzen.`,
    });
  }

  const top = Object.entries(stats.damageTaken).sort((a, b) => b[1] - a[1])[0];
  if (top) reasons.push({ w: 10, text: `Größte Schadensquelle: ${top[0]} (${top[1]} Schaden, ${Math.round((top[1] / total) * 100)} %).` });

  if (reasons.length === 0) reasons.push({ w: 1, text: 'Die Gruppe wurde überwältigt. Mehr Schaden, Schilde vor großen Angriffen oder eine Heilung vor dem Kampf hätten geholfen.' });
  return reasons
    .sort((a, b) => b.w - a.w)
    .slice(0, 4)
    .map((r) => r.text);
}

export function affordableSeals(meta: MetaState): SealId[] {
  return SEAL_ORDER.filter((id) => {
    const s = SEALS[id];
    if (meta.sealsOwned.includes(id)) return false;
    if (s.cost > meta.light) return false;
    if (s.tier > 1) {
      const prev = SEAL_ORDER.find((x) => SEALS[x].branch === s.branch && SEALS[x].tier === s.tier - 1)!;
      if (!meta.sealsOwned.includes(prev)) return false;
    }
    return true;
  });
}

/** Konkrete Kombinationsideen für den nächsten Run, abhängig von Entdeckungen. */
export function suggestions(meta: MetaState, run: RunState): string[] {
  const out: string[] = [];
  const disc = new Set(meta.discoveredItems);
  const items = new Set(equippedItems(run));
  if (disc.has('glutherz')) out.push('Glutherz auf Ivo + Zunderring: Funkensturm bringt Gegner auf 5 Stapel und lässt sie explodieren.');
  if (disc.has('eidDesBollwerks')) out.push('Eid des Bollwerks auf Fritz vorn + Schildspange + „Standhaft“: jeder Schildbruch schützt die ganze Gruppe.');
  if (disc.has('echochronik')) out.push('Echochronik auf Sera mit „Klarer Gedanke“: jede dritte Heilung kommt gratis ein zweites Mal.');
  if (meta.yuumiDiscovered && !run.relics.includes('mondgloeckchen'))
    out.push('Nimm Yuumis Mondglöckchen mit Wappen der Wache: Ihr Schnurrschutz wird 50 % stärker.');
  if (items.has('dornenschild')) out.push('Dornenschild mag Schilde: Kombiniere ihn mit dem Siegel der Wachsamkeit (Startschilde).');
  if (disc.has('taktgeber') && disc.has('resonanzkristall')) out.push('Echo-Motor: Taktgeber auf Ivo, Resonanzkristall auf Fritz – mehr Fokus und häufigere Laternenwälle.');
  if (out.length < 2) out.push('Brand gegen große Gruppen, Schilde gegen schwere Schläge: Probiere einmal konsequent eine Richtung (🔥, 🛡️ oder 🔁).');
  if (out.length < 2) out.push('Stell Sera nach vorn, wenn nur Fernkämpfer da sind – Fritz hält dann die hintere Reihe.');
  return out.slice(0, 3);
}

export function highlightLines(run: RunState): string[] {
  const s = run.stats;
  const out: string[] = [];
  out.push(`Gewonnene Kämpfe: ${s.combatsWon}`);
  const dealt = Object.entries(s.damageDealt).sort((a, b) => b[1] - a[1]);
  if (dealt.length) out.push(`Meister des Schadens: ${dealt[0][0]} (${dealt[0][1]})`);
  if (s.interrupts) out.push(`Unterbrochene Spezialangriffe: ${s.interrupts}`);
  if (s.explosions) out.push(`Glutherz-Explosionen: ${s.explosions}`);
  if (s.echoRepeats) out.push(`Echo-Wiederholungen: ${s.echoRepeats}`);
  if (s.shieldAbsorbed) out.push(`Von Schilden abgefangen: ${s.shieldAbsorbed}`);
  if (run.yuumiEverInRun) out.push(`Yuumi: ${s.yuumiDamage} Schaden mit Pfotenhieben, ${s.yuumiShield} Schild durch Schnurrschutz`);
  return out;
}

export function itemName(id: string): string {
  return (ITEMS as Record<string, { name: string }>)[id]?.name ?? (RELICS as Record<string, { name: string }>)[id]?.name ?? id;
}
