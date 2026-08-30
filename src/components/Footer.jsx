import React from 'react';
import { Sparkles, Heart, BookOpen, Globe } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="border-t border-white/10 py-12 mt-16 bg-slate-950/60 backdrop-blur-md">
      <div className="app-container space-y-8">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl">
                🇫🇷
              </div>
              <div>
                <span className="font-bold text-lg text-white font-serif">French Immersion 9</span>
                <p className="text-xs text-slate-400">Le Portail d'Apprentissage Interactif</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Conçu pour accompagner les élèves en immersion française de 9e année dans le développement du vocabulaire, de la grammaire avancée, de la compréhension orale et écrite, et de la culture francophone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider">Modules d'Étude</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => setActiveTab && setActiveTab('vocab')} className="hover:text-blue-400 transition-colors">Vocabulaire & Cartes 3D</button></li>
              <li><button onClick={() => setActiveTab && setActiveTab('grammar')} className="hover:text-blue-400 transition-colors">Grammaire & Subjonctif</button></li>
              <li><button onClick={() => setActiveTab && setActiveTab('reading')} className="hover:text-blue-400 transition-colors">Lecture Interactive</button></li>
              <li><button onClick={() => setActiveTab && setActiveTab('listening')} className="hover:text-blue-400 transition-colors">Compréhension Orale</button></li>
            </ul>
          </div>

          {/* Program Alignment */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider">Normes & Alignement</h4>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-200">Niveau B1/B2 du CECRL</p>
              <p>Conforme aux exigences du curriculum d'immersion française du Canada.</p>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 French Immersion 9. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Créé avec passion pour la francophonie 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
