import { useState } from 'react';
import * as A from '../../game/actions';
import { yuumiPresent } from '../../game/derive';
import { HeroArt, LanternIcon, YuumiArt } from '../art';
import { useGame } from '../store';

export function EndingScreen() {
  const { save, act } = useGame();
  const [busy, setBusy] = useState(false);
  if (save.dialogQueue.length) return <div className="screen" />;
  return (
    <div className="screen ending-screen">
      <LanternIcon size={50} />
      <h2>Die letzte Flamme</h2>
      <div className="title-party">
        <HeroArt id="fritz" size={80} />
        <HeroArt id="sera" size={80} mood="sad" />
        <HeroArt id="ivo" size={80} />
        {yuumiPresent(save.run) && <YuumiArt size={46} />}
      </div>
      <p>Die Laterne zittert in Seras Händen. Was soll mit ihr geschehen? Diese Entscheidung beendet die Geschichte.</p>
      <div className="event-choices">
        <button
          className="choice-card"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            act((s) => A.chooseEnding(s, 'keep'));
          }}
        >
          <b>Die Laterne bewahren</b>
          <div className="small">Sie brennt weiter – aber nimmt nur noch, was freiwillig gegeben wird. Die Stadt erinnert sich langsam wieder.</div>
        </button>
        <button
          className="choice-card"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            act((s) => A.chooseEnding(s, 'extinguish'));
          }}
        >
          <b>Die Laterne löschen</b>
          <div className="small">Der Nebel weicht, der Morgen kommt. Keine Wiederkehr mehr – Vesper erhält seine ungewisse Zukunft zurück.</div>
        </button>
      </div>
    </div>
  );
}
