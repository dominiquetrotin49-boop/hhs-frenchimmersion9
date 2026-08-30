export const IMPARFAIT_FILL_DATA = [
  {
    id: 1,
    text: "Autrefois, les artistes impressionnistes (aimer) ___ peindre en plein air pour capturer la lumière.",
    options: ["aimaient", "aimait", "ont aimé", "aiment"],
    correctIdx: 0,
    explanation: "Sujet pluriel 'les artistes impressionnistes'. L'imparfait exprime une habitude ou un état prolongé dans le passé : ils/elles aimaient."
  },
  {
    id: 2,
    text: "Pendant que le film se déroulait, la bande originale (créer) ___ une atmosphère mystérieuse.",
    options: ["créait", "ont créé", "créaient", "crée"],
    correctIdx: 0,
    explanation: "Le sujet est 'la bande originale' (elle). L'imparfait décrit le décor sonore continu dans le passé : créait."
  },
  {
    id: 3,
    text: "Quand nous étions jeunes, nous (visiter) ___ le musée du Louvre chaque été.",
    options: ["visitons", "visitions", "visitaient", "avons visité"],
    correctIdx: 1,
    explanation: "Le sujet est 'nous'. Visiter à l'imparfait pour décrire une habitude répétée : nous visitions."
  },
  {
    id: 4,
    text: "À cette époque, les réalisateurs de la Nouvelle Vague (tourner) ___ leurs films dans les rues de Paris.",
    options: ["tournaient", "tourne", "ont tourné", "tournait"],
    correctIdx: 0,
    explanation: "Sujet pluriel 'les réalisateurs'. L'imparfait exprime une habitude de création artistique : ils tournaient."
  },
  {
    id: 5,
    text: "La façade de la cathédrale (présenter) ___ des détails sculptés d'une grande virtuosité.",
    options: ["présentait", "présentaient", "a présenté", "présente"],
    correctIdx: 0,
    explanation: "Le sujet est 'la façade' (singulier). L'imparfait sert à décrire une caractéristique physique ou architecturale : présentait."
  }
];

export const PC_FILL_DATA = [
  {
    id: 1,
    text: "Hier soir, le réalisateur (recevoir) ___ le premier prix au Festival de Cannes.",
    options: ["a reçu", "est reçu", "recevait", "ont reçu"],
    correctIdx: 0,
    explanation: "Le verbe 'recevoir' utilise l'auxiliaire AVOIR. L'événement ponctuel terminé hier soir utilise le passé composé : a reçu."
  },
  {
    id: 2,
    text: "Les musiciens de l'orchestre (monter) ___ sur la scène du grand théâtre sous les applaudissements.",
    options: ["ont monté", "sont montés", "est monté", "sont monté"],
    correctIdx: 1,
    explanation: "'Monter' (mouvement) utilise l'auxiliaire ÊTRE. Le sujet 'Les musiciens' est masculin pluriel, donc accord en -és (sont montés)."
  },
  {
    id: 3,
    text: "Le critique d'art (écrire) ___ un article élogieux sur la nouvelle exposition.",
    options: ["a écrit", "est écrit", "écrivait", "a écris"],
    correctIdx: 0,
    explanation: "Le verbe 'écrire' à l'auxiliaire AVOIR avec participe passé 'écrit'. Sujet masculin singulier : a écrit."
  },
  {
    id: 4,
    text: "La fresque murale (devenir) ___ un symbole majeur du street art montréalais.",
    options: ["est devenue", "a devenu", "est devenu", "sont devenues"],
    correctIdx: 0,
    explanation: "'Devenir' (DR & MRS VANDERTRAMP) utilise ÊTRE. Sujet 'La fresque' (féminin singulier) -> accord en -e (est devenue)."
  },
  {
    id: 5,
    text: "Elles (se passionner) ___ pour le cinéma francophone après avoir vu ce chef-d'œuvre.",
    options: ["ont passionné", "se sont passionnées", "se sont passionné", "sont passionnées"],
    correctIdx: 1,
    explanation: "Verbe pronominal (se passionner) -> auxiliaire ÊTRE. Sujet 'Elles' (féminin pluriel) -> accord en -es (se sont passionnées)."
  }
];

export const MIXED_FILL_DATA = [
  {
    id: 1,
    text: "Le public (écouter) ___ paisiblement la mélodie quand soudain le pianiste a improvisé un solo.",
    options: ["écoutait", "a écouté", "écoutaient", "écoute"],
    correctIdx: 0,
    explanation: "L'imparfait ('écoutait') établit la scène continue en arrière-plan, interrompue par l'action soudaine au passé composé ('a improvisé')."
  },
  {
    id: 2,
    text: "Il (faire) ___ beau sur la terrasse du musée quand nous avons découvert le tableau.",
    options: ["a fait", "faisait", "faisaient", "fait"],
    correctIdx: 1,
    explanation: "La météo et le contexte général sont à l'imparfait (faisait), tandis que la découverte précise est au passé composé (avons découvert)."
  },
  {
    id: 3,
    text: "Pendant que les figurants répétaient la scène, la caméra (casser) ___.",
    options: ["cassait", "a cassé", "est cassée", "a cassée"],
    correctIdx: 1,
    explanation: "La répétition en cours est le contexte (répétaient), et la panne de caméra est l'événement ponctuel qui survient (a cassé)."
  },
  {
    id: 4,
    text: "L'architecture du château (impressionner) ___ les visiteurs jusqu'à ce que la visite guidée se termine.",
    options: ["impressionnait", "a impressionné", "impressionnent", "ont impressionné"],
    correctIdx: 0,
    explanation: "L'impression durable produite par l'architecture (décoration/état) demande l'imparfait (impressionnait)."
  },
  {
    id: 5,
    text: "Quand l'artiste (trouver) ___ son inspiration, il est immédiatement entré dans son atelier pour peindre.",
    options: ["trouvait", "a trouvé", "a trouvée", "est trouvé"],
    correctIdx: 1,
    explanation: "Trouver son inspiration est le déclencheur ponctuel (événement clé), donc passé composé (a trouvé)."
  }
];
