import React, { useState } from 'react';
import './Games.css';

export default function GrammarFill({ data, title, description, onBack }) {
  const [currentD, setCurrentD] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelectedOpt(idx);
    setShowResult(true);
    
    if (idx === data[currentD].correctIdx) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentD < data.length - 1) {
      setCurrentD(currentD + 1);
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
          <p className="win-text">Votre score : {score} / {data.length}</p>
          <button className="mcq-btn mt-4" onClick={onBack}>Menu Principal</button>
        </div>
      </div>
    );
  }

  const d = data[currentD];
  const parts = d.text.split('___');

  return (
    <div className="game-container glass-panel">
      <div className="flex-between mb-4">
        <button className="back-btn" onClick={onBack}>← Retour</button>
        <span className="text-accent font-bold">Question {currentD + 1} / {data.length}</span>
      </div>

      <div className="q-header text-center mb-6">
        <h3 className="text-gradient">{title}</h3>
        <p>{description}</p>
        
        <div className="text-xl mt-6 bg-white bg-opacity-50 p-6 rounded-xl text-left whitespace-pre-wrap font-mono">
          {parts[0]}
          <span className="inline-block border-b-2 border-dashed border-gray-600 px-4 font-bold text-accent">
            {showResult ? d.options[selectedOpt] : '___'}
          </span>
          {parts[1]}
        </div>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        {d.options.map((opt, idx) => {
          let btnClass = "mcq-btn";
          if (showResult) {
            if (idx === d.correctIdx) btnClass += " active-vrai";
            else if (idx === selectedOpt) btnClass += " active-faux";
            else btnClass += " opacity-50";
          }

          return (
            <button 
              key={idx} 
              className={btnClass} 
              style={{ minWidth: '100px' }}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="text-center mt-6 slide-in">
          <p className={`font-bold mb-2 ${selectedOpt === d.correctIdx ? 'text-success' : 'text-danger'}`}>
            {selectedOpt === d.correctIdx ? 'Correct !' : 'Incorrect !'}
          </p>
          <p className="mb-4">{d.explanation}</p>
          <button className="mcq-btn btn-accent" onClick={handleNext}>
            {currentD < data.length - 1 ? 'Question Suivante' : 'Terminer'}
          </button>
        </div>
      )}
    </div>
  );
}
