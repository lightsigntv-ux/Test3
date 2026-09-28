// Vorlegen: Standardreaktionen (rotierend) und kapitelübergreifende Einzelreaktionen.
export default `
=== pd_harriet_1
kind: present
npc: harriet
items: *
---
harriet[neutral]: Was soll ich damit, Miss Hale?
=== pd_harriet_2
kind: present
npc: harriet
items: *
---
harriet[tense]: Legen Sie das weg. Man kramt nicht in einem Trauerhaus.
=== pd_harriet_3
kind: present
npc: harriet
items: *
---
harriet[neutral]: Ich sehe nicht, was das mit mir zu tun hätte.
=== pd_harriet_4
kind: present
npc: harriet
items: *
---
harriet[neutral]: Nun?
narr: Sie wartete. Als nichts weiter kam, nahm sie ihre Stickerei wieder auf, ohne einen Stich zu tun.

=== pd_lionel_1
kind: present
npc: lionel
items: *
---
lionel[neutral]: Faszinierend. Wirklich. Haben Sie noch mehr davon?
=== pd_lionel_2
kind: present
npc: lionel
items: *
---
lionel[warm]: Wenn das ein Rätsel ist – ich war schon in Harrow schlecht darin.
=== pd_lionel_3
kind: present
npc: lionel
items: *
---
lionel[neutral]: Zeigen Sie das lieber meiner Schwester. Sie mag Dinge, die man untersuchen kann. Menschen weniger.
=== pd_lionel_4
kind: present
npc: lionel
items: *
---
lionel[tense]: Warum zeigen Sie mir das? – Nein. Sagen Sie’s nicht.

=== pd_clara_1
kind: present
npc: clara
items: *
---
clara[neutral]: Und? Was schließen Sie daraus?
=== pd_clara_2
kind: present
npc: clara
items: *
---
clara[neutral]: Das beweist nichts. Noch nicht.
=== pd_clara_3
kind: present
npc: clara
items: *
---
clara[neutral]: Sie sammeln Dinge wie ein Naturforscher. Er hätte das gemocht.
clara[tense]: Ich nicht.
=== pd_clara_4
kind: present
npc: clara
items: *
---
clara[neutral]: Wenn Sie mir etwas zeigen wollen, zeigen Sie mir etwas, das zählt.

=== pd_penrose_1
kind: present
npc: penrose
items: *
---
penrose[warm]: Oh, meine Liebe. Ich lese Menschen, keine Gegenstände.
=== pd_penrose_2
kind: present
npc: penrose
items: *
---
penrose[neutral]: Wie reizend. Soll ich Ihnen sagen, was es fühlt? Nein? Klug.
=== pd_penrose_3
kind: present
npc: penrose
items: *
---
penrose[neutral]: Sie zeigen mir das, um zu sehen, wie ich schaue. Ich schaue immer gleich, Miss Hale. Das ist mein Beruf.
=== pd_penrose_4
kind: present
npc: penrose
items: *
---
penrose[neutral]: Hm. Und was sagt Ihre Katze dazu?

=== pd_hobbes_1
kind: present
npc: hobbes
items: *
---
hobbes[neutral]: Es ist nicht an mir, das zu beurteilen, Miss.
=== pd_hobbes_2
kind: present
npc: hobbes
items: *
---
hobbes[neutral]: Sehr wohl, Miss.
inner: Das heißt: gar nicht wohl, und gehen Sie jetzt.
=== pd_hobbes_3
kind: present
npc: hobbes
items: *
---
hobbes[neutral]: Ich muss Miss bitten, das an seinen Platz zurückzulegen.

=== pd_pryce_1
kind: present
npc: pryce
items: *
---
pryce[neutral]: Legen Sie das nicht auf meinen Tisch. Da kommt gleich der Teig hin.
=== pd_pryce_2
kind: present
npc: pryce
items: *
---
pryce[neutral]: Und was soll ich damit? Kochen?
=== pd_pryce_3
kind: present
npc: pryce
items: *
---
pryce[neutral]: Fragen Sie Mr. Hobbes. Das ist oben, und oben ist seins.

=== pd_tilly_1
kind: present
npc: tilly
items: *
---
tilly[neutral]: Weiß nich, Miss. Is das wichtig?
=== pd_tilly_2
kind: present
npc: tilly
items: *
---
tilly[tense]: Das hab ich nich angefasst! Ehrlich nich.
=== pd_tilly_3
kind: present
npc: tilly
items: *
---
tilly[neutral]: Hübsch. Was is das?
yuumi: (Yuumi schnupperte daran und verlor sofort jedes Interesse.)

=== pd_dunning_1
kind: present
npc: dunning
items: *
---
dunning[neutral]: Kann ich nich sagen, Miss.
=== pd_dunning_2
kind: present
npc: dunning
items: *
---
dunning[neutral]: Das is nix für’n Stall.
=== pd_dunning_3
kind: present
npc: dunning
items: *
---
dunning[neutral]: Zeigen Sie’s dem Braunen. Der versteht genauso viel davon.

=== pr_hobbes_c03
kind: present
npc: hobbes
items: c03
---
hobbes[surprised]: … {pause:600}
hobbes[neutral]: Die Uhr des Herrn.
hobbes[tense]: Wo hat Miss sie gefunden?
* [ehrlich] Unter dem Bücherschrank. Die Katze hat sie hervorgeholt. {hobbes+1} -> a
* [ausweichend] Im Arbeitszimmer. -> b
# a
hobbes[tense]: Unter dem – {pause:400}
hobbes[neutral]: Sie muss ihm aus der Tasche geglitten sein. Als er sich setzte. {lie:f14}
inner: Unter einen Schrank, zwei Meter vom Sessel entfernt. Beim Hinsetzen. Natürlich.
-> c
# b
hobbes[neutral]: Er wird sie abgelegt haben.
# c
hobbes[neutral]: Ich werde sie verwahren, bis der Captain darüber verfügt.
* [neutral] (Ihm die Uhr geben.) {hobbes+1, +f:g_watch_given} -> give
* [direkt] Ich würde sie gern noch behalten. Nur heute. -> keep
# give
narr: Er nahm die Uhr in beide Hände, vorsichtig. Einen Augenblick lang sah er nicht aus wie ein Butler, sondern wie ein alter Mann, der etwas verloren hat.
hobbes[neutral]: Danke, Miss.
inner: 2.39. Ich werde es mir merken, auch ohne Uhr.
-> END
# keep
hobbes[tense]: Das ist nicht an Miss, das zu entscheiden.
hobbes[neutral]: … Heute. Morgen früh ist sie bei mir. {hobbes-1}

=== pr_hobbes_c01
kind: present
npc: hobbes
items: c01,d01
---
hobbes[neutral]: Die Glocken sind alt, Miss. Die Drähte auch.
* [direkt] Da hat jemand mit aller Kraft gezogen. -> a
* [schweigen] (Ihn ansehen.) -> b
# a
hobbes[neutral]: Dann wird man ihn ersetzen, wenn das Wasser fällt.
-> END
# b
narr: Hobbes hielt dem Blick stand, genau so lange, wie es die Höflichkeit verlangte. Dann sah er auf einen Punkt über ihrer Schulter.
hobbes[neutral]: Ich habe in der Nacht keine Glocke gehört, Miss. Mein Zimmer liegt hinter der Kammer. Ich schlafe fest.
inner: Das ist das erste Mal, dass er von sich spricht. Und es ist eine Entschuldigung.

=== pr_hobbes_c32
kind: present
npc: hobbes
items: c32
---
hobbes[neutral]: Man hält die Uhren an, wenn der Herr des Hauses stirbt, Miss. So ist es Brauch.
sera: Auf die Minute, in der er starb?
hobbes[neutral]: Auf die Minute, in der man die Uhren anhalten kann, Miss. Ich hielt sie um fünfundzwanzig nach sechs an.
inner: Die Uhren hat er um fünfundzwanzig nach sechs angehalten. Gefunden hat er ihn, sagt er selbst, um Viertel nach. Was hat er in den zehn Minuten dazwischen getan?

=== pr_tilly_c03
kind: present
npc: tilly
items: c03
---
narr: Tilly sah die Uhr an, und das Blut wich aus ihrem Gesicht, bis die Sommersprossen darauf aussahen wie Tinte auf Papier.
tilly[tense]: Das – das is die Uhr vom Herrn.
tilly[tense]: Die hat er immer rausgeholt, wenn er – wenn einer zu spät war. {hints:f10}
narr: Sie drehte sich um und schrubbte einen Topf, der schon sauber war.
inner: Sie hat die Uhr nicht zum ersten Mal gesehen, seit er tot ist. Ich weiß nicht, woher ich das weiß. Ich weiß es.

=== pr_pryce_s07
kind: present
npc: pryce
items: s07
---
pryce[neutral]: Das Kind hört Gespenster, seit es aus dem Arbeitshaus ist. Dort gibt’s genug davon.
pryce[neutral]: Und diesmal hatte das Gespenst Handschuhe an und frisst mir die Sahne weg. Na?
yuumi: (Yuumi putzte sich demonstrativ das Maul.)

=== pr_harriet_c22
kind: present
npc: harriet
items: c22
---
harriet[tense]: Woher haben Sie das?
sera: Es lag auf seinem Schreibtisch.
? t:harriet>=4 -> open
harriet[neutral]: Mrs. Penrose verteilt ihre Karten großzügig. Das gehört zu ihrem Geschäft.
harriet[neutral]: Legen Sie sie zurück, Miss Hale.
-> END
# open
narr: Harriet nahm die Karte. Sie drehte sie um, sah das „Aug.“ in der engen Handschrift und legte sie mit der Schrift nach unten auf den Tisch, bevor sie sie zurückschob.
harriet[neutral]: Ich fand sie im September in seinem Schreibtisch, als ich Siegellack suchte. Ich dachte, er suche Lucinda. {+s:s38, reveals:f25}
harriet[sad]: Ein Mann, der dreißig Jahre lang über Klopfgeister gelacht hat, fährt nach Bath zu einem Medium. Was hätten Sie gedacht, Miss Hale?
harriet[neutral]: Also schrieb ich ihr. Ich dachte, ich tue ihm damit einen Gefallen.
narr: Ihre Hand lag noch dort, wo die Karte gelegen hatte.

=== pr_penrose_c22
kind: present
npc: penrose
items: c22
when: ch<=3
---
penrose[neutral]: Meine Karte. Ich verteile viele, meine Liebe. Das ist, wie man in Bath überlebt.
narr: Sie betrachtete die Rückseite, die drei Buchstaben in der engen Schrift. Ihr Daumen strich einmal darüber, bevor sie die Karte zurückgab.
penrose[neutral]: August. Ein heißer Monat. Viele Leute kommen im August.
inner: Sie weiß genau, wer diese Karte mitgenommen hat.
`;
