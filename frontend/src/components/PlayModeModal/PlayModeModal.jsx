import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Swords, Users, X } from 'lucide-react';

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
      badgeColor: '#34d399',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeBorder: 'rgba(16, 185, 129, 0.3)',
      icon: Bot,
      color: '#34d399',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.25)',
      description: 'Standard single player mode. Solve challenges, earn XP for account level and unlock achievements. Rating is not affected.',
      benefits: ['Earn Account XP & Level Up', 'No Rating Risk', 'Casual Pace']
    },
    {
      id: 'RANKED',
      title: 'Ranked Matchmaking',
      badge: 'Competitive Elo',
      badgeColor: '#60a5fa',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      badgeBorder: 'rgba(59, 130, 246, 0.35)',
      icon: Swords,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.3)',
      description: 'Match with a player of similar rating. Both receive the identical challenge. The fastest and most accurate wins rating points.',
      benefits: ['Fair Skill Matchmaking', 'Climb Competitive Tiers', 'Elo Rating at Stake']
    },
    {
      id: 'FRIEND',
      title: 'Play with a Friend',
      badge: 'Custom Lobby',
      badgeColor: '#38bdf8',
      badgeBg: 'rgba(56, 189, 248, 0.12)',
      badgeBorder: 'rgba(56, 189, 248, 0.3)',
      icon: Users,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.1)',
      border: 'rgba(56, 189, 248, 0.25)',
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
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
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
            background: 'rgba(8, 14, 33, 0.95)',
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: '620px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.1)',
            overflow: 'hidden',
            color: '#F8FAFC'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem 1.75rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{gameIcon}</span>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                  Select Mode — {gameTitle}
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Choose your competitive environment
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
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
          <div style={{ padding: '1.25rem 1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMode(m.id)}
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1rem',
                    padding: '1.15rem 1.25rem',
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.02)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.45)';
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
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
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }}>
                        {m.title}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        background: m.badgeBg,
                        border: `1px solid ${m.badgeBorder}`,
                        color: m.badgeColor
                      }}>
                        {m.badge}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 0.65rem 0', lineHeight: 1.45 }}>
                      {m.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {m.benefits.map((b, i) => (
                        <span key={i} style={{
                          fontSize: '0.675rem',
                          color: '#CBD5E1',
                          background: 'rgba(255, 255, 255, 0.04)',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}>
                          • {b}
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
