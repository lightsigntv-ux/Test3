⚠ SPOILER – nicht lesen, wenn du das Spiel spielen willst.

# 07 Detektivdesign

## ID-Schlüssel (Code nutzt nur neutrale IDs)

**Hinweise (c)**
c01 Klingelzugquaste halb abgerissen · c02 Klingeldraht „Arbeitszimmer“ überdehnt · c03 Taschenuhr 2.39 unter dem Bücherschrank · c04 Schürfung an der Schläfe · c05 Spur am Kamingitter · c06 Totenflecken an Rücken/Seite · c07 leerer Platz im Tantalus · c08 frisch gespülte Karaffe + zwei Gläser · c09 Hobbes’ Rücken · c10 Aschefragment „…abbe & Tol… vollständig beglichen“ · c11 Bittermandelgeruch · c12 offene Flasche Fixierbad · c13 Notizbuch: „Ab 12 Uhr belichtet …“ · c14 Notizbuch: Bath-Eintrag · c15 Notizbuch: „C&T angewiesen, 8. Nov.“ · c16 verhängte Kamera · c17 Talg auf der Haupttreppe · c18 Talg vor Claras Tür · c19 nasse Stiefel des Captain · c20 Gartenerde an der Terrassentür · c21 Chloralflasche · c22 Penroses Karte im Schreibtisch · c23 Arztbrief aus Bath · c24 „automatische Schrift“ · c25 Angebot der Institution · c26 Claras Taschentuch im Gästezimmer · c27 Mrs. Pryces Brief „Mittwoch, 2 Uhr früh“ · c28 Tillys heruntergebrannter Kerzenstummel · c29 entwickelte Platte · c30 Edmunds Brief · c31 Brief der Agentur · c32 angehaltene Uhren (6.25)

**Erinnerungen (e)** e01 Kerzenschein · e02 Klopfen, „bitte machen Sie auf“ · e03 fernes Läuten · e04 Flüstern

**Aussagen (s)** – mit Quelle und internem Wahrheitswert in `src/content/statements.ts` (s01–s37, siehe 06).

## Deduktionsmechanik
- Im Notizbuch (Seite „Gedanken“) erscheinen **offene Fragen**, sobald ein auslösender Hinweis bekannt ist.
- Jede Frage ist ein **Lückensatz** mit 1–3 Lücken (Auswahl aus 3–5 Optionen) oder – bei **Widersprüchen** – das Verbinden einer Aussage mit einem Gegenbeweis.
- Eine Antwort wird nur angenommen, wenn die Spielerin **mindestens zwei unabhängige Stützen** kennt (aus der Liste der Frage). Fehlen sie, sagt Sera in eigener Stimme, dass sie rät („Ich rate. Mir fehlt noch etwas, das ich in der Hand halten kann.“). Das verhindert Glückstreffer, ohne zu bestrafen.
- Falsche Antwort: keine Strafe; Sera zweifelt (3–5 Varianten, figurentypisch für die Frage).
- **Denkhilfe** (optional, drei Stufen, nie die Lösung): vage → Richtung → „Was ich mir noch einmal ansehen sollte: …“.
- Gewonnene Schlussfolgerungen können bei Figuren **vorgelegt** werden wie Gegenstände.

## Deduktionsgraph (18 Schlussfolgerungen)

| ID | Kap. | Frage / Lückensatz | richtige Füllung | Stützen (≥2 nötig) | W? |
|---|---|---|---|---|---|
| d01 | 1 | „In der Nacht wurde im ___ heftig nach Hilfe geläutet.“ | Arbeitszimmer | c01, c02, e03 | |
| d02 | 1 | Widerspruch: *Mrs. Pryce* „keine Glocke“ ↔ ___ | d01 oder c02 | s02 + (d01 \| c02) | **W** |
| d03 | 1 | „Der Herr ist ___ und lag danach ___.“ | gestürzt · am Boden | c03, c05, c04, c06 | |
| d04 | 2 | Widerspruch: *Hobbes* „im Sessel entschlafen“ ↔ ___ | d03 oder c06 | s01 + (d03 \| c06); Stütze c09 | **W** |
| d05 | 2 | „Der Herr stürzte um ___.“ | 2.39 (Ablenker: 6.25, Mitternacht, 1.20) | c03 + (c04 \| c05) | |
| d06 | 2 | „Der Bittermandelgeruch kommt vom ___.“ | Fixierbad | c11, c12, s13 | |
| d07 | 2 | „Mit dem Herrn tranken ___ Gläser; jemand hat sie ___.“ | zwei · vor dem Frühstück gespült | c07, c08, s15 | |
| d08 | 3 | Widerspruch: *Lionel* „ab Mitternacht im Bett“ ↔ ___ | s06 oder c19 | s03 + (s06 \| c19 \| c20) | **W** |
| d09 | 3 | „Im Kamin hat ___ Papiere verbrannt.“ | Lionel | c10, s19, d08 | |
| d10 | 3 | „Die Papiere im Kamin bewiesen, dass Lionels Schulden ___ waren.“ | bezahlt | c10, c15 | |
| d11 | 3 | „Die Kamera in der Halle hat ___ belichtet.“ | die ganze Nacht | c13, c16, s10 | |
| d12 | 3 | „Tante Harriet wusste, dass ihr Bruder ___.“ | bald sterben würde | c23, c24, c14 | |
| d13 | 4 | „In der Nacht lief ___ mit einer ___ über die Haupttreppe bis vor ___ Tür.“ | ein Dienstbote · Talgkerze · Claras | c17, c18, e02, c28 | |
| d14 | 4 | Widerspruch: *Clara* „zu Bett“ / *Penrose* „geschlafen“ ↔ ___ | c26 | (s04 \| s05) + c26; Stütze s36 | **W** |
| d15 | 4 | „Die Botschaft der Séance stammte ___.“ | vom Herrn selbst (Bath) | c22, c14, s22 | |
| d16 | 4 | „Das Mädchen auf der Platte ist ___.“ | Tilly | c29, c28, d13 | |
| d17 | 4 | „Die Glocke um halb drei rief ___, und ___ blieb sitzen.“ | Tilly · Mrs. Pryce | d02, c27, c28 | |
| d18 | 5 | „In seiner letzten Nacht wollte der Herr ___.“ | Clara den Weg öffnen und Lionel freisprechen | c25, c30, s11, d10 | |

**Erkenntnisse (bündeln Schlussfolgerungen):**
- **K1 Der Tod** (d01, d03, d05): Herzanfall, Sturz um 2.39, kein Kampf. → widerlegt Mordtheorien.
- **K2 Die Vertuschung am Morgen** (d04, d07): Hobbes hat umgebettet und gespült.
- **K3 Der Sohn** (d08, d09, d10): Lionel war da, ging, verbrannte, was ihn entlastet hätte.
- **K4 Das Haus, das nicht hörte** (d02, d13, d14, d16, d17): Tilly lief, klopfte, niemand öffnete.
- **K5 Das Vermächtnis** (d06, d11, d12, d15, d18): Was der Herr wusste und wollte.

**Endrekonstruktion (Kap. 5, spielerischer Höhepunkt):**
1. *Zeitleiste der Lichtspuren* – sieben Spuren der Platte in die richtige Reihenfolge bringen und je einer Person zuordnen (Clara hinab, Clara hinauf, Lionel quer, Tilly hervor, Tilly hinauf, Tilly hinab, Lionel hinauf). Stützen: d05, d08, d13, d16, Aussagen.
2. *Wie starb Edmund?* (Herz, Sturz 2.39, Tod gegen 2.47, nicht allein)
3. *Warum war er allein, als es begann?* (Lionel ging.)
4. *Wer war bei ihm, als er starb?* (Tilly.)
5. *Wer veränderte das Zimmer und warum?* (Hobbes, aus Treue.)
6. *Was verbrannte im Kamin?* (Die Quittungen – Lionels Freispruch.)
7. *Was wollte der Herr?* (d18)
8. *Mystikebene:* „Das Flüstern auf der Treppe war ___.“ (Tilly) · „Die blasse Frau auf der Platte war ___.“ (ich)

Jede Frage: 3–4 Optionen; falsch → Sera zweifelt, erneut wählen; keine Strafe.

## Fairness-Nachweis
Für jede Schlussfolgerung: Stützen liegen **im selben oder einem früheren Kapitel**, an **mindestens zwei verschiedenen Orten oder Quellen**, und keine ist hinter einer anderen Schlussfolgerung desselben Typs versteckt (kein Zirkel). Der automatische Solver (`solver.test.ts`) simuliert eine Spielerin, die nur zugängliche Hinweise sammelt, und prüft: jede d ist spätestens am Ende ihres Kapitels lösbar; die Endrekonstruktion ist lösbar; keine Stütze liegt hinter der Frage, die sie stützen soll.

| d | Stütze 1 (Ort/Weg) | Stütze 2 (anderer Ort/Weg) |
|---|---|---|
| d01 | c01 Arbeitszimmer (Untersuchen) | c02 Dienstbotenhalle (Untersuchen) |
| d02 | s02 Pryce (Gespräch) | c02 Dienstbotenhalle |
| d03 | c03 Arbeitszimmer (Yuumi) | c05 Arbeitszimmer (Kamin) / c04, c06 Totenzimmer |
| d04 | s01 Hobbes | c06 Totenzimmer (mit Clara) |
| d05 | c03 (Yuumi) | c04 Totenzimmer |
| d06 | c11 Arbeitszimmer (Geruch) | c12 Dunkelkammer / s13 Clara |
| d07 | c07 Arbeitszimmer | c08 Butlerkammer / s15 Tilly |
| d08 | s03 Lionel | s06 Dunning (Stallhof) / c19 Stiefelkammer |
| d09 | c10 Aschekasten | s19 Penrose / d08 |
| d10 | c10 Aschekasten | c15 Notizbuch |
| d11 | c13 Notizbuch | c16 Halle / s10 Hobbes |
| d12 | c24 Bibliothek | c14 Notizbuch / c23 Harriets Kassette |
| d13 | c17 Treppe | c18 Galerie / c28 Küche |
| d14 | s04/s05 | c26 Gästezimmer (Yuumi) |
| d15 | c22 Schreibtisch | c14 Notizbuch / s22 Penrose |
| d16 | c29 Dunkelkammer | c28 Küche / d13 |
| d17 | d02 | c27 Pryces Zimmer / c28 |
| d18 | c25 Schreibtisch | c30 Brief / s11 Harriet |

## Mechaniken im Überblick
- **Untersuchen:** kurze stimmungsvolle Texte; wissensabhängige Neudeutung („Jetzt, wo ich … weiß“) über Varianten mit Bedingungen.
- **Gespräche:** Themen öffnen sich über Wissen (Hinweis/Aussage/Schlussfolgerung), Vertrauen, Ereignisse, Kapitel, Tageszeit.
- **Vorlegen:** Jeder Gegenstand, jede Aussage, jede Schlussfolgerung kann jeder Figur vorgelegt werden. Sinnvolle Kombinationen → eigener Dialog; sonst 3–5 figurentypische Varianten (rotierend, abhängig vom Vertrauen).
- **Notizbuch:** Personen · Orte · Aussagen (mit Quelle und Uhrzeit, wann gehört) · Gegenstände · Zeitleiste · Gedanken (Fragen) – alles in Seras Handschrift.
- **Vertrauen (verdeckt):** + Zuhören, Verständnis, Hilfe, Ehrlichkeit, Katze; − Drängen zur falschen Zeit, Bloßstellen vor anderen, Lügen, die auffliegen. Öffnet persönliche Gespräche (Schwellen 5/7/9).
- **Tarnung (verdeckt, 0–10):** steigt bei Zeitfehlern (Hand geben, „okay“, falsche Anrede, Unwissen über Selbstverständliches). Folgen: Bemerkungen, Misstrauen, in Kap. 4 die Konfrontation nach dem Agenturbrief (Ausgang hängt von Tarnung + Vertrauen ab; nie Game Over).
- **Yuumi-Passagen:** unter Möbel angeln (Uhr, Taschentuch), auf den Bücherschrank (Blick auf den Brief der Institution unter dem Briefbeschwerer? – nein: auf den Schrank, wo Edmund die Karte versteckt hatte → c22 alternativ), vor Türen lauschen (Lionel/Harriet Kap. 3; Hobbes/Pryce Kap. 2), durch die Katzenklappe in den Stall (Kap. 4).
