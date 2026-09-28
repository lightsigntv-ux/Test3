export default `
=== k5_start
kind: scene
when: ch=5 loc=halle
priority: 20
important: yes
---
narr: Der Regen hatte aufgehört. Man hörte nur noch, wie die alten Balken leise knackten. {music:k5}
narr: In der Halle brannte eine einzige Lampe, klein gedreht, genau wie in jener Nacht. Die Kamera stand auf ihrem Stativ, der Krepp lag zusammengefaltet daneben.
narr: Sera setzte sich auf die unterste Stufe. Sie hatte das Notizbuch auf den Knien und die Platte in ihrem schwarzen Papier neben sich.
inner: Ich muss das einmal ganz durchdenken. Von Anfang bis Ende. Jede Spur an ihren Platz.
inner: Und dann rede ich mit ihnen. Mit jedem einzeln. Bevor die Sonne aufgeht. {do:recon}

=== k5_after_recon
kind: event
when: ch=5 f:g_recon_done
priority: 20
important: yes
---
inner: Er ist nicht ermordet worden. Sein Herz hat einfach aufgehört. Niemand hat ihm etwas getan. Das ist die Wahrheit. Aber das Schlimmste ist etwas anderes.
inner: Das Schlimmste ist: In dieser Nacht war jeder hier an der falschen Tür. Clara bei der Frau, die sie verachtet. Lionel draußen im Regen. Mrs. Pryce an ihrem Tisch, mit einem Brief nach Kanada. Hobbes hat geschlafen. Miss Averley lag hinter einer Tür, an die sich niemand zu klopfen getraut hat. Und Mrs. Penrose hat ihre Tür abgeschlossen.
inner: Und das einzige Kind im Haus ist die Treppe rauf- und wieder runtergelaufen, mit einem Brief, den ihm keiner abgenommen hat.
inner: Aber er war nicht allein. Tilly hat seine Hand gehalten.
inner: „Wenn du die Glocke hörst, Edmund, hast du es gehalten.“ Die Glocke im Wasser hat er nicht gehört. Er hat selbst geläutet, mit dem Brief für Clara auf dem Tisch. Er hat sein Versprechen gehalten.
inner: Clara muss ihren Brief bekommen. Lionel muss wissen, was sein Vater zuletzt gesagt hat. Und die anderen – die sollen das auch nicht länger allein mit sich herumtragen. {+f:k5_talk}

=== k5_clara
kind: topic
npc: clara
title: Der Brief
when: ch=5 f:k5_talk !f:g_letter_read
important: yes
---
narr: Clara saß im Arbeitszimmer im Sessel ihres Vaters, eine Decke um die Schultern und das Wetterbuch im Schoß. Sie schlief nicht. Sie sah auf das dunkle Fenster. {music:letter}
? f:k4_together -> tilly
sera: Miss Clara? Ich habe hier etwas für Sie. Es ist nicht von mir.
-> give
# tilly
narr: Hinter Sera stand Tilly im Türrahmen, barfuß. Sie hatte die Hände unter der Schürze versteckt.
sera: Miss Clara? Tilly und ich haben etwas für Sie. Es ist nicht von uns.
# give
narr: Sera legte den Brief auf das Wetterbuch. Die Schrift war klein, eng und genau. „Für Clara. Nur für sie.“
clara[surprised]: Das ist – das ist seine Handschrift.
narr: Sie öffnete ihn nicht sofort. Sie hielt ihn eine Weile ganz vorsichtig, nur an den Rändern. Dann brach sie das Siegel. {sfx:paper, pause:600}
letter: Clara, es ist halb zwei. Du bist gegangen, und du hattest recht. Ich schreibe es auf, weil ich es nicht sagen kann. Das weißt du. Das hast du von mir.
letter: Ich habe dir nicht gesagt, warum London warten muss. Hier ist der Grund. Lionel hatte Schulden, 1840 Pfund, bei Leuten, die man nicht warten lässt. Ich habe sie am 8. bezahlt. Es war fast alles, was ich an freiem Geld hatte. Er weiß es nicht; ich wollte, dass er fragt. Das war Hochmut. Sag es ihm, wenn ich es nicht mehr kann.
letter: Dr. Wilkes in Bath gibt mir noch Monate. Harriet weiß es; ich habe sie schwören lassen. Sei ihr nicht böse. Sie hat gehorcht. Das ist ihr Unglück, seit fünfzig Jahren.
letter: Die Institution in Bath will meine Sammlung kaufen. Das Geld reicht für die Henrietta Street, bis zum Examen. Morgen früh unterschreibe ich, dass die Sammlung dir gehört. Sollte mir vorher etwas zustoßen, bitte Lionel darum. Er ist besser, als er glaubt. Das hat ihm keiner gesagt, am wenigsten ich.
letter: Deine Mutter hat mich versprechen lassen, dass du wählen darfst. Ich dachte, es genügt, dir nichts zu verbieten. Es genügt nicht. Man muss auch etwas geben.
letter: Heute Abend hat eine Frau aus Bath meine eigenen Worte mit Lucindas Stimme gesprochen. Ich habe mich geschämt, weil ich sie ihr erzählt hatte und weil ich gehofft hatte. Du hast recht, es war Betrug. Aber du irrst dich, wenn du glaubst, dass es deshalb nicht wehtut.
letter: Die Kamera steht seit Mitternacht vor der Treppe. Ich will Harriet beweisen, dass dort nichts umgeht. Sollte doch etwas auf der Platte sein: Entwickle sie trotzdem. Man verwirft kein Ergebnis, nur weil es einem nicht passt. Das ist das Einzige, was ich dir wirklich beigebracht habe.
letter: Wähle, Clara. – Dein Vater, E. A. {+f:g_letter_read, +c:c30}
narr: Clara las bis zum Ende. Dann suchte sie eine Zeile weiter oben und las sie noch einmal. Sie legte die Hand mit den schwarzen Fingerspitzen flach auf das Papier. {pause:1200}
clara[sad]: „Entwickle sie trotzdem.“
narr: Sie lachte, ein kleines, kaputtes Lachen. Dann weinte sie mit offenen Augen und wischte sich die Tränen nicht ab.
clara[sad]: Er hat mir geschrieben. Nachdem ich ihm gesagt hatte, Mama hätte sich für ihn geschämt. Er hat sich hingesetzt und mir das hier geschrieben. Und dann – {+f:g_letter_known}
clara[sad]: Miss Hale. Wie ist er gestorben? War er – war er allein?
? f:k4_together -> t_speaks
* [ehrlich] Nein, war er nicht. Tilly war bei ihm. Sie hat seine Hand gehalten. {clara+1} -> s_tells
* [mitfuehlend] Nein. Er war nicht allein. Eigentlich sollte Tilly Ihnen das selbst erzählen, wenn sie kann. {clara+1} -> s_tells
# t_speaks
narr: Tilly trat einen Schritt ins Zimmer. Sie stand barfuß auf dem Teppich des Herrn und sah auf ihre Zehen.
tilly[sad]: Nein, Miss. Ich war doch da. {pause:500}
tilly[sad]: Er hat mir den Brief gegeben, und ich bin rauf zu Ihnen und hab geklopft. Ich hab so lang geklopft. Und wie ich wieder runterkam, lag er da. Ich hab seine Hand gehalten. Bis er – bis er aufgehört hat. {reveals:f10}
tilly[sad]: Er hat noch was gesagt. „Es ist bezahlt. Sag’s ihm.“ Ich weiß nich, wem, Miss. Ich weiß es nich. {+f:g_tilly_to_clara, reveals:f26}
narr: Clara stand auf, und die Decke fiel ihr von den Schultern. Sie kniete sich im Nachthemd vor Tilly auf den Teppich. Dann nahm sie Tillys rote, rissige Hände in ihre schwarzen.
clara[sad]: Ich war nicht da. Du hast geklopft, und ich war nicht da.
clara[sad]: Du hast an meine Tür geklopft. Und ich saß bei der Frau, die ich eine Betrügerin nenne, und wollte meine tote Mutter hören. Nicht meinen Vater, der noch gelebt hat.
clara[sad]: Danke. {pause:700}
clara[sad]: Ihm. „Es ist bezahlt. Sag’s ihm.“ Er meinte Lionel, Tilly. Er meinte meinen Bruder.
-> after
# s_tells
narr: Sera erzählte es ihr. Die Glocke, die Treppe, das Klopfen, die Hand, die letzten Worte. Clara hörte zu und unterbrach sie kein einziges Mal.
clara[sad]: Sie hat an meine Tür geklopft. Und ich saß bei der Frau, die ich eine Betrügerin nenne, und wollte meine tote Mutter hören. Nicht meinen Vater, der noch gelebt hat.
clara[sad]: Tilly. Ich habe ihr einmal ein T gezeigt. Und danach habe ich sie vergessen.
clara[sad]: „Es ist bezahlt. Sag’s ihm.“ Lionel. Er meinte Lionel. {hints:f03}
# after
clara[neutral]: Jemand muss es ihm sagen. Heute Nacht noch. Nicht der Coroner. Nicht Tante Harriet.
clara[neutral]: Sie, Miss Hale. Ich kann es nicht, ohne ihn anzuschreien. Und ihn schreien schon genug Leute an. Allen voran er selbst.

=== k5_lionel
kind: topic
npc: lionel
title: Es ist bezahlt
when: ch=5 f:k5_talk anyf:g_letter_read,g_tilly_spoke !f:g_lionel_confessed !f:g_lionel_silent
important: yes
---
narr: Der Captain stand im Stall bei dem Braunen, die Laterne am Haken, den Rock offen. Er war nüchtern. Man sah ihm an, dass er seit drei Nächten nicht geschlafen hatte. {music:lionel}
lionel[neutral]: Miss Hale. Auch schlaflos? Heute Nacht sitzt das ganze Haus wach und wartet auf den Morgen. Wie vor einem Kriegsgericht.
? f:g_lionel_told_paid -> knows
sera: Captain. Ihr Vater hat Ihre Schulden bezahlt. Alle. Am 8. November. Es steht in seinem Notizbuch. Und auf dem Blatt, das Sie verbrannt haben. {+f:g_lionel_told_paid}
lionel[surprised]: Bezahlt.
narr: Er musste sich an der Box festhalten. Der Braune schnaubte und stieß ihn mit der Nase an.
# knows
sera: Ich weiß, was er zuletzt gesagt hat. Tilly war bei ihm, als er starb. Er hat gesagt: „Es ist bezahlt. Sag’s ihm.“ {+f:g_lionel_told_words}
narr: Der Captain hörte zu. Er stand ganz still, und Sera konnte sehen, wie er ein Wort nach dem anderen verstand. {pause:1000}
lionel[sad]: Ihm. {pause:500}
lionel[sad]: Mir.
lionel[sad]: Er hat an mich gedacht. Ganz zum Schluss. Er lag mit dem Kopf auf dem Teppich und hat an mich gedacht. Und ich stand draußen im Regen und habe mir selbst leidgetan.
lionel[sad]: Ich war bei ihm, Miss Hale. Das wissen Sie ja. Wir haben gestritten. Ich habe ihn angeschrien wegen einer Unterschrift, weil ich dachte, er enterbt mich. Er wollte etwas sagen. „Ich habe dafür gesorgt, dass du –“ Und ich habe ihn nicht ausreden lassen.
lionel[sad]: Dann griff er sich an die Brust. Er setzte sich hin und wurde ganz grau im Gesicht. Und ich habe gesagt: „Spielen Sie mir nicht den Sterbenden vor, Vater.“ {+s:s31, reveals:f07}
narr: Er sprach ganz ruhig, in kurzen, sachlichen Sätzen.
lionel[sad]: Und er sagte: „Lionel. Die Glocke.“ Und ich dachte, er redet von Mutter. Von dieser verfluchten Séance und der Glocke im Wasser. Ich habe gesagt: „Die Glocke im Wasser. Gute Nacht, Vater.“ Und bin durch die Terrassentür raus. {reveals:f27}
* [ehrlich] Er meinte nicht die Glocke im Wasser. Er meinte die Klingel. Sie sollten für ihn läuten. {lionel+1} -> bell
* [mitfuehlend] (Abwarten und ihm Zeit lassen.) {lionel+1} -> bell2
# bell2
narr: Sein Blick fiel auf die Klingelschnur in der Stallecke, die zum Kutscherzimmer führte. Er sah sie lange an.
# bell
lionel[surprised]: Die Klingel.
lionel[sad]: Er wollte, dass ich läute. Und ich habe mich über Mutters Sage lustig gemacht, ihm ins Gesicht, und bin gegangen.
lionel[sad]: Und dann hat er selbst geläutet. Und Tilly kam. Dreizehn Jahre alt, barfuß. Sie ist gekommen.
narr: Er drehte sich zu dem Braunen und legte die Stirn an seinen Hals. Seine Schultern zitterten, aber er gab keinen Laut von sich.
narr: Nach einer langen Weile richtete er sich wieder auf.
lionel[neutral]: Der Coroner kommt in drei Stunden. Er wird wissen wollen, wer zuletzt bei meinem Vater war.
? f:g_letter_read -> letter
-> askc
# letter
sera: Er hat Clara geschrieben, in dieser Nacht. Sie soll Sie um seine Sammlung bitten, für London. Und über Sie schreibt er: Er ist besser, als er glaubt.
lionel[sad]: Das hat er über mich geschrieben. {pause:600}
# askc
* [mitfuehlend] Sie konnten es nicht wissen. Jetzt wissen Sie es. Was Sie daraus machen, entscheiden Sie selbst. {lionel+1} -> decide
* [direkt] Sie müssen es dem Coroner sagen. Tilly darf da nicht allein stehen. -> push
* [schweigen] (Nichts sagen. Einfach neben ihm stehen bleiben.) {lionel+1} -> decide
# push
? t:lionel>=9 -> speak
lionel[angry]: Müssen. Mein ganzes Leben lang hat man mir gesagt, was ich muss.
-> silent
# decide
? t:lionel>=7 -> speak
-> silent
# speak
lionel[neutral]: Ich sage es ihm. Alles. Den Streit, die Terrasse, das Feuer. Und dass ich ihn bis zum Morgen habe liegen lassen. {+f:g_lionel_confessed}
lionel[neutral]: Da soll ein Kind aus dem Arbeitshaus vor dem Coroner stehen und erklären, warum es bei meinem Vater war. Und ich sitze daneben und sage, ich hätte geschlafen wie ein Stein? Nein.
lionel[sad]: Es wird einen Skandal geben. Das Regiment wird mir nahelegen, den Dienst zu quittieren. Tante Harriet redet eine Woche nicht mit mir, und danach nie wieder.
lionel[neutral]: Und Clara bekommt ihre Sammlung. Und ihr London. So hätte er es gewollt. Wenn er es aufgeschrieben hat, ist es ein Befehl. Und Befehle befolgen, das habe ich gelernt.
lionel[warm]: Das wenigstens.
-> END
# silent
lionel[sad]: Ich kann nicht, Miss Hale. Nicht vor Tante Harriet. Nicht vor einem Coroner, der mit dem Pfarrer Whist spielt. Mit dem Pfarrer, der Mutters Grabstein unchristlich genannt hat.
lionel[sad]: Ich zahle, was er Clara versprochen hat. Jeden Penny. Aber sagen kann ich es nicht. Noch nicht. Vielleicht nie. {+f:g_lionel_silent}
lionel[neutral]: Sagen Sie es, wenn Sie müssen. Ich werde es nicht abstreiten. Ich werde nur – schweigen. Wie er.
inner: Wie er. Das ist so traurig. Und ich glaube, es ist das Ehrlichste, was er heute gesagt hat.

=== k5_hobbes
kind: topic
npc: hobbes
title: Morgen früh
when: ch=5 f:k5_talk
---
narr: Hobbes stand in der Halle neben der Kamera, eine Kerze in der Hand, und sah die Treppe hinauf. Er trug keinen Frack, nur eine alte Weste. Seine Hände waren alt und sehr sauber.
? f:g_hobbes_will_speak -> will
? t:hobbes>=4 -> open
hobbes[neutral]: Miss sollte zu Bett gehen. Der Coroner kommt früh.
-> END
# open
? k:s25 -> will
hobbes[sad]: Ich fand ihn am Boden, Miss. Vor dem Kamin. Ich habe ihn in den Sessel gesetzt und die Gläser fortgeräumt. Damit niemand fragt, wer bei ihm war. {+s:s25, reveals:f14}
hobbes[sad]: Neunundvierzig Jahre. Und in der einen Nacht, in der er mich gebraucht hätte, habe ich geschlafen.
# will
hobbes[neutral]: Ich werde dem Coroner sagen, wie ich den Herrn gefunden habe. Nicht, wie ich ihn gern gefunden hätte. {+f:g_hobbes_confessed}
hobbes[neutral]: Und wenn das Küchenmädchen aussagen muss, steht sie nicht allein vor dem Tisch. Das Haus steht hinter ihr. Ich stehe hinter ihr.
narr: Er sagte „das Küchenmädchen“. Dann hielt er inne.
hobbes[neutral]: Tilly. Sie heißt Tilly. {+f:g_hobbes_stands, hobbes+1}

=== k5_pryce
kind: topic
npc: pryce
title: Morgen früh
when: ch=5 f:k5_talk
---
narr: In der Küche brannte der Herd. Mrs. Pryce und Tilly saßen am Tisch, zwei Becher Tee zwischen sich. Yuumi lag zusammengerollt in Tillys Schoß.
? !f:g_pryce_confessed -> conf
-> tea
# conf
pryce[sad]: Setzen Sie sich, Miss. Ich hab dem Kind heut Nacht was gesagt. Das hätt ich ihm schon vor drei Tagen sagen müssen.
pryce[sad]: Ich hab die Glocke gehört. Ich hab sie gehen lassen, und ich bin sitzen geblieben. {+s:s26, reveals:f15, +f:g_pryce_confessed}
# tea
tilly[tense]: Miss? Was macht der Coroner mit mir?
* [ehrlich] Er fragt dich, was du gesehen hast. Und du sagst es ihm. Genau so, wie du es mir erzählt hast. -> a
* [mitfuehlend] Er hört dir zu. Und diesmal hören alle anderen auch zu. -> a
# a
tilly[tense]: Und wenn er mir nich glaubt? Ich bin doch vom Arbeitshaus.
pryce[warm]: Dann kriegt er keinen Ingwerkeks von mir. Dann glaubt er dir schon, na?
narr: Tilly lachte und erschrak über sich selbst. Mrs. Pryce legte ihr die Hand auf die Haube, ein bisschen ungeschickt.
pryce[neutral]: Man holt so ein Kind nicht aus dem Arbeitshaus, damit es wieder zurückmuss. Ich steh neben dir, cariad. Und Mr. Hobbes auch. Der weiß es bloß noch nich.
tilly[neutral]: Dann sag ich’s eben. Alles. {+f:g_tilly_will_speak, tilly+1}

=== k5_harriet
kind: topic
npc: harriet
title: Clara
when: ch=5 f:k5_talk
---
narr: Miss Averley saß fertig angezogen im Salon, vor einer Tasse Tee, die längst kalt war. Sie hatte die Vorhänge einen Spalt geöffnet. Draußen war es noch schwarz.
? f:g_letter_read -> knows
harriet[neutral]: Sie sind auch noch wach, Miss Hale. Setzen Sie sich.
harriet[neutral]: Ich höre Türen gehen. Ich höre Clara weinen. Ich höre Lionel nicht trinken. In diesem Haus geschieht heute Nacht etwas, und niemand sagt es mir.
-> talk
# knows
harriet[sad]: Clara war bei mir. Sie hat mir einen Brief gezeigt. Sie hat nicht geschrien. Es wäre mir lieber gewesen.
harriet[sad]: „Sei ihr nicht böse. Sie hat gehorcht. Das ist ihr Unglück, seit fünfzig Jahren.“ Das hat er über mich geschrieben. Er hatte recht. Er hatte immer recht, es war unerträglich. {+f:g_harriet_confessed}
# talk
* [mitfuehlend] Clara möchte nach London, das wissen Sie. {harriet+1} -> a
* [direkt] Lassen Sie sie gehen? -> a
# a
harriet[neutral]: Mich hat man einmal nicht gehen lassen, Miss Hale.
? t:harriet>=8 -> deep
harriet[neutral]: Ich werde darüber nachdenken. So etwas entscheidet man nicht in einer Nacht.
-> END
# deep
narr: Sie stand auf, ging zum Fenster und blieb vor dem Spalt zwischen den Vorhängen stehen, mit dem Rücken zum Zimmer.
harriet[sad]: 1854 wollte ich nach Skutari. Zu den Schwestern, mit der zweiten Gruppe, die im Dezember fuhr. Ich hatte mich schon gemeldet. Ich war vierunddreißig und hatte noch nie etwas gewollt.
harriet[sad]: Vater hat es verboten. Eine Averley pflegt keine Soldaten. Henry war schon auf der Krim. Also habe ich gewartet. Im Warten war ich gut. Ende November kam der Brief.
harriet[neutral]: Ich habe zwölf Jahre lang Geister gerufen, Miss Hale. Weil ich nicht ertragen konnte, dass ich zu Hause geblieben bin, als ich hätte gehen können.
narr: Sie drehte sich um. Ihr Gesicht war trocken. Nur ihre Hand an der Jet-Brosche zitterte.
harriet[neutral]: Clara wird gehen. Wenn Lionel nicht zahlt, zahle ich. Ich habe eine Rente, die ich nicht brauche. Und eine Brosche, die ich lange genug getragen habe. {+f:g_harriet_frees}
harriet[neutral]: Und sagen Sie es ihr nicht. Ich will es ihr selbst sagen. Dieses eine Mal will ich diejenige sein, die etwas gibt.
harriet[tense]: Und Lionel werde ich es nicht leicht machen, was immer er getan hat. Nicht diese Woche. Vielleicht nächstes Jahr. Man braucht ja etwas, worauf man sich freuen kann.

=== k5_penrose
kind: topic
npc: penrose
title: Vor dem Morgen
when: ch=5 f:k5_talk
---
narr: Mrs. Penrose stand oben auf der Galerie am Geländer, genau an der Stelle von damals. Sie sah hinunter in die Halle, auf die Treppe und die Kamera. Sie trug schon ihr Reisekleid.
penrose[neutral]: Ich wollte wissen, ob ich es noch einmal sehe. Das Mädchen. Die Frau. Sie wissen schon.
penrose[warm]: Nichts. Nur eine Treppe. Wie enttäuschend. Und wie beruhigend.
? t:penrose>=5 -> honest
penrose[neutral]: Mit dem ersten Boot bin ich fort, meine Liebe. Grüßen Sie Ihre Katze.
-> END
# honest
penrose[neutral]: Ich sage es Miss Averley, bevor ich gehe. Und Miss Clara. Dass ich nie etwas anderes gehört habe als Menschen. Dass die Glocke im Wasser aus Edmunds eigenem Mund kam, in Bath, im August. {+f:g_penrose_confessed, reveals:f20}
penrose[sad]: Das wird mich meine Kundschaft in Bath kosten. So etwas spricht sich herum. Vielleicht lese ich wieder aus der Hand. Da lügt man wenigstens nur über die Zukunft.
? f:g_sera_told_penrose -> known
* [ehrlich] Die Frau, die Sie gesehen haben – das war ich. {+f:g_sera_told_penrose, penrose+1} -> told
* [mitfuehlend] Das wäre dann die eine ehrliche Sache, die Sie tun wollten. {penrose+1} -> end
# told
penrose[neutral]: Ich weiß, Kind. Das wusste ich schon in der Bibliothek. {hints:f23}
-> fin
# known
penrose[neutral]: Das hatten wir schon, Sie und ich. Zweimal muss man so etwas nicht sagen.
# fin
penrose[warm]: Gehen Sie nach Hause, wo immer das ist. Und nehmen Sie das Tier mit. Sonst glaubt man hier noch an Geister.
-> END
# end
penrose[neutral]: Eine. Ja. Irgendwo muss man anfangen.

=== k5_ready
kind: event
when: ch=5 f:g_letter_read anyf:g_lionel_confessed,g_lionel_silent
priority: 10
---
narr: Im Osten, über dem Moor, war der Himmel nicht mehr schwarz. Er war dunkelblau geworden. {sfx:bird}
inner: Es wird Zeit. Zum Fenstersitz auf der Treppe. Wo ich in Avocado-Socken aufgewacht bin und Tilly mich für einen Geist gehalten hat und … wo war ich? Ach ja. Da, wo ich angekommen bin.
inner: Ich kann vorher noch mit den anderen reden, wenn ich will. Aber wenn die Sonne aufgeht, ist es zu spät. {+f:k5_ready}

=== k5_dawn
kind: examine
target: h_fenstersitz
when: ch=5 f:k5_ready
priority: 30
important: yes
---
narr: Der Fenstersitz auf dem Halbpodest. Der Vorhang war aufgezogen. Hinter der Scheibe lag das Moor, grau und glatt, und darüber wurde ein Streifen Himmel langsam heller. {music:dawn}
narr: Sera setzte sich. Sie hatte die Platte in ihrem schwarzen Papier auf dem Schoß. Auf dem Sims stand eine Kerze.
narr: Leise Schritte auf der Treppe, barfuß. Es war Tilly. Sie trug Yuumi im Arm, und Yuumi ließ es sich sehr zufrieden gefallen.
tilly[neutral]: Grauchen wollt zu Ihnen. Sie hat an der Küchentür gekratzt.
narr: Tilly setzte sich neben sie auf den Rand des Polsters. In jener Nacht hatte sie eine Stufe tiefer gesessen. Yuumi rollte sich zwischen ihnen ein.
tilly[neutral]: Sie gehn weg, Miss. Oder?
tilly[neutral]: Dahin, wo Sie herkommen. Wo’s anders is.
* [ehrlich] Ich komme aus einer Zeit, die es noch nicht gibt, Tilly. Fast hundertfünfzig Jahre von hier. Ich hab in einer Glasplatte dein Flüstern gehört, und dann war ich hier. {+f:g_sera_told_tilly, tilly+1} -> true
* [mitfuehlend] Von sehr weit weg. So weit, dass man mit dem Boot nicht hinkommt. {+f:g_sera_told_tilly} -> soft
# true
tilly[surprised]: Hundertfünfzig Jahre. {pause:600}
tilly[neutral]: Gibt’s da noch Küchenmädchen?
sera: Nicht so wie dich.
tilly[neutral]: Und Arbeitshäuser?
sera: Nein. Keine Arbeitshäuser mehr.
narr: Tilly dachte lange nach und runzelte die Stirn. Genau so sahen Seras Schüler aus, wenn sie an einer schweren Aufgabe saßen.
tilly[warm]: Dann is es da schön.
-> choice
# soft
tilly[neutral]: Nich mit dem Boot. {pause:400}
tilly[neutral]: Durchs Glas.
inner: Sie weiß es. Keine Ahnung, woher. Aber sie weiß es.
# choice
tilly[neutral]: Mr. Hobbes sagt, das mit der Glocke im Wasser is Unsinn. Aber Mrs. Pryce sagt, wer sie hört, dem wird vergeben.
tilly[warm]: Ich hab sie gehört, die Glocke. Die kleine, von Grauchen. Und Mrs. Pryce hab ich vergeben. Also stimmt’s doch, irgendwie.
narr: Der Himmel wurde heller. Draußen rief ein Vogel, und ein zweiter antwortete.
inner: Wenn ich jetzt die Platte ins Licht halte, bin ich zu Hause. In meiner Wohnung, mit dem Karton, der Lampe und der Heizung. Und gegen elf kommt Fritz. Mein ganzes Leben. Alle, die ich kenne.
inner: Wenn ich warte, bis die Sonne aufgeht, bleibe ich. Dann stehe ich heute früh neben Tilly vor dem Coroner. Dann fahre ich mit Clara nach London. Dann bin ich die Miss, die aus dem Wasser kam. Ohne Zeugnis und ohne Vergangenheit, für immer.
inner: Beides stimmt. Und beides kostet was.
* [ehrlich] (Die Platte vor die Kerze halten und nach Hause gehen.) -> go
* [mitfuehlend] (Die Platte sinken lassen und bleiben.) -> stay
# go
narr: Sera wickelte die Platte aus. Tilly sah es und verstand. Ihr Gesicht blieb ganz ruhig.
tilly[neutral]: Grauchen muss mit. Die gehört zu Ihnen.
yuumi: (Yuumi hatte andere Pläne. Sie grub sich tiefer in Tillys Schürze und schnurrte. Als Tilly sie hochhob, hing sie mit allen vier Pfoten im Stoff fest.) {sfx:purr}
tilly[warm]: Geh mit deiner Miss, Grauchen. Geh schon. Ich hab doch jetzt Buchstaben.
narr: Sie löste Yuumis Krallen, eine nach der anderen, und legte sie Sera in den Arm.
? f:g_teach3 -> gift
-> light
# gift
narr: Sera nahm Tillys Hand und schrieb ihr mit dem Finger auf die Handfläche, langsam, Buchstabe für Buchstabe, damit sie es spürte: M. A. T. I. L. D. A.
tilly[warm]: Matilda.
sera: Matilda Crane. Schreib es so groß, wie du willst.
# light
sera: Tilly. Ich hab dich gehört. Vergiss das nicht.
tilly[neutral]: Nie, Miss.
narr: Sera hielt die Platte vor die Kerze. Das Licht fiel hindurch, und die Treppe wurde hellgrau. Darauf saßen ein Mädchen mit einer Kerze und daneben eine blasse Frau mit einer Katze. {pause:900, mood:mystisch}
narr: Dann ein Ticken, gleichmäßig und metallisch. Die Heizung. {sfx:radiator}
narr: Das Letzte, was sie sah, war Tillys Gesicht im ersten grauen Morgenlicht. Tilly hob die Hand, aber sie winkte nicht. Sie hielt sie nur offen zu Sera hin. {+f:end_go, go:wohnung@0.5, chap:6}
-> END
# stay
narr: Sera ließ die Platte in ihrem schwarzen Papier. Sie legte die Hand flach darauf.
narr: Tilly sah es. Sie sagte nichts. Sie rückte nur ein Stück näher, bis ihre Schulter an Seras Arm lag.
narr: Über dem Moor stieg die Sonne aus dem Wasser, rot und rund und sehr langsam. Das Licht fiel durch das Fenster auf die Treppe, auf die Stelle, wo die beiden in jener Nacht nebeneinander gesessen hatten, ohne sich zu sehen. {sfx:sunrise, pause:900}
narr: Irgendwo sehr weit weg hörte eine Heizung auf zu ticken. Sera hörte es nicht mehr. Aber sie wusste es.
inner: Okay. {pause:600}
inner: Dann bin ich jetzt hier.
tilly[neutral]: Miss? Sie bleiben?
sera: Ja. Ich bleibe.
yuumi: (Yuumi gähnte, streckte sich über beide Schöße und schlief ein. Für sie war die Sache damit erledigt.) {+f:end_stay, go:london@0.5, chap:6}
`;
