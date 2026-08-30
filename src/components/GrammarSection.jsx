import React, { useState } from 'react';
import { GRAMMAR_DATA, GRAMMAR_DATA_UNIT_2, GRAMMAR_DATA_UNIT_3, GRAMMAR_DATA_UNIT_4, GRAMMAR_DATA_REPRISE } from '../data/grammar';
import { ChevronDown, ChevronUp, Book } from 'lucide-react';
import './GrammarSection.css';

export default function GrammarSection({ unitId }) {
  const [openFolderId, setOpenFolderId] = useState(null);

  const dataToUse = unitId === 'reprise' 
    ? GRAMMAR_DATA_REPRISE 
    : unitId === '4' 
      ? GRAMMAR_DATA_UNIT_4 
      : unitId === '3' 
        ? GRAMMAR_DATA_UNIT_3 
        : unitId === '2' 
          ? GRAMMAR_DATA_UNIT_2 
          : GRAMMAR_DATA;

  const sectionTitle = unitId === 'reprise' 
    ? "La Rentrée (Révision)" 
    : unitId === '4' 
      ? "Le Passé" 
      : unitId === '3' 
        ? "Les Pronoms" 
        : "Le Présent";

  const toggleFolder = (id) => {
    if (openFolderId === id) {
      setOpenFolderId(null);
    } else {
      setOpenFolderId(id);
    }
  };

  return (
    <div className="grammar-container">
      <h3 className="mb-4">Dossiers de Grammaire : {sectionTitle}</h3>
      
      <div className="folders-grid">
        {dataToUse.map((folder) => {
          const isOpen = openFolderId === folder.id;
          
          return (
            <div key={folder.id} className={`grammar-folder ${isOpen ? 'open' : ''}`}>
              <div 
                className="folder-header glass-panel" 
                onClick={() => toggleFolder(folder.id)}
              >
                <div className="folder-title">
                  <Book size={20} className="text-accent" />
                  <h4>{folder.title}</h4>
                </div>
                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
              
              {isOpen && (
                <div className="folder-content glass-panel">
                  {/* Rules */}
                  <div className="grammar-rules">
                    <h5 className="text-accent">Règles :</h5>
                    <ul>
                      {folder.rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Regular Example */}
                  {folder.example && (
                    <div className="conjugation-section">
                      <h5 className="text-success mb-2">Verbe Régulier :</h5>
                      <div className="verbs-flex">
                        <div className="verb-container">
                          <div className="verb-title">{folder.example.infinitive}</div>
                          <div className="conjugation-table">
                            {folder.example.conjugation.map((conj, idx) => (
                              <div key={idx} className="conjugation-row">
                                <span className="pronoun">{conj.pronoun}</span>
                                <span className="verb">{conj.verb}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Irregular Verbs */}
                  {folder.irregulars && folder.irregulars.length > 0 && (
                    <div className="irregular-section mt-4">
                      <h5 className="text-danger mb-2">Verbes Irréguliers Courants :</h5>
                      <div className="verbs-flex">
                        {folder.irregulars.map((irr, idx) => (
                          <div key={idx} className="verb-container">
                            <div className="verb-title">{irr.infinitive}</div>
                            <div className="conjugation-table">
                              {irr.conjugation.map((conj, i) => (
                                <div key={i} className="conjugation-row">
                                  <span className="pronoun">{conj.pronoun}</span>
                                  <span className="verb">{conj.verb}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
