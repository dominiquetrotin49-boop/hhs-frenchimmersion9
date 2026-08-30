import React, { useState, useRef, useEffect } from 'react';
import './EscapeGame.css';

export default function Unit2EscapeGame() {
  const [stage, setStage] = useState(1);
  const [errorShake, setErrorShake] = useState(false);

  const triggerError = () => {
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  };

  const nextStage = () => setStage((prev) => prev + 1);

  return (
    <div className="escape-game-container">
      <h3 className="game-title">Mission : Créez l'École du Futur !</h3>
      <p className="game-subtitle">Étape {stage} sur 7</p>
      
      <div className={`stage-container ${errorShake ? 'error' : ''}`}>
        {stage === 1 && <StageOne onComplete={nextStage} onError={triggerError} />}
        {stage === 2 && <StageTwo onComplete={nextStage} onError={triggerError} />}
        {stage === 3 && <StageThree onComplete={nextStage} onError={triggerError} />}
        {stage === 4 && <StageFour onComplete={nextStage} onError={triggerError} />}
        {stage === 5 && <StageFive onComplete={nextStage} onError={triggerError} />}
        {stage === 6 && <StageSix onComplete={nextStage} onError={triggerError} />}
        {stage === 7 && <StageSeven onComplete={nextStage} onError={triggerError} />}
        {stage === 8 && (
          <div className="win-screen">
            <h2 className="win-title">FÉLICITATIONS !</h2>
            <p className="win-text">Vous avez conçu une école innovante, inclusive et prête pour l'avenir ! Votre projet a été accepté par la commune.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StageOne({ onComplete, onError }) {
  const [code, setCode] = useState(['', '', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.toUpperCase();
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);

    if (val && idx < 6) {
      inputs.current[idx + 1].focus();
    }
  };

  useEffect(() => {
    if (code.join('') === 'INNOVER') {
      setTimeout(onComplete, 500);
    } else if (code.join('').length === 7) {
      onError();
      setTimeout(() => {
        setCode(['', '', '', '', '', '', '']);
        inputs.current[0].focus();
      }, 500);
    }
  }, [code, onComplete, onError]);

  return (
    <div>
      <h4 className="stage-heading text-accent">1. La Mission</h4>
      <p className="clue-text">"Trouve le verbe en 7 lettres qui signifie : créer quelque chose de nouveau pour résoudre un problème de l'éducation de demain."</p>
      <div className="code-inputs">
        {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
          <input
            key={idx}
            ref={(el) => (inputs.current[idx] = el)}
            className="letter-input"
            maxLength={1}
            value={code[idx]}
            onChange={(e) => handleChange(e, idx)}
            type="text"
          />
        ))}
      </div>
    </div>
  );
}

function StageTwo({ onComplete, onError }) {
  const [shakeId, setShakeId] = useState(null);

  const handleChoice = (choice) => {
    if (choice === 'C') {
      onComplete();
    } else {
      setShakeId(choice);
      onError();
      setTimeout(() => setShakeId(null), 500);
    }
  };

  return (
    <div>
      <h4 className="stage-heading text-accent">2. La Structure</h4>
      <p className="clue-text">"Une école de demain doit être 'inclusive'. Qu'est-ce qu'une Éducation Inclusive ?"</p>
      <div className="mcq-options">
        <button 
          className={`mcq-btn ${shakeId === 'A' ? 'error' : ''}`} 
          onClick={() => handleChoice('A')}
        >A) Une école seulement pour les meilleurs élèves</button>
        <button 
          className={`mcq-btn ${shakeId === 'B' ? 'error' : ''}`} 
          onClick={() => handleChoice('B')}
        >B) Une école très stricte et disciplinaire</button>
        <button 
          className={`mcq-btn ${shakeId === 'C' ? 'error' : ''}`} 
          onClick={() => handleChoice('C')}
        >C) Une éducation qui intègre tous les enfants, sans distinction</button>
      </div>
    </div>
  );
}

const TERMS = [
  { id: 1, text: "Horaire flexible" },
  { id: 2, text: "Apprentissage hybride" },
  { id: 3, text: "Espace de détente" }
];

const DEFS = [
  { id: 2, text: "Mélange de cours en ligne et en classe." },
  { id: 3, text: "Lieu pour se reposer et socialiser entre les cours." },
  { id: 1, text: "Un emploi du temps qui s'adapte au rythme de l'élève." }
];

function StageThree({ onComplete, onError }) {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedDef, setSelectedDef] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (selectedTerm !== null && selectedDef !== null) {
      if (selectedTerm === selectedDef) {
        setMatches([...matches, selectedTerm]);
        setSelectedTerm(null);
        setSelectedDef(null);
      } else {
        onError();
        setTimeout(() => {
          setSelectedTerm(null);
          setSelectedDef(null);
        }, 500);
      }
    }
  }, [selectedTerm, selectedDef, matches, onError]);

  useEffect(() => {
    if (matches.length === 3) {
      setTimeout(onComplete, 1000);
    }
  }, [matches, onComplete]);

  return (
    <div>
      <h4 className="stage-heading text-accent">3. L'Emploi du temps</h4>
      <p className="clue-text">"Organisons la journée ! Associe chaque concept à sa définition pour structurer l'école."</p>
      <div className="matching-container">
        <div className="matching-col">
          {TERMS.map(t => (
            <button 
              key={t.id}
              className={`match-btn ${selectedTerm === t.id ? 'selected' : ''} ${matches.includes(t.id) ? 'matched' : ''}`}
              onClick={() => !matches.includes(t.id) && setSelectedTerm(t.id)}
            >
              {t.text}
            </button>
          ))}
        </div>
        <div className="matching-col">
          {DEFS.map(d => (
            <button 
              key={d.id}
              className={`match-btn ${selectedDef === d.id ? 'selected' : ''} ${matches.includes(d.id) ? 'matched' : ''}`}
              onClick={() => !matches.includes(d.id) && setSelectedDef(d.id)}
            >
              {d.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StageFour({ onComplete, onError }) {
  const [input, setInput] = useState('');

  const handleKey = (num) => {
    if (input.length < 5) {
      const newVal = input + num;
      setInput(newVal);
      if (newVal.length === 5) {
        if (newVal === '967110') {
          setTimeout(onComplete, 500);
        } else {
          onError();
          setTimeout(() => setInput(''), 500);
        }
      }
    }
  };

  return (
    <div>
      <h4 className="stage-heading text-accent">4. Philosophie d'éducation</h4>
      <p className="clue-text">"Pour valider votre pédagogie, comptez le nombre de lettres de ces mots :<br/><br/>[Pédagogie] - [Projet] - [Hybride] - [À] - [Montessori]"</p>
      <div className="keypad-container">
        <div className="keypad-display">{input.padEnd(5, '-')}</div>
        <div className="keypad-grid">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="key-btn" onClick={() => handleKey(n.toString())}>{n}</button>
          ))}
          <div style={{visibility: 'hidden'}}></div>
          <button className="key-btn" onClick={() => handleKey('0')}>0</button>
          <button className="key-btn" onClick={() => setInput('')}>C</button>
        </div>
      </div>
    </div>
  );
}

function StageFive({ onComplete, onError }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toUpperCase().trim() === 'TECHNOLOGIE') {
      onComplete();
    } else {
      onError();
      setInput('');
    }
  };

  return (
    <div>
      <h4 className="stage-heading text-accent">5. Les Matières Enseignées</h4>
      <p className="clue-text">"Quelle discipline spécialisée utiliserez-vous ? Remettez les lettres en ordre :"</p>
      <div className="anagram-box">
        <h2>C H G E L E O O T N I</h2>
      </div>
      <form onSubmit={handleSubmit} className="anagram-form">
        <input 
          type="text" 
          className="anagram-input"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="La discipline..."
          autoFocus
        />
        <button type="submit" className="mcq-btn">Valider</button>
      </form>
    </div>
  );
}

function StageSix({ onComplete, onError }) {
  const [answers, setAnswers] = useState({ q1: null, q2: null, q3: null });

  const setAnswer = (q, val) => {
    setAnswers(prev => ({ ...prev, [q]: val }));
  };

  const handleValidate = () => {
    if (answers.q1 === false && answers.q2 === true && answers.q3 === true) {
      onComplete();
    } else {
      onError();
      setAnswers({ q1: null, q2: null, q3: null });
    }
  };

  const isAllAnswered = answers.q1 !== null && answers.q2 !== null && answers.q3 !== null;

  return (
    <div>
      <h4 className="stage-heading text-accent">6. L'Équipe Pédagogique</h4>
      <p className="clue-text">"Définissez le rôle de vos professeurs de demain avec ces règles vraies ou fausses."</p>
      
      <div className="tf-container">
        <div className="tf-row">
          <span>1. Le professeur dicte seulement le cours et les élèves écoutent en silence.</span>
          <div className="tf-buttons">
            <button className={`tf-btn ${answers.q1 === true ? 'active-vrai' : ''}`} onClick={() => setAnswer('q1', true)}>Vrai</button>
            <button className={`tf-btn ${answers.q1 === false ? 'active-faux' : ''}`} onClick={() => setAnswer('q1', false)}>Faux</button>
          </div>
        </div>
        
        <div className="tf-row">
          <span>2. L'enseignant agit comme un guide ou un facilitateur dans l'apprentissage par projet.</span>
          <div className="tf-buttons">
            <button className={`tf-btn ${answers.q2 === true ? 'active-vrai' : ''}`} onClick={() => setAnswer('q2', true)}>Vrai</button>
            <button className={`tf-btn ${answers.q2 === false ? 'active-faux' : ''}`} onClick={() => setAnswer('q2', false)}>Faux</button>
          </div>
        </div>
        
        <div className="tf-row">
          <span>3. La collaboration entre élèves et enseignants est primordiale.</span>
          <div className="tf-buttons">
            <button className={`tf-btn ${answers.q3 === true ? 'active-vrai' : ''}`} onClick={() => setAnswer('q3', true)}>Vrai</button>
            <button className={`tf-btn ${answers.q3 === false ? 'active-faux' : ''}`} onClick={() => setAnswer('q3', false)}>Faux</button>
          </div>
        </div>
      </div>

      <button className="mcq-btn mt-4" style={{width: '100%'}} disabled={!isAllAnswered} onClick={handleValidate}>
        Valider la présentation
      </button>
    </div>
  );
}

function StageSeven({ onComplete, onError }) {
  const [sequence, setSequence] = useState([]);
  
  const handleColor = (color) => {
    const newSeq = [...sequence, color];
    setSequence(newSeq);
    
    if (newSeq.length === 4) {
      // Correct: Vert, Bleu, Rouge, Noir
      if (newSeq[0] === 'green' && newSeq[1] === 'blue' && newSeq[2] === 'red' && newSeq[3] === 'black') {
        setTimeout(onComplete, 500);
      } else {
        onError();
        setTimeout(() => setSequence([]), 500);
      }
    }
  };

  return (
    <div>
      <h4 className="stage-heading text-accent">7. Les Responsabilités et le Règlement</h4>
      <p className="clue-text">"Dans notre école, nous attendons de l'<strong>Autonomie (Vert)</strong>, de la <strong>Participation (Bleu)</strong>, un vrai <strong>Engagement (Rouge)</strong>, et le respect du <strong>Règlement (Noir)</strong>."</p>
      
      <div className="sequence-display">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="seq-dot" style={{ backgroundColor: sequence[i] || 'transparent' }}></div>
        ))}
      </div>

      <div className="color-btn-grid">
        <button className="color-btn bg-red" onClick={() => handleColor('red')}></button>
        <button className="color-btn bg-blue" onClick={() => handleColor('blue')}></button>
        <button className="color-btn bg-green" onClick={() => handleColor('green')}></button>
        <button className="color-btn bg-black" onClick={() => handleColor('black')}></button>
      </div>
      <button className="mcq-btn mt-4" style={{width: '100%', opacity: 0.5}} onClick={() => setSequence([])}>Effacer</button>
    </div>
  );
}
