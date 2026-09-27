// Kampfsimulation – unabhängig von React und Darstellung.
// Fester Zeitschritt (SIM.dt). Die Darstellung ruft step() so oft auf, wie es
// Echtzeit × Geschwindigkeit verlangt; Pause bedeutet einfach: kein step().

import { ESCALATION, FOCUS, LONG_NIGHT, SIM, STATUS } from '../content/balance';
import { ENEMIES, type EnemyAbility, type EnemyDef, type WindupEffect } from '../content/enemies';
import { ABILITY_VALUES, HEROES } from '../content/heroes';
import { ITEM_VALUES, RELIC_VALUES } from '../content/items';
import { SEAL_VALUES, UPGRADE_VALUES } from '../content/progression';
import type { EnemyId, HeroId, ItemId, LongNightMod, RelicId, SealId, UpgradeId } from '../content/types';
import { Rng } from './rng';

export type CombatKind = 'normal' | 'elite' | 'boss';

export interface HeroSetup {
  id: HeroId;
  hp: number;
  maxHp: number;
  atk: number;
  heal: number;
  mult: number; // Level-Multiplikator für Fähigkeiten
  items: ItemId[];
}

export interface CombatSetup {
  seed: number;
  kind: CombatKind;
  heroes: HeroSetup[]; // in Aufstellungsreihenfolge: [vorn, hinten, hinten]
  enemies: EnemyId[];
  relics: RelicId[];
  upgrades: UpgradeId[];
  seals: SealId[];
  hpScale: number;
  dmgScale: number;
  focusBonus: number;
  mods: LongNightMod[];
  flags: { courierHelps: boolean; namesFreed: boolean };
  /** Manuelle Einsätze je Held bisher im Run (für Echochronik, zählt über Kämpfe hinweg). */
  manualUsesStart?: Partial<Record<HeroId, number>>;
}

export type SrcKind = 'basic' | 'ability' | 'proc' | 'companion' | 'dot' | 'enemy' | 'fog' | 'relic';
interface Src {
  unit: Unit | null;
  kind: SrcKind;
  label: string;
}

interface Windup {
  abilityIndex: number;
  name: string;
  remaining: number;
  total: number;
  interruptible: boolean;
  effect: WindupEffect;
  hint: string;
}

interface Hot {
  perSecond: number;
  remaining: number;
  tick: number;
  src: Src;
}

export interface Unit {
  uid: string;
  side: 'hero' | 'enemy';
  name: string;
  heroId?: HeroId;
  enemyId?: EnemyId;
  def?: EnemyDef;
  maxHp: number;
  hp: number;
  shield: number;
  alive: boolean;
  atk: number;
  interval: number;
  attackTimer: number;
  burnStacks: number;
  burnTime: number;
  burnPotency: number;
  burnTick: number;
  vulnerable: number;
  hots: Hot[];
  // Held
  items: ItemId[];
  heal: number;
  mult: number;
  abilityCd: number;
  abilityCdMax: number;
  manualUses: number;
  firstAbilityDone: boolean;
  autoCount: number;
  taktgeberProcs: number;
  eidCd: number;
  shieldBrokeOnce: boolean;
  // Gegner
  phase: number;
  abilityTimers: number[];
  windup: Windup | null;
  taunt: number;
  pulseTimer: number;
  cycleState: 'pressure' | 'exhausted' | null;
  cycleTimer: number;
  exhaustBonus: number;
}

export type CombatEvent =
  | { t: 'damage'; uid: string; amount: number; absorbed: number; kind: 'hit' | 'burn' | 'fog' | 'proc' }
  | { t: 'heal'; uid: string; amount: number }
  | { t: 'shield'; uid: string; amount: number }
  | { t: 'shieldBreak'; uid: string }
  | { t: 'attack'; uid: string; targetUid: string }
  | { t: 'ability'; uid: string; name: string; echo: boolean }
  | { t: 'windup'; uid: string; name: string }
  | { t: 'interrupt'; uid: string }
  | { t: 'death'; uid: string }
  | { t: 'paw'; targetUid: string }
  | { t: 'purr'; targetUid: string; amount: number; first: boolean }
  | { t: 'phase'; uid: string; text: string }
  | { t: 'explode'; uid: string }
  | { t: 'focus'; amount: number }
  | { t: 'banner'; text: string }
  | { t: 'summon'; uid: string }
  | { t: 'end'; result: 'victory' | 'defeat' };

export interface LogEntry {
  time: number;
  text: string;
  kind: 'info' | 'danger' | 'good' | 'yuumi';
}

export interface SpecialStat {
  name: string;
  enemy: string;
  hits: number;
  damage: number;
  interruptible: boolean;
  interrupted: number;
}

export interface CombatStats {
  damageTaken: Record<string, number>;
  specials: Record<string, SpecialStat>;
  interrupts: number;
  focusCappedTime: number;
  abilityUses: Record<HeroId, number>;
  heroDeaths: { hero: HeroId; time: number; by: string }[];
  damageDealt: Record<string, number>;
  burnDamage: number;
  shieldAbsorbed: number;
  healing: number;
  overheal: number;
  yuumiPaws: number;
  yuumiPurrs: number;
  yuumiShield: number;
  yuumiDamage: number;
  explosions: number;
  echoRepeats: number;
  transfers: number;
  duration: number;
  escalated: boolean;
}

export interface AbilityState {
  heroId: HeroId;
  name: string;
  cost: number;
  cd: number;
  cdMax: number;
  ready: boolean;
  queued: boolean;
  reason: string | null;
}

interface Scheduled {
  at: number;
  kind: 'echo' | 'afterburn';
  unit: Unit;
  power: number;
}

const fmt = (n: number) => n.toFixed(1).replace('.', ',');

export class CombatSim {
  readonly setup: CombatSetup;
  time = 0;
  heroes: Unit[] = [];
  enemies: Unit[] = [];
  focus: number;
  focusTimer = 0;
  focusTargetUid: string | null = null;
  result: 'victory' | 'defeat' | null = null;
  queue: HeroId[] = [];
  events: CombatEvent[] = [];
  log: LogEntry[] = [];
  stats: CombatStats;
  yuumi: { timer: number; paws: number; purrs: number } | null;
  readonly escalationAt: number;
  escalationWarned = false;
  escalating = false;
  private fogTimer = 0;
  private scheduled: Scheduled[] = [];
  private firstAbilityUsed = false;
  private glockeUsed = false;
  private glut2Used = false;
  private glut3Used = false;
  private manualCount = 0;
  private uidCounter = 0;
  private rng: Rng;
  private relics: Set<RelicId>;
  private upgrades: Set<UpgradeId>;
  private seals: Set<SealId>;

  constructor(setup: CombatSetup) {
    this.setup = setup;
    this.rng = new Rng(setup.seed);
    this.relics = new Set(setup.relics);
    this.upgrades = new Set(setup.upgrades);
    this.seals = new Set(setup.seals);
    this.stats = {
      damageTaken: {},
      specials: {},
      interrupts: 0,
      focusCappedTime: 0,
      abilityUses: { fritz: 0, ivo: 0, sera: 0 },
      heroDeaths: [],
      damageDealt: {},
      burnDamage: 0,
      shieldAbsorbed: 0,
      healing: 0,
      overheal: 0,
      yuumiPaws: 0,
      yuumiPurrs: 0,
      yuumiShield: 0,
      yuumiDamage: 0,
      explosions: 0,
      echoRepeats: 0,
      transfers: 0,
      duration: 0,
      escalated: false,
    };

    for (const h of setup.heroes) {
      const def = HEROES[h.id];
      const u = this.makeUnit('hero', def.name);
      u.heroId = h.id;
      u.maxHp = h.maxHp;
      u.hp = Math.max(0, Math.min(h.hp, h.maxHp));
      u.alive = u.hp > 0;
      u.atk = h.atk;
      u.heal = h.heal;
      u.mult = h.mult;
      u.interval = def.interval;
      u.items = h.items.slice();
      u.manualUses = setup.manualUsesStart?.[h.id] ?? 0;
      u.attackTimer = def.interval * (0.5 + 0.15 * this.heroes.length);
      this.heroes.push(u);
    }
    for (const id of setup.enemies) this.spawnEnemy(id, false);
    this.focusTargetUid = this.enemies[0]?.uid ?? null;

    let focus = FOCUS.start + setup.focusBonus;
    for (const h of this.heroes) focus += this.count(h, 'stimmgabel') * ITEM_VALUES.stimmgabelFocus;
    this.focus = Math.max(0, Math.min(FOCUS.max, focus));

    this.yuumi = this.relics.has('mondgloeckchen') ? { timer: RELIC_VALUES.pawInterval, paws: 0, purrs: 0 } : null;
    this.escalationAt = ESCALATION[setup.kind];

    // Kampfbeginn-Effekte
    if (this.seals.has('bastion2')) {
      for (const h of this.aliveHeroes()) this.addShield(h, SEAL_VALUES.bastion2Shield, { unit: null, kind: 'relic', label: 'Siegel' });
    }
    if (this.relics.has('aschekompass')) {
      for (const e of this.aliveEnemies())
        this.applyBurn({ unit: null, kind: 'relic', label: 'Aschekompass' }, e, RELIC_VALUES.kompassStacks, 1);
    }
    if (setup.flags.courierHelps) {
      for (const e of this.enemies) {
        if (e.enemyId === 'archivarin') {
          e.vulnerable = 8;
          this.addLog('Mira ruft den wahren Namen der Archivarin – sie ist 8 s verwundbar, „Tilgen“ dauert länger.', 'good');
        }
      }
    }
    if (setup.flags.namesFreed) {
      for (const e of this.enemies) {
        if (e.enemyId === 'hueter') {
          e.hp = Math.round(e.maxHp * 0.9);
          e.vulnerable = 8;
          this.addLog('Die befreiten Namen flüstern gegen den Hüter: −10 % Lebenspunkte, 8 s verwundbar.', 'good');
        }
      }
    }
    this.events = [];
  }

  // ---------- Hilfsfunktionen ----------

  private makeUnit(side: 'hero' | 'enemy', name: string): Unit {
    return {
      uid: `${side[0]}${this.uidCounter++}`,
      side,
      name,
      maxHp: 1,
      hp: 1,
      shield: 0,
      alive: true,
      atk: 0,
      interval: 2,
      attackTimer: 1,
      burnStacks: 0,
      burnTime: 0,
      burnPotency: 0,
      burnTick: 0,
      vulnerable: 0,
      hots: [],
      items: [],
      heal: 0,
      mult: 1,
      abilityCd: 0,
      abilityCdMax: 0,
      manualUses: 0,
      firstAbilityDone: false,
      autoCount: 0,
      taktgeberProcs: 0,
      eidCd: 0,
      shieldBrokeOnce: false,
      phase: 0,
      abilityTimers: [],
      windup: null,
      taunt: 0,
      pulseTimer: 0,
      cycleState: null,
      cycleTimer: 0,
      exhaustBonus: 0,
    };
  }

  private spawnEnemy(id: EnemyId, summoned: boolean): Unit {
    const def = ENEMIES[id];
    const u = this.makeUnit('enemy', def.name);
    u.enemyId = id;
    u.def = def;
    u.maxHp = Math.round(def.maxHp * this.setup.hpScale);
    u.hp = u.maxHp;
    u.atk = def.atk * this.setup.dmgScale;
    u.interval = def.interval;
    u.attackTimer = def.interval * (0.6 + this.rng.next() * 0.5);
    u.abilityTimers = def.phases[0].abilities.map((a) => this.firstTimer(a));
    if (def.cycle) {
      u.cycleState = 'pressure';
      u.cycleTimer = def.cycle.pressure;
    }
    this.enemies.push(u);
    if (summoned) this.events.push({ t: 'summon', uid: u.uid });
    return u;
  }

  private firstTimer(a: EnemyAbility): number {
    const swift = this.setup.mods.includes('swift') && a.type === 'windup';
    return a.first * (swift ? LONG_NIGHT.swiftSpecialCdMult : 1);
  }

  count(u: Unit, item: ItemId): number {
    let n = 0;
    for (const i of u.items) if (i === item) n++;
    return n;
  }

  aliveHeroes(): Unit[] {
    return this.heroes.filter((h) => h.alive);
  }
  aliveEnemies(): Unit[] {
    return this.enemies.filter((e) => e.alive);
  }
  hero(id: HeroId): Unit | undefined {
    return this.heroes.find((h) => h.heroId === id);
  }
  unit(uid: string): Unit | undefined {
    return this.heroes.find((u) => u.uid === uid) ?? this.enemies.find((u) => u.uid === uid);
  }

  addLog(text: string, kind: LogEntry['kind'] = 'info') {
    this.log.push({ time: this.time, text, kind });
    if (this.log.length > 80) this.log.shift();
  }

  drainEvents(): CombatEvent[] {
    const ev = this.events;
    this.events = [];
    return ev;
  }

  // ---------- Zielwahl ----------

  /** Ziel für Einzelangriffe der Gruppe (Helden-Grundangriffe, Yuumi, Schildstoß). */
  groupTarget(): Unit | null {
    const taunter = this.enemies.find((e) => e.alive && e.taunt > 0);
    if (taunter) return taunter;
    const f = this.focusTargetUid ? this.unit(this.focusTargetUid) : undefined;
    if (f && f.alive) return f;
    return this.aliveEnemies()[0] ?? null;
  }

  setFocusTarget(uid: string) {
    const u = this.enemies.find((e) => e.uid === uid && e.alive);
    if (u) this.focusTargetUid = uid;
  }

  frontHero(): Unit | null {
    return this.heroes.find((h) => h.alive) ?? null;
  }

  backHeroTarget(): Unit | null {
    const back = this.heroes.slice(1).filter((h) => h.alive);
    if (back.length === 0) return this.frontHero();
    return back.reduce((a, b) => (b.hp < a.hp ? b : a));
  }

  private mostInjured(list: Unit[]): Unit | null {
    let best: Unit | null = null;
    for (const u of list) {
      if (!u.alive) continue;
      if (!best || u.hp / u.maxHp < best.hp / best.maxHp) best = u;
    }
    return best;
  }

  // ---------- Befehle ----------

  costFor(h: Unit): number {
    let cost = HEROES[h.heroId!].ability.cost;
    if (h.heroId === 'sera' && this.upgrades.has('klarerGedanke'))
      cost = Math.max(1, cost - UPGRADE_VALUES.klarerGedankeDiscount);
    if (this.relics.has('taschenuhr') && !this.firstAbilityUsed)
      cost = Math.max(0, cost - RELIC_VALUES.taschenuhrDiscount);
    return cost;
  }

  cooldownFor(h: Unit): number {
    let cd = HEROES[h.heroId!].ability.cooldown;
    cd *= Math.max(0, 1 - ITEM_VALUES.resonanzMult * this.count(h, 'resonanzkristall'));
    if (this.seals.has('echo2') && !h.firstAbilityDone) cd *= SEAL_VALUES.echo2CdMult;
    return Math.max(STATUS.minCooldown, cd);
  }

  abilityState(id: HeroId): AbilityState {
    const h = this.hero(id)!;
    const def = HEROES[id].ability;
    const cost = this.costFor(h);
    const queued = this.queue.includes(id);
    let reason: string | null = null;
    if (this.result) reason = 'Der Kampf ist beendet.';
    else if (!h.alive) reason = `${h.name} ist bewusstlos.`;
    else if (h.abilityCd > 0) reason = `Abklingzeit: noch ${fmt(h.abilityCd)} s.`;
    else if (this.focus < cost + this.queuedCost(id)) reason = `Zu wenig Fokus (${this.focus}/${cost}).`;
    return {
      heroId: id,
      name: def.name,
      cost,
      cd: h.abilityCd,
      cdMax: h.abilityCdMax || this.cooldownFor(h),
      ready: reason === null,
      queued,
      reason: queued ? 'Vorbereitet – wird beim nächsten Schritt ausgeführt.' : reason,
    };
  }

  private queuedCost(except: HeroId): number {
    let c = 0;
    for (const q of this.queue) if (q !== except) c += this.costFor(this.hero(q)!);
    return c;
  }

  /** Befehl vormerken (funktioniert auch in der Pause). */
  command(id: HeroId): boolean {
    if (this.queue.includes(id)) return false;
    const st = this.abilityState(id);
    if (!st.ready) return false;
    this.queue.push(id);
    return true;
  }

  cancelCommand(id: HeroId) {
    this.queue = this.queue.filter((q) => q !== id);
  }

  private processQueue() {
    const q = this.queue;
    this.queue = [];
    for (const id of q) {
      if (this.result) return;
      const h = this.hero(id)!;
      const cost = this.costFor(h);
      if (!h.alive || h.abilityCd > 0 || this.focus < cost) {
        this.addLog(`${HEROES[id].ability.name} konnte nicht ausgeführt werden.`, 'info');
        continue;
      }
      this.useAbility(h, cost);
    }
  }

  private useAbility(h: Unit, cost: number) {
    this.focus -= cost;
    this.firstAbilityUsed = true;
    h.abilityCdMax = this.cooldownFor(h);
    h.abilityCd = h.abilityCdMax;
    h.firstAbilityDone = true;
    this.stats.abilityUses[h.heroId!]++;
    this.addLog(`${h.name}: ${HEROES[h.heroId!].ability.name}`, 'good');
    this.castAbility(h, 'manual', 1);
    if (this.result) return;

    this.manualCount++;
    h.manualUses++;
    if (this.relics.has('chor') && this.manualCount % RELIC_VALUES.chorEvery === 0) {
      this.addLog('Chor der Namen: Gruppenheilung.', 'good');
      for (const x of this.aliveHeroes()) this.heal({ unit: null, kind: 'relic', label: 'Chor' }, x, RELIC_VALUES.chorHeal);
    }
    if (this.seals.has('echo3') && this.manualCount % SEAL_VALUES.echo3Every === 0) {
      for (const x of this.heroes) x.abilityCd = Math.max(0, x.abilityCd - SEAL_VALUES.echo3Reduce);
      this.addLog('Siegel des Kanons: Abklingzeiten −1,5 s.', 'good');
    }
    if (this.count(h, 'echochronik') > 0 && h.manualUses % ITEM_VALUES.echoEvery === 0) {
      this.scheduled.push({ at: this.time + ITEM_VALUES.echoDelay, kind: 'echo', unit: h, power: ITEM_VALUES.echoPower });
    }
  }

  private castAbility(h: Unit, mode: 'manual' | 'echo', power: number) {
    const manual = mode === 'manual';
    const src: Src = { unit: h, kind: manual ? 'ability' : 'proc', label: HEROES[h.heroId!].ability.name };
    const m = h.mult * power;
    this.events.push({ t: 'ability', uid: h.uid, name: src.label, echo: !manual });
    if (!manual) {
      this.stats.echoRepeats++;
      this.addLog(`Echochronik wiederholt ${src.label} (50 %).`, 'good');
    }

    if (h.heroId === 'fritz') {
      const amount = (ABILITY_VALUES.wallShield + (this.upgrades.has('breiterWall') ? UPGRADE_VALUES.breiterWallBonus : 0)) * m;
      for (const x of this.aliveHeroes()) this.addShield(x, amount, src);
      if (manual) {
        const f = this.focusTargetUid ? this.unit(this.focusTargetUid) : undefined;
        if (f && f.alive && f.windup && f.windup.interruptible) this.interrupt(f);
      }
      if (this.upgrades.has('schildstoss')) {
        const t = this.groupTarget();
        if (t) {
          this.dealDamage(src, t, UPGRADE_VALUES.schildstossDamage * m, true);
          if (t.alive) t.vulnerable = Math.max(t.vulnerable, UPGRADE_VALUES.schildstossVulnerable);
          if (manual && t.alive && this.count(h, 'zunderring') > 0)
            this.applyBurn(src, t, ITEM_VALUES.zunderringStacks * this.count(h, 'zunderring'), this.burnPotency(h));
        }
      }
    } else if (h.heroId === 'ivo') {
      let stacks = Math.max(1, Math.round(ABILITY_VALUES.stormBurn * power));
      if (manual) stacks += ITEM_VALUES.zunderringStacks * this.count(h, 'zunderring');
      if (manual && this.seals.has('glut2') && !this.glut2Used) {
        stacks += SEAL_VALUES.glut2Stacks;
        this.glut2Used = true;
      }
      for (const e of this.aliveEnemies()) {
        this.dealDamage(src, e, ABILITY_VALUES.stormDamage * m, true);
        if (e.alive) this.applyBurn(src, e, stacks, this.burnPotency(h));
        if (this.result) return;
      }
      if (manual && this.upgrades.has('nachzuendung'))
        this.scheduled.push({ at: this.time + UPGRADE_VALUES.nachzuendungDelay, kind: 'afterburn', unit: h, power: UPGRADE_VALUES.nachzuendungPower });
    } else {
      const targets = this.aliveHeroes()
        .slice()
        .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)
        .slice(0, 2);
      for (const t of targets) {
        this.heal(src, t, ABILITY_VALUES.memoryHeal * m);
        if (manual && this.upgrades.has('nachhall'))
          t.hots.push({ perSecond: UPGRADE_VALUES.nachhallPerSecond * h.mult, remaining: UPGRADE_VALUES.nachhallDuration, tick: 0, src });
      }
    }

    if (manual && this.count(h, 'schildspange') > 0)
      this.addShield(h, ITEM_VALUES.schildspangeShield * this.count(h, 'schildspange') * h.mult, { unit: h, kind: 'proc', label: 'Schildspange' });
  }

  private afterburn(h: Unit, power: number) {
    const src: Src = { unit: h, kind: 'proc', label: 'Nachzündung' };
    this.events.push({ t: 'ability', uid: h.uid, name: 'Nachzündung', echo: true });
    for (const e of this.aliveEnemies()) {
      this.dealDamage(src, e, ABILITY_VALUES.stormDamage * h.mult * power, true);
      if (e.alive) this.applyBurn(src, e, 1, this.burnPotency(h));
      if (this.result) return;
    }
  }

  private interrupt(e: Unit) {
    const w = e.windup!;
    e.windup = null;
    this.stats.interrupts++;
    const key = `${e.name}:${w.name}`;
    const s = this.specialStat(key, w.name, e.name, w.interruptible);
    s.interrupted++;
    this.events.push({ t: 'interrupt', uid: e.uid });
    this.addLog(`Unterbrochen! ${e.name}: ${w.name} abgebrochen.`, 'good');
  }

  enemyBurnPotency(): number {
    return STATUS.enemyBurnPotency * this.setup.dmgScale;
  }

  burnPotency(h: Unit): number {
    let p = 1 + ITEM_VALUES.ascheglasMult * this.count(h, 'ascheglas');
    if (h.heroId === 'ivo' && this.upgrades.has('heisseAsche')) p += UPGRADE_VALUES.heisseAscheMult;
    return p * h.mult;
  }

  // ---------- Kernmechanik ----------

  private specialStat(key: string, name: string, enemy: string, interruptible: boolean): SpecialStat {
    return (this.stats.specials[key] ??= { name, enemy, hits: 0, damage: 0, interruptible, interrupted: 0 });
  }

  dealDamage(src: Src, target: Unit, amount: number, direct: boolean): number {
    if (this.result || !target.alive || amount <= 0) return 0;
    let dmg: number;
    let absorbed = 0;
    if (src.kind === 'fog') {
      dmg = Math.max(1, Math.round(amount));
    } else {
      let mult = 1;
      if (target.vulnerable > 0) mult += STATUS.vulnerableBonus;
      if (target.cycleState === 'exhausted') mult += target.exhaustBonus;
      dmg = Math.max(1, Math.round(amount * mult));
    }
    const hadShield = target.shield > 0;
    if (src.kind !== 'fog' && hadShield) {
      absorbed = Math.min(target.shield, dmg);
      target.shield -= absorbed;
      this.stats.shieldAbsorbed += target.side === 'hero' ? absorbed : 0;
    }
    const rest = dmg - absorbed;
    target.hp -= rest;
    const evKind = src.kind === 'dot' ? 'burn' : src.kind === 'fog' ? 'fog' : src.kind === 'proc' ? 'proc' : 'hit';
    this.events.push({ t: 'damage', uid: target.uid, amount: rest, absorbed, kind: evKind });

    if (target.side === 'hero') {
      this.stats.damageTaken[src.label] = (this.stats.damageTaken[src.label] ?? 0) + dmg;
    } else {
      const key = src.kind === 'companion' ? 'Yuumi' : src.kind === 'dot' ? 'Brand' : src.kind === 'proc' ? src.label : src.unit?.heroId ? src.unit.name : src.label;
      this.stats.damageDealt[key] = (this.stats.damageDealt[key] ?? 0) + dmg;
      if (src.kind === 'dot') this.stats.burnDamage += dmg;
      if (src.kind === 'companion') this.stats.yuumiDamage += dmg;
    }

    if (hadShield && target.shield <= 0 && absorbed > 0) {
      this.events.push({ t: 'shieldBreak', uid: target.uid });
      if (target.side === 'hero') this.onHeroShieldBreak(target, src);
      if (this.result) return dmg;
    }

    if (target.hp <= 0) {
      this.kill(target, src);
      return dmg;
    }

    // Dornenschild: geschützter Träger, direkter gegnerischer Angriff
    if (
      target.side === 'hero' &&
      direct &&
      hadShield &&
      src.kind === 'enemy' &&
      src.unit &&
      src.unit.alive &&
      this.count(target, 'dornenschild') > 0
    ) {
      this.dealDamage(
        { unit: target, kind: 'proc', label: 'Dornenschild' },
        src.unit,
        ITEM_VALUES.dornenDamage * this.count(target, 'dornenschild') * target.mult,
        false,
      );
    }
    return dmg;
  }

  private onHeroShieldBreak(h: Unit, src: Src) {
    if (this.count(h, 'eidDesBollwerks') > 0 && h.eidCd <= 0) {
      h.eidCd = ITEM_VALUES.eidCooldown;
      this.addLog(`Eid des Bollwerks: ${h.name}s Schild bricht – die anderen werden geschützt.`, 'good');
      const pSrc: Src = { unit: h, kind: 'proc', label: 'Eid des Bollwerks' };
      for (const o of this.aliveHeroes()) if (o !== h) this.addShield(o, ITEM_VALUES.eidShield * h.mult, pSrc);
      if (src.unit && src.unit.side === 'enemy' && src.unit.alive)
        this.dealDamage(pSrc, src.unit, ITEM_VALUES.eidDamage * h.mult, false);
      if (this.result) return;
    }
    if (this.relics.has('glocke') && !this.glockeUsed) {
      this.glockeUsed = true;
      this.gainFocus(RELIC_VALUES.glockeFocus, 'Gesprungene Glocke');
    }
    if (this.seals.has('bastion3') && !h.shieldBrokeOnce) {
      h.shieldBrokeOnce = true;
      this.gainFocus(SEAL_VALUES.bastion3Focus, 'Siegel des Widerhalls');
    }
  }

  gainFocus(n: number, label: string) {
    const before = this.focus;
    this.focus = Math.min(FOCUS.max, this.focus + n);
    if (this.focus > before) {
      this.events.push({ t: 'focus', amount: this.focus - before });
      this.addLog(`${label}: +${this.focus - before} Fokus.`, 'good');
    }
  }

  addShield(target: Unit, base: number, src: Src): number {
    if (this.result || !target.alive || target.side !== 'hero') return 0;
    let mult = 1;
    if (this.relics.has('wappen')) mult += RELIC_VALUES.wappenMult;
    if (target.heroId === 'fritz' && this.upgrades.has('standhaft')) mult += UPGRADE_VALUES.standhaftMult;
    const amt = Math.round(base * mult);
    const cap = Math.round(target.maxHp * STATUS.shieldCapRatio);
    const next = Math.min(cap, target.shield + amt);
    const gained = next - target.shield;
    target.shield = next;
    if (gained > 0) this.events.push({ t: 'shield', uid: target.uid, amount: gained });
    void src;
    return gained;
  }

  private enemyShield(target: Unit, amount: number) {
    if (!target.alive) return;
    const cap = Math.round(target.maxHp * STATUS.shieldCapRatio);
    const next = Math.min(cap, target.shield + Math.round(amount));
    const gained = next - target.shield;
    target.shield = next;
    if (gained > 0) this.events.push({ t: 'shield', uid: target.uid, amount: gained });
  }

  heal(src: Src, target: Unit, amount: number): number {
    if (this.result || !target.alive) return 0;
    const amt = Math.round(amount * (this.escalating ? ESCALATION.healMult : 1));
    const real = Math.min(target.maxHp - target.hp, amt);
    const over = amt - real;
    target.hp += real;
    if (target.side === 'hero') {
      this.stats.healing += real;
      this.stats.overheal += over;
    }
    if (real > 0) this.events.push({ t: 'heal', uid: target.uid, amount: real });
    if (
      over > 0 &&
      src.unit &&
      src.unit.side === 'hero' &&
      (src.kind === 'basic' || src.kind === 'ability') &&
      this.count(src.unit, 'sanftesLeinen') > 0
    ) {
      this.addShield(target, over * ITEM_VALUES.leinenRatio * this.count(src.unit, 'sanftesLeinen'), {
        unit: src.unit,
        kind: 'proc',
        label: 'Sanftes Leinen',
      });
    }
    return real;
  }

  applyBurn(src: Src, target: Unit, stacks: number, potency: number) {
    if (this.result || !target.alive || stacks <= 0) return;
    const before = target.burnStacks;
    if (before === 0) target.burnTick = 0;
    target.burnStacks = Math.min(STATUS.burnMaxStacks, before + stacks);
    const partySource = src.unit ? src.unit.side === 'hero' : src.kind === 'relic' || src.kind === 'companion';
    const duration = STATUS.burnDuration + (partySource && target.side === 'enemy' && this.relics.has('docht') ? RELIC_VALUES.dochtExtra : 0);
    target.burnTime = duration;
    target.burnPotency = before > 0 ? Math.max(target.burnPotency, potency) : potency;

    // Glutherz: nur primäre Anwendungen des Trägers
    if (
      src.unit &&
      src.unit.side === 'hero' &&
      (src.kind === 'basic' || src.kind === 'ability') &&
      before < STATUS.burnMaxStacks &&
      target.burnStacks === STATUS.burnMaxStacks &&
      this.count(src.unit, 'glutherz') > 0
    ) {
      const h = src.unit;
      const pSrc: Src = { unit: h, kind: 'proc', label: 'Glutherz' };
      target.burnStacks -= ITEM_VALUES.glutherzConsume;
      this.stats.explosions++;
      this.events.push({ t: 'explode', uid: target.uid });
      this.addLog(`Glutherz: ${target.name} explodiert!`, 'good');
      const others = this.aliveEnemies().filter((e) => e !== target);
      this.dealDamage(pSrc, target, ITEM_VALUES.glutherzTarget * h.mult, false);
      for (const o of others) this.dealDamage(pSrc, o, ITEM_VALUES.glutherzSplash * h.mult, false);
    }
  }

  private kill(target: Unit, src: Src) {
    const wasBurning = target.burnStacks > 0 ? target.burnStacks : 0;
    const potency = target.burnPotency;
    target.alive = false;
    target.hp = 0;
    target.shield = 0;
    target.burnStacks = 0;
    target.windup = null;
    target.hots = [];
    this.events.push({ t: 'death', uid: target.uid });

    if (target.side === 'hero') {
      this.stats.heroDeaths.push({ hero: target.heroId!, time: this.time, by: src.label });
      this.addLog(`${target.name} ist gefallen (${src.label}).`, 'danger');
      if (this.aliveHeroes().length === 0) this.finish('defeat');
      return;
    }

    this.addLog(`${target.name} besiegt.`, 'info');
    if (this.aliveEnemies().length === 0) {
      this.finish('victory');
      return;
    }
    if (this.focusTargetUid === target.uid) this.focusTargetUid = this.aliveEnemies()[0].uid;

    if (wasBurning > 0) {
      // Heldengebundene Todeseffekte: nicht bei Tötung durch Zusatzeffekte oder Yuumi
      const primary = src.kind !== 'proc' && src.kind !== 'companion';
      if (primary) {
        const catcher = this.aliveHeroes().find((h) => this.count(h, 'funkenfaenger') > 0);
        if (catcher) {
          const alive = this.aliveEnemies();
          const to = alive.reduce((a, b) => (b.burnStacks < a.burnStacks ? b : a));
          const n = Math.min(ITEM_VALUES.funkenfaengerStacks, wasBurning);
          this.applyBurn({ unit: catcher, kind: 'proc', label: 'Funkenfänger' }, to, n, potency);
          this.stats.transfers++;
          this.addLog(`Funkenfänger: ${n} Brand springt auf ${to.name} über.`, 'good');
        }
        const ivo = this.hero('ivo');
        if (this.upgrades.has('lauffeuer') && ivo && ivo.alive) {
          for (const e of this.aliveEnemies()) this.applyBurn({ unit: ivo, kind: 'proc', label: 'Lauffeuer' }, e, UPGRADE_VALUES.lauffeuerStacks, potency);
          this.stats.transfers++;
          this.addLog('Lauffeuer: Brand breitet sich aus.', 'good');
        }
      }
      if (this.seals.has('glut3') && !this.glut3Used) {
        this.glut3Used = true;
        this.addLog('Siegel der warmen Asche: Gruppenheilung.', 'good');
        for (const h of this.aliveHeroes()) this.heal({ unit: null, kind: 'relic', label: 'Siegel' }, h, SEAL_VALUES.glut3Heal);
      }
    }
  }

  private finish(result: 'victory' | 'defeat') {
    if (this.result) return;
    this.result = result;
    this.queue = [];
    this.scheduled = [];
    this.stats.duration = this.time;
    for (const h of this.heroes) h.shield = 0; // Schilde verschwinden nach dem Kampf
    this.events.push({ t: 'end', result });
    this.addLog(result === 'victory' ? 'Sieg!' : 'Die Gruppe ist gefallen.', result === 'victory' ? 'good' : 'danger');
  }

  // ---------- Zeitschritt ----------

  step() {
    if (this.result) return;
    const dt = SIM.dt;
    this.processQueue();
    if (this.result) return;
    this.time += dt;

    this.focusTimer += dt;
    if (this.focusTimer >= FOCUS.regenInterval - 1e-9) {
      this.focusTimer -= FOCUS.regenInterval;
      if (this.focus < FOCUS.max) {
        this.focus++;
        this.events.push({ t: 'focus', amount: 1 });
      }
    }
    if (this.focus >= FOCUS.max) this.stats.focusCappedTime += dt;

    // geplante Zusatzeffekte
    if (this.scheduled.length) {
      const due = this.scheduled.filter((s) => s.at <= this.time + 1e-9);
      this.scheduled = this.scheduled.filter((s) => s.at > this.time + 1e-9);
      for (const s of due) {
        if (this.result) return;
        if (!s.unit.alive) continue;
        if (s.kind === 'echo') this.castAbility(s.unit, 'echo', s.power);
        else this.afterburn(s.unit, s.power);
      }
    }

    for (const u of [...this.heroes, ...this.enemies]) {
      if (this.result) return;
      if (u.alive) this.tickStatuses(u, dt);
    }

    for (const h of this.heroes) {
      if (this.result) return;
      if (!h.alive) continue;
      h.abilityCd = Math.max(0, h.abilityCd - dt);
      h.eidCd = Math.max(0, h.eidCd - dt);
      h.attackTimer -= dt;
      if (h.attackTimer <= 0) {
        h.attackTimer += h.interval;
        this.heroAttack(h);
      }
    }

    for (const e of this.enemies.slice()) {
      if (this.result) return;
      if (e.alive) this.enemyTick(e, dt);
    }

    if (this.yuumi && !this.result) this.yuumiTick(dt);
    if (!this.result) this.escalationTick(dt);
  }

  private tickStatuses(u: Unit, dt: number) {
    if (u.vulnerable > 0) u.vulnerable = Math.max(0, u.vulnerable - dt);
    if (u.burnStacks > 0) {
      u.burnTick += dt;
      u.burnTime -= dt;
      if (u.burnTick >= 1 - 1e-9) {
        u.burnTick -= 1;
        const dmg = u.burnStacks * STATUS.burnDamagePerStack * u.burnPotency;
        this.dealDamage({ unit: null, kind: 'dot', label: 'Brand' }, u, dmg, false);
        if (!u.alive || this.result) return;
      }
      if (u.burnTime <= 0) {
        u.burnStacks = 0;
        u.burnPotency = 0;
        u.burnTick = 0;
      }
    }
    if (u.hots.length) {
      for (const hot of u.hots) {
        hot.tick += dt;
        hot.remaining -= dt;
        if (hot.tick >= 1 - 1e-9) {
          hot.tick -= 1;
          this.heal(hot.src, u, hot.perSecond);
        }
      }
      u.hots = u.hots.filter((h) => h.remaining > 1e-9);
    }
  }

  private heroAttack(h: Unit) {
    const t = this.groupTarget();
    if (!t) return;
    const src: Src = { unit: h, kind: 'basic', label: h.name };
    this.events.push({ t: 'attack', uid: h.uid, targetUid: t.uid });
    this.dealDamage(src, t, h.atk, true);
    if (this.result) return;
    if (h.heroId === 'ivo' && t.alive) this.applyBurn(src, t, 1, this.burnPotency(h));
    if (h.heroId === 'sera') {
      const target = this.mostInjured(this.heroes);
      if (target) this.heal(src, target, h.heal);
    }
    h.autoCount++;
    if (
      this.count(h, 'taktgeber') > 0 &&
      h.autoCount % ITEM_VALUES.taktgeberEvery === 0 &&
      h.taktgeberProcs < ITEM_VALUES.taktgeberMax * this.count(h, 'taktgeber')
    ) {
      h.taktgeberProcs++;
      this.gainFocus(1, `Taktgeber (${h.name})`);
    }
  }

  private enemyTick(e: Unit, dt: number) {
    const def = e.def!;
    // Phasenwechsel
    const next = def.phases[e.phase + 1];
    if (next && e.hp / e.maxHp <= next.below) {
      e.phase++;
      e.windup = null;
      e.abilityTimers = next.abilities.map((a) => this.firstTimer(a));
      e.pulseTimer = 0;
      this.events.push({ t: 'phase', uid: e.uid, text: next.announce });
      this.events.push({ t: 'banner', text: next.announce });
      this.addLog(next.announce, 'danger');
    }
    const phase = def.phases[e.phase];

    // Druck/Erschöpfung (Hüter)
    if (def.cycle && e.cycleState) {
      if (e.cycleState === 'exhausted') {
        e.cycleTimer -= dt;
        if (e.cycleTimer <= 0) {
          e.cycleState = 'pressure';
          e.exhaustBonus = 0;
          e.cycleTimer = def.cycle.pressure;
          this.addLog(`${e.name} erhebt sich wieder.`, 'danger');
        }
        return; // erschöpft: keine Aktionen
      }
      e.cycleTimer -= dt;
      if (e.cycleTimer <= 0 && !e.windup) {
        e.cycleState = 'exhausted';
        e.exhaustBonus = def.cycle.exhaustBonus;
        e.cycleTimer = def.cycle.exhausted;
        this.events.push({ t: 'banner', text: `${e.name} ist erschöpft – jetzt +50 % Schaden!` });
        this.addLog(`${e.name} ist erschöpft (${def.cycle.exhausted} s, +50 % erlittener Schaden).`, 'good');
        return;
      }
    }

    e.taunt = Math.max(0, e.taunt - dt);

    // Schutzphase: Nachhall solange Schild steht
    const shieldSelf = phase.abilities.find((a) => a.type === 'shieldSelf');
    if (shieldSelf && shieldSelf.type === 'shieldSelf' && e.shield > 0) {
      e.pulseTimer += dt;
      if (e.pulseTimer >= shieldSelf.pulseEvery) {
        e.pulseTimer -= shieldSelf.pulseEvery;
        const src: Src = { unit: e, kind: 'enemy', label: `${e.name}: Nachhall` };
        for (const h of this.aliveHeroes()) {
          this.dealDamage(src, h, shieldSelf.pulseDamage * this.setup.dmgScale, false);
          if (this.result) return;
        }
      }
    }

    if (e.windup) {
      e.windup.remaining -= dt;
      if (e.windup.remaining <= 0) {
        const w = e.windup;
        e.windup = null;
        this.executeWindup(e, w);
      }
      return; // während der Vorbereitung keine Grundangriffe
    }

    for (let i = 0; i < phase.abilities.length; i++) {
      const a = phase.abilities[i];
      e.abilityTimers[i] -= dt;
      if (e.abilityTimers[i] > 0) continue;
      if (a.type === 'windup') {
        if (e.windup) continue;
        const swift = this.setup.mods.includes('swift');
        let total = a.windup * (swift ? LONG_NIGHT.swiftWindupMult : 1);
        if (e.enemyId === 'archivarin' && this.setup.flags.courierHelps) total += 2;
        e.windup = { abilityIndex: i, name: a.name, remaining: total, total, interruptible: a.interruptible, effect: a.effect, hint: a.hint };
        e.abilityTimers[i] = a.every * (swift ? LONG_NIGHT.swiftSpecialCdMult : 1);
        this.events.push({ t: 'windup', uid: e.uid, name: a.name });
        this.addLog(`⚠ ${e.name} bereitet ${a.name} vor (${a.interruptible ? 'unterbrechbar' : 'NICHT unterbrechbar'}).`, 'danger');
        return;
      }
      e.abilityTimers[i] = a.every;
      this.enemyAbility(e, a);
      if (this.result) return;
    }

    e.attackTimer -= dt;
    if (e.attackTimer <= 0) {
      e.attackTimer += e.interval * phase.intervalMult;
      const t = def.targeting === 'back' ? this.backHeroTarget() : this.frontHero();
      if (!t) return;
      const src: Src = { unit: e, kind: 'enemy', label: e.name };
      this.events.push({ t: 'attack', uid: e.uid, targetUid: t.uid });
      this.dealDamage(src, t, e.atk, true);
      if (def.attackBurn && t.alive) this.applyBurn(src, t, def.attackBurn, this.enemyBurnPotency());
    }
  }

  private enemyAbility(e: Unit, a: EnemyAbility) {
    const scale = this.setup.hpScale;
    switch (a.type) {
      case 'shieldAlly': {
        const t = this.mostInjured(this.enemies);
        if (t) {
          this.enemyShield(t, a.amount * scale);
          this.addLog(`${e.name}: ${a.name} schützt ${t.name}.`, 'info');
        }
        break;
      }
      case 'healAlly': {
        const t = this.mostInjured(this.enemies);
        if (!t) break;
        this.heal({ unit: e, kind: 'enemy', label: a.name }, t, a.amount * scale);
        if (a.cleanse && t.burnStacks > 0) {
          t.burnStacks = 0;
          t.burnPotency = 0;
          this.addLog(`${e.name} löscht den Brand von ${t.name}.`, 'danger');
        }
        break;
      }
      case 'taunt':
        e.taunt = a.duration;
        this.enemyShield(e, a.shield * scale);
        this.addLog(`${e.name} provoziert! Einzelangriffe müssen ihn ${a.duration} s lang treffen.`, 'danger');
        break;
      case 'summon': {
        const n = this.enemies.filter((x) => x.alive && x.enemyId === a.enemy).length;
        if (n < a.max && this.aliveEnemies().length < 5) {
          const s = this.spawnEnemy(a.enemy, true);
          this.addLog(`${e.name} ruft ${s.name} herbei.`, 'danger');
        }
        break;
      }
      case 'shieldSelf':
        this.enemyShield(e, a.amount * scale);
        e.pulseTimer = 0;
        this.events.push({ t: 'banner', text: `${e.name}: ${a.name}! Brich den Schild.` });
        this.addLog(`${e.name}: ${a.name} – solange der Schild hält, trifft der Nachhall alle.`, 'danger');
        break;
      case 'windup':
        break;
    }
  }

  private executeWindup(e: Unit, w: Windup) {
    const key = `${e.name}:${w.name}`;
    const stat = this.specialStat(key, w.name, e.name, w.interruptible);
    stat.hits++;
    const src: Src = { unit: e, kind: 'enemy', label: `${e.name}: ${w.name}` };
    this.events.push({ t: 'attack', uid: e.uid, targetUid: this.frontHero()?.uid ?? '' });
    const eff = w.effect;
    const dmgScale = this.setup.dmgScale;
    if (eff.kind === 'hitFront') {
      const t = this.frontHero();
      if (!t) return;
      stat.damage += this.dealDamage(src, t, eff.damage * dmgScale, true);
      if (eff.vulnerable && t.alive) t.vulnerable = Math.max(t.vulnerable, eff.vulnerable);
    } else if (eff.kind === 'hitAll') {
      for (const t of this.aliveHeroes()) {
        stat.damage += this.dealDamage(src, t, eff.damage * dmgScale, true);
        if (this.result) return;
        if (eff.burn && t.alive) this.applyBurn(src, t, eff.burn, this.enemyBurnPotency());
      }
    } else {
      for (const x of this.aliveEnemies()) {
        x.burnStacks = 0;
        x.burnPotency = 0;
      }
      for (const h of this.aliveHeroes()) h.shield = 0;
      this.addLog(`${e.name} tilgt: Brand und Schilde verschwinden.`, 'danger');
      for (const t of this.aliveHeroes()) {
        stat.damage += this.dealDamage(src, t, eff.damage * dmgScale, true);
        if (this.result) return;
      }
    }
  }

  private yuumiTick(dt: number) {
    const y = this.yuumi!;
    y.timer -= dt;
    if (y.timer > 0) return;
    y.timer += RELIC_VALUES.pawInterval;
    const t = this.groupTarget();
    if (!t) return;
    this.events.push({ t: 'paw', targetUid: t.uid });
    this.dealDamage({ unit: null, kind: 'companion', label: 'Yuumi' }, t, RELIC_VALUES.pawDamage, true);
    y.paws++;
    this.stats.yuumiPaws++;
    if (this.result) return;
    if (y.paws % RELIC_VALUES.purrEvery === 0) {
      const target = this.mostInjured(this.heroes);
      if (!target) return;
      const gained = this.addShield(target, RELIC_VALUES.purrShield, { unit: null, kind: 'companion', label: 'Schnurrschutz' });
      y.purrs++;
      this.stats.yuumiPurrs++;
      this.stats.yuumiShield += gained;
      this.events.push({ t: 'purr', targetUid: target.uid, amount: gained, first: y.purrs === 1 });
      this.addLog(`Yuumi schnurrt: ${target.name} erhält ${gained} Schild.`, 'yuumi');
    }
  }

  private escalationTick(dt: number) {
    if (!this.escalationWarned && this.time >= this.escalationAt - ESCALATION.warnAhead) {
      this.escalationWarned = true;
      this.events.push({ t: 'banner', text: `Der Nebel verdichtet sich in ${ESCALATION.warnAhead} s!` });
      this.addLog(`Warnung: In ${ESCALATION.warnAhead} s verdichtet sich der Nebel (Schaden an allen, Heilung halbiert).`, 'danger');
    }
    if (this.time < this.escalationAt) return;
    if (!this.escalating) {
      this.escalating = true;
      this.stats.escalated = true;
      this.events.push({ t: 'banner', text: 'Der Nebel verdichtet sich! Alle erleiden wachsenden Schaden.' });
      this.addLog('Der Nebel verdichtet sich: wachsender Schaden an allen Einheiten.', 'danger');
    }
    this.fogTimer += dt;
    if (this.fogTimer >= 1 - 1e-9) {
      this.fogTimer -= 1;
      const secs = Math.round(this.time - this.escalationAt);
      const src: Src = { unit: null, kind: 'fog', label: 'Nebel' };
      for (const u of [...this.aliveHeroes(), ...this.aliveEnemies()]) {
        this.dealDamage(src, u, u.maxHp * ESCALATION.pctPerSecondPerSecond * Math.max(1, secs), false);
        if (this.result) return;
      }
    }
  }

  /** Simuliert bis zum Ende (für Tests & Balancing). policy wird vor jedem Schritt aufgerufen. */
  runToEnd(policy?: (sim: CombatSim) => void, maxSeconds = 400) {
    while (!this.result && this.time < maxSeconds) {
      policy?.(this);
      this.step();
    }
  }
}
