import React, { useState, useMemo } from 'react';
import { UNIT_1_VOCAB, UNIT_2_VOCAB, UNIT_3_VOCAB, UNIT_4_VOCAB, generateQuestionOptions } from '../../data/vocabulary';
import { TrendingUp, LifeBuoy } from 'lucide-react';
import './Games.css';

export default function JournalistLadder({ unitId, onBack }) {
  const vocabData = unitId === '4' ? UNIT_4_VOCAB : unitId === '3' ? UNIT_3_VOCAB : (unitId === '2' ? UNIT_2_VOCAB : UNIT_1_VOCAB);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [lifelines, setLifelines] = useState({ fiftyFifty: true });
  const [shuffledVocab] = useState(() => [...vocabData].sort(() => Math.random() - 0.5));
  
  const currentQuestion = level < 10 ? shuffledVocab[level % shuffledVocab.length] : null;
  const options = useMemo(() => {
    return currentQuestion ? generateQuestionOptions(currentQuestion) : [];
  }, [currentQuestion]);

  // Clean eliminated options when question changes
  React.useEffect(() => {
    setEliminatedOptions([]);
  }, [currentQuestion]);

  const handleAnswer = (ans) => {
    if (ans === currentQuestion.word) {
      setLevel(l => l + 1);
    } else {
      setGameOver(true);
    }
  };

  const use5050 = () => {
    if (!lifelines.fiftyFifty) return;
    setLifelines({ ...lifelines, fiftyFifty: false });
    
    // Find 2 wrong options to eliminate
    const wrongOpts = options.filter(o => o !== currentQuestion.word);
    const toEliminate = [wrongOpts[0], wrongOpts[1]];
    setEliminatedOptions(toEliminate);
  };

  if (level >= 10) {
    return (
      <div className="game-shell flex-center">
        <h2 className="text-success">Félicitations !</h2>
        <p>Tu es maintenant Rédacteur en Chef !</p>
        <button className="play-btn btn-success mt-4" onClick={onBack}>Retour</button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="game-shell flex-center">
        <h2 className="text-danger">Erreur !</h2>
        <p>Tu as été renvoyé au poste de stagiaire.</p>
        <button className="play-btn btn-danger mt-4" onClick={onBack}>Réessayer</button>
      </div>
    );
  }

  const getTitles = () => {
    switch(unitId) {
      case '2': return ["Élève", "Étudiant", "Assistant", "Professeur", "Chercheur", "Doyen", "Recteur"];
      case '3': return ["Débutant", "Technicien", "Développeur", "Ingénieur", "Expert Sécurité", "Architecte", "CTO"];
      case '4': return ["Bénévole", "Stagiaire", "Assistant Social", "Travailleur Social", "Coordinateur", "Directeur", "Ministre de la Solidarité"];
      default: return ["Stagiaire", "Pigiste", "Rédacteur junior", "Journaliste", "Grand Reporter", "Chef de rubrique", "Rédacteur en Chef"];
    }
  };

  const titles = getTitles();
  const currentTitle = titles[Math.min(titles.length - 1, Math.floor(level / 2))];

  return (
    <div className="game-shell">
      <div className="flex-between">
        <button className="back-btn" onClick={onBack}>&larr; Quitter</button>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Poste: <strong className="text-accent">{currentTitle}</strong></span>
          <span>Niveau: {level + 1}/10</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button 
          className="back-btn" 
          onClick={use5050} 
          disabled={!lifelines.fiftyFifty}
          style={{ opacity: lifelines.fiftyFifty ? 1 : 0.5 }}
        >
          <LifeBuoy size={16} style={{ marginRight: '0.5rem' }}/> 50/50
        </button>
      </div>

      {currentQuestion && (
        <div className="text-center mt-4">
          <p style={{ fontSize: '1.2rem', margin: '2rem 0' }}>
            {currentQuestion.definition}
          </p>

          <div className="mcq-grid">
            {options.map((opt, i) => {
              const isEliminated = eliminatedOptions.includes(opt);
              return (
                <button 
                  key={i} 
                  className="option-btn" 
                  onClick={() => !isEliminated && handleAnswer(opt)}
                  style={{ visibility: isEliminated ? 'hidden' : 'visible' }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
