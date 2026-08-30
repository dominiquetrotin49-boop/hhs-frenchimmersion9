import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Heart, Trophy, RotateCcw, Play, ChevronRight, CheckCircle2, XCircle, Award, Compass, MessageSquare, UserCheck, Smile, Frown, Compass as CompassIcon, Radio } from 'lucide-react';
import './StoryRPGFirstDay.css';

export default function StoryRPGFirstDay() {
  // Story Scenes Master Database (Interactive Visual Novel RPG Narrative)
  const masterStoryBank = [
    {
      id: 1,
      chapterTitle: "Chapitre 1 : Devant le Collège",
      characterName: "Jasmine",
      characterAvatar: "/images/avatars/avatar_jasmine.jpg",
      narrativeText: "C'est le matin de la rentrée ! Tu arrives devant le collège d'immersion avec ton sac à dos. Tu croises ta meilleure amie Jasmine qui te fait un grand signe de la main. Tu t'approches d'elle pour la saluer :",
      promptQuestion: "Comment la salues-tu correctement en français ?",
      choices: [
        {
          id: 'A',
          text: "« Salut Jasmine ! Je suis vraiment content de te voir après cet été ! »",
          isCorrect: true,
          grammarTip: "💡 Parfait ! On dit « content de + infinitif » (content de te voir) !",
          impactText: "Jasmine te fait un grand sourire radieux et t'enlace amicalement !"
        },
        {
          id: 'B',
          text: "« Salut Jasmine ! Je suis vraiment content à te voir après cet été ! »",
          isCorrect: false,
          grammarTip: "💡 Oups ! Après l'adjectif « content », la préposition correcte est « de » !",
          impactText: "Jasmine hausse un sourcil avec un petit rire : « Content *de* me voir, tu veux dire ! »"
        }
      ]
    },
    {
      id: 2,
      chapterTitle: "Chapitre 2 : Les Casiers & La Direction",
      characterName: "Kader",
      characterAvatar: "/images/avatars/avatar_kader.jpg",
      narrativeText: "Dans le grand couloir, tu cherches ton nouveau casier. Ton camarade Kader passe avec une grande pile de cahiers de français. Tu veux lui demander où se trouve la salle 204 :",
      promptQuestion: "Quelle formule grammaticale choisis-tu ?",
      choices: [
        {
          id: 'A',
          text: "« Excuse-moi Kader, est-ce que tu sais où se trouve la salle de français ? »",
          isCorrect: true,
          grammarTip: "💡 Bravo ! « Se trouve » (verbe pronominal au présent) est parfait !",
          impactText: "Kader te montre la porte juste au bout du couloir avec bienveillance !"
        },
        {
          id: 'B',
          text: "« Excuse-moi Kader, est-ce que tu savoir où se trouve la salle de français ? »",
          isCorrect: false,
          grammarTip: "💡 Attention ! Le verbe doit être conjugué au présent : « tu sais » !",
          impactText: "Kader rigole : « Tu veux dire si je *sais* ? Oui, c'est la porte juste là ! »"
        }
      ]
    },
    {
      id: 3,
      chapterTitle: "Chapitre 3 : En Classe de Français",
      characterName: "Madame Dubois (Professeure)",
      characterAvatar: "/images/avatars/avatar_maya.jpg",
      narrativeText: "La sonnerie retentit ! Toute la classe prend place. La professeure de français demande à chacun de se présenter et d'expliquer ce qu'il a fait cet été. C'est ton tour d'exprimer ton expérience :",
      promptQuestion: "Comment t'exprimes-tu avec assurance ?",
      choices: [
        {
          id: 'A',
          text: "« Cet été, je suis parti en France avec ma famille et nous avons visité Paris ! »",
          isCorrect: true,
          grammarTip: "💡 Félicitations ! « En France » (préposition devant pays féminin) et passé composé impeccable !",
          impactText: "Toute la classe applaudit et la professeure inscrit 10 points de participation pour toi !"
        },
        {
          id: 'B',
          text: "« Cet été, je suis parti à la France avec ma famille et nous avons visité Paris ! »",
          isCorrect: false,
          grammarTip: "💡 Oups ! Pour les pays féminins (la France), on utilise la préposition « en » !",
          impactText: "La professeure te félicite pour l'enthousiasme tout en rappelant la règle de la préposition « en » !"
        }
      ]
    },
    {
      id: 4,
      chapterTitle: "Chapitre 4 : La Pause Méridienne à la Cafétéria",
      characterName: "Maya",
      characterAvatar: "/images/avatars/avatar_maya.jpg",
      narrativeText: "À midi, la cafétéria est animée ! Tu t'assieds à la table des élèves d'immersion avec Maya et Léo. Maya te propose de partager un dessert savoureux. Tu réponds :",
      promptQuestion: "Quelle phrase choisis-tu pour répondre avec politesse ?",
      choices: [
        {
          id: 'A',
          text: "« Merci beaucoup Maya ! Je prends volontiers une part de gâteau au chocolat ! »",
          isCorrect: true,
          grammarTip: "💡 Excellent ! « Je prends » (présent du verbe prendre) et « au chocolat » sont parfaitement employés !",
          impactText: "Maya te sert une belle part de gâteau et tout le groupe rigole ensemble !"
        },
        {
          id: 'B',
          text: "« Merci beaucoup Maya ! Je prendre volontiers une part de gâteau à chocolat ! »",
          isCorrect: false,
          grammarTip: "💡 Attention ! Le verbe prendre se conjugue « je prends » et on dit « au chocolat » !",
          impactText: "Maya te donne la part en souriant : « D'accord, prenons ce gâteau au chocolat ! »"
        }
      ]
    },
    {
      id: 5,
      chapterTitle: "Chapitre 5 : Le Club d'Immersion de Fin de Journée",
      characterName: "Léo",
      characterAvatar: "/images/avatars/avatar_leo.jpg",
      narrativeText: "À la fin de la journée, le club d'immersion se réunit au gymnase pour célébrer cette première journée réussie. Léo t'invite à rejoindre le bureau des délégués. Tu conclus la journée en beauté :",
      promptQuestion: "Quelle conclusion formule-tu pour clore cette aventure ?",
      choices: [
        {
          id: 'A',
          text: "« C'était une première journée formidable ! Je suis prêt à surmonter tous les défis ! »",
          isCorrect: true,
          grammarTip: "💡 Règle d'or : « Prêt à + infinitif » et conjugaison de « être » au présent parfaitement maîtrisées !",
          impactText: "Léo te donne la médaille d'honneur de la Rentrée sous les acclamations du collège !"
        },
        {
          id: 'B',
          text: "« C'était une première journée formidable ! Je suis prêt de surmonter tous les défis ! »",
          isCorrect: false,
          grammarTip: "💡 Oups ! Avec l'adjectif « prêt », on utilise la préposition « à » (prêt à surmonter) !",
          impactText: "Léo t'encourage chaleureusement tout en te rappelant la nuance entre « prêt à » et « content de » !"
        }
      ]
    }
  ];

  // Game State
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [gameState, setGameState] = useState('intro'); // 'intro', 'narrative', 'feedback', 'ending'
  const [selectedChoice, setSelectedChoice] = useState(null);

  // Web Audio Synthesizer
  const playStorySfx = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'page-flip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success-dialogue') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  const handleStartStory = () => {
    setCurrentSceneIdx(0);
    setPlayerScore(0);
    setCorrectAnswersCount(0);
    setSelectedChoice(null);
    setGameState('narrative');
    playStorySfx('page-flip');
  };

  const handleSelectChoice = (choice) => {
    if (gameState !== 'narrative') return;

    setSelectedChoice(choice);
    if (choice.isCorrect) {
      setPlayerScore((prev) => prev + 200);
      setCorrectAnswersCount((prev) => prev + 1);
      playStorySfx('success-dialogue');
    } else {
      setPlayerScore((prev) => prev + 50);
    }

    setGameState('feedback');
  };

  const handleNextScene = () => {
    setSelectedChoice(null);
    if (currentSceneIdx + 1 < masterStoryBank.length) {
      setCurrentSceneIdx((prev) => prev + 1);
      setGameState('narrative');
      playStorySfx('page-flip');
    } else {
      setGameState('ending');
    }
  };

  const currentScene = masterStoryBank[currentSceneIdx];

  // Ending Determination Logic
  const getEndingType = () => {
    if (correctAnswersCount === 5) {
      return {
        badge: "👑 Ending A : Légende de la Rentrée",
        title: "Le Héros Incontesté de l'Immersion !",
        desc: "Parfait ! Vous avez réussi un parcours sans faute avec 100% d'exactitude grammaticale. Jasmine, Kader, Maya et Léo vous nomment Ambassadeur Officiel du Collège !",
        color: "text-amber-700 bg-amber-50 border-amber-300"
      };
    } else if (correctAnswersCount >= 3) {
      return {
        badge: "🎭 Ending B : L'Aventurier Enthousiaste",
        title: "Une Rentrée Remplie de Rires et de Succès !",
        desc: "Très bien joué ! Grâce à votre présence d'esprit et votre enthousiasme, vous avez noué de superbes amitiés et maîtrisé l'essentiel de la langue !",
        color: "text-indigo-700 bg-indigo-50 border-indigo-300"
      };
    } else {
      return {
        badge: "🤪 Ending C : Le Malentendu Comique",
        title: "Une Journée d'Aventures Hilarantes !",
        desc: "Vos petits mix-ups grammaticaux ont créé des situations très drôles dans tout le collège ! Tout le monde a adoré votre humour et votre énergie !",
        color: "text-purple-700 bg-purple-50 border-purple-300"
      };
    }
  };

  return (
    <div className="story-rpg-container fade-in">
      
      {/* ARENA HEADER BAR */}
      <div className="srpg-arena-header">
        <div className="flex items-center gap-3">
          <div className="srpg-arena-badge">
            <BookOpen size={24} className="text-amber-900" />
          </div>
          <div>
            <h2 className="srpg-arena-title">
              L'Aventure de la Première Journée (Visual Novel RPG)
            </h2>
            <p className="srpg-arena-sub">
              Récit interactif à choix multiples • Révision intégrée du français de 9e année
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="srpg-stat-pill text-amber-700">
            <Trophy size={16} className="text-amber-600" />
            <span>Score :</span>
            <strong className="font-black text-amber-900">{playerScore} pts</strong>
          </div>
          <div className="srpg-stat-pill text-indigo-700">
            <UserCheck size={16} className="text-indigo-600" />
            <span>Précision :</span>
            <strong className="font-black text-indigo-900">{correctAnswersCount} / {masterStoryBank.length}</strong>
          </div>
        </div>
      </div>

      {/* STAGE 1: INTRO MENU */}
      {gameState === 'intro' && (
        <div className="srpg-intro-card fade-in text-center">
          <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-amber-400 text-amber-700 shadow-sm">
            <BookOpen size={32} />
          </div>

          <h3 className="font-black text-2xl text-amber-950 mb-2">
            Vivez le Premier Jour au Collège d'Immersion !
          </h3>
          <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed font-medium mb-6">
            Incarnez un élève de 9e année lors de sa première journée de classe. Vos choix de phrases détermineront vos réactions avec <strong>Jasmine</strong>, <strong>Kader</strong>, <strong>Maya</strong> et <strong>Léo</strong> ainsi que la fin de votre histoire !
          </p>

          <button
            type="button"
            onClick={handleStartStory}
            className="srpg-start-btn text-sm font-black uppercase tracking-wider"
          >
            <Play size={20} /> Commencer l'Aventure de Rentrée !
          </button>
        </div>
      )}

      {/* STAGE 2: INTERACTIVE NARRATIVE SCENE */}
      {(gameState === 'narrative' || gameState === 'feedback') && (
        <div className="srpg-scene-stage fade-in relative">
          
          {/* ELEGANT CHARACTER WATERMARK BACKGROUND OVERLAY */}
          <div className="srpg-character-watermark-bg">
            <img src={currentScene.characterAvatar} alt="" className="srpg-watermark-img" />
          </div>

          {/* SCENE CHAPTER BANNER */}
          <div className="srpg-chapter-banner flex items-center justify-between px-4 py-2 bg-amber-950/80 text-amber-100 rounded-xl border-2 border-amber-400 mb-3 text-xs font-black">
            <span>{currentScene.chapterTitle}</span>
            <span>Interlocuteur : {currentScene.characterName}</span>
          </div>

          {/* VISUAL NOVEL DIALOGUE BOX */}
          <div className="srpg-dialogue-box mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400 shadow-xs">
                <img src={currentScene.characterAvatar} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-amber-950 text-sm">{currentScene.characterName}</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {currentScene.narrativeText}
            </p>
          </div>

          {/* PROMPT QUESTION & CHOICES */}
          <div className="srpg-question-card">
            <span className="srpg-question-tag">
              ❓ {currentScene.promptQuestion}
            </span>

            {gameState === 'narrative' ? (
              <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto mt-3">
                {currentScene.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleSelectChoice(choice)}
                    className="srpg-choice-btn text-xs font-extrabold text-slate-900 text-left p-3.5 rounded-xl border-2 border-slate-300 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center gap-3"
                  >
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0">
                      {choice.id}
                    </span>
                    <span>{choice.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`srpg-feedback-box ${selectedChoice.isCorrect ? 'correct' : 'wrong'} fade-in text-center mt-3 p-4 rounded-xl border-2`}>
                <p className="font-black text-sm mb-1">
                  {selectedChoice.isCorrect ? "✨ EXCELLENTE RÉPONSE !" : "💡 PETIT AJUSTEMENT GRAMMATICAL !"}
                </p>
                <p className="text-xs font-bold mb-2">{selectedChoice.grammarTip}</p>
                <p className="text-xs italic text-slate-700 mb-4">« {selectedChoice.impactText} »</p>

                <button
                  type="button"
                  onClick={handleNextScene}
                  className="srpg-next-btn text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
                >
                  Continuer l'Aventure <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* STAGE 3: BRANCHING ENDINGS SCREEN */}
      {gameState === 'ending' && (
        <div className="srpg-result-card fade-in text-center">
          {(() => {
            const ending = getEndingType();
            return (
              <>
                <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl border-2 border-amber-300">
                  <Trophy size={36} />
                </div>

                <span className="srpg-ending-badge font-black text-xs uppercase px-3 py-1 rounded-full mb-2 inline-block border">
                  {ending.badge}
                </span>

                <h3 className="font-black text-2xl text-amber-950 mb-2 mt-1">
                  {ending.title}
                </h3>
                <p className="text-xs text-slate-700 max-w-lg mx-auto mb-6 leading-relaxed font-medium">
                  {ending.desc}
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartStory}
                    className="srpg-start-btn text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <RotateCcw size={16} /> Recommencer le Récit
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

    </div>
  );
}
