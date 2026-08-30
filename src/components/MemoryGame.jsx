import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

const CARDS_DATA = [
  { id: 1, text: 'Bonjour', matchId: 1, isFrench: true },
  { id: 2, text: 'Hello', matchId: 1, isFrench: false },
  { id: 3, text: 'Merci', matchId: 2, isFrench: true },
  { id: 4, text: 'Thank you', matchId: 2, isFrench: false },
  { id: 5, text: 'Au revoir', matchId: 3, isFrench: true },
  { id: 6, text: 'Goodbye', matchId: 3, isFrench: false },
  { id: 7, text: 'S\'il vous plaît', matchId: 4, isFrench: true },
  { id: 8, text: 'Please', matchId: 4, isFrench: false },
];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // Shuffle cards
    const shuffled = [...CARDS_DATA].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || solved.includes(cards[index].matchId)) {
      return;
    }
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setDisabled(true);
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].matchId === cards[secondIndex].matchId) {
        setSolved([...solved, cards[firstIndex].matchId]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const isGameOver = solved.length === CARDS_DATA.length / 2;

  return (
    <div className="memory-game-container">
      <div className="game-header">
        <h4>Jeu de Mémoire</h4>
        <p>Associez les mots français à leur traduction en anglais.</p>
        <div className="score-board">
          Paires trouvées: {solved.length} / {CARDS_DATA.length / 2}
        </div>
      </div>
      
      {isGameOver ? (
        <div className="victory-screen glass-panel animate-in">
          <h2>Félicitations! 🎉</h2>
          <p>Vous avez trouvé toutes les paires!</p>
          <button className="primary-btn mt-2" onClick={() => window.location.reload()}>Rejouer</button>
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || solved.includes(card.matchId);
            return (
              <div 
                key={card.id} 
                className={`memory-card ${isFlipped ? 'flipped' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="memory-card-inner">
                  <div className="memory-card-front glass-panel flex-center">
                    ?
                  </div>
                  <div className={`memory-card-back flex-center ${card.isFrench ? 'french-card' : 'english-card'}`}>
                    {card.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
