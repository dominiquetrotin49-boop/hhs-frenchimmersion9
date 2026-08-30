import { NavLink, Link } from 'react-router-dom';
import { chapters } from '../data/chapters';
import { Shield, HeartPulse, Palette, Leaf, GraduationCap, Clock, Lock, BookOpen } from 'lucide-react';

function Sidebar() {
  const getUnitIcon = (index) => {
    switch (index) {
      case 0: return <Shield size={18} className="text-cyan-600" />;
      case 1: return <HeartPulse size={18} className="text-teal-600" />;
      case 2: return <Palette size={18} className="text-sky-600" />;
      case 3: return <Leaf size={18} className="text-emerald-600" />;
      case 4: return <GraduationCap size={18} className="text-slate-600" />;
      case 5: return <Clock size={18} className="text-violet-600" />;
      default: return <GraduationCap size={18} />;
    }
  };

  return (
    <aside className="app-sidebar glass">
      {/* Brand Header - Clickable to return to Main Welcome Page */}
      <Link to="/" className="sidebar-brand" title="Retourner à la page d'accueil">
        <div className="brand-icon">
          <GraduationCap size={26} />
        </div>
        <div>
          <h1 className="brand-title">Français immersion 9</h1>
          <span className="brand-sub">Page Principale</span>
        </div>
      </Link>

      <div className="sidebar-divider" />

      {/* General Resources Section */}
      <nav className="sidebar-nav" style={{ paddingBottom: '0px' }}>
        <div className="sidebar-section-label">Ressources Générales</div>
        <NavLink 
          to="/roman"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          style={({ isActive }) => ({
            background: isActive 
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(236, 72, 153, 0.25))'
              : 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.12))',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '1rem',
            padding: '0.8rem 1rem',
            marginBottom: '1rem'
          })}
        >
          <span className="unit-icon-pill" style={{ background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
            <BookOpen size={18} style={{ color: '#d97706' }} />
          </span>
          <div className="flex flex-col text-left" style={{ marginLeft: '0.5rem', lineHeight: '1.3' }}>
            <span className="text-[12px] font-extrabold text-slate-800">Le Mystère de l'Horloge Boréale</span>
          </div>
        </NavLink>
      </nav>

      <div className="sidebar-divider" style={{ marginTop: '0px' }} />

      {/* Units List Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Unités d'Apprentissage</div>
        
        {chapters.filter(chapter => chapter.id !== 'horloge-boreale').map((chapter, index) => {
          const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
          const isFullyBlocked = isProduction && (
            chapter.id !== 'unite-reprise' && 
            chapter.id !== 'unite-1'
          );

          return (
            <NavLink 
              key={chapter.id} 
              to={`/chapter/${chapter.id}`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${isFullyBlocked ? 'sidebar-link-blocked' : ''}`}
            >
              <span className="unit-icon-pill">
                {isFullyBlocked ? <Lock size={18} className="text-slate-400" /> : getUnitIcon(index)}
              </span>
              <span className="link-text">{chapter.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
