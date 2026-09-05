import api from '../utils/api.js';
import { shuffleArray } from '../utils/shuffleQuestions.js';
import { balanceAndRandomizeQuestionOptions } from '../utils/optionRandomizer.js';

/**
 * Checks whether an authenticated JWT token is present.
 */
export function isAuthenticated() {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  const token = localStorage.getItem('mm_token');
  return !!token && token.trim().length > 0;
}

/**
 * Selects questions for a game session using the server database as the source of truth.
 * Ensures cross-device and cross-computer question synchronization.
 * 
 * @param {Object} params
 * @param {string} params.gameSlug - e.g. 'dsa-master-quiz', 'number-detective', etc.
 * @param {string} [params.difficulty='all'] - 'easy' | 'medium' | 'hard' | 'all'
 * @param {Array} [params.questionBank=[]] - All available questions in the pool
 * @param {number} [params.count=10] - Number of questions to return
 * @param {boolean} [params.userShuffle=true] - Whether to shuffle questions
 * @returns {Promise<Array>} Selected questions with balanced options
 */
export async function selectQuestionsForGame({
  gameSlug,
  difficulty = 'all',
  questionBank = [],
  count = 10,
  userShuffle = true
} = {}) {
  if (!Array.isArray(questionBank) || questionBank.length === 0) {
    return [];
  }

  const normGame = (gameSlug || 'generic').toLowerCase().trim();
  const normDiff = (difficulty || 'all').toLowerCase().trim();

  // 1. Filter by difficulty if specified
  let eligible = questionBank;
  if (normDiff !== 'all') {
    const matching = questionBank.filter(
      q => q.difficulty && q.difficulty.toLowerCase() === normDiff
    );
    if (matching.length > 0) {
      eligible = matching;
    }
  }

  // Create lookup map by string ID
  const poolMap = new Map();
  eligible.forEach(q => poolMap.set(String(q.id), q));

  // 2. If authenticated, request selection from the backend with strict timeout
  if (isAuthenticated()) {
    try {
      const candidateIds = eligible.map(q => String(q.id));
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);

      const res = await api.post('/api/question-history/select', {
        gameSlug: normGame,
        difficulty: normDiff,
        candidateIds: candidateIds,
        count: count
      }, {
        signal: controller.signal,
        timeout: 1800
      });
      clearTimeout(timeoutId);

      if (res.data && Array.isArray(res.data.selectedIds) && res.data.selectedIds.length > 0) {
        const selected = [];
        for (const id of res.data.selectedIds) {
          const q = poolMap.get(String(id));
          if (q) selected.push(q);
        }

        // If server selected fewer than needed (e.g. pool size smaller than count), fill remainder
        if (selected.length < count) {
          const selectedSet = new Set(selected.map(q => String(q.id)));
          const remainder = eligible.filter(q => !selectedSet.has(String(q.id)));
          const extra = shuffleArray(remainder).slice(0, count - selected.length);
          selected.push(...extra);
        }

        if (selected.length > 0) {
          const finalQuestions = userShuffle ? shuffleArray([...selected]) : [...selected];
          return balanceAndRandomizeQuestionOptions(finalQuestions);
        }
      }
    } catch (err) {
      console.warn('Server question selection skipped or timed out, using fast local pool selection:', err.message || err);
    }
  }

  // 3. Guest / Offline / Fast Fallback: Local shuffle selection
  const shuffled = shuffleArray([...eligible]);
  const fallbackSelection = shuffled.slice(0, Math.min(count, shuffled.length));
  const ordered = userShuffle ? shuffleArray([...fallbackSelection]) : fallbackSelection;
  return balanceAndRandomizeQuestionOptions(ordered);
}

/**
 * Fetches the user's used question history from the backend.
 */
export async function fetchUserQuestionHistory(gameSlug, difficulty = 'all') {
  if (!isAuthenticated()) return [];
  try {
    const res = await api.get('/api/question-history', {
      params: {
        gameSlug: (gameSlug || '').toLowerCase().trim(),
        difficulty: (difficulty || 'all').toUpperCase().trim()
      }
    });
    return res.data?.usedQuestionIds || [];
  } catch (err) {
    console.warn('Failed to fetch question history from server:', err);
    return [];
  }
}

/**
 * Manually records questions as used on the server.
 */
export async function recordUserQuestions(gameSlug, difficulty = 'all', questionIds = []) {
  if (!isAuthenticated() || !Array.isArray(questionIds) || questionIds.length === 0) return;
  try {
    await api.post('/api/question-history/record', {
      gameSlug: (gameSlug || '').toLowerCase().trim(),
      difficulty: (difficulty || 'all').toUpperCase().trim(),
      questionIds: questionIds.map(String)
    });
  } catch (err) {
    console.warn('Failed to record question history on server:', err);
  }
}

/**
 * Manually resets question history cycle on the server.
 */
export async function resetUserQuestionHistory(gameSlug, difficulty = 'all') {
  if (!isAuthenticated()) return;
  try {
    await api.delete('/api/question-history/reset', {
      params: {
        gameSlug: (gameSlug || '').toLowerCase().trim(),
        difficulty: (difficulty || 'all').toUpperCase().trim()
      }
    });
  } catch (err) {
    console.warn('Failed to reset question history on server:', err);
  }
}

export default {
  selectQuestionsForGame,
  fetchUserQuestionHistory,
  recordUserQuestions,
  resetUserQuestionHistory,
  isAuthenticated
};
