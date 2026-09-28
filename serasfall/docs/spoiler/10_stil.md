⚠ SPOILER – nicht lesen, wenn du das Spiel spielen willst.

# 10 Stilleitfaden (Überarbeitung Schreibstil)

Rückmeldung des Auftraggebers: Dialoge und Erzählung klingen zu geschwollen. Es gibt zu viele nichtssagende Vergleiche. Der Text soll authentisch sein. Als Vorbilder nennt er den Erzählton von Büchern wie *Harry Potter* und *Warrior Cats* (in deutscher Übersetzung).

Die Referenz für den neuen Ton sind `src/content/script/prolog.ts` und die ersten beiden Szenen in `k1_main.ts` (`k1_wake`, `k1_linen`).

## Was dieser Ton ist

- **Klar und konkret.** Man sieht, was passiert. Handlung, Dinge, Geräusche, Gesten.
- **Einfache Sätze.** Kurze bis mittlere Sätze, Hauptsätze, normale Wortstellung. Kein gedrechselter Satzbau.
- **Humor.** Er entsteht aus der Situation und den Figuren, nicht aus Wortspielen oder Pointen.
- **Wärme.** Die Figuren dürfen freundlich, müde, gereizt, albern sein. Sie wirken wie echte Menschen.
- **Spannung.** Sie kommt aus Geschehen und Andeutung, nicht aus Stimmungsadjektiven.

## Regeln

### Erzähler (`narr:`) und Yuumi (`yuumi:`)
1. **Tempus und Perspektive.** Präteritum, dritte Person, nah an Sera. Beispiele: „Sera hielt das Glas vor die Lampe.“ – „Yuumi streckte sich und gähnte.“ Yuumi-Zeilen bleiben in Klammern.
2. **Vergleiche sparsam.** Höchstens einer pro Szene, lieber keiner. Streichen, was nur Stimmung macht und nichts zeigt: „als hätte sie ihn bestellt“, „wie ein Beweisstück“, „als hielte sie sich an einem unsichtbaren Stab fest“, „blass wie Rauch“. Stattdessen sagen, was man sieht: „Sie stand sehr gerade.“ Ein Vergleich bleibt nur, wenn er eine echte Wahrnehmung beschreibt, zum Beispiel „dumpf, wie unter Wasser“.
3. **Keine Vermenschlichung von Dingen.** Keine Heizung, die mitzählt, kein Haus, das atmet, keine Uhr, die schweigt. Stattdessen: „Die Standuhr war stehen geblieben.“
4. **Keine Deutungssätze.** Nichts wie „etwas Schweres lag in der Luft“ oder „Es war, als wüsste das Haus es schon“.
5. **Keine Dreierreihen und Pointen** am Zeilenende, nur um schön zu klingen.
6. **Kurz.** Eine Erzählzeile hat ein bis drei Sätze.

### Seras Gedanken (`inner:`)
1. **Form.** Präsens, erste Person, so wie eine 28-Jährige heute denkt. Normale Alltagssprache („okay“, „na gut“, „irgendwas“, „echt jetzt?“) ist erlaubt, aber nicht in jeder Zeile.
2. **Keine Aphorismen.** Keine klugen Merksätze, keine rhetorischen Pointen. Alt: „Das kam zu schnell. Und es waren zu viele Rüben.“ Neu: „Das kam sehr schnell. Zu schnell, finde ich.“
3. **Beobachtungen.** Sie sind ehrlich und direkt. Unsicherheit darf man sehen („Glaube ich jedenfalls.“).

### Dialoge (alle Figuren)
1. **Wie Menschen reden.** Kurze Sätze, Unterbrechungen, Wiederholungen, halbe Sätze.
2. **Stimmen bleiben erkennbar.** Grundlage sind die Stimmblätter in `05b_voices.md`: Harriet förmlich, Lionel schneidig, Clara scharf und sachlich, Penrose theatralisch, Hobbes formelhaft, Pryce praktisch, Tilly Mundart, Dunning wortkarg. Sie werden aber natürlicher. Penrose darf bildhaft reden, das ist ihre Masche. Auch bei ihr aber höchstens ein Bild pro Zeile, und es muss sitzen.
3. **Epoche.** Die Zeitfarbe kommt über Anreden (Miss, Mrs., Sir, Madam, Master), einzelne Wörter (Dinner, Salon, Gesellschafterin, Coroner) und Umgangsformen. Nicht über altertümelnde Satzstellung.
4. **Tillys Mundart.** Leicht und lesbar: „nich“, „is“, „’n“, „heut“. Nicht mehr als bisher.

### Antwortoptionen
- Kurz und klar. Das ist, was Sera sagt oder tut. Handlungen stehen weiter in Klammern im Infinitiv.
- Die Haltung (Stance in eckigen Klammern) muss zur Formulierung passen: ehrlich, mitfühlend, direkt, Humor, schweigend, ausweichend, Lüge.

## Sera – überarbeitetes Profil

- **Wer sie ist.**
  - 28 Jahre alt, Lehramtsreferendarin für Biologie und Philosophie (Gymnasium).
  - Verheiratet mit **Fritz**, den sie richtig toll findet.
  - Sie liest sehr gern und viel und kennt sich mit Geschichte aus.
  - **Sie erkennt Kleidungsstile und kann sie zeitlich einordnen.**
  - Sie liebt Katzen.
  - Sie ist sehr hilfsbereit und freundlich.
  - Manchmal kann sie sich schlecht auf eine Sache konzentrieren. Dann verliert sie den Gedanken oder den Faden.
- **Die Tarnung bleibt.** Im Haus ist sie „Miss Hale“, die erwartete Gesellschafterin. Ihre Zeitfehler bleiben: Sie gibt Dienstboten die Hand, sagt „okay“ und so weiter.
- **Wie man das zeigt.** Sparsam, verteilt, immer in bestehenden Zeilen. Nie als Aufzählung ihrer Eigenschaften.
  - **Kleidung.** Sie ordnet Kleider und Stoffe ein. Beispiele:
    - Das Kleid in der Truhe ist noch für eine Krinoline geschnitten, also aus den 1860ern.
    - Harriets Trauerkleid ist altmodisch geschnitten.
    - Lionels Uniformrock, Penroses Bühnenkleidung, Tillys Arbeitskleidung, Claras praktisches Kleid ohne Tournüre.
    - Trauerregeln: Krepp, Jet-Schmuck.
    - Sie merkt, wenn jemand etwas Unpassendes trägt, und weiß, was eine Gesellschafterin tragen würde.

    Das darf nur schmücken, es erfindet **keine neuen Spuren**. Kleidung wird nie zum Beweis, der nicht schon da ist.
  - **Geschichte und Bücher.**
    - Sie weiß, was man 1877 wissen kann: Queen Victoria, der Krimkrieg, Indien, Frauenstudium, Dienstbotenhierarchie, Fotografie mit nassen Kollodiumplatten.
    - Sie denkt an Bücher, zum Beispiel an Jane Austen, die Brontës oder „ein Krimi, den ich mal gelesen habe“.
    - Sie hat kein Spezialwissen, das den Fall löst.
  - **Biologie und Lehrerin.**
    - Gelegentlich Unterrichtsreflexe: Sie erklärt Tilly etwas geduldig, denkt „das wäre ein gutes Tafelbild“ oder spürt, dass ihr Unterrichtsbesuch nächste Woche ist.
    - Sie weiß biologisches Grundwissen: Katzenverhalten, Pflanzen. Totenflecken kennt sie aus dem Studium im Prinzip. Das *Deuten am Toten* bleibt Claras Sache.
    - Philosophie nur sehr leicht, zum Beispiel ein Gedanke an Mill, Kant oder „das hätte ich im Seminar gern diskutiert“. Niemals belehrend.
  - **Katzen.** Sie redet mit Yuumi und mit fremden Katzen. Sie freut sich über Katzen.
  - **Hilfsbereit und freundlich.**
    - Sie bietet Hilfe an: tragen, Kohlen holen, zuhören.
    - Sie ist nett zu Dienstboten.
  - **Den Faden verlieren.** Das passiert manchmal in `inner:`-Zeilen. Beispiele:
    - „… wo war ich? Ach ja. Die Glocke.“
    - Sie schweift zu Kleidung, Yuumi oder Fritz ab und kommt dann zurück.
    - **Nie** in Zeilen, die eine Schlussfolgerung erklären, und nie so, dass die Spielerin verwirrt wird.
  - **Fritz.**
    - Sie denkt an ihn in ruhigen Momenten, wenn sie Angst hat oder wenn etwas lustig ist. Beispiele: „Fritz würde jetzt sagen …“, „Das muss ich Fritz erzählen.“, „Fritz fände das großartig.“
    - Nichts über ihn erfinden außer Selbstverständlichem: Er wartet zu Hause, er würde sich Sorgen machen, sie vermisst ihn.
    - Keine Hobbys, kein Beruf, keine Eigenheiten.
- **Richtwerte für das ganze Spiel.** Je Merkmal ungefähr 8–12 Stellen, Fritz 8–12 Stellen. Nicht mehr, sonst wird es aufdringlich.

## Was sich NICHT ändern darf

1. **Struktur.**
   - Gleiche Zahl von Zeilen pro Dialog, gleiche Sprecher, gleiche Ausdrücke in `[…]`.
   - Gleiche Wahlmöglichkeiten mit gleichen Haltungen, Bedingungen und Sprungzielen.
   - Alles in `{…}`, jede `? …`-, `! …`-, `# …`- und `-> …`-Zeile bleibt Zeichen für Zeichen gleich.
   - Die Kopfzeilen der Dialoge (`kind:`, `when:` …) bleiben gleich. Nur `title:` darf umformuliert werden.
   - Prüfen mit `npx tsx tools/structure-check.ts check tools/structure-ref.json`.
2. **Inhalt.**
   - Keine neuen Tatsachen über den Fall.
   - Keine Information streichen, die eine Zeile bisher trägt. Das gilt besonders für Zeilen mit `+c:`, `+s:`, `reveals:`, `hints:` und `lie:`.
   - Keine Hinweise verschärfen oder abschwächen.
   - Die Wissensmatrix (`06_knowledge_matrix.md`) gilt weiter: Niemand sagt etwas, das er nicht wissen kann.
3. **Aussagen.**
   - Zeilen mit `+s:sNN` sagen inhaltlich dasselbe wie der Aussagetext in `statements.ts`.
   - Formulierungen dürfen leicht abweichen. Die Zahlen, Zeiten und Namen bleiben.
4. **Zeitfehler und Tarnung.**
   - Zeitfehler Seras bleiben erhalten.
   - Namen, Titel, Uhrzeiten und Orte bleiben unverändert.
