import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel.' });
  }

  const { studentText, promptSubject, promptInstructions, targetVocab, unitTheme } = req.body;

  if (!studentText || studentText.trim().length === 0) {
    return res.status(400).json({ error: 'Texte vide.' });
  }

  const systemInstruction = `Tu es un professeur de français bienveillant et rigoureux pour des élèves en immersion française au lycée (Grade 9).
Ton rôle est d'analyser le travail de rédaction d'un élève avec clarté, SANS JAMAIS ATTRIBUER DE NOTE CHIFFRÉE.

Critères d'évaluation Grade 9 :
1. Points forts (richesse du vocabulaire thématique, structures de phrases claires).
2. Orthographe & Typographie (accents é, è, ê, à, ç, apostrophes et élisions j', l', d', qu', c').
3. Conjugaison & Temps verbaux (présent de l'indicatif, passé composé avec avoir/être, futur proche).
4. Accords essentiels (accords sujet-verbe, accords adjectifs masculin/féminin et singulier/pluriel).
5. Syntaxe & Anglicismes (faux-amis courants, prépositions simples).

Thème d'unité / Sujet : "${promptSubject || unitTheme || "Atelier d'Écriture"}"
Consignes : "${promptInstructions || 'Rédigez votre paragraphe en appliquant les notions vues en classe.'}"
Vocabulaire cible suggéré : ${(targetVocab || []).join(', ')}`;

  const prompt = `Texte de l'élève à analyser :\n"""\n${studentText}\n"""`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Points forts observés dans la rédaction.'
            },
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: {
                    type: Type.STRING,
                    enum: ['Conjugaison', 'Orthographe', 'Syntaxe & Anglicismes', 'Accords & Genre', 'Vocabulaire']
                  },
                  originalSegment: { type: Type.STRING },
                  suggestedCorrection: { type: Type.STRING },
                  ruleExplanation: { type: Type.STRING }
                },
                required: ['category', 'originalSegment', 'suggestedCorrection', 'ruleExplanation']
              }
            },
            pedagogicalAdvice: {
              type: Type.STRING,
              description: 'Conseil constructif et bienveillant pour progresser.'
            }
          },
          required: ['strengths', 'corrections', 'pedagogicalAdvice']
        }
      }
    });

    const parsedFeedback = JSON.parse(response.text);
    return res.status(200).json(parsedFeedback);
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return res.status(500).json({ error: error.message || "Erreur interne lors de l'analyse." });
  }
}
