// Mal-Werkzeugkasten für Canvas: Farbe, Rauschen, Pinselstriche, viktorianische Bauteile.
export const W = 1280;
export const H = 720;

export type C2D = CanvasRenderingContext2D;

/** Deterministischer Zufall, damit gemalte Räume bei jedem Aufruf gleich aussehen. */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

export function hex(c: string, a = 1): string {
  const n = parseInt(c.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function shade(c: string, f: number): string {
  const n = parseInt(c.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function mix(a: string, b: string, t: number): string {
  const na = parseInt(a.slice(1), 16), nb = parseInt(b.slice(1), 16);
  const m = (s: number) => Math.round(((na >> s) & 255) * (1 - t) + ((nb >> s) & 255) * t);
  return '#' + ((1 << 24) + (m(16) << 16) + (m(8) << 8) + m(0)).toString(16).slice(1);
}

export function rect(ctx: C2D, x: number, y: number, w: number, h: number, fill: string | CanvasGradient) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
}

export function vgrad(ctx: C2D, y0: number, y1: number, stops: [number, string][]) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

export function hgrad(ctx: C2D, x0: number, x1: number, stops: [number, string][]) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

export function radial(ctx: C2D, x: number, y: number, r: number, stops: [number, string][]) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

/** Pinselstriche über eine Fläche: gibt gemalte Anmutung. */
export function brush(ctx: C2D, x: number, y: number, w: number, h: number, color: string, n: number, seed: number, len = 18, alpha = 0.06, vertical = false) {
  const r = rng(seed);
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const px = x + r() * w, py = y + r() * h;
    const l = len * (0.5 + r());
    const a = vertical ? Math.PI / 2 + (r() - 0.5) * 0.3 : (r() - 0.5) * 0.5;
    ctx.strokeStyle = hex(r() > 0.5 ? shade(color, 0.15) : shade(color, -0.2), alpha * (0.5 + r()));
    ctx.lineWidth = 1 + r() * 3;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px + Math.cos(a) * l * 0.5 + (r() - 0.5) * 4, py + Math.sin(a) * l * 0.5 + (r() - 0.5) * 4, px + Math.cos(a) * l, py + Math.sin(a) * l);
    ctx.stroke();
  }
  ctx.restore();
}

/** Papier-/Stichtextur als eigenes Canvas (einmal erzeugt). */
let grainCanvas: HTMLCanvasElement | null = null;
export function grain(): HTMLCanvasElement {
  if (grainCanvas) return grainCanvas;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d')!;
  const img = g.createImageData(W, H);
  const r = rng(77);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (r() - 0.5) * 60;
    img.data[i] = v; img.data[i + 1] = v * 0.97; img.data[i + 2] = v * 0.9; img.data[i + 3] = 22;
  }
  g.putImageData(img, 0, 0);
  // feine Schraffur wie bei einem Stich
  g.globalAlpha = 0.035;
  g.strokeStyle = '#2a1d10';
  for (let i = -H; i < W; i += 5) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + H, H); g.stroke(); }
  g.globalAlpha = 1;
  // Vignette
  const v = g.createRadialGradient(W / 2, H * 0.45, H * 0.35, W / 2, H * 0.5, H * 0.95);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(12,6,2,0.55)');
  g.fillStyle = v; g.fillRect(0, 0, W, H);
  grainCanvas = c;
  return c;
}

// ------------------------------------------------------------------ Bauteile

export function wallpaper(ctx: C2D, x: number, y: number, w: number, h: number, base: string, motif: string, seed: number, kind: 'damask' | 'stripe' | 'plain' | 'panel' | 'plaster' = 'damask') {
  rect(ctx, x, y, w, h, vgrad(ctx, y, y + h, [[0, shade(base, -0.15)], [0.5, base], [1, shade(base, -0.25)]]));
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  if (kind === 'stripe') {
    for (let i = x; i < x + w; i += 28) { rect(ctx, i, y, 9, h, hex(motif, 0.18)); rect(ctx, i + 13, y, 2, h, hex(motif, 0.12)); }
  } else if (kind === 'damask') {
    ctx.fillStyle = hex(motif, 0.16);
    for (let row = 0, py = y + 20; py < y + h; py += 58, row++) {
      for (let px = x + (row % 2) * 34; px < x + w; px += 68) {
        ctx.beginPath();
        ctx.moveTo(px, py - 18);
        ctx.bezierCurveTo(px + 14, py - 10, px + 12, py + 6, px, py + 18);
        ctx.bezierCurveTo(px - 12, py + 6, px - 14, py - 10, px, py - 18);
        ctx.fill();
        ctx.beginPath(); ctx.arc(px, py - 22, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(px - 11, py + 2, 6, 3, -0.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(px + 11, py + 2, 6, 3, 0.6, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (kind === 'panel') {
    for (let i = x; i < x + w; i += 110) {
      ctx.strokeStyle = hex(shade(base, -0.4), 0.5); ctx.lineWidth = 3;
      ctx.strokeRect(i + 12, y + 14, 86, h - 28);
      ctx.strokeStyle = hex(shade(base, 0.25), 0.25); ctx.lineWidth = 1;
      ctx.strokeRect(i + 15, y + 17, 80, h - 34);
    }
  } else if (kind === 'plaster') {
    brush(ctx, x, y, w, h, base, 500, seed + 3, 40, 0.07);
    const r = rng(seed + 9);
    for (let i = 0; i < 14; i++) {
      ctx.strokeStyle = hex(shade(base, -0.4), 0.18); ctx.lineWidth = 1;
      const cx = x + r() * w, cy = y + r() * h;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      for (let k = 0; k < 4; k++) ctx.lineTo(cx + (r() - 0.5) * 40, cy + r() * 30 * (k + 1) / 3);
      ctx.stroke();
    }
  }
  ctx.restore();
  brush(ctx, x, y, w, h, base, Math.floor(w * h / 900), seed, 22, 0.05, true);
}

export function wainscot(ctx: C2D, x: number, y: number, w: number, h: number, wood: string, seed: number) {
  rect(ctx, x, y, w, h, vgrad(ctx, y, y + h, [[0, shade(wood, 0.1)], [1, shade(wood, -0.35)]]));
  for (let i = x + 10; i < x + w - 20; i += 95) {
    ctx.fillStyle = hex(shade(wood, -0.25), 0.6);
    ctx.fillRect(i, y + 14, 80, h - 28);
    ctx.strokeStyle = hex(shade(wood, 0.3), 0.35); ctx.lineWidth = 1.5;
    ctx.strokeRect(i + 0.5, y + 14.5, 80, h - 28);
  }
  rect(ctx, x, y - 6, w, 8, shade(wood, 0.15));
  rect(ctx, x, y - 6, w, 2, hex('#ffffff', 0.12));
  brush(ctx, x, y, w, h, wood, Math.floor(w / 3), seed, 30, 0.08);
}

export function floorBoards(ctx: C2D, y: number, wood: string, seed: number, stone = false) {
  const h = H - y;
  rect(ctx, 0, y, W, h, vgrad(ctx, y, H, [[0, shade(wood, -0.3)], [0.4, wood], [1, shade(wood, -0.15)]]));
  ctx.save();
  if (stone) {
    const r = rng(seed);
    for (let row = 0, py = y; py < H; row++) {
      const rh = 22 + row * 14;
      for (let px = -((row * 37) % 90); px < W; px += 90 + row * 30) {
        ctx.fillStyle = hex(r() > 0.5 ? shade(wood, 0.08) : shade(wood, -0.08), 0.8);
        ctx.fillRect(px + 2, py + 2, 86 + row * 30, rh - 4);
      }
      py += rh;
    }
  } else {
    ctx.strokeStyle = hex(shade(wood, -0.5), 0.45); ctx.lineWidth = 1;
    const vx = W / 2, vy = y - 500;
    for (let i = -30; i <= 30; i++) {
      const bx = vx + i * 60;
      ctx.beginPath();
      const t = (y - vy) / (H - vy);
      ctx.moveTo(vx + (bx - vx) * t, y);
      ctx.lineTo(bx, H);
      ctx.stroke();
    }
  }
  ctx.restore();
  brush(ctx, 0, y, W, h, wood, 400, seed, 50, 0.06);
  rect(ctx, 0, y, W, 5, hex('#000000', 0.35));
}

export function rug(ctx: C2D, cx: number, y: number, w: number, h: number, base: string, border: string) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.4, y); ctx.lineTo(cx + w * 0.4, y); ctx.lineTo(cx + w / 2, y + h); ctx.lineTo(cx - w / 2, y + h); ctx.closePath();
  ctx.fillStyle = base; ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = border; ctx.stroke();
  ctx.clip();
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = i % 2 ? border : shade(base, 0.3);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx, y + h / 2, w * 0.3 - i * 12, h * 0.35 - i * 3, 0, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

export interface WinOpts { outside: string[]; curtain?: string; closed?: number; bars?: boolean; arch?: boolean }
export function windowFrame(ctx: C2D, x: number, y: number, w: number, h: number, o: WinOpts) {
  // Laibung
  rect(ctx, x - 10, y - 10, w + 20, h + 22, '#3a2c20');
  ctx.save();
  ctx.beginPath();
  if (o.arch) { ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); }
  else ctx.rect(x, y, w, h);
  ctx.clip();
  rect(ctx, x, y, w, h, vgrad(ctx, y, y + h, o.outside.map((c, i) => [i / Math.max(1, o.outside.length - 1), c] as [number, string])));
  ctx.restore();
  if (o.bars !== false) {
    ctx.strokeStyle = '#2b2118'; ctx.lineWidth = 5;
    ctx.strokeRect(x, y, w, h);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
    for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x, y + (h * i) / 3); ctx.lineTo(x + w, y + (h * i) / 3); ctx.stroke(); }
  }
  // Fensterbank
  rect(ctx, x - 16, y + h + 8, w + 32, 10, '#5a4634');
}

export function curtains(ctx: C2D, x: number, y: number, w: number, h: number, color: string, closed: number, sway = 0) {
  const each = (w / 2) * (0.25 + closed * 0.75);
  for (const side of [0, 1]) {
    const x0 = side ? x + w - each : x - 20;
    const cw = each + 20;
    ctx.save();
    const g = hgrad(ctx, x0, x0 + cw, [[0, shade(color, -0.4)], [0.3, color], [0.5, shade(color, -0.3)], [0.7, shade(color, 0.1)], [1, shade(color, -0.45)]]);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x0, y - 30);
    ctx.lineTo(x0 + cw, y - 30);
    ctx.quadraticCurveTo(x0 + cw + sway * (side ? -1 : 1), y + h / 2, x0 + cw - (side ? -8 : 8), y + h + 40);
    ctx.lineTo(x0, y + h + 40);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = hex(shade(color, -0.55), 0.5); ctx.lineWidth = 2;
    for (let i = 1; i < 5; i++) { const fx = x0 + (cw * i) / 5; ctx.beginPath(); ctx.moveTo(fx, y - 30); ctx.quadraticCurveTo(fx + sway * 0.3, y + h / 2, fx + 2, y + h + 40); ctx.stroke(); }
    ctx.restore();
  }
  // Pelmet
  rect(ctx, x - 30, y - 42, w + 60, 22, vgrad(ctx, y - 42, y - 20, [[0, shade(color, 0.1)], [1, shade(color, -0.4)]]));
  ctx.fillStyle = shade(color, -0.2);
  for (let i = x - 30; i < x + w + 30; i += 16) { ctx.beginPath(); ctx.arc(i + 8, y - 20, 6, 0, Math.PI); ctx.fill(); }
}

export function door(ctx: C2D, x: number, y: number, w: number, h: number, wood: string, open = false, frame = '#3b2a1c') {
  rect(ctx, x - 12, y - 16, w + 24, h + 16, frame);
  rect(ctx, x - 12, y - 16, w + 24, 5, hex('#ffffff', 0.08));
  if (open) {
    rect(ctx, x, y, w, h, vgrad(ctx, y, y + h, [[0, '#0c0907'], [1, '#1a130d']]));
    ctx.fillStyle = shade(wood, -0.1);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * 0.22, y + 10); ctx.lineTo(x + w * 0.22, y + h - 4); ctx.lineTo(x, y + h); ctx.fill();
    return;
  }
  rect(ctx, x, y, w, h, vgrad(ctx, y, y + h, [[0, shade(wood, 0.08)], [1, shade(wood, -0.25)]]));
  const pw = (w - 30) / 2;
  for (const [px, py, ph] of [[x + 10, y + 12, h * 0.36], [x + 20 + pw, y + 12, h * 0.36], [x + 10, y + h * 0.45, h * 0.48], [x + 20 + pw, y + h * 0.45, h * 0.48]]) {
    rect(ctx, px, py, pw, ph, shade(wood, -0.18));
    ctx.strokeStyle = hex(shade(wood, 0.3), 0.3); ctx.lineWidth = 1; ctx.strokeRect(px + 0.5, py + 0.5, pw, ph);
  }
  ctx.fillStyle = '#c8a24a';
  ctx.beginPath(); ctx.arc(x + w - 14, y + h * 0.52, 4, 0, Math.PI * 2); ctx.fill();
  brush(ctx, x, y, w, h, wood, 40, x | 0, 30, 0.08, true);
}

export function fireplace(ctx: C2D, cx: number, floor: number, w: number, h: number, stone: string, grate = true) {
  const x = cx - w / 2, y = floor - h;
  rect(ctx, x, y, w, h, vgrad(ctx, y, floor, [[0, shade(stone, 0.1)], [1, shade(stone, -0.2)]]));
  rect(ctx, x - 16, y - 14, w + 32, 16, shade(stone, 0.2));
  rect(ctx, x - 16, y - 14, w + 32, 3, hex('#ffffff', 0.2));
  const ow = w * 0.56, oh = h * 0.62;
  ctx.fillStyle = '#0d0806';
  ctx.beginPath();
  ctx.moveTo(cx - ow / 2, floor); ctx.lineTo(cx - ow / 2, floor - oh * 0.7);
  ctx.quadraticCurveTo(cx, floor - oh * 1.1, cx + ow / 2, floor - oh * 0.7); ctx.lineTo(cx + ow / 2, floor); ctx.fill();
  if (grate) {
    ctx.strokeStyle = '#2a2420'; ctx.lineWidth = 3;
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(cx + i * ow * 0.12, floor - 30); ctx.lineTo(cx + i * ow * 0.12, floor - 6); ctx.stroke(); }
  }
  // Messinggitter
  ctx.strokeStyle = '#a8843c'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx - w * 0.45, floor + 6); ctx.lineTo(cx + w * 0.45, floor + 6); ctx.stroke();
  brush(ctx, x, y, w, h, stone, 80, cx | 0, 20, 0.08);
}

export function bookshelf(ctx: C2D, x: number, y: number, w: number, h: number, wood: string, seed: number, glass = false) {
  rect(ctx, x, y, w, h, shade(wood, -0.35));
  const r = rng(seed);
  const rows = Math.max(2, Math.floor(h / 70));
  const rh = h / rows;
  const colors = ['#6b2a22', '#28402c', '#2c3552', '#6a5024', '#3b2430', '#503a28', '#1f2a24', '#7a5a2a'];
  for (let i = 0; i < rows; i++) {
    const by = y + i * rh;
    let bx = x + 6;
    while (bx < x + w - 10) {
      const bw = 6 + r() * 12, bh = rh * (0.6 + r() * 0.3);
      const col = colors[Math.floor(r() * colors.length)];
      rect(ctx, bx, by + rh - bh - 6, bw, bh, vgrad(ctx, by, by + rh, [[0, shade(col, 0.15)], [1, shade(col, -0.3)]]));
      if (r() > 0.6) rect(ctx, bx + 1, by + rh - bh + 6, bw - 2, 2, hex('#d6b25a', 0.6));
      bx += bw + (r() > 0.92 ? 10 : 1);
    }
    rect(ctx, x, by + rh - 6, w, 6, shade(wood, 0.05));
  }
  ctx.strokeStyle = shade(wood, 0.1); ctx.lineWidth = 8; ctx.strokeRect(x, y, w, h);
  if (glass) {
    ctx.fillStyle = hex('#cfe0ff', 0.06); ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = hex('#1a120c', 0.8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
  }
}

export function frame(ctx: C2D, x: number, y: number, w: number, h: number, inner: (ctx: C2D) => void, gilt = true) {
  rect(ctx, x - 10, y - 10, w + 20, h + 20, gilt ? vgrad(ctx, y - 10, y + h + 10, [[0, '#d8b35c'], [0.5, '#8a6424'], [1, '#c69a44']]) : '#3a2a1c');
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); inner(ctx); ctx.restore();
  ctx.strokeStyle = hex('#000000', 0.4); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
}

export function candleStick(ctx: C2D, x: number, y: number, tallow = false, h = 34) {
  ctx.fillStyle = '#b89449';
  ctx.beginPath(); ctx.ellipse(x, y, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
  rect(ctx, x - 3, y - 14, 6, 14, '#9c7a38');
  rect(ctx, x - 5, y - h, 10, h - 14, tallow ? '#e2d29c' : '#f3ecd8');
  rect(ctx, x - 5, y - h, 3, h - 14, hex('#ffffff', 0.3));
}

export function flame(ctx: C2D, x: number, y: number, t: number, s = 1, reduced = false) {
  const f = reduced ? 1 : 1 + Math.sin(t * 13 + x) * 0.08 + Math.sin(t * 29 + y) * 0.05;
  const sway = reduced ? 0 : Math.sin(t * 7 + x * 0.1) * 1.5;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = radial(ctx, x, y - 6 * s, 22 * s * f, [[0, 'rgba(255,200,110,0.45)'], [1, 'rgba(255,140,40,0)']]);
  ctx.fillRect(x - 30 * s, y - 36 * s, 60 * s, 60 * s);
  ctx.restore();
  ctx.fillStyle = 'rgba(255,214,140,0.95)';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 6 * s, x + sway, y - 14 * s * f);
  ctx.quadraticCurveTo(x + 4 * s, y - 6 * s, x, y);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,230,0.9)';
  ctx.beginPath(); ctx.ellipse(x + sway * 0.3, y - 4 * s, 1.6 * s, 3.2 * s, 0, 0, Math.PI * 2); ctx.fill();
}

export function fire(ctx: C2D, cx: number, floor: number, w: number, t: number, reduced = false, strength = 1) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = radial(ctx, cx, floor - 20, w * 1.6, [[0, `rgba(255,150,60,${0.35 * strength})`], [1, 'rgba(255,90,20,0)']]);
  ctx.fillRect(cx - w * 2, floor - w * 2, w * 4, w * 2.4);
  ctx.restore();
  // Glut
  ctx.fillStyle = `rgba(180,50,10,${0.9 * strength})`;
  ctx.beginPath(); ctx.ellipse(cx, floor - 10, w * 0.35, 8, 0, 0, Math.PI * 2); ctx.fill();
  const n = 7;
  for (let i = 0; i < n; i++) {
    const fx = cx + (i - n / 2) * (w / n) * 0.7;
    const ph = reduced ? 0.5 : (Math.sin(t * (4 + i) + i * 2) + 1) / 2;
    const fh = (20 + ph * 30) * strength;
    ctx.fillStyle = i % 2 ? `rgba(255,170,60,${0.8 * strength})` : `rgba(255,110,30,${0.8 * strength})`;
    ctx.beginPath();
    ctx.moveTo(fx - 8, floor - 10);
    ctx.quadraticCurveTo(fx - 6 + ph * 6, floor - 10 - fh * 0.6, fx + (reduced ? 0 : Math.sin(t * 6 + i) * 4), floor - 10 - fh);
    ctx.quadraticCurveTo(fx + 6, floor - 10 - fh * 0.5, fx + 8, floor - 10);
    ctx.fill();
  }
}

export function rainOn(ctx: C2D, x: number, y: number, w: number, h: number, t: number, amount: number, reduced = false, seed = 1) {
  if (amount <= 0) return;
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const r = rng(seed);
  const n = Math.floor(w * h / 700 * amount);
  ctx.strokeStyle = 'rgba(200,215,230,0.35)'; ctx.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    const px = x + r() * w;
    const speed = 300 + r() * 300;
    const py = y + ((r() * h + (reduced ? 0 : t * speed)) % (h + 40)) - 20;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 3, py + 14); ctx.stroke();
  }
  // Tropfen, die an der Scheibe hinablaufen
  ctx.fillStyle = 'rgba(220,230,240,0.35)';
  for (let i = 0; i < n / 8; i++) {
    const px = x + r() * w;
    const py = y + ((r() * h + (reduced ? 0 : t * (20 + r() * 30))) % h);
    ctx.beginPath(); ctx.ellipse(px, py, 1.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export function dust(ctx: C2D, x: number, y: number, w: number, h: number, t: number, seed: number) {
  const r = rng(seed);
  ctx.fillStyle = 'rgba(255,240,210,0.35)';
  for (let i = 0; i < 26; i++) {
    const px = x + ((r() * w + Math.sin(t * 0.3 + i) * 20 + t * 4) % w);
    const py = y + ((r() * h + Math.cos(t * 0.2 + i) * 15 + t * 2) % h);
    ctx.beginPath(); ctx.arc(px, py, 0.6 + r() * 1.2, 0, Math.PI * 2); ctx.fill();
  }
}

export function sky(tod: string, weather: string, chapter: number): string[] {
  if (weather === 'dawn') return ['#3b4466', '#8e6f7a', '#e0a877'];
  if (weather === 'storm') return ['#2a3326', '#50583c', '#6b6a40'];
  if (weather === 'snow') return ['#6a7280', '#9aa1ab', '#c9ccd0'];
  switch (tod) {
    case 'morgen': return ['#4d5864', '#76818a', '#9aa2a4'];
    case 'mittag': return ['#6e7a86', '#9aa4aa', '#b8bcb8'];
    case 'nachmittag': return ['#5d6570', '#8b8f8c', '#a89f86'];
    case 'abend': return ['#1d2437', '#3a3c52', '#6a5a5c'];
    default: return chapter === 5 ? ['#0b0f1d', '#141b2e', '#1d2438'] : ['#0a0d16', '#121827', '#1b2233'];
  }
}
