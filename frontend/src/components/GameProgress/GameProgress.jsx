import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Flame } from 'lucide-react';
import { getDailyCountdown, subscribeToMidnightIST } from '../../services/dailyQuestionService';

const DIFF_STYLES = {
  EASY:   { color: '#4ADE80', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.25)' },
  MEDIUM: { color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
  HARD:   { color: '#FB7185', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.25)' }
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
              background: '#242424',
              border: '1px solid #2E2E2E',
              borderRadius: '0.5rem',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.4rem 0.75rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F8FAFC'; e.currentTarget.style.borderColor = '#3D3D3D'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = '#2E2E2E'; }}
          >
            <ArrowLeft size={15} /> Exit
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
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px'
              }}
              title="Questions refresh every night at 12:00 AM Indian Standard Time (Asia/Kolkata)"
            >
              <Flame size={13} color="#FB7185" fill="#FB7185" />
              <span style={{ fontSize: '0.75rem', color: '#FB7185', fontWeight: 700 }}>
                Reset in {dailyCountdown}
              </span>
            </div>
          )}

          {/* Question index counter */}
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>
            Question <span style={{ color: '#F8FAFC', fontWeight: 800 }}>{current}</span> / {total}
          </div>

          {/* Difficulty pill */}
          <span
            style={{
              padding: '0.2rem 0.65rem',
              borderRadius: '999px',
              background: ds.bg,
              color: ds.color,
              border: `1px solid ${ds.border}`,
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em'
            }}
          >
            {normDiff}
          </span>

          {/* Live Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
            <Star size={13} color="#FBBF24" fill="#FBBF24" />
            <span style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 700 }}>
              {scoreLabel}: {score}
            </span>
          </div>

          {/* Optional Timer */}
          {formattedTime && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                background: urgency === 'critical' ? 'rgba(244, 63, 94, 0.15)' : urgency === 'warning' ? 'rgba(245, 158, 11, 0.15)' : '#242424',
                border: `1px solid ${urgency === 'critical' ? 'rgba(244, 63, 94, 0.35)' : urgency === 'warning' ? 'rgba(245, 158, 11, 0.35)' : '#2E2E2E'}`,
                transition: 'all 0.3s'
              }}
            >
              <Clock size={13} color={urgency === 'critical' ? '#FB7185' : urgency === 'warning' ? '#FBBF24' : '#94A3B8'} />
              <span className="font-display" style={{ fontSize: '0.825rem', fontWeight: 800, color: urgency === 'critical' ? '#FB7185' : urgency === 'warning' ? '#FBBF24' : '#F8FAFC' }}>
                {formattedTime}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Smooth animated progress line */}
      <div style={{ height: '5px', background: '#1C1C1C', borderRadius: '999px', overflow: 'hidden', border: '1px solid #2E2E2E' }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #22C55E)', borderRadius: '999px', boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
