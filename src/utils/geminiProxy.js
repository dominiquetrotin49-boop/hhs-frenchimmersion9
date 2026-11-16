// Shared client for the Google Apps Script Gemini proxy (GitHub Pages / Google Sites).
// Set VITE_GEMINI_PROXY_URL in .env, or paste your Apps Script /exec URL below.
const DEFAULT_PROXY_URL =
  'https://script.google.com/macros/s/AKfycbxSKXy7BT9DF4YAsJgmflNvI6jD9jPP_Qxq-XvvP09ObjPeUM2RqvtRtExumoFVLG6p/exec';

export const GEMINI_PROXY_URL =
  import.meta.env.VITE_GEMINI_PROXY_URL ||
  import.meta.env.VITE_API_PROXY_URL ||
  DEFAULT_PROXY_URL;

export const GEMINI_TIMEOUT_MS = 60000;

export const isProxyConfigured = () =>
  /^https:\/\/script\.google(usercontent)?\.com\//.test(GEMINI_PROXY_URL);

// Strips doubled bullets such as "- •" or "•\n-" produced by the model.
export const cleanFeedbackText = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/•\s*\n\s*[-*]\s*/g, '- ')
    .replace(/(^|\n)\s*[-*]\s*•\s*/g, '$1- ')
    .replace(/[-*]\s+•\s*/g, '- ')
    .replace(/•\s*•+/g, '•')
    .trim();
};

// Strips any leading bullet marker (•, -, *) from an individual list item string.
export const stripLeadingBullet = (value) => {
  if (typeof value !== 'string') return value;
  return cleanFeedbackText(value).replace(/^\s*(?:[-*•]+\s*)+/, '').trim();
};

// Strips ```json / ``` markdown fences around a model answer.
export const stripFences = (s) =>
  String(s || '').replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

// Pulls the real answer out of a raw Gemini response (candidates[0].content.parts),
// skipping any `thought: true` parts (gemini-3.x "thinking" models).
export const extractCandidateText = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .filter((p) => p && !p.thought && typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
    .trim();
};

// JSON.parse with fence stripping and a fallback to the first {...} block.
export const tryParseJson = (raw) => {
  const cleaned = stripFences(raw);
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
};

// Picks the first usable text field out of a proxy response (or a raw Gemini response).
export const pickResponseText = (data) =>
  extractCandidateText(data) ||
  data?.feedback || data?.text || data?.response || data?.result || data?.reply || '';

/**
 * Returns an object holding the structured JSON answer. If `data` already contains one of
 * `expectedKeys` it is used as-is; otherwise the text of the response is fence-stripped and
 * parsed (first {...} block fallback) and merged over `data`.
 * Returns `{ ...data, __parsed: false }` when nothing could be parsed.
 */
export const resolveJsonPayload = (data, expectedKeys = []) => {
  const src = data || {};
  if (expectedKeys.some((k) => src[k] !== undefined && src[k] !== null)) {
    return { ...src, __parsed: true };
  }
  const parsed = tryParseJson(pickResponseText(src));
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return { ...src, ...parsed, __parsed: true };
  }
  return { ...src, __parsed: false };
};

/**
 * Sends { prompt, systemInstruction, generationConfig, safetySettings[, audioBase64, mimeType, contents] }
 * to the Apps Script proxy with a 60 s AbortController timeout.
 * Resolves with the parsed JSON body; throws an Error (with a user-readable
 * message) on timeout, network failure, invalid JSON or `data.error`.
 * clearTimeout always runs in `finally`.
 */
export async function callGeminiProxy(payload, timeoutMs = GEMINI_TIMEOUT_MS) {
  if (!isProxyConfigured()) {
    throw new Error(
      "Le service d'IA n'est pas configuré (URL du proxy Apps Script manquante)."
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(GEMINI_PROXY_URL, {
      method: 'POST',
      redirect: 'follow',
      // text/plain avoids a CORS preflight, which Apps Script cannot answer.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseErr) {
      throw new Error(
        "Réponse invalide du serveur d'IA. Vérifiez le déploiement du proxy Apps Script."
      );
    }

    if (data && data.error) {
      const msg =
        typeof data.error === 'string'
          ? data.error
          : data.error.message || JSON.stringify(data.error);
      const details = data.details
        ? ` (${typeof data.details === 'string' ? data.details : JSON.stringify(data.details)})`
        : '';
      throw new Error(msg + details);
    }
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    return data;
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new Error(
        "Le délai de 60 secondes est dépassé. Vérifiez votre connexion et réessayez."
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
