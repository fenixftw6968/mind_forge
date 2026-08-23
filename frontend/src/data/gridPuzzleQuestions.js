/**
 * Grid Puzzle question bank
 * Matrix puzzles with guaranteed single unique solutions across symbols, shapes, rotations, and numbers.
 */

export const gridPuzzleQuestions = [
  // EASY: 3x3 Symbol & Basic Sequence Matrices
  {
    id: "gp-easy-1",
    difficulty: "EASY",
    category: "Patterns",
    title: "Symbol Latin Square",
    description: "Every row and column contains each symbol exactly once. What is the missing symbol?",
    grid: [
      ["▲", "●", "■"],
      ["●", "■", "▲"],
      ["■", "▲", "?"]
    ],
    choices: ["●", "▲", "■", "◆"],
    correctAnswer: "●",
    hint: "Each shape (▲, ●, ■) must appear exactly once per row and column.",
    explanation: "Looking at the third row: '■, ▲, ?' — the only missing symbol from the set {▲, ●, ■} is ●."
  },
  {
    id: "gp-easy-2",
    difficulty: "EASY",
    category: "Patterns",
    title: "Double Step Numbers",
    description: "Each row follows a continuous progression rule. Find the missing value.",
    grid: [
      ["2", "4", "8"],
      ["3", "6", "12"],
      ["5", "10", "?"]
    ],
    choices: ["20", "15", "25", "30"],
    correctAnswer: "20",
    hint: "In each row, the numbers double as you go left to right.",
    explanation: "In row 1: 2 * 2 = 4, 4 * 2 = 8. In row 2: 3 * 2 = 6, 6 * 2 = 12. In row 3: 5 * 2 = 10, 10 * 2 = 20."
  },
  {
    id: "gp-easy-3",
    difficulty: "EASY",
    category: "Patterns",
    title: "Arrow Rotation",
    description: "The arrows rotate clockwise by 90 degrees in each step. Find the missing orientation.",
    grid: [
      ["↑", "→", "↓"],
      ["→", "↓", "←"],
      ["↓", "←", "?"]
    ],
    choices: ["↑", "→", "↓", "↗"],
    correctAnswer: "↑",
    hint: "Each row steps through a 90° clockwise rotation.",
    explanation: "In row 3, '↓ (down)' rotates 90° clockwise to '← (left)', which rotates 90° clockwise to '↑ (up)'."
  },
  {
    id: "gp-easy-4",
    difficulty: "EASY",
    category: "Patterns",
    title: "Color Tile Matrix",
    description: "Find the missing color orb that completes the column and row balance.",
    grid: [
      ["🔴", "🔵", "🟡"],
      ["🟡", "🔴", "🔵"],
      ["🔵", "🟡", "?"]
    ],
    choices: ["🔴", "🔵", "🟡", "🟢"],
    correctAnswer: "🔴",
    hint: "Every row and column must contain Red, Blue, and Yellow.",
    explanation: "The 3rd row has Blue and Yellow, so the missing orb is Red (🔴)."
  },

  // MEDIUM: Multiple Pattern Relationships & Shapes
  {
    id: "gp-med-1",
    difficulty: "MEDIUM",
    category: "Patterns",
    title: "Summation Columns",
    description: "Look closely at the numbers across rows and columns to find the missing integer.",
    grid: [
      ["4", "7", "11"],
      ["5", "8", "13"],
      ["9", "6", "?"]
    ],
    choices: ["15", "14", "16", "18"],
    correctAnswer: "15",
    hint: "The third column is the sum of the first two columns.",
    explanation: "Row 1: 4 + 7 = 11. Row 2: 5 + 8 = 13. Row 3: 9 + 6 = 15."
  },
  {
    id: "gp-med-2",
    difficulty: "MEDIUM",
    category: "Patterns",
    title: "Geometric Count Grid",
    description: "The count of vertices increases following a systematic grid rule.",
    grid: [
      ["● (0)", "▲ (3)", "■ (4)"],
      ["▲ (3)", "■ (4)", "⬟ (5)"],
      ["■ (4)", "⬟ (5)", "?"]
    ],
    choices: ["⬡ (6)", "▲ (3)", "● (0)", "★ (10)"],
    correctAnswer: "⬡ (6)",
    hint: "Track the number of sides: 4 (square), 5 (pentagon), then what has 6 sides?",
    explanation: "The number of sides increases diagonally and row-wise: 4 -> 5 -> 6 (Hexagon, ⬡)."
  },
  {
    id: "gp-med-3",
    difficulty: "MEDIUM",
    category: "Patterns",
    title: "Multiplication Matrix",
    description: "Determine the mathematical operator linking the rows and columns.",
    grid: [
      ["3", "4", "12"],
      ["5", "6", "30"],
      ["7", "8", "?"]
    ],
    choices: ["56", "54", "48", "64"],
    correctAnswer: "56",
    hint: "Col 1 * Col 2 = Col 3.",
    explanation: "Row 1: 3 * 4 = 12. Row 2: 5 * 6 = 30. Row 3: 7 * 8 = 56."
  },

  // HARD: Multi-rule & Complex Transformation Matrices
  {
    id: "gp-hard-1",
    difficulty: "HARD",
    category: "Patterns",
    title: "Prime Matrix",
    description: "A mathematical ordering sequence spans across the grid.",
    grid: [
      ["2", "3", "5"],
      ["7", "11", "13"],
      ["17", "19", "?"]
    ],
    choices: ["23", "21", "25", "29"],
    correctAnswer: "23",
    hint: "The grid contains consecutive prime numbers in reading order.",
    explanation: "2, 3, 5, 7, 11, 13, 17, 19 — the next prime number is 23."
  },
  {
    id: "gp-hard-2",
    difficulty: "HARD",
    category: "Patterns",
    title: "Compound Transformation",
    description: "Both shape fill and rotation transform simultaneously across the matrix.",
    grid: [
      ["◇ (Empty)", "◈ (Dot)", "◆ (Full)"],
      ["◆ (Full)", "◇ (Empty)", "◈ (Dot)"],
      ["◈ (Dot)", "◆ (Full)", "?"]
    ],
    choices: ["◇ (Empty)", "◈ (Dot)", "◆ (Full)", "○ (Circle)"],
    correctAnswer: "◇ (Empty)",
    hint: "Latin square of three distinct fill states: Empty, Dot, and Full.",
    explanation: "The bottom row has Dot and Full. The missing third state is Empty (◇)."
  },
  {
    id: "gp-hard-3",
    difficulty: "HARD",
    category: "Patterns",
    title: "Fibonacci Spiral Grid",
    description: "The sequence follows an additive spiral law.",
    grid: [
      ["1", "1", "2"],
      ["3", "5", "8"],
      ["13", "21", "?"]
    ],
    choices: ["34", "31", "29", "42"],
    correctAnswer: "34",
    hint: "Fibonacci sequence: each number is the sum of the two preceding ones.",
    explanation: "13 + 21 = 34."
  }
];

export default gridPuzzleQuestions;
