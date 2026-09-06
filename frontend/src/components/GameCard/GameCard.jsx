import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, ChevronRight, Hash, Eye, KeyRound, Code2, Puzzle, Sparkles, HelpCircle } from 'lucide-react';

const CATEGORY_TAGS = {
  'Programming / DSA': 'PROGRAMMING',
  'Reasoning': 'REASONING',
  'Brain Training': 'BRAIN TRAINING',
  'Logic': 'LOGIC',
  'Memory': 'MEMORY',
};

const DIFFICULTY_STYLES = {
  EASY:   { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)', label: 'Easy' },
  MEDIUM: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', label: 'Medium' },
  HARD:   { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.35)', label: 'Hard' },
};

const SLUG_ICONS = {
  'dsa-master-quiz': Code2,
  'logic-puzzle': Puzzle,
  'brain-teaser-battle': Sparkles,
  'number-detective': Hash,
  'memory-challenge': Eye,
  'code-breaker': KeyRound,
};

export default function GameCard({ game, index = 0, isDashboardFeatured = false, activeDifficulty = 'All' }) {
  const diffKey = (activeDifficulty && activeDifficulty !== 'All') ? activeDifficulty.toUpperCase() : game.difficulty;
  const diff = DIFFICULTY_STYLES[diffKey] || DIFFICULTY_STYLES[game.difficulty] || DIFFICULTY_STYLES.MEDIUM;
  const IconComponent = SLUG_ICONS[game.slug] || HelpCircle;
  const categoryLabel = CATEGORY_TAGS[game.category] || game.category?.toUpperCase() || 'GAME';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      whileHover={game.isUnlocked ? { y: -3, transition: { duration: 0.15 } } : {}}
      style={{ position: 'relative' }}
    >
      <Link
        to={game.isUnlocked ? `/games/${game.slug}` : '#'}
        style={{
          display: 'block',
          textDecoration: 'none',
          background: 'rgba(8, 14, 33, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1rem',
          padding: '1.35rem 1.45rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: game.isUnlocked ? 'pointer' : 'default',
          opacity: game.isUnlocked ? 1 : 0.6,
        }}
        onMouseEnter={e => {
          if (game.isUnlocked) {
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.45)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.18)';
            e.currentTarget.style.background = 'rgba(13, 23, 56, 0.88)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.35)';
          e.currentTarget.style.background = 'rgba(8, 14, 33, 0.75)';
        }}
      >
        {/* Top Header: Category Tag & NEW Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{
            fontSize: '0.675rem',
            fontWeight: 700,
            color: '#64748B',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            // {categoryLabel}
          </span>
          {game.isNew && (
            <span style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              letterSpacing: '0.04em'
            }}>
              NEW
            </span>
          )}
        </div>

        {/* Content Row: Icon Box, Title & Difficulty Pill, Chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          {/* Icon Box */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 14px rgba(59, 130, 246, 0.25)'
          }}>
            {game.isUnlocked ? (
              <IconComponent size={22} color="#60A5FA" />
            ) : (
              <Lock size={18} color="#64748B" />
            )}
          </div>

          {/* Title & Difficulty Pill */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="font-display" style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#F8FAFC',
              marginBottom: '0.35rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {game.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.675rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                background: diff.bg,
                color: diff.color,
                border: `1px solid ${diff.border}`,
                letterSpacing: '0.02em'
              }}>
                {diff.label}
              </span>
            </div>
          </div>

          {/* Action Chevron */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94A3B8',
            flexShrink: 0
          }}>
            <ChevronRight size={15} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
