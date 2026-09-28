// Das Notizbuch in Seras Handschrift: Gedanken (Schlussfolgerungen), Personen, Orte, Aussagen, Dinge, Zeitleiste.
import { useState } from 'react';
import type { Controller } from './controller';
import { PERSON_NOTES, PLACE_NOTES, TIMELINE } from '../content/notebook';
import { CLUES } from '../content/clues';
import { STATEMENTS } from '../content/statements';
import { NPC_NAMES } from '../content/characters';
import { visibleDeductions } from '../engine/deduce';
import type { Deduction, NpcId } from '../engine/types';
import * as audio from './audio';

type Tab = 'gedanken' | 'personen' | 'orte' | 'aussagen' | 'dinge' | 'zeit';
const TABS: [Tab, string][] = [['gedanken', 'Gedanken'], ['personen', 'Personen'], ['orte', 'Orte'], ['aussagen', 'Aussagen'], ['dinge', 'Dinge'], ['zeit', 'Zeitleiste']];

export function Notebook({ ctl, onClose }: { ctl: Controller; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('gedanken');
  const g = ctl.game;
  return (
    <div className="notebook" role="dialog" aria-label="Notizbuch">
      <div className="book">
        <nav className="tabs" role="tablist">
          {TABS.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={`tab ${tab === id ? 'on' : ''}`} onClick={() => { setTab(id); audio.sfx('page'); }}>
              {label}{id === 'gedanken' && ctl.openCount() > 0 ? <span className="dot" aria-label="offene Fragen"> •</span> : null}
            </button>
          ))}
          <button className="tab close" onClick={onClose}>Schließen</button>
        </nav>
        <div className="page">
          {tab === 'gedanken' && <Thoughts ctl={ctl} />}
          {tab === 'personen' && (
            <div className="entries">
              {(Object.keys(PERSON_NOTES) as NpcId[]).filter((n) => ctl.cond(PERSON_NOTES[n].met)).map((n) => (
                <article key={n}><h3>{PERSON_NOTES[n].title}</h3>{PERSON_NOTES[n].notes.filter((x) => ctl.cond(x.cond)).map((x, i) => <p key={i}>{x.text}</p>)}</article>
              ))}
            </div>
          )}
          {tab === 'orte' && (
            <div className="entries">
              {Object.entries(PLACE_NOTES).filter(([l]) => g.flags[`v_${l}`] || g.loc === l).map(([l, t]) => (
                <article key={l}><h3>{ctl.c.locations[l]?.name}</h3><p>{t}</p></article>
              ))}
            </div>
          )}
          {tab === 'aussagen' && (
            <div className="entries">
              {!Object.keys(g.statements).length && <p>Noch nichts, das jemand gesagt hat und das ich festhalten wollte.</p>}
              {STATEMENTS.filter((s) => g.statements[s.id]).map((s) => (
                <article key={s.id} className="stmt"><div className="when">{g.statements[s.id]} · {NPC_NAMES[s.speaker as NpcId] ?? 'Sera'}</div><p>„{s.text}“</p></article>
              ))}
            </div>
          )}
          {tab === 'dinge' && (
            <div className="entries">
              {CLUES.filter((c) => g.clues[c.id] && c.kind !== 'erinnerung').map((c) => (
                <article key={c.id}><h3>{c.name}</h3><p>{c.note}</p></article>
              ))}
              {CLUES.some((c) => g.clues[c.id] && c.kind === 'erinnerung') && <h2 className="sub">Was ich auf der Treppe wahrgenommen habe</h2>}
              {CLUES.filter((c) => g.clues[c.id] && c.kind === 'erinnerung').map((c) => (
                <article key={c.id} className="memory"><h3>{c.name}</h3><p>{c.note}</p></article>
              ))}
            </div>
          )}
          {tab === 'zeit' && (
            <div className="entries timeline">
              <p className="intro">Die Nacht von Dienstag auf Mittwoch, 13./14. November – soweit ich sie kenne.</p>
              {TIMELINE.filter((e) => ctl.cond(e.cond)).map((e, i) => <div key={i} className="tl"><span className="t">{e.time}</span><span>{e.text}</span></div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Thoughts({ ctl }: { ctl: Controller }) {
  const list = visibleDeductions(ctl.game, ctl.c);
  if (!list.length) return <div className="entries"><p>Noch keine Fragen, die sich stellen ließen. Ich sollte mich umsehen.</p></div>;
  const open = list.filter((d) => !ctl.game.deductions[d.id]);
  const done = list.filter((d) => ctl.game.deductions[d.id]);
  return (
    <div className="entries">
      {open.length > 0 && <h2 className="sub">Offene Fragen</h2>}
      {open.map((d) => <Question key={d.id} ctl={ctl} d={d} />)}
      {done.length > 0 && <h2 className="sub">Was ich weiß</h2>}
      {done.map((d) => <article key={d.id} className="solved"><h3>{d.question}</h3><p>{d.result}</p></article>)}
    </div>
  );
}

function Question({ ctl, d }: { ctl: Controller; d: Deduction }) {
  const [ans, setAns] = useState<number[]>(d.slots.map(() => -1));
  const [line, setLine] = useState('');
  const [kind, setKind] = useState('');
  const parts = d.template.split(/(\{\d\})/);
  return (
    <article className={`question ${d.contradiction ? 'contra' : ''}`}>
      <h3>{d.contradiction ? 'Widerspruch: ' : ''}{d.question}</h3>
      <p className="template">
        {parts.map((p, i) => {
          const m = p.match(/^\{(\d)\}$/);
          if (!m) return <span key={i}>{p}</span>;
          const si = +m[1];
          return (
            <select key={i} aria-label={`Lücke ${si + 1}`} value={ans[si]} onChange={(e) => { const a = [...ans]; a[si] = +e.target.value; setAns(a); setLine(''); }}>
              <option value={-1}>…</option>
              {d.slots[si].options.map((o, oi) => <option key={oi} value={oi}>{o}</option>)}
            </select>
          );
        })}
      </p>
      <div className="qbtns">
        <button className="linkbtn" disabled={ans.some((a) => a < 0)} onClick={() => { const r = ctl.deduce(d.id, ans); setKind(r.kind); setLine(r.line); if (r.kind !== 'solved') audio.sfx('pen'); }}>Festhalten</button>
        <button className="linkbtn soft" onClick={() => { setKind('hint'); setLine(ctl.hint(d.id)); }}>Nachdenken …</button>
      </div>
      {line && <p className={`feedback ${kind}`}>{line}</p>}
    </article>
  );
}
