import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { FOCUS, STATUS } from '../../content/balance';
import { ENEMIES } from '../../content/enemies';
import { HEROES } from '../../content/heroes';
import { RELIC_VALUES } from '../../content/items';
import type { HeroId } from '../../content/types';
import { HERO_IDS } from '../../content/types';
import * as A from '../../game/actions';
import { abilityLines, windupText } from '../../game/describe';
import { CombatSim, type CombatEvent, type Unit } from '../../sim/combat';
import { SimClock } from '../../sim/clock';
import { EnemyArt, HeroArt, PawIcon, YuumiArt } from '../art';
import { play } from '../audio';
import { Bar, Hint, Tip } from '../components';
import { useGame } from '../store';
import { Formation } from './Map';

interface Floater {
  id: number;
  uid: string;
  text: string;
  cls: string;
  born: number;
}

const FLOAT_MS = 1000;
let floaterId = 0;

export function CombatScreen({ onBuild }: { onBuild: () => void }) {
  const { save, act } = useGame();
  const run = save.run!;
  const cp = run.combat!;
  const setupKey = `${cp.seed}|${run.formation.join(',')}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sim = useMemo(() => new CombatSim(A.buildCombatSetup(save)!), [setupKey]);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(save.settings.defaultSpeed);
  const [, force] = useReducer((x: number) => x + 1, 0);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [anims, setAnims] = useState<Record<string, { cls: string; until: number }>>({});
  const [banner, setBanner] = useState<{ text: string; until: number } | null>(null);
  const [yuumiAnim, setYuumiAnim] = useState<{ cls: string; until: number } | null>(null);
  const [hint, setHint] = useState<{ id: string; text: string } | null>(null);
  const [finishing, setFinishing] = useState(false);
  const pausedRef = useRef(paused);
  const speedRef = useRef(speed);
  pausedRef.current = paused;
  speedRef.current = speed;
  const tutorials = useRef(new Set(save.meta.tutorialsSeen));

  const showHint = useCallback(
    (id: string, text: string, pause = false) => {
      if (tutorials.current.has(id)) return;
      tutorials.current.add(id);
      setHint({ id, text });
      if (pause) setPaused(true);
      act((s) => A.markTutorial(s, id));
    },
    [act],
  );

  const handleEvents = useCallback(
    (events: CombatEvent[]) => {
      const now = performance.now();
      const fl: Floater[] = [];
      const an: Record<string, { cls: string; until: number }> = {};
      for (const ev of events) {
        switch (ev.t) {
          case 'damage':
            if (ev.amount > 0) fl.push({ id: floaterId++, uid: ev.uid, text: `-${ev.amount}`, cls: `f-${ev.kind}`, born: now });
            if (ev.absorbed > 0) fl.push({ id: floaterId++, uid: ev.uid, text: `🛡-${ev.absorbed}`, cls: 'f-absorb', born: now });
            an[ev.uid] = { cls: 'hit', until: now + 200 };
            play(ev.kind === 'burn' ? 'burn' : 'hit');
            break;
          case 'heal':
            fl.push({ id: floaterId++, uid: ev.uid, text: `+${ev.amount}`, cls: 'f-heal', born: now });
            play('heal');
            break;
          case 'shield':
            fl.push({ id: floaterId++, uid: ev.uid, text: `+${ev.amount}🛡`, cls: 'f-shield', born: now });
            play('shield');
            break;
          case 'shieldBreak':
            fl.push({ id: floaterId++, uid: ev.uid, text: 'Schild bricht!', cls: 'f-break', born: now });
            break;
          case 'attack':
            an[ev.uid] = { cls: 'lunge', until: now + 250 };
            break;
          case 'ability':
            an[ev.uid] = { cls: 'cast', until: now + 450 };
            fl.push({ id: floaterId++, uid: ev.uid, text: ev.echo ? `↻ ${ev.name}` : ev.name, cls: 'f-ability', born: now });
            play('ability');
            break;
          case 'windup': {
            play('windup');
            const u = sim.unit(ev.uid);
            if (u?.windup?.interruptible)
              showHint(
                'windup',
                `⚠ ${u.name} bereitet „${ev.name}“ vor! Klicke den Gegner an, um ihn als Fokusziel zu markieren, und setze Fritz’ Laternenwall (Taste 1) ein, bevor der Balken voll ist. Das Spiel ist pausiert – du kannst den Befehl jetzt vorbereiten.`,
                true,
              );
            break;
          }
          case 'interrupt':
            fl.push({ id: floaterId++, uid: ev.uid, text: 'Unterbrochen!', cls: 'f-interrupt', born: now });
            play('interrupt');
            break;
          case 'death':
            an[ev.uid] = { cls: 'dying', until: now + 600 };
            break;
          case 'paw':
            setYuumiAnim({ cls: 'pounce', until: now + 300 });
            an[ev.targetUid] = { cls: 'hit', until: now + 200 };
            break;
          case 'purr':
            setYuumiAnim({ cls: 'purring', until: now + 1100 });
            play('purr');
            if (ev.first)
              showHint('purr', `🐾 Schnurrschutz! Nach jedem dritten Pfotenhieb schützt Yuumi die verletzteste Hauptfigur mit einem Schild (Wappen der Wache verstärkt ihn).`);
            break;
          case 'phase':
          case 'banner':
            if ('text' in ev && ev.text) setBanner({ text: ev.text, until: now + 3500 });
            break;
          case 'explode':
            fl.push({ id: floaterId++, uid: ev.uid, text: '💥', cls: 'f-explode', born: now });
            play('explode');
            break;
          case 'summon':
            an[ev.uid] = { cls: 'appear', until: now + 500 };
            break;
          case 'end':
            play(ev.result === 'victory' ? 'victory' : 'defeat');
            if (ev.result === 'victory' && sim.yuumi) setYuumiAnim({ cls: 'happy', until: now + 5000 });
            break;
          case 'focus':
            break;
        }
      }
      if (sim.enemies.some((e) => e.alive && e.taunt > 0))
        showHint('taunt', '❗ Provokation: Solange das Symbol leuchtet, müssen alle Einzelangriffe (auch Yuumis) diesen Gegner treffen. Funkensturm trifft trotzdem alle.');
      if (sim.focus >= FOCUS.max && sim.time > 3) showHint('focusFull', 'Der Fokus ist voll (6/6). Setze Fähigkeiten ein – sonst verfällt die Regeneration.');
      if (fl.length) setFloaters((prev) => [...prev.filter((f) => now - f.born < FLOAT_MS), ...fl].slice(-60));
      if (Object.keys(an).length) setAnims((prev) => ({ ...prev, ...an }));
    },
    [sim, showHint],
  );

  // Spielschleife: Echtzeit × Geschwindigkeit → feste Simulationsschritte
  useEffect(() => {
    if (!started) return;
    let raf = 0;
    let last = performance.now();
    const clock = new SimClock();
    const frame = (now: number) => {
      const steps = clock.advance((now - last) / 1000, speedRef.current, pausedRef.current || !!sim.result);
      last = now;
      for (let i = 0; i < steps && !sim.result; i++) sim.step();
      const ev = sim.drainEvents();
      if (ev.length) handleEvents(ev);
      force();
      if (!sim.result || ev.length) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [started, sim, handleEvents]);

  const cast = useCallback(
    (h: HeroId) => {
      if (!started || sim.result) return;
      if (sim.queue.includes(h)) sim.cancelCommand(h);
      else if (sim.command(h)) play('click');
      force();
    },
    [sim, started],
  );

  const cycleFocus = useCallback(() => {
    const alive = sim.aliveEnemies();
    if (!alive.length) return;
    const i = alive.findIndex((e) => e.uid === sim.focusTargetUid);
    sim.setFocusTarget(alive[(i + 1) % alive.length].uid);
    force();
  }, [sim]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (save.dialogQueue.length || e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === ' ') {
        e.preventDefault();
        if (!started) setStarted(true);
        else if (!sim.result) setPaused((p) => !p);
      } else if (e.key === '1' || e.key === '2' || e.key === '3') {
        cast(HERO_IDS[Number(e.key) - 1]);
      } else if (e.key === 's' || e.key === 'S') {
        setSpeed((s) => (s === 1 ? 2 : 1));
      } else if (e.key === 'Tab') {
        e.preventDefault();
        cycleFocus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, sim, cast, cycleFocus, save.dialogQueue.length]);

  const finish = () => {
    if (finishing || !sim.result) return;
    setFinishing(true);
    const heroHp = { fritz: 0, ivo: 0, sera: 0 } as Record<HeroId, number>;
    for (const h of sim.heroes) heroHp[h.heroId!] = h.alive ? h.hp : 0;
    act((s) =>
      A.combatFinished(s, {
        result: sim.result!,
        heroHp,
        stats: sim.stats,
        enemiesAlive: sim.aliveEnemies().map((e) => ({ name: e.name, hpPct: e.hp / e.maxHp, role: e.def!.role })),
      }),
    );
  };

  const now = performance.now();
  const animOf = (uid: string) => {
    const a = anims[uid];
    return a && a.until > now ? a.cls : '';
  };
  const floatersOf = (uid: string) => floaters.filter((f) => f.uid === uid && now - f.born < FLOAT_MS);
  const yAnim = yuumiAnim && yuumiAnim.until > now ? yuumiAnim.cls : '';
  const front = sim.heroes[0];
  const back = sim.heroes.slice(1);
  const kindLabel = cp.kind === 'boss' ? 'Bosskampf' : cp.kind === 'elite' ? 'Elitekampf' : cp.stationType === 'hardFight' ? 'Schwerer Kampf' : 'Kampf';
  const escIn = sim.escalationAt - sim.time;

  return (
    <div className={`combat ${paused ? 'is-paused' : ''} speed-${speed}`}>
      <div className="combat-top">
        <span className="pill">{kindLabel}</span>
        <span className="pill">⏱ {sim.time.toFixed(0)} s</span>
        {escIn > 0 ? (
          <span className={`pill ${escIn < 15 ? 'danger-pill' : ''}`} title="Danach verdichtet sich der Nebel: wachsender Schaden an allen, Heilung halbiert.">
            Nebel in {Math.ceil(escIn)} s
          </span>
        ) : (
          <span className="pill danger-pill">🌫 Nebel verdichtet sich!</span>
        )}
        <div className="grow" />
        <button className={`btn small ${paused ? 'primary' : ''}`} onClick={() => setPaused((p) => !p)} disabled={!started || !!sim.result}>
          {paused ? '▶ Fortsetzen' : '❚❚ Pause'} (Leertaste)
        </button>
        <button className={`btn small ${speed === 1 ? 'primary' : ''}`} onClick={() => setSpeed(1)}>
          1×
        </button>
        <button className={`btn small ${speed === 2 ? 'primary' : ''}`} onClick={() => setSpeed(2)}>
          2×
        </button>
      </div>
      {banner && banner.until > now && <div className="combat-banner">{banner.text}</div>}
      {paused && started && !sim.result && <div className="pause-banner">❚❚ Pausiert – lies in Ruhe und bereite Befehle vor. Sie werden beim Fortsetzen ausgeführt.</div>}

      <div className="arena">
        <div className="party-area">
          <div className="back-col">
            {back.map((h) => (
              <HeroUnit key={h.uid} u={h} sim={sim} anim={animOf(h.uid)} floaters={floatersOf(h.uid)} row="Hinten" />
            ))}
          </div>
          <div className="front-col">
            <HeroUnit u={front} sim={sim} anim={animOf(front.uid)} floaters={floatersOf(front.uid)} row="Vorn" />
            {sim.yuumi && (
              <div className={`yuumi-unit ${yAnim} ${paused || !started ? 'resting' : ''}`}>
                <YuumiArt size={58} pose={yAnim === 'pounce' ? 'pounce' : yAnim === 'happy' ? 'happy' : 'sit'} />
                {yAnim === 'purring' && <span className="purr-text">prrr ♥</span>}
                <div className="yuumi-label small">Yuumi</div>
              </div>
            )}
          </div>
        </div>
        <div className="vs">⟡</div>
        <div className="enemy-area">
          {sim.enemies.map((e) => (
            <EnemyUnit
              key={e.uid}
              u={e}
              sim={sim}
              focused={sim.focusTargetUid === e.uid}
              anim={animOf(e.uid)}
              floaters={floatersOf(e.uid)}
              onClick={() => {
                if (e.alive) {
                  sim.setFocusTarget(e.uid);
                  play('click');
                  force();
                }
              }}
            />
          ))}
        </div>
      </div>

      <div className="combat-bottom">
        <FocusMeter sim={sim} />
        <div className="abilities">
          {HERO_IDS.map((h, i) => (
            <AbilityButton key={h} h={h} sim={sim} keyNum={i + 1} onCast={() => cast(h)} started={started} />
          ))}
        </div>
        {sim.yuumi && <YuumiPanel sim={sim} />}
        <CombatLog sim={sim} />
      </div>

      {!started && (
        <PreCombat
          sim={sim}
          onStart={() => setStarted(true)}
          onBuild={onBuild}
          firstTime={!save.meta.tutorialsSeen.includes('combat')}
          onTutorialSeen={() => act((s) => A.markTutorial(s, 'combat'))}
        />
      )}

      {hint && (
        <div className="hint-wrap">
          <Hint
            onClose={() => {
              setHint(null);
              if (hint.id === 'windup') setPaused(false);
            }}
          >
            {hint.text}
          </Hint>
        </div>
      )}

      {sim.result && (
        <div className={`end-overlay ${sim.result}`}>
          <h2>{sim.result === 'victory' ? 'Sieg!' : 'Die Gruppe ist gefallen'}</h2>
          {sim.result === 'victory' ? (
            <p>
              {sim.heroes.some((h) => !h.alive) ? 'Gefallene Helden kehren mit 20 % Lebenspunkten zurück. ' : ''}
              {sim.yuumi ? 'Yuumi hebt stolz den Schwanz.' : ''}
            </p>
          ) : (
            <p>Alle drei Hauptfiguren sind besiegt. Die Laterne holt euch zurück.</p>
          )}
          <button className="btn primary big" onClick={finish} disabled={finishing} autoFocus>
            {sim.result === 'victory' ? 'Weiter' : 'Zur Auswertung'}
          </button>
        </div>
      )}
    </div>
  );
}

function StatusIcons({ u }: { u: Unit }) {
  return (
    <div className="statuses">
      {u.burnStacks > 0 && (
        <Tip tip={`Brand: ${u.burnStacks}/${STATUS.burnMaxStacks} Stapel, noch ${u.burnTime.toFixed(1)} s. Schaden pro Sekunde je Stapel.`}>
          <span className="st st-burn">🔥{u.burnStacks}</span>
        </Tip>
      )}
      {u.vulnerable > 0 && (
        <Tip tip={`Verwundbar: erleidet +25 % Schaden (noch ${u.vulnerable.toFixed(1)} s).`}>
          <span className="st st-vuln">⚠{u.vulnerable.toFixed(0)}</span>
        </Tip>
      )}
      {u.taunt > 0 && (
        <Tip tip="Provokation: Alle Einzelangriffe der Gruppe müssen diesen Gegner treffen.">
          <span className="st st-taunt">❗Provokation</span>
        </Tip>
      )}
      {u.cycleState === 'exhausted' && (
        <Tip tip="Erschöpft: keine Angriffe, erleidet +50 % Schaden.">
          <span className="st st-exh">💤 erschöpft</span>
        </Tip>
      )}
      {u.hots.length > 0 && <span className="st st-hot">✚</span>}
    </div>
  );
}

function FloaterLayer({ floaters }: { floaters: Floater[] }) {
  return (
    <div className="floaters">
      {floaters.map((f, i) => (
        <span key={f.id} className={`floater ${f.cls}`} style={{ left: `${40 + ((i * 17) % 40)}%` }}>
          {f.text}
        </span>
      ))}
    </div>
  );
}

function HeroUnit({ u, sim, anim, floaters, row }: { u: Unit; sim: CombatSim; anim: string; floaters: Floater[]; row: string }) {
  const def = HEROES[u.heroId!];
  const queued = sim.queue.includes(u.heroId!);
  return (
    <div className={`unit hero ${u.alive ? '' : 'dead'} ${anim}`} style={{ ['--c' as string]: def.color }}>
      <div className="unit-row small muted">{row}</div>
      <div className="unit-art">
        <HeroArt id={u.heroId!} size={78} mood={u.alive ? (u.hp / u.maxHp < 0.3 ? 'sad' : 'normal') : 'down'} />
        {u.shield > 0 && <div className="shield-aura" />}
        <FloaterLayer floaters={floaters} />
      </div>
      <div className="unit-name">
        <span style={{ color: def.color }}>{def.symbol}</span> {def.name} {queued && <span className="queued">⏳</span>}
      </div>
      <Bar value={u.hp} max={u.maxHp} shield={u.shield} label color={u.hp / u.maxHp < 0.3 ? '#e0584a' : '#5fbf6a'} />
      <StatusIcons u={u} />
    </div>
  );
}

function EnemyUnit({ u, sim, focused, anim, floaters, onClick }: { u: Unit; sim: CombatSim; focused: boolean; anim: string; floaters: Floater[]; onClick: () => void }) {
  const def = u.def!;
  const phase = def.phases[u.phase];
  const dmgScale = sim.setup.dmgScale;
  const tip = (
    <>
      <b>{def.name}</b> – {def.role}
      <div>{def.description}</div>
      <div className="small">
        Angriff: {Math.round(u.atk)} Schaden alle {(def.interval * phase.intervalMult).toFixed(1)} s · Ziel: {def.targeting === 'back' ? 'hintere Reihe' : 'vorderste Figur'}
      </div>
      {phase.abilities.map((a, i) => (
        <div key={i} className="small">
          • {a.name}
          {a.type === 'windup' ? `: ${windupText(a.effect, dmgScale)} (${a.interruptible ? 'unterbrechbar' : 'nicht unterbrechbar'}, ${a.windup} s Vorbereitung)` : ''}
        </div>
      ))}
      {def.phases.length > 1 && <div className="small muted">Phase {u.phase + 1}/{def.phases.length}{u.phase === 0 ? ' – ab 50 % HP ändert sich das Verhalten.' : ''}</div>}
      <div className="small muted">Klicken: als Fokusziel markieren</div>
    </>
  );
  return (
    <div className={`unit enemy ${u.alive ? '' : 'dead'} ${focused && u.alive ? 'focused' : ''} ${anim} kind-${def.kind}`} onClick={onClick} role="button" aria-label={`${def.name} als Fokusziel`}>
      {focused && u.alive && <div className="focus-marker">🎯 Fokusziel</div>}
      {u.windup && (
        <div className={`windup ${u.windup.interruptible ? 'int' : 'noint'}`}>
          <div className="windup-name">
            ⚠ {u.windup.name} {u.windup.interruptible ? '✋ unterbrechbar' : '⛔ nicht unterbrechbar'}
          </div>
          <div className="windup-bar">
            <span style={{ width: `${(1 - u.windup.remaining / u.windup.total) * 100}%` }} />
          </div>
          <div className="small">{windupText(u.windup.effect, dmgScale)}</div>
        </div>
      )}
      <Tip tip={tip} wide>
        <div className="unit-art">
          <EnemyArt id={u.enemyId!} size={Math.round(84 * Math.min(def.size, 1.5))} />
          {u.shield > 0 && <div className="shield-aura enemy-shield" />}
          <FloaterLayer floaters={floaters} />
        </div>
      </Tip>
      <div className="unit-name">
        {def.name}
        {def.kind === 'elite' && <span className="badge elite">Elite</span>}
        {def.kind === 'boss' && <span className="badge boss">Boss · {phase.name || `Phase ${u.phase + 1}`}</span>}
      </div>
      <div className="small muted role">
        {def.role} {def.targeting === 'back' && <span className="badge back">🏹 hintere Reihe</span>}
      </div>
      <Bar value={u.hp} max={u.maxHp} shield={u.shield} label color="#c9524a" />
      <StatusIcons u={u} />
    </div>
  );
}

function FocusMeter({ sim }: { sim: CombatSim }) {
  const regen = Math.min(1, sim.focusTimer / FOCUS.regenInterval);
  return (
    <Tip tip={`Fokus: gemeinsame Ressource für Fähigkeiten. Maximum ${FOCUS.max}, +1 alle ${FOCUS.regenInterval} s. Am Maximum verfällt die Regeneration.`}>
      <div className="focus-meter">
        <div className="small">
          Fokus <b>{sim.focus}</b>/{FOCUS.max}
        </div>
        <div className="pips">
          {Array.from({ length: FOCUS.max }, (_, i) => (
            <span key={i} className={`pip ${i < sim.focus ? 'on' : ''} ${i === sim.focus ? 'charging' : ''}`} style={i === sim.focus ? { ['--p' as string]: `${regen * 100}%` } : undefined} />
          ))}
        </div>
      </div>
    </Tip>
  );
}

function AbilityButton({ h, sim, keyNum, onCast, started }: { h: HeroId; sim: CombatSim; keyNum: number; onCast: () => void; started: boolean }) {
  const { save } = useGame();
  const st = sim.abilityState(h);
  const def = HEROES[h];
  const lines = abilityLines(save.run!, h);
  const cdPct = st.cd > 0 ? (st.cd / st.cdMax) * 100 : 0;
  const reason = !started ? 'Der Kampf hat noch nicht begonnen.' : st.reason;
  const hero = sim.hero(h)!;
  const f = sim.focusTargetUid ? sim.unit(sim.focusTargetUid) : undefined;
  const canInterrupt = h === 'fritz' && f?.alive && f.windup?.interruptible;
  return (
    <Tip
      wide
      tip={
        <>
          <b>
            {def.ability.name} ({def.name})
          </b>
          <div>{def.ability.description}</div>
          {lines.map((l, i) => (
            <div key={i} className="small">
              {l}
            </div>
          ))}
          {reason && !st.queued && <div className="small warn-text">Nicht verfügbar: {reason}</div>}
          {st.queued && <div className="small">Vorbereitet – erneut klicken zum Abbrechen.</div>}
        </>
      }
    >
      <button
        className={`ability ${st.ready ? 'ready' : ''} ${st.queued ? 'queued' : ''} ${canInterrupt ? 'can-interrupt' : ''}`}
        style={{ ['--c' as string]: def.color }}
        onClick={onCast}
        disabled={!started || (!st.ready && !st.queued) || !hero.alive}
        aria-label={`${def.ability.name}, Taste ${keyNum}`}
      >
        <span className="ab-key">{keyNum}</span>
        <span className="ab-name">
          {def.symbol} {def.ability.name}
        </span>
        <span className="ab-cost">
          {'◆'.repeat(st.cost)}
          {st.cost === 0 ? 'gratis' : ''} <span className="muted">Fokus</span>
        </span>
        <span className="ab-effect small">{lines[1]}</span>
        {canInterrupt && <span className="ab-interrupt">✋ unterbricht Fokusziel!</span>}
        {cdPct > 0 && (
          <span className="ab-cd" style={{ height: `${cdPct}%` }}>
            <span>{st.cd.toFixed(1)} s</span>
          </span>
        )}
        {!st.ready && !st.queued && reason && <span className="ab-reason small">{reason}</span>}
        {st.queued && <span className="ab-queued">vorbereitet</span>}
      </button>
    </Tip>
  );
}

function YuumiPanel({ sim }: { sim: CombatSim }) {
  const y = sim.yuumi!;
  const prog = y.paws % RELIC_VALUES.purrEvery;
  const toPurr = RELIC_VALUES.purrEvery - prog;
  return (
    <Tip
      tip={`Yuumi (Begleiterin): Pfotenhieb ${RELIC_VALUES.pawDamage} Schaden alle ${RELIC_VALUES.pawInterval} s auf das Fokusziel. Nach jedem 3. Pfotenhieb: Schnurrschutz auf die verletzteste Hauptfigur. Hat keine Lebenspunkte und wird nicht angegriffen.`}
    >
      <div className="yuumi-panel">
        <YuumiArt size={36} />
        <div>
          <div className="small">
            <b>Yuumi</b> · {y.paws} Hiebe · {y.purrs}× geschnurrt
          </div>
          <div className="paws">
            {[0, 1, 2].map((i) => (
              <PawIcon key={i} filled={i < prog} />
            ))}
            <span className="small muted">Schnurrschutz in {toPurr}</span>
          </div>
        </div>
      </div>
    </Tip>
  );
}

function CombatLog({ sim }: { sim: CombatSim }) {
  const entries = sim.log.slice(-7).reverse();
  return (
    <div className="combat-log" aria-live="polite">
      <div className="small muted">Kampfprotokoll</div>
      {entries.map((l, i) => (
        <div key={`${l.time}-${i}`} className={`log-${l.kind}`}>
          <span className="muted">{l.time.toFixed(0)}s</span> {l.text}
        </div>
      ))}
    </div>
  );
}

function PreCombat({ sim, onStart, onBuild, firstTime, onTutorialSeen }: { sim: CombatSim; onStart: () => void; onBuild: () => void; firstTime: boolean; onTutorialSeen: () => void }) {
  const kinds = [...new Set(sim.enemies.map((e) => e.enemyId!))];
  const dmgScale = sim.setup.dmgScale;
  return (
    <div className="precombat">
      <div className="precombat-box">
        <h2>Vorbereitung</h2>
        {firstTime && (
          <div className="tutorial small">
            <b>So funktioniert der Kampf:</b> Alle greifen automatisch an. Du entscheidest <b>wen</b> (Gegner anklicken = Fokusziel 🎯) und <b>wann</b> Fähigkeiten eingesetzt werden (Tasten 1/2/3). Fähigkeiten
            kosten gemeinsamen <b>Fokus</b> (+1 alle 5 s, max. 6). Mit ⚠ markierte Angriffe werden angekündigt – Fritz’ Laternenwall unterbricht sie beim Fokusziel. Leertaste pausiert jederzeit.
          </div>
        )}
        <div className="grid-2">
          <div>
            <h3>Gegner</h3>
            {kinds.map((k) => {
              const d = ENEMIES[k];
              return (
                <div key={k} className="pre-enemy">
                  <b>{d.name}</b> <span className="muted small">({d.role})</span>
                  {d.targeting === 'back' && <span className="badge back">🏹 hintere Reihe</span>}
                  <div className="small">{d.description}</div>
                  {d.phases[0].abilities
                    .filter((a) => a.type === 'windup')
                    .map((a, i) => (
                      <div key={i} className="small warn-text">
                        ⚠ {a.name}: {a.type === 'windup' ? windupText(a.effect, dmgScale) : ''}
                      </div>
                    ))}
                </div>
              );
            })}
            {sim.setup.focusBonus !== 0 && (
              <p className="small">
                Startfokus: {sim.focus} ({sim.setup.focusBonus > 0 ? '+' : ''}
                {sim.setup.focusBonus} durch Ereignisse)
              </p>
            )}
            {sim.setup.flags.courierHelps && <p className="small good-text">Mira ist bei euch: Sie wird den Namen der Archivarin rufen.</p>}
            {sim.setup.flags.namesFreed && <p className="small good-text">Die befreiten Namen schwächen den Hüter.</p>}
          </div>
          <div>
            <h3>Aufstellung</h3>
            <Formation compact />
            <button className="btn small" onClick={onBuild}>
              Build ansehen
            </button>
          </div>
        </div>
        <button
          className="btn primary big"
          onClick={() => {
            if (firstTime) onTutorialSeen();
            onStart();
          }}
          autoFocus
        >
          Kampf beginnen (Leertaste)
        </button>
      </div>
    </div>
  );
}
