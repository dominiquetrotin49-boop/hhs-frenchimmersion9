import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, VolumeX, CheckCircle, HelpCircle, ArrowRight, ArrowLeft, Award, Search, Sparkles, UserCheck, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import { NOVEL_CHAPTERS } from '../data/novelData';
import './NovelReader.css';

const getBaseVocabWords = (vocabList) => {
  if (!vocabList) return [];
  const words = [];
  vocabList.forEach(item => {
    let raw = item.word.split('(')[0].trim().toLowerCase();
    const parts = raw.split('/').map(p => p.trim());
    
    parts.forEach(part => {
      let w = part.replace(/^(un|une|des|le|la|les|l'|d'|l’|d’)\s*/, '').trim();
      if (!w) return;
      
      words.push(w);
      
      if (w.endsWith("er")) {
        const stem = w.slice(0, -2);
        words.push(stem + "ent");
        words.push(stem + "e");
        words.push(stem + "a");
        words.push(stem + "ait");
      }
      
      if (w.startsWith("s'") || w.startsWith("se ")) {
        const verbCore = w.replace(/^(s'|se\s+)/, '');
        words.push(verbCore);
        if (verbCore.endsWith("er")) {
          const stem = verbCore.slice(0, -2);
          words.push("s'" + stem + "ent");
          words.push("s'" + stem + "e");
          words.push("s'" + stem + "a");
          words.push("s'" + stem + "ait");
          words.push(stem + "ent");
          words.push(stem + "e");
          words.push(stem + "a");
          words.push(stem + "ait");
        }
      }
    });
  });
  return Array.from(new Set(words));
};

const renderParagraphWithHighlights = (paragraph, vocabWords, pIdx) => {
  const translationParts = paragraph.split(/(\([a-zA-Z\s,'’-]+\))/g);
  
  return (
    <p key={pIdx} className="pdf-paragraph">
      {translationParts.map((part, partIdx) => {
        if (part.startsWith('(') && part.endsWith(')')) {
          return <strong key={partIdx} className="inline-translation">{part}</strong>;
        }
        
        if (!vocabWords || vocabWords.length === 0) {
          return part;
        }
        
        const escapedWords = vocabWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const regex = new RegExp(`((?<=^|[^a-zA-Z0-9À-ÿ])(?:${escapedWords})s?(?=$|[^a-zA-Z0-9À-ÿ]))`, 'gi');
        
        const subParts = part.split(regex);
        return subParts.map((subPart, subPartIdx) => {
          const isVocab = vocabWords.some(w => {
            const cleanedSub = subPart.trim().toLowerCase().replace(/s$/, '');
            return cleanedSub === w || (w.endsWith('s') && subPart.trim().toLowerCase() === w);
          });
          
          if (isVocab) {
            return <strong key={`${partIdx}-${subPartIdx}`} className="vocab-highlight">{subPart}</strong>;
          }
          return subPart;
        });
      })}
    </p>
  );
};

export default function NovelReader({ onBack }) {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('reading'); // 'reading', 'vocab', 'quiz'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAudioObj, setActiveAudioObj] = useState(null);
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const chapter = NOVEL_CHAPTERS[activeChapterIdx];
  const currentPage = chapter.pages[activePageIdx];
  const vocabWords = getBaseVocabWords(chapter.vocabList);
  const isFemaleNarrator = chapter.narrator === 'samira';

  // Reset page and audio on chapter change
  useEffect(() => {
    stopAudio();
    setActivePageIdx(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [activeChapterIdx]);

  // Reset audio on page change
  useEffect(() => {
    stopAudio();
  }, [activePageIdx]);

  const stopAudio = () => {
    if (activeAudioObj) {
      activeAudioObj.pause();
      setActiveAudioObj(null);
    }
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  const playPageAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    if (currentPage.audioSrc) {
      const audio = new Audio(currentPage.audioSrc);
      setActiveAudioObj(audio);
      setIsPlayingAudio(true);

      audio.onended = () => {
        setIsPlayingAudio(false);
        setActiveAudioObj(null);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        setActiveAudioObj(null);
      };

      audio.play().catch(e => console.log("Audio playback error:", e));
    } else {
      const utterance = new SpeechSynthesisUtterance(currentPage.text);
      utterance.lang = 'fr-FR';
      utterance.rate = isFemaleNarrator ? 0.92 : 0.95;
      utterance.pitch = isFemaleNarrator ? 1.25 : 1.05;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectQuizOpt = (qId, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers({ ...quizAnswers, [qId]: optIdx });
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    chapter.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctIdx) {
        score += 100;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const isVercel = (typeof process !== 'undefined' && process.env && process.env.VERCEL_URL) || window.location.hostname.includes('vercel');

  if (isVercel && activeChapterIdx !== 0) {
    return (
      <div className="novel-container glass-panel animate-in">
        <div className="novel-header">
          <div className="novel-header-info">
            <span className="novel-badge">📖 Roman Interactif — Le Mystère de l'Horloge Boréale</span>
          </div>
          {onBack && (
            <button className="novel-back-btn" onClick={onBack}>
              ← Retour au tableau de bord
            </button>
          )}
        </div>

        <div className="chapter-selector-container">
          {NOVEL_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              className={`chapter-tab-btn ${activeChapterIdx === idx ? 'active' : ''}`}
              onClick={() => setActiveChapterIdx(idx)}
            >
              <span className="chapter-num">{ch.number}</span>
              <span className="chapter-tab-title">{ch.title}</span>
            </button>
          ))}
        </div>

        <div className="section-content animate-in empty-state glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
          <h3>Nous n'y sommes pas encore.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="novel-container glass-panel animate-in">
      {/* Novel Header */}
      <div className="novel-header">
        <div className="novel-header-info">
          <span className="novel-badge">📖 Roman Interactif — Le Mystère de l'Horloge Boréale</span>
          <h1 className="novel-main-title">{chapter.number} : {chapter.title}</h1>
        </div>
        {onBack && (
          <button className="novel-back-btn" onClick={onBack}>
            ← Retour au tableau de bord
          </button>
        )}
      </div>

      {/* Chapter Navigation Bar */}
      <div className="chapter-selector-container">
        {NOVEL_CHAPTERS.map((ch, idx) => (
          <button
            key={ch.id}
            className={`chapter-tab-btn ${activeChapterIdx === idx ? 'active' : ''}`}
            onClick={() => setActiveChapterIdx(idx)}
          >
            <span className="chapter-num">{ch.number}</span>
            <span className="chapter-tab-title">{ch.title}</span>
          </button>
        ))}
      </div>

      {/* Subtabs (Lecture, Vocabulaire, Quiz) */}
      <div className="novel-subtabs">
        <button
          className={`subtab-btn ${activeTab === 'reading' ? 'active' : ''}`}
          onClick={() => setActiveTab('reading')}
        >
          <BookOpen size={18} />
          <span>Lecture ({activePageIdx + 1}/3 Pages)</span>
        </button>
        <button
          className={`subtab-btn ${activeTab === 'vocab' ? 'active' : ''}`}
          onClick={() => setActiveTab('vocab')}
        >
          <Search size={18} />
          <span>Fiche de Vocabulaire ({chapter.vocabList.length} mots)</span>
        </button>
        <button
          className={`subtab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          <HelpCircle size={18} />
          <span>Quiz du Chapitre</span>
        </button>
      </div>

      {/* SUBTAB 1 : READING & MULTI-PAGE NARRATIVE */}
      {activeTab === 'reading' && (
        <div className="novel-reading-section">
          {/* Page Switcher Tabs */}
          <div className="page-switcher-bar">
            {chapter.pages.map((p, pIdx) => (
              <button
                key={p.pageNumber}
                className={`page-tab-btn ${activePageIdx === pIdx ? 'active' : ''}`}
                onClick={() => setActivePageIdx(pIdx)}
              >
                <span>{p.title}</span>
              </button>
            ))}
          </div>

          {/* Book Page Card */}
          <div className={`book-page-card glass-panel ${isPlayingAudio ? 'audio-active-glow' : ''}`}>
            <div className="page-card-header">
              <h3 className="page-heading">{currentPage.title}</h3>
              <button
                className={`page-audio-btn ${isPlayingAudio ? 'playing' : ''}`}
                onClick={playPageAudio}
              >
                {isPlayingAudio ? <Pause size={18} /> : <Volume2 size={18} />}
                <span>{isPlayingAudio ? "Pause" : "Écouter la page"}</span>
              </button>
            </div>

            {/* Centered Chapter Title Block matching PDF document layout */}
            <div className="pdf-chapter-header">
              <h2 className="pdf-chapter-num">{chapter.number}</h2>
              <h3 className="pdf-chapter-title">{chapter.title}</h3>
            </div>

            {activePageIdx === 0 && chapter.image && (
              <div className="chapter-scene-image-box" style={{ margin: '1.5rem 0', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <img
                  src={chapter.image}
                  alt={`Scène clé du ${chapter.number}`}
                  style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            <div className="page-body-text pdf-prose">
              {currentPage.text.split('\n\n').map((paragraph, pIdx) => 
                renderParagraphWithHighlights(paragraph, vocabWords, pIdx)
              )}
            </div>
          </div>

          {/* Bottom Page Navigation Controls */}
          <div className="page-nav-controls">
            <button
              className="page-nav-btn"
              onClick={() => setActivePageIdx(activePageIdx - 1)}
              disabled={activePageIdx === 0}
            >
              <ChevronLeft size={20} />
              <span>Page Précédente</span>
            </button>

            <span className="page-indicator">
              Page {activePageIdx + 1} sur {chapter.pages.length}
            </span>

            {activePageIdx < chapter.pages.length - 1 ? (
              <button
                className="page-nav-btn primary"
                onClick={() => setActivePageIdx(activePageIdx + 1)}
              >
                <span>Page Suivante</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              activeChapterIdx < NOVEL_CHAPTERS.length - 1 && (
                <button
                  className="page-nav-btn accent"
                  onClick={() => setActiveChapterIdx(activeChapterIdx + 1)}
                >
                  <span>Chapitre Suivant : {NOVEL_CHAPTERS[activeChapterIdx + 1].title}</span>
                  <ArrowRight size={20} />
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2 : FICHE DE VOCABULAIRE */}
      {activeTab === 'vocab' && (
        <div className="novel-vocab-section">
          <h3 className="vocab-section-title">📚 Vocabulaire Clé — {chapter.number}</h3>
          <div className="vocab-grid">
            {chapter.vocabList.map((item, idx) => (
              <div key={idx} className="vocab-card glass-panel">
                <span className="vocab-word">{item.word}</span>
                <p className="vocab-definition">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3 : COMPREHENSION QUIZ */}
      {activeTab === 'quiz' && (
        <div className="novel-quiz-section">
          <h3 className="quiz-section-title">🧪 Quiz de Compréhension — {chapter.number}</h3>
          {!quizSubmitted ? (
            <div>
              {chapter.quiz.map((q) => (
                <div key={q.id} className="quiz-card glass-panel">
                  <h4 className="quiz-question">{q.id}. {q.question}</h4>
                  <div className="quiz-options-list">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        className={`quiz-opt-btn ${quizAnswers[q.id] === optIdx ? 'selected' : ''}`}
                        onClick={() => handleSelectQuizOpt(q.id, optIdx)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                className="submit-quiz-btn"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < chapter.quiz.length}
              >
                Valider mes réponses
              </button>
            </div>
          ) : (
            <div className="quiz-results-card glass-panel text-center">
              <Award size={64} className="score-icon" />
              <h3>Résultats du Quiz — {chapter.number}</h3>
              <p className="score-value">{quizScore} / {chapter.quiz.length * 100} pts</p>
              <p className="score-feedback">
                {quizScore === chapter.quiz.length * 100
                  ? "Félicitations ! Vous avez parfaitement compris ce chapitre !"
                  : "Bon travail ! Relisez les 3 pages pour réussir le quiz à 100%."}
              </p>

              <div className="quiz-review-list">
                {chapter.quiz.map((q) => (
                  <div key={q.id} className="review-item text-left">
                    <p className="review-q"><strong>{q.id}. {q.question}</strong></p>
                    <p className="review-explanation">💡 Explication : {q.explanation}</p>
                  </div>
                ))}
              </div>

              <button
                className="retry-quiz-btn"
                onClick={() => setQuizSubmitted(false)}
              >
                Recommencer le Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
