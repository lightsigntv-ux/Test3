// Zustand, Bedingungen, Effekte. Reine Funktionen ohne DOM.
import type { Chapter, Clue, Cond, Deduction, Dialogue, Effects, GameState, Location, NpcId, Placement, Statement } from './types';
import { NPCS } from './types';

export const SAVE_VERSION = 3;

export interface ReconQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  needs: string[]; // Wissen, das die Frage stützt (für den Solver)
  doubt: string;
  after?: string; // Satz nach richtiger Antwort
}

export interface Content {
  dialogues: Record<string, Dialogue>;
  clues: Record<string, Clue>;
  statements: Record<string, Statement>;
  deductions: Record<string, Deduction>;
  locations: Record<string, Location>;
  chapters: Chapter[];
  placements: Placement[];
  recon: ReconQuestion[];
}

export const INITIAL_TRUST: Record<NpcId, number> = {
  harriet: 3, lionel: 3, clara: 2, penrose: 4, hobbes: 2, pryce: 2, tilly: 5, dunning: 2,
};

export function newGame(): GameState {
  return {
    version: SAVE_VERSION,
    chapter: 0,
    time: 'abend',
    loc: 'wohnung',
    x: 0.3,
    y: 0.85,
    controlling: 'sera',
    yuumiLoc: 'wohnung',
    flags: {},
    clues: {},
    statements: {},
    deductions: {},
    trust: { ...INITIAL_TRUST },
    suspicion: 0,
    seen: {},
    presentRot: {},
    hintLevel: {},
    recon: {},
    log: [],
    playMinutes: 0,
  };
}

export function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

export function knows(s: GameState, id: string): boolean {
  return !!(s.clues[id] || s.statements[id] || s.deductions[id]);
}

export function hasFlag(s: GameState, f: string): boolean {
  return !!s.flags[f];
}

const DAY: Record<number, string> = { 0: 'Gegenwart', 1: 'Mi', 2: 'Mi', 3: 'Do', 4: 'Fr', 5: 'Sa' };
const TOD: Record<string, string> = { morgen: 'morgens', mittag: 'mittags', nachmittag: 'nachmittags', abend: 'abends', nacht: 'nachts' };
export function timeLabel(s: GameState): string {
  if (s.chapter === 4 && s.time === 'nacht' && !s.flags['g_plate_dev']) return 'Do, nachts';
  return `${DAY[s.chapter] ?? ''}, ${TOD[s.time]}`;
}

export function evalCond(s: GameState, c: Cond | undefined): boolean {
  if (!c) return true;
  if (c.chapterIn && !c.chapterIn.includes(s.chapter)) return false;
  if (c.minChapter !== undefined && s.chapter < c.minChapter) return false;
  if (c.maxChapter !== undefined && s.chapter > c.maxChapter) return false;
  if (c.flagsAll && !c.flagsAll.every((f) => s.flags[f])) return false;
  if (c.flagsNone && c.flagsNone.some((f) => s.flags[f])) return false;
  if (c.flagsAny && !c.flagsAny.some((f) => s.flags[f])) return false;
  if (c.knows && !c.knows.every((k) => knows(s, k))) return false;
  if (c.knowsAny && !c.knowsAny.some((k) => knows(s, k))) return false;
  if (c.knowsNone && c.knowsNone.some((k) => knows(s, k))) return false;
  if (c.trustMin) for (const [n, v] of Object.entries(c.trustMin)) if (s.trust[n as NpcId] < (v as number)) return false;
  if (c.trustBelow) for (const [n, v] of Object.entries(c.trustBelow)) if (s.trust[n as NpcId] >= (v as number)) return false;
  if (c.timeOfDay && !c.timeOfDay.includes(s.time)) return false;
  if (c.location && !c.location.includes(s.loc)) return false;
  if (c.yuumiPresent !== undefined && (s.yuumiLoc === s.loc && !s.flags['g_yuumi_lost']) !== c.yuumiPresent) return false;
  if (c.suspicionMin !== undefined && s.suspicion < c.suspicionMin) return false;
  if (c.suspicionBelow !== undefined && s.suspicion >= c.suspicionBelow) return false;
  if (c.seen && !c.seen.every((d) => s.seen[d])) return false;
  if (c.notSeen && c.notSeen.some((d) => s.seen[d])) return false;
  if (c.controlling && s.controlling !== c.controlling) return false;
  return true;
}

export type GameEvent =
  | { type: 'sfx'; id: string }
  | { type: 'music'; id: string }
  | { type: 'clue'; id: string }
  | { type: 'statement'; id: string }
  | { type: 'deduction'; id: string }
  | { type: 'goto'; loc: string; x: number }
  | { type: 'chapter'; n: number }
  | { type: 'special'; id: string }
  | { type: 'trust'; npc: NpcId; delta: number };

export function applyEffects(s: GameState, e: Effects | undefined, out: GameEvent[]): void {
  if (!e) return;
  if (e.trust) for (const [n, d] of Object.entries(e.trust)) {
    const npc = n as NpcId;
    s.trust[npc] = Math.max(0, Math.min(10, s.trust[npc] + (d as number)));
    out.push({ type: 'trust', npc, delta: d as number });
  }
  if (e.flags) for (const f of e.flags) s.flags[f] = true;
  if (e.unflags) for (const f of e.unflags) delete s.flags[f];
  const when = timeLabel(s);
  if (e.addClue) for (const c of e.addClue) if (!s.clues[c]) { s.clues[c] = when; out.push({ type: 'clue', id: c }); }
  if (e.addStatement) for (const c of e.addStatement) if (!s.statements[c]) { s.statements[c] = when; out.push({ type: 'statement', id: c }); }
  if (e.suspicion) s.suspicion = Math.max(0, Math.min(10, s.suspicion + e.suspicion));
  if (e.setTime) s.time = e.setTime;
  if (e.sfx) out.push({ type: 'sfx', id: e.sfx });
  if (e.music) out.push({ type: 'music', id: e.music });
  if (e.chapter !== undefined) { s.chapter = e.chapter; out.push({ type: 'chapter', n: e.chapter }); }
  if (e.goto) out.push({ type: 'goto', loc: e.goto.loc, x: e.goto.x });
  if (e.special) out.push({ type: 'special', id: e.special });
}

export function placementsAt(s: GameState, c: Content, loc: string): { npc: NpcId; x: number }[] {
  const res: { npc: NpcId; x: number }[] = [];
  for (const npc of NPCS) {
    const p = c.placements.find((pl) => pl.npc === npc && evalCond(s, pl.when));
    if (p && p.loc === loc) res.push({ npc, x: p.x });
  }
  return res;
}

export function whereIs(s: GameState, c: Content, npc: NpcId): string | null {
  const p = c.placements.find((pl) => pl.npc === npc && evalCond(s, pl.when));
  return p ? p.loc : null;
}
