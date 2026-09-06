import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, children, title, size = 'md' }) {
  const widths = { sm: '420px', md: '560px', lg: '720px', xl: '900px' };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(2, 6, 23, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              zIndex: 200,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%', maxWidth: widths[size],
              background: 'rgba(8, 14, 33, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.75rem',
              zIndex: 201,
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.1)',
              color: '#FFFFFF'
            }}
          >
            {title && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
                {onClose && (
                  <button onClick={onClose} style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.6)', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
            <div style={{ padding: '1.75rem' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
