import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Loader2 } from 'lucide-react';

const DEFAULT_DIFFICULTIES = [
  {
    id: 'EASY',
    label: 'NOVICE',
    icon: '🌱',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.2)',
    xp: '+10 XP',
    time: 'Standard',
    desc: 'Foundational drills for conditioning reflexes and core memory recall.'
  },
  {
    id: 'MEDIUM',
    label: 'INTERMEDIATE',
    icon: '⚡',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.08)',
    border: 'rgba(56, 189, 248, 0.2)',
    xp: '+25 XP',
    time: 'Moderate',
    desc: 'Multi-layer analytical scenarios demanding quick pattern identification.'
  },
  {
    id: 'HARD',
    label: 'EXPERT',
    icon: '🔥',
    color: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.08)',
    border: 'rgba(244, 63, 94, 0.25)',
    xp: '+50 XP',
    time: 'Fast Pace',
    desc: 'Ultra high-pressure combinatorial complexity under strict time decay.'
  }
];

export default function DifficultySelector({
  title = "Select Protocol Tier",
  subtitle = "Choose your operational complexity to initialize the neural challenge.",
  icon = "🎮",
  onSelectDifficulty,
  onBack,
  customTiers = null,
  loadingTier = null
}) {
  const tiers = customTiers || DEFAULT_DIFFICULTIES;

  return (
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="star-field" />
      <div className="binary-texture" />
      <div className="mesh-glow" style={{ top: '35%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />

      <div style={{ maxWidth: '560px', width: '100%', padding: '2rem 1.5rem 4rem', position: 'relative', zIndex: 10 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '2rem',
              padding: '0.45rem 1rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            <ArrowLeft size={14} /> BACK TO ARENA
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.875rem', lineHeight: 1.5, maxWidth: '420px', margin: '0 auto' }}>
              {subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {tiers.map((tier) => {
              const color = tier.color || '#22c55e';
              const bg = tier.bg || 'rgba(34, 197, 94, 0.08)';
              const border = tier.border || 'rgba(34, 197, 94, 0.2)';

              const isCurrentLoading = loadingTier && String(loadingTier).toUpperCase() === String(tier.id).toUpperCase();
              const isAnyLoading = !!loadingTier;

              return (
                <motion.button
                  key={tier.id}
                  whileHover={!isAnyLoading ? { y: -2 } : {}}
                  whileTap={!isAnyLoading ? { scale: 0.99 } : {}}
                  disabled={isAnyLoading}
                  onClick={() => !isAnyLoading && onSelectDifficulty(tier.id)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.4rem',
                    borderRadius: '1.25rem',
                    background: isCurrentLoading ? 'rgba(59, 130, 246, 0.12)' : 'rgba(8, 14, 33, 0.75)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isCurrentLoading ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)'}`,
                    cursor: isAnyLoading ? (isCurrentLoading ? 'wait' : 'not-allowed') : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: isCurrentLoading ? '0 0 25px rgba(59, 130, 246, 0.35)' : '0 10px 30px rgba(0, 0, 0, 0.4)',
                    opacity: isAnyLoading && !isCurrentLoading ? 0.45 : 1
                  }}
                  onMouseEnter={e => {
                    if (!isAnyLoading) {
                      e.currentTarget.style.background = 'rgba(13, 23, 56, 0.88)';
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.boxShadow = `0 0 20px ${color}22`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isAnyLoading) {
                      e.currentTarget.style.background = 'rgba(8, 14, 33, 0.75)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
                    }
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: bg,
                      border: `1px solid ${border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '1.35rem'
                    }}
                  >
                    {isCurrentLoading ? (
                      <Loader2 size={20} color={color} className="animate-spin" />
                    ) : (
                      tier.icon
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: color, fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                        {tier.label || tier.id}
                      </span>
                      {isCurrentLoading && (
                        <span style={{ fontSize: '0.75rem', color: color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          • INITIALIZING...
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                      {isCurrentLoading ? 'Synthesizing verified non-repeating problem stream...' : tier.desc}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FBBF24', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      <Zap size={13} fill="#FBBF24" />
                      {tier.xp}
                    </div>
                    {tier.time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
                        <Clock size={11} /> {tier.time}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
