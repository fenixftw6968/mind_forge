import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, ChevronRight, Hash, Eye, KeyRound, Zap, Grid3x3, Target, HelpCircle } from 'lucide-react';

const CATEGORY_TAGS = {
  'Logic': 'LOGIC',
  'Memory': 'MEMORY',
  'Reaction': 'REACTION',
  'Patterns': 'PATTERNS',
  'Decision Making': 'DECISION',
};

const DIFFICULTY_STYLES = {
  EASY:   { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0', label: 'Easy' },
  MEDIUM: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: 'Medium' },
  HARD:   { bg: '#FFF1F2', color: '#E11D48', border: '#FECDD3', label: 'Hard' },
};

const SLUG_ICONS = {
  'number-detective': Hash,
  'memory-challenge': Eye,
  'code-breaker': KeyRound,
  'reaction-rush': Zap,
  'grid-puzzle': Grid3x3,
  'speed-match': Target,
};

export default function GameCard({ game, index = 0, isDashboardFeatured = false }) {
  const diff = DIFFICULTY_STYLES[game.difficulty] || DIFFICULTY_STYLES.MEDIUM;
  const IconComponent = SLUG_ICONS[game.slug] || HelpCircle;
  const categoryLabel = CATEGORY_TAGS[game.category] || game.category?.toUpperCase() || 'GAME';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={game.isUnlocked ? { y: -2, transition: { duration: 0.15 } } : {}}
      style={{ position: 'relative' }}
    >
      <Link
        to={game.isUnlocked ? `/games/${game.slug}` : '#'}
        style={{
          display: 'block',
          textDecoration: 'none',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '1rem',
          padding: '1.25rem 1.35rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          transition: 'all 0.2s ease',
          cursor: game.isUnlocked ? 'pointer' : 'default',
          opacity: game.isUnlocked ? 1 : 0.65,
        }}
        onMouseEnter={e => {
          if (game.isUnlocked) {
            e.currentTarget.style.borderColor = '#C7D2FE';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.08)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.02)';
        }}
      >
        {/* Top Header: Category Tag & Optional NEW Pill */}
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
              background: '#FFF1F2',
              color: '#E11D48',
              border: '1px solid #FECDD3',
              letterSpacing: '0.04em'
            }}>
              NEW
            </span>
          )}
        </div>

        {/* Content Row: Icon Box, Title & Difficulty Pill, Chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Icon Box */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {game.isUnlocked ? (
              <IconComponent size={22} color="#4F46E5" />
            ) : (
              <Lock size={18} color="#94A3B8" />
            )}
          </div>

          {/* Title & Difficulty Badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="font-display" style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '0.35rem',
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
              padding: '0.15rem 0.55rem',
              borderRadius: '4px',
              background: diff.bg,
              color: diff.color,
              border: `1px solid ${diff.border}`
            }}>
              {diff.label}
            </span>
          </div>

          {/* Navigation Chevron Indicator */}
          <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <ChevronRight size={18} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
