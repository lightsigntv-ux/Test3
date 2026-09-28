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
narr: In der Halle sah alles anders aus als vorhin. Die Vorhänge waren zugezogen, auf dem Tisch brannten Kerzen, obwohl es Morgen war, und die große Standuhr war stehen geblieben. {music:grief}
narr: Auf der untersten Stufe stand eine Frau ganz in Schwarz, sehr gerade. Ihr Kleid hatte weite Ärmel und einen runden Rock, so wie man es vor zehn, fünfzehn Jahren trug. Neben ihr stand ein alter Diener im Frack.
harriet[tense]: Wer sind Sie?
inner: Gute Frage. Wirklich eine sehr gute Frage.
harriet[neutral]: Oh. Sie müssen Miss Hale sein. Die Agentur schrieb, Sie kämen am Mittwoch. Ich hatte Sie nicht vor dem Mittag erwartet, und gewiss nicht bei diesem Wasser.
* [ehrlich] Ich … ich heiße Sera. -> h_name
* [luege] Ja. Miss Hale. Ich bin etwas früher gekommen. -> h_boat
* [schweigen] (Nicken und einen Knicks versuchen.) -> h_curtsy
# h_name
harriet[neutral]: Sarah. Gewiss. Miss Sarah Hale.
inner: Sarah. Na gut. Dann bin ich eben Miss Hale. Gelogen habe ich nicht. Ich korrigiere sie nur nicht.
-> h_boat
# h_curtsy
narr: Der Knicks ging schief. Sera knickte ein, schwankte und kam gerade noch wieder hoch.
harriet[neutral]: Nun. Die Agentur schrieb, Sie seien aus gutem Hause. Dass Sie Tänzerin sind, stand nicht darin. {sus+1}
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
harriet[sad]: Sie kommen in ein Trauerhaus, Miss Hale. Mein Bruder ist in der vergangenen Nacht verschieden. {pause:700}
harriet[neutral]: Hobbes hat ihn heute früh gefunden.
hobbes[neutral]: Um Viertel nach sechs, Madam. In seinem Sessel. Der Herr war friedlich entschlafen. {+s:s01, lie:f14}
inner: Friedlich. Das klingt auswendig gelernt.
* [mitfuehlend] Das tut mir sehr leid. {harriet+1} -> h_c1
* [ehrlich] Ich weiß nicht, was ich sagen soll. {harriet+1} -> h_c2
* [direkt] Woran ist er gestorben? {harriet-1} -> h_c3
# h_c1
harriet[neutral]: Das sagt man. Es ist freundlich von Ihnen, es zu sagen.
-> h_task
# h_c2
harriet[neutral]: Dann sagen Sie nichts, Miss Hale. In solchen Stunden ist das meist das Klügste.
-> h_task
# h_c3
harriet[tense]: Am Herzen. Es war schwach, wie das unseres Vaters. {+s:s21}
harriet[neutral]: Man fragt so etwas nicht in der Halle.
# h_task
harriet[neutral]: Sie werden mir helfen, das Haus herzurichten. Die Spiegel im Salon sind noch nicht verhängt. Der Krepp liegt auf dem Klavier.
harriet[neutral]: Hobbes. Die Uhren.
hobbes[neutral]: Sind angehalten, Madam. Auf sechs Uhr fünfundzwanzig.
harriet[sad]: Auf – gut. Gut. {+c:c32}
narr: Sie ging in den Salon voraus, ohne sich umzusehen. Sie wusste, dass man ihr folgte. {+f:k1_met_harriet}

=== k1_mirror
kind: examine
target: h_s_spiegel
when: ch=1 f:k1_met_harriet !f:k1_mirror
priority: 10
---
narr: Ein hoher Spiegel mit vergoldetem Rahmen. Darin stand eine junge Frau in einem fremden grünen Kleid. Ihr blondes Haar hatte sich halb gelöst.
inner: Das bin ich? Die Ärmel sind zu kurz, und die Haare halten nicht. Grün steht mir eigentlich gut. Hatte ich nicht mal so einen Pulli … egal. Der Krepp.
narr: Sera warf den schwarzen Krepp über den Rahmen. Die Frau im Spiegel verschwand. {+f:k1_mirror, sfx:cloth}
inner: Warum verhängt man Spiegel? Damit sich die Seele nicht darin verfängt, glaube ich. Das habe ich mal gelesen. Die Viktorianer hatten für die Trauer mehr Regeln als für alles andere.

=== k1_salon
kind: scene
when: ch=1 loc=salon f:k1_mirror
priority: 20
---
harriet[neutral]: Setzen Sie sich, Miss Hale.
harriet[neutral]: Man wird Ihnen gesagt haben, dass ich Gesellschaft brauche. Man hat Ihnen nicht gesagt, wofür.
harriet[neutral]: Ich brauche jemanden, der meine Briefe schreibt, wenn meine Hand zittert. Und der schweigt, wenn ich es wünsche. Können Sie beides?
* [ehrlich] Schreiben kann ich. Beim Schweigen übe ich noch. {harriet+1} -> s_a
* [mitfuehlend] Ich kann zuhören. Das ist fast wie Schweigen, nur freundlicher. {harriet+1} -> s_b
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
harriet[sad]: Heute Nachmittag wird er aufgebahrt. Mrs. Pryce und ich werden ihn waschen und kleiden, wie es sich gehört. Solange das Wasser steht, kommt kein Arzt. Kein Coroner. Niemand.
inner: Coroner. Kenne ich aus Krimiserien. Da steht der nach fünf Minuten neben der Leiche. Hier kommt offenbar keiner.
harriet[neutral]: Auf seinem Schreibtisch liegt eine Miniatur meiner Schwägerin. Ein ovales Bild in einem Samtetui. Ich möchte, dass er sie in den Händen hält.
harriet[neutral]: Holen Sie sie mir. Hobbes steht vor dem Arbeitszimmer. Sagen Sie ihm, dass ich Sie schicke.
* [mitfuehlend] Natürlich. Ich hole sie sofort. {harriet+1, +f:k1_task_mini} -> s_e
* [direkt] Warum schicken Sie nicht Hobbes? {+f:k1_task_mini} -> s_f
# s_f
harriet[tense]: Weil Hobbes seit heute früh niemanden in dieses Zimmer lässt, nicht einmal sich selbst. Und weil ich nicht – {pause:500}
harriet[neutral]: Weil ich Sie darum bitte, Miss Hale.
# s_e
narr: Harriet drehte sich zum Fenster. Die Vorhänge waren geschlossen, aber sie blieb davor stehen und sah sie an.

=== k1_door
kind: examine
target: x_halle_arbeit
when: ch=1 !f:k1_study_ok
priority: 20
---
? !f:k1_task_mini -> closed
narr: Hobbes stand vor der Tür und rührte sich nicht.
hobbes[neutral]: Miss.
* [neutral] Miss Averley schickt mich. Ich soll die Miniatur vom Schreibtisch holen. -> ok
* [humor] Ich komme in friedlicher Absicht. Und mit Auftrag. {hobbes-1, sus+1} -> ok2
# ok2
hobbes[tense]: Miss.
sera: Miss Averley schickt mich. Wegen der Miniatur.
# ok
hobbes[neutral]: Sehr wohl.
hobbes[neutral]: Ich muss Miss bitten, nichts zu verrücken. Der Herr hatte es gern, wenn alles an seinem Platz war.
narr: Er öffnete die Tür nur so weit, dass sie hindurchpasste, und blieb auf der Schwelle stehen. {+f:k1_study_ok, go:arbeit@0.14, sfx:door}
-> END
# closed
hobbes[neutral]: Das Arbeitszimmer ist geschlossen, Miss.
inner: Und Hobbes geht da nicht weg. Das sieht man.

=== k1_study_in
kind: scene
when: ch=1 loc=arbeit f:k1_study_ok
priority: 20
---
narr: Im Arbeitszimmer war es kalt. Jemand hatte die Vorhänge zugezogen, aber nicht ganz. Ein grauer Streifen Tageslicht fiel über den Teppich.
narr: Bücher bis unter die Decke, ein Schreibtisch, ein Lehnsessel, ein kalter Kamin. Es roch nach Tabak und Papier. Und nach etwas Süßem, Nussigem, das nicht hierher passte.
inner: Hier ist es also passiert. Was auch immer passiert ist.
narr: Yuumi schlüpfte an Hobbes’ Beinen vorbei ins Zimmer, bevor er sie aufhalten konnte. {sfx:bell}
hobbes[tense]: Das Tier, Miss –
inner: Ich tue so, als hätte ich nichts gehört. Yuumi macht das sowieso. Die hört ja auch nie, wenn ich sie zum Fressen – egal. Die Miniatur.

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
inner: Wieder derselbe Satz wie in der Halle. Fast Wort für Wort.
# out
narr: Er zog die Tür hinter ihr zu und blieb davor stehen. {+f:k1_left_study, go:halle@0.76, sfx:door}
? k:c03 -> hint
-> END
# hint
inner: Die Uhr ist in meiner Tasche. Ich könnte sie ihm zeigen. Oder ich behalte sie noch eine Weile für mich. {do:hint_present}

=== k1_mini_deliver
kind: scene
when: ch=1 loc=salon f:k1_mini
priority: 20
---
harriet[sad]: Geben Sie her.
narr: Harriet klappte das Etui auf und sah lange hinein. Mit dem Daumen fuhr sie immer wieder über den Rand.
harriet[neutral]: Sie war zweiunddreißig. Das Fieber kam mit dem Hochwasser, so wie jetzt. Sie hat die Sagen der Moorbauern geliebt. Unsinn, natürlich.
harriet[neutral]: Gehen Sie hinunter zu Mrs. Pryce. Sie soll Ihnen etwas zu essen geben und die Kammer am Ende der Galerie herrichten.
* [mitfuehlend] Haben Sie heute schon etwas gegessen? {harriet+1} -> m_a
* [neutral] Ja, Madam. -> m_end
# m_a
harriet[surprised]: Ich –
harriet[neutral]: Das geht Sie nichts an, Miss Hale. {pause:600}
harriet[neutral]: Sagen Sie Mrs. Pryce, sie möge Tee heraufschicken. Mit Toast. {+f:k1_harriet_tea}
# m_end
! {+f:k1_delivered}

=== k1_kitchen
kind: scene
when: ch=1 loc=dienst f:k1_met_harriet
priority: 20
---
narr: Die Küche war der einzige warme Raum im Haus. Ein riesiger schwarzer Herd, Kupfertöpfe an der Wand, ein alter Tisch voller Messerkerben. Über der Tür zur Halle hing ein Brett mit einer Reihe kleiner Glocken an Spiralfedern, daneben der Kalender einer Mühle in Bridgwater: November 1877. {music:kitchen}
narr: Eine Frau mit einem Schlüsselbund an der Hüfte schlug kräftig einen Teig. Tilly kniete am Herd und sah nicht auf.
pryce[neutral]: Sie sind die neue Gesellschafterin. Miss Hale, nehm ich an. Ich bin Mrs. Pryce.
pryce[neutral]: Setzen Sie sich. Nicht auf den Stuhl, der wackelt. Auf den anderen.
? f:k1_harriet_tea -> tea
-> main
# tea
sera: Miss Averley bittet um Tee. Mit Toast.
pryce[surprised]: Mit Toast. {pause:400}
pryce[warm]: Na, Gott sei Dank. Tilly, cariad, den Kessel. {pryce+1}
# main
narr: Tilly stand auf und ging zum Kessel, ohne Sera anzusehen. Ihre Wangen waren rot.
pryce[neutral]: Sie haben saubere Hände und trockene Stiefel für eine, die übers Wasser gekommen ist. {+s:s34, hints:f21}
inner: Die Stiefel. Tilly hat mir Miss Finchs Stiefel gegeben, und die sind natürlich knochentrocken. Mist.
* [luege] Der Bootsmann hat mich getragen. {sus+1} -> carry
* [humor] Ich bin sehr vorsichtig über die Pfützen gesprungen. {pryce+1} -> jump
* [ausweichend] Kann ich irgendwo helfen? -> help
# carry
pryce[neutral]: Getragen. Soso. Da wird sich sein Rücken aber gefreut haben.
-> help
# jump
pryce[neutral]: Hm. Frech ist sie auch noch.
tilly[warm]: Bloß ’n bisschen, Mrs. Pryce.
pryce[neutral]: Springen. Eine Gesellschafterin.
-> potatoes
# help
pryce[neutral]: Helfen. Eine Gesellschafterin.
# potatoes
narr: Mrs. Pryce sah sie einen Moment lang an. Dann schob sie ihr eine Schüssel Kartoffeln und ein Messer hin.
pryce[neutral]: Die schälen sich nicht von selbst. Wenn Sie schon hier sitzen, dann nicht umsonst. Na?
narr: Eine Weile hörte man nur das Messer, das Knistern im Herd und den Regen an dem kleinen hohen Fenster.
pryce[neutral]: Eine Gesellschafterin, die Kartoffeln schält. Das hab ich auch noch nicht gesehen. {sus+1}
tilly[neutral]: Sie schält gut, Mrs. Pryce. Ganz dünn.
pryce[neutral]: Sie schält wie eine, die’s selber tun muss. {pause:400}
pryce[neutral]: Na. Ist ja keine Schande.
inner: Gesellschafterinnen schälen keine Kartoffeln. Bei Jane Austen lesen sie vor und sticken und … keine Ahnung, was noch. Das war freundlich gemeint. Aber es war auch eine Warnung. {+f:k1_kitchen_done}

=== k1_library
kind: scene
when: ch=1 loc=biblio f:k1_met_harriet
priority: 20
---
narr: In der Bibliothek roch es nach kaltem Rauch und Leder. Die Stühle um den runden Tisch in der Mitte standen schief und waren halb zurückgeschoben.
narr: Am Kamin stand eine Frau in einem rostbraunen Kleid und wärmte sich die Hände. Das Kleid war schmal geschnitten, ganz nach der neuesten Mode, und an ihren Fingern steckten viele Ringe. In einem Sessel saß ein Mann mit Schnurrbart und einem Glas in der Hand, obwohl es noch nicht zehn Uhr war.
lionel[neutral]: Ah. Frischer Wind. Oder frisches Wasser, bei dem Wetter. Und Sie sind?
* [neutral] Miss Hale. Die Gesellschafterin Ihrer Tante. -> a
* [humor] Frisches Wasser, anscheinend. {lionel+1} -> b
# a
lionel[neutral]: Tante Harriet hat eine Gesellschafterin. Natürlich hat sie eine. Irgendwer muss ihr ja widersprechen, wenn wir anderen zu feige sind.
-> c
# b
lionel[warm]: Gut. Sie sind komisch. Das ist in diesem Haus eine Seltenheit.
# c
lionel[neutral]: Captain Averley. Der Sohn. Seit heute früh der Erbe, wenn man so will. Ich will nicht.
narr: Die Frau am Kamin hatte sich umgedreht. Graue Augen, sehr wach. Sie sah Sera an, dann Yuumi, dann wieder Sera, und wurde blass.
penrose[surprised]: Oh. {pause:600}
penrose[neutral]: Wir sind uns schon begegnet, meine Liebe. Heute Nacht. {+s:s09, hints:f16}
* [direkt] Das glaube ich nicht. Ich bin gerade erst angekommen. -> d
* [ausweichend] Das höre ich öfter. Ich hab wohl so ein Gesicht. -> e
* [schweigen] (Nichts sagen.) -> f
# d
penrose[neutral]: Nein? Wie schade. Ich schon.
-> g
# e
penrose[neutral]: So ein Gesicht? Nein, meine Liebe. Ihr Gesicht verwechselt man nicht.
-> g
# f
penrose[neutral]: Sie schweigen gut. Das lernt man nicht in einer Agentur.
# g
lionel[angry]: Mrs. Penrose begegnet jedem. Den Lebenden am Tag und den Toten in der Nacht. Gestern Abend hat sie uns meine Mutter vorgeführt. Sehr bewegend. Mein Vater hat es nicht überlebt.
penrose[tense]: Captain.
lionel[angry]: Riechen Sie das auch, Miss Hale? Drüben im Arbeitszimmer? Bittermandel. In Lucknow hat mir ein Regimentsarzt erklärt, was das heißt. {+s:s12}
lionel[angry]: Diese Frau hat ihn vergiftet. Und wir sitzen hier herum und warten, bis das Wasser fällt.
penrose[neutral]: Der Captain ist erschüttert. Wenn man erschüttert ist, sagt man solche Dinge. Und man trinkt vor zehn.
lionel[neutral]: Ich trinke, wann ich will, Madam. Das ist das einzig Gute daran, der Erbe zu sein.
narr: Er leerte sein Glas. Seine Hand zitterte dabei nicht. Das sah geübt aus.
inner: Die beiden können sich nicht ausstehen. Und trotzdem sind beide froh, dass noch jemand im Raum ist. {+f:k1_library_done}

=== k1_nudge
kind: event
when: ch=1 k:d01 f:k1_delivered f:k1_kitchen_done f:k1_library_done loc=halle,salon,arbeit,biblio,dienst,galerie
priority: 5
---
inner: Ich brauche jetzt fünf Minuten für mich. Meine Kammer ist am Ende der Galerie, hat Miss Averley gesagt. {+f:k1_ready}

=== k1_quiet
kind: scene
when: ch=1 loc=kammer f:k1_ready
priority: 20
important: yes
---
narr: Die Kammer war klein, sauber und kalt. Ein schmales Bett, ein Waschtisch mit Krug, eine Truhe. Vor dem Fenster lag das Moor unter Wasser, grau und glatt. {music:quiet}
narr: Sera setzte sich auf die Bettkante. Mit dem Korsett ging das nur sehr langsam.
inner: Also gut. Bestandsaufnahme. Erst beobachten, dann deuten. Das sage ich meinen Schülern auch immer.
inner: Tilly sagt Averley Hall, die Dame in Schwarz sagt Mittwoch, und auf dem Kalender in der Küche steht 1877. Achtzehnhundertsiebenundsiebzig.
inner: Ich habe eine Glasplatte gegen die Lampe gehalten, und jetzt bin ich hier. Mehr weiß ich nicht. Erklären kann ich es nicht.
yuumi: (Yuumi sprang auf die Fensterbank, setzte sich und sah auf das Wasser hinaus.) {sfx:bell}
* [mitfuehlend] (Yuumi streicheln.) -> pet
* [schweigen] (Einfach mit ihr hinausschauen.) -> look
# pet
yuumi: (Yuumi schnurrte laut und drückte den Kopf fest gegen Seras Hand.) {sfx:purr}
-> c
# look
narr: Draußen trieb ein Zaunpfahl vorbei. Dann ein Brett, auf dem eine Krähe saß, ganz ruhig.
# c
inner: Unten liegt ein toter Mann, und alle sagen „friedlich“. Aber jemand hat an einem Klingelzug gerissen. Und im Keller hängt eine Glocke, die angeblich niemand gehört hat.
inner: Eigentlich geht mich das nichts an. Nicht mein Jahrhundert, nicht meine Familie. Und Fritz macht sich bestimmt schon Sorgen.
inner: Na ja. Im Notizbuch des Toten habe ich trotzdem gelesen.
narr: Es klopfte. {sfx:knock}
narr: Vor der Tür stand eine junge Frau in einem schlichten schwarzen Kleid ohne Tournüre, das dunkle Haar straff zurückgenommen. Ihre Fingerspitzen waren schwarz. Tinte war das nicht, es sah aus, als ginge es nicht mehr ab.
clara[neutral]: Sie sind Miss Hale.
clara[tense]: Sie waren heute Morgen im Arbeitszimmer meines Vaters.
* [ehrlich] Ja. Ihre Tante hat mich nach der Miniatur geschickt. -> e_a
* [mitfuehlend] Das mit Ihrem Vater tut mir leid. -> e_b
# e_a
clara[neutral]: Ich weiß. Und Sie haben in seinem Notizbuch gelesen. Hobbes sagt so etwas niemandem. Mir hat er es gesagt.
-> e_c
# e_b
clara[neutral]: Das sagen alle. Sie waren in seinem Arbeitszimmer. Sie haben in seinem Notizbuch gelesen.
# e_c
clara[tense]: Ich weiß nicht, was man Ihnen in London beibringt. Hier liest man nicht in den Büchern der Toten.
narr: Ihr Blick fiel auf Yuumi am Fenster. Für einen Moment wurde ihr Gesicht weich, dann gleich wieder hart.
clara[neutral]: Um drei bahren wir ihn auf. Tante Harriet wünscht, dass Sie helfen. Ich wünsche es nicht. Aber Mrs. Pryce hat nur zwei Hände, und die Hausmädchen sitzen hinter dem Wasser fest.
clara[neutral]: Kommen Sie nicht zu spät. {pause:300}
narr: Sie ging, bevor Sera antworten konnte. Ihre Schritte auf der Galerie waren schnell und gleichmäßig, und sie drehte sich nicht um. {chap:2, time=nachmittag, go:toten@0.25}

=== k1_gate_jeans
kind: examine
target: x_halle_salon
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
inner: In Jeans und Avocado-Socken durch ein Trauerhaus? Lieber nicht. Erst die Kleider. Tilly ist die Treppe hoch.

=== k1_gate_jeans2
kind: examine
target: x_halle_dienst
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
inner: Da unten ist die Küche. Und da ist bestimmt jemand, der mich in diesen Hosen nicht sehen sollte. Erst zu Tilly nach oben.

=== k1_gate_jeans3
kind: examine
target: x_halle_biblio
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
inner: Hinter der Tür knistert ein Feuer, und jemand hustet. So gehe ich da nicht rein.

=== k1_gate_jeans6
kind: examine
target: x_halle_arbeit
when: ch=1 !f:k1_dressed
priority: 30
repeat: yes
---
narr: Vor der Tür stand ein alter Diener im Frack. Er sah auf ihre Hosen und dann starr geradeaus.
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
inner: Keine Ahnung, wem das Zimmer gehört. Tilly wartet in der Wäschekammer.
`;
