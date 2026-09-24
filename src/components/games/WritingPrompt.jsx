import React, { useState, useRef } from 'react';
import { analyzeFrenchText } from '../../utils/frenchTextAnalyzer';
import { BookOpen, RefreshCw, Send, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

const RENTREE_PROMPTS = [
  {
    id: 1,
    title: "1. Votre routine matinale",
    level: "Niveau Intermédiaire-Bas",
    prompt: "Décrivez votre routine du matin au présent. Qu'est-ce que vous faites en premier ? Que mangez-vous ?",
    focus: "Le Présent — Routine quotidienne",
    minWords: 30
  },
  {
    id: 2,
    title: "2. Vos loisirs préférés",
    level: "Niveau Intermédiaire-Bas",
    prompt: "Parlez de vos loisirs préférés. Pourquoi aimez-vous ces activités et quand les pratiquez-vous ?",
    focus: "Le Présent — Loisirs et passions",
    minWords: 30
  },
  {
    id: 3,
    title: "3. Votre meilleur(e) ami(e)",
    level: "Niveau Intermédiaire-Bas",
    prompt: "Décrivez votre meilleur(e) ami(e). Comment est-il ou elle physiquement et mentalement ?",
    focus: "Le Présent — Description physique et morale",
    minWords: 30
  },
  {
    id: 4,
    title: "4. Votre maison de rêve",
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


const localAnalyzeText = (inputText, promptText = "", unitId = "1") => {
  const result = analyzeFrenchText(inputText, {
    unitId: String(unitId || "1"),
    mode: "writing",
    minWords: 5,
    checkLength: false
  });

  const corrections = [
    ...(result.verbAgreements || []).map(v => ({
      category: 'Conjugaison',
      originalSegment: v.error,
      suggestedCorrection: v.correction,
      ruleExplanation: v.explanation
    })),
    ...(result.adjectiveAgreements || []).map(a => ({
      category: 'Accords & Genre',
      originalSegment: a.error,
      suggestedCorrection: a.correction,
      ruleExplanation: a.explanation
    })),
    ...(result.nounGenders || []).map(n => ({
      category: 'Accords & Genre',
      originalSegment: n.error,
      suggestedCorrection: n.correction,
      ruleExplanation: n.explanation
    })),
    ...(result.spellingErrors || []).map(s => ({
      category: 'Orthographe',
      originalSegment: s.error,
      suggestedCorrection: s.correction,
      ruleExplanation: s.explanation
    })),
    ...(result.wordChoices || []).map(w => ({
      category: 'Vocabulaire',
      originalSegment: w.error,
      suggestedCorrection: w.correction,
      ruleExplanation: w.explanation
    }))
  ];

  const isValid = corrections.length === 0;

  return {
    isValid,
    source: 'local',
    generalFeedback: isValid
      ? "Analyse locale de base : aucune erreur fréquente détectée parmi les règles courantes (accords et orthographe élémentaires). Pour vérifier la richesse du style et les structures avancées, demandez une confirmation à votre enseignant(e)."
      : result.generalFeedback || "Plusieurs erreurs ont été identifiées. Consultez les corrections ci-dessous pour améliorer votre texte.",
    strengths: isValid ? ["Bonne maîtrise des règles élémentaires observées."] : [],
    corrections,
    pedagogicalAdvice: isValid
      ? "Pour progresser en immersion 9e, veillez à bien conjuguer vos verbes au présent et au passé composé, et pensez aux accords en genre et en nombre."
      : "Prenez le temps de bien repérer le sujet de chaque verbe et le genre des noms pour assurer les accords.",
    verbAgreements: result.verbAgreements || [],
    adjectiveAgreements: result.adjectiveAgreements || [],
    nounGenders: result.nounGenders || [],
    spellingErrors: result.spellingErrors || [],
    wordChoices: result.wordChoices || []
  };
};

async function analyzeWithClientGemini(studentText, promptSubject, promptInstructions, targetVocab = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Clé API non disponible côté client.");

  const systemInstruction = `Tu es un professeur de français bienveillant et rigoureux pour des élèves en immersion française au lycée (Grade 9 / 9e année).
Ton rôle est d'analyser le travail de rédaction d'un élève avec clarté et précision, SANS JAMAIS ATTRIBUER DE NOTE CHIFFRÉE.

Critères d'évaluation Grade 9 Immersion :
1. Points forts (vocabulaire thématique, phrases complètes, connecteurs de base).
2. Orthographe & Typographie (accents é, è, ê, à, â, ç, apostrophes et élisions j', l', d', qu', c').
3. Conjugaison & Temps verbaux (présent de l'indicatif, verbes pronominaux, passé composé avec avoir/être, imparfait de description).
4. Accords essentiels (accords sujet-verbe, accords adjectifs masculin/féminin et singulier/pluriel, accords des noms).
5. Syntaxe & Anglicismes (faux-amis courants, prépositions simples).

Consignes impératives pour les corrections :
- Si le texte de l'élève contient des fautes réelles, tu DOIS les répertorier dans "corrections".
- Ne dis JAMAIS qu'un texte est sans faute s'il comporte des erreurs évidentes.
- Si et seulement si le texte ne comporte absolument aucune erreur, renvoie une liste "corrections" vide [] et "isValid": true.
- Si le texte a au moins une erreur, "isValid" DOIT être false.

Réponds STRICTEMENT sous forme d'un objet JSON valide respectant ce format :
{
  "isValid": boolean,
  "generalFeedback": "string",
  "strengths": ["string"],
  "corrections": [
    {
      "category": "Conjugaison" | "Orthographe" | "Syntaxe & Anglicismes" | "Accords & Genre" | "Vocabulaire",
      "originalSegment": "extrait exact contenant la faute",
      "suggestedCorrection": "version corrigée",
      "ruleExplanation": "explication claire et pédagogique de la règle"
    }
  ],
  "pedagogicalAdvice": "string"
}`;

  const userPrompt = `Sujet : "${promptSubject}"
Consignes : "${promptInstructions}"
Vocabulaire cible suggéré : ${targetVocab.length > 0 ? targetVocab.join(', ') : 'Aucun'}

Texte de l'élève à analyser :
"""
${studentText}
"""`;

  const models = ['gemini-3.6-flash', 'gemini-3.5-flash-lite'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        })
      });

      const data = await response.json();
      if (!response.ok || !data.candidates || !data.candidates[0].content) {
        throw new Error(data.error?.message || `Erreur Gemini ${model}`);
      }

      const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
      const corrections = Array.isArray(parsed.corrections) ? parsed.corrections : [];
      const isValid = (typeof parsed.isValid === 'boolean') ? parsed.isValid : (corrections.length === 0);

      return {
        isValid,
        generalFeedback: parsed.generalFeedback || (isValid ? "Excellent travail ! Votre texte est bien rédigé." : "Plusieurs erreurs ont été détectées."),
        strengths: parsed.strengths || [],
        corrections,
        pedagogicalAdvice: parsed.pedagogicalAdvice || "Relisez vos phrases en vérifiant les accords.",
        source: 'ai'
      };
    } catch (e) {
      console.warn(`Fallback client Gemini (${model}):`, e.message);
    }
  }
  throw new Error("Tous les modèles Gemini ont échoué.");
}

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
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setFeedback(null);

    const promptTitle = activePrompt?.title || "Sujet de rédaction";
    const promptInstructions = activePrompt?.prompt || "";
    const targetVocab = activePrompt?.vocab || [];

    try {
      const res = await fetch("/api/writing-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentText: text.trim(),
          text: text.trim(),
          promptSubject: promptTitle,
          promptInstructions: promptInstructions,
          prompt: promptInstructions,
          targetVocab: targetVocab,
          unitTheme: `French Immersion 9 - ${activePrompt?.focus || 'Rédaction'}`
        })
      });

      const textRes = await res.text();

      // If we receive an HTML page (such as Vite SPA fallback in local dev), try client Gemini then local
      if (textRes.trim().startsWith("<!DOCTYPE") || textRes.trim().startsWith("<html")) {
        try {
          if (import.meta.env.VITE_GEMINI_API_KEY) {
            const clientFeedback = await analyzeWithClientGemini(text.trim(), promptTitle, promptInstructions, targetVocab);
            setFeedback(clientFeedback);
            return;
          }
        } catch (cErr) {
          console.warn("Client Gemini direct call error:", cErr);
        }
        const localFeedback = localAnalyzeText(text.trim(), promptInstructions, unitId);
        setFeedback(localFeedback);
        return;
      }

      let data;
      try {
        data = JSON.parse(textRes);
      } catch (parseErr) {
        const localFeedback = localAnalyzeText(text.trim(), promptInstructions, unitId);
        setFeedback(localFeedback);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Une erreur s'est produite lors de l'analyse.");
      }

      setFeedback(data);
    } catch (err) {
      console.error("API error:", err);
      try {
        if (import.meta.env.VITE_GEMINI_API_KEY) {
          const clientFeedback = await analyzeWithClientGemini(text.trim(), promptTitle, promptInstructions, targetVocab);
          setFeedback(clientFeedback);
          return;
        }
      } catch (cErr) {
        console.warn("Client Gemini fallback error:", cErr);
      }
      const localFeedback = localAnalyzeText(text.trim(), promptInstructions, unitId);
      setFeedback(localFeedback);
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${feedback?.source === 'local' ? 'bg-amber-400' : 'bg-purple-400'} animate-pulse`} />
                  <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">
                    Rapport de Correction Pédagogique
                  </h3>
                </div>
                {feedback && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    feedback.source === 'ai' 
                      ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300' 
                      : 'border-amber-500/30 bg-amber-950/40 text-amber-300'
                  }`}>
                    {feedback.source === 'ai' ? '✨ Analyse IA Immersion 9e' : '⚡ Vérification de base'}
                  </span>
                )}
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
                      <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                      <div>
                        <span className="text-xs font-black uppercase text-emerald-400 tracking-wider block mb-0.5">
                          {feedback.source === 'ai' ? "Zéro faute !" : "Aucune erreur fréquente détectée"}
                        </span>
                        <p className="text-xs font-medium text-slate-300">
                          {feedback.source === 'ai'
                            ? "Excellent travail ! Votre orthographe, vos accords et votre syntaxe sont soignés."
                            : "Aucune erreur élémentaire détectée par le vérificateur automatique. Faites relire votre paragraphe par votre enseignant(e) pour valider les tournures avancées."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {feedback.strengths && feedback.strengths.length > 0 && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-950/20 space-y-2">
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        Points forts observés
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {feedback.strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-emerald-100 flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Detailed Corrections */}
                  {feedback.corrections && feedback.corrections.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block">
                        Corrections détaillées ({feedback.corrections.length})
                      </span>
                      {feedback.corrections.map((corr, idx) => {
                        const catColor = corr.category === 'Conjugaison'
                          ? 'border-red-500/30 bg-red-950/30 text-red-300'
                          : corr.category === 'Accords & Genre'
                          ? 'border-orange-500/30 bg-orange-950/30 text-orange-300'
                          : corr.category === 'Orthographe'
                          ? 'border-blue-500/30 bg-blue-950/30 text-blue-300'
                          : 'border-purple-500/30 bg-purple-950/30 text-purple-300';

                        return (
                          <div key={idx} className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 text-xs space-y-1.5">
                            <div className="flex justify-between items-center flex-wrap gap-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${catColor}`}>
                                {corr.category}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="line-through text-slate-400 font-medium">« {corr.originalSegment} »</span>
                                <span className="text-emerald-400 font-bold">➔ « {corr.suggestedCorrection} »</span>
                              </div>
                            </div>
                            <p className="text-slate-300 leading-relaxed font-normal">{corr.ruleExplanation}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pedagogical Advice */}
                  {feedback.pedagogicalAdvice && (
                    <div className="p-3 rounded-xl border border-purple-500/25 bg-purple-950/20">
                      <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest block mb-1">
                        💡 Conseil pour progresser
                      </span>
                      <p className="text-xs text-purple-100 leading-relaxed">
                        {feedback.pedagogicalAdvice}
                      </p>
                    </div>
                  )}

                  {/* Verbs feedback */}
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.verbAgreements && feedback.verbAgreements.length > 0 && (
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
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.adjectiveAgreements && feedback.adjectiveAgreements.length > 0 && (
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
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.nounGenders && feedback.nounGenders.length > 0 && (
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
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.spellingErrors && feedback.spellingErrors.length > 0 && (
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
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.wordChoices && feedback.wordChoices.length > 0 && (
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


