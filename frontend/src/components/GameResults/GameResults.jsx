import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Zap, Coins, Target, RefreshCw, LayoutGrid } from 'lucide-react';

export default function GameResults({
  score = 0,
  total = 10,
  xpEarned = 0,
  coinsEarned = null,
  onPlayAgain,
  gameTitle = "Game Session Complete",
  customMessage = null
}) {
  const navigate = useNavigate();

  const correctCount = score;
  const incorrectCount = Math.max(0, total - score);
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const calculatedCoins = coinsEarned !== null ? coinsEarned : Math.floor(xpEarned / 2.5);

  let emoji = '💪';
  let heading = 'Keep Practicing!';
  let color = '#6366F1';

  if (accuracy >= 80) {
    emoji = '🏆';
    heading = 'Mastermind Performance!';
    color = '#059669';
  } else if (accuracy >= 50) {
    emoji = '⭐';
    heading = 'Well Done!';
    color = '#D97706';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{
          textAlign: 'center',
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem 2rem',
          margin: '1.5rem',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '1.25rem',
          boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Animated Badge Icon */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1 }}
        >
          {emoji}
        </motion.div>

        <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          {heading}
        </h1>

        <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
          {customMessage || `You finished the ${gameTitle} session with `}
          <strong style={{ color: color, fontWeight: 700 }}>{score}/{total} correct</strong>.
        </p>

        {/* 4-Metric Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          {/* Correct */}
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '0.75rem', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#059669', marginBottom: '0.25rem' }}>
              <CheckCircle size={15} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Correct</span>
            </div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857' }}>
              {correctCount}
            </div>
          </div>

          {/* Incorrect */}
          <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '0.75rem', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#E11D48', marginBottom: '0.25rem' }}>
              <XCircle size={15} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Incorrect</span>
            </div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#BE123C' }}>
              {incorrectCount}
            </div>
          </div>

          {/* Accuracy */}
          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#0284C7', marginBottom: '0.25rem' }}>
              <Target size={15} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Accuracy</span>
            </div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369A1' }}>
              {accuracy}%
            </div>
          </div>

          {/* Final Score */}
          <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '0.75rem', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#4F46E5', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Final Score</span>
            </div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4338CA' }}>
              {score * 10} pts
            </div>
          </div>
        </div>

        {/* Rewards earned */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '1.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Zap size={22} color="#D97706" fill="#D97706" />
            <div style={{ textAlign: 'left' }}>
              <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309' }}>
                +{xpEarned} XP
              </div>
              <div style={{ fontSize: '0.725rem', color: '#78350F', fontWeight: 500 }}>Experience Gained</div>
            </div>
          </div>

          <div style={{ width: '1px', background: '#FCD34D' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Coins size={22} color="#D97706" />
            <div style={{ textAlign: 'left' }}>
              <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309' }}>
                +{calculatedCoins} Coins
              </div>
              <div style={{ fontSize: '0.725rem', color: '#78350F', fontWeight: 500 }}>Rewards Added</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '0.8rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.925rem'
              }}
            >
              <RefreshCw size={16} /> Play Again
            </button>
          )}

          <button
            onClick={() => navigate('/games')}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '0.8rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.925rem'
            }}
          >
            <LayoutGrid size={16} /> All Games
          </button>
        </div>
      </motion.div>
    </div>
  );
}
