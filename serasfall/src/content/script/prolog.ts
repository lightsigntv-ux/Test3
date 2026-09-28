export default `
=== p_intro
kind: scene
when: ch=0 loc=wohnung
priority: 10
---
narr: Es war ein Dienstagabend im November. Draußen regnete es, und die Heizung tickte leise. Fritz war noch unterwegs und hatte geschrieben, dass es spät werden würde.
inner: Die Kiste ist heute gekommen. „Konvolut viktorianischer Glasnegative, Somerset, Nachlass, ca. 40 Stück.“ Elf Euro. Eigentlich sollte ich am Unterrichtsentwurf für Donnerstag sitzen.
inner: Ich wollte aus den Platten einen Leuchtkasten bauen. Das war vor zwei Wochen der Plan. Na ja. Zehn Minuten, dann mache ich weiter mit dem Entwurf.
yuumi: (Yuumi saß in dem Karton, in dem die Kiste gekommen war, und dachte nicht daran, wieder herauszukommen.)
inner: Na gut. Dann schauen wir mal, was ich da gekauft habe.

=== p_ex_fenster
kind: examine
target: h_w_fenster
---
narr: Unten auf der Straße glänzten die Pfützen unter den Laternen. Ein Radfahrer fuhr vorbei und schimpfte über das Wetter.
inner: Typisch November. Gut, dass ich heute nicht mehr rausmuss.

=== p_ex_handy
kind: examine
target: h_w_handy
---
narr: Das Handy lag auf dem Sofa. Eine neue Nachricht von Fritz: „Bin gegen elf da. Lass mir was vom Tee übrig ♥“
inner: Ich schicke ihm ein Foto von Yuumi im Karton. Das mag er.

=== p_ex_lampe
kind: examine
target: h_w_lampe
---
narr: Die alte Schreibtischlampe. Die Birne flackerte manchmal, aber heute Abend hielt sie durch.

=== p_glass
kind: examine
target: h_w_kiste
when: ch=0
important: yes
---
narr: Die meisten Platten waren trüb. Eine Kuh. Eine Familie auf einem Rasen, alle ein bisschen verwackelt. Die Frauen trugen Kleider mit gerafften Tournüren. Siebzigerjahre, dachte Sera sofort. Achtzehnhundertsiebziger.
narr: Die letzte Platte war schwerer als die anderen. Sie zeigte ein Treppenhaus, sehr blass. In der Mitte war ein kleiner dunkler Fleck und daneben etwas, das ein Schatten sein konnte. Oder ein Kratzer im Glas.
inner: Ein Negativ. Hell ist dunkel, dunkel ist hell. Da war also etwas Helles auf der Treppe. Eine Kerze vielleicht.
* [neutral] (Die Platte gegen die Lampe halten.) -> hold
* [ausweichend] (Zurücklegen. Der Entwurf wartet.) -> later
# later
inner: Nein. Wenn ich jetzt aufhöre, denke ich die ganze Nacht an diese Treppe. Und der Entwurf wird davon auch nicht besser.
# hold
narr: Sera hielt das Glas vor die Lampe. Das Licht fiel hindurch, und die Treppe wurde hellgrau. {music:none}
narr: Die Heizung hörte auf zu ticken. Es wurde ganz still. {pause:900}
inner: Moment mal.
narr: Dann hörte sie eine Stimme. Sehr leise. Sie kam aus dem Glas, oder von weit weg: {pause:600, mood:mystisch}
narr: „… wenn mich doch nur einer …“ {+c:e04, sfx:whisper}
* [mitfuehlend] „Ich hör dich.“ {+f:p_said_hear}
* [direkt] „Hallo? Wer ist da?“ {+f:p_said_who}
* [schweigen] (Den Atem anhalten und lauschen.) {+f:p_said_silent}
yuumi: (Mit einem Satz und einem Klingeln landete Yuumi auf Seras Schoß, alle Krallen draußen.) {sfx:bell}
narr: Das Glas wurde warm in ihren Händen. Dann war alles still, und es roch plötzlich nach Regen und nassem Stein. {sfx:transition, go:zwischen@0.5}

=== z_echo
kind: scene
when: loc=zwischen
priority: 10
important: yes
---
narr: Stufen. Sie lag auf kalten Stufen. Alles klang dumpf und weit weg. Sie konnte die Hand nicht heben, nicht einmal den Kopf drehen. {mood:mystisch, music:echo}
narr: Irgendwo tief unten im Haus läutete eine Glocke. Einmal. Laut und hart. {+c:e03, sfx:bellFar}
narr: Oben klopfte jemand an eine Tür, leise und lange. „Miss … bitte … machen Sie auf …“ {+c:e02, sfx:knock}
narr: Ein Licht kam die Treppe herauf und ging wieder hinunter. Ein kleiner Schein, der zitterte. {+c:e01}
narr: Neben ihr weinte jemand. Ganz nah. Sie konnte nicht hinsehen.
narr: „… wenn mich doch … einer hören …“ {pause:800}
yuumi: (Ein Glöckchen, ganz leise, direkt an ihrem Ohr. Warmes Fell.) {sfx:bell}
narr: Oben ging eine Tür auf. Jemand stand am Geländer und sah herunter. Dann ging die Tür wieder zu, und ein Schlüssel drehte sich im Schloss. {sfx:doorFar}
narr: Dann war da nichts mehr. Nur Stoff, der nach Staub und Lavendel roch, und Dunkelheit. {go:halle@0.58, chap:1, time=morgen}
`;
