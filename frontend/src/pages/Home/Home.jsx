import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Search, Puzzle, Eye, Zap, ChevronRight, Star, Users, Trophy } from 'lucide-react';

const FEATURES = [
  { icon: '🧠', title: 'Logical Thinking',      desc: 'Train your mind to reason through complex problems systematically.',     difficulty: 4, color: '#6366F1' },
  { icon: '🔍', title: 'Critical Thinking',     desc: 'Question assumptions, identify fallacies, and reach sound conclusions.', difficulty: 3, color: '#0284C7' },
  { icon: '🕵️', title: 'Mystery Solving',       desc: 'Investigate clues, interrogate suspects, and crack unsolvable cases.',   difficulty: 5, color: '#E11D48' },
  { icon: '🧩', title: 'Pattern Recognition',   desc: 'Spot hidden patterns in numbers, shapes, and abstract sequences.',      difficulty: 3, color: '#059669' },
  { icon: '👁️', title: 'Observation',           desc: 'Sharpen your attention to detail with memory and observation tests.',   difficulty: 2, color: '#D97706' },
  { icon: '⚡', title: 'Quick Decision Making', desc: 'Train your brain to make accurate decisions under time pressure.',       difficulty: 4, color: '#8B5CF6' },
];

const STEPS = [
  { step: '01', title: 'Play Games',         desc: 'Choose from 6+ categories of brain games', icon: '🎮' },
  { step: '02', title: 'Earn XP & Coins',    desc: 'Get rewarded for every puzzle you solve',   icon: '⭐' },
  { step: '03', title: 'Level Up',           desc: 'Rise through the ranks from Beginner to Mastermind', icon: '📈' },
  { step: '04', title: 'Unlock Mysteries',   desc: 'Gain access to exclusive mystery cases',    icon: '🔓' },
  { step: '05', title: 'Become a Mastermind', desc: 'Reach the pinnacle of mental mastery',    icon: '👑' },
];

const STATS = [
  { icon: <Users size={20} />, value: '50K+', label: 'Players' },
  { icon: <Puzzle size={20} />, value: '200+', label: 'Puzzles' },
  { icon: <Trophy size={20} />, value: '6',    label: 'Game Types' },
  { icon: <Star size={20} />,  value: '4.9',   label: 'Rating' },
];

function FloatingOrb({ size, x, y, color, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay }}
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20, transparent)`,
        filter: 'blur(30px)', pointerEvents: 'none',
      }}
    />
  );
}

function DifficultyDots({ level, color }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: i <= level ? color : '#E2E8F0',
        }} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7rem 1.5rem 4rem' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <FloatingOrb size="320px" x="10%" y="15%"  color="#6366F1" delay={0} />
        <FloatingOrb size="220px" x="70%" y="55%"  color="#0284C7" delay={1} />
        <FloatingOrb size="180px" x="85%" y="10%"  color="#E11D48" delay={2} />
        <FloatingOrb size="200px" x="5%"  y="60%"  color="#059669" delay={1.5} />

        {/* Floating puzzle emojis */}
        {['🧩','🔍','🧠','🔢','🎭','⚡'].map((e, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            style={{
              position: 'absolute',
              left: `${10 + i * 15}%`,
              top:  `${20 + (i % 3) * 20}%`,
              fontSize: '1.5rem',
              opacity: 0.2,
              filter: 'blur(0.5px)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        ))}

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '999px', padding: '0.4rem 1.1rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', boxShadow: '0 0 8px rgba(5,150,105,0.6)' }} />
            <span style={{ fontSize: '0.825rem', color: '#4F46E5', fontWeight: 700 }}>🚀 The Ultimate Brain-Training Platform</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.75rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}
          >
            <span style={{ color: '#0F172A' }}>Train Your Mind.</span>
            <br />
            <span className="gradient-text">Solve the Impossible.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#475569', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 2.5rem', fontWeight: 500 }}
          >
            Challenge your logic, uncover mysteries, and become the ultimate <strong style={{ color: '#4F46E5', fontWeight: 700 }}>Mastermind</strong>.
            6 game types. Endless puzzles. Real progression.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}
          >
            <Link to="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem', gap: '0.5rem', borderRadius: '0.75rem' }}>
              <Brain size={18} />
              Start Playing Free
            </Link>
            <Link to="/games" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 2rem', borderRadius: '0.75rem' }}>
              Explore Games <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', background: '#FFFFFF', padding: '1.25rem 2rem', borderRadius: '1rem', border: '1px solid #E2E8F0', width: 'fit-content', margin: '0 auto', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                <span style={{ color: '#6366F1' }}>{s.icon}</span>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.15rem' }}>{s.value}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ padding: '6rem 1.5rem', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', letterSpacing: '0.15em', textTransform: 'uppercase' }}>What You'll Train</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', fontWeight: 800, color: '#0F172A', marginTop: '0.75rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              Six Dimensions of <span className="gradient-text">Intelligence</span>
            </h2>
            <p style={{ color: '#64748B', marginTop: '0.85rem', maxWidth: '520px', margin: '0.85rem auto 0', fontSize: '0.95rem' }}>
              Each category targets a unique cognitive skill. Master them all to become a true Mastermind.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '1.25rem',
                  padding: '1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.03)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.04)';
                }}
              >
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 className="font-accent" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.25rem' }}>{f.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Difficulty</span>
                  <DifficultyDots level={f.difficulty} color={f.color} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '6rem 1.5rem', background: '#F1F5F9', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284C7', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Your Journey</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', fontWeight: 800, color: '#0F172A', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
              How It <span style={{ color: '#0284C7' }}>Works</span>
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', padding: '1.75rem', position: 'relative' }}
              >
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', left: '3.25rem', top: '4.5rem', width: '2px', height: 'calc(100% - 1.5rem)', background: '#CBD5E1' }} />
                )}

                {/* Step number */}
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                  background: '#FFFFFF',
                  border: '2px solid #6366F1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.2)',
                  fontSize: '1.25rem',
                  zIndex: 1,
                }}>
                  {step.icon}
                </div>

                <div style={{ flex: 1, paddingTop: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#4F46E5', letterSpacing: '0.08em' }}>STEP {step.step}</span>
                  </div>
                  <h3 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RANKS SECTION ===== */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Progression</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', fontWeight: 800, color: '#0F172A', marginTop: '0.75rem', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Rise Through the <span className="gradient-text-gold">Ranks</span>
            </h2>
            <p style={{ color: '#64748B', marginBottom: '3rem', fontSize: '0.95rem' }}>Every puzzle solved brings you closer to the top.</p>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { rank: 'Beginner',   icon: '🌱', color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0', levels: '1-4' },
              { rank: 'Thinker',    icon: '💭', color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', levels: '5-8' },
              { rank: 'Solver',     icon: '🧩', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', levels: '9-12' },
              { rank: 'Detective',  icon: '🕵️', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', levels: '13-16' },
              { rank: 'Strategist', icon: '⚡', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', levels: '17-20' },
              { rank: 'Mastermind', icon: '👑', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', levels: '21-25' },
            ].map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -3 }}
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${r.border}`,
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                  minWidth: '130px',
                  boxShadow: `0 1px 3px rgba(0,0,0,0.04)`,
                }}
              >
                <span style={{ fontSize: '1.85rem' }}>{r.icon}</span>
                <span style={{ fontWeight: 800, color: r.color, fontSize: '0.95rem', fontFamily: 'var(--font-accent)' }}>{r.rank}</span>
                <span style={{ fontSize: '0.725rem', color: '#94A3B8', fontWeight: 600 }}>Lvl {r.levels}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            position: 'relative', zIndex: 1,
            maxWidth: '740px', margin: '0 auto', textAlign: 'center',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '1.5rem',
            padding: '4rem 2rem',
            boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.85rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.85rem', letterSpacing: '-0.02em' }}>
            Ready to Enter the <span className="gradient-text">MindForge</span>?
          </h2>
          <p style={{ color: '#64748B', marginBottom: '2rem', lineHeight: 1.7, fontSize: '1rem', maxWidth: '540px', margin: '0 auto 2rem' }}>
            Join 50,000+ players training their minds daily. Free to start. Impossible to stop.
          </p>
          <Link to="/signup" className="btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 2.25rem', borderRadius: '0.75rem' }}>
            Create Free Account →
          </Link>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>No credit card required</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E2E8F0', padding: '2rem 1.5rem', textAlign: 'center', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={14} color="white" />
          </div>
          <span className="font-display" style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 700 }}>MindForge</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>© 2026 MindForge. Train Your Mind. Forge Your Skills.</p>
      </footer>
    </div>
  );
}
