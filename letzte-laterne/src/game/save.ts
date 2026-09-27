// Versioniertes Spielstandformat mit Validierung, Migration, Export und Import.
import { ITEMS, RELICS } from '../content/items';
import { SEALS, UPGRADES } from '../content/progression';
import { HERO_IDS } from '../content/types';
import { SAVE_VERSION, type MetaState, type RunState, type SaveData, type Settings } from './types';

export const SAVE_KEY = 'letzte-laterne/save';
export const CORRUPT_KEY = 'letzte-laterne/corrupt';

export function defaultMeta(): MetaState {
  return {
    light: 0,
    lightEarnedTotal: 0,
    sealsOwned: [],
    sealsActive: [],
    unlockedExpedition: 1,
    bossesDefeated: [],
    discoveredItems: [],
    discoveredRelics: [],
    yuumiDiscovered: false,
    story: { courierSaved: null, namesFreed: null, ending: null, endingWithYuumi: false },
    seenDialogs: [],
    tutorialsSeen: [],
    firstEliteLegendaryGiven: false,
    catGuaranteeUsed: false,
    runsStarted: 0,
    runsWon: 0,
    longNight: { wins: 0, bestMods: 0, history: [] },
  };
}

export function defaultSettings(): Settings {
  return { sound: true, volume: 0.5, animations: true, defaultSpeed: 1 };
}

export function newSave(): SaveData {
  return { version: SAVE_VERSION, meta: defaultMeta(), run: null, settings: defaultSettings(), dialogQueue: [], notice: null };
}

type Json = Record<string, unknown>;
const isObj = (x: unknown): x is Json => typeof x === 'object' && x !== null && !Array.isArray(x);
const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const isStrArr = (x: unknown): x is string[] => Array.isArray(x) && x.every((s) => typeof s === 'string');

function validMeta(m: unknown): m is MetaState {
  if (!isObj(m)) return false;
  if (!isNum(m.light) || m.light < 0) return false;
  if (!isStrArr(m.sealsOwned) || !m.sealsOwned.every((s) => s in SEALS)) return false;
  if (!isStrArr(m.sealsActive) || !m.sealsActive.every((s) => (m.sealsOwned as string[]).includes(s))) return false;
  if (![1, 2, 3].includes(m.unlockedExpedition as number)) return false;
  if (!isStrArr(m.discoveredItems) || !isStrArr(m.discoveredRelics)) return false;
  if (!isObj(m.story)) return false;
  if (!isStrArr(m.seenDialogs)) return false;
  return true;
}

function validRun(r: unknown): r is RunState {
  if (!isObj(r)) return false;
  if (!isNum(r.seed) || ![1, 2, 3].includes(r.expedition as number)) return false;
  if (!Array.isArray(r.stations) || r.stations.length !== 8) return false;
  if (!isNum(r.station) || r.station < 0 || r.station > 7) return false;
  if (!['map', 'combat', 'reward', 'levelup', 'event', 'camp', 'ending', 'result'].includes(r.phase as string)) return false;
  if (!isObj(r.hp) || !HERO_IDS.every((h) => isNum((r.hp as Json)[h]))) return false;
  if (!isStrArr(r.formation) || r.formation.length !== 3 || !HERO_IDS.every((h) => (r.formation as string[]).includes(h))) return false;
  if (!isObj(r.equipment)) return false;
  for (const h of HERO_IDS) {
    const slots = (r.equipment as Json)[h];
    if (!Array.isArray(slots) || slots.length !== 2) return false;
    if (!slots.every((s) => s === null || (typeof s === 'string' && s in ITEMS))) return false;
  }
  if (!Array.isArray(r.relics) || r.relics.length !== 2) return false;
  if (!r.relics.every((s) => s === null || (typeof s === 'string' && s in RELICS))) return false;
  const real = r.relics.filter((x) => x);
  if (new Set(real).size !== real.length) return false; // einzigartige Relikte
  if (!isStrArr(r.upgrades) || !r.upgrades.every((u) => u in UPGRADES)) return false;
  if (r.phase === 'combat' && !isObj(r.combat)) return false;
  if (r.phase === 'reward' && !isObj(r.reward)) return false;
  if (r.phase === 'event' && !isObj(r.event)) return false;
  if (r.phase === 'result' && !isObj(r.result)) return false;
  return true;
}

/** Füllt fehlende Felder älterer Stände mit Standardwerten auf. */
function migrate(raw: Json): Json {
  const version = isNum(raw.version) ? raw.version : 0;
  const out: Json = { ...raw };
  if (version < 1) {
    // Version 0 (Vorabversion ohne Versionsnummer): Einstellungen und Warteschlange fehlten
    out.settings = { ...defaultSettings(), ...(isObj(raw.settings) ? raw.settings : {}) };
    out.dialogQueue = [];
  }
  if (isObj(out.meta)) out.meta = { ...defaultMeta(), ...out.meta, story: { ...defaultMeta().story, ...(isObj(out.meta.story) ? out.meta.story : {}) } };
  out.settings = { ...defaultSettings(), ...(isObj(out.settings) ? out.settings : {}) };
  if (!isStrArr(out.dialogQueue)) out.dialogQueue = [];
  out.version = SAVE_VERSION;
  return out;
}

export type LoadResult = { save: SaveData; status: 'ok' | 'new' | 'recovered' | 'corrupt' };

/** Prüft und migriert einen beliebigen JSON-Text. Gibt null zurück, wenn unbrauchbar. */
export function parseSave(text: string): { save: SaveData; runDropped: boolean } | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isObj(raw)) return null;
  if (isNum(raw.version) && raw.version > SAVE_VERSION) return null;
  const m = migrate(raw);
  if (!validMeta(m.meta)) return null;
  let runDropped = false;
  let run: RunState | null = null;
  if (m.run !== null && m.run !== undefined) {
    if (validRun(m.run)) run = m.run;
    else runDropped = true;
  }
  const save: SaveData = {
    version: SAVE_VERSION,
    meta: m.meta as MetaState,
    run,
    settings: m.settings as Settings,
    dialogQueue: m.dialogQueue as string[],
    notice: null,
  };
  return { save, runDropped };
}

export interface StorageLike {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

export function loadSave(storage: StorageLike): LoadResult {
  let text: string | null = null;
  try {
    text = storage.getItem(SAVE_KEY);
  } catch {
    text = null;
  }
  if (!text) return { save: newSave(), status: 'new' };
  const parsed = parseSave(text);
  if (!parsed) {
    try {
      storage.setItem(CORRUPT_KEY, text);
    } catch {
      /* ignorieren */
    }
    const save = newSave();
    save.notice = 'Der gespeicherte Spielstand war beschädigt und konnte nicht geladen werden. Eine Kopie wurde gesichert; es beginnt ein neues Spiel.';
    return { save, status: 'corrupt' };
  }
  if (parsed.runDropped) {
    parsed.save.notice = 'Die laufende Expedition war beschädigt und wurde beendet. Dein dauerhafter Fortschritt ist erhalten.';
    return { save: parsed.save, status: 'recovered' };
  }
  return { save: parsed.save, status: 'ok' };
}

export function writeSave(storage: StorageLike, save: SaveData): boolean {
  try {
    const { notice: _notice, ...rest } = save;
    void _notice;
    storage.setItem(SAVE_KEY, JSON.stringify({ ...rest, notice: null }));
    return true;
  } catch {
    return false;
  }
}

export function exportSave(save: SaveData): string {
  return JSON.stringify({ ...save, notice: null, exportedFrom: 'Die letzte Laterne' }, null, 2);
}

export function importSave(text: string): { ok: true; save: SaveData } | { ok: false; error: string } {
  const parsed = parseSave(text);
  if (!parsed) return { ok: false, error: 'Die Datei ist kein gültiger Spielstand von „Die letzte Laterne“.' };
  if (parsed.runDropped) parsed.save.notice = 'Import: Die enthaltene Expedition war ungültig und wurde verworfen; der dauerhafte Fortschritt wurde übernommen.';
  return { ok: true, save: parsed.save };
}
