import { useEffect, useState } from 'react';
import { LEVEL } from '../content/balance';
import { EXPEDITIONS } from '../content/story';
import * as A from '../game/actions';
import { xpForNext, yuumiPresent } from '../game/derive';
import { BuildOverview } from './BuildOverview';
import { CampScreen } from './screens/Camp';
import { CombatScreen } from './screens/Combat';
import { EndingScreen } from './screens/Ending';
import { EventScreen } from './screens/Event';
import { LevelUpScreen } from './screens/LevelUp';
import { MapScreen } from './screens/Map';
import { ResultScreen } from './screens/Result';
import { RewardScreen } from './screens/Reward';
import { ConfirmButton, Modal } from './components';
import { SettingsPanel } from './Settings';
import { useGame } from './store';

export function RunView() {
  const { save, act } = useGame();
  const run = save.run!;
  const [build, setBuild] = useState(false);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (save.dialogQueue.length) return;
      if ((e.key === 'b' || e.key === 'B') && !(e.target instanceof HTMLInputElement)) setBuild((b) => !b);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save.dialogQueue.length]);

  const next = xpForNext(run.level);
  const prevT = run.level > 1 ? LEVEL.thresholds[run.level - 2] : 0;
  const pct = next ? ((run.xp - prevT) / (next - prevT)) * 100 : 100;
  const exp = EXPEDITIONS[run.expedition];
  const inResult = run.phase === 'result' || run.phase === 'ending';

  let screen: React.ReactNode;
  switch (run.phase) {
    case 'map':
      screen = <MapScreen onBuild={() => setBuild(true)} />;
      break;
    case 'combat':
      screen = <CombatScreen key={`${run.combat?.seed}`} onBuild={() => setBuild(true)} />;
      break;
    case 'reward':
      screen = <RewardScreen />;
      break;
    case 'levelup':
      screen = <LevelUpScreen />;
      break;
    case 'event':
      screen = <EventScreen />;
      break;
    case 'camp':
      screen = <CampScreen />;
      break;
    case 'ending':
      screen = <EndingScreen />;
      break;
    case 'result':
      screen = <ResultScreen />;
      break;
  }

  return (
    <div className="run">
      <header className="topbar run-top">
        <div className="row gap center-v wrap">
          <b>{exp.name}</b>
          {run.longNight && <span className="pill night">🌙 Lange Nacht ({run.mods.length})</span>}
          {run.memory && !run.longNight && <span className="pill">Erinnerung</span>}
          {!inResult && <span className="pill">Station {run.station + 1}/8</span>}
          <span className="pill" title={next ? `${run.xp}/${next} Erfahrung bis Level ${run.level + 1}` : 'Höchstes Run-Level erreicht'}>
            Run-Level {run.level}/4
            <span className="xpbar">
              <span style={{ width: `${Math.min(100, pct)}%` }} />
            </span>
          </span>
          {yuumiPresent(run) && <span className="pill yuumi-pill">🔔 Yuumi begleitet euch</span>}
        </div>
        <div className="row gap center-v">
          <span className="light-count" title="In diesem Run verdient (bereits gutgeschrieben)">
            ✦ {save.meta.light} (+{run.lightEarned})
          </span>
          <button className="btn small" onClick={() => setBuild(true)} title="Build-Übersicht (B)">
            Build (B)
          </button>
          <button className="btn small ghost" onClick={() => setSettings(true)}>
            ⚙
          </button>
          {!inResult && (
            <ConfirmButton
              className="btn small ghost"
              label="Aufgeben"
              confirmText="Expedition aufgeben? Bereits verdientes Erinnerungslicht bleibt erhalten; Ausrüstung, Relikte und Run-Level gehen verloren."
              onConfirm={() => act(A.abandonRun)}
            />
          )}
        </div>
      </header>
      <div className="run-body">{screen}</div>
      {build && <BuildOverview onClose={() => setBuild(false)} />}
      {settings && (
        <Modal title="Einstellungen" onClose={() => setSettings(false)} wide>
          <SettingsPanel inRun />
        </Modal>
      )}
    </div>
  );
}
