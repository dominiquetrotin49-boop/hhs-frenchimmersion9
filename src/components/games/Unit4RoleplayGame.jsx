import React, { useState, useEffect } from 'react';
import { Users, Timer, CheckCircle, ArrowRight, Play, Square, Award } from 'lucide-react';
import './Games.css';

const SCENARIOS = [
  {
    id: 'cinema',
    title: "La Sélection du Grand Prix de Cinéma",
    description: "Le jury du Festival du Film Francophone se réunit pour attribuer le premier prix. Les jurés débattent passionnément du scénario, de la mise en scène, de la bande originale et de la virtuosité des acteurs.",
    roles: [
      { name: "Président(e) du Jury", objective: "Évaluer l'esthétique et la portée émotionnelle du film au passé.", vocab: ["scénario", "mise en scène", "chef-d'œuvre", "7e art"] },
      { name: "Réalisateur(trice)", objective: "Défendre son film et expliquer son inspiration et l'utilisation du plan-séquence.", vocab: ["inspiration", "cadrage", "plan-séquence", "authenticité"] },
      { name: "Critique Cinéma", objective: "Analyser la bande originale, le synopsis et l'interprétation des acteurs.", vocab: ["bande originale", "synopsis", "interprétation", "critique d'art"] },
      { name: "Producteur(trice)", objective: "Présenter le mécénat, le doublage et la diffusion internationale.", vocab: ["mécénat", "doublage", "exposition", "succès"] }
    ]
  },
  {
    id: 'exposition',
    title: "L'Exposition du Musée d'Art Moderne",
    description: "Le comité d'acquisition d'un musée francophone décide quelles œuvres d'art et fresques murales contemporaines acheter pour la grande exposition temporaire.",
    roles: [
      { name: "Conservateur(trice) du Musée", objective: "Plaider pour la préservation du patrimoine immatériel et le symbolisme des œuvres.", vocab: ["exposition", "patrimoine culturel", "symbolisme", "œuvre d'art"] },
      { name: "Artiste Peintre / Street-Artiste", objective: "Expliquer sa démarche artistique, sa sensibilité et l'authenticité de sa fresque.", vocab: ["fresque murale", "sensibilité artistique", "authenticité", "créativité"] },
      { name: "Mécène d'Art", objective: "Proposer un soutien financier et fixer les conditions du vernissage.", vocab: ["mécénat", "vernissage", "édifice", "collection"] },
      { name: "Critique d'Art", objective: "Évaluer l'impact visuel et l'esthétique du mouvement artistique.", vocab: ["mouvement artistique", "esthétique", "nuance culturelle", "perspective"] }
    ]
  },
  {
    id: 'slam',
    title: "Le Grand Prix du Slam & de la Musique",
    description: "Le jury d'un festival international de musique et de poésie urbaine décerne le prix de la meilleure création poétique et musicale francophone.",
    roles: [
      { name: "Artiste Poète / Slammeur", objective: "Présenter son texte et expliquer la genèse de sa création au passé.", vocab: ["slam", "mélodie", "inspiration", "créativité"] },
      { name: "Directeur(trice) de Festival", objective: "Évaluer la sonorité, la virtuosité et la réaction du public.", vocab: ["sonorité", "virtuosité", "répertoire", "interprétation"] },
      { name: "Musicologue", objective: "Analyser les nuances culturelles et l'harmonie des instruments.", vocab: ["nuance culturelle", "harmonie", "patrimoine immatériel", "rythme"] },
      { name: "Journaliste Culturel", objective: "Rédiger un compte-rendu en alternant Imparfait et Passé Composé.", vocab: ["critique d'art", "passé composé", "imparfait", "succès"] }
    ]
  },
  {
    id: 'patrimoine',
    title: "Restauration du Patrimoine Architectural",
    description: "Une municipalité francophone débat de la restauration d'un édifice historique et de sa façade pour créer un nouvel espace culturel et artistique.",
    roles: [
      { name: "Architecte en Chef", objective: "Présenter le projet d'urbanisme, la restauration de la façade et la perspective.", vocab: ["édifice", "façade", "urbanisme", "perspective"] },
      { name: "Historien(ne) du Patrimoine", objective: "Insister sur la préservation des vestiges et de l'authenticité du monument.", vocab: ["vestige d'architecture", "authenticité", "patrimoine culturel", "histoire"] },
      { name: "Adjoint(e) à la Culture", objective: "Proposer des ateliers artistiques pour encourager la créativité locale.", vocab: ["créativité", "atelier", "sensibilité artistique", "exposition"] },
      { name: "Représentant(e) du Quartier", objective: "Exprimer les attentes des habitants quant à l'identité visuelle de la ville.", vocab: ["identité visuelle", "vernissage", "fresque murale", "communauté"] }
    ]
  }
];

const TIMER_DURATION = 45 * 60; // 45 minutes

export default function Unit4RoleplayGame() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timerRunning, setTimerRunning] = useState(false);
  const [report, setReport] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(TIMER_DURATION);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFinish = () => {
    setFinished(true);
    setTimerRunning(false);
  };

  if (finished) {
    return (
      <div className="game-container game-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', maxWidth: '600px' }}>
          <Award size={64} style={{ color: '#f1c40f', marginBottom: '1rem' }} />
          <h2 className="text-gradient">Commission Terminée !</h2>
          <p style={{ margin: '1rem 0' }}>Votre décision a été enregistrée :</p>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', fontStyle: 'italic', marginBottom: '2rem' }}>
            "{report || "Aucune décision n'a été saisie."}"
          </div>
          <button className="play-btn" onClick={() => { setFinished(false); setSelectedScenario(null); setReport(""); resetTimer(); }}>Retourner aux scénarios</button>
        </div>
      </div>
    );
  }

  if (selectedScenario) {
    return (
      <div className="game-container game-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header */}
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.8rem' }}>{selectedScenario.title}</h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>Jeu de Rôle : La Commission d'Aide Sociale</p>
            </div>
            <button className="back-btn" style={{ position: 'relative', top: 0, left: 0 }} onClick={() => setSelectedScenario(null)}>
              ← Retour
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
            
            {/* Left Column: Roles & Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass-panel">
                <h3><Users size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '10px' }} /> La Situation</h3>
                <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{selectedScenario.description}</p>
              </div>

              <div className="glass-panel">
                <h3>Rôles à distribuer</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {selectedScenario.roles.map((r, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)' }}>{r.name}</h4>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}><strong>Objectif:</strong> {r.objective}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {r.vocab.map((v, j) => (
                          <span key={j} style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Timer & Report */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass-panel" style={{ textAlign: 'center' }}>
                <h3><Timer size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '10px' }} /> Chronomètre</h3>
                <div style={{ fontSize: '3rem', fontFamily: 'monospace', fontWeight: 'bold', margin: '1rem 0' }}>
                  {formatTime(timeLeft)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button onClick={toggleTimer} className="play-btn" style={{ padding: '0.5rem 1rem', background: timerRunning ? 'var(--danger)' : 'var(--success)' }}>
                    {timerRunning ? <Square size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={resetTimer} className="play-btn" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)' }}>
                    Reset
                  </button>
                </div>
                <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '1rem' }}>Temps recommandé pour le débat : 45 minutes.</p>
              </div>

              <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3>Décision de la Commission</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1rem' }}>Quelle est la décision finale ? Quelles aides accordez-vous ?</p>
                <textarea 
                  style={{ width: '100%', flexGrow: 1, minHeight: '150px', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', resize: 'none' }}
                  placeholder="Rédigez la décision finale de la commission ici..."
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                />
                <button className="play-btn btn-success" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={handleFinish}>
                  <CheckCircle size={20} /> Entériner la décision
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container game-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="text-gradient">Jeu de Rôle : La Commission d'Aide Sociale</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '1rem auto' }}>
            Divisez la classe en petits groupes. Chaque groupe choisit un scénario. Distribuez les rôles, préparez vos arguments en utilisant le vocabulaire et les connecteurs logiques, puis lancez le débat !
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {SCENARIOS.map(scenario => (
            <div key={scenario.id} className="game-card glass-panel" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent)' }}>{scenario.title}</h3>
              <p style={{ flexGrow: 1, lineHeight: '1.5', opacity: 0.9 }}>{scenario.description}</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}><Users size={16} style={{ display: 'inline', verticalAlign: 'bottom', marginRight: '4px' }} /> {scenario.roles.length} Rôles</span>
                <button className="play-btn" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setSelectedScenario(scenario)}>
                  Sélectionner <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
