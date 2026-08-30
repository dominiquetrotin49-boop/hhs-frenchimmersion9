export const GRAMMAR_DATA = [
  {
    id: 'er',
    title: 'Les verbes en -ER',
    rules: [
      "Pour conjuguer un verbe régulier en -ER, on enlève la terminaison -ER de l'infinitif pour trouver le radical.",
      "Ensuite, on ajoute les terminaisons suivantes : -e, -es, -e, -ons, -ez, -ent."
    ],
    example: {
      infinitive: 'Parler',
      conjugation: [
        { pronoun: 'Je', verb: 'parle' },
        { pronoun: 'Tu', verb: 'parles' },
        { pronoun: 'Il/Elle/On', verb: 'parle' },
        { pronoun: 'Nous', verb: 'parlons' },
        { pronoun: 'Vous', verb: 'parlez' },
        { pronoun: 'Ils/Elles', verb: 'parlent' }
      ]
    },
    irregulars: [
      {
        infinitive: 'Aller',
        conjugation: [
          { pronoun: 'Je', verb: 'vais' },
          { pronoun: 'Tu', verb: 'vas' },
          { pronoun: 'Il/Elle/On', verb: 'va' },
          { pronoun: 'Nous', verb: 'allons' },
          { pronoun: 'Vous', verb: 'allez' },
          { pronoun: 'Ils/Elles', verb: 'vont' }
        ]
      }
    ]
  },
  {
    id: 'ir',
    title: 'Les verbes en -IR',
    rules: [
      "Pour conjuguer un verbe régulier en -IR (2ème groupe), on enlève la terminaison -IR.",
      "Ensuite, on ajoute les terminaisons : -is, -is, -it, -issons, -issez, -issent."
    ],
    example: {
      infinitive: 'Finir',
      conjugation: [
        { pronoun: 'Je', verb: 'finis' },
        { pronoun: 'Tu', verb: 'finis' },
        { pronoun: 'Il/Elle/On', verb: 'finit' },
        { pronoun: 'Nous', verb: 'finissons' },
        { pronoun: 'Vous', verb: 'finissez' },
        { pronoun: 'Ils/Elles', verb: 'finissent' }
      ]
    },
    irregulars: [
      {
        infinitive: 'Sortir',
        conjugation: [
          { pronoun: 'Je', verb: 'sors' },
          { pronoun: 'Tu', verb: 'sors' },
          { pronoun: 'Il/Elle/On', verb: 'sort' },
          { pronoun: 'Nous', verb: 'sortons' },
          { pronoun: 'Vous', verb: 'sortez' },
          { pronoun: 'Ils/Elles', verb: 'sortent' }
        ]
      },
      {
        infinitive: 'Partir',
        conjugation: [
          { pronoun: 'Je', verb: 'pars' },
          { pronoun: 'Tu', verb: 'pars' },
          { pronoun: 'Il/Elle/On', verb: 'part' },
          { pronoun: 'Nous', verb: 'partons' },
          { pronoun: 'Vous', verb: 'partez' },
          { pronoun: 'Ils/Elles', verb: 'partent' }
        ]
      },
      {
        infinitive: 'Venir',
        conjugation: [
          { pronoun: 'Je', verb: 'viens' },
          { pronoun: 'Tu', verb: 'viens' },
          { pronoun: 'Il/Elle/On', verb: 'vient' },
          { pronoun: 'Nous', verb: 'venons' },
          { pronoun: 'Vous', verb: 'venez' },
          { pronoun: 'Ils/Elles', verb: 'viennent' }
        ]
      }
    ]
  },
  {
    id: 're',
    title: 'Les verbes en -RE',
    rules: [
      "Pour conjuguer un verbe régulier en -RE, on enlève la terminaison -RE.",
      "On ajoute ensuite les terminaisons : -s, -s, - (rien), -ons, -ez, -ent."
    ],
    example: {
      infinitive: 'Vendre',
      conjugation: [
        { pronoun: 'Je', verb: 'vends' },
        { pronoun: 'Tu', verb: 'vends' },
        { pronoun: 'Il/Elle/On', verb: 'vend' },
        { pronoun: 'Nous', verb: 'vendons' },
        { pronoun: 'Vous', verb: 'vendez' },
        { pronoun: 'Ils/Elles', verb: 'vendent' }
      ]
    },
    irregulars: [
      {
        infinitive: 'Prendre',
        conjugation: [
          { pronoun: 'Je', verb: 'prends' },
          { pronoun: 'Tu', verb: 'prends' },
          { pronoun: 'Il/Elle/On', verb: 'prend' },
          { pronoun: 'Nous', verb: 'prenons' },
          { pronoun: 'Vous', verb: 'prenez' },
          { pronoun: 'Ils/Elles', verb: 'prennent' }
        ]
      },
      {
        infinitive: 'Faire',
        conjugation: [
          { pronoun: 'Je', verb: 'fais' },
          { pronoun: 'Tu', verb: 'fais' },
          { pronoun: 'Il/Elle/On', verb: 'fait' },
          { pronoun: 'Nous', verb: 'faisons' },
          { pronoun: 'Vous', verb: 'faites' },
          { pronoun: 'Ils/Elles', verb: 'font' }
        ]
      },
      {
        infinitive: 'Dire',
        conjugation: [
          { pronoun: 'Je', verb: 'dis' },
          { pronoun: 'Tu', verb: 'dis' },
          { pronoun: 'Il/Elle/On', verb: 'dit' },
          { pronoun: 'Nous', verb: 'disons' },
          { pronoun: 'Vous', verb: 'dites' },
          { pronoun: 'Ils/Elles', verb: 'disent' }
        ]
      }
    ]
  },
  {
    id: 'aux',
    title: 'Les Auxiliaires',
    rules: [
      "Les verbes Être et Avoir sont essentiels en français.",
      "Ils sont très irréguliers au présent de l'indicatif."
    ],
    example: null,
    irregulars: [
      {
        infinitive: 'Être',
        conjugation: [
          { pronoun: 'Je', verb: 'suis' },
          { pronoun: 'Tu', verb: 'es' },
          { pronoun: 'Il/Elle/On', verb: 'est' },
          { pronoun: 'Nous', verb: 'sommes' },
          { pronoun: 'Vous', verb: 'êtes' },
          { pronoun: 'Ils/Elles', verb: 'sont' }
        ]
      },
      {
        infinitive: 'Avoir',
        conjugation: [
          { pronoun: 'J\'', verb: 'ai' },
          { pronoun: 'Tu', verb: 'as' },
          { pronoun: 'Il/Elle/On', verb: 'a' },
          { pronoun: 'Nous', verb: 'avons' },
          { pronoun: 'Vous', verb: 'avez' },
          { pronoun: 'Ils/Elles', verb: 'ont' }
        ]
      }
    ]
  }
];


export const GRAMMAR_DATA_UNIT_2 = [
  {
    "id": "grp1",
    "title": "Groupe 1 : Les Super Irréguliers",
    "rules": [
      "Ces 4 verbes sont les plus fréquents et les plus irréguliers du français.",
      "Il n'y a pas de règle générale, il faut les apprendre par cœur !"
    ],
    "example": null,
    "irregulars": [
      {
        "infinitive": "Être",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "suis"
          },
          {
            "pronoun": "Tu",
            "verb": "es"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "est"
          },
          {
            "pronoun": "Nous",
            "verb": "sommes"
          },
          {
            "pronoun": "Vous",
            "verb": "êtes"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "sont"
          }
        ]
      },
      {
        "infinitive": "Avoir",
        "conjugation": [
          {
            "pronoun": "J'",
            "verb": "ai"
          },
          {
            "pronoun": "Tu",
            "verb": "as"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "a"
          },
          {
            "pronoun": "Nous",
            "verb": "avons"
          },
          {
            "pronoun": "Vous",
            "verb": "avez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "ont"
          }
        ]
      },
      {
        "infinitive": "Aller",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "vais"
          },
          {
            "pronoun": "Tu",
            "verb": "vas"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "va"
          },
          {
            "pronoun": "Nous",
            "verb": "allons"
          },
          {
            "pronoun": "Vous",
            "verb": "allez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "vont"
          }
        ]
      },
      {
        "infinitive": "Faire",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "fais"
          },
          {
            "pronoun": "Tu",
            "verb": "fais"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "fait"
          },
          {
            "pronoun": "Nous",
            "verb": "faisons"
          },
          {
            "pronoun": "Vous",
            "verb": "faites"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "font"
          }
        ]
      }
    ]
  },
  {
    "id": "grp2",
    "title": "Groupe 2 : Les verbes en -OIR",
    "rules": [
      "Les verbes en -OIR ont souvent un radical qui change et des terminaisons en -x, -x, -t ou -s, -s, -t."
    ],
    "example": null,
    "irregulars": [
      {
        "infinitive": "Pouvoir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "peux"
          },
          {
            "pronoun": "Tu",
            "verb": "peux"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "peut"
          },
          {
            "pronoun": "Nous",
            "verb": "pouvons"
          },
          {
            "pronoun": "Vous",
            "verb": "pouvez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "peuvent"
          }
        ]
      },
      {
        "infinitive": "Vouloir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "veux"
          },
          {
            "pronoun": "Tu",
            "verb": "veux"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "veut"
          },
          {
            "pronoun": "Nous",
            "verb": "voulons"
          },
          {
            "pronoun": "Vous",
            "verb": "voulez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "veulent"
          }
        ]
      },
      {
        "infinitive": "Devoir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "dois"
          },
          {
            "pronoun": "Tu",
            "verb": "dois"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "doit"
          },
          {
            "pronoun": "Nous",
            "verb": "devons"
          },
          {
            "pronoun": "Vous",
            "verb": "devez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "doivent"
          }
        ]
      },
      {
        "infinitive": "Savoir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "sais"
          },
          {
            "pronoun": "Tu",
            "verb": "sais"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "sait"
          },
          {
            "pronoun": "Nous",
            "verb": "savons"
          },
          {
            "pronoun": "Vous",
            "verb": "savez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "savent"
          }
        ]
      },
      {
        "infinitive": "Voir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "vois"
          },
          {
            "pronoun": "Tu",
            "verb": "vois"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "voit"
          },
          {
            "pronoun": "Nous",
            "verb": "voyons"
          },
          {
            "pronoun": "Vous",
            "verb": "voyez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "voient"
          }
        ]
      }
    ]
  },
  {
    "id": "grp3",
    "title": "Groupe 3 : Les verbes \"Botte\" (Changement de radical)",
    "rules": [
      "Dans ces verbes, le radical change pour les pronoms au singulier (je, tu, il/elle) et la 3ème personne du pluriel (ils/elles).",
      "Visuellement, ces pronoms forment une 'botte' dans le tableau de conjugaison. Nous et Vous gardent un radical régulier."
    ],
    "example": null,
    "irregulars": [
      {
        "infinitive": "Venir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "viens"
          },
          {
            "pronoun": "Tu",
            "verb": "viens"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "vient"
          },
          {
            "pronoun": "Nous",
            "verb": "venons"
          },
          {
            "pronoun": "Vous",
            "verb": "venez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "viennent"
          }
        ]
      },
      {
        "infinitive": "Tenir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "tiens"
          },
          {
            "pronoun": "Tu",
            "verb": "tiens"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "tient"
          },
          {
            "pronoun": "Nous",
            "verb": "tenons"
          },
          {
            "pronoun": "Vous",
            "verb": "tenez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "tiennent"
          }
        ]
      },
      {
        "infinitive": "Prendre",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "prends"
          },
          {
            "pronoun": "Tu",
            "verb": "prends"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "prend"
          },
          {
            "pronoun": "Nous",
            "verb": "prenons"
          },
          {
            "pronoun": "Vous",
            "verb": "prenez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "prennent"
          }
        ]
      },
      {
        "infinitive": "Acheter",
        "conjugation": [
          {
            "pronoun": "J'",
            "verb": "achète"
          },
          {
            "pronoun": "Tu",
            "verb": "achètes"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "achète"
          },
          {
            "pronoun": "Nous",
            "verb": "achetons"
          },
          {
            "pronoun": "Vous",
            "verb": "achetez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "achètent"
          }
        ]
      },
      {
        "infinitive": "Préférer",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "préfère"
          },
          {
            "pronoun": "Tu",
            "verb": "préfères"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "préfère"
          },
          {
            "pronoun": "Nous",
            "verb": "préférons"
          },
          {
            "pronoun": "Vous",
            "verb": "préférez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "préfèrent"
          }
        ]
      },
      {
        "infinitive": "Appeler",
        "conjugation": [
          {
            "pronoun": "J'",
            "verb": "appelle"
          },
          {
            "pronoun": "Tu",
            "verb": "appelles"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "appelle"
          },
          {
            "pronoun": "Nous",
            "verb": "appelons"
          },
          {
            "pronoun": "Vous",
            "verb": "appelez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "appellent"
          }
        ]
      },
      {
        "infinitive": "Payer",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "paie"
          },
          {
            "pronoun": "Tu",
            "verb": "paies"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "paie"
          },
          {
            "pronoun": "Nous",
            "verb": "payons"
          },
          {
            "pronoun": "Vous",
            "verb": "payez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "paient"
          }
        ]
      }
    ]
  },
  {
    "id": "grp4",
    "title": "Groupe 4 : Les autres grands irréguliers",
    "rules": [
      "Ces verbes sont très fréquents au quotidien. Leurs pluriels (nous, vous, ils) ont souvent des consonnes doubles ou modifiées (ex: disons/dites, buvons/boivent)."
    ],
    "example": null,
    "irregulars": [
      {
        "infinitive": "Mettre",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "mets"
          },
          {
            "pronoun": "Tu",
            "verb": "mets"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "met"
          },
          {
            "pronoun": "Nous",
            "verb": "mettons"
          },
          {
            "pronoun": "Vous",
            "verb": "mettez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "mettent"
          }
        ]
      },
      {
        "infinitive": "Dire",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "dis"
          },
          {
            "pronoun": "Tu",
            "verb": "dis"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "dit"
          },
          {
            "pronoun": "Nous",
            "verb": "disons"
          },
          {
            "pronoun": "Vous",
            "verb": "dites"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "disent"
          }
        ]
      },
      {
        "infinitive": "Lire",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "lis"
          },
          {
            "pronoun": "Tu",
            "verb": "lis"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "lit"
          },
          {
            "pronoun": "Nous",
            "verb": "lisons"
          },
          {
            "pronoun": "Vous",
            "verb": "lisez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "lisent"
          }
        ]
      },
      {
        "infinitive": "Écrire",
        "conjugation": [
          {
            "pronoun": "J'",
            "verb": "écris"
          },
          {
            "pronoun": "Tu",
            "verb": "écris"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "écrit"
          },
          {
            "pronoun": "Nous",
            "verb": "écrivons"
          },
          {
            "pronoun": "Vous",
            "verb": "écrivez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "écrivent"
          }
        ]
      },
      {
        "infinitive": "Boire",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "bois"
          },
          {
            "pronoun": "Tu",
            "verb": "bois"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "boit"
          },
          {
            "pronoun": "Nous",
            "verb": "buvons"
          },
          {
            "pronoun": "Vous",
            "verb": "buvez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "boivent"
          }
        ]
      },
      {
        "infinitive": "Croire",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "crois"
          },
          {
            "pronoun": "Tu",
            "verb": "crois"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "croit"
          },
          {
            "pronoun": "Nous",
            "verb": "croyons"
          },
          {
            "pronoun": "Vous",
            "verb": "croyez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "croient"
          }
        ]
      },
      {
        "infinitive": "Sortir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "sors"
          },
          {
            "pronoun": "Tu",
            "verb": "sors"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "sort"
          },
          {
            "pronoun": "Nous",
            "verb": "sortons"
          },
          {
            "pronoun": "Vous",
            "verb": "sortez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "sortent"
          }
        ]
      },
      {
        "infinitive": "Partir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "pars"
          },
          {
            "pronoun": "Tu",
            "verb": "pars"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "part"
          },
          {
            "pronoun": "Nous",
            "verb": "partons"
          },
          {
            "pronoun": "Vous",
            "verb": "partez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "partent"
          }
        ]
      },
      {
        "infinitive": "Dormir",
        "conjugation": [
          {
            "pronoun": "Je",
            "verb": "dors"
          },
          {
            "pronoun": "Tu",
            "verb": "dors"
          },
          {
            "pronoun": "Il/Elle/On",
            "verb": "dort"
          },
          {
            "pronoun": "Nous",
            "verb": "dormons"
          },
          {
            "pronoun": "Vous",
            "verb": "dormez"
          },
          {
            "pronoun": "Ils/Elles",
            "verb": "dorment"
          }
        ]
      }
    ]
  }
];


export const GRAMMAR_DATA_UNIT_3 = [
  {
    "id": "cod",
    "title": "1. Les Pronoms COD (le, la, l', les)",
    "rules": [
      "Le Complément d'Objet Direct (COD) répond à la question 'Qui ?' ou 'Quoi ?' après le verbe.",
      "Il n'y a pas de préposition entre le verbe et le COD.",
      "Les pronoms COD remplacent une personne ou une chose spécifique.",
      "Pronoms : me, te, le, la, l', nous, vous, les.",
      "Le pronom se place toujours AVANT le verbe conjugué."
    ],
    "example": {
      "infinitive": "Exemples avec COD",
      "conjugation": [
        {
          "pronoun": "Je télécharge",
          "verb": "le fichier -> Je le télécharge."
        },
        {
          "pronoun": "Tu protèges",
          "verb": "tes données -> Tu les protèges."
        },
        {
          "pronoun": "Il efface",
          "verb": "son empreinte -> Il l'efface."
        }
      ]
    },
    "irregulars": []
  },
  {
    "id": "coi",
    "title": "2. Les Pronoms COI (lui, leur)",
    "rules": [
      "Le Complément d'Objet Indirect (COI) répond à la question 'À qui ?'.",
      "Il s'utilise avec des verbes construits avec la préposition 'À' (parler à, donner à, envoyer à...).",
      "ATTENTION : lui et leur ne remplacent QUE des personnes animées.",
      "Pronoms : me, te, lui, nous, vous, leur.",
      "Se place aussi AVANT le verbe."
    ],
    "example": {
      "infinitive": "Exemples avec COI",
      "conjugation": [
        {
          "pronoun": "J'écris",
          "verb": "à l'informaticien -> Je lui écris."
        },
        {
          "pronoun": "Elle parle",
          "verb": "aux hackers -> Elle leur parle."
        }
      ]
    },
    "irregulars": []
  },
  {
    "id": "yen",
    "title": "3. Les Pronoms Y et EN",
    "rules": [
      "Le pronom Y remplace un lieu (Je vais à Paris -> J'y vais) ou une chose introduite par 'À' (Je pense à mon mot de passe -> J'y pense).",
      "Le pronom EN remplace une quantité (J'ai beaucoup d'applications -> J'en ai beaucoup) ou une chose introduite par 'DE' (Je parle de la cybersécurité -> J'en parle).",
      "Y et EN ne remplacent presque jamais des personnes."
    ],
    "example": {
      "infinitive": "Exemples Y / EN",
      "conjugation": [
        {
          "pronoun": "Je vais",
          "verb": "sur le dark web -> J'y vais."
        },
        {
          "pronoun": "Je supprime",
          "verb": "des spams -> J'en supprime."
        },
        {
          "pronoun": "Tu as",
          "verb": "un antivirus ? -> Oui, j'en ai un."
        }
      ]
    },
    "irregulars": []
  },
  {
    "id": "ordre",
    "title": "4. L'Ordre des Doubles Pronoms",
    "rules": [
      "Quand on utilise deux pronoms dans la même phrase, il faut respecter un ordre très strict avant le verbe :",
      "1️⃣ Me, Te, Se, Nous, Vous (Personne qui subit)",
      "2️⃣ Le, La, L', Les (Le COD)",
      "3️⃣ Lui, Leur (Le COI, la cible)",
      "4️⃣ Y (Le lieu, 'à' + chose)",
      "5️⃣ En (Quantité, 'de' + chose)",
      "ASTUCE : Pensez à l'ordre alphabétique pour (Le/La/Les) et (Lui/Leur) : L(e) vient avant L(u)."
    ],
    "example": {
      "infinitive": "Exemples d'ordre",
      "conjugation": [
        {
          "pronoun": "Je donne le mot de passe",
          "verb": "à mon frère -> Je le lui donne. (2 puis 3)"
        },
        {
          "pronoun": "Tu me prêtes",
          "verb": "ton ordinateur ? -> Tu me le prêtes. (1 puis 2)"
        },
        {
          "pronoun": "Il parle de la bulle de filtre",
          "verb": "à ses amis -> Il leur en parle. (3 puis 5)"
        }
      ]
    },
    "irregulars": []
  }
];

export const GRAMMAR_DATA_UNIT_4 = [
  {
    id: 'imparfait',
    title: "1. L'Imparfait (Le Passé Continu)",
    rules: [
      "Les 3 Piliers de l'Imparfait : 1. La Description (Le Décor) 2. L'Habitude (La Routine) 3. L'Action Continue.",
      "L'imparfait répond à la question : « Que se passait-il quand l'événement s'est produit ? »",
      "Le Décor : Planter le décor dans le passé (Ex: Il faisait beau. Il y avait du bruit).",
      "L'Habitude : Une action qui se répète (Ex: Le midi, il mangeait dans le parc).",
      "Les Indicateurs : tous les jours, chaque matin, toujours, souvent, en général, autrefois, quand j'étais petit(e).",
      "La Formule (Clé Maîtresse) : Prenez le présent avec « Nous » (ex: nous buvons) -> Retirez « -ons » (buv-) -> Ajoutez la terminaison.",
      "Les Terminaisons Universelles : -ais, -ais, -ait, -ions, -iez, -aient.",
      "Attention (Le Filtre Phonétique) : Pour les verbes en -ger et -cer, on garde le son doux (je mangeais, je commençais)."
    ],
    example: {
      infinitive: 'Verbes Réguliers (-ER, -IR, -RE)',
      conjugation: [
        { pronoun: "Je / J'", verb: "aimais / finissais / mettais" },
        { pronoun: "Tu", verb: "aimais / finissais / mettais" },
        { pronoun: "Il/Elle", verb: "aimait / finissait / mettait" },
        { pronoun: "Nous", verb: "aimions / finissions / mettions" },
        { pronoun: "Vous", verb: "aimiez / finissiez / mettiez" },
        { pronoun: "Ils/Elles", verb: "aimaient / finissaient / mettaient" }
      ]
    },
    irregulars: [
      {
        infinitive: 'Les Fondations (Être et Avoir)',
        conjugation: [
          { pronoun: "J'", verb: "étais / avais" },
          { pronoun: "Tu", verb: "étais / avais" },
          { pronoun: "Il/Elle", verb: "était / avait" },
          { pronoun: "Nous", verb: "étions / avions" },
          { pronoun: "Vous", verb: "étiez / aviez" },
          { pronoun: "Ils/Elles", verb: "étaient / avaient" }
        ]
      },
      {
        infinitive: 'Les Faux Irréguliers (Faire, Dire, Partir)',
        conjugation: [
          { pronoun: "Je", verb: "faisais (nous faisons)" },
          { pronoun: "Tu", verb: "disais (nous disons)" },
          { pronoun: "Il", verb: "partait (nous partons)" }
        ]
      }
    ]
  },
  {
    id: 'pc_avoir',
    title: "2. Le Passé Composé avec AVOIR",
    rules: [
      "Le passé composé décrit une action unique, achevée et terminée dans le passé.",
      "L'Équation Fondamentale : [Sujet] + [Auxiliaire au présent] + [Participe Passé] = Le Passé Composé.",
      "Le Moteur Principal (AVOIR) : Utilisé par la grande majorité des verbes français (~90%).",
      "La Machine de Conversion (Participe Passé) : Les verbes en -ER font -é (travailler -> travaillé).",
      "Les verbes en -IR font -i (finir -> fini). Les verbes en -RE font -u (répondre -> répondu).",
      "Règle d'Accord : AUCUN ACCORD par défaut. Le participe passé ne change pas en fonction du sujet avec Avoir."
    ],
    example: {
      infinitive: 'Le Chemin Standard',
      conjugation: [
        { pronoun: "Ali", verb: "a joué au foot hier." },
        { pronoun: "Nous", verb: "avons chanté." },
        { pronoun: "Elle", verb: "a entendu." }
      ]
    },
    irregulars: [
      {
        infinitive: 'Les Pièces Sur-Mesure (Participes Irréguliers)',
        conjugation: [
          { pronoun: "boire", verb: "-> bu" },
          { pronoun: "faire", verb: "-> fait" },
          { pronoun: "lire", verb: "-> lu" },
          { pronoun: "écrire", verb: "-> écrit" },
          { pronoun: "prendre", verb: "-> pris" },
          { pronoun: "voir", verb: "-> vu" },
          { pronoun: "dire", verb: "-> dit" },
          { pronoun: "avoir", verb: "-> eu" }
        ]
      },
      {
        infinitive: "Le Court-Circuit (L'Exception du C.O.D)",
        conjugation: [
          { pronoun: "J'ai vu", verb: "tes amis. (Aucun accord)" },
          { pronoun: "Tes amis, je les", verb: "ai vus. (Accord +s)" }
        ]
      }
    ]
  },
  {
    id: 'pc_etre',
    title: "3. Le Passé Composé avec ÊTRE",
    rules: [
      "La Voie Spéciale (ÊTRE) : Réservé à une catégorie spécifique de verbes (~10%).",
      "S'utilise pour les verbes de déplacement (aller, venir), de changement d'état (naître, mourir) et les verbes pronominaux (se laver).",
      "Le Code d'Accès : DR & MRS VANDERTRAMP (Descendre, Rester, Monter, Retourner, Sortir, Venir, Aller, Naître, Devenir, Entrer, Rentrer, Tomber, Revenir, Arriver, Mourir, Partir, Passer).",
      "La Loupe de l'Accord : ACCORD OBLIGATOIRE. Le participe passé agit comme un adjectif ; il doit s'accorder avec le sujet.",
      "Sujet Féminin : on ajoute -e (ex: Elle est allée).",
      "Sujet Pluriel : on ajoute -s (ex: Ils sont arrivés, Elles sont descendues)."
    ],
    example: {
      infinitive: 'L\'Accord Obligatoire (Exemples)',
      conjugation: [
        { pronoun: "Il", verb: "est parti." },
        { pronoun: "Elle", verb: "est partie." },
        { pronoun: "Ils", verb: "sont partis." },
        { pronoun: "Elles", verb: "sont parties." }
      ]
    },
    irregulars: [
      {
        infinitive: 'Les Verbes Pronominaux (Toujours avec ÊTRE)',
        conjugation: [
          { pronoun: "Je", verb: "me suis lavé(e)" },
          { pronoun: "Tu", verb: "t'es lavé(e)" },
          { pronoun: "Il/Elle", verb: "s'est lavé(e)" },
          { pronoun: "Nous", verb: "nous sommes lavé(e)s" },
          { pronoun: "Vous", verb: "vous êtes lavé(e)(s)" },
          { pronoun: "Ils/Elles", verb: "se sont lavé(e)s" }
        ]
      }
    ]
  },
  {
    id: 'imparfait_vs_pc',
    title: '4. La Combinaison : Imparfait vs Passé Composé',
    rules: [
      "Le paysage narratif combine les deux temps pour raconter une histoire riche.",
      "L'Imparfait décrit le CONTEXTE (Le Décor) : Ce qui se passait déjà, l'ambiance, la météo (Il pleuvait, il faisait beau).",
      "L'Imparfait décrit l'ACTION CONTINUE : Ce qui était en train de se dérouler (Je lisais un livre).",
      "Le Passé Composé décrit l'ÉVÉNEMENT SOUDAIN : Une action précise qui interrompt ou fait avancer l'histoire (soudain, le téléphone a sonné)."
    ],
    example: {
      infinitive: 'Le Tableau de Bord en Action',
      conjugation: [
        { pronoun: "Contexte (Imparfait)", verb: "Il faisait beau et le soleil brillait." },
        { pronoun: "Action (Imparfait)", verb: "Nous nous promenions dans le parc..." },
        { pronoun: "Interruption (PC)", verb: "...quand soudain, un chien a volé notre pique-nique !" },
        { pronoun: "Fin (PC)", verb: "Nous sommes rentrés à la maison." }
      ]
    },
    irregulars: []
  },
  {
    id: 'connecteurs',
    title: '5. Les Connecteurs Logiques',
    rules: [
      "Les connecteurs logiques servent à structurer une critique d'art, une analyse de film ou une argumentation.",
      "L'introduction des idées : d'abord, tout d'abord, premièrement, en premier lieu.",
      "L'ajout d'arguments : de plus, en outre, également, par ailleurs.",
      "L'opposition : cependant, par contre, néanmoins, en revanche, toutefois.",
      "La conséquence : par conséquent, donc, c'est pourquoi, ainsi.",
      "La conclusion : en conclusion, pour conclure, finalement, enfin."
    ],
    example: {
      infinitive: 'Exemples d\'utilisation (Critique d\'art & de cinéma)',
      conjugation: [
        { pronoun: "D'abord", verb: "le film s'ouvre sur un plan-séquence spectaculaire." },
        { pronoun: "De plus", verb: "la bande originale renforce l'intensité dramatique." },
        { pronoun: "Cependant", verb: "certains critiques d'art ont émis des réserves." },
        { pronoun: "Par conséquent", verb: "l'exposition a battu des records d'affluence." },
        { pronoun: "En conclusion", verb: "ce chef-d'œuvre marque l'histoire du 7e art." }
      ]
    },
    irregulars: []
  },
  {
    id: 'reflechis',
    title: '6. Les Verbes Réfléchis et Réciproques (Présent)',
    rules: [
      "Les verbes pronominaux se conjuguent avec un pronom réfléchi de la même personne que le sujet (me, te, se, nous, vous, se).",
      "Un verbe est réfléchi quand le sujet fait l'action sur lui-même (ex: je me passionne pour le cinéma).",
      "Un verbe est réciproque quand l'action est mutuelle entre plusieurs personnes (ex: ils se rencontrent lors du vernissage)."
    ],
    example: {
      infinitive: 'Se passionner (pour l\'art)',
      conjugation: [
        { pronoun: "Je", verb: "me passionne" },
        { pronoun: "Tu", verb: "te passionnes" },
        { pronoun: "Il/Elle", verb: "se passionne" },
        { pronoun: "Nous", verb: "nous passionnons" },
        { pronoun: "Vous", verb: "vous passionnez" },
        { pronoun: "Ils/Elles", verb: "se passionnent" }
      ]
    },
    irregulars: []
  }
];

export const GRAMMAR_DATA_REPRISE = [
  {
    id: 'prep_destination',
    title: "1. Les Prépositions de Lieu & Destination",
    rules: [
      "à / au / aux : devant les villes (à Paris, à Montréal) et les pays masculins (au Canada, aux États-Unis).",
      "en : devant les pays féminins (en France, en Italie) ou commençant par une voyelle (en Iran).",
      "chez : pour désigner une personne ou son domicile (chez le médecin, chez moi).",
      "dans : à l'intérieur d'un espace (dans la classe, dans mon sac)."
    ],
    example: {
      infinitive: "Destination (Exemples)",
      conjugation: [
        { pronoun: "Villes", verb: "Je vais à Paris, à Montréal" },
        { pronoun: "Pays Masc.", verb: "Je vais au Canada, au Japon" },
        { pronoun: "Pays Fém.", verb: "Je vais en France, en Italie" },
        { pronoun: "Personnes", verb: "Je vais chez le médecin, chez moi" }
      ]
    },
    irregulars: []
  },
  {
    id: 'prep_position',
    title: "2. Les Prépositions de Position Spatiale",
    rules: [
      "sur / sous : sur la surface (sur mon bureau), sous la surface (sous mon lit).",
      "devant / derrière : devant (face avant, devant le tableau), derrière (face arrière, derrière la scène).",
      "entre : au milieu de deux choses (entre la porte et la fenêtre, entre deux cours).",
      "au (à + le) : contraction obligatoire pour un lieu masculin (au cinéma, au gymnase)."
    ],
    example: {
      infinitive: "Position (Exemples)",
      conjugation: [
        { pronoun: "Sur / Sous", verb: "Le stylo est sur la table, le sac est sous la chaise" },
        { pronoun: "Devant / Derrière", verb: "Le prof est devant le tableau, l'élève est derrière" },
        { pronoun: "Entre", verb: "Je suis assis entre Paul et Marc" },
        { pronoun: "Au", verb: "Nous nous donnons rendez-vous au cinéma" }
      ]
    },
    irregulars: []
  },
  {
    id: 'prep_relation',
    title: "3. Les Prépositions de Relation & Moyen",
    rules: [
      "de / d' : provenance ou appartenance (venir de Lyon, le livre de Sami, le cours d'anglais).",
      "avec / sans : avec (compagnie/moyen, avec plaisir), sans (absence, sans faute, sans WiFi).",
      "par / pour : par (moyen/auteur, par texto, par avion), pour (but, pour réussir, pour le fun)."
    ],
    example: {
      infinitive: "Relation (Exemples)",
      conjugation: [
        { pronoun: "De / D'", verb: "Je viens de Montréal. C'est le sac de Marie." },
        { pronoun: "Avec / Sans", verb: "Je sors avec mes amis. Il est venu sans son cahier." },
        { pronoun: "Par / Pour", verb: "Elle m'a contacté par courriel. J'étudie pour réussir." }
      ]
    },
    irregulars: []
  },
  {
    id: 'verbes_aux',
    title: "4. Être & Avoir — Les Boss du Présent",
    rules: [
      "Être (to be) : Je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont. Utilisé pour l'état, l'identité, la nationalité.",
      "Avoir (to have) : J'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont. Utilisé pour la possession, l'âge, les sensations."
    ],
    example: {
      infinitive: "Être (Présent)",
      conjugation: [
        { pronoun: "Je", verb: "suis" },
        { pronoun: "Tu", verb: "es" },
        { pronoun: "Il/Elle", verb: "est" },
        { pronoun: "Nous", verb: "sommes" },
        { pronoun: "Vous", verb: "êtes" },
        { pronoun: "Ils/Elles", verb: "sont" }
      ]
    },
    irregulars: [
      {
        infinitive: "Avoir (Présent)",
        conjugation: [
          { pronoun: "Je", verb: "ai" },
          { pronoun: "Tu", verb: "as" },
          { pronoun: "Il/Elle", verb: "a" },
          { pronoun: "Nous", verb: "avons" },
          { pronoun: "Vous", verb: "avez" },
          { pronoun: "Ils/Elles", verb: "ont" }
        ]
      }
    ]
  },
  {
    id: 'verbes_action',
    title: "5. Aller, Faire, Venir & Prendre",
    rules: [
      "Aller : je vais, tu vas, il va, nous allons, vous allez, ils vont. Mouvement.",
      "Venir : je viens, tu viens, il vient, nous venons, vous venez, ils viennent. Provenance.",
      "Faire : je fais, tu fais, il fait, nous faisons, vous faites, ils font. Activités, devoirs.",
      "Prendre : je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent. Saisir, consommer."
    ],
    example: {
      infinitive: "Aller & Faire",
      conjugation: [
        { pronoun: "Je", verb: "vais / fais" },
        { pronoun: "Tu", verb: "vas / fais" },
        { pronoun: "Il/Elle", verb: "va / fait" },
        { pronoun: "Nous", verb: "allons / faisons" },
        { pronoun: "Vous", verb: "allez / faites" },
        { pronoun: "Ils/Elles", verb: "vont / font" }
      ]
    },
    irregulars: [
      {
        infinitive: "Venir & Prendre",
        conjugation: [
          { pronoun: "Je", verb: "viens / prends" },
          { pronoun: "Tu", verb: "viens / prends" },
          { pronoun: "Il/Elle", verb: "vient / prend" },
          { pronoun: "Nous", verb: "venons / prenons" },
          { pronoun: "Vous", verb: "venez / prenez" },
          { pronoun: "Ils/Elles", verb: "viennent / prennent" }
        ]
      }
    ]
  },
  {
    id: 'verbes_modal',
    title: "6. Pouvoir, Vouloir, Devoir & Savoir",
    rules: [
      "Pouvoir / Vouloir : Capacité & désir. Pouvoir (je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent). Vouloir (je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent).",
      "Devoir : Obligation. Devoir (je dois, tu dois, il doit, nous devons, vous devez, ils doivent).",
      "Savoir : Connaissance. Savoir (je sais, tu sais, il sait, nous savons, vous savez, ils savent).",
      "Ces verbes sont très souvent suivis d'un verbe à l'infinitif (ex: Je veux manger, Je dois travailler)."
    ],
    example: {
      infinitive: "Pouvoir & Vouloir",
      conjugation: [
        { pronoun: "Je", verb: "peux / veux" },
        { pronoun: "Tu", verb: "peux / veux" },
        { pronoun: "Il/Elle", verb: "peut / veut" },
        { pronoun: "Nous", verb: "pouvons / voulons" },
        { pronoun: "Vous", verb: "pouvez / voulez" },
        { pronoun: "Ils/Elles", verb: "peuvent / veulent" }
      ]
    },
    irregulars: [
      {
        infinitive: "Devoir & Savoir",
        conjugation: [
          { pronoun: "Je", verb: "dois / sais" },
          { pronoun: "Tu", verb: "dois / sais" },
          { pronoun: "Il/Elle", verb: "doit / sait" },
          { pronoun: "Nous", verb: "devons / savons" },
          { pronoun: "Vous", verb: "devez / savez" },
          { pronoun: "Ils/Elles", verb: "doivent / savent" }
        ]
      }
    ]
  }
];
