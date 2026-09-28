// Einstellungen: pro Browser gemerkt (reine Bequemlichkeit), mit sicherem Fallback.
import type { Volumes } from './audio';

export interface Settings {
  textSpeed: 'langsam' | 'normal' | 'schnell' | 'sofort';
  textSize: 'klein' | 'mittel' | 'groß';
  reducedMotion: boolean;
  volumes: Volumes;
}

const KEY = 'serasfall.settings';

export const DEFAULT_SETTINGS: Settings = {
  textSpeed: 'normal',
  textSize: 'mittel',
  reducedMotion: false,
  volumes: { master: 0.8, voice: 0.7, music: 0.5, ambience: 0.6, sfx: 0.8, muted: false },
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      return { ...DEFAULT_SETTINGS, reducedMotion: reduce };
    }
    const s = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...s, volumes: { ...DEFAULT_SETTINGS.volumes, ...(s.volumes ?? {}) } };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* privat/blockiert: egal */ }
}

export const CHAR_MS: Record<Settings['textSpeed'], number> = { langsam: 42, normal: 26, schnell: 13, sofort: 0 };
