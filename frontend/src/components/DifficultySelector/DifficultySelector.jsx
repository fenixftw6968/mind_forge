import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

const DEFAULT_DIFFICULTIES = [
  {
    id: 'EASY',
    label: 'Easy',
    icon: '🌱',
    color: '#4ADE80',
    bg: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.25)',
    xp: '+10 XP',
    time: 'Standard',
    desc: 'Great for warming up and mastering core fundamentals.'
  },
  {
    id: 'MEDIUM',
    label: 'Medium',
    icon: '⚡',
    color: '#FBBF24',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.25)',
    xp: '+25 XP',
    time: 'Moderate',
    desc: 'Balanced challenge requiring careful analytical thinking.'
  },
  {
    id: 'HARD',
    label: 'Hard',
    icon: '🔥',
    color: '#FB7185',
    bg: 'rgba(244, 63, 94, 0.12)',
    border: 'rgba(244, 63, 94, 0.25)',
    xp: '+50 XP',
    time: 'Fast',
    desc: 'Complex multi-step problems designed for masterminds.'
  }
];

export default function DifficultySelector({
  title = "Select Difficulty",
  subtitle = "Choose your challenge level to start the game session.",
  icon = "🎮",
  onSelectDifficulty,
  onBack,
  customTiers = null
}) {
  const tiers = customTiers || DEFAULT_DIFFICULTIES;

  return (
    <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F8FAFC' }}>
      <div style={{ maxWidth: '540px', width: '100%', padding: '2rem 1.5rem' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '1.75rem',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Games
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tiers.map((tier) => {
              const color = tier.color || '#22C55E';
              const bg = tier.bg || 'rgba(34, 197, 94, 0.12)';
              const border = tier.border || 'rgba(34, 197, 94, 0.25)';

              return (
                <motion.button
                  key={tier.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectDifficulty(tier.id)}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.35rem',
                    borderRadius: '0.875rem',
                    background: '#242424',
                    border: `1px solid ${border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#2A2A2A';
                    e.currentTarget.style.borderColor = color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#242424';
                    e.currentTarget.style.borderColor = border;
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: bg,
                      border: `1px solid ${border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '1.3rem'
                    }}
                  >
                    {tier.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="font-accent" style={{ fontWeight: 800, color: color, fontSize: '1rem' }}>
                        {tier.label || tier.id}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '0.15rem', lineHeight: 1.4, fontWeight: 500 }}>
                      {tier.desc}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
                      <Zap size={13} fill="#FBBF24" />
                      {tier.xp}
                    </div>
                    {tier.time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748B', fontSize: '0.7rem', marginTop: '0.2rem', justifyContent: 'flex-end', fontWeight: 600 }}>
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
