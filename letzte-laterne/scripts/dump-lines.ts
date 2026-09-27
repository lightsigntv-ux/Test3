// Sammelt alle Sprechzeilen für die Vertonung: npx tsx scripts/dump-lines.ts > /tmp/lines.json
import { BARKS, CAMP_BANTER, DIALOGS, EVENTS, HUB_LINES, type DialogLine } from '../src/content/story';
import { spokenText, voiceKey } from '../src/content/voice';
const all: DialogLine[] = [
  ...Object.values(DIALOGS).flatMap((d) => d.lines),
  ...Object.values(EVENTS).flatMap((e) => e.intro),
  ...CAMP_BANTER.flat(),
  ...Object.values(HUB_LINES),
  ...Object.values(BARKS).flatMap((b) => [...b.ability, ...b.victory]),
];
const seen = new Map<string, unknown>();
for (const l of all) {
  const text = spokenText(l);
  if (!text) continue;
  seen.set(voiceKey(l), { key: voiceKey(l), speaker: l.speaker, mood: l.mood ?? null, text });
}
console.log(JSON.stringify([...seen.values()], null, 1));
