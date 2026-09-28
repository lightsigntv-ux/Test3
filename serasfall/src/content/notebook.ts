// Notizbuch: Personen, Orte, Zeitleiste – in Seras Handschrift. Einträge erscheinen, sobald Sera sie kennt.
import type { Cond, NpcId } from '../engine/types';
import { parseCond as c } from '../engine/script';

export interface Note { cond?: Cond; text: string }

export const PERSON_NOTES: Record<NpcId, { title: string; met: Cond; notes: Note[] }> = {
  tilly: {
    title: 'Tilly – Küchenmädchen', met: c('ch>=1'),
    notes: [
      { text: 'Hat mich gefunden. Haube zu groß, Hände rot, Sommersprossen. Hat mir ein Kleid besorgt, ohne zu fragen.' },
      { cond: c('seen:k1_kitchen'), text: 'Aus dem Arbeitshaus in Bridgwater. Mrs. Pryce hat sie hergeholt.' },
      { cond: c('seen:t1_tilly_letters'), text: 'Kann nicht lesen. Ritzt heimlich ihren Namen in die Tischkante.' },
      { cond: c('k:c28'), text: 'Ihre Kerze war am Mittwochmorgen fast heruntergebrannt.' },
      { cond: c('f:k4_found'), text: 'Ist für Yuumi barfuß auf den Heuboden geklettert. Im Gewitter.' },
      { cond: c('f:g_tilly_spoke'), text: 'Sie war bei ihm. Sie hat seine Hand gehalten. Ich habe sie gehört.' },
    ],
  },
  harriet: {
    title: 'Miss Harriet Averley – Schwester des Toten', met: c('seen:k1_harriet'),
    notes: [
      { text: 'Schwarz, gerade, Befehle statt Gefühle. Hält mich für Miss Hale.' },
      { cond: c('seen:k1_mini_deliver'), text: 'Hat die Miniatur der Schwägerin lange angesehen. Lucinda, gestorben 1861.' },
      { cond: c('k:s16'), text: 'Nimmt abends Schlaftropfen. Sagt, sie habe nichts gehört.' },
      { cond: c('seen:k3_chapel'), text: 'War verlobt. Henry Ashby, gefallen bei Inkerman.' },
      { cond: c('k:d12'), text: 'Wusste, dass er sterben würde. Hat es geschworen, nicht zu sagen.' },
      { cond: c('f:g_harriet_frees'), text: 'Wollte 1854 nach Skutari. Durfte nicht. Lässt Clara gehen.' },
    ],
  },
  hobbes: {
    title: 'Mr. Hobbes – Butler', met: c('seen:k1_harriet'),
    notes: [
      { text: 'Seit 1828 im Haus. „Friedlich entschlafen.“ Sagt es jedes Mal gleich.' },
      { cond: c('k:c09'), text: 'Seit Mittwochfrüh ein steifer Rücken.' },
      { cond: c('seen:t2_hobbes_newton'), text: 'Hat den Kater des Herrn begraben. Der Herr hielt die Laterne.' },
      { cond: c('k:d04'), text: 'Hat ihn nicht im Sessel gefunden.' },
      { cond: c('f:g_hobbes_stands'), text: 'Hat „Tilly“ gesagt. Nicht „das Küchenmädchen“.' },
    ],
  },
  pryce: {
    title: 'Mrs. Pryce – Haushälterin', met: c('seen:k1_kitchen'),
    notes: [
      { text: 'Schlüssel an der Hüfte, Mehl am Ärmel. Merkt alles, sagt wenig.' },
      { cond: c('k:s02'), text: 'Sagt, in der Nacht habe keine Glocke geläutet.' },
      { cond: c('seen:t2_pryce_song'), text: 'Aus Monmouthshire. Ihr Sohn Owen ist in Kanada.' },
      { cond: c('k:d17'), text: 'War um zwei Uhr wach. Hat die Glocke gehört.' },
      { cond: c('f:g_pryce_confessed'), text: 'Hat es Tilly selbst gesagt.' },
    ],
  },
  lionel: {
    title: 'Captain Lionel Averley – Sohn und Erbe', met: c('seen:k1_library'),
    notes: [
      { text: 'Husar auf Halbsold. Trinkt vor zehn. Beschuldigt das Medium.' },
      { cond: c('k:s03'), text: 'Sagt, er habe ab Mitternacht geschlafen.' },
      { cond: c('seen:t_yuumi_colonel'), text: 'Hatte im Regiment eine Katze. Mrs. Colonel.' },
      { cond: c('k:d08'), text: 'War nachts auf der Terrasse. Im Regen.' },
      { cond: c('f:g_lionel_told_paid'), text: 'Weiß jetzt, dass sein Vater bezahlt hat.' },
      { cond: c('f:g_lionel_confessed'), text: 'Wird dem Coroner alles sagen.' },
      { cond: c('f:g_lionel_silent'), text: 'Wird bezahlen. Aber nicht sprechen. Wie sein Vater.' },
    ],
  },
  penrose: {
    title: 'Mrs. Eliza Penrose – Medium aus Bath', met: c('seen:k1_library'),
    notes: [
      { text: '„Wir sind uns schon begegnet. Heute Nacht.“ Graue Augen, sehr wach.' },
      { cond: c('seen:t2_penrose_how'), text: '„Man hört zu. Das ist alles.“' },
      { cond: c('k:d15'), text: 'Der Herr war im August bei ihr. Die Botschaft war seine eigene.' },
      { cond: c('k:s30'), text: 'Hat in der Nacht auf der Treppe ein Mädchen gesehen. Und mich.' },
    ],
  },
  clara: {
    title: 'Miss Clara Averley – Tochter', met: c('seen:k1_quiet'),
    notes: [
      { text: 'Schwarze Fingerspitzen. Silbernitrat, nicht Tinte.' },
      { cond: c('seen:k2_dark'), text: 'Fotografiert. Kennt Chemie. Will Medizin studieren.' },
      { cond: c('seen:k2_vigil'), text: 'Hat in der Totenwache geweint. Wegen Yuumi.' },
      { cond: c('k:d14'), text: 'War nachts bei Mrs. Penrose.' },
      { cond: c('f:g_letter_read'), text: 'Hat den Brief. „Wähle, Clara.“' },
    ],
  },
  dunning: {
    title: 'Nat Dunning – Kutscher', met: c('seen:k3_dunning'),
    notes: [
      { text: 'Ölzeug, kalte Pfeife. Redet über Pferde, nicht über die Herrschaft.' },
      { cond: c('k:s14'), text: 'In der Nacht kam kein Boot. Er weiß, dass ich nicht übers Wasser kam.' },
      { cond: c('k:s06'), text: 'Hat den Captain auf der Terrasse gesehen.' },
    ],
  },
};

export const PLACE_NOTES: Record<string, string> = {
  wohnung: 'Meine Wohnung. Heizung, Regen, ein Karton.',
  halle: 'Treppenhalle. Standuhr steht. Ein verhängter Kasten auf drei Beinen.',
  salon: 'Salon. Miss Averleys Reich. Spiegel verhängt.',
  arbeit: 'Arbeitszimmer des Herrn. Bücher, Kamin, Klingelzug, eine Tür zum Garten.',
  dunkel: 'Dunkelkammer. Rotes Licht, Flaschen, Glas.',
  biblio: 'Bibliothek. Der runde Tisch der Séance.',
  dienst: 'Küche und Dienstbotentrakt. Der einzige warme Ort.',
  galerie: 'Galerie oben. Alle Türen der Familie.',
  toten: 'Das Zimmer des Herrn. Jetzt sein Totenzimmer.',
  kammer: 'Meine Kammer. Klein, kalt, ein Fenster aufs Moor.',
  gewaechs: 'Gewächshaus. Zitronen im November.',
  stall: 'Stallhof. Dahinter nur Wasser.',
  kapelle: 'Kapelle auf dem Hügel. Lucindas Grab.',
};

export const TIMELINE: { time: string; text: string; cond: Cond }[] = [
  { time: 'Aug.', text: 'Der Herr in Bath: Arzt und Medium.', cond: c('anyk:c14,d15') },
  { time: '8. Nov.', text: 'Schulden des Captains angewiesen.', cond: c('k:c15') },
  { time: 'Di 19.30', text: 'Dinner. Er will am Morgen etwas bezeugen lassen.', cond: c('k:s11') },
  { time: 'Di 22.35', text: 'Séance. „Hörst du die Glocke im Wasser, Edmund?“', cond: c('seen:t1_penrose_seance') },
  { time: 'Di 23.00', text: 'Miss Averley nimmt ihre Tropfen.', cond: c('k:c21') },
  { time: 'Di 23.30', text: '„Lass es stehen, Hobbes. Bis zum Morgen.“', cond: c('k:s10') },
  { time: '5 vor 12', text: 'Deckel ab. Die Kamera belichtet.', cond: c('k:c13') },
  { time: 'um 1', text: 'Clara bei ihm. Streit.', cond: c('k:s33') },
  { time: '~2', text: 'Clara bei Mrs. Penrose.', cond: c('k:d14') },
  { time: '~2', text: 'Mrs. Pryce schreibt an Owen.', cond: c('k:c27') },
  { time: 'nach 2', text: 'Jemand trinkt mit ihm. Zwei Gläser.', cond: c('k:d07') },
  { time: 'nach 2', text: 'Der Captain bei ihm. Streit.', cond: c('anyk:s31,s40') },
  { time: '~2.30', text: 'Die Glocke vom Arbeitszimmer läutet.', cond: c('k:d01') },
  { time: '~2.30', text: 'Licht im Gästeflügel.', cond: c('k:s36') },
  { time: '~2.30', text: 'Tilly beim Herrn. Der Brief. Die große Treppe. Das Klopfen.', cond: c('k:s27') },
  { time: '2.39', text: 'Er stürzt vor dem Kamin.', cond: c('k:d05') },
  { time: '~2.45', text: 'Der Captain auf der Terrasse.', cond: c('k:s06') },
  { time: '~2.47', text: '„Es ist bezahlt. Sag’s ihm.“', cond: c('k:s28') },
  { time: 'vor 3', text: 'Ein Mädchen weint auf der Treppe. Und ich bin da.', cond: c('anyk:s30,d16') },
  { time: 'nach 3', text: 'Der Captain verbrennt die Papiere.', cond: c('k:d09') },
  { time: 'Mi 6.05', text: 'Tilly findet mich hinter dem Vorhang.', cond: c('ch>=1') },
  { time: 'Mi 6.15', text: 'Hobbes findet ihn am Boden. Setzt ihn in den Sessel.', cond: c('k:d04') },
  { time: 'Mi 6.25', text: 'Die Uhren werden angehalten.', cond: c('k:c32') },
];
