// Prüft, dass eine reine Textüberarbeitung die Spielstruktur nicht verändert hat.
// Vergleicht Dialoggraphen, Effekte, Bedingungen, IDs und Datenfelder mit einer Referenz – Fließtext wird ausgeblendet.
// Aufruf:  npx tsx tools/structure-check.ts save <datei>   (Referenz anlegen)
//          npx tsx tools/structure-check.ts check <datei>  (vergleichen)
import fs from 'node:fs';
import { buildContent } from '../src/content';
import { PERSON_NOTES, PLACE_NOTES, TIMELINE } from '../src/content/notebook';
import { CHARACTERS } from '../src/content/characters';

// Kleine, ID-artige Zeichenketten sind Struktur; alles mit Großbuchstaben, Umlauten, Satzzeichen ist Fließtext.
const isStructural = (s: string) => /^[a-z0-9_:.=<>!@+#\-]*$/.test(s);
function strip(x: unknown): unknown {
  if (typeof x === 'string') return isStructural(x) ? x : '·';
  if (Array.isArray(x)) return x.map(strip);
  if (x && typeof x === 'object') {
    const o: Record<string, unknown> = {};
    for (const k of Object.keys(x).sort()) {
      if (k === 'src' || k === 'line') continue;
      o[k] = strip((x as Record<string, unknown>)[k]);
    }
    return o;
  }
  return x;
}

const c = buildContent();
const sig: Record<string, string> = {};
for (const [id, d] of Object.entries(c.dialogues)) sig[`dlg:${id}`] = JSON.stringify(strip(d));
for (const [k, v] of Object.entries({ clues: c.clues, statements: c.statements, deductions: c.deductions, locations: c.locations, chapters: c.chapters, placements: c.placements, recon: c.recon, PERSON_NOTES, PLACE_NOTES, TIMELINE, CHARACTERS })) {
  if (Array.isArray(v) || typeof v !== 'object') { sig[k] = JSON.stringify(strip(v)); continue; }
  for (const [id, x] of Object.entries(v as object)) sig[`${k}:${id}`] = JSON.stringify(strip(x));
}

const [mode, file] = process.argv.slice(2);
if (mode === 'save') { fs.writeFileSync(file, JSON.stringify(sig)); console.log(`Referenz: ${Object.keys(sig).length} Einträge`); }
else {
  const ref: Record<string, string> = JSON.parse(fs.readFileSync(file, 'utf8'));
  const diffs: string[] = [];
  for (const k of new Set([...Object.keys(ref), ...Object.keys(sig)])) {
    if (ref[k] === sig[k]) continue;
    if (!ref[k]) { diffs.push(`neu: ${k}`); continue; }
    if (!sig[k]) { diffs.push(`fehlt: ${k}`); continue; }
    // erste abweichende Stelle zeigen
    const a = ref[k], b = sig[k];
    let i = 0; while (i < a.length && a[i] === b[i]) i++;
    diffs.push(`geändert: ${k}\n    vorher: …${a.slice(Math.max(0, i - 80), i + 80)}…\n    jetzt:  …${b.slice(Math.max(0, i - 80), i + 80)}…`);
  }
  if (!diffs.length) console.log(`Struktur unverändert (${Object.keys(sig).length} Einträge).`);
  else { console.log(`${diffs.length} strukturelle Abweichungen:\n` + diffs.join('\n')); process.exit(1); }
}
