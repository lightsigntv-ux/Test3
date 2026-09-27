export default `
=== t2_pryce_candles
kind: topic
npc: pryce
title: Kerzen
when: ch>=2 ch<=3 !f:k2_tallow_learned
---
sera: Mrs. Pryce, die Kerzen hier unten riechen anders als oben.
pryce[neutral]: Weil’s Talg ist. Hammelfett. Oben brennt man Wachs, unten Talg. Wachs kostet dreimal so viel.
pryce[neutral]: Talg für unten, Wachs für oben. Und wer von unten Wachs nimmt, der fliegt. So war’s in jedem Haus, in dem ich gedient hab.
tilly[neutral]: Talg tropft auch mehr. Und stinkt.
pryce[neutral]: Talg stinkt ehrlich, Tilly. Das ist mehr, als man von manchen Leuten sagen kann. {+f:k2_tallow_learned}
inner: Talg unten, Wachs oben. Das Haus hat sogar für Licht eine Rangordnung.

=== t2_pryce_song
kind: topic
npc: pryce
title: Das Lied beim Waschen
when: ch>=2 seen:k2_laying
---
sera: Das Lied, das Sie gesummt haben, als wir ihn gewaschen haben – was war das?
pryce[neutral]: Nichts. Ein Lied aus Monmouthshire. Meine Mutter hat’s gesungen, wenn sie die Toten im Dorf gewaschen hat. Walisisch. Sie würden’s nicht verstehen.
pryce[neutral]: Es geht um einen Fluss. Man soll sich nicht fürchten, wenn man drüber muss. Das Wasser ist kalt, aber es trägt.
narr: Sie wischt über den Tisch, auf dem nichts liegt.
pryce[neutral]: Ich hab’s zuletzt gesungen, wie Owen aufs Schiff ist. Nach Kanada. Das war kein Toter. Aber es hat sich so angefühlt.
* [mitfuehlend] Schreibt er Ihnen? {pryce+1} -> a
* [schweigen] (Nicken.) {pryce+1} -> b
# a
pryce[neutral]: Jeden Mittwoch schreib ich ihm. Die Post kommt schon wieder. Irgendwann.
inner: Das war keine Antwort auf meine Frage.
-> END
# b
pryce[neutral]: Na. Genug gesungen. Die Zwiebeln.

=== t2_tilly_glasses
kind: topic
npc: tilly
title: Mr. Hobbes’ Gläser
when: ch>=2 anyk:c07,c08
---
sera: Tilly, wann spült Mr. Hobbes eigentlich die Gläser?
tilly[neutral]: Nach dem Frühstück. Immer. Erst Frühstück, dann Silber, dann Gläser. Wie ’n Gebet.
tilly[neutral]: Mr. Hobbes spült nie vor dem Frühstück. Nie nich. Er sagt, wer vor dem Frühstück spült, hat was zu verbergen oder ’n Kater. {+s:s15}
tilly[surprised]: Warum?
* [ausweichend] Nur so. Ich lerne noch, wie alles hier geht. -> a
* [ehrlich] Weil heute jemand vor dem Frühstück gespült hat. {tilly+1} -> b
# a
tilly[neutral]: Das lernt man nie. Ich bin seit ’nem Jahr hier und mach immer noch alles verkehrt.
-> END
# b
tilly[tense]: Oh.
tilly[neutral]: Dann hat Mr. Hobbes ’n Kater. Das hat er nie. {pause:400}
narr: Sie sieht zur Tür der Butlerkammer, dann auf ihre Hände.

=== t2_tilly_letters
kind: topic
npc: tilly
title: Buchstaben
when: ch>=2 f:g_teach !f:g_teach2
---
narr: Tilly hat ein Stück Kreide aus der Speisekammer stibitzt. Auf dem Boden hinter dem Herd, wo Mrs. Pryce nicht hinsieht, stehen schon ein T und ein I.
tilly[neutral]: Und das L, Miss? Richtig rum diesmal.
narr: Sera malt ein L. Tilly malt es nach, zweimal, die Zunge zwischen den Zähnen.
tilly[warm]: Noch ’n L. Und dann?
sera: Dann ein Y. Das sieht aus wie ein Becher auf einem Stiel. Oder wie eine Katze, die sich streckt.
yuumi: (Yuumi setzt sich mitten auf die Kreide und streckt sich ausgiebig.)
tilly[warm]: Y wie Yuumi!
narr: Tilly schreibt ihren Namen. T I L L Y. Die Buchstaben tanzen ein wenig, aber sie stehen. Sie sieht sie an, als könnten sie weglaufen. {tilly+2, +f:g_teach2}
tilly[neutral]: Das bin ich.
inner: Ja. Das bist du.

=== t2_hobbes_newton
kind: topic
npc: hobbes
title: Die Katze
when: ch>=2 yuumi t:hobbes>=3
---
narr: Yuumi sitzt vor Hobbes’ Füßen und sieht zu ihm hinauf mit der Beharrlichkeit einer Bittstellerin.
hobbes[neutral]: Das Tier bleibt aus den Herrschaftsräumen, Miss.
sera: Sie mögen keine Katzen, Mr. Hobbes?
hobbes[neutral]: Es ist nicht an mir, Katzen zu mögen.
narr: Er bückt sich nicht. Aber er rückt mit der Schuhspitze einen losen Faden am Teppich fort, damit Yuumi nicht hineinbeißt.
hobbes[neutral]: Der Herr hatte einen Kater. Newton. Schwarz, mit einem weißen Fleck unter dem Kinn. Er schlief auf den Wetterberichten.
hobbes[neutral]: Letzten Winter ist er gestorben. Der Herr bat mich, ihn unter dem Maulbeerbaum zu begraben. Er hielt die Laterne. Es schneite.
narr: Eine Pause, in der man den Regen an der Tür hört. {pause:600}
hobbes[neutral]: Er sagte: „Das nächste Mal, Hobbes, halten Sie die Laterne.“ Ich habe es für einen Scherz gehalten. {hobbes+1}
inner: Er hat mir gerade etwas erzählt, das er niemandem erzählt hat. Und er sieht aus, als wolle er es zurücknehmen.

=== t2_harriet_mourning
kind: topic
npc: harriet
title: Trauerkleidung
when: ch=2 !f:k2_black
---
harriet[neutral]: Miss Hale. Sie tragen Grün.
inner: Ja. Ich trage Grün. Was soll ich sonst tragen? Oh.
harriet[neutral]: Eine Gesellschafterin trauert mit dem Haus, in dem sie lebt. Mrs. Pryce wird Ihr Kleid heute Nacht färben. Morgen tragen Sie Schwarz.
* [neutral] Natürlich. Ich habe nicht daran gedacht. {sus+1} -> a
* [ehrlich] Ich habe nichts anderes. Es tut mir leid. {harriet+1} -> b
# a
harriet[neutral]: Man denkt nicht daran. Man tut es.
-> c
# b
harriet[neutral]: Man hat Ihnen Ihr Gepäck nicht nachgeschickt? Nun. Das Wasser.
harriet[neutral]: Miss Finch hat einen schwarzen Umhang dagelassen. Nehmen Sie ihn.
# c
! {+f:k2_black}

=== t2_harriet_clara
kind: topic
npc: harriet
title: Miss Clara
when: ch>=2 ch<=3 seen:k2_laying
---
sera: Miss Clara scheint sehr – gefasst.
harriet[neutral]: Clara ist nicht gefasst. Clara ist wie ihr Vater. Sie steckt alles in ein Glas mit Spiritus und beschriftet es.
harriet[neutral]: Er hat ihr beigebracht, dass man alles untersuchen kann. Er hat ihr nicht beigebracht, dass man danach trotzdem allein ist.
harriet[neutral]: Sie will nach London. An eine Schule, an der Frauen – Leichen öffnen. Er hat es ihr versprochen, weil Lucinda es sich auf dem Sterbebett gewünscht hat. „Lass sie wählen.“ {hints:f04}
harriet[tense]: Man lässt ein Kind nicht wählen. Man bewahrt es.
* [direkt] Wovor? -> a
* [mitfuehlend] Sie haben Angst um sie. {harriet+1} -> b
# a
harriet[neutral]: Vor allem, was eine unverheiratete Frau allein in London erwartet. Ich weiß, wovon ich spreche, Miss Hale. Ich bin eine.
-> END
# b
harriet[neutral]: Angst ist ein Wort für Dienstmädchen.
harriet[sad]: … Ja.

=== t2_lionel_poison
kind: topic
npc: lionel
title: Das Gift
when: ch>=2 k:d06 !f:g_fix_shown
---
sera: Captain, der Bittermandelgeruch im Arbeitszimmer. Er kommt aus der Dunkelkammer. Fixierbad, für die Fotografie. Die Flasche stand offen.
lionel[surprised]: Fixierbad.
lionel[neutral]: Kaliumcyanid, nehme ich an. Dasselbe, nur in einer braunen Flasche mit Etikett.
narr: Er setzt sich. Zum ersten Mal sieht er nicht aus wie jemand, der ein Publikum hat.
lionel[neutral]: Er hat mit seinem Gift fotografiert, und ich wollte eine Mörderin. Das ist sehr bezeichnend für uns beide. {+f:g_fix_shown, reveals:f19}
lionel[tense]: Dann war es sein Herz. Dann war es einfach sein Herz.
inner: Er sagt es, als wäre das schlimmer. Warum wäre das schlimmer?
lionel[neutral]: Danke, Miss Hale. Ich werde mich bei Mrs. Penrose entschuldigen. Irgendwann. Wenn ich nüchtern bin, also vermutlich nie.

=== t2_lionel_signature
kind: topic
npc: lionel
title: Die Unterschrift
when: ch>=2 ch<=3 k:s11
---
sera: Ihr Vater wollte heute früh etwas bezeugen lassen.
lionel[tense]: Tante Harriet hat Ohren wie ein Luchs und einen Mund wie ein Ausrufer.
lionel[neutral]: Wollen Sie wissen, was er bezeugen lassen wollte? Ich sag’s Ihnen. Eine Änderung seines Testaments. Zugunsten meiner Schwester. Mich hätte er auf das Haus gesetzt und auf das, was das Gesetz ihm nicht zu nehmen erlaubt.
lionel[angry]: Und jetzt ist er tot, und kein Papier liegt da. Wie praktisch, nicht wahr? Verstehen Sie, was man jetzt von mir denkt?
* [mitfuehlend] Ich denke gar nichts. Ich frage nur. {lionel+1} -> a
* [direkt] Haben Sie das Papier gesehen? -> b
# a
lionel[neutral]: Dann sind Sie die Einzige.
-> END
# b
lionel[tense]: Nein. {pause:500}
lionel[neutral]: Nein. Ich habe kein Papier gesehen. Gute Nacht, Miss Hale.
inner: Er hat nicht gesagt, dass er keins gesehen hat. Er hat gesagt, dass er keins mit Unterschrift gesehen hat. Oder gar nichts. Ich weiß es nicht. Er trinkt aus, und das Gespräch ist vorbei.

=== t2_penrose_refused
kind: topic
npc: penrose
title: Warum nicht heute Nacht?
when: ch>=2 f:k2_evening_done
---
sera: Warum haben Sie Miss Averley die Sitzung verweigert? Das wäre doch – Ihr Beruf.
penrose[neutral]: Mein Beruf ist, Menschen zu geben, was sie brauchen, meine Liebe. Nicht, was sie verlangen.
sera: Und was braucht sie?
penrose[neutral]: Dass jemand ihr die Hand auf den Rücken legt. Das kann ich nicht. Ich bin bezahlt.
narr: Sie dreht einen Ring an ihrem Finger, einmal ganz herum.
penrose[neutral]: Und weil man einen Mann, dem man einmal gegenübergesessen hat, nicht zurückruft, um ihn vorzuführen. {hints:f02}
inner: Einmal gegenübergesessen. Bei der Séance stand er in der Tür, sagt sie selbst. Gegenüber gesessen hat er ihr woanders.

=== t2_penrose_how
kind: topic
npc: penrose
title: Wie es gemacht wird
when: ch>=2 t:penrose>=5
---
sera: Wie machen Sie das? Die Stimmen. Die Botschaften.
penrose[warm]: Oh, Sie fragen es wirklich. Die meisten fragen, ob es echt ist. Sie fragen, wie.
penrose[neutral]: Man hört zu. Das ist alles. Die Leute erzählen einem ihr ganzes Leben, wenn man lange genug schweigt. Sie erzählen es mit ihren Händen, mit ihrem Trauerschmuck, mit dem, was sie nicht sagen.
penrose[neutral]: Miss Averley trägt Haar in ihrer Brosche, das nicht ihr Haar ist und nicht Lucindas. Braun. Kurz. Ein Mann. Vor über zwanzig Jahren, das Jet ist abgegriffen. Sie hat nie geheiratet. Man muss kein Geist sein, um „Henry“ zu raten, wenn man in Bath die Gefallenenlisten kennt.
narr: Sie lächelt nicht dabei. Es ist, als würde sie ihre eigenen Werkzeuge auf einen Tisch legen.
penrose[neutral]: Sie tun übrigens dasselbe, Miss Hale. Sie hören zu. Nur nehmen Sie kein Geld dafür. Das ist gefährlich. Umsonst glaubt einem keiner. {penrose+1}

=== t2_penrose_bell
kind: topic
npc: penrose
title: Das Glöckchen
when: ch>=2 ch<=3 yuumi f:k1_library_done
---
narr: Yuumi springt auf einen Sessel neben Mrs. Penrose. Das Glöckchen klingt, hell und fein. {sfx:bell}
narr: Mrs. Penrose erstarrt. Nicht ein Muskel in ihrem Gesicht bewegt sich. Nur ihre Hand, die den Ring drehen wollte, bleibt auf halbem Weg stehen.
penrose[neutral]: Eine Katze mit Glöckchen. Wie unpraktisch für die Katze.
penrose[neutral]: Und wie praktisch für jeden, der wissen will, wo sie gewesen ist. {hints:f16}
narr: Sie sieht Sera an, nicht die Katze. Lange.
inner: Sie hat diesen Klang schon einmal gehört. Nachts. Auf der Treppe. Und sie weiß, dass ich weiß, dass sie es weiß.

=== t2_clara_royalfree
kind: topic
npc: clara
title: London
when: ch>=2 seen:k2_dark
---
sera: Ihre Tante sagt, Sie wollen nach London. Medizin studieren.
clara[neutral]: Tante Harriet nennt es Grillen. Das Royal Free Hospital nennt es seit diesem Sommer Studentinnen. Sie dürfen auf die Stationen, an echte Betten. Zum ersten Mal.
clara[neutral]: Die Schule an der Henrietta Street nimmt im Oktober neue auf. Er hatte es mir versprochen. Die Gebühren, die Wohnung, alles. Meiner Mutter zuliebe, und mir.
clara[tense]: Und dann –
narr: Sie bricht ab, als hätte sie mit dem Finger an eine heiße Schale gefasst.
clara[neutral]: Und dann ist er gestorben. Das ist alles. Lionel erbt. Lionel wird es nicht bezahlen, Lionel kann nicht einmal seine Pferde bezahlen.
inner: „Und dann“ kam vor dem Sterben. Da ist noch etwas dazwischen.

=== t2_clara_hobbes
kind: topic
npc: clara
title: Hobbes und der Sessel
when: ch>=2 k:d04
---
sera: Mr. Hobbes sagt immer noch, er habe ihn im Sessel gefunden.
clara[neutral]: Natürlich sagt er das. Hobbes würde eher sterben, als zuzugeben, dass er einen Gentleman auf dem Teppich gefunden hat.
clara[tense]: Er schützt jemanden. Hobbes schützt immer jemanden. Meistens Lionel. Das tut er, seit Lionel acht war und die Fensterscheibe im Gewächshaus –
narr: Sie verstummt.
clara[neutral]: Ich will nicht, dass Sie ihn vor allen bloßstellen. Er ist alt. Er hat meinem Vater fünfzig Jahre gedient.
* [mitfuehlend] Das habe ich nicht vor. {clara+1} -> a
* [direkt] Aber Sie wollen die Wahrheit wissen. -> b
# a
clara[neutral]: Gut.
-> END
# b
clara[neutral]: Ja. Ich will sie wissen. Ich will sie nur nicht in Hobbes’ Gesicht lesen müssen.

=== pr_hobbes_d04
kind: present
npc: hobbes
items: d03,d04,c06
---
narr: Hobbes hört zu. Kein Muskel regt sich in seinem Gesicht, aber er hat die Hände hinter dem Rücken verschränkt, und sie sind nicht mehr ruhig.
hobbes[neutral]: Der Herr ist in seinem Sessel entschlafen, Miss. Mehr ist dazu nicht zu sagen.
* [mitfuehlend] Sie wollten ihn nicht so liegen lassen. Das verstehe ich. {hobbes+1} -> a
* [direkt] Sie wissen, dass das nicht stimmt. {hobbes-1} -> b
# a
narr: Etwas in seinem Gesicht gibt nach, für die Dauer eines Lidschlags.
hobbes[neutral]: Es ist nicht an Miss, zu verstehen, was ich wollte.
hobbes[neutral]: … Aber ich danke Miss für die Absicht.
-> END
# b
hobbes[neutral]: Ich weiß, was ich weiß, Miss. Ich habe neunundvierzig Jahre gelernt, was man sagt und was man nicht sagt.
hobbes[neutral]: Guten Abend.

=== pr_clara_c03
kind: present
npc: clara
items: c03,d05
---
clara[neutral]: 2.39.
narr: Sie nimmt die Uhr nicht. Sie sieht sie an, wie man eine Probe unter dem Mikroskop ansieht.
clara[neutral]: Um zwei Uhr neununddreißig ist er gefallen. Um halb zwei – {pause:500, hints:f05}
clara[neutral]: Um halb zwei war das Haus still. Nehme ich an.

=== pr_lionel_d06
kind: present
npc: lionel
items: d06,c12,s13
when: !f:g_fix_shown
---
lionel[surprised]: Fixierbad? Das Zeug aus seiner Dunkelkammer?
narr: Er lacht, kurz und ohne Freude.
lionel[neutral]: Er hat mit seinem Gift fotografiert, und ich wollte eine Mörderin. Das ist sehr bezeichnend für uns beide. {+f:g_fix_shown, reveals:f19}
lionel[tense]: Dann war es sein Herz. Einfach sein Herz.

=== s2_tilly
kind: smalltalk
npc: tilly
when: ch=2
---
tilly[neutral]: Mrs. Pryce sagt, wenn ein Toter im Haus is, darf man nich pfeifen. Sonst pfeift er zurück.
tilly[tense]: Ich hab heut früh gepfiffen. Aus Versehen. Vor … vor allem.
inner: Vor allem was, Tilly?

=== s2_pryce
kind: smalltalk
npc: pryce
when: ch=2
---
pryce[neutral]: Tee, Miss? Man trinkt Tee in einem Trauerhaus. Tee ist das Einzige, was nicht unanständig ist.
* [ehrlich] Hätten Sie vielleicht Kaffee? {sus+1} -> a
* [neutral] Sehr gern. {pryce+1} -> b
# a
pryce[surprised]: Kaffee. Am Nachmittag. {pause:300}
pryce[neutral]: Sie sind ja eine ganz Feine. Kaffee gibt’s morgens, für den Captain, und der ist aus. Tee.
-> END
# b
narr: Die Tasse ist heiß, der Tee stark genug, um darauf zu stehen.

=== s2_hobbes
kind: smalltalk
npc: hobbes
when: ch=2
---
hobbes[neutral]: Miss Averley wünscht, dass die Trauerbänder bis morgen an allen Türen hängen. Der Krepp für die Haustür ist nass geworden.
hobbes[neutral]: Man tut, was man kann. Das Wasser hat keinen Sinn für Anstand.

=== s2_harriet
kind: smalltalk
npc: harriet
when: ch=2
---
harriet[neutral]: Sie stehen, Miss Hale. Setzen Sie sich. Man steht nicht in einem Zimmer, in dem man zu bleiben gedenkt.
harriet[neutral]: Und falten Sie die Hände nicht so. Sie sehen aus, als warteten Sie auf einen Omnibus.

=== s2_lionel
kind: smalltalk
npc: lionel
when: ch=2
---
lionel[neutral]: Wussten Sie, dass man in Indien die Toten verbrennt, Miss Hale? Am Fluss. Mit Blumen. Und alle singen.
lionel[tense]: Hier legen wir Pennys auf ihre Augen und flüstern. Ich weiß nicht, was mir lieber wäre.

=== s2_penrose
kind: smalltalk
npc: penrose
when: ch=2
---
penrose[neutral]: Sie waren beim Aufbahren. Man sieht es an Ihren Händen. Man hält sie danach anders.

=== s2_clara
kind: smalltalk
npc: clara
when: ch=2 seen:k2_dark
---
clara[neutral]: Ich ordne seine Notizen. Wetter. Luftdruck. Regen in Zoll.
clara[neutral]: Er hat jeden Tag seit 1851 den Regen gemessen. Jeden Tag. Heute hat es niemand getan.
narr: Sie nimmt einen Bleistift und schreibt eine Zahl in die nächste Zeile. Ihre Schrift sieht aus wie seine.
`;
