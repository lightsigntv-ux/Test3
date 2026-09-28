export default `
=== ep_home
kind: scene
when: ch=6 f:end_go loc=wohnung
priority: 20
important: yes
---
narr: Eine Heizung, die tickte. Eine Schreibtischlampe. Ein Karton auf dem Boden, in dem niemand saß. {music:home}
narr: Sera saß auf dem Teppich ihrer Wohnung, in einem schwarzen Wollkleid, das nach Blauholz und Essig roch, und hielt eine empörte Katze mit Heu im Fell im Arm. Fritz saß neben ihr, noch im Mantel, und hielt ihre Hand.
yuumi: (Yuumi wand sich frei, schüttelte sich so gründlich, dass Heu durch das Zimmer flog, und setzte sich vor den leeren Futternapf.)
narr: Die Uhr am Herd zeigte 21.47. Sieben Minuten nach dem Augenblick, in dem sie die Platte gegen die Lampe gehalten hatte.
inner: Sieben Minuten. Und drei Tage. Und ein ganzes Leben, das nicht meins war. Fritz weiß nicht mal, dass ich weg war.
narr: Die Kiste mit den Glasplatten stand auf dem Schreibtisch. Die Platte mit der Treppe lag darin, in einem vergilbten Papier, das vorhin noch nicht vergilbt war. Oder doch. Sera fasste sie nicht an.
narr: Sie klappte den Laptop auf. Ihre Finger waren noch kalt vom Moor. Sie tippte: Averley Hall 1877. Ein Zeitungsarchiv, digitalisiert, Seite um Seite in körniger Schrift. {sfx:paper}
letter: Western Gazette, Freitag, 23. November 1877. – Die Leichenschau in Averley Hall.
letter: Am vergangenen Sonnabend hielt Mr. Harding, Coroner, in Averley Hall bei Middlemoor, das infolge des Hochwassers mehrere Tage von der Außenwelt abgeschnitten war, eine Leichenschau über den Tod des Edmund Averley, Esq., 61 Jahre.
? f:g_hobbes_confessed -> hob
-> tilly
# hob
letter: Josiah Hobbes, Butler des Verstorbenen, gab an, den Verstorbenen am Morgen am Boden des Arbeitszimmers gefunden und ihn aus Pietät in seinen Sessel gebettet zu haben, was ihm der Coroner mit milden Worten verwies.
# tilly
letter: Die bemerkenswerteste Aussage machte die Küchenmagd Matilda Crane, dreizehn Jahre alt, die mit großer Schlichtheit schilderte, wie sie in der Nacht auf das Läuten des Verstorbenen hin zu ihm geeilt sei, einen Brief an seine Tochter empfangen und ihm in seiner letzten Stunde beigestanden habe.
letter: Eine Gesellschafterin des Hauses, die sich bereit erklärt hatte auszusagen, war am Morgen nicht aufzufinden; das Gericht sah von ihrer Aussage ab.
? f:g_hobbes_stands -> stands
-> son
# stands
letter: Während ihrer Aussage stand der alte Butler hinter ihrem Stuhl, die Hand auf der Lehne.
# son
? f:g_lionel_confessed -> conf
letter: Die Familie des Verstorbenen lehnte weitere Auskünfte ab. Der Coroner nahm die Aussage der Küchenmagd mit Zurückhaltung auf und ermahnte sie, die Herrschaftsräume künftig nicht ohne Geheiß zu betreten.
-> verdict
# conf
letter: Der Sohn des Verstorbenen, Captain L. Averley, gab aus eigenem Antrieb Auskunft über eine schmerzliche Unterredung mit seinem Vater in der fraglichen Nacht, welche im Saal große Bewegung hervorrief.
# verdict
letter: Dr. Bell bezeugte, der Tod sei durch ein Versagen des Herzens eingetreten; die Verletzung an der Schläfe rühre von einem Sturz. Die Geschworenen befanden auf natürlichen Tod infolge eines Herzleidens.
narr: Sera las es dreimal. Dann klappte sie den Laptop zu, sehr leise.
inner: Tilly hat es gesagt. Vor allen. Mit großer Schlichtheit.
narr: Yuumi sprang auf den Schreibtisch, direkt in die Kiste mit den Platten, und begann, im Seidenpapier zu graben, wie sie es immer tat, wenn es raschelte. Etwas rutschte heraus und fiel auf den Boden. Eine kleine Fotografie auf festem Karton, mit Goldrand. {sfx:paper}
? f:g_lionel_confessed -> echo
-> seal
# echo
narr: Visitenkartenformat, ein Londoner Atelier, 1883. Drei Menschen vor einem gemalten Garten. Eine Frau im Talar, das dunkle Haar straff zurück, eine Hand auf einem Buch. Ein Mann in Zivil, ohne Schnurrbart, mit ruhigen Augen. Und ein Mädchen von neunzehn oder zwanzig, in einem guten grauen Kleid, das ein zweites Buch fest an die Brust drückte.
? f:g_harriet_frees -> echo_h
-> echo_b
# echo_h
narr: Am Rand, auf einem Stuhl, eine alte Dame in Grau. Nicht in Schwarz. In Grau, mit einer leeren Stelle am Kragen, wo einmal eine Brosche war.
# echo_b
narr: Sera drehte die Karte um. Zwei Handschriften. Eine enge, genaue. Und darunter eine große, runde, mit einem M, das aussah wie zwei Berge.
letter: Für die Miss, die aus dem Wasser kam. Wo immer das ist. Wir haben es gehört, und wir haben es gesagt. – C. A. · M. Crane
-> end
# seal
narr: Visitenkartenformat, ein Londoner Atelier, 1883. Eine Frau im Talar, allein vor einem gemalten Garten, das dunkle Haar straff zurück, eine Hand auf einem Buch. Sie lächelte nicht. Aber ihre Augen taten es.
narr: Sera drehte die Karte um.
? f:g_harriet_frees -> seal_h
letter: Für die Miss, die aus dem Wasser kam. Lionel hat bezahlt, jeden Penny. Er kommt nicht nach London. Er spricht über gar nichts mehr. – C. A.
-> seal_t
# seal_h
letter: Für die Miss, die aus dem Wasser kam. Tante Harriet hat ihre Jetbrosche abgelegt und bezahlt, was sie konnte. Lionel den Rest. Er kommt nicht nach London. – C. A.
# seal_t
narr: Und darunter, in einer großen, runden Schrift, mit einem M, das aussah wie zwei Berge:
letter: M. Crane
# end
narr: Sera saß auf dem Boden und hielt die Karte lange in der Hand. Die Heizung tickte.
yuumi: (Yuumi kletterte auf ihren Schoß, dann an ihr hinauf, legte die Vorderpfoten auf ihre Schulter und drückte ihr Gesicht an Seras Hals. Das Glöckchen klang, ganz fein. Sie schnurrte.) {sfx:purr}
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
narr: London, November 1878. Henrietta Street, zweiter Stock, zwei Zimmer mit einem Ofen, der rauchte, wenn der Wind aus Osten kam. {music:london}
narr: Auf dem Fensterbrett lag der erste Schnee, außen. Innen lag Yuumi, auf einem Kissen, das eigens für sie dort hingelegt worden war, und sah den Tauben zu, mit dem Blick einer Katze, die sich für etwas Besseres hielt.
narr: Am Tisch saß Tilly, nein, Matilda, mit einer Schiefertafel und einem Griffel, und schrieb. Die Zunge zwischen den Zähnen. Das M sah aus wie zwei Berge. Das A hatte seinen Balken. Seit dem Frühjahr konnte sie das ganze Alphabet, und sie las die Schilder der Omnibusse laut vor, alle, jeden Tag, bis Clara drohte, auszuziehen.
narr: Clara kam aus der Kälte herein, Schnee auf dem Hut, die Fingerspitzen nicht mehr schwarz, sondern blau von Tinte, und legte einen Stapel Bücher auf den Tisch.
clara[warm]: Anatomie der Hand. Wir haben heute eine Hand gesehen, Miss Hale. Eine ganze Hand. Siebenundzwanzig Knochen. Ich habe keinen einzigen verwechselt.
tilly[warm]: Ich weiß, wie man Hand schreibt. H. A. N. D.
clara[warm]: Dann haben wir heute beide eine Hand gelernt.
narr: Auf dem Kaminsims, gegen die Uhr gelehnt, ein Ausschnitt aus der Western Gazette, schon ein wenig vergilbt vom Ofenrauch.
letter: Die bemerkenswerteste Aussage machte die Küchenmagd Matilda Crane, dreizehn Jahre alt, der eine Gesellschafterin des Hauses zur Seite stand und deren Bericht in allen Einzelheiten bestätigte.
? f:g_lionel_confessed -> conf
letter: Die Familie des Verstorbenen lehnte weitere Auskünfte ab. Die Geschworenen befanden auf natürlichen Tod infolge eines Herzleidens.
narr: Die echte Miss Hale trat im Frühjahr eine Stelle in Clifton an, mit einem Zeugnis von Miss Averley, das so warm war, dass die Agentur nachfragte. Sera hatte keines. Miss Averley sagte, sie brauche keins.
narr: Lionel schrieb einmal im Monat. Er schrieb über Pferde. Er hatte Claras Gebühren bezahlt, jeden Penny, und nie ein Wort darüber verloren. Clara las die Briefe zweimal und verbrannte keinen davon.
-> after
# conf
letter: Der Sohn des Verstorbenen, Captain L. Averley, gab aus eigenem Antrieb Auskunft über eine schmerzliche Unterredung mit seinem Vater in der fraglichen Nacht. Die Geschworenen befanden auf natürlichen Tod infolge eines Herzleidens.
narr: Lionel quittierte den Dienst. Er lebte in Averley, züchtete Pferde und kam an Sonntagen nach London, in Zivil, und brachte Tilly Pfefferminz und Clara Zeitschriften, in denen etwas über Frauen in der Medizin stand, das er mit Bleistift anstrich, wenn er sich ärgerte.
# after
narr: Mrs. Pryce schrieb jeden Mittwoch. An Owen, und seit einem Jahr auch an Tilly. Tilly las die Briefe laut, alle, auch die über das Wetter.
narr: Am Abend, wenn die beiden schliefen, holte Sera einen flachen Holzkasten unter dem Bett hervor. Edmunds Platten, die Clara der Institution in Bath verkauft hatte, bis auf diesen einen Kasten, den sie behalten wollte, und den sie Sera gegeben hatte, ohne zu fragen, warum Sera ihn haben wollte.
narr: Sera wickelte die Glasplatte mit der Treppe in frisches Seidenpapier. Sie schrieb nichts darauf. Sie legte sie zu den anderen, zu der Kuh und der Familie auf dem Rasen und dem Moor im Februar.
inner: Damit sie mich findet.
inner: In hundertachtundvierzig Jahren. An einem Dienstagabend im November, mit einer Katze in einem Karton und einer Lampe, die flackern will und es sich anders überlegt. Und mit Fritz, der irgendwann nach Hause kommt und niemanden findet.
inner: Manchmal, nachts, höre ich eine Heizung ticken, die es noch nicht gibt. Dann stehe ich auf und lege Kohlen nach.
inner: Manchmal weiß ich die Telefonnummer meiner Mutter nicht mehr. Dann schreibe ich sie auf Tillys Schiefertafel und wische sie wieder weg, bevor jemand fragt.
yuumi: (Yuumi sprang vom Fensterbrett, kam über den kalten Boden, kletterte auf Seras Schoß und rollte sich dort ein, mit dem Glöckchen unter dem Kinn. Sie schnurrte, als hätte sie nie irgendwo anders gewohnt.) {sfx:purr}
inner: Du hast recht. Wir sind zu Hause. {pause:1200}
! {do:ending:zeugin}
`;
