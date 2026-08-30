import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  Flame, 
  Volume2, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Mic,
  Headphones,
  FileText,
  HelpCircle,
  Globe
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  streak, 
  xp, 
  theme, 
  toggleTheme, 
  openVoiceSettings 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'vocab', label: 'Vocabulaire', icon: BookOpen },
    { id: 'grammar', label: 'Grammaire', icon: Sparkles },
    { id: 'reading', label: 'Lecture', icon: FileText },
    { id: 'listening', label: 'Écoute', icon: Headphones },
    { id: 'speaking', label: 'Oral', icon: Mic },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'culture', label: 'Culture', icon: Globe },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-opacity-80 border-b border-white/10 transition-colors" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="app-container flex items-center justify-between h-20">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('vocab')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-rose-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            🇫🇷
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white font-serif">French Immersion</span>
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full uppercase tracking-wider">9</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Le Portail d'Apprentissage</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40' 
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Stats & Tools */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold" title="Série de jours d'étude">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{streak} jours</span>
          </div>

          {/* XP Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-bold" title="Points d'expérience XP">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>{xp} XP</span>
          </div>

          {/* Voice Settings */}
          <button
            onClick={openVoiceSettings}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            title="Paramètres de synthèse vocale"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            title="Changer de thème"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/5 text-slate-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl px-4 py-6 space-y-3">
          <div className="flex items-center justify-around pb-4 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{streak} Jours</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <Award className="w-4 h-4" />
              <span>{xp} XP</span>
            </div>
            <button
              onClick={() => { openVoiceSettings(); setMobileMenuOpen(false); }}
              className="flex items-center gap-1 text-slate-300 hover:text-white text-xs font-semibold"
            >
              <Volume2 className="w-4 h-4" /> Synthèse Vocale
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/5 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
