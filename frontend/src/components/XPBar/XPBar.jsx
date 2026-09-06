import { motion } from 'framer-motion';

export default function XPBar({ current, total, level, animated = true }) {
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          TIER {level}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: '#ffffff', fontWeight: 800 }}>{current.toLocaleString()}</span>
          {' / '}{total.toLocaleString()} XP
        </span>
      </div>

      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #2563eb, #3b82f6, #38bdf8)', borderRadius: '999px', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{pct}% PROGRESSED</span>
      </div>
    </div>
  );
}
