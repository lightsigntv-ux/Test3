// Speichern/Laden mit Versionsnummer, Migration und Schutz vor beschädigten Ständen.
import type { GameState } from './types';
import { INITIAL_TRUST, SAVE_VERSION, newGame } from './core';

export interface Store {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

export const SAVE_KEY = 'serasfall.save';
export const BACKUP_KEY = 'serasfall.save.beschaedigt';

export function serialize(s: GameState): string {
  return JSON.stringify({ v: SAVE_VERSION, t: Date.now(), state: s });
}

/** Migriert ältere Stände schrittweise auf die aktuelle Version. */
export function migrate(raw: any): GameState {
  let st = raw.state ?? raw;
  let v: number = raw.v ?? st.version ?? 1;
  if (v < 2) {
    // v1 kannte weder Tarnung noch Rotation
    st.suspicion ??= 0;
    st.presentRot ??= {};
    v = 2;
  }
  if (v < 3) {
    st.recon ??= {};
    st.hintLevel ??= {};
    st.playMinutes ??= 0;
    v = 3;
  }
  const base = newGame();
  const s: GameState = { ...base, ...st, version: SAVE_VERSION };
  s.trust = { ...INITIAL_TRUST, ...(st.trust ?? {}) };
  return s;
}

export function validate(s: GameState): boolean {
  return (
    typeof s.chapter === 'number' && s.chapter >= 0 && s.chapter <= 6 &&
    typeof s.loc === 'string' && typeof s.flags === 'object' && typeof s.clues === 'object' &&
    typeof s.trust === 'object' && Array.isArray(s.log)
  );
}

export type LoadResult = { ok: true; state: GameState } | { ok: false; reason: 'none' | 'corrupt' };

export function deserialize(text: string): LoadResult {
  try {
    const raw = JSON.parse(text);
    const s = migrate(raw);
    if (!validate(s)) return { ok: false, reason: 'corrupt' };
    return { ok: true, state: s };
  } catch {
    return { ok: false, reason: 'corrupt' };
  }
}

export function load(store: Store): LoadResult {
  const text = store.getItem(SAVE_KEY);
  if (!text) return { ok: false, reason: 'none' };
  const r = deserialize(text);
  if (!r.ok) {
    store.setItem(BACKUP_KEY, text);
    store.removeItem(SAVE_KEY);
  }
  return r;
}

export function save(store: Store, s: GameState): void {
  store.setItem(SAVE_KEY, serialize(s));
}

/** Export als kopierbarer Text (Base64 über UTF-8). */
export function exportText(s: GameState): string {
  const json = serialize(s);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return 'SERASFALL:' + btoa(bin);
}

export function importText(text: string): LoadResult {
  const t = text.trim();
  if (!t.startsWith('SERASFALL:')) return { ok: false, reason: 'corrupt' };
  try {
    const bin = atob(t.slice(10));
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    return deserialize(new TextDecoder().decode(bytes));
  } catch {
    return { ok: false, reason: 'corrupt' };
  }
}
