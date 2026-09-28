// Yuumi-Passagen: Katzenlogik, keine Worte, keine Abkürzungen.
export default `
=== y_unterschrank
kind: yuumi
target: h_a_unterschrank
when: !k:c03
---
narr: Unter dem Schrank war es dunkel, staubig und herrlich. Es roch nach altem Holz, nach Mäusen, die längst ausgezogen waren, und nach Metall.
narr: Ganz hinten glänzte etwas Rundes. Eine Pfote. Noch eine Pfote. Es rollte, es klimperte, es war das Beste, was an diesem Tag passiert war. {sfx:bell}
yuumi: (Yuumi schob eine goldene Taschenuhr mit gesprungenem Glas unter dem Schrank hervor und setzte sich daneben, sehr stolz.)
inner: Yuumi. Was hast du da – oh.
narr: Eine Taschenuhr, E. A. graviert. Die Kette gerissen, das Glas gesprungen. Die Zeiger standen auf 2.39. {+c:c03}
inner: Sie steht. Nicht angehalten wie die Uhren im Haus. Stehengeblieben.
inner: Eine Uhr an der Kette rutscht nicht unter einen Schrank, wenn man friedlich im Sessel einschläft. {do:control_sera}

=== y_unterschrank_leer
kind: yuumi
target: h_a_unterschrank
repeat: yes
---
narr: Staub. Der Geruch von Mäusen, die woanders wohnten. Keine Uhren mehr. Enttäuschend.
! {do:control_sera}

=== y_schrankoben
kind: yuumi
target: h_a_schrankoben
repeat: yes
---
narr: Ein Sprung auf den Sessel, einer auf die Lehne, einer auf das Gesims des Bücherschranks. Oben: Staub, eine vertrocknete Motte, ein guter Blick auf das ganze Zimmer.
yuumi: (Yuumi sah auf Sera hinunter und blinzelte langsam.)
! {do:control_sera}

=== y_klavier
kind: yuumi
target: h_s_klavieroben
repeat: yes
---
narr: Auf dem Klavier lagen Noten, warm vom Kamin. Yuumi drehte sich zweimal und legte sich mitten auf Mendelssohn.
inner: Lieder ohne Worte. Sie hat es verstanden.
! {do:control_sera}

=== y_sims
kind: yuumi
target: h_b_sims
repeat: yes
---
narr: Der Kaminsims war warm und schmal, genau richtig für vier Pfoten. Von hier oben sah man den ganzen runden Tisch, die Stühle, die Kreidestriche – und unter dem Tisch, halb unter dem Teppich, ein helles Rechteck.
? k:c24 -> known
narr: Yuumi betrachtete das Papier mit äußerster Gleichgültigkeit. {+f:y_saw_sheet}
inner: Da liegt etwas unter dem Tisch. Das hätte ich von unten nie gesehen.
! {do:control_sera}
-> END
# known
narr: Das Papier lag nicht mehr da. Yuumi gähnte.
! {do:control_sera}

=== y_butler_voices
kind: yuumi
target: h_k_butlertuer
when: ch=2 tod=nachmittag seen:k2_dark !f:k2_pantry_free
important: yes
---
narr: Die Tür zur Butlerkammer stand einen Spalt offen. Dahinter Stimmen, gedämpft. Yuumi setzte sich davor, ein Ohr nach vorn gerichtet, eins zur Seite.
narr: Sera blieb in der Nähe, ein Tuch in der Hand, als wischte sie Staub vom Bord.
pryce: Halten Sie still, Josiah.
hobbes: Das Wetter, Agnes. Es ist das Wetter.
pryce: Das Wetter. Das Wetter hat Ihnen nicht das Kreuz verrenkt. Ich hab Sie heut früh gesehn, wie Sie die Treppe raufgekommen sind. Wie ein Mann, der einen Sack Kohlen getragen hat. {+s:s17, +c:c09, hints:f14}
hobbes: Man hat den Herrn anständig gefunden, Agnes. Anständig. Mehr muss niemand wissen.
narr: Stille. Das Geräusch von Salbe, die zwischen zwei Händen verrieben wird. Es riecht bis zur Tür nach Kampfer.
pryce: Das Kind hat die ganze Nacht nicht geschlafen. {hints:f09}
hobbes: Das Kind hat Mäuse gehört.
pryce: Das Kind hat geweint, Josiah. Ich hab es gehört.
hobbes: Dann hat es um den Herrn geweint. Wie wir alle. Und jetzt ist es genug.
yuumi: (Yuumis Schwanz peitschte einmal über die Dielen. Das Glöckchen klang.) {sfx:bell}
hobbes: Was war das?
narr: Sera hob Yuumi auf und ging, ohne sich umzudrehen, so langsam, wie man geht, wenn man nichts gehört hat. {do:control_sera, +f:k2_listened}
inner: „Anständig gefunden.“ Das ist keine Beschreibung. Das ist ein Urteil. Hobbes hat entschieden, wie der Herr gefunden werden sollte.

=== y_butler_other
kind: yuumi
target: h_k_butlertuer
repeat: yes
---
narr: Hinter der Tür: das leise Klirren von Silber, das gezählt wurde. Sonst nichts, was eine Katze interessierte.
! {do:control_sera}

=== y_gast
kind: yuumi
target: h_g_gastspalt
when: ch>=2 anyf:k2_evening_done,k3_started !k:c26
important: yes
---
narr: Der Spalt unter der Tür war schmal. Yuumi drückte den Kopf hindurch, dann die Schultern. Der Rest folgte.
narr: Drinnen war es dunkel. Es roch nach Rosenwasser, Kerzenrauch und etwas Salzigem. Ein Sessel am Kamin. Darunter, ganz hinten, etwas Weiches.
narr: Es roch nach Rosenwasser und ganz schwach nach etwas Bitterem, Nussigem. Es ließ sich im Maul tragen, wenn man den Kopf hoch genug hielt. {sfx:bell}
yuumi: (Yuumi tauchte wieder unter der Tür auf, ein zerknülltes Taschentuch zwischen den Zähnen, und legte es Sera vor die Füße, wie eine Maus.)
narr: Feines Leinen, ein gesticktes Monogramm in einer Ecke: C. A. {+c:c26}
inner: C. A. Clara Averley. Im Zimmer des Mediums. Unter einem Sessel. Und es riecht nach der Dunkelkammer.
inner: Yuumi, du bist eine Diebin. Eine sehr gute. {do:control_sera}

=== y_gast_busy
kind: yuumi
target: h_g_gastspalt
repeat: yes
---
narr: Hinter der Tür raschelte Seide, eine Schublade ging auf und zu. Jemand war drinnen. Yuumi wartete am Spalt.
! {do:control_sera}

=== y_harriet_door
kind: yuumi
target: h_g_harriettuer
when: ch=3 !seen:k3_chapel
important: yes
---
narr: Hinter Miss Averleys Tür sprach jemand. Leise, gleichmäßig, wie ein Gebet. Aber es war keins.
harriet: Ich habe es niemandem gesagt, Edmund. Wie du es wolltest. Nicht Lionel. Nicht dem Kind. {+s:s39, reveals:f01}
harriet: Du hast gesagt, sie sollen dich nicht sterben sehen, bevor du stirbst. Nun haben sie dich überhaupt nicht sterben sehen.
narr: Ein Laut, der kein Wort war. Dann das Rascheln von Papier, das in etwas Hölzernes gelegt wurde, und ein kleiner Schlüssel.
yuumi: (Yuumi legte die Ohren an und zog sich zurück.)
inner: Seit wann wusste sie es? Und was hat sie da gerade weggeschlossen? {do:control_sera}

=== y_harriet_other
kind: yuumi
target: h_g_harriettuer
repeat: yes
---
narr: Hinter der Tür war es still. Eine Stille mit Stuhlkante, aufrecht.
! {do:control_sera}

=== y_pet_1
kind: yuumi
target: pet
when: ch=1
---
yuumi: (Yuumi stieß den Kopf gegen Seras Hand, einmal, zweimal, und schnurrte.) {sfx:purr}

=== y_pet_2
kind: yuumi
target: pet
when: ch=2
---
yuumi: (Yuumi ließ sich hochheben, ungewöhnlich geduldig, und legte die Pfoten auf Seras Schulter. Ihr Glöckchen klang an Seras Ohr.) {sfx:purr}
inner: Du riechst nach Kohlen und Küche. Du hast dich schon eingelebt. Besser als ich.

=== y_pet_3
kind: yuumi
target: pet
when: ch=3
---
yuumi: (Yuumi rollte sich auf den Rücken, alle vier weißen Pfoten in der Luft, und fing Seras Hand mit allen gleichzeitig.)
inner: Au. Ja. Ich weiß. Ich habe dich zu wenig gestreichelt, weil ich zu viel nachgedacht habe.

=== y_pet_4
kind: yuumi
target: pet
when: ch>=4 f:k4_found
---
yuumi: (Yuumi schnurrte so laut, dass man es durch das Kleid spürte. Ihre Pfoten waren noch ein bisschen feucht vom Heuboden.) {sfx:purr}
inner: Mach das nie wieder. Nie. Hörst du?

=== y_pet
kind: yuumi
target: pet
repeat: yes
---
yuumi: (Ein Schnurren, ein Blinzeln, ein kleiner Kopfstoß.) {sfx:purr}
`;
