import type { EventId, ExpeditionId } from './types';

export type Speaker =
  | 'fritz'
  | 'ivo'
  | 'sera'
  | 'yuumi'
  | 'narrator'
  | 'mira'
  | 'waechter'
  | 'archivarin'
  | 'hueter';

export type LineCondition = 'yuumi' | 'noYuumi' | 'courier' | 'noCourier' | 'endingYuumi' | 'namesFreed';

export interface DialogLine {
  speaker: Speaker;
  text: string;
  mood?: 'smile' | 'sad' | 'serious' | 'happy';
  if?: LineCondition;
}

export interface Dialog {
  id: string;
  title: string;
  lines: DialogLine[];
}

export const SPEAKER_NAME: Record<Speaker, string> = {
  fritz: 'Fritz',
  ivo: 'Ivo',
  sera: 'Sera',
  yuumi: 'Yuumi',
  narrator: '',
  mira: 'Mira, die Botin',
  waechter: 'Der Glockenwächter',
  archivarin: 'Die Archivarin',
  hueter: 'Der Hüter',
};

const d = (id: string, title: string, lines: DialogLine[]): Dialog => ({ id, title, lines });

export const DIALOGS: Record<string, Dialog> = {
  intro: d('intro', 'Die Stadt Vesper', [
    { speaker: 'narrator', text: 'Jede Nacht steigt der Nebel über Vesper. Wen er berührt, der vergisst – erst Wege, dann Namen, dann sich selbst.' },
    { speaker: 'narrator', text: 'Nur ein kleiner Raum bleibt hell: die Laternenstube. Drei Reisende wachen dort auf, mit Asche an den Stiefeln und Lücken im Gedächtnis.' },
    { speaker: 'fritz', text: 'Wir sind wieder hier. Das heißt, wir haben verloren. Und das heißt, wir gehen noch mal raus.', mood: 'serious' },
    { speaker: 'ivo', text: 'Faszinierend, nicht wahr? Die Laterne zieht uns zurück, jedes Mal. Ich habe eine Theorie. Genau genommen drei.' },
    { speaker: 'sera', text: 'Erst mal atmen, ihr beiden. Fritz, dein Ärmel ist wieder aufgerissen … komm her.', mood: 'smile' },
    { speaker: 'sera', text: 'In der Vorstadt läutet eine Glocke, jede Nacht, genau wenn der Nebel kommt. Ich glaube, dort fängt alles an.' },
    { speaker: 'fritz', text: 'Dann holen wir uns diese Glocke. Ich gehe vorn. Wie immer.' },
  ]),
  exp1_start: d('exp1_start', 'Die versunkene Vorstadt', [
    { speaker: 'ivo', text: 'Kurze Einweisung, weil ich sie sowieso geben würde: Wir greifen von allein an. Unsere Fähigkeiten kosten Fokus – den teilen wir uns.' },
    { speaker: 'fritz', text: 'Klick auf einen Gegner, dann schlagen wir alle auf ihn. Wenn einer ausholt, halte ich ihn mit dem Laternenwall auf.' },
    { speaker: 'sera', text: 'Und wenn es wehtut, bin ich da. Versprochen.', mood: 'smile' },
  ]),
  cat_join: d('cat_join', 'Yuumi', [
    { speaker: 'sera', text: 'Oh … hallo, du Kleine. Du zitterst ja. Keiner tut dir hier etwas, ja? Ganz ruhig.', mood: 'happy' },
    { speaker: 'yuumi', text: '*mrrp?* – ein winziges Glöckchen klingt, hell wie Mondlicht.' },
    { speaker: 'fritz', text: '… Hier. Das Brett ist weg. Das Glöckchen hing fest.', mood: 'smile' },
    { speaker: 'ivo', text: 'Bemerkenswert. Das Glöckchen schwingt, aber der Nebel dämpft seinen Klang nicht. Vermutlich eine Resonanz mit dem Laternenlicht, oder – nun ja. Magie.' },
    { speaker: 'sera', text: 'Sie heißt Yuumi. Steht doch am Glöckchen. Willst du ein Stück mit uns kommen, Yuumi?', mood: 'happy' },
    { speaker: 'yuumi', text: '*schnurrt und streicht Fritz um die Stiefel*' },
    { speaker: 'fritz', text: 'Sie bleibt neben mir. Da ist sie sicher.' },
    { speaker: 'narrator', text: 'Yuumis Mondglöckchen belegt einen Reliktplatz. Yuumi kämpft selbstständig mit, bis der Run endet – danach muss das Glöckchen neu gefunden werden.' },
  ]),
  cat_rest: d('cat_rest', 'Eine kurze Rast', [
    { speaker: 'sera', text: 'Wir können dich nicht mitnehmen, Kleine. Aber du hast uns eine Pause geschenkt. Danke.', mood: 'smile' },
    { speaker: 'yuumi', text: '*blinzelt langsam und verschwindet unversehrt zwischen den Marktständen*' },
    { speaker: 'fritz', text: 'Sie findet ihren Weg. Katzen tun das.' },
  ]),
  boss1_pre: d('boss1_pre', 'Der Glockenturm', [
    { speaker: 'waechter', text: 'KEHRT UM. Die Glocke hält, was hinter ihr liegt.' },
    { speaker: 'fritz', text: 'Du hältst eine ganze Stadt im Nebel. Genug gehalten.' },
    { speaker: 'ivo', text: 'Er holt weit aus, bevor er zuschlägt. Fritz – den Schlag unterbrechen!' },
  ]),
  boss1_after: d('boss1_after', 'Die gesprungene Glocke', [
    { speaker: 'waechter', text: 'Ihr … Narren. Ich habe nicht den Nebel gehalten. Ich habe den Hunger zurückgehalten. Den Hunger hinter dem Licht.' },
    { speaker: 'narrator', text: 'Die Glocke springt. Der Nebel weicht nicht – er zieht sich zusammen, einem Ort entgegen: dem Archiv der Namen.' },
    { speaker: 'ivo', text: 'Hunger hinter dem Licht? Das ist … keine gute Metapher. Oder eine sehr gute. Ich weiß nicht, was mir mehr Angst macht.' },
    { speaker: 'sera', text: '…', mood: 'sad' },
    { speaker: 'fritz', text: 'Sera? Du bist blass.' },
    { speaker: 'sera', text: 'Es ist nichts. Lasst uns zurück zur Laterne gehen. Bitte.', mood: 'sad' },
    { speaker: 'yuumi', text: '*schmiegt sich an Seras Hand, bis sie wieder lächelt*', if: 'yuumi' },
  ]),
  exp2_start: d('exp2_start', 'Das Archiv der Namen', [
    { speaker: 'ivo', text: 'Jede Regalreihe hier ist ein Viertel von Vesper. Jede Karte ein Mensch. Und so viele sind leer.' },
    { speaker: 'fritz', text: 'Die Gegner hier heilen einander und löschen Brände. Erst die Heilerin, dann der Rest.' },
    { speaker: 'sera', text: 'Ich kenne diese Gänge. Ich … erzähle es euch. Wenn wir tiefer drin sind.', mood: 'sad' },
  ]),
  boss2_pre: d('boss2_pre', 'Die Archivarin', [
    { speaker: 'archivarin', text: 'Du bist zurück, Lehrling. Mit Fremden. Sie wissen noch nicht, wofür ihr Licht bezahlt wird.' },
    { speaker: 'sera', text: 'Sie wissen es. Ich habe es ihnen gesagt. Und jetzt beenden wir das Tilgen.', mood: 'serious' },
    { speaker: 'mira', text: 'Ich kenne ihren Namen. Ich habe ihn all die Jahre getragen. Wenn ich ihn rufe, wird sie schwanken!', if: 'courier' },
  ]),
  boss2_after: d('boss2_after', 'Ein Name kehrt zurück', [
    { speaker: 'archivarin', text: 'Ich gab der Laterne meinen Namen, damit sie brennt. Dann die Namen der anderen. Es war nie genug.' },
    { speaker: 'sera', text: 'Wir wollten niemanden vergessen lassen. Und haben am Ende die ganze Stadt vergessen lassen.', mood: 'sad' },
    { speaker: 'fritz', text: 'Du hast es gut gemeint. Das macht es nicht ungeschehen. Aber du trägst es nicht allein.', mood: 'serious' },
    { speaker: 'mira', text: 'Ihr Name war Hedda. Jetzt erinnert sich wieder jemand an sie.', if: 'courier' },
    { speaker: 'ivo', text: 'Das Herz der Laterne liegt unter der Stube. Unter uns. Die ganze Zeit.' },
  ]),
  exp3_start: d('exp3_start', 'Das Herz der Laterne', [
    { speaker: 'narrator', text: 'Unter der Laternenstube führt eine Treppe hinab, die gestern noch nicht da war.' },
    { speaker: 'ivo', text: 'Alles, was wir gesehen haben, kommt hier zusammen. Schilde, Brand, Heiler, schwere Schläge. Bitte keine Überraschungen mehr.' },
    { speaker: 'fritz', text: 'Egal, was da unten wartet. Wir gehen zusammen.' },
    { speaker: 'sera', text: 'Zusammen. Und diesmal bleibe ich nicht still.', mood: 'smile' },
  ]),
  boss3_pre: d('boss3_pre', 'Der Hüter des letzten Lichts', [
    { speaker: 'hueter', text: 'Ich bin, was ihr jede Nacht zurückgebracht habt. Jede Niederlage hat mich genährt.' },
    { speaker: 'ivo', text: 'Er ermüdet zwischen seinen Angriffen – dann ist er verwundbar. Und das „Letzte Licht“ kann niemand unterbrechen!' },
    { speaker: 'fritz', text: 'Dann stehen wir es durch. Sera, bleib hinter mir.' },
  ]),
  boss3_after: d('boss3_after', 'Die Entscheidung', [
    { speaker: 'narrator', text: 'Der Hüter sinkt in sich zusammen. Übrig bleibt eine kleine, zitternde Flamme – die Laterne selbst.' },
    { speaker: 'sera', text: 'Sie hat uns gerettet. Immer wieder. Und dafür hat sie Vesper leer gebrannt.', mood: 'sad' },
    { speaker: 'ivo', text: 'Wir könnten sie umbauen. Sie nur noch nehmen lassen, was wir freiwillig geben. Keine Garantie, dass es hält.' },
    { speaker: 'fritz', text: 'Oder wir löschen sie. Dann kommt der Morgen – und keiner von uns weiß, ob wir ihn sehen.' },
  ]),
  ending_keep: d('ending_keep', 'Ende: Das bewahrte Licht', [
    { speaker: 'narrator', text: 'Die Laterne brennt weiter, kleiner als zuvor. Sie nimmt keine Namen mehr – nur noch, was freiwillig in ihr Licht gelegt wird.' },
    { speaker: 'ivo', text: 'Jeden Abend eine Erinnerung. Eine kleine. Ich habe gestern meinen ersten Lehrer hineingelegt. Er hätte es verstanden.' },
    { speaker: 'fritz', text: 'Ich habe das Tor hineingelegt. Die Nacht, in der ich es schließen ließ. Es wiegt jetzt weniger.', mood: 'serious' },
    { speaker: 'sera', text: 'Und die Stadt erinnert sich wieder. Langsam. Name für Name. Wir passen auf sie auf – und aufeinander.', mood: 'happy' },
    { speaker: 'yuumi', text: '*Yuumi rollt sich im warmen Schein zusammen. Ihr Glöckchen klingt leise, wenn Sera ihr über den Kopf streicht.*', if: 'endingYuumi' },
    { speaker: 'narrator', text: 'Die Geschichte ist erzählt. Weitere Expeditionen sind Erinnerungen an diese Nächte – und „Die lange Nacht“ wartet auf Mutige.' },
  ]),
  ending_extinguish: d('ending_extinguish', 'Ende: Eine Nacht, die enden darf', [
    { speaker: 'narrator', text: 'Sera legt die Hand auf die Flamme. Sie erlischt ohne einen Laut.' },
    { speaker: 'narrator', text: 'Über Vesper wird der Himmel grau, dann blass, dann golden. Der Nebel zieht sich zurück – und mit ihm die Gewissheit, zurückzukehren.' },
    { speaker: 'ivo', text: 'Keine Wiederkehr mehr. Wenn wir jetzt fallen, fallen wir. Merkwürdig, wie sehr ich mich darauf freue, vorsichtig zu sein.' },
    { speaker: 'fritz', text: 'Die Tore sind offen. Diesmal bleiben sie das.', mood: 'smile' },
    { speaker: 'sera', text: 'Ich weiß nicht, was morgen kommt. Aber es ist unser Morgen. Und wir erinnern uns daran.', mood: 'happy' },
    { speaker: 'yuumi', text: '*Yuumi sitzt auf dem Fenstersims und blinzelt in den ersten Sonnenaufgang seit Jahren. Das Glöckchen klingt – ganz ohne Nebel.*', if: 'endingYuumi' },
    { speaker: 'narrator', text: 'Die Geschichte ist erzählt. Weitere Expeditionen sind Erinnerungen an diese Nächte – und „Die lange Nacht“ wartet auf Mutige.' },
  ]),
  first_defeat: d('first_defeat', 'Zurück im Licht', [
    { speaker: 'sera', text: 'Schhh, ihr seid wieder da. Alle drei. Das ist das Wichtigste.', mood: 'smile' },
    { speaker: 'fritz', text: 'Wir sind zu schnell gefallen. Nächstes Mal halte ich die schweren Schläge auf.' },
    { speaker: 'ivo', text: 'Das Erinnerungslicht, das wir mitgebracht haben, bleibt. Damit können wir Siegel prägen. Fortschritt! Irgendwie.' },
  ]),
  memory_run: d('memory_run', 'Eine Erinnerung', [
    { speaker: 'narrator', text: 'Die Geschichte ist erzählt. Diese Expedition ist eine Erinnerung an jene Nächte – Entscheidungen darin verändern das Ende nicht mehr.' },
  ]),
};

// ---------------- Ereignisse ----------------

export interface EventChoiceDef {
  label: string;
  preview: string;
  risk?: string;
}

export interface EventDef {
  id: EventId;
  title: string;
  icon: string;
  mapHint: string;
  story: boolean;
  intro: DialogLine[];
  choices: EventChoiceDef[];
}

export const EVENTS: Record<EventId, EventDef> = {
  miauen: {
    id: 'miauen',
    title: 'Ein Miauen im Nebel',
    icon: '🐈',
    mapHint: 'Aus dem Nebel dringt ein leises Miauen …',
    story: false,
    intro: [
      { speaker: 'narrator', text: 'Unter einem umgestürzten Marktstand bewegt sich etwas Graues. Zwei große Augen, ein leises, klägliches Miauen.' },
      { speaker: 'sera', text: 'Wartet. Ganz langsam … Hallo, du. Hast du dich verhakt?', mood: 'smile' },
      { speaker: 'fritz', text: 'Ein Brett drückt auf ihr Halsband. Ich hebe es an. Sera, halt sie fest.' },
    ],
    choices: [
      {
        label: 'Das Laternenlicht mit Yuumi teilen',
        preview: 'Erhalte Yuumis Mondglöckchen (Relikt, belegt 1 von 2 Reliktplätzen): Yuumi kämpft bis zum Ende des Runs mit.',
        risk: 'Gegenleistung: Der nächste Kampf beginnt mit 1 Fokus weniger.',
      },
      {
        label: 'Die kurze Rast nutzen',
        preview: 'Alle drei Hauptfiguren heilen 12 % ihrer max. HP. Das Relikt wird nicht erworben; Yuumi zieht unversehrt weiter.',
      },
    ],
  },
  brunnen: {
    id: 'brunnen',
    title: 'Der Brunnen der leisen Wünsche',
    icon: '⛲',
    mapHint: 'Ein alter Brunnen, der im Nebel schimmert.',
    story: false,
    intro: [
      { speaker: 'narrator', text: 'Auf dem Grund eines Brunnens glitzert etwas. Das Wasser flüstert Namen.' },
      { speaker: 'ivo', text: 'Das Glitzern könnte ein Relikt sein. Oder Kälte, die sehr, sehr weh tut.' },
    ],
    choices: [
      { label: 'Einen Wunsch flüstern', preview: 'Alle Helden heilen 25 % ihrer max. HP.' },
      {
        label: 'Nach dem Glitzern tauchen',
        preview: 'Wähle 1 von 2 Relikten (oder lehne ab).',
        risk: 'Risiko: Alle Helden verlieren 10 % ihrer max. HP (nie tödlich).',
      },
    ],
  },
  werkstatt: {
    id: 'werkstatt',
    title: 'Ivos alte Funkenwerkstatt',
    icon: '⚗️',
    mapHint: 'Ein verlassener Laborraum. Ivo wird ganz aufgeregt.',
    story: false,
    intro: [
      { speaker: 'ivo', text: 'Das … ist meine Werkstatt! Also, war. Bevor sie mich verbannt haben. Wegen einer Kleinigkeit. Ein Dach. Zwei Dächer.' },
      { speaker: 'sera', text: 'Du strahlst ja, Ivo. Nimm dir, was du brauchst.', mood: 'smile' },
    ],
    choices: [
      { label: 'Ivo experimentieren lassen', preview: '+12 Erfahrung für die Gruppe (Run-Level schneller).' },
      { label: 'Material einsammeln', preview: 'Wähle 1 von 3 Gegenständen (gewöhnlich/selten, bevorzugt Glut).' },
    ],
  },
  wachstube: {
    id: 'wachstube',
    title: 'Die Wachstube am Tor',
    icon: '🏰',
    mapHint: 'Ein Wachhaus. Fritz bleibt davor stehen.',
    story: false,
    intro: [
      { speaker: 'fritz', text: 'Hier habe ich Dienst geschoben. In der Nacht, als der Nebel kam, habe ich befohlen, das Tor zu schließen.', mood: 'serious' },
      { speaker: 'sera', text: 'Um die drinnen zu retten. Fritz … du hast getan, was du konntest.', mood: 'sad' },
      { speaker: 'fritz', text: 'Und die draußen? Egal. In der Truhe liegt noch Ausrüstung der Wache.' },
    ],
    choices: [
      { label: 'Die Wappentruhe öffnen', preview: 'Wähle 1 von 2 Relikten; das Wappen der Wache ist dabei, falls es nicht schon ausgerüstet ist.' },
      { label: 'Kurz innehalten', preview: 'Alle Helden heilen 15 % ihrer max. HP; der nächste Kampf beginnt mit +1 Fokus.' },
    ],
  },
  kinderlied: {
    id: 'kinderlied',
    title: 'Das Kinderlied',
    icon: '🎶',
    mapHint: 'Irgendwo singt jemand ein Lied, das Sera kennt.',
    story: false,
    intro: [
      { speaker: 'narrator', text: 'Eine Kinderstimme singt im Nebel, immer dieselbe Strophe. Sera summt leise mit.' },
      { speaker: 'sera', text: 'Das haben wir früher im Archiv gesungen, damit die Namen nicht einschlafen.', mood: 'smile' },
    ],
    choices: [
      { label: 'Mitsingen', preview: 'Alle Helden heilen 20 % ihrer max. HP; der nächste Kampf beginnt mit +1 Fokus.' },
      { label: 'Dem Lied folgen', preview: 'Wähle 1 von 2 Relikten; Chor der Namen ist dabei, falls nicht schon ausgerüstet.' },
    ],
  },
  haendler: {
    id: 'haendler',
    title: 'Der Nebelhändler',
    icon: '🎭',
    mapHint: 'Eine Gestalt mit Laterne ohne Licht bietet Waren an.',
    story: false,
    intro: [
      { speaker: 'narrator', text: '„Seltene Ware, feine Ware“, raunt der Händler. „Bezahlt wird nicht in Münzen, sondern in Kraft.“' },
      { speaker: 'fritz', text: 'Ich traue ihm nicht. Aber die Ware ist echt.' },
    ],
    choices: [
      {
        label: 'Mit Lebenskraft bezahlen',
        preview: 'Wähle 1 von 2 Gegenständen: mindestens selten, je Option 40 % legendär.',
        risk: 'Preis: Alle Helden verlieren 15 % ihrer max. HP (nie tödlich).',
      },
      { label: 'Höflich ablehnen', preview: 'Nichts geschieht. +5 Erfahrung für die Vorsicht.' },
    ],
  },
  botin: {
    id: 'botin',
    title: 'Kapitel 1 – Die eingeschlossene Botin',
    icon: '✉️',
    mapHint: 'Storyereignis: Jemand ruft um Hilfe.',
    story: true,
    intro: [
      { speaker: 'narrator', text: 'Hinter einem eingestürzten Torbogen sitzt eine junge Frau fest, eine Tasche voller Karten an sich gepresst.' },
      { speaker: 'mira', text: 'Ich bin Mira, Erinnerungsbotin. Ich trage Namen ins Archiv, bevor der Nebel sie frisst. Bitte – der Bogen gibt nach!' },
      { speaker: 'fritz', text: 'Den Schutt wegzuräumen kostet Kraft. Kraft, die uns beim nächsten Kampf fehlt.' },
      { speaker: 'ivo', text: 'Ihre Vorräte liegen vor dem Bogen. Heiltränke. Sehr … erreichbar.' },
      { speaker: 'sera', text: 'Wir lassen niemanden zurück, der Namen trägt. Oder?', mood: 'sad' },
    ],
    choices: [
      {
        label: 'Die Botin befreien',
        preview: 'Mira ist gerettet. Das wird sich im Archiv der Namen auszahlen.',
        risk: 'Kosten jetzt: Alle Helden verlieren 15 % ihrer max. HP (nie tödlich).',
      },
      {
        label: 'Ihre Vorräte nehmen',
        preview: 'Alle Helden heilen 25 % ihrer max. HP und du wählst 1 von 3 Gegenständen. Mira bleibt zurück.',
      },
    ],
  },
  register: {
    id: 'register',
    title: 'Kapitel 2 – Das Register der Laterne',
    icon: '📖',
    mapHint: 'Storyereignis: Ein Buch, das Sera kennt.',
    story: true,
    intro: [
      { speaker: 'narrator', text: 'Auf einem Pult liegt ein aufgeschlagenes Register. Jede Zeile: ein Name, daneben ein Datum – und daneben: „verbrannt“.' },
      { speaker: 'ivo', text: 'Das sind … die Nächte, in denen wir zurückkamen. Die Laterne verbraucht Erinnerungen, um uns zurückzuholen.' },
      { speaker: 'sera', text: 'Ich habe geholfen, sie zu bauen. Ich war Lehrling hier. Wir wollten die Namen vor dem Nebel retten. Wir haben nicht gesehen, was sie dafür nimmt.', mood: 'sad' },
      { speaker: 'sera', text: 'Es tut mir leid. Ich hätte es euch früher sagen müssen. Das ist meine Verantwortung.', mood: 'sad' },
      { speaker: 'fritz', text: 'Ja. Hättest du. Und jetzt stehst du dazu. Das zählt. Wir reparieren das zusammen.', mood: 'serious' },
      { speaker: 'mira', text: 'Ich habe euch gefunden! Die Archivarin … ich kenne ihren wahren Namen. Ich rufe ihn, wenn ihr ihr gegenübersteht.', if: 'courier' },
      { speaker: 'yuumi', text: '*Yuumi legt eine Pfote auf das Register, als wollte sie es festhalten.*', if: 'yuumi' },
    ],
    choices: [
      {
        label: 'Die Namen freigeben',
        preview: 'Sera schreibt die Namen zurück in die Stadt: Alle Helden heilen 30 %. Im Herz der Laterne wird der Hüter geschwächt sein (−10 % HP, anfangs verwundbar).',
      },
      {
        label: 'Das Register als Brennstoff mitnehmen',
        preview: 'Ivo zapft seine Kraft an: Wähle 1 von 2 Relikten. Die Namen bleiben verbrannt.',
      },
    ],
  },
  flamme: {
    id: 'flamme',
    title: 'Kapitel 3 – Die Flamme erinnert',
    icon: '🕯️',
    mapHint: 'Storyereignis: Die Laterne zeigt Erinnerungen.',
    story: true,
    intro: [
      { speaker: 'narrator', text: 'Im Kern der Laterne flackern Bilder: ein geschlossenes Tor, eine Werkbank voller Glas, eine junge Archivarin mit Tinte an den Fingern.' },
      { speaker: 'hueter', text: 'Wählt eine Erinnerung. Ich gebe sie euch zurück – als Kraft.' },
      { speaker: 'fritz', text: 'Das Tor. Ich weiß, was dahinter war. Ich will es trotzdem sehen.', mood: 'serious' },
      { speaker: 'sera', text: 'Oder die Werkbank. Der Moment, in dem wir die Laterne entzündet haben. Ich will verstehen, was wir falsch gemacht haben.', mood: 'sad' },
    ],
    choices: [
      { label: 'Fritz’ Erinnerung ansehen', preview: 'Fritz vergibt sich ein Stück: +25 % max. HP für Fritz in diesem Run, alle Helden voll geheilt.' },
      { label: 'Seras Erinnerung ansehen', preview: 'Sera versteht den Fehler: Jeder Kampf dieses Runs beginnt mit +1 Fokus; alle Helden heilen 30 %.' },
    ],
  },
};

export const STORY_EVENT_BY_EXPEDITION: Record<ExpeditionId, 'botin' | 'register' | 'flamme'> = {
  1: 'botin',
  2: 'register',
  3: 'flamme',
};

export const EXPEDITIONS: Record<ExpeditionId, { name: string; subtitle: string; boss: 'glockenwaechter' | 'archivarin' | 'hueter'; chapter: string }> = {
  1: { name: 'Die versunkene Vorstadt', subtitle: 'Einführung, erste Kombinationen und der Glockenwächter.', boss: 'glockenwaechter', chapter: 'Kapitel 1: Die Stadt vergisst' },
  2: { name: 'Das Archiv der Namen', subtitle: 'Heiler, Brandwirker und die namenlose Archivarin.', boss: 'archivarin', chapter: 'Kapitel 2: Der Preis des Lichts' },
  3: { name: 'Das Herz der Laterne', subtitle: 'Alles Bekannte zusammen – und der Hüter des letzten Lichts.', boss: 'hueter', chapter: 'Kapitel 3: Eine Nacht, die enden darf' },
};

// Kurze Lagerfeuer-Gespräche (zufällig, nach Seed)
export const CAMP_BANTER: DialogLine[][] = [
  [
    { speaker: 'ivo', text: 'Wusstet ihr, dass Funken eigentlich winzige Sterne sind, die sich verlaufen haben? Das ist nicht wahr. Aber schön.' },
    { speaker: 'sera', text: 'Es ist trotzdem wahr, Ivo. Ein bisschen.', mood: 'smile' },
  ],
  [
    { speaker: 'fritz', text: 'Sera. Iss was. Du gibst allen Kraft und vergisst dich selbst.' },
    { speaker: 'sera', text: 'Nur wenn du auch deine Wunde verbinden lässt.', mood: 'smile' },
    { speaker: 'fritz', text: '… Abgemacht.' },
  ],
  [
    { speaker: 'ivo', text: 'Ich bin nicht nervös. Ich zähle nur sehr schnell die Ausgänge.' },
    { speaker: 'fritz', text: 'Drei. Und ich stehe vor allen.' },
  ],
  [
    { speaker: 'yuumi', text: '*Yuumi hat sich auf Fritz’ Schild zusammengerollt.*', if: 'yuumi' },
    { speaker: 'fritz', text: 'Ich … kann jetzt nicht aufstehen. Sie schläft.', if: 'yuumi' },
    { speaker: 'sera', text: 'Das ist das Süßeste, was ich heute gesehen habe.', mood: 'happy', if: 'yuumi' },
    { speaker: 'sera', text: 'Kommt näher ans Feuer. Wir haben es bis hierher geschafft – zusammen.', mood: 'smile', if: 'noYuumi' },
  ],
  [
    { speaker: 'ivo', text: 'Theorie: Das Glöckchen schwingt mit einer Frequenz, die Nebel … Nein. Ich habe keine Theorie. Sie ist einfach eine Katze.', if: 'yuumi' },
    { speaker: 'yuumi', text: '*mrrp*', if: 'yuumi' },
    { speaker: 'ivo', text: 'Wenn wir hier rauskommen, schreibe ich ein Buch. „Der Nebel und ich“. Mit Diagrammen.', if: 'noYuumi' },
    { speaker: 'sera', text: 'Ich lese es. Jedes Diagramm.', mood: 'smile' },
  ],
];
