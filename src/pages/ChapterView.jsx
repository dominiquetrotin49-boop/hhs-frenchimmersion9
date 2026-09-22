import React, { useState, useEffect, useRef } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { chapters } from '../data/chapters';
import GrammarSection from '../components/sections/GrammarSection';
import VocabularySection from '../components/sections/VocabularySection';
import PracticeSection from '../components/sections/PracticeSection';
import GameSection from '../components/sections/GameSection';
import JeuxSection from '../components/sections/JeuxSection';
import AtelierSection from '../components/sections/AtelierSection';
import UnitAvatarSpeaker from '../components/UnitAvatarSpeaker';
import { UNIT_DOSSIER_CONFIG } from '../data/unitMetadata';
import { BookOpenCheck, Languages, Gamepad2, PenTool, Lock, Volume2, VolumeX } from 'lucide-react';

function ChapterView() {
  const { chapterId, section } = useParams();
  const navigate = useNavigate();
  const chapter = chapters.find(c => c.id === chapterId);
  const rawSection = section || (chapter?.isStoryUnit ? 'chapitre-1' : null);
  const activeSection = (rawSection === 'pratique' || rawSection === 'prononciation' || rawSection === 'orthographe') ? 'vocabulaire' : rawSection;

  
  const [isStoryAudioPlaying, setIsStoryAudioPlaying] = useState(false);
  const storyAudioRef = useRef(null);

  useEffect(() => {
    if (chapterId === 'horloge-boreale') {
      navigate('/roman', { replace: true });
    }
  }, [chapterId, navigate]);

  useEffect(() => {
    return () => {
      if (storyAudioRef.current) {
        storyAudioRef.current.pause();
        storyAudioRef.current = null;
      }
      setIsStoryAudioPlaying(false);
    };
  }, [activeSection, chapterId]);

  if (!chapter) {
    return (
      <div className="section-container text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Unité non trouvée !</h2>
        <p className="text-slate-600 mt-2">Veuillez sélectionner une unité disponible dans le menu de gauche.</p>
      </div>
    );
  }

  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const isBlocked = isProduction && (
    (chapterId !== 'unite-reprise' && chapterId !== 'unite-1' && chapterId !== 'horloge-boreale') ||
    (chapterId === 'horloge-boreale' && activeSection !== 'chapitre-1')
  );

  if (isBlocked) {
    return (
      <div className="blocked-view-container fade-in">
        <div className="blocked-card glass">
          <div className="blocked-icon-badge">
            <Lock size={48} />
          </div>
          <h2>Nous n'y sommes pas encore.</h2>
        </div>
      </div>
    );
  }

  const toggleStoryAudio = () => {
    if (!storyAudioRef.current) {
      storyAudioRef.current = new Audio('/audio/horloge-boreale/chapitre_1_complet.mp3');
      storyAudioRef.current.onended = () => {
        setIsStoryAudioPlaying(false);
      };
    }

    if (isStoryAudioPlaying) {
      storyAudioRef.current.pause();
      setIsStoryAudioPlaying(false);
    } else {
      storyAudioRef.current.play()
        .then(() => {
          setIsStoryAudioPlaying(true);
        })
        .catch(err => {
          console.error("Audio playback failed:", err);
        });
    }
  };

  const avatarTips = {
    'unite-reprise': {
      avatar: 'jasmine',
      name: 'Jasmine',
      text: 'Bienvenue dans l\'Unité Reprise de Rentrée ! Révise les prépositions et les verbes au présent avec les Mots Croisés !'
    },
    'unite-1': {
      avatar: 'jasmine',
      name: 'Jasmine',
      text: 'Dans cette unité sur les héros et anti-héros, n\'hésite pas à réviser le passé composé et l\'imparfait pour raconter des récits captivants !',
      audioUrl: '/audio/unite-1/jasmine_intro_unite1.wav'
    },
    'unite-2': {
      avatar: 'kader',
      name: 'Kader',
      text: 'La santé mentale et le bien-être sont essentiels ! Utilise le subjonctif et le conditionnel pour exprimer des conseils avec bienveillance.'
    },
    'unite-3': {
      avatar: 'jasmine',
      name: 'Jasmine',
      text: 'Exprime ton identité et ta culture ! Utilise les pronoms démonstratifs et les structures hypothétiques en "si".'
    },
    'unite-4': {
      avatar: 'kader',
      name: 'Kader',
      text: 'Protégeons notre planète ! Maîtrise les connecteurs logiques pour construire un essai argumentatif convaincant sur l\'environnement.'
    },
    'horloge-boreale': {
      avatar: 'jasmine',
      name: 'Jasmine',
      text: 'Bienvenue dans cette aventure mystérieuse et éco-citoyenne ! Suis le fil de l\'histoire à travers ses 5 chapitres pour percer le secret de l\'Horloge Boréale !'
    }
  };

  const currentTip = avatarTips[chapter.id] || avatarTips['unite-1'];

  const renderSection = () => {
    if (chapter.isStoryUnit) {
      const activeChapter = chapter.chapters.find(ch => ch.id === activeSection) || chapter.chapters[0];
      return (
        <div className="story-reader-wrapper fade-in">
          <div className="story-card glass-container">
            <h3 className="story-title">{activeChapter.title}</h3>
            {chapter.id === 'horloge-boreale' && activeChapter.id === 'chapitre-1' && (
              <div className="story-illustration-wrapper mb-6">
                <div 
                  className="story-illustration-container overflow-hidden rounded-2xl border border-slate-200 mx-auto"
                  style={{ width: '100%', maxWidth: '75%' }}
                >
                  <img 
                    src="/images/horloge-boreale/chapitre_1_illustration.jpg" 
                    alt="Illustration Ligne Claire du Chapitre 1" 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>
            )}
            {chapter.id === 'horloge-boreale' && activeChapter.id === 'chapitre-1' && (
              <div className="story-audio-row">
                <span className="story-audio-label">
                  <Volume2 size={20} className="story-audio-icon" />
                  Écoute le chapitre 1 (lu par un francophone)
                </span>
                <button 
                  onClick={toggleStoryAudio}
                  className="story-audio-btn"
                >
                  {isStoryAudioPlaying ? (
                    <>
                      <VolumeX size={16} /> Suspendre
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} /> Écouter
                    </>
                  )}
                </button>
              </div>
            )}
            <div className="story-divider" />
            <div className="story-text-content">
              {activeChapter.text.split('\n\n').map((para, pIdx) => {
                const trimmed = para.trim();
                if (!trimmed) return null;
                const isDialogue = trimmed.startsWith('—') || trimmed.startsWith('«') || trimmed.startsWith('-');
                return (
                  <p 
                    key={pIdx} 
                    className={`story-paragraph ${isDialogue ? 'dialogue-paragraph' : ''}`}
                  >
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // When no dossier is clicked yet, show only the 3 Dossiers at the top!
    if (!activeSection) {
      return (
        <div className="hub-welcome-prompt text-center py-8 px-4 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-md shadow-xs animate-fade-in">
          <p className="text-base sm:text-lg font-extrabold text-slate-800 m-0">
            👆 Sélectionnez un des 3 dossiers ci-dessus pour explorer le contenu de l'unité.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 mb-0">
            Dossier 01 (Lexique &amp; Écoute) • Dossier 02 (Studio &amp; Règles) • Dossier 03 (Atelier &amp; Jeux)
          </p>
        </div>
      );
    }

    // Universal 3-Dossier Hub Routing (Unité Reprise, Unité 1, 2, 3, 4)
    if (activeSection === 'atelier' || activeSection === 'exercices' || activeSection === 'jeux') {
      return <AtelierSection chapterId={chapter.id} vocabulary={chapter.vocabulary} />;
    }
    if (activeSection === 'grammaire' || activeSection === 'studio') {
      return <GrammarSection data={chapter.grammar} />;
    }
    if (activeSection === 'vocabulaire') {
      return <VocabularySection data={chapter.vocabulary} chapterId={chapter.id} />;
    }
    return null;

    switch(activeSection) {
      case 'vocabulaire':
      case 'pratique':
      case 'prononciation':
      case 'orthographe':
        return <VocabularySection data={chapter.vocabulary} chapterId={chapter.id} />;
      case 'grammaire':
        return <GrammarSection data={chapter.grammar} />;
      case 'exercices':
      case 'exercices-pratiques':
        return <PracticeSection practiceData={chapter.practice} />;
      case 'jeux':
        return <JeuxSection chapterId={chapter.id} vocabulary={chapter.vocabulary} />;
      default:
        return <VocabularySection data={chapter.vocabulary} chapterId={chapter.id} />;
    }
  };

  return (
    <div className="chapter-view">
      <div className="chapter-header">
        <h2>{chapter.title}</h2>
        <p>{chapter.description}</p>
      </div>

      <UnitAvatarSpeaker 
        avatar={currentTip.avatar}
        name={currentTip.name}
        text={currentTip.text}
        audioUrl={currentTip.audioUrl}
      />

      {chapter.isStoryUnit ? (
        <div className="section-navigation grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {chapter.chapters.map((ch, idx) => {
            const isActive = activeSection === ch.id;
            return (
              <NavLink 
                key={ch.id} 
                to={`/chapter/${chapter.id}/${ch.id}`} 
                className={`section-card ${isActive ? 'active' : ''}`}
              >
                <div className="tab-icon-badge story-badge bg-gradient-to-tr from-violet-600 to-indigo-700">
                  <span className="font-black text-white text-lg">{idx + 1}</span>
                </div>
                <h3>{ch.title.split(' : ')[0]}</h3>
              </NavLink>
            );
          })}
        </div>
      ) : (
        /* ── HUB MODULAIRE : LES 3 GRANDS DOSSIERS DE L'UNITÉ ── */
        <div className="section-navigation grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Dossier 1: Vocabulaire & Écoute */}
          <NavLink 
            to={`/chapter/${chapter.id}/vocabulaire`} 
            className={`section-card ${activeSection === 'vocabulaire' ? 'active' : ''}`}
          >
            <div className="tab-icon-badge vocab-badge">
              <Languages size={28} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 block mb-0.5">
                {UNIT_DOSSIER_CONFIG[chapter.id]?.dossier1.tag || 'Dossier 01'}
              </span>
              <h3 className="text-base sm:text-lg">
                {UNIT_DOSSIER_CONFIG[chapter.id]?.dossier1.title || 'Le Lexique'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {UNIT_DOSSIER_CONFIG[chapter.id]?.dossier1.subtitle || 'Écoute • Dictée • Cartes 3D'}
              </p>
            </div>
          </NavLink>

          {/* Dossier 2: Grammaire & Règles */}
          <NavLink 
            to={`/chapter/${chapter.id}/grammaire`} 
            className={`section-card ${activeSection === 'grammaire' || activeSection === 'studio' ? 'active' : ''}`}
          >
            <div className="tab-icon-badge grammar-badge">
              <BookOpenCheck size={28} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block mb-0.5">
                {UNIT_DOSSIER_CONFIG[chapter.id]?.dossier2.tag || 'Dossier 02'}
              </span>
              <h3 className="text-base sm:text-lg">
                {UNIT_DOSSIER_CONFIG[chapter.id]?.dossier2.title || 'Le Studio & Règles'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {UNIT_DOSSIER_CONFIG[chapter.id]?.dossier2.subtitle || 'Règles • Conjugaison • Exercices'}
              </p>
            </div>
          </NavLink>

          {/* Dossier 3: L'Atelier Créatif & Jeux */}
          <NavLink 
            to={`/chapter/${chapter.id}/atelier`} 
            className={`section-card ${activeSection === 'atelier' || activeSection === 'exercices' || activeSection === 'jeux' ? 'active' : ''}`}
          >
            <div className="tab-icon-badge practice-badge" style={{ background: 'rgba(124,58,237,0.15)', color: '#7c3aed' }}>
              <PenTool size={28} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 block mb-0.5">
                {UNIT_DOSSIER_CONFIG[chapter.id]?.dossier3.tag || 'Dossier 03'}
              </span>
              <h3 className="text-base sm:text-lg">
                {UNIT_DOSSIER_CONFIG[chapter.id]?.dossier3.title || 'L\'Atelier Créatif & Jeux'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {UNIT_DOSSIER_CONFIG[chapter.id]?.dossier3.subtitle || 'Écriture • Mots Croisés • Jeux'}
              </p>
            </div>
          </NavLink>
        </div>
      )}


      <div className="chapter-content">
        {renderSection()}
      </div>
    </div>
  );
}

export default ChapterView;
