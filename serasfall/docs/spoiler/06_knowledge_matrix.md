⚠ SPOILER – nicht lesen, wenn du das Spiel spielen willst.

# 06 Wissensmatrix

Verbindlich für jede Zeile. Maschinenlesbar in `src/content/knowledge.ts` (IDs neutral: f01 …). Der Test `knowledge.test.ts` prüft jeden Dialogknoten mit `reveals`, `hints` oder `lie`.

**Status:** W = WEISS · A = AHNT · GF:<was> = GLAUBT_FALSCH · N = WEISS_NICHTS · V = VERSCHWEIGT (weiß es, sagt es nicht freiwillig) · L:<was,warum> = LÜGT

**Regeln für Dialoge:**
- `reveals: [f]` nur, wenn Sprecher f **W** oder **V** kennt (V nur hinter der dokumentierten Bedingung) oder f per Lernereignis erfahren hat.
- `hints: [f]` zusätzlich bei **A**.
- `lie: f` nur, wenn Sprecher für f **L** hat.
- Wer **N** oder **GF** hat, darf über f nur seinen Irrtum oder Nichtwissen äußern.

## Tatsachen
| ID | Tatsache |
|---|---|
| f01 | Edmund war schwer herzkrank (Diagnose Aug. 1877). |
| f02 | Edmund war im August bei Mrs. Penrose in Bath und erzählte ihr von Glocke und Versprechen. |
| f03 | Edmund hat Lionels Schulden (1.840 £) bezahlt. |
| f04 | Edmund wollte Clara das Studium ermöglichen (Sammlung, Brief). |
| f05 | Clara stritt um 1 Uhr mit Edmund. |
| f06 | Clara war 1.55–2.38 bei Mrs. Penrose. |
| f07 | Lionel stritt ab 2.10 mit Edmund und ging, als der Anfall begann. |
| f08 | Edmund läutete um 2.28. |
| f09 | Tilly kam, bekam den Brief, lief über die Haupttreppe und klopfte an Claras Tür. |
| f10 | Tilly war bei Edmund, als er starb. |
| f11 | Tilly hat den Brief (Blechdose). |
| f12 | Lionel stand um 2.45–2.50 auf der Terrasse. |
| f13 | Lionel fand den Toten gegen 3.05 und verbrannte die Papiere. |
| f14 | Hobbes fand Edmund am Boden, setzte ihn in den Sessel, spülte Karaffe und Gläser. |
| f15 | Mrs. Pryce hörte die Glocke und blieb sitzen. |
| f16 | Mrs. Penrose sah um 2.56 ein weinendes Mädchen und eine blasse Frau mit Tier auf der Treppe. |
| f17 | Die Kamera belichtete die ganze Nacht; die Platte steckt noch darin. |
| f18 | Harriet schlief unter Chloral. |
| f19 | Der Bittermandelgeruch stammt vom Fixierbad. |
| f20 | Die Séance-Botschaft stammte aus Edmunds eigenem Mund. |
| f21 | In der Nacht kam kein Boot. |
| f22 | Die echte Miss Hale liegt krank in Bristol. |
| f23 | Sera kommt nicht aus dieser Zeit. |
| f24 | Edmund wollte am Morgen etwas bezeugen lassen. |
| f25 | Harriet lud Penrose ein, weil sie deren Karte bei Edmund fand. |
| f26 | Edmunds letzte Worte: „Es ist bezahlt. Sag’s ihm.“ |
| f27 | Edmund sagte zu Lionel: „Lionel. Die Glocke.“ (meinte: Läute!) |

## Matrix (Stand Kapitel 1)
| | Harriet | Lionel | Clara | Penrose | Hobbes | Pryce | Tilly | Dunning |
|---|---|---|---|---|---|---|---|---|
| f01 | V | GF: „etwas schwach, nichts Ernstes“ | A | A | A | A | N | N |
| f02 | A | GF: „Tante hat sie mit Familiengeschichten gefüttert“ | V | V | N | N | N | N |
| f03 | N | GF: „Vater wollte mich bloßstellen“ | N | N | GF: „Schulden, die der Herr ihm vorhalten wollte“ | N | N | N |
| f04 | A | GF: „Enterbung zu Claras Gunsten“ | GF: „Er hat sein Versprechen gebrochen“ | N | A | A | N | N |
| f05 | N | N | V | V | N | N | N | N |
| f06 | N | N | L: „zu Bett“ (Scham) | L: „geschlafen“ (Diskretion, Selbstschutz) | N | N | N | A (Licht im Gästeflügel) |
| f07 | N | L: „ab Mitternacht im Bett“ (Scham, Verdacht) | N | N | A (zweites Glas) | N | N | N |
| f08 | N | N | N | N | N | L: „keine Glocke“ (Tilly schützen) | V | N |
| f09 | N | N | N | A („ein Dienstmädchen“) | N | A | L: „geschlafen“ (Angst) | N |
| f10 | N | N | N | N | N | N | V | N |
| f11 | N | N | N | N | N | N | V | N |
| f12 | N | L (s. f07) | N | A (Rauchgeruch) | N | N | A (nasse Stiefel) | W |
| f13 | N | V | N | A (geschrubbte Hände) | A (Asche, „Crabbe“) | N | N | N |
| f14 | GF: „im Sessel entschlafen“ | V (fand ihn am Boden) | GF: „Sessel“ | N | L: „im Sessel gefunden“ (Würde, Schutz) | A (sein Rücken) | N | N |
| f15 | N | N | N | N | N | V | A (Licht unter ihrer Tür) | N |
| f16 | N | N | N | V | N | N | N | N |
| f17 | GF: „ein Instrument, man verhängt es“ | N | A | N | W | N | N | N |
| f18 | W | A | A | A | A | W | A | N |
| f19 | N | GF: „Gift“ | W | N | A | N | N | N |
| f20 | GF: „Lucinda sprach wirklich“ | GF: „Tante hat sie gefüttert“ | V | V | N | N | N | N |
| f21 | GF: „kam mit dem Boot“ | N | N | N | N | A (trockene Stiefel) | A | W |
| f22 | N | N | N | N | N | N | N | N |
| f23 | N | N | N | A | N | N | A | N |
| f24 | W | W (versteht es falsch, s. f04) | W | W | W | W | N | N |
| f25 | V | N | N | A | N | N | N | N |
| f26 | N | N | N | N | N | N | V | N |
| f27 | N | V (versteht es falsch) | N | N | N | N | N | N |

## Lernereignisse (Veränderungen im Spiel)
| Ereignis (Flag, neutral) | wer lernt | was |
|---|---|---|
| g_body_laid (Kap. 2, Aufbahrung) | Clara | f14 wird A (Totenflecken) |
| g_fix_shown (Kap. 2) | Lionel, wenn Sera ihm das Fixierbad zeigt | f19 → W |
| g_agency (Kap. 4, Post) | Harriet, Hobbes, Pryce, alle | f22 → W; f23 → A bei Harriet, Hobbes |
| g_plate_dev (Kap. 4) | Clara | f17 → W, f09 → A (Kerzenspur), f16-Bild → A |
| g_tilly_spoke (Kap. 4) | Sera (und Clara, falls anwesend) | f09, f10, f11, f26 → W |
| g_letter_read (Kap. 4/5) | Clara | f01, f03, f04 → W |
| g_lionel_told_paid (Kap. 5) | Lionel | f03 → W; f27 → versteht richtig, wenn Sera f26 nennt |
| g_harriet_confessed | Clara, Lionel (wenn anwesend) | f01, f25 → W |
| g_penrose_confessed | Clara, Harriet | f02, f20 → W |
| g_hobbes_confessed | Harriet (Kap. 5) | f14 → W |
| g_pryce_confessed | Tilly | f15 → W |

## Beziehungs- und Vertrauenswerte (verdeckt)
Startwerte (0–10, nie angezeigt): Harriet 3, Lionel 3, Clara 2, Penrose 4 (neugierig), Hobbes 2, Pryce 2, Tilly 5, Dunning 2.
Schwellen: 5 = persönliche Gespräche; 7 = Geständnisse; 9 = das Tiefste (Harriets Skutari, Lionels „Die Glocke“).
