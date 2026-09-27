import { useRef, useState } from 'react';
import * as A from '../game/actions';
import { exportSave, importSave, newSave } from '../game/save';
import { play } from './audio';
import { Modal } from './components';
import { useGame } from './store';

export function SettingsPanel({ inRun }: { inRun?: boolean }) {
  const { save, act, replace } = useGame();
  const st = save.settings;
  const [importText, setImportText] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetChecked, setResetChecked] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = () => {
    const text = exportSave(save);
    setExported(text);
    try {
      const blob = new Blob([text], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `letzte-laterne-spielstand-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch {
      /* Download kann blockiert sein – der Text steht unten zum Kopieren bereit */
    }
    navigator.clipboard?.writeText(text).then(
      () => setMsg('Spielstand exportiert: Datei (falls der Browser es erlaubt) und Text in der Zwischenablage.'),
      () => setMsg('Spielstand exportiert. Kopiere den Text unten, falls kein Download startet.'),
    );
  };

  const doImport = (text: string) => {
    const res = importSave(text);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    replace(res.save);
    setMsg('Spielstand erfolgreich importiert.');
  };

  return (
    <div className="grid-2">
      <section className="panel">
        <h2>Darstellung & Audio</h2>
        <label className="row gap center-v">
          <input type="checkbox" checked={st.sound} onChange={(e) => act((s) => A.updateSettings(s, { sound: e.target.checked }))} /> Klänge (inkl. Yuumis Schnurren und Miauen)
        </label>
        <label className="row gap center-v">
          Lautstärke
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={st.volume}
            onChange={(e) => act((s) => A.updateSettings(s, { volume: Number(e.target.value) }))}
            onMouseUp={() => play('click')}
          />
          {Math.round(st.volume * 100)} %
        </label>
        <label className="row gap center-v">
          <input type="checkbox" checked={st.animations} onChange={(e) => act((s) => A.updateSettings(s, { animations: e.target.checked }))} /> Animationen
        </label>
        <label className="row gap center-v">
          Standard-Kampfgeschwindigkeit
          <select value={st.defaultSpeed} onChange={(e) => act((s) => A.updateSettings(s, { defaultSpeed: Number(e.target.value) as 1 | 2 }))}>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
          </select>
        </label>
      </section>
      <section className="panel">
        <h2>Spielstand</h2>
        <p className="small muted">Automatisch gespeichert nach jeder Entscheidung (im Browser). Ein laufender Kampf wird beim Neuladen mit demselben Seed neu begonnen.</p>
        <div className="row gap wrap">
          <button className="btn" onClick={doExport}>
            Exportieren
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()} disabled={inRun}>
            Aus Datei importieren
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) doImport(await f.text());
              e.target.value = '';
            }}
          />
        </div>
        {exported && (
          <textarea
            id="export-text"
            className="import-area"
            readOnly
            value={exported}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Exportierter Spielstand"
          />
        )}
        {!inRun && (
          <>
            <textarea id="import-text" className="import-area" placeholder="…oder exportierten Text hier einfügen" value={importText} onChange={(e) => setImportText(e.target.value)} />
            <button className="btn small" disabled={!importText.trim()} onClick={() => doImport(importText)}>
              Text importieren
            </button>
          </>
        )}
        {inRun && <p className="small muted">Import ist nur in der Laternenstube möglich.</p>}
        {msg && <p className="small notice-text">{msg}</p>}
        {!inRun && (
          <button className="btn danger small" style={{ marginTop: 16 }} onClick={() => setResetOpen(true)}>
            Gesamten Fortschritt zurücksetzen …
          </button>
        )}
      </section>
      {resetOpen && (
        <Modal title="Alles zurücksetzen?" onClose={() => setResetOpen(false)}>
          <p>Erinnerungslicht, Siegel, Story, Sammlung und Einstellungen werden gelöscht. Das kann nicht rückgängig gemacht werden.</p>
          <label className="row gap">
            <input type="checkbox" checked={resetChecked} onChange={(e) => setResetChecked(e.target.checked)} /> Ja, ich möchte meinen gesamten Fortschritt endgültig löschen.
          </label>
          <div className="row gap" style={{ marginTop: 12 }}>
            <button
              className="btn danger"
              disabled={!resetChecked}
              onClick={() => {
                const fresh = newSave();
                fresh.dialogQueue = ['intro'];
                replace(fresh);
                setResetOpen(false);
              }}
            >
              Endgültig zurücksetzen
            </button>
            <button className="btn" onClick={() => setResetOpen(false)}>
              Abbrechen
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
