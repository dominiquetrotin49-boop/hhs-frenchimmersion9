import React, { useRef, useEffect, useState } from 'react';
import './MineurFou.css';

// ── CANVAS ───────────────────────────────────────────────────────────────────
const W = 800, H = 600;

// ── ORE LEVELS ───────────────────────────────────────────────────────────────
const ORES = [
  { id:1, name:'Charbon', icon:'\u26AB', col:'#4b4b4b', hi:'#888',    val:10,  thr:200  },
  { id:2, name:'Cuivre',  icon:'\uD83D\uDFE4', col:'#b45309', hi:'#d97706', val:25,  thr:450  },
  { id:3, name:'Argent',  icon:'\u26AA', col:'#94a3b8', hi:'#dde6f0', val:50,  thr:700  },
  { id:4, name:'Or',      icon:'\uD83D\uDFE1', col:'#ca8a04', hi:'#fbbf24', val:100, thr:1100 },
];

const MAX_INV = 10;
const SPEED   = 2.8;
const P_SIZE  = 18;
const I_DIST  = 72;

// Interaction-zone centres
const MINE_P   = { x:383, y:210 };
const CAFE_P   = { x:128, y:358 };
const BUREAU_P = { x:662, y:358 };

// Walkable path zones  { x,y = top-left, w,h }
const WALK = [
  { x:350, y:200, w:66, h:130 }, // vertical spine  mine -> junction
  { x:85,  y:318, w:630, h:74 }, // horizontal road cafe -> bureau
];

function inZone(x, y) {
  return WALK.some(z => x >= z.x && x <= z.x+z.w && y >= z.y && y <= z.y+z.h);
}
function walkable(px, py) {
  const s = P_SIZE * 0.52;
  return inZone(px-s,py-s) && inZone(px+s,py-s) && inZone(px-s,py+s) && inZone(px+s,py+s) && inZone(px,py);
}

// ── QUESTION BANK (80 questions — 20 per level) ───────────────────────────────
const QUESTIONS = {
  1: [
    { q:"Comment qualifie-t-on un personnage qui accomplit des actes héroïques mais a des méthodes moralement douteuses ?", opts:["Un justicier aveugle","Un anti-héros","Un antagoniste"], ans:1 },
    { q:"Quel mot désigne l'adversaire direct du protagoniste dans un récit ?", opts:["L'allié","L'antagoniste","Le figurant"], ans:1 },
    { q:"La qualité morale d'un héros qui affronte le danger sans faiblir est :", opts:["La lâcheté","Le dévouement et la bravoure","L'indifférence"], ans:1 },
    { q:"Pour débuter une argumentation sur un personnage, quel connecteur utilise-t-on ?", opts:["Tout d'abord","Finalement","Cependant"], ans:0 },
    { q:"Un héros classique fait souvent passer le bien ___ avant son intérêt personnel.", opts:["commun","privé","illusoire"], ans:0 },
    { q:"Le talon d'Achille d'un personnage représente :", opts:["Son superpouvoir secret","Sa faiblesse ou vulnérabilité","Son armure enchantée"], ans:1 },
    { q:"Quel connecteur exprime une relation d'addition ?", opts:["En outre","Néanmoins","Par conséquent"], ans:0 },
    { q:"Un acte accompli avec désintéressement pour secourir autrui est un acte de :", opts:["Trahison","Dévouement","Vengeance"], ans:1 },
    { q:"L'anti-héros agit souvent poussé par :", opts:["Une quête de gloire pure","Une blessure passée ou la survie","Le respect aveugle des lois"], ans:1 },
    { q:"Pour exprimer une opposition entre deux idées, on utilise :", opts:["C'est pourquoi","Cependant","D'abord"], ans:1 },
    { q:"Un combattant qui refuse de reculer devant une bête féroce fait preuve de :", opts:["Couardise","Bravoure","Rancœur"], ans:1 },
    { q:"Comment appelle-t-on l'épreuve initiatique qui transforme un simple citoyen en sauveur ?", opts:["Le serment civique","La quête héroïque","La trêve"], ans:1 },
    { q:"Quel connecteur annonce la conséquence d'une action ?", opts:["Par conséquent","En premier lieu","Toutefois"], ans:0 },
    { q:"Le mobile secret qui pousse un personnage à agir s'appelle :", opts:["Sa motivation","Sa maladresse","Son costume"], ans:0 },
    { q:"Un personnage impitoyable et cruel envers ses ennemis est :", opts:["Clément","Impitoyable","Tolérant"], ans:1 },
    { q:"Pour conclure une analyse morale, on emploie :", opts:["Premièrement","En conclusion","Par ailleurs"], ans:1 },
    { q:"L'anti-héros se distingue du méchant classique car :", opts:["Il n'a aucun pouvoir","Il possède encore une part d'humanité","Il réussit toujours sans effort"], ans:1 },
    { q:"L'acte de pardonner à un rival vaincu s'appelle :", opts:["La clémence","L'embuscade","L'avarice"], ans:0 },
    { q:"Quel connecteur permet d'ajouter un argument supplémentaire ?", opts:["De plus","Donc","En revanche"], ans:0 },
    { q:"Un pacte conclu entre deux guerriers pour s'entraider est :", opts:["Une rivalité","Une alliance","Une dispute"], ans:1 },
  ],
  2: [
    { q:"« Pendant que le héros ___ les remparts, la foudre est tombée. »", opts:["surveillait","a surveillé","surveillera"], ans:0 },
    { q:"« Soudain, l'alarme de la forteresse ___ dans la nuit. »", opts:["retentissait","a retenti","retentit"], ans:1 },
    { q:"« Chaque matin, le vieux mentor ___ les recrues au maniement du bouclier. »", opts:["a entraîné","entraînait","entraîne"], ans:1 },
    { q:"« À cet instant précis, elle ___ que le trésor était faux. »", opts:["comprenait","a compris","a comprenant"], ans:1 },
    { q:"« Il faisait un froid glacial et la neige ___ les chemins d'accès. »", opts:["bloquait","a bloqué","bloquer"], ans:0 },
    { q:"« Tandis que nous négocions avec le chef, l'antagoniste ___ en courant. »", opts:["entrait","est entré","a entré"], ans:1 },
    { q:"« Autrefois, les villageois ___ aveuglément en la protection des chevaliers. »", opts:["ont cru","croyaient","croient"], ans:1 },
    { q:"« Dès qu'il a vu le danger, le justicier ___ son arc de guerre. »", opts:["bandait","a bandé","bande"], ans:1 },
    { q:"« La sorcière ___ un long voile noir qui flottait au vent. »", opts:["a porté","portait","porta"], ans:1 },
    { q:"« L'anti-héros ___ un dilemme cruel hier soir lors de l'attaque. »", opts:["tranchait","a tranché","tranchera"], ans:1 },
    { q:"« Les gardes ___ profondément quand les espions ont franchi la grille. »", opts:["dormaient","ont dormi","dorment"], ans:0 },
    { q:"« Finalement, après des heures d'attente, la porte dérobée ___ avec fracas. »", opts:["s'ouvrait","s'est ouverte","s'était ouvrir"], ans:1 },
    { q:"Pour décrire le temps, le décor ou l'état d'esprit dans le passé, quel temps emploie-t-on ?", opts:["Le passé composé","L'imparfait","Le subjonctif"], ans:1 },
    { q:"Pour exprimer une action soudaine, ponctuelle et complètement achevée :", opts:["L'imparfait","Le passé composé","Le conditionnel"], ans:1 },
    { q:"« Le chevalier était blessé mais il ___ le combat jusqu'au bout. »", opts:["poursuivait","a poursuivi","poursuivre"], ans:1 },
    { q:"« Tous les soirs, l'espionne ___ les mouvements de la garde royale. »", opts:["observait","a observé","observe"], ans:0 },
    { q:"« Brusquement, une flèche ennemie ___ le bouclier en deux. »", opts:["fendait","a fendu","fend"], ans:1 },
    { q:"« Le château était immense et ses couloirs ___ d'ombres menaçantes. »", opts:["regorgeaient","ont regorgé","regorge"], ans:0 },
    { q:"« Le voleur s'échappait sur les toits quand un garde ___ la torche. »", opts:["allumait","a allumé","allume"], ans:1 },
    { q:"« Ce jour mémorable, l'anti-héros ___ sa fidélité à la cause commune. »", opts:["prouvait","a prouvé","prouver"], ans:1 },
  ],
  3: [
    { q:"« Après la bataille, les guerriers blessés ___ au campement. » (revenir, masc. plur.)", opts:["sont revenus","ont revenu","sont revenu"], ans:0 },
    { q:"« La vaillante capitaine ___ seule au sommet de la citadelle. » (monter, fém. sing.)", opts:["a montée","est montée","est monté"], ans:1 },
    { q:"« Les deux héros rivaux ___ longuement dans les yeux avant le duel. » (se regarder)", opts:["se sont regardés","ont se regardé","se sont regardé"], ans:0 },
    { q:"« Avant l'aube, la magicienne ___ dans la forêt interdite. » (s'aventurer, fém. sing.)", opts:["s'est aventurée","a s'aventuré","s'est aventuré"], ans:0 },
    { q:"« Les éclaireurs ___ à l'aube pour surprendre l'avant-poste. » (partir, masc. plur.)", opts:["ont partis","sont partis","sont parti"], ans:1 },
    { q:"« L'anti-héros et son frère ___ la main pour sceller la paix. » (se tendre, réciproque)", opts:["se sont tendu","se sont tendus","ont tendu"], ans:0 },
    { q:"« Dès le premier choc, le cavalier ___ lourdement de sa monture. » (tomber, masc. sing.)", opts:["est tombé","a tombé","est tombée"], ans:0 },
    { q:"« Nous (masc. plur.) ___ dans le piège tendu par le traître. » (tomber)", opts:["sommes tombés","avons tombé","sommes tombé"], ans:0 },
    { q:"« Les sentinelles ___ sans faire le moindre bruit. » (s'éloigner, fém. plur.)", opts:["se sont éloignées","se sont éloigné","ont s'éloignées"], ans:0 },
    { q:"« La justicière masquée ___ par la fenêtre secrète. » (s'échapper, fém. sing.)", opts:["s'est échappée","a échappé","s'est échappé"], ans:0 },
    { q:"« Les deux complices ___ dans la foule en délire. » (se dissimuler, masc. plur.)", opts:["se sont dissimulés","ont dissimulé","se sont dissimulé"], ans:0 },
    { q:"« À quelle heure les renforts ___ dans la vallée ? » (arriver, masc. plur.)", opts:["sont arrivés","ont arrivé","sont arrivé"], ans:0 },
    { q:"« Face au péril, vous (masc. plur.) ___ jusqu'au dernier souffle. » (se battre)", opts:["vous êtes battus","vous avez battu","vous êtes battu"], ans:0 },
    { q:"« L'héroïne ___ devant la porte du sanctuaire. » (s'agenouiller, fém. sing.)", opts:["s'est agenouillée","a agenouillé","s'est agenouillé"], ans:0 },
    { q:"« Les deux espions ___ en secret sur la rive du fleuve. » (se rejoindre, masc. plur.)", opts:["se sont rejoints","ont rejoints","se sont rejoint"], ans:0 },
    { q:"Quel auxiliaire emploie-t-on TOUJOURS pour les verbes pronominaux au passé composé ?", opts:["Avoir","Être","Faire"], ans:1 },
    { q:"« La princesse rebelle ___ auprès de son peuple fidèle. » (rester, fém. sing.)", opts:["est restée","a resté","est resté"], ans:0 },
    { q:"« Les combattants ___ compte de leur terrible erreur. » (se rendre compte)", opts:["se sont rendu","se sont rendus","ont rendu"], ans:0 },
    { q:"« Quand le jour s'est levé, ils ___ au sommet de la colline. » (arriver, masc. plur.)", opts:["sont arrivés","ont arrivé","sont arrivé"], ans:0 },
    { q:"« Les deux adversaires ___ un pacte de non-agression. » (se promettre)", opts:["se sont promis","se sont promis(es)","ont promis"], ans:0 },
  ],
  4: [
    { q:"« Le justicier a violé les lois de la cité ; ___, ses intentions visaient le bien commun. »", opts:["toutefois","ainsi","d'abord"], ans:0 },
    { q:"« L'anti-héros a dérobé l'antidote royal. ___, il s'est empressé de soigner les orphelins. »", opts:["Néanmoins","En revanche","En outre"], ans:0 },
    { q:"« Il a bravé les ordres du conseil ; ___, il doit être jugé équitablement. »", opts:["par conséquent","premièrement","en outre"], ans:0 },
    { q:"« Le héros classique agit par altruisme. ___, l'anti-héros privilégie souvent sa survie. »", opts:["En revanche","C'est pourquoi","De plus"], ans:0 },
    { q:"« L'antagoniste paraissait invincible ; ___, une faille dans son armure a causé sa perte. »", opts:["cependant","en conclusion","également"], ans:0 },
    { q:"Qu'est-ce qui caractérise le mieux le dilemme moral d'un anti-héros ?", opts:["L'absence totale d'émotions","Le conflit entre ses valeurs intimes et la loi établie","L'obéissance absolue aux ordres"], ans:1 },
    { q:"« Le détective a réuni des preuves ; ___, il n'a pu empêcher le crime. »", opts:["pourtant","donc","en premier lieu"], ans:0 },
    { q:"« ___ d'évaluer les actes du héros, examinons les circonstances du combat. »", opts:["Avant","Après","Tandis que"], ans:0 },
    { q:"« Les citoyens admiraient son courage. Ils louaient ___ sa grande humilité. »", opts:["également","néanmoins","par contre"], ans:0 },
    { q:"« Le mercenaire a trahi ses employeurs corrompus ; ___, il a sauvé des innocents. »", opts:["ainsi","au contraire","en premier lieu"], ans:0 },
    { q:"Pourquoi la figure de l'anti-héros est-elle souvent plus réaliste aux yeux des lecteurs ?", opts:["Parce qu'il est immortel","Parce qu'il possède des doutes et des imperfections humaines","Parce qu'il ne perd jamais un combat"], ans:1 },
    { q:"« L'ennemi avançait en grand nombre. ___, la garnison a tenu la porte d'armes. »", opts:["Malgré cela","En conclusion","C'est pourquoi"], ans:0 },
    { q:"« ___ de cette épopée, nous retenons que chaque victoire exige de lourds sacrifices. »", opts:["Au terme","Au début","Par ailleurs"], ans:0 },
    { q:"« Ce héros n'a utilisé aucune arme létale ; ___, il a fait preuve d'une retenue exemplaire. »", opts:["en d'autres termes","cependant","pourtant"], ans:0 },
    { q:"Quelle nuance oppose le courage héroïque à la témérité imprudente ?", opts:["La témérité ignore le danger, le courage l'affronte lucidement","Le courage est toujours magique","Il n'y a aucune différence"], ans:0 },
    { q:"« La menace a été neutralisée sans perte humaine ; ___, la mission est un franc succès. »", opts:["dès lors","toutefois","au contraire"], ans:0 },
    { q:"« Le chevalier protégeait les faibles ___ le renégat pillait les convois royaux. »", opts:["alors que","donc","par conséquent"], ans:0 },
    { q:"« ___, les frontières du royaume sont restaurées et la paix règne de nouveau. »", opts:["Finalement","Premièrement","D'ailleurs"], ans:0 },
    { q:"Quel connecteur marque la reformulation explicative d'un exploit héroïque ?", opts:["C'est-à-dire","Cependant","Néanmoins"], ans:0 },
    { q:"« En dernière analyse, le dévouement du héros transcende ses faiblesses individuelles. » Que signifie « transcende » ?", opts:["Dépasse et sublime","Détruit complètement","Imite aveuglément"], ans:0 },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
export default function MineurFou({ onBack }) {
  const canvasRef = useRef(null);

  // React state (UI driven)
  const [coins,       setCoins]       = useState(0);
  const [digs,        setDigs]        = useState(0);
  const [inventory,   setInventory]   = useState(0);
  const [gameLevel,   setGameLevel]   = useState(1);
  const [music,       setMusic]       = useState(false);
  const [hint,        setHint]        = useState(null);
  const [modal,       setModal]       = useState(null);
  const [currentQ,    setCurrentQ]    = useState(null);
  const [qState,      setQState]      = useState(null);
  const [levelMsg,    setLevelMsg]    = useState(null);
  const [totalMined,  setTotalMined]  = useState(0);
  const [qAnswered,   setQAnswered]   = useState(0);
  const [qCorrect,    setQCorrect]    = useState(0);

  // Refs (live in rAF loop — no stale closures)
  const playerRef  = useRef({ x:383, y:358, facing:'right' });
  const keysRef    = useRef({});
  const rafRef     = useRef(null);
  const unusedRef  = useRef({});
  const audioRef   = useRef(null);
  const swingRef   = useRef(false);
  const swingTimer = useRef(null);
  const particleRef= useRef([]);
  const hintRef    = useRef(null);
  // stateRef: fresh snapshot kept in sync for the game loop
  const stRef      = useRef({ modal:null, digs:0, inventory:0, gameLevel:1, coins:0 });

  useEffect(() => {
    stRef.current = { modal, digs, inventory, gameLevel, coins };
  }, [modal, digs, inventory, gameLevel, coins]);

  // ── AUDIO ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const a = new Audio('/music/amber_road.m4a');
    a.loop = true; a.volume = 0.4;
    audioRef.current = a;
    return () => a.pause();
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (music) { a.pause(); setMusic(false); }
    else { a.play().catch(() => {}); setMusic(true); }
  };

  // ── KEYBOARD ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const dn = (e) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;
      if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key)) {
        e.preventDefault();
      }
      if ((e.code === 'Space') && !stRef.current.modal) handleInteract();
    };
    const up = (e) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', dn, { passive: false });
    window.addEventListener('keyup',   up);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup',   up);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── INTERACTION HELPERS ────────────────────────────────────────────────────
  const dist = (ax, ay) => Math.hypot(playerRef.current.x - ax, playerRef.current.y - ay);

  const getTarget = () => {
    if (dist(MINE_P.x,   MINE_P.y)   < I_DIST) return 'mine';
    if (dist(CAFE_P.x,   CAFE_P.y)   < I_DIST) return 'cafe';
    if (dist(BUREAU_P.x, BUREAU_P.y) < I_DIST) return 'bureau';
    return null;
  };

  const handleInteract = () => {
    const t = getTarget();
    if (t === 'cafe')   openQuestion();
    if (t === 'mine')   tryDig();
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
    setQAnswered(n => n + 1);
    if (idx === currentQ.ans) {
      setQState('correct');
      setQCorrect(n => n + 1);
      setDigs(d => d + 3);
      setTimeout(() => setModal(null), 1200);
    } else {
      setQState('wrong');
      setTimeout(() => setModal(null), 1800);
    }
  };

  const tryDig = () => {
    const { digs: d, inventory: inv } = stRef.current;
    if (inv >= MAX_INV) { setModal('bag_full'); return; }
    if (d <= 0)          { setModal('no_digs');  return; }
    setDigs(n => n - 1);
    setInventory(n => n + 1);
    setTotalMined(n => n + 1);
    // Swing animation flag (read by draw loop)
    swingRef.current = true;
    if (swingTimer.current) clearTimeout(swingTimer.current);
    swingTimer.current = setTimeout(() => { swingRef.current = false; }, 420);
    // Spawn ore particles
    const lvl = stRef.current.gameLevel;
    const ore = ORES[lvl - 1];
    particleRef.current = Array.from({ length: 8 }, (_, i) => ({
      x: MINE_P.x + (Math.random() - 0.5) * 50,
      y: MINE_P.y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 5,
      vy: -Math.random() * 6 - 2,
      life: 1.0,
      color: ore.col,
    }));
  };

  const sellOre = () => {
    const { inventory: inv, gameLevel: lvl, coins: c } = stRef.current;
    if (inv === 0) return;
    const earned   = inv * ORES[lvl - 1].val;
    const newCoins = c + earned;
    setCoins(newCoins);
    setInventory(0);
    setModal(null);
    const thr = ORES[lvl - 1].thr;
    if (newCoins >= thr) {
      if (lvl === 4) {
        setTimeout(() => setModal('victory'), 350);
      } else {
        const nl = lvl + 1;
        setGameLevel(nl);
        unusedRef.current[nl] = [];
        setLevelMsg(`\uD83C\uDF89 Niveau ${nl} débloqué ! Vous extrayez maintenant du ${ORES[nl-1].name} ${ORES[nl-1].icon}`);
        setTimeout(() => setLevelMsg(null), 4200);
      }
    }
  };

  const resetGame = () => {
    setCoins(0); setDigs(0); setInventory(0); setGameLevel(1);
    setTotalMined(0); setQAnswered(0); setQCorrect(0);
    setModal(null); unusedRef.current = {};
    playerRef.current = { x:383, y:358, facing:'right' };
  };

  // ── GAME LOOP ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
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
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── UPDATE PLAYER ─────────────────────────────────────────────────────────
  const updatePlayer = (dt, now) => {
    const p   = playerRef.current;
    const k   = keysRef.current;
    let dx = 0, dy = 0;
    if (k['arrowup']    || k['w'] || k['z']) dy -= SPEED;
    if (k['arrowdown']  || k['s'])           dy += SPEED;
    if (k['arrowleft']  || k['a'] || k['q']) dx -= SPEED;
    if (k['arrowright'] || k['d'])           dx += SPEED;

    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx*dx + dy*dy);
      dx = dx/len * SPEED; dy = dy/len * SPEED;
    }
    dx *= dt; dy *= dt;

    if (dx < 0) p.facing = 'left';
    else if (dx > 0) p.facing = 'right';

    // Sub-pixel X
    const stepX = Math.ceil(Math.abs(dx));
    const sdx   = dx / Math.max(1, stepX);
    for (let i = 0; i < stepX; i++) {
      if (walkable(p.x + sdx, p.y)) p.x += sdx; else break;
    }
    // Sub-pixel Y
    const stepY = Math.ceil(Math.abs(dy));
    const sdy   = dy / Math.max(1, stepY);
    for (let i = 0; i < stepY; i++) {
      if (walkable(p.x, p.y + sdy)) p.y += sdy; else break;
    }
    p.x = Math.max(P_SIZE, Math.min(W - P_SIZE, p.x));
    p.y = Math.max(P_SIZE, Math.min(H - P_SIZE, p.y));

    // Update particles
    particleRef.current = particleRef.current
      .map(pt => ({ ...pt, x: pt.x+pt.vx, y: pt.y+pt.vy+0.25, vy: pt.vy+0.18, life: pt.life-0.055 }))
      .filter(pt => pt.life > 0);

    // Update interaction hint (only call setState on change)
    const t = getTarget();
    let newHint = null;
    if (t === 'cafe')   newHint = '\u2615 ESPACE \u2014 Parler à Jojo (gagner des coups de pioche)';
    if (t === 'mine')   newHint = '\u26CF\uFE0F ESPACE \u2014 Creuser le tas de minerai';
    if (t === 'bureau') newHint = '\u2696\uFE0F ESPACE \u2014 Vendre le minerai au Bureau';
    if (newHint !== hintRef.current) { hintRef.current = newHint; setHint(newHint); }
  };

  // ── DRAW ──────────────────────────────────────────────────────────────────
  const drawScene = (ctx, t) => {
    const lvl = stRef.current.gameLevel;
    const ore = ORES[lvl - 1];
    const p   = playerRef.current;

    // Sky + ground gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0,   '#87ceeb');
    sky.addColorStop(0.35,'#c9e8b0');
    sky.addColorStop(1,   '#6a9e4e');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    // Distant hills
    ctx.fillStyle = '#5a8f3c';
    ctx.beginPath(); ctx.ellipse(160, 185, 200, 80, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(640, 170, 220, 90, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#4e8032';
    ctx.beginPath(); ctx.ellipse(390, 165, 180, 75, 0, 0, Math.PI*2); ctx.fill();

    // Cobblestone path
    drawPath(ctx);

    // Buildings (drawn before player)
    drawCafe(ctx, t);
    drawBureau(ctx, t);
    drawMine(ctx, ore, t);

    // Ore particles (draw above buildings, below player)
    ctx.save();
    particleRef.current.forEach(pt => {
      ctx.globalAlpha = pt.life;
      ctx.fillStyle = pt.color;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.restore();

    // Player
    drawMiner(ctx, p, t);
  };

  const drawPath = (ctx) => {
    ctx.save();
    WALK.forEach(z => {
      // Base fill
      const g = ctx.createLinearGradient(z.x, z.y, z.x, z.y+z.h);
      g.addColorStop(0, '#a09080'); g.addColorStop(1, '#7a6858');
      ctx.fillStyle = g; ctx.fillRect(z.x, z.y, z.w, z.h);
      // Cobblestone brickwork
      ctx.strokeStyle = '#4a3828'; ctx.lineWidth = 1;
      for (let row = 0; row < z.h; row += 16) {
        const off = (Math.floor(row/16) % 2 === 0) ? 0 : 12;
        for (let col = 0; col < z.w; col += 24) {
          ctx.strokeRect(z.x + col + off + 2, z.y + row + 2, 20, 12);
        }
      }
      // Dirt edge shadow
      ctx.fillStyle = 'rgba(0,0,0,0.10)';
      ctx.fillRect(z.x, z.y, z.w, 3);
      ctx.fillRect(z.x, z.y+z.h-3, z.w, 3);
    });
    ctx.restore();
  };

  const drawCafe = (ctx) => {
    const bx=20, by=195, bw=190, bh=145;

    // Main ochre wall
    ctx.fillStyle = '#d4a86a'; ctx.fillRect(bx, by, bw, bh);

    // Colombage beams
    ctx.strokeStyle = '#4a2e0a'; ctx.lineWidth = 5;
    // Verticals
    [40,90,145].forEach(dx => { ctx.beginPath(); ctx.moveTo(bx+dx,by); ctx.lineTo(bx+dx,by+bh); ctx.stroke(); });
    // Horizontals
    [55,115].forEach(dy => { ctx.beginPath(); ctx.moveTo(bx,by+dy); ctx.lineTo(bx+bw,by+dy); ctx.stroke(); });
    // Diagonals
    ctx.lineWidth=3;
    [[40,0,90,55],[90,0,145,55],[40,55,90,115],[90,55,145,115]].forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath(); ctx.moveTo(bx+x1,by+y1); ctx.lineTo(bx+x2,by+y2); ctx.stroke();
    });

    // Thatched roof
    ctx.fillStyle='#7b3f0a';
    ctx.beginPath(); ctx.moveTo(bx-12,by); ctx.lineTo(bx+bw/2,by-48); ctx.lineTo(bx+bw+12,by); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#5a2d06'; ctx.lineWidth=2;
    for (let i=0;i<5;i++){
      ctx.beginPath(); ctx.moveTo(bx-12+i*45,by); ctx.lineTo(bx+bw/2,by-48); ctx.stroke();
    }
    // Chimney
    ctx.fillStyle='#5a4032';
    ctx.fillRect(bx+150,by-62,18,30); ctx.fillRect(bx+147,by-64,24,8);

    // Left window
    ctx.fillStyle='#b8e0ee'; ctx.fillRect(bx+6,by+16,28,28);
    ctx.strokeStyle='#4a2e0a'; ctx.lineWidth=3; ctx.strokeRect(bx+6,by+16,28,28);
    ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(bx+20,by+16); ctx.lineTo(bx+20,by+44); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+6,by+30); ctx.lineTo(bx+34,by+30); ctx.stroke();

    // Door
    ctx.fillStyle='#5c3010';
    ctx.beginPath(); ctx.roundRect(bx+62,by+bh-65,48,65,[10,10,0,0]); ctx.fill();
    ctx.strokeStyle='#3d1f08'; ctx.lineWidth=2.5; ctx.stroke();
    // Door handle
    ctx.fillStyle='#c8960e';
    ctx.beginPath(); ctx.arc(bx+103,by+bh-30,4,0,Math.PI*2); ctx.fill();

    // Hanging sign
    ctx.strokeStyle='#5c3010'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(bx+148,by+8); ctx.lineTo(bx+148,by+36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+158,by+8); ctx.lineTo(bx+158,by+36); ctx.stroke();
    ctx.fillStyle='#d4a86a'; ctx.strokeStyle='#4a2e0a'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(bx+132,by+33,40,22,4); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#2d1a00'; ctx.font='bold 8px serif'; ctx.textAlign='center';
    ctx.fillText('\u2615 Café', bx+152,by+43); ctx.fillText('Jojo', bx+152,by+52);

    // Label above building
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.font='bold 12px serif'; ctx.textAlign='center';
    ctx.fillText('\u2615 CAFÉ JOJO', bx+bw/2+1, by-10);
    ctx.fillStyle='#fff8e7'; ctx.fillText('\u2615 CAFÉ JOJO', bx+bw/2, by-11);
  };

  const drawBureau = (ctx) => {
    const bx=590, by=195, bw=190, bh=145;

    // Stone wall
    ctx.fillStyle='#b8c4cc'; ctx.fillRect(bx,by,bw,bh);
    // Ashlar stone blocks
    ctx.strokeStyle='#8a9aa8'; ctx.lineWidth=1.5;
    for (let r=0;r<4;r++) for (let c=0;c<4;c++) ctx.strokeRect(bx+c*48+(r%2)*24, by+r*37, 45, 34);

    // Slate roof
    ctx.fillStyle='#4a5568';
    ctx.beginPath(); ctx.moveTo(bx-12,by); ctx.lineTo(bx+bw/2,by-44); ctx.lineTo(bx+bw+12,by); ctx.closePath(); ctx.fill();
    // Roof ridge detail
    ctx.strokeStyle='#2d3748'; ctx.lineWidth=2;
    for (let i=0;i<5;i++){ ctx.beginPath(); ctx.moveTo(bx-12+i*46,by); ctx.lineTo(bx+bw/2,by-44); ctx.stroke(); }
    // Royal flag/pennant
    ctx.fillStyle='#1a3a6b';
    ctx.beginPath(); ctx.moveTo(bx+bw/2-2,by-44); ctx.lineTo(bx+bw/2+22,by-37); ctx.lineTo(bx+bw/2-2,by-30); ctx.closePath(); ctx.fill();

    // Counter window
    ctx.fillStyle='#8fbbe0'; ctx.fillRect(bx+10,by+44,75,50);
    ctx.strokeStyle='#3d5060'; ctx.lineWidth=4; ctx.strokeRect(bx+10,by+44,75,50);
    ctx.strokeStyle='#3d5060'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(bx+48,by+44); ctx.lineTo(bx+48,by+94); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+10,by+69); ctx.lineTo(bx+85,by+69); ctx.stroke();

    // Brass scales ornament
    const sx=bx+128, sy=by+46;
    ctx.strokeStyle='#d4a01a'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sx,sy+32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx-18,sy+10); ctx.lineTo(sx+18,sy+10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx-18,sy+10); ctx.lineTo(sx-14,sy+28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx+18,sy+10); ctx.lineTo(sx+14,sy+28); ctx.stroke();
    ctx.fillStyle='#c8960e';
    ctx.beginPath(); ctx.ellipse(sx-14,sy+28,11,5,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(sx+14,sy+28,11,5,0,0,Math.PI*2); ctx.fill();

    // Door
    ctx.fillStyle='#2d3a4a';
    ctx.beginPath(); ctx.roundRect(bx+120,by+bh-65,48,65,[8,8,0,0]); ctx.fill();
    ctx.strokeStyle='#1a2533'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.fillStyle='#d4a01a';
    ctx.beginPath(); ctx.arc(bx+125,by+bh-30,4,0,Math.PI*2); ctx.fill();

    // Plaque
    ctx.fillStyle='#1a2533';
    ctx.beginPath(); ctx.roundRect(bx+98,by+bh-85,82,20,3); ctx.fill();
    ctx.fillStyle='#d4a01a'; ctx.font='bold 7px serif'; ctx.textAlign='center';
    ctx.fillText('BUREAU DES MINES', bx+139, by+bh-71);

    // Label
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.font='bold 12px serif'; ctx.textAlign='center';
    ctx.fillText('\u2696\uFE0F BUREAU DES MINES', bx+bw/2+1, by-9);
    ctx.fillStyle='#fff8e7'; ctx.fillText('\u2696\uFE0F BUREAU DES MINES', bx+bw/2, by-10);
  };

  const drawMine = (ctx, ore, t) => {
    const mx=300, my=28, mw=168, mh=125;

    // Rocky cliff face
    ctx.fillStyle='#6b5d50'; ctx.fillRect(mx-24,my,mw+48,mh+18);
    // Stone texture
    ctx.strokeStyle='#5a4a3e'; ctx.lineWidth=1;
    for (let y=my; y<my+mh+18; y+=13){
      ctx.beginPath(); ctx.moveTo(mx-24,y); ctx.lineTo(mx+mw+24,y); ctx.stroke();
    }

    // Wooden portal frame
    ctx.fillStyle='#5c3d1a';
    ctx.fillRect(mx+30,my+8,mw-60,mh-8);
    // Side beams
    ctx.fillStyle='#7a5225';
    ctx.fillRect(mx+30,my+8,14,mh-8);
    ctx.fillRect(mx+mw-44,my+8,14,mh-8);
    // Crossbeam
    ctx.fillRect(mx+24,my+8,mw-48,16);
    // Mine shaft — gradient darkness
    const shaft = ctx.createLinearGradient(0,my+24,0,my+mh);
    shaft.addColorStop(0,'#0d0906'); shaft.addColorStop(1,'#1a0e08');
    ctx.fillStyle=shaft;
    ctx.fillRect(mx+44,my+24,mw-88,mh-24);

    // Rusty lanterns on beams
    [mx+28, mx+mw-28].forEach(lx => {
      ctx.fillStyle='#c8960e';
      ctx.fillRect(lx-5,my+12,10,12);
      ctx.fillStyle='rgba(255,200,80,0.55)';
      ctx.beginPath(); ctx.arc(lx,my+18,9,0,Math.PI*2); ctx.fill();
      // Light flicker
      const flicker = 0.4 + 0.2*Math.sin(t/180 + lx);
      ctx.fillStyle=`rgba(255,180,60,${flicker})`;
      ctx.beginPath(); ctx.arc(lx,my+18,14,0,Math.PI*2); ctx.fill();
    });

    // Label
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.font='bold 11px serif'; ctx.textAlign='center';
    ctx.fillText("\u26CF L'ENTRÉE DE LA MINE", mx+mw/2+1, my-5);
    ctx.fillStyle='#fff8e7'; ctx.fillText("\u26CF L'ENTRÉE DE LA MINE", mx+mw/2, my-6);

    // Ore pile
    drawOrePile(ctx, ore, 383, 192, t);
  };

  const drawOrePile = (ctx, ore, cx, cy, t) => {
    ctx.save();
    // Pile base shadow
    ctx.fillStyle='rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(cx,cy+14,45,14,0,0,Math.PI*2); ctx.fill();

    // Individual rocks
    const rocks=[{dx:-24,dy:8,rx:13,ry:9},{dx:0,dy:-2,rx:15,ry:11},{dx:24,dy:8,rx:13,ry:9},
                 {dx:-13,dy:14,rx:10,ry:7},{dx:13,dy:14,rx:10,ry:7},{dx:0,dy:18,rx:9,ry:6}];
    rocks.forEach(({dx,dy,rx,ry},i)=>{
      ctx.beginPath(); ctx.ellipse(cx+dx,cy+dy,rx,ry,i*0.4,0,Math.PI*2);
      ctx.fillStyle=ore.col; ctx.fill();
      ctx.strokeStyle=ore.hi; ctx.lineWidth=1.5; ctx.stroke();
      // Highlight shimmer
      ctx.fillStyle='rgba(255,255,255,0.18)';
      ctx.beginPath(); ctx.ellipse(cx+dx-rx*0.3,cy+dy-ry*0.25,rx*0.35,ry*0.25,i*0.4,0,Math.PI*2);
      ctx.fill();
    });

    // Sparkle for silver/gold
    if (ore.id >= 3) {
      [[-20,0],[4,-8],[22,4]].forEach(([dx,dy],i)=>{
        const alpha = 0.5+0.45*Math.sin(t/400+i*2.1);
        ctx.fillStyle=`rgba(255,255,200,${alpha})`;
        ctx.beginPath(); ctx.arc(cx+dx,cy+dy,2.5,0,Math.PI*2); ctx.fill();
      });
    }

    // Pile label
    ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.font='bold 10px serif'; ctx.textAlign='center';
    ctx.fillText(`${ore.icon} Tas de ${ore.name}`, cx+1, cy+34);
    ctx.fillStyle='#fff8e7'; ctx.fillText(`${ore.icon} Tas de ${ore.name}`, cx, cy+33);
    ctx.restore();
  };

  const drawMiner = (ctx, p, t) => {
    const k = keysRef.current;
    const moving = k['arrowup']||k['arrowdown']||k['arrowleft']||k['arrowright']||k['w']||k['s']||k['a']||k['d']||k['z']||k['q'];
    const bob  = moving ? Math.sin(t/100)*3 : Math.sin(t/600)*1.2;
    const leg  = moving ? Math.sin(t/100)*14 : 0;
    const swing= swingRef.current;
    const flip = p.facing === 'left' ? -1 : 1;

    ctx.save();
    ctx.translate(p.x, p.y - bob);
    ctx.scale(flip, 1);

    // Ground shadow
    ctx.fillStyle='rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(0,18,14,5,0,0,Math.PI*2); ctx.fill();

    // Left leg
    ctx.save(); ctx.rotate(leg*Math.PI/180);
    ctx.fillStyle='#2e1f12'; ctx.fillRect(-7,4,7,17);
    ctx.fillStyle='#120b04'; ctx.fillRect(-9,19,10,5);
    ctx.restore();
    // Right leg
    ctx.save(); ctx.rotate(-leg*Math.PI/180);
    ctx.fillStyle='#2e1f12'; ctx.fillRect(0,4,7,17);
    ctx.fillStyle='#120b04'; ctx.fillRect(0,19,10,5);
    ctx.restore();

    // Body
    ctx.fillStyle='#3d5573';
    ctx.beginPath(); ctx.roundRect(-10,-9,20,15,[4]); ctx.fill();
    // Buttons
    ctx.fillStyle='#c8960e';
    [-7,0,7].forEach(oy=>{ ctx.beginPath(); ctx.arc(0,-7+oy,1.5,0,Math.PI*2); ctx.fill(); });

    // Pickaxe arm (left in right-facing orientation)
    const armRot = swing ? -55 : -12;
    ctx.save();
    ctx.translate(-10,-5); ctx.rotate(armRot*Math.PI/180);
    ctx.fillStyle='#3d5573'; ctx.fillRect(-4,0,7,14);
    // Handle
    ctx.fillStyle='#8b5e2c'; ctx.fillRect(-1,11,4,20);
    // Head
    ctx.save(); ctx.translate(0,30); ctx.rotate(-55*Math.PI/180);
    ctx.fillStyle='#8a9aa8'; ctx.fillRect(-2,-2,22,5);
    ctx.fillStyle='#e2e8f0';
    ctx.beginPath(); ctx.moveTo(19,-2); ctx.lineTo(27,0); ctx.lineTo(19,3); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.restore();

    // Satchel arm (right)
    ctx.save(); ctx.translate(10,-5); ctx.rotate(10*Math.PI/180);
    ctx.fillStyle='#3d5573'; ctx.fillRect(-3,0,7,14);
    // Sacoche
    ctx.fillStyle='#8b5e2c';
    ctx.beginPath(); ctx.roundRect(-1,12,14,10,[3]); ctx.fill();
    ctx.strokeStyle='#5c3d1a'; ctx.lineWidth=1; ctx.strokeRect(-0.5,12.5,13,9);
    // Ore count badge inside bag (small rect)
    const invCount = stRef.current.inventory;
    if (invCount > 0) {
      const ore = ORES[stRef.current.gameLevel-1];
      ctx.fillStyle=ore.col;
      ctx.beginPath(); ctx.arc(6,17,4,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();

    // Head
    ctx.fillStyle='#e8b896';
    ctx.beginPath(); ctx.arc(0,-19,10,0,Math.PI*2); ctx.fill();
    // Eyes
    ctx.fillStyle='#2d1a00';
    ctx.beginPath(); ctx.arc(-3,-20,1.5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(3,-20,1.5,0,Math.PI*2); ctx.fill();
    // Moustache
    ctx.fillStyle='#5c3d1a';
    ctx.beginPath(); ctx.moveTo(-7,-15); ctx.quadraticCurveTo(-3,-12,0,-15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(7,-15); ctx.quadraticCurveTo(3,-12,0,-15); ctx.stroke();

    // Beret
    ctx.fillStyle='#1a1a2e';
    ctx.beginPath(); ctx.ellipse(0,-29,13,7,0,Math.PI,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,-29,13,3.5,0,0,Math.PI*2); ctx.fill();
    // Pom-pom
    ctx.fillStyle='#c0392b'; ctx.beginPath(); ctx.arc(2,-34,3,0,Math.PI*2); ctx.fill();
    // Lantern lamp
    ctx.fillStyle='#f5c842'; ctx.beginPath(); ctx.arc(-6,-30,3,0,Math.PI*2); ctx.fill();
    const glow = ctx.createRadialGradient(-6,-30,0,-6,-30,10);
    glow.addColorStop(0,'rgba(245,200,66,0.45)'); glow.addColorStop(1,'rgba(245,200,66,0)');
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(-6,-30,10,0,Math.PI*2); ctx.fill();

    ctx.restore();
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  const ore      = ORES[gameLevel - 1];
  const progress = Math.min(100, Math.round((coins / ore.thr) * 100));
  const accuracy = qAnswered > 0 ? Math.round((qCorrect / qAnswered) * 100) : 0;

  return (
    <div className="flex flex-col items-center">
      {/* Title bar */}
      <div className="flex justify-between w-full max-w-[800px] mb-4 items-center">
        <button className="back-btn m-0" onClick={onBack}>\u2190 Quitter MineurFou</button>
        <h2 className="m-0 font-extrabold tracking-wider text-xl uppercase"
            style={{ color:'#d4a01a', textShadow:'0 2px 8px rgba(0,0,0,0.6)' }}>
          \u26CF\uFE0F MineurFou \u2014 Province de Francotopia
        </h2>
        <button onClick={toggleMusic}
          style={{ background: music ? '#d4a01a' : '#94a3b8', color:'white',
                   border:'none', padding:'8px 16px', borderRadius:'8px',
                   cursor:'pointer', fontWeight:'bold' }}>
          {music ? '\uD83C\uDFB5 Musique: ON' : '\uD83C\uDFB5 Musique: OFF'}
        </button>
      </div>

      <div className="mineur-container">
        <canvas ref={canvasRef} width={W} height={H} className="mineur-canvas" />

        {/* HUD */}
        <div className="mineur-hud">
          <div className="mineur-hud-panel">
            <span title="Livres gagnées">\uD83D\uDCB0 {coins}\u00A0\u00A3</span>
            <span title="Coups de pioche">\u26CF\uFE0F {digs}</span>
            <span title="Sacoche">{ore.icon} {inventory}/{MAX_INV}</span>
          </div>
          <div className="mineur-hud-panel">
            <span style={{ fontWeight:'bold', color: gameLevel===1?'#888':ore.col }}>
              Niv.{gameLevel} {ore.icon} {ore.name}
            </span>
            <span>{coins}\u00A0/\u00A0{ore.thr}\u00A0\u00A3</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:5, background:'#1e293b' }}>
          <div style={{ width:`${progress}%`, height:'100%',
                        background:`linear-gradient(90deg,${ore.col},${ore.hi})`,
                        transition:'width 0.6s ease' }} />
        </div>

        {/* Interaction hint */}
        {hint && !modal && (
          <div className="mineur-hint" onClick={handleInteract}>{hint}</div>
        )}

        {/* Level-up banner */}
        {levelMsg && <div className="mineur-levelup">{levelMsg}</div>}

        {/* ── MODALS ─── */}

        {modal === 'question' && currentQ && (
          <div className="mineur-overlay">
            <div className="mineur-modal">
              <h2>\u2615 Café Jojo \u2014 Jojo vous pose une question</h2>
              <p style={{ background:'#fef3c7', padding:'10px 14px', borderRadius:8,
                          fontWeight:'bold', fontSize:'0.97rem', color:'#1e293b' }}>
                {currentQ.q}
              </p>
              <div className="mineur-q-opts">
                {currentQ.opts.map((opt, i) => {
                  let cls = '';
                  if (qState !== null) cls = i === currentQ.ans ? 'mq-correct' : 'mq-wrong';
                  return (
                    <button key={i} className={cls} onClick={() => handleAnswer(i)}
                            disabled={qState !== null}>{opt}</button>
                  );
                })}
              </div>
              {qState === 'correct' && <p style={{ color:'#059669', fontWeight:'bold' }}>\u2705 Bravo ! +3 coups de pioche !</p>}
              {qState === 'wrong'   && <p style={{ color:'#dc2626', fontWeight:'bold' }}>\u274C Incorrect. Réponse correcte : <em>{currentQ.opts[currentQ.ans]}</em></p>}
            </div>
          </div>
        )}

        {modal === 'bureau' && (
          <div className="mineur-overlay">
            <div className="mineur-modal">
              <h2>\u2696\uFE0F Bureau des Mines</h2>
              <p>Minerai en sacoche : <strong>{inventory} {ore.icon} {ore.name}</strong></p>
              <p>Prix unitaire du {ore.name} : <strong>{ore.val}\u00A0\u00A3</strong></p>
              <p style={{ fontSize:'1.2rem', fontWeight:'bold', color:'#d4a01a', margin:'12px 0' }}>
                Total : {inventory * ore.val}\u00A0\u00A3
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:8 }}>
                <button className="mineur-btn mineur-btn-gold" onClick={sellOre} disabled={inventory===0}>
                  \uD83D\uDCB0 Vendre Tout
                </button>
                <button className="mineur-btn mineur-btn-red" onClick={() => setModal(null)}>Fermer</button>
              </div>
              {inventory === 0 && <p style={{ color:'#94a3b8', marginTop:10, fontSize:'0.9rem' }}>Votre sacoche est vide. Allez creuser d'abord !</p>}
            </div>
          </div>
        )}

        {modal === 'bag_full' && (
          <div className="mineur-overlay" onClick={() => setModal(null)}>
            <div className="mineur-modal">
              <div style={{ fontSize:50 }}>\uD83C\uDF92</div>
              <h2>Sacoche pleine !</h2>
              <p>Vous portez déjà {MAX_INV} unités de minerai.</p>
              <p>Allez vendre au <strong>\u2696\uFE0F Bureau des Mines</strong> avant de continuer.</p>
              <button className="mineur-btn mineur-btn-red" style={{ marginTop:14 }} onClick={() => setModal(null)}>D'accord</button>
            </div>
          </div>
        )}

        {modal === 'no_digs' && (
          <div className="mineur-overlay" onClick={() => setModal(null)}>
            <div className="mineur-modal">
              <div style={{ fontSize:50 }}>\u26CF\uFE0F</div>
              <h2>Plus de coups de pioche !</h2>
              <p>Retournez au <strong>\u2615 Café Jojo</strong> répondre aux questions pour regagner des coups de pioche.</p>
              <p style={{ color:'#64748b', fontSize:'0.9rem', marginTop:6 }}>Bonne réponse = +3 coups !</p>
              <button className="mineur-btn mineur-btn-red" style={{ marginTop:14 }} onClick={() => setModal(null)}>D'accord</button>
            </div>
          </div>
        )}

        {modal === 'victory' && (
          <div className="mineur-overlay">
            <div className="mineur-modal mineur-certificate">
              <div className="cert-header">
                <span style={{ fontSize:36 }}>\uD83C\uDFC6</span>
                <h2 className="cert-title">Certificat d'Aptitude Minière<br />de Francotopia</h2>
                <span style={{ fontSize:36 }}>\u26CF\uFE0F</span>
              </div>
              <hr className="cert-divider" />
              <p style={{ fontStyle:'italic', color:'#7c5200', margin:'4px 0', fontSize:'0.9rem' }}>Décerné à</p>
              <p style={{ fontFamily:'serif', fontSize:'1.4rem', fontWeight:'bold', color:'#3d2200', margin:'6px 0 12px' }}>
                L'Apprenti Mineur Émérite
              </p>
              <hr className="cert-divider" />
              <div className="cert-stats">
                <div className="cert-stat-row">
                  <span className="cert-stat-icon">\uD83D\uDCB0</span>
                  <span><strong>1 100 £</strong> gagnées à travers les quatre veines</span>
                </div>
                <div className="cert-stat-row">
                  <span className="cert-stat-icon">\u26CF\uFE0F</span>
                  <span><strong>{totalMined}</strong> unités de minerai extraites</span>
                </div>
                <div className="cert-stat-row">
                  <span className="cert-stat-icon">\uD83D\uDCCA</span>
                  <span>Précision au Café Jojo : <strong>{accuracy}%</strong> ({qCorrect}/{qAnswered})</span>
                </div>
              </div>
              <hr className="cert-divider" />
              <p className="cert-honor">« Maître Mineur Émérite de la Province de Francotopia »</p>
              <div className="cert-btn-row">
                <button className="mineur-btn mineur-btn-gold" onClick={resetGame}>\uD83D\uDD04 Rejouer</button>
                <button className="mineur-btn mineur-btn-red"  onClick={onBack}>\u2715 Fermer</button>
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="mt-4 text-center max-w-[800px] text-gray-600">
        <p>
          <strong>Règles :</strong>{' '}
          Allez au <strong>\u2615 Café Jojo</strong> (Ouest) pour obtenir des coups de pioche ·
          Creusez le <strong>\u26CF\uFE0F Tas de Minerai</strong> (Nord) ·
          Vendez au <strong>\u2696\uFE0F Bureau des Mines</strong> (Est) · Gagnez <strong>1 100 £</strong> pour finir.
        </p>
      </div>
    </div>
  );
}
