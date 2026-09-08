import React, { useState } from 'react';
import { Gamepad2, ArrowLeft, Compass, Sword, Radio, BookOpen } from 'lucide-react';
import Francotopia from '../games/Francotopia';
import MineurFou from '../games/MineurFou';
import SpeedRunnerPrepositions from '../games/SpeedRunnerPrepositions';
import BossBattlePresent from '../games/BossBattlePresent';
import TowerDefenseVocab from '../games/TowerDefenseVocab';
import StoryRPGFirstDay from '../games/StoryRPGFirstDay';

// ── Inline styles injected once ──────────────────────────────────────────────
const JEUX_STYLES = `
.jeux-menu { display:flex; flex-direction:column; align-items:center; gap:2rem; padding:1rem 0; width:100%; }
.jeux-title { display:flex; align-items:center; gap:.75rem; margin:0 0 .25rem; font-size:1.75rem;
              font-weight:800; color:#1e293b; justify-content:center; }
.jeux-subtitle { color:#64748b; margin:0; font-size:.95rem; text-align:center; }
.jeux-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
              gap:1.5rem; width:100%; max-width:960px; margin:0 auto; }
.jeux-card { cursor:pointer; border-radius:1.25rem; padding:2rem 1.75rem;
             display:flex; flex-direction:column; align-items:center; text-align:center;
             gap:1rem; transition:all .25s cubic-bezier(.4,0,.2,1);
             box-shadow:0 4px 6px -1px rgba(0,0,0,.05); background:#ffffff; }
.jeux-card:hover { transform:translateY(-6px); }

.jeux-card-purple { background:linear-gradient(135deg,rgba(124,58,237,.07),rgba(99,102,241,.12));
                    border:2px solid rgba(124,58,237,.25); }
.jeux-card-purple:hover { box-shadow:0 20px 40px rgba(124,58,237,.2); border-color:rgba(124,58,237,.55); }

.jeux-card-gold { background:linear-gradient(135deg,rgba(212,160,26,.07),rgba(180,83,9,.10));
                  border:2px solid rgba(212,160,26,.3); }
.jeux-card-gold:hover { box-shadow:0 20px 40px rgba(212,160,26,.22); border-color:rgba(212,160,26,.65); }

.jeux-card-cyan { background:linear-gradient(135deg,rgba(6,182,212,.08),rgba(14,165,233,.12));
                  border:2px solid rgba(6,182,212,.3); }
.jeux-card-cyan:hover { box-shadow:0 20px 40px rgba(6,182,212,.22); border-color:rgba(6,182,212,.65); }

.jeux-card-rose { background:linear-gradient(135deg,rgba(244,63,94,.08),rgba(225,29,72,.12));
                  border:2px solid rgba(244,63,94,.3); }
.jeux-card-rose:hover { box-shadow:0 20px 40px rgba(244,63,94,.22); border-color:rgba(244,63,94,.65); }

.jeux-card-emerald { background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(5,150,105,.12));
                     border:2px solid rgba(16,185,129,.3); }
.jeux-card-emerald:hover { box-shadow:0 20px 40px rgba(16,185,129,.22); border-color:rgba(16,185,129,.65); }

.jeux-card-indigo { background:linear-gradient(135deg,rgba(99,102,241,.08),rgba(79,70,229,.12));
                    border:2px solid rgba(99,102,241,.3); }
.jeux-card-indigo:hover { box-shadow:0 20px 40px rgba(99,102,241,.22); border-color:rgba(99,102,241,.65); }

.jeux-card-icon { font-size:3.2rem; line-height:1; }
.jeux-card-badge { width:48px; height:48px; border-radius:50%; display:flex;
                   align-items:center; justify-content:center; margin-top:-.5rem; color:white; }
.jeux-card-badge-purple { background:linear-gradient(135deg,#7c3aed,#6366f1); }
.jeux-card-badge-gold   { background:linear-gradient(135deg,#d4a01a,#b45309); }
.jeux-card-badge-cyan   { background:linear-gradient(135deg,#06b6d4,#0284c7); }
.jeux-card-badge-rose   { background:linear-gradient(135deg,#f43f5e,#be123c); }
.jeux-card-badge-emerald { background:linear-gradient(135deg,#10b981,#047857); }
.jeux-card-badge-indigo { background:linear-gradient(135deg,#6366f1,#4338ca); }

.jeux-card-title { margin:0 0 .4rem; font-size:1.25rem; font-weight:800; }
.jeux-card-desc { margin:0; color:#64748b; font-size:.88rem; line-height:1.5; }
.jeux-card-tagline { font-weight:600; display:block; margin-top:0.25rem; }

.jeux-tags { display:flex; gap:.45rem; flex-wrap:wrap; justify-content:center; margin-top:auto; }
.jeux-tag { padding:3px 10px; border-radius:20px; font-size:.75rem; font-weight:700; }

.jeux-back-btn {
  display:inline-flex; align-items:center; gap:0.5rem; background:#ffffff;
  color:#0f172a; border:2px solid #e2e8f0; border-radius:9999px;
  padding:0.55rem 1.25rem; cursor:pointer; font-weight:800; font-size:0.88rem;
  box-shadow:0 2px 6px rgba(0,0,0,0.08); transition:all 0.15s ease; margin-bottom:1.25rem;
}
.jeux-back-btn:hover {
  background:#f8fafc; transform:translateX(-2px); border-color:#cbd5e1;
}
`;

let _stylesInjected = false;
function injectStyles() {
  if (_stylesInjected) return;
  _stylesInjected = true;
  const el = document.createElement('style');
  el.textContent = JEUX_STYLES;
  document.head.appendChild(el);
}

export default function JeuxSection({ chapterId, vocabulary }) {
  const [activeGame, setActiveGame] = useState(null);
  injectStyles();

  const isReprise = chapterId === 'unite-reprise' || chapterId === 'reprise';

  // ── Render Active Game ─────────────────────────────────────────────────────
  if (activeGame) {
    return (
      <div className="section-container glass-container fade-in" style={{ width: '100%', padding: '1.25rem' }}>
        <button onClick={() => setActiveGame(null)} className="jeux-back-btn">
          <ArrowLeft size={16} /> ← Retour au menu des jeux
        </button>

        {activeGame === 'francotopia' && (
          <Francotopia
            chapterId={chapterId}
            vocabulary={vocabulary}
            onBack={() => setActiveGame(null)}
          />
        )}

        {activeGame === 'mineur' && (
          <MineurFou onBack={() => setActiveGame(null)} />
        )}

        {activeGame === 'speedrunner' && (
          <SpeedRunnerPrepositions />
        )}

        {activeGame === 'bossbattle' && (
          <BossBattlePresent />
        )}

        {activeGame === 'towerdefense' && (
          <TowerDefenseVocab />
        )}

        {activeGame === 'storyrpg' && (
          <StoryRPGFirstDay />
        )}
      </div>
    );
  }

  // ── Game Selection Menu for Module Reprise ──────────────────────────────────
  if (isReprise) {
    return (
      <div className="section-container glass-container fade-in">
        <div className="jeux-menu">
          <div style={{ textAlign: 'center' }}>
            <h2 className="jeux-title">
              <Gamepad2 size={30} style={{ color: '#0284c7' }} />
              Jeux &amp; Défis Interactifs — La Rentrée
            </h2>
            <p className="jeux-subtitle">
              4 aventures ludiques pour réviser les prépositions, le présent et le vocabulaire de rentrée.
            </p>
          </div>

          <div className="jeux-cards">
            {/* 1. Speed-Runner */}
            <div className="jeux-card jeux-card-cyan" onClick={() => setActiveGame('speedrunner')}>
              <div className="jeux-card-icon">🏃‍♂️</div>
              <div className="jeux-card-badge jeux-card-badge-cyan">
                <Compass size={22} />
              </div>
              <div>
                <h3 className="jeux-card-title" style={{ color: '#0369a1' }}>Speed-Runner des Prépositions</h3>
                <p className="jeux-card-desc">
                  Course d'obstacles dynamique inspirée de Disney.<br />
                  <span className="jeux-card-tagline" style={{ color: '#0284c7' }}>Esquivez les pièges et choisissez la bonne préposition !</span>
                </p>
              </div>
              <div className="jeux-tags">
                <span className="jeux-tag" style={{ background: '#e0f2fe', color: '#0369a1' }}>Prépositions</span>
                <span className="jeux-tag" style={{ background: '#e0f2fe', color: '#0369a1' }}>Réflexes 3D</span>
              </div>
            </div>

            {/* 2. Boss Battle Présent */}
            <div className="jeux-card jeux-card-rose" onClick={() => setActiveGame('bossbattle')}>
              <div className="jeux-card-icon">⚔️</div>
              <div className="jeux-card-badge jeux-card-badge-rose">
                <Sword size={22} />
              </div>
              <div>
                <h3 className="jeux-card-title" style={{ color: '#be123c' }}>L'Arène du Présent (Boss Battle)</h3>
                <p className="jeux-card-desc">
                  Duel contre le Titan du Présent.<br />
                  <span className="jeux-card-tagline" style={{ color: '#e11d48' }}>Conjuguez à toute vitesse pour lancer vos attaques magiques !</span>
                </p>
              </div>
              <div className="jeux-tags">
                <span className="jeux-tag" style={{ background: '#ffe4e6', color: '#be123c' }}>Verbes au présent</span>
                <span className="jeux-tag" style={{ background: '#ffe4e6', color: '#be123c' }}>Combat 3D</span>
              </div>
            </div>

            {/* 3. Tour Défense Vocabulaire */}
            <div className="jeux-card jeux-card-indigo" onClick={() => setActiveGame('towerdefense')}>
              <div className="jeux-card-icon">🏰</div>
              <div className="jeux-card-badge jeux-card-badge-indigo">
                <Radio size={22} />
              </div>
              <div>
                <h3 className="jeux-card-title" style={{ color: '#4338ca' }}>Tour Défense du Vocabulaire</h3>
                <p className="jeux-card-desc">
                  Défendez votre base contre les vagues d'assaillants.<br />
                  <span className="jeux-card-tagline" style={{ color: '#4f46e5' }}>Activez vos tourelles en traduisant les mots clés !</span>
                </p>
              </div>
              <div className="jeux-tags">
                <span className="jeux-tag" style={{ background: '#e0e7ff', color: '#4338ca' }}>Vocabulaire</span>
                <span className="jeux-tag" style={{ background: '#e0e7ff', color: '#4338ca' }}>Stratégie</span>
              </div>
            </div>

            {/* 4. Story RPG Premier Jour */}
            <div className="jeux-card jeux-card-emerald" onClick={() => setActiveGame('storyrpg')}>
              <div className="jeux-card-icon">🎒</div>
              <div className="jeux-card-badge jeux-card-badge-emerald">
                <BookOpen size={22} />
              </div>
              <div>
                <h3 className="jeux-card-title" style={{ color: '#047857' }}>L'Aventure du Premier Jour</h3>
                <p className="jeux-card-desc">
                  RPG narratif immersif au lycée d'immersion.<br />
                  <span className="jeux-card-tagline" style={{ color: '#059669' }}>Faites les bons choix de dialogue pour réussir votre rentrée !</span>
                </p>
              </div>
              <div className="jeux-tags">
                <span className="jeux-tag" style={{ background: '#d1fae5', color: '#047857' }}>Communication</span>
                <span className="jeux-tag" style={{ background: '#d1fae5', color: '#047857' }}>Récit RPG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Game Selection Menu for Unité 1 (Héros et Anti-Héros) ───────────────────
  const TAGS_U1 = ['Héros', 'Imparfait', 'Passé composé', 'Connecteurs'];

  return (
    <div className="section-container glass-container fade-in">
      <div className="jeux-menu">
        <div style={{ textAlign: 'center' }}>
          <h2 className="jeux-title">
            <Gamepad2 size={30} style={{ color: '#7c3aed' }} />
            Jeux &amp; Défis Interactifs — Unité 1
          </h2>
          <p className="jeux-subtitle">
            Choisissez votre aventure linguistique parmi les univers des héros et anti-héros.
          </p>
        </div>

        <div className="jeux-cards">
          {/* Francotopia */}
          <div className="jeux-card jeux-card-purple" onClick={() => setActiveGame('francotopia')}>
            <div className="jeux-card-icon">🗺️</div>
            <div className="jeux-card-badge jeux-card-badge-purple">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h3 className="jeux-card-title" style={{ color: '#4c1d95' }}>Francotopia</h3>
              <p className="jeux-card-desc">
                La Quête des Héros et Anti-Héros — RPG 2D<br />
                <span className="jeux-card-tagline" style={{ color: '#7c3aed' }}>Explore la carte, résous les énigmes et progresse !</span>
              </p>
            </div>
            <div className="jeux-tags">
              {TAGS_U1.map((t) => (
                <span key={t} className="jeux-tag" style={{ background: 'rgba(124,58,237,.12)', color: '#6d28d9' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* MineurFou */}
          <div className="jeux-card jeux-card-gold" onClick={() => setActiveGame('mineur')}>
            <div className="jeux-card-icon">⛏️</div>
            <div className="jeux-card-badge jeux-card-badge-gold">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h3 className="jeux-card-title" style={{ color: '#92400e' }}>Le Mineur Fou</h3>
              <p className="jeux-card-desc">
                Jeu de minage interactif en 4 niveaux avec audio authentique.<br />
                <span className="jeux-card-tagline" style={{ color: '#d4a01a' }}>Creuse, réponds aux questions et deviens Maître Mineur !</span>
              </p>
            </div>
            <div className="jeux-tags">
              {TAGS_U1.map((t) => (
                <span key={t} className="jeux-tag" style={{ background: 'rgba(212,160,26,.12)', color: '#92400e' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
