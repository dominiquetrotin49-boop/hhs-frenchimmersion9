import React from 'react';
import { GraduationCap } from 'lucide-react';
import AvatarWelcome from '../components/AvatarWelcome';
import './HomeDashboard.css';

export default function HomeDashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header glass-panel">
        <div>
          <p className="unit-subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 'bold' }}>Bienvenue !</p>
          <h2 className="unit-title text-gradient">La classe de français immersion 9</h2>
        </div>
      </header>

      <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <AvatarWelcome />

        <div className="glass-panel" style={{ padding: '3rem 4rem', maxWidth: '800px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #e76f51, #f4a261)', padding: '1.2rem', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(231, 111, 81, 0.35)' }}>
              <GraduationCap size={48} />
            </div>
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '1.2rem', color: 'var(--text-primary)' }}>
            Bienvenue sur votre plateforme <br />
            <span className="text-gradient">Français Immersion 9</span>
          </h1>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9, marginBottom: 0, color: 'var(--text-secondary)' }}>
            Bonjour à tous ! Ce site est votre plateforme d'apprentissage interactive. 
            Sélectionnez un <strong>module de cours</strong> dans le menu de gauche pour commencer à explorer les leçons de grammaire, 
            les exercices de vocabulaire, les pratiques d'écriture et nos simulations immersives.
          </p>
        </div>
      </div>
    </div>
  );
}
