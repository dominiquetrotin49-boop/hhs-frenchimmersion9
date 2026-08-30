import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Flame, Heart, Sword, RotateCcw, Play, ChevronRight, CheckCircle2, XCircle, Award, Sparkles, AlertCircle, Clock, Target, Trophy, Star } from 'lucide-react';
import './BossBattlePresent.css';

export default function BossBattlePresent() {
  // Comprehensive High-Frequency Present Tense Verbs Database (50 Conjugation Challenges)
  const masterChallengeBank = [
    // ESSENTIAL IRREGULARS
    { id: 1, subject: "Nous", verb: "prendre", target: "prenons", tense: "Présent", category: "Irregulier", tip: "💡 prendre -> nous prenons (un seul 'n')" },
    { id: 2, subject: "Je", verb: "être", target: "suis", tense: "Présent", category: "Irregulier", tip: "💡 être -> je suis" },
    { id: 3, subject: "Tu", verb: "avoir", target: "as", tense: "Présent", category: "Irregulier", tip: "💡 avoir -> tu as" },
    { id: 4, subject: "Ils", verb: "faire", target: "font", tense: "Présent", category: "Irregulier", tip: "💡 faire -> ils font" },
    { id: 5, subject: "Elle", verb: "aller", target: "va", tense: "Présent", category: "Irregulier", tip: "💡 aller -> elle va" },
    { id: 6, subject: "Vous", verb: "pouvoir", target: "pouvez", tense: "Présent", category: "Irregulier", tip: "💡 pouvoir -> vous pouvez" },
    { id: 7, subject: "On", verb: "vouloir", target: "veut", tense: "Présent", category: "Irregulier", tip: "💡 vouloir -> on veut" },
    { id: 8, subject: "Je", verb: "devoir", target: "dois", tense: "Présent", category: "Irregulier", tip: "💡 devoir -> je dois" },
    { id: 9, subject: "Nous", verb: "venir", target: "venons", tense: "Présent", category: "Irregulier", tip: "💡 venir -> nous venons" },
    { id: 10, subject: "Tu", verb: "savoir", target: "sais", tense: "Présent", category: "Irregulier", tip: "💡 savoir -> tu sais" },

    // MORE IRREGULARS & COMMON VERBS
    { id: 11, subject: "Ils", verb: "prendre", target: "prennent", tense: "Présent", category: "Irregulier", tip: "💡 prendre -> ils prennent (double 'nn')" },
    { id: 12, subject: "Nous", verb: "être", target: "sommes", tense: "Présent", category: "Irregulier", tip: "💡 être -> nous sommes" },
    { id: 13, subject: "Vous", verb: "être", target: "êtes", tense: "Présent", category: "Irregulier", tip: "💡 être -> vous êtes (avec accent circonflexe ^)" },
    { id: 14, subject: "Ils", verb: "être", target: "sont", tense: "Présent", category: "Irregulier", tip: "💡 être -> ils sont" },
    { id: 15, subject: "Nous", verb: "avoir", target: "avons", tense: "Présent", category: "Irregulier", tip: "💡 avoir -> nous avons" },
    { id: 16, subject: "Vous", verb: "avoir", target: "avez", tense: "Présent", category: "Irregulier", tip: "💡 avoir -> vous avez" },
    { id: 17, subject: "Ils", verb: "avoir", target: "ont", tense: "Présent", category: "Irregulier", tip: "💡 avoir -> ils ont" },
    { id: 18, subject: "Nous", verb: "faire", target: "faisons", tense: "Présent", category: "Irregulier", tip: "💡 faire -> nous faisons" },
    { id: 19, subject: "Vous", verb: "faire", target: "faites", tense: "Présent", category: "Irregulier", tip: "💡 faire -> vous faites (attention: -tes)" },
    { id: 20, subject: "Nous", verb: "aller", target: "allons", tense: "Présent", category: "Irregulier", tip: "💡 aller -> nous allons" },
    { id: 21, subject: "Vous", verb: "aller", target: "allez", tense: "Présent", category: "Irregulier", tip: "💡 aller -> vous allez" },
    { id: 22, subject: "Ils", verb: "aller", target: "vont", tense: "Présent", category: "Irregulier", tip: "💡 aller -> ils vont" },
    { id: 23, subject: "Je", verb: "pouvoir", target: "peux", tense: "Présent", category: "Irregulier", tip: "💡 pouvoir -> je peux" },
    { id: 24, subject: "Ils", verb: "pouvoir", target: "peuvent", tense: "Présent", category: "Irregulier", tip: "💡 pouvoir -> ils peuvent" },
    { id: 25, subject: "Tu", verb: "vouloir", target: "veux", tense: "Présent", category: "Irregulier", tip: "💡 vouloir -> tu veux" },
    { id: 26, subject: "Ils", verb: "vouloir", target: "veulent", tense: "Présent", category: "Irregulier", tip: "💡 vouloir -> ils veulent" },
    { id: 27, subject: "Nous", verb: "devoir", target: "devons", tense: "Présent", category: "Irregulier", tip: "💡 devoir -> nous devons" },
    { id: 28, subject: "Ils", verb: "devoir", target: "doivent", tense: "Présent", category: "Irregulier", tip: "💡 devoir -> ils doivent" },
    { id: 29, subject: "Je", verb: "venir", target: "viens", tense: "Présent", category: "Irregulier", tip: "💡 venir -> je viens" },
    { id: 30, subject: "Ils", verb: "venir", target: "viennent", tense: "Présent", category: "Irregulier", tip: "💡 venir -> ils viennent (double 'nn')" },

    // REGULAR -ER VERBS
    { id: 31, subject: "Nous", verb: "parler", target: "parlons", tense: "Présent", category: "ER", tip: "💡 -ER avec nous -> -ons" },
    { id: 32, subject: "Vous", verb: "écouter", target: "écoutez", tense: "Présent", category: "ER", tip: "💡 -ER avec vous -> -ez" },
    { id: 33, subject: "Elles", verb: "étudier", target: "étudient", tense: "Présent", category: "ER", tip: "💡 -ER avec ils/elles -> -ent" },
    { id: 34, subject: "Tu", verb: "habiter", target: "habites", tense: "Présent", category: "ER", tip: "💡 -ER avec tu -> -es" },
    { id: 35, subject: "Je", verb: "jouer", target: "joue", tense: "Présent", category: "ER", tip: "💡 -ER avec je -> -e" },
    { id: 36, subject: "Nous", verb: "travailler", target: "travaillons", tense: "Présent", category: "ER", tip: "💡 -ER avec nous -> -ons" },
    { id: 37, subject: "Vous", verb: "regarder", target: "regardez", tense: "Présent", category: "ER", tip: "💡 -ER avec vous -> -ez" },
    { id: 38, subject: "Ils", verb: "aimer", target: "aiment", tense: "Présent", category: "ER", tip: "💡 -ER avec ils -> -ent" },

    // REGULAR -IR VERBS
    { id: 39, subject: "Nous", verb: "finir", target: "finissons", tense: "Présent", category: "IR", tip: "💡 -IR avec nous -> -issons" },
    { id: 40, subject: "Vous", verb: "choisir", target: "choisissez", tense: "Présent", category: "IR", tip: "💡 -IR avec vous -> -issez" },
    { id: 41, subject: "Ils", verb: "réussir", target: "réussissent", tense: "Présent", category: "IR", tip: "💡 -IR avec ils -> -issent" },
    { id: 42, subject: "Je", verb: "finir", target: "finis", tense: "Présent", category: "IR", tip: "💡 -IR avec je -> -is" },
    { id: 43, subject: "Tu", verb: "réfléchir", target: "réfléchis", tense: "Présent", category: "IR", tip: "💡 -IR avec tu -> -is" },

    // REGULAR -RE VERBS
    { id: 44, subject: "Nous", verb: "attendre", target: "attendons", tense: "Présent", category: "RE", tip: "💡 -RE avec nous -> -ons" },
    { id: 45, subject: "Vous", verb: "répondre", target: "répondez", tense: "Présent", category: "RE", tip: "💡 -RE avec vous -> -ez" },
    { id: 46, subject: "Ils", verb: "perdre", target: "perdent", tense: "Présent", category: "RE", tip: "💡 -RE avec ils -> -ent" },
    { id: 47, subject: "Je", verb: "vendre", target: "vends", tense: "Présent", category: "RE", tip: "💡 -RE avec je -> -s" },
    { id: 48, subject: "Tu", verb: "entendre", target: "entends", tense: "Présent", category: "RE", tip: "💡 -RE avec tu -> -s" },
    { id: 49, subject: "Elle", verb: "attendre", target: "attend", tense: "Présent", category: "RE", tip: "💡 -RE avec il/elle -> terminaison -d" },
    { id: 50, subject: "Nous", verb: "savoir", target: "savons", tense: "Présent", category: "Irregulier", tip: "💡 savoir -> nous savons" }
  ];

  // Single Boss: Malakor, Le Sorcier Temporel
  const singleBoss = {
    name: 'Malakor, Le Sorcier Temporel',
    title: 'Maître Enchanteur du Présent',
    maxHp: 750,
    image: '/images/avatars/avatar_malakor.jpg'
  };

  // Game States
  const [gameState, setGameState] = useState('menu'); // 'menu', 'battle', 'victory', 'gameover'
  const [bossHp, setBossHp] = useState(singleBoss.maxHp);
  const [playerHp, setPlayerHp] = useState(100);
  const [playerScore, setPlayerScore] = useState(0);
  const [streakCount, setStreakCount] = useState(0);

  // Active Challenge Index & Shuffled Queue
  const [challenges, setChallenges] = useState(masterChallengeBank);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'crit'|'hit'|'miss'|'shield', msg: '', tip: '' }

  // Power-Ups Inventory
  const [shields, setShields] = useState(1);       // 🛡️ Protects against 1 mistake
  const [timeFreezes, setTimeFreezes] = useState(1); // ⚡ Slows timer (+5s)
  const [xpMultipliers, setXpMultipliers] = useState(1); // 🔥 Triples irregular verb XP
  const [isXpActive, setIsXpActive] = useState(false);
  const [activeSpellAnim, setActiveSpellAnim] = useState(null);

  // Timer Countdown (6.0s default)
  const [timeLeft, setTimeLeft] = useState(6.0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const inputRef = useRef(null);

  // Web Audio Synthesizer for RPG Combat Effects
  const playSfx = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'fire-attack') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'shield-block') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'timer-lightning') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  // Timer Tick Hook
  useEffect(() => {
    if (gameState !== 'battle' || isTimerPaused || feedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, isTimerPaused, feedback, currentIdx]);

  // Focus input automatically on challenge step
  useEffect(() => {
    if (gameState === 'battle' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, currentIdx, feedback]);

  const handleStartBattle = () => {
    setBossHp(singleBoss.maxHp);
    setPlayerHp(100);
    setPlayerScore(0);
    setStreakCount(0);
    setShields(1);
    setTimeFreezes(1);
    setXpMultipliers(1);
    setIsXpActive(false);

    // Shuffle 50 challenges
    const shuffled = [...masterChallengeBank].sort(() => 0.5 - Math.random());
    setChallenges(shuffled);
    setCurrentIdx(0);
    setUserInput('');
    setFeedback(null);
    setTimeLeft(10.0);
    setGameState('battle');
  };

  const handleTimeOut = () => {
    // Timer expired! Player gets hit unless Shield is active
    if (shields > 0) {
      setShields((prev) => prev - 1);
      playSfx('shield-block');
      setActiveSpellAnim({
        type: 'shield',
        title: '🛡️ BOUCLIER D\'ACCORD ACTIVÉ !',
        subtitle: 'Vous êtes protégé !'
      });
      setTimeout(() => setActiveSpellAnim(null), 2500);
      setFeedback({
        type: 'shield',
        msg: '🛡️ Bouclier d\'Accord Déclenché ! Le temps est écoulé mais vous êtes protégé !',
        tip: challenges[currentIdx].tip
      });
    } else {
      const damage = 20;
      setPlayerHp((prev) => Math.max(0, prev - damage));
      setStreakCount(0);
      playSfx('fire-attack');

      if (playerHp - damage <= 0) {
        setGameState('gameover');
      } else {
        setFeedback({
          type: 'miss',
          msg: `⏰ Temps écoulé ! Malakor vous inflige ${damage} DG !`,
          tip: challenges[currentIdx].tip
        });
      }
    }
  };

  const handleSubmitAnswer = (e) => {
    if (e) e.preventDefault();
    if (gameState !== 'battle' || feedback) return;

    const currentQ = challenges[currentIdx];
    const cleanedUser = userInput.trim().toLowerCase();
    const cleanedTarget = currentQ.target.trim().toLowerCase();

    if (cleanedUser === cleanedTarget) {
      // SUCCESSFUL CONJUGATION STRIKE!
      playSfx('fire-attack');
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);

      // Base Damage = 65; Critical for fast response under 3s = 100!
      const isFast = timeLeft >= 3.0;
      let baseDamage = isFast ? 100 : 65;
      
      // XP Multiplier for irregulars
      let pointsEarned = 100;
      if (currentQ.category === 'Irregulier' && isXpActive) {
        pointsEarned *= 3;
        baseDamage += 50;
      }

      setPlayerScore((prev) => prev + pointsEarned);
      const newBossHp = Math.max(0, bossHp - baseDamage);
      setBossHp(newBossHp);

      // Award bonus power-up on 5 streak
      if (newStreak % 5 === 0) {
        setShields((prev) => prev + 1);
      }

      setFeedback({
        type: isFast ? 'crit' : 'hit',
        msg: isFast 
          ? `💥 ATTAQUE CRITIQUE ! -${baseDamage} PV à Malakor ! (+${pointsEarned} XP)` 
          : `⚔️ Coup Réussi ! -${baseDamage} PV à Malakor ! (+${pointsEarned} XP)`,
        tip: currentQ.tip
      });

      if (newBossHp <= 0) {
        setTimeout(() => setGameState('victory'), 1200);
      }
    } else {
      // INCORRECT ANSWER
      if (shields > 0) {
        setShields((prev) => prev - 1);
        playSfx('shield-block');
        setFeedback({
          type: 'shield',
          msg: `🛡️ Bouclier d'Accord Activé ! La bonne forme était : "${currentQ.target}"`,
          tip: currentQ.tip
        });
      } else {
        const damage = 20;
        const newPlayerHp = Math.max(0, playerHp - damage);
        setPlayerHp(newPlayerHp);
        setStreakCount(0);
        playSfx('fire-attack');

        setFeedback({
          type: 'miss',
          msg: `❌ Raté ! Malakor riposte avec -${damage} PV ! Réponse : "${currentQ.target}"`,
          tip: currentQ.tip
        });

        if (newPlayerHp <= 0) {
          setTimeout(() => setGameState('gameover'), 1200);
        }
      }
    }
  };

  const handleNextTurn = () => {
    setFeedback(null);
    setUserInput('');
    setTimeLeft(10.0);
    setIsXpActive(false);

    if (currentIdx + 1 < challenges.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setGameState('victory');
    }
  };

  const handleUseShield = () => {
    if (shields <= 0) return;
    playSfx('shield-block');
    setActiveSpellAnim({
      type: 'shield',
      title: '🛡️ BOUCLIER D\'ACCORD ACTIVÉ !',
      subtitle: 'Protection Magique contre 1 faute !'
    });
    setTimeout(() => setActiveSpellAnim(null), 2500);
  };

  const handleUseTimeFreeze = () => {
    if (timeFreezes <= 0) return;
    setTimeFreezes((prev) => prev - 1);
    setTimeLeft((prev) => prev + 5.0);
    playSfx('timer-lightning');
    setActiveSpellAnim({
      type: 'lightning',
      title: '⚡ FOUDRE TEMPORELLE ACTIVÉE !',
      subtitle: '+5.0s d\'ajouts au Chrono !'
    });
    setTimeout(() => setActiveSpellAnim(null), 2500);
  };

  const handleUseXpMultiplier = () => {
    if (xpMultipliers <= 0 || isXpActive) return;
    setXpMultipliers((prev) => prev - 1);
    setIsXpActive(true);
    playSfx('timer-lightning');
    setActiveSpellAnim({
      type: 'multiplier',
      title: '🔥 MULTIPLICATEUR D\'XP ACTIVÉ !',
      subtitle: 'Triple XP (x3) sur les verbes !'
    });
    setTimeout(() => setActiveSpellAnim(null), 2500);
  };

  const handleInsertAccent = (accentChar) => {
    setUserInput((prev) => prev + accentChar);
    if (inputRef.current) inputRef.current.focus();
  };

  const currentQ = challenges[currentIdx];
  const timerPercentage = Math.max(0, (timeLeft / 10.0) * 100);

  return (
    <div className="boss-battle-container fade-in">
      
      {/* ARENA HEADER BAR WITH CRISP SVG ICONS */}
      <div className="boss-arena-header">
        <div className="flex items-center gap-3">
          <div className="boss-arena-badge">
            <Sword size={24} className="text-amber-900" />
          </div>
          <div>
            <h2 className="boss-arena-title">
              L'Arène du Présent : Duel contre Malakor
            </h2>
            <p className="boss-arena-sub">
              Conjugaison des verbes au présent en 10 secondes chrono !
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="boss-stat-pill text-amber-700">
            <Trophy size={16} className="text-amber-600" />
            <span>XP :</span>
            <strong className="font-black text-amber-900">{playerScore}</strong>
          </div>
          
          {/* 3D DYNAMIC STREAK MULTIPLIER BADGE */}
          <div className={`disney-combo-badge combo-x${streakCount >= 5 ? 5 : streakCount >= 3 ? 3 : streakCount >= 2 ? 2 : 1}`}>
            <div className="disney-combo-icon-frame">
              {streakCount >= 5 && <Flame size={16} className="text-rose-600 fill-amber-300 animate-pulse" />}
              {streakCount >= 3 && streakCount < 5 && <Zap size={16} className="text-yellow-300 fill-yellow-300 animate-bounce" />}
              {streakCount === 2 && <Star size={16} className="text-cyan-200 fill-cyan-200" />}
              {streakCount <= 1 && <Sparkles size={16} className="text-amber-600" />}
            </div>
            <span className="disney-combo-text">
              {streakCount >= 5 
                ? '👑 COMBO x5 MAX • FRAPPE ABSOLUE !' 
                : streakCount >= 3 
                ? '💫 COMBO x3 • MAGIE TEMPORELLE !' 
                : streakCount === 2 
                ? '🌟 COMBO x2 • PUISSANCE !' 
                : '✨ COMBO x1'}
            </span>
          </div>
        </div>
      </div>

      {/* STAGE 1: DIRECT START MENU */}
      {gameState === 'menu' && (
        <div className="boss-menu-card fade-in text-center">
          <div className="boss-sparkle-hero mb-6">
            <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-amber-400 shadow-sm text-amber-700">
              <Sword size={32} />
            </div>
            <h3 className="font-black text-2xl text-amber-900 mb-2">
              Le Sorcier Malakor vous défie en Duel au Présent !
            </h3>
            <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed font-medium mb-4">
              Conjuguez les verbes au présent (<u className="font-bold text-amber-700">verbes en -ER, -IR, -RE et essentiels : être, avoir, faire, aller, pouvoir, vouloir, devoir, venir, prendre, savoir</u>) en <strong>6 secondes chrono</strong> pour terrasser Malakor !
            </p>
          </div>

          {/* POWER-UPS SUMMARY BOX WITH SVG ICONS */}
          <div className="bg-white/90 border-2 border-amber-400 p-4 rounded-2xl max-w-xl mx-auto text-left text-xs shadow-sm mb-6">
            <span className="font-black text-amber-900 flex items-center gap-1.5 mb-2">
              <Sparkles size={16} className="text-amber-700" /> Vos 3 Sortilèges d'Arène :
            </span>
            <div className="grid grid-cols-3 gap-3 text-[11px] font-bold">
              <div className="bg-amber-100/60 p-2.5 rounded-xl border border-amber-300">
                <span className="flex items-center gap-1 text-amber-900 font-extrabold mb-0.5">
                  <Shield size={14} /> Bouclier d'Accord
                </span>
                <span className="text-slate-600 font-medium">Protège contre 1 erreur ou fin de chrono !</span>
              </div>
              <div className="bg-cyan-100/60 p-2.5 rounded-xl border border-cyan-300">
                <span className="flex items-center gap-1 text-cyan-900 font-extrabold mb-0.5">
                  <Zap size={14} /> Foudre Temporelle
                </span>
                <span className="text-slate-600 font-medium">Ajoute +5 secondes bonus au chrono !</span>
              </div>
              <div className="bg-rose-100/60 p-2.5 rounded-xl border border-rose-300">
                <span className="flex items-center gap-1 text-rose-900 font-extrabold mb-0.5">
                  <Flame size={14} /> Multiplicateur x3
                </span>
                <span className="text-slate-600 font-medium">Triple vos points sur les verbes irréguliers !</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartBattle}
            className="boss-start-battle-btn text-sm font-black uppercase tracking-wider"
          >
            <Play size={20} /> Entrer dans l'Arène & FRAPPER !
          </button>
        </div>
      )}

      {/* STAGE 2: ACTIVE RPG DUEL BATTLE */}
      {gameState === 'battle' && (
        <div className="boss-battle-stage fade-in relative">
          
          {/* ANIMATED SPELL OVERLAY FOR 2.5 SECONDS */}
          {activeSpellAnim && (
            <div className={`boss-spell-overlay ${activeSpellAnim.type} fade-in`}>
              
              {/* SHIELD SPELL */}
              {activeSpellAnim.type === 'shield' && (
                <div className="boss-spell-shield-content">
                  <div className="boss-shield-aura">
                    <Shield size={110} className="text-amber-400 stroke-[2.5]" />
                  </div>
                  <div className="boss-spell-banner">
                    <span className="boss-spell-title">{activeSpellAnim.title}</span>
                    <span className="boss-spell-sub">{activeSpellAnim.subtitle}</span>
                  </div>
                  <div className="boss-float-symbols">
                    <span className="boss-float-item float-1">🛡️ +1 PROTECT</span>
                    <span className="boss-float-item float-2">✨ ACCORD MAGIQUE</span>
                  </div>
                </div>
              )}

              {/* LIGHTNING SPELL (+5s CHRONO) */}
              {activeSpellAnim.type === 'lightning' && (
                <div className="boss-spell-lightning-content">
                  <div className="lightning-streak-line" />
                  <div className="boss-lightning-aura">
                    <Zap size={110} className="text-cyan-300 stroke-[2.5]" />
                  </div>
                  <div className="boss-spell-banner lightning">
                    <span className="boss-spell-title">{activeSpellAnim.title}</span>
                    <span className="boss-spell-sub">{activeSpellAnim.subtitle}</span>
                  </div>
                  <div className="boss-float-symbols">
                    <span className="boss-float-item float-1 cyan">⚡ +5.0s</span>
                    <span className="boss-float-item float-2 cyan">+5s CHRONO</span>
                  </div>
                </div>
              )}

              {/* MULTIPLIER SPELL (x3 XP) */}
              {activeSpellAnim.type === 'multiplier' && (
                <div className="boss-spell-multiplier-content">
                  <div className="boss-flame-aura">
                    <Flame size={110} className="text-rose-400 stroke-[2.5]" />
                  </div>
                  <div className="boss-spell-banner rose">
                    <span className="boss-spell-title">{activeSpellAnim.title}</span>
                    <span className="boss-spell-sub">{activeSpellAnim.subtitle}</span>
                  </div>
                  <div className="boss-float-symbols">
                    <span className="boss-float-item float-1 rose">🔥 x3 MULTIPLICATEUR</span>
                    <span className="boss-float-item float-2 rose">+300 XP</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ELEGANT SEMI-TRANSPARENT MALAKOR WATERMARK BACKGROUND */}
          <div className="boss-character-watermark-bg">
            <img src={singleBoss.image} alt="" className="boss-watermark-img" />
          </div>

          {/* TOP DUAL HEALTHBARS WITH SVG ICONS */}
          <div className="boss-health-row">
            
            {/* PLAYER HEALTHBAR */}
            <div className="boss-hp-card player-hp">
              <div className="flex justify-between text-xs font-black mb-1">
                <span className="flex items-center gap-1 text-emerald-800">
                  <Heart size={14} className="fill-emerald-500 text-emerald-600" /> VOS PV (JOUEUR)
                </span>
                <span className="text-emerald-900">{playerHp} / 100</span>
              </div>
              <div className="boss-hp-bar-bg">
                <div 
                  className="boss-hp-bar-fill bg-gradient-to-r from-emerald-500 to-green-600"
                  style={{ width: `${Math.max(0, playerHp)}%` }}
                />
              </div>
            </div>

            {/* VS BADGE */}
            <div className="boss-vs-badge">
              VS
            </div>

            {/* BOSS HEALTHBAR */}
            <div className="boss-hp-card boss-hp">
              <div className="flex justify-between text-xs font-black mb-1">
                <span className="flex items-center gap-1 text-rose-800">
                  <Target size={14} className="text-rose-600" /> {singleBoss.name}
                </span>
                <span className="text-rose-900">{bossHp} / {singleBoss.maxHp}</span>
              </div>
              <div className="boss-hp-bar-bg">
                <div 
                  className="boss-hp-bar-fill bg-gradient-to-r from-rose-500 to-red-700"
                  style={{ width: `${Math.max(0, (bossHp / singleBoss.maxHp) * 100)}%` }}
                />
              </div>
            </div>

          </div>

          {/* TIMER COUNTDOWN BAR WITH SVG ICON */}
          <div className="boss-timer-container">
            <div className="flex justify-between items-center text-xs font-black text-slate-700 mb-1">
              <span className="flex items-center gap-1 text-amber-700">
                <Clock size={14} /> Chrono de Duel : <strong className="text-slate-900 text-sm">{timeLeft.toFixed(1)}s</strong>
              </span>
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                {timeLeft >= 3.0 ? <Zap size={14} className="text-amber-500" /> : null}
                {timeLeft >= 3.0 ? 'Frappe Rapide (Coup Critique !)' : 'Temps Restant Court !'}
              </span>
            </div>
            <div className="boss-timer-track">
              <div 
                className={`boss-timer-fill ${timeLeft <= 2.0 ? 'critical' : ''}`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          </div>

          {/* POWER-UPS ACTION BAR */}
          <div className="boss-powerups-bar">
            <button
              type="button"
              onClick={handleUseShield}
              className={`boss-powerup-btn ${shields > 0 ? 'available' : 'disabled'}`}
              title="Protection contre 1 faute"
            >
              <Shield size={16} /> Bouclier ({shields})
            </button>

            <button
              type="button"
              onClick={handleUseTimeFreeze}
              className={`boss-powerup-btn ${timeFreezes > 0 ? 'available' : 'disabled'}`}
              title="Ajoute +5s au chrono"
            >
              <Zap size={16} /> Foudre +5s ({timeFreezes})
            </button>

            <button
              type="button"
              onClick={handleUseXpMultiplier}
              className={`boss-powerup-btn ${xpMultipliers > 0 && !isXpActive ? 'available' : 'disabled'}`}
              title="Triple l'XP sur les verbes irréguliers"
            >
              <Flame size={16} /> Multiplicateur x3 {isXpActive ? '(ACTIF)' : `(${xpMultipliers})`}
            </button>
          </div>

          {/* MAIN PROMPT CARD */}
          <div className="boss-prompt-card">
            <span className="boss-category-tag flex items-center justify-center gap-1">
              <Sparkles size={14} /> Catégorie : {currentQ.category} • Verbe {currentQ.category === 'Irregulier' ? 'Irrégulier 🔥' : 'Régulier'}
            </span>

            <div className="boss-prompt-display">
              <div className="boss-prompt-box">
                <span className="boss-label">Sujet</span>
                <strong className="boss-val text-amber-700">{currentQ.subject}</strong>
              </div>
              <span className="text-2xl font-black text-amber-500">+</span>
              <div className="boss-prompt-box">
                <span className="boss-label">Verbe à conjuguer</span>
                <strong className="boss-val text-indigo-700">({currentQ.verb})</strong>
              </div>
            </div>

            {/* INPUT FORM FOR CONJUGATION STRIKE */}
            {!feedback ? (
              <form onSubmit={handleSubmitAnswer} className="boss-input-form">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Écrivez la conjugaison au présent..."
                    className="boss-text-input"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                  <button type="submit" className="boss-strike-btn">
                    <Sword size={20} /> FRAPPER !
                  </button>
                </div>

                {/* FRENCH ACCENT QUICK KEYBOARD */}
                <div className="boss-accent-keyboard">
                  <span className="text-[11px] font-bold text-slate-500">Accents rapides :</span>
                  {['é', 'è', 'ê', 'à', 'ç', 'ù', 'î', 'ô'].map((acc) => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => handleInsertAccent(acc)}
                      className="boss-accent-btn"
                    >
                      {acc}
                    </button>
                  ))}
                </div>
              </form>
            ) : (
              /* FEEDBACK DISPLAY ON STEP COMPLETION */
              <div className={`boss-feedback-box ${feedback.type} fade-in text-center`}>
                <div className="text-2xl font-black mb-1">
                  {feedback.type === 'crit' && '💥 COUP CRITIQUE !'}
                  {feedback.type === 'hit' && '⚔️ ATTAQUE RÉUSSIE !'}
                  {feedback.type === 'shield' && '🛡️ BOUCLIER MAGIQUE !'}
                  {feedback.type === 'miss' && '💥 ATTAQUE REÇUE !'}
                </div>
                <p className="font-bold text-sm mb-3">{feedback.msg}</p>
                <div className="bg-white/90 p-2.5 rounded-xl border border-amber-300 text-xs font-semibold text-slate-800 text-left mb-4 shadow-xs">
                  {feedback.tip}
                </div>
                <button
                  type="button"
                  onClick={handleNextTurn}
                  className="boss-next-btn text-xs font-black uppercase tracking-wider"
                >
                  Prochain Tour <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* STAGE 3: VICTORY SCREEN */}
      {gameState === 'victory' && (
        <div className="boss-result-card victory fade-in text-center">
          <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl border-2 border-amber-300">
            <Trophy size={36} />
          </div>

          <h3 className="font-black text-2xl text-amber-900 mb-1">
            🎉 VICTOIRE ÉPIQUE ! Vous avez vaincu Malakor !
          </h3>
          <p className="text-xs text-slate-700 mb-6 font-semibold">
            Votre maîtrise des verbes au présent est absolue !
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6 text-xs font-bold">
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-300">
              <span className="text-amber-800 block mb-1">Score Total</span>
              <strong className="text-amber-900 text-lg font-black">{playerScore} XP</strong>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300">
              <span className="text-emerald-800 block mb-1">PV Restants</span>
              <strong className="text-emerald-900 text-lg font-black">{playerHp} / 100</strong>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-300">
              <span className="text-purple-800 block mb-1">Meilleur Combo</span>
              <strong className="text-purple-900 text-lg font-black">x{streakCount}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartBattle}
            className="boss-start-battle-btn text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
          >
            <RotateCcw size={16} /> Recommencer un Duel contre Malakor
          </button>
        </div>
      )}

      {/* STAGE 4: GAMEOVER SCREEN */}
      {gameState === 'gameover' && (
        <div className="boss-result-card gameover fade-in text-center">
          <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl border-2 border-rose-400">
            <XCircle size={36} />
          </div>

          <h3 className="font-black text-2xl text-rose-700 mb-1">
            Défaite au Combat...
          </h3>
          <p className="text-xs text-slate-700 mb-6 font-semibold">
            Malakor a épuisé vos points de vie. Révisez les règles de conjugaison au présent et prenez votre revanche !
          </p>

          <button
            type="button"
            onClick={handleStartBattle}
            className="boss-start-battle-btn text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
          >
            <RotateCcw size={16} /> Réessayer le Duel
          </button>
        </div>
      )}

    </div>
  );
}
