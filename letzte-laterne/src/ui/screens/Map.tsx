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

export interface Preview {
  title: string;
  danger: number; // 0 = kein Kampf, 1..5
  chips: string[];
  detail: string; // ausführlich (Tooltip)
  extra?: string;
}

export function stationPreview(run: RunState, st: Station, route?: 'fight' | 'event', meta?: { firstEliteLegendaryGiven: boolean }): Preview {
  const n = (e?: unknown[]) => `${e?.length ?? 0} Gegner`;
  const loot = '🎁 1 aus 3';
  switch (st.type) {
    case 'fight':
      return { title: 'Kampf', danger: 1, chips: [n(st.encounter), loot, '✦ +1', '+10 EP'], detail: `Beute: Wahl 1 aus 3 oder ${Math.round(REWARD.healAlternativePct * 100)} % Heilung.` };
    case 'choice':
      if (route === 'event') {
        const ev = EVENTS[st.alt!.event];
        return { title: st.alt!.event === 'miauen' ? 'Ereignis 🐈' : 'Ereignis', danger: 0, chips: ['Kein Kampf', 'Heilung, Beute oder Risiko', '+5 EP'], detail: 'Folgen werden vor der Wahl angezeigt.', extra: ev.mapHint };
      }
      return { title: 'Kampf', danger: 2, chips: [n(st.alt!.encounter), loot, '✦ +1', '+10 EP'], detail: 'Etwas stärkere Gruppe.' };
    case 'story':
      return { title: EVENTS[STORY_EVENT_BY_EXPEDITION[run.expedition]].title, danger: 0, chips: ['Storyentscheidung', '+5 EP'], detail: 'Die Wahl wirkt bis in spätere Kapitel.' };
    case 'elite':
      return {
        title: 'Elitekampf',
        danger: 4,
        chips: [n(st.encounter), '🎁 mind. Selten', `${Math.round(REWARD.eliteRelicChance * 100)} % Relikt`, ...(meta && !meta.firstEliteLegendaryGiven ? ['★ Legendär garantiert'] : []), '✦ +2'],
        detail: 'Starke angekündigte Angriffe.',
      };
    case 'camp':
      return { title: 'Lager', danger: 0, chips: [`✚ ${run.mods.includes('meagerCamp') ? 20 : 40} % Heilung`, 'oder 🎁 Ausrüstung'], detail: 'Sicher.' };
    case 'hardFight':
      return { title: 'Schwerer Kampf', danger: 3, chips: [n(st.encounter), loot, '✦ +1', '+15 EP'], detail: '' };
    case 'boss': {
      const boss = ENEMIES[EXPEDITIONS[run.expedition].boss];
      return { title: boss.name, danger: 5, chips: ['2 Phasen', '✦ +4 (Erstsieg +3)', 'Story'], detail: boss.description };
    }
  }
}

function Danger({ n }: { n: number }) {
  if (n === 0) return <span className="danger none">sicher</span>;
  return (
    <span className="danger" title={`Gefahr ${n} von 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < n ? 'on' : ''} />
      ))}
    </span>
  );
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
        data-sfx="step"
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
          <div className="preview-row">
            <Danger n={p.danger} />
            {p.chips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          {p.detail && <p className="small muted">{p.detail}</p>}
          {cur.type === 'choice' ? (
            <div className="row gap">
              <button className="btn primary" data-sfx="step" onClick={() => act((s) => A.enterStation(s, 'fight'))}>
                ⚔ Kampf wählen
              </button>
              <button className="btn primary" data-sfx="step" onClick={() => act((s) => A.enterStation(s, 'event'))}>
                {cur.alt!.event === 'miauen' ? '🐈 Dem Miauen folgen' : '❔ Ereignis wählen'}
              </button>
            </div>
          ) : (
            <button className="btn primary big" data-sfx="step" onClick={() => act((s) => A.enterStation(s))} autoFocus>
              {cur.type === 'boss' ? '👑 Dem Boss entgegentreten' : `Weiter: ${NAME[cur.type]}`}
            </button>
          )}
          {cur.type === 'choice' && cur.alt!.catGuaranteed && <p className="small cat-hint">🐈 Aus dem Nebel dringt ein leises Miauen …</p>}
        </div>
      </section>
      <aside className="party-side">
        <h3 title="Normale Nahkampfangriffe treffen die vordere Figur.">Gruppe</h3>
        <Formation />
        <h3>Ausrüstung</h3>
        {run.formation.map((h) => (
          <div key={h} className="small">
            <b style={{ color: HEROES[h].color }}>{HEROES[h].name}:</b>{' '}
            {run.equipment[h].filter(Boolean).length === 0 ? <span className="muted">–</span> : run.equipment[h].map((it, i) => (it ? <ItemLine key={i} item={it} compact /> : null))}
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
