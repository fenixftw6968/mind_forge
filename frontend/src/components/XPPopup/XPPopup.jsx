import { AnimatePresence, motion } from 'framer-motion';

export default function XPPopup({ popups }) {
  return (
    <div style={{ position: 'fixed', bottom: '5rem', right: '2rem', zIndex: 999, pointerEvents: 'none', display: 'flex', flexDirection: 'column-reverse', gap: '0.5rem' }}>
      <AnimatePresence>
        {popups.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -90, scale: 0.8 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{
              background: 'rgba(8, 14, 33, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.45)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              padding: '0.6rem 1.25rem',
              borderRadius: '999px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(59, 130, 246, 0.4)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span style={{ color: '#38bdf8' }}>+{p.amount} XP</span>
            <span style={{ fontSize: '0.9rem' }}>⚡</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
