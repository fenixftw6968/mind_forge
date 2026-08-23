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
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%', maxWidth: widths[size],
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1.25rem',
              zIndex: 201,
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            {title && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                <h2 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{title}</h2>
                {onClose && (
                  <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0.35rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.background = '#E2E8F0'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = '#F1F5F9'; }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            <div style={{ padding: '1.5rem' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
