# Die letzte Laterne – verbindlicher Bauplan

Dieses Dokument legt fest, was implementiert wird. Zahlen stehen zentral in
`src/content/balance.ts` und den Inhaltsdateien; hier stehen Regeln.

## Bildschirme & Spielzustände

| Ebene | Zustand | Quelle |
|---|---|---|
| App | `title` → `hub` → Run → `hub` | `ui/App.tsx` (UI-Zustand) |
| Run (`save.run.phase`) | `map`, `combat`, `reward`, `levelup`, `event`, `camp`, `ending`, `result` | `game/types.ts` |
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
  Kampf-Checkpoint `{encounter, seed}`, Laufstatistik.
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
  Wiederholte Fähigkeiten zählen nicht als manueller Einsatz.
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

* Normal: 3 Gegenstände, je Option gewöhnlich 60 % / selten 35 % / legendär 5 %,
  Alternative: kleine Gruppenheilung. Elite: 2 Gegenstände (erste mindestens selten,
  25/60/15) + mit 60 % ein Relikt statt des dritten Gegenstands (sonst ein dritter
  Gegenstand). Erster Elite-Sieg überhaupt: eine Option garantiert legendär.
* Keine identischen Duplikate in einem Angebot, ausgerüstete Relikte nicht erneut.
* Build-Passung: dominante Richtung = häufigstes Build-Symbol der Ausrüstung/Relikte/
  Verbesserungen; enthält das Angebot keine passende Option, wird die letzte Option aus
  dieser Richtung neu gezogen (gleiche Seltenheit).
* Alle Zufälle: `rng(runSeed, Zweck, Station)` → Neuladen erzeugt dasselbe Angebot.

## Run-Level

XP: Kampf 10, Station 7: 15, Elite 20, Ereignis 5. Schwellen 10/30/55 → Level 2/3/4.
Je Level +8 % HP, Schaden, Heilung. Aufstieg: 1 aus 3 nicht gewählten Verbesserungen.

## Metaprogression

Erinnerungslicht: gewonnener Kampf 1, Elite 2, Boss 4, erster Sieg über einen Boss +3,
Lange Nacht +1 je Modifikator beim Boss-Sieg. Wird sofort gutgeschrieben.
Siegel: 3 Zweige × 3 Stufen, Kosten 2/4/6, Kauf erfordert Vorgänger, max. 3 aktiv,
Belastung ≤ 4 (Stufe 1/2 = 1, Stufe 3 = 2), Aktivierung ohne aktive Vorgänger.

## Speichern

`localStorage['letzte-laterne/save']`, `version: 1`. Beim Laden: JSON prüfen, migrieren,
validieren; beschädigte Daten werden unter `.../corrupt` gesichert und ein Hinweis
gezeigt. Kampf-Checkpoint: Run-Zustand vor Kampfbeginn wird gespeichert, Neuladen startet
denselben Kampf mit demselben Seed.

## Arbeitsliste

Siehe `docs/PROGRESS.md`.
