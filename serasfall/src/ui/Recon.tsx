// Endrekonstruktion: Sera ordnet die Nacht vor der Platte. Falsch = Zweifel in eigener Stimme, keine Strafe.
import { useEffect, useRef, useState } from 'react';
import type { Controller } from './controller';
import * as audio from './audio';

const TRAIL: Record<string, string> = {
  r1: 'clara', r2: 'lionel', r3: 'lionel', r4: 'tillyA', r5: 'tillyB', r6: 'tillyA', r7: 'girl', r8: 'lamp', r9: 'hobbes', r10: 'all', r11: 'girl', r12: 'woman',
};

export function Plate({ focus }: { focus: string }) {
  const on = (k: string) => (focus === k || focus === 'all' ? 1 : 0.28);
  return (
    <svg viewBox="0 0 600 400" className="plate" role="img" aria-label="Die entwickelte Glasplatte: Treppe mit Lichtspuren">
      <defs>
        <filter id="soft"><feGaussianBlur stdDeviation="2.2" /></filter>
        <filter id="softer"><feGaussianBlur stdDeviation="4" /></filter>
        <radialGradient id="pv" cx="50%" cy="50%" r="70%"><stop offset="0" stopColor="#2a2a2c" /><stop offset="1" stopColor="#060606" /></radialGradient>
      </defs>
      <rect width="600" height="400" fill="url(#pv)" />
      {/* Treppe, Galerie, Türen – grau auf Schwarz */}
      <g stroke="#6a6a6a" strokeWidth="2" fill="none" opacity="0.55" filter="url(#soft)">
        <path d="M60 110 L600 110" /><path d="M60 128 L600 128" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <path key={i} d={`M${200 + i * 18} ${360 - i * 19} l60 0`} />)}
        <path d="M200 360 L416 132" strokeWidth="4" />
        <rect x="470" y="170" width="44" height="190" /><rect x="120" y="170" width="40" height="190" />
        <rect x="360" y="150" width="60" height="70" rx="30" />
      </g>
      {/* Lichtspuren */}
      <g fill="none" strokeLinecap="round" filter="url(#soft)">
        <path d="M430 118 L410 138 L240 330 L470 330" stroke="#dcdcdc" strokeWidth="2.5" opacity={on('clara') * 0.8} strokeDasharray="6 5" />
        <path d="M480 336 L250 322 L420 132" stroke="#dcdcdc" strokeWidth="2" opacity={on('clara') * 0.6} strokeDasharray="4 6" />
        <path d="M600 350 L480 346" stroke="#cfcfcf" strokeWidth="2.5" opacity={on('lionel') * 0.8} strokeDasharray="5 5" />
        <path d="M140 360 L300 352 L470 344" stroke="#e6e6e6" strokeWidth="1.8" opacity={on('tillyA') * 0.85} strokeDasharray="3 4" />
        <path d="M470 344 L230 336 L410 140 L540 116" stroke="#e6e6e6" strokeWidth="1.8" opacity={on('tillyB') * 0.85} strokeDasharray="3 4" />
        <path d="M200 356 L418 126" stroke="#f4f4f4" strokeWidth="12" opacity={on('lamp') * 0.5} filter="url(#softer)" />
        <path d="M140 362 L100 372" stroke="#e0e0e0" strokeWidth="2" opacity={on('hobbes') * 0.8} />
      </g>
      <circle cx="540" cy="116" r="10" fill="#f0f0f0" opacity={on('tillyB') * 0.8} filter="url(#softer)" />
      {/* Das Mädchen auf der Stufe */}
      <g opacity={on('girl') * 0.9} filter="url(#soft)">
        <circle cx="300" cy="266" r="7" fill="#fff" filter="url(#softer)" />
        <path d="M278 290 Q286 262 296 256 Q306 262 312 292 Z" fill="#b8b8b8" />
        <ellipse cx="294" cy="250" rx="9" ry="8" fill="#d8d8d8" />
        <path d="M284 246 Q294 236 304 246" fill="#f2f2f2" />
      </g>
      {/* Die blasse Frau mit der Katze */}
      <g opacity={on('woman') * 0.55} filter="url(#softer)">
        <path d="M326 294 Q334 256 346 250 Q358 256 366 296 Z" fill="#9a9a9a" />
        <ellipse cx="346" cy="242" rx="9" ry="10" fill="#e8e8e8" />
        <ellipse cx="344" cy="283" rx="10" ry="7" fill="#8a8a8a" />
        <path d="M338 278 l3 -6 l3 6 M346 278 l3 -6 l3 6" stroke="#8a8a8a" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function Recon({ ctl }: { ctl: Controller }) {
  const qs = ctl.c.recon;
  const firstOpen = qs.findIndex((q) => ctl.game.recon[q.id] === undefined);
  const [idx, setIdx] = useState(firstOpen < 0 ? qs.length : firstOpen);
  const [line, setLine] = useState('');
  const [ok, setOk] = useState<boolean | null>(null);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, [idx, ok]);
  const q = qs[idx];
  if (!q) {
    return (
      <div className="recon" role="dialog" aria-label="Rekonstruktion">
        <div className="recon-inner">
          <Plate focus="all" />
          <p className="hand big">So war es. Jetzt weiß ich es.</p>
          <button ref={first} className="linkbtn" onClick={() => ctl.finishRecon()}>Das Notizbuch zuklappen</button>
        </div>
      </div>
    );
  }
  return (
    <div className="recon" role="dialog" aria-label="Rekonstruktion der Nacht">
      <div className="recon-inner">
        <div className="recon-head">Die Nacht, noch einmal · {idx + 1} von {qs.length}</div>
        <Plate focus={TRAIL[q.id] ?? 'all'} />
        <p className="recon-q">{q.prompt}</p>
        {ok !== true && (
          <div className="recon-opts">
            {q.options.map((o, i) => (
              <button key={i} ref={i === 0 ? first : undefined} className="choice" onClick={() => {
                const r = ctl.reconAnswer(q.id, i);
                setOk(r.ok); setLine(r.line);
                audio.sfx(r.ok ? 'pen' : 'page');
              }}><span className="num">{i + 1}</span>{o}</button>
            ))}
          </div>
        )}
        {line && <p className={`hand ${ok ? '' : 'doubt'}`}>{line}</p>}
        {ok === true && <button ref={first} className="linkbtn" onClick={() => { setIdx(idx + 1); setOk(null); setLine(''); }}>Weiter</button>}
      </div>
    </div>
  );
}
