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
    // Tick every second to update countdown display
    const timer = setInterval(() => {
      setCountdown(getDailyCountdown());
    }, 1000);

    // Watch for midnight IST rollover to trigger parent reload
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
          gap: '0.35rem',
          background: 'rgba(244,63,94,0.08)',
          border: '1px solid rgba(244,63,94,0.25)',
          padding: '0.25rem 0.65rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#f43f5e'
        }}
      >
        <Flame size={12} color="#f43f5e" fill="#f43f5e" />
        <span>Daily Reset: {countdown.formatted}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'linear-gradient(135deg, rgba(20,20,35,0.85), rgba(10,10,20,0.95))',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '1rem',
        padding: '0.85rem 1.25rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(244,63,94,0.12)',
          border: '1px solid rgba(244,63,94,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Clock size={18} color="#f43f5e" />
      </div>

      <div>
        {showLabel && (
          <div style={{ fontSize: '0.7rem', color: '#a1a1b5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Next Daily Refresh (12:00 AM IST)
          </div>
        )}
        <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f43f5e', letterSpacing: '0.05em' }}>
          ⏳ {countdown.formatted}
        </div>
      </div>
    </div>
  );
}
