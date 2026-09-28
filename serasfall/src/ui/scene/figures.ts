// Figuren in der Welt: erkennbare Silhouetten nach Stand, Sera, und Yuumi mit vielen kleinen Animationen.
import type { Look } from '../../content/characters';
import { type C2D, shade, hex } from './kit';

export const FEMALE = new Set(['harriet', 'clara', 'penrose', 'pryce', 'tilly', 'sera']);

export interface PoseOpts {
  x: number; foot: number; h: number; // Höhe in px
  facing: 1 | -1; t: number; walk: number; // walk: Phase 0..∞ (0 = steht)
  talk?: boolean; reduced?: boolean; alpha?: number; highlight?: boolean;
}

function headAndHair(ctx: C2D, look: Look, hx: number, hy: number, hr: number, facing: number, id: string) {
  // Hals
  ctx.fillStyle = shade(look.skin, -0.1);
  ctx.fillRect(hx - hr * 0.35, hy + hr * 0.6, hr * 0.7, hr * 0.6);
  // Kopf
  ctx.fillStyle = look.skin;
  ctx.beginPath(); ctx.ellipse(hx, hy, hr * 0.82, hr, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hex(shade(look.skin, -0.25), 0.5);
  ctx.beginPath(); ctx.ellipse(hx - facing * hr * 0.35, hy + hr * 0.1, hr * 0.4, hr * 0.8, 0, 0, Math.PI * 2); ctx.fill();
  // Augenandeutung
  ctx.fillStyle = hex('#1a1210', 0.7);
  ctx.fillRect(hx + facing * hr * 0.25 - 1.5, hy - hr * 0.05, 3, 2);
  ctx.fillRect(hx + facing * hr * 0.65 - 1.2, hy - hr * 0.05, 2.4, 2);
  const hair = look.hair;
  ctx.fillStyle = hair;
  switch (look.hairStyle) {
    case 'bun': case 'blondUp': case 'bunLoose':
      ctx.beginPath(); ctx.ellipse(hx, hy - hr * 0.35, hr * 0.9, hr * 0.7, 0, Math.PI, 0); ctx.fill();
      ctx.beginPath(); ctx.ellipse(hx - facing * hr * 0.75, hy - hr * 0.3, hr * (look.hairStyle === 'bunLoose' ? 0.55 : 0.42), hr * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(hx - hr * 0.88, hy - hr * 0.4, hr * 0.3, hr * 0.7);
      if (look.hairStyle === 'blondUp') { // lose Strähne
        ctx.strokeStyle = hair; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + facing * hr * 0.4, hy - hr * 0.6); ctx.quadraticCurveTo(hx + facing * hr * 0.9, hy, hx + facing * hr * 0.6, hy + hr * 0.6); ctx.stroke();
      }
      break;
    case 'cap': case 'childCap':
      ctx.beginPath(); ctx.ellipse(hx, hy - hr * 0.3, hr * 0.9, hr * 0.7, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#f4f0e6';
      ctx.beginPath(); ctx.ellipse(hx - facing * hr * 0.1, hy - hr * 0.55, hr * (look.hairStyle === 'childCap' ? 1.15 : 1.0), hr * 0.55, 0, Math.PI * 1.05, Math.PI * 1.95 + 0.2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(hx - facing * hr * 0.1, hy - hr * 0.6, hr * 0.95, hr * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      break;
    case 'bald':
      ctx.beginPath(); ctx.ellipse(hx - facing * hr * 0.55, hy, hr * 0.35, hr * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      break;
    case 'short': case 'swept':
      ctx.beginPath(); ctx.ellipse(hx - facing * hr * 0.1, hy - hr * 0.45, hr * 0.9, hr * 0.62, 0, Math.PI, 0); ctx.fill();
      ctx.fillRect(hx - facing * hr * 0.85 - (facing > 0 ? 0 : hr * 0.3), hy - hr * 0.5, hr * 0.35, hr * 0.8);
      if (look.hairStyle === 'swept') { ctx.beginPath(); ctx.ellipse(hx + facing * hr * 0.3, hy - hr * 0.75, hr * 0.5, hr * 0.25, facing * 0.3, 0, Math.PI * 2); ctx.fill(); }
      break;
  }
  if (look.beard === 'moustache') { ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(hx + facing * hr * 0.45, hy + hr * 0.35, hr * 0.35, hr * 0.12, 0, 0, Math.PI * 2); ctx.fill(); }
  if (look.beard === 'whiskers') { ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(hx - facing * hr * 0.1, hy + hr * 0.4, hr * 0.5, hr * 0.5, 0, 0, Math.PI); ctx.fill(); }
  if (look.beard === 'stubble') { ctx.fillStyle = hex(hair, 0.4); ctx.beginPath(); ctx.ellipse(hx + facing * hr * 0.2, hy + hr * 0.5, hr * 0.6, hr * 0.4, 0, 0, Math.PI); ctx.fill(); }
  if (look.extra?.includes('pipe')) { ctx.strokeStyle = '#3a2418'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx + facing * hr * 0.6, hy + hr * 0.45); ctx.lineTo(hx + facing * hr * 1.3, hy + hr * 0.7); ctx.stroke(); }
  if (id === 'dunning') { // Hut
    ctx.fillStyle = '#2a2a1e'; ctx.beginPath(); ctx.ellipse(hx, hy - hr * 0.6, hr * 1.3, hr * 0.22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(hx - hr * 0.7, hy - hr * 1.3, hr * 1.4, hr * 0.75);
  }
}

export function drawPerson(ctx: C2D, id: string, look: Look, o: PoseOpts): void {
  const { x, foot, h, facing, t } = o;
  const female = FEMALE.has(id);
  const bob = o.walk ? Math.abs(Math.sin(o.walk * Math.PI)) * h * 0.012 : o.reduced ? 0 : Math.sin(t * 1.6 + x) * h * 0.004;
  const hr = h * 0.075;
  const shoulderY = foot - h * 0.78 - bob;
  const hy = foot - h * 0.9 - bob;
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;
  // Schatten
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(x, foot, h * 0.16, h * 0.025, 0, 0, Math.PI * 2); ctx.fill();
  const dress = look.dress, trim = look.trim;
  const stride = o.walk ? Math.sin(o.walk * Math.PI) : 0;
  if (female) {
    const waistY = foot - h * 0.58 - bob;
    const sw = h * (id === 'tilly' ? 0.19 : 0.24);
    // Rock
    const g = ctx.createLinearGradient(x - sw, 0, x + sw, 0);
    g.addColorStop(0, shade(dress, -0.35)); g.addColorStop(0.45, dress); g.addColorStop(1, shade(dress, -0.45));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - h * 0.07, waistY);
    ctx.quadraticCurveTo(x - sw * 0.9, waistY + h * 0.2, x - sw - stride * 4, foot);
    ctx.lineTo(x + sw - stride * 4, foot);
    ctx.quadraticCurveTo(x + sw * 0.9, waistY + h * 0.2, x + h * 0.07, waistY);
    ctx.fill();
    // Falten
    ctx.strokeStyle = hex(shade(dress, -0.5), 0.45); ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * h * 0.02, waistY + 6); ctx.quadraticCurveTo(x + i * h * 0.05, waistY + h * 0.3, x + i * sw * 0.4 - stride * 3, foot - 2); ctx.stroke(); }
    // Schürze
    if (id === 'pryce' || id === 'tilly') {
      ctx.fillStyle = trim;
      ctx.beginPath(); ctx.moveTo(x - h * 0.08, waistY); ctx.lineTo(x + h * 0.08, waistY); ctx.lineTo(x + h * 0.12 - stride * 3, foot - h * 0.06); ctx.lineTo(x - h * 0.12 - stride * 3, foot - h * 0.06); ctx.fill();
      if (id === 'pryce') { ctx.fillStyle = '#b8a060'; for (let i = 0; i < 4; i++) ctx.fillRect(x - facing * h * 0.08 + i * 2, waistY + 4 + i * 5, 3, 7); }
    }
    // Mieder
    ctx.fillStyle = shade(dress, -0.05);
    ctx.beginPath(); ctx.moveTo(x - h * 0.085, shoulderY); ctx.lineTo(x + h * 0.085, shoulderY); ctx.lineTo(x + h * 0.06, waistY + 2); ctx.lineTo(x - h * 0.06, waistY + 2); ctx.fill();
    if (look.extra?.includes('shawl')) { ctx.fillStyle = '#16100c'; ctx.beginPath(); ctx.moveTo(x - h * 0.1, shoulderY); ctx.lineTo(x + h * 0.1, shoulderY); ctx.lineTo(x, shoulderY + h * 0.2); ctx.fill(); }
    // Kragen
    ctx.fillStyle = id === 'sera' ? '#e8e0cc' : trim;
    ctx.fillRect(x - h * 0.03, shoulderY - 2, h * 0.06, 4);
    if (look.extra?.includes('jet')) { ctx.fillStyle = '#050405'; ctx.beginPath(); ctx.arc(x, shoulderY + 7, 3, 0, Math.PI * 2); ctx.fill(); }
    // Arme
    ctx.strokeStyle = shade(dress, -0.15); ctx.lineWidth = h * 0.04; ctx.lineCap = 'round';
    const armSwing = stride * 0.2;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(x + s * h * 0.08, shoulderY + 4);
      ctx.quadraticCurveTo(x + s * h * 0.11, shoulderY + h * 0.15, x + s * h * 0.07 + s * armSwing * h * 0.05, waistY + h * 0.02);
      ctx.stroke();
    }
    ctx.fillStyle = shade(look.skin, -0.15);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * h * 0.066 + s * armSwing * h * 0.05, waistY + h * 0.035, h * 0.011, h * 0.015, 0, 0, Math.PI * 2); ctx.fill(); }
  } else {
    const hipY = foot - h * 0.45 - bob;
    // Beine
    ctx.strokeStyle = id === 'dunning' ? '#3a342a' : '#18161a'; ctx.lineWidth = h * 0.055; ctx.lineCap = 'round';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * h * 0.035, hipY); ctx.lineTo(x + s * h * 0.035 + s * stride * h * 0.06, foot - 4); ctx.stroke(); }
    ctx.fillStyle = '#0e0c0c';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * h * 0.035 + s * stride * h * 0.06 + facing * 4, foot - 3, h * 0.035, h * 0.014, 0, 0, Math.PI * 2); ctx.fill(); }
    // Rock / Umhang
    const g = ctx.createLinearGradient(x - h * 0.12, 0, x + h * 0.12, 0);
    g.addColorStop(0, shade(dress, -0.35)); g.addColorStop(0.5, dress); g.addColorStop(1, shade(dress, -0.45));
    ctx.fillStyle = g;
    ctx.beginPath();
    if (id === 'dunning') {
      ctx.moveTo(x - h * 0.09, shoulderY); ctx.lineTo(x + h * 0.09, shoulderY); ctx.lineTo(x + h * 0.16, hipY + h * 0.12); ctx.lineTo(x - h * 0.16, hipY + h * 0.12);
    } else {
      ctx.moveTo(x - h * 0.095, shoulderY); ctx.lineTo(x + h * 0.095, shoulderY); ctx.lineTo(x + h * 0.085, hipY + 4);
      ctx.lineTo(x - facing * h * 0.02, hipY + h * 0.17); ctx.lineTo(x - facing * h * 0.11, hipY + h * 0.15); ctx.lineTo(x - h * 0.085, hipY + 4);
    }
    ctx.fill();
    // Hemd, Weste
    if (id !== 'dunning') {
      ctx.fillStyle = '#efe9dc'; ctx.beginPath(); ctx.moveTo(x - h * 0.03, shoulderY); ctx.lineTo(x + h * 0.03, shoulderY); ctx.lineTo(x, shoulderY + h * 0.12); ctx.fill();
      ctx.fillStyle = id === 'hobbes' ? '#1a1a1c' : trim; ctx.fillRect(x - 3, shoulderY + h * 0.02, 6, h * 0.04);
    }
    if (look.extra?.includes('armband')) { ctx.fillStyle = '#050405'; ctx.fillRect(x - facing * h * 0.12 - 5, shoulderY + h * 0.12, 10, 8); }
    ctx.strokeStyle = shade(dress, -0.1); ctx.lineWidth = h * 0.045; ctx.lineCap = 'round';
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(x + s * h * 0.09, shoulderY + 4);
      ctx.lineTo(x + s * h * 0.11 - s * stride * h * 0.04 * s, hipY + h * 0.03); ctx.stroke();
    }
    ctx.fillStyle = look.extra?.includes('gloves') ? '#d8d6d0' : shade(look.skin, -0.15);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * h * 0.108 - stride * h * 0.04, hipY + h * 0.05, h * 0.012, h * 0.016, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  headAndHair(ctx, look, x + facing * hr * 0.1, hy, hr, facing, id);
  if (o.highlight) {
    ctx.strokeStyle = 'rgba(255,230,170,0.35)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, foot, h * 0.2, h * 0.035, 0, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

/** Sera in der Kleidung ihrer jeweiligen Lage. */
export function seraLook(base: Look, chapter: number, flags: Record<string, true>, loc: string): Look {
  const modern = chapter === 0 || (chapter === 1 && !flags['k1_dressed']);
  if (modern) return { ...base, dress: '#e8dcc4', trim: '#3a5a8a', hairStyle: 'blondUp' };
  if (chapter >= 3 || (chapter === 2 && flags['k2_black'])) return { ...base, dress: '#1a181c', trim: '#2a2830' };
  return base;
}

export function drawModernSera(ctx: C2D, look: Look, o: PoseOpts) {
  // Pullover + Jeans: eigene Silhouette statt Rock
  const { x, foot, h, facing, t } = o;
  const bob = o.walk ? Math.abs(Math.sin(o.walk * Math.PI)) * h * 0.012 : 0;
  const stride = o.walk ? Math.sin(o.walk * Math.PI) : 0;
  const hipY = foot - h * 0.46 - bob, shoulderY = foot - h * 0.78 - bob;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x, foot, h * 0.14, h * 0.025, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#3a5a8a'; ctx.lineWidth = h * 0.06; ctx.lineCap = 'round';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * h * 0.035, hipY); ctx.lineTo(x + s * h * 0.035 + s * stride * h * 0.06, foot - 5); ctx.stroke(); }
  ctx.fillStyle = '#c8d8a0';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * h * 0.035 + s * stride * h * 0.06 + facing * 3, foot - 3, h * 0.03, h * 0.014, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#e8dcc4';
  ctx.beginPath(); ctx.moveTo(x - h * 0.1, shoulderY); ctx.lineTo(x + h * 0.1, shoulderY); ctx.lineTo(x + h * 0.1, hipY + h * 0.04); ctx.lineTo(x - h * 0.1, hipY + h * 0.04); ctx.fill();
  ctx.strokeStyle = '#d8ccb4'; ctx.lineWidth = h * 0.045; ctx.lineCap = 'round';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * h * 0.1, shoulderY + 4); ctx.lineTo(x + s * h * 0.12 - stride * h * 0.03, hipY + h * 0.02); ctx.stroke(); }
  ctx.fillStyle = shade(look.skin, -0.12);
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * h * 0.12 - stride * h * 0.03, hipY + h * 0.045, h * 0.011, h * 0.015, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  headAndHair(ctx, look, x + facing * h * 0.0075, foot - h * 0.9 - bob, h * 0.075, facing, 'sera');
}

// ------------------------------------------------------------------ Yuumi
export type CatState = 'walk' | 'sit' | 'groom' | 'sleep' | 'stretch' | 'look';
export interface CatPose { x: number; foot: number; s: number; facing: 1 | -1; state: CatState; t: number; stateT: number; walk: number; reduced?: boolean; controlled?: boolean; alpha?: number }

const FUR = '#8e9096', FUR_D = '#6a6c72', FUR_L = '#b4b6ba', PAW = '#f2efe8', EYE = '#e8b830';

export function drawCat(ctx: C2D, p: CatPose): void {
  const { x, foot, s, facing, t } = p;
  ctx.save();
  if (p.alpha !== undefined) ctx.globalAlpha = p.alpha;
  ctx.translate(x, foot);
  ctx.scale(facing * s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(0, 0, 26, 4, 0, 0, Math.PI * 2); ctx.fill();
  const tail = (baseX: number, baseY: number, curl: number) => {
    const sw = p.reduced ? 0 : Math.sin(t * 2.2) * 6 + Math.sin(t * 5.3) * 2;
    ctx.strokeStyle = FUR_D; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.bezierCurveTo(baseX - 14, baseY - 6 + curl, baseX - 22 + sw, baseY - 22, baseX - 16 + sw * 1.4, baseY - 34 + curl * 0.5); ctx.stroke();
    ctx.strokeStyle = FUR; ctx.lineWidth = 3; ctx.stroke();
  };
  const head = (hx: number, hy: number, tilt = 0, eyes: 'open' | 'closed' | 'half' = 'open') => {
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt);
    const twitch = p.reduced ? 0 : (Math.sin(t * 0.7) > 0.97 ? -0.25 : 0);
    ctx.fillStyle = FUR;
    ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(-6 + twitch * 4, -17); ctx.lineTo(-1, -8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(3, -8); ctx.lineTo(8, -17); ctx.lineTo(10, -5); ctx.fill();
    ctx.fillStyle = '#d8a8a8'; ctx.beginPath(); ctx.moveTo(6, -8); ctx.lineTo(8, -14); ctx.lineTo(9, -7); ctx.fill();
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(2, -2, 11, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = FUR_L; ctx.beginPath(); ctx.ellipse(8, 2, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c88a8a'; ctx.beginPath(); ctx.arc(11.5, 0.5, 1.4, 0, Math.PI * 2); ctx.fill();
    const blink = p.reduced ? false : (t % 4.3) < 0.13;
    if (eyes === 'closed' || blink) { ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(6, -3, 2, 0.2, Math.PI - 0.2); ctx.stroke(); }
    else { ctx.fillStyle = EYE; ctx.beginPath(); ctx.ellipse(6, -3, 2.4, eyes === 'half' ? 1.2 : 2.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#1a1a10'; ctx.fillRect(6.3, -4.8, 0.9, 3.6); }
    // Streifen
    ctx.strokeStyle = FUR_D; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-2, -9); ctx.lineTo(-1, -5); ctx.moveTo(1, -10); ctx.lineTo(1.5, -6); ctx.stroke();
    ctx.restore();
  };
  const collar = (cx: number, cy: number) => {
    ctx.strokeStyle = '#b02a2a'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy - 4, 6, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.fillStyle = '#e0b440'; ctx.beginPath(); ctx.arc(cx + 1, cy + 3, 2.6, 0, Math.PI * 2); ctx.fill();
    if (!p.reduced && Math.sin(t * 3) > 0.8) { ctx.fillStyle = 'rgba(255,255,220,0.9)'; ctx.fillRect(cx, cy + 1.5, 1.5, 1.5); }
  };
  const st = p.state;
  if (st === 'walk' || st === 'stretch') {
    const ph = p.walk * Math.PI * 2;
    const bob = Math.abs(Math.sin(ph)) * 1.2;
    tail(-18, -22, 0);
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, -18 - bob, 20, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = FUR_D; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.ellipse(i * 7, -25 - bob, 2, 5, 0.3, 0, Math.PI * 2); ctx.fill(); }
    const legs = [[-13, 0], [-8, Math.PI], [9, Math.PI], [14, 0]];
    ctx.strokeStyle = FUR; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (const [lx, off] of legs) { const sw = Math.sin(ph + off) * 4; ctx.beginPath(); ctx.moveTo(lx, -14 - bob); ctx.lineTo(lx + sw, -2); ctx.stroke(); ctx.fillStyle = PAW; ctx.beginPath(); ctx.ellipse(lx + sw + 1, -1.5, 3, 1.8, 0, 0, Math.PI * 2); ctx.fill(); }
    head(21, -26 - bob, st === 'stretch' ? -0.3 : 0);
    collar(18, -20 - bob);
  } else if (st === 'sit' || st === 'look' || st === 'groom') {
    tail(-8, -2, 14);
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(-2, -14, 13, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = FUR_L; ctx.beginPath(); ctx.ellipse(4, -16, 6, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = PAW; ctx.beginPath(); ctx.ellipse(6, -1.5, 3.2, 2, 0, 0, Math.PI * 2); ctx.ellipse(-1, -1.5, 3.2, 2, 0, 0, Math.PI * 2); ctx.fill();
    if (st === 'groom') {
      const lick = p.reduced ? 0 : Math.sin(t * 6) * 2;
      ctx.strokeStyle = FUR; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(4, -18); ctx.lineTo(10, -26 + lick); ctx.stroke();
      ctx.fillStyle = PAW; ctx.beginPath(); ctx.arc(10.5, -27 + lick, 3, 0, Math.PI * 2); ctx.fill();
      head(6, -33, 0.5, 'closed');
    } else {
      const lookUp = st === 'look' ? -0.35 : Math.sin(t * 0.4) * 0.08;
      head(5, -32, lookUp, 'open');
    }
    collar(4, -24);
  } else if (st === 'sleep') {
    const br = p.reduced ? 0 : Math.sin(t * 1.4) * 0.8;
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, -8 - br * 0.3, 20, 9 + br * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = FUR_D; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -6, 17, 0.3, Math.PI * 0.95); ctx.stroke();
    ctx.fillStyle = PAW; ctx.beginPath(); ctx.ellipse(12, -2, 3.2, 2, 0, 0, Math.PI * 2); ctx.fill();
    head(12, -10, 0.4, 'closed');
    collar(10, -6);
  }
  if (p.controlled) {
    ctx.strokeStyle = 'rgba(232,184,48,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(0, 0, 30, 6, 0, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

/** Blasse Gestalten (Mystik): weich, fast durchsichtig. */
export function ghostly(ctx: C2D, draw: () => void, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = 'blur(2px)';
  draw();
  ctx.restore();
}
