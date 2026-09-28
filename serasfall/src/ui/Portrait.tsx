// Porträts mit sechs Ausdrücken, gemalt als SVG. Jede Figur mit eigener Silhouette, Kleidung nach Stand.
import { memo } from 'react';
import { CHARACTERS, type Look } from '../content/characters';
import type { Expr } from '../engine/types';

const GENTRY = new Set(['harriet', 'lionel', 'clara', 'penrose']);
const BG: Record<string, [string, string]> = {
  harriet: ['#3a3444', '#15121a'], lionel: ['#3a3a2a', '#141410'], clara: ['#2a3a3e', '#0e1416'], penrose: ['#4a2e28', '#180e0c'],
  hobbes: ['#34302a', '#12100e'], pryce: ['#4a3e2e', '#1a140e'], tilly: ['#4e4234', '#1c160e'], dunning: ['#3a3e30', '#12140e'], sera: ['#3a4a44', '#101816'],
};

interface Face { browY: number; browTilt: number; eyeOpen: number; lid: number; mouth: 'line' | 'smile' | 'down' | 'tight' | 'open' | 'o'; smile: number }
const FACES: Record<Expr, Face> = {
  neutral: { browY: 0, browTilt: 0, eyeOpen: 1, lid: 0.15, mouth: 'line', smile: 0 },
  warm: { browY: -2, browTilt: -0.05, eyeOpen: 0.8, lid: 0.25, mouth: 'smile', smile: 1 },
  sad: { browY: -1, browTilt: 0.35, eyeOpen: 0.75, lid: 0.45, mouth: 'down', smile: -0.8 },
  tense: { browY: 3, browTilt: -0.1, eyeOpen: 0.9, lid: 0.3, mouth: 'tight', smile: -0.2 },
  angry: { browY: 4, browTilt: -0.4, eyeOpen: 0.95, lid: 0.25, mouth: 'open', smile: -0.6 },
  surprised: { browY: -7, browTilt: 0.1, eyeOpen: 1.35, lid: 0, mouth: 'o', smile: 0 },
};

function Hair({ look, back }: { look: Look; back: boolean }) {
  const h = look.hair;
  switch (look.hairStyle) {
    case 'blondLong': {
      const hl = shadeHex(h, 0.22), dk = shadeHex(h, -0.1);
      return back ? (
        <g>
          <path d="M82 170 Q74 84 150 76 Q226 84 218 170 Q232 270 222 380 L78 380 Q68 270 82 170Z" fill={dk} />
          <path d="M96 160 Q92 250 104 380 M204 160 Q208 250 196 380" stroke={h} strokeWidth={10} fill="none" opacity={0.7} />
        </g>
      ) : (
        <g>
          <path d="M90 172 Q82 88 150 82 Q218 88 210 172 Q206 132 184 118 Q166 110 152 104 Q146 122 118 128 Q98 138 90 172Z" fill={h} />
          <path d="M92 150 Q82 230 96 300 Q102 336 84 376 L112 376 Q122 310 110 240 Q104 200 106 162Z" fill={h} />
          <path d="M208 150 Q218 230 204 300 Q198 336 216 376 L188 376 Q178 310 190 240 Q196 200 194 162Z" fill={h} />
          <path d="M112 112 Q140 96 176 110 M100 190 Q96 250 106 310 M200 190 Q204 250 194 310" stroke={hl} strokeWidth={2.4} fill="none" opacity={0.8} />
        </g>
      );
    }
    case 'bun': case 'bunLoose': case 'blondUp':
      return back ? (
        <g>
          <ellipse cx={150} cy={look.hairStyle === 'bunLoose' ? 92 : 88} rx={look.hairStyle === 'bunLoose' ? 50 : 38} ry={look.hairStyle === 'bunLoose' ? 34 : 28} fill={h} />
        </g>
      ) : (
        <g>
          <path d="M92 150 Q88 92 150 86 Q212 92 208 150 Q200 118 150 112 Q100 118 92 150Z" fill={h} />
          <path d="M104 132 Q126 104 150 108 Q176 104 196 132" stroke={shadeHex(h, 0.25)} strokeWidth={2} fill="none" opacity={0.6} />
          {look.hairStyle === 'blondUp' && <path d="M196 124 Q216 168 204 214" stroke={h} strokeWidth={5} fill="none" strokeLinecap="round" />}
          {look.hairStyle === 'bunLoose' && <path d="M96 140 Q84 180 98 206 M204 140 Q216 180 202 206" stroke={h} strokeWidth={6} fill="none" strokeLinecap="round" />}
        </g>
      );
    case 'cap': case 'childCap': {
      const big = look.hairStyle === 'childCap';
      return back ? <ellipse cx={150} cy={96} rx={big ? 74 : 64} ry={big ? 44 : 38} fill="#efe9dc" /> : (
        <g>
          <path d="M96 150 Q92 104 150 100 Q208 104 204 150 Q196 124 150 120 Q104 124 96 150Z" fill={h} />
          <path d={big ? 'M72 124 Q150 44 228 124 Q150 104 72 124Z' : 'M84 124 Q150 60 216 124 Q150 108 84 124Z'} fill="#f4f0e6" />
          <path d={big ? 'M72 124 Q80 132 90 126 Q100 134 110 126 Q120 134 130 126 Q140 134 150 126 Q160 134 170 126 Q180 134 190 126 Q200 134 210 126 Q220 132 228 124' : 'M84 124 Q150 116 216 124'} stroke="#d8d0c0" strokeWidth={2} fill="none" />
        </g>
      );
    }
    case 'bald':
      return back ? null : (
        <g>
          <path d="M92 160 Q90 128 104 118 L108 170Z M208 160 Q210 128 196 118 L192 170Z" fill={h} />
          <ellipse cx={150} cy={104} rx={46} ry={12} fill="#ffffff" opacity={0.08} />
        </g>
      );
    case 'short': case 'swept':
      return back ? null : (
        <g>
          <path d="M92 152 Q86 90 150 84 Q214 90 208 152 Q204 116 176 110 Q150 124 108 112 Q96 124 92 152Z" fill={h} />
          {look.hairStyle === 'swept' && <path d="M112 106 Q156 76 200 112 Q170 96 140 104Z" fill={shadeHex(h, 0.15)} />}
        </g>
      );
  }
}

function shadeHex(c: string, f: number): string {
  const n = parseInt(c.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
  return '#' + ((1 << 24) + (ch((n >> 16) & 255) << 16) + (ch((n >> 8) & 255) << 8) + ch(n & 255)).toString(16).slice(1);
}

function Clothes({ id, look, modern }: { id: string; look: Look; modern: boolean }) {
  const d = modern ? '#e8dcc4' : look.dress, t = look.trim;
  const shoulders = 'M40 380 Q52 290 150 272 Q248 290 260 380Z';
  switch (id) {
    case 'hobbes':
      return (<g>
        <path d={shoulders} fill="#121214" />
        <path d="M128 276 L150 340 L172 276 Z" fill="#f4f2ee" />
        <path d="M136 282 L150 292 L164 282 L164 296 L150 290 L136 296Z" fill="#101012" />
        <path d="M128 276 L112 380 M172 276 L188 380" stroke="#26262a" strokeWidth={3} />
      </g>);
    case 'lionel':
      return (<g>
        <path d={shoulders} fill={d} />
        <path d="M132 276 L150 322 L168 276Z" fill="#efe9dc" />
        <path d="M138 284 Q150 300 162 284 Q156 312 150 318 Q144 312 138 284Z" fill="#6a2a2a" />
        <rect x={58} y={324} width={40} height={16} fill="#050405" transform="rotate(-18 78 332)" />
        <path d="M100 300 L96 380 M200 300 L204 380" stroke="#b89a5a" strokeWidth={2} opacity={0.6} />
      </g>);
    case 'dunning':
      return (<g>
        <path d="M30 380 Q40 280 150 266 Q260 280 270 380Z" fill={d} />
        <path d="M60 300 Q150 330 240 300" stroke={shadeHex(d, 0.2)} strokeWidth={3} fill="none" />
        <path d="M120 274 L150 300 L180 274" fill={t} />
      </g>);
    case 'pryce': case 'tilly':
      return (<g>
        <path d={shoulders} fill={d} />
        <path d="M122 274 Q150 300 178 274 L174 284 Q150 306 126 284Z" fill={t} />
        <path d="M110 300 L118 380 M190 300 L182 380" stroke={t} strokeWidth={9} />
        {id === 'pryce' && <g><circle cx={214} cy={352} r={6} fill="#b8a060" /><path d="M214 356 L208 380 M214 356 L220 380" stroke="#b8a060" strokeWidth={3} /></g>}
      </g>);
    case 'sera':
      return modern ? (
        <g>
          {/* oversized Strickjacke in Creme über weißem Top, feine Goldkette */}
          <path d="M30 380 Q40 284 150 270 Q260 284 270 380Z" fill="#efe4d0" />
          <path d="M122 276 L150 380 L178 276 Q150 290 122 276Z" fill="#fbfaf6" />
          <path d="M122 276 L150 380 M178 276 L150 380" stroke="#d8c8ac" strokeWidth={5} fill="none" />
          <path d="M60 330 Q66 300 80 290 M240 330 Q234 300 220 290" stroke="#dccdb2" strokeWidth={3} fill="none" />
          <path d="M132 280 Q150 306 168 280" stroke="#d6b25e" strokeWidth={1.4} fill="none" />
          <circle cx={150} cy={304} r={2.6} fill="#d6b25e" />
        </g>
      ) : (
        <g>
          <path d={shoulders} fill={d} />
          <path d="M126 270 Q150 292 174 270 L172 284 Q150 302 128 284Z" fill="#f4efe2" />
          <path d="M128 284 Q150 300 172 284" stroke="#e2d8c2" strokeWidth={2} fill="none" strokeDasharray="3 3" />
          <ellipse cx={150} cy={300} rx={8} ry={10} fill="#e9dcc0" stroke="#b8964a" strokeWidth={2} />
          <path d="M90 320 Q150 340 210 320" stroke={shadeHex(d, 0.12)} strokeWidth={2} fill="none" />
        </g>
      );
    default:
      return (<g>
        <path d={shoulders} fill={d} />
        <path d="M128 270 Q150 262 172 270 L170 290 Q150 296 130 290Z" fill={id === 'harriet' ? '#1a1820' : t} />
        {id === 'penrose' && <path d="M40 380 Q70 300 150 300 Q230 300 260 380 Q200 340 150 346 Q100 340 40 380Z" fill="#161010" />}
        {look.extra?.includes('jet') && <g><ellipse cx={150} cy={300} rx={11} ry={13} fill="#050405" stroke="#8a8a8a" strokeWidth={1} /><ellipse cx={150} cy={300} rx={5} ry={6} fill="#6a4a2a" /></g>}
        {look.extra?.includes('lorgnon') && <path d="M150 312 Q176 340 186 380" stroke="#8a8a80" strokeWidth={1.5} fill="none" />}
      </g>);
  }
}

function FaceFeatures({ look, e, id }: { look: Look; e: Face; id: string }) {
  const skin = look.skin;
  const eyeY = 176;
  const browY = 158 + e.browY;
  const eye = (cx: number, side: number) => {
    const ry = 7 * e.eyeOpen;
    return (
      <g key={cx}>
        <ellipse cx={cx} cy={eyeY} rx={11} ry={ry} fill="#f4efe6" />
        <circle cx={cx + side * 0.5} cy={eyeY + 0.5} r={Math.min(5.8, ry)} fill={look.eyes} />
        <circle cx={cx + side * 0.5} cy={eyeY + 0.5} r={Math.min(2.6, ry * 0.5)} fill="#140e0a" />
        <circle cx={cx + 2} cy={eyeY - 2} r={1.4} fill="#ffffff" opacity={0.9} />
        <path d={`M${cx - 12} ${eyeY - ry * (1 - e.lid * 2)} Q${cx} ${eyeY - ry - 3 + e.lid * 8} ${cx + 12} ${eyeY - ry * (1 - e.lid * 2)} L${cx + 12} ${eyeY - ry - 6} L${cx - 12} ${eyeY - ry - 6}Z`} fill={skin} />
        <path d={`M${cx - 12} ${eyeY - ry * (1 - e.lid * 2) + 0.5} Q${cx} ${eyeY - ry - 2 + e.lid * 8} ${cx + 12} ${eyeY - ry * (1 - e.lid * 2) + 0.5}`} stroke="#3a2418" strokeWidth={1.8} fill="none" />
        {id === 'sera' && <path d={`M${cx - side * 11} ${eyeY - ry * (1 - e.lid * 2) - 1} L${cx - side * 16} ${eyeY - ry * (1 - e.lid * 2) - 5}`} stroke="#2a1a12" strokeWidth={2} fill="none" strokeLinecap="round" />}
        {e.mouth === 'smile' && <path d={`M${cx - 10} ${eyeY + ry + 2} Q${cx} ${eyeY + ry - 1} ${cx + 10} ${eyeY + ry + 2}`} stroke={shadeHex(skin, -0.25)} strokeWidth={1.2} fill="none" />}
      </g>
    );
  };
  const brow = (cx: number, side: number) => {
    const tilt = e.browTilt * side * 10;
    const thick = id === 'hobbes' || id === 'dunning' ? 4 : id === 'lionel' ? 3.5 : 2.6;
    const col = id === 'hobbes' ? '#e8e6e0' : shadeHex(look.hair, id === 'sera' ? -0.4 : -0.2);
    return <path key={'b' + cx} d={`M${cx - 13} ${browY + tilt} Q${cx} ${browY - 4} ${cx + 13} ${browY - tilt}`} stroke={col} strokeWidth={thick} fill="none" strokeLinecap="round" />;
  };
  const my = 232;
  let mouth;
  switch (e.mouth) {
    case 'smile': mouth = <path d={`M134 ${my} Q150 ${my + 9} 166 ${my}`} stroke="#8a4a42" strokeWidth={3} fill="none" strokeLinecap="round" />; break;
    case 'down': mouth = <path d={`M136 ${my + 4} Q150 ${my - 3} 164 ${my + 4}`} stroke="#8a4a42" strokeWidth={2.6} fill="none" strokeLinecap="round" />; break;
    case 'tight': mouth = <path d={`M138 ${my} L162 ${my}`} stroke="#7a3e38" strokeWidth={2.2} strokeLinecap="round" />; break;
    case 'open': mouth = <path d={`M136 ${my + 2} Q150 ${my - 4} 164 ${my + 2} Q150 ${my + 10} 136 ${my + 2}Z`} fill="#4a1e1a" stroke="#8a4a42" strokeWidth={1.5} />; break;
    case 'o': mouth = <ellipse cx={150} cy={my + 2} rx={6} ry={8} fill="#4a1e1a" stroke="#8a4a42" strokeWidth={1.5} />; break;
    default: mouth = <path d={`M137 ${my} Q150 ${my + 2 + e.smile * 3} 163 ${my}`} stroke="#8a4a42" strokeWidth={2.6} fill="none" strokeLinecap="round" />;
  }
  const lips = id === 'sera' && (e.mouth === 'line' || e.mouth === 'smile' || e.mouth === 'down' || e.mouth === 'tight')
    ? <path d={`M137 ${my} Q144 ${my - 4} 150 ${my - 1} Q156 ${my - 4} 163 ${my} Q150 ${my + 8 + e.smile * 2} 137 ${my}Z`} fill="#d98f8c" opacity={0.85} /> : null;
  return (
    <g>
      {id === 'sera' && <g fill="#f0a4a0" opacity={0.18}><ellipse cx={114} cy={206} rx={13} ry={7} /><ellipse cx={186} cy={206} rx={13} ry={7} /></g>}
      {lips}
      {eye(128, 1)}{eye(172, -1)}
      {brow(128, 1)}{brow(172, -1)}
      {id === 'sera' ? <path d="M148 196 Q146 206 144 208 Q150 212 156 208" stroke={shadeHex(skin, -0.25)} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        : <path d="M150 180 Q146 204 140 210 Q150 216 160 210" stroke={shadeHex(skin, -0.3)} strokeWidth={1.8} fill="none" strokeLinecap="round" />}
      {mouth}
    </g>
  );
}

export const Portrait = memo(function Portrait({ id, expr = 'neutral', chapter = 1, modern = false }: { id: string; expr?: Expr; chapter?: number; modern?: boolean }) {
  const def = CHARACTERS[id];
  if (!def?.look) return null;
  let look = def.look;
  if (id === 'sera' && !modern && chapter >= 3) look = { ...look, dress: '#1a181c', trim: '#2a2830' };
  const e = FACES[expr] ?? FACES.neutral;
  const [bg1, bg2] = BG[id] ?? ['#333', '#111'];
  const gentry = GENTRY.has(id);
  const uid = `p_${id}`;
  const age = look.age;
  return (
    <svg viewBox="0 0 300 380" className="portrait-svg" role="img" aria-label={`${def.name}, ${exprName(expr)}`}>
      <defs>
        <radialGradient id={`${uid}_bg`} cx="45%" cy="35%" r="75%"><stop offset="0" stopColor={bg1} /><stop offset="1" stopColor={bg2} /></radialGradient>
        <radialGradient id={`${uid}_face`} cx="42%" cy="40%" r="65%"><stop offset="0" stopColor={shadeHex(look.skin, 0.12)} /><stop offset="0.7" stopColor={look.skin} /><stop offset="1" stopColor={shadeHex(look.skin, -0.3)} /></radialGradient>
        <filter id={`${uid}_paint`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={id.length * 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" result="d" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="g2"><feFuncA type="linear" slope="0.12" /></feComponentTransfer>
          <feComposite in="g2" in2="d" operator="in" result="tex" />
          <feMerge><feMergeNode in="d" /><feMergeNode in="tex" /></feMerge>
        </filter>
        <clipPath id={`${uid}_oval`}><ellipse cx={150} cy={190} rx={138} ry={178} /></clipPath>
      </defs>
      <g clipPath={`url(#${uid}_oval)`}>
        <rect width={300} height={380} fill={`url(#${uid}_bg)`} />
        <g filter={`url(#${uid}_paint)`}>
          <Hair look={look} back />
          <Clothes id={id} look={look} modern={modern} />
          <path d="M132 240 L130 280 Q150 290 170 280 L168 240Z" fill={shadeHex(look.skin, -0.12)} />
          <ellipse cx={150} cy={178} rx={id === 'tilly' ? 52 : id === 'sera' ? 53 : 56} ry={id === 'tilly' ? 66 : id === 'sera' ? 68 : 72} fill={`url(#${uid}_face)`} />
          <ellipse cx={96} cy={182} rx={8} ry={14} fill={shadeHex(look.skin, -0.15)} />
          <ellipse cx={204} cy={182} rx={8} ry={14} fill={shadeHex(look.skin, -0.15)} />
          {id === 'penrose' && <g><circle cx={96} cy={200} r={3.5} fill="#d8c070" /><circle cx={204} cy={200} r={3.5} fill="#d8c070" /></g>}
          {age > 0.3 && <g stroke={shadeHex(look.skin, -0.28)} strokeWidth={1.2} fill="none" opacity={Math.min(1, age)}>
            <path d="M112 148 Q150 142 188 148" /><path d="M116 190 Q120 196 128 196" /><path d="M184 190 Q180 196 172 196" />
            <path d="M132 220 Q128 234 134 246" /><path d="M168 220 Q172 234 166 246" />
          </g>}
          {(e.mouth === 'smile' || id === 'tilly') && <g fill="#e89a8a" opacity={id === 'tilly' ? 0.35 : 0.2}><ellipse cx={116} cy={210} rx={14} ry={8} /><ellipse cx={184} cy={210} rx={14} ry={8} /></g>}
          {look.extra?.includes('freckles') && <g fill="#b0643a" opacity={0.5}>{[[118, 200], [124, 206], [130, 198], [170, 198], [176, 206], [182, 200], [140, 194], [160, 194]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} />)}</g>}
          <FaceFeatures look={look} e={e} id={id} />
          {look.beard === 'moustache' && <path d="M126 222 Q138 214 150 220 Q162 214 174 222 Q164 230 150 225 Q136 230 126 222Z" fill={look.hair} />}
          {look.beard === 'whiskers' && <path d="M94 170 Q92 240 124 246 Q118 214 108 172Z M206 170 Q208 240 176 246 Q182 214 192 172Z" fill={look.hair} />}
          {look.beard === 'stubble' && <path d="M106 212 Q150 270 194 212 Q186 250 150 256 Q114 250 106 212Z" fill={look.hair} opacity={0.35} />}
          <Hair look={look} back={false} />
          {look.extra?.includes('spectacles') && <g stroke="#8a7a5a" strokeWidth={2} fill="none"><circle cx={132} cy={108} r={11} /><circle cx={168} cy={108} r={11} /><path d="M143 108 L157 108" /></g>}
          {look.extra?.includes('pipe') && <path d="M160 236 Q190 246 204 262 L214 256 L218 270 L200 272Z" fill="#3a2418" />}
          {id === 'dunning' && <g><ellipse cx={150} cy={104} rx={86} ry={14} fill="#2a2a1e" /><path d="M104 104 Q106 60 150 58 Q194 60 196 104Z" fill="#2a2a1e" /></g>}
        </g>
        <ellipse cx={150} cy={190} rx={138} ry={178} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={30} />
      </g>
      <ellipse cx={150} cy={190} rx={140} ry={180} fill="none" stroke={gentry ? '#c69a44' : id === 'sera' ? '#8a7a5a' : '#4a3422'} strokeWidth={gentry ? 9 : 7} />
      {gentry && <ellipse cx={150} cy={190} rx={146} ry={186} fill="none" stroke="#6a4a18" strokeWidth={3} />}
    </svg>
  );
});

function exprName(e: Expr): string {
  return { neutral: 'ruhig', warm: 'freundlich', sad: 'traurig', tense: 'angespannt', angry: 'aufgebracht', surprised: 'überrascht' }[e];
}
