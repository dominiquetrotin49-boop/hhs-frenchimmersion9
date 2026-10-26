import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakFrench } from '../../utils/speechUtils';
import confetti from 'canvas-confetti';
import './Unit2Grammar.css';

const OBLIGATION_STRUCTURES = [
  { expr: "Il faut que...", translation: "It is necessary that...", nuance: "Obligation directe & recommandation clé" },
  { expr: "Il est essentiel que...", translation: "It is essential that...", nuance: "Importance fondamentale pour le bien-être" },
  { expr: "Il est nécessaire que...", translation: "It is necessary that...", nuance: "Nécessité logique ou médicale" },
  { expr: "Il est indispensable que...", translation: "It is indispensable that...", nuance: "Urgence vitale ou équilibre incontournable" },
  { expr: "Il est impératif que...", translation: "It is imperative that...", nuance: "Priorité absolue face à la détresse" }
];

const SUBJONCTIF_VERBS = [
  {
    id: 'faire',
    verb: 'Faire',
    stemInfo: 'Radical spécial irrégulier : « fass- » pour toutes les personnes.',
    tag: 'Action & Pratique quotidienne',
    category: 'Irrégulier complet',
    conjugation: [
      { pr: 'que je / j’', form: 'fasse', ending: '-e' },
      { pr: 'que tu', form: 'fasses', ending: '-es' },
      { pr: 'qu’il / elle / on', form: 'fasse', ending: '-e' },
      { pr: 'que nous', form: 'fassions', ending: '-ions' },
      { pr: 'que vous', form: 'fassiez', ending: '-iez' },
      { pr: 'qu’ils / elles', form: 'fassent', ending: '-ent' }
    ],
    example: "Il faut que chaque élève fasse des exercices de respiration profonde pour dissiper l'anxiété.",
    obligationPrompt: "Il est essentiel que nous fassions de la méditation tous les matins."
  },
  {
    id: 'prendre',
    verb: 'Prendre',
    stemInfo: 'Deux radicaux : « prenn- » au singulier + ils/elles, « pren- » avec nous/vous.',
    tag: 'Équilibre & Rythme de vie',
    category: 'Deux radicaux',
    conjugation: [
      { pr: 'que je / j’', form: 'prenne', ending: '-e' },
      { pr: 'que tu', form: 'prennes', ending: '-es' },
      { pr: 'qu’il / elle / on', form: 'prenne', ending: '-e' },
      { pr: 'que nous', form: 'prenions', ending: '-ions' },
      { pr: 'que vous', form: 'preniez', ending: '-iez' },
      { pr: 'qu’ils / elles', form: 'prennent', ending: '-ent' }
    ],
    example: "Il est essentiel que tu prennes une pause dès que la fatigue scolaire s'accumule.",
    obligationPrompt: "Il faut que vous preniez le temps de respirer avant l'évaluation."
  },
  {
    id: 'dormir',
    verb: 'Dormir',
    stemInfo: 'Radical régulier sur le pluriel du présent (ils dorment) : « dorm- » partout.',
    tag: 'Sommeil & Récupération',
    category: 'Radical régulier',
    conjugation: [
      { pr: 'que je / j’', form: 'dorme', ending: '-e' },
      { pr: 'que tu', form: 'dormes', ending: '-es' },
      { pr: 'qu’il / elle / on', form: 'dorme', ending: '-e' },
      { pr: 'que nous', form: 'dormions', ending: '-ions' },
      { pr: 'que vous', form: 'dormiez', ending: '-iez' },
      { pr: 'qu’ils / elles', form: 'dorment', ending: '-ent' }
    ],
    example: "Il est indispensable que les jeunes dorment au moins 8 heures pour préserver leur humeur.",
    obligationPrompt: "Il faut que tu dormes dans un endroit calme et sans écran."
  },
  {
    id: 'gerer',
    verb: 'Gérer',
    stemInfo: 'Alternance de l\'accent : « gèr- » avec je/tu/il/ils et « gér- » avec nous/vous.',
    tag: 'Gestion du Stress',
    category: 'Verbe en -er avec accent',
    conjugation: [
      { pr: 'que je / j’', form: 'gère', ending: '-e' },
      { pr: 'que tu', form: 'gères', ending: '-es' },
      { pr: 'qu’il / elle / on', form: 'gère', ending: '-e' },
      { pr: 'que nous', form: 'gérions', ending: '-ions' },
      { pr: 'que vous', form: 'gériez', ending: '-iez' },
      { pr: 'qu’ils / elles', form: 'gèrent', ending: '-ent' }
    ],
    example: "Il faut que nous gérions notre charge de travail pour éviter la détresse émotionnelle.",
    obligationPrompt: "Il est nécessaire que chaque élève gère son calendrier d'étude."
  },
  {
    id: 'sexprimer',
    verb: "S'exprimer",
    category: 'Pronominal régulier',
    tag: 'Communication Ouverte',
    stemInfo: 'Radical « exprim- » précédé du pronom réfléchi adapté (me, te, se, nous, vous, se).',
    conjugation: [
      { pr: 'que je / j’', form: 'm’exprime', ending: '-e' },
      { pr: 'que tu', form: 't’exprimes', ending: '-es' },
      { pr: 'qu’il / elle / on', form: 's’exprime', ending: '-e' },
      { pr: 'que nous', form: 'nous exprimions', ending: '-ions' },
      { pr: 'que vous', form: 'vous exprimiez', ending: '-iez' },
      { pr: 'qu’ils / elles', form: 's’expriment', ending: '-ent' }
    ],
    example: "Il est important que chacun s'exprime librement au sein du groupe sans craindre le jugement.",
    obligationPrompt: "Il faut que vous vous exprimiez avec authenticité."
  },
  {
    id: 'seconfier',
    verb: 'Se confier',
    category: 'Pronominal régulier',
    tag: 'Recherche de Soutien',
    stemInfo: 'Radical « confi- » avec double "i" à nous et vous : « nous confiions », « vous confiiez » !',
    conjugation: [
      { pr: 'que je / j’', form: 'me confie', ending: '-e' },
      { pr: 'que tu', form: 'te confies', ending: '-es' },
      { pr: 'qu’il / elle / on', form: 'se confie', ending: '-e' },
      { pr: 'que nous', form: 'nous confiions', ending: '-ions' },
      { pr: 'que vous', form: 'vous confiiez', ending: '-iez' },
      { pr: 'qu’ils / elles', form: 'se confient', ending: '-ent' }
    ],
    example: "Il faut que tu te confies à un adulte de confiance ou à un conseiller si l'anxiété augmente.",
    obligationPrompt: "Il est impératif que les adolescents en détresse se confient sans tarder."
  },
  {
    id: 'comprendre',
    verb: 'Comprendre',
    category: 'Deux radicaux',
    tag: 'Empathie & Bienveillance',
    stemInfo: 'Identique à prendre : « comprenn- » au singulier + ils/elles, « compren- » à nous/vous.',
    conjugation: [
      { pr: 'que je / j’', form: 'comprenne', ending: '-e' },
      { pr: 'que tu', form: 'comprennes', ending: '-es' },
      { pr: 'qu’il / elle / on', form: 'comprenne', ending: '-e' },
      { pr: 'que nous', form: 'comprenions', ending: '-ions' },
      { pr: 'que vous', form: 'compreniez', ending: '-iez' },
      { pr: 'qu’ils / elles', form: 'comprennent', ending: '-ent' }
    ],
    example: "Il est essentiel que la communauté scolaire comprenne la réalité de la stigmatisation.",
    obligationPrompt: "Il faut que nous comprenions que la santé mentale est une priorité collective."
  },
  {
    id: 'demander',
    verb: 'Demander',
    category: '1er groupe régulier',
    tag: 'Ressources & Entraide',
    stemInfo: 'Radical régulier « demand- » avec les terminaisons subjonctives universelles.',
    conjugation: [
      { pr: 'que je / j’', form: 'demande', ending: '-e' },
      { pr: 'que tu', form: 'demandes', ending: '-es' },
      { pr: 'qu’il / elle / on', form: 'demande', ending: '-e' },
      { pr: 'que nous', form: 'demandions', ending: '-ions' },
      { pr: 'que vous', form: 'demandiez', ending: '-iez' },
      { pr: 'qu’ils / elles', form: 'demandent', ending: '-ent' }
    ],
    example: "Il faut que tu demandes de l'aide sans hésiter si la pression scolaire devient trop forte.",
    obligationPrompt: "Il est nécessaire que les élèves demandent des précisions en cas de doute."
  }
];

const OBLIGATION_QUIZ = [
  {
    id: 1,
    question: "Complétez la structure d'obligation : « Il est essentiel que nous _______ (FAIRE) des pauses régulières. »",
    options: ["faisons", "fassions", "faisions"],
    correct: "fassions",
    explanation: "Excellent ! Le verbe FAIRE a un radical irrégulier « fass- » au subjonctif : que nous fassions."
  },
  {
    id: 2,
    question: "Quelle forme convient après l'obligation ? « Il faut que chaque élève _______ (PRENDRE) soin de son équilibre. »",
    options: ["prend", "prenne", "prennes"],
    correct: "prenne",
    explanation: "Parfait ! Au subjonctif avec il/elle/on, le radical est « prenn- » avec la terminaison en -e : qu'il prenne."
  },
  {
    id: 3,
    question: "Complétez la recommandation de santé : « Il est indispensable qu'ils _______ (DORMIR) au moins 8 heures. »",
    options: ["dorment", "dormes", "dormions"],
    correct: "dorment",
    explanation: "Exact ! Le radical « dorm- » prend la terminaison universelle -ent : qu'ils dorment."
  }
];

export default function ObligationSubjonctifSection() {
  const [selectedVerbId, setSelectedVerbId] = useState('faire');
  const [activeStructure, setActiveStructure] = useState(OBLIGATION_STRUCTURES[0].expr);
  const [quizAnswers, setQuizAnswers] = useState({});

  const v = SUBJONCTIF_VERBS.find(x => x.id === selectedVerbId) || SUBJONCTIF_VERBS[0];
  const struct = OBLIGATION_STRUCTURES.find(s => s.expr === activeStructure) || OBLIGATION_STRUCTURES[0];

  const answer = (qId, option) => {
    if (quizAnswers[qId]) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: option }));
    if (option === OBLIGATION_QUIZ.find(q => q.id === qId).correct) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    }
  };

  return (
    <div className="u2g theme-indigo fade-in">
      <div className="u2g-hero">
        <span className="eyebrow">Unité 2 • Dossier 2 • Le Studio de Communication</span>
        <h2>Les structures d'obligation : Il faut que + subjonctif</h2>
        <p>Pour dire ce qui est nécessaire : « Il faut que tu prennes une pause. » Après ces expressions, le verbe est au <strong>subjonctif présent</strong>.</p>
      </div>

      <nav className="u2g-toc" aria-label="Sommaire">
        <a href="#obl-structures">1. Les expressions</a>
        <a href="#obl-formation">2. Former le subjonctif</a>
        <a href="#obl-tableau">3. Le tableau</a>
        <a href="#obl-verbes">4. Explore un verbe</a>
        <a href="#obl-quiz">5. Teste-toi</a>
      </nav>

      <section className="u2g-block" id="obl-structures">
        <h3 className="u2g-block-title"><span className="u2g-step">1</span> Les 5 expressions d'obligation</h3>
        <p className="u2g-lead">Clique sur une expression pour voir sa nuance.</p>
        <div className="u2g-chips">
          {OBLIGATION_STRUCTURES.map(s => (
            <button key={s.expr} type="button" className={`u2g-chip ${s.expr === activeStructure ? 'active' : ''}`} onClick={() => setActiveStructure(s.expr)}>
              <span className="v">{s.expr}</span>
              <span className="t">{s.translation}</span>
            </button>
          ))}
        </div>
        <div className="u2g-formula">
          <span className="k">{struct.expr}</span> + sujet + <span className="s">verbe au subjonctif</span>
          <small>Nuance : {struct.nuance}</small>
        </div>
      </section>

      <section className="u2g-block" id="obl-formation">
        <h3 className="u2g-block-title"><span className="u2g-step">2</span> Comment former le subjonctif ?</h3>
        <div className="u2g-rules">
          <div className="u2g-rule">
            <h4>1. Pars de « ils / elles »</h4>
            <p>Prends la forme au présent et enlève <strong>-ent</strong> : ils dorment → <strong>dorm-</strong>.</p>
          </div>
          <div className="u2g-rule">
            <h4>2. Ajoute les terminaisons</h4>
            <div className="u2g-ex">-e, -es, -e, -ions, -iez, -ent</div>
          </div>
          <div className="u2g-rule">
            <h4>3. Attention aux irréguliers</h4>
            <p><strong>Faire</strong> → fass- &nbsp;|&nbsp; <strong>Prendre</strong> → prenn- / pren-</p>
          </div>
        </div>
      </section>

      <section className="u2g-block" id="obl-tableau">
        <h3 className="u2g-block-title"><span className="u2g-step">3</span> Tableau récapitulatif des 8 verbes</h3>
        <p className="u2g-lead">Chaque forme est précédée de « que » (ou « qu' »).</p>
        <div className="u2g-table-wrap">
          <table className="u2g-table">
            <thead>
              <tr><th>Verbe</th><th>je</th><th>tu</th><th>il / elle</th><th>nous</th><th>vous</th><th>ils / elles</th></tr>
            </thead>
            <tbody>
              {SUBJONCTIF_VERBS.map(x => (
                <tr key={x.id}>
                  <td className="verb">{x.verb}</td>
                  {x.conjugation.map((c, i) => <td key={i}>{c.form}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="u2g-block" id="obl-verbes">
        <h3 className="u2g-block-title"><span className="u2g-step">4</span> Explore un verbe en détail</h3>
        <div className="u2g-chips">
          {SUBJONCTIF_VERBS.map(x => (
            <button key={x.id} type="button" className={`u2g-chip ${x.id === v.id ? 'active' : ''}`} onClick={() => setSelectedVerbId(x.id)}>
              <span className="v">{x.verb}</span>
              <span className="t">{x.tag}</span>
            </button>
          ))}
        </div>

        <div className="u2g-detail">
          <div className="u2g-detail-head">
            <h3>{v.verb}<span className="u2g-badge">{v.category}</span></h3>
            <button type="button" className="u2g-listen" onClick={() => speakFrench(v.example)}>
              <Volume2 size={16} /> Écouter l'exemple
            </button>
          </div>

          <div className="u2g-tip">⚙️ <strong>Radical :</strong> {v.stemInfo}</div>

          <div className="u2g-conj">
            {v.conjugation.map((c, i) => (
              <div key={i}>
                <div className="pr">{c.pr}</div>
                <div className="fm">{c.form}</div>
                <div className="en">{c.ending}</div>
              </div>
            ))}
          </div>

          <div className="u2g-examples">
            <div className="u2g-example info">
              <span className="lbl">Exemple</span>
              « {v.example} »
            </div>
            <div className="u2g-example info">
              <span className="lbl">Autre exemple</span>
              « {v.obligationPrompt} »
            </div>
          </div>
        </div>
      </section>

      <section className="u2g-block" id="obl-quiz">
        <h3 className="u2g-block-title"><span className="u2g-step">5</span> Teste-toi</h3>
        {OBLIGATION_QUIZ.map((q, idx) => {
          const sel = quizAnswers[q.id];
          const right = sel === q.correct;
          return (
            <div className="u2g-q" key={q.id}>
              <p>Question {idx + 1} : {q.question}</p>
              <div className="u2g-opts">
                {q.options.map((opt, i) => {
                  let cls = 'u2g-opt';
                  if (sel) {
                    if (opt === q.correct) cls += ' right';
                    else if (opt === sel) cls += ' wrong';
                  }
                  return <button key={i} type="button" className={cls} disabled={!!sel} onClick={() => answer(q.id, opt)}>{opt}</button>;
                })}
              </div>
              {sel && (
                <div className={`u2g-fb ${right ? 'right' : 'wrong'}`}>
                  {right ? `✔ ${q.explanation}` : `✘ Pas tout à fait. La bonne réponse est : « ${q.correct} ». ${q.explanation}`}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
