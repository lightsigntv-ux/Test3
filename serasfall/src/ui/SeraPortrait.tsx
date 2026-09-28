// Seras Porträt, detaillierter gemalt: Verläufe, Haarsträhnen, Augen mit Iris-Verlauf und Glanz.
import type { Expr } from '../engine/types';

const F: Record<Expr, { brow: number; tilt: number; open: number; lid: number; mouth: 'soft' | 'smile' | 'down' | 'tight' | 'open' | 'o' }> = {
  neutral: { brow: 0, tilt: 0, open: 1, lid: 0.12, mouth: 'soft' },
  warm: { brow: -2, tilt: -0.05, open: 0.82, lid: 0.22, mouth: 'smile' },
  sad: { brow: -1, tilt: 0.4, open: 0.78, lid: 0.42, mouth: 'down' },
  tense: { brow: 3, tilt: -0.12, open: 0.92, lid: 0.28, mouth: 'tight' },
  angry: { brow: 5, tilt: -0.45, open: 0.95, lid: 0.25, mouth: 'open' },
  surprised: { brow: -7, tilt: 0.1, open: 1.3, lid: 0, mouth: 'o' },
};

export function SeraPortrait({ expr, modern, mourning }: { expr: Expr; modern: boolean; mourning: boolean }) {
  const e = F[expr] ?? F.neutral;
  const eyeY = 182, by = 160 + e.brow;
  const eye = (cx: number, s: number) => {
    const ry = 8.5 * e.open;
    const lidY = eyeY - ry * (1 - e.lid * 2);
    return (
      <g key={cx}>
        <ellipse cx={cx} cy={eyeY} rx={13} ry={ry} fill="#fbf7f2" />
        <circle cx={cx + s * 0.5} cy={eyeY + 0.5} r={Math.min(7, ry)} fill="url(#sp_iris)" />
        <circle cx={cx + s * 0.5} cy={eyeY + 0.5} r={Math.min(3, ry * 0.45)} fill="#10151a" />
        <circle cx={cx + 2.5} cy={eyeY - 2.5} r={2} fill="#fff" />
        <circle cx={cx - 2} cy={eyeY + 3} r={0.9} fill="#fff" opacity={0.7} />
        <path d={`M${cx - 15} ${lidY - 2} Q${cx} ${eyeY - ry - 4 + e.lid * 9} ${cx + 15} ${lidY - 2} L${cx + 15} ${eyeY - ry - 9} L${cx - 15} ${eyeY - ry - 9}Z`} fill="url(#sp_skin)" />
        <path d={`M${cx - 14} ${lidY} Q${cx} ${eyeY - ry - 3 + e.lid * 9} ${cx + 14} ${lidY}`} stroke="#2a1a14" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <path d={`M${cx - s * 13} ${lidY - 1} l${-s * 5} -4 M${cx - s * 9} ${lidY - 3} l${-s * 3} -4`} stroke="#2a1a14" strokeWidth={1.6} strokeLinecap="round" />
        <path d={`M${cx - 11} ${eyeY + ry + 3} Q${cx} ${eyeY + ry + 6} ${cx + 11} ${eyeY + ry + 3}`} stroke="#d9b7a6" strokeWidth={1} fill="none" opacity={0.7} />
        <path d={`M${cx - 14} ${lidY - 11} Q${cx} ${lidY - 15} ${cx + 14} ${lidY - 11}`} stroke="#e2c2ae" strokeWidth={1} fill="none" opacity={0.6} />
      </g>
    );
  };
  const brow = (cx: number, s: number) => {
    const t = e.tilt * s * 10;
    return <path key={'b' + cx} d={`M${cx - 15} ${by + 2 + t} Q${cx - s * 2} ${by - 5} ${cx + 15} ${by + 1 - t}`} stroke="#a8844a" strokeWidth={3.2} fill="none" strokeLinecap="round" />;
  };
  const my = 240;
  const mouth = {
    soft: <g><path d={`M136 ${my} Q143 ${my - 5} 150 ${my - 2} Q157 ${my - 5} 164 ${my} Q150 ${my + 9} 136 ${my}Z`} fill="url(#sp_lip)" /><path d={`M136 ${my} Q150 ${my + 2} 164 ${my}`} stroke="#a25a58" strokeWidth={1.4} fill="none" /></g>,
    smile: <g><path d={`M132 ${my - 2} Q150 ${my + 12} 168 ${my - 2} Q150 ${my + 5} 132 ${my - 2}Z`} fill="url(#sp_lip)" /><path d={`M132 ${my - 2} Q150 ${my + 6} 168 ${my - 2}`} stroke="#9a4e4c" strokeWidth={1.6} fill="none" strokeLinecap="round" /></g>,
    down: <g><path d={`M138 ${my + 3} Q150 ${my - 3} 162 ${my + 3} Q150 ${my + 7} 138 ${my + 3}Z`} fill="url(#sp_lip)" /></g>,
    tight: <path d={`M139 ${my} Q150 ${my + 1} 161 ${my}`} stroke="#a25a58" strokeWidth={2.6} fill="none" strokeLinecap="round" />,
    open: <path d={`M137 ${my} Q150 ${my - 5} 163 ${my} Q150 ${my + 12} 137 ${my}Z`} fill="#5a2426" stroke="#c07a76" strokeWidth={2} />,
    o: <ellipse cx={150} cy={my + 2} rx={6} ry={8} fill="#5a2426" stroke="#c07a76" strokeWidth={2} />,
  }[e.mouth];
  const hair = '#ecd08e';
  return (
    <g>
      <defs>
        <linearGradient id="sp_hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6e2a8" /><stop offset="0.5" stopColor={hair} /><stop offset="1" stopColor="#c9a560" /></linearGradient>
        <linearGradient id="sp_hairB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8b672" /><stop offset="1" stopColor="#a8864a" /></linearGradient>
        <radialGradient id="sp_skin" cx="45%" cy="38%" r="70%"><stop offset="0" stopColor="#fcebdf" /><stop offset="0.7" stopColor="#f3dccb" /><stop offset="1" stopColor="#d9b39c" /></radialGradient>
        <radialGradient id="sp_iris" cx="50%" cy="40%" r="60%"><stop offset="0" stopColor="#8fb4c4" /><stop offset="0.7" stopColor="#4a6a78" /><stop offset="1" stopColor="#2a3e48" /></radialGradient>
        <linearGradient id="sp_lip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d88c88" /><stop offset="1" stopColor="#c07470" /></linearGradient>
        <linearGradient id="sp_knit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d8c9ac" /><stop offset="0.5" stopColor="#f2e8d6" /><stop offset="1" stopColor="#d2c2a4" /></linearGradient>
      </defs>
      {/* Haare hinten */}
      <path d="M80 172 Q70 80 150 72 Q230 80 220 172 Q236 272 226 390 L74 390 Q64 272 80 172Z" fill="url(#sp_hairB)" />
      {/* Kleidung */}
      {modern ? (
        <g>
          <path d="M26 390 Q34 286 150 272 Q266 286 274 390Z" fill="url(#sp_knit)" />
          {[70, 90, 210, 230].map((x) => <path key={x} d={`M${x} 300 Q${x + (x < 150 ? -6 : 6)} 340 ${x} 390`} stroke="#cbbb9c" strokeWidth={2} fill="none" opacity={0.7} />)}
          <path d="M120 278 L150 390 L180 278 Q150 294 120 278Z" fill="#fbfaf6" />
          <path d="M120 278 L150 390 M180 278 L150 390" stroke="#cdbd9e" strokeWidth={6} fill="none" />
          <path d="M130 284 Q150 312 170 284" stroke="#d9b45a" strokeWidth={1.3} fill="none" />
          <circle cx={150} cy={310} r={3} fill="#e2c068" stroke="#b08a3a" strokeWidth={0.8} />
        </g>
      ) : (
        <g>
          <path d="M36 390 Q46 292 150 274 Q254 292 264 390Z" fill={mourning ? '#1c1a20' : '#2f4a3a'} />
          <path d="M60 330 Q150 350 240 330" stroke={mourning ? '#2c2a32' : '#3f5e4a'} strokeWidth={2} fill="none" />
          <path d="M124 272 Q150 296 176 272 L174 288 Q150 308 126 288Z" fill="#f6f1e4" />
          <path d="M126 288 Q150 306 174 288" stroke="#ddd3bc" strokeWidth={2} fill="none" strokeDasharray="2 3" />
          <ellipse cx={150} cy={306} rx={9} ry={11} fill={mourning ? '#0c0a0e' : '#efe4c8'} stroke="#b8964a" strokeWidth={2.2} />
          {!mourning && <path d="M146 302 Q150 298 154 302 Q152 310 150 312 Q148 310 146 302Z" fill="#c9a88a" />}
        </g>
      )}
      {/* Hals */}
      <path d="M134 238 L132 282 Q150 292 168 282 L166 238Z" fill="#e6c7b2" />
      <path d="M134 262 Q150 272 166 262" stroke="#d4af98" strokeWidth={4} fill="none" opacity={0.5} />
      {/* Gesicht */}
      <path d="M98 176 Q98 118 150 112 Q202 118 202 176 Q202 222 180 242 Q164 256 150 256 Q136 256 120 242 Q98 222 98 176Z" fill="url(#sp_skin)" />
      <ellipse cx={98} cy={188} rx={7} ry={13} fill="#ebc8b2" />
      <ellipse cx={202} cy={188} rx={7} ry={13} fill="#ebc8b2" />
      <circle cx={98} cy={202} r={2.5} fill="#e8d8a8" />
      <circle cx={202} cy={202} r={2.5} fill="#e8d8a8" />
      <g fill="#f2a4a0" opacity={0.22}><ellipse cx={116} cy={212} rx={14} ry={8} /><ellipse cx={184} cy={212} rx={14} ry={8} /></g>
      {eye(128, 1)}{eye(172, -1)}
      {brow(128, 1)}{brow(172, -1)}
      <path d="M150 190 Q147 208 144 213 Q150 217 156 213" stroke="#cf9f88" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <ellipse cx={151} cy={204} rx={2} ry={6} fill="#fff" opacity={0.25} />
      {mouth}
      {/* Haare vorn: Mittelscheitel, Curtain Bangs, lange Strähnen */}
      <path d="M92 176 Q84 84 150 80 Q216 84 208 176 Q204 136 184 120 Q168 112 152 100 Q150 112 142 118 Q130 128 118 128 Q100 138 92 176Z" fill="url(#sp_hair)" />
      <path d="M152 100 Q126 126 114 160 Q110 140 118 128 Q138 118 152 100Z" fill="#f6e2a8" opacity={0.6} />
      <path d="M92 150 Q80 232 94 300 Q100 340 80 390 L112 390 Q124 316 112 244 Q106 204 108 164Z" fill="url(#sp_hair)" />
      <path d="M208 150 Q220 232 206 300 Q200 340 220 390 L188 390 Q176 316 188 244 Q194 204 192 164Z" fill="url(#sp_hair)" />
      <g stroke="#fff3cc" strokeWidth={1.6} fill="none" opacity={0.55} strokeLinecap="round">
        <path d="M118 104 Q140 92 170 102" /><path d="M100 190 Q94 250 104 320" /><path d="M200 190 Q206 250 196 320" /><path d="M188 132 Q198 150 200 176" />
      </g>
      <g stroke="#b8944e" strokeWidth={1.2} fill="none" opacity={0.5}>
        <path d="M96 200 Q92 260 100 340" /><path d="M204 200 Q208 260 200 340" /><path d="M150 84 L152 100" />
      </g>
    </g>
  );
}
