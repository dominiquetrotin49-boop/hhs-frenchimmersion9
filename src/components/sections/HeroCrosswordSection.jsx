import React, { useState } from 'react';
import { Shield, Sparkles, BookOpen } from 'lucide-react';
import HeroCrossword from '../games/HeroCrossword';
import { HERO_CROSSWORDS } from '../../data/heroCrosswordsData';
import './HeroCrosswordSection.css';

export default function HeroCrosswordSection() {
  const [activeGameId, setActiveGameId] = useState(null);

  if (activeGameId) {
    const selected = HERO_CROSSWORDS.find((p) => p.id === activeGameId);
    if (selected) {
      return (
        <HeroCrossword
          {...selected.puzzle}
          activePuzzleId={activeGameId}
          onSelectPuzzle={(id) => setActiveGameId(id)}
          allPuzzles={HERO_CROSSWORDS}
          onBack={() => setActiveGameId(null)}
        />
      );
    }
  }

  return (
    <div className="hero-hub">
      {/* ── Header ── */}
      <div className="hero-hub-header">
        <h2>
          <span>🛡️</span> Mots Croisés : L'Épreuve des Héros (5 Grilles)
        </h2>
        <p>
          Affrontez les énigmes de conjugaison d'Unité 1 : Imparfait et Passé Composé en contexte héroïque et anti-héroïque.
        </p>
        <div className="hero-hub-badge-pill">
          <span>⚡</span> Règle spéciale : Écrivez les verbes composés sans espace (ex : <code>ASAUVÉ</code>, <code>ESTNÉ</code>)
        </div>
      </div>

      {/* ── 5 Comic Strip Cards ── */}
      <div className="hero-cards-grid">
        {HERO_CROSSWORDS.map((item, idx) => (
          <div
            key={item.id}
            className="hero-comic-card"
            onClick={() => setActiveGameId(item.id)}
          >
            {/* Top color stripe */}
            <div
              className="hero-card-top-stripe"
              style={{ background: item.color }}
            />

            {/* Card Body */}
            <div className="hero-card-body">
              <div
                className="hero-card-badge-icon"
                style={{ background: item.bg, color: item.color }}
              >
                <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{item.emoji}</span>
              </div>

              <div className="hero-card-content">
                <span
                  className="hero-card-tag"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.badge}
                </span>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="hero-card-footer">
              <span className="hero-card-words-count">
                {item.puzzle.puzzleData.length} mots • Grille {idx + 1}/5
              </span>
              <button
                className="hero-card-play-btn"
                style={{ background: item.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveGameId(item.id);
                }}
              >
                Relever le Défi →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
