import React, { useState, useRef, useEffect } from 'react';
import './EscapeGame.css';

export default function Unit3EscapeGame() {
  const [stage, setStage] = useState(1);
  const [errorShake, setErrorShake] = useState(false);

  const triggerError = () => {
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  };

  const nextStage = () => setStage((prev) => prev + 1);

  return (
    <div className="escape-game-container">
      <h3 className="game-title">Mission : Podcast "Monde Connecté"</h3>
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
            <p className="win-text">Votre podcast sur la technologie, la cybersécurité et la déconnexion numérique est publié avec succès. Vous avez informé des milliers de jeunes !</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StageOne({ onComplete, onError }) {
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
      <h4 className="stage-heading text-accent">1. Le Thème du Podcast</h4>
      <p className="clue-text">"Avant d'enregistrer, retrouvez le thème principal de notre émission en remettant ces lettres dans l'ordre :"</p>
      <div className="anagram-box">
        <h2>C H G E L E O O T N I</h2>
      </div>
      <form onSubmit={handleSubmit} className="anagram-form">
        <input 
          type="text" 
          className="anagram-input"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Le thème..."
          autoFocus
        />
        <button type="submit" className="mcq-btn">Valider</button>
      </form>
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
      <h4 className="stage-heading text-accent">2. La Bulle de Filtre</h4>
      <p className="clue-text">"Dans votre premier épisode, vous parlez de la 'Bulle de filtre'. Quelle est la bonne définition ?"</p>
      <div className="mcq-options">
        <button 
          className={`mcq-btn ${shakeId === 'A' ? 'error' : ''}`} 
          onClick={() => handleChoice('A')}
        >A) Une protection pour l'écran du téléphone</button>
        <button 
          className={`mcq-btn ${shakeId === 'B' ? 'error' : ''}`} 
          onClick={() => handleChoice('B')}
        >B) Un outil pour purifier l'air à la maison</button>
        <button 
          className={`mcq-btn ${shakeId === 'C' ? 'error' : ''}`} 
          onClick={() => handleChoice('C')}
        >C) Un isolement où l'on ne voit que des idées confirmant ses croyances</button>
      </div>
    </div>
  );
}

const TERMS = [
  { id: 1, text: "E-réputation" },
  { id: 2, text: "Désinformation" },
  { id: 3, text: "Hygiène numérique" }
];

const DEFS = [
  { id: 2, text: "Propagation intentionnelle de fausses nouvelles." },
  { id: 3, text: "Bonnes pratiques pour la santé physique et mentale en ligne." },
  { id: 1, text: "Image qu'une personne projette sur Internet." }
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
      <h4 className="stage-heading text-accent">3. Le Script</h4>
      <p className="clue-text">"Préparez le script ! Associez chaque concept technologique à sa définition."</p>
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
    if (input.length < 3) {
      const newVal = input + num;
      setInput(newVal);
      if (newVal.length === 3) {
        if (newVal === '117') {
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
      <h4 className="stage-heading text-accent">4. L'Enregistrement</h4>
      <p className="clue-text">"Pour démarrer les micros du studio, entrez le code secret. Indice : comptez le nombre total de lettres dans les mots [DÉCONNEXION] puis [PODCAST]."</p>
      <div className="keypad-container">
        <div className="keypad-display">{input.padEnd(3, '-')}</div>
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
      <h4 className="stage-heading text-accent">5. Hameçonnage (Phishing)</h4>
      <p className="clue-text">"Dans votre podcast, vous donnez des conseils sur la cybersécurité. Vrai ou Faux ?"</p>
      
      <div className="tf-container">
        <div className="tf-row">
          <span>1. Il est sûr de cliquer sur les liens dans les e-mails d'expéditeurs inconnus.</span>
          <div className="tf-buttons">
            <button className={`tf-btn ${answers.q1 === true ? 'active-vrai' : ''}`} onClick={() => setAnswer('q1', true)}>Vrai</button>
            <button className={`tf-btn ${answers.q1 === false ? 'active-faux' : ''}`} onClick={() => setAnswer('q1', false)}>Faux</button>
          </div>
        </div>
        
        <div className="tf-row">
          <span>2. Le hameçonnage vise à voler des informations personnelles comme les mots de passe.</span>
          <div className="tf-buttons">
            <button className={`tf-btn ${answers.q2 === true ? 'active-vrai' : ''}`} onClick={() => setAnswer('q2', true)}>Vrai</button>
            <button className={`tf-btn ${answers.q2 === false ? 'active-faux' : ''}`} onClick={() => setAnswer('q2', false)}>Faux</button>
          </div>
        </div>
        
        <div className="tf-row">
          <span>3. Vérifier l'adresse de l'expéditeur aide à repérer une arnaque.</span>
          <div className="tf-buttons">
            <button className={`tf-btn ${answers.q3 === true ? 'active-vrai' : ''}`} onClick={() => setAnswer('q3', true)}>Vrai</button>
            <button className={`tf-btn ${answers.q3 === false ? 'active-faux' : ''}`} onClick={() => setAnswer('q3', false)}>Faux</button>
          </div>
        </div>
      </div>

      <button className="mcq-btn mt-4" style={{width: '100%'}} disabled={!isAllAnswered} onClick={handleValidate}>
        Vérifier les faits
      </button>
    </div>
  );
}

function StageSix({ onComplete, onError }) {
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
      <h4 className="stage-heading text-accent">6. Sécurité des Données</h4>
      <p className="clue-text">"Protégez votre compte podcast ! Lequel de ces mots de passe est le plus sécurisé ?"</p>
      <div className="mcq-options">
        <button 
          className={`mcq-btn ${shakeId === 'A' ? 'error' : ''}`} 
          onClick={() => handleChoice('A')}
        >A) 123456</button>
        <button 
          className={`mcq-btn ${shakeId === 'B' ? 'error' : ''}`} 
          onClick={() => handleChoice('B')}
        >B) podcast2024</button>
        <button 
          className={`mcq-btn ${shakeId === 'C' ? 'error' : ''}`} 
          onClick={() => handleChoice('C')}
        >C) T3ch!N0l0g!e$</button>
      </div>
    </div>
  );
}

function StageSeven({ onComplete, onError }) {
  const [sequence, setSequence] = useState([]);
  
  const handleColor = (color) => {
    const newSeq = [...sequence, color];
    setSequence(newSeq);
    
    if (newSeq.length === 4) {
      // Correct: Bleu, Vert, Rouge, Noir
      if (newSeq[0] === 'blue' && newSeq[1] === 'green' && newSeq[2] === 'red' && newSeq[3] === 'black') {
        setTimeout(onComplete, 500);
      } else {
        onError();
        setTimeout(() => setSequence([]), 500);
      }
    }
  };

  return (
    <div>
      <h4 className="stage-heading text-accent">7. Publication du Podcast</h4>
      <p className="clue-text">"Pour mettre l'épisode en ligne, activez les serveurs dans cet ordre : <br/><strong>Le Cloud (Bleu)</strong>, <strong>La Sécurité (Vert)</strong>, <strong>En Direct (Rouge)</strong>, <strong>L'Archive (Noir)</strong>."</p>
      
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
