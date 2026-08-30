import React, { useState, useEffect } from 'react';
import { Play, Square, Volume2 } from 'lucide-react';
import { speakFrench, stopSpeech } from '../utils/speechUtils';
import './AvatarWelcome.css';

export default function AvatarWelcome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

  const dialogue = [
    { speaker: 'jasmine', name: 'Jasmine', text: "Salut ! Bienvenue sur Français immersion neuf !" },
    { speaker: 'kader', name: 'Kader', text: "C'est notre plateforme d'apprentissage interactif. Tu vas voir, c'est vraiment génial !" },
    { speaker: 'jasmine', name: 'Jasmine', text: "Absolument ! Clique sur une unité dans le menu de gauche pour démarrer." },
    { speaker: 'kader', name: 'Kader', text: "Au programme : les héros, la santé mentale, l'identité et l'environnement !" },
    { speaker: 'jasmine', name: 'Jasmine', text: "Il y a de la grammaire, du vocabulaire, des exercices et des jeux 3D..." },
    { speaker: 'kader', name: 'Kader', text: "Bref, lance-toi vite dans une unité et amuse-toi bien en français !" }
  ];

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const playWelcomeConversation = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      setCurrentSpeaker(null);
      return;
    }

    setIsPlaying(true);
    setCurrentSpeaker('jasmine');
    setCurrentDialogueIndex(0);

    // Play clean 44.1kHz standard welcome audio track
    // (Jasmine: Option 6 [+15% pitch], Kader: Option 8 [+21% pitch])
    speakFrench('', { audioUrl: '/audio/welcome/final_welcome_conversation.wav' });

    // Precise millisecond delays matching exact sentence audio lengths at 44.1kHz
    setTimeout(() => { setCurrentSpeaker('kader'); setCurrentDialogueIndex(1); }, 2800);   // Kader Line 1 starts at 2.80s
    setTimeout(() => { setCurrentSpeaker('jasmine'); setCurrentDialogueIndex(2); }, 7630); // Jasmine Line 2 starts at 7.63s
    setTimeout(() => { setCurrentSpeaker('kader'); setCurrentDialogueIndex(3); }, 10570);  // Kader Line 2 starts at 10.57s
    setTimeout(() => { setCurrentSpeaker('jasmine'); setCurrentDialogueIndex(4); }, 15580); // Jasmine Line 3 starts at 15.58s
    setTimeout(() => { setCurrentSpeaker('kader'); setCurrentDialogueIndex(5); }, 19530);   // Kader Line 3 starts at 19.53s

    setTimeout(() => {
      setIsPlaying(false);
      setCurrentSpeaker(null);
    }, 22600);
  };

  const activeLine = dialogue[currentDialogueIndex] || dialogue[0];

  return (
    <div className="avatar-welcome-card">
      <div className="avatar-welcome-title">
        <h3>Vos Guides d'Immersion</h3>
        <p>Rencontrez Jasmine & Kader (14 ans)</p>
      </div>

      {/* Avatars Display */}
      <div className="avatar-container">
        
        {/* Jasmine (14-year-old Black French immersion high school girl) */}
        <div className={`avatar-card ${currentSpeaker === 'jasmine' ? 'speaking' : ''}`}>
          <div className="avatar-img-wrapper">
            <img src="/avatars/jasmine.jpg" alt="Jasmine" className="avatar-img" />
          </div>
          <div className="avatar-badge jasmine-badge">
            <span>Jasmine</span>
            {currentSpeaker === 'jasmine' && <Volume2 className="speak-icon" size={14} />}
          </div>
        </div>

        {/* Kader (14-year-old Moroccan French immersion high school boy) */}
        <div className={`avatar-card ${currentSpeaker === 'kader' ? 'speaking' : ''}`}>
          <div className="avatar-img-wrapper">
            <img src="/avatars/kader.jpg" alt="Kader" className="avatar-img" />
          </div>
          <div className="avatar-badge kader-badge">
            <span>Kader</span>
            {currentSpeaker === 'kader' && <Volume2 className="speak-icon" size={14} />}
          </div>
        </div>

      </div>

      {/* Dialogue Subtitle Speech Bubble */}
      {isPlaying && activeLine && (
        <div className="dialogue-box fade-in">
          <div className="dialogue-speaker">
            {activeLine.name} parle :
          </div>
          <p className="dialogue-text">
            « {activeLine.text} »
          </p>
        </div>
      )}

      {/* Play Conversation Button */}
      <button 
        className={`avatar-play-btn ${isPlaying ? 'playing' : ''}`} 
        onClick={playWelcomeConversation}
      >
        {isPlaying ? (
          <>
            <Square size={18} /> Arrêter la présentation
          </>
        ) : (
          <>
            <Play size={18} /> Écouter le message de Jasmine & Kader
          </>
        )}
      </button>
    </div>
  );
}
