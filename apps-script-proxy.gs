/**
 * Immersion-Gemini-Proxy — Google Apps Script Web App
 * Drop-in replacement for the former Vercel serverless functions
 * (/api/writing-feedback, /api/amnesique, and multimodal Expression Orale).
 *
 * SETUP (one time):
 *   1. Project Settings → Script properties → add  GEMINI_API_KEY = <your key>
 *   2. Deploy → Manage deployments → Edit (pencil) → Version: "New version" → Deploy
 *      (Execute as: Me · Who has access: Anyone)
 *
 * REQUEST (POST, body sent as text/plain to avoid a CORS preflight):
 *   { "prompt": "...",                       // required (or contents)
 *     "audioBase64": "...",                  // optional Base64 audio (speaking tasks)
 *     "mimeType": "audio/webm",              // optional MIME type for audioBase64
 *     "systemInstruction": "...",            // optional (defaults below)
 *     "generationConfig": { ... },           // optional (defaults below)
 *     "safetySettings": [ ... ] }            // optional
 *
 * RESPONSE (always JSON):
 *   success → { text, feedback, response, result, reply, model, source:"ai", ...parsedJsonFields }
 *   failure → { error, details:[...] }
 */

var MODELS = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"];
var API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";
var RETRY_DELAY_MS = 1000;

var DEFAULT_SYSTEM_INSTRUCTION =
  "Tu es un professeur de français bienveillant et rigoureux pour des élèves en immersion française au lycée (Grade 9 / 9e année).\n" +
  "Ton rôle est d'analyser le travail de rédaction d'un élève avec clarté et précision, SANS JAMAIS ATTRIBUER DE NOTE CHIFFRÉE.\n\n" +
  "Critères d'évaluation Grade 9 Immersion :\n" +
  "1. Points forts (vocabulaire thématique, phrases complètes, connecteurs de base).\n" +
  "2. Orthographe & Typographie (accents é, è, ê, à, â, ç, apostrophes et élisions j', l', d', qu', c').\n" +
  "3. Conjugaison & Temps verbaux (présent de l'indicatif, verbes pronominaux, passé composé avec avoir/être, imparfait de description).\n" +
  "4. Accords essentiels (accords sujet-verbe, accords adjectifs masculin/féminin et singulier/pluriel, accords des noms).\n" +
  "5. Syntaxe & Anglicismes (faux-amis courants, prépositions simples).\n\n" +
  "Consignes impératives pour les corrections :\n" +
  "- Si le texte de l'élève contient des fautes réelles, tu DOIS les répertorier dans \"corrections\".\n" +
  "- Ne dis JAMAIS qu'un texte est sans faute s'il comporte des erreurs évidentes.\n" +
  "- Si et seulement si le texte ne comporte absolument aucune erreur, renvoie une liste \"corrections\" vide [] et \"isValid\": true.\n" +
  "- Si le texte a au moins une erreur, \"isValid\" DOIT être false.\n\n" +
  "Réponds STRICTEMENT sous forme d'un objet JSON valide respectant ce format :\n" +
  "{\n" +
  "  \"isValid\": boolean,\n" +
  "  \"generalFeedback\": \"string (appréciation générale globale bienveillante mais honnête)\",\n" +
  "  \"strengths\": [\"string (point fort 1)\", \"string (point fort 2)\"],\n" +
  "  \"corrections\": [\n" +
  "    {\n" +
  "      \"category\": \"Conjugaison\" | \"Orthographe\" | \"Syntaxe & Anglicismes\" | \"Accords & Genre\" | \"Vocabulaire\",\n" +
  "      \"originalSegment\": \"extrait exact contenant la faute\",\n" +
  "      \"suggestedCorrection\": \"version corrigée\",\n" +
  "      \"ruleExplanation\": \"explication claire et pédagogique de la règle\"\n" +
  "    }\n" +
  "  ],\n" +
  "  \"pedagogicalAdvice\": \"string (conseil concret pour continuer à progresser)\"\n" +
  "}";

var DEFAULT_GENERATION_CONFIG = {
  temperature: 0.1,
  responseMimeType: "application/json"
};

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.prompt) {
    return jsonOut_(handlePrompt_({
      prompt: p.prompt,
      systemInstruction: p.systemInstruction,
      generationConfig: parseMaybeJson_(p.generationConfig)
    }));
  }
  return jsonOut_({
    status: "ok",
    service: "Immersion-Gemini-Proxy",
    models: MODELS,
    keyConfigured: !!getApiKey_()
  });
}

function doPost(e) {
  var body = {};
  try {
    var raw = (e && e.postData && e.postData.contents) || "";
    body = raw ? JSON.parse(raw) : {};
  } catch (err) {
    return jsonOut_({ error: "Corps de requête JSON invalide : " + err.message });
  }
  return jsonOut_(handlePrompt_(body));
}

function handlePrompt_(body) {
  var apiKey = getApiKey_();
  if (!apiKey) {
    return { error: "GEMINI_API_KEY n'est pas configurée dans les propriétés du script (Paramètres du projet → Propriétés du script)." };
  }

  var prompt = String((body && body.prompt) || "").trim();
  var hasContents = Array.isArray(body && body.contents) && body.contents.length > 0;
  if (!prompt && !hasContents) {
    return { error: "Texte vide : le champ « prompt » est requis." };
  }

  var systemInstruction =
    typeof body.systemInstruction === "string" && body.systemInstruction.trim()
      ? body.systemInstruction.trim()
      : (body.systemInstruction && body.systemInstruction.parts && body.systemInstruction.parts[0] && body.systemInstruction.parts[0].text) ||
        DEFAULT_SYSTEM_INSTRUCTION;

  var generationConfig = isPlainObject_(body.generationConfig) ? body.generationConfig : DEFAULT_GENERATION_CONFIG;

  // Optional audio (speaking activities): attached to the user turn as inlineData
  var audioBase64 = typeof body.audioBase64 === "string" ? body.audioBase64.replace(/^data:[^;]+;base64,/, "") : "";
  var audioMime = String(body.mimeType || "audio/webm").split(";")[0].trim() || "audio/webm";
  var userParts = [{ text: prompt || "Évalue l'audio joint." }];
  if (audioBase64) {
    userParts.push({ inlineData: { mimeType: audioMime, data: audioBase64 } });
  }

  var payload = {
    contents: hasContents ? body.contents : [{ role: "user", parts: userParts }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: generationConfig
  };
  if (Array.isArray(body.safetySettings) && body.safetySettings.length > 0) {
    payload.safetySettings = body.safetySettings;
  }

  var details = [];

  for (var i = 0; i < MODELS.length; i++) {
    var model = MODELS[i];
    var attempt = 0;

    while (attempt < 2) {
      attempt++;
      var result = callGemini_(model, apiKey, payload);

      if (result.ok) {
        return buildSuccess_(result.text, model, generationConfig);
      }

      details.push({ model: model, status: result.status, message: result.message });

      if ((result.status === 503 || result.status === 429) && attempt < 2) {
        Utilities.sleep(RETRY_DELAY_MS);
        continue;
      }
      break;
    }
  }

  var last = details[details.length - 1] || {};
  return {
    error: "Tous les modèles Gemini ont échoué. Dernière erreur (" + (last.model || "?") + ", HTTP " + (last.status || "?") + ") : " + (last.message || "inconnue"),
    details: details
  };
}

function callGemini_(model, apiKey, payload) {
  try {
    var res = UrlFetchApp.fetch(API_BASE + model + ":generateContent", {
      method: "post",
      contentType: "application/json",
      headers: { "x-goog-api-key": apiKey },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    var status = res.getResponseCode();
    var data = {};
    try { data = JSON.parse(res.getContentText()); } catch (ignore) {}

    if (status !== 200) {
      return { ok: false, status: status, message: (data.error && data.error.message) || ("Erreur HTTP " + status) };
    }

    var candidate = data.candidates && data.candidates[0];
    var parts = (candidate && candidate.content && candidate.content.parts) || [];
    var text = parts
      .filter(function (p) { return p && !p.thought && typeof p.text === "string"; })
      .map(function (p) { return p.text; })
      .join("")
      .trim();

    if (!text) {
      var reason = (candidate && candidate.finishReason) || (data.promptFeedback && data.promptFeedback.blockReason) || "réponse vide";
      return { ok: false, status: 502, message: "Aucun texte retourné par Gemini (" + reason + ")." };
    }
    return { ok: true, status: 200, text: text };
  } catch (err) {
    return { ok: false, status: 0, message: "Erreur réseau : " + err.message };
  }
}

function buildSuccess_(rawText, model, generationConfig) {
  var out = {
    text: rawText,
    feedback: rawText,
    response: rawText,
    result: rawText,
    reply: rawText,
    model: model,
    source: "ai"
  };

  var wantsJson = generationConfig && generationConfig.responseMimeType === "application/json";
  if (!wantsJson) return out;

  var parsed = null;
  var cleaned = stripFences_(rawText);
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    var start = cleaned.indexOf("{");
    var end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try { parsed = JSON.parse(cleaned.slice(start, end + 1)); } catch (e2) { return out; }
    } else {
      return out;
    }
  }
  if (!isPlainObject_(parsed)) return out;

  for (var k in parsed) {
    if (Object.prototype.hasOwnProperty.call(parsed, k) && !(k in out && k !== "feedback")) {
      out[k] = parsed[k];
    }
  }

  // Legacy writing-feedback fields when returning writing corrections
  if (Array.isArray(parsed.corrections)) {
    var corrections = parsed.corrections;
    var isValid = typeof parsed.isValid === "boolean" ? parsed.isValid : corrections.length === 0;
    var verbAgreements = [], adjectiveAgreements = [], nounGenders = [], spellingErrors = [], wordChoices = [];
    corrections.forEach(function (c) {
      var item = { error: c.originalSegment, correction: c.suggestedCorrection, explanation: c.ruleExplanation };
      if (c.category === "Conjugaison") {
        verbAgreements.push({ error: item.error, correction: item.correction, explanation: item.explanation, subject: c.originalSegment });
      } else if (c.category === "Accords & Genre") {
        adjectiveAgreements.push({ error: item.error, correction: item.correction, explanation: item.explanation, noun: c.originalSegment });
      } else if (c.category === "Orthographe") {
        spellingErrors.push(item);
      } else {
        wordChoices.push(item);
      }
    });
    out.isValid = isValid;
    out.generalFeedback = parsed.generalFeedback || (isValid ? "Excellent travail ! Votre texte est bien rédigé." : "Plusieurs erreurs ont été relevées ci-dessous.");
    out.strengths = parsed.strengths || [];
    out.corrections = corrections;
    out.pedagogicalAdvice = parsed.pedagogicalAdvice || "Relisez attentivement vos phrases en vérifiant les accords.";
    out.verbAgreements = verbAgreements;
    out.adjectiveAgreements = adjectiveAgreements;
    out.nounGenders = nounGenders;
    out.spellingErrors = spellingErrors;
    out.wordChoices = wordChoices;
    out.pointsForts = out.strengths;
    out.ameliorations = corrections.map(function (c) {
      return c.originalSegment + " ➔ " + c.suggestedCorrection + " (" + c.ruleExplanation + ")";
    });
    out.feedback = out.generalFeedback;
  }

  return out;
}

function getApiKey_() {
  var key = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  return key ? key.trim() : "";
}

function stripFences_(s) {
  return String(s || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

function isPlainObject_(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function parseMaybeJson_(v) {
  if (!v) return undefined;
  try { return JSON.parse(v); } catch (err) { return undefined; }
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
