import React, { useState } from 'react';
import MystereAuPasse from '../games/MystereAuPasse';
import WritingPrompt from '../games/WritingPrompt';
import CrosswordSection from './CrosswordSection';
import HeroCrosswordSection from './HeroCrosswordSection';
import JeuxSection from './JeuxSection';
import './AtelierSection.css';

export default function AtelierSection({ chapterId, vocabulary }) {
  const isReprise = !chapterId || chapterId === 'unite-reprise';

  const TABS = isReprise
    ? [
        {
          id: 'recits',
          title: 'Atelier d\'Écriture',
          subtitle: '4 sujets de rédaction au présent avec IA Feedback',
          icon: '📝',
          color: '#0284c7',
          badgeBg: 'rgba(2, 132, 199, 0.12)'
        },
        {
          id: 'mots_croises',
          title: 'Mots Croisés',
          subtitle: '7 grilles interactives (Verbes, Prépositions & Clés)',
          icon: '🧩',
          color: '#d97706',
          badgeBg: 'rgba(217, 119, 6, 0.12)'
        },
        {
          id: 'jeux',
          title: 'Salle d\'Arcade & Quêtes',
          subtitle: 'Speed-Runner, Boss Battle, Tour Défense, RPG...',
          icon: '🎮',
          color: '#e11d48',
          badgeBg: 'rgba(225, 29, 72, 0.12)'
        }
      ]
    : [
        {
          id: 'mystere',
          title: 'Mystère au Passé',
          subtitle: 'Activité d\'écriture guidée (Tier 1 UDL)',
          icon: '✍️',
          color: '#0284c7',
          badgeBg: 'rgba(2, 132, 199, 0.12)'
        },
        {
          id: 'recits',
          title: 'Récits Héroïques',
          subtitle: '4 sujets de rédaction avec IA Feedback',
          icon: '📝',
          color: '#0891b2',
          badgeBg: 'rgba(8, 145, 178, 0.12)'
        },
        {
          id: 'mots_croises',
          title: 'Mots Croisés',
          subtitle: '5 grilles interactives (Héros & Anti-héros)',
          icon: '🧩',
          color: '#7c3aed',
          badgeBg: 'rgba(124, 58, 237, 0.12)'
        },
        {
          id: 'jeux',
          title: 'Salle d\'Arcade & Quêtes',
          subtitle: 'Château Évasion, Donjon, Tour des Ombres...',
          icon: '🎮',
          color: '#e11d48',
          badgeBg: 'rgba(225, 29, 72, 0.12)'
        }
      ];

  const [activeTab, setActiveTab] = useState(isReprise ? 'recits' : 'mystere');

  return (
    <div className="atelier-container fade-in">
      {/* Tab Selector */}
      <div className="atelier-nav-bar">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`atelier-nav-btn ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? tab.color : 'rgba(0, 0, 0, 0.08)'
              }}
            >
              <div
                className="atelier-btn-icon"
                style={{
                  background: isActive ? tab.badgeBg : '#f8fafc',
                  border: `1px solid ${isActive ? tab.color + '44' : 'rgba(0, 0, 0, 0.04)'}`
                }}
              >
                {tab.icon}
              </div>
              <div>
                <span className="atelier-btn-title" style={{ color: isActive ? tab.color : '#0f172a' }}>
                  {tab.title}
                </span>
                <span className="atelier-btn-sub">{tab.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="atelier-subpanel-card animate-fade-in">
        {activeTab === 'mystere' && (
          <MystereAuPasse />
        )}

        {activeTab === 'recits' && (
          <WritingPrompt chapterId={chapterId} unitId={isReprise ? 'unite-reprise' : '1'} />
        )}

        {activeTab === 'mots_croises' && (
          isReprise ? <CrosswordSection /> : <HeroCrosswordSection />
        )}

        {activeTab === 'jeux' && (
          <JeuxSection chapterId={chapterId || (isReprise ? 'unite-reprise' : 'unite-1')} vocabulary={vocabulary} />
        )}
      </div>
    </div>
  );
}
