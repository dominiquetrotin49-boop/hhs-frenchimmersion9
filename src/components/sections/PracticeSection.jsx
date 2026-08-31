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
      { id: 'p2_1', textBefore: "Le professeur a posé la pile de nouveaux manuels scolaires ", textAfter: " la table principale.", hint: "sur / sous / devant / entre", answer: "sur" },
      { id: 'p2_2', textBefore: "Les élèves attendent patiemment l'ouverture des portes ", textAfter: " le bâtiment principal.", hint: "sur / sous / devant / entre", answer: "devant" },
      { id: 'p2_3', textBefore: "Mon sac à dos est tombé ", textAfter: " la chaise pendant le cours.", hint: "sur / sous / devant / entre", answer: "sous" },
      { id: 'p2_4', textBefore: "Il y a une excellente ambiance de travail ", textAfter: " tous les élèves de la classe.", hint: "sur / sous / devant / entre", answer: "entre" },
      { id: 'p2_5', textBefore: "L'affiche de bienvenue pour les nouveaux arrivants est affichée ", textAfter: " le mur du couloir.", hint: "sur / sous / devant / entre", answer: "sur" },
      { id: 'p2_6', textBefore: "Nous avons garé nos vélos ", textAfter: " la grille de l'école.", hint: "sur / sous / devant / entre", answer: "devant" },
      { id: 'p2_7', textBefore: "Pendant la pause, nous nous abritons ", textAfter: " le grand préau de la cour.", hint: "sur / sous / devant / entre", answer: "sous" },
      { id: 'p2_8', textBefore: "Pour ce projet, vous devez choisir un sujet ", textAfter: " les trois propositions du professeur.", hint: "sur / sous / devant / entre", answer: "entre" },
      { id: 'p2_9', textBefore: "J'ai écrit toutes les dates d'examens ", textAfter: " mon agenda personnel.", hint: "sur / sous / devant / entre", answer: "sur" },
      { id: 'p2_10', textBefore: "Le groupe de musique des élèves va jouer ", textAfter: " toute l'école vendredi après-midi.", hint: "sur / sous / devant / entre", answer: "devant" },
      { id: 'p2_11', textBefore: "Le chat du gardien dort tranquillement ", textAfter: " le banc de l'entrée.", hint: "sur / sous / devant / entre", answer: "sous" },
      { id: 'p2_12', textBefore: "La salle d'informatique se situe exactement ", textAfter: " la bibliothèque et le laboratoire.", hint: "sur / sous / devant / entre", answer: "entre" },
      { id: 'p2_13', textBefore: "N'oubliez pas d'inscrire votre nom complet ", textAfter: " la première page de la copie.", hint: "sur / sous / devant / entre", answer: "sur" },
      { id: 'p2_14', textBefore: "Tous les délégués de classe se réunissent ", textAfter: " le bureau du proviseur.", hint: "sur / sous / devant / entre", answer: "devant" },
      { id: 'p2_15', textBefore: "Le stylo a roulé et s'est retrouvé caché ", textAfter: " l'armoire du fond.", hint: "sur / sous / devant / entre", answer: "sous" }
    ]
  },
  {
    id: 'prep_diverses',
    title: 'Activité 3 : Prépositions diverses',
    description: "Complétez chaque phrase avec la préposition appropriée : de / d', par, pour, avec, ou sans.",
    questions: [
      { id: 'p3_1', textBefore: "Les élèves ont préparé un diaporama détaillé ", textAfter: " présenter leur projet de rentrée.", hint: "de / par / pour / avec / sans", answer: "pour" },
      { id: 'p3_2', textBefore: "Nous venons tout juste ", textAfter: " terminer la lecture du premier chapitre.", hint: "de / par / pour / avec / sans", answer: "de" },
      { id: 'p3_3', textBefore: "Il est venu en classe ce matin ", textAfter: " ses affaires de sport.", hint: "de / par / pour / avec / sans", answer: "avec" },
      { id: 'p3_4', textBefore: "Ce roman d'aventure a été écrit ", textAfter: " un auteur francophone très célèbre.", hint: "de / par / pour / avec / sans", answer: "par" },
      { id: 'p3_5', textBefore: "Elle a réussi cet exercice difficile ", textAfter: " aucune aide.", hint: "de / par / pour / avec / sans", answer: "sans" },
      { id: 'p3_6', textBefore: "Ce cahier de textes appartient ", textAfter: " la nouvelle déléguée de classe.", hint: "de / par / pour / avec / sans", answer: "de" },
      { id: 'p3_7', textBefore: "Nous devons nous dépêcher ", textAfter: " ne pas rater le bus scolaire.", hint: "de / par / pour / avec / sans", answer: "pour" },
      { id: 'p3_8', textBefore: "Les consignes ont été clairement expliquées ", textAfter: " le professeur d'histoire.", hint: "de / par / pour / avec / sans", answer: "par" },
      { id: 'p3_9', textBefore: "Marc préfère réviser ses leçons ", textAfter: " musique pour mieux se concentrer.", hint: "de / par / pour / avec / sans", answer: "sans" },
      { id: 'p3_10', textBefore: "Lucas discute souvent de ses cours ", textAfter: " sa camarade de table.", hint: "de / par / pour / avec / sans", answer: "avec" },
      { id: 'p3_11', textBefore: "Il a été surpris ", textAfter: " la difficulté du premier devoir sur table.", hint: "de / par / pour / avec / sans", answer: "par" },
      { id: 'p3_12', textBefore: "Merci beaucoup ", textAfter: " votre attention pendant cette présentation.", hint: "de / par / pour / avec / sans", answer: "pour" },
      { id: 'p3_13', textBefore: "Ils ont traversé toute la cour sous la pluie ", textAfter: " parapluie.", hint: "de / par / pour / avec / sans", answer: "sans" },
      { id: 'p3_14', textBefore: "Le professeur de français est très fier ", textAfter: " progrès réalisés par les élèves.", hint: "de / par / pour / avec / sans", answer: "des" },
      { id: 'p3_15', textBefore: "Nous allons étudier ce poème ", id_override: "p3_15", textAfter: " beaucoup d'attention.", hint: "de / par / pour / avec / sans", answer: "avec" }
    ]
  },
  {
    id: 'writing_prompt',
    title: "Activité 4 : Atelier d'Écriture",
    description: "Rédigez un court texte en appliquant les notions de la rentrée."
  },
  {
    id: 'mots_croises',
    title: 'Mots Croisés (7 Grilles)',
    isCrosswordHub: true
  }
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

    setUserAnswers(prev => ({
      ...prev,
      [focusedInputId]: newValue
    }));

    setTimeout(() => {
      inputEl.focus();
      inputEl.setSelectionRange(start + accent.length, start + accent.length);
    }, 0);
  };

  const handleVerify = (activityId) => {
    const activity = ACTIVITIES.find(a => a.id === activityId);
    if (!activity || !activity.questions) return;

    let correctCount = 0;
    const totalQuestions = activity.questions.length;
    const results = {};

    activity.questions.forEach(q => {
      const userAnswer = (userAnswers[q.id] || '').trim().toLowerCase();
      const expectedAnswer = q.answer.trim().toLowerCase();
      const isCorrect = userAnswer === expectedAnswer;
      
      results[q.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    const score = Math.round((correctCount / totalQuestions) * 20);

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
    const activity = ACTIVITIES.find(a => a.id === activityId);
    if (!activity || !activity.questions) return;

    setUserAnswers(prev => {
      const next = { ...prev };
      activity.questions.forEach(q => {
        delete next[q.id];
      });
      return next;
    });

    setValidationResults(prev => {
      const next = { ...prev };
      delete next[activityId];
      return next;
    });
  };

  const accentList = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ç', 'ô', 'î', 'ï', 'œ', '«', '»'];

  return (
    <div className="practice-section-container fade-in">
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

      {activeActivityId === 'writing_prompt' ? (
        <div className="activity-main-card" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
          <WritingPrompt />
        </div>
      ) : activeActivityId === 'mots_croises' ? (
        <div className="activity-main-card glass-panel" style={{ background: 'rgba(15, 23, 42, 0.75)', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <CrosswordSection />
        </div>
      ) : (
        <div className="activity-main-card">
          <div className="activity-card-header">
            <h2>{currentActivity.title}</h2>
            <p className="activity-description">{currentActivity.description}</p>
          </div>

          <div className="questions-list-grid">
            {currentActivity.questions.map((q, idx) => {
              const valState = validationResults[currentActivity.id];
              const isCorrect = valState?.results?.[q.id];
              let statusClass = '';
              if (valState?.isChecked) {
                statusClass = isCorrect ? 'input-correct' : 'input-incorrect';
              }

              return (
                <div key={q.id} className={`question-item-row ${valState?.isChecked ? (isCorrect ? 'row-correct' : 'row-incorrect') : ''}`}>
                  <div className="question-content-wrapper">
                    <span className="question-index-badge">{idx + 1}</span>
                    <div className="question-sentence-flow">
                      <span className="text-before">{q.textBefore}</span>
                      <div className="input-with-feedback-inline">
                        <input
                          id={q.id}
                          type="text"
                          value={userAnswers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          onFocus={() => setFocusedInputId(q.id)}
                          className={`gap-fill-input ${statusClass}`}
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
      )}

      {activeActivityId !== 'writing_prompt' && activeActivityId !== 'mots_croises' && (
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
      )}
    </div>
  );
}
