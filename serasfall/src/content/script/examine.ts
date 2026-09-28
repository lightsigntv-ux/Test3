// Untersuchungstexte für alle Orte und Kapitel. Spezifischere Varianten haben höhere Priorität.
export default `
=== ex_fenstersitz
kind: examine
target: h_fenstersitz
---
narr: Der Fenstersitz auf dem Halbpodest lag hinter einem schweren Vorhang. Im Polster war noch die Kuhle, in der sie gelegen hatte, und überall klebten graue Katzenhaare.
inner: Hier bin ich aufgewacht. Irgendwer oder irgendwas hat mich hier abgelegt. Und dann einfach liegen lassen.

=== ex_fenstersitz_4
kind: examine
target: h_fenstersitz
when: f:g_plate_dev
priority: 5
---
narr: Das Polster mit der Kuhle, der schwere Vorhang.
inner: Auf der Platte ist diese Stelle nur ein heller Fleck. Ich hab hier geschlafen, und unten lag ein Mann tot am Boden. Keiner von uns wusste vom anderen.

=== ex_kamera_1
kind: examine
target: h_kamera
when: !k:c16
priority: 2
---
narr: Auf drei Holzbeinen stand ein Kasten, mit schwarzem Krepp verhängt, genau wie die Spiegel. Unter dem Stoff blitzte ein Messingring hervor.
narr: Sera hob den Saum ein wenig an. Darunter war ein Objektiv, auf die Treppe gerichtet, mit einem Messingdeckel darauf. Neben dem Stativ lag ein Tropfen Talg auf dem Boden. {+c:c16}
inner: Eine Kamera. Wer stellt denn nachts eine Kamera in die Halle, genau auf die Treppe gerichtet?
yuumi: (Yuumi setzte sich einen Meter vor das Stativ. Ihr Schwanz zuckte hin und her, und sie starrte den Krepp an, der sich im Luftzug bewegte.)
inner: Ja, ich weiß. Stoff, der sich von selbst bewegt, ist verdächtig.

=== ex_kamera
kind: examine
target: h_kamera
---
narr: Der verhängte Kasten stand auf seinen drei Beinen. Das Objektiv unter dem Krepp zeigte noch immer auf die Treppe.

=== ex_kamera_3
kind: examine
target: h_kamera
when: k:d11 !f:g_plate_dev
priority: 5
---
inner: Die Platte ist noch drin. Seit Dienstag, Mitternacht. Alles, was in der Nacht über die Treppe gegangen ist, ist da drauf. Wenn man weiß, wie man es rausholt.
inner: Ich weiß es nicht. Aber ich weiß, wer hier schwarze Finger hat.

=== ex_kamera_4
kind: examine
target: h_kamera
when: f:g_plate_dev
priority: 6
---
narr: Das Stativ stand noch da, der Krepp hing schief. Der Kasten war leer.
inner: Er wollte beweisen, dass nachts nichts auf der Treppe umgeht. Na ja. Fast hätte es gestimmt.

=== ex_standuhr
kind: examine
target: h_standuhr
---
narr: Eine hohe Standuhr aus dunklem Holz. Die Zeiger standen auf 6.25, und das Pendel hing still. {+c:c32}
inner: Hier hält man also die Uhren an, wenn jemand stirbt. Jetzt tickt in der ganzen Halle nichts mehr.

=== ex_standuhr_d
kind: examine
target: h_standuhr
when: k:d05
priority: 5
---
narr: 6.25.
inner: Um die Zeit hat man ihn gefunden. Gefallen ist er da nicht. Die Uhr zeigt die falsche Minute.

=== ex_treppe
kind: examine
target: h_treppe
---
narr: Breite Eichenstufen mit einem roten Läufer. Am Rand, auf dem blanken Holz, waren ein paar helle Tropfen.
inner: Kerzenwachs. Hier hat jemand Licht getragen. In einem Haus ohne Strom ist das nicht besonders verdächtig.

=== ex_treppe_t
kind: examine
target: h_treppe
when: f:k2_tallow_learned
priority: 5
---
narr: Sera kniete sich hin und rieb einen der Tropfen zwischen den Fingern. Er war weich, schmierig und gelblich. {+c:c17}
inner: Talg. Und das hier ist die Treppe der Herrschaft.

=== ex_portrait
kind: examine
target: h_portrait
---
narr: Ein Ölbild. Ein Mann mit schmalem Gesicht und grau meliertem Backenbart, die Brille auf die Stirn geschoben. Unten auf dem Rahmen stand: Edmund Averley, 1869.
inner: Gehrock, hoher Kragen, schwarze Halsbinde. Ganz schlicht, nichts Modisches. Er sieht aus wie jemand, der lieber zuhört als redet.

=== ex_portrait_5
kind: examine
target: h_portrait
when: f:g_letter_read
priority: 5
---
narr: Edmund Averley, 1869. Die Brille saß auf seiner Stirn.
inner: Inzwischen kenne ich seine Handschrift besser als sein Gesicht. Ich glaube, das wäre ihm ganz recht gewesen.

=== ex_haustuer
kind: examine
target: h_haustuer
---
narr: Hinter der schweren Tür lagen die Auffahrt und zwei Steinlöwen mit nassen Mähnen. Danach kam nur noch Wasser, bis zu den Kopfweiden.
inner: Hier kommt keiner weg. Ich nicht und die anderen auch nicht.

=== ex_haustuer_3
kind: examine
target: h_haustuer
when: ch>=3
priority: 3
---
narr: Nebel lag über dem Wasser. Man sah es nicht mehr. Man hörte nur ein leises, gleichmäßiges Gurgeln unter den Stufen.

=== ex_s_spiegel
kind: examine
target: h_s_spiegel
when: f:k1_mirror
---
narr: Der Spiegel war mit schwarzem Krepp verhängt.
inner: Komisch. Mir fehlt mein eigenes Gesicht.

=== ex_s_kassette
kind: examine
target: h_s_kassette
---
narr: Eine Schreibkassette aus Rosenholz mit Messingschloss. Sie war abgeschlossen.
inner: Miss Averleys Briefe. Die gehen mich nichts an. Wirklich nicht. Auch wenn ich gerade am Schloss gerüttelt habe.

=== ex_s_fenster
kind: examine
target: h_s_fenster
---
narr: Schwere Samtvorhänge, sorgfältig geschlossen. Durch einen Spalt am Rand sah man einen Streifen Moor. Ein Heuhaufen trieb auf dem Wasser vorbei.
* [neutral] (Den Vorhang ein Stück aufziehen.) -> open
* [schweigen] (Ihn so lassen.) -> END
# open
? ch<=2 -> scold
narr: Ein Streifen graues Licht fiel auf den Teppich. Niemand sagte etwas.
-> END
# scold
harriet[tense]: Miss Hale. Die Vorhänge bleiben geschlossen. Das Licht hat in diesem Haus einstweilen nichts verloren. {sus+1, harriet-1}
inner: Ach so, klar. Trauerhaus. Die Vorhänge bleiben zu, bis … keine Ahnung, wie lange.

=== ex_s_klavier
kind: examine
target: h_s_klavier
---
narr: Ein Klavier, zugeklappt. Auf dem Deckel lagen Noten: Mendelssohn, „Lieder ohne Worte“.
inner: Die hab ich mal irgendwo gehört, in so einem Film … nee, das war was anderes. Egal. Der Titel passt jedenfalls zu diesem Haus.

=== ex_s_kamin
kind: examine
target: h_s_kamin
---
narr: Im Kamin brannte ein kleines Feuer. Es war das einzig Warme in diesem Zimmer.

=== ex_a_klingelzug
kind: examine
target: h_a_klingelzug
---
narr: Neben dem Kamin hing ein Klingelzug aus rotem Samt. Die Quaste am Ende hing nur noch an ein paar Fäden. Da hatte wohl jemand mit aller Kraft daran gerissen. {+c:c01}
inner: So reißt man nicht an einer Klingel, wenn man nur Tee will.

=== ex_a_kamin
kind: examine
target: h_a_kamin
---
narr: Der Kamin war kalt, die Asche nicht ausgeräumt. Davor stand ein Messinggitter, blank geputzt, nur nicht an der Kante. {+c:c05}
narr: Dort am Rand war ein dunkler Fleck, und darin klebten zwei, drei graue Haare.
inner: Oh. Mir wird ein bisschen schlecht.

=== ex_a_kamin_ash
kind: examine
target: h_a_kamin
when: ch>=3 anyk:d04,d07 !k:c10
priority: 5
---
narr: Die Asche im Kamin war aufgewühlt. Vielleicht hatte jemand mit dem Schürhaken darin herumgestochert. Obendrauf lag nur feiner grauer Staub.
inner: Hobbes räumt auf, wenn keiner hinsieht. Aber wer so gründlich aufräumt, übersieht manchmal, was durch den Rost fällt.
narr: Unter dem Rost steckte ein flacher Aschekasten. Sera zog ihn heraus. Zwischen Kohle und Staub lag ein halb verbranntes Blatt, an den Rändern eingerollt. {+c:c10, sfx:paper}
narr: Oben war ein gedruckter Briefkopf, zur Hälfte verbrannt: „…abbe & Tol…, London“. Darunter stand in Schönschrift: „…erklären hiermit die Schuld des Capt. L. Av… für vollständig beglichen …“
inner: Vollständig beglichen. Und trotzdem hat es jemand ins Feuer geworfen.

=== ex_a_schrank
kind: examine
target: h_a_buecherschrank
---
narr: Ein schwerer Bücherschrank mit Glastüren. Geologie, Wetterkunde, Moose. Und Fotografie, sehr viel Fotografie.

=== ex_a_schrank_y
kind: examine
target: h_a_buecherschrank
when: !k:c03
priority: 5
---
narr: Ein schwerer Bücherschrank mit Glastüren. Geologie, Wetterkunde, Moose. Und Fotografie, sehr viel Fotografie.
narr: Unter dem Schrank klingelte es leise. Ein grauer Schwanz ragte hervor und zuckte. {sfx:bell}
inner: Yuumi hat da unten was gefunden. Ich passe da nicht drunter. Sie schon. {do:hint_yuumi}

=== ex_a_tantalus
kind: examine
target: h_a_tantalus
---
narr: Ein Holzgestell mit Messingbügel, der die Karaffen einschloss, damit keiner heimlich trank. Zwei der drei Plätze waren besetzt, mit Sherry und Portwein in Kristallkaraffen. Der dritte Platz war leer, und der Bügel stand offen. {+c:c07}
inner: Wer schließt so was auf und lässt es dann offen stehen?

=== ex_a_tisch_1
kind: examine
target: h_a_schreibtisch
when: ch=1 !f:k1_mini
priority: 5
---
narr: Der Schreibtisch war ordentlich aufgeräumt. Darauf lagen ein Samtetui, ein aufgeschlagenes Notizbuch und ein Stapel Briefe unter einem Briefbeschwerer aus Bernstein.
narr: Im Etui war das Bild einer lächelnden jungen Frau mit hellbraunem Haar und weiten Pagodenärmeln, typisch Fünfzigerjahre, dachte Sera. Im Deckel stand in Gold: Lucinda, 1858. {+f:k1_mini}
narr: Das Notizbuch war auf der letzten beschriebenen Seite aufgeschlagen. Die Handschrift war eng und genau: {+c:c13}
letter: 13. Nov. – 5 Min. vor Mitternacht. Deckel ab. Belichtung bis zum Morgen. Wandelt etwas auf der Treppe, wird die Platte es wissen. H. wird enttäuscht sein.
inner: Belichtung, Platte … Er hat mitten in der Nacht fotografiert? Und wer ist „H.“? Harriet?
hobbes[neutral]: Wie ich sehe, hat Miss die Miniatur gefunden.
inner: Und Miss liest in fremden Notizbüchern. Ganz toll, Miss.

=== ex_a_tisch_1b
kind: examine
target: h_a_schreibtisch
when: ch=1 f:k1_mini !k:c22
priority: 4
---
narr: Hobbes sah zum Fenster, nur einen Moment lang. Oben auf dem Briefstapel lag eine Visitenkarte. {+c:c22}
letter: Mrs. E. Penrose – Sitzungen nach Vereinbarung – 14 Gay Street, Bath. (Auf der Rückseite, in der engen Handschrift aus dem Notizbuch:) Aug.
narr: Darunter lag ein Briefbogen mit gedrucktem Kopf: Bath Royal Literary and Scientific Institution. Es war ein Angebot über siebenhundert Pfund „für die Sammlung von Instrumenten, Platten, Moosen und Gesteinen“. {+c:c25}
hobbes[neutral]: Miss.
inner: Nur ein Wort. Aber ich hab verstanden: Das reicht jetzt.

=== ex_a_tisch_1c
kind: examine
target: h_a_schreibtisch
when: ch=1 k:c22
priority: 3
---
narr: Hobbes ließ sie nicht aus den Augen. Er hatte die Hände vor dem Frack gefaltet und wartete darauf, dass sie ging.
inner: Okay. Nicht jetzt.

=== ex_a_tisch_2
kind: examine
target: h_a_schreibtisch
when: ch>=2 !k:c15
priority: 5
---
narr: Niemand stand an der Tür. Sera blätterte im Notizbuch zurück. Wetterdaten, Luftdruck, Regenmengen in Zoll, und dazwischen ein paar knappe Sätze. {sfx:paper}
letter: Aug. – Bath. Dr. W.: Monate, nicht Jahre. – Abends bei Mrs. P. Ihr erzählt, was ich niemandem erzähle. Narr. {+c:c14}
letter: 8. Nov. – C & T: 1840 angewiesen. Dem Jungen nichts sagen, bis er es selbst fragt. {+c:c15}
inner: „Monate, nicht Jahre.“ Das klingt nach einem Arzt. Und „C & T“, „der Junge“ … Da tut ein Vater etwas für seinen Sohn und sagt es ihm nicht.
inner: Das kenne ich. Das gibt es nicht nur 1877. Das gibt es überall.

=== ex_a_tisch
kind: examine
target: h_a_schreibtisch
---
narr: Das Notizbuch, die Briefe, der Bernstein. In dem Briefbeschwerer steckte eine kleine Fliege, seit ein paar Millionen Jahren.
inner: Arme Fliege. Die ist auch nicht mehr rechtzeitig nach Hause gekommen.

=== ex_a_sessel
kind: examine
target: h_a_sessel
---
narr: Ein Lehnsessel aus dunkelgrünem Leder mit eingedrückter Sitzfläche. Auf der Lehne lag eine Wolldecke, ordentlich gefaltet.
inner: Hier hat man ihn gefunden. Sagen sie jedenfalls.

=== ex_a_sessel_d
kind: examine
target: h_a_sessel
when: k:d03
priority: 5
---
narr: Der Sessel und die gefaltete Decke.
inner: Jetzt weiß ich, dass er am Boden lag. Und die Decke ist viel zu ordentlich gefaltet. Niemand faltet eine Decke, in der gerade jemand gestorben ist. Das macht man nur, wenn es so aussehen soll.

=== ex_a_terrasse
kind: examine
target: h_a_terrassentuer
---
narr: Eine Glastür führte auf die Terrasse. Draußen war der Garten im Regen kaum noch zu sehen. Auf dem Teppich davor lag angetrocknete Erde, der Abdruck eines halben Absatzes, ziemlich groß. {+c:c20}
inner: Größer als meine Füße. Und größer als die von Hobbes, glaube ich. Der hat ganz schmale Schuhe.

=== ex_a_dunkeltuer
kind: examine
target: h_a_dunkeltuer
---
narr: Eine schmale Tür, abgeschlossen. Hier roch es am stärksten, süßlich und nussig, nach altem Marzipan, das zu lange im Schrank gelegen hat. {+c:c11}
inner: Bittermandel. Bei Agatha Christie ist das immer eine schlechte Nachricht.

=== ex_d_flasche
kind: examine
target: h_d_flasche
---
narr: Eine braune Flasche. Der Glasstopfen lag daneben. Auf dem Etikett stand in sauberer Handschrift: „Kal. cyanid. – Fixierbad. GIFT.“ {+c:c12}
inner: Da ist er also, der Krimigeruch. In einer Flasche mit Etikett. Genau da, wo er hingehört.

=== ex_d_wannen
kind: examine
target: h_d_wannen
---
narr: In einer Reihe standen flache Porzellanschalen, sauber ausgespült. Eine war noch halb voll mit einer klaren Flüssigkeit. Daneben stand eine Uhr mit großem Sekundenzeiger.
inner: Hier macht er aus Licht ein Bild, das man anfassen kann. Das wäre ein richtig gutes Tafelbild. Riecht nur leider nach Chemieraum.

=== ex_d_platten
kind: examine
target: h_d_platten
---
narr: In Holzkästen standen Glasplatten, sauber beschriftet: „Moor, Febr. 1871“, „Kapelle bei Nebel“, „L., Garten, 1860“, „C. mit Kamera, 1874“.
inner: So einen Kasten hab ich zu Hause. Oder ich werde mal einen haben. Oder … ich hör lieber auf, darüber nachzudenken, sonst wird mir schwindlig.

=== ex_d_lampe
kind: examine
target: h_d_lampe
---
narr: Eine Laterne mit rubinrotem Glas. Wenn sie brannte, war alles im Raum rot und dunkel, auch die eigenen Hände.

=== ex_b_tisch
kind: examine
target: h_b_tisch
---
narr: Ein runder Tisch mit Kreidestrichen auf dem Holz. In der Mitte stand ein halb heruntergebrannter Kerzenstummel, daneben ein Glas mit einem Rest Wasser.
inner: Hier war also die Séance. Hier hat seine Frau angeblich „gesprochen“, und danach ist er gestorben. Kein Wunder, dass der Captain einen Schuldigen sucht.

=== ex_b_tisch_2
kind: examine
target: h_b_tisch
when: ch>=2 !k:c24
priority: 5
---
narr: Unter dem Tisch, halb unter den Teppichrand gerutscht, lag ein Blatt Papier. Die Schrift darauf war fahrig und schief, fast wie mit geschlossenen Augen geschrieben. {+c:c24, sfx:paper}
letter: Er kommt bald zu mir. Hab keine Angst. L.
inner: L. Lionel? Oder … Lucinda. Das sieht aus wie im Halbschlaf geschrieben. Und das Blatt lag unter dem Stuhl, auf dem bei der Sitzung Miss Averley saß. Das Kissen ist noch eingedrückt, und da hängen schwarze Seidenfäden dran.

=== ex_b_tisch_y
kind: examine
target: h_b_tisch
when: f:y_saw_sheet !k:c24
priority: 6
---
narr: Sera bückte sich dorthin, wo Yuumi vom Sims aus hingestarrt hatte. Unter dem Tisch, halb unter den Teppichrand gerutscht, lag ein Blatt Papier. {+c:c24, sfx:paper}
letter: Er kommt bald zu mir. Hab keine Angst. L.
inner: L. Lionel? Oder … Lucinda. Das sieht aus wie im Halbschlaf geschrieben. Und das Blatt lag unter dem Stuhl, auf dem bei der Sitzung Miss Averley saß. Das Kissen ist noch eingedrückt, und da hängen schwarze Seidenfäden dran.

=== ex_b_regal
kind: examine
target: h_b_regal
---
narr: Darwin stand neben Swedenborg, Lyell neben einem Band über Tischrücken und Geisterklopfen.
inner: „Die Entstehung der Arten“ ist hier gerade mal achtzehn Jahre alt. Und direkt daneben Klopfgeister. Zwei Leute haben diese Bibliothek gefüllt, und die waren sich nicht einig.

=== ex_b_kamin
kind: examine
target: h_b_kamin
---
narr: Im Kamin glühte es noch. Jemand hatte nachgelegt. Auf dem Sims stand ein Glas mit einem Rest Brandy.
inner: Hier sitzt der Captain am liebsten. Am Feuer und weit weg von seiner Tante.

=== ex_k_klingel
kind: examine
target: h_k_klingelkasten
---
narr: Über der Tür hing ein Brett mit zwölf kleinen Glocken an gebogenen Federn. Unter jeder war ein Schildchen: Salon, Speisezimmer, Bibliothek, Arbeitszimmer, Miss Averley, Captain … {+c:c02}
narr: Die Glocke „Arbeitszimmer“ hing schief. Ihr Draht, der in der Wand verschwand, war lang gezogen und leicht verbogen. Es sah aus, als hätte jemand von weit weg mit aller Kraft daran gezerrt.
inner: Jedes Zimmer hat seinen eigenen Draht. Und der vom Arbeitszimmer ist überdehnt.

=== ex_k_herd
kind: examine
target: h_k_herd
---
narr: Ein großer schwarzer Herd. Er brauchte eine Menge Kohlen, und Tilly schleppte sie heran. Daneben war eine Diele, die knarrte, wenn man darauftrat.

=== ex_k_herd_5
kind: examine
target: h_k_herd
when: f:g_tilly_spoke
priority: 5
---
narr: Die Diele neben dem Herd. Darunter hatte Tilly drei Tage lang in einer verbeulten Blechdose den letzten Brief eines Toten aufbewahrt, zwischen einem Knopf, einem Stück Band und einem glatten Stein.

=== ex_k_tisch
kind: examine
target: h_k_tisch
---
narr: Der Küchentisch war zerkratzt und abgescheuert. An der Kante, wo Tilly immer saß, hatte jemand mit einer Messerspitze Buchstaben ins Holz geritzt: T, I, L. Das L war verkehrt herum.
inner: Oh, Tilly. Sie übt ihren Namen, heimlich, im Holz, weil sie kein Papier hat. Ich würde ihr sofort ein Heft schenken.

=== ex_k_bord
kind: examine
target: h_k_bord
when: ch<=2
---
narr: Auf dem Bord standen die Leuchter der Dienstboten, jeder mit einem Namensschild: Hobbes, Pryce, Tilly. In allen steckten dicke, gelbliche Talgkerzen.
narr: Tillys Kerze war fast bis auf den Leuchter heruntergebrannt, die anderen kaum. Darunter hing ein Schild in fester Schrift: „Eine Kerze je Nacht. A. P.“ {+c:c28}
inner: Eine Kerze pro Nacht, und Tillys ist fast runter. Dann war sie lange wach. Richtig lange.

=== ex_k_bord_3
kind: examine
target: h_k_bord
when: ch>=3
---
narr: In allen Leuchtern steckten neue Kerzen. Neben dem Bord hing an einer Schnur Mrs. Pryces Kerzenbuch. Unter „Mittwoch früh“ stand in ihrer festen Schrift: „T. – neue Kerze, die alte ganz herunter.“ {+c:c28}
inner: Also war Tilly in der Nacht auf Mittwoch lange wach. Und Mrs. Pryce hat es aufgeschrieben. Die schreibt wirklich alles auf.

=== ex_k_butler_1
kind: examine
target: h_k_butler
when: ch=1
---
narr: Die Butlerkammer war Hobbes’ Reich: Silber, Gläser, ein Tisch mit grünem Tuch. Die Tür stand einen Spalt offen.
inner: Da geh ich nicht einfach rein. Nicht in Hobbes’ Kammer. So mutig bin ich heute nicht.

=== ex_k_butler_voices
kind: examine
target: h_k_butler
when: ch=2 tod=nachmittag seen:k2_dark !f:k2_listened !f:k2_pantry_free
priority: 6
---
narr: Die Tür der Butlerkammer war angelehnt. Dahinter hörte man gedämpfte Stimmen, Hobbes und Mrs. Pryce. Es roch nach Kampfer.
inner: Ich kann doch nicht an der Tür lauschen. Eine Gesellschafterin lauscht nicht. Eine Katze allerdings … {do:hint_yuumi}

=== ex_k_butler_2
kind: examine
target: h_k_butler
when: ch>=2 !k:c08 anyf:k2_listened,k2_pantry_free,k3_started
priority: 5
---
narr: Hobbes war oben, die Butlerkammer leer. Silber in Filztaschen, eine Reihe blanker Weingläser. In der untersten Schublade lag unter dem Silbertuch etwas in Leinen gewickelt: eine Kristallkaraffe mit einem Rest Brandy am Boden und zwei Gläser, gespült und poliert. {+c:c08}
inner: Die Karaffe passt in den leeren Platz im Tantalus. Aber warum versteckt man Gläser, die man nur abgewaschen hat?

=== ex_k_butler
kind: examine
target: h_k_butler
when: ch>=2
---
narr: Die Butlerkammer war sehr ordentlich. Das Abtropfbrett war leer.

=== ex_k_stiefel
kind: examine
target: h_k_stiefel
---
narr: Die Stiefelkammer: Reihen von Stiefeln, Bürsten, Dosen mit Wichse. Es roch nach Leder und nassem Hund, obwohl es hier gar keinen Hund gab.

=== ex_k_stiefel_3
kind: examine
target: h_k_stiefel
when: ch>=3 !k:c19
priority: 5
---
narr: Die Reitstiefel des Captains standen da, frisch gewichst. Auf dem Fensterbrett daneben lag ein Klumpen rote Erde, ordentlich zur Seite gelegt. {+c:c19}
inner: Das hat jemand aus den Absätzen gekratzt und aufgehoben. Rote Erde, wie aus dem Rosenbeet unter der Terrasse. Und der Captain will geschlafen haben wie ein Stein.

=== ex_k_pryce
kind: examine
target: h_k_pryce
---
narr: Das Zimmer der Haushälterin. Die Tür war zu. Hier klopfte man nicht ohne guten Grund.

=== ex_k_pryce_3
kind: examine
target: h_k_pryce
when: ch>=3 !k:c27
priority: 5
---
narr: Die Tür stand einen Spalt offen, Mrs. Pryce war oben bei Miss Averley. Auf dem kleinen Tisch am Fenster lag ein Briefbogen unter einem Tintenfass. Die ersten Zeilen konnte man gar nicht übersehen. {+c:c27}
letter: Mein lieber Owen, Mittwoch, 2 Uhr früh, und ich kann nicht schlafen. Der Regen macht mich alt, und das Kind –
inner: Da hört es auf, mitten im Satz. Um zwei Uhr früh war sie also wach.

=== ex_k_hoftuer
kind: examine
target: h_k_hoftuer
---
narr: Die Hoftür war verriegelt, davor stand ein Eimer Sand.
pryce[neutral]: Bei dem Wasser geht keiner raus, der nicht muss, Miss. Wenn Dunning was will, kommt er schon rein. Na?

=== ex_g_clara
kind: examine
target: h_g_clara
---
narr: Eine Tür. Auf den Dielen davor waren ein paar helle Tropfen, dicht beieinander.
inner: Wahrscheinlich Kerzenwachs.

=== ex_g_clara_t
kind: examine
target: h_g_clara
when: f:k2_tallow_learned
priority: 5
---
narr: Drei Tropfen, dicht beieinander, direkt vor der Schwelle. Sera kratzte mit dem Fingernagel daran. Sie waren weich und gelblich. {+c:c18}
inner: Talg. Hier oben, vor Claras Tür. Da hat jemand mit einer Dienstbotenkerze gestanden, und zwar so lange, dass sie dreimal getropft hat.

=== ex_g_harriet
kind: examine
target: h_g_harriet
---
narr: Eine Tür aus dunklem Holz. Dahinter war es still. Trotzdem hatte Sera das Gefühl, dass jemand da drin saß, sehr gerade.

=== ex_g_lionel
kind: examine
target: h_g_lionel
---
narr: Eine Tür. Dahinter klirrte etwas, eine Flasche an einem Glas. Dann war es still.

=== ex_g_gast
kind: examine
target: h_g_gast
---
narr: Das Gästezimmer. Es roch nach Rosenwasser. Unter der Tür war ein Spalt, gerade breit genug für eine Hand. Oder für eine Pfote.

=== ex_g_gelaender
kind: examine
target: h_g_gelaender
---
narr: Von hier sah man hinunter in die Halle: die Treppe, das Halbpodest mit dem Fenstersitz, den verhängten Kasten auf seinen drei Beinen und die Tür zum Arbeitszimmer.
inner: Von hier oben sieht man alles. Und man muss nicht mal runtergehen.

=== ex_g_gelaender_4
kind: examine
target: h_g_gelaender
when: k:s30
priority: 5
---
narr: Das Geländer war blank gegriffen.
inner: Von hier hat Mrs. Penrose runtergeschaut. Auf ein weinendes Kind und auf mich.

=== ex_g_totentuer
kind: examine
target: h_g_totentuer
---
narr: Das Zimmer des Herrn. Die Tür war abgeschlossen, und der Schlüssel steckte nicht.
inner: Den Schlüssel hat bestimmt Hobbes. Wer sonst.

=== ex_t_bett
kind: examine
target: h_t_bett
---
narr: Edmund Averley lag in seinem Bett, die Hände über Lucindas kleinem Bild gefaltet. Man hatte ihm ein weißes Tuch unter das Kinn gebunden und Münzen auf die Lider gelegt.
inner: Er sieht ruhig aus. Ruhiger als auf dem Bild unten in der Halle.

=== ex_t_kerzen
kind: examine
target: h_t_kerzen
---
narr: Auf dem Nachttisch standen zwei Wachskerzen, daneben eine Schale mit Salz und ein Zweig Rosmarin.
inner: Salz gegen das Böse, Rosmarin fürs Erinnern. Oder umgekehrt? Mrs. Pryce hat es mir erklärt, aber ich war mit den Gedanken ganz woanders. Ich hab einfach genickt.

=== ex_t_fenster
kind: examine
target: h_t_fenster
---
narr: Das Fenster stand einen Fingerbreit offen, obwohl es kalt war.
inner: Damit die Seele rauskann, sagt man hier. Dafür regnet es jetzt rein.

=== ex_ka_fenster
kind: examine
target: h_ka_fenster
---
narr: Ein Fenster zum Moor. Das Wasser war glatt und grau, und die Wolken spiegelten sich so genau darin, dass man nicht mehr wusste, wo oben war.

=== ex_ka_bett
kind: examine
target: h_ka_bett
---
narr: Ein schmales Bett. Mrs. Pryce hatte eine Wärmflasche aus Steingut hineingelegt und kein Wort darüber verloren.
inner: So sagt sie mir, dass ich hier nicht frieren soll. Lieb von ihr. Trotzdem vermisse ich Fritz gerade ganz schrecklich.

=== ex_ka_truhe
kind: examine
target: h_ka_truhe
---
narr: Unter Miss Finchs Unterröcken lagen, sorgfältig zusammengefaltet, eine weite Jeans, eine cremefarbene Strickjacke und zwei Socken mit Avocados.
inner: Zwischen Rosshaar-Unterröcken aus den Sechzigern meine Jeans. Beweisstück A, dass ich nicht verrückt bin. Oder dass ich es sehr gründlich bin.

=== ex_ka_spiegel
kind: examine
target: h_ka_spiegel
---
narr: Über dem Waschtisch hing ein kleiner Spiegel. Hier oben hatte ihn niemand verhängt.
inner: Ich sehe müde aus. Und sehr achtzehnhundertsiebenundsiebzig.

=== ex_gw_zitronen
kind: examine
target: h_gw_zitronen
---
narr: Zitronenbäumchen in Kübeln, jedes mit einem Schild in einer engen, genauen Handschrift. Eine Frucht war gelb geworden. Nur eine.
inner: Zitronen, in Somerset, im November. Die brauchen Wärme und viel Licht, und beides gibt es hier gerade nicht. Er muss sich wahnsinnig Mühe gegeben haben.

=== ex_gw_bank
kind: examine
target: h_gw_bank
---
narr: Eine Gartenbank aus Eisen, kalt. Auf ihr lag ein Kissen, das jemand hier vergessen hatte.

=== ex_gw_glas
kind: examine
target: h_gw_glas
---
narr: Über ihr war das Glasdach. Der Regen trommelte laut darauf.

=== ex_st_boot
kind: examine
target: h_st_boot
---
narr: Ein flaches Boot lag kieloben auf zwei Böcken. An den Nähten war frisches Pech.
inner: Dunning macht es gerade fertig. Wenn das Wasser fällt, kommt man damit ins Dorf. Und der Coroner kommt damit hierher.

=== ex_st_pferde
kind: examine
target: h_st_pferde
---
narr: Zwei Pferde standen in ihren Boxen, ein Brauner und eine Schimmelstute. Der Braune schnaubte und stampfte.
yuumi: (Yuumi sah sich das Pferd aus sicherer Entfernung an. Ihr Schwanz war doppelt so dick wie sonst.)

=== ex_st_uhr
kind: examine
target: h_st_uhr
---
narr: Über dem Stalltor hing eine Uhr mit einem kleinen Glockenstuhl. Sie schlug die Viertelstunden: einmal, zweimal, dreimal, und zur vollen Stunde viermal und dann die Zahl.

=== ex_st_wasser
kind: examine
target: h_st_wasser
---
narr: Am Ende des Hofs fing das Moor an. Vom Land war nichts mehr zu sehen, überall war Wasser. Die Kopfweiden standen bis zur Hälfte darin.

=== ex_st_terrasse
kind: examine
target: h_st_terrasse
---
narr: Von hier sah man um die Hausecke: die Terrasse mit ihrer steinernen Brüstung und dahinter das hohe Fenster des Arbeitszimmers.
inner: Wer nachts hier steht, sieht jeden, der da drüben im Lampenlicht steht.

=== ex_kp_grab
kind: examine
target: h_kp_grab
---
narr: Ein Grabstein aus hellem Kalkstein, an den Kanten schon grün. Darauf stand: „Lucinda Averley, 1829–1861. Sie hörte die Glocke.“

=== ex_kp_glocke
kind: examine
target: h_kp_glocke
---
narr: Der kleine Glockenstuhl über der Kapelle war leer. Nur ein rostiger Haken hing noch darin und bewegte sich im Wind.

=== ex_kp_wasser
kind: examine
target: h_kp_wasser
---
narr: Unter dem Hügel lag das Moor, glatt, grau und still. Irgendwo da unten sollte die alte Kirche von St. Aldhelm liegen, mit ihrer Glocke.
`;
