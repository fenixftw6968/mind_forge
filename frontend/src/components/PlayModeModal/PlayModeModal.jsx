import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Swords, Users, X, Sparkles, Shield, Clock } from 'lucide-react';

export default function PlayModeModal({
  isOpen,
  onClose,
  gameTitle = 'Game',
  onSelectMode,
  gameIcon = '🎮'
}) {
  if (!isOpen) return null;

  const modes = [
    {
      id: 'PRACTICE',
      title: 'Practice vs Computer',
      badge: 'Single Player',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      badgeBorder: '#A7F3D0',
      icon: Bot,
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      description: 'Standard single player mode. Solve challenges, earn XP for account level and unlock achievements. Rating is not affected.',
      benefits: ['Earn Account XP & Level Up', 'No Rating Risk', 'Casual Pace']
    },
    {
      id: 'RANKED',
      title: 'Ranked Matchmaking',
      badge: 'Competitive Elo',
      badgeColor: '#2563EB',
      badgeBg: '#EFF6FF',
      badgeBorder: '#BFDBFE',
      icon: Swords,
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      description: 'Match with a player of similar rating. Both receive the identical challenge. The fastest and most accurate wins rating points.',
      benefits: ['Fair Skill Matchmaking', 'Climb Competitive Tiers', 'Elo Rating at Stake']
    },
    {
      id: 'FRIEND',
      title: 'Play with a Friend',
      badge: 'Custom Lobby',
      badgeColor: '#7C3AED',
      badgeBg: '#F5F3FF',
      badgeBorder: '#DDD6FE',
      icon: Users,
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      description: 'Create a private match or invite a friend directly. Compete head-to-head on the same synchronized challenge.',
      benefits: ['Private Game Code/Invite', 'Direct Head-to-Head', 'Live Synchronized Results']
    }
  ];

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '1.5rem',
            width: '100%',
            maxWidth: '680px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem 1.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{gameIcon}</span>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-display)', margin: 0 }}>
                  Select Mode — {gameTitle}
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                  Choose how you want to challenge yourself today
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Cards */}
          <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.id}
                  whileHover={{ scale: 1.01, borderColor: m.color }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectMode(m.id)}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '1.15rem',
                    padding: '1.25rem 1.35rem',
                    cursor: 'pointer',
                    background: '#FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.15rem'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: m.bg,
                    border: `1px solid ${m.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={24} color={m.color} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                        {m.title}
                      </span>
                      <span style={{
                        fontSize: '0.675rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        background: m.badgeBg,
                        color: m.badgeColor,
                        border: `1px solid ${m.badgeBorder}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}>
                        {m.badge}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.825rem', color: '#64748B', lineHeight: 1.45, margin: '0 0 0.65rem 0' }}>
                      {m.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {m.benefits.map((b, i) => (
                        <span key={i} style={{
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          color: '#475569',
                          background: '#F8FAFC',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0'
                        }}>
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
