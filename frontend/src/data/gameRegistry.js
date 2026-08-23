/**
 * MindMaze Centralized Game Registry
 * Single source of truth for all active games, metadata, categories, and engine types.
 */

export const GAME_TYPES = {
  QUESTION: 'question',
  MEMORY: 'memory',
  LOGIC: 'logic',
  REACTION: 'reaction',
  PUZZLE: 'puzzle',
  SPEED: 'speed',
};

export const GAME_REGISTRY = {
  'number-detective': {
    id: 1,
    slug: 'number-detective',
    title: 'Number Detective',
    description: 'Crack the code hidden in number sequences. Find the pattern and discover the missing number.',
    category: 'Logic',
    icon: '🔢',
    difficulty: 'MEDIUM',
    type: GAME_TYPES.QUESTION,
    requiresDailyQuestions: true,
    xpReward: { easy: 10, medium: 25, hard: 50 },
    totalPlayers: 12450,
    completionRate: 68,
    isUnlocked: true,
    isNew: false,
    isFeatured: true,
    tags: ['numbers', 'sequences', 'logic', 'math'],
    estimatedTime: '3-5 min',
  },
  'memory-challenge': {
    id: 2,
    slug: 'memory-challenge',
    title: 'Memory Challenge',
    description: 'Observe the scene, then recall every detail. Train your observation and memory skills.',
    category: 'Memory',
    icon: '🧠',
    difficulty: 'EASY',
    type: GAME_TYPES.MEMORY,
    requiresDailyQuestions: true,
    xpReward: { easy: 15, medium: 25, hard: 50 },
    totalPlayers: 18900,
    completionRate: 80,
    isUnlocked: true,
    isNew: false,
    isFeatured: false,
    tags: ['memory', 'observation', 'attention', 'visual'],
    estimatedTime: '2-4 min',
  },
  'code-breaker': {
    id: 3,
    slug: 'code-breaker',
    title: 'Code Breaker',
    description: 'Use logical clues to deduce the secret code. Test your deductive reasoning and elimination skills.',
    category: 'Logic',
    icon: '🔐',
    difficulty: 'MEDIUM',
    type: GAME_TYPES.LOGIC,
    requiresDailyQuestions: true,
    xpReward: { easy: 15, medium: 30, hard: 60 },
    totalPlayers: 9420,
    completionRate: 62,
    isUnlocked: true,
    isNew: true,
    isFeatured: true,
    tags: ['logic', 'deduction', 'code', 'mastermind'],
    estimatedTime: '3-5 min',
  },
  'reaction-rush': {
    id: 4,
    slug: 'reaction-rush',
    title: 'Reaction Rush',
    description: 'Test your speed, focus, and reaction time. Wait for the green signal and click as fast as possible.',
    category: 'Reaction',
    icon: '⚡',
    difficulty: 'MEDIUM',
    type: GAME_TYPES.REACTION,
    requiresDailyQuestions: false,
    xpReward: { easy: 10, medium: 20, hard: 40 },
    totalPlayers: 14200,
    completionRate: 85,
    isUnlocked: true,
    isNew: true,
    isFeatured: false,
    tags: ['speed', 'reflexes', 'timing', 'focus'],
    estimatedTime: '1-2 min',
  },
  'grid-puzzle': {
    id: 5,
    slug: 'grid-puzzle',
    title: 'Grid Puzzle',
    description: 'Find the missing piece and complete the pattern across symbolic, shape, and numeric matrices.',
    category: 'Patterns',
    icon: '🧩',
    difficulty: 'MEDIUM',
    type: GAME_TYPES.PUZZLE,
    requiresDailyQuestions: true,
    xpReward: { easy: 15, medium: 25, hard: 50 },
    totalPlayers: 11300,
    completionRate: 71,
    isUnlocked: true,
    isNew: true,
    isFeatured: false,
    tags: ['patterns', 'grids', 'matrices', 'shapes'],
    estimatedTime: '3-5 min',
  },
  'speed-match': {
    id: 6,
    slug: 'speed-match',
    title: 'Speed Match',
    description: 'Make fast decisions and test your concentration with rapid Stroop and color-word matching.',
    category: 'Decision Making',
    icon: '🎯',
    difficulty: 'HARD',
    type: GAME_TYPES.SPEED,
    requiresDailyQuestions: false,
    xpReward: { easy: 15, medium: 30, hard: 55 },
    totalPlayers: 16750,
    completionRate: 64,
    isUnlocked: true,
    isNew: true,
    isFeatured: true,
    tags: ['speed', 'stroop', 'focus', 'decision'],
    estimatedTime: '2-3 min',
  },
};

export const ACTIVE_GAME_SLUGS = Object.keys(GAME_REGISTRY);

export const getAllGamesList = () => Object.values(GAME_REGISTRY);

export const getGameConfig = (slug) => GAME_REGISTRY[slug] || null;

export const isDailyQuestionGame = (slug) => {
  const game = GAME_REGISTRY[slug];
  return game ? !!game.requiresDailyQuestions : false;
};

export default GAME_REGISTRY;
