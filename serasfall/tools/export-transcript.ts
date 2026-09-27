// Exportiert Bot-Durchläufe als lesbares Protokoll (für Kaltlesung/Review). Enthält Spoiler.
import { writeFileSync } from 'node:fs';
import { buildContent } from '../src/content';
import { runBot, KIND, HARSH } from '../tests/unit/bot';
const C = buildContent();
const out = process.argv[2] ?? 'transcript';
for (const p of [
  { name: 'echo', order: KIND, ending: 'go' as const },
  { name: 'siegel', order: KIND, npcOrder: { lionel: HARSH }, ending: 'go' as const },
  { name: 'zeugin', order: KIND, ending: 'stay' as const },
]) {
  const r = runBot(C, p);
  writeFileSync(`${out}_${p.name}.txt`, r.transcript.join('\n'));
  console.log(p.name, r.state.ending, r.transcript.length);
}
