export const patternDetectiveQuestions = [
  // EASY (10 questions)
  {
    id: "pd-easy-01",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Each row increments by 1 from left to right.",
    grid: [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["8", "9", "10", "11"],
    correctAnswer: "9",
    explanation: "The grid contains sequential integers from 1 to 9. The final cell in the 3rd row is 9.",
    hint: "Count in order from 1 to 9 across rows."
  },
  {
    id: "pd-easy-02",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Each cell in a row contains matching shapes, or alternating symbols.",
    grid: [
      ["▲", "▲", "▲"],
      ["■", "■", "■"],
      ["●", "●", "?"]
    ],
    question: "What shape replaces the question mark (?)?",
    choices: ["▲", "■", "●", "◆"],
    correctAnswer: "●",
    explanation: "Every row is composed of three identical geometric symbols. Row 3 has circles (●).",
    hint: "Look at the other shapes in the bottom row."
  },
  {
    id: "pd-easy-03",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Letters increment by 1 across the English alphabet.",
    grid: [
      ["A", "B", "C"],
      ["D", "E", "F"],
      ["G", "H", "?"]
    ],
    question: "What letter replaces the question mark (?)?",
    choices: ["H", "I", "J", "K"],
    correctAnswer: "I",
    explanation: "Consecutive letters of the alphabet reading row by row: A, B, C, D, E, F, G, H, I.",
    hint: "Which letter comes right after H?"
  },
  {
    id: "pd-easy-04",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Even numbers increasing by 2 across rows.",
    grid: [
      ["2", "4", "6"],
      ["8", "10", "12"],
      ["14", "16", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["17", "18", "20", "22"],
    correctAnswer: "18",
    explanation: "Even numbers increasing by 2. 16 + 2 = 18.",
    hint: "Add 2 to 16."
  },
  {
    id: "pd-easy-05",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Each row repeats three distinct symbols without duplication.",
    grid: [
      ["🔴", "🟢", "🔵"],
      ["🔵", "🔴", "🟢"],
      ["🟢", "🔵", "?"]
    ],
    question: "Which colored circle completes the 3x3 Latin square?",
    choices: ["🔴", "🟢", "🔵", "🟡"],
    correctAnswer: "🔴",
    explanation: "Each row and column must contain exactly one red, green, and blue circle. Row 3 is missing red (🔴).",
    hint: "Each row must have one of each color: Red, Green, and Blue."
  },
  {
    id: "pd-easy-06",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Columns increment by 10 downwards.",
    grid: [
      ["10", "20", "30"],
      ["20", "30", "40"],
      ["30", "40", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["45", "50", "55", "60"],
    correctAnswer: "50",
    explanation: "Each row shifts +10 to the right, and each column adds 10 downwards. 40 + 10 = 50.",
    hint: "Row 3 increments by 10: 30, 40, 50."
  },
  {
    id: "pd-easy-07",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Third column is the sum of the first two columns in each row.",
    grid: [
      ["1", "2", "3"],
      ["2", "3", "5"],
      ["3", "4", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["6", "7", "8", "9"],
    correctAnswer: "7",
    explanation: "Column 1 + Column 2 = Column 3. For row 3: 3 + 4 = 7.",
    hint: "Add the first two numbers in row 3 (3 + 4)."
  },
  {
    id: "pd-easy-08",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Diagonal symmetry across a 3x3 letter grid.",
    grid: [
      ["X", "O", "X"],
      ["O", "X", "O"],
      ["X", "O", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["X", "O", "+", "#"],
    correctAnswer: "X",
    explanation: "Checkerboard alternating pattern of X and O. The bottom-right corner must be X.",
    hint: "Look at the diagonal from top-left to bottom-right."
  },
  {
    id: "pd-easy-09",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Multiples of 5 in sequence.",
    grid: [
      ["5", "10", "15"],
      ["20", "25", "30"],
      ["35", "40", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["42", "45", "50", "55"],
    correctAnswer: "45",
    explanation: "Sequential multiples of 5. 40 + 5 = 45.",
    hint: "Add 5 to 40."
  },
  {
    id: "pd-easy-10",
    gameType: "pattern-detective",
    difficulty: "easy",
    description: "Arrows rotating 90 degrees clockwise across each row.",
    grid: [
      ["↑", "→", "↓"],
      ["→", "↓", "←"],
      ["↓", "←", "?"]
    ],
    question: "Which arrow completes the rotation pattern?",
    choices: ["↑", "→", "↓", "←"],
    correctAnswer: "↑",
    explanation: "Each step rotates the arrow 90 degrees clockwise (↑ → ↓ ← ↑). After '←', the next direction is '↑'.",
    hint: "Turn the arrow 90 degrees clockwise from ←."
  },

  // MEDIUM (10 questions)
  {
    id: "pd-med-01",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Third column is the product of the first two columns.",
    grid: [
      ["2", "3", "6"],
      ["3", "4", "12"],
      ["4", "5", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["18", "20", "22", "24"],
    correctAnswer: "20",
    explanation: "Row rule: Col 1 × Col 2 = Col 3. In the 3rd row: 4 × 5 = 20.",
    hint: "Multiply the first two numbers in the row."
  },
  {
    id: "pd-med-02",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Numbers represent perfect squares.",
    grid: [
      ["1", "4", "9"],
      ["16", "25", "36"],
      ["49", "64", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["72", "81", "96", "100"],
    correctAnswer: "81",
    explanation: "Grid of consecutive squares from 1² to 9². 9² = 81.",
    hint: "What is 9 squared (9 × 9)?"
  },
  {
    id: "pd-med-03",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Each row sums to a constant total of 15 (Magic Square).",
    grid: [
      ["8", "1", "6"],
      ["3", "5", "7"],
      ["4", "9", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["1", "2", "3", "5"],
    correctAnswer: "2",
    explanation: "Standard 3x3 Magic Square where every row, column, and diagonal sums to 15. For row 3: 4 + 9 + ? = 15 => ? = 2.",
    hint: "Every row must add up to 15 (4 + 9 + ? = 15)."
  },
  {
    id: "pd-med-04",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Row 3 = (Row 1 × 2) + Row 2.",
    grid: [
      ["2", "4", "6"],
      ["1", "3", "5"],
      ["5", "11", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["15", "17", "18", "21"],
    correctAnswer: "17",
    explanation: "Column rule: (Row 1 × 2) + Row 2 = Row 3. Col 3: (6 × 2) + 5 = 12 + 5 = 17.",
    hint: "Double the top number and add the middle number."
  },
  {
    id: "pd-med-05",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Roman numerals increasing sequentially.",
    grid: [
      ["I", "II", "III"],
      ["IV", "V", "VI"],
      ["VII", "VIII", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["IX", "X", "XI", "XII"],
    correctAnswer: "IX",
    explanation: "Consecutive Roman numerals from 1 to 9. 9 in Roman numerals is IX.",
    hint: "What is Roman numeral 9?"
  },
  {
    id: "pd-med-06",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Fibonacci progression wrapping across the grid.",
    grid: [
      ["1", "1", "2"],
      ["3", "5", "8"],
      ["13", "21", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["31", "34", "38", "42"],
    correctAnswer: "34",
    explanation: "Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34. 13 + 21 = 34.",
    hint: "Add the two preceding numbers (13 + 21)."
  },
  {
    id: "pd-med-07",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Right column equals (Left Column)² - Middle Column.",
    grid: [
      ["3", "4", "5"],
      ["4", "7", "9"],
      ["5", "9", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["14", "16", "18", "20"],
    correctAnswer: "16",
    explanation: "Col 3 = (Col 1)² - Col 2: (3²-4=5), (4²-7=9), (5²-9 = 25 - 9 = 16).",
    hint: "Square the first number and subtract the middle number (5² - 9)."
  },
  {
    id: "pd-med-08",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Powers of 2 across rows.",
    grid: [
      ["2", "4", "8"],
      ["16", "32", "64"],
      ["128", "256", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["384", "480", "512", "1024"],
    correctAnswer: "512",
    explanation: "Powers of 2: 2^1 through 2^9. 256 × 2 = 512.",
    hint: "Double 256."
  },
  {
    id: "pd-med-09",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Sum of digits in each row equals 9.",
    grid: [
      ["1", "3", "5"],
      ["2", "3", "4"],
      ["4", "3", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["1", "2", "3", "4"],
    correctAnswer: "2",
    explanation: "Each row sums to 9: 1+3+5=9, 2+3+4=9, 4+3+? = 9 => ? = 2.",
    hint: "4 + 3 + ? = 9."
  },
  {
    id: "pd-med-10",
    gameType: "pattern-detective",
    difficulty: "medium",
    description: "Prime numbers in increasing order.",
    grid: [
      ["2", "3", "5"],
      ["7", "11", "13"],
      ["17", "19", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["21", "23", "25", "27"],
    correctAnswer: "23",
    explanation: "Consecutive prime numbers. The next prime after 19 is 23.",
    hint: "Find the next prime number after 19."
  },

  // HARD (10 questions)
  {
    id: "pd-hard-01",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Bottom row equals (Top Row)² + (Middle Row)².",
    grid: [
      ["2", "3", "4"],
      ["3", "4", "5"],
      ["13", "25", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["36", "41", "45", "52"],
    correctAnswer: "41",
    explanation: "Column rule: (Row 1)² + (Row 2)² = Row 3. Col 1: 2²+3²=13. Col 2: 3²+4²=25. Col 3: 4²+5² = 16 + 25 = 41.",
    hint: "Square the top number and add the square of the middle number (4² + 5²)."
  },
  {
    id: "pd-hard-02",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Center cell is the product of corners divided by 4.",
    grid: [
      ["3", "5", "4"],
      ["2", "6", "8"],
      ["8", "7", "?"]
    ],
    question: "What replaces the question mark (?) if Row Sums = 12, 16, 20?",
    choices: ["3", "4", "5", "6"],
    correctAnswer: "5",
    explanation: "Row sums form an arithmetic sequence: Row 1 = 3+5+4=12. Row 2 = 2+6+8=16. Row 3 sum must be 20: 8+7+? = 20 => ? = 5.",
    hint: "The row totals increase by 4: 12, 16, 20."
  },
  {
    id: "pd-hard-03",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Right column = (Left Column × Middle Column) - (Left + Middle).",
    grid: [
      ["4", "5", "11"],
      ["5", "6", "19"],
      ["6", "7", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["27", "29", "31", "35"],
    correctAnswer: "29",
    explanation: "Formula: (a × b) - (a + b). Row 1: 20 - 9 = 11. Row 2: 30 - 11 = 19. Row 3: (6 × 7) - (6 + 7) = 42 - 13 = 29.",
    hint: "(6 × 7) minus (6 + 7)."
  },
  {
    id: "pd-hard-04",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Cubes of consecutive integers.",
    grid: [
      ["1", "8", "27"],
      ["64", "125", "216"],
      ["343", "512", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["648", "729", "800", "1000"],
    correctAnswer: "729",
    explanation: "Consecutive cubes 1³ through 9³. 9³ = 9 × 9 × 9 = 729.",
    hint: "What is 9 cubed (9³)?."
  },
  {
    id: "pd-hard-05",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Factorials (n!) in order.",
    grid: [
      ["1", "2", "6"],
      ["24", "120", "720"],
      ["5040", "40320", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["181440", "362880", "403200", "725760"],
    correctAnswer: "362880",
    explanation: "Factorials from 1! to 9!. 9! = 40320 × 9 = 362,880.",
    hint: "Multiply 40,320 by 9."
  },
  {
    id: "pd-hard-06",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Row 3 = (Row 1)³ - (Row 2)².",
    grid: [
      ["2", "3", "4"],
      ["2", "4", "6"],
      ["4", "11", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["24", "28", "32", "36"],
    correctAnswer: "28",
    explanation: "Column rule: (Row 1)³ - (Row 2)² = Row 3. Col 1: 2³ - 2² = 8 - 4 = 4. Col 2: 3³ - 4² = 27 - 16 = 11. Col 3: 4³ - 6² = 64 - 36 = 28.",
    hint: "4³ minus 6² = 64 - 36."
  },
  {
    id: "pd-hard-07",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Binary representation of numbers 1 to 9.",
    grid: [
      ["001", "010", "011"],
      ["100", "101", "110"],
      ["111", "1000", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["1001", "1010", "1011", "1100"],
    correctAnswer: "1001",
    explanation: "Binary numbers representing 1, 2, 3, 4, 5, 6, 7, 8, 9. Decimal 9 in binary is 1001.",
    hint: "What is decimal 9 in binary (8 + 1)?"
  },
  {
    id: "pd-hard-08",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Each column product equals 120.",
    grid: [
      ["2", "3", "4"],
      ["12", "8", "6"],
      ["5", "5", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["4", "5", "6", "8"],
    correctAnswer: "5",
    explanation: "Column product = 120. Col 1: 2×12×5 = 120. Col 2: 3×8×5 = 120. Col 3: 4×6×? = 120 => 24 × ? = 120 => ? = 5.",
    hint: "Top × Middle × Bottom = 120 for each column (4 × 6 × ? = 120)."
  },
  {
    id: "pd-hard-09",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Triangular numbers n(n+1)/2.",
    grid: [
      ["1", "3", "6"],
      ["10", "15", "21"],
      ["28", "36", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["42", "45", "48", "50"],
    correctAnswer: "45",
    explanation: "Triangular numbers: 1, 3, 6, 10, 15, 21, 28, 36, 45 (differences +2, +3, +4, +5, +6, +7, +8, +9). 36 + 9 = 45.",
    hint: "Add 9 to 36."
  },
  {
    id: "pd-hard-10",
    gameType: "pattern-detective",
    difficulty: "hard",
    description: "Alternating sign arithmetic progression with nested squares.",
    grid: [
      ["3", "8", "15"],
      ["24", "35", "48"],
      ["63", "80", "?"]
    ],
    question: "What replaces the question mark (?)?",
    choices: ["95", "99", "100", "108"],
    correctAnswer: "99",
    explanation: "Pattern is n² - 1: 2²-1=3, 3²-1=8, 4²-1=15, 5²-1=24, 6²-1=35, 7²-1=48, 8²-1=63, 9²-1=80, 10²-1 = 100 - 1 = 99.",
    hint: "10² minus 1 = 100 - 1."
  }
];

export default patternDetectiveQuestions;
