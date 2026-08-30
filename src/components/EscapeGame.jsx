import React, { useState, useRef, useEffect } from 'react';
import './EscapeGame.css';

export default function EscapeGame() {
  const [stage, setStage] = useState(1);
  const [errorShake, setErrorShake] = useState(false);

  const triggerError = () => {
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  };

  const nextStage = () => setStage((prev) => prev + 1);

  return (
    <div className="escape-game-container">
      <h3 className="game-title">Mission: Sauvez le Journal !</h3>
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
            <h2 className="win-title">VICTOIRE !</h2>
            <p className="win-text">Bravo ! Tu as arrêté la censure et sauvé la liberté de la presse !</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StageOne({ onComplete, onError }) {
  const [code, setCode] = useState(['', '', '', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.toUpperCase();
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);

    if (val && idx < 7) {
      inputs.current[idx + 1].focus();
    }
  };

  useEffect(() => {
    if (code.join('') === 'CENSURER') {
      setTimeout(onComplete, 500);
    } else if (code.join('').length === 8) {
      onError();
      setTimeout(() => {
        setCode(['', '', '', '', '', '', '', '']);
        inputs.current[0].focus();
      }, 500);
    }
  }, [code, onComplete, onError]);

  return (
    <div>
      <p className="clue-text">"Trouve le verbe qui signifie 'bloquer ou interdire une information ou un journal'."</p>
      <div className="code-inputs">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
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
    if (choice === 'B') {
      onComplete();
    } else {
      setShakeId(choice);
      onError();
      setTimeout(() => setShakeId(null), 500);
    }
  };

  return (
    <div>
      <p className="clue-text">"Un bon journaliste écrit la vérité. Comment appelle-t-on les fausses informations créées pour tromper le public ?"</p>
      <div className="mcq-options">
        <button 
          className={`mcq-btn ${shakeId === 'A' ? 'error' : ''}`} 
          onClick={() => handleChoice('A')}
        >A) Un article neutre</button>
        <button 
          className={`mcq-btn ${shakeId === 'B' ? 'error' : ''}`} 
          onClick={() => handleChoice('B')}
        >B) La désinformation</button>
        <button 
          className={`mcq-btn ${shakeId === 'C' ? 'error' : ''}`} 
          onClick={() => handleChoice('C')}
        >C) Une bonne source</button>
      </div>
    </div>
  );
}

const TERMS = [
  { id: 1, text: "Liberté de la presse" },
  { id: 2, text: "Impartial" },
  { id: 3, text: "L'opinion publique" }
];

const DEFS = [
  { id: 2, text: "Être neutre et ne pas prendre de côté." },
  { id: 3, text: "Ce que pense la majorité des gens de la population." },
  { id: 1, text: "Le droit d'écrire et de dire la vérité dans les médias." }
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
      <p className="clue-text">"Associe chaque mot important à sa définition pour ouvrir les ordinateurs."</p>
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
    if (input.length < 6) {
      const newVal = input + num;
      setInput(newVal);
      if (newVal.length === 6) {
        if (newVal === '116685') {
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
      <p className="clue-text">"Compte le nombre de lettres de ces 5 mots pour trouver le code :<br/><br/>[journaliste] - [source] - [médias] - [diffuser] - [titre]"</p>
      <div className="keypad-container">
        <div className="keypad-display">{input.padEnd(6, '-')}</div>
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
    if (input.toUpperCase().trim() === 'PROPAGANDE') {
      onComplete();
    } else {
      onError();
      setInput('');
    }
  };

  return (
    <div>
      <p className="clue-text">"Le hacker a mélangé le mot de passe du serveur principal ! Remets les lettres en ordre :"</p>
      <div className="anagram-box">
        <h2>N P R P O E G A A D</h2>
      </div>
      <form onSubmit={handleSubmit} className="anagram-form">
        <input 
          type="text" 
          className="anagram-input"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Mot de passe..."
          autoFocus
        />
        <button type="submit" className="mcq-btn">Déverrouiller</button>
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
    if (answers.q1 === false && answers.q2 === true && answers.q3 === false) {
      onComplete();
    } else {
      onError();
      setAnswers({ q1: null, q2: null, q3: null });
    }
  };

  const isAllAnswered = answers.q1 !== null && answers.q2 !== null && answers.q3 !== null;

  return (
    <div>
      <p className="clue-text">"Pour rétablir le courant de la presse, place les interrupteurs sur la bonne position selon les règles du journalisme."</p>
      
      <div className="tf-container">
        <div className="tf-row">
          <span>1. La censure protège la liberté de la presse.</span>
          <div className="tf-buttons">
            <button className={`tf-btn ${answers.q1 === true ? 'active-vrai' : ''}`} onClick={() => setAnswer('q1', true)}>Vrai</button>
            <button className={`tf-btn ${answers.q1 === false ? 'active-faux' : ''}`} onClick={() => setAnswer('q1', false)}>Faux</button>
          </div>
        </div>
        
        <div className="tf-row">
          <span>2. Un journaliste doit vérifier ses sources.</span>
          <div className="tf-buttons">
            <button className={`tf-btn ${answers.q2 === true ? 'active-vrai' : ''}`} onClick={() => setAnswer('q2', true)}>Vrai</button>
            <button className={`tf-btn ${answers.q2 === false ? 'active-faux' : ''}`} onClick={() => setAnswer('q2', false)}>Faux</button>
          </div>
        </div>
        
        <div className="tf-row">
          <span>3. La désinformation est utile pour le public.</span>
          <div className="tf-buttons">
            <button className={`tf-btn ${answers.q3 === true ? 'active-vrai' : ''}`} onClick={() => setAnswer('q3', true)}>Vrai</button>
            <button className={`tf-btn ${answers.q3 === false ? 'active-faux' : ''}`} onClick={() => setAnswer('q3', false)}>Faux</button>
          </div>
        </div>
      </div>

      <button className="mcq-btn mt-4" style={{width: '100%'}} disabled={!isAllAnswered} onClick={handleValidate}>
        Valider le Panneau
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
      // Correct: Rouge, Bleu, Vert, Noir
      if (newSeq[0] === 'red' && newSeq[1] === 'blue' && newSeq[2] === 'green' && newSeq[3] === 'black') {
        setTimeout(onComplete, 500);
      } else {
        onError();
        setTimeout(() => setSequence([]), 500);
      }
    }
  };

  return (
    <div>
      <p className="clue-text">"La <strong>Société Civile (Rouge)</strong> écoute l'<strong>Opinion Publique (Bleu)</strong> pour exiger de la <strong>Transparence (Vert)</strong> face à la <strong>Répression (Noir)</strong>."</p>
      
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
