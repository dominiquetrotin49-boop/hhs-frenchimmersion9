import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import WelcomeView from './pages/WelcomeView';
import ChapterView from './pages/ChapterView';
import NovelReader from './components/NovelReader';
import './App.css';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
