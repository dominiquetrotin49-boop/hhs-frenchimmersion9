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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #4f46e5;
  padding: 0.55rem 1.25rem;
  border-radius: 0.75rem;
  align-self: flex-start;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.back-btn:hover {
  background: #eef2ff;
  border-color: #a5b4fc;
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
  padding: 2.25rem 1.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.15rem;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.04);
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px -4px rgba(79, 70, 229, 0.14);
  border-color: #a5b4fc;
}

.game-icon-container {
  width: 68px;
  height: 68px;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
  transition: transform 0.25s ease;
}

.game-card:hover .game-icon-container {
  transform: scale(1.06);
}

.game-card h4 {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin: 0;
}

.game-card p {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
  flex-grow: 1;
}

.play-btn {
  margin-top: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  width: 100%;
  background: #4f46e5;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.22);
}

.play-btn:hover {
  background: #4338ca;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
}

.play-btn:active {
  transform: scale(0.98);
}

.disney-option-btn {
  width: 100%;
  background: #f8fafc !important;
  color: #0f172a !important;
  border: 1.5px solid #e2e8f0 !important;
  border-radius: 0.85rem !important;
  padding: 0.95rem 1.25rem !important;
  font-size: 0.925rem !important;
  font-weight: 600 !important;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.disney-option-btn:hover:not(:disabled) {
  border-color: #818cf8 !important;
  background: #eef2ff !important;
  color: #312e81 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.disney-option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.88;
}

.disney-option-btn.correct {
  border-color: #10b981 !important;
  background: #ecfdf5 !important;
  color: #065f46 !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.disney-option-btn.wrong {
  border-color: #f43f5e !important;
  background: #fff1f2 !important;
  color: #9f1239 !important;
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.15);
}
`;

function GameSection({ chapterId, vocabulary, initialMode }) {
  // If initialMode is provided use it, else if 'unite-reprise' default to 'speedrunner', otherwise 'menu'
  const [mode, setMode] = useState(initialMode || (chapterId === 'unite-reprise' ? 'speedrunner' : 'menu'));

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
              <span className="font-bold tracking-tight text-lg text-slate-900">Pratique Ludique</span>
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

      {/* MODE SELECTION MENU */}
      {mode === 'menu' && chapterId !== 'unite-reprise' && (
        <div className="practice-menu-container animate-in">
          <div className="game-cards-container">
            <div className="game-card" onClick={() => setMode('flashcards')}>
              <div className="game-icon-container bg-indigo-50 text-indigo-600">
                <Sparkles size={32} />
              </div>
              <h4>Cartes Mémoires</h4>
              <p>Révisez le vocabulaire de l'unité avec des cartes mémoires interactives en trois dimensions.</p>
              <button className="play-btn">Lancer les Cartes Mémoires</button>
            </div>

            <div className="game-card" onClick={() => setMode('quiz')}>
              <div className="game-icon-container bg-indigo-50 text-indigo-600">
                <Award size={32} />
              </div>
              <h4>Quiz Défi : Vocabulaire</h4>
              <p>Testez vos connaissances et tentez d'obtenir un score parfait au questionnaire à choix multiples.</p>
              <button className="play-btn">Lancer le Quiz Défi</button>
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
                    <span className="badge-aqua text-xs" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>Traduction &amp; Définition</span>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        speakFrench(currentWord.term, { audioUrl: currentWord.audioUrl }); 
                      }} 
                      className="audio-btn"
                      style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.35)' }}
                    >
                      <Volume2 size={16} /> Réécouter
                    </button>
                  </div>

                  <div className="my-auto text-center px-4 flex flex-col gap-3">
                    <div className="bg-white text-slate-900 font-extrabold text-xl py-2.5 px-6 rounded-2xl shadow-md border border-indigo-200 inline-block mx-auto">
                      Anglais : <span className="text-indigo-700 font-black">{currentWord.english || currentWord.term}</span>
                    </div>

                    <p className="text-white text-base font-semibold leading-relaxed max-w-md mx-auto mt-1">
                      {currentWord.definition}
                    </p>
                  </div>

                  <div className="hint flex items-center gap-2">
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

            <button onClick={markForReview} className="btn-secondary border-amber-300 text-amber-800 bg-amber-50">
              🤔 À revoir
            </button>

            <button onClick={markAsKnown} className="btn-primary bg-emerald-600 border-none">
              ✅ Maîtrisé !
            </button>

            <button onClick={handleNext} className="btn-secondary flex items-center gap-2">
              Suivant <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: QUIZ MATCHING */}
      {mode === 'quiz' && (
        <div className="orthographe-disney-container max-w-2xl mx-auto py-6 shadow-md animate-in">
          
          {/* Activity Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-bold tracking-tight text-xl text-slate-900 flex items-center gap-2">
                <HelpCircle className="text-indigo-600" size={22} />
                Quiz Défi : Vocabulaire
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Sélectionnez la définition correcte pour le terme affiché ci-dessous.
              </p>
            </div>

            {/* Gamified Mastery Badge */}
            <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 flex-shrink-0">
              <Award size={16} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-800">
                Score : {score} / {currentList.length}
              </span>
            </div>
          </div>

          {quizIndex < currentList.length ? (
            <div className="ortho-card-disney flex flex-col gap-5 text-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 inline-block mb-3">
                  Question {quizIndex + 1} sur {currentList.length}
                </span>
                
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 mb-1">
                  {currentList[quizIndex]?.term}
                </h2>
                
                {currentList[quizIndex]?.english && (
                  <div className="text-xs font-semibold text-indigo-600 mb-3">
                    Indice Anglais : {currentList[quizIndex]?.english}
                  </div>
                )}
                
                {/* Audio Button */}
                <button
                  type="button"
                  onClick={() => speakFrench(currentList[quizIndex]?.term, { audioUrl: currentList[quizIndex]?.audioUrl })}
                  className="audio-btn mx-auto mb-2"
                >
                  <Volume2 size={16} /> 🔊 Écouter le mot
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
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={28} />
                Quiz Terminé !
              </h3>
              <p className="text-base font-semibold text-slate-700">
                Votre score final : <span className="text-indigo-600 font-black text-2xl underline">{score} / {currentList.length}</span>
              </p>
              <button 
                onClick={() => { setQuizIndex(0); setScore(0); }} 
                className="play-btn mt-4 max-w-xs mx-auto"
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
