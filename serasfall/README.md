# Seras Fall

*Averley Hall, Somerset, November 1877*

Ein ruhiges, erzählerisches Detektiv- und Erkundungsspiel für den Browser, auf Deutsch.

## Worum es geht (Ausgangslage)

Ein verregneter Novemberabend in der Gegenwart. Sera hat im Internet eine Kiste alter Glasnegative ersteigert, „Nachlass, Somerset“. Ihre kleine graue Katze Yuumi sitzt im Karton, in dem die Kiste kam. Eine der Platten zeigt ein dunkles Treppenhaus. Als Sera sie gegen die Lampe hält, hört sie ein Flüstern.

Kurz darauf wacht sie hinter einem Vorhang in einem Landhaus auf. Die Flut hat es von der Welt abgeschnitten. In der Nacht ist dort jemand gestorben, und alle nennen es „friedlich“.

Mehr verrät dieses README nicht.

> **Achtung:** Der Ordner `docs/spoiler/` enthält die komplette Geschichte samt Auflösung. Wer spielen möchte, öffnet ihn besser nicht.

## Spielen

**Ohne Installation:** Die Datei `Seras Fall.html` im Browser öffnen, etwa per Doppelklick. Alles steckt in dieser einen Datei (Grafik, Schriften, Klang), sie läuft auch offline. Empfohlen sind Chrome, Edge oder Firefox auf dem Desktop, mit einem Fenster ab etwa 1100 px Breite. Kopfhörer lohnen sich.

**Aus dem Quelltext:**

```bash
npm install
npm run dev            # Entwicklungsserver
npm run build          # Build nach dist/
npm run build:single   # Offline-Einzeldatei nach dist-single/index.html
npm test               # automatische Tests (Inhalte, Wissensmatrix, Solver, Durchspiel-Bot)
npm run test:browser   # Browser-Durchläufe aller Enden + Offline-Prüfung (Playwright/Chromium)
```

Der Spielstand wird automatisch im Browser gespeichert: nach jeder Zeile im Gespräch, bei jedem Ortswechsel und bei jeder Schlussfolgerung. Über „Menü → Spielstand exportieren / importieren“ lässt er sich als Text sichern und wieder laden.

## Steuerung

| Taste | Wirkung |
|---|---|
| ← → oder A D | gehen |
| Klick in die Szene | dorthin gehen (auf etwas klicken: hingehen und ansehen) |
| E, Leertaste, Enter | ansehen, ansprechen, Text weiter |
| ↑ ↓ | wechseln, wenn mehrere Dinge an einer Stelle sind |
| 1–4 | Antwort wählen |
| N oder Tab | Notizbuch |
| Y | Yuumi steuern (wo es geht) |
| L | Gesprächsprotokoll |
| Esc | Menü |

Das Spiel lässt sich vollständig mit der Tastatur bedienen. In den Einstellungen gibt es Textgeschwindigkeit, Textgröße, getrennte Lautstärken (Stimmen, Musik, Umgebung, Geräusche, alles aus) sowie „Bewegung reduzieren“.

## Wie man spielt

- **Umsehen.** Gegenstände ansehen, in Räume gehen. Manches bedeutet später etwas anderes, wenn man mehr weiß.
- **Zuhören.** Die Menschen im Haus erzählen mehr, wenn man ihnen zuhört. Sie erzählen weniger, wenn man drängt.
- **Vorlegen.** Im Gespräch unter „Etwas vorlegen …“ kann man Dinge, Aussagen oder eigene Schlüsse zeigen.
- **Selbst denken.** Im Notizbuch stehen unter „Gedanken“ offene Fragen, als Lückensätze. Sera hält nur fest, was sie auch belegen kann. Falsche Antworten werden nicht bestraft. „Nachdenken …“ gibt behutsame Hinweise, aber nie die Lösung.
- **Yuumi.** Sie passt unter Schränke, springt auf Simse und lauscht an Türen. Sie ist eine Katze. Das ist alles, und manchmal genügt es.

Es gibt drei Enden. Keines ist „schlecht“. Eine Partie dauert geschätzt etwa 2½ bis 4 Stunden, je nachdem, wie gründlich man liest und sucht. Das ist nicht an echten Spielerinnen gemessen, siehe `docs/PROGRESS.md`.

## Technik

- TypeScript, Vite, React (Oberfläche), Canvas 2D (Szenen), SVG (Porträts), WebAudio (Klang)
- `src/content/`: nur Daten, also Orte, Figuren, Dialogskripte, Hinweise, Aussagen, Schlussfolgerungen, Kapitel, Wissensmatrix. Das Skriptformat ist in `docs/SCRIPT_FORMAT.md` beschrieben.
- `src/engine/`: reine Funktionen ohne React (Zustand, Bedingungen, Effekte, Dialogablauf, Deduktion, Speichern mit Versionsnummer und Migration)
- `src/ui/`: Darstellung, Eingabe, Audio
- Grafik, Musik und Stimmen entstehen vollständig im Code. Es gibt keine Sprachsynthese; die Figuren „sprechen“ in Silbenlauten mit eigener Tonlage. Die eingebetteten Schriften EB Garamond, IM Fell English und Caveat stehen unter der SIL Open Font License und kommen über `@fontsource`.

Stand, Testergebnisse und bekannte Einschränkungen stehen in `docs/PROGRESS.md`.
