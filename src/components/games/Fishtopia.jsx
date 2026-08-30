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

// Base Map Grid (Level 1): Dirt/Sand path (0) and wooden penton (5) are walkable.
// All surrounding bushes, long grass, rocks, trees, and water are STRICTLY IMPASSABLE (1 & 2)!
const MAP_GRID = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,2,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,2,1,1,2],
  [2,2,4,4,4,4,2,2,2,2,2,2,3,3,3,3,2,1,1,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,0,2,1,1,1,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// Level 2 Map (Brittany Coastal Cliffs): Rocks, cliffs, bushes, long grass, and water are strictly IMPASSABLE!
const MAP_LEVEL_2 = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,2,2,2,2],
  [2,2,4,4,4,4,2,2,2,2,2,2,3,3,3,3,2,2,2,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,1,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,1,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,1,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// Level 3 Map (Cape Cod Dunes): Sand dunes, bushes, long grass, and water are strictly IMPASSABLE!
const MAP_LEVEL_3 = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,1,1,1,2],
  [2,2,4,4,4,4,2,2,2,2,2,2,3,3,3,3,1,1,1,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,4,4,4,4,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// Level 4 Map (Tahiti Lagoon): ONLY the sand path (0) and wooden penton (5) are walkable.
// All lagoon water, bushes, palms, long grass, and buildings are strictly IMPASSABLE!
const MAP_LEVEL_4 = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,2,1,1,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,2,1,1,2],
  [2,1,4,4,4,4,2,2,2,2,2,2,3,3,3,3,2,1,1,2],
  [2,1,4,4,4,4,0,0,0,0,0,0,0,0,0,0,2,1,1,1,2],
  [2,1,4,4,4,4,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,1,4,4,4,4,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,0,0,0,0,5,5,5,5,5,5,5,5,1,2],
  [2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,2],
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
    { "q": "Comment dit-on 'journalist' ?", "opts": ["le journal", "le journaliste", "le média"], "ans": 1 },
    { "q": "La liberté de la ___ est importante.", "opts": ["source", "presse", "vérité"], "ans": 1 },
    { "q": "Il faut vérifier la ___ d'une information.", "opts": ["source", "censure", "rédaction"], "ans": 0 },
    { "q": "Un article qui révèle un secret est un ___.", "opts": ["scoop", "titre", "kiosque"], "ans": 0 },
    { "q": "L'ensemble des journaux imprimés s'appelle la presse ___.", "opts": ["numérique", "écrite", "télévisée"], "ans": 1 },
    { "q": "Le titre d'un article en gros caractères est la ___.", "opts": ["une", "page", "lettre"], "ans": 0 },
    { "q": "Un journaliste qui travaille à son compte est un ___.", "opts": ["rédacteur", "pigiste", "éditeur"], "ans": 1 },
    { "q": "Une fausse information est souvent appelée une ___.", "opts": ["fake news (infox)", "dépêche", "chronique"], "ans": 0 },
    { "q": "L'abonnement à un journal permet de le ___.", "opts": ["recevoir", "vendre", "supprimer"], "ans": 0 },
    { "q": "Un bref résumé de l'actualité à la radio est un ___.", "opts": ["flash info", "roman", "poème"], "ans": 0 },
    { "q": "Un dessin humoristique dans un journal est un ___.", "opts": ["dessin de presse", "tableau", "portrait"], "ans": 0 },
    { "q": "Le responsable de la rédaction est le rédacteur en ___.", "opts": ["chef", "premier", "maître"], "ans": 0 },
    { "q": "Vérifier les faits avant de publier s'appelle le ___.", "opts": ["fact-checking", "changement", "tirage"], "ans": 0 },
    { "q": "Un commentaire d'opinion écrit par le directeur est un ___.", "opts": ["éditorial", "roman", "poème"], "ans": 0 },
    { "q": "Un grand reportage d'investigation est une ___.", "opts": ["enquête", "pub", "annonce"], "ans": 0 },
    { "q": "La censure empêche la libre ___ des idées.", "opts": ["circulation", "fermeture", "perte"], "ans": 0 },
    { "q": "Les réseaux sociaux propagent vite les ___.", "opts": ["rumeurs", "statues", "vérités"], "ans": 0 },
    { "q": "Un journal publié chaque jour est un ___.", "opts": ["quotidien", "mensuel", "annuel"], "ans": 0 },
    { "q": "Un journal publié chaque semaine est un ___.", "opts": ["hebdomadaire", "quotidien", "mensuel"], "ans": 0 },
    { "q": "Un droit fondamental du citoyen est la liberté d'___.", "opts": ["expression", "achat", "sommeil"], "ans": 0 }
  ],
  "2": [
    { "q": "Elle ___ (aller) au lycée tous les jours.", "opts": ["vas", "va", "vont"], "ans": 1 },
    { "q": "Nous ___ (avoir) un cours de français.", "opts": ["avons", "avez", "ont"], "ans": 0 },
    { "q": "Ils ___ (être) très motivés.", "opts": ["sont", "sommes", "êtes"], "ans": 0 },
    { "q": "Je ___ (faire) mes devoirs à la bibliothèque.", "opts": ["fais", "fait", "faisons"], "ans": 0 },
    { "q": "Vous ___ (pouvoir) m'expliquer cette leçon ?", "opts": ["pouvez", "pouvons", "peuvent"], "ans": 0 },
    { "q": "Tu ___ (finir) tes exercices avant midi.", "opts": ["finis", "finit", "finissons"], "ans": 0 },
    { "q": "Nous ___ (choisir) une bonne stratégie.", "opts": ["choisissons", "choisissez", "choisissent"], "ans": 0 },
    { "q": "Elles ___ (parler) couramment français.", "opts": ["parlent", "parles", "parlez"], "ans": 0 },
    { "q": "Je ___ (manger) une pomme à la récréation.", "opts": ["mange", "manges", "mangeons"], "ans": 0 },
    { "q": "Vous ___ (écrire) un bel article de journal.", "opts": ["écrivez", "écrivons", "écrivent"], "ans": 0 },
    { "q": "Il ___ (lire) un roman passionnant.", "opts": ["lit", "lis", "lisez"], "ans": 0 },
    { "q": "Nous ___ (partir) en voyage demain.", "opts": ["partons", "partez", "partent"], "ans": 0 },
    { "q": "Elles ___ (vendre) des poissons au marché.", "opts": ["vendent", "vends", "vendez"], "ans": 0 },
    { "q": "Tu ___ (comprendre) cette règle de grammaire ?", "opts": ["comprends", "comprend", "comprenons"], "ans": 0 },
    { "q": "Vous ___ (attendre) le bus scolaire.", "opts": ["attendez", "attendons", "attendent"], "ans": 0 },
    { "q": "Je ___ (mettre) mes affaires dans mon sac.", "opts": ["mets", "met", "mettons"], "ans": 0 },
    { "q": "Ils ___ (dormir) huit heures par nuit.", "opts": ["dorment", "dort", "dormons"], "ans": 0 },
    { "q": "Nous ___ (apprendre) le vocabulaire de l'unité.", "opts": ["apprenons", "apprenez", "apprennent"], "ans": 0 },
    { "q": "Elle ___ (répondre) aux questions du kiosque.", "opts": ["répond", "réponds", "répondent"], "ans": 0 },
    { "q": "Tu ___ (voir) ce magnifique paysage ?", "opts": ["vois", "voit", "voyons"], "ans": 0 }
  ],
  "3": [
    { "q": "Tu ___ (devoir) réviser les verbes.", "opts": ["dois", "doit", "devons"], "ans": 0 },
    { "q": "Elles ___ (prendre) le bus de huit heures.", "opts": ["prennent", "prends", "prenez"], "ans": 0 },
    { "q": "Nous ___ (vouloir) réussir notre projet.", "opts": ["voulons", "voulez", "veulent"], "ans": 0 },
    { "q": "Je ___ (savoir) la réponse à la question.", "opts": ["sais", "sait", "savent"], "ans": 0 },
    { "q": "Vous ___ (venir) à la réunion du club ?", "opts": ["venez", "venons", "viennent"], "ans": 0 },
    { "q": "Il faut que tu ___ (faire) attention.", "opts": ["fasses", "fais", "faites"], "ans": 0 },
    { "q": "Je souhaiterais qu'elle ___ (être) présente.", "opts": ["soit", "est", "sera"], "ans": 0 },
    { "q": "Si j'avais le temps, je ___ (partir) en vacances.", "opts": ["partirais", "partir", "partirai"], "ans": 0 },
    { "q": "Il faut que nous ___ (avoir) nos billets.", "opts": ["ayons", "avons", "aurez"], "ans": 0 },
    { "q": "Si vous étudiiez, vous ___ (réussir) l'examen.", "opts": ["réussiriez", "réussissez", "réussir"], "ans": 0 },
    { "q": "Il est important qu'ils ___ (comprendre) la leçon.", "opts": ["comprennent", "comprennent pas", "comprendra"], "ans": 0 },
    { "q": "Tu ___ (pouvoir) m'aider si tu voulais.", "opts": ["pourrais", "peux", "pouvez"], "ans": 0 },
    { "q": "Bien qu'il ___ (faire) froid, nous sortons.", "opts": ["fasse", "fait", "fera"], "ans": 0 },
    { "q": "Nous ___ (aimer) visiter la Bretagne cet été.", "opts": ["aimerions", "aimons", "aimerez"], "ans": 0 },
    { "q": "Il faut que vous ___ (savoir) la vérité.", "opts": ["sachiez", "savez", "saurez"], "ans": 0 },
    { "q": "Si elle travaillait, elle ___ (avoir) de meilleures notes.", "opts": ["aurait", "a", "aura"], "ans": 0 },
    { "q": "Avant que tu ne ___ (partir), écoute-moi.", "opts": ["partes", "pars", "partira"], "ans": 0 },
    { "q": "Je préférerais que nous ___ (choisir) ensemble.", "opts": ["choisissions", "choisissons", "choisirez"], "ans": 0 },
    { "q": "Tu ___ (devoir) m'avertir plus tôt.", "opts": ["devrais", "dois", "devras"], "ans": 0 },
    { "q": "Il faut qu'ils ___ (aller) au laboratoire.", "opts": ["aillent", "vont", "iront"], "ans": 0 }
  ],
  "4": [
    { "q": "J'ai vu cette vidéo, je l'ai ___ aimée.", "opts": ["beaucoup", "très", "trop"], "ans": 0 },
    { "q": "Combien de livres as-tu ? J'___ ai trois.", "opts": ["y", "les", "en"], "ans": 2 },
    { "q": "Je te conseille ___ lire cet article.", "opts": ["à", "de", "pour"], "ans": 1 },
    { "q": "Il ___ offre des fleurs. (à sa mère)", "opts": ["l'", "la", "lui"], "ans": 2 },
    { "q": "Vous ___ avez parlé hier. (à vos amis)", "opts": ["les", "leur", "y"], "ans": 1 },
    { "q": "Le livre ___ je te parle est passionnant.", "opts": ["dont", "que", "qui"], "ans": 0 },
    { "q": "La ville ___ j'habite est magnifique.", "opts": ["où", "que", "dont"], "ans": 0 },
    { "q": "Ce film est fantastique, je ___ recommande.", "opts": ["le", "lui", "en"], "ans": 0 },
    { "q": "As-tu répondu à la lettre ? Oui, j'___ ai répondu.", "opts": ["y", "en", "la"], "ans": 0 },
    { "q": "Les conseils ___ le professeur m'a donnés sont utiles.", "opts": ["que", "qui", "dont"], "ans": 0 },
    { "q": "Elle se souvient ___ son premier voyage en France.", "opts": ["de", "à", "en"], "ans": 0 },
    { "q": "Il s'intéresse beaucoup ___ arts et à la culture.", "opts": ["aux", "des", "les"], "ans": 0 },
    { "q": "C'est l'étudiant ___ a gagné le concours.", "opts": ["qui", "que", "dont"], "ans": 0 },
    { "q": "Avez-vous besoin de ce dictionnaire ? Oui, j'___ ai besoin.", "opts": ["en", "y", "le"], "ans": 0 },
    { "q": "Ma sœur ___ a envoyé une belle carte postale. (à nous)", "opts": ["nous", "leur", "les"], "ans": 0 },
    { "q": "Ce sont les affaires ___ j'ai achetées au marché.", "opts": ["que", "qui", "dont"], "ans": 0 },
    { "q": "Penses-tu à tes examens ? Oui, j'___ pense souvent.", "opts": ["y", "en", "les"], "ans": 0 },
    { "q": "Il m'a demandé ___ je voulais venir avec lui.", "opts": ["si", "que", "dont"], "ans": 0 },
    { "q": "C'est la raison pour ___ il est en retard.", "opts": ["laquelle", "quel", "qui"], "ans": 0 },
    { "q": "Elle ___ a dit la vérité sans hésiter. (à moi)", "opts": ["m'", "moi", "me les"], "ans": 0 }
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

  // --- HARD RULES FOR MOVEMENT / WALKABILITY (STRICT NIMBLE 14-POINT COLLISION SAMPLING) ---
  // Hard Rule: Hamster CAN ONLY walk on Sand/Dirt Path (GRASS=0) or Wooden Pier Dock (PIER=5).
  // Water (1), Forest/Trees/Bushes/Rocks/Long Grass/Cliffs (2), Fish Market structure (3), Question Booth structure (4) are 100% STRICTLY IMPASSABLE in ALL levels!
  const checkCollisionAt = (px, py, size) => {
    const colSize = 14; // Precise 14px collision box around hamster center for smooth 1-tile navigation
    const points = [
      { x: px - colSize/2, y: py - colSize/2 },
      { x: px + colSize/2, y: py - colSize/2 },
      { x: px - colSize/2, y: py + colSize/2 },
      { x: px + colSize/2, y: py + colSize/2 },
      { x: px, y: py - colSize/2 },
      { x: px, y: py + colSize/2 },
      { x: px - colSize/2, y: py },
      { x: px + colSize/2, y: py }
    ];

    for (let c of points) {
      const tile = getTile(c.x, c.y);
      // Hard Rule: If tile is NOT walkable Dirt/Sand Path (0) or Pier Dock (5), BLOCK MOVEMENT IMMEDIATELY!
      if (tile !== GRASS && tile !== PIER) {
        return true; // BLOCKED! Strictly cannot walk on water, bushes, rocks, forest, long grass, or buildings!
      }
    }

    return false; // Walkable!
  };

  // --- HARD RULES FOR INTERACTION TRIGGERS ---
  const getInteractionTarget = () => {
    const p = playerRef.current;
    
    // Check tiles directly in front (North / facing building entrance) of the hamster
    const tileInFrontFar = getTile(p.x, p.y - TILE * 0.75);
    const tileInFrontMid = getTile(p.x, p.y - TILE * 0.5);
    const tileInFrontNear = getTile(p.x, p.y - TILE * 0.25);
    const currentTile = getTile(p.x, p.y);

    // Rule: Question Booth tab ONLY when standing directly in front facing North
    if (tileInFrontFar === TEMPLE || tileInFrontMid === TEMPLE || tileInFrontNear === TEMPLE) return 'station';

    // Rule: Fish Market / Trading tab ONLY when standing directly in front facing North
    if (tileInFrontFar === MARKET || tileInFrontMid === MARKET || tileInFrontNear === MARKET) return 'market';

    // Rule: Fishing tab ONLY when standing on the wooden fishing dock ("penton")
    if (currentTile === PIER) return 'fish';

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
          🗡️ Francotopia : La Légende d'Hyrule (Unité 1)
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
