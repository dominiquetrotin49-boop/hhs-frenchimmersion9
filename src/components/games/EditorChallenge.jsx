import React, { useState, useEffect, useMemo } from 'react';
import { UNIT_1_VOCAB, UNIT_2_VOCAB, UNIT_3_VOCAB, UNIT_4_VOCAB, generateQuestionOptions } from '../../data/vocabulary';
import { Clock } from 'lucide-react';

export default function EditorChallenge({ unitId, onBack }) {
  const getBossTitle = () => {
    switch(unitId) {
      case '2': return "Le Professeur dit :";
      case '3': return "Le Maître Hacker dit :";
      case '4': return "Le Directeur de l'association dit :";
      default: return "Le Rédacteur en chef dit :";
    }
  };

  const vocabData = unitId === '4' ? UNIT_4_VOCAB : unitId === '3' ? UNIT_3_VOCAB : unitId === '2' ? UNIT_2_VOCAB : UNIT_1_VOCAB;
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [flash, setFlash] = useState(null); // 'green' or 'red'

  const [shuffledVocab] = useState(() => [...vocabData].sort(() => Math.random() - 0.5));
  const currentQuestion = shuffledVocab[questionIndex % shuffledVocab.length];
  const options = useMemo(() => generateQuestionOptions(currentQuestion, vocabData), [currentQuestion, vocabData]);
  const isDefinition = useMemo(() => Math.random() > 0.5, [questionIndex]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (ans) => {
    if (gameOver) return;
    
    if (ans === currentQuestion.word) {
      setScore(s => s + 100);
      setTimeLeft(t => t + 3);
      setFlash('green');
      setTimeout(() => {
        setFlash(null);
        setQuestionIndex(i => i + 1);
      }, 500);
    } else {
      setTimeLeft(t => Math.max(0, t - 5));
      setFlash('red');
      setTimeout(() => setFlash(null), 500);
    }
  };

  if (gameOver) {
    return (
      <div className="game-shell flex-center">
        <h2>Temps Écoulé !</h2>
        <p>Ton score final: <strong className="text-accent">{score}</strong></p>
        <button className="play-btn btn-danger mt-4" onClick={onBack}>Retour au menu</button>
      </div>
    );
  }

  return (
    <div className={`game-shell ${flash === 'red' ? 'shake' : ''}`} style={{ transition: 'background 0.2s', backgroundColor: flash === 'green' ? 'rgba(16,185,129,0.2)' : flash === 'red' ? 'rgba(244,63,94,0.2)' : '' }}>
      <button className="back-btn" onClick={onBack}>&larr; Retour</button>
      
      <div className="flex-between">
        <div className="flex-center" style={{ gap: '0.5rem', fontSize: '1.5rem', color: timeLeft < 10 ? 'var(--accent-danger)' : 'white' }}>
          <Clock /> {timeLeft}s
        </div>
        <div style={{ fontSize: '1.25rem' }}>Score: {score}</div>
      </div>

      {currentQuestion && (
        <div className="text-center mt-4">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-accent)' }}>{getBossTitle()}</h3>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            {isDefinition ? currentQuestion.definition : currentQuestion.sentence}
          </p>

          <div className="mcq-grid">
            {options.map((opt, i) => (
              <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
