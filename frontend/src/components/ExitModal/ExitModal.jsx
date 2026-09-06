import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogOut } from 'lucide-react';

export default function ExitModal({
  isOpen,
  onCancel,
  onConfirm,
  title = "ABORT ARENA SESSION?",
  message = "Are you sure you wish to disconnect? Active match rating deltas and progression data for this round will be forfeited."
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'rgba(8, 14, 33, 0.95)',
            borderRadius: '1.75rem',
            width: '100%',
            maxWidth: '440px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.15)',
            padding: '2.25rem 2rem',
            textAlign: 'center',
            position: 'relative',
            color: '#FFFFFF'
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: '#f43f5e',
          }}>
            <AlertTriangle size={28} />
          </div>

          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}>
            {title}
          </h2>

          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            marginBottom: '1.75rem',
          }}>
            {message}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '999px',
                background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
              }}
            >
              RESUME MATCH
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
                borderRadius: '999px',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f43f5e',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} /> FORFEIT
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
