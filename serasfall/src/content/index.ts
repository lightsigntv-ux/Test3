import type { Content } from '../engine/core';
import type { Dialogue } from '../engine/types';
import { parseScript } from '../engine/script';
import { CLUES } from './clues';
import { STATEMENTS } from './statements';
import { DEDUCTIONS } from './deductions';
import { LOCATIONS } from './locations';
import { CHAPTERS } from './chapters';
import { PLACEMENTS } from './placements';
import { RECON } from './recon';
import { SCRIPTS } from './script';

export function buildContent(): Content {
  const dialogues: Record<string, Dialogue> = {};
  for (const [name, src] of Object.entries(SCRIPTS)) {
    for (const d of parseScript(src, name)) {
      if (dialogues[d.id]) throw new Error(`Doppelte Dialog-ID ${d.id} (${name})`);
      dialogues[d.id] = d;
    }
  }
  return {
    dialogues,
    clues: Object.fromEntries(CLUES.map((x) => [x.id, x])),
    statements: Object.fromEntries(STATEMENTS.map((x) => [x.id, x])),
    deductions: Object.fromEntries(DEDUCTIONS.map((x) => [x.id, x])),
    locations: Object.fromEntries(LOCATIONS.map((x) => [x.id, x])),
    chapters: CHAPTERS,
    placements: PLACEMENTS,
    recon: RECON,
  };
}

let cached: Content | null = null;
export function content(): Content {
  return (cached ??= buildContent());
}
