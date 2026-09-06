import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Trophy, Shield, Activity, Layers, Cpu, ArrowRight, Play, Sparkles, Swords, Brain, Flame, Target } from 'lucide-react';

/* Geometric Blueprint Wireframe SVGs (Pathsdata style) */
function StarburstIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2V30M2 16H30M6.1 6.1L25.9 25.9M6.1 25.9L25.9 6.1" stroke="#38BDF8" strokeWidth="1.75" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="2.5" fill="#60A5FA" />
    </svg>
  );
}

function LayersWireframeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L28 10L16 16L4 10L16 4Z" stroke="#38BDF8" strokeWidth="1.75" strokeLinejoin="round"/>
      <path d="M4 16L16 22L28 16" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 22L16 28L28 22" stroke="#93C5FD" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IsometricCubeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3L28 9.5V22.5L16 29L4 22.5V9.5L16 3Z" stroke="#38BDF8" strokeWidth="1.75" strokeLinejoin="round"/>
      <path d="M16 16V29M16 16L28 9.5M16 16L4 9.5" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const DISCIPLINES = [
  { glyph: '01', icon: '🧠', title: 'DSA & Algorithms',      desc: 'Master data structures, algorithm complexities, graph traversals, and code output analysis.', difficulty: 5, color: '#3B82F6' },
  { glyph: '02', icon: '🧩', title: 'Logical Reasoning',     desc: 'Solve multi-step deduction grids, syllogisms, analogies, and boolean condition puzzles.', difficulty: 4, color: '#38BDF8' },
  { glyph: '03', icon: '⚡', title: 'Brain Teaser Battle',   desc: 'Challenge lateral thinking with mental math, tricky riddles, and rapid algorithmic traps.', difficulty: 4, color: '#60A5FA' },
  { glyph: '04', icon: '🔢', title: 'Number Detective',      desc: 'Crack patterns in non-linear mathematical formulas, Fibonacci variants, and exponential matrices.', difficulty: 3, color: '#34D399' },
  { glyph: '05', icon: '👁️', title: 'Memory Challenge',      desc: 'Sharpen short-term visual recall, spatial orientation, and complex pattern matching under time.', difficulty: 2, color: '#818CF8' },
  { glyph: '06', icon: '🔐', title: 'Code Breaker',          desc: 'Deduce secret combinations through systematic elimination, positional logic, and entropy clues.', difficulty: 4, color: '#38BDF8' },
];

const KEY_FEATURES = [
  {
    icon: <StarburstIcon />,
    title: 'Sub-Second Problem Evaluation',
    desc: 'Instant code and logic validation with millisecond precision, powered by reactive client-server architecture.',
    tag: 'Ultra Responsive'
  },
  {
    icon: <LayersWireframeIcon />,
    title: 'Adaptive Cognitive Progression',
    desc: 'Six carefully calibrated discipline arenas that adapt to your tier, testing logic, time complexity, and recall.',
    tag: 'Skill Tiers'
  },
  {
    icon: <IsometricCubeIcon />,
    title: 'Real-time 1v1 Elo Matchmaking',
    desc: 'Live head-to-head multiplayer battles with automated matchmaking, bot simulation fallbacks, and Elo rating updates.',
    tag: 'Competitive'
  }
];

export default function Home() {
  return (
    <div style={{ background: '#020617', minHeight: '100vh', overflowX: 'hidden', color: '#F8FAFC', position: 'relative' }}>
      
      {/* Background Starfield & Subtle Matrix Texture */}
      <div className="star-field" />
      <div className="binary-texture" />

      {/* ===== HERO SECTION ===== */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8.5rem 1.5rem 6rem',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        
        {/* Central Ambient Radial Glow */}
        <div className="mesh-glow" />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '980px', margin: '0 auto', width: '100%' }}>
          
          {/* Live Arena Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'rgba(8, 14, 33, 0.75)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '9999px',
              padding: '0.4rem 1.15rem 0.4rem 0.65rem',
              marginBottom: '2.25rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.2)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(59, 130, 246, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 8px #38BDF8', animation: 'pulse 2s infinite' }} />
              <span className="font-mono" style={{ fontSize: '0.725rem', color: '#60A5FA', fontWeight: 700 }}>LIVE ARENAS</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
              1v1 Ranked Duels • Daily Midnight Challenge
            </span>
          </motion.div>

          {/* Bold Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 5.8vw, 4.75rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              textShadow: '0 0 40px rgba(59, 130, 246, 0.25)'
            }}
          >
            Master Algorithms. Conquer Puzzles. <br />
            <span style={{
              background: 'linear-gradient(180deg, #FFFFFF 20%, #93C5FD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 35px rgba(59, 130, 246, 0.4)'
            }}>
              Dominate the Arena.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: '#94A3B8',
              lineHeight: 1.65,
              maxWidth: '700px',
              margin: '0 auto 2.75rem',
              fontWeight: 400
            }}
          >
            Level up your analytical intellect through curated DSA challenges, logic grids, cryptographic ciphers, and real-time 1v1 Elo duels.
          </motion.p>

          {/* Glowing Blue Pill CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '5.5rem' }}
          >
            <Link to="/games" className="pill-btn-blue" style={{ padding: '0.85rem 2.4rem', fontSize: '0.95rem' }}>
              Enter Arenas <ArrowRight size={16} />
            </Link>
            <Link to="/signup" className="pill-btn-ghost" style={{ padding: '0.85rem 2.4rem', fontSize: '0.95rem' }}>
              Create Free Account
            </Link>
          </motion.div>

          {/* 3-Column Highlight Strip with Vertical Dividers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              maxWidth: '920px',
              margin: '0 auto',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <div style={{
              padding: '0 1.25rem',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Swords size={16} color="#38BDF8" />
                <h4 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>Live 1v1 Duels</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                Battle friends or matchmaking opponents in synchronized, real-time cognitive sprints.
              </p>
            </div>

            <div style={{
              padding: '0 1.25rem',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={16} color="#60A5FA" />
                <h4 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>Competitive Elo</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                Climb from Novice to Master tier with our mathematically balanced rating system.
              </p>
            </div>

            <div style={{
              padding: '0 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Brain size={16} color="#93C5FD" />
                <h4 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>6 Cognitive Suites</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                Algorithms, logic puzzles, number theory, memory recall, and code ciphers.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Ethereal Planetary Blue Horizon Glow Arc */}
        <div className="horizon-glow" />
        <div className="horizon-arc-line" />
      </section>

      {/* ===== KEY FEATURES SECTION ===== */}
      <section style={{ padding: '7rem 1.5rem 5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#60A5FA',
              marginBottom: '1rem',
              letterSpacing: '0.04em'
            }}>
              Engineered for Problem Solvers
            </div>

            <h2 className="font-display" style={{
              fontSize: 'clamp(1.85rem, 3.8vw, 2.75rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.25,
              maxWidth: '820px',
              margin: '0 auto',
              letterSpacing: '-0.02em'
            }}>
              Everything you need to sharpen analytical thinking and coding intuition, all in{' '}
              <span style={{
                background: 'linear-gradient(90deg, #60A5FA 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800
              }}>
                one arena.
              </span>
            </h2>

            <p style={{ color: '#94A3B8', marginTop: '1rem', maxWidth: '640px', margin: '1rem auto 0', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Whether you are preparing for technical interviews, sharpening your algorithmic deductions, or competing in ranked duels, AlgoArena provides the ultimate cognitive training ground.
            </p>
          </div>

          {/* 3 Dark Glass Cards with Geometric Blueprint Icons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {KEY_FEATURES.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.45)', boxShadow: '0 12px 35px rgba(59, 130, 246, 0.18)' }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'rgba(8, 14, 33, 0.72)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1.125rem',
                  padding: '2.25rem 2rem',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                {/* Wireframe Icon */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '0.75rem',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {f.icon}
                </div>

                {/* Title */}
                <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>

                {/* Desc */}
                <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DISCIPLINES SECTION ===== */}
      <section style={{ padding: '6rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              // ARCHITECTURE OF ARENAS
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#FFFFFF', marginTop: '0.65rem', letterSpacing: '-0.02em' }}>
              Targeted Cognitive Disciplines
            </h2>
            <p style={{ color: '#94A3B8', marginTop: '0.5rem', maxWidth: '520px', margin: '0.5rem auto 0', fontSize: '0.925rem' }}>
              Curated cognitive pathways engineered to expand algorithmic speed, deduction accuracy, and mental acuity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {DISCIPLINES.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3, borderColor: 'rgba(59, 130, 246, 0.4)', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.15)' }}
                style={{
                  background: 'rgba(8, 14, 33, 0.65)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
              >
                {/* Glyph ID in corner */}
                <div style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.25)',
                  fontWeight: 600
                }}>
                  #{f.glyph}
                </div>

                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {f.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Tier Level {f.difficulty}</span>
                  <Link to="/games" style={{
                    fontSize: '0.8rem',
                    color: '#60A5FA',
                    textDecoration: 'none',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    Enter Arena <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA SECTION ===== */}
      <section style={{ padding: '6rem 1.5rem 8rem', position: 'relative', zIndex: 2 }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          background: 'linear-gradient(180deg, rgba(8, 14, 33, 0.9) 0%, rgba(6, 11, 28, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '1.5rem',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(59, 130, 246, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '250px',
            background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.35) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />

          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>
            Ready to Test Your Cognitive Limits?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 2.5rem', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
            Join competitive thinkers, solve curated problems, and climb the global ranking leaderboard.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link to="/signup" className="pill-btn-blue" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
              Get Started Now <ArrowRight size={16} />
            </Link>
            <Link to="/games" className="pill-btn-ghost" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
              Browse Arenas
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem', position: 'relative', zIndex: 2, background: '#020617' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }} />
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>AlgoArena Platform</span>
          </div>
          <div>
            © {new Date().getFullYear()} AlgoArena. Engineered for Peak Algorithmic Performance.
          </div>
        </div>
      </footer>
    </div>
  );
}
