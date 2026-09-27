import { SIM } from '../content/balance';

/**
 * Wandelt Echtzeit in feste Simulationsschritte um. Geschwindigkeit (1×/2×) und Bildrate
 * ändern nur, wie viele Schritte pro Bild ausgeführt werden – nie die Regeln selbst.
 */
export class SimClock {
  private acc = 0;
  /** Gibt die Anzahl der auszuführenden Schritte zurück. */
  advance(realSeconds: number, speed: number, paused: boolean): number {
    if (paused) return 0;
    this.acc += Math.min(0.25, Math.max(0, realSeconds)) * speed;
    const steps = Math.floor(this.acc / SIM.dt + 1e-9);
    this.acc -= steps * SIM.dt;
    return steps;
  }
}
