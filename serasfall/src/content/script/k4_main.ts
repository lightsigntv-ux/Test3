export default `
=== k4_develop
kind: scene
when: ch=4 loc=dunkel
priority: 20
important: yes
---
narr: Rotes Licht. Es macht alle Hände gleich und alle Gesichter fremd. Die Tür ist zu, der Spalt darunter mit einem Tuch verstopft. {music:develop}
clara[neutral]: Er hat eine Tanninplatte genommen. Trockenkollodium. Die sind langsam wie Schnecken, deshalb. Eine nasse Platte hätte er nach zehn Minuten entwickeln müssen.
clara[neutral]: Und er hat die Lampe in der Halle brennen lassen, kleingedreht. Damit die Treppe überhaupt zu sehen ist. Sieben Stunden Lampenlicht. Das reicht für ein Gespenst von einer Treppe.
narr: Sie legt die Platte in eine flache Schale. Glas, milchig, ohne Bild.
clara[neutral]: Pyrogallol und Ammoniak. Halten Sie die Laterne. Höher. Nicht über die Schale, daneben.
narr: Sie gießt. Die Flüssigkeit läuft in einer glatten Welle über das Glas. Clara wiegt die Schale, langsam, hin und her, wie man ein Kind wiegt. {sfx:liquid}
clara[neutral]: Jetzt nichts sagen. Zählen.
* [neutral] (Leise zählen.) -> a
* [schweigen] (Die Luft anhalten.) -> a
# a
narr: Eins. Zwei. Zwölf. Dreißig. Auf dem Glas beginnt etwas dunkler zu werden, wo es hell war. Die Umrisse einer Treppe. Ein Geländer. Ein Fenster, dahinter nichts.
narr: Und Striche. Feine, helle Bahnen, die über die Stufen ziehen, als hätte jemand mit einer Nadel ins Dunkel gekratzt.
clara[surprised]: Da ist jemand gegangen. Mehr als einer.
clara[neutral]: Fixieren. Die Flasche. Nein – die mit dem Stopfen. Gut.
narr: Der Bittermandelgeruch steigt auf, süß und falsch. Clara spült die Platte unter dem Wasser aus einem Krug, hält sie gegen die Laterne, dann legt sie ein schwarzes Samttuch dahinter.
clara[neutral]: Gegen Schwarz sieht man eine Kollodiumplatte als Positiv. Wie ein Ambrotyp. Er hat mir das gezeigt, da war ich zwölf.
narr: Die Treppe. Grau auf Schwarz, weich, als läge sie unter Wasser. Über die Stufen ziehen sieben Lichtbahnen, manche gleichmäßig und hell, eine breit und stetig wie ein Fluss, zwei zittrig, dünn, unterbrochen, als hätte die Flamme geflackert. {+c:c29, +f:g_plate_dev}
narr: Und auf der fünften Stufe von unten sitzt ein Mädchen. Blass, unscharf, aber da. Eine Haube. Eine Kerze auf der Stufe neben ihr, ein heller Fleck. Das Gesicht in den Händen.
clara[tense]: Eine Dienstbotin. Auf der Haupttreppe. Mitten in der Nacht. Lange genug still, dass die Platte sie festhält. Zehn Minuten, mindestens. {hints:f09}
narr: Und neben dem Mädchen, noch blasser, fast nur ein Hauch auf dem Glas: eine zweite Gestalt. Eine Frau, die auf der Stufe sitzt, den Kopf zur Seite geneigt. Helles Haar. Und auf ihrem Schoß, klein, rund, mit zwei spitzen Ohren –
inner: Nein.
inner: Das ist Yuumi. So sitzt sie. Genau so, eine Pfote eingerollt, als hätte sie Angst, sie könne ihr weglaufen.
inner: Das ist – {pause:900}
inner: Das bin ich.
clara[neutral]: Eine Doppelbelichtung. Oder ein Fehler in der Schicht. Oder er hat eine alte Platte genommen, auf der schon etwas war.
clara[angry]: Er wollte beweisen, dass nichts auf der Treppe wandelt. Und jetzt sitzt ein Gespenst darauf. Wenn Tante Harriet das sieht, lässt sie es rahmen.
narr: Sie lacht. Es ist kein gutes Lachen, und es hört mitten drin auf.
clara[sad]: Sein letztes Experiment. Und es ist missglückt.
* [mitfuehlend] Es ist nicht missglückt. Es hat gesehen, was in dieser Nacht passiert ist. {clara+1} -> b
* [ehrlich] Ich glaube nicht, dass das ein Fehler ist. -> c
* [schweigen] (Nichts sagen können.) -> d
# b
clara[neutral]: Gesehen. Ja. Es hat gesehen. Und keiner von uns.
-> e
# c
clara[neutral]: Dann ist es ein Geist, Miss Hale? Sagen Sie das nicht. Nicht Sie auch noch.
-> e
# d
narr: Sera sagt nichts. Ihre Hände, die die Laterne halten, sind ganz ruhig. Nur das Licht darin zittert.
# e
clara[neutral]: Sieben Bahnen. Wachs brennt gleichmäßig, hell. Talg flackert und rußt; das gibt dünne, zittrige Striche. Und eine Lampe gibt ein breites, stetiges Band.
narr: Ihr Finger fährt über dem Glas entlang, ohne es zu berühren. Beim ersten Strich – einem hellen, gleichmäßigen, der vom oberen Rand bis zur Tür des Arbeitszimmers hinunterführt – bleibt er stehen.
clara[neutral]: Das hier ist Wachs. Die Treppe hinunter, zum Arbeitszimmer. Und hier wieder hinauf. {pause:500}
? t:clara>=6 -> confess
clara[neutral]: Das war ich. Um eins. Ich habe ihm gute Nacht gesagt. Mehr nicht. {hints:f05}
inner: Mehr nicht. Das sagt man, wenn es mehr war.
-> f
# confess
clara[sad]: Das war ich. Um eins war ich bei ihm in der Dunkelkammer. Hier. An diesem Tisch. Wir haben gestritten. {+s:s33, reveals:f05}
clara[sad]: Er sagte, ich müsse warten. Ein, zwei Jahre, London sei im Augenblick nicht möglich. Er sagte nicht, warum. Er sagte nie, warum.
clara[sad]: Und ich habe gesagt, Mama hätte sich für ihn geschämt. Das war das Letzte, was ich zu ihm gesagt habe.
narr: Sie steht ganz still im roten Licht. Dann nimmt sie die Platte vom Samt, sehr vorsichtig, an den Kanten.
# f
clara[neutral]: Nehmen Sie sie mit. Heute Nacht. Ich will sie nicht in meinem Zimmer haben. Morgen mache ich einen Abzug, wenn es hell genug ist.
narr: Sie gibt Sera die Platte, in schwarzes Papier gewickelt. Sie ist leicht. Viel zu leicht für das, was darauf ist. {+f:k4_plate_held}
narr: In ihrer Kammer legt Sera die Platte in die Truhe, zu ihrer Jeans und den Socken mit den Avocados, und liegt bis zum Morgengrauen wach. Yuumi schläft auf ihren Füßen, als wäre nichts. {time=morgen, go:kammer@0.5}

=== k4_morning
kind: scene
when: ch=4 loc=kammer tod=morgen
priority: 20
---
narr: Freitag. Der Regen hat nachgelassen, aber das Licht ist gelblich und schwer, als halte der Himmel die Luft an. {music:k4}
inner: Ich war da. In der Nacht, in der er starb, saß ich auf dieser Treppe, neben einem weinenden Mädchen, mit Yuumi auf dem Schoß. Und ich weiß nicht, wie.
inner: Das Flüstern aus dem Glas. Die Glocke, das Klopfen, das Licht. Das war kein Traum. Das war diese Treppe.
inner: Gut. Eins nach dem anderen. Wer ist das Mädchen? Clara sagt: eine Dienstbotin, mit einer Talgkerze. Im Haus gibt es gerade genau zwei Frauen, die Talg brennen.
inner: Und eine davon ist dreizehn.

=== t4_tilly_stairs_early
kind: topic
npc: tilly
title: Das Mädchen auf der Treppe
when: ch=4 k:d16 !f:g_tilly_spoke t:tilly<8 tod=morgen,mittag
---
sera: Tilly. Ich muss dich etwas fragen. Über die Nacht, in der der Herr starb.
narr: Tilly lässt den Löffel in den Topf fallen. Er sinkt.
tilly[tense]: Ich hab geschlafen, Miss. Ich hab’s doch gesagt. Ich hab – {pause:300}
* [direkt] Du warst auf der Treppe. Ich weiß es. {tilly-2} -> a
* [mitfuehlend] Schon gut. Nicht jetzt. Wenn du willst, später. Ich bin da. {tilly+1} -> b
# a
tilly[angry]: Nein! Nein, war ich nich! Sie – Sie sind genau wie alle!
narr: Sie rennt zur Hoftür hinaus, ohne Umhang, und Mrs. Pryce sieht Sera an, wie man jemanden ansieht, der gerade einen Teller zerbrochen hat, den man selbst sehr gern hatte.
pryce[angry]: Was haben Sie zu ihr gesagt? {pryce-1}
inner: Zu früh. Viel zu früh. Das war dumm.
-> END
# b
tilly[neutral]: Später.
narr: Sie fischt den Löffel aus dem Topf mit den Fingern, verbrennt sich und sagt nichts dazu.

=== k4_post_call
kind: event
when: ch=4 k:d16 tod=morgen
priority: 5
---
narr: Draußen ruft jemand über das Wasser, lang gezogen, und eine Glocke bimmelt. Ein Boot mit einer Laterne am Bug kommt über die Weiden, ein Mann darin in einem gelben Ölzeug. {sfx:bellBoat, time=mittag}
inner: Die Post. Ausgerechnet heute.
narr: Wenig später hört man Hobbes durch die Halle gehen, mit einem Tablett voller Briefe, und die Tür zum Salon. {+f:g_post_arrived}

=== k4_post
kind: scene
when: ch=4 loc=salon f:g_post_arrived
priority: 20
important: yes
---
narr: Miss Averley sitzt am Fenster, einen Stapel Briefe auf dem Schoß, schwarz umrandet, die meisten. Beileid aus Bridgwater, aus Wells, aus London. Einer ist anders: dickes cremefarbenes Papier, ein gedruckter Absender. {music:tension}
harriet[neutral]: Mrs. Crewe’s Agentur für Damen in Stellung. Oxford Street.
narr: Sie öffnet ihn mit dem silbernen Messer, liest. Liest noch einmal. Dann legt sie ihn auf den Schoß, glättet ihn mit der flachen Hand und sieht Sera an. {+c:c31, +f:g_agency}
harriet[neutral]: Miss Sarah Hale bedauert zutiefst. Sie liegt seit Montag mit Influenza bei ihrer Schwester in Bristol und wird ihre Stellung frühestens zu Weihnachten antreten können. {reveals:f22}
harriet[neutral]: Wer, Miss Hale, sind dann Sie?
inner: Da ist sie. Die Frage, auf die ich seit Mittwoch warte.
? t:penrose>=6 f:k1_library_done -> penrose
-> choose
# penrose
narr: Die Tür geht auf. Mrs. Penrose steht darin, als hätte sie auf ein Stichwort gewartet. Vielleicht hat sie das.
penrose[neutral]: Miss Averley. Ich fürchte, ich muss Ihnen etwas gestehen.
penrose[neutral]: Ich habe Mrs. Crewe um eine Vertretung gebeten, als ich hörte, dass Miss Hale erkrankt ist. Eine Bekannte aus Bath. Ich wollte Sie nicht beunruhigen. Es war anmaßend von mir.
harriet[surprised]: Sie – Sie haben –
penrose[neutral]: Ich habe. Man verzeiht es mir oder nicht. {+f:k4_cover_penrose}
harriet[neutral]: … Wir sprechen später darüber, Mrs. Penrose.
narr: Mrs. Penrose nickt und geht. An der Tür dreht sie sich nicht um. Aber ihre linke Hand macht eine kleine Bewegung, wie ein Vorhang, der fällt.
harriet[neutral]: Ich glaube ihr kein Wort, Miss Hale. Aber ich glaube, dass sie es für Sie gesagt hat. Das ist beinahe interessanter.
-> after
# choose
* [ehrlich] Ich bin nicht Miss Hale. Ich heiße Sera. Ich bin hier hereingeraten, ohne es zu wollen, und ich bin geblieben, weil man mich gebraucht hat. {+f:k4_cover_truth} -> truth
* [luege] Die Agentur hat mich als Vertretung geschickt. Man hat Ihnen wohl nicht geschrieben. {+f:k4_cover_lie} -> lie
* [schweigen] (Nichts sagen. Sie ansehen.) -> silent
# truth
? t:harriet>=5 -> truth_ok
harriet[angry]: Hereingeraten. In ein Haus, das vom Wasser umschlossen ist. {harriet-1}
harriet[neutral]: Sie werden mir das erklären, Miss – Sera. Nicht heute. Heute habe ich einen Bruder zu begraben, sobald man es mir erlaubt.
-> after
# truth_ok
narr: Miss Averley sieht sie lange an. Dann faltet sie den Brief zusammen, zweimal, und legt ihn auf den Stapel.
harriet[neutral]: Sie haben am Mittwoch Tee mit Toast für mich bestellt, als ich es selbst nicht konnte. Sie haben ihn mit gewaschen. Sie haben mich zu Lucinda gebracht.
harriet[neutral]: Ich weiß nicht, wer Sie sind. Aber ich weiß, was Sie getan haben. Bleiben Sie. Bis Samstag. Danach werden wir sehen. {harriet+1}
-> after
# lie
? sus<5 -> lie_ok
harriet[tense]: Man hat mir nicht geschrieben. Man schreibt immer, Miss Hale. Oder wie immer Sie heißen.
harriet[neutral]: Sie schälen Kartoffeln. Sie wissen nicht, wie man knickst. Sie fragen nach Kaffee. Sie gehen nicht zur Kirche. {harriet-2}
harriet[neutral]: Ich habe keine Kraft für eine Lüge mehr in diesem Haus. Gehen Sie mir aus den Augen, bis ich Sie rufe.
inner: Das hat gesessen. Und es war verdient.
-> after
# lie_ok
harriet[neutral]: Man hat mir nicht geschrieben. Das Wasser, vermutlich. {pause:400}
harriet[neutral]: Sie sind eine seltsame Vertretung, Miss Hale. Aber Sie sind hier, und die andere nicht. {sus+1}
-> after
# silent
narr: Die Standuhr schweigt. Draußen fällt ein Tropfen von der Dachrinne, dann noch einer.
harriet[neutral]: Sie sagen nichts. Das ist entweder sehr klug oder sehr schuldig. {pause:500}
harriet[neutral]: Ich habe keine Kraft für beides. Bleiben Sie, bis das Wasser fällt. Dann gehen Sie, wohin Sie gehören.
# after
narr: Unter dem Stapel liegt noch ein Zettel, in Dunnings ungelenker Schrift, vom Postboten diktiert: Der Coroner, Mr. Harding aus Bridgwater, und Dr. Bell kämen mit dem fallenden Wasser, spätestens Samstag in der Frühe.
harriet[neutral]: Morgen früh. Dann wird es amtlich. {+f:k4_post_done}

=== k4_lost
kind: event
when: ch=4 f:k4_post_done !f:k4_found !f:g_yuumi_lost
priority: 6
---
narr: Das Licht wird gelb, dann grün, dann fast schwarz. Über dem Moor rollt ein Donner, so tief, dass die Fensterscheiben summen. {sfx:thunder, time=nachmittag}
inner: Yuumi hasst Gewitter. Wo ist –
inner: Wo ist Yuumi? {+f:g_yuumi_lost, music:worry}

=== k4_lost_kitchen
kind: scene
when: ch=4 f:g_yuumi_lost loc=dienst !f:k4_found
priority: 20
---
tilly[tense]: Miss! Die Katze! Die is raus, wie Dunning mit der Post reinkam – durch die Hoftür, wie der Blitz, ich hab noch gerufen –
pryce[neutral]: Bei dem Wetter. Die kommt wieder, wenn sie Hunger hat. Katzen sind nicht dumm.
tilly[tense]: Die kennt sich doch hier nich aus! Die weiß doch nich, wo die Gräben sind!
narr: Tilly ist schon an der Hoftür, den Umhang halb über den Schultern. {+f:k4_search}

=== k4_found
kind: scene
when: ch=4 f:g_yuumi_lost loc=stall
priority: 20
important: yes
---
narr: Der Hof ist ein einziges Rauschen. Regen peitscht quer über die Pflastersteine, der Braune wiehert in seiner Box. Ein Blitz – und für einen Augenblick ist alles weiß, das Wasser, die Weiden, das Boot. {sfx:thunder}
narr: Dann, in der Stille danach, ganz fein, von oben: ein Glöckchen. {sfx:bellFar}
tilly[surprised]: Da! Oben! Auf dem Heuboden!
narr: Die Leiter zum Heuboden hat drei Sprossen zu wenig, und das Kleid hat zu viele Stoffbahnen. Sera greift nach der Leiter, rutscht ab.
tilly[neutral]: Ich mach das. Ich bin leicht.
* [mitfuehlend] Sei vorsichtig. {tilly+1} -> a
* [direkt] Nein, ich – gut. Ich halte die Leiter. {tilly+1} -> a
# a
narr: Tilly klettert, barfuß, die Schuhe hat sie unten stehen lassen, die Röcke in den Bund gestopft. Oben verschwindet sie im Dunkel.
tilly[warm]: Komm, Handschuh. Komm her. Is doch nur Donner. Der tut nix. Der schreit nur.
narr: Eine lange Minute. Donner. Dann Tillys Gesicht in der Luke, voller Heu, und in ihren Armen ein nasses, graues, empörtes Bündel. {sfx:meowAngry}
yuumi: (Yuumi faucht den Donner an, das Heu, den Regen, die ganze Welt. Dann entdeckt sie Sera, und das Fauchen wird mitten drin ein kleines, klägliches Miauen.) {sfx:meow}
narr: Tilly reicht sie hinunter. Sera drückt sie an sich, und Yuumi gräbt die Krallen in das schwarze Kleid und lässt nicht mehr los. {-f:g_yuumi_lost, +f:k4_found}
narr: Tilly kommt die Leiter herunter und setzt sich ins Stroh, außer Atem. Sera setzt sich daneben. Draußen donnert es noch, aber weiter weg.
tilly[neutral]: Die hatte Angst. Die hat sich ins Heu gewühlt, ganz hinten, wo’s trocken is. Ich hab das auch mal gemacht. Im Arbeitshaus, im Holzschuppen.
tilly[sad]: Wenn man Angst hat, versteckt man sich, und dann hofft man, dass einer kommt. Und dann kommt keiner. Und dann hofft man, dass keiner kommt.
* [mitfuehlend] Heute ist jemand gekommen. Du. {tilly+2} -> b
* [ehrlich] Danke, Tilly. Ich hätte sie allein nicht gefunden. {tilly+2} -> c
# b
tilly[surprised]: Ich?
tilly[neutral]: Ja. Ich. {pause:500}
-> d
# c
tilly[warm]: Sie hätten sie gefunden. Sie wären nur nich raufgekommen, mit dem Rock.
# d
narr: Tilly streckt die Hand aus. Yuumi riecht daran, dann stößt sie den Kopf gegen Tillys Finger, einmal, zweimal. Tilly lacht, und in dem Lachen ist etwas, das beinahe ein Schluchzen ist.
tilly[sad]: Miss. Wenn ich – wenn einer was weiß. Was Schlimmes. Und er sagt’s nich, weil er Angst hat. Is das auch schlimm?
* [mitfuehlend] Angst haben ist nie schlimm. Allein damit bleiben ist schlimm. {tilly+1} -> e
* [ehrlich] Ich glaube, es hängt davon ab, wem man es sagt. {tilly+1} -> e
# e
tilly[neutral]: Hm.
narr: Sie steht auf, zupft sich Heu aus der Haube und sieht zur Hoftür.
tilly[neutral]: Heut Nacht. Wenn Mrs. Pryce schläft. In der Küche.
narr: Dann ist sie fort, barfuß über die Pflastersteine, die Schuhe in der Hand.

=== k4_paws
kind: scene
when: ch=4 f:k4_found loc=kammer
priority: 20
---
narr: In ihrer Kammer rubbelt Sera Yuumi mit einem Handtuch trocken. Yuumi hält es für eine unerhörte Zumutung und schnurrt dabei. {music:quiet, sfx:purr}
narr: Beim Hinsetzen zieht Yuumi die linke Vorderpfote hoch.
inner: Du humpelst. Zeig mal –
narr: Es klopft, und bevor Sera antworten kann, steht Clara in der Tür, einen Stapel Wetterbücher unter dem Arm.
clara[neutral]: Tilly sagt, Ihre Katze war auf dem Heuboden. Im Gewitter. Tilly sagt es der ganzen Küche. Tilly ist sehr stolz.
clara[neutral]: Sie humpelt.
narr: Clara legt die Bücher ab, kniet sich hin, ohne auf ihr Kleid zu achten, und nimmt die Pfote in ihre Hand mit den schwarzen Fingerspitzen.
clara[neutral]: Felis catus. Mit Glöckchen. Sie wollen wohl, dass die Vögel gewarnt sind.
narr: Mit zwei Fingern zieht sie einen Holzsplitter aus dem Ballen, so schnell, dass Yuumi erst hinterher protestiert.
clara[neutral]: Ein Splitter von der Leiter. Sie wird es überleben. Das ist die erste Operation meines Lebens, Miss Hale. Die Patientin hat mich gebissen, aber nur symbolisch.
* [humor] Sie wird eine Beschwerde an die Royal Free schreiben. {clara+1} -> a
* [mitfuehlend] Sie haben sehr ruhige Hände. {clara+1} -> b
# a
clara[warm]: Man wird ihr nicht glauben. Sie ist eine Frau.
-> c
# b
clara[neutral]: Das hat er auch immer gesagt.
# c
narr: Sie steht auf, nimmt die Bücher und bleibt einen Moment an der Tür stehen, als wolle sie noch etwas sagen. Dann geht sie.

=== k4_tilly
kind: scene
when: ch=4 f:k4_found loc=dienst tod=nacht !f:g_tilly_spoke
priority: 20
important: yes
repeat: yes
---
narr: Die Küche ist dunkel bis auf den Herd, in dem die Glut unter der Asche atmet, und eine Talgkerze auf dem Tisch. Tilly sitzt davor, die Knie angezogen, eine verbeulte Blechdose in den Händen. {music:truth}
narr: Yuumi springt auf die Bank neben sie. Tilly legt ihr eine Hand auf den Rücken, ohne hinzusehen.
tilly[neutral]: Sie sind gekommen.
sera: Ich hab’s gesagt.
tilly[sad]: Man sagt vieles.
narr: Die Kerze tropft. Talg, gelb, der nach Hammel riecht.
tilly[tense]: Miss. Bevor ich was sag. Sie müssen mir was sagen. Was Wahres. Von Ihnen. Weil – weil wenn ich was sag, dann gehört das Ihnen. Und dann muss ich auch was von Ihnen haben. Sonst is es nich gerecht.
* [ehrlich] Ich bin nicht Miss Hale. Ich komme von sehr weit her. So weit, dass ich selbst nicht weiß, wie ich zurückkomme. {tilly+2, +f:k4_honest} -> honest
* [ehrlich] Ich habe Angst, Tilly. Die ganze Zeit, seit ich hier bin. Ich tue nur so, als wüsste ich, was ich tue. {tilly+2, +f:k4_honest} -> honest
* [ausweichend] Du musst mir nichts sagen, wenn du nicht willst. {tilly-1} -> dodge
# dodge
tilly[sad]: Dann sag ich nix.
narr: Sie bläst die Kerze nicht aus. Aber sie dreht sich zum Herd, und die Blechdose verschwindet unter ihrer Schürze.
inner: Sie wollte etwas von mir. Und ich habe ihr eine Höflichkeit gegeben. {do:hint_tilly}
-> END
# honest
tilly[neutral]: Das dacht ich mir. {pause:500}
tilly[neutral]: Das mit dem Weit-weg. Und das mit der Angst.
? t:tilly<6 -> hurt
-> open
# hurt
tilly[sad]: Sie warn nich immer nett zu mir, Miss. Sie haben gedrängelt. Da is man vorsichtig.
tilly[neutral]: Aber Sie sind gekommen. Heut Nacht. Das zählt auch. {tilly+2}
# open
narr: Sie öffnet die Blechdose. Darin: ein Knopf, ein Stück rotes Band, ein glatter grauer Stein. Und ein Brief, zweimal gefaltet, mit einem Rand aus Ruß.
tilly[sad]: Das hat mir der Herr gegeben. In der Nacht.
tilly[sad]: Die Glocke hat geläutet, die vom Arbeitszimmer. Ich schlaf doch in der Küche, beim Herd. Mrs. Pryce hatte noch Licht, aber die kam nich. Also bin ich hin. {+s:s27, reveals:f08|f09|f10}
tilly[sad]: Der Herr saß am Schreibtisch, ganz grau im Gesicht, und hat mir das hier gegeben. „Für Miss Clara. Nur für sie. Hol sie. Schnell, Kind.“
tilly[tense]: Und ich bin die große Treppe rauf. Die darf ich nich, nie, aber die is schneller. Und ich hab an Miss Claras Tür geklopft. Ich hab so lang geklopft. Und keiner hat aufgemacht.
tilly[sad]: Und ich hab mich nich getraut, reinzugehen, und nich, Miss Averley zu wecken. Also bin ich wieder runter, zum Herrn, um zu sagen, dass keiner aufmacht.
tilly[sad]: Und da lag er. Vor dem Kamin. Er hat noch gelebt.
narr: Ihre Stimme wird ganz dünn, wie ein Faden, der sich vom Rand einer Spule wickelt. {pause:800}
tilly[sad]: Ich hab mich hingekniet und seine Hand gehalten. Die war kalt. Ich wusst nich, was man macht. Man lernt das nich, im Arbeitshaus. Man lernt nur, wie man still is.
tilly[sad]: Er hat was gesagt. Ganz leise. „Es ist bezahlt. Sag’s ihm.“ {+s:s28, reveals:f26}
tilly[sad]: Und ich weiß doch nich, wem. Und was bezahlt. Und dann hat er nix mehr gesagt. Und dann hat er aufgehört.
narr: Die Kerze brennt. Yuumi schnurrt. Sonst nichts.
tilly[sad]: Ich bin raus. Und hab mich auf die Treppe gesetzt. Auf die große. Ich konnt nich mehr gehen. Und ich hab gedacht –
narr: Sie sagt es, und es ist derselbe Satz, dieselbe Stimme, dasselbe kleine Brechen in der Mitte, wie aus dem Glas, wie in der Nacht auf den Stufen.
tilly[sad]: Wenn mich doch nur einer hören tät. {pause:1200, +f:g_tilly_spoke, +c:c30, mood:mystisch}
inner: Da ist es.
inner: Das war sie. Das Flüstern im Glas. Das Weinen neben mir auf der Treppe. Das Klopfen oben. Das war alles sie.
? f:p_said_hear -> heard_a
* [mitfuehlend] Ich hab dich gehört. {tilly+2} -> heard
* [ehrlich] Ich war da, Tilly. Ich hab dich gehört. {tilly+2} -> heard
# heard_a
* [mitfuehlend] „Ich hör dich.“ – Das hab ich damals gesagt. Ich hab dich gehört, Tilly. {tilly+2} -> heard
* [ehrlich] Ich war da, Tilly. Ich hab dich gehört. {tilly+2} -> heard
# heard
narr: Tilly sieht auf. Ihre Augen sind rot und sehr hell im Kerzenlicht.
tilly[surprised]: Das Glöckchen.
tilly[surprised]: Da war ’n Glöckchen, auf der Treppe, direkt neben mir. Ich hab gedacht, das is die Glocke aus dem Wasser, die kommt ihn holen. Ich hab die Schürze übers Gesicht gezogen.
tilly[neutral]: Das warn Sie. Mit der Katze.
* [ehrlich] Ja. Das waren wir. -> yes
* [mitfuehlend] Ich weiß nicht, wie. Aber ja. -> yes
# yes
tilly[neutral]: Dann warn Sie wirklich der Geist.
tilly[warm]: Aber ’n guter.
narr: Aus dem dunklen Flur hinter der Tür kommt ein Geräusch, ein Schlüsselbund, der klirrt, und bricht ab, als hätte jemand die Hand darumgelegt.
narr: Mrs. Pryce steht in der Tür, im Nachthemd, ein Tuch um die Schultern. Wie lange sie schon dort steht, sagt sie nicht.
pryce[sad]: Tilly. Cariad.
narr: Sie kommt herein. Sie setzt sich, und Mrs. Pryce setzt sich nie. Sie zieht Tilly an sich, Haube und Heu und alles, und hält sie fest.
pryce[sad]: Ich hab die Glocke gehört. Ich hab dich gehen hören. Und ich hab mir gesagt, das Kind ist schon auf, Agnes, bleib sitzen. {+s:s26, reveals:f15, +f:g_pryce_confessed}
pryce[sad]: Und wie du zurückkamst und geweint hast, hab ich nicht gefragt. Weil ich’s nicht wissen wollte. Gott vergib mir. Du vergibst mir nicht, und das ist recht.
tilly[sad]: Doch. {pause:500}
tilly[neutral]: Doch, Mrs. Pryce.
narr: Die beiden sitzen da, im Talglicht, und Sera nimmt den Brief, den Tilly ihr hinhält, und steckt ihn in ihr Kleid, ungeöffnet. Er gehört ihr nicht. Er gehört Clara.
tilly[neutral]: Miss. Sie geben ihn ihr. Ja? Morgen. Ich kann nich.
* [mitfuehlend] Wir geben ihn ihr. Zusammen. Du musst nichts sagen. Du musst nur dabei sein. {tilly+1, +f:k4_together} -> end
* [ehrlich] Ja. Ich gebe ihn ihr. {+f:k4_alone} -> end
# end
narr: Später, in ihrer Kammer, sitzt Sera auf der Bettkante und hält den Brief in der Hand, ohne ihn zu öffnen. Er ist leicht. Wie die Platte. {+f:k4_night_done}
-> END

=== k4_night_call
kind: event
when: ch=4 f:k4_found tod=nachmittag,abend
priority: 3
---
narr: Draußen zieht das Gewitter ab. Der Himmel über dem Moor ist blass gewaschen, und zum ersten Mal seit Tagen sieht man einen Stern. {time=abend}
inner: Tilly hat gesagt: heute Nacht, in der Küche, wenn Mrs. Pryce schläft. Bis dahin ist noch Zeit. {+f:k4_evening}

=== k4_to_night
kind: event
when: ch=4 f:k4_evening tod=abend anyk:d14,d15,d17 loc=kammer,dienst,halle
priority: 3
---
narr: Die Lichter im Haus gehen eins nach dem anderen aus. Irgendwo schließt Hobbes die letzte Tür ab, zweimal, wie jeden Abend. {time=nacht}
inner: Jetzt. Die Küche.

=== k4_to_night_b
kind: event
when: ch=4 f:k4_evening tod=abend loc=kammer
priority: 2
---
narr: Die Lichter im Haus gehen eins nach dem anderen aus. Irgendwo schließt Hobbes die letzte Tür ab, zweimal, wie jeden Abend. {time=nacht}
inner: Jetzt. Die Küche.

=== k4_window
kind: scene
when: ch=4 f:k4_night_done loc=kammer
priority: 20
important: yes
---
narr: Die Kerze auf dem Waschtisch. Der Brief an Clara unter dem Kissen. Die Platte in ihrem schwarzen Papier, in der Truhe, zwischen Jeans und Unterröcken. {music:window}
inner: Ich muss es wissen.
narr: Sie wickelt die Platte aus. Hält sie an den Kanten, wie Clara es ihr gezeigt hat. Hebt sie vor die Kerzenflamme.
narr: Die Treppe. Die Lichtspuren. Das Mädchen. Die blasse Frau mit der Katze auf dem Schoß. Das Licht fällt hindurch, warm, zitternd. {mood:mystisch, pause:900}
narr: Und dann, sehr leise, als käme es aus dem Glas selbst, oder von weit her, oder aus ihr –
narr: Ein Ticken. Gleichmäßig. Metallisch. Wie eine Heizung, die mitzählt. {sfx:radiator}
narr: Und darunter ein Brummen, tief und vertraut, das Geräusch eines Kühlschranks in einer Küche, in der niemand ist. {sfx:fridge}
inner: Das ist –
inner: Das ist meine Wohnung.
narr: Sie lässt die Platte sinken. Die Geräusche verschwinden. Nur der Regen, der letzte, und Yuumi, die auf dem Bett sitzt und sie ansieht, mit ihren goldgelben, völlig unbeeindruckten Augen.
inner: Es ist offen. Seit Tilly es gesagt hat. Seit jemand sie gehört hat.
inner: Ich könnte jetzt nach Hause. Einfach so. Die Platte ins Licht halten und zuhören.
narr: Sie sieht zum Fenster. Hinter dem Moor, ganz im Osten, ist der Himmel nicht mehr schwarz, sondern ein sehr tiefes Blau.
inner: Nein. Nicht so. Nicht, bevor Clara ihren Brief hat. Nicht, bevor ich weiß, was in dieser Nacht wirklich passiert ist, von Anfang bis Ende.
inner: Morgen früh kommt der Coroner. Und die Glocke im Wasser, hat Miss Averley gesagt, läutet nur, solange es dunkel ist. Mit dem ersten Licht verstummt sie.
inner: Vielleicht ist das nur eine Sage. Aber vor fünf Tagen war eine Glasplatte für mich auch nur eine Glasplatte.
inner: Ich habe bis zum Morgen. {chap:5, time=nacht, go:halle@0.25}
`;
