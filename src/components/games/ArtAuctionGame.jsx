import React, { useState } from 'react';
import { DollarSign, Landmark, Award, ArrowRight, RotateCcw, CheckCircle, Sparkles, Image, ShieldCheck } from 'lucide-react';
import './Games.css';

const ARTWORKS = [
  {
    id: 1,
    title: "Le Chef-d'Œuvre du Musée",
    type: "Peinture célèbe",
    origin: "Musée d'Orsay, Paris",
    clueQuestion: "Quelle définition explique le mieux le mot 'Chef-d'œuvre' ?",
    options: [
      "Une œuvre exceptionnelle réalisée par un grand artiste.",
      "Un petit dessin rapide au crayon.",
      "Une copie produite en plusieurs exemplaires."
    ],
    correctIdx: 0,
    value: 500
  },
  {
    id: 2,
    title: "La Fresque Murale de la Ville",
    type: "Street Art Urbain",
    origin: "Montréal, Canada",
    clueQuestion: "Quelle phrase utilise correctement le mot 'Fresque murale' au passé ?",
    options: [
      "L'artiste peignait la fresque murale pendant que les gens l'observaient.",
      "La fresque murale a été détruit par la pluie.",
      "La fresque murale est un petit dessin sur du papier."
    ],
    correctIdx: 0,
    value: 600
  },
  {
    id: 3,
    title: "Le Bâtiment Historique",
    type: "Architecture",
    origin: "Bruxelles, Belgique",
    clueQuestion: "Que signifie le mot 'Façade' d'un bâtiment ?",
    options: [
      "La face extérieure principale d'un bâtiment.",
      "Le toit à l'intérieur d'une maison.",
      "La musique d'un film ou d'un spectacle."
    ],
    correctIdx: 0,
    value: 700
  },
  {
    id: 4,
    title: "Le Concert de Slam & Musique",
    type: "Poésie orale",
    origin: "Dakar, Sénégal",
    clueQuestion: "Quelle phrase utilise correctement le mot 'Slam' ?",
    options: [
      "Le poète a déclamé son slam sur scène devant un grand public.",
      "Le slam est un style de peinture à l'huile.",
      "Le slam est un monument historique ancien."
    ],
    correctIdx: 0,
    value: 800
  }
];

export default function ArtAuctionGame({ onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [gallery, setGallery] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const item = ARTWORKS[currentIdx];

  const handleBid = (optIdx) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);
    if (optIdx === item.correctIdx) {
      setBudget(budget + item.value);
      setGallery([...gallery, item]);
    }
  };

  const handleNext = () => {
    if (currentIdx < ARTWORKS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setBudget(1000);
    setGallery([]);
    setIsCompleted(false);
  };

  return (
    <div className="game-container glass-panel p-6" style={{ maxWidth: '850px', margin: '0 auto', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', color: '#f8fafc' }}>
      <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', tracking: '2px', color: '#10b981', fontWeight: 'bold' }}>Mécénat & Enchères — Unité 4</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0.2rem 0', background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🏛️ L'Enchère des Arts & Galerie Virtuelle
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Valeur de la Galerie</span>
          <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>{budget} €</p>
        </div>
      </div>

      {!isCompleted ? (
        <div>
          {/* Artwork Card */}
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1.5rem', borderRadius: '15px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '1.2rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981' }}>
              <Landmark size={36} color="#10b981" />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 'bold' }}>Lot #{currentIdx + 1} • {item.type}</span>
              <h3 style={{ margin: '0.2rem 0', fontSize: '1.2rem', color: '#f8fafc' }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8' }}>Origine : {item.origin} | Valeur estimée : +{item.value} €</p>
            </div>
          </div>

          {/* Bidding Question */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', marginBottom: '1rem' }}>💬 {item.clueQuestion}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {item.options.map((opt, idx) => {
                let btnBg = 'rgba(30, 41, 59, 0.6)';
                let btnBorder = 'rgba(255,255,255,0.1)';
                if (isAnswered) {
                  if (idx === item.correctIdx) {
                    btnBg = 'rgba(16, 185, 129, 0.25)';
                    btnBorder = '#10b981';
                  } else if (idx === selectedOpt) {
                    btnBg = 'rgba(239, 68, 68, 0.25)';
                    btnBorder = '#ef4444';
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleBid(idx)}
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === item.correctIdx && <CheckCircle size={20} color="#10b981" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Gallery Acquisition */}
          {isAnswered && (
            <div style={{ background: selectedOpt === item.correctIdx ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem', border: `1px solid ${selectedOpt === item.correctIdx ? '#10b981' : '#ef4444'}` }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: selectedOpt === item.correctIdx ? '#34d399' : '#f87171', marginBottom: '0.3rem' }}>
                {selectedOpt === item.correctIdx ? "🏛️ Enchère Remportée ! L'œuvre rejoint votre galerie virtuelle (+ " + item.value + " €)" : "❌ Enchère Perdue ! Réponse incorrecte."}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {onBack && (
              <button onClick={onBack} style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer' }}>
                Retour au Menu
              </button>
            )}
            {isAnswered && (
              <button
                onClick={handleNext}
                style={{
                  padding: '0.8rem 1.8rem',
                  background: 'linear-gradient(135deg, #10b981, #3b82f6)',
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
                <span>{currentIdx < ARTWORKS.length - 1 ? "Lot Suivant" : "Inaugurer la Galerie Virtuelle"}</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Victory Modal */
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', marginBottom: '1.5rem' }}>
            <Award size={64} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '0.5rem' }}>
            Vernissage de la Galerie Virtuelle ! 🏛️✨
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
            Félicitations Conservateur ! Vous avez bâti une digne collection d'art francophone regroupant {gallery.length} chefs-d'œuvre majeurs !
          </p>

          <div style={{ background: 'rgba(30, 41, 59, 0.9)', padding: '1.2rem', borderRadius: '15px', maxWidth: '450px', margin: '0 auto 2rem auto', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Valeur Totale du Patrimoine</p>
            <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#10b981', margin: '0.2rem 0' }}>{budget} €</p>
            <p style={{ margin: 0, color: '#34d399', fontSize: '0.85rem', fontWeight: 'bold' }}>Titre : Grand Mécène de la Francophonie 🏛️</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={handleRestart}
              style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={18} />
              <span>Recommencer les Enchères</span>
            </button>
            {onBack && (
              <button 
                onClick={onBack}
                style={{ padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
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
