export default `
=== k1_wake
kind: scene
when: ch=1 loc=halle
priority: 20
important: yes
---
narr: Jemand riss den Vorhang auf. Kerzenlicht fiel herein. {sfx:curtain, music:k1}
tilly[surprised]: Jesses!
narr: Vor ihr stand ein Mädchen, vielleicht dreizehn Jahre alt. Es trug eine Haube, die ihm zu groß war, und hielt einen Kohleneimer, der gleich herunterzufallen drohte.
inner: Okay. Das ist nicht meine Wohnung. Ich liege auf einer gepolsterten Bank in einer Fensternische. Und draußen ist … Wasser. Sehr viel Wasser.
tilly[tense]: Sind Sie ’n Geist, Miss? Sagen Sie’s ehrlich. Ich hab heut Nacht schon einen gehört.
* [humor] Wenn ich ein Geist wäre, hätte ich mir wärmere Socken ausgesucht. {tilly+1} -> w_humor
* [ehrlich] Ehrlich gesagt weiß ich gerade selbst nicht so genau, was los ist. {tilly+1} -> w_honest
* [direkt] Wo bin ich hier? -> w_direct
# w_humor
tilly[surprised]: … Geister reden nich von Socken.
tilly[neutral]: Glaub ich.
-> w_cat
# w_honest
tilly[neutral]: Das kenn ich. Das hab ich jeden Morgen, wenn Mrs. Pryce „Tilly!“ ruft.
-> w_cat
# w_direct
tilly[surprised]: Na, in Averley, Miss. Averley Hall. Wo solln Sie denn sonst sein, mitten im Wasser?
-> w_cat
# w_cat
yuumi: (Aus dem Vorhang schob sich ein grauer Kopf. Ein Glöckchen klingelte.) {sfx:bell}
tilly[surprised]: Da! Das hab ich heut Nacht gehört! Hat was geklingelt auf der Treppe, so ganz fein. {+s:s07}
tilly[warm]: Und die hat ja Handschuhe an!
inner: Yuumi. Gott sei Dank. Wenigstens du bist echt.
yuumi: (Yuumi streckte sich, gähnte und sah Tilly neugierig an.)
tilly[neutral]: Sie sind aber nich von hier, Miss. Das seh ich an Ihren … an Ihren Hosen.
inner: Jeans, ein Pulli mit Loch am Ellbogen und Socken mit Avocados drauf. Und das Mädchen trägt eine Schürze bis zu den Knöcheln, Wollstrümpfe, derbe Schnürschuhe. Das ist kein Kostüm. So sahen Dienstmädchen um 1870 aus.
tilly[tense]: Wenn Mrs. Pryce Sie so sieht – oder Mr. Hobbes! Heut is kein Tag für so was, Miss. Heut gar nich.
* [mitfuehlend] Was ist denn heute? Du siehst ganz müde aus. {tilly+1} -> w_day
* [direkt] Kannst du mir helfen? Ich brauche andere Kleider. -> w_help
# w_day
tilly[sad]: Ich hab geschlafen, Miss. Ehrlich. Ich schlaf immer. Wie ’n Sack Rüben. {+s:s08, lie:f09}
inner: Das kam sehr schnell. Zu schnell, finde ich.
# w_help
tilly[neutral]: Oben in der Wäschekammer steht die Truhe von der Miss, die früher bei Miss Averley war. Die is weg, aber ihre Sachen nich.
tilly[tense]: Kommen Sie. Schnell, bevor der Herd ausgeht. Die Treppe rauf und dann links. Und bringen Sie die Katze mit.
narr: Tilly griff nach ihrem Eimer und lief die Treppe hinauf. Sie hielt sich dicht an der Wand und trat nicht auf die Mitte der Stufen. {+f:k1_follow}

=== k1_linen
kind: scene
when: ch=1 loc=galerie f:k1_follow
priority: 20
---
narr: Die Wäschekammer roch nach Lavendel und Stärke. Tilly kniete vor einer Truhe und warf Kleider, Unterröcke und Strümpfe auf den Boden.
tilly[neutral]: Miss Finch war größer als Sie. Und breiter. Aber sie hat’s dagelassen, weil’s nich mehr modern war, sagt Mrs. Pryce.
narr: Ein dunkelgrünes Wollkleid, Unterröcke und ein Korsett mit Schnüren. Tilly hielt das Korsett hoch und grinste.
inner: Das Kleid ist ein paar Jahre alt, der Rock ist noch für eine Krinoline geschnitten. Kein Wunder, dass Miss Finch es dagelassen hat. Und ein Korsett. Natürlich.
* [humor] Ist das zum Anziehen oder zum Fesseln? {tilly+1} -> l_a
* [mitfuehlend] Warum hilfst du mir eigentlich? {tilly+1} -> l_b
# l_a
tilly[warm]: Beides, Miss.
-> l_c
# l_b
tilly[neutral]: Weiß nich.
tilly[sad]: Weil Sie auf der Treppe waren. Und weil keiner – weil man halt hilft.
inner: Weil keiner was? Sie beißt sich auf die Lippe. Da wollte sie eigentlich noch was sagen.
# l_c
narr: Tilly schnürte und zog und zupfte. Sera bekam kaum noch Luft und hielt sich am Regal fest.
narr: Dann rief unten eine Männerstimme. Nicht laut, aber man hörte sie im ganzen Haus. {sfx:voiceFar}
hobbes: Mrs. Pryce! Mrs. Pryce, bitte. Sofort.
tilly[tense]: Das is Mr. Hobbes. So ruft der nie. Nie. {pause:500}
narr: Tilly wurde blass. Sie sah nicht überrascht aus. Eher so, als hätte sie darauf gewartet.
tilly[sad]: Ich muss runter. Miss – Sie sagen keinem, wo Sie das Kleid herhaben. Und ich sag keinem, wo ich Sie gefunden hab. Ja?
* [ehrlich] Versprochen. {tilly+2, +f:k1_pact} -> l_end
* [direkt] Tilly, was ist passiert? -> l_q
# l_q
tilly[tense]: Weiß nich! Versprechen Sie’s?
* [ehrlich] Versprochen. {tilly+1, +f:k1_pact} -> l_end
* [schweigen] (Nicken.) {+f:k1_pact} -> l_end
# l_end
narr: Tilly war schon weg, bevor die Tür zufiel. Yuumi saß auf Miss Finchs Unterröcken und sah sehr zufrieden aus. {+f:k1_dressed}
inner: Okay. Ruhig atmen. Ich trage ein Korsett, und unten ist irgendwas Schlimmes passiert. Fritz würde jetzt sagen: eins nach dem anderen.
inner: Also gut. Ich gehe runter und finde raus, wo ich bin.

=== k1_harriet
kind: scene
when: ch=1 loc=halle f:k1_dressed
priority: 20
important: yes
---
narr: In der Halle ist alles anders als vorhin. Die Vorhänge sind zugezogen, auf dem Tisch brennen Kerzen am hellen Morgen, und die große Standuhr schweigt. {music:grief}
narr: Auf der untersten Stufe steht eine Frau ganz in Schwarz, so gerade, als hielte sie sich an einem unsichtbaren Stab fest. Neben ihr ein alter Diener im Frack.
harriet[tense]: Wer sind Sie?
inner: Gute Frage. Sehr gute Frage.
harriet[neutral]: Oh. Sie müssen Miss Hale sein. Die Agentur schrieb, Sie kämen am Mittwoch. Ich hatte Sie nicht vor dem Mittag erwartet, und nicht bei diesem Wasser.
* [ehrlich] Ich … ich heiße Sera. -> h_name
* [luege] Ja. Miss Hale. Ich bin früher gekommen. -> h_boat
* [schweigen] (Nicken und einen Knicks versuchen.) -> h_curtsy
# h_name
harriet[neutral]: Sarah. Gewiss. Miss Sarah Hale.
inner: Sarah. Na gut. Ich bin also Miss Hale. Nicht gelogen. Nur eine Verwechslung, die ich nicht korrigiere.
-> h_boat
# h_curtsy
narr: Es wird ein Knicks, der irgendwo zwischen Ballett und Stolpern stecken bleibt.
harriet[neutral]: Nun. Die Agentur schrieb, Sie seien aus gutem Hause. Nicht, Sie seien Tänzerin. {sus+1}
# h_boat
harriet[neutral]: Wie sind Sie über den Damm gekommen?
* [luege] Mit einem Boot. {+f:k1_said_boat} -> h_boat2
* [ausweichend] Es war eine lange Nacht. -> h_boat3
# h_boat2
harriet[neutral]: Bei diesem Wasser. Man wird den Mann gut bezahlt haben.
-> h_news
# h_boat3
harriet[neutral]: Das war es für uns alle.
# h_news
harriet[sad]: Sie kommen in ein Trauerhaus, Miss Hale. Mein Bruder ist in dieser Nacht verschieden. {pause:700}
harriet[neutral]: Hobbes hat ihn heute früh gefunden.
hobbes[neutral]: Um Viertel nach sechs, Madam. In seinem Sessel. Der Herr war friedlich entschlafen. {+s:s01, lie:f14}
inner: Friedlich. Er sagt es wie einen Satz, den man sich selbst oft genug vorgesagt hat.
* [mitfuehlend] Das tut mir sehr leid. {harriet+1} -> h_c1
* [ehrlich] Ich weiß nicht, was ich sagen soll. {harriet+1} -> h_c2
* [direkt] Woran ist er gestorben? {harriet-1} -> h_c3
# h_c1
harriet[neutral]: Man sagt das. Es ist freundlich von Ihnen, es zu sagen.
-> h_task
# h_c2
harriet[neutral]: Dann sagen Sie nichts, Miss Hale. Das ist in solchen Stunden meist das Klügste.
-> h_task
# h_c3
harriet[tense]: An seinem Herzen. Es war schwach, wie das unseres Vaters. {+s:s21}
harriet[neutral]: Man fragt so etwas nicht in der Halle.
# h_task
harriet[neutral]: Sie werden mir helfen, das Haus herzurichten. Die Spiegel im Salon sind noch nicht verhängt. Der Krepp liegt auf dem Klavier.
harriet[neutral]: Hobbes. Die Uhren.
hobbes[neutral]: Sind angehalten, Madam. Auf sechs Uhr fünfundzwanzig.
harriet[sad]: Auf – gut. Gut. {+c:c32}
narr: Sie geht in den Salon voraus, ohne sich umzusehen, ob man ihr folgt. Man folgt ihr. {+f:k1_met_harriet}

=== k1_mirror
kind: examine
target: h_s_spiegel
when: ch=1 f:k1_met_harriet !f:k1_mirror
priority: 10
---
narr: Ein hoher Spiegel mit vergoldetem Rahmen. Darin eine junge Frau in einem fremden grünen Kleid, das blonde Haar halb aufgelöst.
inner: Das bin ich. Sieht aus, als hätte man mich aus einem Gemälde gestohlen und falsch zurückgehängt.
narr: Sie wirft den schwarzen Krepp über den Rahmen. Die Frau im Spiegel verschwindet. {+f:k1_mirror, sfx:cloth}
inner: Warum verhängt man Spiegel? Damit sich die Seele nicht darin verfängt, glaube ich. Oder damit die Lebenden sich nicht ansehen müssen.

=== k1_salon
kind: scene
when: ch=1 loc=salon f:k1_mirror
priority: 20
---
harriet[neutral]: Setzen Sie sich, Miss Hale.
harriet[neutral]: Man wird Ihnen gesagt haben, dass ich Gesellschaft brauche. Man hat Ihnen nicht gesagt, wofür.
harriet[neutral]: Ich brauche jemanden, der Briefe schreibt, wenn meine Hand zittert, und der schweigt, wenn ich es wünsche. Können Sie beides?
* [ehrlich] Das Schreiben ganz sicher. Das Schweigen übe ich noch. {harriet+1} -> s_a
* [mitfuehlend] Ich kann zuhören. Das ist so ähnlich wie Schweigen, nur freundlicher. {harriet+1} -> s_b
* [neutral] Ja, Madam. -> s_c
# s_a
harriet[neutral]: Wenigstens lügen Sie nicht. Das ist mehr, als Miss Finch konnte.
-> s_d
# s_b
harriet[neutral]: Freundlicher. – Ja. Vielleicht.
-> s_d
# s_c
harriet[neutral]: Gut.
# s_d
harriet[sad]: Heute Nachmittag wird er aufgebahrt. Mrs. Pryce und ich werden ihn waschen und kleiden, wie es sich gehört. Es kommt kein Arzt, solange das Wasser steht. Kein Coroner. Niemand.
inner: Coroner. Kenne ich aus Krimiserien. Da ist er immer nach fünf Minuten da. Hier offenbar nicht.
harriet[neutral]: Auf seinem Schreibtisch liegt eine Miniatur meiner Schwägerin. Ein ovales Bild in einem Samtetui. Ich möchte, dass er sie in den Händen hält.
harriet[neutral]: Holen Sie sie mir. Hobbes steht vor dem Arbeitszimmer. Sagen Sie ihm, ich schicke Sie.
* [mitfuehlend] Natürlich. {harriet+1, +f:k1_task_mini} -> s_e
* [direkt] Warum schicken Sie nicht Hobbes? {+f:k1_task_mini} -> s_f
# s_f
harriet[tense]: Weil Hobbes seit heute früh niemanden in dieses Zimmer lässt, nicht einmal sich selbst, und weil ich nicht – {pause:500}
harriet[neutral]: Weil ich Sie darum bitte, Miss Hale.
# s_e
narr: Harriet wendet sich zum Fenster, zu den geschlossenen Vorhängen, und steht dort, als könne sie durch Samt hindurchsehen.

=== k1_door
kind: examine
target: x_halle_arbeit
when: ch=1 !f:k1_study_ok
priority: 20
---
? !f:k1_task_mini -> closed
narr: Hobbes steht vor der Tür, als wäre er ein Teil davon.
hobbes[neutral]: Miss.
* [neutral] Miss Averley schickt mich. Ich soll die Miniatur vom Schreibtisch holen. -> ok
* [humor] Ich komme in friedlicher Absicht und mit Auftrag. {hobbes-1, sus+1} -> ok2
# ok2
hobbes[tense]: Miss.
sera: Miss Averley schickt mich. Wegen der Miniatur.
# ok
hobbes[neutral]: Sehr wohl.
hobbes[neutral]: Ich muss Miss bitten, nichts zu verrücken. Der Herr hatte es gern, dass alles an seinem Platz ist.
narr: Er öffnet die Tür nur so weit, dass sie hindurchpasst, und bleibt auf der Schwelle stehen. {+f:k1_study_ok, go:arbeit@0.14, sfx:door}
-> END
# closed
hobbes[neutral]: Das Arbeitszimmer ist geschlossen, Miss.
inner: Und Hobbes ist die Tür dazu.

=== k1_study_in
kind: scene
when: ch=1 loc=arbeit f:k1_study_ok
priority: 20
---
narr: Das Arbeitszimmer ist kalt. Jemand hat die Vorhänge zugezogen, aber nicht ganz; ein grauer Streifen Tag liegt über dem Teppich wie ein vergessenes Band.
narr: Bücher bis unter die Decke, ein Schreibtisch, ein Lehnsessel, ein kalter Kamin. Es riecht nach Tabak, Papier – und nach etwas Süßem, Nussigem, das nicht hierher gehört.
inner: Hier ist es passiert. Was auch immer „es“ ist.
narr: Yuumi schlüpft an Hobbes’ Beinen vorbei ins Zimmer, bevor er sie aufhalten kann. {sfx:bell}
hobbes[tense]: Das Tier, Miss –
inner: Ich tue so, als hätte ich das nicht gehört. Yuumi tut es sowieso.

=== k1_leave_study
kind: examine
target: x_arbeit_halle
when: ch=1 f:k1_mini !f:k1_left_study
priority: 20
---
hobbes[neutral]: Miss hat, was Miss Averley wünscht?
* [neutral] Ja. Danke, Mr. Hobbes. -> a
* [direkt] Mr. Hobbes – haben Sie ihn gefunden? {hobbes-1} -> b
# a
hobbes[neutral]: Sehr wohl.
-> out
# b
hobbes[neutral]: Ich fand den Herrn in seinem Sessel, Miss. Er war friedlich entschlafen. Mehr ist dazu nicht zu sagen.
inner: Wort für Wort derselbe Satz wie in der Halle. Als hätte er ihn aufgeschrieben.
# out
narr: Er zieht die Tür hinter ihr zu und bleibt davor stehen. {+f:k1_left_study, go:halle@0.76, sfx:door}
? k:c03 -> hint
-> END
# hint
inner: Die Uhr ist in meiner Tasche. Ich könnte sie ihm zeigen. Oder ich behalte sie noch ein wenig für mich. {do:hint_present}

=== k1_mini_deliver
kind: scene
when: ch=1 loc=salon f:k1_mini
priority: 20
---
harriet[sad]: Geben Sie her.
narr: Harriet klappt das Etui auf und sieht lange hinein. Ihr Daumen fährt über den Rand, als wische sie Staub fort, wo keiner ist.
harriet[neutral]: Sie war zweiunddreißig. Das Fieber kam mit dem Hochwasser, wie jetzt. Sie hat die Sagen der Moorbauern geliebt. Unsinn, natürlich.
harriet[neutral]: Gehen Sie hinunter zu Mrs. Pryce. Sie soll Ihnen etwas zu essen geben und die Kammer am Ende der Galerie richten.
* [mitfuehlend] Haben Sie heute schon etwas gegessen? {harriet+1} -> m_a
* [neutral] Ja, Madam. -> m_end
# m_a
harriet[surprised]: Ich –
harriet[neutral]: Das geht Sie nichts an, Miss Hale. {pause:600}
harriet[neutral]: Sagen Sie Mrs. Pryce, sie soll Tee heraufschicken. Mit Toast. {+f:k1_harriet_tea}
# m_end
! {+f:k1_delivered}

=== k1_kitchen
kind: scene
when: ch=1 loc=dienst f:k1_met_harriet
priority: 20
---
narr: Die Küche ist der einzige warme Ort im Haus. Ein riesiger schwarzer Herd, Kupfertöpfe an der Wand, ein Tisch, zerkratzt von hundert Jahren Messern. Über der Tür zur Halle hängt ein Brett mit einer Reihe kleiner Glocken an Spiralfedern. Daneben ein Kalender einer Mühle in Bridgwater: November 1877. {music:kitchen}
narr: Eine Frau mit einem Schlüsselbund an der Hüfte schlägt Teig, als hätte er ihr etwas getan. Tilly kniet am Herd und sieht nicht auf.
pryce[neutral]: Sie sind die neue Gesellschafterin. Miss Hale, nehm ich an. Mrs. Pryce.
pryce[neutral]: Setzen Sie sich. Nicht auf den Stuhl, der wackelt. Auf den anderen.
? f:k1_harriet_tea -> tea
-> main
# tea
sera: Miss Averley bittet um Tee. Mit Toast.
pryce[surprised]: Mit Toast. {pause:400}
pryce[warm]: Na, Gott sei Dank. Tilly, cariad, den Kessel. {pryce+1}
# main
narr: Tilly steht auf und geht zum Kessel, ohne Sera anzusehen. Ihre Wangen sind rot, als habe man sie bei etwas ertappt.
pryce[neutral]: Sie haben saubere Hände und trockene Stiefel für eine, die übers Wasser gekommen ist. {+s:s34, hints:f21}
inner: Stiefel. Tilly hat mir Miss Finchs Stiefel gegeben. Die trockensten Stiefel in ganz Somerset.
* [luege] Der Bootsmann hat mich getragen. {sus+1} -> carry
* [humor] Ich bin sehr vorsichtig über die Pfützen gesprungen. {pryce+1} -> jump
* [ausweichend] Kann ich irgendwo helfen? -> help
# carry
pryce[neutral]: Getragen. Soso. Der wird sich über seinen Rücken gefreut haben.
-> help
# jump
pryce[neutral]: Hm. Frech ist sie auch noch.
tilly[warm]: Ein bisschen, Mrs. Pryce.
pryce[neutral]: Springen. Eine Gesellschafterin.
-> potatoes
# help
pryce[neutral]: Helfen. Eine Gesellschafterin.
# potatoes
narr: Mrs. Pryce betrachtet sie einen Augenblick, dann schiebt sie ihr eine Schüssel Kartoffeln und ein Messer hin.
pryce[neutral]: Die schälen sich nicht von selbst. Und wenn Sie schon hier sitzen, sitzen Sie nicht nutzlos.
narr: Eine Weile hört man nur das Schaben des Messers, das Knistern im Herd und den Regen an dem kleinen hohen Fenster.
pryce[neutral]: Eine Gesellschafterin, die Kartoffeln schält. Das hab ich auch noch nicht gesehen. {sus+1}
tilly[neutral]: Sie schält gut, Mrs. Pryce. Ganz dünn.
pryce[neutral]: Sie schält wie eine, die’s selber tun muss. {pause:400}
pryce[neutral]: Na. Ist ja keine Schande.
inner: Gesellschafterinnen schälen keine Kartoffeln. Sie lesen vor und sticken und … keine Ahnung, was sie tun. Das war freundlich gemeint. Und es war eine Warnung. {+f:k1_kitchen_done}

=== k1_library
kind: scene
when: ch=1 loc=biblio f:k1_met_harriet
priority: 20
---
narr: Die Bibliothek riecht nach kaltem Rauch und Leder. Um einen runden Tisch in der Mitte stehen Stühle, als hätten die Leute, die darauf saßen, es eilig gehabt zu gehen.
narr: Am Kamin steht eine Frau in einem rostbraunen Kleid und wärmt sich die beringten Hände. In einem Sessel sitzt ein Mann mit Schnurrbart und einem Glas in der Hand, obwohl es noch nicht zehn Uhr ist.
lionel[neutral]: Ah. Frischer Wind. Oder frisches Wasser, bei dem Wetter. Und Sie sind?
* [neutral] Miss Hale. Die Gesellschafterin Ihrer Tante. -> a
* [humor] Frisches Wasser, anscheinend. {lionel+1} -> b
# a
lionel[neutral]: Tante Harriet hat eine Gesellschafterin. Natürlich hat sie das. Irgendwer muss ihr ja widersprechen, wenn wir anderen zu feige sind.
-> c
# b
lionel[warm]: Gut. Sie sind komisch. Das ist mehr, als man von diesem Haus sagen kann.
# c
lionel[neutral]: Captain Averley. Der Sohn. Der Erbe, seit heute früh, wenn man so will. Ich will nicht.
narr: Die Frau am Kamin hat sich umgedreht. Graue Augen, sehr wach. Sie sieht Sera an, dann Yuumi, dann wieder Sera, und ihr Gesicht verändert sich, als hätte jemand hinter ihr eine Kerze ausgeblasen.
penrose[surprised]: Oh. {pause:600}
penrose[neutral]: Wir sind uns schon begegnet, meine Liebe. Heute Nacht. {+s:s09, hints:f16}
* [direkt] Das glaube ich nicht. Ich bin gerade erst angekommen. -> d
* [ausweichend] Ich habe ein Gesicht, das man oft zu kennen glaubt. -> e
* [schweigen] (Nichts sagen.) -> f
# d
penrose[neutral]: Nein? Wie schade. Ich schon.
-> g
# e
penrose[neutral]: Haben Sie das? Nein. Sie haben ein Gesicht, das man nicht verwechselt.
-> g
# f
penrose[neutral]: Sie schweigen gut. Das lernt man nicht in einer Agentur.
# g
lionel[angry]: Mrs. Penrose begegnet jedem. Den Lebenden am Tag und den Toten in der Nacht. Gestern Abend hat sie uns meine Mutter vorgeführt. Es war sehr bewegend. Mein Vater hat es nicht überlebt.
penrose[tense]: Captain.
lionel[angry]: Riechen Sie das auch, Miss Hale, drüben im Arbeitszimmer? Bittermandel. In Lucknow hat mir ein Regimentsarzt erklärt, was das bedeutet. {+s:s12}
lionel[angry]: Diese Frau hat ihn vergiftet. Und wir sitzen hier und warten, bis das Wasser fällt.
penrose[neutral]: Der Captain ist erschüttert. Man sagt Dinge, wenn man erschüttert ist. Und man trinkt vor zehn.
lionel[neutral]: Ich trinke, wann ich will, Madam. Das ist der einzige Vorzug daran, der Erbe zu sein.
narr: Er leert sein Glas. Seine Hand zittert nicht. Man sieht, dass er das geübt hat.
inner: Zwei Menschen, die einander nicht ausstehen können. Und beide wirken erleichtert, dass jemand Drittes im Raum ist. {+f:k1_library_done}

=== k1_nudge
kind: event
when: ch=1 k:d01 f:k1_delivered f:k1_kitchen_done f:k1_library_done loc=halle,salon,arbeit,biblio,dienst,galerie
priority: 5
---
inner: Ich brauche fünf Minuten für mich. Miss Averley hat gesagt, meine Kammer ist am Ende der Galerie. {+f:k1_ready}

=== k1_quiet
kind: scene
when: ch=1 loc=kammer f:k1_ready
priority: 20
important: yes
---
narr: Die Kammer ist klein, sauber und kalt. Ein schmales Bett, ein Waschtisch mit Krug, eine Truhe, ein Fenster, hinter dem das Moor zu einem grauen Spiegel geworden ist. {music:quiet}
narr: Sera setzt sich auf die Bettkante. Das Korsett erlaubt es nur unter Protest.
inner: Also. Bestandsaufnahme.
inner: Tilly sagt Averley Hall, die Dame in Schwarz sagt Mittwoch, und auf dem Kalender in der Küche steht 1877. Achtzehnhundertsiebenundsiebzig.
inner: Ich habe eine Glasplatte gegen eine Lampe gehalten, und jetzt bin ich hier. Das ist keine Erklärung. Das ist eine Reihenfolge.
yuumi: (Yuumi springt auf die Fensterbank, setzt sich und schaut hinaus, als gehöre ihr das Wasser.) {sfx:bell}
* [mitfuehlend] (Yuumi streicheln.) -> pet
* [schweigen] (Einfach mit ihr hinausschauen.) -> look
# pet
yuumi: (Ein Schnurren, tief und ungeniert, wie ein kleines Spinnrad in einem sehr alten Haus.) {sfx:purr}
-> c
# look
narr: Draußen treibt ein Zaunpfahl vorbei, dann eine Krähe auf einem Brett, ganz ruhig, wie auf einer Fähre.
# c
inner: Unten liegt ein toter Mann, und alle sagen „friedlich“. Aber da ist ein Klingelzug, an dem jemand gerissen hat. Und eine Glocke im Keller, die sich an etwas erinnert, das niemand gehört haben will.
inner: Es geht mich nichts an. Nicht mein Jahrhundert. Nicht meine Familie.
inner: Sagt die Frau, die in fremder Leute Notizbüchern liest.
narr: Es klopft. {sfx:knock}
narr: Vor der Tür steht eine junge Frau in Schwarz, das dunkle Haar straff zurückgenommen. Ihre Fingerspitzen sind schwarz, als hätte sie in Tinte gegriffen. Nein – nicht Tinte. Etwas, das nicht abgeht.
clara[neutral]: Sie sind Miss Hale.
clara[tense]: Sie waren heute Morgen im Arbeitszimmer meines Vaters.
* [ehrlich] Ja. Ihre Tante hat mich nach der Miniatur geschickt. -> e_a
* [mitfuehlend] Es tut mir leid um Ihren Vater. -> e_b
# e_a
clara[neutral]: Ich weiß. Und Sie haben in seinem Notizbuch gelesen. Hobbes sagt es niemandem. Hobbes hat es mir gesagt.
-> e_c
# e_b
clara[neutral]: Das sagen alle. Sie waren in seinem Arbeitszimmer. Sie haben in seinem Notizbuch gelesen.
# e_c
clara[tense]: Ich weiß nicht, was man Ihnen in London beibringt. Hier liest man nicht in den Büchern der Toten.
narr: Ihr Blick fällt auf Yuumi am Fenster. Etwas in ihrem Gesicht wird für einen Augenblick weich und sofort wieder hart.
clara[neutral]: Um drei bahren wir ihn auf. Tante Harriet wünscht, dass Sie helfen. Ich wünsche es nicht. Aber Mrs. Pryce hat nur zwei Hände, und die Hausmädchen sitzen hinter dem Wasser fest.
clara[neutral]: Kommen Sie nicht zu spät. {pause:300}
narr: Sie geht, bevor Sera antworten kann. Ihre Schritte auf der Galerie sind schnell und gleichmäßig, wie jemand, der sich vorgenommen hat, nicht zu weinen. {chap:2, time=nachmittag, go:toten@0.25}

=== k1_gate_jeans
kind: examine
target: x_halle_salon
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
inner: In Jeans und Avocado-Socken durch ein Trauerhaus? Erst die Kleider. Tilly ist die Treppe hinauf.

=== k1_gate_jeans2
kind: examine
target: x_halle_dienst
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
inner: Da unten ist die Küche. Und irgendwo in der Küche ist jemand, der mich in diesen Hosen nicht sehen sollte. Erst hinauf zu Tilly.

=== k1_gate_jeans3
kind: examine
target: x_halle_biblio
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
inner: Hinter der Tür knistert ein Feuer, und jemand hustet. Nicht in diesem Aufzug.

=== k1_gate_jeans6
kind: examine
target: x_halle_arbeit
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
narr: Vor der Tür steht ein alter Diener im Frack. Sein Blick fällt auf ihre Hosen und kehrt nicht zurück.
inner: Nein. Erst die Kleider.

=== k1_gate_jeans4
kind: examine
target: x_galerie_dienst
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
inner: Tilly hat gesagt: die Treppe rauf und dann links. Nicht die Hintertreppe.

=== k1_gate_jeans5
kind: examine
target: x_galerie_kammer
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
inner: Keine Ahnung, wem dieses Zimmer gehört. Tilly wartet in der Wäschekammer.
`;
