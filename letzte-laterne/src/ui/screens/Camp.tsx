import { useState } from 'react';
import { CAMP } from '../../content/balance';
import { CAMP_BANTER, SPEAKER_NAME } from '../../content/story';
import { HERO_IDS } from '../../content/types';
import * as A from '../../game/actions';
import { heroStats } from '../../game/derive';
import { rngFor } from '../../sim/rng';
import { lineVisible, Speaker } from '../Dialog';
import { useGame } from '../store';

export function CampScreen() {
  const { save, act } = useGame();
  const run = save.run!;
  const [busy, setBusy] = useState(false);
  const pct = run.mods.includes('meagerCamp') ? CAMP.meagerHealPct : CAMP.healPct;
  const banter = CAMP_BANTER[rngFor(run.seed, 'camp').int(CAMP_BANTER.length)].filter((l) => lineVisible(l, save));
  return (
    <div className="screen camp-screen">
      <h2>🔥 Lager</h2>
      <div className="event-lines">
        {banter.map((l, i) => (
          <div key={i} className="event-line">
            <div className="event-portrait">
              <Speaker line={l} size={48} />
            </div>
            <div>
              <b>{SPEAKER_NAME[l.speaker]}: </b>
              {l.text}
            </div>
          </div>
        ))}
      </div>
      <div className="event-choices">
        <button
          className="choice-card"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            act((s) => A.campChoice(s, 'heal'));
          }}
        >
          <b>Gruppenheilung</b>
          <div className="small">
            Alle heilen {Math.round(pct * 100)} % ihrer max. HP (
            {HERO_IDS.map((h) => `+${Math.min(heroStats(run, h).maxHp - run.hp[h], Math.round(heroStats(run, h).maxHp * pct))}`).join(' / ')}).
          </div>
        </button>
        <button
          className="choice-card"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            act((s) => A.campChoice(s, 'loot'));
          }}
        >
          <b>Ausrüstung suchen</b>
          <div className="small">Wähle 1 aus 3 Gegenständen – mindestens selten, 15 % legendär je Option. Keine Heilung.</div>
        </button>
      </div>
    </div>
  );
}
