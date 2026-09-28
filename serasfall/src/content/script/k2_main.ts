export default `
=== k2_laying
kind: scene
when: ch=2 loc=toten
priority: 20
important: yes
---
narr: Im Zimmer des Herrn roch es nach Kampfer, Lavendelwasser und kaltem Kerzenwachs. Das Bett war frisch bezogen. Auf dem Nachttisch standen eine Schüssel mit warmem Wasser, Tücher, ein Rasiermesser und eine Schere. {music:laying}
narr: Edmund Averley lag auf dem Laken, bis zur Brust zugedeckt. Sein Gesicht war grau und ganz ruhig. Er sah ein bisschen erstaunt aus.
narr: Miss Averley stand am Fußende. Mrs. Pryce hatte die Ärmel hochgekrempelt. Miss Clara stand am Fenster und drehte allen den Rücken zu.
harriet[neutral]: Wir beginnen mit dem Gesicht. So hat es Mutter damals –
narr: Sie nahm ein Tuch aus der Schüssel. Wasser tropfte auf das Laken. Sie hob die Hand und hielt mitten in der Bewegung inne. {pause:900}
harriet[tense]: Mrs. Pryce. Machen Sie das.
narr: Sie legte das Tuch ordentlich auf den Rand der Schüssel und ging hinaus. Die Tür ließ sie offen. {sfx:door}
pryce[neutral]: Na. {pause:400}
pryce[neutral]: Miss Hale, die Schüssel. Miss Clara, Sie müssen nicht bleiben.
clara[neutral]: Ich bleibe.
pryce[neutral]: Haben Sie schon mal einen Toten gewaschen, Miss?
* [ehrlich] Nein. Noch nie. {pryce+1} -> a
* [luege] Ja, natürlich. {sus+1} -> b
# a
pryce[neutral]: Dann lernen Sie’s heute. Beim ersten Mal ist es am schwersten. Danach ist es nur noch traurig.
-> c
# b
narr: Sera nahm das Tuch und wusste nicht, wo sie anfangen sollte. Mrs. Pryce sah es.
pryce[neutral]: Natürlich. Dann fangen Sie mal mit dem Gesicht an. Wie Sie’s gewohnt sind.
inner: Sie weiß genau, dass ich gelogen hab. Und sie lässt mich trotzdem helfen.
# c
narr: Sie wuschen ihn Stück für Stück, ganz vorsichtig. Mrs. Pryce sang dabei leise vor sich hin, in einer Sprache, die nicht Englisch war.
narr: An der linken Schläfe, unter dem grauen Haar, war eine Schürfung. Sie war bläulich verfärbt und hatte einen feinen Rand. {+c:c04}
inner: Das kommt nicht vom Sessel.
pryce[neutral]: Wir müssen ihn umdrehen, fürs Hemd. Miss Hale, Sie nehmen die Schultern. Auf drei.
narr: Als sie ihn auf die Seite rollten, sah Sera seine linke Flanke. Über Schulter und Seite zogen sich große dunkle, fast violette Flecken, mit weißen Stellen dazwischen, wo er auf etwas Hartem gelegen haben musste. Aus dem Studium kannte Sera so etwas, aber nur als Foto in einem Lehrbuch.
narr: Miss Clara war vom Fenster herübergekommen. Sie sah die Flecken lange an. {+c:c06}
clara[tense]: Totenflecken.
clara[neutral]: Nach dem Tod sinkt das Blut dorthin, wo der Körper am tiefsten liegt. Immer nach unten. Blut ist nicht sentimental.
clara[tense]: Wenn er im Sessel gestorben wäre, wie Hobbes sagt, müssten sie in den Beinen sein. Im Becken. Da ist fast nichts. Er hat stundenlang auf der linken Seite gelegen, auf etwas Hartem. Auf dem Boden. {+s:s18, reveals:f14, +f:g_body_laid}
pryce[tense]: Mr. Hobbes wird sich geirrt haben, Miss Clara. Vor lauter Schreck. {hints:f14}
clara[angry]: Hobbes irrt sich nicht. Hobbes hat in seinem ganzen Leben noch kein Salzfass an den falschen Platz gestellt.
narr: Danach sagte niemand etwas. Man hörte nur die Kerzen leise knistern.
* [mitfuehlend] Nicht jetzt. Jetzt kümmern wir uns um ihn. {clara+1, pryce+1} -> d
* [direkt] Dann hat ihn jemand nach seinem Tod in den Sessel gesetzt. {clara+1} -> e
* [schweigen] (Das Hemd glattstreichen und nichts sagen.) {pryce+1} -> d
# e
clara[neutral]: Ja. {pause:400}
clara[tense]: Nicht vor meiner Tante. Nicht heute.
# d
narr: Sie zogen ihm ein weißes Hemd und seinen besten schwarzen Rock an. Mrs. Pryce band ihm ein Tuch unter das Kinn, damit der Mund zu blieb, und legte ihm zwei Pennys auf die Lider.
narr: Miss Clara nahm die Miniatur, klappte sie auf und legte sie ihrem Vater in die gefalteten Hände. Ihre Finger mit den schwarzen Kuppen zitterten nicht. Aber sie atmete schnell.
clara[neutral]: Miss Hale. Kommen Sie mit. Ich will Ihnen etwas zeigen. {+f:k2_laid, go:dunkel@0.3}

=== k2_dark
kind: scene
when: ch=2 loc=dunkel f:g_body_laid
priority: 20
---
narr: Clara schloss die Tür zur Dunkelkammer auf. Dahinter lag ein schmaler Raum ohne Fenster, mit Regalen voller Flaschen, Schalen und Glasplatten in Holzkästen. Clara zündete eine Laterne mit rotem Glas an, und alles wurde rot. {music:dark}
clara[neutral]: Sie haben den Geruch bemerkt. Heute früh im Arbeitszimmer. Mein Bruder hat es jedem erzählt, der nicht schnell genug weggelaufen ist.
narr: Auf dem Tisch stand eine braune Flasche, der Stopfen lag daneben. Clara nahm sie und hielt sie ins rote Licht.
clara[neutral]: Das ist kein Mord. Das ist Fixierbad. Kaliumcyanid in Wasser. Das braucht man, damit das Bild auf der Platte bleibt und nicht schwarz wird. Der Geruch zieht durch jede Tür. {+s:s13, reveals:f19, +c:c12}
clara[tense]: Falls Sie daran riechen wollen – lassen Sie es.
clara[neutral]: Er hat die Flasche offen gelassen. Das hat er nie gemacht. Nie.
* [direkt] Wann waren Sie zuletzt hier drin? -> a
* [mitfuehlend] Sie haben oft mit ihm hier gearbeitet, oder? {clara+1} -> b
# a
clara[tense]: Das geht Sie nichts an.
clara[neutral]: … Gestern. Am Nachmittag. Da war sie zu.
-> c
# b
clara[neutral]: Seit ich vierzehn war. Tante Harriet hält es für ein Steckenpferd. Er hat mir beigebracht, wie man Licht auf Glas festhält.
narr: Sie zog einen Holzkasten aus dem Regal. Darauf stand: „C. mit Kamera, 1874.“ Sie machte ihn nicht auf.
clara[sad]: Mit mir reden hat er nie gelernt.
# c
? seen:pr_hobbes_c03 -> told
? k:c03 -> ask
-> after
# told
clara[neutral]: Sie haben die Uhr gefunden. Hobbes hat es mir erzählt. Er erzählt mir alles. Nur nicht das, was wichtig ist.
-> watch
# ask
clara[neutral]: Sie haben heute früh im Arbeitszimmer etwas gefunden, Miss Hale. Das sieht man Ihnen an.
# watch
* [ehrlich] Eine Uhr. Sie steht auf 2.39, das Glas ist gesprungen. {clara+1} -> w
* [ausweichend] Ja. Unterm Bücherschrank. -> w
# w
clara[neutral]: 2.39. Und die Schürfung an der Schläfe. Und das Kamingitter. {hints:f14}
clara[neutral]: Er ist gestürzt. Er ist aufgestanden, sein Herz – er ist gefallen und mit dem Kopf aufgeschlagen, und die Uhr ist unter den Schrank gerutscht. Und dann hat er da gelegen. Bis Hobbes kam.
narr: Sie sagte es ganz sachlich. Ihre Stimme brach nicht. Sie wurde nur immer leiser.
# after
clara[neutral]: Ich war um – {pause:600, hints:f05}
narr: Sie stellte die Flasche ab, zu fest. Das Glas klirrte.
clara[neutral]: Ich war nicht hier. Das wollte ich sagen.
inner: Nein. Das wollte sie nicht sagen.
clara[neutral]: Sie dürfen hier jederzeit hinein, Miss Hale. Er hätte es erlaubt. Er hat jeden alles ansehen lassen. Nur sich selbst nicht. {+f:g_dunkel_open, clara+1}

=== k2_pantry_free
kind: event
when: ch=2 tod=nachmittag seen:ex_k_butler_voices loc=halle,salon,arbeit,dunkel,biblio,galerie,toten,kammer !f:k2_listened !f:k2_pantry_free
priority: 4
---
narr: Die Tür der Butlerkammer ging auf. Hobbes kam heraus, sehr gerade und sehr langsam. Hinter ihm kam Mrs. Pryce mit einem Tiegel in der Hand, und bis in die Halle roch es nach Kampfer. {+f:k2_pantry_free}
inner: Er läuft ganz steif. So läuft man, wenn man was Schweres gehoben hat. Und Mrs. Pryce sieht ihm hinterher. Ich glaube, sie weiß genau, was. {+c:c09}

=== k2_dusk
kind: event
when: ch=2 seen:k2_dark k:d05 anyf:k2_listened,k2_pantry_free anyk:c08,c14,c24 tod=nachmittag
priority: 5
---
narr: Draußen wurde es dunkel. Richtig hell war es den ganzen Tag nicht gewesen. Irgendwo im Haus schlug Hobbes einen kleinen Gong. {sfx:gong, time=abend}
inner: Es gibt kaltes Abendessen im Salon, hat Mrs. Pryce gesagt. „Warm kocht man, wenn einer essen will. Heut will keiner.“

=== k2_evening
kind: scene
when: ch=2 loc=salon tod=abend
priority: 20
important: yes
---
narr: Im Salon standen kalter Braten, Brot und eingelegte Walnüsse auf dem Tisch, aber niemand aß. Miss Averley saß sehr aufrecht, der Captain stand mit einem Glas am Kamin, Hobbes schenkte Tee ein. Mrs. Penrose saß am Fenster, heute in Taubengrau statt Rostbraun, und Sera fand das für einen Gast im Trauerhaus genau richtig. {music:evening}
harriet[neutral]: Miss Hale. Setzen Sie sich. Sie werden uns nachher den Abendpsalm lesen.
harriet[neutral]: Mrs. Penrose. Ich möchte Sie um etwas bitten.
penrose[neutral]: Miss Averley.
harriet[neutral]: Heute Nacht, wenn das Haus schläft. Eine kleine Sitzung, nur wir beide. Er ist noch nah. Das sagen Sie doch selbst: In den ersten Nächten sind sie noch nah.
lionel[angry]: Großartig. Holen wir ihn zurück und fragen ihn, wer ihn umgebracht hat. Ich tippe auf den Gast.
harriet[tense]: Lionel.
penrose[neutral]: Nein. {pause:500}
narr: Alle sahen sie an. Sogar Hobbes hielt die Teekanne einen Moment zu lange über die Tasse.
penrose[neutral]: Nicht heute, Miss Averley. Nicht ihn.
harriet[surprised]: Sie verweigern mir –
penrose[tense]: Ich verweigere Ihnen nichts. Ich bitte Sie. Lassen Sie ihn in Ruhe. Das hat er sich – verdient.
lionel[neutral]: Hört, hört. Das Medium hat ein Gewissen. Das sollte man in Spiritus einlegen.
narr: Mrs. Penrose sah ihn an und lächelte nicht. Dann sah sie zu Sera. Sie wirkte müde, aber ihr Blick war sehr wach.
harriet[neutral]: Er wollte heute früh etwas bezeugen lassen. Beim Dinner sagte er, er brauche Hobbes und Mrs. Pryce für eine Unterschrift. {+s:s11, reveals:f24}
harriet[sad]: Man hat nichts gefunden. Kein Papier. Nichts. Hobbes hat den Schreibtisch durchgesehen.
hobbes[neutral]: Es lag nichts zur Unterschrift bereit, Madam.
lionel[tense]: Nichts. Wie schön. Dann bleibt ja alles, wie es war.
inner: Das kam zu schnell. Und er trinkt sein Glas aus, bevor jemand was sagen kann.
harriet[neutral]: Miss Hale, der Psalm. Der neunzigste.
narr: Hobbes reichte ihr eine schwarz gebundene Bibel. Sie war schon aufgeschlagen. Sera las vor.
sera: „Lehre uns unsere Tage zählen, auf dass wir ein weises Herz gewinnen.“
narr: Niemand sagte Amen. Das Feuer knackte, und draußen fiel der Regen auf das Wasser, das schon überall stand.
harriet[neutral]: Sie lesen gut, Miss Hale. Welche Gemeinde besuchen Sie in London?
* [ausweichend] Eine kleine. Die kennen Sie bestimmt nicht. {sus+1} -> a
* [ehrlich] Ehrlich gesagt gehe ich nicht oft in die Kirche. {harriet-1, sus+1} -> b
* [humor] Die mit den bequemsten Bänken. {lionel+1, harriet-1} -> c
# a
harriet[neutral]: Ich kenne sie alle, Miss Hale. Ich lese die Church Times.
inner: Natürlich tut sie das. Das muss ich Fritz erzählen.
-> d
# b
harriet[tense]: Nicht oft. {pause:400}
harriet[neutral]: Dann werden Sie es hier lernen.
-> d
# c
lionel[warm]: Ha. Endlich jemand mit Prinzipien.
harriet[tense]: Lionel, du hast getrunken. Miss Hale, Sie nicht.
# d
narr: Das Abendessen endete, wie es angefangen hatte. Niemand hatte etwas gegessen. {+f:k2_evening_done}

=== k2_to_night
kind: event
when: ch=2 f:k2_evening_done k:d03 k:d05 k:d06 tod=abend loc=galerie,toten,kammer
priority: 6
---
narr: Die Standuhr in der Halle stand still. Aber irgendwo im Haus tickte noch eine kleinere Uhr, die niemand angehalten hatte. Es war fast Mitternacht. {time=nacht}
inner: Clara wacht heute Nacht bei ihm. In der ersten Nacht lässt man Tote nicht allein, sagt Mrs. Pryce. Das hab ich mal in einem Roman gelesen, Brontë, oder war’s Dickens? Egal. Ich hab gesagt, ich komme dazu. {+f:k2_night}

=== k2_vigil
kind: scene
when: ch=2 loc=toten f:k2_night
priority: 20
important: yes
---
narr: Zwei Kerzen brannten, und auf jeder Seite des Bettes stand ein Stuhl. Clara saß links, eine Decke um die Schultern und ein Buch auf dem Schoß. Sie las nicht darin. {music:vigil}
clara[neutral]: Sie sind gekommen.
sera: Ich hab’s doch gesagt.
clara[neutral]: Das sagen viele.
narr: Sera setzte sich auf den anderen Stuhl. Eine Weile hörte man nur den Regen und das leise Zischen der Dochte.
clara[neutral]: Er hat mir mit sieben ein Mikroskop geschenkt. Tante Harriet hat drei Tage nicht mit ihm geredet. Ein Mädchen mit einem Mikroskop, stellen Sie sich das vor.
clara[neutral]: Ich habe mir Zwiebelhaut angesehen und Flöhe und einen Tropfen aus dem Teich. Er stand hinter mir und hat kein Wort gesagt. Er hat einfach gewartet, bis ich etwas finde.
* [mitfuehlend] Klingt, als hätte er Ihnen vertraut. {clara+1} -> a
* [ehrlich] Mein Vater hätte mir eher ein Pony geschenkt. Dabei hätte ich viel lieber das Mikroskop gehabt. {clara+1} -> b
* [schweigen] (Zuhören.) {clara+1} -> c
# a
clara[neutral]: Vertraut. Ja. Er hat allen zugetraut, dass sie ohne ihn zurechtkommen.
-> c
# b
clara[warm]: Ein Pony. {pause:300}
clara[neutral]: Ich hätte es seziert.
# c
narr: Die Tür knarrte. Etwas Graues schob sich durch den Spalt, ganz lautlos bis auf ein feines Klingeln. {sfx:bell}
yuumi: (Yuumi sprang auf das Fußende des Bettes, lief über die Decke und legte sich neben die gefalteten Hände des Toten. Sie rollte sich ein und steckte die Nase unter den Schwanz.)
inner: Yuumi. Nicht –
narr: Hinter ihr stand Miss Averley in der Tür, im Morgenrock, eine Kerze in der Hand.
harriet[angry]: Eine Katze! Bei einem Toten! Nehmen Sie sie weg, Miss Hale, sofort. Das bringt Unglück, das weiß jeder –
clara[neutral]: Lass sie. {pause:600}
clara[sad]: Er hatte Katzen gern.
narr: Clara hatte nicht laut gesprochen, aber ihre Stimme brach. Sie legte die Hand vor den Mund, und dann weinte sie. Nicht leise. Sie hatte es viel zu lange zurückgehalten. {pause:800}
narr: Miss Averley stand in der Tür, und die Kerze in ihrer Hand zitterte. Dann kam sie herein, stellte die Kerze ab, setzte sich auf die Bettkante und legte ihrer Nichte eine Hand auf den Rücken. Sie sagte nichts, aber sie ließ die Hand dort.
yuumi: (Yuumi schnurrte. Es war das einzige Geräusch im Zimmer, das nicht traurig klang.) {sfx:purr}
narr: Nach einer langen Zeit stand Sera auf und ging leise hinaus. Niemand merkte es, und das war auch gut so. {harriet+1, clara+2, +f:k2_vigil_done}

=== k2_night_room
kind: scene
when: ch=2 loc=kammer f:k2_vigil_done
priority: 20
important: yes
---
narr: Sera saß in ihrer Kammer auf dem schmalen Bett. Der Kerzenstummel brannte, draußen regnete es. Yuumi war nicht mitgekommen, sie lag noch drüben bei ihm. {music:quiet}
inner: Er ist also gestürzt. Um 2.39. Dann hat er am Boden gelegen, bis Hobbes ihn um Viertel nach sechs gefunden und in den Sessel gesetzt hat. Kein Gift. Kein Kampf.
inner: Aber irgendwer hat nachts geläutet, so fest, dass die Quaste gerissen ist. Irgendwer hat mit ihm getrunken. Und irgendwer hat zwei Gläser gespült, bevor die anderen aufgestanden sind.
inner: Und ich hab eine Glocke gehört. Tief unten im Haus. Da war ich doch schon irgendwie hier, und alles klang dumpf, wie unter Wasser. Oder ich hab das nur geträumt, weil ich jetzt weiß, dass es passiert ist.
inner: Ob Fritz schon zu Hause ist? Ob die Platte noch auf dem Schreibtisch liegt und die Lampe noch brennt? Er macht sich bestimmt furchtbare Sorgen. Ich vermiss ihn.
narr: Die Tür knarrte, und ein Glöckchen klingelte. Yuumi sprang aufs Bett, drehte sich zweimal und legte sich in die Kuhle an Seras Knien. {sfx:bell}
inner: Da bist du ja.
inner: Ich weiß nicht, wie wir nach Hause kommen. Aber solange du bei mir bist, geht es irgendwie. {chap:3, time=morgen, go:kammer@0.5}
`;
