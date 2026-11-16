import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  Square,
  Pause,
  Play,
  RotateCcw,
  Send,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Timer,
  CheckCircle2,
  Sparkles,
  Volume2,
  ClipboardCheck
} from 'lucide-react';
import {
  callGeminiProxy,
  cleanFeedbackText,
  pickResponseText,
  resolveJsonPayload,
  stripLeadingBullet
} from '../../utils/geminiProxy';

const MAX_RECORD_SECONDS = 60;
const TARGET_MIN_SECONDS = 45;
const PREP_SECONDS = 30;
const AI_TIMEOUT_MS = 60000;
const AUDIO_BITS_PER_SECOND = 32000;

const SPEAKING_TASK = {
  title: "Conseils de bien-être pour un(e) ami(e) stressé(e)",
  targetTime: "45 à 60 secondes",
  levelTarget: "Objectif : ACTFL Intermediate-Low (phrases simples et composées reliées, conseils à l'impératif et vocabulaire du bien-être).",
  prompt:
    "Ton meilleur ami (ou ta meilleure amie) est très stressé(e) par les examens et les devoirs. Enregistre un message vocal bienveillant (45 à 60 secondes) pour lui donner des conseils pratiques. Utilise au moins 3 conseils à l'impératif affirmatif (ex. : Prends une pause, Dors huit heures, Confie-toi à un adulte), au moins 2 conseils à l'impératif négatif (ex. : Ne gère pas ton stress tout(e) seul(e), Ne fais pas semblant d'aller bien), et le vocabulaire du bien-être de l'Unité 2.",
  toolbox: {
    connectors: [
      "d'abord",
      "ensuite",
      "par exemple",
      "en plus",
      "finalement",
      "je te conseille de…"
    ],
    affirmative: [
      "prends une pause",
      "dors huit heures",
      "confie-toi à un adulte",
      "respire profondément",
      "demande de l'aide",
      "garde l'équilibre"
    ],
    negative: [
      "ne gère pas ton stress tout(e) seul(e)",
      "ne fais pas semblant d'aller bien",
      "ne reste pas isolé(e)",
      "n'oublie pas de te reposer"
    ],
    vocab: [
      "le stress",
      "l'anxiété",
      "la pression scolaire",
      "le bien-être",
      "le soutien",
      "le soulagement",
      "la santé mentale"
    ]
  }
};

const SPEAKING_SYSTEM_INSTRUCTION = `Tu es un professeur de français bienveillant et encourageant pour des élèves en immersion française au lycée (Grade 9 / 9e année). Tu évalues une production ORALE enregistrée selon les standards ACTFL calibrés pour le niveau Intermediate-Low (Novice-High / Intermediate-Low / Intermediate-Mid). Tu écoutes réellement l'audio fourni. Tu ne donnes jamais de note chiffrée. Tu récompenses la communication de sens, les phrases reliées, l'emploi de l'impératif et du vocabulaire du bien-être sans pénaliser sévèrement un accent anglophone mineur ou des erreurs typiques de niveau Intermediate-Low. Tu réponds uniquement par un objet JSON valide.`;

const buildSpeakingPrompt = () => `Tu es un professeur de français de 9e année en immersion : chaleureux, encourageant et précis.
L'élève a enregistré un message vocal de 45 à 60 secondes répondant à cette consigne :
Sujet : "${SPEAKING_TASK.title}"
Consigne : "${SPEAKING_TASK.prompt}"

Écoute attentivement l'audio joint et évalue-le selon les standards ACTFL calibrés pour Grade 9 (autour de Novice-High / Intermediate-Low / Intermediate-Mid) :
1. Transcription fidèle de ce que l'élève a réellement dit en français.
2. Niveau ACTFL estimé ("Novice-High", "Intermediate-Low", ou "Intermediate-Mid") avec 2 phrases claires en français expliquant le niveau (phrases reliées, fluidité, compréhensibilité).
3. Respect des consignes : l'élève a-t-il utilisé au moins 3 conseils à l'impératif affirmatif, au moins 2 conseils à l'impératif négatif, et le vocabulaire du bien-être de l'Unité 2 ?
4. Points forts précis observés dans l'audio.
5. Prononciation & Fluidité : remarques encourageantes et concrètes (sons, rythme, pauses, voyelles, liaisons).
6. Corrections grammaticales & lexicales ciblées (ce que l'élève a dit -> correction -> explication brève).
7. Un conseil concret pour progresser à la prochaine tentative.

Si l'audio est silencieux, inaudible ou pas en français, dis-le honnêtement dans "proficiencyJustification" et laisse les tableaux vides.

Réponds STRICTEMENT avec un objet JSON valide (sans markdown, sans bloc de code), selon ce schéma exact :
{
  "transcript": "transcription fidèle, mot à mot, de ce que l'élève a dit en français",
  "proficiencyLevel": "Novice-High" | "Intermediate-Low" | "Intermediate-Mid",
  "proficiencyJustification": "2 à 3 phrases EN FRANÇAIS expliquant pourquoi le discours, la fluidité et la compréhensibilité correspondent à ce niveau",
  "taskCompletion": {
    "affirmativeImperatives": boolean,
    "negativeImperatives": boolean,
    "unitVocab": boolean,
    "summary": "1 à 2 phrases résumant le respect des 3 critères de la consigne"
  },
  "strengths": ["point fort 1", "point fort 2"],
  "pronunciationFeedback": [
    { "wordOrSound": "mot ou son entendu", "issue": "observation bienveillante", "tip": "conseil concret pour améliorer" }
  ],
  "grammarAndSyntax": [
    { "original": "ce que l'élève a dit", "corrected": "version corrigée", "explanation": "explication brève et pédagogique" }
  ],
  "advice": "un conseil concret et motivant pour la prochaine étape"
}
Donne 2 à 3 éléments pour "strengths", "pronunciationFeedback" et "grammarAndSyntax" (ou moins si le texte est déjà très juste). Tout le contenu pédagogique est en français.`;

const pickRecorderMime = () => {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') return '';
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
};

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || '');
      const idx = result.indexOf('base64,');
      resolve(idx >= 0 ? result.slice(idx + 7) : result.replace(/^data:[^;]+;base64,/, ''));
    };
    reader.onerror = () => reject(new Error("Impossible de lire l'enregistrement audio."));
    reader.readAsDataURL(blob);
  });

const asArray = (v) => (Array.isArray(v) ? v : []);

const toFrenchError = (err) => {
  const raw = String((err && err.message) || err || '');
  const lower = raw.toLowerCase();
  if (lower.includes('délai') || lower.includes('abort')) {
    return "Le délai de 60 secondes est dépassé : l'analyse audio prend plus de temps que prévu. Réessayez sans vous réenregistrer.";
  }
  if (lower.includes('429') || lower.includes('quota') || lower.includes('resource_exhausted')) {
    return "Le service d'IA est très sollicité en ce moment (limite atteinte). Patientez une minute puis réessayez.";
  }
  if (lower.includes('404') || lower.includes('not found') || lower.includes('no longer available') || lower.includes('deprecated')) {
    return "Le modèle d'IA configuré n'est plus disponible. Prévenez votre enseignant(e) : le proxy Apps Script doit être mis à jour.";
  }
  if (lower.includes('mime') || lower.includes('unsupported') || lower.includes('invalid argument') || lower.includes('400')) {
    return "Le format audio n'a pas été accepté par l'IA. Réenregistrez-vous (idéalement avec Google Chrome) et réessayez.";
  }
  if (lower.includes('503') || lower.includes('overloaded') || lower.includes('unavailable')) {
    return "Le service d'IA est temporairement surchargé. Réessayez dans quelques instants.";
  }
  if (lower.includes('failed to fetch') || lower.includes('networkerror') || lower.includes('load failed')) {
    return "Impossible de joindre le serveur d'IA. Vérifiez votre connexion Internet (ou les restrictions du réseau scolaire).";
  }
  if (lower.includes('clé') || lower.includes('api key') || lower.includes('gemini_api_key')) {
    return "La clé du service d'IA est manquante ou invalide. Prévenez votre enseignant(e).";
  }
  return raw || "Une erreur inattendue s'est produite pendant l'analyse.";
};

const normalizeSpeakingFeedback = (data) => {
  if (data && data.error) {
    throw new Error(typeof data.error === 'string' ? data.error : data.error.message || JSON.stringify(data.error));
  }
  const src = resolveJsonPayload(data, ['proficiencyLevel', 'transcript']);
  if (!src.__parsed && pickResponseText(data)) {
    throw new Error("La réponse de l'IA n'était pas au format attendu. Réessayez dans un instant.");
  }

  const tc = src.taskCompletion && typeof src.taskCompletion === 'object' ? src.taskCompletion : {};

  return {
    transcript: cleanFeedbackText(src.transcript) || '',
    proficiencyLevel: String(src.proficiencyLevel || 'Intermediate-Low'),
    proficiencyJustification: cleanFeedbackText(src.proficiencyJustification) || '',
    taskCompletion: {
      affirmativeImperatives: Boolean(tc.affirmativeImperatives),
      negativeImperatives: Boolean(tc.negativeImperatives),
      unitVocab: Boolean(tc.unitVocab),
      summary: cleanFeedbackText(tc.summary) || ''
    },
    strengths: asArray(src.strengths).map((s) => stripLeadingBullet(String(s || ''))).filter(Boolean),
    pronunciationFeedback: asArray(src.pronunciationFeedback).map((p) => ({
      wordOrSound: String(p?.wordOrSound || ''),
      issue: stripLeadingBullet(String(p?.issue || '')),
      tip: stripLeadingBullet(String(p?.tip || ''))
    })),
    grammarAndSyntax: asArray(src.grammarAndSyntax).map((g) => ({
      original: String(g?.original || ''),
      corrected: String(g?.corrected || ''),
      explanation: stripLeadingBullet(String(g?.explanation || ''))
    })),
    advice: cleanFeedbackText(src.advice || src.pedagogicalAdvice) || ''
  };
};

const levelBadgeStyle = (level) => {
  const l = String(level || '').toLowerCase();
  if (l.includes('mid') || l.includes('high') && l.includes('intermediate')) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (l.includes('low')) {
    return 'border-indigo-200 bg-indigo-50 text-indigo-700';
  }
  return 'border-amber-200 bg-amber-50 text-amber-800';
};

const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export default function ExpressionOrale({ onBack }) {
  const [showToolbox, setShowToolbox] = useState(false);
  const [usePrep, setUsePrep] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | prep | recording | paused | recorded
  const [prepLeft, setPrepLeft] = useState(PREP_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [hasListened, setHasListened] = useState(false);
  const [micError, setMicError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const tickRef = useRef(null);
  const prepRef = useRef(null);
  const audioUrlRef = useRef(null);
  const elapsedMsRef = useRef(0);
  const segmentStartRef = useRef(0);

  const clearTimers = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (prepRef.current) {
      clearInterval(prepRef.current);
      prepRef.current = null;
    }
  };

  const releaseStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const discardRecording = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setHasListened(false);
    setElapsed(0);
    elapsedMsRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (prepRef.current) clearInterval(prepRef.current);
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.onstop = null;
        try {
          recorderRef.current.stop();
        } catch (e) {
          /* ignore */
        }
      }
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  const stopRecording = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') {
      try {
        rec.stop();
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  const startTicking = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    segmentStartRef.current = Date.now();
    tickRef.current = setInterval(() => {
      const totalMs = elapsedMsRef.current + (Date.now() - segmentStartRef.current);
      const secs = Math.floor(totalMs / 1000);
      setElapsed(Math.min(secs, MAX_RECORD_SECONDS));
      if (secs >= MAX_RECORD_SECONDS) {
        stopRecording();
      }
    }, 250);
  }, [stopRecording]);

  const beginRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    try {
      const mime = pickRecorderMime();
      const recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: AUDIO_BITS_PER_SECOND })
        : new MediaRecorder(stream, { audioBitsPerSecond: AUDIO_BITS_PER_SECOND });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const type = recorder.mimeType || mime || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type });
        releaseStream();
        if (blob.size === 0) {
          setStatus('idle');
          setMicError("Aucun son n'a été enregistré. Vérifiez votre microphone et réessayez.");
          return;
        }
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        setAudioBlob(blob);
        setAudioUrl(url);
        setHasListened(false);
        setStatus('recorded');
      };
      recorderRef.current = recorder;
      elapsedMsRef.current = 0;
      setElapsed(0);
      recorder.start();
      setStatus('recording');
      startTicking();
    } catch (e) {
      releaseStream();
      setStatus('idle');
      setMicError(
        "L'enregistrement audio n'est pas pris en charge par ce navigateur. Essayez Google Chrome dans un onglet complet."
      );
    }
  }, [startTicking]);

  const handlePauseOrResume = () => {
    const rec = recorderRef.current;
    if (!rec) return;
    if (status === 'recording' && rec.state === 'recording' && typeof rec.pause === 'function') {
      rec.pause();
      elapsedMsRef.current += Date.now() - segmentStartRef.current;
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      setStatus('paused');
    } else if (status === 'paused' && rec.state === 'paused' && typeof rec.resume === 'function') {
      rec.resume();
      setStatus('recording');
      startTicking();
    }
  };

  const handleRecordClick = async () => {
    if (loading) return;
    setMicError(null);
    setError(null);
    setFeedback(null);
    discardRecording();

    if (
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function' ||
      typeof MediaRecorder === 'undefined'
    ) {
      setMicError(
        "Le microphone n'est pas accessible dans cette fenêtre (page intégrée ou navigateur non compatible). Ouvrez l'activité dans un onglet complet pour autoriser le micro."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch (err) {
      const name = err && err.name;
      if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setMicError("Aucun microphone n'a été détecté. Branchez un micro ou un casque, puis réessayez.");
      } else if (name === 'NotReadableError') {
        setMicError("Le microphone est utilisé par une autre application. Fermez-la et réessayez.");
      } else {
        setMicError(
          "L'accès au microphone a été refusé ou bloqué (souvent par la page Google Sites qui contient l'activité). Ouvrez l'activité en plein écran pour autoriser le micro."
        );
      }
      return;
    }

    if (usePrep) {
      setStatus('prep');
      setPrepLeft(PREP_SECONDS);
      const startedAt = Date.now();
      prepRef.current = setInterval(() => {
        const left = PREP_SECONDS - Math.floor((Date.now() - startedAt) / 1000);
        if (left <= 0) {
          clearInterval(prepRef.current);
          prepRef.current = null;
          setPrepLeft(0);
          beginRecording();
        } else {
          setPrepLeft(left);
        }
      }, 250);
    } else {
      beginRecording();
    }
  };

  const handleSkipPrep = () => {
    if (prepRef.current) {
      clearInterval(prepRef.current);
      prepRef.current = null;
    }
    beginRecording();
  };

  const handleCancelPrep = () => {
    clearTimers();
    releaseStream();
    setStatus('idle');
  };

  const handleReset = () => {
    clearTimers();
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.onstop = null;
      try {
        recorderRef.current.stop();
      } catch (e) {
        /* ignore */
      }
    }
    releaseStream();
    discardRecording();
    setStatus('idle');
    setFeedback(null);
    setError(null);
    setMicError(null);
  };

  const handleSubmit = async () => {
    if (!audioBlob || loading || !hasListened) return;
    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const audioBase64 = await blobToBase64(audioBlob);
      const cleanMimeType = (audioBlob.type || 'audio/webm').split(';')[0].trim() || 'audio/webm';
      const data = await callGeminiProxy(
        {
          prompt: buildSpeakingPrompt(),
          audioBase64,
          mimeType: cleanMimeType,
          systemInstruction: SPEAKING_SYSTEM_INSTRUCTION,
          generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
          safetySettings: []
        },
        AI_TIMEOUT_MS
      );
      setFeedback(normalizeSpeakingFeedback(data));
    } catch (err) {
      console.error('Speaking feedback error:', err);
      setError(
        toFrenchError(err) +
          ' Votre enregistrement est conservé : vous pouvez cliquer de nouveau sur « Obtenir une rétroaction IA ».'
      );
    } finally {
      setLoading(false);
    }
  };

  const isBusy = status === 'recording' || status === 'paused' || status === 'prep';
  const inIframe = isInIframe();

  return (
    <div className="eo-container animate-in">
      <style>{STYLE_BLOCK}</style>

      {/* Header */}
      <div className="eo-header">
        <div className="eo-title-group">
          <h2>Expression orale : Conseils de bien-être 🎙️</h2>
          <p>
            Enregistrez un message vocal de {SPEAKING_TASK.targetTime}, réécoutez-le, puis recevez une rétroaction IA
            calibrée ACTFL (Intermediate-Low).
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} className="eo-secondary-btn">
            ← Retour
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Panel: Prompt, Boîte à outils & Recorder */}
        <div className="lg:col-span-6 eo-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">
                Situation d'expression orale • Unité 2
              </h3>
            </div>

            {/* Prompt Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                <h4 className="text-sm font-bold text-slate-900">{SPEAKING_TASK.title}</h4>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  ⏱️ {SPEAKING_TASK.targetTime}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{SPEAKING_TASK.prompt}</p>
              <p className="text-xs text-indigo-700 mt-3 font-semibold">{SPEAKING_TASK.levelTarget}</p>
            </div>

            {/* Collapsible Boîte à outils */}
            <button
              type="button"
              onClick={() => setShowToolbox((v) => !v)}
              aria-expanded={showToolbox}
              className="eo-secondary-btn mb-3"
              style={{ padding: '0.5rem 0.95rem', fontSize: '0.84rem' }}
            >
              {showToolbox ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              {showToolbox ? 'Masquer la Boîte à outils' : '🧰 Boîte à outils (connecteurs & expressions)'}
            </button>

            {showToolbox && (
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 mb-4 space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 block mb-1.5">
                    Connecteurs &amp; amorces
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SPEAKING_TASK.toolbox.connectors.map((w) => (
                      <span key={w} className="eo-chip">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1.5">
                    Impératif affirmatif (au moins 3)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SPEAKING_TASK.toolbox.affirmative.map((w) => (
                      <span
                        key={w}
                        className="eo-chip"
                        style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 block mb-1.5">
                    Impératif négatif (au moins 2)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SPEAKING_TASK.toolbox.negative.map((w) => (
                      <span
                        key={w}
                        className="eo-chip"
                        style={{ background: '#fff1f2', borderColor: '#fecdd3', color: '#9f1239' }}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Vocabulaire du bien-être
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SPEAKING_TASK.toolbox.vocab.map((w) => (
                      <span
                        key={w}
                        className="eo-chip"
                        style={{ background: '#ffffff', borderColor: '#cbd5e1', color: '#334155' }}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Optional Prep Timer Toggle */}
            <label className="flex items-center gap-2 text-xs text-slate-600 font-semibold mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={usePrep}
                disabled={isBusy || loading}
                onChange={(e) => setUsePrep(e.target.checked)}
              />
              <Timer size={14} className="text-indigo-600" />
              Temps de préparation silencieux : 30 s avant l'enregistrement
            </label>

            {/* Mic Error / Iframe Safeguard */}
            {micError && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 mb-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                  <p className="text-sm font-medium">{micError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="eo-primary-btn"
                >
                  <ExternalLink size={14} />
                  Ouvrir l'activité en plein écran
                </button>
              </div>
            )}

            {/* Recorder Box */}
            <div className="eo-recorder">
              {status === 'idle' && (
                <div className="text-sm text-slate-600 font-medium">
                  Prêt(e) ? Cliquez sur « Enregistrer » (objectif : {TARGET_MIN_SECONDS}–{MAX_RECORD_SECONDS} secondes).
                </div>
              )}

              {status === 'prep' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs font-black uppercase tracking-widest text-amber-700">
                    Temps de préparation : {prepLeft}s
                  </div>
                  <div className="text-xs text-slate-600">
                    Préparez vos idées en silence. L'enregistrement démarre automatiquement.
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button type="button" onClick={handleSkipPrep} className="eo-primary-btn">
                      Commencer maintenant
                    </button>
                    <button type="button" onClick={handleCancelPrep} className="eo-secondary-btn">
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {status === 'recording' && (
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="eo-rec-dot" aria-hidden="true" />
                  <Mic size={20} className="text-rose-600" />
                  <span className="font-mono text-lg font-bold text-rose-700">
                    {formatTime(elapsed)} / {formatTime(MAX_RECORD_SECONDS)}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-rose-600">
                    Enregistrement…
                  </span>
                </div>
              )}

              {status === 'paused' && (
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Pause size={18} className="text-amber-600" />
                  <span className="font-mono text-lg font-bold text-amber-700">
                    {formatTime(elapsed)} / {formatTime(MAX_RECORD_SECONDS)}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-amber-700">
                    En pause
                  </span>
                </div>
              )}

              {status === 'recorded' && audioUrl && (
                <div className="space-y-2.5 text-left">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
                      <Volume2 size={14} /> Réécouter votre enregistrement ({formatTime(elapsed)})
                    </span>
                    {hasListened ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ✓ Écouté — prêt pour l'analyse
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        Écoute requise avant l'envoi
                      </span>
                    )}
                  </div>
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full"
                    onPlay={() => setHasListened(true)}
                    onEnded={() => setHasListened(true)}
                  />
                  {!hasListened && (
                    <p className="text-[11px] text-amber-700 font-semibold">
                      Appuyez sur lecture ci-dessus pour réécouter votre message avant d'obtenir la rétroaction IA.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-t border-slate-200 pt-4 mt-6">
            <div className="flex items-center gap-2 flex-wrap">
              {(status === 'idle' || status === 'recorded') && (
                <button type="button" onClick={handleRecordClick} disabled={loading} className="eo-primary-btn">
                  <Mic size={15} /> {status === 'recorded' ? 'Réenregistrer' : 'Enregistrer'}
                </button>
              )}

              {(status === 'recording' || status === 'paused') && (
                <>
                  <button type="button" onClick={handlePauseOrResume} className="eo-pause-btn">
                    {status === 'paused' ? <Play size={15} /> : <Pause size={15} />}
                    {status === 'paused' ? 'Reprendre' : 'Pause'}
                  </button>
                  <button type="button" onClick={stopRecording} className="eo-stop-btn">
                    <Square size={15} /> Arrêter
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleReset}
                disabled={loading || (status === 'idle' && !audioBlob && !micError)}
                className="eo-secondary-btn"
              >
                <RotateCcw size={15} /> Recommencer
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || status !== 'recorded' || !audioBlob || !hasListened}
              className="eo-primary-btn"
              title={!hasListened && status === 'recorded' ? "Écoutez d'abord votre enregistrement" : undefined}
            >
              <Send size={15} />
              {loading ? 'Analyse en cours...' : 'Obtenir une rétroaction IA'}
            </button>
          </div>
        </div>

        {/* Right Panel: ACTFL Feedback Scorecard */}
        <div className="lg:col-span-6 eo-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">
                  Bulletin d'expression orale (ACTFL)
                </h3>
              </div>
              {feedback && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                  ✨ Analyse IA Grade 9
                </span>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 flex items-start gap-2 mb-4">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="eo-loader" />
                <p className="text-sm text-slate-600 font-medium text-center">
                  Gemini écoute votre message : transcription, niveau ACTFL, prononciation et grammaire…
                </p>
              </div>
            )}

            {!feedback && !loading && !error && (
              <div className="text-center py-16 text-slate-500">
                <HelpCircle size={40} className="mx-auto text-slate-400 mb-3" />
                <p className="text-sm font-semibold text-slate-700">Aucun enregistrement soumis pour le moment.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Enregistrez vos conseils, réécoutez votre message, puis cliquez sur « Obtenir une rétroaction IA ».
                </p>
              </div>
            )}

            {feedback && !loading && (
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                {/* 1. Transcription fidèle */}
                {feedback.transcript && (
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                      📝 Transcription fidèle
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed italic whitespace-pre-wrap">
                      « {feedback.transcript} »
                    </p>
                  </div>
                )}

                {/* 2. Niveau ACTFL estimé */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      🎯 Niveau ACTFL estimé
                    </span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full border ${levelBadgeStyle(feedback.proficiencyLevel)}`}>
                      {feedback.proficiencyLevel}
                    </span>
                  </div>
                  {feedback.proficiencyJustification && (
                    <p className="text-xs text-slate-700 leading-relaxed">{feedback.proficiencyJustification}</p>
                  )}
                </div>

                {/* 3. Respect des consignes */}
                <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/70 space-y-2">
                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                    <ClipboardCheck size={13} />
                    Respect des consignes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                        feedback.taskCompletion.affirmativeImperatives
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                    >
                      {feedback.taskCompletion.affirmativeImperatives ? '✓' : '○'} 3+ impératifs affirmatifs
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                        feedback.taskCompletion.negativeImperatives
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                    >
                      {feedback.taskCompletion.negativeImperatives ? '✓' : '○'} 2+ impératifs négatifs
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                        feedback.taskCompletion.unitVocab
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                    >
                      {feedback.taskCompletion.unitVocab ? '✓' : '○'} Vocabulaire Unité 2
                    </span>
                  </div>
                  {feedback.taskCompletion.summary && (
                    <p className="text-xs text-slate-700 leading-relaxed">{feedback.taskCompletion.summary}</p>
                  )}
                </div>

                {/* 4. Points forts */}
                {feedback.strengths.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 space-y-2">
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      Points forts
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

                {/* 5. Prononciation & Fluidité */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-sky-700 uppercase tracking-widest block">
                    🔊 Prononciation &amp; Fluidité
                  </span>
                  {feedback.pronunciationFeedback.length === 0 ? (
                    <p className="text-xs text-slate-500">Bonne prononciation générale, aucun point bloquant signalé.</p>
                  ) : (
                    feedback.pronunciationFeedback.map((p, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                        <div className="font-bold text-sky-700">{p.wordOrSound}</div>
                        <div className="text-slate-700">{p.issue}</div>
                        <div className="text-emerald-700">
                          <span className="font-bold">Conseil :</span> {p.tip}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 6. Corrections grammaticales & lexicales */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest block">
                    ✏️ Corrections grammaticales &amp; lexicales
                  </span>
                  {feedback.grammarAndSyntax.length === 0 ? (
                    <p className="text-xs text-slate-500">Aucune correction grammaticale majeure signalée.</p>
                  ) : (
                    feedback.grammarAndSyntax.map((g, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="line-through text-rose-600 font-medium">« {g.original} »</span>
                          <span className="text-emerald-700 font-bold">➔ « {g.corrected} »</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{g.explanation}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* 7. Conseil pour progresser */}
                {feedback.advice && (
                  <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50 space-y-1">
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={13} />
                      💡 Conseil pour progresser
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed">{feedback.advice}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {inIframe && !micError && (
            <p className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100">
              Astuce : si le micro est bloqué dans Google Sites,{' '}
              <button
                type="button"
                className="underline text-indigo-600 font-semibold"
                onClick={() => window.open(window.location.href, '_blank')}
              >
                ouvrez l'activité en plein écran
              </button>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const STYLE_BLOCK = `
  .eo-container {
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
    font-family: inherit;
  }

  .eo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .eo-title-group h2 {
    font-size: 1.65rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    margin: 0.25rem 0;
    color: #0f172a;
  }

  .eo-title-group p {
    color: #475569;
    font-size: 0.95rem;
    font-weight: 500;
    margin: 0;
    line-height: 1.55;
  }

  .eo-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 1.25rem;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
  }

  .eo-chip {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    background: #eef2ff;
    border: 1px solid #c7d2fe;
    border-radius: 0.5rem;
    color: #4338ca;
    font-size: 0.76rem;
    font-weight: 600;
  }

  .eo-recorder {
    min-height: 92px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 0.9rem;
  }

  .eo-recorder > * {
    width: 100%;
  }

  .eo-rec-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e11d48;
    animation: eo-pulse 1s infinite ease-in-out;
    flex: none;
  }

  @keyframes eo-pulse {
    0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.65); }
    70% { box-shadow: 0 0 0 10px rgba(225, 29, 72, 0); }
    100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
  }

  .eo-primary-btn {
    padding: 0.65rem 1.35rem;
    background: #4f46e5;
    color: #ffffff;
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

  .eo-primary-btn:hover:not(:disabled) {
    background: #4338ca;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
  }

  .eo-primary-btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .eo-primary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .eo-stop-btn {
    padding: 0.65rem 1.25rem;
    background: #e11d48;
    color: #ffffff;
    border: 1px solid #be123c;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.92rem;
    box-shadow: 0 4px 12px rgba(225, 29, 72, 0.22);
    transition: all 0.2s ease;
  }

  .eo-stop-btn:hover {
    background: #be123c;
  }

  .eo-pause-btn {
    padding: 0.65rem 1.25rem;
    background: #f59e0b;
    color: #ffffff;
    border: 1px solid #d97706;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.92rem;
    transition: all 0.2s ease;
  }

  .eo-pause-btn:hover {
    background: #d97706;
  }

  .eo-secondary-btn {
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
    font-size: 0.92rem;
    transition: all 0.2s ease;
  }

  .eo-secondary-btn:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #0f172a;
  }

  .eo-secondary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .eo-loader {
    width: 36px;
    height: 36px;
    border: 4px solid #e0e7ff;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: eo-spin 1s infinite linear;
  }

  @keyframes eo-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
