import React, { useState } from 'react';
import './WritingPractice.css';

const VOCAB_WORDS_UNIT_1 = [
  'journaliste', 'article', 'information', 'source', 'liberté', 
  'presse', 'vérité', 'censure', 'publier', 'rédaction', 'médias',
  'transparence', 'journalisme', 'indépendance', 'propagande',
  'désinformation', 'opinion', 'publique', 'société', 'civile',
  'répression', 'déontologie', 'lanceur', 'alerte', 'investigation',
  'pluralisme', 'éthique'
];

const VOCAB_WORDS_UNIT_2 = [
  'école', 'éducation', 'inégalités', 'scolarisation', 'infrastructures',
  'élèves', 'professeurs', 'réforme', 'inclusive', 'bourses', 'pédagogie'
];

const VOCAB_WORDS_UNIT_3 = [
  'cybersécurité', 'hameçonnage', 'données', 'mot de passe', 'empreinte', 'réseaux', 'protection', 'bloquer'
];

const VOCAB_WORDS_UNIT_4 = [
  'chômage', 'précarité', 'coût', 'vie', 'inégalités', 'sociales', 'smic', 'discriminations',
  'exclusion', 'sociale', 'mal-logement', 'sans-abri', 'sdf', 'insécurité', 'alimentaire',
  'fracture', 'numérique', 'association', 'caritative', 'aides', 'rsa', 'insertion',
  'professionnelle', 'statistique', 'témoignage', 'seuil', 'pauvreté', 'alarme', 'cercle', 'vicieux'
];

const PRESENT_VERB_ENDINGS = ['e', 'es', 'ons', 'ez', 'ent', 'is', 'it', 'ds', 'd', 'suis', 'est', 'sommes', 'sont', 'avons', 'avez', 'ont'];

export default function WritingPractice({ unitId, onBack }) {
  const isUnit2 = unitId === '2';
  const isUnit3 = unitId === '3';
  const isUnit4 = unitId === '4';
  const targetVocab = isUnit4 ? VOCAB_WORDS_UNIT_4 : isUnit3 ? VOCAB_WORDS_UNIT_3 : isUnit2 ? VOCAB_WORDS_UNIT_2 : VOCAB_WORDS_UNIT_1;
  const promptSubject = isUnit4 ? "Critique d'Art & Récit Culturel" : isUnit3 ? "Se protéger en ligne" : isUnit2 ? "Créer une école innovante" : "Journaliste en Action";
  const promptText = isUnit4
    ? "Rédigez la critique d'un film, d'une œuvre d'art ou le récit d'un souvenir culturel marquant (au moins 50 mots). Vous devez utiliser le PASSÉ COMPOSÉ et l'IMPARFAIT (décor vs événement), au moins un VERBE RÉFLÉCHI (se passionner, se dérouler...), et des CONNECTEURS LOGIQUES (tout d'abord, cependant, en conclusion)."
    : isUnit3
    ? "Écrivez un court e-mail (au moins 50 mots au PRÉSENT) à un ami pour lui expliquer comment vous protégez vos données sur Internet. Vous devez utiliser au moins 3 PRONOMS OBJETS (me, te, se, nous, vous, le, la, les, lui, leur, y, en) pour éviter les répétitions."
    : isUnit2 
    ? "Vous avez une opportunité unique de créer votre propre école innovante. Écrivez un court paragraphe (au moins 50 mots) au PRÉSENT pour décrire la vision de votre école, quelles matières sont enseignées, et comment vous aidez vos élèves."
    : "Vous êtes un jeune journaliste. Écrivez un court paragraphe (au moins 50 mots) au PRÉSENT pour décrire comment vous trouvez vos informations, comment vous écrivez vos articles, et pourquoi la liberté de la presse est importante.";
  const perfectScoreMsg = isUnit4
    ? "Félicitations ! Votre critique artistique est magnifiquement rédigée au passé avec le vocabulaire de l'Unité 4 ! 🎨🎬✨"
    : isUnit3
    ? "Excellent e-mail ! Vos conseils en cybersécurité sont très clairs. 🛡️✨"
    : isUnit2
    ? "Excellent travail ! Votre école innovante semble fantastique. 🏫✨"
    : "Excellent travail ! Vous avez le talent d'un vrai journaliste. 📰✨";
  const vocabWarningMsg = isUnit4
    ? "Essayez d'ajouter: chef-d'œuvre, scénario, exposition, bande originale, fresque, etc."
    : isUnit3
    ? "Essayez d'ajouter: cybersécurité, hameçonnage, données, mot de passe, empreinte..."
    : isUnit2
    ? "Essayez d'ajouter: école, éducation, inclusive, pédagogie, etc."
    : "Essayez d'ajouter: journaliste, source, liberté, etc.";
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState(null);

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleAnalyze = () => {
    let score = 10;
    const notes = [];
    const lowerText = text.toLowerCase();
    
    // Tokenization
    const rawTokens = text.replace(/[.,!?:]/g, ' ').toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const tokens = rawTokens.map(t => t.replace(/['’]/g, "'"));

    // 1. Length Check
    const wordCount = tokens.length;
    if (wordCount < 50) {
      score -= 2;
      notes.push({ type: 'error', msg: `Texte trop court (${wordCount}/50 mots). Essayez de développer davantage vos idées.` });
    } else {
      notes.push({ type: 'success', msg: `Excellente longueur (${wordCount} mots).` });
    }

    // Levenshtein helper
    const levenshtein = (a, b) => {
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
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
          }
        }
      }
      return matrix[b.length][a.length];
    };

    // 2. Vocab Check with Typos
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
              typoMessages.push(`Attention à l'orthographe : avez-vous voulu écrire "${vocabWord}" au lieu de "${token}" ?`);
              vocabFound++;
              foundWords.add(vocabWord);
              score -= 0.5;
            }
          }
        }
      });
    });

    if (typoMessages.length > 0) {
      typoMessages.slice(0, 3).forEach(msg => notes.push({ type: 'warning', msg }));
    }

    if (vocabFound < 3) {
      score -= 2;
      notes.push({ type: 'warning', msg: `Vous n'avez utilisé que ${vocabFound} mot(s) de vocabulaire cible. ${vocabWarningMsg}` });
    } else {
      notes.push({ type: 'success', msg: `Très bon usage du vocabulaire du thème (${vocabFound} mots trouvés).` });
    }

    // 3. Comprehensive Conjugation Check (Present Tense)
    const exactMatches = {
      'je': ['ai', 'suis', 'vais', 'fais', 'peux', 'veux', 'dois', 'sais', 'vois', 'viens', 'tiens', 'prends', 'achète', 'préfère', 'appelle', 'paie', 'paye', 'mets', 'dis', 'lis', 'écris', 'bois', 'crois', 'sors', 'pars', 'dors'],
      "j'": ['ai', 'achète', 'appelle', 'y', 'en'], // Added y, en for cases where they immediately follow j'
      'tu': ['as', 'es', 'vas', 'fais', 'peux', 'veux', 'dois', 'sais', 'vois', 'viens', 'tiens', 'prends', 'achètes', 'préfères', 'appelles', 'paies', 'payes', 'mets', 'dis', 'lis', 'écris', 'bois', 'crois', 'sors', 'pars', 'dors'],
      'il': ['a', 'est', 'va', 'fait', 'peut', 'veut', 'doit', 'sait', 'voit', 'vient', 'tient', 'prend', 'achète', 'préfère', 'appelle', 'paie', 'paye', 'met', 'dit', 'lit', 'écrit', 'boit', 'croit', 'sort', 'part', 'dort'],
      'elle': ['a', 'est', 'va', 'fait', 'peut', 'veut', 'doit', 'sait', 'voit', 'vient', 'tient', 'prend', 'achète', 'préfère', 'appelle', 'paie', 'paye', 'met', 'dit', 'lit', 'écrit', 'boit', 'croit', 'sort', 'part', 'dort'],
      'on': ['a', 'est', 'va', 'fait', 'peut', 'veut', 'doit', 'sait', 'voit', 'vient', 'tient', 'prend', 'achète', 'préfère', 'appelle', 'paie', 'paye', 'met', 'dit', 'lit', 'écrit', 'boit', 'croit', 'sort', 'part', 'dort'],
      'nous': ['avons', 'sommes', 'allons', 'faisons', 'pouvons', 'voulons', 'devons', 'savons', 'voyons', 'venons', 'tenons', 'prenons', 'achetons', 'préférons', 'appelons', 'payons', 'mettons', 'disons', 'lisons', 'écrivons', 'buvons', 'croyons', 'sortons', 'partons', 'dormons'],
      'vous': ['avez', 'êtes', 'allez', 'faites', 'pouvez', 'voulez', 'devez', 'savez', 'voyez', 'venez', 'tenez', 'prenez', 'achetez', 'préférez', 'appelez', 'payez', 'mettez', 'dites', 'lisez', 'écrivez', 'buvez', 'croyez', 'sortez', 'partez', 'dormez'],
      'ils': ['ont', 'sont', 'vont', 'font', 'peuvent', 'veulent', 'doivent', 'savent', 'voient', 'viennent', 'tiennent', 'prennent', 'achètent', 'préfèrent', 'appellent', 'paient', 'payent', 'mettent', 'disent', 'lisent', 'écrivent', 'boivent', 'croient', 'sortent', 'partent', 'dorment'],
      'elles': ['ont', 'sont', 'vont', 'font', 'peuvent', 'veulent', 'doivent', 'savent', 'voient', 'viennent', 'tiennent', 'prennent', 'achètent', 'préfèrent', 'appellent', 'paient', 'payent', 'mettent', 'disent', 'lisent', 'écrivent', 'boivent', 'croient', 'sortent', 'partent', 'dorment']
    };

    const regularEndings = {
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

    const skipWords = ['ne', "n'", 'pas', 'plus', 'jamais', 'toujours', 'souvent', 'beaucoup', 'très'];
    const objectPronouns = ['me', "m'", 'te', "t'", 'se', "s'", 'nous', 'vous', 'le', 'la', "l'", 'les', 'lui', 'leur', 'y', 'en'];

    let validConjugations = 0;
    let conjugationErrors = [];

    for (let i = 0; i < tokens.length - 1; i++) {
      let subject = tokens[i];
      let verb = null;
      let verbIdx = i + 1;

      if (subject.startsWith("j'") && subject.length > 2) {
        verb = subject.slice(2);
        subject = "j'";
      } else if (!exactMatches[subject]) {
        continue;
      } else {
        verb = tokens[verbIdx];
        while (verb && (skipWords.includes(verb) || objectPronouns.includes(verb) || verb.endsWith("'")) && verbIdx < i + 5) {
          if (verb.endsWith("'") && verb.length > 2) {
             verb = verb.slice(verb.indexOf("'") + 1);
             break;
          }
          verbIdx++;
          verb = tokens[verbIdx];
        }
      }

      if (verb && verb.length > 1 && exactMatches[subject]) {
        let hasValidEnding = false;
        if (exactMatches[subject].includes(verb)) {
          hasValidEnding = true;
        } else {
          const validEndings = regularEndings[subject];
          if (verb.endsWith('ons') && subject !== 'nous') hasValidEnding = false;
          else if (verb.endsWith('ez') && subject !== 'vous') hasValidEnding = false;
          else if (verb.endsWith('ent') && !['ils', 'elles'].includes(subject) && !skipWords.includes(verb)) hasValidEnding = false;
          else {
            hasValidEnding = validEndings.some(ending => verb.endsWith(ending));
          }
        }
        
        if (hasValidEnding && !verb.endsWith('er') && !verb.endsWith('ir')) {
          validConjugations++;
        } else if (!verb.endsWith('er') && !verb.endsWith('ir')) {
          const endingMsg = `Rappel des terminaisons régulières - ER: e/es/e/ons/ez/ent, IR: is/is/it/issons/issez/issent, RE: s/s/-/ons/ez/ent. Verbes irréguliers fréquents (Unité 1): écrire, lire, dire, voir.`;
          conjugationErrors.push(`Avec "${subject}", le verbe "${verb}" n'est pas conjugué correctement. ${endingMsg}`);
        }
      }
    }

    if (conjugationErrors.length > 0) {
      score -= conjugationErrors.length;
      notes.push({ type: 'error', msg: `Erreurs de conjugaison : ${conjugationErrors.slice(0, 3).join(' ')}` });
    }

    if (validConjugations < 3 && conjugationErrors.length === 0) {
      score -= 2;
      notes.push({ type: 'warning', msg: `Utilisez plus de verbes conjugués (je, tu, il, nous, vous, ils).` });
    } else if (validConjugations >= 3) {
      notes.push({ type: 'success', msg: `Excellente maîtrise des conjugaisons du présent (${validConjugations} verbes corrects).` });
    }

    // 4. Pronouns Check & Rules (Unit 3)
    if (isUnit3) {
      const rank = {
        'me': 1, "m'": 1, 'te': 1, "t'": 1, 'se': 1, "s'": 1, 'nous': 1, 'vous': 1,
        'le': 2, 'la': 2, 'les': 2, "l'": 2,
        'lui': 3, 'leur': 3,
        'y': 4,
        'en': 5
      };

      let pronounFoundCount = 0;
      let pronounErrors = [];

      for (let i = 0; i < tokens.length; i++) {
        const word = tokens[i];
        
        if (objectPronouns.includes(word)) {
          let nextWord = tokens[i+1];
          let isPronoun = false;
          
          if (nextWord) {
            if (objectPronouns.includes(nextWord)) isPronoun = true;
            else if (Object.values(exactMatches).some(verbs => verbs.includes(nextWord))) isPronoun = true;
            else if (nextWord.endsWith('er') || nextWord.endsWith('ir') || nextWord.endsWith('re')) isPronoun = true;
            else if (['lui', 'leur', 'y', 'en', 'me', "m'", 'te', "t'", 'se', "s'", 'nous', 'vous'].includes(word)) isPronoun = true;
          } else if (['lui', 'leur', 'y', 'en', 'me', "m'", 'te', "t'", 'se', "s'", 'nous', 'vous'].includes(word)) {
            // Also count if it's the very last word and a valid object pronoun
            isPronoun = true;
          }
          
          if (isPronoun) {
            pronounFoundCount++;
            
            if (nextWord && objectPronouns.includes(nextWord)) {
               const rank1 = rank[word];
               const rank2 = rank[nextWord];
               if (rank1 && rank2 && rank1 > rank2) {
                 pronounErrors.push(`Ordre incorrect : "${word} ${nextWord}". L'ordre est : 1(me/te/se/nous/vous) > 2(le/la/les) > 3(lui/leur) > 4(y) > 5(en).`);
               }
            }
          }
        }
      }

      if (pronounErrors.length > 0) {
        score -= pronounErrors.length;
        pronounErrors.slice(0, 2).forEach(msg => notes.push({ type: 'error', msg }));
      }

      if (pronounFoundCount < 3) {
        score -= 2;
        notes.push({ type: 'warning', msg: `N'oubliez pas d'utiliser au moins 3 pronoms objets (me, te, se, nous, vous, le, la, les, lui, leur, y, en) ! Vous en avez utilisé ${pronounFoundCount}.` });
      } else if (pronounErrors.length === 0) {
        notes.push({ type: 'success', msg: `Superbe utilisation des pronoms objets (${pronounFoundCount} pronoms détectés) et dans le bon ordre !` });
      }
    }
    
    // 5. Grammar checks for Unit 4 (Connecteurs logiques, Imparfait/PC, Verbes réfléchis)
    if (isUnit4) {
      const connecteurs = ['d\'abord', 'tout d\'abord', 'premièrement', 'ensuite', 'de plus', 'en outre', 'cependant', 'pourtant', 'néanmoins', 'par conséquent', 'donc', 'en conclusion', 'enfin'];
      const reflechis = ['me', 'te', 'se', "m'", "t'", "s'", 'nous', 'vous'];
      const pastAux = ['ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'est', 'sommes', 'êtes', 'sont', 'étais', 'était', 'étions', 'étiez', 'étaient', 'avais', 'avait', 'avions', 'aviez', 'avaient'];
      
      let foundConnecteur = false;
      let foundPast = false;
      let foundReflechi = false;

      const fullTextLower = text.toLowerCase();
      if (connecteurs.some(c => fullTextLower.includes(c))) {
        foundConnecteur = true;
      }

      for (let i = 0; i < tokens.length; i++) {
        const word = tokens[i];
        
        // Check for imparfait endings or passé composé aux
        if (word.endsWith('ais') || word.endsWith('ait') || word.endsWith('ions') || word.endsWith('iez') || word.endsWith('aient') || pastAux.includes(word)) {
          foundPast = true;
        }

        // Check for reflexive verb structure (pronom + verb)
        if (reflechis.includes(word) && i < tokens.length - 1) {
          const nextWord = tokens[i+1];
          if (nextWord.length > 2 && (nextWord.endsWith('er') || nextWord.endsWith('ir') || nextWord.endsWith('re') || Object.values(exactMatches).some(verbs => verbs.includes(nextWord)) || nextWord.endsWith('é') || nextWord.endsWith('i') || nextWord.endsWith('u') || nextWord.endsWith('s') || nextWord.endsWith('t') || nextWord.endsWith('e'))) {
            // Very rudimentary check: if it's a reflexive pronoun followed by something that looks like a verb
            if (!['le', 'la', 'les'].includes(nextWord)) { // prevent false positives
               foundReflechi = true;
            }
          }
        }
      }

      if (!foundConnecteur) {
        score -= 1;
        notes.push({ type: 'warning', msg: "Il manque des connecteurs logiques (ex: tout d'abord, ensuite, cependant)." });
      } else {
        notes.push({ type: 'success', msg: "Bon usage des connecteurs logiques pour structurer votre texte !" });
      }

      if (!foundPast) {
        score -= 1;
        notes.push({ type: 'warning', msg: "Utilisez au moins un verbe à l'imparfait ou au passé composé." });
      } else {
        notes.push({ type: 'success', msg: "Bien joué pour l'utilisation des temps du passé !" });
      }

      if (!foundReflechi) {
        score -= 1;
        notes.push({ type: 'warning', msg: "N'oubliez pas d'utiliser au moins un verbe réfléchi/réciproque (ex: ils se battent, il se retrouve)." });
      } else {
        notes.push({ type: 'success', msg: "Super utilisation des verbes pronominaux !" });
      }
    }

    // 5. Punctuation
    const sentences = (text.match(/[.!?]/g) || []).length;
    if (sentences < 3) {
      score -= 1;
      notes.push({ type: 'warning', msg: `Attention à la ponctuation. N'oubliez pas les points pour séparer vos phrases.` });
    }

    score = Math.max(0, Math.min(10, score));
    setFeedback({ score, notes });
  };

  return (
    <div className="writing-practice">
      <button className="back-btn" onClick={onBack}>
        ← Retour au menu
      </button>

      <div className="writing-header glass-panel">
        <h2 className="text-gradient">Production Écrite</h2>
        <div className="writing-prompt">
          <strong>Sujet : {promptSubject}</strong><br/>
          {promptText}
          <br/><br/>
          <em>Contrainte : Utilisez le vocabulaire de l'unité et les verbes réguliers/irréguliers vus en classe.</em>
        </div>
      </div>

      <div className="writing-workspace">
        <div className="editor-panel glass-panel">
          <textarea
            className="writing-textarea"
            placeholder="Écrivez votre paragraphe ici..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFeedback(null); // Clear feedback when typing
            }}
          ></textarea>
          
          <div className="editor-footer">
            <span className={`word-count ${wordCount < 50 ? 'text-danger' : 'text-success'}`}>
              Mots : {wordCount} / 50 min.
            </span>
            <button 
              className="check-btn btn-accent" 
              onClick={handleAnalyze}
              disabled={text.trim().length === 0}
            >
              Demander une correction
            </button>
          </div>
        </div>

        {feedback && (
          <div className="feedback-panel glass-panel slide-in">
            <h3 className="feedback-title">Rapport de Correction</h3>
            
            <div className="score-circle">
              <span className="score-num">{feedback.score}</span>
              <span className="score-denom">/ 10</span>
            </div>

            <ul className="feedback-notes">
              {feedback.notes.map((note, idx) => (
                <li key={idx} className={`note-item note-${note.type}`}>
                  {note.type === 'success' && '✅ '}
                  {note.type === 'warning' && '⚠️ '}
                  {note.type === 'error' && '❌ '}
                  {note.msg}
                </li>
              ))}
            </ul>

            {feedback.score === 10 && (
              <div className="perfect-score-msg">
                {perfectScoreMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
