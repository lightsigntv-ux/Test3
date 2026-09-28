import type { Chapter } from '../engine/types';

export const CHAPTERS: Chapter[] = [
  {
    n: 0, title: 'Das Glas', day: 'Gegenwart, ein Dienstagabend im November',
    intro: ['Regen, ein Karton, eine Katze.', 'Und eine Kiste mit altem Glas, das jemand vor langer Zeit belichtet hat.'],
    start: { loc: 'wohnung', x: 0.3, time: 'abend' }, endScene: 'p_glass',
  },
  {
    n: 1, title: 'Die Miss, die aus dem Wasser kam', day: 'Mittwoch, 14. November 1877',
    intro: [
      'Die Levels sind über Nacht ein Meer geworden.',
      'Wo gestern Weiden standen, ragen nur noch ihre Köpfe aus dem grauen Wasser. Der Damm nach Middlemoor liegt irgendwo darunter.',
      'Averley Hall steht auf seiner kleinen Anhöhe wie ein Schiff, das vergessen hat, abzulegen.',
    ],
    start: { loc: 'halle', x: 0.58, time: 'morgen' }, endScene: 'k1_quiet',
  },
  {
    n: 2, title: 'Aufgebahrt', day: 'Mittwoch, 14. November, Nachmittag',
    intro: [
      'Im Zimmer des Herrn sind die Vorhänge geschlossen.',
      'Auf dem Nachttisch brennen zwei Kerzen, obwohl draußen noch Tag ist – oder das, was der Regen davon übrig lässt.',
    ],
    start: { loc: 'toten', x: 0.25, time: 'nachmittag' }, endScene: 'k2_night_room',
  },
  {
    n: 3, title: 'Die Glocke im Wasser', day: 'Donnerstag, 15. November',
    intro: [
      'Nebel liegt auf dem Wasser, so dicht, dass die Kopfweiden aussehen wie Menschen, die im Moor stehen und warten.',
      'Irgendwo schlägt eine Stalluhr die Viertelstunden, als wolle sie beweisen, dass die Zeit hier nicht stehengeblieben ist.',
    ],
    start: { loc: 'kammer', x: 0.5, time: 'morgen' }, endScene: 'k3_end',
  },
  {
    n: 4, title: 'Die Platte', day: 'Donnerstag, kurz vor Mitternacht',
    intro: [
      'In der Dunkelkammer gibt es nur ein Licht, und es ist rot.',
      'Es macht alle Hände gleich und alle Gesichter fremd.',
    ],
    start: { loc: 'dunkel', x: 0.3, time: 'nacht' }, endScene: 'k4_window',
  },
  {
    n: 5, title: 'Vor dem Morgen', day: 'Samstag, 17. November, zwei Uhr früh',
    intro: [
      'Der Regen hat aufgehört. Zum ersten Mal seit Tagen hört man, wie still das Haus ist.',
      'Niemand schläft.',
    ],
    start: { loc: 'halle', x: 0.25, time: 'nacht' }, endScene: 'k5_dawn',
  },
  {
    n: 6, title: 'Epilog', day: '',
    intro: [],
    start: { loc: 'wohnung', x: 0.5, time: 'abend' }, endScene: 'ep_home',
  },
];
