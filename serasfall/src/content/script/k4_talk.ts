export default `
=== t_clara_night
kind: topic
npc: clara
title: Die Nacht auf Mittwoch
when: ch>=2 ch<=4 seen:k2_dark !k:s04
---
sera: Wo waren Sie in der Nacht, Miss Clara? Nach der Séance?
clara[neutral]: Ich bin nach der Séance zu Bett gegangen. {+s:s04, lie:f06}
clara[neutral]: Wann genau, weiß ich nicht. Ich hatte keine Uhr in der Hand.
inner: Sie misst jeden Tag den Regen auf das Hundertstel Zoll. Und sie weiß nicht, wann sie ins Bett gegangen ist.

=== pr_clara_c26
kind: present
npc: clara
items: c26,d14
when: ch>=3
---
narr: Clara sieht das Taschentuch an. Ihr Monogramm, von ihrer Mutter gestickt, in blauem Garn.
clara[tense]: Wo haben Sie das her?
sera: Aus dem Gästezimmer. Unter dem Sessel am Kamin.
? t:clara>=5 -> open
clara[neutral]: Ich habe viele Taschentücher, Miss Hale. Mrs. Penrose wird es beim Waschen verwechselt haben.
inner: Mrs. Penrose wäscht keine Wäsche. Und Clara weiß das.
-> END
# open
narr: Sie nimmt es. Sie faltet es auf, dann wieder zusammen, sehr genau, Kante auf Kante.
clara[sad]: Ich war bei ihr. In der Nacht. Von kurz vor zwei bis gegen halb drei. {+s:s23, reveals:f06}
clara[sad]: Ich, die ich jedes Wort von ihr für Betrug halte. Ich bin im Nachthemd durch die Galerie geschlichen und habe an ihre Tür geklopft und sie gefragt, ob es wahr war. Ob Mama wirklich –
clara[neutral]: Sie hat mir die Wahrheit gesagt. Das ist das Merkwürdigste an dieser ganzen Nacht. Die Betrügerin hat mir die Wahrheit gesagt.
* [direkt] Welche Wahrheit? -> a
* [mitfuehlend] Sie wollten, dass es echt ist. {clara+1} -> b
# a
clara[neutral]: Fragen Sie sie. Ich kann es nicht noch einmal aussprechen.
-> END
# b
clara[angry]: Ich wollte gar nichts. Ich wollte – {pause:600}
clara[sad]: Ja. Eine Sekunde lang. Das werden Sie niemandem erzählen.
inner: Das ist das Letzte, was Clara Averley je zugeben wollte. Und sie hat es mir gegeben.

=== pr_penrose_c26
kind: present
npc: penrose
items: c26,d14
when: ch>=3
---
narr: Mrs. Penrose sieht das Taschentuch. Dann Yuumi. Dann Sera.
penrose[warm]: Ihre Katze stiehlt. Das gefällt mir.
penrose[neutral]: Ja, sie war bei mir. Ich habe gelogen, als ich sagte, ich hätte geschlafen. Ich lüge beruflich, meine Liebe; es wäre unprofessionell gewesen, bei Ihnen eine Ausnahme zu machen. {reveals:f06}
penrose[neutral]: Sie kam um zwei, barfuß, mit einer Kerze, und sie fragte mich, ob es echt sei. Ob ihre Mutter gesprochen habe.
penrose[neutral]: Ich hätte ja sagen können. Das hätte mich nichts gekostet. {pause:500}
penrose[neutral]: Ich habe nein gesagt.

=== pr_penrose_c22_4
kind: present
npc: penrose
items: c22,d15,c14
when: ch>=4
important: yes
---
narr: Die Karte. Das „Aug.“ in der engen Handschrift. Mrs. Penrose nimmt sie diesmal nicht.
? t:penrose>=5 -> open
penrose[neutral]: Wir hatten das schon, meine Liebe. Viele Leute kommen im August.
-> END
# open
penrose[neutral]: Setzen Sie sich.
narr: Es ist das erste Mal, dass sie es sagt, ohne zu lächeln.
penrose[neutral]: Er kam im August nach Bath. Er nannte keinen Namen. Er hatte schwarze Fingerspitzen, und er setzte sich auf den Stuhl, als säße er in einer Vorlesung, in der er nicht an den Vortragenden glaubt. {+s:s22, reveals:f02}
penrose[neutral]: Er sagte, er sei nicht gekommen, um mit Toten zu sprechen. Er wolle nur sehen, wie ich es mache. Und dann saß er eine Stunde da und erzählte mir von seiner Frau.
penrose[neutral]: Von einer Glocke unter dem Moor. Von einem Versprechen, das er ihr gegeben hatte, als sie starb. Lass sie wählen. Er hat es zweimal gesagt, als müsse er es sich selbst noch einmal vorsprechen. {reveals:f20}
penrose[sad]: Ich habe ihm am Dienstagabend seine eigenen Worte zurückgegeben, Miss Hale. In der Stimme seiner Frau. Vor seiner Schwester und seinen Kindern.
penrose[sad]: Er stand in der Tür und sah mich an, und er wusste, woher ich es hatte. Er hat nichts gesagt. Er ist nur gegangen.
* [mitfuehlend] Sie wussten nicht, dass er krank war. {penrose+1} -> a
* [direkt] Warum haben Sie es getan? -> b
# a
penrose[neutral]: Nein. Aber ich wusste, dass er es nicht erzählt hatte, damit ich es verkaufe. Das wusste ich sehr genau.
-> END
# b
penrose[neutral]: Weil seine Schwester mich bezahlte und es gewollt hat. Weil es gut war. Weil es immer gut ist, wenn es wahr ist.
penrose[sad]: Das ist das Geheimnis meines Berufs, Miss Hale. Das Wahrste ist das Grausamste. Ich hätte es wissen müssen.

=== t4_penrose_saw
kind: topic
npc: penrose
title: Was Sie in der Nacht sahen
when: ch>=4 t:penrose>=7 anyk:c29,d16
important: yes
---
sera: Sie haben am ersten Morgen gesagt, wir seien uns in der Nacht begegnet. Das war kein Trick.
penrose[neutral]: Nein. {pause:700}
penrose[neutral]: Ich konnte nicht schlafen, nachdem Miss Clara gegangen war. Man schläft schlecht, wenn man zur Abwechslung die Wahrheit gesagt hat. Kurz vor drei hörte ich ein Glöckchen. Ganz fein. Ich trat auf die Galerie.
penrose[neutral]: Unten auf der Treppe saß ein Dienstmädchen mit einer Kerze und weinte. Und neben ihr – {pause:600}
penrose[neutral]: Neben ihr saß eine Frau, blass, als wäre sie aus Nebel, mit hellem Haar und einem kleinen Tier auf dem Schoß. {+s:s30, reveals:f16}
penrose[sad]: Ich habe zwanzig Jahre lang Geister erfunden, Miss Hale. Und in der einen Nacht, in der ich einen sehe, gehe ich in mein Zimmer und schließe ab.
penrose[sad]: Und das Kind habe ich dort sitzen lassen. Ich habe ein Kind weinen sehen und die Tür abgeschlossen. So. Jetzt wissen Sie es.
* [ehrlich] Die Frau auf der Treppe war ich. {penrose+1, +f:g_sera_told_penrose} -> a
* [mitfuehlend] Sie hatten Angst. Das ist menschlich. {penrose+1} -> b
# a
narr: Mrs. Penrose sieht sie an. Nicht wie ein Medium. Wie eine Frau, die sehr müde ist und gerade etwas hört, das sie nicht mehr erklären muss.
penrose[neutral]: Ich weiß, meine Liebe. Ich wusste es in dem Augenblick, in dem Sie in die Bibliothek kamen. Ich wollte nur, dass Sie es sagen. {hints:f23}
penrose[warm]: Gott, bin ich froh, dass ich nicht verrückt bin. Ich hatte mich schon darauf eingerichtet.
-> END
# b
penrose[neutral]: Menschlich. Ja. Das ist das Wort, das man sagt, wenn einem kein besseres einfällt.
penrose[neutral]: Wer war das Mädchen, Miss Hale? Nein – sagen Sie es nicht. Ich weiß es. Es gibt nur eins im Haus, das so weint.

=== t4_lionel_bell
kind: topic
npc: lionel
title: Die Glocke im Wasser
when: ch>=4 f:k3_lionel_broken
---
narr: Der Captain sitzt in der Bibliothek, das verkohlte Blatt auf dem Knie. Er trinkt nicht. Die Karaffe steht neben ihm, voll.
lionel[neutral]: Wissen Sie, was das Merkwürdigste war, in dieser Nacht? Als ich hinaufging, später, mit der Lampe. Auf der Treppe.
lionel[neutral]: In der Nacht habe ich auf der Treppe ein Glöckchen gehört. Hinter dem Vorhang am Fenstersitz. Ganz fein. Und ich dachte: Das ist sie. Die Glocke im Wasser. Mutters Glocke. Sie kommt, um mir zu sagen, dass ich – {+s:s20}
narr: Er bricht ab. Sein Blick fällt auf Yuumi, die auf dem Kaminvorleger liegt, und auf das kleine Glöckchen an ihrem Hals.
lionel[surprised]: …
lionel[neutral]: Das war Ihre Katze. Hinter dem Vorhang. In der Nacht auf Mittwoch. Aber da waren Sie doch noch gar nicht –
inner: Er rechnet. Man sieht, wie er rechnet, und wie die Rechnung nicht aufgeht.
lionel[neutral]: Ich will es nicht wissen, Miss Hale. Ich habe genug Gespenster für ein Leben.

=== t4_hobbes_chair
kind: topic
npc: hobbes
title: Der Sessel
when: ch>=4 k:d04 k:c08 t:hobbes>=6
important: yes
---
sera: Mr. Hobbes. Ich weiß, dass Sie ihn nicht im Sessel gefunden haben. Und ich weiß, warum Sie die Gläser gespült haben.
narr: Hobbes steht sehr gerade. Dann, zum ersten Mal, seit Sera ihn kennt, setzt er sich. Auf die Kante eines Stuhls in der Halle, der nicht zum Sitzen gedacht ist.
hobbes[sad]: Ich fand ihn am Boden vor dem Kamin. Um Viertel nach sechs. Auf der Seite, die Hand zum Klingelzug ausgestreckt. {+s:s25, reveals:f14}
hobbes[sad]: Ich konnte ihn nicht auf dem Teppich liegen lassen, Miss. Master Edmund. Wie einen Betrunkenen. Wie einen – Sie hätten es auch nicht gekonnt.
hobbes[neutral]: Ich habe ihn in den Sessel gesetzt. Ich habe die Karaffe fortgenommen und die zwei Gläser, eines davon mit dem Rand, den Master Lionel immer an seinem Glas hinterlässt, weil er zu fest zubeißt, wenn er sich ärgert. Ich habe die Asche umgerührt. Ich habe Crabbe gelesen, bevor es verbrannte.
hobbes[sad]: Ich wollte, dass er friedlich gefunden wird. Und ich wollte, dass niemand fragt, wer bei ihm war.
hobbes[sad]: Neunundvierzig Jahre. Und in der einen Nacht, in der er mich gebraucht hätte, habe ich geschlafen.
* [mitfuehlend] Sie haben ihn geehrt, so wie Sie es konnten. {hobbes+2} -> a
* [ehrlich] Morgen kommt der Coroner. Er wird fragen. {hobbes+1} -> b
# a
hobbes[neutral]: Geehrt. {pause:400}
hobbes[neutral]: Ich habe ihn belogen, Miss. Er hat Lügen verachtet. Er hat nie in seinem Leben eine erzählt, nur geschwiegen.
-> END
# b
hobbes[neutral]: Ich weiß, Miss. Ich habe neunundvierzig Jahre lang gewusst, was man sagt und was man nicht sagt. Morgen werde ich es zum ersten Mal falsch machen müssen. {+f:g_hobbes_will_speak}

=== t4_harriet_letter
kind: topic
npc: harriet
title: Der Brief aus Bath
when: ch>=4 !f:g_harriet_told_sera t:harriet>=6 anyk:c24,c14,s39
---
sera: Miss Averley. Er wusste es, nicht wahr? Dass er krank war. Seit August.
narr: Miss Averley legt die Stickerei weg. Sie sieht nicht zum Fenster, nicht zur Tür. Sie sieht Sera an.
harriet[sad]: Seit August. Ein Arzt in Bath. Sein Herz. Monate, nicht Jahre. {+s:s29, reveals:f01}
harriet[sad]: Er hat mich schwören lassen, es den Kindern nicht zu sagen. „Sie sollen mich nicht sterben sehen, bevor ich sterbe, Harriet.“
narr: Sie schließt die Schreibkassette auf, nimmt einen Brief heraus und gibt ihn Sera, ohne ihn anzusehen. {+c:c23, +f:g_harriet_told_sera}
letter: Dr. H. Wilkes, Bath, 21. August 1877. – Angina pectoris in fortgeschrittenem Stadium. Ich kann Ihnen keine Jahre versprechen, sehr geehrter Mr. Averley, und muss Ihnen dringend raten, Aufregung jeder Art zu vermeiden.
harriet[sad]: Aufregung jeder Art. Und ich habe ihm eine Séance ins Haus geholt.

=== t4_pryce_tilly
kind: topic
npc: pryce
title: Tilly und die Treppe
when: ch=4 k:d16 !f:g_pryce_confessed
---
sera: Mrs. Pryce. Auf der Platte, die der Herr belichtet hat, sitzt ein Mädchen auf der Haupttreppe. Mitten in der Nacht.
narr: Die Schlüssel an ihrer Hüfte hören auf zu klirren. Sie legt die Hand darauf.
pryce[angry]: Man holt so ein Kind nicht aus dem Arbeitshaus, um es dann dem Constable zu geben, Miss. Das merken Sie sich.
pryce[angry]: Wenn Sie ihr wehtun, dann gibt’s in diesem Haus kein warmes Essen mehr für Sie. Kein einziges.
* [mitfuehlend] Ich will ihr nicht wehtun. Ich glaube, sie trägt etwas mit sich herum, das zu schwer für sie ist. {pryce+1} -> a
* [direkt] Sie haben die Glocke gehört, Mrs. Pryce. -> b
# a
pryce[sad]: Das tun wir alle, Miss. Das Kind nur am längsten.
-> END
# b
? t:pryce>=5 anyk:c27,d17 -> conf
pryce[neutral]: Ich hab gesagt, was ich gesagt hab.
-> END
# conf
narr: Mrs. Pryce setzt sich an den Küchentisch. Sie setzt sich sonst nie.
pryce[sad]: Um halb drei hat die Glocke vom Arbeitszimmer geläutet. Ich war wach, ich hab an Owen geschrieben. Ich hab das Kind gehen hören. Und ich hab mir gesagt: Das Kind ist schon auf, Agnes. Bleib sitzen. {+s:s26, reveals:f15, +f:g_pryce_confessed}
pryce[sad]: Und wie sie zurückkam und geweint hat, hab ich nicht gefragt. Weil ich’s nicht wissen wollte.
pryce[neutral]: Sagen Sie ihr das nicht. Das sag ich ihr selbst. Wenn ich den Mut hab.

=== s4_hobbes
kind: smalltalk
npc: hobbes
when: ch=4 f:g_agency
---
hobbes[neutral]: Miss. – Oder wie Miss nun zu nennen ist.
hobbes[neutral]: Es ist nicht an mir, das zu fragen. Das Haus hat in dieser Woche Schlimmeres beherbergt als eine Dame ohne Zeugnis.

=== s4_tilly
kind: smalltalk
npc: tilly
when: ch=4 !f:g_tilly_spoke
---
narr: Tilly schrubbt den Tisch dort, wo die Buchstaben eingeritzt sind, und schrubbt sie nicht weg.
tilly[neutral]: Handschuh hat heut früh ’ne Maus gebracht, Miss. Eine tote. Auf Mrs. Pryces Kopfkissen.
tilly[warm]: Die taugt doch was.

=== s4_tilly_after
kind: smalltalk
npc: tilly
when: ch>=4 f:g_tilly_spoke
---
tilly[neutral]: Mrs. Pryce hat heut Nacht nich geschlafen. Ich auch nich. Wir haben Tee getrunken und nix gesagt.
tilly[warm]: Das war schön. Das Nix-Sagen.

=== s4_pryce
kind: smalltalk
npc: pryce
when: ch=4
---
pryce[neutral]: Der Coroner kommt morgen. Dann will er Tee und Kekse und einen warmen Platz, und dann fragt er uns alle aus, einen nach dem andern.
pryce[neutral]: Ich back Ingwerkekse. Ingwer macht Männer freundlich. Sagt man.

=== s4_harriet
kind: smalltalk
npc: harriet
when: ch=4 f:g_agency
---
harriet[neutral]: Lesen Sie mir vor, Miss – Sera. Irgendetwas. Es ist mir gleich, was. Nur nicht die Psalmen.
narr: Sera liest aus der Times vom Montag. Getreidepreise. Das Wetter in Kent. Miss Averley schließt die Augen und hört zu, als wäre es Musik.

=== s4_lionel
kind: smalltalk
npc: lionel
when: ch=4
---
lionel[neutral]: Ich habe heute nichts getrunken, Miss Hale. Nicht einen Tropfen.
lionel[neutral]: Es ist entsetzlich. Man sieht alles so deutlich.

=== s4_penrose
kind: smalltalk
npc: penrose
when: ch=4
---
penrose[neutral]: Wenn das Wasser fällt, gehe ich. Mit dem ersten Boot. Es gibt Häuser, in denen man zu viel gesehen hat.
penrose[warm]: Sie sollten auch gehen, meine Liebe. Wohin auch immer man geht, wenn man von so weit her kommt wie Sie.

=== s4_clara
kind: smalltalk
npc: clara
when: ch=4
---
clara[neutral]: Ich habe heute keinen Abzug gemacht. Das Licht war zu schlecht.
clara[neutral]: Das ist gelogen. Ich wollte das Mädchen nicht noch einmal sehen. Und die andere auch nicht.
`;
