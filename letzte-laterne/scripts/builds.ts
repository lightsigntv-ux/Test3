import { combatPolicy } from '../src/game/bot';
import { CombatSim } from '../src/sim/combat';
import { setup } from '../tests/helpers';
const B: any = {
  none: { items: {}, relics: [], upgrades: [] },
  glut: { items: { ivo: ['glutherz', 'zunderring'], fritz: ['ascheglas'], sera: ['funkenfaenger'] }, relics: ['docht', 'aschekompass'], upgrades: ['heisseAsche', 'lauffeuer', 'nachzuendung'], seals: ['glut2'] },
  bastion: { items: { fritz: ['eidDesBollwerks', 'dornenschild'], sera: ['sanftesLeinen', 'schildspange'] }, relics: ['wappen', 'glocke'], upgrades: ['breiterWall', 'standhaft', 'behutsameHaende'], seals: ['bastion2', 'bastion3'] },
  echo: { items: { sera: ['echochronik', 'resonanzkristall'], ivo: ['taktgeber'], fritz: ['stimmgabel'] }, relics: ['taschenuhr', 'chor'], upgrades: ['klarerGedanke', 'nachhall', 'schildstoss'], seals: ['echo2', 'echo3'] },
};
for (const [n, b] of Object.entries(B) as any) {
  const s = new CombatSim(setup({ enemies: ['nebelgaenger', 'nebelkoloss', 'irrlichtschuetze', 'nebelschild'], items: b.items, relics: b.relics, upgrades: b.upgrades, seals: b.seals, hpScale: 3.1, dmgScale: 1.3, seed: 3 }));
  s.runToEnd((x) => combatPolicy(x, 'good'));
  const st = s.stats; const total = Object.values(st.damageDealt).reduce((a: number, c: number) => a + c, 0);
  console.log(n, s.result, s.time.toFixed(0) + 's', 'burn%', (st.burnDamage / total).toFixed(2), 'expl', st.explosions, 'transf', st.transfers, 'absorbed', st.shieldAbsorbed, 'taken', Object.values(st.damageTaken).reduce((a: number, c: number) => a + c, 0), 'uses', JSON.stringify(st.abilityUses), 'echo', st.echoRepeats, 'dealt', JSON.stringify(st.damageDealt));
}
