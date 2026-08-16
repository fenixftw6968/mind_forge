import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, Star } from 'lucide-react';

const DIFFICULTY_COLORS = {
  EASY:   { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)', label: 'Easy' },
  MEDIUM: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)', label: 'Medium' },
  HARD:   { bg: 'rgba(244,63,94,0.12)',  color: '#f43f5e', border: 'rgba(244,63,94,0.25)',  label: 'Hard' },
};

const CATEGORY_COLORS = {
  'Logic':           '#8b5cf6',
  'Mystery':         '#06b6d4',
  'Critical Thinking': '#f59e0b',
  'Patterns':        '#10b981',
  'Memory':          '#f43f5e',
  'Decision Making': '#ec4899',
};

export default function GameCard({ game, index = 0 }) {
  const diff  = DIFFICULTY_COLORS[game.difficulty] || DIFFICULTY_COLORS.MEDIUM;
  const catColor = CATEGORY_COLORS[game.category] || '#8b5cf6';
  const xpMax = typeof game.xpReward === 'object' ? Math.max(...Object.values(game.xpReward)) : game.xpReward;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{ position: 'relative' }}
    >
      <div style={{
        background: '#13131f',
        border: '1px solid rgba(139,92,246,0.12)',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        cursor: game.isUnlocked ? 'pointer' : 'default',
        opacity: game.isUnlocked ? 1 : 0.6,
      }}
      onMouseEnter={e => {
        if (game.isUnlocked) {
          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 25px rgba(139,92,246,0.15)';
          e.currentTarget.style.background = '#1a1a2e';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.12)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = '#13131f';
      }}
      >
        {/* Badges row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {/* Category */}
            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '999px', background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}30`, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {game.category}
            </span>
            {/* New badge */}
            {game.isNew && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
                NEW
              </span>
            )}
          </div>
          {/* Difficulty */}
          <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '999px', background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
            {diff.label}
          </span>
        </div>

        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${catColor}25, ${catColor}10)`,
            border: `1px solid ${catColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', flexShrink: 0,
          }}>
            {game.isUnlocked ? game.icon : <Lock size={20} color="#52526a" />}
          </div>
          <div>
            <h3 className="font-accent" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{game.title}</h3>
            <p style={{ fontSize: '0.75rem', color: '#52526a', marginTop: '0.15rem' }}>
              {game.totalPlayers?.toLocaleString()} players
            </p>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.85rem', color: '#a1a1b5', lineHeight: 1.6, flex: 1 }}>
          {game.description}
        </p>

        {/* XP + completion */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Star size={13} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>Up to {xpMax} XP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${game.completionRate || 0}%`, background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', borderRadius: '999px' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#52526a' }}>{game.completionRate}%</span>
          </div>
        </div>

        {/* Play button */}
        {game.isUnlocked ? (
          <Link
            to={`/games/${game.slug}`}
            className="btn-primary"
            style={{ textAlign: 'center', textDecoration: 'none', justifyContent: 'center', padding: '0.65rem', fontSize: '0.875rem' }}
          >
            Play Now →
          </Link>
        ) : (
          <button
            disabled
            style={{ width: '100%', padding: '0.65rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', color: '#52526a', border: '1px solid rgba(255,255,255,0.06)', cursor: 'not-allowed', fontSize: '0.875rem', fontWeight: 600 }}
          >
            🔒 Locked
          </button>
        )}
      </div>
    </motion.div>
  );
}
