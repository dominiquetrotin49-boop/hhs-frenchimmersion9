import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Play, RotateCcw, Volume2, Shield, Zap, Star, Flame, Award, ChevronRight, CheckCircle2, XCircle, Coins, Compass, Clock, Target, Gamepad2 } from 'lucide-react';
import './SpeedRunnerPrepositions.css';

export default function SpeedRunnerPrepositions() {
  // Prepositions Question Bank for Reprise (40 Unique Sentences)
  const masterQuestionBank = [
    {
      id: 1,
      textBefore: "Cet été, Thomas est allé ",
      textAfter: " France avec sa famille.",
      target: "en",
      options: ["en", "à", "dans"],
      ruleTip: "💡 Règle : Devant un pays féminin qui se termine par 'e' (la France, l'Italie), on utilise la préposition 'en' !"
    },
    {
      id: 2,
      textBefore: "Le week-end, nous aimons aller ",
      textAfter: " pied au grand parc.",
      target: "à",
      options: ["à", "en", "par"],
      ruleTip: "💡 Règle : Pour les moyens de transport individuels et ouverts, on utilise 'à' (à pied, à vélo, à cheval)."
    },
    {
      id: 3,
      textBefore: "Elle travaille ",
      textAfter: " le médecin depuis plusieurs mois.",
      target: "chez",
      options: ["chez", "dans", "à"],
      ruleTip: "💡 Règle : Quand on va ou travaille auprès d'une personne ou d'une profession, on utilise 'chez' !"
    },
    {
      id: 4,
      textBefore: "Ils sont arrivés au collège ",
      textAfter: " retard ce matin.",
      target: "en",
      options: ["en", "à", "de"],
      ruleTip: "💡 Règle : L'expression fixe d'état est 'en retard' (et 'en avance')."
    },
    {
      id: 5,
      textBefore: "Mon meilleur ami habite ",
      textAfter: " Paris depuis deux ans.",
      target: "à",
      options: ["à", "en", "dans"],
      ruleTip: "💡 Règle : Devant un nom de ville (Paris, Montréal, Tokyo), on utilise toujours la préposition 'à' !"
    },
    {
      id: 6,
      textBefore: "Nous partons en vacances ",
      textAfter: " avion vers le Sud.",
      target: "en",
      options: ["en", "par", "avec"],
      ruleTip: "💡 Règle : Pour les moyens de transport fermés où l'on entre à l'intérieur, on utilise 'en' (en avion, en train, en voiture)."
    },
    {
      id: 7,
      textBefore: "Elle parle français ",
      textAfter: " beaucoup d'enthousiasme.",
      target: "avec",
      options: ["avec", "sans", "pour"],
      ruleTip: "💡 Règle : Pour exprimer la manière positive ou l'accompagnement, on utilise 'avec' !"
    },
    {
      id: 8,
      textBefore: "Le petit chat dort calmement ",
      textAfter: " la table du salon.",
      target: "sous",
      options: ["sous", "sur", "entre"],
      ruleTip: "💡 Règle : 'Sous' indique la position inférieure (under), alors que 'sur' indique la position supérieure (on)."
    },
    {
      id: 9,
      textBefore: "Il étudie tous les soirs ",
      textAfter: " réussir ses examens d'immersion.",
      target: "pour",
      options: ["pour", "par", "en"],
      ruleTip: "💡 Règle : 'Pour' + verbe à l'infinitif exprime le but ou l'objectif (in order to)."
    },
    {
      id: 10,
      textBefore: "Les élèves s'attendent joyeusement ",
      textAfter: " le collège.",
      target: "devant",
      options: ["devant", "chez", "sous"],
      ruleTip: "💡 Règle : 'Devant' exprime la position spatiale en face d'un lieu (in front of)."
    },
    {
      id: 11,
      textBefore: "Mon sac à dos de cours est posé ",
      textAfter: " ma chaise.",
      target: "sur",
      options: ["sur", "sous", "dans"],
      ruleTip: "💡 Règle : 'Sur' indique le contact en hauteur (on top of)."
    },
    {
      id: 12,
      textBefore: "Cette belle histoire a été rédigée ",
      textAfter: " un auteur très célèbre.",
      target: "par",
      options: ["par", "pour", "de"],
      ruleTip: "💡 Règle : À la voix passive, l'agent qui fait l'action est introduit par 'par' (by)."
    },
    {
      id: 13,
      textBefore: "Elle ne peut pas voyager ",
      textAfter: " sa musique préférée.",
      target: "sans",
      options: ["sans", "avec", "dans"],
      ruleTip: "💡 Règle : 'Sans' exprime l'absence ou la privation (without)."
    },
    {
      id: 14,
      textBefore: "Le château magique se trouve ",
      textAfter: " la forêt et la rivière.",
      target: "entre",
      options: ["entre", "dans", "chez"],
      ruleTip: "💡 Règle : 'Entre' indique l'espace situé au milieu de deux éléments (between)."
    },
    {
      id: 15,
      textBefore: "Mes cousins habitent ",
      textAfter: " Canada depuis plusieurs années.",
      target: "au",
      options: ["au", "en", "à"],
      ruleTip: "💡 Règle : Devant un pays masculin (le Canada, le Japon), 'à + le' devient 'au' !"
    },
    {
      id: 16,
      textBefore: "Nous allons faire un beau voyage ",
      textAfter: " Italie le mois prochain.",
      target: "en",
      options: ["en", "à", "dans"],
      ruleTip: "💡 Règle : Devant un pays féminin (l'Italie), on utilise la préposition 'en' !"
    },
    {
      id: 17,
      textBefore: "Il est rentré directement ",
      textAfter: " lui après le cours de musique.",
      target: "chez",
      options: ["chez", "dans", "à"],
      ruleTip: "💡 Règle : 'Chez lui / chez elle' indique sa propre maison ou demeure."
    },
    {
      id: 18,
      textBefore: "Le grimoire magique est caché ",
      textAfter: " le tiroir du bureau.",
      target: "dans",
      options: ["dans", "sur", "à"],
      ruleTip: "💡 Règle : 'Dans' indique la contenance à l'intérieur d'un objet ou espace (inside)."
    },
    {
      id: 19,
      textBefore: "Elle répond aux questions du quiz ",
      textAfter: " grande précision.",
      target: "avec",
      options: ["avec", "sans", "par"],
      ruleTip: "💡 Règle : 'Avec' caractérise la manière et l'attitude."
    },
    {
      id: 20,
      textBefore: "Les aventuriers sont passés ",
      textAfter: " le petit pont en bois.",
      target: "par",
      options: ["par", "pour", "en"],
      ruleTip: "💡 Règle : 'Passer par' indique le lieu de passage ou le chemin emprunté (through / via)."
    },
    {
      id: 21,
      textBefore: "Pendant les vacances, nous sommes allés ",
      textAfter: " Espagne.",
      target: "en",
      options: ["en", "à", "dans"],
      ruleTip: "💡 Règle : L'Espagne est un pays féminin (l'Espagne), donc on utilise 'en' !"
    },
    {
      id: 22,
      textBefore: "Tous les samedis, il joue au football ",
      textAfter: " ses amis du quartier.",
      target: "avec",
      options: ["avec", "sans", "pour"],
      ruleTip: "💡 Règle : 'Avec' exprime l'accompagnement et l'amitié !"
    },
    {
      id: 23,
      textBefore: "Les étudiants révisent dans le calme ",
      textAfter: " la bibliothèque.",
      target: "dans",
      options: ["dans", "sur", "chez"],
      ruleTip: "💡 Règle : 'Dans' indique la présence à l'intérieur d'un bâtiment ou d'une pièce."
    },
    {
      id: 24,
      textBefore: "Mon père a préparé un délicieux gâteau ",
      textAfter: " mon anniversaire.",
      target: "pour",
      options: ["pour", "par", "en"],
      ruleTip: "💡 Règle : 'Pour' exprime l'intention et le destinataire d'un cadeau ou événement."
    },
    {
      id: 25,
      textBefore: "La petite fille se cache ",
      textAfter: " les rideaux du salon.",
      target: "derrière",
      options: ["derrière", "devant", "sur"],
      ruleTip: "💡 Règle : 'Derrière' indique la position masquée à l'arrière (behind)."
    },
    {
      id: 26,
      textBefore: "Ils préfèrent voyager ",
      textAfter: " train plutôt qu'en voiture.",
      target: "en",
      options: ["en", "par", "avec"],
      ruleTip: "💡 Règle : Pour les transports collectifs fermés, on utilise 'en train'."
    },
    {
      id: 27,
      textBefore: "Nous avons mangé un excellent repas ",
      textAfter: " nos grands-parents.",
      target: "chez",
      options: ["chez", "dans", "à"],
      ruleTip: "💡 Règle : Pour désigner la maison d'une personne, on dit 'chez nos grands-parents'."
    },
    {
      id: 28,
      textBefore: "Le bus s'arrête juste ",
      textAfter: " l'entrée principale du musée.",
      target: "devant",
      options: ["devant", "sous", "entre"],
      ruleTip: "💡 Règle : 'Devant' exprime la présence en face d'un bâtiment (in front of)."
    },
    {
      id: 29,
      textBefore: "Elle a écrit un long message ",
      textAfter: " beaucoup de soin.",
      target: "avec",
      options: ["avec", "sans", "par"],
      ruleTip: "💡 Règle : 'Avec' exprime la manière méticuleuse d'accomplir une tâche."
    },
    {
      id: 30,
      textBefore: "Les deux grands arbres se trouvent ",
      textAfter: " la maison et le garage.",
      target: "entre",
      options: ["entre", "dans", "chez"],
      ruleTip: "💡 Règle : 'Entre' se place au milieu de deux objets distincts."
    },
    {
      id: 31,
      textBefore: "Mon livre de français est resté ",
      textAfter: " mon bureau d'école.",
      target: "sur",
      options: ["sur", "sous", "dans"],
      ruleTip: "💡 Règle : 'Sur' indique qu'il est posé sur la surface (on top of)."
    },
    {
      id: 32,
      textBefore: "Ils sont partis en voyage d'études ",
      textAfter: " Japon.",
      target: "au",
      options: ["au", "en", "à"],
      ruleTip: "💡 Règle : Le Japon est un pays masculin (le Japon), donc 'à + le' devient 'au' !"
    },
    {
      id: 33,
      textBefore: "Le chien s'est couché confortablement ",
      textAfter: " le lit.",
      target: "sous",
      options: ["sous", "sur", "entre"],
      ruleTip: "💡 Règle : 'Sous' indique la position couverte au sol (underneath)."
    },
    {
      id: 34,
      textBefore: "Cette chanson magnifique a été composée ",
      textAfter: " un artiste talentueux.",
      target: "par",
      options: ["par", "pour", "de"],
      ruleTip: "💡 Règle : L'auteur-compositeur à la voix passive est introduit par 'par'."
    },
    {
      id: 35,
      textBefore: "Il ne peut pas terminer ce travail ",
      textAfter: " l'aide de son équipe.",
      target: "sans",
      options: ["sans", "avec", "dans"],
      ruleTip: "💡 Règle : 'Sans' indique l'absence d'assistance (without)."
    },
    {
      id: 36,
      textBefore: "Nous devons être complètement prêts ",
      textAfter: " dix minutes.",
      target: "dans",
      options: ["dans", "en", "pour"],
      ruleTip: "💡 Règle : 'Dans + durée' exprime un moment futur précis (in 10 minutes)."
    },
    {
      id: 37,
      textBefore: "Elle habite ",
      textAfter: " Mexique avec toute sa famille.",
      target: "au",
      options: ["au", "en", "à"],
      ruleTip: "💡 Règle : Attention ! Le Mexique est un pays masculin (le Mexique), donc on dit 'au Mexique' !"
    },
    {
      id: 38,
      textBefore: "Le professeur explique la règle ",
      textAfter: " toute la classe.",
      target: "à",
      options: ["à", "en", "par"],
      ruleTip: "💡 Règle : Expliquer à quelqu'un se construit avec la préposition 'à'."
    },
    {
      id: 39,
      textBefore: "Ils ont marché joyeusement ",
      textAfter: " la forêt jusqu'au soir.",
      target: "dans",
      options: ["dans", "sur", "chez"],
      ruleTip: "💡 Règle : Marcher 'dans la forêt' exprime le déplacement à l'intérieur du bois."
    },
    {
      id: 40,
      textBefore: "Tu devrais toujours agir ",
      textAfter: " bienveillance envers tes camarades.",
      target: "avec",
      options: ["avec", "sans", "pour"],
      ruleTip: "💡 Règle : 'Avec bienveillance' exprime une qualité morale positive."
    }
  ];

  // Single Hero: Maya
  const mayaHero = { 
    id: 'maya', 
    name: 'Maya', 
    image: '/images/avatars/avatar_maya.jpg'
  };

  // Active question list (Shuffled per game session)
  const [questionBank, setQuestionBank] = useState(masterQuestionBank);

  // Game States
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'feedback', 'gameover'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lanePosition, setLanePosition] = useState(1); // 0: left, 1: middle, 2: right
  const [scoreCoins, setScoreCoins] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [streakCombo, setStreakCombo] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lastAnswerStatus, setLastAnswerStatus] = useState(null); // 'correct', 'wrong'
  const [activeRuleTip, setActiveRuleTip] = useState('');
  const [highScore, setHighScore] = useState(5000);

  // Keyboard navigation listener (Left, Up/Center, Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === '1') {
        handleStepGate(0);
      } else if (e.key === 'ArrowUp' || e.key === '2') {
        handleStepGate(1);
      } else if (e.key === 'ArrowRight' || e.key === '3') {
        handleStepGate(2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentIdx, lanePosition, streakCombo]);

  // Web Audio Synthesizer for Magic Chimes
  const playDisneySound = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'magic-chime') {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.06);
          osc.stop(ctx.currentTime + i * 0.06 + 0.3);
        });
      } else if (type === 'combo-fanfare') {
        const fanfare = [440, 554.37, 659.25, 880];
        fanfare.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.4);
        });
      } else if (type === 'error-bounce') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (err) {
      // Audio not allowed or failed silently
    }
  };

  const handleStartGame = () => {
    // Shuffle all 40 questions AND randomize option positions (Gate 1, Gate 2, Gate 3)!
    const shuffled = masterQuestionBank.map((q) => ({
      ...q,
      options: [...q.options].sort(() => 0.5 - Math.random())
    })).sort(() => 0.5 - Math.random());

    setQuestionBank(shuffled);
    setCurrentIdx(0);
    setScoreCoins(0);
    setDistanceMeters(0);
    setStreakCombo(0);
    setMaxStreak(0);
    setLanePosition(1);
    setLastAnswerStatus(null);
    setGameState('playing');
    playDisneySound('magic-chime');
  };

  const handleStepGate = (chosenLaneIdx) => {
    setLanePosition(chosenLaneIdx);
    const q = questionBank[currentIdx];
    const chosenOption = q.options[chosenLaneIdx];
    const isCorrect = chosenOption === q.target;

    if (isCorrect) {
      const newStreak = streakCombo + 1;
      setStreakCombo(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const multiplier = newStreak >= 5 ? 5 : newStreak >= 3 ? 3 : newStreak >= 2 ? 2 : 1;
      const earnedCoins = 50 * multiplier;
      setScoreCoins((prev) => prev + earnedCoins);
      setDistanceMeters((prev) => prev + 50);

      setLastAnswerStatus('correct');
      if (newStreak >= 3) {
        playDisneySound('combo-fanfare');
      } else {
        playDisneySound('magic-chime');
      }

      // Advance after short boost animation
      setTimeout(() => {
        if (currentIdx + 1 < questionBank.length) {
          setCurrentIdx(currentIdx + 1);
          setLastAnswerStatus(null);
        } else {
          setGameState('gameover');
          if (scoreCoins + earnedCoins > highScore) {
            setHighScore(scoreCoins + earnedCoins);
          }
        }
      }, 450);
    } else {
      // Incorrect Gate
      setStreakCombo(0);
      setLastAnswerStatus('wrong');
      setActiveRuleTip(q.ruleTip);
      playDisneySound('error-bounce');
      setGameState('feedback');
    }
  };

  const handleContinueAfterFeedback = () => {
    setLastAnswerStatus(null);
    if (currentIdx + 1 < questionBank.length) {
      setCurrentIdx(currentIdx + 1);
      setGameState('playing');
    } else {
      setGameState('gameover');
    }
  };

  const currentQ = questionBank[currentIdx];
  const comboMultiplier = streakCombo >= 5 ? 5 : streakCombo >= 3 ? 3 : streakCombo >= 2 ? 2 : 1;

  return (
    <div className="disney-runner-container fade-in">
      
      {/* HEADER BAR WITH CLEAN SVG ICONS */}
      <div className="disney-runner-header">
        <div className="flex items-center gap-3">
          <div className="disney-castle-badge">
            <Sparkles size={24} className="text-amber-900" />
          </div>
          <div>
            <h2 className="disney-game-title">
              Le Speed-Runner des Prépositions
            </h2>
            <p className="disney-game-sub">
              Course Graphique avec Maya • 40 Phrases Uniques (Mode Aléatoire)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="disney-score-pill">
            <Coins size={16} className="text-amber-600" />
            <span>Mots Rentrés :</span>
            <strong className="text-amber-700 font-black">{scoreCoins}</strong>
          </div>
          <div className="disney-score-pill">
            <Trophy size={16} className="text-amber-600" />
            <span>Meilleur Score :</span>
            <strong className="text-amber-700 font-black">{highScore}</strong>
          </div>
        </div>
      </div>

      {/* STAGE 1: DIRECT START MENU */}
      {gameState === 'menu' && (
        <div className="disney-menu-card fade-in text-center">
          <div className="disney-sparkle-hero">
            <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-amber-400 shadow-sm text-amber-700">
              <Sparkles size={32} />
            </div>
            <h3 className="font-black text-2xl text-amber-900 mb-2">
              Prêt pour la Grande Course des Prépositions avec Maya ? (40 Phrases)
            </h3>
            <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed mb-6 font-medium">
              Traversez le Royaume Magique et franchissez les 3 portes d'énergie en choisissant la bonne préposition française (<u className="font-bold text-amber-700">à, de, en, dans, par, pour, avec, sans, chez, devant, sur, sous, entre, au</u>) !
            </p>
          </div>

          {/* INSTRUCTIONS WITH CLEAN SVG ICONS */}
          <div className="bg-white/90 border-2 border-amber-400 p-4 rounded-2xl max-w-xl mx-auto mb-6 text-left text-xs shadow-sm">
            <span className="font-black text-amber-900 flex items-center gap-1.5 mb-2">
              <Gamepad2 size={18} className="text-amber-700" /> Commandes & Rôles de Magie :
            </span>
            <ul className="list-disc list-inside text-slate-700 space-y-1 font-semibold">
              <li>40 phrases variées mélangées aléatoirement à chaque partie.</li>
              <li>Cliquez sur les <strong>Portes d'Énergie (1, 2 ou 3)</strong> ou utilisez les <strong>Flèches du Clavier (← ↑ →)</strong>.</li>
              <li>Chaque porte exacte déclenche un **Turbo Boost (+50m)** et multiplie vos pièces d'or !</li>
              <li>Enchaînez les réussites pour débloquer le **Combo Poussière d'Étoiles (x2, x3, x5 MAX)** !</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleStartGame}
            className="disney-start-btn text-sm font-black uppercase tracking-wider"
          >
            <Play size={20} /> Commencer la Course avec Maya (40 Phrases)
          </button>
        </div>
      )}

      {/* STAGE 2: ACTIVE GAMEPLAY */}
      {(gameState === 'playing' || gameState === 'feedback') && (
        <div className="disney-arcade-stage fade-in relative">
          
          {/* ELEGANT SEMI-TRANSPARENT MAYA ARTWORK WATERMARK BACKGROUND */}
          <div className="disney-character-watermark-bg">
            <img src={mayaHero.image} alt="" className="disney-watermark-img" />
          </div>

          {/* TOP HUD STREAK BAR WITH CLEAN SVG ICONS */}
          <div className="disney-hud-bar">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-xs">Maya</span>
              <span className="text-xs text-amber-800 font-bold">({currentIdx + 1} / {questionBank.length})</span>
            </div>

            {/* 3D DYNAMIC STREAK MULTIPLIER BADGE */}
            <div className={`disney-combo-badge combo-x${comboMultiplier}`}>
              <div className="disney-combo-icon-frame">
                {comboMultiplier >= 5 && <Flame size={16} className="text-rose-600 fill-amber-300 animate-pulse" />}
                {comboMultiplier === 3 && <Zap size={16} className="text-yellow-300 fill-yellow-300 animate-bounce" />}
                {comboMultiplier === 2 && <Star size={16} className="text-cyan-200 fill-cyan-200" />}
                {comboMultiplier === 1 && <Sparkles size={16} className="text-amber-600" />}
              </div>
              <span className="disney-combo-text">
                {comboMultiplier >= 5 
                  ? '👑 COMBO x5 MAX • MAGIE ABSOLUE !' 
                  : comboMultiplier === 3 
                  ? '💫 COMBO x3 • SORTILÈGE MAGIQUE !' 
                  : comboMultiplier === 2 
                  ? '🌟 COMBO x2 • POUSSIÈRE D\'ÉTOILES !' 
                  : '✨ COMBO x1'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-black text-amber-800">
              <span className="flex items-center gap-1"><Compass size={14} /> {distanceMeters} m</span>
              <span className="flex items-center gap-1"><Coins size={14} /> {scoreCoins}</span>
            </div>
          </div>

          {/* QUESTION BANNER BOARD AT TOP */}
          <div className="disney-question-card">
            <span className="disney-question-tag flex items-center justify-center gap-1">
              <Sparkles size={14} /> Défi Préposition {currentIdx + 1} sur 40 :
            </span>
            <h3 className="disney-question-sentence">
              {currentQ.textBefore}
              <span className="disney-blank-box">_____</span>
              {currentQ.textAfter}
            </h3>
          </div>

          {/* 2D PARALLAX RUNNER TRACK WITH 3 GLOWING GATES */}
          <div className="disney-track-environment">
            
            {/* CASTLE SILHOUETTE PARALLAX BACKGROUND */}
            <div className="disney-castle-bg">
              <Sparkles size={24} className="text-amber-200 opacity-80" />
              <div className="disney-stars flex items-center gap-2">
                <Star size={14} className="fill-amber-300 text-amber-300" />
                <Star size={18} className="fill-amber-200 text-amber-200" />
                <Star size={14} className="fill-amber-300 text-amber-300" />
              </div>
            </div>

            {/* 3 RUNNER LANES / MULTIPLE CHOICE GATES */}
            <div className="disney-lanes-grid">
              
              {/* LANE 0 (LEFT) */}
              <div className={`disney-lane ${lanePosition === 0 ? 'active-lane' : ''}`}>
                <div 
                  onClick={() => gameState === 'playing' && handleStepGate(0)}
                  className={`disney-magic-gate gate-left ${lastAnswerStatus === 'correct' && lanePosition === 0 ? 'gate-boost' : ''}`}
                >
                  <span className="disney-gate-num">Porte 1 (Flèche ←)</span>
                  <span className="disney-gate-word">{currentQ.options[0]}</span>
                </div>
              </div>

              {/* LANE 1 (MIDDLE) */}
              <div className={`disney-lane ${lanePosition === 1 ? 'active-lane' : ''}`}>
                <div 
                  onClick={() => gameState === 'playing' && handleStepGate(1)}
                  className={`disney-magic-gate gate-middle ${lastAnswerStatus === 'correct' && lanePosition === 1 ? 'gate-boost' : ''}`}
                >
                  <span className="disney-gate-num">Porte 2 (Flèche ↑)</span>
                  <span className="disney-gate-word">{currentQ.options[1]}</span>
                </div>
              </div>

              {/* LANE 2 (RIGHT) */}
              <div className={`disney-lane ${lanePosition === 2 ? 'active-lane' : ''}`}>
                <div 
                  onClick={() => gameState === 'playing' && handleStepGate(2)}
                  className={`disney-magic-gate gate-right ${lastAnswerStatus === 'correct' && lanePosition === 2 ? 'gate-boost' : ''}`}
                >
                  <span className="disney-gate-num">Porte 3 (Flèche →)</span>
                  <span className="disney-gate-word">{currentQ.options[2]}</span>
                </div>
              </div>

            </div>

          </div>

          {/* FEEDBACK POPUP ON WRONG GATE */}
          {gameState === 'feedback' && (
            <div className="disney-modal-overlay fade-in">
              <div className="disney-feedback-card text-center">
                <div className="w-14 h-14 bg-rose-500/20 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-rose-400/40">
                  <XCircle size={32} />
                </div>
                <h4 className="font-black text-xl text-rose-600 mb-2">
                  Oups ! La Porte s'est refermée...
                </h4>
                
                <p className="text-sm font-bold text-slate-900 mb-4 bg-slate-100 p-3 rounded-xl border border-slate-200">
                  {currentQ.textBefore}
                  <u className="text-amber-700 font-black">{currentQ.target}</u>
                  {currentQ.textAfter}
                </p>

                <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-left text-xs font-bold text-amber-900 mb-5">
                  {activeRuleTip}
                </div>

                <button
                  type="button"
                  onClick={handleContinueAfterFeedback}
                  className="disney-continue-btn text-xs font-black uppercase tracking-wider"
                >
                  Reprendre la Course <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* STAGE 3: VICTORY / END GAME */}
      {gameState === 'gameover' && (
        <div className="disney-gameover-card fade-in text-center">
          <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl border-2 border-amber-300">
            <Trophy size={36} />
          </div>

          <h3 className="font-black text-2xl text-amber-900 mb-1">
            🎉 Félicitations Maya, Grande Championne de la Rentrée !
          </h3>
          <p className="text-xs text-slate-700 mb-6 font-semibold">
            Vous avez accompli l'intégralité du parcours des 40 prépositions avec succès !
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-6 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-amber-400/40">
              <span className="text-slate-500 block mb-1">Pièces Gagnées</span>
              <strong className="text-amber-700 text-lg font-black">{scoreCoins}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-amber-400/40">
              <span className="text-slate-500 block mb-1">Distance Totale</span>
              <strong className="text-emerald-700 text-lg font-black">{distanceMeters} m</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-amber-400/40">
              <span className="text-slate-500 block mb-1">Combo Max</span>
              <strong className="text-cyan-700 text-lg font-black">x{maxStreak}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-amber-400/40">
              <span className="text-slate-500 block mb-1">Phrases Réussies</span>
              <strong className="text-purple-700 text-lg font-black">40 / 40</strong>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleStartGame}
              className="disney-start-btn text-xs font-black uppercase tracking-wider"
            >
              <RotateCcw size={16} /> Rejouer avec Maya (Nouvel Ordre Aléatoire)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
