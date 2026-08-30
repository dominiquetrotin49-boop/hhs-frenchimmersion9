import React, { useState } from 'react';
import './Games.css';

const QUESTIONS = [
  {
    id: 1,
    sentence: "Je télécharge [le fichier antivirus].",
    options: [
      "Je la télécharge.",
      "Je le télécharge.",
      "Je les télécharge."
    ],
    correctIdx: 1,
    explanation: "COD masculin singulier (le fichier) -> le."
  },
  {
    id: 2,
    sentence: "Elle parle [aux hackers].",
    options: [
      "Elle les parle.",
      "Elle lui parle.",
      "Elle leur parle."
    ],
    correctIdx: 2,
    explanation: "COI pluriel, personnes (aux hackers) -> leur."
  },
  {
    id: 3,
    sentence: "Nous pensons [à notre cybersécurité].",
    options: [
      "Nous y pensons.",
      "Nous la pensons.",
      "Nous en pensons."
    ],
    correctIdx: 0,
    explanation: "'à' + chose (cybersécurité) -> y."
  },
  {
    id: 4,
    sentence: "Vous supprimez [les spams].",
    options: [
      "Vous les supprimez.",
      "Vous en supprimez.",
      "Vous y supprimez."
    ],
    correctIdx: 0,
    explanation: "COD pluriel (les spams) -> les."
  },
  {
    id: 5,
    sentence: "Tu as [beaucoup de mots de passe] ?",
    options: [
      "Tu y as beaucoup ?",
      "Tu en as beaucoup ?",
      "Tu les as beaucoup ?"
    ],
    correctIdx: 1,
    explanation: "Quantité / de + chose (beaucoup de mots de passe) -> en."
  }
];

export default function PronounReplacement({ onBack }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelectedOpt(idx);
    setShowResult(true);
    
    if (idx === QUESTIONS[currentQ].correctIdx) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="game-container glass-panel">
        <button className="back-btn" onClick={onBack}>← Retour</button>
        <div className="win-screen">
          <h2 className="win-title">Jeu Terminé !</h2>
          <p className="win-text">Votre score : {score} / {QUESTIONS.length}</p>
          <button className="mcq-btn mt-4" onClick={onBack}>Menu Principal</button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentQ];
  const parts = q.sentence.split('[');
  const before = parts[0];
  const target = parts[1].split(']')[0];
  const after = parts[1].split(']')[1] || '';

  return (
    <div className="game-container glass-panel">
      <div className="flex-between mb-4">
        <button className="back-btn" onClick={onBack}>← Retour</button>
        <span className="text-accent font-bold">Score: {score}</span>
      </div>

      <div className="q-header text-center mb-6">
        <h3 className="text-gradient">QCM : Remplacement</h3>
        <p>Remplacez les mots entre crochets par le bon pronom objet.</p>
        <div className="text-xl mt-4 bg-white bg-opacity-50 p-4 rounded-xl">
          {before}<strong className="text-danger">[{target}]</strong>{after}
        </div>
      </div>

      <div className="mcq-options flex-col" style={{ alignItems: 'center' }}>
        {q.options.map((opt, idx) => {
          let btnClass = "mcq-btn";
          if (showResult) {
            if (idx === q.correctIdx) btnClass += " active-vrai";
            else if (idx === selectedOpt) btnClass += " active-faux";
            else btnClass += " opacity-50";
          }

          return (
            <button 
              key={idx} 
              className={btnClass} 
              style={{ width: '80%', marginBottom: '1rem' }}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="text-center mt-4 slide-in">
          <p className={`font-bold mb-2 ${selectedOpt === q.correctIdx ? 'text-success' : 'text-danger'}`}>
            {selectedOpt === q.correctIdx ? 'Correct !' : 'Incorrect !'}
          </p>
          <p className="mb-4">{q.explanation}</p>
          <button className="mcq-btn btn-accent" onClick={handleNext}>
            {currentQ < QUESTIONS.length - 1 ? 'Suivant' : 'Terminer'}
          </button>
        </div>
      )}
    </div>
  );
}
