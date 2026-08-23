export const numberDetectiveQuestions = [
  // EASY (10 questions)
  {
    id: "nd-easy-01",
    gameType: "number-detective",
    difficulty: "easy",
    question: "2, 4, 8, 16, ?",
    options: ["24", "30", "32", "36"],
    correctAnswer: "32",
    explanation: "Each number is multiplied by 2 (geometric progression with ratio 2). 16 × 2 = 32.",
    hint: "Notice how each number doubles from the previous one."
  },
  {
    id: "nd-easy-02",
    gameType: "number-detective",
    difficulty: "easy",
    question: "5, 10, 15, 20, ?",
    options: ["22", "25", "30", "35"],
    correctAnswer: "25",
    explanation: "Arithmetic sequence with a common difference of +5. 20 + 5 = 25.",
    hint: "Add 5 to the previous number."
  },
  {
    id: "nd-easy-03",
    gameType: "number-detective",
    difficulty: "easy",
    question: "100, 90, 80, 70, ?",
    options: ["50", "55", "60", "65"],
    correctAnswer: "60",
    explanation: "Subtract 10 from each number consecutively. 70 - 10 = 60.",
    hint: "The numbers decrease by 10 each step."
  },
  {
    id: "nd-easy-04",
    gameType: "number-detective",
    difficulty: "easy",
    question: "3, 6, 9, 12, ?",
    options: ["14", "15", "16", "18"],
    correctAnswer: "15",
    explanation: "Multiples of 3 increasing by 3 each step. 12 + 3 = 15.",
    hint: "Multiples of 3."
  },
  {
    id: "nd-easy-05",
    gameType: "number-detective",
    difficulty: "easy",
    question: "1, 4, 9, 16, ?",
    options: ["20", "24", "25", "36"],
    correctAnswer: "25",
    explanation: "These are perfect squares: 1², 2², 3², 4², 5² = 25.",
    hint: "Think about squaring consecutive integers 1, 2, 3, 4, 5."
  },
  {
    id: "nd-easy-06",
    gameType: "number-detective",
    difficulty: "easy",
    question: "21, 18, 15, 12, ?",
    options: ["6", "8", "9", "10"],
    correctAnswer: "9",
    explanation: "Subtract 3 each time. 12 - 3 = 9.",
    hint: "Decreasing arithmetic sequence by 3."
  },
  {
    id: "nd-easy-07",
    gameType: "number-detective",
    difficulty: "easy",
    question: "11, 22, 33, 44, ?",
    options: ["48", "50", "55", "66"],
    correctAnswer: "55",
    explanation: "Multiples of 11. 44 + 11 = 55.",
    hint: "Add 11 to get the next term."
  },
  {
    id: "nd-easy-08",
    gameType: "number-detective",
    difficulty: "easy",
    question: "1, 1, 2, 3, 5, 8, ?",
    options: ["11", "12", "13", "15"],
    correctAnswer: "13",
    explanation: "Fibonacci sequence: each number is the sum of the two preceding numbers. 5 + 8 = 13.",
    hint: "Add the last two numbers together."
  },
  {
    id: "nd-easy-09",
    gameType: "number-detective",
    difficulty: "easy",
    question: "7, 14, 21, 28, ?",
    options: ["32", "34", "35", "42"],
    correctAnswer: "35",
    explanation: "Multiples of 7 (increasing by 7). 28 + 7 = 35.",
    hint: "Add 7 each step."
  },
  {
    id: "nd-easy-10",
    gameType: "number-detective",
    difficulty: "easy",
    question: "50, 45, 40, 35, ?",
    options: ["25", "28", "30", "32"],
    correctAnswer: "30",
    explanation: "Subtract 5 at each step. 35 - 5 = 30.",
    hint: "Counting down by 5."
  },

  // MEDIUM (10 questions)
  {
    id: "nd-med-01",
    gameType: "number-detective",
    difficulty: "medium",
    question: "2, 5, 10, 17, 26, ?",
    options: ["35", "37", "39", "41"],
    correctAnswer: "37",
    explanation: "The pattern is n² + 1: 1²+1=2, 2²+1=5, 3²+1=10, 4²+1=17, 5²+1=26, 6²+1=37 (or differences +3, +5, +7, +9, +11).",
    hint: "Look at the differences between terms (+3, +5, +7, +9...)."
  },
  {
    id: "nd-med-02",
    gameType: "number-detective",
    difficulty: "medium",
    question: "3, 6, 12, 24, 48, ?",
    options: ["72", "84", "96", "108"],
    correctAnswer: "96",
    explanation: "Each number is multiplied by 2. 48 × 2 = 96.",
    hint: "Geometric sequence with common ratio of 2."
  },
  {
    id: "nd-med-03",
    gameType: "number-detective",
    difficulty: "medium",
    question: "1, 8, 27, 64, ?",
    options: ["100", "121", "125", "144"],
    correctAnswer: "125",
    explanation: "Cubes of consecutive integers: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125.",
    hint: "What is 5 cubed (5 × 5 × 5)?"
  },
  {
    id: "nd-med-04",
    gameType: "number-detective",
    difficulty: "medium",
    question: "4, 9, 19, 39, ?",
    options: ["59", "69", "79", "89"],
    correctAnswer: "79",
    explanation: "The pattern is (previous number × 2) + 1: 4×2+1=9, 9×2+1=19, 19×2+1=39, 39×2+1=79.",
    hint: "Double the number and add 1."
  },
  {
    id: "nd-med-05",
    gameType: "number-detective",
    difficulty: "medium",
    question: "2, 3, 5, 7, 11, 13, ?",
    options: ["15", "17", "19", "21"],
    correctAnswer: "17",
    explanation: "Consecutive prime numbers. The prime number immediately following 13 is 17.",
    hint: "Notice that all numbers have only two factors: 1 and themselves."
  },
  {
    id: "nd-med-06",
    gameType: "number-detective",
    difficulty: "medium",
    question: "2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: "42",
    explanation: "The formula is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42 (differences: +4, +6, +8, +10, +12).",
    hint: "Differences increase by 2 (+4, +6, +8, +10, +12)."
  },
  {
    id: "nd-med-07",
    gameType: "number-detective",
    difficulty: "medium",
    question: "10, 19, 37, 73, ?",
    options: ["135", "145", "147", "155"],
    correctAnswer: "145",
    explanation: "Each step doubles the previous number and subtracts 1: (10×2)-1=19, (19×2)-1=37, (37×2)-1=73, (73×2)-1=145.",
    hint: "Multiply by 2, then subtract 1."
  },
  {
    id: "nd-med-08",
    gameType: "number-detective",
    difficulty: "medium",
    question: "100, 96, 88, 76, ?",
    options: ["58", "60", "62", "64"],
    correctAnswer: "60",
    explanation: "Differences are subtracting increasing multiples of 4: -4, -8, -12, -16. 76 - 16 = 60.",
    hint: "Subtract 4, then 8, then 12, then 16."
  },
  {
    id: "nd-med-09",
    gameType: "number-detective",
    difficulty: "medium",
    question: "3, 5, 9, 17, 33, ?",
    options: ["49", "57", "65", "73"],
    correctAnswer: "65",
    explanation: "Differences are powers of 2: +2, +4, +8, +16, +32. 33 + 32 = 65 (or 2^n + 1).",
    hint: "The added amount doubles every time (+2, +4, +8, +16, +32)."
  },
  {
    id: "nd-med-10",
    gameType: "number-detective",
    difficulty: "medium",
    question: "1, 3, 7, 15, 31, ?",
    options: ["47", "55", "63", "71"],
    correctAnswer: "63",
    explanation: "Mersenne numbers (2^n - 1) or multiply by 2 and add 1. 31 × 2 + 1 = 63.",
    hint: "Double and add 1, or 2^6 - 1."
  },

  // HARD (10 questions)
  {
    id: "nd-hard-01",
    gameType: "number-detective",
    difficulty: "hard",
    question: "1, 2, 6, 24, 120, ?",
    options: ["240", "480", "720", "840"],
    correctAnswer: "720",
    explanation: "Factorial sequence (n!): 1!=1, 2!=2, 3!=6, 4!=24, 5!=120, 6!=720.",
    hint: "Multiply by 2, then by 3, then by 4, then by 5, then by 6."
  },
  {
    id: "nd-hard-02",
    gameType: "number-detective",
    difficulty: "hard",
    question: "2, 3, 8, 27, 112, ?",
    options: ["336", "448", "565", "678"],
    correctAnswer: "565",
    explanation: "The pattern is (n × k) + k: 2×1+1=3, 3×2+2=8, 8×3+3=27, 27×4+4=112, 112×5+5=565.",
    hint: "Multiply by n and add n, where n increases by 1 each step."
  },
  {
    id: "nd-hard-03",
    gameType: "number-detective",
    difficulty: "hard",
    question: "0, 6, 24, 60, 120, 210, ?",
    options: ["280", "324", "336", "360"],
    correctAnswer: "336",
    explanation: "The formula is n³ - n: 1³-1=0, 2³-2=6, 3³-3=24, 4³-4=60, 5³-5=120, 6³-6=210, 7³-7=343-7=336.",
    hint: "Cube the index and subtract the index: n³ - n."
  },
  {
    id: "nd-hard-04",
    gameType: "number-detective",
    difficulty: "hard",
    question: "7, 8, 18, 57, 232, ?",
    options: ["696", "928", "1165", "1392"],
    correctAnswer: "1165",
    explanation: "The rule is ×1+1, ×2+2, ×3+3, ×4+4, ×5+5: 232 × 5 + 5 = 1160 + 5 = 1165.",
    hint: "Multiply by 5 and add 5."
  },
  {
    id: "nd-hard-05",
    gameType: "number-detective",
    difficulty: "hard",
    question: "3, 7, 16, 35, 74, ?",
    options: ["129", "148", "153", "165"],
    correctAnswer: "153",
    explanation: "Pattern: ×2+1, ×2+2, ×2+3, ×2+4, ×2+5. 74 × 2 + 5 = 148 + 5 = 153.",
    hint: "Double the previous number and add an incrementing integer."
  },
  {
    id: "nd-hard-06",
    gameType: "number-detective",
    difficulty: "hard",
    question: "2, 12, 36, 80, 150, ?",
    options: ["216", "240", "252", "272"],
    correctAnswer: "252",
    explanation: "Formula is n³ + n²: 1+1=2, 8+4=12, 27+9=36, 64+16=80, 125+25=150, 216+36=252.",
    hint: "Look at n² × (n + 1) for n = 6."
  },
  {
    id: "nd-hard-07",
    gameType: "number-detective",
    difficulty: "hard",
    question: "5, 16, 51, 158, ?",
    options: ["316", "474", "481", "502"],
    correctAnswer: "481",
    explanation: "Multiply by 3 and add increasing integers: 5×3+1=16, 16×3+3=51, 51×3+5=158, 158×3+7=474+7=481.",
    hint: "Multiply by 3 and add consecutive odd numbers (+1, +3, +5, +7)."
  },
  {
    id: "nd-hard-08",
    gameType: "number-detective",
    difficulty: "hard",
    question: "4, 6, 12, 30, 90, ?",
    options: ["180", "270", "315", "360"],
    correctAnswer: "315",
    explanation: "Multipliers increase by 0.5: ×1.5, ×2, ×2.5, ×3, ×3.5. 90 × 3.5 = 315.",
    hint: "The multiplier increases by 0.5 each step (1.5, 2, 2.5, 3, 3.5)."
  },
  {
    id: "nd-hard-09",
    gameType: "number-detective",
    difficulty: "hard",
    question: "1, 4, 15, 64, 325, ?",
    options: ["1300", "1625", "1956", "2275"],
    correctAnswer: "1956",
    explanation: "Pattern: ×1+3, ×2+7, ×3+19, ×4+61... simpler: (prev + 1) × 2, (prev + 2) × 3: (1+1)×2=4, (4+1)×3=15, (15+1)×4=64, (64+1)×5=325, (325+1)×6 = 326 × 6 = 1956.",
    hint: "Add 1 then multiply by the step number (6)."
  },
  {
    id: "nd-hard-10",
    gameType: "number-detective",
    difficulty: "hard",
    question: "6, 13, 28, 59, 122, ?",
    options: ["244", "247", "249", "253"],
    correctAnswer: "249",
    explanation: "Pattern is (n × 2) + 1, +2, +3, +4, +5: 6×2+1=13, 13×2+2=28, 28×2+3=59, 59×2+4=122, 122×2+5=249.",
    hint: "Double and add consecutive integers (+1, +2, +3, +4, +5)."
  }
];

export default numberDetectiveQuestions;
