import { motion } from 'framer-motion';
import { getRankFromRating, getNextRank, getRankProgress } from '../../utils/rankUtils';
import { Shield, Sparkles, TrendingUp, Trophy } from 'lucide-react';

export default function RankCard({ rating = 500, matchesPlayed = 0, matchesWon = 0, compact = false }) {
  const currentRank = getRankFromRating(rating);
  const nextRank = getNextRank(rating);
  const progress = getRankProgress(rating);
  const winRate = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;

  if (compact) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.75rem',
        borderRadius: '999px',
        background: currentRank.bg,
        border: `1px solid ${currentRank.border}`,
      }}>
        <span style={{ fontSize: '1rem' }}>{currentRank.badge}</span>
        <span style={{ fontSize: '0.825rem', fontWeight: 800, color: currentRank.color }}>{currentRank.name}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>• {rating} pts</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner accent */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: currentRank.bg,
            border: `1px solid ${currentRank.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            {currentRank.badge}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-display)' }}>
                {currentRank.name}
              </span>
              <span style={{
                fontSize: '0.675rem',
                fontWeight: 800,
                color: currentRank.color,
                background: currentRank.bg,
                border: `1px solid ${currentRank.border}`,
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Competitive
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
              {currentRank.desc}
            </p>
          </div>
        </div>

        {/* Rating display */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            {rating}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Rating Elo
          </div>
        </div>
      </div>

      {/* Progress to next tier */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>
          <span>Tier Progress</span>
          {nextRank ? (
            <span>Next: <strong style={{ color: nextRank.color }}>{nextRank.name} ({nextRank.minRating} pts)</strong></span>
          ) : (
            <span style={{ color: currentRank.color, fontWeight: 700 }}>Max Tier Reached 👑</span>
          )}
        </div>
        <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${currentRank.color}, #4F46E5)`, borderRadius: '999px' }}
          />
        </div>
      </div>

      {/* Record statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid #F1F5F9',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{matchesPlayed}</div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Matches</div>
        </div>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>{matchesWon}</div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Victories</div>
        </div>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563EB' }}>{winRate}%</div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Win Rate</div>
        </div>
      </div>
    </motion.div>
  );
}
