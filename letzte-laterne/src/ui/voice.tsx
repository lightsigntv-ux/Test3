import { useEffect, useRef, useState } from 'react';
import type { DialogLine } from '../content/story';
import { spokenText, voiceFile } from '../content/voice';
import { onVoiceChange, speak, stopVoice } from './audio';

export function hasVoice(line: Pick<DialogLine, 'speaker' | 'text'>): boolean {
  return !!(spokenText(line) && voiceFile(line));
}

/** Kleiner Knopf zum (erneuten) Abspielen einer Zeile. */
export function VoiceButton({ line }: { line: Pick<DialogLine, 'speaker' | 'text'> }) {
  if (!hasVoice(line)) return null;
  return (
    <button
      className="voice-btn"
      data-sfx="none"
      title="Zeile anhören"
      aria-label="Zeile anhören"
      onClick={(e) => {
        e.stopPropagation();
        void speak(line);
      }}
    >
      🔊
    </button>
  );
}

export function useVoicePlaying(): boolean {
  const [p, setP] = useState(false);
  useEffect(() => onVoiceChange(setP), []);
  return p;
}

const spokenOnce = new Set<string>();
/** Spricht eine Zeile einmal pro Sitzung und Schlüssel (z. B. Sätze in der Laternenstube). */
export function useSpeakOnce(line: Pick<DialogLine, 'speaker' | 'text'>, key: string, enabled = true) {
  useEffect(() => {
    if (!enabled || spokenOnce.has(key)) return;
    const t = setTimeout(() => {
      spokenOnce.add(key);
      void speak(line);
    }, 600);
    return () => clearTimeout(t);
  }, [key, line, enabled]);
}

/**
 * Liest mehrere Zeilen nacheinander vor (Ereignisse, Lager). Gibt den Index der gerade
 * gesprochenen Zeile zurück (-1 = keine). Beim Verlassen wird die Stimme angehalten.
 */
export function useSequentialSpeech(lines: Pick<DialogLine, 'speaker' | 'text'>[], key: string): number {
  const [cur, setCur] = useState(-1);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 350));
      for (let i = 0; i < lines.length && !cancelled; i++) {
        setCur(i);
        await speak(lines[i]);
        if (!cancelled) await new Promise((r) => setTimeout(r, 250));
      }
      if (!cancelled) setCur(-1);
    })();
    return () => {
      cancelled = true;
      alive.current = false;
      stopVoice();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return cur;
}
