import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, AlertCircle } from 'lucide-react';
import './Amnesique.css';

const PROXY_URL =
  'https://script.google.com/macros/s/AKfycbxSKXy7BT9DF4YAsJgmflNvI6jD9jPP_Qxq-XvvP09ObjPeUM2RqvtRtExumoFVLG6p/exec';

// Secret the student must uncover by asking questions (edit here to change the game).
const AMNESIQUE_SECRET = {
  objet: "un carnet de voyage rouge contenant des photos",
  evenement: "un feu d'artifice sur la plage le soir du 14 juillet"
};

const AMNESIQUE_SYSTEM_INSTRUCTION = `Tu joues le rôle d'un personnage sympathique et un peu étourdi qui souffre d'amnésie partielle, dans un jeu de classe pour des élèves de 9e année en immersion française.
Tu as passé de superbes vacances cet été, mais tu as oublié un objet très important et un événement. Tu connais la vérité, mais tu ne peux la révéler que par petits indices.

Vérité secrète (ne la révèle JAMAIS directement) :
- Objet oublié : ${AMNESIQUE_SECRET.objet}
- Événement oublié : ${AMNESIQUE_SECRET.evenement}

Règles :
- Réponds toujours en français simple (niveau 9e année), en 1 à 3 phrases courtes, avec un ton chaleureux et encourageant.
- Donne un indice progressif seulement si la question de l'élève est précise et bien formulée (où, quand, avec qui, comment, de quelle couleur...). Si la question est vague, réponds que tu ne te souviens pas bien et invite l'élève à poser une question plus précise.
- Si l'élève devine correctement l'objet ou l'événement, félicite-le avec enthousiasme et confirme.
- Si l'élève fait une erreur de français, reformule naturellement ta réponse avec la forme correcte (sans le corriger lourdement).
- N'utilise jamais l'anglais. Pas de listes à puces ; mets en gras (**mot**) uniquement un mot-clé important.`;

const AMNESIQUE_GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 300
};

// Removes duplicated leading bullet markers such as "- •" so only one bullet remains.
function cleanBullets(text) {
  return text
    .replace(/^[ \t]*(?:[-*•·–—][ \t]*){2,}/gm, '• ')
    .trim();
}

export default function Amnesique() {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Bonjour ! Je me souviens d'avoir passé de superbes vacances cet été, mais... j'ai oublié un objet très important et un événement ! Posez-moi des questions pour m'aider à retrouver la mémoire." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const frenchAccents = ['é', 'è', 'à', 'ù', 'ç', 'â', 'ê', 'î', 'ô', 'û', 'ë', 'ï', 'œ', 'æ'];
  
  // Exclude the initial greeting from the turn count to be fair to the student
  const turnCount = messages.filter(m => m.role === 'user').length;
  const maxTurns = 10;
  const isGameOver = turnCount >= maxTurns;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isGameOver) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    
    // Optimistic UI update
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const conversationContext = messages.map(m => `${m.role === 'user' ? 'Élève' : 'Personnage'}: ${m.content}`).join('\n');
      const userPrompt = `Historique de la conversation :\n${conversationContext}\nÉlève: ${userMessage}\n\nQuestion ${turnCount + 1} sur ${maxTurns}. Réponds en tant que le personnage amnésique :`;

      const response = await fetch(PROXY_URL, {
        method: 'POST',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          prompt: userPrompt,
          systemInstruction: AMNESIQUE_SYSTEM_INSTRUCTION,
          generationConfig: AMNESIQUE_GENERATION_CONFIG
        })
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { text: rawText };
      }

      if (data && data.error) {
        const errMsg = typeof data.error === 'string' ? data.error : data.error.message || JSON.stringify(data.error);
        setError(errMsg);
        setMessages(messages);
        setInput(userMessage);
        return;
      }

      const feedbackText =
        data.feedback ||
        data.text ||
        data.response ||
        data.result ||
        data.error ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.reply ||
        (typeof data === 'string' ? data : JSON.stringify(data));

      setMessages([...newMessages, { role: 'model', content: cleanBullets(String(feedbackText)) }]);
    } catch (err) {
      console.error(err);
      const message =
        err.name === 'AbortError'
          ? "Le serveur IA met trop de temps à répondre (délai dépassé). Veuillez réessayer."
          : err.message || "Une erreur s'est produite.";
      setError(message);
      // Remove the user message if API failed, so they can try again
      setMessages(messages);
      setInput(userMessage);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      { role: 'model', content: "Bonjour ! Je me souviens d'avoir passé de superbes vacances cet été, mais... j'ai oublié un objet très important et un événement ! Posez-moi des questions pour m'aider à retrouver la mémoire." }
    ]);
    setInput('');
    setError(null);
  };

  const handleAccentClick = (char) => {
    if (isLoading || isGameOver) return;
    const el = inputRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const text = el.value;

    const newText = text.slice(0, start) + char + text.slice(end);
    setInput(newText);

    // Set focus and restore cursor position after render
    setTimeout(() => {
      el.focus();
      const newPos = start + char.length;
      el.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Helper function to render bold markdown from the API
  const renderFormattedText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="amnesique-container">
      {/* Header */}
      <div className="amnesique-header">
        <div className="amnesique-title-group">
          <h2>L'Amnésique en Ligne 🕵️</h2>
          <p>Posez des questions pour l'aider !</p>
        </div>
        <div className="amnesique-stats">
          <div className="amnesique-turn-badge">
            🎯 Questions restantes : {maxTurns - turnCount}/{maxTurns}
          </div>
          <button 
            onClick={handleReset}
            className="amnesique-reset-btn"
            title="Recommencer"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded shadow-sm flex items-center gap-2">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Chat Area */}
      <div className="amnesique-chat-area">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`amnesique-msg-wrapper ${msg.role === 'user' ? 'user' : 'model'}`}
          >
            <div className="amnesique-bubble">
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.role === 'model' ? renderFormattedText(msg.content) : msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="amnesique-msg-wrapper model">
            <div className="amnesique-typing-loader">
              <div className="amnesique-dot" style={{ animationDelay: '0ms' }}></div>
              <div className="amnesique-dot" style={{ animationDelay: '150ms' }}></div>
              <div className="amnesique-dot" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="amnesique-input-area">
        <form onSubmit={handleSubmit} className="amnesique-form">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isGameOver}
            placeholder={isGameOver ? "Le jeu est terminé. Cliquez sur Recommencer." : "Écrivez votre question en français..."}
            className="amnesique-input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isGameOver}
            className="amnesique-submit-btn"
          >
            <Send size={24} />
          </button>
        </form>

        {/* Accent Bar */}
        <div className="amnesique-accent-bar">
          {frenchAccents.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => handleAccentClick(char)}
              disabled={isLoading || isGameOver}
              className="amnesique-accent-btn"
            >
              {char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
