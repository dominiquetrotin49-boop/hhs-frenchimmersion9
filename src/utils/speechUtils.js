/**
 * Audio & Web Speech API Utilities for French Immersion 9
 */

let currentAudio = null;

export const getFrenchVoices = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(v => v.lang.startsWith('fr'));
};

export const speakFrench = (text, options = {}) => {
  if (typeof window === 'undefined') return;

  // Stop any currently playing audio or speech
  stopSpeech();

  // If a custom recorded audio file path is provided, play it
  if (options.audioUrl) {
    try {
      const audio = new Audio(options.audioUrl);
      currentAudio = audio;
      audio.play().catch(() => {
        // Fallback to SpeechSynthesis if audio playback is blocked or file fails
        playSpeechSynthesisFallback(text, options);
      });
      return;
    } catch (e) {
      console.warn('Audio playback error, falling back to TTS:', e);
    }
  }

  playSpeechSynthesisFallback(text, options);
};

const playSpeechSynthesisFallback = (text, options = {}) => {
  if (!('speechSynthesis' in window) || !text) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const preferredLang = options.lang || localStorage.getItem('fi9_voice_lang') || 'fr-CA';
  const preferredRate = parseFloat(options.rate || localStorage.getItem('fi9_voice_rate') || '0.9');

  utterance.lang = preferredLang;
  utterance.rate = preferredRate;
  utterance.pitch = 1.0;

  const voices = getFrenchVoices();
  const selectedVoice = voices.find(v => v.lang === preferredLang) || voices[0];
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined') {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }
};
