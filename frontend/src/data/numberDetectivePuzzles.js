export const numberDetectivePuzzles = [
  // EASY
  {
    id: 1,
    question: "2, 4, 6, 8, 10, ?",
    answer: "12",
    explanation: "This is a simple arithmetic sequence where each number increases by 2. So after 10, the next number is 10 + 2 = 12.",
    difficulty: "EASY",
    xpReward: 10,
    hint: "Look at the difference between consecutive numbers.",
    tags: ["arithmetic", "addition"]
  },
  {
    id: 2,
    question: "5, 10, 15, 20, 25, ?",
    answer: "30",
    explanation: "Each number is a multiple of 5. The sequence increases by 5 each time, so 25 + 5 = 30.",
    difficulty: "EASY",
    xpReward: 10,
    hint: "Each number is a multiple of 5.",
    tags: ["multiples", "arithmetic"]
  },
  {
    id: 3,
    question: "1, 4, 9, 16, 25, ?",
    answer: "36",
    explanation: "These are perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36.",
    difficulty: "EASY",
    xpReward: 10,
    hint: "Think about square numbers.",
    tags: ["squares", "powers"]
  },
  // MEDIUM
  {
    id: 4,
    question: "2, 6, 12, 20, 30, ?",
    answer: "42",
    explanation: "The differences between consecutive terms are +4, +6, +8, +10 — increasing by 2 each time. So the next difference is +12, giving 30 + 12 = 42.",
    difficulty: "MEDIUM",
    xpReward: 25,
    hint: "Look at the differences between consecutive numbers.",
    tags: ["second-difference", "patterns"]
  },
  {
    id: 5,
    question: "3, 6, 11, 18, 27, ?",
    answer: "38",
    explanation: "The differences are +3, +5, +7, +9 — odd numbers increasing by 2. The next difference is +11, so 27 + 11 = 38.",
    difficulty: "MEDIUM",
    xpReward: 25,
    hint: "The differences form their own pattern.",
    tags: ["second-difference", "odd-numbers"]
  },
  {
    id: 6,
    question: "2, 3, 5, 8, 13, 21, ?",
    answer: "34",
    explanation: "Fibonacci sequence: each number is the sum of the two before it. 13 + 21 = 34.",
    difficulty: "MEDIUM",
    xpReward: 25,
    hint: "Add the two previous numbers.",
    tags: ["fibonacci", "sums"]
  },
  {
    id: 7,
    question: "1, 2, 4, 7, 11, 16, ?",
    answer: "22",
    explanation: "The differences are +1, +2, +3, +4, +5 — consecutive integers. The next difference is +6, so 16 + 6 = 22.",
    difficulty: "MEDIUM",
    xpReward: 25,
    hint: "The differences between numbers form a simple sequence.",
    tags: ["increasing-differences"]
  },
  // HARD
  {
    id: 8,
    question: "1, 8, 27, 64, 125, ?",
    answer: "216",
    explanation: "These are perfect cubes: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125, 6³=216.",
    difficulty: "HARD",
    xpReward: 50,
    hint: "Think about cubic numbers.",
    tags: ["cubes", "powers"]
  },
  {
    id: 9,
    question: "2, 5, 11, 23, 47, ?",
    answer: "95",
    explanation: "Each term is obtained by multiplying the previous term by 2 and adding 1: (2×2)+1=5, (5×2)+1=11, (11×2)+1=23, (23×2)+1=47, (47×2)+1=95.",
    difficulty: "HARD",
    xpReward: 50,
    hint: "Try doubling and adding 1.",
    tags: ["multiply", "geometric"]
  },
  {
    id: 10,
    question: "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ?",
    answer: "55",
    explanation: "Extended Fibonacci: each number is the sum of the two preceding numbers. 21 + 34 = 55.",
    difficulty: "HARD",
    xpReward: 50,
    hint: "This is a famous mathematical sequence.",
    tags: ["fibonacci", "classic"]
  },
  {
    id: 11,
    question: "1, 3, 7, 13, 21, 31, ?",
    answer: "43",
    explanation: "The differences are +2, +4, +6, +8, +10 — even numbers. The next difference is +12, so 31 + 12 = 43.",
    difficulty: "HARD",
    xpReward: 50,
    hint: "The differences between consecutive terms follow a pattern.",
    tags: ["second-difference", "even-numbers"]
  },
];
