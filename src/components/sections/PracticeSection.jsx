import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, RefreshCw, XCircle, Award, AlertTriangle } from 'lucide-react';
import './PracticeSection.css';
import WritingPrompt from '../games/WritingPrompt';
import CrosswordSection from './CrosswordSection';

const ACTIVITIES = [
  {
    id: 'mots_croises',
    title: 'Mots Croisés (7 Grilles)',
    isCrosswordHub: true
  },
  {
    id: "imparfait_1_1",
    title: "Activité 1 : L'Imparfait — Portraits et Récits d'Héros",
    description: "Complétez chaque phrase avec le verbe conjugué à l'imparfait pour décrire les traits, habitudes et décors des héros et anti-héros.",
    questions: [
      { id: "imp_1", textBefore: "Dans les récits classiques, le héros ", textAfter: " toujours un courage exceptionnel face à l'injustice.", hint: "manifester (3e pers. sing.)", answer: "manifestait" },
      { id: "imp_2", textBefore: "L'anti-héros, quant à lui, ", textAfter: " souvent de nombreux défauts et des doutes constants.", hint: "avoir (3e pers. sing.)", answer: "avait" },
      { id: "imp_3", textBefore: "Quand nous étions plus jeunes, nous ", textAfter: " passionnément ces personnages aux motivations complexes.", hint: "admirer (1re pers. plur.)", answer: "admirions" },
      { id: "imp_4", textBefore: "Chaque soir, le justicier ", textAfter: " les ruelles sombres pour protéger les citoyens innocents.", hint: "parcourir (3e pers. sing.)", answer: "parcourait" },
      { id: "imp_5", textBefore: "Vous ", textAfter: " toujours que les faiblesses morales rendaient le protagoniste plus humain.", hint: "penser (2e pers. plur.)", answer: "pensiez" },
      { id: "imp_6", textBefore: "Bien qu'il paraisse distant, il ", textAfter: " secrètement à sauver ses compagnons captifs.", hint: "chercher (3e pers. sing.)", answer: "cherchait" },
      { id: "imp_7", textBefore: "Les antagonistes ", textAfter: " la peur partout où ils passaient à travers la cité.", hint: "semer (3e pers. plur.)", answer: "semaient" },
      { id: "imp_8", textBefore: "En secret, je ", textAfter: " la véritable identité cachée derrière son masque protecteur.", hint: "connaître (1re pers. sing.)", answer: "connaissais" },
      { id: "imp_9", textBefore: "Face aux épreuves tragiques, elle ne ", textAfter: " jamais espoir de triompher.", hint: "perdre (3e pers. sing.)", answer: "perdait" },
      { id: "imp_10", textBefore: "Autrefois, ces deux rivaux ", textAfter: " une profonde amitié avant que le destin ne les sépare.", hint: "partager (3e pers. plur.)", answer: "partageaient" },
      { id: "imp_11", textBefore: "Pendant sa jeunesse solitaire, l'anti-héros ", textAfter: " souvent ses émotions par peur d'être trahi.", hint: "dissimuler (3e pers. sing.)", answer: "dissimulait" },
      { id: "imp_12", textBefore: "Est-ce que vous ", textAfter: " le danger auquel ce justicier solitaire s'exposait chaque nuit ?", hint: "comprendre (2e pers. plur.)", answer: "compreniez" }
    ]
  },
  {
    id: "pc_avoir_1_2",
    title: "Activité 2 : Le Passé Composé avec Avoir — Exploits et Dilemmes",
    description: "Complétez chaque phrase en conjuguant le verbe entre parenthèses au passé composé avec l'auxiliaire avoir.",
    questions: [
      { id: "pc_1", textBefore: "Hier soir, le protagoniste ", textAfter: " un plan audacieux pour secourir les villageois.", hint: "concevoir", answer: "a conçu" },
      { id: "pc_2", textBefore: "Malgré ses erreurs passées, l'anti-héros ", textAfter: " le courage de réparer ses torts.", hint: "trouver", answer: "a trouvé" },
      { id: "pc_3", textBefore: "Les citoyens ", textAfter: " un hommage solennel à leur protecteur masqué.", hint: "rendre", answer: "ont rendu" },
      { id: "pc_4", textBefore: "Au cours de sa quête périlleuse, elle ", textAfter: " d'immenses obstacles avec détermination.", hint: "surmonter", answer: "a surmonté" },
      { id: "pc_5", textBefore: "Nous ", textAfter: " la véritable raison pour laquelle ce justicier agissait dans l'ombre.", hint: "découvrir", answer: "avons découvert" },
      { id: "pc_6", textBefore: "Sous la pression de ses ennemis, le rival ", textAfter: " une grave imprudence.", hint: "commettre", answer: "a commis" },
      { id: "pc_7", textBefore: "Est-ce que vous ", textAfter: " le message crypté laissé par le détective sur les lieux ?", hint: "déchiffrer", answer: "avez déchiffré" },
      { id: "pc_8", textBefore: "À cet instant critique, j'", textAfter: " immédiatement le danger qui menaçait notre groupe.", hint: "percevoir", answer: "ai perçu" },
      { id: "pc_9", textBefore: "Pour protéger son allié blessé, il ", textAfter: " l'attaque d'une force impressionnante.", hint: "repousser", answer: "a repoussé" },
      { id: "pc_10", textBefore: "Les journalistes ", textAfter: " toute la lumière sur les agissements de cette organisation secrète.", hint: "faire", answer: "ont fait" },
      { id: "pc_11", textBefore: "Face à ce dilemme moral complexe, tu ", textAfter: " le choix le plus difficile mais le plus juste.", hint: "choisir", answer: "as choisi" },
      { id: "pc_12", textBefore: "Au dénouement du récit, ces deux adversaires ", textAfter: " une trêve inattendue pour sauver la ville.", hint: "conclure", answer: "ont conclu" }
    ]
  },
  {
    id: "pc_etre_1_3",
    title: "Activité 3 : Le Passé Composé avec Être — Trajets et Destins Héroïques",
    description: "Complétez chaque phrase en conjuguant le verbe entre parenthèses au passé composé avec l'auxiliaire être. Attention aux accords !",
    questions: [
      { id: "pce_1", textBefore: "Dès l'aube, l'héroïne ", textAfter: " au sommet de la tour de garde pour observer les alentours.", hint: "monter (fém. sing.)", answer: "est montée" },
      { id: "pce_2", textBefore: "Après cette éprouvante bataille nocturne, les guerriers ", textAfter: " sains et saufs au campement.", hint: "retourner (masc. plur.)", answer: "sont retournés" },
      { id: "pce_3", textBefore: "Le messager masqué ", textAfter: " à toute allure pour avertir le conseil du danger imminent.", hint: "venir (masc. sing.)", answer: "est venu" },
      { id: "pce_4", textBefore: "Les deux complices ", textAfter: " dans l'ombre des catacombes dès l'arrivée des gardes.", hint: "partir (masc. plur.)", answer: "sont partis" },
      { id: "pce_5", textBefore: "Traqué par ses rivaux, l'anti-héros ", textAfter: " caché dans une vieille grange abandonnée.", hint: "rester (masc. sing.)", answer: "est resté" },
      { id: "pce_6", textBefore: "Poussée par son devoir de justice, la jeune chevalière ", textAfter: " au secours des villageois sans hésiter.", hint: "aller (fém. sing.)", answer: "est allée" },
      { id: "pce_7", textBefore: "En tentant de franchir le ravin brumeux, le traître ", textAfter: " dans le vide.", hint: "tomber (masc. sing.)", answer: "est tombé" },
      { id: "pce_8", textBefore: "Nous, les protectrices de la cité, ", textAfter: " à la forteresse avant la tombée de la nuit.", hint: "arriver (fém. plur.)", answer: "sommes arrivées" },
      { id: "pce_9", textBefore: "Au fil de ces périls constants, une légende inoubliable ", textAfter: " dans le cœur du peuple.", hint: "naître (fém. sing.)", answer: "est née" },
      { id: "pce_10", textBefore: "Lorsque l'alarme a retenti, les sentinelles ", textAfter: " immédiatement de leur poste.", hint: "sortir (fém. plur.)", answer: "sont sorties" },
      { id: "pce_11", textBefore: "Blessé au cours de l'embuscade, le brave capitaine ", textAfter: " dans les bras de ses fidèles compagnons.", hint: "mourir (masc. sing.)", answer: "est mort" },
      { id: "pce_12", textBefore: "Après de longues années d'exil solitaire, vous ", textAfter: " parmi les vôtres pour réclamer justice.", hint: "revenir (masc. plur.)", answer: "êtes revenus" }
    ]
  },
  {
    id: "routine_matinale",
    title: "Activité 4 : Ma routine matinale vs. Ta routine",
    description: "Complète chaque phrase avec la forme correcte du verbe pronominal entre parenthèses au présent de l'indicatif. Fais attention au pronom réfléchi (me / m' ou te / t') et aux terminaisons.",
    questions: [
      {
        id: "rm_1",
        textBefore: "Chaque matin d'école, je ",
        textAfter: " dès que mon réveil sonne à six heures et demie.",
        hint: "se lever",
        answer: "me lève"
      },
      {
        id: "rm_2",
        textBefore: "Et toi, à quelle heure est-ce que tu ",
        textAfter: " d'habitude ?",
        hint: "se lever",
        answer: "te lèves"
      },
      {
        id: "rm_3",
        textBefore: "D'abord, je vais dans la salle de bain et je ",
        textAfter: " le visage avec de l'eau bien fraîche.",
        hint: "se laver",
        answer: "me lave"
      },
      {
        id: "rm_4",
        textBefore: "Est-ce que tu ",
        textAfter: " les cheveux sous la douche le matin ou le soir ?",
        hint: "se laver",
        answer: "te laves"
      },
      {
        id: "rm_5",
        textBefore: "Après la douche, je ",
        textAfter: " les dents pendant au moins deux minutes.",
        hint: "se brosser",
        answer: "me brosse"
      },
      {
        id: "rm_6",
        textBefore: "Tu ",
        textAfter: " aussi les dents avant de prendre ton petit-déjeuner ?",
        hint: "se brosser",
        answer: "te brosses"
      },
      {
        id: "rm_7",
        textBefore: "Ensuite, je retourne dans ma chambre et je ",
        textAfter: " rapidement avec mon jean préféré.",
        hint: "s'habiller",
        answer: "m'habille"
      },
      {
        id: "rm_8",
        textBefore: "Dis-moi, tu ",
        textAfter: " chaudement quand il commence à faire froid dehors ?",
        hint: "s'habiller",
        answer: "t'habilles"
      },
      {
        id: "rm_9",
        textBefore: "Quand nous avons un cours d'éducation physique, je ",
        textAfter: " un sac de sport avec mes baskets.",
        hint: "se préparer",
        answer: "me prépare"
      },
      {
        id: "rm_10",
        textBefore: "Tu ",
        textAfter: " toujours la veille au soir pour ne pas être en retard le matin ?",
        hint: "se préparer",
        answer: "te prépares"
      },
      {
        id: "rm_11",
        textBefore: "Vers sept heures et quart, je ",
        textAfter: " à partir pour prendre le bus scolaire.",
        hint: "se préparer",
        answer: "me prépare"
      },
      {
        id: "rm_12",
        textBefore: "Si tu ",
        textAfter: " vite, tu seras prêt à l'heure pour le premier cours !",
        hint: "s'habiller (ou se dépêcher)",
        answer: "t'habilles"
      }
    ]
  },
  {
    id: "routine_weekend_negation",
    title: "Activité 5 : La routine du week-end (La forme négative)",
    description: "Rappel : Sujet + ne / n' + pronom réfléchi + verbe + pas (Ex : Je ne me réveille pas tôt). Complète chaque phrase avec la forme négative au présent du verbe pronominal entre parenthèses.",
    questions: [
      {
        id: "rwn_1",
        textBefore: "Le samedi matin, je ",
        textAfter: " avant dix heures.",
        hint: "se lever",
        answer: "ne me lève pas"
      },
      {
        id: "rwn_2",
        textBefore: "Pourquoi est-ce que tu ",
        textAfter: " quand ton réveil sonne ?",
        hint: "se lever",
        answer: "ne te lèves pas"
      },
      {
        id: "rwn_3",
        textBefore: "Quand j'ai congé, je ",
        textAfter: " en vitesse ; je prends tout mon temps.",
        hint: "se préparer",
        answer: "ne me prépare pas"
      },
      {
        id: "rwn_4",
        textBefore: "Tu ",
        textAfter: " pour aller au match de soccer ce matin ?",
        hint: "se préparer",
        answer: "ne te prépares pas"
      },
      {
        id: "rwn_5",
        textBefore: "Si je reste à la maison toute la journée, je ",
        textAfter: " en vêtements chics ; je garde mon pyjama !",
        hint: "s'habiller",
        answer: "ne m'habille pas"
      },
      {
        id: "rwn_6",
        textBefore: "Tu ",
        textAfter: " avec ton manteau d'hiver alors qu'il fait très froid ?",
        hint: "s'habiller",
        answer: "ne t'habilles pas"
      },
      {
        id: "rwn_7",
        textBefore: "Je suis distrait : parfois, le soir, je ",
        textAfter: " les dents avant d'avoir fini mon dessert.",
        hint: "se brosser",
        answer: "ne me brosse pas"
      },
      {
        id: "rwn_8",
        textBefore: "Est-ce vrai que tu ",
        textAfter: " les cheveux quand ils sont encore mouillés ?",
        hint: "se brosser",
        answer: "ne te brosses pas"
      },
      {
        id: "rwn_9",
        textBefore: "Je ",
        textAfter: " le visage avec du savon trop agressif pour la peau.",
        hint: "se laver",
        answer: "ne me lave pas"
      },
      {
        id: "rwn_10",
        textBefore: "Tu as l'air fatigué : tu ",
        textAfter: " les mains à l'eau froide pour te réveiller ?",
        hint: "se laver",
        answer: "ne te laves pas"
      },
      {
        id: "rwn_11",
        textBefore: "Quand je n'ai pas de devoirs, je ",
        textAfter: " d'avance pour le lundi matin.",
        hint: "se préparer",
        answer: "ne me prépare pas"
      },
      {
        id: "rwn_12",
        textBefore: "C'est le week-end, alors tu ",
        textAfter: " avec ta tenue d'école !",
        hint: "s'habiller",
        answer: "ne t'habilles pas"
      }
    ]
  },
  {
    id: "writing_prompt",
    title: "Activité 6 : Atelier d'Écriture",
    description: "Rédigez un court texte en appliquant les notions de la rentrée."
  }
];

export default function PracticeSection() {
  const { chapterId } = useParams();
  const isReprise = !chapterId || chapterId === 'unite-reprise';
  const [activeActivityId, setActiveActivityId] = useState('mots_croises');
  const [userAnswers, setUserAnswers] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [focusedInputId, setFocusedInputId] = useState(null);

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

      {activeActivityId === 'mots_croises' ? (
        <div style={{ width: '100%' }}>
          <CrosswordSection />
        </div>
      ) : activeActivityId === 'writing_prompt' ? (
        <div className="activity-main-card" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
          <WritingPrompt />
        </div>
      ) : (
        <div className="activity-main-card">
          <div className="activity-card-header">
            <h2>{currentActivity?.title}</h2>
            <p className="activity-description">{currentActivity?.description}</p>
          </div>

          <div className="questions-list-grid">
            {currentActivity?.questions?.map((q, idx) => {
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
            {validationResults[currentActivity?.id]?.isChecked ? (
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
                  <CheckCircle2 size={16} /> Vérification
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
