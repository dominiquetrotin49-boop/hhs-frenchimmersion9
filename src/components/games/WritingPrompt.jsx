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

const UNIT2_PROMPTS = [
  {
    id: 1,
    title: "1. Une lettre pour un(e) ami(e) stressé(e)",
    level: "Niveau Intermédiaire",
    prompt: "Ton meilleur ami (ou ta meilleure amie) vit beaucoup de pression scolaire et son anxiété augmente. Écris-lui une lettre bienveillante avec des conseils à l'impératif. Utilise au moins 3 conseils affirmatifs (ex. : Prends une pause, Dors huit heures, Confie-toi à un conseiller) et au moins 2 conseils négatifs (ex. : Ne gère pas ton stress tout(e) seul(e), Ne fais pas semblant d'aller bien). Utilise au moins 4 des verbes suivants : gérer, s'exprimer, prendre, se confier, faire, dormir, comprendre, demander.",
    focus: "L'impératif affirmatif et négatif (tu) • Vocabulaire du bien-être",
    vocab: ["le stress", "l'anxiété", "la pression scolaire", "le soutien", "le soulagement", "l'équilibre", "la fatigue", "se confier", "gérer"],
    minWords: 50
  },
  {
    id: 2,
    title: "2. Mon guide de survie pour la santé mentale",
    level: "Niveau Intermédiaire",
    prompt: "Tu rédiges un petit guide pour les élèves de 9e année qui veulent préserver leur santé mentale. Écris au moins 5 recommandations avec les structures d'obligation suivies du subjonctif présent (ex. : Il faut que tu prennes une pause, Il est essentiel que nous fassions de l'exercice, Il est indispensable que les jeunes dorment assez, Il est impératif qu'on comprenne la détresse des autres). Utilise au moins 4 des verbes suivants : gérer, s'exprimer, prendre, se confier, faire, dormir, comprendre, demander. Termine par une phrase d'encouragement à l'impératif.",
    focus: "Il faut que + subjonctif présent • Structures d'obligation",
    vocab: ["le bien-être", "la santé mentale", "une stratégie d'adaptation", "la respiration profonde", "le sommeil", "le repos", "l'équilibre", "les ressources", "demander de l'aide"],
    minWords: 55
  },
  {
    id: 3,
    title: "3. Une annonce de service public contre la stigmatisation",
    level: "Niveau Intermédiaire-Avancé",
    prompt: "Ton école lance une campagne de sensibilisation sur la santé mentale. Rédige le texte d'une annonce de service public (APS) d'environ 8 à 10 phrases. Brise au moins un mythe (ex. : « Demander de l'aide, c'est un signe de faiblesse »), explique pourquoi la stigmatisation et le jugement font du mal, puis donne des conseils. Ton texte doit contenir au moins 3 phrases à l'impératif (affirmatif ou négatif) ET au moins 3 phrases avec « Il faut que… » ou « Il est essentiel / nécessaire / indispensable / impératif que… » + subjonctif. Mentionne au moins 2 ressources de soutien (un thérapeute, un conseiller, un pair, un parent…).",
    focus: "Impératif + subjonctif • Campagne de sensibilisation",
    vocab: ["la stigmatisation", "un mythe", "le jugement", "une campagne de sensibilisation", "les ressources", "le soutien", "un thérapeute", "un conseiller", "un pair", "la crédibilité"],
    minWords: 70
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
const MAX_CHARS = 2500;


const STYLE_BLOCK = `
  .wp-container {
    max-width: 1020px;
    margin: 0 auto;
    padding: 1.75rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(226, 232, 240, 0.85);
    border-radius: 1.5rem;
    color: #0f172a;
    box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .wp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .wp-title-group h2 {
    font-size: 1.65rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    margin: 0.25rem 0;
    color: #0f172a;
  }

  .wp-title-group p {
    color: #475569;
    font-size: 0.95rem;
    font-weight: 500;
    margin: 0;
    line-height: 1.55;
  }

  .wp-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 1.25rem;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
  }

  .accent-key-btn {
    width: 30px;
    height: 30px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    color: #334155;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .accent-key-btn:hover:not(:disabled) {
    background: #eef2ff;
    border-color: #a5b4fc;
    color: #4f46e5;
    transform: translateY(-1px);
  }

  .accent-key-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .wp-textarea {
    width: 100%;
    padding: 1rem;
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 0.85rem;
    color: #0f172a;
    font-size: 0.96rem;
    line-height: 1.65;
    outline: none;
    resize: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    font-family: inherit;
  }

  .wp-textarea::placeholder {
    color: #94a3b8;
  }

  .wp-textarea:focus {
    border-color: #4f46e5;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }

  .wp-primary-btn {
    padding: 0.65rem 1.35rem;
    background: #4f46e5;
    color: white;
    border: 1px solid #4338ca;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.92rem;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.22);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .wp-primary-btn:hover:not(:disabled) {
    background: #4338ca;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
  }

  .wp-primary-btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .wp-primary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .wp-secondary-btn {
    padding: 0.65rem 1.25rem;
    background: #ffffff;
    color: #334155;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .wp-secondary-btn:hover:not(:disabled) {
    background: #eef2ff;
    border-color: #a5b4fc;
    color: #4f46e5;
  }

  .wp-reset-btn {
    padding: 0.55rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    color: #475569;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .wp-reset-btn:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  .wp-loader {
    width: 36px;
    height: 36px;
    border: 4px solid #e0e7ff;
    border-top-color: #4f46e5;
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

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxI4aY57cD5wMLNKGQYbZWXppMWo07Hy-Zz_Fi0XRYdk41YFIiAw4titVYL5Pwg-n_0/exec";

function buildGeminiWritingPrompt(studentText, promptSubject, promptInstructions, targetVocab = []) {
  return `Tu es un professeur de français bienveillant et rigoureux pour des élèves en immersion française au lycée (Grade 9 / 9e année).
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
}

Sujet : "${promptSubject}"
Consignes : "${promptInstructions}"
Vocabulaire cible suggéré : ${targetVocab.length > 0 ? targetVocab.join(', ') : 'Aucun'}

Texte de l'élève à analyser :
"""
${studentText}
"""`;
}

function stripJsonFences(str) {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function normalizeProxyFeedback(rawResponseText) {
  const cleanedRaw = stripJsonFences(rawResponseText);
  let parsed = JSON.parse(cleanedRaw);

  if (parsed && parsed.error) {
    throw new Error(typeof parsed.error === "string" ? parsed.error : parsed.error.message || "Erreur proxy Gemini");
  }

  // Handle raw Gemini generateContent structure or Apps Script wrapper keys ({ text }, { reply }, { response }, { result }, { output })
  const innerText =
    parsed?.candidates?.[0]?.content?.parts?.[0]?.text ??
    parsed?.text ??
    parsed?.reply ??
    parsed?.response ??
    parsed?.result ??
    parsed?.output ??
    parsed?.answer;

  if (typeof innerText === "string" && !Array.isArray(parsed?.corrections)) {
    try {
      parsed = JSON.parse(stripJsonFences(innerText));
    } catch {
      return {
        isValid: true,
        generalFeedback: innerText,
        strengths: [],
        corrections: [],
        pedagogicalAdvice: "Relisez attentivement vos phrases en vérifiant les accords.",
        source: "ai"
      };
    }
  }

  const corrections = Array.isArray(parsed?.corrections) ? parsed.corrections : [];
  const isValid = typeof parsed?.isValid === "boolean" ? parsed.isValid : corrections.length === 0;

  return {
    isValid,
    generalFeedback:
      parsed?.generalFeedback ||
      (isValid
        ? "Excellent travail ! Votre texte est bien rédigé."
        : "Plusieurs erreurs ont été relevées ci-dessous."),
    strengths: Array.isArray(parsed?.strengths) ? parsed.strengths : [],
    corrections,
    pedagogicalAdvice:
      parsed?.pedagogicalAdvice || "Relisez attentivement vos phrases en vérifiant les accords.",
    source: "ai"
  };
}

export default function WritingPrompt({ onBack, unitId, chapterId }) {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isUnit1 = unitId === "1" || (chapterId && chapterId.includes("unite-1")) || path.includes("unite-1");
  const isUnit2 = !isUnit1 && (unitId === "unite-2" || chapterId === "unite-2" || path.includes("unite-2"));
  const promptsList = isUnit2 ? UNIT2_PROMPTS : isUnit1 ? UNIT1_PROMPTS : RENTREE_PROMPTS;

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
    const fullPrompt = buildGeminiWritingPrompt(
      text.trim(),
      promptTitle,
      promptInstructions,
      targetVocab
    );

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          prompt: fullPrompt,
          studentText: text.trim(),
          text: text.trim(),
          promptSubject: promptTitle,
          promptInstructions: promptInstructions,
          targetVocab: targetVocab,
          unitTheme: `French Immersion 9 - ${activePrompt?.focus || "Rédaction"}`
        })
      });

      const textRes = await res.text();

      if (textRes.trim().startsWith("<!DOCTYPE") || textRes.trim().startsWith("<html")) {
        const localFeedback = localAnalyzeText(text.trim(), promptInstructions, unitId);
        setFeedback(localFeedback);
        return;
      }

      if (!res.ok) {
        throw new Error("Une erreur s'est produite lors de l'analyse.");
      }

      const normalized = normalizeProxyFeedback(textRes);
      setFeedback(normalized);
    } catch (err) {
      console.error("API error:", err);
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
    const val = e.target.value;
    if (val.length > MAX_CHARS) {
      setText(val.slice(0, MAX_CHARS));
    } else {
      setText(val);
    }
    if (feedback) setFeedback(null);
    if (error) setError(null);
  };

  const insertAccent = (char) => {
    setText(prev => (prev + char).slice(0, MAX_CHARS));
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
    if (newVal.length > MAX_CHARS) return;
    setText(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  const titleHeader = isUnit2
    ? "Atelier d'Écriture : Santé Mentale & Bien-Être 📝"
    : isUnit1 
    ? "Atelier d'Écriture : Récits et Portraits Héroïques 📝"
    : "Atelier d'Écriture : Le Présent 📝";

  const subtitleHeader = isUnit2
    ? "Rédige des conseils à l'impératif et des recommandations avec « Il faut que » + subjonctif, en réutilisant le vocabulaire du bien-être."
    : isUnit1
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
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">
                Sujet d'écriture
              </h3>
            </div>

            {/* Prompt Display */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <h4 className="text-sm font-bold text-slate-900 mb-1">{activePrompt.title}</h4>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {activePrompt.prompt}
              </p>
              {activePrompt.vocab && activePrompt.vocab.length > 0 && (
                <div style={{ marginTop: '0.9rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4f46e5', marginBottom: '0.45rem' }}>
                    🎯 À réutiliser : {activePrompt.focus} • min. {activePrompt.minWords} mots
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {activePrompt.vocab.map((w) => (
                      <span key={w} style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', borderRadius: '0.5rem', padding: '0.2rem 0.65rem', fontSize: '0.76rem', fontWeight: 600 }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accent Bar */}
            <div className="mb-3 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
                    className="accent-key-btn bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 transition-transform"
                  >
                    {char}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
                    className="accent-key-btn font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 transition-transform"
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
              <div className="absolute right-3 bottom-3 text-xs text-slate-400 font-semibold">
                {text.length} / {MAX_CHARS} caract.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-6">
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
                  <span className={`w-2.5 h-2.5 rounded-full ${feedback?.source === 'local' ? 'bg-amber-500' : 'bg-indigo-600'}`} />
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">
                    Rapport de Correction Pédagogique
                  </h3>
                </div>
                {feedback && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    feedback.source === 'ai' 
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                  }`}>
                    {feedback.source === 'ai' ? '✨ Analyse IA Immersion 9e' : '⚡ Vérification de base'}
                  </span>
                )}
              </div>

              {/* Error banner */}
              {error && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-rose-600" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="wp-loader" />
                  <p className="text-sm text-slate-600 font-medium">Gemini analyse votre grammaire, accords et orthographe...</p>
                </div>
              )}

              {/* Empty state before submit */}
              {!feedback && !loading && !error && (
                <div className="text-center py-16 text-slate-500">
                  <HelpCircle size={40} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Aucun texte soumis pour le moment.</p>
                  <p className="text-xs text-slate-500 mt-1">Rédigez votre réponse et cliquez sur Soumettre pour recevoir vos corrections.</p>
                </div>
              )}

              {/* Feedback Content */}
              {feedback && !loading && (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  
                  {/* General feedback */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Retour général</span>
                    <p className="text-sm text-slate-800 leading-relaxed font-semibold italic">
                      "{feedback.generalFeedback}"
                    </p>
                  </div>

                  {/* Perfect work check */}
                  {feedback.isValid && (
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center gap-2.5">
                      <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                      <div>
                        <span className="text-xs font-black uppercase text-emerald-700 tracking-wider block mb-0.5">
                          {feedback.source === 'ai' ? "Zéro faute !" : "Aucune erreur fréquente détectée"}
                        </span>
                        <p className="text-xs font-medium text-emerald-800">
                          {feedback.source === 'ai'
                            ? "Excellent travail ! Votre orthographe, vos accords et votre syntaxe sont soignés."
                            : "Aucune erreur élémentaire détectée par le vérificateur automatique. Faites relire votre paragraphe par votre enseignant(e) pour valider les tournures avancées."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {feedback.strengths && feedback.strengths.length > 0 && (
                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 space-y-2">
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        Points forts observés
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {feedback.strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-emerald-800 flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Detailed Corrections */}
                  {feedback.corrections && feedback.corrections.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest block">
                        Corrections détaillées ({feedback.corrections.length})
                      </span>
                      {feedback.corrections.map((corr, idx) => {
                        const catColor = corr.category === 'Conjugaison'
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : corr.category === 'Accords & Genre'
                          ? 'border-amber-200 bg-amber-50 text-amber-800'
                          : corr.category === 'Orthographe'
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                          : 'border-indigo-200 bg-indigo-50 text-violet-700';

                        return (
                          <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                            <div className="flex justify-between items-center flex-wrap gap-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${catColor}`}>
                                {corr.category}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="line-through text-rose-600 font-medium">« {corr.originalSegment} »</span>
                                <span className="text-emerald-700 font-bold">➔ « {corr.suggestedCorrection} »</span>
                              </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">{corr.ruleExplanation}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pedagogical Advice */}
                  {feedback.pedagogicalAdvice && (
                    <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50">
                      <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block mb-1">
                        💡 Conseil pour progresser
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {feedback.pedagogicalAdvice}
                      </p>
                    </div>
                  )}

                  {/* Verbs feedback */}
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.verbAgreements && feedback.verbAgreements.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest block">Accords de verbes (présent)</span>
                      {feedback.verbAgreements.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-rose-800">Sujet : « {err.subject} »</span>
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-700 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Adjectives feedback */}
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.adjectiveAgreements && feedback.adjectiveAgreements.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">Accord des adjectifs</span>
                      {feedback.adjectiveAgreements.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-amber-800">Nom qualifié : « {err.noun} »</span>
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-700 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Noun Genders feedback */}
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.nounGenders && feedback.nounGenders.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">Genre des noms &amp; articles</span>
                      {feedback.nounGenders.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-700 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Spelling feedback */}
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.spellingErrors && feedback.spellingErrors.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block">Orthographe</span>
                      {feedback.spellingErrors.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-700 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Word Choices & Prepositions feedback */}
                  {(!feedback.corrections || feedback.corrections.length === 0) && feedback.wordChoices && feedback.wordChoices.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest block">Vocabulaire &amp; Prépositions</span>
                      {feedback.wordChoices.map((err, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="line-through text-slate-500">{err.error}</span>
                            <span className="text-emerald-700 font-bold">➔ {err.correction}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed mt-1">{err.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 italic mt-4 text-center">
              💡 Révisez la conjugaison du présent de l'indicatif et l'accord des adjectifs dans l'onglet "Grammaire" !
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
