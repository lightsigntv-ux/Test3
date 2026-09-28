import type { Location } from '../engine/types';
import { parseCond as c } from '../engine/script';

const F: [number, number] = [0.74, 0.93];

export const LOCATIONS: Location[] = [
  {
    id: 'wohnung', name: 'Seras Wohnung', floorY: [0.76, 0.92], xRange: [0.12, 0.88], catAllowed: false, ambience: ['rainModern', 'fridge'],
    hotspots: [
      { id: 'h_w_kiste', label: 'Kiste mit Glasplatten', x: 0.52, y: 0.62, r: 0.1, kind: 'examine' },
      { id: 'h_w_lampe', label: 'Schreibtischlampe', x: 0.64, y: 0.5, r: 0.08, kind: 'examine' },
      { id: 'h_w_fenster', label: 'Fenster', x: 0.22, y: 0.42, r: 0.1, kind: 'examine' },
      { id: 'h_w_handy', label: 'Handy', x: 0.82, y: 0.7, r: 0.08, kind: 'examine' },
    ],
  },
  { id: 'zwischen', name: '…', floorY: F, xRange: [0.1, 0.9], catAllowed: false, ambience: ['under'], hotspots: [] },
  {
    id: 'halle', name: 'Treppenhalle', floorY: F, xRange: [0.05, 0.95], catAllowed: true, ambience: ['rain', 'hallClock'],
    hotspots: [
      { id: 'x_halle_salon', label: 'Salon', x: 0.035, y: 0.6, r: 0.06, kind: 'exit', to: 'salon', arriveX: 0.9 },
      { id: 'x_halle_dienst', label: 'Dienstbotentür', x: 0.36, y: 0.7, r: 0.05, kind: 'exit', to: 'dienst', arriveX: 0.12 },
      { id: 'x_halle_galerie', label: 'Treppe hinauf', x: 0.5, y: 0.55, r: 0.06, kind: 'exit', to: 'galerie', arriveX: 0.5 },
      { id: 'x_halle_arbeit', label: 'Arbeitszimmer', x: 0.8, y: 0.62, r: 0.06, kind: 'exit', to: 'arbeit', arriveX: 0.1 },
      { id: 'x_halle_biblio', label: 'Bibliothek', x: 0.95, y: 0.62, r: 0.05, kind: 'exit', to: 'biblio', arriveX: 0.1 },
      { id: 'h_fenstersitz', label: 'Fenstersitz', x: 0.58, y: 0.36, r: 0.07, kind: 'examine' },
      { id: 'h_kamera', label: 'Verhängtes Gerät', x: 0.24, y: 0.66, r: 0.07, kind: 'examine' },
      { id: 'h_standuhr', label: 'Standuhr', x: 0.68, y: 0.55, r: 0.05, kind: 'examine' },
      { id: 'h_treppe', label: 'Stufen', x: 0.46, y: 0.72, r: 0.06, kind: 'examine' },
      { id: 'h_portrait', label: 'Porträt', x: 0.3, y: 0.34, r: 0.06, kind: 'examine' },
      { id: 'h_haustuer', label: 'Haustür', x: 0.13, y: 0.58, r: 0.05, kind: 'examine' },
    ],
  },
  {
    id: 'salon', name: 'Salon', floorY: F, xRange: [0.06, 0.94], catAllowed: true, ambience: ['rain', 'fire', 'mantelClock'],
    hotspots: [
      { id: 'x_salon_halle', label: 'Halle', x: 0.94, y: 0.62, r: 0.06, kind: 'exit', to: 'halle', arriveX: 0.1 },
      { id: 'x_salon_gewaechs', label: 'Gewächshaus', x: 0.06, y: 0.62, r: 0.06, kind: 'exit', to: 'gewaechs', arriveX: 0.88 },
      { id: 'h_s_spiegel', label: 'Spiegel', x: 0.5, y: 0.35, r: 0.07, kind: 'examine' },
      { id: 'h_s_kassette', label: 'Schreibkassette', x: 0.3, y: 0.6, r: 0.06, kind: 'examine' },
      { id: 'h_s_fenster', label: 'Fenster', x: 0.74, y: 0.42, r: 0.08, kind: 'examine' },
      { id: 'h_s_klavier', label: 'Klavier', x: 0.16, y: 0.6, r: 0.06, kind: 'examine' },
      { id: 'h_s_kamin', label: 'Kamin', x: 0.5, y: 0.66, r: 0.06, kind: 'examine' },
      { id: 'h_s_klavieroben', label: 'Auf dem Klavier', x: 0.16, y: 0.46, r: 0.05, kind: 'cat', catOnly: true },
    ],
  },
  {
    id: 'arbeit', name: 'Arbeitszimmer', floorY: F, xRange: [0.06, 0.94], catAllowed: true, ambience: ['rain', 'mantelClockStopped'],
    hotspots: [
      { id: 'x_arbeit_halle', label: 'Halle', x: 0.05, y: 0.62, r: 0.06, kind: 'exit', to: 'halle', arriveX: 0.78 },
      { id: 'x_arbeit_dunkel', label: 'Dunkelkammer', x: 0.9, y: 0.62, r: 0.05, kind: 'exit', to: 'dunkel', arriveX: 0.2, when: c('f:g_dunkel_open') },
      { id: 'h_a_dunkeltuer', label: 'Tür zur Dunkelkammer', x: 0.9, y: 0.62, r: 0.05, kind: 'examine', when: c('!f:g_dunkel_open') },
      { id: 'h_a_klingelzug', label: 'Klingelzug', x: 0.36, y: 0.45, r: 0.05, kind: 'examine' },
      { id: 'h_a_kamin', label: 'Kamin', x: 0.44, y: 0.66, r: 0.06, kind: 'examine' },
      { id: 'h_a_buecherschrank', label: 'Bücherschrank', x: 0.22, y: 0.5, r: 0.07, kind: 'examine' },
      { id: 'h_a_unterschrank', label: 'Unter dem Schrank', x: 0.22, y: 0.86, r: 0.06, kind: 'cat', catOnly: true },
      { id: 'h_a_schrankoben', label: 'Oben auf dem Schrank', x: 0.22, y: 0.2, r: 0.06, kind: 'cat', catOnly: true },
      { id: 'h_a_tantalus', label: 'Tantalus', x: 0.56, y: 0.6, r: 0.05, kind: 'examine' },
      { id: 'h_a_schreibtisch', label: 'Schreibtisch', x: 0.7, y: 0.64, r: 0.07, kind: 'examine' },
      { id: 'h_a_sessel', label: 'Lehnsessel', x: 0.55, y: 0.72, r: 0.06, kind: 'examine' },
      { id: 'h_a_terrassentuer', label: 'Terrassentür', x: 0.82, y: 0.52, r: 0.06, kind: 'examine' },
    ],
  },
  {
    id: 'dunkel', name: 'Dunkelkammer', floorY: [0.76, 0.92], xRange: [0.12, 0.88], catAllowed: false, ambience: ['drip'],
    hotspots: [
      { id: 'x_dunkel_arbeit', label: 'Arbeitszimmer', x: 0.12, y: 0.62, r: 0.06, kind: 'exit', to: 'arbeit', arriveX: 0.84 },
      { id: 'h_d_flasche', label: 'Braune Flasche', x: 0.62, y: 0.55, r: 0.05, kind: 'examine' },
      { id: 'h_d_wannen', label: 'Schalen', x: 0.46, y: 0.62, r: 0.07, kind: 'examine' },
      { id: 'h_d_platten', label: 'Plattenkästen', x: 0.8, y: 0.5, r: 0.06, kind: 'examine' },
      { id: 'h_d_lampe', label: 'Rote Lampe', x: 0.34, y: 0.38, r: 0.05, kind: 'examine' },
    ],
  },
  {
    id: 'biblio', name: 'Bibliothek', floorY: F, xRange: [0.06, 0.94], catAllowed: true, ambience: ['rain', 'fire'],
    hotspots: [
      { id: 'x_biblio_halle', label: 'Halle', x: 0.05, y: 0.62, r: 0.06, kind: 'exit', to: 'halle', arriveX: 0.9 },
      { id: 'h_b_tisch', label: 'Runder Tisch', x: 0.5, y: 0.68, r: 0.08, kind: 'examine' },
      { id: 'h_b_regal', label: 'Bücherwand', x: 0.8, y: 0.4, r: 0.08, kind: 'examine' },
      { id: 'h_b_kamin', label: 'Kamin', x: 0.25, y: 0.62, r: 0.06, kind: 'examine' },
      { id: 'h_b_sims', label: 'Kaminsims', x: 0.25, y: 0.38, r: 0.05, kind: 'cat', catOnly: true },
    ],
  },
  {
    id: 'dienst', name: 'Dienstbotentrakt', floorY: F, xRange: [0.06, 0.94], catAllowed: true, ambience: ['rain', 'kitchenFire', 'kettle'],
    hotspots: [
      { id: 'x_dienst_halle', label: 'Halle', x: 0.06, y: 0.62, r: 0.05, kind: 'exit', to: 'halle', arriveX: 0.38 },
      { id: 'x_dienst_galerie', label: 'Hintertreppe', x: 0.2, y: 0.55, r: 0.05, kind: 'exit', to: 'galerie', arriveX: 0.9 },
      { id: 'x_dienst_stall', label: 'Hoftür', x: 0.95, y: 0.62, r: 0.05, kind: 'exit', to: 'stall', arriveX: 0.1, when: c('ch>=3') },
      { id: 'h_k_hoftuer', label: 'Hoftür', x: 0.95, y: 0.62, r: 0.05, kind: 'examine', when: c('ch<=2') },
      { id: 'h_k_klingelkasten', label: 'Klingelkasten', x: 0.32, y: 0.3, r: 0.06, kind: 'examine' },
      { id: 'h_k_herd', label: 'Herd', x: 0.6, y: 0.6, r: 0.07, kind: 'examine' },
      { id: 'h_k_tisch', label: 'Küchentisch', x: 0.46, y: 0.72, r: 0.07, kind: 'examine' },
      { id: 'h_k_bord', label: 'Kerzenbord', x: 0.72, y: 0.42, r: 0.05, kind: 'examine' },
      { id: 'h_k_butler', label: 'Butlerkammer', x: 0.84, y: 0.58, r: 0.05, kind: 'examine' },
      { id: 'h_k_stiefel', label: 'Stiefelkammer', x: 0.14, y: 0.66, r: 0.04, kind: 'examine' },
      { id: 'h_k_pryce', label: 'Zimmer der Haushälterin', x: 0.28, y: 0.62, r: 0.04, kind: 'examine' },
      { id: 'h_k_butlertuer', label: 'An der Tür lauschen', x: 0.84, y: 0.86, r: 0.05, kind: 'cat', catOnly: true },
    ],
  },
  {
    id: 'galerie', name: 'Galerie', floorY: F, xRange: [0.05, 0.95], catAllowed: true, ambience: ['rainFar', 'hallClockFar'],
    hotspots: [
      { id: 'x_galerie_halle', label: 'Treppe hinab', x: 0.5, y: 0.7, r: 0.06, kind: 'exit', to: 'halle', arriveX: 0.52 },
      { id: 'x_galerie_dienst', label: 'Hintertreppe', x: 0.965, y: 0.6, r: 0.04, kind: 'exit', to: 'dienst', arriveX: 0.22 },
      { id: 'x_galerie_kammer', label: 'Ihre Kammer', x: 0.06, y: 0.6, r: 0.05, kind: 'exit', to: 'kammer', arriveX: 0.85 },
      { id: 'x_galerie_toten', label: 'Zimmer des Herrn', x: 0.82, y: 0.58, r: 0.05, kind: 'exit', to: 'toten', arriveX: 0.2, when: c('ch>=2') },
      { id: 'h_g_totentuer', label: 'Zimmer des Herrn', x: 0.82, y: 0.58, r: 0.05, kind: 'examine', when: c('ch<=1') },
      { id: 'h_g_clara', label: 'Eine Tür', labelWhen: [[c('seen:k1_quiet'), 'Miss Claras Tür']], x: 0.66, y: 0.58, r: 0.05, kind: 'examine' },
      { id: 'h_g_harriet', label: 'Eine Tür', labelWhen: [[c('ch>=2'), 'Miss Averleys Tür']], x: 0.2, y: 0.58, r: 0.05, kind: 'examine' },
      { id: 'h_g_lionel', label: 'Eine Tür', labelWhen: [[c('ch>=2'), 'Tür des Captains']], x: 0.33, y: 0.58, r: 0.05, kind: 'examine' },
      { id: 'h_g_gast', label: 'Gästezimmer', x: 0.895, y: 0.58, r: 0.04, kind: 'examine' },
      { id: 'h_g_gelaender', label: 'Geländer', x: 0.5, y: 0.8, r: 0.05, kind: 'examine' },
      { id: 'h_g_gastspalt', label: 'Spalt unter der Tür', x: 0.895, y: 0.88, r: 0.04, kind: 'cat', catOnly: true },
      { id: 'h_g_harriettuer', label: 'An der Tür lauschen', x: 0.2, y: 0.88, r: 0.04, kind: 'cat', catOnly: true },
    ],
  },
  {
    id: 'toten', name: 'Zimmer des Herrn', floorY: [0.76, 0.92], xRange: [0.1, 0.9], catAllowed: true, ambience: ['rainFar', 'candles'],
    hotspots: [
      { id: 'x_toten_galerie', label: 'Galerie', x: 0.1, y: 0.62, r: 0.06, kind: 'exit', to: 'galerie', arriveX: 0.8 },
      { id: 'h_t_bett', label: 'Das Bett', x: 0.56, y: 0.6, r: 0.1, kind: 'examine' },
      { id: 'h_t_kerzen', label: 'Kerzen', x: 0.78, y: 0.5, r: 0.05, kind: 'examine' },
      { id: 'h_t_fenster', label: 'Fenster', x: 0.3, y: 0.4, r: 0.06, kind: 'examine' },
    ],
  },
  {
    id: 'kammer', name: 'Ihre Kammer', floorY: [0.76, 0.92], xRange: [0.12, 0.88], catAllowed: true, ambience: ['rainClose'],
    hotspots: [
      { id: 'x_kammer_galerie', label: 'Galerie', x: 0.88, y: 0.62, r: 0.06, kind: 'exit', to: 'galerie', arriveX: 0.1 },
      { id: 'h_ka_fenster', label: 'Fenster', x: 0.4, y: 0.4, r: 0.08, kind: 'examine' },
      { id: 'h_ka_bett', label: 'Bett', x: 0.64, y: 0.66, r: 0.08, kind: 'examine' },
      { id: 'h_ka_truhe', label: 'Truhe', x: 0.2, y: 0.7, r: 0.06, kind: 'examine' },
      { id: 'h_ka_spiegel', label: 'Spiegel', x: 0.8, y: 0.42, r: 0.05, kind: 'examine' },
    ],
  },
  {
    id: 'gewaechs', name: 'Gewächshaus', floorY: F, xRange: [0.08, 0.92], catAllowed: true, ambience: ['rainGlass'],
    hotspots: [
      { id: 'x_gewaechs_salon', label: 'Salon', x: 0.92, y: 0.62, r: 0.06, kind: 'exit', to: 'salon', arriveX: 0.1 },
      { id: 'h_gw_zitronen', label: 'Zitronenbäumchen', x: 0.3, y: 0.5, r: 0.07, kind: 'examine' },
      { id: 'h_gw_bank', label: 'Bank', x: 0.55, y: 0.72, r: 0.07, kind: 'examine' },
      { id: 'h_gw_glas', label: 'Glasdach', x: 0.5, y: 0.15, r: 0.1, kind: 'examine' },
    ],
  },
  {
    id: 'stall', name: 'Stallhof', floorY: F, xRange: [0.06, 0.94], catAllowed: true, ambience: ['rainOpen', 'horses', 'water'],
    hotspots: [
      { id: 'x_stall_dienst', label: 'Hoftür', x: 0.06, y: 0.62, r: 0.05, kind: 'exit', to: 'dienst', arriveX: 0.9 },
      { id: 'h_st_boot', label: 'Boot', x: 0.8, y: 0.72, r: 0.07, kind: 'examine' },
      { id: 'h_st_pferde', label: 'Pferde', x: 0.36, y: 0.55, r: 0.07, kind: 'examine' },
      { id: 'h_st_uhr', label: 'Stalluhr', x: 0.5, y: 0.22, r: 0.05, kind: 'examine' },
      { id: 'h_st_wasser', label: 'Das Wasser', x: 0.9, y: 0.7, r: 0.06, kind: 'examine' },
      { id: 'h_st_terrasse', label: 'Blick zur Terrasse', x: 0.18, y: 0.45, r: 0.06, kind: 'examine' },
      { id: 'h_st_heuboden', label: 'Heuboden', x: 0.26, y: 0.26, r: 0.05, kind: 'cat', catOnly: true },
    ],
  },
  {
    id: 'kapelle', name: 'Kapelle auf dem Hügel', floorY: F, xRange: [0.08, 0.92], catAllowed: false, ambience: ['wind', 'water'],
    hotspots: [
      { id: 'x_kapelle_boot', label: 'Zurück zum Boot', x: 0.9, y: 0.7, r: 0.06, kind: 'exit', to: 'stall', arriveX: 0.72, when: c('f:k3_chapel_done') },
      { id: 'h_kp_grab', label: 'Grab', x: 0.4, y: 0.72, r: 0.07, kind: 'examine' },
      { id: 'h_kp_glocke', label: 'Glockenstuhl', x: 0.62, y: 0.2, r: 0.07, kind: 'examine' },
      { id: 'h_kp_wasser', label: 'Das Moor', x: 0.76, y: 0.6, r: 0.08, kind: 'examine' },
    ],
  },
  { id: 'london', name: 'Henrietta Street, London', floorY: [0.76, 0.92], xRange: [0.15, 0.85], catAllowed: false, ambience: ['cityWinter', 'fire'], hotspots: [] },
];

export const LOC_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l])) as Record<string, Location>;
