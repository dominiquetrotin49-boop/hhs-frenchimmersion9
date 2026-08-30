import React, { useState, useRef } from 'react';

const FRENCH_ACCENTS = [
  'é', 'è', 'ê', 'ë', 
  'à', 'â', 'ù', 'û', 
  'î', 'ï', 'ô', 'ç', 
  'œ', '«', '»',
  'É', 'À', 'Ç'
];

export default function WritingPrompt({
  title = "Atelier d'Écriture 📝",
  instructions = "Rédigez votre texte en respectant les consignes.",
  targetVocab = [],
  minWords = 40,
  unitTheme = ""
}) {
  const [studentText, setStudentText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const textareaRef = useRef(null);

  const words = studentText.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = studentText.trim() === '' ? 0 : words.length;
  const canSubmit = wordCount >= minWords;

  const handleInsertAccent = (char) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setStudentText(prev => prev + char);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = studentText.substring(0, start) + char + studentText.substring(end);

    setStudentText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  const handleFetchFeedback = async () => {
    if (!canSubmit || isLoading) return;
    setIsLoading(true);
    setErrorMsg('');
    setFeedback(null);

    try {
      const response = await fetch('/api/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentText,
          promptSubject: title,
          promptInstructions: instructions,
          targetVocab,
          unitTheme
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur serveur (${response.status})`);
      }

      setFeedback(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("⚠️ Impossible d'obtenir le retour pédagogique pour le moment. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      marginTop: '20px',
      marginBottom: '30px',
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #cbd5e1',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      color: '#0f172a'
    }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
        {instructions}
      </p>

      {targetVocab && targetVocab.length > 0 && (
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Vocabulaire suggéré :</span>
          {targetVocab.map((vocab, i) => (
            <span key={i} style={{
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {vocab}
            </span>
          ))}
        </div>
      )}

      {/* Accent Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '10px',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: '#f1f5f9',
        borderRadius: '10px',
        border: '1px solid #cbd5e1'
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginRight: '6px' }}>
          Accents :
        </span>
        {FRENCH_ACCENTS.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => handleInsertAccent(char)}
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'background-color 0.1s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Writing Textarea */}
      <textarea
        ref={textareaRef}
        rows={6}
        value={studentText}
        onChange={(e) => setStudentText(e.target.value)}
        placeholder="Rédigez votre paragraphe ici..."
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          fontSize: '1.05rem',
          lineHeight: '1.6',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxSizing: 'border-box',
          resize: 'vertical',
          outline: 'none',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
        }}
      />

      {/* Threshold & Submit Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{
          fontSize: '0.9rem',
          fontWeight: '600',
          color: canSubmit ? '#15803d' : '#d97706',
          backgroundColor: canSubmit ? '#f0fdf4' : '#fffbeb',
          padding: '4px 12px',
          borderRadius: '20px',
          border: `1px solid ${canSubmit ? '#bbf7d0' : '#fde68a'}`
        }}>
          {wordCount} / {minWords} mots minimum
        </div>

        <button
          type="button"
          onClick={handleFetchFeedback}
          disabled={!canSubmit || isLoading}
          style={{
            backgroundColor: canSubmit && !isLoading ? '#2563eb' : '#94a3b8',
            color: '#ffffff',
            fontWeight: '600',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: canSubmit && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          {isLoading ? 'Analyse pédagogique en cours...' : 'Obtenir les retours pédagogiques'}
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#b91c1c',
          fontWeight: '500'
        }}>
          {errorMsg}
        </div>
      )}

      {/* High-Contrast Feedback Card */}
      {feedback && (
        <div style={{
          marginTop: '28px',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
          color: '#0f172a'
        }}>
          <h3 style={{
            fontSize: '1.35rem',
            fontWeight: '800',
            color: '#0369a1',
            marginBottom: '18px',
            borderBottom: '2px solid #f1f5f9',
            paddingBottom: '10px'
          }}>
            Rapport Pédagogique Personnalisé
          </h3>

          {/* Points forts */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0369a1', marginBottom: '10px' }}>
                🌟 Points forts
              </h4>
              <ul style={{ paddingLeft: '22px', margin: 0, color: '#1e293b', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {feedback.strengths.map((str, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{str}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Pistes d'amélioration */}
          {feedback.corrections && feedback.corrections.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0369a1', marginBottom: '12px' }}>
                🔍 Pistes d'amélioration
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {feedback.corrections.map((corr, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#f8fafc',
                    borderLeft: '5px solid #dc2626',
                    borderTop: '1px solid #e2e8f0',
                    borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '14px 18px',
                    borderRadius: '0 10px 10px 0'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: '#991b1b',
                      backgroundColor: '#fee2e2',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      marginBottom: '8px'
                    }}>
                      {corr.category}
                    </div>

                    <div style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px' }}>
                      <span style={{ textDecoration: 'line-through', color: '#b91c1c', marginRight: '10px' }}>
                        {corr.originalSegment}
                      </span>
                      <span style={{ color: '#0f172a', marginRight: '10px' }}>➔</span>
                      <span style={{ color: '#15803d', fontWeight: '800' }}>
                        {corr.suggestedCorrection}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.95rem', color: '#1e293b', lineHeight: '1.5', fontWeight: '500' }}>
                      💡 {corr.ruleExplanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pedagogical Advice */}
          {feedback.pedagogicalAdvice && (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderLeft: '5px solid #2563eb',
              padding: '16px 20px',
              borderRadius: '0 10px 10px 0',
              color: '#1e3a8a',
              lineHeight: '1.6',
              fontSize: '0.95rem'
            }}>
              <strong style={{ display: 'block', marginBottom: '6px', color: '#1d4ed8', fontSize: '1rem' }}>
                💡 Conseil pour progresser :
              </strong>
              {feedback.pedagogicalAdvice}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
