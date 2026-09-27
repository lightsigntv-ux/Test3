export default `
=== t3_penrose_captain
kind: topic
npc: penrose
title: Der Captain
when: ch>=3
---
sera: Was halten Sie vom Captain, Mrs. Penrose?
penrose[neutral]: Dass er schlechter lügt als ich und besser als sein Vater. Sein Vater konnte gar nicht lügen. Er konnte nur schweigen.
penrose[neutral]: Der Captain riecht seit Mittwoch nach Rauch und hat frisch geschrubbte Hände. Die Knöchel ganz rot. Man schrubbt sich nicht die Hände, bis sie rot sind, wenn man nur geraucht hat. {+s:s19, hints:f13}
penrose[neutral]: Man schrubbt sich die Hände, wenn man Ruß daran hatte. Und man hat Ruß an den Händen, wenn man etwas ins Feuer gesteckt und nachgeschoben hat, bis es brannte.
inner: Sie liest Hände wie andere Leute Zeitungen.
* [direkt] Warum sagen Sie mir das? -> a
* [humor] Und was lesen Sie in meinen Händen? {penrose+1} -> b
# a
penrose[neutral]: Weil er mich eine Mörderin genannt hat, meine Liebe. Ich bin nachtragend. Es ist eine meiner wenigen Tugenden.
-> END
# b
penrose[neutral]: Ihre? Die haben diese Woche Kartoffeln geschält, einen Toten gewaschen und eine Katze getragen. Und sie haben noch nie einen Nähring getragen.
penrose[warm]: Ich lese darin, dass Sie keine Gesellschafterin sind. Aber das wussten wir ja beide. {hints:f23}

=== t3_penrose_clara
kind: topic
npc: penrose
title: Miss Clara
when: ch>=3 ch<=4 !k:d14
---
sera: Miss Clara hat Sie bei der Sitzung nicht aus den Augen gelassen.
penrose[neutral]: Miss Clara zählt Atemzüge. Sie wollte sehen, ob ich betrüge. Sie hat es nicht gesehen, und das hat sie mehr geärgert als alles andere.
penrose[neutral]: Ein kluges Mädchen. Kluge Mädchen schlafen schlecht. Aber ich habe sie nach der Sitzung nicht mehr gesehen. Ich lag im Bett und schlief. {lie:f06}
inner: „Kluge Mädchen schlafen schlecht.“ Das weiß man nicht vom Hörensagen.

=== pr_hobbes_c10
kind: present
npc: hobbes
items: c10
---
narr: Hobbes sieht das verkohlte Blatt. Seine Hand, im weißen Handschuh, macht eine kleine Bewegung, als wolle sie danach greifen und es in die Tasche stecken, wie man einem Kind ein Streichholz fortnimmt.
hobbes[neutral]: Das gehört in den Kamin, Miss.
* [direkt] Sie haben die Asche umgerührt, damit man es nicht findet. -> a
* [mitfuehlend] Sie wussten, wessen Name darauf steht. {hobbes+1} -> b
# a
hobbes[neutral]: Ich habe den Kamin versehen, wie jeden Morgen. {pause:400}
hobbes[neutral]: Es ist nicht an Miss, mir zu sagen, wie man einen Kamin versieht.
-> END
# b
narr: Er schweigt so lange, dass die Stille selbst eine Antwort wird.
hobbes[neutral]: Ich habe in diesem Haus ein Paar kleine Stiefel geputzt, als sie noch nicht bis zu meinem Knie reichten, Miss. Man vergisst nicht, wessen Stiefel man geputzt hat. {hints:f13}

=== t3_tilly_name
kind: topic
npc: tilly
title: Dein richtiger Name
when: ch>=3 f:g_teach2 !f:g_teach3
---
sera: Tilly – ist das eigentlich dein ganzer Name?
tilly[neutral]: Nee. Matilda. Matilda Crane.
tilly[neutral]: Das hat keiner mehr gesagt seit meiner Mutter. Im Arbeitshaus war ich Nummer vierzehn. Hier bin ich Tilly. „Tilly! Die Kohlen!“
narr: Sie macht Mrs. Pryces Stimme nach, erstaunlich gut, und grinst, und dann grinst sie nicht mehr.
tilly[sad]: Meine Mutter hat „Matty“ gesagt. Aber die is tot.
* [mitfuehlend] Soll ich dir zeigen, wie man Matilda schreibt? {tilly+2, +f:g_teach3} -> a
* [ehrlich] Das ist ein schöner Name. Er klingt nach jemandem, der mutig ist. {tilly+1, +f:g_teach3} -> b
# a
narr: Ein M auf der Kreidetafel des Kohlenkellers. Zwei Berge nebeneinander, sagt Sera. Tilly malt die Berge. Dann ein A, ein Dach mit einem Balken. Dann ist Mrs. Pryce an der Tür, und die Kreide verschwindet in einer Schürzentasche, als hätte es sie nie gegeben.
tilly[warm]: M wie Matilda. Und wie Mrs. Pryce. Aber das sag ich ihr nich.
-> END
# b
tilly[surprised]: Mutig? Ich?
tilly[neutral]: Ich hab Angst vor Gänsen, Miss. Und vor Mr. Hobbes. Und vor – {pause:400}
tilly[neutral]: Vor vielem.
inner: Und vor etwas Bestimmtem. Sie hat es fast gesagt.

=== s3_tilly
kind: smalltalk
npc: tilly
when: ch=3
---
tilly[neutral]: Dunning sagt, Samstag fällt’s. Dann kommt der Coroner. Und der Doktor. Und vielleicht ’n Constable.
tilly[tense]: Was macht so ’n Coroner, Miss? Fragt der alle?
inner: Sie fragt nicht aus Neugier.

=== s3_pryce
kind: smalltalk
npc: pryce
when: ch=3
---
pryce[neutral]: Die Kleider hab ich gefärbt, Ihres und das von Tilly. Blauholz und Eisen. Es färbt ab, wenn’s nass wird, also werden Sie nicht nass.
pryce[neutral]: Das Schwarz steht Ihnen besser als das Grün. Das Grün hat Miss Finch auch nicht gestanden.

=== s3_hobbes
kind: smalltalk
npc: hobbes
when: ch=3
---
hobbes[neutral]: Der Captain war heute Morgen im Stall, Miss. Im Regen. Ohne Hut.
hobbes[neutral]: Wenn Miss ihn sieht, möge Miss ihm sagen, dass Mrs. Pryce eine Brühe für ihn bereithält. Er wird es von mir nicht annehmen.

=== s3_harriet
kind: smalltalk
npc: harriet
when: ch=3 !yuumi
---
harriet[neutral]: Lesen Sie mir die Times vor, Miss Hale. Die vom Montag. Eine andere haben wir nicht.
narr: Sera liest. Ein Bericht über die Lage in Konstantinopel, Getreidepreise, eine Anzeige für Holloways Pillen. Miss Averley hört nicht zu. Aber sie mag, dass jemand liest.

=== s3_harriet_cat
kind: smalltalk
npc: harriet
when: ch>=3 yuumi
---
narr: Yuumi springt, ohne zu fragen, auf Miss Averleys Schoß, dreht sich einmal und legt sich hin, in das Schwarz der Seide, als wäre es für sie gewebt worden.
harriet[surprised]: Miss Hale. Ihr Tier.
* [neutral] Ich nehme sie sofort. -> a
* [mitfuehlend] Sie mag Sie. Man kann sie auch dort lassen. {harriet+1} -> b
# a
harriet[neutral]: Lassen Sie. {pause:500}
-> b
# b
narr: Miss Averley legt die Hand auf das graue Fell, sehr vorsichtig, wie auf etwas, das zerbrechen könnte. Yuumi schnurrt.
harriet[neutral]: Sie ist warm. Das ist alles. {harriet+1}
narr: Sie bewegt sich eine ganze Stunde lang nicht.

=== s3_lionel
kind: smalltalk
npc: lionel
when: ch=3 !f:k3_lionel_broken
---
lionel[neutral]: Tante Harriet war mit Ihnen an Mutters Grab. Sie hat mich nicht gefragt, ob ich mitwill.
lionel[tense]: Ich wäre nicht mitgekommen. Aber sie hätte fragen können.

=== s3_lionel_after
kind: smalltalk
npc: lionel
when: ch>=3 f:k3_lionel_broken
---
narr: Der Captain steht bei den Pferden, die Stirn an den Hals des Braunen gelehnt. Er hört Sera kommen und richtet sich nicht auf.
lionel[neutral]: Gehen Sie wieder rein, Miss Hale. Es regnet. Regen ist was für Pferde und Iren.
lionel[sad]: Und für Söhne, die zu spät kommen.

=== s3_penrose
kind: smalltalk
npc: penrose
when: ch=3
---
penrose[neutral]: Wissen Sie, was das Schlimmste an Wasser ist, Miss Hale? Man kann ihm nichts vorspielen. Es steigt, oder es fällt. Ganz gleich, wie überzeugend man ist.

=== s3_clara
kind: smalltalk
npc: clara
when: ch=3
---
clara[neutral]: Ich habe heute den Regen gemessen. 0,82 Zoll seit gestern früh.
clara[neutral]: Ich weiß nicht, warum ich es tue. Niemand wird es lesen.
* [mitfuehlend] Ich lese es. {clara+1} -> a
* [ehrlich] Vielleicht tun Sie es für ihn. -> b
# a
clara[neutral]: Sie lesen alles. Das ist Ihre einzige Eigenschaft, die mir gefällt.
-> END
# b
clara[neutral]: Er ist tot. Man tut nichts für Tote. Man tut es für sich.
clara[neutral]: … 0,82 Zoll.

=== s3_dunning
kind: smalltalk
npc: dunning
when: ch>=3
---
dunning[neutral]: Martha sitzt drüben im Dorf und denkt, ich bin ersoffen.
dunning[neutral]: Wenn ich heimkomm, schimpft sie. Da freu ich mich drauf.
`;
