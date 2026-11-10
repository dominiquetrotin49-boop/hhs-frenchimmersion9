import { Link } from 'react-router-dom';
import AvatarWelcome from '../components/AvatarWelcome';
import { chapters } from '../data/chapters';
import { GraduationCap, Shield, HeartPulse, Palette, Leaf, ArrowRight, Sparkles } from 'lucide-react';

function WelcomeView() {
  const getUnitIcon = (id) => {
    switch (id) {
      case 'unite-reprise': return <GraduationCap size={22} />;
      case 'unite-1': return <Shield size={22} />;
      case 'unite-2': return <HeartPulse size={22} />;
      case 'unite-3': return <Palette size={22} />;
      case 'unite-4': return <Leaf size={22} />;
      default: return <Sparkles size={22} />;
    }
  };

  const getUnitProgress = (id) => {
    switch (id) {
      case 'unite-reprise': return { pct: 100, label: '3 Dossiers • Complet', badge: 'Disponible' };
      case 'unite-1': return { pct: 100, label: '3 Dossiers • Complet', badge: 'Disponible' };
      case 'unite-2': return { pct: 100, label: '3 Dossiers • Complet', badge: 'Disponible' };
      default: return { pct: 35, label: '3 Dossiers • En préparation', badge: 'Aperçu' };
    }
  };

  const learningUnits = chapters.filter(c => c.id !== 'horloge-boreale');

  return (
    <div className="welcome-view fade-in">
      {/* Welcome Banner */}
      <div className="welcome-hero glass">
        <div className="welcome-badge">
          <Sparkles size={14} />
          <span>Immersion Française • 9e Année</span>
        </div>
        <h1 className="font-bold tracking-tight text-slate-900">Bienvenue sur Français immersion 9</h1>
        <p className="welcome-subtitle leading-relaxed">
          Votre espace interactif pour maîtriser le français, explorer la culture francophone et développer votre confiance à l'oral et à l'écrit.
        </p>

        {/* Interactive Avatars Jasmine & Kader */}
        <AvatarWelcome />
      </div>

      {/* Dashboard Modular Unit Tiles */}
      <section className="dashboard-units-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title font-bold tracking-tight text-slate-900">
            Parcours d'Apprentissage • Unités Modulaires
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Sélectionnez une unité pour accéder aux 3 dossiers
          </span>
        </div>

        <div className="dashboard-units-grid">
          {learningUnits.map((unit) => {
            const meta = getUnitProgress(unit.id);
            return (
              <Link
                key={unit.id}
                to={`/chapter/${unit.id}`}
                className="dashboard-unit-tile hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="unit-tile-top mb-3">
                    <div className="unit-tile-icon-badge bg-indigo-50 text-indigo-600 p-3 rounded-2xl">
                      {getUnitIcon(unit.id)}
                    </div>
                    <span className="unit-tile-status-pill">
                      {meta.badge}
                    </span>
                  </div>
                  <h3 className="unit-tile-title font-bold tracking-tight text-slate-900">
                    {unit.title}
                  </h3>
                  <p className="unit-tile-desc leading-relaxed">
                    {unit.description}
                  </p>
                </div>

                <div className="unit-tile-progress-wrap">
                  <div className="unit-tile-progress-meta">
                    <span>{meta.label}</span>
                    <span className="text-indigo-600 flex items-center gap-1">
                      Explorer <ArrowRight size={13} />
                    </span>
                  </div>
                  <div className="unit-tile-progress-bar h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="unit-tile-progress-fill"
                      style={{ width: `${meta.pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default WelcomeView;
