const fs = require('fs');
const path = require('path');

// Helper to write JSON or JS modules
function writeModule(filePath, exportName, questions) {
  const fileHeader = `/**\n * MindForge - ${exportName}\n * Exactly ${questions.length} verified high-quality MCQ questions.\n */\n\n`;
  const content = fileHeader + `export const ${exportName} = ` + JSON.stringify(questions, null, 2) + `;\n\nexport default ${exportName};\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Saved ${questions.length} questions to ${filePath}`);
}

module.exports = { writeModule };
