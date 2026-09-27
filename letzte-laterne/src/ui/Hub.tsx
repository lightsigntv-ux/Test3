import { useState } from 'react';
import { ENEMIES } from '../content/enemies';
import { HEROES } from '../content/heroes';
import { ITEMS, RELICS, TAG_LABEL, TAG_SYMBOL } from '../content/items';
import { SEALS, SEAL_ORDER } from '../content/progression';
import { DIALOGS, EXPEDITIONS } from '../content/story';
import type { BuildTag, ExpeditionId, HeroId, ItemId, LongNightMod, RelicId, SealId } from '../content/types';
import { HERO_IDS } from '../content/types';
import * as A from '../game/actions';
import { EnemyArt, HeroArt, LanternIcon, YuumiArt } from './art';
import { DialogOverlay } from './Dialog';
import { Rar, Tags } from './components';
import { SettingsPanel } from './Settings';
import { useGame } from './store';

type Tab = 'expedition' | 'seals' | 'collection' | 'chronicle' | 'settings';

const MOD_INFO: Record<LongNightMod, { name: string; text: string }> = {
  swift: { name: 'Schnelle Schatten', text: 'Gefährliche Gegnerfähigkeiten werden 30 % schneller vorbereitet und 25 % häufiger eingesetzt.' },
  reinforced: { name: 'Verstärkte Reihen', text: 'Jede Gegnergruppe (auch Bosse) erhält einen zusätzlichen Unterstützer (Sängerin oder Nebelschild).' },
  meagerCamp: { name: 'Karges Lager', text: 'Lagerheilung nur 20 % statt 40 %. Dafür: +10 % Legendär-Chance und +20 % Relikt-Chance bei Elitebeute.' },
};

export function Hub({ onTitle }: { onTitle: () => void }) {
  const { save } = useGame();
  const [tab, setTab] = useState<Tab>('expedition');
  const meta = save.meta;
  const ended = !!meta.story.ending;
  return (
    <div className="hub">
      <header className="topbar">
        <div className="row gap center-v">
          <LanternIcon size={22} />
          <h1 className="hub-title">Die Laternenstube</h1>
        </div>
        <div className="row gap center-v">
          <span className="light-count" title="Erinnerungslicht – dauerhafte Währung für Siegel">
            ✦ {meta.light} Erinnerungslicht
          </span>
          <button className="btn ghost small" onClick={onTitle}>
            Titelbild
          </button>
        </div>
      </header>
      <div className="hub-party">
        <div className="hub-scene">
          <div className="hub-hero">
            <HeroArt id="fritz" size={86} />
          </div>
          <div className="hub-lantern">
            <LanternIcon size={34} />
          </div>
          <div className="hub-hero">
            <HeroArt id="sera" size={86} mood="happy" />
          </div>
          <div className="hub-hero">
            <HeroArt id="ivo" size={86} />
          </div>
        </div>
        <p className="hub-line">{hubLine(save.meta)}</p>
      </div>
      <nav className="tabs">
        {(
          [
            ['expedition', 'Aufbruch'],
            ['seals', `Siegel${A.canBuySealAny(meta) ? ' •' : ''}`],
            ['collection', 'Sammlung'],
            ['chronicle', 'Chronik'],
            ['settings', 'Einstellungen'],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {label}
          </button>
        ))}
      </nav>
      <main className="hub-main">
        {tab === 'expedition' && <ExpeditionTab ended={ended} />}
        {tab === 'seals' && <SealsTab />}
        {tab === 'collection' && <CollectionTab />}
        {tab === 'chronicle' && <ChronicleTab />}
        {tab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
}

function hubLine(meta: ReturnType<typeof useGame>['save']['meta']): string {
  if (meta.story.ending === 'keep') return 'Sera: „Die Laterne brennt leiser jetzt. Erzählst du mir eine Erinnerung?“';
  if (meta.story.ending === 'extinguish') return 'Fritz: „Kein Nebel mehr draußen. Aber Erinnerungen sind auch eine Art Weg.“';
  if (meta.bossesDefeated.includes('archivarin')) return 'Sera: „Die Treppe unter der Stube … lasst uns das gemeinsam zu Ende bringen.“';
  if (meta.bossesDefeated.includes('glockenwaechter')) return 'Ivo: „Das Archiv! Ich habe alle Theorien sortiert. Alphabetisch.“';
  if (meta.runsStarted > 0) return 'Sera: „Ruh dich kurz aus. Dann versuchen wir es noch einmal – anders.“';
  return 'Fritz: „Die Glocke in der Vorstadt. Dort fangen wir an.“';
}

function ExpeditionTab({ ended }: { ended: boolean }) {
  const { save, act } = useGame();
  const meta = save.meta;
  const [exp, setExp] = useState<ExpeditionId>(meta.unlockedExpedition);
  const [mods, setMods] = useState<LongNightMod[]>([]);
  const [bearers, setBearers] = useState<Partial<Record<ItemId, HeroId>>>({ ...A.DEFAULT_BEARER });
  const startItems = meta.sealsActive.map((s) => SEALS[s].startItem).filter((x): x is ItemId => !!x);
  const check = A.canStartExpedition(meta, exp, mods);
  return (
    <div className="grid-2">
      <section>
        <h2>Expedition wählen</h2>
        <div className="col gap">
          {([1, 2, 3] as ExpeditionId[]).map((e) => {
            const x = EXPEDITIONS[e];
            const locked = e > meta.unlockedExpedition;
            const done = meta.bossesDefeated.includes(x.boss);
            return (
              <button key={e} className={`exp-card ${exp === e ? 'selected' : ''}`} disabled={locked} onClick={() => setExp(e)}>
                <div className="row between">
                  <b>
                    {e}. {x.name}
                  </b>
                  <span className="small">{locked ? '🔒 gesperrt' : done ? '✓ abgeschlossen' : 'offen'}</span>
                </div>
                <div className="muted small">{x.chapter}</div>
                <div className="small">{locked ? 'Besiege den vorherigen Gebietsboss, um diese Expedition freizuschalten.' : x.subtitle}</div>
              </button>
            );
          })}
        </div>
        <p className="small muted">
          Jede Expedition: 8 Stationen (Kampf, Wahl Kampf/Ereignis, Kampf, Storyereignis, Elite, Lager, schwerer Kampf, Boss). Ausrüstung, Relikte, Run-Level und Verbesserungen gelten nur für den Run;
          Erinnerungslicht, Siegel, Story und Sammlung bleiben.
        </p>
      </section>
      <section>
        <h2>Vorbereitung</h2>
        <div className="panel">
          <h3>Aktive Siegel</h3>
          {meta.sealsActive.length === 0 ? (
            <p className="muted small">Keine Siegel aktiv. Präge Siegel mit Erinnerungslicht im Reiter „Siegel“.</p>
          ) : (
            <ul className="plain">
              {meta.sealsActive.map((s) => (
                <li key={s}>
                  {TAG_SYMBOL[SEALS[s].branch]} <b>{SEALS[s].name}</b> – <span className="small">{SEALS[s].description}</span>
                </li>
              ))}
            </ul>
          )}
          {startItems.length > 0 && (
            <>
              <h3>Startgegenstände</h3>
              {startItems.map((it) => (
                <div key={it} className="row gap center-v">
                  <span>{ITEMS[it].name} →</span>
                  {HERO_IDS.map((h) => (
                    <button key={h} className={`btn small ${bearers[it] === h ? 'primary' : ''}`} onClick={() => setBearers({ ...bearers, [it]: h })}>
                      {HEROES[h].name}
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
        {ended && (
          <div className="panel">
            <h3>🌙 Die lange Nacht</h3>
            <p className="small muted">Wähle bis zu drei Modifikatoren. Jeder Modifikator bringt beim Boss-Sieg +1 Erinnerungslicht.</p>
            {(Object.keys(MOD_INFO) as LongNightMod[]).map((m) => (
              <label key={m} className="mod-row">
                <input type="checkbox" checked={mods.includes(m)} onChange={(e) => setMods(e.target.checked ? [...mods, m] : mods.filter((x) => x !== m))} />
                <span>
                  <b>{MOD_INFO[m].name}:</b> {MOD_INFO[m].text}
                </span>
              </label>
            ))}
            <p className="small">
              Siege in der langen Nacht: <b>{meta.longNight.wins}</b> · Höchste bewältigte Herausforderung: <b>{meta.longNight.bestMods}</b> Modifikator(en)
            </p>
          </div>
        )}
        {mods.length > 0 && (
          <div className="panel warn">
            <b>Veränderte Regeln für diesen Run:</b>
            <ul className="plain small">
              {mods.map((m) => (
                <li key={m}>• {MOD_INFO[m].text}</li>
              ))}
            </ul>
          </div>
        )}
        <button className="btn primary big" disabled={!check.ok} onClick={() => act((s) => A.startRun(s, exp, { mods, bearers }))}>
          {mods.length ? '🌙 In die lange Nacht aufbrechen' : ended ? 'Eine Erinnerung erleben' : 'Aufbrechen'}
        </button>
        {!check.ok && <p className="small warn-text">{check.reason}</p>}
      </section>
    </div>
  );
}

function SealsTab() {
  const { save, act } = useGame();
  const meta = save.meta;
  const load = A.sealLoad(meta.sealsActive);
  return (
    <div>
      <div className="row between center-v">
        <h2>Siegel prägen & aktivieren</h2>
        <div className="small">
          Aktiv: <b>{meta.sealsActive.length}/3</b> · Belastung: <b>{load}/4</b> · ✦ {meta.light}
        </div>
      </div>
      <p className="small muted">
        Gekaufte Siegel bleiben für immer. Aktiviere höchstens 3 gleichzeitig mit einer Belastung von höchstens 4 (Stufe 1 und 2: je 1, Stufe 3: 2). Umstellen ist hier jederzeit kostenlos; aktive Vorgänger
        sind nicht nötig.
      </p>
      <div className="seal-grid">
        {(['glut', 'bastion', 'echo'] as BuildTag[]).map((b) => (
          <div key={b} className={`seal-col branch-${b}`}>
            <h3>
              {TAG_SYMBOL[b]} {TAG_LABEL[b]}
            </h3>
            {SEAL_ORDER.filter((id) => SEALS[id].branch === b).map((id) => (
              <SealCard key={id} id={id} onBuy={() => act((s) => A.buySeal(s, id))} onToggle={() => act((s) => A.toggleSeal(s, id))} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SealCard({ id, onBuy, onToggle }: { id: SealId; onBuy: () => void; onToggle: () => void }) {
  const { save } = useGame();
  const s = SEALS[id];
  const owned = save.meta.sealsOwned.includes(id);
  const active = save.meta.sealsActive.includes(id);
  const buy = A.canBuySeal(save.meta, id);
  const act = A.canActivateSeal(save.meta, id);
  return (
    <div className={`seal-card ${owned ? 'owned' : ''} ${active ? 'active' : ''}`}>
      <div className="row between">
        <b>
          Stufe {s.tier}: {s.name}
        </b>
        <span className="small">Belastung {s.load}</span>
      </div>
      <div className="small">{s.description}</div>
      {!owned ? (
        <>
          <button className="btn small primary" disabled={!buy.ok} onClick={onBuy}>
            Prägen (✦ {s.cost})
          </button>
          {!buy.ok && <div className="small muted">{buy.reason}</div>}
        </>
      ) : (
        <>
          <button className={`btn small ${active ? 'primary' : ''}`} disabled={!active && !act.ok} onClick={onToggle}>
            {active ? '✓ Aktiv – deaktivieren' : 'Aktivieren'}
          </button>
          {!active && !act.ok && <div className="small muted">{act.reason}</div>}
        </>
      )}
    </div>
  );
}

function CollectionTab() {
  const { save } = useGame();
  const meta = save.meta;
  return (
    <div className="col gap">
      <section>
        <h2>
          Ausrüstung ({meta.discoveredItems.length}/12)
        </h2>
        <div className="coll-grid">
          {(Object.keys(ITEMS) as ItemId[]).map((id) => {
            const it = ITEMS[id];
            const known = meta.discoveredItems.includes(id);
            return (
              <div key={id} className={`coll-card ${known ? `rarb-${it.rarity}` : 'unknown'}`}>
                {known ? (
                  <>
                    <div className="row between">
                      <b>{it.name}</b>
                      <Rar r={it.rarity} />
                    </div>
                    <Tags tags={it.tags} />
                    <div className="small">{it.description}</div>
                    <div className="small muted">Synergie: {it.synergy}</div>
                  </>
                ) : (
                  <div className="muted">??? – noch nicht entdeckt</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <h2>Relikte ({meta.discoveredRelics.length}/7)</h2>
        <div className="coll-grid">
          {(Object.keys(RELICS) as RelicId[]).map((id) => {
            const it = RELICS[id];
            const known = meta.discoveredRelics.includes(id);
            return (
              <div key={id} className={`coll-card ${known ? `rarb-${it.rarity}` : 'unknown'}`}>
                {known ? (
                  <>
                    <div className="row between">
                      <b>{it.name}</b>
                      <Rar r={it.rarity} />
                    </div>
                    <div className="small">{it.description}</div>
                    {it.flavor && <div className="flavor small">{it.flavor}</div>}
                    <div className="small muted">Synergie: {it.synergy}</div>
                  </>
                ) : (
                  <div className="muted">??? – noch nicht entdeckt</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <h2>Begleiter</h2>
        <div className="coll-card yuumi-entry">
          {meta.yuumiDiscovered ? (
            <div className="row gap center-v">
              <YuumiArt size={70} />
              <div>
                <b>Yuumi</b> – eine kleine graue Katze mit einem Mondglöckchen am Hals.
                <div className="small">Kämpft mit Pfotenhieb und schützt mit Schnurrschutz, solange ihr Mondglöckchen als Relikt ausgerüstet ist.</div>
                <div className="small muted">
                  Dieser Eintrag bedeutet keine dauerhafte Begleitung: Das Mondglöckchen muss in jedem Run neu gefunden werden (Ereignis „Ein Miauen im Nebel“ oder Elite-/Reliktbelohnungen).
                </div>
              </div>
            </div>
          ) : (
            <div className="muted">??? – Vielleicht hört man im Nebel der Vorstadt etwas …</div>
          )}
        </div>
      </section>
      <section>
        <h2>Bosse</h2>
        <div className="coll-grid">
          {(['glockenwaechter', 'archivarin', 'hueter'] as const).map((b) => {
            const known = meta.bossesDefeated.includes(b);
            return (
              <div key={b} className={`coll-card ${known ? '' : 'unknown'}`}>
                {known ? (
                  <div className="row gap">
                    <EnemyArt id={b} size={60} />
                    <div>
                      <b>{ENEMIES[b].name}</b> ✓ besiegt
                      <div className="small">{ENEMIES[b].description}</div>
                    </div>
                  </div>
                ) : (
                  <div className="muted">??? – noch nicht besiegt</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ChronicleTab() {
  const { save } = useGame();
  const meta = save.meta;
  const [replay, setReplay] = useState<string | null>(null);
  const seen = meta.seenDialogs.filter((d) => DIALOGS[d]);
  const st = meta.story;
  return (
    <div className="grid-2">
      <section>
        <h2>Geschichte</h2>
        <ul className="plain">
          <li>{meta.bossesDefeated.includes('glockenwaechter') ? '✓' : '○'} Kapitel 1: Die Stadt vergisst</li>
          <li>{meta.bossesDefeated.includes('archivarin') ? '✓' : '○'} Kapitel 2: Der Preis des Lichts</li>
          <li>{st.ending ? '✓' : '○'} Kapitel 3: Eine Nacht, die enden darf</li>
        </ul>
        <h3>Entscheidungen</h3>
        <ul className="plain small">
          <li>Die Botin Mira: {st.courierSaved === null ? 'noch nicht begegnet' : st.courierSaved ? 'gerettet – sie hilft im Archiv' : 'zurückgelassen'}</li>
          <li>Das Register: {st.namesFreed === null ? 'noch nicht gefunden' : st.namesFreed ? 'Namen freigegeben – der Hüter wird geschwächt' : 'als Brennstoff genommen'}</li>
          <li>Ende: {st.ending === 'keep' ? 'Die Laterne wurde bewahrt' : st.ending === 'extinguish' ? 'Die Laterne wurde gelöscht' : 'offen'}</li>
        </ul>
        <h3>Statistik</h3>
        <ul className="plain small">
          <li>Expeditionen begonnen: {meta.runsStarted} · gewonnen: {meta.runsWon}</li>
          <li>Erinnerungslicht insgesamt verdient: {meta.lightEarnedTotal}</li>
          {meta.story.ending && (
            <li>
              Lange Nacht: {meta.longNight.wins} Siege, höchste Stufe {meta.longNight.bestMods}
            </li>
          )}
        </ul>
        {meta.longNight.history.length > 0 && (
          <>
            <h3>Protokoll der langen Nacht</h3>
            <ul className="plain small">
              {meta.longNight.history.slice(0, 8).map((h, i) => (
                <li key={i}>
                  {h.won ? '✓' : '✗'} {EXPEDITIONS[h.expedition].name} – {h.mods.length} Mod. ({h.mods.map((m) => MOD_INFO[m].name).join(', ') || '–'})
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      <section>
        <h2>Gespräche erneut ansehen</h2>
        {seen.length === 0 && <p className="muted">Noch keine.</p>}
        <div className="col gap-s">
          {seen.map((d) => (
            <button key={d} className="btn small left" onClick={() => setReplay(d)}>
              {DIALOGS[d].title}
            </button>
          ))}
        </div>
      </section>
      {replay && <DialogOverlay save={save} dialogId={replay} isNew={false} onDone={() => setReplay(null)} />}
    </div>
  );
}
