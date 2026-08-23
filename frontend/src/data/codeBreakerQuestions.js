import { CURATED_CODE_PUZZLES } from '../utils/codeBreakerGenerator';

export const codeBreakerQuestions = [
  ...CURATED_CODE_PUZZLES.EASY.map((p, i) => ({
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
  ...CURATED_CODE_PUZZLES.MEDIUM.map((p, i) => ({
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
  ...CURATED_CODE_PUZZLES.HARD.map((p, i) => ({
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

export default codeBreakerQuestions;
