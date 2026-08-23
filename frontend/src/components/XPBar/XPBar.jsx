import { motion } from 'framer-motion';

export default function XPBar({ current, total, level, animated = true }) {
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
          Level {level}
        </span>
        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
          <span style={{ color: '#4F46E5', fontWeight: 700 }}>{current.toLocaleString()}</span>
          {' / '}{total.toLocaleString()} XP
        </span>
      </div>

      <div className="xp-bar-track">
        <motion.div
          className="xp-bar-fill"
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem' }}>
        <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{pct}%</span>
      </div>
    </div>
  );
}
