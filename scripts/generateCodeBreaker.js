const fs = require('fs');
const path = require('path');

// Evaluates a candidate guess against a secret code
function evaluateClue(guess, secret) {
  const gDigits = String(guess).split('');
  const sDigits = String(secret).split('');
  let correctPos = 0;
  let wrongPos = 0;

  const unmatchedG = [];
  const unmatchedS = [];

  for (let i = 0; i < gDigits.length; i++) {
    if (gDigits[i] === sDigits[i]) {
      correctPos++;
    } else {
      unmatchedG.push(gDigits[i]);
      unmatchedS.push(sDigits[i]);
    }
  }

  for (const digit of unmatchedG) {
    const idx = unmatchedS.indexOf(digit);
    if (idx !== -1) {
      wrongPos++;
      unmatchedS.splice(idx, 1);
    }
  }

  return { correctPos, wrongPos };
}

// Builds human-readable clue text from correct and wrong position counts
function formatClueText(correctPos, wrongPos, digitCount = 3) {
  if (correctPos === 0 && wrongPos === 0) {
    return 'No digit is correct';
  }
  if (correctPos === 1 && wrongPos === 0) {
    return 'One digit is correct and in the correct position';
  }
  if (correctPos === 2 && wrongPos === 0) {
    return 'Two digits are correct and in the correct positions';
  }
  if (correctPos === 3 && wrongPos === 0) {
    return 'Three digits are correct and in the correct positions';
  }
  if (correctPos === 0 && wrongPos === 1) {
    return 'One digit is correct but in the wrong position';
  }
  if (correctPos === 0 && wrongPos === 2) {
    return 'Two digits are correct but in the wrong positions';
  }
  if (correctPos === 0 && wrongPos === 3) {
    return 'Three digits are correct but in the wrong positions';
  }
  if (correctPos === 0 && wrongPos === 4) {
    return 'Four digits are correct but in the wrong positions';
  }
  if (correctPos === 1 && wrongPos === 1) {
    return 'Two digits are correct: one well placed, one misplaced';
  }
  if (correctPos === 1 && wrongPos === 2) {
    return 'Three digits are correct: one well placed, two misplaced';
  }
  if (correctPos === 2 && wrongPos === 1) {
    return 'Three digits are correct: two well placed, one misplaced';
  }
  if (correctPos === 2 && wrongPos === 2) {
    return 'Four digits are correct: two well placed, two misplaced';
  }
  return `${correctPos + wrongPos} digits correct (${correctPos} in right place, ${wrongPos} misplaced)`;
}

// Finds all candidate codes matching a set of clues
function findAllSolutions(clues, digitCount = 3) {
  const max = Math.pow(10, digitCount);
  const solutions = [];

  for (let n = 0; n < max; n++) {
    const candidate = String(n).padStart(digitCount, '0');
    // Check if distinct digits
    const set = new Set(candidate.split(''));
    if (set.size !== digitCount) continue; // standard distinct digits

    let allMatch = true;
    for (const clue of clues) {
      const { correctPos, wrongPos } = evaluateClue(clue.guess, candidate);
      if (correctPos !== clue.correctPos || wrongPos !== clue.wrongPos) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      solutions.push(candidate);
    }
  }

  return solutions;
}

// Helper to auto-create a verified clue set from guesses
function createPuzzle(secret, guesses, title, hint, explanation) {
  const digitCount = secret.length;
  const clues = guesses.map(g => {
    const { correctPos, wrongPos } = evaluateClue(g, secret);
    return {
      guess: g,
      text: formatClueText(correctPos, wrongPos, digitCount),
      correctPos,
      wrongPos
    };
  });

  const sols = findAllSolutions(clues, digitCount);
  if (sols.length !== 1 || sols[0] !== secret) {
    throw new Error(`Puzzle "${title}" with secret ${secret} failed validation! Found ${sols.length} solutions: ${JSON.stringify(sols)}`);
  }

  return {
    secret,
    digitCount,
    title,
    clues,
    hint,
    explanation
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 15 EASY PUZZLES (3-digit distinct)
// ─────────────────────────────────────────────────────────────────────────────
const easyPuzzles = [
  createPuzzle("042", ["682", "614", "206", "738", "780"], "Museum Vault",
    "7, 3, and 8 are completely eliminated from the 4th clue. Look at 682 and 780 next.",
    "From '738' (none correct), 7, 3, 8 are eliminated. In '682' (one right position), 8 is out so either 6 is in pos 1 or 2 is in pos 3. In '614' (one wrong pos), if 6 were correct it contradicts 682's pos 1. Thus 6 is out, 2 is in pos 3. In '780', 0 is in pos 1. In '614', 4 is in pos 2. Secret code: 042."
  ),
  createPuzzle("679", ["147", "189", "964", "523", "286"], "Subway Locker",
    "5, 2, and 3 are eliminated. Use 286 to test 8 vs 6.",
    "5, 2, 3 eliminated. From 286, 2 is out, so either 8 or 6 is correct. In 189 (one correct pos), if 8 were in pos 2, 286 would have 8 in pos 2 (correct pos, not wrong pos), so 8 is out. Thus 6 is correct and 9 is in pos 3. In 964, 9 and 6 are correct, meaning 4 is out. In 147, 1 and 4 are out, so 7 is correct. Code: 679."
  ),
  createPuzzle("384", ["294", "245", "489", "176", "583"], "Bank Strongbox",
    "1, 7, and 6 are out. Compare 294 and 245.",
    "1, 7, 6 are eliminated. In 294 & 245, 2 cannot be correct because it is in pos 1 in both (one says right pos, one says wrong). Thus 4 is in pos 3. In 489, 4 and 8 are correct. In 583, 8 and 3 are correct. Secret code is 384."
  ),
  createPuzzle("426", ["123", "145", "620", "789", "064"], "Art Gallery Safe",
    "7, 8, and 9 are eliminated. Notice '123' and '620' both place 2 in position 2.",
    "7, 8, 9 are eliminated. '123' has 1 right place and '620' has 1 right place (2 in pos 2). From '145', 4 is correct but misplaced (must be in pos 1). From '064', 6 is in pos 3. Code: 426."
  ),
  createPuzzle("158", ["254", "315", "870", "962", "180"], "Jewelry Chest",
    "9, 6, and 2 are out. In '254', 5 is well placed in position 2.",
    "9, 6, 2 are eliminated. In '254', 5 is in position 2. In '315', 1 is correct but misplaced (pos 1). In '180', 8 is misplaced so it belongs in pos 3. Secret: 158."
  ),
  createPuzzle("291", ["893", "275", "182", "460", "914"], "Hotel Safety Deposit",
    "4, 6, 0 eliminated. In '893', 9 is well placed in pos 2.",
    "4, 6, 0 are eliminated. '893' has 9 in pos 2. '275' has 2 in pos 1. '914' has 9 and 1 misplaced, placing 1 in pos 3. Secret: 291."
  ),
  createPuzzle("730", ["538", "791", "246", "370", "804"], "Antique Padlock",
    "2, 4, 6 are eliminated. '538' places 3 in pos 2.",
    "2, 4, 6 eliminated. '538' has 3 in pos 2. '791' has 7 in pos 1. '370' has 3, 7, 0 all correct but misplaced, so 0 is in pos 3. Secret: 730."
  ),
  createPuzzle("582", ["184", "507", "283", "960", "825"], "Cyber Locker",
    "9, 6, 0 are eliminated. 8 is in pos 2 in both 184 and 283.",
    "9, 6, 0 are out. '184' places 8 in pos 2. '507' places 5 in pos 1. '825' has all 3 digits correct but misplaced, putting 2 in pos 3. Secret: 582."
  ),
  createPuzzle("317", ["418", "390", "731", "256", "170"], "Train Depot Lockbox",
    "2, 5, 6 are eliminated. '418' has 1 well placed in pos 2.",
    "2, 5, 6 are eliminated. In '418', 1 is in pos 2. In '390', 3 is in pos 1. In '731', 7 is correct and belongs in pos 3. Secret: 317."
  ),
  createPuzzle("845", ["821", "349", "584", "760", "453"], "Cargo Container Safe",
    "7, 6, 0 are out. 8 is in pos 1 in '821', and 4 is in pos 2 in '349'.",
    "7, 6, 0 out. In '821', 8 is well placed in pos 1. In '349', 4 is in pos 2. '584' has all 3 digits, so 5 is in pos 3. Code: 845."
  ),
  createPuzzle("603", ["671", "804", "360", "952", "037"], "Submarine Hatch",
    "9, 5, 2 are eliminated. '671' places 6 in pos 1, '804' places 0 in pos 2.",
    "9, 5, 2 eliminated. '671' has 6 in pos 1. '804' has 0 in pos 2. '360' has 3 in pos 3. Secret: 603."
  ),
  createPuzzle("928", ["914", "325", "892", "760", "281"], "Observatory Keypad",
    "7, 6, 0 are eliminated. 9 is in pos 1 in '914', 2 is in pos 2 in '325'.",
    "7, 6, 0 out. '914' has 9 in pos 1. '325' has 2 in pos 2. '892' has 8 in pos 3. Secret: 928."
  ),
  createPuzzle("149", ["150", "248", "914", "673", "492"], "Dungeon Iron Gate",
    "6, 7, 3 are out. '150' places 1 in pos 1, '248' places 4 in pos 2.",
    "6, 7, 3 eliminated. 1 is in pos 1, 4 is in pos 2. '914' gives 9 in pos 3. Code: 149."
  ),
  createPuzzle("571", ["520", "673", "157", "894", "716"], "Vintage Trunk",
    "8, 9, 4 are eliminated. '520' has 5 in pos 1, '673' has 7 in pos 2.",
    "8, 9, 4 out. 5 is in pos 1, 7 is in pos 2. '157' gives 1 in pos 3. Secret: 571."
  ),
  createPuzzle("264", ["281", "365", "426", "970", "643"], "Diplomatic Pouch",
    "9, 7, 0 are out. '281' places 2 in pos 1, '365' places 6 in pos 2.",
    "9, 7, 0 out. 2 is in pos 1, 6 is in pos 2. '426' places 4 in pos 3. Secret: 264."
  )
];

console.log(`Verified ${easyPuzzles.length} Easy puzzles.`);

// ─────────────────────────────────────────────────────────────────────────────
// 15 MEDIUM PUZZLES (3-digit distinct with subtler elimination clues)
// ─────────────────────────────────────────────────────────────────────────────
const medPuzzles = [
  createPuzzle("816", ["291", "245", "463", "578", "810"], "Server Room Decryptor",
    "2, 4, 5 are completely eliminated. In 810, two digits are in their exact positions.",
    "2, 4, 5 eliminated. From 578, 8 is correct. In 810, 8 and 1 are well placed in pos 1 and 2. In 463, 6 is in pos 3. Secret code: 816."
  ),
  createPuzzle("941", ["394", "738", "641", "159", "926"], "Encrypted Capsule",
    "7, 3, 8 are eliminated. Notice that in 641, 4 and 1 are well placed.",
    "7, 3, 8 out. In 394, 9 and 4 are correct digits. In 926, 9 is in pos 1. In 641, 4 and 1 are in pos 2 and 3. Secret code: 941."
  ),
  createPuzzle("539", ["138", "524", "953", "760", "391"], "Laser Grid Terminal",
    "7, 6, 0 are out. Compare 138 with 391.",
    "7, 6, 0 out. '138' has 3 in pos 2. '524' has 5 in pos 1. '953' has all three digits misplaced, placing 9 in pos 3. Code: 539."
  ),
  createPuzzle("782", ["185", "740", "278", "963", "824"], "Bank Archive Safe",
    "9, 6, 3 eliminated. '185' places 8 in pos 2, '740' places 7 in pos 1.",
    "9, 6, 3 out. 7 is in pos 1, 8 is in pos 2. '278' gives 2 in pos 3. Code: 782."
  ),
  createPuzzle("415", ["492", "318", "541", "760", "152"], "Research Lab Vault",
    "7, 6, 0 are out. '492' places 4 in pos 1, '318' places 1 in pos 2.",
    "7, 6, 0 out. 4 is in pos 1, 1 is in pos 2. '541' gives 5 in pos 3. Code: 415."
  ),
  createPuzzle("629", ["615", "824", "962", "730", "291"], "Air Traffic Crypt",
    "7, 3, 0 eliminated. '615' places 6 in pos 1, '824' places 2 in pos 2.",
    "7, 3, 0 out. 6 is in pos 1, 2 is in pos 2. '962' gives 9 in pos 3. Code: 629."
  ),
  createPuzzle("374", ["381", "275", "437", "960", "748"], "Satellite Command Deck",
    "9, 6, 0 out. '381' has 3 in pos 1, '275' has 7 in pos 2.",
    "9, 6, 0 out. 3 is in pos 1, 7 is in pos 2. '437' gives 4 in pos 3. Code: 374."
  ),
  createPuzzle("892", ["814", "593", "289", "760", "925"], "Pharaoh Gold Cache",
    "7, 6, 0 out. 8 is in pos 1 in '814', 9 is in pos 2 in '593'.",
    "7, 6, 0 out. 8 is in pos 1, 9 is in pos 2. '289' gives 2 in pos 3. Code: 892."
  ),
  createPuzzle("163", ["145", "962", "316", "870", "638"], "Nuclear Silo Lock",
    "8, 7, 0 are out. 1 is in pos 1, 6 is in pos 2.",
    "8, 7, 0 out. 1 is in pos 1, 6 is in pos 2. '316' gives 3 in pos 3. Code: 163."
  ),
  createPuzzle("548", ["519", "247", "854", "630", "482"], "Quantum Tunnel Safe",
    "6, 3, 0 are out. '519' gives 5 in pos 1, '247' gives 4 in pos 2.",
    "6, 3, 0 out. 5 is in pos 1, 4 is in pos 2. '854' gives 8 in pos 3. Code: 548."
  ),
  createPuzzle("287", ["234", "981", "728", "650", "873"], "Crypto Exchange Ledger",
    "6, 5, 0 out. '234' gives 2 in pos 1, '981' gives 8 in pos 2.",
    "6, 5, 0 out. 2 is in pos 1, 8 is in pos 2. '728' gives 7 in pos 3. Code: 287."
  ),
  createPuzzle("936", ["915", "438", "693", "720", "364"], "Federal Reserve Gate",
    "7, 2, 0 out. '915' has 9 in pos 1, '438' has 3 in pos 2.",
    "7, 2, 0 out. 9 is in pos 1, 3 is in pos 2. '693' gives 6 in pos 3. Code: 936."
  ),
  createPuzzle("471", ["425", "873", "147", "960", "712"], "High Speed Rail Vault",
    "9, 6, 0 out. 4 in pos 1, 7 in pos 2.",
    "9, 6, 0 out. 4 is in pos 1, 7 is in pos 2. '147' gives 1 in pos 3. Code: 471."
  ),
  createPuzzle("652", ["618", "953", "265", "740", "529"], "Deep Sea Airlock",
    "7, 4, 0 out. 6 in pos 1, 5 in pos 2.",
    "7, 4, 0 out. 6 is in pos 1, 5 is in pos 2. '265' gives 2 in pos 3. Code: 652."
  ),
  createPuzzle("395", ["317", "894", "539", "620", "958"], "Orbital Relay Station",
    "6, 2, 0 out. 3 in pos 1, 9 in pos 2.",
    "6, 2, 0 out. 3 is in pos 1, 9 is in pos 2. '539' gives 5 in pos 3. Code: 395."
  )
];

console.log(`Verified ${medPuzzles.length} Medium puzzles.`);

// ─────────────────────────────────────────────────────────────────────────────
// 15 HARD PUZZLES (4-digit distinct)
// ─────────────────────────────────────────────────────────────────────────────
const hardPuzzles = [
  createPuzzle("3185", ["9247", "3605", "8136", "5184", "3785"], "Master Cipher Key",
    "9, 2, 4, 7 are eliminated. Look at 3785 vs 5184.",
    "9, 2, 4, 7 eliminated. In 3785, 7 is out, so 3, 8, 5 are all in correct positions (pos 1, 3, 4). In 5184, 4 is out, 8 is in pos 3, so 1 is in pos 2. Secret code: 3185."
  ),
  createPuzzle("7402", ["1589", "7362", "4720", "0432", "7490"], "Quantum Lock",
    "From 4720, the exact 4 digits in the code are {0, 2, 4, 7}.",
    "From 4720, all four digits are 4, 7, 2, 0. In 7362, 7 and 2 are in correct positions (pos 1 and 4). In 7490, 7 and 4 are in pos 1 and 2. Thus 0 must be in pos 3. Secret code: 7402."
  ),
  createPuzzle("2846", ["1357", "2906", "8264", "4826", "2891"], "Titanium Core Hatch",
    "1, 3, 5, 7 are eliminated from the first clue. Check 2906 next.",
    "1, 3, 5, 7 are out. In '2906', 9 and 0 are out, leaving 2 in pos 1 and 6 in pos 4. '8264' has all 4 digits misplaced, and '2891' gives 8 in pos 2, leaving 4 in pos 3. Code: 2846."
  ),
  createPuzzle("5913", ["2468", "5703", "9531", "1953", "5972"], "Black Box Flight Recorder",
    "2, 4, 6, 8 are eliminated from the first clue. In 5703, 5 and 3 are correct.",
    "2, 4, 6, 8 eliminated. In '5703', 7 and 0 are out, leaving 5 in pos 1 and 3 in pos 4. In '5972', 9 is in pos 2. In '9531', 1 is in pos 3. Secret: 5913."
  ),
  createPuzzle("6381", ["5249", "6701", "3618", "8361", "6397"], "Deep Space Transponder",
    "5, 2, 4, 9 are eliminated from the first clue.",
    "5, 2, 4, 9 eliminated. In '6701', 6 is in pos 1 and 1 is in pos 4. In '6397', 3 is in pos 2. In '3618', 8 must be in pos 3. Code: 6381."
  ),
  createPuzzle("1749", ["2358", "1609", "7194", "4719", "1762"], "Subterranean Reactor Gate",
    "2, 3, 5, 8 are eliminated. In '1609', 1 is in pos 1 and 9 is in pos 4.",
    "2, 3, 5, 8 eliminated. In '1609', 1 is in pos 1 and 9 is in pos 4. In '1762', 7 is in pos 2. '7194' gives 4 in pos 3. Code: 1749."
  ),
  createPuzzle("8254", ["1369", "8704", "2845", "5284", "8271"], "Diplomatic Bunker Vault",
    "1, 3, 6, 9 are eliminated. Check '8704' for pos 1 and pos 4.",
    "1, 3, 6, 9 eliminated. In '8704', 8 is in pos 1 and 4 is in pos 4. In '8271', 2 is in pos 2. '2845' gives 5 in pos 3. Code: 8254."
  ),
  createPuzzle("4927", ["1358", "4607", "9472", "2947", "4961"], "Nanotech Synthesis Cell",
    "1, 3, 5, 8 are eliminated. Check '4607'.",
    "1, 3, 5, 8 out. In '4607', 4 is in pos 1 and 7 is in pos 4. In '4961', 9 is in pos 2. '9472' places 2 in pos 3. Code: 4927."
  ),
  createPuzzle("7163", ["2458", "7903", "1736", "6173", "7192"], "Cosmic Ray Observatory",
    "2, 4, 5, 8 are eliminated. '7903' gives 7 in pos 1 and 3 in pos 4.",
    "2, 4, 5, 8 out. In '7903', 7 is in pos 1 and 3 is in pos 4. In '7192', 1 is in pos 2. '1736' gives 6 in pos 3. Code: 7163."
  ),
  createPuzzle("3851", ["2469", "3701", "8315", "5831", "3872"], "Atmospheric Shield Generator",
    "2, 4, 6, 9 are eliminated from the first clue.",
    "2, 4, 6, 9 out. In '3701', 3 is in pos 1 and 1 is in pos 4. In '3872', 8 is in pos 2. '8315' gives 5 in pos 3. Code: 3851."
  ),
  createPuzzle("9472", ["1368", "9502", "4927", "7492", "9451"], "Superconducting Core Safe",
    "1, 3, 6, 8 are out. In '9502', 9 is in pos 1 and 2 is in pos 4.",
    "1, 3, 6, 8 out. In '9502', 9 is in pos 1 and 2 is in pos 4. In '9451', 4 is in pos 2. '4927' gives 7 in pos 3. Code: 9472."
  ),
  createPuzzle("5296", ["1348", "5706", "2569", "9256", "5271"], "Hyperspace Jump Portal",
    "1, 3, 4, 8 are eliminated from the first clue.",
    "1, 3, 4, 8 out. In '5706', 5 is in pos 1 and 6 is in pos 4. In '5271', 2 is in pos 2. '2569' gives 9 in pos 3. Code: 5296."
  ),
  createPuzzle("2638", ["1459", "2708", "6283", "3628", "2671"], "AI Training Cluster Vault",
    "1, 4, 5, 9 are eliminated. '2708' places 2 in pos 1 and 8 in pos 4.",
    "1, 4, 5, 9 out. In '2708', 2 is in pos 1 and 8 is in pos 4. In '2671', 6 is in pos 2. '6283' gives 3 in pos 3. Code: 2638."
  ),
  createPuzzle("6184", ["2359", "6704", "1648", "8164", "6172"], "Bio-Containment Unit 7",
    "2, 3, 5, 9 are eliminated. '6704' gives 6 in pos 1 and 4 in pos 4.",
    "2, 3, 5, 9 out. In '6704', 6 is in pos 1 and 4 is in pos 4. In '6172', 1 is in pos 2. '1648' gives 8 in pos 3. Code: 6184."
  ),
  createPuzzle("8375", ["1249", "8605", "3857", "7385", "8361"], "Quantum Teleportation Array",
    "1, 2, 4, 9 are eliminated. '8605' gives 8 in pos 1 and 5 in pos 4.",
    "1, 2, 4, 9 out. In '8605', 8 is in pos 1 and 5 is in pos 4. In '8361', 3 is in pos 2. '3857' gives 7 in pos 3. Code: 8375."
  )
];

console.log(`Verified ${hardPuzzles.length} Hard puzzles.`);

const curatedPuzzles = {
  EASY: easyPuzzles,
  MEDIUM: medPuzzles,
  HARD: hardPuzzles
};

// Write out to codeBreakerGenerator.js
const genPath = path.join(__dirname, '../frontend/src/utils/codeBreakerGenerator.js');
let genContent = fs.readFileSync(genPath, 'utf8');

// Replace CURATED_CODE_PUZZLES in codeBreakerGenerator.js
const regex = /export const CURATED_CODE_PUZZLES = \{[\s\S]*?\n\};\n/m;
const newCuratedStr = `export const CURATED_CODE_PUZZLES = ` + JSON.stringify(curatedPuzzles, null, 2) + `;\n`;
genContent = genContent.replace(regex, newCuratedStr);
fs.writeFileSync(genPath, genContent, 'utf8');
console.log(`Updated CURATED_CODE_PUZZLES in ${genPath}`);

// Write out codeBreakerQuestions.js
const cbQuestions = [
  ...curatedPuzzles.EASY.map((p, i) => ({
    id: `cb-easy-${i + 1}`,
    difficulty: 'EASY',
    category: 'Logic',
    title: p.title,
    secret: p.secret,
    digitCount: p.digitCount,
    clues: p.clues,
    hint: p.hint,
    explanation: p.explanation,
    correctAnswer: p.secret,
  })),
  ...curatedPuzzles.MEDIUM.map((p, i) => ({
    id: `cb-med-${i + 1}`,
    difficulty: 'MEDIUM',
    category: 'Logic',
    title: p.title,
    secret: p.secret,
    digitCount: p.digitCount,
    clues: p.clues,
    hint: p.hint,
    explanation: p.explanation,
    correctAnswer: p.secret,
  })),
  ...curatedPuzzles.HARD.map((p, i) => ({
    id: `cb-hard-${i + 1}`,
    difficulty: 'HARD',
    category: 'Logic',
    title: p.title,
    secret: p.secret,
    digitCount: p.digitCount,
    clues: p.clues,
    hint: p.hint,
    explanation: p.explanation,
    correctAnswer: p.secret,
  }))
];

const cbPath = path.join(__dirname, '../frontend/src/data/codeBreakerQuestions.js');
const cbHeader = `/**\n * MindForge - codeBreakerQuestions\n * Exactly ${cbQuestions.length} verified single-solution deduction puzzles.\n * 15 Easy | 15 Medium | 15 Hard\n */\n\n`;
const cbFullContent = cbHeader + `export const codeBreakerQuestions = ` + JSON.stringify(cbQuestions, null, 2) + `;\n\nexport default codeBreakerQuestions;\n`;
fs.writeFileSync(cbPath, cbFullContent, 'utf8');
console.log(`Successfully wrote ${cbQuestions.length} puzzles to ${cbPath}`);
