import { buildContent } from '../../src/content';
import { runBot, KIND, HARSH } from './bot';

const C = buildContent();

describe('Durchspiel-Bot', () => {
  it('Ende „Das Echo“ (heimkehren, der Captain spricht)', () => {
    const r = runBot(C, { name: 'echo', order: KIND, ending: 'go' });
    if (r.stuck) console.log(r.stuck);
    expect(r.stuck).toBeUndefined();
    expect(r.state.ending).toBe('echo');
    console.log(`echo: ${r.steps} Schritte, ${r.lines} Zeilen, ${r.seenDialogues.size} Dialoge`);
  });

  it('Ende „Das Siegel“ (heimkehren, der Captain schweigt)', () => {
    const r = runBot(C, { name: 'siegel', order: KIND, npcOrder: { lionel: HARSH }, ending: 'go' });
    if (r.stuck) console.log(r.stuck);
    expect(r.stuck).toBeUndefined();
    expect(r.state.ending).toBe('siegel');
  });

  it('Ende „Die Zeugin“ (bleiben)', () => {
    const r = runBot(C, { name: 'zeugin', order: KIND, ending: 'stay' });
    expect(r.stuck).toBeUndefined();
    expect(r.state.ending).toBe('zeugin');
  });

  it('auch ein ungeduldiger Weg (nur Pflichtinhalte, harsch) ist lösbar', () => {
    const r = runBot(C, { name: 'minimal', order: HARSH, ending: 'go', minimal: true });
    if (r.stuck) console.log(r.stuck);
    expect(r.stuck).toBeUndefined();
    expect(['echo', 'siegel']).toContain(r.state.ending);
  });
});
