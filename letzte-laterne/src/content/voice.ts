// Zuordnung Sprechzeile → Audiodatei. Der Schlüssel hängt nur von Sprecher und Text ab,
// daher bleibt eine Aufnahme gültig, solange sich die Zeile nicht ändert.
import { hashString } from '../sim/rng';
import type { DialogLine } from './story';
import manifest from './voice-manifest.json';

export function voiceKey(line: Pick<DialogLine, 'speaker' | 'text'>): string {
  return `${line.speaker}-${hashString(`${line.speaker}|${line.text}`).toString(36)}`;
}

const available = new Set<string>(manifest.keys);

/** Pfad zur Sprachaufnahme oder null, wenn es keine gibt (z. B. reine Katzengeräusche). */
export function voiceFile(line: Pick<DialogLine, 'speaker' | 'text'>): string | null {
  const k = voiceKey(line);
  return available.has(k) ? `audio/voice/${k}.mp3` : null;
}

/** Text, der tatsächlich gesprochen wird: Regieanweisungen *…* werden erzählt, reine Laute entfallen. */
export function spokenText(line: Pick<DialogLine, 'speaker' | 'text'>): string | null {
  let t = line.text.replace(/\*/g, '').trim();
  if (/^m+r+p+\??$/i.test(t) || !/[a-zäöüß]/i.test(t)) return null;
  t = t.replace(/–/g, ',');
  return t;
}
