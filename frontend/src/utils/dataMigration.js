/**
 * MindMaze Data Migration & Backward Compatibility Utility
 * 
 * Safely cleans obsolete cache and legacy storage keys from removed games
 * without wiping user XP, levels, coins, streaks, or active game progress.
 */

const DATA_VERSION_KEY = 'mindmaze-data-version';
const CURRENT_DATA_VERSION = 2;

const OBSOLETE_GAME_SLUGS = [
  'who-is-lying',
  'pattern-detective',
  'spot-the-fallacy',
  'solve-the-crime'
];

/**
 * Runs one-time versioned migration on application startup.
 */
export function runDataMigration() {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const rawVersion = localStorage.getItem(DATA_VERSION_KEY);
    const storedVersion = rawVersion ? parseInt(rawVersion, 10) : 1;

    if (storedVersion >= CURRENT_DATA_VERSION) {
      return; // Already up to date
    }

    console.info(`[MindMaze Migration] Upgrading data version from v${storedVersion} to v${CURRENT_DATA_VERSION}...`);

    // 1. Find and purge obsolete daily/game cache keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const isObsoleteDaily = OBSOLETE_GAME_SLUGS.some(slug => key.startsWith(`mindmaze-daily-${slug}`));
      const isObsoleteGameSpecific = OBSOLETE_GAME_SLUGS.some(slug => key.includes(slug));

      if (isObsoleteDaily || (isObsoleteGameSpecific && !key.startsWith('mm_user') && !key.startsWith('mm_token'))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (e) {}
    });

    // 2. Mark current data version
    localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));
    console.info(`[MindMaze Migration] Successfully upgraded to v${CURRENT_DATA_VERSION}. Removed ${keysToRemove.length} obsolete cache keys.`);
  } catch (err) {
    console.warn('[MindMaze Migration] Non-fatal error during migration:', err);
  }
}

export default runDataMigration;
