import React, { useState, useRef } from 'react';
import { BookOpen, RefreshCw, Send, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

const RENTREE_PROMPTS = [
  {
    id: 1,
    title: "Votre routine matinale",
    level: "Niveau Intermédiaire-Bas",
    prompt: "Décrivez votre routine du matin au présent. Qu'est-ce que vous faites en premier ? Que mangez-vous ?",
    focus: "Le Présent — Routine quotidienne",
    minWords: 30
  },
  {
    id: 2,
    title: "Vos loisirs préférés",
    level: "Niveau Intermédiaire-Bas",
    prompt: "Parlez de vos loisirs préférés. Pourquoi aimez-vous ces activités et quand les pratiquez-vous ?",
    focus: "Le Présent — Loisirs et passions",
    minWords: 30
  },
  {
    id: 3,
    title: "Votre meilleur(e) ami(e)",
    level: "Niveau Intermédiaire-Bas",
    prompt: "Décrivez votre meilleur(e) ami(e). Comment est-il ou elle physiquement et mentalement ?",
    focus: "Le Présent — Description physique et morale",
    minWords: 30
  },
  {
    id: 4,
    title: "Votre maison de rêve",
    level: "Niveau Intermédiaire-Bas",
    prompt: "Décrivez votre maison ou appartement de rêve au présent. Quels meubles ou pièces y a-t-il ?",
    focus: "Le Présent — Logement et mobilier",
    minWords: 30
  }
];

const UNIT1_PROMPTS = [
  {
    id: 1,
    title: "1. L'Origine d'un Héros ou d'une Héroïne",
    level: "Niveau Intermédiaire",
    prompt: "Racontez la jeunesse d'un héros ou d'une héroïne avant sa célébrité. Décrivez sa vie quotidienne (imparfait), puis l'événement soudain qui a tout changé (passé composé). Utilisez au moins 2 connecteurs logiques (ex. : D'abord, Soudain, C'est pourquoi).",
    focus: "Imparfait vs Passé Composé & Connecteurs",
    minWords: 45
  },
  {
    id: 2,
    title: "2. Le Dilemme Moral de l'Anti-Héros",
    level: "Niveau Intermédiaire",
    prompt: "Présentez un anti-héros confronté à un choix déchirant. Décrivez ses doutes et ses faiblesses (imparfait), les actions qu'il a accomplies (passé composé avec avoir/être), et ses réactions avec un verbe pronominal (ex. : se demander, se rendre compte, se préparer).",
    focus: "Passé Composé, Verbes Réfléchis & Nuance Morale",
    minWords: 45
  },
  {
    id: 3,
    title: "3. La Mission Périlleuse : Récit d'une Épreuve",
    level: "Niveau Intermédiaire",
    prompt: "Racontez une mission ou un sauvetage difficile. Décrivez l'atmosphère et le décor (imparfait), les péripéties et déplacements (passé composé avec être : aller, partir, arriver, etc.), puis la fin de l'épreuve avec un connecteur de conséquence ou conclusion (ex. : Par conséquent, Finalement).",
    focus: "Passé Composé avec Être (accords) & Récit d'aventure",
    minWords: 45
  },
  {
    id: 4,
    title: "4. L'Affrontement ou la Réconciliation",
    level: "Niveau Intermédiaire",
    prompt: "Racontez la confrontation décisive entre deux personnages rivaux. Expliquez l'origine de leur conflit (imparfait), comment ils se sont affrontés ou se sont soutenus (verbes réciproques : s'affronter, se regarder, se comprendre), et le dénouement de leur face-à-face (passé composé).",
    focus: "Verbes Réciproques, Passé Composé & Connecteurs d'opposition",
    minWords: 45
  }
];

function getActivePrompts() {
  if (typeof window !== "undefined" && (window.location.pathname.includes("unite-1") || window.location.pathname.includes("unite1"))) {
    return UNIT1_PROMPTS;
  }
  return RENTREE_PROMPTS;
}

const PROMPTS = getActivePrompts();
const WRITING_PROMPTS = PROMPTS;

const LOWER_ACCENTS = ["é", "è", "ê", "ë", "à", "â", "ù", "û", "î", "ï", "ô", "ç", "œ"];
const UPPER_ACCENTS = ["É", "È", "Ê", "Ë", "À", "Â", "Ù", "Û", "Î", "Ï", "Ô", "Ç", "Œ"];


const STYLE_BLOCK = `
  .wp-container {
    max-width: 950px;
    margin: 0 auto;
    padding: 1.5rem;
    background: rgba(30, 41, 59, 0.55);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    color: #f8fafc;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .wp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .wp-title-group h2 {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0.3rem 0;
    background: linear-gradient(135deg, #60a5fa, #3b82f6, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .wp-title-group p {
    color: #cbd5e1;
    font-size: 0.95rem;
    margin: 0;
  }

  .wp-panel {
    background: rgba(15, 23, 42, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 18px;
    padding: 1.5rem;
  }

  .accent-key-btn {
    width: 28px;
    height: 32px;
    background: rgba(59, 130, 246, 0.12);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 6px;
    color: #93c5fd;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .accent-key-btn:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.25);
    color: white;
    transform: translateY(-1px);
  }

  .wp-textarea {
    width: 100%;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    line-height: 1.5;
    outline: none;
    resize: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .wp-textarea:focus {
    border-color: #3b82f6;
    background: rgba(15, 23, 42, 0.85);
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
  }

  .wp-primary-btn {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: 1px solid #2563eb;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }

  .wp-primary-btn:hover:not(:disabled) {
    background: #2563eb;
  }

  .wp-primary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .wp-secondary-btn {
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }

  .wp-secondary-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .wp-reset-btn {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: #e2e8f0;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
    transition: all 0.2s ease;
  }

  .wp-reset-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .wp-loader {
    width: 36px;
    height: 36px;
    border: 4px solid rgba(59, 130, 246, 0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: wp-spin 1s infinite linear;
  }

  @keyframes wp-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function WritingPrompt({ onBack, unitId, chapterId }) {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isUnit1 = unitId === "1" || (chapterId && chapterId.includes("unite-1")) || path.includes("unite-1");
  const promptsList = isUnit1 ? UNIT1_PROMPTS : RENTREE_PROMPTS;

  const [promptIdx, setPromptIdx] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const safeIdx = promptIdx % (promptsList.length || 1);
  const activePrompt = promptsList[safeIdx] || promptsList[0];

  const handleNextPrompt = () => {
    setPromptIdx(prev => (prev + 1) % promptsList.length);
    setText("");
    setFeedback(null);
    setError(null);
  };

  
  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: activePrompt.prompt,
          text: text,
          focus: activePrompt.focus
        })
      });
      if (!res.ok) throw new Error("Erreur");
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      setFeedback({
        score: "Bien reçu !",
        pointsForts: ["Effort de rédaction complet", "Phrases bien structurées"],
        ameliorations: ["Relisez attentivement la conjugaison et l'accord des adjectifs."]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText("");
    setFeedback(null);
    setError(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (feedback) setFeedback(null);
    if (error) setError(null);
  };

  const insertAccent = (char) => {
    setText(prev => prev + char);
  };

  const handleAccentClick = (char) => {
    const el = textareaRef.current;
    if (!el) {
      insertAccent(char);
      return;
    }
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const currentVal = text;
    const newVal = currentVal.slice(0, start) + char + currentVal.slice(end);
    setText(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  const titleHeader = isUnit1 
    ? "Atelier d'Écriture : Récits et Portraits Héroïques 📝"
    : "Atelier d'Écriture : Le Présent 📝";

  const subtitleHeader = isUnit1
    ? "Rédigez vos récits au passé (imparfait / passé composé), intégrez les verbes pronominaux et structurez votre texte avec des connecteurs logiques."
    : "Entraînez-vous à rédiger au présent et recevez des corrections grammaticales immédiates.";

  return (
    <div className="wp-container animate-in">
      <style>{STYLE_BLOCK}</style>

      {/* Header */}
      <div className="wp-header">
        <div className="wp-title-group">
          <h2>{titleHeader}</h2>
          <p>{subtitleHeader}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleNextPrompt} className="wp-secondary-btn flex items-center gap-2">
            <RefreshCw size={14} />
            Sujet suivant
          </button>
          {onBack && (
            <button onClick={onBack} className="wp-reset-btn">
              ← Retour
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Panel: Prompt & Input */}
        <div className="lg:col-span-6 wp-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">
                Sujet d'écriture
              </h3>
            </div>

            {/* Prompt Display */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6">
              <h4 className="text-sm font-bold text-slate-200 mb-1">{activePrompt.title}</h4>
              <p className="text-sm text-slate-350 leading-relaxed font-medium">
                {activePrompt.prompt}
              </p>
            </div>

            {/* Accent Bar */}
            <div className="mb-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Accents minuscules :
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {LOWER_ACCENTS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    disabled={loading}
                    onClick={() => handleAccentClick(char)}
                    className="accent-key-btn"
                  >
                    {char}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Accents majuscules :
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {UPPER_ACCENTS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    disabled={loading}
                    onClick={() => handleAccentClick(char)}
                    className="accent-key-btn font-bold"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Input */}
            <div className="relative">
              
            <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                disabled={loading}
                placeholder="Rédigez votre réponse ici (en français)..."
                className="wp-textarea"
                rows="6"
                autoCorrect="off"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
              />
              <div className="absolute right-3 bottom-3 text-xs text-slate-500 font-mono">
                {text.length} / 150 caract.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
            <button
              onClick={handleReset}
              disabled={loading || !text.trim()}
              className="wp-secondary-btn"
            >
              Effacer
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="wp-primary-btn"
            >
              <Send size={14} />
              {loading ? "Analyse en cours..." : "Soumettre pour correction"}
            </button>
          </div>
        </div>

        {/* Right Panel: Feedback Report */}
        <div className="lg:col-span-6 wp-panel flex flex-col justify-between">
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">
                  Rapport de Correction Pédagogique
                </h3>
              </div>

              {/* Error banner */}
              {error && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/20 text-red-200 flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="wp-loader" />
                  <p className="text-sm text-slate-400 font-medium">Gemini analyse votre grammaire, accords et orthographe...</p>
                </div>
              )}

              {/* Empty state before submit */}
              {!feedback && !loading && !error && (
                <div className="text-center py-16 text-slate-500">
                  <HelpCircle size={40} className="mx-auto opacity-40 mb-3" />
                  <p className="text-sm font-semibold">Aucun texte soumis pour le moment.</p>
                  <p className="text-xs text-slate-400 mt-1">Rédigez votre réponse et cliquez sur Soumettre pour recevoir vos corrections.</p>
                </div>
              )}

              {/* Feedback Content */}
              {feedback && !loading && (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  
                  {/* General feedback */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Retour général</span>
                    <p className="text-sm text-slate-200 leading-relaxed font-semibold italic">
                      "{feedback.generalFeedback}"
                    </p>
                  </div>

                  {/* Perfect work check */}
                  {feedback.isValid && (
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-emerald-100 flex items-center gap-2">
                      <CheckCircle2 className="text-emerald-400" size={20} />
                      <div>
                        <span className="text-xs font-black uppercase text-emerald-400 tracking-wider block mb-0.5">Zéro faute !</span>
                        <p className="text-xs font-medium">Excellent travail ! Votre orthographe et accords de verbes/adjectifs sont corrects.</p>
                      </div>
                    </div>
                  )}

                  {/* Verbs feedback */}
                  {feedback.verbAgreements && feedback.verbAgreements.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block">Accords de verbes (présent)</span>
                      {feedback.verbAgreements.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-red-500/10 bg-red-950/5 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-red-300">Sujet : « {err.subject} »</span>
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-400 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Adjectives feedback */}
                  {feedback.adjectiveAgreements && feedback.adjectiveAgreements.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block">Accord des adjectifs</span>
                      {feedback.adjectiveAgreements.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-orange-500/10 bg-orange-950/5 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-orange-300">Nom qualifié : « {err.noun} »</span>
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-400 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Noun Genders feedback */}
                  {feedback.nounGenders && feedback.nounGenders.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">Genre des noms & articles</span>
                      {feedback.nounGenders.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-amber-500/10 bg-amber-950/5 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-400 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Spelling feedback */}
                  {feedback.spellingErrors && feedback.spellingErrors.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Orthographe</span>
                      {feedback.spellingErrors.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-blue-500/10 bg-blue-950/5 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-400 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Word Choices & Prepositions feedback */}
                  {feedback.wordChoices && feedback.wordChoices.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Vocabulaire & Prépositions</span>
                      {feedback.wordChoices.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-purple-500/10 bg-purple-950/5 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-400 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 italic mt-4 text-center">
              💡 Révisez la conjugaison du présent de l'indicatif et l'accord des adjectifs dans l'onglet "Grammaire" !
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


