// Charakterbau-Oberfläche: Ausprägungen wählen und Talentpunkte verteilen.
import { ARCHETYPES, ARCHETYPES_BY_HERO, ATTRS, ATTR_IDS, type ArchetypeId, type AttrId } from '../content/builds';
import { HEROES } from '../content/heroes';
import type { HeroId } from '../content/types';
import { HERO_IDS } from '../content/types';
import * as A from '../game/actions';
import { heroStats } from '../game/derive';
import type { RunState } from '../game/types';
import { HeroArt } from './art';
import { play } from './audio';
import { Modal } from './components';
import { useGame } from './store';

const pct = (x: number) => `${Math.round(x * 100)} %`;
const num = (x: number) => x.toFixed(1).replace('.', ',');

/** Kurze Werteänderungen einer Ausprägung als Chips (+/−). */
function ArchDeltas({ id }: { id: ArchetypeId }) {
  const a = ARCHETYPES[id];
  const chips: { t: string; good: boolean }[] = [];
  const d = (v: number, label: string, invert = false) => {
    if (Math.abs(v - 1) < 0.001) return;
    const up = v > 1;
    chips.push({ t: `${label} ${up ? '+' : '−'}${Math.round(Math.abs(v - 1) * 100)} %`, good: invert ? !up : up });
  };
  d(a.hpMult, '❤');
  d(a.atkMult, '⚔');
  d(a.intervalMult, '⏱', true);
  if (!chips.length) return <span className="arch-chip neutral">Ausgewogen</span>;
  return (
    <>
      {chips.map((c) => (
        <span key={c.t} className={`arch-chip ${c.good ? 'up' : 'down'}`}>
          {c.t.replace('⏱ −', '⏱ schneller ').replace('⏱ +', '⏱ langsamer ')}
        </span>
      ))}
    </>
  );
}

export function PointOrbs({ n, big }: { n: number; big?: boolean }) {
  return (
    <span className={`point-orbs ${big ? 'big' : ''}`} aria-label={`${n} Talentpunkte`}>
      {Array.from({ length: Math.min(n, 12) }, (_, i) => (
        <span key={i} className="orb" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
      <b>{n}</b>
    </span>
  );
}

function StatLine({ run, hero }: { run: RunState; hero: HeroId }) {
  const st = heroStats(run, hero);
  return (
    <div className="stat-line">
      <span title="Lebenspunkte">❤ {st.maxHp}</span>
      <span title="Schaden je Grundangriff">⚔ {Math.round(st.atk)}</span>
      <span title="Sekunden zwischen Grundangriffen">⏱ {num(st.interval)} s</span>
      {st.armor > 0 && <span title="weniger erlittener Schaden">🛡 {pct(st.armor)}</span>}
      {st.dodge > 0 && <span title="Ausweichchance gegen Grundangriffe">💨 {pct(st.dodge)}</span>}
    </div>
  );
}

/** Zeilen zum Verteilen der Talentpunkte eines Helden. */
export function AttrRows({ hero, allowMinus }: { hero: HeroId; allowMinus: boolean }) {
  const { save, act } = useGame();
  const run = save.run!;
  const color = HEROES[hero].color;
  return (
    <div className="attr-rows">
      {ATTR_IDS.map((id: AttrId) => {
        const def = ATTRS[id];
        const v = run.attrs[hero][id];
        const canAdd = run.attrPoints > 0 && v < def.max;
        return (
          <div key={id} className={`attr-row ${v > 0 ? 'has' : ''}`} title={def.text(1) + ' je Punkt'}>
            <span className="attr-icon">{def.icon}</span>
            <span className="attr-name">
              {def.name}
              <span className="attr-eff">{v > 0 ? def.text(v) : def.text(1) + ' je Punkt'}</span>
            </span>
            <span className="attr-pips">
              {Array.from({ length: def.max }, (_, i) => (
                <span key={i} className={`attr-pip ${i < v ? 'on' : ''}`} style={i < v ? { background: color, boxShadow: `0 0 6px ${color}` } : undefined} />
              ))}
            </span>
            {allowMinus && (
              <button
                className="btn tiny ghost"
                data-sfx="none"
                disabled={v <= 0}
                aria-label={`${def.name} verringern`}
                onClick={() => {
                  play('unpoint');
                  act((s) => A.allocAttr(s, hero, id, -1));
                }}
              >
                −
              </button>
            )}
            <button
              className="btn tiny plus"
              data-sfx="none"
              disabled={!canAdd}
              aria-label={`${def.name} erhöhen`}
              onClick={() => {
                play('point');
                act((s) => A.allocAttr(s, hero, id, 1));
              }}
            >
              +
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** Vorbereitung vor dem Aufbruch: Ausprägung je Held + Talentpunkte. */
export function PrepareScreen() {
  const { save, act } = useGame();
  const run = save.run!;
  return (
    <div className="screen prepare">
      <div className="prepare-head">
        <div>
          <h2>Vor dem Aufbruch</h2>
          <p className="small muted">Wähle für jede Figur eine Ausprägung und verteile Talentpunkte. Jeder Levelaufstieg bringt 2 weitere.</p>
        </div>
        <div className="prepare-points">
          <span className="small muted">Talentpunkte</span>
          <PointOrbs n={run.attrPoints} big />
        </div>
      </div>
      <div className="prepare-grid">
        {HERO_IDS.map((h) => {
          const arch = ARCHETYPES[run.archetype[h]];
          return (
            <section key={h} className="prepare-hero" style={{ ['--arch' as string]: arch.color }}>
              <div className="prepare-portrait">
                <div className="portrait-glow" />
                <HeroArt id={h} arch={arch.id} size={118} mood="normal" />
                <div>
                  <h3>{HEROES[h].name}</h3>
                  <div className="arch-title">{arch.name}</div>
                  <StatLine run={run} hero={h} />
                </div>
              </div>
              <div className="arch-options" role="radiogroup" aria-label={`Ausprägung ${HEROES[h].name}`}>
                {ARCHETYPES_BY_HERO[h].map((id) => {
                  const a = ARCHETYPES[id];
                  const on = run.archetype[h] === id;
                  return (
                    <button
                      key={id}
                      role="radio"
                      aria-checked={on}
                      className={`arch-card ${on ? 'on' : ''}`}
                      style={{ ['--arch' as string]: a.color }}
                      data-sfx="confirm"
                      onClick={() => act((s) => A.setArchetype(s, h, id))}
                    >
                      <span className="arch-mini">
                        <HeroArt id={h} arch={id} size={40} />
                      </span>
                      <span className="arch-body">
                        <b>{a.name}</b>
                        <span className="arch-tag">{a.tagline}</span>
                        <span className="arch-chips">
                          <ArchDeltas id={id} />
                        </span>
                        <span className="arch-skill">
                          <span className="k">Auto</span> {a.auto}
                        </span>
                        <span className="arch-skill">
                          <span className="k">{a.ability.name}</span> {a.ability.text} · {a.ability.cost} Fokus
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <AttrRows hero={h} allowMinus />
            </section>
          );
        })}
      </div>
      <div className="prepare-foot">
        {run.seals.length > 0 && <span className="small muted">Aktive Siegel: +{run.seals.length} Talentpunkte eingerechnet.</span>}
        {run.attrPoints > 0 && <span className="small warn-text">Noch {run.attrPoints} Punkte frei – du kannst sie auch später auf der Karte vergeben.</span>}
        <button className="btn primary big" data-sfx="transition" onClick={() => act(A.confirmPrepare)}>
          Aufbrechen ➜
        </button>
      </div>
    </div>
  );
}

/** Talentpunkte während des Runs vergeben (Karte, Levelaufstieg). */
export function TalentModal({ onClose }: { onClose: () => void }) {
  const { save } = useGame();
  const run = save.run!;
  return (
    <Modal title="Talentpunkte verteilen" onClose={onClose} wide>
      <div className="row center-v gap">
        <PointOrbs n={run.attrPoints} big />
        <span className="small muted">Vergebene Punkte sind bis zum Ende des Runs fest.</span>
      </div>
      <div className="talent-grid">
        {HERO_IDS.map((h) => (
          <div key={h} className="talent-col" style={{ ['--arch' as string]: ARCHETYPES[run.archetype[h]].color }}>
            <div className="row center-v gap">
              <HeroArt id={h} arch={run.archetype[h]} size={46} />
              <div>
                <b>{HEROES[h].name}</b>
                <div className="small muted">{ARCHETYPES[run.archetype[h]].name}</div>
                <StatLine run={run} hero={h} />
              </div>
            </div>
            <AttrRows hero={h} allowMinus={false} />
          </div>
        ))}
      </div>
      <div className="row end">
        <button className="btn primary" onClick={onClose}>
          Fertig
        </button>
      </div>
    </Modal>
  );
}
