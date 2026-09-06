import React, { useRef, useEffect, useState } from 'react';
import './MineurFou.css';

// ── CANVAS DIMENSIONS ────────────────────────────────────────────────────────
const W = 800, H = 600;

// ── ORE LEVELS & ATMOSPHERIC THEMES ──────────────────────────────────────────
const ORES = [
  {
    id: 1,
    name: 'Charbon',
    key: 'charbon',
    icon: '⚫',
    col: '#475569',
    hi: '#94a3b8',
    val: 10,
    thr: 200,
    badgeBg: '#334155',
    badgeBorder: '#64748b',
    themeName: 'Filon de Charbon — Ambiance Minérale & Brumeuse',
    skyTop: '#334155',
    skyMid: '#64748b',
    skyBottom: '#cbd5e1',
    hillFar: '#334155',
    hillMid: '#3b4e43',
    hillNear: '#475d4a',
    grass: '#4d6848',
    grassHi: '#5c7b55',
    pathBase: '#64748b',
    pathStone: '#475569',
    pathMortar: '#1e293b',
    tint: 'rgba(30, 41, 59, 0.16)',
    particleColor: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'],
  },
  {
    id: 2,
    name: 'Cuivre',
    key: 'cuivre',
    icon: '🟤',
    col: '#b45309',
    hi: '#f59e0b',
    val: 25,
    thr: 450,
    badgeBg: '#78350f',
    badgeBorder: '#d97706',
    themeName: 'Filon de Cuivre — Crépuscule Cuivré & Lueur Chaude',
    skyTop: '#7c2d12',
    skyMid: '#c2410c',
    skyBottom: '#fed7aa',
    hillFar: '#702e1b',
    hillMid: '#713f12',
    hillNear: '#6b5d28',
    grass: '#5a6231',
    grassHi: '#717c38',
    pathBase: '#8c593b',
    pathStone: '#714022',
    pathMortar: '#431407',
    tint: 'rgba(194, 65, 12, 0.14)',
    particleColor: ['#ea580c', '#c2410c', '#9a3412', '#f59e0b', '#fed7aa'],
  },
  {
    id: 3,
    name: 'Argent',
    key: 'argent',
    icon: '⚪',
    col: '#0284c7',
    hi: '#7dd3fc',
    val: 50,
    thr: 700,
    badgeBg: '#0f3a57',
    badgeBorder: '#38bdf8',
    themeName: "Filon d'Argent — Clarté Lunaire & Brillance Argentée",
    skyTop: '#0f172a',
    skyMid: '#1e3a5f',
    skyBottom: '#bae6fd',
    hillFar: '#1e293b',
    hillMid: '#1e384b',
    hillNear: '#2b5160',
    grass: '#355c57',
    grassHi: '#477872',
    pathBase: '#64748b',
    pathStone: '#94a3b8',
    pathMortar: '#0f172a',
    tint: 'rgba(186, 230, 253, 0.14)',
    particleColor: ['#f8fafc', '#e2e8f0', '#94a3b8', '#38bdf8', '#7dd3fc'],
  },
  {
    id: 4,
    name: 'Or',
    key: 'or',
    icon: '🟡',
    col: '#ca8a04',
    hi: '#fde047',
    val: 100,
    thr: 1100,
    badgeBg: '#713f12',
    badgeBorder: '#eab308',
    themeName: "Filon d'Or — Heure Dorée & Rayonnement Somptueux",
    skyTop: '#b45309',
    skyMid: '#f59e0b',
    skyBottom: '#fef08a',
    hillFar: '#713f12',
    hillMid: '#4d7c0f',
    hillNear: '#65a30d',
    grass: '#4d7c0f',
    grassHi: '#84cc16',
    pathBase: '#b45309',
    pathStone: '#92400e',
    pathMortar: '#451a03',
    tint: 'rgba(250, 204, 21, 0.15)',
    particleColor: ['#facc15', '#fde047', '#ca8a04', '#fef08a', '#ffffff'],
  },
];

const MAX_INV = 10;
const SPEED   = 2.8;
const P_SIZE  = 18;
const I_DIST  = 72;

// Interaction-zone centres
const MINE_P   = { x: 383, y: 210 };
const CAFE_P   = { x: 128, y: 358 };
const BUREAU_P = { x: 662, y: 358 };

// Walkable path zones { x, y = top-left, w, h }
const WALK = [
  { x: 350, y: 200, w: 66, h: 130 }, // vertical spine: mine -> junction
  { x: 85,  y: 318, w: 630, h: 74 }, // horizontal road: cafe -> bureau
];

function inZone(x, y) {
  return WALK.some(z => x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h);
}

function walkable(px, py) {
  const s = P_SIZE * 0.52;
  return (
    inZone(px - s, py - s) &&
    inZone(px + s, py - s) &&
    inZone(px - s, py + s) &&
    inZone(px + s, py + s) &&
    inZone(px, py)
  );
}

// ── QUESTION BANK (80 questions — 20 per level) ───────────────────────────────
const QUESTIONS = {
  1: [
    { q: "Comment qualifie-t-on un personnage qui accomplit des actes héroïques mais a des méthodes moralement douteuses ?", opts: ["Un justicier aveugle", "Un anti-héros", "Un antagoniste"], ans: 1 },
    { q: "Quel mot désigne l'adversaire direct du protagoniste dans un récit ?", opts: ["L'allié", "L'antagoniste", "Le figurant"], ans: 1 },
    { q: "La qualité morale d'un héros qui affronte le danger sans faiblir est :", opts: ["La lâcheté", "Le dévouement et la bravoure", "L'indifférence"], ans: 1 },
    { q: "Pour débuter une argumentation sur un personnage, quel connecteur utilise-t-on ?", opts: ["Tout d'abord", "Finalement", "Cependant"], ans: 0 },
    { q: "Un héros classique fait souvent passer le bien ___ avant son intérêt personnel.", opts: ["commun", "privé", "illusoire"], ans: 0 },
    { q: "Le talon d'Achille d'un personnage représente :", opts: ["Son superpouvoir secret", "Sa faiblesse ou vulnérabilité", "Son armure enchantée"], ans: 1 },
    { q: "Quel connecteur exprime une relation d'addition ?", opts: ["En outre", "Néanmoins", "Par conséquent"], ans: 0 },
    { q: "Un acte accompli avec désintéressement pour secourir autrui est un acte de :", opts: ["Trahison", "Dévouement", "Vengeance"], ans: 1 },
    { q: "L'anti-héros agit souvent poussé par :", opts: ["Une quête de gloire pure", "Une blessure passée ou la survie", "Le respect aveugle des lois"], ans: 1 },
    { q: "Pour exprimer une opposition entre deux idées, on utilise :", opts: ["C'est pourquoi", "Cependant", "D'abord"], ans: 1 },
    { q: "Un combattant qui refuse de reculer devant une bête féroce fait preuve de :", opts: ["Couardise", "Bravoure", "Rancœur"], ans: 1 },
    { q: "Comment appelle-t-on l'épreuve initiatique qui transforme un simple citoyen en sauveur ?", opts: ["Le serment civique", "La quête héroïque", "La trêve"], ans: 1 },
    { q: "Quel connecteur annonce la conséquence d'une action ?", opts: ["Par conséquent", "En premier lieu", "Toutefois"], ans: 0 },
    { q: "Le mobile secret qui pousse un personnage à agir s'appelle :", opts: ["Sa motivation", "Sa maladresse", "Son costume"], ans: 0 },
    { q: "Un personnage impitoyable et cruel envers ses ennemis est :", opts: ["Clément", "Impitoyable", "Tolérant"], ans: 1 },
    { q: "Pour conclure une analyse morale, on emploie :", opts: ["Premièrement", "En conclusion", "Par ailleurs"], ans: 1 },
    { q: "L'anti-héros se distingue du méchant classique car :", opts: ["Il n'a aucun pouvoir", "Il possède encore une part d'humanité", "Il réussit toujours sans effort"], ans: 1 },
    { q: "L'acte de pardonner à un rival vaincu s'appelle :", opts: ["La clémence", "L'embuscade", "L'avarice"], ans: 0 },
    { q: "Quel connecteur permet d'ajouter un argument supplémentaire ?", opts: ["De plus", "Donc", "En revanche"], ans: 0 },
    { q: "Un pacte conclu entre deux guerriers pour s'entraider est :", opts: ["Une rivalité", "Une alliance", "Une dispute"], ans: 1 },
  ],
  2: [
    { q: "« Pendant que le héros ___ les remparts, la foudre est tombée. »", opts: ["surveillait", "a surveillé", "surveillera"], ans: 0 },
    { q: "« Soudain, l'alarme de la forteresse ___ dans la nuit. »", opts: ["retentissait", "a retenti", "retentit"], ans: 1 },
    { q: "« Chaque matin, le vieux mentor ___ les recrues au maniement du bouclier. »", opts: ["a entraîné", "entraînait", "entraîne"], ans: 1 },
    { q: "« À cet instant précis, elle ___ que le trésor était faux. »", opts: ["comprenait", "a compris", "a comprenant"], ans: 1 },
    { q: "« Il faisait un froid glacial et la neige ___ les chemins d'accès. »", opts: ["bloquait", "a bloqué", "bloquer"], ans: 0 },
    { q: "« Tandis que nous négocions avec le chef, l'antagoniste ___ en courant. »", opts: ["entrait", "est entré", "a entré"], ans: 1 },
    { q: "« Autrefois, les villageois ___ aveuglément en la protection des chevaliers. »", opts: ["ont cru", "croyaient", "croient"], ans: 1 },
    { q: "« Dès qu'il a vu le danger, le justicier ___ son arc de guerre. »", opts: ["bandait", "a bandé", "bande"], ans: 1 },
    { q: "« La sorcière ___ un long voile noir qui flottait au vent. »", opts: ["a porté", "portait", "porta"], ans: 1 },
    { q: "« L'anti-héros ___ un dilemme cruel hier soir lors de l'attaque. »", opts: ["tranchait", "a tranché", "tranchera"], ans: 1 },
    { q: "« Les gardes ___ profondément quand les espions ont franchi la grille. »", opts: ["dormaient", "ont dormi", "dorment"], ans: 0 },
    { q: "« Finalement, après des heures d'attente, la porte dérobée ___ avec fracas. »", opts: ["s'ouvrait", "s'est ouverte", "s'était ouvrir"], ans: 1 },
    { q: "Pour décrire le temps, le décor ou l'état d'esprit dans le passé, quel temps emploie-t-on ?", opts: ["Le passé composé", "L'imparfait", "Le subjonctif"], ans: 1 },
    { q: "Pour exprimer une action soudaine, ponctuelle et complètement achevée :", opts: ["L'imparfait", "Le passé composé", "Le conditionnel"], ans: 1 },
    { q: "« Le chevalier était blessé mais il ___ le combat jusqu'au bout. »", opts: ["poursuivait", "a poursuivi", "poursuivre"], ans: 1 },
    { q: "« Tous les soirs, l'espionne ___ les mouvements de la garde royale. »", opts: ["observait", "a observé", "observe"], ans: 0 },
    { q: "« Brusquement, une flèche ennemie ___ le bouclier en deux. »", opts: ["fendait", "a fendu", "fend"], ans: 1 },
    { q: "« À l'époque, les rebelles ___ dans les cavernes secrètes de la montagne. »", opts: ["ont vécu", "vivaient", "vivront"], ans: 1 },
    { q: "« Lorsque le signal a été donné, l'armée ___ sa marche en avant. »", opts: ["commençait", "a commencé", "commence"], ans: 1 },
    { q: "« Il ___ minuit passé quand le messager royal est arrivé épuisé. »", opts: ["a été", "était", "sera"], ans: 1 },
  ],
  3: [
    { q: "La motivation d'un anti-héros est souvent :", opts: ["L'altruisme pur et désintéressé", "Une quête personnelle ou la survie", "Le désir d'obéir aux ordres établis"], ans: 1 },
    { q: "« Il était solitaire, cynique, ___ il a sauvé l'enfant au péril de sa vie. »", opts: ["pourtant", "donc", "premièrement"], ans: 0 },
    { q: "Un protagoniste tourmenté par ses erreurs passées éprouve du :", opts: ["Remords", "Dédain", "Zèle"], ans: 0 },
    { q: "Pour introduire une concession dans un portrait moral :", opts: ["Bien que", "Ainsi", "En premier lieu"], ans: 0 },
    { q: "Le justicier sombre refuse souvent la gloire publique parce qu'il :", opts: ["Ne sait pas parler en public", "Agit dans l'ombre selon son propre code", "A peur des honneurs"], ans: 1 },
    { q: "Quel terme désigne un personnage prêt à sacrifier des innocents pour sa cause ?", opts: ["Un anti-héros", "Un fanatique / antagoniste", "Un allié fidèle"], ans: 1 },
    { q: "« Le détective doutait de tout le monde ; ___, il a continué d'enquêter seul. »", opts: ["néanmoins", "parce que", "c'est-à-dire"], ans: 0 },
    { q: "Une action héroïque accomplie au mépris des lois en vigueur est qualifiée d' :", opts: ["Illégitime mais juste", "Ordinaire", "Inutile"], ans: 0 },
    { q: "Quelle figure mythologique symbolise l'orgueil démesuré puni par le destin ?", opts: ["Icare", "Ulysse", "Hercule"], ans: 0 },
    { q: "Pour peser le pour et le contre d'un comportement, on utilise :", opts: ["D'une part... d'autre part", "Puisque... donc", "Afin que... pour"], ans: 0 },
    { q: "L'attitude d'un héros qui dissimule sa souffrance morale derrière l'humour est :", opts: ["La désinvolture", "L'arrogance", "L'amertume"], ans: 0 },
    { q: "« ___ ses blessures graves, le soldat a refusé d'abandonner son poste. »", opts: ["Malgré", "Grâce à", "Pendant"], ans: 0 },
    { q: "Le sentiment de culpabilité qui hante un personnage s'appelle :", opts: ["Le fardeau moral", "L'orgueil", "Le laxisme"], ans: 0 },
    { q: "Quel connecteur permet d'illustrer une affirmation par un fait précis ?", opts: ["Par exemple", "Toutefois", "Finalement"], ans: 0 },
    { q: "Un acte de trahison commis par cupidité s'oppose directement à :", opts: ["La loyauté", "La ruse", "L'adresse"], ans: 0 },
    { q: "Un personnage qui cherche vengeance après la perte des siens agit par :", opts: ["Rancune et blessure", "Devoir civique", "Curiosité"], ans: 0 },
    { q: "Pour marquer la transition vers un nouvel argument déterminant :", opts: ["En outre / De surcroît", "Bref", "Aussitôt"], ans: 0 },
    { q: "Le doute existentiel qui paralyse le héros devant un choix tragique est un :", opts: ["Dilemme cornélien", "Simple contretemps", "Malentendu"], ans: 0 },
    { q: "Un serment solennel prêté devant ses compagnons d'armes est :", opts: ["Un vœu inviolable", "Une rumeur", "Un mensonge"], ans: 0 },
    { q: "Quel mot caractérise un héros dont la noblesse d'âme force le respect ?", opts: ["Magnanime", "Sournois", "Chétif"], ans: 0 },
  ],
  4: [
    { q: "Dans une analyse littéraire, pour réfuter une idée adverse :", opts: ["Certes... mais", "En somme", "D'abord"], ans: 0 },
    { q: "La frontière morale entre héros et anti-héros devient floue lorsque :", opts: ["Les fins justifient des moyens cruels", "Le personnage porte un masque noir", "L'histoire se passe la nuit"], ans: 0 },
    { q: "« Le héros a triomphé, ___ la victoire a laissé un goût amer de désolation. »", opts: ["quoique", "or", "si bien que"], ans: 1 },
    { q: "Pour marquer l'aboutissement logique d'une longue démonstration :", opts: ["Il s'ensuit que", "D'un côté", "Auparavant"], ans: 0 },
    { q: "Un personnage qui accepte d'endosser le rôle du coupable pour préserver la paix est :", opts: ["Un bouc émissaire sacrificiel", "Un lâche", "Un espion double"], ans: 0 },
    { q: "La rédemption d'un anti-héros à la fin d'une tragédie passe souvent par :", opts: ["Un sacrifice ultime", "Une fuite discrète", "Un procès truqué"], ans: 0 },
    { q: "« Non seulement il a déjoué le piège, ___ il a rallié les ennemis à sa cause. »", opts: ["mais encore", "cependant", "sinon"], ans: 0 },
    { q: "Le sentiment de fatalité contre lequel le héros lutte vainement s'appelle :", opts: ["Le destin inexorable", "La chance", "L'illusion"], ans: 0 },
    { q: "Quel connecteur exprime une condition stricte ?", opts: ["Pourvu que", "Tandis que", "Puisque"], ans: 0 },
    { q: "L'ambivalence morale d'une œuvre se manifeste quand :", opts: ["Le bien et le mal ne sont pas nettement séparés", "Tous les personnages sont parfaits", "Il n'y a pas d'action"], ans: 0 },
    { q: "Un plaidoyer en faveur de la clémence cherche à éveiller :", opts: ["L'empathie et la compassion", "La terreur", "La jalousie"], ans: 0 },
    { q: "« Elle agissait dans l'ombre, ___ nul ne pût deviner ses véritables intentions. »", opts: ["afin que", "bien que", "alors que"], ans: 0 },
    { q: "Le dénouement tragique d'un récit héroïque provoque souvent chez le lecteur la :", opts: ["Catharsis (purification des émotions)", "Confusion totale", "Colère pure"], ans: 0 },
    { q: "Pour synthétiser deux thèses apparemment contradictoires :", opts: ["En définitive", "Premièrement", "D'une part"], ans: 0 },
    { q: "Le sacrifice héroïque prend toute sa valeur quand il est consenti :", opts: ["En pleine conscience du danger", "Par accident", "Sous la menace"], ans: 0 },
    { q: "Un antagoniste complexe se distingue d'un monstre car il :", opts: ["Possède des motivations compréhensibles", "Ne perd jamais", "N'a aucune faiblesse"], ans: 0 },
    { q: "« Le champion chancela sous le choc ; ___, il se redressa avec fierté. »", opts: ["toutefois", "en effet", "par conséquent"], ans: 0 },
    { q: "L'éloge funèbre d'un compagnon d'armes tombé au combat est :", opts: ["Une oraison funèbre", "Un pamphlet", "Une satire"], ans: 0 },
    { q: "La quête de vérité du héros qui détruit ses propres illusions est :", opts: ["Une désillusion libératrice", "Une lâcheté", "Un caprice"], ans: 0 },
    { q: "L'héritage moral qu'un grand protecteur laisse à sa province est son :", opts: ["Legs éthique et héroïque", "Butin de guerre", "Fief cadastral"], ans: 0 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
export default function MineurFou({ onBack }) {
  const canvasRef = useRef(null);
  const bgImgRef = useRef(null);
  const cafeImgRef = useRef(null);
  const bureauImgRef = useRef(null);
  const mineImgRef = useRef(null);
  const minerImgRef = useRef(null);
  const minerBackImgRef = useRef(null);
  const minerFrontImgRef = useRef(null);
  const oreImgsRef = useRef({});

  // Preload high-res transparent sprites and painted background
  useEffect(() => {
    const bgImg = new Image();
    bgImg.src = '/assets/mineur_fou_bg.jpg';
    bgImg.onload = () => { bgImgRef.current = bgImg; };

    const cImg = new Image();
    cImg.src = '/assets/cafe_jojo.png';
    cImg.onload = () => { cafeImgRef.current = cImg; };

    const bImg = new Image();
    bImg.src = '/assets/bureau_des_mines.png';
    bImg.onload = () => { bureauImgRef.current = bImg; };

    const mImg = new Image();
    mImg.src = '/assets/entree_mine.png';
    mImg.onload = () => { mineImgRef.current = mImg; };

    const minerImg = new Image();
    minerImg.src = '/assets/miner_character.png';
    minerImg.onload = () => { minerImgRef.current = minerImg; };

    const minerBackImg = new Image();
    minerBackImg.src = '/assets/miner_back.png';
    minerBackImg.onload = () => { minerBackImgRef.current = minerBackImg; };

    const minerFrontImg = new Image();
    minerFrontImg.src = '/assets/miner_front.png';
    minerFrontImg.onload = () => { minerFrontImgRef.current = minerFrontImg; };

    const ores = ['charbon', 'cuivre', 'argent', 'or'];
    ores.forEach(oreName => {
      const img = new Image();
      img.src = `/assets/ore_${oreName}.png`;
      img.onload = () => { oreImgsRef.current[oreName] = img; };
    });
  }, []);

  // React state (UI driven)
  const [coins, setCoins] = useState(0);
  const [digs, setDigs] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [music, setMusic] = useState(false);
  const [hint, setHint] = useState(null);
  const [modal, setModal] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [qState, setQState] = useState(null);
  const [levelMsg, setLevelMsg] = useState(null);
  const [totalMined, setTotalMined] = useState(0);
  const [qAnswered, setQAnswered] = useState(0);
  const [qCorrect, setQCorrect] = useState(0);

  // Refs (live in rAF loop — no stale closures)
  const playerRef = useRef({ x: 383, y: 358, facing: 'right' });
  const keysRef = useRef({});
  const rafRef = useRef(null);
  const unusedRef = useRef({});
  const audioRef = useRef(null);
  const swingRef = useRef(false);
  const swingTimer = useRef(null);
  const swingStartRef = useRef(0);
  const impactTimerRef = useRef(null);
  const particleRef = useRef([]);
  const ambientRef = useRef([]);
  const hintRef = useRef(null);
  const stRef = useRef({ modal: null, digs: 0, inventory: 0, gameLevel: 1, coins: 0 });

  useEffect(() => {
    stRef.current = { modal, digs, inventory, gameLevel, coins };
  }, [modal, digs, inventory, gameLevel, coins]);

  // Audio setup
  useEffect(() => {
    const a = new Audio('/music/amber_road.m4a');
    a.loop = true;
    a.volume = 0.4;
    audioRef.current = a;
    return () => a.pause();
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (music) {
      a.pause();
      setMusic(false);
    } else {
      a.play().catch(() => {});
      setMusic(true);
    }
  };

  // ── PROCEDURAL WEB AUDIO SYNTHESIZER (PICKAXE DINGS & COIN CHIMES) ───────
  const audioCtxRef = useRef(null);

  const playMiningDing = (lvl) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (lvl === 1) {
        // Charbon (Coal): Deep resonant mineral clink with metallic thud
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(740, now);
        osc1.frequency.exponentialRampToValueAtTime(340, now + 0.22);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1260, now);
        osc2.frequency.exponentialRampToValueAtTime(720, now + 0.25);

        gain.gain.setValueAtTime(0.40, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.28);
        osc2.stop(now + 0.28);
      } else if (lvl === 2) {
        // Cuivre (Copper): Bright warm ringing bronze/copper ping
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(1080, now);
        osc1.frequency.exponentialRampToValueAtTime(780, now + 0.32);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1920, now);
        osc2.frequency.exponentialRampToValueAtTime(1350, now + 0.30);

        gain.gain.setValueAtTime(0.36, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.36);
        osc2.stop(now + 0.36);
      } else if (lvl === 3) {
        // Argent (Silver): High clear crystalline silver chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1520, now);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2580, now);

        gain.gain.setValueAtTime(0.34, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
      } else {
        // Or (Gold): Sparkling resonant golden chime chord (E6 - G#6 - B6)
        const chord = [1318.5, 1661.2, 1975.5, 2637.0];
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.035);

          gain.gain.setValueAtTime(0.25, now + idx * 0.035);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.52);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.035);
          osc.stop(now + idx * 0.035 + 0.52);
        });
      }
    } catch (e) {
      console.warn('playMiningDing audio error:', e);
    }
  };

  const playSellCoinsSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      [987.77, 1318.51, 1567.98].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.24, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.32);
      });
    } catch (e) {}
  };

  // Keyboard controls
  useEffect(() => {
    const dn = (e) => {
      const k = e.key.toLowerCase();
      if (
        ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'space'].includes(k) ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key) ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)
      ) {
        if (!stRef.current.modal) {
          e.preventDefault();
        }
      }
      keysRef.current[k] = true;

      const isSpace = e.code === 'Space' || e.key === ' ' || k === ' ';
      if (isSpace && !stRef.current.modal) {
        e.preventDefault();
        handleInteract();
      }
    };
    const up = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', dn, { passive: false });
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup', up);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Interaction helpers
  const dist = (ax, ay) => Math.hypot(playerRef.current.x - ax, playerRef.current.y - ay);

  const getTarget = () => {
    if (dist(MINE_P.x, MINE_P.y) < I_DIST) return 'mine';
    if (dist(CAFE_P.x, CAFE_P.y) < I_DIST) return 'cafe';
    if (dist(BUREAU_P.x, BUREAU_P.y) < I_DIST) return 'bureau';
    return null;
  };

  const handleInteract = () => {
    const t = getTarget();
    if (t === 'cafe') openQuestion();
    if (t === 'mine') tryDig();
    if (t === 'bureau') setModal('bureau');
  };

  const openQuestion = () => {
    const lvl = stRef.current.gameLevel;
    if (!unusedRef.current[lvl] || unusedRef.current[lvl].length === 0) {
      unusedRef.current[lvl] = [...QUESTIONS[lvl]].sort(() => Math.random() - 0.5);
    }
    const q = unusedRef.current[lvl].pop();
    setCurrentQ(q);
    setQState(null);
    setModal('question');
  };

  const handleAnswer = (idx) => {
    if (qState !== null) return;
    setQAnswered((n) => n + 1);
    if (idx === currentQ.ans) {
      setQState('correct');
      setQCorrect((n) => n + 1);
      setDigs((d) => d + 3);
      setTimeout(() => setModal(null), 1200);
    } else {
      setQState('wrong');
      setTimeout(() => setModal(null), 1800);
    }
  };

  const tryDig = () => {
    const { digs: d, inventory: inv } = stRef.current;
    if (inv >= MAX_INV) {
      setModal('bag_full');
      return;
    }
    if (d <= 0) {
      setModal('no_digs');
      return;
    }
    setDigs((n) => n - 1);
    setInventory((n) => n + 1);
    setTotalMined((n) => n + 1);

    playerRef.current.facing = 'up';
    swingRef.current = true;
    swingStartRef.current = performance.now();
    if (swingTimer.current) clearTimeout(swingTimer.current);
    swingTimer.current = setTimeout(() => {
      swingRef.current = false;
    }, 480);

    const lvl = stRef.current.gameLevel;
    const ore = ORES[lvl - 1];

    if (impactTimerRef.current) clearTimeout(impactTimerRef.current);
    impactTimerRef.current = setTimeout(() => {
      // Trigger mineral ding exactly when pickaxe strikes the rock surface
      playMiningDing(lvl);

      // Fracture rock particles bursting out from the strike point (424, 192)
      particleRef.current = Array.from({ length: 16 }, () => {
        const ang = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.8;
        const spd = Math.random() * 5.2 + 3.0;
        return {
          x: 424 + (Math.random() - 0.5) * 10,
          y: 192 + (Math.random() - 0.5) * 8,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.8,
          life: 1.0,
          size: Math.random() * 4 + 2,
          color: ore.particleColor[Math.floor(Math.random() * ore.particleColor.length)],
        };
      });
    }, 220);
  };

  const sellOre = () => {
    const { inventory: inv, gameLevel: lvl, coins: c } = stRef.current;
    if (inv === 0) return;
    const earned = inv * ORES[lvl - 1].val;
    const newCoins = c + earned;
    setCoins(newCoins);
    setInventory(0);
    setModal(null);
    playSellCoinsSound();

    const thr = ORES[lvl - 1].thr;
    if (newCoins >= thr) {
      if (lvl === 4) {
        setTimeout(() => setModal('victory'), 350);
      } else {
        const nl = lvl + 1;
        setGameLevel(nl);
        unusedRef.current[nl] = [];
        setLevelMsg(`🎉 Niveau ${nl} débloqué ! Vous extrayez maintenant du ${ORES[nl - 1].name} ${ORES[nl - 1].icon}`);
        setTimeout(() => setLevelMsg(null), 4200);
      }
    }
  };

  const resetGame = () => {
    setCoins(0);
    setDigs(0);
    setInventory(0);
    setGameLevel(1);
    setTotalMined(0);
    setQAnswered(0);
    setQCorrect(0);
    if (swingTimer.current) clearTimeout(swingTimer.current);
    if (impactTimerRef.current) clearTimeout(impactTimerRef.current);
    swingRef.current = false;
    swingStartRef.current = 0;
    setModal(null);
    unusedRef.current = {};
    playerRef.current = { x: 383, y: 358, facing: 'right' };
  };

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let last = performance.now();

    const loop = (now) => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      if (!stRef.current.modal) updatePlayer(dt, now);
      drawScene(ctx, now);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (swingTimer.current) clearTimeout(swingTimer.current);
      if (impactTimerRef.current) clearTimeout(impactTimerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update physics & movement
  const updatePlayer = (dt, now) => {
    const p = playerRef.current;
    const k = keysRef.current;
    let dx = 0, dy = 0;
    if (k['arrowup'] || k['w'] || k['z']) dy -= SPEED;
    if (k['arrowdown'] || k['s']) dy += SPEED;
    if (k['arrowleft'] || k['a'] || k['q']) dx -= SPEED;
    if (k['arrowright'] || k['d']) dx += SPEED;

    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx = (dx / len) * SPEED;
      dy = (dy / len) * SPEED;
    }
    dx *= dt;
    dy *= dt;

    if (dy < 0 && Math.abs(dy) >= Math.abs(dx) * 0.8) {
      p.facing = 'up';
    } else if (dy > 0 && Math.abs(dy) >= Math.abs(dx) * 0.8) {
      p.facing = 'down';
    } else if (dx < 0) {
      p.facing = 'left';
    } else if (dx > 0) {
      p.facing = 'right';
    }

    if (p.x > 330 && p.x < 440 && p.y < 315) {
      if (dy > 0) {
        p.facing = 'down';
      } else if (dy < 0 || p.y <= 220) {
        p.facing = 'up';
      }
    }

    const stepX = Math.ceil(Math.abs(dx));
    const sdx = dx / Math.max(1, stepX);
    for (let i = 0; i < stepX; i++) {
      if (walkable(p.x + sdx, p.y)) p.x += sdx;
      else break;
    }
    const stepY = Math.ceil(Math.abs(dy));
    const sdy = dy / Math.max(1, stepY);
    for (let i = 0; i < stepY; i++) {
      if (walkable(p.x, p.y + sdy)) p.y += sdy;
      else break;
    }
    p.x = Math.max(P_SIZE, Math.min(W - P_SIZE, p.x));
    p.y = Math.max(P_SIZE, Math.min(H - P_SIZE, p.y));

    // Digging particles
    particleRef.current = particleRef.current
      .map((pt) => ({
        ...pt,
        x: pt.x + pt.vx,
        y: pt.y + pt.vy + 0.25,
        vy: pt.vy + 0.18,
        life: pt.life - 0.045,
      }))
      .filter((pt) => pt.life > 0);

    // Ambient floating atmospheric motes (spawn gently)
    const lvl = stRef.current.gameLevel;
    const ore = ORES[lvl - 1];
    if (ambientRef.current.length < 18 && Math.random() < 0.25) {
      ambientRef.current.push({
        x: Math.random() * W,
        y: H - Math.random() * 320,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.8 - 0.2,
        life: 1.0,
        decay: Math.random() * 0.008 + 0.004,
        size: Math.random() * 2.5 + 1.2,
        color: ore.particleColor[Math.floor(Math.random() * ore.particleColor.length)],
      });
    }
    ambientRef.current = ambientRef.current
      .map((m) => ({
        ...m,
        x: m.x + m.vx + Math.sin(now / 500 + m.y) * 0.3,
        y: m.y + m.vy,
        life: m.life - m.decay,
      }))
      .filter((m) => m.life > 0 && m.y > 0);

    // Interaction hint
    const t = getTarget();
    let newHint = null;
    if (t === 'cafe') newHint = '☕ ESPACE — Parler à Jojo (gagner des coups de pioche)';
    if (t === 'mine') newHint = `⛏️ ESPACE — Creuser le tas de ${ore.name}`;
    if (t === 'bureau') newHint = '⚖️ ESPACE — Vendre le minerai au Bureau des Mines';
    if (newHint !== hintRef.current) {
      hintRef.current = newHint;
      setHint(newHint);
    }
  };

  // ── DRAWING LOGIC (STORYBOOK GOUACHE & INK ART STYLE) ─────────────────────
  const drawScene = (ctx, t) => {
    const lvl = stRef.current.gameLevel;
    const ore = ORES[lvl - 1];
    const p = playerRef.current;

    // Camera micro-shake on pickaxe impact
    const swingElapsed = t - swingStartRef.current;
    const isImpact = swingElapsed >= 210 && swingElapsed <= 320;
    let shakeX = 0, shakeY = 0;
    if (isImpact) {
      const shakeDecay = 1 - (swingElapsed - 210) / 110;
      const shakeMag = shakeDecay * 2.2;
      shakeX = Math.sin(swingElapsed * 0.6) * shakeMag;
      shakeY = Math.cos(swingElapsed * 0.7) * shakeMag;
    }

    ctx.save();
    if (shakeX !== 0 || shakeY !== 0) {
      ctx.translate(shakeX, shakeY);
    }

    // 1. SCENE BACKGROUND (High-res painted Disney 1991 storybook background or procedural fallback)
    const bg = bgImgRef.current;
    const hasBg = bg && bg.complete && bg.naturalWidth > 0;

    if (hasBg) {
      ctx.drawImage(bg, 0, 0, W, H);
    } else {
      // Procedural fallback: Layered gouache sky, clouds, mountains, and paths
      const sky = ctx.createLinearGradient(0, 0, 0, 320);
      sky.addColorStop(0.0, ore.skyTop);
      sky.addColorStop(0.45, ore.skyMid);
      sky.addColorStop(1.0, ore.skyBottom);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Distant watercolor cloud washes
      ctx.save();
      drawStorybookClouds(ctx, ore, t);
      ctx.restore();

      // Vosges mountains & rolling hills
      drawStorybookHills(ctx, ore);

      // Mine hill terrace & stone embankment
      drawMineTerrace(ctx, ore);

      // Storybook cobblestone pathway
      drawStorybookPath(ctx, ore);

      // Mine rail tracks
      drawMineTracks(ctx);

      // Ambient lantern pools on ground
      drawGroundLanternGlow(ctx, 126, 355, 48, 'rgba(251, 191, 36, 0.28)'); // Café Jojo
      drawGroundLanternGlow(ctx, 662, 355, 42, 'rgba(251, 191, 36, 0.25)'); // Bureau
      drawGroundLanternGlow(ctx, 383, 202, 36, 'rgba(251, 191, 36, 0.32)'); // Mine mouth

      // Sprite buildings
      drawCafe(ctx, t);
      drawBureau(ctx, t);
      drawMine(ctx, ore, t);
    }

    // Dynamic guidepost sign
    drawJunctionSign(ctx);

    // Dynamic ore pile (overlays when ore is upgraded to copper/silver/gold or during pickaxe strikes)
    if (!hasBg || ore.id >= 2 || (t - swingStartRef.current >= 215 && t - swingStartRef.current <= 310)) {
      drawOrePile(ctx, ore, t);
    }

    // 9. DIGGING BURST PARTICLES
    ctx.save();
    particleRef.current.forEach((pt) => {
      ctx.globalAlpha = pt.life;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size || 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 10. AMBIENT DRIFTING PARTICLES (Level theme infused)
    ctx.save();
    ambientRef.current.forEach((m) => {
      ctx.globalAlpha = m.life * 0.75;
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 11. PLAYER CHARACTER
    drawMiner(ctx, p, t);

    // 12. FULL SCENE COLOR INFUSION OVERLAY (Atmospheric tint per level)
    ctx.save();
    ctx.fillStyle = ore.tint;
    ctx.fillRect(0, 0, W, H);
    // Soft cinematic vignette
    const vig = ctx.createRadialGradient(W / 2, H / 2, 280, W / 2, H / 2, 540);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(15, 23, 42, 0.28)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
    ctx.restore(); // color infusion
    ctx.restore(); // camera shake
  };

  // ── BACKGROUND SUB-RENDERERS ──────────────────────────────────────────────
  const drawStorybookClouds = (ctx, ore, t) => {
    const cloudCol = 'rgba(255, 255, 255, 0.22)';
    ctx.fillStyle = cloudCol;

    const drift = (t / 80) % (W + 200) - 100;
    // Cloud group 1
    ctx.beginPath();
    ctx.arc(140 + (drift * 0.4) % W, 65, 34, 0, Math.PI * 2);
    ctx.arc(175 + (drift * 0.4) % W, 55, 45, 0, Math.PI * 2);
    ctx.arc(215 + (drift * 0.4) % W, 68, 30, 0, Math.PI * 2);
    ctx.fill();

    // Cloud group 2
    ctx.beginPath();
    ctx.arc(520 + (drift * 0.6) % W, 85, 38, 0, Math.PI * 2);
    ctx.arc(560 + (drift * 0.6) % W, 72, 48, 0, Math.PI * 2);
    ctx.arc(605 + (drift * 0.6) % W, 88, 32, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawStorybookHills = (ctx, ore) => {
    ctx.save();

    // Far mountain ridgeline (distant soft silhouettes with ink edge)
    ctx.fillStyle = ore.hillFar;
    ctx.strokeStyle = 'rgba(20, 20, 30, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.bezierCurveTo(90, 140, 180, 145, 270, 185);
    ctx.bezierCurveTo(360, 130, 460, 120, 560, 175);
    ctx.bezierCurveTo(650, 135, 730, 145, 800, 180);
    ctx.lineTo(800, 340);
    ctx.lineTo(0, 340);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mid-ground rolling pastoral hills (gouache wash + gentle pine trees)
    ctx.fillStyle = ore.hillMid;
    ctx.strokeStyle = 'rgba(25, 30, 20, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 225);
    ctx.bezierCurveTo(110, 175, 210, 180, 310, 215);
    ctx.bezierCurveTo(400, 180, 500, 170, 600, 210);
    ctx.bezierCurveTo(690, 175, 750, 185, 800, 215);
    ctx.lineTo(800, 400);
    ctx.lineTo(0, 400);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Distant storybook pine trees on ridge
    ctx.fillStyle = 'rgba(20, 35, 25, 0.55)';
    const pines = [45, 75, 110, 160, 640, 680, 725, 765];
    pines.forEach((px) => {
      ctx.beginPath();
      ctx.moveTo(px, 178);
      ctx.lineTo(px - 6, 196);
      ctx.lineTo(px + 6, 196);
      ctx.closePath();
      ctx.fill();
    });

    // Near rolling meadow ground (extends across whole base)
    ctx.fillStyle = ore.grass;
    ctx.fillRect(0, 230, W, H - 230);

    // Warm gouache grass texturing / meadow patches
    ctx.fillStyle = ore.grassHi;
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      const gx = 60 + i * 80;
      const gy = 260 + (i % 3) * 45;
      ctx.ellipse(gx, gy, 48, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawMineTerrace = (ctx, ore) => {
    ctx.save();

    // Natural stone terrace wall supporting the mine terrace
    ctx.fillStyle = '#6b7280';
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1.5;

    const wallY = 195;
    const wallLeft = 240;
    const wallRight = 526;
    ctx.beginPath();
    ctx.roundRect(wallLeft, wallY, wallRight - wallLeft, 14, [4]);
    ctx.fill();
    ctx.stroke();

    // Individual stone mortar lines on the terrace wall
    for (let sx = wallLeft + 20; sx < wallRight - 10; sx += 24) {
      ctx.beginPath();
      ctx.moveTo(sx, wallY);
      ctx.lineTo(sx, wallY + 14);
      ctx.stroke();
    }

    // Moss & ivy patches draping over wall
    ctx.fillStyle = '#365314';
    for (let ix = wallLeft + 15; ix < wallRight - 20; ix += 48) {
      ctx.beginPath();
      ctx.arc(ix, wallY + 14, 5, 0, Math.PI);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawStorybookPath = (ctx, ore) => {
    ctx.save();

    WALK.forEach((z) => {
      // 1. Dirt / gravel foundation with warm earthen undertone
      ctx.fillStyle = ore.pathBase;
      ctx.fillRect(z.x - 3, z.y - 3, z.w + 6, z.h + 6);

      // 2. Hand-crafted cobblestone flagstones
      const stoneW = 20;
      const stoneH = 13;
      const mortarColor = ore.pathMortar;
      const stoneColors = [ore.pathStone, ore.pathBase, ore.hi];

      for (let py = z.y; py < z.y + z.h; py += stoneH + 3) {
        const rowIdx = Math.floor((py - z.y) / (stoneH + 3));
        const rowOffset = (rowIdx % 2 === 0) ? 0 : (stoneW / 2);

        for (let px = z.x - stoneW; px < z.x + z.w + stoneW; px += stoneW + 4) {
          const cx = px + rowOffset;
          if (cx + stoneW < z.x || cx > z.x + z.w) continue;

          const clampedX = Math.max(z.x, cx);
          const clampedW = Math.min(z.x + z.w - clampedX, stoneW);

          // Randomly selected earthy stone tint
          const seed = Math.abs(Math.sin(clampedX * 12.9898 + py * 78.233));
          ctx.fillStyle = stoneColors[Math.floor(seed * stoneColors.length)];

          // Organic rounded stone
          ctx.beginPath();
          ctx.roundRect(clampedX, py, clampedW, stoneH, [3]);
          ctx.fill();

          // Ink outline
          ctx.strokeStyle = mortarColor;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Top highlight edge (Storybook gouache glint)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.fillRect(clampedX + 2, py + 1, clampedW - 4, 1.8);
        }
      }

      // 3. Dirt verge shadows along borders
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.fillRect(z.x, z.y, z.w, 3.5);
      ctx.fillRect(z.x, z.y + z.h - 3.5, z.w, 3.5);

      // 4. Wildflower & clover clusters along road margins
      drawWildflowerTufts(ctx, z);
    });

    ctx.restore();
  };

  const drawWildflowerTufts = (ctx, z) => {
    // Top border flowers
    const flowerColors = ['#ef4444', '#3b82f6', '#facc15', '#ffffff'];
    for (let fx = z.x + 8; fx < z.x + z.w; fx += 38) {
      const seed = Math.abs(Math.sin(fx * 31.41));
      // Grass blade
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.moveTo(fx, z.y);
      ctx.lineTo(fx - 3, z.y - 6);
      ctx.lineTo(fx + 2, z.y);
      ctx.fill();

      // Flower petal
      if (seed > 0.35) {
        ctx.fillStyle = flowerColors[Math.floor(seed * flowerColors.length)];
        ctx.beginPath();
        ctx.arc(fx - 2, z.y - 7, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Bottom border flowers
    for (let fx = z.x + 16; fx < z.x + z.w; fx += 42) {
      const seed = Math.abs(Math.sin(fx * 17.13));
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.moveTo(fx, z.y + z.h);
      ctx.lineTo(fx + 3, z.y + z.h + 6);
      ctx.lineTo(fx - 2, z.y + z.h);
      ctx.fill();

      if (seed > 0.4) {
        ctx.fillStyle = flowerColors[Math.floor(seed * flowerColors.length)];
        ctx.beginPath();
        ctx.arc(fx + 3, z.y + z.h + 7, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawMineTracks = (ctx) => {
    ctx.save();
    // Steel rails extending from mine mouth (y = 208 down to junction y = 320)
    const rx1 = 371;
    const rx2 = 395;
    const ty1 = 208;
    const ty2 = 320;

    // Wooden railway sleepers / ties
    ctx.fillStyle = '#543d2b';
    ctx.strokeStyle = '#2b1810';
    ctx.lineWidth = 1;
    for (let sy = ty1 + 8; sy < ty2; sy += 12) {
      ctx.beginPath();
      ctx.roundRect(rx1 - 6, sy, rx2 - rx1 + 12, 4, [1]);
      ctx.fill();
      ctx.stroke();
    }

    // Steel rails
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(rx1, ty1);
    ctx.lineTo(rx1, ty2);
    ctx.moveTo(rx2, ty1);
    ctx.lineTo(rx2, ty2);
    ctx.stroke();

    // Rail specular glint
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rx1 - 0.5, ty1);
    ctx.lineTo(rx1 - 0.5, ty2);
    ctx.moveTo(rx2 - 0.5, ty1);
    ctx.lineTo(rx2 - 0.5, ty2);
    ctx.stroke();

    ctx.restore();
  };

  const drawJunctionSign = (ctx) => {
    ctx.save();
    const jx = 338;
    const jy = 326;

    // Wooden post
    ctx.fillStyle = '#6c4a27';
    ctx.strokeStyle = '#35210e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(jx, jy - 22, 5, 26, [1]);
    ctx.fill();
    ctx.stroke();

    // Signboard plank: Mine
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(jx - 16, jy - 30, 36, 10, [2]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('↑ LA MINE', jx + 2, jy - 23);

    ctx.restore();
  };

  const drawGroundLanternGlow = (ctx, gx, gy, radius, color) => {
    ctx.save();
    const glow = ctx.createRadialGradient(gx, gy, 2, gx, gy, radius);
    glow.addColorStop(0, color);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(gx, gy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // ── SPRITE BUILDINGS & ORE PILE ───────────────────────────────────────────
  const drawCafe = (ctx, t) => {
    const img = cafeImgRef.current;
    // Sprite dimensions preserving ~0.90 aspect ratio
    const w = 206;
    const h = 230;
    const x = 24;
    const y = 138;

    // Soft grounded contact drop shadow
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h - 8, w * 0.46, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, x, y, w, h);
    } else {
      // Storybook fallback facade
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(x + 15, y + 40, w - 30, h - 40);
    }
  };

  const drawBureau = (ctx, t) => {
    const img = bureauImgRef.current;
    // Sprite dimensions preserving ~1.78 aspect ratio
    const w = 246;
    const h = 138;
    const x = 540;
    const y = 222;

    // Ground contact shadow
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h - 6, w * 0.48, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, x, y, w, h);
    } else {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x + 15, y + 30, w - 30, h - 30);
    }
  };

  const drawMine = (ctx, ore, t) => {
    const img = mineImgRef.current;
    // Sprite dimensions preserving ~2.23 aspect ratio
    const w = 270;
    const h = 121;
    const x = 383 - w / 2; // 248
    const y = 92;

    // Contact shadow
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.beginPath();
    ctx.ellipse(383, y + h - 4, w * 0.42, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, x, y, w, h);
    } else {
      ctx.fillStyle = '#5c4033';
      ctx.fillRect(285, 92, 195, 120);
    }
  };

  const drawOrePile = (ctx, ore, t) => {
    const oreKey = ore.key || 'charbon';
    const img = oreImgsRef.current ? oreImgsRef.current[oreKey] : null;

    // Placed next to the mine tracks at the shaft platform
    const w = 84;
    const h = 38;
    const x = 406;
    const y = 176;

    // Soft ore pile ground contact shadow
    ctx.save();
    ctx.fillStyle = 'rgba(10, 15, 25, 0.55)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h - 4, w * 0.44, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Subtle rock compression/jolt when struck by pickaxe
    const swingElapsed = t - swingStartRef.current;
    const isOreImpact = swingElapsed >= 215 && swingElapsed <= 310;
    const rockJolt = isOreImpact ? Math.sin((swingElapsed - 215) * 0.25) * 1.5 : 0;

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, x + rockJolt, y, w, h);
    } else {
      ctx.fillStyle = ore.col;
      ctx.beginPath();
      ctx.ellipse(x + w / 2 + rockJolt, y + h / 2, 32, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shimmer sparkle glint on precious ores (Levels 2-4)
    if (ore.id >= 2) {
      ctx.save();
      const sparkle = (Math.sin(t / 220) + 1) * 0.5;
      ctx.globalAlpha = sparkle * 0.85;
      ctx.fillStyle = ore.hi;
      ctx.beginPath();
      ctx.arc(x + 28, y + 14, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 56, y + 20, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  // ── FORWARD KINEMATICS ANIMATED LEGS (DISNEY 18TH-CENTURY MINER) ──────────
  const drawLegSideView = (ctx, hipX, hipY, thighAng, shinAng, pantCol, bootCol, isFar, stride) => {
    const thighLen = 13.5;
    const shinLen = 13.5;

    const kneeX = hipX + Math.sin(thighAng) * thighLen;
    const kneeY = hipY + Math.cos(thighAng) * thighLen;

    const ankleX = kneeX + Math.sin(shinAng) * shinLen;
    const ankleY = kneeY + Math.cos(shinAng) * shinLen;

    ctx.save();

    // 1. Thigh (Breeches / Trousers)
    ctx.fillStyle = pantCol;
    ctx.strokeStyle = isFar ? '#2e1e19' : '#3e2723';
    ctx.lineWidth = 1;

    const tw0 = 4.4, tw1 = 3.2; // half-widths at hip and knee
    const tPerpX = Math.cos(thighAng);
    const tPerpY = -Math.sin(thighAng);

    ctx.beginPath();
    ctx.moveTo(hipX - tPerpX * tw0, hipY - tPerpY * tw0);
    ctx.lineTo(hipX + tPerpX * tw0, hipY + tPerpY * tw0);
    ctx.lineTo(kneeX + tPerpX * tw1, kneeY + tPerpY * tw1);
    ctx.lineTo(kneeX - tPerpX * tw1, kneeY - tPerpY * tw1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Knee gather cuff band
    ctx.fillStyle = isFar ? '#2e1e19' : '#4a3525';
    ctx.beginPath();
    ctx.ellipse(kneeX, kneeY, 3.4, 2.2, thighAng, 0, Math.PI * 2);
    ctx.fill();

    // 2. Shin / Hose
    const sw0 = 2.8, sw1 = 2.4;
    const sPerpX = Math.cos(shinAng);
    const sPerpY = -Math.sin(shinAng);

    ctx.fillStyle = pantCol;
    ctx.beginPath();
    ctx.moveTo(kneeX - sPerpX * sw0, kneeY - sPerpY * sw0);
    ctx.lineTo(kneeX + sPerpX * sw0, kneeY + sPerpY * sw0);
    ctx.lineTo(ankleX + sPerpX * sw1, ankleY + sPerpY * sw1);
    ctx.lineTo(ankleX - sPerpX * sw1, ankleY - sPerpY * sw1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Leather Mining Boot
    const footLift = stride > 0.2 ? (stride - 0.2) * 0.35 : 0;
    const bootRot = shinAng + footLift;

    ctx.save();
    ctx.translate(ankleX, ankleY);
    ctx.rotate(bootRot);

    // Boot top collar
    ctx.fillStyle = isFar ? '#261f1c' : '#362d28';
    ctx.fillRect(-3, -4, 6.5, 4);

    // Brass buckle on outer cuff
    if (!isFar) {
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(1.5, -3, 1.8, 2);
    }

    // Main boot body (heel to instep to toe cap)
    ctx.fillStyle = bootCol;
    ctx.beginPath();
    ctx.moveTo(-3, -2);
    ctx.lineTo(4, -2);       // instep
    ctx.lineTo(8.5, 0.5);    // toe top
    ctx.lineTo(8.5, 2.5);    // toe front
    ctx.lineTo(-3, 2.5);     // sole line
    ctx.closePath();
    ctx.fill();

    // Thick leather work sole
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-3, 2, 11.5, 1.8);

    // Block heel
    ctx.fillStyle = '#261208';
    ctx.fillRect(-3, 3, 3.8, 1.5);

    // Specular leather glint
    if (!isFar) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.ellipse(5.5, 0.5, 2.2, 1, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.restore();
  };

  const drawLegVertical = (ctx, hipX, hipY, lift, tilt, pantCol, bootCol, isLeft) => {
    const kneeY = hipY + 13 - lift * 0.4;
    const ankleY = hipY + 26 - lift;
    const kneeX = hipX + (isLeft ? -1 : 1) * (lift > 1 ? 1.5 : 0);
    const ankleX = hipX + tilt * 8;

    ctx.save();
    // Thigh
    ctx.fillStyle = pantCol;
    ctx.strokeStyle = '#2d1e19';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hipX - 3.8, hipY);
    ctx.lineTo(hipX + 3.8, hipY);
    ctx.lineTo(kneeX + 3.2, kneeY);
    ctx.lineTo(kneeX - 3.2, kneeY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Trouser center seam from behind
    ctx.strokeStyle = '#2d1e19';
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(kneeX, kneeY);
    ctx.stroke();

    // Shin
    ctx.beginPath();
    ctx.moveTo(kneeX - 3, kneeY);
    ctx.lineTo(kneeX + 3, kneeY);
    ctx.lineTo(ankleX + 2.6, ankleY);
    ctx.lineTo(ankleX - 2.6, ankleY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Boot back & heel
    ctx.save();
    ctx.translate(ankleX, ankleY);
    ctx.rotate(tilt * 0.5);

    ctx.fillStyle = '#362d28';
    ctx.fillRect(-2.8, -3, 5.6, 3);

    ctx.fillStyle = bootCol;
    ctx.beginPath();
    ctx.moveTo(-2.8, -1);
    ctx.lineTo(2.8, -1);
    ctx.lineTo(3.2, 2.5);
    ctx.lineTo(-3.2, 2.5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#451a03';
    ctx.fillRect(-3.4, 2.5, 6.8, 1.8);
    ctx.fillStyle = '#261208';
    ctx.fillRect(-2.5, 3.5, 5, 1.5);

    ctx.restore();
    ctx.restore();
  };

  const drawLegFrontView = (ctx, hipX, hipY, lift, tilt, pantCol, bootCol, isLeft) => {
    const kneeY = hipY + 13 - lift * 0.4;
    const ankleY = hipY + 26 - lift;
    const kneeX = hipX + (isLeft ? -1 : 1) * (lift > 1 ? 1.5 : 0);
    const ankleX = hipX + tilt * 8;

    ctx.save();
    // Thigh
    ctx.fillStyle = pantCol;
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hipX - 3.8, hipY);
    ctx.lineTo(hipX + 3.8, hipY);
    ctx.lineTo(kneeX + 3.2, kneeY);
    ctx.lineTo(kneeX - 3.2, kneeY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Shin
    ctx.beginPath();
    ctx.moveTo(kneeX - 3, kneeY);
    ctx.lineTo(kneeX + 3, kneeY);
    ctx.lineTo(ankleX + 2.6, ankleY);
    ctx.lineTo(ankleX - 2.6, ankleY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Boot front & toe cap
    ctx.save();
    ctx.translate(ankleX, ankleY);
    ctx.rotate(tilt * 0.4);

    // Boot cuff
    ctx.fillStyle = '#362d28';
    ctx.fillRect(-3, -3, 6, 3);

    // Brass buckle on cuff
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(isLeft ? -2 : 0.8, -2.5, 1.5, 1.8);

    // Boot body facing forward
    ctx.fillStyle = bootCol;
    ctx.beginPath();
    ctx.ellipse(0, 0.5, 3.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Toe cap highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(0, 0.8, 2, 0, Math.PI);
    ctx.fill();

    // Sole bottom
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-3.6, 2.5, 7.2, 1.8);

    ctx.restore();
    ctx.restore();
  };

  const drawMinerLegs = (ctx, isBack, isFront, moving, t, isSwinging) => {
    const walkCycle = t / 105;
    const stridePhase = moving ? walkCycle : 0;

    const pantBase = '#5c4033';
    const pantDark = '#3e2723';
    const bootBody = '#241e1b';
    const bootDark = '#181412';

    if (isSwinging) {
      // Mining strike stance: grounded, wide-braced footing
      const hipL = -8, hipR = 8, hipY = -27;
      drawLegVertical(ctx, hipL, hipY, 0, -0.15, pantDark, bootDark, true);
      drawLegVertical(ctx, hipR, hipY, 0, 0.12, pantBase, bootBody, false);
      return;
    }

    if (isBack) {
      // Back view (walking up to the mine)
      const hipL = -7, hipR = 7, hipY = -27;
      const stepL = moving ? Math.sin(stridePhase) : 0;
      const stepR = moving ? Math.sin(stridePhase + Math.PI) : 0;
      const liftL = Math.max(0, stepL) * 5.5;
      const liftR = Math.max(0, stepR) * 5.5;

      drawLegVertical(ctx, hipL, hipY, liftL, stepL * 0.12, pantDark, bootDark, true);
      drawLegVertical(ctx, hipR, hipY, liftR, stepR * 0.12, pantBase, bootBody, false);
    } else if (isFront) {
      // Front view (walking down from the mine)
      const hipL = -7, hipR = 7, hipY = -27;
      const stepL = moving ? Math.sin(stridePhase) : 0;
      const stepR = moving ? Math.sin(stridePhase + Math.PI) : 0;
      const liftL = Math.max(0, stepL) * 5.5;
      const liftR = Math.max(0, stepR) * 5.5;

      drawLegFrontView(ctx, hipL, hipY, liftL, stepL * 0.12, pantBase, bootBody, true);
      drawLegFrontView(ctx, hipR, hipY, liftR, stepR * 0.12, pantBase, bootBody, false);
    } else {
      // Side view (walking horizontally)
      const hipXB = -2, hipYB = -27;
      const hipXF = 3,  hipYF = -27;

      const strideF = moving ? Math.sin(stridePhase) : 0;
      const strideB = moving ? Math.sin(stridePhase + Math.PI) : 0;

      // Back leg (far leg)
      const thighAngB = strideB * 0.44;
      const bendB = moving ? Math.max(0, -Math.sin(stridePhase + Math.PI - 0.35)) * 0.75 : 0;
      const shinAngB = thighAngB - bendB;
      drawLegSideView(ctx, hipXB, hipYB, thighAngB, shinAngB, pantDark, bootDark, true, strideB);

      // Front leg (near leg)
      const thighAngF = strideF * 0.44;
      const bendF = moving ? Math.max(0, -Math.sin(stridePhase - 0.35)) * 0.75 : 0;
      const shinAngF = thighAngF - bendF;
      drawLegSideView(ctx, hipXF, hipYF, thighAngF, shinAngF, pantBase, bootBody, false, strideF);
    }
  };

  // ── DISNEY-STYLE PICKAXE CARRIED AT MIDDLE & STRIKING ANIMATIONS ───────────
  const drawPickaxeAndStrike = (ctx, isBack, isFront, flip, swingElapsed, moving, t) => {
    const isSwinging = swingElapsed >= 0 && swingElapsed < 480;
    const prog = isSwinging ? Math.min(1, Math.max(0, swingElapsed / 480)) : 0;

    // Natural arm sway when walking or gentle breathing sway when idle
    const armSway = moving ? Math.sin(t / 105) * 0.28 : Math.sin(t / 550) * 0.04;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. OPPOSITE ARM (LEFT ARM) — Counter-sways naturally in reverse phase
    // ─────────────────────────────────────────────────────────────────────────
    if (!isSwinging) {
      ctx.save();
      const oppSway = -armSway;
      const shoulderLX = isBack ? -11 : isFront ? -11 : -4;
      const shoulderLY = -46;
      const handLX = shoulderLX + Math.sin(oppSway) * 12;
      const handLY = shoulderLY + Math.cos(oppSway) * 12;

      // Opposite coat sleeve
      ctx.strokeStyle = '#22303f';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(shoulderLX, shoulderLY);
      ctx.lineTo(handLX, handLY);
      ctx.stroke();

      // White linen cuff
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(handLX, handLY, 2.2, 3.2, oppSway, 0, Math.PI * 2);
      ctx.fill();

      // Relaxed hand
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(handLX - 0.5, handLY + 1, 2.4, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. TWO-HANDED POWER STRIKE (WHEN DIGGING AT THE MINE)
    // ─────────────────────────────────────────────────────────────────────────
    if (isSwinging) {
      const px0 = isBack ? 11 : 8;
      const py0 = -46;

      let angle;
      let showSwoosh = false;
      let swooshStart = -1.85;
      let showImpact = false;
      let impactProg = 0;

      if (prog < 0.38) {
        // Phase 1: Wind-up overhead
        const p1 = prog / 0.38;
        const easeP1 = Math.sin((p1 * Math.PI) / 2);
        angle = -1.15 + (-2.05 - -1.15) * easeP1;
      } else if (prog < 0.52) {
        // Phase 2: Power downswing with swoosh arc
        const p2 = (prog - 0.38) / 0.14;
        const easeP2 = p2 * p2;
        angle = -2.05 + (0.68 - -2.05) * easeP2;
        showSwoosh = true;
        swooshStart = -1.85;
      } else if (prog < 0.70) {
        // Phase 3: Impact shudder into rock face
        const p3 = (prog - 0.52) / 0.18;
        const recoil = Math.sin(p3 * Math.PI * 6) * 0.05 * (1 - p3);
        angle = 0.68 + recoil;
        showImpact = true;
        impactProg = p3;
      } else {
        // Phase 4: Recovery
        const p4 = (prog - 0.70) / 0.30;
        const easeP4 = Math.sin((p4 * Math.PI) / 2);
        angle = 0.68 + (-1.15 - 0.68) * easeP4;
      }

      // Swoosh motion trail arc
      if (showSwoosh) {
        ctx.save();
        ctx.translate(px0, py0);
        const arcGrad = ctx.createLinearGradient(
          Math.cos(swooshStart) * 38,
          Math.sin(swooshStart) * 38,
          Math.cos(angle) * 38,
          Math.sin(angle) * 38
        );
        arcGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
        arcGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.42)');
        arcGrad.addColorStop(1, 'rgba(255, 255, 255, 0.88)');

        ctx.strokeStyle = arcGrad;
        ctx.lineWidth = 5.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 0, 38, swooshStart, angle);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, 40.5, swooshStart + 0.3, angle);
        ctx.stroke();
        ctx.restore();
      }

      // Full two-handed swinging pickaxe
      ctx.save();
      ctx.translate(px0, py0);
      ctx.rotate(angle);

      // Miner's coat sleeve
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-4, 2);
      ctx.lineTo(8, 0);
      ctx.stroke();

      // White linen cuff
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(8, 0, 2.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Primary hand
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(10, 0, 3, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Secondary hand for power grip
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(18, 0, 2.8, 2.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wooden handle
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-6, -2, 3, 4);
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(-3, -2, 38, 4);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-3, -2, 38, 1.2);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-3, 0.8, 38, 1.2);

      // Forged iron eye collar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(32, -3, 3.5, 6);

      // Pickaxe head
      ctx.fillStyle = '#334155';
      ctx.fillRect(33, -3.5, 3, 7);

      // Striking pick blade
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(33, 2);
      ctx.bezierCurveTo(34, 7, 36, 11, 38, 15);
      ctx.bezierCurveTo(36, 11, 35, 6, 36, 2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(33, 2);
      ctx.bezierCurveTo(34, 7, 36, 11, 38, 15);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(38, 15, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Counterbalance adze
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(33, -2);
      ctx.lineTo(31, -9);
      ctx.lineTo(35, -9);
      ctx.lineTo(36, -2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // Impact starburst & shockwave
      if (showImpact) {
        const tipDist = 41;
        const tipAng = angle + 0.36;
        const tipX = px0 + Math.cos(tipAng) * tipDist;
        const tipY = py0 + Math.sin(tipAng) * tipDist;

        ctx.save();
        ctx.translate(tipX, tipY);
        const ringAlpha = Math.max(0, (1 - impactProg) * 0.95);
        const ringW = 4 + impactProg * 24;
        const ringH = 2 + impactProg * 12;

        ctx.strokeStyle = `rgba(254, 240, 138, ${ringAlpha})`;
        ctx.lineWidth = Math.max(1, 3 * (1 - impactProg));
        ctx.beginPath();
        ctx.ellipse(0, 0, ringW, ringH, 0.2, 0, Math.PI * 2);
        ctx.stroke();

        if (impactProg < 0.5) {
          const flashAlpha = 1 - impactProg / 0.5;
          const flashR = (1 - impactProg * 0.8) * 15;

          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          ctx.beginPath();
          ctx.moveTo(0, -flashR * 1.3);
          ctx.lineTo(flashR * 0.25, -flashR * 0.25);
          ctx.lineTo(flashR * 1.3, 0);
          ctx.lineTo(flashR * 0.25, flashR * 0.25);
          ctx.lineTo(0, flashR * 1.3);
          ctx.lineTo(-flashR * 0.25, flashR * 0.25);
          ctx.lineTo(-flashR * 1.3, 0);
          ctx.lineTo(-flashR * 0.25, -flashR * 0.25);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = `rgba(253, 224, 71, ${flashAlpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(0, 0, flashR * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = `rgba(254, 240, 138, ${(1 - impactProg) * 0.9})`;
        ctx.lineWidth = 1.5;
        for (let s = 0; s < 6; s++) {
          const sAng = -Math.PI * 0.75 + (s / 5) * Math.PI * 1.0;
          const sDist = 5 + impactProg * 18;
          ctx.beginPath();
          ctx.moveTo(Math.cos(sAng) * (sDist * 0.4), Math.sin(sAng) * (sDist * 0.4));
          ctx.lineTo(Math.cos(sAng) * sDist, Math.sin(sAng) * sDist);
          ctx.stroke();
        }
        ctx.restore();
      }
      return;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. HOLDING THE MIDDLE OF THE PICKAXE WHILE WALKING OR IDLE
    // ─────────────────────────────────────────────────────────────────────────
    const shoulderX = isBack ? 11 : isFront ? 11 : 6;
    const shoulderY = -46;

    // Arm sways naturally with walking stride
    const armLen = isBack || isFront ? 13 : 14;
    const handX = shoulderX + Math.sin(armSway) * (isBack || isFront ? 6 : armLen);
    const handY = shoulderY + (isBack || isFront ? 14 + Math.cos(armSway) * 2 : Math.cos(armSway) * armLen);

    ctx.save();
    // Arm sleeve
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    // Ruffled white linen cuff
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(handX, handY, 2.4, 3.4, armSway, 0, Math.PI * 2);
    ctx.fill();

    // Anchor at hand — Pickaxe held at the MIDDLE of its handle
    ctx.save();
    ctx.translate(handX, handY);

    // Natural carry tilt that sways gently with the arm motion
    const pickTilt = isBack
      ? -0.75 + armSway * 0.5
      : isFront
      ? -0.42 + armSway * 0.5
      : -0.38 + armSway * 0.7;
    ctx.rotate(pickTilt);

    // ── REAR HALF OF HANDLE (Extends from x = -19 to 0 behind the hand) ───────
    // Brass butt-cap pommel
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-19, -2, 3, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-18.5, -2, 1, 4);

    // Rear wooden haft
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(-16, -2, 16, 4);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-16, -2, 16, 1.2);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-16, 0.8, 16, 1.2);

    // ── FRONT HALF OF HANDLE (Extends from x = 0 to +19 in front of the hand) ──
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(0, -2, 16, 4);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, -2, 16, 1.2);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 0.8, 16, 1.2);

    // Forged iron eye collar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(15, -2.8, 3, 5.6);

    // ── FORGED STEEL DOUBLE HEAD (Mounted at x = 17) ─────────────────────────
    ctx.fillStyle = '#334155';
    ctx.fillRect(16, -3.5, 3, 7);

    // Striking Pick Blade
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.bezierCurveTo(17, 6, 19, 10, 21, 14); // sharp pick tip
    ctx.bezierCurveTo(19, 9, 18, 5, 19, 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.bezierCurveTo(17, 6, 19, 10, 21, 14);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(21, 14, 1.1, 0, Math.PI * 2);
    ctx.fill();

    // Counterbalance Adze
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(16, -2);
    ctx.lineTo(14, -8);
    ctx.lineTo(17.5, -8);
    ctx.lineTo(19, -2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // ── MINER'S HAND WRAPPED OVER THE MIDDLE OF THE HAFT (x = 0) ─────────────
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, 0, 3.4, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Knuckle creases
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-1, -1.5);
    ctx.lineTo(1.5, -1.5);
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  };

  // ── DISNEY-STYLE MINER CHARACTER SPRITE & ANIMATIONS ──────────────────────
  const drawMiner = (ctx, p, t) => {
    const k = keysRef.current;
    const moving =
      k['arrowup'] ||
      k['arrowdown'] ||
      k['arrowleft'] ||
      k['arrowright'] ||
      k['w'] ||
      k['s'] ||
      k['a'] ||
      k['d'] ||
      k['z'] ||
      k['q'];

    const isBack = p.facing === 'up';
    const isFront = p.facing === 'down';

    // Choose active sprite
    let img;
    let w = 48;
    const h = 76;

    if (isBack) {
      img = minerBackImgRef.current || minerImgRef.current;
      w = 38;
    } else if (isFront) {
      img = minerFrontImgRef.current || minerImgRef.current;
      w = 38;
    } else {
      img = minerImgRef.current;
      w = 48;
    }

    const swingElapsed = t - swingStartRef.current;
    const isSwinging = swingElapsed >= 0 && swingElapsed < 480;
    const swingProg = isSwinging ? Math.min(1, Math.max(0, swingElapsed / 480)) : 0;

    // Body posture response during pickaxe strike
    let swingTilt = 0;
    let swingY = 0;
    if (isSwinging) {
      if (swingProg < 0.38) {
        // Wind-up: body coils back slightly and lifts
        const p1 = swingProg / 0.38;
        const easeP1 = Math.sin((p1 * Math.PI) / 2);
        swingTilt = (isBack ? -0.12 : -0.16) * easeP1;
        swingY = -4 * easeP1;
      } else if (swingProg < 0.52) {
        // Power downswing: body lunges forward and drives down
        const p2 = (swingProg - 0.38) / 0.14;
        const easeP2 = p2 * p2;
        swingTilt = (isBack ? -0.12 : -0.16) + ((isBack ? 0.16 : 0.22) - (isBack ? -0.12 : -0.16)) * easeP2;
        swingY = -4 + (3.5 - -4) * easeP2;
      } else if (swingProg < 0.70) {
        // Impact hold: absorbs shock
        const p3 = (swingProg - 0.52) / 0.18;
        swingTilt = (isBack ? 0.16 : 0.22) * (1 - p3 * 0.4);
        swingY = 3.5 * (1 - p3 * 0.4);
      } else {
        // Recovery: resets smoothly
        const p4 = (swingProg - 0.70) / 0.30;
        const easeP4 = Math.sin((p4 * Math.PI) / 2);
        swingTilt = ((isBack ? 0.16 : 0.22) * 0.6) * (1 - easeP4);
        swingY = (3.5 * 0.6) * (1 - easeP4);
      }
    }

    // Walking animation kinematics (realistic stride bob & sway)
    const walkBob = moving ? Math.abs(Math.sin(t / 105)) * 3.5 : Math.sin(t / 550) * 1.2;
    const walkTilt = moving ? Math.sin(t / 105) * 0.04 : 0;

    ctx.save();
    // Anchor position at feet
    ctx.translate(p.x, p.y + 8 - walkBob + swingY);

    // Ground contact shadow (moves and squashes naturally with stride cadence)
    ctx.save();
    const shadowScale = moving ? 0.92 + Math.abs(Math.sin(t / 105)) * 0.16 : 1;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 3, (isBack || isFront ? 15 : 18) * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Directional flip & animation tilt
    const flip = isBack || isFront ? 1 : p.facing === 'left' ? -1 : 1;
    ctx.scale(flip, 1);
    ctx.rotate(walkTilt + swingTilt);

    // 1. Draw animated legs (underneath coat hem)
    drawMinerLegs(ctx, isBack, isFront, moving, t, isSwinging);

    // 2. Draw upper body sprite (head, hat, chest, coat down to hem)
    if (img && img.complete && img.naturalWidth > 0) {
      const splitRatio = isBack ? 0.63 : isFront ? 0.63 : 0.62;
      const sW = img.naturalWidth;
      const sH = img.naturalHeight * splitRatio;
      const dW = w;
      const dH = h * splitRatio;

      ctx.drawImage(img, 0, 0, sW, sH, -dW / 2, -h, dW, dH);

      // Tailored hem trim shadow ensuring seamless blend with trousers
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
      ctx.beginPath();
      ctx.ellipse(0, -h + dH, dW * 0.36, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#3d5573';
      ctx.fillRect(-12, -h + 20, 24, 28);
    }

    // 3. Draw arms swaying and holding pickaxe by the middle
    drawPickaxeAndStrike(ctx, isBack, isFront, flip, swingElapsed, moving, t);

    ctx.restore();
  };

  // ── RENDER COMPONENT ──────────────────────────────────────────────────────
  const ore = ORES[gameLevel - 1];
  const progress = Math.min(100, Math.round((coins / ore.thr) * 100));
  const accuracy = qAnswered > 0 ? Math.round((qCorrect / qAnswered) * 100) : 0;

  return (
    <div className="flex flex-col items-center select-none">
      {/* Title bar */}
      <div className="flex justify-between w-full max-w-[800px] mb-3 items-center">
        <button className="back-btn m-0" onClick={onBack}>
          ← Quitter MineurFou
        </button>
        <h2
          className="m-0 font-extrabold tracking-wider text-2xl uppercase flex items-center gap-2"
          style={{
            color: '#92400e',
            letterSpacing: '0.06em',
            textShadow: '0 1px 1px rgba(0,0,0,0.12)',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          <span>⛏️</span> MineurFou
        </h2>
        <button
          onClick={toggleMusic}
          style={{
            background: music ? '#d4a01a' : '#94a3b8',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {music ? '🎵 Musique: ON' : '🎵 Musique: OFF'}
        </button>
      </div>

      <div className="mineur-container">
        <canvas ref={canvasRef} width={W} height={H} className="mineur-canvas" />

        {/* HUD: Storybook Parchment & Glassmorphism Banner */}
        <div className="mineur-hud">
          <div className="mineur-hud-panel">
            <span title="Euros gagnés">💰 {coins} €</span>
            <span title="Coups de pioche disponibles">⛏️ {digs} coups</span>
            <span title="Sacoche">
              🎒 {ore.icon} {inventory}/{MAX_INV}
            </span>
          </div>
          <div className="mineur-hud-panel">
            <span
              style={{
                fontWeight: 'bold',
                color: ore.col,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Niveau {gameLevel} {ore.icon} {ore.name}
            </span>
            <span style={{ color: '#78350f' }}>
              {coins} / {ore.thr} €
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#0f172a' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${ore.col}, ${ore.hi})`,
              transition: 'width 0.6s ease',
            }}
          />
        </div>

        {/* Interaction hint */}
        {hint && !modal && (
          <div className="mineur-hint" onClick={handleInteract}>
            {hint}
          </div>
        )}

        {/* Level-up banner */}
        {levelMsg && <div className="mineur-levelup">{levelMsg}</div>}

        {/* ── MODALS ─── */}

        {/* Modal 1: Question at Café Jojo */}
        {modal === 'question' && currentQ && (
          <div className="mineur-overlay">
            <div className="mineur-modal">
              <h2>☕ Café Jojo — Question de Jojo</h2>
              <p
                style={{
                  background: '#fef3c7',
                  padding: '12px 16px',
                  borderRadius: 8,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: '#1e293b',
                  lineHeight: '1.45',
                }}
              >
                {currentQ.q}
              </p>
              <div className="mineur-q-opts">
                {currentQ.opts.map((opt, i) => {
                  let cls = '';
                  if (qState !== null) cls = i === currentQ.ans ? 'mq-correct' : 'mq-wrong';
                  return (
                    <button
                      key={i}
                      className={cls}
                      onClick={() => handleAnswer(i)}
                      disabled={qState !== null}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {qState === 'correct' && (
                <p style={{ color: '#059669', fontWeight: 'bold' }}>
                  ✅ Bravo ! +3 coups de pioche accordés !
                </p>
              )}
              {qState === 'wrong' && (
                <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
                  ❌ Incorrect. Réponse correcte : <em>{currentQ.opts[currentQ.ans]}</em>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Modal 2: Bureau des Mines */}
        {modal === 'bureau' && (
          <div className="mineur-overlay">
            <div className="mineur-modal">
              <h2>⚖️ Bureau des Mines</h2>
              <p>
                Minerai en sacoche :{' '}
                <strong>
                  {inventory} {ore.icon} {ore.name}
                </strong>
              </p>
              <p>
                Cours unitaire du {ore.name} : <strong>{ore.val} €</strong>
              </p>
              <p
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#d4a01a',
                  margin: '14px 0',
                }}
              >
                Revenu total : {inventory * ore.val} €
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 10 }}>
                <button
                  className="mineur-btn mineur-btn-gold"
                  onClick={sellOre}
                  disabled={inventory === 0}
                >
                  💰 Vendre Tout
                </button>
                <button className="mineur-btn mineur-btn-red" onClick={() => setModal(null)}>
                  Fermer
                </button>
              </div>
              {inventory === 0 && (
                <p style={{ color: '#94a3b8', marginTop: 10, fontSize: '0.9rem' }}>
                  Votre sacoche est vide. Allez d'abord creuser à la Mine !
                </p>
              )}
            </div>
          </div>
        )}

        {/* Modal 3: Bag full */}
        {modal === 'bag_full' && (
          <div className="mineur-overlay" onClick={() => setModal(null)}>
            <div className="mineur-modal">
              <div style={{ fontSize: 50 }}>🎒</div>
              <h2>Sacoche pleine !</h2>
              <p>Vous transportez déjà {MAX_INV} unités de minerai.</p>
              <p>
                Allez vendre votre cargaison au <strong>⚖️ Bureau des Mines</strong> avant de continuer.
              </p>
              <button
                className="mineur-btn mineur-btn-red"
                style={{ marginTop: 14 }}
                onClick={() => setModal(null)}
              >
                D'accord
              </button>
            </div>
          </div>
        )}

        {/* Modal 4: No digs */}
        {modal === 'no_digs' && (
          <div className="mineur-overlay" onClick={() => setModal(null)}>
            <div className="mineur-modal">
              <div style={{ fontSize: 50 }}>⛏️</div>
              <h2>Plus de coups de pioche !</h2>
              <p>
                Retournez au <strong>☕ Café Jojo</strong> répondre aux questions culturelles et
                grammaticales pour regagner des coups de pioche.
              </p>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 6 }}>
                Chaque bonne réponse rapporte +3 coups !
              </p>
              <button
                className="mineur-btn mineur-btn-red"
                style={{ marginTop: 14 }}
                onClick={() => setModal(null)}
              >
                D'accord
              </button>
            </div>
          </div>
        )}

        {/* Modal 5: Victory Certificate */}
        {modal === 'victory' && (
          <div className="mineur-overlay">
            <div className="mineur-modal mineur-certificate">
              <div className="cert-header">
                <span style={{ fontSize: 36 }}>🏆</span>
                <h2 className="cert-title">
                  Certificat d'Aptitude Minière
                  <br />
                  de Francotopia
                </h2>
                <span style={{ fontSize: 36 }}>⛏️</span>
              </div>
              <hr className="cert-divider" />
              <p style={{ fontStyle: 'italic', color: '#7c5200', margin: '4px 0', fontSize: '0.9rem' }}>
                Décerné avec les honneurs à
              </p>
              <p
                style={{
                  fontFamily: 'serif',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  color: '#3d2200',
                  margin: '6px 0 12px',
                }}
              >
                L'Apprenti Mineur Émérite
              </p>
              <hr className="cert-divider" />
              <div className="cert-stats">
                <div className="cert-stat-row">
                  <span className="cert-stat-icon">💰</span>
                  <span>
                    <strong>1 100 €</strong> amassés à travers les quatre filons légendaires
                  </span>
                </div>
                <div className="cert-stat-row">
                  <span className="cert-stat-icon">⛏️</span>
                  <span>
                    <strong>{totalMined}</strong> unités de minerai extraites avec bravoure
                  </span>
                </div>
                <div className="cert-stat-row">
                  <span className="cert-stat-icon">📊</span>
                  <span>
                    Précision linguistique au Café Jojo : <strong>{accuracy}%</strong> ({qCorrect}/
                    {qAnswered})
                  </span>
                </div>
              </div>
              <hr className="cert-divider" />
              <p className="cert-honor">
                « Élevé au rang suprême de Maître Mineur Émérite de la Province de Francotopia »
              </p>
              <div className="cert-btn-row">
                <button className="mineur-btn mineur-btn-gold" onClick={resetGame}>
                  🔄 Rejouer l'Aventure
                </button>
                <button className="mineur-btn mineur-btn-red" onClick={onBack}>
                  ✕ Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center max-w-[800px] text-gray-600 text-sm">
        <p>
          <strong>Règles :</strong> Allez au <strong>☕ Café Jojo</strong> (Ouest) pour obtenir des coups
          de pioche · Creusez le <strong>⛏️ Tas de Minerai</strong> (Nord) · Vendez au{' '}
          <strong>⚖️ Bureau des Mines</strong> (Est) · Atteignez <strong>1 100 €</strong> pour triompher !
        </p>
      </div>
    </div>
  );
}
