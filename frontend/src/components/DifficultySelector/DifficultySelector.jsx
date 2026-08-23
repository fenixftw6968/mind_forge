import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Flame, Sparkles } from 'lucide-react';

const DEFAULT_DIFFICULTIES = [
  {
    id: 'EASY',
    label: 'Easy',
    icon: '🌱',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    xp: '+10 XP',
    time: 'Standard',
    desc: 'Great for warming up and mastering core fundamentals.'
  },
  {
    id: 'MEDIUM',
    label: 'Medium',
    icon: '⚡',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    xp: '+25 XP',
    time: 'Moderate',
    desc: 'Balanced challenge requiring careful analytical thinking.'
  },
  {
    id: 'HARD',
    label: 'Hard',
    icon: '🔥',
    color: '#E11D48',
    bg: '#FFF1F2',
    border: '#FECDD3',
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
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '580px', width: '100%', padding: '2rem 1.5rem' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Games
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{icon}</div>
            <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {tiers.map((tier) => {
              const color = tier.color || '#4F46E5';
              const bg = tier.bg || '#EEF2FF';
              const border = tier.border || '#C7D2FE';

              return (
                <motion.button
                  key={tier.id}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectDifficulty(tier.id)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '1rem',
                    background: '#FFFFFF',
                    border: `1px solid ${border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: bg,
                      border: `1px solid ${border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '1.4rem'
                    }}
                  >
                    {tier.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="font-accent" style={{ fontWeight: 800, color: color, fontSize: '1.1rem' }}>
                        {tier.label || tier.id}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '0.2rem', lineHeight: 1.4, fontWeight: 500 }}>
                      {tier.desc}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      <Zap size={14} fill="#D97706" />
                      {tier.xp}
                    </div>
                    {tier.time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94A3B8', fontSize: '0.75rem', marginTop: '0.25rem', justifyContent: 'flex-end', fontWeight: 600 }}>
                        <Clock size={12} /> {tier.time}
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
