import React, { useRef, useEffect, useState } from 'react';
import './Fishtopia.css';

// --- GAME CONSTANTS ---
const TILE = 40;
const COLS = 20;
const ROWS = 15;
const WIDTH = COLS * TILE;
const HEIGHT = ROWS * TILE;

// Tile types
const GRASS = 0; // Walkable Sand / Dirt Path ONLY
const WATER = 1; // IMPASSABLE Water (Strict Hard Rule: CANNOT walk on water!)
const TREE = 2; // IMPASSABLE Forest / Bushes / Rocks / Long Grass / Cliff / Jungle
const MARKET = 3; // IMPASSABLE Fish Market Stall structure
const TEMPLE = 4; // IMPASSABLE Question Booth Cabin structure
const PIER = 5; // Walkable Wooden Fishing Dock ("Penton")

// Base Map Grid (Level 1): STRICT whitelist of the user's black painted path.
// Dirt path (0) and wooden pier (5) are the ONLY WALKABLE TILES.
// All non-painted areas (trees=2, water=1, market=3, booth=4) are 100% IMPASSABLE.
const MAP_GRID = [
  [2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,0,0,2,3,3,3,3,2,2,2,2,2,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,2,2,2,2,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,4,4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2],
  [2,2,2,2,2,0,0,0,0,0,5,5,5,5,5,5,5,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,5,5,5,5,5,5,5,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// Level 2 Map (Brittany Coastal Cliffs): STRICT whitelist matching user's black painted path!
const MAP_LEVEL_2 = [
  [2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,0,0,2,3,3,3,3,2,2,2,2,2,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,2,2,2,2,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,2,2,2,2,2],
  [2,2,4,4,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2],
  [2,2,2,2,2,0,0,0,0,0,5,5,5,5,5,5,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,5,5,5,5,5,5,1,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// Level 3 Map (Cape Cod Dunes): STRICT whitelist matching user's black painted path!
const MAP_LEVEL_3 = [
  [2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,1,1,1,2],
  [2,2,2,2,2,2,2,2,0,0,3,3,3,3,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,0,0,2,3,3,3,3,1,1,1,1,1,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,4,4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2],
  [2,2,2,2,2,0,0,0,0,0,5,5,5,5,5,5,5,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,5,5,5,5,5,5,5,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// Level 4 Map (Tahiti Lagoon): STRICT whitelist matching user's black painted path!
const MAP_LEVEL_4 = [
  [2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,0,0,3,3,3,3,2,1,1,1,1,2],
  [2,2,2,2,2,2,2,0,0,2,3,3,3,3,2,1,1,1,1,2],
  [2,1,4,4,4,4,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,1,4,4,4,4,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,1,4,4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2],
  [2,1,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2],
  [2,2,2,2,2,0,0,0,0,0,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,2,2,2,2,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

const MAP_LEVEL_1 = MAP_GRID;

// ADJUSTED ECONOMY: Reduced fish sales values (~3x lower) so students must answer more questions!
const FISH_TYPES = [
  { name: "Sardine", rarity: "Common", value: 1, icon: "🐟" },
  { name: "Petit Crabe", rarity: "Common", value: 2, icon: "🦀" },
  { name: "Poisson-Clown", rarity: "Rare", value: 5, icon: "🐠" },
  { name: "Poisson-Globe", rarity: "Rare", value: 7, icon: "🐡" },
  { name: "Requin Blanc", rarity: "Epic", value: 20, icon: "🦈" },
  { name: "Pieuvre Géante", rarity: "Epic", value: 25, icon: "🐙" },
  { name: "Kraken des Abysses", rarity: "Legendary", value: 80, icon: "🦑" },
  { name: "Léviathan Doré", rarity: "Legendary", value: 150, icon: "🐉" }
];

const RODS = [
  { id: 1, name: "Canne en Bois", cost: 0, rates: [0.90, 0.10, 0.0, 0.0] },
  { id: 2, name: "Canne en Fibre", cost: 50, rates: [0.50, 0.40, 0.10, 0.0] },
  { id: 3, name: "Canne en Or", cost: 200, rates: [0.10, 0.40, 0.40, 0.10] },
  { id: 4, name: "Canne en Diamant", cost: 500, rates: [0.0, 0.10, 0.50, 0.40] }
];

// EXPANDED QUESTION BANK (80 Total Questions - 20 Per Level!)
const QUESTIONS = {
  "1": [
    { "q": "Comment qualifie-t-on un personnage qui accomplit des actes héroïques mais a des méthodes moralement douteuses ?", "opts": ["Un justicier aveugle", "Un anti-héros", "Un antagoniste"], "ans": 1 },
    { "q": "Quel mot désigne l'adversaire direct du protagoniste dans un récit ?", "opts": ["L'allié", "L'antagoniste", "Le figurant"], "ans": 1 },
    { "q": "La qualité morale d'un héros qui affronte le danger sans faiblir est :", "opts": ["La lâcheté", "Le dévouement et la bravoure", "L'indifférence"], "ans": 1 },
    { "q": "Pour débuter une argumentation sur un personnage, quel connecteur utilise-t-on ?", "opts": ["Tout d'abord", "Finalement", "Cependant"], "ans": 0 },
    { "q": "Un héros classique fait souvent passer le bien ___ avant son intérêt personnel.", "opts": ["commun", "privé", "illusoire"], "ans": 0 },
    { "q": "Le talon d'Achille d'un personnage représente :", "opts": ["Son superpouvoir secret", "Sa faiblesse ou vulnérabilité", "Son armure enchantée"], "ans": 1 },
    { "q": "Quel connecteur exprime une relation d'addition ?", "opts": ["En outre", "Néanmoins", "Par conséquent"], "ans": 0 },
    { "q": "Un acte accompli avec désintéressement pour secourir autrui est un acte de :", "opts": ["Trahison", "Dévouement", "Vengeance"], "ans": 1 },
    { "q": "L'anti-héros agit souvent poussé par :", "opts": ["Une quête de gloire pure", "Une blessure passée ou la survie", "Le respect aveugle des lois"], "ans": 1 },
    { "q": "Pour exprimer une opposition entre deux idées, on utilise :", "opts": ["C'est pourquoi", "Cependant", "D'abord"], "ans": 1 },
    { "q": "Un combattant qui refuse de reculer devant une bête féroce fait preuve de :", "opts": ["Couardise", "Bravoure", "Rancœur"], "ans": 1 },
    { "q": "Comment appelle-t-on l'épreuve initiatique qui transforme un simple citoyen en sauveur ?", "opts": ["Le serment civique", "La quête héroïque", "La trêve"], "ans": 1 },
    { "q": "Quel connecteur annonce la conséquence d'une action ?", "opts": ["Par conséquent", "En premier lieu", "Toutefois"], "ans": 0 },
    { "q": "Le mobile secret qui pousse un personnage à agir s'appelle :", "opts": ["Sa motivation", "Sa maladresse", "Son costume"], "ans": 0 },
    { "q": "Un personnage impitoyable et cruel envers ses ennemis est :", "opts": ["Clément", "Impitoyable", "Tolérant"], "ans": 1 },
    { "q": "Pour conclure une analyse morale, on emploie :", "opts": ["Premièrement", "En conclusion", "Par ailleurs"], "ans": 1 },
    { "q": "L'anti-héros se distingue du méchant classique car :", "opts": ["Il n'a aucun pouvoir", "Il possède encore une part d'humanité", "Il réussit toujours sans effort"], "ans": 1 },
    { "q": "L'acte de pardonner à un rival vaincu s'appelle :", "opts": ["La clémence", "L'embuscade", "L'avarice"], "ans": 0 },
    { "q": "Quel connecteur permet d'ajouter un argument supplémentaire ?", "opts": ["De plus", "Donc", "En revanche"], "ans": 0 },
    { "q": "Un pacte conclu entre deux guerriers pour s'entraider est :", "opts": ["Une rivalité", "Une alliance", "Une dispute"], "ans": 1 }
  ],
  "2": [
    { "q": "« Pendant que le héros ___ les remparts, la foudre est tombée. »", "opts": ["surveillait", "a surveillé", "surveillera"], "ans": 0 },
    { "q": "« Soudain, l'alarme de la forteresse ___ dans la nuit. »", "opts": ["retentissait", "a retenti", "retentit"], "ans": 1 },
    { "q": "« Chaque matin, le vieux mentor ___ les recrues au maniement du bouclier. »", "opts": ["a entraîné", "entraînait", "entraîne"], "ans": 1 },
    { "q": "« À cet instant précis, elle ___ que le trésor était faux. »", "opts": ["comprenait", "a compris", "a comprenant"], "ans": 1 },
    { "q": "« Il faisait un froid glacial et la neige ___ les chemins d'accès. »", "opts": ["bloquait", "a bloqué", "bloquer"], "ans": 0 },
    { "q": "« Tandis que nous négocions avec le chef, l'antagoniste ___ en courant. »", "opts": ["entrait", "est entré", "a entré"], "ans": 1 },
    { "q": "« Autrefois, les villageois ___ aveuglément en la protection des chevaliers. »", "opts": ["ont cru", "croyaient", "croient"], "ans": 1 },
    { "q": "« Dès qu'il a vu le danger, le justicier ___ son arc de guerre. »", "opts": ["bandait", "a bandé", "bande"], "ans": 1 },
    { "q": "« La sorcière ___ un long voile noir qui flottait au vent. »", "opts": ["a porté", "portait", "porta"], "ans": 1 },
    { "q": "« L'anti-héros ___ un dilemme cruel hier soir lors de l'attaque. »", "opts": ["tranchait", "a tranché", "tranchera"], "ans": 1 },
    { "q": "« Les gardes ___ profondément quand les espions ont franchi la grille. »", "opts": ["dormaient", "ont dormi", "dorment"], "ans": 0 },
    { "q": "« Finalement, après des heures d'attente, la porte dérobée ___ avec fracas. »", "opts": ["s'ouvrait", "s'est ouverte", "s'était ouvrir"], "ans": 1 },
    { "q": "Pour décrire le temps, le décor ou l'état d'esprit dans le passé, quel temps emploie-t-on ?", "opts": ["Le passé composé", "L'imparfait", "Le subjonctif"], "ans": 1 },
    { "q": "Pour exprimer une action soudaine, ponctuelle et complètement achevée :", "opts": ["L'imparfait", "Le passé composé", "Le conditionnel"], "ans": 1 },
    { "q": "« Le chevalier était blessé (imparfait) mais il ___ le combat jusqu'au bout. »", "opts": ["poursuivait", "a poursuivi", "poursuivre"], "ans": 1 },
    { "q": "« Tous les soirs, l'espionne ___ les mouvements de la garde royale. »", "opts": ["observait", "a observé", "observe"], "ans": 0 },
    { "q": "« Brusquement, une flèche ennemie ___ le bouclier en deux. »", "opts": ["fendait", "a fendu", "fend"], "ans": 1 },
    { "q": "« Le château était immense et ses couloirs ___ d'ombres menaçantes. »", "opts": ["regorgeaient", "ont regorgé", "regorge"], "ans": 0 },
    { "q": "« Le voleur s'échappait sur les toits quand un garde ___ la torche. »", "opts": ["allumait", "a allumé", "allume"], "ans": 1 },
    { "q": "« Ce jour mémorable, l'anti-héros ___ sa fidélité à la cause commune. »", "opts": ["prouvait", "a prouvé", "prouver"], "ans": 1 }
  ],
  "3": [
    { "q": "« Après la bataille, les guerriers blessés ___ au campement. » (revenir, masc. plur.)", "opts": ["sont revenus", "ont revenu", "sont revenu"], "ans": 0 },
    { "q": "« La vaillante capitaine ___ seule au sommet de la citadelle. » (monter, fém. sing.)", "opts": ["a montée", "est montée", "est monté"], "ans": 1 },
    { "q": "« Les deux héros rivaux ___ longuement dans les yeux avant le duel. » (se regarder)", "opts": ["se sont regardés", "ont se regardé", "se sont regardé"], "ans": 0 },
    { "q": "« Avant l'aube, la magicienne ___ dans la forêt interdite. » (s'aventurer, fém. sing.)", "opts": ["s'est aventurée", "a s'aventuré", "s'est aventuré"], "ans": 0 },
    { "q": "« Les éclaireurs ___ à l'aube pour surprendre l'avant-poste. » (partir, masc. plur.)", "opts": ["ont partis", "sont partis", "sont parti"], "ans": 1 },
    { "q": "« L'anti-héros et son frère ___ la main pour sceller la paix. » (se tendre, réciproque)", "opts": ["se sont tendu", "se sont tendus", "ont tendu"], "ans": 0 },
    { "q": "« Dès le premier choc, le cavalier ___ lourdement de sa monture. » (tomber, masc. sing.)", "opts": ["est tombé", "a tombé", "est tombée"], "ans": 0 },
    { "q": "« Nous (masc. plur.) ___ dans le piège tendu par le traître. » (tomber)", "opts": ["sommes tombés", "avons tombé", "sommes tombé"], "ans": 0 },
    { "q": "« Les sentinelles ___ sans faire le moindre bruit. » (s'éloigner, fém. plur.)", "opts": ["se sont éloignées", "se sont éloigné", "ont s'éloignées"], "ans": 0 },
    { "q": "« La justicière masquée ___ par la fenêtre secrète. » (s'échapper, fém. sing.)", "opts": ["s'est échappée", "a échappé", "s'est échappé"], "ans": 0 },
    { "q": "« Les deux complices ___ dans la foule en délire. » (se dissimuler, masc. plur.)", "opts": ["se sont dissimulés", "ont dissimulé", "se sont dissimulé"], "ans": 0 },
    { "q": "« À quelle heure les renforts ___ dans la vallée ? » (arriver, masc. plur.)", "opts": ["sont arrivés", "ont arrivé", "sont arrivé"], "ans": 0 },
    { "q": "« Face au péril, vous (masc. plur.) ___ jusqu'au dernier souffle. » (se battre)", "opts": ["vous êtes battus", "vous avez battu", "vous êtes battu"], "ans": 0 },
    { "q": "« L'héroïne ___ devant la porte du sanctuaire. » (s'agenouiller, fém. sing.)", "opts": ["s'est agenouillée", "a agenouillé", "s'est agenouillé"], "ans": 0 },
    { "q": "« Les deux espions ___ en secret sur la rive du fleuve. » (se rejoindre, masc. plur.)", "opts": ["se sont rejoints", "ont rejoints", "se sont rejoint"], "ans": 0 },
    { "q": "Quel auxiliaire emploie-t-on TOUJOURS pour conjuguer les verbes pronominaux au passé composé ?", "opts": ["Avoir", "Être", "Faire"], "ans": 1 },
    { "q": "« La princesse rebelle ___ auprès de son peuple fidèle. » (rester, fém. sing.)", "opts": ["est restée", "a resté", "est resté"], "ans": 0 },
    { "q": "« Les combattants ___ compte de leur terrible erreur. » (se rendre compte)", "opts": ["se sont rendu", "se sont rendus", "ont rendu"], "ans": 0 },
    { "q": "« Quand le jour s'est levé, ils ___ au sommet de la colline. » (arriver, masc. plur.)", "opts": ["sont arrivés", "ont arrivé", "sont arrivé"], "ans": 0 },
    { "q": "« Les deux adversaires ___ un pacte de non-agression. » (se promettre)", "opts": ["se sont promis", "se sont promis(es)", "ont promis"], "ans": 0 }
  ],
  "4": [
    { "q": "« Le justicier a violé les lois de la cité ; ___, ses intentions visaient le bien commun. »", "opts": ["toutefois", "ainsi", "d'abord"], "ans": 0 },
    { "q": "« L'anti-héros a dérobé l'antidote royal. ___, il s'est empressé de soigner les orphelins. »", "opts": ["Néanmoins", "En revanche", "En outre"], "ans": 0 },
    { "q": "« Il a bravé les ordres du conseil des sages ; ___, il doit être jugé équitablement. »", "opts": ["par conséquent", "premièrement", "en outre"], "ans": 0 },
    { "q": "« Le héros classique agit par altruisme. ___, l'anti-héros privilégie souvent sa survie. »", "opts": ["En revanche", "C'est pourquoi", "De plus"], "ans": 0 },
    { "q": "« L'antagoniste paraissait invincible ; ___, une faille dans son armure a causé sa perte. »", "opts": ["cependant", "en conclusion", "également"], "ans": 0 },
    { "q": "Qu'est-ce qui caractérise le mieux le dilemme moral d'un anti-héros ?", "opts": ["L'absence totale d'émotions", "Le conflit entre ses valeurs intimes et la loi établie", "L'obéissance absolue aux ordres"], "ans": 1 },
    { "q": "« Le détective a réuni des preuves irréfutables ; ___, il n'a pu empêcher le crime. »", "opts": ["pourtant", "donc", "en premier lieu"], "ans": 0 },
    { "q": "« ___ d'évaluer les actes du héros, examinons les circonstances du combat. »", "opts": ["Avant", "Après", "Tandis que"], "ans": 0 },
    { "q": "« Les citoyens admiraient son courage. Ils louaient ___ sa grande humilité. »", "opts": ["également", "néanmoins", "par contre"], "ans": 0 },
    { "q": "« Le mercenaire a trahi ses employeurs corrompus ; ___, il a sauvé des innocents. »", "opts": ["ainsi", "au contraire", "en premier lieu"], "ans": 0 },
    { "q": "Pourquoi la figure de l'anti-héros est-elle souvent plus réaliste aux yeux des lecteurs ?", "opts": ["Parce qu'il est immortel", "Parce qu'il possède des doutes et des imperfections humaines", "Parce qu'il ne perd jamais un combat"], "ans": 1 },
    { "q": "« L'ennemi avançait en grand nombre. ___, la garnison a tenu la porte d'armes. »", "opts": ["Malgré cela", "En conclusion", "C'est pourquoi"], "ans": 0 },
    { "q": "« ___ de cette épopée, nous retenons que chaque victoire exige de lourds sacrifices. »", "opts": ["Au terme", "Au début", "Par ailleurs"], "ans": 0 },
    { "q": "« Ce héros n'a utilisé aucune arme létale ; ___, il a fait preuve d'une retenue exemplaire. »", "opts": ["en d'autres termes", "cependant", "pourtant"], "ans": 0 },
    { "q": "Quelle nuance oppose le courage héroïque à la témérité imprudente ?", "opts": ["La témérité ignore le danger, le courage l'affronte lucidement", "Le courage est toujours magique", "Il n'y a aucune différence"], "ans": 0 },
    { "q": "« La menace a été neutralisée sans perte humaine ; ___, la mission est un franc succès. »", "opts": ["dès lors", "toutefois", "au contraire"], "ans": 0 },
    { "q": "« Le chevalier protégeait les faibles ___ le renégat pillait les convois royaux. »", "opts": ["alors que", "donc", "par conséquent"], "ans": 0 },
    { "q": "« ___, les frontières du royaume sont restaurées et la paix règne de nouveau. »", "opts": ["Finalement", "Premièrement", "D'ailleurs"], "ans": 0 },
    { "q": "Quel connecteur marque la reformulation explicative d'un exploit héroïque ?", "opts": ["C'est-à-dire", "Cependant", "Néanmoins"], "ans": 0 },
    { "q": "« En dernière analyse, le dévouement du héros transcende ses faiblesses individuelles. » Que signifie « transcende » ?", "opts": ["Dépasse et sublime", "Détruit complètement", "Imite aveuglément"], "ans": 0 }
  ]
};

export default function Fishtopia({ onBack }) {
  const canvasRef = useRef(null);
  
  const [coins, setCoins] = useState(0);
  const [bait, setBait] = useState(5);
  const [inventory, setInventory] = useState([]);
  const [rodLevel, setRodLevel] = useState(1);
  const [musicPlaying, setMusicPlaying] = useState(false);
  
  const [interactionHint, setInteractionHint] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [caughtFish, setCaughtFish] = useState(null);
  
  const playerLevel = rodLevel;
  
  const [currentQ, setCurrentQ] = useState(null);
  const [qState, setQState] = useState(null);

  // Hamster Player Entity (Size: 24) - Spawns SAFELY in center of open path at col 4.5, row 7.5
  const playerRef = useRef({
    x: 4.5 * TILE,
    y: 7.5 * TILE,
    vx: 0,
    vy: 0,
    speed: 3,
    size: 24,
    color: '#f59e0b',
    facing: 'right'
  });

  const keys = useRef({});
  const gameLoopRef = useRef(null);
  const stateRef = useRef({ activeModal, bait, rodLevel }); 
  const texturesRef = useRef({});

  useEffect(() => {
    stateRef.current = { activeModal, bait, rodLevel };
  }, [activeModal, bait, rodLevel]);

  useEffect(() => {
    const loadTex = (name, url) => {
      const img = new Image();
      img.src = url;
      texturesRef.current[name] = img;
    };
    loadTex('zelda_bg_level1', '/assets/francotopia_bg_level1.jpg');
    loadTex('zelda_bg_level2', '/assets/francotopia_bg_level2.jpg');
    loadTex('zelda_bg_level3', '/assets/francotopia_bg_level3.jpg');
    loadTex('zelda_bg_level4', '/assets/francotopia_bg_level4.jpg');
  }, []);

  useEffect(() => {
    // Spawn player safely in center of dirt path (col 4.5, row 7.5)
    playerRef.current.x = 4.5 * TILE;
    playerRef.current.y = 7.5 * TILE;

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (!stateRef.current.activeModal) e.preventDefault();
      }

      const key = e.key.toLowerCase();
      keys.current[key] = true;
      
      const isSpace = e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';
      if (isSpace && !stateRef.current.activeModal) {
        handleInteract();
      }
    };
    const handleKeyUp = (e) => keys.current[e.key.toLowerCase()] = false;

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [rodLevel]);

  const audioElRef = useRef(null);

  useEffect(() => {
    const audio = new window.Audio('/music/amber_road.m4a');
    audio.loop = true;
    audioElRef.current = audio;
    
    return () => {
      audio.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (!audioElRef.current) return;
    
    if (musicPlaying) {
      audioElRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioElRef.current.play().catch(e => console.log("Audio play failed:", e));
      setMusicPlaying(true);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      update(dt);
      draw(ctx, time);

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, []);

  const maskCanvasRef = useRef(null);
  const maskCtxRef = useRef(null);
  const maskDataRef = useRef({});

  useEffect(() => {
    // Load offscreen canvas masks for ALL 4 levels from pixel mask images!
    [1, 2, 3, 4].forEach(lvl => {
      const maskImg = new Image();
      maskImg.src = `/assets/level${lvl}_mask.jpg`;
      maskImg.onload = () => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = WIDTH;
        offCanvas.height = HEIGHT;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
        offCtx.drawImage(maskImg, 0, 0, WIDTH, HEIGHT);
        try {
          maskDataRef.current[lvl] = offCtx.getImageData(0, 0, WIDTH, HEIGHT);
        } catch (e) {
          console.error(`Mask level ${lvl} getImageData failed:`, e);
        }
      };
    });
  }, []);

  const getMapForLevel = () => {
    const lvl = stateRef.current?.rodLevel || 1;
    if (lvl === 2) return MAP_LEVEL_2;
    if (lvl === 3) return MAP_LEVEL_3;
    if (lvl === 4) return MAP_LEVEL_4;
    return MAP_LEVEL_1;
  };

  const getTile = (x, y) => {
    const col = Math.floor(x / TILE);
    const row = Math.floor(y / TILE);
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return 2; // Off-screen boundary is strictly IMPASSABLE!
    const activeMap = getMapForLevel();
    return activeMap[row][col];
  };

  // --- HARD RULES FOR MOVEMENT / WALKABILITY (DIRECT PIXEL-COLOR MASKING ACROSS ALL 4 LEVELS) ---
  // Hard Rule: Hamster CAN ONLY walk on pixels painted BLACK (R<70, G<70, B<70) in the level's annotated mask image!
  // Water, grass, rocks, forest, long grass, cliffs, and buildings are 100% STRICTLY IMPASSABLE across ALL 4 LEVELS!
  const checkCollisionAt = (px, py, size) => {
    const rLevel = stateRef.current?.rodLevel || 1;
    const activeMaskData = maskDataRef.current[rLevel];

    // For ALL Levels: Direct Pixel-Color Sampling from the black path mask image!
    if (activeMaskData) {
      const colSize = 8; // Nimble 8px collision box for smooth turning along black path
      const points = [
        { x: px - colSize/2, y: py - colSize/2 },
        { x: px + colSize/2, y: py - colSize/2 },
        { x: px - colSize/2, y: py + colSize/2 },
        { x: px + colSize/2, y: py + colSize/2 },
        { x: px, y: py }
      ];

      const imgData = activeMaskData.data;
      for (let c of points) {
        const cx = Math.floor(c.x);
        const cy = Math.floor(c.y);

        if (cx < 0 || cx >= WIDTH || cy < 0 || cy >= HEIGHT) return true; // Offscreen = BLOCKED!

        const index = (cy * WIDTH + cx) * 4;
        const r = imgData[index];
        const g = imgData[index + 1];
        const b = imgData[index + 2];

        // Pixel is BLACK if Red < 70, Green < 70, Blue < 70
        const isBlack = (r < 70 && g < 70 && b < 70);

        if (!isBlack) {
          return true; // BLOCKED! Only pixels painted black are walkable!
        }
      }
      return false; // Walkable!
    }

    // Grid fallback for other levels if mask is loading:
    const colSize = 8; // Nimble 8px collision box matching mask mode for smooth navigation
    const points = [
      { x: px - colSize/2, y: py - colSize/2 },
      { x: px + colSize/2, y: py - colSize/2 },
      { x: px - colSize/2, y: py + colSize/2 },
      { x: px + colSize/2, y: py + colSize/2 },
      { x: px, y: py }
    ];

    for (let c of points) {
      if (c.x < 0 || c.x >= WIDTH || c.y < 0 || c.y >= HEIGHT) return true;
      const tile = getTile(c.x, c.y);
      if (tile !== GRASS && tile !== PIER) {
        return true;
      }
    }

    return false;
  };

  // --- HARD RULES FOR INTERACTION TRIGGERS ---
  const getInteractionTarget = () => {
    const p = playerRef.current;
    
    // Check tiles directly in front (North / facing building entrance) of the hamster
    const tileInFrontFar = getTile(p.x, p.y - TILE * 0.75);
    const tileInFrontMid = getTile(p.x, p.y - TILE * 0.5);
    const tileInFrontNear = getTile(p.x, p.y - TILE * 0.25);
    const currentTile = getTile(p.x, p.y);

    // Rule: Question Booth tab when standing at the front entrance base
    if (tileInFrontFar === TEMPLE || tileInFrontMid === TEMPLE || tileInFrontNear === TEMPLE || (p.x >= 100 && p.x <= 240 && p.y >= 230 && p.y <= 300)) return 'station';

    // Rule: Fish Market / Trading tab ONLY when standing directly in front facing North
    if (tileInFrontFar === MARKET || tileInFrontMid === MARKET || tileInFrontNear === MARKET || (p.x >= 400 && p.x <= 560 && p.y >= 120 && p.y <= 180)) return 'market';

    // Rule: Fishing tab ONLY when standing on the wooden fishing dock ("penton")
    if (currentTile === PIER || (p.x >= 390 && p.y >= 340 && p.y <= 450)) return 'fish';

    return null;
  };

  const update = (dt) => {
    if (stateRef.current.activeModal) return;

    const p = playerRef.current;
    let dx = 0;
    let dy = 0;

    if (keys.current['w'] || keys.current['z'] || keys.current['arrowup']) dy = -p.speed;
    if (keys.current['s'] || keys.current['arrowdown']) dy = p.speed;
    if (keys.current['a'] || keys.current['q'] || keys.current['arrowleft']) dx = -p.speed;
    if (keys.current['d'] || keys.current['arrowright']) dx = p.speed;

    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx*dx + dy*dy);
      dx = (dx / length) * p.speed;
      dy = (dy / length) * p.speed;
    }

    p.vx = dx;
    p.vy = dy;

    if (dx < 0) p.facing = 'left';
    else if (dx > 0) p.facing = 'right';

    // Sub-step movement X (Hamster CANNOT walk through Question Booth cabin, Market, Bushes, Rocks, Forest, Long Grass, or Water!)
    const stepsX = Math.ceil(Math.abs(dx));
    const stepDx = dx / Math.max(1, stepsX);
    for (let s = 0; s < stepsX; s++) {
      if (!checkCollisionAt(p.x + stepDx, p.y, p.size)) {
        p.x += stepDx;
      } else {
        break;
      }
    }

    // Sub-step movement Y (Hamster CANNOT walk through Question Booth cabin, Market, Bushes, Rocks, Forest, Long Grass, or Water!)
    const stepsY = Math.ceil(Math.abs(dy));
    const stepDy = dy / Math.max(1, stepsY);
    for (let s = 0; s < stepsY; s++) {
      if (!checkCollisionAt(p.x, p.y + stepDy, p.size)) {
        p.y += stepDy;
      } else {
        break;
      }
    }

    // Coordinate clamping: Keep hamster strictly within game map bounds
    p.x = Math.max(p.size / 2, Math.min(WIDTH - p.size / 2, p.x));
    p.y = Math.max(p.size / 2, Math.min(HEIGHT - p.size / 2, p.y));

    const target = getInteractionTarget();
    if (target === 'station') setInteractionHint("🏛️ CLIQUEZ OU APPUYEZ SUR ESPACE POUR POSER UNE QUESTION");
    else if (target === 'market') setInteractionHint("🏪 CLIQUEZ OU APPUYEZ SUR ESPACE POUR OUVRIR LE MARCHÉ");
    else if (target === 'fish') setInteractionHint("🎣 CLIQUEZ OU APPUYEZ SUR ESPACE POUR PÊCHER (COÛTE 1 APPÂT)");
    else setInteractionHint(null);
  };

  // --- DRAW FUNCTION (DISNEY-STYLE CUTE HAMSTER WITH BIG EXPRESSIVE EYES, RED SCARF, WHITE GLOVES, AND VERTICAL FISHING POLE) ---
  const draw = (ctx, time) => {
    const rLevel = stateRef.current.rodLevel;
    
    let bgKey = 'zelda_bg_level1';
    if (rLevel === 2) bgKey = 'zelda_bg_level2';
    else if (rLevel === 3) bgKey = 'zelda_bg_level3';
    else if (rLevel === 4) bgKey = 'zelda_bg_level4';

    const bgImg = texturesRef.current[bgKey];
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);
    } else {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    // --- DRAW ANIMATED DISNEY-STYLE HAMSTER CHARACTER ---
    const p = playerRef.current;
    const isMoving = p.vx !== 0 || p.vy !== 0;

    // Disney Walk & Idle Animation Parameters
    const walkSpeed = 30; // Smooth energetic stepping frequency
    const legStep = isMoving ? Math.sin(time / walkSpeed) * 6 : 0;
    const legLift = isMoving ? Math.abs(Math.cos(time / walkSpeed)) * 4 : 0;
    
    // Idle Breathing & Movement Bobbing
    const idleBreathing = !isMoving ? Math.sin(time / 250) * 1.2 : 0;
    const bodyBob = isMoving ? Math.abs(Math.sin(time / 35)) * 4 : idleBreathing;
    const bodyWaddle = isMoving ? Math.sin(time / 60) * 0.12 : 0;

    // Disney Eye Blinking Logic (Quick blink every ~3.5 seconds)
    const blinkCycle = (time % 3500);
    const isBlinking = blinkCycle > 3350;
    const eyeHeightScale = isBlinking ? 0.2 : 1.0;

    // Soft drop shadow below feet (expands slightly when stepping)
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + p.size/2 + 3, p.size/2 + (isMoving ? 1.5 : 0), p.size/5, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.save();
    ctx.translate(p.x, p.y - bodyBob);
    ctx.rotate(bodyWaddle);

    // Directional Flip
    const baseScale = p.size / 24;
    const dirScaleX = p.facing === 'left' ? -baseScale : baseScale;
    ctx.scale(dirScaleX, baseScale);

    // 🐾 1. DISNEY BACK FEET / SHOES (Soft rounded Disney feet with yellow soles)
    ctx.fillStyle = '#b45309';
    // Left Foot
    ctx.beginPath();
    ctx.ellipse(-5.5 - legStep * 0.5, 14.5 - (legStep > 0 ? legLift : 0), 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(-5.5 - legStep * 0.5, 15.5 - (legStep > 0 ? legLift : 0), 2.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b45309';
    // Right Foot
    ctx.beginPath();
    ctx.ellipse(5.5 + legStep * 0.5, 14.5 - (legStep < 0 ? legLift : 0), 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(5.5 + legStep * 0.5, 15.5 - (legStep < 0 ? legLift : 0), 2.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 🐹 2. DISNEY CHUBBY TORSO & SCARF
    const bodyGrad = ctx.createRadialGradient(-3, -3, 2, 0, 2, 14);
    bodyGrad.addColorStop(0, '#fef08a');
    bodyGrad.addColorStop(0.5, '#f59e0b');
    bodyGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 2, 12, 13.5 + idleBreathing * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Fluffy Disney Tummy
    const bellyGrad = ctx.createRadialGradient(0, 5, 1, 0, 6, 8);
    bellyGrad.addColorStop(0, '#ffffff');
    bellyGrad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = bellyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 4.5, 7.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Disney Red Adventurer Scarf around neck
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(0, -5, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Scarf Knot Tails Fluttering in the Wind
    const scarfFlutter = isMoving ? Math.sin(time / 30) * 3 : Math.sin(time / 150) * 1;
    ctx.beginPath();
    ctx.moveTo(-2, -4);
    ctx.lineTo(-7 - scarfFlutter, 2 + scarfFlutter * 0.5);
    ctx.lineTo(-3, 4);
    ctx.closePath();
    ctx.fill();

    // Fluffy Puffy Tail (Back)
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(-11.5, 7.5, 4, 0, Math.PI * 2);
    ctx.fill();

    // 👂 3. DISNEY BIG ROUND EARS (Bouncing when walking, twitching when idle)
    const earBounce = isMoving ? Math.sin(time / 30) * 2.5 : Math.sin(time / 300) * 0.8;
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(-8.5, -14.5 + earBounce, 6, 0, Math.PI * 2);
    ctx.arc(8.5, -14.5 - earBounce, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(-8.5, -14.5 + earBounce, 3.2, 0, Math.PI * 2);
    ctx.arc(8.5, -14.5 - earBounce, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // 👁️ 4. BIG DISNEY EXPRESSIVE EYES, EYEBROWS & SMILE
    const eyeOffsetX = 2;

    // Chubby Disney Cheek Puffs
    ctx.fillStyle = 'rgba(251, 146, 60, 0.45)';
    ctx.beginPath();
    ctx.arc(-6.5 + eyeOffsetX, -2.5, 3.5, 0, Math.PI * 2);
    ctx.arc(4.5 + eyeOffsetX, -2.5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Large Round Disney Eyes (with Natural Blinking!)
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(-4 + eyeOffsetX, -6.5, 3, Math.max(0.5, 4 * eyeHeightScale), 0, 0, Math.PI * 2);
    ctx.ellipse(4 + eyeOffsetX, -6.5, 3, Math.max(0.5, 4 * eyeHeightScale), 0, 0, Math.PI * 2);
    ctx.fill();

    // Big White Disney Catchlight Highlights (Hidden during blink)
    if (!isBlinking) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5 + eyeOffsetX, -8, 1.4, 0, Math.PI * 2);
      ctx.arc(3 + eyeOffsetX, -8, 1.4, 0, Math.PI * 2);
      ctx.fill();
      // Little Second Sparkle (Bottom Right)
      ctx.beginPath();
      ctx.arc(-3 + eyeOffsetX, -5.2, 0.7, 0, Math.PI * 2);
      ctx.arc(5 + eyeOffsetX, -5.2, 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cute Disney Eyebrows
    const browBounce = isMoving ? Math.sin(time / 40) * 1.2 : 0;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-4 + eyeOffsetX, -12 + browBounce, 2.5, Math.PI + 0.3, Math.PI*2 - 0.3);
    ctx.arc(4 + eyeOffsetX, -12 - browBounce, 2.5, Math.PI + 0.3, Math.PI*2 - 0.3);
    ctx.stroke();

    // Button Nose
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(eyeOffsetX, -2, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Cheerful Disney Smile
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(eyeOffsetX, -1, 2.5, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // 🐾 5. LEFT ARM (Disney White Glove Paw swinging energetically when walking)
    const armSwing = isMoving ? Math.sin(time / walkSpeed) * 5 : Math.sin(time / 200) * 1;
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(-9.5, 2 + armSwing, 3.5, 2.5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff'; // White Disney Paw Glove
    ctx.beginPath();
    ctx.arc(-11, 4 + armSwing, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 🎣 6. RIGHT ARM & VERTICAL FISHING POLE (Held straight up to the side, NOT across face!)
    // Right Paw / White Disney Glove holding pole at right side
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(8.5, 2, 3.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff'; // White Glove
    ctx.beginPath();
    ctx.arc(9.5, 2, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Fishing Pole (Held straight vertical pointing up into the air!)
    ctx.save();
    let poleColor = '#78350f';
    if (rLevel === 2) poleColor = '#cbd5e1';
    else if (rLevel === 3) poleColor = '#fbbf24';
    else if (rLevel === 4) poleColor = '#38bdf8';

    const rodSway = isMoving ? Math.sin(time / 40) * 0.08 : Math.sin(time / 150) * 0.02;
    ctx.translate(9, 2);
    ctx.rotate(rodSway);

    // Pole Shaft pointing STRAIGHT UP (Clears face completely)
    ctx.fillStyle = poleColor;
    ctx.fillRect(-1.5, -44, 3.5, 48);

    // Shiny Disney Golden Reel
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(3, -2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.fillRect(3, -1, 3, 1);

    // Pole Grip Handle
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-2.5, -2, 5.5, 10);

    // DANGLING FISHING LINE & SWAYING HOOK / BOBBER
    const lineTipX = 0;
    const lineTipY = -44;
    const lineSway = isMoving ? Math.sin(time / 30) * 6.5 : Math.sin(time / 90) * 2.0;
    const hookX = lineTipX + lineSway;
    const hookY = lineTipY + 32;

    // Line String
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(lineTipX, lineTipY);
    ctx.lineTo(hookX, hookY);
    ctx.stroke();

    // Dangling Red & White Disney Bobber
    ctx.fillStyle = '#ef4444'; // Glossy Red top
    ctx.beginPath();
    ctx.arc(hookX, hookY, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff'; // Glossy White bottom
    ctx.beginPath();
    ctx.arc(hookX, hookY + 1.6, 2.0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Restore pole transform
    ctx.restore(); // Restore hamster transform
  };

  const handleInteract = () => {
    const target = getInteractionTarget();
    if (!target) return;

    if (target === 'station') {
      openQuestion();
    } else if (target === 'market') {
      setActiveModal('shop');
    } else if (target === 'fish') {
      if (stateRef.current.bait > 0) {
        fish();
      } else {
        alert("Vous n'avez plus d'appât ! Rendez-vous devant l'entrée du Kiosque des Questions.");
      }
    }
  };

  const fish = () => {
    setBait(b => b - 1);
    const rod = RODS[stateRef.current.rodLevel - 1];
    const rand = Math.random();
    
    let cumulative = 0;
    let caughtRarityIdx = 0;
    for (let i = 0; i < rod.rates.length; i++) {
      cumulative += rod.rates[i];
      if (rand <= cumulative) {
        caughtRarityIdx = i;
        break;
      }
    }
    
    const rarities = ["Common", "Rare", "Epic", "Legendary"];
    const rarity = rarities[caughtRarityIdx];
    
    let possibleFish = FISH_TYPES.filter(f => f.rarity === rarity);
    
    if (stateRef.current.rodLevel < 4) {
      possibleFish = possibleFish.filter(f => f.name !== "Léviathan Doré");
    }
    
    const caught = possibleFish[Math.floor(Math.random() * possibleFish.length)];
    
    setCaughtFish(caught);
    setInventory(inv => [...inv, caught]);
    
    if (caught.name === "Léviathan Doré") {
      setActiveModal('victory');
    } else {
      setActiveModal('fish_result');
    }
  };

  const unusedQuestionsRef = useRef({});

  const openQuestion = () => {
    if (!unusedQuestionsRef.current[rodLevel] || unusedQuestionsRef.current[rodLevel].length === 0) {
      unusedQuestionsRef.current[rodLevel] = [...QUESTIONS[rodLevel]].sort(() => Math.random() - 0.5);
    }
    const q = unusedQuestionsRef.current[rodLevel].pop();
    setCurrentQ(q);
    setQState(null);
    setActiveModal('question');
  };

  const handleAnswer = (idx) => {
    if (qState !== null) return;
    if (idx === currentQ.ans) {
      setQState('correct');
      setBait(b => b + 3);
      setTimeout(() => setActiveModal(null), 1000);
    } else {
      setQState('wrong');
      setTimeout(() => setActiveModal(null), 1500);
    }
  };

  const sellAll = () => {
    const totalValue = inventory.reduce((sum, fish) => sum + fish.value, 0);
    setCoins(c => c + totalValue);
    setInventory([]);
  };

  const buyRod = (level) => {
    const rod = RODS[level - 1];
    if (coins >= rod.cost && rodLevel < level) {
      setCoins(c => c - rod.cost);
      setRodLevel(level);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[800px] mb-4 items-center">
        <button className="back-btn m-0" onClick={onBack}>← Quitter Francotopia</button>
        <h2 className="text-accent m-0 font-extrabold tracking-wider text-2xl uppercase" style={{ color: '#facc15', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          🗡️ Francotopia : La Quête des Héros et Anti-Héros (Unité 1)
        </h2>
        <button 
          onClick={toggleMusic} 
          style={{ background: musicPlaying ? '#f59e0b' : '#94a3b8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {musicPlaying ? '🎵 Musique: ON' : '🎵 Musique: OFF'}
        </button>
      </div>

      <div className="fishtopia-container">
        <canvas 
          ref={canvasRef} 
          width={WIDTH} 
          height={HEIGHT} 
          className="fishtopia-canvas"
        />

        <div className="fishtopia-hud">
          <div className="hud-panel">
            <div className="hud-item" title="Pièces d'or">💰 {coins}</div>
            <div className="hud-item" title="Appâts">🪱 {bait}</div>
            <div className="hud-item" title="Sac à dos">🎒 {inventory.length}</div>
          </div>
          <div className="hud-panel font-extrabold">
            <span className="text-emerald-600">Niv. Joueur : {playerLevel}</span> | Canne : {RODS[rodLevel - 1].name}
          </div>
        </div>

        {interactionHint && !activeModal && (
          <div className="interaction-hint cursor-pointer" onClick={handleInteract}>
            {interactionHint}
          </div>
        )}

        {/* MODALS */}
        {activeModal === 'question' && currentQ && (
          <div className="game-overlay">
            <div className="modal-content">
              <h2>🏛️ Kiosque des Questions</h2>
              <p className="text-lg mb-4 font-bold">{currentQ.q}</p>
              
              <div className="q-options">
                {currentQ.opts.map((opt, i) => {
                  let btnClass = "";
                  if (qState !== null) {
                    if (i === currentQ.ans) btnClass = "correct";
                    else btnClass = "wrong opacity-50";
                  }
                  return (
                    <button key={i} className={btnClass} onClick={() => handleAnswer(i)}>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {qState === 'correct' && <p className="text-success font-bold mt-2">+3 Appâts !</p>}
              {qState === 'wrong' && <p className="text-danger font-bold mt-2">Incorrect !</p>}
            </div>
          </div>
        )}

        {activeModal === 'fish_result' && caughtFish && (
          <div className="game-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content fish-alert cursor-pointer">
              <h2 className={`rarity-${caughtFish.rarity}`}>Poisson Attrapé !</h2>
              <div className="fish-icon">{caughtFish.icon}</div>
              <h3 className="text-2xl font-bold">{caughtFish.name}</h3>
              <p className="text-gray-500 mb-4">{caughtFish.rarity} - Valeur: {caughtFish.value} 💰</p>
              <p className="text-sm italic opacity-50">(Cliquez pour continuer)</p>
            </div>
          </div>
        )}

        {activeModal === 'shop' && (
          <div className="game-overlay">
            <div className="modal-content">
              <h2>🏪 Le Marché de Poisson</h2>
              
              <div className="shop-items">
                <div className="shop-item bg-amber-50 border-amber-200">
                  <div>
                    <strong>Vendre Poissons</strong>
                    <p className="text-sm m-0">Vendre {inventory.length} poisson(s)</p>
                  </div>
                  <button onClick={sellAll} disabled={inventory.length === 0}>
                    Vendre Tout
                  </button>
                </div>

                {RODS.slice(1).map(rod => (
                  <div key={rod.id} className="shop-item">
                    <div>
                      <strong>{rod.name}</strong>
                      <p className="text-sm m-0">Coût : {rod.cost} 💰</p>
                    </div>
                    <button 
                      onClick={() => buyRod(rod.id)}
                      disabled={coins < rod.cost || rodLevel >= rod.id}
                      style={{ background: rodLevel >= rod.id ? '#10b981' : '' }}
                    >
                      {rodLevel >= rod.id ? 'Possédé' : 'Débloquer Niveau ' + rod.id}
                    </button>
                  </div>
                ))}
              </div>

              <button className="close-btn" onClick={() => setActiveModal(null)}>Fermer</button>
            </div>
          </div>
        )}

        {activeModal === 'victory' && caughtFish && (
          <div className="game-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content fish-alert cursor-pointer" style={{ border: '4px solid #f59e0b', boxShadow: '0 0 50px #f59e0b' }}>
              <h2 className="text-amber-500 text-3xl font-black">👑 GRAND MAÎTRE PÊCHEUR ! 👑</h2>
              <p className="font-bold text-lg text-emerald-700 mt-2">Quête d'Hyrule Accomplie !</p>
              <div className="fish-icon" style={{ fontSize: '90px', margin: '10px 0' }}>{caughtFish.icon}</div>
              <h3 className="text-3xl font-bold rarity-Legendary mb-2">{caughtFish.name}</h3>
              <p className="text-base text-gray-700">Félicitations ! Vous avez capturé le poisson légendaire suprême du Niveau 4. Vous avez répondu aux questions avec succès et êtes proclamé le <strong>Grand Maître PÊCHEUR de Francotopia</strong> !</p>
              <p className="text-xs italic mt-4 opacity-75">(Cliquez pour continuer)</p>
            </div>
          </div>
        )}

      </div>
      
      <div className="mt-4 text-center max-w-[800px] text-gray-600">
        <p><strong>Règles :</strong> Marchez sur le chemin 🚶 ! Montez sur le ponton pour pêcher 🎣 ! Placez-vous devant l'entrée du Kiosque ou du Marché pour interagir !</p>
      </div>
    </div>
  );
}
