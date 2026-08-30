import React, { useState } from 'react';
import './Games.css';

const DIALOGUES = [
  {
    id: 1,
    text: "— Tu as installé le nouvel antivirus ?\n— Oui, je ___ ai installé hier.",
    options: ["le", "l'", "lui", "en"],
    correctIdx: 1,
    explanation: "COD (le nouvel antivirus) avant une voyelle (ai) devient l'."
  },
  {
    id: 2,
    text: "— Est-ce que tu penses souvent à ton empreinte numérique ?\n— Oui, j' ___ pense toujours avant de publier.",
    options: ["le", "la", "y", "en"],
    correctIdx: 2,
    explanation: "Penser À quelque chose -> y."
  },
  {
    id: 3,
    text: "— Tu as parlé des paramètres de confidentialité aux élèves ?\n— Oui, je ___ en ai parlé.",
    options: ["les", "leur", "lui", "y"],
    correctIdx: 1,
    explanation: "Parler À des personnes au pluriel (aux élèves) -> leur."
  },
  {
    id: 4,
    text: "— Combien de comptes as-tu protégés ?\n— J' ___ ai protégé trois.",
    options: ["y", "les", "en", "lui"],
    correctIdx: 2,
    explanation: "Une quantité (trois) -> en."
  },
  {
    id: 5,
    text: "— Tu bloques les spams ?\n— Bien sûr, je ___ bloque tous les jours.",
    options: ["le", "les", "la", "leur"],
    correctIdx: 1,
    explanation: "COD pluriel (les spams) -> les."
  }
];

export default function PronounFill({ onBack }) {
  const [currentD, setCurrentD] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelectedOpt(idx);
    setShowResult(true);
    
    if (idx === DIALOGUES[currentD].correctIdx) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentD < DIALOGUES.length - 1) {
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
          <p className="win-text">Votre score : {score} / {DIALOGUES.length}</p>
          <button className="mcq-btn mt-4" onClick={onBack}>Menu Principal</button>
        </div>
      </div>
    );
  }

  const d = DIALOGUES[currentD];
  const parts = d.text.split('___');

  return (
    <div className="game-container glass-panel">
      <div className="flex-between mb-4">
        <button className="back-btn" onClick={onBack}>← Retour</button>
        <span className="text-accent font-bold">Dialogue {currentD + 1} / {DIALOGUES.length}</span>
      </div>

      <div className="q-header text-center mb-6">
        <h3 className="text-gradient">Texte à trous : Les Pronoms</h3>
        <p>Lisez le petit dialogue de cybersécurité et choisissez le pronom manquant.</p>
        
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
            {currentD < DIALOGUES.length - 1 ? 'Dialogue Suivant' : 'Terminer'}
          </button>
        </div>
      )}
    </div>
  );
}
