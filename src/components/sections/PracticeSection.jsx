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
    id: "imp_vs_pc_1_4",
    title: "Activité 4 : Imparfait vs. Passé Composé — Récits et Coups de Théâtre",
    description: "Complétez chaque phrase en choisissant entre l'imparfait (contexte, description, habitude) et le passé composé (action ponctuelle, soudaine ou délimitée).",
    questions: [
      { id: "ipc_1", textBefore: "Pendant que le justicier ", textAfter: " la forteresse ennemie, l'alarme générale a retenti. (surveiller)", hint: "surveiller (action continue en cours)", answer: "surveillait" },
      { id: "ipc_2", textBefore: "Soudain, une explosion assourdissante ", textAfter: " le silence pesant de la nuit. (briser)", hint: "briser (action soudaine / ponctuelle)", answer: "a brisé" },
      { id: "ipc_3", textBefore: "Il ", textAfter: " un épais manteau sombre quand il s'est glissé parmi la foule. (porter)", hint: "porter (description physique / état)", answer: "portait" },
      { id: "ipc_4", textBefore: "Tandis que nous discutions calmement du plan, notre informateur ", textAfter: " en catastrophe dans la pièce. (entrer)", hint: "entrer (événement qui interrompt)", answer: "est entré" },
      { id: "ipc_5", textBefore: "Autrefois, cet anti-héros ", textAfter: " toujours les conseils avisés de ses aînés avant de prendre un risque. (écouter)", hint: "écouter (habitude passée)", answer: "écoutait" },
      { id: "ipc_6", textBefore: "Dès qu'il a aperçu la détresse des otages, le brave chevalier ", textAfter: " immédiatement son épée. (dégainer)", hint: "dégainer (action précise et rapide)", answer: "a dégainé" },
      { id: "ipc_7", textBefore: "Le vent ", textAfter: " avec violence et rendait toute progression quasi impossible. (souffler)", hint: "souffler (décor / météo d'arrière-plan)", answer: "soufflait" },
      { id: "ipc_8", textBefore: "À cet instant précis, elle ", textAfter: " que son allié le plus fidèle l'avait trahie. (comprendre)", hint: "comprendre (déclic mental / prise de conscience)", answer: "a compris" },
      { id: "ipc_9", textBefore: "Les sentinelles ", textAfter: " profondément lorsque les rebelles ont franchi le rempart sans bruit. (dormir)", hint: "dormir (état continu interrompu)", answer: "dormaient" },
      { id: "ipc_10", textBefore: "Ce jour-là, l'antagoniste ", textAfter: " son véritable visage devant tous les membres de l'assemblée. (dévoiler)", hint: "dévoiler (événement marquant et achevé)", answer: "a dévoilé" },
      { id: "ipc_11", textBefore: "Chaque matin, la guérisseuse ", textAfter: " les blessures des combattants avec patience. (soigner)", hint: "soigner (habitude répétée)", answer: "soignait" },
      { id: "ipc_12", textBefore: "Finalement, après des heures de pourparlers, les deux rivaux ", textAfter: " un pacte historique. (signer)", hint: "signer (conclusion ponctuelle)", answer: "ont signé" }
    ]
  },
  {
    id: "connecteurs_logiques_1_5",
    title: "Activité 5 : Les Connecteurs Logiques — Structurer l'Analyse Héroïque",
    description: "Complétez chaque phrase avec le connecteur logique qui convient le mieux selon la relation exprimée (introduction, ajout, opposition, conséquence ou conclusion).",
    questions: [
      { id: "cl_1", textBefore: "", textAfter: ", il convient de définir les critères moraux qui séparent le héros classique du simple justicier.", hint: "Tout d'abord / Cependant / Ainsi (Introduction)", answer: "Tout d'abord" },
      { id: "cl_2", textBefore: "Ce personnage fait preuve d'un dévouement admirable envers son peuple. ", textAfter: ", il refuse tout privilège ou récompense matérielle.", hint: "De plus / Toutefois / En conclusion (Ajout)", answer: "De plus" },
      { id: "cl_3", textBefore: "Le protagoniste commet des fautes graves tout au long de l'histoire. ", textAfter: ", il conserve la sympathie du public grâce à sa sincérité.", hint: "Néanmoins / En premier lieu / C'est pourquoi (Opposition)", answer: "Néanmoins" },
      { id: "cl_4", textBefore: "L'anti-héros a trahi le pacte secret qui le liait à sa guilde. ", textAfter: ", il doit maintenant affronter seul la colère de ses anciens alliés.", hint: "Par conséquent / En outre / Premièrement (Conséquence)", answer: "Par conséquent" },
      { id: "cl_5", textBefore: "Le guerrier ne possède aucun pouvoir magique ni armure protectrice. ", textAfter: ", son courage et son intelligence tactique suffisent à déjouer le piège.", hint: "Cependant / Également / Donc (Opposition)", answer: "Cependant" },
      { id: "cl_6", textBefore: "Pour analyser cette œuvre, nous examinerons ", textAfter: " la genèse du personnage avant d'étudier son évolution psychologique.", hint: "en premier lieu / par ailleurs / finalement (Introduction)", answer: "en premier lieu" },
      { id: "cl_7", textBefore: "Ce film explore les traumatismes passés du détective. ", textAfter: ", il propose une critique subtile de la justice moderne.", hint: "En outre / C'est pourquoi / Néanmoins (Ajout)", answer: "En outre" },
      { id: "cl_8", textBefore: "Le justicier refuse de blesser un adversaire désarmé ; ", textAfter: ", il incarne un idéal d'honneur chevaleresque très strict.", hint: "ainsi / toutefois / d'abord (Conséquence)", answer: "ainsi" },
      { id: "cl_9", textBefore: "Le héros traditionnel agit pour le bien commun sans la moindre hésitation. ", textAfter: ", l'anti-héros ne s'engage que si sa propre survie est menacée.", hint: "En revanche / Également / Donc (Opposition)", answer: "En revanche" },
      { id: "cl_10", textBefore: "Ses motivations restaient obscures aux yeux des citoyens. ", textAfter: " la police locale a décidé de le placer sous haute surveillance.", hint: "C'est pourquoi / Par ailleurs / Premièrement (Conséquence)", answer: "C'est pourquoi" },
      { id: "cl_11", textBefore: "Les citoyens honorent le dévouement du héros. Ils saluent ", textAfter: " la bravoure des volontaires restés anonymes.", hint: "également / cependant / d'abord (Ajout)", answer: "également" },
      { id: "cl_12", textBefore: "", textAfter: ", l'anti-héros moderne séduit les spectateurs car sa vulnérabilité reflète les contradictions humaines.", hint: "En conclusion / De plus / En premier lieu (Conclusion)", answer: "En conclusion" }
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
