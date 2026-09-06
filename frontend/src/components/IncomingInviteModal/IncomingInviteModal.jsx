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
            background: 'rgba(8, 14, 33, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.2)',
            padding: '1.35rem 1.5rem',
            position: 'relative',
            overflow: 'hidden',
            color: '#FFFFFF'
          }}
        >
          {/* Top accent stream */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #3b82f6, #38bdf8)'
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
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
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  INCOMING 1V1 CHALLENGE
                </span>
              </div>

              <h4 style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                marginBottom: '0.25rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                @{invite.player1Username}
              </h4>

              <p style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1.4,
                marginBottom: '1rem'
              }}>
                Dispatched challenge for <strong style={{ color: '#ffffff' }}>{gameInfo.title}</strong>
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onAccept(invite)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    borderRadius: '999px',
                    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Check size={13} /> ACCEPT
                </button>

                <button
                  onClick={() => onDecline(invite)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <X size={13} /> DECLINE
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
