// Rank definition and utilities
export const COMPETITIVE_RANKS = [
  { name: "Rookie",   minRating: 0,    maxRating: 199,  badge: "🌱", color: "#64748B", bg: "#F1F5F9", border: "#CBD5E1", desc: "Starting tier" },
  { name: "Scout",    minRating: 200,  maxRating: 399,  badge: "🧭", color: "#0284C7", bg: "#F0F9FF", border: "#BAE6FD", desc: "Sharpening reflexes" },
  { name: "Knight",   minRating: 400,  maxRating: 599,  badge: "🛡️", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", desc: "Tactical challenger" },
  { name: "Guardian", minRating: 600,  maxRating: 799,  badge: "⚔️", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", desc: "Proven defender" },
  { name: "Champion", minRating: 800,  maxRating: 1049, badge: "🌟", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", desc: "Grand competitor" },
  { name: "Elite",    minRating: 1050, maxRating: 1349, badge: "⚡", color: "#E11D48", bg: "#FFF1F2", border: "#FECDD3", desc: "Master of speed" },
  { name: "Legend",   minRating: 1350, maxRating: 1699, badge: "🔮", color: "#9333EA", bg: "#FAF5FF", border: "#E9D5FF", desc: "Grandmaster mind" },
  { name: "Mythic",   minRating: 1700, maxRating: 9999, badge: "👑", color: "#4F46E5", bg: "#EEF2FF", border: "#C7D2FE", desc: "Peak intellect" },
];

export const getRankFromRating = (rating) => {
  const r = Math.max(0, Number(rating) || 0);
  return COMPETITIVE_RANKS.find(rank => r >= rank.minRating && r <= rank.maxRating) || COMPETITIVE_RANKS[0];
};

export const getNextRank = (rating) => {
  const current = getRankFromRating(rating);
  const idx = COMPETITIVE_RANKS.findIndex(r => r.name === current.name);
  if (idx < COMPETITIVE_RANKS.length - 1) {
    return COMPETITIVE_RANKS[idx + 1];
  }
  return null;
};

export const getRankProgress = (rating) => {
  const current = getRankFromRating(rating);
  const next = getNextRank(rating);
  if (!next) return 100;
  const range = next.minRating - current.minRating;
  const currentInRange = (rating || 0) - current.minRating;
  return Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
};
