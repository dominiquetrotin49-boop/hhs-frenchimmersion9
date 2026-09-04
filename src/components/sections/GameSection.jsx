import React, { useState, useEffect } from 'react';
import { speakFrench } from '../../utils/speechUtils';
import { Gamepad2, Volume2, RotateCw, CheckCircle, HelpCircle, Shuffle, Award, ArrowRight, ArrowLeft, Sparkles, Zap, Compass, Sword, Shield, Flame, Radio, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import SpeedRunnerPrepositions from '../games/SpeedRunnerPrepositions';
import BossBattlePresent from '../games/BossBattlePresent';
import TowerDefenseVocab from '../games/TowerDefenseVocab';
import StoryRPGFirstDay from '../games/StoryRPGFirstDay';

const STYLE_BLOCK = `
.practice-menu-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.back-btn {
  background: transparent;
  border: 1px solid #0891b2; /* cyan-600 */
  color: #0891b2;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  align-self: flex-start;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  background: rgba(8, 145, 178, 0.1);
  transform: translateX(-2px);
}

.game-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-top: 0.5rem;
}

.game-card {
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s, border-color 0.25s;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(8, 145, 178, 0.15);
  border-radius: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.game-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(8, 145, 178, 0.15);
  border-color: #0891b2; /* cyan-600 */
}

.game-icon-container {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
  transition: transform 0.3s;
}

.game-card:hover .game-icon-container {
  transform: scale(1.1) rotate(5deg);
}

.game-card h4 {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a; /* slate-900 */
  margin: 0;
}

.game-card p {
  font-size: 0.95rem;
  color: #475569; /* slate-600 */
  line-height: 1.6;
  margin: 0;
  flex-grow: 1;
}

.play-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  border-radius: 0.6rem;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  width: 100%;
  transition: background-color 0.2s, transform 0.1s;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.play-btn:active {
  transform: scale(0.97);
}

.disney-option-btn {
  width: 100%;
  background: rgba(15, 23, 42, 0.8) !important;
  color: #ffffff !important;
  border: 2px solid rgba(251, 191, 36, 0.4) !important;
  border-radius: 0.75rem !important;
  padding: 0.85rem 1.25rem !important;
  font-size: 0.925rem !important;
  font-weight: 600 !important;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease !important;
}

.disney-option-btn:hover:not(:disabled) {
  border-color: #fbbf24 !important;
  background: rgba(15, 23, 42, 0.9) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.15);
}

.disney-option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.disney-option-btn.correct {
  border-color: #10b981 !important;
  background: rgba(16, 185, 129, 0.25) !important;
  color: #a7f3d0 !important;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
}

.disney-option-btn.wrong {
  border-color: #f43f5e !important;
  background: rgba(244, 63, 94, 0.25) !important;
  color: #fecdd3 !important;
  box-shadow: 0 0 10px rgba(244, 63, 94, 0.2);
}
`;

function GameSection({ chapterId, vocabulary }) {
  // If we are in 'unite-reprise', default to 'speedrunner', otherwise 'menu'
  const [mode, setMode] = useState(chapterId === 'unite-reprise' ? 'speedrunner' : 'menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState(new Set());
  const [reviewWords, setReviewWords] = useState(new Set());
  const [shuffledList, setShuffledList] = useState([]);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);

  const currentList = shuffledList.length > 0 ? shuffledList : (vocabulary || []);

  useEffect(() => {
    if (vocabulary && vocabulary.length > 0) {
      setShuffledList([...vocabulary]);
    }
  }, [vocabulary]);

  // Sync default mode if unit changes
  useEffect(() => {
    if (chapterId === 'unite-reprise') {
      setMode('speedrunner');
    } else {
      setMode('menu');
    }
  }, [chapterId]);

  // Generate quiz options for current question
  useEffect(() => {
    if (mode === 'quiz' && currentList.length > 0) {
      const current = currentList[quizIndex];
      if (!current) return;

      const otherDefs = vocabulary
        .filter(item => item.term !== current.term)
        .map(item => item.definition);

      const shuffledOther = [...otherDefs].sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [...shuffledOther, current.definition].sort(() => 0.5 - Math.random());
      
      setQuizOptions(options);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [mode, quizIndex, currentList, vocabulary]);

  const handleShuffle = () => {
    const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
    setShuffledList(shuffled);
    setCurrentIndex(0);
    setQuizIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % currentList.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + currentList.length) % currentList.length);
    }, 150);
  };

  const markAsKnown = () => {
    const current = currentList[currentIndex];
    setKnownWords(prev => new Set(prev).add(current.term));
    setReviewWords(prev => {
      const copy = new Set(prev);
      copy.delete(current.term);
      return copy;
    });
    handleNext();
  };

  const markForReview = () => {
    const current = currentList[currentIndex];
    setReviewWords(prev => new Set(prev).add(current.term));
    setKnownWords(prev => {
      const copy = new Set(prev);
      copy.delete(current.term);
      return copy;
    });
    handleNext();
  };

  const handleQuizAnswer = (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const current = currentList[quizIndex];
    const correct = option === current.definition;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      speakFrench(current.term, { audioUrl: current.audioUrl });
    }

    setTimeout(() => {
      if (quizIndex + 1 < currentList.length) {
        setQuizIndex(prev => prev + 1);
      } else {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      }
    }, 1500);
  };

  const currentWord = currentList[currentIndex] || vocabulary[0];

  return (
    <div className="section-container glass-container fade-in">
      <style>{STYLE_BLOCK}</style>
      
      {/* Title Header & Mode Switcher */}
      {(chapterId === 'unite-reprise' || (!['flashcards', 'quiz'].includes(mode) && mode !== 'menu')) && (
        <div className="section-title flex flex-col gap-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="section-header-icon-badge game-badge">
                <Gamepad2 size={24} />
              </span>
              <span className="font-extrabold text-lg text-slate-900">Pratique Ludique</span>
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          {(chapterId === 'unite-reprise' || mode === 'speedrunner' || mode === 'bossbattle' || mode === 'towerdefense' || mode === 'storyrpg') && (
            <div className="grid grid-cols-4 gap-2 w-full">
              <button 
                onClick={() => setMode('speedrunner')} 
                className={`btn-secondary text-xs py-2 px-2 flex items-center justify-center gap-1.5 w-full whitespace-nowrap ${
                  mode === 'speedrunner' ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md' : 'text-slate-700'
                }`}
              >
                <Compass size={13} className={mode === 'speedrunner' ? 'text-slate-950' : 'text-amber-700'} />
                <span className="truncate font-black">1. Speed-Runner</span>
              </button>

              <button 
                onClick={() => setMode('bossbattle')} 
                className={`btn-secondary text-xs py-2 px-2 flex items-center justify-center gap-1.5 w-full whitespace-nowrap ${
                  mode === 'bossbattle' ? 'bg-rose-500 text-white font-black border-rose-400 shadow-md' : 'text-slate-700'
                }`}
              >
                <Sword size={13} className={mode === 'bossbattle' ? 'text-white' : 'text-rose-700'} />
                <span className="truncate font-black">2. L'Arène</span>
              </button>

              <button 
                onClick={() => setMode('towerdefense')} 
                className={`btn-secondary text-xs py-2 px-2 flex items-center justify-center gap-1.5 w-full whitespace-nowrap ${
                  mode === 'towerdefense' ? 'bg-indigo-600 text-white font-black border-indigo-400 shadow-md' : 'text-slate-700'
                }`}
              >
                <Radio size={13} className={mode === 'towerdefense' ? 'text-white' : 'text-indigo-700'} />
                <span className="truncate font-black">3. Tour Défense</span>
              </button>

              <button 
                onClick={() => setMode('storyrpg')} 
                className={`btn-secondary text-xs py-2 px-2 flex items-center justify-center gap-1.5 w-full whitespace-nowrap ${
                  mode === 'storyrpg' ? 'bg-emerald-600 text-white font-black border-emerald-400 shadow-md' : 'text-slate-700'
                }`}
              >
                <BookOpen size={13} className={mode === 'storyrpg' ? 'text-white' : 'text-emerald-700'} />
                <span className="truncate font-black">4. Premier Jour</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Back Button for non-reprise modes when playing */}
      {(mode === 'flashcards' || mode === 'quiz') && chapterId !== 'unite-reprise' && (
        <button className="back-btn mb-6" onClick={() => setMode('menu')}>
          ← Retour aux exercices
        </button>
      )}

      {/* MODE SELECTION MENU (Redesign matching Grade 11 style) */}
      {mode === 'menu' && chapterId !== 'unite-reprise' && (
        <div className="practice-menu-container animate-in">
          <div className="game-cards-container">
            <div className="game-card" onClick={() => setMode('flashcards')}>
              <div className="game-icon-container" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                <Sparkles size={32} />
              </div>
              <h4>Cartes 3D : Vocabulaire</h4>
              <p>Révisez le vocabulaire de l'unité avec des cartes mémoires interactives en trois dimensions.</p>
              <button className="play-btn bg-cyan-600 hover:bg-cyan-700">Lancer les Cartes 3D</button>
            </div>

            <div className="game-card" onClick={() => setMode('quiz')}>
              <div className="game-icon-container" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                <Award size={32} />
              </div>
              <h4>Quiz Défi : Vocabulaire</h4>
              <p>Testez vos connaissances et tentez d'obtenir un score parfait au questionnaire à choix multiples.</p>
              <button className="play-btn bg-indigo-600 hover:bg-indigo-700">Lancer le Quiz Défi</button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 0A: SPEED RUNNER PREPOSITIONS DISNEY */}
      {mode === 'speedrunner' && (
        <SpeedRunnerPrepositions />
      )}

      {/* MODE 0B: L'ARÈNE DU PRÉSENT BOSS BATTLE 3D */}
      {mode === 'bossbattle' && (
        <BossBattlePresent />
      )}

      {/* MODE 0C: LA TOUR DÉFENSE DU VOCABULAIRE DE RENTRÉE */}
      {mode === 'towerdefense' && (
        <TowerDefenseVocab />
      )}

      {/* MODE 0D: L'AVENTURE DE LA PREMIÈRE JOURNÉE STORY RPG */}
      {mode === 'storyrpg' && (
        <StoryRPGFirstDay />
      )}


      {/* MODE 1: FLASHCARDS 3D */}
      {mode === 'flashcards' && (
        <div className="flashcard-game-wrapper">
          
          {/* Progress Tracker Bar */}
          <div className="flex justify-between items-center mb-6 px-2 text-sm font-semibold text-slate-700">
            <span>Mot {currentIndex + 1} sur {currentList.length}</span>
            <div className="flex gap-4">
              <span className="text-emerald-700 font-bold">Maîtrisés : {knownWords.size}</span>
              <span className="text-amber-700 font-bold">À revoir : {reviewWords.size}</span>
            </div>
          </div>

          {/* 3D Flashcard Container */}
          <div className="flashcard-container">
            <div 
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="flashcard-inner">
                
                {/* FRONT FACE (Shown when NOT flipped) */}
                <div className={`flashcard-front ${isFlipped ? 'hidden-face' : ''}`}>
                  <div className="flex justify-between w-full items-center">
                    <span className="badge-aqua text-xs">Français</span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        speakFrench(currentWord.term, { audioUrl: currentWord.audioUrl }); 
                      }} 
                      className="audio-btn"
                      title="Écouter la prononciation"
                    >
                      <Volume2 size={16} /> Écouter
                    </button>
                  </div>

                  <h2>{currentWord.term}</h2>

                  <div className="hint flex items-center gap-2">
                    <RotateCw size={16} />
                    <span>Cliquez pour tourner la carte</span>
                  </div>
                </div>

                {/* BACK FACE (Shown when flipped) */}
                <div className={`flashcard-back ${!isFlipped ? 'hidden-face' : ''}`}>
                  <div className="flex justify-between w-full items-center">
                    <span className="badge-aqua text-xs text-white">Traduction & Définition</span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        speakFrench(currentWord.term, { audioUrl: currentWord.audioUrl }); 
                      }} 
                      className="audio-btn bg-white/20 text-white border-white/40 hover:bg-white hover:text-cyan-800"
                    >
                      <Volume2 size={16} /> Réécouter
                    </button>
                  </div>

                  <div className="my-auto text-center px-4 flex flex-col gap-3">
                    <div className="bg-white text-slate-900 font-extrabold text-xl py-2.5 px-6 rounded-2xl shadow-md border border-cyan-200 inline-block mx-auto">
                      Anglais: <span className="text-cyan-700 font-black">{currentWord.english || currentWord.term}</span>
                    </div>

                    <p className="text-white text-base font-semibold leading-relaxed max-w-md mx-auto mt-1">
                      {currentWord.definition}
                    </p>
                  </div>

                  <div className="hint text-cyan-100 flex items-center gap-2">
                    <RotateCw size={16} />
                    <span>Cliquez pour revenir au mot</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Controls & Feedback Action Buttons */}
          <div className="game-controls flex flex-wrap items-center justify-center gap-4 mt-6">
            <button onClick={handlePrev} className="btn-secondary flex items-center gap-2">
              <ArrowLeft size={18} /> Précédent
            </button>

            <button onClick={markForReview} className="btn-secondary border-amber-400 text-amber-800 hover:bg-amber-50">
              🤔 À revoir
            </button>

            <button onClick={markAsKnown} className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-none">
              ✅ Maîtrisé !
            </button>

            <button onClick={handleNext} className="btn-secondary flex items-center gap-2">
              Suivant <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: QUIZ MATCHING (Redesigned in the style of L'Atelier d'Orthographe & Dictée Enchantée) */}
      {mode === 'quiz' && (
        <div className="orthographe-disney-container max-w-2xl mx-auto py-6 shadow-2xl animate-in">
          
          {/* Activity Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-400/30">
            <div>
              <h3 className="font-black text-xl text-white flex items-center gap-2">
                <HelpCircle className="text-amber-400 animate-pulse" size={22} />
                Quiz Défi : Vocabulaire
              </h3>
              <p className="text-xs text-amber-200/80 font-medium mt-0.5">
                Sélectionnez la définition correcte pour le terme affiché ci-dessous.
              </p>
            </div>

            {/* Gamified Mastery Badge */}
            <div className="flex items-center gap-2 bg-amber-400/20 px-3.5 py-1.5 rounded-full border border-amber-400/50 flex-shrink-0">
              <Award size={16} className="text-amber-400" />
              <span className="text-xs font-black text-amber-200">
                Score : {score} / {currentList.length}
              </span>
            </div>
          </div>

          {quizIndex < currentList.length ? (
            <div className="ortho-card-disney flex flex-col gap-5 text-center">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-md border border-amber-400/30 inline-block mb-3">
                  Question {quizIndex + 1} sur {currentList.length}
                </span>
                
                <h2 className="text-3xl font-black text-white mt-1.5 mb-1 font-serif">
                  {currentList[quizIndex]?.term}
                </h2>
                
                {currentList[quizIndex]?.english && (
                  <div className="text-xs font-bold text-cyan-300/85 mb-3">
                    Indice Anglais : {currentList[quizIndex]?.english}
                  </div>
                )}
                
                {/* Audio Button */}
                <button
                  type="button"
                  onClick={() => speakFrench(currentList[quizIndex]?.term, { audioUrl: currentList[quizIndex]?.audioUrl })}
                  className="text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 px-4 py-2 rounded-lg border border-cyan-400/40 flex items-center gap-1.5 transition-all shadow-xs mx-auto mb-2 cursor-pointer"
                >
                  <Volume2 size={16} className="text-cyan-400" /> 🔊 Écouter le mot
                </button>
              </div>

              {/* Options */}
              <div className="quiz-options flex flex-col gap-3">
                {quizOptions.map((option, idx) => {
                  let btnStateClass = "";
                  if (selectedOption === option) {
                    btnStateClass = isCorrect ? "correct" : "wrong";
                  } else if (selectedOption !== null && option === currentList[quizIndex]?.definition) {
                    btnStateClass = "correct";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={selectedOption !== null}
                      className={`disney-option-btn ${btnStateClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="ortho-card-disney p-8 text-center flex flex-col items-center gap-4">
              <h3 className="text-3xl font-black text-white flex items-center gap-2">
                <Sparkles className="text-amber-400 animate-bounce" size={32} />
                Quiz Terminé !
              </h3>
              <p className="text-lg font-bold text-amber-200">
                Votre score final : <span className="text-white font-black text-2xl underline">{score} / {currentList.length}</span>
              </p>
              <button 
                onClick={() => { setQuizIndex(0); setScore(0); }} 
                className="play-btn bg-cyan-600 hover:bg-cyan-700 mt-4 max-w-xs mx-auto"
              >
                Recommencer le Quiz 🔄
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GameSection;
