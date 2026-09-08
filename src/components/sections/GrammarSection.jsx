import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BookOpen, Compass, Clock, Zap, BookOpenCheck, ChevronDown, ChevronUp, 
  CheckCircle2, HelpCircle, Layers, Sparkles, Shield, Flame, 
  FileText, Lightbulb, AlertTriangle, PenTool, Bookmark, Film, ArrowRight, Eye, Award,
  Search, X, RotateCcw
} from 'lucide-react';
import './GrammarSection.css';
import './VocabularySection.css';

const STUDIO_STATIONS = [
  {
    id: 'imparfait',
    num: "01",
    icon: "🎥",
    tag: "Station 1 • Décor",
    title: "La Caméra & Le Décor",
    subtitle: "L'Imparfait : Plante l'ambiance et la météo",
    accentColor: "sky"
  },
  {
    id: 'pc_avoir',
    num: "02",
    icon: "⚡",
    tag: "Station 2 • Action",
    title: "Le Coup de Théâtre",
    subtitle: "Passé Composé (AVOIR) : Déclenche l'événement",
    accentColor: "amber"
  },
  {
    id: 'pc_etre',
    num: "03",
    icon: "🧭",
    tag: "Station 3 • Déplacements",
    title: "La Carte des Déplacements",
    subtitle: "Passé Composé (ÊTRE) : Trajets & Accords obligatoires",
    accentColor: "emerald"
  },
  {
    id: 'combinaison',
    num: "04",
    icon: "🎬",
    tag: "Station 4 • Duo Scénique",
    title: "La Régie du Réalisateur",
    subtitle: "Imparfait vs Passé Composé : Le duo de choc",
    accentColor: "indigo"
  },
  {
    id: 'connecteurs',
    num: "05",
    icon: "🧩",
    tag: "Station 5 • Architecture",
    title: "L'Architecte de l'Intrigue",
    subtitle: "Les Balises & Connecteurs : Rythme ton récit",
    accentColor: "rose"
  }
];

const ARSENAL_MODULES = [
  {
    id: 'imparfait',
    num: "01",
    icon: "🕒",
    tag: "Module 1 • Arrière-Plan",
    title: "L'Armurerie de l'Imparfait",
    subtitle: "Radicaux réguliers & 10 verbes fréquents",
    accentColor: "sky"
  },
  {
    id: 'pc_avoir',
    num: "02",
    icon: "⚡",
    tag: "Module 2 • Coup d'Éclat",
    title: "Le Coffre des Participes (AVOIR)",
    subtitle: "Réguliers (-é, -i, -u) & 17 irréguliers par famille",
    accentColor: "amber"
  },
  {
    id: 'pc_etre',
    num: "03",
    icon: "🧭",
    tag: "Module 3 • Déplacements",
    title: "La Boussole ÊTRE & Accords",
    subtitle: "Les 17 verbes DR & MRS VANDERTRAMP avec accords",
    accentColor: "emerald"
  },
  {
    id: 'pronominaux',
    num: "04",
    icon: "🪞",
    tag: "Module 4 • Réflexion",
    title: "Le Miroir Pronominal",
    subtitle: "Verbes réfléchis avec auxiliaire ÊTRE",
    accentColor: "rose"
  },
  {
    id: 'comparaison',
    num: "05",
    icon: "⚖️",
    tag: "Module 5 • Nuances",
    title: "Le Comparateur de Nuances",
    subtitle: "Double sens : Être, Avoir, Savoir, Pouvoir...",
    accentColor: "purple"
  }
];

const VANDERTRAMP_HERO_VERBS = [
  { l: "D", verb: "Devenir", icon: "🌱", meaning: "To become", ex: "Julien est devenu courageux face au danger." },
  { l: "R", verb: "Revenir", icon: "🔄", meaning: "To come back", ex: "Elle est revenue au repaire avec l'horloge." },
  { l: "M", verb: "Monter", icon: "🧗", meaning: "To climb / go up", ex: "Le héros est monté sur le toit du musée." },
  { l: "R", verb: "Rester", icon: "🛑", meaning: "To stay", ex: "Les deux amis sont restés calmes dans la nuit." },
  { l: "S", verb: "Sortir", icon: "🚪", meaning: "To go out", ex: "Coralie est sortie discrètement par la fenêtre." },
  { l: "V", verb: "Venir", icon: "👋", meaning: "To come", ex: "Marc est venu avec sa trousse de secours." },
  { l: "A", verb: "Aller", icon: "➡️", meaning: "To go", ex: "Elles sont allées chercher de l'aide." },
  { l: "N", verb: "Naître", icon: "✨", meaning: "To be born", ex: "Une légende inoubliable est née à Montréal." },
  { l: "D", verb: "Descendre", icon: "🪜", meaning: "To go down", ex: "Il est descendu prudemment le long de la corde." },
  { l: "E", verb: "Entrer", icon: "🚪", meaning: "To enter", ex: "Elle est entrée dans la pièce secrète." },
  { l: "R", verb: "Rentrer", icon: "🏠", meaning: "To return home", ex: "Nous sommes rentrés sains et saufs." },
  { l: "T", verb: "Tomber", icon: "🍂", meaning: "To fall", ex: "Une lourde poutre est tombée près du policier." },
  { l: "R", verb: "Retourner", icon: "↩️", meaning: "To return", ex: "Julien est retourné auprès du capitaine blessé." },
  { l: "A", verb: "Arriver", icon: "🏁", meaning: "To arrive", ex: "Les renforts sont arrivés avant minuit." },
  { l: "M", verb: "Mourir", icon: "💀", meaning: "To die", ex: "La petite flamme est morte sous l'extincteur." },
  { l: "P", verb: "Partir", icon: "🏃", meaning: "To leave", ex: "L'héroïne est partie sans faire de bruit." },
  { l: "+", verb: "Passer (par)", icon: "🌉", meaning: "To pass through", ex: "Le jeune justicier est passé par les toits." }
];

const POWER_PARTICIPLES = [
  { inf: "Boire", icon: "☕", pp: "bu", ex: "« Julien a bu une gorgée de tisane. »", note: "Participe court en -u" },
  { inf: "Faire", icon: "⚔️", pp: "fait", ex: "« Il a fait le choix le plus difficile. »", note: "Terminaison muette en -t" },
  { inf: "Lire", icon: "📖", pp: "lu", ex: "« Samira a lu les notes du détective. »", note: "Participe court en -u" },
  { inf: "Écrire", icon: "✍️", pp: "écrit", ex: "« Elle a écrit un message codé sur le mur. »", note: "Terminaison muette en -t" },
  { inf: "Prendre", icon: "🗝️", pp: "pris", ex: "« Coralie a pris la pierre précieuse. »", note: "Terminaison muette en -s" },
  { inf: "Voir", icon: "👁️", pp: "vu", ex: "« Julien a vu le capitaine coincé. »", note: "Participe court en -u" },
  { inf: "Dire", icon: "🗣️", pp: "dit", ex: "« L'officier a dit toute la vérité. »", note: "Terminaison muette en -t" },
  { inf: "Avoir", icon: "🏆", pp: "eu", ex: "« Le héros a eu le courage d'agir. »", note: "Prononcé [y] comme la lettre « u »" },
  { inf: "Être", icon: "⭐", pp: "été", ex: "« Son geste a été particulièrement héroïque. »", note: "Toujours invariable avec avoir" },
  { inf: "Ouvrir", icon: "🔓", pp: "ouvert", ex: "« Il a ouvert la trappe d'évacuation. »", note: "Terminaison muette en -t" },
  { inf: "Pouvoir", icon: "🛡️", pp: "pu", ex: "« Grâce à son aide, ils ont pu fuir. »", note: "Participe court en -u" },
  { inf: "Vouloir", icon: "💫", pp: "voulu", ex: "« Elle a voulu réparer son erreur. »", note: "Participe régulier en -u" }
];

const ACCORD_MIRROR_DATA = {
  Il: {
    avatar: "👦",
    heroType: "Le héros solitaire",
    genreLabel: "Masculin singulier",
    auxiliary: "est",
    stem: "parti",
    ending: "",
    endingBadge: "Forme de base (aucun ajout)",
    badgeStyle: "bg-slate-100 text-slate-700 border-slate-300",
    example: "Le jeune héros est parti dans la nuit."
  },
  Elle: {
    avatar: "👧",
    heroType: "L'héroïne intrépide",
    genreLabel: "Féminin singulier",
    auxiliary: "est",
    stem: "parti",
    ending: "e",
    endingBadge: "+e (Accord féminin obligatoire)",
    badgeStyle: "bg-rose-100 text-rose-800 border-rose-300",
    example: "La vaillante héroïne est partie à la rescousse."
  },
  Ils: {
    avatar: "👦👦",
    heroType: "Les deux justiciers",
    genreLabel: "Masculin pluriel",
    auxiliary: "sont",
    stem: "parti",
    ending: "s",
    endingBadge: "+s (Accord pluriel obligatoire)",
    badgeStyle: "bg-indigo-100 text-indigo-800 border-indigo-300",
    example: "Les braves justiciers sont partis au bon moment."
  },
  Elles: {
    avatar: "👧👧",
    heroType: "Les deux protectrices",
    genreLabel: "Féminin pluriel",
    auxiliary: "sont",
    stem: "parti",
    ending: "es",
    endingBadge: "+es (Accord féminin pluriel obligatoire)",
    badgeStyle: "bg-emerald-100 text-emerald-800 border-emerald-300",
    example: "Les deux protectrices sont parties vers le musée."
  }
};

const SCREENPLAY_ROADMAP = [
  {
    step: "1. Le Départ (Introduction)",
    badge: "Planter l'intrigue",
    icon: "🚩",
    words: ["D'abord", "Tout d'abord", "En premier lieu"],
    example: "« Tout d'abord, Julien prépare soigneusement son matériel. »",
    color: "sky"
  },
  {
    step: "2. La Progression (Ajout)",
    badge: "Faire avancer l'action",
    icon: "➕",
    words: ["De plus", "En outre", "Également", "Par ailleurs"],
    example: "« De plus, il repère les faisceaux lasers de la salle d'exposition. »",
    color: "indigo"
  },
  {
    step: "3. L'Obstacle (Opposition)",
    badge: "Créer le suspense",
    icon: "⚠️",
    words: ["Cependant", "Pourtant", "Néanmoins", "Toutefois"],
    example: "« Cependant, une porte blindée se referme soudainement devant lui ! »",
    color: "amber"
  },
  {
    step: "4. Le Rebondissement (Conséquence)",
    badge: "Déclencher l'effet",
    icon: "🎯",
    words: ["Donc", "C'est pourquoi", "Par conséquent", "Ainsi"],
    example: "« Par conséquent, Julien doit trouver une issue de secours immédiate. »",
    color: "purple"
  },
  {
    step: "5. Le Dénouement (Conclusion)",
    badge: "Fermer l'épisode",
    icon: "🏁",
    words: ["Finalement", "Enfin", "Pour conclure", "En conclusion"],
    example: "« Finalement, il sauve son allié et s'échappe avec l'Horloge Boréale. »",
    color: "emerald"
  }
];

const LE_PASSE_GRAMMAR_DOSSIERS = [
  {
    id: 'imparfait',
    number: "01",
    title: "1. L'Imparfait : Le Décor et l'Habitude",
    subtitle: "L'arrière-plan narratif, la description et les actions habituelles",
    badge: "Arrière-Plan & Continuité",
    calloutRegleOr: "L'imparfait installe le décor et peint l'atmosphère. Si l'action n'a pas de début ni de fin précis dans votre récit, employez systématiquement l'imparfait !",
    piliers: [
      { icon: "🎨", title: "1. Le Décor & L'Atmosphère", desc: "Il faisait beau, les oiseaux chantaient et une brise légère soufflait sur la forêt." },
      { icon: "🔄", title: "2. La Routine & Les Habitudes", desc: "Tous les matins, je prenais un chocolat chaud avant de partir au collège." },
      { icon: "⏳", title: "3. L'Action Continue", desc: "Pendant que je lisais mon roman d'aventures à la bibliothèque..." }
    ],
    formula: "Sujet + Radical [Nous au présent - ons] + Terminaisons (-ais, -ais, -ait, -ions, -iez, -aient)",
    calloutPiege: "Attention au verbe ÊTRE : son radical est irrégulier (ét-), mais ses terminaisons sont 100 % régulières (j'étais, tu étais, il était, nous étions, vous étiez, ils étaient).",
    trivia: {
      question: "Quand j'étais petit, je _______ aux jeux vidéo tous les soirs.",
      options: ["jouais", "ai joué"],
      correct: "jouais",
      explanation: "Parfait ! C'est une habitude répétée dans le passé (la routine d'arrière-plan), donc on utilise l'imparfait !"
    },
    conjugation: {
      title: "Simulateur de Conjugaison — L'Imparfait",
      stems: [
        { verb: "Aimer (-ER)", stem: "aim-", endings: ["ais", "ais", "ait", "ions", "iez", "aient"] },
        { verb: "Finir (-IR)", stem: "finiss-", endings: ["ais", "ais", "ait", "ions", "iez", "aient"] },
        { verb: "Mettre (-RE)", stem: "mett-", endings: ["ais", "ais", "ait", "ions", "iez", "aient"] }
      ]
    }
  },
  {
    id: 'pc_avoir',
    number: "02",
    title: "2. Le Passé Composé avec AVOIR",
    subtitle: "L'action ponctuelle, les événements précis et le participe passé (~90 % des verbes)",
    badge: "Action Délimitée & Événement",
    calloutRegleOr: "Le passé composé propulse l'action. Il exprime les événements achevés, datés ou soudains qui font progresser l'intrigue.",
    piliers: [
      { icon: "🎯", title: "1. Action Achevée", desc: "Hier soir, j'ai fini mon devoir de français à 20h pile." },
      { icon: "⚡", title: "2. Événement Précis", desc: "Soudain, une alarme a retenti dans tout le couloir !" },
      { icon: "🛡️", title: "3. Règle Générale d'Accord", desc: "Avec AVOIR, le participe passé NE S'ACCORDE PAS avec le sujet (Elle a mangé, ils ont réussi)." }
    ],
    formula: "[Sujet] + [AVOIR au présent] + [Participe Passé (-é, -i, -u)]",
    calloutPiege: "Ne faites jamais l'accord du participe passé avec le sujet lorsque vous employez l'auxiliaire AVOIR !",
    irregularsVault: [
      { inf: "Boire", subj: "J'ai", pp: "bu" },
      { inf: "Faire", subj: "J'ai", pp: "fait" },
      { inf: "Lire", subj: "J'ai", pp: "lu" },
      { inf: "Écrire", subj: "J'ai", pp: "écrit" },
      { inf: "Prendre", subj: "J'ai", pp: "pris" },
      { inf: "Voir", subj: "J'ai", pp: "vu" },
      { inf: "Dire", subj: "J'ai", pp: "dit" },
      { inf: "Avoir", subj: "J'ai", pp: "eu" }
    ],
    trivia: {
      question: "Hier, Marie et Sarah _______ un excellent film au cinéma.",
      options: ["ont regardé", "sont regardées"],
      correct: "ont regardé",
      explanation: "Bravo ! Avec l'auxiliaire AVOIR, aucun accord avec le sujet : la forme correcte est 'ont regardé'."
    }
  },
  {
    id: 'pc_etre',
    number: "03",
    title: "3. Le Passé Composé avec ÊTRE",
    subtitle: "Les 17 verbes de mouvement (DR & MRS VANDERTRAMP) et les verbes pronominaux",
    badge: "Mouvement & Accord Obligatoire",
    calloutRegleOr: "Avec l'auxiliaire ÊTRE, l'accord en genre et en nombre avec le sujet est 100 % OBLIGATOIRE : féminin (+e), pluriel (+s), féminin pluriel (+es).",
    vandertramp: [
      "Devenir", "Revenir", "Monter", "Rester", "Sortir", "Venir", "Aller", "Naître", 
      "Descendre", "Entrer", "Rentrer", "Tomber", "Retourner", "Arriver", "Mourir", "Partir", "Passer"
    ],
    accordDemo: [
      { pronoun: "Il", label: "Masculin singulier", verb: "est parti", tag: "Base" },
      { pronoun: "Elle", label: "Féminin singulier", verb: "est partie", tag: "+e obligatoire" },
      { pronoun: "Ils", label: "Masculin pluriel", verb: "sont partis", tag: "+s obligatoire" },
      { pronoun: "Elles", label: "Féminin pluriel", verb: "sont parties", tag: "+es obligatoire" }
    ],
    calloutPiege: "Pensez aux verbes pronominaux (se lever, se souvenir, se coucher) : ils utilisent tous ÊTRE et s'accordent également !",
    trivia: {
      question: "Camille (une fille) _______ tard hier soir.",
      options: ["est arrivée", "est arrivé"],
      correct: "est arrivée",
      explanation: "Super ! Avec ÊTRE, l'accord en genre (+e pour le féminin) est strictement obligatoire : 'est arrivée'."
    }
  },
  {
    id: 'combinaison',
    number: "04",
    title: "4. L'Art de Raconter : Imparfait vs Passé Composé",
    subtitle: "La dynamique du récit : Le décor d'arrière-plan face aux ruptures d'action",
    badge: "Maîtrise du Récit & Narration",
    calloutRegleOr: "Dans un récit, l'imparfait et le passé composé travaillent en duo : l'imparfait plante le décor continu, et le passé composé crée l'événement qui bouscule l'histoire !",
    splitView: {
      imparfait: {
        title: "L'Imparfait (Arrière-Plan)",
        role: "Le Décor & L'Atmosphère",
        description: "Exprime ce qui durait déjà, les habitudes, les paysages, la météo et les états d'esprit.",
        question: "Que se passait-il ? Quel était l'état des choses ?",
        points: [
          "Action en cours non délimitée dans le temps",
          "Description du décor, des sentiments et du climat",
          "Habitudes répétées dans le passé"
        ],
        exemples: [
          "Le vent soufflait doucement à travers les arbres.",
          "J'avais froid et je me sentais inquiet.",
          "Chaque dimanche, nous allions marcher en montagne."
        ]
      },
      passeCompose: {
        title: "Le Passé Composé (Premier Plan)",
        role: "L'Événement & La Rupture",
        description: "Exprime les actions soudaines, datées, achevées et la succession chronologique des faits.",
        question: "Que s'est-il passé soudainement ? Quelle action a surgi ?",
        points: [
          "Événement ponctuel qui interrompt une action continue",
          "Action à durée clairement définie et complétée",
          "Succession chronologique (action 1, puis action 2, puis action 3)"
        ],
        exemples: [
          "Soudain, une porte a claqué avec fracas !",
          "Il a allumé la lampe et a pris son carnet.",
          "L'expédition a duré exactement trois semaines."
        ]
      }
    },
    signalWords: {
      imparfait: [
        "Chaque jour", "Tous les soirs", "D'habitude", "Toujours", 
        "Pendant que", "Autrefois", "En ce temps-là", "Régulièrement"
      ],
      passeCompose: [
        "Soudain", "Tout à coup", "Un jour", "À ce moment-là", 
        "Alors", "Brusquement", "Aussitôt", "Immédiatement"
      ]
    },
    storyTimeline: [
      { step: 1, tense: "Imparfait", label: "Le Décor & L'Ambiance", text: "Il faisait frais et les premières feuilles d'automne tombaient lentement.", icon: "🌄", color: "imparfait" },
      { step: 2, tense: "Imparfait", label: "L'Action Continue en Cours", text: "Le détective marchait tranquillement le long des quais embrumés.", icon: "🚶‍♂️", color: "imparfait" },
      { step: 3, tense: "Passé Composé", label: "L'Interruption Soudaine", text: "SOUDAIN, un cri mystérieux a retenti depuis la vieille tour !", icon: "⚡", color: "pc" },
      { step: 4, tense: "Passé Composé", label: "La Réaction Immédiate", text: "Il s'est arrêté net, a sorti sa lanterne et a couru vers l'escalier.", icon: "🏃‍♂️", color: "pc" }
    ],
    calloutAstuce: "Astuce de rédaction : Les conjonctions sont vos balises ! 'Pendant que' appelle l'imparfait (action longue), tandis que 'Soudain' ou 'Tout à coup' déclenche le passé composé (rupture nette).",
    trivia: {
      question: "Pendant que je (dormir) _______, le réveil (sonner) _______.",
      options: ["dormais / a sonné", "ai dormi / sonnait"],
      correct: "dormais / a sonné",
      explanation: "Exact ! Dormir est l'action continue en arrière-plan (Imparfait), et le réveil est l'événement ponctuel qui interrompt le sommeil (Passé Composé) !"
    }
  },
  {
    id: 'connecteurs',
    number: "05",
    title: "5. Les Balises & Connecteurs Logiques du Récit",
    subtitle: "Articuler chronologiquement l'intrigue et donner du rythme à la rédaction",
    badge: "Architecture du Récit",
    calloutRegleOr: "Les connecteurs sont les piliers de votre texte : ils guident le lecteur d'un événement à l'autre sans hésitation.",
    categories: [
      { title: "1. L'Introduction & Début", words: ["D'abord", "Tout d'abord", "Premièrement", "En premier lieu"] },
      { title: "2. L'Ajout & Progression", words: ["De plus", "En outre", "Également", "Par ailleurs"] },
      { title: "3. L'Opposition & Contraste", words: ["Cependant", "Néanmoins", "En revanche", "Toutefois"] },
      { title: "4. La Conséquence & Résultat", words: ["Par conséquent", "Donc", "C'est pourquoi", "Ainsi"] },
      { title: "5. La Conclusion & Dénouement", words: ["En conclusion", "Pour conclure", "Finalement", "Enfin"] }
    ],
    calloutAstuce: "Astuce de style : Évitez de répéter 'et puis' ou 'ensuite'. Alternez entre 'en outre', 'toutefois' et 'ainsi' pour donner du relief à votre écriture !",
    trivia: {
      question: "Il a révisé toute la nuit. _______, il a réussi son examen avec brio !",
      options: ["Par conséquent", "Cependant"],
      correct: "Par conséquent",
      explanation: "Absolument ! 'Par conséquent' exprime la conséquence logique du travail accompli !"
    }
  },
  {
    id: 'reflechis',
    number: "06",
    title: "6. Les Verbes Réfléchis et Réciproques",
    subtitle: "Les verbes pronominaux : action sur soi et action mutuelle",
    badge: "Verbes Pronominaux",
    calloutRegleOr: "Un verbe pronominal se conjugue toujours avec un pronom réfléchi correspondant au sujet (je me, tu te, il se, nous nous, vous vous, ils se).",
    miroir: [
      { mode: "Action Réfléchie (Sur soi-même)", example: "Je me passionne pour la littérature et l'histoire. (L'action revient directement sur le sujet)" },
      { mode: "Action Réciproque (Entre plusieurs personnes)", example: "Ils se rencontrent chaque samedi à l'atelier d'écriture. (L'action est partagée et mutuelle)" }
    ],
    conjugatorWheel: [
      { pronoun: "Je", reflex: "me", verb: "passionne" },
      { pronoun: "Tu", reflex: "te", verb: "passionnes" },
      { pronoun: "Il / Elle", reflex: "se", verb: "passionne" },
      { pronoun: "Nous", reflex: "nous", verb: "passionnons" },
      { pronoun: "Vous", reflex: "vous", verb: "passionnez" },
      { pronoun: "Ils / Elles", reflex: "se", verb: "passionnent" }
    ],
    calloutPiege: "Attention aux verbes commençant par une voyelle ou un 'h' muet : 'me', 'te', 'se' s'élident en m', t', s' (ex. : il s'appelle, nous nous réjouissons).",
    trivia: {
      question: "Chaque matin, nous _______ à 7 heures.",
      options: ["nous réveillons", "réveillons"],
      correct: "nous réveillons",
      explanation: "Génial ! Le verbe pronominal 'se réveiller' exige le pronom réfléchi correspondant au sujet : 'nous nous réveillons' !"
    }
  }
];

const REPRISE_GRAMMAR_DOSSIERS = [
  {
    id: 'prep_destination',
    number: "01",
    title: "Les Prépositions de Lieu & Destination",
    subtitle: "Exprimer où l'on va et où l'on est : à, en, chez, dans",
    badge: "Repères Géographiques",
    calloutRegleOr: "Choisissez votre préposition selon la nature du lieu : ville (à), pays masculin (au), pays féminin (en) ou personne (chez).",
    piliers: [
      { icon: "✈️", title: "à / au / aux", desc: "Devant les villes (à Paris, à Montréal) et les pays masculins (au Canada, aux États-Unis)." },
      { icon: "🌎", title: "en", desc: "Devant les pays féminins (en France, en Italie) ou commençant par une voyelle (en Iran)." },
      { icon: "🏠", title: "chez", desc: "Pour désigner une personne ou son domicile (chez le médecin, chez moi, chez un ami)." },
      { icon: "📦", title: "dans", desc: "À l'intérieur d'un espace fermé (dans la classe, dans mon sac, dans le roman)." }
    ],
    formula: "à + ville | au + pays masc. | aux + pays plur. | en + pays fém. | chez + personne | dans + espace",
    calloutPiege: "Attention : on ne dit jamais 'je vais au médecin', mais bien 'je vais chez le médecin' !",
    trivia: {
      question: "Cet été, je vais voyager _______ France et visiter ma tante _______ elle.",
      options: ["en / chez", "à la / à"],
      correct: "en / chez",
      explanation: "Excellent ! La France est un pays féminin → 'en France', et on dit 'chez elle' pour désigner la personne."
    }
  },
  {
    id: 'prep_position',
    number: "02",
    title: "Les Prépositions de Position",
    subtitle: "Situer précisément les objets et personnages : devant, sur, sous, entre",
    badge: "Orientation Spatiale",
    calloutRegleOr: "Les prépositions de position créent le relief de votre décor narratif en situant chaque élément dans l'espace.",
    piliers: [
      { icon: "⬆️", title: "sur / sous", desc: "Sur = sur la surface (sur mon bureau). Sous = en dessous (sous la table, sous le porche)." },
      { icon: "👀", title: "devant / derrière", desc: "Devant = face avant (devant le tableau). Derrière = face arrière (derrière la scène)." },
      { icon: "🎯", title: "entre", desc: "Au milieu de deux repères (entre la porte et la fenêtre, entre deux cours)." },
      { icon: "📌", title: "au (à + le)", desc: "Contraction pour un lieu masculin (au cinéma, au gymnase, au laboratoire)." }
    ],
    formula: "sur (surface) | sous (en-dessous) | devant (face) | derrière (arrière) | entre (intervalle)",
    calloutPiege: "Ne confondez pas 'sur' (on) et 'sous' (under) : la prononciation est proche mais le sens est opposé !",
    trivia: {
      question: "Le stylo est tombé _______ le bureau, juste _______ le livre et la trousse.",
      options: ["sous / entre", "sur / chez"],
      correct: "sous / entre",
      explanation: "Parfait ! Le stylo est tombé 'sous' le bureau et se trouve 'entre' deux objets."
    }
  },
  {
    id: 'prep_relation',
    number: "03",
    title: "Les Prépositions de Relation & Moyen",
    subtitle: "Exprimer l'origine, l'accompagnement et la finalité : de, par, pour, avec, sans",
    badge: "Moyens & Liens",
    calloutRegleOr: "Ces prépositions relient les actions aux causes, aux moyens utilisés et aux objectifs poursuivis.",
    piliers: [
      { icon: "📍", title: "de / d'", desc: "Provenance, matière ou appartenance (venir de Lyon, le livre de Sami, le cours de français)." },
      { icon: "🤝", title: "avec / sans", desc: "Avec = compagnie ou instrument (avec soin, avec mon carnet). Sans = absence ou privation (sans faute, sans retard)." },
      { icon: "🚀", title: "par / pour", desc: "Par = moyen ou auteur (par train, écrit par l'auteur). Pour = destination ou but (pour réussir, pour le voyage)." }
    ],
    formula: "de (provenance) | avec (compagnie/moyen) | sans (absence) | par (agent/moyen) | pour (but)",
    calloutPiege: "Attention : 'pour' est presque toujours suivi d'un verbe à l'infinitif quand il exprime un objectif (ex. : étudier pour réussir).",
    trivia: {
      question: "J'ai préparé ce projet _______ beaucoup d'efforts _______ mon cours de français.",
      options: ["avec / pour", "sans / par"],
      correct: "avec / pour",
      explanation: "Bravo ! On réalise un travail 'avec' effort 'pour' un cours (but visé)."
    }
  },
  {
    id: 'verbes_aux',
    number: "04",
    title: "Être & Avoir — Les Piliers du Présent",
    subtitle: "Maîtriser les deux auxiliaires incontournables de la langue française",
    badge: "Auxiliaires Fondamentaux",
    calloutRegleOr: "Être exprime l'état, l'identité et les caractéristiques; Avoir exprime la possession, l'âge et les sensations physiques.",
    piliers: [
      { icon: "🪞", title: "Être (to be)", desc: "Je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont. → État, identité, nationalité, localisation." },
      { icon: "🎒", title: "Avoir (to have)", desc: "J'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont. → Possession, âge, sensations (faim, soif, peur)." }
    ],
    formula: "Être → identité, état ('je suis prêt') | Avoir → possession, âge, sensations ('j'ai 14 ans')",
    calloutPiege: "En français, on exprime l'âge avec AVOIR : 'J'ai 14 ans' (et non 'Je suis 14 ans') !",
    trivia: {
      question: "Nous _______ en retard parce que vous _______ perdu les clés !",
      options: ["sommes / avez", "avons / êtes"],
      correct: "sommes / avez",
      explanation: "Génial ! 'Nous sommes en retard' (état avec être) et 'vous avez perdu' (possession/action avec avoir)."
    }
  },
  {
    id: 'verbes_action',
    number: "05",
    title: "Aller, Faire, Venir & Prendre",
    subtitle: "Les 4 verbes d'action les plus fréquents au présent",
    badge: "Actions & Mouvements",
    calloutRegleOr: "Ces quatre verbes sont indispensables pour relater des activités quotidiennes et des déplacements.",
    piliers: [
      { icon: "🚶", title: "Aller & Venir", desc: "Aller : je vais, tu vas, il va, nous allons, vous allez, ils vont.\nVenir : je viens, tu viens, il vient, nous venons, vous venez, ils viennent." },
      { icon: "🎬", title: "Faire", desc: "Je fais, tu fais, il fait, nous faisons, vous faites, ils font. → Activités, devoirs, météo." },
      { icon: "☕", title: "Prendre", desc: "Je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent. → Saisir, consommer, monter dans un transport." }
    ],
    formula: "Pièges fréquents : 'vous faites' (et non vous faisez !), 'ils font', 'ils viennent', 'ils prennent'.",
    calloutPiege: "La 2e personne du pluriel de 'faire' est 'vous faites' (comme 'vous dites'). Ne dites jamais 'vous faisez' !",
    trivia: {
      question: "Ils _______ du vélo pendant que nous _______ le train.",
      options: ["font / prenons", "font / prenez"],
      correct: "font / prenons",
      explanation: "Super ! 'Ils font' (verbe faire) et 'nous prenons' (verbe prendre avec nous)."
    }
  },
  {
    id: 'verbes_modal',
    number: "06",
    title: "Pouvoir, Vouloir, Devoir & Savoir",
    subtitle: "Exprimer la capacité, le désir, la nécessité et la connaissance",
    badge: "Verbes Modaux",
    calloutRegleOr: "Les verbes modaux sont le plus souvent suivis directement d'un verbe à l'infinitif sans préposition.",
    piliers: [
      { icon: "💪", title: "Pouvoir (Capacité / Permission)", desc: "Je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent. → Exprimer une possibilité." },
      { icon: "✨", title: "Vouloir (Volonté / Souhait)", desc: "Je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent. → Exprimer un désir." },
      { icon: "⚖️", title: "Devoir (Obligation)", desc: "Je dois, tu dois, il doit, nous devons, vous devez, ils doivent. → Exprimer un devoir ou une nécessité." },
      { icon: "🧠", title: "Savoir (Connaissance / Compétence)", desc: "Je sais, tu sais, il sait, nous savons, vous savez, ils savent. → Exprimer un savoir-faire." }
    ],
    formula: "Verbe modal + infinitif : 'Je veux réussir', 'Je dois partir', 'Je sais chanter', 'Je peux t'aider'.",
    calloutPiege: "Attention : 'savoir' s'utilise pour un fait ou une action apprise (je sais nager), tandis que 'connaître' s'utilise pour une personne ou un lieu (je connais Sarah).",
    trivia: {
      question: "Elle _______ réussir parce qu'elle _______ ses leçons.",
      options: ["veut / sait", "dois / peux"],
      correct: "veut / sait",
      explanation: "Excellent ! 'Elle veut' (volonté avec le sujet elle) et 'elle sait ses leçons' (connaissance)."
    }
  }
];

const LE_PASSE_CONJ_DATA = {
  imparfait: {
    models: [
      { inf: "Parler (-ER)", conj: ["parlais", "parlais", "parlait", "parlions", "parliez", "parlaient"], stem: "parl-", term: "-ais, -ais, -ait, -ions, -iez, -aient" },
      { inf: "Finir (-IR)", conj: ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"], stem: "finiss-", term: "-issais, -issais, -issait, -issions, -issiez, -issaient" },
      { inf: "Vendre (-RE)", conj: ["vendais", "vendais", "vendait", "vendions", "vendiez", "vendaient"], stem: "vend-", term: "-ais, -ais, -ait, -ions, -iez, -aient" }
    ],
    essentiels: [
      { inf: "Être", conj: ["étais", "étais", "était", "étions", "étiez", "étaient"], stem: "ét-", note: "Seul verbe au radical irrégulier (terminaisons régulières)" },
      { inf: "Avoir", conj: ["avais", "avais", "avait", "avions", "aviez", "avaient"], stem: "av-", note: "Régulier sur nous avons" },
      { inf: "Faire", conj: ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"], stem: "fais-", note: "Prononcé [fəz-] (nous faisons)" },
      { inf: "Aller", conj: ["allais", "allais", "allait", "allions", "alliez", "allaient"], stem: "all-", note: "Régulier sur nous allons" },
      { inf: "Pouvoir", conj: ["pouvais", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient"], stem: "pouv-", note: "Régulier sur nous pouvons" },
      { inf: "Vouloir", conj: ["voulais", "voulais", "voulait", "voulions", "vouliez", "voulaient"], stem: "voul-", note: "Régulier sur nous voulons" },
      { inf: "Savoir", conj: ["savais", "savais", "savait", "savions", "saviez", "savaient"], stem: "sav-", note: "Régulier sur nous savons" },
      { inf: "Voir", conj: ["voyais", "voyais", "voyait", "voyions", "voyiez", "voyaient"], stem: "voy-", note: "Conserve le -y- (nous voyons)" },
      { inf: "Prendre", conj: ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"], stem: "pren-", note: "Un seul 'n' (nous prenons)" },
      { inf: "Dire", conj: ["disais", "disais", "disait", "disions", "disiez", "disaient"], stem: "dis-", note: "Régulier sur nous disons" }
    ]
  },
  pcAvoir: {
    models: [
      { inf: "Parler (-ER)", pp: "parlé", conj: ["ai parlé", "as parlé", "a parlé", "avons parlé", "avez parlé", "ont parlé"], rule: "Participe passé régulier en -é" },
      { inf: "Finir (-IR)", pp: "fini", conj: ["ai fini", "as fini", "a fini", "avons fini", "avez fini", "ont fini"], rule: "Participe passé régulier en -i" },
      { inf: "Vendre (-RE)", pp: "vendu", conj: ["ai vendu", "as vendu", "a vendu", "avons vendu", "avez vendu", "ont vendu"], rule: "Participe passé régulier en -u" }
    ],
    irreguliers: [
      { inf: "Avoir", pp: "eu", exSg: "Il a eu peur", exPl: "Ils ont eu le temps", note: "Prononcé [y] comme la lettre « u »" },
      { inf: "Être", pp: "été", exSg: "Elle a été héroïque", exPl: "Ils ont été prévenus", note: "Toujours invariable avec avoir" },
      { inf: "Faire", pp: "fait", exSg: "Il a fait un choix", exPl: "Ils ont fait demi-tour", note: "Terminaison muette en -t" },
      { inf: "Prendre", pp: "pris", exSg: "Elle a pris la clé", exPl: "Ils ont pris la fuite", note: "Terminaison muette en -s" },
      { inf: "Apprendre", pp: "appris", exSg: "Il a appris le plan", exPl: "Ils ont appris la vérité", note: "Famille de prendre" },
      { inf: "Comprendre", pp: "compris", exSg: "Elle a compris l'énigme", exPl: "Ils ont compris le danger", note: "Famille de prendre" },
      { inf: "Voir", pp: "vu", exSg: "Il a vu une ombre", exPl: "Ils ont vu le signal", note: "Participe court en -u" },
      { inf: "Mettre", pp: "mis", exSg: "Elle a mis son armure", exPl: "Ils ont mis le paquet", note: "Terminaison muette en -s" },
      { inf: "Dire", pp: "dit", exSg: "Il a dit son secret", exPl: "Ils ont dit la vérité", note: "Terminaison muette en -t" },
      { inf: "Écrire", pp: "écrit", exSg: "Elle a écrit un mot", exPl: "Ils ont écrit une lettre", note: "Terminaison muette en -t" },
      { inf: "Lire", pp: "lu", exSg: "Il a lu le grimoire", exPl: "Ils ont lu le rapport", note: "Participe court en -u" },
      { inf: "Pouvoir", pp: "pu", exSg: "Elle a pu s'échapper", exPl: "Ils ont pu intervenir", note: "Participe court en -u" },
      { inf: "Vouloir", pp: "voulu", exSg: "Il a voulu aider", exPl: "Ils ont voulu essayer", note: "Participe régulier en -u" },
      { inf: "Savoir", pp: "su", exSg: "Elle a su la réponse", exPl: "Ils ont su quoi faire", note: "Participe court en -u" },
      { inf: "Devoir", pp: "dû", exSg: "Il a dû partir tôt", exPl: "Ils ont dû battre en retraite", note: "Accent circonflexe au masc. sg (dû)" },
      { inf: "Boire", pp: "bu", exSg: "Elle a bu une potion", exPl: "Ils ont bu de l'eau", note: "Participe court en -u" },
      { inf: "Ouvrir", pp: "ouvert", exSg: "Il a ouvert la porte", exPl: "Ils ont ouvert les yeux", note: "Terminaison muette en -t" }
    ]
  },
  pcEtre: {
    accordsDemo: [
      { sujet: "Je (masc.)", forme: "suis allé", tag: "Masculin singulier (base)" },
      { sujet: "Je (fém.)", forme: "suis allée", tag: "+e (Féminin singulier)" },
      { sujet: "Tu (masc.)", forme: "es parti", tag: "Masculin singulier (base)" },
      { sujet: "Tu (fém.)", forme: "es partie", tag: "+e (Féminin singulier)" },
      { sujet: "Il / On", forme: "est descendu", tag: "Masculin singulier (base)" },
      { sujet: "Elle", forme: "est descendue", tag: "+e (Féminin singulier)" },
      { sujet: "Nous (masc.)", forme: "sommes arrivés", tag: "+s (Masculin pluriel)" },
      { sujet: "Nous (fém.)", forme: "sommes arrivées", tag: "+es (Féminin pluriel)" },
      { sujet: "Ils", forme: "sont venus", tag: "+s (Masculin pluriel)" },
      { sujet: "Elles", forme: "sont venues", tag: "+es (Féminin pluriel)" }
    ],
    vandertramp: [
      { l: "D", inf: "Devenir", pp: "devenu", fem: "devenue", pl: "devenus / devenues", ex: "Elle est devenue une grande héroïne." },
      { l: "R", inf: "Revenir", pp: "revenu", fem: "revenue", pl: "revenus / revenues", ex: "Ils sont revenus au quartier général." },
      { l: "M", inf: "Monter", pp: "monté", fem: "montée", pl: "montés / montées", ex: "Elle est montée sur les remparts." },
      { l: "R", inf: "Rester", pp: "resté", fem: "restée", pl: "restés / restées", ex: "Nous sommes restés calmes face au danger." },
      { l: "S", inf: "Sortir", pp: "sorti", fem: "sortie", pl: "sortis / sorties", ex: "Ils sont sortis discrètement du bâtiment." },
      { l: "V", inf: "Venir", pp: "venu", fem: "venue", pl: "venus / venues", ex: "Elle est venue nous prêter main-forte." },
      { l: "A", inf: "Aller", pp: "allé", fem: "allée", pl: "allés / allées", ex: "Elles sont allées chercher du secours." },
      { l: "N", inf: "Naître", pp: "né", fem: "née", pl: "nés / nées", ex: "Le héros est né dans ce village lointain." },
      { l: "D", inf: "Descendre", pp: "descendu", fem: "descendue", pl: "descendus / descendues", ex: "Ils sont descendus prudemment dans la mine." },
      { l: "E", inf: "Entrer", pp: "entré", fem: "entrée", pl: "entrés / entrées", ex: "Elle est entrée dans la pièce secrète." },
      { l: "R", inf: "Rentrer", pp: "rentré", fem: "rentrée", pl: "rentrés / rentrées", ex: "Nous sommes rentrés sains et saufs à minuit." },
      { l: "T", inf: "Tomber", pp: "tombé", fem: "tombée", pl: "tombés / tombées", ex: "La nuit est tombée d'un coup sur la ville." },
      { l: "R", inf: "Retourner", pp: "retourné", fem: "retournée", pl: "retournés / retournées", ex: "Elle est retournée voir ses alliés." },
      { l: "A", inf: "Arriver", pp: "arrivé", fem: "arrivée", pl: "arrivés / arrivées", ex: "Les renforts sont arrivés à la rescousse." },
      { l: "M", inf: "Mourir", pp: "mort", fem: "morte", pl: "morts / mortes", ex: "L'ennemi redouté est mort à la fin du duel." },
      { l: "P", inf: "Partir", pp: "parti", fem: "partie", pl: "partis / parties", ex: "Elles sont parties pour une périlleuse quête." },
      { l: "+", inf: "Passer (par)", pp: "passé", fem: "passée", pl: "passés / passées", ex: "Le messager est passé par le col secret." }
    ]
  },
  pronominaux: [
    {
      inf: "Se réveiller",
      formes: [
        { pr: "Je", v: "me suis réveillé(e)" },
        { pr: "Tu", v: "t'es réveillé(e)" },
        { pr: "Il / On", v: "s'est réveillé" },
        { pr: "Elle", v: "s'est réveillée" },
        { pr: "Nous", v: "nous sommes réveillé(e)s" },
        { pr: "Vous", v: "vous êtes réveillé(e)(s)" },
        { pr: "Ils", v: "se sont réveillés" },
        { pr: "Elles", v: "se sont réveillées" }
      ]
    },
    {
      inf: "Se souvenir",
      formes: [
        { pr: "Je", v: "me suis souvenu(e)" },
        { pr: "Tu", v: "t'es souvenu(e)" },
        { pr: "Il / On", v: "s'est souvenu" },
        { pr: "Elle", v: "s'est souvenue" },
        { pr: "Nous", v: "nous sommes souvenu(e)s" },
        { pr: "Vous", v: "vous êtes souvenu(e)(s)" },
        { pr: "Ils", v: "se sont souvenus" },
        { pr: "Elles", v: "se sont souvenues" }
      ]
    },
    {
      inf: "Se dépêcher",
      formes: [
        { pr: "Je", v: "me suis dépêché(e)" },
        { pr: "Tu", v: "t'es dépêché(e)" },
        { pr: "Il / On", v: "s'est dépêché" },
        { pr: "Elle", v: "s'est dépêchée" },
        { pr: "Nous", v: "nous sommes dépêché(e)s" },
        { pr: "Vous", v: "vous êtes dépêché(e)(s)" },
        { pr: "Ils", v: "se sont dépêchés" },
        { pr: "Elles", v: "se sont dépêchées" }
      ]
    }
  ],
  comparaison: [
    {
      verb: "Être",
      imparfait: "Il était calme et concentré.",
      sensImp: "Description continue de l'atmosphère ou de l'état d'esprit.",
      pc: "Il a été surpris par une explosion !",
      sensPc: "Changement d'état soudain, événement daté qui survient."
    },
    {
      verb: "Avoir",
      imparfait: "Elle avait peur des hauteurs.",
      sensImp: "Sentiment ou état permanent qui sert de décor.",
      pc: "Elle a eu une brillante idée à cet instant.",
      sensPc: "Surgissement ponctuel d'une idée dans l'action."
    },
    {
      verb: "Savoir",
      imparfait: "Il savait que le donjon était piégé.",
      sensImp: "Connaissance préexistante, état d'esprit continu.",
      pc: "Il a su la vérité en lisant la lettre.",
      sensPc: "Moment précis où l'information est découverte / apprise."
    },
    {
      verb: "Pouvoir",
      imparfait: "L'héroïne pouvait sauter très haut.",
      sensImp: "Capacité générale ou pouvoir permanent.",
      pc: "L'héroïne a pu franchir le ravin d'un bond.",
      sensPc: "Réussite ponctuelle d'un exploit dans la scène."
    },
    {
      verb: "Vouloir",
      imparfait: "Ils voulaient protéger le village.",
      sensImp: "Désir, volonté ou intention d'arrière-plan.",
      pc: "Ils ont voulu attaquer à minuit pile.",
      sensPc: "Prise de décision nette / passage à l'acte concret."
    },
    {
      verb: "Devoir",
      imparfait: "Chaque soir, il devait surveiller l'entrée.",
      sensImp: "Habitude, consigne régulière ou obligation d'arrière-plan.",
      pc: "Il a dû fuir quand le pont s'est effondré.",
      sensPc: "Obligation immédiate provoquée par un événement."
    }
  ]
};

const REPRISE_CONJ_DATA = {
  reguliers: [
    { inf: "Parler (-ER)", conj: ["parle", "parles", "parle", "parlons", "parlez", "parlent"], ends: "-e, -es, -e, -ons, -ez, -ent" },
    { inf: "Finir (-IR)", conj: ["finis", "finis", "finit", "finissons", "finissez", "finissent"], ends: "-is, -is, -it, -issons, -issez, -issent" },
    { inf: "Vendre (-RE)", conj: ["vends", "vends", "vend", "vendons", "vendez", "vendent"], ends: "-s, -s, —, -ons, -ez, -ent" }
  ],
  essentiels: [
    { inf: "Être", conj: ["suis", "es", "est", "sommes", "êtes", "sont"] },
    { inf: "Avoir", conj: ["ai", "as", "a", "avons", "avez", "ont"] },
    { inf: "Faire", conj: ["fais", "fais", "fait", "faisons", "faites", "font"] },
    { inf: "Aller", conj: ["vais", "vas", "va", "allons", "allez", "vont"] },
    { inf: "Pouvoir", conj: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"] },
    { inf: "Vouloir", conj: ["veux", "veux", "veut", "voulons", "voulez", "veulent"] },
    { inf: "Devoir", conj: ["dois", "dois", "doit", "devons", "devez", "doivent"] },
    { inf: "Venir", conj: ["viens", "viens", "vient", "venons", "venez", "viennent"] },
    { inf: "Prendre", conj: ["prends", "prends", "prend", "prenons", "prenez", "prennent"] },
    { inf: "Savoir", conj: ["sais", "sais", "sait", "savons", "savez", "savent"] }
  ]
};

function formatConjugatedVerb(pronounIdx, verbData) {
  const pronounLabels = ["Je", "Tu", "Il / Elle", "Nous", "Vous", "Ils / Elles"];
  let subject = pronounLabels[pronounIdx];
  const stem = verbData.stem;
  const ending = verbData.endings[pronounIdx];

  // Elision: J'aimais when verb/stem starts with a vowel or silent h
  if (pronounIdx === 0 && /^[aeiouyéèêâ]/i.test(stem)) {
    return {
      subject: "J'",
      hasSpace: false,
      stem,
      ending
    };
  }

  return {
    subject,
    hasSpace: true,
    stem,
    ending
  };
}

function GrammarSection() {
  const { chapterId } = useParams();
  const isReprise = chapterId === 'unite-reprise';
  const currentDossiers = isReprise ? REPRISE_GRAMMAR_DOSSIERS : LE_PASSE_GRAMMAR_DOSSIERS;

  // Secondary header tab state (defaulting to 'dossiers' so content is immediately visible)
  const [activeHeaderTab, setActiveHeaderTab] = useState('dossiers');

  // Filter for Conjugation Guide tables
  const [conjugationFilter, setConjugationFilter] = useState('all');

  // Creative Studio Station state (for Unit 1)
  const [activeStationId, setActiveStationId] = useState('imparfait');

  // Interactive Accord Mirror for ÊTRE (for Unit 1)
  const [selectedAccordPronoun, setSelectedAccordPronoun] = useState('Elle');

  // Arsenal du Scénariste (Conjugation Guide in Unit 1)
  const [verbSearchQuery, setVerbSearchQuery] = useState('');
  const [highlightPronounIdx, setHighlightPronounIdx] = useState(null);
  const [activeArsenalModule, setActiveArsenalModule] = useState('imparfait');
  const [selectedParticipleFamily, setSelectedParticipleFamily] = useState('all');

  // Accordion state: tracks which folder ID is currently open
  const [openFolderId, setOpenFolderId] = useState(isReprise ? 'prep_destination' : 'imparfait');

  // Interactive Quiz state for trivia chips
  const [userQuizAnswers, setUserQuizAnswers] = useState({});

  // Active Pronoun Index for Conjugation Simulator
  const [activePronounIdx, setActivePronounIdx] = useState(0);
  const pronounsList = ["Je / J'", "Tu", "Il / Elle", "Nous", "Vous", "Ils / Elles"];

  const toggleFolder = (folderId) => {
    if (openFolderId === folderId) {
      setOpenFolderId(null);
    } else {
      setOpenFolderId(folderId);
    }
  };

  const handleQuizAnswer = (folderId, selectedOpt) => {
    setUserQuizAnswers({
      ...userQuizAnswers,
      [folderId]: selectedOpt
    });
  };

  const renderTriviaChallenge = (dossierId) => {
    const folder = LE_PASSE_GRAMMAR_DOSSIERS.find(d => d.id === dossierId);
    if (!folder || !folder.trivia) return null;
    const trivia = folder.trivia;
    const answer = userQuizAnswers[dossierId];

    return (
      <div className="studio-trivia-challenge-card mt-6">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle size={18} className="text-indigo-600 shrink-0" />
          <span className="font-black text-xs uppercase tracking-wider text-slate-900">
            🎯 Défi Éclair du Scénariste :
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 mb-3">{trivia.question}</p>
        <div className="flex flex-wrap gap-2.5">
          {trivia.options.map((opt, oIdx) => {
            const isSelected = answer === opt;
            const isCorrect = opt === trivia.correct;
            let btnClass = "comprehension-option-btn";
            if (answer) {
              if (isSelected) {
                btnClass += isCorrect ? " correct" : " incorrect";
              }
            }
            return (
              <button
                key={oIdx}
                type="button"
                onClick={() => handleQuizAnswer(dossierId, opt)}
                className={btnClass}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {answer && (
          <div className={`comprehension-feedback ${answer === trivia.correct ? 'correct' : 'incorrect'} mt-3`}>
            {answer === trivia.correct ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <span>{trivia.explanation}</span>
              </div>
            ) : (
              <span>❌ Ce n'est pas tout à fait cela. Réessayez pour identifier la bonne forme !</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grammar-header-container text-left fade-in">
      
      {/* Secondary Header Tab Bar */}
      <div className="section-navigation grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Header Tab 1: Dossiers d'Atelier */}
        <div 
          onClick={() => setActiveHeaderTab(activeHeaderTab === 'dossiers' ? null : 'dossiers')}
          className={`section-card cursor-pointer ${
            activeHeaderTab === 'dossiers' ? 'active' : ''
          }`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge grammar-badge">
            {isReprise ? <Compass size={28} className="text-white" /> : <BookOpen size={28} className="text-white" />}
          </div>
          <h3>
            {isReprise 
              ? "🧭 L'Atelier des Fondations : Verbes & Prépositions" 
              : "📖 L'Atelier du Récit : Passé & Narration"}
          </h3>
        </div>

        {/* Header Tab 2: Guide de Conjugaison */}
        <div 
          onClick={() => setActiveHeaderTab(activeHeaderTab === 'conjugaison-irreguliers' ? null : 'conjugaison-irreguliers')}
          className={`section-card cursor-pointer ${
            activeHeaderTab === 'conjugaison-irreguliers' ? 'active' : ''
          }`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge vocab-badge bg-gradient-to-tr from-indigo-600 to-sky-600">
            <Zap size={28} className="text-white" />
          </div>
          <h3>
            {isReprise 
              ? "⚡ Guide de Conjugaison : Le Présent" 
              : "⚡ L'Arsenal de Conjugaison : Les Essentiels"}
          </h3>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CONJUGAISON AU PRÉSENT — VERBES -ER, -IR, -RE & ESSENTIELS   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* GUIDE DE CONJUGAISON — TABLEAUX RÉCAPITULATIFS                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* GUIDE DE CONJUGAISON — TABLEAUX RÉCAPITULATIFS OU ARSENAL DU SCÉNARISTE */}
      {activeHeaderTab === 'conjugaison-irreguliers' && (
        isReprise ? (
          <div className="conjugation-guide-frame fade-in">
            {/* Header Banner for Reprise */}
            <div className="conjugation-guide-header">
              <div>
                <h3 className="conjugation-guide-title">
                  <Zap className="text-amber-500" size={26} />
                  Tableaux Récapitulatifs de Conjugaison : Le Présent
                </h3>
                <p className="conjugation-guide-desc">
                  Verbes réguliers en -ER, -IR, -RE et les 10 verbes essentiels de la langue française.
                </p>
              </div>
              <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-xs flex items-center gap-1.5 self-start sm:self-auto">
                <BookOpenCheck size={14} />
                ⚡ Repères Fondamentaux
              </span>
            </div>

            {/* Filter Pills Bar for Reprise */}
            <div className="conjugation-filter-bar">
              <button 
                type="button" 
                onClick={() => setConjugationFilter('all')} 
                className={`conjugation-filter-btn ${conjugationFilter === 'all' ? 'active' : ''}`}
              >
                🌟 Tous les Tableaux
              </button>
              <button 
                type="button" 
                onClick={() => setConjugationFilter('reguliers')} 
                className={`conjugation-filter-btn ${conjugationFilter === 'reguliers' ? 'active' : ''}`}
              >
                📘 Verbes Réguliers (-ER, -IR, -RE)
              </button>
              <button 
                type="button" 
                onClick={() => setConjugationFilter('essentiels')} 
                className={`conjugation-filter-btn ${conjugationFilter === 'essentiels' ? 'active' : ''}`}
              >
                ⚡ 10 Verbes Essentiels
              </button>
            </div>

            {/* Reprise Tables */}
            <div className="space-y-6">
              {/* Verbes Réguliers au Présent */}
              {(conjugationFilter === 'all' || conjugationFilter === 'reguliers') && (
                <div className="conjugation-section-card accent-present">
                  <div className="conjugation-section-header">
                    <h4 className="conjugation-section-title">
                      <BookOpenCheck size={18} className="text-indigo-600" />
                      Verbes Réguliers au Présent (-ER, -IR, -RE)
                    </h4>
                    <p className="conjugation-section-subtitle">
                      Les bases de la conjugaison au présent de l'indicatif.
                    </p>
                  </div>

                  <div className="conjugation-table-wrapper">
                    <table className="conjugation-table">
                      <thead>
                        <tr>
                          <th className="conjugation-sticky-cell">Modèle</th>
                          <th>Je / J'</th>
                          <th>Tu</th>
                          <th>Il / Elle</th>
                          <th>Nous</th>
                          <th>Vous</th>
                          <th>Ils / Elles</th>
                          <th>Terminaisons</th>
                        </tr>
                      </thead>
                      <tbody>
                        {REPRISE_CONJ_DATA.reguliers.map((v, idx) => (
                          <tr key={idx}>
                            <td className="conjugation-sticky-cell font-black">{v.inf}</td>
                            {v.conj.map((c, cIdx) => {
                              const pronouns = ["je", "tu", "il", "nous", "vous", "ils"];
                              let p = pronouns[cIdx];
                              let space = true;
                              if (cIdx === 0 && /^[aeiouyéèêâ]/i.test(c)) {
                                p = "j'";
                                space = false;
                              }
                              return (
                                <td key={cIdx}>
                                  <div className="conjugation-cell-flex">
                                    <span className="conjugation-pronoun-tag">{p}</span>
                                    {space && <span>&nbsp;</span>}
                                    <span className="conjugation-verb-bold text-slate-900">{c}</span>
                                  </div>
                                </td>
                              );
                            })}
                            <td className="text-xs font-bold text-indigo-700 italic">{v.ends}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 10 Verbes Essentiels au Présent */}
              {(conjugationFilter === 'all' || conjugationFilter === 'essentiels') && (
                <div className="conjugation-section-card accent-present">
                  <div className="conjugation-section-header">
                    <h4 className="conjugation-section-title">
                      <Zap size={18} className="text-amber-500" />
                      Les 10 Verbes Essentiels au Présent (Irréguliers Incontournables)
                    </h4>
                    <p className="conjugation-section-subtitle">
                      Être, Avoir, Faire, Aller, Pouvoir, Vouloir, Devoir, Venir, Prendre, Savoir.
                    </p>
                  </div>

                  <div className="conjugation-table-wrapper">
                    <table className="conjugation-table">
                      <thead>
                        <tr>
                          <th className="conjugation-sticky-cell">Infinitif</th>
                          <th>Je / J'</th>
                          <th>Tu</th>
                          <th>Il / Elle</th>
                          <th>Nous</th>
                          <th>Vous</th>
                          <th>Ils / Elles</th>
                        </tr>
                      </thead>
                      <tbody>
                        {REPRISE_CONJ_DATA.essentiels.map((v, idx) => (
                          <tr key={idx}>
                            <td className="conjugation-sticky-cell font-black">{v.inf}</td>
                            {v.conj.map((c, cIdx) => {
                              const pronouns = ["je", "tu", "il", "nous", "vous", "ils"];
                              let p = pronouns[cIdx];
                              let space = true;
                              if (cIdx === 0 && /^[aeiouyéèêâ]/i.test(c)) {
                                p = "j'";
                                space = false;
                              }
                              return (
                                <td key={cIdx}>
                                  <div className="conjugation-cell-flex">
                                    <span className="conjugation-pronoun-tag">{p}</span>
                                    {space && <span>&nbsp;</span>}
                                    <span className="conjugation-verb-bold text-slate-900">{c}</span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Arsenal du Scénariste for Unité 1 */
          <div className="arsenal-container fade-in">
            {/* Header Banner & Utility Controls */}
            <div className="arsenal-header-banner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200/60">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                      ⚡ Boîte à Outils du Récit
                    </span>
                    <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
                      Immersion 9e Année
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>L'Arsenal du Scénariste : Guide de Conjugaison</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                    L'aide-mémoire complet des temps du récit : radicaux, modèles, coffre des 17 participes passés, accords d'ÊTRE et nuances de sens !
                  </p>
                </div>
                <span className="text-xs font-black text-indigo-900 bg-indigo-100/80 px-3.5 py-1.5 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-1.5 shrink-0">
                  <Sparkles size={15} className="text-amber-500" />
                  Répertoire & Formules
                </span>
              </div>

              {/* Utility Toolbar: Live Verb Search & Target Pronoun Filter */}
              <div className="arsenal-toolbar-grid">
                {/* Search Bar */}
                <div className="arsenal-search-box">
                  <Search size={16} className="text-slate-400 shrink-0 ml-1" />
                  <input
                    type="text"
                    value={verbSearchQuery}
                    onChange={(e) => setVerbSearchQuery(e.target.value)}
                    placeholder="Rechercher un verbe (ex: avoir, pouvoir, partir, descendre...)"
                    className="arsenal-search-input"
                  />
                  {verbSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setVerbSearchQuery('')}
                      className="arsenal-search-clear-btn"
                      title="Effacer la recherche"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Pronoun Highlighter Chips */}
                <div className="arsenal-pronoun-filter-row">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 shrink-0">
                    Cibler un Pronom :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHighlightPronounIdx(null)}
                      className={`arsenal-pronoun-chip ${highlightPronounIdx === null ? 'active' : ''}`}
                    >
                      Tous
                    </button>
                    {["Je / J'", "Tu", "Il / Elle", "Nous", "Vous", "Ils / Elles"].map((pr, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setHighlightPronounIdx(highlightPronounIdx === pIdx ? null : pIdx)}
                        className={`arsenal-pronoun-chip ${highlightPronounIdx === pIdx ? 'active' : ''}`}
                      >
                        {pr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {verbSearchQuery && (
                <div className="arsenal-search-alert mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">
                    🔎 Filtrage actif pour : <strong>« {verbSearchQuery} »</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setVerbSearchQuery('')}
                    className="text-xs font-extrabold text-amber-700 underline hover:text-amber-900"
                  >
                    Réinitialiser le filtre
                  </button>
                </div>
              )}
            </div>

            {/* 5-Module Navigator Grid */}
            <div className="arsenal-modules-nav-grid">
              {ARSENAL_MODULES.map((mod) => {
                const isActive = activeArsenalModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveArsenalModule(mod.id)}
                    className={`arsenal-module-tab-card module-${mod.accentColor} ${isActive ? 'active' : ''}`}
                  >
                    <div className="module-tab-top">
                      <span className="module-tab-num">{mod.num}</span>
                      <span className="module-tab-tag">{mod.tag}</span>
                    </div>
                    <div className="module-tab-main">
                      <span className="module-tab-icon">{mod.icon}</span>
                      <div className="text-left">
                        <h4 className="module-tab-title">{mod.title}</h4>
                        <p className="module-tab-subtitle">{mod.subtitle}</p>
                      </div>
                    </div>
                    <div className="module-tab-footer">
                      {isActive ? (
                        <span className="module-status-active">
                          <span className="pulse-dot"></span> Module Actif
                        </span>
                      ) : (
                        <span className="module-status-inactive">
                          Consulter <ArrowRight size={13} className="inline ml-0.5" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Module Content Panels */}
            <div className="arsenal-module-content-wrapper">
              
              {/* ══════════════════════════════════════════════ */}
              {/* MODULE 1: L'ARMURERIE DE L'IMPARFAIT           */}
              {/* ══════════════════════════════════════════════ */}
              {activeArsenalModule === 'imparfait' && (
                <div className="arsenal-panel fade-in">
                  <div className="station-hero-banner bg-gradient-to-r from-sky-950 via-sky-900 to-indigo-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-sky-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl shrink-0">
                          🕒
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-sky-400/20 text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                              Module 01 • L'Arrière-Plan Narratif
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">L'Armurerie de l'Imparfait</h3>
                        </div>
                      </div>
                      <div className="bg-sky-950/60 border border-sky-500/30 rounded-xl px-3 py-1.5 text-xs text-sky-200 font-semibold">
                        Décor & Continuité
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-sky-100/90 font-medium leading-relaxed">
                      L'imparfait décrit les états continus, les portraits, la météo et les actions habituelles. Ses terminaisons sont universelles et invariables pour tous les verbes.
                    </p>
                  </div>

                  {/* Formula Pill */}
                  <div className="conjugation-formula-pill imparfait mb-5">
                    🔑 Formule : Radical de « Nous » au présent + Terminaisons (-ais, -ais, -ait, -ions, -iez, -aient)
                  </div>

                  {/* Table 1.1: Modèles Réguliers */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                      <span>📘</span> A. Modèles Réguliers (-ER, -IR, -RE)
                    </h5>
                    <div className="conjugation-table-wrapper">
                      <table className="conjugation-table">
                        <thead>
                          <tr>
                            <th className="conjugation-sticky-cell">Modèle</th>
                            {["Je / J'", "Tu", "Il / Elle", "Nous", "Vous", "Ils / Elles"].map((p, pIdx) => (
                              <th key={pIdx} className={highlightPronounIdx === pIdx ? 'bg-indigo-800 text-amber-300 font-black' : ''}>
                                {p}
                              </th>
                            ))}
                            <th>Terminaisons</th>
                          </tr>
                        </thead>
                        <tbody>
                          {LE_PASSE_CONJ_DATA.imparfait.models
                            .filter(v => !verbSearchQuery || v.inf.toLowerCase().includes(verbSearchQuery.trim().toLowerCase()))
                            .map((v, idx) => (
                            <tr key={idx}>
                              <td className="conjugation-sticky-cell font-black">{v.inf}</td>
                              {v.conj.map((c, cIdx) => {
                                const pronouns = ["je", "tu", "il", "nous", "vous", "ils"];
                                let p = pronouns[cIdx];
                                let space = true;
                                if (cIdx === 0 && /^[aeiouyéèêâ]/i.test(c)) {
                                  p = "j'";
                                  space = false;
                                }
                                const isHighlighted = highlightPronounIdx === cIdx;
                                return (
                                  <td key={cIdx} className={isHighlighted ? 'bg-sky-50 font-black' : ''}>
                                    <div className="conjugation-cell-flex">
                                      <span className="conjugation-pronoun-tag">{p}</span>
                                      {space && <span>&nbsp;</span>}
                                      <span className="conjugation-verb-bold text-sky-900">{c}</span>
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="text-xs italic text-sky-700 font-bold">{v.term}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table 1.2: Auxiliaires et Verbes Essentiels */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                      <span>⚡</span> B. Auxiliaires & Verbes Fréquents du Récit à l'Imparfait
                    </h5>
                    <div className="conjugation-table-wrapper">
                      <table className="conjugation-table">
                        <thead>
                          <tr>
                            <th className="conjugation-sticky-cell">Verbe</th>
                            {["Je / J'", "Tu", "Il / Elle", "Nous", "Vous", "Ils / Elles"].map((p, pIdx) => (
                              <th key={pIdx} className={highlightPronounIdx === pIdx ? 'bg-indigo-800 text-amber-300 font-black' : ''}>
                                {p}
                              </th>
                            ))}
                            <th>Radical & Particularité</th>
                          </tr>
                        </thead>
                        <tbody>
                          {LE_PASSE_CONJ_DATA.imparfait.essentiels
                            .filter(v => !verbSearchQuery || v.inf.toLowerCase().includes(verbSearchQuery.trim().toLowerCase()) || v.stem.toLowerCase().includes(verbSearchQuery.trim().toLowerCase()))
                            .map((v, idx) => (
                            <tr key={idx}>
                              <td className="conjugation-sticky-cell font-black">{v.inf}</td>
                              {v.conj.map((c, cIdx) => {
                                const pronouns = ["je", "tu", "il", "nous", "vous", "ils"];
                                let p = pronouns[cIdx];
                                let space = true;
                                if (cIdx === 0 && /^[aeiouyéèêâ]/i.test(c)) {
                                  p = "j'";
                                  space = false;
                                }
                                const isHighlighted = highlightPronounIdx === cIdx;
                                return (
                                  <td key={cIdx} className={isHighlighted ? 'bg-sky-50 font-black' : ''}>
                                    <div className="conjugation-cell-flex">
                                      <span className="conjugation-pronoun-tag">{p}</span>
                                      {space && <span>&nbsp;</span>}
                                      <span className="conjugation-verb-bold text-slate-900">{c}</span>
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="text-xs text-slate-600 font-medium">
                                <span className="font-bold text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded mr-1">{v.stem}</span>
                                <span>{v.note}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Golden Rule Callout */}
                  <div className="narrative-callout callout-regle-or">
                    <div className="callout-header">
                      <Lightbulb size={18} className="text-amber-600" />
                      <span className="callout-title">Règle d'or de l'Imparfait :</span>
                    </div>
                    <p className="callout-text">
                      Les terminaisons <strong>-ais, -ais, -ait, -ions, -iez, -aient</strong> sont rigoureusement identiques pour TOUS les verbes du français, sans exception. Seul le verbe <strong>Être</strong> a un radical irrégulier (<em>ét-</em>).
                    </p>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════ */}
              {/* MODULE 2: LE COFFRE DES PARTICIPES (AVOIR)    */}
              {/* ══════════════════════════════════════════════ */}
              {activeArsenalModule === 'pc_avoir' && (
                <div className="arsenal-panel fade-in">
                  <div className="station-hero-banner bg-gradient-to-r from-amber-950 via-amber-900 to-slate-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-amber-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0">
                          ⚡
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                              Module 02 • Premier Plan & Événements
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">Le Coffre des Participes Passés (AVOIR)</h3>
                        </div>
                      </div>
                      <div className="bg-amber-950/60 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-amber-200 font-semibold">
                        ~90 % des Verbes Français
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-amber-100/90 font-medium leading-relaxed">
                      Le passé composé fait progresser l'intrigue. Avec l'auxiliaire AVOIR, le participe passé ne s'accorde jamais avec le sujet.
                    </p>
                  </div>

                  {/* Formula Pill */}
                  <div className="conjugation-formula-pill pc-avoir mb-5">
                    🔑 Formule : Sujet + AVOIR au présent (ai, as, a, avons, avez, ont) + Participe Passé
                  </div>

                  {/* Table 2.1: Modèles Réguliers */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                      <span>🎯</span> A. Modèles Réguliers (-ER ➔ -é, -IR ➔ -i, -RE ➔ -u)
                    </h5>
                    <div className="conjugation-table-wrapper">
                      <table className="conjugation-table">
                        <thead>
                          <tr>
                            <th className="conjugation-sticky-cell">Modèle</th>
                            <th>Participe</th>
                            {["Je / J'", "Tu", "Il / Elle", "Nous", "Vous", "Ils / Elles"].map((p, pIdx) => (
                              <th key={pIdx} className={highlightPronounIdx === pIdx ? 'bg-amber-800 text-amber-200 font-black' : ''}>
                                {p}
                              </th>
                            ))}
                            <th>Règle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {LE_PASSE_CONJ_DATA.pcAvoir.models
                            .filter(v => !verbSearchQuery || v.inf.toLowerCase().includes(verbSearchQuery.trim().toLowerCase()))
                            .map((v, idx) => (
                            <tr key={idx}>
                              <td className="conjugation-sticky-cell font-black">{v.inf}</td>
                              <td className="font-extrabold text-amber-700 bg-amber-50">{v.pp}</td>
                              {v.conj.map((c, cIdx) => {
                                const isHighlighted = highlightPronounIdx === cIdx;
                                return (
                                  <td key={cIdx} className={isHighlighted ? 'bg-amber-50 font-black' : ''}>
                                    <span className="conjugation-verb-bold text-slate-900">{c}</span>
                                  </td>
                                );
                              })}
                              <td className="text-xs italic text-amber-800 font-bold">{v.rule}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2.2: Le Répertoire des 17 Participes Passés Irréguliers */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                          <Flame size={18} className="text-amber-500" />
                          B. Répertoire des 17 Participes Passés Irréguliers (Classés par Famille)
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Filtrer par terminaison phonétique pour mémoriser les correspondances en un coup d'œil :
                        </p>
                      </div>
                    </div>

                    {/* Family Filter Buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        { id: 'all', label: '🌟 Tous les 17' },
                        { id: 'u', label: '🟡 Famille en -u' },
                        { id: 'is', label: '🔵 Famille en -is' },
                        { id: 'it', label: '🟣 Famille en -it' },
                        { id: 'special', label: '🟢 Spéciaux (-ert, été)' }
                      ].map((fam) => (
                        <button
                          key={fam.id}
                          type="button"
                          onClick={() => setSelectedParticipleFamily(fam.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            selectedParticipleFamily === fam.id
                              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-black'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {fam.label}
                        </button>
                      ))}
                    </div>

                    {/* Table View with Examples */}
                    <div className="conjugation-table-wrapper">
                      <table className="conjugation-table">
                        <thead>
                          <tr>
                            <th className="conjugation-sticky-cell">Infinitif</th>
                            <th>Participe Passé</th>
                            <th>Exemple au Singulier</th>
                            <th>Exemple au Pluriel</th>
                            <th>Astuce de Mémorisation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {LE_PASSE_CONJ_DATA.pcAvoir.irreguliers
                            .filter(v => {
                              const matchesSearch = !verbSearchQuery || 
                                v.inf.toLowerCase().includes(verbSearchQuery.trim().toLowerCase()) || 
                                v.pp.toLowerCase().includes(verbSearchQuery.trim().toLowerCase());
                              if (!matchesSearch) return false;
                              if (selectedParticipleFamily === 'all') return true;
                              if (selectedParticipleFamily === 'u') return v.pp.endsWith('u') || v.pp === 'dû';
                              if (selectedParticipleFamily === 'is') return v.pp.endsWith('is') || v.pp === 'mis';
                              if (selectedParticipleFamily === 'it') return v.pp.endsWith('it') || v.pp === 'fait';
                              if (selectedParticipleFamily === 'special') return v.inf === 'Être' || v.inf === 'Ouvrir';
                              return true;
                            })
                            .map((v, idx) => (
                            <tr key={idx}>
                              <td className="conjugation-sticky-cell font-black">{v.inf}</td>
                              <td>
                                <span className="inline-block bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-md border border-amber-300 shadow-2xs">
                                  {v.pp}
                                </span>
                              </td>
                              <td className="font-semibold text-slate-800 italic">« {v.exSg} »</td>
                              <td className="font-semibold text-slate-800 italic">« {v.exPl} »</td>
                              <td className="text-xs text-slate-600 font-medium">{v.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Golden Rule Callout */}
                  <div className="narrative-callout callout-regle-or">
                    <div className="callout-header">
                      <Shield size={18} className="text-amber-600" />
                      <span className="callout-title">Règle d'or avec AVOIR :</span>
                    </div>
                    <p className="callout-text">
                      Le participe passé ne s'accorde <strong>JAMAIS</strong> avec le sujet ! On écrit : <em>« Elle a parlé »</em>, <em>« Elles ont fini »</em>, <em>« Nous avons vendu »</em>.
                    </p>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════ */}
              {/* MODULE 3: LA BOUSSOLE ÊTRE & ACCORDS           */}
              {/* ══════════════════════════════════════════════ */}
              {activeArsenalModule === 'pc_etre' && (
                <div className="arsenal-panel fade-in">
                  <div className="station-hero-banner bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-emerald-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shrink-0">
                          🧭
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                              Module 03 • Mouvements & Accords
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">La Boussole ÊTRE & Matrice des Accords</h3>
                        </div>
                      </div>
                      <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs text-emerald-200 font-semibold">
                        Accord Obligatoire
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
                      Les 17 verbes de déplacement physique et de changement d'état ainsi que tous les verbes pronominaux s'accordent en genre et en nombre avec le sujet.
                    </p>
                  </div>

                  {/* Formula Pill */}
                  <div className="conjugation-formula-pill pc-etre mb-5">
                    🔑 Formule : Sujet + ÊTRE au présent (suis, es, est, sommes, êtes, sont) + Participe Passé ACCORDÉ (+e, +s, +es)
                  </div>

                  {/* Table 3.1: Mécanisme d'Accord */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                      <span>🪞</span> A. Démonstration du Mécanisme d'Accord en Genre et en Nombre
                    </h5>
                    <div className="conjugation-table-wrapper">
                      <table className="conjugation-table">
                        <thead>
                          <tr>
                            <th className="conjugation-sticky-cell">Sujet</th>
                            <th>Forme Accordée au Passé Composé</th>
                            <th>Explication de la Règle d'Accord</th>
                          </tr>
                        </thead>
                        <tbody>
                          {LE_PASSE_CONJ_DATA.pcEtre.accordsDemo.map((a, idx) => (
                            <tr key={idx}>
                              <td className="conjugation-sticky-cell font-bold">{a.sujet}</td>
                              <td className="font-extrabold text-emerald-800 text-sm">{a.forme}</td>
                              <td>
                                <span className="conjugation-accord-chip">
                                  {a.tag}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table 3.2: 17 Verbes DR & MRS VANDERTRAMP */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                      <span>🏔️</span> B. Répertoire Exhaustif des 17 Verbes (DR & MRS VANDERTRAMP)
                    </h5>
                    <div className="conjugation-table-wrapper">
                      <table className="conjugation-table">
                        <thead>
                          <tr>
                            <th className="conjugation-sticky-cell">Lettre</th>
                            <th>Verbe (Infinitif)</th>
                            <th>Participe (Masc. Sg.)</th>
                            <th>Féminin (+e)</th>
                            <th>Pluriel (+s / +es)</th>
                            <th>Phrase Exemple dans le Récit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {LE_PASSE_CONJ_DATA.pcEtre.vandertramp
                            .filter(v => !verbSearchQuery || v.inf.toLowerCase().includes(verbSearchQuery.trim().toLowerCase()) || v.pp.toLowerCase().includes(verbSearchQuery.trim().toLowerCase()))
                            .map((v, idx) => (
                            <tr key={idx}>
                              <td className="conjugation-sticky-cell">
                                <span className="font-black text-amber-400 bg-slate-900 text-white px-2 py-0.5 rounded text-xs shadow-2xs">
                                  {v.l}
                                </span>
                              </td>
                              <td className="font-bold text-slate-900">{v.inf}</td>
                              <td className="font-extrabold text-emerald-700">{v.pp}</td>
                              <td>
                                <span className="font-bold text-rose-700">{v.fem}</span>
                              </td>
                              <td>
                                <span className="font-bold text-indigo-700">{v.pl}</span>
                              </td>
                              <td className="text-xs italic text-slate-700">« {v.ex} »</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Alert Callout */}
                  <div className="conjugation-rule-memo-box">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Rappel capital avec ÊTRE :</strong> L'accord est <strong>obligatoire</strong> ! Cherchez toujours le sujet du verbe :
                      masculin pluriel = <em>+s</em>, féminin singulier = <em>+e</em>, féminin pluriel = <em>+es</em>.
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════ */}
              {/* MODULE 4: LE MIROIR PRONOMINAL                 */}
              {/* ══════════════════════════════════════════════ */}
              {activeArsenalModule === 'pronominaux' && (
                <div className="arsenal-panel fade-in">
                  <div className="station-hero-banner bg-gradient-to-r from-rose-950 via-pink-900 to-slate-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-rose-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-2xl shrink-0">
                          🪞
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-rose-400/20 text-rose-200 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                              Module 04 • Action sur Soi & Réciprocité
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">Le Miroir Pronominal : Verbes Réfléchis</h3>
                        </div>
                      </div>
                      <div className="bg-rose-950/60 border border-rose-500/30 rounded-xl px-3 py-1.5 text-xs text-rose-200 font-semibold">
                        Auxiliaire ÊTRE Systématique
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-rose-100/90 font-medium leading-relaxed">
                      Verbes précédés d'un pronom réfléchi (se lever, se souvenir, se réveiller). Ils emploient systématiquement l'auxiliaire ÊTRE au passé composé.
                    </p>
                  </div>

                  {/* Formula Pill */}
                  <div className="conjugation-formula-pill pronominal mb-5">
                    🔑 Formule : Sujet + Pronom Réfléchi (me, te, se, nous, vous, se) + ÊTRE au présent + Participe Passé
                  </div>

                  {/* 3 Verbes Modèles Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {LE_PASSE_CONJ_DATA.pronominaux
                      .filter(pGroup => !verbSearchQuery || pGroup.inf.toLowerCase().includes(verbSearchQuery.trim().toLowerCase()))
                      .map((pGroup, pIdx) => (
                      <div key={pIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <h6 className="font-black text-rose-900 text-sm mb-3 flex items-center gap-1.5 border-b border-rose-200 pb-2">
                          <span>🪞</span>
                          {pGroup.inf}
                        </h6>
                        <ul className="space-y-1.5 text-xs">
                          {pGroup.formes.map((row, rIdx) => (
                            <li key={rIdx} className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                              <span className="font-bold text-slate-500">{row.pr} :</span>
                              <span className="font-extrabold text-slate-900">{row.v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Elision Callout */}
                  <div className="narrative-callout callout-astuce">
                    <div className="callout-header">
                      <Lightbulb size={18} className="text-amber-500" />
                      <span className="callout-title">Élision du pronom réfléchi :</span>
                    </div>
                    <p className="callout-text">
                      Devant une voyelle ou un « h » muet, <em>me, te, se</em> deviennent <em>m', t', s'</em> (Exemple : <em>« Je <strong>m'</strong>étais levé »</em>, <em>« Elle <strong>s'</strong>est souvenue »</em>).
                    </p>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════ */}
              {/* MODULE 5: LE COMPARATEUR DE NUANCES           */}
              {/* ══════════════════════════════════════════════ */}
              {activeArsenalModule === 'comparaison' && (
                <div className="arsenal-panel fade-in">
                  <div className="station-hero-banner bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-purple-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl shrink-0">
                          ⚖️
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-purple-400/20 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                              Module 05 • Nuances & Sens Narratif
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">Le Comparateur de Nuances</h3>
                        </div>
                      </div>
                      <div className="bg-purple-950/60 border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-purple-200 font-semibold">
                        Décor vs Événement
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-purple-100/90 font-medium leading-relaxed">
                      Le choix entre l'imparfait et le passé composé modifie profondément la signification du verbe dans votre texte narratif.
                    </p>
                  </div>

                  {/* Formula Pill */}
                  <div className="conjugation-formula-pill comparaison mb-5">
                    📖 Repère : L'Imparfait brosse le décor et l'état d'esprit — Le Passé Composé déclenche l'événement et la rupture.
                  </div>

                  {/* Comparison Cards / Modern Table */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
                    <div className="conjugation-table-wrapper">
                      <table className="conjugation-table">
                        <thead>
                          <tr>
                            <th className="conjugation-sticky-cell">Verbe</th>
                            <th>Forme & Nuance à l'Imparfait</th>
                            <th>Forme & Nuance au Passé Composé</th>
                          </tr>
                        </thead>
                        <tbody>
                          {LE_PASSE_CONJ_DATA.comparaison
                            .filter(row => !verbSearchQuery || row.verb.toLowerCase().includes(verbSearchQuery.trim().toLowerCase()))
                            .map((row, idx) => (
                            <tr key={idx}>
                              <td className="conjugation-sticky-cell font-black text-slate-900">{row.verb}</td>
                              <td>
                                <div className="text-xs">
                                  <span className="font-extrabold text-sky-700 block mb-0.5">« {row.imparfait} »</span>
                                  <span className="text-slate-600 font-medium italic">{row.sensImp}</span>
                                </div>
                              </td>
                              <td>
                                <div className="text-xs">
                                  <span className="font-extrabold text-amber-700 block mb-0.5">« {row.pc} »</span>
                                  <span className="text-slate-600 font-medium italic">{row.sensPc}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Advice Callout */}
                  <div className="conjugation-rule-memo-box">
                    <PenTool size={18} className="text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Conseil de Rédaction Grade 9 :</strong> Pour créer du suspense, enchaînez une longue description à l'imparfait (calme plat), puis tranchez net avec un passé composé introduit par <em>« Soudain »</em> ou <em>« Tout à coup »</em> !
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )
      )}

          {/* Frame housing the Interactive Dossiers or Studio de Narration */}
      {activeHeaderTab === 'dossiers' && (
        isReprise ? (
          <div className="grammar-accordion-frame fade-in">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-indigo-200/40">
              <div>
                <h3 className="font-black text-slate-900 text-xl sm:text-2xl flex items-center gap-2">
                  <Bookmark className="text-indigo-600" size={24} />
                  Dossiers Pédagogiques : Verbes au Présent & Prépositions
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Explorez les clés grammaticales, simulez les conjugaisons et structurez vos récits avec rigueur !
                </p>
              </div>

              <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-xs">
                🖋️ Niveau Immersion 9e Année
              </span>
            </div>

            {/* Dossiers Accordion Stack for Reprise */}
            <div className="folders-accordion-stack flex flex-col gap-4">
              {REPRISE_GRAMMAR_DOSSIERS.map((folder) => {
                const isOpen = openFolderId === folder.id;
                const quizAnswer = userQuizAnswers[folder.id];

                return (
                  <div key={folder.id} className={`grammar-folder-card ${isOpen ? 'open' : ''}`}>
                    
                    {/* Clickable Header Row */}
                    <div 
                      className="folder-header-row"
                      onClick={() => toggleFolder(folder.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="dossier-index-badge">
                          <span>{folder.number || folder.id.slice(0, 2).toUpperCase()}</span>
                        </div>
                        
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="dossier-pill-badge">
                              {folder.badge}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-base sm:text-lg text-slate-900 m-0 mt-1 tracking-tight">
                            {folder.title}
                          </h4>
                          <span className="text-xs text-slate-600 font-medium mt-0.5">
                            {folder.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="folder-expand-indicator">
                          {isOpen ? (
                            <ChevronUp size={20} className="text-indigo-600" />
                          ) : (
                            <ChevronDown size={20} className="text-slate-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Folder Body */}
                    {isOpen && (
                      <div className="folder-expanded-body fade-in">
                        
                        {folder.calloutRegleOr && (
                          <div className="narrative-callout callout-regle-or mb-4">
                            <div className="callout-header">
                              <Lightbulb size={18} className="text-amber-600" />
                              <span className="callout-title">Règle d'or :</span>
                            </div>
                            <p className="callout-text">{folder.calloutRegleOr}</p>
                          </div>
                        )}

                        {folder.id === 'reflechis' && (
                          <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {folder.miroir.map((item, mIdx) => (
                                <div key={mIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                                  <h6 className="font-black text-rose-950 text-xs mb-1.5">{item.mode}</h6>
                                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.example}</p>
                                </div>
                              ))}
                            </div>

                            <div className="pronominal-vault-card">
                              <span className="pronominal-vault-title">
                                📊 Conjugaison Modèle au Présent : Se passionner (pour l'art)
                              </span>
                              <div className="pronominal-grid">
                                {folder.conjugatorWheel.map((row, rIdx) => (
                                  <div key={rIdx} className="pronominal-cell">
                                    <div className="pronominal-text">
                                      <span className="pronominal-pronoun">{row.pronoun}</span>
                                      <span>&nbsp;</span>
                                      <span className="pronominal-reflex">{row.reflex}</span>
                                      <span>&nbsp;</span>
                                      <span className="pronominal-verb">{row.verb}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {folder.calloutPiege && (
                              <div className="narrative-callout callout-piege">
                                <div className="callout-header">
                                  <AlertTriangle size={18} className="text-rose-600" />
                                  <span className="callout-title text-rose-700">Attention à l'élision :</span>
                                </div>
                                <p className="callout-text">{folder.calloutPiege}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {folder.id !== 'reflechis' && (
                          <div className="flex flex-col gap-4">
                            {folder.formula && (
                              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-xl shadow-xs border border-indigo-800/40">
                                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                                  🔑 Formule & Repères Essentiels :
                                </span>
                                <p className="font-bold text-xs sm:text-sm text-slate-100 leading-relaxed">{folder.formula}</p>
                              </div>
                            )}

                            {folder.piliers && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {folder.piliers.map((pil, pIdx) => (
                                  <div key={pIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
                                    <span className="text-2xl flex-shrink-0">{pil.icon}</span>
                                    <div>
                                      <h6 className="font-black text-slate-900 text-xs sm:text-sm mb-1">{pil.title}</h6>
                                      <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line">{pil.desc}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {folder.calloutPiege && (
                              <div className="narrative-callout callout-piege">
                                <div className="callout-header">
                                  <AlertTriangle size={18} className="text-rose-600" />
                                  <span className="callout-title text-rose-700">Attention au piège :</span>
                                </div>
                                <p className="callout-text">{folder.calloutPiege}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {folder.trivia && (
                          <div className="comprehension-check-card mt-5">
                            <div className="comprehension-header">
                              <HelpCircle size={18} className="text-indigo-600" />
                              <span className="comprehension-title">
                                Vérification de Compréhension : Testez vos Réflexes
                              </span>
                            </div>

                            <p className="comprehension-question">
                              {folder.trivia.question}
                            </p>

                            <div className="comprehension-options">
                              {folder.trivia.options.map((opt, oIdx) => {
                                const isSelected = quizAnswer === opt;
                                const isCorrectOption = opt === folder.trivia.correct;
                                let btnClass = "comprehension-option-btn";
                                if (quizAnswer) {
                                  if (isSelected) {
                                    btnClass += isCorrectOption ? " correct" : " incorrect";
                                  }
                                }
                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    onClick={() => handleQuizAnswer(folder.id, opt)}
                                    className={btnClass}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {quizAnswer && (
                              <div className={`comprehension-feedback ${
                                quizAnswer === folder.trivia.correct ? 'correct' : 'incorrect'
                              }`}>
                                {quizAnswer === folder.trivia.correct ? (
                                  <>
                                    <CheckCircle2 size={18} className="flex-shrink-0" />
                                    <span>{folder.trivia.explanation}</span>
                                  </>
                                ) : (
                                  <span>❌ Ce n'est pas tout à fait cela. Réessayez pour identifier la bonne forme !</span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Studio de Narration for Unité 1 */
          <div className="studio-narratif-container fade-in">
            {/* Header Banner */}
            <div className="studio-header-banner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                      🎬 Le Studio du Scénariste
                    </span>
                    <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
                      Immersion 9e Année
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>L'Art du Récit : Passé & Narration</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                    Explorez les 5 stations interactives pour planter l'atmosphère, déclencher l'action et maîtriser les rouages de l'écriture romanesque !
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="text-xs font-black text-indigo-900 bg-indigo-100/80 px-3.5 py-1.5 rounded-xl border border-indigo-200 shadow-xs inline-flex items-center gap-1.5">
                    <Film size={16} className="text-indigo-600" />
                    5 Stations Interactives
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Station Top Navigator Grid */}
            <div className="studio-stations-nav-grid">
              {STUDIO_STATIONS.map((station) => {
                const isActive = activeStationId === station.id;
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => setActiveStationId(station.id)}
                    className={`studio-station-tab-card station-${station.accentColor} ${isActive ? 'active' : ''}`}
                  >
                    <div className="station-tab-top">
                      <span className="station-tab-num">{station.num}</span>
                      <span className="station-tab-tag">{station.tag}</span>
                    </div>
                    <div className="station-tab-main">
                      <span className="station-tab-icon">{station.icon}</span>
                      <div className="text-left">
                        <h4 className="station-tab-title">{station.title}</h4>
                        <p className="station-tab-subtitle">{station.subtitle}</p>
                      </div>
                    </div>
                    <div className="station-tab-footer">
                      {isActive ? (
                        <span className="station-status-active">
                          <span className="pulse-dot"></span> En exploration
                        </span>
                      ) : (
                        <span className="station-status-inactive">
                          Explorer la station <ArrowRight size={13} className="inline ml-0.5" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Station Content Panels */}
            <div className="studio-station-content-wrapper">

              {/* ══════════════════════════════════════════════ */}
              {/* STATION 1: L'IMPARFAIT                         */}
              {/* ══════════════════════════════════════════════ */}
              {activeStationId === 'imparfait' && (
                <div className="studio-station-panel fade-in">
                  {/* Station Hero Header */}
                  <div className="station-hero-banner bg-gradient-to-r from-sky-950 via-sky-900 to-indigo-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-sky-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl shrink-0">
                          🎥
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-sky-400/20 text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                              Station 01 • Atmosphère & Décor
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">La Caméra & Le Décor : L'Imparfait</h3>
                        </div>
                      </div>
                      <div className="bg-sky-950/60 border border-sky-500/30 rounded-xl px-3 py-1.5 text-xs text-sky-200 font-semibold">
                        🎬 Arrière-Plan & Continuité
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-sky-100/90 font-medium leading-relaxed">
                      L'imparfait est la caméra qui filme en continu : il brosse le décor, peint la météo, révèle les sentiments et suit les habitudes sans fixer de début ni de fin précis dans le temps.
                    </p>
                  </div>

                  {/* 4 Cinematic Objective Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="film-objective-card">
                      <div className="film-card-header">
                        <span className="film-card-icon">🌤️</span>
                        <h4 className="film-card-title">1. Météo, Climat & Décors</h4>
                      </div>
                      <p className="film-card-desc">Plante l'ambiance visuelle et sonore du lieu où se déroule l'histoire.</p>
                      <div className="film-card-example">
                        « Il <strong>faisait</strong> un froid glacial et le vent <strong>soufflait</strong> sur les toits de Montréal. »
                      </div>
                    </div>

                    <div className="film-objective-card">
                      <div className="film-card-header">
                        <span className="film-card-icon">🕰️</span>
                        <h4 className="film-card-title">2. Habitudes & Répétition</h4>
                      </div>
                      <p className="film-card-desc">Décrit les actions régulières ou les routines répétées dans le passé.</p>
                      <div className="film-card-example">
                        « Tous les matins, le jeune horloger <strong>nettoyait</strong> les rouages avec minutie. »
                      </div>
                    </div>

                    <div className="film-objective-card">
                      <div className="film-card-header">
                        <span className="film-card-icon">💭</span>
                        <h4 className="film-card-title">3. Sentiments & États d'Âme</h4>
                      </div>
                      <p className="film-card-desc">Exprime ce que ressentaient ou pensaient les personnages.</p>
                      <div className="film-card-example">
                        « Julien <strong>avait</strong> peur de faire du bruit et <strong>se sentait</strong> anxieux. »
                      </div>
                    </div>

                    <div className="film-objective-card">
                      <div className="film-card-header">
                        <span className="film-card-icon">⏳</span>
                        <h4 className="film-card-title">4. Action Continue en Cours</h4>
                      </div>
                      <p className="film-card-desc">Une action déjà en progression qui sert de toile de fond.</p>
                      <div className="film-card-example">
                        « Pendant que nous <strong>marchions</strong> silencieusement dans le long couloir sombre... »
                      </div>
                    </div>
                  </div>

                  {/* Machine à Terminaisons Card */}
                  <div className="studio-formula-box mb-6 border-sky-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-sky-200/60">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-sky-600 shrink-0" size={18} />
                        <h4 className="font-black text-slate-900 text-sm sm:text-base">
                          La Machine à Terminaisons de l'Imparfait
                        </h4>
                      </div>
                      <span className="text-[11px] font-extrabold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">
                        Règle Unique & Universelle
                      </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-sky-200 mb-4 shadow-xs">
                      <span className="text-xs font-black text-sky-900 block mb-1">🔑 La Formule Magique :</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                        Prenez le verbe au <strong>présent avec NOUS</strong>, retirez <em>-ons</em> pour trouver le radical, puis ajoutez les 6 terminaisons invariables :
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["-ais", "-ais", "-ait", "-ions", "-iez", "-aient"].map((end, eIdx) => (
                          <span key={eIdx} className="px-2.5 py-1 bg-sky-50 text-sky-800 font-extrabold text-xs rounded-lg border border-sky-300">
                            {end}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Simulator Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs bg-white">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white font-extrabold">
                            <th className="p-2.5">Sujet</th>
                            <th className="p-2.5">Aimer (-ER)</th>
                            <th className="p-2.5">Finir (-IR)</th>
                            <th className="p-2.5">Vendre (-RE)</th>
                            <th className="p-2.5 text-amber-300">Être (Exception : ét-)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium">
                          <tr>
                            <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Je / J'</td>
                            <td className="p-2.5">aim<strong className="text-sky-600 font-black">ais</strong></td>
                            <td className="p-2.5">finiss<strong className="text-sky-600 font-black">ais</strong></td>
                            <td className="p-2.5">vend<strong className="text-sky-600 font-black">ais</strong></td>
                            <td className="p-2.5 font-bold text-amber-700">ét<strong className="text-sky-600 font-black">ais</strong></td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Tu</td>
                            <td className="p-2.5">aim<strong className="text-sky-600 font-black">ais</strong></td>
                            <td className="p-2.5">finiss<strong className="text-sky-600 font-black">ais</strong></td>
                            <td className="p-2.5">vend<strong className="text-sky-600 font-black">ais</strong></td>
                            <td className="p-2.5 font-bold text-amber-700">ét<strong className="text-sky-600 font-black">ais</strong></td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Il / Elle / On</td>
                            <td className="p-2.5">aim<strong className="text-sky-600 font-black">ait</strong></td>
                            <td className="p-2.5">finiss<strong className="text-sky-600 font-black">ait</strong></td>
                            <td className="p-2.5">vend<strong className="text-sky-600 font-black">ait</strong></td>
                            <td className="p-2.5 font-bold text-amber-700">ét<strong className="text-sky-600 font-black">ait</strong></td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Nous</td>
                            <td className="p-2.5">aim<strong className="text-sky-600 font-black">ions</strong></td>
                            <td className="p-2.5">finiss<strong className="text-sky-600 font-black">ions</strong></td>
                            <td className="p-2.5">vend<strong className="text-sky-600 font-black">ions</strong></td>
                            <td className="p-2.5 font-bold text-amber-700">ét<strong className="text-sky-600 font-black">ions</strong></td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Vous</td>
                            <td className="p-2.5">aim<strong className="text-sky-600 font-black">iez</strong></td>
                            <td className="p-2.5">finiss<strong className="text-sky-600 font-black">iez</strong></td>
                            <td className="p-2.5">vend<strong className="text-sky-600 font-black">iez</strong></td>
                            <td className="p-2.5 font-bold text-amber-700">ét<strong className="text-sky-600 font-black">iez</strong></td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Ils / Elles</td>
                            <td className="p-2.5">aim<strong className="text-sky-600 font-black">aient</strong></td>
                            <td className="p-2.5">finiss<strong className="text-sky-600 font-black">aient</strong></td>
                            <td className="p-2.5">vend<strong className="text-sky-600 font-black">aient</strong></td>
                            <td className="p-2.5 font-bold text-amber-700">ét<strong className="text-sky-600 font-black">aient</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Trivia Challenge */}
                  {renderTriviaChallenge('imparfait')}
                </div>
              )}

              {/* ══════════════════════════════════════════════ */}
              {/* STATION 2: PASSÉ COMPOSÉ AVEC AVOIR           */}
              {/* ══════════════════════════════════════════════ */}
              {activeStationId === 'pc_avoir' && (
                <div className="studio-station-panel fade-in">
                  {/* Station Hero Header */}
                  <div className="station-hero-banner bg-gradient-to-r from-amber-950 via-amber-900 to-slate-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-amber-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0">
                          ⚡
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                              Station 02 • L'Action & Le Coup de Théâtre
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">Le Coup de Théâtre : Passé Composé avec AVOIR</h3>
                        </div>
                      </div>
                      <div className="bg-amber-950/60 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-amber-200 font-semibold">
                        💥 ~90 % des Verbes Français
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-amber-100/90 font-medium leading-relaxed">
                      Le passé composé propulse l'action ! Il déclenche un événement soudain, précis et daté qui bouleverse la quiétude du décor et fait bondir le récit vers l'avant.
                    </p>
                  </div>

                  {/* Formula Card */}
                  <div className="studio-formula-box mb-6 border-amber-200">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-800 block mb-2">
                      🔑 La Formule Essentielle du Passé Composé :
                    </span>
                    <div className="bg-slate-900 text-white p-3.5 rounded-xl flex flex-wrap items-center justify-center gap-2 text-center text-xs sm:text-sm font-bold shadow-inner">
                      <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200">[ Sujet ]</span>
                      <span className="text-amber-400 text-base font-black">+</span>
                      <span className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg font-black border border-amber-400">
                        AVOIR au présent <span className="text-[11px] font-normal block text-slate-900">(ai, as, a, avons, avez, ont)</span>
                      </span>
                      <span className="text-amber-400 text-base font-black">+</span>
                      <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-emerald-400">[ Participe Passé ]</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                      <div className="p-2.5 rounded-lg bg-white border border-amber-200 text-center">
                        <span className="text-xs font-black text-slate-700 block">Verbes en -ER</span>
                        <span className="text-sm font-black text-amber-700">➔ -é</span>
                        <span className="text-[11px] text-slate-500 block italic">parler ➔ parlé</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-amber-200 text-center">
                        <span className="text-xs font-black text-slate-700 block">Verbes en -IR</span>
                        <span className="text-sm font-black text-amber-700">➔ -i</span>
                        <span className="text-[11px] text-slate-500 block italic">finir ➔ fini</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-amber-200 text-center">
                        <span className="text-xs font-black text-slate-700 block">Verbes en -RE</span>
                        <span className="text-sm font-black text-amber-700">➔ -u</span>
                        <span className="text-[11px] text-slate-500 block italic">vendre ➔ vendu</span>
                      </div>
                    </div>
                  </div>

                  {/* Golden Rule Callout */}
                  <div className="narrative-callout callout-regle-or mb-6">
                    <div className="callout-header">
                      <Shield size={18} className="text-amber-600" />
                      <span className="callout-title">Règle d'or de l'auxiliaire AVOIR :</span>
                    </div>
                    <p className="callout-text">
                      Avec l'auxiliaire <strong>AVOIR</strong>, le participe passé <strong>NE S'ACCORDE JAMAIS avec le sujet</strong> ! Exemple : <em>Elle a parlé</em> (aucun 'e' supplémentaire), <em>Elles ont fini</em> (aucun 'es').
                    </p>
                  </div>

                  {/* 12 Collector Power Cards Grid */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Flame size={20} className="text-amber-500" />
                        <h4 className="font-black text-slate-900 text-base sm:text-lg">
                          Les 12 Cartes « Power Participe » (Irréguliers Incontournables)
                        </h4>
                      </div>
                      <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                        Collector
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {POWER_PARTICIPLES.map((card, cIdx) => (
                        <div key={cIdx} className="power-card-item">
                          <div className="power-card-top">
                            <div className="flex items-center gap-2">
                              <span className="power-card-icon">{card.icon}</span>
                              <div>
                                <span className="power-card-inf">{card.inf}</span>
                                <span className="power-card-note">{card.note}</span>
                              </div>
                            </div>
                            <div className="power-card-pp-badge">
                              {card.pp}
                            </div>
                          </div>
                          <div className="power-card-body">
                            <p className="power-card-example">{card.ex}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trivia Challenge */}
                  {renderTriviaChallenge('pc_avoir')}
                </div>
              )}

              {/* ══════════════════════════════════════════════ */}
              {/* STATION 3: PASSÉ COMPOSÉ AVEC ÊTRE           */}
              {/* ══════════════════════════════════════════════ */}
              {activeStationId === 'pc_etre' && (
                <div className="studio-station-panel fade-in">
                  {/* Station Hero Header */}
                  <div className="station-hero-banner bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-emerald-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shrink-0">
                          🧭
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                              Station 03 • Trajets, Changements & Accords
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">La Carte des Déplacements : Passé Composé avec ÊTRE</h3>
                        </div>
                      </div>
                      <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs text-emerald-200 font-semibold">
                        ⚠️ Accord avec le Sujet OBLIGATOIRE
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
                      17 verbes d'état ou de mouvement physique (DR & MRS VANDERTRAMP) ainsi que tous les verbes pronominaux utilisent l'auxiliaire ÊTRE. La règle d'or : le participe passé s'accorde en genre et en nombre avec le sujet !
                    </p>
                  </div>

                  {/* Interactive Accord Mirror */}
                  <div className="accord-mirror-container mb-6">
                    <div className="accord-mirror-header">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🪞</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm sm:text-base">
                            Le Miroir Magique des Accords avec ÊTRE
                          </h4>
                          <p className="text-xs text-slate-600 font-medium">
                            Clique sur chaque avatar pour observer comment le participe passé s'ajuste instantanément au sujet :
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Avatar Buttons */}
                    <div className="avatar-selector-grid">
                      {Object.keys(ACCORD_MIRROR_DATA).map((pronoun) => {
                        const isSelected = selectedAccordPronoun === pronoun;
                        const data = ACCORD_MIRROR_DATA[pronoun];
                        return (
                          <button
                            key={pronoun}
                            type="button"
                            onClick={() => setSelectedAccordPronoun(pronoun)}
                            className={`avatar-choice-btn ${isSelected ? 'selected' : ''}`}
                          >
                            <span className="text-xl sm:text-2xl">{data.avatar}</span>
                            <div className="text-left">
                              <strong className="block text-xs sm:text-sm">{pronoun}</strong>
                              <span className="text-[10px] text-slate-500 font-semibold">{data.genreLabel}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Live Mirror Result Box */}
                    {selectedAccordPronoun && (
                      <div className="live-mirror-display">
                        <div className="live-mirror-formula">
                          <span className="mirror-avatar">{ACCORD_MIRROR_DATA[selectedAccordPronoun].avatar}</span>
                          <span className="mirror-subject">{selectedAccordPronoun}</span>
                          <span className="mirror-plus">+</span>
                          <span className="mirror-aux">{ACCORD_MIRROR_DATA[selectedAccordPronoun].auxiliary}</span>
                          <span className="mirror-plus">+</span>
                          <span className="mirror-verb-block">
                            {ACCORD_MIRROR_DATA[selectedAccordPronoun].stem}
                            {ACCORD_MIRROR_DATA[selectedAccordPronoun].ending ? (
                              <span className="mirror-ending-badge">
                                {ACCORD_MIRROR_DATA[selectedAccordPronoun].ending}
                              </span>
                            ) : null}
                          </span>
                        </div>

                        <div className="live-mirror-details">
                          <div className={`accord-rule-pill ${ACCORD_MIRROR_DATA[selectedAccordPronoun].badgeStyle}`}>
                            ✨ {ACCORD_MIRROR_DATA[selectedAccordPronoun].endingBadge}
                          </div>
                          <p className="live-mirror-example">
                            « {ACCORD_MIRROR_DATA[selectedAccordPronoun].example} »
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 17 DR & MRS VANDERTRAMP Verbs Grid */}
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Compass size={20} className="text-emerald-600" />
                        <h4 className="font-black text-slate-900 text-base sm:text-lg">
                          La Boussole des 17 Verbes d'Action (DR & MRS VANDERTRAMP)
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                        Auxiliaire ÊTRE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {VANDERTRAMP_HERO_VERBS.map((verbItem, vIdx) => (
                        <div key={vIdx} className="vandertramp-hero-card">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="vandertramp-letter-chip">{verbItem.l}</span>
                              <span className="vandertramp-verb-name">{verbItem.verb}</span>
                            </div>
                            <span className="text-lg">{verbItem.icon}</span>
                          </div>
                          <span className="vandertramp-meaning-label">{verbItem.meaning}</span>
                          <p className="vandertramp-story-example">« {verbItem.ex} »</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reflexive Verbs Note */}
                  <div className="narrative-callout callout-astuce mb-6">
                    <div className="callout-header">
                      <Layers size={18} className="text-teal-700" />
                      <span className="callout-title text-teal-900">Et les Verbes Pronominaux / Réfléchis ?</span>
                    </div>
                    <p className="callout-text">
                      Tous les verbes pronominaux (<em>se lever, se souvenir, se réveiller, s'échapper</em>) prennent <strong>systématiquement l'auxiliaire ÊTRE</strong> au passé composé et s'accordent avec le sujet : <em>« Coralie s'est réveill<strong>ée</strong> en sursaut. »</em>
                    </p>
                  </div>

                  {/* Trivia Challenge */}
                  {renderTriviaChallenge('pc_etre')}
                </div>
              )}

              {/* ══════════════════════════════════════════════ */}
              {/* STATION 4: DUEL IMPARFAIT vs PASSÉ COMPOSÉ    */}
              {/* ══════════════════════════════════════════════ */}
              {activeStationId === 'combinaison' && (
                <div className="studio-station-panel fade-in">
                  {/* Station Hero Header */}
                  <div className="station-hero-banner bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-indigo-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-2xl shrink-0">
                          🎬
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-indigo-400/20 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                              Station 04 • La Régie du Réalisateur
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">Imparfait vs Passé Composé : Le Duo de Choc</h3>
                        </div>
                      </div>
                      <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-xl px-3 py-1.5 text-xs text-indigo-200 font-semibold">
                        🎭 Rythme & Tension Narrative
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-indigo-100/90 font-medium leading-relaxed">
                      Ce n'est pas une simple liste de règles : c'est un duel cinématographique ! L'imparfait prépare l'atmosphère de votre plan large, et le passé composé frappe comme un coup de tonnerre au premier plan.
                    </p>
                  </div>

                  {/* Comic Strip Duel */}
                  <div className="comic-strip-duel-grid mb-6">
                    {/* Planche Bleue: Imparfait */}
                    <div className="comic-strip-panel comic-imparfait">
                      <div className="comic-panel-badge bg-sky-100 text-sky-900 border border-sky-300">
                        🎥 Plan Large • Arrière-Plan
                      </div>
                      <h4 className="comic-panel-title text-sky-950">L'Imparfait</h4>
                      <span className="comic-panel-role text-sky-700">Le Décor & L'Atmosphère</span>
                      
                      <div className="comic-question-bubble bg-sky-50 border border-sky-200">
                        <span className="text-[11px] font-black text-sky-800 uppercase block mb-1">Repère Clé :</span>
                        <p className="text-xs italic text-slate-800 font-semibold">
                          « Que se passait-il ? Quelle ambiance régnait ? Quelle action était déjà en cours ? »
                        </p>
                      </div>

                      <ul className="comic-features-list">
                        <li><span>⏳</span> <strong>Action continue</strong> sans limite temporelle fixée.</li>
                        <li><span>🏔️</span> <strong>Description des lieux</strong>, de la météo et des émotions.</li>
                        <li><span>🔁</span> <strong>Habitudes régulières</strong> dans le passé.</li>
                      </ul>

                      <div className="comic-quote-box border-sky-300 bg-sky-50/70">
                        <span className="text-[11px] font-black text-sky-900 block mb-1">Exemple dans le récit :</span>
                        <p className="text-xs sm:text-sm italic font-bold text-slate-800">
                          « Il <strong>faisait</strong> nuit noire, la pluie <strong>tombait</strong> sans arrêt et le capitaine <strong>hésitait</strong> sur le chemin à prendre... »
                        </p>
                      </div>
                    </div>

                    {/* Planche Dorée: Passé Composé */}
                    <div className="comic-strip-panel comic-pc">
                      <div className="comic-panel-badge bg-amber-100 text-amber-900 border border-amber-300">
                        ⚡ Gros Plan • Premier Plan
                      </div>
                      <h4 className="comic-panel-title text-amber-950">Le Passé Composé</h4>
                      <span className="comic-panel-role text-amber-700">L'Événement & La Rupture</span>

                      <div className="comic-question-bubble bg-amber-50 border border-amber-200">
                        <span className="text-[11px] font-black text-amber-800 uppercase block mb-1">Repère Clé :</span>
                        <p className="text-xs italic text-slate-800 font-semibold">
                          « Que s'est-il produit soudainement ? Quel acte précis a fait basculer l'histoire ? »
                        </p>
                      </div>

                      <ul className="comic-features-list">
                        <li><span>⚡</span> <strong>Coup de théâtre soudain</strong> qui interrompt le décor.</li>
                        <li><span>🎯</span> <strong>Action délimitée</strong>, achevée et datée.</li>
                        <li><span>➡️</span> <strong>Succession d'actions</strong> : il a ouvert, a vu, a réagi.</li>
                      </ul>

                      <div className="comic-quote-box border-amber-300 bg-amber-50/70">
                        <span className="text-[11px] font-black text-amber-900 block mb-1">Exemple dans le récit :</span>
                        <p className="text-xs sm:text-sm italic font-bold text-slate-800">
                          « ...quand <strong>SOUDAIN</strong> une sirène <strong>a retenti</strong> et Coralie <strong>a sauté</strong> par-dessus le mur d'enceinte ! »
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Story Timeline Stepper */}
                  <div className="story-timeline-card mb-6">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                      <Clock size={18} className="text-indigo-600" />
                      <h4 className="font-black text-slate-900 text-sm sm:text-base">
                        La Frise Chronologique : Déroulement d'une Scène de Suspense
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="timeline-step-item bg-sky-50 border border-sky-200">
                        <div className="timeline-step-header">
                          <span className="timeline-step-badge bg-sky-200 text-sky-900">Étape 1 • Imparfait</span>
                          <span className="text-lg">🌄</span>
                        </div>
                        <strong className="text-xs text-sky-950 block mb-1">Le Décor</strong>
                        <p className="text-xs text-slate-700 font-medium">
                          « Il faisait frais et la brume voilait les tours du musée. »
                        </p>
                      </div>

                      <div className="timeline-step-item bg-sky-50 border border-sky-200">
                        <div className="timeline-step-header">
                          <span className="timeline-step-badge bg-sky-200 text-sky-900">Étape 2 • Imparfait</span>
                          <span className="text-lg">🚶‍♂️</span>
                        </div>
                        <strong className="text-xs text-sky-950 block mb-1">L'Action Continue</strong>
                        <p className="text-xs text-slate-700 font-medium">
                          « Julien marchait à pas feutrés le long des galeries silencieuses. »
                        </p>
                      </div>

                      <div className="timeline-step-item bg-amber-50 border border-amber-300 shadow-xs">
                        <div className="timeline-step-header">
                          <span className="timeline-step-badge bg-amber-200 text-amber-950">Étape 3 • Passé Composé</span>
                          <span className="text-lg">⚡</span>
                        </div>
                        <strong className="text-xs text-amber-950 block mb-1">La Rupture Nette</strong>
                        <p className="text-xs text-slate-800 font-bold">
                          « SOUDAIN, un cri perçant a déchiré le silence nocturne ! »
                        </p>
                      </div>

                      <div className="timeline-step-item bg-amber-50 border border-amber-300 shadow-xs">
                        <div className="timeline-step-header">
                          <span className="timeline-step-badge bg-amber-200 text-amber-950">Étape 4 • Passé Composé</span>
                          <span className="text-lg">🏃‍♂️</span>
                        </div>
                        <strong className="text-xs text-amber-950 block mb-1">La Réaction Vive</strong>
                        <p className="text-xs text-slate-800 font-bold">
                          « Julien a braqué sa lampe torche et a couru vers la sortie. »
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trigger Words Palette */}
                  <div className="trigger-palette-card mb-6">
                    <h4 className="font-black text-slate-900 text-sm sm:text-base mb-3 flex items-center gap-2">
                      <Zap size={18} className="text-indigo-600" />
                      Les Mots Déclencheurs (Vos Balises Réflexes)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="trigger-column trigger-col-imparfait">
                        <span className="trigger-column-title text-sky-800">
                          🎥 Déclencheurs de l'Imparfait (Durée, Routine, Climat) :
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {["Chaque jour", "Tous les soirs", "D'habitude", "Toujours", "Pendant que", "Autrefois", "En ce temps-là", "Régulièrement"].map((word, wIdx) => (
                            <span key={wIdx} className="trigger-word-pill pill-imparfait">{word}</span>
                          ))}
                        </div>
                      </div>

                      <div className="trigger-column trigger-col-pc">
                        <span className="trigger-column-title text-amber-800">
                          ⚡ Déclencheurs du Passé Composé (Rupture, Chronologie) :
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {["Soudain", "Tout à coup", "Un jour", "À ce moment précis", "Brusquement", "Aussitôt", "Immédiatement", "Puis"].map((word, wIdx) => (
                            <span key={wIdx} className="trigger-word-pill pill-pc">{word}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trivia Challenge */}
                  {renderTriviaChallenge('combinaison')}
                </div>
              )}

              {/* ══════════════════════════════════════════════ */}
              {/* STATION 5: LES CONNECTEURS LOGIQUES            */}
              {/* ══════════════════════════════════════════════ */}
              {activeStationId === 'connecteurs' && (
                <div className="studio-station-panel fade-in">
                  {/* Station Hero Header */}
                  <div className="station-hero-banner bg-gradient-to-r from-rose-950 via-purple-900 to-slate-950 text-white p-5 rounded-2xl mb-6 shadow-md border border-rose-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-2xl shrink-0">
                          🧩
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-rose-400/20 text-rose-200 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                              Station 05 • Architecture du Récit
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black mt-1">L'Architecte de l'Intrigue : Balises & Connecteurs</h3>
                        </div>
                      </div>
                      <div className="bg-rose-950/60 border border-rose-500/30 rounded-xl px-3 py-1.5 text-xs text-rose-200 font-semibold">
                        📐 Cadence & Transitions
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-rose-100/90 font-medium leading-relaxed">
                      Les connecteurs sont les aiguillages de votre scénario. Ils créent des ponts fluides entre les scènes, accentuent le suspense et évitent l'effet monotone de la répétition !
                    </p>
                  </div>

                  {/* Screenplay Roadmap: 5 Stages */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-rose-600" />
                        <h4 className="font-black text-slate-900 text-base sm:text-lg">
                          La Feuille de Route du Scénario (5 Étapes Narratives)
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
                        Guide de Rédaction
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {SCREENPLAY_ROADMAP.map((item, sIdx) => (
                        <div key={sIdx} className={`roadmap-step-card border-l-4 border-${item.color}-500`}>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{item.icon}</span>
                              <h5 className="font-black text-slate-900 text-sm sm:text-base">{item.step}</h5>
                            </div>
                            <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-${item.color}-100 text-${item.color}-800 border border-${item.color}-200`}>
                              {item.badge}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {item.words.map((w, wIdx) => (
                              <span key={wIdx} className="roadmap-word-pill">
                                {w}
                              </span>
                            ))}
                          </div>

                          <p className="text-xs italic text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            {item.example}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro-Tip Box */}
                  <div className="narrative-callout callout-astuce mb-6">
                    <div className="callout-header">
                      <Lightbulb size={18} className="text-rose-600" />
                      <span className="callout-title text-rose-800">Conseil de Rédaction Grade 9 :</span>
                    </div>
                    <p className="callout-text">
                      Ne dites pas toujours <em>« et puis... et puis... »</em>. Alternez plutôt entre l'opposition (<em>« pourtant », « cependant »</em>) et la conséquence (<em>« par conséquent », « ainsi »</em>) pour donner à votre écriture le souffle d'un véritable roman d'aventure !
                    </p>
                  </div>

                  {/* Trivia Challenge */}
                  {renderTriviaChallenge('connecteurs')}
                </div>
              )}

            </div>
          </div>
        )
      )}

    </div>
  );
}

export default GrammarSection;
