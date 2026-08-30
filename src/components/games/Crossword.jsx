import React, { useState, useRef, useEffect } from 'react';
import './Crossword.css';



export default function Crossword({ title, description, puzzleData, numRows, numCols, onBack }) {
  // Build grid metadata using useMemo so it regenerates when puzzleData changes
  const gridMeta = React.useMemo(() => {
    const meta = Array.from({ length: numRows }, () => 
      Array.from({ length: numCols }, () => ({
        isActive: false,
        answer: '',
        words: [],
        startNum: null
      }))
    );

    puzzleData.forEach((w) => {
      // First cell of the entire grid gets its number, or just blindly assign startNum
      meta[w.r][w.c].startNum = w.id;
      
      for (let i = 0; i < w.word.length; i++) {
        const r = w.r + (w.dir === 'down' ? i : 0);
        const c = w.c + (w.dir === 'across' ? i : 0);
        meta[r][c].isActive = true;
        meta[r][c].answer = w.word[i];
        meta[r][c].words.push(w);
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

  // Initialize active word
  useEffect(() => {
    setActiveWord(puzzleData[0]);
    setActiveCell({ r: puzzleData[0].r, c: puzzleData[0].c });
  }, [puzzleData]);

  const handleCellClick = (r, c) => {
    const cellMeta = gridMeta[r][c];
    if (!cellMeta.isActive) return;

    setShowErrors(false);
    
    // Toggle direction if clicking same cell and it belongs to 2 words
    if (activeCell?.r === r && activeCell?.c === c && cellMeta.words.length > 1) {
      const currentWordIndex = cellMeta.words.findIndex(w => w.id === activeWord?.id);
      const nextWord = cellMeta.words[(currentWordIndex + 1) % cellMeta.words.length];
      setActiveWord(nextWord);
    } else {
      setActiveCell({ r, c });
      // If cell doesn't belong to current active word, switch to one it does belong to
      if (!cellMeta.words.find(w => w.id === activeWord?.id)) {
        setActiveWord(cellMeta.words[0]);
      }
    }
    
    inputRefs.current[`${r}-${c}`]?.focus();
  };

  const handleKeyDown = (e, r, c) => {
    setShowErrors(false);
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      // If current cell has value, clear it
      if (inputs[`${r}-${c}`]) {
        setInputs(prev => ({ ...prev, [`${r}-${c}`]: '' }));
      } else {
        // Move back
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
    } else if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
      e.preventDefault();
      setInputs(prev => ({ ...prev, [`${r}-${c}`]: e.key.toUpperCase() }));
      moveCursor(r, c, 1);
    }
  };

  const moveCursor = (r, c, step) => {
    if (!activeWord) return;
    const isAcross = activeWord.dir === 'across';
    const nextR = r + (isAcross ? 0 : step);
    const nextC = c + (isAcross ? step : 0);
    
    if (nextR >= 0 && nextR < NUM_ROWS && nextC >= 0 && nextC < NUM_COLS && gridMeta[nextR][nextC].isActive) {
      setActiveCell({ r: nextR, c: nextC });
      inputRefs.current[`${nextR}-${nextC}`]?.focus();
    }
  };

  const moveInGrid = (r, c, dr, dc) => {
    const nextR = r + dr;
    const nextC = c + dc;
    if (nextR >= 0 && nextR < NUM_ROWS && nextC >= 0 && nextC < NUM_COLS && gridMeta[nextR][nextC].isActive) {
      handleCellClick(nextR, nextC);
    }
  };

  const checkAnswers = () => {
    let correct = true;
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (gridMeta[r][c].isActive) {
          const expected = gridMeta[r][c].answer;
          const actual = inputs[`${r}-${c}`];
          if (!actual || actual !== expected) {
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

  const getCellClass = (r, c) => {
    const meta = gridMeta[r][c];
    if (!meta.isActive) return 'cell-empty';
    
    let classes = ['cell-active'];
    if (activeCell?.r === r && activeCell?.c === c) {
      classes.push('focused');
    } else if (activeWord && meta.words.some(w => w.id === activeWord.id)) {
      classes.push('highlighted');
    }

    if (showErrors && inputs[`${r}-${c}`]) {
      if (inputs[`${r}-${c}`] === meta.answer) {
        classes.push('correct');
      } else {
        classes.push('incorrect');
      }
    }
    
    return classes.join(' ');
  };

  return (
    <div className="crossword-game">
      <button className="back-btn" onClick={onBack}>
        ← Retour au menu
      </button>
      <div className="crossword-header glass-panel">
        <h2 className="text-gradient">{title}</h2>
        <p className="text-secondary">{description}</p>
      </div>

      <div className="crossword-layout">
        <div className="crossword-board glass-panel">
          {gridMeta.map((row, r) => (
            <div key={r} className="crossword-row">
              {row.map((cell, c) => (
                <div 
                  key={`${r}-${c}`} 
                  className={`crossword-cell ${getCellClass(r, c)}`}
                  onClick={() => handleCellClick(r, c)}
                >
                  {cell.startNum && <span className="cell-num">{cell.startNum}</span>}
                  {cell.isActive && (
                    <input
                      ref={el => inputRefs.current[`${r}-${c}`] = el}
                      type="text"
                      maxLength={1}
                      value={inputs[`${r}-${c}`] || ''}
                      onChange={() => {}} // Handled by keyDown
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      onFocus={() => handleCellClick(r, c)}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="crossword-clues glass-panel">
          <h3 className="mb-4">Indices (Clues)</h3>
          
          <div className="clue-section">
            <h4 className="text-accent">Horizontal (Across)</h4>
            <ul>
              {puzzleData.filter(w => w.dir === 'across').map(w => (
                <li 
                  key={w.id} 
                  className={activeWord?.id === w.id ? 'active-clue' : ''}
                  onClick={() => {
                    setActiveWord(w);
                    setActiveCell({ r: w.r, c: w.c });
                    inputRefs.current[`${w.r}-${w.c}`]?.focus();
                  }}
                >
                  <strong>{w.id}.</strong> {w.clue}
                </li>
              ))}
            </ul>
          </div>

          <div className="clue-section mt-4">
            <h4 className="text-accent">Vertical (Down)</h4>
            <ul>
              {puzzleData.filter(w => w.dir === 'down').map(w => (
                <li 
                  key={w.id} 
                  className={activeWord?.id === w.id ? 'active-clue' : ''}
                  onClick={() => {
                    setActiveWord(w);
                    setActiveCell({ r: w.r, c: w.c });
                    inputRefs.current[`${w.r}-${w.c}`]?.focus();
                  }}
                >
                  <strong>{w.id}.</strong> {w.clue}
                </li>
              ))}
            </ul>
          </div>

          <div className="crossword-actions mt-4">
            <button className="check-btn" onClick={checkAnswers}>
              Vérifier
            </button>
            {isWon && (
              <div className="win-message text-success mt-2 font-bold text-center">
                Félicitations ! Grille complétée !
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
