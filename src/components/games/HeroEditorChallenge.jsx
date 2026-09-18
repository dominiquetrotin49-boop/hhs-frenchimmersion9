import React, { useState, useEffect, useMemo } from "react";
import { HERO_VOCAB, generateQuestionOptions } from "../../data/vocabulary";
import { Clock, Trophy, Zap, AlertCircle } from "lucide-react";
import "./Games.css";

export default function HeroEditorChallenge({ onBack }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [flash, setFlash] = useState(null);

  const [shuffledVocab] = useState(() => [...HERO_VOCAB].sort(() => Math.random() - 0.5));
  const currentQuestion = shuffledVocab[questionIndex % shuffledVocab.length];
  const options = useMemo(() => generateQuestionOptions(currentQuestion), [currentQuestion]);
  const isDefinition = useMemo(() => Math.random() > 0.5, [questionIndex]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (ans) => {
    if (gameOver) return;

    if (ans === currentQuestion.word) {
      setScore((s) => s + 100);
      setTimeLeft((t) => t + 3);
      setFlash("green");
      setTimeout(() => {
        setFlash(null);
        setQuestionIndex((i) => i + 1);
      }, 400);
    } else {
      setTimeLeft((t) => Math.max(0, t - 5));
      setFlash("red");
      setTimeout(() => setFlash(null), 500);
    }
  };

  if (gameOver) {
    const isMaster = score >= 600;
    const isKnight = score >= 300;
    return (
      <div className="game-shell flex-center" style={{ minHeight: "420px", textAlign: "center", padding: "2rem" }}>
        <Trophy size={64} style={{ color: isMaster ? "#f59e0b" : "#3b82f6", marginBottom: "1rem" }} />
        <h2>{isMaster ? "Exploit Héroïque !" : "Temps Écoulé !"}</h2>
        <p style={{ fontSize: "1.1rem", margin: "0.5rem 0 1rem" }}>
          Ton score final : <strong style={{ color: "#7c3aed", fontSize: "1.4rem" }}>{score} points</strong>
        </p>
        <p style={{ color: "#64748b", maxWidth: "450px", marginBottom: "1.5rem" }}>
          {isMaster
            ? "Tu possèdes une maîtrise parfaite du lexique des héros et anti-héros ! L'Oracle t'accorde le titre de Héros Suprême."
            : isKnight
            ? "Belle performance ! Tu as prouvé ta bravoure en franchissant de nombreuses épreuves de vocabulaire."
            : "Continue ton entraînement pour enrichir ton vocabulaire et battre ton record !"}
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            className="play-btn btn-danger"
            onClick={() => {
              setScore(0);
              setTimeLeft(60);
              setQuestionIndex(0);
              setGameOver(false);
            }}
          >
            Rejouer
          </button>
          <button className="play-btn" style={{ background: "#475569", color: "white" }} onClick={onBack}>
            Retour aux jeux
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`game-shell ${flash === "red" ? "shake" : ""}`}
      style={{
        transition: "background 0.2s",
        backgroundColor:
          flash === "green"
            ? "rgba(16,185,129,0.15)"
            : flash === "red"
            ? "rgba(244,63,94,0.15)"
            : "transparent",
        maxWidth: "760px",
        margin: "0 auto",
        padding: "1.5rem"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <button className="back-btn" onClick={onBack} style={{ margin: 0 }}>
          &larr; Quitter
        </button>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "1.4rem",
              fontWeight: 800,
              color: timeLeft < 15 ? "#ef4444" : "#f59e0b"
            }}
          >
            <Clock size={24} /> {timeLeft}s
          </div>
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#7c3aed",
              background: "rgba(124,58,237,0.1)",
              padding: "0.25rem 0.75rem",
              borderRadius: "0.5rem"
            }}
          >
            Score: {score}
          </div>
        </div>
      </div>

      {currentQuestion && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 1rem",
              borderRadius: "20px",
              background: "rgba(124,58,237,0.12)",
              color: "#6d28d9",
              fontWeight: 700,
              fontSize: "0.9rem",
              marginBottom: "1rem"
            }}
          >
            <Zap size={16} /> L'Oracle des Héros vous interroge
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: "1rem",
              padding: "1.5rem 1.75rem",
              marginBottom: "1.75rem",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
            }}
          >
            <p style={{ fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 0.5rem" }}>
              {isDefinition ? "Trouvez le terme correspondant à cette définition :" : "Complétez la phrase héroïque :"}
            </p>
            <p style={{ fontSize: "1.25rem", color: "#1e293b", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
              {isDefinition ? currentQuestion.definition : currentQuestion.sentence}
            </p>
          </div>

          <div className="mcq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {options.map((opt, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() => handleAnswer(opt)}
                style={{
                  padding: "1rem 1.25rem",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  borderRadius: "0.75rem",
                  border: "2px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#1e293b",
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
