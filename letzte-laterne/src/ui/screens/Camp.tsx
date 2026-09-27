import { useState } from 'react';
import { CAMP } from '../../content/balance';
import { CAMP_BANTER, SPEAKER_NAME } from '../../content/story';
import { HERO_IDS } from '../../content/types';
import * as A from '../../game/actions';
import { heroStats } from '../../game/derive';
import { rngFor } from '../../sim/rng';
import { lineVisible, Speaker } from '../Dialog';
import { useGame } from '../store';
import { HeroArt, YuumiArt } from '../art';
import { yuumiPresent } from '../../game/derive';
import { VoiceButton, useSequentialSpeech } from '../voice';

function Campfire() {
  const { save } = useGame();
  return (
    <div className="campfire-scene">
      <HeroArt id="fritz" size={70} />
      <HeroArt id="sera" size={70} mood="happy" />
      <svg className="campfire" width="120" height="110" viewBox="0 0 120 110" aria-hidden>
        <ellipse cx="60" cy="98" rx="56" ry="10" fill="#ff8a2a33" />
        <path d="M22 96 L98 84" stroke="#5a3418" strokeWidth="9" strokeLinecap="round" />
        <path d="M24 84 L96 96" stroke="#6a4020" strokeWidth="9" strokeLinecap="round" />
        <path className="flame f1" d="M60 90 Q34 70 48 44 Q52 58 60 50 Q58 30 72 18 Q70 44 84 60 Q90 80 60 90 Z" fill="#ff7a1a" />
        <path className="flame f2" d="M60 90 Q44 76 52 58 Q56 66 62 60 Q62 46 70 38 Q70 58 78 68 Q80 84 60 90 Z" fill="#ffc04a" />
        <path className="flame f3" d="M60 90 Q52 80 56 70 Q60 74 64 68 Q70 78 66 86 Q64 90 60 90 Z" fill="#fff3c0" />
      </svg>
      <HeroArt id="ivo" size={70} />
      {yuumiPresent(save.run) && <YuumiArt size={48} />}
    </div>
  );
}

export function CampScreen() {
  const { save, act } = useGame();
  const run = save.run!;
  const [busy, setBusy] = useState(false);
  const pct = run.mods.includes('meagerCamp') ? CAMP.meagerHealPct : CAMP.healPct;
  const banter = CAMP_BANTER[rngFor(run.seed, 'camp').int(CAMP_BANTER.length)].filter((l) => lineVisible(l, save));
  const speakingIdx = useSequentialSpeech(banter, `camp:${run.seed}`);
  return (
    <div className="screen camp-screen">
      <h2>Lager</h2>
      <Campfire />
      <div className="event-lines">
        {banter.map((l, i) => (
          <div key={i} className={`event-line ${i === speakingIdx ? 'speaking-line' : ''}`}>
            <div className="event-portrait">
              <Speaker line={l} size={48} />
            </div>
            <div>
              <b>{SPEAKER_NAME[l.speaker]}: </b>
              {l.text} <VoiceButton line={l} />
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
          <div className="small">🎁 1 aus 3 · mind. Magisch · 6 % Legendär</div>
        </button>
      </div>
    </div>
  );
}
