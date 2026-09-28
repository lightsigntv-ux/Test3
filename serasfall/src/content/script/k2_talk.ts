export default `
=== t2_pryce_candles
kind: topic
npc: pryce
title: Kerzen
when: ch>=2 ch<=3 !f:k2_tallow_learned
---
sera: Mrs. Pryce, die Kerzen hier unten riechen anders als oben.
pryce[neutral]: Weil’s Talg ist. Hammelfett. Oben brennt man Wachs, unten Talg. Wachs kostet dreimal so viel.
pryce[neutral]: Talg für unten, Wachs für oben. Und wer von unten Wachs nimmt, der fliegt raus. So war’s in jedem Haus, wo ich gedient hab.
tilly[neutral]: Talg tropft auch mehr. Und stinkt.
pryce[neutral]: Talg stinkt ehrlich, Tilly. {+f:k2_tallow_learned}
inner: Oben Wachs, unten Talg. Hier hat sogar das Licht einen Rang. Das wär ein gutes Tafelbild.

=== t2_pryce_song
kind: topic
npc: pryce
title: Das Lied beim Waschen
when: ch>=2 seen:k2_laying
---
sera: Das Lied, das Sie vorhin beim Waschen gesungen haben – was war das?
pryce[neutral]: Nichts. Ein Lied aus Monmouthshire. Meine Mutter hat’s gesungen, wenn sie im Dorf die Toten gewaschen hat. Walisisch. Das verstehen Sie nicht.
pryce[neutral]: Es geht um einen Fluss. Man soll keine Angst haben, wenn man rübermuss. Das Wasser ist kalt, aber es trägt einen.
narr: Sie wischte über den Tisch, obwohl nichts darauf lag.
pryce[neutral]: Zuletzt hab ich’s gesungen, wie Owen aufs Schiff ist. Nach Kanada. Da ist keiner gestorben. Aber so hat’s sich angefühlt.
* [mitfuehlend] Schreibt er Ihnen? {pryce+1} -> a
* [schweigen] (Nicken.) {pryce+1} -> b
# a
pryce[neutral]: Jeden Mittwoch schreib ich ihm. Die Post kommt schon wieder. Irgendwann.
inner: Moment. Ich hab gefragt, ob er ihr schreibt. Nicht umgekehrt.
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
tilly[neutral]: Nach’m Frühstück. Immer. Erst Frühstück, dann Silber, dann Gläser. Wie ’n Gebet.
tilly[neutral]: Mr. Hobbes spült nie vor dem Frühstück. Nie nich.
? ch=2 -> today
tilly[neutral]: Aber Mittwoch früh, wie ich die Kohlen raufgebracht hab, noch vor sieben, da stand er in der Kammer am Becken und hat Gläser gespült. {+s:s15}
-> kater
# today
tilly[neutral]: Aber heut früh, wie ich die Kohlen raufgebracht hab, noch vor sieben, da stand er in der Kammer am Becken und hat Gläser gespült. {+s:s15}
# kater
tilly[neutral]: Ich dacht erst, er hat ’n Kater. Hat er aber nie.
tilly[surprised]: Warum fragen Sie?
* [ausweichend] Nur so. Ich lerne noch, wie hier alles läuft. -> a
* [ehrlich] Weil heute jemand vor dem Frühstück gespült hat. {tilly+1} -> b
# a
tilly[neutral]: Das lernt man nie. Ich bin seit ’nem Jahr hier und mach immer noch alles falsch.
-> END
# b
tilly[tense]: Oh.
tilly[neutral]: Das war er. Ich hab’s doch gesehn. {pause:400}
narr: Sie sah zur Tür der Butlerkammer und dann auf ihre Hände.

=== t2_tilly_letters
kind: topic
npc: tilly
title: Buchstaben
when: ch>=2 f:g_teach !f:g_teach2
---
narr: Tilly hatte ein Stück Kreide aus der Speisekammer stibitzt. Auf dem Boden hinter dem Herd, wo Mrs. Pryce nicht hinsah, standen schon ein T und ein I.
tilly[neutral]: Und das L, Miss? Diesmal richtig rum.
narr: Sera malte ein L. Tilly malte es zweimal nach und steckte dabei die Zunge zwischen die Zähne.
tilly[warm]: Noch ’n L. Und dann?
sera: Dann kommt ein Y. Das sieht aus wie ein Becher mit Stiel. Oder wie eine Katze, die sich streckt.
yuumi: (Yuumi setzte sich mitten auf die Kreide und streckte sich ausgiebig.)
tilly[warm]: Y wie Yuumi!
narr: Tilly schrieb ihren Namen. T I L L Y. Die Buchstaben waren ein bisschen schief, aber sie standen da. Tilly sah sie lange an. {tilly+2, +f:g_teach2}
tilly[neutral]: Das bin ich.
inner: Ja. Das bist du.

=== t2_hobbes_newton
kind: topic
npc: hobbes
title: Die Katze
when: ch>=2 yuumi t:hobbes>=3
---
narr: Yuumi saß vor Hobbes’ Füßen und sah beharrlich zu ihm hinauf.
hobbes[neutral]: Das Tier bleibt aus den Herrschaftsräumen, Miss.
sera: Mögen Sie keine Katzen, Mr. Hobbes?
hobbes[neutral]: Es ist nicht an mir, Katzen zu mögen.
narr: Er bückte sich nicht. Aber mit der Schuhspitze schob er einen losen Faden am Teppich weg, damit Yuumi nicht hineinbiss.
hobbes[neutral]: Der Herr hatte einen Kater. Newton. Schwarz, mit einem weißen Fleck unter dem Kinn. Er schlief auf den Wetterberichten.
hobbes[neutral]: Im September ist er gestorben. Der Herr bat mich, ihn unter dem Maulbeerbaum zu begraben. Er hielt die Laterne. Es regnete.
narr: Eine Pause. Man hörte den Regen an der Tür. {pause:600}
hobbes[neutral]: Er sagte: „Das nächste Mal, Hobbes, halten Sie die Laterne.“ Ich habe es für einen Scherz gehalten. {hobbes+1}
inner: Ein schwarzer Kater, der auf Wetterberichten schläft. Den hätte ich so gern gekannt. Ob er auch … egal. Hobbes hat mir gerade was erzählt, das er sonst keinem erzählt. Und jetzt würde er es am liebsten zurücknehmen.

=== t2_harriet_mourning
kind: topic
npc: harriet
title: Trauerkleidung
when: ch=2 !f:k2_black
---
harriet[neutral]: Miss Hale. Sie tragen Grün.
inner: Ja, Grün. Was soll ich denn sonst … Oh. Klar. Trauerhaus. Schwarz, Krepp, Jet-Schmuck. Das weiß ich doch eigentlich.
harriet[neutral]: Eine Gesellschafterin trauert mit dem Haus, in dem sie lebt. Mrs. Pryce wird Ihr Kleid heute Nacht färben. Morgen tragen Sie Schwarz.
* [neutral] Natürlich. Daran habe ich nicht gedacht. {sus+1} -> a
* [ehrlich] Ich habe nichts anderes. Tut mir leid. {harriet+1} -> b
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
sera: Miss Clara wirkt sehr – gefasst.
harriet[neutral]: Clara ist nicht gefasst. Clara ist wie ihr Vater. Sie steckt alles in ein Glas mit Spiritus und beschriftet es.
harriet[neutral]: Er hat ihr beigebracht, dass man alles untersuchen kann. Dass man hinterher trotzdem allein ist, hat er ihr nicht beigebracht.
harriet[neutral]: Sie will nach London. An eine Schule, an der Frauen – Leichen öffnen. Er hat es ihr versprochen, weil Lucinda es sich auf dem Sterbebett gewünscht hat. „Lass sie wählen.“ {hints:f04}
harriet[tense]: Man lässt ein Kind nicht wählen. Man bewahrt es.
* [direkt] Wovor? -> a
* [mitfuehlend] Sie haben Angst um sie. {harriet+1} -> b
# a
harriet[neutral]: Vor allem, was eine unverheiratete Frau allein in London erwartet. Ich weiß, wovon ich spreche, Miss Hale. Ich bin selbst eine.
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
sera: Captain, der Bittermandelgeruch im Arbeitszimmer kommt aus der Dunkelkammer. Das ist Fixierbad, für die Fotografie. Die Flasche stand offen.
lionel[surprised]: Fixierbad.
lionel[neutral]: Kaliumcyanid, nehme ich an. Dasselbe Zeug, nur in einer braunen Flasche mit Etikett.
narr: Er setzte sich. Zum ersten Mal spielte er niemandem etwas vor.
lionel[neutral]: Er hat mit seinem Gift fotografiert, und ich wollte unbedingt eine Mörderin. Das sagt eine Menge über uns beide. {+f:g_fix_shown, reveals:f19}
lionel[tense]: Dann war es sein Herz. Dann war es einfach nur sein Herz.
inner: Er sagt das, als wär das noch schlimmer. Wieso denn schlimmer?
lionel[neutral]: Danke, Miss Hale. Ich werde mich bei Mrs. Penrose entschuldigen. Irgendwann. Wenn ich nüchtern bin. Also vermutlich nie.

=== t2_lionel_signature
kind: topic
npc: lionel
title: Die Unterschrift
when: ch>=2 ch<=3 k:s11
---
sera: Ihr Vater wollte heute früh etwas bezeugen lassen.
lionel[tense]: Tante Harriet hat Ohren wie ein Luchs. Und für sich behalten kann sie auch nichts.
lionel[neutral]: Wollen Sie wissen, was er bezeugen lassen wollte? Ich sag’s Ihnen. Eine Änderung seines Testaments. Zugunsten meiner Schwester. Mir hätte er das Haus gelassen und das, was er mir nach dem Gesetz nicht nehmen darf.
lionel[angry]: Und jetzt ist er tot, und es liegt kein Papier da. Wie praktisch, nicht wahr? Verstehen Sie, was die Leute jetzt von mir denken?
* [mitfuehlend] Ich denke gar nichts. Ich frage nur. {lionel+1} -> a
* [direkt] Haben Sie das Papier gesehen? -> b
# a
lionel[neutral]: Dann sind Sie die Einzige.
-> END
# b
lionel[tense]: Nein. {pause:500}
lionel[neutral]: Nein. Ich habe kein Papier gesehen. Gute Nacht, Miss Hale.
inner: Zweimal Nein, und beide Male sehr schnell. Hat er gar nichts gesehen oder nur kein Papier mit Unterschrift? Ich weiß es nicht. Er trinkt aus, und das Gespräch ist vorbei.

=== t2_penrose_refused
kind: topic
npc: penrose
title: Warum nicht heute Nacht?
when: ch>=2 f:k2_evening_done
---
sera: Warum haben Sie Miss Averley die Sitzung verweigert? Das ist doch – Ihr Beruf.
penrose[neutral]: Mein Beruf ist es, den Leuten zu geben, was sie brauchen, meine Liebe. Nicht, was sie verlangen.
sera: Und was braucht sie?
penrose[neutral]: Dass ihr jemand die Hand auf den Rücken legt. Das kann ich nicht. Ich werde bezahlt.
narr: Sie drehte einen Ring an ihrem Finger, einmal ganz herum.
penrose[neutral]: Und weil man einen Mann, dem man einmal gegenübergesessen hat, nicht zurückholt, um ihn vorzuführen. {hints:f02}
inner: Gegenübergesessen? Bei der Séance stand er in der Tür, das hat sie selbst gesagt. Gegenübergesessen hat er ihr also woanders.

=== t2_penrose_how
kind: topic
npc: penrose
title: Wie es gemacht wird
when: ch>=2 t:penrose>=5
---
sera: Wie machen Sie das eigentlich? Die Stimmen, die Botschaften.
penrose[warm]: Oh, Sie wollen es wirklich wissen. Die meisten fragen, ob es echt ist. Sie fragen, wie.
penrose[neutral]: Man hört zu. Das ist alles. Die Leute erzählen einem ihr ganzes Leben, wenn man nur lange genug schweigt. Mit ihren Händen, mit ihrem Trauerschmuck, mit dem, was sie nicht sagen.
penrose[neutral]: Miss Averley trägt Haar in ihrer Brosche, das weder ihres ist noch Lucindas. Braun. Kurz. Ein Mann. Das Jet ist abgegriffen, über zwanzig Jahre alt. Und als sie die Brosche am ersten Abend abnahm, um die Nadel zu richten, stand hinten drauf: „H. A. – Inkerman“. Man muss kein Geist sein, meine Liebe. Man muss nur hinsehen, wo andere wegsehen.
narr: Sie lächelte nicht dabei. Sie erklärte es ganz nüchtern, Stück für Stück.
penrose[neutral]: Sie machen übrigens dasselbe, Miss Hale. Sie hören zu. Nur nehmen Sie kein Geld dafür. Das ist gefährlich. Wer umsonst etwas sagt, dem glaubt keiner. {penrose+1}

=== t2_penrose_bell
kind: topic
npc: penrose
title: Das Glöckchen
when: ch>=2 ch<=3 yuumi f:k1_library_done
---
narr: Yuumi sprang auf einen Sessel neben Mrs. Penrose. Das Glöckchen klang hell und fein. {sfx:bell}
narr: Mrs. Penrose erstarrte. Ihr Gesicht bewegte sich nicht. Nur ihre Hand, die gerade den Ring drehen wollte, blieb auf halbem Weg stehen.
penrose[neutral]: Eine Katze mit Glöckchen. Wie unpraktisch für die Katze.
penrose[neutral]: Und wie praktisch für jeden, der wissen will, wo sie gewesen ist. {hints:f16}
narr: Dabei sah sie Sera an, nicht die Katze. Lange.
inner: Sie kennt dieses Klingeln. Von heute Nacht, auf der Treppe. Und jetzt weiß sie, woher es kam.

=== t2_clara_royalfree
kind: topic
npc: clara
title: London
when: ch>=2 seen:k2_dark
---
sera: Sie wollen nach London, hab ich gehört. Medizin studieren.
clara[neutral]: Tante Harriet nennt es Grillen. Das Royal Free Hospital nennt es seit diesem Frühjahr Studentinnen. Sie dürfen auf die Stationen, an echte Betten. Zum ersten Mal.
clara[neutral]: Die Schule in der Henrietta Street nimmt im Oktober neue auf. Er hatte es mir versprochen. Die Gebühren, die Wohnung, alles. Meiner Mutter zuliebe. Und mir.
clara[tense]: Und dann –
narr: Sie brach ab und presste die Lippen zusammen.
clara[neutral]: Und dann ist er gestorben. Das ist alles. Lionel erbt. Lionel wird das nicht bezahlen. Lionel kann nicht mal seine Pferde bezahlen.
inner: „Und dann“ – das kam vor dem Sterben. Dazwischen war noch was.

=== t2_clara_hobbes
kind: topic
npc: clara
title: Hobbes und der Sessel
when: ch>=2 k:d04
---
sera: Mr. Hobbes sagt immer noch, er hätte ihn im Sessel gefunden.
clara[neutral]: Natürlich sagt er das. Hobbes würde eher sterben, als zuzugeben, dass er einen Gentleman auf dem Teppich gefunden hat.
clara[tense]: Er schützt jemanden. Hobbes schützt immer jemanden. Meistens Lionel. Schon seit Lionel acht war und die Scheibe im Gewächshaus –
narr: Sie verstummte.
clara[neutral]: Ich will nicht, dass Sie ihn vor allen bloßstellen. Er ist alt. Er hat meinem Vater fünfzig Jahre gedient.
* [mitfuehlend] Das hab ich auch nicht vor. {clara+1} -> a
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
narr: Hobbes hörte zu. Sein Gesicht blieb unbewegt, aber seine Hände hinter dem Rücken waren nicht mehr ruhig.
hobbes[neutral]: Der Herr ist in seinem Sessel entschlafen, Miss. Mehr ist dazu nicht zu sagen.
* [mitfuehlend] Sie wollten ihn nicht so liegen lassen. Das versteh ich. {hobbes+1} -> a
* [direkt] Sie wissen, dass das nicht stimmt. {hobbes-1} -> b
# a
narr: Einen Moment lang wurde sein Gesicht weicher. Dann war es wieder vorbei.
hobbes[neutral]: Es ist nicht an Miss, zu verstehen, was ich wollte.
hobbes[neutral]: … Aber ich danke Miss für die gute Absicht.
-> END
# b
hobbes[neutral]: Ich weiß, was ich weiß, Miss. Ich hatte neunundvierzig Jahre Zeit zu lernen, was man sagt und was nicht.
hobbes[neutral]: Guten Abend.

=== pr_clara_c03
kind: present
npc: clara
items: c03,d05
---
clara[neutral]: 2.39.
? f:g_watch_given -> given
narr: Sie nahm die Uhr nicht. Sie sah sie nur sehr genau an.
-> fell
# given
clara[neutral]: Hobbes hat sie. Er hat sie mir gezeigt. Ganz vorsichtig, mit beiden Händen.
# fell
clara[neutral]: Um zwei Uhr neununddreißig ist er gefallen. Um halb zwei – {pause:500, hints:f05}
clara[neutral]: Um halb zwei war das Haus still. Nehme ich an.

=== pr_lionel_d06
kind: present
npc: lionel
items: d06,c12,s13
when: !f:g_fix_shown
---
lionel[surprised]: Fixierbad? Das Zeug aus seiner Dunkelkammer?
narr: Er lachte kurz. Es klang nicht fröhlich.
lionel[neutral]: Er hat mit seinem Gift fotografiert, und ich wollte unbedingt eine Mörderin. Das sagt eine Menge über uns beide. {+f:g_fix_shown, reveals:f19}
lionel[tense]: Dann war es sein Herz. Einfach nur sein Herz.

=== s2_tilly
kind: smalltalk
npc: tilly
when: ch=2
---
tilly[neutral]: Mrs. Pryce sagt, wenn ’n Toter im Haus is, darf man nich pfeifen. Sonst pfeift er zurück.
tilly[tense]: Ich hab heut früh gepfiffen. Aus Versehen. Vor … vor allem.
inner: Vor allem was, Tilly?

=== s2_pryce
kind: smalltalk
npc: pryce
when: ch=2
---
pryce[neutral]: Tee, Miss? Der Kessel ist heiß, und was anderes gibt’s heut nicht.
* [ehrlich] Hätten Sie vielleicht einen Kaffee? {sus+1} -> a
* [neutral] Sehr gern. {pryce+1} -> b
# a
pryce[surprised]: Kaffee. Am Nachmittag. {pause:300}
pryce[neutral]: Sie sind mir ja eine ganz Feine. Kaffee gibt’s morgens für den Captain, und der ist aufgebraucht. Tee, na?
-> END
# b
narr: Die Tasse war heiß, und der Tee war so stark, dass der Löffel fast darin stehen blieb.

=== s2_hobbes
kind: smalltalk
npc: hobbes
when: ch=2
---
hobbes[neutral]: Miss Averley wünscht, dass bis morgen an allen Türen Trauerbänder hängen. Der Krepp für die Haustür ist nass geworden.
hobbes[neutral]: Es wird getan, was möglich ist, Miss. Aber bei diesem Wetter trocknet nichts.

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
lionel[tense]: Und wir legen ihnen Pennys auf die Augen und flüstern. Ich weiß nicht, was mir lieber wäre.

=== s2_penrose
kind: smalltalk
npc: penrose
when: ch=2
---
penrose[neutral]: Sie waren beim Aufbahren. Das sieht man an Ihren Händen. Man hält sie danach anders.

=== s2_clara
kind: smalltalk
npc: clara
when: ch=2 seen:k2_dark
---
clara[neutral]: Ich ordne seine Notizen. Wetter. Luftdruck. Regen in Zoll.
clara[neutral]: Er hat seit 1851 jeden Tag den Regen gemessen. Jeden Tag. Heute hat es keiner getan.
narr: Sie nahm einen Bleistift und schrieb eine Zahl in die nächste Zeile. Ihre Schrift sah aus wie seine.
`;
