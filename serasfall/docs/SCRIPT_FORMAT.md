# Dialogskript-Format

Alle Gespräche, Untersuchungstexte und Vorlage-Reaktionen stehen in `src/content/script/*.sfs.ts` als Text in einem kompakten Format. Der Parser (`src/engine/script.ts`) wandelt sie in Daten; `npm test` prüft alle Verweise.

```
=== dialog_id
kind: topic            // scene | topic | smalltalk | present | examine | event | yuumi
npc: tilly             // Gesprächspartnerin
title: Die Treppe      // Themenname im Gesprächsmenü (topic)
target: h_bett         // Hotspot (examine / yuumi)
items: c03,d02         // present: vorgelegte Dinge, * = Standardreaktion
when: ch=1 !f:x k:c01 t:tilly>=5 tod=abend loc=halle yuumi sus<5 seen:a !seen:b
priority: 10
repeat: yes
important: yes         // Musik wird leiser (Ducking)
---
tilly[surprised]: Text der Zeile. {tilly+1, +f:flag, +c:c01, +s:s02, sus+1, reveals:f08, hints:f09, lie:f08, pause:600}
inner: Seras innere Stimme.
narr: Erzählte Handlung.
* [mitfuehlend] Antwort A {tilly+1} -> marke
* [direkt] Antwort B ?(k:c01) -> marke2
* [schweigen] (Schweigen.)            // ohne Ziel: weiter mit der nächsten Zeile
? k:c02 -> marke3                      // bedingter Sprung
! {+f:flag}                            // stiller Effekt
# marke
tilly: …
-> END
```

Bedingungen: `ch=1,2` `ch>=2` `ch<=3` `f:` `!f:` `anyf:a,b` `k:` (bekannter Hinweis/Aussage/Schlussfolgerung) `!k:` `anyk:` `t:npc>=n` `t:npc<n` `tod=` `loc=` `yuumi` `!yuumi` `sus>=n` `sus<n` `seen:` `!seen:` `as=yuumi`.

Effekte: `npc+n` (Vertrauen), `+f:` / `-f:` (Flag), `+c:` (Hinweis), `+s:` (Aussage), `sus+n` (Tarnungsverdacht), `time=`, `sfx:`, `music:`.
Metadaten: `reveals:`, `hints:`, `lie:` (Tatsachen-IDs für den Wissensmatrix-Test), `pause:` (ms Stille vor der Zeile), `mood:`.
