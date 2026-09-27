# Arbeitsstand

Legende: **I** = implementiert · **A** = automatisiert geprüft (Vitest) · **B** = im Browser
durch ein Playwright-Skript gespielt/geprüft. „Im Browser gespielt“ heißt hier: automatisiert
gesteuerte Klicks und Tasten in Chromium – nicht von einem Menschen.

| Schritt | Inhalt | Stand |
|---|---|---|
| 1 | Umgebung: Vite + React + TS in `letzte-laterne/`, Start über `npm run dev` oder Einzeldatei | I |
| 2 | Bauplan `docs/SPEC.md` | I |
| 3 | Titel, Laternenstube, Kampfbildschirm mit echten Zustandswechseln | I, B |
| 4 | Kampfsimulation (Zeit, Angriffe, Zielwahl, Tod, Ende) | I, A |
| 5 | Darstellung, Lebensbalken, Trefferzahlen, Protokoll; Fritz schwarz-, Sera blondhaarig | I, B |
| 6 | Aufstellung, Fokusziel, Fähigkeiten, Fokus, Pause, 2× | I, A, B |
| 7 | Belohnungswahl 1 aus 3, Zuweisen, Ersetzen mit Vergleich | I, A, B |
| 8–9 | Kompletter Run, Sieg/Niederlage/Aufgeben, Ergebnis, Erinnerungslicht, Siegel | I, A, B |
| 10 | Autospeichern, Fortsetzen, Kampf-Checkpoint | I, A, B |
| 11 | Brand, Schild, Verwundbar, Unterbrechen, Kettenschutz | I, A |
| 12 | 12 Gegenstände, 7 Relikte, Yuumi (Pfotenhieb, Schnurrschutz, Pfotensymbole) | I, A, B |
| 13 | Run-Level (3 Aufstiege) und 9 Verbesserungen | I, A, B |
| 14 | Glut-, Bastion-, Echo-, Misch- und Yuumi-Build | A (`tests/builds.test.ts`) |
| 15 | 6 Gegnerrollen + 2 Elite | I, A |
| 16 | 8 Stationen, Karte, Lager, 6 Ereignisse, Katzenereignis | I, A, B |
| 17 | 3 Bosse mit je 2 Phasen | I, A (Bot) , B |
| 18 | 9 Siegel, Belastungsbudget, Startgegenstände, Sammlung inkl. Yuumi | I, A |
| 19 | Einleitung, Dialoge, 3 Storyereignisse, Botin-Konsequenz, 2 Enden | I, A, B |
| 20 | Einführung beim ersten Bedarf (Kampf, Ankündigung, Provokation, Beschwörung, Schnurrschutz, voller Fokus) | I, B |
| 21 | Balance mit Bots (siehe unten) | I (Bot-Messung) |
| 22 | Die lange Nacht (3 Modifikatoren, Protokoll) | I, A, B |
| 23 | Fehlerfälle (siehe unten) | A / B |
| 24 | Einzeldatei, README, dieser Stand | I |

## Balancing (Bot-Messungen, 60 Runs je Zeile, `npx tsx scripts/balance.ts`)

„good“ = markiert Heiler/Vorbereiter, unterbricht sofort. „casual“ = reagiert nur alle 1,5 s,
markiert keine Ziele, unterbricht nicht bewusst. Ohne Siegel, ohne Yuumi (sofern nicht genannt).

| Expedition | good | casual | casual + 3 Siegel (Spange, Wachsamkeit, Zunder) | casual + Yuumi | Ø Kampfdauer (Sim.) |
|---|---|---|---|---|---|
| 1 Vorstadt | 95 % | 75 % | 98 % | 100 % | ~25 s |
| 2 Archiv | 97 % | 43 % | 52 % | 93 % | ~38 s |
| 3 Herz | 100 % | 73 % | 97 % | 98 % | ~40–46 s |

Das Archiv ist für passives Spiel bewusst die härteste Stufe: Heilerinnen und Seitenhüter
müssen gezielt als Fokusziel gewählt und „Tilgen“ unterbrochen werden (good-Bot: 97 %).

Wichtige Erkenntnis: Ein deterministischer Bot erzeugt Stufenkurven – knappe Bosskämpfe kippen
durch jeden kleinen Vorteil (Taschenuhr hob E1-casual einmal von 33 % auf 88 %). Yuumi ist
darum im Bot-Maß stark, aber nicht außergewöhnlich stärker als andere gute Relikte; ohne sie
bleiben alle Expeditionen gewinnbar.

**Spielzeit:** Nicht gemessen mit Menschen. Automatisierter UI-Durchlauf bei 2× und ohne
Lesezeit: 62 s (E1), 86 s (E2), 95 s (E3) je Run. Geschätzt für eine neue Person bei 1× mit
Lesen: etwa 8–13 Minuten je Expedition, erste Sitzung bis zum Ende etwa 35–60 Minuten.

## Geprüfte Fehlerfälle

Automatisiert (Vitest): gleichzeitiger Tod mehrerer Helden · letzter Gegner stirbt an Brand ·
letzter Gegner stirbt durch Yuumi · alle Helden fallen trotz Yuumi · Pause/vorbereitete Befehle ·
Geschwindigkeit/Bildrate (gleicher Zustand) · Kettenschutz (Echochronik, Glutherz, Funkenfänger) ·
Schnurrschutz + Wappen/Standhaft · doppeltes Klicken auf Belohnungen · Yuumis Relikt bei vollen
Plätzen, Ablegen, Ersetzen · Neuladen vor/nach Belohnung · Kampf-Checkpoint · Niederlage/Aufgeben ·
Import gültig/ungültig, beschädigter und alter Spielstand · beide Enden mit/ohne Yuumi ·
Lange Nacht · 12 komplette Bot-Runs über alle Expeditionen.

Im Browser (`scripts/ui-checks.ts`, alle 13 Prüfungen bestanden): Neuladen im Kampf, bei der
Belohnung und danach · Katzenereignis inkl. Neuladen und −1 Fokus · Neuladen eines Kampfes mit
Yuumi · Import ungültig/gültig · beide Enden (mit/ohne Yuumi) · Start der langen Nacht.
`scripts/ui-playthrough.mjs` spielte die komplette Geschichte (4 Runs inkl. einer Niederlage)
ohne Konsolenfehler.

## Offene Ideen (nicht Teil dieser Version)

* Menschliche Spieltests und Feinabstimmung der Bosse
* Aufwendigere Grafiken/Animationen, Musik
* Weitere Begleiter über Relikte (siehe README → Erweiterungspunkte)

## Sounddesign (zweite Ausbaustufe)

* Musik: ruhig/Kampf mit Überblendung und Absenken bei Sprache – **B** (`scripts/audio-checks.ts`,
  11 Prüfungen: Musikwechsel bei Kampfbeginn und -ende, Sprachausgabe im Dialog, nächste Zeile,
  Überspringen, Hervorhebung im Ereignis, 🔊-Knopf, Sprachausgabe aus).
* 130/130 Sprechzeilen vertont – **A** (`tests/voice.test.ts` prüft Abdeckung und Dateien).
* Gefundener und behobener Fehler: Der Satz in der Laternenstube unterbrach die Einleitung;
  er wird jetzt erst gesprochen, wenn kein Dialog offen ist.
* Offline-Ordner `spielen/` getestet: Musik und Stimmen laden auch über `file://`.
* Nicht geprüft: das tatsächliche Klangbild mit Lautsprechern (Lautstärkeverhältnisse wurden
  gemessen – Musik ≈ −18 dB, Stimmen ≈ −21 dB mittlerer Pegel – aber nicht angehört).
