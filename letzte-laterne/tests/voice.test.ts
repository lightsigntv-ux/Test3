import { existsSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BARKS, CAMP_BANTER, DIALOGS, EVENTS, HUB_LINES } from '../src/content/story';
import { spokenText, voiceFile } from '../src/content/voice';

describe('Vertonung', () => {
  it('jede sprechbare Zeile hat eine Aufnahme (sonst: scripts/tts.py erneut ausführen)', () => {
    const lines = [
      ...Object.values(DIALOGS).flatMap((d) => d.lines),
      ...Object.values(EVENTS).flatMap((e) => e.intro),
      ...CAMP_BANTER.flat(),
      ...Object.values(HUB_LINES),
      ...Object.values(BARKS).flatMap((b) => [...b.ability, ...b.victory]),
    ];
    const missing = lines.filter((l) => spokenText(l) && !voiceFile(l)).map((l) => `${l.speaker}: ${l.text}`);
    expect(missing).toEqual([]);
    for (const l of lines) {
      const f = spokenText(l) ? voiceFile(l) : null;
      if (f) expect(existsSync(`public/${f}`) && statSync(`public/${f}`).size > 1000, f).toBe(true);
    }
  });

  it('reine Katzenlaute werden nicht als Sprache vorgelesen', () => {
    expect(spokenText({ speaker: 'yuumi', text: '*mrrp*' })).toBeNull();
    expect(spokenText({ speaker: 'sera', text: '…' })).toBeNull();
    expect(spokenText({ speaker: 'yuumi', text: '*schnurrt und streicht Fritz um die Stiefel*' })).toBe('schnurrt und streicht Fritz um die Stiefel');
  });

  it('Musikdateien sind vorhanden', () => {
    expect(existsSync('public/audio/music/castle-dawn.mp3')).toBe(true);
    expect(existsSync('public/audio/music/clans-last-stand.mp3')).toBe(true);
  });
});
