import React, { useState } from 'react';
import { Film, Clapperboard, Award, Sparkles, CheckCircle, ArrowRight, RotateCcw, Volume2, Video } from 'lucide-react';
import './Games.css';

const SCENES = [
  {
    id: 1,
    title: "Scène 1 : La Rencontre sous la Pluie",
    taskDesc: "Choisissez la bonne phrase au passé pour décrire la première scène de votre film :",
    options: [
      { text: "Il pleuvait sur Paris quand le héros a rencontré l'artiste.", score: 100, feedback: "Bravo ! Imparfait pour la météo (il pleuvait) + Passé composé pour la rencontre (a rencontré)." },
      { text: "Il a plu sur Paris quand le héros rencontrait l'artiste.", score: 40, feedback: "Attention ! La météo est un décor continu à l'imparfait." },
      { text: "Il pleut sur Paris quand le héros rencontre l'artiste.", score: 20, feedback: "Cette phrase est au présent, votre film se déroule au passé." }
    ],
    techChoice: {
      question: "Quel type de cadrage préférez-vous pour cette scène ?",
      choices: ["Gros plan (pour montrer le visage)", "Plan large (pour montrer la ville)", "Plan moyen (pour l'action)"]
    }
  },
  {
    id: 2,
    title: "Scène 2 : Le Mystère au Musée",
    taskDesc: "Choisissez la bonne phrase au passé pour la scène dans le musée :",
    options: [
      { text: "Pendant que la musique jouait, une personne s'est cachée derrière la statue.", score: 100, feedback: "Excellent ! 'jouait' à l'imparfait pour l'ambiance et 's'est cachée' au passé composé." },
      { text: "Pendant que la musique a joué, une personne se cachait derrière la statue.", score: 40, feedback: "La musique est le fond sonore (imparfait)." },
      { text: "La musique jouait et la personne est cacher.", score: 10, feedback: "Le participe passé doit être 'cachée'." }
    ],
    techChoice: {
      question: "Quelle bande originale choisissez-vous pour la musique du film ?",
      choices: ["Musique douce de piano", "Slam poétique et moderne", "Musique de suspense rythmée"]
    }
  },
  {
    id: 3,
    title: "Scène 3 : La Fin du Film au Musée",
    taskDesc: "Choisissez la meilleure phrase pour conclure le synopsis de votre film :",
    options: [
      { text: "En conclusion, le public a applaudi les artistes et le film a eu un grand succès.", score: 100, feedback: "Bravo ! Votre film se termine sur une excellente note." },
      { text: "En conclusion, le public applaudissait et le film finissait.", score: 50, feedback: "L'applaudissement final est une action terminée." },
      { text: "D'abord, le public a applaudi la créativité.", score: 30, feedback: "'D'abord' s'utilise au début du texte, pas à la fin." }
    ],
    techChoice: {
      question: "Comment voulez-vous terminer la mise en scène du film ?",
      choices: ["Ecran noir progressif (fondu)", "Caméra qui s'éloigne lentement", "Image fixe sur le sourire des artistes"]
    }
  }
];

export default function FilmDirectorGame({ onBack }) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [isSceneDone, setIsSceneDone] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isPalmeWon, setIsPalmeWon] = useState(false);

  const scene = SCENES[currentSceneIdx];

  const handleSelectOption = (idx) => {
    setSelectedOpt(idx);
  };

  const handleSelectTech = (idx) => {
    setSelectedTech(idx);
  };

  const handleConfirmScene = () => {
    if (selectedOpt === null || selectedTech === null) return;
    const gained = scene.options[selectedOpt].score;
    setTotalScore(totalScore + gained);
    setIsSceneDone(true);
  };

  const handleNextScene = () => {
    if (currentSceneIdx < SCENES.length - 1) {
      setCurrentSceneIdx(currentSceneIdx + 1);
      setSelectedOpt(null);
      setSelectedTech(null);
      setIsSceneDone(false);
    } else {
      setIsPalmeWon(true);
    }
  };

  const handleRestart = () => {
    setCurrentSceneIdx(0);
    setSelectedOpt(null);
    setSelectedTech(null);
    setIsSceneDone(false);
    setTotalScore(0);
    setIsPalmeWon(false);
  };

  return (
    <div className="game-container glass-panel p-6" style={{ maxWidth: '850px', margin: '0 auto', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', color: '#f8fafc' }}>
      <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', tracking: '2px', color: '#c084fc', fontWeight: 'bold' }}>Festival de Cannes — Unité 4</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0.2rem 0', background: 'linear-gradient(135deg, #c084fc, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🎬 Dans la Peau du Réalisateur
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Note du Jury</span>
          <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#c084fc', margin: 0 }}>{totalScore} / 300 pts</p>
        </div>
      </div>

      {!isPalmeWon ? (
        <div>
          {/* Scene Header */}
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1.2rem', borderRadius: '15px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Clapperboard size={28} color="#c084fc" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>{scene.title}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Scène {currentSceneIdx + 1} sur 3</p>
            </div>
          </div>

          {/* Grammar & Script Choice */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', marginBottom: '0.8rem' }}>{scene.taskDesc}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {scene.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSceneDone}
                  style={{
                    padding: '0.9rem 1.1rem',
                    textAlign: 'left',
                    borderRadius: '12px',
                    background: selectedOpt === idx ? 'rgba(192, 132, 252, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                    border: `1px solid ${selectedOpt === idx ? '#c084fc' : 'rgba(255,255,255,0.1)'}`,
                    color: '#f8fafc',
                    fontSize: '0.95rem',
                    cursor: isSceneDone ? 'default' : 'pointer'
                  }}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Choice (Cadrage / Sound) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', marginBottom: '0.8rem' }}>🎥 {scene.techChoice.question}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem' }}>
              {scene.techChoice.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectTech(idx)}
                  disabled={isSceneDone}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '12px',
                    background: selectedTech === idx ? 'rgba(244, 63, 94, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                    border: `1px solid ${selectedTech === idx ? '#f43f5e' : 'rgba(255,255,255,0.1)'}`,
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    fontWeight: selectedTech === idx ? 'bold' : 'normal',
                    cursor: isSceneDone ? 'default' : 'pointer'
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Section after Scene Confirmation */}
          {isSceneDone && (
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #22c55e' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#4ade80', marginBottom: '0.3rem' }}>
                🎬 Scène Tournée avec Succès ! (+{scene.options[selectedOpt].score} pts)
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>{scene.options[selectedOpt].feedback}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {onBack && (
              <button onClick={onBack} style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer' }}>
                Retour au Menu
              </button>
            )}
            {!isSceneDone ? (
              <button
                onClick={handleConfirmScene}
                disabled={selectedOpt === null || selectedTech === null}
                style={{
                  padding: '0.8rem 1.8rem',
                  background: selectedOpt !== null && selectedTech !== null ? 'linear-gradient(135deg, #c084fc, #f43f5e)' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: selectedOpt !== null && selectedTech !== null ? 'pointer' : 'not-allowed',
                  marginLeft: 'auto'
                }}
              >
                Tourner la Scène 🎬
              </button>
            ) : (
              <button
                onClick={handleNextScene}
                style={{
                  padding: '0.8rem 1.8rem',
                  background: 'linear-gradient(135deg, #c084fc, #f43f5e)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginLeft: 'auto'
                }}
              >
                <span>{currentSceneIdx < SCENES.length - 1 ? "Scène Suivante" : "Présenter au Jury de Cannes"}</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Victory Palme d'Or Modal */
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.2)', border: '2px solid #f43f5e', marginBottom: '1.5rem' }}>
            <Award size={64} color="#f43f5e" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '0.5rem' }}>
            Palme d'Or du Festival de Cannes ! 🏆
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
            Félicitations Réalisateur ! Votre film a ébloui le jury international par sa maîtrise narrative au passé, son cadrage et sa bande originale poétique !
          </p>

          <div style={{ background: 'rgba(30, 41, 59, 0.9)', padding: '1.2rem', borderRadius: '15px', maxWidth: '450px', margin: '0 auto 2rem auto', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Score Total du Film</p>
            <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#c084fc', margin: '0.2rem 0' }}>{totalScore} / 300 pts</p>
            <p style={{ margin: 0, color: '#f43f5e', fontSize: '0.85rem', fontWeight: 'bold' }}>Titre : Grand Réalisateur Francophone 🎬</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={handleRestart}
              style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={18} />
              <span>Tourner un Nouveau Film</span>
            </button>
            {onBack && (
              <button 
                onClick={onBack}
                style={{ padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #c084fc, #f43f5e)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Retour au Menu
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
