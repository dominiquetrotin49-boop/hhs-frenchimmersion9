import React, { useState } from 'react';
import { speakFrench } from '../../utils/speechUtils';
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
  // State for the secondary header tab inside Practice (null by default)
  const [activeHeaderTab, setActiveHeaderTab] = useState(null);

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

    if (!inputClean) {
      setSpellingStatus(prev => ({ ...prev, [index]: null }));
      return;
    }

    // 1. Exact match (case-insensitive - ignores capitals at the beginning)
    if (inputClean === targetClean) {
      setSpellingStatus(prev => ({ ...prev, [index]: 'correct' }));
      return;
    }

    // 2. Check if equal when ignoring accents
    if (stripAccents(inputClean) === stripAccents(targetClean)) {
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
      
      {/* Secondary Header Tab Bar matching exact 3-column grid layout, size, shape, and structure of top header tabs */}
      <div className="section-navigation grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        {/* Header Tab 1: Prononciation (Aligned on left) */}
        <div 
          onClick={() => setActiveHeaderTab(activeHeaderTab === 'prononciation' ? null : 'prononciation')}
          className={`section-card cursor-pointer ${
            activeHeaderTab === 'prononciation' ? 'active' : ''
          }`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge vocab-badge">
            <Volume2 size={28} />
          </div>
          <h3>Prononciation</h3>
        </div>

        {/* Header Tab 2: Orthographe (Next to Prononciation) */}
        <div 
          onClick={() => setActiveHeaderTab(activeHeaderTab === 'orthographe' ? null : 'orthographe')}
          className={`section-card cursor-pointer ${
            activeHeaderTab === 'orthographe' ? 'active' : ''
          }`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge practice-badge">
            <SpellCheck size={28} />
          </div>
          <h3>Orthographe</h3>
        </div>

        {/* Header Tab 3: Flashcard Practice */}
        <div 
          onClick={() => setActiveHeaderTab(activeHeaderTab === 'flashcard_practice' ? null : 'flashcard_practice')}
          className={`section-card cursor-pointer ${
            activeHeaderTab === 'flashcard_practice' ? 'active' : ''
          }`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge game-badge">
            <Gamepad2 size={28} />
          </div>
          <h3>{chapterId === 'unite-reprise' ? 'Jeux' : 'Flashcard Practice'}</h3>
        </div>

      </div>

      {/* Frame 1: Prononciation Activity */}
      {activeHeaderTab === 'prononciation' && (
        <div className="section-container glass-container fade-in">
          
          <div className="flex items-center justify-between mb-4 border-b border-cyan-100 pb-3">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Volume2 size={20} className="text-cyan-600" />
              Activité de Prononciation du Vocabulaire ({chapterId === 'unite-reprise' ? 'Reprise' : 'Unité 1'})
            </h3>
            <span className="text-xs bg-cyan-100 text-cyan-950 font-bold px-3 py-1 rounded-full border border-cyan-300">
              Voix Authentiques & Synthèse Vocale
            </span>
          </div>

          <div className="vocab-grid">
            {data.map((item, index) => (
              <div key={index} className="vocab-card">
                <div>
                  <div className="vocab-term">{item.term}</div>
                  <div className="vocab-def">{item.definition}</div>
                  {item.english && (
                    <div className="english-sub-badge text-cyan-900 bg-white/90 py-1.5 px-3 rounded-full inline-block mt-2.5 text-xs font-bold border border-cyan-200 shadow-sm">
                      Anglais: {item.english}
                    </div>
                  )}
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

          {/* New Section: Questions de Clarification */}
          <div className="clarification-section mt-8 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-cyan-100 pb-3">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="text-cyan-600" size={18} />
                🙋‍♀️ Questions de Clarification & Outils de Communication
              </h4>
              <span className="text-xs bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-full border border-amber-300">
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
                    <div className="vocab-def text-xs text-slate-500 mt-1">{item.definition}</div>
                    <div className="english-sub-badge text-cyan-900 bg-white/90 py-1 px-2.5 rounded-full inline-block mt-2.5 text-[11px] font-bold border border-cyan-100 shadow-2xs">
                      Anglais: {item.english}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-400/30">
            <div>
              <h3 className="font-black text-xl text-white flex items-center gap-2">
                <Sparkles className="text-amber-400" size={22} />
                L'Atelier d'Orthographe & Dictée Enchantée
              </h3>
              <p className="text-xs text-amber-200/80 font-medium mt-0.5">
                Écoutez l'audio authentique de chaque mot et rédigez son orthographe exacte en français.
              </p>
            </div>

            {/* Gamified Mastery Badge */}
            <div className="flex items-center gap-2 bg-amber-400/20 px-3.5 py-1.5 rounded-full border border-amber-400/50 flex-shrink-0">
              <Award size={16} className="text-amber-400" />
              <span className="text-xs font-black text-amber-200">
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
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-md border border-amber-400/30">
                        Mot {index + 1}
                      </span>

                      {/* Uses the exact same audio as Prononciation section */}
                      <button
                        type="button"
                        onClick={() => speakFrench(item.term, { audioUrl: item.audioUrl })}
                        className="text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 px-3 py-1.5 rounded-lg border border-cyan-400/40 flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Volume2 size={16} className="text-cyan-400" /> 🔊 Écouter la dictée
                      </button>
                    </div>

                    {/* Definition & English Hint */}
                    <p className="text-xs font-medium text-slate-200 leading-relaxed mb-1">
                      <strong className="text-amber-200">Définition :</strong> {item.definition}
                    </p>
                    {item.english && (
                      <p className="text-[11px] font-bold text-cyan-300/80 mb-2">
                        Indice Anglais : {item.english}
                      </p>
                    )}
                  </div>

                  {/* Input Field & Embedded French Accent Keyboard Right Above Input */}
                  <div className="mt-2 pt-2 border-t border-slate-700/60">
                    
                    {/* ACCENTS BAR ACCESSIBLE FOR EVERY WORD */}
                    <div className="flex items-center gap-1 flex-wrap mb-2 bg-slate-900/80 p-1.5 rounded-xl border border-amber-400/30">
                      <span className="text-[10px] font-black text-amber-300 mr-1 uppercase tracking-wider">Accents :</span>
                      {frenchAccents.map((acc, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => handleInsertAccentWord(index, acc)}
                          className="accent-btn"
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

                    {/* Feedback Banners */}
                    {status === 'correct' && (
                      <div className="mt-2.5 text-xs font-black text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/40">
                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                        <span>Parfait ! Orthographe impeccable : "{item.term}"</span>
                      </div>
                    )}

                    {status === 'accent-error' && (
                      <div className="mt-2.5 text-xs font-bold text-amber-300 flex items-center gap-1.5 bg-amber-950/60 p-2 rounded-lg border border-amber-400/40">
                        <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
                        <span>Attention aux accents ! Terme exact : <strong className="text-amber-100 underline">{item.term}</strong></span>
                      </div>
                    )}

                    {status === 'spelling-error' && (
                      <div className="mt-2.5 text-xs font-semibold text-rose-300 flex items-center gap-1.5 bg-rose-950/60 p-2 rounded-lg border border-rose-500/40">
                        <XCircle size={16} className="text-rose-400 flex-shrink-0" />
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

      {/* Frame 3: Flashcard Practice */}
      {activeHeaderTab === 'flashcard_practice' && (
        <GameSection chapterId={chapterId} vocabulary={data} />
      )}

    </div>
  );
}

export default VocabularySection;
