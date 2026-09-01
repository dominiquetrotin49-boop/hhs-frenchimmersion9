/**
 * frenchTextAnalyzer.js
 * Unified deterministic French text analysis engine.
 * Combines ALL rules from WritingPrompt, QuestionsPractice, and WritingPractice
 * into a single module used by every "Production Écrite" activity.
 *
 * Usage:
 *   import { analyzeFrenchText } from '../utils/frenchTextAnalyzer';
 *   const result = analyzeFrenchText(text, { unitId: '1', mode: 'questions', minWords: 50, checkLength: true });
 */

// ── Vocabulary lists (per-unit) ──────────────────────────────────────────────

const VOCAB_WORDS = {
  '1': [
    'journaliste', 'article', 'information', 'source', 'liberté',
    'presse', 'vérité', 'censure', 'publier', 'rédaction', 'médias',
    'transparence', 'journalisme', 'indépendance', 'propagande',
    'désinformation', 'opinion', 'publique', 'société', 'civile',
    'répression', 'déontologie', 'lanceur', 'alerte', 'investigation',
    'pluralisme', 'éthique'
  ],
  '2': [
    'école', 'éducation', 'inégalités', 'scolarisation', 'infrastructures',
    'élèves', 'professeurs', 'réforme', 'inclusive', 'bourses', 'pédagogie'
  ],
  '3': [
    'cybersécurité', 'hameçonnage', 'données', 'mot de passe', 'empreinte',
    'réseaux', 'protection', 'bloquer'
  ],
  '4': [
    'chômage', 'précarité', 'coût', 'vie', 'inégalités', 'sociales', 'smic',
    'discriminations', 'exclusion', 'sociale', 'mal-logement', 'sans-abri',
    'sdf', 'insécurité', 'alimentaire', 'fracture', 'numérique', 'association',
    'caritative', 'aides', 'rsa', 'insertion', 'professionnelle', 'statistique',
    'témoignage', 'seuil', 'pauvreté', 'alarme', 'cercle', 'vicieux'
  ]
};

// ── Conjugation dictionaries ─────────────────────────────────────────────────

const EXACT_MATCHES = {
  'je': ['ai', 'suis', 'vais', 'fais', 'peux', 'veux', 'dois', 'sais', 'vois', 'viens', 'tiens', 'prends', 'achète', 'préfère', 'appelle', 'paie', 'paye', 'mets', 'dis', 'lis', 'écris', 'bois', 'crois', 'sors', 'pars', 'dors'],
  "j'": ['ai', 'achète', 'appelle', 'y', 'en'],
  'tu': ['as', 'es', 'vas', 'fais', 'peux', 'veux', 'dois', 'sais', 'vois', 'viens', 'tiens', 'prends', 'achètes', 'préfères', 'appelles', 'paies', 'payes', 'mets', 'dis', 'lis', 'écris', 'bois', 'crois', 'sors', 'pars', 'dors'],
  'il': ['a', 'est', 'va', 'fait', 'peut', 'veut', 'doit', 'sait', 'voit', 'vient', 'tient', 'prend', 'achète', 'préfère', 'appelle', 'paie', 'paye', 'met', 'dit', 'lit', 'écrit', 'boit', 'croit', 'sort', 'part', 'dort'],
  'elle': ['a', 'est', 'va', 'fait', 'peut', 'veut', 'doit', 'sait', 'voit', 'vient', 'tient', 'prend', 'achète', 'préfère', 'appelle', 'paie', 'paye', 'met', 'dit', 'lit', 'écrit', 'boit', 'croit', 'sort', 'part', 'dort'],
  'on': ['a', 'est', 'va', 'fait', 'peut', 'veut', 'doit', 'sait', 'voit', 'vient', 'tient', 'prend', 'achète', 'préfère', 'appelle', 'paie', 'paye', 'met', 'dit', 'lit', 'écrit', 'boit', 'croit', 'sort', 'part', 'dort'],
  'nous': ['avons', 'sommes', 'allons', 'faisons', 'pouvons', 'voulons', 'devons', 'savons', 'voyons', 'venons', 'tenons', 'prenons', 'achetons', 'préférons', 'appelons', 'payons', 'mettons', 'disons', 'lisons', 'écrivons', 'buvons', 'croyons', 'sortons', 'partons', 'dormons'],
  'vous': ['avez', 'êtes', 'allez', 'faites', 'pouvez', 'voulez', 'devez', 'savez', 'voyez', 'venez', 'tenez', 'prenez', 'achetez', 'préférez', 'appelez', 'payez', 'mettez', 'dites', 'lisez', 'écrivez', 'buvez', 'croyez', 'sortez', 'partez', 'dormez'],
  'ils': ['ont', 'sont', 'vont', 'font', 'peuvent', 'veulent', 'doivent', 'savent', 'voient', 'viennent', 'tiennent', 'prennent', 'achètent', 'préfèrent', 'appellent', 'paient', 'payent', 'mettent', 'disent', 'lisent', 'écrivent', 'boivent', 'croient', 'sortent', 'partent', 'dorment'],
  'elles': ['ont', 'sont', 'vont', 'font', 'peuvent', 'veulent', 'doivent', 'savent', 'voient', 'viennent', 'tiennent', 'prennent', 'achètent', 'préfèrent', 'appellent', 'paient', 'payent', 'mettent', 'disent', 'lisent', 'écrivent', 'boivent', 'croient', 'sortent', 'partent', 'dorment']
};

const REGULAR_ENDINGS = {
  'je': ['e', 's', 'x'],
  "j'": ['e', 's', 'x'],
  'tu': ['es', 's', 'x'],
  'il': ['e', 't', 'd'],
  'elle': ['e', 't', 'd'],
  'on': ['e', 't', 'd'],
  'nous': ['ons'],
  'vous': ['ez'],
  'ils': ['ent'],
  'elles': ['ent']
};

const SKIP_WORDS = ['ne', "n'", 'pas', 'plus', 'jamais', 'toujours', 'souvent', 'beaucoup', 'très'];
const OBJECT_PRONOUNS = ['me', "m'", 'te', "t'", 'se', "s'", 'nous', 'vous', 'le', 'la', "l'", 'les', 'lui', 'leur', 'y', 'en'];

const PRONOUN_RANK = {
  'me': 1, "m'": 1, 'te': 1, "t'": 1, 'se': 1, "s'": 1, 'nous': 1, 'vous': 1,
  'le': 2, 'la': 2, 'les': 2, "l'": 2,
  'lui': 3, 'leur': 3,
  'y': 4,
  'en': 5
};

const LOGICAL_CONNECTORS = [
  "d'abord", "tout d'abord", 'premièrement', 'ensuite', 'de plus',
  'en outre', 'cependant', 'pourtant', 'néanmoins', 'par conséquent',
  'donc', 'en conclusion', 'enfin'
];

const PAST_AUX = [
  'ai', 'as', 'a', 'avons', 'avez', 'ont',
  'suis', 'es', 'est', 'sommes', 'êtes', 'sont',
  'étais', 'était', 'étions', 'étiez', 'étaient',
  'avais', 'avait', 'avions', 'aviez', 'avaient'
];

const REFLEXIVE_PRONOUNS = ['me', 'te', 'se', "m'", "t'", "s'", 'nous', 'vous'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// ── Main analysis function ───────────────────────────────────────────────────

/**
 * Analyze French text and return deterministic, comprehensive feedback.
 *
 * @param {string} text - The student's text to analyze.
 * @param {object} options
 * @param {string} [options.unitId]      - '1'|'2'|'3'|'4'|'reprise' — enables unit-specific checks
 * @param {string} [options.mode]        - 'questions' — enables question structure checklist
 * @param {number} [options.minWords=0]  - Minimum word count threshold
 * @param {boolean} [options.checkLength=false] - Whether to score text length
 * @returns {{ score: number, isValid: boolean, spellingErrors: Array, verbAgreements: Array, adjectiveAgreements: Array, nounGenders: Array, wordChoices: Array, questionRequirements: Array, structureNotes: Array, generalFeedback: string }}
 */
export function analyzeFrenchText(text, options = {}) {
  const { unitId = null, mode = 'default', minWords = 0, checkLength = false } = options;

  let score = 10;
  const spellingErrors = [];
  const verbAgreements = [];
  const adjectiveAgreements = [];
  const nounGenders = [];
  const wordChoices = [];
  const questionRequirements = [];
  const structureNotes = [];

  const textClean = text.trim();
  const textLower = textClean.toLowerCase();
  if (!textClean) {
    return {
      score: 0, isValid: false, spellingErrors, verbAgreements,
      adjectiveAgreements, nounGenders, wordChoices, questionRequirements,
      structureNotes: [{ type: 'error', msg: 'Aucun texte soumis.' }],
      generalFeedback: 'Veuillez écrire un texte avant de soumettre.'
    };
  }

  // Tokenize
  const rawTokens = textClean.replace(/[.,!?:;]/g, ' ').toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const tokens = rawTokens.map(t => t.replace(/['']/g, "'"));
  const wordCount = tokens.length;

  // Track flagged verb positions to avoid double-counting
  const flaggedVerbPositions = new Set();

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. SPELLING CHECKS (combined from all systems)
  // ═══════════════════════════════════════════════════════════════════════════

  // ercole -> école
  const ercoleMatch = textClean.match(/\b(a\s+)?(la\s+)?(l['']\s*)?ercole(s)?\b/i);
  if (ercoleMatch) {
    let corr = 'école';
    let expl = "Le mot s'écrit « école » avec un accent aigu sur le premier 'e' (et sans la lettre 'r').";
    if (ercoleMatch[1] || ercoleMatch[2] || ercoleMatch[3]) {
      corr = ercoleMatch[1] ? "à l'école" : "l'école";
      expl += " Devant école (qui commence par une voyelle), l'article s'élide en l'.";
    }
    spellingErrors.push({ error: ercoleMatch[0], correction: corr, explanation: expl });
  }

  // ecole (missing accent)
  const ecoleSpelling = textClean.match(/\becole(s)?\b/i);
  if (ecoleSpelling) {
    spellingErrors.push({
      error: ecoleSpelling[0],
      correction: ecoleSpelling[1] ? 'écoles' : 'école',
      explanation: "Le mot s'écrit « école » avec un accent aigu sur le premier 'e'."
    });
  }

  // cooment / commant / coment -> comment
  if (textLower.includes('cooment') || textLower.includes('commant') || textLower.includes('coment')) {
    const errorWord = textClean.match(/\bcooment|commant|coment\b/i)?.[0] || 'cooment';
    spellingErrors.push({ error: errorWord, correction: 'comment', explanation: "L'adverbe interrogatif s'écrit « comment »." });
  }

  // quel age -> quel âge
  const ageAccentMatch = textClean.match(/\b(quel\s+)?age\b/i);
  if (ageAccentMatch) {
    spellingErrors.push({
      error: ageAccentMatch[0],
      correction: ageAccentMatch[1] ? 'quel âge' : 'âge',
      explanation: "Le mot « âge » s'écrit avec un accent circonflexe sur le 'a'."
    });
  }

  // bocou -> beaucoup
  if (textLower.includes('bocou')) {
    spellingErrors.push({ error: 'bocou', correction: 'beaucoup', explanation: "L'adverbe d'intensité s'écrit toujours « beaucoup »." });
  }

  // trés -> très
  if (textLower.includes('trés')) {
    spellingErrors.push({ error: 'trés', correction: 'très', explanation: "L'accent sur le 'e' de « très » est un accent grave." });
  }

  // deja -> déjà
  if (textLower.includes('deja') && !textLower.includes('déjà')) {
    spellingErrors.push({ error: 'deja', correction: 'déjà', explanation: "Le mot « déjà » s'écrit avec un accent aigu sur le premier 'e' et un accent grave sur le 'a'." });
  }

  // dejeuner (missing accent)
  const dejeunerSpelling = textClean.match(/\bdejeuner(s)?\b/i);
  if (dejeunerSpelling) {
    spellingErrors.push({
      error: dejeunerSpelling[0],
      correction: dejeunerSpelling[1] ? 'déjeuners' : 'déjeuner',
      explanation: "Le mot s'écrit « déjeuner » avec un accent aigu sur le premier 'e'."
    });
  }

  if (spellingErrors.length > 0) {
    score -= spellingErrors.length * 0.5;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. VERB AGREEMENT CHECKS (specific regex patterns)
  // ═══════════════════════════════════════════════════════════════════════════

  // se lever conjugation
  const leveMatch = textClean.match(/\b(je\s+me|je|tu|il|elle|on|ils|elles)\s+leve(s)?\b/i);
  if (leveMatch) {
    const pronom = leveMatch[1].toLowerCase();
    let correctVerb = 'lève';
    if (pronom === 'tu') correctVerb = 'lèves';
    if (pronom === 'ils' || pronom === 'elles') correctVerb = 'lèvent';
    verbAgreements.push({
      error: leveMatch[0], subject: leveMatch[1],
      correction: `${leveMatch[1]} ${correctVerb}`,
      explanation: "Le verbe pronominal « se lever » prend un accent grave (è) au présent : je me lève."
    });
  }

  // prendre with je/tu: je prend -> je prends
  const prendMatch = textClean.match(/\b(je|tu)\s+prend\b/i);
  if (prendMatch) {
    verbAgreements.push({
      error: `${prendMatch[1]} prend`, subject: prendMatch[1],
      correction: `${prendMatch[1]} prends`,
      explanation: "Au présent de l'indicatif, « prendre » prend un « -s » avec je/tu : je prends, tu prends."
    });
  }

  // aller: je va/vas -> je vais
  const jeVaMatch = textClean.match(/\bje\s+va(s)?\b/i);
  if (jeVaMatch) {
    verbAgreements.push({
      error: jeVaMatch[0], subject: 'je', correction: 'je vais',
      explanation: "La forme correcte du verbe « aller » avec « je » est « vais » : je vais."
    });
  }
  // tu va -> tu vas
  const tuVaMatch = textClean.match(/\btu\s+va\b/i);
  if (tuVaMatch) {
    verbAgreements.push({
      error: tuVaMatch[0], subject: 'tu', correction: 'tu vas',
      explanation: "La forme correcte du verbe « aller » avec « tu » prend un 's' : tu vas."
    });
  }
  // il/elle/on vais/vait -> va
  const ilVaisMatch = textClean.match(/\b(il|elle|on)\s+vai(s|t)\b/i);
  if (ilVaisMatch) {
    verbAgreements.push({
      error: ilVaisMatch[0], subject: ilVaisMatch[1],
      correction: `${ilVaisMatch[1]} va`,
      explanation: "La forme correcte du verbe « aller » avec il/elle/on est « va »."
    });
  }

  // j'habites -> j'habite
  const jHabitesMatch = textClean.match(/\bj[''](\w+es)\b/i);
  if (jHabitesMatch) {
    const verb = jHabitesMatch[1];
    verbAgreements.push({
      error: `j'${verb}`, subject: 'je',
      correction: `j'${verb.slice(0, -1)}`,
      explanation: "Avec le pronom 'je' (ou j'), les verbes du premier groupe (-er) se terminent par '-e', pas '-es'."
    });
  }

  // je manges -> je mange (standalone je + verb-es)
  const jeEsMatch = textClean.match(/\b(je)\s+(\w+es)\b/i);
  if (jeEsMatch && !leveMatch) {
    verbAgreements.push({
      error: jeEsMatch[2], subject: 'je',
      correction: jeEsMatch[2].slice(0, -1),
      explanation: "Au présent, la terminaison avec « je » est « -e » pour les verbes du premier groupe (-er)."
    });
  }

  // nous + wrong ending
  const nousMatch = textClean.match(/\b(nous)\s+(\w+[^ons\s])\b/i);
  if (nousMatch && !['sommes'].includes(nousMatch[2])) {
    const verb = nousMatch[2];
    if (verb.endsWith('e') || verb.endsWith('es') || verb.endsWith('ez')) {
      verbAgreements.push({
        error: verb, subject: 'nous',
        correction: verb.replace(/e(s|z)?$/, 'ons'),
        explanation: "Au présent, la terminaison avec « nous » est « -ons » (ex: nous mangeons)."
      });
    }
  }

  // vous + wrong ending
  const vousMatch = textClean.match(/\b(vous)\s+(\w+[^ez\s])\b/i);
  if (vousMatch && !['êtes', 'faites', 'dites'].includes(vousMatch[2])) {
    const verb = vousMatch[2];
    if (verb.endsWith('e') || verb.endsWith('es')) {
      verbAgreements.push({
        error: verb, subject: 'vous',
        correction: verb.replace(/e(s)?$/, 'ez'),
        explanation: "Au présent, la terminaison avec « vous » est « -ez » (ex: vous mangez)."
      });
    }
  }

  // ils/elles + wrong ending
  const ilsMatch = textClean.match(/\b(ils|elles)\s+(\w+[^ent\s])\b/i);
  if (ilsMatch && !['sont', 'ont', 'font', 'vont'].includes(ilsMatch[2])) {
    const verb = ilsMatch[2];
    if (verb.endsWith('e') || verb.endsWith('es') || verb.endsWith('ez')) {
      verbAgreements.push({
        error: verb, subject: ilsMatch[1],
        correction: verb.replace(/e(s|z)?$/, 'ent'),
        explanation: "Au présent, les verbes se terminent par « -ent » avec « ils / elles »."
      });
    }
  }

  if (verbAgreements.length > 0) {
    score -= verbAgreements.length;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ADJECTIVE AGREEMENT CHECKS
  // ═══════════════════════════════════════════════════════════════════════════

  // mon amis -> mon ami / mes amis
  const monAmisMatch = textClean.match(/\bmon\s+ami(e)?s\b/i);
  if (monAmisMatch) {
    adjectiveAgreements.push({
      error: monAmisMatch[0], noun: 'amis',
      correction: 'mon ami (singulier) ou mes amis (pluriel)',
      explanation: "L'adjectif possessif doit s'accorder en nombre avec le nom."
    });
  }

  if (adjectiveAgreements.length > 0) {
    score -= adjectiveAgreements.length * 0.5;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. NOUN GENDER CHECKS
  // ═══════════════════════════════════════════════════════════════════════════

  // ma/la déjeuner -> mon/le déjeuner
  const dejeunerMatch = textClean.match(/\b(ma|la)\s+dé?jeuner\b/i);
  if (dejeunerMatch) {
    nounGenders.push({
      error: dejeunerMatch[0],
      correction: dejeunerMatch[1].toLowerCase() === 'ma' ? 'mon déjeuner' : 'le déjeuner',
      explanation: "Le nom « déjeuner » est masculin. On dit « le déjeuner » ou « mon déjeuner »."
    });
  }
  if (textLower.includes('le table')) {
    nounGenders.push({ error: 'le table', correction: 'la table', explanation: "Le nom « table » est féminin." });
  }
  if (textLower.includes('un pomme')) {
    nounGenders.push({ error: 'un pomme', correction: 'une pomme', explanation: "Le nom « pomme » est féminin." });
  }
  if (textLower.includes('la livre') && !textLower.includes('la livre sterling')) {
    nounGenders.push({ error: 'la livre', correction: 'le livre', explanation: "Le nom « livre » (book) est masculin." });
  }

  if (nounGenders.length > 0) {
    score -= nounGenders.length * 0.5;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. WORD CHOICE / ANGLICISM CHECKS
  // ═══════════════════════════════════════════════════════════════════════════

  // je suis X ans -> j'ai X ans
  const jeSuisAgeMatch = textClean.match(/\b(je\s+suis|tu\s+es|il\s+est|elle\s+est|nous\s+sommes|vous\s+êtes|ils\s+sont|elles\s+sont)\s+(\d+)\s+ans\b/i);
  if (jeSuisAgeMatch) {
    const subject = jeSuisAgeMatch[1].toLowerCase().trim();
    const age = jeSuisAgeMatch[2];
    let correction = `j'ai ${age} ans`;
    if (subject.includes('tu')) correction = `tu as ${age} ans`;
    if (subject.includes('il') || subject.includes('elle')) correction = `${subject.split(' ')[0]} a ${age} ans`;
    wordChoices.push({
      error: jeSuisAgeMatch[0], correction,
      explanation: "En français, on exprime l'âge avec le verbe « avoir », pas « être » (ex: j'ai 15 ans)."
    });
  }

  // a + City -> à City
  const aCityMatch = textClean.match(/\ba\s+([A-Z]\w+)\b/);
  if (aCityMatch) {
    wordChoices.push({
      error: `a ${aCityMatch[1]}`, correction: `à ${aCityMatch[1]}`,
      explanation: "La préposition devant un nom de ville s'écrit « à » avec un accent grave."
    });
  }

  // a + article -> à
  const aPrepMatch = textClean.match(/\ba\s+(la|l'|un|une|des|le|les|l'école|l'hôtel|l'hôpital|\d+)\b/i);
  if (aPrepMatch && !aCityMatch) {
    wordChoices.push({
      error: `a ${aPrepMatch[1]}`, correction: `à ${aPrepMatch[1]}`,
      explanation: "La préposition de lieu ou de temps s'écrit « à » avec un accent grave."
    });
  }

  // la école -> à l'école (elision)
  const ecoleMatch = textClean.match(/\b(a\s+)?la\s+é?cole\b/i);
  if (ecoleMatch) {
    wordChoices.push({
      error: ecoleMatch[0], correction: "à l'école",
      explanation: "Devant un nom commençant par une voyelle, l'article s'élide en 'l''. On dit : à l'école."
    });
  }

  // sur le bus -> dans le bus
  const surBusMatch = textClean.match(/\bsur\s+(le|un|les)\s+bus\b/i);
  if (surBusMatch) {
    wordChoices.push({
      error: surBusMatch[0], correction: `dans ${surBusMatch[1]} bus`,
      explanation: "En français, on voyage « dans le bus » (à l'intérieur). « Sur le bus » signifie sur le toit !"
    });
  }

  // Ou interrogatif -> Où
  const ouInterrogatifMatch = textClean.match(/\bOu\s+(\w+-tu|\w+-il|\w+-elle|est-ce|tu|vous)\b/);
  if (ouInterrogatifMatch) {
    wordChoices.push({
      error: `Ou ${ouInterrogatifMatch[1]}`, correction: `Où ${ouInterrogatifMatch[1]}`,
      explanation: "L'adverbe interrogatif s'écrit « où » avec un accent grave pour indiquer le lieu."
    });
  }

  // appelles-tu -> t'appelles-tu
  if (textLower.includes('comment appelles-tu') || textLower.includes('appelles-tu')) {
    const rawMatch = textClean.match(/(comment\s+)?appelles-tu/i)?.[0];
    if (rawMatch) {
      wordChoices.push({
        error: rawMatch,
        correction: rawMatch.toLowerCase().startsWith('comment') ? "comment t'appelles-tu" : "t'appelles-tu",
        explanation: "Le verbe s'appeler est pronominal. N'oubliez pas le pronom réfléchi (t') : comment t'appelles-tu ?"
      });
    }
  }

  if (wordChoices.length > 0) {
    score -= wordChoices.length * 0.5;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. TEXT LENGTH CHECK
  // ═══════════════════════════════════════════════════════════════════════════

  if (checkLength && minWords > 0) {
    if (wordCount < minWords) {
      score -= 2;
      structureNotes.push({ type: 'error', msg: `Texte trop court (${wordCount}/${minWords} mots). Essayez de développer davantage vos idées.` });
    } else {
      structureNotes.push({ type: 'success', msg: `Excellente longueur (${wordCount} mots).` });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. VOCABULARY CHECK WITH LEVENSHTEIN TYPO DETECTION
  // ═══════════════════════════════════════════════════════════════════════════

  if (unitId && VOCAB_WORDS[unitId]) {
    const targetVocab = VOCAB_WORDS[unitId];
    let vocabFound = 0;
    const foundWords = new Set();
    const typoMessages = [];

    tokens.forEach(token => {
      targetVocab.forEach(vocabWord => {
        if (token === vocabWord) {
          if (!foundWords.has(vocabWord)) {
            vocabFound++;
            foundWords.add(vocabWord);
          }
        } else if (token.length > 4 && Math.abs(token.length - vocabWord.length) <= 2) {
          const dist = levenshtein(token, vocabWord);
          if (dist === 1 || (dist === 2 && vocabWord.length >= 7)) {
            if (!foundWords.has(vocabWord)) {
              typoMessages.push(`Attention à l'orthographe : avez-vous voulu écrire « ${vocabWord} » au lieu de « ${token} » ?`);
              vocabFound++;
              foundWords.add(vocabWord);
              score -= 0.5;
            }
          }
        }
      });
    });

    typoMessages.slice(0, 3).forEach(msg => structureNotes.push({ type: 'warning', msg }));

    if (vocabFound < 3) {
      score -= 2;
      structureNotes.push({ type: 'warning', msg: `Vous n'avez utilisé que ${vocabFound} mot(s) de vocabulaire cible. Essayez d'en incorporer davantage.` });
    } else {
      structureNotes.push({ type: 'success', msg: `Très bon usage du vocabulaire du thème (${vocabFound} mots trouvés).` });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. COMPREHENSIVE CONJUGATION CHECK (token-by-token)
  // ═══════════════════════════════════════════════════════════════════════════

  if (wordCount >= 15) {
    let validConjugations = 0;
    const conjugationErrors = [];

    for (let i = 0; i < tokens.length - 1; i++) {
      let subject = tokens[i];
      let verb = null;
      let verbIdx = i + 1;

      if (subject.startsWith("j'") && subject.length > 2) {
        verb = subject.slice(2);
        subject = "j'";
      } else if (!EXACT_MATCHES[subject]) {
        continue;
      } else {
        verb = tokens[verbIdx];
        while (verb && (SKIP_WORDS.includes(verb) || OBJECT_PRONOUNS.includes(verb) || verb.endsWith("'")) && verbIdx < i + 5) {
          if (verb.endsWith("'") && verb.length > 2) {
            verb = verb.slice(verb.indexOf("'") + 1);
            break;
          }
          verbIdx++;
          verb = tokens[verbIdx];
        }
      }

      if (verb && verb.length > 1 && EXACT_MATCHES[subject]) {
        // Skip if already flagged by regex checks above
        if (flaggedVerbPositions.has(verbIdx)) continue;

        let hasValidEnding = false;
        if (EXACT_MATCHES[subject].includes(verb)) {
          hasValidEnding = true;
        } else {
          const validEndings = REGULAR_ENDINGS[subject];
          if (verb.endsWith('ons') && subject !== 'nous') hasValidEnding = false;
          else if (verb.endsWith('ez') && subject !== 'vous') hasValidEnding = false;
          else if (verb.endsWith('ent') && !['ils', 'elles'].includes(subject) && !SKIP_WORDS.includes(verb)) hasValidEnding = false;
          else {
            hasValidEnding = validEndings.some(ending => verb.endsWith(ending));
          }
        }

        if (hasValidEnding && !verb.endsWith('er') && !verb.endsWith('ir')) {
          validConjugations++;
        } else if (!verb.endsWith('er') && !verb.endsWith('ir')) {
          conjugationErrors.push(`Avec « ${subject} », le verbe « ${verb} » n'est pas conjugué correctement.`);
        }
      }
    }

    if (conjugationErrors.length > 0) {
      score -= conjugationErrors.length;
      structureNotes.push({ type: 'error', msg: `Erreurs de conjugaison : ${conjugationErrors.slice(0, 3).join(' ')}` });
    }

    if (validConjugations < 3 && conjugationErrors.length === 0) {
      score -= 2;
      structureNotes.push({ type: 'warning', msg: 'Utilisez plus de verbes conjugués (je, tu, il, nous, vous, ils).' });
    } else if (validConjugations >= 3) {
      structureNotes.push({ type: 'success', msg: `Excellente maîtrise des conjugaisons du présent (${validConjugations} verbes corrects).` });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. PRONOUN ORDER CHECK (Units 2 & 3)
  // ═══════════════════════════════════════════════════════════════════════════

  const isUnit2 = unitId === '2';
  const isUnit3 = unitId === '3';
  const isUnit4 = unitId === '4';

  if (isUnit2 || isUnit3) {
    let pronounFoundCount = 0;
    const pronounErrors = [];

    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];
      if (OBJECT_PRONOUNS.includes(word)) {
        const nextWord = tokens[i + 1];
        let isPronoun = false;

        if (nextWord) {
          if (OBJECT_PRONOUNS.includes(nextWord)) isPronoun = true;
          else if (Object.values(EXACT_MATCHES).some(verbs => verbs.includes(nextWord))) isPronoun = true;
          else if (nextWord.endsWith('er') || nextWord.endsWith('ir') || nextWord.endsWith('re')) isPronoun = true;
          else if (['lui', 'leur', 'y', 'en', 'me', "m'", 'te', "t'", 'se', "s'", 'nous', 'vous'].includes(word)) isPronoun = true;
        } else if (['lui', 'leur', 'y', 'en', 'me', "m'", 'te', "t'", 'se', "s'", 'nous', 'vous'].includes(word)) {
          isPronoun = true;
        }

        if (isPronoun) {
          pronounFoundCount++;
          if (nextWord && OBJECT_PRONOUNS.includes(nextWord)) {
            const rank1 = PRONOUN_RANK[word];
            const rank2 = PRONOUN_RANK[nextWord];
            if (rank1 && rank2 && rank1 > rank2) {
              pronounErrors.push(`Ordre incorrect : « ${word} ${nextWord} ». L'ordre est : 1(me/te/se/nous/vous) > 2(le/la/les) > 3(lui/leur) > 4(y) > 5(en).`);
            }
          }
        }
      }
    }

    if (pronounErrors.length > 0) {
      score -= pronounErrors.length;
      pronounErrors.slice(0, 2).forEach(msg => structureNotes.push({ type: 'error', msg }));
    }

    if (pronounFoundCount < 3) {
      score -= 2;
      structureNotes.push({ type: 'warning', msg: `N'oubliez pas d'utiliser au moins 3 pronoms objets (me, te, le, la, lui, leur, y, en). Vous en avez utilisé ${pronounFoundCount}.` });
    } else if (pronounErrors.length === 0) {
      structureNotes.push({ type: 'success', msg: `Superbe utilisation des pronoms objets (${pronounFoundCount} pronoms détectés) et dans le bon ordre !` });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. PAST TENSE CHECK (Units 2 & 4)
  // ═══════════════════════════════════════════════════════════════════════════

  if (isUnit2 || isUnit4) {
    let foundPast = false;
    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];
      if (word.endsWith('ais') || word.endsWith('ait') || word.endsWith('ions') || word.endsWith('iez') || word.endsWith('aient') || PAST_AUX.includes(word)) {
        foundPast = true;
        break;
      }
    }
    if (!foundPast) {
      score -= 1;
      structureNotes.push({ type: 'warning', msg: "Utilisez au moins un verbe à l'imparfait ou au passé composé." });
    } else {
      structureNotes.push({ type: 'success', msg: "Bien joué pour l'utilisation des temps du passé !" });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. LOGICAL CONNECTORS (Unit 4)
  // ═══════════════════════════════════════════════════════════════════════════

  if (isUnit4) {
    const foundConnecteur = LOGICAL_CONNECTORS.some(c => textLower.includes(c));
    if (!foundConnecteur) {
      score -= 1;
      structureNotes.push({ type: 'warning', msg: "Il manque des connecteurs logiques (ex: tout d'abord, ensuite, cependant)." });
    } else {
      structureNotes.push({ type: 'success', msg: 'Bon usage des connecteurs logiques pour structurer votre texte !' });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. REFLEXIVE VERBS CHECK (Unit 4)
  // ═══════════════════════════════════════════════════════════════════════════

  if (isUnit4) {
    let foundReflechi = false;
    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];
      if (REFLEXIVE_PRONOUNS.includes(word) && i < tokens.length - 1) {
        const nextWord = tokens[i + 1];
        if (nextWord.length > 2 && !['le', 'la', 'les'].includes(nextWord)) {
          if (nextWord.endsWith('er') || nextWord.endsWith('ir') || nextWord.endsWith('re') ||
              Object.values(EXACT_MATCHES).some(verbs => verbs.includes(nextWord)) ||
              nextWord.endsWith('é') || nextWord.endsWith('i') || nextWord.endsWith('u') ||
              nextWord.endsWith('s') || nextWord.endsWith('t') || nextWord.endsWith('e')) {
            foundReflechi = true;
            break;
          }
        }
      }
    }
    if (!foundReflechi) {
      score -= 1;
      structureNotes.push({ type: 'warning', msg: "N'oubliez pas d'utiliser au moins un verbe réfléchi/réciproque (ex: se retrouver, se battre)." });
    } else {
      structureNotes.push({ type: 'success', msg: 'Super utilisation des verbes pronominaux !' });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. PUNCTUATION CHECK
  // ═══════════════════════════════════════════════════════════════════════════

  if (wordCount >= 15) {
    const sentences = (textClean.match(/[.!?]/g) || []).length;
    if (sentences < 3) {
      score -= 1;
      structureNotes.push({ type: 'warning', msg: "Attention à la ponctuation. N'oubliez pas les points pour séparer vos phrases." });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 14. QUESTION STRUCTURE CHECK (mode === 'questions')
  // ═══════════════════════════════════════════════════════════════════════════

  if (mode === 'questions') {
    const hasQuestionMark = textClean.includes('?');
    if (!hasQuestionMark) {
      questionRequirements.push({ status: 'warning', msg: "Votre dialogue doit contenir au moins un point d'interrogation (?) pour former une question." });
    }

    const hasEstCeQue = textLower.includes('est-ce que') || textLower.includes("est-ce qu");
    const hasInversion = /\b(as-tu|es-tu|parles-tu|fais-tu|aimes-tu|étudies-tu|aime-t-il|aime-t-elle|parle-t-il|parle-t-elle|voulez-vous|faites-vous|avez-vous|êtes-vous|appelles-tu|habites-tu)\b/i.test(textClean);
    const interrogatifs = ['où', 'quand', 'pourquoi', 'comment', 'qui', 'combien', 'que', 'quoi', 'ou'];
    const foundInterrogatif = interrogatifs.find(word => textLower.includes(word));

    if (hasQuestionMark) {
      questionRequirements.push(hasEstCeQue
        ? { status: 'success', msg: 'Structure « Est-ce que » bien détectée !' }
        : { status: 'info', msg: "Conseil : Essayez d'ajouter une question avec « Est-ce que » pour pratiquer ce registre." }
      );
      questionRequirements.push(hasInversion
        ? { status: 'success', msg: 'Inversion sujet-verbe bien détectée !' }
        : { status: 'info', msg: "Conseil : Essayez d'utiliser l'inversion sujet-verbe (ex: As-tu… ? Parles-tu… ?)." }
      );
      questionRequirements.push(foundInterrogatif
        ? { status: 'success', msg: `Mot interrogatif (« ${foundInterrogatif === 'ou' ? 'où' : foundInterrogatif} ») bien détecté !` }
        : { status: 'info', msg: "Conseil : Essayez d'utiliser un mot interrogatif (ex: Où, Quand, Pourquoi, Comment)." }
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 15. FINAL SCORE & FEEDBACK
  // ═══════════════════════════════════════════════════════════════════════════

  score = Math.max(0, Math.min(10, Math.round(score * 2) / 2)); // round to nearest 0.5

  const totalErrors = spellingErrors.length + verbAgreements.length + adjectiveAgreements.length + nounGenders.length + wordChoices.length;

  const isValid = totalErrors === 0 && structureNotes.every(n => n.type !== 'error');

  let generalFeedback;
  if (isValid && score >= 9) {
    generalFeedback = 'Excellent travail ! Votre texte est bien rédigé et ne contient aucune erreur détectée.';
  } else if (score >= 7) {
    generalFeedback = 'Bon travail ! Quelques petites corrections à apporter — examinez les détails ci-dessous.';
  } else if (score >= 5) {
    generalFeedback = 'Vous avez fait des erreurs. Examinez les corrections détaillées ci-dessous pour vous améliorer.';
  } else {
    generalFeedback = 'Plusieurs erreurs ont été détectées. Révisez attentivement les corrections et réessayez !';
  }

  return {
    score,
    isValid,
    spellingErrors,
    verbAgreements,
    adjectiveAgreements,
    nounGenders,
    wordChoices,
    questionRequirements,
    structureNotes,
    generalFeedback
  };
}
