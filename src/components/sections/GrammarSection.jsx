import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Smartphone, Flame, Gamepad2, Music, Film, MessageCircle, Sparkles, 
  Heart, Send, TrendingUp, Headphones, Share2, Compass, Tv, 
  ChevronDown, ChevronUp, CheckCircle2, HelpCircle, BookOpenCheck, Zap 
} from 'lucide-react';
import './GrammarSection.css';
import './VocabularySection.css';

export const LE_PASSE_GRAMMAR_DOSSIERS = [
  {
    id: 'imparfait',
    title: "1. L'Imparfait (Le Passé Continu)",
    subtitle: "🎬 Le Décor Cinéma & 🔄 La Machine à Habitudes",
    themeColor: "from-sky-500 to-indigo-600",
    badge: "Le Temps du Décor",
    piliers: [
      { icon: "🎬", title: "1. Le Décor (Atmosphère)", desc: "Il faisait beau, les oiseaux chantaient et il y avait une brise légère." },
      { icon: "🔄", title: "2. La Routine (Habitude)", desc: "Tous les matins, je buvais un chocochino avant le collège." },
      { icon: "⏳", title: "3. L'Action En Cours", desc: "Pendant que je lisais mon roman préfèré..." }
    ],
    formula: "Sujet + Radical [Nous au présent - ons] + Terminaison (-ais, -ais, -ait, -ions, -iez, -aient)",
    trivia: {
      question: "Quand j'étais petit, je _______ aux jeux vidéo tous les soirs.",
      options: ["jouais", "ai joué"],
      correct: "jouais",
      explanation: "Parfait ! C'est une habitude répétée dans le passé (La Routine), donc on utilise l'Imparfait !"
    },
    conjugation: {
      title: "⚡ Simulateur de Conjugaison (L'Imparfait)",
      stems: [
        { verb: "Aimer (-ER)", stem: "aim-", endings: ["ais", "ais", "ait", "ions", "iez", "aient"] },
        { verb: "Finir (-IR)", stem: "finiss-", endings: ["ais", "ais", "ait", "ions", "iez", "aient"] },
        { verb: "Mettre (-RE)", stem: "mett-", endings: ["ais", "ais", "ait", "ions", "iez", "aient"] }
      ]
    }
  },
  {
    id: 'pc_avoir',
    title: "2. Le Passé Composé avec AVOIR",
    subtitle: "💥 L'Action Flash & 🔑 Le Participe Passé (~90%)",
    themeColor: "from-amber-500 to-orange-600",
    badge: "Action Ponctuelle",
    piliers: [
      { icon: "🎯", title: "1. Action Complétée", desc: "Hier soir, j'ai fini mon devoir de français à 20h pile." },
      { icon: "⚡", title: "2. Événement Soudain", desc: "Soudain, mon téléphone a sonné !" },
      { icon: "🚫", title: "3. Règle d'Or (Pas d'accord)", desc: "Avec AVOIR, le participe passé NE S'ACCORDE PAS avec le sujet (Elle a mangé)." }
    ],
    formula: "[Sujet] + [AVOIR au présent] + [Participe Passé (-é, -i, -u)]",
    irregularsVault: [
      { inf: "Boire", pp: "bu" },
      { inf: "Faire", pp: "fait" },
      { inf: "Lire", pp: "lu" },
      { inf: "Écrire", pp: "écrit" },
      { inf: "Prendre", pp: "pris" },
      { inf: "Voir", pp: "vu" },
      { inf: "Dire", pp: "dit" },
      { inf: "Avoir", pp: "eu" }
    ],
    trivia: {
      question: "Hier, Marie et Sarah _______ un excellent film au cinéma.",
      options: ["ont regardé", "sont regardées"],
      correct: "ont regardé",
      explanation: "Bravo ! Avec l'auxiliaire AVOIR, aucun accord avec le sujet Marie & Sarah !"
    }
  },
  {
    id: 'pc_etre',
    title: "3. Le Passé Composé avec ÊTRE",
    subtitle: "🏰 Le Château DR & MRS VANDERTRAMP & 🎀 L'Accordeur",
    themeColor: "from-emerald-500 to-teal-700",
    badge: "Mouvement & Pronominaux",
    vandertramp: [
      "Devenir", "Revenir", "Monter", "Rester", "Sortir", "Venir", "Aller", "Naître", 
      "Devenir", "Entrer", "Rentrer", "Tomber", "Retourner", "Arriver", "Mourir", "Partir", "Passer"
    ],
    accordDemo: [
      { subject: "Il (Masculin singulier)", verb: "est parti", tag: "Standard" },
      { subject: "Elle (Féminin singulier)", verb: "est partie", tag: "+e obligatoire" },
      { subject: "Ils (Masculin pluriel)", verb: "sont partis", tag: "+s obligatoire" },
      { subject: "Elles (Féminin pluriel)", verb: "sont parties", tag: "+es obligatoire" }
    ],
    trivia: {
      question: "Camille (une fille) _______ tard hier soir.",
      options: ["est arrivée", "est arrivé"],
      correct: "est arrivée",
      explanation: "Super ! Avec ÊTRE, l'accord en genre (+e pour féminin) est 100% OBLIGATOIRE !"
    }
  },
  {
    id: 'combinaison',
    title: "4. La Combinaison : Imparfait vs Passé Composé",
    subtitle: "🍿 Le Scenario Netflix : Le Décor vs Le Flash Action",
    themeColor: "from-purple-600 to-pink-600",
    badge: "Master Récit",
    storyTimeline: [
      { type: "DECOR (Imparfait)", text: "🌄 Il faisait beau et le soleil brillait dans le ciel...", color: "bg-sky-50 border-sky-300 text-sky-950" },
      { type: "ACTION EN COURS (Imparfait)", text: "🚶‍♂️ Nous marchions tranquillement vers la plage...", color: "bg-indigo-50 border-indigo-300 text-indigo-950" },
      { type: "FLASH SOUDAIN (Passé Composé)", text: "⚡ SOUDAIN, un éclair a frappé l'océan !", color: "bg-amber-100 border-amber-400 text-amber-950 font-black" },
      { type: "FIN DE L'ACTION (Passé Composé)", text: "🏃‍♀️ Nous sommes tous rentrés en courant à la maison.", color: "bg-emerald-50 border-emerald-300 text-emerald-950" }
    ],
    trivia: {
      question: "Pendant que je (dormir) _______, le réveil (sonner) _______.",
      options: ["dormais / a sonné", "ai dormi / sonnait"],
      correct: "dormais / a sonné",
      explanation: "Exact ! Dormir est l'action continue en arrière-plan (Imparfait), le réveil est l'interruption soudaine (Passé Composé) !"
    }
  },
  {
    id: 'connecteurs',
    title: "5. Les Connecteurs Logiques",
    subtitle: "🧩 La Boîte à Outils du Rédacteur Électrisant",
    themeColor: "from-cyan-500 to-blue-700",
    badge: "Structure & Style",
    categories: [
      { title: "🚀 1. L'Introduction", words: ["D'abord", "Tout d'abord", "Premièrement", "En premier lieu"] },
      { title: "➕ 2. L'Ajout", words: ["De plus", "En outre", "Également", "Par ailleurs"] },
      { title: "⚡ 3. L'Opposition", words: ["Cependant", "Néanmoins", "En revanche", "Toutefois"] },
      { title: "🎯 4. La Conséquence", words: ["Par conséquent", "Donc", "C'est pourquoi", "Ainsi"] },
      { title: "🏆 5. La Conclusion", words: ["En conclusion", "Pour conclure", "Finalement", "Enfin"] }
    ],
    trivia: {
      question: "Il a révisé toute la nuit. _______, il a réussi son examen avec brio !",
      options: ["Par conséquent", "Cependant"],
      correct: "Par conséquent",
      explanation: "Absolument ! 'Par conséquent' exprime la conséquence logique du travail accompli !"
    }
  },
  {
    id: 'reflechis',
    title: "6. Les Verbes Réfléchis et Réciproques",
    subtitle: "🪞 Le Miroir Magique (Présent)",
    themeColor: "from-rose-500 to-red-600",
    badge: "Action sur soi & Mutuelle",
    miroir: [
      { mode: "🪞 Action Réfléchie (Sur soi-même)", example: "Je me passionne pour le cinéma français. (Action faite sur soi)" },
      { mode: "🤝 Action Réciproque (Entre personnes)", example: "Ils se rencontrent tous les samedis au vernissage. (Action mutuelle)" }
    ],
    conjugatorWheel: [
      { pronoun: "Je", reflex: "me", verb: "passionne" },
      { pronoun: "Tu", reflex: "te", verb: "passionnes" },
      { pronoun: "Il / Elle", reflex: "se", verb: "passionne" },
      { pronoun: "Nous", reflex: "nous", verb: "passionnons" },
      { pronoun: "Vous", reflex: "vous", verb: "passionnez" },
      { pronoun: "Ils / Elles", reflex: "se", verb: "passionnent" }
    ],
    trivia: {
      question: "Chaque matin, nous _______ à 7 heures.",
      options: ["nous réveillons", "réveillons"],
      correct: "nous réveillons",
      explanation: "Génial ! Verbe pronominal (se réveiller) -> Nous exige le pronom réfléchi NOUS !"
    }
  }
];

export const REPRISE_GRAMMAR_DOSSIERS = [
  {
    id: 'prep_destination',
    title: "Les Prépositions de Lieu & Destination",
    subtitle: "#OùJeVais — à, en, chez, dans",
    themeColor: "from-sky-500 to-indigo-600",
    badge: "🗺️",
    piliers: [
      { icon: "✈️", title: "à / au / aux", desc: "Devant les villes (à Paris, à Montréal) et les pays masculins (au Canada, aux États-Unis)." },
      { icon: "🌎", title: "en", desc: "Devant les pays féminins (en France, en Italie) ou commençant par une voyelle (en Iran)." },
      { icon: "🏠", title: "chez", desc: "Pour désigner une personne ou son domicile (chez le médecin, chez moi, chez Beyoncé 😏)." },
      { icon: "📱", title: "dans", desc: "À l'intérieur d'un espace (dans la classe, dans mon sac, dans mon feed TikTok)." }
    ],
    formula: "à + ville | au + pays masc. | aux + pays plur. | en + pays fém. | chez + personne | dans + espace",
    trivia: {
      question: "Cet été, je vais voyager _______ France et visiter ma tante _______ elle.",
      options: ["en / chez", "à la / à"],
      correct: "en / chez",
      explanation: "Excellent ! La France est un pays féminin → 'en France', et on dit 'chez elle' pour désigner la personne."
    }
  },
  {
    id: 'prep_position',
    title: "Les Prépositions de Position",
    subtitle: "#SpotTheDiff — devant, sur, sous, entre",
    themeColor: "from-emerald-500 to-teal-700",
    badge: "📍",
    piliers: [
      { icon: "⬆️", title: "sur / sous", desc: "Sur = la surface (sur mon bureau). Sous = en dessous (sous mon lit, là où je cache mes snacks 🍫)." },
      { icon: "👀", title: "devant / derrière", desc: "Devant = face avant (devant le tableau). Derrière = face arrière (derrière la scène)." },
      { icon: "🎯", title: "entre", desc: "Au milieu de deux choses (entre la porte et la fenêtre, entre deux cours)." },
      { icon: "📌", title: "au (à + le)", desc: "Contraction pour un lieu masculin (au cinéma, au gymnase, au Tim Hortons)." }
    ],
    formula: "sur (on) | sous (under) | devant (in front of) | entre (between) | au (at the)",
    trivia: {
      question: "Le stylo est tombé _______ le bureau, juste _______ le livre et la trousse.",
      options: ["sous / entre", "sur / chez"],
      correct: "sous / entre",
      explanation: "Parfait ! Le stylo est tombé 'sous' le bureau et 'entre' deux objets."
    }
  },
  {
    id: 'prep_relation',
    title: "Les Prépositions de Relation & Moyen",
    subtitle: "#HowWeRoll — de, par, pour, avec, sans",
    themeColor: "from-amber-500 to-orange-600",
    badge: "🔗",
    piliers: [
      { icon: "🎤", title: "de / d'", desc: "Provenance ou appartenance (venir de Lyon, le playlist de Sami, le cours d'anglais)." },
      { icon: "🤝", title: "avec / sans", desc: "Avec = compagnie/moyen (avec plaisir, avec mes AirPods). Sans = absence (sans faute, sans WiFi 😱)." },
      { icon: "🚀", title: "par / pour", desc: "Par = moyen/auteur (par texto, par avion). Pour = but (pour réussir, pour le fun)." }
    ],
    formula: "de (of/from) | avec (with) | sans (without) | par (by) | pour (for)",
    trivia: {
      question: "J'ai préparé ce projet _______ beaucoup d'efforts _______ mon cours de français.",
      options: ["avec / pour", "sans / par"],
      correct: "avec / pour",
      explanation: "Bravo ! On fait un travail 'avec' effort 'pour' un cours (but/objectif)."
    }
  },
  {
    id: 'verbes_aux',
    title: "Être & Avoir — Les Boss du Présent",
    subtitle: "#MainCharacterEnergy — les auxiliaires",
    themeColor: "from-rose-500 to-red-600",
    badge: "🔥",
    piliers: [
      { icon: "🪞", title: "Être (to be)", desc: "Je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont. → État, identité, nationalité." },
      { icon: "🎒", title: "Avoir (to have)", desc: "J'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont. → Possession, âge, sensations." }
    ],
    formula: "Être → identité & état ('je suis prêt') | Avoir → possession & âge ('j'ai 14 ans')",
    trivia: {
      question: "Nous _______ en retard parce que vous _______ perdu les clés !",
      options: ["sommes / avez", "avons / êtes"],
      correct: "sommes / avez",
      explanation: "Génial ! 'Nous sommes en retard' (être) et 'vous avez perdu' (avoir)."
    }
  },
  {
    id: 'verbes_action',
    title: "Aller, Faire, Venir & Prendre",
    subtitle: "#OnTheMove — les verbes d'action",
    themeColor: "from-purple-600 to-pink-600",
    badge: "🛹",
    piliers: [
      { icon: "🚶", title: "Aller / Venir", desc: "Aller : je vais, tu vas, il va, nous allons, vous allez, ils vont.\nVenir : je viens, tu viens, il vient, nous venons, vous venez, ils viennent." },
      { icon: "🎬", title: "Faire", desc: "Je fais, tu fais, il fait, nous faisons, vous faites, ils font. → Activités, sport, devoirs." },
      { icon: "☕", title: "Prendre", desc: "Je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent. → Saisir, consommer." }
    ],
    formula: "Piège : 'vous faites' (pas faisez !) · 'ils font' · 'ils viennent' · 'ils prennent'",
    trivia: {
      question: "Ils _______ du vélo pendant que nous _______ le train.",
      options: ["font / prenons", "font / prenez"],
      correct: "font / prenons",
      explanation: "Super ! 'Ils font' (faire) et 'nous prenons' (prendre)."
    }
  },
  {
    id: 'verbes_modal',
    title: "Pouvoir, Vouloir, Devoir & Savoir",
    subtitle: "#CanIOrCantI — les verbes modaux",
    themeColor: "from-cyan-500 to-blue-700",
    badge: "🧠",
    piliers: [
      { icon: "💪", title: "Pouvoir / Vouloir", desc: "Pouvoir : je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent.\nVouloir : je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent.\n➔ Capacité & désir." },
      { icon: "📋", title: "Devoir", desc: "Je dois, tu dois, il doit, nous devons, vous devez, ils doivent. → Obligation." },
      { icon: "💡", title: "Savoir", desc: "Je sais, tu sais, il sait, nous savons, vous savez, ils savent. → Connaissance." }
    ],
    formula: "Toujours suivis d'un infinitif : 'Je veux faire', 'Je dois partir', 'Je sais chanter'",
    trivia: {
      question: "Elle _______ réussir parce qu'elle _______ ses leçons.",
      options: ["veut / sait", "dois / peux"],
      correct: "veut / sait",
      explanation: "Excellent ! 'Elle veut' (volonté) et 'elle sait ses leçons' (connaissance)."
    }
  }
];

function GrammarSection() {
  const { chapterId } = useParams();
  const isReprise = chapterId === 'unite-reprise';
  const currentDossiers = isReprise ? REPRISE_GRAMMAR_DOSSIERS : LE_PASSE_GRAMMAR_DOSSIERS;

  // Secondary header tab state (null by default)
  const [activeHeaderTab, setActiveHeaderTab] = useState(null);

  // Accordion state: tracks which folder ID is currently open (null = all collapsed)
  const [openFolderId, setOpenFolderId] = useState(null);

  // Interactive Quiz state for trivia chips
  const [userQuizAnswers, setUserQuizAnswers] = useState({});

  // Active Pronoun Index for Conjugation Simulator
  const [activePronounIdx, setActivePronounIdx] = useState(0);
  const pronounsList = ["Je / J'", "Tu", "Il / Elle", "Nous", "Vous", "Ils / Elles"];

  const toggleFolder = (folderId) => {
    if (openFolderId === folderId) {
      setOpenFolderId(null);
    } else {
      setOpenFolderId(folderId);
    }
  };

  const handleQuizAnswer = (folderId, selectedOpt) => {
    setUserQuizAnswers({
      ...userQuizAnswers,
      [folderId]: selectedOpt
    });
  };

  return (
    <div className="grammar-header-container text-left fade-in">
      
      {/* Secondary Header Tab Bar matching 4-column grid layout, size, shape, and structure of top header tabs */}
      <div className="section-navigation grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Header Tab: Dossiers de Grammaire */}
        <div 
          onClick={() => setActiveHeaderTab(activeHeaderTab === 'dossiers' ? null : 'dossiers')}
          className={`section-card cursor-pointer ${
            activeHeaderTab === 'dossiers' ? 'active' : ''
          }`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge grammar-badge">
            {isReprise ? <Compass size={28} className="text-white" /> : <Film size={28} className="text-white" />}
          </div>
          <h3>
            {isReprise 
              ? "🔥 #PourToi : Verbes & Prépositions" 
              : "🎬 #PourToi : Passé & Narration"}
          </h3>
        </div>

        {/* Header Tab: Conjugaison des Verbes Irréguliers */}
        <div 
          onClick={() => setActiveHeaderTab(activeHeaderTab === 'conjugaison-irreguliers' ? null : 'conjugaison-irreguliers')}
          className={`section-card cursor-pointer ${
            activeHeaderTab === 'conjugaison-irreguliers' ? 'active' : ''
          }`}
          style={{ paddingTop: '1.12rem', paddingBottom: '1.12rem' }}
        >
          <div className="tab-icon-badge vocab-badge bg-gradient-to-tr from-[#ff0050] to-[#ff0050]/80">
            <Flame size={28} className="text-white" />
          </div>
          <h3>
            {isReprise 
              ? "⚡ #Tendance : Verbes au Présent" 
              : "⚡ #Tendance : Conjugaisons"}
          </h3>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CONJUGAISON AU PRÉSENT — VERBES -ER, -IR, -RE & ESSENTIELS   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeHeaderTab === 'conjugaison-irreguliers' && (
        <div className="orthographe-disney-container fade-in p-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-amber-400/30">
            <div>
              <h3 className="font-black text-white text-xl sm:text-2xl flex items-center gap-2">
                <Zap className="text-amber-400" size={24} />
                Conjugaison au Présent — Reprise
              </h3>
              <p className="text-xs text-amber-200/80 font-semibold mt-1">
                Verbes en -ER, -IR, -RE et les 10 verbes essentiels : être, avoir, faire, aller, pouvoir, vouloir, devoir, venir, prendre, savoir.
              </p>
            </div>
            <span className="text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3.5 py-1.5 rounded-full shadow-md border border-amber-300">
              ⚡ Présent de l'Indicatif
            </span>
          </div>

          {/* ─── REGULAR VERBS TABLE ─── */}
          <h4 className="font-black text-cyan-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <BookOpenCheck size={16} className="text-cyan-400" />
            Verbes Réguliers (-ER, -IR, -RE)
          </h4>

          <div className="overflow-x-auto rounded-2xl border-2 border-cyan-400/30 shadow-xl mb-8 bg-white">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="bg-cyan-50">
                  <th className="text-left px-4 py-3 text-cyan-800 font-black text-xs uppercase tracking-wider border-b-2 border-cyan-200 sticky left-0 bg-cyan-50 z-10">Modèle</th>
                  <th className="px-3 py-3 text-cyan-700 font-black text-xs uppercase tracking-wider border-b-2 border-cyan-200">Je / J'</th>
                  <th className="px-3 py-3 text-cyan-700 font-black text-xs uppercase tracking-wider border-b-2 border-cyan-200">Tu</th>
                  <th className="px-3 py-3 text-cyan-700 font-black text-xs uppercase tracking-wider border-b-2 border-cyan-200">Il / Elle</th>
                  <th className="px-3 py-3 text-cyan-700 font-black text-xs uppercase tracking-wider border-b-2 border-cyan-200">Nous</th>
                  <th className="px-3 py-3 text-cyan-700 font-black text-xs uppercase tracking-wider border-b-2 border-cyan-200">Vous</th>
                  <th className="px-3 py-3 text-cyan-700 font-black text-xs uppercase tracking-wider border-b-2 border-cyan-200">Ils / Elles</th>
                  <th className="px-3 py-3 text-cyan-700 font-black text-xs uppercase tracking-wider border-b-2 border-cyan-200">Terminaisons</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { inf: "Parler (-ER)", conj: ["parle", "parles", "parle", "parlons", "parlez", "parlent"], ends: "-e, -es, -e, -ons, -ez, -ent" },
                  { inf: "Finir (-IR)",  conj: ["finis", "finis", "finit", "finissons", "finissez", "finissent"], ends: "-is, -is, -it, -issons, -issez, -issent" },
                  { inf: "Vendre (-RE)", conj: ["vends", "vends", "vend", "vendons", "vendez", "vendent"], ends: "-s, -s, —, -ons, -ez, -ent" },
                ].map((v, vIdx) => (
                  <tr key={vIdx} className={`${vIdx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-cyan-50/50 transition-colors`}>
                    <td className="px-4 py-2.5 font-black text-sm border-r border-cyan-100 sticky left-0 z-10" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                      {v.inf}
                    </td>
                    {v.conj.map((c, cIdx) => (
                      <td key={cIdx} className="px-3 py-2.5 text-center text-slate-800 font-semibold text-sm border-r border-slate-100">
                        {c}
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-center text-cyan-600 font-bold text-xs italic">
                      {v.ends}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ─── 10 ESSENTIAL IRREGULAR VERBS TABLE ─── */}
          <h4 className="font-black text-amber-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap size={16} className="text-amber-600" />
            Les 10 Verbes Essentiels (Irréguliers)
          </h4>

          <div className="overflow-x-auto rounded-2xl border-2 border-amber-400/40 shadow-xl bg-white">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="bg-amber-50">
                  <th className="text-left px-4 py-3 text-amber-800 font-black text-xs uppercase tracking-wider border-b-2 border-amber-200 sticky left-0 bg-amber-50 z-10">Infinitif</th>
                  <th className="px-3 py-3 text-amber-700 font-black text-xs uppercase tracking-wider border-b-2 border-amber-200">Je / J'</th>
                  <th className="px-3 py-3 text-amber-700 font-black text-xs uppercase tracking-wider border-b-2 border-amber-200">Tu</th>
                  <th className="px-3 py-3 text-amber-700 font-black text-xs uppercase tracking-wider border-b-2 border-amber-200">Il / Elle</th>
                  <th className="px-3 py-3 text-amber-700 font-black text-xs uppercase tracking-wider border-b-2 border-amber-200">Nous</th>
                  <th className="px-3 py-3 text-amber-700 font-black text-xs uppercase tracking-wider border-b-2 border-amber-200">Vous</th>
                  <th className="px-3 py-3 text-amber-700 font-black text-xs uppercase tracking-wider border-b-2 border-amber-200">Ils / Elles</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { inf: "Être",    conj: ["suis", "es", "est", "sommes", "êtes", "sont"] },
                  { inf: "Avoir",   conj: ["ai", "as", "a", "avons", "avez", "ont"] },
                  { inf: "Faire",   conj: ["fais", "fais", "fait", "faisons", "faites", "font"] },
                  { inf: "Aller",   conj: ["vais", "vas", "va", "allons", "allez", "vont"] },
                  { inf: "Pouvoir", conj: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"] },
                  { inf: "Vouloir", conj: ["veux", "veux", "veut", "voulons", "voulez", "veulent"] },
                  { inf: "Devoir",  conj: ["dois", "dois", "doit", "devons", "devez", "doivent"] },
                  { inf: "Venir",   conj: ["viens", "viens", "vient", "venons", "venez", "viennent"] },
                  { inf: "Prendre", conj: ["prends", "prends", "prend", "prenons", "prenez", "prennent"] },
                  { inf: "Savoir",  conj: ["sais", "sais", "sait", "savons", "savez", "savent"] },
                ].map((v, vIdx) => (
                  <tr key={vIdx} className={`${vIdx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-amber-50/50 transition-colors`}>
                    <td className="px-4 py-2.5 font-black text-sm border-r border-amber-100 sticky left-0 z-10" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                      {v.inf}
                    </td>
                    {v.conj.map((c, cIdx) => (
                      <td key={cIdx} className="px-3 py-2.5 text-center text-slate-800 font-semibold text-sm border-r border-slate-100 last:border-r-0">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Frame housing the Interactive Accordion List */}
      {activeHeaderTab === 'dossiers' && (
        <div className="grammar-accordion-frame fade-in">
          
          {/* Header Title with Glow */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-amber-400/30">
            <div>
              <h3 className="font-black text-white text-xl sm:text-2xl flex items-center gap-2">
                <Sparkles className="text-amber-400" size={24} />
                {isReprise 
                  ? "Dossiers de Grammaire : Verbes au Présent & Prépositions" 
                  : "Dossiers de Grammaire : Le Passé & La Narration"}
              </h3>
              <p className="text-xs text-amber-200/80 font-semibold mt-1">
                Explorez les clés fondamentales, simulez les conjugaisons et testez votre instinct linguistique !
              </p>
            </div>
 
            <span className="text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3.5 py-1.5 rounded-full shadow-md border border-amber-300">
              ⚡ Mode Interactif Immersion 9e
            </span>
          </div>
 
          {/* Accordion Stack of 6 Folders */}
          <div className="folders-accordion-stack flex flex-col gap-3.5">
            {currentDossiers.map((folder) => {
              const isOpen = openFolderId === folder.id;
              const quizAnswer = userQuizAnswers[folder.id];

              return (
                <div key={folder.id} className={`grammar-folder-card ${isOpen ? 'open' : ''}`}>
                  
                  {/* Clickable Header Row styled as a TikTok/Insta Post header */}
                  <div 
                    className="folder-header-row"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Social Media Tutor Profile Avatar */}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff0050] to-[#00f2fe] p-0.5 flex-shrink-0 shadow-md">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-black text-[10px] text-white tracking-widest uppercase">
                          {folder.id.slice(0, 3)}
                        </div>
                      </div>
                      
                      {/* User Account Handle & Post Info */}
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-[#ff0050] text-xs tracking-wider uppercase">
                            {isReprise ? "@Jasmine_Immersion" : "@Prof_Grammaire"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">• actif</span>
                        </div>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 m-0 mt-0.5 tracking-tight">
                          {folder.title}
                        </h4>
                        <span className="text-[11px] text-slate-600 font-semibold mt-1 flex items-center gap-1">
                          {!folder.subtitle.startsWith('#') && <span className="text-[#ff0050] font-black">#</span>}
                          {folder.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 flex-shrink-0">
                      {/* Fake TikTok style engagement stats */}
                      <div className="hidden sm:flex items-center gap-4 text-xs font-black text-slate-500">
                        <span className="flex items-center gap-1"><Heart size={14} className="text-[#ff0050] fill-[#ff0050]" /> 84K</span>
                        <span className="flex items-center gap-1"><MessageCircle size={14} className="text-[#00f2fe] fill-[#00f2fe]" /> 1.2K</span>
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        {isOpen ? (
                          <ChevronUp size={18} className="text-[#ff0050]" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Folder Content */}
                  {isOpen && (
                    <div className="folder-expanded-body fade-in">
                      
                      {/* DOSSIER 1: L'IMPARFAIT SPECIAL INTERACTIVE DESIGN */}
                      {folder.id === 'imparfait' && (
                        <div className="flex flex-col gap-5">
                          
                          {/* 1. Les 3 Piliers Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {folder.piliers.map((pil, pIdx) => (
                              <div key={pIdx} className="bg-white/90 p-3.5 rounded-xl border border-sky-200 shadow-xs flex flex-col justify-between">
                                <div>
                                  <span className="text-xl mb-1 block">{pil.icon}</span>
                                  <h6 className="font-black text-slate-900 text-xs mb-1">{pil.title}</h6>
                                  <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{pil.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* 2. Formula Banner */}
                          <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-4 rounded-xl shadow-sm border border-sky-400/50">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                              🔑 La Formule Magique de l'Imparfait :
                            </span>
                            <p className="font-extrabold text-xs leading-relaxed">{folder.formula}</p>
                          </div>

                          {/* 3. Interactive Conjugation Simulator */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                              <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                <Zap size={16} className="text-amber-500" />
                                {folder.conjugation.title}
                              </h5>
                              <span className="text-[10px] text-slate-500 font-bold">Cliquez sur un pronom ci-dessous :</span>
                            </div>

                            {/* Pronoun Selector Pills */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {pronounsList.map((pName, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => setActivePronounIdx(pIdx)}
                                  className={`px-3 py-1 text-xs rounded-lg font-black transition-all cursor-pointer ${
                                    activePronounIdx === pIdx
                                      ? 'bg-sky-600 text-white shadow-md border border-sky-700'
                                      : 'bg-slate-100 text-slate-700 hover:bg-sky-100'
                                  }`}
                                >
                                  {pName}
                                </button>
                              ))}
                            </div>

                            {/* Live Conjugation Output */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {folder.conjugation.stems.map((st, sIdx) => (
                                <div key={sIdx} className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-center">
                                  <span className="text-[11px] font-bold text-slate-500 block mb-1">{st.verb}</span>
                                  <div className="text-sm font-black text-slate-900">
                                    <span className="text-slate-600">{pronounsList[activePronounIdx]} </span>
                                    <span className="text-sky-700">{st.stem}</span>
                                    <span className="text-amber-600 underline">{st.endings[activePronounIdx]}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}

                      {/* DOSSIER 2: PASSÉ COMPOSÉ AVOIR INTERACTIVE DESIGN */}
                      {folder.id === 'pc_avoir' && (
                        <div className="flex flex-col gap-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {folder.piliers.map((pil, pIdx) => (
                              <div key={pIdx} className="bg-white/90 p-3.5 rounded-xl border border-amber-200 shadow-xs">
                                <span className="text-xl mb-1 block">{pil.icon}</span>
                                <h6 className="font-black text-slate-900 text-xs mb-1">{pil.title}</h6>
                                <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{pil.desc}</p>
                              </div>
                            ))}
                          </div>

                          {/* Participes Irréguliers Vault */}
                          <div className="bg-amber-900 text-amber-50 p-4 rounded-xl border border-amber-600 shadow-md">
                            <span className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-2">
                              🔮 Coffre des Participes Passés Irréguliers (Incontournables) :
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {folder.irregularsVault.map((item, iIdx) => (
                                <div key={iIdx} className="bg-amber-950/80 p-2.5 rounded-lg border border-amber-700/60 text-center">
                                  <span className="text-xs text-amber-200 font-semibold block">{item.inf}</span>
                                  <span className="text-sm font-black text-amber-400">➔ {item.pp}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DOSSIER 3: PASSÉ COMPOSÉ ÊTRE INTERACTIVE DESIGN */}
                      {folder.id === 'pc_etre' && (
                        <div className="flex flex-col gap-5">
                          {/* DR & MRS VANDERTRAMP Grid */}
                          <div className="bg-emerald-950 text-emerald-50 p-4 rounded-xl border border-emerald-600 shadow-md">
                            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider block mb-2">
                              🏰 Les 17 Verbes du Château DR & MRS VANDERTRAMP :
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {folder.vandertramp.map((v, vIdx) => (
                                <span key={vIdx} className="text-xs font-bold bg-emerald-900 text-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-700">
                                  ✨ {v}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Accord Demo Cards */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 mb-3">
                              🎀 La Loupe de l'Accord Obligatoire (ÊTRE) :
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {folder.accordDemo.map((item, aIdx) => (
                                <div key={aIdx} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-600 block">{item.subject}</span>
                                    <span className="text-sm font-black text-emerald-900">{item.verb}</span>
                                  </div>
                                  <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                                    {item.tag}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DOSSIER 4: COMBINAISON STORYTIMELINE */}
                      {folder.id === 'combinaison' && (
                        <div className="flex flex-col gap-3">
                          <h5 className="font-black text-xs uppercase tracking-wider text-slate-900">
                            🍿 Le Récit en Action (Imparfait vs Passé Composé) :
                          </h5>
                          {folder.storyTimeline.map((item, tIdx) => (
                            <div key={tIdx} className={`p-3.5 rounded-xl border ${item.color} shadow-2xs`}>
                              <span className="text-[10px] font-black uppercase tracking-widest block mb-1">{item.type}</span>
                              <p className="text-xs leading-relaxed font-bold">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* DOSSIER 5: CONNECTEURS LOGIQUES */}
                      {folder.id === 'connecteurs' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {folder.categories.map((cat, cIdx) => (
                            <div key={cIdx} className="bg-white p-3.5 rounded-xl border border-cyan-200 shadow-xs">
                              <h6 className="font-black text-cyan-950 text-xs mb-2">{cat.title}</h6>
                              <div className="flex flex-wrap gap-1">
                                {cat.words.map((w, wIdx) => (
                                  <span key={wIdx} className="text-xs font-bold bg-cyan-50 text-cyan-900 px-2 py-0.5 rounded border border-cyan-200">
                                    {w}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* DOSSIER 6: VERBES RÉFLÉCHIS */}
                      {folder.id === 'reflechis' && (
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {folder.miroir.map((item, mIdx) => (
                              <div key={mIdx} className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-xs">
                                <h6 className="font-black text-rose-950 text-xs mb-1">{item.mode}</h6>
                                <p className="text-xs text-slate-700 font-medium">{item.example}</p>
                              </div>
                            ))}
                          </div>

                          {/* Conjugator Wheel Table */}
                          <div className="bg-rose-950 text-rose-50 p-4 rounded-xl border border-rose-700 shadow-md">
                            <span className="text-xs font-black text-rose-300 uppercase tracking-wider block mb-2">
                              📊 Conjugaison Exemple : Se passionner (pour l'art)
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {folder.conjugatorWheel.map((row, rIdx) => (
                                <div key={rIdx} className="bg-rose-900/80 p-2.5 rounded-lg border border-rose-700 text-center">
                                  <span className="text-[11px] text-rose-200 font-bold block">{row.pronoun}</span>
                                  <span className="text-xs font-black text-amber-300">{row.reflex} {row.verb}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Generic/Reprise Dossier Layout */}
                      {folder.id !== 'imparfait' && 
                       folder.id !== 'pc_avoir' && 
                       folder.id !== 'pc_etre' && 
                       folder.id !== 'combinaison' && 
                       folder.id !== 'connecteurs' && 
                       folder.id !== 'reflechis' && (
                        <div className="folder-expanded-content">
                          
                          {/* 1. Pinned Comment Formula Block (TikTok Pinned Comment) */}
                          {folder.formula && (
                            <div className="formula-box">
                              <span className="formula-box-label">
                                📌 Commentaire Épinglé : La Règle d'or
                              </span>
                              <p className="formula-box-text">{folder.formula}</p>
                            </div>
                          )}

                          {/* 2. Pillars Grid (styled as social media post replies) */}
                          {folder.piliers && (
                            <div className="pillars-grid">
                              {folder.piliers.map((pil, pIdx) => (
                                <div key={pIdx} className="pillar-card">
                                  {/* Icon Badge */}
                                  <div className="pillar-icon-badge">
                                    {pil.icon}
                                  </div>
                                  
                                  <div className="pillar-content">
                                    <h6 className="pillar-preposition-title">{pil.title}</h6>
                                    <p className="pillar-desc">{pil.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* ⚡ TRIVIA KNOWLEDGE CHECK CHIP (Social Media Interactive Poll) */}
                      {folder.trivia && (
                        <div className="trivia-poll-container">
                          <div className="trivia-poll-header">
                            <HelpCircle size={16} className="text-[#02b1a9]" />
                            <span className="trivia-poll-tag">
                              📊 Sondage Interactif : Teste ton instinct !
                            </span>
                          </div>

                          <p className="trivia-poll-question">
                            {folder.trivia.question}
                          </p>

                          <div className="trivia-poll-options">
                            {folder.trivia.options.map((opt, oIdx) => {
                              const isSelected = quizAnswer === opt;
                              const isCorrectOption = opt === folder.trivia.correct;
                              let btnClass = "trivia-poll-btn";
                              if (quizAnswer) {
                                if (isSelected) {
                                  btnClass += isCorrectOption ? " correct" : " incorrect";
                                }
                              }
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleQuizAnswer(folder.id, opt)}
                                  className={btnClass}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {quizAnswer && (
                            <div className={`trivia-poll-feedback ${
                              quizAnswer === folder.trivia.correct ? 'correct' : 'incorrect'
                            }`}>
                              {quizAnswer === folder.trivia.correct ? (
                                <>
                                  <CheckCircle2 size={16} className="flex-shrink-0" />
                                  <span>{folder.trivia.explanation}</span>
                                </>
                              ) : (
                                <span>❌ Oups ! Réessaie pour trouver la bonne réponse.</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}

export default GrammarSection;
