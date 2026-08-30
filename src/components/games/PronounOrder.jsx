import React, { useState } from 'react';
import './Games.css';

const SENTENCES = [
  {
    fr: "Je donne le mot de passe au hacker.",
    words: ["Je", "le", "lui", "donne", "."],
    hint: "le (COD) avant lui (COI)."
  },
  {
    fr: "Tu me prêtes ton ordinateur ?",
    words: ["Tu", "me", "le", "prêtes", "?"],
    hint: "me (1) avant le (2)."
  },
  {
    fr: "Il parle de la cybersécurité à ses amis.",
    words: ["Il", "leur", "en", "parle", "."],
    hint: "leur (3) avant en (5)."
  },
  {
    fr: "Nous envoyons les fichiers sur le serveur.",
    words: ["Nous", "les", "y", "envoyons", "."],
    hint: "les (2) avant y (4)."
  }
];

export default function PronounOrder({ onBack }) {
  const [currentS, setCurrentS] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([...SENTENCES[0].words].sort(() => Math.random() - 0.5));
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelectWord = (word, idx) => {
    setSelectedWords([...selectedWords, word]);
    const newAvail = [...availableWords];
    newAvail.splice(idx, 1);
    setAvailableWords(newAvail);
    setErrorMsg('');
  };

  const handleDeselectWord = (word, idx) => {
    const newAvail = [...availableWords, word];
    setAvailableWords(newAvail);
    const newSel = [...selectedWords];
    newSel.splice(idx, 1);
    setSelectedWords(newSel);
    setErrorMsg('');
  };

  const checkOrder = () => {
    const target = SENTENCES[currentS].words.join(' ');
    const current = selectedWords.join(' ');
    
    if (current === target) {
      setSuccess(true);
    } else {
      setErrorMsg("L'ordre est incorrect. Réessayez ! Indice : " + SENTENCES[currentS].hint);
      // Reset
      setAvailableWords([...SENTENCES[currentS].words].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
    }
  };

  const nextSentence = () => {
    if (currentS < SENTENCES.length - 1) {
      const nextIdx = currentS + 1;
      setCurrentS(nextIdx);
      setSuccess(false);
      setErrorMsg('');
      setSelectedWords([]);
      setAvailableWords([...SENTENCES[nextIdx].words].sort(() => Math.random() - 0.5));
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
          <p className="win-text">Bravo ! Vous maîtrisez l'ordre des doubles pronoms.</p>
          <button className="mcq-btn mt-4" onClick={onBack}>Menu Principal</button>
        </div>
      </div>
    );
  }

  const isComplete = availableWords.length === 0;

  return (
    <div className="game-container glass-panel">
      <div className="flex-between mb-4">
        <button className="back-btn" onClick={onBack}>← Retour</button>
        <span className="text-accent font-bold">Phrase {currentS + 1} / {SENTENCES.length}</span>
      </div>

      <div className="q-header text-center mb-6">
        <h3 className="text-gradient">L'Ordre des Pronoms</h3>
        <p className="mb-4">Cliquez sur les mots dans le bon ordre pour remplacer les mots soulignés avec des doubles pronoms.</p>
        
        <div className="p-4 bg-white bg-opacity-30 rounded-xl mb-4 italic">
          "{SENTENCES[currentS].fr}"
        </div>
      </div>

      {/* Drop Zone */}
      <div className="min-h-[80px] bg-black bg-opacity-10 rounded-xl p-4 flex flex-wrap gap-2 mb-6 items-center justify-center border-2 border-dashed border-gray-400">
        {selectedWords.length === 0 && <span className="text-gray-500 opacity-50">Votre phrase apparaîtra ici...</span>}
        {selectedWords.map((w, i) => (
          <button 
            key={i} 
            className="word-btn used"
            onClick={() => handleDeselectWord(w, i)}
            disabled={success}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Available Words */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {availableWords.map((w, i) => (
          <button 
            key={i} 
            className="word-btn"
            onClick={() => handleSelectWord(w, i)}
          >
            {w}
          </button>
        ))}
      </div>

      <div className="text-center">
        {!success && (
          <button 
            className="mcq-btn btn-accent" 
            onClick={checkOrder}
            disabled={!isComplete}
          >
            Vérifier
          </button>
        )}
        
        {errorMsg && <p className="text-danger mt-4 font-bold slide-in">{errorMsg}</p>}
        
        {success && (
          <div className="slide-in">
            <p className="text-success font-bold text-xl mb-4">Correct ! 🎉</p>
            <button className="mcq-btn btn-success" onClick={nextSentence}>
              {currentS < SENTENCES.length - 1 ? 'Phrase Suivante' : 'Terminer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
