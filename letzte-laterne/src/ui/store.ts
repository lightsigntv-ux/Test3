import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { loadSave, writeSave } from '../game/save';
import type { SaveData } from '../game/types';

export type Act = (fn: (s: SaveData) => SaveData) => void;

export interface GameCtx {
  save: SaveData;
  act: Act;
  replace: (s: SaveData) => void;
}

export const GameContext = createContext<GameCtx | null>(null);

export function useGame(): GameCtx {
  const c = useContext(GameContext);
  if (!c) throw new Error('GameContext fehlt');
  return c;
}

function storage() {
  try {
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    };
  }
}

/** Zentraler Spielzustand: jede Aktion ist eine reine Funktion; nach jeder Änderung wird gespeichert. */
export function useGameStore(): GameCtx {
  const [save, setSave] = useState<SaveData>(() => loadSave(storage()).save);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    writeSave(storage(), save);
  }, [save]);
  const act = useCallback<Act>((fn) => setSave((prev) => fn(prev)), []);
  const replace = useCallback((s: SaveData) => setSave(s), []);
  return { save, act, replace };
}
