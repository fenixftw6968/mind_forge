import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Search, Puzzle, Eye, Zap, ChevronRight, Star, Users, Trophy, Shield, Award, CheckCircle } from 'lucide-react';

const FEATURES = [
  { icon: '🧠', title: 'DSA & Algorithms',      desc: 'Master data structures, algorithm complexities, trees, graphs, and C++ code output.', difficulty: 5, color: '#22C55E' },
  { icon: '🧩', title: 'Logical Reasoning',     desc: 'Solve number sequences, deduction problems, analogies, and logical puzzles.',          difficulty: 4, color: '#38BDF8' },
  { icon: '⚡', title: 'Brain Teaser Battle',   desc: 'Challenge your mind with riddles, aptitude, mental math, and quick-thinking traps.',    difficulty: 4, color: '#FBBF24' },
  { icon: '🔢', title: 'Number Detective',      desc: 'Crack patterns in advanced numerical and exponential power series.',                    difficulty: 3, color: '#4ADE80' },
  { icon: '👁️', title: 'Memory Challenge',      desc: 'Sharpen observation and rapid visual recall across complex environments.',              difficulty: 2, color: '#A855F7' },
  { icon: '🔐', title: 'Code Breaker',          desc: 'Deduce secret combinations through logical elimination and positional clues.',          difficulty: 4, color: '#FB7185' },
];

const STEPS = [
  { step: '01', title: 'Choose Your Arena',    desc: 'Select from 6 focused cognitive disciplines designed for mental sharpness', icon: '🎮' },
  { step: '02', title: 'Solve & Earn XP',      desc: 'Get immediate feedback, earn coins, and gain experience points',      icon: '⭐' },
  { step: '03', title: 'Compete in 1v1 Elo',   desc: 'Battle friends or climb ranked leaderboards on identical puzzle seeds', icon: '⚔️' },
  { step: '04', title: 'Ascend to Mastermind', desc: 'Unlock achievements and reach the pinnacle tier of mental mastery',    icon: '👑' },
];

const STATS = [
  { icon: <Users size={18} />,  value: '50K+', label: 'Active Minds' },
  { icon: <Puzzle size={18} />, value: '200+', label: 'Curated Puzzles' },
  { icon: <Trophy size={18} />, value: '6',    label: 'Disciplines' },
  { icon: <Star size={18} />,   value: '4.9',  label: 'User Rating' },
];

function DifficultyDots({ level, color }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: '5px', height: '5px', borderRadius: '50%',
          background: i <= level ? color : '#333333',
        }} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ background: '#151515', minHeight: '100vh', overflowX: 'hidden', color: '#F8FAFC' }}>

      {/* ===== HERO SECTION ===== */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7rem 1.5rem 4rem' }}>
        {/* Ambient subtle glow */}
        <div style={{
          position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '550px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(34, 197, 94, 0.08) 0%, rgba(21, 21, 21, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#242424',
              border: '1px solid #2E2E2E',
              borderRadius: '999px',
              padding: '0.35rem 1rem',
              marginBottom: '1.75rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
            <span style={{ fontSize: '0.8rem', color: '#4ADE80', fontWeight: 700 }}>
              The Modern Cognitive Training Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
              color: '#F8FAFC'
            }}
          >
            Sharpen Your Mind. <br />
            <span style={{ color: '#22C55E' }}>Master Every Puzzle.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#94A3B8',
              lineHeight: 1.65,
              maxWidth: '600px',
              margin: '0 auto 2.25rem',
              fontWeight: 500
            }}
          >
            Daily cognitive challenges, real-time multiplayer duels, and measurable mental progression. Built for thinkers and solvers.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}
          >
            <Link to="/signup" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.8rem 1.85rem', borderRadius: '0.625rem' }}>
              <Brain size={17} />
              Start Training Free
            </Link>
            <Link to="/games" className="btn-secondary" style={{ fontSize: '0.95rem', padding: '0.8rem 1.85rem', borderRadius: '0.625rem' }}>
              Explore Games <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{
              display: 'flex',
              gap: '2.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              background: '#242424',
              padding: '1.15rem 2.25rem',
              borderRadius: '1rem',
              border: '1px solid #2E2E2E',
              width: 'fit-content',
              margin: '0 auto',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
            }}
          >
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#22C55E' }}>{s.icon}</span>
                <span style={{ fontWeight: 800, color: '#F8FAFC', fontSize: '1.1rem' }}>{s.value}</span>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Cognitive Dimensions
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#F8FAFC', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Targeted Brain Training
            </h2>
            <p style={{ color: '#94A3B8', marginTop: '0.5rem', maxWidth: '480px', margin: '0.5rem auto 0', fontSize: '0.925rem' }}>
              Each discipline targets specific neurological pathways to systematically improve analytical clarity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  background: '#242424',
                  border: '1px solid #2E2E2E',
                  borderRadius: '1.15rem',
                  padding: '1.75rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#3D3D3D';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#2E2E2E';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>{f.icon}</div>
                <h3 className="font-accent" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.4rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.55, marginBottom: '1.25rem' }}>{f.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>Complexity</span>
                  <DifficultyDots level={f.difficulty} color={f.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '5rem 1.5rem', background: '#1A1A1A', borderTop: '1px solid #282828', borderBottom: '1px solid #282828' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Methodology
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#F8FAFC', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              How MindForge Works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  background: '#242424',
                  border: '1px solid #2E2E2E',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#22C55E',
                  letterSpacing: '0.06em',
                  marginBottom: '0.75rem'
                }}>
                  STEP {step.step}
                </div>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{step.icon}</div>
                <h3 className="font-accent" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RANKS PROGRESSION ===== */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Progression Ladder
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#F8FAFC', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Climb Through the Ranks
            </h2>
            <p style={{ color: '#94A3B8', marginTop: '0.5rem', fontSize: '0.925rem' }}>
              Every solved challenge advances your account level and unlocks higher status tiers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {[
              { rank: 'Beginner',   icon: '🌱', color: '#94A3B8', bg: '#242424', border: '#2E2E2E', levels: '1-4' },
              { rank: 'Thinker',    icon: '💭', color: '#38BDF8', bg: '#242424', border: '#2E2E2E', levels: '5-8' },
              { rank: 'Solver',     icon: '🧩', color: '#4ADE80', bg: '#242424', border: '#2E2E2E', levels: '9-12' },
              { rank: 'Detective',  icon: '🕵️', color: '#818CF8', bg: '#242424', border: '#2E2E2E', levels: '13-16' },
              { rank: 'Strategist', icon: '⚡', color: '#FBBF24', bg: '#242424', border: '#2E2E2E', levels: '17-20' },
              { rank: 'Mastermind', icon: '👑', color: '#FB7185', bg: '#242424', border: '#2E2E2E', levels: '21-25' },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  background: r.bg,
                  border: `1px solid ${r.border}`,
                  borderRadius: '0.875rem',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                }}
              >
                <span style={{ fontSize: '1.65rem' }}>{r.icon}</span>
                <span style={{ fontWeight: 800, color: r.color, fontSize: '0.9rem', fontFamily: 'var(--font-accent)' }}>{r.rank}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Lvl {r.levels}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section style={{ padding: '4rem 1.5rem 6rem' }}>
        <div style={{
          maxWidth: '720px', margin: '0 auto', textAlign: 'center',
          background: '#242424',
          border: '1px solid #2E2E2E',
          borderRadius: '1.5rem',
          padding: '3.5rem 2rem',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
        }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Ready to Forge Your Mind?
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Join tens of thousands of players elevating their mental agility every single day.
          </p>
          <Link to="/signup" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.25rem', borderRadius: '0.625rem' }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #242424', padding: '2rem 1.5rem', textAlign: 'center', background: '#1A1A1A' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={13} color="#05200C" />
          </div>
          <span className="font-display" style={{ fontSize: '0.95rem', color: '#F8FAFC', fontWeight: 800 }}>MindForge</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748B' }}>© 2026 MindForge. Train Your Mind. Forge Your Skills.</p>
      </footer>
    </div>
  );
}
