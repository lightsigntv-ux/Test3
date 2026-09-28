// Spielsteuerung zwischen Engine (rein) und Darstellung (React/Canvas).
import type { GameState, Hotspot, LocId, NpcId, TimeOfDay } from '../engine/types';
import { newGame as engineNew, knows, evalCond, type Content, type GameEvent } from '../engine/core';
import { advance as engAdvance, startDialogue, currentView, type LineView, type StepResult } from '../engine/dialogue';
import { act, autoScene, enterLocation, settle, NO_CAT } from '../engine/session';
import { hotspotsIn, npcsIn, topicsFor, smalltalkFor, examineFor, presentables } from '../engine/world';
import { attempt, hintFor, reconAnswer as engRecon, openDeductions } from '../engine/deduce';
import { load, save as saveTo, exportText, importText, type Store } from '../engine/save';
import { CLUE_BY_ID } from '../content/clues';
import { STATEMENT_BY_ID } from '../content/statements';
import { DEDUCTION_BY_ID } from '../content/deductions';
import * as audio from './audio';
import type { Env } from './scene/rooms';
import type { Frame } from './scene/stage';
import type { CatState } from './scene/figures';

export type Overlay = 'title' | 'none' | 'notebook' | 'present' | 'menu' | 'settings' | 'log' | 'recon' | 'card' | 'ending' | 'io';

export interface Toast { id: number; text: string; kind: 'clue' | 'hint' | 'thought' | 'info' }

const MOVE_SPEED = 0.23; // Bildbreiten pro Sekunde
const CAT_SPEED = 0.32;

const DEFAULT_MUSIC: Record<number, string> = { 0: 'home', 1: 'k1', 2: 'grief', 3: 'k3', 4: 'k4', 5: 'k5', 6: 'home' };
const LOC_MUSIC: Record<string, string> = { dienst: 'kitchen', kapelle: 'chapel', stall: 'yard', dunkel: 'dark', london: 'london', zwischen: 'echo' };

function safeStore(): Store {
  try { const k = '__t'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage; }
  catch { const m = new Map<string, string>(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) }; }
}

export class Controller {
  game: GameState = engineNew();
  view?: LineView;
  talkNpc?: NpcId;
  overlay: Overlay = 'title';
  toasts: Toast[] = [];
  card: number | null = null;
  ending: string | null = null;
  corruptNotice = false;
  hasSave = false;
  presentTarget?: NpcId;
  returnTo: Overlay = 'menu';
  lastLine = '';

  // Welt-Animation
  seraX = 0.3; targetX: number | null = null; seraWalk = 0; seraFacing: 1 | -1 = 1;
  catX = 0.24; catTarget: number | null = null; catWalk = 0; catFacing: 1 | -1 = 1; catState: CatState = 'sit'; catStateT = 0; catTimer = 3;
  keys = { left: false, right: false };
  idleT = 0;
  fade = 1;
  mystic = 0;
  reduced = false;
  private pendingAction: (() => void) | null = null;
  private pendingCard: number | null = null;
  private pendingEnding: string | null = null;
  private pendingRecon = false;
  private musicOverride: string | null = null;
  private toastId = 0;
  private listeners = new Set<() => void>();
  private store = safeStore();

  constructor(public c: Content) {
    const r = load(this.store);
    this.hasSave = r.ok;
    this.corruptNotice = !r.ok && r.reason === 'corrupt';
  }

  subscribe(fn: () => void) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit() { this.listeners.forEach((f) => f()); }

  // ------------------------------------------------------------ Start / Laden
  startNew() {
    this.game = engineNew();
    this.view = undefined; this.talkNpc = undefined;
    this.pendingCard = null; this.pendingEnding = null; this.ending = null;
    this.placeSera(this.game.x);
    this.card = 0; this.overlay = 'card';
    this.musicOverride = null;
    this.emit();
  }

  continueGame(): boolean {
    const r = load(this.store);
    if (!r.ok) { this.corruptNotice = r.reason === 'corrupt'; this.hasSave = false; this.emit(); return false; }
    this.game = r.state;
    this.placeSera(this.game.x);
    this.overlay = 'none';
    this.view = currentView(this.game, this.c);
    if (this.view?.text) this.lastLine = this.view.text;
    this.musicOverride = null;
    this.refreshSound();
    this.emit();
    return true;
  }

  exportSave(): string { return exportText(this.game); }
  importSave(text: string): boolean {
    const r = importText(text);
    if (!r.ok) return false;
    this.game = r.state;
    this.placeSera(this.game.x);
    this.view = currentView(this.game, this.c);
    this.overlay = 'none';
    this.save();
    this.refreshSound();
    this.emit();
    return true;
  }

  save() {
    this.game.x = this.seraX;
    try { saveTo(this.store, this.game); this.hasSave = true; } catch { /* voll/blockiert */ }
  }

  private placeSera(x: number) {
    this.seraX = x; this.targetX = null;
    this.catX = Math.max(0.05, x - 0.06); this.catTarget = null; this.catState = 'sit';
    this.fade = 1;
  }

  // ------------------------------------------------------------ Welt
  get loc() { return this.c.locations[this.game.loc]; }

  env(): Env {
    const g = this.game;
    return { loc: g.loc, tod: g.time, weather: this.weather(), chapter: g.chapter, flags: g.flags, reduced: this.reduced };
  }

  weather(): Env['weather'] {
    const g = this.game, f = g.flags;
    if (g.loc === 'london') return 'snow';
    if (g.chapter === 0 || g.chapter === 6) return 'rain';
    if (g.chapter === 5) return f['k5_ready'] ? 'dawn' : 'calm';
    if (g.chapter === 4) {
      if (g.time === 'nachmittag' && f['g_yuumi_lost']) return 'storm';
      if (f['k4_evening']) return 'calm';
      return 'rain';
    }
    if (g.chapter === 3) return g.time === 'morgen' ? 'fog' : g.time === 'abend' || g.time === 'nacht' ? 'calm' : 'rain';
    return 'rain';
  }

  catVisible(): boolean {
    const g = this.game;
    return !g.flags['g_yuumi_lost'] && !NO_CAT.has(g.loc) && (g.yuumiLoc === g.loc || g.loc === 'wohnung' || g.loc === 'london');
  }

  catControllable(): boolean {
    return this.catVisible() && !!this.loc?.catAllowed;
  }

  hotspots(): Hotspot[] {
    const g = this.game;
    return hotspotsIn(g, this.c, g.loc).filter((h) => (g.controlling === 'yuumi' ? h.kind === 'cat' : h.kind !== 'cat'));
  }

  npcs() { return npcsIn(this.game, this.c, this.game.loc); }

  /** Nächstes Ziel für „Interagieren“. */
  nearest(): { kind: 'hotspot'; h: Hotspot } | { kind: 'npc'; npc: NpcId } | { kind: 'cat' } | null {
    const g = this.game;
    const x = g.controlling === 'yuumi' ? this.catX : this.seraX;
    let best: any = null, bd = 1;
    for (const h of this.hotspots()) {
      const d = Math.abs(h.x - x);
      if (d <= h.r + 0.02 && d < bd) { bd = d; best = { kind: 'hotspot', h }; }
    }
    if (g.controlling === 'sera') {
      for (const n of this.npcs()) {
        const d = Math.abs(n.x - x);
        if (d < 0.07 && d < bd) { bd = d; best = { kind: 'npc', npc: n.npc }; }
      }
      if (this.catVisible()) { const d = Math.abs(this.catX - x); if (d < 0.05 && d < bd) { bd = d; best = { kind: 'cat' }; } }
    }
    return best;
  }

  busy(): boolean {
    return !!this.view || this.overlay !== 'none' || !!this.talkNpc;
  }

  update(dt: number) {
    dt = Math.min(dt, 0.1);
    this.fade = Math.max(0, this.fade - dt * 2.2);
    const mysticTarget = this.game.loc === 'zwischen' || this.view?.mood === 'mystisch' ? 0.75 : 0;
    this.mystic += (mysticTarget - this.mystic) * Math.min(1, dt * 1.5);
    if (this.overlay === 'title') { this.catAI(dt, false); return; }
    const g = this.game;
    const L = this.loc;
    const [minX, maxX] = L?.xRange ?? [0.05, 0.95];
    const controllingCat = g.controlling === 'yuumi';
    let dir = 0;
    if (!this.busy()) {
      if (this.keys.left) dir -= 1;
      if (this.keys.right) dir += 1;
    }
    // Sera
    if (!controllingCat) {
      if (dir) { this.targetX = null; this.pendingAction = null; }
      let move = dir * MOVE_SPEED * dt;
      if (!dir && this.targetX !== null && !this.busy()) {
        const d = this.targetX - this.seraX;
        if (Math.abs(d) < 0.004) { this.targetX = null; const a = this.pendingAction; this.pendingAction = null; a?.(); }
        else move = Math.sign(d) * Math.min(Math.abs(d), MOVE_SPEED * dt);
      }
      if (move) {
        this.seraX = Math.max(minX, Math.min(maxX, this.seraX + move));
        this.seraFacing = move > 0 ? 1 : -1;
        this.seraWalk += Math.abs(move) * 9;
        this.idleT = 0;
        if (!g.flags['tut_move']) { g.flags['tut_move'] = true; this.emit(); }
        if (Math.floor(this.seraWalk) !== Math.floor(this.seraWalk - Math.abs(move) * 9)) audio.sfx('step');
      } else { this.seraWalk = 0; this.idleT += dt; }
      this.catAI(dt, false);
    } else {
      let move = dir * CAT_SPEED * dt;
      if (!dir && this.catTarget !== null && !this.busy()) {
        const d = this.catTarget - this.catX;
        if (Math.abs(d) < 0.004) { this.catTarget = null; const a = this.pendingAction; this.pendingAction = null; a?.(); }
        else move = Math.sign(d) * Math.min(Math.abs(d), CAT_SPEED * dt);
      }
      if (move) { this.catX = Math.max(minX, Math.min(maxX, this.catX + move)); this.catFacing = move > 0 ? 1 : -1; this.catWalk += Math.abs(move) * 6; this.catState = 'walk'; }
      else { this.catWalk = 0; if (this.catState === 'walk') { this.catState = 'sit'; this.catStateT = 0; } }
      this.catStateT += dt;
    }
    // automatische Szenen
    if (!this.busy() && this.fade < 0.5 && !this.pendingAction) {
      const sc = autoScene(g, this.c);
      if (sc) this.run(startDialogue(g, this.c, sc.id));
    }
  }

  private catAI(dt: number, _controlled: boolean) {
    this.catStateT += dt;
    const followX = this.seraX - this.seraFacing * 0.055;
    const far = Math.abs(this.catX - followX);
    if (far > 0.08 && this.game.controlling === 'sera') this.catTarget = followX;
    if (this.catTarget !== null) {
      const d = this.catTarget - this.catX;
      if (Math.abs(d) < 0.01) { this.catTarget = null; this.catState = 'sit'; this.catStateT = 0; this.catTimer = 2 + Math.random() * 4; }
      else {
        const sp = (far > 0.2 ? CAT_SPEED * 1.3 : CAT_SPEED * 0.8) * dt;
        this.catX += Math.sign(d) * Math.min(Math.abs(d), sp);
        this.catFacing = d > 0 ? 1 : -1;
        this.catWalk += sp * 6;
        this.catState = 'walk';
      }
      return;
    }
    this.catWalk = 0;
    this.catTimer -= dt;
    if (this.catTimer <= 0) {
      const sleepy = this.idleT > 25 || (this.view && this.idleT > 8);
      const r = Math.random();
      if (sleepy && r < 0.5) { this.catState = 'sleep'; this.catTimer = 12 + Math.random() * 10; }
      else if (r < 0.35) { this.catState = 'groom'; this.catTimer = 2.5 + Math.random() * 2; }
      else if (r < 0.55) { this.catState = 'look'; this.catTimer = 1.5 + Math.random() * 2; }
      else if (r < 0.7 && this.loc) {
        const [a, b] = this.loc.xRange;
        this.catTarget = Math.max(a, Math.min(b, this.seraX + (Math.random() - 0.5) * 0.25));
      } else { this.catState = 'sit'; this.catTimer = 3 + Math.random() * 4; }
      this.catStateT = 0;
    }
  }

  frame(): Frame {
    const g = this.game;
    const near = this.overlay === 'none' && !this.view && !this.talkNpc ? this.nearest() : null;
    const npcs = this.npcs().map((n) => ({ id: n.npc, x: n.x, facing: (this.seraX > n.x ? 1 : -1) as 1 | -1, walk: 0 }));
    return {
      env: this.env(),
      sera: { id: 'sera', x: this.seraX, facing: this.seraFacing, walk: this.seraWalk, visible: g.loc !== 'zwischen' },
      cat: { x: this.catX, foot: 648, s: 1.25, facing: this.catFacing, state: this.catState, t: 0, stateT: this.catStateT, walk: this.catWalk, visible: this.catVisible(), reduced: this.reduced },
      npcs,
      hotspots: this.hotspots().map((h) => ({ ...h, near: near?.kind === 'hotspot' && near.h.id === h.id })),
      controlling: g.controlling,
      fade: this.fade,
      mystic: this.mystic,
      focusNpc: near?.kind === 'npc' ? near.npc : this.talkNpc,
    };
  }

  // ------------------------------------------------------------ Aktionen
  interact() {
    if (this.busy()) return;
    const n = this.nearest();
    if (!n) return;
    this.doInteract(n);
  }

  private doInteract(n: NonNullable<ReturnType<Controller['nearest']>>) {
    const g = this.game;
    if (n.kind === 'cat') {
      const r = act(g, this.c, { type: 'pet' });
      if (r && !('moved' in r)) this.run(r);
      return;
    }
    if (n.kind === 'npc') { this.openTalk(n.npc); return; }
    const h = n.h;
    if (h.kind === 'cat') {
      const r = act(g, this.c, { type: 'yuumi', target: h.id });
      if (r && !('moved' in r)) this.run(r);
      else { this.thought('Nichts, was eine Katze interessiert.'); }
      return;
    }
    if (h.kind === 'exit') {
      const r = act(g, this.c, { type: 'exit', hotspot: h });
      if (!r) return;
      if ('moved' in r) this.changeRoom(r.moved);
      else this.run(r);
      return;
    }
    const r = act(g, this.c, { type: 'examine', target: h.id });
    if (r && !('moved' in r)) {
      if (!g.flags['tut_examine']) g.flags['tut_examine'] = true;
      this.run(r);
    } else this.thought('Da ist nichts, was ich nicht schon gesehen habe.');
  }

  /** Klick in die Welt (normierte Koordinaten). */
  clickWorld(x: number, y: number) {
    if (this.busy()) return;
    const g = this.game;
    const cat = g.controlling === 'yuumi';
    // Ziele unter dem Klick
    let hit: ReturnType<Controller['nearest']> = null;
    for (const h of this.hotspots()) if (Math.hypot((h.x - x) * 1.78, h.y - y) < 0.06) hit = { kind: 'hotspot', h };
    if (!cat && !hit) for (const n of this.npcs()) if (Math.abs(n.x - x) < 0.04 && y > 0.5) hit = { kind: 'npc', npc: n.npc };
    if (!cat && !hit && this.catVisible() && Math.abs(this.catX - x) < 0.03 && y > 0.82) hit = { kind: 'cat' };
    const [minX, maxX] = this.loc?.xRange ?? [0.05, 0.95];
    let tx = Math.max(minX, Math.min(maxX, x));
    if (hit) {
      let target: number;
      if (hit.kind === 'hotspot') target = hit.h.x;
      else if (hit.kind === 'npc') { const nx = this.npcs().find((n) => n.npc === (hit as { npc: NpcId }).npc)!.x; target = nx - Math.sign(nx - this.seraX || 1) * 0.05; }
      else target = this.catX - 0.03;
      tx = Math.max(minX, Math.min(maxX, target));
      const h = hit;
      this.pendingAction = () => this.doInteract(h);
    } else this.pendingAction = null;
    if (cat) this.catTarget = tx; else this.targetX = tx;
  }

  toggleYuumi() {
    const g = this.game;
    if (this.view || this.overlay !== 'none' || this.talkNpc) return;
    if (g.controlling === 'yuumi') { g.controlling = 'sera'; this.pendingAction = null; this.emit(); return; }
    if (!this.catControllable()) {
      this.thought(this.catVisible() ? 'Hier lasse ich Yuumi lieber bei mir.' : g.flags['g_yuumi_lost'] ? 'Yuumi ist nicht da.' : 'Yuumi ist nicht hier.');
      return;
    }
    g.controlling = 'yuumi';
    this.catTarget = null; this.catState = 'stretch'; this.catStateT = 0;
    if (!g.flags['tut_yuumi']) g.flags['tut_yuumi'] = true;
    audio.sfx('bell');
    this.emit();
  }

  changeRoom(s: GameState) {
    this.game = s;
    this.placeSera(s.x);
    this.musicOverride = null;
    this.refreshSound();
    this.save();
    this.emit();
  }

  refreshSound() {
    const g = this.game;
    const L = this.loc;
    audio.setAmbience(L?.ambience ?? [], this.weather() === 'storm' ? 'storm' : this.weather() === 'fog' ? 'fog' : this.weather() === 'calm' || this.weather() === 'dawn' || this.weather() === 'snow' ? 'calm' : 'rain');
    audio.setMusic(this.musicOverride ?? LOC_MUSIC[g.loc] ?? DEFAULT_MUSIC[g.chapter] ?? 'k1');
  }

  // ------------------------------------------------------------ Gespräche
  openTalk(npc: NpcId) {
    this.talkNpc = npc;
    if (!this.game.flags['tut_talk']) this.game.flags['tut_talk'] = true;
    this.emit();
  }
  closeTalk() { this.talkNpc = undefined; this.emit(); }

  talkOptions(npc: NpcId) {
    const g = this.game;
    return {
      topics: topicsFor(g, this.c, npc).map((d) => ({ id: d.id, title: d.title ?? '…' })),
      smalltalk: !!smalltalkFor(g, this.c, npc),
    };
  }

  talkTopic(id: string) { this.run(startDialogue(this.game, this.c, id)); }
  talkSmall() {
    if (!this.talkNpc) return;
    const r = act(this.game, this.c, { type: 'smalltalk', npc: this.talkNpc });
    if (r && !('moved' in r)) this.run(r);
  }
  openPresent() { this.presentTarget = this.talkNpc; this.overlay = 'present'; this.emit(); }
  present(item: string) {
    const npc = this.presentTarget;
    this.overlay = 'none';
    if (!npc) { this.emit(); return; }
    const r = act(this.game, this.c, { type: 'present', npc, item });
    if (!this.game.flags['tut_present']) this.game.flags['tut_present'] = true;
    if (r && !('moved' in r)) this.run(r); else this.emit();
  }
  presentables() { return presentables(this.game); }

  // ------------------------------------------------------------ Dialogablauf
  run(r: StepResult) {
    this.handleEvents(r.events);
    const st = settle(r.state, this.c, r.events);
    const prevLoc = this.game.loc;
    this.game = st.state;
    if (r.events.some((e) => e.type === 'goto')) {
      this.placeSera(st.state.x);
      if (st.state.loc !== prevLoc) this.musicOverride = r.events.some((e) => e.type === 'music') ? this.musicOverride : null;
      this.refreshSound();
    }
    for (const sp of st.specials) this.special(sp);
    this.view = r.view;
    if (r.view?.text) this.lastLine = r.view.text;
    audio.setDucking(!!r.view?.important);
    if (!r.view) this.afterDialogue();
    this.emit();
  }

  advance(choice?: number) {
    if (!this.view) return;
    this.run(engAdvance(this.game, this.c, choice));
  }

  private afterDialogue() {
    audio.setDucking(false);
    if (this.pendingEnding) { this.ending = this.pendingEnding; this.pendingEnding = null; this.overlay = 'ending'; this.talkNpc = undefined; this.save(); audio.setMusic(this.game.flags['end_stay'] ? 'london' : 'home'); return; }
    if (this.pendingCard !== null) {
      const ch = this.pendingCard; this.pendingCard = null;
      this.talkNpc = undefined;
      this.musicOverride = null;
      if ((this.c.chapters[ch]?.intro.length ?? 0) > 0) { this.card = ch; this.overlay = 'card'; }
      this.refreshSound();
      this.save();
      return;
    }
    if (this.pendingRecon) { this.pendingRecon = false; this.overlay = 'recon'; this.talkNpc = undefined; this.save(); return; }
    this.save();
    // Gespräch fortsetzen, wenn die Figur noch hier ist und keine Szene wartet
    if (this.talkNpc && (!this.npcs().some((n) => n.npc === this.talkNpc) || autoScene(this.game, this.c))) this.talkNpc = undefined;
  }

  private handleEvents(ev: GameEvent[]) {
    for (const e of ev) {
      if (e.type === 'sfx') audio.sfx(e.id);
      else if (e.type === 'music') { this.musicOverride = e.id; audio.setMusic(e.id); }
      else if (e.type === 'clue') { const c = CLUE_BY_ID[e.id]; if (c) this.toast(`${c.kind === 'erinnerung' ? 'Erinnerung' : 'Notiert'}: ${c.name}`, 'clue'); audio.sfx('pen'); }
      else if (e.type === 'statement') { const s = STATEMENT_BY_ID[e.id]; if (s) this.toast(`Aussage notiert`, 'clue'); audio.sfx('pen'); }
      else if (e.type === 'deduction') { audio.sfx('deduce'); }
      else if (e.type === 'chapter') this.pendingCard = e.n;
    }
    if (ev.some((e) => e.type === 'clue' || e.type === 'statement') && !this.game.flags['tut_notebook']) {
      this.game.flags['tut_notebook'] = true;
      this.toast('N · Notizbuch', 'hint');
    }
  }

  private special(id: string) {
    if (id === 'recon') this.pendingRecon = true;
    else if (id.startsWith('ending:')) this.pendingEnding = id.slice(7);
    else if (id === 'hint_yuumi') this.toast('Y · Yuumi steuern', 'hint');
    else if (id === 'hint_present') this.toast('Im Gespräch: „Etwas vorlegen …“', 'hint');
    else if (id === 'hint_tilly') this.toast('Vielleicht braucht Tilly etwas Wahres von mir.', 'thought');
    else if (id.startsWith('chapter:')) { /* über Ereignis behandelt */ }
  }

  closeCard() {
    this.card = null; this.overlay = 'none';
    this.fade = 1;
    this.refreshSound();
    this.emit();
  }

  // ------------------------------------------------------------ Notizbuch
  deduce(id: string, answers: number[]): { kind: string; line: string } {
    const r = attempt(this.game, this.c, id, answers);
    if (r.kind === 'solved') {
      this.handleEvents(r.events);
      const st = settle(r.state, this.c, r.events);
      this.game = st.state;
      this.save();
      this.emit();
      return { kind: 'solved', line: DEDUCTION_BY_ID[id].result };
    }
    if (r.kind === 'wrong') { this.game = r.state; this.emit(); return { kind: 'wrong', line: r.line }; }
    this.game.presentRot[`guess_${id}`] = (this.game.presentRot[`guess_${id}`] ?? 0) + 1;
    return { kind: 'guess', line: r.line };
  }

  hint(id: string): string {
    const r = hintFor(this.game, this.c, id);
    this.game = r.state;
    this.emit();
    return r.line;
  }

  openCount(): number { return openDeductions(this.game, this.c).length; }

  reconAnswer(qid: string, pick: number) {
    const r = engRecon(this.game, this.c, qid, pick);
    this.game = r.state;
    if (r.ok && this.game.flags['g_recon_done']) this.save();
    this.emit();
    return r;
  }

  finishRecon() { this.overlay = 'none'; this.emit(); }

  // ------------------------------------------------------------ Kleinkram
  toast(text: string, kind: Toast['kind']) {
    const id = ++this.toastId;
    this.toasts = [...this.toasts.slice(-3), { id, text, kind }];
    setTimeout(() => { this.toasts = this.toasts.filter((t) => t.id !== id); this.emit(); }, kind === 'hint' ? 6000 : 3800);
    this.emit();
  }
  thought(text: string) { this.toast(text, 'thought'); }

  knows(id: string) { return knows(this.game, id); }
  cond = (c: Parameters<typeof evalCond>[1]) => evalCond(this.game, c);
  setTime(t: TimeOfDay) { this.game.time = t; }
  get locName() { return this.loc?.name ?? ''; }
  goTo(loc: LocId, x: number) { this.changeRoom(enterLocation(this.game, this.c, loc, x)); }
  examineAvailable(target: string) { return !!examineFor(this.game, this.c, target); }
}
