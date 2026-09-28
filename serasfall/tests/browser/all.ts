// Alle Browser-Prüfungen am Stück: baut, startet eine lokale Vorschau, spielt alle drei Enden, prüft die Offline-Datei.
// Aufruf: npm run test:browser
import { spawn, execSync } from 'node:child_process';

const out = 'tests/browser/out';
const run = (cmd: string) => execSync(cmd, { stdio: 'inherit' });

async function main() {
  run('npx vite build');
  run('npx vite build --mode single');
  const preview = spawn('npx', ['vite', 'preview', '--port', '4174', '--strictPort'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  let ok = true;
  try {
    for (const ending of ['echo', 'siegel', 'zeugin']) {
      try { run(`npx tsx tests/browser/run.ts http://localhost:4174/ ${ending} ${out}`); }
      catch { ok = false; console.error(`Browser-Durchlauf ${ending}: FEHLGESCHLAGEN`); }
    }
    try { run(`npx tsx tests/browser/offline.ts dist-single/index.html ${out}`); }
    catch { ok = false; console.error('Offline-Prüfung: FEHLGESCHLAGEN'); }
  } finally {
    preview.kill();
  }
  if (!ok) process.exit(1);
}
main();
