export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel or environment.' });
  }

  const body = req.body || {};
  const studentText = (body.studentText || body.text || '').trim();
  const promptSubject = body.promptSubject || body.prompt || body.unitTheme || "Atelier d'Écriture";
  const promptInstructions = body.promptInstructions || body.prompt || 'Rédigez votre paragraphe en appliquant les notions vues en classe.';
  const targetVocab = Array.isArray(body.targetVocab) ? body.targetVocab : [];

  if (!studentText) {
    return res.status(400).json({ error: 'Texte vide.' });
  }

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
  "generalFeedback": "string (appréciation générale globale bienveillante mais honnête)",
  "strengths": ["string (point fort 1)", "string (point fort 2)"],
  "corrections": [
    {
      "category": "Conjugaison" | "Orthographe" | "Syntaxe & Anglicismes" | "Accords & Genre" | "Vocabulaire",
      "originalSegment": "extrait exact contenant la faute",
      "suggestedCorrection": "version corrigée",
      "ruleExplanation": "explication claire et pédagogique de la règle"
    }
  ],
  "pedagogicalAdvice": "string (conseil concret pour continuer à progresser)"
}`;

  const userPrompt = `Sujet : "${promptSubject}"
Consignes : "${promptInstructions}"
Vocabulaire cible suggéré : ${targetVocab.length > 0 ? targetVocab.join(', ') : 'Aucun'}

Texte de l'élève à analyser :
"""
${studentText}
"""`;

  const models = ['gemini-3.6-flash', 'gemini-3.5-flash-lite'];
  let lastError = null;

  for (const model of models) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        throw new Error(data.error ? data.error.message : `Erreur HTTP ${response.status}`);
      }

      const rawText = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(rawText);

      const corrections = Array.isArray(parsed.corrections) ? parsed.corrections : [];
      const isValid = (typeof parsed.isValid === 'boolean') ? parsed.isValid : (corrections.length === 0);

      // Backwards-compatible mappings for older UI components
      const verbAgreements = [];
      const adjectiveAgreements = [];
      const nounGenders = [];
      const spellingErrors = [];
      const wordChoices = [];

      corrections.forEach(c => {
        const item = {
          error: c.originalSegment,
          correction: c.suggestedCorrection,
          explanation: c.ruleExplanation
        };
        if (c.category === 'Conjugaison') {
          verbAgreements.push({ ...item, subject: c.originalSegment });
        } else if (c.category === 'Accords & Genre') {
          adjectiveAgreements.push({ ...item, noun: c.originalSegment });
        } else if (c.category === 'Orthographe') {
          spellingErrors.push(item);
        } else {
          wordChoices.push(item);
        }
      });

      return res.status(200).json({
        isValid,
        generalFeedback: parsed.generalFeedback || (isValid ? "Excellent travail ! Votre texte est bien rédigé." : "Plusieurs erreurs ont été relevées ci-dessous."),
        strengths: parsed.strengths || [],
        corrections,
        pedagogicalAdvice: parsed.pedagogicalAdvice || "Relisez attentivement vos phrases en vérifiant les accords.",
        source: 'ai',
        // Backwards compatibility keys
        verbAgreements,
        adjectiveAgreements,
        nounGenders,
        spellingErrors,
        wordChoices,
        pointsForts: parsed.strengths || [],
        ameliorations: corrections.map(c => `${c.originalSegment} ➔ ${c.suggestedCorrection} (${c.ruleExplanation})`)
      });
    } catch (err) {
      lastError = err;
      console.warn(`Tentative avec ${model} échouée :`, err.message);
    }
  }

  console.error("Tous les modèles Gemini ont échoué:", lastError);
  return res.status(500).json({ error: lastError?.message || "Erreur lors de l'analyse avec Gemini." });
}
