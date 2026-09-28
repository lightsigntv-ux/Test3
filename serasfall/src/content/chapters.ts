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
      'Über Nacht waren die Levels zu einem Meer geworden.',
      'Wo gestern Weiden standen, ragten nur noch ihre Köpfe aus dem grauen Wasser. Der Damm nach Middlemoor lag irgendwo darunter.',
      'Averley Hall stand auf seiner kleinen Anhöhe, das einzige Feste weit und breit.',
    ],
    start: { loc: 'halle', x: 0.58, time: 'morgen' }, endScene: 'k1_quiet',
  },
  {
    n: 2, title: 'Aufgebahrt', day: 'Mittwoch, 14. November, Nachmittag',
    intro: [
      'Im Zimmer des Herrn waren die Vorhänge geschlossen.',
      'Auf dem Nachttisch brannten zwei Kerzen, obwohl draußen noch Tag war – oder das, was der Regen davon übrig ließ.',
    ],
    start: { loc: 'toten', x: 0.25, time: 'nachmittag' }, endScene: 'k2_night_room',
  },
  {
    n: 3, title: 'Die Glocke im Wasser', day: 'Donnerstag, 15. November',
    intro: [
      'Nebel lag auf dem Wasser, so dicht, dass die Kopfweiden aussahen wie Menschen, die im Moor stehen und warten.',
      'Irgendwo schlug eine Stalluhr die Viertelstunden. Die Zeit war hier nicht stehengeblieben.',
    ],
    start: { loc: 'kammer', x: 0.5, time: 'morgen' }, endScene: 'k3_end',
  },
  {
    n: 4, title: 'Die Platte', day: 'Donnerstag, kurz vor Mitternacht',
    intro: [
      'In der Dunkelkammer gab es nur ein Licht, und es war rot.',
      'Es machte alle Hände gleich und alle Gesichter fremd.',
    ],
    start: { loc: 'dunkel', x: 0.3, time: 'nacht' }, endScene: 'k4_window',
  },
  {
    n: 5, title: 'Vor dem Morgen', day: 'Samstag, 17. November, zwei Uhr früh',
    intro: [
      'Der Regen hatte aufgehört. Zum ersten Mal seit Tagen hörte man, wie still das Haus war.',
      'Niemand schlief.',
    ],
    start: { loc: 'halle', x: 0.25, time: 'nacht' }, endScene: 'k5_dawn',
  },
  {
    n: 6, title: 'Epilog', day: '',
    intro: [],
    start: { loc: 'wohnung', x: 0.5, time: 'abend' }, endScene: 'ep_home',
  },
];
