import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Compass, Shield, Sparkles, CheckCircle2, HelpCircle, Volume2 } from 'lucide-react';
import { speakFrench } from '../../utils/speechUtils';

// ── Canvas dimensions & player constants ────────────────────────────────────
const CW = 860;
const CH = 540;
const PR = 14;          // player collision radius
const SPEED = 3.4;      // keyboard & click-to-move speed
const INTERACT_R = 72;  // altar interaction distance
const EXIT_R = 48;      // portal trigger distance

const ROOM_ORDER = ['foret', 'pont', 'cour', 'armurerie', 'grande_salle', 'donjon'];

// ══════════════════════════════════════════════════════════════════════════════
//  UNITÉ 2 — SANTÉ MENTALE & BIEN-ÊTRE : 6 SALLES (L'Impératif & Il faut que + Subjonctif)
//  Verbes cibles : gérer, s'exprimer, prendre, se confier, faire, dormir, comprendre, demander
// ══════════════════════════════════════════════════════════════════════════════
const ROOMS = {
  foret: {
    id: 'foret',
    step: 1,
    name: '1. La Clairière du Calme',
    subtitle: 'Verbes cibles : PRENDRE & RESPIRER (L’Impératif)',
    floorColor: '#3a4a38',
    wallColor: '#4a5d46',
    wallStyle: 'hedge',
    ambientLight: 0.48,
    spawn: { x: 85, y: 270 },
    exits: [
      { dir: 'E', to: 'pont', x: CW - 28, y: 270, w: 36, h: 100, spawnX: 80, spawnY: 270, label: 'Le Pont de la Parole →' },
    ],
    torches: [
      { x: 250, y: 72 }, { x: 540, y: 72 },
      { x: 250, y: 468 }, { x: 540, y: 468 },
      { x: 785, y: 195 }, { x: 785, y: 345 },
    ],
    // Wide, clear clay hedge-labyrinth corridors (all walkways >= 110px wide)
    obstacles: [
      // Perimeter clay walls with East portal opening (y: 215..325 open)
      { x: 0, y: 0, w: CW, h: 34, type: 'hedgewall' },
      { x: 0, y: CH - 34, w: CW, h: 34, type: 'hedgewall' },
      { x: 0, y: 34, w: 34, h: CH - 68, type: 'hedgewall' },
      { x: CW - 34, y: 34, w: 34, h: 180, type: 'hedgewall' },
      { x: CW - 34, y: 326, w: 34, h: CH - 360, type: 'hedgewall' },

      // Sculpted clay maze hedges & forest props
      { x: 185, y: 34, w: 46, h: 170, type: 'hedgewall' },
      { x: 185, y: 336, w: 46, h: 170, type: 'hedgewall' },
      { x: 370, y: 165, w: 46, h: 210, type: 'hedgewall' },
      { x: 575, y: 34, w: 46, h: 155, type: 'hedgewall' },
      { x: 575, y: 350, w: 46, h: 156, type: 'hedgewall' },

      // Decorative clay boulders & chests tucked against walls
      { x: 85, y: 75, w: 52, h: 44, type: 'rock', label: 'Rocher moussu' },
      { x: 85, y: 420, w: 52, h: 44, type: 'rock', label: 'Rocher moussu' },
      { x: 270, y: 65, w: 56, h: 40, type: 'chest', label: 'Coffre de Pleine Conscience' },
      { x: 460, y: 430, w: 62, h: 42, type: 'log', label: 'Tronc sculpté' },
    ],
    altar: { x: 680, y: 270, label: 'Autel du Souffle' },
    waypoints: [{ x: 85, y: 270 }, { x: 290, y: 270 }, { x: 290, y: 115 }, { x: 495, y: 115 }, { x: 495, y: 270 }, { x: 680, y: 270 }],
    questions: [
      {
        badge: 'Épreuve 1/2 • L’Impératif Affirmatif (TU)',
        context: 'Ton ami ressent beaucoup d’anxiété et de pression scolaire avant son examen.',
        prompt: '« _________ une grande respiration profonde et _________ du temps pour te calmer ! » (verbe PRENDRE à la 2e personne du singulier — tu)',
        options: [
          'Prends ... prends',
          'Prend ... prend',
          'Prenons ... prenez',
          'Prendre ... prendre',
        ],
        correct: 0,
        explanation: 'Bravo ! Pour un verbe du 3e groupe comme PRENDRE (qui ne se termine pas par -es au présent), l’impératif avec « tu » garde son -s : « Prends une respiration profonde ! ».',
      },
      {
        badge: 'Épreuve 2/2 • L’Obligation (Il faut que + Subjonctif)',
        context: 'Le gardien de la Clairière te rappelle une stratégie d’adaptation essentielle :',
        prompt: '« Pour protéger votre bien-être, il faut que vous _________ une pause loin des écrans. » (verbe PRENDRE au subjonctif présent)',
        options: [
          'preniez',
          'prenez',
          'prennent',
          'prendrez',
        ],
        correct: 0,
        explanation: 'Exact ! Après « Il faut que », on utilise le subjonctif présent. Avec « vous », PRENDRE utilise son radical « pren- » + « -iez » → « que vous preniez ».',
      },
    ],
  },

  pont: {
    id: 'pont',
    step: 2,
    name: '2. Le Pont de la Parole',
    subtitle: 'Verbes cibles : SE CONFIER & S’EXPRIMER (Impératif Pronominal)',
    floorColor: '#3d3740',
    wallColor: '#564e5b',
    wallStyle: 'stone',
    ambientLight: 0.44,
    spawn: { x: 80, y: 270 },
    exits: [
      { dir: 'W', to: 'foret', x: -8, y: 270, w: 36, h: 100, spawnX: CW - 85, spawnY: 270, label: '← La Clairière' },
      { dir: 'E', to: 'cour', x: CW - 28, y: 270, w: 36, h: 100, spawnX: 85, spawnY: 270, label: 'La Cour Intérieure →' },
    ],
    torches: [
      { x: 190, y: 155 }, { x: 430, y: 155 }, { x: 670, y: 155 },
      { x: 190, y: 385 }, { x: 430, y: 385 }, { x: 670, y: 385 },
    ],
    obstacles: [
      // Clay moat water top and bottom with stone bridge parapets
      { x: 0, y: 0, w: CW, h: 118, type: 'water' },
      { x: 0, y: CH - 118, w: CW, h: 118, type: 'water' },
      { x: 0, y: 118, w: CW, h: 24, type: 'stonewall' },
      { x: 0, y: CH - 142, w: CW, h: 24, type: 'stonewall' },

      // Staggered clay bridge pillars & spike traps (wide S-curve path)
      { x: 240, y: 142, w: 44, h: 115, type: 'stonewall' },
      { x: 450, y: 283, w: 44, h: 115, type: 'stonewall' },
      { x: 335, y: 318, w: 54, h: 48, type: 'trap', label: 'Piège du Silence' },
      { x: 565, y: 175, w: 54, h: 48, type: 'trap', label: 'Piège de l’Isolement' },
    ],
    altar: { x: 695, y: 270, label: 'Autel de la Confiance' },
    waypoints: [{ x: 80, y: 270 }, { x: 180, y: 325 }, { x: 350, y: 215 }, { x: 560, y: 320 }, { x: 695, y: 270 }],
    questions: [
      {
        badge: 'Épreuve 1/2 • Impératif Pronominal Affirmatif',
        context: 'Un camarade garde toute sa tristesse pour lui par peur de la stigmatisation.',
        prompt: '« _________ à un adulte de confiance et _________ librement sans avoir honte ! » (SE CONFIER et S’EXPRIMER avec « tu »)',
        options: [
          'Confie-toi ... exprime-toi',
          'Confies-toi ... exprimes-toi',
          'Te confie ... t’exprime',
          'Confie-te ... exprime-te',
        ],
        correct: 0,
        explanation: 'Parfait ! À l’impératif affirmatif d’un verbe pronominal (1er groupe en -ER), on enlève le -s final et le pronom « te » devient « -toi » après le trait d’union : « Confie-toi ! Exprime-toi ! ».',
      },
      {
        badge: 'Épreuve 2/2 • Impératif Pronominal Négatif',
        context: 'Pour traverser le Pont de la Parole, transforme l’ordre au NÉGATIF :',
        prompt: '« Ne _________ pas dans le silence : il est essentiel que tu _________ à un conseiller ! »',
        options: [
          't’isole pas ... te confies',
          'isole-toi pas ... confies-toi',
          't’isoles pas ... te confie',
          'te pas isole ... te confier',
        ],
        correct: 0,
        explanation: 'Excellent ! À l’impératif négatif, le pronom réfléchi revient DEVANT le verbe (« Ne t’isole pas »), et après « il est essentiel que », on utilise le subjonctif (« que tu te confies »).',
      },
    ],
  },

  cour: {
    id: 'cour',
    step: 3,
    name: '3. La Cour de l’Équilibre',
    subtitle: 'Verbes cibles : GÉRER & DEMANDER (Impératif & Subjonctif)',
    floorColor: '#3b3733',
    wallColor: '#5c5449',
    wallStyle: 'stone',
    ambientLight: 0.45,
    spawn: { x: 85, y: 270 },
    exits: [
      { dir: 'W', to: 'pont', x: -8, y: 270, w: 36, h: 100, spawnX: CW - 85, spawnY: 270, label: '← Le Pont' },
      { dir: 'N', to: 'armurerie', x: 430, y: -8, w: 110, h: 36, spawnX: 430, spawnY: CH - 85, label: '↑ L’Armurerie (Nord)' },
      { dir: 'E', to: 'grande_salle', x: CW - 28, y: 270, w: 36, h: 100, spawnX: 85, spawnY: 270, label: 'La Grande Salle (Est) →' },
    ],
    torches: [
      { x: 185, y: 80 }, { x: 675, y: 80 },
      { x: 185, y: 460 }, { x: 675, y: 460 },
      { x: 350, y: 210 }, { x: 510, y: 210 },
    ],
    obstacles: [
      // Perimeter walls with West, North, and East portal openings
      { x: 0, y: 0, w: 375, h: 34, type: 'stonewall' },
      { x: 485, y: 0, w: CW - 485, h: 34, type: 'stonewall' },
      { x: 0, y: CH - 34, w: CW, h: 34, type: 'stonewall' },
      { x: 0, y: 34, w: 34, h: 180, type: 'stonewall' },
      { x: 0, y: 326, w: 34, h: CH - 360, type: 'stonewall' },
      { x: CW - 34, y: 34, w: 34, h: 180, type: 'stonewall' },
      { x: CW - 34, y: 326, w: 34, h: CH - 360, type: 'stonewall' },

      // Courtyard clay maze walls & central fountain
      { x: 210, y: 120, w: 44, h: 110, type: 'stonewall' },
      { x: 210, y: 310, w: 44, h: 110, type: 'stonewall' },
      { x: 606, y: 120, w: 44, h: 110, type: 'stonewall' },
      { x: 606, y: 310, w: 44, h: 110, type: 'stonewall' },
      { x: 385, y: 345, w: 90, h: 78, type: 'fountain', label: 'Fontaine de Sérénité' },
      { x: 95, y: 80, w: 58, h: 42, type: 'chest', label: 'Coffre d’Entraide' },
    ],
    altar: { x: 430, y: 225, label: 'Autel de l’Entraide' },
    waypoints: [{ x: 85, y: 270 }, { x: 295, y: 270 }, { x: 430, y: 225 }],
    questions: [
      {
        badge: 'Épreuve 1/2 • L’Impératif Collectif (NOUS & VOUS)',
        context: 'Au club de bien-être de l’école, vous encouragez les élèves de 9e année :',
        prompt: '« _________ notre stress ensemble et n’hésitez pas : _________ de l’aide quand vous êtes dépassés ! » (GÉRER avec « nous » et DEMANDER avec « vous »)',
        options: [
          'Gérons ... demandez',
          'Gérez ... demandons',
          'Gère ... demande',
          'Gérerons ... demanderez',
        ],
        correct: 0,
        explanation: 'Superbe ! Avec « nous », l’impératif prend -ons (« Gérons notre stress ») pour inclure tout le groupe. Avec « vous », il prend -ez (« demandez de l’aide »).',
      },
      {
        badge: 'Épreuve 2/2 • Il faut que + Subjonctif (GÉRER & DEMANDER)',
        context: 'Pour débloquer les deux portails de la Cour, complète la règle d’obligation :',
        prompt: '« Face à l’épuisement, il faut que tu _________ tes priorités et que nous _________ du soutien. »',
        options: [
          'gères ... demandions',
          'gère ... demandons',
          'gères ... demandons',
          'gérer ... demander',
        ],
        correct: 0,
        explanation: 'Bravo ! Au subjonctif présent : « que tu gères » (radical gèr- + -es) et « que nous demandions » (radical demand- + -ions, comme à l’imparfait !).',
      },
    ],
  },

  armurerie: {
    id: 'armurerie',
    step: 4,
    name: '4. L’Armurerie de la Résilience',
    subtitle: 'Verbe cible : FAIRE (Impératif & Subjonctif Irrégulier)',
    floorColor: '#363238',
    wallColor: '#524b56',
    wallStyle: 'stone',
    ambientLight: 0.43,
    spawn: { x: 430, y: CH - 85 },
    exits: [
      { dir: 'S', to: 'cour', x: 430, y: CH - 28, w: 110, h: 36, spawnX: 430, spawnY: 85, label: '↓ Retour à la Cour (Sud)' },
      { dir: 'E', to: 'grande_salle', x: CW - 28, y: 270, w: 36, h: 100, spawnX: 85, spawnY: 160, label: 'Passage Secret → Grande Salle' },
    ],
    torches: [
      { x: 140, y: 80 }, { x: 430, y: 80 }, { x: 720, y: 80 },
      { x: 140, y: 440 }, { x: 720, y: 440 },
    ],
    obstacles: [
      // Perimeter walls with South and East openings
      { x: 0, y: 0, w: CW, h: 34, type: 'stonewall' },
      { x: 0, y: CH - 34, w: 375, h: 34, type: 'stonewall' },
      { x: 485, y: CH - 34, w: CW - 485, h: 34, type: 'stonewall' },
      { x: 0, y: 34, w: 34, h: CH - 68, type: 'stonewall' },
      { x: CW - 34, y: 34, w: 34, h: 180, type: 'stonewall' },
      { x: CW - 34, y: 326, w: 34, h: CH - 360, type: 'stonewall' },

      // Armory clay weapon racks & walls
      { x: 165, y: 155, w: 170, h: 42, type: 'stonewall' },
      { x: 525, y: 155, w: 170, h: 42, type: 'stonewall' },
      { x: 165, y: 325, w: 170, h: 42, type: 'stonewall' },
      { x: 525, y: 325, w: 120, h: 42, type: 'stonewall' },
      { x: 85, y: 85, w: 58, h: 42, type: 'chest', label: 'Armure de Résilience' },
      { x: 710, y: 85, w: 58, h: 42, type: 'chest', label: 'Bouclier Anti-Stress' },
      { x: 230, y: 235, w: 52, h: 48, type: 'trap', label: 'Piège du Surmenage' },
    ],
    altar: { x: 430, y: 135, label: 'Autel de l’Action' },
    waypoints: [{ x: 430, y: 455 }, { x: 430, y: 260 }, { x: 430, y: 135 }],
    questions: [
      {
        badge: 'Épreuve 1/2 • L’Impératif du verbe FAIRE',
        context: 'Le Maître d’Armes t’enseigne comment forger une bonne habitude quotidienne :',
        prompt: '« _________ du sport régulièrement, _________ des activités créatives en groupe et _________ attention à votre santé mentale ! » (FAIRE : tu, nous, vous)',
        options: [
          'Fais ... faisons ... faites',
          'Fait ... faisons ... faisez',
          'Fais ... faissons ... faites',
          'Faire ... faisons ... faites',
        ],
        correct: 0,
        explanation: 'Excellent ! À l’impératif, FAIRE donne : « Fais » (tu), « Faisons » (nous) et la forme irrégulière « Faites » (vous — attention, jamais *faisez !).',
      },
      {
        badge: 'Épreuve 2/2 • Le Subjonctif Irrégulier de FAIRE',
        context: 'Pour activer le passage vers la Grande Salle, conjugue FAIRE au subjonctif :',
        prompt: '« Pour réduire la pression scolaire, il est indispensable que tu _________ de l’exercice et que les élèves _________ des pauses régulières. »',
        options: [
          'fasses ... fassent',
          'fais ... font',
          'fasse ... fassent',
          'ferais ... feraient',
        ],
        correct: 0,
        explanation: 'Bravo ! Le verbe FAIRE a un radical irrégulier au subjonctif présent : « fass- » → que je fasse, que tu fasses, qu’il fasse, que nous fassions, que vous fassiez, qu’ils fassent.',
      },
    ],
  },

  grande_salle: {
    id: 'grande_salle',
    step: 5,
    name: '5. La Grande Salle de l’Écoute',
    subtitle: 'Verbes cibles : COMPRENDRE & DORMIR (Impératif & Subjonctif)',
    floorColor: '#3a3136',
    wallColor: '#5c4953',
    wallStyle: 'bookshelf',
    ambientLight: 0.45,
    spawn: { x: 85, y: 270 },
    exits: [
      { dir: 'W', to: 'cour', x: -8, y: 270, w: 36, h: 100, spawnX: CW - 85, spawnY: 270, label: '← La Cour' },
      { dir: 'N', to: 'donjon', x: 430, y: -8, w: 110, h: 36, spawnX: 430, spawnY: CH - 85, label: '↑ Le Donjon de la Sérénité' },
    ],
    torches: [
      { x: 195, y: 75 }, { x: 665, y: 75 },
      { x: 195, y: 465 }, { x: 665, y: 465 },
      { x: 430, y: 270 },
    ],
    obstacles: [
      // Perimeter bookshelf/stone walls with West and North openings
      { x: 0, y: 0, w: 375, h: 36, type: 'bookshelfwall' },
      { x: 485, y: 0, w: CW - 485, h: 36, type: 'bookshelfwall' },
      { x: 0, y: CH - 36, w: CW, h: 36, type: 'bookshelfwall' },
      { x: 0, y: 36, w: 34, h: 178, type: 'stonewall' },
      { x: 0, y: 326, w: 34, h: CH - 362, type: 'stonewall' },
      { x: CW - 34, y: 36, w: 34, h: CH - 72, type: 'stonewall' },

      // Library clay bookshelves forming clear aisles
      { x: 210, y: 135, w: 50, h: 125, type: 'bookshelfwall' },
      { x: 210, y: 340, w: 50, h: 115, type: 'bookshelfwall' },
      { x: 560, y: 135, w: 50, h: 125, type: 'bookshelfwall' },
      { x: 560, y: 340, w: 50, h: 115, type: 'bookshelfwall' },
      { x: 375, y: 365, w: 110, h: 44, type: 'table', label: 'Table des Sages' },
    ],
    altar: { x: 700, y: 270, label: 'Autel de l’Empathie' },
    waypoints: [{ x: 85, y: 270 }, { x: 410, y: 270 }, { x: 700, y: 270 }],
    questions: [
      {
        badge: 'Épreuve 1/2 • DORMIR (Impératif & Subjonctif)',
        context: 'Le manque de sommeil aggrave l’anxiété et la fatigue émotionnelle.',
        prompt: '« _________ au moins huit heures par nuit ! Il est essentiel que tu _________ suffisamment pour récupérer. » (verbe DORMIR avec « tu »)',
        options: [
          'Dors ... dormes',
          'Dort ... dors',
          'Dormes ... dors',
          'Dormir ... dormes',
        ],
        correct: 0,
        explanation: 'Exactement ! À l’impératif avec « tu », DORMIR donne « Dors ! ». Au subjonctif présent après « Il est essentiel que », on utilise le radical « dorm- » + « -es » → « que tu dormes ».',
      },
      {
        badge: 'Épreuve 2/2 • COMPRENDRE (Subjonctif Présent)',
        context: 'Pour lutter contre la stigmatisation de la santé mentale à l’école :',
        prompt: '« Il faut que tout le monde _________ que la santé mentale est aussi importante que la santé physique, et que les jeunes _________ leurs émotions. » (COMPRENDRE : il / ils)',
        options: [
          'comprenne ... comprennent',
          'comprend ... comprennent',
          'comprennes ... comprenez',
          'comprendre ... comprendront',
        ],
        correct: 0,
        explanation: 'Remarquable ! COMPRENDRE se conjugue comme PRENDRE au subjonctif : « qu’il comprenne » (un seul n) et « qu’ils comprennent » (double n avec ils/elles !).',
      },
    ],
  },

  donjon: {
    id: 'donjon',
    step: 6,
    name: '6. Le Donjon de la Sérénité',
    subtitle: 'Synthèse Finale : Les 8 Verbes & le Vocabulaire du Bien-Être',
    floorColor: '#332d42',
    wallColor: '#504568',
    wallStyle: 'stone',
    ambientLight: 0.50,
    spawn: { x: 430, y: CH - 85 },
    exits: [
      { dir: 'S', to: 'grande_salle', x: 430, y: CH - 28, w: 110, h: 36, spawnX: 430, spawnY: 85, label: '↓ La Grande Salle' },
    ],
    torches: [
      { x: 220, y: 120 }, { x: 640, y: 120 },
      { x: 220, y: 400 }, { x: 640, y: 400 },
      { x: 330, y: 230 }, { x: 530, y: 230 },
    ],
    obstacles: [
      // Perimeter walls with South portal opening
      { x: 0, y: 0, w: CW, h: 36, type: 'stonewall' },
      { x: 0, y: CH - 34, w: 375, h: 34, type: 'stonewall' },
      { x: 485, y: CH - 34, w: CW - 485, h: 34, type: 'stonewall' },
      { x: 0, y: 36, w: 36, h: CH - 70, type: 'stonewall' },
      { x: CW - 36, y: 36, w: 36, h: CH - 70, type: 'stonewall' },

      // Grand Sanctum pillars & chests
      { x: 210, y: 170, w: 48, h: 48, type: 'pillar', label: 'Pilier de la Paix' },
      { x: 602, y: 170, w: 48, h: 48, type: 'pillar', label: 'Pilier de l’Écoute' },
      { x: 210, y: 320, w: 48, h: 48, type: 'pillar', label: 'Pilier du Courage' },
      { x: 602, y: 320, w: 48, h: 48, type: 'pillar', label: 'Pilier de l’Espoir' },
      { x: 90, y: 85, w: 62, h: 44, type: 'chest', label: 'Trésor de Sagesse' },
      { x: 708, y: 85, w: 62, h: 44, type: 'chest', label: 'Trésor de Bienveillance' },
    ],
    altar: { x: 430, y: 185, label: 'Cristal Suprême du Bien-Être' },
    waypoints: [{ x: 430, y: 455 }, { x: 430, y: 185 }],
    questions: [
      {
        badge: 'Épreuve Finale 1/2 • Maîtrise de l’Impératif (Affirm. vs Nég.)',
        context: 'Devant le Cristal Suprême, proclame la devise des Gardiens du Bien-Être :',
        prompt: '« _________ tes émotions avec calme, _________ à tes proches, mais ne _________ pas la pression scolaire seul ! » (GÉRER, SE CONFIER, PRENDRE avec « tu »)',
        options: [
          'Gère ... confie-toi ... prends',
          'Gères ... confies-toi ... prend',
          'Gère ... te confie ... prends',
          'Gérez ... confiez-vous ... prenez',
        ],
        correct: 0,
        explanation: 'Magistral ! « Gère » (1er gr. sans -s), « confie-toi » (pronominal affirmatif avec -toi) et « ne prends pas » (3e gr. garde son -s).',
      },
      {
        badge: 'Épreuve Finale 2/2 • Couronnement du Subjonctif',
        context: 'Dernière incantation pour illuminer toute la Citadelle :',
        prompt: '« Pour bâtir une école bienveillante, il faut que chacun _________ librement, que nous _________ de bonnes habitudes et que vous _________ de l’aide sans crainte ! » (S’EXPRIMER, PRENDRE, DEMANDER)',
        options: [
          's’exprime ... prenions ... demandiez',
          's’exprime ... prenons ... demandez',
          's’exprimes ... prenions ... demandiez',
          's’exprimer ... prendre ... demander',
        ],
        correct: 0,
        explanation: 'Victoire totale ! « que chacun s’exprime », « que nous prenions », et « que vous demandiez ». Tu maîtrises l’impératif et les structures d’obligation de l’Unité 2 !',
      },
    ],
  },
};

// ══════════════════════════════════════════════════════════════════════════════
//  GEOMETRY & CLAYMATION COLOR HELPERS
// ══════════════════════════════════════════════════════════════════════════════
function circleRect(cx, cy, r, rx, ry, rw, rh) {
  const nearX = Math.max(rx, Math.min(cx, rx + rw));
  const nearY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nearX;
  const dy = cy - nearY;
  return dx * dx + dy * dy < r * r;
}

function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function shadeColor(hex, lum) {
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  lum = lum || 0;
  let rgb = '#';
  for (let i = 0; i < 3; i++) {
    let c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }
  return rgb;
}

function drawClayThumbprint(ctx, x, y, rx, ry, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const g = ctx.createRadialGradient(-rx * 0.2, -ry * 0.2, 1, 0, 0, Math.max(rx, ry));
  g.addColorStop(0, 'rgba(0,0,0,0.16)');
  g.addColorStop(0.65, 'rgba(0,0,0,0.05)');
  g.addColorStop(1, 'rgba(255,255,255,0.07)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawClayPebble(ctx, x, y, w, h, baseColor) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 3, w, h, 9);
  ctx.fill();

  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, shadeColor(baseColor, 0.22));
  grad.addColorStop(0.45, baseColor);
  grad.addColorStop(1, shadeColor(baseColor, -0.22));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 9);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(x + 1.5, y + 1.5, w - 3, h - 3, 7);
  ctx.stroke();
  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════════
//  PLAY-DOH / PIXAR CLAYMATION STATIC ROOM RENDERER (CACHED PER ROOM)
// ══════════════════════════════════════════════════════════════════════════════
function renderStaticClayRoom(room) {
  const offscreen = document.createElement('canvas');
  offscreen.width = CW;
  offscreen.height = CH;
  const ctx = offscreen.getContext('2d');

  // 1. Base clay grout bed
  ctx.fillStyle = shadeColor(room.floorColor, -0.28);
  ctx.fillRect(0, 0, CW, CH);

  // 2. Individual hand-pressed clay flagstones with AO near obstacles
  const tileW = 44;
  const tileH = 44;
  const cols = Math.ceil(CW / tileW);
  const rows = Math.ceil(CH / tileH);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tx = c * tileW + (r % 2 === 1 ? 10 : 0) - 5;
      const ty = r * tileH;
      const tw = tileW - 4;
      const th = tileH - 4;
      const seed = (r * 31 + c * 17) % 100;

      // Ambient occlusion proximity check to walls
      let nearWallDist = 999;
      for (const ob of room.obstacles) {
        const cx = tx + tw / 2;
        const cy = ty + th / 2;
        const nx = Math.max(ob.x, Math.min(cx, ob.x + ob.w));
        const ny = Math.max(ob.y, Math.min(cy, ob.y + ob.h));
        const d = Math.hypot(cx - nx, cy - ny);
        if (d < nearWallDist) nearWallDist = d;
      }

      const shadeShift = ((seed % 15) - 7) * 0.012;
      const aoDarken = nearWallDist < 38 ? -0.18 * (1 - nearWallDist / 38) : 0;
      const tileColor = shadeColor(room.floorColor, shadeShift + aoDarken);

      const tGrad = ctx.createLinearGradient(tx, ty, tx + tw, ty + th);
      tGrad.addColorStop(0, shadeColor(tileColor, 0.14));
      tGrad.addColorStop(0.5, tileColor);
      tGrad.addColorStop(1, shadeColor(tileColor, -0.15));

      ctx.fillStyle = tGrad;
      ctx.beginPath();
      ctx.roundRect(tx + 2, ty + 2, tw, th, 8);
      ctx.fill();

      // Soft top-left clay bevel highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.09)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(tx + 3, ty + 3, tw - 2, th - 2, 7);
      ctx.stroke();

      if (seed % 4 === 0) {
        drawClayThumbprint(ctx, tx + tw * 0.5, ty + th * 0.5, 8, 5, (seed % 6) * 0.5);
      }
    }
  }

  // 3. Sculpted clay cobblestone path along the room's waypoints
  if (room.waypoints && room.waypoints.length > 1) {
    ctx.save();
    for (let i = 0; i < room.waypoints.length - 1; i++) {
      const p1 = room.waypoints[i];
      const p2 = room.waypoints[i + 1];
      const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const steps = Math.max(2, Math.floor(segLen / 34));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = p1.x + (p2.x - p1.x) * t;
        const py = p1.y + (p2.y - p1.y) * t;
        const stoneCol = shadeColor(room.floorColor, 0.24);
        drawClayPebble(ctx, px - 15, py - 11, 30, 22, stoneCol);
      }
    }
    ctx.restore();
  }

  // 4. Render all obstacles with 1:1 collision fidelity
  room.obstacles.forEach((ob) => {
    drawClayObstacle(ctx, ob, room);
  });

  return offscreen;
}

function drawClayObstacle(ctx, ob, room) {
  ctx.save();
  const { x, y, w, h, type } = ob;

  // Ambient occlusion shadow under every solid obstacle
  if (type !== 'water') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.roundRect(x - 3, y + 5, w + 6, h + 4, 12);
    ctx.fill();
  }

  if (type === 'water') {
    // Glossy resin-clay moat water with ripples
    const wg = ctx.createLinearGradient(x, y, x, y + h);
    wg.addColorStop(0, '#133b5c');
    wg.addColorStop(0.5, '#1d5680');
    wg.addColorStop(1, '#0f2c45');
    ctx.fillStyle = wg;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = 'rgba(125, 211, 252, 0.25)';
    ctx.lineWidth = 3;
    for (let wx = 30; wx < w - 30; wx += 95) {
      for (let wy = y + 24; wy < y + h - 18; wy += 36) {
        ctx.beginPath();
        ctx.arc(x + wx, wy, 18, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
      }
    }
  } else if (type === 'stonewall' || type === 'hedgewall' || type === 'bookshelfwall') {
    const isHedge = type === 'hedgewall';
    const isBook = type === 'bookshelfwall';
    const baseCol = isHedge ? '#3b6e38' : isBook ? '#6b442a' : room.wallColor || '#5c5449';

    // Thick extruded 3D clay wall body
    const wallGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    wallGrad.addColorStop(0, shadeColor(baseCol, 0.24));
    wallGrad.addColorStop(0.5, baseCol);
    wallGrad.addColorStop(1, shadeColor(baseCol, -0.26));
    ctx.fillStyle = wallGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 11);
    ctx.fill();

    // Segmented clay bricks / foliage puffs / bookshelves along the wall
    const blockStep = 36;
    if (w >= h) {
      for (let bx = x + 6; bx < x + w - 12; bx += blockStep) {
        const bw = Math.min(blockStep - 4, x + w - bx - 4);
        drawClayPebble(ctx, bx, y + 4, bw, h - 8, shadeColor(baseCol, ((bx * 7) % 11 - 5) * 0.025));
        if (isBook && h >= 30) {
          // Colorful miniature clay book spines
          const bookColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7'];
          for (let k = 0; k < 3; k++) {
            ctx.fillStyle = bookColors[(bx + k) % bookColors.length];
            ctx.beginPath();
            ctx.roundRect(bx + 4 + k * 9, y + 8, 7, h - 16, 3);
            ctx.fill();
          }
        }
      }
    } else {
      for (let by = y + 6; by < y + h - 12; by += blockStep) {
        const bh = Math.min(blockStep - 4, y + h - by - 4);
        drawClayPebble(ctx, x + 4, by, w - 8, bh, shadeColor(baseCol, ((by * 7) % 11 - 5) * 0.025));
      }
    }

    // Specular clay rim highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 2, w - 4, h - 4, 9);
    ctx.stroke();
  } else if (type === 'pillar') {
    const pg = ctx.createRadialGradient(x + w * 0.35, y + h * 0.35, 3, x + w / 2, y + h / 2, w * 0.6);
    pg.addColorStop(0, '#94a3b8');
    pg.addColorStop(0.6, '#64748b');
    pg.addColorStop(1, '#334155');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 14);
    ctx.fill();

    // Inner carved clay cap
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.32, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'chest') {
    // Hand-sculpted clay treasure chest with gold clasp
    const cg = ctx.createLinearGradient(x, y, x, y + h);
    cg.addColorStop(0, '#b45309');
    cg.addColorStop(0.5, '#92400e');
    cg.addColorStop(1, '#451a03');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 9);
    ctx.fill();

    // Gold clay bands & lock
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x + 8, y + 2, 6, h - 4);
    ctx.fillRect(x + w - 14, y + 2, 6, h - 4);
    ctx.beginPath();
    ctx.roundRect(x + w / 2 - 7, y + h / 2 - 6, 14, 12, 4);
    ctx.fill();
  } else if (type === 'trap') {
    // Clay recessed plate with stubby Play-Doh cones
    ctx.fillStyle = '#3f3f46';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);

    const positions = [
      [0.28, 0.32], [0.72, 0.32],
      [0.50, 0.52],
      [0.28, 0.72], [0.72, 0.72],
    ];
    positions.forEach(([px, py]) => {
      const sx = x + w * px;
      const sy = y + h * py;
      const sg = ctx.createRadialGradient(sx - 2, sy - 2, 1, sx, sy, 8);
      sg.addColorStop(0, '#fca5a5');
      sg.addColorStop(0.6, '#ef4444');
      sg.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sx, sy, 6.5, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (type === 'fountain') {
    // Sculpted clay basin + turquoise water
    drawClayPebble(ctx, x, y, w, h, '#94a3b8');
    const fg = ctx.createRadialGradient(x + w * 0.4, y + h * 0.4, 4, x + w / 2, y + h / 2, w * 0.42);
    fg.addColorStop(0, '#67e8f9');
    fg.addColorStop(0.6, '#06b6d4');
    fg.addColorStop(1, '#0e7490');
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 10, w - 20, h - 20, 14);
    ctx.fill();
  } else if (type === 'rock' || type === 'log' || type === 'table') {
    const col = type === 'rock' ? '#64748b' : '#78350f';
    drawClayPebble(ctx, x, y, w, h, col);
  }

  // Optional subtle label on special props
  if (ob.label && (type === 'fountain' || type === 'chest')) {
    ctx.font = 'bold 9.5px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.fillText(ob.label, x + w / 2, y - 5);
  }
  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════════
//  REALISTIC ARTICULATED MEDIEVAL KNIGHT RENDERER (4-DIRECTIONAL + WALK CYCLE)
// ══════════════════════════════════════════════════════════════════════════════
function drawHeaterShield(ctx, sx, sy, scaleX = 1) {
  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(scaleX, 1);

  // Drop shadow behind shield
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.moveTo(-6, -6);
  ctx.lineTo(6, -6);
  ctx.quadraticCurveTo(7, 3, 0, 10);
  ctx.quadraticCurveTo(-7, 3, -6, -6);
  ctx.closePath();
  ctx.fill();

  // Steel outer rim
  const rimGrad = ctx.createLinearGradient(-6, -7, 6, 9);
  rimGrad.addColorStop(0, '#f1f5f9');
  rimGrad.addColorStop(0.5, '#94a3b8');
  rimGrad.addColorStop(1, '#334155');
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.moveTo(-6.5, -7);
  ctx.lineTo(6.5, -7);
  ctx.quadraticCurveTo(7.2, 2.5, 0, 9.5);
  ctx.quadraticCurveTo(-7.2, 2.5, -6.5, -7);
  ctx.closePath();
  ctx.fill();

  // Royal sapphire shield face
  const faceGrad = ctx.createLinearGradient(-5, -5, 5, 7);
  faceGrad.addColorStop(0, '#2563eb');
  faceGrad.addColorStop(0.5, '#1d4ed8');
  faceGrad.addColorStop(1, '#172554');
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.moveTo(-5, -5.5);
  ctx.lineTo(5, -5.5);
  ctx.quadraticCurveTo(5.5, 2, 0, 7.8);
  ctx.quadraticCurveTo(-5.5, 2, -5, -5.5);
  ctx.closePath();
  ctx.fill();

  // Golden heraldic cross emblem
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-1.1, -4.5, 2.2, 10);
  ctx.fillRect(-3.8, -1.8, 7.6, 2.1);

  // Specular highlight across shield
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(-4.5, -5);
  ctx.lineTo(2, -5);
  ctx.stroke();

  ctx.restore();
}

function drawLantern(ctx, lx, ly, swingAngle) {
  ctx.save();
  ctx.translate(lx, ly);
  ctx.rotate(swingAngle);

  // Outer warm lantern halo
  const halo = ctx.createRadialGradient(0, 3, 1, 0, 3, 18);
  halo.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
  halo.addColorStop(0.45, 'rgba(245, 158, 11, 0.35)');
  halo.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 3, 18, 0, Math.PI * 2);
  ctx.fill();

  // Wrought-iron handle ring
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(0, -2.5, 2.2, 0, Math.PI * 2);
  ctx.stroke();

  // Iron roof cap
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-4, 0.5);
  ctx.lineTo(4, 0.5);
  ctx.lineTo(2, -1.8);
  ctx.lineTo(-2, -1.8);
  ctx.closePath();
  ctx.fill();

  // Glowing glass chamber
  const core = ctx.createRadialGradient(0, 3.5, 0.5, 0, 3.5, 4.5);
  core.addColorStop(0, '#ffffff');
  core.addColorStop(0.5, '#fde047');
  core.addColorStop(1, '#ea580c');
  ctx.fillStyle = core;
  ctx.fillRect(-2.6, 0.5, 5.2, 5.8);

  // Iron cage bars & base
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 0.9;
  ctx.strokeRect(-2.7, 0.5, 5.4, 5.8);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-3.4, 6.2, 6.8, 1.8);

  ctx.restore();
}

function drawClayKnight(ctx, pl, tick) {
  const { x, y, dir, frame } = pl;
  const isMoving = pl.moving;
  const stride = isMoving ? Math.sin(frame * 0.32) : 0;
  const bob = isMoving ? Math.abs(Math.sin(frame * 0.32)) * -2.2 : Math.sin(tick * 0.06) * 0.8;
  const leftLegY = stride * 4.2;
  const rightLegY = -stride * 4.2;
  const armSwing = stride * 2.5;
  const isSide = dir === 'E' || dir === 'W';
  const facingSign = dir === 'W' ? -1 : 1;

  ctx.save();
  ctx.translate(x, y);

  // 1. Realistic dynamic torchlight pool on the dungeon floor
  const floorGlow = ctx.createRadialGradient(0, 2, 4, 0, 2, 68);
  floorGlow.addColorStop(0, 'rgba(251, 191, 36, 0.34)');
  floorGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.14)');
  floorGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = floorGlow;
  ctx.beginPath();
  ctx.arc(0, 2, 68, 0, Math.PI * 2);
  ctx.fill();

  // 2. Ground contact shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(0, 15.5, 13.5, 5.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Helper to draw cape (behind knight when S/E/W, in front of torso when N)
  const renderCloak = (isBackView) => {
    const sway = isMoving ? Math.sin(frame * 0.25) * 2.5 : Math.sin(tick * 0.05) * 0.9;
    const capeX = isSide ? -facingSign * 4 : 0;
    const capeGrad = ctx.createLinearGradient(-11, -10 + bob, 11, 14 + bob);
    capeGrad.addColorStop(0, '#b91c1c');
    capeGrad.addColorStop(0.55, '#991b1b');
    capeGrad.addColorStop(1, '#450a0a');
    ctx.fillStyle = capeGrad;

    ctx.beginPath();
    ctx.moveTo(-8 + capeX * 0.4, -8 + bob);
    ctx.lineTo(8 + capeX * 0.4, -8 + bob);
    ctx.quadraticCurveTo(12 + capeX + sway, 4 + bob, 9.5 + capeX + sway, 12.5 + bob);
    ctx.quadraticCurveTo(0 + capeX + sway, 14.5 + bob, -9.5 + capeX + sway, 12.5 + bob);
    ctx.quadraticCurveTo(-12 + capeX + sway, 4 + bob, -8 + capeX * 0.4, -8 + bob);
    ctx.closePath();
    ctx.fill();

    // Subtle fabric fold shadows on the cloak
    if (isBackView) {
      ctx.strokeStyle = 'rgba(69, 10, 10, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-3, -6 + bob);
      ctx.lineTo(-4.5 + sway * 0.6, 12 + bob);
      ctx.moveTo(3, -6 + bob);
      ctx.lineTo(4.5 + sway * 0.6, 12 + bob);
      ctx.stroke();

      // Gold cloak trim along bottom edge
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-9 + sway, 12 + bob);
      ctx.quadraticCurveTo(0 + sway, 14 + bob, 9 + sway, 12 + bob);
      ctx.stroke();
    }
  };

  if (dir !== 'N') {
    renderCloak(false);
  }

  // 3. Articulated Steel Greaves & Sabatons (Legs & Boots)
  const drawBootAndGreave = (lx, lyOffset) => {
    ctx.save();
    ctx.translate(lx, 9 + lyOffset);
    // Dark mail chausses (upper leg)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-2.8, -5, 5.6, 5);

    // Polished steel greave (shin guard)
    const greaveGrad = ctx.createLinearGradient(-3, -2, 3, 4);
    greaveGrad.addColorStop(0, '#e2e8f0');
    greaveGrad.addColorStop(0.5, '#64748b');
    greaveGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = greaveGrad;
    ctx.beginPath();
    ctx.roundRect(-3, -2, 6, 5.5, 2);
    ctx.fill();

    // Riveted steel sabaton (armored foot)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(isSide ? facingSign * 1.5 : 0, 4.2, isSide ? 4.8 : 3.6, 2.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  };

  if (isSide) {
    // Draw far leg first, then near leg
    drawBootAndGreave(-facingSign * 1.5, rightLegY);
    drawBootAndGreave(facingSign * 1.5, leftLegY);
  } else {
    drawBootAndGreave(-4.2, leftLegY);
    drawBootAndGreave(4.2, rightLegY);
  }

  // 4. Broadsword Scabbard at Left Hip
  ctx.save();
  const scabbardX = dir === 'W' ? 5 : -8;
  ctx.translate(scabbardX, 2 + bob);
  ctx.rotate(dir === 'W' ? -0.45 : 0.45);
  // Leather scabbard with steel chape
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-1.4, 0, 2.8, 11);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-1.4, 9, 2.8, 2.2);
  // Crossguard & gold pommel
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-3.8, -1.2, 7.6, 1.6);
  ctx.beginPath();
  ctx.arc(0, -3.5, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. Torso Steel Cuirass & Heraldic Surcoat
  const torsoW = isSide ? 15 : 18;
  const cuirassGrad = ctx.createRadialGradient(-3 * facingSign, -4 + bob, 1.5, 0, 0 + bob, 13);
  cuirassGrad.addColorStop(0, '#f8fafc');
  cuirassGrad.addColorStop(0.4, '#94a3b8');
  cuirassGrad.addColorStop(0.8, '#334155');
  cuirassGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = cuirassGrad;
  ctx.beginPath();
  ctx.roundRect(-torsoW / 2, -8 + bob, torsoW, 15.5, 5);
  ctx.fill();

  // Royal Blue & Gold Heraldic Surcoat / Tabard over lower cuirass
  const surcoatGrad = ctx.createLinearGradient(0, -2 + bob, 0, 9 + bob);
  surcoatGrad.addColorStop(0, '#1d4ed8');
  surcoatGrad.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = surcoatGrad;
  ctx.beginPath();
  ctx.roundRect(-torsoW / 2 + 1.5, -1 + bob, torsoW - 3, 9.5, 3);
  ctx.fill();

  // Gold vertical stripe on surcoat + leather knight belt with brass buckle
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect((isSide ? facingSign * 2 : 0) - 1, -1 + bob, 2, 9.5);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-torsoW / 2 + 1, 2.2 + bob, torsoW - 2, 2.4);
  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 0.6;
  ctx.fillRect((isSide ? facingSign * 2 : 0) - 1.8, 1.8 + bob, 3.6, 3.2);

  // 6. Articulated Steel Pauldrons (Shoulder Guards)
  const drawPauldron = (px, py) => {
    const pGrad = ctx.createRadialGradient(px - 1.5, py - 2, 1, px, py, 6.5);
    pGrad.addColorStop(0, '#f8fafc');
    pGrad.addColorStop(0.55, '#94a3b8');
    pGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.ellipse(px, py, 5.2, 4.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 0.9;
    ctx.stroke();
  };

  if (isSide) {
    drawPauldron(0, -4.5 + bob);
  } else {
    drawPauldron(-9.2, -4.5 + bob);
    drawPauldron(9.2, -4.5 + bob);
  }

  // If facing North, cloak drapes over the back of the shoulders
  if (dir === 'N') {
    renderCloak(true);
    drawPauldron(-9.2, -4.5 + bob);
    drawPauldron(9.2, -4.5 + bob);
  }

  // 7. Forged Medieval Bascinet Helmet & Visor
  const headY = -14 + bob;
  const helmGrad = ctx.createRadialGradient(-3.5, headY - 4, 1.5, 0, headY, 11.5);
  helmGrad.addColorStop(0, '#ffffff');
  helmGrad.addColorStop(0.35, '#cbd5e1');
  helmGrad.addColorStop(0.75, '#64748b');
  helmGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = helmGrad;
  ctx.beginPath();
  ctx.arc(0, headY, 9.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Steel gorget (neck plate) under helmet
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(0, headY + 8.5, 7.2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Directional Visor Faceplate & Breathing Slits
  if (dir === 'S') {
    // Front articulated visor with vertical ridge & eye slits
    const vGrad = ctx.createLinearGradient(-7, headY, 7, headY + 6);
    vGrad.addColorStop(0, '#94a3b8');
    vGrad.addColorStop(0.5, '#e2e8f0');
    vGrad.addColorStop(1, '#334155');
    ctx.fillStyle = vGrad;
    ctx.beginPath();
    ctx.moveTo(-7.5, headY - 1);
    ctx.lineTo(7.5, headY - 1);
    ctx.lineTo(6.2, headY + 6);
    ctx.lineTo(0, headY + 8);
    ctx.lineTo(-6.2, headY + 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // Dark visor eye slits with warm determined eye glint
    ctx.fillStyle = '#090d16';
    ctx.fillRect(-5.8, headY + 0.2, 4.6, 1.9);
    ctx.fillRect(1.2, headY + 0.2, 4.6, 1.9);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-3.8, headY + 0.6, 1.5, 1.1);
    ctx.fillRect(2.3, headY + 0.6, 1.5, 1.1);

    // Center helmet ridge & brass rivets
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(0, headY - 9);
    ctx.lineTo(0, headY + 7.5);
    ctx.stroke();
  } else if (isSide) {
    // Profile houndskull/bascinet visor projecting forward
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(facingSign * 2, headY - 2.5);
    ctx.lineTo(facingSign * 10.5, headY + 1.5);
    ctx.lineTo(facingSign * 5.5, headY + 7);
    ctx.lineTo(facingSign * 1, headY + 6.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // Profile eye slit + brass hinge rivet
    ctx.fillStyle = '#090d16';
    ctx.fillRect(facingSign * 3.5, headY - 0.5, facingSign * 4.2, 1.8);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(facingSign * 1.5, headY + 2, 1.3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // North view: back of steel helmet with lames & gold trim band
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(0, headY + 1, 8.8, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  // 8. Layered Flowing Horsehair / Feather Knight Plume
  const plumeSway = Math.sin(tick * 0.12 + (isMoving ? frame * 0.28 : 0)) * 2.4;
  const plumeDir = isSide ? -facingSign : 1;
  ctx.save();
  ctx.translate(0, headY - 9);
  // Brass plume holder socket
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-1.8, -1.5, 3.6, 3);

  // Three layered crimson feather plumes for realistic volume
  const drawPlumeLayer = (ox, oy, rx, ry, rot, col1, col2) => {
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(rot);
    const pg = ctx.createLinearGradient(-rx, 0, rx, 0);
    pg.addColorStop(0, col1);
    pg.addColorStop(1, col2);
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawPlumeLayer(plumeDir * (3.5 + plumeSway * 0.4), -3.5, 6.5, 3.0, plumeDir * 0.35, '#e11d48', '#881337');
  drawPlumeLayer(plumeDir * (1.5 + plumeSway * 0.25), -5.2, 5.8, 2.7, plumeDir * 0.15, '#f43f5e', '#9f1239');
  drawPlumeLayer(plumeDir * (-0.5 + plumeSway * 0.15), -6.2, 4.2, 2.1, -plumeDir * 0.1, '#fda4af', '#e11d48');
  ctx.restore();

  // 9. Heater Shield & Wrought-Iron Lantern (positioned accurately per facing direction)
  const swingRad = (armSwing * Math.PI) / 45;
  if (dir === 'S') {
    drawHeaterShield(ctx, -10.5, 0.5 + bob - armSwing * 0.3, 1);
    drawLantern(ctx, 12.5, -1.5 + bob + armSwing * 0.3, swingRad);
  } else if (dir === 'N') {
    drawHeaterShield(ctx, 10.5, 0 + bob + armSwing * 0.3, 0.85);
    drawLantern(ctx, -12.5, -2 + bob - armSwing * 0.3, -swingRad);
  } else if (dir === 'E') {
    drawLantern(ctx, 11.5, -1.5 + bob + armSwing * 0.4, swingRad);
    drawHeaterShield(ctx, -2.5, 1 + bob - armSwing * 0.3, 0.82);
  } else if (dir === 'W') {
    drawLantern(ctx, -11.5, -1.5 + bob + armSwing * 0.4, -swingRad);
    drawHeaterShield(ctx, 2.5, 1 + bob - armSwing * 0.3, 0.82);
  }

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT : CITADELLE DU BIEN-ÊTRE
// ══════════════════════════════════════════════════════════════════════════════
export default function CitadelleBienEtre({ onBack }) {
  const canvasRef = useRef(null);
  const roomCacheRef = useRef({});
  const keysRef = useRef({});
  const clickTargetRef = useRef(null);
  const tickRef = useRef(0);

  const [currentRoomId, setCurrentRoomId] = useState('foret');
  const [solvedRooms, setSolvedRooms] = useState({});
  const [activeModal, setActiveModal] = useState(null); // { roomId, qIdx, selected, isCorrect, showHint }
  const [bannerMsg, setBannerMsg] = useState('Approchez de l’Autel doré (ou cliquez dessus) pour relever le défi de la salle !');
  const [victory, setVictory] = useState(false);
  const [nearAltar, setNearAltar] = useState(false);

  const playerRef = useRef({
    x: ROOMS.foret.spawn.x,
    y: ROOMS.foret.spawn.y,
    dir: 'E',
    frame: 0,
    moving: false,
  });

  // Pre-build cached clay room canvases lazily
  const getRoomCanvas = useCallback((rid) => {
    if (!roomCacheRef.current[rid]) {
      roomCacheRef.current[rid] = renderStaticClayRoom(ROOMS[rid]);
    }
    return roomCacheRef.current[rid];
  }, []);

  // Open the Guardian Question Modal for the current room
  const openRoomChallenge = useCallback((rid) => {
    setActiveModal({
      roomId: rid,
      qIdx: 0,
      selected: null,
      isCorrect: null,
      showHint: false,
    });
  }, []);

  // Switch to another room
  const transitionToRoom = useCallback((targetRoomId, spawnX, spawnY) => {
    const nextRoom = ROOMS[targetRoomId];
    if (!nextRoom) return;
    playerRef.current.x = spawnX ?? nextRoom.spawn.x;
    playerRef.current.y = spawnY ?? nextRoom.spawn.y;
    playerRef.current.moving = false;
    clickTargetRef.current = null;
    setCurrentRoomId(targetRoomId);
    setBannerMsg(`Vous entrez dans : ${nextRoom.name}`);
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'z', 'q', ' ', 'enter', 'e'].includes(k)) {
        if (!activeModal) e.preventDefault();
      }
      keysRef.current[k] = true;

      if (!activeModal && (k === ' ' || k === 'enter' || k === 'e')) {
        const room = ROOMS[currentRoomId];
        const pl = playerRef.current;
        if (room?.altar && dist(pl.x, pl.y, room.altar.x, room.altar.y) <= INTERACT_R + 18) {
          openRoomChallenge(currentRoomId);
        }
      }
    };
    const onKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [activeModal, currentRoomId, openRoomChallenge]);

  // Handle canvas click / tap (Click-to-Move + Direct Altar Click)
  const handleCanvasClick = (e) => {
    if (activeModal || victory) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CW / rect.width;
    const scaleY = CH / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    const room = ROOMS[currentRoomId];
    const pl = playerRef.current;

    // If user clicked directly on the Guardian Altar and is already close, open immediately;
    // otherwise walk straight to the altar and auto-open when arriving!
    if (room?.altar && dist(cx, cy, room.altar.x, room.altar.y) <= 46) {
      if (dist(pl.x, pl.y, room.altar.x, room.altar.y) <= INTERACT_R + 15) {
        openRoomChallenge(currentRoomId);
        return;
      }
      clickTargetRef.current = { x: room.altar.x, y: room.altar.y, openAltarOnArrival: true };
      return;
    }

    clickTargetRef.current = { x: cx, y: cy, openAltarOnArrival: false };
  };

  // Main 60fps Game Loop
  useEffect(() => {
    let animId;

    const canMoveTo = (nx, ny, room) => {
      if (nx < PR + 4 || nx > CW - PR - 4 || ny < PR + 4 || ny > CH - PR - 4) return false;
      for (const ob of room.obstacles) {
        if (circleRect(nx, ny, PR, ob.x, ob.y, ob.w, ob.h)) {
          return false;
        }
      }
      return true;
    };

    const stepLoop = () => {
      tickRef.current += 1;
      const tick = tickRef.current;
      const room = ROOMS[currentRoomId];
      const pl = playerRef.current;

      // ── 1. UPDATE PLAYER MOVEMENT ──
      if (!activeModal && !victory && room) {
        const k = keysRef.current;
        let dx = 0;
        let dy = 0;

        if (k['arrowleft'] || k['a'] || k['q']) dx -= 1;
        if (k['arrowright'] || k['d']) dx += 1;
        if (k['arrowup'] || k['w'] || k['z']) dy -= 1;
        if (k['arrowdown'] || k['s']) dy += 1;

        if (dx !== 0 || dy !== 0) {
          // Manual keyboard overrides click-to-move
          clickTargetRef.current = null;
          const len = Math.hypot(dx, dy);
          dx = (dx / len) * SPEED;
          dy = (dy / len) * SPEED;
        } else if (clickTargetRef.current) {
          const target = clickTargetRef.current;
          const distToTarget = dist(pl.x, pl.y, target.x, target.y);
          if (target.openAltarOnArrival && room.altar && dist(pl.x, pl.y, room.altar.x, room.altar.y) <= INTERACT_R) {
            clickTargetRef.current = null;
            openRoomChallenge(currentRoomId);
          } else if (distToTarget > 6) {
            dx = ((target.x - pl.x) / distToTarget) * SPEED;
            dy = ((target.y - pl.y) / distToTarget) * SPEED;
          } else {
            clickTargetRef.current = null;
          }
        }

        if (dx !== 0 || dy !== 0) {
          pl.moving = true;
          pl.frame += 1;
          if (Math.abs(dx) >= Math.abs(dy)) {
            pl.dir = dx > 0 ? 'E' : 'W';
          } else {
            pl.dir = dy > 0 ? 'S' : 'N';
          }

          // Forgiving independent axis collision + corner slide
          if (canMoveTo(pl.x + dx, pl.y, room)) {
            pl.x += dx;
          }
          if (canMoveTo(pl.x, pl.y + dy, room)) {
            pl.y += dy;
          }
        } else {
          pl.moving = false;
        }

        // Check altar proximity
        const isCloseToAltar = room.altar && dist(pl.x, pl.y, room.altar.x, room.altar.y) <= INTERACT_R;
        setNearAltar((prev) => (prev !== isCloseToAltar ? isCloseToAltar : prev));

        // Check exit portals
        for (const ex of room.exits) {
          const exCx = ex.x + ex.w / 2;
          const exCy = ex.y + ex.h / 2;
          if (dist(pl.x, pl.y, exCx, exCy) <= EXIT_R) {
            const isBackwardExit = ex.dir === 'W' || (ex.dir === 'S' && currentRoomId !== 'cour');
            if (solvedRooms[currentRoomId] || isBackwardExit) {
              transitionToRoom(ex.to, ex.spawnX, ex.spawnY);
              break;
            } else {
              setBannerMsg('🔒 Portail verrouillé ! Résolvez d’abord l’énigme de l’Autel doré de cette salle.');
            }
          }
        }
      }

      // ── 2. RENDER PLAY-DOH / PIXAR CLAYMATION SCENE ──
      const canvas = canvasRef.current;
      if (canvas && room) {
        const ctx = canvas.getContext('2d');

        // 2a. Draw cached clay floor + sculpted clay walls + clay props
        const staticRoomCanvas = getRoomCanvas(currentRoomId);
        ctx.drawImage(staticRoomCanvas, 0, 0);

        // 2b. Draw Exit Portals (Unlocked = glowing emerald/gold, Locked = amber rune barrier)
        const roomSolved = !!solvedRooms[currentRoomId];
        room.exits.forEach((ex) => {
          const isBackward = ex.dir === 'W' || (ex.dir === 'S' && currentRoomId !== 'cour');
          const unlocked = roomSolved || isBackward;
          const cx = Math.max(24, Math.min(CW - 24, ex.x + ex.w / 2));
          const cy = Math.max(24, Math.min(CH - 24, ex.y + ex.h / 2));

          ctx.save();
          const pGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 38);
          if (unlocked) {
            pGrad.addColorStop(0, 'rgba(52, 211, 153, 0.85)');
            pGrad.addColorStop(0.55, 'rgba(16, 185, 129, 0.35)');
            pGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          } else {
            pGrad.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
            pGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.22)');
            pGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
          }
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 38, 0, Math.PI * 2);
          ctx.fill();

          // Portal label pill
          const labelX = Math.max(95, Math.min(CW - 95, cx));
          const labelY = cy < 65 ? cy + 36 : cy > CH - 65 ? cy - 28 : cy - 34;
          ctx.font = 'bold 11px "Inter", system-ui, sans-serif';
          const text = unlocked ? `✨ ${ex.label}` : `🔒 ${ex.label}`;
          const tw = ctx.measureText(text).width + 16;
          ctx.fillStyle = unlocked ? 'rgba(6, 78, 59, 0.92)' : 'rgba(69, 26, 3, 0.92)';
          ctx.strokeStyle = unlocked ? '#34d399' : '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(labelX - tw / 2, labelY - 11, tw, 22, 11);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, labelX, labelY);
          ctx.restore();
        });

        // 2c. Draw Flickering Clay Wall Torches
        room.torches.forEach((t, idx) => {
          const flicker = Math.sin(tick * 0.16 + idx * 1.7) * 3;
          ctx.save();
          const tg = ctx.createRadialGradient(t.x, t.y, 2, t.x, t.y, 44 + flicker);
          tg.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
          tg.addColorStop(0.45, 'rgba(245, 158, 11, 0.24)');
          tg.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = tg;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 44 + flicker, 0, Math.PI * 2);
          ctx.fill();

          // Clay sconce + flame droplet
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(t.x, t.y + 3, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(t.x, t.y - 1, 4.5 + flicker * 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // 2d. Draw Guardian Altar / Sanctuaire
        if (room.altar) {
          const ax = room.altar.x;
          const ay = room.altar.y;
          const pulse = Math.sin(tick * 0.08) * 5;
          ctx.save();

          // Outer interaction ring
          ctx.strokeStyle = roomSolved ? 'rgba(52, 211, 153, 0.55)' : 'rgba(251, 191, 36, 0.65)';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 5]);
          ctx.beginPath();
          ctx.arc(ax, ay, 36 + pulse * 0.4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Sculpted clay pedestal
          drawClayPebble(ctx, ax - 24, ay - 20, 48, 40, '#64748b');
          drawClayPebble(ctx, ax - 18, ay - 14, 36, 28, '#94a3b8');

          // Floating clay rune gem
          const gemY = ay - 6 + Math.sin(tick * 0.09) * 4;
          const gemGrad = ctx.createRadialGradient(ax - 3, gemY - 3, 2, ax, gemY, 15);
          if (roomSolved) {
            gemGrad.addColorStop(0, '#ecfdf5');
            gemGrad.addColorStop(0.5, '#10b981');
            gemGrad.addColorStop(1, '#065f46');
          } else {
            gemGrad.addColorStop(0, '#fef9c3');
            gemGrad.addColorStop(0.5, '#f59e0b');
            gemGrad.addColorStop(1, '#92400e');
          }
          ctx.fillStyle = gemGrad;
          ctx.beginPath();
          ctx.arc(ax, gemY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Altar floating callout badge
          const callout = roomSolved ? `✅ ${room.altar.label} (Résolu)` : `⚡ ${room.altar.label} (Cliquez / Espace)`;
          ctx.font = 'bold 11.5px "Inter", system-ui, sans-serif';
          const cw = ctx.measureText(callout).width + 18;
          ctx.fillStyle = roomSolved ? 'rgba(6, 78, 59, 0.94)' : 'rgba(120, 53, 15, 0.95)';
          ctx.strokeStyle = roomSolved ? '#34d399' : '#fbbf24';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.roundRect(ax - cw / 2, ay - 48, cw, 24, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(callout, ax, ay - 36);
          ctx.restore();
        }

        // 2e. Draw Click-to-Move destination ring if active
        if (clickTargetRef.current) {
          const ct = clickTargetRef.current;
          ctx.save();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(ct.x, ct.y, 10 + Math.sin(tick * 0.2) * 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // 2f. Draw Pixar/Play-Doh Clay Knight
        drawClayKnight(ctx, pl, tick);
      }

      animId = requestAnimationFrame(stepLoop);
    };

    animId = requestAnimationFrame(stepLoop);
    return () => cancelAnimationFrame(animId);
  }, [currentRoomId, activeModal, victory, solvedRooms, getRoomCanvas, openRoomChallenge, transitionToRoom]);

  // Handle Option Selection in Question Modal
  const handleSelectOption = (idx) => {
    if (!activeModal || activeModal.isCorrect === true) return;
    const room = ROOMS[activeModal.roomId];
    const currentQ = room.questions[activeModal.qIdx];
    const correct = idx === currentQ.correct;

    setActiveModal((prev) => ({
      ...prev,
      selected: idx,
      isCorrect: correct,
    }));
  };

  // Advance to next question in room or unlock the room
  const handleNextQuestionOrFinish = () => {
    if (!activeModal) return;
    const room = ROOMS[activeModal.roomId];
    if (activeModal.qIdx + 1 < room.questions.length) {
      setActiveModal({
        roomId: activeModal.roomId,
        qIdx: activeModal.qIdx + 1,
        selected: null,
        isCorrect: null,
        showHint: false,
      });
    } else {
      const updated = { ...solvedRooms, [activeModal.roomId]: true };
      setSolvedRooms(updated);
      setActiveModal(null);
      setBannerMsg(`🎉 Épreuve réussie dans « ${room.name} » ! Les portails de sortie sont maintenant ouverts.`);

      if (ROOM_ORDER.every((rid) => updated[rid])) {
        setVictory(true);
      }
    }
  };

  // On-screen D-pad nudge helper for touch/mouse controls
  const nudgePlayer = (dx, dy, dir) => {
    if (activeModal || victory) return;
    const room = ROOMS[currentRoomId];
    const pl = playerRef.current;
    pl.dir = dir;
    pl.frame += 2;
    const step = 28;
    const nx = pl.x + dx * step;
    const ny = pl.y + dy * step;
    let blocked = nx < PR + 4 || nx > CW - PR - 4 || ny < PR + 4 || ny > CH - PR - 4;
    if (!blocked) {
      for (const ob of room.obstacles) {
        if (circleRect(nx, ny, PR, ob.x, ob.y, ob.w, ob.h)) {
          blocked = true;
          break;
        }
      }
    }
    if (!blocked) {
      pl.x = nx;
      pl.y = ny;
    }
  };

  const resetGame = () => {
    setSolvedRooms({});
    setVictory(false);
    setActiveModal(null);
    transitionToRoom('foret', ROOMS.foret.spawn.x, ROOMS.foret.spawn.y);
    setBannerMsg('Nouvelle aventure commencée ! Approchez de l’Autel du Souffle.');
  };

  const currentRoom = ROOMS[currentRoomId];
  const solvedCount = Object.keys(solvedRooms).length;

  return (
    <div style={{
      background: 'linear-gradient(145deg, #1e1b2e 0%, #0f172a 100%)',
      borderRadius: '1.25rem',
      padding: '1.25rem',
      color: '#f8fafc',
      boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
      border: '2px solid rgba(251, 191, 36, 0.35)',
      maxWidth: '940px',
      margin: '0 auto',
    }}>
      {/* ── TOP HEADER & PROGRESS STEPPER ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.9rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🏰</span>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#fde047' }}>
              La Citadelle du Bien-Être — Exploration Claymation
            </h2>
          </div>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.86rem', color: '#cbd5e1' }}>
            {currentRoom.name} • <span style={{ color: '#fbbf24', fontWeight: 700 }}>{currentRoom.subtitle}</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.18)',
            border: '1.5px solid #34d399',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#ecfdf5',
          }}>
            ✨ Salles libérées : {solvedCount} / {ROOM_ORDER.length}
          </div>
          <button
            onClick={resetGame}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(255,255,255,0.1)',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.6rem',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
            }}
          >
            <RotateCcw size={15} /> Recommencer
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE 6-ROOM MAP BAR (Click any unlocked room to teleport if stuck) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gap: '0.4rem',
        marginBottom: '0.85rem',
      }}>
        {ROOM_ORDER.map((rid, idx) => {
          const r = ROOMS[rid];
          const isCurrent = rid === currentRoomId;
          const isSolved = !!solvedRooms[rid];
          const prevSolved = idx === 0 || !!solvedRooms[ROOM_ORDER[idx - 1]];
          const canVisit = isCurrent || isSolved || prevSolved;

          return (
            <button
              key={rid}
              onClick={() => canVisit && transitionToRoom(rid)}
              disabled={!canVisit}
              title={canVisit ? `Aller à : ${r.name}` : 'Résolvez la salle précédente pour débloquer'}
              style={{
                padding: '0.45rem 0.4rem',
                borderRadius: '0.6rem',
                border: isCurrent
                  ? '2px solid #fbbf24'
                  : isSolved
                  ? '1.5px solid #34d399'
                  : '1px solid rgba(255,255,255,0.15)',
                background: isCurrent
                  ? 'rgba(251, 191, 36, 0.22)'
                  : isSolved
                  ? 'rgba(16, 185, 129, 0.18)'
                  : canVisit
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(15, 23, 42, 0.5)',
                color: canVisit ? '#f8fafc' : '#64748b',
                cursor: canVisit ? 'pointer' : 'not-allowed',
                fontSize: '0.74rem',
                fontWeight: 800,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isSolved ? '✅ ' : isCurrent ? '🛡️ ' : canVisit ? '🔓 ' : '🔒 '}
              Salle {idx + 1}
            </button>
          );
        })}
      </div>

      {/* ── STATUS BANNER + QUICK CHALLENGE BUTTON ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        borderRadius: '0.75rem',
        padding: '0.55rem 0.9rem',
        marginBottom: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#fef08a', fontWeight: 600 }}>
          <Compass size={18} />
          <span>{bannerMsg}</span>
        </div>

        <button
          onClick={() => openRoomChallenge(currentRoomId)}
          style={{
            background: solvedRooms[currentRoomId]
              ? 'linear-gradient(135deg, #059669, #047857)'
              : 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '0.42rem 1rem',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
          }}
        >
          {solvedRooms[currentRoomId]
            ? '✅ Revoir l’énigme de la salle'
            : nearAltar
            ? '⚡ Ouvrir l’Autel (Espace / Clic)'
            : '⚡ Répondre à l’énigme de cette salle'}
        </button>
      </div>

      {/* ── PLAY-DOH / PIXAR CLAYMATION 2D CANVAS ── */}
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          onClick={handleCanvasClick}
          style={{
            width: '100%',
            maxWidth: `${CW}px`,
            height: 'auto',
            aspectRatio: `${CW} / ${CH}`,
            borderRadius: '1rem',
            border: '3px solid #78350f',
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            cursor: 'pointer',
            display: 'block',
          }}
        />

        {/* ── QUESTION MODAL OVERLAY ── */}
        {activeModal && (() => {
          const modalRoom = ROOMS[activeModal.roomId];
          const qObj = modalRoom.questions[activeModal.qIdx];
          return (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(4px)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              zIndex: 20,
            }}>
              <div style={{
                background: '#ffffff',
                color: '#0f172a',
                borderRadius: '1.2rem',
                padding: '1.5rem',
                maxWidth: '620px',
                width: '100%',
                border: '3px solid #f59e0b',
                boxShadow: '0 20px 50px rgba(0,0,0,0.55)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                  }}>
                    {qObj.badge}
                  </span>
                  <button
                    onClick={() => setActiveModal(null)}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      padding: '0.25rem 0.65rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ✕ Fermer
                  </button>
                </div>

                <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#475569', fontStyle: 'italic' }}>
                  {qObj.context}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.85rem',
                  padding: '0.9rem 1rem',
                  marginBottom: '1rem',
                }}>
                  <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', flex: 1, lineHeight: 1.45 }}>
                    {qObj.prompt}
                  </p>
                  <button
                    onClick={() => speakFrench(qObj.prompt)}
                    title="Écouter la phrase"
                    style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      borderRadius: '0.6rem',
                      padding: '0.45rem',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1rem' }}>
                  {qObj.options.map((opt, idx) => {
                    const isSelected = activeModal.selected === idx;
                    const isRight = idx === qObj.correct;
                    let bg = '#f8fafc';
                    let border = '#cbd5e1';
                    let col = '#0f172a';

                    if (isSelected) {
                      if (activeModal.isCorrect) {
                        bg = '#dcfce7';
                        border = '#16a34a';
                        col = '#14532d';
                      } else {
                        bg = '#fee2e2';
                        border = '#dc2626';
                        col = '#7f1d1d';
                      }
                    } else if (activeModal.isCorrect && isRight) {
                      bg = '#dcfce7';
                      border = '#16a34a';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        style={{
                          background: bg,
                          border: `2px solid ${border}`,
                          color: col,
                          borderRadius: '0.75rem',
                          padding: '0.75rem 0.9rem',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {String.fromCharCode(65 + idx)}. {opt}
                      </button>
                    );
                  })}
                </div>

                {activeModal.selected !== null && (
                  <div style={{
                    background: activeModal.isCorrect ? '#f0fdf4' : '#fef2f2',
                    border: `2px solid ${activeModal.isCorrect ? '#22c55e' : '#ef4444'}`,
                    borderRadius: '0.75rem',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: activeModal.isCorrect ? '#14532d' : '#7f1d1d' }}>
                      {activeModal.isCorrect
                        ? `✅ ${qObj.explanation}`
                        : '❌ Pas tout à fait ! Observe bien le sujet (tu / nous / vous) et si la phrase est à l’impératif ou après « Il faut que » (subjonctif). Réessaie !'}
                    </div>

                    {activeModal.isCorrect && (
                      <button
                        onClick={handleNextQuestionOrFinish}
                        style={{
                          alignSelf: 'flex-end',
                          background: 'linear-gradient(135deg, #16a34a, #15803d)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '0.6rem',
                          padding: '0.55rem 1.2rem',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                        }}
                      >
                        {activeModal.qIdx + 1 < modalRoom.questions.length
                          ? 'Question suivante (2/2) →'
                          : 'Déverrouiller les portails de la salle ✨'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── VICTORY MODAL OVERLAY ── */}
        {victory && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.92)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 25,
          }}>
            <div style={{
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '1.25rem',
              padding: '2rem',
              maxWidth: '540px',
              textAlign: 'center',
              border: '4px solid #fbbf24',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆🛡️✨</div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 900, color: '#92400e' }}>
                Triomphe à la Citadelle du Bien-Être !
              </h3>
              <p style={{ fontSize: '0.98rem', color: '#334155', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                Félicitations ! Tu as exploré les 6 salles en argile de la Citadelle et maîtrisé{' '}
                <strong>l’impératif (affirmatif et négatif)</strong> ainsi que{' '}
                <strong>les structures d’obligation (Il faut que + subjonctif)</strong> avec les 8 verbes essentiels de l’Unité 2 !
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={resetGame}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.7rem 1.4rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🔄 Rejouer l’aventure
                </button>
                {onBack && (
                  <button
                    onClick={onBack}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.75rem',
                      padding: '0.7rem 1.4rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    ← Retour aux jeux
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM CONTROLS BAR + ON-SCREEN D-PAD ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '0.9rem',
        padding: '0.65rem 1rem',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '0.85rem',
      }}>
        <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
          <div>🎮 <strong>3 façons de bouger :</strong> Touches <strong>WASD / ZQSD / Flèches</strong>, ou <strong>cliquez directement sur le sol</strong> pour marcher, ou utilisez les boutons ci-contre.</div>
          <div>💡 <strong>Astuce :</strong> Tous les murs d’argile correspondent exactement aux obstacles visibles. Approchez de l’Autel doré pour ouvrir les portails !</div>
        </div>

        {/* On-Screen Touch/Click D-Pad */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => nudgePlayer(-1, 0, 'W')}
            style={{ padding: '0.45rem 0.7rem', borderRadius: '0.5rem', border: '1px solid #475569', background: '#1e293b', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
          >
            ◀
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button
              onClick={() => nudgePlayer(0, -1, 'N')}
              style={{ padding: '0.35rem 0.7rem', borderRadius: '0.5rem', border: '1px solid #475569', background: '#1e293b', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
            >
              ▲
            </button>
            <button
              onClick={() => nudgePlayer(0, 1, 'S')}
              style={{ padding: '0.35rem 0.7rem', borderRadius: '0.5rem', border: '1px solid #475569', background: '#1e293b', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
            >
              ▼
            </button>
          </div>
          <button
            onClick={() => nudgePlayer(1, 0, 'E')}
            style={{ padding: '0.45rem 0.7rem', borderRadius: '0.5rem', border: '1px solid #475569', background: '#1e293b', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
