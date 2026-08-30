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
      badgeColor: '#4ADE80',
      badgeBg: 'rgba(34, 197, 94, 0.12)',
      badgeBorder: 'rgba(34, 197, 94, 0.25)',
      icon: Bot,
      color: '#4ADE80',
      bg: 'rgba(34, 197, 94, 0.12)',
      border: 'rgba(34, 197, 94, 0.25)',
      description: 'Standard single player mode. Solve challenges, earn XP for account level and unlock achievements. Rating is not affected.',
      benefits: ['Earn Account XP & Level Up', 'No Rating Risk', 'Casual Pace']
    },
    {
      id: 'RANKED',
      title: 'Ranked Matchmaking',
      badge: 'Competitive Elo',
      badgeColor: '#38BDF8',
      badgeBg: 'rgba(56, 189, 248, 0.12)',
      badgeBorder: 'rgba(56, 189, 248, 0.25)',
      icon: Swords,
      color: '#38BDF8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.25)',
      description: 'Match with a player of similar rating. Both receive the identical challenge. The fastest and most accurate wins rating points.',
      benefits: ['Fair Skill Matchmaking', 'Climb Competitive Tiers', 'Elo Rating at Stake']
    },
    {
      id: 'FRIEND',
      title: 'Play with a Friend',
      badge: 'Custom Lobby',
      badgeColor: '#C084FC',
      badgeBg: 'rgba(192, 132, 252, 0.12)',
      badgeBorder: 'rgba(192, 132, 252, 0.25)',
      icon: Users,
      color: '#C084FC',
      bg: 'rgba(192, 132, 252, 0.12)',
      border: 'rgba(192, 132, 252, 0.25)',
      description: 'Create a private match or invite a friend directly. Compete head-to-head on the same synchronized challenge.',
      benefits: ['Direct Head-to-Head', 'Live Synchronized Results', 'Friendly Rivalry']
    }
  ];

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 10, 10, 0.75)',
        backdropFilter: 'blur(8px)',
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
            background: '#242424',
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '640px',
            border: '1px solid #2E2E2E',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            color: '#F8FAFC'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.25rem 1.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #2E2E2E'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{gameIcon}</span>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-display)', margin: 0 }}>
                  Select Mode — {gameTitle}
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
                  Choose how you want to challenge yourself
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#1C1C1C',
                border: '1px solid #2E2E2E',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94A3B8'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Mode Cards */}
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMode(m.id)}
                  style={{
                    border: '1px solid #2E2E2E',
                    borderRadius: '1rem',
                    padding: '1.15rem 1.25rem',
                    cursor: 'pointer',
                    background: '#1C1C1C',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#22C55E';
                    e.currentTarget.style.background = '#282828';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#2E2E2E';
                    e.currentTarget.style.background = '#1C1C1C';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: m.bg,
                    border: `1px solid ${m.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={20} color={m.color} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>
                        {m.title}
                      </span>
                      <span style={{
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.45rem',
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

                    <p style={{ fontSize: '0.775rem', color: '#94A3B8', lineHeight: 1.45, margin: '0 0 0.5rem 0' }}>
                      {m.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {m.benefits.map((b, i) => (
                        <span key={i} style={{
                          fontSize: '0.675rem',
                          fontWeight: 600,
                          color: '#CBD5E1',
                          background: '#242424',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px',
                          border: '1px solid #2E2E2E'
                        }}>
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
