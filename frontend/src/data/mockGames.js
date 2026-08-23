import { getAllGamesList } from './gameRegistry';

export const mockGames = getAllGamesList();

export const mockLeaderboard = [
  { rank: 1, username: "NeuralNinja",    level: 22, xp: 14200, streak: 31, isCurrentUser: false },
  { rank: 2, username: "CipherMaster",  level: 20, xp: 12800, streak: 18, isCurrentUser: false },
  { rank: 3, username: "LogicPhantom",  level: 19, xp: 11500, streak: 25, isCurrentUser: false },
  { rank: 4, username: "PuzzleWitch",   level: 17, xp: 9800,  streak: 7,  isCurrentUser: false },
  { rank: 5, username: "MindBender42",  level: 16, xp: 8900,  streak: 12, isCurrentUser: false },
  { rank: 6, username: "DetectiveX",    level: 15, xp: 7600,  streak: 4,  isCurrentUser: false },
  { rank: 7, username: "ShadowThinker", level: 7,  xp: 720,   streak: 5,  isCurrentUser: true  },
  { rank: 8, username: "QuantumBrain",  level: 6,  xp: 650,   streak: 2,  isCurrentUser: false },
];

export const mockDailyChallenge = {
  id: 101,
  title: "The Paradox Sequence",
  description: "A master-level number sequence that has stumped 80% of players. Do you have what it takes?",
  type: "number-detective",
  difficulty: "HARD",
  xpReward: 100,
  coinReward: 50,
  expiresAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
  completedToday: false,
  puzzle: {
    question: "1, 1, 2, 3, 5, 8, 13, 21, ?",
    answer: "34",
    explanation: "This is the Fibonacci sequence. Each number is the sum of the two preceding ones. 13 + 21 = 34.",
    hint: "Look at the sum of consecutive pairs."
  }
};
