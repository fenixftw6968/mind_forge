import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogOut } from 'lucide-react';

export default function ExitModal({
  isOpen,
  onCancel,
  onConfirm,
  title = "Exit Game?",
  message = "Are you sure you want to exit this game? Your active match progress will be lost."
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{
            background: '#242424',
            borderRadius: '1.5rem',
            width: '100%',
            maxWidth: '440px',
            border: '1px solid #2E2E2E',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            padding: '2rem',
            textAlign: 'center',
            position: 'relative',
            color: '#F8FAFC'
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '2px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: '#FB7185',
          }}>
            <AlertTriangle size={30} />
          </div>

          <h2 style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#F8FAFC',
            fontFamily: 'var(--font-display)',
            marginBottom: '0.5rem',
          }}>
            {title}
          </h2>

          <p style={{
            color: '#94A3B8',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            marginBottom: '1.75rem',
          }}>
            {message}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onCancel}
              className="btn-secondary"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontSize: '0.875rem'
              }}
            >
              Continue Playing
            </button>

            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                background: '#E11D48',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#BE123C'}
              onMouseLeave={e => e.currentTarget.style.background = '#E11D48'}
            >
              <LogOut size={16} /> Exit Game
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
