// Sera in der Szene, detaillierter gezeichnet: Profil mit Gesicht, lange Haare mit Glanz, Kleidung mit Stoffschatten.
import type { Look } from '../../content/characters';
import { type C2D, shade } from './kit';
import type { PoseOpts } from './figures';

const HAIR = '#ecd08e', HAIR_L = '#f8e6b0', HAIR_D = '#c49e58', SKIN = '#f3dccb', SKIN_D = '#dcb8a2';

function lg(ctx: C2D, x0: number, x1: number, stops: [number, string][]) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  for (const [o, c] of stops) g.addColorStop(o, c);
  return g;
}

export function drawSera(ctx: C2D, look: Look, o: PoseOpts, modern: boolean) {
  const { x, foot, h, facing: f, t } = o;
  const walk = o.walk ? Math.sin(o.walk * Math.PI) : 0;
  const bob = o.walk ? Math.abs(walk) * h * 0.012 : o.reduced ? 0 : Math.sin(t * 1.6) * h * 0.003;
  const hr = h * 0.072;
  const hy = foot - h * 0.9 - bob, hx = x + f * hr * 0.12;
  const shY = foot - h * 0.775 - bob, waistY = foot - h * 0.58 - bob, hipY = foot - h * 0.47 - bob;
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // Schatten
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x, foot, h * 0.15, h * 0.024, 0, 0, Math.PI * 2); ctx.fill();

  // Haare hinten (lang, über den Rücken)
  const sway = o.reduced ? 0 : Math.sin(t * 1.2) * 1.5 + walk * 2;
  ctx.fillStyle = lg(ctx, hx - hr * 1.2, hx + hr * 1.2, [[0, HAIR_D], [0.5, HAIR], [1, HAIR_D]]);
  ctx.beginPath();
  ctx.moveTo(hx - hr * 0.95, hy - hr * 0.2);
  ctx.quadraticCurveTo(hx - hr * 1.15 - f * hr * 0.2, hy + hr * 2, hx - hr * 0.9 - f * hr * 0.35 + sway, hy + hr * 3.3);
  ctx.lineTo(hx + hr * 0.9 - f * hr * 0.35 + sway, hy + hr * 3.3);
  ctx.quadraticCurveTo(hx + hr * 1.15 - f * hr * 0.2, hy + hr * 2, hx + hr * 0.95, hy - hr * 0.2);
  ctx.closePath(); ctx.fill();

  const arm = (s: number, color: string, w: number, endY: number, hand = true) => {
    const sx = x + s * h * 0.085, ex = x + s * h * 0.095 - walk * s * h * 0.03;
    ctx.strokeStyle = color; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(sx, shY + 5); ctx.quadraticCurveTo(sx + s * h * 0.03, (shY + endY) / 2, ex, endY); ctx.stroke();
    if (hand) { ctx.fillStyle = SKIN_D; ctx.beginPath(); ctx.ellipse(ex, endY + h * 0.018, h * 0.012, h * 0.017, 0, 0, Math.PI * 2); ctx.fill(); }
  };

  if (modern) {
    // Weite Jeans
    for (const s of [-1, 1]) {
      const fx = x + s * h * 0.05 + s * walk * h * 0.05;
      ctx.fillStyle = lg(ctx, fx - h * 0.04, fx + h * 0.04, [[0, '#6d8db0'], [0.45, '#a8c1dc'], [1, '#6a88aa']]);
      ctx.beginPath(); ctx.moveTo(x + s * h * 0.004, hipY); ctx.lineTo(x + s * h * 0.072, hipY);
      ctx.lineTo(fx + s * h * 0.04, foot - 6); ctx.lineTo(fx - s * h * 0.034, foot - 6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(40,60,90,0.35)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#c8d8a0'; ctx.beginPath(); ctx.ellipse(fx + f * 3, foot - 3, h * 0.03, h * 0.013, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6a8a4a'; ctx.beginPath(); ctx.arc(fx + f * 3, foot - 4, 1.4, 0, Math.PI * 2); ctx.fill();
    }
    // weißes Top
    ctx.fillStyle = '#f8f6f1'; ctx.fillRect(x - h * 0.06, shY, h * 0.12, hipY - shY + h * 0.015);
    // Strickjacke
    ctx.fillStyle = lg(ctx, x - h * 0.14, x + h * 0.14, [[0, '#cdbd9e'], [0.3, '#ece0ca'], [0.7, '#f2e8d6'], [1, '#c8b796']]);
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(x + s * h * 0.025, shY - 1); ctx.lineTo(x + s * h * 0.11, shY + 3);
      ctx.quadraticCurveTo(x + s * h * 0.14, waistY, x + s * h * 0.135, hipY + h * 0.1); ctx.lineTo(x + s * h * 0.045, hipY + h * 0.1); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(160,140,110,0.5)'; ctx.lineWidth = 1;
    for (const s of [-1, 1]) for (const dx of [0.07, 0.1]) { ctx.beginPath(); ctx.moveTo(x + s * h * dx, shY + 8); ctx.quadraticCurveTo(x + s * h * (dx + 0.01), waistY, x + s * h * dx, hipY + h * 0.08); ctx.stroke(); }
    for (let i = 0; i < 3; i++) { const yy = hipY + h * 0.075 + i * 2.5; ctx.beginPath(); ctx.moveTo(x - h * 0.135, yy); ctx.lineTo(x - h * 0.045, yy); ctx.moveTo(x + h * 0.045, yy); ctx.lineTo(x + h * 0.135, yy); ctx.stroke(); }
    arm(-1, '#e4d7bf', h * 0.055, hipY + h * 0.01); arm(1, '#e4d7bf', h * 0.055, hipY + h * 0.01);
    // Goldkette
    ctx.strokeStyle = '#d9b45a'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(x, shY + 1, h * 0.02, 0.3, Math.PI - 0.3); ctx.stroke();
  } else {
    const dress = look.dress;
    // Rock mit Faltenwurf
    const sw = h * 0.23;
    ctx.fillStyle = lg(ctx, x - sw, x + sw, [[0, shade(dress, -0.4)], [0.35, shade(dress, 0.08)], [0.55, dress], [1, shade(dress, -0.5)]]);
    ctx.beginPath(); ctx.moveTo(x - h * 0.06, waistY);
    ctx.quadraticCurveTo(x - sw * 0.85, waistY + h * 0.2, x - sw - walk * 4, foot);
    ctx.lineTo(x + sw - walk * 4, foot);
    ctx.quadraticCurveTo(x + sw * 0.85, waistY + h * 0.2, x + h * 0.06, waistY); ctx.fill();
    ctx.strokeStyle = shade(dress, -0.5); ctx.globalAlpha *= 0.5; ctx.lineWidth = 1.3;
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * h * 0.015, waistY + 5); ctx.quadraticCurveTo(x + i * h * 0.045, waistY + h * 0.3, x + i * sw * 0.3 - walk * 3, foot - 2); ctx.stroke(); }
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.fillStyle = shade(dress, -0.3); ctx.fillRect(x - sw - walk * 4, foot - 5, sw * 2, 3);
    // Mieder, schmal tailliert
    ctx.fillStyle = lg(ctx, x - h * 0.08, x + h * 0.08, [[0, shade(dress, -0.3)], [0.5, shade(dress, 0.05)], [1, shade(dress, -0.35)]]);
    ctx.beginPath(); ctx.moveTo(x - h * 0.08, shY); ctx.lineTo(x + h * 0.08, shY); ctx.quadraticCurveTo(x + h * 0.07, waistY - h * 0.05, x + h * 0.052, waistY + 3);
    ctx.lineTo(x, waistY + 7); ctx.lineTo(x - h * 0.052, waistY + 3); ctx.quadraticCurveTo(x - h * 0.07, waistY - h * 0.05, x - h * 0.08, shY); ctx.fill();
    ctx.strokeStyle = shade(dress, 0.2); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x, shY + 6); ctx.lineTo(x, waistY + 5); ctx.stroke();
    ctx.fillStyle = shade(dress, 0.3); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(x, shY + 9 + i * (waistY - shY - 10) / 5, 0.9, 0, Math.PI * 2); ctx.fill(); }
    // Puffärmel
    arm(-1, shade(dress, -0.15), h * 0.042, waistY + h * 0.03); arm(1, shade(dress, -0.2), h * 0.042, waistY + h * 0.03);
    ctx.fillStyle = shade(dress, -0.05);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * h * 0.085, shY + 6, h * 0.03, h * 0.035, 0, 0, Math.PI * 2); ctx.fill(); }
    // Spitzenkragen + Brosche
    ctx.fillStyle = '#f6f1e4'; ctx.beginPath(); ctx.ellipse(x, shY + 1, h * 0.042, h * 0.016, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#e2d8c0'; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(x + i * h * 0.012, shY + h * 0.012, 1, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = look.dress === '#1a181c' ? '#0a080c' : '#efe4c8'; ctx.strokeStyle = '#b8964a'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.ellipse(x, shY + h * 0.03, 2.4, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  // Hals
  ctx.fillStyle = SKIN_D; ctx.fillRect(hx - hr * 0.28, hy + hr * 0.55, hr * 0.56, shY - (hy + hr * 0.55) + 2);
  // Kopf (Dreiviertelprofil)
  ctx.fillStyle = SKIN;
  ctx.beginPath(); ctx.ellipse(hx, hy, hr * 0.78, hr * 0.98, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + f * hr * 0.25, hy + hr * 0.55, hr * 0.42, hr * 0.38, 0, 0, Math.PI * 2); ctx.fill(); // Kinn
  // Augen, Blinzeln
  const blink = !o.reduced && (t % 3.7) < 0.12;
  const ex1 = hx + f * hr * 0.18, ex2 = hx + f * hr * 0.58, ey = hy - hr * 0.02;
  if (blink) { ctx.strokeStyle = '#3a2418'; ctx.lineWidth = 1; for (const ex of [ex1, ex2]) { ctx.beginPath(); ctx.moveTo(ex - 2.2, ey); ctx.lineTo(ex + 2.2, ey); ctx.stroke(); } }
  else {
    for (const [ex, w] of [[ex1, 2.6], [ex2, 2]] as const) {
      ctx.fillStyle = '#fbf7f2'; ctx.beginPath(); ctx.ellipse(ex, ey, w, 1.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4a6a78'; ctx.beginPath(); ctx.arc(ex + f * 0.4, ey + 0.2, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10151a'; ctx.beginPath(); ctx.arc(ex + f * 0.4, ey + 0.2, 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2a1a14'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ex - w, ey - 0.8); ctx.quadraticCurveTo(ex, ey - 2.6, ex + w + f * 0.8, ey - 1.4); ctx.stroke();
    }
  }
  ctx.strokeStyle = '#a8844a'; ctx.lineWidth = 0.9;
  for (const ex of [ex1, ex2]) { ctx.beginPath(); ctx.moveTo(ex - 2.4, ey - 4); ctx.quadraticCurveTo(ex, ey - 5.2, ex + 2.4, ey - 4.2); ctx.stroke(); }
  // Nase, Wange, Mund (Sprechen)
  ctx.strokeStyle = SKIN_D; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(hx + f * hr * 0.55, ey + 2); ctx.lineTo(hx + f * hr * 0.66, ey + hr * 0.3); ctx.lineTo(hx + f * hr * 0.5, ey + hr * 0.34); ctx.stroke();
  ctx.fillStyle = 'rgba(240,160,156,0.3)'; ctx.beginPath(); ctx.ellipse(hx + f * hr * 0.15, hy + hr * 0.3, hr * 0.2, hr * 0.12, 0, 0, Math.PI * 2); ctx.fill();
  const open = o.talk && !o.reduced ? Math.abs(Math.sin(t * 14)) * 1.6 : 0;
  ctx.fillStyle = '#c47a76'; ctx.beginPath(); ctx.ellipse(hx + f * hr * 0.42, hy + hr * 0.58, hr * 0.17, 0.9 + open, 0, 0, Math.PI * 2); ctx.fill();

  // Haare vorn: Oberkopf, Scheitel, Pony, lange Strähne über der Schulter
  ctx.fillStyle = lg(ctx, hx - hr, hx + hr, [[0, HAIR_D], [0.4, HAIR], [0.7, HAIR_L], [1, HAIR]]);
  ctx.beginPath(); ctx.moveTo(hx - hr * 0.95, hy + hr * 0.1);
  ctx.quadraticCurveTo(hx - hr * 1.0, hy - hr * 1.15, hx + f * hr * 0.1, hy - hr * 1.08);
  ctx.quadraticCurveTo(hx + hr * 0.95, hy - hr * 1.0, hx + hr * 0.9, hy - hr * 0.1);
  ctx.quadraticCurveTo(hx + f * hr * 0.55, hy - hr * 0.7, hx + f * hr * 0.1, hy - hr * 0.62);
  ctx.quadraticCurveTo(hx - f * hr * 0.4, hy - hr * 0.5, hx - hr * 0.95, hy + hr * 0.1);
  ctx.fill();
  ctx.beginPath(); // Strähne vorn über die Schulter
  ctx.moveTo(hx + f * hr * 0.75, hy - hr * 0.5);
  ctx.quadraticCurveTo(hx + f * hr * 1.0, hy + hr * 0.8, hx + f * hr * 0.75 + sway * 0.5, hy + hr * 2.4);
  ctx.lineTo(hx + f * hr * 0.45 + sway * 0.5, hy + hr * 2.3);
  ctx.quadraticCurveTo(hx + f * hr * 0.7, hy + hr * 0.8, hx + f * hr * 0.55, hy - hr * 0.3);
  ctx.fill();
  ctx.strokeStyle = HAIR_L; ctx.lineWidth = 1; ctx.globalAlpha *= 0.8;
  ctx.beginPath(); ctx.moveTo(hx - hr * 0.5, hy - hr * 0.85); ctx.quadraticCurveTo(hx + f * hr * 0.2, hy - hr * 1.05, hx + hr * 0.5, hy - hr * 0.8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx - f * hr * 0.6, hy); ctx.quadraticCurveTo(hx - f * hr * 0.8, hy + hr * 1.6, hx - f * hr * 0.55 + sway, hy + hr * 3); ctx.stroke();
  ctx.globalAlpha = o.alpha ?? 1;

  if (o.highlight) { ctx.strokeStyle = 'rgba(255,230,170,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, foot, h * 0.2, h * 0.035, 0, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
}
