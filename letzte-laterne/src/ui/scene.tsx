// Atmosphärische Hintergründe: Himmel, Silhouetten je Gebiet, treibender Nebel, Partikel, Licht.
// Alles aus CSS und prozedural erzeugten SVG-Pfaden – keine Bilddateien nötig.
import { useMemo } from 'react';
import { Rng } from '../sim/rng';

export type SceneKind = 'title' | 'hub' | 'vorstadt' | 'archiv' | 'herz' | 'camp' | 'ending';
type Particle = 'embers' | 'motes' | 'fireflies' | 'sparks' | 'snow';

const PARTICLES: Record<SceneKind, Particle> = {
  title: 'embers',
  hub: 'motes',
  vorstadt: 'fireflies',
  archiv: 'motes',
  herz: 'sparks',
  camp: 'embers',
  ending: 'fireflies',
};

/** Dächer der versunkenen Vorstadt mit Glockenturm. */
function rooftops(seed: number, baseY: number, h: number, tower: boolean): string {
  const rng = new Rng(seed);
  let d = `M0 200 L0 ${baseY}`;
  let x = 0;
  let towerDone = false;
  while (x < 1000) {
    const w = 30 + rng.int(50);
    const top = baseY - h * (0.35 + rng.next() * 0.65);
    if (tower && !towerDone && x > 600) {
      towerDone = true;
      // Glockenturm
      // Glockenturm mit Spitzdach und Schallöffnung
      d += ` L${x} ${baseY - h * 1.2} L${x + 6} ${baseY - h * 1.2} L${x + 6} ${baseY - h * 2.1} L${x + 4} ${baseY - h * 2.1} L${x + 20} ${baseY - h * 2.9} L${x + 36} ${baseY - h * 2.1} L${x + 34} ${baseY - h * 2.1} L${x + 34} ${baseY - h * 1.2} L${x + 40} ${baseY - h * 1.2}`;
      x += 40;
      continue;
    }
    const gable = rng.next() < 0.6;
    if (gable) d += ` L${x} ${top} L${x + w / 2} ${top - 10 - rng.int(14)} L${x + w} ${top}`;
    else d += ` L${x} ${top} L${x + w} ${top}`;
    if (rng.next() < 0.3) d += ` L${x + w - 8} ${top} L${x + w - 8} ${top - 12} L${x + w - 3} ${top - 12} L${x + w - 3} ${top}`;
    x += w;
  }
  return d + ` L1000 ${baseY} L1000 200 Z`;
}

/** Gotische Bögen des Archivs. */
function archive(): string {
  let d = 'M0 0 L1000 0 L1000 200 L0 200 Z ';
  // Aussparungen (Bögen) werden als Löcher gezeichnet (evenodd)
  for (let x = 20; x < 1000; x += 200) {
    d += `M${x + 20} 200 L${x + 20} 70 Q${x + 90} -10 ${x + 160} 70 L${x + 160} 200 Z `;
  }
  return d;
}

interface Book {
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}
/** Bücherregale in den Bögen – Buchrücken in gedeckten Farben. */
function books(seed: number): { shelves: string; books: Book[] } {
  const rng = new Rng(seed);
  const colors = ['#3a2440', '#2a2c50', '#4a2a2a', '#2a3a3a', '#3a3020', '#452a4a'];
  let shelves = '';
  const out: Book[] = [];
  for (let x = 40; x < 1000; x += 200) {
    for (let y = 95; y < 200; y += 26) {
      shelves += `M${x} ${y} L${x + 140} ${y} `;
      let bx = x + 2;
      while (bx < x + 136) {
        const w = 3 + rng.int(4);
        const h = 12 + rng.int(10);
        if (rng.next() < 0.9) out.push({ x: bx, y: y - h, w, h, c: rng.pick(colors) });
        bx += w + (rng.next() < 0.1 ? 6 : 0.6);
      }
    }
  }
  return { shelves, books: out };
}

/** Tropfsteinhöhle im Herz der Laterne. */
function cavern(seed: number): { top: string; bottom: string } {
  const rng = new Rng(seed);
  let top = 'M0 0 L0 30';
  for (let x = 0; x < 1000; x += 20 + rng.int(30)) top += ` L${x} ${20 + rng.int(20)} L${x + 8} ${50 + rng.int(60)} L${x + 16} ${20 + rng.int(15)}`;
  top += ' L1000 30 L1000 0 Z';
  let bottom = 'M0 200 L0 170';
  for (let x = 0; x < 1000; x += 30 + rng.int(40)) bottom += ` L${x} ${165 + rng.int(10)} L${x + 12} ${120 + rng.int(40)} L${x + 24} ${165 + rng.int(10)}`;
  bottom += ' L1000 170 L1000 200 Z';
  return { top, bottom };
}

function Particles({ type, count = 26 }: { type: Particle; count?: number }) {
  const items = useMemo(() => {
    const rng = new Rng(count * 31 + type.length);
    return Array.from({ length: count }, () => ({
      left: rng.next() * 100,
      top: rng.next() * 100,
      delay: -rng.next() * 12,
      dur: 7 + rng.next() * 9,
      size: 2 + rng.next() * 3,
      drift: (rng.next() - 0.5) * 80,
    }));
  }, [type, count]);
  return (
    <div className={`particles p-${type}`} aria-hidden>
      {items.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export function Scene({ kind, battle = false, boss = false }: { kind: SceneKind; battle?: boolean; boss?: boolean }) {
  const cav = useMemo(() => cavern(7), []);
  const far = useMemo(() => rooftops(11, 150, 60, true), []);
  const near = useMemo(() => rooftops(23, 185, 45, false), []);
  const arch = useMemo(() => archive(), []);
  const shelf = useMemo(() => books(5), []);
  return (
    <div className={`scene scene-${kind} ${battle ? 'battle' : ''} ${boss ? 'boss' : ''}`} aria-hidden>
      <div className="scene-sky" />
      {(kind === 'title' || kind === 'vorstadt' || kind === 'ending' || kind === 'camp') && <div className="scene-moon" />}
      {(kind === 'title' || kind === 'vorstadt' || kind === 'camp' || kind === 'ending') && <div className="scene-stars" />}
      {(kind === 'title' || kind === 'vorstadt' || kind === 'ending') && (
        <svg className="scene-layer far" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path d={far} />
        </svg>
      )}
      {kind === 'archiv' && (
        <>
          <div className="scene-rosette" />
          <svg className="scene-layer arch" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <g className="books">
              {shelf.books.map((b, i) => (
                <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} />
              ))}
            </g>
            <path d={shelf.shelves} className="shelves" />
            <path d={arch} fillRule="evenodd" className="arches" />
          </svg>
        </>
      )}
      {kind === 'herz' && (
        <>
          <div className="scene-core" />
          <svg className="scene-layer cave" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path d={cav.top} />
            <path d={cav.bottom} />
          </svg>
        </>
      )}
      {kind === 'hub' && (
        <div className="hub-room">
          <div className="hub-window">
            <div className="hub-window-moon" />
            <div className="hub-window-fog" />
          </div>
          <div className="hub-beam b1" />
          <div className="hub-beam b2" />
        </div>
      )}
      <div className="scene-fog f1" />
      <div className="scene-fog f2" />
      {(kind === 'title' || kind === 'vorstadt' || kind === 'ending' || kind === 'camp') && (
        <svg className="scene-layer near" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path d={near} />
        </svg>
      )}
      <div className="scene-fog f3" />
      {(kind === 'hub' || kind === 'title') && <div className="scene-lantern-glow" />}
      {kind === 'camp' && <div className="scene-fire-glow" />}
      <Particles type={PARTICLES[kind]} />
      <div className="scene-vignette" />
    </div>
  );
}

export function sceneForExpedition(exp: 1 | 2 | 3): SceneKind {
  return exp === 1 ? 'vorstadt' : exp === 2 ? 'archiv' : 'herz';
}
