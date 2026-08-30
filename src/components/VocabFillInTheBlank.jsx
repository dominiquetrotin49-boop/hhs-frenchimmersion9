import React, { useState } from 'react';
import './VocabFillInTheBlank.css';

const UNIT_1_DATA = {
  title: "Leçon : La liberté de la presse",
  blanksCount: 10,
  text: [
    { type: 'text', content: "Dans de nombreux pays, la " },
    { type: 'blank', id: 0, answer: "Liberté de la presse" },
    { type: 'text', content: " est menacée. Certains gouvernements utilisent la " },
    { type: 'blank', id: 1, answer: "Censure" },
    { type: 'text', content: " pour cacher la vérité et empêcher les professionnels de faire leur travail. Parfois, ils diffusent même de la " },
    { type: 'blank', id: 2, answer: "Propagande" },
    { type: 'text', content: " pour manipuler l'" },
    { type: 'blank', id: 3, answer: "Opinion publique" },
    { type: 'text', content: ". Face à cette " },
    { type: 'blank', id: 4, answer: "Répression" },
    { type: 'text', content: " violente, le vrai " },
    { type: 'blank', id: 5, answer: "Journalisme" },
    { type: 'text', content: " est vital. Les reporters courageux doivent protéger leur " },
    { type: 'blank', id: 6, answer: "Indépendance journalistique" },
    { type: 'text', content: " et combattre toute forme de " },
    { type: 'blank', id: 7, answer: "Désinformation" },
    { type: 'text', content: ". Heureusement, la " },
    { type: 'blank', id: 8, answer: "Société civile" },
    { type: 'text', content: " et les ONG se battent tous les jours pour exiger plus de " },
    { type: 'blank', id: 9, answer: "Transparence" },
    { type: 'text', content: " de la part des institutions." }
  ],
  words: [
    "Censure",
    "Désinformation",
    "Indépendance journalistique",
    "Journalisme",
    "Liberté de la presse",
    "Opinion publique",
    "Propagande",
    "Répression",
    "Société civile",
    "Transparence"
  ]
};

const UNIT_2_DATA = {
  title: "Leçon : L'éducation en Afrique francophone",
  blanksCount: 10,
  text: [
    { type: 'text', content: "En Afrique, le " },
    { type: 'blank', id: 0, answer: "Système éducatif" },
    { type: 'text', content: " fait face à de grands défis. Malgré une augmentation du " },
    { type: 'blank', id: 1, answer: "Taux de scolarisation" },
    { type: 'text', content: ", il existe encore de fortes " },
    { type: 'blank', id: 2, answer: "Inégalités éducatives" },
    { type: 'text', content: ". Par exemple, les " },
    { type: 'blank', id: 3, answer: "Écoles rurales" },
    { type: 'text', content: " manquent souvent d'" },
    { type: 'blank', id: 4, answer: "Infrastructures scolaires" },
    { type: 'text', content: ". Pour améliorer la situation, une profonde " },
    { type: 'blank', id: 5, answer: "Réforme éducative" },
    { type: 'text', content: " est nécessaire. Le but est de garantir une véritable " },
    { type: 'blank', id: 6, answer: "Éducation inclusive" },
    { type: 'text', content: " pour tous les enfants. Promouvoir l'" },
    { type: 'blank', id: 7, answer: "Égalité des genres" },
    { type: 'text', content: " est aussi indispensable pour protéger les filles. Enfin, l'accès à l'" },
    { type: 'blank', id: 8, answer: "Éducation de base" },
    { type: 'text', content: " et l'obtention de " },
    { type: 'blank', id: 9, answer: "Bourses d'études" },
    { type: 'text', content: " doivent être facilités pour les étudiants méritants." }
  ],
  words: [
    "Bourses d'études",
    "Infrastructures scolaires",
    "Inégalités éducatives",
    "Réforme éducative",
    "Système éducatif",
    "Taux de scolarisation",
    "Écoles rurales",
    "Éducation de base",
    "Éducation inclusive",
    "Égalité des genres"
  ]
};

const UNIT_3_DATA = {
  title: "Leçon 1 : Mon précieux (Déconnexion)",
  blanksCount: 10,
  text: [
    { type: 'text', content: "Aujourd'hui, il est facile de devenir " },
    { type: 'blank', id: 0, answer: "Dépendant" },
    { type: 'text', content: " à son smartphone dans la vie de tous les jours, c'est-à-dire au " },
    { type: 'blank', id: 1, answer: "Quotidien" },
    { type: 'text', content: ". On est souvent tellement " },
    { type: 'blank', id: 2, answer: "Absorbé" },
    { type: 'text', content: " par nos écrans qu'on oublie les petites " },
    { type: 'blank', id: 3, answer: "Joies" },
    { type: 'text', content: " de la vie réelle. Pour retrouver un bon " },
    { type: 'blank', id: 4, answer: "Équilibre" },
    { type: 'text', content: " mental, il faut prendre " },
    { type: 'blank', id: 5, answer: "Conscience" },
    { type: 'text', content: " de nos mauvaises habitudes. Même si la technologie est très " },
    { type: 'blank', id: 6, answer: "Pratique" },
    { type: 'text', content: " pour s'organiser, elle ne doit pas être notre seule " },
    { type: 'blank', id: 7, answer: "Compagnie" },
    { type: 'text', content: ". Un écran ne peut pas " },
    { type: 'blank', id: 8, answer: "Remplacer" },
    { type: 'text', content: " une vraie discussion avec des amis. Pourtant, Internet nous " },
    { type: 'blank', id: 9, answer: "Bombarde" },
    { type: 'text', content: " de notifications sans arrêt." }
  ],
  words: [
    "Absorbé",
    "Bombarde",
    "Compagnie",
    "Conscience",
    "Dépendant",
    "Joies",
    "Pratique",
    "Quotidien",
    "Remplacer",
    "Équilibre"
  ]
};

const UNIT_3_TECH_DATA = {
  title: "Leçon 2 : Cybersécurité et Outils",
  blanksCount: 10,
  text: [
    { type: 'text', content: "Sur Internet, la " },
    { type: 'blank', id: 0, answer: "Cybersécurité" },
    { type: 'text', content: " nous aide à éviter les attaques. Par exemple, le " },
    { type: 'blank', id: 1, answer: "Hameçonnage" },
    { type: 'text', content: " est une technique pour voler vos mots de passe. Il faut régler ses " },
    { type: 'blank', id: 2, answer: "Paramètres de confidentialité" },
    { type: 'text', content: " pour protéger son " },
    { type: 'blank', id: 3, answer: "E-réputation" },
    { type: 'text', content: ". Chaque action laisse une trace qui forme notre " },
    { type: 'blank', id: 4, answer: "Empreinte numérique" },
    { type: 'text', content: ". Les réseaux sociaux peuvent nous enfermer dans une " },
    { type: 'blank', id: 5, answer: "Bulle de filtre" },
    { type: 'text', content: " et favoriser la " },
    { type: 'blank', id: 6, answer: "Désinformation" },
    { type: 'text', content: ". Passer trop d'heures connecté augmente le " },
    { type: 'blank', id: 7, answer: "Temps d'écran" },
    { type: 'text', content: " et peut créer une " },
    { type: 'blank', id: 8, answer: "Dépendance numérique" },
    { type: 'text', content: ". Enfin, soyons bienveillants pour lutter contre le " },
    { type: 'blank', id: 9, answer: "Harcèlement en ligne" },
    { type: 'text', content: "." }
  ],
  words: [
    "Bulle de filtre",
    "Cybersécurité",
    "Dépendance numérique",
    "Désinformation",
    "E-réputation",
    "Empreinte numérique",
    "Hameçonnage",
    "Harcèlement en ligne",
    "Paramètres de confidentialité",
    "Temps d'écran"
  ]
};

function FillInTheBlankGame({ data }) {
  const [blanks, setBlanks] = useState(Array(data.blanksCount).fill(null));
  const [selectedBlank, setSelectedBlank] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleBlankClick = (id) => {
    if (showResults) return;
    setSelectedBlank(id);
  };

  const handleWordClick = (word) => {
    if (selectedBlank === null || showResults) return;
    
    const newBlanks = [...blanks];
    const existingIndex = newBlanks.indexOf(word);
    if (existingIndex !== -1) {
      newBlanks[existingIndex] = null;
    }
    
    newBlanks[selectedBlank] = word;
    setBlanks(newBlanks);
    
    const nextEmpty = newBlanks.findIndex(b => b === null);
    setSelectedBlank(nextEmpty !== -1 ? nextEmpty : null);
  };

  const handleRemoveWord = (e, id) => {
    e.stopPropagation();
    if (showResults) return;
    const newBlanks = [...blanks];
    newBlanks[id] = null;
    setBlanks(newBlanks);
    setSelectedBlank(id);
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const reset = () => {
    setBlanks(Array(data.blanksCount).fill(null));
    setSelectedBlank(null);
    setShowResults(false);
  };

  const isAllFilled = blanks.every(b => b !== null);
  const correctCount = blanks.reduce((acc, word, idx) => {
    const expected = data.text.find(p => p.type === 'blank' && p.id === idx).answer;
    return acc + (word === expected ? 1 : 0);
  }, 0);

  return (
    <div className="fill-in-container glass-panel">
      <h3 className="mb-4">{data.title}</h3>
      <p className="instructions">
        Complète le texte ci-dessous en sélectionnant un espace vide, puis en choisissant le bon mot dans la banque de mots.
      </p>

      <div className="text-passage">
        {data.text.map((part, index) => {
          if (part.type === 'text') {
            return <span key={index}>{part.content}</span>;
          } else {
            const blankId = part.id;
            const filledWord = blanks[blankId];
            const isSelected = selectedBlank === blankId;
            
            let resultClass = '';
            if (showResults) {
              resultClass = filledWord === part.answer ? 'correct' : 'incorrect';
            }

            return (
              <span 
                key={index} 
                className={`blank-slot ${isSelected ? 'selected' : ''} ${filledWord ? 'filled' : ''} ${resultClass}`}
                onClick={() => handleBlankClick(blankId)}
              >
                {filledWord ? (
                  <>
                    {filledWord}
                    {!showResults && (
                      <button className="remove-word" onClick={(e) => handleRemoveWord(e, blankId)}>×</button>
                    )}
                  </>
                ) : (
                  '________'
                )}
              </span>
            );
          }
        })}
      </div>

      <div className="word-bank-section">
        <h4 className="mb-2 text-accent">Banque de mots</h4>
        <div className="word-bank">
          {data.words.map((word, i) => {
            const isUsed = blanks.includes(word);
            return (
              <button 
                key={i} 
                className={`word-btn ${isUsed ? 'used' : ''}`}
                onClick={() => handleWordClick(word)}
                disabled={showResults}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      <div className="action-section">
        {!showResults ? (
          <button 
            className="check-btn" 
            disabled={!isAllFilled} 
            onClick={checkAnswers}
          >
            Vérifier les réponses
          </button>
        ) : (
          <div className="results-container">
            <h3 className={correctCount === data.blanksCount ? 'text-success' : 'text-danger'}>
              Résultat : {correctCount} / {data.blanksCount}
            </h3>
            {correctCount < data.blanksCount && (
              <button className="retry-btn" onClick={reset}>Réessayer</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const UNIT_4_DATA = {
  title: "Leçon : La pauvreté en France",
  blanksCount: 10,
  text: [
    { type: 'text', content: "En France, face à l'augmentation du " },
    { type: 'blank', id: 0, answer: "Coût de la vie" },
    { type: 'text', content: " et aux " },
    { type: 'blank', id: 1, answer: "Inégalités sociales" },
    { type: 'text', content: ", de plus en plus de familles se retrouvent dans une grande " },
    { type: 'blank', id: 2, answer: "Précarité" },
    { type: 'text', content: ". Le problème du " },
    { type: 'blank', id: 3, answer: "Mal-logement" },
    { type: 'text', content: " touche de nombreuses personnes, ce qui conduit malheureusement certains à devenir des " },
    { type: 'blank', id: 4, answer: "Sans-abri" },
    { type: 'text', content: ". Pour lutter contre cette grave " },
    { type: 'blank', id: 5, answer: "Exclusion sociale" },
    { type: 'text', content: ", l'État a mis en place des " },
    { type: 'blank', id: 6, answer: "Aides sociales" },
    { type: 'text', content: " comme le " },
    { type: 'blank', id: 7, answer: "RSA" },
    { type: 'text', content: " pour garantir un revenu minimum. Par ailleurs, on observe de nombreuses initiatives menées par chaque " },
    { type: 'blank', id: 8, answer: "Association caritative" },
    { type: 'text', content: " sur le terrain. Elles tentent notamment de faciliter l'" },
    { type: 'blank', id: 9, answer: "Insertion professionnelle" },
    { type: 'text', content: " pour aider les individus à briser le cercle vicieux." }
  ],
  words: [
    "Association caritative",
    "Aides sociales",
    "Coût de la vie",
    "Exclusion sociale",
    "Inégalités sociales",
    "Insertion professionnelle",
    "Mal-logement",
    "Précarité",
    "RSA",
    "Sans-abri"
  ]
};

const REPRISE_DATA = {
  title: "Leçon : Rentrée et Prépositions de base",
  blanksCount: 8,
  text: [
    { type: 'text', content: "Pour la rentrée scolaire, tous les élèves se rassemblent " },
    { type: 'blank', id: 0, answer: "Devant le collège" },
    { type: 'text', content: ". Certains arrivent " },
    { type: 'blank', id: 1, answer: "À pied / À vélo" },
    { type: 'text', content: ", tandis que d'autres préfèrent venir " },
    { type: 'blank', id: 2, answer: "En train / En avion" },
    { type: 'text', content: " ou en transport en commun. " },
    { type: 'blank', id: 3, answer: "Entre deux cours" },
    { type: 'text', content: ", les camarades de classe discutent de leurs vacances d'été. Sophie raconte son incroyable voyage " },
    { type: 'blank', id: 4, answer: "En France / À Paris" },
    { type: 'text', content: ". Malheureusement, Lucas s'est blessé et a dû se rendre " },
    { type: 'blank', id: 5, answer: "Chez le médecin / Chez moi" },
    { type: 'text', content: ". Malgré ces petites aventures, tout le monde travaille " },
    { type: 'blank', id: 6, answer: "Avec enthousiasme" },
    { type: 'text', content: " " },
    { type: 'blank', id: 7, answer: "Pour réussir" },
    { type: 'text', content: " cette nouvelle année d'immersion !" }
  ],
  words: [
    "Devant le collège",
    "À pied / À vélo",
    "En train / En avion",
    "Entre deux cours",
    "En France / À Paris",
    "Chez le médecin / Chez moi",
    "Avec enthousiasme",
    "Pour réussir"
  ]
};

export default function VocabFillInTheBlank({ unitId }) {
  if (unitId === 'reprise') {
    return <FillInTheBlankGame data={REPRISE_DATA} />;
  }

  if (unitId === '3') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <FillInTheBlankGame data={UNIT_3_DATA} />
        <FillInTheBlankGame data={UNIT_3_TECH_DATA} />
      </div>
    );
  }

  const data = unitId === '4' ? UNIT_4_DATA : unitId === '2' ? UNIT_2_DATA : UNIT_1_DATA;
  return <FillInTheBlankGame data={data} />;
}
