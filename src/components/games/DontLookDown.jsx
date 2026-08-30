import React, { useRef, useEffect, useState } from 'react';
import './DontLookDown.css';
import { UNIT_2_VOCAB } from '../../data/vocabulary';

// --- GAME CONSTANTS ---
const GRAVITY = 1500;
const JUMP_FORCE = -750;
const MOVE_SPEED = 200;
const WIDTH = 800;
const HEIGHT = 600;
const TOTAL_HEIGHT = 6000;

// Levels (Zones) with Hergé Tintin Ligne Claire City Backgrounds:
// Z1: 6000 to 4500 -> Paris (Tour Eiffel, Seine, Toits Haussmanniens)
// Z2: 4500 to 3000 -> Vieux-Québec (Château Frontenac, Remparts, Saint-Laurent)
// Z3: 3000 to 1500 -> Montréal (La Biosphère, Pont Jacques-Cartier, Mont-Royal)
// Z4: 1500 to 0    -> Genève (Le Jet d'Eau, Lac Léman, Alpes)

const GRAMMAR_QUESTIONS = [
  { q: "Je ___ (aller) au cinéma.", opts: ["vais", "vas", "va"], ans: 0 },
  { q: "Tu ___ (avoir) un stylo ?", opts: ["a", "as", "ai"], ans: 1 },
  { q: "Il ___ (être) très intelligent.", opts: ["est", "es", "suis"], ans: 0 },
  { q: "Nous ___ (faire) du sport.", opts: ["faisons", "faites", "font"], ans: 0 },
  { q: "Vous ___ (pouvoir) m'aider ?", opts: ["pouvez", "pouvons", "peuvent"], ans: 0 },
  { q: "Ils ___ (vouloir) un croissant.", opts: ["voulons", "voulez", "veulent"], ans: 2 },
  { q: "Je ___ (devoir) partir maintenant.", opts: ["dois", "doit", "devons"], ans: 0 },
  { q: "Elle ___ (savoir) la réponse.", opts: ["sais", "sait", "savent"], ans: 1 },
  { q: "Nous ___ (voir) la Tour Eiffel.", opts: ["voyons", "voyez", "voient"], ans: 0 },
  { q: "Tu ___ (prendre) le métro ?", opts: ["prends", "prend", "prenons"], ans: 0 },
  { q: "Vous ___ (mettre) un manteau.", opts: ["mettons", "mettez", "mettent"], ans: 1 },
  { q: "Ils ___ (lire) un livre.", opts: ["lit", "lisons", "lisent"], ans: 2 },
  { q: "Je ___ (dire) la vérité.", opts: ["dis", "dit", "disons"], ans: 0 },
  { q: "Tu ___ (écrire) une lettre.", opts: ["écris", "écrit", "écrivent"], ans: 0 },
  { q: "Elle ___ (venir) de Paris.", opts: ["viens", "vient", "venons"], ans: 1 },
  { q: "Nous ___ (tenir) la corde.", opts: ["tenons", "tenez", "tiennent"], ans: 0 },
  { q: "Vous ___ (connaître) ce film ?", opts: ["connaissez", "connais", "connaissent"], ans: 0 }
];

const VOCAB_QUESTIONS = UNIT_2_VOCAB.slice(0, 17).map(v => {
  const opts = [v.word, ...v.wrongOptions].sort(() => Math.random() - 0.5);
  return {
    q: `Vocabulaire: "${v.definition}"`,
    opts: opts,
    ans: opts.indexOf(v.word)
  };
});

const QUESTIONS = [...GRAMMAR_QUESTIONS, ...VOCAB_QUESTIONS];

const generatePlatforms = () => {
  const platforms = [];
  platforms.push({ id: 'ground', x: 0, y: TOTAL_HEIGHT, w: WIDTH, h: 40, type: 'castle' });
  
  const addCheckpoint = (level, yPos, isStart = false) => {
    if (!isStart) {
      platforms.push({ id: `chk_${level}_floor`, x: WIDTH/2 - 150, y: yPos, w: 300, h: 40, type: 'castle' });
    }
    platforms.push({ id: `chk_${level}_barrier`, x: 0, y: yPos - 150, w: WIDTH, h: 20, type: 'barrier', level: level });
    platforms.push({ id: `chk_${level}_sensor`, x: WIDTH/2 - 60, y: yPos - 80, w: 120, h: 80, type: 'sensor', level: level });
  };

  addCheckpoint(0, TOTAL_HEIGHT, true);

  let currentY = TOTAL_HEIGHT - 220;
  let idCounter = 1;
  let hasGate4500 = false;
  let hasGate3000 = false;
  let hasGate1500 = false;
  let hasVictory = false;

  while (currentY > 100) {
    if (!hasGate4500 && currentY <= 4650) {
       platforms.push({ id: `plat_${idCounter++}`, x: 80, y: 4620, w: 140, h: 30, type: 'castle' });
       addCheckpoint(1, 4500);
       hasGate4500 = true;
       currentY = 4300;
       continue;
    }
    if (!hasGate3000 && currentY <= 3150) {
       platforms.push({ id: `plat_${idCounter++}`, x: 80, y: 3120, w: 140, h: 30, type: 'anvil' });
       addCheckpoint(2, 3000);
       hasGate3000 = true;
       currentY = 2800;
       continue;
    }
    if (!hasGate1500 && currentY <= 1650) {
       platforms.push({ id: `plat_${idCounter++}`, x: 80, y: 1620, w: 140, h: 30, type: 'towel' });
       addCheckpoint(3, 1500);
       hasGate1500 = true;
       currentY = 1300;
       continue;
    }
    if (!hasVictory && currentY <= 250) {
       platforms.push({ id: `plat_${idCounter++}`, x: 80, y: 220, w: 140, h: 30, type: 'book' });
       platforms.push({ id: 'victory_pad', x: WIDTH/2 - 200, y: 100, w: 400, h: 40, type: 'victory' });
       hasVictory = true;
       break;
    }

    const w = 130 + Math.random() * 20;
    const cycle = (currentY % 750) / 750;
    let t = cycle * 2;
    if (t > 1) t = 2 - t;
    
    let pathCenter = 150 + t * 500; 
    let x = pathCenter - w/2; 
    
    if (x < 10) x = 10;
    if (x + w > WIDTH - 10) x = WIDTH - w - 10;
    
    let type = 'castle';
    if (currentY <= 4500 && currentY > 3000) {
       const medievalTypes = ['table', 'banner', 'platter', 'anvil'];
       type = medievalTypes[Math.floor(Math.random() * medievalTypes.length)];
    } else if (currentY <= 3000 && currentY > 1500) {
       const beachTypes = ['towel', 'longchair', 'umbrella', 'sandcastle'];
       type = beachTypes[Math.floor(Math.random() * beachTypes.length)];
    } else if (currentY <= 1500) {
       const classTypes = ['desk', 'blackboard', 'book', 'ruler'];
       type = classTypes[Math.floor(Math.random() * classTypes.length)];
    }
    
    platforms.push({ id: `plat_${idCounter++}`, x, y: currentY, w, h: 30, type });
    currentY -= (90 + Math.random() * 30);
  }
  return platforms;
};

export default function DontLookDown({ onBack }) {
  const canvasRef = useRef(null);
  
  const [activeModal, setActiveModal] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [qState, setQState] = useState(null);
  const [questionsToPass, setQuestionsToPass] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [interactionHint, setInteractionHint] = useState(null);
  const [currentInteraction, setCurrentInteraction] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  
  const platformsRef = useRef(generatePlatforms());
  const gatesClearedRef = useRef({ 0: false, 1: false, 2: false, 3: false });
  const gameLoopRef = useRef(null);
  const keys = useRef({});
  const audioElRef = useRef(null);
  const unusedQuestionsRef = useRef([...Array(QUESTIONS.length).keys()]);
  const texturesRef = useRef({});

  useEffect(() => {
    const loadTex = (name, url) => {
      const img = new Image();
      img.src = url;
      texturesRef.current[name] = img;
    };
    loadTex('bg_paris', '/assets/dld_bg_paris.jpg');
    loadTex('bg_quebec', '/assets/dld_bg_quebec.jpg');
    loadTex('bg_montreal', '/assets/dld_bg_montreal.jpg');
    loadTex('bg_geneva', '/assets/dld_bg_geneva.jpg');
  }, []);

  const playerRef = useRef({
    x: WIDTH / 2,
    y: TOTAL_HEIGHT - 30,
    vx: 0,
    vy: 0,
    size: 30,
    facingRight: true,
    isGrounded: false,
    jumpsRemaining: 2
  });

  const cameraRef = useRef({ y: TOTAL_HEIGHT - HEIGHT });
  const stateRef = useRef({ activeModal, currentInteraction });

  useEffect(() => {
    stateRef.current = { activeModal, currentInteraction };
  }, [activeModal, currentInteraction]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isModalActive = stateRef.current.activeModal;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (!isModalActive) e.preventDefault();
      }
      
      const key = e.key.toLowerCase();
      
      if (!isModalActive && !keys.current[key]) {
        if (key === 'w' || key === 'z' || key === 'arrowup' || key === ' ') {
          if (key === ' ' && stateRef.current.currentInteraction) {
            triggerGate(stateRef.current.currentInteraction.level);
            keys.current[key] = true;
            return;
          }

          const p = playerRef.current;
          if (p.isGrounded) {
            p.vy = JUMP_FORCE;
            p.isGrounded = false;
            p.jumpsRemaining = 1;
          } else if (p.jumpsRemaining > 0) {
            p.vy = JUMP_FORCE * 0.9;
            p.jumpsRemaining = 0;
          }
        }
      }
      
      keys.current[key] = true;
    };
    const handleKeyUp = (e) => keys.current[e.key.toLowerCase()] = false;

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  useEffect(() => {
    const audio = new window.Audio('/music/golden_waystone.mp3');
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
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      update(dt);
      draw(ctx, time);

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
  }, []);

  const triggerGate = (level) => {
    if (gatesClearedRef.current[level]) return;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    setQuestionsToPass(5);
    setCorrectAnswers(0);
    askQuestion();
  };

  const askQuestion = () => {
    if (unusedQuestionsRef.current.length === 0) {
      unusedQuestionsRef.current = [...Array(QUESTIONS.length).keys()];
    }
    const idxInUnused = Math.floor(Math.random() * unusedQuestionsRef.current.length);
    const qIndex = unusedQuestionsRef.current.splice(idxInUnused, 1)[0];
    
    setCurrentQ(QUESTIONS[qIndex]);
    setQState(null);
    setActiveModal('question');
  };

  const handleAnswer = (ansIdx) => {
    if (qState !== null) return;
    
    if (ansIdx === currentQ.ans) {
      setQState('correct');
      const newCorrect = correctAnswers + 1;
      setCorrectAnswers(newCorrect);
      
      setTimeout(() => {
        if (newCorrect >= 5) {
          gatesClearedRef.current[currentInteraction.level] = true;
          setActiveModal(null);
        } else {
          askQuestion();
        }
      }, 700);
    } else {
      setQState('wrong');
      setTimeout(() => {
        askQuestion();
      }, 1000);
    }
  };

  const update = (dt) => {
    if (stateRef.current.activeModal) return;

    const p = playerRef.current;

    if (keys.current['a'] || keys.current['q'] || keys.current['arrowleft']) {
      p.vx = -MOVE_SPEED;
      p.facingRight = false;
    } else if (keys.current['d'] || keys.current['arrowright']) {
      p.vx = MOVE_SPEED;
      p.facingRight = true;
    } else {
      p.vx = 0;
    }

    p.vy += GRAVITY * dt;

    let newX = p.x + p.vx * dt;
    let newY = p.y + p.vy * dt;

    if (newX < p.size/2) newX = p.size/2;
    if (newX > WIDTH - p.size/2) newX = WIDTH - p.size/2;

    p.isGrounded = false;
    let activeSensor = null;

    for (let plat of platformsRef.current) {
      const phx = p.size/2;
      const phy = p.size/2;
      const plhx = plat.w/2;
      const plhy = plat.h/2;

      const pcx = newX;
      const pcy = newY;
      const plcx = plat.x + plhx;
      const plcy = plat.y + plhy;

      const dx = pcx - plcx;
      const dy = pcy - plcy;

      const intersectX = Math.abs(dx) - (phx + plhx);
      const intersectY = Math.abs(dy) - (phy + plhy);

      if (intersectX < 0 && intersectY < 0) {
        if (plat.type === 'sensor') {
          if (!gatesClearedRef.current[plat.level]) {
             activeSensor = plat;
          }
          continue;
        }

        if (plat.type === 'victory') {
           if (!stateRef.current.activeModal) {
              setActiveModal('victory');
           }
        }

        if (plat.type === 'barrier' && gatesClearedRef.current[plat.level]) {
          continue;
        }

        if (intersectX > intersectY) {
          if (dx > 0) { newX -= intersectX; p.vx = 0; }
          else { newX += intersectX; p.vx = 0; }
        } else {
          if (dy > 0) { newY -= intersectY; p.vy = 0; }
          else { 
            newY += intersectY; 
            p.vy = 0; 
            p.isGrounded = true; 
            p.jumpsRemaining = 2; 
          }
        }
      }
    }

    let catchY = TOTAL_HEIGHT;
    if (gatesClearedRef.current[3]) catchY = 1500;
    else if (gatesClearedRef.current[2]) catchY = 3000;
    else if (gatesClearedRef.current[1]) catchY = 4500;
    
    if (newY > catchY + 100) {
       newY = catchY - 50;
       newX = WIDTH / 2;
       p.vy = 0;
    }

    p.x = newX;
    p.y = newY;

    if (activeSensor) {
      setInteractionHint("Appuyez sur ESPACE pour ouvrir la Porte !");
      setCurrentInteraction(activeSensor);
    } else {
      setInteractionHint(null);
      setCurrentInteraction(null);
    }

    const camTarget = p.y - HEIGHT * 0.6;
    if (camTarget < cameraRef.current.y) {
       cameraRef.current.y = camTarget;
    } else {
       cameraRef.current.y += (camTarget - cameraRef.current.y) * 0.1;
    }
    
    if (cameraRef.current.y > TOTAL_HEIGHT - HEIGHT) cameraRef.current.y = TOTAL_HEIGHT - HEIGHT;
    if (cameraRef.current.y < 0) cameraRef.current.y = 0;
  };

  // --- DRAW HERGÉ TINTIN LIGNE CLAIRE CITY BACKGROUNDS ---
  const drawCityBackground = (ctx, camY) => {
    ctx.save();
    
    let key = 'bg_paris';
    let titleText = "🇫🇷 PARIS — Tintin Ligne Claire";

    if (camY > 4500) {
      key = 'bg_paris';
      titleText = "🇫🇷 PARIS (Tour Eiffel & Bords de Seine)";
    } else if (camY > 3000) {
      key = 'bg_quebec';
      titleText = "⚜️ VIEUX-QUÉBEC (Château Frontenac & Remparts)";
    } else if (camY > 1500) {
      key = 'bg_montreal';
      titleText = "🇨🇦 MONTRÉAL (La Biosphère & Pont Jacques-Cartier)";
    } else {
      key = 'bg_geneva';
      titleText = "🇨🇭 GENÈVE (Le Jet d'Eau & Lac Léman)";
    }

    const img = texturesRef.current[key];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    // Title Badge (Herge Album Banner Style)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(15, 15, 420, 36);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 420, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(titleText, 28, 38);

    ctx.restore();
  };

  // --- DRAW FUNCTION ---
  const draw = (ctx, time) => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    const camY = cameraRef.current.y;

    // --- Draw Hergé Tintin City Backgrounds ---
    drawCityBackground(ctx, camY);

    ctx.save();
    ctx.translate(0, -cameraRef.current.y);

    // --- Helper 3D Arcade Box Drawer ---
    const drawArcade3DBlock = (x, y, w, h, topColor, sideColor, rimColor) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 6;

      ctx.fillStyle = sideColor;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, w - 4, h/2, [6, 6, 2, 2]);
      ctx.fill();

      if (rimColor) {
        ctx.strokeStyle = rimColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);
      }
      ctx.restore();
    };

    // --- Helper Turbo Arrows Drawer (`>>>`) ---
    const drawTurboArrows = (x, y, w, h, color = '#facc15') => {
      ctx.save();
      ctx.fillStyle = color;
      const arrowCount = Math.max(1, Math.floor(w / 35));
      const spacing = w / (arrowCount + 1);
      const pulse = Math.sin(time / 150) * 3;
      for (let i = 1; i <= arrowCount; i++) {
        const ax = x + spacing * i;
        const ay = y + h / 2;
        ctx.beginPath();
        ctx.moveTo(ax - 8, ay - 6 + pulse);
        ctx.lineTo(ax + 2, ay + pulse);
        ctx.lineTo(ax - 8, ay + 6 + pulse);
        ctx.lineTo(ax - 3, ay + pulse);
        ctx.fill();
      }
      ctx.restore();
    };

    // --- Helper Red & White Checkered Kerb Drawer ---
    const drawCheckeredKerb = (x, y, w, h = 6) => {
      ctx.save();
      const squareW = 10;
      let toggle = false;
      for (let bx = x; bx < x + w; bx += squareW) {
        ctx.fillStyle = toggle ? '#ef4444' : '#ffffff';
        ctx.fillRect(bx, y, Math.min(squareW, x + w - bx), h);
        toggle = !toggle;
      }
      ctx.restore();
    };

    // --- DRAW PLATFORMS ---
    for (let plat of platformsRef.current) {
      if (plat.y + plat.h < cameraRef.current.y || plat.y > cameraRef.current.y + HEIGHT + 200) continue;

      if (plat.type === 'castle') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#334155', '#1e293b', '#64748b');
        drawCheckeredKerb(plat.x, plat.y, plat.w, 5);
        drawCheckeredKerb(plat.x, plat.y + plat.h - 5, plat.w, 5);
        drawTurboArrows(plat.x, plat.y + 4, plat.w, plat.h - 8, '#facc15');

      } else if (plat.type === 'table') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#f59e0b', '#b45309', '#fef08a');
        ctx.save();
        ctx.fillStyle = '#1e293b';
        for (let bx = plat.x + 10; bx < plat.x + plat.w - 10; bx += 24) {
          ctx.beginPath();
          ctx.moveTo(bx, plat.y);
          ctx.lineTo(bx + 8, plat.y);
          ctx.lineTo(bx - 4, plat.y + plat.h);
          ctx.lineTo(bx - 12, plat.y + plat.h);
          ctx.fill();
        }
        ctx.restore();

      } else if (plat.type === 'banner') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#dc2626', '#991b1b', '#fca5a5');
        ctx.save();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(plat.x + plat.w/2, plat.y + plat.h/2, 10, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★', plat.x + plat.w/2, plat.y + plat.h/2 + 4);
        ctx.restore();

      } else if (plat.type === 'platter') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#fbbf24', '#d97706', '#fef08a');
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(plat.x + plat.w/2, plat.y + plat.h/2, 8, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();

      } else if (plat.type === 'anvil') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#38bdf8', '#0284c7', '#bae6fd');
        drawTurboArrows(plat.x, plat.y, plat.w, plat.h, '#ffffff');

      } else if (plat.type === 'towel') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#ec4899', '#be185d', '#fbcfe8');
        ctx.save();
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
        const stripeW = plat.w / colors.length;
        colors.forEach((c, idx) => {
          ctx.fillStyle = c;
          ctx.fillRect(plat.x + idx * stripeW, plat.y + 4, stripeW, plat.h - 8);
        });
        ctx.restore();

      } else if (plat.type === 'longchair') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#ef4444', '#991b1b', '#ffffff');
        drawCheckeredKerb(plat.x, plat.y, plat.w, 4);

      } else if (plat.type === 'umbrella') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#10b981', '#047857', '#a7f3d0');
        ctx.save();
        ctx.fillStyle = '#ffffff';
        for (let bx = plat.x + 15; bx < plat.x + plat.w - 10; bx += 25) {
          ctx.beginPath();
          ctx.arc(bx, plat.y + plat.h/2, 4, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.restore();

      } else if (plat.type === 'sandcastle') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#f59e0b', '#b45309', '#fef08a');
        drawTurboArrows(plat.x, plat.y, plat.w, plat.h, '#ffffff');

      } else if (plat.type === 'desk') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#8b5cf6', '#6d28d9', '#ddd6fe');
        drawTurboArrows(plat.x, plat.y, plat.w, plat.h, '#facc15');

      } else if (plat.type === 'blackboard') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#065f46', '#044e37', '#34d399');
        ctx.save();
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ SPEED TURBO ⚡', plat.x + plat.w/2, plat.y + plat.h/2 + 4);
        ctx.restore();

      } else if (plat.type === 'book') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#1e40af', '#1e3a8a', '#93c5fd');
        drawTurboArrows(plat.x, plat.y, plat.w, plat.h, '#facc15');

      } else if (plat.type === 'ruler') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#facc15', '#ca8a04', '#ffffff');
        drawCheckeredKerb(plat.x, plat.y, plat.w, plat.h);

      } else if (plat.type === 'barrier') {
        if (!gatesClearedRef.current[plat.level]) {
          ctx.save();
          const pulse = Math.sin(time/120) * 0.2 + 0.7;
          ctx.fillStyle = `rgba(236, 72, 153, ${pulse})`;
          ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);

          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 2;
          for (let bx = plat.x; bx < plat.x + plat.w; bx += 30) {
            ctx.beginPath();
            ctx.moveTo(bx, plat.y);
            ctx.lineTo(bx + 15, plat.y + plat.h);
            ctx.stroke();
          }
          ctx.restore();
        }
      } else if (plat.type === 'sensor') {
        if (!gatesClearedRef.current[plat.level]) {
          ctx.save();
          const bounceY = Math.sin(time / 200) * 6;
          const boxX = plat.x + plat.w/2 - 25;
          const boxY = plat.y + plat.h/2 - 25 + bounceY;
          const boxSize = 50;

          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 20;

          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, boxSize, boxSize, 10);
          ctx.fill();

          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.roundRect(boxX + 3, boxY + 3, boxSize - 6, boxSize - 6, 8);
          ctx.fill();

          ctx.fillStyle = '#78350f';
          const rivets = [
            [boxX + 7, boxY + 7],
            [boxX + boxSize - 7, boxY + 7],
            [boxX + 7, boxY + boxSize - 7],
            [boxX + boxSize - 7, boxY + boxSize - 7]
          ];
          rivets.forEach(([rx, ry]) => {
            ctx.beginPath();
            ctx.arc(rx, ry, 2.5, 0, Math.PI*2);
            ctx.fill();
          });

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetY = 2;
          ctx.font = 'bold 30px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('?', boxX + boxSize/2, boxY + boxSize/2 + 10);
          ctx.restore();
        }

      } else if (plat.type === 'victory') {
        drawArcade3DBlock(plat.x, plat.y, plat.w, plat.h, '#f59e0b', '#b45309', '#fef08a');
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.fillText('🏆 GRAND PRIX SOMMET 🏆', plat.x + plat.w/2, plat.y + 26);
        ctx.restore();
      }
    }

    // --- DRAW HAMSTER (KEEP EXACT SAME CHARACTER) ---
    const p = playerRef.current;
    const py = p.y;
    
    ctx.save();
    ctx.translate(p.x, py);
    if (!p.facingRight) ctx.scale(-1, 1);
    
    const scaleRatio = p.size / 24;
    ctx.scale(scaleRatio, scaleRatio);

    ctx.shadowColor = 'transparent';

    if (p.isGrounded) {
       ctx.fillStyle = 'rgba(0,0,0,0.3)';
       ctx.beginPath();
       ctx.ellipse(0, p.size/2 + 2, p.size/1.5, 4, 0, 0, Math.PI*2);
       ctx.fill();
    }

    // Ears
    ctx.fillStyle = '#d97706'; 
    ctx.beginPath();
    ctx.arc(-8, -10, 7, 0, Math.PI * 2);
    ctx.arc(8, -10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbcfe8'; // Inner ear
    ctx.beginPath();
    ctx.arc(-8, -10, 4, 0, Math.PI * 2);
    ctx.arc(8, -10, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Body (Radial gradient for 3D fur effect)
    let furGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, p.size/1.5);
    furGrad.addColorStop(0, '#fbbf24'); // Highlight
    furGrad.addColorStop(0.7, '#f59e0b'); // Base orange
    furGrad.addColorStop(1, '#b45309'); // Shadow edge
    
    ctx.fillStyle = furGrad;
    ctx.beginPath();
    ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Belly
    let bellyGrad = ctx.createRadialGradient(0, 4, 1, 0, 4, p.size/2.5);
    bellyGrad.addColorStop(0, '#ffffff');
    bellyGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bellyGrad;
    ctx.beginPath();
    ctx.arc(0, 4, p.size/2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(4, -4, 3, 0, Math.PI*2); // Big eye
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(5, -5, 1.2, 0, Math.PI*2); // Catchlight
    ctx.fill();

    // Nose & Whiskers
    ctx.fillStyle = '#f472b6'; 
    ctx.beginPath();
    ctx.arc(10, 1, 2.5, 0, Math.PI*2);
    ctx.fill();
    
    // Whiskers
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(9, 1); ctx.lineTo(16, -2);
    ctx.moveTo(9, 1.5); ctx.lineTo(17, 1.5);
    ctx.moveTo(9, 2); ctx.lineTo(15, 5);
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[800px] mb-4 items-center">
        <button className="back-btn m-0" onClick={onBack}>← Quitter</button>
        <h2 className="text-accent m-0 font-extrabold tracking-wider text-2xl uppercase" style={{ color: '#facc15', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          🏁 Ne Regarde Pas En Bas (Unité 2)
        </h2>
      </div>

      <div className="dld-container" style={{ '--cam-y': cameraRef.current ? cameraRef.current.y : 0 }}>
        
        <div className="dld-hud">
          <div className="hud-panel">
            <span>🏁 Altitude : {Math.max(0, Math.floor((TOTAL_HEIGHT - HEIGHT - cameraRef.current.y)/10))}m</span>
          </div>
          <button 
            onClick={toggleMusic}
            className="hud-panel cursor-pointer hover:bg-gray-100 transition border-0"
            style={{ pointerEvents: 'auto' }}
          >
            {musicPlaying ? '🎵 Musique: ON' : '🎵 Musique: OFF'}
          </button>
        </div>

        <canvas 
          ref={canvasRef} 
          width={WIDTH} 
          height={HEIGHT} 
          className="dld-canvas"
        />

        {interactionHint && !activeModal && (
          <div className="interaction-hint">
            {interactionHint}
          </div>
        )}

        {/* MODALS */}
        {activeModal === 'question' && currentQ && (
          <div className="game-overlay">
            <div className="modal-content arcade-modal">
              <h2 className="text-amber-400">❓ Boîte Mystère Grammaire</h2>
              <p className="text-sm text-gray-700 mb-2 font-bold">Réponses correctes requises : {correctAnswers} / 5</p>
              <p className="text-lg mb-4 text-slate-900 font-extrabold">{currentQ.q}</p>
              
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
            </div>
          </div>
        )}

        {activeModal === 'victory' && (
          <div className="game-overlay" onClick={onBack}>
            <div className="modal-content arcade-modal">
              <h2 className="text-amber-400 text-3xl font-black">🏆 VICTOIRE DU GRAND PRIX ! 🏆</h2>
              <p className="text-lg font-bold text-slate-800">Félicitations ! Vous avez atteint le sommet ultime du circuit sans jamais regarder en bas !</p>
              <p className="text-sm italic mt-4 opacity-75">(Cliquez pour quitter)</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center max-w-[800px] text-gray-600">
        <p><strong>Comment jouer :</strong> Utilisez A/D ou les Flèches Gauche/Droite pour vous déplacer. Espace ou W pour sauter ! Montez le plus haut possible sur le circuit. Aux Boîtes Mystères ❓, répondez aux questions de grammaire pour franchir les portes laser !</p>
      </div>
    </div>
  );
}
