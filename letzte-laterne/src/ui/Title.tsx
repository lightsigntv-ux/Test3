import { useState } from 'react';
import * as A from '../game/actions';
import { HeroArt, LanternIcon, YuumiArt } from './art';
import { Modal } from './components';
import { useGame } from './store';

export function Title({ onEnter }: { onEnter: () => void }) {
  const { save, act } = useGame();
  const hasProgress = save.meta.runsStarted > 0 || save.meta.seenDialogs.length > 0 || !!save.run;
  const [confirm, setConfirm] = useState(false);
  const [checked, setChecked] = useState(false);
  return (
    <div className="title-screen">
      <div className="fog f1" />
      <div className="fog f2" />
      <div className="title-center">
        <LanternIcon size={54} />
        <h1>Die letzte Laterne</h1>
        <p className="subtitle">Ein Roguelite-Autobattler im Nebel von Vesper</p>
        <div className="title-party">
          <HeroArt id="fritz" size={90} />
          <HeroArt id="sera" size={90} mood="happy" />
          <HeroArt id="ivo" size={90} />
          {save.meta.yuumiDiscovered && (
            <div className="title-cat">
              <YuumiArt size={48} />
            </div>
          )}
        </div>
        <div className="col gap center">
          {hasProgress && (
            <button className="btn primary big" onClick={onEnter} autoFocus>
              {save.run ? 'Expedition fortsetzen' : 'Weiterspielen'}
            </button>
          )}
          <button
            className={`btn big ${hasProgress ? '' : 'primary'}`}
            onClick={() => {
              if (hasProgress) setConfirm(true);
              else {
                act((s) => A.startNewGame(s));
                onEnter();
              }
            }}
          >
            Neues Spiel
          </button>
        </div>
        <p className="muted small">🔊 Mit Musik und vollständig vertonten Dialogen – am besten mit Ton spielen.</p>
        <p className="muted small">Maus: alles · Leertaste: Pause · 1/2/3: Fähigkeiten · S: Geschwindigkeit · B: Build-Übersicht</p>
      </div>
      {confirm && (
        <Modal title="Neues Spiel beginnen?" onClose={() => setConfirm(false)}>
          <p>
            Dies löscht deinen <b>gesamten</b> Fortschritt: Erinnerungslicht, Siegel, Story, Sammlung. Tipp: Exportiere vorher deinen Spielstand in den Einstellungen.
          </p>
          <label className="row gap">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} /> Ich verstehe, dass mein Fortschritt endgültig gelöscht wird.
          </label>
          <div className="row gap" style={{ marginTop: 12 }}>
            <button
              className="btn danger"
              disabled={!checked}
              onClick={() => {
                act((s) => A.startNewGame(s));
                setConfirm(false);
                onEnter();
              }}
            >
              Alles löschen und neu beginnen
            </button>
            <button className="btn" onClick={() => setConfirm(false)}>
              Abbrechen
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
