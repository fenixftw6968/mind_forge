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
            background: '#242424',
            borderRadius: '1.25rem',
            border: '1px solid #2E2E2E',
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
            padding: '1.25rem 1.5rem',
            position: 'relative',
            overflow: 'hidden',
            color: '#F8FAFC'
          }}
        >
          {/* Top lime accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #10B981, #22C55E)'
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#1C1C1C',
              border: '1px solid #333333',
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
                  color: '#4ADE80',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Friend Match Request
                </span>
              </div>

              <h4 style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#F8FAFC',
                marginBottom: '0.25rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {invite.player1Username} invited you!
              </h4>

              <p style={{
                fontSize: '0.825rem',
                color: '#94A3B8',
                lineHeight: 1.4,
                marginBottom: '1rem'
              }}>
                To a live 1v1 match in <strong style={{ color: '#F8FAFC' }}>{gameInfo.title}</strong>
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={() => onAccept(invite)}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem'
                  }}
                >
                  <Check size={15} /> Accept
                </button>

                <button
                  onClick={() => onDecline(invite)}
                  className="btn-secondary"
                  style={{
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem'
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
