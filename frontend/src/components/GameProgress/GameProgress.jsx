import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Flame } from 'lucide-react';
import { getDailyCountdown, subscribeToMidnightIST } from '../../services/dailyQuestionService';

const DIFF_STYLES = {
  EASY:   { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  MEDIUM: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  HARD:   { color: '#E11D48', bg: '#FFF1F2',  border: '#FECDD3' }
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
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '0.5rem',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.4rem 0.75rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
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
                background: '#FFF1F2',
                border: '1px solid #FECDD3',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px'
              }}
              title="Questions refresh every night at 12:00 AM Indian Standard Time (Asia/Kolkata)"
            >
              <Flame size={13} color="#E11D48" fill="#E11D48" />
              <span style={{ fontSize: '0.75rem', color: '#BE123C', fontWeight: 700 }}>
                Reset in {dailyCountdown}
              </span>
            </div>
          )}

          {/* Question index counter */}
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
            Question <span style={{ color: '#0F172A', fontWeight: 800 }}>{current}</span> / {total}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
            <Star size={13} color="#D97706" fill="#D97706" />
            <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700 }}>
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
                background: urgency === 'critical' ? '#FFF1F2' : urgency === 'warning' ? '#FFFBEB' : '#F1F5F9',
                border: `1px solid ${urgency === 'critical' ? '#FECDD3' : urgency === 'warning' ? '#FDE68A' : '#E2E8F0'}`,
                transition: 'all 0.3s'
              }}
            >
              <Clock size={13} color={urgency === 'critical' ? '#E11D48' : urgency === 'warning' ? '#D97706' : '#64748B'} />
              <span className="font-display" style={{ fontSize: '0.825rem', fontWeight: 800, color: urgency === 'critical' ? '#BE123C' : urgency === 'warning' ? '#B45309' : '#0F172A' }}>
                {formattedTime}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Smooth animated progress line */}
      <div style={{ height: '5px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #6366F1, #4F46E5)', borderRadius: '999px' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
