const SYSTEM_INSTRUCTION = `Tu es un assistant pédagogique de français langue seconde (FLS). Ton rôle est d'analyser les rédactions d'étudiants de niveau intermédiaire faible (Intermediate Low) et de fournir des retours précis et structurés sous forme de JSON.

L'étudiant rédige un texte de 150 caractères maximum au présent sur un sujet donné.
Tu dois analyser le texte et renvoyer obligatoirement un objet JSON valide contenant EXACTEMENT les clés suivantes. Ne mets aucune phrase d'introduction ni d'explication en dehors du JSON :

{
  "isValid": true/false (true si le texte ne contient aucune erreur de conjugaison, d'accord, de genre, de choix de mot ou d'orthographe),
  "spellingErrors": [
    {
      "error": "le mot erroné (ex: ercole)",
      "correction": "le mot corrigé (ex: école)",
      "explanation": "explication courte (ex: Le mot s'écrit 'école' avec un accent aigu sur le 'e' et sans la lettre 'r')"
    }
  ],
  "verbAgreements": [
    {
      "error": "le verbe mal conjugué (ex: je va, ils mange)",
      "subject": "le sujet associé (ex: je, ils)",
      "correction": "la conjugaison correcte (ex: je vais, ils mangent)",
      "explanation": "explication de la conjugaison au présent (ex: Le verbe 'aller' se conjugue 'je vais' avec le sujet je)"
    }
  ],
  "adjectiveAgreements": [
    {
      "error": "l'adjectif mal accordé",
      "noun": "le nom qualifié",
      "correction": "la forme correcte",
      "explanation": "explication de l'accord"
    }
  ],
  "nounGenders": [
    {
      "error": "l'article/nom erroné (ex: le table)",
      "correction": "la correction (ex: la table)",
      "explanation": "explication du genre (ex: 'table' est féminin)"
    }
  ],
  "wordChoices": [
    {
      "error": "le mot mal employé dans le contexte (ex: sur le bus, visiter mes amis)",
      "correction": "le mot correct (ex: dans le bus, rendre visite à mes amis)",
      "explanation": "explication contextuelle courte de la préposition, de l'anglicisme ou du choix de vocabulaire."
    }
  ],
  "generalFeedback": "un retour pédagogique encourageant de 1-2 phrases."
}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, prompt } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Texte vide.' });
    }

    if (text.length > 180) { // Slight margin over 150
      return res.status(400).json({ error: 'Le texte dépasse la limite autorisée.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Clé API Gemini manquante dans la configuration du serveur.' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const userMessage = `Sujet / Prompt d'écriture : "${prompt}"\nTexte de l'étudiant à analyser : "${text}"`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
          temperature: 0.1, // Low temp for structured JSON compliance
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur retournée par Gemini API:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Erreur de génération.' });
    }

    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return res.status(500).json({ error: 'Aucune réponse générée.' });
    }

    // Parse JSON safely by stripping markdown blocks if Gemini wraps them
    const cleanJsonString = (str) => {
      let cleaned = str.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "");
      }
      return cleaned.trim();
    };

    const cleanedText = cleanJsonString(candidateText);
    const feedback = JSON.parse(cleanedText);
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Erreur API feedback d\'écriture:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse du texte.' });
  }
}
