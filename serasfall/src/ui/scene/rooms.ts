// Die gemalten Orte. Jeder Ort: statische Ebene (einmal gemalt, gecacht), dynamische Ebene (pro Bild) und Lichtquellen.
import {
  W, H, type C2D, rect, vgrad, hgrad, radial, brush, wallpaper, wainscot, floorBoards, rug, windowFrame, curtains, door,
  fireplace, bookshelf, frame, candleStick, flame, fire, rainOn, dust, sky, shade, hex, rng, mix,
} from './kit';

export interface Env {
  loc: string;
  tod: string;
  weather: 'rain' | 'storm' | 'fog' | 'calm' | 'dawn' | 'snow';
  chapter: number;
  flags: Record<string, true>;
  reduced: boolean;
}

export interface Light { x: number; y: number; r: number; color: string; flicker?: number; strength?: number }

export interface Room {
  paint: (ctx: C2D, e: Env) => void;
  dyn?: (ctx: C2D, e: Env, t: number) => void;
  front?: (ctx: C2D, e: Env, t: number) => void; // Vordergrund über Figuren
  lights: (e: Env) => Light[];
  dark: (e: Env) => number; // Grunddunkelheit 0..1
  footY?: number;
  scale?: number;
}

export const FLOOR = Math.round(H * 0.72);
const X = (f: number) => Math.round(f * W);
const Y = (f: number) => Math.round(f * H);

const rainAmt = (e: Env) => (e.weather === 'storm' ? 1.6 : e.weather === 'rain' ? 1 : e.weather === 'fog' ? 0.2 : 0);
const baseDark = (e: Env, interior = true) => {
  const m: Record<string, number> = { morgen: 0.5, mittag: 0.34, nachmittag: 0.44, abend: 0.64, nacht: 0.8 };
  let d = m[e.tod] ?? 0.5;
  if (e.weather === 'storm') d += 0.1;
  if (e.weather === 'dawn') d = 0.62;
  if (!interior) d -= 0.12;
  return Math.max(0.1, Math.min(0.9, d));
};
const outside = (e: Env) => sky(e.tod, e.weather, e.chapter);
const winLight = (e: Env) => (e.tod === 'nacht' || e.tod === 'abend' ? 'rgba(90,110,170,0.5)' : e.weather === 'dawn' ? 'rgba(255,190,150,0.6)' : 'rgba(190,200,215,0.7)');
const mourning = (e: Env) => e.chapter >= 1 && e.chapter <= 5;

// ------------------------------------------------------------------ Halle
const halle: Room = {
  paint(ctx, e) {
    wallpaper(ctx, 0, 0, W, FLOOR, '#3d4a3f', '#cbb98a', 11, 'stripe');
    // Galerie oben
    rect(ctx, X(0.3), 0, W - X(0.3), 118, vgrad(ctx, 0, 118, [[0, '#1c1712'], [1, '#2c231a']]));
    for (const dx of [0.42, 0.6, 0.78, 0.93]) door(ctx, X(dx) - 34, 18, 68, 92, '#4a3322', false);
    rect(ctx, X(0.3), 112, W - X(0.3), 14, '#5a4028');
    for (let bx = X(0.31); bx < W; bx += 22) { rect(ctx, bx, 126, 7, 44, vgrad(ctx, 126, 170, [[0, '#6a4c30'], [1, '#3a2a1a']])); }
    rect(ctx, X(0.3), 168, W - X(0.3), 12, '#4a3422');
    wainscot(ctx, 0, 410, W, FLOOR - 410, '#4a3526', 12);
    // Haustür mit Oberlicht
    const dx = X(0.13) - 62;
    rect(ctx, dx - 8, 210, 140, 60, '#2f2419');
    ctx.save(); ctx.beginPath(); ctx.arc(dx + 62, 268, 58, Math.PI, 0); ctx.clip();
    rect(ctx, dx, 200, 124, 70, vgrad(ctx, 200, 270, outside(e).map((c, i) => [i / 2, c] as [number, string])));
    ctx.strokeStyle = '#2f2419'; ctx.lineWidth = 3;
    for (let a = 0; a < 6; a++) { ctx.beginPath(); ctx.moveTo(dx + 62, 268); ctx.lineTo(dx + 62 + Math.cos(Math.PI + a * Math.PI / 5) * 60, 268 + Math.sin(Math.PI + a * Math.PI / 5) * 60); ctx.stroke(); }
    ctx.restore();
    door(ctx, dx, 270, 124, FLOOR - 270, '#3b2616');
    if (mourning(e)) { ctx.fillStyle = '#0c0a0c'; ctx.beginPath(); ctx.moveTo(dx + 40, 276); ctx.lineTo(dx + 84, 276); ctx.lineTo(dx + 62, 330); ctx.fill(); }
    // Durchgang zum Salon (links)
    door(ctx, 0, 250, X(0.05), FLOOR - 250, '#3b2616', true);
    // Porträt
    frame(ctx, X(0.3) - 48, Y(0.22), 96, 124, (c) => {
      rect(c, X(0.3) - 48, Y(0.22), 96, 124, vgrad(c, Y(0.22), Y(0.22) + 124, [[0, '#2b2a24'], [1, '#14120e']]));
      c.fillStyle = '#d9bfa2'; c.beginPath(); c.ellipse(X(0.3), Y(0.22) + 52, 18, 23, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#8a8580'; c.beginPath(); c.ellipse(X(0.3) - 16, Y(0.22) + 60, 6, 14, 0.2, 0, Math.PI * 2); c.ellipse(X(0.3) + 16, Y(0.22) + 60, 6, 14, -0.2, 0, Math.PI * 2); c.fill();
      rect(c, X(0.3) - 8, Y(0.22) + 36, 16, 4, '#b0a080');
      c.fillStyle = '#18161a'; c.beginPath(); c.moveTo(X(0.3) - 40, Y(0.22) + 124); c.quadraticCurveTo(X(0.3), Y(0.22) + 70, X(0.3) + 40, Y(0.22) + 124); c.fill();
    });
    if (mourning(e)) { ctx.fillStyle = hex('#0a090b', 0.85); ctx.beginPath(); ctx.moveTo(X(0.3) - 60, Y(0.22) - 12); ctx.lineTo(X(0.3) + 60, Y(0.22) - 12); ctx.lineTo(X(0.3) + 30, Y(0.22) + 30); ctx.lineTo(X(0.3) - 30, Y(0.22) + 30); ctx.fill(); }
    // Dienstbotentür unter der Treppe
    door(ctx, X(0.36) - 28, 400, 56, FLOOR - 400, '#4b3625');
    // Treppe
    const sx0 = X(0.4), sy0 = FLOOR, lx = X(0.54), ly = 300;
    const steps = 12;
    // Wange der Treppe
    ctx.fillStyle = '#2a1c12';
    ctx.beginPath(); ctx.moveTo(sx0, sy0); ctx.lineTo(lx, ly); ctx.lineTo(lx + 90, ly); ctx.lineTo(sx0 + 90, sy0); ctx.fill();
    for (let i = 0; i < steps; i++) {
      const sh = (sy0 - ly) / steps;
      const x0 = sx0 + ((lx - sx0) * i) / steps, y0 = sy0 - sh * i;
      rect(ctx, x0, y0 - sh, 90, sh, vgrad(ctx, y0 - sh, y0, [[0, '#8a6444'], [0.3, '#5a3e28'], [1, '#2e2016']]));
      rect(ctx, x0, y0 - sh, 90, 3, hex('#e8c89a', 0.25));
    }
    // Läufer
    ctx.fillStyle = hex('#7a2424', 0.75);
    ctx.beginPath(); ctx.moveTo(sx0 + 20, sy0); ctx.lineTo(lx + 20, ly); ctx.lineTo(lx + 70, ly); ctx.lineTo(sx0 + 70, sy0); ctx.fill();
    ctx.strokeStyle = hex('#c8a24a', 0.5); ctx.lineWidth = 2;
    for (let i = 1; i < steps; i++) { const x0 = sx0 + 20 + ((lx - sx0) * i) / steps, y0 = sy0 - ((sy0 - ly) * i) / steps; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + 50, y0); ctx.stroke(); }
    // Podest mit Fenstersitz (Unterseite holzvertäfelt)
    rect(ctx, lx + 40, ly + 14, X(0.67) - lx - 40, FLOOR - ly - 14, vgrad(ctx, ly, FLOOR, [[0, '#4a3524'], [1, '#3a2a1c']]));
    for (let py = ly + 30; py < FLOOR - 20; py += 64) { ctx.strokeStyle = hex('#1a120c', 0.5); ctx.lineWidth = 2; ctx.strokeRect(lx + 56, py, X(0.67) - lx - 72, 50); }
    rect(ctx, lx, ly - 4, X(0.67) - lx, 18, vgrad(ctx, ly - 4, ly + 14, [[0, '#6a4a30'], [1, '#3a2818']]));
    windowFrame(ctx, X(0.58) - 50, 150, 100, 130, { outside: outside(e), arch: true });
    rect(ctx, X(0.58) - 62, 282, 124, 18, '#6a4a34');
    rect(ctx, X(0.58) - 58, 272, 116, 12, '#7c5a70');
    for (const sx of [X(0.58) - 70, X(0.58) + 50]) { rect(ctx, sx, 140, 20, 150, hgrad(ctx, sx, sx + 20, [[0, '#3a1418'], [0.5, '#6a2a30'], [1, '#3a1418']])); }
    // Geländer
    ctx.strokeStyle = '#2c1e12'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(sx0 + 88, sy0 - 80); ctx.lineTo(lx + 88, ly - 80); ctx.lineTo(X(0.67), ly - 80); ctx.stroke();
    ctx.lineWidth = 3;
    for (let i = 0; i <= steps; i += 1) { const x0 = sx0 + 88 + ((lx - sx0) * i) / steps, y0 = sy0 - ((sy0 - ly) * i) / steps; ctx.beginPath(); ctx.moveTo(x0, y0 - 80); ctx.lineTo(x0, y0 - 18); ctx.stroke(); }
    ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(sx0 + 88, sy0 - 90); ctx.lineTo(sx0 + 88, sy0); ctx.stroke();
    ctx.fillStyle = '#3a2818'; ctx.beginPath(); ctx.arc(sx0 + 88, sy0 - 94, 9, 0, Math.PI * 2); ctx.fill();
    // Standuhr
    const cx = X(0.69);
    rect(ctx, cx - 26, 290, 52, FLOOR - 290, vgrad(ctx, 290, FLOOR, [[0, '#5a3a22'], [1, '#2a1a10']]));
    rect(ctx, cx - 30, 280, 60, 14, '#6a4a2c');
    ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.arc(cx, 318, 19, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2a1d10'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, 318, 19, 0, Math.PI * 2); ctx.stroke();
    // 6.25 – angehalten
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, 318); ctx.lineTo(cx + 3, 331); ctx.moveTo(cx, 318); ctx.lineTo(cx + 12, 324); ctx.stroke();
    rect(ctx, cx - 14, 350, 28, 120, hex('#000000', 0.35));
    // Tür Arbeitszimmer, Bibliothek
    door(ctx, X(0.8) - 44, 290, 88, FLOOR - 290, '#4a3020');
    door(ctx, X(0.955) - 40, 290, 80, FLOOR - 290, '#4a3020');
    if (mourning(e)) { rect(ctx, X(0.8) - 44, 300, 88, 6, '#0b0a0c'); }
    floorBoards(ctx, FLOOR, '#5c4633', 13, true);
    rug(ctx, X(0.62), FLOOR + 40, 420, 120, '#5a2226', '#2c1a14');
    // Tisch mit Kerzen
    rect(ctx, X(0.1) - 5, 450, 10, 70, '#2a1c12');
  },
  dyn(ctx, e, t) {
    rainOn(ctx, X(0.58) - 50, 150, 100, 130, t, rainAmt(e), e.reduced, 3);
    rainOn(ctx, X(0.13) - 60, 210, 120, 60, t, rainAmt(e), e.reduced, 5);
    candleStick(ctx, X(0.1) - 14, 452); candleStick(ctx, X(0.1) + 14, 452);
    flame(ctx, X(0.1) - 14, 418, t, 1, e.reduced); flame(ctx, X(0.1) + 14, 418, t + 1, 1, e.reduced);
    if (!e.reduced && (e.tod === 'morgen' || e.tod === 'mittag')) dust(ctx, X(0.52), 170, 170, 260, t, 9);
    if (e.chapter === 5) { rect(ctx, X(0.66) - 2, 170, 4, 6, '#f5d88c'); }
  },
  front(ctx, e) { camera(ctx, e); },
  lights: (e) => [
    { x: X(0.1), y: 418, r: 260, color: 'rgba(255,190,120,0.9)', flicker: 1 },
    { x: X(0.58), y: 210, r: 300, color: winLight(e), strength: e.tod === 'nacht' ? 0.4 : 1 },
    ...(e.chapter === 5 || e.tod === 'nacht' ? [{ x: X(0.66), y: 180, r: 260, color: 'rgba(255,200,130,0.8)', flicker: 0.3 }] : []),
  ],
  dark: (e) => baseDark(e),
};

function camera(ctx: C2D, e: Env) {
  const cx = X(0.24), fy = FLOOR + 70;
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(cx, fy - 150); ctx.lineTo(cx - 34, fy); ctx.moveTo(cx, fy - 150); ctx.lineTo(cx + 30, fy); ctx.moveTo(cx, fy - 150); ctx.lineTo(cx + 4, fy + 8); ctx.stroke();
  rect(ctx, cx - 36, fy - 200, 72, 56, '#4a3220');
  rect(ctx, cx + 30, fy - 186, 22, 28, '#b08a40');
  ctx.fillStyle = '#1a1512'; ctx.beginPath(); ctx.arc(cx + 52, fy - 172, 11, 0, Math.PI * 2); ctx.fill();
  if (!e.flags['g_plate_dev'] && e.chapter >= 1 && e.chapter <= 4) {
    ctx.fillStyle = hex('#0d0b0e', 0.92);
    ctx.beginPath(); ctx.moveTo(cx - 48, fy - 150); ctx.quadraticCurveTo(cx - 44, fy - 214, cx, fy - 212); ctx.quadraticCurveTo(cx + 44, fy - 214, cx + 46, fy - 150);
    ctx.lineTo(cx + 40, fy - 118); ctx.lineTo(cx - 44, fy - 116); ctx.closePath(); ctx.fill();
  } else if (e.chapter >= 1) {
    ctx.fillStyle = hex('#0d0b0e', 0.9); rect(ctx, cx - 60, fy - 6, 40, 10, hex('#0d0b0e', 0.9));
  }
}

// ------------------------------------------------------------------ Salon
const salon: Room = {
  paint(ctx, e) {
    wallpaper(ctx, 0, 0, W, FLOOR, '#2f4a3c', '#d6c48e', 21, 'damask');
    wainscot(ctx, 0, 440, W, FLOOR - 440, '#3a2a1e', 22);
    rect(ctx, 0, 0, W, 26, vgrad(ctx, 0, 26, [[0, '#e8dfc8'], [1, '#b8ab8a']]));
    // Glastür zum Gewächshaus
    windowFrame(ctx, X(0.06) - 40, 250, 80, FLOOR - 262, { outside: ['#3a4a36', '#56684a', '#6a7a58'] });
    // Klavier
    const px = X(0.16);
    rect(ctx, px - 70, 360, 140, FLOOR - 360, vgrad(ctx, 360, FLOOR, [[0, '#1c1410'], [1, '#0e0a08']]));
    rect(ctx, px - 74, 350, 148, 14, '#2a1c14');
    rect(ctx, px - 60, 420, 120, 10, '#e8e0cc');
    for (let i = 0; i < 12; i++) rect(ctx, px - 58 + i * 10, 420, 5, 6, '#141010');
    rect(ctx, px - 30, 334, 60, 18, '#efe6d0');
    // Kamin mit Spiegel
    fireplace(ctx, X(0.5), FLOOR, 220, 170, '#d8cfc0');
    frame(ctx, X(0.5) - 80, 150, 160, 170, (c) => {
      rect(c, X(0.5) - 80, 150, 160, 170, vgrad(c, 150, 320, [[0, '#5a6a64'], [0.5, '#3a4843'], [1, '#2a3431']]));
      c.fillStyle = hex('#ffffff', 0.1); c.beginPath(); c.moveTo(X(0.5) - 60, 150); c.lineTo(X(0.5) - 20, 150); c.lineTo(X(0.5) - 80, 260); c.lineTo(X(0.5) - 80, 200); c.fill();
    });
    if (e.flags['k1_mirror'] || e.chapter >= 2) {
      ctx.fillStyle = hex('#0a090c', 0.94);
      ctx.beginPath(); ctx.moveTo(X(0.5) - 96, 136); ctx.lineTo(X(0.5) + 96, 136); ctx.quadraticCurveTo(X(0.5) + 100, 250, X(0.5) + 90, 334); ctx.lineTo(X(0.5) - 90, 334); ctx.quadraticCurveTo(X(0.5) - 100, 250, X(0.5) - 96, 136); ctx.fill();
      brush(ctx, X(0.5) - 95, 136, 190, 198, '#1a1820', 60, 5, 60, 0.12, true);
    }
    // Kaminsims: Uhr, Kerzen
    rect(ctx, X(0.5) - 18, FLOOR - 214, 36, 30, '#8a6a3a');
    // Schreibtischchen mit Kassette
    rect(ctx, X(0.3) - 60, 440, 120, 10, '#4a3020');
    rect(ctx, X(0.3) - 54, 450, 8, FLOOR - 450, '#3a2416'); rect(ctx, X(0.3) + 46, 450, 8, FLOOR - 450, '#3a2416');
    rect(ctx, X(0.3) - 28, 418, 56, 22, vgrad(ctx, 418, 440, [[0, '#7a3a2a'], [1, '#4a2016']]));
    rect(ctx, X(0.3) - 4, 426, 8, 6, '#c8a24a');
    // Fenster mit schweren Vorhängen
    windowFrame(ctx, X(0.74) - 80, 110, 160, 240, { outside: outside(e) });
    curtains(ctx, X(0.74) - 80, 110, 160, 240, '#4a1e24', mourning(e) ? 0.92 : 0.3);
    // Sofa
    const sx = X(0.86);
    rect(ctx, sx - 90, 430, 180, 60, vgrad(ctx, 430, 490, [[0, '#6a4a3a'], [1, '#3a2418']]));
    rect(ctx, sx - 100, 470, 200, 50, '#5a3a2c');
    rect(ctx, X(0.94) - 36, 280, 72, FLOOR - 280, '#0d0906');
    door(ctx, X(0.955) - 34, 280, 68, FLOOR - 280, '#4a3020', true);
    floorBoards(ctx, FLOOR, '#4a3424', 23);
    rug(ctx, X(0.5), FLOOR + 30, 700, 150, '#3a3450', '#6a5a3a');
  },
  dyn(ctx, e, t) {
    rainOn(ctx, X(0.74) - 80, 110, 160, 240, t, rainAmt(e) * 0.6, e.reduced, 7);
    fire(ctx, X(0.5), FLOOR - 4, 70, t, e.reduced, 0.8);
    candleStick(ctx, X(0.5) - 80, FLOOR - 186); candleStick(ctx, X(0.5) + 80, FLOOR - 186);
    flame(ctx, X(0.5) - 80, FLOOR - 220, t, 1, e.reduced); flame(ctx, X(0.5) + 80, FLOOR - 220, t + 2, 1, e.reduced);
  },
  lights: (e) => [
    { x: X(0.5), y: FLOOR - 40, r: 380, color: 'rgba(255,150,70,0.9)', flicker: 1.5 },
    { x: X(0.5) - 80, y: FLOOR - 220, r: 180, color: 'rgba(255,200,130,0.8)', flicker: 1 },
    { x: X(0.5) + 80, y: FLOOR - 220, r: 180, color: 'rgba(255,200,130,0.8)', flicker: 1 },
    { x: X(0.74), y: 230, r: 260, color: winLight(e), strength: mourning(e) ? 0.35 : 0.9 },
  ],
  dark: (e) => baseDark(e),
};

// ------------------------------------------------------------------ Arbeitszimmer
const arbeit: Room = {
  paint(ctx, e) {
    wallpaper(ctx, 0, 0, W, FLOOR, '#4a3424', '#1a120c', 31, 'panel');
    rect(ctx, 0, 0, W, 30, '#2a1c12');
    // Bücherschrank
    bookshelf(ctx, X(0.22) - 100, 110, 200, FLOOR - 110, '#3a2616', 32, true);
    rect(ctx, X(0.22) - 106, 100, 212, 14, '#4a3020');
    // Kamin + Klingelzug
    fireplace(ctx, X(0.44), FLOOR, 180, 160, '#6a5a4a');
    // Kaminsims-Dinge: Barometer
    ctx.fillStyle = '#a07a38'; ctx.beginPath(); ctx.arc(X(0.44), 250, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.arc(X(0.44), 250, 20, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2a1d10'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0.44), 250); ctx.lineTo(X(0.44) - 12, 242); ctx.stroke();
    // Klingelzug: rot, Quaste halb abgerissen
    rect(ctx, X(0.36) - 6, 80, 12, 250, vgrad(ctx, 80, 330, [[0, '#8a2020'], [1, '#5a1414']]));
    ctx.fillStyle = '#c8a24a'; ctx.save(); ctx.translate(X(0.36) + 4, 338); ctx.rotate(0.5);
    ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.lineTo(10, 30); ctx.lineTo(-10, 30); ctx.fill(); ctx.restore();
    // Tantalus auf Beistelltisch
    rect(ctx, X(0.56) - 40, 430, 80, 8, '#4a3020');
    rect(ctx, X(0.56) - 4, 438, 8, FLOOR - 438, '#3a2416');
    rect(ctx, X(0.56) - 34, 424, 68, 8, '#5a3a22');
    for (const [dx, full] of [[-20, true], [0, true], [20, false]] as [number, boolean][]) {
      if (!full) continue;
      ctx.fillStyle = hex('#d8e0e8', 0.5); ctx.beginPath(); ctx.ellipse(X(0.56) + dx, 404, 8, 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = hex('#8a3a1a', 0.6); ctx.beginPath(); ctx.ellipse(X(0.56) + dx, 412, 7, 11, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#b08a40'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0.56) - 34, 390); ctx.lineTo(X(0.56) + 34, 388); ctx.stroke();
    // Schreibtisch
    const dx = X(0.7);
    rect(ctx, dx - 110, 440, 220, 14, '#4a2e1c');
    rect(ctx, dx - 104, 454, 60, FLOOR - 454 + 20, vgrad(ctx, 454, FLOOR, [[0, '#3a2416'], [1, '#22150c']]));
    rect(ctx, dx + 44, 454, 60, FLOOR - 454 + 20, vgrad(ctx, 454, FLOOR, [[0, '#3a2416'], [1, '#22150c']]));
    rect(ctx, dx - 70, 430, 60, 10, '#efe6d0'); rect(ctx, dx - 60, 426, 40, 6, '#e0d6bc');
    rect(ctx, dx + 10, 424, 36, 14, '#2a1c14');
    ctx.fillStyle = hex('#d8a040', 0.8); ctx.beginPath(); ctx.ellipse(dx + 70, 432, 10, 7, 0, 0, Math.PI * 2); ctx.fill();
    // Terrassentür (French window)
    windowFrame(ctx, X(0.82) - 55, 170, 110, FLOOR - 182, { outside: outside(e) });
    curtains(ctx, X(0.82) - 55, 170, 110, FLOOR - 182, '#3a2a3a', mourning(e) ? 0.85 : 0.2);
    // Tür Dunkelkammer
    door(ctx, X(0.915) - 30, 300, 60, FLOOR - 300, '#2a1c14', !!e.flags['g_dunkel_open'] && false);
    door(ctx, 0, 280, X(0.06), FLOOR - 280, '#3b2616', true);
    floorBoards(ctx, FLOOR, '#3e2c1e', 33);
    rug(ctx, X(0.52), FLOOR + 30, 520, 140, '#4a2830', '#1e140e');
    // Lehnsessel (hinter den Figuren, am Kamin)
    const ax = X(0.55);
    ctx.fillStyle = '#2c3e2c';
    ctx.beginPath(); ctx.moveTo(ax - 50, FLOOR + 20); ctx.lineTo(ax - 54, FLOOR - 70); ctx.quadraticCurveTo(ax, FLOOR - 110, ax + 54, FLOOR - 70); ctx.lineTo(ax + 50, FLOOR + 20); ctx.fill();
    rect(ctx, ax - 64, FLOOR - 30, 128, 44, '#1e2e1e');
    rect(ctx, ax - 70, FLOOR - 40, 18, 56, '#243624'); rect(ctx, ax + 52, FLOOR - 40, 18, 56, '#243624');
    ctx.fillStyle = hex('#7a6a50', 0.85); ctx.fillRect(ax + 14, FLOOR - 50, 34, 22);
    // Erde an der Terrassentür
    ctx.fillStyle = hex('#5a2a18', 0.6); ctx.beginPath(); ctx.ellipse(X(0.8), FLOOR + 22, 14, 5, 0.2, 0, Math.PI * 2); ctx.fill();
  },
  dyn(ctx, e, t) {
    rainOn(ctx, X(0.82) - 55, 170, 110, FLOOR - 182, t, rainAmt(e), e.reduced, 11);
    candleStick(ctx, X(0.7) - 90, 440, false, 30);
    flame(ctx, X(0.7) - 90, 410, t, 1, e.reduced);
  },

  lights: (e) => [
    { x: X(0.7) - 90, y: 410, r: 280, color: 'rgba(255,200,120,0.9)', flicker: 1 },
    { x: X(0.82), y: 300, r: 260, color: winLight(e), strength: mourning(e) ? 0.4 : 1 },
  ],
  dark: (e) => baseDark(e) + 0.05,
};

// ------------------------------------------------------------------ Dunkelkammer
const dunkel: Room = {
  paint(ctx) {
    wallpaper(ctx, 0, 0, W, FLOOR, '#2a2220', '#000000', 41, 'plaster');
    for (const y of [150, 250]) {
      rect(ctx, X(0.55), y, X(0.3), 8, '#3a2a1c');
      const r = rng(y);
      for (let i = 0; i < 14; i++) {
        const bx = X(0.56) + i * 26, bh = 30 + r() * 30;
        ctx.fillStyle = r() > 0.5 ? '#3a2410' : '#1a2230';
        ctx.fillRect(bx, y - bh, 16, bh); ctx.fillRect(bx + 4, y - bh - 8, 8, 8);
      }
    }
    // Plattenkästen
    for (let i = 0; i < 4; i++) rect(ctx, X(0.8) - 40, 300 + i * 28, 90, 24, shade('#4a3422', -i * 0.05));
    // Tisch mit Schalen
    rect(ctx, X(0.3), 430, X(0.4), 14, '#3a2a1c');
    rect(ctx, X(0.31), 444, 12, FLOOR - 444, '#2a1c12'); rect(ctx, X(0.69), 444, 12, FLOOR - 444, '#2a1c12');
    for (let i = 0; i < 3; i++) rect(ctx, X(0.38) + i * 80, 418, 66, 14, '#d8d0c0');
    // Flasche
    ctx.fillStyle = '#4a2a0e'; ctx.beginPath(); ctx.ellipse(X(0.62), 396, 12, 22, 0, 0, Math.PI * 2); ctx.fill();
    rect(ctx, X(0.62) - 4, 366, 8, 12, '#4a2a0e');
    rect(ctx, X(0.62) - 8, 392, 16, 12, '#e8dcc0');
    ctx.fillStyle = '#6a4a1a'; ctx.beginPath(); ctx.ellipse(X(0.645), 424, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    // Laterne
    rect(ctx, X(0.34) - 16, 250, 32, 40, '#1a1410');
    rect(ctx, X(0.34) - 10, 256, 20, 28, '#9a1a10');
    door(ctx, 0, 280, X(0.07), FLOOR - 280, '#2a1c14', true);
    floorBoards(ctx, FLOOR, '#2a2018', 43);
  },
  dyn(ctx, e, t) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = radial(ctx, X(0.34), 270, 60, [[0, 'rgba(255,40,20,0.6)'], [1, 'rgba(255,0,0,0)']]);
    ctx.fillRect(X(0.34) - 60, 210, 120, 120);
    ctx.restore();
  },
  lights: () => [{ x: X(0.34), y: 270, r: 560, color: 'rgba(230,40,20,0.85)', flicker: 0.2 }],
  dark: () => 0.8,
};

// ------------------------------------------------------------------ Bibliothek
const biblio: Room = {
  paint(ctx, e) {
    rect(ctx, 0, 0, W, FLOOR, '#2a1c14');
    for (let i = 0; i < 6; i++) if (i !== 1) bookshelf(ctx, i * 214 + 10, 40, 200, FLOOR - 40, '#3a2618', 50 + i);
    fireplace(ctx, X(0.25), FLOOR, 200, 180, '#5a4a3c');
    rect(ctx, X(0.25) - 110, FLOOR - 196, 220, 12, '#6a5a4a');
    // Glas auf dem Sims
    ctx.fillStyle = hex('#d8e0e8', 0.5); rect(ctx, X(0.25) + 40, FLOOR - 212, 12, 16, hex('#d8e0e8', 0.5));
    // runder Tisch
    const tx = X(0.5);
    ctx.fillStyle = '#3a2416'; ctx.beginPath(); ctx.ellipse(tx, 470, 150, 26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = shade('#3a2416', 0.2); ctx.beginPath(); ctx.ellipse(tx, 466, 150, 24, 0, 0, Math.PI * 2); ctx.fill();
    rect(ctx, tx - 12, 470, 24, FLOOR - 470 + 30, '#2a1a10');
    ctx.strokeStyle = hex('#e8e0d0', 0.5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(tx, 466, 90, 12, 0, 0, Math.PI * 2); ctx.stroke();
    for (const a of [0.3, 1.5, 2.7, 4.2]) {
      const cx = tx + Math.cos(a) * 180, cy = 490 + Math.sin(a) * 30;
      rect(ctx, cx - 18, cy - 70, 36, 70, '#4a2e1e'); rect(ctx, cx - 20, cy - 8, 40, 10, '#5a3a24');
    }
    door(ctx, 0, 280, X(0.06), FLOOR - 280, '#3b2616', true);
    floorBoards(ctx, FLOOR, '#3a2a1c', 53);
    rug(ctx, X(0.5), FLOOR + 30, 600, 150, '#2a3a4a', '#6a4a2a');
  },
  dyn(ctx, e, t) {
    fire(ctx, X(0.25), FLOOR - 4, 70, t, e.reduced, 0.7);
    candleStick(ctx, X(0.5), 468, false, 24); flame(ctx, X(0.5), 444, t, 0.9, e.reduced);
  },
  lights: () => [
    { x: X(0.25), y: FLOOR - 40, r: 360, color: 'rgba(255,140,60,0.9)', flicker: 1.5 },
    { x: X(0.5), y: 444, r: 220, color: 'rgba(255,200,130,0.7)', flicker: 1 },
  ],
  dark: (e) => Math.max(baseDark(e), 0.6),
};

// ------------------------------------------------------------------ Dienstbotentrakt (Küche)
const dienst: Room = {
  paint(ctx, e) {
    wallpaper(ctx, 0, 0, W, FLOOR, '#c8bca0', '#000000', 61, 'plaster');
    rect(ctx, 0, 380, W, FLOOR - 380, '#8a7a60');
    brush(ctx, 0, 380, W, FLOOR - 380, '#8a7a60', 300, 62, 30, 0.08);
    // Balken
    for (let bx = 40; bx < W; bx += 260) rect(ctx, bx, 0, 30, 40, '#3a2a1c');
    rect(ctx, 0, 30, W, 18, '#3a2a1c');
    // Hallentür, Stiefelkammer, Hintertreppe, Haushälterin
    door(ctx, X(0.06) - 34, 300, 68, FLOOR - 300, '#5a4028');
    door(ctx, X(0.14) - 26, 360, 52, FLOOR - 360, '#6a5034', true);
    rect(ctx, X(0.2) - 30, 280, 60, FLOOR - 280, '#1a120c');
    for (let i = 0; i < 6; i++) rect(ctx, X(0.2) - 30, FLOOR - i * 36 - 20, 60 - i * 6, 8, '#4a3624');
    door(ctx, X(0.28) - 30, 320, 60, FLOOR - 320, '#5a4028');
    // Klingelbrett
    rect(ctx, X(0.32) - 110, 180, 220, 70, '#4a3422');
    for (let i = 0; i < 12; i++) {
      const bx = X(0.32) - 100 + (i % 6) * 38, by = 196 + Math.floor(i / 6) * 32;
      const tilted = i === 3;
      ctx.save(); ctx.translate(bx + 10, by); if (tilted) ctx.rotate(0.35);
      ctx.strokeStyle = '#8a7040'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -10); ctx.bezierCurveTo(6, -6, -6, -2, 0, 2); ctx.stroke();
      ctx.fillStyle = '#c8a24a'; ctx.beginPath(); ctx.arc(0, 8, 7, Math.PI, 0); ctx.lineTo(7, 12); ctx.lineTo(-7, 12); ctx.fill();
      ctx.restore();
      rect(ctx, bx, by + 14, 20, 5, '#e8dcc0');
    }
    ctx.strokeStyle = '#6a5a40'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(0.32) - 76, 188); ctx.lineTo(X(0.32) - 60, 100); ctx.lineTo(X(0.32) - 50, 50); ctx.stroke();
    // Herd
    const hx = X(0.6);
    rect(ctx, hx - 130, 220, 260, 120, vgrad(ctx, 220, 340, [[0, '#6a5a48'], [1, '#4a3a2c']]));
    rect(ctx, hx - 150, 330, 300, FLOOR - 330, vgrad(ctx, 330, FLOOR, [[0, '#1c1a18'], [1, '#0c0b0a']]));
    rect(ctx, hx - 150, 330, 300, 10, '#3a3634');
    rect(ctx, hx - 60, 380, 120, 70, '#0a0806');
    ctx.fillStyle = '#b87a3a'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(hx - 120 + i * 80, 250, 18, 0, Math.PI * 2); ctx.fill(); }
    rect(ctx, hx + 90, 300, 40, 30, '#5a4a3a');
    // Kerzenbord
    rect(ctx, X(0.72) - 70, 290, 140, 8, '#5a4028');
    for (let i = 0; i < 3; i++) { candleStick(ctx, X(0.72) - 44 + i * 44, 290, true, i === 2 && e.chapter <= 2 ? 18 : 32); }
    // Butlerkammer-Tür
    door(ctx, X(0.84) - 34, 320, 68, FLOOR - 320, '#5a4028', false);
    // Hoftür
    door(ctx, X(0.955) - 36, 300, 72, FLOOR - 300, '#4a3a28');
    rect(ctx, X(0.955) - 20, 330, 40, 50, vgrad(ctx, 330, 380, outside(e).map((c, i) => [i / 2, c] as [number, string])));
    floorBoards(ctx, FLOOR, '#6a6258', 63, true);
    // Kalender
    rect(ctx, X(0.46) - 20, 250, 40, 54, '#e8dcc0'); rect(ctx, X(0.46) - 20, 250, 40, 12, '#8a2a20');
    // Küchentisch
    const tx = X(0.46);
    rect(ctx, tx - 150, FLOOR - 6, 300, 18, vgrad(ctx, FLOOR - 6, FLOOR + 12, [[0, '#b09a78'], [1, '#6a5a44']]));
    rect(ctx, tx - 140, FLOOR + 12, 12, 70, '#5a4a34'); rect(ctx, tx + 128, FLOOR + 12, 12, 70, '#5a4a34');
    rect(ctx, tx - 60, FLOOR - 26, 40, 20, '#8a6a4a'); rect(ctx, tx + 40, FLOOR - 16, 30, 10, '#d8d0c0');
  },
  dyn(ctx, e, t) {
    fire(ctx, X(0.6), 450, 50, t, e.reduced, 0.9);
  },

  lights: (e) => [
    { x: X(0.6), y: 420, r: 460, color: 'rgba(255,140,60,0.95)', flicker: 1.5 },
    { x: X(0.955), y: 350, r: 150, color: winLight(e), strength: 0.5 },
  ],
  dark: (e) => baseDark(e) - 0.05,
};

// ------------------------------------------------------------------ Galerie
const galerie: Room = {
  paint(ctx, e) {
    wallpaper(ctx, 0, 0, W, FLOOR, '#4a3a4a', '#c8b88a', 71, 'stripe');
    wainscot(ctx, 0, 430, W, FLOOR - 430, '#3a2a1e', 72);
    const doors: [number, string][] = [[0.06, '#4a3020'], [0.2, '#4a3020'], [0.33, '#4a3020'], [0.66, '#4a3020'], [0.82, '#3a2418'], [0.895, '#4a3020']];
    for (const [dx, c] of doors) door(ctx, X(dx) - 34, 270, 68, FLOOR - 270, c);
    if (mourning(e)) rect(ctx, X(0.82) - 34, 280, 68, 5, '#0b0a0c');
    // Treppenöffnung
    rect(ctx, X(0.5) - 70, 270, 140, FLOOR - 270, vgrad(ctx, 270, FLOOR, [[0, '#0e0a08'], [1, '#2a1f16']]));
    for (let i = 0; i < 6; i++) rect(ctx, X(0.5) - 70 + i * 6, FLOOR - 40 - i * 30, 140 - i * 12, 6, '#4a3422');
    rect(ctx, X(0.965) - 24, 290, 48, FLOOR - 290, '#120c08');
    // Bilder
    for (const fx of [0.13, 0.42, 0.58, 0.745]) frame(ctx, X(fx) - 30, 150, 60, 76, (c) => { rect(c, X(fx) - 30, 150, 60, 76, vgrad(c, 150, 226, [[0, '#4a5a4a'], [1, '#2a3024']])); });
    floorBoards(ctx, FLOOR, '#4a3624', 73);
    rect(ctx, 0, FLOOR + 30, W, 60, hex('#6a2424', 0.6));
  },
  dyn(ctx, e, t) {
    candleStick(ctx, X(0.42), 420, false, 26); flame(ctx, X(0.42), 394, t, 0.8, e.reduced);
  },
  front(ctx) {
    // Geländer im Vordergrund
    rect(ctx, 0, 668, W, 12, '#3a2618');
    for (let bx = 8; bx < W; bx += 26) if (Math.abs(bx - X(0.5)) > 80) rect(ctx, bx, 680, 8, 40, '#2a1a10');
  },
  lights: () => [{ x: X(0.42), y: 394, r: 300, color: 'rgba(255,200,130,0.85)', flicker: 1 }, { x: X(0.5), y: 500, r: 200, color: 'rgba(255,190,120,0.4)' }],
  dark: (e) => Math.max(baseDark(e), 0.55),
};

// ------------------------------------------------------------------ Zimmer des Herrn
const toten: Room = {
  paint(ctx, e) {
    wallpaper(ctx, 0, 0, W, FLOOR, '#3a3a4a', '#c8c0a0', 81, 'damask');
    wainscot(ctx, 0, 450, W, FLOOR - 450, '#3a2a1e', 82);
    door(ctx, X(0.1) - 36, 290, 72, FLOOR - 290, '#4a3020', true);
    windowFrame(ctx, X(0.3) - 60, 150, 120, 180, { outside: outside(e) });
    curtains(ctx, X(0.3) - 60, 150, 120, 180, '#2a2a34', 0.9);
    // Himmelbett
    const bx = X(0.56);
    rect(ctx, bx - 190, 120, 380, 30, '#2a1a12');
    ctx.fillStyle = hex('#2a2432', 0.9);
    ctx.beginPath(); ctx.moveTo(bx - 190, 150); ctx.quadraticCurveTo(bx - 200, 300, bx - 170, 470); ctx.lineTo(bx - 150, 470); ctx.lineTo(bx - 160, 150); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx + 190, 150); ctx.quadraticCurveTo(bx + 200, 300, bx + 170, 470); ctx.lineTo(bx + 150, 470); ctx.lineTo(bx + 160, 150); ctx.fill();
    rect(ctx, bx - 180, 250, 20, 280, '#2a1a12'); rect(ctx, bx + 160, 250, 20, 280, '#2a1a12');
    rect(ctx, bx - 160, 260, 320, 90, '#3a2418');
    rect(ctx, bx - 160, 420, 320, 90, vgrad(ctx, 420, 510, [[0, '#e8e2d4'], [1, '#b8b0a0']]));
    if (e.chapter >= 2 && e.chapter <= 5) {
      // Der Tote unter dem Laken
      ctx.fillStyle = '#efe9dc';
      ctx.beginPath(); ctx.moveTo(bx - 110, 420); ctx.quadraticCurveTo(bx, 386, bx + 140, 414); ctx.lineTo(bx + 140, 430); ctx.lineTo(bx - 110, 430); ctx.fill();
      ctx.fillStyle = '#d8c8b4'; ctx.beginPath(); ctx.ellipse(bx - 120, 404, 20, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#a8a098'; ctx.beginPath(); ctx.ellipse(bx - 134, 400, 8, 14, 0, 0, Math.PI * 2); ctx.fill();
      rect(ctx, bx - 60, 398, 40, 16, '#1a1414');
    } else {
      rect(ctx, bx - 150, 400, 300, 24, '#d8d0c0');
    }
    rect(ctx, X(0.78) - 30, 440, 60, 80, '#3a2418');
    floorBoards(ctx, FLOOR, '#3a2a1c', 83);
  },
  dyn(ctx, e, t) {
    candleStick(ctx, X(0.78) - 14, 440); candleStick(ctx, X(0.78) + 14, 440);
    flame(ctx, X(0.78) - 14, 406, t, 1, e.reduced); flame(ctx, X(0.78) + 14, 406, t + 3, 1, e.reduced);
  },
  lights: () => [{ x: X(0.78), y: 406, r: 420, color: 'rgba(255,190,120,0.95)', flicker: 1.2 }],
  dark: (e) => Math.max(baseDark(e), 0.62),
};

// ------------------------------------------------------------------ Ihre Kammer
const kammer: Room = {
  paint(ctx, e) {
    wallpaper(ctx, 0, 0, W, FLOOR, '#b8ac90', '#6a5a40', 91, 'plaster');
    // Dachschräge
    ctx.fillStyle = '#8a7c64'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W * 0.35, 0); ctx.lineTo(0, 260); ctx.fill();
    ctx.fillStyle = '#7a6c54'; ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W * 0.7, 0); ctx.lineTo(W, 220); ctx.fill();
    windowFrame(ctx, X(0.4) - 70, 130, 140, 160, { outside: outside(e) });
    // Bett
    const bx = X(0.64);
    rect(ctx, bx - 120, 420, 240, 80, vgrad(ctx, 420, 500, [[0, '#e8e0cc'], [1, '#b8ac94']]));
    rect(ctx, bx - 124, 360, 14, 160, '#5a4a38'); rect(ctx, bx + 110, 380, 14, 140, '#5a4a38');
    rect(ctx, bx - 110, 412, 60, 24, '#f4eee0');
    ctx.fillStyle = '#6a5a8a'; ctx.fillRect(bx - 40, 430, 150, 70);
    // Truhe
    rect(ctx, X(0.2) - 60, 450, 120, 70, vgrad(ctx, 450, 520, [[0, '#6a4a2c'], [1, '#3a2818']]));
    rect(ctx, X(0.2) - 60, 470, 120, 6, '#2a1a10');
    // Waschtisch + Spiegel
    rect(ctx, X(0.8) - 50, 440, 100, 80, '#6a5238');
    ctx.fillStyle = '#e8e4dc'; ctx.beginPath(); ctx.ellipse(X(0.8), 440, 30, 8, 0, 0, Math.PI * 2); ctx.fill();
    frame(ctx, X(0.8) - 26, 270, 52, 70, (c) => rect(c, X(0.8) - 26, 270, 52, 70, vgrad(c, 270, 340, [[0, '#8a9aa0'], [1, '#4a5458']])), false);
    door(ctx, X(0.89) - 34, 320, 68, FLOOR - 320, '#6a5034', true);
    floorBoards(ctx, FLOOR, '#7a6a52', 93);
    rug(ctx, X(0.5), FLOOR + 30, 400, 120, '#6a3a2a', '#3a2016');
  },
  dyn(ctx, e, t) {
    rainOn(ctx, X(0.4) - 70, 130, 140, 160, t, rainAmt(e), e.reduced, 13);
    candleStick(ctx, X(0.8) + 34, 440, false, 24); flame(ctx, X(0.8) + 34, 416, t, 0.9, e.reduced);
    if (e.weather === 'dawn') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; rect(ctx, X(0.4) - 70, 130, 140, 160, 'rgba(255,160,100,0.15)'); ctx.restore(); }
  },
  lights: (e) => [
    { x: X(0.8) + 34, y: 416, r: 300, color: 'rgba(255,200,130,0.85)', flicker: 1 },
    { x: X(0.4), y: 220, r: 320, color: winLight(e), strength: e.tod === 'nacht' ? 0.3 : 1 },
  ],
  dark: (e) => baseDark(e) - 0.05,
};

// ------------------------------------------------------------------ Gewächshaus
const gewaechs: Room = {
  paint(ctx, e) {
    rect(ctx, 0, 0, W, FLOOR, vgrad(ctx, 0, FLOOR, outside(e).map((c, i) => [i / 2, c] as [number, string])));
    if (e.weather === 'fog') rect(ctx, 0, 0, W, FLOOR, 'rgba(200,205,210,0.35)');
    // Eisenrahmen
    ctx.strokeStyle = '#2a3228'; ctx.lineWidth = 6;
    for (let x = 0; x <= W; x += 128) { ctx.beginPath(); ctx.moveTo(x, FLOOR); ctx.lineTo(x, 180); ctx.lineTo(W / 2, 40); ctx.stroke(); }
    ctx.lineWidth = 3;
    for (let y = 180; y < FLOOR; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(W / 2, 40); ctx.lineTo(W, 180); ctx.stroke();
    rect(ctx, 0, 0, W, 60, hex('#1a2018', 0.5));
    // Pflanzen
    const r = rng(101);
    for (let i = 0; i < 40; i++) {
      const px = r() * W, py = 300 + r() * 220, s = 20 + r() * 50;
      ctx.fillStyle = hex(r() > 0.5 ? '#2e4a2a' : '#3e5a34', 0.9);
      ctx.beginPath(); ctx.ellipse(px, py, s, s * 0.6, r(), 0, Math.PI * 2); ctx.fill();
    }
    // Zitronenbäumchen in Kübeln
    for (const tx of [X(0.22), X(0.3), X(0.38)]) {
      rect(ctx, tx - 26, 440, 52, 60, vgrad(ctx, 440, 500, [[0, '#8a5a3a'], [1, '#5a3a24']]));
      rect(ctx, tx - 3, 350, 6, 90, '#4a3a24');
      ctx.fillStyle = '#2e4a24'; ctx.beginPath(); ctx.ellipse(tx, 340, 44, 40, 0, 0, Math.PI * 2); ctx.fill();
      brush(ctx, tx - 44, 300, 88, 80, '#3e6a30', 40, tx, 12, 0.3);
    }
    ctx.fillStyle = '#e8c83a'; ctx.beginPath(); ctx.ellipse(X(0.3) + 14, 350, 7, 9, 0.3, 0, Math.PI * 2); ctx.fill();
    // Bank
    rect(ctx, X(0.55) - 80, 470, 160, 8, '#2a2a28');
    for (let i = 0; i < 5; i++) rect(ctx, X(0.55) - 80, 430 + i * 8, 160, 3, '#2a2a28');
    rect(ctx, X(0.55) - 76, 478, 6, 40, '#2a2a28'); rect(ctx, X(0.55) + 70, 478, 6, 40, '#2a2a28');
    windowFrame(ctx, X(0.93) - 36, 280, 72, FLOOR - 292, { outside: ['#3a2a20', '#4a3424', '#5a4030'] });
    floorBoards(ctx, FLOOR, '#6a6a60', 103, true);
  },
  dyn(ctx, e, t) {
    rainOn(ctx, 0, 0, W, FLOOR, t, rainAmt(e) * 0.8, e.reduced, 17);
    if (!e.reduced) {
      // Nachtfalter
      const mx = X(0.6) + Math.sin(t * 1.3) * 120 + Math.sin(t * 3.1) * 20, my = 200 + Math.cos(t * 1.7) * 40;
      ctx.fillStyle = 'rgba(220,210,190,0.8)';
      const wing = Math.abs(Math.sin(t * 20)) * 5 + 2;
      ctx.beginPath(); ctx.ellipse(mx - 3, my, wing, 3, 0.3, 0, Math.PI * 2); ctx.ellipse(mx + 3, my, wing, 3, -0.3, 0, Math.PI * 2); ctx.fill();
    }
  },
  lights: (e) => [{ x: W / 2, y: 100, r: 900, color: winLight(e), strength: 0.8 }],
  dark: (e) => baseDark(e, false) - 0.05,
};

// ------------------------------------------------------------------ Stallhof
const stall: Room = {
  paint(ctx, e) {
    const sk = outside(e);
    rect(ctx, 0, 0, W, FLOOR, vgrad(ctx, 0, FLOOR, [[0, sk[0]], [0.6, sk[1]], [1, sk[2]]]));
    // Wasser rechts
    rect(ctx, X(0.62), 360, W - X(0.62), FLOOR - 360 + 60, vgrad(ctx, 360, FLOOR, [[0, mix(sk[2], '#4a5a66', 0.6)], [1, mix(sk[0], '#1a2430', 0.6)]]));
    for (let i = 0; i < 5; i++) {
      const wx = X(0.7) + i * 90, wy = 360 + (i % 2) * 10;
      rect(ctx, wx - 3, wy - 60, 6, 60, '#2a2a24');
      ctx.fillStyle = hex('#2a3024', 0.9); ctx.beginPath(); ctx.ellipse(wx, wy - 70, 30, 20, 0, 0, Math.PI * 2); ctx.fill();
    }
    // Stallgebäude
    rect(ctx, 0, 140, X(0.62), FLOOR - 140, vgrad(ctx, 140, FLOOR, [[0, '#6a5a48'], [1, '#4a3e32']]));
    brush(ctx, 0, 140, X(0.62), FLOOR - 140, '#6a5a48', 400, 111, 30, 0.1);
    ctx.fillStyle = '#3a2e26'; ctx.beginPath(); ctx.moveTo(-20, 150); ctx.lineTo(X(0.31), 60); ctx.lineTo(X(0.64), 150); ctx.fill();
    // Uhrtürmchen
    rect(ctx, X(0.5) - 30, 100, 60, 90, '#5a4a3a');
    ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.arc(X(0.5), 160, 20, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2a1d10'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0.5), 160); ctx.lineTo(X(0.5), 146); ctx.moveTo(X(0.5), 160); ctx.lineTo(X(0.5) + 10, 164); ctx.stroke();
    ctx.fillStyle = '#3a2e26'; ctx.beginPath(); ctx.moveTo(X(0.5) - 38, 100); ctx.lineTo(X(0.5), 60); ctx.lineTo(X(0.5) + 38, 100); ctx.fill();
    // Heuboden-Luke
    rect(ctx, X(0.26) - 30, 170, 60, 50, '#1a140e');
    // Stalltore
    for (const sx of [X(0.36), X(0.48)]) { door(ctx, sx - 50, 330, 100, FLOOR - 330, '#5a4028'); rect(ctx, sx - 50, 330, 100, 70, '#1a140e'); }
    ctx.fillStyle = '#4a3020'; ctx.beginPath(); ctx.ellipse(X(0.36), 370, 18, 26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d8d0c4'; ctx.beginPath(); ctx.ellipse(X(0.48), 370, 18, 26, 0, 0, Math.PI * 2); ctx.fill();
    // Hoftür
    door(ctx, X(0.06) - 34, 330, 68, FLOOR - 330, '#4a3a28');
    // Terrasse (Blick)
    rect(ctx, X(0.14), 300, 100, 20, '#8a8070');
    for (let i = 0; i < 8; i++) rect(ctx, X(0.14) + i * 13, 320, 6, 40, '#7a7060');
    floorBoards(ctx, FLOOR, '#5a5448', 113, true);
    // Boot kieloben auf Böcken, hinten an der Mauer
    const bx = X(0.8), by = FLOOR + 20;
    rect(ctx, bx - 90, by, 10, 36, '#3a2a1c'); rect(ctx, bx + 80, by, 10, 36, '#3a2a1c');
    ctx.fillStyle = '#4a3422'; ctx.beginPath(); ctx.moveTo(bx - 140, by + 4); ctx.quadraticCurveTo(bx, by - 50, bx + 140, by + 4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = hex('#101010', 0.8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx - 120, by - 4); ctx.quadraticCurveTo(bx, by - 40, bx + 120, by - 4); ctx.stroke();
  },
  dyn(ctx, e, t) {
    rainOn(ctx, 0, 0, W, H, t, rainAmt(e), e.reduced, 19);
    if (e.weather === 'fog') rect(ctx, 0, 0, W, H, 'rgba(190,195,200,0.25)');
    // Wasser glitzert
    if (!e.reduced) {
      ctx.strokeStyle = 'rgba(220,230,240,0.15)'; ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) { const wx = X(0.64) + ((i * 97 + t * 10) % (W - X(0.64))); ctx.beginPath(); ctx.moveTo(wx, 420 + i * 8); ctx.lineTo(wx + 30, 420 + i * 8); ctx.stroke(); }
    }
  },

  lights: (e) => [{ x: W / 2, y: 0, r: 1200, color: winLight(e), strength: e.tod === 'nacht' ? 0.3 : 0.9 }, ...(e.tod === 'nacht' || e.tod === 'abend' ? [{ x: X(0.42), y: 380, r: 240, color: 'rgba(255,190,110,0.8)', flicker: 0.8 }] : [])],
  dark: (e) => baseDark(e, false),
};

// ------------------------------------------------------------------ Kapelle
const kapelle: Room = {
  paint(ctx, e) {
    const sk = outside(e);
    rect(ctx, 0, 0, W, H, vgrad(ctx, 0, H, [[0, sk[0]], [0.5, sk[1]], [1, sk[2]]]));
    // Wasser ringsum
    rect(ctx, 0, 440, W, H - 440, vgrad(ctx, 440, H, [[0, mix(sk[2], '#5a6a74', 0.6)], [1, mix(sk[0], '#1a2430', 0.6)]]));
    // Hügel
    ctx.fillStyle = '#3a4430'; ctx.beginPath(); ctx.moveTo(-50, H); ctx.quadraticCurveTo(X(0.45), 380, X(0.72), H); ctx.fill();
    brush(ctx, 0, 400, X(0.72), H - 400, '#4a5a3a', 300, 121, 20, 0.15);
    // Kapelle
    const cx = X(0.62);
    rect(ctx, cx - 110, 190, 220, 250, vgrad(ctx, 190, 440, [[0, '#8a8478'], [1, '#5a564c']]));
    brush(ctx, cx - 110, 190, 220, 250, '#8a8478', 200, 122, 14, 0.15);
    ctx.fillStyle = '#3a3630'; ctx.beginPath(); ctx.moveTo(cx - 130, 200); ctx.lineTo(cx, 110); ctx.lineTo(cx + 130, 200); ctx.fill();
    rect(ctx, cx - 18, 70, 36, 50, '#6a665c');
    ctx.fillStyle = '#1a1814'; ctx.beginPath(); ctx.arc(cx, 96, 12, Math.PI, 0); ctx.lineTo(cx + 12, 112); ctx.lineTo(cx - 12, 112); ctx.fill();
    ctx.strokeStyle = '#6a3a1a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, 86); ctx.lineTo(cx, 96); ctx.stroke();
    ctx.fillStyle = '#1a1814'; ctx.beginPath(); ctx.moveTo(cx - 26, 440); ctx.lineTo(cx - 26, 350); ctx.arc(cx, 350, 26, Math.PI, 0); ctx.lineTo(cx + 26, 440); ctx.fill();
    // Gräber
    const r = rng(123);
    for (let i = 0; i < 8; i++) {
      const gx = X(0.1) + i * 70 + r() * 20, gy = 480 + r() * 40;
      ctx.fillStyle = shade('#8a8a80', -r() * 0.3);
      ctx.beginPath(); ctx.moveTo(gx - 14, gy); ctx.lineTo(gx - 14, gy - 40); ctx.arc(gx, gy - 40, 14, Math.PI, 0); ctx.lineTo(gx + 14, gy); ctx.fill();
    }
    // Lucindas Stein
    ctx.fillStyle = '#d8d4c4'; ctx.beginPath(); ctx.moveTo(X(0.4) - 26, 540); ctx.lineTo(X(0.4) - 26, 470); ctx.arc(X(0.4), 470, 26, Math.PI, 0); ctx.lineTo(X(0.4) + 26, 540); ctx.fill();
    if (e.flags['k3_chapel_go']) { ctx.fillStyle = '#f4f0e0'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(X(0.4) - 14 + i * 6, 546, 5, 0, Math.PI * 2); ctx.fill(); } }
  },
  dyn(ctx, e, t) {
    if (e.weather === 'fog' || e.tod !== 'nacht') {
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const fx = ((t * 12 * (i + 1) + i * 400) % (W + 600)) - 300;
        ctx.fillStyle = radial(ctx, fx, 420 + i * 40, 300, [[0, 'rgba(210,215,220,0.22)'], [1, 'rgba(210,215,220,0)']]);
        ctx.fillRect(fx - 300, 120 + i * 40, 600, 600);
      }
      ctx.restore();
    }
  },
  lights: (e) => [{ x: W / 2, y: 0, r: 1400, color: winLight(e), strength: 0.9 }],
  dark: (e) => baseDark(e, false) - 0.08,
};

// ------------------------------------------------------------------ Seras Wohnung (Gegenwart)
const wohnung: Room = {
  paint(ctx, e) {
    rect(ctx, 0, 0, W, FLOOR, vgrad(ctx, 0, FLOOR, [[0, '#d8cdb8'], [1, '#bfb29a']]));
    brush(ctx, 0, 0, W, FLOOR, '#cfc4ae', 200, 131, 60, 0.05);
    // Fenster mit Stadt
    windowFrame(ctx, X(0.22) - 110, 110, 220, 250, { outside: ['#141a2c', '#1d2438', '#2b2a3a'], bars: false });
    const r = rng(133);
    for (let i = 0; i < 30; i++) rect(ctx, X(0.22) - 100 + r() * 200, 200 + r() * 150, 4, 5, hex(r() > 0.5 ? '#f5d88c' : '#bcd4f5', 0.7));
    ctx.strokeStyle = '#f0ece4'; ctx.lineWidth = 6; ctx.strokeRect(X(0.22) - 110, 110, 220, 250);
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X(0.22), 110); ctx.lineTo(X(0.22), 360); ctx.stroke();
    // Heizkörper
    rect(ctx, X(0.22) - 90, 400, 180, 70, '#ece8e0');
    for (let i = 0; i < 12; i++) rect(ctx, X(0.22) - 84 + i * 15, 404, 8, 62, '#d8d4cc');
    // Regal mit Pflanzen, Büchern
    rect(ctx, X(0.82) - 100, 160, 200, 8, '#8a6a4a'); rect(ctx, X(0.82) - 100, 260, 200, 8, '#8a6a4a');
    for (let i = 0; i < 9; i++) rect(ctx, X(0.82) - 94 + i * 20, 200, 14, 60, ['#c85a4a', '#4a6a8a', '#e8c86a', '#6a8a5a'][i % 4]);
    ctx.fillStyle = '#4a7a4a'; ctx.beginPath(); ctx.ellipse(X(0.82) + 60, 140, 30, 22, 0, 0, Math.PI * 2); ctx.fill();
    // Schreibtisch
    const dx = X(0.58);
    rect(ctx, dx - 150, 410, 300, 14, '#a07a50');
    rect(ctx, dx - 140, 424, 10, FLOOR - 424 + 40, '#6a5034'); rect(ctx, dx + 130, 424, 10, FLOOR - 424 + 40, '#6a5034');
    // Lampe
    const lx = X(0.64);
    rect(ctx, lx - 16, 402, 32, 8, '#2a2a2a');
    ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx, 404); ctx.lineTo(lx - 20, 330); ctx.lineTo(lx + 10, 300); ctx.stroke();
    ctx.fillStyle = '#2f4a3a'; ctx.beginPath(); ctx.moveTo(lx - 10, 290); ctx.lineTo(lx + 30, 290); ctx.lineTo(lx + 40, 320); ctx.lineTo(lx - 20, 320); ctx.fill();
    // Kiste mit Glasplatten
    rect(ctx, X(0.52) - 50, 370, 100, 40, vgrad(ctx, 370, 410, [[0, '#8a6a44'], [1, '#5a4228']]));
    for (let i = 0; i < 8; i++) rect(ctx, X(0.52) - 44 + i * 11, 360, 6, 16, hex('#c8d4d8', 0.7));
    // Karton auf dem Boden
    rect(ctx, X(0.4) - 60, FLOOR + 40, 120, 70, vgrad(ctx, FLOOR + 40, FLOOR + 110, [[0, '#c8a070'], [1, '#9a7650']]));
    // Sofa
    rect(ctx, X(0.84) - 130, 450, 260, 90, '#5a6a7a');
    rect(ctx, X(0.84) - 140, 420, 30, 120, '#4a5a6a'); rect(ctx, X(0.84) + 110, 420, 30, 120, '#4a5a6a');
    rect(ctx, X(0.82) - 12, 494, 24, 10, '#1a1a1a');
    floorBoards(ctx, FLOOR, '#b89a74', 135);
  },
  dyn(ctx, e, t) {
    rainOn(ctx, X(0.22) - 110, 110, 220, 250, t, 1, e.reduced, 23);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = radial(ctx, X(0.64) + 10, 330, 200, [[0, 'rgba(255,220,160,0.35)'], [1, 'rgba(255,200,120,0)']]);
    ctx.fillRect(X(0.64) - 200, 130, 400, 400);
    ctx.restore();
  },
  lights: () => [{ x: X(0.64) + 10, y: 330, r: 600, color: 'rgba(255,220,170,0.95)' }],
  dark: () => 0.5,
};

// ------------------------------------------------------------------ Zwischen
const zwischen: Room = {
  paint(ctx) {
    rect(ctx, 0, 0, W, H, vgrad(ctx, 0, H, [[0, '#0a0e1a'], [1, '#141a28']]));
    ctx.fillStyle = 'rgba(80,90,120,0.25)';
    for (let i = 0; i < 12; i++) { ctx.fillRect(X(0.3) + i * 40, H - 120 - i * 30, 400 - i * 10, 24); }
  },
  dyn(ctx, e, t) {
    const lx = X(0.5) + Math.sin(t * 0.4) * 160, ly = H * 0.5 + Math.cos(t * 0.3) * 120;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = radial(ctx, lx, ly, 120, [[0, 'rgba(255,200,130,0.35)'], [1, 'rgba(255,180,100,0)']]);
    ctx.fillRect(lx - 120, ly - 120, 240, 240);
    ctx.restore();
    ctx.fillStyle = 'rgba(10,14,26,0.25)';
    for (let i = 0; i < 6; i++) { const wy = (t * 30 + i * 120) % H; ctx.fillRect(0, wy, W, 30); }
  },
  lights: () => [],
  dark: () => 0,
};

// ------------------------------------------------------------------ London, Januar 1878
const london: Room = {
  paint(ctx) {
    wallpaper(ctx, 0, 0, W, FLOOR, '#8a7a64', '#4a3a2a', 141, 'stripe');
    windowFrame(ctx, X(0.3) - 100, 110, 200, 260, { outside: ['#8a929c', '#b8bcc0', '#d8dadc'] });
    rect(ctx, X(0.3) - 116, 376, 232, 14, '#f4f4f4');
    fireplace(ctx, X(0.7), FLOOR, 180, 150, '#8a7a6a');
    rect(ctx, X(0.7) - 110, FLOOR - 166, 220, 12, '#6a5a4a');
    rect(ctx, X(0.7) - 20, FLOOR - 196, 40, 30, '#5a3a22');
    rect(ctx, X(0.7) + 40, FLOOR - 190, 24, 30, '#efe6d0');
    rect(ctx, X(0.48) - 120, 450, 240, 12, '#6a4a30');
    rect(ctx, X(0.48) - 110, 462, 10, 80, '#4a3020'); rect(ctx, X(0.48) + 100, 462, 10, 80, '#4a3020');
    for (let i = 0; i < 4; i++) rect(ctx, X(0.48) - 90 + i * 30, 430 - i * 4, 26, 20 + i * 4, ['#6a2a22', '#28402c', '#2c3552', '#6a5024'][i]);
    rect(ctx, X(0.48) + 40, 436, 50, 16, '#3a3a3a');
    floorBoards(ctx, FLOOR, '#6a5238', 143);
  },
  dyn(ctx, e, t) {
    fire(ctx, X(0.7), FLOOR - 4, 60, t, e.reduced, 0.8);
    const r = rng(151);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (let i = 0; i < 40; i++) { const sx = X(0.3) - 100 + r() * 200, sy = 110 + ((r() * 260 + (e.reduced ? 0 : t * (20 + r() * 20))) % 260); ctx.beginPath(); ctx.arc(sx + Math.sin(t + i) * 4, sy, 1.5, 0, Math.PI * 2); ctx.fill(); }
  },
  lights: () => [{ x: X(0.7), y: FLOOR - 40, r: 460, color: 'rgba(255,160,80,0.9)', flicker: 1.3 }, { x: X(0.3), y: 240, r: 360, color: 'rgba(220,225,235,0.8)' }],
  dark: () => 0.42,
};

export const ROOMS: Record<string, Room> = { halle, salon, arbeit, dunkel, biblio, dienst, galerie, toten, kammer, gewaechs, stall, kapelle, wohnung, zwischen, london };

export function roomKey(e: Env): string {
  const f = e.flags;
  return [e.loc, e.tod, e.weather, e.chapter, f['k1_mirror'] ? 1 : 0, f['k3_chapel_go'] ? 1 : 0, f['k1_wake'] ? 1 : 0].join('|');
}
