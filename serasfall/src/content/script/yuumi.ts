// Yuumi-Passagen: Katzenlogik, keine Worte, keine Abkürzungen.
export default `
=== y_unterschrank
kind: yuumi
target: h_a_unterschrank
when: !k:c03
---
narr: Unter dem Schrank ist es dunkel, staubig und herrlich. Es riecht nach altem Holz, nach Mäusen, die längst ausgezogen sind, und nach Metall.
narr: Ganz hinten glänzt etwas Rundes. Eine Pfote. Noch eine Pfote. Es rollt, es klimpert, es ist das Beste, was heute passiert ist. {sfx:bell}
yuumi: (Yuumi schiebt eine goldene Taschenuhr mit gesprungenem Glas unter dem Schrank hervor und setzt sich daneben, sehr stolz.)
inner: Yuumi. Was hast du da – oh.
narr: Eine Taschenuhr, E. A. graviert. Die Kette gerissen, das Glas gesprungen. Die Zeiger stehen auf 2.39. {+c:c03}
inner: Sie steht. Nicht angehalten wie die Uhren im Haus. Stehengeblieben.
inner: Eine Uhr an der Kette rutscht nicht unter einen Schrank, wenn man friedlich im Sessel einschläft. {do:control_sera}

=== y_unterschrank_leer
kind: yuumi
target: h_a_unterschrank
repeat: yes
---
narr: Staub. Der Geruch von Mäusen, die woanders wohnen. Keine Uhren mehr. Enttäuschend.
! {do:control_sera}

=== y_schrankoben
kind: yuumi
target: h_a_schrankoben
repeat: yes
---
narr: Ein Sprung auf den Sessel, einer auf die Lehne, einer auf das Gesims des Bücherschranks. Oben: Staub, eine vertrocknete Motte, der Blick einer Königin über ihr Reich.
yuumi: (Yuumi sieht auf Sera hinunter, als hätte sie das Zimmer soeben erobert.)
! {do:control_sera}

=== y_klavier
kind: yuumi
target: h_s_klavieroben
repeat: yes
---
narr: Auf dem Klavier liegen Noten, warm vom Kamin. Yuumi dreht sich zweimal und legt sich mitten auf Mendelssohn.
inner: Lieder ohne Worte. Sie hat es verstanden.
! {do:control_sera}

=== y_sims
kind: yuumi
target: h_b_sims
repeat: yes
---
narr: Der Kaminsims ist warm und schmal, genau richtig für vier Pfoten. Von hier oben sieht man den ganzen runden Tisch, die Stühle, die Kreidestriche – und unter dem Tisch, halb unter dem Teppich, ein helles Rechteck.
? k:c24 -> known
narr: Yuumi betrachtet das Papier mit äußerster Gleichgültigkeit. {+f:y_saw_sheet}
inner: Da liegt etwas unter dem Tisch. Das hätte ich von unten nie gesehen.
! {do:control_sera}
-> END
# known
narr: Das Papier liegt nicht mehr da. Yuumi gähnt.
! {do:control_sera}

=== y_butler_voices
kind: yuumi
target: h_k_butlertuer
when: ch=2 tod=nachmittag seen:k2_dark !f:k2_pantry_free
important: yes
---
narr: Die Tür zur Butlerkammer steht einen Spalt offen. Dahinter Stimmen, gedämpft. Yuumi setzt sich davor, ein Ohr nach vorn, eins zur Seite, wie ein kleines graues Horchrohr.
narr: Sera bleibt in der Nähe, ein Tuch in der Hand, als wische sie Staub vom Bord.
pryce: Halten Sie still, Josiah.
hobbes: Das Wetter, Agnes. Es ist das Wetter.
pryce: Das Wetter. Das Wetter hat Ihnen nicht das Kreuz verrenkt. Ich hab Sie heut früh gesehn, wie Sie die Treppe raufgekommen sind. Wie ein Mann, der einen Sack Kohlen getragen hat. {+s:s17, +c:c09, hints:f14}
hobbes: Man hat den Herrn anständig gefunden, Agnes. Anständig. Mehr muss niemand wissen.
narr: Stille. Das Geräusch von Salbe, die zwischen zwei Händen verrieben wird. Es riecht bis zur Tür nach Kampfer.
pryce: Das Kind hat die ganze Nacht nicht geschlafen. {hints:f09}
hobbes: Das Kind hat Mäuse gehört.
pryce: Das Kind hat geweint, Josiah. Ich hab es gehört.
hobbes: Dann hat es um den Herrn geweint. Wie wir alle. Und jetzt ist es genug.
yuumi: (Yuumis Schwanz peitscht einmal über die Dielen. Das Glöckchen klingt.) {sfx:bell}
hobbes: Was war das?
narr: Sera hebt Yuumi auf und geht, ohne sich umzudrehen, so langsam, wie man geht, wenn man nichts gehört hat. {do:control_sera, +f:k2_listened}
inner: „Anständig gefunden.“ Das ist keine Beschreibung. Das ist ein Urteil. Hobbes hat entschieden, wie der Herr gefunden werden sollte.

=== y_butler_other
kind: yuumi
target: h_k_butlertuer
repeat: yes
---
narr: Hinter der Tür: das leise Klirren von Silber, das gezählt wird. Sonst nichts, was eine Katze interessiert.
! {do:control_sera}

=== y_gast
kind: yuumi
target: h_g_gastspalt
when: ch>=2 anyf:k2_evening_done,k3_started !k:c26
important: yes
---
narr: Der Spalt unter der Tür ist schmal, aber eine Katze besteht zum größten Teil aus Entschlossenheit. Kopf, Schultern, der Rest folgt.
narr: Drinnen ist es dunkel und riecht nach Rosenwasser, Kerzenrauch und etwas Salzigem. Ein Sessel am Kamin. Darunter, ganz hinten, etwas Weiches.
narr: Es ist klamm. Es riecht nach Tränen, die man schnell wegwischen wollte. Es lässt sich im Maul tragen, wenn man den Kopf hoch genug hält. {sfx:bell}
yuumi: (Yuumi taucht wieder unter der Tür auf, ein zerknülltes Taschentuch zwischen den Zähnen, und legt es Sera vor die Füße wie eine Maus.)
narr: Feines Leinen, ein gesticktes Monogramm in einer Ecke: C. A. {+c:c26}
inner: C. A. Clara Averley. Im Zimmer des Mediums. Unter einem Sessel. Und es ist noch nicht ganz trocken.
inner: Yuumi, du bist eine Diebin. Eine sehr gute. {do:control_sera}

=== y_gast_busy
kind: yuumi
target: h_g_gastspalt
repeat: yes
---
narr: Hinter der Tür raschelt Seide, eine Schublade geht auf und zu. Jemand ist drinnen. Yuumi wartet nicht auf Einladungen – aber auf Gelegenheiten.
! {do:control_sera}

=== y_harriet_door
kind: yuumi
target: h_g_harriettuer
when: ch=3 !seen:k3_chapel
important: yes
---
narr: Hinter Miss Averleys Tür spricht jemand. Leise, gleichmäßig, wie man betet. Aber es ist kein Gebet.
harriet: Ich habe es niemandem gesagt, Edmund. Wie du es wolltest. Nicht Lionel. Nicht dem Kind. {+s:s39, reveals:f01}
harriet: Du hast gesagt, sie sollen dich nicht sterben sehen, bevor du stirbst. Nun haben sie dich überhaupt nicht sterben sehen.
narr: Ein Laut, der kein Wort ist. Dann das Rascheln von Papier, das in etwas Hölzernes gelegt wird, und ein kleiner Schlüssel.
yuumi: (Yuumi legt die Ohren an und zieht sich zurück, als hätte sie etwas gehört, das nicht für Katzen gedacht war.)
inner: Seit wann wusste sie es? Und was hat sie da gerade weggeschlossen? {do:control_sera}

=== y_harriet_other
kind: yuumi
target: h_g_harriettuer
repeat: yes
---
narr: Hinter der Tür ist es still. Eine Stille mit Stuhlkante, aufrecht.
! {do:control_sera}

=== y_pet_1
kind: yuumi
target: pet
when: ch=1
---
yuumi: (Yuumi stößt den Kopf gegen Seras Hand, einmal, zweimal, als wolle sie sagen: Ja, ich bin auch hier. Nein, ich verstehe es auch nicht.) {sfx:purr}

=== y_pet_2
kind: yuumi
target: pet
when: ch=2
---
yuumi: (Yuumi lässt sich hochheben, ungewöhnlich geduldig, und legt die Pfoten auf Seras Schulter. Ihr Glöckchen klingt an Seras Ohr.) {sfx:purr}
inner: Du riechst nach Kohlen und Küche. Du hast dich schon eingelebt. Besser als ich.

=== y_pet_3
kind: yuumi
target: pet
when: ch=3
---
yuumi: (Yuumi rollt sich auf den Rücken, alle vier weißen Pfoten in der Luft, und fängt Seras Hand mit allen gleichzeitig.)
inner: Au. Ja. Ich weiß. Ich habe dich zu wenig gestreichelt, weil ich zu viel nachgedacht habe.

=== y_pet_4
kind: yuumi
target: pet
when: ch>=4 f:k4_found
---
yuumi: (Yuumi schnurrt so laut, dass man es durch das Kleid spürt. Ihre Pfoten sind noch ein bisschen feucht vom Heuboden.) {sfx:purr}
inner: Mach das nie wieder. Nie. Hörst du?

=== y_pet
kind: yuumi
target: pet
repeat: yes
---
yuumi: (Ein Schnurren, ein Blinzeln, ein kleiner Kopfstoß.) {sfx:purr}
`;
