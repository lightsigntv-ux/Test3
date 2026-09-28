import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller } from './controller';
import { Stage } from './scene/stage';
import { W, H } from './scene/kit';
import { Portrait } from './Portrait';
import { Notebook } from './Notebook';
import { Recon, Plate } from './Recon';
import { CHARACTERS, NPC_NAMES } from '../content/characters';
import { CLUE_BY_ID } from '../content/clues';
import { STATEMENT_BY_ID } from '../content/statements';
import { DEDUCTION_BY_ID } from '../content/deductions';
import * as audio from './audio';
import titleMusicUrl from '../assets/Titelmusik.mp3';
import { CHAR_MS, loadSettings, saveSettings, type Settings } from './settings';
import type { NpcId } from '../engine/types';

function useCtl(ctl: Controller) {
  const [, setTick] = useState(0);
  useEffect(() => { const off = ctl.subscribe(() => setTick((t) => t + 1)); return () => { off(); }; }, [ctl]);
}

export function App({ ctl }: { ctl: Controller }) {
  useCtl(ctl);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [logOpen, setLogOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    ctl.reduced = settings.reducedMotion;
    audio.applyVolumes(settings.volumes);
    saveSettings(settings);
    document.documentElement.dataset.textsize = settings.textSize;
  }, [settings, ctl]);

  useEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / W, window.innerHeight / H);
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Tastatur
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.tagName === 'SELECT') && k !== 'Escape') return;
      audio.initAudio();
      if (logOpen) { if (k === 'Escape' || k === 'l' || k === 'L') { setLogOpen(false); e.preventDefault(); } return; }
      if (ctl.overlay === 'title' || ctl.overlay === 'ending' || ctl.overlay === 'io') return;
      if (ctl.overlay === 'card') { if (k === ' ' || k === 'Enter' || k === 'e' || k === 'E') { ctl.closeCard(); e.preventDefault(); } return; }
      if (ctl.overlay === 'notebook') { if (k === 'Escape' || k === 'n' || k === 'N' || k === 'Tab') { ctl.overlay = 'none'; ctl.emit(); e.preventDefault(); } return; }
      if (ctl.overlay === 'present' || ctl.overlay === 'settings') { if (k === 'Escape') { ctl.overlay = ctl.overlay === 'settings' ? 'menu' : 'none'; ctl.emit(); e.preventDefault(); } return; }
      if (ctl.overlay === 'menu') { if (k === 'Escape') { ctl.overlay = 'none'; ctl.emit(); e.preventDefault(); } return; }
      if (ctl.overlay === 'recon') return;
      if (ctl.view) return; // Dialog behandelt eigene Tasten
      if (k === 'Escape') { if (ctl.talkNpc) ctl.closeTalk(); else { ctl.overlay = 'menu'; ctl.emit(); } e.preventDefault(); return; }
      if (ctl.talkNpc) return;
      if (e.repeat && (k === 'e' || k === 'E' || k === ' ' || k === 'Enter' || k === 'n' || k === 'N' || k === 'Tab' || k === 'y' || k === 'Y')) { e.preventDefault(); return; }
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') ctl.keys.left = true;
      else if (k === 'ArrowRight' || k === 'd' || k === 'D') ctl.keys.right = true;
      else if (k === 'e' || k === 'E' || k === ' ' || k === 'Enter') { ctl.interact(); e.preventDefault(); }
      else if (k === 'n' || k === 'N' || k === 'Tab') { ctl.overlay = 'notebook'; if (!ctl.game.flags['tut_notebook']) ctl.game.flags['tut_notebook'] = true; audio.sfx('page'); ctl.emit(); e.preventDefault(); }
      else if (k === 'y' || k === 'Y') ctl.toggleYuumi();
      else if (k === 'ArrowUp' || k === 'w' || k === 'W') { ctl.cycleTarget(-1); e.preventDefault(); }
      else if (k === 'ArrowDown' || k === 's' || k === 'S') { ctl.cycleTarget(1); e.preventDefault(); }
      else if (k === 'l' || k === 'L') setLogOpen(true);
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') ctl.keys.left = false;
      if (k === 'ArrowRight' || k === 'd' || k === 'D') ctl.keys.right = false;
    };
    const blur = () => { ctl.keys.left = false; ctl.keys.right = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur); };
  }, [ctl, logOpen]);

  const g = ctl.game;
  const ov = ctl.overlay;
  useTitleMusic(ov === 'title' || ((ov === 'settings' || ov === 'io') && ctl.returnTo === 'title'), settings);

  return (
    <div className="viewport" onPointerDown={() => audio.initAudio()}>
      <div className="game" ref={boxRef} style={{ width: W, height: H, transform: `scale(${scale})` }}>
        <World ctl={ctl} />
        {ov === 'none' && !ctl.view && !ctl.talkNpc && <WorldHud ctl={ctl} onLog={() => setLogOpen(true)} />}
        {ctl.talkNpc && !ctl.view && ov === 'none' && <TalkMenu ctl={ctl} npc={ctl.talkNpc} />}
        {ctl.view && <DialogueBox ctl={ctl} settings={settings} onLog={() => setLogOpen(true)} />}
        {(ov === 'none' || ov === 'present') && <Toasts ctl={ctl} />}
        {ov === 'present' && <PresentPicker ctl={ctl} />}
        {ov === 'notebook' && <Notebook ctl={ctl} onClose={() => { ctl.overlay = 'none'; ctl.emit(); }} />}
        {ov === 'recon' && <Recon ctl={ctl} />}
        {ov === 'card' && ctl.card !== null && <ChapterCard ctl={ctl} n={ctl.card} />}
        {ov === 'menu' && <Menu ctl={ctl} onSettings={() => { ctl.returnTo = 'menu'; ctl.overlay = 'settings'; ctl.emit(); }} onLog={() => setLogOpen(true)} />}
        {ov === 'settings' && <SettingsPanel settings={settings} set={setSettings} onClose={() => { ctl.overlay = ctl.returnTo; ctl.emit(); }} />}
        {ov === 'io' && <SaveIO ctl={ctl} />}
        {ov === 'title' && <Title ctl={ctl} onSettings={() => { ctl.returnTo = 'title'; ctl.overlay = 'settings'; ctl.emit(); }} />}
        {ov === 'ending' && <Ending ctl={ctl} />}
        {logOpen && <Log ctl={ctl} onClose={() => setLogOpen(false)} />}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Welt (Canvas)
function World({ ctl }: { ctl: Controller }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const stage = new Stage(canvas);
    let raf = 0, last = performance.now(), t0 = last;
    const loop = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      try {
        ctl.update(dt);
        const f = ctl.frame();
        f.cat.t = (now - t0) / 1000;
        stage.render(f, (now - t0) / 1000);
      } catch (err) { console.warn(err); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ctl]);
  const onClick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ctl.clickWorld((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };
  return <canvas ref={ref} className="stage" onPointerDown={onClick} aria-label="Spielszene" />;
}

// ------------------------------------------------------------------ Hinweise am Rand, Ortsname, Interaktionsziel
function WorldHud({ ctl, onLog }: { ctl: Controller; onLog: () => void }) {
  const g = ctl.game;
  const near = ctl.nearest();
  let label = '';
  let lx = 0, ly = 0;
  if (near?.kind === 'hotspot') {
    const h = near.h;
    const lbl = h.labelWhen?.find(([cond]) => ctl.cond(cond))?.[1] ?? h.label;
    label = h.kind === 'exit' ? `→ ${lbl}` : lbl;
    lx = h.x; ly = h.y;
  } else if (near?.kind === 'npc') { label = NPC_NAMES[near.npc]; lx = ctl.npcs().find((n) => n.npc === near.npc)!.x; ly = 0.46; }
  else if (near?.kind === 'cat') { label = 'Yuumi'; lx = ctl.catX; ly = 0.8; }
  const tutorial = !g.flags['tut_move'] ? '← →  gehen  ·  Klick: dorthin gehen'
    : near && !g.flags['tut_examine'] && near.kind === 'hotspot' && near.h.kind === 'examine' ? 'E  oder  Leertaste: ansehen'
      : near?.kind === 'npc' && !g.flags['tut_talk'] ? 'E: ansprechen'
        : g.controlling === 'yuumi' ? 'Y: zurück zu Sera' : '';
  return (
    <>
      <div className="locname">{ctl.locName}{g.controlling === 'yuumi' ? ' · Yuumi' : ''}</div>
      {label && <div className="hslabel" style={{ left: lx * W, top: Math.max(40, ly * H - 44) }}><span className="key">E</span> {label}{ctl.targets().length > 1 ? <span className="more-t"> · ↑↓ mehr</span> : null}</div>}
      {tutorial && <div className="margin-note">{tutorial}</div>}
      <div className="corner">
        <button className="ghostbtn" onClick={() => { ctl.overlay = 'notebook'; audio.sfx('page'); ctl.emit(); }} title="Notizbuch (N)">Notizbuch</button>
        <button className="ghostbtn" onClick={onLog} title="Gesprächsprotokoll (L)">Protokoll</button>
        <button className="ghostbtn" onClick={() => { ctl.overlay = 'menu'; ctl.emit(); }} title="Menü (Esc)">Menü</button>
      </div>
    </>
  );
}

// ------------------------------------------------------------------ Dialog
const LEAD_SPEAKERS = new Set(['sera', 'harriet', 'lionel', 'clara', 'penrose', 'hobbes', 'pryce', 'tilly', 'dunning']);
const ARM_LINE_MS = 220;
const ARM_CHOICES_MS = 450;
const MOOD_VOICE: Record<string, 'normal' | 'sad' | 'angry' | 'soft'> = { sad: 'sad', angry: 'angry', tense: 'normal', warm: 'soft', surprised: 'normal', neutral: 'normal' };

function DialogueBox({ ctl, settings, onLog }: { ctl: Controller; settings: Settings; onLog: () => void }) {
  const v = ctl.view!;
  const [shown, setShown] = useState(0);
  const [ready, setReady] = useState(false);
  const full = v.text ?? '';
  const key = `${v.dlg}/${v.node}`;
  const firstRef = useRef<HTMLButtonElement>(null);
  const [sel, setSel] = useState(0);
  // Schutz gegen Überspringen: Ist der Text fertig, nimmt die Box erst nach einer kurzen Pause Eingaben an.
  // Sonst trifft ein Druck, der eigentlich nur den Text vervollständigen sollte, schon die nächste Zeile oder eine Antwort.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    setShown(0); setReady(false); setSel(0); setArmed(false);
    const ms = CHAR_MS[settings.textSpeed];
    let i = 0, timer = 0;
    const start = () => {
      if (v.speaker && LEAD_SPEAKERS.has(v.speaker)) audio.voiceLead(v.speaker, MOOD_VOICE[v.expr ?? 'neutral']);
      if (ms === 0) { setShown(full.length); setReady(true); return; }
      const step = () => {
        i++;
        setShown(i);
        const ch = full[i - 1] ?? '';
        if (v.speaker && v.speaker !== 'narr' && v.speaker !== 'letter' && v.speaker !== 'yuumi') audio.voiceBlip(v.speaker, ch, v.speaker === 'inner' ? 'soft' : MOOD_VOICE[v.expr ?? 'neutral']);
        if (i >= full.length) { setReady(true); return; }
        const pause = /[.!?]/.test(ch) ? ms * 9 : /[,;:–—]/.test(ch) ? ms * 4 : ch === '…' ? ms * 10 : ms;
        timer = window.setTimeout(step, pause);
      };
      step();
    };
    const pre = v.pause ?? 0;
    const t0 = window.setTimeout(start, pre);
    return () => { clearTimeout(t0); clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setArmed(true), v.choices ? ARM_CHOICES_MS : ARM_LINE_MS);
    return () => clearTimeout(t);
  }, [ready, key, v.choices]);

  const complete = useCallback(() => {
    if (!ready) { setShown(full.length); setReady(true); return true; }
    return false;
  }, [ready, full]);

  const next = useCallback(() => {
    if (complete()) return;
    if (!armed) return;
    if (!v.choices) ctl.advance();
  }, [complete, armed, v, ctl]);

  const choose = useCallback((index: number) => { if (armed) ctl.advance(index); }, [armed, ctl]);

  useEffect(() => { if (armed && v.choices) firstRef.current?.focus(); }, [armed, v.choices]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (ctl.overlay !== 'none') return;
      const k = e.key;
      if (k === 'l' || k === 'L') { onLog(); return; }
      const confirm = k === ' ' || k === 'Enter' || k === 'e' || k === 'E';
      // Gehaltene Taste wiederholt sich nicht durch den Dialog
      if (e.repeat && (confirm || /^[1-9]$/.test(k))) { e.preventDefault(); return; }
      if (v.choices && ready) {
        const n = v.choices.length;
        if (/^[1-9]$/.test(k) && +k <= n) { choose(v.choices[+k - 1].index); e.preventDefault(); return; }
        if (k === 'ArrowDown' || k === 's') { setSel((s) => (s + 1) % n); e.preventDefault(); return; }
        if (k === 'ArrowUp' || k === 'w') { setSel((s) => (s - 1 + n) % n); e.preventDefault(); return; }
        if (confirm) { choose(v.choices[sel].index); e.preventDefault(); return; }
        return;
      }
      if (confirm) { next(); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [v, ready, sel, next, choose, ctl, onLog]);

  const sp = v.speaker ?? 'narr';
  const isNpc = !!CHARACTERS[sp]?.look && sp !== 'sera';
  const name = sp === 'sera' ? 'Sera' : sp === 'inner' ? '' : sp === 'narr' || sp === 'letter' || sp === 'yuumi' ? '' : CHARACTERS[sp]?.short ?? '';
  const cls = `dlg dlg-${sp === 'inner' ? 'inner' : sp === 'narr' ? 'narr' : sp === 'letter' ? 'letter' : sp === 'yuumi' ? 'yuumi' : sp === 'sera' ? 'sera' : 'npc'}`;
  const talkPortrait = !isNpc && v.npc && (sp === 'sera' || sp === 'inner') ? v.npc : null;
  const g = ctl.game;
  const modernSera = g.chapter === 0 || (g.chapter === 1 && !g.flags['k1_dressed']);
  const plate = v.dlg === 'p_glass' && v.node !== 'n1' ? 'neg' : (v.dlg === 'k4_develop' && g.flags['g_plate_dev']) || (v.dlg === 'k4_window' && v.node !== 'n1') ? 'pos' : null;
  return (
    <>
    {plate && <div className={`plate-show ${plate}`} aria-hidden><Plate focus="all" /></div>}
    <div className={cls} onClick={(e) => { if ((e.target as HTMLElement).closest('button')) return; next(); }} role="dialog" aria-live="polite">
      {isNpc && <div className="portrait left"><Portrait id={sp} expr={v.expr ?? 'neutral'} /></div>}
      {!isNpc && talkPortrait && <div className="portrait left dim"><Portrait id={talkPortrait} expr="neutral" /></div>}
      {sp === 'sera' && <div className="portrait right"><Portrait id="sera" expr={v.expr ?? 'neutral'} chapter={g.chapter} modern={modernSera} /></div>}
      <div className="dlg-body">
        {name && <div className="nameplate">{name}{isNpc && CHARACTERS[sp]?.role ? <span className="role"> · {CHARACTERS[sp].role}</span> : null}</div>}
        {sp === 'yuumi' && <div className="nameplate cat">Yuumi</div>}
        <div className="dlg-text">
          <span>{full.slice(0, shown)}</span><span className="rest" aria-hidden>{full.slice(shown)}</span>
        </div>
        {v.choices && ready && (
          <div className={`choices${armed ? ' armed' : ''}`} role="menu">
            {v.choices.map((c, i) => (
              <button key={c.index} ref={i === 0 ? firstRef : undefined} className={`choice ${i === sel ? 'sel' : ''}`} onMouseMove={() => { if (i !== sel) setSel(i); }} onClick={() => choose(c.index)} onKeyUp={(e) => e.preventDefault()} role="menuitem">
                <span className="num">{i + 1}</span>{c.text}
              </button>
            ))}
          </div>
        )}
        {!v.choices && armed && <div className="more" aria-hidden>❧</div>}
      </div>
    </div>
    </>
  );
}

// ------------------------------------------------------------------ Gesprächsmenü
function TalkMenu({ ctl, npc }: { ctl: Controller; npc: NpcId }) {
  const { topics, smalltalk } = ctl.talkOptions(npc);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, [npc, topics.length]);
  const def = CHARACTERS[npc];
  return (
    <div className="talk" role="dialog" aria-label={`Gespräch mit ${def.name}`}>
      <div className="portrait left"><Portrait id={npc} expr="neutral" /></div>
      <div className="talk-body">
        <div className="nameplate">{def.name}<span className="role"> · {def.role}</span></div>
        <div className="talk-list">
          {topics.map((t, i) => <button key={t.id} ref={i === 0 ? first : undefined} className="choice" onClick={() => ctl.talkTopic(t.id)}>{t.title}</button>)}
          {smalltalk && <button ref={topics.length === 0 ? first : undefined} className="choice soft" onClick={() => ctl.talkSmall()}>Ein paar Worte wechseln</button>}
          <button className="choice soft" onClick={() => ctl.openPresent()}>Etwas vorlegen …</button>
          <button className="choice soft" onClick={() => ctl.closeTalk()}>Gehen</button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Vorlegen
function PresentPicker({ ctl }: { ctl: Controller }) {
  const items = ctl.presentables();
  const clues = items.filter((i) => CLUE_BY_ID[i]);
  const stats = items.filter((i) => STATEMENT_BY_ID[i]);
  const deds = items.filter((i) => DEDUCTION_BY_ID[i]);
  const npc = ctl.presentTarget;
  const Section = ({ title, ids, label }: { title: string; ids: string[]; label: (id: string) => string }) => ids.length ? (
    <section><h3>{title}</h3><div className="pgrid">{ids.map((id) => <button key={id} className="pitem" onClick={() => ctl.present(id)}>{label(id)}</button>)}</div></section>
  ) : null;
  return (
    <div className="sheet present" role="dialog" aria-label="Etwas vorlegen">
      <div className="sheet-head"><h2>{npc ? `${NPC_NAMES[npc]} etwas vorlegen` : 'Vorlegen'}</h2><button className="ghostbtn" onClick={() => { ctl.overlay = 'none'; ctl.emit(); }}>Zurück</button></div>
      <div className="sheet-body">
        {!items.length && <p className="hand">Ich habe noch nichts, das ich zeigen könnte.</p>}
        <Section title="Dinge & Schriftstücke" ids={clues} label={(id) => CLUE_BY_ID[id].name} />
        <Section title="Was andere gesagt haben" ids={stats} label={(id) => `${NPC_NAMES[STATEMENT_BY_ID[id].speaker as NpcId] ?? 'Sera'}: „${STATEMENT_BY_ID[id].text.slice(0, 60)}${STATEMENT_BY_ID[id].text.length > 60 ? '…' : ''}“`} />
        <Section title="Was ich mir erschlossen habe" ids={deds} label={(id) => DEDUCTION_BY_ID[id].question} />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Kleinigkeiten
function Toasts({ ctl }: { ctl: Controller }) {
  return (
    <div className="toasts" aria-live="polite">
      {ctl.toasts.map((t) => <div key={t.id} className={`toast ${t.kind}`}>{t.kind === 'hint' ? <span className="keyhint">{t.text}</span> : t.text}</div>)}
    </div>
  );
}

function ChapterCard({ ctl, n }: { ctl: Controller; n: number }) {
  const ch = ctl.c.chapters[n];
  const btn = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    btn.current?.focus();
    const id = window.setInterval(() => setStep((s) => s + 1), ctl.reduced ? 200 : 1600);
    return () => clearInterval(id);
  }, [ctl.reduced]);
  return (
    <div className="card" onClick={() => ctl.closeCard()}>
      <div className="card-inner">
        <div className="card-num">{n === 0 ? 'Prolog' : `Kapitel ${n}`}</div>
        <h1>{ch.title}</h1>
        {ch.day && <div className="card-day">{ch.day}</div>}
        <div className="card-intro">{ch.intro.map((l, i) => <p key={i} className={i < step ? 'on' : ''}>{l}</p>)}</div>
        <button ref={btn} className="linkbtn" onClick={() => ctl.closeCard()}>Weiter</button>
      </div>
    </div>
  );
}

function Menu({ ctl, onSettings, onLog }: { ctl: Controller; onSettings: () => void; onLog: () => void }) {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  return (
    <div className="modal" role="dialog" aria-label="Menü">
      <div className="panel">
        <h2>Averley Hall</h2>
        <button ref={first} className="choice" onClick={() => { ctl.overlay = 'none'; ctl.emit(); }}>Weiterspielen</button>
        <button className="choice" onClick={() => { ctl.overlay = 'notebook'; ctl.emit(); }}>Notizbuch</button>
        <button className="choice" onClick={() => { ctl.overlay = 'none'; ctl.emit(); onLog(); }}>Gesprächsprotokoll</button>
        <button className="choice" onClick={onSettings}>Einstellungen</button>
        <button className="choice" onClick={() => { ctl.save(); ctl.returnTo = 'menu'; ctl.overlay = 'io'; ctl.emit(); }}>Spielstand exportieren / importieren</button>
        <button className="choice soft" onClick={() => { ctl.save(); ctl.overlay = 'title'; ctl.emit(); }}>Zum Titel (Spiel ist gespeichert)</button>
        <p className="small">Steuerung: ← → / A D gehen · Klick: hingehen · E / Leertaste: ansehen, sprechen, weiter · N / Tab: Notizbuch · Y: Yuumi · L: Protokoll · Esc: Menü</p>
      </div>
    </div>
  );
}

function SettingsPanel({ settings, set, onClose }: { settings: Settings; set: (s: Settings) => void; onClose: () => void }) {
  const v = settings.volumes;
  const vol = (k: keyof typeof v, label: string) => (
    <label className="row">{label}
      <input type="range" min={0} max={1} step={0.05} value={v[k] as number} onChange={(e) => set({ ...settings, volumes: { ...v, [k]: +e.target.value } })} />
    </label>
  );
  const first = useRef<HTMLSelectElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  return (
    <div className="modal" role="dialog" aria-label="Einstellungen">
      <div className="panel settings">
        <h2>Einstellungen</h2>
        <label className="row">Textgeschwindigkeit
          <select ref={first} value={settings.textSpeed} onChange={(e) => set({ ...settings, textSpeed: e.target.value as Settings['textSpeed'] })}>
            {(['langsam', 'normal', 'schnell', 'sofort'] as const).map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label className="row">Textgröße
          <select value={settings.textSize} onChange={(e) => set({ ...settings, textSize: e.target.value as Settings['textSize'] })}>
            {(['klein', 'mittel', 'groß'] as const).map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label className="row check"><input type="checkbox" checked={settings.reducedMotion} onChange={(e) => set({ ...settings, reducedMotion: e.target.checked })} /> Bewegung reduzieren</label>
        {vol('master', 'Gesamtlautstärke')}
        {vol('voice', 'Stimmen')}
        {vol('music', 'Musik')}
        {vol('ambience', 'Umgebung')}
        {vol('sfx', 'Geräusche')}
        <label className="row check"><input type="checkbox" checked={v.muted} onChange={(e) => set({ ...settings, volumes: { ...v, muted: e.target.checked } })} /> Ton aus</label>
        <button className="choice" onClick={onClose}>Fertig</button>
      </div>
    </div>
  );
}

function SaveIO({ ctl }: { ctl: Controller }) {
  const [text, setText] = useState(ctl.exportSave());
  const [msg, setMsg] = useState('');
  return (
    <div className="modal" role="dialog" aria-label="Spielstand">
      <div className="panel io">
        <h2>Spielstand als Text</h2>
        <p className="small">Diesen Text kopieren, um den Stand zu sichern. Einen gesicherten Text einfügen und „Laden“ wählen, um weiterzuspielen.</p>
        <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} aria-label="Spielstand-Text" />
        <div className="rowbtns">
          <button className="choice" onClick={() => { try { navigator.clipboard?.writeText(text); setMsg('Kopiert.'); } catch { setMsg('Bitte von Hand markieren und kopieren.'); } }}>Kopieren</button>
          <button className="choice" onClick={() => { if (ctl.importSave(text)) setMsg(''); else setMsg('Dieser Text ist kein lesbarer Spielstand.'); }}>Laden</button>
          <button className="choice soft" onClick={() => { ctl.overlay = ctl.returnTo; ctl.emit(); }}>Zurück</button>
        </div>
        {msg && <p className="hand">{msg}</p>}
      </div>
    </div>
  );
}

function Log({ ctl, onClose }: { ctl: Controller; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); ref.current?.focus(); }, []);
  const lines = ctl.game.log;
  return (
    <div className="modal" role="dialog" aria-label="Gesprächsprotokoll" onClick={onClose}>
      <div className="panel log" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head"><h2>Gesprächsprotokoll</h2><button className="ghostbtn" onClick={onClose}>Schließen</button></div>
        <div className="logbody" ref={ref} tabIndex={0}>
          {lines.map((l, i) => {
            const n = l.s === 'inner' ? '' : l.s === 'narr' || l.s === 'letter' || l.s === 'yuumi' ? '' : l.s === 'sera' ? 'Sera' : CHARACTERS[l.s]?.short;
            return <p key={i} className={`log-${l.s === 'inner' ? 'inner' : l.s === 'narr' || l.s === 'yuumi' ? 'narr' : l.s === 'letter' ? 'letter' : 'speech'}`}>{n && <b>{n}: </b>}{l.t}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

function Title({ ctl, onSettings }: { ctl: Controller; onSettings: () => void }) {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); audio.setMusic('none'); }, []);
  const [confirmNew, setConfirmNew] = useState(false);
  return (
    <div className="title" role="dialog" aria-label="Titel">
      <div className="title-inner">
        <div className="title-kicker">Averley Hall · Somerset · 1877</div>
        <h1>Seras Fall</h1>
        <p className="title-blurb">Ein Novemberabend, eine Kiste alter Glasplatten, eine Katze namens Yuumi. Und ein Flüstern, das nicht aus diesem Jahrhundert kommt.</p>
        {ctl.corruptNotice && <p className="notice">Der letzte Spielstand ließ sich nicht lesen. Er wurde beiseitegelegt, damit nichts verloren geht. Du kannst neu beginnen oder einen exportierten Stand laden.</p>}
        <div className="title-btns">
          {ctl.hasSave && <button ref={first} className="choice big" onClick={() => { audio.initAudio(); ctl.continueGame(); }}>Fortsetzen</button>}
          {!confirmNew ? (
            <button ref={ctl.hasSave ? undefined : first} className={`choice big ${ctl.hasSave ? 'soft' : ''}`} onClick={() => { audio.initAudio(); if (ctl.hasSave) setConfirmNew(true); else ctl.startNew(); }}>Neues Spiel</button>
          ) : (
            <div className="confirm"><span className="hand">Der bisherige Stand wird überschrieben.</span>
              <button className="choice" onClick={() => ctl.startNew()}>Ja, neu beginnen</button>
              <button className="choice soft" onClick={() => setConfirmNew(false)}>Doch nicht</button>
            </div>
          )}
          <button className="choice soft" onClick={onSettings}>Einstellungen</button>
          <button className="choice soft" onClick={() => { ctl.returnTo = 'title'; ctl.overlay = 'io'; ctl.emit(); }}>Spielstand laden (Text)</button>
        </div>
        <p className="small">Kopfhörer empfohlen · Steuerung: ← → gehen, E ansehen/sprechen, N Notizbuch, Y Yuumi, Esc Menü</p>
      </div>
    </div>
  );
}

const ENDINGS: Record<string, [string, string]> = {
  echo: ['Das Echo', 'Es ist gehört worden.'],
  siegel: ['Das Siegel', 'Manche Wahrheiten bleiben in der Familie. Aber sie bleiben.'],
  zeugin: ['Die Zeugin', 'Wer zuhört, bleibt manchmal.'],
};

function Ending({ ctl }: { ctl: Controller }) {
  const e = ENDINGS[ctl.ending ?? ''] ?? ['Ende', ''];
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  return (
    <div className="card ending">
      <div className="card-inner">
        <div className="card-num">Ende</div>
        <h1>{e[0]}</h1>
        <div className="card-intro"><p className="on">{e[1]}</p></div>
        <p className="small">Es gibt drei Enden. Jedes ist ehrlich, jedes kostet etwas.</p>
        <button ref={first} className="linkbtn" onClick={() => { ctl.overlay = 'title'; ctl.emit(); }}>Zum Titel</button>
      </div>
    </div>
  );
}

export default App;

// ------------------------------------------------------------------ Titelmusik (nur Startbildschirm, leise)
function useTitleMusic(on: boolean, settings: Settings) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const v = settings.volumes;
  const vol = v.muted ? 0 : Math.min(1, 0.35 * v.master * v.music * 2);
  useEffect(() => {
    if (!on) { ref.current?.pause(); return; }
    let el = ref.current;
    if (!el) { el = new Audio(titleMusicUrl); el.loop = true; ref.current = el; }
    el.volume = vol;
    const tryPlay = () => { el!.play().then(() => remove()).catch(() => { /* Browser erlaubt Ton erst nach einer Eingabe */ }); };
    const remove = () => { window.removeEventListener('pointerdown', tryPlay); window.removeEventListener('keydown', tryPlay); };
    window.addEventListener('pointerdown', tryPlay); window.addEventListener('keydown', tryPlay);
    tryPlay();
    return () => { remove(); };
  }, [on, vol]);
  useEffect(() => () => { ref.current?.pause(); }, []);
}
