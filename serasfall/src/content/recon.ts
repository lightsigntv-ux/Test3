import type { ReconQuestion } from '../engine/core';

// Endrekonstruktion (Kapitel 5). Reihenfolge = Reihenfolge der Nacht.
export const RECON: ReconQuestion[] = [
  {
    id: 'r1', prompt: 'Die erste Spur auf der Platte: gleichmäßiges Wachslicht, kurz vor eins die Treppe hinunter zum Arbeitszimmer – und eine halbe Stunde später wieder hinauf. Wer?',
    options: ['Clara', 'Der Captain', 'Tilly', 'Mrs. Penrose'], correct: 0, needs: ['c29', 'd14'],
    doubt: 'Wachs heißt Herrschaft. Und wer hatte mit ihm in der Dunkelkammer zu tun?',
    after: 'Clara. Sie ging zu ihrem Vater, und sie stritten. Dann ging sie hinauf – und später hinüber zu Mrs. Penrose.',
  },
  {
    id: 'r2', prompt: 'Kurz nach zwei: eine Spur quer über den Hallenboden, von der Bibliothek zur Tür des Arbeitszimmers. Wer?',
    options: ['Mr. Hobbes', 'Der Captain', 'Miss Averley', 'Clara'], correct: 1, needs: ['c29', 'd07', 'd08'],
    doubt: 'Miss Averley schlief unter Chloral. Hobbes schlief hinter der Butlerkammer. Wer saß in der Bibliothek und trank?',
    after: 'Der Captain. Er kam mit seinem Glas und wollte Geld, oder Gewissheit. Sie tranken aus zwei Gläsern und stritten.',
  },
  {
    id: 'r3', prompt: 'Wo war der Captain, als sein Vater um halb drei läutete?',
    options: ['Draußen auf der Terrasse, nach dem Streit', 'In seinem Bett', 'Beim Vater im Arbeitszimmer', 'Im Stall'], correct: 0, needs: ['d08', 's06'],
    doubt: 'Dunning hat ihn gesehen. Die Stiefel haben es gesehen.',
    after: 'Draußen, im Regen, auf der Terrasse. Er hatte das Zimmer schon verlassen.',
  },
  {
    id: 'r4', prompt: 'Um halb drei ruft die Glocke. Eine flackernde Talgspur kommt unter der Treppe hervor zur Arbeitszimmertür. Wer folgte dem Ruf?',
    options: ['Mrs. Pryce', 'Tilly', 'Mr. Hobbes', 'Niemand'], correct: 1, needs: ['d17', 's27'],
    doubt: 'Wer war wach, und wer ist gegangen? Das sind nicht dieselben.',
    after: 'Tilly. Mrs. Pryce hörte die Glocke und blieb sitzen. Das Kind ging.',
  },
  {
    id: 'r5', prompt: 'Die Talgspur läuft die Haupttreppe hinauf bis vor Claras Tür, bleibt dort stehen und kommt wieder herunter. Warum öffnete niemand?',
    options: ['Clara war bei Mrs. Penrose im Gästezimmer', 'Clara schlief zu tief', 'Clara wollte nicht öffnen'], correct: 0, needs: ['d13', 'd14'],
    doubt: 'Wo lag Claras Taschentuch?',
    after: 'Clara war bei Mrs. Penrose. Sie kam zwei Minuten zu spät zurück.',
  },
  {
    id: 'r6', prompt: 'Um 2.39 stürzt der Herr vor dem Kamin. Wer ist bei ihm, als er stirbt?',
    options: ['Niemand', 'Tilly', 'Der Captain', 'Mr. Hobbes'], correct: 1, needs: ['d05', 's27'],
    doubt: 'Wer kam die Treppe wieder herunter, zum Arbeitszimmer?',
    after: 'Tilly. Sie kniete neben ihm und hielt seine Hand. „Es ist bezahlt. Sag’s ihm.“',
  },
  {
    id: 'r7', prompt: 'Das Mädchen sitzt danach lange auf der Haupttreppe. Was hat sie bei sich?',
    options: ['Den Brief an Clara', 'Die Taschenuhr', 'Die Karaffe', 'Nichts'], correct: 0, needs: ['c30', 'd16'],
    doubt: 'Was hat Tilly drei Tage lang in ihrer Blechdose verwahrt?',
    after: 'Den Brief. Sie konnte ihn nicht abgeben, und sie konnte ihn nicht lesen.',
  },
  {
    id: 'r8', prompt: 'Nach drei: eine helle, breite, ruhige Spur die Treppe hinauf – eine Lampe, keine Kerze. Wer, und was hatte er vorher getan?',
    options: ['Der Captain – er hatte Papiere im Kamin verbrannt', 'Mr. Hobbes – er hatte die Gläser gespült', 'Miss Averley – sie hatte gebetet'], correct: 0, needs: ['d09', 's20'],
    doubt: 'Wer nahm die Lampe aus dem Arbeitszimmer mit hinauf und hörte hinter dem Vorhang ein Glöckchen?',
    after: 'Der Captain. Er fand seinen Vater tot, sah seine Schuldscheine und verbrannte, ohne zu lesen, den Beweis, dass sie bezahlt waren.',
  },
  {
    id: 'r9', prompt: 'Um Viertel nach sechs findet Hobbes den Herrn. Was tut er?',
    options: ['Er setzt ihn in den Sessel, spült die Gläser und rührt die Asche um', 'Er weckt sofort Miss Averley und rührt nichts an', 'Er holt Dunning, um Hilfe zu holen'], correct: 0, needs: ['d04', 'd07'],
    doubt: 'Warum tut Hobbes seit Mittwoch der Rücken weh?',
    after: 'Er macht aus einem Sturz einen friedlichen Tod – aus Liebe, und um den zu schützen, der mit ihm getrunken hatte.',
  },
  {
    id: 'r10', prompt: 'Was wollte der Herr in seiner letzten Nacht?',
    options: ['Clara den Weg nach London öffnen und Lionel freisprechen', 'Lionel enterben', 'Lucinda rufen', 'Das Haus verkaufen'], correct: 0, needs: ['d18'],
    doubt: 'Was stand auf seinem Schreibtisch, und was in seinem Brief?',
    after: 'Er hat alles in Ordnung gebracht. Er hat es nur niemandem rechtzeitig gesagt.',
  },
  {
    id: 'r11', prompt: 'Das Flüstern im Glas, das mich gerufen hat, war …',
    options: ['Tilly', 'Lucinda', 'die Glocke im Wasser', 'ich selbst'], correct: 0, needs: ['s27'],
    doubt: 'Wer hat genau diese Worte gesagt, in der Küche, bei einer Talgkerze?',
    after: 'Tilly. „Wenn mich doch nur einer hören tät.“',
  },
  {
    id: 'r12', prompt: 'Die blasse Frau neben ihr auf der Treppe, mit der Katze auf dem Schoß, war …',
    options: ['eine Doppelbelichtung', 'Lucinda', 'ich'], correct: 2, needs: ['c29'],
    doubt: 'Ich weiß, wer so sitzt. Ich weiß, wer eine Katze mit Handschuhen hat.',
    after: 'Ich. Ich war da. Ich habe sie gehört – ich war nur noch nicht ganz angekommen.',
  },
];
