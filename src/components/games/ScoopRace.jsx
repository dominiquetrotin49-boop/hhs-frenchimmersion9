import React, { useState, useMemo } from 'react';
import { UNIT_1_VOCAB, UNIT_2_VOCAB, UNIT_3_VOCAB, UNIT_4_VOCAB, generateQuestionOptions } from '../../data/vocabulary';
import { Flag, Car, AlertCircle } from 'lucide-react';

export default function ScoopRace({ unitId, onBack }) {
  const getWinMessage = () => {
    switch(unitId) {
      case '2': return "Tu as réussi tes examens brillamment !";
      case '3': return "Tu as publié ta technologie en premier !";
      case '4': return "Tu as trouvé la solution pour l'association !";
      default: return "Tu as publié le Scoop en premier !";
    }
  };

  const getLossMessage = () => {
    switch(unitId) {
      case '2': return "Tes concurrents ont eu de meilleures notes...";
      case '3': return "L'entreprise rivale a breveté l'idée avant toi.";
      case '4': return "Le temps a manqué pour aider tout le monde...";
      default: return "Le journal rival a publié le Scoop avant toi.";
    }
  };

  const vocabData = unitId === '4' ? UNIT_4_VOCAB : unitId === '3' ? UNIT_3_VOCAB : unitId === '2' ? UNIT_2_VOCAB : UNIT_1_VOCAB;
  const [playerPos, setPlayerPos] = useState(0);
  const [rivalPos, setRivalPos] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [message, setMessage] = useState('');
  const trackLength = 10;
  
  const [shuffledVocab] = useState(() => [...vocabData].sort(() => Math.random() - 0.5));
  const currentQuestion = shuffledVocab[questionIndex % shuffledVocab.length];
  const options = useMemo(() => generateQuestionOptions(currentQuestion), [currentQuestion]);

  const handleAnswer = (ans) => {
    if (ans === currentQuestion.word) {
      setPlayerPos(p => p + 1);
      setMessage('Bien joué !');
    } else {
      setRivalPos(r => r + 1);
      setMessage('Oups ! Le rival avance.');
    }
    setTimeout(() => {
      setMessage('');
      setQuestionIndex(i => i + 1);
    }, 1000);
  };

  if (playerPos >= trackLength) {
    return (
      <div className="game-shell flex-center">
        <h2>Victoire !</h2>
        <p>{getWinMessage()}</p>
        <button className="play-btn btn-accent mt-4" onClick={onBack}>Retour</button>
      </div>
    );
  }

  if (rivalPos >= trackLength) {
    return (
      <div className="game-shell flex-center">
        <h2>Défaite...</h2>
        <p>{getLossMessage()}</p>
        <button className="play-btn btn-danger mt-4" onClick={onBack}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="game-shell">
      <button className="back-btn" onClick={onBack}>&larr; Quitter</button>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Race Track */}
        <div style={{ position: 'relative', height: '100px', borderBottom: '2px dashed var(--text-secondary)' }}>
          <div style={{ position: 'absolute', top: '10px', left: `${(playerPos / trackLength) * 90}%`, transition: 'left 0.5s', color: 'var(--accent-primary)' }}>
            <Car size={32} />
            <div style={{ fontSize: '0.8rem' }}>Toi</div>
          </div>
          <div style={{ position: 'absolute', top: '50px', left: `${(rivalPos / trackLength) * 90}%`, transition: 'left 0.5s', color: 'var(--accent-danger)' }}>
            <Car size={32} />
            <div style={{ fontSize: '0.8rem' }}>Rival</div>
          </div>
          <Flag size={32} style={{ position: 'absolute', right: '0', top: '30px', color: 'white' }} />
        </div>

        {message ? (
          <div className="flex-center" style={{ minHeight: '150px' }}>
            <h3>{message}</h3>
          </div>
        ) : currentQuestion && (
          <div className="text-center">
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              Complète la phrase :<br/><br/>
              <em>"{currentQuestion.sentence}"</em>
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
    </div>
  );
}
