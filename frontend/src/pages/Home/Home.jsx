import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Search, Puzzle, Eye, Zap, ChevronRight, Star, Users, Trophy } from 'lucide-react';

const FEATURES = [
  { icon: '🧠', title: 'Logical Thinking',      desc: 'Train your mind to reason through complex problems systematically.',     difficulty: 4, color: '#8b5cf6' },
  { icon: '🔍', title: 'Critical Thinking',     desc: 'Question assumptions, identify fallacies, and reach sound conclusions.', difficulty: 3, color: '#06b6d4' },
  { icon: '🕵️', title: 'Mystery Solving',       desc: 'Investigate clues, interrogate suspects, and crack unsolvable cases.',   difficulty: 5, color: '#f43f5e' },
  { icon: '🧩', title: 'Pattern Recognition',   desc: 'Spot hidden patterns in numbers, shapes, and abstract sequences.',      difficulty: 3, color: '#10b981' },
  { icon: '👁️', title: 'Observation',           desc: 'Sharpen your attention to detail with memory and observation tests.',   difficulty: 2, color: '#f59e0b' },
  { icon: '⚡', title: 'Quick Decision Making', desc: 'Train your brain to make accurate decisions under time pressure.',       difficulty: 4, color: '#ec4899' },
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
      animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay }}
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}40, transparent)`,
        filter: 'blur(20px)', pointerEvents: 'none',
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
          background: i <= level ? color : 'rgba(255,255,255,0.1)',
          boxShadow: i <= level ? `0 0 6px ${color}` : 'none',
        }} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 4rem' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.25) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <FloatingOrb size="300px" x="10%" y="20%"  color="#8b5cf6" delay={0} />
        <FloatingOrb size="200px" x="70%" y="60%"  color="#06b6d4" delay={1} />
        <FloatingOrb size="150px" x="85%" y="15%"  color="#f43f5e" delay={2} />
        <FloatingOrb size="180px" x="5%"  y="65%"  color="#10b981" delay={1.5} />

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
              opacity: 0.15,
              filter: 'blur(0.5px)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        ))}

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '2rem' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 500 }}>🚀 The Ultimate Brain-Training Platform</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}
          >
            <span style={{ color: 'white' }}>Train Your Mind.</span>
            <br />
            <span className="gradient-text">Solve the Impossible.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#a1a1b5', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 2.5rem' }}
          >
            Challenge your logic, uncover mysteries, and become the ultimate <strong style={{ color: '#a78bfa' }}>Mastermind</strong>.
            6 game types. Endless puzzles. Real progression.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}
          >
            <Link to="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem', gap: '0.5rem' }}>
              <Brain size={18} />
              Start Playing Free
            </Link>
            <Link to="/games" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Explore Games <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1b5' }}>
                <span style={{ color: '#8b5cf6' }}>{s.icon}</span>
                <span style={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>{s.value}</span>
                <span style={{ fontSize: '0.85rem' }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', opacity: 0.4 }}
        >
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #8b5cf6)' }} />
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ padding: '6rem 1.5rem', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8b5cf6', letterSpacing: '0.15em', textTransform: 'uppercase' }}>What You'll Train</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', marginTop: '0.75rem', lineHeight: 1.2 }}>
              Six Dimensions of <span className="gradient-text">Intelligence</span>
            </h2>
            <p style={{ color: '#a1a1b5', marginTop: '1rem', maxWidth: '500px', margin: '1rem auto 0' }}>
              Each category targets a unique cognitive skill. Master them all to become a true Mastermind.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#13131f',
                  border: `1px solid rgba(139,92,246,0.1)`,
                  borderRadius: '1.25rem',
                  padding: '1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${f.color}40`;
                  e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${f.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Background glow */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `${f.color}15`, filter: 'blur(20px)' }} />

                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '0.6rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#a1a1b5', lineHeight: 1.65, marginBottom: '1.25rem' }}>{f.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#52526a' }}>Difficulty</span>
                  <DifficultyDots level={f.difficulty} color={f.color} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '6rem 1.5rem', background: 'rgba(139,92,246,0.03)', borderTop: '1px solid rgba(139,92,246,0.08)', borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#06b6d4', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Your Journey</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', marginTop: '0.75rem' }}>
              How It <span style={{ color: '#06b6d4' }}>Works</span>
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', padding: '2rem', position: 'relative' }}
              >
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', left: '3.25rem', top: '5rem', width: '2px', height: 'calc(100% - 2rem)', background: 'linear-gradient(to bottom, rgba(139,92,246,0.4), rgba(139,92,246,0.05))' }} />
                )}

                {/* Step number */}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(139,92,246,0.35)',
                  fontSize: '1.3rem',
                  zIndex: 1,
                }}>
                  {step.icon}
                </div>

                <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.1em' }}>STEP {step.step}</span>
                  </div>
                  <h3 className="font-accent" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#a1a1b5' }}>{step.desc}</p>
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Progression</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
              Rise Through the <span className="gradient-text-gold">Ranks</span>
            </h2>
            <p style={{ color: '#a1a1b5', marginBottom: '3rem' }}>Every puzzle solved brings you closer to the top.</p>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { rank: 'Beginner',   icon: '🌱', color: '#a1a1b5', levels: '1-4' },
              { rank: 'Thinker',    icon: '💭', color: '#06b6d4', levels: '5-8' },
              { rank: 'Solver',     icon: '🧩', color: '#10b981', levels: '9-12' },
              { rank: 'Detective',  icon: '🕵️', color: '#8b5cf6', levels: '13-16' },
              { rank: 'Strategist', icon: '⚡', color: '#f59e0b', levels: '17-20' },
              { rank: 'Mastermind', icon: '👑', color: '#f43f5e', levels: '21-25' },
            ].map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, y: -4 }}
                style={{
                  background: '#13131f',
                  border: `1px solid ${r.color}25`,
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                  minWidth: '120px',
                  boxShadow: `0 4px 20px ${r.color}10`,
                }}
              >
                <span style={{ fontSize: '1.75rem' }}>{r.icon}</span>
                <span style={{ fontWeight: 700, color: r.color, fontSize: '0.9rem', fontFamily: 'var(--font-accent)' }}>{r.rank}</span>
                <span style={{ fontSize: '0.7rem', color: '#52526a' }}>Lvl {r.levels}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            position: 'relative', zIndex: 1,
            maxWidth: '700px', margin: '0 auto', textAlign: 'center',
            background: '#13131f',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: '2rem',
            padding: '4rem 2rem',
            boxShadow: '0 0 60px rgba(139,92,246,0.12)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Ready to Enter the <span className="gradient-text">MindMaze</span>?
          </h2>
          <p style={{ color: '#a1a1b5', marginBottom: '2rem', lineHeight: 1.7 }}>
            Join 50,000+ players training their minds daily. Free to start. Impossible to stop.
          </p>
          <Link to="/signup" className="btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 2.25rem' }}>
            Create Free Account →
          </Link>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#52526a' }}>No credit card required</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(139,92,246,0.1)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={14} color="white" />
          </div>
          <span className="font-display" style={{ fontSize: '0.9rem', color: '#a1a1b5' }}>MindMaze</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#52526a' }}>© 2024 MindMaze. Train your mind. Solve the impossible.</p>
      </footer>
    </div>
  );
}
