import { shuffleArray } from '../utils/shuffleQuestions.js';
import { balanceAndRandomizeQuestionOptions } from '../utils/optionRandomizer.js';
import { selectQuestionsForGame, fetchUserQuestionHistory, recordUserQuestions, resetUserQuestionHistory } from './questionHistoryService.js';

export { selectQuestionsForGame, fetchUserQuestionHistory, recordUserQuestions, resetUserQuestionHistory };

const STORAGE_KEY_PREFIX = 'mindmaze-recent-played';
const RECENT_MEMORY_SIZE = 50; // Remember last 50 questions per game/difficulty

function readStorage(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    }
    return [];
  } catch (e) {
    console.warn(`Failed to read storage for ${key}:`, e);
    return [];
  }
}

function writeStorage(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`Failed to write storage for ${key}:`, e);
  }
}

export function getRandomQuestionSet({
  gameType,
  difficulty = 'all',
  questionBank = [],
  count = 10,
  userShuffle = true
} = {}) {
  if (!Array.isArray(questionBank) || questionBank.length === 0) {
    return [];
  }

  const normGame = (gameType || 'generic').toLowerCase().trim();
  const normDiff = (difficulty || 'all').toLowerCase().trim();
  const key = `${STORAGE_KEY_PREFIX}-${normGame}-${normDiff}`;
  
  let eligible = questionBank;
  if (normDiff !== 'all') {
    eligible = questionBank.filter(
      q => q.difficulty && q.difficulty.toLowerCase() === normDiff
    );
    if (eligible.length === 0) {
      eligible = questionBank;
    }
  }

  const recentlyPlayedIds = new Set(readStorage(key));

  const bucketFresh = eligible.filter(q => !recentlyPlayedIds.has(String(q.id)));
  const bucketPlayed = eligible.filter(q => recentlyPlayedIds.has(String(q.id)));

  const shuffledFresh = shuffleArray(bucketFresh);
  const shuffledPlayed = shuffleArray(bucketPlayed);

  let chosen = [];

  if (shuffledFresh.length >= count) {
    chosen = shuffledFresh.slice(0, count);
  } else {
    chosen = [...shuffledFresh];
    const needed = count - chosen.length;
    chosen.push(...shuffledPlayed.slice(0, needed));
  }

  const uniqueChosen = Array.from(new Set(chosen)).slice(0, count);

  // Update recently played
  const newRecentIds = [...readStorage(key), ...uniqueChosen.map(q => String(q.id))];
  // Keep only the most recent RECENT_MEMORY_SIZE ids
  if (newRecentIds.length > RECENT_MEMORY_SIZE) {
    newRecentIds.splice(0, newRecentIds.length - RECENT_MEMORY_SIZE);
  }
  writeStorage(key, newRecentIds);

  const orderedQuestions = userShuffle ? shuffleArray([...uniqueChosen]) : [...uniqueChosen];
  return balanceAndRandomizeQuestionOptions(orderedQuestions);
}

export async function getRandomQuestionSetAsync(options = {}) {
  return selectQuestionsForGame({
    gameSlug: options.gameType,
    difficulty: options.difficulty,
    questionBank: options.questionBank,
    count: options.count,
    userShuffle: options.userShuffle !== false
  });
}

