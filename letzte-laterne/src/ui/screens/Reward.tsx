import { useEffect, useState } from 'react';
import { HEROES } from '../../content/heroes';
import { ITEMS, RARITY_LABEL, RARITY_SYMBOL, RELICS, TAG_SYMBOL, itemText } from '../../content/items';
import type { HeroId, Rarity } from '../../content/types';
import { HERO_IDS } from '../../content/types';
import * as A from '../../game/actions';
import { itemBearerNote } from '../../game/describe';
import { heroStats } from '../../game/derive';
import type { RewardOption } from '../../game/types';
import { HeroArt, LanternIcon } from '../art';
import { play } from '../audio';
import { Tip } from '../components';
import { LootArt } from '../lootArt';
import { useGame } from '../store';

export function optionRarity(o: RewardOption): Rarity {
  return o.kind === 'item' ? o.q : RELICS[o.id].rarity;
}
function optionName(o: RewardOption): string {
  return o.kind === 'item' ? ITEMS[o.id].name : RELICS[o.id].name;
}
function optionText(o: RewardOption): string {
  return o.kind === 'item' ? itemText({ id: o.id, q: o.q }) : RELICS[o.id].short;
}

const REVEAL_SOUND: Record<Rarity, Parameters<typeof play>[0]> = {
  common: 'lootCommon',
  magic: 'lootCommon',
  rare: 'lootRare',
  legendary: 'lootLegendary',
};

function LootCard({ o, revealed, selected, onClick, index }: { o: RewardOption; revealed: boolean; selected: boolean; onClick: () => void; index: number }) {
  const r = optionRarity(o);
  const tags = o.kind === 'item' ? ITEMS[o.id].tags : RELICS[o.id].tags;
  const synergy = o.kind === 'item' ? ITEMS[o.id].synergy : RELICS[o.id].synergy;
  return (
    <button
      className={`loot-card q-${r} ${revealed ? 'revealed' : ''} ${selected ? 'selected' : ''}`}
      style={{ ['--i' as string]: index }}
      onClick={onClick}
      data-sfx="none"
      aria-label={revealed ? `${optionName(o)} (${RARITY_LABEL[r]})` : 'Verdeckte Karte'}
    >
      <div className="loot-inner">
        <div className="loot-back">
          <div className="loot-back-frame">
            <LanternIcon size={40} />
          </div>
        </div>
        <div className="loot-front">
          {r === 'legendary' && <div className="loot-rays" />}
          <div className="loot-ribbon">
            {RARITY_SYMBOL[r]} {RARITY_LABEL[r]}
          </div>
          <div className="loot-picture">
            <LootArt kind={o.kind} id={o.id} size={112} />
          </div>
          <div className="loot-kind">{o.kind === 'item' ? 'Ausrüstung' : 'Gruppenrelikt'}</div>
          <h3 className="loot-name">{optionName(o)}</h3>
          <p className="loot-text">{optionText(o)}</p>
          <Tip tip={synergy}>
            <span className="loot-tags">{tags.map((t) => TAG_SYMBOL[t]).join(' ')}</span>
          </Tip>
        </div>
      </div>
    </button>
  );
}

export function RewardScreen() {
  const { save, act } = useGame();
  const run = save.run!;
  const offer = run.reward!;
  const animations = save.settings.animations;
  const [revealed, setRevealed] = useState(animations ? 0 : offer.options.length);
  const [sel, setSel] = useState<number | null>(null);
  const [slot, setSlot] = useState<A.Slot | null>(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(false);
  const opt = sel !== null ? offer.options[sel] : null;
  const all = revealed >= offer.options.length;

  // Karten nacheinander aufdecken; jede Stufe hat ihren eigenen Klang
  useEffect(() => {
    if (all) return;
    const t = setTimeout(
      () => {
        const o = offer.options[revealed];
        const r = optionRarity(o);
        play(REVEAL_SOUND[r]);
        if (r === 'legendary') {
          setFlash(true);
          setTimeout(() => setFlash(false), 900);
        }
        setRevealed((x) => x + 1);
      },
      revealed === 0 ? 650 : 520,
    );
    return () => clearTimeout(t);
  }, [revealed, all, offer]);

  useEffect(() => {
    if (offer.options.length === 1 && all) setSel(0);
  }, [all, offer.options.length]);

  const commit = (fn: () => void) => {
    if (busy) return;
    setBusy(true);
    fn();
  };
  const best = offer.options.map(optionRarity).sort((a, b) => ['common', 'magic', 'rare', 'legendary'].indexOf(b) - ['common', 'magic', 'rare', 'legendary'].indexOf(a))[0];

  return (
    <div className={`screen reward-screen ${flash ? 'legend-flash' : ''}`}>
      <div className="reward-head">
        <h2>{offer.title}</h2>
        <Tip wide tip={<>Chancen je Karte: {offer.oddsText}. Keine doppelten Gegenstände; mindestens eine Karte passt zu deinem Build.</>}>
          <span className="odds-i">ⓘ Chancen</span>
        </Tip>
      </div>
      {offer.note && <p className="note">{offer.note}</p>}
      <div className={`loot-row best-${all ? best : 'none'}`}>
        {offer.options.map((o, i) => (
          <LootCard
            key={i}
            index={i}
            o={o}
            revealed={i < revealed}
            selected={sel === i}
            onClick={() => {
              if (!all) {
                setRevealed(offer.options.length);
                return;
              }
              play('click');
              setSel(i);
              setSlot(null);
            }}
          />
        ))}
      </div>
      {all && opt && <SlotPicker opt={opt} slot={slot} setSlot={setSlot} />}
      {all && (
        <div className="reward-actions">
          <button className="btn primary big" data-sfx="confirm" disabled={!opt || !slot || busy} onClick={() => commit(() => act((s) => A.chooseReward(s, sel!, slot!)))}>
            {!opt ? 'Karte wählen' : !slot ? 'Platz wählen' : 'Ausrüsten'}
          </button>
          {offer.healAlt > 0 && (
            <button className="btn" disabled={busy} onClick={() => commit(() => act((s) => A.declineReward(s, true)))}>
              ✚ Stattdessen heilen (+{Math.round(offer.healAlt * 100)} %)
            </button>
          )}
          <button className="btn ghost" data-sfx="back" disabled={busy} onClick={() => commit(() => act((s) => A.declineReward(s, false)))}>
            {offer.catPenalty ? 'Ablehnen' : 'Nichts nehmen'}
          </button>
        </div>
      )}
      {!all && <p className="muted small center-text">Klicken zum sofortigen Aufdecken</p>}
    </div>
  );
}

function SlotPicker({ opt, slot, setSlot }: { opt: RewardOption; slot: A.Slot | null; setSlot: (s: A.Slot) => void }) {
  const { save } = useGame();
  const run = save.run!;
  if (opt.kind === 'relic') {
    return (
      <div className="slot-picker">
        {run.relics.map((r, i) => {
          const selected = slot?.type === 'relic' && slot.idx === i;
          return (
            <button key={i} className={`slot-tile ${selected ? 'selected' : ''} ${r ? `q-border-${RELICS[r].rarity}` : ''}`} onClick={() => setSlot({ type: 'relic', idx: i })}>
              {r ? <LootArt kind="relic" id={r} size={40} /> : <span className="slot-empty">＋</span>}
              <span className="small">{r ? RELICS[r].name : `Reliktplatz ${i + 1}`}</span>
              {r && selected && <span className="small warn-text">wird ersetzt{r === 'mondgloeckchen' ? ' – Yuumi geht' : ''}</span>}
            </button>
          );
        })}
      </div>
    );
  }
  const current = slot?.type === 'hero' ? run.equipment[slot.hero][slot.idx] : null;
  const note = slot?.type === 'hero' ? itemBearerNote(opt.id, slot.hero, run) : null;
  return (
    <>
      <div className="slot-picker">
        {HERO_IDS.map((h: HeroId) => (
          <div key={h} className="slot-hero" style={{ ['--c' as string]: HEROES[h].color }}>
            <HeroArt id={h} arch={run.archetype[h]} size={44} />
            {run.equipment[h].map((it, i) => {
              const selected = slot?.type === 'hero' && slot.hero === h && slot.idx === i;
              return (
                <Tip key={i} tip={it ? `${ITEMS[it.id].name}: ${itemText(it)}` : `${HEROES[h].name} – freier Platz`}>
                  <button className={`slot-tile ${selected ? 'selected' : ''} ${it ? `q-border-${it.q}` : ''}`} onClick={() => setSlot({ type: 'hero', hero: h, idx: i })}>
                    {it ? <LootArt kind="item" id={it.id} size={40} /> : <span className="slot-empty">＋</span>}
                  </button>
                </Tip>
              );
            })}
          </div>
        ))}
      </div>
      {(current || note) && (
        <p className="small center-text">
          {current && (
            <span className="warn-text">
              Ersetzt <b className={`qt-${current.q}`}>{ITEMS[current.id].name}</b> ({itemText(current)}).{' '}
            </span>
          )}
          {note && <span className="muted">{note}</span>}
        </p>
      )}
      <p className="small muted center-text">
        HP: {HERO_IDS.map((h) => `${HEROES[h].name} ${run.hp[h]}/${heroStats(run, h).maxHp}`).join(' · ')}
      </p>
    </>
  );
}
