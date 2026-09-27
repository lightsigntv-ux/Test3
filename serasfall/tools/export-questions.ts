import { writeFileSync } from 'node:fs';
import { buildContent } from '../src/content';
const C = buildContent();
const lines: string[] = ['# Fragen an die Detektivin (ohne Lösungen)', ''];
for (const d of Object.values(C.deductions)) {
  lines.push(`## ${d.id} (Kapitel ${d.chapter}) – ${d.question}`);
  lines.push(`Lückensatz: ${d.template}`);
  d.slots.forEach((s, i) => lines.push(`  Lücke {${i}}: ${s.options.map((o, j) => `(${String.fromCharCode(97 + j)}) ${o}`).join('  ')}`));
  lines.push('');
}
lines.push('# Endrekonstruktion', '');
for (const q of C.recon) {
  lines.push(`## ${q.id}: ${q.prompt}`);
  lines.push('  ' + q.options.map((o, j) => `(${String.fromCharCode(97 + j)}) ${o}`).join('  '));
  lines.push('');
}
writeFileSync(process.argv[2], lines.join('\n'));
