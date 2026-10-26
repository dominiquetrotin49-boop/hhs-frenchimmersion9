import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Volume2, HelpCircle, Sparkles, BookOpen, Award } from 'lucide-react';
import { speakFrench } from '../../utils/speechUtils';

// ══════════════════════════════════════════════════════════════════════════════
//  3 ACTIVITÉS DE TEXTES À TROUS — UNITÉ 2 (SANTÉ MENTALE & BIEN-ÊTRE)
//  Dossier 3 : Vocabulaire (50 mots) + L'Impératif + Il faut que + Subjonctif
//  Verbes cibles : gérer, s'exprimer, prendre, se confier, faire, dormir, comprendre, demander
// ══════════════════════════════════════════════════════════════════════════════

const ACTIVITIES = [
  {
    id: 'vocab_contexte',
    step: 1,
    title: 'Activité 1 : Le Vocabulaire de la Santé Mentale',
    subtitle: 'Complétez les phrases avec les termes essentiels du Dossier 1',
    icon: '🧠',
    accentColor: '#0284c7',
    bgLight: '#f0f9ff',
    borderLight: '#bae6fd',
    instructions:
      'Choisissez ou écrivez le mot de vocabulaire qui complète logiquement chaque phrase sur la santé mentale et le bien-être.',
    wordBank: [
      'pression scolaire',
      'respiration profonde',
      'stigmatisation',
      'conseiller',
      'épuisement',
      'stratégie d’adaptation',
      'anxiété',
      'résilience',
      'pleine conscience',
      'bien-être',
    ],
    items: [
      {
        id: 'v1',
        before: 'Pendant la semaine des examens finaux, beaucoup d’élèves ressentent une forte ',
        after: ' à cause des notes et des attentes.',
        answer: 'pression scolaire',
        accepted: ['pression scolaire', 'la pression scolaire'],
        cue: 'Terme : academic pressure',
        hint: 'C’est le stress lié aux études, aux devoirs et aux examens (2 mots).',
        explanation: '« La pression scolaire » désigne le stress ressenti face aux exigences de l’école.',
      },
      {
        id: 'v2',
        before: 'Pour calmer son cœur qui bat trop vite, Léo pratique la ',
        after: ' en inspirant lentement pendant quatre secondes.',
        answer: 'respiration profonde',
        accepted: ['respiration profonde', 'la respiration profonde'],
        cue: 'Terme : deep breathing',
        hint: 'Technique physique simple qui consiste à inspirer et expirer lentement (2 mots).',
        explanation: '« La respiration profonde » aide à réduire immédiatement le stress et la nervosité.',
      },
      {
        id: 'v3',
        before: 'Écouter de la musique douce ou faire du sport après les cours est une excellente ',
        after: ' pour gérer ses émotions.',
        answer: 'stratégie d’adaptation',
        accepted: ["stratégie d'adaptation", 'stratégie d’adaptation', 'strategie d adaptation', "strategie d'adaptation"],
        cue: 'Terme : coping strategy',
        hint: 'Un moyen positif utilisé pour faire face aux difficultés (commence par « stratégie... »).',
        explanation: 'Une « stratégie d’adaptation » (coping strategy) permet de surmonter le stress sainement.',
      },
      {
        id: 'v4',
        before: 'À cause de la ',
        after: ', certains jeunes ont encore honte de parler ouvertement de leurs difficultés psychologiques.',
        answer: 'stigmatisation',
        accepted: ['stigmatisation', 'la stigmatisation'],
        cue: 'Terme : stigma',
        hint: 'Le jugement négatif ou les préjugés de la société envers la santé mentale.',
        explanation: 'Combattre « la stigmatisation » permet à chacun de demander de l’aide sans honte.',
      },
      {
        id: 'v5',
        before: 'Si tu as besoin d’une écoute professionnelle à l’école, tu peux prendre rendez-vous avec un ',
        after: ' d’orientation.',
        answer: 'conseiller',
        accepted: ['conseiller', 'un conseiller', 'conseillère'],
        cue: 'Terme : counselor / advisor',
        hint: 'Le professionnel de l’école qui écoute, guide et soutient les élèves.',
        explanation: 'Un « conseiller » offre un espace confidentiel et bienveillant pour se confier.',
      },
      {
        id: 'v6',
        before: 'Travailler tard chaque nuit sans jamais se reposer peut mener à un état d’',
        after: ' physique et émotionnel.',
        answer: 'épuisement',
        accepted: ['épuisement', 'epuisement', "l'épuisement"],
        cue: 'Terme : exhaustion / burnout',
        hint: 'Fatigue extrême quand on a dépensé toute son énergie.',
        explanation: '« L’épuisement » (burnout) survient quand on ne respecte plus ses limites ni son sommeil.',
      },
      {
        id: 'v7',
        before: 'La peur constante de l’avenir et l’inquiétude excessive sont des signes d’',
        after: '.',
        answer: 'anxiété',
        accepted: ['anxiété', 'anxiete', "l'anxiété"],
        cue: 'Terme : anxiety',
        hint: 'Émotion d’inquiétude intense et de nervosité.',
        explanation: '« L’anxiété » se manifeste par une inquiétude persistante qu’on peut apaiser par le dialogue et la relaxation.',
      },
      {
        id: 'v8',
        before: 'La capacité à rebondir et à retrouver son équilibre après une épreuve difficile s’appelle la ',
        after: '.',
        answer: 'résilience',
        accepted: ['résilience', 'resilience', 'la résilience'],
        cue: 'Terme : resilience',
        hint: 'Force intérieure qui permet de surmonter les obstacles.',
        explanation: '« La résilience » se développe grâce au soutien social et à une attitude bienveillante envers soi-même.',
      },
      {
        id: 'v9',
        before: 'La méditation de ',
        after: ' consiste à porter toute son attention sur le moment présent, sans jugement.',
        answer: 'pleine conscience',
        accepted: ['pleine conscience', 'la pleine conscience'],
        cue: 'Terme : mindfulness',
        hint: 'Expression de 2 mots : « pleine ... ».',
        explanation: '« La pleine conscience » (mindfulness) aide à calmer les pensées envahissantes.',
      },
      {
        id: 'v10',
        before: 'Dormir suffisamment, manger équilibré et cultiver des amitiés positives sont essentiels pour notre ',
        after: ' général.',
        answer: 'bien-être',
        accepted: ['bien-être', 'bien-etre', 'bien etre'],
        cue: 'Terme : well-being / wellness',
        hint: 'Mot composé avec un trait d’union qui exprime un état de santé et de bonheur.',
        explanation: '« Le bien-être » regroupe l’équilibre physique, mental et social.',
      },
    ],
  },

  {
    id: 'imperatif_pratique',
    step: 2,
    title: 'Activité 2 : L’Impératif (Affirmatif & Négatif)',
    subtitle: 'Conjuguez les 8 verbes clés pour donner des conseils de bien-être',
    icon: '📢',
    accentColor: '#d97706',
    bgLight: '#fffbeb',
    borderLight: '#fde68a',
    instructions:
      'Complétez chaque conseil en conjuguant le verbe indiqué à l’impératif (affirmatif ou négatif) selon la personne demandée.',
    wordBank: [
      'prends',
      'Gère',
      'confie-toi',
      'exprime-toi',
      'faites',
      'dors',
      'demandons',
      'Comprenez',
      'te confie',
      'prenons',
    ],
    items: [
      {
        id: 'i1',
        before: 'Quand tu sens monter le stress avant une présentation orale, ',
        after: ' une grande respiration profonde !',
        answer: 'prends',
        accepted: ['prends'],
        cue: 'PRENDRE • 2e pers. du singulier (tu) — affirmatif',
        hint: 'Verbe du 3e groupe en -DRE : avec « tu », il garde son -s final.',
        explanation: 'À l’impératif avec « tu », PRENDRE s’écrit « prends » (contrairement aux verbes en -ER, il garde le -s).',
      },
      {
        id: 'i2',
        before: '',
        after: ' ton emploi du temps avec réalisme pour éviter la pression scolaire !',
        answer: 'Gère',
        accepted: ['gère', 'gere'],
        cue: 'GÉRER • 2e pers. du singulier (tu) — affirmatif',
        hint: 'Verbe du 1er groupe (-ER) : attention à l’accent grave sur le « è » et à la disparition du -s avec « tu » !',
        explanation: 'Pour un verbe en -ER comme GÉRER, on enlève le -s final à la 2e personne du singulier : « Gère ! ».',
      },
      {
        id: 'i3',
        before: 'Si la tristesse ou l’anxiété devient trop lourde à porter, ',
        after: ' à un adulte de confiance.',
        answer: 'confie-toi',
        accepted: ['confie-toi'],
        cue: 'SE CONFIER • 2e pers. du singulier (tu) — affirmatif',
        hint: 'Verbe pronominal en -ER à l’affirmatif : verbe sans -s + trait d’union + pronom tonique.',
        explanation: 'À l’impératif affirmatif d’un verbe pronominal du 1er groupe : « confie-toi » (sans -s et avec un trait d’union).',
      },
      {
        id: 'i4',
        before: 'N’aie pas peur du regard des autres : ',
        after: ' librement sur ce que tu ressens !',
        answer: 'exprime-toi',
        accepted: ['exprime-toi'],
        cue: 'S’EXPRIMER • 2e pers. du singulier (tu) — affirmatif',
        hint: 'Verbe pronominal en -ER à l’affirmatif : « exprime-... ».',
        explanation: 'Bravo ! « Exprime-toi » : pas de -s final pour un verbe en -ER avec « tu », suivi de « -toi ».',
      },
      {
        id: 'i5',
        before: 'Chers élèves, ',
        after: ' de l’exercice régulièrement et accordez-vous des pauses loin des écrans !',
        answer: 'faites',
        accepted: ['faites'],
        cue: 'FAIRE • 2e pers. du pluriel (vous) — affirmatif',
        hint: 'Attention : forme irrégulière très fréquente avec « vous » (jamais *faisez) !',
        explanation: 'Le verbe FAIRE a une forme irrégulière avec « vous » au présent et à l’impératif : « faites ».',
      },
      {
        id: 'i6',
        before: 'Pour protéger ta santé mentale et éviter l’épuisement, ',
        after: ' au moins huit heures chaque nuit.',
        answer: 'dors',
        accepted: ['dors'],
        cue: 'DORMIR • 2e pers. du singulier (tu) — affirmatif',
        hint: 'Verbe du 3e groupe : au présent « tu dors » → même forme à l’impératif.',
        explanation: 'DORMIR est un verbe du 3e groupe : avec « tu », il garde son -s final → « dors ».',
      },
      {
        id: 'i7',
        before: 'Ne restons pas isolés face aux difficultés : ',
        after: ' de l’aide au conseiller de l’école !',
        answer: 'demandons',
        accepted: ['demandons'],
        cue: 'DEMANDER • 1re pers. du pluriel (nous) — affirmatif',
        hint: 'Avec « nous », la terminaison est toujours « -ons ».',
        explanation: 'Avec « nous », DEMANDER donne « demandons » pour exprimer un encouragement collectif.',
      },
      {
        id: 'i8',
        before: '',
        after: ' bien que demander du soutien est une preuve de courage, et non une faiblesse !',
        answer: 'Comprenez',
        accepted: ['comprenez'],
        cue: 'COMPRENDRE • 2e pers. du pluriel (vous) — affirmatif',
        hint: 'Comme PRENDRE au pluriel avec « vous » : radical « compren- » + « -ez ».',
        explanation: 'Avec « vous », COMPRENDRE se conjugue « Comprenez ».',
      },
      {
        id: 'i9',
        before: 'Attention aux dangers d’Internet : ne ',
        after: ' pas à des inconnus sur les réseaux sociaux !',
        answer: 'te confie',
        accepted: ['te confie'],
        cue: 'SE CONFIER • 2e pers. du singulier (tu) — NÉGATIF',
        hint: 'À l’impératif négatif, le pronom réfléchi « te » revient DEVANT le verbe (et pas de -s au verbe en -ER) !',
        explanation: 'À l’impératif négatif, le pronom précède le verbe sans trait d’union : « Ne te confie pas ! ».',
      },
      {
        id: 'i10',
        before: 'Ensemble, ',
        after: ' soin de notre bien-être émotionnel et soutenons nos camarades !',
        answer: 'prenons',
        accepted: ['prenons'],
        cue: 'PRENDRE • 1re pers. du pluriel (nous) — affirmatif',
        hint: 'Radical « pren- » (un seul n) + terminaison de « nous ».',
        explanation: 'Avec « nous », PRENDRE donne « prenons ».',
      },
    ],
  },

  {
    id: 'obligation_subjonctif',
    step: 3,
    title: 'Activité 3 : Les Structures d’Obligation (Il faut que + Subjonctif)',
    subtitle: 'Conjuguez les 8 verbes clés au subjonctif présent après les expressions de nécessité',
    icon: '⚡',
    accentColor: '#7c3aed',
    bgLight: '#f5f3ff',
    borderLight: '#ddd6fe',
    instructions:
      'Complétez chaque phrase d’obligation (« Il faut que… », « Il est essentiel que… ») en conjuguant le verbe au subjonctif présent.',
    wordBank: [
      'gères',
      'preniez',
      'fasses',
      'se confie',
      'dorment',
      'comprenne',
      'comprennent',
      'nous exprimions',
      'demandes',
      'fassent',
    ],
    items: [
      {
        id: 's1',
        before: 'Pour ne pas te laisser submerger par la pression scolaire, il faut que tu ',
        after: ' tes priorités étape par étape.',
        answer: 'gères',
        accepted: ['gères', 'geres'],
        cue: 'GÉRER • Subjonctif présent avec « tu »',
        hint: 'Attention : au subjonctif présent avec « tu », il y a TOUJOURS un -s final (« que tu gères ») !',
        explanation: 'Au subjonctif présent, contrairement à l’impératif, « tu » prend toujours -es : « il faut que tu gères ».',
      },
      {
        id: 's2',
        before: 'Pour préserver votre équilibre mental, il est essentiel que vous ',
        after: ' le temps de souffler chaque soir.',
        answer: 'preniez',
        accepted: ['preniez'],
        cue: 'PRENDRE • Subjonctif présent avec « vous »',
        hint: 'Avec « nous » et « vous », PRENDRE utilise son radical « pren- » + « -iez ».',
        explanation: 'PRENDRE a deux radicaux au subjonctif : « prenn- » (je, tu, il, ils) mais « pren- » avec nous/vous → « que vous preniez ».',
      },
      {
        id: 's3',
        before: 'Pour évacuer les tensions de la journée, il est indispensable que tu ',
        after: ' une activité physique ou artistique qui te plaît.',
        answer: 'fasses',
        accepted: ['fasses'],
        cue: 'FAIRE • Subjonctif présent avec « tu »',
        hint: 'FAIRE a un radical irrégulier au subjonctif : « fass- » + terminaison « -es ».',
        explanation: 'Le verbe FAIRE utilise le radical irrégulier « fass- » au subjonctif : « il est indispensable que tu fasses ».',
      },
      {
        id: 's4',
        before: 'Lorsqu’un élève traverse une période d’anxiété, il est important qu’il ',
        after: ' à une personne de confiance.',
        answer: 'se confie',
        accepted: ['se confie'],
        cue: 'SE CONFIER • Subjonctif présent avec « il »',
        hint: 'Pronom réfléchi « se » + verbe avec terminaison « -e ».',
        explanation: 'Avec « il/elle/on », SE CONFIER au subjonctif présent s’écrit « qu’il se confie ».',
      },
      {
        id: 's5',
        before: 'Pour favoriser la mémoire et la bonne humeur, il faut que les adolescents ',
        after: ' suffisamment chaque nuit.',
        answer: 'dorment',
        accepted: ['dorment'],
        cue: 'DORMIR • Subjonctif présent avec « les adolescents (ils) »',
        hint: 'Radical « dorm- » (de « ils dorment » au présent) + terminaison « -ent ».',
        explanation: 'Au subjonctif présent, DORMIR utilise le radical « dorm- » : « qu’ils dorment ».',
      },
      {
        id: 's6',
        before: 'Pour éliminer la stigmatisation à l’école, il faut que tout le monde ',
        after: ' l’importance de l’empathie.',
        answer: 'comprenne',
        accepted: ['comprenne'],
        cue: 'COMPRENDRE • Subjonctif présent avec « tout le monde (il) »',
        hint: 'Attention : « tout le monde » est singulier (= il). Radical « comprenn- » (double n) + « -e ».',
        explanation: 'Avec « tout le monde » (3e pers. du singulier), COMPRENDRE double le « n » : « qu’il comprenne ».',
      },
      {
        id: 's7',
        before: 'Il est essentiel que les jeunes ',
        after: ' que leurs émotions sont légitimes et normales.',
        answer: 'comprennent',
        accepted: ['comprennent'],
        cue: 'COMPRENDRE • Subjonctif présent avec « les jeunes (ils) »',
        hint: '3e personne du pluriel : radical « comprenn- » (double n) + « -ent ».',
        explanation: 'Avec « ils/elles », COMPRENDRE garde le double « n » : « que les jeunes comprennent ».',
      },
      {
        id: 's8',
        before: 'Dans notre cercle d’écoute, il faut que nous ',
        after: ' avec franchise et bienveillance.',
        answer: 'nous exprimions',
        accepted: ['nous exprimions', 'exprimions'],
        cue: 'S’EXPRIMER • Subjonctif présent avec « nous »',
        hint: 'Verbe pronominal : après « que nous », n’oubliez pas le deuxième « nous » + terminaison « -ions » !',
        explanation: 'Pour un verbe pronominal avec « nous » au subjonctif : « il faut que nous nous exprimions ».',
      },
      {
        id: 's9',
        before: 'Si tu te sens proche de l’épuisement, il faut absolument que tu ',
        after: ' de l’aide à tes proches ou à un conseiller.',
        answer: 'demandes',
        accepted: ['demandes'],
        cue: 'DEMANDER • Subjonctif présent avec « tu »',
        hint: 'Radical « demand- » + terminaison « -es » du subjonctif avec « tu ».',
        explanation: 'Après « il faut que tu », DEMANDER prend son -s du subjonctif : « que tu demandes ».',
      },
      {
        id: 's10',
        before: 'Pour améliorer le bien-être étudiant, il est indispensable que les écoles ',
        after: ' de la santé mentale une priorité.',
        answer: 'fassent',
        accepted: ['fassent'],
        cue: 'FAIRE • Subjonctif présent avec « les écoles (elles) »',
        hint: 'Radical irrégulier de FAIRE au subjonctif (« fass- ») + « -ent ».',
        explanation: 'Avec « les écoles (elles) », FAIRE au subjonctif présent donne « qu’elles fassent ».',
      },
    ],
  },
];

const ACCENT_CHARS = ['é', 'è', 'ê', 'à', 'ù', 'ç', 'î', 'ô', '’', '-'];

function normalizeAnswer(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .replace(/['’`]/g, "'")
    .replace(/\s+/g, ' ');
}

export default function Unit2FillInBlanksSection() {
  const [activeActIdx, setActiveActIdx] = useState(0);
  const [inputMode, setInputMode] = useState('bank'); // 'bank' (click/select) or 'type' (keyboard typing)
  const [answers, setAnswers] = useState({}); // { [itemId]: string }
  const [checked, setChecked] = useState({}); // { [itemId]: boolean (true=correct, false=wrong) }
  const [hintsOpen, setHintsOpen] = useState({}); // { [itemId]: boolean }
  const [selectedBlankId, setSelectedBlankId] = useState(ACTIVITIES[0].items[0].id);

  const currentAct = ACTIVITIES[activeActIdx];

  const isItemCorrect = (item, val) => {
    const normVal = normalizeAnswer(val);
    if (!normVal) return false;
    return item.accepted.some((acc) => normalizeAnswer(acc) === normVal);
  };

  const handleAnswerChange = (itemId, value) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
    // Clear checked state when editing
    if (checked[itemId] !== undefined) {
      setChecked((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }
  };

  const handleWordBankClick = (word) => {
    // Fill into currently focused blank, or first empty blank in current activity
    let targetId = selectedBlankId;
    const existsInCurrent = currentAct.items.some((it) => it.id === targetId);
    if (!existsInCurrent) {
      const firstEmpty = currentAct.items.find((it) => !answers[it.id]);
      targetId = firstEmpty ? firstEmpty.id : currentAct.items[0].id;
    }
    handleAnswerChange(targetId, word);

    // Automatically advance focus to the next empty blank in this activity
    const nextEmpty = currentAct.items.find((it) => it.id !== targetId && !answers[it.id]);
    if (nextEmpty) {
      setSelectedBlankId(nextEmpty.id);
    }
  };

  const checkSingleItem = (item) => {
    const val = answers[item.id] || '';
    const ok = isItemCorrect(item, val);
    setChecked((prev) => ({ ...prev, [item.id]: ok }));
  };

  const checkAllInActivity = () => {
    const nextChecked = { ...checked };
    currentAct.items.forEach((item) => {
      nextChecked[item.id] = isItemCorrect(item, answers[item.id] || '');
    });
    setChecked(nextChecked);
  };

  const resetCurrentActivity = () => {
    const nextAnswers = { ...answers };
    const nextChecked = { ...checked };
    const nextHints = { ...hintsOpen };
    currentAct.items.forEach((item) => {
      delete nextAnswers[item.id];
      delete nextChecked[item.id];
      delete nextHints[item.id];
    });
    setAnswers(nextAnswers);
    setChecked(nextChecked);
    setHintsOpen(nextHints);
    setSelectedBlankId(currentAct.items[0].id);
  };

  const insertAccent = (char) => {
    if (!selectedBlankId) return;
    const currentVal = answers[selectedBlankId] || '';
    handleAnswerChange(selectedBlankId, currentVal + char);
  };

  // Compute scores
  const getActivityScore = (act) =>
    act.items.filter((it) => checked[it.id] === true).length;

  const currentScore = getActivityScore(currentAct);
  const totalScore = ACTIVITIES.reduce((sum, act) => sum + getActivityScore(act), 0);

  return (
    <div style={{ maxWidth: '940px', margin: '0 auto', padding: '0.5rem 0', color: '#0f172a' }}>
      {/* ── TOP HEADER BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        borderRadius: '1.2rem',
        padding: '1.35rem 1.5rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✏️</span>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#fde047' }}>
              Atelier de Pratique : 3 Activités de Textes à Trous
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>
            Pratiquez le vocabulaire du bien-être, l’impératif et les structures d’obligation (Il faut que + subjonctif).
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1.5px solid #34d399',
          borderRadius: '999px',
          padding: '0.45rem 1rem',
          fontWeight: 800,
          fontSize: '0.9rem',
          color: '#ecfdf5',
        }}>
          <Award size={18} />
          <span>Score global : {totalScore} / 30</span>
        </div>
      </div>

      {/* ── 3 ACTIVITY SELECTOR TABS ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        {ACTIVITIES.map((act, idx) => {
          const isActive = idx === activeActIdx;
          const actScore = getActivityScore(act);
          return (
            <button
              key={act.id}
              onClick={() => {
                setActiveActIdx(idx);
                setSelectedBlankId(act.items[0].id);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.35rem',
                padding: '1rem 1.15rem',
                borderRadius: '1rem',
                border: isActive ? `3px solid ${act.accentColor}` : '2px solid #e2e8f0',
                background: isActive ? act.bgLight : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 8px 20px rgba(0,0,0,0.08)' : '0 2px 5px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: act.accentColor,
                  background: '#ffffff',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  border: `1px solid ${act.borderLight}`,
                }}>
                  {act.icon} Activité {act.step} / 3
                </span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: actScore === 10 ? '#15803d' : '#475569',
                  background: actScore === 10 ? '#dcfce7' : '#f1f5f9',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                }}>
                  {actScore} / 10 ✅
                </span>
              </div>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a', marginTop: '0.15rem' }}>
                {act.title.replace(/^Activité \d+ : /, '')}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.35 }}>
                {act.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── ACTIVE ACTIVITY CARD ── */}
      <div style={{
        background: '#ffffff',
        border: `2px solid ${currentAct.borderLight}`,
        borderRadius: '1.2rem',
        padding: '1.5rem',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
      }}>
        {/* Activity Header + Mode Switcher */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          paddingBottom: '1rem',
          marginBottom: '1rem',
          borderBottom: '2px solid #f1f5f9',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.22rem', fontWeight: 900, color: currentAct.accentColor }}>
              {currentAct.icon} {currentAct.title}
            </h3>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
              {currentAct.instructions}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '0.75rem' }}>
            <button
              onClick={() => setInputMode('bank')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.55rem',
                border: 'none',
                background: inputMode === 'bank' ? '#ffffff' : 'transparent',
                color: inputMode === 'bank' ? '#0f172a' : '#64748b',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: inputMode === 'bank' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              🖱️ Banque de mots &amp; Menu
            </button>
            <button
              onClick={() => setInputMode('type')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.55rem',
                border: 'none',
                background: inputMode === 'type' ? '#ffffff' : 'transparent',
                color: inputMode === 'type' ? '#0f172a' : '#64748b',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: inputMode === 'type' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              ⌨️ Saisie au clavier
            </button>
          </div>
        </div>

        {/* ── INTERACTIVE WORD BANK (BANQUE DE MOTS) ── */}
        <div style={{
          background: currentAct.bgLight,
          border: `1.5px solid ${currentAct.borderLight}`,
          borderRadius: '0.9rem',
          padding: '0.9rem 1.1rem',
          marginBottom: '1.25rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.55rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 900, color: currentAct.accentColor, textTransform: 'uppercase' }}>
              📦 Banque de mots (Cliquez sur un mot pour remplir la phrase sélectionnée) :
            </span>
            {inputMode === 'type' && (
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {ACCENT_CHARS.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => insertAccent(ch)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.4rem',
                      padding: '0.18rem 0.5rem',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      color: '#0f172a',
                      cursor: 'pointer',
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {currentAct.wordBank.map((word) => {
              const isUsed = currentAct.items.some(
                (it) => normalizeAnswer(answers[it.id]) === normalizeAnswer(word)
              );
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleWordBankClick(word)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '999px',
                    border: isUsed ? '1.5px dashed #94a3b8' : `1.5px solid ${currentAct.accentColor}`,
                    background: isUsed ? '#e2e8f0' : '#ffffff',
                    color: isUsed ? '#64748b' : '#0f172a',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textDecoration: isUsed ? 'line-through' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 10 FILL-IN-THE-BLANK SENTENCES ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {currentAct.items.map((item, idx) => {
            const val = answers[item.id] || '';
            const status = checked[item.id]; // true | false | undefined
            const isFocused = selectedBlankId === item.id;
            const showHint = !!hintsOpen[item.id];
            const fullSentenceForAudio = `${item.before}${item.answer}${item.after}`;

            let cardBg = isFocused ? '#f8fafc' : '#ffffff';
            let cardBorder = isFocused ? currentAct.accentColor : '#e2e8f0';
            if (status === true) {
              cardBg = '#f0fdf4';
              cardBorder = '#22c55e';
            } else if (status === false) {
              cardBg = '#fef2f2';
              cardBorder = '#ef4444';
            }

            return (
              <div
                key={item.id}
                onClick={() => setSelectedBlankId(item.id)}
                style={{
                  background: cardBg,
                  border: `2px solid ${cardBorder}`,
                  borderRadius: '0.95rem',
                  padding: '0.95rem 1.15rem',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
              >
                {/* Cue badge + Audio + Hint + Check buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.55rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      background: currentAct.accentColor,
                      color: '#ffffff',
                      borderRadius: '999px',
                      width: '24px',
                      height: '24px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 900,
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{
                      background: '#f1f5f9',
                      color: '#334155',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '0.45rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      border: '1px solid #cbd5e1',
                    }}>
                      🎯 {item.cue}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHintsOpen((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                      }}
                      style={{
                        background: showHint ? '#fef3c7' : '#f8fafc',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        borderRadius: '0.5rem',
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      💡 Indice
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakFrench(status === true ? fullSentenceForAudio : `${item.before} ... ${item.after}`);
                      }}
                      title="Écouter la phrase"
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        borderRadius: '0.5rem',
                        padding: '0.28rem 0.55rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <Volume2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        checkSingleItem(item);
                      }}
                      style={{
                        background: currentAct.accentColor,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.28rem 0.7rem',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Vérifier
                    </button>
                  </div>
                </div>

                {/* Sentence with inline Blank */}
                <div style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.75,
                  color: '#0f172a',
                  fontWeight: 600,
                }}>
                  <span>{item.before}</span>

                  {inputMode === 'bank' ? (
                    <select
                      value={val}
                      onFocus={() => setSelectedBlankId(item.id)}
                      onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                      style={{
                        display: 'inline-block',
                        minWidth: '185px',
                        padding: '0.3rem 0.65rem',
                        margin: '0 0.25rem',
                        borderRadius: '0.5rem',
                        border: `2px solid ${
                          status === true ? '#16a34a' : status === false ? '#dc2626' : currentAct.accentColor
                        }`,
                        background: status === true ? '#dcfce7' : status === false ? '#fee2e2' : '#ffffff',
                        color: '#0f172a',
                        fontWeight: 800,
                        fontSize: '0.96rem',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">— Choisir —</option>
                      {currentAct.wordBank.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onFocus={() => setSelectedBlankId(item.id)}
                      onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                      placeholder="Écrivez ici..."
                      style={{
                        display: 'inline-block',
                        width: '190px',
                        padding: '0.28rem 0.65rem',
                        margin: '0 0.25rem',
                        borderRadius: '0.5rem',
                        border: `2px solid ${
                          status === true ? '#16a34a' : status === false ? '#dc2626' : currentAct.accentColor
                        }`,
                        background: status === true ? '#dcfce7' : status === false ? '#fee2e2' : '#ffffff',
                        color: '#0f172a',
                        fontWeight: 800,
                        fontSize: '0.96rem',
                      }}
                    />
                  )}

                  <span>{item.after}</span>
                </div>

                {/* Hint Box */}
                {showHint && (
                  <div style={{
                    marginTop: '0.55rem',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '0.55rem',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.84rem',
                    color: '#92400e',
                    fontWeight: 700,
                  }}>
                    💡 <strong>Indice :</strong> {item.hint}
                  </div>
                )}

                {/* Feedback Box */}
                {status !== undefined && (
                  <div style={{
                    marginTop: '0.55rem',
                    background: status ? '#dcfce7' : '#fee2e2',
                    borderRadius: '0.55rem',
                    padding: '0.5rem 0.8rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: status ? '#14532d' : '#7f1d1d',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    <span>
                      {status
                        ? `✅ Correct ! ${item.explanation}`
                        : `❌ Pas tout à fait. Regardez bien l’indice (${item.cue}) et réessayez !`}
                    </span>
                    {!status && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnswerChange(item.id, item.answer);
                          setChecked((prev) => ({ ...prev, [item.id]: true }));
                        }}
                        style={{
                          background: '#ffffff',
                          color: '#7f1d1d',
                          border: '1px solid #fca5a5',
                          borderRadius: '0.45rem',
                          padding: '0.2rem 0.6rem',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        Voir la réponse
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM ACTION BAR ── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          marginTop: '1.5rem',
          paddingTop: '1.15rem',
          borderTop: '2px solid #f1f5f9',
        }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
            Résultat de l’activité {currentAct.step} :{' '}
            <span style={{ color: currentAct.accentColor }}>{currentScore} / 10</span>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={resetCurrentActivity}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '0.7rem',
                padding: '0.65rem 1.15rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} /> Réinitialiser l’activité
            </button>

            <button
              type="button"
              onClick={checkAllInActivity}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: currentAct.accentColor,
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.7rem',
                padding: '0.65rem 1.35rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <CheckCircle2 size={17} /> Vérifier les 10 phrases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
