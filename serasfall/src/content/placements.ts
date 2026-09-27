import type { Placement } from '../engine/types';
import { parseCond as c } from '../engine/script';

// Wer ist wo? Die erste zutreffende Zeile je Figur gilt.
export const PLACEMENTS: Placement[] = [
  // ---------- Kapitel 1 ----------
  { npc: 'tilly', loc: 'halle', x: 0.52, when: c('ch=1 !f:k1_follow') },
  { npc: 'tilly', loc: 'galerie', x: 0.2, when: c('ch=1 f:k1_follow !f:k1_dressed') },
  { npc: 'tilly', loc: 'dienst', x: 0.62, when: c('ch=1') },
  { npc: 'harriet', loc: 'halle', x: 0.44, when: c('ch=1 f:k1_dressed !f:k1_met_harriet') },
  { npc: 'harriet', loc: 'salon', x: 0.62, when: c('ch=1 f:k1_met_harriet') },
  { npc: 'hobbes', loc: 'halle', x: 0.4, when: c('ch=1 f:k1_dressed !f:k1_met_harriet') },
  { npc: 'hobbes', loc: 'arbeit', x: 0.07, when: c('ch=1 f:k1_study_ok !f:k1_left_study') },
  { npc: 'hobbes', loc: 'halle', x: 0.74, when: c('ch=1 f:k1_met_harriet') },
  { npc: 'pryce', loc: 'dienst', x: 0.42, when: c('ch=1') },
  { npc: 'lionel', loc: 'biblio', x: 0.72, when: c('ch=1') },
  { npc: 'penrose', loc: 'biblio', x: 0.26, when: c('ch=1') },

  // ---------- Kapitel 2 ----------
  { npc: 'clara', loc: 'toten', x: 0.72, when: c('ch=2 !seen:k2_laying') },
  { npc: 'pryce', loc: 'toten', x: 0.38, when: c('ch=2 !seen:k2_laying') },
  { npc: 'clara', loc: 'dunkel', x: 0.58, when: c('ch=2 !seen:k2_dark tod=nachmittag') },
  { npc: 'clara', loc: 'toten', x: 0.75, when: c('ch=2 tod=nacht') },
  { npc: 'clara', loc: 'arbeit', x: 0.62, when: c('ch=2') },
  { npc: 'pryce', loc: 'dienst', x: 0.42, when: c('ch=2') },
  { npc: 'tilly', loc: 'dienst', x: 0.62, when: c('ch=2') },
  { npc: 'hobbes', loc: 'galerie', x: 0.78, when: c('ch=2 tod=nachmittag') },
  { npc: 'hobbes', loc: 'salon', x: 0.85, when: c('ch=2 tod=abend') },
  { npc: 'hobbes', loc: 'dienst', x: 0.8, when: c('ch=2') },
  { npc: 'harriet', loc: 'salon', x: 0.55, when: c('ch=2 tod=nachmittag,abend') },
  { npc: 'harriet', loc: 'toten', x: 0.45, when: c('ch=2 tod=nacht') },
  { npc: 'lionel', loc: 'salon', x: 0.28, when: c('ch=2 tod=abend') },
  { npc: 'lionel', loc: 'biblio', x: 0.72, when: c('ch=2') },
  { npc: 'penrose', loc: 'salon', x: 0.7, when: c('ch=2 tod=abend') },
  { npc: 'penrose', loc: 'biblio', x: 0.26, when: c('ch=2') },
];
