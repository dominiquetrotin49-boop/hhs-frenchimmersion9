const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxSKXy7BT9DF4YAsJgmflNvI6jD9jPP_Qxq-XvvP09ObjPeUM2RqvtRtExumoFVLG6p/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const studentText = (body.studentText || body.text || body.prompt || '').trim();

  if (!studentText) {
    return res.status(400).json({ error: 'Texte vide.' });
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        prompt: body.prompt || studentText,
        studentText
      })
    });

    const rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { feedback: rawText };
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Erreur proxy Apps Script:', err);
    return res.status(500).json({ error: err?.message || "Erreur lors de l'analyse." });
  }
}
