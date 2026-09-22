import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Award, AlertTriangle, ChevronDown, ChevronUp, PenTool } from 'lucide-react';
import './StationPracticeWidget.css';

export default function StationPracticeWidget({ practice }) {
  const [isOpen, setIsOpen] = useState(true);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [focusedId, setFocusedId] = useState(null);

  if (!practice) return null;

  const handleInputChange = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const insertAccent = (accent) => {
    if (!focusedId) return;
    const el = document.getElementById(`station-input-${focusedId}`);
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const current = answers[focusedId] || '';
    const updated = current.substring(0, start) + accent + current.substring(end);
    setAnswers(prev => ({ ...prev, [focusedId]: updated }));
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + accent.length, start + accent.length);
    }, 0);
  };

  const handleVerify = () => {
    let correct = 0;
    const map = {};
    practice.questions.forEach(q => {
      const user = (answers[q.id] || '').trim().toLowerCase();
      const exp = q.answer.trim().toLowerCase();
      const isRight = user === exp;
      map[q.id] = isRight;
      if (isRight) correct++;
    });
    setResults({
      isChecked: true,
      score: Math.round((correct / practice.questions.length) * 20),
      map
    });
  };

  const handleReset = () => {
    setAnswers({});
    setResults(null);
  };

  const accents = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ç', 'ô', 'î', 'ï', 'œ'];

  return (
    <div className="station-practice-widget">
      <div 
        className={`spw-toggle-bar ${isOpen ? 'spw-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="spw-title-left">
          <span className="spw-icon-badge"><PenTool size={18} /></span>
          <div>
            <h4 className="spw-heading">{practice.title}</h4>
            <p className="spw-sub">{practice.description}</p>
          </div>
        </div>
        <div className="spw-toggle-action">
          <span className="spw-btn-label">{isOpen ? 'Replier l\'exercice' : 'Faire l\'exercice'}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isOpen && (
        <div className="spw-content-panel fade-in">
          <div className="spw-accent-bar">
            <span className="spw-accent-label">Accents :</span>
            {accents.map(char => (
              <button
                key={char}
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => insertAccent(char)}
                className="spw-accent-key"
              >
                {char}
              </button>
            ))}
          </div>

          <div className="spw-questions-grid">
            {practice.questions.map((q, idx) => {
              const isChecked = results?.isChecked;
              const isRight = results?.map?.[q.id];
              let fieldClass = '';
              if (isChecked) {
                fieldClass = isRight ? 'spw-input-success' : 'spw-input-fail';
              }

              return (
                <div key={q.id} className={`spw-q-row ${isChecked ? (isRight ? 'q-ok' : 'q-bad') : ''}`}>
                  <div className="spw-q-flow">
                    <span className="spw-q-idx">{idx + 1}</span>
                    <span className="spw-q-before">{q.textBefore}</span>
                    <div className="spw-input-wrapper">
                      <input
                        id={`station-input-${q.id}`}
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={e => handleInputChange(q.id, e.target.value)}
                        onFocus={() => setFocusedId(q.id)}
                        disabled={isChecked}
                        className={`spw-input ${fieldClass}`}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                      {isChecked && (
                        <span className="spw-status-icon">
                          {isRight ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-rose-500" />}
                        </span>
                      )}
                    </div>
                    {q.infinitive && <span className="spw-inf-tag">({q.infinitive})</span>}
                    <span className="spw-q-after">{q.textAfter}</span>
                    {q.hint && <span className="spw-hint-tag">({q.hint})</span>}
                  </div>

                  {isChecked && !isRight && (
                    <div className="spw-correction-row">
                      <AlertTriangle size={13} className="text-amber-600" />
                      <span>Réponse attendue : <strong>{q.answer}</strong></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="spw-footer">
            {results?.isChecked ? (
              <div className="spw-results-row">
                <div className="spw-score-pill">
                  <Award size={18} />
                  <span>Résultat : {results.score} / 20</span>
                </div>
                <button type="button" onClick={handleReset} className="spw-btn spw-btn-reset">
                  <RefreshCw size={15} /> Recommencer
                </button>
              </div>
            ) : (
              <div className="spw-actions-row">
                <button type="button" onClick={handleVerify} className="spw-btn spw-btn-verify">
                  <CheckCircle2 size={16} /> Vérifier mes réponses
                </button>
                <button type="button" onClick={handleReset} className="spw-btn spw-btn-reset">
                  <RefreshCw size={15} /> Réinitialiser
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
