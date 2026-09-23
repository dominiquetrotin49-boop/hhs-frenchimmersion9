/**
 * AtelierEcritureReprise.jsx
 * « Atelier d'Écriture : Verbes au Présent & Prépositions » — Reprise Writing Activity
 *
 * Exact clone of MystereAuPasse.jsx layout:
 *   • 3-tab left sliding Boîte à Outils covering the 6 Reprise grammar dossiers
 *   • Right: Badge, Title, Grammar pills, Consigne, 4-item Checklist, Writing card
 *   • Quick-insert chips for key sentence starters
 *   • Live word/sentence counter, progress bar, accent toolbars, Copy/Reset action bar
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  X, Copy, RefreshCw, Check, BookOpen, Zap, Star, FileText, ChevronRight,
} from 'lucide-react';
import './MystereAuPasse.css';

// ── Accents ────────────────────────────────────────────────────────────────────
const LOWER_ACCENTS = ['é','è','ê','ë','à','â','ù','û','î','ï','ô','ç','œ'];
const UPPER_ACCENTS = ['É','È','Ê','Ë','À','Â','Ù','Û','Î','Ï','Ô','Ç','Œ'];

// ── Quick chips ────────────────────────────────────────────────────────────────
const QUICK_CHIPS = [
  { label: '📍 Je vais à...', phrase: 'Je vais à ', color: 'chip-sky' },
  { label: '🏠 Je suis chez...', phrase: 'Je suis chez ', color: 'chip-blue' },
  { label: '📚 Je dois...', phrase: 'Je dois ', color: 'chip-amber' },
  { label: '🎒 Je fais...', phrase: 'Je fais ', color: 'chip-rose' },
  { label: '💬 Je veux...', phrase: 'Je veux ', color: 'chip-violet' },
  { label: '➔ Ensuite,', phrase: 'Ensuite, ', color: 'chip-emerald' },
];

// ── Toolbox tabs — 3 drawers covering the 6 Reprise grammar dossiers ──────────
const TOOLBOX_TABS = [
  {
    id: 'prepositions',
    label: 'Prép.',
    sublabel: 'Lieu & Position',
    icon: BookOpen,
    color: 'ltab-sky',
    sections: [
      {
        heading: '📍 Lieu & Destination',
        subheading: 'à / au / aux / en / chez / dans',
        color: 'ts-sky',
        items: [
          { fr: 'Je vais à Paris / à Montréal.', en: 'I go to Paris / to Montreal.' },
          { fr: 'Nous allons au Canada / aux États-Unis.', en: 'We go to Canada / to the USA.' },
          { fr: 'Elle habite en France / en Italie.', en: 'She lives in France / in Italy.' },
          { fr: 'Il se rend chez le médecin / chez moi.', en: 'He goes to the doctor\'s / to my place.' },
          { fr: 'Ils rangent leurs livres dans leur casier.', en: 'They put their books in their locker.' },
        ],
      },
      {
        heading: '📌 Position Spatiale',
        subheading: 'sur / sous / devant / derrière / entre',
        color: 'ts-indigo',
        items: [
          { fr: 'Le stylo est sur la table.', en: 'The pen is on the table.' },
          { fr: 'Le sac est sous la chaise.', en: 'The bag is under the chair.' },
          { fr: 'Je t\'attends devant l\'école.', en: 'I wait for you in front of the school.' },
          { fr: 'La cour est derrière le bâtiment.', en: 'The yard is behind the building.' },
          { fr: 'Je suis assis entre Paul et Marc.', en: 'I am sitting between Paul and Marc.' },
        ],
      },
      {
        heading: '🔗 Relation & Moyen',
        subheading: 'de / avec / sans / par / pour',
        color: 'ts-emerald',
        items: [
          { fr: 'Je viens de Montréal. C\'est le cahier de Sami.', en: 'I come from Montreal. It\'s Sami\'s notebook.' },
          { fr: 'Je sors avec mes amis le week-end.', en: 'I go out with my friends on weekends.' },
          { fr: 'Il est venu sans son cahier de notes.', en: 'He came without his notebook.' },
          { fr: 'Elle m\'a contacté par courriel / par texto.', en: 'She contacted me by email / by text.' },
          { fr: 'J\'étudie pour réussir mes examens.', en: 'I study to pass my exams.' },
        ],
      },
    ],
  },
  {
    id: 'verbes_essentiels',
    label: 'Être / Avoir',
    sublabel: 'Présent Essentiel',
    icon: Zap,
    color: 'ltab-indigo',
    sections: [
      {
        heading: '1. Être & Avoir — Les Piliers',
        subheading: 'Présent de l\'Indicatif',
        color: 'ts-sky',
        items: [
          { fr: 'Je suis / Tu es / Il-Elle est étudiant(e).', en: 'I am / You are / He-She is a student.' },
          { fr: 'Nous sommes / Vous êtes / Ils sont prêts.', en: 'We are / You are / They are ready.' },
          { fr: 'J\'ai / Tu as / Il a quatorze ans.', en: 'I have / You have / He has 14 years old.' },
          { fr: 'Nous avons / Vous avez / Ils ont hâte.', en: 'We / You / They are eager (have haste).' },
          { fr: 'J\'ai faim. Tu as soif. Elle a raison.', en: 'I\'m hungry. You\'re thirsty. She\'s right.' },
        ],
      },
      {
        heading: '2. Aller, Faire, Venir & Prendre',
        subheading: 'Verbes Irréguliers Clés',
        color: 'ts-amber',
        items: [
          { fr: 'Je vais / Tu vas / Il va au lycée.', en: 'I go / You go / He goes to school.' },
          { fr: 'Nous allons / Vous allez / Ils vont en ville.', en: 'We / You / They go downtown.' },
          { fr: 'Je fais / Tu fais / Il fait ses devoirs.', en: 'I do / You do / He does homework.' },
          { fr: 'Vous faites / Ils font du sport après les cours.', en: 'You / They play sports after school.' },
          { fr: 'Je viens de finir. Je prends le bus à 7h.', en: 'I just finished. I take the bus at 7.' },
        ],
      },
      {
        heading: '3. Pouvoir, Vouloir, Devoir & Savoir',
        subheading: 'Verbes Modaux',
        color: 'ts-emerald',
        items: [
          { fr: 'Je peux / Tu peux sortir si tu finis tes devoirs.', en: 'I can / You can go out if you finish.' },
          { fr: 'Il peut / Nous pouvons travailler en équipe.', en: 'He can / We can work as a team.' },
          { fr: 'Je veux / Tu veux / Ils veulent participer.', en: 'I want / You want / They want to join.' },
          { fr: 'Je dois / Tu dois / Nous devons étudier.', en: 'I must / You must / We must study.' },
          { fr: 'Je sais / Tu sais conjuguer les verbes.', en: 'I know / You know how to conjugate verbs.' },
        ],
      },
    ],
  },
  {
    id: 'modeles_phrases',
    label: 'Modèles',
    sublabel: 'Phrases Complètes',
    icon: Star,
    color: 'ltab-violet',
    sections: [
      {
        heading: '🌟 Structures Complètes à Modeler',
        subheading: 'Autonomie Guidée',
        color: 'ts-violet',
        items: [
          { fr: 'D\'habitude, après les cours, je vais chez [ami/e] pour faire mes devoirs.' },
          { fr: 'Le week-end, nous voulons faire du sport avec nos amis au parc.' },
          { fr: 'Je dois prendre le bus à 7h30 pour aller à l\'école en ville.' },
          { fr: 'Elle sait parler français et elle peut aider ses camarades sans hésiter.' },
          { fr: 'En hiver, ma famille va au Canada pour skier dans les montagnes.' },
        ],
      },
      {
        heading: '📌 Rappels Grammaticaux',
        subheading: 'Express — à mémoriser',
        color: 'ts-slate',
        items: [
          { fr: 'Pays féminin → en (en France, en Italie, en Espagne)', en: 'Feminine country → en' },
          { fr: 'Pays masculin → au (au Canada, au Japon, au Mexique)', en: 'Masculine country → au' },
          { fr: 'Pays pluriel → aux (aux États-Unis, aux Antilles)', en: 'Plural country → aux' },
          { fr: 'Verbe modal + INFINITIF : Je veux partir. Je dois étudier.', en: 'Modal verb + infinitive' },
          { fr: 'Avoir pour l\'âge : J\'ai 15 ans. (NOT Je suis 15 ans.)', en: 'Use avoir for age, not être' },
        ],
      },
    ],
  },
];

// ── Checklist ──────────────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { id: 'cl1', label: 'Au moins 2 verbes au présent (être, avoir, aller...)',    badge: 'Verbes Présent',   color: 'badge-sky'   },
  { id: 'cl2', label: 'Au moins 1 préposition de lieu ou destination',           badge: 'à / en / chez',    color: 'badge-sky'   },
  { id: 'cl3', label: 'Au moins 1 préposition de relation ou moyen',             badge: 'avec / pour / de', color: 'badge-amber' },
  { id: 'cl4', label: 'Les phrases sont logiques et bien reliées',               badge: 'Cohérence',        color: 'badge-amber' },
];

// ── Utils ──────────────────────────────────────────────────────────────────────
function countWords(t)     { return t.trim() === '' ? 0 : t.trim().split(/\s+/).length; }
function countSentences(t) { if (!t.trim()) return 0; const m = t.match(/[^.!?]*[.!?]+/g); return m ? m.length : 0; }

// ── Component ──────────────────────────────────────────────────────────────────
export default function AtelierEcritureReprise() {
  const [text, setText]           = useState('');
  const [copied, setCopied]       = useState(false);
  const [checklist, setChecklist] = useState({ cl1:false, cl2:false, cl3:false, cl4:false });
  const [openTab, setOpenTab]     = useState(null);

  const textareaRef = useRef(null);

  const wordCount     = countWords(text);
  const sentenceCount = countSentences(text);
  const MIN_WORDS     = 50;
  const progressPct   = Math.min(100, Math.round((wordCount / MIN_WORDS) * 100));

  const insertAtCursor = useCallback((phrase) => {
    const el = textareaRef.current;
    if (!el) { setText(prev => prev + phrase); return; }
    const start = el.selectionStart ?? text.length;
    const end   = el.selectionEnd   ?? text.length;
    const before = text.slice(0, start);
    const after  = text.slice(end);
    const needsSpace = before.length > 0 && !/\s$/.test(before);
    const insert = (needsSpace ? ' ' : '') + phrase;
    setText(before + insert + after);
    setTimeout(() => { el.focus(); const p = start + insert.length; el.setSelectionRange(p, p); }, 0);
  }, [text]);

  const handleAccentClick = useCallback((char) => insertAtCursor(char), [insertAtCursor]);

  const handleCopy = async () => {
    if (!text.trim()) return;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch {}
  };

  const handleReset = () => {
    setText('');
    setChecklist({ cl1:false, cl2:false, cl3:false, cl4:false });
    textareaRef.current?.focus();
  };

  const toggleCheck = (id) => setChecklist(prev => ({ ...prev, [id]: !prev[id] }));

  const handleTabClick = (tabId) => {
    setOpenTab(prev => (prev === tabId ? null : tabId));
  };

  const activeTabData = TOOLBOX_TABS.find(t => t.id === openTab);

  return (
    <div className="map-outer-wrapper fade-in">

      {/* ══ LEFT: TOOLBOX STRIP + SLIDING PANEL ══════════════════════════ */}
      <div className="map-toolbox-area">

        {/* Vertical tab strip — always visible */}
        <div className="map-level-tabs-strip" role="tablist" aria-label="Boîte à Outils — Grammaire">
          <div className="map-toolbox-label">🛠️ Boîte à Outils</div>
          {TOOLBOX_TABS.map(tab => {
            const Icon  = tab.icon;
            const isAct = openTab === tab.id;
            return (
              <button key={tab.id}
                type="button" role="tab"
                aria-selected={isAct}
                aria-controls={`aer-panel-${tab.id}`}
                className={`map-level-tab ${tab.color} ${isAct ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                title={`${tab.label} — ${tab.sublabel}`}
              >
                <Icon size={14} />
                <span className="ltab-main">{tab.label}</span>
                <span className="ltab-sub">{tab.sublabel}</span>
                <ChevronRight size={11} className={`ltab-arrow ${isAct ? 'rotated' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Sliding panel */}
        <div
          id={openTab ? `aer-panel-${openTab}` : undefined}
          className={`map-toolbox-panel ${openTab ? 'open' : ''}`}
          role="tabpanel"
          aria-label={activeTabData ? `${activeTabData.label} — ${activeTabData.sublabel}` : 'Boîte à Outils'}
        >
          <div className="map-toolbox-panel-inner">
            {activeTabData && (
              <>
                <div className="mtp-header">
                  <div>
                    <span className="mtp-title">{activeTabData.label}</span>
                    <span className="mtp-sub">{activeTabData.sublabel}</span>
                  </div>
                  <button type="button" className="mtp-close" onClick={() => setOpenTab(null)} aria-label="Fermer">
                    <X size={13} />
                  </button>
                </div>

                <p className="mtp-hint">Cliquez une phrase → elle s'insère au curseur.</p>

                <div className="mtp-sections">
                  {activeTabData.sections.map((section, sIdx) => (
                    <div key={sIdx} className={`mtp-section ${section.color}`}>
                      <div className="mtp-section-head">
                        <span className="mtp-section-title">{section.heading}</span>
                        <span className="mtp-section-sub">{section.subheading}</span>
                      </div>
                      <ul className="mtp-items">
                        {section.items.map((item, iIdx) => (
                          <li key={iIdx}>
                            <button
                              type="button"
                              className="mtp-item-btn"
                              onClick={() => insertAtCursor(item.fr + ' ')}
                              title={`Insérer : ${item.fr}`}
                            >
                              <span className="mtp-fr">{item.fr}</span>
                              {item.en && <span className="mtp-en">— {item.en}</span>}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══ RIGHT: MAIN WRITING CONTENT ══════════════════════════════════ */}
      <div className="map-main-content">

        {/* Header card */}
        <div className="map-header-card">
          <div className="map-header-top">
            <div>
              <div className="map-unit-badge"><FileText size={12} />La Rentrée • Grammaire au Présent</div>
              <h2 className="map-title">Atelier d'Écriture — Verbes au Présent & Prépositions</h2>
            </div>
            <div className="map-tense-legend">
              <span className="legend-pill legend-imp">🔵 Verbes au Présent</span>
              <span className="legend-pill legend-pc">📍 Prépositions</span>
            </div>
          </div>

          <div className="map-prompt-box">
            <span className="map-prompt-label">📝 Consigne :</span>
            <p className="map-prompt-text">
              « Décrivez votre routine scolaire quotidienne ou un moment typique de votre vie d'élève.
              Rédigez <strong>5 à 8 phrases</strong> en utilisant{' '}
              <span className="map-imp-hl">des verbes au présent</span> (être, avoir, aller, faire, vouloir, devoir…)
              et <span className="map-pc-hl">des prépositions</span> pour indiquer les lieux, les destinations et les relations
              (à, en, chez, dans, avec, pour, sans…). »
            </p>
          </div>

          <div className="map-checklist">
            <span className="map-checklist-title">✅ Liste de vérification :</span>
            <div className="map-checklist-grid">
              {CHECKLIST_ITEMS.map(item => (
                <button key={item.id} type="button" onClick={() => toggleCheck(item.id)}
                  className={`map-check-item ${checklist[item.id] ? 'checked' : ''}`}
                  aria-pressed={checklist[item.id]}>
                  <span className={`map-check-box ${checklist[item.id] ? 'checked' : ''}`}>
                    {checklist[item.id] && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className="map-check-label">{item.label}</span>
                  <span className={`map-check-badge ${item.color}`}>{item.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Writing card */}
        <div className="map-writing-card">

          {/* Quick chips */}
          <div className="map-chips-row">
            <span className="map-chips-label">Insérer :</span>
            {QUICK_CHIPS.map(chip => (
              <button key={chip.label} type="button" onClick={() => insertAtCursor(chip.phrase)}
                className={`map-chip ${chip.color}`} title={`Insérer « ${chip.phrase.trim()} »`}>
                {chip.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div className="map-textarea-wrapper">
            <textarea ref={textareaRef} value={text} onChange={e => setText(e.target.value)}
              className="map-textarea" rows={9}
              placeholder="« Chaque matin, je prends le bus à 7h30 pour aller au lycée. Je suis en 9e année et j'ai cours de français à 8h. D'habitude, je mange à la cafétéria avec mes amis. Après les cours, je vais chez mon ami Sami pour faire nos devoirs ensemble... »"
              autoCorrect="off" autoComplete="off" autoCapitalize="none" spellCheck="false"
              aria-label="Zone d'écriture en français" />
            <span className="map-char-hint">
              {wordCount} mot{wordCount !== 1 ? 's' : ''} • {sentenceCount} phrase{sentenceCount !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Progress bar */}
          <div className="map-progress-row">
            <span className="map-progress-label">Objectif : {wordCount} / {MIN_WORDS} mots min.</span>
            <div className="map-progress-track" role="progressbar" aria-valuenow={wordCount} aria-valuemin={0} aria-valuemax={MIN_WORDS}>
              <div className={`map-progress-fill ${wordCount >= MIN_WORDS ? 'done' : ''}`} style={{ width: `${progressPct}%` }} />
            </div>
            {wordCount >= MIN_WORDS && <span className="map-progress-done">✨ Objectif atteint !</span>}
          </div>

          {/* Accent toolbars */}
          <div className="map-accent-section">
            <div className="map-accent-row">
              <span className="map-accent-label">Accents min. :</span>
              {LOWER_ACCENTS.map(char => (
                <button key={char} type="button" onMouseDown={e => e.preventDefault()}
                  onClick={() => handleAccentClick(char)} className="map-accent-btn">{char}</button>
              ))}
            </div>
            <div className="map-accent-row">
              <span className="map-accent-label">Accents maj. :</span>
              {UPPER_ACCENTS.map(char => (
                <button key={char} type="button" onMouseDown={e => e.preventDefault()}
                  onClick={() => handleAccentClick(char)} className="map-accent-btn map-accent-btn--upper">{char}</button>
              ))}
            </div>
          </div>

          {/* Action bar */}
          <div className="map-action-bar">
            <div className="map-stats-pill">
              <span>{wordCount} mot{wordCount !== 1 ? 's' : ''}</span>
              <span className="map-stats-sep">•</span>
              <span>{sentenceCount} phrase{sentenceCount !== 1 ? 's' : ''}</span>
              {wordCount > 100 && <><span className="map-stats-sep">•</span><span className="map-over-target">Excellent niveau de détail !</span></>}
            </div>
            <div className="map-action-btns">
              <button type="button" onClick={handleReset} className="map-btn map-btn--ghost" disabled={!text.trim()}>
                <RefreshCw size={14} />Recommencer
              </button>
              <button type="button" onClick={handleCopy} className={`map-btn ${copied ? 'map-btn--success' : 'map-btn--primary'}`} disabled={!text.trim()}>
                {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copié !' : 'Copier mon texte'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
