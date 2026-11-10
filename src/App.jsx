import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import WelcomeView from './pages/WelcomeView';
import ChapterView from './pages/ChapterView';
import NovelReader from './components/NovelReader';
import { GraduationCap, Sparkles, BookOpen } from 'lucide-react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-shell">
        {/* Global Sticky Translucent Glass Navigation Bar */}
        <header className="app-top-navbar sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/70">
          <div className="app-top-navbar-inner">
            <Link to="/" className="flex items-center gap-2.5" title="Accueil Français Immersion 9">
              <div className="brand-icon" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <span className="font-bold tracking-tight text-slate-900 text-sm block" style={{ lineHeight: 1.15 }}>
                  Français Immersion 9
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 block">
                  Portail Interactif • 9e Année
                </span>
              </div>
            </Link>

            {/* Clean Unit/Tab Switcher with Sliding Active Pill */}
            <nav className="top-nav-pill-group bg-slate-100 p-1 rounded-xl" aria-label="Navigation rapide des unités">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `top-nav-pill ${isActive ? 'active bg-white shadow-sm font-semibold text-indigo-600' : ''}`}
              >
                Accueil
              </NavLink>
              <NavLink
                to="/chapter/unite-reprise"
                className={({ isActive }) => `top-nav-pill ${isActive ? 'active bg-white shadow-sm font-semibold text-indigo-600' : ''}`}
              >
                La Rentrée
              </NavLink>
              <NavLink
                to="/chapter/unite-1"
                className={({ isActive }) => `top-nav-pill ${isActive ? 'active bg-white shadow-sm font-semibold text-indigo-600' : ''}`}
              >
                Unité 1 • Héros
              </NavLink>
              <NavLink
                to="/chapter/unite-2"
                className={({ isActive }) => `top-nav-pill ${isActive ? 'active bg-white shadow-sm font-semibold text-indigo-600' : ''}`}
              >
                Unité 2 • Bien-Être
              </NavLink>
              <NavLink
                to="/roman"
                className={({ isActive }) => `top-nav-pill ${isActive ? 'active bg-white shadow-sm font-semibold text-indigo-600' : ''}`}
              >
                <BookOpen size={14} /> Roman
              </NavLink>
            </nav>

            {/* Quick-access Progress & Status Indicator */}
            <div className="top-nav-status">
              <div className="top-status-chip">
                <span className="top-status-dot" />
                <Sparkles size={13} />
                <span>3 Unités Actives</span>
              </div>
            </div>
          </div>
        </header>

        <div className="app-layout">
          {/* Left Sidebar Unit Navigation */}
          <Sidebar />

          {/* Right Main Content View */}
          <main className="app-main-content">
            <Routes>
              <Route path="/" element={<WelcomeView />} />
              <Route path="/chapter/:chapterId" element={<ChapterView />} />
              <Route path="/chapter/:chapterId/:section" element={<ChapterView />} />
              <Route path="/roman" element={<NovelReader />} />
            </Routes>

            {/* Footer at the bottom of the page */}
            <footer className="app-footer">
              <p>© 2026 Français immersion 9 • Le Portail d'Apprentissage Interactif</p>
            </footer>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
