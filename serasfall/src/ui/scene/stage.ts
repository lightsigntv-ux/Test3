// Bühne: malt Raum, Figuren, Katze, Licht und Textur in ein Canvas.
import { W, H, grain, radial, hex, type C2D } from './kit';
import { ROOMS, roomKey, type Env } from './rooms';
import { drawPerson, drawCat, drawModernSera, seraLook, type CatPose } from './figures';
import { CHARACTERS, type Look } from '../../content/characters';
import type { Hotspot } from '../../engine/types';

export interface Actor { id: string; x: number; facing: 1 | -1; walk: number; talk?: boolean }
export interface Frame {
  env: Env;
  sera: Actor & { visible: boolean };
  cat: CatPose & { visible: boolean };
  npcs: Actor[];
  hotspots: (Hotspot & { near: boolean; label?: string })[];
  controlling: 'sera' | 'yuumi';
  fade: number; // 0..1 schwarz
  mystic: number; // 0..1
  focusNpc?: string;
}

export const FOOT = Math.round(H * 0.9);
export const PERSON_H = 250;

export class Stage {
  private ctx: C2D;
  private bg: HTMLCanvasElement;
  private bgKey = '';
  private light: HTMLCanvasElement;
  constructor(private canvas: HTMLCanvasElement) {
    canvas.width = W; canvas.height = H;
    this.ctx = canvas.getContext('2d')!;
    this.bg = document.createElement('canvas'); this.bg.width = W; this.bg.height = H;
    this.light = document.createElement('canvas'); this.light.width = W / 2; this.light.height = H / 2;
  }

  private ensureBg(env: Env) {
    const key = roomKey(env);
    if (key === this.bgKey) return;
    const room = ROOMS[env.loc] ?? ROOMS.halle;
    const b = this.bg.getContext('2d')!;
    b.clearRect(0, 0, W, H);
    room.paint(b, env);
    this.bgKey = key;
  }

  render(f: Frame, t: number) {
    const ctx = this.ctx;
    const env = f.env;
    const room = ROOMS[env.loc] ?? ROOMS.halle;
    this.ensureBg(env);
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(this.bg, 0, 0);
    room.dyn?.(ctx, env, t);
    // Figuren, nach Tiefe (hier: nach x) gezeichnet
    const drawActor = (a: Actor) => {
      const def = CHARACTERS[a.id];
      if (!def?.look) return;
      drawPerson(ctx, a.id, def.look, { x: a.x * W, foot: FOOT, h: PERSON_H * (a.id === 'tilly' ? 0.82 : a.id === 'lionel' || a.id === 'dunning' ? 1.06 : 1), facing: a.facing, t, walk: a.walk, reduced: env.reduced, highlight: f.focusNpc === a.id });
    };
    for (const n of f.npcs) drawActor(n);
    if (f.sera.visible) {
      const base = CHARACTERS.sera.look as Look;
      const look = seraLook(base, env.chapter, env.flags, env.loc);
      const modern = env.chapter === 0 || (env.chapter === 1 && !env.flags['k1_dressed']);
      const opts = { x: f.sera.x * W, foot: FOOT, h: PERSON_H * 0.97, facing: f.sera.facing, t, walk: f.sera.walk, reduced: env.reduced, alpha: f.controlling === 'yuumi' ? 0.85 : 1 };
      if (modern) drawModernSera(ctx, look, opts); else drawPerson(ctx, 'sera', look, opts);
    }
    if (f.cat.visible) drawCat(ctx, { ...f.cat, x: f.cat.x * W, foot: f.cat.foot, controlled: f.controlling === 'yuumi' });
    room.front?.(ctx, env, t);
    // Licht
    this.applyLight(room.dark(env), room.lights(env), t, env.reduced, env.loc === 'dunkel');
    // Hotspot-Schimmer
    for (const h of f.hotspots) {
      if (!h.near) continue;
      const hx = h.x * W, hy = h.y * H;
      const p = env.reduced ? 0.6 : 0.5 + Math.sin(t * 3) * 0.2;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = radial(ctx, hx, hy, 34, [[0, `rgba(255,225,160,${0.28 * p})`], [1, 'rgba(255,225,160,0)']]);
      ctx.fillRect(hx - 40, hy - 40, 80, 80);
      ctx.restore();
      ctx.strokeStyle = `rgba(255,235,190,${0.55 * p})`; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(hx, hy, 9 + p * 3, 0, Math.PI * 2); ctx.stroke();
    }
    // Mystik: Schimmer und Wasserflimmern
    if (f.mystic > 0) {
      ctx.save();
      ctx.globalAlpha = f.mystic * 0.5;
      ctx.fillStyle = radial(ctx, W / 2, H / 2, W * 0.7, [[0, 'rgba(160,190,230,0)'], [1, 'rgba(40,60,110,0.9)']]);
      ctx.fillRect(0, 0, W, H);
      if (!env.reduced) {
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 18; i++) {
          const px = (Math.sin(t * 0.3 + i * 1.7) * 0.5 + 0.5) * W, py = ((t * 12 + i * 60) % H);
          ctx.fillStyle = 'rgba(200,220,255,0.35)'; ctx.beginPath(); ctx.arc(px, H - py, 1.5, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    }
    ctx.drawImage(grain(), 0, 0);
    if (f.fade > 0) { ctx.fillStyle = hex('#050305', Math.min(1, f.fade)); ctx.fillRect(0, 0, W, H); }
    ctx.restore();
  }

  private applyLight(dark: number, lights: { x: number; y: number; r: number; color: string; flicker?: number; strength?: number }[], t: number, reduced: boolean, red: boolean) {
    if (dark <= 0) return;
    const l = this.light.getContext('2d')!;
    const sw = this.light.width, sh = this.light.height;
    l.globalCompositeOperation = 'source-over';
    l.clearRect(0, 0, sw, sh);
    l.fillStyle = red ? `rgba(20,2,2,${dark})` : `rgba(10,8,18,${dark})`;
    l.fillRect(0, 0, sw, sh);
    l.globalCompositeOperation = 'destination-out';
    for (const s of lights) {
      const fl = s.flicker && !reduced ? 1 + Math.sin(t * 9 + s.x) * 0.04 * s.flicker + Math.sin(t * 23 + s.y) * 0.025 * s.flicker : 1;
      const r = (s.r * fl) / 2;
      const st = s.strength ?? 1;
      l.fillStyle = radial(l, s.x / 2, s.y / 2, r, [[0, `rgba(0,0,0,${0.95 * st})`], [0.5, `rgba(0,0,0,${0.55 * st})`], [1, 'rgba(0,0,0,0)']]);
      l.fillRect(s.x / 2 - r, s.y / 2 - r, r * 2, r * 2);
    }
    this.ctx.drawImage(this.light, 0, 0, W, H);
    // warme Tönung
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'soft-light';
    for (const s of lights) {
      const st = (s.strength ?? 1) * 0.6;
      this.ctx.fillStyle = radial(this.ctx, s.x, s.y, s.r * 0.8, [[0, s.color.replace(/[\d.]+\)$/, `${st})`)], [1, 'rgba(0,0,0,0)']]);
      this.ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
    }
    this.ctx.restore();
  }
}
