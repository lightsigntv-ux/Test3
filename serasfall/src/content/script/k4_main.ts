export default `
=== k4_develop
kind: scene
when: ch=4 loc=dunkel
priority: 20
important: yes
---
narr: In der Dunkelkammer gab es nur das rote Licht der Laterne. Hände und Gesichter sahen darin fremd aus. Die Tür war zu, und Clara hatte ein Tuch in den Spalt darunter gestopft. {music:develop}
clara[neutral]: Er hat eine Tanninplatte genommen. Trockenkollodium. Die brauchen ewig, darum. Eine nasse Platte hätte er nach zehn Minuten entwickeln müssen.
clara[neutral]: Und er hat die Lampe in der Halle brennen lassen, kleingedreht, damit man die Treppe überhaupt sieht. Von Mitternacht bis halb sieben, bis Hobbes den Deckel aufgesetzt hat. Das reicht gerade so für eine Treppe.
narr: Sie legte die Platte in eine flache Schale. Das Glas war milchig, ohne Bild.
clara[neutral]: Pyrogallol und Ammoniak. Halten Sie die Laterne. Höher. Nicht über die Schale – daneben.
narr: Sie goss. Die Flüssigkeit lief in einer glatten Welle über das Glas. Clara bewegte die Schale langsam hin und her. {sfx:liquid}
clara[neutral]: Jetzt nicht reden. Zählen Sie.
* [neutral] (Leise mitzählen.) -> a
* [schweigen] (Die Luft anhalten.) -> a
# a
narr: Eins. Zwei. Zwölf. Dreißig. Wo in der Halle Licht gewesen war, wurde das Glas dunkel. Die Umrisse einer Treppe erschienen, ein Geländer, ein Fenster, dahinter nichts.
narr: Und da waren Spuren. Dünne, unterbrochene Linien zogen über die Stufen. An zwei Stellen gab es helle Flecken, wo ein Licht lange an einem Ort geblieben war.
clara[surprised]: Da ist jemand gegangen. Nein – mehrere.
clara[neutral]: Jetzt fixieren. Die Flasche da. Nein, die mit dem Stopfen. Gut.
narr: Es roch nach Bittermandel. Clara spülte die Platte mit Wasser aus einem Krug ab und hielt sie gegen die Laterne. Dann legte sie ein schwarzes Samttuch dahinter.
clara[neutral]: Vor schwarzem Grund sieht man eine Kollodiumplatte als Positiv. Wie bei einer Ambrotypie. Das hat er mir gezeigt, da war ich vierzehn.
narr: Da war die Treppe, grau auf Schwarz, ganz weich. Blasse Lichtbahnen zogen über die Stufen und den Hallenboden, eine davon breit und gleichmäßig. Oben auf der Galerie, vor einer der Türen, war ein heller Fleck. Unten führte eine kurze Spur von der Dienstbotentür zur Kamera. {+c:c29, +f:g_plate_dev}
narr: Auf der fünften Stufe von unten saß ein Mädchen. Blass und unscharf, aber es war da. Es trug eine Haube und hatte das Gesicht in den Händen, und neben ihm auf der Stufe war ein heller Fleck: eine Kerze.
clara[tense]: Ein Dienstmädchen. Auf der Haupttreppe, mitten in der Nacht. Und sie hat so lange stillgesessen, dass die Platte sie festhält. Zehn Minuten mindestens. {hints:f09}
narr: Neben dem Mädchen war eine zweite Gestalt, noch blasser, kaum zu erkennen. Eine Frau mit hellem Haar saß auf der Stufe und hatte den Kopf zur Seite geneigt. Auf ihrem Schoß war etwas Kleines, Rundes mit zwei spitzen Ohren –
inner: Nein.
inner: Das ist Yuumi. So sitzt sie immer, eine Pfote untergeschlagen. Genau so.
inner: Das ist – {pause:900}
inner: Das bin ich.
clara[neutral]: Eine Doppelbelichtung. Oder ein Fehler in der Schicht. Oder die Platte war nicht neu, und es war schon etwas darauf.
clara[angry]: Er wollte beweisen, dass nichts auf der Treppe wandelt. Und jetzt sitzt da ein Gespenst. Wenn Tante Harriet das sieht, lässt sie es einrahmen.
narr: Sie lachte kurz. Es klang nicht gut, und sie hörte mittendrin auf.
clara[sad]: Sein letztes Experiment. Und es ist missglückt.
* [mitfuehlend] Es ist nicht missglückt. Es hat gesehen, was in der Nacht passiert ist. {clara+1} -> b
* [ehrlich] Ich glaube nicht, dass das ein Fehler in der Schicht ist. -> c
* [schweigen] (Kein Wort herausbringen.) -> d
# b
clara[neutral]: Gesehen. Ja. Das Glas hat es gesehen. Und keiner von uns.
-> e
# c
clara[neutral]: Was dann, Miss Hale? Ein Geist? Sagen Sie das nicht. Nicht Sie auch noch.
-> e
# d
narr: Sera brachte kein Wort heraus. Sie hielt die Laterne ganz ruhig. Nur die Flamme darin flackerte.
# e
clara[neutral]: Wer schnell vorbeigeht, hinterlässt kaum etwas. Nur wo jemand langsam ging oder stehen blieb, hat sich die Flamme eingezeichnet. Die Platte sagt nicht, wer. Nur wo. Und in welcher Reihenfolge, wenn man weiß, wer wann unterwegs war.
clara[neutral]: Die breite hier ist eine Lampe, keine Kerze. Die kurze unten, von der Dienstbotentür zur Kamera, ist Hobbes am Morgen. Da hat er den Deckel aufgesetzt.
narr: Ihr Finger fuhr über das Glas, ohne es zu berühren, und blieb bei einer blassen Bahn stehen. Sie führte von oben zur Tür des Arbeitszimmers hinunter und wieder hinauf.
clara[neutral]: Und diese hier – {pause:500}
? t:clara>=6 -> confess
clara[neutral]: Die bin ich. Um eins. Ich war bei ihm, um gute Nacht zu sagen. Mehr nicht. {hints:f05}
inner: „Mehr nicht.“ Das glaube ich ihr nicht so ganz.
-> f
# confess
clara[sad]: Die bin ich. Um eins war ich bei ihm in der Dunkelkammer. Hier, an diesem Tisch. Wir haben gestritten. {+s:s33, reveals:f05}
clara[sad]: Er hat gesagt, ich soll warten. Ein, zwei Jahre, London gehe im Augenblick nicht. Warum, hat er nicht gesagt. Er hat nie gesagt, warum.
clara[sad]: Und ich habe gesagt, Mama hätte sich für ihn geschämt. Das war das Letzte, was ich zu ihm gesagt habe.
narr: Sie stand ganz still im roten Licht. Dann nahm sie die Platte vom Samt, sehr vorsichtig, nur an den Kanten.
# f
clara[neutral]: Nehmen Sie sie mit, heute Nacht. Ich will sie nicht bei mir im Zimmer haben. Morgen mache ich einen Abzug, wenn es hell genug ist.
narr: Sie wickelte die Platte in schwarzes Papier und gab sie Sera. Die Platte war erstaunlich leicht. {+f:k4_plate_held}
narr: In ihrer Kammer legte Sera die Platte in die Truhe, zu ihrer Jeans und den Socken mit den Avocados. Dann lag sie bis zum Morgengrauen wach. Yuumi schlief tief und fest auf ihren Füßen. {time=morgen, go:kammer@0.5}

=== k4_morning
kind: scene
when: ch=4 loc=kammer tod=morgen
priority: 20
---
narr: Freitag. Der Regen hatte nachgelassen, aber das Licht war gelblich und trüb, und die Luft war schwer. {music:k4}
inner: Ich war da. In der Nacht, in der er gestorben ist, saß ich auf dieser Treppe. Neben einem Mädchen, das geweint hat, und mit Yuumi auf dem Schoß. Ich habe keine Ahnung, wie das gehen soll.
inner: Das Flüstern aus dem Glas. Die Glocke, das Klopfen, das Licht. Das habe ich nicht geträumt. Das war alles hier, auf dieser Treppe.
inner: Okay. Eins nach dem anderen. Wer ist das Mädchen? Clara sagt, ein Dienstmädchen mit einer Talgkerze. Im Moment gibt es im Haus genau zwei Frauen, die Talgkerzen benutzen.
inner: Und eine davon ist dreizehn.

=== t4_tilly_stairs_early
kind: topic
npc: tilly
title: Das Mädchen auf der Treppe
when: ch=4 k:d16 !f:g_tilly_spoke t:tilly<8 tod=morgen,mittag
---
sera: Tilly, ich muss dich was fragen. Wegen der Nacht, in der der Herr gestorben ist.
narr: Tilly ließ den Löffel in den Topf fallen. Er ging unter.
tilly[tense]: Ich hab geschlafen, Miss. Hab ich doch gesagt. Ich hab – {pause:300}
* [direkt] Du warst auf der Treppe. Ich weiß das. {tilly-2} -> a
* [mitfuehlend] Schon gut. Nicht jetzt. Später, wenn du magst. Ich bin da. {tilly+1} -> b
# a
tilly[angry]: Nein! War ich nich! Sie sind genau wie alle andern!
narr: Sie rannte ohne Umhang zur Hoftür hinaus. Mrs. Pryce stemmte die Hände in die Hüften und sah Sera an.
pryce[angry]: Was haben Sie zu ihr gesagt, Miss? {pryce-1}
inner: Mist. Das war zu früh. Viel zu früh.
-> END
# b
tilly[neutral]: Später, Miss.
narr: Sie fischte den Löffel mit den Fingern aus dem Topf, verbrannte sich und sagte nichts dazu.

=== k4_post_call
kind: event
when: ch=4 k:d16 tod=morgen
priority: 5
---
narr: Draußen rief jemand lang gezogen über das Wasser, und eine Glocke bimmelte. Ein Boot mit einer Laterne am Bug kam über die überfluteten Weiden. Darin saß ein Mann in gelbem Ölzeug. {sfx:bellBoat, time=mittag}
inner: Die Post. Ob auf den Briefmarken die junge Queen Victoria ist? Auf den Marken ist sie ja nie älter geworden … egal. Ausgerechnet heute.
narr: Wenig später ging Hobbes mit einem Tablett voller Briefe durch die Halle. Dann hörte man die Tür zum Salon. {+f:g_post_arrived}

=== k4_post
kind: scene
when: ch=4 loc=salon f:g_post_arrived
priority: 20
important: yes
---
narr: Miss Averley saß am Fenster, auf dem Schoß einen Stapel Briefe, die noch vor dem Hochwasser abgeschickt worden waren. Rechnungen. Eine Zeitschrift der Meteorologischen Gesellschaft. Ein Brief an Edmund Averley, Esq., den niemand mehr öffnen würde. Und einer an sie, auf dickem cremefarbenem Papier, mit gedrucktem Absender. {music:tension}
harriet[neutral]: Mrs. Crewe’s Agentur für Damen in Stellung. Oxford Street.
narr: Sie öffnete ihn mit dem silbernen Brieföffner und las. Dann las sie noch einmal. Schließlich legte sie den Brief auf den Schoß, strich ihn mit der flachen Hand glatt und sah Sera an. {+c:c31, +f:g_agency}
harriet[neutral]: Miss Sarah Hale bedauert zutiefst. Sie liegt seit Montag mit Influenza bei ihrer Schwester in Bristol. Sie kann ihre Stellung frühestens zu Weihnachten antreten. {reveals:f22}
harriet[neutral]: Wer sind dann Sie, Miss Hale?
inner: Da ist sie. Die Frage, vor der ich seit Mittwoch Angst habe.
? t:penrose>=6 f:k1_library_done -> penrose
-> choose
# penrose
narr: Die Tür ging auf, und Mrs. Penrose kam herein. Genau im richtigen Moment. Sera fragte sich, wie lange sie schon vor der Tür gestanden hatte.
penrose[neutral]: Miss Averley. Ich muss Ihnen leider etwas gestehen.
penrose[neutral]: Ich habe Mrs. Crewe um eine Vertretung gebeten, als ich hörte, dass Miss Hale krank ist. Eine Bekannte aus Bath. Ich wollte Sie nicht beunruhigen. Das war anmaßend, ich weiß.
harriet[surprised]: Sie – Sie haben –
penrose[neutral]: Ja, das habe ich. Ob Sie mir verzeihen, liegt bei Ihnen. {+f:k4_cover_penrose}
harriet[neutral]: … Darüber sprechen wir später, Mrs. Penrose.
narr: Mrs. Penrose nickte und ging. An der Tür drehte sie sich nicht um. Nur ihre linke Hand machte eine kleine Bewegung nach unten, wie ein Theatervorhang, der fällt.
harriet[neutral]: Ich glaube ihr kein Wort. Aber ich glaube, dass sie es für Sie gesagt hat. Und das finde ich beinahe interessanter.
harriet[neutral]: Sie haben am ersten Morgen einen Namen gesagt. Ich habe Sarah verstanden, weil ich Sarah erwartet habe. Wie lautete er?
sera: Sera.
harriet[neutral]: Sera. Gut. Mehr möchte ich heute nicht wissen. {+f:k4_named}
-> after
# choose
* [ehrlich] Ich bin nicht Miss Hale. Ich heiße Sera. Ich bin hier hereingeraten, ohne es zu wollen. Und ich bin geblieben, weil ich gebraucht wurde. {+f:k4_cover_truth} -> truth
* [luege] Die Agentur hat mich als Vertretung geschickt. Offenbar hat man Ihnen nicht geschrieben. {+f:k4_cover_lie} -> lie
* [schweigen] (Schweigen und sie ansehen.) -> silent
# truth
? t:harriet>=5 -> truth_ok
harriet[angry]: Hereingeraten. In ein Haus, das ringsum von Wasser umgeben ist. {harriet-1}
harriet[neutral]: Sie werden mir das erklären, Miss – Sera. Nicht heute. Heute habe ich einen Bruder zu begraben, sobald man es mir erlaubt.
-> after
# truth_ok
narr: Miss Averley sah sie lange an. Dann faltete sie den Brief zweimal und legte ihn auf den Stapel.
harriet[neutral]: Sie haben damals Sera gesagt. Ich habe Sarah verstanden, weil ich Sarah hören wollte. {+f:k4_named}
harriet[neutral]: Sie haben am Mittwoch Tee und Toast für mich bestellt, als ich selbst dazu nicht imstande war. Sie haben geholfen, ihn zu waschen. Sie haben mich zu Lucinda gebracht.
harriet[neutral]: Wer Sie sind, ist mir nicht bekannt. Aber was Sie getan haben, habe ich gesehen. Bleiben Sie. Bis Samstag. Ich werde Sie weiter Miss Hale nennen. Das Haus braucht jetzt Ordnung, nicht die Wahrheit. {harriet+1}
-> after
# lie
? sus<5 -> lie_ok
harriet[tense]: Man hat mir nicht geschrieben. Man schreibt immer, Miss Hale. Oder wie auch immer Sie heißen.
harriet[neutral]: Sie schälen Kartoffeln. Sie können nicht knicksen. Sie verlangen Kaffee. Und Sie gehen nicht zur Kirche. {harriet-2}
harriet[neutral]: Ich habe keine Kraft mehr für noch eine Lüge in diesem Haus. Gehen Sie mir aus den Augen, bis ich Sie rufen lasse.
inner: Autsch. Das hat gesessen. Aber sie hat ja recht.
-> after
# lie_ok
harriet[neutral]: Man hat mir nicht geschrieben. Vermutlich wegen des Wassers. {pause:400}
harriet[neutral]: Sie sind eine sonderbare Vertretung, Miss Hale. Aber Sie sind hier, und die andere ist es nicht. {sus+1}
-> after
# silent
narr: Die Standuhr stand still. Draußen fiel ein Tropfen von der Dachrinne, dann noch einer.
harriet[neutral]: Sie sagen nichts. Das ist entweder sehr klug, oder Sie haben etwas zu verbergen. {pause:500}
harriet[neutral]: Für beides fehlt mir die Kraft. Bleiben Sie, bis das Wasser fällt. Dann gehen Sie dorthin, wo Sie hingehören.
# after
narr: Hobbes erschien in der Tür. Der Postbote habe etwas ausrichten lassen: Der Coroner, Mr. Harding aus Bridgwater, und Dr. Bell kämen mit dem fallenden Wasser, spätestens Samstag in der Frühe.
hobbes[neutral]: Der Coroner benötigt Geschworene aus dem Dorf, Madam. Zwölf Männer passen nicht in einen Postkahn.
harriet[neutral]: Also morgen früh. Dann wird es amtlich. {+f:k4_post_done}

=== k4_lost
kind: event
when: ch=4 f:k4_post_done !f:k4_found !f:g_yuumi_lost
priority: 6
---
narr: Das Licht wurde gelb, dann grünlich, dann fast schwarz. Über dem Moor donnerte es so tief, dass die Fensterscheiben summten. {sfx:thunder, time=nachmittag}
inner: Yuumi hasst Gewitter. Beim ersten Donner verkriecht sie sich immer, irgendwo ganz hinten. Wo ist –
inner: Wo ist Yuumi? Oh nein. Wenn ihr hier was passiert, wie soll ich das Fritz sagen? {+f:g_yuumi_lost, music:worry}

=== k4_lost_kitchen
kind: scene
when: ch=4 f:g_yuumi_lost loc=dienst !f:k4_found
priority: 20
---
tilly[tense]: Miss! Die Katze! Die is raus, wie Dunning mit der Post reinkam! Durch die Hoftür, zack, weg war sie. Ich hab noch gerufen –
pryce[neutral]: Bei dem Wetter? Die kommt schon wieder, wenn sie Hunger kriegt. Katzen sind nicht dumm, na?
tilly[tense]: Die kennt sich hier doch gar nich aus! Die weiß nich, wo die Gräben sind!
narr: Tilly war schon an der Hoftür und zog sich im Laufen den Umhang über die Schultern. {+f:k4_search}

=== k4_found
kind: scene
when: ch=4 f:g_yuumi_lost loc=stall
priority: 20
important: yes
---
narr: Im Hof rauschte der Regen. Er schlug quer über die Pflastersteine, und der Braune wieherte in seiner Box. Ein Blitz – für einen Augenblick war alles weiß, das Wasser, die Weiden, das Boot. {sfx:thunder}
narr: Dann war es kurz still, und von oben kam ein feines Klingeln. Ein Glöckchen. {sfx:bellFar}
tilly[surprised]: Da! Da oben, auf dem Heuboden!
narr: Der Leiter zum Heuboden fehlten drei Sprossen. Und das Kleid war noch für eine Krinoline geschnitten, für Salons in den Sechzigern und nicht für Leitern, dachte Sera. Sie griff zu und rutschte ab. Mrs. Pryces schwarze Farbe hielt nicht und lief ihr in grauen Streifen über die Handgelenke.
tilly[neutral]: Lassen Sie mich. Ich bin leicht, Miss.
* [mitfuehlend] Pass bitte auf dich auf. {tilly+1} -> a
* [direkt] Nein, ich – na gut. Ich halte die Leiter. {tilly+1} -> a
# a
narr: Tilly kletterte barfuß hinauf. Die Schuhe hatte sie unten stehen lassen und die Röcke in den Bund gestopft. Oben verschwand sie im Dunkeln.
tilly[warm]: Komm, Grauchen. Komm her zu mir. Is doch nur Donner. Der tut nix. Der schreit bloß.
narr: Eine lange Minute verging. Es donnerte. Dann tauchte Tillys Gesicht in der Luke auf, voller Heu, und in ihren Armen ein nasses, graues, sehr empörtes Bündel. {sfx:meowAngry}
yuumi: (Yuumi fauchte den Donner an und das Heu und den Regen. Dann sah sie Sera, und das Fauchen wurde zu einem kleinen, kläglichen Miauen.) {sfx:meow}
narr: Tilly reichte sie hinunter. Sera drückte sie an sich. Yuumi krallte sich in das schwarze Kleid und ließ nicht mehr los. {-f:g_yuumi_lost, +f:k4_found}
narr: Tilly kam die Leiter herunter und setzte sich außer Atem ins Stroh. Sera setzte sich neben sie. Draußen donnerte es noch, aber weiter weg.
tilly[neutral]: Die hatte Angst. Die hat sich ins Heu gewühlt, ganz hinten, wo’s trocken is. Das hab ich auch mal gemacht. Im Arbeitshaus, im Holzschuppen.
tilly[sad]: Wenn man Angst hat, versteckt man sich. Und dann hofft man, dass einer kommt. Und dann kommt keiner. Und irgendwann hofft man, dass keiner kommt.
* [mitfuehlend] Heute ist jemand gekommen. Du. {tilly+2} -> b
* [ehrlich] Danke, Tilly. Allein hätte ich sie nie gefunden. {tilly+2} -> c
# b
tilly[surprised]: Ich?
tilly[neutral]: Ja. Ich war das. {pause:500}
-> d
# c
tilly[warm]: Gefunden hätten Sie sie schon. Sie wärn bloß nich raufgekommen mit dem Rock.
# d
narr: Tilly streckte die Hand aus. Yuumi roch daran und stieß dann den Kopf gegen Tillys Finger, einmal, zweimal. Tilly lachte und schluchzte dabei fast.
tilly[sad]: Miss. Wenn ich – wenn einer was weiß. Was Schlimmes. Und er sagt’s nich, weil er Angst hat. Is das auch schlimm?
* [mitfuehlend] Angst haben ist nicht schlimm. Schlimm ist nur, wenn man damit allein bleibt. {tilly+1} -> e
* [ehrlich] Ich glaube, es kommt drauf an, wem man es sagt. {tilly+1} -> e
# e
tilly[neutral]: Hm.
narr: Sie stand auf, zupfte sich Heu aus der Haube und sah zur Hoftür.
tilly[neutral]: Heut Nacht. In der Küche. Wenn Mrs. Pryce schläft.
narr: Dann war sie weg, barfuß über die Pflastersteine, die Schuhe in der Hand.

=== k4_paws
kind: scene
when: ch=4 f:k4_found loc=kammer
priority: 20
---
narr: In ihrer Kammer rubbelte Sera Yuumi mit einem Handtuch trocken. Yuumi fand das eine Frechheit und schnurrte trotzdem. {music:quiet, sfx:purr}
narr: Beim Hinsetzen zog Yuumi die linke Vorderpfote hoch.
inner: Du humpelst ja. Zeig mal her, Süße –
narr: Es klopfte. Bevor Sera antworten konnte, stand Clara schon in der Tür, einen Stapel Wetterbücher unter dem Arm.
clara[neutral]: Tilly sagt, Ihre Katze war im Gewitter auf dem Heuboden. Tilly sagt es der ganzen Küche. Tilly ist sehr stolz.
clara[neutral]: Sie humpelt. Links vorn.
narr: Clara legte die Bücher ab und kniete sich hin, ohne auf ihr Kleid zu achten. Sie nahm die Pfote in ihre Hand mit den schwarzen Fingerspitzen.
clara[neutral]: Felis catus. Mit Glöckchen. Sie wollen wohl, dass die Vögel gewarnt sind.
narr: Mit zwei Fingern zog sie einen Holzsplitter aus dem Ballen. Es ging so schnell, dass Yuumi erst hinterher protestierte.
clara[neutral]: Ein Splitter von der Leiter. Sie wird es überleben. Das war die erste Operation meines Lebens, Miss Hale. Die Patientin hat nach mir geschnappt, aber nur der Form halber.
* [humor] Sie wird sich bei der Royal Free beschweren. {clara+1} -> a
* [mitfuehlend] Sie haben wirklich ruhige Hände. {clara+1} -> b
# a
clara[warm]: Man wird ihr nicht glauben. Sie ist eine Frau.
-> c
# b
clara[neutral]: Das hat er auch immer gesagt.
# c
narr: Sie stand auf und nahm die Bücher. An der Tür blieb sie kurz stehen und öffnete den Mund. Dann ging sie doch.

=== k4_tilly
kind: scene
when: ch=4 f:k4_found loc=dienst tod=nacht !f:g_tilly_spoke
priority: 20
important: yes
repeat: yes
---
narr: Die Küche war dunkel. Nur die Glut im Herd leuchtete, und auf dem Tisch brannte eine Talgkerze. Tilly saß davor, die Knie angezogen, eine verbeulte Blechdose in den Händen. {music:truth}
narr: Yuumi sprang auf die Bank neben sie. Tilly legte ihr eine Hand auf den Rücken, ohne hinzusehen.
tilly[neutral]: Ich dacht, Sie schlafen schon.
sera: Hab ich versucht.
tilly[sad]: Ich auch. Seit Dienstag.
narr: Die Kerze tropfte. Der gelbe Talg roch nach Hammel.
tilly[tense]: Miss. Bevor ich was sag. Sie müssen mir was sagen. Was Wahres. Von Ihnen. Weil – weil wenn ich was sag, dann gehört das Ihnen. Und dann muss ich auch was von Ihnen haben. Sonst is das nich gerecht.
* [ehrlich] Ich bin nicht Miss Hale. Ich komme von ganz weit weg. So weit, dass ich nicht mal weiß, wie ich wieder nach Hause komme. {tilly+2, +f:k4_honest} -> honest
* [ehrlich] Ich hab Angst, Tilly. Die ganze Zeit schon, seit ich hier bin. Ich tu nur so, als wüsste ich, was ich mache. {tilly+2, +f:k4_honest} -> honest
* [ausweichend] Du musst mir nichts sagen, wenn du nicht willst. {tilly-1} -> dodge
# dodge
tilly[sad]: Dann sag ich nix.
narr: Sie blies die Kerze nicht aus. Aber sie drehte sich zum Herd, und die Blechdose verschwand unter ihrer Schürze.
inner: Sie wollte was Ehrliches von mir hören. Und ich war nur höflich. Mist. {do:hint_tilly}
-> END
# honest
tilly[neutral]: Hab ich mir gedacht. {pause:500}
tilly[neutral]: Das mit dem Weit-weg. Und das mit der Angst.
? t:tilly<6 -> hurt
-> open
# hurt
tilly[sad]: Sie warn nich immer nett zu mir, Miss. Sie haben gedrängelt. Da is man vorsichtig.
tilly[neutral]: Aber Sie sind gekommen. Heut Nacht. Das zählt auch. {tilly+2}
# open
narr: Sie öffnete die Blechdose. Darin lagen ein Knopf, ein Stück rotes Band, ein glatter grauer Stein und ein welkes Rosenblatt. Und ein Brief, zweimal gefaltet, mit einem kleinen schwarzen Fingerabdruck am Rand. Kohle.
tilly[sad]: Den hat mir der Herr gegeben. In der Nacht.
tilly[sad]: Die Glocke vom Arbeitszimmer hat geläutet. Ich schlaf ja in der Küche, beim Herd. Bei Mrs. Pryce war noch Licht, aber die kam nich. Also bin ich hin. {+s:s27, reveals:f08|f09|f10}
tilly[sad]: Der Herr saß am Schreibtisch, ganz grau im Gesicht. Und er hat mir das hier gegeben. „Für Miss Clara. Nur für sie. Hol sie. Schnell, Kind.“
tilly[tense]: Und ich bin die große Treppe rauf. Die darf ich nich, nie, aber die is schneller. Und ich hab an Miss Claras Tür geklopft. Ich hab so lang geklopft. Und keiner hat aufgemacht.
tilly[sad]: Und ich hab mich nich getraut, reinzugehen. Und Miss Averley wecken hab ich mich auch nich getraut. Also bin ich wieder runter zum Herrn, um zu sagen, dass keiner aufmacht.
tilly[sad]: Und da lag er. Vor dem Kamin. Er hat noch gelebt.
narr: Ihre Stimme wurde ganz dünn. {pause:800}
tilly[sad]: Ich hab mich hingekniet und seine Hand gehalten. Die war kalt. Ich wusst nich, was man macht. Im Arbeitshaus lernt man so was nich. Da lernt man bloß, still zu sein.
tilly[sad]: Er hat was gesagt. Ganz leise. „Es ist bezahlt. Sag’s ihm.“ {+s:s28, reveals:f26}
tilly[sad]: Und ich weiß doch nich, wem. Und was bezahlt. Und dann hat er nix mehr gesagt. Und dann hat er aufgehört.
narr: Die Kerze brannte. Yuumi schnurrte. Sonst war nichts zu hören.
tilly[sad]: Ich bin raus. Und hab mich auf die Treppe gesetzt. Auf die große. Ich konnt nich mehr gehen. Und ich hab gedacht –
narr: Dann sagte sie es. Es war derselbe Satz wie aus dem Glas, mit derselben Stimme, die in der Mitte ein bisschen brach.
tilly[sad]: Wenn mich doch nur einer hören tät. {pause:1200, +f:g_tilly_spoke, +c:c30, mood:mystisch}
inner: Das ist er. Der Satz.
inner: Das war Tilly. Das Flüstern im Glas, das Weinen neben mir auf der Treppe, das Klopfen oben. Das war alles Tilly.
? f:p_said_hear -> heard_a
* [mitfuehlend] Ich hab dich gehört. {tilly+2} -> heard
* [ehrlich] Ich war da, Tilly. Ich hab dich gehört. {tilly+2} -> heard
# heard_a
* [mitfuehlend] „Ich hör dich.“ – Das hab ich damals gesagt. Ich hab dich wirklich gehört, Tilly. {tilly+2} -> heard
* [ehrlich] Ich war da, Tilly. Ich hab dich gehört. {tilly+2} -> heard
# heard
narr: Tilly sah auf. Ihre Augen waren rot und glänzten im Kerzenlicht.
tilly[surprised]: Das Glöckchen.
tilly[surprised]: Da war ’n Glöckchen, auf der Treppe, direkt neben mir. Ich hab gedacht, das is die Glocke aus dem Wasser, die kommt ihn holen. Da hab ich mir die Schürze übers Gesicht gezogen.
tilly[neutral]: Das warn Sie. Mit der Katze.
* [ehrlich] Ja. Das waren wir. -> yes
* [mitfuehlend] Ich weiß nicht, wie. Aber ja. -> yes
# yes
tilly[neutral]: Dann warn Sie ja wirklich der Geist.
tilly[warm]: Aber ’n guter.
narr: Aus dem dunklen Flur hinter der Tür kam ein leises Klirren von Schlüsseln. Es hörte sofort wieder auf.
narr: Mrs. Pryce stand in der Tür, im Nachthemd, ein Tuch um die Schultern. Wie lange sie schon dort stand, sagte sie nicht.
pryce[sad]: Tilly. Cariad.
narr: Sie kam herein und setzte sich auf Tillys Bank. Dort hatte sie noch nie gesessen. Sie zog Tilly an sich, mit Haube und Heu und allem, und hielt sie fest.
pryce[sad]: Ich hab die Glocke gehört. Ich hab dich gehen hören. Und ich hab mir gesagt: Das Kind ist schon auf, Agnes, bleib sitzen. {+s:s26, reveals:f15, +f:g_pryce_confessed}
pryce[sad]: Und wie du zurückkamst und geweint hast, hab ich nicht gefragt. Weil ich’s nicht wissen wollte. Gott vergib mir. Du vergibst mir nicht, und das ist auch recht so.
tilly[sad]: Doch. {pause:500}
tilly[neutral]: Doch, Mrs. Pryce.
narr: Die beiden saßen im Kerzenlicht da. Tilly hielt Sera den Brief hin, und Sera steckte ihn ungeöffnet in ihr Kleid. Er war für Clara, nicht für sie.
tilly[neutral]: Miss. Sie geben ihn ihr. Ja? Morgen. Ich kann nich.
* [mitfuehlend] Wir geben ihn ihr. Zusammen. Du musst nichts sagen. Du musst nur dabei sein. {tilly+1, +f:k4_together} -> end
* [ehrlich] Ja. Ich geb ihn ihr. {+f:k4_alone} -> end
# end
narr: Später saß Sera in ihrer Kammer auf der Bettkante. Sie hielt den Brief in der Hand und öffnete ihn nicht. {+f:k4_night_done}
-> END

=== k4_night_call
kind: event
when: ch=4 f:k4_found tod=nachmittag,abend
priority: 3
---
narr: Draußen zog das Gewitter ab. Der Himmel über dem Moor wurde klar, und zum ersten Mal seit Tagen sah man einen Stern. {time=abend}
inner: Tilly hat gesagt: heute Nacht, in der Küche, wenn Mrs. Pryce schläft. Bis dahin ist noch Zeit. Ich könnte ja noch … was wollte ich gerade? Ach ja. Warten. {+f:k4_evening}

=== k4_to_night
kind: event
when: ch=4 f:k4_evening tod=abend anyk:d14,d15,d17 loc=kammer,dienst,halle
priority: 3
---
narr: Im Haus gingen die Lichter eins nach dem anderen aus. Irgendwo schloss Hobbes die letzte Tür ab, zweimal, wie jeden Abend. {time=nacht}
inner: Okay. Jetzt. Ab in die Küche.

=== k4_to_night_b
kind: event
when: ch=4 f:k4_evening tod=abend loc=kammer
priority: 2
---
narr: Im Haus gingen die Lichter eins nach dem anderen aus. Irgendwo schloss Hobbes die letzte Tür ab, zweimal, wie jeden Abend. {time=nacht}
inner: Okay. Jetzt. Ab in die Küche.

=== k4_window
kind: scene
when: ch=4 f:k4_night_done loc=kammer
priority: 20
important: yes
---
narr: Die Kerze stand auf dem Waschtisch. Der Brief an Clara lag unter dem Kissen, die Platte in ihrem schwarzen Papier in der Truhe, zwischen Jeans und Unterröcken. {music:window}
inner: Ich muss es einfach wissen.
narr: Sie wickelte die Platte aus und hielt sie an den Kanten, so wie Clara es ihr gezeigt hatte. Dann hob sie sie vor die Kerzenflamme.
narr: Sie sah die Treppe, die Lichtspuren, das Mädchen und die blasse Frau mit der Katze auf dem Schoß. Das Kerzenlicht fiel hindurch und flackerte. {mood:mystisch, pause:900}
narr: Dann hörte sie etwas. Sehr leise. Es kam aus dem Glas, oder von weit weg –
narr: Ein Ticken. Gleichmäßig und metallisch. Sera kannte dieses Ticken. {sfx:radiator}
narr: Und darunter ein tiefes, vertrautes Brummen. Ein Kühlschrank in einer leeren Küche. {sfx:fridge}
inner: Das ist –
inner: Das ist meine Wohnung.
narr: Sie ließ die Platte sinken, und die Geräusche waren weg. Nur der letzte Regen war noch zu hören. Yuumi saß auf dem Bett und sah sie mit ihren goldgelben Augen an, völlig unbeeindruckt.
inner: Es ist offen. Seit Tilly den Satz gesagt hat und jemand ihr zugehört hat.
inner: Ich könnte jetzt nach Hause. Zu Fritz. Einfach die Platte ins Licht halten und zuhören.
narr: Sie sah zum Fenster. Über dem Moor war es schwarz, nur ein einzelner Stern stand am Himmel.
inner: Nein. Nicht so. Erst muss Clara ihren Brief haben. Und ich will wissen, was in dieser Nacht wirklich passiert ist, von Anfang bis Ende.
inner: Morgen früh kommt der Coroner. Und Miss Averley hat gesagt, die Glocke im Wasser läutet nur, solange es dunkel ist. Beim ersten Licht hört sie auf.
inner: Vielleicht ist das nur eine Sage. Hume würde sagen: ganz sicher. Aber vor drei Tagen hätte ich auch nicht geglaubt, dass man durch eine Glasplatte in ein anderes Jahrhundert fällt.
inner: Ich habe Zeit bis zum Morgen. {chap:5, time=nacht, go:halle@0.25}
`;
