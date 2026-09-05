const fs = require('fs');
const path = require('path');

const easyQuestions = [
  // 1-10 Existing curated
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
    question: "1, 4, 7, 10, ?",
    options: ["11", "12", "13", "14"],
    correctAnswer: "13",
    explanation: "Add 3 to each consecutive number. 10 + 3 = 13.",
    hint: "Notice the difference is consistently 3."
  },
  {
    id: "nd-easy-06",
    gameType: "number-detective",
    difficulty: "easy",
    question: "50, 45, 40, 35, ?",
    options: ["25", "30", "32", "34"],
    correctAnswer: "30",
    explanation: "Each number decreases by 5. 35 - 5 = 30.",
    hint: "Subtract 5 from 35."
  },
  {
    id: "nd-easy-07",
    gameType: "number-detective",
    difficulty: "easy",
    question: "4, 8, 12, 16, ?",
    options: ["18", "20", "22", "24"],
    correctAnswer: "20",
    explanation: "Multiples of 4 (arithmetic sequence with difference +4). 16 + 4 = 20.",
    hint: "Multiples of 4."
  },
  {
    id: "nd-easy-08",
    gameType: "number-detective",
    difficulty: "easy",
    question: "11, 22, 33, 44, ?",
    options: ["50", "54", "55", "66"],
    correctAnswer: "55",
    explanation: "Multiples of 11 (or +11 at each step). 44 + 11 = 55.",
    hint: "Notice the repeating double digits."
  },
  {
    id: "nd-easy-09",
    gameType: "number-detective",
    difficulty: "easy",
    question: "1, 3, 5, 7, 9, ?",
    options: ["10", "11", "12", "13"],
    correctAnswer: "11",
    explanation: "Consecutive odd numbers (+2 difference). 9 + 2 = 11.",
    hint: "Consecutive odd numbers."
  },
  {
    id: "nd-easy-10",
    gameType: "number-detective",
    difficulty: "easy",
    question: "60, 55, 50, 45, 40, ?",
    options: ["30", "35", "36", "38"],
    correctAnswer: "35",
    explanation: "Subtract 5 at each step. 40 - 5 = 35.",
    hint: "Counting down by 5."
  }
];

// Systematic generator for Easy up to 70
const easyPatterns = [
  // Linear sequences
  { start: 7, step: 7, count: 4, name: "multiples of 7", op: "add" },
  { start: 6, step: 6, count: 4, name: "multiples of 6", op: "add" },
  { start: 8, step: 8, count: 4, name: "multiples of 8", op: "add" },
  { start: 9, step: 9, count: 4, name: "multiples of 9", op: "add" },
  { start: 12, step: 12, count: 4, name: "multiples of 12", op: "add" },
  { start: 15, step: 15, count: 4, name: "multiples of 15", op: "add" },
  { start: 20, step: 20, count: 4, name: "multiples of 20", op: "add" },
  { start: 25, step: 25, count: 4, name: "multiples of 25", op: "add" },
  { start: 2, step: 6, count: 4, name: "add 6", op: "add" },
  { start: 5, step: 7, count: 4, name: "add 7", op: "add" },
  { start: 4, step: 8, count: 4, name: "add 8", op: "add" },
  { start: 3, step: 9, count: 4, name: "add 9", op: "add" },
  { start: 80, step: 8, count: 4, name: "subtract 8", op: "sub" },
  { start: 90, step: 9, count: 4, name: "subtract 9", op: "sub" },
  { start: 75, step: 15, count: 4, name: "subtract 15", op: "sub" },
  { start: 120, step: 20, count: 4, name: "subtract 20", op: "sub" },
  { start: 200, step: 25, count: 4, name: "subtract 25", op: "sub" },
  { start: 100, step: 12, count: 4, name: "subtract 12", op: "sub" },
  // Simple geometric
  { start: 1, mult: 3, count: 4, name: "multiply by 3", op: "mul" },
  { start: 1, mult: 4, count: 4, name: "multiply by 4", op: "mul" },
  { start: 1, mult: 5, count: 4, name: "multiply by 5", op: "mul" },
  { start: 2, mult: 3, count: 4, name: "multiply by 3", op: "mul" },
  { start: 3, mult: 3, count: 3, name: "multiply by 3", op: "mul" },
  { start: 160, div: 2, count: 4, name: "halve each step", op: "div" },
  { start: 243, div: 3, count: 4, name: "divide by 3", op: "div" },
  { start: 320, div: 2, count: 4, name: "divide by 2", op: "div" },
  { start: 256, div: 2, count: 4, name: "divide by 2", op: "div" },
  { start: 500, div: 2, count: 3, name: "divide by 2", op: "div" },
  // Alternating simple
  { start: 10, a: 3, b: 1, count: 5, name: "+3 then -1", op: "alt" },
  { start: 20, a: 4, b: 2, count: 5, name: "+4 then -2", op: "alt" },
  { start: 15, a: 5, b: 2, count: 5, name: "+5 then -2", op: "alt" },
  { start: 30, a: 6, b: 3, count: 5, name: "+6 then -3", op: "alt" },
  { start: 12, a: 2, b: 1, count: 5, name: "+2 then -1", op: "alt" },
  { start: 5, a: 4, b: 1, count: 5, name: "+4 then -1", op: "alt" },
  { start: 8, a: 5, b: 1, count: 5, name: "+5 then -1", op: "alt" },
  { start: 25, a: 10, b: 5, count: 5, name: "+10 then -5", op: "alt" },
  { start: 40, a: 8, b: 4, count: 5, name: "+8 then -4", op: "alt" },
  { start: 50, a: 15, b: 5, count: 5, name: "+15 then -5", op: "alt" },
  // Add increasing constant (+1, +2, +3...)
  { start: 1, diffStart: 1, diffStep: 1, count: 5, name: "differences increase by 1 (+1, +2, +3...)", op: "diffInc" },
  { start: 2, diffStart: 2, diffStep: 1, count: 5, name: "differences increase by 1 (+2, +3, +4...)", op: "diffInc" },
  { start: 5, diffStart: 3, diffStep: 1, count: 5, name: "differences increase by 1 (+3, +4, +5...)", op: "diffInc" },
  { start: 10, diffStart: 2, diffStep: 2, count: 5, name: "differences increase by 2 (+2, +4, +6...)", op: "diffInc" },
  { start: 1, diffStart: 3, diffStep: 2, count: 5, name: "differences increase by 2 (+3, +5, +7...)", op: "diffInc" },
  { start: 4, diffStart: 4, diffStep: 2, count: 5, name: "differences increase by 2 (+4, +6, +8...)", op: "diffInc" },
  { start: 0, diffStart: 5, diffStep: 5, count: 5, name: "differences increase by 5 (+5, +10, +15...)", op: "diffInc" },
  { start: 10, diffStart: 10, diffStep: 10, count: 5, name: "differences increase by 10 (+10, +20, +30...)", op: "diffInc" },
  // Stepped evens / odds
  { start: 102, step: 2, count: 5, name: "consecutive even numbers", op: "add" },
  { start: 99, step: 2, count: 5, name: "consecutive odd numbers", op: "add" },
  { start: 150, step: 25, count: 4, name: "multiples of 25", op: "add" },
  { start: 210, step: 30, count: 4, name: "multiples of 30", op: "add" },
  { start: 13, step: 13, count: 4, name: "multiples of 13", op: "add" },
  { start: 14, step: 14, count: 4, name: "multiples of 14", op: "add" },
  { start: 16, step: 16, count: 4, name: "multiples of 16", op: "add" },
  { start: 17, step: 17, count: 4, name: "multiples of 17", op: "add" },
  { start: 18, step: 18, count: 4, name: "multiples of 18", op: "add" },
  { start: 19, step: 19, count: 4, name: "multiples of 19", op: "add" },
  { start: 21, step: 21, count: 4, name: "multiples of 21", op: "add" },
  { start: 105, step: 5, count: 5, name: "counting by 5s", op: "add" },
  { start: 500, step: 50, count: 4, name: "counting by 50s", op: "add" },
  { start: 1000, step: 100, count: 4, name: "counting by 100s", op: "sub" }
];

function buildSeq(p) {
  const seq = [];
  let curr = p.start;
  seq.push(curr);
  let nextVal = 0;
  let expl = "";
  let hint = "";

  if (p.op === "add") {
    for (let i = 0; i < p.count; i++) {
      curr += p.step;
      seq.push(curr);
    }
    nextVal = curr + p.step;
    expl = `Each term increases by ${p.step} (arithmetic sequence). ${curr} + ${p.step} = ${nextVal}.`;
    hint = `Add ${p.step} to the previous number.`;
  } else if (p.op === "sub") {
    for (let i = 0; i < p.count; i++) {
      curr -= p.step;
      seq.push(curr);
    }
    nextVal = curr - p.step;
    expl = `Each term decreases by ${p.step}. ${curr} - ${p.step} = ${nextVal}.`;
    hint = `Subtract ${p.step} from the previous number.`;
  } else if (p.op === "mul") {
    for (let i = 0; i < p.count; i++) {
      curr *= p.mult;
      seq.push(curr);
    }
    nextVal = curr * p.mult;
    expl = `Each term is multiplied by ${p.mult} (geometric progression). ${curr} × ${p.mult} = ${nextVal}.`;
    hint = `Multiply the previous number by ${p.mult}.`;
  } else if (p.op === "div") {
    for (let i = 0; i < p.count; i++) {
      curr = Math.round(curr / p.div);
      seq.push(curr);
    }
    nextVal = Math.round(curr / p.div);
    expl = `Each term is divided by ${p.div}. ${curr} ÷ ${p.div} = ${nextVal}.`;
    hint = `Divide the previous number by ${p.div}.`;
  } else if (p.op === "alt") {
    for (let i = 0; i < p.count; i++) {
      if (i % 2 === 0) curr += p.a;
      else curr -= p.b;
      seq.push(curr);
    }
    const nextOpAdd = (p.count % 2 === 0);
    nextVal = nextOpAdd ? curr + p.a : curr - p.b;
    expl = `Alternating sequence: +${p.a}, -${p.b}. Next step is ${nextOpAdd ? '+' + p.a : '-' + p.b}: ${curr} ${nextOpAdd ? '+' : '-'} ${nextOpAdd ? p.a : p.b} = ${nextVal}.`;
    hint = `Look at alternating operations: +${p.a} and -${p.b}.`;
  } else if (p.op === "diffInc") {
    let diff = p.diffStart;
    for (let i = 0; i < p.count; i++) {
      curr += diff;
      seq.push(curr);
      diff += p.diffStep;
    }
    nextVal = curr + diff;
    expl = `Differences increase by ${p.diffStep} each step. Next difference is +${diff}. ${curr} + ${diff} = ${nextVal}.`;
    hint = `Look at the differences between consecutive terms.`;
  }

  return { seq, nextVal, expl, hint };
}

function makeOptions(correctVal) {
  const c = parseInt(correctVal, 10);
  const set = new Set();
  set.add(String(c));
  const deltas = [-2, 2, -1, 1, -4, 4, -5, 5, -10, 10, -3, 3, -6, 6];
  for (const d of deltas) {
    const candidate = c + d;
    if (candidate >= 0 && candidate !== c) {
      set.add(String(candidate));
    }
    if (set.size === 4) break;
  }
  let extra = 1;
  while (set.size < 4) {
    set.add(String(c + extra * 7));
    extra++;
  }
  const arr = Array.from(set);
  // Sort or shuffle options
  arr.sort(() => Math.random() - 0.5);
  return arr;
}

let easyIdx = 11;
for (const p of easyPatterns) {
  if (easyQuestions.length >= 70) break;
  const { seq, nextVal, expl, hint } = buildSeq(p);
  const numStr = String(easyIdx).padStart(2, '0');
  easyQuestions.push({
    id: `nd-easy-${numStr}`,
    gameType: "number-detective",
    difficulty: "easy",
    question: `${seq.join(', ')}, ?`,
    options: makeOptions(nextVal),
    correctAnswer: String(nextVal),
    explanation: expl,
    hint: hint
  });
  easyIdx++;
}

console.log(`Generated ${easyQuestions.length} Easy questions.`);

// ─────────────────────────────────────────────────────────────────────────────
// MEDIUM QUESTIONS (70 target)
// ─────────────────────────────────────────────────────────────────────────────
const medQuestions = [
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
    explanation: "Consecutive prime numbers. The next prime after 13 is 17.",
    hint: "Think about prime numbers."
  },
  {
    id: "nd-med-06",
    gameType: "number-detective",
    difficulty: "medium",
    question: "1, 3, 6, 10, 15, ?",
    options: ["18", "20", "21", "24"],
    correctAnswer: "21",
    explanation: "Triangular numbers: add +2, +3, +4, +5, +6. 15 + 6 = 21.",
    hint: "Notice the differences increase by 1 (+2, +3, +4, +5...)."
  },
  {
    id: "nd-med-07",
    gameType: "number-detective",
    difficulty: "medium",
    question: "1, 2, 4, 7, 11, 16, ?",
    options: ["20", "21", "22", "24"],
    correctAnswer: "22",
    explanation: "Differences increase by 1: +1, +2, +3, +4, +5, so next is +6. 16 + 6 = 22.",
    hint: "Find the difference between consecutive terms."
  },
  {
    id: "nd-med-08",
    gameType: "number-detective",
    difficulty: "medium",
    question: "5, 11, 23, 47, ?",
    options: ["85", "91", "95", "99"],
    correctAnswer: "95",
    explanation: "Multiply by 2 and add 1: 5×2+1=11, 11×2+1=23, 23×2+1=47, 47×2+1=95.",
    hint: "Multiply by 2 and add 1."
  },
  {
    id: "nd-med-09",
    gameType: "number-detective",
    difficulty: "medium",
    question: "2, 6, 12, 20, 30, ?",
    options: ["38", "40", "42", "46"],
    correctAnswer: "42",
    explanation: "The pattern is n × (n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42 (or +4, +6, +8, +10, +12).",
    hint: "Look at the differences (+4, +6, +8, +10...)."
  },
  {
    id: "nd-med-10",
    gameType: "number-detective",
    difficulty: "medium",
    question: "1, 4, 9, 16, 25, ?",
    options: ["30", "34", "36", "49"],
    correctAnswer: "36",
    explanation: "Squares of consecutive integers: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36.",
    hint: "Perfect square numbers (1², 2², 3²...)."
  }
];

const medPatterns = [
  // Squares with offsets: n² - 1
  { type: "sqOffset", offset: -1, start: 2, count: 5, name: "n² - 1" },
  { type: "sqOffset", offset: 2, start: 1, count: 5, name: "n² + 2" },
  { type: "sqOffset", offset: -2, start: 2, count: 5, name: "n² - 2" },
  { type: "sqOffset", offset: 3, start: 1, count: 5, name: "n² + 3" },
  // 2 * n²
  { type: "sqMult", mult: 2, start: 1, count: 5, name: "2 × n²" },
  { type: "sqMult", mult: 3, start: 1, count: 5, name: "3 × n²" },
  // Linear recurrence: (x * 2) - 1
  { type: "multAdd", mult: 2, add: -1, start: 3, count: 5, name: "×2 - 1" },
  { type: "multAdd", mult: 2, add: 2, start: 3, count: 5, name: "×2 + 2" },
  { type: "multAdd", mult: 2, add: -2, start: 4, count: 5, name: "×2 - 2" },
  { type: "multAdd", mult: 3, add: -1, start: 2, count: 4, name: "×3 - 1" },
  { type: "multAdd", mult: 3, add: 1, start: 2, count: 4, name: "×3 + 1" },
  { type: "multAdd", mult: 3, add: -2, start: 3, count: 4, name: "×3 - 2" },
  // Fibonacci variations: a_n = a_{n-1} + a_{n-2}
  { type: "fib", a: 1, b: 4, count: 5, name: "Fibonacci starting with 1, 4" },
  { type: "fib", a: 2, b: 5, count: 5, name: "Fibonacci starting with 2, 5" },
  { type: "fib", a: 3, b: 4, count: 5, name: "Fibonacci starting with 3, 4" },
  { type: "fib", a: 2, b: 3, count: 5, name: "Fibonacci starting with 2, 3" },
  { type: "fib", a: 4, b: 7, count: 5, name: "Lucas sequence variant starting with 4, 7" },
  { type: "fib", a: 1, b: 6, count: 5, name: "Fibonacci starting with 1, 6" },
  // Alternating operations: ×2 then +4
  { type: "altOps", op1: "mul", val1: 2, op2: "add", val2: 3, start: 2, count: 5, name: "×2, +3" },
  { type: "altOps", op1: "mul", val1: 2, op2: "add", val2: 5, start: 3, count: 5, name: "×2, +5" },
  { type: "altOps", op1: "mul", val1: 3, op2: "sub", val2: 2, start: 2, count: 4, name: "×3, -2" },
  { type: "altOps", op1: "mul", val1: 2, op2: "sub", val2: 3, start: 5, count: 5, name: "×2, -3" },
  // Differences are multiples of 3 (+3, +6, +9, +12...)
  { type: "diffMult", startDiff: 3, multStep: 3, start: 1, count: 5, name: "differences are multiples of 3" },
  { type: "diffMult", startDiff: 4, multStep: 4, start: 2, count: 5, name: "differences are multiples of 4" },
  { type: "diffMult", startDiff: 6, multStep: 6, start: 5, count: 5, name: "differences are multiples of 6" },
  // Primes starting from 17
  { type: "primeSeq", startIdx: 5, count: 5, name: "consecutive prime numbers" },
  { type: "primeOffset", offset: 1, startIdx: 0, count: 6, name: "prime numbers + 1" },
  { type: "primeOffset", offset: -1, startIdx: 1, count: 6, name: "prime numbers - 1" },
  // Triangular numbers + offset
  { type: "triangular", offset: 1, start: 1, count: 5, name: "triangular numbers + 1" },
  { type: "triangular", offset: -1, start: 2, count: 5, name: "triangular numbers - 1" },
  { type: "triangular", offset: 2, start: 1, count: 5, name: "triangular numbers + 2" },
  // Cumulative sum of evens: 2, 6, 12, 20...
  { type: "sumEvens", start: 0, count: 5, name: "sum of consecutive even numbers" },
  // Cumulative sum of odds: 1, 4, 9, 16...
  { type: "sumOddsOffset", offset: 2, start: 1, count: 5, name: "squares + 2" },
  // Cubes minus 1: 0, 7, 26, 63...
  { type: "cubeOffset", offset: -1, start: 1, count: 4, name: "n³ - 1" },
  { type: "cubeOffset", offset: 1, start: 1, count: 4, name: "n³ + 1" },
  { type: "cubeOffset", offset: 2, start: 1, count: 4, name: "n³ + 2" },
  // Two alternating sub-series
  { type: "interleaved", aStart: 2, aStep: 2, bStart: 50, bStep: -5, count: 6, name: "two alternating series" },
  { type: "interleaved", aStart: 1, aStep: 3, bStart: 100, bStep: -10, count: 6, name: "two alternating series" },
  { type: "interleaved", aStart: 5, aStep: 5, bStart: 40, bStep: -2, count: 6, name: "two alternating series" },
  { type: "interleaved", aStart: 3, aStep: 4, bStart: 80, bStep: -5, count: 6, name: "two alternating series" },
  { type: "interleaved", aStart: 10, aStep: 10, bStart: 2, bStep: 2, count: 6, name: "two alternating series" },
  // Powers of 2 plus constant
  { type: "pow2Offset", offset: 3, start: 1, count: 5, name: "2^n + 3" },
  { type: "pow2Offset", offset: -1, start: 1, count: 5, name: "2^n - 1 (Mersenne)" },
  { type: "pow2Offset", offset: 5, start: 1, count: 5, name: "2^n + 5" },
  // Second differences constant = 4
  { type: "secondDiff", d1: 2, d2: 4, start: 3, count: 5, name: "second difference is constant (+4)" },
  { type: "secondDiff", d1: 3, d2: 3, start: 1, count: 5, name: "second difference is constant (+3)" },
  { type: "secondDiff", d1: 1, d2: 5, start: 2, count: 5, name: "second difference is constant (+5)" },
  { type: "secondDiff", d1: 5, d2: 2, start: 4, count: 5, name: "second difference is constant (+2)" },
  // Product of consecutive digits
  { type: "prodPair", start: 2, count: 5, name: "n × (n + 2)" },
  { type: "prodPair3", start: 1, count: 5, name: "n × (n + 3)" },
  // Decreasing differences
  { type: "decDiff", start: 100, dStart: 20, dDec: 2, count: 5, name: "differences decrease by 2 (-20, -18, -16...)" },
  { type: "decDiff", start: 200, dStart: 30, dDec: 5, count: 5, name: "differences decrease by 5 (-30, -25, -20...)" },
  { type: "decDiff", start: 150, dStart: 25, dDec: 3, count: 5, name: "differences decrease by 3 (-25, -22, -19...)" },
  { type: "decDiff", start: 80, dStart: 15, dDec: 2, count: 5, name: "differences decrease by 2 (-15, -13, -11...)" },
  // Mixed linear & geometric
  { type: "multAdd", mult: 2, add: 3, start: 1, count: 5, name: "×2 + 3" },
  { type: "multAdd", mult: 2, add: 4, start: 2, count: 5, name: "×2 + 4" },
  { type: "multAdd", mult: 2, add: -3, start: 5, count: 5, name: "×2 - 3" },
  { type: "multAdd", mult: 3, add: 2, start: 1, count: 4, name: "×3 + 2" },
  { type: "multAdd", mult: 3, add: -3, start: 4, count: 4, name: "×3 - 3" },
  { type: "fib", a: 5, b: 8, count: 5, name: "Fibonacci variant starting with 5, 8" },
  { type: "fib", a: 2, b: 7, count: 5, name: "Fibonacci variant starting with 2, 7" },
  { type: "fib", a: 3, b: 8, count: 5, name: "Fibonacci variant starting with 3, 8" }
];

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

function buildMedSeq(p) {
  const seq = [];
  let nextVal = 0;
  let expl = "";
  let hint = "";

  if (p.type === "sqOffset") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(i * i + p.offset);
    }
    const nextN = p.start + p.count;
    nextVal = nextN * nextN + p.offset;
    expl = `Pattern is n² ${p.offset >= 0 ? '+' : ''}${p.offset}: ${nextN}² ${p.offset >= 0 ? '+' : ''}${p.offset} = ${nextN * nextN} ${p.offset >= 0 ? '+' : ''} ${p.offset} = ${nextVal}.`;
    hint = `Look at squares of consecutive integers plus/minus a constant.`;
  } else if (p.type === "sqMult") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(p.mult * i * i);
    }
    const nextN = p.start + p.count;
    nextVal = p.mult * nextN * nextN;
    expl = `Pattern is ${p.mult} × n²: ${p.mult} × ${nextN}² = ${p.mult} × ${nextN * nextN} = ${nextVal}.`;
    hint = `Multiples of square numbers.`;
  } else if (p.type === "multAdd") {
    let curr = p.start;
    seq.push(curr);
    for (let i = 0; i < p.count; i++) {
      curr = curr * p.mult + p.add;
      seq.push(curr);
    }
    nextVal = curr * p.mult + p.add;
    expl = `Pattern is (term × ${p.mult}) ${p.add >= 0 ? '+' : ''}${p.add}: ${curr} × ${p.mult} ${p.add >= 0 ? '+' : ''}${p.add} = ${nextVal}.`;
    hint = `Multiply each number by ${p.mult} and ${p.add >= 0 ? 'add' : 'subtract'} ${Math.abs(p.add)}.`;
  } else if (p.type === "fib") {
    let a = p.a, b = p.b;
    seq.push(a, b);
    for (let i = 0; i < p.count - 1; i++) {
      const c = a + b;
      seq.push(c);
      a = b;
      b = c;
    }
    nextVal = a + b;
    expl = `Each term is the sum of the two preceding terms (Fibonacci pattern): ${a} + ${b} = ${nextVal}.`;
    hint = `Look at the sum of consecutive pairs of numbers.`;
  } else if (p.type === "altOps") {
    let curr = p.start;
    seq.push(curr);
    for (let i = 0; i < p.count; i++) {
      if (i % 2 === 0) {
        curr = p.op1 === "mul" ? curr * p.val1 : curr + p.val1;
      } else {
        curr = p.op2 === "add" ? curr + p.val2 : curr - p.val2;
      }
      seq.push(curr);
    }
    const isNextOp1 = (p.count % 2 === 0);
    if (isNextOp1) {
      nextVal = p.op1 === "mul" ? curr * p.val1 : curr + p.val1;
    } else {
      nextVal = p.op2 === "add" ? curr + p.val2 : curr - p.val2;
    }
    expl = `Alternating operations: ${p.name}. Next step produces ${nextVal}.`;
    hint = `Notice the pattern alternates between two different mathematical operations.`;
  } else if (p.type === "diffMult") {
    let curr = p.start;
    seq.push(curr);
    let diff = p.startDiff;
    for (let i = 0; i < p.count; i++) {
      curr += diff;
      seq.push(curr);
      diff += p.multStep;
    }
    nextVal = curr + diff;
    expl = `The differences increase by ${p.multStep}: next difference is +${diff}. ${curr} + ${diff} = ${nextVal}.`;
    hint = `Analyze the difference between consecutive numbers.`;
  } else if (p.type === "primeSeq") {
    for (let i = p.startIdx; i < p.startIdx + p.count; i++) {
      seq.push(primes[i]);
    }
    nextVal = primes[p.startIdx + p.count];
    expl = `Consecutive prime numbers. Next prime after ${primes[p.startIdx + p.count - 1]} is ${nextVal}.`;
    hint = `Numbers that are only divisible by 1 and themselves.`;
  } else if (p.type === "primeOffset") {
    for (let i = p.startIdx; i < p.startIdx + p.count; i++) {
      seq.push(primes[i] + p.offset);
    }
    const nextP = primes[p.startIdx + p.count];
    nextVal = nextP + p.offset;
    expl = `Pattern is prime number ${p.offset >= 0 ? '+' : ''}${p.offset}. Next prime is ${nextP} -> ${nextP} ${p.offset >= 0 ? '+' : ''}${p.offset} = ${nextVal}.`;
    hint = `Look at prime numbers with an offset of ${p.offset}.`;
  } else if (p.type === "triangular") {
    for (let i = p.start; i < p.start + p.count; i++) {
      const tri = (i * (i + 1)) / 2;
      seq.push(tri + p.offset);
    }
    const nextN = p.start + p.count;
    const nextTri = (nextN * (nextN + 1)) / 2;
    nextVal = nextTri + p.offset;
    expl = `Triangular numbers (n*(n+1)/2) + ${p.offset}. Next is ${nextTri} + ${p.offset} = ${nextVal}.`;
    hint = `Recall triangular numbers (+2, +3, +4, +5...) with a fixed offset.`;
  } else if (p.type === "interleaved") {
    let a = p.aStart, b = p.bStart;
    for (let i = 0; i < p.count; i++) {
      if (i % 2 === 0) {
        seq.push(a);
        if (i > 0) a += p.aStep;
      } else {
        seq.push(b);
        b += p.bStep;
      }
    }
    const isA = (p.count % 2 === 0);
    nextVal = isA ? a + p.aStep : b;
    expl = `Two interleaved series: Series 1 (${p.aStep >= 0 ? '+' : ''}${p.aStep}) and Series 2 (${p.bStep >= 0 ? '+' : ''}${p.bStep}). Next term belongs to ${isA ? 'Series 1' : 'Series 2'} -> ${nextVal}.`;
    hint = `Look at the numbers at alternating odd and even positions separately.`;
  } else if (p.type === "secondDiff") {
    let curr = p.start;
    seq.push(curr);
    let diff = p.d1;
    for (let i = 0; i < p.count; i++) {
      curr += diff;
      seq.push(curr);
      diff += p.d2;
    }
    nextVal = curr + diff;
    expl = `Second difference is constant (+${p.d2}). Next difference is +${diff}. ${curr} + ${diff} = ${nextVal}.`;
    hint = `Check the second-order differences (difference of the differences).`;
  } else if (p.type === "decDiff") {
    let curr = p.start;
    seq.push(curr);
    let diff = p.dStart;
    for (let i = 0; i < p.count; i++) {
      curr -= diff;
      seq.push(curr);
      diff -= p.dDec;
    }
    nextVal = curr - diff;
    expl = `Differences decrease: subtract ${diff} next. ${curr} - ${diff} = ${nextVal}.`;
    hint = `The amount subtracted gets smaller each step.`;
  } else if (p.type === "cubeOffset") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(i * i * i + p.offset);
    }
    const nextN = p.start + p.count;
    nextVal = nextN * nextN * nextN + p.offset;
    expl = `Cubes with offset: n³ ${p.offset >= 0 ? '+' : ''}${p.offset}. ${nextN}³ ${p.offset >= 0 ? '+' : ''}${p.offset} = ${nextVal}.`;
    hint = `Check the cubes of consecutive integers.`;
  } else if (p.type === "pow2Offset") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(Math.pow(2, i) + p.offset);
    }
    const nextN = p.start + p.count;
    nextVal = Math.pow(2, nextN) + p.offset;
    expl = `Powers of 2: 2^n + ${p.offset}. 2^${nextN} + ${p.offset} = ${nextVal}.`;
    hint = `Powers of 2 (2, 4, 8, 16, 32...) plus/minus an offset.`;
  } else if (p.type === "prodPair") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(i * (i + 2));
    }
    const nextN = p.start + p.count;
    nextVal = nextN * (nextN + 2);
    expl = `Pattern is n × (n + 2): ${nextN} × ${nextN + 2} = ${nextVal}.`;
    hint = `Product of n and n+2.`;
  } else if (p.type === "prodPair3") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(i * (i + 3));
    }
    const nextN = p.start + p.count;
    nextVal = nextN * (nextN + 3);
    expl = `Pattern is n × (n + 3): ${nextN} × ${nextN + 3} = ${nextVal}.`;
    hint = `Product of n and n+3.`;
  } else {
    // Fallback
    let curr = 10;
    seq.push(curr);
    for (let i = 0; i < 4; i++) { curr += 7; seq.push(curr); }
    nextVal = curr + 7;
    expl = `Arithmetic progression: +7.`;
    hint = `Add 7.`;
  }

  return { seq, nextVal, expl, hint };
}

let medIdx = 11;
for (const p of medPatterns) {
  if (medQuestions.length >= 70) break;
  const { seq, nextVal, expl, hint } = buildMedSeq(p);
  const numStr = String(medIdx).padStart(2, '0');
  medQuestions.push({
    id: `nd-med-${numStr}`,
    gameType: "number-detective",
    difficulty: "medium",
    question: `${seq.join(', ')}, ?`,
    options: makeOptions(nextVal),
    correctAnswer: String(nextVal),
    explanation: expl,
    hint: hint
  });
  medIdx++;
}

console.log(`Generated ${medQuestions.length} Medium questions.`);

// ─────────────────────────────────────────────────────────────────────────────
// HARD QUESTIONS (70 target)
// ─────────────────────────────────────────────────────────────────────────────
const hardQuestions = [
  {
    id: "nd-hard-01",
    gameType: "number-detective",
    difficulty: "hard",
    question: "2, 3, 8, 27, 112, ?",
    options: ["450", "560", "565", "620"],
    correctAnswer: "565",
    explanation: "Pattern: (term × n) + n where n increases by 1: 2×1+1=3, 3×2+2=8, 8×3+3=27, 27×4+4=112, 112×5+5=565.",
    hint: "Each step multiplies by increasing integers and adds the same integer."
  },
  {
    id: "nd-hard-02",
    gameType: "number-detective",
    difficulty: "hard",
    question: "1, 2, 6, 24, 120, ?",
    options: ["480", "600", "720", "840"],
    correctAnswer: "720",
    explanation: "Factorial sequence (n!): 1!=1, 2!=2, 3!=6, 4!=24, 5!=120, 6!=720.",
    hint: "Multiply by 2, then 3, then 4, then 5, then 6..."
  },
  {
    id: "nd-hard-03",
    gameType: "number-detective",
    difficulty: "hard",
    question: "0, 6, 24, 60, 120, ?",
    options: ["180", "210", "240", "336"],
    correctAnswer: "210",
    explanation: "The pattern is n³ - n: 1³-1=0, 2³-2=6, 3³-3=24, 4³-4=60, 5³-5=120, 6³-6=210.",
    hint: "Think about n³ - n for consecutive integers."
  },
  {
    id: "nd-hard-04",
    gameType: "number-detective",
    difficulty: "hard",
    question: "2, 12, 36, 80, 150, ?",
    options: ["216", "240", "252", "294"],
    correctAnswer: "252",
    explanation: "The pattern is n² × (n+1) or n³ + n²: 1³+1²=2, 2³+2²=12, 3³+3²=36, 4³+4²=80, 5³+5²=150, 6³+6²=216+36=252.",
    hint: "Evaluate n³ + n² for n = 1, 2, 3, 4, 5, 6."
  },
  {
    id: "nd-hard-05",
    gameType: "number-detective",
    difficulty: "hard",
    question: "1, 4, 27, 256, ?",
    options: ["1024", "2048", "3125", "4096"],
    correctAnswer: "3125",
    explanation: "The pattern is n^n: 1^1=1, 2^2=4, 3^3=27, 4^4=256, 5^5=3125.",
    hint: "Each number is n raised to the power of n."
  },
  {
    id: "nd-hard-06",
    gameType: "number-detective",
    difficulty: "hard",
    question: "3, 5, 9, 17, 33, ?",
    options: ["49", "55", "65", "73"],
    correctAnswer: "65",
    explanation: "Differences are powers of 2: +2, +4, +8, +16, so next is +32. 33 + 32 = 65 (or 2^n + 1).",
    hint: "Look at the differences between consecutive terms (+2, +4, +8, +16...)."
  },
  {
    id: "nd-hard-07",
    gameType: "number-detective",
    difficulty: "hard",
    question: "7, 10, 8, 11, 9, 12, ?",
    options: ["10", "11", "13", "14"],
    correctAnswer: "10",
    explanation: "Two alternating series: (7, 8, 9, 10) and (10, 11, 12). Next term is 9 + 1 = 10.",
    hint: "Look at alternate numbers (+3, -2, +3, -2...)."
  },
  {
    id: "nd-hard-08",
    gameType: "number-detective",
    difficulty: "hard",
    question: "2, 3, 6, 18, 108, ?",
    options: ["1296", "1728", "1944", "2160"],
    correctAnswer: "1944",
    explanation: "Each term is the product of the two preceding terms: 2×3=6, 3×6=18, 6×18=108, 18×108=1944.",
    hint: "Multiply the two preceding numbers."
  },
  {
    id: "nd-hard-09",
    gameType: "number-detective",
    difficulty: "hard",
    question: "5, 16, 51, 158, ?",
    options: ["475", "479", "481", "485"],
    correctAnswer: "481",
    explanation: "Pattern: (term × 3) + 1, +3, +5, +7 (odd numbers): 5×3+1=16, 16×3+3=51, 51×3+5=158, 158×3+7=474+7=481.",
    hint: "Multiply by 3 and add consecutive odd numbers (+1, +3, +5, +7...)."
  },
  {
    id: "nd-hard-10",
    gameType: "number-detective",
    difficulty: "hard",
    question: "1, 2, 5, 12, 29, 70, ?",
    options: ["140", "159", "169", "175"],
    correctAnswer: "169",
    explanation: "Pell numbers: P(n) = 2 × P(n-1) + P(n-2). 2×70 + 29 = 140 + 29 = 169.",
    hint: "Double the previous number and add the one before that."
  }
];

const hardPatterns = [
  // n! - 1
  { type: "factOffset", offset: -1, start: 2, count: 4, name: "n! - 1" },
  { type: "factOffset", offset: 1, start: 2, count: 4, name: "n! + 1" },
  // n³ + n: 2, 10, 30, 68, 130...
  { type: "cubePlusN", start: 1, count: 5, name: "n³ + n" },
  // n³ - n²: 0, 4, 18, 48, 100...
  { type: "cubeMinusSq", start: 2, count: 5, name: "n³ - n²" },
  // Dynamic multiplier: ×1, ×2, ×3, ×4
  { type: "dynMult", start: 3, add: 1, count: 4, name: "(term × n) + 1" },
  { type: "dynMult", start: 2, add: 2, count: 4, name: "(term × n) + 2" },
  { type: "dynMult", start: 1, add: 3, count: 4, name: "(term × n) + 3" },
  // Pell variant: 2 * a_{n-1} + a_{n-2}
  { type: "pellVariant", a: 1, b: 3, count: 5, name: "P(n) = 2*P(n-1) + P(n-2) starting 1, 3" },
  { type: "pellVariant", a: 2, b: 4, count: 5, name: "P(n) = 2*P(n-1) + P(n-2) starting 2, 4" },
  { type: "pellVariant", a: 1, b: 4, count: 5, name: "P(n) = 2*P(n-1) + P(n-2) starting 1, 4" },
  // Tribonacci: a_n = a_{n-1} + a_{n-2} + a_{n-3}
  { type: "tribonacci", a: 1, b: 1, c: 2, count: 5, name: "Tribonacci (sum of preceding three)" },
  { type: "tribonacci", a: 0, b: 1, c: 2, count: 5, name: "Tribonacci starting 0, 1, 2" },
  { type: "tribonacci", a: 1, b: 2, c: 3, count: 5, name: "Tribonacci starting 1, 2, 3" },
  // Interleaved dual series
  { type: "interleavedHard", aStart: 3, aMult: 2, bStart: 100, bStep: -7, count: 6, name: "interleaved geometric & arithmetic" },
  { type: "interleavedHard", aStart: 2, aMult: 3, bStart: 50, bStep: -4, count: 6, name: "interleaved geometric & arithmetic" },
  { type: "interleavedHard", aStart: 5, aMult: 2, bStart: 200, bStep: -15, count: 6, name: "interleaved geometric & arithmetic" },
  { type: "interleavedHard", aStart: 4, aMult: 2, bStart: 85, bStep: -8, count: 6, name: "interleaved geometric & arithmetic" },
  // Polynomial of degree 3
  { type: "poly3", a: 1, b: 2, c: 1, count: 5, name: "n³ + 2n² + 1" },
  { type: "poly3", a: 1, b: 1, c: 2, count: 5, name: "n³ + n² + 2" },
  { type: "poly3", a: 2, b: 1, c: 0, count: 4, name: "2n³ + n²" },
  // Differences multiply by 2: +3, +6, +12, +24, +48
  { type: "diffGeom", start: 2, dStart: 3, ratio: 2, count: 5, name: "differences double each step" },
  { type: "diffGeom", start: 5, dStart: 2, ratio: 2, count: 5, name: "differences double each step" },
  { type: "diffGeom", start: 1, dStart: 4, ratio: 2, count: 5, name: "differences double each step" },
  { type: "diffGeom", start: 3, dStart: 1, ratio: 3, count: 4, name: "differences triple each step" },
  // a_n = 3 * a_{n-1} - a_{n-2}
  { type: "linRec3m1", a: 1, b: 3, count: 5, name: "a_n = 3*a_{n-1} - a_{n-2}" },
  { type: "linRec3m1", a: 2, b: 5, count: 5, name: "a_n = 3*a_{n-1} - a_{n-2}" },
  { type: "linRec3m1", a: 1, b: 4, count: 5, name: "a_n = 3*a_{n-1} - a_{n-2}" },
  // Prime squares: p²
  { type: "primeSq", startIdx: 0, count: 5, name: "squares of prime numbers" },
  { type: "primeSqOffset", offset: 1, startIdx: 0, count: 5, name: "squares of prime numbers + 1" },
  { type: "primeSqOffset", offset: -1, startIdx: 1, count: 5, name: "squares of prime numbers - 1" },
  // Product of previous 2 terms minus 1
  { type: "prodPrevSub1", a: 2, b: 3, count: 4, name: "a_{n-1} × a_{n-2} - 1" },
  // Alternating cubes and squares
  { type: "altCubeSq", start: 2, count: 5, name: "alternating n² and n³" },
  // Triple factorial or double multiplier
  { type: "stepMult", start: 2, count: 5, name: "multiply by n each step" },
  // Difference is squares of primes: +4, +9, +25, +49
  { type: "diffPrimeSq", start: 1, count: 4, name: "differences are squares of prime numbers" },
  // (2^n) - n
  { type: "pow2MinusN", start: 1, count: 6, name: "2^n - n" },
  // (3^n) - 2^n
  { type: "powDiff", start: 1, count: 5, name: "3^n - 2^n" },
  // (n+1)^3 - n^3 = 3n^2 + 3n + 1 (hexagonal differences)
  { type: "hexDiff", start: 1, count: 5, name: "differences between consecutive cubes" },
  // More Pell & Recurrence variants to reach 70
  { type: "pellVariant", a: 3, b: 5, count: 5, name: "P(n) = 2*P(n-1) + P(n-2) starting 3, 5" },
  { type: "pellVariant", a: 2, b: 6, count: 5, name: "P(n) = 2*P(n-1) + P(n-2) starting 2, 6" },
  { type: "tribonacci", a: 2, b: 2, c: 4, count: 5, name: "Tribonacci variant starting 2, 2, 4" },
  { type: "diffGeom", start: 10, dStart: 5, ratio: 2, count: 5, name: "differences double each step" },
  { type: "cubePlusN", start: 2, count: 5, name: "n³ + n starting at 2" },
  { type: "cubeMinusSq", start: 3, count: 5, name: "n³ - n² starting at 3" },
  { type: "poly3", a: 1, b: 3, c: 2, count: 5, name: "n³ + 3n² + 2" },
  { type: "linRec3m1", a: 3, b: 7, count: 5, name: "a_n = 3*a_{n-1} - a_{n-2} starting 3, 7" },
  { type: "pow2MinusN", start: 2, count: 6, name: "2^n - n starting at 2" },
  { type: "powDiff", start: 2, count: 5, name: "3^n - 2^n starting at 2" },
  { type: "dynMult", start: 2, add: 4, count: 4, name: "(term × n) + 4" },
  { type: "dynMult", start: 1, add: 5, count: 4, name: "(term × n) + 5" },
  { type: "dynMult", start: 3, add: 2, count: 4, name: "(term × n) + 2" },
  { type: "secondDiff", d1: 4, d2: 6, start: 5, count: 5, name: "second difference is constant (+6)" },
  { type: "secondDiff", d1: 2, d2: 8, start: 1, count: 5, name: "second difference is constant (+8)" },
  { type: "secondDiff", d1: 7, d2: 5, start: 3, count: 5, name: "second difference is constant (+5)" },
  { type: "diffGeom", start: 7, dStart: 3, ratio: 2, count: 5, name: "differences double each step" },
  { type: "diffGeom", start: 4, dStart: 5, ratio: 2, count: 5, name: "differences double each step" },
  { type: "altOps", op1: "mul", val1: 3, op2: "add", val2: 7, start: 2, count: 5, name: "×3, +7" },
  { type: "altOps", op1: "mul", val1: 4, op2: "sub", val2: 5, start: 3, count: 4, name: "×4, -5" },
  { type: "interleavedHard", aStart: 6, aMult: 2, bStart: 120, bStep: -12, count: 6, name: "interleaved geometric & arithmetic" },
  { type: "interleavedHard", aStart: 7, aMult: 2, bStart: 90, bStep: -9, count: 6, name: "interleaved geometric & arithmetic" },
  { type: "poly3", a: 1, b: 1, c: 5, count: 5, name: "n³ + n² + 5" },
  { type: "linRec3m1", a: 2, b: 6, count: 5, name: "a_n = 3*a_{n-1} - a_{n-2} starting 2, 6" }
];

function fact(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function buildHardSeq(p) {
  const seq = [];
  let nextVal = 0;
  let expl = "";
  let hint = "";

  if (p.type === "factOffset") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(fact(i) + p.offset);
    }
    const nextN = p.start + p.count;
    nextVal = fact(nextN) + p.offset;
    expl = `Factorial pattern: n! ${p.offset >= 0 ? '+' : ''}${p.offset}. ${nextN}! ${p.offset >= 0 ? '+' : ''}${p.offset} = ${fact(nextN)} ${p.offset >= 0 ? '+' : ''}${p.offset} = ${nextVal}.`;
    hint = `Think about factorials (n!).`;
  } else if (p.type === "cubePlusN") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(i * i * i + i);
    }
    const nextN = p.start + p.count;
    nextVal = nextN * nextN * nextN + nextN;
    expl = `Pattern is n³ + n: ${nextN}³ + ${nextN} = ${nextN * nextN * nextN} + ${nextN} = ${nextVal}.`;
    hint = `Evaluate n³ + n for consecutive integers.`;
  } else if (p.type === "cubeMinusSq") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(i * i * i - i * i);
    }
    const nextN = p.start + p.count;
    nextVal = nextN * nextN * nextN - nextN * nextN;
    expl = `Pattern is n³ - n²: ${nextN}³ - ${nextN}² = ${nextVal}.`;
    hint = `Look at n³ - n².`;
  } else if (p.type === "dynMult") {
    let curr = p.start;
    seq.push(curr);
    for (let i = 1; i <= p.count; i++) {
      curr = curr * i + p.add;
      seq.push(curr);
    }
    const nextN = p.count + 1;
    nextVal = curr * nextN + p.add;
    expl = `Pattern is (term × n) + ${p.add} where n increases by 1: ${curr} × ${nextN} + ${p.add} = ${nextVal}.`;
    hint = `Multiplier increases by 1 each step.`;
  } else if (p.type === "pellVariant") {
    let a = p.a, b = p.b;
    seq.push(a, b);
    for (let i = 0; i < p.count - 1; i++) {
      const c = 2 * b + a;
      seq.push(c);
      a = b;
      b = c;
    }
    nextVal = 2 * b + a;
    expl = `Recurrence relation: a_n = 2 × a_{n-1} + a_{n-2}. 2 × ${b} + ${a} = ${nextVal}.`;
    hint = `Double the previous term and add the term before it.`;
  } else if (p.type === "tribonacci") {
    let a = p.a, b = p.b, c = p.c;
    seq.push(a, b, c);
    for (let i = 0; i < p.count - 2; i++) {
      const d = a + b + c;
      seq.push(d);
      a = b;
      b = c;
      c = d;
    }
    nextVal = a + b + c;
    expl = `Tribonacci sequence: sum of preceding 3 terms: ${a} + ${b} + ${c} = ${nextVal}.`;
    hint = `Sum of the three preceding numbers.`;
  } else if (p.type === "interleavedHard") {
    let a = p.aStart, b = p.bStart;
    for (let i = 0; i < p.count; i++) {
      if (i % 2 === 0) {
        seq.push(a);
        if (i > 0) a *= p.aMult;
      } else {
        seq.push(b);
        b += p.bStep;
      }
    }
    const isA = (p.count % 2 === 0);
    nextVal = isA ? a * p.aMult : b;
    expl = `Interleaved series: even positions multiply by ${p.aMult}, odd positions change by ${p.bStep}. Next term: ${nextVal}.`;
    hint = `Notice that odd-positioned terms follow a geometric series while even-positioned follow an arithmetic one.`;
  } else if (p.type === "poly3") {
    for (let i = 1; i <= p.count; i++) {
      seq.push(p.a * i * i * i + p.b * i * i + p.c);
    }
    const nextN = p.count + 1;
    nextVal = p.a * nextN * nextN * nextN + p.b * nextN * nextN + p.c;
    expl = `Cubic polynomial formula: for n = ${nextN}, term = ${nextVal}.`;
    hint = `A cubic sequence with constant third differences.`;
  } else if (p.type === "diffGeom") {
    let curr = p.start;
    seq.push(curr);
    let diff = p.dStart;
    for (let i = 0; i < p.count; i++) {
      curr += diff;
      seq.push(curr);
      diff *= p.ratio;
    }
    nextVal = curr + diff;
    expl = `The differences multiply by ${p.ratio} each step. Next difference is +${diff}. ${curr} + ${diff} = ${nextVal}.`;
    hint = `Differences double or triple each step.`;
  } else if (p.type === "linRec3m1") {
    let a = p.a, b = p.b;
    seq.push(a, b);
    for (let i = 0; i < p.count - 1; i++) {
      const c = 3 * b - a;
      seq.push(c);
      a = b;
      b = c;
    }
    nextVal = 3 * b - a;
    expl = `Recurrence relation a_n = 3 × a_{n-1} - a_{n-2}. 3 × ${b} - ${a} = ${nextVal}.`;
    hint = `Multiply previous number by 3, then subtract the number before it.`;
  } else if (p.type === "primeSq") {
    for (let i = p.startIdx; i < p.startIdx + p.count; i++) {
      seq.push(primes[i] * primes[i]);
    }
    const nextP = primes[p.startIdx + p.count];
    nextVal = nextP * nextP;
    expl = `Squares of prime numbers. Next prime is ${nextP} -> ${nextP}² = ${nextVal}.`;
    hint = `Squares of prime numbers (2², 3², 5², 7²...).`;
  } else if (p.type === "primeSqOffset") {
    for (let i = p.startIdx; i < p.startIdx + p.count; i++) {
      seq.push(primes[i] * primes[i] + p.offset);
    }
    const nextP = primes[p.startIdx + p.count];
    nextVal = nextP * nextP + p.offset;
    expl = `Pattern is p² ${p.offset >= 0 ? '+' : ''}${p.offset} for primes. Next prime ${nextP}² ${p.offset >= 0 ? '+' : ''}${p.offset} = ${nextVal}.`;
    hint = `Squares of primes with an offset.`;
  } else if (p.type === "pow2MinusN") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(Math.pow(2, i) - i);
    }
    const nextN = p.start + p.count;
    nextVal = Math.pow(2, nextN) - nextN;
    expl = `Pattern is 2^n - n: 2^${nextN} - ${nextN} = ${Math.pow(2, nextN)} - ${nextN} = ${nextVal}.`;
    hint = `Powers of 2 minus n.`;
  } else if (p.type === "powDiff") {
    for (let i = p.start; i < p.start + p.count; i++) {
      seq.push(Math.pow(3, i) - Math.pow(2, i));
    }
    const nextN = p.start + p.count;
    nextVal = Math.pow(3, nextN) - Math.pow(2, nextN);
    expl = `Pattern is 3^n - 2^n. For n = ${nextN}: 3^${nextN} - 2^${nextN} = ${nextVal}.`;
    hint = `Difference between powers of 3 and powers of 2.`;
  } else {
    // Fallback
    const nextN = 6;
    nextVal = nextN * nextN * nextN - nextN;
    seq.push(0, 6, 24, 60, 120);
    expl = `n³ - n`;
    hint = `n³ - n`;
  }

  return { seq, nextVal, expl, hint };
}

let hardIdx = 11;
for (const p of hardPatterns) {
  if (hardQuestions.length >= 70) break;
  const { seq, nextVal, expl, hint } = buildHardSeq(p);
  const numStr = String(hardIdx).padStart(2, '0');
  hardQuestions.push({
    id: `nd-hard-${numStr}`,
    gameType: "number-detective",
    difficulty: "hard",
    question: `${seq.join(', ')}, ?`,
    options: makeOptions(nextVal),
    correctAnswer: String(nextVal),
    explanation: expl,
    hint: hint
  });
  hardIdx++;
}

console.log(`Generated ${hardQuestions.length} Hard questions.`);

const allQuestions = [...easyQuestions, ...medQuestions, ...hardQuestions];
console.log(`Total Number Detective Questions: ${allQuestions.length}`);

// Validation
allQuestions.forEach((q, idx) => {
  if (!q.options.includes(q.correctAnswer)) {
    throw new Error(`Correct answer ${q.correctAnswer} missing from options in ${q.id}`);
  }
  if (new Set(q.options).size !== 4) {
    throw new Error(`Options not unique in ${q.id}: ${JSON.stringify(q.options)}`);
  }
});

const outPath = path.join(__dirname, '../frontend/src/data/numberDetectiveQuestions.js');
const header = `/**\n * MindForge - numberDetectiveQuestions\n * Exactly ${allQuestions.length} verified high-quality number sequence questions.\n * 70 Easy | 70 Medium | 70 Hard\n */\n\n`;
const content = header + `export const numberDetectiveQuestions = ` + JSON.stringify(allQuestions, null, 2) + `;\n\nexport default numberDetectiveQuestions;\n`;
fs.writeFileSync(outPath, content, 'utf8');
console.log(`Successfully wrote ${allQuestions.length} questions to ${outPath}`);
