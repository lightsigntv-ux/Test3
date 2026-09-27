# Die letzte Laterne – verbindlicher Bauplan

Dieses Dokument legt fest, was implementiert wird. Zahlen stehen zentral in
`src/content/balance.ts` und den Inhaltsdateien; hier stehen Regeln.

## Bildschirme & Spielzustände

| Ebene | Zustand | Quelle |
|---|---|---|
| App | `title` → `hub` → Run → `hub` | `ui/App.tsx` (UI-Zustand) |
| Run (`save.run.phase`) | `prepare`, `map`, `combat`, `reward`, `levelup`, `event`, `camp`, `ending`, `result` | `game/types.ts` |
| Overlay | Dialogwarteschlange `save.dialogQueue` | wird vor allem anderen angezeigt |

Jede abgeschlossene Entscheidung ist eine reine Funktion `SaveData → SaveData`
(`game/actions.ts`); nach jeder Aktion wird gespeichert.

## Datenmodell (Kurzfassung)

* `SaveData { version, meta, run | null, settings, dialogQueue }`
* `MetaState`: Erinnerungslicht, gekaufte/aktive Siegel, freigeschaltete Expeditionen,
  Storyflags (`courierSaved`, `namesFreed`, `ending`), Sammlung, gesehene Dialoge,
  `firstEliteLegendaryGiven`, `catGuaranteeUsed`, Lange-Nacht-Protokoll.
* `RunState`: Seed, Expedition, Modifikatoren, Karte (8 Stationen, vorab aus dem Seed
  erzeugt), aktuelle Station, Phase, HP je Held, Aufstellung, 2 Ausrüstungsplätze je Held,
  2 Reliktplätze, XP/Level/Verbesserungen, offene Angebote (Belohnung, Level, Ereignis),
  Kampf-Checkpoint `{encounter, seed}`, Laufstatistik, **Ausprägung je Held**
  (`archetype`), **Talentpunkte** (`attrs`, `attrPoints`).
* **Yuumi** hat keinen eigenen Zustand: `yuumiPresent = run.relics.includes('mondgloeckchen')`.

## Kampfregeln (Simulation `sim/combat.ts`, unabhängig von React)

* Fester Zeitschritt 0,05 s. Die Darstellung sammelt Echtzeit × Geschwindigkeit (1× / 2×)
  und führt ganze Schritte aus → identische Regeln bei jeder Bildrate; Pause = keine Schritte.
* Befehle (Fähigkeiten) werden in eine Warteschlange gelegt und am Anfang des nächsten
  Schritts ausgeführt; in der Pause vorbereitete Befehle laufen beim Fortsetzen.
* Aufstellung: Platz 0 = vorn, 1–2 = hinten. Normale Nahkampfangriffe → vorderste lebende
  Figur (in Aufstellungsreihenfolge). „Hintere Reihe“-Gegner (Symbol 🏹) → lebende hintere
  Figur mit den wenigsten HP, sonst vorn.
* Fokusziel: Grundangriffe der Helden und Yuumis Pfotenhieb treffen das Fokusziel; ist es
  tot, das erste lebende Gegnerziel. **Provokation** (Symbol 🛡️❗) überschreibt das.
* Fokus: max 6, Start 3 (+ Stimmgabel, ± Ereignisse), +1 alle 5 s.
  Laternenwall 2, Funkensturm 3, Erinnerung bewahren 3. Abklingzeit-Untergrenze 3 s.
* Kostenreihenfolge: Klarer Gedanke (−1, min. 1) → Taschenuhr (−2, min. 0).
* Zustände: Brand (max 5 Stapel, 4 s, erneuert bei Anwendung, Schaden je Stapel/s,
  Stärke = höchste aktive Quelle), Schild (Obergrenze 60 % max HP, verschwindet nach dem
  Kampf), Verwundbar (+25 % erlittener Schaden, 4 s, keine Stapel), Unterbrochen
  (beendet eine als unterbrechbar markierte Vorbereitung; Fähigkeit beginnt neu).
* **Effektketten:** Jede Aktion hat eine Quelle `basic | ability | proc`. Gegenstands-,
  Relikt- und Siegeleffekte, die auf Treffer/Fähigkeiten reagieren, lösen nur bei
  `basic`/`ability` aus. Alles, was sie erzeugen (Wiederholung, Explosion, Gegenschaden,
  Weitergabe, Nachzündung) ist `proc` und löst nichts weiter aus.
  Wiederholte Fähigkeiten zählen nicht als manueller Einsatz. Der Echochronik-Zähler
  („jeder 3. manuelle Einsatz des Trägers“) läuft über den ganzen Run (`run.manualUses`),
  weil ein Kampf nur wenige Einsätze erlaubt; Chor der Namen und Siegel des Kanons zählen je Kampf.
* Kampfende wird nach jedem Schaden geprüft; danach passiert nichts mehr. Alle drei
  Helden tot → Niederlage (auch mit Yuumi). Sieg: Tote kehren mit 20 % HP zurück.
* Zeitlimit: Eskalation („Der Nebel verdichtet sich“) nach 75 s (Elite 90 s, Boss 150 s),
  15 s vorher angekündigt. Danach nehmen alle Einheiten wachsenden Nebelschaden
  (0,5 % max HP je Sekunde seit Beginn, pro Sekunde) und Heilung halbiert.

## Yuumi

Relikt „Yuumis Mondglöckchen“ (selten, einzigartig, belegt Reliktplatz). Pfotenhieb 5
Schaden alle 3 s auf das gültige Fokusziel (Quelle `companion`, zählt für keinen Helden,
löst keine Heldengegenstände aus). Nach jedem 3. erfolgreichen Pfotenhieb: Schnurrschutz
6 Schild auf die lebende Hauptfigur mit dem niedrigsten relativen HP-Stand; profitiert von
Wappen der Wache (gruppenweit) und Standhaft (zielbezogen), nicht von Breiter Wall.
Keine HP, nicht angreifbar, nicht heil-/schildbar, kein Fokus, Zähler startet je Kampf bei 0.

## Belohnungen

* Jede Beutekarte hat eine **Qualitätsstufe** (wie in Diablo): Gewöhnlich (grau ●), Magisch
  (blau ◆), Selten (violett ✦), Legendär (gold ★, leuchtend). Normale Gegenstände gibt es in den
  ersten drei Stufen, ihre Werte steigen je Stufe (`TIER_VALUES` in `items.ts`). Legendär sind nur die
  drei Einzelstücke (Glutherz, Eid des Bollwerks, Echochronik) mit festen, starken Werten.
* Chancen je Karte (`REWARD` in `balance.ts`): Kampf 55/30/13/2 %, Elite 15/45/32/8 % (Karte 1
  mindestens Selten, Karte 3 zu 60 % ein Relikt), Lager 0/50/44/6 %. Erster Elite-Sieg überhaupt:
  eine legendäre Karte garantiert. Startgegenstände aus Siegeln sind Magisch.
* Keine identischen Gegenstände in einem Angebot, ausgerüstete Relikte nicht erneut; wenn möglich
  passt eine Karte zur dominanten Build-Richtung. Normale Kämpfe: alternativ 15 % Heilung.
* Alle Zufälle: `rng(runSeed, Zweck, Station)` → Neuladen erzeugt dasselbe Angebot.
* Spielstand Version 2 speichert Gegenstände als `{id, q}`; Version 1 wird migriert.

## Run-Level

XP: Kampf 10, Station 7: 15, Elite 20, Ereignis 5. Schwellen 10/30/55 → Level 2/3/4.
Je Level +4 % HP, Schaden, Heilung und +2 Talentpunkte. Aufstieg: 1 aus 3 nicht gewählten,
zur Ausprägung passenden Verbesserungen (`UPGRADES[].archetypes`).

## Charakterbau (`content/builds.ts`)

* Run beginnt in `prepare`: je Held eine von 3 Ausprägungen wählen, 6 Talentpunkte verteilen
  (+1 je aktivem Siegel). In `prepare` sind Punkte rücknehmbar, danach fest.
* Talentwerte (max. 5 je Wert und Held): Lebenskraft +10 % HP, Stärke +8 % Schaden/Heilung/Schilde,
  Rüstung −5 % erlittener Schaden (max. 50 %), Ausweichen 6 % gegen gegnerische Grundangriffe
  (max. 40 %, nicht gegen Spezialangriffe), Tempo −6 % Angriffsintervall (min. 0,6 s).
* Ausprägungen: Fritz = Stadtwächter / Zwei Klingen / Bollwerk, Ivo = Funken / Frost / Blitz,
  Sera = Hüterin / Giftmischerin / Lichtweberin. Jede ändert Grundwerte, Grundangriff und aktive
  Fähigkeit (Werte in `ARCH_VALUES`). Alle Fritz-Fähigkeiten unterbrechen das Fokusziel.
* Neue Zustände: Frost (Gegner handeln 30 % langsamer, auch Vorbereitungen), Gift (Stapel,
  Schaden je Sekunde), Geschwächt (−25 % Schaden), Herausforderung (alle Gegner greifen Fritz an).
  „Wiegenlied“ und „Tilgen“ entfernen Brand, Gift und Frost.
* Taktik im Kampf: Haltung Offensiv (+25 % verursacht / +20 % erlitten), Ausgewogen,
  Defensiv (−30 % / −35 %), Wechsel alle 2 s; Positionstausch „nach vorn“ für 1 Fokus, 6 s Pause.
* Angriffsbalken unter jeder Figur zeigen den Fortschritt bis zum nächsten Grundangriff.

## Schwierigkeit

Gegnerwerte je Expedition (`EXPEDITION_SCALE`) plus Steigerung je Station
(`STATION_RAMP`: +3 % HP und Schaden je Station). Der erste Run ohne Siegel soll meist
scheitern; Siegel werden erst nach der ersten Niederlage freigeschaltet.

## Metaprogression

Erinnerungslicht: gewonnener Kampf 1, Elite 2, Boss 4, erster Sieg über einen Boss +3,
Lange Nacht +1 je Modifikator beim Boss-Sieg. Wird sofort gutgeschrieben.
Siegel: 3 Zweige × 3 Stufen, Kosten 2/4/6, Kauf erfordert Vorgänger, max. 3 aktiv,
Belastung ≤ 4 (Stufe 1/2 = 1, Stufe 3 = 2), Aktivierung ohne aktive Vorgänger.
Siegel sind gesperrt, bis der erste Run mit einer Niederlage endet (`meta.sealsUnlocked`).
Jedes aktive Siegel bringt zusätzlich +1 Talentpunkt beim Aufbruch.

## Speichern

`localStorage['letzte-laterne/save']`, `version: 3` (v1 → v2: Gegenstände `{id, q}`;
v2 → v3: Charakterbau, `sealsUnlocked` = schon Siegel besessen oder schon verloren). Beim Laden: JSON prüfen, migrieren,
validieren; beschädigte Daten werden unter `.../corrupt` gesichert und ein Hinweis
gezeigt. Kampf-Checkpoint: Run-Zustand vor Kampfbeginn wird gespeichert, Neuladen startet
denselben Kampf mit demselben Seed.

## Arbeitsliste

Siehe `docs/PROGRESS.md`.
