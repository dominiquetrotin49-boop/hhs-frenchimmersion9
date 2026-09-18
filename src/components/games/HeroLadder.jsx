import React, { useState, useMemo } from "react";
import { TrendingUp, LifeBuoy, Trophy, AlertTriangle, ShieldCheck } from "lucide-react";
import "./Games.css";

const IMPARFAIT_QUESTIONS = [
  {
    id: 1,
    question: "Autrefois, le héros ___ (garder) fidèlement les portes de la forteresse.",
    options: ["gardait", "a gardé", "gardera", "gardit"],
    correct: "gardait",
    explanation: "Sujet singulier (le héros) + verbe en -ER à l'imparfait -> terminaison -ait."
  },
  {
    id: 2,
    question: "Chaque matin, nous ___ (s'entraîner) au maniement du bouclier magique.",
    options: ["nous entraînions", "nous sommes entraînés", "nous entraînons", "nous entraîniez"],
    correct: "nous entraînions",
    explanation: "Habitude répétée (chaque matin) + 'nous' -> terminaison -ions."
  },
  {
    id: 3,
    question: "Quand ils étaient jeunes, les chevaliers ___ (être) loyaux et désintéressés.",
    options: ["étaient", "ont été", "seraient", "étiez"],
    correct: "étaient",
    explanation: "Le radical de 'être' à l'imparfait est ét- + terminaison -aient."
  },
  {
    id: 4,
    question: "Pendant que vous ___ (étudier) les parchemins anciens, l'ennemi complotait.",
    options: ["étudiiez", "étudiez", "avez étudié", "étudissiez"],
    correct: "étudiiez",
    explanation: "Avec 'vous' pour les verbes en -ier, on conserve deux 'i' : étud-i-iez."
  },
  {
    id: 5,
    question: "L'anti-héros ___ (faire) régner la peur sans jamais montrer son visage.",
    options: ["faisait", "a fait", "fisait", "faisais"],
    correct: "faisait",
    explanation: "Radical de 'faire' (fais-) + terminaison -ait pour la 3e personne du singulier."
  },
  {
    id: 6,
    question: "Nous ___ (manger) autour du feu de camp après chaque expédition.",
    options: ["mangions", "mangeions", "avons mangé", "mangeons"],
    correct: "mangions",
    explanation: "Devant le 'i' de -ions, le 'e' muet de mang- s'efface : mangions."
  },
  {
    id: 7,
    question: "Chaque hiver, vous ___ (commencer) l'entraînement aux aurores.",
    options: ["commenciez", "commençiez", "avez commencé", "commencerez"],
    correct: "commenciez",
    explanation: "Devant le 'i' de -iez, la cédille est inutile car le 'c' se prononce déjà [s]."
  },
  {
    id: 8,
    question: "Les espions ___ (savoir) toujours où se cachait le fugitif.",
    options: ["savaient", "ont su", "savirent", "sacheraient"],
    correct: "savaient",
    explanation: "Radical 'sav-' issu de 'nous savons' + -aient."
  },
  {
    id: 9,
    question: "Je ___ (pouvoir) ressentir l'approche des ténèbres dans la montagne.",
    options: ["pouvais", "ai pu", "pourrais", "pouvait"],
    correct: "pouvais",
    explanation: "1re personne du singulier (Je) -> terminaison -ais."
  },
  {
    id: 10,
    question: "Pourquoi emploie-t-on l'imparfait dans : 'Le château était immense et sombre' ?",
    options: ["Pour décrire un état ou un décor dans le passé", "Pour indiquer une action soudaine et brève", "Pour exprimer un ordre impératif", "Pour situer une action dans l'avenir"],
    correct: "Pour décrire un état ou un décor dans le passé",
    explanation: "L'imparfait est le temps par excellence de la description et du décor dans un récit."
  },
  {
    id: 11,
    question: "Tu ___ (devoir) protéger l'orphelin au péril de ta vie.",
    options: ["devais", "a dû", "devait", "dois"],
    correct: "devais",
    explanation: "2e personne du singulier (Tu) -> terminaison -ais."
  },
  {
    id: 12,
    question: "Dans les temps anciens, il ___ (falloir) trois années pour forger cette épée.",
    options: ["fallait", "a fallu", "fallit", "faudra"],
    correct: "fallait",
    explanation: "Le verbe impersonnel falloir fait 'il fallait' à l'imparfait."
  },
  {
    id: 13,
    question: "Nous ___ (prendre) souvent des chemins détournés pour échapper aux patrouilles.",
    options: ["prenions", "avons pris", "prenons", "prendions"],
    correct: "prenions",
    explanation: "Radical issu de 'nous prenons' (pren-) + -ions -> prenions."
  },
  {
    id: 14,
    question: "L'héroïne ___ (craindre) la trahison de son propre mentor.",
    options: ["craignait", "a craint", "craignit", "croyait"],
    correct: "craignait",
    explanation: "Radical de craindre (craign-) + terminaison -ait."
  }
];

const RANKS = [
  "Écuyer de l'Imparfait",
  "Page du Royaume",
  "Sentinelle du Temps",
  "Guerrier des Récits",
  "Chevalier Émérite",
  "Champion des Verbes",
  "Paladin Légendaire",
  "Commandant Suprême",
  "Gardien du Passé",
  "Maître de l'Imparfait"
];

export default function HeroLadder({ onBack }) {
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [lifelines, setLifelines] = useState({ fiftyFifty: true });
  const [feedback, setFeedback] = useState(null);

  const [shuffledQuestions] = useState(() => [...IMPARFAIT_QUESTIONS].sort(() => Math.random() - 0.5));
  const currentQ = level < 10 ? shuffledQuestions[level % shuffledQuestions.length] : null;

  const options = useMemo(() => {
    if (!currentQ) return [];
    return [...currentQ.options].sort(() => Math.random() - 0.5);
  }, [currentQ]);

  const handleAnswer = (ans) => {
    if (ans === currentQ.correct) {
      setFeedback({ type: "success", text: `Exact ! ${currentQ.explanation}` });
      setTimeout(() => {
        setFeedback(null);
        setEliminatedOptions([]);
        setLevel((l) => l + 1);
      }, 1000);
    } else {
      setFeedback({ type: "error", text: `Incorrect ! La bonne réponse était : "${currentQ.correct}". ${currentQ.explanation}` });
      setTimeout(() => {
        setGameOver(true);
      }, 1600);
    }
  };

  const use5050 = () => {
    if (!lifelines.fiftyFifty || !currentQ) return;
    setLifelines({ ...lifelines, fiftyFifty: false });
    const wrongOpts = currentQ.options.filter((o) => o !== currentQ.correct);
    const toEliminate = [wrongOpts[0], wrongOpts[1]];
    setEliminatedOptions(toEliminate);
  };

  if (level >= 10) {
    return (
      <div className="game-shell flex-center" style={{ textAlign: "center", padding: "2.5rem" }}>
        <Trophy size={72} style={{ color: "#f59e0b", marginBottom: "1rem" }} />
        <h2 style={{ color: "#047857", fontSize: "2rem" }}>Sommet Atteint !</h2>
        <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e293b", margin: "0.5rem 0" }}>
          Rang d'honneur : <span style={{ color: "#7c3aed" }}>Maître de l'Imparfait</span>
        </p>
        <p style={{ color: "#64748b", maxWidth: "520px", margin: "1rem auto 1.5rem", lineHeight: 1.6 }}>
          Tu as franchi avec brio les 10 échelons de la maîtrise de l'imparfait ! Tes récits héroïques ont désormais le relief, la profondeur et l'élégance des grands classiques.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            className="play-btn"
            style={{ background: "#059669", color: "white" }}
            onClick={() => {
              setLevel(0);
              setGameOver(false);
              setFeedback(null);
              setLifelines({ fiftyFifty: true });
            }}
          >
            Recommencer l'Ascension
          </button>
          <button className="play-btn" style={{ background: "#475569", color: "white" }} onClick={onBack}>
            Retour aux jeux
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="game-shell flex-center" style={{ textAlign: "center", padding: "2.5rem" }}>
        <AlertTriangle size={64} style={{ color: "#dc2626", marginBottom: "1rem" }} />
        <h2 style={{ color: "#b91c1c", fontSize: "1.8rem" }}>Chute de l'Échelle !</h2>
        <p style={{ fontSize: "1.1rem", margin: "0.5rem 0 1rem" }}>
          Tu as atteint le palier <strong>{level} / 10</strong> : <em>{RANKS[Math.max(0, level - 1)]}</em>
        </p>
        {feedback && (
          <div style={{ background: "#fee2e2", border: "1px solid #f87171", borderRadius: "0.75rem", padding: "1rem", maxWidth: "480px", margin: "0 auto 1.5rem", color: "#991b1b" }}>
            {feedback.text}
          </div>
        )}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            className="play-btn btn-danger"
            onClick={() => {
              setLevel(0);
              setGameOver(false);
              setFeedback(null);
              setLifelines({ fiftyFifty: true });
            }}
          >
            Réessayer
          </button>
          <button className="play-btn" style={{ background: "#475569", color: "white" }} onClick={onBack}>
            Retour aux jeux
          </button>
        </div>
      </div>
    );
  }

  const currentRank = RANKS[Math.min(RANKS.length - 1, level)];

  return (
    <div className="game-shell" style={{ maxWidth: "780px", margin: "0 auto", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <button className="back-btn" onClick={onBack} style={{ margin: 0 }}>
          &larr; Quitter
        </button>
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <div style={{ fontSize: "0.95rem", color: "#334155" }}>
            Rang : <strong style={{ color: "#047857" }}>{currentRank}</strong>
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: "1rem",
              background: "rgba(16,185,129,0.12)",
              color: "#047857",
              padding: "0.3rem 0.8rem",
              borderRadius: "20px"
            }}
          >
            Niveau {level + 1} / 10
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden", marginBottom: "1.25rem" }}>
        <div style={{ width: `${(level / 10) * 100}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #059669)", transition: "width 0.3s" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          className="back-btn"
          onClick={use5050}
          disabled={!lifelines.fiftyFifty}
          style={{
            margin: 0,
            opacity: lifelines.fiftyFifty ? 1 : 0.4,
            cursor: lifelines.fiftyFifty ? "pointer" : "not-allowed",
            border: "1px solid #10b981",
            color: "#047857"
          }}
        >
          <LifeBuoy size={16} style={{ marginRight: "0.4rem" }} /> Joker 50/50 {lifelines.fiftyFifty ? "(1 dispo)" : "(utilisé)"}
        </button>
      </div>

      {currentQ && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: "1rem",
              padding: "1.75rem 1.5rem",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#047857", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem" }}>
              <TrendingUp size={16} /> Épreuve de Grammaire — L'Imparfait
            </div>
            <p style={{ fontSize: "1.3rem", fontWeight: 600, color: "#1e293b", margin: 0, lineHeight: 1.5 }}>
              « {currentQ.question} »
            </p>
          </div>

          {feedback && (
            <div
              style={{
                background: feedback.type === "success" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                border: feedback.type === "success" ? "1px solid #10b981" : "1px solid #ef4444",
                color: feedback.type === "success" ? "#047857" : "#b91c1c",
                borderRadius: "0.75rem",
                padding: "0.85rem 1.25rem",
                marginBottom: "1.25rem",
                fontWeight: 600,
                fontSize: "0.95rem"
              }}
            >
              {feedback.text}
            </div>
          )}

          <div className="mcq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            {options.map((opt, i) => {
              const isEliminated = eliminatedOptions.includes(opt);
              return (
                <button
                  key={i}
                  className="option-btn"
                  onClick={() => handleAnswer(opt)}
                  disabled={isEliminated}
                  style={{
                    visibility: isEliminated ? "hidden" : "visible",
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
