import { useState } from 'react';
import { REWARD } from '../../content/balance';
import { ENEMIES } from '../../content/enemies';
import { HEROES } from '../../content/heroes';
import { EVENTS, EXPEDITIONS, STORY_EVENT_BY_EXPEDITION } from '../../content/story';
import type { HeroId, StationType } from '../../content/types';
import * as A from '../../game/actions';
import { heroStats, yuumiPresent } from '../../game/derive';
import type { RunState, Station } from '../../game/types';
import { HeroArt, YuumiArt } from '../art';
import { Bar, ItemLine, RelicLine } from '../components';
import { useGame } from '../store';

const ICON: Record<StationType, string> = { fight: '⚔', choice: '⑂', story: '📖', elite: '💀', camp: '🔥', hardFight: '⚔⚔', boss: '👑' };
const NAME: Record<StationType, string> = {
  fight: 'Kampf',
  choice: 'Weggabelung',
  story: 'Storyereignis',
  elite: 'Elitekampf',
  camp: 'Lager',
  hardFight: 'Schwerer Kampf',
  boss: 'Gebietsboss',
};

export function stationPreview(run: RunState, st: Station, route?: 'fight' | 'event', meta?: { firstEliteLegendaryGiven: boolean }): { title: string; risk: string; reward: string; extra?: string } {
  const pct = (x: number) => `${Math.round(x * 100)} %`;
  const count = (n: number) => `${n} Gegner`;
  switch (st.type) {
    case 'fight':
      return { title: 'Normaler Kampf', risk: `Gering · ${count(st.encounter!.length)}`, reward: `Wahl 1 aus 3 Gegenständen oder ${pct(REWARD.healAlternativePct)} Gruppenheilung · +1 ✦ · +10 EP` };
    case 'choice':
      if (route === 'event') {
        const ev = EVENTS[st.alt!.event];
        return {
          title: `Ereignis${st.alt!.event === 'miauen' ? ' 🐈' : ''}`,
          risk: 'Kein Kampf. Manche Entscheidungen kosten Lebenspunkte – die Folgen werden vorher angezeigt.',
          reward: 'Meist Heilung, Beute, Relikte oder Erfahrung · +5 EP',
          extra: ev.mapHint,
        };
      }
      return { title: 'Kampf', risk: `Mittel · ${count(st.alt!.encounter.length)}`, reward: 'Wahl 1 aus 3 Gegenständen oder Heilung · +1 ✦ · +10 EP' };
    case 'story':
      return { title: EVENTS[STORY_EVENT_BY_EXPEDITION[run.expedition]].title, risk: 'Kein Kampf. Eine Entscheidung mit spürbaren Folgen – auch für spätere Kapitel.', reward: 'Heilung, Beute oder Storyvorteile · +5 EP' };
    case 'elite':
      return {
        title: 'Elitekampf',
        risk: `Hoch · ${count(st.encounter!.length)} (inkl. Elitegegner mit starken angekündigten Angriffen)`,
        reward: `Mind. eine seltene Option, ${pct(REWARD.eliteRelicChance)} Chance auf ein Relikt${meta && !meta.firstEliteLegendaryGiven ? ' · Erster Elite-Sieg: legendäre Option garantiert!' : ''} · +2 ✦ · +20 EP`,
      };
    case 'camp':
      return { title: 'Lager', risk: 'Sicher.', reward: `Gruppenheilung (${run.mods.includes('meagerCamp') ? '20' : '40'} % max. HP) ODER zusätzliche Ausrüstung (mind. selten)` };
    case 'hardFight':
      return { title: 'Anspruchsvoller Kampf', risk: `Hoch · ${count(st.encounter!.length)}`, reward: 'Wahl 1 aus 3 Gegenständen oder Heilung · +1 ✦ · +15 EP' };
    case 'boss': {
      const boss = ENEMIES[EXPEDITIONS[run.expedition].boss];
      return { title: boss.name, risk: 'Sehr hoch · zwei Phasen, angekündigte Spezialangriffe', reward: 'Dauerhaft: +4 ✦ (erster Sieg +3), Storyfortschritt, neue Expedition' };
    }
  }
}

export function MapScreen({ onBuild }: { onBuild: () => void }) {
  const { save, act } = useGame();
  const run = save.run!;
  const [hover, setHover] = useState<{ st: Station; route?: 'fight' | 'event' } | null>(null);
  const cur = run.stations[run.station];
  const preview = hover ?? { st: cur, route: undefined };
  const p = stationPreview(run, preview.st, preview.route, save.meta);

  const node = (st: Station, route?: 'fight' | 'event') => {
    const state = st.index < run.station ? 'visited' : st.index === run.station ? 'current' : 'future';
    const chosen = st.type === 'choice' && run.route[st.index] === route;
    const cat = route === 'event' && st.alt?.event === 'miauen';
    const icon = st.type === 'choice' ? (route === 'fight' ? '⚔' : cat ? '🐈' : '❔') : ICON[st.type];
    const label = st.type === 'choice' ? (route === 'fight' ? 'Kampf' : cat ? 'Miauen?' : 'Ereignis') : NAME[st.type];
    const clickable = state === 'current';
    return (
      <button
        key={`${st.index}-${route ?? ''}`}
        className={`map-node ${state} ${chosen ? 'chosen' : ''} type-${st.type} ${cat ? 'cat' : ''}`}
        disabled={!clickable}
        onMouseEnter={() => setHover({ st, route })}
        onMouseLeave={() => setHover(null)}
        onFocus={() => setHover({ st, route })}
        onClick={() => act((s) => A.enterStation(s, route))}
        aria-label={`Station ${st.index + 1}: ${label}${state === 'visited' ? ' (besucht)' : state === 'current' ? ' (jetzt erreichbar)' : ''}`}
      >
        <span className="node-icon">{state === 'visited' && !(st.type === 'choice' && !chosen) ? '✓' : icon}</span>
        <span className="node-label">{label}</span>
      </button>
    );
  };

  return (
    <div className="map-screen">
      <section className="map-wrap">
        <div className="map-legend small">
          <span>
            <i className="dot visited" /> besucht
          </span>
          <span>
            <i className="dot current" /> jetzt erreichbar
          </span>
          <span>
            <i className="dot future" /> später
          </span>
        </div>
        <div className="map-path">
          {run.stations.map((st) => (
            <div key={st.index} className="map-col">
              <div className="map-num">{st.index + 1}</div>
              {st.type === 'choice' ? (
                <div className="map-split">
                  {node(st, 'fight')}
                  {node(st, 'event')}
                </div>
              ) : (
                node(st)
              )}
            </div>
          ))}
        </div>
        <div className="panel preview">
          <div className="row between">
            <h3>
              Station {preview.st.index + 1}: {p.title}
            </h3>
            {preview.st.index === run.station && <span className="pill glow-pill">jetzt erreichbar</span>}
          </div>
          {p.extra && <p className="flavor">{p.extra}</p>}
          <p>
            <b>Risiko:</b> {p.risk}
          </p>
          <p>
            <b>Mögliche Belohnung:</b> {p.reward}
          </p>
          {cur.type === 'choice' ? (
            <div className="row gap">
              <button className="btn primary" onClick={() => act((s) => A.enterStation(s, 'fight'))}>
                ⚔ Kampf wählen
              </button>
              <button className="btn primary" onClick={() => act((s) => A.enterStation(s, 'event'))}>
                {cur.alt!.event === 'miauen' ? '🐈 Dem Miauen folgen' : '❔ Ereignis wählen'}
              </button>
            </div>
          ) : (
            <button className="btn primary big" onClick={() => act((s) => A.enterStation(s))} autoFocus>
              {cur.type === 'boss' ? '👑 Dem Boss entgegentreten' : `Weiter: ${NAME[cur.type]}`}
            </button>
          )}
          {cur.type === 'choice' && cur.alt!.catGuaranteed && <p className="small cat-hint">🐈 Aus dem Nebel dringt ein leises Miauen …</p>}
        </div>
      </section>
      <aside className="party-side">
        <h3>Gruppe & Aufstellung</h3>
        <p className="small muted">Normale Nahkampfangriffe treffen die vordere Figur. Stelle vor jedem Kampf um.</p>
        <Formation />
        <h3>Ausrüstung</h3>
        {run.formation.map((h) => (
          <div key={h} className="small">
            <b style={{ color: HEROES[h].color }}>{HEROES[h].name}:</b>{' '}
            {run.equipment[h].filter(Boolean).length === 0 ? <span className="muted">–</span> : run.equipment[h].map((it, i) => (it ? <ItemLine key={i} id={it} compact /> : null))}
          </div>
        ))}
        <div className="small">
          <b>Relikte:</b> {run.relics.every((r) => !r) ? <span className="muted">–</span> : run.relics.map((r, i) => (r ? <RelicLine key={i} id={r} /> : null))}
        </div>
        <button className="btn small" onClick={onBuild}>
          Build ansehen / Ausrüstung tauschen
        </button>
      </aside>
    </div>
  );
}

export function Formation({ compact }: { compact?: boolean }) {
  const { save, act } = useGame();
  const run = save.run!;
  const moveFront = (h: HeroId) => {
    const f = run.formation.slice();
    const i = f.indexOf(h);
    [f[0], f[i]] = [f[i], f[0]];
    act((s) => A.setFormation(s, f));
  };
  return (
    <div className={`formation ${compact ? 'compact' : ''}`}>
      {run.formation.map((h, i) => {
        const st = heroStats(run, h);
        return (
          <div key={h} className={`form-slot ${i === 0 ? 'front' : 'back'}`}>
            <div className="small muted">{i === 0 ? 'Vorn' : `Hinten ${i}`}</div>
            <HeroArt id={h} size={compact ? 44 : 56} mood={run.hp[h] <= 0 ? 'down' : 'normal'} />
            <div className="small">
              <b style={{ color: HEROES[h].color }}>{HEROES[h].name}</b>
            </div>
            <Bar value={run.hp[h]} max={st.maxHp} label height={9} />
            {i !== 0 && (
              <button className="btn small" onClick={() => moveFront(h)}>
                ▲ Nach vorn
              </button>
            )}
          </div>
        );
      })}
      {yuumiPresent(run) && (
        <div className="form-slot companion" title="Yuumi belegt keinen Aufstellungsplatz und wird nicht angegriffen.">
          <YuumiArt size={compact ? 34 : 42} />
          <div className="small">
            <b>Yuumi</b> · Begleiterplatz
            <div className="muted">sitzt neben der Gruppe, wird nicht angegriffen</div>
          </div>
        </div>
      )}
    </div>
  );
}
