import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, RefreshCw, XCircle, Award, AlertTriangle } from 'lucide-react';
import './PracticeSection.css';
import WritingPrompt from '../games/WritingPrompt';
import CrosswordSection from './CrosswordSection';

const ACTIVITIES = [
  {
    id: 'prep_1_4',
    title: 'Activité 1 : à, en, chez, dans',
    description: "Complétez chaque phrase avec la préposition appropriée : à (ou ses formes contractées : au, à la, à l', aux), en, chez, ou dans.",
    questions: [
      { id: 'p1_1', textBefore: "Pendant les vacances d'automne, notre famille a voyagé ", textAfter: " France pour rendre visite à nos grands-parents.", hint: "à / en / chez / dans", answer: "en" },
      { id: 'p1_2', textBefore: "Avant de partir pour le lycée le matin, Lucas passe toujours ", textAfter: " le boulanger acheter des viennoiseries.", hint: "à / en / chez / dans", answer: "chez" },
      { id: 'p1_3', textBefore: "Les élèves ont rangé leurs cahiers et leurs stylos ", textAfter: " le tiroir du bureau.", hint: "à / en / chez / dans", answer: "dans" },
      { id: 'p1_4', textBefore: "Nous devons absolument arriver ", textAfter: " l'heure pour le début du premier cours.", hint: "à / en / chez / dans", answer: "à" },
      { id: 'p1_5', textBefore: "Mon frère aîné étudie à l'université et habite actuellement ", textAfter: " un petit appartement au centre-ville.", hint: "à / en / chez / dans", answer: "dans" },
      { id: 'p1_6', textBefore: "Après les cours, plusieurs camarades vont travailler ", textAfter: " Thomas pour préparer le projet d'art.", hint: "à / en / chez / dans", answer: "chez" },
      { id: 'p1_7', textBefore: "Ce projet d'histoire doit être entièrement terminé ", textAfter: " trois jours seulement.", hint: "à / en / chez / dans", answer: "en" },
      { id: 'p1_8', textBefore: "Notre classe va faire une sortie scolaire cette semaine ", textAfter: " Genève pour visiter un musée d'histoire.", hint: "à / en / chez / dans", answer: "à" },
      { id: 'p1_9', textBefore: "Quand il pleut beaucoup le matin, nous préférons aller à l'école ", textAfter: " métro plutôt qu'à vélo.", hint: "à / en / chez / dans", answer: "en" },
      { id: 'p1_10', textBefore: "On retrouve souvent des thèmes liés à la rentrée et à l'amitié ", textAfter: " les histoires de ce livre.", hint: "à / en / chez / dans", answer: "dans" },
      { id: 'p1_11', textBefore: "Pour demander sa nouvelle carte d'étudiant, elle a dû se présenter directement ", textAfter: " le secrétariat du lycée.", hint: "à / en / chez / dans", answer: "dans" },
      { id: 'p1_12', textBefore: "Le bus scolaire pour rentrer à la maison partira ", textAfter: " dix minutes devant l'entrée principale.", hint: "à / en / chez / dans", answer: "dans" },
      { id: 'p1_13', textBefore: "Notre correspondante québécoise va passer tout l'été ", textAfter: " ses cousins en Bretagne.", hint: "à / en / chez / dans", answer: "chez" },
      { id: 'p1_14', textBefore: "Les élèves se sont rassemblés ", textAfter: " le parc après les cours pour faire un pique-nique.", hint: "à / en / chez / dans", answer: "dans" },
      { id: 'p1_15', textBefore: "Il a réussi à apprendre son court dialogue pour la classe de français ", textAfter: " moins d'une heure.", hint: "à / en / chez / dans", answer: "en" }
    ]
  },
  {
    id: 'prep_spatiales',
    title: 'Activité 2 : Prépositions spatiales',
    description: "Complétez chaque phrase avec la préposition spatiale qui convient le mieux : devant, sous, entre, ou sur.",
    questions: [
      { id: 'p2_1', textBefore: "Julien attend ses amis tous les matins juste ", textAfter: " la porte d'entrée du lycée.", hint: "devant / sous / entre / sur", answer: "devant" },
      { id: 'p2_2', textBefore: "Pour ne pas faire de bruit dans la classe, les élèves ont mis des patins ", textAfter: " les pieds des chaises.", hint: "devant / sous / entre / sur", answer: "sous" },
      { id: 'p2_3', textBefore: "Le professeur nous aide à choisir ", textAfter: " le cours d'espagnol et le cours d'allemand.", hint: "devant / sous / entre / sur", answer: "entre" },
      { id: 'p2_4', textBefore: "Le nouvel horaire des clubs de sport a été affiché ", textAfter: " le panneau d'information de l'école.", hint: "devant / sous / entre / sur", answer: "sur" },
      { id: 'p2_5', textBefore: "Marc a retrouvé son carnet de devoirs caché ", textAfter: " une pile de vieux livres dans sa chambre.", hint: "devant / sous / entre / sur", answer: "sous" },
      { id: 'p2_6', textBefore: "Tout le groupe d'immersion s'est rassemblé ", textAfter: " la bibliothèque pour la photo de classe.", hint: "devant / sous / entre / sur", answer: "devant" },
      { id: 'p2_7', textBefore: "Samira hésite encore ", textAfter: " faire du théâtre ou jouer dans l'équipe de soccer.", hint: "devant / sous / entre / sur", answer: "entre" },
      { id: 'p2_8', textBefore: "Les feuilles d'exercices de français étaient simplement posées ", textAfter: " le bureau du professeur.", hint: "devant / sous / entre / sur", answer: "sur" },
      { id: 'p2_9', textBefore: "Les élèves marchaient rapidement ", textAfter: " une pluie battante pour rentrer à la maison après l'école.", hint: "devant / sous / entre / sur", answer: "sous" },
      { id: 'p2_10', textBefore: "Pour le travail d'équipe, les élèves ont placé leurs chaises ", textAfter: " deux grandes tables.", hint: "devant / sous / entre / sur", answer: "entre" },
      { id: 'p2_11', textBefore: "Le délégué de classe a parlé avec confiance ", textAfter: " tous les élèves rassemblés dans le gymnase.", hint: "devant / sous / entre / sur", answer: "devant" },
      { id: 'p2_12', textBefore: "Toutes les dates importantes du trimestre sont notées ", textAfter: " ce calendrier interactif.", hint: "devant / sous / entre / sur", answer: "sur" },
      { id: 'p2_13', textBefore: "Pendant l'orage de l'après-midi, les marcheurs ont trouvé refuge ", textAfter: " un grand arbre près du sentier.", hint: "devant / sous / entre / sur", answer: "sous" },
      { id: 'p2_14', textBefore: "Les deux amis ont finalement trouvé un bon accord ", textAfter: " eux pour partager les tâches du projet.", hint: "devant / sous / entre / sur", answer: "entre" },
      { id: 'p2_15', textBefore: "Dès le début du cours, l'enseignant a projeté la consigne du jour ", textAfter: " le grand écran de la classe.", hint: "devant / sous / entre / sur", answer: "sur" }
    ]
  },
  {
    id: 'prep_diverses',
    title: 'Activité 3 : Prépositions diverses',
    description: "Complétez chaque phrase avec la préposition appropriée : de (ou d', du, de la, de l', des), par, pour, avec, ou sans.",
    questions: [
      { id: 'p3_1', textBefore: "Les élèves ont préparé une présentation visuelle ", textAfter: " expliquer le roman à la classe.", hint: "de / par / pour / avec / sans", answer: "pour" },
      { id: 'p3_2', textBefore: "Julien a quitté la salle d'étude discrètement ", textAfter: " faire de bruit.", hint: "de / par / pour / avec / sans", answer: "sans" },
      { id: 'p3_3', textBefore: "Cette belle affiche de bienvenue a été dessinée ", textAfter: " un groupe d'élèves de neuvième année.", hint: "de / par / pour / avec / sans", answer: "par" },
      { id: 'p3_4', textBefore: "Avant de commencer notre discussion, nous devons choisir un texte qui parle ", textAfter: " la vie au lycée.", hint: "de / par / pour / avec / sans", answer: "de" },
      { id: 'p3_5', textBefore: "Elle a partagé son opinion ", textAfter: " beaucoup d'enthousiasme et de clarté devant toute la classe.", hint: "de / par / pour / avec / sans", answer: "avec" },
      { id: 'p3_6', textBefore: "Le professeur a posé quelques questions ", textAfter: " vérifier la compréhension du texte.", hint: "de / par / pour / avec / sans", answer: "par" },
      { id: 'p3_7', textBefore: "Il est arrivé au lycée ce matin en retard, ", textAfter: " son sac à dos ni sa trousse.", hint: "de / par / pour / avec / sans", answer: "sans" },
      { id: 'p3_8', textBefore: "Les membres du club de français se réunissent deux fois ", textAfter: " semaine pour pratiquer la conversation.", hint: "de / par / pour / avec / sans", answer: "par" },
      { id: 'p3_9', textBefore: "Nous avons besoin de dictionnaires ", textAfter: " réussir notre exercice d'écriture créative.", hint: "de / par / pour / avec / sans", answer: "pour" },
      { id: 'p3_10', textBefore: "La directrice a remercié les correspondants français ", textAfter: " leur accueil chaleureux lors de la rentrée scolaire.", hint: "de / par / pour / avec / sans", answer: "pour" },
      { id: 'p3_11', textBefore: "Grâce à un travail d'équipe efficace, Marc a fini l'exercice ", textAfter: " l'aide de sa partenaire.", hint: "de / par / pour / avec / sans", answer: "avec" },
      { id: 'p3_12', textBefore: "La plupart ", textAfter: " livres choisis pour le cours sont faciles et intéressants à lire.", hint: "de / par / pour / avec / sans", answer: "des" },
      { id: 'p3_13', textBefore: "On ne peut pas réussir une évaluation difficile ", textAfter: " réviser régulièrement ses leçons.", hint: "de / par / pour / avec / sans", answer: "sans" },
      { id: 'p3_14', textBefore: "Les élèves ont traversé la cour de récréation ", textAfter: " le couloir central pour aller à la cafétéria.", hint: "de / par / pour / avec / sans", answer: "par" },
      { id: 'p3_15', textBefore: "Cette application web a été créée ", textAfter: " aider les élèves d'immersion à pratiquer leur français.", hint: "de / par / pour / avec / sans", answer: "pour" }
    ]
  },
  {
    id: 'writing_prompt',
    title: "Activité 4 : Atelier d'Écriture",
    description: "Entraînez-vous à rédiger au présent et recevez des corrections grammaticales immédiates.",
    questions: []
  },
  // ── Crossword Puzzles ──
  // Rules: every word has a unique number, no two words share a starting cell,
  // crossings happen at interior letters only (never at position 0).
  {
    id: 'crossword_etre_avoir_faire',
    title: 'Mots croisés 1 – Être, Avoir, Faire',
    description: 'Conjuguez les verbes être, avoir et faire au présent pour compléter la grille.',
    type: 'crossword',
    component: CrosswordSection,
    puzzleData: {
      gridRows: 14, gridCols: 8,
      words: [
        // #1 FONT across (2,0) — crosses AVONS at O(2,1)
        { id: 'c1_1', number: 1, direction: 'across', row: 2, col: 0, answer: 'FONT',   clue: 'le présent : ils/faire' },
        // #2 AVONS down (0,1) — crosses FONT at O(2,1)
        { id: 'c1_2', number: 2, direction: 'down',   row: 0, col: 1, answer: 'AVONS',  clue: 'le présent : nous/avoir' },
        // #3 FAIT across (6,4) — crosses SUIS at I(6,6)
        { id: 'c1_3', number: 3, direction: 'across', row: 6, col: 4, answer: 'FAIT',   clue: 'le présent : il/faire' },
        // #4 SUIS down (4,6) — crosses FAIT at I(6,6)
        { id: 'c1_4', number: 4, direction: 'down',   row: 4, col: 6, answer: 'SUIS',   clue: 'le présent : je/être' },
        // #5 SONT across (9,2) — crosses SOMMES at O(9,3)
        { id: 'c1_5', number: 5, direction: 'across', row: 9, col: 2, answer: 'SONT',   clue: 'le présent : ils/être' },
        // #6 SOMMES down (8,3) — crosses SONT at O(9,3), crosses AVEZ at E(12,3)
        { id: 'c1_6', number: 6, direction: 'down',   row: 8, col: 3, answer: 'SOMMES', clue: 'le présent : nous/être' },
        // #7 AVEZ across (12,1) — crosses SOMMES at E(12,3)
        { id: 'c1_7', number: 7, direction: 'across', row: 12, col: 1, answer: 'AVEZ',   clue: 'le présent : vous/avoir' },
      ]
    }
  },
  {
    id: 'crossword_vouloir_pouvoir_devoir_savoir',
    title: 'Mots croisés 2 – Vouloir, Pouvoir, Devoir, Savoir',
    description: 'Conjuguez les verbes vouloir, pouvoir, devoir et savoir au présent.',
    type: 'crossword',
    component: CrosswordSection,
    puzzleData: {
      gridRows: 15, gridCols: 11,
      words: [
        // #1 DEVONS down (0,1) — crosses DOIT at O(3,1)
        { id: 'c2_1', number: 1, direction: 'down',   row: 0, col: 1, answer: 'DEVONS', clue: 'le présent : nous/devoir' },
        // #2 DOIT across (3,0) — crosses DEVONS at O(3,1)
        { id: 'c2_2', number: 2, direction: 'across', row: 3, col: 0, answer: 'DOIT',   clue: 'le présent : il/devoir' },
        // #3 DOIS down (3,7) — crosses SAIT at I(5,7)
        { id: 'c2_3', number: 3, direction: 'down',   row: 3, col: 7, answer: 'DOIS',   clue: 'le présent : tu/devoir' },
        // #4 SAIT across (5,5) — crosses DOIS at I(5,7)
        { id: 'c2_4', number: 4, direction: 'across', row: 5, col: 5, answer: 'SAIT',   clue: 'le présent : il/savoir' },
        // #5 SAVONS down (6,4) — crosses SAIS at A(7,4)
        { id: 'c2_5', number: 5, direction: 'down',   row: 6, col: 4, answer: 'SAVONS', clue: 'le présent : nous/savoir' },
        // #6 SAIS across (7,3) — crosses SAVONS at A(7,4)
        { id: 'c2_6', number: 6, direction: 'across', row: 7, col: 3, answer: 'SAIS',   clue: 'le présent : je/savoir' },
        // #7 POUVEZ down (9,8) — crosses VEUT at U(11,8), crosses PEUX at E(13,8)
        { id: 'c2_7', number: 7, direction: 'down',   row: 9, col: 8, answer: 'POUVEZ', clue: 'le présent : vous/pouvoir' },
        // #8 VEUT across (11,6) — crosses POUVEZ at U(11,8)
        { id: 'c2_8', number: 8, direction: 'across', row: 11, col: 6, answer: 'VEUT',   clue: 'le présent : il/vouloir' },
        // #9 PEUX across (13,7) — crosses POUVEZ at E(13,8)
        { id: 'c2_9', number: 9, direction: 'across', row: 13, col: 7, answer: 'PEUX',   clue: 'le présent : je/pouvoir' },
      ]
    }
  },
  {
    id: 'crossword_venir_prendre',
    title: 'Mots croisés 3 – Venir, Prendre',
    description: 'Conjuguez les verbes venir et prendre au présent pour remplir la grille.',
    type: 'crossword',
    component: CrosswordSection,
    puzzleData: {
      gridRows: 17, gridCols: 7,
      words: [
        // #1 VENEZ down (0,3) — crosses VIENS at N(2,3)
        { id: 'c3_1', number: 1, direction: 'down',   row: 0, col: 3, answer: 'VENEZ',   clue: 'le présent : vous/venir' },
        // #2 VIENT down (1,1) — crosses VIENS at I(2,1)
        { id: 'c3_2', number: 2, direction: 'down',   row: 1, col: 1, answer: 'VIENT',   clue: 'le présent : il/venir' },
        // #3 VIENS across (2,0) — crosses VIENT at I(2,1), crosses VENEZ at N(2,3)
        { id: 'c3_3', number: 3, direction: 'across', row: 2, col: 0, answer: 'VIENS',   clue: 'le présent : je/venir' },
        // #4 PRENDS down (5,5) — crosses PRENEZ at E(7,5)
        { id: 'c3_4', number: 4, direction: 'down',   row: 5, col: 5, answer: 'PRENDS',  clue: 'le présent : tu/prendre' },
        // #5 PRENEZ across (7,1) — crosses PRENDS at E(7,5)
        { id: 'c3_5', number: 5, direction: 'across', row: 7, col: 1, answer: 'PRENEZ',  clue: 'le présent : vous/prendre' },
        // #6 PRENONS down (10,1) — crosses VENONS at E(12,1)
        { id: 'c3_6', number: 6, direction: 'down',   row: 10, col: 1, answer: 'PRENONS', clue: 'le présent : nous/prendre' },
        // #7 VENONS across (12,0) — crosses PRENONS at E(12,1)
        { id: 'c3_7', number: 7, direction: 'across', row: 12, col: 0, answer: 'VENONS',  clue: 'le présent : nous/venir' },
      ]
    }
  },
  {
    id: 'crossword_parler_finir_vendre',
    title: 'Mots croisés 4 – Parler, Finir, Vendre',
    description: 'Conjuguez les verbes parler, finir et vendre au présent.',
    type: 'crossword',
    component: CrosswordSection,
    puzzleData: {
      gridRows: 14, gridCols: 10,
      words: [
        // #1 PARLENT down (0,2) — crosses PARLEZ at R(2,2), crosses VEND at N(5,2)
        { id: 'c4_1', number: 1, direction: 'down',   row: 0, col: 2, answer: 'PARLENT', clue: 'le présent : ils/parler' },
        // #2 PARLEZ across (2,0) — crosses PARLENT at R(2,2)
        { id: 'c4_2', number: 2, direction: 'across', row: 2, col: 0, answer: 'PARLEZ',  clue: 'le présent : vous/parler' },
        // #3 FINIS down (4,6) — crosses FINIT at I(5,6)
        { id: 'c4_3', number: 3, direction: 'down',   row: 4, col: 6, answer: 'FINIS',   clue: 'le présent : tu/finir' },
        // #4 VEND across (5,0) — crosses PARLENT at N(5,2)
        { id: 'c4_4', number: 4, direction: 'across', row: 5, col: 0, answer: 'VEND',    clue: 'le présent : il/vendre' },
        // #5 FINIT across (5,5) — crosses FINIS at I(5,6)
        { id: 'c4_5', number: 5, direction: 'across', row: 5, col: 5, answer: 'FINIT',   clue: 'le présent : il/finir' },
        // #6 PARLE down (8,9) — standalone
        { id: 'c4_6', number: 6, direction: 'down',   row: 8, col: 9, answer: 'PARLE',   clue: 'le présent : je/parler' },
        // #7 VENDS down (9,3) — crosses VENDEZ at E(10,3)
        { id: 'c4_7', number: 7, direction: 'down',   row: 9, col: 3, answer: 'VENDS',   clue: 'le présent : tu/vendre' },
        // #8 VENDEZ across (10,2) — crosses VENDS at E(10,3)
        { id: 'c4_8', number: 8, direction: 'across', row: 10, col: 2, answer: 'VENDEZ',  clue: 'le présent : vous/vendre' },
      ]
    }
  },
];

const UNITE1_PROMPTS = [
  {
    id: 1,
    title: "Votre héros ou héroïne préféré(e) 🦸‍♂️",
    prompt: "Décrivez votre héros ou héroïne préféré(e) (réel ou fictif) au présent. Quelles sont ses qualités morales et ses pouvoirs ?"
  },
  {
    id: 2,
    title: "Le portrait d'un anti-héros 🖤",
    prompt: "Présentez un anti-héros célèbre (de livre ou de film) au présent. Expliquez pourquoi ce personnage est complexe et quelles sont ses faiblesses."
  },
  {
    id: 3,
    title: "Si vous étiez un super-héros ⚡",
    prompt: "Si vous étiez un super-héros, quel serait votre pouvoir spécial ? Décrivez vos actions quotidiennes pour sauver le monde au présent."
  },
  {
    id: 4,
    title: "Le rival ou le méchant 👹",
    prompt: "Décrivez un méchant ou un rival marquant d'une histoire au présent. Quelles sont ses motivations et ses traits de caractère principaux ?"
  }
];

export default function PracticeSection() {
  const { chapterId } = useParams();
  const isReprise = chapterId === 'unite-reprise';
  const isUnite1 = chapterId === 'unite-1';

  const [activeActivityId, setActiveActivityId] = useState('prep_1_4');
  const [activeUnite1Tab, setActiveUnite1Tab] = useState('production_ecrite');
  const [userAnswers, setUserAnswers] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [focusedInputId, setFocusedInputId] = useState(null);

  if (isUnite1) {
    return (
      <div className="practice-section-container fade-in">
        {/* Tab navigation for Unité 1 */}
        <div className="activity-tabs-nav" style={{ gridTemplateColumns: '1fr', maxWidth: '250px' }}>
          <button
            onClick={() => setActiveUnite1Tab('production_ecrite')}
            className={`activity-tab-btn ${activeUnite1Tab === 'production_ecrite' ? 'active' : ''}`}
          >
            Production Écrite
          </button>
        </div>

        <div className="activity-main-card" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
          {activeUnite1Tab === 'production_ecrite' && (
            <WritingPrompt 
              prompts={UNITE1_PROMPTS} 
              title="Atelier d'Écriture : Héros & Anti-Héros 🦸‍♂️"
              subtitle="Rédigez un paragraphe au présent sur les héros et anti-héros et recevez des corrections de grammaire et d'accords immédiates !"
            />
          )}
        </div>
      </div>
    );
  }

  if (!isReprise) {
    return (
      <div className="practice-empty-state">
        <h3>Section d'Exercices</h3>
        <p>Sélectionnez l'unité de reprise pour accéder aux exercices de grammaire interactifs.</p>
      </div>
    );
  }

  if (activeActivityId === 'writing_prompt') {
    return (
      <div className="practice-section-container fade-in">
        {/* 4 Activities tab navigation */}
        <div className="activity-tabs-nav">
          {ACTIVITIES.map(act => (
            <button
              key={act.id}
              onClick={() => {
                setActiveActivityId(act.id);
                setFocusedInputId(null);
              }}
              className={`activity-tab-btn ${activeActivityId === act.id ? 'active' : ''}`}
              style={{ paddingTop: '0.8rem', paddingBottom: '0.8rem' }}
            >
              {act.title}
            </button>
          ))}
        </div>

        <div className="activity-main-card" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
          <WritingPrompt />
        </div>
      </div>
    );
  }

  const currentActivity = ACTIVITIES.find(act => act.id === activeActivityId);

  const handleInputChange = (questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleInsertAccent = (accent) => {
    if (!focusedInputId) return;
    const inputEl = document.getElementById(focusedInputId);
    if (!inputEl) return;

    const start = inputEl.selectionStart || 0;
    const end = inputEl.selectionEnd || 0;
    const currentValue = userAnswers[focusedInputId] || '';
    const newValue = currentValue.substring(0, start) + accent + currentValue.substring(end);

    handleInputChange(focusedInputId, newValue);

    // Keep focus and set cursor position right after the inserted accent
    setTimeout(() => {
      inputEl.focus();
      inputEl.setSelectionRange(start + accent.length, start + accent.length);
    }, 0);
  };

  const handleVerify = (activityId) => {
    const activity = ACTIVITIES.find(act => act.id === activityId);
    if (!activity) return;

    let score = 0;
    const results = {};

    activity.questions.forEach(q => {
      const userVal = (userAnswers[q.id] || '').trim().toLowerCase();
      const expectedVal = q.answer.trim().toLowerCase();
      const isCorrect = userVal === expectedVal;
      if (isCorrect) {
        score++;
      }
      results[q.id] = {
        isCorrect,
        expected: q.answer
      };
    });

    setValidationResults(prev => ({
      ...prev,
      [activityId]: {
        isChecked: true,
        score,
        results
      }
    }));
  };

  const handleReset = (activityId) => {
    const activity = ACTIVITIES.find(act => act.id === activityId);
    if (!activity) return;

    const newUserAnswers = { ...userAnswers };
    activity.questions.forEach(q => {
      delete newUserAnswers[q.id];
    });
    setUserAnswers(newUserAnswers);

    const newValidationResults = { ...validationResults };
    delete newValidationResults[activityId];
    setValidationResults(newValidationResults);

    // Shift focus back to the first question input
    setTimeout(() => {
      const firstInputId = activity.questions[0].id;
      const firstInputEl = document.getElementById(firstInputId);
      if (firstInputEl) {
        firstInputEl.focus();
      }
    }, 50);
  };

  const accentList = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'ù', 'û', 'œ', 'É', 'È', 'À', 'Ç'];

  return (
    <div className="practice-section-container fade-in">
      {/* 3 Activities tab navigation matching standard cards */}
      <div className="activity-tabs-nav">
        {ACTIVITIES.map(act => (
          <button
            key={act.id}
            onClick={() => {
              setActiveActivityId(act.id);
              setFocusedInputId(null);
            }}
            className={`activity-tab-btn ${activeActivityId === act.id ? 'active' : ''}`}
            style={{ paddingTop: '0.8rem', paddingBottom: '0.8rem' }}
          >
            {act.title}
          </button>
        ))}
      </div>

      {/* Main Activity Box */}
      <div className="activity-main-card">
        <div className="activity-header">
          <h4>{currentActivity.title}</h4>
          <p className="activity-desc">{currentActivity.description}</p>
        </div>

        {
  currentActivity.type === 'crossword' && currentActivity.component ? (
    // Render the crossword component, passing puzzleData prop
    <currentActivity.component key={currentActivity.id} puzzleData={currentActivity.puzzleData} />
  ) : (
    <div className="questions-list">
      {currentActivity.questions.map((q, idx) => {
        const valState = validationResults[currentActivity.id];
        const qResult = valState?.results[q.id];
        const isCorrect = qResult?.isCorrect;
        const inputVal = userAnswers[q.id] || '';
        let inputClass = "question-input";
        if (valState?.isChecked) {
          inputClass += isCorrect ? " input-success" : " input-error";
        }
        return (
          <div key={q.id} className="question-item-card">
            <div className="question-content-row">
              <div className="question-number-badge">
                {idx + 1}
              </div>
              <div className="question-text-flow">
                <span className="text-before">{q.textBefore}</span>
                <div className="input-with-feedback-wrapper">
                  <input
                    id={q.id}
                    type="text"
                    value={inputVal}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    onFocus={() => setFocusedInputId(q.id)}
                    className={inputClass}
                    disabled={valState?.isChecked}
                    autoComplete="off"
                  />
                  {valState?.isChecked && (
                    <span className="validation-icon-wrapper">
                      {isCorrect ? (
                        <CheckCircle2 size={16} className="color-success" />
                      ) : (
                        <XCircle size={16} className="color-error" />
                      )}
                    </span>
                  )}
                </div>
                <span className="text-after">{q.textAfter}</span>
                {q.hint && (<span className="question-hint-pill">({q.hint})</span>)}
              </div>
            </div>
            {/* Visual Correction block beneath the field */}
            {valState?.isChecked && !isCorrect && (
              <div className="correction-feedback-row">
                <AlertTriangle size={12} className="color-error-dark" />
                <span>Correction : <strong className="correct-answer-text">{q.answer}</strong></span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  )
}


        {/* Footer controls: validation and score badge */}
        <div className="activity-footer-controls">
          {validationResults[currentActivity.id]?.isChecked ? (
            <div className="activity-results-summary">
              <div className="score-summary-badge">
                <Award size={20} />
                <span>Résultat : {validationResults[currentActivity.id].score} / 20</span>
              </div>
              <button
                onClick={() => handleReset(currentActivity.id)}
                className="control-btn reset-btn"
              >
                <RefreshCw size={16} /> Recommencer
              </button>
            </div>
          ) : (
            <div className="activity-actions-row">
              <button
                onClick={() => handleVerify(currentActivity.id)}
                className="control-btn verify-btn"
              >
                <CheckCircle2 size={16} /> Vérifier mes réponses
              </button>
              <button
                onClick={() => handleReset(currentActivity.id)}
                className="control-btn reset-btn"
              >
                <RefreshCw size={16} /> Réinitialiser
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating accent toolbar */}
      <div className="accent-toolbar-floating">
        <span className="accent-toolbar-label">Accents :</span>
        <div className="accent-buttons-grid">
          {accentList.map(char => (
            <button
              key={char}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleInsertAccent(char)}
              className="accent-char-btn"
            >
              {char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
