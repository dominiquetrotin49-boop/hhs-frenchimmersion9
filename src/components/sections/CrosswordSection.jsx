import React, { useState, useRef, useCallback, useMemo } from 'react';
import { CheckCircle2, RefreshCw, Award } from 'lucide-react';
import './CrosswordSection.css';

export default function CrosswordSection({ puzzleData }) {
  const { words, gridRows, gridCols } = puzzleData;

  // Build grid from word placements
  const gridInfo = useMemo(() => {
    const grid = Array.from({ length: gridRows }, () =>
      Array.from({ length: gridCols }, () => null)
    );
    words.forEach((w) => {
      const letters = w.answer.toUpperCase().split('');
      letters.forEach((letter, i) => {
        const r = w.direction === 'across' ? w.row : w.row + i;
        const c = w.direction === 'across' ? w.col + i : w.col;
        if (!grid[r][c]) {
          grid[r][c] = { letter, number: null, cellId: `${r}-${c}` };
        }
        if (i === 0) {
          grid[r][c].number = grid[r][c].number || w.number;
        }
      });
    });
    return grid;
  }, [words, gridRows, gridCols]);

  const [userInputs, setUserInputs] = useState({});
  const [activeWord, setActiveWord] = useState(null);
  const [validated, setValidated] = useState(false);
  const [cellResults, setCellResults] = useState({});
  const [score, setScore] = useState(null);
  const [clueTab, setClueTab] = useState('across');
  const inputRefs = useRef({});

  const getCellsForWord = useCallback((word) => {
    const cells = [];
    word.answer.toUpperCase().split('').forEach((letter, i) => {
      const r = word.direction === 'across' ? word.row : word.row + i;
      const c = word.direction === 'across' ? word.col + i : word.col;
      cells.push({ r, c, letter, cellId: `${r}-${c}` });
    });
    return cells;
  }, []);

  const focusCell = useCallback((r, c) => {
    const key = `${r}-${c}`;
    if (inputRefs.current[key]) inputRefs.current[key].focus();
  }, []);

  const acrossClues = words.filter((w) => w.direction === 'across').sort((a, b) => a.number - b.number);
  const downClues = words.filter((w) => w.direction === 'down').sort((a, b) => a.number - b.number);

  // Auto-advance after typing a letter
  const handleCellInput = useCallback((r, c, value) => {
    if (validated) return;
    const key = `${r}-${c}`;
    const char = value.slice(-1).toUpperCase();
    setUserInputs((prev) => ({ ...prev, [key]: char }));
    if (char && activeWord) {
      const cells = getCellsForWord(activeWord);
      const idx = cells.findIndex((cl) => cl.r === r && cl.c === c);
      if (idx >= 0 && idx < cells.length - 1) {
        focusCell(cells[idx + 1].r, cells[idx + 1].c);
      }
    }
  }, [validated, activeWord, getCellsForWord, focusCell]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e, r, c) => {
    if (validated) return;
    const key = `${r}-${c}`;
    if (e.key === 'Backspace') {
      if (!userInputs[key] && activeWord) {
        const cells = getCellsForWord(activeWord);
        const idx = cells.findIndex((cl) => cl.r === r && cl.c === c);
        if (idx > 0) {
          const prev = cells[idx - 1];
          setUserInputs((p) => ({ ...p, [`${prev.r}-${prev.c}`]: '' }));
          focusCell(prev.r, prev.c);
          e.preventDefault();
        }
      } else {
        setUserInputs((p) => ({ ...p, [key]: '' }));
        e.preventDefault();
      }
    } else if (e.key === 'ArrowRight') {
      if (c + 1 < gridCols && gridInfo[r][c + 1]) focusCell(r, c + 1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      if (c - 1 >= 0 && gridInfo[r][c - 1]) focusCell(r, c - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (r + 1 < gridRows && gridInfo[r + 1] && gridInfo[r + 1][c]) focusCell(r + 1, c);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (r - 1 >= 0 && gridInfo[r - 1][c]) focusCell(r - 1, c);
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const wordList = clueTab === 'across' ? acrossClues : downClues;
      const currentIdx = activeWord ? wordList.findIndex((w) => w.id === activeWord.id) : -1;
      const nextWord = wordList[(currentIdx + 1) % wordList.length];
      setActiveWord(nextWord);
      const cells = getCellsForWord(nextWord);
      if (cells.length > 0) focusCell(cells[0].r, cells[0].c);
    }
  }, [validated, userInputs, activeWord, gridInfo, gridRows, gridCols, getCellsForWord, focusCell, acrossClues, downClues, clueTab]);

  // MouseDown: toggle direction only when re-clicking already-focused cell
  const handleCellMouseDown = useCallback((r, c) => {
    const key = `${r}-${c}`;
    const inputEl = inputRefs.current[key];
    if (document.activeElement === inputEl) {
      const matching = words.filter((w) =>
        getCellsForWord(w).some((cl) => cl.r === r && cl.c === c)
      );
      if (matching.length > 1 && activeWord) {
        const other = matching.find((w) => w.id !== activeWord.id);
        if (other) {
          setActiveWord(other);
          setClueTab(other.direction);
        }
      }
    }
  }, [words, activeWord, getCellsForWord]);

  // Focus: set word without toggling; preserve direction during auto-advance
  const handleCellFocus = useCallback((r, c) => {
    if (activeWord) {
      const passes = getCellsForWord(activeWord).some((cl) => cl.r === r && cl.c === c);
      if (passes) return;
    }
    const matching = words.filter((w) =>
      getCellsForWord(w).some((cl) => cl.r === r && cl.c === c)
    );
    if (matching.length > 0) {
      if (activeWord) {
        const sameDir = matching.find((w) => w.direction === activeWord.direction);
        if (sameDir) { setActiveWord(sameDir); return; }
      }
      const across = matching.find((w) => w.direction === 'across');
      const pick = across || matching[0];
      setActiveWord(pick);
      setClueTab(pick.direction);
    }
  }, [words, activeWord, getCellsForWord]);

  // Click a clue → select word, focus first empty cell
  const handleClueClick = useCallback((word) => {
    setActiveWord(word);
    setClueTab(word.direction);
    const cells = getCellsForWord(word);
    const firstEmpty = cells.find((cl) => !userInputs[cl.cellId]);
    const target = firstEmpty || cells[0];
    if (target) focusCell(target.r, target.c);
  }, [getCellsForWord, focusCell, userInputs]);

  // Is cell part of active word?
  const isActiveWordCell = useCallback((r, c) => {
    if (!activeWord) return false;
    return getCellsForWord(activeWord).some((cl) => cl.r === r && cl.c === c);
  }, [activeWord, getCellsForWord]);

  // Verify
  const handleVerify = () => {
    const results = {};
    let correct = 0, total = 0;
    words.forEach((w) => {
      getCellsForWord(w).forEach((cell) => {
        if (!results[cell.cellId]) {
          total++;
          const isCorrect = (userInputs[cell.cellId] || '').toUpperCase() === cell.letter;
          results[cell.cellId] = isCorrect;
          if (isCorrect) correct++;
        }
      });
    });
    setCellResults(results);
    setScore(Math.round((correct / total) * 20));
    setValidated(true);
  };

  const handleReset = () => {
    setUserInputs({});
    setValidated(false);
    setCellResults({});
    setScore(null);
    setActiveWord(null);
  };

  const visibleClues = clueTab === 'across' ? acrossClues : downClues;

  return (
    <div className="cw-container">
      {/* Grid area */}
      <div className="cw-grid-area">
        <div className="cw-grid" style={{
          gridTemplateColumns: `repeat(${gridCols}, 1.8rem)`,
          gridTemplateRows: `repeat(${gridRows}, 1.8rem)`,
        }}>
          {gridInfo.map((row, r) =>
            row.map((cell, c) => {
              if (!cell) return <div key={`${r}-${c}`} className="cw-black" />;
              const key = cell.cellId;
              const isWordCell = isActiveWordCell(r, c);
              let cls = 'cw-white';
              if (isWordCell) cls += ' cw-highlight';
              if (validated && cellResults[key] === true) cls += ' cw-correct';
              if (validated && cellResults[key] === false) cls += ' cw-incorrect';
              return (
                <div key={key} className={cls} onMouseDown={() => handleCellMouseDown(r, c)}>
                  {cell.number && <span className="cw-num">{cell.number}</span>}
                  <input
                    ref={(el) => (inputRefs.current[key] = el)}
                    type="text"
                    maxLength={2}
                    value={userInputs[key] || ''}
                    onChange={(e) => handleCellInput(r, c, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                    onFocus={() => handleCellFocus(r, c)}
                    className="cw-input"
                    disabled={validated}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck="false"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Clue panel */}
      <div className="cw-clue-panel">
        <div className="cw-tab-bar">
          <button
            className={`cw-tab ${clueTab === 'across' ? 'cw-tab-active' : ''}`}
            onClick={() => setClueTab('across')}
          >
            HORIZONTALEMENT
          </button>
          <button
            className={`cw-tab ${clueTab === 'down' ? 'cw-tab-active' : ''}`}
            onClick={() => setClueTab('down')}
          >
            VERTICALEMENT
          </button>
        </div>
        <ul className="cw-clue-list">
          {visibleClues.map((w) => (
            <li
              key={w.id}
              className={`cw-clue ${activeWord?.id === w.id ? 'cw-clue-selected' : ''}`}
              onClick={() => handleClueClick(w)}
            >
              <span className="cw-clue-num">{w.number}</span>
              <span className="cw-clue-text">{w.clue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="cw-footer">
        {validated ? (
          <div className="cw-results">
            <div className="score-summary-badge">
              <Award size={20} />
              <span>Résultat : {score} / 20</span>
            </div>
            <button onClick={handleReset} className="control-btn reset-btn">
              <RefreshCw size={16} /> Recommencer
            </button>
          </div>
        ) : (
          <div className="cw-actions">
            <button onClick={handleVerify} className="control-btn verify-btn">
              <CheckCircle2 size={16} /> Vérifier
            </button>
            <button onClick={handleReset} className="control-btn reset-btn">
              <RefreshCw size={16} /> Réinitialiser
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
