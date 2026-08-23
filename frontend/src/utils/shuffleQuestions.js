/**
 * Fisher-Yates (Knuth) Shuffle Algorithm
 * Returns a new shuffled array without mutating the original array.
 * 
 * @template T
 * @param {T[]} array - The array to shuffle
 * @returns {T[]} A new shuffled copy of the array
 */
export function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default shuffleArray;
