import React, { useEffect } from 'react';
import { UNIT_1_VOCAB, UNIT_2_VOCAB, UNIT_3_VOCAB, UNIT_4_VOCAB } from '../../data/vocabulary';
import { Volume2, BookOpen } from 'lucide-react';
import './PronunciationPractice.css';

export default function PronunciationPractice({ unitId, onBack }) {
  const vocabData = unitId === '4' ? UNIT_4_VOCAB : unitId === '3' ? UNIT_3_VOCAB : unitId === '2' ? UNIT_2_VOCAB : UNIT_1_VOCAB;

  useEffect(() => {
    // Trick to force browsers to load voices if they haven't already
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert("Désolé, votre navigateur ne supporte pas la synthèse vocale (Text-to-Speech).");
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85; // Slightly slower for better comprehension
      
      // IMPORTANT: Attach to window to prevent garbage collection in Safari
      window.currentUtterance = utterance;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        // Look for any French voice
        const frVoice = voices.find(v => v.lang.includes('fr'));
        if (frVoice) {
          utterance.voice = frVoice;
        }
      }
      
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        // Only alert if it's a real error, ignore 'interrupted' or 'canceled'
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
           alert("Une erreur de son s'est produite: " + e.error);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error(err);
      alert("Erreur système de son: " + err.message);
    }
  };

  return (
    <div className="pronunciation-practice">
      <button className="back-btn" onClick={onBack}>
        ← Retour au menu
      </button>

      <div className="pronunciation-header glass-panel">
        <h2 className="text-gradient">Atelier de Prononciation</h2>
        <p className="text-secondary">
          Cliquez sur l'icône de volume pour écouter la prononciation française correcte de chaque mot.
        </p>
      </div>

      <div className="vocab-grid">
        {vocabData.map(item => (
          <div key={item.id} className="vocab-card glass-panel">
            <div className="vocab-card-header">
              <h3>{item.word}</h3>
              <button 
                className="speak-btn"
                onClick={() => speak(item.word)}
                title="Écouter le mot"
              >
                <Volume2 size={24} />
              </button>
            </div>
            <div className="vocab-definition">
              <BookOpen size={16} className="def-icon" />
              <span>{item.definition}</span>
            </div>
            
            {/* Optional secondary button for definition reading */}
            <button 
              className="speak-def-btn" 
              onClick={() => speak(item.definition)}
            >
              <Volume2 size={12} style={{marginRight: '4px'}}/> Écouter la définition
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
