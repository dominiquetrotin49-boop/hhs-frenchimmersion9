import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, AlertCircle } from 'lucide-react';
import './Amnesique.css';

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

    try {
      const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbxI4aY57cD5wMLNKGQYbZWXppMWo07Hy-Zz_Fi0XRYdk41YFIiAw4titVYL5Pwg-n_0/exec';
      const conversationContext = messages.map(m => `${m.role === 'user' ? 'Élève' : 'Personnage'}: ${m.content}`).join('\n');
      const promptText = `Tu joues le rôle d'un personnage amnésique sympathique pour des élèves de 9e année en immersion française (tour ${turnCount + 1}/10).\nHistorique:\n${conversationContext}\nÉlève: ${userMessage}\nRéponds brièvement en français :`;

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          prompt: promptText,
          model: 'gemini-3.8-flash',
          history: messages,
          message: userMessage,
          turnCount: turnCount + 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur s'est produite");
      }

      const replyText =
        data?.text ||
        data?.reply ||
        data?.response ||
        data?.result ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Je commence à me souvenir d'un détail...";

      setMessages([...newMessages, { role: 'model', content: replyText }]);
    } catch (err) {
      console.error(err);
      setError(err.message);
      // Remove the user message if API failed, so they can try again
      setMessages(messages);
      setInput(userMessage);
    } finally {
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
