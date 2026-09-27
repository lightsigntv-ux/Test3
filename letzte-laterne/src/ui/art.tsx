// Eigene SVG-Figuren. Klare Silhouetten + Farben, damit die Figuren auch klein erkennbar bleiben:
// Fritz = blau, Schild, SCHWARZE Haare · Ivo = violett/orange, spitzer Hut · Sera = warm, BLONDE Haare,
// freundliches Lächeln · Yuumi = kleine graue Katze mit Mondglöckchen.
import type { EnemyId, HeroId } from '../content/types';

const SKIN = '#f3cda8';
const SKIN_SHADE = '#e2b48c';

type Mood = 'normal' | 'happy' | 'sad' | 'serious' | 'down';

export function HeroArt({ id, mood = 'normal', size = 100 }: { id: HeroId; mood?: Mood; size?: number }) {
  const h = (size * 120) / 100;
  if (id === 'fritz') return <Fritz w={size} h={h} mood={mood} />;
  if (id === 'ivo') return <Ivo w={size} h={h} mood={mood} />;
  return <Sera w={size} h={h} mood={mood} />;
}

function Eyes({ mood, x1, x2, y, color = '#2a2230' }: { mood: Mood; x1: number; x2: number; y: number; color?: string }) {
  if (mood === 'happy')
    return (
      <g stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round">
        <path d={`M${x1 - 3} ${y + 1} Q${x1} ${y - 3} ${x1 + 3} ${y + 1}`} />
        <path d={`M${x2 - 3} ${y + 1} Q${x2} ${y - 3} ${x2 + 3} ${y + 1}`} />
      </g>
    );
  if (mood === 'down')
    return (
      <g stroke={color} strokeWidth="1.6" strokeLinecap="round">
        <path d={`M${x1 - 3} ${y - 2} L${x1 + 3} ${y + 2} M${x1 + 3} ${y - 2} L${x1 - 3} ${y + 2}`} />
        <path d={`M${x2 - 3} ${y - 2} L${x2 + 3} ${y + 2} M${x2 + 3} ${y - 2} L${x2 - 3} ${y + 2}`} />
      </g>
    );
  return (
    <g>
      <ellipse cx={x1} cy={y} rx="2.3" ry={mood === 'sad' ? 2.4 : 3} fill={color} />
      <ellipse cx={x2} cy={y} rx="2.3" ry={mood === 'sad' ? 2.4 : 3} fill={color} />
      <circle cx={x1 + 0.8} cy={y - 1} r="0.8" fill="#fff" />
      <circle cx={x2 + 0.8} cy={y - 1} r="0.8" fill="#fff" />
    </g>
  );
}

function Fritz({ w, h, mood }: { w: number; h: number; mood: Mood }) {
  return (
    <svg width={w} height={h} viewBox="0 0 100 120" aria-label="Fritz">
      <ellipse cx="50" cy="115" rx="30" ry="4" fill="#000" opacity="0.3" />
      {/* Beine */}
      <rect x="38" y="88" width="9" height="24" rx="3" fill="#232a3a" />
      <rect x="53" y="88" width="9" height="24" rx="3" fill="#232a3a" />
      <rect x="36" y="108" width="12" height="6" rx="2" fill="#4a3526" />
      <rect x="52" y="108" width="12" height="6" rx="2" fill="#4a3526" />
      {/* Wächtermantel */}
      <path d="M30 56 Q50 48 70 56 L74 94 Q50 100 26 94 Z" fill="#2f5286" />
      <path d="M50 52 L50 97" stroke="#d9b45a" strokeWidth="2" />
      <rect x="29" y="78" width="42" height="5" fill="#5b3b24" />
      <rect x="47" y="77" width="6" height="7" rx="1" fill="#e2c26a" />
      {/* Schulterstücke */}
      <ellipse cx="31" cy="58" rx="8" ry="5" fill="#6e7f99" />
      <ellipse cx="69" cy="58" rx="8" ry="5" fill="#6e7f99" />
      {/* kleine Schutzlaterne am Gürtel */}
      <g transform="translate(64 80)">
        <rect x="0" y="0" width="8" height="10" rx="2" fill="#3a2a1a" />
        <rect x="1.5" y="2" width="5" height="6" rx="1" fill="#ffd27a" className="glow" />
      </g>
      {/* Kopf */}
      <circle cx="50" cy="36" r="17" fill={SKIN} />
      <ellipse cx="50" cy="44" rx="11" ry="5" fill={SKIN_SHADE} opacity="0.35" />
      {/* SCHWARZE Haare: kurz, kantig, Seitenscheitel */}
      <path d="M32 36 Q30 18 48 15 Q66 13 69 30 L67 34 Q62 24 52 25 Q44 22 38 30 L35 38 Z" fill="#141418" />
      <path d="M45 16 L41 9 L50 14 L56 8 L57 16 Z" fill="#141418" />
      <path d="M33 34 L32 44 L36 42 Z" fill="#141418" />
      <path d="M67 32 L68 43 L64 41 Z" fill="#141418" />
      <path d="M40 22 Q48 18 58 21" stroke="#3a3a48" strokeWidth="1.2" fill="none" />
      {/* Brauen & Augen */}
      <path d="M40 31 L47 32 M53 32 L60 31" stroke="#141418" strokeWidth="2" strokeLinecap="round" />
      <Eyes mood={mood} x1={44} x2={56} y={37} />
      {mood === 'happy' || mood === 'normal' ? (
        <path d="M46 45 Q50 47 54 45" stroke="#8a4a3a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M46 46 L54 46" stroke="#8a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      )}
      {/* kleine Narbe */}
      <path d="M59 40 L62 43" stroke="#c98f76" strokeWidth="1" />
      {/* Schild mit Laternenwappen */}
      <g transform="translate(8 56)">
        <path d="M0 2 Q14 -4 28 2 L26 26 Q14 40 2 26 Z" fill="#5d7fb8" stroke="#d9b45a" strokeWidth="2.5" />
        <rect x="10" y="9" width="8" height="12" rx="2" fill="#2b2014" />
        <rect x="11.5" y="11" width="5" height="8" rx="1" fill="#ffd27a" className="glow" />
        <path d="M12 8 L14 5 L16 8" stroke="#d9b45a" strokeWidth="1.5" fill="none" />
      </g>
      {/* Arm mit Schwert */}
      <rect x="72" y="60" width="7" height="22" rx="3" fill="#2f5286" />
      <rect x="78" y="46" width="3" height="30" fill="#c9d3e0" />
      <rect x="74" y="74" width="11" height="3" fill="#d9b45a" />
    </svg>
  );
}

function Ivo({ w, h, mood }: { w: number; h: number; mood: Mood }) {
  return (
    <svg width={w} height={h} viewBox="0 0 100 120" aria-label="Ivo">
      <ellipse cx="50" cy="115" rx="26" ry="4" fill="#000" opacity="0.3" />
      {/* langer Gelehrtenmantel */}
      <path d="M34 58 Q50 52 66 58 L72 112 Q50 116 28 112 Z" fill="#4a2f73" />
      <path d="M50 56 L50 112" stroke="#e0823a" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M34 58 L28 112 L36 112 L40 62 Z" fill="#3a2360" />
      {/* Funken-Schal */}
      <path d="M38 58 Q50 66 62 58 L60 64 Q50 70 40 64 Z" fill="#e0823a" />
      <path d="M57 64 L60 80 L55 78 Z" fill="#e0823a" />
      {/* Stab mit Funken */}
      <rect x="74" y="40" width="3" height="72" rx="1" fill="#6b4a2a" />
      <circle cx="75.5" cy="38" r="6" fill="#ffb454" className="glow" />
      <circle cx="75.5" cy="38" r="3" fill="#fff4d6" />
      <path d="M68 30 L71 34 M83 30 L80 34 M75 26 L75.5 31" stroke="#ffd27a" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="70" cy="70" rx="5" ry="6" fill={SKIN} />
      {/* Kopf */}
      <circle cx="50" cy="42" r="15" fill={SKIN} />
      {/* rotbraune, wuschelige Haare */}
      <path d="M35 42 Q33 33 38 30 L62 30 Q67 34 65 43 Q62 36 58 38 Q55 34 50 37 Q45 33 42 38 Q38 36 35 42 Z" fill="#a4502c" />
      {/* spitzer Gelehrtenhut */}
      <path d="M30 32 Q50 24 70 32 Q50 36 30 32 Z" fill="#2d1c4a" />
      <path d="M38 30 L54 0 L62 30 Z" fill="#3a2360" />
      <path d="M54 0 L57 -2 L56 4" fill="#3a2360" />
      <path d="M40 27 Q50 24 61 27" stroke="#e0823a" strokeWidth="2.5" fill="none" />
      <circle cx="53" cy="12" r="2" fill="#ffd27a" className="glow" />
      {/* Brille */}
      <circle cx="44" cy="43" r="4.5" fill="none" stroke="#c9a15a" strokeWidth="1.4" />
      <circle cx="56" cy="43" r="4.5" fill="none" stroke="#c9a15a" strokeWidth="1.4" />
      <path d="M48.5 43 L51.5 43" stroke="#c9a15a" strokeWidth="1.4" />
      <Eyes mood={mood} x1={44} x2={56} y={43} />
      {mood === 'sad' || mood === 'serious' ? (
        <path d="M46 51 Q50 49 54 51" stroke="#8a4a3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M45 50 Q51 54 55 49" stroke="#8a4a3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

function Sera({ w, h, mood }: { w: number; h: number; mood: Mood }) {
  const face: Mood = mood === 'normal' ? 'happy' : mood;
  return (
    <svg width={w} height={h} viewBox="0 0 100 120" aria-label="Sera">
      <ellipse cx="50" cy="115" rx="26" ry="4" fill="#000" opacity="0.3" />
      {/* lange BLONDE Haare hinten */}
      <path d="M31 38 Q28 70 34 86 Q42 90 50 88 Q58 90 66 86 Q72 70 69 38 Z" fill="#e8bf55" />
      {/* Kleid: creme mit warmem Rosé */}
      <path d="M36 60 Q50 54 64 60 L74 110 Q50 116 26 110 Z" fill="#f4e6cf" />
      <path d="M36 60 Q50 54 64 60 L62 70 Q50 74 38 70 Z" fill="#e98b7a" />
      <path d="M30 100 Q50 106 70 100 L74 110 Q50 116 26 110 Z" fill="#e98b7a" opacity="0.85" />
      {/* Buch der Namen mit leuchtendem Band */}
      <g transform="translate(40 76)">
        <rect x="0" y="0" width="20" height="14" rx="2" fill="#8a4f3a" />
        <rect x="2" y="2" width="16" height="10" rx="1" fill="#fff3d8" />
        <path d="M10 2 L10 12" stroke="#c9a15a" strokeWidth="1" />
        <path d="M-6 6 Q-2 -4 6 2" stroke="#ffd27a" strokeWidth="1.5" fill="none" className="glow" />
      </g>
      <ellipse cx="38" cy="82" rx="4" ry="4" fill={SKIN} />
      <ellipse cx="62" cy="82" rx="4" ry="4" fill={SKIN} />
      {/* Kopf */}
      <circle cx="50" cy="40" r="15.5" fill={SKIN} />
      {/* Pony + Seitensträhnen (blond, mit Glanz) */}
      <path d="M34 40 Q33 22 50 21 Q67 22 66 40 Q62 30 55 29 Q52 34 46 31 Q40 33 34 40 Z" fill="#f2cf6a" />
      <path d="M34 40 Q32 54 36 64 L39 62 Q36 52 37 42 Z" fill="#f2cf6a" />
      <path d="M66 40 Q68 54 64 64 L61 62 Q64 52 63 42 Z" fill="#f2cf6a" />
      <path d="M42 25 Q48 22 55 24" stroke="#fff0b8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Haarschleife */}
      <path d="M60 25 L67 21 L66 29 Z M60 25 L67 30 L63 32 Z" fill="#e98b7a" />
      {/* weicher, freundlicher Ausdruck */}
      <Eyes mood={face} x1={44} x2={56} y={41} color="#5a3a2a" />
      <ellipse cx="40" cy="47" rx="3" ry="1.8" fill="#f29b9b" opacity="0.6" />
      <ellipse cx="60" cy="47" rx="3" ry="1.8" fill="#f29b9b" opacity="0.6" />
      {mood === 'sad' ? (
        <path d="M46 50 Q50 48 54 50" stroke="#a0524a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M45 48 Q50 53 55 48" stroke="#a0524a" strokeWidth="1.5" fill="#e98b7a" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function YuumiArt({ size = 60, pose = 'sit' }: { size?: number; pose?: 'sit' | 'pounce' | 'happy' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-label="Yuumi" className={`yuumi-svg pose-${pose}`}>
      <ellipse cx="30" cy="56" rx="16" ry="3" fill="#000" opacity="0.3" />
      {/* Schwanz */}
      <path className="yuumi-tail" d="M42 50 Q56 46 52 32 Q50 28 47 31 Q51 42 40 46 Z" fill="#8e949d" />
      {/* Körper, flauschig */}
      <path d="M17 54 Q14 38 22 32 L38 32 Q46 38 43 54 Z" fill="#9ba1aa" />
      <path d="M22 44 Q30 40 38 44" stroke="#7c828b" strokeWidth="2" fill="none" />
      <path d="M21 50 Q30 46 39 50" stroke="#7c828b" strokeWidth="2" fill="none" />
      <ellipse cx="30" cy="48" rx="6" ry="6" fill="#c9ccd2" />
      {/* Pfoten */}
      <ellipse cx="24" cy="54" rx="4" ry="2.5" fill="#c9ccd2" />
      <ellipse cx="36" cy="54" rx="4" ry="2.5" fill="#c9ccd2" />
      {/* Kopf */}
      <circle cx="30" cy="24" r="12" fill="#9ba1aa" />
      <path d="M19 18 L18 6 L27 13 Z" fill="#9ba1aa" />
      <path d="M41 18 L42 6 L33 13 Z" fill="#9ba1aa" />
      <path d="M20 15 L20 9 L25 13 Z" fill="#f1b8c0" />
      <path d="M40 15 L40 9 L35 13 Z" fill="#f1b8c0" />
      <path d="M26 14 L27 18 M30 13 L30 17 M34 14 L33 18" stroke="#7c828b" strokeWidth="1.5" strokeLinecap="round" />
      {/* große, neugierige Augen */}
      <ellipse cx="25" cy="24" rx="3.6" ry="4.2" fill="#f2d16b" />
      <ellipse cx="35" cy="24" rx="3.6" ry="4.2" fill="#f2d16b" />
      <ellipse cx="25" cy="24.5" rx="1.6" ry="3.2" fill="#1d1d24" />
      <ellipse cx="35" cy="24.5" rx="1.6" ry="3.2" fill="#1d1d24" />
      <circle cx="26" cy="22.5" r="1" fill="#fff" />
      <circle cx="36" cy="22.5" r="1" fill="#fff" />
      <path d="M28.5 28.5 L31.5 28.5 L30 30 Z" fill="#f29bab" />
      <path d="M30 30 Q28 32 26.5 31 M30 30 Q32 32 33.5 31" stroke="#5a5560" strokeWidth="0.9" fill="none" />
      <path d="M16 27 L23 28 M16 30 L23 29.5 M44 27 L37 28 M44 30 L37 29.5" stroke="#e8eaee" strokeWidth="0.7" />
      {/* Halsband mit Mondglöckchen */}
      <path d="M21 34 Q30 38 39 34" stroke="#4a78c2" strokeWidth="2.5" fill="none" />
      <circle cx="30" cy="38.5" r="3" fill="#e8e3c8" stroke="#c9b25a" strokeWidth="0.8" className="bell" />
      <path d="M28.6 37.2 A1.8 1.8 0 1 0 31.2 39.6 A2.4 2.4 0 1 1 28.6 37.2 Z" fill="#c9b25a" />
    </svg>
  );
}

const ENEMY_PALETTE: Record<string, { body: string; accent: string; eye: string }> = {
  nebelgaenger: { body: '#5d6f8d', accent: '#8ea3c4', eye: '#bfe3ff' },
  irrlichtschuetze: { body: '#3b6f8f', accent: '#8fd3ff', eye: '#ffffff' },
  nebelschild: { body: '#56697f', accent: '#a9c0d6', eye: '#bfe3ff' },
  saengerin: { body: '#6b5a8d', accent: '#c7b2ec', eye: '#f3e6ff' },
  aschenwirker: { body: '#5a3a38', accent: '#ff8a4a', eye: '#ffd08a' },
  nebelkoloss: { body: '#3f4a5e', accent: '#7d8ba3', eye: '#ff7070' },
  hauptmann: { body: '#5c6272', accent: '#b8bfcc', eye: '#ff9a6a' },
  aschenhexe: { body: '#4a2626', accent: '#ff6a3a', eye: '#ffd27a' },
  glockenwaechter: { body: '#5a5240', accent: '#d9b45a', eye: '#fff0b0' },
  archivarin: { body: '#473d66', accent: '#b9a8e8', eye: '#ffffff' },
  seitenwaechter: { body: '#6d6a8a', accent: '#e9e3ff', eye: '#473d66' },
  hueter: { body: '#7a4a1a', accent: '#ffd27a', eye: '#ffffff' },
};

export function EnemyArt({ id, size = 90 }: { id: EnemyId; size?: number }) {
  const p = ENEMY_PALETTE[id];
  const eyes = (y: number, x1 = 42, x2 = 58) => (
    <g className="enemy-eyes">
      <ellipse cx={x1} cy={y} rx="3" ry="2" fill={p.eye} />
      <ellipse cx={x2} cy={y} rx="3" ry="2" fill={p.eye} />
    </g>
  );
  const fogBase = <path d="M18 104 Q30 96 40 104 Q50 96 60 104 Q70 96 82 104 L82 112 L18 112 Z" fill={p.body} opacity="0.6" />;
  let body: React.ReactNode;
  switch (id) {
    case 'nebelgaenger':
      body = (
        <>
          <path d="M30 104 Q28 60 50 36 Q72 60 70 104 Z" fill={p.body} />
          <path d="M36 50 Q50 30 64 50 Q58 44 50 44 Q42 44 36 50 Z" fill={p.accent} opacity="0.5" />
          {eyes(56)}
          <path d="M66 70 L82 60" stroke={p.accent} strokeWidth="4" strokeLinecap="round" />
        </>
      );
      break;
    case 'irrlichtschuetze':
      body = (
        <>
          <circle cx="50" cy="56" r="20" fill={p.accent} opacity="0.35" className="glow" />
          <path d="M38 96 Q34 70 50 42 Q66 70 62 96 Q50 88 38 96 Z" fill={p.body} />
          {eyes(58)}
          <path d="M72 44 Q84 64 72 84" stroke="#e8f6ff" strokeWidth="2.5" fill="none" />
          <path d="M72 44 L72 84" stroke="#e8f6ff" strokeWidth="0.8" />
        </>
      );
      break;
    case 'nebelschild':
      body = (
        <>
          <path d="M34 104 Q30 62 50 40 Q70 62 66 104 Z" fill={p.body} />
          {eyes(56)}
          <path d="M20 58 Q34 50 44 58 L42 90 Q32 100 22 90 Z" fill={p.accent} stroke="#e6f0ff" strokeWidth="2" />
          <path d="M32 64 L32 86" stroke="#e6f0ff" strokeWidth="2" />
        </>
      );
      break;
    case 'saengerin':
      body = (
        <>
          <path d="M32 104 Q34 64 50 38 Q66 64 68 104 Z" fill={p.body} />
          <path d="M36 50 Q50 26 64 50 L66 70 Q50 56 34 70 Z" fill={p.accent} opacity="0.7" />
          {eyes(56)}
          <path d="M44 66 Q50 70 56 66" stroke={p.eye} strokeWidth="1.5" fill="none" />
          <text x="70" y="44" fontSize="14" fill={p.accent}>♪</text>
        </>
      );
      break;
    case 'aschenwirker':
      body = (
        <>
          <path d="M32 104 Q30 64 50 38 Q70 64 68 104 Z" fill={p.body} />
          <path d="M38 50 Q50 34 62 50 Q50 46 38 50 Z" fill="#2a1a18" />
          {eyes(56)}
          <circle cx="72" cy="72" r="6" fill={p.accent} className="glow" />
          <circle cx="28" cy="74" r="5" fill={p.accent} className="glow" />
        </>
      );
      break;
    case 'nebelkoloss':
      body = (
        <>
          <path d="M22 104 Q16 58 50 34 Q84 58 78 104 Z" fill={p.body} />
          <path d="M14 70 Q10 90 22 96 L28 72 Z" fill={p.accent} />
          <path d="M86 70 Q90 90 78 96 L72 72 Z" fill={p.accent} />
          {eyes(58, 40, 60)}
          <path d="M40 72 L60 72" stroke="#1d2230" strokeWidth="3" />
        </>
      );
      break;
    case 'hauptmann':
      body = (
        <>
          <path d="M28 104 Q26 62 50 40 Q74 62 72 104 Z" fill={p.body} />
          <rect x="36" y="40" width="28" height="26" rx="6" fill={p.accent} />
          <rect x="38" y="52" width="24" height="4" fill="#1d2230" />
          <path d="M50 40 Q56 22 70 24 Q60 30 54 40 Z" fill="#b34a4a" />
          <ellipse cx="44" cy="54" rx="2.5" ry="1.4" fill={p.eye} />
          <ellipse cx="56" cy="54" rx="2.5" ry="1.4" fill={p.eye} />
          <path d="M74 50 L90 34" stroke="#dfe6f0" strokeWidth="4" strokeLinecap="round" />
        </>
      );
      break;
    case 'aschenhexe':
      body = (
        <>
          <path d="M30 104 Q30 64 50 44 Q70 64 70 104 Z" fill={p.body} />
          <path d="M28 46 Q50 38 72 46 Q50 50 28 46 Z" fill="#2a1414" />
          <path d="M36 44 L54 8 L62 44 Z" fill="#2a1414" />
          {eyes(58)}
          <circle cx="52" cy="10" r="3" fill={p.accent} className="glow" />
          <circle cx="76" cy="70" r="7" fill={p.accent} className="glow" />
        </>
      );
      break;
    case 'glockenwaechter':
      body = (
        <>
          <path d="M20 106 Q16 56 50 30 Q84 56 80 106 Z" fill={p.body} />
          <path d="M34 22 Q50 10 66 22 L70 44 Q50 50 30 44 Z" fill={p.accent} />
          <circle cx="50" cy="46" r="3" fill="#5a4a20" />
          {eyes(66, 40, 60)}
          <path d="M40 80 Q50 88 60 80" stroke={p.accent} strokeWidth="3" fill="none" />
        </>
      );
      break;
    case 'archivarin':
      body = (
        <>
          <path d="M28 108 Q26 56 50 22 Q74 56 72 108 Z" fill={p.body} />
          <ellipse cx="50" cy="40" rx="12" ry="14" fill="#1d1830" />
          {eyes(40, 45, 55)}
          <rect x="62" y="62" width="22" height="16" rx="2" fill="#e9e3ff" transform="rotate(-12 73 70)" />
          <path d="M30 66 L14 52" stroke={p.accent} strokeWidth="2" />
          <path d="M14 52 L10 48" stroke="#fff" strokeWidth="2" />
        </>
      );
      break;
    case 'seitenwaechter':
      body = (
        <>
          <rect x="30" y="40" width="40" height="52" rx="4" fill={p.accent} transform="rotate(-6 50 66)" />
          <path d="M36 52 L64 50 M36 60 L62 58 M36 68 L60 66" stroke="#9a92c0" strokeWidth="2" />
          {eyes(80, 44, 56)}
        </>
      );
      break;
    case 'hueter':
      body = (
        <>
          <circle cx="50" cy="56" r="40" fill={p.accent} opacity="0.2" className="glow" />
          <path d="M24 108 Q20 60 50 16 Q80 60 76 108 Z" fill={p.body} />
          <path d="M34 90 Q30 56 50 28 Q70 56 66 90 Q50 80 34 90 Z" fill="#ffb454" />
          <path d="M42 84 Q40 62 50 44 Q60 62 58 84 Q50 78 42 84 Z" fill="#fff0b8" />
          {eyes(60, 44, 56)}
        </>
      );
      break;
  }
  return (
    <svg width={size} height={(size * 120) / 100} viewBox="0 0 100 120" aria-label={id} className="enemy-svg">
      <ellipse cx="50" cy="112" rx="30" ry="4" fill="#000" opacity="0.35" />
      {fogBase}
      {body}
    </svg>
  );
}

export function PawIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <g fill={filled ? '#f2d16b' : 'none'} stroke={filled ? '#f2d16b' : '#7c828b'} strokeWidth="1">
        <ellipse cx="8" cy="10.5" rx="3.4" ry="3" />
        <circle cx="3.6" cy="6.5" r="1.6" />
        <circle cx="6.4" cy="4" r="1.6" />
        <circle cx="9.6" cy="4" r="1.6" />
        <circle cx="12.4" cy="6.5" r="1.6" />
      </g>
    </svg>
  );
}

export function LanternIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 20 26" aria-hidden>
      <path d="M7 2 Q10 -1 13 2" stroke="#c9a15a" strokeWidth="1.5" fill="none" />
      <rect x="4" y="3" width="12" height="3" rx="1" fill="#3a2a1a" />
      <rect x="5" y="6" width="10" height="14" rx="2" fill="#ffd27a" className="glow" />
      <path d="M10 9 Q13 13 10 17 Q7 13 10 9 Z" fill="#fff4d6" />
      <rect x="4" y="20" width="12" height="3" rx="1" fill="#3a2a1a" />
    </svg>
  );
}
