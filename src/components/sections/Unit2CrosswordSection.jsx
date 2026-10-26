import React, { useState } from 'react';
import HeroCrossword from '../games/HeroCrossword';
import { UNIT2_CROSSWORDS } from '../../data/unit2CrosswordsData';
import './HeroCrosswordSection.css';

export default function Unit2CrosswordSection() {
  const [activeGameId, setActiveGameId] = useState(null);

  if (activeGameId) {
    const selected = UNIT2_CROSSWORDS.find((p) => p.id === activeGameId);
    if (selected) {
      return (
        <HeroCrossword
          {...selected.puzzle}
          activePuzzleId={activeGameId}
          onSelectPuzzle={(id) => setActiveGameId(id)}
          allPuzzles={UNIT2_CROSSWORDS}
          onBack={() => setActiveGameId(null)}
        />
      );
    }
  }

  return (
    <div className="hero-hub">
      <div className="hero-hub-header">
        <h2>
          <span>🧩</span> Mots Croisés : L'impératif et le subjonctif ({UNIT2_CROSSWORDS.length} grilles)
        </h2>
        <p>
          Révise les verbes du Dossier 2 : <strong>gérer, s'exprimer, prendre, se confier, faire, dormir, comprendre, demander</strong>.
          Deux grilles sur l'impératif, deux grilles sur le subjonctif présent.
        </p>
        <div className="hero-hub-badge-pill">
          <span>⚡</span> Règle spéciale : écris tout sans espace ni trait d'union (ex : <code>EXPRIMETOI</code>, <code>NEFAISPAS</code>). Utilise la barre d'accents !
        </div>
      </div>

      <div className="hero-cards-grid">
        {UNIT2_CROSSWORDS.map((item, idx) => (
          <div key={item.id} className="hero-comic-card" onClick={() => setActiveGameId(item.id)}>
            <div className="hero-card-top-stripe" style={{ background: item.color }} />
            <div className="hero-card-body">
              <div className="hero-card-badge-icon" style={{ background: item.bg, color: item.color }}>
                <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{item.emoji}</span>
              </div>
              <div className="hero-card-content">
                <span className="hero-card-tag" style={{ background: item.bg, color: item.color }}>
                  {item.badge}
                </span>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
            <div className="hero-card-footer">
              <span className="hero-card-words-count">
                {item.puzzle.puzzleData.length} mots • Grille {idx + 1}/{UNIT2_CROSSWORDS.length}
              </span>
              <button
                className="hero-card-play-btn"
                style={{ background: item.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveGameId(item.id);
                }}
              >
                Relever le défi →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
