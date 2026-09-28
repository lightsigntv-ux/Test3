// Parser für das kompakte Dialogskript (siehe docs/SCRIPT_FORMAT.md). Reine Funktionen.
import type { Choice, Cond, Dialogue, DialogueKind, DNode, Effects, Expr, NpcId, SpeakerId, Stance, TimeOfDay, LocId } from './types';
import { EXPRS, NPCS } from './types';

const SPEAKERS: SpeakerId[] = [...NPCS, 'sera', 'inner', 'narr', 'yuumi', 'letter'];
const STANCES: Stance[] = ['mitfuehlend', 'direkt', 'ausweichend', 'ehrlich', 'schweigen', 'humor', 'luege', 'neutral'];

export class ScriptError extends Error {}

export function parseCond(src: string): Cond {
  const c: Cond = {};
  const push = <K extends keyof Cond>(k: K, v: any) => {
    const arr = ((c[k] as any) ??= []);
    arr.push(...(Array.isArray(v) ? v : [v]));
  };
  for (const tok of src.trim().split(/\s+/).filter(Boolean)) {
    let m: RegExpMatchArray | null;
    if ((m = tok.match(/^ch=([\d,]+)$/))) c.chapterIn = m[1].split(',').map(Number);
    else if ((m = tok.match(/^ch>=(\d+)$/))) c.minChapter = +m[1];
    else if ((m = tok.match(/^ch<=(\d+)$/))) c.maxChapter = +m[1];
    else if ((m = tok.match(/^!f:(.+)$/))) push('flagsNone', m[1].split(','));
    else if ((m = tok.match(/^anyf:(.+)$/))) push('flagsAny', m[1].split(','));
    else if ((m = tok.match(/^f:(.+)$/))) push('flagsAll', m[1].split(','));
    else if ((m = tok.match(/^!k:(.+)$/))) push('knowsNone', m[1].split(','));
    else if ((m = tok.match(/^anyk:(.+)$/))) push('knowsAny', m[1].split(','));
    else if ((m = tok.match(/^k:(.+)$/))) push('knows', m[1].split(','));
    else if ((m = tok.match(/^t:(\w+)>=(-?\d+)$/))) (c.trustMin ??= {})[m[1] as NpcId] = +m[2];
    else if ((m = tok.match(/^t:(\w+)<(-?\d+)$/))) (c.trustBelow ??= {})[m[1] as NpcId] = +m[2];
    else if ((m = tok.match(/^!tod=(.+)$/))) c.timeNot = m[1].split(',') as TimeOfDay[];
    else if ((m = tok.match(/^!loc=(.+)$/))) c.locationNot = m[1].split(',') as LocId[];
    else if ((m = tok.match(/^tod=(.+)$/))) c.timeOfDay = m[1].split(',') as TimeOfDay[];
    else if ((m = tok.match(/^loc=(.+)$/))) c.location = m[1].split(',') as LocId[];
    else if (tok === 'yuumi') c.yuumiPresent = true;
    else if (tok === '!yuumi') c.yuumiPresent = false;
    else if ((m = tok.match(/^sus>=(\d+)$/))) c.suspicionMin = +m[1];
    else if ((m = tok.match(/^sus<(\d+)$/))) c.suspicionBelow = +m[1];
    else if ((m = tok.match(/^!seen:(.+)$/))) push('notSeen', m[1].split(','));
    else if ((m = tok.match(/^seen:(.+)$/))) push('seen', m[1].split(','));
    else if ((m = tok.match(/^as=(sera|yuumi)$/))) c.controlling = m[1] as 'sera' | 'yuumi';
    else throw new ScriptError(`Unbekannte Bedingung: ${tok}`);
  }
  return c;
}

export interface Meta {
  effects?: Effects;
  reveals?: string[];
  hints?: string[];
  lie?: string;
  pause?: number;
  mood?: string;
}

export function parseMeta(src: string): Meta {
  const meta: Meta = {};
  const e: Effects = {};
  let hasE = false;
  for (const raw of src.split(',').map((s) => s.trim()).filter(Boolean)) {
    let m: RegExpMatchArray | null;
    if ((m = raw.match(/^(\w+)([+-]\d+)$/)) && (NPCS as string[]).includes(m[1])) {
      (e.trust ??= {})[m[1] as NpcId] = ((e.trust[m[1] as NpcId] ?? 0) + +m[2]);
      hasE = true;
    } else if ((m = raw.match(/^sus([+-]\d+)$/))) { e.suspicion = (e.suspicion ?? 0) + +m[1]; hasE = true; }
    else if ((m = raw.match(/^\+f:(.+)$/))) { (e.flags ??= []).push(m[1]); hasE = true; }
    else if ((m = raw.match(/^-f:(.+)$/))) { (e.unflags ??= []).push(m[1]); hasE = true; }
    else if ((m = raw.match(/^\+c:(.+)$/))) { (e.addClue ??= []).push(...m[1].split('|')); hasE = true; }
    else if ((m = raw.match(/^\+s:(.+)$/))) { (e.addStatement ??= []).push(...m[1].split('|')); hasE = true; }
    else if ((m = raw.match(/^time=(\w+)$/))) { e.setTime = m[1] as TimeOfDay; hasE = true; }
    else if ((m = raw.match(/^sfx:(.+)$/))) { e.sfx = m[1]; hasE = true; }
    else if ((m = raw.match(/^music:(.+)$/))) { e.music = m[1]; hasE = true; }
    else if ((m = raw.match(/^go:(\w+)@([\d.]+)$/))) { e.goto = { loc: m[1] as LocId, x: +m[2] }; hasE = true; }
    else if ((m = raw.match(/^chap:(\d+)$/))) { e.chapter = +m[1]; hasE = true; }
    else if ((m = raw.match(/^do:(.+)$/))) { e.special = m[1]; hasE = true; }
    else if ((m = raw.match(/^reveals:(.+)$/))) meta.reveals = m[1].split('|');
    else if ((m = raw.match(/^hints:(.+)$/))) meta.hints = m[1].split('|');
    else if ((m = raw.match(/^lie:(.+)$/))) meta.lie = m[1];
    else if ((m = raw.match(/^pause:(\d+)$/))) meta.pause = +m[1];
    else if ((m = raw.match(/^mood:(\w+)$/))) meta.mood = m[1];
    else throw new ScriptError(`Unbekannte Angabe: {${raw}}`);
  }
  if (hasE) meta.effects = e;
  return meta;
}

function splitTrailingMeta(s: string): [string, Meta | undefined] {
  const m = s.match(/^(.*?)\s*\{([^{}]*)\}\s*$/s);
  if (!m) return [s.trim(), undefined];
  return [m[1].trim(), parseMeta(m[2])];
}

export function parseScript(src: string, source = 'script'): Dialogue[] {
  const out: Dialogue[] = [];
  const blocks = src.split(/^===\s*/m).slice(1);
  for (const block of blocks) {
    const lines = block.split('\n');
    const id = lines[0].trim();
    if (!/^[a-z0-9_]+$/.test(id)) throw new ScriptError(`${source}: ungültige Dialog-ID "${id}"`);
    let i = 1;
    const header: Record<string, string> = {};
    for (; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l === '---') { i++; break; }
      if (!l || l.startsWith('//')) continue;
      const m = l.match(/^(\w+):\s*(.*)$/);
      if (!m) throw new ScriptError(`${source}/${id}: Kopfzeile unlesbar: ${l}`);
      header[m[1]] = m[2];
    }
    const kind = (header.kind ?? 'topic') as DialogueKind;
    const dlg: Dialogue = {
      id,
      kind,
      npc: header.npc as NpcId | undefined,
      title: header.title,
      target: header.target,
      items: header.items ? header.items.split(',').map((s) => s.trim()) : undefined,
      when: header.when ? parseCond(header.when) : undefined,
      priority: header.priority ? +header.priority : 0,
      repeat: header.repeat === 'yes' ? true : header.repeat === 'no' ? false : kind === 'examine' || (kind === 'present' && (header.items ?? '') === '*'),
      important: header.important === 'yes',
      start: '',
      nodes: {},
      order: [],
      source,
    };
    let auto = 0;
    let pendingLabel: string | null = null;
    let prev = null as DNode | null; // zuletzt erzeugter Knoten, dessen next noch offen ist
    let pendingChoicesNode = null as DNode | null; // Knoten mit Wahlmöglichkeiten, die ohne Ziel weiterführen
    let choiceHost = null as DNode | null; // aktueller Wahlblock
    const make = (n: Omit<DNode, 'id'>): DNode => {
      const nid = pendingLabel ?? `n${++auto}`;
      pendingLabel = null;
      if (dlg.nodes[nid]) throw new ScriptError(`${source}/${id}: doppelte Marke ${nid}`);
      const node: DNode = { id: nid, ...n };
      dlg.nodes[nid] = node;
      dlg.order.push(nid);
      if (!dlg.start) dlg.start = nid;
      if (prev && prev.next === undefined && !prev.choices) prev.next = nid;
      if (pendingChoicesNode) {
        for (const c of pendingChoicesNode.choices!) if (c.next === '__next') c.next = nid;
        pendingChoicesNode = null;
      }
      prev = node;
      return node;
    };
    for (; i < lines.length; i++) {
      const raw = lines[i];
      const l = raw.trim();
      if (!l || l.startsWith('//')) continue;
      let m: RegExpMatchArray | null;
      if (!l.startsWith('*')) choiceHost = null;
      if ((m = l.match(/^#\s*(\w+)$/))) {
        if (pendingLabel) make({ silent: true });
        pendingLabel = m[1];
        continue;
      }
      if ((m = l.match(/^->\s*(\w+)$/))) {
        if (pendingLabel || !prev || prev.choices || prev.next !== undefined) {
          const n = make({ silent: true });
          n.next = m[1];
        } else prev.next = m[1];
        prev = null;
        continue;
      }
      if ((m = l.match(/^\?\s*(.+?)\s*->\s*(\w+)$/))) {
        let node = prev && prev.silent && prev.branch && prev.next === undefined && !pendingLabel ? prev : null;
        if (!node) node = make({ silent: true, branch: [] });
        node.branch!.push({ cond: parseCond(m[1]), next: m[2] });
        continue;
      }
      if ((m = l.match(/^!\s*\{(.*)\}$/))) {
        const meta = parseMeta(m[1]);
        make({ silent: true, effects: meta.effects });
        continue;
      }
      if (l.startsWith('*')) {
        let rest = l.slice(1).trim();
        const sm = rest.match(/^\[(\w+)\]\s*(.*)$/);
        if (!sm) throw new ScriptError(`${source}/${id}: Wahl ohne [Haltung]: ${l}`);
        const stance = sm[1] as Stance;
        if (!STANCES.includes(stance)) throw new ScriptError(`${source}/${id}: unbekannte Haltung ${stance}`);
        rest = sm[2];
        let next = '__next';
        const jm = rest.match(/^(.*?)\s*->\s*(\w+)$/);
        if (jm) { rest = jm[1]; next = jm[2]; }
        let cond: Cond | undefined;
        const cm = rest.match(/^(.*?)\s*\?\((.*)\)$/);
        if (cm) { rest = cm[1]; cond = parseCond(cm[2]); }
        const [text, meta] = splitTrailingMeta(rest);
        let host: DNode | null = choiceHost;
        if (!host) {
          host = prev && prev.next === undefined && !prev.choices && !pendingLabel ? prev : make({ silent: true });
          choiceHost = host;
        }
        host.choices ??= [];
        const choice: Choice = { text, stance, next, effects: meta?.effects, cond };
        host.choices.push(choice);
        if (next === '__next') pendingChoicesNode = host;
        continue;
      }
      if ((m = l.match(/^(\w+)(?:\[(\w+)\])?:\s*(.*)$/)) && (SPEAKERS as string[]).includes(m[1])) {
        const expr = m[2] as Expr | undefined;
        if (expr && !EXPRS.includes(expr)) throw new ScriptError(`${source}/${id}: unbekannter Ausdruck ${expr}`);
        const [text, meta] = splitTrailingMeta(m[3]);
        if (!text) throw new ScriptError(`${source}/${id}: leere Zeile`);
        const node = make({ speaker: m[1] as SpeakerId, expr, text });
        if (meta) {
          node.effects = meta.effects;
          node.reveals = meta.reveals;
          node.hints = meta.hints;
          node.lie = meta.lie;
          node.pause = meta.pause;
          node.mood = meta.mood;
        }
        // Fortsetzungszeilen (eingerückt, ohne Sprecher) anhängen
        while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1]) && !/^\s*(\*|#|->|\?|!|\w+(\[\w+\])?:)/.test(lines[i + 1])) {
          node.text += ' ' + lines[++i].trim();
        }
        continue;
      }
      throw new ScriptError(`${source}/${id}: Zeile unlesbar: ${l}`);
    }
    if (pendingLabel) make({ silent: true });
    if (pendingChoicesNode) for (const c of (pendingChoicesNode as DNode).choices!) if (c.next === '__next') c.next = 'END';
    if (!dlg.start) throw new ScriptError(`${source}/${id}: leer`);
    out.push(dlg);
  }
  return out;
}
