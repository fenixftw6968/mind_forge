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
              background: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(6,182,212,0.9))',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.6rem 1.1rem',
              borderRadius: '999px',
              boxShadow: '0 8px 25px rgba(139,92,246,0.4)',
              fontFamily: 'var(--font-accent)',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            +{p.amount} XP ✨
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
