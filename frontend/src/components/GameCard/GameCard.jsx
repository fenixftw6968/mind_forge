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
  EASY:   { bg: 'rgba(34, 197, 94, 0.12)', color: '#4ADE80', border: 'rgba(34, 197, 94, 0.25)', label: 'Easy' },
  MEDIUM: { bg: 'rgba(245, 158, 11, 0.12)', color: '#FBBF24', border: 'rgba(245, 158, 11, 0.25)', label: 'Medium' },
  HARD:   { bg: 'rgba(244, 63, 94, 0.12)', color: '#FB7185', border: 'rgba(244, 63, 94, 0.25)', label: 'Hard' },
};

const SLUG_ICONS = {
  'dsa-master-quiz': Code2,
  'logic-puzzle': Puzzle,
  'brain-teaser-battle': Sparkles,
  'number-detective': Hash,
  'memory-challenge': Eye,
  'code-breaker': KeyRound,
};

export default function GameCard({ game, index = 0, isDashboardFeatured = false }) {
  const diff = DIFFICULTY_STYLES[game.difficulty] || DIFFICULTY_STYLES.MEDIUM;
  const IconComponent = SLUG_ICONS[game.slug] || HelpCircle;
  const categoryLabel = CATEGORY_TAGS[game.category] || game.category?.toUpperCase() || 'GAME';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      whileHover={game.isUnlocked ? { y: -2, transition: { duration: 0.15 } } : {}}
      style={{ position: 'relative' }}
    >
      <Link
        to={game.isUnlocked ? `/games/${game.slug}` : '#'}
        style={{
          display: 'block',
          textDecoration: 'none',
          background: '#242424',
          border: '1px solid #2E2E2E',
          borderRadius: '1rem',
          padding: '1.35rem 1.45rem',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.15s ease',
          cursor: game.isUnlocked ? 'pointer' : 'default',
          opacity: game.isUnlocked ? 1 : 0.6,
        }}
        onMouseEnter={e => {
          if (game.isUnlocked) {
            e.currentTarget.style.borderColor = '#22C55E';
            e.currentTarget.style.boxShadow = '0 6px 20px -2px rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.background = '#282828';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#2E2E2E';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.25)';
          e.currentTarget.style.background = '#242424';
        }}
      >
        {/* Top Header: Category Tag & NEW Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{
            fontSize: '0.675rem',
            fontWeight: 800,
            color: '#64748B',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            {categoryLabel}
          </span>
          {game.isNew && (
            <span style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#4ADE80',
              border: '1px solid rgba(34, 197, 94, 0.3)',
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
            background: '#1A1A1A',
            border: '1px solid #333333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {game.isUnlocked ? (
              <IconComponent size={20} color="#22C55E" />
            ) : (
              <Lock size={16} color="#64748B" />
            )}
          </div>

          {/* Title & Difficulty Badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="font-display" style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: '#F8FAFC',
              marginBottom: '0.25rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {game.title}
            </h3>

            <span style={{
              display: 'inline-block',
              fontSize: '0.675rem',
              fontWeight: 700,
              padding: '0.1rem 0.45rem',
              borderRadius: '4px',
              background: diff.bg,
              color: diff.color,
              border: `1px solid ${diff.border}`
            }}>
              {diff.label}
            </span>
          </div>

          {/* Navigation Chevron */}
          <div style={{ color: '#64748B', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <ChevronRight size={17} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
