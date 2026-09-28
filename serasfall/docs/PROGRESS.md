# Stand und Tests

Dieses Dokument ist spoilerfrei. IDs statt Inhalte.

## Umfang

| | |
|---|---|
| Struktur | Prolog, 5 Kapitel, Epilog mit Endrekonstruktion |
| Orte | 13 begehbare Orte im Haus und auf dem Gelände, dazu 2 Rahmenorte |
| Figuren | 8 Personen im Haus, Sera, Yuumi (spielbar) |
| Dialoge | 289 Dialogblöcke, 1657 Textzeilen, rund 26 000 Wörter |
| Ein Durchgang | rund 1300–1400 gelesene Zeilen (Durchspiel-Bot) |
| Ermittlung | 32 Hinweise + 4 Erinnerungen, 40 Aussagen, 18 Schlussfolgerungen, 12 Rekonstruktionsfragen |
| Enden | 3 |
| Porträts | je Figur 4–6 Ausdrücke (SVG) |
| Code | ca. 9 800 Zeilen in `src/`, ca. 800 Zeilen Tests |

## Testergebnisse

Die drei Kategorien sind bewusst getrennt.

### Test (automatisiert), `npm test`

Alle 24 Tests grün. Die Tests decken Folgendes ab:

- **Skript-Parser.** Kopfzeilen, Wahlen, Sprünge und Bedingungen, dazu ein Regressionstest für einen Sprung direkt vor Wahlmöglichkeiten.
- **Inhaltsvalidierung.** Alle Verweise auf Hinweise, Aussagen, Flags, Orte, Figuren und Ausdrücke müssen existieren. Jede gesetzte Flag muss gelesen werden und umgekehrt.
- **Wissensmatrix.** Keine Figur spricht über etwas, das sie laut Matrix nicht wissen kann. Jede markierte Enthüllung passt zur Matrix.
- **Deduktions-Solver.** Alle 18 Schlussfolgerungen sind in ihrem Kapitel mit mindestens zwei vorher erreichbaren Belegen lösbar.
- **Durchspiel-Bot (headless, auf der Engine).** Er erreicht alle drei Enden. Zusätzlich spielt er einen knappen, schroffen Weg, der ebenfalls ein Ende erreicht, ohne Sackgasse.

### Browser-Skript gespielt (Playwright, Chromium)

Aufruf: `npm run test:browser`. Das Skript bedient das Spiel über echte Tastendrücke und Klicks, genau wie eine Spielerin. Es liest keinen internen Zustand, um zu schummeln.

- **Durchläufe.** Alle drei Enden wurden in je einem vollständigen Durchlauf erreicht, jeweils rund 2 100 Schritte und etwa 3½ Minuten bei gekürzten Wartezeiten.
- **Konsole.** In allen drei Durchläufen gab es 0 Konsolenfehler und 0 Warnungen.
- **Eingabe wie von Hand (`run.ts … mensch`).** Textgeschwindigkeit „schnell“, Tasten unterschiedlich lang gehalten, Klicks unten rechts, Antworten per Ziffer, Pfeil+Leertaste oder Klick. Jede Eingabe muss genau einen Schritt auslösen. Kapitel 1–2, zwei Durchläufe: rund 1 800 Eingaben, 0 übersprungen. Vor der Korrektur waren es 3–6 Fehler pro Lauf.
- **Neuladen mitten im Gespräch.** Nach dem Neuladen steht das Spiel an derselben Stelle. OK.
- **Offline-Einzeldatei über `file://`.**
  - Startet und ist spielbar.
  - Die Schriften sind eingebettet.
  - Es gibt keine externen Anfragen.
  - Der Spielstand wird gespeichert.
  - Es gibt keine Konsolenfehler.
- **Bildschirmfotos.** Sie wurden bei jedem Kapitelwechsel und in jedem Raum gemacht und von mir angesehen. Dabei fielen Darstellungsfehler auf, die ich behoben habe: verdeckte Figuren, unsichtbare Treppe, zu dunkle Räume, Hände, Notizbuch-Hintergrund.

### Nicht geprüft

- **Spielzeit.** Die angegebenen 2½–4 Stunden sind eine Schätzung aus Textmenge und Lesetempo plus Suchen und Nachdenken. Sie sind nicht an echten Spielerinnen gemessen.
- **Browser.** Firefox, Safari und Edge sind nicht getestet, nur Chromium.
- **Geräte.** Mobilgeräte und Touch sind nicht getestet. Das Spiel ist für den Desktop ab etwa 1100 px Breite gedacht.
- **Klang.** Der Klang ist nur technisch geprüft: WebAudio läuft ohne Fehler. Mischung und Lautstärken hat kein Mensch angehört.
- **Barrierefreiheit.** Tastaturbedienung ist vollständig vorhanden und wird vom Browser-Skript genutzt. Ein Screenreader wurde nicht getestet.
- **Bildschirmgrößen.** Getestet ist nur 1280 × 720.

## Bekannte Einschränkungen

- **Grafik.** Die Szenen sind prozedural im Code gemalt, stilisiert, keine Illustrationen. Die Figuren in den Räumen sind einfache Silhouetten, Details tragen die Porträts.
- **Ungelaufene Dialoge.** Einige optionale Dialoge erreicht der Bot auf keinem seiner Wege, etwa Nebenbemerkungen bei ungewöhnlicher Reihenfolge und seltene Streichel-Momente. Sie sind geparst und validiert, aber in keinem automatischen Durchlauf abgespielt worden. `tests/unit/solver.test.ts` gibt die Liste der IDs bei jedem Lauf aus.
- **Einzelne Bilder.** Manche Schlüsselbilder sind nur schematisch dargestellt.
- **Stimmen.** Silbenlaute statt Sprache, wie verlangt. Das ist Geschmackssache.
- **Spielstände.** Sie liegen im `localStorage` des Browsers. Wer Browserdaten löscht, verliert sie. Export und Import als Text ist vorhanden.
- **Einzeldatei.** Sie ist rund 1,4 MB groß, vor allem wegen der eingebetteten Schriften.
