import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';
import { getDailyCountdown, subscribeToMidnightIST } from '../../services/dailyQuestionService';

export default function DailyCountdown({
  onMidnight,
  compact = false,
  showLabel = true
}) {
  const [countdown, setCountdown] = useState(() => getDailyCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getDailyCountdown());
    }, 1000);

    const unsubscribe = subscribeToMidnightIST((newDate, oldDate) => {
      if (typeof onMidnight === 'function') {
        onMidnight(newDate, oldDate);
      }
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, [onMidnight]);

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: '#60a5fa'
        }}
      >
        <Flame size={13} color="#38bdf8" fill="#38bdf8" />
        <span>RESET {countdown.formatted}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        background: 'rgba(8, 14, 33, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.25rem',
        padding: '1rem 1.35rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Clock size={18} color="#60a5fa" />
      </div>

      <div>
        {showLabel && (
          <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DAILY ARENA REFRESH (12:00 AM IST)
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>
          ⏳ {countdown.formatted}
        </div>
      </div>
    </div>
  );
}
