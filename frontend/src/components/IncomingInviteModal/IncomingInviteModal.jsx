import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Check, X, Bell } from 'lucide-react';
import { GAME_REGISTRY } from '../../data/gameRegistry';

export default function IncomingInviteModal({
  invite,
  onAccept,
  onDecline
}) {
  if (!invite) return null;

  const gameInfo = GAME_REGISTRY[invite.gameSlug] || {
    title: invite.gameSlug ? invite.gameSlug.replace(/-/g, ' ').toUpperCase() : 'Game',
    icon: '🎮'
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 99999,
        maxWidth: '400px',
        width: 'calc(100vw - 48px)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '1.25rem 1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top pulse accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6366F1, #EC4899)'
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              flexShrink: 0
            }}>
              {gameInfo.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#6366F1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Friend Match Request
                </span>
              </div>

              <h4 style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '0.25rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {invite.player1Username} invited you!
              </h4>

              <p style={{
                fontSize: '0.825rem',
                color: '#64748B',
                lineHeight: 1.4,
                marginBottom: '1rem'
              }}>
                To a live 1v1 match in <strong style={{ color: '#0F172A' }}>{gameInfo.title}</strong>
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={() => onAccept(invite)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '0.65rem',
                    background: '#4F46E5',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#4338CA'}
                  onMouseLeave={e => e.currentTarget.style.background = '#4F46E5'}
                >
                  <Check size={15} /> Accept
                </button>

                <button
                  onClick={() => onDecline(invite)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '0.65rem',
                    background: '#F1F5F9',
                    color: '#64748B',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#FFF1F2';
                    e.currentTarget.style.color = '#E11D48';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#F1F5F9';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  <X size={15} /> Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
