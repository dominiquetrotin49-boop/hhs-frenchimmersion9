import React, { useState } from 'react';
import { speakFrench } from "../../utils/speechUtils";
import { Volume2, SpellCheck, CheckCircle2, AlertTriangle, XCircle, Sparkles, Award, Gamepad2 } from 'lucide-react';
import GameSection from './GameSection';
import './VocabularySection.css';

const CLARIFICATION_QUESTIONS = [
  {
    term: "Pourriez-vous répéter cela plus lentement, s'il vous plaît ?",
    definition: "Demander de répéter une phrase ou une explication.",
    english: "Could you repeat that more slowly, please?",
    audioUrl: "/audio/clarifications/repeter_lentement.wav"
  },
  {
    term: "Qu'est-ce que vous entendez par là ?",
    definition: "Demander une clarification sur une idée ou un concept.",
    english: "What do you mean by that?",
    audioUrl: "/audio/clarifications/entendez_par_la.wav"
  },
  {
    term: "Quelle est la différence entre ces deux expressions ?",
    definition: "Clarifier l'usage de deux mots similaires.",
    english: "What is the difference between these two expressions?",
    audioUrl: "/audio/clarifications/difference_expressions.wav"
  },
  {
    term: "Est-ce que vous pouvez donner un exemple concret ?",
    definition: "Demander un exemple pratique ou d'application.",
    english: "Can you give a concrete example?",
    audioUrl: "/audio/clarifications/exemple_concret.wav"
  },
  {
    term: "Est-ce correct de dire « ... » ou y a-t-il une meilleure façon de l'exprimer ?",
    definition: "Valider une formulation personnelle.",
    english: "Is it correct to say '...' or is there a better way to express it?",
    audioUrl: "/audio/clarifications/correct_de_dire.wav"
  },
  {
    term: "Je ne suis pas sûr(e) de comprendre la nuance. Pouvez-vous m'expliquer ?",
    definition: "Exprimer une incompréhension partielle.",
    english: "I'm not sure I understand the nuance. Can you explain?",
    audioUrl: "/audio/clarifications/comprendre_nuance.wav"
  },
  {
    term: "Comment dit-on « ... » en français ?",
    definition: "Demander la traduction d'un mot anglais.",
    english: "How do you say '...' in French?",
    audioUrl: "/audio/clarifications/comment_dit_on.wav"
  },
  {
    term: "Pardon, je n'ai pas bien compris la consigne. Que devons-nous faire ?",
    definition: "Demander une explication sur les instructions d'un travail.",
    english: "Sorry, I didn't quite understand the instructions. What are we supposed to do?",
    audioUrl: "/audio/clarifications/compris_consigne.wav"
  },
  {
    term: "Est-ce que cette préposition est obligatoire dans ce cas-là ?",
    definition: "Poser une question sur une règle de préposition.",
    english: "Is this preposition mandatory in this case?",
    audioUrl: "/audio/clarifications/preposition_obligatoire.wav"
  },
  {
    term: "Est-ce que ce verbe change de sens si on utilise une autre préposition ?",
    definition: "Vérifier l'impact d'une préposition sur le sens d'un verbe.",
    english: "Does this verb change meaning if we use a different preposition?",
    audioUrl: "/audio/clarifications/verbe_change_sens.wav"
  }
];

function VocabularySection({ data, chapterId }) {
  // State for the secondary header tab inside Vocabulary (defaults to 'prononciation')
  const [activeHeaderTab, setActiveHeaderTab] = useState('prononciation');

  // State for Orthographe practice input
  const [userSpellings, setUserSpellings] = useState({});
  const [spellingStatus, setSpellingStatus] = useState({}); // 'correct' | 'accent-error' | 'spelling-error'

  const frenchAccents = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'ù', 'û', 'œ'];

  if (!data || data.length === 0) {
    return <div className="empty-state">Aucun mot de vocabulaire disponible.</div>;
  }

  // Insert French accent directly into a specific word card's input
  const handleInsertAccentWord = (index, accent) => {
    const currentText = userSpellings[index] || '';
    const updatedText = currentText + accent;
    setUserSpellings(prev => ({
      ...prev,
      [index]: updatedText
    }));
    verifySpelling(index, updatedText, data[index].term);
  };

  // Helper to remove diacritics / accents for comparison
  const stripAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Case-insensitive & accent-aware verification logic
  const verifySpelling = (index, inputVal, targetTerm) => {
    const inputClean = (inputVal || '').trim().toLowerCase();
    const targetClean = (targetTerm || '').trim().toLowerCase();
    const targetSimplified = targetClean
      .replace(/\(e\)/g, 'e')
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!inputClean) {
      setSpellingStatus(prev => ({ ...prev, [index]: null }));
      return;
    }

    // 1. Exact match (case-insensitive, with or without grammatical tags)
    if (inputClean === targetClean || inputClean === targetSimplified) {
      setSpellingStatus(prev => ({ ...prev, [index]: 'correct' }));
      return;
    }

    // 2. Check if equal when ignoring accents
    if (
      stripAccents(inputClean) === stripAccents(targetClean) ||
      stripAccents(inputClean) === stripAccents(targetSimplified)
    ) {
      setSpellingStatus(prev => ({ ...prev, [index]: 'accent-error' }));
      return;
    }

    // 3. Otherwise spelling error
    setSpellingStatus(prev => ({ ...prev, [index]: 'spelling-error' }));
  };

  const handleInputChange = (index, value, targetTerm) => {
    setUserSpellings(prev => ({ ...prev, [index]: value }));
    verifySpelling(index, value, targetTerm);
  };

  const correctCount = Object.values(spellingStatus).filter(status => status === 'correct').length;

  return (
    <div className="practice-header-container fade-in text-left">
      
      {/* Secondary Header Tab Bar */}
      <div className="section-navigation grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        {/* Tab 1: Prononciation & Audio */}
        <div 
          onClick={() => setActiveHeaderTab('prononciation')}
          className={`section-card cursor-pointer hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg transition-all ${activeHeaderTab === 'prononciation' ? 'active' : ''}`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge vocab-badge bg-indigo-50 text-indigo-600 p-3 rounded-2xl"><Volume2 size={26} /></div>
          <h3 className="font-bold tracking-tight text-slate-900">Prononciation &amp; Audio</h3>
        </div>

        {/* Tab 2: Dictée & Orthographe */}
        <div 
          onClick={() => setActiveHeaderTab('orthographe')}
          className={`section-card cursor-pointer hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg transition-all ${activeHeaderTab === 'orthographe' ? 'active' : ''}`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge practice-badge bg-indigo-50 text-indigo-600 p-3 rounded-2xl"><SpellCheck size={26} /></div>
          <h3 className="font-bold tracking-tight text-slate-900">Dictée &amp; Orthographe</h3>
        </div>

        {/* Tab 3: Cartes mémoire & Quiz */}
        <div 
          onClick={() => setActiveHeaderTab('flashcard_practice')}
          className={`section-card cursor-pointer hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg transition-all ${activeHeaderTab === 'flashcard_practice' ? 'active' : ''}`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge game-badge bg-indigo-50 text-indigo-600 p-3 rounded-2xl"><Sparkles size={26} /></div>
          <h3 className="font-bold tracking-tight text-slate-900">Cartes mémoire &amp; Quiz</h3>
        </div>

      </div>


      {/* Frame 1: Prononciation Activity */}
      {activeHeaderTab === 'prononciation' && (
        <div className="section-container glass-container fade-in">
          
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4 flex-wrap gap-2">
            <h3 className="font-bold tracking-tight text-slate-900 text-lg flex items-center gap-2.5">
              <Volume2 size={20} className="text-indigo-600" />
              Activité de Prononciation du Vocabulaire ({
                chapterId === 'unite-reprise' 
                  ? 'Reprise' 
                  : chapterId === 'unite-2' 
                  ? 'Unité 2' 
                  : chapterId === 'unite-3' 
                  ? 'Unité 3' 
                  : chapterId === 'unite-4' 
                  ? 'Unité 4' 
                  : 'Unité 1'
              })
            </h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3.5 py-1.5 rounded-full border border-indigo-200">
              Voix Authentiques &amp; Synthèse Vocale
            </span>
          </div>

          <div className="vocab-grid">
            {data.map((item, index) => (
              <div key={index} className="vocab-card">
                <div>
                  <div className="vocab-term">{item.term}</div>
                  <div className="vocab-def leading-relaxed">{item.definition}</div>
                  {item.english && (
                    <div className="english-sub-badge text-indigo-700 bg-indigo-50 py-1 px-3 rounded-full inline-block mt-3 text-xs font-semibold border border-indigo-200">
                      Anglais : {item.english}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '1.15rem' }}>
                  <button 
                    type="button"
                    onClick={() => speakFrench(item.term, { audioUrl: item.audioUrl })} 
                    className="audio-btn"
                    title="Écouter la prononciation authentique"
                  >
                    <Volume2 size={16} /> Prononcer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Section: Questions de Clarification */}
          <div className="clarification-section mt-8 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3 flex-wrap gap-2">
              <h4 className="font-bold tracking-tight text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={18} />
                🙋‍♀️ Questions de Clarification &amp; Outils de Communication
              </h4>
              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
                Niveau : Intermédiaire-Mid
              </span>
            </div>
            
            <p className="text-xs text-slate-600 font-medium mb-5 leading-relaxed">
              Voici des expressions indispensables pour demander de l'aide, solliciter des répétitions, ou poser des questions grammaticales à ton enseignant(e). Écoute leur prononciation pour t'entraîner à les utiliser en classe !
            </p>

            <div className="vocab-grid">
              {CLARIFICATION_QUESTIONS.map((item, index) => (
                <div key={index} className="vocab-card">
                  <div>
                    <div className="vocab-term font-bold text-slate-900 text-sm leading-relaxed">{item.term}</div>
                    <div className="vocab-def text-xs text-slate-500 mt-1 leading-relaxed">{item.definition}</div>
                    <div className="english-sub-badge text-indigo-700 bg-indigo-50 py-1 px-2.5 rounded-full inline-block mt-2.5 text-[11px] font-semibold border border-indigo-200">
                      Anglais : {item.english}
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <button 
                      type="button"
                      onClick={() => speakFrench(item.term, { audioUrl: item.audioUrl })} 
                      className="audio-btn"
                      title="Écouter la prononciation authentique"
                    >
                      <Volume2 size={16} /> Prononcer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Frame 2: Orthographe & Dictée Activity */}
      {activeHeaderTab === 'orthographe' && (
        <div className="orthographe-disney-container fade-in">
          
          {/* Activity Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-bold tracking-tight text-xl text-slate-900 flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={22} />
                L'Atelier d'Orthographe &amp; Dictée Interactive
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                Écoutez l'audio authentique de chaque mot et rédigez son orthographe exacte en français.
              </p>
            </div>

            {/* Gamified Mastery Badge */}
            <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 flex-shrink-0">
              <Award size={16} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-800">
                Mots maîtrisés : {correctCount} / {data.length}
              </span>
            </div>
          </div>

          {/* Grid of Spelling Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item, index) => {
              const status = spellingStatus[index];

              return (
                <div key={index} className="ortho-card-disney flex flex-col justify-between">
                  <div>
                    {/* Top Row: Word Number & Audio Trigger */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                        Mot {index + 1}
                      </span>

                      {/* Uses the exact same audio as Prononciation section */}
                      <button
                        type="button"
                        onClick={() => speakFrench(item.term, { audioUrl: item.audioUrl })}
                        className="audio-btn"
                      >
                        <Volume2 size={15} /> Écouter la dictée
                      </button>
                    </div>

                    {/* Definition & English Hint */}
                    <p className="text-xs font-medium text-slate-700 leading-relaxed mb-1.5">
                      <strong className="text-slate-900 font-bold">Définition :</strong> {item.definition}
                    </p>
                    {item.english && (
                      <p className="text-[11px] font-semibold text-indigo-600 mb-2">
                        Indice Anglais : {item.english}
                      </p>
                    )}
                  </div>

                  {/* Input Field & Embedded French Accent Keyboard Right Above Input */}
                  <div className="mt-2 pt-3 border-t border-slate-200">
                    
                    {/* ACCENTS BAR ACCESSIBLE FOR EVERY WORD */}
                    <div className="flex items-center gap-1 flex-wrap mb-2.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 mr-1 uppercase tracking-wider">Accents :</span>
                      {frenchAccents.map((acc, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => handleInsertAccentWord(index, acc)}
                          className="accent-btn bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 transition-transform"
                          title={`Insérer ${acc}`}
                        >
                          {acc}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={userSpellings[index] || ''}
                      onChange={(e) => handleInputChange(index, e.target.value, item.term)}
                      placeholder="Écoutez l'audio et tapez le mot en français..."
                      className={`ortho-input-disney ${
                        status === 'correct'
                          ? 'correct'
                          : status === 'accent-error'
                          ? 'accent-error'
                          : status === 'spelling-error'
                          ? 'spelling-error'
                          : ''
                      }`}
                    />

                    {/* Seamless Animated Feedback Banners */}
                    {status === 'correct' && (
                      <div className="mt-2.5 text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 fade-in">
                        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                        <span>Parfait ! Orthographe impeccable : "{item.term}"</span>
                      </div>
                    )}

                    {status === 'accent-error' && (
                      <div className="mt-2.5 text-xs font-bold text-amber-800 flex items-center gap-1.5 bg-amber-50 p-2.5 rounded-xl border border-amber-200 fade-in">
                        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
                        <span>Attention aux accents ! Terme exact : <strong className="text-amber-950 underline">{item.term}</strong></span>
                      </div>
                    )}

                    {status === 'spelling-error' && (
                      <div className="mt-2.5 text-xs font-semibold text-rose-800 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-200 fade-in">
                        <XCircle size={16} className="text-rose-600 flex-shrink-0" />
                        <span>Orthographe incorrecte. Réécoutez l'audio et vérifiez les lettres.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Frame 3: Cartes mémoire & Quiz */}
      {activeHeaderTab === 'flashcard_practice' && (
        <GameSection chapterId={chapterId} vocabulary={data} initialMode="menu" />
      )}


    </div>
  );
}

export default VocabularySection;
