import React, { useState } from 'react';
import { Grid3X3 } from 'lucide-react';
import Crossword from '../games/Crossword';
import './CrosswordSection.css';


const ER_PUZZLE = {
  title: "Mots Croisés: Verbes en -ER",
  description: "Remplissez la grille avec les conjugaisons correctes au présent.",
  numRows: 21,
  numCols: 12,
  puzzleData: [
    { id: 1, word: "HABITEZ", r: 0, c: 9, dir: "down", clue: "Vous + Habiter" },
    { id: 2, word: "TRAVAILLENT", r: 4, c: 3, dir: "down", clue: "Ils + Travailler" },
    { id: 3, word: "REGARDE", r: 5, c: 3, dir: "across", clue: "Je + Regarder" },
    { id: 4, word: "AIME", r: 3, c: 8, dir: "across", clue: "Elle + Aimer" },
    { id: 5, word: "PARLONS", r: 8, c: 2, dir: "across", clue: "Nous + Parler" },
    { id: 6, word: "JOUE", r: 12, c: 0, dir: "across", clue: "Je + Jouer" },
    { id: 7, word: "ÉCOUTONS", r: 12, c: 5, dir: "down", clue: "Nous + Écouter" },
    { id: 8, word: "MANGES", r: 12, c: 9, dir: "down", clue: "Tu + Manger" },
    { id: 9, word: "TROUVENT", r: 14, c: 3, dir: "across", clue: "Ils + Trouver" },
    { id: 10, word: "ÉTUDIES", r: 16, c: 4, dir: "across", clue: "Tu + Étudier" }
  ]
};

const IR_PUZZLE = {
  title: "Mots Croisés: Verbes en -IR",
  description: "Remplissez la grille avec les conjugaisons correctes au présent.",
  numRows: 16,
  numCols: 17,
  puzzleData: [
    { id: 1, word: "GRANDISSENT", r: 5, c: 3, dir: "across", clue: "Ils + Grandir" },
    { id: 2, word: "REMPLISSENT", r: 5, c: 4, dir: "down", clue: "Ils + Remplir" },
    { id: 3, word: "MAIGRISSEZ", r: 3, c: 8, dir: "down", clue: "Vous + Maigrir" },
    { id: 4, word: "FINISSONS", r: 3, c: 6, dir: "down", clue: "Nous + Finir" },
    { id: 5, word: "CHOISIS", r: 1, c: 10, dir: "down", clue: "Tu + Choisir" },
    { id: 6, word: "RÉUSSIS", r: 11, c: 0, dir: "across", clue: "Je + Réussir" },
    { id: 7, word: "ROUGIT", r: 0, c: 13, dir: "down", clue: "Elle + Rougir" },
    { id: 8, word: "OBÉIS", r: 9, c: 1, dir: "down", clue: "Tu + Obéir" },
    { id: 9, word: "PUNIS", r: 2, c: 12, dir: "across", clue: "Tu + Punir" },
    { id: 10, word: "AGIT", r: 15, c: 1, dir: "across", clue: "Il + Agir" }
  ]
};

const RE_PUZZLE = {
  title: "Mots Croisés: Verbes en -RE",
  description: "Remplissez la grille avec les conjugaisons correctes au présent.",
  numRows: 16,
  numCols: 11,
  puzzleData: [
    { id: 1, word: "CONFONDENT", r: 9, c: 1, dir: "across", clue: "Ils + Confondre" },
    { id: 2, word: "RÉPONDENT", r: 6, c: 2, dir: "down", clue: "Ils + Répondre" },
    { id: 3, word: "DESCENDEZ", r: 4, c: 6, dir: "down", clue: "Vous + Descendre" },
    { id: 4, word: "DÉFENDONS", r: 7, c: 4, dir: "down", clue: "Nous + Défendre" },
    { id: 5, word: "VENDONS", r: 8, c: 8, dir: "down", clue: "Nous + Vendre" },
    { id: 6, word: "ATTENDS", r: 8, c: 10, dir: "down", clue: "Tu + Attendre" },
    { id: 7, word: "ENTENDS", r: 14, c: 0, dir: "across", clue: "Je + Entendre" },
    { id: 8, word: "RENDS", r: 4, c: 3, dir: "across", clue: "Je + Rendre" },
    { id: 9, word: "MORDS", r: 0, c: 7, dir: "down", clue: "Tu + Mordre" },
    { id: 10, word: "PERD", r: 6, c: 0, dir: "across", clue: "Elle + Perdre" }
  ]
};

const AUX_PUZZLE = {
  title: "Mots Croisés: Être & Avoir",
  description: "Remplissez la grille avec les conjugaisons correctes de Être et Avoir.",
  numRows: 8,
  numCols: 8,
  puzzleData: [
    { id: 1, word: "AS",     r: 0, c: 6, dir: "across", clue: "Tu + Avoir" },
    { id: 2, word: "SUIS",   r: 0, c: 7, dir: "down",   clue: "Je + Être" },
    { id: 3, word: "AVONS",  r: 1, c: 3, dir: "down",   clue: "Nous + Avoir" },
    { id: 4, word: "SOMMES", r: 3, c: 2, dir: "across", clue: "Nous + Être" },
    { id: 5, word: "ES",     r: 3, c: 6, dir: "down",   clue: "Tu + Être" },
    { id: 6, word: "ÊTES",   r: 5, c: 0, dir: "across", clue: "Vous + Être" },
    { id: 7, word: "EST",    r: 5, c: 2, dir: "down",   clue: "Il/Elle + Être" },
    { id: 8, word: "ONT",    r: 7, c: 0, dir: "across", clue: "Ils/Elles + Avoir" }
  ]
};

const IRR_PUZZLE_1 = {
  title: "Mots Croisés: Super Irréguliers",
  description: "Conjugaisons des verbes essentiels : Faire, Aller, Pouvoir, Vouloir...",
  numRows: 12,
  numCols: 15,
  puzzleData: [
    { id: 1, word: "FONT", r: 8, c: 1, dir: "down", clue: "Ils + Faire" },
    { id: 2, word: "FAISONS", r: 1, c: 8, dir: "across", clue: "Nous + Faire" },
    { id: 3, word: "VONT", r: 0, c: 12, dir: "down", clue: "Ils + Aller" },
    { id: 4, word: "ALLONS", r: 1, c: 9, dir: "down", clue: "Nous + Aller" },
    { id: 5, word: "PEUVENT", r: 5, c: 4, dir: "across", clue: "Ils + Pouvoir" },
    { id: 6, word: "POUVONS", r: 9, c: 0, dir: "across", clue: "Nous + Pouvoir" },
    { id: 7, word: "VEULENT", r: 4, c: 5, dir: "down", clue: "Ils + Vouloir" },
    { id: 8, word: "VOULONS", r: 7, c: 2, dir: "across", clue: "Nous + Vouloir" }
  ]
};

const IRR_PUZZLE_2 = {
  title: "Mots Croisés: Verbes « Botte »",
  description: "Conjugaisons des verbes en -ER/-IR à changement de radical (Venir, Prendre...).",
  numRows: 12,
  numCols: 10,
  puzzleData: [
    { id: 1, word: "ACHETONS", r: 0, c: 4, dir: "down",   clue: "Nous + Acheter" },
    { id: 2, word: "ACHÈTENT", r: 2, c: 2, dir: "across", clue: "Ils + Acheter" },
    { id: 3, word: "VIENNENT", r: 4, c: 2, dir: "down",   clue: "Ils + Venir" },
    { id: 4, word: "VENONS",   r: 4, c: 6, dir: "down",   clue: "Nous + Venir" },
    { id: 5, word: "PRENNENT", r: 6, c: 0, dir: "across", clue: "Ils + Prendre" },
    { id: 6, word: "PRENONS",  r: 9, c: 0, dir: "across", clue: "Nous + Prendre" }
  ]
};

const IRR_PUZZLE_3 = {
  title: "Mots Croisés: Autres Irréguliers",
  description: "Conjugaisons des verbes Dire, Lire, Écrire, Boire, Mettre...",
  numRows: 11,
  numCols: 9,
  puzzleData: [
    { id: 1, word: "LISENT",   r: 0,  c: 8, dir: "down",   clue: "Ils + Lire" },
    { id: 2, word: "BOIVENT",  r: 1,  c: 6, dir: "down",   clue: "Ils + Boire" },
    { id: 3, word: "METTONS",  r: 2,  c: 2, dir: "across", clue: "Nous + Mettre" },
    { id: 4, word: "DISONS",   r: 5,  c: 3, dir: "down",   clue: "Nous + Dire" },
    { id: 5, word: "ÉCRIVONS", r: 6,  c: 0, dir: "across", clue: "Nous + Écrire" },
    { id: 6, word: "DISENT",   r: 10, c: 1, dir: "across", clue: "Ils + Dire" }
  ]
};

// Summer-mapped accent colors for each puzzle's postcard stripe & stamp
const PUZZLES = [
  { id: 'er',   name: 'Verbes en -ER',       desc: '10 verbes réguliers du 1er groupe',         puzzle: ER_PUZZLE,    color: '#ea580c', bg: 'rgba(234,88,12,0.18)',   emoji: '🌅' },
  { id: 'ir',   name: 'Verbes en -IR',        desc: '10 verbes réguliers du 2ème groupe',        puzzle: IR_PUZZLE,    color: '#d97706', bg: 'rgba(217,119,6,0.18)',  emoji: '🌻' },
  { id: 're',   name: 'Verbes en -RE',        desc: '10 verbes réguliers du 3ème groupe',        puzzle: RE_PUZZLE,    color: '#0284c7', bg: 'rgba(2,132,199,0.18)',  emoji: '🌊' },
  { id: 'aux',  name: 'Être & Avoir',         desc: 'Les auxiliaires essentiels',                puzzle: AUX_PUZZLE,   color: '#e11d48', bg: 'rgba(225,29,72,0.18)', emoji: '🏖️' },
  { id: 'irr1', name: 'Super Irréguliers',    desc: 'Faire, Aller, Pouvoir, Vouloir…',          puzzle: IRR_PUZZLE_1, color: '#7c3aed', bg: 'rgba(124,58,237,0.18)', emoji: '⛵' },
  { id: 'irr2', name: 'Verbes « Botte »',    desc: 'Venir, Tenir, Prendre, Acheter…',           puzzle: IRR_PUZZLE_2, color: '#f59e0b', bg: 'rgba(245,158,11,0.18)', emoji: '🌴' },
  { id: 'irr3', name: 'Autres Irréguliers',   desc: 'Dire, Lire, Écrire, Boire, Mettre…',      puzzle: IRR_PUZZLE_3, color: '#0ea5e9', bg: 'rgba(14,165,233,0.18)', emoji: '✈️' },
];

export default function CrosswordSection() {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    const selected = PUZZLES.find(p => p.id === activeGame);
    if (selected) {
      return <Crossword {...selected.puzzle} onBack={() => setActiveGame(null)} />;
    }
  }

  return (
    <div className="summer-hub">
      {/* ── Hub Header ── */}
      <div className="summer-hub-header">
        <h2>
          ☀️ Mots Croisés : Le Défi de Conjugaison
        </h2>
        <p>Sélectionnez une grille ci-dessous pour tester vos compétences de conjugaison au présent.</p>
      </div>

      {/* ── Postcard Card Grid ── */}
      <div className="summer-puzzle-grid">
        {PUZZLES.map((item) => (
          <div
            key={item.id}
            className="summer-card"
            onClick={() => setActiveGame(item.id)}
          >
            {/* Colored top stripe like a postcard band */}
            <div
              className="summer-card-stripe"
              style={{ background: item.color }}
            />

            {/* Card body: stamp icon + text */}
            <div className="summer-card-body">
              <div
                className="summer-card-stamp"
                style={{ background: item.bg }}
              >
                <span style={{ fontSize: '1.45rem', lineHeight: 1 }}>{item.emoji}</span>
              </div>
              <div className="summer-card-info">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            </div>

            {/* Footer with play button */}
            <div className="summer-card-footer">
              <button
                className="summer-play-btn"
                style={{ background: item.color }}
                onClick={(e) => { e.stopPropagation(); setActiveGame(item.id); }}
              >
                Jouer →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
