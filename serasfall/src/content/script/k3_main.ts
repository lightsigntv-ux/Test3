export default `
=== k3_wake
kind: scene
when: ch=3 loc=kammer
priority: 20
---
narr: Grau vor dem Fenster, grau über dem Wasser. Nebel steht auf dem Moor, so dicht, dass die Kopfweiden aussehen wie Menschen, die dort warten. {music:k3}
narr: Über der Stuhllehne hängt ihr Kleid, über Nacht schwarz geworden. Es riecht noch nach Farbe und ein wenig nach Essig. Mrs. Pryce hat nicht gefragt.
inner: Donnerstag. Mein zweiter Tag in einem Jahrhundert, in dem man für alles einen Brauch hat, außer für mich.
inner: Wer hat in jener Nacht mit ihm getrunken? Und was wollte er am Morgen unterschreiben lassen?
yuumi: (Yuumi sitzt auf dem Fensterbrett und verfolgt einen Vogel im Nebel, den nur sie sieht.)
inner: Und wie ich nach Hause komme. Das auch. {+f:k3_started}

=== k3_greenhouse
kind: scene
when: ch=3 loc=gewaechs tod=morgen
priority: 20
---
narr: Das Gewächshaus ist warm, feucht und grün, eine andere Jahreszeit hinter Glas. Auf dem Dach trommelt der Regen. {music:quiet}
narr: Zitronenbäumchen in Kübeln, Farne, ein Orangenbaum, der beschlossen hat, keine Orangen zu tragen. An jedem Kübel ein Schild in derselben engen Handschrift wie im Notizbuch.
yuumi: (Yuumi entdeckt einen Nachtfalter, der sich im Glas verirrt hat, und vergisst für eine Weile alles, was es auf der Welt sonst gibt.)
narr: Sera setzt sich auf die eiserne Bank. Der Falter flattert gegen das Glas, Yuumi springt, verfehlt ihn, landet in einem Farn und tut so, als hätte sie es genau so gewollt.
* [humor] Elegant. Wirklich. Ganz große Kunst. -> a
* [schweigen] (Lachen. Leise. Zum ersten Mal seit Tagen.) -> b
# a
yuumi: (Yuumi sieht sie über die Schulter an mit dem vollen Hochmut einer Katze, die gerade in einen Farn gefallen ist.)
-> c
# b
narr: Das Lachen überrascht sie selbst. Es ist das erste, seit sie hier ist, und es klingt fremd in diesem Haus.
# c
narr: Der Falter findet einen offenen Spalt im Glas und ist fort, hinaus in den Nebel.
inner: Er hat es rausgeschafft. Einfach so, durch einen Spalt, den keiner gesehen hat.

=== k3_dunning
kind: scene
when: ch=3 loc=stall
priority: 20
---
narr: Der Stallhof ist eine Insel. Hinter der Mauer beginnt das Wasser, und darin stehen die Weiden bis zum Hals. Ein Mann in einem Ölzeugumhang kniet vor einem flachen Boot und streicht Pech in die Fugen. Eine kalte Pfeife steckt in seinem Mundwinkel. {music:yard}
dunning[neutral]: Morgen, Miss.
dunning[neutral]: Die Miss, die aus dem Wasser kam. So nennt Sie die Küche.
* [humor] Das klingt, als hätte man mich geangelt. {dunning+1} -> a
* [neutral] Guten Morgen. Sie müssen Mr. Dunning sein. -> b
# a
dunning[neutral]: Hätt ich gern gesehn.
-> c
# b
dunning[neutral]: Dunning. Ohne Mister. Mister is Mr. Hobbes.
# c
narr: Er streicht weiter Pech. Er ist ein Mann, der für jede Bewegung genau so viel Kraft aufwendet, wie sie braucht, und keine Unze mehr.
dunning[neutral]: Samstag fällt’s. Wenn’s nich mehr regnet. Dann fahr ich den Doktor und den Coroner her. Und dann fahr ich heim zu Martha.
yuumi: (Yuumi schleicht um das Boot, schnuppert am Pech und schüttelt angewidert eine Pfote.)
dunning[neutral]: Taugt die was? Mäuse?
* [humor] Sie ist eher für die Moral zuständig. -> d
* [ehrlich] Ehrlich gesagt hat sie noch nie eine Maus gesehen. -> d
# d
dunning[neutral]: Hm. Dann is sie ja wie die Herrschaft. {dunning+1}
inner: Das war ein Witz. Glaube ich. Sein Gesicht hat sich nicht bewegt.

=== t3_dunning_boat
kind: topic
npc: dunning
title: Das Boot
when: ch>=3
---
sera: Kommt man mit so einem Boot über das Moor?
dunning[neutral]: Bei Tag. Wenn man die Gräben kennt. Die Rhynes. Wer die nich kennt, fährt sich fest und sitzt da, bis einer kommt.
? f:k1_said_boat -> lie
dunning[neutral]: In der Nacht kam kein Boot übers Moor, Miss. Da wär keiner gefahren, nich für Geld. {+s:s14, reveals:f21}
narr: Er sieht sie an, nicht lange. Dann wieder aufs Pech.
-> END
# lie
dunning[neutral]: Miss Averley sagt, Sie sind mit ’m Boot gekommen. In der Nacht auf Mittwoch.
dunning[neutral]: In der Nacht kam kein Boot übers Moor, Miss. Da wär keiner gefahren, nich für Geld. {+s:s14, reveals:f21}
* [ehrlich] Nein. Ich bin nicht mit einem Boot gekommen. {dunning+2} -> t
* [ausweichend] Dann war es wohl kein Boot aus Middlemoor. {sus+1} -> e
# t
dunning[neutral]: Hab ich mir gedacht.
dunning[neutral]: Wie Sie hergekommen sind, geht mich nix an. Ich sag, was ich seh. Und ich hab nix gesehn. Zu keinem.
-> END
# e
dunning[neutral]: Muss es wohl.
inner: Er glaubt mir kein Wort. Er sagt es nur nicht.

=== t3_dunning_night
kind: topic
npc: dunning
title: Die Nacht auf Mittwoch
when: ch>=3 anyf:k3_tea_brought t:dunning>=4
---
sera: Waren Sie in der Nacht auf Mittwoch draußen?
dunning[neutral]: Bei Hochwasser is man draußen. Die Pferde. Ich war ab zwei im Stall, beim Braunen, der war unruhig. Und raus auf den Hof bin ich, wie die Stalluhr Viertel vor drei geschlagen hat. {+s:s37}
dunning[neutral]: Ich red nich über die Herrschaft, Miss. Ich red über Pferde.
* [mitfuehlend] Dann erzählen Sie mir von den Pferden. {dunning+1} -> a
* [direkt] Haben Sie jemanden gesehen? -> b
# a
dunning[neutral]: Der Braune war unruhig. Pferde mögen nich, wenn einer draußen im Regen steht und sich nich rührt. Die riechen das.
-> c
# b
dunning[neutral]: Ich sag, was ich seh.
# c
dunning[neutral]: Kurz nach Viertel vor drei stand der Captain auf der Terrasse. Ganz hinten an der Brüstung, mit dem Rücken zum Haus. Ohne Rock. Im Regen. Vom Arbeitszimmer kam nur ’n Streifen Licht durch den Vorhang, aber der reichte. {+s:s06, reveals:f12}
dunning[neutral]: Hat nich geraucht. Hat nur aufs Wasser geguckt.
dunning[neutral]: Und vorher, halb drei, wie ich aus der Stalltür geguckt hab, war Licht im Gästeflügel. Hinter dem Fenster von der Dame aus Bath. Der Gästeflügel guckt über den Hof. {+s:s36, hints:f06}
inner: Er sagt es ohne Betonung, wie man einen Wasserstand abliest. Das macht es so schwer.

=== t3_pryce_tea
kind: topic
npc: pryce
title: Kann ich helfen?
when: ch=3 seen:k3_dunning !f:k3_tea_given
---
sera: Kann ich etwas tun, Mrs. Pryce?
pryce[neutral]: Sie können Dunning seinen Tee bringen. Der Mann sitzt seit sechs im Regen und kommt nicht rein, weil er meinen Boden nicht dreckig machen will. Als hätt ich was gesagt.
narr: Sie drückt ihr eine Kanne und einen Becher in die Hände, und ein Stück Brot mit Schinken, in ein Tuch geschlagen. {+f:k3_tea_given}

=== k3_tea_bring
kind: examine
target: h_st_boot
when: f:k3_tea_given !f:k3_tea_brought
priority: 10
---
narr: Sera stellt die Kanne auf den Bock neben dem Boot und gießt ein. Der Dampf steht über dem Becher wie ein kleines Gespenst.
dunning[surprised]: Das is von Mrs. Pryce.
dunning[neutral]: Sie hätt’s auch Tilly geben können. Die rennt schneller.
dunning[neutral]: … Danke, Miss. {dunning+2, +f:k3_tea_brought}
narr: Er trinkt, beide Hände um den Becher, und sieht dabei aufs Wasser. Eine Weile sagen sie beide nichts. Das scheint ihm recht zu sein.

=== t3_tilly_boots
kind: topic
npc: tilly
title: Die Stiefel des Captains
when: ch>=3 k:c19
---
sera: Tilly, die Reitstiefel des Captains in der Stiefelkammer –
tilly[neutral]: Die hab ich Mittwoch früh geputzt, gleich nach dem Herd. Die warn nass bis oben, Miss. Mit Erde vom Rosenbeet. Rote. {+s:s35, hints:f12}
tilly[neutral]: Und ’n Rosenblatt war drin, im Absatz. Mitten im November. Das hab ich aufgehoben. Weiß nich, warum.
tilly[tense]: Der Captain geht nachts nich raus, wenn’s regnet. Der sagt, Regen is was für Pferde und Iren.
inner: Und in der Nacht auf Mittwoch ist er rausgegangen. Ins Rosenbeet unter der Terrasse.

=== t3_tilly_dreams
kind: topic
npc: tilly
title: Wie geht es dir?
when: ch=3
---
sera: Tilly, du siehst müde aus.
tilly[neutral]: Ich bin immer müde, Miss. Ich steh um fünf auf.
tilly[sad]: Ich träum vom Herrn. Er sagt was zu mir. Und ich versteh’s nich. Und dann wach ich auf, und es is dunkel, und der Herd is aus. {hints:f26}
* [mitfuehlend] Was sagt er denn im Traum? {tilly+1} -> a
* [ehrlich] Ich träume auch schlecht, seit ich hier bin. {tilly+1} -> b
# a
tilly[tense]: Weiß nich mehr. Hab’s vergessen. Ehrlich.
narr: Sie hat es nicht vergessen. Man sieht es daran, wie sie den Kohleneimer umklammert.
-> END
# b
tilly[neutral]: Von zu Hause?
sera: Von zu Hause.
tilly[neutral]: Wo is das?
inner: Weit weg. Weiter, als du denkst. Und irgendwie näher, als es sein dürfte.
sera: Weit weg.
tilly[warm]: Hier is es auch weit weg. Von allem. Das is manchmal gut.

=== t3_pryce_chloral
kind: topic
npc: pryce
title: Miss Averleys Tropfen
when: ch>=2 k:s16
---
sera: Miss Averley sagt, Sie geben ihr jeden Abend Tropfen.
pryce[neutral]: Chloral. Zwanzig Tropfen in Wasser, seit dem Winter, wo Mr. Ashby – seit ein paar Wintern. Der Doktor hat’s verschrieben.
pryce[neutral]: Ich mess es ab, und ich schreib’s auf. Jeden Abend. Hier.
narr: Sie zieht ein kleines Buch aus der Schürzentasche und schlägt es auf. In ordentlichen Spalten: Datum, Uhrzeit, Tropfen. „Di., 13. – 11 Uhr – 20.“ {+c:c21, reveals:f18}
pryce[neutral]: Wenn sie das genommen hat, weckt sie keine Kanone. Das weiß das ganze Haus.
inner: Miss Averley kann also in der Nacht nichts gehört haben. Und jeder im Haus wusste das.

=== k3_chapel_ask
kind: scene
when: ch=3 loc=salon seen:k3_dunning
priority: 15
---
harriet[neutral]: Miss Hale. Dunning sagt, das Boot hält.
harriet[neutral]: Ich möchte zu Lucinda. Die Kapelle steht auf dem Hügel, das Wasser reicht nicht hinauf. Er kann nicht zu ihr, bevor der Coroner ihn freigibt. Also gehe ich.
harriet[neutral]: Sie begleiten mich.
* [mitfuehlend] Natürlich. {harriet+1} -> a
* [ehrlich] Ich bin noch nie in so einem Boot gefahren. -> b
# a
harriet[neutral]: Ziehen Sie den Umhang an. Es ist kalt auf dem Wasser.
-> c
# b
harriet[neutral]: Ich auch nicht, seit dreiundzwanzig Jahren. Wir werden es beide überleben. Wahrscheinlich.
# c
narr: Eine Viertelstunde später sitzen sie in Dunnings flachem Boot, Miss Averley aufrecht auf der Bank, einen Strauß weißer Chrysanthemen aus dem Gewächshaus im Schoß. Dunning stakt. Das Wasser ist glatt wie Glas und riecht nach Erde. {time=nachmittag, +f:k3_chapel_go, go:kapelle@0.2, sfx:water}

=== k3_chapel
kind: scene
when: ch=3 loc=kapelle f:k3_chapel_go
priority: 20
important: yes
---
narr: Die Kapelle ist klein und grau, der Friedhof um sie herum eine Insel aus Grabsteinen im Nebel. Auf dem Glockenstuhl hängt keine Glocke, nur ein rostiger Haken. {music:chapel}
narr: Miss Averley kniet vor einem Stein aus hellem Kalk und legt die Chrysanthemen darauf. „Lucinda Averley, 1829–1861. Sie hörte die Glocke.“
harriet[neutral]: Das hat Edmund einmeißeln lassen. Der Pfarrer war dagegen. Unchristlich, sagte er. Aberglaube.
harriet[neutral]: Edmund hat gesagt: Dann ist es eben mein Aberglaube. Und hat den Steinmetz selbst bezahlt.
narr: Sie steht auf, langsam, eine Hand auf dem Grabstein.
harriet[neutral]: Sie hat im Fieber davon gesprochen, am letzten Tag. „Wenn du die Glocke hörst, Edmund, hast du es gehalten.“ Ich stand vor der Tür. Was er ihr darauf versprochen hat, habe ich nicht gehört. Er hat nie davon gesprochen.
* [mitfuehlend] Sie haben ihn sehr geliebt. {harriet+1} -> a
* [direkt] Was glauben Sie, was er versprochen hat? -> b
* [schweigen] (Neben ihr stehen bleiben.) {harriet+1} -> c
# a
harriet[neutral]: Man liebt seinen Bruder, Miss Hale. Das ist keine Leistung.
harriet[sad]: Er war das Einzige, was mir von meinem Vater geblieben ist, und das Einzige, was ich nie verstanden habe.
-> c
# b
harriet[neutral]: Etwas über Clara, nehme ich an. Lucinda wollte, dass Clara wählen darf; das hat sie jedem gesagt, der es hören wollte. Ob er es ihr versprochen hat, weiß nur er.
# c
narr: Der Nebel treibt über die Gräber. Irgendwo weit draußen auf dem Wasser schreit ein Reiher.
harriet[neutral]: Ich war verlobt, wissen Sie. Henry Ashby. Leutnant bei den Fünfundfünfzigern. Er fiel bei Inkerman, am fünften November 1854.
harriet[neutral]: Ich habe elf Jahre gebraucht, bis ich ihn zum ersten Mal wieder gehört habe. Bei einer Sitzung in Clifton. Er sagte, er habe keine Schmerzen gehabt.
harriet[tense]: Man hat mir nachher erklärt, wie man so etwas macht. Ich habe es nicht hören wollen.
? t:harriet>=6 k:s39 -> heard
? t:harriet>=8 anyk:c24,c14 -> confess
harriet[neutral]: Wir sollten zurück. Dunning friert, und er sagt es nicht.
narr: Sie geht voraus, zum Boot, ohne sich umzusehen. {+f:k3_chapel_done}
-> END
# heard
sera: Miss Averley. Ich habe Sie heute früh gehört. Durch Ihre Tür. „Ich habe es niemandem gesagt, Edmund.“
harriet[tense]: Sie haben gelauscht.
sera: Meine Katze hat gelauscht. Ich stand daneben.
# confess
narr: Sie sieht Sera an, und etwas in ihrer geraden Haltung gibt nach, als hätte man einen Faden durchgeschnitten.
harriet[sad]: Er wusste es, Miss Hale. Seit August. Ein Arzt in Bath. Sein Herz. Monate, nicht Jahre. {+s:s29, reveals:f01}
harriet[sad]: Er hat es mir gesagt, weil jemand es wissen musste, falls – und er hat mich schwören lassen, es den Kindern nicht zu sagen. Auf Mutters Bibel.
harriet[tense]: „Sie sollen mich nicht sterben sehen, bevor ich sterbe, Harriet.“ Das hat er gesagt.
narr: Sie öffnet ihr Retikül, zieht einen gefalteten Brief heraus und hält ihn Sera hin, als wäre er heiß. {+c:c23}
letter: Dr. H. Wilkes, Bath, 21. August 1877. – Werter Sir, es handelt sich um eine Angina pectoris in fortgeschrittenem Stadium. Ich kann Ihnen keine Jahre versprechen und muss Ihnen dringend raten, Aufregung jeder Art zu vermeiden.
harriet[sad]: Aufregung jeder Art. Und ich habe ihm eine Séance ins Haus geholt.
* [mitfuehlend] Sie wollten ihm etwas Gutes tun. {harriet+2} -> d
* [ehrlich] Die Séance hat ihn nicht getötet. Sein Herz hat es getan. {harriet+1} -> e
# d
harriet[neutral]: Ich wollte ihm Lucinda geben. Bevor er ging. Er hatte ihre Karte im Schreibtisch, die Karte dieser Frau, ich dachte –
harriet[neutral]: Ich dachte, er sucht sie.
-> f
# e
harriet[neutral]: Sagen Sie das Clara. Sagen Sie es mir noch ein paarmal. Vielleicht glaube ich es dann.
# f
narr: Sie nimmt den Brief zurück, faltet ihn zweimal und steckt ihn ein.
harriet[neutral]: Und das Blatt unter dem Séancetisch, falls Sie es gefunden haben – das war ich. Man hält den Stift und wartet, und meistens schreibt man, was man fürchtet.
harriet[neutral]: Die Kinder dürfen es nicht erfahren. Noch nicht. Ich habe es geschworen.
harriet[neutral]: Wir sollten zurück. Dunning friert, und er sagt es nicht. {+f:k3_chapel_done, +f:g_harriet_told_sera}

=== k3_back
kind: scene
when: ch=3 loc=stall f:k3_chapel_done tod=nachmittag
priority: 15
---
narr: Als das Boot an der Stallmauer anlegt, ist der Nebel dünner geworden. Über dem Wasser liegt ein kupferfarbener Streifen, wo die Sonne untergeht, ohne sich zu zeigen. {time=abend, sfx:water}
narr: Miss Averley steigt aus, mit Dunnings Hand, ohne sie anzusehen, und geht ins Haus.
dunning[neutral]: Sie hat nich geweint. Die weint nie. Das is schlimmer als Weinen.

=== k3_lionel_terrace
kind: topic
npc: lionel
title: Die Terrasse
when: ch>=3 k:d08
---
sera: Captain. Sie waren in der Nacht auf Mittwoch nicht im Bett. Sie standen auf der Terrasse, kurz vor drei, im Regen.
narr: Er hebt das Glas, merkt, dass es leer ist, und stellt es sehr vorsichtig auf den Rand des Kübels.
lionel[tense]: Wer sagt das?
* [ehrlich] Jemand, der Sie gesehen hat. Und Ihre Stiefel. -> a
* [mitfuehlend] Ich frage Sie, nicht die anderen. {lionel+1} -> a
# a
lionel[neutral]: Meine Stiefel. Natürlich. Tilly putzt sie. Tilly sieht alles und sagt nichts, das Kind hat mehr Verstand als die ganze Familie.
lionel[neutral]: Ja. Ich war auf der Terrasse. Ich brauchte Luft. Man braucht manchmal Luft, Miss Hale, auch nachts, auch im Regen. {+s:s24, reveals:f12}
? t:lionel>=6 -> more
lionel[neutral]: Und jetzt lassen Sie mich in Ruhe.
-> END
# more
narr: Er sieht auf seine Hände. Auf dem Handrücken eine alte weiße Narbe, vom Polo, hat er einmal gesagt, oder von einem Säbel, je nach Publikum.
lionel[neutral]: Ich war vorher bei ihm. Im Arbeitszimmer. Wir haben gestritten. Um Geld. Wie immer. {+s:s40, hints:f07}
lionel[tense]: Als ich ging, lebte er. Er lebte, Miss Hale. Er saß an seinem Schreibtisch und sah mich an, als wäre ich ein Fleck auf einem Präparat.
* [mitfuehlend] Das muss wehgetan haben. {lionel+1} -> b
* [direkt] Und wann sind Sie zurückgekommen? {lionel-1} -> c
# b
lionel[neutral]: Wehgetan. Mir? Er ist tot.
narr: Aber er widerspricht nicht.
-> END
# c
lionel[angry]: Wer sagt, dass ich zurückgekommen bin?
narr: Er steht auf und geht, ohne sich zu verabschieden, hinaus in den Regen.

=== pr_lionel_c10
kind: present
npc: lionel
items: c10,d10
when: ch>=3 k:d10
important: yes
---
narr: Sera hält ihm das verkohlte Blatt hin. Er erkennt den Briefkopf, bevor er ihn lesen kann; man sieht es daran, wie er zurückweicht.
lionel[angry]: Woher haben Sie das?
sera: Aus dem Aschekasten im Arbeitszimmer. Lesen Sie, was darunter steht.
lionel[tense]: Ich weiß, was da steht. Meine Schuldscheine. Crabbe und Tolley, Jermyn Street, sehr diskret, sehr teuer –
sera: Da steht: „vollständig beglichen“.
narr: Er nimmt das Blatt. Er liest. Man sieht, wie er die Zeile zweimal liest und dann ein drittes Mal, als stünde beim dritten Mal etwas anderes da.
lionel[surprised]: Beglichen.
? k:c15 -> note
-> read
# note
sera: Im Notizbuch Ihres Vaters, am 8. November: „C und T – 1840 angewiesen. Dem Jungen nichts sagen, bis er es selbst fragt.“
# read
lionel[surprised]: Er hat – {pause:900}
lionel[sad]: Er hat bezahlt. Alles. Vor einer Woche. Und er hat es mir nicht gesagt. Er wollte, dass ich frage. {+f:g_lionel_told_paid, reveals:f03}
lionel[sad]: Und ich habe nicht gefragt. Ich habe – {pause:600}
narr: Er setzt sich auf den Rand eines Pflanzkübels, das verkohlte Blatt zwischen den Fingern, und für eine lange Zeit sagt er gar nichts.
lionel[sad]: Ich habe es verbrannt, Miss Hale. In jener Nacht, als ich von der Terrasse zurückkam. Er lag da, und auf dem Tisch lag die Mappe, und ich sah meinen Namen und Crabbes Briefkopf und warf alles ins Feuer, damit niemand – damit Tante Harriet nicht – {+s:s32, reveals:f13}
lionel[sad]: Ich habe meinen eigenen Freispruch verbrannt. Ohne ihn zu lesen.
* [mitfuehlend] Sie konnten es nicht wissen. {lionel+2} -> a
* [ehrlich] Er hätte es Ihnen sagen sollen. Sie hätten fragen sollen. Beides. {lionel+1} -> b
* [schweigen] (Neben ihm sitzen bleiben.) {lionel+1} -> c
# a
lionel[neutral]: Nein. Ich konnte es nicht wissen. Das ist die ganze Geschichte meines Lebens, Miss Hale. Ich konnte nie etwas wissen, weil ich nie hingesehen habe.
-> c
# b
lionel[neutral]: Ja. Beides. Sie sind sehr gerecht. Das ist unerträglich.
# c
narr: Draußen hört der Regen für einen Augenblick auf. Dann beginnt er wieder.
lionel[neutral]: Ich muss zu den Pferden.
narr: Er steht auf und geht hinaus, das Blatt in der Faust. Er lässt es nicht los. {+f:k3_lionel_broken}

=== t3_clara_plate
kind: topic
npc: clara
title: Die Platte in der Kamera
when: ch=3 k:d11
important: yes
---
sera: Miss Clara. Die Kamera in der Halle. Ihr Vater hat in der Nacht belichtet. Ab Mitternacht, bis zum Morgen. Die Platte ist noch darin.
clara[surprised]: Das weiß ich. Er – {pause:400}
clara[neutral]: Er wollte Tante Harriet beweisen, dass auf der Treppe nichts wandelt. Eine ganze Nacht auf einer Platte. Nur die Treppe, leer. Als Gegenbeweis. Hobbes hat morgens den Deckel aufgesetzt, sagt er, weil der Herr es so wollte. Bis zum Morgen.
clara[tense]: Sie wollen, dass ich sie entwickle.
* [ehrlich] Ja. Wenn in der Nacht jemand über die Treppe gegangen ist, ist er darauf. {clara+1} -> a
* [mitfuehlend] Ich weiß, dass das sein letztes Bild ist. {clara+2} -> b
# a
clara[neutral]: Wenn er lange genug an einer Stelle stand. Alles, was sich bewegt, verschwindet auf einer so langsamen Platte. Nur wer stehen bleibt, mit einer Flamme, oder lange genug sitzt.
-> c
# b
clara[sad]: Sein letztes. Ja.
# c
clara[neutral]: Das war sein letztes Experiment. Wenn ich es entwickle und es misslingt – dann ist es nichts mehr. Dann ist es nur noch ein schwarzes Glas.
narr: Sie steht eine Weile vor dem Fenster, hinter dem es dunkel wird.
clara[neutral]: Um Mitternacht. Wenn alle schlafen und Tante Harriet nicht fragen kann, warum Licht in der Dunkelkammer ist. {+f:k3_plate_agreed}
clara[neutral]: Sie halten die Laterne. Und Sie fassen nichts an, was ich Ihnen nicht gebe.

=== k3_nudge
kind: event
when: ch=3 f:k3_plate_agreed tod=abend
priority: 4
---
? k:d08 k:d10 f:k3_chapel_done -> ready
inner: Bis Mitternacht ist noch Zeit. Ich will vorher wissen, wer in der Nacht bei ihm war. Und was im Kamin verbrannt ist. {+f:k3_nudged}
-> END
# ready
inner: Bald Mitternacht. Clara wartet in der Dunkelkammer. {+f:k3_ready}

=== k3_nudge2
kind: event
when: ch=3 f:k3_plate_agreed f:k3_nudged k:d08 k:d10 f:k3_chapel_done !f:k3_ready
priority: 4
---
inner: Jetzt weiß ich, wo der Captain war, und was er verbrannt hat. Bald Mitternacht. Clara wartet in der Dunkelkammer. {+f:k3_ready}

=== k3_end
kind: scene
when: ch=3 f:k3_ready loc=dunkel,arbeit
priority: 20
---
narr: Das Haus schläft, oder es tut so. Die Standuhr in der Halle schweigt noch immer; nur der Regen zählt. {time=nacht}
narr: Hinter der Tür der Dunkelkammer brennt die rote Laterne. Clara hat die Ärmel hochgekrempelt, und vor ihr auf dem Tisch liegt die Kassette mit der Platte, die sie aus der Kamera geholt hat, ohne Licht, unter dem Tuch, wie man einen schlafenden Vogel aus einem Käfig nimmt.
clara[neutral]: Schließen Sie die Tür. Ganz. {chap:4, go:dunkel@0.3}
`;
