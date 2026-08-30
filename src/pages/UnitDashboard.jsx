import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Languages, PenTool, Gamepad2, ArrowLeft, Shield, HeartHandshake, Sparkles, Leaf } from 'lucide-react';
import { GRADE_9_UNITS } from '../data/coursesData';
import EscapeGame from '../components/EscapeGame';
import Unit2EscapeGame from '../components/Unit2EscapeGame';
import Unit3EscapeGame from '../components/Unit3EscapeGame';
import ArtDetectiveGame from '../components/games/ArtDetectiveGame';
import FilmDirectorGame from '../components/games/FilmDirectorGame';
import ArtAuctionGame from '../components/games/ArtAuctionGame';
import PracticeMenu from '../components/games/PracticeMenu';
import Fishtopia from '../components/games/Fishtopia';
import DontLookDown from '../components/games/DontLookDown';
import VocabFillInTheBlank from '../components/VocabFillInTheBlank';
import GrammarSection from '../components/GrammarSection';
import GameSection from '../components/games/GameSection';
import { REPRISE_VOCAB } from '../data/vocabulary';
import './UnitDashboard.css';

const TABS = [
  { id: 'grammar', label: 'Grammaire', icon: BookOpen },
  { id: 'vocabulary', label: 'Vocabulaire', icon: Languages },
  { id: 'practice', label: 'Activités & Écriture', icon: PenTool },
  { id: 'game', label: 'Jeux', icon: Gamepad2 },
];

const ICON_MAP = {
  Shield: Shield,
  HeartHandshake: HeartHandshake,
  Sparkles: Sparkles,
  Leaf: Leaf
};

export default function UnitDashboard() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('grammar');

  const g9Unit = GRADE_9_UNITS.find(u => u.id === unitId) || GRADE_9_UNITS[0];
  const IconComponent = ICON_MAP[g9Unit.iconName] || Shield;

  const cleanUnitId = unitId ? unitId.replace('g9-', '') : '1';

  // Game selection states
  const [selectedGame1, setSelectedGame1] = useState(null); // 'escape' or 'fishtopia'
  const [selectedGame2, setSelectedGame2] = useState(null); // 'escape' or 'dld'
  const [selectedGame4, setSelectedGame4] = useState(null); // 'detective', 'director', 'auction'

  return (
    <div className="dashboard-container">
      {/* HEADER BANNER */}
      <header className="dashboard-header glass-panel" style={{ borderLeft: `5px solid ${g9Unit.color}` }}>
        <div className="unit-header-left" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', width: '100%', marginBottom: '1rem' }}>
            <div>
              <button 
                onClick={() => navigate('/')}
                style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.8rem', cursor: 'pointer' }}
              >
                <ArrowLeft size={16} /> Retour à l'accueil
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="aqua-badge" style={{ background: `${g9Unit.color}22`, borderColor: `${g9Unit.color}66`, color: g9Unit.color }}>
                  {g9Unit.subtitle} — 9e Année
                </span>
              </div>
              <h2 className="unit-title text-gradient" style={{ fontSize: '2.2rem', marginTop: '0.4rem' }}>
                {g9Unit.title}
              </h2>
            </div>

            <div style={{ background: `${g9Unit.color}15`, border: `1px solid ${g9Unit.color}44`, padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconComponent size={36} style={{ color: g9Unit.color }} />
            </div>
          </div>

          {/* TAB BAR NAVIGATION */}
          <div className="tabs-container novel-style" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`tab-btn ${isActive ? 'active' : ''} novel-style`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} style={{ color: isActive ? g9Unit.color : 'inherit' }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* TAB CONTENT MODULES */}
      <div className="dashboard-content animate-fade-in" style={{ marginTop: '1.5rem' }}>
        
        {/* TAB 1: GRAMMAIRE */}
        {activeTab === 'grammar' && (
          <div className="section-content animate-in novel-frame-container">
            <GrammarSection unitId={cleanUnitId} />
          </div>
        )}

        {/* TAB 2: VOCABULAIRE */}
        {activeTab === 'vocabulary' && (
          <div className="section-content animate-in novel-frame-container">
            <VocabFillInTheBlank unitId={cleanUnitId} />
          </div>
        )}

        {/* TAB 3: ACTIVITÉS & ÉCRITURE */}
        {activeTab === 'practice' && (
          <div className="section-content animate-in novel-frame-container">
            <PracticeMenu unitId={cleanUnitId} />
          </div>
        )}

        {/* TAB 4: JEUX INTERACTIFS */}
        {activeTab === 'game' && (
          <div className="section-content animate-in novel-frame-container">
            {cleanUnitId === 'reprise' ? (
              <GameSection chapterId="unite-reprise" vocabulary={REPRISE_VOCAB} />
            ) : cleanUnitId === '4' ? (
              selectedGame4 === 'detective' ? (
                <ArtDetectiveGame onBack={() => setSelectedGame4(null)} />
              ) : selectedGame4 === 'director' ? (
                <FilmDirectorGame onBack={() => setSelectedGame4(null)} />
              ) : selectedGame4 === 'auction' ? (
                <ArtAuctionGame onBack={() => setSelectedGame4(null)} />
              ) : (
                <div>
                  <h3 className="mb-4 text-center">Choisissez votre Jeu Interactif !</h3>
                  <div className="game-cards-container">
                    <div className="game-card glass-panel" onClick={() => setSelectedGame4('detective')}>
                      <Gamepad2 className="game-icon" style={{ color: '#60a5fa' }} size={48} />
                      <h4>🕵️‍♂️ Le Détective d'Art (Vol au Louvre)</h4>
                      <p>Parcourez Paris, Montréal, Dakar et Bruxelles pour résoudre le mystère et retrouver le chef-d'œuvre !</p>
                      <button className="play-btn" style={{ background: '#3b82f6', color: 'white' }}>Mener l'Enquête</button>
                    </div>

                    <div className="game-card glass-panel" onClick={() => setSelectedGame4('director')}>
                      <Gamepad2 className="game-icon" style={{ color: '#c084fc' }} size={48} />
                      <h4>🎬 Festival de Cannes : Réalisateur</h4>
                      <p>Réalisez votre film, choisissez le cadrage, la bande originale et remportez la Palme d'Or !</p>
                      <button className="play-btn" style={{ background: '#8b5cf6', color: 'white' }}>Tourner le Film</button>
                    </div>

                    <div className="game-card glass-panel" onClick={() => setSelectedGame4('auction')}>
                      <Gamepad2 className="game-icon" style={{ color: '#10b981' }} size={48} />
                      <h4>🏛️ L'Enchère des Arts & Galerie Virtuelle</h4>
                      <p>Achetez des œuvres d'art lors d'enchères linguistiques et organisez votre propre vernissage !</p>
                      <button className="play-btn" style={{ background: '#10b981', color: 'white' }}>Accéder aux Enchères</button>
                    </div>
                  </div>
                </div>
              )
            ) : cleanUnitId === '3' ? (
              <Unit3EscapeGame />
            ) : cleanUnitId === '2' ? (
              selectedGame2 === 'escape' ? (
                <div>
                  <button className="back-btn mb-4" onClick={() => setSelectedGame2(null)}>← Retour aux jeux</button>
                  <Unit2EscapeGame />
                </div>
              ) : selectedGame2 === 'dld' ? (
                <DontLookDown onBack={() => setSelectedGame2(null)} />
              ) : (
                <div>
                  <h3 className="mb-4 text-center">Choisissez votre Jeu !</h3>
                  <div className="game-cards-container">
                    <div className="game-card glass-panel" onClick={() => setSelectedGame2('escape')}>
                      <Gamepad2 className="game-icon text-accent" size={48} />
                      <h4>Escape Game</h4>
                      <p>Testez vos connaissances en résolvant des énigmes !</p>
                      <button className="play-btn btn-accent">Jouer à l'Escape Game</button>
                    </div>
                    
                    <div className="game-card glass-panel" onClick={() => setSelectedGame2('dld')} style={{background: 'linear-gradient(to top, #38bdf8, #bae6fd)'}}>
                      <Gamepad2 className="game-icon text-white" size={48} />
                      <h4 className="text-white">Ne Regarde Pas En Bas !</h4>
                      <p className="text-white opacity-90">Grimpez tout en haut de la ville, mais ne tombez pas !</p>
                      <button className="play-btn" style={{background: 'white', color: '#1e293b'}}>Lancer le Jeu</button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              selectedGame1 === 'escape' ? (
                <div>
                  <button className="back-btn mb-4" onClick={() => setSelectedGame1(null)}>← Retour aux jeux</button>
                  <EscapeGame unitId={cleanUnitId} />
                </div>
              ) : selectedGame1 === 'fishtopia' ? (
                <Fishtopia onBack={() => setSelectedGame1(null)} />
              ) : (
                <div>
                  <h3 className="mb-4 text-center">Choisissez votre Jeu !</h3>
                  <div className="game-cards-container">
                    <div className="game-card glass-panel" onClick={() => setSelectedGame1('escape')}>
                      <Gamepad2 className="game-icon text-accent" size={48} />
                      <h4>Escape Game</h4>
                      <p>Testez vos connaissances en résolvant des énigmes !</p>
                      <button className="play-btn btn-accent">Jouer à l'Escape Game</button>
                    </div>
                    
                    <div className="game-card glass-panel" onClick={() => setSelectedGame1('fishtopia')} style={{background: 'linear-gradient(135deg, #4ade80, #3b82f6)'}}>
                      <Gamepad2 className="game-icon text-white" size={48} />
                      <h4 className="text-white">Francotopia (Jeu RPG)</h4>
                      <p className="text-white opacity-90">Baladez-vous, incarnez un hamster, gagnez des appâts et pêchez !</p>
                      <button className="play-btn" style={{background: 'white', color: '#1e293b'}}>Lancer Francotopia</button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

      </div>
    </div>
  );
}
