export const UNIT_1_VOCAB = [
  {
    id: 1,
    word: "Liberté de la presse",
    definition: "Le droit pour les médias d'opérer sans censure excessive ni ingérence.",
    sentence: "Dans une vraie démocratie, la _____ est protégée par la loi.",
    wrongOptions: ["Propagande", "Censure", "Désinformation"]
  },
  {
    id: 2,
    word: "Transparence",
    definition: "L'ouverture et la responsabilité dans les actions des gouvernements et organisations.",
    sentence: "Les citoyens exigent plus de _____ sur le budget de l'État.",
    wrongOptions: ["Répression", "Société civile", "Menace"]
  },
  {
    id: 3,
    word: "Journalisme",
    definition: "La profession qui consiste à collecter, évaluer, créer et présenter des informations.",
    sentence: "Le bon _____ demande de vérifier ses sources avant de publier.",
    wrongOptions: ["Cyber-harcèlement", "Gouvernement", "Biais"]
  },
  {
    id: 4,
    word: "Indépendance journalistique",
    definition: "La capacité d'informer sans pression externe, politique ou culturelle.",
    sentence: "Sans _____, les articles risquent d'être manipulés par les politiciens.",
    wrongOptions: ["Opinion publique", "Répression", "Censure"]
  },
  {
    id: 5,
    word: "Censure",
    definition: "La suppression ou l'interdiction de communications publiques jugées inacceptables.",
    sentence: "Le gouvernement a utilisé la _____ pour cacher le scandale.",
    wrongOptions: ["Transparence", "Démocratie", "Liberté de la presse"]
  },
  {
    id: 6,
    word: "Propagande",
    definition: "Des informations biaisées ou trompeuses utilisées pour promouvoir un point de vue.",
    sentence: "Pendant la guerre, la _____ a été utilisée pour manipuler l'opinion.",
    wrongOptions: ["Journalisme", "Indépendance", "Transparence"]
  },
  {
    id: 7,
    word: "Désinformation",
    definition: "La diffusion de fausses informations dans le but de tromper ou de manipuler.",
    sentence: "Les réseaux sociaux sont parfois accusés de répandre de la _____.",
    wrongOptions: ["Liberté", "Société civile", "Régulation"]
  },
  {
    id: 8,
    word: "Opinion publique",
    definition: "L'ensemble des croyances, attitudes et jugements collectifs d'une population.",
    sentence: "L'_____ a été choquée par les révélations du journaliste.",
    wrongOptions: ["Répression", "Censure", "Propagande"]
  },
  {
    id: 9,
    word: "Société civile",
    definition: "L'ensemble des ONG et associations qui œuvrent pour le bien-être social et politique.",
    sentence: "La _____ a organisé une marche pour défendre les droits humains.",
    wrongOptions: ["Régulation des médias", "Désinformation", "Censure"]
  },
  {
    id: 10,
    word: "Répression",
    definition: "L'usage de la force ou de mesures coercitives par un État pour contrôler sa population.",
    sentence: "Les journalistes ont fui le pays à cause de la _____ violente du régime.",
    wrongOptions: ["Transparence", "Liberté d'expression", "Indépendance"]
  }
];

// Helper to get 4 random options (1 correct, 3 wrong)
export function generateQuestionOptions(vocabItem) {
  const options = [vocabItem.word, ...vocabItem.wrongOptions];
  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

export const UNIT_2_VOCAB = [
  {
    id: 1,
    word: "Système éducatif",
    definition: "L'organisation des écoles et institutions d'enseignement dans un pays.",
    sentence: "Chaque pays possède un _____ différent selon son histoire.",
    wrongOptions: ["Pédagogie", "Infrastructures", "Réforme"]
  },
  {
    id: 2,
    word: "Scolarisation",
    definition: "Le fait de suivre une scolarité dans une école.",
    sentence: "La _____ des enfants est obligatoire jusqu'à un certain âge.",
    wrongOptions: ["Éducation à distance", "Bourse", "Formation professionnelle"]
  },
  {
    id: 3,
    word: "Inégalités éducatives",
    definition: "Disparités d'accès à l'éducation en fonction du genre, du lieu de résidence, ou de la classe sociale.",
    sentence: "Le gouvernement lutte contre les _____ entre les villes et les campagnes.",
    wrongOptions: ["Égalité des genres", "Inclusions", "Succès académiques"]
  },
  {
    id: 4,
    word: "Réforme éducative",
    definition: "Modification ou amélioration d'un système éducatif pour en améliorer l'efficacité ou l'équité.",
    sentence: "Le ministre a proposé une nouvelle _____ pour moderniser les écoles.",
    wrongOptions: ["Pédagogie", "Taux de scolarisation", "Éducation gratuite"]
  },
  {
    id: 5,
    word: "Éducation de base",
    definition: "Enseignement primaire et secondaire, considéré comme essentiel pour tous les enfants.",
    sentence: "L'_____ est un droit fondamental garanti par l'ONU.",
    wrongOptions: ["Enseignement supérieur", "Formation professionnelle", "Université"]
  },
  {
    id: 6,
    word: "Éducation inclusive",
    definition: "Une éducation qui cherche à intégrer tous les enfants, indépendamment de leurs besoins ou origine.",
    sentence: "L'_____ permet aux élèves en situation de handicap d'étudier avec les autres.",
    wrongOptions: ["Éducation spécialisée", "Éducation privée", "Éducation élitiste"]
  },
  {
    id: 7,
    word: "Taux de scolarisation",
    definition: "Le pourcentage d'enfants en âge scolaire qui sont inscrits à l'école.",
    sentence: "Le _____ a fortement augmenté en Afrique cette dernière décennie.",
    wrongOptions: ["Taux de réussite", "Taux de natalité", "Scolarité"]
  },
  {
    id: 8,
    word: "Égalité des genres",
    definition: "Principe visant à garantir les mêmes opportunités éducatives pour les filles et les garçons.",
    sentence: "Promouvoir l'_____ permet d'autonomiser les jeunes filles.",
    wrongOptions: ["Inégalités éducatives", "Éducation rurale", "Ségrégation"]
  },
  {
    id: 9,
    word: "Écoles rurales",
    definition: "Écoles situées dans des zones isolées souvent confrontées à des manques d'infrastructures.",
    sentence: "Les _____ manquent souvent d'accès à internet.",
    wrongOptions: ["Universités", "Écoles urbaines", "Écoles privées"]
  },
  {
    id: 10,
    word: "Bourses d'études",
    definition: "Aide financière pour permettre aux étudiants de poursuivre leurs études.",
    sentence: "L'État offre des _____ aux étudiants issus de familles modestes.",
    wrongOptions: ["Frais d'inscription", "Dettes étudiantes", "Infrastructures"]
  },
  {
    id: 11,
    word: "Taux de réussite",
    definition: "Le pourcentage d'élèves qui réussissent à terminer leur cursus scolaire avec un diplôme.",
    sentence: "Le _____ au baccalauréat a été très élevé cette année.",
    wrongOptions: ["Taux de scolarisation", "Éducation gratuite", "Pédagogie"]
  },
  {
    id: 12,
    word: "Éducation gratuite",
    definition: "Système dans lequel l'État prend en charge les frais d'inscription et autres coûts scolaires.",
    sentence: "Grâce à l'_____, tous les enfants peuvent aller à l'école publique sans payer.",
    wrongOptions: ["Bourses d'études", "Éducation privée", "Scolarisation payante"]
  },
  {
    id: 13,
    word: "Universités africaines",
    definition: "Institutions d'enseignement supérieur qui offrent des programmes diplômants dans divers domaines.",
    sentence: "Plusieurs _____ sont aujourd'hui reconnues à l'échelle internationale.",
    wrongOptions: ["Écoles primaires", "Lycées", "Écoles maternelles"]
  },
  {
    id: 14,
    word: "Infrastructures scolaires",
    definition: "Les bâtiments, équipements et ressources nécessaires pour soutenir l'enseignement.",
    sentence: "Pour améliorer l'apprentissage, il faut investir dans de meilleures _____.",
    wrongOptions: ["Pédagogies", "Systèmes éducatifs", "Bourses"]
  },
  {
    id: 15,
    word: "Pédagogie",
    definition: "Méthodes d'enseignement utilisées pour former les élèves.",
    sentence: "Le professeur utilise une _____ innovante basée sur les jeux éducatifs.",
    wrongOptions: ["Administration", "Infrastructure", "Financement"]
  },
  {
    id: 16,
    word: "Formation professionnelle",
    definition: "Enseignement visant à préparer les étudiants à des métiers spécifiques.",
    sentence: "La _____ permet d'apprendre rapidement un métier manuel ou technique.",
    wrongOptions: ["Éducation de base", "Pédagogie", "Formation académique"]
  },
  {
    id: 17,
    word: "Éducation à distance",
    definition: "Forme d'éducation qui utilise la technologie pour enseigner à distance.",
    sentence: "Pendant la pandémie, l'_____ est devenue indispensable.",
    wrongOptions: ["Éducation rurale", "Écoles privées", "Enseignement présentiel"]
  }
];

export const UNIT_3_VOCAB = [
  {
    id: 1,
    word: "Technologie personnelle",
    definition: "Les appareils et applications numériques utilisés par les individus.",
    sentence: "Les smartphones sont la forme de _____ la plus commune.",
    wrongOptions: ["E-réputation", "Cybersécurité", "Données personnelles"]
  },
  {
    id: 2,
    word: "E-réputation",
    definition: "L'image ou la perception qu'une personne projette sur Internet et les réseaux sociaux.",
    sentence: "Il est important de protéger son _____ pour sa future carrière.",
    wrongOptions: ["Bulle de filtre", "Hameçonnage", "Temps d'écran"]
  },
  {
    id: 3,
    word: "Identité numérique",
    definition: "L'ensemble des traces laissées en ligne (publications, profils, données).",
    sentence: "Chaque photo que tu postes construit ton _____.",
    wrongOptions: ["Hygiène numérique", "Empreinte numérique", "Désinformation"]
  },
  {
    id: 4,
    word: "Bulle de filtre",
    definition: "Un état d'isolement intellectuel où on n'est exposé qu'à des informations qui confirment nos croyances.",
    sentence: "L'algorithme de TikTok l'a enfermé dans une véritable _____.",
    wrongOptions: ["Cyber-harcèlement", "Cybersécurité", "Dépendance numérique"]
  },
  {
    id: 5,
    word: "Désinformation",
    definition: "La propagation intentionnelle d'informations fausses ou trompeuses.",
    sentence: "Vérifie toujours tes sources pour lutter contre la _____.",
    wrongOptions: ["E-réputation", "Paramètres de confidentialité", "Hameçonnage"]
  },
  {
    id: 6,
    word: "Dépendance numérique",
    definition: "L'usage excessif et compulsif des technologies, au point d'interférer avec la vie quotidienne.",
    sentence: "Il passe 10 heures par jour sur son téléphone, c'est une vraie _____.",
    wrongOptions: ["Déconnexion numérique", "Bulle de filtre", "Hygiène numérique"]
  },
  {
    id: 7,
    word: "Déconnexion numérique",
    definition: "Le fait de prendre des pauses ou de s'abstenir d'utiliser des appareils connectés.",
    sentence: "Le week-end, je pratique la _____ totale en éteignant mon portable.",
    wrongOptions: ["Cybersécurité", "Hameçonnage", "Dépendance numérique"]
  },
  {
    id: 8,
    word: "Hygiène numérique",
    definition: "L'ensemble des bonnes pratiques visant à assurer la santé physique et mentale lors de l'utilisation des technologies.",
    sentence: "Ne pas regarder les écrans avant de dormir fait partie d'une bonne _____.",
    wrongOptions: ["Empreinte numérique", "E-réputation", "Économie de l'attention"]
  },
  {
    id: 9,
    word: "Temps d'écran",
    definition: "La durée que l'on passe à utiliser des appareils électroniques.",
    sentence: "Mes parents ont limité mon _____ à 2 heures par jour.",
    wrongOptions: ["Bulle de filtre", "Paramètres de confidentialité", "Harcèlement en ligne"]
  },
  {
    id: 10,
    word: "Fatigue visuelle",
    definition: "L'inconfort des yeux causé par l'utilisation prolongée d'écrans.",
    sentence: "Regarder son ordinateur toute la journée donne une _____.",
    wrongOptions: ["Dépendance numérique", "Cybersécurité", "Identité numérique"]
  },
  {
    id: 11,
    word: "Empreinte numérique",
    definition: "L'ensemble des données qu'une personne crée et laisse en utilisant des appareils et services.",
    sentence: "Effacer son historique aide à réduire son _____.",
    wrongOptions: ["E-réputation", "Bulle de filtre", "Hameçonnage"]
  },
  {
    id: 12,
    word: "Données personnelles",
    definition: "Les informations qui permettent d'identifier un individu (nom, adresse, localisation).",
    sentence: "Les applications collectent tes _____ pour te cibler avec des publicités.",
    wrongOptions: ["Technologies personnelles", "Paramètres de confidentialité", "Désinformation"]
  },
  {
    id: 13,
    word: "Hameçonnage",
    definition: "Technique frauduleuse pour obtenir des informations personnelles en se faisant passer pour une entité de confiance.",
    sentence: "Ce faux e-mail de la banque était une tentative de _____.",
    wrongOptions: ["Cyber-harcèlement", "Bulle de filtre", "Dépendance numérique"]
  },
  {
    id: 14,
    word: "Cybersécurité",
    definition: "Les mesures pour protéger les systèmes informatiques et les données personnelles.",
    sentence: "Utiliser un mot de passe complexe est une règle de base en _____.",
    wrongOptions: ["E-réputation", "Identité numérique", "Économie de l'attention"]
  },
  {
    id: 15,
    word: "Paramètres de confidentialité",
    definition: "Les outils et réglages qui permettent de contrôler qui peut voir vos informations.",
    sentence: "J'ai changé mes _____ pour que mon profil Instagram soit privé.",
    wrongOptions: ["Données personnelles", "Temps d'écran", "Hameçonnage"]
  },
  {
    id: 16,
    word: "Harcèlement en ligne",
    definition: "L'utilisation d'outils numériques pour intimider, menacer ou humilier une personne de manière répétée.",
    sentence: "Le _____ peut avoir de graves conséquences psychologiques sur les jeunes.",
    wrongOptions: ["Hameçonnage", "Bulle de filtre", "Économie de l'attention"]
  },
  {
    id: 17,
    word: "Économie de l'attention",
    definition: "Le modèle économique où les entreprises rivalisent pour capter le temps des utilisateurs.",
    sentence: "Les réseaux sociaux utilisent des notifications constantes dans cette _____.",
    wrongOptions: ["Cybersécurité", "E-réputation", "Hygiène numérique"]
  }
];

export const UNIT_3_SONG_VOCAB = [
  {
    id: 101,
    word: "Dépendant",
    definition: "Qui ne peut pas se passer de quelque chose ou quelqu'un.",
    sentence: "Il est complètement _____ de son téléphone portable.",
    wrongOptions: ["Absorbé", "Quotidien", "Pratique"]
  },
  {
    id: 102,
    word: "Quotidien",
    definition: "Ce qui se fait tous les jours.",
    sentence: "Les réseaux sociaux font partie intégrante de notre _____.",
    wrongOptions: ["Équilibre", "Compagnie", "Joies"]
  },
  {
    id: 103,
    word: "Absorbé",
    definition: "Très concentré sur quelque chose, au point d'en oublier le reste.",
    sentence: "Il est tellement _____ par son écran qu'il n'écoute personne.",
    wrongOptions: ["Dépendant", "Conscience", "Remplacer"]
  },
  {
    id: 104,
    word: "Joies",
    definition: "Plaisirs, moments agréables.",
    sentence: "Il faut retrouver les _____ simples de la vie réelle.",
    wrongOptions: ["Équilibre", "Dossiers", "Repères"]
  },
  {
    id: 105,
    word: "Équilibre",
    definition: "Situation dans laquelle différentes forces sont en harmonie.",
    sentence: "Il est crucial de trouver un bon _____ entre les écrans et la vraie vie.",
    wrongOptions: ["Conscience", "Pratique", "Quotidien"]
  },
  {
    id: 106,
    word: "Conscience",
    definition: "La capacité de percevoir et de comprendre les choses.",
    sentence: "Il faut prendre _____ des dangers de la dépendance numérique.",
    wrongOptions: ["Compagnie", "Dépendant", "Équilibre"]
  },
  {
    id: 107,
    word: "Pratique",
    definition: "Qui est utile et fonctionnel.",
    sentence: "Avoir un GPS sur son téléphone est très _____.",
    wrongOptions: ["Absorbé", "Envoûté", "Quotidien"]
  },
  {
    id: 108,
    word: "Compagnie",
    definition: "Le fait d'être en présence de quelqu'un.",
    sentence: "Il préfère la _____ de son téléphone plutôt que ses amis.",
    wrongOptions: ["Joies", "Conscience", "Dossiers"]
  },
  {
    id: 109,
    word: "Remplacer",
    definition: "Mettre à la place de quelque chose ou quelqu'un.",
    sentence: "Rien ne peut _____ une vraie conversation en face à face.",
    wrongOptions: ["Bombarder", "Ralentir", "Absorber"]
  },
  {
    id: 110,
    word: "Bombarde",
    definition: "Envoyer beaucoup de quelque chose de manière intensive.",
    sentence: "La technologie nous _____ de publicités tous les jours.",
    wrongOptions: ["Remplacer", "Pixélisé", "Envoûter"]
  }
];

export const UNIT_4_VOCAB = [
  { id: 111, word: "Le chef-d'œuvre", definition: "Une œuvre majeure et exemplaire d'un artiste ou d'une époque.", sentence: "La Joconde est considérée comme un _____ universel du musée du Louvre.", wrongOptions: ["Le croquis", "La copie", "Le brouillon"] },
  { id: 112, word: "Le patrimoine culturel", definition: "L'ensemble des biens matériels et immatériels ayant une valeur artistique ou historique.", sentence: "Le château de Versailles fait partie du _____ mondial de l'UNESCO.", wrongOptions: ["Le pouvoir d'achat", "L'environnement", "Le budget"] },
  { id: 113, word: "Le 7e art", definition: "Terme poétique désignant le cinéma.", sentence: "Le Festival de Cannes célèbre chaque année la créativité du _____.", wrongOptions: ["Le théâtre", "La peinture", "La sculpture"] },
  { id: 114, word: "Le scénario", definition: "Le texte détaillé décrivant l'histoire et les dialogues d'un film.", sentence: "Le réalisateur a passé six mois à écrire le _____ de son nouveau film.", wrongOptions: ["La bande-annonce", "L'affiche", "La critique"] },
  { id: 115, word: "La mise en scène", definition: "L'organisation artistique et technique d'un spectacle ou d'un film.", sentence: "La _____ originale de cette pièce de théâtre a captivé le public.", wrongOptions: ["La répétition", "La censure", "La traduction"] },
  { id: 116, word: "Une exposition", definition: "La présentation publique d'œuvres d'art dans un musée ou une galerie.", sentence: "Nous sommes allés voir une _____ impressionniste au musée d'Orsay.", wrongOptions: ["Une audition", "Un tournage", "Une répétition"] },
  { id: 117, word: "Un vernissage", definition: "L'inauguration privée d'une exposition d'art en présence des artistes.", sentence: "Les critiques d'art se sont rassemblés pour le _____ de la galerie.", wrongOptions: ["Le tournage", "Le montage", "La première"] },
  { id: 118, word: "Une fresque murale", definition: "Une grande peinture réalisée directement sur un mur.", sentence: "Le quartier s'est transformé grâce aux sublimes _____ du street art.", wrongOptions: ["Une sculpture", "Une gravure", "Une esquisse"] },
  { id: 119, word: "Un mouvement artistique", definition: "Un courant ou style partagé par plusieurs artistes à une époque.", sentence: "Le Surréalisme est un célèbre _____ fondé au XXe siècle.", wrongOptions: ["Un festival", "Un monument", "Un récital"] },
  { id: 120, word: "La sensibilité artistique", definition: "La capacité de ressentir et d'apprécier la beauté et les émotions dans l'art.", sentence: "Ce poème touche directement la _____ du lecteur.", wrongOptions: ["La technique", "La logique", "La mémoire"] },
  { id: 121, word: "Le réalisateur", definition: "La personne qui dirige la création globale d'un film.", sentence: "Sciamma est une _____ française reconnue dans le monde entier.", wrongOptions: ["L'acteur", "Le figurant", "Le caméraman"] },
  { id: 122, word: "Une interprétation", definition: "La manière dont un acteur ou un musicien exprime un rôle ou un morceau.", sentence: "Son _____ tragique dans le film lui a valu un César.", wrongOptions: ["Une hésitation", "Une erreur", "Une révision"] },
  { id: 123, word: "Une œuvre d'art", definition: "Une création esthétique produite par un artiste (tableau, statue, musique).", sentence: "Chaque _____ dans ce musée raconte une histoire fascinante.", wrongOptions: ["Un outil", "Un document", "Un manuel"] },
  { id: 124, word: "Le patrimoine immatériel", definition: "Les traditions, chants, contes et savoir-faire transmis de génération en génération.", sentence: "La gastronomie française est inscrite au _____ de l'humanité.", wrongOptions: ["Le patrimoine immobilier", "La politique", "L'industrie"] },
  { id: 125, word: "La créativité", definition: "La capacité d'inventer, d'imaginer et d'exprimer des idées originales.", sentence: "Les ateliers d'arts plastiques encouragent la _____ des élèves.", wrongOptions: ["La monotonie", "La discipline", "La mémorisation"] },
  { id: 126, word: "Un critique d'art", definition: "Un spécialiste qui analyse et évalue les œuvres culturelles.", sentence: "Le _____ a publié un article élogieux sur le dernier roman.", wrongOptions: ["Un figurant", "Un mécène", "Un spectateur"] },
  { id: 127, word: "Une esthétique", definition: "L'ensemble des caractéristiques visuelles et artistiques d'une œuvre.", sentence: "Ce film se distingue par son _____ poétique et ses couleurs chaudes.", wrongOptions: ["Sa vitesse", "Son coût", "Son échec"] },
  { id: 128, word: "L'inspiration", definition: "L'élan créateur ou l'idée originale qui pousse l'artiste à créer.", sentence: "Le peintre a trouvé son _____ lors d'un voyage en Provence.", wrongOptions: ["L'hésitation", "La fatigue", "La routine"] },
  { id: 129, word: "Une reconstitution", definition: "La reproduction fidèle d'un événement ou d'un décor historique.", sentence: "Le film offre une spectaculaire _____ de la Révolution française.", wrongOptions: ["Une invention", "Une caricature", "Une parodie"] },
  { id: 130, word: "Un slam", definition: "Un genre poétique déclamé publiquement avec rythme et émotion.", sentence: "Grand Corps Malade a popularisé le _____ auprès des jeunes francophones.", wrongOptions: ["L'opéra", "Le ballet", "La symphonie"] },

  // --- NEW 20 WORDS: Architecture, Cinema, Music & Cultural Nuances ---
  { id: 131, word: "Un édifice", definition: "Un bâtiment imposant ayant une valeur architecturale ou historique.", sentence: "La cathédrale Notre-Dame de Paris est un _____ remarquable du Moyen Âge.", wrongOptions: ["Un croquis", "Une nuance", "Un rapport"] },
  { id: 132, word: "La façade", definition: "La face extérieure principale d'un bâtiment.", sentence: "La _____ sculptée du musée attire immédiatement le regard des visiteurs.", wrongOptions: ["La sonorité", "La mise en scène", "La bande originale"] },
  { id: 133, word: "La bande originale", definition: "La musique spécialement composée ou sélectionnée pour accompagner un film.", sentence: "La _____ de ce film résonne encore dans ma tête après la séance.", wrongOptions: ["Le cadrage", "Le synopsis", "La fresque"] },
  { id: 134, word: "Le synopsis", definition: "Le résumé concis de l'intrigue d'un film ou d'un livre.", sentence: "J'ai lu le _____ avant d'acheter mon billet de cinéma.", wrongOptions: ["Le vernissage", "Le mécénat", "Le symbolisme"] },
  { id: 135, word: "Le cadrage", definition: "Le choix de la portion d'image montrée par la caméra dans une scène.", sentence: "Le réalisateur utilise un _____ serré pour transmettre l'émotion de l'acteur.", wrongOptions: ["L'édifice", "La façade", "La virtuosité"] },
  { id: 136, word: "Un plan-séquence", definition: "Une scène tournée en une seule prise continue sans interruption de caméra.", sentence: "Ce film s'ouvre sur un spectaculaire _____ de cinq minutes.", wrongOptions: ["Un vernissage", "Un slam", "Un doublage"] },
  { id: 137, word: "La sonorité", definition: "La qualité et la couleur particulière d'un son ou d'un instrument.", sentence: "La _____ douce du violoncelle apporte une grande mélancolie à la scène.", wrongOptions: ["La façade", "L'urbanisme", "Le cadrage"] },
  { id: 138, word: "Une mélodie", definition: "Une suite de sons constituant une ligne musicale harmonieuse.", sentence: "Cette _____ traditionnelle bretonne se transmet de génération en génération.", wrongOptions: ["Un synopsis", "Un édifice", "Une fresque"] },
  { id: 139, word: "La virtuosité", definition: "Une maîtrise technique exceptionnelle dans l'exécution d'un art.", sentence: "Le jeune pianiste a ébloui le public par sa remarquable _____.", wrongOptions: ["La précarité", "L'hésitation", "La monotonie"] },
  { id: 140, word: "Le répertoire", definition: "L'ensemble des pièces, chansons ou rôles qu'un artiste est prêt à jouer.", sentence: "Cet orchestre possède un riche _____ de musique classique et contemporaine.", wrongOptions: ["Le scénario", "Le cadrage", "Le vernissage"] },
  { id: 141, word: "L'urbanisme", definition: "L'art d'aménager et d'organiser les espaces urbains et l'architecture des villes.", sentence: "L'_____ haussmannien a profondément transformé l'architecture de Paris.", wrongOptions: ["Le symbolisme", "Le mécénat", "Le doublage"] },
  { id: 142, word: "Le symbolisme", definition: "L'utilisation de symboles pour exprimer des idées ou des émotions artistiques.", sentence: "Le dromadaire dans cette peinture représente le _____ du voyage et de la liberté.", wrongOptions: ["L'urbanisme", "Le cadrage", "La virtuosité"] },
  { id: 143, word: "Une nuance culturelle", definition: "Une subtilité de langage, de comportement ou de coutume propre à une culture.", sentence: "Comprendre cette blague nécessite de saisir chaque _____ francophone.", wrongOptions: ["Une sonorité", "Une façade", "Une mélodie"] },
  { id: 144, word: "L'authenticité", definition: "Le caractère vrai, sincère et d'origine d'une œuvre ou d'une tradition.", sentence: "Ce festival garantit l'_____ des danses et des chants folkloriques.", wrongOptions: ["L'imitation", "La contrefaçon", "La censure"] },
  { id: 145, word: "Le mécénat", definition: "Le soutien financier ou matériel apporté par une entreprise ou un individu aux artistes.", sentence: "Grâce au _____ culturel, le musée a pu acquérir ce tableau rare.", wrongOptions: ["Le chômage", "Le synopsis", "Le cadrage"] },
  { id: 146, word: "La perspective", definition: "La technique de représentation à plat donnant une impression de profondeur 3D.", sentence: "Les peintres de la Renaissance ont révolutionné la _____ dans la peinture.", wrongOptions: ["La sonorité", "La façade", "La mélodie"] },
  { id: 147, word: "Un figurant", definition: "Un acteur secondaire présent à l'arrière-plan sans rôle parlant.", sentence: "Des centaines de _____ ont participé à la scène de bataille du film.", wrongOptions: ["Les réalisateurs", "Les scénaristes", "Les mécènes"] },
  { id: 148, word: "L'identité visuelle", definition: "L'ensemble des éléments graphiques et artistiques qui caractérisent une œuvre ou une ville.", sentence: "L'_____ de Montréal est marquée par la diversité de son architecture et de ses fresques.", wrongOptions: ["L'insécurité", "La sonorité", "Le doublage"] },
  { id: 149, word: "Le doublage", definition: "La substitution de la voix originale des acteurs par une traduction parlée.", sentence: "Le _____ en français de ce film québécois est d'une excellente qualité.", wrongOptions: ["Le cadrage", "Le mécénat", "L'urbanisme"] },
  { id: 150, word: "Un vestige d'architecture", definition: "Les restes ou ruines préservées d'un monument historique ancien.", sentence: "Les arènes de Nîmes sont un magnifique _____ de la civilisation romaine.", wrongOptions: ["Un synopsis", "Un vernissage", "Un plan-séquence"] }
];

export const REPRISE_VOCAB = [
  { term: "En France / À Paris", definition: "Prépositions de destination (en + pays féminin, à + ville)", english: "In France / In Paris", audioUrl: "/audio/unite-reprise/en_france_a_paris.wav" },
  { term: "Chez le médecin / Chez moi", definition: "Préposition pour indiquer la personne ou le domicile", english: "At the doctor's / At my place", audioUrl: "/audio/unite-reprise/chez_le_medecin_chez_moi.wav" },
  { term: "Avec enthousiasme", definition: "Préposition de manière", english: "With enthusiasm", audioUrl: "/audio/unite-reprise/avec_enthousiasme.wav" },
  { term: "Pour réussir", definition: "Préposition de but / objectif", english: "To succeed", audioUrl: "/audio/unite-reprise/pour_reussir.wav" },
  { term: "En train / En avion", definition: "Préposition de moyen de transport fermé", english: "By train / By plane", audioUrl: "/audio/unite-reprise/en_train_en_avion.wav" },
  { term: "À pied / À vélo", definition: "Préposition de moyen de transport individuel/ouvert", english: "On foot / By bike", audioUrl: "/audio/unite-reprise/a_pied_a_velo.wav" },
  { term: "Devant le collège", definition: "Préposition de position spatiale", english: "In front of high school", audioUrl: "/audio/unite-reprise/devant_le_college.wav" },
  { term: "Entre deux cours", definition: "Préposition d'intervalle", english: "Between two classes", audioUrl: "/audio/unite-reprise/entre_deux_cours.wav" }
];
