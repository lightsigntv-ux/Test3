import type { ReconQuestion } from '../engine/core';

// Endrekonstruktion (Kapitel 5). Reihenfolge = Reihenfolge der Nacht.
export const RECON: ReconQuestion[] = [
  {
    id: 'r1', prompt: 'Die erste Spur auf der Platte: kurz vor eins die Treppe hinunter zum Arbeitszimmer. Eine halbe Stunde später wieder hinauf. Wer war das?',
    options: ['Clara', 'Der Captain', 'Tilly', 'Mrs. Penrose'], correct: 0, needs: ['c29', 'd14'],
    doubt: 'Wer hat mir selbst gesagt, dass sie um eins bei ihm war?',
    after: 'Clara. Sie ist zu ihrem Vater gegangen, und die beiden haben gestritten. Dann ist sie wieder hinauf. Und später hinüber zu Mrs. Penrose.',
  },
  {
    id: 'r2', prompt: 'Kurz nach zwei: eine Spur quer über den Hallenboden, von der Bibliothek zur Tür des Arbeitszimmers. Wer war das?',
    options: ['Mr. Hobbes', 'Der Captain', 'Miss Averley', 'Clara'], correct: 1, needs: ['c29', 'd07', 'd08'],
    doubt: 'Miss Averley hat mit Chloral geschlafen. Hobbes hat hinter der Butlerkammer geschlafen. Wer saß in der Bibliothek und hat getrunken?',
    after: 'Der Captain. Er kam mit seinem Glas und wollte Geld. Oder wissen, woran er ist. Sie haben aus zwei Gläsern getrunken und gestritten.',
  },
  {
    id: 'r3', prompt: 'Wo war der Captain, als sein Vater um halb drei läutete?',
    options: ['Draußen auf der Terrasse, nach dem Streit', 'In seinem Bett', 'Beim Vater im Arbeitszimmer', 'Im Stall'], correct: 0, needs: ['d08', 's06'],
    doubt: 'Dunning hat ihn gesehen. Und dann sind da noch die Stiefel.',
    after: 'Draußen auf der Terrasse, im Regen. Er war schon aus dem Zimmer gegangen.',
  },
  {
    id: 'r4', prompt: 'Um halb drei läutet die Glocke. Eine Spur kommt unter der Treppe hervor, aus der Dienstbotentür, und geht zur Tür des Arbeitszimmers. Wer ist gekommen?',
    options: ['Mrs. Pryce', 'Tilly', 'Mr. Hobbes', 'Niemand'], correct: 1, needs: ['d17', 's27'],
    doubt: 'Wer war wach, und wer ist wirklich gegangen? Das war nicht dieselbe Person.',
    after: 'Tilly. Mrs. Pryce hat die Glocke gehört und ist sitzen geblieben. Das Kind ist gegangen.',
  },
  {
    id: 'r5', prompt: 'Die Spur läuft die Haupttreppe hinauf bis vor Claras Tür. Dort ist der helle Fleck, wo das Licht lange stand. Dann geht sie wieder herunter. Warum hat niemand aufgemacht?',
    options: ['Clara war bei Mrs. Penrose im Gästezimmer', 'Clara schlief zu tief', 'Clara wollte nicht öffnen'], correct: 0, needs: ['d13', 'd14'],
    doubt: 'Wo lag Claras Taschentuch?',
    after: 'Clara war bei Mrs. Penrose. Sie ist zwei Minuten zu spät zurückgekommen.',
  },
  {
    id: 'r6', prompt: 'Um 2.39 stürzt der Herr vor dem Kamin. Wer ist bei ihm, als er stirbt?',
    options: ['Niemand', 'Tilly', 'Der Captain', 'Mr. Hobbes'], correct: 1, needs: ['d05', 's27'],
    doubt: 'Wer ist die Treppe wieder heruntergekommen, zurück zum Arbeitszimmer?',
    after: 'Tilly. Sie hat neben ihm gekniet und seine Hand gehalten. „Es ist bezahlt. Sag’s ihm.“',
  },
  {
    id: 'r7', prompt: 'Danach sitzt das Mädchen lange auf der Haupttreppe. Was hat sie bei sich?',
    options: ['Den Brief an Clara', 'Die Taschenuhr', 'Die Karaffe', 'Nichts'], correct: 0, needs: ['c30', 'd16'],
    doubt: 'Was hat Tilly drei Tage lang in ihrer Blechdose verwahrt?',
    after: 'Den Brief. Sie konnte ihn nicht abgeben, und lesen konnte sie ihn auch nicht.',
  },
  {
    id: 'r8', prompt: 'Nach drei: eine helle, breite, gleichmäßige Spur die Treppe hinauf. Das ist eine Lampe, keine Kerze. Wer war das, und was hat er vorher getan?',
    options: ['Der Captain. Er hatte Papiere im Kamin verbrannt.', 'Mr. Hobbes. Er hatte die Gläser gespült.', 'Miss Averley. Sie hatte gebetet.'], correct: 0, needs: ['d09', 's20'],
    doubt: 'Wer hat die Lampe aus dem Arbeitszimmer mit hinaufgenommen und hinter dem Vorhang ein Glöckchen gehört?',
    after: 'Der Captain. Er hat seinen Vater tot gefunden und seine Schuldscheine gesehen. Ohne richtig zu lesen, hat er den Beweis verbrannt, dass sie bezahlt waren.',
  },
  {
    id: 'r9', prompt: 'Um Viertel nach sechs findet Hobbes den Herrn. Was macht er?',
    options: ['Er setzt ihn in den Sessel, spült die Gläser und rührt die Asche um', 'Er weckt sofort Miss Averley und rührt nichts an', 'Er holt Dunning, um Hilfe zu holen'], correct: 0, needs: ['d04', 'd07'],
    doubt: 'Warum tut Hobbes seit Mittwoch eigentlich der Rücken weh?',
    after: 'Er lässt es so aussehen, als wäre der Herr friedlich im Sessel gestorben. Aus Treue zu ihm, und um den zu schützen, der mit ihm getrunken hatte.',
  },
  {
    id: 'r10', prompt: 'Was wollte der Herr in seiner letzten Nacht?',
    options: ['Clara den Weg nach London öffnen und Lionel freisprechen', 'Lionel enterben', 'Lucinda rufen', 'Das Haus verkaufen'], correct: 0, needs: ['d18'],
    doubt: 'Was lag auf seinem Schreibtisch, und was stand in seinem Brief?',
    after: 'Er hat alles in Ordnung gebracht. Er hat es nur niemandem rechtzeitig gesagt.',
  },
  {
    id: 'r11', prompt: 'Das Flüstern im Glas, das mich gerufen hat, war …',
    options: ['Tilly', 'Lucinda', 'die Glocke im Wasser', 'ich selbst'], correct: 0, needs: ['s27'],
    doubt: 'Wer hat genau diese Worte gesagt? In der Küche, bei einer Talgkerze?',
    after: 'Tilly. „Wenn mich doch nur einer hören tät.“',
  },
  {
    id: 'r12', prompt: 'Die blasse Frau neben ihr auf der Treppe, mit der Katze auf dem Schoß, war …',
    options: ['eine Doppelbelichtung', 'Lucinda', 'ich'], correct: 2, needs: ['c29'],
    doubt: 'Ich kenne doch jemanden mit hellem Haar und einer kleinen grauen Katze.',
    after: 'Ich. Ich war da und habe sie gehört. Ich war nur noch nicht ganz angekommen.',
  },
];
