import React, { useState, useRef } from 'react';
import { BookOpen, RefreshCw, Send, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

const PROMPTS = [
  {
    id: 1,
    title: "1. La Routine du Matin",
    prompt: "Décris ta routine du matin au présent. Qu'est-ce que tu fais en premier ? Que manges-tu ?",
    focus: "Présent de l'indicatif & Verbes pronominaux",
    minWords: 40
  },
  {
    id: 2,
    title: "2. Les Loisirs Préférés",
    prompt: "Parle de tes loisirs préférés. Pourquoi aimes-tu ces activités et quand les pratiques-tu ?",
    focus: "Verbes d'appréciation & Expressions de fréquence",
    minWords: 40
  },
  {
    id: 3,
    title: "3. Meilleur(e) Ami(e)",
    prompt: "Décris ton meilleur ami ou ta meilleure amie. Comment est-il ou est-elle physiquement et mentalement ?",
    focus: "Adjectifs, Description physique & Psychologique",
    minWords: 40
  },
  {
    id: 4,
    title: "4. Le Week-end Idéal",
    prompt: "Raconte ton week-end ou tes vacances de rêve. Quelles activités fais-tu et avec qui ?",
    focus: "Activités & Expression personnelle",
    minWords: 40
  }
];
const WRITING_PROMPTS = PROMPTS;

const UNIT1_PROMPTS = [
  {
    id: 1,
    title: "Votre héros ou héroïne préféré(e)",
    prompt: "Décrivez votre héros ou héroïne préféré(e) (réel ou fictif) au présent. Quelles sont ses qualités morales et ses pouvoirs ?"
  },
  {
    id: 2,
    title: "Le portrait d'un anti-héros",
    prompt: "Présentez un anti-héros célèbre (de livre ou de film) au présent. Expliquez pourquoi ce personnage est complexe et quelles sont ses faiblesses."
  },
  {
    id: 3,
    title: "Si vous étiez un super-héros",
    prompt: "Si vous étiez un super-héros, quel serait votre pouvoir spécial ? Décrivez vos actions quotidiennes pour sauver le monde au présent."
  },
  {
    id: 4,
    title: "Le rival ou le méchant",
    prompt: "Décrivez un méchant ou un rival marquant d'une histoire au présent. Quelles sont ses motivations et ses traits de caractère principaux ?"
  }
];

const localAnalyzeText = (text, prompt) => {
  const textClean = text.trim();
  const textLower = textClean.toLowerCase();
  
  const spellingErrors = [];
  const verbAgreements = [];
  const adjectiveAgreements = [];
  const nounGenders = [];
  const wordChoices = [];

  // 1. Verb: je me leve -> je me lève
  const leveMatch = textClean.match(/\b(je\s+me|je|tu|il|elle|on|ils|elles)\s+leve(s)?\b/i);
  if (leveMatch) {
    const pronom = leveMatch[1].toLowerCase();
    let correctVerb = "lève";
    if (pronom === "tu") correctVerb = "lèves";
    if (pronom === "ils" || pronom === "elles") correctVerb = "lèvent";
    
    verbAgreements.push({
      error: leveMatch[2] ? `${leveMatch[1]} leve${leveMatch[2]}` : `${leveMatch[1]} leve`,
      subject: leveMatch[1],
      correction: `${leveMatch[1]} ${correctVerb}`,
      explanation: "Le verbe pronominal « se lever » prend un accent grave (è) au présent pour la prononciation : je me lève."
    });
  }

  // 2. Preposition a vs à
  // Match 'a' followed by space and then a common noun, article, city, or digit
  const aPrepMatch = textClean.match(/\ba\s+(la|l'|un|une|des|le|les|paris|canada|france|l'école|l'hôtel|l'hôpital|\d+)\b/i);
  if (aPrepMatch) {
    wordChoices.push({
      error: `a ${aPrepMatch[1]}`,
      correction: `à ${aPrepMatch[1]}`,
      explanation: "La préposition de lieu ou de temps s'écrit « à » avec un accent grave. Le mot « a » sans accent est la troisième personne du verbe avoir."
    });
  }

  // 3. Verb: prend -> prends (je prend, tu prend)
  const prendMatch = textClean.match(/\b(je|tu)\s+prend\b/i);
  if (prendMatch) {
    verbAgreements.push({
      error: `${prendMatch[1]} prend`,
      subject: prendMatch[1],
      correction: `${prendMatch[1]} prends`,
      explanation: "Au présent de l'indicatif, le verbe « prendre » prend un « -s » avec les sujets je/tu : je prends, tu prends."
    });
  }

  // 4. Noun Gender: ma déjeuner -> mon déjeuner
  const dejeunerMatch = textClean.match(/\b(ma|la)\s+dé?jeuner\b/i);
  if (dejeunerMatch) {
    nounGenders.push({
      error: dejeunerMatch[0],
      correction: dejeunerMatch[1].toLowerCase() === 'ma' ? "mon déjeuner" : "le déjeuner",
      explanation: "Le nom « déjeuner » est masculin. On dit « le déjeuner » ou « mon déjeuner »."
    });
  }

  // 5. Elision/Preposition: a la école / la école / a la ecole
  const ecoleMatch = textClean.match(/\b(a\s+)?la\s+é?cole\b/i);
  if (ecoleMatch) {
    wordChoices.push({
      error: ecoleMatch[0],
      correction: "à l'école",
      explanation: "Devant un nom commençant par une voyelle comme école, l'article 'la' s'élide en 'l\''. De plus, on utilise la préposition « à » : à l'école."
    });
  }

  // 5.5. Spelling/Elision for ercole: ercole -> école
  const ercoleMatch = textClean.match(/\b(a\s+)?(la\s+)?(l['’]\s*)?ercole(s)?\b/i);
  if (ercoleMatch) {
    let corr = "école";
    let expl = "Le mot s'écrit « école » avec un accent aigu sur le premier 'e' (et sans la lettre 'r').";
    if (ercoleMatch[1] || ercoleMatch[2] || ercoleMatch[3]) {
      corr = ercoleMatch[1] ? "à l'école" : "l'école";
      expl = "Le mot s'écrit « école » avec un accent aigu sur le premier 'e' (et sans la lettre 'r'). Devant école (qui commence par une voyelle), l'article s'élide en l'.";
    }
    spellingErrors.push({
      error: ercoleMatch[0],
      correction: corr,
      explanation: expl
    });
  }

  // 6. Possessive agreement: mon amis
  const monAmisMatch = textClean.match(/\bmon\s+ami(e)?s\b/i);
  if (monAmisMatch) {
    adjectiveAgreements.push({
      error: monAmisMatch[0],
      noun: "amis",
      correction: "mon ami (singulier) ou mes amis (pluriel)",
      explanation: "L'adjectif possessif doit s'accorder en nombre avec le nom. Utilisez « mon » avec un nom singulier ou « mes » avec un nom pluriel."
    });
  }

  // 7. Context word choices: sur le bus -> dans le bus
  const surBusMatch = textClean.match(/\bsur\s+(le|un|les)\s+bus\b/i);
  if (surBusMatch) {
    wordChoices.push({
      error: surBusMatch[0],
      correction: `dans ${surBusMatch[1]} bus`,
      explanation: "En français, on voyage « dans le bus » (à l'intérieur) ou « en bus ». « Sur le bus » signifie sur le toit du véhicule !"
    });
  }

  // 7.5. Irregular Verb conjugation: je va / tu va / il vais
  const jeVaMatch = textClean.match(/\bje\s+va(s)?\b/i);
  if (jeVaMatch) {
    verbAgreements.push({
      error: jeVaMatch[0],
      subject: "je",
      correction: "je vais",
      explanation: "Au présent de l'indicatif, la forme correcte du verbe « aller » avec le sujet « je » est « vais » : je vais."
    });
  }
  const tuVaMatch = textClean.match(/\btu\s+va\b/i);
  if (tuVaMatch) {
    verbAgreements.push({
      error: tuVaMatch[0],
      subject: "tu",
      correction: "tu vas",
      explanation: "Au présent de l'indicatif, la forme correcte du verbe « aller » avec le sujet « tu » prend un 's' : tu vas."
    });
  }
  const ilVaisMatch = textClean.match(/\b(il|elle|on)\s+vai(s|t)\b/i);
  if (ilVaisMatch) {
    verbAgreements.push({
      error: ilVaisMatch[0],
      subject: ilVaisMatch[1],
      correction: `${ilVaisMatch[1]} va`,
      explanation: "Au présent de l'indicatif, la forme correcte du verbe « aller » avec la troisième personne (il/elle/on) est « va » : il/elle/on va."
    });
  }

  // 8. General verb agreements
  // Je + verb ending in -es (ex: je manges)
  const jeEsMatch = textClean.match(/\b(je)\s+(\w+es)\b/i);
  if (jeEsMatch && !leveMatch) {
    verbAgreements.push({
      error: jeEsMatch[2],
      subject: "je",
      correction: jeEsMatch[2].slice(0, -1),
      explanation: "Au présent de l'indicatif, la terminaison avec le pronom sujet « je » est « -e » pour les verbes du premier groupe (-er)."
    });
  }

  // Nous + verb ending in -e, -es, -ez (ex: nous mange)
  const nousMatch = textClean.match(/\b(nous)\s+(\w+[^ons\s])\b/i);
  if (nousMatch && !["sommes"].includes(nousMatch[2])) {
    const verb = nousMatch[2];
    if (verb.endsWith("e") || verb.endsWith("es") || verb.endsWith("ez")) {
      verbAgreements.push({
        error: verb,
        subject: "nous",
        correction: verb.replace(/e(s|z)?$/, "ons"),
        explanation: "Au présent, la terminaison avec le sujet « nous » est « -ons » (ex: nous mangeons)."
      });
    }
  }

  // Vous + verb ending in -e, -es (ex: vous manges)
  const vousMatch = textClean.match(/\b(vous)\s+(\w+[^ez\s])\b/i);
  if (vousMatch && !["êtes", "faites", "dites"].includes(vousMatch[2])) {
    const verb = vousMatch[2];
    if (verb.endsWith("e") || verb.endsWith("es")) {
      verbAgreements.push({
        error: verb,
        subject: "vous",
        correction: verb.replace(/e(s)?$/, "ez"),
        explanation: "Au présent, la terminaison avec le sujet « vous » est « -ez » (ex: vous mangez)."
      });
    }
  }

  // Ils/Elles + verb ending in -e, -es, -ez (ex: ils mange)
  const ilsMatch = textClean.match(/\b(ils|elles)\s+(\w+[^ent\s])\b/i);
  if (ilsMatch && !["sont", "ont", "font", "vont"].includes(ilsMatch[2])) {
    const verb = ilsMatch[2];
    if (verb.endsWith("e") || verb.endsWith("es") || verb.endsWith("ez")) {
      verbAgreements.push({
        error: verb,
        subject: ilsMatch[1],
        correction: verb.replace(/e(s|z)?$/, "ent"),
        explanation: "Au présent, les verbes se terminent par « -ent » au pluriel avec les pronoms sujets « ils / elles »."
      });
    }
  }

  // Noun genders check
  if (textLower.includes("le table")) {
    nounGenders.push({
      error: "le table",
      correction: "la table",
      explanation: "Le nom « table » est féminin."
    });
  }
  if (textLower.includes("un pomme")) {
    nounGenders.push({
      error: "un pomme",
      correction: "une pomme",
      explanation: "Le nom « pomme » est féminin."
    });
  }
  if (textLower.includes("la livre") && !textLower.includes("la livre sterling")) {
    nounGenders.push({
      error: "la livre",
      correction: "le livre",
      explanation: "Le nom « livre » (book) est masculin."
    });
  }

  // Common spelling errors
  if (textLower.includes("bocou")) {
    spellingErrors.push({
      error: "bocou",
      correction: "beaucoup",
      explanation: "L'adverbe d'intensité s'écrit toujours « beaucoup »."
    });
  }
  if (textLower.includes("trés")) {
    spellingErrors.push({
      error: "trés",
      correction: "très",
      explanation: "L'accent sur le 'e' de « très » est un accent grave."
    });
  }
  if (textLower.includes("deja")) {
    spellingErrors.push({
      error: "deja",
      correction: "déjà",
      explanation: "Le mot « déjà » s'écrit avec un accent aigu sur le premier 'e' et un accent grave sur le 'a'."
    });
  }

  // Catch dejeuner without accent
  const dejeunerSpelling = textClean.match(/\bdejeuner(s)?\b/i);
  if (dejeunerSpelling) {
    spellingErrors.push({
      error: dejeunerSpelling[0],
      correction: dejeunerSpelling[1] ? "déjeuners" : "déjeuner",
      explanation: "Le mot s'écrit « déjeuner » avec un accent aigu sur le premier 'e'."
    });
  }

  // Catch ecole without accent
  const ecoleSpelling = textClean.match(/\becole(s)?\b/i);
  if (ecoleSpelling) {
    spellingErrors.push({
      error: ecoleSpelling[0],
      correction: ecoleSpelling[1] ? "écoles" : "école",
      explanation: "Le mot s'écrit « école » avec un accent aigu sur le premier 'e'."
    });
  }

  const isValid = spellingErrors.length === 0 && 
                  verbAgreements.length === 0 && 
                  adjectiveAgreements.length === 0 && 
                  nounGenders.length === 0 && 
                  wordChoices.length === 0;

  return {
    isValid,
    spellingErrors,
    verbAgreements,
    adjectiveAgreements,
    nounGenders,
    wordChoices,
    generalFeedback: isValid 
      ? "Excellent travail ! Votre paragraphe est bien rédigé et ne contient aucune erreur de syntaxe ou de grammaire."
      : "Vous avez fait quelques erreurs dans votre texte. Examinez les corrections détaillées ci-dessous pour vous améliorer."
  };
};

const ACCENTS = ["é", "è", "à", "ù", "ç", "â", "ê", "î", "ô", "û", "ë", "ï", "œ"];

export default function WritingPrompt({ onBack, unitId }) {

  const insertAccent = (char) => {
    setText(prev => prev + char);
  };

  const promptsList = unitId === '1' ? UNIT1_PROMPTS : WRITING_PROMPTS;

  const [promptIdx, setPromptIdx] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  
  const textareaRef = useRef(null);
  const activePrompt = promptsList[promptIdx];

  const handleAccentClick = (char) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const currentVal = el.value;

    const newVal = currentVal.slice(0, start) + char + currentVal.slice(end);
    
    // Check characters count
    if (newVal.length > 150) return;

    setText(newVal);

    setTimeout(() => {
      el.focus();
      const newPos = start + char.length;
      el.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    if (val.length <= 150) {
      setText(val);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch('/api/writing-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          prompt: activePrompt.prompt
        })
      });

      const textRes = await response.text();
      
      // If we receive an HTML page (such as Vite SPA fallback in local dev), fall back to client-side checker
      if (textRes.trim().startsWith("<!DOCTYPE") || textRes.trim().startsWith("<html")) {
        const localFeedback = localAnalyzeText(text.trim(), activePrompt.prompt);
        setFeedback(localFeedback);
        return;
      }

      let data;
      try {
        data = JSON.parse(textRes);
      } catch (parseErr) {
        // Fall back to client-side rule checker if the string format is not JSON
        const localFeedback = localAnalyzeText(text.trim(), activePrompt.prompt);
        setFeedback(localFeedback);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Une erreur s'est produite lors de l'analyse.");
      }

      setFeedback(data);
    } catch (err) {
      console.error(err);
      // As a last-resort safety, fall back to the local checker
      const localFeedback = localAnalyzeText(text.trim(), activePrompt.prompt);
      setFeedback(localFeedback);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPrompt = () => {
    setPromptIdx(prev => (prev + 1) % promptsList.length);
    setText("");
    setFeedback(null);
    setError(null);
  };

  const handleReset = () => {
    setText("");
    setFeedback(null);
    setError(null);
  };

  return (
    <div className="wp-container animate-in">
      <style>{STYLE_BLOCK}</style>

      {/* Header */}
      <div className="wp-header">
        <div className="wp-title-group">
          <h2>Atelier d'Écriture : Le Présent 📝</h2>
          <p>Entraînez-vous à rédiger au présent et recevez des corrections grammaticales immédiates.</p>
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
                Sujet d'écriture (Niveau Intermédiaire-Bas)
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
            <div className="mb-2">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Accents utiles :
              </div>
              <div className="flex flex-wrap gap-1">
                {ACCENTS.map((char) => (
                  <button
                    key={char}
                    disabled={loading}
                    onClick={() => handleAccentClick(char)}
                    className="accent-key-btn"
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
