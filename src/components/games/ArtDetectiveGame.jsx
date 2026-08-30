import React, { useState } from 'react';
import { Search, MapPin, ShieldAlert, Award, ArrowRight, RotateCcw, CheckCircle, Lock, BookOpen } from 'lucide-react';
import './Games.css';

const LOCATIONS = [
  {
    id: 'paris',
    city: "Paris, France",
    landmark: "Musée du Louvre",
    clueTitle: "Indice #1 : Le Vol au Louvre",
    story: "Un tableau très célèbre a disparu du musée du Louvre ! Sur la vitre de protection, le voleur a laissé une petite note au passé...",
    question: "Quelle phrase à l'imparfait décrit bien le décor au moment du vol ?",
    options: [
      "Il faisait nuit et les gardiens dormaient quand le voleur est entré.",
      "Il a fait nuit et les gardiens ont dormi quand le voleur est entré.",
      "Il fait nuit et les gardiens dorment quand le voleur est entré."
    ],
    correctIdx: 0,
    explanation: "L'imparfait ('faisait', 'dormaient') décrit la situation de fond, et le passé composé ('est entré') raconte l'action soudaine.",
    suspectClue: "Indice : Le suspect s'est enfui vers Montréal !"
  },
  {
    id: 'montreal',
    city: "Montréal, Canada",
    landmark: "Street Art à Montréal",
    clueTitle: "Indice #2 : La Fresque à Montréal",
    story: "À Montréal, un témoin a vu le suspect devant une grande fresque murale. L'inspecteur vous montre son rapport...",
    question: "Quelle phrase utilise correctement le Passé Composé du verbe peindre ?",
    options: [
      "L'artiste a peindu la grande fresque murale.",
      "L'artiste a peint la grande fresque murale en trois jours.",
      "L'artiste est peigné la grande fresque murale."
    ],
    correctIdx: 1,
    explanation: "Le participe passé de 'peindre' avec l'auxiliaire AVOIR est 'peint' (a peint).",
    suspectClue: "Indice : Le voleur prend l'avion pour Dakar avec une note sur l'art !"
  },
  {
    id: 'dakar',
    city: "Dakar, Sénégal",
    landmark: "Musée des Civilisations Noires",
    clueTitle: "Indice #3 : La Sculpture à Dakar",
    story: "Au musée de Dakar, le gardien a aperçu deux personnes suspectes devant une magnifique sculpture. Il explique la scène...",
    question: "Quelle phrase respecte bien l'accord du participe passé avec ÊTRE au féminin pluriel ?",
    options: [
      "Les deux suspectes sont venus au musée à 14h.",
      "Les deux suspectes sont venues au musée et sont parti vite.",
      "Les deux suspectes sont venues au musée et sont parties très vite."
    ],
    correctIdx: 2,
    explanation: "Avec l'auxiliaire ÊTRE, on ajoute -es au participe passé pour le féminin pluriel (venues, parties).",
    suspectClue: "Indice : Le voleur se cache dans un théâtre à Bruxelles !"
  },
  {
    id: 'bruxelles',
    city: "Bruxelles, Belgique",
    landmark: "Grand-Place de Bruxelles",
    clueTitle: "Indice #4 : La Fin de l'Enquête à Bruxelles",
    story: "Vous retrouvez le voleur dans un théâtre à Bruxelles ! Il essaie de s'expliquer devant vous...",
    question: "Quelle phrase est la plus claire et logique pour conclure l'enquête ?",
    options: [
      "D'abord, vous avez pris le tableau. En conclusion, vous avez fait une grosse erreur !",
      "Cependant, la peinture est belle, par contre j'aime l'art.",
      "Par conséquent, il dormait quand le tableau a disparu."
    ],
    correctIdx: 0,
    explanation: "'D'abord' commence l'explication et 'En conclusion' termine la phrase de manière logique.",
    suspectClue: "CHEF-D'ŒUVRE RETROUVÉ ! Vous avez arrêté le voleur et rapporté le tableau au Louvre !"
  }
];

export default function ArtDetectiveGame({ onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [unlockedClues, setUnlockedClues] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const loc = LOCATIONS[currentStep];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (idx === loc.correctIdx) {
      setScore(score + 100);
      setUnlockedClues([...unlockedClues, loc.suspectClue]);
    }
  };

  const handleNext = () => {
    if (currentStep < LOCATIONS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setUnlockedClues([]);
    setIsCompleted(false);
  };

  return (
    <div className="game-container glass-panel p-6" style={{ maxWidth: '850px', margin: '0 auto', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', color: '#f8fafc' }}>
      <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', tracking: '2px', color: '#60a5fa', fontWeight: 'bold' }}>Jeu d'Enquête — Unité 4</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0.2rem 0', background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🕵️‍♂️ Le Détective d'Art : Le Vol du Chef-d'Œuvre
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Score Détective</span>
          <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{score} pts</p>
        </div>
      </div>

      {!isCompleted ? (
        <div>
          {/* Progress Bar & Map Indicator */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {LOCATIONS.map((l, idx) => (
              <div 
                key={l.id} 
                style={{ 
                  flex: 1, 
                  padding: '0.6rem 0.8rem', 
                  borderRadius: '10px', 
                  background: idx === currentStep ? 'rgba(96, 165, 250, 0.2)' : idx < currentStep ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)', 
                  border: idx === currentStep ? '1px solid #60a5fa' : idx < currentStep ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem'
                }}
              >
                <MapPin size={16} color={idx === currentStep ? '#60a5fa' : idx < currentStep ? '#22c55e' : '#64748b'} />
                <span style={{ color: idx === currentStep ? '#60a5fa' : idx < currentStep ? '#4ade80' : '#64748b', fontWeight: idx === currentStep ? 'bold' : 'normal' }}>
                  {l.city}
                </span>
              </div>
            ))}
          </div>

          {/* Location Details Card */}
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1.5rem', borderRadius: '15px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fbbf24', marginBottom: '0.5rem' }}>
              <Search size={20} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{loc.clueTitle} ({loc.landmark})</h3>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>{loc.story}</p>
          </div>

          {/* Question & Options */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', marginBottom: '1rem' }}>{loc.question}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loc.options.map((opt, idx) => {
                let btnBg = 'rgba(30, 41, 59, 0.6)';
                let btnBorder = 'rgba(255,255,255,0.1)';
                if (isAnswered) {
                  if (idx === loc.correctIdx) {
                    btnBg = 'rgba(34, 197, 94, 0.25)';
                    btnBorder = '#22c55e';
                  } else if (idx === selectedOpt) {
                    btnBg = 'rgba(239, 68, 68, 0.25)';
                    btnBorder = '#ef4444';
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    style={{
                      padding: '1rem 1.2rem',
                      textAlign: 'left',
                      borderRadius: '12px',
                      background: btnBg,
                      border: `1px solid ${btnBorder}`,
                      color: '#f8fafc',
                      fontSize: '0.95rem',
                      cursor: isAnswered ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === loc.correctIdx && <CheckCircle size={20} color="#22c55e" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation & Suspect Clue Output */}
          {isAnswered && (
            <div style={{ background: selectedOpt === loc.correctIdx ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem', border: `1px solid ${selectedOpt === loc.correctIdx ? '#22c55e' : '#ef4444'}` }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: selectedOpt === loc.correctIdx ? '#4ade80' : '#f87171', marginBottom: '0.4rem' }}>
                {selectedOpt === loc.correctIdx ? "🔍 Indice Décodé !" : "❌ Piste incorrecte !"}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>{loc.explanation}</p>
              {selectedOpt === loc.correctIdx && (
                <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px dashed rgba(255,255,255,0.2)', color: '#fbbf24', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {loc.suspectClue}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {onBack && (
              <button onClick={onBack} style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer' }}>
                Retour aux activités
              </button>
            )}
            {isAnswered && (
              <button 
                onClick={handleNext}
                style={{ 
                  padding: '0.8rem 1.8rem', 
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
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
                <span>{currentStep < LOCATIONS.length - 1 ? "Étape Suivante" : "Conclure l'Enquête"}</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Victory Modal */
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', border: '2px solid #f59e0b', marginBottom: '1.5rem' }}>
            <Award size={64} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '0.5rem' }}>
            Mission Réussie, Détective ! 🏆
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
            Grâce à votre excellente maîtrise du vocabulaire des arts et de la grammaire du passé (Imparfait vs Passé Composé), le chef-d'œuvre a été restitué au Musée du Louvre !
          </p>

          <div style={{ background: 'rgba(30, 41, 59, 0.9)', padding: '1.2rem', borderRadius: '15px', maxWidth: '450px', margin: '0 auto 2rem auto', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Score Final</p>
            <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0.2rem 0' }}>{score} / 400 pts</p>
            <p style={{ margin: 0, color: '#4ade80', fontSize: '0.85rem', fontWeight: 'bold' }}>Badge : Maître Détective de l'UNESCO Unité 4</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={handleRestart}
              style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={18} />
              <span>Rejouer L'Enquête</span>
            </button>
            {onBack && (
              <button 
                onClick={onBack}
                style={{ padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
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
