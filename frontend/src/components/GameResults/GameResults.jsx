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
  let color = '#22C55E';

  if (accuracy >= 80) {
    emoji = '🏆';
    heading = 'Mastermind Performance!';
    color = '#4ADE80';
  } else if (accuracy >= 50) {
    emoji = '⭐';
    heading = 'Well Done!';
    color = '#FBBF24';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F8FAFC' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%',
          padding: '2.25rem 2rem',
          margin: '1.5rem',
          background: '#242424',
          border: '1px solid #2E2E2E',
          borderRadius: '1.25rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Animated Badge Icon */}
        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem', lineHeight: 1 }}>
          {emoji}
        </div>

        <h1 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
          {heading}
        </h1>

        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {customMessage || `You finished the ${gameTitle} session with `}
          <strong style={{ color: color, fontWeight: 700 }}>{score}/{total} correct</strong>.
        </p>

        {/* 4-Metric Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.65rem',
            background: '#1C1C1C',
            border: '1px solid #2E2E2E',
            borderRadius: '0.875rem',
            padding: '0.85rem',
            marginBottom: '1.25rem'
          }}
        >
          {/* Correct */}
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '0.625rem', padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#4ADE80', marginBottom: '0.2rem' }}>
              <CheckCircle size={14} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Correct</span>
            </div>
            <div className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ADE80' }}>
              {correctCount}
            </div>
          </div>

          {/* Incorrect */}
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '0.625rem', padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#FB7185', marginBottom: '0.2rem' }}>
              <XCircle size={14} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Incorrect</span>
            </div>
            <div className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FB7185' }}>
              {incorrectCount}
            </div>
          </div>

          {/* Accuracy */}
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '0.625rem', padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#38BDF8', marginBottom: '0.2rem' }}>
              <Target size={14} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Accuracy</span>
            </div>
            <div className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38BDF8' }}>
              {accuracy}%
            </div>
          </div>

          {/* Final Score */}
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '0.625rem', padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#22C55E', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Final Score</span>
            </div>
            <div className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ADE80' }}>
              {score * 10} pts
            </div>
          </div>
        </div>

        {/* Rewards earned */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '0.875rem',
            padding: '0.85rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="#FBBF24" fill="#FBBF24" />
            <div style={{ textAlign: 'left' }}>
              <div className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FBBF24' }}>
                +{xpEarned} XP
              </div>
              <div style={{ fontSize: '0.675rem', color: '#94A3B8', fontWeight: 500 }}>Experience Gained</div>
            </div>
          </div>

          <div style={{ width: '1px', background: '#3D3D3D' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coins size={20} color="#FBBF24" />
            <div style={{ textAlign: 'left' }}>
              <div className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FBBF24' }}>
                +{calculatedCoins} Coins
              </div>
              <div style={{ fontSize: '0.675rem', color: '#94A3B8', fontWeight: 500 }}>Rewards Added</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '0.75rem 1.25rem',
                fontSize: '0.875rem'
              }}
            >
              <RefreshCw size={15} /> Play Again
            </button>
          )}

          <button
            onClick={() => navigate('/games')}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '0.75rem 1.25rem',
              fontSize: '0.875rem'
            }}
          >
            <LayoutGrid size={15} /> All Games
          </button>
        </div>
      </motion.div>
    </div>
  );
}
