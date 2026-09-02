import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';

const ACCENTS = ['É', 'È', 'Ê', 'Ë', 'À', 'Â', 'Ù', 'Û', 'Ç', 'Ô', 'Î', 'Ï', 'Œ'];

export default function Crossword({ title, description, numRows, numCols, puzzleData, onBack }) {
  const NUM_ROWS = numRows;
  const NUM_COLS = numCols;
  // Calculate zoom scale specifically for large grids (like IR: 17 cols x 16 rows)
  const gridScale = (numCols >= 16 || numRows >= 15) ? 0.78 : 1;

  const gridMeta = useMemo(() => {
    const meta = Array.from({ length: numRows }, () => 
      Array.from({ length: numCols }, () => ({
        isActive: false,
        answer: '',
        words: [],
        startNum: null
      }))
    );

    puzzleData.forEach((w) => {
      meta[w.r][w.c].startNum = w.id;
      
      for (let i = 0; i < w.word.length; i++) {
        const r = w.r + (w.dir === 'down' ? i : 0);
        const c = w.c + (w.dir === 'across' ? i : 0);
        if (r < numRows && c < numCols) {
          meta[r][c].isActive = true;
          meta[r][c].answer = w.word[i];
          meta[r][c].words.push(w);
        }
      }
    });
    return meta;
  }, [puzzleData, numRows, numCols]);

  const [inputs, setInputs] = useState({});
  const [activeWord, setActiveWord] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isWon, setIsWon] = useState(false);
  
  const inputRefs = useRef({});

  useEffect(() => {
    if (puzzleData && puzzleData.length > 0) {
      setActiveWord(puzzleData[0]);
      setActiveCell({ r: puzzleData[0].r, c: puzzleData[0].c });
    }
  }, [puzzleData]);

  const handleCellClick = (r, c) => {
    const cellMeta = gridMeta[r][c];
    if (!cellMeta.isActive) return;

    setShowErrors(false);
    
    if (activeCell?.r === r && activeCell?.c === c && cellMeta.words.length > 1) {
      const currentWordIndex = cellMeta.words.findIndex(w => w.id === activeWord?.id);
      const nextWord = cellMeta.words[(currentWordIndex + 1) % cellMeta.words.length];
      setActiveWord(nextWord);
    } else {
      setActiveCell({ r, c });
      if (!cellMeta.words.find(w => w.id === activeWord?.id)) {
        setActiveWord(cellMeta.words[0]);
      }
    }
    
    inputRefs.current[`${r}-${c}`]?.focus();
  };

  const moveCursor = (r, c, step) => {
    if (!activeWord) return;
    const isAcross = activeWord.dir === 'across';
    const nextR = r + (isAcross ? 0 : step);
    const nextC = c + (isAcross ? step : 0);
    
    if (nextR >= 0 && nextR < NUM_ROWS && nextC >= 0 && nextC < NUM_COLS && gridMeta[nextR][nextC].isActive) {
      setActiveCell({ r: nextR, c: nextC });
      const nextInput = inputRefs.current[`${nextR}-${nextC}`];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  };

  const moveInGrid = (r, c, dr, dc) => {
    const nextR = r + dr;
    const nextC = c + dc;
    if (nextR >= 0 && nextR < NUM_ROWS && nextC >= 0 && nextC < NUM_COLS && gridMeta[nextR][nextC].isActive) {
      handleCellClick(nextR, nextC);
    }
  };

  const handleInputChange = (e, r, c) => {
    const val = e.target.value.slice(-1).toUpperCase();
    
    setInputs(prev => ({
      ...prev,
      [`${r}-${c}`]: val
    }));

    if (val) {
      moveCursor(r, c, 1);
    }
  };

  const handleKeyDown = (e, r, c) => {
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (inputs[`${r}-${c}`]) {
        setInputs(prev => ({ ...prev, [`${r}-${c}`]: '' }));
      } else {
        moveCursor(r, c, -1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveInGrid(r, c, -1, 0);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveInGrid(r, c, 1, 0);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveInGrid(r, c, 0, -1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveInGrid(r, c, 0, 1);
    }
  };

  const handleInsertAccent = (char) => {
    if (!activeCell) return;
    const { r, c } = activeCell;
    setInputs(prev => ({ ...prev, [`${r}-${c}`]: char }));
    moveCursor(r, c, 1);
  };

  const checkAnswers = () => {
    let correct = true;
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (gridMeta[r][c].isActive) {
          const expected = gridMeta[r][c].answer.toUpperCase();
          const actual = (inputs[`${r}-${c}`] || '').toUpperCase();
          if (actual !== expected) {
            correct = false;
          }
        }
      }
    }
    
    setShowErrors(true);
    if (correct) {
      setIsWon(true);
    }
  };

  const handleReset = () => {
    setInputs({});
    setShowErrors(false);
    setIsWon(false);
  };

  const cellSize = Math.max(18, Math.min(32, Math.floor(480 / Math.max(numCols, numRows * 0.85))));
  const fontSize = Math.max(11, Math.floor(cellSize * 0.55));
  const numFontSize = Math.max(7, Math.floor(cellSize * 0.32));

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Retour au menu
        </button>

        {isWon && (
          <div style={{ background: '#22c55e', color: '#ffffff', padding: '0.4rem 1rem', borderRadius: '0.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} /> Félicitations ! Grille complétée !
          </div>
        )}
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '1rem', padding: '1rem 1.5rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
        <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{title}</h2>
        <p style={{ color: '#cbd5e1', margin: '0.35rem 0 0 0', fontSize: '0.95rem' }}>{description}</p>
      </div>

      {/* Floating Accent Toolbar Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '0.75rem',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginRight: '0.25rem' }}>
          Accents :
        </span>
        {ACCENTS.map((char) => (
          <button
            key={char}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleInsertAccent(char)}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.4rem',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'background 0.15s ease, transform 0.1s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {char}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* Crossword Board */}
        <div style={{
          background: '#ffffff',
          borderRadius: '1rem',
          padding: '1.25rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {gridMeta.map((row, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {row.map((cell, c) => {
                  if (!cell.isActive) {
                    return (
                      <div
                        key={`${r}-${c}`}
                        style={{
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                          background: 'transparent'
                        }}
                      />
                    );
                  }

                  const isActiveCell = activeCell?.r === r && activeCell?.c === c;
                  const isWordCell = activeWord && cell.words.some(w => w.id === activeWord.id);
                  const isChecked = showErrors && inputs[`${r}-${c}`];
                  const isCorrect = isChecked && inputs[`${r}-${c}`].toUpperCase() === cell.answer.toUpperCase();
                  const isWrong = isChecked && !isCorrect;

                  let cellBg = '#ffffff';
                  let borderColor = '#94a3b8';

                  if (isCorrect) {
                    cellBg = '#bbf7d0';
                    borderColor = '#22c55e';
                  } else if (isWrong) {
                    cellBg = '#fecaca';
                    borderColor = '#ef4444';
                  } else if (isActiveCell) {
                    cellBg = '#fed7aa';
                    borderColor = '#ea580c';
                  } else if (isWordCell) {
                    cellBg = '#ffedd5';
                    borderColor = '#fb923c';
                  }

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        position: 'relative',
                        border: `1px solid ${borderColor}`,
                        background: cellBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxSizing: 'border-box'
                      }}
                    >
                      {cell.startNum && (
                        <span style={{
                          position: 'absolute',
                          top: '1px',
                          left: '2px',
                          fontSize: `${numFontSize}px`,
                          fontWeight: 800,
                          color: '#475569',
                          lineHeight: 1,
                          pointerEvents: 'none'
                        }}>
                          {cell.startNum}
                        </span>
                      )}
                      <input
                        ref={el => (inputRefs.current[`${r}-${c}`] = el)}
                        type="text"
                        maxLength={2}
                        value={inputs[`${r}-${c}`] || ''}
                        onChange={e => handleInputChange(e, r, c)}
                        onKeyDown={e => handleKeyDown(e, r, c)}
                        onFocus={() => handleCellClick(r, c)}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'center',
                          fontSize: `${fontSize}px`,
                          fontWeight: 800,
                          color: '#0f172a',
                          textTransform: 'uppercase',
                          outline: 'none',
                          padding: 0
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Clues Panel */}
        <div style={{
          background: '#ffffff',
          borderRadius: '1rem',
          padding: '1.25rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          maxHeight: '520px',
          overflowY: 'auto',
          color: '#1e293b'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.15rem', fontWeight: 700 }}>
            Indices (Clues)
          </h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ color: '#d97706', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              Horizontal (Across)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {puzzleData.filter(w => w.dir === 'across').map(w => {
                const isSelected = activeWord?.id === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => {
                      setActiveWord(w);
                      setActiveCell({ r: w.r, c: w.c });
                      inputRefs.current[`${w.r}-${w.c}`]?.focus();
                    }}
                    style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      background: isSelected ? '#ffedd5' : 'transparent',
                      color: isSelected ? '#c2410c' : '#334155',
                      fontWeight: isSelected ? 700 : 500,
                      borderLeft: isSelected ? '3px solid #ea580c' : '3px solid transparent'
                    }}
                  >
                    <strong>{w.id}.</strong> {w.clue}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ color: '#d97706', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              Vertical (Down)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {puzzleData.filter(w => w.dir === 'down').map(w => {
                const isSelected = activeWord?.id === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => {
                      setActiveWord(w);
                      setActiveCell({ r: w.r, c: w.c });
                      inputRefs.current[`${w.r}-${w.c}`]?.focus();
                    }}
                    style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      background: isSelected ? '#ffedd5' : 'transparent',
                      color: isSelected ? '#c2410c' : '#334155',
                      fontWeight: isSelected ? 700 : 500,
                      borderLeft: isSelected ? '3px solid #ea580c' : '3px solid transparent'
                    }}
                  >
                    <strong>{w.id}.</strong> {w.clue}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={checkAnswers}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.65rem 1rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={16} /> Vérifier
            </button>
            <button
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                padding: '0.65rem 1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={16} /> Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
