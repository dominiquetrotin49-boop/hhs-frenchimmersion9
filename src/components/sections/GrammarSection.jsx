import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BookOpen, Compass, Clock, Zap, BookOpenCheck, ChevronDown, ChevronUp, 
  CheckCircle2, HelpCircle, Layers, Sparkles, Shield, Flame, 
  FileText, Lightbulb, AlertTriangle, PenTool, Bookmark
} from 'lucide-react';
import './GrammarSection.css';
import './VocabularySection.css';

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
              : "⚡ Guide de Conjugaison : Les Essentiels"}
          </h3>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CONJUGAISON AU PRÉSENT — VERBES -ER, -IR, -RE & ESSENTIELS   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* GUIDE DE CONJUGAISON — TABLEAUX RÉCAPITULATIFS                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeHeaderTab === 'conjugaison-irreguliers' && (
        <div className="conjugation-guide-frame fade-in">
          
          {/* Header Banner */}
          <div className="conjugation-guide-header">
            <div>
              <h3 className="conjugation-guide-title">
                <Zap className="text-amber-500" size={26} />
                {isReprise 
                  ? "Tableaux Récapitulatifs de Conjugaison : Le Présent" 
                  : "Tableaux Récapitulatifs de Conjugaison : Les Temps du Récit"}
              </h3>
              <p className="conjugation-guide-desc">
                {isReprise 
                  ? "Verbes réguliers en -ER, -IR, -RE et les 10 verbes essentiels de la langue française."
                  : "Guide de référence et aide-mémoire complet : L'Imparfait, le Passé Composé (AVOIR & ÊTRE), les Verbes Pronominaux et la Synthèse Narrative."}
              </p>
            </div>
            <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-xs flex items-center gap-1.5 self-start sm:self-auto">
              <BookOpenCheck size={14} />
              {isReprise ? "⚡ Repères Fondamentaux" : "📖 Répertoire du Récit"}
            </span>
          </div>

          {/* Filter Pills Bar */}
          {!isReprise ? (
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
                onClick={() => setConjugationFilter('imparfait')} 
                className={`conjugation-filter-btn ${conjugationFilter === 'imparfait' ? 'active' : ''}`}
              >
                🕒 1. L'Imparfait
              </button>
              <button 
                type="button" 
                onClick={() => setConjugationFilter('pc_avoir')} 
                className={`conjugation-filter-btn ${conjugationFilter === 'pc_avoir' ? 'active' : ''}`}
              >
                ⚡ 2. Passé Composé (AVOIR)
              </button>
              <button 
                type="button" 
                onClick={() => setConjugationFilter('pc_etre')} 
                className={`conjugation-filter-btn ${conjugationFilter === 'pc_etre' ? 'active' : ''}`}
              >
                🏔️ 3. Passé Composé (ÊTRE & 17 Verbes)
              </button>
              <button 
                type="button" 
                onClick={() => setConjugationFilter('pronominaux')} 
                className={`conjugation-filter-btn ${conjugationFilter === 'pronominaux' ? 'active' : ''}`}
              >
                🪞 4. Verbes Pronominaux
              </button>
              <button 
                type="button" 
                onClick={() => setConjugationFilter('comparaison')} 
                className={`conjugation-filter-btn ${conjugationFilter === 'comparaison' ? 'active' : ''}`}
              >
                ⚖️ 5. Synthèse (Imparfait vs PC)
              </button>
            </div>
          ) : (
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
                📖 Verbes Réguliers (-ER, -IR, -RE)
              </button>
              <button 
                type="button" 
                onClick={() => setConjugationFilter('essentiels')} 
                className={`conjugation-filter-btn ${conjugationFilter === 'essentiels' ? 'active' : ''}`}
              >
                ⚡ 10 Verbes Essentiels
              </button>
            </div>
          )}

          {/* ══════ UNITE 1: LES TEMPS DU RÉCIT ══════ */}
          {!isReprise && (
            <div className="space-y-6">

              {/* 1. L'IMPARFAIT */}
              {(conjugationFilter === 'all' || conjugationFilter === 'imparfait') && (
                <div className="conjugation-section-card accent-imparfait">
                  <div className="conjugation-section-header">
                    <h4 className="conjugation-section-title">
                      <Clock size={18} className="text-sky-600" />
                      1. L'Imparfait de l'Indicatif (Décor, Atmosphère & Habitudes)
                    </h4>
                    <p className="conjugation-section-subtitle">
                      Temps de l'arrière-plan narratif. Il décrit les états continus, les portraits, la météo et les actions habituelles.
                    </p>
                  </div>

                  <div className="conjugation-formula-pill imparfait">
                    🔑 Formule : Radical de « Nous » au présent + Terminaisons (-ais, -ais, -ait, -ions, -iez, -aient)
                  </div>

                  {/* Tableau 1.1: Modèles Réguliers */}
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                    A. Modèles Réguliers (-ER, -IR, -RE)
                  </h5>
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
                        {LE_PASSE_CONJ_DATA.imparfait.models.map((v, idx) => (
                          <tr key={idx}>
                            <td className="conjugation-sticky-cell">{v.inf}</td>
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
                                    <span className="conjugation-verb-bold conjugation-ending-imparfait">{c}</span>
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

                  {/* Tableau 1.2: Auxiliaires et Verbes Essentiels */}
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 mt-4">
                    B. Auxiliaires & Verbes Fréquents du Récit à l'Imparfait
                  </h5>
                  <div className="conjugation-table-wrapper">
                    <table className="conjugation-table">
                      <thead>
                        <tr>
                          <th className="conjugation-sticky-cell">Verbe</th>
                          <th>Je / J'</th>
                          <th>Tu</th>
                          <th>Il / Elle</th>
                          <th>Nous</th>
                          <th>Vous</th>
                          <th>Ils / Elles</th>
                          <th>Radical & Particularité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {LE_PASSE_CONJ_DATA.imparfait.essentiels.map((v, idx) => (
                          <tr key={idx}>
                            <td className="conjugation-sticky-cell">{v.inf}</td>
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
                            <td className="text-xs text-slate-600 font-medium">
                              <span className="font-bold text-sky-800">{v.stem}</span> — {v.note}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="conjugation-rule-memo-box">
                    <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Règle d'or de l'Imparfait :</strong> Les terminaisons <em>-ais, -ais, -ait, -ions, -iez, -aient</em> sont rigoureusement identiques pour TOUS les verbes du français, sans exception. Seul le verbe <strong>Être</strong> a un radical irrégulier (<em>ét-</em>).
                    </div>
                  </div>
                </div>
              )}

              {/* 2. LE PASSÉ COMPOSÉ AVEC AVOIR */}
              {(conjugationFilter === 'all' || conjugationFilter === 'pc_avoir') && (
                <div className="conjugation-section-card accent-pc-avoir">
                  <div className="conjugation-section-header">
                    <h4 className="conjugation-section-title">
                      <Zap size={18} className="text-amber-600" />
                      2. Le Passé Composé avec AVOIR (~90 % des verbes)
                    </h4>
                    <p className="conjugation-section-subtitle">
                      Temps du premier plan et de l'action délimitée. Il exprime les événements ponctuels, soudains ou achevés qui font basculer l'histoire.
                    </p>
                  </div>

                  <div className="conjugation-formula-pill pc-avoir">
                    🔑 Formule : Sujet + AVOIR au présent (ai, as, a, avons, avez, ont) + Participe Passé
                  </div>

                  {/* Tableau 2.1: Modèles Réguliers */}
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                    A. Modèles Réguliers (-ER $\rightarrow$ -é, -IR $\rightarrow$ -i, -RE $\rightarrow$ -u)
                  </h5>
                  <div className="conjugation-table-wrapper">
                    <table className="conjugation-table">
                      <thead>
                        <tr>
                          <th className="conjugation-sticky-cell">Modèle</th>
                          <th>Participe</th>
                          <th>Je / J'</th>
                          <th>Tu</th>
                          <th>Il / Elle</th>
                          <th>Nous</th>
                          <th>Vous</th>
                          <th>Ils / Elles</th>
                          <th>Règle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {LE_PASSE_CONJ_DATA.pcAvoir.models.map((v, idx) => (
                          <tr key={idx}>
                            <td className="conjugation-sticky-cell">{v.inf}</td>
                            <td className="font-extrabold text-amber-600">{v.pp}</td>
                            {v.conj.map((c, cIdx) => (
                              <td key={cIdx}>
                                <span className="conjugation-verb-bold text-slate-900">{c}</span>
                              </td>
                            ))}
                            <td className="text-xs italic text-amber-800 font-bold">{v.rule}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tableau 2.2: Le Répertoire des Participes Passés Irréguliers du Récit */}
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 mt-4">
                    B. Le Répertoire des Participes Passés Irréguliers Essentiels (17 Verbes du Récit)
                  </h5>
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
                        {LE_PASSE_CONJ_DATA.pcAvoir.irreguliers.map((v, idx) => (
                          <tr key={idx}>
                            <td className="conjugation-sticky-cell">{v.inf}</td>
                            <td>
                              <span className="inline-block bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-md border border-amber-200">
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

                  <div className="conjugation-rule-memo-box">
                    <Shield size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Règle d'or avec AVOIR :</strong> Le participe passé ne s'accorde <strong>JAMAIS</strong> avec le sujet ! On écrit : <em>« Elle a parlé »</em>, <em>« Elles ont fini »</em>, <em>« Nous avons vendu »</em>.
                    </div>
                  </div>
                </div>
              )}

              {/* 3. LE PASSÉ COMPOSÉ AVEC ÊTRE */}
              {(conjugationFilter === 'all' || conjugationFilter === 'pc_etre') && (
                <div className="conjugation-section-card accent-pc-etre">
                  <div className="conjugation-section-header">
                    <h4 className="conjugation-section-title">
                      <Compass size={18} className="text-emerald-600" />
                      3. Le Passé Composé avec ÊTRE (La Maison d'Être / DR & MRS VANDERTRAMP)
                    </h4>
                    <p className="conjugation-section-subtitle">
                      Les 17 verbes de déplacement et d'état. L'accord en genre et en nombre avec le sujet est 100 % OBLIGATOIRE.
                    </p>
                  </div>

                  <div className="conjugation-formula-pill pc-etre">
                    🔑 Formule : Sujet + ÊTRE au présent (suis, es, est, sommes, êtes, sont) + Participe Passé ACCORDÉ (+e, +s, +es)
                  </div>

                  {/* Tableau 3.1: Démonstration d'Accord */}
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                    A. Démonstration du Mécanisme d'Accord en Genre et en Nombre
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
                            <td className="conjugation-sticky-cell">{a.sujet}</td>
                            <td className="font-extrabold text-emerald-800">{a.forme}</td>
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

                  {/* Tableau 3.2: Répertoire des 17 Verbes DR & MRS VANDERTRAMP */}
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 mt-4">
                    B. Répertoire Exhaustif des 17 Verbes (DR & MRS VANDERTRAMP)
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
                        {LE_PASSE_CONJ_DATA.pcEtre.vandertramp.map((v, idx) => (
                          <tr key={idx}>
                            <td className="conjugation-sticky-cell">
                              <span className="font-black text-amber-500 bg-slate-900 text-white px-2 py-0.5 rounded text-xs">
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

                  <div className="conjugation-rule-memo-box">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Rappel capital avec ÊTRE :</strong> L'accord est <strong>obligatoire</strong> ! Cherchez toujours le sujet du verbe :
                      masculin pluriel = <em>+s</em>, féminin singulier = <em>+e</em>, féminin pluriel = <em>+es</em>.
                    </div>
                  </div>
                </div>
              )}

              {/* 4. LES VERBES PRONOMINAUX */}
              {(conjugationFilter === 'all' || conjugationFilter === 'pronominaux') && (
                <div className="conjugation-section-card accent-pronominal">
                  <div className="conjugation-section-header">
                    <h4 className="conjugation-section-title">
                      <Layers size={18} className="text-rose-600" />
                      4. Les Verbes Pronominaux / Réfléchis au Passé Composé
                    </h4>
                    <p className="conjugation-section-subtitle">
                      Verbes précédés d'un pronom réfléchi (se lever, se souvenir, se réveiller). Ils emploient SYSTÉMATIQUEMENT l'auxiliaire ÊTRE au passé composé.
                    </p>
                  </div>

                  <div className="conjugation-formula-pill pronominal">
                    🔑 Formule : Sujet + Pronom Réfléchi (me, te, se, nous, vous, se) + ÊTRE au présent + Participe Passé
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {LE_PASSE_CONJ_DATA.pronominaux.map((pGroup, pIdx) => (
                      <div key={pIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h6 className="font-black text-rose-900 text-sm mb-3 flex items-center gap-1.5 border-b border-rose-200 pb-2">
                          <span>🪞</span>
                          {pGroup.inf}
                        </h6>
                        <ul className="space-y-1.5 text-xs">
                          {pGroup.formes.map((row, rIdx) => (
                            <li key={rIdx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                              <span className="font-bold text-slate-500">{row.pr} :</span>
                              <span className="font-extrabold text-slate-900">{row.v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="conjugation-rule-memo-box">
                    <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Élision du pronom réfléchi :</strong> Devant une voyelle ou un « h » muet, <em>me, te, se</em> deviennent <em>m', t', s'</em> (Exemple : <em>« Je <strong>m'</strong>étais levé »</em>, <em>« Elle <strong>s'</strong>est souvenue »</em>).
                    </div>
                  </div>
                </div>
              )}

              {/* 5. SYNTHÈSE NARRATIVE (IMPARFAIT VS PASSÉ COMPOSÉ) */}
              {(conjugationFilter === 'all' || conjugationFilter === 'comparaison') && (
                <div className="conjugation-section-card accent-comparaison">
                  <div className="conjugation-section-header">
                    <h4 className="conjugation-section-title">
                      <BookOpen size={18} className="text-purple-600" />
                      5. Synthèse Narrative : Imparfait vs Passé Composé (Verbes Clés)
                    </h4>
                    <p className="conjugation-section-subtitle">
                      Le choix entre l'imparfait et le passé composé modifie profondément la signification du verbe dans votre texte narratif.
                    </p>
                  </div>

                  <div className="conjugation-formula-pill comparaison">
                    📖 Repère : L'Imparfait brosse le décor et l'état d'esprit — Le Passé Composé déclenche l'événement et la rupture.
                  </div>

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
                        {LE_PASSE_CONJ_DATA.comparaison.map((row, idx) => (
                          <tr key={idx}>
                            <td className="conjugation-sticky-cell font-black">{row.verb}</td>
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

                  <div className="conjugation-rule-memo-box">
                    <PenTool size={18} className="text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Conseil de Rédaction Grade 9 :</strong> Pour créer du suspense, enchaînez une longue description à l'imparfait (calme plat), puis tranchez net avec un passé composé introduit par <em>« Soudain »</em> ou <em>« Tout à coup »</em> !
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ══════ REPRISE: LE PRÉSENT ══════ */}
          {isReprise && (
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
                            <td className="conjugation-sticky-cell">{v.inf}</td>
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
                            <td className="conjugation-sticky-cell">{v.inf}</td>
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
          )}

        </div>
      )}

      {/* Frame housing the Interactive Dossiers List */}
      {activeHeaderTab === 'dossiers' && (
        <div className="grammar-accordion-frame fade-in">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-indigo-200/40">
            <div>
              <h3 className="font-black text-slate-900 text-xl sm:text-2xl flex items-center gap-2">
                <Bookmark className="text-indigo-600" size={24} />
                {isReprise 
                  ? "Dossiers Pédagogiques : Verbes au Présent & Prépositions" 
                  : "L'Atelier du Récit : Maîtriser le Passé & La Narration"}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Explorez les clés grammaticales, simulez les conjugaisons et structurez vos récits avec rigueur !
              </p>
            </div>

            <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-xs">
              🖋️ Niveau Immersion 9e Année
            </span>
          </div>

          {/* Dossiers Accordion Stack */}
          <div className="folders-accordion-stack flex flex-col gap-4">
            {currentDossiers.map((folder) => {
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
                      {/* Dossier Index Badge */}
                      <div className="dossier-index-badge">
                        <span>{folder.number || folder.id.slice(0, 2).toUpperCase()}</span>
                      </div>
                      
                      {/* Dossier Titles */}
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
                      
                      {/* 💡 CALLOUT PANEL: RÈGLE D'OR */}
                      {folder.calloutRegleOr && (
                        <div className="narrative-callout callout-regle-or mb-4">
                          <div className="callout-header">
                            <Lightbulb size={18} className="text-amber-600" />
                            <span className="callout-title">Règle d'or :</span>
                          </div>
                          <p className="callout-text">{folder.calloutRegleOr}</p>
                        </div>
                      )}

                      {/* ══════════════════════════════════════════════ */}
                      {/* DOSSIER 1: L'IMPARFAIT                         */}
                      {/* ══════════════════════════════════════════════ */}
                      {folder.id === 'imparfait' && (
                        <div className="flex flex-col gap-5">
                          
                          {/* Les 3 Piliers */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {folder.piliers.map((pil, pIdx) => (
                              <div key={pIdx} className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs flex flex-col justify-between">
                                <div>
                                  <span className="text-2xl mb-2 block">{pil.icon}</span>
                                  <h6 className="font-black text-slate-900 text-sm mb-1">{pil.title}</h6>
                                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{pil.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Formule de Formation */}
                          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-xl shadow-xs border border-indigo-800/40">
                            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                              🔑 La Règle de Formation de l'Imparfait :
                            </span>
                            <p className="font-bold text-xs sm:text-sm text-slate-100 leading-relaxed">{folder.formula}</p>
                          </div>

                          {/* ⚠️ CALLOUT PIÈGE */}
                          {folder.calloutPiege && (
                            <div className="narrative-callout callout-piege">
                              <div className="callout-header">
                                <AlertTriangle size={18} className="text-rose-600" />
                                <span className="callout-title text-rose-700">Attention au piège :</span>
                              </div>
                              <p className="callout-text">{folder.calloutPiege}</p>
                            </div>
                          )}

                          {/* Simulateur de Conjugaison Interactif */}
                          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                              <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                <Zap size={16} className="text-amber-500" />
                                {folder.conjugation.title}
                              </h5>
                              <span className="text-xs text-slate-500 font-semibold">Choisissez un pronom sujet :</span>
                            </div>

                            {/* Pronom Selector Buttons */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {pronounsList.map((pName, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => setActivePronounIdx(pIdx)}
                                  className={`px-3 py-1.5 text-xs rounded-lg font-black transition-all cursor-pointer ${
                                    activePronounIdx === pIdx
                                      ? 'bg-indigo-600 text-white shadow-sm border border-indigo-700'
                                      : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-900'
                                  }`}
                                >
                                  {pName}
                                </button>
                              ))}
                            </div>

                            {/* Conjugation Results */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {folder.conjugation.stems.map((st, sIdx) => {
                                const conj = formatConjugatedVerb(activePronounIdx, st);
                                return (
                                  <div key={sIdx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                    <span className="text-xs font-bold text-slate-500 block mb-1.5">{st.verb}</span>
                                    <div className="text-base font-black text-slate-900 flex items-center justify-center">
                                      <span className="text-slate-700">{conj.subject}</span>
                                      {conj.hasSpace && <span>&nbsp;</span>}
                                      <span className="text-indigo-700">{conj.stem}</span>
                                      <span className="text-amber-600 font-extrabold underline">{conj.ending}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      )}

                      {/* ══════════════════════════════════════════════ */}
                      {/* DOSSIER 2: PASSÉ COMPOSÉ AVOIR                 */}
                      {/* ══════════════════════════════════════════════ */}
                      {folder.id === 'pc_avoir' && (
                        <div className="flex flex-col gap-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {folder.piliers.map((pil, pIdx) => (
                              <div key={pIdx} className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
                                <span className="text-2xl mb-2 block">{pil.icon}</span>
                                <h6 className="font-black text-slate-900 text-sm mb-1">{pil.title}</h6>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">{pil.desc}</p>
                              </div>
                            ))}
                          </div>

                          {/* Formule */}
                          <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-white p-4 rounded-xl shadow-xs border border-amber-800/40">
                            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                              🔑 Formule de Structure (AVOIR) :
                            </span>
                            <p className="font-bold text-xs sm:text-sm text-slate-100 leading-relaxed">{folder.formula}</p>
                          </div>

                          {/* Participes Irréguliers Vault */}
                          <div className="irregulars-vault-card">
                            <span className="irregulars-vault-title">
                              <Shield size={16} />
                              Coffre des Participes Passés Irréguliers Incontournables :
                            </span>
                            <div className="irregulars-vault-grid">
                              {folder.irregularsVault.map((item, iIdx) => (
                                <div key={iIdx} className="irregular-verb-cell">
                                  <span className="irregular-inf">{item.inf}</span>
                                  <div className="irregular-pp">
                                    <span className="irregular-subj">{item.subj}</span>
                                    <span>&nbsp;</span>
                                    <span>{item.pp}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* ⚠️ CALLOUT PIÈGE */}
                          {folder.calloutPiege && (
                            <div className="narrative-callout callout-piege">
                              <div className="callout-header">
                                <AlertTriangle size={18} className="text-rose-600" />
                                <span className="callout-title text-rose-700">Règle essentielle :</span>
                              </div>
                              <p className="callout-text">{folder.calloutPiege}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ══════════════════════════════════════════════ */}
                      {/* DOSSIER 3: PASSÉ COMPOSÉ ÊTRE                  */}
                      {/* ══════════════════════════════════════════════ */}
                      {folder.id === 'pc_etre' && (
                        <div className="flex flex-col gap-5">
                          
                          {/* DR & MRS VANDERTRAMP Grid with guaranteed spacing */}
                          <div className="vandertramp-container">
                            <span className="vandertramp-header-title">
                              <Compass size={18} />
                              Les 17 Verbes de Mouvement &amp; d'État (DR &amp; MRS VANDERTRAMP) :
                            </span>
                            <div className="vandertramp-badges-grid">
                              {folder.vandertramp.map((v, vIdx) => (
                                <span key={vIdx} className="vandertramp-chip">
                                  <strong className="vandertramp-acrostic-letter">{v.charAt(0)}</strong>
                                  {v.slice(1)}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Accord Demo Cards */}
                          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                            <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                              <BookOpenCheck size={16} className="text-indigo-600" />
                              L'Accord Systématique avec le Sujet (ÊTRE) :
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {folder.accordDemo.map((item, aIdx) => (
                                <div key={aIdx} className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center text-sm font-black text-slate-900 mb-0.5">
                                      <span className="text-slate-950 font-black">{item.pronoun}</span>
                                      <span>&nbsp;</span>
                                      <span className="text-emerald-800 font-extrabold">{item.verb}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-500 font-semibold">({item.label})</span>
                                  </div>
                                  <span className="text-[11px] font-black bg-emerald-200 text-emerald-950 px-2.5 py-1 rounded-md">
                                    {item.tag}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* ⚠️ CALLOUT PIÈGE */}
                          {folder.calloutPiege && (
                            <div className="narrative-callout callout-piege">
                              <div className="callout-header">
                                <AlertTriangle size={18} className="text-rose-600" />
                                <span className="callout-title text-rose-700">À ne pas oublier :</span>
                              </div>
                              <p className="callout-text">{folder.calloutPiege}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ══════════════════════════════════════════════ */}
                      {/* DOSSIER 4: L'ART DE RACONTER (SPLIT VIEW & TL)  */}
                      {/* ══════════════════════════════════════════════ */}
                      {folder.id === 'combinaison' && (
                        <div className="flex flex-col gap-6">
                          
                          {/* 1. THE SPLIT VIEW : Passé Composé vs Imparfait */}
                          {folder.splitView && (
                            <div>
                              <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                                <Layers size={16} className="text-indigo-600" />
                                Tableau Comparatif : Deux Rôles Complémentaires dans le Récit
                              </h5>

                              <div className="split-view-container">
                                {/* Carte Imparfait */}
                                <div className="split-card split-imparfait">
                                  <div>
                                    <div className="split-badge-row">
                                      <span className="split-badge imparfait">
                                        Arrière-Plan
                                      </span>
                                      <span className="text-xl">🎨</span>
                                    </div>
                                    <h4 className="split-title">{folder.splitView.imparfait.title}</h4>
                                    <p className="split-role imparfait">{folder.splitView.imparfait.role}</p>
                                    <p className="split-desc">{folder.splitView.imparfait.description}</p>
                                    
                                    <div className="split-question-box">
                                      <span className="split-question-label">❓ Question clef :</span>
                                      <p className="split-question-text">{folder.splitView.imparfait.question}</p>
                                    </div>

                                    <div className="split-points-list">
                                      {folder.splitView.imparfait.points.map((pt, ptIdx) => (
                                        <div key={ptIdx} className="split-point-item">
                                          <span className="split-bullet">•</span>
                                          <span>{pt}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="split-examples-box">
                                    <span className="split-examples-label">Exemples types :</span>
                                    <ul className="split-examples-list">
                                      {folder.splitView.imparfait.exemples.map((ex, exIdx) => (
                                        <li key={exIdx}>« {ex} »</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                {/* Carte Passé Composé */}
                                <div className="split-card split-pc">
                                  <div>
                                    <div className="split-badge-row">
                                      <span className="split-badge pc">
                                        Premier Plan
                                      </span>
                                      <span className="text-xl">⚡</span>
                                    </div>
                                    <h4 className="split-title">{folder.splitView.passeCompose.title}</h4>
                                    <p className="split-role pc">{folder.splitView.passeCompose.role}</p>
                                    <p className="split-desc">{folder.splitView.passeCompose.description}</p>
                                    
                                    <div className="split-question-box">
                                      <span className="split-question-label">❓ Question clef :</span>
                                      <p className="split-question-text">{folder.splitView.passeCompose.question}</p>
                                    </div>

                                    <div className="split-points-list">
                                      {folder.splitView.passeCompose.points.map((pt, ptIdx) => (
                                        <div key={ptIdx} className="split-point-item">
                                          <span className="split-bullet">•</span>
                                          <span>{pt}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="split-examples-box">
                                    <span className="split-examples-label">Exemples types :</span>
                                    <ul className="split-examples-list">
                                      {folder.splitView.passeCompose.exemples.map((ex, exIdx) => (
                                        <li key={exIdx}>« {ex} »</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. INTERACTIVE STORY TIMELINE */}
                          <div className="timeline-flow-container">
                            <div className="timeline-flow-header">
                              <h5 className="timeline-flow-title">
                                <Clock size={18} className="text-indigo-600" />
                                Ligne Chronologique du Récit : Comprendre l'Interruption
                              </h5>
                              <span className="timeline-flow-subtitle">
                                Observez comment l'Imparfait pose l'action continue et comment le Passé Composé surgit pour faire basculer l'histoire !
                              </span>
                            </div>

                            <div className="timeline-steps-list">
                              {folder.storyTimeline.map((item, tIdx) => {
                                const isPC = item.color === 'pc';
                                return (
                                  <React.Fragment key={tIdx}>
                                    <div className={`timeline-step-card ${isPC ? 'pc' : 'imparfait'}`}>
                                      <div className="timeline-step-header">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xl">{item.icon}</span>
                                          <span className={`timeline-step-pill ${isPC ? 'pc' : 'imparfait'}`}>
                                            Étape {item.step} : {item.tense}
                                          </span>
                                        </div>
                                        <span className={`timeline-step-label ${isPC ? 'pc' : 'imparfait'}`}>
                                          {item.label}
                                        </span>
                                      </div>
                                      <p className="timeline-step-text">
                                        « {item.text} »
                                      </p>
                                    </div>
                                    {tIdx === 1 && (
                                      <div className="timeline-step-connector">
                                        <span>⚡ SOUDAIN... UN ÉVÉNEMENT COUPE L'ACTION ! ⚡</span>
                                      </div>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3. SIGNAL WORD BANK / BALISES TEMPORELLES */}
                          {folder.signalWords && (
                            <div className="signal-words-card">
                              <h5 className="signal-words-header-title">
                                <Compass size={18} className="text-indigo-600" />
                                Banque de Balises Temporelles : Les Mots Déclencheurs
                              </h5>
                              <div className="signal-words-grid">
                                {/* Balises Imparfait */}
                                <div className="signal-column-card imparfait">
                                  <span className="signal-column-title">
                                    🕒 Déclencheurs de l'Imparfait (Habitudes / Continuité) :
                                  </span>
                                  <div className="signal-tags-wrap">
                                    {folder.signalWords.imparfait.map((w, wIdx) => (
                                      <span key={wIdx} className="signal-word-chip imparfait">
                                        {w}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Balises Passé Composé */}
                                <div className="signal-column-card pc">
                                  <span className="signal-column-title">
                                    ⚡ Déclencheurs du Passé Composé (Soudaineté / Rupture) :
                                  </span>
                                  <div className="signal-tags-wrap">
                                    {folder.signalWords.passeCompose.map((w, wIdx) => (
                                      <span key={wIdx} className="signal-word-chip pc">
                                        {w}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ✍️ CALLOUT ASTUCE DE RÉDACTION */}
                          {folder.calloutAstuce && (
                            <div className="narrative-callout callout-astuce">
                              <div className="callout-header">
                                <PenTool size={18} className="text-indigo-600" />
                                <span className="callout-title text-indigo-800">Astuce de rédaction :</span>
                              </div>
                              <p className="callout-text">{folder.calloutAstuce}</p>
                            </div>
                          )}

                        </div>
                      )}

                      {/* ══════════════════════════════════════════════ */}
                      {/* DOSSIER 5: CONNECTEURS LOGIQUES                */}
                      {/* ══════════════════════════════════════════════ */}
                      {folder.id === 'connecteurs' && (
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {folder.categories.map((cat, cIdx) => (
                              <div key={cIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                                <h6 className="font-black text-indigo-950 text-xs mb-2.5">{cat.title}</h6>
                                <div className="flex flex-wrap gap-1.5">
                                  {cat.words.map((w, wIdx) => (
                                    <span key={wIdx} className="text-xs font-bold bg-indigo-50 text-indigo-900 px-2.5 py-1 rounded-md border border-indigo-100">
                                      {w}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* ✍️ CALLOUT ASTUCE */}
                          {folder.calloutAstuce && (
                            <div className="narrative-callout callout-astuce">
                              <div className="callout-header">
                                <PenTool size={18} className="text-indigo-600" />
                                <span className="callout-title text-indigo-800">Conseil de style :</span>
                              </div>
                              <p className="callout-text">{folder.calloutAstuce}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ══════════════════════════════════════════════ */}
                      {/* DOSSIER 6: VERBES RÉFLÉCHIS                    */}
                      {/* ══════════════════════════════════════════════ */}
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

                          {/* Tableau de Conjugaison Pronominale */}
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

                          {/* ⚠️ CALLOUT PIÈGE */}
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

                      {/* ══════════════════════════════════════════════ */}
                      {/* DOSSIERS SPÉCIFIQUES REPRISE (PRÉPOSITIONS ETC)*/}
                      {/* ══════════════════════════════════════════════ */}
                      {folder.id !== 'imparfait' && 
                       folder.id !== 'pc_avoir' && 
                       folder.id !== 'pc_etre' && 
                       folder.id !== 'combinaison' && 
                       folder.id !== 'connecteurs' && 
                       folder.id !== 'reflechis' && (
                        <div className="flex flex-col gap-4">
                          
                          {/* Formule Fondamentale */}
                          {folder.formula && (
                            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-xl shadow-xs border border-indigo-800/40">
                              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                                🔑 Formule & Repères Essentiels :
                              </span>
                              <p className="font-bold text-xs sm:text-sm text-slate-100 leading-relaxed">{folder.formula}</p>
                            </div>
                          )}

                          {/* Pillars Grid */}
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

                          {/* ⚠️ CALLOUT PIÈGE */}
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

                      {/* ══════════════════════════════════════════════ */}
                      {/* 🎯 VÉRIFICATION DE COMPRÉHENSION (QUIZ)       */}
                      {/* ══════════════════════════════════════════════ */}
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
      )}

    </div>
  );
}

export default GrammarSection;
