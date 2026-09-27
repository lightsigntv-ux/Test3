export default `
=== p_intro
kind: scene
when: ch=0 loc=wohnung
priority: 10
---
narr: Ein Dienstagabend im November. Der Regen läuft in Schlieren über die Scheibe, und die Heizung tickt, als würde sie mitzählen.
inner: Die Kiste ist heute gekommen. „Konvolut viktorianischer Glasnegative, Somerset, Nachlass, ca. 40 Stück.“ Für elf Euro und ein bisschen Unvernunft.
inner: Ich wollte einen Leuchtkasten daraus basteln. Das war der Plan. Der Plan ist zwei Wochen alt.
yuumi: (Yuumi sitzt in dem Karton, in dem die Kiste kam, und sieht aus, als hätte sie ihn bestellt.)
inner: Gut. Dann schauen wir mal, wen ich da gekauft habe.

=== p_ex_fenster
kind: examine
target: h_w_fenster
---
narr: Unten glänzt die Straße. Ein Fahrrad klappert vorbei, jemand flucht leise über das Wetter.
inner: Ganz normaler November. Der Sorte, bei der man froh ist, drinnen zu sein.

=== p_ex_handy
kind: examine
target: h_w_handy
---
narr: Das Handy liegt auf dem Sofa, Bildschirm nach unten.
inner: Da kann es auch liegen bleiben. Heute Abend gehöre ich mir.

=== p_ex_lampe
kind: examine
target: h_w_lampe
---
narr: Die Schreibtischlampe. Warmes Licht, eine Birne, die schon zweimal flackern wollte und es sich dann anders überlegt hat.

=== p_glass
kind: examine
target: h_w_kiste
when: ch=0
important: yes
---
narr: Die meisten Platten sind trüb. Eine Kuh, sehr geduldig. Eine Familie auf einem Rasen, alle ein wenig verwischt, als hätten sie es eilig gehabt, wieder ins Haus zu kommen.
narr: Die letzte ist schwerer als die anderen. Ein Treppenhaus, fast schwarz. Nur in der Mitte ein winziger heller Fleck, wie eine Kerze, die jemand vergessen hat.
inner: Negativ. Dunkel ist hell, hell ist dunkel. Also ist da ein Schatten. Auf der Treppe.
* [neutral] (Die Platte gegen die Lampe halten.) -> hold
* [ausweichend] (Zurücklegen. Morgen ist auch noch ein Tag.) -> later
# later
inner: Nein. Wenn ich jetzt aufhöre, denke ich die ganze Nacht an diese Treppe.
# hold
narr: Sie hält das Glas vor die Lampe. Das Licht fällt hindurch, und die Treppe wird zu einem Gewebe aus Grau. {music:none}
narr: Die Heizung tickt nicht mehr. {pause:900}
inner: Moment.
narr: Sehr leise – als käme es aus dem Glas selbst, oder von weit her, oder aus ihr: {pause:600, mood:mystisch}
narr: „… wenn mich doch nur einer …“ {+c:e04, sfx:whisper}
* [mitfuehlend] „Ich hör dich.“ {+f:p_said_hear}
* [direkt] „Hallo? Wer ist da?“ {+f:p_said_who}
* [schweigen] (Den Atem anhalten und lauschen.) {+f:p_said_silent}
yuumi: (Ein Satz, ein Glöckchen – Yuumi landet auf ihrem Schoß, alle vier Pfoten ausgefahren.) {sfx:bell}
narr: Das Glas wird warm. Dann wird die Welt sehr still und sehr nass. {sfx:transition, go:zwischen@0.5}

=== z_echo
kind: scene
when: loc=zwischen
priority: 10
important: yes
---
narr: Stufen. Kalt unter ihr. Alles ist fern, wie unter Wasser. Sie kann die Hand nicht heben, nicht einmal den Kopf drehen. {mood:mystisch, music:echo}
narr: Irgendwo tief unten im Haus läutet eine Glocke. Einmal. Hart. {+c:e03, sfx:bellFar}
narr: Oben klopft jemand an eine Tür, leise und lange. „Miss … bitte … machen Sie auf …“ {+c:e02, sfx:knock}
narr: Ein Licht wandert die Treppe hinauf und wieder hinab, ein kleiner warmer Schein, der zittert. {+c:e01}
narr: Neben ihr weint jemand. Ganz nah. Sie kann nicht hinsehen.
narr: „… wenn mich doch nur einer hören tät …“ {pause:800}
yuumi: (Ein Glöckchen, leise, direkt an ihrem Ohr. Warmes Fell.) {sfx:bell}
narr: Irgendwo oben geht eine Tür. Jemand steht an einem Geländer und sieht herab. Dann schließt sich die Tür wieder, und ein Schlüssel dreht sich im Schloss. {sfx:doorFar}
narr: Dann nichts mehr. Nur Stoff, der nach altem Staub und Lavendel riecht, und Dunkelheit. {go:halle@0.58, chap:1}
`;
