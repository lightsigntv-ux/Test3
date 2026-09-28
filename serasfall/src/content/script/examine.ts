// Untersuchungstexte für alle Orte und Kapitel. Spezifischere Varianten haben höhere Priorität.
export default `
=== ex_fenstersitz
kind: examine
target: h_fenstersitz
---
narr: Der Fenstersitz auf dem Halbpodest, hinter einem schweren Vorhang. Das Polster hat noch eine Kuhle in ihrer Form, und überall sind graue Katzenhaare.
inner: Hier bin ich aufgewacht. Als hätte mich jemand abgelegt wie einen Schirm, den man später abholen will.

=== ex_fenstersitz_4
kind: examine
target: h_fenstersitz
when: f:g_plate_dev
priority: 5
---
narr: Das Polster, die Kuhle, der Vorhang.
inner: Auf der Platte ist diese Stelle nur ein heller Fleck. Ich habe hier geschlafen, während unten ein Mann tot am Boden lag. Und keiner von uns wusste vom anderen.

=== ex_kamera_1
kind: examine
target: h_kamera
when: !k:c16
priority: 2
---
narr: Ein Kasten auf drei Holzbeinen, verhängt mit schwarzem Krepp wie die Spiegel. Unter dem Stoff blitzt ein Messingring hervor.
narr: Sera hebt den Saum ein wenig an. Ein Objektiv, auf die Treppe gerichtet, ein Messingdeckel darauf. Neben dem Stativ, auf dem Boden, ein Tropfen Talg. {+c:c16}
inner: Ein Fotoapparat. Wer stellt nachts einen Fotoapparat in eine Halle, mit dem Blick auf die Treppe?
yuumi: (Yuumi setzt sich einen Meter vor das Stativ, peitscht mit dem Schwanz und starrt den Krepp an, der sich im Luftzug bewegt.)
inner: Ja, ich weiß. Stoff, der sich von allein bewegt, ist verdächtig.

=== ex_kamera
kind: examine
target: h_kamera
---
narr: Der verhängte Kasten auf seinen drei Beinen, das Objektiv unter dem Krepp auf die Treppe gerichtet, geduldig wie ein Hund, der auf jemanden wartet.

=== ex_kamera_3
kind: examine
target: h_kamera
when: k:d11 !f:g_plate_dev
priority: 5
---
inner: Die Platte ist noch darin. Seit Dienstag, Mitternacht. Alles, was in dieser Nacht über die Treppe ging, ist dort drin – wenn man weiß, wie man es herausholt.
inner: Ich weiß es nicht. Aber ich kenne jemanden mit schwarzen Fingern.

=== ex_kamera_4
kind: examine
target: h_kamera
when: f:g_plate_dev
priority: 6
---
narr: Das Stativ steht noch da, der Krepp hängt schief. Der Kasten ist leer.
inner: Er wollte beweisen, dass nichts auf der Treppe wandelt. Er hatte fast recht.

=== ex_standuhr
kind: examine
target: h_standuhr
---
narr: Eine hohe Standuhr aus dunklem Holz. Die Zeiger stehen auf 6.25, das Pendel hängt still wie ein angehaltener Atem. {+c:c32}
inner: Hier hält man die Uhren an, wenn jemand stirbt. Als müsste die Zeit sich erst einmal hinsetzen.

=== ex_standuhr_d
kind: examine
target: h_standuhr
when: k:d05
priority: 5
---
narr: 6.25.
inner: Die Zeit, zu der man ihn fand. Nicht die, zu der er fiel. Das Haus erinnert sich an die falsche Minute.

=== ex_treppe
kind: examine
target: h_treppe
---
narr: Breite Eichenstufen mit einem roten Läufer. Am Rand, auf dem blanken Holz, ein paar helle Tropfen.
inner: Kerzenwachs. Jemand hat hier Licht getragen. In einem Haus ohne Strom nicht besonders verdächtig.

=== ex_treppe_t
kind: examine
target: h_treppe
when: f:k2_tallow_learned
priority: 5
---
narr: Sera kniet sich hin und reibt einen der Tropfen zwischen den Fingern. Weich, schmierig, gelblich. {+c:c17}
inner: Talg. Auf der Treppe der Herrschaft.

=== ex_portrait
kind: examine
target: h_portrait
---
narr: Ein Ölbild: ein Mann mit schmalem Gesicht und grau meliertem Backenbart, die Brille auf die Stirn geschoben, als hätte der Maler ihn beim Nachdenken unterbrochen. Unten auf dem Rahmen: Edmund Averley, 1869.
inner: Er sieht aus wie jemand, der lieber zuhört als redet. Und dem niemand zugehört hat, weil er so selten etwas sagte.

=== ex_portrait_5
kind: examine
target: h_portrait
when: f:g_letter_read
priority: 5
---
narr: Edmund Averley, 1869, die Brille auf der Stirn.
inner: Jetzt kenne ich seine Handschrift besser als sein Gesicht. Ich glaube, das hätte ihm gefallen.

=== ex_haustuer
kind: examine
target: h_haustuer
---
narr: Hinter der schweren Tür: die Auffahrt, zwei Steinlöwen mit nassen Mähnen, und dann Wasser. Nur Wasser, bis zu den Kopfweiden.
inner: Ein Schiff, das vergessen hat abzulegen. Mit uns allen an Bord.

=== ex_haustuer_3
kind: examine
target: h_haustuer
when: ch>=3
priority: 3
---
narr: Nebel hat das Wasser verschluckt. Man hört es nur noch – ein leises, gleichmäßiges Gurgeln unter den Stufen.

=== ex_s_spiegel
kind: examine
target: h_s_spiegel
when: f:k1_mirror
---
narr: Der Spiegel unter seinem schwarzen Krepp.
inner: Ich hätte nicht gedacht, dass mir mein eigenes Gesicht fehlen kann.

=== ex_s_kassette
kind: examine
target: h_s_kassette
---
narr: Eine Schreibkassette aus Rosenholz mit Messingschloss. Abgeschlossen.
inner: Miss Averleys Briefe. Das geht mich nun wirklich nichts an. Ich wiederhole: wirklich nichts.

=== ex_s_fenster
kind: examine
target: h_s_fenster
---
narr: Schwere Samtvorhänge, sorgfältig geschlossen. Durch den Spalt am Rand sieht man einen Streifen Moor. Ein Heuhaufen treibt vorbei wie ein kleines Schiff.
* [neutral] (Den Vorhang ein wenig öffnen.) -> open
* [schweigen] (Ihn lassen, wie er ist.) -> END
# open
? ch<=2 -> scold
narr: Ein Streifen grauen Lichts fällt auf den Teppich. Niemand sagt etwas.
-> END
# scold
harriet[tense]: Miss Hale. Das Licht hat in diesem Haus einstweilen nichts verloren. {sus+1, harriet-1}
inner: Richtig. Trauerhaus. Die Vorhänge bleiben zu, bis … bis irgendwann.

=== ex_s_klavier
kind: examine
target: h_s_klavier
---
narr: Ein Klavier, zugeklappt. Auf dem Deckel Noten: Mendelssohn, „Lieder ohne Worte“.
inner: Passend für ein Haus, in dem niemand sagt, was er denkt.

=== ex_s_kamin
kind: examine
target: h_s_kamin
---
narr: Ein kleines Feuer, das einzige Zugeständnis an die Lebenden in diesem Raum.

=== ex_a_klingelzug
kind: examine
target: h_a_klingelzug
---
narr: Ein Klingelzug aus rotem Samt neben dem Kamin. Die Quaste am Ende hängt nur noch an ein paar Fäden, als hätte jemand mit aller Kraft daran gerissen. {+c:c01}
inner: So reißt man nicht an einer Klingel, wenn man nur Tee möchte.

=== ex_a_kamin
kind: examine
target: h_a_kamin
---
narr: Der Kamin ist kalt, die Asche nicht ausgeräumt. Davor ein Messinggitter, blank geputzt – bis auf die Kante. {+c:c05}
narr: Dort, am Rand, ein dunkler Fleck, und darin zwei, drei graue Haare.
inner: Mir wird ein bisschen schlecht.

=== ex_a_kamin_ash
kind: examine
target: h_a_kamin
when: ch>=3 anyk:d04,d07 !k:c10
priority: 5
---
narr: Die Asche im Kamin ist aufgewühlt, als hätte jemand mit dem Schürhaken darin gestochert. Oben liegt nur feiner grauer Staub.
inner: Hobbes räumt auf, wenn niemand hinsieht. Wer so gründlich aufräumt, vergisst manchmal, wohin die Dinge fallen.
narr: Unter dem Rost sitzt ein flacher Aschekasten. Sera zieht ihn heraus. Zwischen Kohle und Staub: ein halb verbranntes Blatt, eingerollt wie ein Hobelspan. {+c:c10, sfx:paper}
narr: Ein gedruckter Briefkopf, zur Hälfte fort: „…abbe & Tol…, London“. Darunter, in Schönschrift: „…erklären hiermit die Schuld des Capt. L. Av… für vollständig beglichen …“
inner: Beglichen. Vollständig. Und jemand hat es verbrannt.

=== ex_a_schrank
kind: examine
target: h_a_buecherschrank
---
narr: Ein schwerer Bücherschrank mit Glastüren. Geologie, Wetterkunde, Moose. Und Fotografie. Sehr viel Fotografie.

=== ex_a_schrank_y
kind: examine
target: h_a_buecherschrank
when: !k:c03
priority: 5
---
narr: Ein schwerer Bücherschrank mit Glastüren. Geologie, Wetterkunde, Moose. Und Fotografie. Sehr viel Fotografie.
narr: Unter dem Schrank klingelt es leise. Ein grauer Schwanz ragt hervor und zuckt. {sfx:bell}
inner: Yuumi hat da unten etwas entdeckt. Ich passe nicht darunter. Sie schon. {do:hint_yuumi}

=== ex_a_tantalus
kind: examine
target: h_a_tantalus
---
narr: Ein Holzgestell mit Messingbügel, das die Karaffen einschließt, damit niemand nascht. Drei Plätze. Zwei Kristallkaraffen – Sherry, Portwein. Der dritte Platz ist leer, und der Bügel ist offen. {+c:c07}
inner: Wer schließt so etwas auf und lässt es dann offen?

=== ex_a_tisch_1
kind: examine
target: h_a_schreibtisch
when: ch=1 !f:k1_mini
priority: 5
---
narr: Der Schreibtisch ist aufgeräumt, wie der eines Menschen, der gern wiederfindet, was er liegen lässt. Ein Samtetui. Ein Notizbuch, aufgeschlagen. Ein Stapel Briefe unter einem Briefbeschwerer aus Bernstein.
narr: Im Etui: eine junge Frau mit hellbraunem Haar und einem Lächeln, das über den Rand des Bildes hinausgeht. Im Deckel, in Gold: Lucinda, 1858. {+f:k1_mini}
narr: Das Notizbuch, letzte beschriebene Seite, in einer engen, genauen Handschrift: {+c:c13}
letter: 13. Nov. – 5 Min. vor Mitternacht. Deckel ab. Belichtung bis zum Morgen. Wandelt etwas auf der Treppe, wird die Platte es wissen. H. wird enttäuscht sein.
inner: Belichtung. Platte. Er hat fotografiert. Mitten in der Nacht. Und „H.“ – Harriet?
hobbes[neutral]: Miss hat die Miniatur gefunden, wie ich sehe.
inner: Und Miss liest in fremden Notizbüchern. Sehr gut, Miss.

=== ex_a_tisch_1b
kind: examine
target: h_a_schreibtisch
when: ch=1 f:k1_mini !k:c22
priority: 4
---
narr: Hobbes sieht zum Fenster. Nur einen Atemzug lang. Oben auf dem Briefstapel liegt eine Visitenkarte. {+c:c22}
letter: Mrs. E. Penrose – Sitzungen nach Vereinbarung – 14 Gay Street, Bath. (Auf der Rückseite, in der engen Handschrift aus dem Notizbuch:) Aug.
narr: Darunter ein Briefbogen mit gedrucktem Kopf. Bath Royal Literary and Scientific Institution. Ein Angebot, siebenhundert Pfund, „für die Sammlung von Instrumenten, Platten, Moosen und Gesteinen“. {+c:c25}
hobbes[neutral]: Miss.
inner: Ein Wort, und es heißt: genug.

=== ex_a_tisch_1c
kind: examine
target: h_a_schreibtisch
when: ch=1 k:c22
priority: 3
---
narr: Hobbes lässt sie nicht aus den Augen. Seine Hände sind vor dem Frack gefaltet, als bete er darum, dass sie geht.
inner: Nicht jetzt.

=== ex_a_tisch_2
kind: examine
target: h_a_schreibtisch
when: ch>=2 !k:c15
priority: 5
---
narr: Niemand steht an der Tür. Sera blättert im Notizbuch zurück. Wetterdaten, Luftdruck, Regenmengen in Zoll. Und dazwischen, knapp, fast widerwillig, Sätze. {sfx:paper}
letter: Aug. – Bath. Dr. W.: Monate, nicht Jahre. – Abends bei Mrs. P. Ihr erzählt, was ich niemandem erzähle. Narr. {+c:c14}
letter: 8. Nov. – C & T: 1840 angewiesen. Dem Jungen nichts sagen, bis er es selbst fragt. {+c:c15}
inner: „Monate, nicht Jahre.“ Das klingt nach einem Arzt. Und „C & T“ und „der Junge“ … Ein Vater, der etwas für seinen Sohn tut und es ihm nicht sagt.
inner: Ich kenne das. Nicht aus dem Jahr 1877. Von überall.

=== ex_a_tisch
kind: examine
target: h_a_schreibtisch
---
narr: Das Notizbuch, die Briefe, der Bernstein. In dem Briefbeschwerer steckt eine kleine Fliege, seit ein paar Millionen Jahren.
inner: Sie hat es auch nicht mehr rechtzeitig nach Hause geschafft.

=== ex_a_sessel
kind: examine
target: h_a_sessel
---
narr: Ein Lehnsessel aus dunkelgrünem Leder, die Sitzfläche eingedrückt. Eine Wolldecke liegt ordentlich gefaltet auf der Lehne.
inner: Hier hat man ihn gefunden. So sagt man.

=== ex_a_sessel_d
kind: examine
target: h_a_sessel
when: k:d03
priority: 5
---
narr: Der Sessel, die gefaltete Decke.
inner: Jetzt, wo ich weiß, dass er am Boden lag: Die Decke ist zu ordentlich gefaltet. Niemand faltet eine Decke, in der gerade jemand gestorben ist. Man faltet sie, wenn man will, dass es so aussieht.

=== ex_a_terrasse
kind: examine
target: h_a_terrassentuer
---
narr: Eine Glastür zur Terrasse. Dahinter löst der Regen den Garten auf. Auf dem Teppich davor: angetrocknete Erde, ein halber Absatz, groß. {+c:c20}
inner: Größer als meine Füße. Größer als die von Hobbes, schätze ich – seine Schuhe sind so schmal wie seine Sätze.

=== ex_a_dunkeltuer
kind: examine
target: h_a_dunkeltuer
---
narr: Eine schmale Tür, abgeschlossen. Hier ist der Geruch am stärksten: süßlich, nussig, wie Marzipan, das man zu lange im Schrank vergessen hat. {+c:c11}
inner: Bittermandel. In jedem Krimi, den ich je gelesen habe, ist das eine schlechte Nachricht.

=== ex_d_flasche
kind: examine
target: h_d_flasche
---
narr: Eine braune Flasche mit Glasstopfen, der Stopfen liegt daneben. Ein Etikett in sauberer Handschrift: „Kal. cyanid. – Fixierbad. GIFT.“ {+c:c12}
inner: Da ist er, der Krimigeruch. In einer Flasche, mit Etikett, dort, wo er hingehört.

=== ex_d_wannen
kind: examine
target: h_d_wannen
---
narr: Flache Porzellanschalen in einer Reihe, sauber ausgespült, eine noch halb voll mit einer klaren Flüssigkeit. Daneben eine Uhr mit großem Sekundenzeiger.
inner: Hier wird Licht in etwas verwandelt, das man anfassen kann. Klingt nach Zauberei. Riecht nach Chemieunterricht.

=== ex_d_platten
kind: examine
target: h_d_platten
---
narr: Holzkästen voller Glasplatten, sauber beschriftet: „Moor, Febr. 1871“, „Kapelle bei Nebel“, „L., Garten, 1860“, „C. mit Kamera, 1874“.
inner: Ich habe so einen Kasten zu Hause. Oder werde einen haben. Oder – ich höre auf, darüber nachzudenken, bevor mir schwindlig wird.

=== ex_d_lampe
kind: examine
target: h_d_lampe
---
narr: Eine Laterne mit rubinrotem Glas. Wenn sie brennt, sieht man darin die eigenen Hände nicht mehr als Hände, sondern als Schatten mit Absichten.

=== ex_b_tisch
kind: examine
target: h_b_tisch
---
narr: Ein runder Tisch. Auf dem Holz Kreidestriche, ein halb heruntergebrannter Kerzenstummel in der Mitte, ein Glas mit einem Rest Wasser.
inner: Hier war die Séance. Hier hat seine Frau „gesprochen“. Und danach ist er gestorben. Kein Wunder, dass der Captain jemanden hassen will.

=== ex_b_tisch_2
kind: examine
target: h_b_tisch
when: ch>=2 !k:c24
priority: 5
---
narr: Unter dem Tisch, halb unter den Teppichrand gerutscht, liegt ein Blatt Papier. Die Schrift darauf ist fahrig, schief, als hätte jemand mit geschlossenen Augen geschrieben. {+c:c24, sfx:paper}
letter: Er kommt bald zu mir. Hab keine Angst. L.
inner: L. Lionel? Oder … Lucinda. Die Hand ist fahrig, wie im Halbschlaf geschrieben. Und das Blatt lag unter dem Stuhl, auf dem bei der Sitzung Miss Averley saß. Das Kissen ist noch eingedrückt, mit schwarzen Seidenfäden.

=== ex_b_tisch_y
kind: examine
target: h_b_tisch
when: f:y_saw_sheet !k:c24
priority: 6
---
narr: Sera bückt sich dorthin, wo Yuumi vom Sims aus hingestarrt hat. Unter dem Tisch, halb unter den Teppichrand gerutscht: ein Blatt Papier. {+c:c24, sfx:paper}
letter: Er kommt bald zu mir. Hab keine Angst. L.
inner: L. Lionel? Oder … Lucinda. Die Hand ist fahrig, wie im Halbschlaf geschrieben. Und das Blatt lag unter dem Stuhl, auf dem bei der Sitzung Miss Averley saß. Das Kissen ist noch eingedrückt, mit schwarzen Seidenfäden.

=== ex_b_regal
kind: examine
target: h_b_regal
---
narr: Darwin neben Swedenborg, Lyell neben einem Band über Tischrücken und Geisterklopfen.
inner: Zwei Menschen haben diese Bibliothek gefüllt, und sie waren sich nicht einig.

=== ex_b_kamin
kind: examine
target: h_b_kamin
---
narr: Glut. Jemand hat nachgelegt. Auf dem Sims ein Glas mit einem Rest Brandy darin.
inner: Der Captain sitzt hier am liebsten. Wo das Feuer ist und seine Tante nicht.

=== ex_k_klingel
kind: examine
target: h_k_klingelkasten
---
narr: Ein Brett über der Tür mit zwölf kleinen Glocken an gebogenen Federn, jede mit einem Schildchen: Salon, Speisezimmer, Bibliothek, Arbeitszimmer, Miss Averley, Captain … {+c:c02}
narr: Die Glocke „Arbeitszimmer“ hängt schief. Ihr Draht, der in der Wand verschwindet, ist lang gezogen und leicht verbogen, als hätte jemand von weit her mit aller Kraft daran gezerrt.
inner: Ein Haus mit Nervenenden. Und eines davon ist überdehnt.

=== ex_k_herd
kind: examine
target: h_k_herd
---
narr: Ein schwarzer Herd, breit wie ein Altar. Er frisst Kohlen, und Tilly füttert ihn. Neben ihm eine Diele, die knarrt, wenn man darauf tritt.

=== ex_k_herd_5
kind: examine
target: h_k_herd
when: f:g_tilly_spoke
priority: 5
---
narr: Die Diele neben dem Herd. Darunter, in einer verbeulten Blechdose, hat Tilly drei Tage lang den letzten Brief eines Toten verwahrt, zwischen einem Knopf, einem Stück Band und einem glatten Stein.

=== ex_k_tisch
kind: examine
target: h_k_tisch
---
narr: Der Küchentisch, zerkratzt, gescheuert, gezeichnet. An der Kante, dort, wo Tilly immer sitzt, hat jemand mit einer Messerspitze Buchstaben ins Holz geritzt: T, I, L. Das L ist verkehrt herum.
inner: Sie übt ihren Namen. Heimlich. Im Holz, weil sie kein Papier hat.

=== ex_k_bord
kind: examine
target: h_k_bord
when: ch<=2
---
narr: Auf dem Bord stehen die Leuchter der Dienstboten, jeder mit einem Namensschild. Hobbes. Pryce. Tilly. In allen stecken Talgkerzen, gelblich, dick.
narr: Tillys Kerze ist fast bis auf den Leuchter heruntergebrannt. Die anderen kaum. Darunter ein Schild in fester Schrift: „Eine Kerze je Nacht. A. P.“ {+c:c28}
inner: Eine Kerze je Nacht. Und Tillys ist fast weg. Sie war lange wach. Sehr lange.

=== ex_k_bord_3
kind: examine
target: h_k_bord
when: ch>=3
---
narr: Neue Kerzen in allen Leuchtern. Neben dem Bord hängt an einer Schnur Mrs. Pryces Kerzenbuch. Unter „Mittwoch früh“, in ihrer festen Schrift: „T. – neue Kerze, die alte ganz herunter.“ {+c:c28}
inner: Tilly war in der Nacht auf Mittwoch lange wach. Und Mrs. Pryce hat es aufgeschrieben. Sie schreibt alles auf.

=== ex_k_butler_1
kind: examine
target: h_k_butler
when: ch=1
---
narr: Die Butlerkammer. Hobbes’ Reich: Silber, Gläser, ein Tisch mit grünem Tuch. Die Tür steht einen Spalt offen.
inner: Einfach hineinzugehen wäre, als würde ich einem Pfarrer in die Sakristei folgen.

=== ex_k_butler_voices
kind: examine
target: h_k_butler
when: ch=2 tod=nachmittag seen:k2_dark !f:k2_listened !f:k2_pantry_free
priority: 6
---
narr: Die Tür der Butlerkammer ist angelehnt. Dahinter Stimmen, gedämpft: Hobbes und Mrs. Pryce. Es riecht nach Kampfer.
inner: Ich kann nicht einfach an der Tür lauschen. Eine Gesellschafterin lauscht nicht. Eine Katze allerdings … {do:hint_yuumi}

=== ex_k_butler_2
kind: examine
target: h_k_butler
when: ch>=2 !k:c08 anyf:k2_listened,k2_pantry_free,k3_started
priority: 5
---
narr: Hobbes ist oben. Die Butlerkammer ist leer. Silber in Filztaschen, eine Reihe Weingläser, blank. In der untersten Schublade, unter dem Silbertuch, in ein Leinen gewickelt: eine Kristallkaraffe mit Brandyrest am Boden und zwei Gläser, gespült und poliert. {+c:c08}
inner: Die Karaffe passt in den leeren Platz im Tantalus. Wer versteckt Gläser, die er nur abgewaschen hat?

=== ex_k_butler
kind: examine
target: h_k_butler
when: ch>=2
---
narr: Die Butlerkammer, ordentlich wie eine Rechnung. Das Abtropfbrett ist leer.

=== ex_k_stiefel
kind: examine
target: h_k_stiefel
---
narr: Die Stiefelkammer. Reihen von Stiefeln, Bürsten, Dosen mit Wichse. Es riecht nach Leder und nassem Hund, obwohl es hier keinen Hund gibt.

=== ex_k_stiefel_3
kind: examine
target: h_k_stiefel
when: ch>=3 !k:c19
priority: 5
---
narr: Die Reitstiefel des Captains, frisch gewichst. Auf dem Fensterbrett daneben: ein Klumpen roter Erde, sorgfältig beiseitegelegt, als wolle jemand ihn aufheben. {+c:c19}
inner: Jemand hat das aus den Absätzen gekratzt und aufgehoben. Rote Erde, wie vom Rosenbeet unter der Terrasse. Und er hat geschlafen wie ein Stein.

=== ex_k_pryce
kind: examine
target: h_k_pryce
---
narr: Das Zimmer der Haushälterin. Die Tür ist zu. Hier klopft man nicht ohne Grund.

=== ex_k_pryce_3
kind: examine
target: h_k_pryce
when: ch>=3 !k:c27
priority: 5
---
narr: Die Tür steht einen Spalt offen, Mrs. Pryce ist oben bei Miss Averley. Auf dem kleinen Tisch am Fenster liegt ein Briefbogen unter einem Tintenfass. Die ersten Zeilen sind nicht zu übersehen. {+c:c27}
letter: Mein lieber Owen, Mittwoch, 2 Uhr früh, und ich kann nicht schlafen. Der Regen macht mich alt, und das Kind –
inner: Da hört es auf. Mitten im Satz. Um zwei Uhr früh war sie also wach.

=== ex_k_hoftuer
kind: examine
target: h_k_hoftuer
---
narr: Die Hoftür, verriegelt, ein Eimer Sand davor.
pryce[neutral]: Bei dem Wasser geht keiner raus, der nicht muss, Miss. Dunning kommt schon rein, wenn er was will.

=== ex_g_clara
kind: examine
target: h_g_clara
---
narr: Eine Tür. Auf den Dielen davor ein paar helle Tropfen, dicht beieinander.
inner: Kerzenwachs, vermutlich.

=== ex_g_clara_t
kind: examine
target: h_g_clara
when: f:k2_tallow_learned
priority: 5
---
narr: Drei Tropfen, dicht beieinander, direkt vor der Schwelle. Sera kratzt mit dem Fingernagel daran. Weich, gelblich. {+c:c18}
inner: Talg. Hier oben. Vor Claras Tür. Jemand hat hier mit einer Dienstbotenkerze gestanden. Lange genug, dass sie dreimal tropfte.

=== ex_g_harriet
kind: examine
target: h_g_harriet
---
narr: Eine Tür, dunkles Holz. Dahinter ist es still. Nicht leer. Still, wie ein Stuhl, auf dem jemand sehr gerade sitzt.

=== ex_g_lionel
kind: examine
target: h_g_lionel
---
narr: Eine Tür. Dahinter klirrt etwas, eine Flasche an ein Glas, dann nichts mehr.

=== ex_g_gast
kind: examine
target: h_g_gast
---
narr: Das Gästezimmer. Es riecht nach Rosenwasser. Unter der Tür ein Spalt, gerade breit genug für eine Hand. Oder eine Pfote.

=== ex_g_gelaender
kind: examine
target: h_g_gelaender
---
narr: Von hier sieht man hinunter in die Halle: die Treppe, das Halbpodest mit dem Fenstersitz, den verhängten Kasten auf seinen drei Beinen, die Tür zum Arbeitszimmer.
inner: Wer hier steht, sieht alles. Und muss nichts davon anfassen.

=== ex_g_gelaender_4
kind: examine
target: h_g_gelaender
when: k:s30
priority: 5
---
narr: Das Geländer, blank gegriffen.
inner: Von hier hat Mrs. Penrose hinuntergesehen. Auf ein weinendes Kind. Und auf mich.

=== ex_g_totentuer
kind: examine
target: h_g_totentuer
---
narr: Das Zimmer des Herrn. Die Tür ist abgeschlossen, der Schlüssel steckt nicht.
inner: Hobbes. Wer sonst.

=== ex_t_bett
kind: examine
target: h_t_bett
---
narr: Edmund Averley liegt in seinem Bett, die Hände gefaltet über Lucindas kleinem Bild. Man hat ihm ein weißes Tuch unter das Kinn gebunden und Münzen auf die Lider gelegt.
inner: Er sieht aus, als hätte er nur die Augen geschlossen, um besser nachzudenken.

=== ex_t_kerzen
kind: examine
target: h_t_kerzen
---
narr: Zwei Wachskerzen auf dem Nachttisch, daneben eine Schale mit Salz und ein Zweig Rosmarin.
inner: Salz gegen das Böse, Rosmarin fürs Erinnern. Oder umgekehrt. Mrs. Pryce hat es mir erklärt, und ich habe nur genickt.

=== ex_t_fenster
kind: examine
target: h_t_fenster
---
narr: Das Fenster ist einen Fingerbreit geöffnet, obwohl es kalt ist.
inner: Damit die Seele hinauskann, sagt man. Es regnet trotzdem herein.

=== ex_ka_fenster
kind: examine
target: h_ka_fenster
---
narr: Ein Fenster aufs Moor. Das Wasser ist glatt und grau, und darin spiegeln sich die Wolken so genau, dass man nicht weiß, wo oben ist.

=== ex_ka_bett
kind: examine
target: h_ka_bett
---
narr: Ein schmales Bett mit einer Wärmflasche aus Steingut, die Mrs. Pryce hineingelegt hat, ohne ein Wort darüber zu verlieren.
inner: Das ist ihre Art zu sagen, dass ich nicht erfriere, solange sie es verhindern kann.

=== ex_ka_truhe
kind: examine
target: h_ka_truhe
---
narr: Unter Miss Finchs Unterröcken, sorgfältig zusammengelegt: eine Jeans, ein Pullover mit Loch am Ellbogen, zwei Socken mit Avocados.
inner: Beweisstück A, dass ich nicht verrückt bin. Oder dass ich es sehr gründlich bin.

=== ex_ka_spiegel
kind: examine
target: h_ka_spiegel
---
narr: Ein kleiner Spiegel über dem Waschtisch. Hier oben hat niemand ihn verhängt.
inner: Ich sehe müde aus. Sehr achtzehnhundertsiebenundsiebzig.

=== ex_gw_zitronen
kind: examine
target: h_gw_zitronen
---
narr: Zitronenbäumchen in Kübeln, jeder mit einem Schild in einer engen, genauen Handschrift. Eine Frucht ist gelb geworden. Nur eine.
inner: Er hat Zitronen gezogen, in Somerset, im November. Das ist entweder wissenschaftlicher Ehrgeiz oder Hoffnung.

=== ex_gw_bank
kind: examine
target: h_gw_bank
---
narr: Eine Gartenbank aus Eisen, kalt, mit einem Kissen, das jemand hier vergessen hat.

=== ex_gw_glas
kind: examine
target: h_gw_glas
---
narr: Über ihr das Glasdach. Der Regen trommelt darauf, tausend kleine Finger, die hereinwollen.

=== ex_st_boot
kind: examine
target: h_st_boot
---
narr: Ein flaches Boot, kieloben auf zwei Böcken. Frisches Pech an den Nähten.
inner: Dunning macht es fertig. Wenn das Wasser fällt, ist es der Weg ins Dorf. Und der Weg für den Coroner hierher.

=== ex_st_pferde
kind: examine
target: h_st_pferde
---
narr: Zwei Pferde in ihren Boxen, ein Brauner und eine Schimmelstute. Der Braune schnaubt und stampft.
yuumi: (Yuumi betrachtet das Pferd aus sicherer Entfernung, mit tiefer Verachtung für alles, was größer ist als ein Sofa.)

=== ex_st_uhr
kind: examine
target: h_st_uhr
---
narr: Über dem Stalltor eine Uhr mit einem kleinen Glockenstuhl. Sie schlägt die Viertelstunden – einmal, zweimal, dreimal, und zur vollen Stunde viermal und dann die Zahl.

=== ex_st_wasser
kind: examine
target: h_st_wasser
---
narr: Am Ende des Hofs beginnt das Moor, als hätte jemand das Land weggenommen und einen Spiegel hingelegt. Kopfweiden stehen darin wie Menschen, die bis zur Brust im Wasser warten.

=== ex_st_terrasse
kind: examine
target: h_st_terrasse
---
narr: Von hier sieht man um die Hausecke: die Terrasse mit ihrer steinernen Brüstung, und dahinter das hohe Fenster des Arbeitszimmers.
inner: Wer hier nachts steht, sieht jeden, der dort im Lampenschein steht.

=== ex_kp_grab
kind: examine
target: h_kp_grab
---
narr: Ein Grabstein aus hellem Kalkstein, schon grün an den Kanten. „Lucinda Averley, 1829–1861. Sie hörte die Glocke.“

=== ex_kp_glocke
kind: examine
target: h_kp_glocke
---
narr: Der kleine Glockenstuhl über der Kapelle ist leer. Nur ein rostiger Haken, an dem der Wind zieht.

=== ex_kp_wasser
kind: examine
target: h_kp_wasser
---
narr: Das Moor unter dem Hügel, glatt, grau, still. Irgendwo darunter soll die alte Kirche von St. Aldhelm liegen, mit ihrer Glocke.
`;
