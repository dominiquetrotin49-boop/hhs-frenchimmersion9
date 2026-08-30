import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Flame, Heart, Sword, RotateCcw, Play, ChevronRight, CheckCircle2, XCircle, Award, Sparkles, Gem, Radio, Lock, RefreshCw, Trophy, Target } from 'lucide-react';
import './TowerDefenseVocab.css';

export default function TowerDefenseVocab() {
  // Vocabulary Database (30 High-Frequency Academic & High-School Immersion Terms)
  const masterVocabBank = [
    { id: 1, term: "exprimer", definition: "Manifester une pensée ou un sentiment par des mots", english: "To express" },
    { id: 2, term: "analyser", definition: "Examiner en détail les parties d'un texte ou problème", english: "To analyze" },
    { id: 3, term: "surmonter", definition: "Triompher d'une difficulté ou d'un obstacle", english: "To overcome" },
    { id: 4, term: "partager", definition: "Diviser ou faire profiter les autres de quelque chose", english: "To share" },
    { id: 5, term: "s'exprimer", definition: "Faire connaître sa pensée avec clarté", english: "To express oneself" },
    { id: 6, term: "réfléchir", definition: "Penser mûrement à une question ou sujet", english: "To reflect / think" },
    { id: 7, term: "participer", definition: "Prendre part activement à une activité de classe", english: "To participate" },
    { id: 8, term: "cependant", definition: "Connecteur logique pour marquer l'opposition (however)", english: "However" },
    { id: 9, term: "de plus", definition: "Connecteur pour ajouter un argument supplémentaire (furthermore)", english: "Furthermore" },
    { id: 10, term: "en effet", definition: "Connecteur pour confirmer une explication (indeed)", english: "Indeed / In fact" },
    { id: 11, term: "par conséquent", definition: "Connecteur de conséquence (therefore)", english: "As a result / Therefore" },
    { id: 12, term: "surmonter les défis", definition: "Dépasser avec succès les épreuves scolaires", english: "To overcome challenges" },
    { id: 13, term: "améliorer", definition: "Rendre meilleur son niveau de français", english: "To improve" },
    { id: 14, term: "rédiger", definition: "Écrire un texte ou paragraphe structuré", english: "To draft / write" },
    { id: 15, term: "justifier", definition: "Apporter des preuves et raisons solides", english: "To justify" },
    { id: 16, term: "comparer", definition: "Rechercher les ressemblances et différences", english: "To compare" },
    { id: 17, term: "synthétiser", definition: "Résumer l'essentiel d'un grand document", english: "To summarize" },
    { id: 18, term: "collaborer", definition: "Travailler efficacement en équipe", english: "To collaborate" },
    { id: 19, term: "développer", definition: "Expliciter une idée avec plus de détails", english: "To develop / expand" },
    { id: 20, term: "l'organisation", definition: "Gestion méthodique de son travail et temps", english: "Organization" },
    { id: 21, term: "la persévérance", definition: "Effort continu malgré les obstacles", english: "Perseverance" },
    { id: 22, term: "néanmoins", definition: "Malgré cela / toutefois (nevertheless)", english: "Nevertheless" },
    { id: 23, term: "ainsi", definition: "De cette manière / donc (thus)", english: "Thus / So" },
    { id: 24, term: "en résumé", definition: "Pour conclure brièvement une présentation", english: "In summary" },
    { id: 25, term: "l'autonomie", definition: "Capacité à travailler de façon indépendante", english: "Autonomy" },
    { id: 26, term: "rechercher", definition: "Chercher des informations fiables", english: "To research" },
    { id: 27, term: "communiquer", definition: "Échanger des idées avec clarté", english: "To communicate" },
    { id: 28, term: "l'engagement", definition: "Participation active et sérieuse", english: "Commitment" },
    { id: 29, term: "la créativité", definition: "Capacité d'invention et d'originalité", english: "Creativity" },
    { id: 30, term: "la réussite", definition: "Succès dans l'accomplissement d'un objectif", english: "Success / Achievement" }
  ];

  // Hero Léo Pixar Avatar
  const leoHero = {
    id: 'leo',
    name: 'Léo',
    image: '/images/avatars/avatar_leo.jpg'
  };

  // Defense Towers Catalog
  const towerCatalog = [
    {
      id: 'laser',
      name: 'Tour Laser de Rentrée',
      cost: 150,
      damage: 45,
      range: 120,
      icon: 'laser',
      description: 'Tire des rayons laser à haute énergie sur les Oublis d\'Été !'
    },
    {
      id: 'freeze',
      name: 'Piège de Gel Temporel',
      cost: 100,
      damage: 15,
      range: 100,
      icon: 'freeze',
      description: 'Ralentit la vitesse des monstres de 50% !'
    },
    {
      id: 'shield',
      name: 'Mur de Bouclier d\'Accord',
      cost: 75,
      damage: 0,
      range: 60,
      icon: 'shield',
      description: 'Bloque le passage et absorbe les attaques !'
    }
  ];

  // Game States
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'victory', 'gameover'
  const [gemsCount, setGemsCount] = useState(250);
  const [castleHp, setCastleHp] = useState(100);
  const [currentWave, setCurrentWave] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedTowerType, setSelectedTowerType] = useState('laser');

  // Tower Placements on Track Slots (6 Strategic Slots)
  const [builtTowers, setBuiltTowers] = useState({});

  // Active Wave Monsters State
  const [monsters, setMonsters] = useState([]);

  // Question & Answers State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [shuffledVocab, setShuffledVocab] = useState(masterVocabBank);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // Web Audio Synthesizer
  const playSfx = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'gem-gain') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'tower-build') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'laser-fire') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  // Generate shuffled options for current question
  const generateQuestion = (idx, list) => {
    const currentItem = list[idx];
    if (!currentItem) return;

    const incorrects = list
      .filter((i) => i.id !== currentItem.id)
      .map((i) => i.definition)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOpts = [...incorrects, currentItem.definition].sort(() => 0.5 - Math.random());
    setOptions(allOpts);
    setFeedback(null);
  };

  const handleStartGame = () => {
    const shuffled = [...masterVocabBank].sort(() => 0.5 - Math.random());
    setShuffledVocab(shuffled);
    setCurrentQIndex(0);
    setGemsCount(250);
    setCastleHp(100);
    setCurrentWave(1);
    setScore(0);
    setBuiltTowers({});
    setGameState('playing');

    // Spawn Initial Wave Monsters
    spawnMonsterWave(1);
    generateQuestion(0, shuffled);
    playSfx('gem-gain');
  };

  const spawnMonsterWave = (waveNum) => {
    const monsterCount = 3 + waveNum * 2;
    const newMonsters = [];
    for (let i = 0; i < monsterCount; i++) {
      newMonsters.push({
        id: i + 1,
        name: "Oubli d'Été #" + (i + 1),
        progress: -i * 24, // staggered start positions
        hp: 60 + waveNum * 25,
        maxHp: 60 + waveNum * 25,
        speed: 0.65 + waveNum * 0.08,
        isFrozen: false
      });
    }
    setMonsters(newMonsters);
  };

  // Game Loop Ticker for Monsters March & Towers Firing
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameInterval = setInterval(() => {
      setMonsters((prevMonsters) => {
        let castleTookDamage = false;

        const updated = prevMonsters.map((m) => {
          if (m.hp <= 0) return m;

          // Apply Tower Laser Damage on Monsters near towers
          let damageReceived = 0;
          let slowEffect = 1;

          Object.values(builtTowers).forEach((t) => {
            if (t.type === 'laser') {
              damageReceived += 3;
            } else if (t.type === 'freeze') {
              slowEffect = 0.5;
            }
          });

          const currentSpeed = m.speed * slowEffect;
          const newProgress = m.progress + currentSpeed;

          // Check if monster reached castle gate (progress >= 100)
          if (newProgress >= 100 && m.hp > 0) {
            castleTookDamage = true;
            return { ...m, progress: 100, hp: 0 };
          }

          const newHp = Math.max(0, m.hp - damageReceived);
          return { ...m, progress: newProgress, hp: newHp };
        });

        if (castleTookDamage) {
          setCastleHp((prev) => {
            const nextHp = Math.max(0, prev - 15);
            if (nextHp <= 0) {
              setGameState('gameover');
            }
            return nextHp;
          });
        }

        // Check if all monsters are defeated in wave
        const aliveMonsters = updated.filter((m) => m.progress < 100 && m.hp > 0);
        if (aliveMonsters.length === 0 && prevMonsters.length > 0) {
          if (currentWave < 5) {
            setCurrentWave((w) => w + 1);
            spawnMonsterWave(currentWave + 1);
            setGemsCount((g) => g + 150); // Wave bonus gems
          } else {
            setGameState('victory');
          }
        }

        return updated;
      });
    }, 150);

    return () => clearInterval(gameInterval);
  }, [gameState, builtTowers, currentWave]);

  const handleAnswerSubmit = (chosenDef) => {
    if (feedback) return;

    const currentQ = shuffledVocab[currentQIndex];
    const isCorrect = chosenDef === currentQ.definition;

    if (isCorrect) {
      playSfx('gem-gain');
      const earnedGems = 100;
      setGemsCount((prev) => prev + earnedGems);
      setScore((prev) => prev + 150);

      setFeedback({
        type: 'correct',
        msg: `🎯 EXCELLENT ! +${earnedGems} Gemmes d'Énergie gagnées !`,
        sub: `"${currentQ.term}" = ${currentQ.definition}`
      });
    } else {
      setFeedback({
        type: 'wrong',
        msg: `❌ INCORRECT ! Le sens exact était :`,
        sub: `"${currentQ.term}" ➔ ${currentQ.definition}`
      });
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    const nextIdx = (currentQIndex + 1) % shuffledVocab.length;
    setCurrentQIndex(nextIdx);
    generateQuestion(nextIdx, shuffledVocab);
  };

  const handleBuildTowerSlot = (slotId) => {
    const towerSpec = towerCatalog.find((t) => t.id === selectedTowerType);
    if (!towerSpec) return;

    if (gemsCount < towerSpec.cost) {
      alert(`⚠️ Pas assez de Gemmes ! Il vous faut ${towerSpec.cost} Gemmes d'Énergie.`);
      return;
    }

    setGemsCount((prev) => prev - towerSpec.cost);
    playSfx('tower-build');

    setBuiltTowers((prev) => ({
      ...prev,
      [slotId]: {
        type: selectedTowerType,
        name: towerSpec.name,
        cost: towerSpec.cost
      }
    }));
  };

  const currentQ = shuffledVocab[currentQIndex];

  return (
    <div className="tower-defense-container fade-in">
      
      {/* ARENA HEADER BAR */}
      <div className="td-arena-header">
        <div className="flex items-center gap-3">
          <div className="td-arena-badge">
            <Radio size={24} className="text-amber-900" />
          </div>
          <div>
            <h2 className="td-arena-title">
              La Tour Défense du Vocabulaire de Rentrée
            </h2>
            <p className="td-arena-sub">
              Défendez les portes du château contre les "Oublis d'Été" !
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="td-stat-pill text-amber-700">
            <Gem size={16} className="text-amber-600" />
            <span>Gemmes :</span>
            <strong className="font-black text-amber-900">{gemsCount} 💎</strong>
          </div>
          <div className="td-stat-pill text-rose-700">
            <Shield size={16} className="text-rose-600" />
            <span>Château :</span>
            <strong className="font-black text-rose-900">{castleHp} PV</strong>
          </div>
          <div className="td-stat-pill text-indigo-700">
            <Radio size={16} className="text-indigo-600" />
            <span>Vague :</span>
            <strong className="font-black text-indigo-900">{currentWave} / 5</strong>
          </div>
        </div>
      </div>

      {/* STAGE 1: DIRECT START MENU */}
      {gameState === 'menu' && (
        <div className="td-menu-card fade-in text-center">
          <div className="td-sparkle-hero mb-6">
            <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-amber-400 shadow-sm text-amber-700">
              <Radio size={32} />
            </div>
            <h3 className="font-black text-2xl text-amber-900 mb-2">
              Les "Oublis d'Été" attaquent le Château du Vocabulaire !
            </h3>
            <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed font-medium mb-4">
              Répondez aux questions de vocabulaire de rentrée (<u className="font-bold text-amber-700">verbes académiques : exprimer, analyser, surmonter, partager, connecteurs & expressions</u>) pour gagner des <strong>Gemmes d'Énergie 💎</strong> et bâtir vos tours de défense !
            </p>
          </div>

          {/* TOWERS CATALOG OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-6 text-left text-xs">
            {towerCatalog.map((t) => (
              <div key={t.id} className="bg-white/90 p-3 rounded-xl border-2 border-amber-300 shadow-xs">
                <span className="font-black text-slate-900 block mb-1">{t.name}</span>
                <span className="text-amber-700 font-extrabold block mb-1">Coût : {t.cost} 💎</span>
                <p className="text-slate-600 text-[11px] font-medium">{t.description}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleStartGame}
            className="td-start-btn text-sm font-black uppercase tracking-wider"
          >
            <Play size={20} /> Entrer dans la Bataille de Tour Défense !
          </button>
        </div>
      )}

      {/* STAGE 2: ACTIVE TOWER DEFENSE GAMEPLAY */}
      {gameState === 'playing' && (
        <div className="td-battle-stage fade-in relative">
          
          {/* ELEGANT SEMI-TRANSPARENT LÉO WATERMARK BACKGROUND */}
          <div className="td-character-watermark-bg">
            <img src={leoHero.image} alt="" className="td-watermark-img" />
          </div>

          {/* 2D MAP TRACK WITH MONSTERS & SLOTS FOR TOWERS */}
          <div className="td-map-canvas">
            <div className="td-castle-gate flex items-center justify-between px-4 py-2 bg-amber-950/80 text-amber-100 rounded-xl border-2 border-amber-400 mb-3 text-xs font-black">
              <span>🏰 Portes du Château Magique (PV : {castleHp} / 100)</span>
              <span>👾 Vague {currentWave} des Oublis d'Été</span>
            </div>

            {/* MONSTER MARCHING PATH */}
            <div className="td-marching-path">
              {monsters.map((m) => (
                <div 
                  key={m.id}
                  className="td-monster-token"
                  style={{ left: `${Math.min(92, Math.max(2, m.progress))}%` }}
                >
                  <div className="td-monster-hp-bar">
                    <div 
                      className="td-monster-hp-fill"
                      style={{ width: `${Math.max(0, (m.hp / m.maxHp) * 100)}%` }}
                    />
                  </div>
                  <span className="td-monster-sprite">👾</span>
                </div>
              ))}
            </div>

            {/* 6 TOWER BUILDING SLOTS ARRANGED IN A NON-WRAPPING HORIZONTAL ROW */}
            <div className="td-slots-row mt-3">
              <span className="text-xs font-black text-amber-900 block mb-1.5">
                🏗️ Emplacements de Tours (Cliquez pour construire avec vos Gemmes) :
              </span>
              <div className="td-slots-horizontal-row">
                {['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6'].map((slotId, idx) => (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => handleBuildTowerSlot(slotId)}
                    className={`td-slot-card ${builtTowers[slotId] ? 'built' : ''}`}
                  >
                    {builtTowers[slotId] ? (
                      <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                        <span className="text-xs">
                          {builtTowers[slotId].type === 'laser' ? '🗼' : builtTowers[slotId].type === 'freeze' ? '🧊' : '🛡️'}
                        </span>
                        <span className="text-[11px] font-black text-amber-950">
                          {builtTowers[slotId].name.split(' ')[0]}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                        <span className="text-[11px] font-bold text-slate-700">+ Bâtir</span>
                        <span className="text-[10px] text-amber-800 font-black">
                          ({towerCatalog.find((t) => t.id === selectedTowerType)?.cost}💎)
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* TOWER SELECTOR BAR FORMING A SINGLE NON-WRAPPING HORIZONTAL ROW */}
            <div className="td-towers-horizontal-row mt-3">
              {towerCatalog.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTowerType(t.id)}
                  className={`td-tower-select-pill ${selectedTowerType === t.id ? 'active' : ''}`}
                >
                  <span className="text-base">{t.id === 'laser' ? '🗼' : t.id === 'freeze' ? '🧊' : '🛡️'}</span>
                  <span className="font-extrabold text-xs">{t.name}</span>
                  <strong className="text-amber-800 font-black text-xs">({t.cost} 💎)</strong>
                </button>
              ))}
            </div>

          </div>

          {/* VOCABULARY GEM GENERATOR QUESTION CARD */}
          <div className="td-question-card mt-4">
            <span className="td-question-tag">
              💎 Générateur de Gemmes • Défi Vocabulaire {currentQIndex + 1} / 30 :
            </span>

            <h3 className="td-question-term font-black text-2xl text-amber-950 mb-3">
              "{currentQ.term}"
            </h3>

            {!feedback ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAnswerSubmit(opt)}
                    className="td-option-btn text-xs font-bold text-slate-900"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className={`td-feedback-box ${feedback.type} fade-in text-center`}>
                <p className="font-black text-sm mb-1">{feedback.msg}</p>
                <p className="text-xs font-bold mb-3">{feedback.sub}</p>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="td-next-btn text-xs font-black uppercase tracking-wider"
                >
                  Prochaine Question <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* STAGE 3: VICTORY SCREEN */}
      {gameState === 'victory' && (
        <div className="td-result-card victory fade-in text-center">
          <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl border-2 border-amber-300">
            <Trophy size={36} />
          </div>

          <h3 className="font-black text-2xl text-amber-900 mb-1">
            🎉 VICTOIRE ! Le Château est sauvé des Oublis d'Été !
          </h3>
          <p className="text-xs text-slate-700 mb-6 font-semibold">
            Félicitations Léo ! Votre maîtrise du vocabulaire de rentrée est imprenable !
          </p>

          <button
            type="button"
            onClick={handleStartGame}
            className="td-start-btn text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
          >
            <RotateCcw size={16} /> Recommencer la Partie
          </button>
        </div>
      )}

      {/* STAGE 4: GAMEOVER SCREEN */}
      {gameState === 'gameover' && (
        <div className="td-result-card gameover fade-in text-center">
          <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl border-2 border-rose-400">
            <XCircle size={36} />
          </div>

          <h3 className="font-black text-2xl text-rose-700 mb-1">
            Le Château a été submergé...
          </h3>
          <p className="text-xs text-slate-700 mb-6 font-semibold">
            Les Oublis d'Été ont franchi les portes. Révisez le vocabulaire et reprenez la défense !
          </p>

          <button
            type="button"
            onClick={handleStartGame}
            className="td-start-btn text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
          >
            <RotateCcw size={16} /> Réessayer la Défense du Château
          </button>
        </div>
      )}

    </div>
  );
}
