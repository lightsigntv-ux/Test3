import { HEROES } from '../content/heroes';
import { ITEMS, RELICS, TAG_LABEL, TAG_SYMBOL } from '../content/items';
import { SEALS, UPGRADES } from '../content/progression';
import type { BuildTag, HeroId } from '../content/types';
import { HERO_IDS } from '../content/types';
import * as A from '../game/actions';
import { abilityLines, autoLine, itemBearerNote } from '../game/describe';
import { heroStats, tagCounts, yuumiPresent } from '../game/derive';
import { RELIC_VALUES } from '../content/items';
import { HeroArt, PawIcon, YuumiArt } from './art';
import { Bar, ItemLine, Modal, RelicLine } from './components';
import { useGame } from './store';

export function BuildOverview({ onClose }: { onClose: () => void }) {
  const { save, act } = useGame();
  const run = save.run!;
  const editable = A.canEditEquipment(run);
  const tags = tagCounts(run);
  return (
    <Modal title="Build-Übersicht" onClose={onClose} wide>
      <div className="row gap wrap small">
        {(['glut', 'bastion', 'echo'] as BuildTag[]).map((t) => (
          <span key={t} className={`tag tag-${t}`}>
            {TAG_SYMBOL[t]} {TAG_LABEL[t]}: {tags[t]}
          </span>
        ))}
        <span className="muted">Seed {run.seed} · Aufstellung: {run.formation.map((h) => HEROES[h].name).join(' (vorn), ')} </span>
      </div>
      {!editable && <p className="small warn-text">Ausrüstung und Relikte können nur außerhalb laufender Kämpfe gewechselt werden.</p>}
      <div className="build-heroes">
        {HERO_IDS.map((h) => (
          <HeroBuild key={h} h={h} editable={editable} />
        ))}
      </div>
      <div className="grid-2">
        <div className="panel">
          <h3>Gruppenrelikte (2 Plätze)</h3>
          {run.relics.map((r, i) => (
            <div key={i} className="row between center-v slot-row">
              {r ? <RelicLine id={r} /> : <span className="muted">– leerer Reliktplatz –</span>}
              {r && editable && (
                <button
                  className="btn small ghost"
                  onClick={() => {
                    if (confirm(`${RELICS[r].name} ablegen? Es geht verloren${r === 'mondgloeckchen' ? ' – und Yuumi verabschiedet sich für diesen Run.' : '.'}`))
                      act((s) => A.discardRelic(s, i));
                  }}
                >
                  Ablegen
                </button>
              )}
            </div>
          ))}
          <div className="yuumi-status">
            {yuumiPresent(run) ? (
              <div className="row gap center-v">
                <YuumiArt size={44} />
                <div className="small">
                  <b>Yuumi</b> kämpft mit: Pfotenhieb {RELIC_VALUES.pawDamage} Schaden alle {RELIC_VALUES.pawInterval} s; jeder 3. Treffer{' '}
                  <PawIcon filled />
                  <PawIcon filled />
                  <PawIcon filled /> = Schnurrschutz {Math.round(RELIC_VALUES.purrShield * (run.relics.includes('wappen') ? 1 + RELIC_VALUES.wappenMult : 1))} Schild
                  {run.upgrades.includes('standhaft') ? ' (auf Fritz +40 %)' : ''}.
                </div>
              </div>
            ) : (
              <span className="small muted">Keine Begleiterin. Yuumi kämpft nur mit, solange ihr Mondglöckchen ausgerüstet ist.</span>
            )}
          </div>
        </div>
        <div className="panel">
          <h3>Verbesserungen (Run-Level {run.level})</h3>
          {run.upgrades.length === 0 && <p className="small muted">Noch keine – beim Levelaufstieg wählst du eine von drei.</p>}
          <ul className="plain small">
            {run.upgrades.map((u) => (
              <li key={u}>
                <b>{UPGRADES[u].name}</b> ({HEROES[UPGRADES[u].hero].name}) {UPGRADES[u].tags.map((t) => TAG_SYMBOL[t]).join('')} – {UPGRADES[u].description}
              </li>
            ))}
          </ul>
          <h3>Aktive Siegel</h3>
          <ul className="plain small">
            {run.seals.length === 0 && <li className="muted">keine</li>}
            {run.seals.map((s) => (
              <li key={s}>
                {TAG_SYMBOL[SEALS[s].branch]} <b>{SEALS[s].name}</b> – {SEALS[s].description}
              </li>
            ))}
          </ul>
          {(run.nextFocusBonus !== 0 || run.runFocusBonus !== 0) && (
            <p className="small">
              Fokus zu Beginn des nächsten Kampfes: {run.nextFocusBonus + run.runFocusBonus >= 0 ? '+' : ''}
              {run.nextFocusBonus + run.runFocusBonus}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

function HeroBuild({ h, editable }: { h: HeroId; editable: boolean }) {
  const { save, act } = useGame();
  const run = save.run!;
  const st = heroStats(run, h);
  const def = HEROES[h];
  const others = HERO_IDS.flatMap((o) => [0, 1].map((i) => ({ hero: o, idx: i }))).filter((x) => x.hero !== h);
  return (
    <div className="panel hero-build" style={{ borderColor: def.color }}>
      <div className="row gap">
        <HeroArt id={h} size={60} />
        <div className="grow">
          <b style={{ color: def.color }}>
            {def.symbol} {def.name}
          </b>{' '}
          <span className="small muted">
            {def.role}
            {run.formation[0] === h ? ' · vorn' : ' · hinten'}
          </span>
          <Bar value={run.hp[h]} max={st.maxHp} label />
          <div className="small">{autoLine(run, h)}</div>
        </div>
      </div>
      <div className="small ability-desc">
        <b>{def.ability.name}</b>
        {abilityLines(run, h).map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <div className="small">Ausrüstung:</div>
      {run.equipment[h].map((it, i) => (
        <div key={i} className="slot-row">
          {it ? <ItemLine id={it} /> : <span className="muted small">– leer –</span>}
          {it && itemBearerNote(it, h, run) && <div className="small warn-text">{itemBearerNote(it, h, run)}</div>}
          {it && editable && (
            <div className="row gap-s">
              <select
                className="small"
                value=""
                onChange={(e) => {
                  const [oh, oi] = e.target.value.split(':');
                  act((s) => A.moveItem(s, { type: 'hero', hero: h, idx: i }, { type: 'hero', hero: oh as HeroId, idx: Number(oi) }));
                }}
              >
                <option value="">Verschieben/tauschen …</option>
                {others.map((o) => {
                  const cur = run.equipment[o.hero][o.idx];
                  return (
                    <option key={`${o.hero}:${o.idx}`} value={`${o.hero}:${o.idx}`}>
                      → {HEROES[o.hero].name} Platz {o.idx + 1} {cur ? `(tauscht mit ${ITEMS[cur].name})` : '(leer)'}
                    </option>
                  );
                })}
              </select>
              <button
                className="btn small ghost"
                onClick={() => {
                  if (confirm(`${ITEMS[it].name} ablegen? Der Gegenstand geht verloren.`)) act((s) => A.discardItem(s, { type: 'hero', hero: h, idx: i }));
                }}
              >
                Ablegen
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
