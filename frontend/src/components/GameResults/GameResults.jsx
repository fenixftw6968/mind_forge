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
  gameTitle = "Challenge Complete",
  customMessage = null
}) {
  const navigate = useNavigate();

  const correctCount = score;
  const incorrectCount = Math.max(0, total - score);
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const calculatedCoins = coinsEarned !== null ? coinsEarned : Math.floor(xpEarned / 2.5);

  let emoji = '⚡';
  let heading = 'SESSION CONCLUDED';
  let color = '#22c55e';

  if (accuracy >= 80) {
    emoji = '🏆';
    heading = 'SUPERIOR PERFORMANCE';
    color = '#60a5fa';
  } else if (accuracy >= 50) {
    emoji = '⭐';
    heading = 'EVALUATION COMPLETE';
    color = '#38bdf8';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="star-field" />
      <div className="binary-texture" />
      <div className="mesh-glow" style={{ top: '35%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          padding: '2.5rem 2.25rem',
          margin: '1.5rem',
          background: 'rgba(8, 14, 33, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.75rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.1)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Animated Badge Icon */}
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1 }}>
          {emoji}
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          {heading}
        </h1>

        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {customMessage || `Successfully executed ${gameTitle} with `}
          <strong style={{ color: color, fontFamily: 'var(--font-mono)' }}>{score}/{total} correct answers</strong>.
        </p>

        {/* 4-Metric Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            background: 'rgba(10, 18, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '1.25rem',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          {/* Correct */}
          <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '0.85rem', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#22c55e', marginBottom: '0.25rem' }}>
              <CheckCircle size={14} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CORRECT</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#22c55e' }}>
              {correctCount}
            </div>
          </div>

          {/* Incorrect */}
          <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '0.85rem', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#f43f5e', marginBottom: '0.25rem' }}>
              <XCircle size={14} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>INCORRECT</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e' }}>
              {incorrectCount}
            </div>
          </div>

          {/* Accuracy */}
          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0.85rem', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#38bdf8', marginBottom: '0.25rem' }}>
              <Target size={14} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACCURACY</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
              {accuracy}%
            </div>
          </div>

          {/* Final Score */}
          <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '0.85rem', padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#FBBF24', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SCORE</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#FBBF24' }}>
              {score * 10} pts
            </div>
          </div>
        </div>

        {/* Rewards earned */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '1.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Zap size={22} color="#3b82f6" fill="#3b82f6" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                +{xpEarned} XP
              </div>
              <div style={{ fontSize: '0.675rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>EXPERIENCE</div>
            </div>
          </div>

          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Coins size={22} color="#FBBF24" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: '#FBBF24' }}>
                +{calculatedCoins} COINS
              </div>
              <div style={{ fontSize: '0.675rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>REWARD TOKENS</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              style={{
                flex: 1,
                padding: '0.85rem 1.25rem',
                borderRadius: '999px',
                background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
              }}
            >
              <RefreshCw size={14} /> REPLAY SESSION
            </button>
          )}

          <button
            onClick={() => navigate('/games')}
            style={{
              flex: 1,
              padding: '0.85rem 1.25rem',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <LayoutGrid size={14} /> ARENAS
          </button>
        </div>
      </motion.div>
    </div>
  );
}
