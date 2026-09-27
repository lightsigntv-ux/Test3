import { useState } from 'react';
import { HEROES } from '../../content/heroes';
import { ITEMS, RELICS } from '../../content/items';
import type { HeroId } from '../../content/types';
import { HERO_IDS } from '../../content/types';
import * as A from '../../game/actions';
import { itemBearerNote } from '../../game/describe';
import { heroStats } from '../../game/derive';
import type { RewardOption } from '../../game/types';
import { HeroArt, YuumiArt } from '../art';
import { play } from '../audio';
import { Rar, Tags } from '../components';
import { useGame } from '../store';

function OptionCard({ o, selected, onClick }: { o: RewardOption; selected: boolean; onClick: () => void }) {
  const d = o.kind === 'item' ? ITEMS[o.id] : RELICS[o.id];
  return (
    <button className={`reward-card rarb-${d.rarity} ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="small muted">{o.kind === 'item' ? 'Ausrüstung (Heldenplatz)' : 'Gruppenrelikt (Reliktplatz)'}</div>
      {o.kind === 'relic' && o.id === 'mondgloeckchen' && <YuumiArt size={56} />}
      <h3>{d.name}</h3>
      <Rar r={d.rarity} />
      <Tags tags={d.tags} />
      <p className="small">{d.description}</p>
      {'flavor' in d && d.flavor && <p className="flavor small">{d.flavor}</p>}
      <p className="small muted">Synergie: {d.synergy}</p>
    </button>
  );
}

export function RewardScreen() {
  const { save, act } = useGame();
  const run = save.run!;
  const offer = run.reward!;
  const [sel, setSel] = useState<number | null>(offer.options.length === 1 ? 0 : null);
  const [slot, setSlot] = useState<A.Slot | null>(null);
  const [busy, setBusy] = useState(false);
  const opt = sel !== null ? offer.options[sel] : null;

  const commit = (fn: () => void) => {
    if (busy) return;
    setBusy(true);
    play('click');
    fn();
  };

  return (
    <div className="screen reward-screen">
      <h2>{offer.title}</h2>
      {offer.note && <p className="note">{offer.note}</p>}
      <p className="small muted">Wähle eine Option und weise sie einem Platz zu. Nicht gewählte Angebote verfallen.</p>
      <div className="reward-row">
        {offer.options.map((o, i) => (
          <OptionCard
            key={i}
            o={o}
            selected={sel === i}
            onClick={() => {
              setSel(i);
              setSlot(null);
            }}
          />
        ))}
      </div>
      {opt && <SlotPicker opt={opt} slot={slot} setSlot={setSlot} />}
      <div className="row gap wrap center-v">
        <button
          className="btn primary big"
          disabled={!opt || !slot || busy}
          onClick={() => commit(() => act((s) => A.chooseReward(s, sel!, slot!)))}
        >
          {opt ? `${opt.kind === 'item' ? ITEMS[opt.id].name : RELICS[opt.id].name} ausrüsten` : 'Option wählen'}
        </button>
        {offer.healAlt > 0 ? (
          <button className="btn" disabled={busy} onClick={() => commit(() => act((s) => A.declineReward(s, true)))}>
            Stattdessen heilen: alle +{Math.round(offer.healAlt * 100)} % max. HP (
            {HERO_IDS.map((h) => `+${Math.min(heroStats(run, h).maxHp - run.hp[h], Math.round(heroStats(run, h).maxHp * offer.healAlt))}`).join(' / ')})
          </button>
        ) : null}
        <button className="btn ghost" disabled={busy} onClick={() => commit(() => act((s) => A.declineReward(s, false)))}>
          {offer.catPenalty ? 'Ablehnen (Yuumi zieht unversehrt weiter)' : 'Nichts nehmen'}
        </button>
      </div>
      <details className="small odds">
        <summary>Wie wird die Beute bestimmt?</summary>
        <p>{offer.oddsText}</p>
        <p>
          Kein Gegenstand erscheint doppelt im selben Angebot, bereits ausgerüstete Relikte werden nicht angeboten, und wenn möglich passt mindestens eine Option zu deiner stärksten Build-Richtung.
          Alle Zufälle stammen aus dem Run-Seed {run.seed} und sind reproduzierbar.
        </p>
      </details>
    </div>
  );
}

function SlotPicker({ opt, slot, setSlot }: { opt: RewardOption; slot: A.Slot | null; setSlot: (s: A.Slot) => void }) {
  const { save } = useGame();
  const run = save.run!;
  if (opt.kind === 'relic') {
    return (
      <div className="panel">
        <h3>Reliktplatz wählen</h3>
        <div className="row gap wrap">
          {run.relics.map((r, i) => {
            const selected = slot?.type === 'relic' && slot.idx === i;
            return (
              <button key={i} className={`slot-btn ${selected ? 'selected' : ''}`} onClick={() => setSlot({ type: 'relic', idx: i })}>
                <div className="small muted">Reliktplatz {i + 1}</div>
                {r ? (
                  <>
                    <b>{RELICS[r].name}</b>
                    <div className="small">{RELICS[r].description}</div>
                    <div className="small warn-text">Wird ersetzt und geht verloren.{r === 'mondgloeckchen' ? ' Yuumi verabschiedet sich für diesen Run.' : ''}</div>
                  </>
                ) : (
                  <span className="muted">leer</span>
                )}
              </button>
            );
          })}
        </div>
        {opt.id === 'mondgloeckchen' && <p className="small">Yuumi belegt einen der zwei Reliktplätze und begleitet euch bis zum Ende dieses Runs.</p>}
        {slot?.type === 'relic' && run.relics[slot.idx] && (
          <Compare
            oldName={RELICS[run.relics[slot.idx]!].name}
            oldText={RELICS[run.relics[slot.idx]!].description}
            newName={RELICS[opt.id].name}
            newText={RELICS[opt.id].description}
          />
        )}
      </div>
    );
  }
  return (
    <div className="panel">
      <h3>Wer soll es tragen?</h3>
      <div className="slot-grid">
        {HERO_IDS.map((h: HeroId) => (
          <div key={h} className="slot-hero">
            <div className="row gap center-v">
              <HeroArt id={h} size={40} />
              <b style={{ color: HEROES[h].color }}>{HEROES[h].name}</b>
            </div>
            {run.equipment[h].map((it, i) => {
              const selected = slot?.type === 'hero' && slot.hero === h && slot.idx === i;
              return (
                <button key={i} className={`slot-btn ${selected ? 'selected' : ''}`} onClick={() => setSlot({ type: 'hero', hero: h, idx: i })}>
                  <div className="small muted">Platz {i + 1}</div>
                  {it ? <b>{ITEMS[it].name}</b> : <span className="muted">leer</span>}
                </button>
              );
            })}
            {itemBearerNote(opt.id, h, run) && <div className="small warn-text">{itemBearerNote(opt.id, h, run)}</div>}
          </div>
        ))}
      </div>
      {slot?.type === 'hero' && run.equipment[slot.hero][slot.idx] && (
        <Compare
          oldName={ITEMS[run.equipment[slot.hero][slot.idx]!].name}
          oldText={ITEMS[run.equipment[slot.hero][slot.idx]!].description}
          newName={ITEMS[opt.id].name}
          newText={ITEMS[opt.id].description}
        />
      )}
    </div>
  );
}

function Compare({ oldName, oldText, newName, newText }: { oldName: string; oldText: string; newName: string; newText: string }) {
  return (
    <div className="compare">
      <div>
        <div className="small muted">Aktuell (geht verloren)</div>
        <b>{oldName}</b>
        <div className="small">{oldText}</div>
      </div>
      <div className="compare-arrow">→</div>
      <div>
        <div className="small muted">Neu</div>
        <b>{newName}</b>
        <div className="small">{newText}</div>
      </div>
    </div>
  );
}
