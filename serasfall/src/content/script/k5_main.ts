export default `
=== k5_start
kind: scene
when: ch=5 loc=halle
priority: 20
important: yes
---
narr: Der Regen hat aufgehört. Zum ersten Mal seit Tagen hört man, wie still das Haus ist: kein Trommeln, kein Rinnen, nur das leise Knacken alter Balken, die trocknen wollen. {music:k5}
narr: In der Halle brennt eine einzige Lampe, kleingedreht. Genau wie in jener Nacht. Die Kamera steht auf ihren drei Beinen, der Krepp liegt zusammengefaltet daneben.
narr: Sera setzt sich auf die unterste Stufe, das Notizbuch auf den Knien, die Platte in ihrem schwarzen Papier neben sich.
inner: Ich muss es einmal ganz denken. Von Anfang bis Ende. Jede Spur an ihren Platz.
inner: Und dann muss ich mit ihnen reden. Mit jedem. Bevor die Sonne aufgeht. {do:recon}

=== k5_after_recon
kind: event
when: ch=5 f:g_recon_done
priority: 20
important: yes
---
inner: Er ist nicht ermordet worden. Er ist gestorben, weil sein Herz müde war. Das ist die Wahrheit, und sie ist nicht einmal die schlimmste.
inner: Das Schlimmste ist, dass jeder in diesem Haus in jener Nacht an der falschen Tür stand. Clara bei der Frau, die sie verachtete. Lionel draußen im Regen. Mrs. Pryce am Tisch mit ihrem Brief an einen Sohn, der nicht mehr schreibt. Hobbes im Schlaf. Miss Averley im Chloral. Mrs. Penrose hinter einer abgeschlossenen Tür.
inner: Und das einzige Kind im Haus ist die Treppe hinauf- und hinuntergelaufen, mit einem Brief, den niemand annehmen wollte.
inner: Er war nicht allein. Tilly hat seine Hand gehalten.
inner: Clara muss ihren Brief bekommen. Lionel muss wissen, was sein Vater zuletzt gesagt hat. Und die anderen – die anderen haben auch ein Recht darauf, es nicht mehr allein zu tragen. {+f:k5_talk}

=== k5_clara
kind: topic
npc: clara
title: Der Brief
when: ch=5 f:k5_talk !f:g_letter_read
important: yes
---
narr: Clara sitzt im Arbeitszimmer im Sessel ihres Vaters, eine Decke um die Schultern, im Schoß das Wetterbuch. Sie schläft nicht. Sie sieht auf das dunkle Fenster. {music:letter}
? f:k4_together -> tilly
sera: Miss Clara. Ich habe etwas für Sie. Es ist nicht von mir.
-> give
# tilly
narr: Hinter Sera, im Türrahmen, steht Tilly. Barfuß, die Hände unter der Schürze, als wolle sie sie festhalten.
sera: Miss Clara. Tilly und ich haben etwas für Sie. Es ist nicht von uns.
# give
narr: Sera legt den Brief auf das Wetterbuch. Die Schrift ist klein, eng, genau. „Für Clara. Nur für sie.“
clara[surprised]: Das ist – seine Hand.
narr: Sie öffnet ihn nicht sofort. Sie hält ihn, als wäre er ein Präparat, das zerfallen könnte, wenn man es der Luft aussetzt. Dann bricht sie das Siegel. {sfx:paper, pause:600}
letter: Clara, es ist halb zwei, und du bist gegangen, und du hattest recht. Ich schreibe es auf, weil ich es nicht sagen kann. Das weißt du. Das hast du von mir.
letter: Ich habe dir nicht gesagt, warum London warten muss. Hier ist es. Lionel hatte Schulden, 1840 Pfund, bei Leuten, die man nicht warten lässt. Ich habe sie am 8. bezahlt. Es war fast alles, was ich an Freiem hatte. Er weiß es nicht; ich wollte, dass er fragt. Das war Hochmut. Sag es ihm, wenn ich es nicht mehr kann.
letter: Dr. Wilkes in Bath sagt, mein Herz werde nicht mehr lange mitmachen. Monate. Harriet weiß es; ich habe sie schwören lassen. Sei ihr nicht böse. Sie hat gehorcht. Das ist ihr Unglück, seit fünfzig Jahren.
letter: Die Institution in Bath bietet 700 Pfund für meine Instrumente und Platten. Das reicht für die Henrietta Street und drei Jahre Zimmer. Morgen früh unterschreibe ich, dass die Sammlung dir gehört, Hobbes und Mrs. Pryce werden es bezeugen. Sollte mir vorher etwas zustoßen, dann bitte Lionel darum. Er ist besser, als er glaubt. Das hat ihm keiner gesagt, am wenigsten ich.
letter: Deine Mutter hat mich schwören lassen, dich wählen zu lassen. Ich habe gedacht, es genüge, dir nichts zu verbieten. Es genügt nicht. Man muss auch etwas geben.
letter: Heute Abend hat eine Frau aus Bath meine eigenen Worte in Lucindas Stimme gesprochen. Ich habe mich geschämt, weil ich sie ihr erzählt hatte, und weil ich gehofft hatte. Du hast recht, es war Betrug. Du hast nicht recht, dass es nicht wehtut.
letter: Ich stelle heute Nacht die Kamera auf die Treppe, um Harriet zu beweisen, dass dort nichts wandelt. Sollte doch etwas auf der Platte sein: Entwickle sie trotzdem. Man verwirft kein Ergebnis, weil es einem nicht passt. Das ist das Einzige, was ich dir wirklich beigebracht habe.
letter: Wähle, Clara. – Dein Vater, E. A. {+f:g_letter_read, +c:c30}
narr: Clara liest bis zum Ende. Dann liest sie noch einmal die letzte Zeile, nur die letzte, und legt die Hand mit den schwarzen Fingerspitzen flach auf das Papier. {pause:1200}
clara[sad]: „Entwickle sie trotzdem.“
narr: Sie lacht. Es ist ein kleines, zerbrochenes Lachen, und dann weint sie, mit offenen Augen, ohne sich die Tränen abzuwischen, als wolle sie sehen, wie viele es sind.
clara[sad]: Er hat es mir geschrieben. Nachdem ich ihm gesagt habe, dass Mama sich für ihn geschämt hätte. Er hat sich hingesetzt und mir das geschrieben. Und dann – {+f:g_letter_known}
clara[sad]: Wie ist er gestorben, Miss Hale? War er – war er allein?
? f:k4_together -> t_speaks
* [ehrlich] Nein. Tilly war bei ihm. Sie hat seine Hand gehalten. {clara+1} -> s_tells
* [mitfuehlend] Nein. Er war nicht allein. Tilly soll es Ihnen selbst erzählen, wenn sie kann. {clara+1} -> s_tells
# t_speaks
narr: Tilly tritt einen Schritt ins Zimmer. Sie steht auf dem Teppich des Herrn, barfuß, und sieht auf ihre Zehen.
tilly[sad]: Nein, Miss. Ich war da. {pause:500}
tilly[sad]: Er hat mir den Brief gegeben, und ich bin rauf, zu Ihnen, und hab geklopft. Ich hab so lang geklopft. Und wie ich runterkam, lag er da. Ich hab seine Hand gehalten. Bis er – bis er aufgehört hat. {reveals:f10}
tilly[sad]: Er hat was gesagt. „Es ist bezahlt. Sag’s ihm.“ Ich weiß nich, wem, Miss. Ich weiß es nich. {+f:g_tilly_to_clara, reveals:f26}
narr: Clara steht auf. Die Decke fällt von ihren Schultern. Sie geht zu Tilly und kniet sich vor sie hin, auf den Teppich, im Nachthemd, und nimmt ihre Hände, die roten, rissigen, in ihre schwarzen.
clara[sad]: Ich war nicht da. Du hast geklopft, und ich war nicht da.
clara[sad]: Danke. {pause:700}
clara[sad]: Ihm. Es ist bezahlt. Sag’s ihm. Er meinte Lionel, Tilly. Er meinte meinen Bruder.
-> after
# s_tells
narr: Sera erzählt es ihr. Die Glocke. Die Treppe. Das Klopfen. Die Hand. Die letzten Worte. Clara hört zu, ohne zu unterbrechen, wie man einem Befund zuhört.
clara[sad]: Tilly. Das Küchenmädchen. Die, der ich einmal ein T gezeigt habe und die ich danach vergessen habe.
clara[sad]: „Es ist bezahlt. Sag’s ihm.“ Lionel. Er meinte Lionel. {hints:f03}
# after
clara[neutral]: Jemand muss es ihm sagen. Heute Nacht. Nicht der Coroner. Nicht Tante Harriet.
clara[neutral]: Sie, Miss Hale. Ich kann es nicht, ohne ihn anzuschreien, und er hat genug Leute gehabt, die ihn angeschrien haben. Er zuerst.

=== k5_lionel
kind: topic
npc: lionel
title: Es ist bezahlt
when: ch=5 f:k5_talk anyf:g_letter_read,g_tilly_spoke !f:g_lionel_confessed !f:g_lionel_silent
important: yes
---
narr: Der Captain steht im Stall bei dem Braunen, die Laterne am Haken, den Rock offen. Er hat nicht getrunken. Er sieht aus wie jemand, der seit drei Nächten nicht geschlafen hat, weil es so ist. {music:lionel}
lionel[neutral]: Miss Hale. Sie auch schlaflos. Das Haus ist heute Nacht voll von Leuten, die auf den Morgen warten wie auf ein Urteil.
? f:g_lionel_told_paid -> knows
sera: Captain. Ihr Vater hat Ihre Schulden bezahlt. Alle. Am 8. November. Es steht in seinem Notizbuch und auf dem Blatt, das Sie verbrannt haben. {+f:g_lionel_told_paid}
lionel[surprised]: Bezahlt.
narr: Er muss sich an der Box festhalten. Der Braune schnaubt und stößt ihn mit der Nase, als wolle er ihn aufrecht halten.
# knows
sera: Ich weiß, was er zuletzt gesagt hat. Tilly war bei ihm, als er starb. Er sagte: „Es ist bezahlt. Sag’s ihm.“ {+f:g_lionel_told_words}
narr: Der Captain hört es. Man sieht, wie die Worte ankommen, eins nach dem andern, wie Steine, die man in einen Brunnen fallen lässt, und man wartet auf das Aufschlagen. {pause:1000}
lionel[sad]: Ihm. {pause:500}
lionel[sad]: Mir.
lionel[sad]: Er hat an mich gedacht. Zuletzt. Mit dem Kopf auf dem Teppich hat er an mich gedacht, und ich stand draußen im Regen und habe mir leidgetan.
lionel[sad]: Ich war bei ihm, Miss Hale. Das wissen Sie. Wir haben gestritten. Ich habe ihn angeschrien wegen einer Unterschrift, von der ich glaubte, sie würde mich enterben. Er wollte etwas sagen. „Ich habe dafür gesorgt, dass du –“ Und ich habe ihn nicht ausreden lassen.
lionel[sad]: Dann griff er sich an die Brust. Er setzte sich. Er wurde grau. Und ich habe gesagt: „Spielen Sie mir nicht den Sterbenden vor, Vater.“ {+s:s31, reveals:f07}
narr: Er sagt es sehr ruhig. Das ist das Schlimmste daran.
lionel[sad]: Und er sagte: „Lionel. Die Glocke.“ Und ich dachte, er spricht von Mutter. Von dieser verfluchten Séance, der Glocke im Wasser. Ich habe gesagt: „Die Glocke im Wasser. Gute Nacht, Vater.“ Und bin durch die Terrassentür gegangen. {reveals:f27}
* [ehrlich] Er meinte nicht die Glocke im Wasser. Er meinte die Klingel. Er wollte, dass Sie läuten. {lionel+1} -> bell
* [mitfuehlend] (Warten. Ihm Zeit lassen.) {lionel+1} -> bell2
# bell2
narr: Er sieht die Klingelschnur in der Stallecke, die zum Kutscherzimmer führt. Sieht sie an, als sähe er sie zum ersten Mal.
# bell
lionel[surprised]: Die Klingel.
lionel[sad]: Er hat mich gebeten, zu läuten. Und ich habe ihm die Sage seiner toten Frau ins Gesicht gespottet und bin gegangen.
lionel[sad]: Und dann hat er selbst geläutet. Und das Kind kam. Ein Küchenmädchen hat getan, was sein Sohn nicht getan hat.
narr: Er dreht sich zu dem Braunen und legt die Stirn gegen seinen Hals, und seine Schultern zittern, und er gibt keinen Laut von sich.
narr: Nach einer langen Zeit richtet er sich auf.
lionel[neutral]: Der Coroner kommt in drei Stunden. Er wird fragen, wer zuletzt bei meinem Vater war.
* [mitfuehlend] Sie haben es nicht gewusst. Aber jetzt wissen Sie es. Was Sie jetzt tun, gehört Ihnen. {lionel+1} -> decide
* [direkt] Sie müssen es ihm sagen. Tilly soll nicht allein dastehen. -> push
* [schweigen] (Nichts sagen. Neben ihm stehen bleiben.) {lionel+1} -> decide
# push
? t:lionel>=9 -> speak
lionel[angry]: Müssen. Ich habe mein ganzes Leben lang gehört, was ich muss.
-> silent
# decide
? t:lionel>=7 -> speak
-> silent
# speak
lionel[neutral]: Ich werde es ihm sagen. Alles. Den Streit, die Terrasse, das Feuer. {+f:g_lionel_confessed}
lionel[neutral]: Ich lasse nicht zu, dass ein Kind aus dem Arbeitshaus vor einem Coroner steht und erklärt, warum es bei meinem Vater war, und ich sitze daneben und sage, ich hätte geschlafen wie ein Stein.
lionel[sad]: Es wird einen Skandal geben. Das Regiment wird mir nahelegen, den Dienst zu quittieren. Tante Harriet wird eine Woche nicht mit mir sprechen und dann für immer.
lionel[neutral]: Und Clara bekommt ihre Sammlung. Und ihr London. Das hätte er so gewollt. Das hat er aufgeschrieben, sagen Sie? Dann ist es ein Befehl. Ich habe gelernt, Befehle zu befolgen.
lionel[warm]: Wenigstens das.
-> END
# silent
lionel[sad]: Ich kann nicht, Miss Hale. Nicht vor Tante Harriet. Nicht vor einem Coroner aus Bridgwater, der meinen Vater für einen Heiden hielt.
lionel[sad]: Ich werde bezahlen, was er Clara versprochen hat. Jeden Penny. Aber ich kann es nicht sagen. Noch nicht. Vielleicht nie. {+f:g_lionel_silent}
lionel[neutral]: Sagen Sie es, wenn Sie müssen. Ich werde es nicht leugnen. Ich werde nur – schweigen. Wie er.
inner: Wie er. Das ist das Traurigste, was er hätte sagen können. Und das Ehrlichste.

=== k5_hobbes
kind: topic
npc: hobbes
title: Morgen früh
when: ch=5 f:k5_talk
---
narr: Hobbes steht in der Halle neben der Kamera, eine Kerze in der Hand, und sieht die Treppe hinauf. Er hat die Handschuhe ausgezogen. Seine Hände sind alt und sehr sauber.
? f:g_hobbes_will_speak -> will
? t:hobbes>=4 -> open
hobbes[neutral]: Miss sollte schlafen. Der Coroner kommt früh.
-> END
# open
? k:s25 -> will
hobbes[sad]: Ich fand ihn am Boden, Miss. Vor dem Kamin. Ich habe ihn in den Sessel gesetzt und die Gläser fortgeräumt, damit niemand fragt, wer bei ihm war. {+s:s25, reveals:f14}
hobbes[sad]: Neunundvierzig Jahre. Und in der einen Nacht, in der er mich gebraucht hätte, habe ich geschlafen.
# will
hobbes[neutral]: Ich werde dem Coroner sagen, wie ich den Herrn gefunden habe. Nicht, wie ich wünschte, ihn gefunden zu haben. {+f:g_hobbes_confessed}
hobbes[neutral]: Und wenn das Küchenmädchen aussagen muss, dann wird sie nicht allein vor dem Tisch stehen. Das Haus steht hinter ihr. Ich stehe hinter ihr.
narr: Er sagt „das Küchenmädchen“. Dann hält er inne.
hobbes[neutral]: Tilly. Sie heißt Tilly. {+f:g_hobbes_stands, hobbes+1}

=== k5_pryce
kind: topic
npc: pryce
title: Morgen früh
when: ch=5 f:k5_talk
---
narr: In der Küche brennt der Herd. Mrs. Pryce und Tilly sitzen am Tisch, zwei Becher Tee zwischen sich, und Yuumi liegt in Tillys Schoß wie ein warmes graues Brot.
? !f:g_pryce_confessed -> conf
-> tea
# conf
pryce[sad]: Setzen Sie sich, Miss. Ich hab dem Kind heut Nacht was gesagt, das ich ihm vor drei Tagen hätt sagen müssen.
pryce[sad]: Ich hab die Glocke gehört. Ich hab sie gehen lassen. Ich bin sitzen geblieben. {+s:s26, reveals:f15, +f:g_pryce_confessed}
# tea
tilly[tense]: Miss. Was macht der Coroner mit mir?
* [ehrlich] Er fragt dich, was du gesehen hast. Und du sagst es ihm. Genau so, wie du es mir gesagt hast. -> a
* [mitfuehlend] Er hört dir zu. Und diesmal hören alle anderen auch zu. -> a
# a
tilly[tense]: Und wenn er mir nich glaubt? Ich bin vom Arbeitshaus.
pryce[angry]: Dann kriegt er keinen Ingwerkeks. Und dann glaubt er dir.
narr: Tilly lacht, erschrocken über sich selbst, und Mrs. Pryce legt ihr die Hand auf die Haube, ungeschickt, wie jemand, der das lange nicht getan hat.
pryce[neutral]: Man holt so ein Kind nicht aus dem Arbeitshaus, damit es wieder zurückmuss. Ich steh neben dir, cariad. Und Mr. Hobbes auch, der weiß es nur noch nicht.
tilly[neutral]: Dann sag ich’s. Alles. {+f:g_tilly_will_speak, tilly+1}

=== k5_harriet
kind: topic
npc: harriet
title: Clara
when: ch=5 f:k5_talk
---
narr: Miss Averley sitzt im Salon, angezogen, als erwarte sie Besuch. Vor ihr eine Tasse Tee, kalt. Sie hat die Vorhänge einen Spalt geöffnet. Draußen ist es schwarz.
? f:g_letter_read -> knows
harriet[neutral]: Sie sind noch wach, Miss – Sera. Setzen Sie sich.
harriet[neutral]: Ich höre Türen gehen. Ich höre Clara weinen. Ich höre Lionel nicht trinken. Etwas geschieht in diesem Haus heute Nacht, und niemand sagt es mir.
-> talk
# knows
harriet[sad]: Clara war bei mir. Sie hat mir einen Brief gezeigt. Sie hat nicht geschrien. Ich hätte es vorgezogen.
harriet[sad]: „Sei ihr nicht böse. Sie hat gehorcht. Das ist ihr Unglück, seit fünfzig Jahren.“ Das hat er über mich geschrieben. Er hat recht gehabt. Er hatte immer recht, es war unerträglich. {+f:g_harriet_confessed}
# talk
* [mitfuehlend] Clara wird nach London gehen wollen. {harriet+1} -> a
* [direkt] Werden Sie sie gehen lassen? -> a
# a
harriet[neutral]: Man hat mich einmal nicht gehen lassen, Miss Hale.
? t:harriet>=8 -> deep
harriet[neutral]: Ich werde es mir überlegen. Man überlegt so etwas nicht in einer Nacht.
-> END
# deep
narr: Sie steht auf und geht zum Fenster, zu dem Spalt zwischen den Vorhängen, und bleibt dort stehen, mit dem Rücken zum Zimmer.
harriet[sad]: 1854 wollte ich mit Miss Nightingale nach Skutari. Ich hatte mich gemeldet. Ich hatte die Zusage. Ich war vierunddreißig und hatte noch nie etwas gewollt.
harriet[sad]: Vater hat es verboten. Eine Averley pflegt keine Soldaten. Henry war schon in der Krim. Ich habe gewartet. Ich war gut im Warten. Am fünften November kam der Brief.
harriet[neutral]: Ich habe zwanzig Jahre lang Geister gerufen, Miss Hale, weil ich nicht ertragen konnte, dass ich die Lebenden nicht gerufen habe, als ich es gekonnt hätte.
narr: Sie dreht sich um. Ihr Gesicht ist trocken. Nur die Hand an der Jet-Brosche zittert.
harriet[neutral]: Clara wird gehen. Wenn Lionel nicht zahlt, zahle ich. Ich habe eine Brosche, die nichts mehr bedeutet, und eine Rente, die ich nicht brauche. {+f:g_harriet_frees}
harriet[neutral]: Und sagen Sie es ihr nicht. Ich will es ihr selbst sagen. Das eine Mal will ich die sein, die etwas gibt.

=== k5_penrose
kind: topic
npc: penrose
title: Vor dem Morgen
when: ch=5 f:k5_talk
---
narr: Mrs. Penrose steht auf der Galerie, am Geländer, genau dort. Sie sieht hinunter in die Halle, auf die Treppe, auf die Kamera. Sie trägt ihr Reisekleid.
penrose[neutral]: Ich wollte sehen, ob ich es noch einmal sehe. Das Mädchen. Die Frau. Sie wissen schon.
penrose[warm]: Nichts. Nur eine Treppe. Es ist sehr enttäuschend und sehr beruhigend.
? t:penrose>=5 -> honest
penrose[neutral]: Mit dem ersten Boot bin ich fort, meine Liebe. Grüßen Sie Ihre Katze.
-> END
# honest
penrose[neutral]: Ich werde es Miss Averley sagen, bevor ich gehe. Und Miss Clara. Dass ich nie etwas gehört habe als Menschen. Dass die Glocke im Wasser aus Edmunds eigenem Mund kam, in Bath, im August. {+f:g_penrose_confessed, reveals:f20}
penrose[sad]: Es wird mich meine Kundschaft in Bath kosten. Man spricht über so etwas. Vielleicht eröffne ich eine Pension. In Clifton. Mit sehr gutem Tee und ohne Geister.
? f:g_sera_told_penrose -> known
* [ehrlich] Ich bin die Frau, die Sie gesehen haben. {+f:g_sera_told_penrose, penrose+1} -> told
* [mitfuehlend] Das ist eine ehrliche Sache. Die eine, die Sie tun wollten. {penrose+1} -> end
# told
penrose[neutral]: Ich weiß, Kind. Ich wusste es in der Bibliothek. {hints:f23}
# known
penrose[warm]: Gehen Sie nach Hause, wo immer das ist. Und nehmen Sie das Tier mit. Hier glaubt man sonst noch an Geister.
-> END
# end
penrose[neutral]: Eine. Ja. Man muss klein anfangen.

=== k5_ready
kind: event
when: ch=5 f:g_letter_read anyf:g_lionel_confessed,g_lionel_silent
priority: 10
---
narr: Draußen, im Osten, über dem Moor, ist der Himmel nicht mehr schwarz. Er ist von einem sehr tiefen Blau, wie Tinte, der man Wasser zugegeben hat. {sfx:bird}
inner: Es wird Zeit. Der Fenstersitz auf der Treppe. Dort, wo ich angekommen bin.
inner: Ich kann noch mit den anderen reden, wenn ich will. Aber die Sonne wartet nicht auf mich. {+f:k5_ready}

=== k5_dawn
kind: examine
target: h_fenstersitz
when: ch=5 f:k5_ready
priority: 30
important: yes
---
narr: Der Fenstersitz auf dem Halbpodest. Der Vorhang ist aufgezogen. Hinter der Scheibe liegt das Moor, grau und glatt, und darüber ein Streifen Himmel, der langsam heller wird. {music:dawn}
narr: Sera setzt sich. Die Platte in ihrem schwarzen Papier auf dem Schoß. Eine Kerze auf dem Sims.
narr: Leise Schritte auf der Treppe, barfuß. Tilly, mit Yuumi im Arm, die sich tragen lässt wie eine Königin in einer Sänfte.
tilly[neutral]: Handschuh wollt zu Ihnen. Sie hat an der Küchentür gekratzt.
narr: Tilly setzt sich neben sie, auf den Rand des Polsters, genau so, wie sie in jener Nacht auf der Stufe darunter saß. Yuumi rollt sich zwischen ihnen ein.
tilly[neutral]: Sie gehn weg, Miss. Oder?
tilly[neutral]: Wo Sie herkommen. Wo’s anders is.
* [ehrlich] Ich komme aus einer Zeit, die noch nicht da ist, Tilly. Fast hundertfünfzig Jahre von hier. Ich habe dein Flüstern in einer Glasplatte gehört, und dann war ich hier. {+f:g_sera_told_tilly, tilly+1} -> true
* [mitfuehlend] Von sehr weit weg. So weit, dass man nicht mit dem Boot hinkommt. {+f:g_sera_told_tilly} -> soft
# true
tilly[surprised]: Hundertfünfzig Jahre. {pause:600}
tilly[neutral]: Gibt’s da noch Küchenmädchen?
sera: Nicht so wie dich.
tilly[neutral]: Und Arbeitshäuser?
sera: Nein. Keine Arbeitshäuser mehr.
narr: Tilly denkt darüber nach, lange, mit gerunzelter Stirn, wie über eine Rechenaufgabe.
tilly[warm]: Dann is es da schön.
-> choice
# soft
tilly[neutral]: Nich mit dem Boot. {pause:400}
tilly[neutral]: Durchs Glas.
inner: Sie weiß es. Irgendwie weiß sie es, wie Kinder Dinge wissen, die man ihnen nie erklärt hat.
# choice
narr: Der Himmel wird heller. Irgendwo draußen ruft ein Vogel, zum ersten Mal seit Tagen, und ein zweiter antwortet.
inner: Wenn ich jetzt die Platte ins Licht halte, bin ich zu Hause. In meiner Wohnung. Der Karton, die Lampe, die Heizung, die mitzählt. Mein Leben, alles, was ich kenne. Alle, die ich kenne.
inner: Wenn ich warte, bis die Sonne aufgeht, bleibe ich. Dann stehe ich morgen neben Tilly vor dem Coroner. Dann fahre ich mit Clara nach London. Dann bin ich Miss Hale, für immer.
inner: Beides ist wahr. Beides kostet etwas.
* [ehrlich] (Die Platte in die Kerze halten. Nach Hause gehen.) -> go
* [mitfuehlend] (Die Platte sinken lassen. Bleiben.) -> stay
# go
narr: Sie wickelt die Platte aus. Tilly sieht es und versteht, und ihr Gesicht bleibt ganz ruhig, so ruhig, wie man nur ist, wenn man sich vorgenommen hat, nicht zu weinen.
tilly[neutral]: Handschuh muss mit. Die gehört zu Ihnen.
yuumi: (Yuumi hat andere Pläne. Sie gräbt sich tiefer in Tillys Schürze und schnurrt, und als Tilly sie hochhebt, hängt sie mit allen vier Pfoten im Stoff.) {sfx:purr}
tilly[warm]: Geh mit deiner Miss, Handschuh. Geh. Ich hab doch jetzt Buchstaben.
narr: Sie löst Yuumis Krallen, eine nach der anderen, und legt sie Sera in den Arm.
? f:g_teach3 -> gift
-> light
# gift
narr: Sera nimmt Tillys Hand, und mit dem Finger schreibt sie ihr auf die Handfläche, langsam, Buchstabe für Buchstabe, damit sie es spürt: M. A. T. I. L. D. A.
tilly[warm]: Matilda.
sera: Matilda Crane. Schreib es so groß, wie du willst.
# light
sera: Tilly. Ich hab dich gehört. Vergiss das nicht.
tilly[neutral]: Nie, Miss.
narr: Sera hebt die Platte vor die Kerze. Das Licht fällt hindurch, und die Treppe wird zu einem Gewebe aus Grau, und darin sitzt ein Mädchen mit einer Kerze, und daneben eine blasse Frau mit einer Katze. {pause:900, mood:mystisch}
narr: Ein Ticken. Gleichmäßig. Metallisch. {sfx:radiator}
narr: Das Letzte, was sie sieht, ist Tillys Gesicht im ersten grauen Morgenlicht, und Tillys Hand, die sich hebt, nicht zum Winken, sondern so, wie man die Hand auf etwas legt, das man behalten will. {+f:end_go, go:wohnung@0.5, chap:6}
-> END
# stay
narr: Sie lässt die Platte in ihrem schwarzen Papier. Sie legt die Hand darauf, flach, wie Clara auf den Brief ihres Vaters.
narr: Tilly sieht es. Sie sagt nichts. Sie rückt nur ein kleines Stück näher, bis ihre Schulter an Seras Arm liegt.
narr: Über dem Moor hebt sich die Sonne aus dem Wasser, rot und rund und sehr langsam, und das Licht fällt durch das Fenster auf die Treppe, auf die Stufen, auf die Stelle, wo zwei in einer Nacht nebeneinander saßen, die sich nicht sehen konnten. {sfx:sunrise, pause:900}
narr: Irgendwo, sehr weit weg, hört eine Heizung auf zu ticken. Sera hört es nicht mehr. Sie weiß es trotzdem.
inner: Gut. {pause:600}
inner: Dann bin ich jetzt hier.
tilly[neutral]: Miss? Sie bleiben?
sera: Ich bleibe.
yuumi: (Yuumi gähnt, streckt sich über beide Schöße und schläft ein, als wäre damit alles geklärt.) {+f:end_stay, go:london@0.5, chap:6}
`;
