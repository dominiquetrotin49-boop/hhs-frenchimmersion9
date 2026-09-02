const fs = require("fs");
const file = "src/components/sections/CrosswordSection.jsx";
let content = fs.readFileSync(file, "utf8");

const startKey = "const AUX_PUZZLE = {";
const endKey = "const IRR_PUZZLE_1 = {";

const startIndex = content.indexOf(startKey);
const endIndex = content.indexOf(endKey);

if (startIndex !== -1 && endIndex !== -1) {
  const newAuxBlock = `const AUX_PUZZLE = {
  title: "Mots Croisés: Être & Avoir",
  description: "Remplissez la grille avec les conjugaisons correctes de Être et Avoir.",
  numRows: 9,
  numCols: 6,
  puzzleData: [
    { id: 1, word: "SOMMES", r: 2, c: 0, dir: "across", clue: "Nous + Être" },
    { id: 2, word: "ÊTES",   r: 0, c: 4, dir: "down",   clue: "Vous + Être" },
    { id: 3, word: "AVONS",  r: 5, c: 0, dir: "across", clue: "Nous + Avoir" },
    { id: 4, word: "AS",     r: 8, c: 3, dir: "across", clue: "Tu + Avoir" },
    { id: 5, word: "SONT",   r: 0, c: 2, dir: "down",   clue: "Ils/Elles + Être" },
    { id: 6, word: "ONT",    r: 5, c: 2, dir: "down",   clue: "Ils/Elles + Avoir" },
    { id: 7, word: "SUIS",   r: 5, c: 4, dir: "down",   clue: "Je + Être" },
    { id: 8, word: "EST",    r: 7, c: 0, dir: "across", clue: "Il/Elle + Être" }
  ]
};

`;
  content = content.slice(0, startIndex) + newAuxBlock + content.slice(endIndex);
  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully updated with AS!");
} else {
  console.log("Could not locate AUX_PUZZLE block.");
}
