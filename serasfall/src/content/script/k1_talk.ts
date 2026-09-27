export default `
=== t1_tilly_herr
kind: topic
npc: tilly
title: Der Herr
when: ch=1 f:k1_kitchen_done
---
sera: Hast du ihn gut gekannt? Den Herrn?
tilly[neutral]: Gekannt? Ich bin Küchenmädchen, Miss. Ich kenn die Kohlen.
tilly[neutral]: Er hat mich mal gefragt, wie ich heiß. Auf dem Hof, wie ich die Asche rausgetragen hab. Und dann noch mal, im Sommer.
tilly[warm]: Beim zweiten Mal hat er’s sich gemerkt. „Tilly“, hat er gesagt. „Du singst falsch, Tilly.“ Und dann hat er gelacht.
narr: Ihr Lächeln hält genau einen Atemzug lang. Dann dreht sie sich zum Herd, und ihre Schultern sind auf einmal sehr schmal. {pause:500}
* [mitfuehlend] (Nichts sagen. Neben ihr stehen bleiben.) {tilly+1} -> a
* [direkt] Tilly, weißt du etwas über heute Nacht? {tilly-1} -> b
# a
tilly[sad]: … Der Herd geht aus, wenn man nich aufpasst.
inner: Sie weint nicht. Sie schaufelt Kohlen, sehr gründlich.
-> END
# b
tilly[tense]: Nein, Miss. Ich hab doch geschlafen. Ich hab’s doch gesagt.
inner: Zu früh. Das war zu früh.

=== t1_tilly_bell
kind: topic
npc: tilly
title: Das Glöckchen auf der Treppe
when: ch<=2 k:s07
---
sera: Das Klingeln heute Nacht auf der Treppe. Was glaubst du, war das?
tilly[tense]: Mrs. Pryce sagt, das war der Wind. Aber der Wind hat doch kein Glöckchen.
tilly[tense]: Miss Averley sagt, bei Hochwasser läutet unter dem Moor die Glocke von der alten Kirche. Die, die ertrunken is. Und dann holt sie wen.
narr: Ihr Blick wandert zu Yuumi, die unter dem Tisch sitzt und sich eine Pfote putzt. Das Glöckchen klingt leise. {sfx:bell}
* [ehrlich] Ich glaube, es war Yuumi. {tilly+1, +f:k1_told_bell} -> a
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
inner: Sie glaubt es nicht. Ich auch nicht.

=== t1_tilly_letters
kind: topic
npc: tilly
title: Die Buchstaben im Tisch
when: seen:ex_k_tisch !f:g_teach
---
sera: Die Buchstaben an der Tischkante. T, I, L. Warst du das?
tilly[surprised]: Das – das sieht keiner, Miss. Das is da unten, wo keiner hinguckt.
tilly[tense]: Sagen Sie’s nich Mrs. Pryce. Die sagt, der Tisch is älter als sie, und sie is alt.
tilly[neutral]: Das T hat mir Miss Clara gezeigt. Einmal. Im Frühjahr, wie sie in der Küche auf ’n Brief gewartet hat. T wie Tilly. Und wie Tee.
tilly[neutral]: In der Arbeitshausschule hab ich Kartoffeln geschält. Die Lehrerin brauchte immer eine für die Küche, und ich war schnell.
tilly[neutral]: Das I is leicht, das is nur ’n Strich. Das L hab ich mir selbst ausgedacht.
inner: Das L ist verkehrt herum. Es sieht aus wie ein kleiner Galgen.
* [mitfuehlend] Soll ich dir den Rest zeigen? Dein ganzer Name hat nur fünf Buchstaben. {tilly+2, +f:g_teach} -> yes
* [humor] Das L ist fast richtig. Es schaut nur in die falsche Richtung. Wie Yuumi, wenn man sie ruft. {tilly+1, +f:g_teach} -> yes
# yes
tilly[surprised]: Jetzt?
tilly[warm]: Nich jetzt. Wenn Mrs. Pryce schläft. Oder – wenn die Kartoffeln fertig sind.
narr: Sie wischt mit dem Ärmel über die Tischkante, als könne man die Buchstaben damit verstecken. Dann nicht mehr ganz so schnell.

=== t1_pryce_bells
kind: topic
npc: pryce
title: Die kleinen Glocken
when: ch=1 f:k1_kitchen_done
---
sera: Die kleinen Glocken dort über der Tür – läuten die oft?
pryce[neutral]: Wenn die Herrschaft was will. Jede Glocke ein Zimmer. Salon, Speisezimmer, Arbeitszimmer, Miss Averley, und so weiter.
? k:c02 -> wire
sera: Und heute Nacht?
pryce[neutral]: Heut Nacht hat keine Glocke geläutet. Und wenn eine geläutet hätte, wär’s Mr. Hobbes’ Sache gewesen. {+s:s02, lie:f08}
narr: Die Schlüssel an ihrer Hüfte klirren, als sie sich zum Herd dreht.
-> END
# wire
sera: Die Glocke vom Arbeitszimmer hängt schief. Der Draht ist ganz lang gezogen.
pryce[tense]: Das Haus ist alt. Die Drähte auch. {pause:400}
pryce[neutral]: Heut Nacht hat keine Glocke geläutet. Und wenn, wär’s Mr. Hobbes’ Sache gewesen. {+s:s02, lie:f08}
pryce[neutral]: Tilly! Die Kohlen. Nicht morgen. Jetzt.
inner: Sie hat nicht mich angesehen, als sie das sagte. Sie hat Tilly angesehen.

=== t1_pryce_tilly
kind: topic
npc: pryce
title: Tilly
when: ch<=2 f:k1_kitchen_done
---
sera: Tilly ist noch sehr jung.
pryce[neutral]: Dreizehn. Aus dem Arbeitshaus in Bridgwater, seit letztem Herbst hier.
pryce[neutral]: Flink ist sie. Frech ist sie. Und sie singt falsch beim Kohlentragen. Der Herr hat’s gern gehört, weiß der Himmel warum.
narr: Ihre Hände hören einen Augenblick auf, den Teig zu schlagen.
pryce[neutral]: Man holt so ein Kind nicht aus dem Arbeitshaus, damit es wieder zurückmuss. Das merken Sie sich, Miss. Egal was Sie hier oben aufschnappen.
inner: Eine Drohung, sehr höflich verpackt.

=== t1_pryce_herr
kind: topic
npc: pryce
title: Der Herr
when: ch=1 f:k1_kitchen_done
---
sera: Was war er für ein Herr?
pryce[neutral]: Einer, der nie gefragt hat, was die Kohlen kosten. Nur, ob’s überall warm ist.
pryce[neutral]: Hat im Sommer die Köchin gehen lassen, weil er sparen wollte, und mir dafür zwei Pfund mehr gegeben, weil ich jetzt doppelt arbeite. So war der.
pryce[sad]: Sparsam mit allem außer mit Leuten.

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
* [direkt] Aber jemand hat es verhängt. -> a
* [neutral] Das ist sehr treu von Ihnen. {hobbes+1} -> b
# a
hobbes[neutral]: Miss Averley ließ heute früh alle Spiegel verhängen. Sie hielt es für ein Spiegelinstrument. Es ist nicht an mir, Miss Averley zu verbessern.
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
hobbes[neutral]: Master Edmund war damals zwölf. Er hat mir gezeigt, wie man einen Käfer aufspießt, ohne dass er leidet. Das hat er selbst so gesagt: ohne dass er leidet.
narr: Er sagt „Master Edmund“, und sofort presst er die Lippen aufeinander, als sei ihm ein Glas zerbrochen.
hobbes[neutral]: Der Herr war ein pünktlicher Mann. Das ist alles, Miss.

=== t1_harriet_bell
kind: topic
npc: harriet
title: Die Glocke im Wasser
when: ch<=2 f:k1_delivered
---
sera: Die Glocke unter dem Moor – was hat es damit auf sich?
harriet[neutral]: Eine Sage. Als das Meer im Mittelalter die alte Kirche von St. Aldhelm verschlang, sagt man, versank die Glocke mit. Bei Hochwasser hört man sie läuten.
harriet[neutral]: Wer sie hört, dem wird vergeben. Aber nur, solange es dunkel ist; mit dem ersten Licht verstummt sie wieder. So erzählen es die Moorbauern.
harriet[sad]: Lucinda hat es geglaubt. Oder sie hat so getan, weil es Edmund zum Lächeln brachte.
harriet[neutral]: Gestern Abend, bei der Sitzung, hat sie davon gesprochen. Durch Mrs. Penrose. „Hörst du die Glocke im Wasser, Edmund?“
harriet[neutral]: Er ist hinausgegangen, ohne ein Wort. Er war erschüttert. Man ist erschüttert, wenn man die Wahrheit hört.
* [direkt] Haben Sie in der Nacht selbst etwas gehört? -> a
* [mitfuehlend] Und Sie? Hat sie auch zu Ihnen gesprochen? {harriet+1} -> b
# a
harriet[neutral]: Ich habe geschlafen, Miss Hale. Mrs. Pryce hat mir meine Tropfen gegeben, wie jeden Abend seit – wie jeden Abend. {+s:s16}
-> END
# b
harriet[neutral]: Zu mir spricht man nicht. Ich bin die, die fragt.

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
inner: Das war knapp. Ich sollte aufhören, ehrlich zu sein, wo es niemandem hilft.

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
inner: Er lacht über seinen eigenen Witz, eine Sekunde zu lang.

=== t1_lionel_father
kind: topic
npc: lionel
title: Ihr Vater
when: ch<=2 f:k1_library_done
---
sera: Wie war Ihr Vater?
lionel[neutral]: Genau. Pünktlich. Schweigsam. Er konnte einen Nachmittag lang ein Moos ansehen und einem hinterher sagen, wie viel Regen es im März gab.
lionel[neutral]: Der alte Herr und ich hatten ein Arrangement: Er war enttäuscht, und ich gab ihm Anlass.
* [mitfuehlend] Das klingt einsam. Für Sie beide. {lionel+1} -> a
* [humor] Klingt nach einem Arrangement, das sich bewährt hat. -> b
# a
lionel[tense]: Einsam.
narr: Er dreht das leere Glas in der Hand, als suche er darin das Wort.
lionel[neutral]: Man ist nicht einsam in einem Kavallerieregiment, Miss Hale. Man ist nur nie allein.
-> END
# b
lionel[warm]: Siebzehn Jahre ohne Unterbrechung. Ich sollte einen Orden dafür bekommen.
lionel[neutral]: … Er hat mir nie einen gegeben.

=== t1_penrose_night
kind: topic
npc: penrose
title: Heute Nacht
when: ch<=3 f:k1_library_done !k:s05
---
sera: Sie sagten, wir seien uns heute Nacht begegnet.
penrose[neutral]: Sagte ich das? Man sagt vieles nach einer Sitzung. Die Grenzen sind dünn in solchen Nächten, meine Liebe.
sera: Haben Sie denn geschlafen?
penrose[neutral]: Ich schlafe in fremden Häusern ausgezeichnet. Ein Gewissen ist ein Luxus, den ich mir nicht leisten kann. Ich habe nichts gehört. {+s:s05, lie:f06}
penrose[neutral]: Aber Sie – Sie tragen ein fremdes Kleid. Und Sie tragen es wie eine Rolle, die man Ihnen heute früh zugesteckt hat.
* [humor] Es ist ein sehr gutes Kleid. Nur die Rolle zwickt ein bisschen. {penrose+1} -> a
* [ausweichend] Es gehörte meiner Vorgängerin. -> b
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
sera: Was ist gestern Abend bei der Sitzung geschehen?
penrose[neutral]: Was immer geschieht. Wir saßen im Kreis, wir hielten einander an den Händen, die Kerze brannte herunter. Miss Averley hoffte. Der Captain spottete. Miss Clara zählte meine Atemzüge.
penrose[neutral]: Und dann kam eine Dame, die sich Lucinda nannte, und sprach zu ihrem Mann. „Hörst du die Glocke im Wasser, Edmund? Du hast versprochen, sie wählen zu lassen.“
sera: Und er?
penrose[neutral]: Er stand in der Tür. Er war zu spät gekommen, wie Ungläubige es tun. Er sah mich an – nicht wie ein Mann, der einen Geist hört. Wie einer, der seine eigene Stimme wiedererkennt. {hints:f20}
narr: Sie hält inne, als hätte sie mehr gesagt, als sie wollte.
penrose[neutral]: Ich gebe weiter, was mir gegeben wird, Miss Hale. Woher es kommt, ist nicht meine Sache.
inner: „Seine eigene Stimme.“ Kein Versprecher.

=== s1_tilly
kind: smalltalk
npc: tilly
when: ch=1
---
tilly[neutral]: Mrs. Pryce sagt, ich soll Sie nich stören, Miss.
tilly[warm]: Die Katze stör ich aber. Die hat nix dagegen.
yuumi: (Yuumi rollt sich auf den Rücken und bietet Tilly ihren Bauch an, eine Falle, die älter ist als dieses Haus.)

=== s1_pryce
kind: smalltalk
npc: pryce
when: ch=1
---
pryce[neutral]: Zwölf Pfund Mehl, drei Schinken, und das Wasser steht bis zum Brunnenrand. Verhungern tun wir nicht. Nur schlecht gelaunt werden wir.
* [humor] Bei Ihnen oder bei mir? -> a
* [neutral] Kann ich etwas tun? -> b
# a
pryce[neutral]: Bei mir, Miss. Bei Ihnen ist es schon so weit.
-> END
# b
pryce[neutral]: Sie können aufhören, in meiner Küche herumzustehen. – Oder Zwiebeln schneiden. Suchen Sie sich was aus.

=== s1_hobbes
kind: smalltalk
npc: hobbes
when: ch=1 f:k1_left_study
---
hobbes[neutral]: Miss.
* [neutral] (Ihm die Hand hinhalten.) Danke für vorhin, Mr. Hobbes. {sus+2} -> a
* [neutral] (Nicken.) -> b
# a
narr: Hobbes sieht ihre Hand an wie etwas, das auf den Teppich gefallen ist.
hobbes[neutral]: Man reicht dem Butler nicht die Hand, Miss. Man nickt. Wenn überhaupt.
inner: Notiz an mich: Butler sind keine Kollegen.
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
harriet[neutral]: Mrs. Pryce ist nie freundlich. Sie ist nur gerecht. Das ist seltener.

=== s1_lionel
kind: smalltalk
npc: lionel
when: ch=1 f:k1_library_done
---
lionel[neutral]: Möchten Sie einen Sherry, Miss Hale? Nein, natürlich nicht. Es ist Vormittag, und Sie sind anständig.
lionel[warm]: Das macht mich zum Einzigen hier, der ehrlich ist. Welch ein Tag.

=== s1_penrose
kind: smalltalk
npc: penrose
when: ch=1 f:k1_library_done
---
penrose[neutral]: Die Toten sind geduldig, Miss Hale. Es sind die Lebenden, die Rechnungen schicken.
penrose[neutral]: Ich würde abreisen, wenn ich könnte. Aber das Wasser ist, wie Sie sehen, von der geduldigen Sorte.

=== t_yuumi_colonel
kind: topic
npc: lionel
title: Die Katze
when: yuumi f:k1_library_done
---
narr: Yuumi streicht um die Beine des Sessels und bleibt vor den Stiefeln des Captains sitzen.
lionel[surprised]: Hallo. Wer bist denn du?
lionel[warm]: Im Regiment hatten wir eine Katze. Grau wie du, nur doppelt so breit. Mrs. Colonel hieß sie, weil sie jeden Morgen die Parade abnahm.
lionel[warm]: Haben sie in Peshawar begraben. Mit drei Salutschüssen. Der Colonel war nicht erfreut.
narr: Er streckt die Hand aus, Yuumi schnuppert daran und legt sich dann, mit großer Selbstverständlichkeit, auf seine Stiefelspitze. {lionel+1}
lionel[neutral]: … Sie riecht nach Regen. Wie Sie, Miss Hale.
inner: Das erste Mal, dass seine Stimme nicht spottet.
`;
