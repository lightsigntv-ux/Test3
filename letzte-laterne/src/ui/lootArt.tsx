// Gemalte SVG-Illustrationen für alle Gegenstände und Relikte (eigene Arbeit, keine Fremdlizenzen).
import { useId, type ReactNode } from 'react';
import type { ItemId, RelicId } from '../content/types';

type Draw = (g: (name: string) => string) => ReactNode;

// Wiederverwendbare Verläufe
function Defs({ g }: { g: (n: string) => string }) {
  return (
    <defs>
      <linearGradient id={g('gold')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff1b8" />
        <stop offset="0.45" stopColor="#e7b64a" />
        <stop offset="1" stopColor="#8a5a14" />
      </linearGradient>
      <linearGradient id={g('silver')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.5" stopColor="#b9c4d4" />
        <stop offset="1" stopColor="#5d6a80" />
      </linearGradient>
      <linearGradient id={g('bronze')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f3c58a" />
        <stop offset="0.5" stopColor="#b0713a" />
        <stop offset="1" stopColor="#5a3418" />
      </linearGradient>
      <linearGradient id={g('iron')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8b95a8" />
        <stop offset="1" stopColor="#2c3342" />
      </linearGradient>
      <linearGradient id={g('wood')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#c08850" />
        <stop offset="1" stopColor="#5c3418" />
      </linearGradient>
      <radialGradient id={g('ember')} cx="0.5" cy="0.45" r="0.6">
        <stop offset="0" stopColor="#fffbe0" />
        <stop offset="0.3" stopColor="#ffd05a" />
        <stop offset="0.7" stopColor="#ff6a1a" />
        <stop offset="1" stopColor="#8a1a08" />
      </radialGradient>
      <radialGradient id={g('glowO')} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffb040" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ff6a1a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={g('glowB')} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#9fd8ff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#4a8adf" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={g('glowV')} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#e0b8ff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#8a4adf" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={g('glowW')} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff8e0" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffe0a0" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={g('crystal')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f4e2ff" />
        <stop offset="0.5" stopColor="#a86ef0" />
        <stop offset="1" stopColor="#452080" />
      </linearGradient>
      <linearGradient id={g('glass')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#bfe8ff" stopOpacity="0.55" />
        <stop offset="0.5" stopColor="#e8f7ff" stopOpacity="0.2" />
        <stop offset="1" stopColor="#7fb8e0" stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id={g('cloth')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset="1" stopColor="#d9c9ae" />
      </linearGradient>
      <linearGradient id={g('lava')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffec9a" />
        <stop offset="0.5" stopColor="#ff7a1a" />
        <stop offset="1" stopColor="#a01808" />
      </linearGradient>
      <linearGradient id={g('shieldB')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8fb8f0" />
        <stop offset="1" stopColor="#1f3a6a" />
      </linearGradient>
      <linearGradient id={g('parch')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fbf0d4" />
        <stop offset="1" stopColor="#c9a86a" />
      </linearGradient>
    </defs>
  );
}

const sparks = (g: (n: string) => string, pts: [number, number, number][], color = '#ffd05a') =>
  pts.map(([x, y, r], i) => (
    <g key={i} className="loot-spark" style={{ animationDelay: `${i * 0.35}s` }}>
      <circle cx={x} cy={y} r={r * 2.4} fill={`url(#${g('glowO')})`} />
      <circle cx={x} cy={y} r={r} fill={color} />
    </g>
  ));

const ITEM_ART: Record<ItemId, Draw> = {
  zunderring: (g) => (
    <>
      <circle cx="48" cy="44" r="30" fill={`url(#${g('glowO')})`} opacity="0.5" />
      <ellipse cx="48" cy="58" rx="24" ry="20" fill="none" stroke={`url(#${g('gold')})`} strokeWidth="9" />
      <ellipse cx="48" cy="58" rx="24" ry="20" fill="none" stroke="#fff3c0" strokeWidth="1.5" strokeDasharray="6 30" opacity="0.8" />
      <path d="M36 40 L48 26 L60 40 L48 50 Z" fill={`url(#${g('gold')})`} />
      <path d="M40 40 L48 30 L56 40 L48 47 Z" fill={`url(#${g('ember')})`} className="loot-pulse" />
      <path d="M48 24 Q42 14 48 6 Q50 14 56 12 Q52 20 48 24 Z" fill="#ff9a2a" className="loot-flicker" />
      {sparks(g, [[26, 30, 1.6], [70, 26, 1.3], [66, 44, 1.1]])}
    </>
  ),
  schildspange: (g) => (
    <>
      <circle cx="48" cy="48" r="30" fill={`url(#${g('glowB')})`} opacity="0.45" />
      <circle cx="48" cy="50" r="28" fill={`url(#${g('bronze')})`} stroke="#3a2210" strokeWidth="2" />
      <circle cx="48" cy="50" r="20" fill="none" stroke="#f3c58a" strokeWidth="2" opacity="0.7" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={48 + 24 * Math.cos((a * Math.PI) / 180)} cy={50 + 24 * Math.sin((a * Math.PI) / 180)} r="2.2" fill="#fff1c8" />
      ))}
      <path d="M48 36 L58 50 L48 64 L38 50 Z" fill="#4a8adf" stroke="#dff0ff" strokeWidth="1.5" />
      <path d="M48 38 L54 48 L48 52 L42 48 Z" fill="#bfe4ff" opacity="0.8" />
      <path d="M26 36 Q34 26 44 24" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.55" strokeLinecap="round" />
    </>
  ),
  stimmgabel: (g) => (
    <>
      <circle cx="48" cy="40" r="30" fill={`url(#${g('glowV')})`} opacity="0.35" />
      <path d="M36 12 L36 46 Q36 60 48 60 Q60 60 60 46 L60 12" fill="none" stroke={`url(#${g('silver')})`} strokeWidth="7" strokeLinecap="round" />
      <rect x="45" y="58" width="6" height="30" rx="3" fill={`url(#${g('silver')})`} />
      <circle cx="48" cy="88" r="5" fill={`url(#${g('silver')})`} />
      {[14, 22, 30].map((r, i) => (
        <g key={r} className="loot-wave" style={{ animationDelay: `${i * 0.4}s` }}>
          <path d={`M${24 - i * 4} ${26 - r / 3} Q${16 - i * 4} 30 ${24 - i * 4} ${34 + r / 3}`} stroke="#d6b8ff" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d={`M${72 + i * 4} ${26 - r / 3} Q${80 + i * 4} 30 ${72 + i * 4} ${34 + r / 3}`} stroke="#d6b8ff" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  funkenfaenger: (g) => (
    <>
      <circle cx="48" cy="52" r="30" fill={`url(#${g('glowO')})`} opacity="0.55" />
      <path d="M48 8 L48 18" stroke="#6a7384" strokeWidth="3" />
      <circle cx="48" cy="8" r="4" fill="none" stroke="#8b95a8" strokeWidth="2.5" />
      <path d="M28 30 Q48 16 68 30 L66 76 Q48 84 30 76 Z" fill="#1c1410" stroke={`url(#${g('iron')})`} strokeWidth="3" />
      {[36, 44, 52, 60].map((x) => (
        <path key={x} d={`M${x} 24 L${x} 80`} stroke={`url(#${g('iron')})`} strokeWidth="2" />
      ))}
      <path d="M29 48 Q48 42 67 48 M30 64 Q48 58 66 64" stroke={`url(#${g('iron')})`} strokeWidth="2" fill="none" />
      <circle cx="48" cy="58" r="11" fill={`url(#${g('ember')})`} className="loot-pulse" />
      {sparks(g, [[40, 46, 2], [56, 42, 1.6], [44, 70, 1.4], [58, 66, 1.8], [22, 22, 1.2], [76, 28, 1.3]])}
    </>
  ),
  ascheglas: (g) => (
    <>
      <circle cx="48" cy="56" r="30" fill={`url(#${g('glowO')})`} opacity="0.5" />
      <rect x="40" y="8" width="16" height="8" rx="2" fill={`url(#${g('wood')})`} />
      <path d="M42 16 L42 30 Q22 40 24 62 Q26 86 48 86 Q70 86 72 62 Q74 40 54 30 L54 16 Z" fill="#1a1016" />
      <path d="M26 60 Q28 84 48 84 Q68 84 70 60 Q60 66 48 62 Q36 58 26 60 Z" fill={`url(#${g('lava')})`} className="loot-pulse" />
      <path d="M42 16 L42 30 Q22 40 24 62 Q26 86 48 86 Q70 86 72 62 Q74 40 54 30 L54 16 Z" fill={`url(#${g('glass')})`} stroke="#bfe8ff" strokeWidth="1.8" />
      <path d="M32 44 Q30 56 34 66" stroke="#fff" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
      {sparks(g, [[44, 52, 1.4], [54, 46, 1.1], [50, 38, 0.9]])}
    </>
  ),
  dornenschild: (g) => (
    <>
      <path d="M48 8 Q70 14 80 18 L76 50 Q70 76 48 90 Q26 76 20 50 L16 18 Q26 14 48 8 Z" fill={`url(#${g('shieldB')})`} stroke="#0e1a30" strokeWidth="2.5" />
      <path d="M48 14 Q66 19 74 22 L71 50 Q66 71 48 83 Q30 71 25 50 L22 22 Q30 19 48 14 Z" fill="none" stroke="#9fc4f0" strokeWidth="1.5" opacity="0.6" />
      <path d="M22 30 Q40 44 30 60 Q44 56 48 74 Q52 56 66 60 Q56 44 74 30" stroke="#2f6a2a" strokeWidth="4" fill="none" strokeLinecap="round" />
      {[
        [28, 38, -40],
        [36, 56, 30],
        [60, 56, -30],
        [68, 38, 40],
        [48, 70, 0],
      ].map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y} l-4 -2 l4 -9 l4 9 z`} fill="#c9e8a0" stroke="#2f6a2a" strokeWidth="1" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <path d="M30 20 Q40 16 48 15" stroke="#fff" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" fill="none" />
    </>
  ),
  sanftesLeinen: (g) => (
    <>
      <circle cx="48" cy="50" r="32" fill={`url(#${g('glowW')})`} opacity="0.55" />
      <path d="M16 56 Q30 42 50 48 Q70 54 82 40 L80 62 Q66 76 46 70 Q28 64 18 76 Z" fill={`url(#${g('cloth')})`} stroke="#b89e74" strokeWidth="1.5" />
      <path d="M20 34 Q34 22 52 28 Q70 34 80 24 L80 42 Q68 54 50 48 Q32 42 18 54 Z" fill={`url(#${g('cloth')})`} stroke="#b89e74" strokeWidth="1.5" />
      <path d="M26 40 Q40 34 54 38 M28 62 Q42 58 56 62" stroke="#d9c9ae" strokeWidth="1.5" fill="none" />
      <path d="M46 26 L50 74" stroke="#e98b7a" strokeWidth="5" />
      <path d="M50 50 Q60 40 64 50 Q58 54 50 50 Q40 40 36 50 Q42 54 50 50 Z" fill="#e98b7a" />
      <path d="M48 12 L50 18 L56 18 L51 22 L53 28 L48 24 L43 28 L45 22 L40 18 L46 18 Z" fill="#fff3c0" className="loot-pulse" />
    </>
  ),
  taktgeber: (g) => (
    <>
      <circle cx="48" cy="50" r="30" fill={`url(#${g('glowV')})`} opacity="0.35" />
      <path d="M34 12 L62 12 L76 86 L20 86 Z" fill={`url(#${g('wood')})`} stroke="#3a200c" strokeWidth="2" />
      <path d="M38 18 L58 18 L68 80 L28 80 Z" fill="#2a1a10" />
      {[30, 42, 54, 66].map((y) => (
        <path key={y} d={`M${38 + (y - 18) * 0.16} ${y} l6 0`} stroke="#e7b64a" strokeWidth="1.5" />
      ))}
      <g className="loot-metronome">
        <path d="M48 74 L48 22" stroke={`url(#${g('silver')})`} strokeWidth="3" />
        <rect x="42" y="34" width="12" height="9" rx="2" fill={`url(#${g('gold')})`} />
      </g>
      <circle cx="48" cy="74" r="4" fill={`url(#${g('gold')})`} />
    </>
  ),
  resonanzkristall: (g) => (
    <>
      <circle cx="48" cy="50" r="34" fill={`url(#${g('glowV')})`} opacity="0.6" className="loot-pulse" />
      <ellipse cx="48" cy="56" rx="34" ry="10" fill="none" stroke="#d6b8ff" strokeWidth="1.5" opacity="0.7" className="loot-ring" />
      <path d="M48 8 L62 36 L56 80 L40 80 L34 36 Z" fill={`url(#${g('crystal')})`} stroke="#f4e2ff" strokeWidth="1.5" />
      <path d="M48 8 L50 80 M34 36 L62 36" stroke="#f4e2ff" strokeWidth="1" opacity="0.6" />
      <path d="M28 50 L36 40 L40 74 L30 78 Z" fill={`url(#${g('crystal')})`} stroke="#f4e2ff" strokeWidth="1.2" opacity="0.9" />
      <path d="M68 48 L60 40 L57 76 L67 78 Z" fill={`url(#${g('crystal')})`} stroke="#f4e2ff" strokeWidth="1.2" opacity="0.9" />
      <path d="M44 14 L40 34" stroke="#fff" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
    </>
  ),
  glutherz: (g) => (
    <>
      <circle cx="48" cy="52" r="40" fill={`url(#${g('glowO')})`} className="loot-pulse" />
      <path d="M48 84 Q18 62 16 40 Q16 22 32 20 Q42 20 48 30 Q54 20 64 20 Q80 22 80 40 Q78 62 48 84 Z" fill="#2a0c06" stroke="#ff8a2a" strokeWidth="2.5" />
      <path d="M48 78 Q24 60 22 42 Q22 28 33 26 Q42 26 48 36 Q54 26 63 26 Q74 28 74 42 Q72 60 48 78 Z" fill={`url(#${g('lava')})`} className="loot-pulse" />
      <path d="M30 40 L40 48 L36 58 L46 62 M62 36 L56 48 L64 56 M48 44 L50 56" stroke="#3a0c04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M34 20 Q30 8 38 2 Q38 12 44 14 M60 18 Q66 8 60 0 Q56 10 52 12" stroke="#ffd05a" strokeWidth="3" fill="none" strokeLinecap="round" className="loot-flicker" />
      {sparks(g, [[18, 70, 1.6], [80, 70, 1.8], [86, 30, 1.2], [10, 34, 1.3], [48, 92, 1.4]])}
    </>
  ),
  eidDesBollwerks: (g) => (
    <>
      <circle cx="48" cy="48" r="42" fill={`url(#${g('glowW')})`} className="loot-pulse" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M48 48 L46 4 L50 4 Z" fill="#ffe7a0" opacity="0.35" transform={`rotate(${i * 30} 48 48)`} className="loot-rays" />
      ))}
      <path d="M22 12 L74 12 L74 52 Q74 76 48 90 Q22 76 22 52 Z" fill={`url(#${g('shieldB')})`} stroke={`url(#${g('gold')})`} strokeWidth="4" />
      <path d="M48 14 L48 88 M24 44 L72 44" stroke={`url(#${g('gold')})`} strokeWidth="3" />
      <rect x="40" y="26" width="16" height="22" rx="3" fill="#2a1a08" stroke={`url(#${g('gold')})`} strokeWidth="2" />
      <rect x="43" y="30" width="10" height="14" rx="2" fill={`url(#${g('ember')})`} className="loot-pulse" />
      <path d="M14 70 Q10 50 18 32 M82 70 Q86 50 78 32" stroke="#7ab86a" strokeWidth="3" fill="none" />
      {[40, 50, 60].map((y) => (
        <g key={y}>
          <ellipse cx={14 + (y - 40) * 0.1} cy={y} rx="4" ry="2" fill="#9ad08a" transform={`rotate(-40 ${14} ${y})`} />
          <ellipse cx={82 - (y - 40) * 0.1} cy={y} rx="4" ry="2" fill="#9ad08a" transform={`rotate(40 ${82} ${y})`} />
        </g>
      ))}
    </>
  ),
  echochronik: (g) => (
    <>
      <circle cx="48" cy="50" r="42" fill={`url(#${g('glowV')})`} className="loot-pulse" />
      {[20, 30, 40].map((r, i) => (
        <circle key={r} cx="48" cy="46" r={r} fill="none" stroke="#e0b8ff" strokeWidth="1.5" opacity={0.6 - i * 0.15} className="loot-wave" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      <path d="M10 66 Q30 58 48 66 Q66 58 86 66 L86 84 Q66 76 48 84 Q30 76 10 84 Z" fill="#4a2a1a" />
      <path d="M12 64 Q30 54 48 62 L48 80 Q30 72 12 80 Z" fill={`url(#${g('parch')})`} />
      <path d="M84 64 Q66 54 48 62 L48 80 Q66 72 84 80 Z" fill={`url(#${g('parch')})`} />
      <path d="M20 64 Q30 60 40 64 M20 70 Q30 66 40 70 M56 64 Q66 60 76 64 M56 70 Q66 66 76 70" stroke="#8a4adf" strokeWidth="1.8" fill="none" />
      <text x="48" y="44" textAnchor="middle" fontSize="22" fill="#fff3ff" fontFamily="serif" className="loot-flicker">
        ↻
      </text>
      {sparks(g, [[30, 30, 1.3], [66, 28, 1.5], [48, 18, 1.1]], '#f0d8ff')}
    </>
  ),
};

const RELIC_ART: Record<RelicId, Draw> = {
  docht: (g) => (
    <>
      <circle cx="48" cy="30" r="26" fill={`url(#${g('glowO')})`} className="loot-pulse" />
      <path d="M36 44 L60 44 L58 86 L38 86 Z" fill="#f4e6cf" stroke="#c9b089" strokeWidth="1.5" />
      <path d="M36 44 Q40 50 44 46 Q48 54 52 46 Q56 52 60 44" fill="#fff8e8" />
      <path d="M48 44 L48 36" stroke="#3a2a1a" strokeWidth="2" />
      <path d="M48 36 Q38 24 48 8 Q58 24 48 36 Z" fill="#ff9a4a" className="loot-flicker" />
      <path d="M48 34 Q43 26 48 16 Q53 26 48 34 Z" fill="#fff0b0" />
      <path d="M30 86 L66 86 L70 92 L26 92 Z" fill={`url(#${g('bronze')})`} />
    </>
  ),
  aschekompass: (g) => (
    <>
      <circle cx="48" cy="50" r="30" fill={`url(#${g('glowO')})`} opacity="0.4" />
      <circle cx="48" cy="50" r="30" fill={`url(#${g('bronze')})`} stroke="#3a2210" strokeWidth="2" />
      <circle cx="48" cy="50" r="23" fill="#1a1416" stroke="#f3c58a" strokeWidth="1.5" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M48 29 L48 33" stroke="#f3c58a" strokeWidth="2" transform={`rotate(${i * 45} 48 50)`} />
      ))}
      <g className="loot-needle">
        <path d="M48 30 L53 50 L48 54 L43 50 Z" fill={`url(#${g('ember')})`} />
        <path d="M48 70 L53 50 L48 46 L43 50 Z" fill="#6a7384" />
      </g>
      <circle cx="48" cy="50" r="3" fill={`url(#${g('gold')})`} />
      <circle cx="48" cy="17" r="5" fill="none" stroke={`url(#${g('bronze')})`} strokeWidth="3" />
    </>
  ),
  wappen: (g) => (
    <>
      <circle cx="48" cy="48" r="32" fill={`url(#${g('glowB')})`} opacity="0.45" />
      <path d="M20 14 L76 14 L76 50 Q76 74 48 88 Q20 74 20 50 Z" fill="#1f3a6a" stroke={`url(#${g('silver')})`} strokeWidth="4" />
      <path d="M20 14 L48 14 L48 88 Q20 74 20 50 Z" fill="#2f5286" />
      <path d="M40 34 L56 34 L56 60 L40 60 Z" fill="#2a1a08" stroke={`url(#${g('gold')})`} strokeWidth="2" />
      <path d="M43 38 L53 38 L53 56 L43 56 Z" fill={`url(#${g('ember')})`} className="loot-pulse" />
      <path d="M44 34 Q48 26 52 34" stroke={`url(#${g('gold')})`} strokeWidth="2" fill="none" />
      <path d="M26 20 Q36 16 46 16" stroke="#fff" strokeWidth="2" opacity="0.5" fill="none" />
    </>
  ),
  glocke: (g) => (
    <>
      <circle cx="48" cy="50" r="32" fill={`url(#${g('glowO')})`} opacity="0.3" />
      <path d="M48 10 Q34 10 30 30 Q28 52 18 70 L78 70 Q68 52 66 30 Q62 10 48 10 Z" fill={`url(#${g('bronze')})`} stroke="#3a2210" strokeWidth="2" />
      <path d="M16 70 L80 70 Q82 78 76 80 L20 80 Q14 78 16 70 Z" fill={`url(#${g('bronze')})`} stroke="#3a2210" strokeWidth="2" />
      <circle cx="48" cy="84" r="6" fill="#5a3418" />
      <path d="M52 14 L46 30 L54 40 L44 56 L52 68" stroke="#1a0c04" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <path d="M52 14 L46 30 L54 40 L44 56 L52 68" stroke="#8fd0ff" strokeWidth="0.8" fill="none" opacity="0.8" className="loot-pulse" />
      <path d="M36 24 Q34 40 30 52" stroke="#fff3d0" strokeWidth="2.5" opacity="0.5" fill="none" strokeLinecap="round" />
      <path d="M8 44 Q4 52 8 60 M88 44 Q92 52 88 60" stroke="#8fd0ff" strokeWidth="2" fill="none" className="loot-wave" />
    </>
  ),
  taschenuhr: (g) => (
    <>
      <circle cx="48" cy="54" r="32" fill={`url(#${g('glowV')})`} opacity="0.35" />
      <path d="M48 20 Q30 6 18 14" stroke={`url(#${g('gold')})`} strokeWidth="2.5" fill="none" strokeDasharray="3 2" />
      <rect x="43" y="12" width="10" height="10" rx="3" fill={`url(#${g('gold')})`} />
      <circle cx="48" cy="54" r="32" fill={`url(#${g('gold')})`} stroke="#6a4a10" strokeWidth="2" />
      <circle cx="48" cy="54" r="25" fill="#f8f0dc" stroke="#8a5a14" strokeWidth="1.5" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M48 32 L48 36" stroke="#3a2a1a" strokeWidth={i % 3 === 0 ? 2.5 : 1.2} transform={`rotate(${i * 30} 48 54)`} />
      ))}
      <circle cx="48" cy="54" r="3" fill="#3a2a1a" />
      <circle cx="48" cy="54" r="14" fill="none" stroke="#b890e0" strokeWidth="1.5" strokeDasharray="4 4" className="loot-ring" />
    </>
  ),
  chor: (g) => (
    <>
      <circle cx="48" cy="48" r="34" fill={`url(#${g('glowW')})`} opacity="0.5" />
      <path d="M22 16 L70 16 Q78 16 78 24 L78 80 L30 80 Q22 80 22 72 Z" fill={`url(#${g('parch')})`} stroke="#8a6a3a" strokeWidth="1.5" />
      <path d="M22 72 Q22 64 30 64 L30 80" fill="#d9bc84" stroke="#8a6a3a" strokeWidth="1.5" />
      {[28, 36, 44, 52].map((y) => (
        <path key={y} d={`M34 ${y} L${70 - (y % 3) * 4} ${y}`} stroke="#7a5a3a" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      ))}
      <g className="loot-float">
        <text x="72" y="14" fontSize="16" fill="#fff3c0">♪</text>
        <text x="10" y="40" fontSize="14" fill="#fff3c0">♫</text>
        <text x="80" y="60" fontSize="12" fill="#fff3c0">♪</text>
      </g>
    </>
  ),
  mondgloeckchen: (g) => (
    <>
      <circle cx="48" cy="52" r="36" fill={`url(#${g('glowB')})`} className="loot-pulse" />
      <path d="M22 22 Q48 34 74 22" stroke="#4a78c2" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M40 30 L56 30 L52 38 L44 38 Z" fill={`url(#${g('silver')})`} />
      <circle cx="48" cy="60" r="24" fill={`url(#${g('silver')})`} stroke="#5d6a80" strokeWidth="1.5" />
      <path d="M26 64 L70 64" stroke="#5d6a80" strokeWidth="2" />
      <circle cx="48" cy="72" r="3.5" fill="#3a4250" />
      <path d="M44 44 A10 10 0 1 0 56 56 A13 13 0 1 1 44 44 Z" fill="#f2d16b" className="loot-pulse" />
      <path d="M34 50 Q36 44 42 42" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.8" strokeLinecap="round" />
      {sparks(g, [[18, 44, 1.2], [80, 48, 1.4], [70, 84, 1.1]], '#dff0ff')}
    </>
  ),
};

export function LootArt({ kind, id, size = 96 }: { kind: 'item' | 'relic'; id: string; size?: number }) {
  const uid = useId().replace(/:/g, '');
  const g = (n: string) => `${uid}-${n}`;
  const draw = kind === 'item' ? ITEM_ART[id as ItemId] : RELIC_ART[id as RelicId];
  return (
    <svg className="loot-art" width={size} height={size} viewBox="0 0 96 96" aria-hidden>
      <Defs g={g} />
      {draw?.(g)}
    </svg>
  );
}
