export default `
=== k3_wake
kind: scene
when: ch=3 loc=kammer
priority: 20
---
narr: Vor dem Fenster war alles grau, der Himmel und das Wasser. Über dem Moor lag so dichter Nebel, dass Sera die Kopfweiden zuerst für Menschen hielt. {music:k3}
narr: Über der Stuhllehne hing ihr Kleid, über Nacht schwarz gefärbt. Es roch noch nach Farbe und ein bisschen nach Essig. Mrs. Pryce hatte nichts gefragt.
inner: Donnerstag. Heute wäre die Stunde gewesen, für die ich den Entwurf schreiben sollte. Stattdessen bin ich hier, zweiter Tag.
inner: Wer hat in der Nacht mit ihm getrunken? Und was wollte er am Morgen unterschreiben lassen?
yuumi: (Yuumi saß auf dem Fensterbrett und starrte in den Nebel. Vielleicht war da draußen ein Vogel. Sera sah keinen.)
inner: Und wie ich wieder nach Hause komme. Zu Fritz. Das auch. Eigentlich vor allem das. {+f:k3_started}

=== k3_greenhouse
kind: scene
when: ch=3 loc=gewaechs tod=morgen
priority: 20
---
narr: Im Gewächshaus war es warm und feucht, und alles war grün. Auf das Glasdach trommelte der Regen. {music:quiet}
narr: Zitronenbäumchen in Kübeln, Farne und ein Orangenbaum ohne eine einzige Orange. Zu wenig Licht im November, dachte Sera. An jedem Kübel steckte ein Schild in derselben engen Handschrift wie im Notizbuch.
yuumi: (Yuumi entdeckte einen Nachtfalter, der sich hinter das Glas verirrt hatte. Danach interessierte sie nichts anderes mehr.)
narr: Sera setzte sich auf die eiserne Bank. Der Falter flatterte gegen die Scheibe, Yuumi sprang, verfehlte ihn und landete in einem Farn. Danach putzte sie sich ausgiebig die Pfote und sah nicht zu Sera hin.
* [humor] Sehr elegant, Yuumi. Ganz große Kunst. -> a
* [schweigen] (Leise lachen.) -> b
# a
yuumi: (Yuumi sah über die Schulter zu ihr hin. Sehr hochmütig für eine Katze, die gerade in einen Farn gefallen war.)
-> c
# b
narr: Sera musste lachen, zum ersten Mal, seit sie hier war. Gegen eine Katze, die sich blamiert, kam sie einfach nicht an.
# c
narr: Der Falter fand einen Spalt im Glas und flog hinaus in den Nebel.

=== k3_dunning
kind: scene
when: ch=3 loc=stall
priority: 20
---
narr: Hinter der Stallmauer fing das Wasser an, und die Weiden standen bis zu den Kronen darin. Ein Mann in einem Ölzeugumhang kniete vor einem flachen Boot und strich Pech in die Fugen. In seinem Mundwinkel steckte eine kalte Pfeife. {music:yard}
dunning[neutral]: Morgen, Miss.
dunning[neutral]: Die Miss, die aus dem Wasser kam. So nennt Sie die Küche.
* [humor] Klingt, als hätte man mich rausgefischt. {dunning+1} -> a
* [neutral] Guten Morgen. Sie sind Mr. Dunning, oder? -> b
# a
dunning[neutral]: Hätt ich gern gesehn.
-> c
# b
dunning[neutral]: Dunning. Ohne Mister. Mister is Mr. Hobbes.
# c
narr: Er strich weiter Pech in die Fugen. Er machte keine Bewegung zu viel.
dunning[neutral]: Samstag fällt’s. Wenn’s nich mehr regnet. Dann fahr ich den Doktor und den Coroner her. Und dann fahr ich heim zu Martha.
yuumi: (Yuumi schlich um das Boot, schnupperte am Pech und schüttelte angewidert eine Pfote.)
dunning[neutral]: Taugt die was? Mäuse?
* [humor] Sie ist eher fürs Moralische zuständig. -> d
* [ehrlich] Ehrlich? Die hat noch nie eine Maus gesehen. -> d
# d
dunning[neutral]: Hm. Dann is sie ja wie die Herrschaft. {dunning+1}
inner: War das ein Witz? Ich glaube schon. Sein Gesicht hat sich nicht bewegt. Und warum hat er eigentlich eine Pfeife im Mund, die gar nicht – egal.

=== t3_dunning_boat
kind: topic
npc: dunning
title: Das Boot
when: ch>=3
---
sera: Kommt man mit so einem Boot übers Moor?
dunning[neutral]: Bei Tag. Wenn man die Gräben kennt. Die Rhynes. Wer die nich kennt, fährt sich fest und sitzt da, bis wer kommt.
? f:k1_said_boat -> lie
dunning[neutral]: In der Nacht kam kein Boot übers Moor, Miss. Da wär keiner gefahren, nich für Geld. {+s:s14, reveals:f21}
narr: Er sah sie kurz an und strich dann weiter Pech.
-> END
# lie
dunning[neutral]: Miss Averley sagt, Sie sind mit ’m Boot gekommen. In der Nacht auf Mittwoch.
dunning[neutral]: In der Nacht kam aber kein Boot übers Moor, Miss. Da wär keiner gefahren, nich für Geld. {+s:s14, reveals:f21}
* [ehrlich] Nein. Mit einem Boot bin ich nicht gekommen. {dunning+2} -> t
* [ausweichend] Dann war es wohl kein Boot aus Middlemoor. {sus+1} -> e
# t
dunning[neutral]: Hab ich mir gedacht.
dunning[neutral]: Wie Sie hergekommen sind, geht mich nix an. Ich sag, was ich seh. Und gesehn hab ich nix. Sag ich auch keinem.
-> END
# e
dunning[neutral]: Muss wohl.
inner: Er glaubt mir kein Wort. Aber er sagt nichts.

=== t3_dunning_night
kind: topic
npc: dunning
title: Die Nacht auf Mittwoch
when: ch>=3 anyf:k3_tea_brought t:dunning>=4
---
sera: Waren Sie in der Nacht auf Mittwoch draußen?
dunning[neutral]: Bei Hochwasser is man draußen. Wegen der Pferde. Ich war ab zwei im Stall, beim Braunen, der war unruhig. Raus auf den Hof bin ich, wie die Stalluhr Viertel vor drei geschlagen hat. {+s:s37}
dunning[neutral]: Ich red nich über die Herrschaft, Miss. Ich red über Pferde.
* [mitfuehlend] Dann erzählen Sie mir von den Pferden. {dunning+1} -> a
* [direkt] Haben Sie jemanden gesehen? -> b
# a
dunning[neutral]: Der Braune war unruhig. Pferde mögen’s nich, wenn draußen einer im Regen steht und sich nich rührt. Die riechen das.
-> c
# b
dunning[neutral]: Ich sag, was ich seh.
# c
dunning[neutral]: Kurz nach Viertel vor drei stand der Captain auf der Terrasse. Ganz hinten an der Brüstung, mit dem Rücken zum Haus. Ohne Rock, im Regen. Aus dem Arbeitszimmer kam nur ’n Streifen Licht durch den Vorhang. Hat gereicht. {+s:s06, reveals:f12}
dunning[neutral]: Hat nich geraucht. Hat bloß aufs Wasser geguckt.
dunning[neutral]: Und vorher, um halb drei, wie ich aus der Stalltür geguckt hab, war Licht im Gästeflügel. Hinterm Fenster von der Dame aus Bath. Der Gästeflügel geht zum Hof raus. {+s:s36, hints:f06}
inner: Er sagt das ganz ruhig. Keine Betonung, kein Urteil. Irgendwie macht es das schlimmer.

=== t3_pryce_tea
kind: topic
npc: pryce
title: Kann ich helfen?
when: ch=3 seen:k3_dunning !f:k3_tea_given
---
sera: Kann ich Ihnen irgendwas helfen, Mrs. Pryce?
pryce[neutral]: Sie können Dunning seinen Tee bringen. Der sitzt seit sechs im Regen und kommt nicht rein, weil er mir den Boden nicht dreckig machen will. Als hätt ich je was gesagt. Na?
narr: Sie drückte ihr eine Kanne und einen Becher in die Hände, dazu ein Stück Brot mit Schinken, in ein Tuch gewickelt. {+f:k3_tea_given}

=== k3_tea_bring
kind: examine
target: h_st_boot
when: f:k3_tea_given !f:k3_tea_brought
priority: 10
---
narr: Sera stellte die Kanne auf den Bock neben dem Boot und goss ein. Der Tee dampfte in der kalten Luft.
dunning[surprised]: Das is von Mrs. Pryce.
dunning[neutral]: Die hätt’s auch Tilly mitgeben können. Die rennt schneller.
dunning[neutral]: … Danke, Miss. {dunning+2, +f:k3_tea_brought}
narr: Er trank, beide Hände um den Becher, und sah aufs Wasser. Eine Weile sagten sie beide nichts. Das schien ihm recht zu sein.

=== t3_tilly_boots
kind: topic
npc: tilly
title: Die Stiefel des Captains
when: ch>=3 k:c19
---
sera: Tilly, wegen der Reitstiefel vom Captain in der Stiefelkammer –
tilly[neutral]: Die hab ich Mittwoch früh geputzt, gleich nach dem Herd. Die warn nass bis oben, Miss. Mit Erde vom Rosenbeet. Rote Erde. {+s:s35, hints:f12}
tilly[neutral]: Und ’n Rosenblatt klebte drin, am Absatz. Mitten im November. Das hab ich aufgehoben. Weiß auch nich, warum.
tilly[tense]: Der Captain geht nachts nich raus, wenn’s regnet. Der sagt immer, Regen is was für Pferde und Iren.
inner: Aber in der Nacht auf Mittwoch war er draußen. Im Rosenbeet unter der Terrasse.

=== t3_tilly_dreams
kind: topic
npc: tilly
title: Wie geht es dir?
when: ch=3
---
sera: Tilly, du siehst müde aus.
tilly[neutral]: Ich bin immer müde, Miss. Ich steh um fünf auf.
tilly[sad]: Ich träum vom Herrn. Er sagt was zu mir, und ich versteh’s nich. Und dann wach ich auf, und es is dunkel, und der Herd is aus. {hints:f26}
* [mitfuehlend] Was sagt er denn im Traum? {tilly+1} -> a
* [ehrlich] Ich schlafe auch schlecht, seit ich hier bin. {tilly+1} -> b
# a
tilly[tense]: Weiß nich mehr. Hab’s vergessen. Ehrlich.
narr: Sie hatte es nicht vergessen. Sie hielt den Kohleneimer so fest, dass ihre Knöchel weiß wurden.
-> END
# b
tilly[neutral]: Wegen zu Hause?
sera: Wegen zu Hause.
tilly[neutral]: Wo is das?
inner: Weit weg. Viel weiter, als du denkst. Fritz macht sich bestimmt schon Sorgen.
sera: Weit weg.
tilly[warm]: Hier is es auch weit weg. Von allem. Manchmal is das gut.

=== t3_pryce_chloral
kind: topic
npc: pryce
title: Miss Averleys Tropfen
when: ch>=2 k:s16
---
sera: Miss Averley sagt, Sie geben ihr jeden Abend Tropfen.
pryce[neutral]: Chloral. Zwanzig Tropfen in Wasser. Seit dem Winter, wo Mr. Ashby – seit ein paar Wintern eben. Der Doktor hat’s verschrieben.
pryce[neutral]: Ich mess es ab und schreib’s auf. Jeden Abend. Hier, sehen Sie.
narr: Sie zog ein kleines Buch aus der Schürzentasche und schlug es auf. Ordentliche Spalten: Datum, Uhrzeit, Tropfen. „Di., 13. – 11 Uhr – 20.“ {+c:c21, reveals:f18}
pryce[neutral]: Wenn sie das genommen hat, weckt sie keine Kanone. Das weiß hier jeder.
inner: Miss Averley kann in der Nacht also nichts gehört haben. Und das wusste jeder im Haus.

=== k3_chapel_ask
kind: scene
when: ch=3 loc=salon seen:k3_dunning
priority: 15
---
harriet[neutral]: Miss Hale. Dunning sagt, das Boot hält.
harriet[neutral]: Ich möchte zu Lucinda. Die Kapelle steht auf dem Hügel, dorthin reicht das Wasser nicht. Edmund kann nicht zu ihr, ehe der Coroner ihn freigibt. Also gehe ich.
harriet[neutral]: Sie begleiten mich.
* [mitfuehlend] Natürlich. {harriet+1} -> a
* [ehrlich] Ich bin noch nie mit so einem Boot gefahren. -> b
# a
harriet[neutral]: Ziehen Sie den Umhang an. Auf dem Wasser ist es kalt.
-> c
# b
harriet[neutral]: Ich auch nicht, seit dreiundzwanzig Jahren. Wir werden es beide überleben. Vermutlich.
# c
narr: Eine Viertelstunde später saßen sie in Dunnings flachem Boot. Miss Averley saß sehr gerade auf der Bank, einen Strauß weißer Chrysanthemen aus dem Gewächshaus im Schoß. Dunning stakte, und das Wasser war glatt und roch nach Erde. {time=nachmittag, +f:k3_chapel_go, go:kapelle@0.2, sfx:water}

=== k3_chapel
kind: scene
when: ch=3 loc=kapelle f:k3_chapel_go
priority: 20
important: yes
---
narr: Die Kapelle war klein und grau. Der Friedhof um sie herum lag wie eine Insel im Nebel, rundherum Wasser. Im Glockenstuhl hing keine Glocke, nur ein rostiger Haken. {music:chapel}
narr: Miss Averley kniete vor einem Stein aus hellem Kalk und legte die Chrysanthemen darauf. „Lucinda Averley, 1829–1861. Sie hörte die Glocke.“
harriet[neutral]: Das hat Edmund einmeißeln lassen. Der Pfarrer war dagegen. Unchristlich, sagte er. Aberglaube.
harriet[neutral]: Edmund sagte: Dann ist es eben mein Aberglaube. Und er hat den Steinmetz selbst bezahlt.
narr: Sie stand langsam auf, eine Hand auf dem Grabstein.
harriet[neutral]: Sie hat im Fieber davon gesprochen, am letzten Tag. „Wenn du die Glocke hörst, Edmund, hast du es gehalten.“ Ich stand vor der Tür. Was er ihr darauf versprochen hat, habe ich nicht gehört. Er hat nie davon gesprochen.
* [mitfuehlend] Sie haben ihn sehr geliebt. {harriet+1} -> a
* [direkt] Was glauben Sie, was er ihr versprochen hat? -> b
* [schweigen] (Neben ihr stehen bleiben.) {harriet+1} -> c
# a
harriet[neutral]: Man liebt seinen Bruder, Miss Hale. Das ist keine Leistung.
harriet[sad]: Er war das Einzige, was mir von meinem Vater geblieben ist. Und das Einzige, was ich nie verstanden habe.
-> c
# b
harriet[neutral]: Etwas über Clara, nehme ich an. Lucinda wollte, dass Clara wählen darf. Das hat sie jedem gesagt, der es hören wollte. Ob er es ihr versprochen hat, weiß nur er.
# c
narr: Nebel zog über die Gräber. Weit draußen auf dem Wasser schrie ein Reiher.
harriet[neutral]: Ich war verlobt, wissen Sie. Henry Ashby. Leutnant bei den Fünfundfünfzigern. Er fiel bei Inkerman, am fünften November 1854.
harriet[neutral]: Ich habe elf Jahre gebraucht, bis ich ihn zum ersten Mal wieder gehört habe. Bei einer Sitzung in Clifton. Er sagte, er habe keine Schmerzen gehabt.
harriet[tense]: Man hat mir hinterher erklärt, wie so etwas gemacht wird. Ich wollte es nicht hören.
? t:harriet>=6 k:s39 -> heard
? t:harriet>=8 anyk:c24,c14 -> confess
harriet[neutral]: Wir sollten zurück. Dunning friert und sagt es nicht.
narr: Sie ging voraus zum Boot und sah sich nicht um. {+f:k3_chapel_done}
-> END
# heard
sera: Miss Averley. Ich habe Sie heute früh gehört. Durch Ihre Tür. „Ich habe es niemandem gesagt, Edmund.“
harriet[tense]: Sie haben gelauscht.
sera: Meine Katze hat gelauscht. Ich stand nur daneben.
# confess
narr: Sie sah Sera an. Dann sanken ihre Schultern ein kleines Stück herunter, zum ersten Mal, seit Sera sie kannte.
harriet[sad]: Er wusste es, Miss Hale. Seit August. Ein Arzt in Bath. Sein Herz. Monate, nicht Jahre. {+s:s29, reveals:f01}
harriet[sad]: Er hat es mir gesagt, weil es jemand wissen musste, falls – und er hat mich schwören lassen, es den Kindern nicht zu sagen. Auf Mutters Bibel.
harriet[tense]: „Sie sollen mich nicht sterben sehen, bevor ich sterbe, Harriet.“ Das hat er gesagt.
narr: Sie öffnete ihr Retikül, zog einen gefalteten Brief heraus und hielt ihn Sera hin, mit ganz ausgestrecktem Arm. {+c:c23}
letter: Dr. H. Wilkes, Bath, 21. August 1877. – Sehr geehrter Herr, es handelt sich um eine Angina pectoris in fortgeschrittenem Stadium. Ich kann Ihnen keine Jahre versprechen und muss Ihnen dringend raten, Aufregung jeder Art zu vermeiden.
harriet[sad]: Aufregung jeder Art. Und ich habe ihm eine Séance ins Haus geholt.
* [mitfuehlend] Sie wollten ihm etwas Gutes tun. {harriet+2} -> d
* [ehrlich] Die Séance hat ihn nicht umgebracht. Es war sein Herz. {harriet+1} -> e
# d
harriet[neutral]: Ich wollte ihm Lucinda geben. Bevor er ging. Er hatte ihre Karte im Schreibtisch, die Karte dieser Frau, ich dachte –
harriet[neutral]: Ich dachte, er sucht sie.
-> f
# e
harriet[neutral]: Sagen Sie das Clara. Und sagen Sie es mir noch ein paarmal. Vielleicht glaube ich es dann.
# f
narr: Sie nahm den Brief zurück, faltete ihn zweimal und steckte ihn ein.
harriet[neutral]: Und das Blatt unter dem Séancetisch, falls Sie es gefunden haben – das war ich. Man hält den Stift und wartet. Und meistens schreibt man, was man fürchtet.
harriet[neutral]: Die Kinder dürfen es nicht erfahren. Noch nicht. Ich habe es geschworen.
harriet[neutral]: Wir sollten zurück. Dunning friert und sagt es nicht. {+f:k3_chapel_done, +f:g_harriet_told_sera}

=== k3_back
kind: scene
when: ch=3 loc=stall f:k3_chapel_done tod=nachmittag
priority: 15
---
narr: Als das Boot an der Stallmauer anlegte, war der Nebel dünner geworden. Über dem Wasser lag ein kupferfarbener Streifen. Die Sonne selbst sah man nicht. {time=abend, sfx:water}
narr: Miss Averley stieg aus, stützte sich auf Dunnings Hand, ohne ihn anzusehen, und ging ins Haus.
dunning[neutral]: Hat nich geweint. Die weint nie. Das is schlimmer.

=== k3_lionel_terrace
kind: topic
npc: lionel
title: Die Terrasse
when: ch>=3 k:d08
---
sera: Captain. Sie waren in der Nacht auf Mittwoch nicht im Bett. Sie standen kurz vor drei auf der Terrasse, im Regen.
narr: Er hob das Glas, merkte, dass es leer war, und stellte es sehr vorsichtig auf den Rand des Kübels.
lionel[tense]: Wer sagt das?
* [ehrlich] Jemand, der Sie gesehen hat. Und Ihre Stiefel. -> a
* [mitfuehlend] Ich frage aber Sie. Nicht die anderen. {lionel+1} -> a
# a
lionel[neutral]: Meine Stiefel. Natürlich. Tilly putzt sie. Tilly sieht alles und sagt nichts. Das Kind hat mehr Verstand als die ganze Familie.
lionel[neutral]: Ja. Ich war auf der Terrasse. Ich brauchte Luft. Man braucht manchmal Luft, Miss Hale. Auch nachts. Auch im Regen. {+s:s24, reveals:f12}
? t:lionel>=6 -> more
lionel[neutral]: Und jetzt lassen Sie mich in Ruhe.
-> END
# more
narr: Er sah auf seine Hände. Auf dem Handrücken hatte er eine alte weiße Narbe. Vom Polo, hatte er einmal gesagt, oder von einem Säbel, je nachdem, wer zuhörte.
lionel[neutral]: Ich war vorher bei ihm. Im Arbeitszimmer. Wir haben gestritten. Um Geld. Wie immer. {+s:s40, hints:f07}
lionel[tense]: Als ich ging, lebte er. Er lebte, Miss Hale. Er saß an seinem Schreibtisch und sah mich an wie einen Fleck auf einem Präparat.
* [mitfuehlend] Das muss wehgetan haben. {lionel+1} -> b
* [direkt] Und wann sind Sie zurückgekommen? {lionel-1} -> c
# b
lionel[neutral]: Wehgetan. Mir? Er ist tot.
narr: Aber er widersprach nicht.
-> END
# c
lionel[angry]: Wer sagt, dass ich zurückgekommen bin?
narr: Er stand auf und ging ohne ein Wort hinaus in den Regen.

=== pr_lionel_c10
kind: present
npc: lionel
items: c10,d10
when: ch>=3 k:d10
important: yes
---
narr: Sera hielt ihm das verkohlte Blatt hin. Er erkannte den Briefkopf, bevor er ein Wort lesen konnte, und wich ein Stück zurück.
lionel[angry]: Woher haben Sie das?
sera: Aus dem Aschekasten im Arbeitszimmer. Lesen Sie, was darunter steht.
lionel[tense]: Ich weiß, was da steht. Meine Schuldscheine. Crabbe und Tolley, Jermyn Street. Sehr diskret, sehr teuer –
sera: Da steht: „vollständig beglichen“.
narr: Er nahm das Blatt und las. Er las die Zeile zweimal, dann noch ein drittes Mal.
lionel[surprised]: Beglichen.
? k:c15 -> note
-> read
# note
sera: Im Notizbuch Ihres Vaters steht am 8. November: „C und T – 1840 angewiesen. Dem Jungen nichts sagen, bis er es selbst fragt.“
# read
lionel[surprised]: Er hat – {pause:900}
lionel[sad]: Er hat bezahlt. Alles. Vor einer Woche. Und er hat es mir nicht gesagt. Er wollte, dass ich frage. {+f:g_lionel_told_paid, reveals:f03}
lionel[sad]: Und ich habe nicht gefragt. Ich habe – {pause:600}
narr: Er setzte sich auf den Rand eines Pflanzkübels, das verkohlte Blatt zwischen den Fingern. Lange sagte er gar nichts.
lionel[sad]: Ich habe es verbrannt, Miss Hale. In der Nacht, als ich von der Terrasse zurückkam. Er lag da. Seine Hand war schon kalt. Und das Erste, was ich getan habe – nicht Hobbes wecken, nicht Tante Harriet –, das Erste war, meinen Namen ins Feuer zu werfen. Die ganze Mappe. Was sonst noch darin lag, weiß ich nicht. {+s:s32, reveals:f13}
lionel[sad]: Ich habe meinen eigenen Freispruch verbrannt. Und ihn nicht mal gelesen.
* [mitfuehlend] Sie konnten es nicht wissen. {lionel+2} -> a
* [ehrlich] Er hätte es Ihnen sagen sollen. Und Sie hätten fragen sollen. Beides. {lionel+1} -> b
* [schweigen] (Neben ihm sitzen bleiben.) {lionel+1} -> c
# a
lionel[neutral]: Nein. Ich konnte es nicht wissen. Das ist die Geschichte meines Lebens, Miss Hale. Ich wusste nie etwas, weil ich nie hingesehen habe.
-> c
# b
lionel[neutral]: Ja. Beides. Sie sind sehr gerecht. Das ist kaum auszuhalten.
# c
narr: Draußen hörte der Regen kurz auf. Dann fing er wieder an.
lionel[neutral]: Ich muss zu den Pferden.
narr: Er stand auf und ging hinaus. Das Blatt hielt er in der Faust und ließ es nicht los. {+f:k3_lionel_broken}

=== t3_clara_plate
kind: topic
npc: clara
title: Die Platte in der Kamera
when: ch=3 k:d11
important: yes
---
sera: Miss Clara. Die Kamera in der Halle. Ihr Vater hat in der Nacht belichtet, ab Mitternacht bis zum Morgen. Die Platte ist noch drin.
clara[surprised]: Das weiß ich. Er – {pause:400}
clara[neutral]: Er wollte Tante Harriet beweisen, dass auf der Treppe nichts wandelt. Eine ganze Nacht auf einer Platte. Nur die Treppe, leer. Als Gegenbeweis. Hobbes hat am Morgen den Deckel aufgesetzt, sagt er, weil der Herr es so wollte. Bis zum Morgen.
clara[tense]: Sie wollen, dass ich sie entwickle.
* [ehrlich] Ja. Wenn in der Nacht jemand über die Treppe gegangen ist, ist er drauf. {clara+1} -> a
* [mitfuehlend] Ich weiß, dass das sein letztes Bild ist. {clara+2} -> b
# a
clara[neutral]: Nur, wenn er lange genug an einer Stelle stand. Was sich bewegt, verschwindet auf einer so langsamen Platte. Man sieht nur, wer stehen bleibt, mit einer Flamme, oder lange genug sitzt.
-> c
# b
clara[sad]: Sein letztes. Ja.
# c
clara[neutral]: Das war sein letztes Experiment. Wenn ich es entwickle und es misslingt, dann ist es weg. Dann ist es nur noch ein schwarzes Glas.
narr: Sie stand eine Weile am Fenster. Draußen wurde es dunkel.
clara[neutral]: Um Mitternacht. Wenn alle schlafen und Tante Harriet nicht fragen kann, warum in der Dunkelkammer Licht brennt. {+f:k3_plate_agreed}
clara[neutral]: Sie halten die Laterne. Und Sie fassen nichts an, was ich Ihnen nicht gebe.

=== k3_nudge
kind: event
when: ch=3 f:k3_plate_agreed tod=abend
priority: 4
---
? k:d08 k:d10 f:k3_chapel_done -> ready
inner: Bis Mitternacht ist noch Zeit. Vorher will ich wissen, wer in der Nacht bei ihm war. Und was im Kamin verbrannt ist. {+f:k3_nudged}
-> END
# ready
inner: Bald ist Mitternacht. Clara wartet in der Dunkelkammer. {+f:k3_ready}

=== k3_nudge2
kind: event
when: ch=3 f:k3_plate_agreed f:k3_nudged k:d08 k:d10 f:k3_chapel_done !f:k3_ready
priority: 4
---
inner: Jetzt weiß ich, wo der Captain war und was er verbrannt hat. Bald ist Mitternacht. Clara wartet in der Dunkelkammer. {+f:k3_ready}

=== k3_end
kind: scene
when: ch=3 f:k3_ready loc=dunkel,arbeit
priority: 20
---
narr: Im Haus war es still. Die Standuhr in der Halle stand noch immer. Man hörte nur den Regen. {time=nacht}
narr: Hinter der Tür der Dunkelkammer brannte die rote Laterne. Clara trug ein schlichtes Kleid ohne Tournüre und hatte die Ärmel hochgekrempelt, richtig zum Arbeiten angezogen, dachte Sera. Vor ihr auf dem Tisch lag die Kassette mit der Platte, die sie im Dunkeln unter dem Tuch aus der Kamera geholt hatte.
clara[neutral]: Schließen Sie die Tür. Ganz. {chap:4, go:dunkel@0.3}
`;
