/**
 * SauvetageEnImage.jsx
 * « Sauvetage au Sommet : Spider-Man & Superman » — Image-based narrative writing activity
 *
 * Full-width hero artwork placed prominently at the top so the entire dramatic scene
 * is showcased with crystal clarity. Followed by the exact dual-column interactive structure:
 *   • [LEFT]: 3-tab sliding drawer toolbox (Niveau 1, Niveau 2, Niveau 3) for scaffolded sentence insertion.
 *   • [RIGHT]:
 *       - Consigne box with grammar pills.
 *       - Interactive 4-item checklist with dual columns.
 *       - Writing card with horizontal quick-insert chips.
 *       - Textarea with word & sentence counter.
 *       - Progress bar with target words.
 *       - Dual French accent toolbars.
 *       - Action bar (Stats pill, Recommencer, Copier mon texte).
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  X, Copy, RefreshCw, Check, BookOpen, Zap, Star, FileText, ChevronRight, Maximize2
} from 'lucide-react';
import './MystereAuPasse.css';

// ── Accents ────────────────────────────────────────────────────────────────────
const LOWER_ACCENTS = ['é','è','ê','ë','à','â','ù','û','î','ï','ô','ç','œ'];
const UPPER_ACCENTS = ['É','È','Ê','Ë','À','Â','Ù','Û','Î','Ï','Ô','Ç','Œ'];

// ── Quick chips ────────────────────────────────────────────────────────────────
const QUICK_CHIPS = [
  { label: '🏙️ Au crépuscule,', phrase: 'Au crépuscule, ', color: 'chip-sky' },
  { label: '⚡ Tout à coup,', phrase: 'Tout à coup, ', color: 'chip-amber' },
  { label: '🦸‍♂️ Superman a surgi et...', phrase: 'Superman a surgi et ', color: 'chip-blue' },
  { label: '🕷️ Pendant ce temps, Spider-Man...', phrase: 'Pendant ce temps, Spider-Man ', color: 'chip-rose' },
  { label: '🕊️ Elle tremblait de peur, mais...', phrase: 'Elle tremblait de peur, mais ', color: 'chip-violet' },
  { label: '➔ Finalement,', phrase: 'Finalement, ', color: 'chip-emerald' },
];

// ── Toolbox tabs (exact structure of MystereAuPasse) ───────────────────────────
const TOOLBOX_TABS = [
  {
    id: 'niveau1',
    label: 'Niveau 1',
    sublabel: 'Guidé & Trad.',
    icon: BookOpen,
    color: 'ltab-sky',
    sections: [
      {
        heading: '🌇 Décor & Atmosphère',
        subheading: 'Imparfait',
        color: 'ts-sky',
        items: [
          { fr: 'Le soleil se couchait sur les gratte-ciels.', en: 'The sun was setting on the skyscrapers.' },
          { fr: 'Le vent soufflait doucement sur la ville.', en: 'The wind was blowing softly over the city.' },
          { fr: 'Spider-Man surveillait les rues du haut de sa gargouille.', en: 'Spider-Man was watching the streets from atop his gargoyle.' },
          { fr: 'La jeune femme avait très peur mais se sentait soulagée.', en: 'The young woman was very scared but felt relieved.' },
          { fr: 'Les lumières de la métropole commençaient à briller.', en: 'The city lights were starting to glow.' },
        ],
      },
      {
        heading: '⚡ Sauvetage Soudain',
        subheading: 'Passé Composé',
        color: 'ts-amber',
        items: [
          { fr: "Tout à coup, un accident terrifiant s'est produit.", en: 'Suddenly, a terrifying accident occurred.' },
          { fr: "Superman a volé à la vitesse de l'éclair.", en: 'Superman flew at lightning speed.' },
          { fr: 'Il a rattrapé la jeune femme dans le vide.', en: 'He caught the young woman in mid-air.' },
          { fr: 'Spider-Man a lancé sa toile pour sécuriser la zone.', en: 'Spider-Man shot his web to secure the area.' },
          { fr: 'Les deux héros ont sauvé la situation avec brio.', en: 'The two heroes brilliantly saved the day.' },
        ],
      },
    ],
  },
  {
    id: 'niveau2',
    label: 'Niveau 2',
    sublabel: '100% Français',
    icon: Zap,
    color: 'ltab-indigo',
    sections: [
      {
        heading: '1. Poser le décor héroïque',
        subheading: 'Imparfait',
        color: 'ts-indigo',
        items: [
          { fr: 'Tandis que la brume dorée enveloppait les gratte-ciels...' },
          { fr: 'Le héros volant flottait en apesanteur au-dessus de la ville.' },
          { fr: 'Spider-Man scrutait chaque ruelle avec attention.' },
          { fr: 'Son cœur battait à tout rompre après avoir échappé au danger.' },
          { fr: "La métropole semblait paisible avant l'incident." },
        ],
      },
      {
        heading: "2. L'intervention soudaine",
        subheading: 'Passé Composé',
        color: 'ts-amber',
        items: [
          { fr: 'Brusquement, une explosion a secoué les derniers étages.' },
          { fr: "En une fraction de seconde, Superman l'a soulevée dans ses bras." },
          { fr: "D'un bond acrobatique, Spider-Man a rejoint le rebord." },
          { fr: 'Aussitôt, les deux justiciers ont coordonné leurs efforts.' },
          { fr: 'Un immense soupir de soulagement a retenti.' },
        ],
      },
      {
        heading: '3. Résolution & Conséquence',
        subheading: 'Passé Composé',
        color: 'ts-emerald',
        items: [
          { fr: 'Alors, Superman a déposé la rescapée en lieu sûr.' },
          { fr: 'Grâce à leur alliance, la catastrophe a été évitée.' },
          { fr: 'Finalement, la foule émerveillée a applaudi les deux héros.' },
          { fr: 'Dès lors, la sécurité a été totalement rétablie.' },
        ],
      },
    ],
  },
  {
    id: 'niveau3',
    label: 'Niveau 3',
    sublabel: 'Autonomie',
    icon: Star,
    color: 'ltab-violet',
    sections: [
      {
        heading: '🌟 Formules littéraires & Enchaînement',
        subheading: 'Enchaînement',
        color: 'ts-violet',
        items: [
          { fr: "À peine avait-elle glissé du toit que Superman l'a rattrapée d'un geste sûr..." },
          { fr: 'Tandis que Superman fendait les airs, Spider-Man a déployé sa toile pour parer à toute éventualité.' },
          { fr: "Ce qui menaçait d'être une chute fatale s'est transformé en un sauvetage spectaculaire." },
          { fr: "Sans hésiter un seul instant, les deux icônes ont fait preuve d'un héroïsme sans faille." },
        ],
      },
      {
        heading: '📌 Rappel syntaxique',
        subheading: 'Express',
        color: 'ts-slate',
        items: [
          { fr: 'Imparfait = Cadre, coucher de soleil, altitude, peur' },
          { fr: 'Passé Composé = Action soudaine qui fait basculer le récit' },
          { fr: 'PC avec AVOIR : Superman a sauvé / Spider-Man a bondi' },
          { fr: 'PC avec ÊTRE : Elle est tombée / Ils sont intervenus (accordé !)' },
        ],
      },
    ],
  },
];

// ── Checklist items ────────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { id: 'cl1', label: 'Décor au crépuscule & émotions', badge: 'Imparfait', color: 'badge-sky' },
  { id: 'cl2', label: 'Action en cours / surveillance', badge: 'Pendant que + Imparfait', color: 'badge-sky' },
  { id: 'cl3', label: 'Danger ou événement déclencheur soudain', badge: 'Tout à coup / PC', color: 'badge-amber' },
  { id: 'cl4', label: 'Sauvetage et dénouement héroïque', badge: 'Passé Composé', color: 'badge-amber' },
];

// ── Utils ──────────────────────────────────────────────────────────────────────
function countWords(t) { return t.trim() === '' ? 0 : t.trim().split(/\s+/).length; }
function countSentences(t) { if (!t.trim()) return 0; const m = t.match(/[^.!?]*[.!?]+/g); return m ? m.length : 0; }

export default function SauvetageEnImage() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [checklist, setChecklist] = useState({ cl1: false, cl2: false, cl3: false, cl4: false });
  const [openTab, setOpenTab] = useState(null); // closed by default so user can open/close cleanly
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const textareaRef = useRef(null);

  const wordCount = countWords(text);
  const sentenceCount = countSentences(text);
  const MIN_WORDS = 60;
  const progressPct = Math.min(100, Math.round((wordCount / MIN_WORDS) * 100));

  // Insert text at textarea cursor
  const insertAtCursor = useCallback((phrase) => {
    const el = textareaRef.current;
    if (!el) {
      setText((prev) => prev + phrase);
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const before = text.slice(0, start);
    const after = text.slice(end);
    const needsSpace = before.length > 0 && !/\s$/.test(before);
    const insert = (needsSpace ? ' ' : '') + phrase;
    setText(before + insert + after);
    setTimeout(() => {
      el.focus();
      const p = start + insert.length;
      el.setSelectionRange(p, p);
    }, 0);
  }, [text]);

  const handleAccentClick = useCallback((char) => insertAtCursor(char), [insertAtCursor]);

  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleReset = () => {
    setText('');
    setChecklist({ cl1: false, cl2: false, cl3: false, cl4: false });
    textareaRef.current?.focus();
  };

  const toggleCheck = (id) => setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleTabClick = (tabId) => {
    setOpenTab((prev) => (prev === tabId ? null : tabId));
  };

  const activeTabData = TOOLBOX_TABS.find((t) => t.id === openTab);

  return (
    <div className="fade-in" style={{ width: '100%' }}>

      {/* ═════════════════════════════════════════════════════════════════════
          TOP HERO IMAGE CARD (Full Width Showcase)
          Placed at the very top so the artwork is never constrained or cropped!
          ═════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(6, 182, 212, 0.28)',
          borderRadius: '1.25rem',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 8px 30px rgba(6, 182, 212, 0.10)',
          marginBottom: '1.25rem'
        }}
      >
        {/* Title & Legend row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <div className="map-unit-badge">
              <FileText size={12} />
              UNITÉ 1 • NARRATION AU PASSÉ
            </div>
            <h2 className="map-title" style={{ fontSize: '1.45rem' }}>
              Sauvetage au Sommet — Décrire l'Action en Image
            </h2>
          </div>
          <div className="map-tense-legend">
            <span className="legend-pill legend-imp">🎥 Imparfait = Décor & Contexte</span>
            <span className="legend-pill legend-pc">⚡ PC = Action & Sauvetage</span>
          </div>
        </div>

        {/* The Comic Artwork Box */}
        <div
          style={{
            position: 'relative',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '2px solid rgba(6, 182, 212, 0.35)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
            background: '#0f172a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src="/images/superman_spiderman_rescue.jpg"
            alt="Sauvetage héroïque au crépuscule par Superman et Spider-Man"
            style={{
              width: '100%',
              maxHeight: '480px',
              objectFit: 'contain',
              background: '#090d16',
              display: 'block',
              cursor: 'pointer'
            }}
            onClick={() => setIsImageExpanded(true)}
          />
          <button
            type="button"
            onClick={() => setIsImageExpanded(true)}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#67e8f9',
              border: '1px solid rgba(103, 232, 249, 0.4)',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Maximize2 size={13} />
            <span>Plein écran</span>
          </button>
        </div>
      </div>

      {/* Expanded Lightbox Modal */}
      {isImageExpanded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            cursor: 'pointer'
          }}
          onClick={() => setIsImageExpanded(false)}
        >
          <div
            style={{ position: 'relative', maxWidth: '1050px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/images/superman_spiderman_rescue.jpg"
              alt="Plein écran — Sauvetage héroïque"
              style={{
                width: '100%',
                maxHeight: '88vh',
                objectFit: 'contain',
                borderRadius: '1rem',
                border: '2px solid #06b6d4',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
              }}
            />
            <button
              type="button"
              onClick={() => setIsImageExpanded(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                border: 'none',
                borderRadius: '99px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          WORKSPACE AREA: Left Sliding Toolbox + Right Writing Area
          Exact copy of MystereAuPasse layout with 3 sliding drawer tabs!
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="map-outer-wrapper">

        {/* ── LEFT: TOOLBOX STRIP + SLIDING DRAWER ── */}
        <div className="map-toolbox-area">
          <div className="map-level-tabs-strip" role="tablist" aria-label="Boîte à Outils — Niveaux">
            <div className="map-toolbox-label">🛠️ Boîte à Outils</div>
            {TOOLBOX_TABS.map((tab) => {
              const Icon = tab.icon;
              const isAct = openTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isAct}
                  aria-controls={`sauvetage-panel-${tab.id}`}
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

          {/* Sliding panel drawer */}
          <div
            id={openTab ? `sauvetage-panel-${openTab}` : undefined}
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
                    <button
                      type="button"
                      className="mtp-close"
                      onClick={() => setOpenTab(null)}
                      aria-label="Fermer"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <p className="mtp-hint">Cliquez sur une phrase pour l'insérer au curseur.</p>

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

        {/* ── RIGHT: MAIN WRITING AREA ── */}
        <div className="map-main-content">

          {/* Consigne & Checklist Card */}
          <div className="map-header-card">
            <div className="map-prompt-box">
              <span className="map-prompt-label">📝 Consigne :</span>
              <p className="map-prompt-text">
                « Observez l'image en haut de page : <strong>Superman</strong> vient de rattraper une rescapée dans ses bras au-dessus des gratte-ciels, tandis que <strong>Spider-Man</strong> veille sur sa gargouille. Racontez cette courte scène d'action <strong>(5 à 8 phrases)</strong>. Décrivez d'abord le contexte, le décor au crépuscule ou les émotions{' '}
                <span className="map-imp-hl">(imparfait)</span>, puis racontez l'action soudaine du sauvetage qui a tout interrompu{' '}
                <span className="map-pc-hl">(passé composé)</span>. »
              </p>
            </div>

            <div className="map-checklist">
              <span className="map-checklist-title">✅ Liste de vérification :</span>
              <div className="map-checklist-grid">
                {CHECKLIST_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className={`map-check-item ${checklist[item.id] ? 'checked' : ''}`}
                    aria-pressed={checklist[item.id]}
                  >
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
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => insertAtCursor(chip.phrase)}
                  className={`map-chip ${chip.color}`}
                  title={`Insérer « ${chip.phrase.trim()} »`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="map-textarea-wrapper">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="map-textarea"
                rows={9}
                placeholder="« Le soleil se couchait doucement sur les gratte-ciels de la métropole. Spider-Man surveillait la ville quand tout à coup, une alarme a retenti et la jeune femme a perdu l'équilibre. En une seconde, Superman a fendu l'air et l'a rattrapée dans ses bras... »"
                autoCorrect="off"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                aria-label="Zone d'écriture narrative"
              />
              <span className="map-char-hint">
                {wordCount} mot{wordCount !== 1 ? 's' : ''} • {sentenceCount} phrase{sentenceCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Progress bar */}
            <div className="map-progress-row">
              <span className="map-progress-label">Objectif : {wordCount} / {MIN_WORDS} mots min.</span>
              <div
                className="map-progress-track"
                role="progressbar"
                aria-valuenow={wordCount}
                aria-valuemin={0}
                aria-valuemax={MIN_WORDS}
              >
                <div
                  className={`map-progress-fill ${wordCount >= MIN_WORDS ? 'done' : ''}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {wordCount >= MIN_WORDS && <span className="map-progress-done">✨ Objectif atteint !</span>}
            </div>

            {/* Accent toolbars */}
            <div className="map-accent-section">
              <div className="map-accent-row">
                <span className="map-accent-label">Accents min. :</span>
                {LOWER_ACCENTS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleAccentClick(char)}
                    className="map-accent-btn"
                  >
                    {char}
                  </button>
                ))}
              </div>
              <div className="map-accent-row">
                <span className="map-accent-label">Accents maj. :</span>
                {UPPER_ACCENTS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleAccentClick(char)}
                    className="map-accent-btn map-accent-btn--upper"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Action bar */}
            <div className="map-action-bar">
              <div className="map-stats-pill">
                <span>{wordCount} mot{wordCount !== 1 ? 's' : ''}</span>
                <span className="map-stats-sep">•</span>
                <span>{sentenceCount} phrase{sentenceCount !== 1 ? 's' : ''}</span>
                {wordCount >= 60 && (
                  <>
                    <span className="map-stats-sep">•</span>
                    <span className="map-over-target">Excellent niveau de détail !</span>
                  </>
                )}
              </div>
              <div className="map-action-btns">
                <button
                  type="button"
                  onClick={handleReset}
                  className="map-btn map-btn--ghost"
                  disabled={!text.trim()}
                >
                  <RefreshCw size={14} />
                  Recommencer
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`map-btn ${copied ? 'map-btn--success' : 'map-btn--primary'}`}
                  disabled={!text.trim()}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copié !' : 'Copier mon texte'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
