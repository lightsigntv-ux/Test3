import { useState } from 'react';
import { SEALS } from '../../content/progression';
import { TAG_SYMBOL } from '../../content/items';
import * as A from '../../game/actions';
import { HeroArt, YuumiArt } from '../art';
import { useGame } from '../store';

export function ResultScreen() {
  const { save, act } = useGame();
  const run = save.run!;
  const r = run.result!;
  const [busy, setBusy] = useState(false);
  const title = r.outcome === 'victory' ? 'Expedition geschafft!' : r.outcome === 'defeat' ? 'Niederlage' : 'Expedition abgebrochen';
  return (
    <div className="screen result-screen">
      <div className="row gap center-v">
        <HeroArt id="fritz" size={60} mood={r.outcome === 'victory' ? 'happy' : 'serious'} />
        <HeroArt id="sera" size={60} mood={r.outcome === 'victory' ? 'happy' : 'sad'} />
        <HeroArt id="ivo" size={60} mood={r.outcome === 'victory' ? 'happy' : 'serious'} />
        {run.yuumiEverInRun && <YuumiArt size={40} pose={r.outcome === 'victory' ? 'happy' : 'sit'} />}
        <h2>{title}</h2>
      </div>
      <div className="grid-2">
        <section className="panel">
          <h3>✦ Erinnerungslicht: +{r.lightEarned}</h3>
          {r.lightBreakdown.length === 0 ? (
            <p className="small muted">Kein Erinnerungslicht – es gibt Licht nur für gewonnene Kämpfe.</p>
          ) : (
            <ul className="plain small">
              {r.lightBreakdown.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          )}
          <p className="small">Gesamt: ✦ {save.meta.light}</p>
          {r.newlyAffordable.length > 0 && (
            <>
              <h3>Jetzt prägbar</h3>
              <div className="preview-row">
                {r.newlyAffordable.map((s) => (
                  <span key={s} className="chip" title={SEALS[s].description}>
                    {TAG_SYMBOL[SEALS[s].branch]} {SEALS[s].name} · ✦ {SEALS[s].cost}
                  </span>
                ))}
              </div>
            </>
          )}
          {r.unlocked.length > 0 && (
            <>
              <h3>Freigeschaltet</h3>
              <ul className="plain small">
                {r.unlocked.map((u, i) => (
                  <li key={i}>🔓 {u}</li>
                ))}
              </ul>
            </>
          )}
        </section>
        <section className="panel">
          {r.analysis.length > 0 && (
            <>
              <h3>{r.outcome === 'defeat' ? 'Warum es gescheitert ist' : 'Hinweis'}</h3>
              <ol className="small analysis">
                {r.analysis.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
            </>
          )}
          <h3>Höhepunkte</h3>
          <ul className="plain small">
            {r.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
          <h3>Nächstes Mal ausprobieren</h3>
          <ul className="plain small">
            {r.suggestions.map((h, i) => (
              <li key={i}>💡 {h}</li>
            ))}
          </ul>
        </section>
      </div>
      <button
        className="btn primary big"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          act(A.closeResult);
        }}
        autoFocus
      >
        Zurück zur Laternenstube
      </button>
    </div>
  );
}
