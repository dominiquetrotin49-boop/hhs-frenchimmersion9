import React, { useState } from 'react';
import { Grid3X3 } from 'lucide-react';
import Crossword from '../games/Crossword';
import '../games/Games.css';

const ER_PUZZLE = {
  title: "Mots Croisés: Verbes en -ER",
  description: "Remplissez la grille avec les conjugaisons correctes au présent.",
  numRows: 13,
  numCols: 18,
  puzzleData: [
    { id: 1, word: "TRAVAILLENT", r: 7, c: 6, dir: "across", clue: "Ils + Travailler" },
    { id: 2, word: "ECOUTONS", r: 3, c: 6, dir: "down", clue: "Nous + Écouter" },
    { id: 3, word: "TROUVENT", r: 3, c: 9, dir: "down", clue: "Ils + Trouver" },
    { id: 4, word: "PARLONS", r: 4, c: 12, dir: "down", clue: "Nous + Parler" },
    { id: 5, word: "HABITEZ", r: 2, c: 14, dir: "down", clue: "Vous + Habiter" },
    { id: 6, word: "REGARDE", r: 3, c: 0, dir: "across", clue: "Je + Regarder" },
    { id: 7, word: "ETUDIES", r: 6, c: 16, dir: "down", clue: "Tu + Étudier" },
    { id: 8, word: "MANGES", r: 10, c: 1, dir: "across", clue: "Tu + Manger" },
    { id: 9, word: "JOUE", r: 0, c: 1, dir: "down", clue: "Je + Jouer" },
    { id: 10, word: "AIME", r: 3, c: 14, dir: "across", clue: "Elle + Aimer" }
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
    { id: 10, word: "PAYENT", r: 3, c: 7, dir: "across", clue: "Ils + Payer" }
  ]
};

const PUZZLE_LIST = [
  { id: 'crossword-er', iconColor: '#fdf6e3', title: "Mots Croisés: Verbes -ER", desc: "Remplissez la grille en conjuguant 10 verbes courants en -ER !", btnText: "Jouer (Grille -ER)", btnClass: "play-btn-default", puzzle: ER_PUZZLE },
  { id: 'crossword-ir', iconColor: '#fbbf24', title: "Mots Croisés: Verbes -IR", desc: "Testez vos connaissances des verbes réguliers du 2ème groupe (-IR) !", btnText: "Jouer (Grille -IR)", btnClass: "play-btn-accent", puzzle: IR_PUZZLE },
  { id: 'crossword-re', iconColor: '#4ade80', title: "Mots Croisés: Verbes -RE", desc: "Conjuguez les verbes du 3ème groupe en -RE comme attendre ou vendre !", btnText: "Jouer (Grille -RE)", btnClass: "play-btn-success", puzzle: RE_PUZZLE },
  { id: 'crossword-aux', iconColor: '#f87171', title: "Mots Croisés: Être & Avoir", desc: "Révisez les deux auxiliaires les plus importants de la langue française !", btnText: "Jouer (Grille Auxiliaires)", btnClass: "play-btn-danger", puzzle: AUX_PUZZLE },
  { id: 'crossword-irr1', iconColor: '#fdf6e3', title: "Grille 1: Super Irréguliers & -OIR", desc: "Conjuguez Être, Avoir, Aller, Faire, Pouvoir, Vouloir, Devoir, Savoir, Voir.", btnText: "Jouer (Grille 1)", btnClass: "play-btn-default", puzzle: IRR_PUZZLE_1 },
  { id: 'crossword-irr2', iconColor: '#fbbf24', title: "Grille 2: Les verbes \"Botte\"", desc: "Conjuguez Venir, Tenir, Prendre, Acheter, Préférer, Appeler, Payer.", btnText: "Jouer (Grille 2)", btnClass: "play-btn-accent", puzzle: IRR_PUZZLE_2 },
  { id: 'crossword-irr3', iconColor: '#4ade80', title: "Grille 3: Autres Irréguliers", desc: "Conjuguez Mettre, Dire, Lire, Écrire, Boire, Croire, Sortir, Partir, Dormir.", btnText: "Jouer (Grille 3)", btnClass: "play-btn-success", puzzle: IRR_PUZZLE_3 },
];

export default function CrosswordSection() {
  const [activeGame, setActiveGame] = useState(null);

  const selected = PUZZLE_LIST.find(p => p.id === activeGame);
  if (selected) {
    return <Crossword {...selected.puzzle} onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="custom-crossword-grid">
      {PUZZLE_LIST.map((item) => (
        <div
          key={item.id}
          className="custom-crossword-card"
          onClick={() => setActiveGame(item.id)}
        >
          <Grid3X3 size={48} style={{ color: item.iconColor }} />
          <h4>{item.title}</h4>
          <p>{item.desc}</p>
          <button className={`play-btn ${item.btnClass}`}>
            {item.btnText}
          </button>
        </div>
      ))}
    </div>
  );
}
