import { parseScript, parseCond } from '../../src/engine/script';

describe('Skript-Parser', () => {
  const src = `
=== t_a
kind: topic
npc: tilly
title: Thema
when: ch=1 !f:x t:tilly>=3
---
tilly[warm]: Hallo. {tilly+1, +f:y}
* [mitfuehlend] Eins {tilly+1} -> b
* [direkt] Zwei ?(k:c01) -> c
* [schweigen] (Nichts.)
tilly: Weiter.
-> END
# b
tilly: B.
  fortgesetzt.
? f:y -> c
tilly: nie
# c
! {+f:z}
inner: Ende. {reveals:f08}
`;
  const [d] = parseScript(src, 'test');
  it('liest Kopf', () => {
    expect(d.id).toBe('t_a');
    expect(d.npc).toBe('tilly');
    expect(d.when?.chapterIn).toEqual([1]);
    expect(d.when?.trustMin?.tilly).toBe(3);
  });
  it('verknüpft Knoten und Wahlen', () => {
    const first = d.nodes[d.start];
    expect(first.effects?.trust?.tilly).toBe(1);
    expect(first.choices?.length).toBe(3);
    expect(first.choices?.[0].next).toBe('b');
    expect(first.choices?.[1].cond?.knows).toEqual(['c01']);
    const third = first.choices![2].next;
    expect(d.nodes[third].text).toBe('Weiter.');
    expect(d.nodes[third].next).toBe('END');
    expect(d.nodes.b.text).toBe('B. fortgesetzt.');
    const br = d.nodes[d.nodes.b.next!];
    expect(br.branch?.[0].next).toBe('c');
    expect(d.nodes.c.silent).toBe(true);
    const last = d.nodes[d.nodes.c.next!];
    expect(last.reveals).toEqual(['f08']);
  });
  it('liest Bedingungen', () => {
    const c = parseCond('ch>=2 anyk:c01,c02 sus<4 !yuumi tod=nacht');
    expect(c.minChapter).toBe(2);
    expect(c.knowsAny).toEqual(['c01', 'c02']);
    expect(c.suspicionBelow).toBe(4);
    expect(c.yuumiPresent).toBe(false);
  });
});

describe('Skript-Parser: Sprung vor Wahl', () => {
  it('ein bedingter Sprung direkt vor Wahlmöglichkeiten wird ausgewertet', () => {
    const [d] = parseScript(`
=== t_b
kind: topic
npc: tilly
title: X
---
tilly: A.
? f:x -> skip
* [ehrlich] Eins -> skip
* [direkt] Zwei -> skip
# skip
tilly: B.
`, 't');
    const a = d.nodes[d.start];
    const br = d.nodes[a.next!];
    expect(br.branch?.[0].next).toBe('skip');
    expect(br.choices).toBeUndefined();
    expect(d.nodes[br.next!].choices?.length).toBe(2);
  });
});
