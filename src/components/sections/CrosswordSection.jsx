import React, { useState } from 'react';
import { Grid3X3, Sparkles } from 'lucide-react';
import Crossword from '../games/Crossword';

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
    { id: 2, word: "REPONDENT", r: 6, c: 2, dir: "down", clue: "Ils + Répondre" },
    { id: 3, word: "DESCENDEZ", r: 4, c: 6, dir: "down", clue: "Vous + Descendre" },
    { id: 4, word: "DEFENDONS", r: 7, c: 4, dir: "down", clue: "Nous + Défendre" },
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
  numRows: 12,
  numCols: 12,
  puzzleData: [
    { id: 1, word: "SOMMES", r: 2, c: 1, dir: "across", clue: "Nous + Être" },
    { id: 2, word: "ETES", r: 2, c: 5, dir: "down", clue: "Vous + Être" },
    { id: 3, word: "AVONS", r: 5, c: 0, dir: "across", clue: "Nous + Avoir" },
    { id: 4, word: "AVEZ", r: 5, c: 0, dir: "down", clue: "Vous + Avoir" },
    { id: 5, word: "SONT", r: 0, c: 3, dir: "down", clue: "Ils/Elles + Être" },
    { id: 6, word: "ONT", r: 7, c: 3, dir: "across", clue: "Ils/Elles + Avoir" },
    { id: 7, word: "SUIS", r: 9, c: 2, dir: "across", clue: "Je + Être" },
    { id: 8, word: "EST", r: 4, c: 6, dir: "across", clue: "Il/Elle + Être" }
  ]
};

const IRR_PUZZLE_1 = {
  title: "Mots Croisés: Super Irréguliers",
  description: "Conjugaisons des verbes essentiels : Faire, Aller, Pouvoir, Vouloir...",
  numRows: 14,
  numCols: 14,
  puzzleData: [
    { id: 1, word: "FONT", r: 1, c: 2, dir: "across", clue: "Ils + Faire" },
    { id: 2, word: "FAISONS", r: 1, c: 2, dir: "down", clue: "Nous + Faire" },
    { id: 3, word: "VONT", r: 3, c: 0, dir: "across", clue: "Ils + Aller" },
    { id: 4, word: "ALLONS", r: 0, c: 6, dir: "down", clue: "Nous + Aller" },
    { id: 5, word: "PEUVENT", r: 6, c: 3, dir: "across", clue: "Ils + Pouvoir" },
    { id: 6, word: "POUVONS", r: 4, c: 9, dir: "down", clue: "Nous + Pouvoir" },
    { id: 7, word: "VEULENT", r: 10, c: 1, dir: "across", clue: "Ils + Vouloir" },
    { id: 8, word: "VOULONS", r: 5, c: 1, dir: "down", clue: "Nous + Vouloir" }
  ]
};

const IRR_PUZZLE_2 = {
  title: "Mots Croisés: Verbes « Botte »",
  description: "Conjugaisons des verbes en -ER/-IR à changement de radical (Venir, Prendre...).",
  numRows: 14,
  numCols: 14,
  puzzleData: [
    { id: 1, word: "VIENNENT", r: 2, c: 1, dir: "across", clue: "Ils + Venir" },
    { id: 2, word: "VENONS", r: 2, c: 1, dir: "down", clue: "Nous + Venir" },
    { id: 3, word: "PRENNENT", r: 5, c: 3, dir: "across", clue: "Ils + Prendre" },
    { id: 4, word: "PRENONS", r: 4, c: 5, dir: "down", clue: "Nous + Prendre" },
    { id: 5, word: "ACHETENT", r: 8, c: 0, dir: "across", clue: "Ils + Acheter" },
    { id: 6, word: "ACHETONS", r: 6, c: 8, dir: "down", clue: "Nous + Acheter" }
  ]
};

const IRR_PUZZLE_3 = {
  title: "Mots Croisés: Autres Irréguliers",
  description: "Conjugaisons des verbes Dire, Lire, Écrire, Boire, Mettre...",
  numRows: 14,
  numCols: 14,
  puzzleData: [
    { id: 1, word: "DISENT", r: 2, c: 2, dir: "across", clue: "Ils + Dire" },
    { id: 2, word: "DISONS", r: 1, c: 4, dir: "down", clue: "Nous + Dire" },
    { id: 3, word: "LISENT", r: 5, c: 1, dir: "across", clue: "Ils + Lire" },
    { id: 4, word: "ECRIVONS", r: 4, c: 7, dir: "down", clue: "Nous + Écrire" },
    { id: 5, word: "BOIVENT", r: 8, c: 3, dir: "across", clue: "Ils + Boire" },
    { id: 6, word: "METTONS", r: 7, c: 9, dir: "down", clue: "Nous + Mettre" }
  ]
};

const PUZZLES = [
  { id: 'er', name: 'Verbes en -ER', desc: '10 verbes réguliers du 1er groupe', puzzle: ER_PUZZLE, color: '#ea580c', bg: 'rgba(234, 88, 12, 0.22)' },
  { id: 'ir', name: 'Verbes en -IR', desc: '10 verbes réguliers du 2ème groupe', puzzle: IR_PUZZLE, color: '#d97706', bg: 'rgba(217, 119, 6, 0.22)' },
  { id: 're', name: 'Verbes en -RE', desc: '10 verbes réguliers du 3ème groupe', puzzle: RE_PUZZLE, color: '#16a34a', bg: 'rgba(22, 163, 74, 0.22)' },
  { id: 'aux', name: 'Être & Avoir', desc: 'Les auxiliaires essentiels', puzzle: AUX_PUZZLE, color: '#dc2626', bg: 'rgba(220, 38, 38, 0.22)' },
  { id: 'irr1', name: 'Super Irréguliers', desc: 'Être, Avoir, Aller, Faire, Pouvoir...', puzzle: IRR_PUZZLE_1, color: '#9333ea', bg: 'rgba(147, 51, 234, 0.22)' },
  { id: 'irr2', name: 'Verbes « Botte »', desc: 'Venir, Tenir, Prendre, Acheter...', puzzle: IRR_PUZZLE_2, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.22)' },
  { id: 'irr3', name: 'Autres Irréguliers', desc: 'Mettre, Dire, Lire, Écrire, Boire...', puzzle: IRR_PUZZLE_3, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.22)' },
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
    <div style={{ width: '100%', color: '#ffffff' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
          <Sparkles size={22} color="#f59e0b" />
          Mots Croisés : Le Défi de Conjugaison (7 Grilles)
        </h2>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
          Sélectionnez une grille ci-dessous pour tester vos compétences de conjugaison au présent.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '14px'
      }}>
        {PUZZLES.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveGame(item.id)}
            style={{
              background: 'rgba(15, 23, 42, 0.82)',
              border: `1.5px solid ${item.color}70`,
              borderRadius: '12px',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: item.bg,
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Grid3X3 size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                  {item.name}
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {item.desc}
                </p>
              </div>
            </div>

            <button
              style={{
                background: item.color,
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginLeft: '10px',
                flexShrink: 0
              }}
            >
              Jouer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
