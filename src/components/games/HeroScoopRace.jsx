import React, { useState, useMemo } from "react";
import { HERO_VOCAB, generateQuestionOptions } from "../../data/vocabulary";
import { Flag, Shield, Skull, Trophy, RotateCcw } from "lucide-react";
import "./Games.css";

export default function HeroScoopRace({ onBack }) {
  const [playerPos, setPlayerPos] = useState(0);
  const [rivalPos, setRivalPos] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [message, setMessage] = useState("");
  const trackLength = 8;

  const [shuffledVocab] = useState(() => [...HERO_VOCAB].sort(() => Math.random() - 0.5));
  const currentQuestion = shuffledVocab[questionIndex % shuffledVocab.length];
  const options = useMemo(() => generateQuestionOptions(currentQuestion), [currentQuestion]);

  const handleAnswer = (ans) => {
    if (ans === currentQuestion.word) {
      setPlayerPos((p) => p + 1);
      const formattedWord = currentQuestion.word.toLowerCase();
      const filledSentence = currentQuestion.sentence.replace('_____', formattedWord);
      setMessage(`✔ Excellente réponse ! « ${filledSentence} »`);
    } else {
      setRivalPos((r) => r + 1);
      setMessage(`Erreur ! Le mot attendu était "${currentQuestion.word}". L'anti-héros gagne du terrain.`);
    }
    setTimeout(() => {
      setMessage("");
      setQuestionIndex((i) => i + 1);
    }, 1300);
  };

  if (playerPos >= trackLength) {
    return (
      <div className="game-shell flex-center" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
        <Trophy size={64} style={{ color: "#f59e0b", marginBottom: "1rem" }} />
        <h2 style={{ color: "#047857", fontSize: "1.8rem" }}>Victoire Éclatante !</h2>
        <p style={{ fontSize: "1.1rem", maxWidth: "500px", margin: "0.5rem auto 1.5rem", color: "#334155" }}>
          Grâce à ta parfaite maîtrise du vocabulaire des héros, tu as franchi la ligne d'arrivée avant l'anti-héros et protégé le royaume !
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            className="play-btn"
            style={{ background: "#059669", color: "white" }}
            onClick={() => {
              setPlayerPos(0);
              setRivalPos(0);
              setQuestionIndex(0);
              setMessage("");
            }}
          >
            Rejouer la Course
          </button>
          <button className="play-btn" style={{ background: "#475569", color: "white" }} onClick={onBack}>
            Retour aux jeux
          </button>
        </div>
      </div>
    );
  }

  if (rivalPos >= trackLength) {
    return (
      <div className="game-shell flex-center" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
        <Skull size={64} style={{ color: "#dc2626", marginBottom: "1rem" }} />
        <h2 style={{ color: "#b91c1c", fontSize: "1.8rem" }}>L'Anti-Héros a Triomphé...</h2>
        <p style={{ fontSize: "1.1rem", maxWidth: "500px", margin: "0.5rem auto 1.5rem", color: "#334155" }}>
          L'anti-héros a franchi la porte du sanctuaire avant toi. Révise les termes clés et retente ta chance !
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            className="play-btn btn-danger"
            onClick={() => {
              setPlayerPos(0);
              setRivalPos(0);
              setQuestionIndex(0);
              setMessage("");
            }}
          >
            Prendre sa Revanche
          </button>
          <button className="play-btn" style={{ background: "#475569", color: "white" }} onClick={onBack}>
            Retour aux jeux
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-shell" style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem" }}>
      <button className="back-btn" onClick={onBack}>
        &larr; Quitter
      </button>

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0369a1", margin: "0 0 0.25rem" }}>
          🏇 La Course des Légendes
        </h2>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
          Trouvez le mot exact pour avancer vers le sanctuaire et distancer l'anti-héros !
        </p>
      </div>

      {/* Race Track */}
      <div
        style={{
          background: "#f8fafc",
          border: "2px solid #e2e8f0",
          borderRadius: "1rem",
          padding: "1.75rem 1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04)"
        }}
      >
        <div style={{ position: "relative", height: "190px" }}>
          {/* Top Lane (Héros) background strip */}
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              right: "60px",
              height: "82px",
              background: "rgba(2, 132, 199, 0.05)",
              borderRadius: "0.75rem",
              border: "1px solid rgba(2, 132, 199, 0.15)"
            }}
          />

          {/* Player (Héros) runner */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: `${(playerPos / trackLength) * 80}%`,
              transition: "left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 5
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 8px rgba(2, 132, 199, 0.35)"
              }}
            >
              <Shield size={24} />
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0369a1", marginTop: "5px", whiteSpace: "nowrap" }}>
              Toi (Héros)
            </span>
          </div>

          {/* Bottom Lane (Anti-Héros) background strip */}
          <div
            style={{
              position: "absolute",
              top: "105px",
              left: "0px",
              right: "60px",
              height: "82px",
              background: "rgba(225, 29, 72, 0.05)",
              borderRadius: "0.75rem",
              border: "1px solid rgba(225, 29, 72, 0.15)"
            }}
          />

          {/* Rival (Anti-Héros) runner */}
          <div
            style={{
              position: "absolute",
              top: "113px",
              left: `${(rivalPos / trackLength) * 80}%`,
              transition: "left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 5
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e11d48, #be123c)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 8px rgba(225, 29, 72, 0.35)"
              }}
            >
              <Skull size={24} />
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#be123c", marginTop: "5px", whiteSpace: "nowrap" }}>
              L'Anti-Héros
            </span>
          </div>

          {/* Vertical Finish Line */}
          <div
            style={{
              position: "absolute",
              right: "62px",
              top: "4px",
              bottom: "4px",
              width: "4px",
              background: "repeating-linear-gradient(to bottom, #f59e0b, #f59e0b 8px, #ffffff 8px, #ffffff 16px)",
              borderRadius: "2px",
              boxShadow: "0 0 4px rgba(245, 158, 11, 0.4)"
            }}
          />

          {/* Finish flag */}
          <div
            style={{
              position: "absolute",
              right: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Flag size={38} style={{ color: "#f59e0b", filter: "drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#b45309", marginTop: "2px" }}>
              Arrivée
            </span>
          </div>
        </div>
      </div>

      {message ? (
        <div
          style={{
            minHeight: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: message.includes("Excellente") ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            border: message.includes("Excellente") ? "2px solid #10b981" : "2px solid #ef4444",
            borderRadius: "1rem",
            padding: "1.5rem",
            textAlign: "center"
          }}
        >
          <h3 style={{ margin: 0, color: message.includes("Excellente") ? "#047857" : "#b91c1c", fontSize: "1.2rem" }}>
            {message}
          </h3>
        </div>
      ) : currentQuestion ? (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: "1rem",
              padding: "1.5rem 1.75rem",
              marginBottom: "1.5rem"
            }}
          >
            <p style={{ fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 0.5rem" }}>
              Complétez la phrase héroïque :
            </p>
            <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>
              « {currentQuestion.sentence} »
            </p>
          </div>

          <div className="mcq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {options.map((opt, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() => handleAnswer(opt)}
                style={{
                  padding: "0.9rem 1.2rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "0.75rem",
                  border: "2px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#1e293b",
                  cursor: "pointer"
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
