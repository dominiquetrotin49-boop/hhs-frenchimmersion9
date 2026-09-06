import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import Francotopia from '../games/Francotopia';
import MineurFou from '../games/MineurFou';

// ── Inline styles injected once ──────────────────────────────────────────────
const JEUX_STYLES = `
.jeux-menu { display:flex; flex-direction:column; align-items:center; gap:2rem; padding:1rem 0; }
.jeux-title { display:flex; align-items:center; gap:.75rem; margin:0 0 .25rem; font-size:1.75rem;
              font-weight:800; color:#1e293b; }
.jeux-subtitle { color:#64748b; margin:0; font-size:.95rem; }
.jeux-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
              gap:1.5rem; width:100%; max-width:760px; }
.jeux-card { cursor:pointer; border-radius:1.25rem; padding:2.5rem 2rem;
             display:flex; flex-direction:column; align-items:center; text-align:center;
             gap:1rem; transition:all .25s cubic-bezier(.4,0,.2,1);
             box-shadow:0 4px 6px -1px rgba(0,0,0,.05); }
.jeux-card:hover { transform:translateY(-6px); }
.jeux-card-purple { background:linear-gradient(135deg,rgba(124,58,237,.07),rgba(99,102,241,.12));
                    border:2px solid rgba(124,58,237,.25); }
.jeux-card-purple:hover { box-shadow:0 20px 40px rgba(124,58,237,.2);
                           border-color:rgba(124,58,237,.55); }
.jeux-card-gold { background:linear-gradient(135deg,rgba(212,160,26,.07),rgba(180,83,9,.10));
                  border:2px solid rgba(212,160,26,.3); }
.jeux-card-gold:hover { box-shadow:0 20px 40px rgba(212,160,26,.22);
                         border-color:rgba(212,160,26,.65); }
.jeux-card-icon { font-size:3.5rem; line-height:1; }
.jeux-card-badge { width:52px; height:52px; border-radius:50%; display:flex;
                   align-items:center; justify-content:center; margin-top:-.5rem; }
.jeux-card-badge-purple { background:linear-gradient(135deg,#7c3aed,#6366f1); }
.jeux-card-badge-gold   { background:linear-gradient(135deg,#d4a01a,#b45309); }
.jeux-card-badge svg { color:white; }
.jeux-card-title-purple { margin:0 0 .4rem; font-size:1.3rem; font-weight:800; color:#4c1d95; }
.jeux-card-title-gold   { margin:0 0 .4rem; font-size:1.3rem; font-weight:800; color:#92400e; }
.jeux-card-desc { margin:0; color:#64748b; font-size:.91rem; line-height:1.55; }
.jeux-card-tagline-purple { color:#7c3aed; font-weight:600; }
.jeux-card-tagline-gold   { color:#d4a01a;  font-weight:600; }
.jeux-tags { display:flex; gap:.45rem; flex-wrap:wrap; justify-content:center; }
.jeux-tag-purple { background:rgba(124,58,237,.12); color:#6d28d9; padding:2px 10px;
                   border-radius:20px; font-size:.77rem; font-weight:600; }
.jeux-tag-gold   { background:rgba(212,160,26,.12); color:#92400e; padding:2px 10px;
                   border-radius:20px; font-size:.77rem; font-weight:600; }
`;

let _stylesInjected = false;
function injectStyles() {
  if (_stylesInjected) return;
  _stylesInjected = true;
  const el = document.createElement('style');
  el.textContent = JEUX_STYLES;
  document.head.appendChild(el);
}

// ─────────────────────────────────────────────────────────────────────────────
export default function JeuxSection({ chapterId, vocabulary }) {
  const [activeGame, setActiveGame] = useState(null);
  injectStyles();

  // ── Active game renders ────────────────────────────────────────────────────
  if (activeGame === 'francotopia') {
    return (
      <div className="section-container glass-container fade-in">
        <Francotopia
          chapterId={chapterId}
          vocabulary={vocabulary}
          onBack={() => setActiveGame(null)}
        />
      </div>
    );
  }

  if (activeGame === 'mineur') {
    return (
      <div className="section-container glass-container fade-in">
        <MineurFou onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  // ── Game selection menu ────────────────────────────────────────────────────
  const TAGS = ['Héros', 'Imparfait', 'Passé composé', 'Connecteurs'];

  return (
    <div className="section-container glass-container fade-in">
      <div className="jeux-menu">
        <div style={{ textAlign:'center' }}>
          <h2 className="jeux-title">
            <Gamepad2 size={30} style={{ color:'#7c3aed' }} />
            Jeux Interactifs
          </h2>
          <p className="jeux-subtitle">
            Choisissez votre aventure linguistique — Unité 1
          </p>
        </div>

        <div className="jeux-cards">

          {/* ── Francotopia ──────────────────────────────────────────── */}
          <div className="jeux-card jeux-card-purple" onClick={() => setActiveGame('francotopia')}>
            <div className="jeux-card-icon">🗺️</div>
            <div className="jeux-card-badge jeux-card-badge-purple">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h3 className="jeux-card-title-purple">Francotopia</h3>
              <p className="jeux-card-desc">
                La Quête des Héros et Anti-Héros — RPG 2D<br />
                <span className="jeux-card-tagline-purple">Explore, réponds, progresse !</span>
              </p>
            </div>
            <div className="jeux-tags">
              {TAGS.map(t => <span key={t} className="jeux-tag-purple">{t}</span>)}
            </div>
          </div>

          {/* ── MineurFou ────────────────────────────────────────────── */}
          <div className="jeux-card jeux-card-gold" onClick={() => setActiveGame('mineur')}>
            <div className="jeux-card-icon">⛏️</div>
            <div className="jeux-card-badge jeux-card-badge-gold">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h3 className="jeux-card-title-gold">MineurFou</h3>
              <p className="jeux-card-desc">
                Jeu de minage interactif 2D<br />
                <span className="jeux-card-tagline-gold">Creuse, vends, deviens Maître Mineur !</span>
              </p>
            </div>
            <div className="jeux-tags">
              {TAGS.map(t => <span key={t} className="jeux-tag-gold">{t}</span>)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
