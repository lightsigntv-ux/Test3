import { useState } from 'react';
import { HEROES } from '../../content/heroes';
import { UPGRADES } from '../../content/progression';
import * as A from '../../game/actions';
import { HeroArt } from '../art';
import { Tags } from '../components';
import { useGame } from '../store';

export function LevelUpScreen() {
  const { save, act } = useGame();
  const run = save.run!;
  const [busy, setBusy] = useState(false);
  return (
    <div className="screen">
      <h2>Run-Level {run.level} erreicht!</h2>
      <p className="small muted">
        Alle Helden werden stärker (+8 % Lebenspunkte, Schaden und Heilung je Level). Wähle zusätzlich eine Verbesserung – sie gilt bis zum Ende dieses Runs.
        {run.pendingLevelUps > 1 ? ` (Noch ${run.pendingLevelUps - 1} weitere Wahl danach.)` : ''}
      </p>
      <div className="reward-row">
        {run.levelOffer!.map((u) => {
          const d = UPGRADES[u];
          return (
            <button
              key={u}
              className="reward-card"
              disabled={busy}
              style={{ borderColor: HEROES[d.hero].color }}
              onClick={() => {
                setBusy(true);
                act((s) => A.chooseUpgrade(s, u));
              }}
            >
              <HeroArt id={d.hero} size={56} />
              <div className="small muted">{HEROES[d.hero].name}</div>
              <h3>{d.name}</h3>
              <Tags tags={d.tags} />
              <p className="small">{d.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
