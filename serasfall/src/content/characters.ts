import type { NpcId, SpeakerId } from '../engine/types';

export interface Voice {
  base: number; // Grundton Hz
  wave: OscillatorType;
  spread: number; // Tonhöhenstreuung in Halbtönen
  every: number; // jede n-te Silbe klingt
  length: number; // ms pro Silbe
  bright: number; // Filterfrequenz
}

export interface Look {
  skin: string;
  hair: string;
  hairStyle: 'bun' | 'bunLoose' | 'short' | 'bald' | 'cap' | 'swept' | 'childCap' | 'blondUp';
  dress: string;
  trim: string;
  age: number; // 0..1 Falten
  beard?: 'moustache' | 'whiskers' | 'stubble';
  extra?: ('lorgnon' | 'spectacles' | 'jet' | 'rings' | 'keys' | 'gloves' | 'pipe' | 'armband' | 'freckles' | 'scarf' | 'shawl')[];
  eyes: string;
}

export interface CharDef {
  id: SpeakerId;
  name: string;
  short: string;
  role: string;
  voice: Voice;
  look?: Look;
}

export const CHARACTERS: Record<string, CharDef> = {
  sera: {
    id: 'sera', name: 'Sera', short: 'Sera', role: 'als Miss Hale',
    voice: { base: 330, wave: 'triangle', spread: 3, every: 2, length: 55, bright: 2600 },
    look: { skin: '#f1d6c2', hair: '#e6c67a', hairStyle: 'blondUp', dress: '#2f4a3a', trim: '#d9cfb8', age: 0, eyes: '#4a6a78' },
  },
  inner: { id: 'inner', name: 'Sera (Gedanken)', short: '', role: '', voice: { base: 300, wave: 'sine', spread: 2, every: 3, length: 60, bright: 1600 } },
  narr: { id: 'narr', name: '', short: '', role: '', voice: { base: 180, wave: 'sine', spread: 1, every: 99, length: 60, bright: 900 } },
  letter: { id: 'letter', name: 'Handschrift', short: '', role: '', voice: { base: 200, wave: 'sine', spread: 1, every: 99, length: 60, bright: 900 } },
  yuumi: { id: 'yuumi', name: 'Yuumi', short: 'Yuumi', role: 'Katze', voice: { base: 700, wave: 'sine', spread: 5, every: 99, length: 60, bright: 3000 } },
  harriet: {
    id: 'harriet', name: 'Miss Harriet Averley', short: 'Miss Averley', role: 'Schwester des Hausherrn',
    voice: { base: 250, wave: 'sine', spread: 1.5, every: 2, length: 78, bright: 1500 },
    look: { skin: '#ead7c8', hair: '#9d9a98', hairStyle: 'bun', dress: '#16141a', trim: '#2b2830', age: 0.8, extra: ['lorgnon', 'jet'], eyes: '#5b5f66' },
  },
  lionel: {
    id: 'lionel', name: 'Captain Lionel Averley', short: 'Captain Averley', role: 'Sohn und Erbe',
    voice: { base: 135, wave: 'sawtooth', spread: 3, every: 2, length: 58, bright: 1100 },
    look: { skin: '#e4c7ad', hair: '#6b4a2e', hairStyle: 'swept', dress: '#1d2230', trim: '#b89a5a', age: 0.25, beard: 'moustache', extra: ['armband'], eyes: '#6b7f59' },
  },
  clara: {
    id: 'clara', name: 'Miss Clara Averley', short: 'Miss Clara', role: 'Tochter',
    voice: { base: 290, wave: 'square', spread: 2.5, every: 2, length: 50, bright: 1900 },
    look: { skin: '#efd9c9', hair: '#2e211b', hairStyle: 'bun', dress: '#1e1b20', trim: '#453c46', age: 0.05, extra: ['spectacles'], eyes: '#3d3a33' },
  },
  penrose: {
    id: 'penrose', name: 'Mrs. Eliza Penrose', short: 'Mrs. Penrose', role: 'Medium aus Bath',
    voice: { base: 205, wave: 'triangle', spread: 4, every: 2, length: 70, bright: 1300 },
    look: { skin: '#e8cdb6', hair: '#7a3b24', hairStyle: 'bunLoose', dress: '#6b4a3a', trim: '#1b1512', age: 0.4, extra: ['rings', 'shawl'], eyes: '#8f9398' },
  },
  hobbes: {
    id: 'hobbes', name: 'Mr. Hobbes', short: 'Hobbes', role: 'Butler',
    voice: { base: 110, wave: 'sine', spread: 0.8, every: 2, length: 85, bright: 800 },
    look: { skin: '#e6cdb8', hair: '#e8e6e0', hairStyle: 'bald', dress: '#111114', trim: '#f2f0ea', age: 0.85, beard: 'whiskers', extra: ['gloves'], eyes: '#5a5448' },
  },
  pryce: {
    id: 'pryce', name: 'Mrs. Pryce', short: 'Mrs. Pryce', role: 'Haushälterin',
    voice: { base: 220, wave: 'triangle', spread: 2, every: 2, length: 55, bright: 1400 },
    look: { skin: '#e9c9b0', hair: '#6d5a4a', hairStyle: 'cap', dress: '#1c1a1c', trim: '#f4f0e6', age: 0.55, extra: ['keys'], eyes: '#4b5a48' },
  },
  tilly: {
    id: 'tilly', name: 'Tilly', short: 'Tilly', role: 'Küchenmädchen',
    voice: { base: 420, wave: 'square', spread: 5, every: 1, length: 42, bright: 2400 },
    look: { skin: '#f3d3bd', hair: '#b0542c', hairStyle: 'childCap', dress: '#6e7a86', trim: '#efe9dc', age: 0, extra: ['freckles'], eyes: '#557088' },
  },
  dunning: {
    id: 'dunning', name: 'Nat Dunning', short: 'Dunning', role: 'Kutscher',
    voice: { base: 95, wave: 'triangle', spread: 1.2, every: 3, length: 90, bright: 700 },
    look: { skin: '#caa182', hair: '#4a3b2c', hairStyle: 'short', dress: '#3b3a2a', trim: '#5b5a3f', age: 0.5, beard: 'stubble', extra: ['pipe'], eyes: '#5b4a3a' },
  },
};

export const NPC_NAMES: Record<NpcId, string> = {
  harriet: 'Miss Averley', lionel: 'Captain Averley', clara: 'Miss Clara', penrose: 'Mrs. Penrose',
  hobbes: 'Mr. Hobbes', pryce: 'Mrs. Pryce', tilly: 'Tilly', dunning: 'Dunning',
};
