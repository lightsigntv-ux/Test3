export default `
=== t1_tilly_herr
kind: topic
npc: tilly
title: Der Herr
when: ch=1 f:k1_kitchen_done
---
sera: Hast du ihn gut gekannt? Den Herrn?
tilly[neutral]: Gekannt? Ich bin Küchenmädchen, Miss. Ich kenn die Kohlen.
tilly[neutral]: Er hat mich mal gefragt, wie ich heiß. Auf dem Hof, wie ich die Asche rausgetragen hab. Und dann noch mal im Sommer.
tilly[warm]: Beim zweiten Mal hat er’s sich gemerkt. „Tilly“, hat er gesagt. „Du singst falsch, Tilly.“ Und dann hat er gelacht.
narr: Sie lächelte kurz. Dann drehte sie sich zum Herd, und ihre Schultern sanken nach vorn. {pause:500}
* [mitfuehlend] (Nichts sagen. Bei ihr stehen bleiben.) {tilly+1} -> a
* [direkt] Tilly, weißt du etwas über heute Nacht? {tilly-1} -> b
# a
tilly[sad]: … Der Herd geht aus, wenn man nich aufpasst.
inner: Sie weint nicht. Sie schaufelt Kohlen, und zwar sehr gründlich.
-> END
# b
tilly[tense]: Nein, Miss. Ich hab doch geschlafen. Hab ich doch gesagt.
inner: Das kam schon wieder sehr schnell. Zu schnell.

=== t1_tilly_bell
kind: topic
npc: tilly
title: Das Glöckchen auf der Treppe
when: ch<=2 k:s07
---
sera: Das Klingeln heute Nacht auf der Treppe. Was glaubst du, was das war?
tilly[tense]: Mrs. Pryce sagt, das war der Wind. Aber der Wind hat doch kein Glöckchen.
tilly[tense]: Miss Averley sagt, bei Hochwasser läutet unterm Moor die Glocke von der alten Kirche. Die, die ertrunken is. Und dann holt sie wen.
narr: Tilly sah zu Yuumi hinüber, die unter dem Tisch saß und sich eine Pfote putzte. Das Glöckchen klingelte leise. {sfx:bell}
* [ehrlich] Ich glaube, das war Yuumi. {tilly+1, +f:k1_told_bell} -> a
* [ausweichend] Vielleicht war es wirklich der Wind. -> b
# a
tilly[surprised]: Aber die war doch – Sie warn doch gar nich – {pause:400}
tilly[neutral]: … Sie warn doch da. Auf der Treppe. Die ganze Nacht? {hints:f23}
* [ehrlich] Ich weiß nicht, wie lange. Ich weiß nicht mal genau, wie ich hergekommen bin. {tilly+1} -> c
* [ausweichend] Ich war sehr müde. -> c
# c
tilly[neutral]: Dann warn Sie der Geist.
tilly[warm]: Is mir lieber als ’ne ertrunkene Glocke.
-> END
# b
tilly[neutral]: Hm.
inner: Sie glaubt mir nicht. Ich mir auch nicht.

=== t1_tilly_letters
kind: topic
npc: tilly
title: Die Buchstaben im Tisch
when: seen:ex_k_tisch !f:g_teach
---
sera: Die Buchstaben an der Tischkante. T, I, L. Warst du das?
tilly[surprised]: Das – das sieht doch keiner, Miss. Das is da unten, wo keiner hinguckt.
tilly[tense]: Sagen Sie’s nich Mrs. Pryce. Die sagt, der Tisch is älter als sie, und sie is alt.
tilly[neutral]: Das T hat mir Miss Clara gezeigt. Einmal. Im Frühjahr, wie sie in der Küche auf ’n Brief gewartet hat. T wie Tilly. Und wie Tee.
tilly[neutral]: In der Arbeitshausschule hab ich bloß Kartoffeln geschält. Die Lehrerin brauchte immer eine für die Küche, und ich war schnell.
tilly[neutral]: Das I is leicht, das is nur ’n Strich. Das L hab ich mir selbst ausgedacht.
inner: Das L ist spiegelverkehrt. Wie ein kleiner Galgen. Das machen Kinder am Anfang fast alle, das kriegt man schnell hin.
* [mitfuehlend] Soll ich dir den Rest zeigen? Dein Name hat nur fünf Buchstaben. {tilly+2, +f:g_teach} -> yes
* [humor] Das L ist fast richtig. Es guckt nur in die falsche Richtung. Wie Yuumi, wenn man sie ruft. {tilly+1, +f:g_teach} -> yes
# yes
tilly[surprised]: Jetzt?
tilly[warm]: Nich jetzt. Wenn Mrs. Pryce schläft. Oder – wenn die Kartoffeln fertig sind.
narr: Sie wischte mit dem Ärmel über die Tischkante, um die Buchstaben zu verdecken. Dann wischte sie langsamer.

=== t1_pryce_bells
kind: topic
npc: pryce
title: Die kleinen Glocken
when: ch=1 f:k1_kitchen_done
---
sera: Die kleinen Glocken da über der Tür – läuten die oft?
pryce[neutral]: Wenn die Herrschaft was will. Jede Glocke ist ein Zimmer. Salon, Speisezimmer, Arbeitszimmer, Miss Averley und so weiter.
? k:c02 -> wire
sera: Und heute Nacht?
pryce[neutral]: Heut Nacht hat keine Glocke geläutet. Und wenn eine geläutet hätte, wär’s Mr. Hobbes’ Sache gewesen. {+s:s02, lie:f08}
narr: Die Schlüssel an ihrer Hüfte klirrten, als sie sich zum Herd drehte.
-> END
# wire
sera: Die Glocke vom Arbeitszimmer hängt schief. Und der Draht ist ganz lang gezogen.
pryce[tense]: Das Haus ist alt. Die Drähte auch. {pause:400}
pryce[neutral]: Heut Nacht hat keine Glocke geläutet. Und wenn, wär’s Mr. Hobbes’ Sache gewesen. {+s:s02, lie:f08}
pryce[neutral]: Tilly! Die Kohlen. Nicht morgen. Jetzt.
inner: Dabei hat sie nicht mich angesehen. Sie hat Tilly angesehen.

=== t1_pryce_tilly
kind: topic
npc: pryce
title: Tilly
when: ch<=2 f:k1_kitchen_done
---
sera: Tilly ist noch sehr jung.
pryce[neutral]: Dreizehn. Aus dem Arbeitshaus in Bridgwater. Seit letztem Herbst ist sie hier.
pryce[neutral]: Flink ist sie. Frech ist sie. Und sie singt falsch beim Kohlentragen. Der Herr hat’s gern gehört, weiß der Himmel, warum.
narr: Ihre Hände hörten für einen Moment auf, den Teig zu schlagen.
pryce[neutral]: Man holt so ein Kind nicht aus dem Arbeitshaus, damit es wieder zurückmuss. Das merken Sie sich, Miss. Egal, was Sie hier oben aufschnappen.
inner: Das war eine Warnung. Sie passt auf Tilly auf, egal was passiert.

=== t1_pryce_herr
kind: topic
npc: pryce
title: Der Herr
when: ch=1 f:k1_kitchen_done
---
sera: Was war er für ein Herr?
pryce[neutral]: Einer, der nie gefragt hat, was die Kohlen kosten. Nur, ob’s überall warm ist.
pryce[neutral]: Im Sommer hat er die Köchin gehen lassen, weil er sparen wollte. Und mir dafür zwei Pfund mehr gegeben, weil ich jetzt doppelt arbeite. So war der.
pryce[sad]: Mit allem sparsam. Nur nicht mit den Leuten.

=== t1_hobbes_camera
kind: topic
npc: hobbes
title: Das Gerät in der Halle
when: ch<=3 k:c16
---
sera: Mr. Hobbes, der verhängte Kasten in der Halle –
hobbes[neutral]: Ist ein Apparat des Herrn, Miss. Für die Fotografie.
hobbes[neutral]: Der Herr stellte ihn gestern Abend selbst auf. Um halb zwölf sagte er: „Lass es stehen, Hobbes. Bis zum Morgen. Niemand rührt es an.“ {+s:s10, reveals:f17}
hobbes[neutral]: Also rührt es niemand an.
* [direkt] Aber jemand hat ihn verhängt. -> a
* [neutral] Das ist sehr treu von Ihnen. {hobbes+1} -> b
# a
hobbes[neutral]: Miss Averley ließ heute früh alle Spiegel verhängen. Sie hielt den Apparat für ein Spiegelinstrument. Es ist nicht an mir, Miss Averley zu verbessern.
hobbes[neutral]: Verhängen ist nicht anrühren.
-> END
# b
hobbes[neutral]: Es ist, was man tut, Miss.

=== t1_hobbes_herr
kind: topic
npc: hobbes
title: Der Herr
when: ch=1 f:k1_left_study
---
sera: Wie lange haben Sie ihm gedient?
hobbes[neutral]: Ich kam in dieses Haus, als der alte Herr noch lebte. Achtzehnhundertachtundzwanzig. Als Hallboy.
hobbes[neutral]: Master Edmund war damals zwölf. Er hat mir gezeigt, wie man einen Käfer aufspießt, ohne dass er leidet. So hat er es selbst gesagt: ohne dass er leidet.
narr: Er hatte „Master Edmund“ gesagt. Sofort presste er die Lippen aufeinander.
hobbes[neutral]: Der Herr war ein pünktlicher Mann. Das ist alles, Miss.

=== t1_harriet_bell
kind: topic
npc: harriet
title: Die Glocke im Wasser
when: ch<=2 f:k1_delivered
---
sera: Die Glocke unter dem Moor – was hat es damit auf sich?
harriet[neutral]: Eine Sage. Als das Meer im Mittelalter die alte Kirche von St. Aldhelm verschlang, soll die Glocke mit versunken sein. Bei Hochwasser hört man sie läuten.
harriet[neutral]: Wer sie hört, dem wird vergeben. Aber nur, solange es dunkel ist; mit dem ersten Licht verstummt sie. So erzählen es die Moorbauern.
harriet[sad]: Lucinda hat es geglaubt. Oder sie hat so getan, weil es Edmund zum Lächeln brachte.
harriet[neutral]: Gestern Abend, bei der Sitzung, hat sie davon gesprochen. Durch Mrs. Penrose. „Hörst du die Glocke im Wasser, Edmund?“
harriet[neutral]: Er ist hinausgegangen, ohne ein Wort. Er war erschüttert. Man ist erschüttert, wenn man die Wahrheit hört.
* [direkt] Haben Sie in der Nacht selbst etwas gehört? -> a
* [mitfuehlend] Und Sie? Hat sie auch mit Ihnen gesprochen? {harriet+1} -> b
# a
harriet[neutral]: Ich habe geschlafen, Miss Hale. Mrs. Pryce hat mir meine Tropfen gegeben, wie jeden Abend seit – wie jeden Abend. {+s:s16}
-> END
# b
harriet[neutral]: Mit mir spricht man nicht. Ich bin die, die fragt.

=== t1_harriet_duties
kind: topic
npc: harriet
title: Meine Aufgaben
when: ch=1 f:k1_delivered
---
sera: Was genau erwarten Sie von mir, Miss Averley?
harriet[neutral]: Dasselbe, was man von jeder Gesellschafterin erwartet. Man hat es Ihnen doch gewiss erklärt.
* [ausweichend] Gewiss. Aber ich höre es lieber von Ihnen. {harriet+1} -> a
* [ehrlich] Ehrlich gesagt – nicht so richtig. {sus+2} -> b
# a
harriet[neutral]: Sie lesen mir vor. Die Times und die Psalmen, nicht in dieser Reihenfolge. Sie schreiben meine Briefe. Sie begleiten mich zum Gottesdienst, wenn das Wasser es erlaubt. Und Sie widersprechen mir nicht vor den Dienstboten.
harriet[neutral]: Unter vier Augen dürfen Sie es versuchen.
-> END
# b
harriet[tense]: Nicht so richtig.
harriet[neutral]: Man hat mir eine Person aus gutem Hause und mit Erfahrung empfohlen. Sie sprechen wie ein Schulmädchen, Miss Hale.
harriet[neutral]: Sie lesen vor, Sie schreiben Briefe, Sie begleiten mich, und Sie widersprechen mir nicht vor den Dienstboten. Das werden Sie sich merken können.
inner: Das war knapp. Nächstes Mal sage ich einfach „gewiss“.

=== t1_lionel_night
kind: topic
npc: lionel
title: Die Nacht
when: ch<=2 f:k1_library_done !k:s03
---
sera: Haben Sie in der Nacht etwas gehört, Captain?
lionel[neutral]: Ich? Ich war ab Mitternacht im Bett und habe geschlafen wie ein Stein. {+s:s03, lie:f07}
lionel[warm]: Wie ein sehr betrunkener Stein, wenn Sie’s genau wissen wollen. Da hört man nichts.
lionel[neutral]: Fragen Sie lieber Mrs. Penrose, was sie gehört hat. Die hört ja sogar Tote.
inner: Er lacht über seinen eigenen Witz. Eine Sekunde zu lang.

=== t1_lionel_father
kind: topic
npc: lionel
title: Ihr Vater
when: ch<=2 f:k1_library_done
---
sera: Wie war Ihr Vater?
lionel[neutral]: Genau. Pünktlich. Schweigsam. Er konnte einen ganzen Nachmittag lang ein Moos ansehen und einem hinterher sagen, wie viel Regen es im März gab.
lionel[neutral]: Der alte Herr und ich hatten ein Arrangement: Er war enttäuscht, und ich gab ihm Anlass.
* [mitfuehlend] Das klingt einsam. Für Sie beide. {lionel+1} -> a
* [humor] Klingt nach einem Arrangement, das sich bewährt hat. -> b
# a
lionel[tense]: Einsam.
narr: Er drehte das leere Glas in der Hand und sagte eine Weile nichts.
lionel[neutral]: Ich war nicht einsam, Miss Hale. Ich war im Regiment. Da ist man nie allein. Das ist beinahe dasselbe.
-> END
# b
lionel[warm]: Siebzehn Jahre ohne Unterbrechung. Dafür sollte ich einen Orden bekommen.
lionel[neutral]: … Er hat mir nie einen gegeben.

=== t1_penrose_night
kind: topic
npc: penrose
title: Heute Nacht
when: ch<=3 f:k1_library_done !k:s05
---
sera: Sie haben gesagt, wir seien uns heute Nacht begegnet.
penrose[neutral]: Sagte ich das? Nach einer Sitzung sagt man vieles. In solchen Nächten sind die Grenzen dünn, meine Liebe.
sera: Haben Sie denn geschlafen?
penrose[neutral]: Ich schlafe in fremden Häusern ausgezeichnet. Ein Gewissen ist ein Luxus, den ich mir nicht leisten kann. Ich habe nichts gehört. {+s:s05, lie:f06}
penrose[neutral]: Aber Sie – Sie tragen ein fremdes Kleid. Und Sie tragen es wie eine Rolle, die man Ihnen heute früh zugesteckt hat.
* [humor] Das Kleid ist sehr gut. Nur die Rolle zwickt ein bisschen. {penrose+1} -> a
* [ausweichend] Es hat meiner Vorgängerin gehört. -> b
# a
penrose[warm]: Ha. Sie gefallen mir. Das ist für uns beide unpraktisch.
-> END
# b
penrose[neutral]: Wie praktisch. Dann kennt es den Weg.

=== t1_penrose_seance
kind: topic
npc: penrose
title: Die Séance
when: ch<=2 f:k1_library_done
---
sera: Was ist gestern Abend bei der Sitzung passiert?
penrose[neutral]: Was immer passiert. Wir saßen im Kreis, wir hielten uns an den Händen, die Kerze brannte herunter. Miss Averley hoffte. Der Captain spottete. Miss Clara zählte meine Atemzüge.
penrose[neutral]: Und dann kam eine Dame, die sich Lucinda nannte, und sprach zu ihrem Mann. „Hörst du die Glocke im Wasser, Edmund? Du hast versprochen, sie wählen zu lassen.“
sera: Und er?
penrose[neutral]: Er stand in der Tür. Er kam zu spät, wie Ungläubige das tun. Und er sah mich an – nicht wie ein Mann, der einen Geist hört. Wie einer, der seine eigene Stimme wiedererkennt. {hints:f20}
narr: Sie brach ab und presste kurz die Lippen zusammen.
penrose[neutral]: Ich gebe weiter, was mir gegeben wird, Miss Hale. Woher es kommt, ist nicht meine Sache.
inner: „Seine eigene Stimme.“ Das war kein Versprecher.

=== s1_tilly
kind: smalltalk
npc: tilly
when: ch=1
---
tilly[neutral]: Mrs. Pryce sagt, ich soll Sie nich stören, Miss.
tilly[warm]: Die Katze stör ich aber. Die hat nix dagegen.
yuumi: (Yuumi rollte sich auf den Rücken und bot Tilly ihren Bauch an. Das war eine Falle, und Tilly fiel prompt darauf herein.)

=== s1_pryce
kind: smalltalk
npc: pryce
when: ch=1
---
pryce[neutral]: Zwölf Pfund Mehl, drei Schinken, und das Wasser steht bis zum Brunnenrand. Verhungern tun wir nicht. Nur schlecht gelaunt werden wir.
* [humor] Sie oder ich? -> a
* [neutral] Kann ich irgendwas tun? -> b
# a
pryce[neutral]: Ich, Miss. Bei Ihnen ist es schon so weit.
-> END
# b
pryce[neutral]: Sie können aufhören, in meiner Küche rumzustehen. – Oder Zwiebeln schneiden. Suchen Sie sich was aus.

=== s1_hobbes
kind: smalltalk
npc: hobbes
when: ch=1 f:k1_left_study
---
hobbes[neutral]: Miss.
* [neutral] (Ihm die Hand hinhalten.) Danke für vorhin, Mr. Hobbes. {sus+2} -> a
* [neutral] (Nicken.) -> b
# a
narr: Hobbes sah auf ihre Hand hinunter und nahm sie nicht.
hobbes[neutral]: Man reicht dem Butler nicht die Hand, Miss. Man nickt. Wenn überhaupt.
inner: Okay. Butler sind keine Kollegen. Das muss ich Fritz erzählen.
-> END
# b
hobbes[neutral]: Miss. {hobbes+1}

=== s1_harriet
kind: smalltalk
npc: harriet
when: ch=1 f:k1_delivered
---
harriet[neutral]: Sie sehen blass aus, Miss Hale. Haben Sie gegessen?
* [humor] Kartoffeln. Sehr dünn geschält. -> a
* [neutral] Ja, danke. Mrs. Pryce war sehr freundlich. -> b
# a
harriet[neutral]: Sie haben in der Küche geschält? {sus+1}
harriet[neutral]: Tun Sie das nicht wieder. Man wird sonst glauben, Sie gehörten nach unten.
-> END
# b
harriet[neutral]: Mrs. Pryce ist nie freundlich. Sie ist gerecht. Das ist seltener.

=== s1_lionel
kind: smalltalk
npc: lionel
when: ch=1 f:k1_library_done
---
lionel[neutral]: Möchten Sie einen Sherry, Miss Hale? Nein, natürlich nicht. Es ist Vormittag, und Sie sind anständig.
lionel[warm]: Dann bin ich hier der Einzige, der am Vormittag ehrlich trinkt. Was für ein Tag.

=== s1_penrose
kind: smalltalk
npc: penrose
when: ch=1 f:k1_library_done
---
penrose[neutral]: Die Toten sind geduldig, Miss Hale. Es sind die Lebenden, die Rechnungen schicken.
penrose[neutral]: Ich würde abreisen, wenn ich könnte. Aber das Wasser ist, wie Sie sehen, auch sehr geduldig.

=== t_yuumi_colonel
kind: topic
npc: lionel
title: Die Katze
when: yuumi f:k1_library_done
---
narr: Yuumi strich um die Beine des Sessels und setzte sich vor die Stiefel des Captains.
lionel[surprised]: Hallo. Wer bist denn du?
lionel[warm]: Im Regiment hatten wir eine Katze. Grau wie du, nur doppelt so breit. Sie hieß Mrs. Colonel, weil sie jeden Morgen die Parade abnahm.
lionel[warm]: Haben sie in Peshawar begraben. Mit drei Salutschüssen. Der Colonel war nicht erfreut.
narr: Er streckte die Hand aus. Yuumi schnupperte daran und legte sich dann ganz selbstverständlich auf seine Stiefelspitze. {lionel+1}
lionel[neutral]: … Sie riecht nach Regen. Wie Sie, Miss Hale.
inner: Er mag Katzen. Das macht ihn mir gleich sympathischer. Und zum ersten Mal spottet er nicht.
`;
