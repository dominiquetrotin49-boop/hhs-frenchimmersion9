import { useState, useCallback } from "react";

const ROOMS = [
  {
    id: 1,
    name: "Salle des Armes",
    emoji: "⚔️",
    color: "#7f1d1d",
    bg: "rgba(127,29,29,0.12)",
    desc: "Le héros est entré dans la salle des armes. Aidez-le à conjuguer au passé composé !",
    questions: [
      {
        question: "Le héros ___ (partir) à l'aube pour combattre le dragon.",
        options: ["a parti", "est parti", "a partu", "est parté"],
        answer: 1,
        feedback: "✔ 'Partir' est un verbe de mouvement → auxiliaire ÊTRE : il est parti."
      },
      {
        question: "Les chevalières ___ (vaincre) tous leurs ennemis.",
        options: ["ont vaincu", "sont vaincues", "ont vaincues", "ont vaincus"],
        answer: 0,
        feedback: "✔ 'Vaincre' utilise AVOIR. Pas d'accord avec avoir sauf si COD précède."
      },
      {
        question: "Elle ___ (se battre) avec bravoure contre l'anti-héros.",
        options: ["a se battu", "s'est battue", "s'est battu", "est battue"],
        answer: 1,
        feedback: "✔ Verbe pronominal → ÊTRE. Sujet féminin → accord : s'est battue."
      }
    ]
  },
  {
    id: 2,
    name: "La Tour des Secrets",
    emoji: "🗝️",
    color: "#1e3a5f",
    bg: "rgba(30,58,95,0.12)",
    desc: "Dans la tour mystérieuse, le héros découvre des indices. Conjuguez correctement !",
    questions: [
      {
        question: "Le héros ___ (découvrir) une ancienne carte au trésor.",
        options: ["a découvri", "est découvert", "a découvert", "a décovvert"],
        answer: 2,
        feedback: "✔ 'Découvrir' → participe irrégulier : découvert. Auxiliaire AVOIR."
      },
      {
        question: "Les deux héros ___ (s'allier) contre le villain.",
        options: ["se sont alliés", "ont alliés", "s'ont alliés", "se sont allié"],
        answer: 0,
        feedback: "✔ Pronominal + ÊTRE → accord avec sujet masculin pluriel : alliés."
      },
      {
        question: "La guerrière ___ (prendre) son épée magique.",
        options: ["a pris", "est prise", "a prise", "a prend"],
        answer: 0,
        feedback: "✔ 'Prendre' → participe irrégulier : pris. Auxiliaire AVOIR. Pas d'accord ici."
      }
    ]
  },
  {
    id: 3,
    name: "Le Donjon Final",
    emoji: "🏰",
    color: "#3b1a6e",
    bg: "rgba(59,26,110,0.12)",
    desc: "Dernière épreuve ! Libérez le héros captif en maîtrisant le passé composé !",
    questions: [
      {
        question: "Les héroïnes que tu ___ (rencontrer) étaient très courageuses.",
        options: ["as rencontrées", "as rencontré", "a rencontrées", "es rencontré"],
        answer: 0,
        feedback: "✔ COD féminin pluriel (les héroïnes) AVANT avoir → accord : rencontrées."
      },
      {
        question: "Il ___ (mourir) en défendant son peuple, comme un vrai héros.",
        options: ["a mort", "est mouré", "est mort", "a mourir"],
        answer: 2,
        feedback: "✔ 'Mourir' → verbe d'état avec ÊTRE : il est mort."
      },
      {
        question: "Le village ___ (être) sauvé grâce à l'héroïsme du champion.",
        options: ["a été", "est été", "a était", "est était"],
        answer: 0,
        feedback: "✔ Passif au PC : 'a été' (avoir + participe passé de être)."
      }
    ]
  }
];

/* ── tiny hook ───────────────────────────────────────────────────── */
const useFlash = () => {
  const [flash, setFlash] = useState(null);
  const trigger = useCallback((kind, ms = 1700) => {
    setFlash(kind);
    setTimeout(() => setFlash(null), ms);
  }, []);
  return [flash, trigger];
};

/* ── decorative star positions ───────────────────────────────────── */
const STAR_POS = [
  [8,12],[15,42],[88,7],[92,35],[5,68],[97,72],[50,5],
  [72,88],[25,95],[60,55],[35,25],[78,60],[44,80],[10,85],[85,50],
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function ChateauEvasion({ onBack }) {
  const [roomIdx,      setRoomIdx]      = useState(0);
  const [qIdx,         setQIdx]         = useState(0);
  // phase: "question" | "feedback" | "between" | "victory"
  const [phase,        setPhase]        = useState("question");
  const [lastCorrect,  setLastCorrect]  = useState(false);
  const [lastFeedback, setLastFeedback] = useState("");
  const [,             triggerFlash]    = useFlash();
  const [hoveredBtn,   setHoveredBtn]   = useState(null);

  const room     = ROOMS[Math.min(roomIdx, ROOMS.length - 1)];
  const question = room.questions[qIdx];

  /* ── answer handler ────────────────────────────────────────────── */
  const handleAnswer = (idx) => {
    if (phase !== "question") return;
    const correct = idx === question.answer;
    setLastCorrect(correct);
    setLastFeedback(question.feedback);
    triggerFlash(correct ? "correct" : "wrong");
    setPhase("feedback");

    setTimeout(() => {
      if (correct) {
        const nextQ = qIdx + 1;
        if (nextQ < room.questions.length) {
          setQIdx(nextQ);
          setPhase("question");
        } else {
          setPhase(roomIdx + 1 >= ROOMS.length ? "victory" : "between");
        }
      } else {
        // wrong → restart room from q0
        setQIdx(0);
        setPhase("question");
      }
    }, 1800);
  };

  const handleNextRoom = () => {
    setRoomIdx(r => r + 1);
    setQIdx(0);
    setPhase("question");
  };

  const handleReplay = () => {
    setRoomIdx(0);
    setQIdx(0);
    setPhase("question");
    setLastCorrect(false);
  };

  /* ── shared styles ─────────────────────────────────────────────── */
  const rootStyle = {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0d0d1a 0%, #1a0d2e 50%, #0a1628 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 16px 56px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: "relative",
    color: "#f0e6c8",
    boxSizing: "border-box",
  };

  const backBtnStyle = {
    position: "absolute",
    top: 20,
    left: 20,
    background: "rgba(240,230,200,0.10)",
    border: "1px solid rgba(240,230,200,0.28)",
    color: "#f0e6c8",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    zIndex: 10,
  };

  const titleStyle = {
    fontSize: "clamp(22px, 5vw, 32px)",
    fontWeight: 900,
    letterSpacing: 1,
    margin: "12px 0 4px",
    textAlign: "center",
    textShadow: "0 2px 16px rgba(255,200,50,0.45)",
    color: "#fde68a",
    position: "relative",
    zIndex: 1,
  };

  const subtitleStyle = {
    fontSize: 12,
    color: "#c4a97a",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 28,
    position: "relative",
    zIndex: 1,
  };

  const cardStyle = {
    width: "100%",
    maxWidth: 620,
    background: "rgba(240,230,200,0.06)",
    border: `2px solid ${room.color}99`,
    borderRadius: 18,
    padding: "28px 28px 32px",
    boxShadow: `0 8px 40px ${room.color}55`,
    backdropFilter: "blur(6px)",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
  };

  const roomDescStyle = {
    fontSize: 14,
    color: "#d4c4a0",
    lineHeight: 1.6,
    marginBottom: 22,
    padding: "10px 14px",
    background: room.bg,
    borderRadius: 10,
    borderLeft: `3px solid ${room.color}`,
  };

  const dotStyle = (i) => ({
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: i < qIdx ? "#4ade80" : i === qIdx ? "#fde68a" : "rgba(240,230,200,0.18)",
    border: i === qIdx ? "2px solid #fde68a88" : "2px solid transparent",
    transition: "background 0.3s",
    flexShrink: 0,
  });

  const optionBtnStyle = (i) => {
    const isDisabled = phase !== "question";
    let bg     = "rgba(240,230,200,0.08)";
    let border = "1px solid rgba(240,230,200,0.20)";
    let color  = "#f0e6c8";
    if (phase === "feedback") {
      bg     = lastCorrect ? "rgba(74,222,128,0.16)"  : "rgba(248,113,113,0.16)";
      border = lastCorrect ? "1px solid #4ade8088"    : "1px solid #f8717188";
    } else if (hoveredBtn === i) {
      bg     = "rgba(253,230,138,0.13)";
      border = `1px solid ${room.color}`;
      color  = "#fde68a";
    }
    return {
      background: bg, border, color,
      borderRadius: 10,
      padding: "13px 10px",
      fontSize: 15,
      fontWeight: 600,
      cursor: isDisabled ? "default" : "pointer",
      transition: "all 0.18s",
      textAlign: "center",
      lineHeight: 1.35,
      opacity: isDisabled ? 0.85 : 1,
    };
  };

  const feedbackBoxStyle = {
    marginTop: 18,
    padding: "12px 16px",
    borderRadius: 10,
    background: lastCorrect ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
    border: `1px solid ${lastCorrect ? "#4ade8088" : "#f8717188"}`,
    color: lastCorrect ? "#86efac" : "#fca5a5",
    fontSize: 14,
    lineHeight: 1.55,
    fontWeight: 500,
  };

  const goldBtnStyle = {
    background: "linear-gradient(135deg, #92400e, #fde68a)",
    color: "#1a0800",
    border: "none",
    borderRadius: 12,
    padding: "14px 34px",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 22px rgba(253,230,138,0.35)",
    letterSpacing: 0.4,
  };

  const ghostBtnStyle = {
    background: "rgba(240,230,200,0.10)",
    border: "1px solid rgba(240,230,200,0.30)",
    color: "#f0e6c8",
    borderRadius: 12,
    padding: "14px 28px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  };

  /* ── stars decoration ──────────────────────────────────────────── */
  const renderStars = () => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {STAR_POS.map(([x, y], i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            fontSize: i % 3 === 0 ? 9 : i % 3 === 1 ? 5 : 4,
            color: "rgba(253,230,138,0.28)",
            userSelect: "none",
          }}
        >★</span>
      ))}
    </div>
  );

  /* ── question / feedback view ──────────────────────────────────── */
  const renderQuestion = () => (
    <div style={cardStyle}>
      {/* room header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <span style={{ fontSize: 40, lineHeight: 1 }}>{room.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "clamp(17px,3.5vw,22px)", fontWeight: 700, color: "#fde68a" }}>
            {room.name}
          </div>
          <div style={{ fontSize: 13, color: "#c4a97a", marginTop: 2 }}>
            Salle {room.id}&nbsp;/&nbsp;3 — Question {qIdx + 1}&nbsp;/&nbsp;{room.questions.length}
          </div>
        </div>
      </div>

      {/* description banner */}
      <div style={roomDescStyle}>{room.desc}</div>

      {/* progress dots */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {room.questions.map((_, i) => <div key={i} style={dotStyle(i)} />)}
      </div>

      {/* question sentence */}
      <div style={{
        fontSize: "clamp(15px, 3vw, 18px)",
        fontWeight: 600,
        lineHeight: 1.6,
        color: "#f0e6c8",
        marginBottom: 22,
        minHeight: 54,
      }}>
        {question.question}
      </div>

      {/* options 2×2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {question.options.map((opt, i) => (
          <button
            key={i}
            style={optionBtnStyle(i)}
            onClick={() => handleAnswer(i)}
            onMouseEnter={() => { if (phase === "question") setHoveredBtn(i); }}
            onMouseLeave={() => setHoveredBtn(null)}
            disabled={phase !== "question"}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* feedback strip */}
      {phase === "feedback" && (
        <div style={feedbackBoxStyle}>
          {lastFeedback}
          {!lastCorrect && (
            <div style={{ marginTop: 7, fontSize: 13, color: "#f87171cc", fontStyle: "italic" }}>
              ✗ Recommencez la salle depuis le début !
            </div>
          )}
        </div>
      )}
    </div>
  );

  /* ── between-room view ─────────────────────────────────────────── */
  const renderBetween = () => (
    <div style={{
      width: "100%", maxWidth: 520,
      background: "rgba(240,230,200,0.07)",
      border: "2px solid #fde68a55",
      borderRadius: 20,
      padding: "44px 36px",
      textAlign: "center",
      boxShadow: "0 8px 52px rgba(253,230,138,0.18)",
      position: "relative", zIndex: 1,
      boxSizing: "border-box",
    }}>
      <div style={{ fontSize: 64, marginBottom: 14 }}>🎉</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#fde68a", marginBottom: 10 }}>
        Salle déverrouillée !
      </div>
      <div style={{ fontSize: 15, color: "#d4c4a0", lineHeight: 1.65, marginBottom: 30 }}>
        Bravo ! Vous avez maîtrisé la{" "}
        <strong style={{ color: "#fde68a" }}>{room.name}</strong> !<br />
        La prochaine salle vous attend, héros…
      </div>
      <button style={goldBtnStyle} onClick={handleNextRoom}>
        Ouvrir la prochaine porte →
      </button>
    </div>
  );

  /* ── victory view ──────────────────────────────────────────────── */
  const renderVictory = () => (
    <div style={{
      width: "100%", maxWidth: 540,
      background: "rgba(253,230,138,0.06)",
      border: "2px solid #fde68a",
      borderRadius: 22,
      padding: "52px 40px",
      textAlign: "center",
      boxShadow: "0 0 70px rgba(253,230,138,0.22)",
      position: "relative", zIndex: 1,
      boxSizing: "border-box",
    }}>
      <div style={{
        fontSize: 84,
        marginBottom: 16,
        filter: "drop-shadow(0 4px 18px rgba(253,230,138,0.7))",
      }}>🏆</div>
      <div style={{
        fontSize: "clamp(20px,5vw,28px)",
        fontWeight: 900,
        color: "#fde68a",
        marginBottom: 12,
        lineHeight: 1.3,
      }}>
        Félicitations !<br />Vous avez libéré le château !
      </div>
      <div style={{ fontSize: 15, color: "#d4c4a0", lineHeight: 1.65, marginBottom: 36 }}>
        Vous avez traversé les trois salles et prouvé votre maîtrise du{" "}
        <strong style={{ color: "#fde68a" }}>passé composé</strong>.<br />
        Le royaume vous est reconnaissant, grand(e) héros !
      </div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <button style={goldBtnStyle} onClick={handleReplay}>🔄 Rejouer</button>
        {onBack && (
          <button style={ghostBtnStyle} onClick={onBack}>← Retour</button>
        )}
      </div>
    </div>
  );

  /* ── main render ─────────────────────────────────────────────── */
  return (
    <div style={rootStyle}>
      {renderStars()}

      {/* back button (not on victory, which has its own) */}
      {phase !== "victory" && onBack && (
        <button style={backBtnStyle} onClick={onBack}>← Retour</button>
      )}

      {/* header */}
      <div style={titleStyle}>🏰 Château Évasion</div>
      <div style={subtitleStyle}>Passé Composé — Niveau 9</div>

      {/* content */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {phase === "between"                              && renderBetween()}
        {phase === "victory"                              && renderVictory()}
        {(phase === "question" || phase === "feedback")   && renderQuestion()}
      </div>
    </div>
  );
}
