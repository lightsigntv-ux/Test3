export default `
=== ep_home
kind: scene
when: ch=6 f:end_go loc=wohnung
priority: 20
important: yes
---
narr: Eine Heizung, die tickt. Eine Schreibtischlampe. Ein Karton auf dem Boden, in dem niemand sitzt. {music:home}
narr: Sera sitzt auf dem Teppich ihrer Wohnung in einem schwarzen Wollkleid, das nach Blauholz und Essig riecht, und hält eine nasse, empörte Katze im Arm.
yuumi: (Yuumi windet sich frei, schüttelt sich so gründlich, dass Heu durch das Zimmer fliegt, und setzt sich dann vor den leeren Futternapf, als wäre nichts gewesen.)
narr: Die Uhr am Herd zeigt 21.47. Sieben Minuten nach dem Augenblick, in dem sie die Platte gegen die Lampe hielt.
inner: Sieben Minuten. Und fünf Tage. Und ein ganzes Leben, das nicht meins war.
narr: Die Kiste mit den Glasplatten steht auf dem Schreibtisch. Die Platte mit der Treppe liegt darin, in einem vergilbten Papier, das vorhin noch nicht vergilbt war. Oder doch. Sera fasst sie nicht an.
narr: Sie klappt den Laptop auf. Ihre Finger sind noch kalt vom Moor. Sie tippt: Averley Hall 1877. Ein Zeitungsarchiv, digitalisiert, Seite um Seite in körniger Schrift. {sfx:paper}
letter: Western Gazette, Freitag, 23. November 1877. – Die Leichenschau in Averley Hall.
letter: Am vergangenen Sonnabend hielt Mr. Harding, Coroner, in Averley Hall bei Middlemoor, das infolge des Hochwassers mehrere Tage von der Außenwelt abgeschnitten war, eine Leichenschau über den Tod des Edmund Averley, Esq., 61 Jahre.
? f:g_hobbes_confessed -> hob
-> tilly
# hob
letter: Der Butler, Mr. J. Hobbes, gab an, den Verstorbenen am Morgen am Boden des Arbeitszimmers gefunden und ihn aus Pietät in seinen Sessel gebettet zu haben, was ihm der Coroner mit milden Worten verwies.
# tilly
letter: Die bemerkenswerteste Aussage machte die Küchenmagd Matilda Crane, dreizehn Jahre alt, die mit großer Schlichtheit schilderte, wie sie in der Nacht auf das Läuten des Verstorbenen hin zu ihm geeilt sei, einen Brief an seine Tochter empfangen und ihm in seiner letzten Stunde beigestanden habe.
? f:g_hobbes_stands -> stands
-> son
# stands
letter: Während ihrer Aussage stand der alte Butler hinter ihrem Stuhl, die Hand auf der Lehne.
# son
? f:g_lionel_confessed -> conf
letter: Die Familie des Verstorbenen lehnte weitere Auskünfte ab.
-> verdict
# conf
letter: Der Sohn des Verstorbenen, Captain L. Averley, gab aus eigenem Antrieb Auskunft über eine schmerzliche Unterredung mit seinem Vater in der fraglichen Nacht, welche im Saal große Bewegung hervorrief.
# verdict
letter: Dr. Bell bezeugte, der Tod sei durch ein Versagen des Herzens eingetreten; die Verletzung an der Schläfe rühre von einem Sturz. Die Geschworenen befanden auf natürlichen Tod infolge eines Herzleidens.
narr: Sera liest es dreimal. Dann klappt sie den Laptop zu, sehr leise, wie man eine Tür schließt, hinter der jemand schläft.
inner: Tilly hat es gesagt. Vor allen. Mit großer Schlichtheit.
narr: Yuumi springt auf den Schreibtisch, direkt in die Kiste mit den Platten, und beginnt, im Seidenpapier zu graben, wie sie es immer tut, wenn es raschelt. Etwas rutscht heraus und fällt auf den Boden. Eine kleine Fotografie auf festem Karton, mit Goldrand. {sfx:paper}
? f:g_lionel_confessed -> echo
-> seal
# echo
narr: Visitenkartenformat, ein Londoner Atelier, 1883. Drei Menschen vor einem gemalten Garten. Eine Frau im Talar, das dunkle Haar straff zurück, eine Hand auf einem Buch. Ein Mann in Zivil, ohne Schnurrbart, mit ruhigen Augen. Und ein Mädchen von neunzehn oder zwanzig, in einem guten grauen Kleid, das ein zweites Buch an die Brust drückt, als könnte man es ihr wegnehmen.
? f:g_harriet_frees -> echo_h
-> echo_b
# echo_h
narr: Am Rand, auf einem Stuhl, eine alte Dame in Grau. Nicht in Schwarz. In Grau, mit einer leeren Stelle am Kragen, wo einmal eine Brosche war.
# echo_b
narr: Sera dreht die Karte um. Zwei Handschriften. Eine enge, genaue. Und darunter eine große, runde, mit einem M, das aussieht wie zwei Berge.
letter: Für Miss Hale, wo immer sie ist. Es ist gehört worden. – C. A. · M. Crane
-> end
# seal
narr: Visitenkartenformat, ein Londoner Atelier, 1883. Eine Frau im Talar, allein vor einem gemalten Garten, das dunkle Haar straff zurück, eine Hand auf einem Buch. Sie lächelt nicht. Aber ihre Augen tun es.
narr: Sera dreht die Karte um.
? f:g_harriet_frees -> seal_h
letter: Für Miss Hale. Lionel hat bezahlt, jeden Penny. Er spricht nicht darüber. Er spricht über gar nichts mehr. – C. A.
-> seal_t
# seal_h
letter: Für Miss Hale. Tante Harriet hat ihre Jetbrosche verkauft. Lionel hat den Rest bezahlt. Er spricht nicht darüber. – C. A.
# seal_t
narr: Und darunter, in einer großen, runden Schrift, mit einem M, das aussieht wie zwei Berge:
letter: M. Crane
# end
narr: Sera sitzt auf dem Boden und hält die Karte in der Hand, lange. Die Heizung tickt.
yuumi: (Yuumi klettert auf ihren Schoß, dann an ihr hinauf, legt die Vorderpfoten auf ihre Schulter und drückt ihr Gesicht an Seras Hals. Das Glöckchen klingt, ganz fein. Sie schnurrt.) {sfx:purr}
inner: Ja. Ich weiß. Ich dich auch.
inner: Wir haben sie gehört. {pause:1200}
? f:g_lionel_confessed -> fin_echo
! {do:ending:siegel}
-> END
# fin_echo
! {do:ending:echo}

=== ep_london
kind: scene
when: ch=6 f:end_stay loc=london
priority: 20
important: yes
---
narr: London, Januar 1878. Henrietta Street, zweiter Stock, zwei Zimmer mit einem Ofen, der raucht, wenn der Wind aus Osten kommt. {music:london}
narr: Auf dem Fensterbrett liegt Schnee, außen. Innen liegt Yuumi, auf einem Kissen, das eigens für sie dort hingelegt wurde, und sieht den Tauben zu mit der Verachtung einer Katze, die einmal einen Heuboden erobert hat.
narr: Am Tisch sitzt Tilly, nein, Matilda, mit einer Schiefertafel und einem Griffel, und schreibt. Die Zunge zwischen den Zähnen. Das M sieht aus wie zwei Berge. Das A hat seinen Balken. Seit Neujahr kann sie das ganze Alphabet, und sie liest die Schilder der Omnibusse laut vor, alle, jeden Tag, bis Clara droht, auszuziehen.
narr: Clara kommt aus der Kälte herein, Schnee auf dem Hut, die Fingerspitzen nicht mehr schwarz, sondern blau von Tinte, und legt einen Stapel Bücher auf den Tisch.
clara[warm]: Anatomie der Hand. Wir haben heute eine Hand gesehen, Miss Hale. Eine ganze Hand. Siebenundzwanzig Knochen. Ich habe keinen einzigen verwechselt.
tilly[warm]: Ich weiß, wie man Hand schreibt. H. A. N. D.
clara[warm]: Dann bist du mir heute um vier Buchstaben voraus.
narr: Auf dem Kaminsims, gegen die Uhr gelehnt, ein Ausschnitt aus der Western Gazette, schon ein wenig vergilbt vom Ofenrauch.
letter: Die bemerkenswerteste Aussage machte die Küchenmagd Matilda Crane, dreizehn Jahre alt, der eine Miss S. Hale, Gesellschafterin im Hause, zur Seite stand und deren Bericht in allen Einzelheiten bestätigte.
? f:g_lionel_confessed -> conf
letter: Die Familie des Verstorbenen lehnte weitere Auskünfte ab. Die Geschworenen befanden auf natürlichen Tod infolge eines Herzleidens.
narr: Lionel schreibt einmal im Monat. Er schreibt über Pferde. Er hat Claras Gebühren bezahlt, jeden Penny, und nie ein Wort darüber verloren. Clara liest die Briefe zweimal und verbrennt keinen davon.
-> after
# conf
letter: Der Sohn des Verstorbenen, Captain L. Averley, gab aus eigenem Antrieb Auskunft über eine schmerzliche Unterredung mit seinem Vater in der fraglichen Nacht. Die Geschworenen befanden auf natürlichen Tod infolge eines Herzleidens.
narr: Lionel hat den Dienst quittiert. Er lebt in Averley, züchtet Pferde und kommt an Sonntagen nach London, in Zivil, und bringt Tilly Pfefferminz und Clara Zeitschriften, in denen etwas über Frauen in der Medizin steht, das er mit Bleistift anstreicht, wenn er sich ärgert.
# after
narr: Am Abend, wenn die beiden schlafen, holt Sera einen flachen Holzkasten unter dem Bett hervor. Edmunds Platten, die Clara der Institution in Bath verkauft hat, bis auf diesen einen Kasten, den sie behalten wollte, und den sie Sera gegeben hat, ohne zu fragen, warum Sera ihn haben wollte.
narr: Sera wickelt die Glasplatte mit der Treppe in frisches Seidenpapier. Sie schreibt nichts darauf. Sie legt sie zu den anderen, zu der Kuh und der Familie auf dem Rasen und dem Moor im Februar.
inner: Damit sie mich findet.
inner: In hundertachtundvierzig Jahren. An einem Dienstagabend im November, mit einer Katze in einem Karton und einer Lampe, die flackern will und es sich anders überlegt.
inner: Manchmal, nachts, höre ich eine Heizung ticken, die es noch nicht gibt. Dann stehe ich auf und lege Kohlen nach.
yuumi: (Yuumi springt vom Fensterbrett, kommt über den kalten Boden, klettert auf Seras Schoß und rollt sich dort ein, mit dem Glöckchen unter dem Kinn. Sie schnurrt, als hätte sie nie irgendwo anders gewohnt.) {sfx:purr}
inner: Du hast recht. Wir sind zu Hause. {pause:1200}
! {do:ending:zeugin}
`;
