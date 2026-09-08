// ─────────────────────────────────────────────────────────────────────────────
// DATA: Unité 1 — Héros et Anti-Héros (5 Grilles Pédagogiques)
// Vérifiées mathématiquement: 100% compactes, zéro case de départ partagée,
// intersections avec correspondance exacte des accents.
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_CROSSWORDS = [
  {
    "id": "imparfait",
    "name": "1. L'Imparfait",
    "desc": "Terminaisons et radicaux de l'imparfait",
    "badge": "IMPARFAIT",
    "color": "#eab308",
    "bg": "rgba(234, 179, 8, 0.18)",
    "emoji": "🛡️",
    "puzzle": {
      "title": "Grille 1 : L'Imparfait — Portraits & Décors Héroïques",
      "description": "Remplissez la grille avec les verbes à l'imparfait décrivant les habitudes et exploits des héros.",
      "numRows": 11,
      "numCols": 14,
      "puzzleData": [
        {
          "id": 1,
          "word": "COMBATTIEZ",
          "clue": "Vous + Combattre : « Dans l'arène, vous ___ avec bravoure contre l'ennemi. »",
          "dir": "across",
          "r": 3,
          "c": 0
        },
        {
          "id": 2,
          "word": "DÉFENDAIS",
          "clue": "Je + Défendre : « Seul contre tous, je ___ les opprimés de la cité. »",
          "dir": "down",
          "r": 0,
          "c": 8
        },
        {
          "id": 3,
          "word": "SAUVAIT",
          "clue": "Il + Sauver : « Chaque nuit, le justicier masqué ___ des vies innocentes. »",
          "dir": "down",
          "r": 2,
          "c": 4
        },
        {
          "id": 4,
          "word": "ÉTAIENT",
          "clue": "Ils + Être : « Les anciens chevaliers ___ des modèles d'honneur. »",
          "dir": "down",
          "r": 2,
          "c": 6
        },
        {
          "id": 5,
          "word": "FAISAIT",
          "clue": "Il + Faire : « L'anti-héros ___ régner sa propre loi dans l'ombre. »",
          "dir": "across",
          "r": 6,
          "c": 7
        },
        {
          "id": 6,
          "word": "PROTÉGEAIT",
          "clue": "Elle + Protéger : « L'héroïne ___ vaillamment le secret du sanctuaire. »",
          "dir": "down",
          "r": 1,
          "c": 1
        },
        {
          "id": 7,
          "word": "LUTTAIT",
          "clue": "Elle + Lutter : « La rébellion ___ sans relâche pour retrouver sa liberté. »",
          "dir": "down",
          "r": 4,
          "c": 13
        }
      ]
    }
  },
  {
    "id": "pc_avoir_reg",
    "name": "2. Passé Composé : AVOIR (Réguliers)",
    "desc": "Participes passés réguliers en -é, -i, -u avec Avoir (sans espace)",
    "badge": "AVOIR (RÉG.)",
    "color": "#3b82f6",
    "bg": "rgba(59, 130, 246, 0.18)",
    "emoji": "⚔️",
    "puzzle": {
      "title": "Grille 2 : Passé Composé avec AVOIR (Participes Réguliers)",
      "description": "Écrivez l'auxiliaire avoir et le participe passé sans espace (ex: ASAUVÉ, AFINI, ADÉFENDU).",
      "numRows": 14,
      "numCols": 14,
      "puzzleData": [
        {
          "id": 1,
          "word": "ONTATTAQUÉ",
          "clue": "Ils + Attaquer : « Les monstres ailés ___ la forteresse au crépuscule. »",
          "dir": "across",
          "r": 3,
          "c": 0
        },
        {
          "id": 2,
          "word": "ASAUVÉ",
          "clue": "Elle + Sauver : « L'héroïne ailée ___ le pont avant son effondrement. »",
          "dir": "down",
          "r": 1,
          "c": 3
        },
        {
          "id": 3,
          "word": "ARÉUSSI",
          "clue": "Il + Réussir : « L'anti-héros rusé ___ à déjouer le piège mortel. »",
          "dir": "down",
          "r": 1,
          "c": 9
        },
        {
          "id": 4,
          "word": "AFINI",
          "clue": "Il + Finir : « Le champion ___ son entraînement sous les acclamations. »",
          "dir": "down",
          "r": 0,
          "c": 1
        },
        {
          "id": 5,
          "word": "ADÉFENDU",
          "clue": "Elle + Défendre : « La sentinelle ___ la porte principale jusqu'au bout. »",
          "dir": "across",
          "r": 6,
          "c": 1
        },
        {
          "id": 6,
          "word": "ONTCHOISI",
          "clue": "Ils + Choisir : « Les justiciers ___ de s'unir pour vaincre le mal. »",
          "dir": "down",
          "r": 5,
          "c": 6
        },
        {
          "id": 7,
          "word": "AVONSGAGNÉ",
          "clue": "Nous + Gagner : « Grâce à notre bravoure collective, nous ___ la bataille. »",
          "dir": "across",
          "r": 10,
          "c": 4
        }
      ]
    }
  },
  {
    "id": "pc_avoir_irreg",
    "name": "3. Passé Composé : AVOIR (Irréguliers)",
    "desc": "Participes passés irréguliers clés avec Avoir (sans espace)",
    "badge": "AVOIR (IRRÉG.)",
    "color": "#dc2626",
    "bg": "rgba(220, 38, 38, 0.18)",
    "emoji": "💥",
    "puzzle": {
      "title": "Grille 3 : Passé Composé avec AVOIR (Participes Irréguliers)",
      "description": "Écrivez l'auxiliaire avoir et le participe passé irrégulier sans espace (ex: APRIS, AVU, ADÉTRUIT).",
      "numRows": 11,
      "numCols": 11,
      "puzzleData": [
        {
          "id": 1,
          "word": "ONTCOMPRIS",
          "clue": "Ils + Comprendre : « Les citoyens ___ enfin le vrai sacrifice de leur héros. »",
          "dir": "across",
          "r": 4,
          "c": 1
        },
        {
          "id": 2,
          "word": "ADÉCOUVERT",
          "clue": "Elle + Découvrir : « L'espionne ___ le laboratoire clandestin de l'antagoniste. »",
          "dir": "down",
          "r": 1,
          "c": 4
        },
        {
          "id": 3,
          "word": "APRIS",
          "clue": "Il + Prendre : « Le voleur justicier ___ le talisman sans se faire repérer. »",
          "dir": "down",
          "r": 3,
          "c": 7
        },
        {
          "id": 4,
          "word": "ADÉTRUIT",
          "clue": "Il + Détruire : « Le puissant guerrier ___ le repaire des ombres d'un coup. »",
          "dir": "across",
          "r": 2,
          "c": 3
        },
        {
          "id": 5,
          "word": "AFAIT",
          "clue": "Il + Faire : « Le protecteur ___ le vœu solennel de ne jamais abandonner. »",
          "dir": "across",
          "r": 10,
          "c": 0
        },
        {
          "id": 6,
          "word": "AVU",
          "clue": "Elle + Voir : « L'héroïne ___ le signal d'alarme projeté dans les nuages. »",
          "dir": "across",
          "r": 7,
          "c": 3
        },
        {
          "id": 7,
          "word": "APU",
          "clue": "Il + Pouvoir : « Grâce à son armure high-tech, il ___ stopper le projectile. »",
          "dir": "down",
          "r": 0,
          "c": 8
        }
      ]
    }
  },
  {
    "id": "pc_etre_reg",
    "name": "4. Passé Composé : ÊTRE (Réguliers)",
    "desc": "Verbes réguliers de la Maison d'Être & accords (sans espace)",
    "badge": "ÊTRE (ACCORDS)",
    "color": "#10b981",
    "bg": "rgba(16, 185, 129, 0.18)",
    "emoji": "🦸",
    "puzzle": {
      "title": "Grille 4 : Passé Composé avec ÊTRE (Verbes Réguliers & Accords)",
      "description": "Écrivez être et le participe accordé avec le sujet sans espace (ex: ESTARRIVÉE, SONTRESTÉS).",
      "numRows": 14,
      "numCols": 18,
      "puzzleData": [
        {
          "id": 1,
          "word": "ESTARRIVÉE",
          "clue": "Elle + Arriver : « L'héroïne masquée ___ à temps pour désactiver la bombe. »",
          "dir": "across",
          "r": 7,
          "c": 0
        },
        {
          "id": 2,
          "word": "SONTRESTÉS",
          "clue": "Ils + Rester : « Les gardes d'élite ___ fidèles au serment de protection. »",
          "dir": "down",
          "r": 4,
          "c": 2
        },
        {
          "id": 3,
          "word": "ESTTOMBÉ",
          "clue": "Il + Tomber : « L'adversaire redoutable ___ à genoux sous le coup du bouclier. »",
          "dir": "down",
          "r": 0,
          "c": 8
        },
        {
          "id": 4,
          "word": "ESTALLÉE",
          "clue": "Elle + Aller : « La détective ___ inspecter la tour abandonnée. »",
          "dir": "across",
          "r": 10,
          "c": 1
        },
        {
          "id": 5,
          "word": "ESTENTRÉ",
          "clue": "Il + Entrer : « L'anti-héros ___ discrètement par le toit de verre. »",
          "dir": "down",
          "r": 1,
          "c": 4
        },
        {
          "id": 6,
          "word": "ESTMONTÉE",
          "clue": "Elle + Monter : « La vigie ___ au plus haut sommet pour surveiller l'horizon. »",
          "dir": "across",
          "r": 13,
          "c": 1
        },
        {
          "id": 7,
          "word": "SONTTOMBÉES",
          "clue": "Elles + Tomber : « Les défenses ennemies ___ sous les coups de notre alliance. »",
          "dir": "across",
          "r": 4,
          "c": 7
        }
      ]
    }
  },
  {
    "id": "pc_etre_irreg",
    "name": "5. Passé Composé : ÊTRE (Irréguliers)",
    "desc": "Verbes irréguliers de la Maison d'Être & accords (sans espace)",
    "badge": "ÊTRE (IRRÉG.)",
    "color": "#8b5cf6",
    "bg": "rgba(139, 92, 246, 0.18)",
    "emoji": "⚡",
    "puzzle": {
      "title": "Grille 5 : Passé Composé avec ÊTRE (Verbes Irréguliers & Accords)",
      "description": "Écrivez être et le participe irrégulier accordé sans espace (ex: ESTNÉ, ESTMORTE, SONTDEVENUS).",
      "numRows": 13,
      "numCols": 11,
      "puzzleData": [
        {
          "id": 1,
          "word": "SONTDEVENUS",
          "clue": "Ils + Devenir : « Ces orphelins courageux ___ les protecteurs de la nation. »",
          "dir": "across",
          "r": 4,
          "c": 0
        },
        {
          "id": 2,
          "word": "ESTREVENUE",
          "clue": "Elle + Revenir : « La légende vivante ___ d'un long exil pour nous guider. »",
          "dir": "down",
          "r": 3,
          "c": 10
        },
        {
          "id": 3,
          "word": "ESTPARTIE",
          "clue": "Elle + Partir : « La guerrière solitaire ___ en mission secrète au lever du jour. »",
          "dir": "down",
          "r": 2,
          "c": 3
        },
        {
          "id": 4,
          "word": "ESTVENU",
          "clue": "Il + Venir : « Le champion masqué ___ prêter main-forte à la rébellion. »",
          "dir": "down",
          "r": 1,
          "c": 6
        },
        {
          "id": 5,
          "word": "ESTMORTE",
          "clue": "Elle + Mourir : « L'anti-héroïne tragique ___ en protégeant son ultime secret. »",
          "dir": "down",
          "r": 0,
          "c": 1
        },
        {
          "id": 6,
          "word": "ESTNÉ",
          "clue": "Il + Naître : « Dans le feu du combat, un nouvel espoir ___ pour la planète. »",
          "dir": "down",
          "r": 1,
          "c": 8
        },
        {
          "id": 7,
          "word": "ESTSORTI",
          "clue": "Il + Sortir : « Le justicier ___ de l'ombre au moment le plus critique. »",
          "dir": "across",
          "r": 8,
          "c": 1
        }
      ]
    }
  }
];
