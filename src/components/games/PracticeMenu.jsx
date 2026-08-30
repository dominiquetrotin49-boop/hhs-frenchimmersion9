import React, { useState } from 'react';
import { Clock, TrendingUp, Flag } from 'lucide-react';
import EditorChallenge from './EditorChallenge';
import JournalistLadder from './JournalistLadder';
import ScoopRace from './ScoopRace';
import Crossword from './Crossword';
import WritingPractice from './WritingPractice';
import PronunciationPractice from './PronunciationPractice';
import PronounReplacement from './PronounReplacement';
import PronounOrder from './PronounOrder';
import PronounFill from './PronounFill';
import GrammarFill from './GrammarFill';
import Fishtopia from './Fishtopia';
import { Grid3X3, PenTool, Volume2, Repeat, MoveHorizontal, Edit3, Gamepad2 } from 'lucide-react';
import { IMPARFAIT_FILL_DATA, PC_FILL_DATA, MIXED_FILL_DATA } from '../../data/unit4GrammarGames';
import ArtDetectiveGame from './ArtDetectiveGame';
import FilmDirectorGame from './FilmDirectorGame';
import ArtAuctionGame from './ArtAuctionGame';
import './Games.css';

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
    { "id": 1, "word": "PEUVENT", "r": 7, "c": 4, "dir": "across", "clue": "Ils + Pouvoir" },
    { "id": 2, "word": "SOMMES", "r": 3, "c": 5, "dir": "down", "clue": "Nous + Être" },
    { "id": 3, "word": "FAITES", "r": 3, "c": 8, "dir": "down", "clue": "Vous + Faire" },
    { "id": 4, "word": "SAVENT", "r": 2, "c": 10, "dir": "down", "clue": "Ils + Savoir" },
    { "id": 5, "word": "VOYONS", "r": 3, "c": 0, "dir": "across", "clue": "Nous + Voir" },
    { "id": 6, "word": "AVONS", "r": 3, "c": 10, "dir": "across", "clue": "Nous + Avoir" },
    { "id": 7, "word": "VAIS", "r": 0, "c": 14, "dir": "down", "clue": "Je + Aller" },
    { "id": 8, "word": "VEUT", "r": 3, "c": 0, "dir": "down", "clue": "Il + Vouloir" },
    { "id": 9, "word": "DOIS", "r": 2, "c": 3, "dir": "down", "clue": "Tu + Devoir" },
    { "id": 10, "word": "FONT", "r": 2, "c": 12, "dir": "down", "clue": "Ils + Faire" }
  ]
};

const IRR_PUZZLE_2 = {
  title: "Mots Croisés: Les verbes 'Botte'",
  description: "Conjuguez Venir, Tenir, Prendre, Acheter, Préférer, Appeler, Payer.",
  numRows: 14,
  numCols: 16,
  puzzleData: [
    { "id": 1, "word": "TIENNENT", "r": 7, "c": 4, "dir": "across", "clue": "Ils + Tenir" },
    { "id": 2, "word": "APPELONS", "r": 4, "c": 6, "dir": "down", "clue": "Nous + Appeler" },
    { "id": 3, "word": "VIENNENT", "r": 0, "c": 4, "dir": "down", "clue": "Ils + Venir" },
    { "id": 4, "word": "ACHETENT", "r": 1, "c": 8, "dir": "down", "clue": "Ils + Acheter" },
    { "id": 5, "word": "PRENONS", "r": 4, "c": 10, "dir": "down", "clue": "Nous + Prendre" },
    { "id": 6, "word": "ACHETES", "r": 11, "c": 0, "dir": "across", "clue": "Tu + Acheter" },
    { "id": 7, "word": "PREFERE", "r": 2, "c": 0, "dir": "across", "clue": "Elle + Préférer" },
    { "id": 8, "word": "PAIENT", "r": 1, "c": 7, "dir": "across", "clue": "Ils + Payer" },
    { "id": 9, "word": "PRENEZ", "r": 4, "c": 10, "dir": "across", "clue": "Vous + Prendre" },
    { "id": 10, "word": "VIENS", "r": 9, "c": 3, "dir": "down", "clue": "Je + Venir" }
  ]
};

const IRR_PUZZLE_3 = {
  title: "Mots Croisés: Autres Irréguliers",
  description: "Conjuguez Mettre, Dire, Lire, Écrire, Boire, Croire, Sortir, Partir, Dormir.",
  numRows: 12,
  numCols: 14,
  puzzleData: [
    { "id": 1, "word": "ECRIVENT", "r": 4, "c": 6, "dir": "across", "clue": "Ils + Écrire" },
    { "id": 2, "word": "CROIENT", "r": 0, "c": 6, "dir": "down", "clue": "Ils + Croire" },
    { "id": 3, "word": "PARTONS", "r": 2, "c": 8, "dir": "down", "clue": "Nous + Partir" },
    { "id": 4, "word": "DORMENT", "r": 0, "c": 11, "dir": "down", "clue": "Ils + Dormir" },
    { "id": 5, "word": "BOIVENT", "r": 6, "c": 0, "dir": "across", "clue": "Ils + Boire" },
    { "id": 6, "word": "METTEZ", "r": 2, "c": 13, "dir": "down", "clue": "Vous + Mettre" },
    { "id": 7, "word": "DISONS", "r": 8, "c": 6, "dir": "across", "clue": "Nous + Dire" },
    { "id": 8, "word": "BUVONS", "r": 6, "c": 0, "dir": "down", "clue": "Nous + Boire" },
    { "id": 9, "word": "SORTEZ", "r": 2, "c": 4, "dir": "down", "clue": "Vous + Sortir" },
    { "id": 10, "word": "PAYENT", "r": 3, "c": 7, "dir": "across", "clue": "Ils + Payer" }
  ]
};

const UNIT_4_PUZZLE = {
  title: "Mots Croisés: Les Arts & la Culture",
  description: "Remplissez la grille avec le vocabulaire et les notions culturelles de l'Unité 4.",
  numRows: 10,
  numCols: 10,
  puzzleData: [
    { id: 1, word: "EXPOSITION", r: 0, c: 4, dir: "down", clue: "Présentation publique d'œuvres d'art" },
    { id: 2, word: "CINEMA", r: 0, c: 1, dir: "across", clue: "Le 7e art" },
    { id: 3, word: "PRIX", r: 2, c: 4, dir: "across", clue: "Récompense attribuée lors d'un festival" },
    { id: 4, word: "SLAM", r: 4, c: 4, dir: "across", clue: "Poésie orale déclamée en rythme" },
    { id: 5, word: "THEATRE", r: 6, c: 0, dir: "across", clue: "Art de la représentation scénique" },
    { id: 6, word: "NUANCE", r: 9, c: 4, dir: "across", clue: "Subtilité de sens ou de couleur" },
    { id: 7, word: "SCENARIO", r: 1, c: 8, dir: "down", clue: "Texte écrit décrivant les scènes d'un film" }
  ]
};

export default function PracticeMenu({ unitId }) {
  const [activeGame, setActiveGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('vocab');

  const getGameTitles = () => {
    switch(unitId) {
      case 'reprise':
        return {
          editor: "Le Défi du Champion",
          editorDesc: "Trouve la bonne préposition ou le verbe conjugué avant la fin du temps !",
          editorBtn: "Jouer (Contre la montre)",
          ladder: "L'Escalade des Verbes",
          ladderDesc: "Deviens un champion des verbes de base en répondant à des questions de plus en plus difficiles.",
          ladderBtn: "Jouer (Progression)",
          race: "La Course de Rentrée",
          raceDesc: "Sois le premier à arriver devant le collège en répondant correctement !",
          raceBtn: "Jouer (Course)",
          writingTitle: "Raconter ses vacances d'été",
          writingDesc: "Rédigez un paragraphe sur vos vacances d'été en utilisant le présent de l'indicatif et des prépositions de lieu !"
        };
      case '2':
        return {
          editor: "Le Défi du Professeur",
          editorDesc: "Trouve le bon mot avant que le temps ne s'écoule.",
          editorBtn: "Jouer (Contre la montre)",
          ladder: "L'Ascension Universitaire",
          ladderDesc: "Deviens un excellent professeur en répondant à des questions de plus en plus difficiles.",
          ladderBtn: "Jouer (Progression)",
          race: "Le Marathon des Examens",
          raceDesc: "Bâts ton rival pour être le premier à réussir les examens !",
          raceBtn: "Jouer (Course)",
          writingTitle: "Créer une école innovante",
          writingDesc: "Rédigez un paragraphe sur la création de votre école idéale en utilisant le présent !"
        };
      case '3':
        return {
          editor: "Le Défi du Hacker",
          editorDesc: "Trouve le bon mot de passe avant que le temps ne s'écoule.",
          editorBtn: "Jouer (Contre la montre)",
          ladder: "L'Échelle du Développeur",
          ladderDesc: "Deviens un expert en tech en répondant à des questions complexes.",
          ladderBtn: "Jouer (Progression)",
          race: "La Course à l'Innovation",
          raceDesc: "Bâts l'entreprise rivale pour être le premier à publier ta technologie !",
          raceBtn: "Jouer (Course)",
          writingTitle: "Se protéger en ligne",
          writingDesc: "Rédigez un paragraphe sur la cybersécurité en utilisant le présent !"
        };
      case '4':
        return {
          editor: "Le Défi des Mots d'Art",
          editorDesc: "Trouvez le bon mot du vocabulaire artistique avant la fin du temps !",
          editorBtn: "Jouer (Contre la montre)",
          ladder: "Le Parcours Culturel",
          ladderDesc: "Devenez un expert en cinéma, musique et architecture en répondant aux questions !",
          ladderBtn: "Jouer (Progression)",
          race: "La Course du Festival de Cannes",
          raceDesc: "Gagnez la course au cinéma en répondant correctement à toutes les questions !",
          raceBtn: "Jouer (Course)",
          writingTitle: "Critique de Film & Récit d'Art",
          writingDesc: "Rédigez la critique d'un film ou le récit d'un souvenir culturel au passé !"
        };
      default: // Unit 1
        return {
          editor: "Le Défi du Rédacteur en Chef",
          editorDesc: "Un jeu de vitesse ! Trouve le bon mot avant que le temps ne s'écoule.",
          editorBtn: "Jouer (Contre la montre)",
          ladder: "L'Échelle du Journaliste",
          ladderDesc: "Deviens Rédacteur en Chef en répondant à des questions de plus en plus difficiles.",
          ladderBtn: "Jouer (Progression)",
          race: "La Course au Scoop",
          raceDesc: "Bâts le journal rival pour être le premier à publier le scoop !",
          raceBtn: "Jouer (Course)",
          writingTitle: "Journaliste en Action",
          writingDesc: "Rédigez un paragraphe sur votre rôle de journaliste en utilisant le présent !"
        };
    }
  };

  const titles = getGameTitles();

  if (activeGame === 'editor') return <EditorChallenge unitId={unitId} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'ladder') return <JournalistLadder unitId={unitId} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'race') return <ScoopRace unitId={unitId} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-er') return <Crossword {...ER_PUZZLE} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-ir') return <Crossword {...IR_PUZZLE} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-re') return <Crossword {...RE_PUZZLE} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-aux') return <Crossword {...AUX_PUZZLE} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'grammar-fill-imparfait') return <GrammarFill data={IMPARFAIT_FILL_DATA} title="L'Imparfait" description="Complétez avec le verbe conjugué à l'imparfait." onBack={() => setActiveGame(null)} />;
  if (activeGame === 'grammar-fill-pc') return <GrammarFill data={PC_FILL_DATA} title="Le Passé Composé" description="Choisissez le bon auxiliaire et participe passé." onBack={() => setActiveGame(null)} />;
  if (activeGame === 'grammar-fill-mixed') return <GrammarFill data={MIXED_FILL_DATA} title="Imparfait vs Passé Composé" description="Choisissez le temps approprié pour chaque situation." onBack={() => setActiveGame(null)} />;
  if (activeGame === 'writing') return <WritingPractice unitId={unitId} onBack={() => setActiveGame(null)} />;
  // Unit 2 puzzles
  if (activeGame === 'crossword-irr1') return <Crossword {...IRR_PUZZLE_1} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-irr2') return <Crossword {...IRR_PUZZLE_2} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crossword-irr3') return <Crossword {...IRR_PUZZLE_3} onBack={() => setActiveGame(null)} />;
  
  // Unit 4 Special Games
  if (activeGame === 'art-detective') return <ArtDetectiveGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'film-director') return <FilmDirectorGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'art-auction') return <ArtAuctionGame onBack={() => setActiveGame(null)} />;

  if (activeGame === 'crossword-u4') return <Crossword {...UNIT_4_PUZZLE} onBack={() => setActiveGame(null)} />;
  
  if (activeGame === 'pronoun-replace') return <PronounReplacement onBack={() => setActiveGame(null)} />;
  if (activeGame === 'pronoun-order') return <PronounOrder onBack={() => setActiveGame(null)} />;
  if (activeGame === 'pronoun-fill') return <PronounFill onBack={() => setActiveGame(null)} />;
  
  if (activeGame === 'fishtopia') return <Fishtopia onBack={() => setActiveGame(null)} />;
  
  if (activeGame === 'writing') return <WritingPractice unitId={unitId} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'pronunciation') return <PronunciationPractice unitId={unitId} onBack={() => setActiveGame(null)} />;

  return (
    <div className="practice-menu">
      <div className="flex-between mb-4" style={{ alignItems: 'flex-end' }}>
        <h3>Jeux Pratiques: Choisis ton défi !</h3>
        
        <div className="tabs-container" style={{ alignSelf: 'auto' }}>
          <button 
            className={`tab-btn ${activeCategory === 'vocab' ? 'active' : ''}`}
            onClick={() => setActiveCategory('vocab')}
          >
            Vocabulaire
          </button>
          <button 
            className={`tab-btn ${activeCategory === 'grammar' ? 'active' : ''}`}
            onClick={() => setActiveCategory('grammar')}
          >
            Grammaire
          </button>
          <button 
            className={`tab-btn ${activeCategory === 'ecriture' ? 'active' : ''}`}
            onClick={() => setActiveCategory('ecriture')}
          >
            Production Écrite
          </button>
        </div>
      </div>
      
      <div className="game-cards-container">
        {activeCategory === 'vocab' && (
          <>
            <div className="game-card glass-panel" onClick={() => setActiveGame('pronunciation')}>
              <Volume2 className="game-icon" style={{ color: '#f1c40f' }} size={48} />
              <h4>Atelier de Prononciation</h4>
              <p>Écoutez et répétez les mots de vocabulaire avec un accent natif !</p>
              <button className="play-btn" style={{ background: 'rgba(241, 196, 15, 0.2)' }}>S'entraîner</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('editor')}>
              <Clock className="game-icon text-danger" size={48} />
              <h4>{titles.editor}</h4>
              <p>{titles.editorDesc}</p>
              <button className="play-btn btn-danger">{titles.editorBtn}</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('ladder')}>
              <TrendingUp className="game-icon text-success" size={48} />
              <h4>{titles.ladder}</h4>
              <p>{titles.ladderDesc}</p>
              <button className="play-btn btn-success">{titles.ladderBtn}</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('race')}>
              <Flag className="game-icon text-accent" size={48} />
              <h4>{titles.race}</h4>
              <p>{titles.raceDesc}</p>
              <button className="play-btn btn-accent">{titles.raceBtn}</button>
            </div>
            
            {unitId === '4' && (
              <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-u4')}>
                <Grid3X3 className="game-icon text-success" size={48} />
                <h4>Mots Croisés: Les Arts & la Culture</h4>
                <p>Complétez la grille avec le vocabulaire et les notions culturelles de l'Unité 4 !</p>
                <button className="play-btn btn-success">Jouer (Mots Croisés)</button>
              </div>
            )}
          </>
        )}

        {activeCategory === 'grammar' && unitId !== '2' && unitId !== '3' && unitId !== '4' && (
          <>
            <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-er')}>
              <Grid3X3 className="game-icon" style={{ color: '#fdf6e3' }} size={48} />
              <h4>Mots Croisés: Verbes -ER</h4>
              <p>Remplissez la grille en conjuguant 10 verbes courants en -ER !</p>
              <button className="play-btn" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>Jouer (Grille -ER)</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-ir')}>
              <Grid3X3 className="game-icon text-accent" size={48} />
              <h4>Mots Croisés: Verbes -IR</h4>
              <p>Testez vos connaissances des verbes réguliers du 2ème groupe (-IR) !</p>
              <button className="play-btn btn-accent">Jouer (Grille -IR)</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-re')}>
              <Grid3X3 className="game-icon text-success" size={48} />
              <h4>Mots Croisés: Verbes -RE</h4>
              <p>Conjuguez les verbes du 3ème groupe en -RE comme attendre ou vendre !</p>
              <button className="play-btn btn-success">Jouer (Grille -RE)</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-aux')}>
              <Grid3X3 className="game-icon text-danger" size={48} />
              <h4>Mots Croisés: Être & Avoir</h4>
              <p>Révisez les deux auxiliaires les plus importants de la langue française !</p>
              <button className="play-btn btn-danger">Jouer (Grille Auxiliaires)</button>
            </div>
          </>
        )}

        {activeCategory === 'grammar' && unitId === '2' && (
          <>
            <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-irr1')}>
              <Grid3X3 className="game-icon" style={{ color: '#fdf6e3' }} size={48} />
              <h4>Grille 1: Super Irréguliers & -OIR</h4>
              <p>Conjuguez Être, Avoir, Aller, Faire, Pouvoir, Vouloir, Devoir, Savoir, Voir.</p>
              <button className="play-btn" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>Jouer (Grille 1)</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-irr2')}>
              <Grid3X3 className="game-icon text-accent" size={48} />
              <h4>Grille 2: Les verbes "Botte"</h4>
              <p>Conjuguez Venir, Tenir, Prendre, Acheter, Préférer, Appeler, Payer.</p>
              <button className="play-btn btn-accent">Jouer (Grille 2)</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('crossword-irr3')}>
              <Grid3X3 className="game-icon text-success" size={48} />
              <h4>Grille 3: Autres Irréguliers</h4>
              <p>Conjuguez Mettre, Dire, Lire, Écrire, Boire, Croire, Sortir, Partir, Dormir.</p>
              <button className="play-btn btn-success">Jouer (Grille 3)</button>
            </div>
          </>
        )}

        {activeCategory === 'grammar' && unitId === '3' && (
          <>
            <div className="game-card glass-panel" onClick={() => setActiveGame('pronoun-replace')}>
              <Repeat className="game-icon" style={{ color: '#fdf6e3' }} size={48} />
              <h4>Jeu 1: Remplacement (QCM)</h4>
              <p>Choisissez le bon pronom objet pour remplacer le nom lié à la cybersécurité.</p>
              <button className="play-btn" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>Jouer</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('pronoun-order')}>
              <MoveHorizontal className="game-icon text-accent" size={48} />
              <h4>Jeu 2: L'Ordre des Doubles Pronoms</h4>
              <p>Remettez les mots de la phrase dans le bon ordre (ex: Je le lui donne).</p>
              <button className="play-btn btn-accent">Jouer</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('pronoun-fill')}>
              <Edit3 className="game-icon text-success" size={48} />
              <h4>Jeu 3: Texte à Trous (Pronoms)</h4>
              <p>Lisez le dialogue tech et complétez les blancs avec le bon pronom objet court.</p>
              <button className="play-btn btn-success">Jouer</button>
            </div>
          </>
        )}

        {activeCategory === 'grammar' && unitId === '4' && (
          <>
            <div className="game-card glass-panel" onClick={() => setActiveGame('grammar-fill-imparfait')}>
              <Edit3 className="game-icon text-success" size={48} />
              <h4>Jeu 1: L'Imparfait</h4>
              <p>Pratiquez les terminaisons et les irréguliers (être/avoir) à l'imparfait.</p>
              <button className="play-btn btn-success">Jouer</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('grammar-fill-pc')}>
              <Edit3 className="game-icon text-accent" size={48} />
              <h4>Jeu 2: Le Passé Composé</h4>
              <p>Pratiquez le choix de l'auxiliaire (Avoir/Être) et l'accord du participe.</p>
              <button className="play-btn btn-accent">Jouer</button>
            </div>

            <div className="game-card glass-panel" onClick={() => setActiveGame('grammar-fill-mixed')}>
              <Gamepad2 className="game-icon" style={{ color: '#8b5cf6' }} size={48} />
              <h4>Jeu 3: Imparfait vs Passé Composé</h4>
              <p>Entraînez-vous à combiner le décor (imparfait) et l'action soudaine (PC).</p>
              <button className="play-btn" style={{ background: '#8b5cf6', color: 'white' }}>Jouer</button>
            </div>
          </>
        )}

        {activeCategory === 'ecriture' && (
          <div className="game-card glass-panel" onClick={() => setActiveGame('writing')}>
            <PenTool className="game-icon text-accent" size={48} />
            <h4>{titles.writingTitle}</h4>
            <p>{titles.writingDesc}</p>
            <button className="play-btn btn-accent">Commencer à écrire</button>
          </div>
        )}
      </div>
    </div>
  );
}
