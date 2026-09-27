import { useEffect, useState } from 'react';
import { DIALOGS, SPEAKER_NAME, type DialogLine, type LineCondition } from '../content/story';
import { yuumiPresent } from '../game/derive';
import type { SaveData } from '../game/types';
import { EnemyArt, HeroArt, YuumiArt } from './art';
import { play } from './audio';

export function lineVisible(line: DialogLine, save: SaveData): boolean {
  if (!line.if) return true;
  const c: Record<LineCondition, boolean> = {
    yuumi: yuumiPresent(save.run),
    noYuumi: !yuumiPresent(save.run),
    courier: save.meta.story.courierSaved === true,
    noCourier: save.meta.story.courierSaved !== true,
    endingYuumi: save.meta.story.endingWithYuumi,
    namesFreed: save.meta.story.namesFreed === true,
  };
  return c[line.if];
}

export function Speaker({ line, size = 90 }: { line: DialogLine; size?: number }) {
  const s = line.speaker;
  const mood = line.mood === 'smile' ? 'happy' : line.mood === 'happy' ? 'happy' : line.mood === 'sad' ? 'sad' : line.mood === 'serious' ? 'serious' : 'normal';
  if (s === 'fritz' || s === 'ivo' || s === 'sera') return <HeroArt id={s} mood={mood} size={size} />;
  if (s === 'yuumi') return <YuumiArt size={size * 0.8} pose="happy" />;
  if (s === 'waechter') return <EnemyArt id="glockenwaechter" size={size} />;
  if (s === 'archivarin') return <EnemyArt id="archivarin" size={size} />;
  if (s === 'hueter') return <EnemyArt id="hueter" size={size} />;
  if (s === 'mira')
    return (
      <svg width={size} height={size * 1.2} viewBox="0 0 100 120" aria-label="Mira">
        <path d="M34 60 Q50 54 66 60 L70 112 Q50 116 30 112 Z" fill="#3d6b5a" />
        <rect x="56" y="70" width="18" height="22" rx="3" fill="#8a6a3a" />
        <circle cx="50" cy="42" r="15" fill="#e9c3a0" />
        <path d="M35 42 Q34 24 50 24 Q66 24 65 42 Q60 32 50 32 Q40 32 35 42 Z" fill="#5a3a2a" />
        <ellipse cx="44" cy="43" rx="2" ry="2.6" fill="#2a2230" />
        <ellipse cx="56" cy="43" rx="2" ry="2.6" fill="#2a2230" />
        <path d="M46 50 Q50 53 54 50" stroke="#8a4a3a" strokeWidth="1.4" fill="none" />
      </svg>
    );
  return null;
}

/** Zeigt den ersten Dialog der Warteschlange (oder einen Wiederholungsdialog). */
export function DialogOverlay({ save, dialogId, onDone, isNew }: { save: SaveData; dialogId: string; onDone: () => void; isNew: boolean }) {
  const dialog = DIALOGS[dialogId];
  const lines = dialog ? dialog.lines.filter((l) => lineVisible(l, save)) : [];
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [dialogId]);
  const line = lines[Math.min(i, lines.length - 1)];
  useEffect(() => {
    if (line?.speaker === 'yuumi') play('meow');
  }, [line]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'Escape') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  if (!dialog || !line) {
    return null;
  }
  const next = () => {
    if (i + 1 >= lines.length) onDone();
    else setI(i + 1);
  };
  const narrator = line.speaker === 'narrator';
  return (
    <div className="dialog-back">
      <div className="dialog-box">
        <div className="dialog-head">
          <span className="dialog-title">{dialog.title}</span>
          {isNew && <span className="badge-new">NEU</span>}
          <span className="muted small">
            {i + 1}/{lines.length}
          </span>
        </div>
        <div className={`dialog-content ${narrator ? 'narrator' : ''}`}>
          {!narrator && (
            <div className={`dialog-portrait sp-${line.speaker}`}>
              <Speaker line={line} />
            </div>
          )}
          <div className="dialog-text">
            {!narrator && <div className="dialog-name">{SPEAKER_NAME[line.speaker]}</div>}
            <p>{line.text}</p>
          </div>
        </div>
        <div className="row gap end">
          <button className="btn ghost" onClick={onDone}>
            Überspringen (Esc)
          </button>
          <button className="btn primary" onClick={next} autoFocus>
            {i + 1 >= lines.length ? 'Fertig' : 'Weiter'} (Enter)
          </button>
        </div>
      </div>
    </div>
  );
}
