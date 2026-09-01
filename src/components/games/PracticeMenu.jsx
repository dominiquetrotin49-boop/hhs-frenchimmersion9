import React, { useState } from 'react';
import { 
  Grid3X3,
  PenTool,
  Mic,
  FileText,
  RotateCcw
} from 'lucide-react';
import Crossword from './Crossword';
import WritingPractice from './WritingPractice';
import PronunciationPractice from './PronunciationPractice';
import WritingPrompt from './WritingPrompt';
import ReprisePractice from './ReprisePractice';
import QuestionsPractice from './QuestionsPractice';
import './Games.css';

// Exact coordinate matrix for the -ER crossword puzzle
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
    { id: 7, word: "ECOUTONS", r: 12, c: 5, dir: "down", clue: "Nous + Écouter" },
    { id: 8, word: "MANGES", r: 12, c: 9, dir: "down", clue: "Tu + Manger" },
    { id: 9, word: "TROUVENT", r: 14, c: 3, dir: "across", clue: "Ils + Trouver" },
    { id: 10, word: "ETUDIES", r: 16, c: 4, dir: "across", clue: "Tu + Étudier" }
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
    { id: 6, word: "REUSSIS", r: 11, c: 0, dir: "across", clue: "Je + Réussir" },
    { id: 7, word: "ROUGIT", r: 0, c: 13, dir: "down", clue: "Elle + Rougir" },
    { id: 8, word: "OBEIS", r: 13, c: 2, dir: "across", clue: "Tu + Obéir" },
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
  numRows: 8,
  numCols: 7,
  puzzleData: [
    { id: 1, word: "SOMMES", r: 4, c: 1, dir: "across", clue: "Nous (Être)" },
    { id: 2, word: "AVONS", r: 0, c: 1, dir: "down", clue: "Nous (Avoir)" },
    { id: 3, word: "AVEZ", r: 0, c: 1, dir: "across", clue: "Vous (Avoir)" },
    { id: 4, word: "ETES", r: 4, c: 5, dir: "down", clue: "Vous (Être)" },
    { id: 5, word: "SONT", r: 2, c: 0, dir: "across", clue: "Ils (Être)" },
    { id: 6, word: "SUIS", r: 1, c: 6, dir: "down", clue: "Je (Être)" },
    { id: 7, word: "EST", r: 0, c: 3, dir: "down", clue: "Il (Être)" },
    { id: 8, word: "ONT", r: 4, c: 2, dir: "down", clue: "Ils (Avoir)" },
    { id: 9, word: "ES", r: 6, c: 5, dir: "across", clue: "Tu (Être)" },
    { id: 10, word: "AS", r: 7, c: 4, dir: "across", clue: "Tu (Avoir)" }
  ]
};

const IRR_PUZZLE_1 = {
  title: "Mots Croisés: Super Irréguliers & -OIR",
  description: "Conjuguez Être, Avoir, Aller, Faire, Pouvoir, Vouloir, Devoir, Savoir, Voir.",
  numRows: 9,
  numCols: 15,
  puzzleData: [
    { id: 1, word: "PEUVENT", r: 7, c: 4, dir: "across", clue: "Ils + Pouvoir" },
    { id: 2, word: "SOMMES", r: 3, c: 5, dir: "down", clue: "Nous + Être" },
    { id: 3, word: "FAITES", r: 3, c: 8, dir: "down", clue: "Vous + Faire" },
    { id: 4, word: "SAVENT", r: 2, c: 10, dir: "down", clue: "Ils + Savoir" },
    { id: 5, word: "VOYONS", r: 3, c: 0, dir: "across", clue: "Nous + Voir" },
    { id: 6, word: "AVONS", r: 3, c: 10, dir: "across", clue: "Nous + Avoir" },
    { id: 7, word: "VAIS", r: 0, c: 14, dir: "down", clue: "Je + Aller" },
    { id: 8, word: "VEUT", r: 3, c: 0, dir: "down", clue: "Il + Vouloir" },
    { id: 9, word: "DOIS", r: 2, c: 3, dir: "down", clue: "Tu + Devoir" },
    { id: 10, word: "FONT", r: 2, c: 12, dir: "down", clue: "Ils + Faire" }
  ]
};

const IRR_PUZZLE_2 = {
  title: "Mots Croisés: Les verbes 'Botte'",
  description: "Conjuguez Venir, Tenir, Prendre, Acheter, Préférer, Appeler, Payer.",
  numRows: 14,
  numCols: 16,
  puzzleData: [
    { id: 1, word: "TIENNENT", r: 7, c: 4, dir: "across", clue: "Ils + Tenir" },
    { id: 2, word: "APPELONS", r: 4, c: 6, dir: "down", clue: "Nous + Appeler" },
    { id: 3, word: "VIENNENT", r: 0, c: 4, dir: "down", clue: "Ils + Venir" },
    { id: 4, word: "ACHETENT", r: 1, c: 8, dir: "down", clue: "Ils + Acheter" },
    { id: 5, word: "PRENONS", r: 4, c: 10, dir: "down", clue: "Nous + Prendre" },
    { id: 6, word: "ACHETES", r: 11, c: 0, dir: "across", clue: "Tu + Acheter" },
    { id: 7, word: "PREFERE", r: 2, c: 0, dir: "across", clue: "Elle + Préférer" },
    { id: 8, word: "PAIENT", r: 1, c: 7, dir: "across", clue: "Ils + Payer" },
    { id: 9, word: "PRENEZ", r: 4, c: 10, dir: "across", clue: "Vous + Prendre" },
    { id: 10, word: "VIENS", r: 9, c: 3, dir: "down", clue: "Je + Venir" }
  ]
};

const IRR_PUZZLE_3 = {
  title: "Mots Croisés: Autres Irréguliers",
  description: "Conjuguez Mettre, Dire, Lire, Écrire, Boire, Croire, Sortir, Partir, Dormir.",
  numRows: 12,
  numCols: 14,
  puzzleData: [
    { id: 1, word: "ECRIVENT", r: 4, c: 6, dir: "across", clue: "Ils + Écrire" },
    { id: 2, word: "CROIENT", r: 0, c: 6, dir: "down", clue: "Ils + Croire" },
    { id: 3, word: "PARTONS", r: 2, c: 8, dir: "down", clue: "Nous + Partir" },
    { id: 4, word: "DORMENT", r: 0, c: 11, dir: "down", clue: "Ils + Dormir" },
    { id: 5, word: "BOIVENT", r: 6, c: 0, dir: "across", clue: "Ils + Boire" },
    { id: 6, word: "METTEZ", r: 2, c: 13, dir: "down", clue: "Vous + Mettre" },
    { id: 7, word: "DISONS", r: 8, c: 6, dir: "across", clue: "Nous + Dire" },
    { id: 8, word: "BUVONS", r: 6, c: 0, dir: "down", clue: "Nous + Boire" },
    { id: 9, word: "SORTEZ", r: 2, c: 4, dir: "down", clue: "Vous + Sortir" },
    { id: 10, word: "LISEZ", r: 7, c: 7, dir: "down", clue: "Vous + Lire" }
  ]
};

export default function PracticeMenu({ unitId }) {
  if (unitId === 'reprise') {
    return <QuestionsPractice />;
  }

  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === 'writing') return <WritingPractice unitId={unitId} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'pronunciation') return <PronunciationPractice unitId={unitId} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'writing-prompt') return <WritingPrompt unitId={unitId} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-er') return <Crossword {...ER_PUZZLE} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-ir') return <Crossword {...IR_PUZZLE} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-re') return <Crossword {...RE_PUZZLE} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-aux') return <Crossword {...AUX_PUZZLE} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-irr1') return <Crossword {...IRR_PUZZLE_1} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-irr2') return <Crossword {...IRR_PUZZLE_2} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-irr3') return <Crossword {...IRR_PUZZLE_3} onBack={() => setActiveGame(null)} />;

  if (unitId === 'unite-reprise') {
    return <ReprisePractice />;
  }

  return (
    <div className="practice-menu">
      <div className="practice-header">
        <h3>Jeux Pratiques: Choisis ton défi !</h3>
        <p>Renforce ton vocabulaire, ton orthographe et ta prononciation avec ces activités interactives.</p>
      </div>

      <div className="game-cards-container">
        <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-er')}>
          <div className="game-icon-wrapper" style={{ background: 'rgba(234, 88, 12, 0.2)', color: '#ea580c' }}>
            <Grid3X3 size={32} />
          </div>
          <h4>Mots Croisés: Verbes -ER</h4>
          <p>Conjuguez 10 verbes courants en -ER au présent !</p>
          <button className="play-btn">Jouer</button>
        </div>

        <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-ir')}>
          <div className="game-icon-wrapper" style={{ background: 'rgba(217, 119, 6, 0.2)', color: '#d97706' }}>
            <Grid3X3 size={32} />
          </div>
          <h4>Mots Croisés: Verbes -IR</h4>
          <p>Testez les verbes réguliers du 2ème groupe (-IR) !</p>
          <button className="play-btn">Jouer</button>
        </div>

        <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-re')}>
          <div className="game-icon-wrapper" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
            <Grid3X3 size={32} />
          </div>
          <h4>Mots Croisés: Verbes -RE</h4>
          <p>Conjuguez les verbes du 3ème groupe en -RE !</p>
          <button className="play-btn">Jouer</button>
        </div>

        <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-aux')}>
          <div className="game-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            <Grid3X3 size={32} />
          </div>
          <h4>Mots Croisés: Être & Avoir</h4>
          <p>Révisez les deux auxiliaires clés au présent !</p>
          <button className="play-btn">Jouer</button>
        </div>

        <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-irr1')}>
          <div className="game-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}>
            <Grid3X3 size={32} />
          </div>
          <h4>Grille 1: Super Irréguliers</h4>
          <p>Être, Avoir, Aller, Faire, Pouvoir, Vouloir, Devoir...</p>
          <button className="play-btn">Jouer</button>
        </div>

        <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-irr2')}>
          <div className="game-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
            <Grid3X3 size={32} />
          </div>
          <h4>Grille 2: Les verbes "Botte"</h4>
          <p>Venir, Tenir, Prendre, Acheter, Préférer, Appeler, Payer.</p>
          <button className="play-btn">Jouer</button>
        </div>

        <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-irr3')}>
          <div className="game-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            <Grid3X3 size={32} />
          </div>
          <h4>Grille 3: Autres Irréguliers</h4>
          <p>Mettre, Dire, Lire, Écrire, Boire, Croire, Sortir...</p>
          <button className="play-btn">Jouer</button>
        </div>
      </div>
    </div>
  );
}
