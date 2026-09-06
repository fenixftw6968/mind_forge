import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Flame } from 'lucide-react';
import { getDailyCountdown, subscribeToMidnightIST } from '../../services/dailyQuestionService';

const DIFF_STYLES = {
  EASY:   { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.25)', label: 'NOVICE' },
  MEDIUM: { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.25)', label: 'MID' },
  HARD:   { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.25)', label: 'EXPERT' }
};

export default function GameProgress({
  current = 1,
  total = 10,
  score = 0,
  difficulty = 'MEDIUM',
  onExit,
  formattedTime = null,
  urgency = 'normal',
  scoreLabel = 'Score',
  showDailyCountdown = true,
  onMidnightRollover = null
}) {
  const normDiff = (difficulty || 'MEDIUM').toUpperCase();
  const ds = DIFF_STYLES[normDiff] || DIFF_STYLES.MEDIUM;
  const progressPercent = Math.min(100, Math.max(0, (current / (total || 1)) * 100));

  const [dailyCountdown, setDailyCountdown] = useState(() => getDailyCountdown().formatted);

  useEffect(() => {
    if (!showDailyCountdown) return;

    const timer = setInterval(() => {
      setDailyCountdown(getDailyCountdown().formatted);
    }, 1000);

    const unsubscribe = subscribeToMidnightIST((newDate, oldDate) => {
      if (typeof onMidnightRollover === 'function') {
        onMidnightRollover(newDate, oldDate);
      }
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, [showDailyCountdown, onMidnightRollover]);

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Top action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        {onExit && (
          <button
            onClick={onExit}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '0.45rem 1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            <ArrowLeft size={14} /> EXIT ARENA
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {/* Live IST Daily Countdown Badge */}
          {showDailyCountdown && dailyCountdown && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontFamily: 'var(--font-mono)'
              }}
              title="Questions refresh every night at 12:00 AM Indian Standard Time (Asia/Kolkata)"
            >
              <Flame size={13} color="#38bdf8" fill="#38bdf8" />
              <span style={{ fontSize: '0.725rem', color: '#60a5fa', fontWeight: 700 }}>
                RESET {dailyCountdown}
              </span>
            </div>
          )}

          {/* Question index counter */}
          <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '0.35rem 0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            SEQ <span style={{ color: '#ffffff', fontWeight: 800 }}>{current}</span> / {total}
          </div>

          {/* Difficulty pill */}
          <span
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              background: ds.bg,
              color: ds.color,
              border: `1px solid ${ds.border}`,
              fontSize: '0.725rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}
          >
            {ds.label || normDiff}
          </span>

          {/* Live Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontFamily: 'var(--font-mono)' }}>
            <Star size={13} color="#FBBF24" fill="#FBBF24" />
            <span style={{ fontSize: '0.725rem', color: '#FBBF24', fontWeight: 700 }}>
              {scoreLabel.toUpperCase()}: {score}
            </span>
          </div>

          {/* Optional Timer */}
          {formattedTime && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                background: urgency === 'critical' ? 'rgba(244, 63, 94, 0.15)' : urgency === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${urgency === 'critical' ? 'rgba(244, 63, 94, 0.4)' : urgency === 'warning' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                transition: 'all 0.3s',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <Clock size={13} color={urgency === 'critical' ? '#f43f5e' : urgency === 'warning' ? '#FBBF24' : 'rgba(255, 255, 255, 0.6)'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: urgency === 'critical' ? '#f43f5e' : urgency === 'warning' ? '#FBBF24' : '#ffffff' }}>
                {formattedTime}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #38bdf8)', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)', borderRadius: '999px' }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
