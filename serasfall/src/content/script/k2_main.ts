export default `
=== k2_laying
kind: scene
when: ch=2 loc=toten
priority: 20
important: yes
---
narr: Im Zimmer des Herrn riecht es nach Kampfer, Lavendelwasser und kaltem Kerzenwachs. Das Bett ist frisch bezogen. Auf dem Nachttisch stehen eine Schüssel mit warmem Wasser, Tücher, ein Rasiermesser, eine Schere. {music:laying}
narr: Edmund Averley liegt auf dem Laken, zugedeckt bis zur Brust. Sein Gesicht ist grau und sehr ruhig, und etwas daran sieht erstaunt aus.
narr: Miss Averley steht am Fußende. Mrs. Pryce hat die Ärmel hochgekrempelt. Miss Clara steht am Fenster, mit dem Rücken zu allen.
harriet[neutral]: Wir beginnen mit dem Gesicht. So hat es Mutter –
narr: Sie nimmt ein Tuch aus der Schüssel. Das Wasser tropft auf das Laken. Sie hebt die Hand, und die Hand bleibt in der Luft stehen. {pause:900}
harriet[tense]: Mrs. Pryce. Sie machen das.
narr: Sie legt das Tuch auf den Rand der Schüssel, sehr ordentlich, und geht hinaus, ohne die Tür hinter sich zu schließen. {sfx:door}
pryce[neutral]: Na. {pause:400}
pryce[neutral]: Miss Hale, die Schüssel. Miss Clara, Sie müssen nicht bleiben.
clara[neutral]: Ich bleibe.
pryce[neutral]: Haben Sie schon mal einen Toten gewaschen, Miss?
* [ehrlich] Nein. Noch nie. {pryce+1} -> a
* [luege] Doch, natürlich. {sus+1} -> b
# a
pryce[neutral]: Dann lernen Sie’s heute. Das erste Mal ist das schwerste. Danach ist es nur noch traurig.
-> c
# b
narr: Sera nimmt das Tuch, und ihre Hände wissen nicht, wo sie anfangen sollen. Mrs. Pryce sieht es.
pryce[neutral]: Natürlich. Dann fangen Sie doch mit dem Gesicht an. Wie Sie’s gewohnt sind.
inner: Sie weiß, dass ich gelogen habe. Und sie lässt mich trotzdem helfen.
# c
narr: Sie waschen ihn, Stück für Stück, wie man etwas Zerbrechliches reinigt. Mrs. Pryce singt dabei halblaut, in einer Sprache, die nicht Englisch ist.
narr: An der linken Schläfe, unter dem grauen Haar: eine Schürfung, bläulich verfärbt, mit einem feinen Rand. {+c:c04}
inner: Das ist nicht vom Sessel.
pryce[neutral]: Wir müssen ihn umdrehen, für das Hemd. Miss Hale, die Schultern. Auf drei.
narr: Als sie ihn auf die Seite rollen, sieht Sera die linke Flanke. Große dunkle, fast violette Flecken, über die Schulter und die linke Seite verteilt, wie Schatten unter der Haut, mit weißen Stellen dazwischen, wo er auf etwas Hartem gelegen haben muss.
narr: Miss Clara ist vom Fenster herübergekommen. Sie sieht die Flecken an. Sehr lange. {+c:c06}
clara[tense]: Totenflecken.
clara[neutral]: Das Blut sinkt nach dem Tod dorthin, wo der Körper am tiefsten liegt. Immer nach unten. Blut ist nicht sentimental.
clara[tense]: Er hat nach Hobbes drei Stunden im Sessel gesessen. Dann müssten sie in den Beinen sein, im Becken. Da ist fast nichts. Er hat vorher Stunden auf der linken Seite gelegen, auf etwas Hartem. Auf dem Boden. {+s:s18, reveals:f14, +f:g_body_laid}
pryce[tense]: Mr. Hobbes wird sich geirrt haben, Miss Clara. In dem Schrecken. {hints:f14}
clara[angry]: Hobbes irrt sich nicht. Hobbes hat noch nie in seinem Leben ein Salzfass an den falschen Platz gestellt.
narr: Die Stille danach ist so vollständig, dass man die Kerzen hört.
* [mitfuehlend] Wir können später darüber reden. Jetzt ist er dran. {clara+1, pryce+1} -> d
* [direkt] Dann hat jemand ihn nach seinem Tod in den Sessel gesetzt. {clara+1} -> e
* [schweigen] (Das Hemd glatt streichen und nichts sagen.) {pryce+1} -> d
# e
clara[neutral]: Ja. {pause:400}
clara[tense]: Nicht vor meiner Tante. Nicht heute.
# d
narr: Sie kleiden ihn in ein weißes Hemd und seinen besten schwarzen Rock. Mrs. Pryce bindet ihm ein Tuch unter das Kinn, damit der Mund geschlossen bleibt, und legt zwei Pennys auf seine Lider.
narr: Miss Clara nimmt die Miniatur, klappt sie auf und legt sie in die gefalteten Hände ihres Vaters. Ihre Finger mit den schwarzen Kuppen sind vollkommen ruhig. Nur ihr Atem nicht.
clara[neutral]: Miss Hale. Kommen Sie mit. Ich möchte Ihnen etwas zeigen. {+f:k2_laid, go:dunkel@0.3}

=== k2_dark
kind: scene
when: ch=2 loc=dunkel f:g_body_laid
priority: 20
---
narr: Clara schließt die Tür der Dunkelkammer auf. Ein schmaler Raum ohne Fenster, Regale mit Flaschen, Schalen, Glasplatten in Holzkästen. Sie zündet eine Laterne mit rotem Glas an, und alles wird rot und still. {music:dark}
clara[neutral]: Sie haben den Geruch bemerkt. Heute früh im Arbeitszimmer. Mein Bruder hat es jedem erzählt, der nicht schnell genug weglief.
narr: Sie nimmt eine braune Flasche vom Tisch, deren Stopfen daneben liegt, und hält sie ins rote Licht.
clara[neutral]: Das ist kein Gift. Das ist Fixierbad. Kaliumcyanid in Wasser. Man braucht es, damit das Bild auf der Platte bleibt und nicht schwarz wird. Der Geruch zieht durch jede Tür. {+s:s13, reveals:f19, +c:c12}
clara[tense]: Wenn Sie daran riechen wollen – tun Sie es nicht.
clara[neutral]: Er hat die Flasche offen gelassen. Das hat er nie getan. Nie.
* [direkt] Wann waren Sie zuletzt hier drin? -> a
* [mitfuehlend] Sie haben oft mit ihm hier gearbeitet, oder? {clara+1} -> b
# a
clara[tense]: Das geht Sie nichts an.
clara[neutral]: … Gestern. Am Nachmittag. Da war sie zu.
-> c
# b
clara[neutral]: Seit ich vierzehn war. Tante Harriet hält es für ein Steckenpferd. Er hat mir beigebracht, wie man Licht auf Glas festhält.
narr: Sie zieht einen Holzkasten heraus. „C. mit Kamera, 1874.“ Sie öffnet ihn nicht.
clara[sad]: Mit mir reden hat er nie gelernt.
# c
? seen:pr_hobbes_c03 -> told
? k:c03 -> ask
-> after
# told
clara[neutral]: Sie haben die Uhr gefunden. Hobbes hat es mir erzählt. Er erzählt mir alles, außer dem, was wichtig ist.
-> watch
# ask
clara[neutral]: Sie sehen aus wie jemand, der etwas gefunden hat, Miss Hale. Heute früh, im Arbeitszimmer.
# watch
* [ehrlich] Sie steht auf 2.39. Das Glas ist gesprungen. {clara+1} -> w
* [ausweichend] Ja. Unter dem Bücherschrank. -> w
# w
clara[neutral]: 2.39. Und die Schürfung an der Schläfe. Und das Kamingitter. {hints:f14}
clara[neutral]: Er ist gestürzt. Er stand auf, sein Herz – er stürzte und schlug mit dem Kopf auf, und die Uhr flog unter den Schrank. Und dann hat er dort gelegen. Bis Hobbes kam.
narr: Sie sagt es wie einen Sektionsbefund. Ihre Stimme bricht nicht. Sie wird nur immer leiser.
# after
clara[neutral]: Ich war um – {pause:600, hints:f05}
narr: Sie setzt die Flasche ab, zu hart. Das Glas klirrt.
clara[neutral]: Ich war nicht hier. Das wollte ich sagen.
inner: Das wollte sie nicht sagen.
clara[neutral]: Sie dürfen hier hinein, wann Sie wollen, Miss Hale. Er hätte es erlaubt. Er hat jedem erlaubt, Dinge anzusehen. Nur nicht, ihn anzusehen. {+f:g_dunkel_open, clara+1}

=== k2_pantry_free
kind: event
when: ch=2 tod=nachmittag seen:ex_k_butler_voices loc=halle,salon,arbeit,dunkel,biblio,galerie,toten,kammer !f:k2_listened !f:k2_pantry_free
priority: 4
---
narr: Die Tür der Butlerkammer geht auf. Hobbes kommt heraus, sehr gerade, sehr langsam, und hinter ihm Mrs. Pryce mit einem Tiegel in der Hand. Es riecht bis in die Halle nach Kampfer. {+f:k2_pantry_free}
inner: Er geht, als hätte er heute Morgen einen Sack Kohlen getragen. Und sie sieht ihm nach, als wüsste sie, was für einen. {+c:c09}

=== k2_dusk
kind: event
when: ch=2 seen:k2_dark k:d05 anyf:k2_listened,k2_pantry_free anyk:c08,c14,c24 tod=nachmittag
priority: 5
---
narr: Draußen ist es dunkel geworden, ohne dass es je richtig hell war. Irgendwo im Haus schlägt Hobbes einen kleinen Gong. {sfx:gong, time=abend}
inner: Kaltes Abendessen im Salon, hat Mrs. Pryce gesagt. „Warm kocht man, wenn einer essen will. Heut will keiner.“

=== k2_evening
kind: scene
when: ch=2 loc=salon tod=abend
priority: 20
important: yes
---
narr: Im Salon ist ein Tisch mit kaltem Braten, Brot und eingelegten Walnüssen gedeckt, den niemand anrührt. Miss Averley sitzt aufrecht. Der Captain steht am Kamin, mit einem Glas. Mrs. Penrose sitzt am Fenster, als warte sie auf eine Kutsche. Hobbes schenkt Tee ein. {music:evening}
harriet[neutral]: Miss Hale. Setzen Sie sich. Sie werden uns nachher den Abendpsalm lesen.
harriet[neutral]: Mrs. Penrose. Ich möchte Sie um etwas bitten.
penrose[neutral]: Miss Averley.
harriet[neutral]: Heute Nacht, wenn das Haus schläft. Eine kleine Sitzung. Nur wir beide. Er ist noch nah, das sagen Sie doch selbst – die ersten Nächte sind sie noch nah.
lionel[angry]: Großartig. Holen wir ihn zurück und fragen ihn, wer ihn umgebracht hat. Ich setze auf den Gast.
harriet[tense]: Lionel.
penrose[neutral]: Nein. {pause:500}
narr: Alle sehen sie an. Selbst Hobbes hält die Teekanne einen Augenblick zu lange über der Tasse.
penrose[neutral]: Nicht heute, Miss Averley. Nicht ihn.
harriet[surprised]: Sie verweigern mir –
penrose[tense]: Ich verweigere Ihnen nichts. Ich bitte Sie. Lassen Sie ihn in Ruhe. Er hat es sich – verdient.
lionel[neutral]: Hört, hört. Das Medium hat ein Gewissen. Man sollte es in Spiritus einlegen.
narr: Mrs. Penrose sieht ihn an, ohne zu lächeln. Dann sieht sie Sera an, und ihr Blick ist müde und sehr wach zugleich.
harriet[neutral]: Er wollte heute früh etwas bezeugen lassen. Beim Dinner sagte er, er brauche Hobbes und Mrs. Pryce für eine Unterschrift. {+s:s11, reveals:f24}
harriet[sad]: Es ist nichts gefunden worden. Kein Papier. Nichts. Hobbes hat den Schreibtisch durchgesehen.
hobbes[neutral]: Es lag nichts zur Unterschrift bereit, Madam.
lionel[tense]: Nichts. Wie schön. Dann bleibt ja alles, wie es war.
inner: Er sagt es zu schnell. Und er leert das Glas, bevor jemand antworten kann.
harriet[neutral]: Miss Hale, der Psalm. Der neunzigste.
narr: Hobbes reicht ihr eine schwarz gebundene Bibel, aufgeschlagen. Sera liest.
sera: „Lehre uns unsere Tage zählen, auf dass wir ein weises Herz gewinnen.“
narr: Niemand sagt Amen. Nur das Feuer knackt, und draußen fällt der Regen auf das Wasser, das schon da ist.
harriet[neutral]: Sie lesen gut, Miss Hale. Welche Gemeinde besuchen Sie in London?
* [ausweichend] Eine kleine. Sie würden sie nicht kennen. {sus+1} -> a
* [ehrlich] Ehrlich gesagt gehe ich nicht oft in die Kirche. {harriet-1, sus+1} -> b
* [humor] Die mit den bequemsten Bänken. {lionel+1, harriet-1} -> c
# a
harriet[neutral]: Ich kenne sie alle, Miss Hale. Ich lese den Church Times.
inner: Natürlich tut sie das.
-> d
# b
harriet[tense]: Nicht oft. {pause:400}
harriet[neutral]: Dann werden Sie es hier lernen.
-> d
# c
lionel[warm]: Ha. Endlich jemand mit Prinzipien.
harriet[tense]: Lionel, du hast getrunken. Miss Hale, Sie haben es nicht.
# d
narr: Das Abendessen endet, wie es begann: ohne dass jemand etwas gegessen hat. {+f:k2_evening_done}

=== k2_to_night
kind: event
when: ch=2 f:k2_evening_done k:d03 k:d05 k:d06 tod=abend loc=galerie,toten,kammer
priority: 6
---
narr: Die Standuhr in der Halle schweigt, aber irgendwo im Haus tickt eine andere, kleinere, die niemand angehalten hat. Es ist fast Mitternacht. {time=nacht}
inner: Clara sitzt heute Nacht bei ihm. Man lässt die Toten in der ersten Nacht nicht allein, sagt Mrs. Pryce. Ich habe gesagt, ich komme dazu. {+f:k2_night}

=== k2_vigil
kind: scene
when: ch=2 loc=toten f:k2_night
priority: 20
important: yes
---
narr: Zwei Kerzen, ein Stuhl auf jeder Seite des Bettes. Clara sitzt links, eine Decke um die Schultern, ein Buch auf dem Schoß, das sie nicht liest. {music:vigil}
clara[neutral]: Sie sind gekommen.
sera: Ich hab’s gesagt.
clara[neutral]: Man sagt vieles.
narr: Sera setzt sich auf den anderen Stuhl. Eine Weile ist da nur der Regen und das leise Zischen des Dochts.
clara[neutral]: Er hat mir mit sieben ein Mikroskop geschenkt. Tante Harriet hat drei Tage nicht mit ihm gesprochen. Ein Mädchen mit einem Mikroskop, stellen Sie sich vor.
clara[neutral]: Ich habe Zwiebelhaut angesehen und Flöhe und einen Tropfen aus dem Teich. Er stand hinter mir und sagte kein Wort. Er hat nur gewartet, bis ich etwas finde.
* [mitfuehlend] Klingt, als hätte er Ihnen vertraut. {clara+1} -> a
* [ehrlich] Mein Vater hätte mir eher ein Pony geschenkt. Ich hätte das Mikroskop gewollt. {clara+1} -> b
* [schweigen] (Zuhören.) {clara+1} -> c
# a
clara[neutral]: Vertraut. Ja. Er hat allen vertraut, dass sie ohne ihn zurechtkommen.
-> c
# b
clara[warm]: Ein Pony. {pause:300}
clara[neutral]: Ich hätte es seziert.
# c
narr: Die Tür knarrt. Etwas Graues schiebt sich durch den Spalt, lautlos bis auf ein feines Klingeln. {sfx:bell}
yuumi: (Yuumi springt auf das Fußende des Bettes, geht über die Decke, als gehöre sie ihr, und legt sich neben die gefalteten Hände des Toten. Sie rollt sich ein, die Nase unter dem Schwanz.)
inner: Yuumi. Nicht –
narr: Hinter ihr steht Miss Averley in der Tür, im Morgenrock, eine Kerze in der Hand.
harriet[angry]: Eine Katze! Bei einem Toten! Nehmen Sie sie weg, Miss Hale, sofort, das bringt Unglück, jeder weiß das –
clara[neutral]: Lass sie. {pause:600}
clara[sad]: Er hatte Katzen gern.
narr: Clara hat nicht laut gesprochen. Aber ihre Stimme hat einen Riss, durch den etwas hindurchfällt, und sie legt die Hand vor den Mund, und dann weint sie. Nicht leise. Wie jemand, der es zu lange aufgehoben hat. {pause:800}
narr: Miss Averley steht in der Tür. Die Kerze zittert. Dann kommt sie herein, stellt die Kerze ab, setzt sich auf die Bettkante und legt ihrer Nichte eine Hand auf den Rücken. Sie sagt nichts. Sie lässt die Hand dort.
yuumi: (Yuumi schnurrt. Es ist das einzige Geräusch im Raum, das nicht traurig ist.) {sfx:purr}
narr: Nach einer langen Zeit steht Sera auf und geht leise hinaus. Niemand bemerkt es. Das ist richtig so. {harriet+1, clara+2, +f:k2_vigil_done}

=== k2_night_room
kind: scene
when: ch=2 loc=kammer f:k2_vigil_done
priority: 20
important: yes
---
narr: Ihre Kammer. Der Kerzenstummel, das schmale Bett, der Regen. Yuumi ist nicht mitgekommen. Sie liegt noch drüben, bei ihm. {music:quiet}
inner: Er ist gestürzt. Um 2.39. Er lag am Boden, bis Hobbes ihn um Viertel nach sechs fand und in den Sessel setzte. Kein Gift. Kein Kampf.
inner: Aber jemand hat nachts geläutet, so heftig, dass die Quaste riss. Jemand hat mit ihm getrunken. Jemand hat zwei Gläser gespült, bevor irgendwer aufstand.
inner: Und ich habe eine Glocke gehört. Tief unten im Haus. Ich war doch da, zwischen allem, wie unter Wasser. Oder ich habe es geträumt, weil ich jetzt weiß, dass es passiert ist.
inner: Ob zu Hause jemand die Heizung runterdreht? Ob der Karton noch auf dem Boden steht, und die Platte auf dem Schreibtisch liegt, und das Licht noch an ist?
narr: Die Tür knarrt. Ein Glöckchen. Yuumi springt auf das Bett, dreht sich zweimal und legt sich in die Kuhle an Seras Knien, als sei das die natürlichste Sache der Welt. {sfx:bell}
inner: Da bist du ja.
inner: Ich weiß nicht, wie wir nach Hause kommen. Aber solange du hier bist, bin ich es auch. {chap:3, time=morgen, go:kammer@0.5}
`;
