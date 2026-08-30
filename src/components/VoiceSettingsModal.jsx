import React, { useState, useEffect } from 'react';
import { Volume2, X, Check, Sliders } from 'lucide-react';
import { getFrenchVoices, speakFrench } from '../utils/speechUtils';

export default function VoiceSettingsModal({ isOpen, onClose }) {
  const [voices, setVoices] = useState([]);
  const [selectedLang, setSelectedLang] = useState('fr-CA');
  const [speechRate, setSpeechRate] = useState(0.9);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('fi9_voice_lang') || 'fr-CA';
      const storedRate = localStorage.getItem('fi9_voice_rate') || '0.9';
      setSelectedLang(storedLang);
      setSpeechRate(parseFloat(storedRate));

      const loadVoices = () => {
        setVoices(getFrenchVoices());
      };
      loadVoices();

      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('fi9_voice_lang', selectedLang);
    localStorage.setItem('fi9_voice_rate', speechRate.toString());
    speakFrench("Paramètres de voix sauvegardés avec succès !");
    onClose();
  };

  const handleTestVoice = () => {
    speakFrench("Bonjour ! Ceci est un test de la voix de synthèse en français.", {
      lang: selectedLang,
      rate: speechRate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel p-6 space-y-6 relative border-t-4 border-t-blue-500 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-lg font-serif">Paramètres de Voix</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase font-bold text-slate-400 block mb-2">Accent Francophone</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedLang('fr-CA')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedLang === 'fr-CA'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                🇨🇦 Français Canadien (fr-CA)
              </button>
              <button
                onClick={() => setSelectedLang('fr-FR')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedLang === 'fr-FR'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                🇫🇷 Français Européen (fr-FR)
              </button>
            </div>
          </div>

          {/* Speech Rate Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>Vitesse d'élocution</span>
              <span className="text-blue-400">{speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.3"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.6x (Lent)</span>
              <span>1.0x (Normal)</span>
              <span>1.3x (Rapide)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleTestVoice}
            className="btn btn-secondary text-xs flex-1"
          >
            <Volume2 className="w-4 h-4" />
            <span>Tester la voix</span>
          </button>
          
          <button
            onClick={handleSave}
            className="btn btn-primary text-xs flex-1"
          >
            <Check className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>

      </div>
    </div>
  );
}
