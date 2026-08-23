/**
 * Timezone utilities for Indian Standard Time (IST - Asia/Kolkata).
 * Ensures all daily question refreshes and calendar calculations
 * are strictly anchored to 12:00:00 AM IST regardless of local device timezone.
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

// Intl Formatter configured specifically for Asia/Kolkata
const istDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: IST_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

/**
 * Returns the current date in Asia/Kolkata formatted as YYYY-MM-DD.
 * @param {Date|number} [date=new Date()]
 * @returns {string} e.g. "2026-08-22"
 */
export function getISTDate(date = new Date()) {
  const d = typeof date === 'number' ? new Date(date) : date;
  return istDateFormatter.format(d);
}

/**
 * Computes the epoch millisecond timestamp of the NEXT 12:00:00 AM (midnight) IST.
 * 
 * IST is fixed at UTC+5:30 (+19800 seconds / +19800000 ms).
 * 
 * @param {Date|number} [date=new Date()]
 * @returns {number} Timestamp in milliseconds
 */
export function getNextMidnightIST(date = new Date()) {
  const d = typeof date === 'number' ? new Date(date) : date;
  const istOffsetMs = 5.5 * 60 * 60 * 1000; // +05:30 in ms
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Convert given UTC time to equivalent IST time
  const istTime = d.getTime() + istOffsetMs;

  // Find start of the current IST day in IST coordinates
  const istDayStart = Math.floor(istTime / oneDayMs) * oneDayMs;

  // Next IST midnight in IST coordinates
  const nextIstMidnightInIst = istDayStart + oneDayMs;

  // Convert back to UTC epoch ms
  return nextIstMidnightInIst - istOffsetMs;
}

/**
 * Calculates remaining time until the next 12:00:00 AM IST.
 * 
 * @param {Date|number} [date=new Date()]
 * @returns {{ remainingMs: number, hours: number, minutes: number, seconds: number, formatted: string, istDate: string }}
 */
export function getTimeUntilMidnightIST(date = new Date()) {
  const d = typeof date === 'number' ? new Date(date) : date;
  const nextMidnight = getNextMidnightIST(d);
  const remainingMs = Math.max(0, nextMidnight - d.getTime());

  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');
  const formatted = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

  return {
    remainingMs,
    hours,
    minutes,
    seconds,
    formatted,
    istDate: getISTDate(d)
  };
}

/**
 * Returns an array of previous date strings (YYYY-MM-DD) in Asia/Kolkata for N days.
 * 
 * @param {number} [daysCount=7]
 * @param {Date|number} [fromDate=new Date()]
 * @returns {string[]} e.g. ["2026-08-21", "2026-08-20", "2026-08-19", ...]
 */
export function getPastISTDates(daysCount = 7, fromDate = new Date()) {
  const d = typeof fromDate === 'number' ? new Date(fromDate) : fromDate;
  const dates = [];
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (let i = 1; i <= daysCount; i++) {
    const pastDate = new Date(d.getTime() - i * oneDayMs);
    dates.push(getISTDate(pastDate));
  }

  return dates;
}

export default {
  IST_TIMEZONE,
  getISTDate,
  getNextMidnightIST,
  getTimeUntilMidnightIST,
  getPastISTDates
};
