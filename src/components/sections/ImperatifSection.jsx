import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakFrench } from '../../utils/speechUtils';
import confetti from 'canvas-confetti';
import './Unit2Grammar.css';

const IMPERATIF_VERBS = [
  {
    id: 'gerer',
    verb: 'Gérer',
    category: '1er groupe (-er) • Chute du -s',
    tag: 'Stress & Émotions',
    ruleTip: 'À la 2e personne du singulier (tu), les verbes en -ER perdent le -s final ! On écrit « Gère ! » et NON « Gères ! ».',
    tu: { aff: 'Gère', neg: 'Ne gère pas' },
    nous: { aff: 'Gérons', neg: 'Ne gérons pas' },
    vous: { aff: 'Gérez', neg: 'Ne gérez pas' },
    exampleAff: 'Gère ton stress quotidien avec la respiration profonde et des pauses régulières.',
    exampleNeg: 'Ne gère pas cette anxiété tout seul : le soutien moral fait toute la différence.'
  },
  {
    id: 'sexprimer',
    verb: "S'exprimer",
    category: 'Pronominal • Place du pronom réfléchi',
    tag: 'Communication & Partage',
    ruleTip: "À l'affirmatif, le pronom se place après le verbe avec un trait d'union (« Exprime-toi ! »). Au négatif, il reprend sa place devant (« Ne t'exprime pas ! »).",
    tu: { aff: 'Exprime-toi', neg: "Ne t'exprime pas" },
    nous: { aff: 'Exprimons-nous', neg: 'Ne nous exprimons pas' },
    vous: { aff: 'Exprimez-vous', neg: 'Ne vous exprimez pas' },
    exampleAff: 'Exprime-toi avec confiance pour dissiper les mythes sur la santé mentale.',
    exampleNeg: "Ne t'exprime pas avec honte : reconnaître sa vulnérabilité est une force."
  },
  {
    id: 'prendre',
    verb: 'Prendre',
    category: '3e groupe (-re) • Maintien du -s',
    tag: 'Équilibre & Bien-Être',
    ruleTip: 'Les verbes du 3e groupe conservent leur -s régulier à la 2e personne du singulier : « Prends ! ».',
    tu: { aff: 'Prends', neg: 'Ne prends pas' },
    nous: { aff: 'Prenons', neg: 'Ne prenons pas' },
    vous: { aff: 'Prenez', neg: 'Ne prenez pas' },
    exampleAff: 'Prends une pause réparatrice lors de tes révisions pour retrouver ton équilibre.',
    exampleNeg: 'Ne prends pas à la légère les signes de fatigue intense ou de détresse.'
  },
  {
    id: 'seconfier',
    verb: 'Se confier',
    category: 'Pronominal en -er • Chute du -s & Pronom réfléchi',
    tag: 'Ressources & Soutien',
    ruleTip: 'Deux pièges combinés : chute du -s (« Confie ») ET pronom disjoint (« -toi ») à l\'affirmatif : « Confie-toi ! ».',
    tu: { aff: 'Confie-toi', neg: 'Ne te confie pas' },
    nous: { aff: 'Confions-nous', neg: 'Ne nous confions pas' },
    vous: { aff: 'Confiez-vous', neg: 'Ne vous confiez pas' },
    exampleAff: 'Confie-toi à un thérapeute, un conseiller ou un ami bienveillant pour ressentir un réel soulagement.',
    exampleNeg: 'Ne te confie pas à des personnes qui portent des jugements stigmatisants.'
  },
  {
    id: 'faire',
    verb: 'Faire',
    category: '3e groupe irrégulier • Forme « faites » à vous',
    tag: 'Action & Résilience',
    ruleTip: 'Attention à la 2e personne du pluriel (vous) : « Faites ! » (et non « faisez »). À tu : « Fais ! » avec un -s.',
    tu: { aff: 'Fais', neg: 'Ne fais pas' },
    nous: { aff: 'Faisons', neg: 'Ne faisons pas' },
    vous: { aff: 'Faites', neg: 'Ne faites pas' },
    exampleAff: "Fais de l'exercice physique régulièrement pour évacuer les tensions musculaires.",
    exampleNeg: "Ne fais pas semblant d'être épanoui(e) quand tu traverses une crise d'angoisse."
  },
  {
    id: 'dormir',
    verb: 'Dormir',
    category: '3e groupe (-ir) • Maintien du -s',
    tag: 'Sommeil & Récupération',
    ruleTip: 'Le verbe dormir conserve le -s au singulier : « Dors ! ». Indispensable pour la récupération psychologique.',
    tu: { aff: 'Dors', neg: 'Ne dors pas' },
    nous: { aff: 'Dormons', neg: 'Ne dormons pas' },
    vous: { aff: 'Dormez', neg: 'Ne dormez pas' },
    exampleAff: 'Dors entre 8 et 9 heures par nuit pour restaurer ton humeur et ton bien-être.',
    exampleNeg: 'Ne dors pas avec des écrans allumés dans ta chambre.'
  },
  {
    id: 'comprendre',
    verb: 'Comprendre',
    category: '3e groupe • Maintien du -s',
    tag: 'Empathie & Bienveillance',
    ruleTip: 'Comme tous les composés de prendre : « Comprends ! » prend un -s à tu.',
    tu: { aff: 'Comprends', neg: 'Ne comprends pas' },
    nous: { aff: 'Comprenons', neg: 'Ne comprenons pas' },
    vous: { aff: 'Comprenez', neg: 'Ne comprenez pas' },
    exampleAff: 'Comprends que la santé mentale concerne tout le monde sans exception.',
    exampleNeg: "Ne comprends pas une demande d'aide comme un signe de faiblesse."
  },
  {
    id: 'demander',
    verb: 'Demander',
    category: '1er groupe (-er) • Chute du -s',
    tag: 'Recherche de Soutien',
    ruleTip: 'Verbe en -ER : pas de -s à tu ! « Demande ! ». À appliquer dès que la pression devient trop lourde.',
    tu: { aff: 'Demande', neg: 'Ne demande pas' },
    nous: { aff: 'Demandons', neg: 'Ne demandons pas' },
    vous: { aff: 'Demandez', neg: 'Ne demandez pas' },
    exampleAff: "Demande de l'aide immédiatement dès que la pression scolaire te submerge.",
    exampleNeg: "Ne demande pas l'impossible à ton organisme sans lui accorder de repos."
  }
];

const IMPERATIF_QUIZ = [
  {
    id: 1,
    question: "Pour conseiller un camarade submergé par le stress, quelle est la forme correcte du verbe GÉRER à la 2e personne (tu) ?",
    options: ["Gères ton stress !", "Gère ton stress !", "Tu gères ton stress !"],
    correct: "Gère ton stress !",
    explanation: "Bravo ! Les verbes en -ER perdent leur -s final à la 2e personne du singulier de l'impératif (« Gère ! »)."
  },
  {
    id: 2,
    question: "Quelle est la forme affirmative correcte du verbe pronominal S'EXPRIMER à l'impératif (tu) ?",
    options: ["Exprime-toi !", "T'exprime !", "Exprime te !"],
    correct: "Exprime-toi !",
    explanation: "Exactement ! À l'impératif affirmatif, le pronom se place après le verbe avec un trait d'union et « te » devient « toi »."
  },
  {
    id: 3,
    question: "Quelle est la forme négative correcte pour SE CONFIER avec la 2e personne du singulier ?",
    options: ["Ne confie-toi pas !", "Ne te confie pas !", "Ne te confies pas !"],
    correct: "Ne te confie pas !",
    explanation: "Parfait ! À la forme négative, le pronom réfléchi reprend sa place avant le verbe (« Ne te confie pas ! » sans -s à confie)."
  }
];

export default function ImperatifSection() {
  const [selectedVerbId, setSelectedVerbId] = useState('gerer');
  const [mode, setMode] = useState('both'); // 'aff' | 'neg' | 'both'
  const [quizAnswers, setQuizAnswers] = useState({});

  const v = IMPERATIF_VERBS.find(x => x.id === selectedVerbId) || IMPERATIF_VERBS[0];

  const answer = (qId, option) => {
    if (quizAnswers[qId]) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: option }));
    if (option === IMPERATIF_QUIZ.find(q => q.id === qId).correct) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    }
  };

  const forms = [
    { who: 'Tu', key: 'tu' },
    { who: 'Nous', key: 'nous' },
    { who: 'Vous', key: 'vous' }
  ];

  return (
    <div className="u2g fade-in">
      <div className="u2g-hero">
        <span className="eyebrow">Unité 2 • Dossier 2 • Le Studio de Communication</span>
        <h2>L'Impératif (affirmatif et négatif)</h2>
        <p>Donne des conseils clairs à tes amis : « Prends une pause ! », « Ne te confie pas à n'importe qui ! ». Suis les 4 étapes ci-dessous.</p>
      </div>

      <nav className="u2g-toc" aria-label="Sommaire">
        <a href="#imp-regles">1. Les règles</a>
        <a href="#imp-tableau">2. Le tableau</a>
        <a href="#imp-verbes">3. Explore un verbe</a>
        <a href="#imp-quiz">4. Teste-toi</a>
      </nav>

      <section className="u2g-block" id="imp-regles">
        <h3 className="u2g-block-title"><span className="u2g-step">1</span> Les 3 règles à retenir</h3>
        <div className="u2g-rules">
          <div className="u2g-rule">
            <h4>Pas de sujet, 3 personnes</h4>
            <p>On utilise seulement <strong>tu</strong>, <strong>nous</strong> et <strong>vous</strong>. On n'écrit pas le pronom sujet.</p>
            <div className="u2g-ex"><span className="ok">✔</span> Prends une pause !</div>
          </div>
          <div className="u2g-rule">
            <h4>Verbes en -ER : pas de -s à « tu »</h4>
            <p>Au présent : tu gères → à l'impératif : <strong>gère</strong>.</p>
            <div className="u2g-ex"><span className="ok">✔</span> Gère ton stress ! &nbsp; <span className="bad">✘ Gères</span></div>
          </div>
          <div className="u2g-rule">
            <h4>Verbes pronominaux</h4>
            <p>Affirmatif : le pronom vient <strong>après</strong> (-toi). Négatif : il reste <strong>avant</strong> (te).</p>
            <div className="u2g-ex">
              <span className="ok">✔</span> Exprime-toi !<br />
              <span className="bad">✘</span> Ne t'exprime pas !
            </div>
          </div>
        </div>
      </section>

      <section className="u2g-block" id="imp-tableau">
        <h3 className="u2g-block-title"><span className="u2g-step">2</span> Tableau récapitulatif des 8 verbes</h3>
        <p className="u2g-lead">Garde ce tableau à portée de main pendant tes exercices. Vert = affirmatif, rouge = négatif.</p>
        <div className="u2g-table-wrap">
          <table className="u2g-table">
            <thead>
              <tr><th>Verbe</th><th>Tu</th><th>Nous</th><th>Vous</th></tr>
            </thead>
            <tbody>
              {IMPERATIF_VERBS.map(x => (
                <tr key={x.id}>
                  <td className="verb">{x.verb}</td>
                  {forms.map(f => (
                    <td key={f.key}>
                      <div className="aff">{x[f.key].aff} !</div>
                      <div className="neg">{x[f.key].neg} !</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="u2g-block" id="imp-verbes">
        <h3 className="u2g-block-title"><span className="u2g-step">3</span> Explore un verbe en détail</h3>
        <p className="u2g-lead">Clique sur un verbe pour voir ses formes, une astuce et des exemples avec le vocabulaire de l'unité.</p>

        <div className="u2g-chips">
          {IMPERATIF_VERBS.map(x => (
            <button key={x.id} type="button" className={`u2g-chip ${x.id === v.id ? 'active' : ''}`} onClick={() => setSelectedVerbId(x.id)}>
              <span className="v">{x.verb}</span>
              <span className="t">{x.tag}</span>
            </button>
          ))}
        </div>

        <div className="u2g-detail">
          <div className="u2g-detail-head">
            <div>
              <h3>{v.verb}<span className="u2g-badge">{v.category}</span></h3>
            </div>
            <button type="button" className="u2g-listen" onClick={() => speakFrench(v.exampleAff)}>
              <Volume2 size={16} /> Écouter l'exemple
            </button>
          </div>

          <div className="u2g-tip">💡 <strong>Astuce :</strong> {v.ruleTip}</div>

          <div className="u2g-toggle" role="group" aria-label="Choisir la forme">
            <button type="button" className={mode === 'both' ? 'active' : ''} onClick={() => setMode('both')}>Les deux</button>
            <button type="button" className={mode === 'aff' ? 'active' : ''} onClick={() => setMode('aff')}>Affirmatif</button>
            <button type="button" className={mode === 'neg' ? 'active' : ''} onClick={() => setMode('neg')}>Négatif</button>
          </div>

          <div className="u2g-forms">
            {forms.map(f => (
              <div className="u2g-form" key={f.key}>
                <div className="who">{f.who}</div>
                {(mode === 'both' || mode === 'aff') && (
                  <div className="row"><span>Affirmatif</span><span className="aff">{v[f.key].aff} !</span></div>
                )}
                {(mode === 'both' || mode === 'neg') && (
                  <div className="row"><span>Négatif</span><span className="neg">{v[f.key].neg} !</span></div>
                )}
              </div>
            ))}
          </div>

          <div className="u2g-examples">
            <div className="u2g-example pos">
              <span className="lbl">✔ Conseil (affirmatif)</span>
              « {v.exampleAff} »
            </div>
            <div className="u2g-example neg">
              <span className="lbl">✘ Mise en garde (négatif)</span>
              « {v.exampleNeg} »
            </div>
          </div>
        </div>
      </section>

      <section className="u2g-block" id="imp-quiz">
        <h3 className="u2g-block-title"><span className="u2g-step">4</span> Teste-toi</h3>
        {IMPERATIF_QUIZ.map((q, idx) => {
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
