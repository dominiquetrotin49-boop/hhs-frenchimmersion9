import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react';

export default function Crossword({ title, description, numRows, numCols, puzzleData, onBack }) {
  const [grid, setGrid] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [activeWordId, setActiveWordId] = useState(puzzleData[0]?.id || 1);
  const [activeDirection, setActiveDirection] = useState(puzzleData[0]?.dir || 'across');
  const [focusedCell, setFocusedCell] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const inputRefs = useRef({});

  // Compact scaling so full grids fit without vertical page scroll
  const maxDim = Math.max(numRows, numCols);
  const cellSize = maxDim > 18 ? 20 : maxDim > 14 ? 23 : 26;
  const fontSize = maxDim > 18 ? 10 : maxDim > 14 ? 11 : 12;
  const numFontSize = maxDim > 18 ? 6 : 7;

  useEffect(() => {
    const newGrid = Array(numRows).fill(null).map(() => Array(numCols).fill(null));

    puzzleData.forEach((item) => {
      const word = item.word.toUpperCase();
      for (let i = 0; i < word.length; i++) {
        const r = item.dir === 'down' ? item.r + i : item.r;
        const c = item.dir === 'across' ? item.c + i : item.c;
        if (r < numRows && c < numCols) {
          if (!newGrid[r][c]) {
            newGrid[r][c] = {
              letter: word[i],
              number: i === 0 ? item.id : null,
              words: [{ id: item.id, dir: item.dir, index: i }]
            };
          } else {
            if (i === 0) newGrid[r][c].number = item.id;
            newGrid[r][c].words.push({ id: item.id, dir: item.dir, index: i });
          }
        }
      }
    });

    setGrid(newGrid);
    setUserInputs({});
    setIsCompleted(false);

    if (puzzleData.length > 0) {
      setActiveWordId(puzzleData[0].id);
      setActiveDirection(puzzleData[0].dir);
      setFocusedCell({ r: puzzleData[0].r, c: puzzleData[0].c });
    }
  }, [numRows, numCols, puzzleData]);

  useEffect(() => {
    if (focusedCell) {
      const key = `${focusedCell.r}-${focusedCell.c}`;
      if (inputRefs.current[key]) {
        inputRefs.current[key].focus();
        inputRefs.current[key].select();
      }
    }
  }, [focusedCell]);

  const getActiveWord = () => puzzleData.find(p => p.id === activeWordId);

  const isCellInActiveWord = (r, c) => {
    const cell = grid[r]?.[c];
    if (!cell) return false;
    return cell.words.some(w => w.id === activeWordId);
  };

  const handleCellClick = (r, c) => {
    const cell = grid[r]?.[c];
    if (!cell) return;

    setFocusedCell({ r, c });

    const matchingWord = cell.words.find(w => w.id === activeWordId);
    if (matchingWord) {
      if (cell.words.length > 1) {
        const otherWord = cell.words.find(w => w.id !== activeWordId);
        if (otherWord) {
          setActiveWordId(otherWord.id);
          setActiveDirection(otherWord.dir);
        }
      }
    } else {
      setActiveWordId(cell.words[0].id);
      setActiveDirection(cell.words[0].dir);
    }
  };

  const handleClueClick = (item) => {
    setActiveWordId(item.id);
    setActiveDirection(item.dir);
    setFocusedCell({ r: item.r, c: item.c });
  };

  const moveToNextCell = (r, c) => {
    const active = getActiveWord();
    if (!active) return;

    let nextR = r;
    let nextC = c;

    if (active.dir === 'across') {
      nextC += 1;
    } else {
      nextR += 1;
    }

    if (nextR < numRows && nextC < numCols && grid[nextR]?.[nextC] && isCellInActiveWord(nextR, nextC)) {
      setFocusedCell({ r: nextR, c: nextC });
    }
  };

  const moveToPrevCell = (r, c) => {
    const active = getActiveWord();
    if (!active) return;

    let prevR = r;
    let prevC = c;

    if (active.dir === 'across') {
      prevC -= 1;
    } else {
      prevR -= 1;
    }

    if (prevR >= 0 && prevC >= 0 && grid[prevR]?.[prevC] && isCellInActiveWord(prevR, prevC)) {
      setFocusedCell({ r: prevR, c: prevC });
    }
  };

  const handleKeyDown = (e, r, c) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const key = `${r}-${c}`;
      if (userInputs[key]) {
        setUserInputs(prev => ({ ...prev, [key]: '' }));
      } else {
        moveToPrevCell(r, c);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (c + 1 < numCols && grid[r]?.[c + 1]) setFocusedCell({ r, c: c + 1 });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (c - 1 >= 0 && grid[r]?.[c - 1]) setFocusedCell({ r, c: c - 1 });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (r + 1 < numRows && grid[r + 1]?.[c]) setFocusedCell({ r: r + 1, c });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (r - 1 >= 0 && grid[r - 1]?.[c]) setFocusedCell({ r: r - 1, c });
    } else if (/^[a-zA-ZÀ-ÿ]$/.test(e.key)) {
      e.preventDefault();
      const letter = e.key.toUpperCase();
      const key = `${r}-${c}`;
      const newInputs = { ...userInputs, [key]: letter };
      setUserInputs(newInputs);

      moveToNextCell(r, c);

      let complete = true;
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          if (grid[row] && grid[row][col]) {
            const expected = grid[row][col].letter;
            if (newInputs[`${row}-${col}`] !== expected) {
              complete = false;
              break;
            }
          }
        }
      }
      if (complete) setIsCompleted(true);
    }
  };

  const resetGame = () => {
    setUserInputs({});
    setIsCompleted(false);
    if (puzzleData.length > 0) {
      setActiveWordId(puzzleData[0].id);
      setActiveDirection(puzzleData[0].dir);
      setFocusedCell({ r: puzzleData[0].r, c: puzzleData[0].c });
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '960px',
      margin: '0 auto',
      padding: '8px 12px',
      boxSizing: 'border-box',
      color: '#ffffff'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={14} />
          Retour aux grilles
        </button>

        <button
          onClick={resetGame}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
        >
          <RotateCcw size={13} />
          Réinitialiser
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 2px 0' }}>{title}</h2>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>{description}</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) minmax(240px, 320px)',
        gap: '12px',
        alignItems: 'start'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflowX: 'auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
            gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
            gap: '1.5px',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '3px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const cellKey = `${rIdx}-${cIdx}`;
                const val = userInputs[cellKey] || '';
                const isCell = cell !== null;

                if (!isCell) {
                  return <div key={cellKey} style={{ width: `${cellSize}px`, height: `${cellSize}px` }} />;
                }

                const inActiveWord = isCellInActiveWord(rIdx, cIdx);
                const isFocused = focusedCell?.r === rIdx && focusedCell?.c === cIdx;

                return (
                  <div
                    key={cellKey}
                    onClick={() => handleCellClick(rIdx, cIdx)}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      position: 'relative',
                      background: isFocused ? '#38bdf8' : inActiveWord ? '#bae6fd' : '#ffffff',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {cell.number && (
                      <span style={{
                        position: 'absolute',
                        top: '1px',
                        left: '1.5px',
                        fontSize: `${numFontSize}px`,
                        fontWeight: 800,
                        color: isFocused ? '#0369a1' : '#0f172a',
                        lineHeight: 1,
                        pointerEvents: 'none'
                      }}>
                        {cell.number}
                      </span>
                    )}
                    <input
                      ref={el => inputRefs.current[cellKey] = el}
                      type="text"
                      maxLength={1}
                      value={val}
                      onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                      onChange={() => {}}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        textAlign: 'center',
                        fontSize: `${fontSize}px`,
                        fontWeight: 700,
                        color: isFocused ? '#082f49' : '#0f172a',
                        textTransform: 'uppercase',
                        padding: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '12px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: 0, marginBottom: '8px', color: '#38bdf8' }}>
            Indices
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
            {puzzleData.map((item) => {
              const isSelected = item.id === activeWordId;
              return (
                <div
                  key={item.id}
                  onClick={() => handleClueClick(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '6px',
                    fontSize: '0.78rem',
                    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                    background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                    border: isSelected ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                    borderRadius: '4px',
                    padding: '4px 6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <strong style={{ color: isSelected ? '#38bdf8' : '#94a3b8', minWidth: '18px' }}>{item.id}.</strong>
                  <span style={{ flex: 1 }}>{item.clue} <span style={{ fontSize: '0.68rem', opacity: 0.6 }}>({item.dir === 'across' ? 'Horiz.' : 'Vert.'})</span></span>
                </div>
              );
            })}
          </div>

          {isCompleted && (
            <div style={{
              marginTop: '10px',
              padding: '8px',
              borderRadius: '6px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid #22c55e',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#4ade80',
              fontSize: '0.8rem'
            }}>
              <CheckCircle size={16} />
              <span style={{ fontWeight: 700 }}>Félicitations ! Grille complétée.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
