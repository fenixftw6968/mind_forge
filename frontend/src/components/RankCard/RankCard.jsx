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
        gap: '0.45rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        background: 'rgba(59, 130, 246, 0.12)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
      }}>
        <span style={{ fontSize: '0.85rem' }}>{currentRank.badge}</span>
        <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA' }}>{currentRank.name}</span>
        <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>• {rating} pts</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(8, 14, 33, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.15rem',
        padding: '1.75rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner accent */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.35rem',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.25)'
          }}>
            {currentRank.badge}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC' }}>
                {currentRank.name}
              </span>
              <span style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                color: '#60A5FA',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                1v1 Ranked
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 400 }}>
              {currentRank.desc}
            </p>
          </div>
        </div>

        {/* Rating display */}
        <div style={{ textAlign: 'right' }}>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>
            {rating}
          </div>
          <div className="font-mono" style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Rating Elo
          </div>
        </div>
      </div>

      {/* Progress to next tier */}
      {nextRank && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#94A3B8' }}>
              Next Tier: <span className="font-display" style={{ color: '#FFFFFF', fontWeight: 700 }}>{nextRank.name}</span>
            </span>
            <span className="font-mono" style={{ color: '#60A5FA', fontWeight: 700 }}>
              {rating} / {nextRank.minRating} Elo ({progress}%)
            </span>
          </div>
          <div style={{
            height: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #2563eb, #3b82f6, #38bdf8)',
                borderRadius: '999px',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
              }}
            />
          </div>
        </div>
      )}

      {/* Quick stats footer: Win rate & matches */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.65rem',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        textAlign: 'center'
      }}>
        <div>
          <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC' }}>{matchesPlayed}</div>
          <div className="font-mono" style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Played</div>
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#34D399' }}>{matchesWon}</div>
          <div className="font-mono" style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Victories</div>
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#60A5FA' }}>{winRate}%</div>
          <div className="font-mono" style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Win Rate</div>
        </div>
      </div>
    </motion.div>
  );
}
