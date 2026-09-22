/**
 * MystereAuPasse.jsx
 * « Mystère au Passé » — Imparfait vs Passé Composé interactive writing activity
 *
 * Layout: [Left pull-tab toolbox] | [Main writing area]
 *   • 3 niveau tabs always visible on the left — click any to slide open its panel
 *   • Click the active tab again (or X) to close
 *   • No fixed/floating elements — fully in document flow
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
  { label: '⏱️ Pendant que...', phrase: 'Pendant que ',   color: 'chip-sky'     },
  { label: '⚡ Tout à coup,',    phrase: 'Tout à coup, ', color: 'chip-amber'   },
  { label: "⛅ C'était un jour où...", phrase: "C'était un jour où ", color: 'chip-blue' },
  { label: '💥 Soudainement,',  phrase: 'Soudainement, ', color: 'chip-rose'   },
  { label: "🔄 D'habitude,",    phrase: "D'habitude, ",   color: 'chip-violet'  },
  { label: '➔ Finalement,',    phrase: 'Finalement, ',    color: 'chip-emerald' },
];

// ── Toolbox tabs ───────────────────────────────────────────────────────────────
const TOOLBOX_TABS = [
  {
    id: 'niveau1', label: 'Niveau 1', sublabel: 'Guidé & Trad.', icon: BookOpen, color: 'ltab-sky',
    sections: [
      {
        heading: '🏔️ Décor & Habitude', subheading: 'Imparfait', color: 'ts-sky',
        items: [
          { fr: 'Il faisait beau / mauvais', en: 'It was nice / bad weather' },
          { fr: "J'étais en train de (+ infinitif)", en: 'I was in the middle of...' },
          { fr: 'Chaque jour / Tous les matins', en: 'Every day / Every morning' },
          { fr: 'Le ciel était couvert et il faisait froid.', en: 'The sky was overcast and cold.' },
          { fr: 'Je me promenais tranquillement quand...', en: 'I was walking calmly when...' },
        ],
      },
      {
        heading: '⚡ Actions Soudaines', subheading: 'Passé Composé', color: 'ts-amber',
        items: [
          { fr: "Tout d'un coup / Tout à coup", en: 'All of a sudden' },
          { fr: 'À ce moment-là', en: 'At that exact moment' },
          { fr: "Soudain, j'ai entendu / j'ai vu", en: 'Suddenly, I heard / I saw' },
          { fr: "Brusquement, quelque chose a changé.", en: 'Abruptly, something changed.' },
          { fr: "J'ai alors décidé de...", en: 'I then decided to...' },
        ],
      },
    ],
  },
  {
    id: 'niveau2', label: 'Niveau 2', sublabel: '100% Français', icon: Zap, color: 'ltab-indigo',
    sections: [
      {
        heading: '1. Poser le décor', subheading: 'Imparfait', color: 'ts-indigo',
        items: [
          { fr: 'Il était environ [heure] quand...' },
          { fr: 'Pendant que nous discutions,...' },
          { fr: 'Les gens semblaient calmes et insouciants.' },
          { fr: 'Le quartier était silencieux ce soir-là.' },
          { fr: "Je n'avais aucune raison de m'inquiéter." },
        ],
      },
      {
        heading: "2. L'interruption soudaine", subheading: 'Passé Composé', color: 'ts-amber',
        items: [
          { fr: 'Brusquement, un bruit étrange a retenti.' },
          { fr: "Sans avertissement, la porte s'est ouverte." },
          { fr: 'Aussitôt, nous avons compris que...' },
          { fr: 'Un cri a soudainement brisé le silence.' },
          { fr: "Quelqu'un a frappé fort à la fenêtre." },
        ],
      },
      {
        heading: '3. Conséquence & Résolution', subheading: 'Passé Composé', color: 'ts-emerald',
        items: [
          { fr: 'Alors, nous avons décidé de...' },
          { fr: "Après cet incident, nous sommes rentrés." },
          { fr: "Finalement, tout s'est éclairci lorsque..." },
          { fr: "Par conséquent, j'ai dû agir rapidement." },
        ],
      },
    ],
  },
  {
    id: 'niveau3', label: 'Niveau 3', sublabel: 'Autonomie', icon: Star, color: 'ltab-violet',
    sections: [
      {
        heading: "🌟 Formules complexes", subheading: "Enchaînement", color: 'ts-violet',
        items: [
          { fr: 'À peine avais-je commencé à [verbe] que [PC]...' },
          { fr: 'Tandis que la pluie tombait, [événement au PC]...' },
          { fr: "Ce qui ne devait être qu'une journée banale s'est transformé lorsque..." },
          { fr: "Sans que je m'en aperçoive, tout avait basculé." },
          { fr: "Jamais je n'aurais imaginé que cette journée allait..." },
        ],
      },
      {
        heading: '📌 Rappel syntaxique', subheading: 'Express', color: 'ts-slate',
        items: [
          { fr: 'Imparfait = Toile de fond', en: 'Background / ongoing state' },
          { fr: 'Passé Composé = Coup de théâtre', en: 'Completed action that advances the story' },
          { fr: 'PC avec AVOIR : Sujet + ai/as/a/avons/avez/ont + PP' },
          { fr: 'PC avec ÊTRE : Sujet + suis/es/est/... + PP (accordé !)' },
        ],
      },
    ],
  },
];

// ── Checklist ──────────────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { id:'cl1', label:'Description de la scène / météo / émotions',  badge:'Imparfait',               color:'badge-sky'   },
  { id:'cl2', label:'Action en cours',                               badge:'Pendant que + Imparfait', color:'badge-sky'   },
  { id:'cl3', label:'Événement déclencheur soudain',                 badge:'Tout à coup / PC',        color:'badge-amber' },
  { id:'cl4', label:'Réaction ou dénouement',                        badge:'Passé Composé',           color:'badge-amber' },
];

// ── Utils ──────────────────────────────────────────────────────────────────────
function countWords(t)     { return t.trim() === '' ? 0 : t.trim().split(/\s+/).length; }
function countSentences(t) { if (!t.trim()) return 0; const m = t.match(/[^.!?]*[.!?]+/g); return m ? m.length : 0; }

// ── Component ──────────────────────────────────────────────────────────────────
export default function MystereAuPasse() {
  const [text, setText]           = useState('');
  const [copied, setCopied]       = useState(false);
  const [checklist, setChecklist] = useState({ cl1:false, cl2:false, cl3:false, cl4:false });
  // null = closed, 'niveau1'/'niveau2'/'niveau3' = open with that tab active
  const [openTab, setOpenTab]     = useState(null);

  const textareaRef = useRef(null);

  const wordCount     = countWords(text);
  const sentenceCount = countSentences(text);
  const MIN_WORDS     = 60;
  const progressPct   = Math.min(100, Math.round((wordCount / MIN_WORDS) * 100));

  // Insert at textarea cursor
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
        <div className="map-level-tabs-strip" role="tablist" aria-label="Boîte à Outils — Niveaux">
          <div className="map-toolbox-label">🛠️ Boîte à Outils</div>
          {TOOLBOX_TABS.map(tab => {
            const Icon  = tab.icon;
            const isAct = openTab === tab.id;
            return (
              <button key={tab.id}
                type="button" role="tab"
                aria-selected={isAct}
                aria-controls={`map-panel-${tab.id}`}
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

        {/* Sliding panel — expands to the right of the strip */}
        <div
          id={openTab ? `map-panel-${openTab}` : undefined}
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
              <div className="map-unit-badge"><FileText size={12} />Unité 1 • Narration au Passé</div>
              <h2 className="map-title">Mystère au Passé — Raconter un événement inattendu</h2>
            </div>
            <div className="map-tense-legend">
              <span className="legend-pill legend-imp">🎥 Imparfait = Décor</span>
              <span className="legend-pill legend-pc">⚡ PC = Action</span>
            </div>
          </div>

          <div className="map-prompt-box">
            <span className="map-prompt-label">📝 Consigne :</span>
            <p className="map-prompt-text">
              « Imaginez une journée ordinaire où un événement totalement imprévu s'est produit.
              Racontez cette courte histoire <strong>(5 à 8 phrases)</strong>.
              Décrivez d'abord le contexte{' '}
              <span className="map-imp-hl">(imparfait)</span>, puis l'action soudaine{' '}
              <span className="map-pc-hl">(passé composé)</span>. »
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
              placeholder="« C'était un mardi après-midi ordinaire. Le soleil brillait et je marchais tranquillement quand soudain... »"
              autoCorrect="off" autoComplete="off" autoCapitalize="none" spellCheck="false"
              aria-label="Zone d'écriture narrative" />
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
              {wordCount > 150 && <><span className="map-stats-sep">•</span><span className="map-over-target">Excellent niveau de détail !</span></>}
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
