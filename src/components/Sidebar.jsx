import { NavLink, Link } from 'react-router-dom';
import { chapters } from '../data/chapters';
import { Shield, HeartPulse, Palette, Leaf, GraduationCap, Clock, Lock, BookOpen } from 'lucide-react';

function Sidebar() {
  const getUnitIcon = (index) => {
    switch (index) {
      case 0: return <GraduationCap size={18} className="text-indigo-600" />;
      case 1: return <Shield size={18} className="text-indigo-600" />;
      case 2: return <HeartPulse size={18} className="text-teal-600" />;
      case 3: return <Palette size={18} className="text-violet-600" />;
      case 4: return <Leaf size={18} className="text-emerald-600" />;
      case 5: return <Clock size={18} className="text-violet-600" />;
      default: return <GraduationCap size={18} className="text-indigo-600" />;
    }
  };

  return (
    <aside className="app-sidebar glass">
      {/* Brand Header - Clickable to return to Main Welcome Page */}
      <Link to="/" className="sidebar-brand" title="Retourner à la page d'accueil">
        <div className="brand-icon">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="brand-title">Français immersion 9</h1>
          <span className="brand-sub">Tableau de Bord</span>
        </div>
      </Link>

      <div className="sidebar-divider" />

      {/* General Resources Section */}
      <div>
        <div className="sidebar-section-label">Ressources Générales</div>
        <nav className="sidebar-nav">
          <NavLink 
            to="/roman"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="unit-icon-pill" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
              <BookOpen size={17} style={{ color: '#d97706' }} />
            </span>
            <div className="flex flex-col text-left" style={{ lineHeight: '1.3' }}>
              <span className="text-xs font-bold text-slate-900">Le Mystère de l'Horloge Boréale</span>
              <span className="text-[10px] font-semibold text-amber-700">Roman Interactif • Audio</span>
            </div>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-divider" />

      {/* Units List Navigation */}
      <div>
        <div className="sidebar-section-label">Unités d'Apprentissage</div>
        <nav className="sidebar-nav">
          {chapters.filter(chapter => chapter.id !== 'horloge-boreale').map((chapter, index) => {
            const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
            const isFullyBlocked = isProduction && (
              chapter.id !== 'unite-reprise' && 
              chapter.id !== 'unite-1' && 
              chapter.id !== 'unite-2'
            );

            return (
              <NavLink 
                key={chapter.id} 
                to={`/chapter/${chapter.id}`}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${isFullyBlocked ? 'sidebar-link-blocked' : ''}`}
              >
                <span className="unit-icon-pill">
                  {isFullyBlocked ? <Lock size={17} className="text-slate-400" /> : getUnitIcon(index)}
                </span>
                <span className="link-text">{chapter.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
