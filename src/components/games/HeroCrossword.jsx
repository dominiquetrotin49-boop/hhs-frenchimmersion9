import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CheckCircle2, RefreshCw, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import './HeroCrossword.css';

const ACCENTS = ['É', 'È', 'Ê', 'Ë', 'À', 'Â', 'Ù', 'Û', 'Ç', 'Ô', 'Î', 'Ï', 'Œ'];

export default function HeroCrossword({
  title,
  description,
  numRows,
  numCols,
  puzzleData,
  onBack,
  activePuzzleId,
  onSelectPuzzle,
  allPuzzles = []
}) {
  const NUM_ROWS = numRows;
  const NUM_COLS = numCols;

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
      setInputs({});
      setShowErrors(false);
      setIsWon(false);
    }
  }, [puzzleData]);

  const handleCellClick = (r, c) => {
    const cellMeta = gridMeta[r][c];
    if (!cellMeta.isActive) return;

    setShowErrors(false);

    if (activeCell?.r === r && activeCell?.c === c && cellMeta.words.length > 1) {
      const currentWordIndex = cellMeta.words.findIndex((w) => w.id === activeWord?.id);
      const nextWord = cellMeta.words[(currentWordIndex + 1) % cellMeta.words.length];
      setActiveWord(nextWord);
    } else {
      setActiveCell({ r, c });
      if (!cellMeta.words.find((w) => w.id === activeWord?.id)) {
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

    setInputs((prev) => ({
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
        setInputs((prev) => ({ ...prev, [`${r}-${c}`]: '' }));
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
    setInputs((prev) => ({ ...prev, [`${r}-${c}`]: char }));
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

  // Real-time solved word detection
  const solvedWordIds = useMemo(() => {
    const set = new Set();
    puzzleData.forEach((w) => {
      let isCompleteAndCorrect = true;
      for (let i = 0; i < w.word.length; i++) {
        const r = w.r + (w.dir === 'down' ? i : 0);
        const c = w.c + (w.dir === 'across' ? i : 0);
        const val = (inputs[`${r}-${c}`] || '').toUpperCase();
        if (val !== w.word[i].toUpperCase()) {
          isCompleteAndCorrect = false;
          break;
        }
      }
      if (isCompleteAndCorrect) {
        set.add(w.id);
      }
    });
    return set;
  }, [inputs, puzzleData]);

  const cellSize = Math.max(20, Math.min(34, Math.floor(520 / Math.max(numCols, numRows * 0.9))));
  const fontSize = Math.max(12, Math.floor(cellSize * 0.58));
  const numFontSize = Math.max(7, Math.floor(cellSize * 0.32));

  return (
    <div className="hero-cw-wrapper">
      {/* ── Top Bar with Back Button & Grille Quick-Tabs ── */}
      <div className="hero-cw-topbar">
        <button onClick={onBack} className="hero-back-btn">
          <ArrowLeft size={16} /> Retour au QG
        </button>

        {/* 5 Grille Quick-Switch Tabs */}
        {allPuzzles.length > 0 && onSelectPuzzle && (
          <div className="hero-tabs-bar">
            {allPuzzles.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => onSelectPuzzle(p.id)}
                className={`hero-tab-pill ${p.id === activePuzzleId ? 'active' : ''}`}
              >
                <span>{p.emoji}</span>
                <span>Grille {idx + 1}</span>
              </button>
            ))}
          </div>
        )}

        {isWon && (
          <div className="hero-cw-victory">
            <Sparkles size={20} />
            <span>💥 MISSION ACCOMPLIE ! RANG HÉROÏQUE DÉBLOQUÉ ! 🛡️</span>
          </div>
        )}
      </div>

      {/* ── Comic Dossier Header ── */}
      <div className="hero-cw-header">
        <h2>
          <Shield size={22} color="#eab308" />
          {title}
        </h2>
        <p>{description}</p>
        <div className="hero-cw-rule-badge">
          ⚡ <strong>Règle BD :</strong> Écrivez les formes composées en un seul mot sans espace (ex : <code>ASAUVÉ</code>, <code>ESTNÉ</code>, <code>SONTRESTÉS</code>).
        </div>
      </div>

      {/* ── Comic Accent Toolbar ── */}
      <div className="hero-cw-accent-bar">
        <span className="hero-accent-label">
          <span>⚡</span> Accents :
        </span>
        {ACCENTS.map((char) => (
          <button
            key={char}
            type="button"
            className="hero-accent-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleInsertAccent(char)}
          >
            {char}
          </button>
        ))}
      </div>

      {/* ── Comic Board & Clues Layout ── */}
      <div className="hero-cw-layout">
        {/* Crossword Grid Panel */}
        <div className="hero-cw-grid-panel">
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
                  const isWordCell = activeWord && cell.words.some((w) => w.id === activeWord.id);
                  const isChecked = showErrors && inputs[`${r}-${c}`];
                  const isCorrect = isChecked && inputs[`${r}-${c}`].toUpperCase() === cell.answer.toUpperCase();
                  const isWrong = isChecked && !isCorrect;

                  let cellBg = '#ffffff';
                  let borderColor = '#0f172a';
                  let borderWidth = '2px';
                  let textColor = '#0f172a';
                  let numColor = '#475569';
                  let zIndex = 1;

                  if (isCorrect) {
                    cellBg = '#86efac';
                    borderColor = '#15803d';
                    textColor = '#14532d';
                  } else if (isWrong) {
                    cellBg = '#fca5a5';
                    borderColor = '#b91c1c';
                    textColor = '#7f1d1d';
                  } else if (isActiveCell) {
                    cellBg = '#dc2626'; // Vigilante Crimson spotlight
                    borderColor = '#eab308'; // Hero Gold border
                    borderWidth = '2.5px';
                    textColor = '#ffffff';
                    numColor = '#fef08a';
                    zIndex = 3;
                  } else if (isWordCell) {
                    cellBg = '#fef08a'; // Comic yellow strip
                    borderColor = '#ca8a04';
                    zIndex = 2;
                  }

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        position: 'relative',
                        border: `${borderWidth} solid ${borderColor}`,
                        background: cellBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        zIndex: zIndex,
                        transition: 'background 0.12s ease, border-color 0.12s ease'
                      }}
                    >
                      {cell.startNum && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '1px',
                            left: '2px',
                            fontSize: `${numFontSize}px`,
                            fontWeight: 900,
                            color: numColor,
                            lineHeight: 1,
                            pointerEvents: 'none'
                          }}
                        >
                          {cell.startNum}
                        </span>
                      )}
                      <input
                        ref={(el) => (inputRefs.current[`${r}-${c}`] = el)}
                        type="text"
                        maxLength={2}
                        value={inputs[`${r}-${c}`] || ''}
                        onChange={(e) => handleInputChange(e, r, c)}
                        onKeyDown={(e) => handleKeyDown(e, r, c)}
                        onFocus={() => handleCellClick(r, c)}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'center',
                          fontSize: `${fontSize}px`,
                          fontWeight: 900,
                          color: textColor,
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

        {/* Classified Clues Panel */}
        <div className="hero-cw-clues-panel">
          <div className="hero-clues-title">
            <span>📜 Indices de Mission</span>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
              {solvedWordIds.size} / {puzzleData.length} résolus
            </span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 className="hero-clue-section-header">
              <span>⚔️</span> Horizontal (Across)
            </h4>
            <div className="hero-clue-list">
              {puzzleData
                .filter((w) => w.dir === 'across')
                .map((w) => {
                  const isSelected = activeWord?.id === w.id;
                  const isSolved = solvedWordIds.has(w.id);
                  return (
                    <div
                      key={w.id}
                      onClick={() => {
                        setActiveWord(w);
                        setActiveCell({ r: w.r, c: w.c });
                        inputRefs.current[`${w.r}-${w.c}`]?.focus();
                      }}
                      className={`hero-clue-item ${isSelected ? 'active' : ''} ${isSolved ? 'solved' : ''}`}
                    >
                      <strong>{w.id}.</strong> {w.clue}
                    </div>
                  );
                })}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 className="hero-clue-section-header">
              <span>🛡️</span> Vertical (Down)
            </h4>
            <div className="hero-clue-list">
              {puzzleData
                .filter((w) => w.dir === 'down')
                .map((w) => {
                  const isSelected = activeWord?.id === w.id;
                  const isSolved = solvedWordIds.has(w.id);
                  return (
                    <div
                      key={w.id}
                      onClick={() => {
                        setActiveWord(w);
                        setActiveCell({ r: w.r, c: w.c });
                        inputRefs.current[`${w.r}-${w.c}`]?.focus();
                      }}
                      className={`hero-clue-item ${isSelected ? 'active' : ''} ${isSolved ? 'solved' : ''}`}
                    >
                      <strong>{w.id}.</strong> {w.clue}
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="hero-actions">
            <button onClick={checkAnswers} className="hero-check-btn">
              <CheckCircle2 size={18} /> Valider la Mission
            </button>
            <button onClick={handleReset} className="hero-reset-btn">
              <RefreshCw size={16} /> Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
