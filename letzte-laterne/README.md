# Die letzte Laterne

Gruppenbasierter Roguelite-Autobattler mit Dungeon-Knotenkarte und JRPG-Erzählung.
Fritz, Ivo und Sera – und, wenn ihr sie findet, die kleine graue Katze Yuumi – ziehen
durch den Nebel von Vesper.

## Spielen

**Ohne Installation:** den Ordner `spielen/` herunterladen und `spielen/index.html` im
Browser öffnen (funktioniert offline; der Unterordner `audio/` mit Musik und Stimmen muss
daneben liegen). Der Spielstand liegt im `localStorage` des Browsers.

**Entwicklung:**

```bash
cd letzte-laterne
npm install
npm run dev          # http://localhost:5173
npm test             # 63 Vitest-Tests (Regeln, Yuumi, Belohnungen, Spielstände, Builds)
npm run build        # Produktionsbuild nach dist/
npm run build:single # eine offline spielbare HTML-Datei nach dist-single/
```

## Steuerung

| Aktion | Maus | Taste |
|---|---|---|
| Fokusziel markieren | Gegner anklicken | Tab (nächstes Ziel) |
| Fähigkeit Fritz / Ivo / Sera | Fähigkeitsknopf | 1 / 2 / 3 |
| Pause (Befehle vorbereiten) | ❚❚ Pause | Leertaste |
| Geschwindigkeit 1× / 2× | Knöpfe oben rechts | S |
| Build-Übersicht | „Build“ | B |
| Dialog weiter / überspringen | Knöpfe | Enter / Esc |

## Ton

* **Musik:** „Castle Dawn“ in ruhigen Phasen (Titel, Laternenstube, Karte, Ereignisse, Belohnungen),
  „Clans Last Stand“ ab „Kampf beginnen“ bis zum Kampfende. Weiche Überblendung (~1,4 s); während
  gesprochener Zeilen wird die Musik auf 30 % abgesenkt. Die Stücke wurden vom Auftraggeber
  bereitgestellt (`public/audio/music/`, auf 128 kbit/s verkleinert, Stille am Ende entfernt).
* **Sprachausgabe:** Alle 130 Sprechzeilen (Dialoge, Ereignisse, Lager, Laternenstube, Kampfrufe) sind
  vertont – mit kostenlosen Microsoft-Edge-Neuralstimmen über `edge-tts`:
  Fritz = Killian (tiefer, langsamer), Ivo = Florian (schneller), Sera = Seraphina (warm),
  Erzähler = Conrad, Mira = Ingrid, Glockenwächter = Jan, Archivarin = Amala, Hüter = Jonas;
  Yuumis Momente = Katja plus Miauen/Schnurren. Stimmung (traurig/fröhlich) verändert Tempo und Tonhöhe.
  Dialoge sprechen jede Zeile beim Anzeigen; 🔊 wiederholt eine Zeile; optional automatisches Weiterschalten.
* **Effekte (synthetisiert):** Klick/Hover, Bestätigen, Blättern, Schritte auf der Karte, Übergang in den
  Kampf (Windstoß, Trommel, Glocke), Treffer, Brand, Schild/Schildbruch, Tod, Unterbrechung, Explosion,
  Boss-Phasenwechsel (Glockenschlag), Nebel-Eskalation, Levelaufstieg, Beute nach Seltenheit,
  Siegel-Prägen (Stempel), Sieg/Niederlage, Yuumis Miauen und Schnurren.
* **Einstellungen:** Ton an/aus, Regler für Gesamt, Musik, Effekte, Stimmen; Sprachausgabe an/aus.

**Zeilen neu vertonen** (nach Textänderungen; `tests/voice.test.ts` meldet fehlende Aufnahmen):

```bash
pip install edge-tts
npx tsx scripts/dump-lines.ts > /tmp/lines.json
python3 scripts/tts.py /tmp/lines.json      # erzeugt nur fehlende Dateien, schreibt das Manifest
```

## Inhalt

* Laternenstube (Rückzugsort) mit Aufbruch, Siegeln, Sammlung, Chronik, Einstellungen
* 3 Hauptfiguren (Fritz, Ivo, Sera) + Begleiterin Yuumi (über Relikt)
* 3 Expeditionen à 8 Stationen, 6 normale Gegner, 2 Elite, 3 Bosse (je 2 Phasen), 1 Beschwörung
* 12 Ausrüstungsgegenstände, 7 Gruppenrelikte (inkl. Yuumis Mondglöckchen), 9 Run-Verbesserungen
* 9 Siegel in 3 Zweigen (max. 3 aktiv, Belastung ≤ 4), Erinnerungslicht als einzige Währung
* 6 allgemeine Ereignisse (inkl. „Ein Miauen im Nebel“), 3 Storyereignisse, 2 Enden
* „Die lange Nacht“ mit 3 einzeln wählbaren Modifikatoren nach dem Storyabschluss

## Projektstruktur

```
src/
  content/     Inhaltsdaten (keine Logik): balance.ts (zentrale Zahlen), heroes, enemies,
               items (Gegenstände + Relikte), progression (Verbesserungen + Siegel), story
  sim/         Kampfsimulation ohne React: combat.ts (fester 0,05-s-Schritt), clock.ts
               (Echtzeit → Schritte), rng.ts (deterministischer Zufall)
  game/        Spielzustand: types.ts, actions.ts (alle Übergänge als reine Funktionen),
               rewards.ts, derive.ts (abgeleitete Werte, z. B. Yuumis Anwesenheit),
               describe.ts (Tooltips mit echten Zahlen), analysis.ts (Niederlagenanalyse),
               save.ts (Format, Migration, Import/Export), bot.ts (Testspieler)
  ui/          React-Oberfläche: App, Hub, RunView, screens/*, art.tsx (SVG-Figuren), audio.ts
tests/         Vitest
scripts/       balance.ts, encounters.ts, relics.ts, fight.ts (Balancing mit Bots),
               ui-playthrough.mjs, ui-checks.ts, smoke.mjs (Browserprüfungen mit Playwright)
docs/          SPEC.md (verbindlicher Bauplan), PROGRESS.md (Arbeitsstand)
```

Datenfluss: Jede Entscheidung ruft eine Funktion aus `game/actions.ts` auf
(`SaveData → SaveData`). Der Store (`ui/store.ts`) speichert nach jeder Änderung.
Kämpfe laufen in `CombatSim`; erst das Ergebnis (`combatFinished`) ändert den Spielstand.

## Spielstandformat

`localStorage["letzte-laterne/save"]`, JSON, `version: 1`:

```ts
{ version, meta: MetaState, run: RunState | null, settings, dialogQueue: string[] }
```

* `meta`: Erinnerungslicht, gekaufte/aktive Siegel, freigeschaltete Expedition, Storyflags
  (`courierSaved`, `namesFreed`, `ending`, `endingWithYuumi`), Sammlung, gesehene Dialoge und
  Hinweise, `firstEliteLegendaryGiven`, `catGuaranteeUsed`, Protokoll der langen Nacht.
* `run`: Seed, Karte, Station, Phase, HP, Aufstellung, Ausrüstung, Relikte (→ Yuumi),
  XP/Level/Verbesserungen, offene Angebote, **Kampf-Checkpoint** `{kind, encounter, seed}`.
* Laden prüft und migriert; beschädigte Stände werden unter `letzte-laterne/corrupt` gesichert,
  eine ungültige Expedition wird verworfen, der dauerhafte Fortschritt bleibt.
* Export/Import in den Einstellungen (Datei oder Text).

## Erweiterungspunkte

* **Zahlen:** `src/content/balance.ts` und die `*_VALUES`-Tabellen in den Inhaltsdateien.
* **Gegner/Begegnungen:** `ENEMIES` (Fähigkeiten sind Daten: `windup`, `shieldAlly`,
  `healAlly`, `taunt`, `summon`, `shieldSelf`; Bosse über `phases` und optional `cycle`),
  `ENCOUNTERS` je Expedition.
* **Ereignisse:** Texte in `content/story.ts` (`EVENTS`), Wirkung in
  `game/actions.ts → chooseEventOption` (ein `case` je Wahl).
* **Weitere Begleiter über Relikte** (wie Yuumi, ohne neuen Speicherzustand):
  1. Relikt-ID in `content/types.ts` (`RelicId`) und Eintrag in `RELICS` (`items.ts`).
  2. In `sim/combat.ts` analog zu `this.yuumi` einen Begleiterzustand im Konstruktor aus
     `this.relics.has('<id>')` ableiten und in `step()` einen `…Tick` aufrufen. Quelle der
     Aktionen mit `kind: 'companion'` markieren – dadurch gelten automatisch dieselben Regeln
     (keine Heldengegenstände, keine Kettenauslösung, keine Ziele für Gegner).
  3. Anzeige: in `ui/screens/Combat.tsx` neben `yuumi-unit` rendern, Grafik in `ui/art.tsx`.
  4. Optional: Ereignis in `EVENTS` + `chooseEventOption`, Sammlungseintrag im Hub.
  Da Anwesenheit nur aus `run.relics` abgeleitet wird, sind Speichern/Laden/Ablegen bereits
  abgedeckt.

## Bekannte Einschränkungen

* Balancing beruht auf Bot-Simulationen (siehe `docs/PROGRESS.md`) und automatisierten
  Browser-Durchläufen, nicht auf Tests mit Menschen. Spielzeiten sind Schätzungen.
* Grafiken sind einfache, selbst gezeichnete SVG-Figuren; Effekte werden synthetisiert.
* Die Stimmen sind maschinell erzeugt (Microsoft-Edge-TTS). Für eine kommerzielle Veröffentlichung
  müssten die Nutzungsbedingungen geprüft oder die Zeilen neu eingesprochen werden; die Pipeline
  (`scripts/tts.py`) lässt sich auf einen anderen Dienst umstellen.
* Browser starten Ton erst nach der ersten Interaktion (Klick/Taste) – danach läuft die Musik.
* Ausgelegt für Desktop-Browser (ab ca. 1100 px Breite); Mobilgeräte werden nicht optimiert.
* Der Spielstand hängt am Browser und am Ursprung der Seite (Datei, Entwicklungsserver und
  gehostete Fassung haben jeweils eigene Stände) – zum Umziehen Export/Import verwenden.
