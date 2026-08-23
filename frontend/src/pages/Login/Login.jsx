import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, Eye, EyeOff, AlertCircle, Target, Award, Zap, Trophy, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error || 'Login failed');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Top Header Navbar */}
      <header style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 10
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
          }}>
            <Brain size={22} color="white" />
          </div>
          <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Mind<span style={{ color: '#6366F1' }}>Forge</span>
          </span>
        </Link>

        {/* Right header actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/login"
            style={{
              padding: '0.45rem 1.15rem',
              borderRadius: '0.5rem',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            style={{
              padding: '0.45rem 1.15rem',
              borderRadius: '0.5rem',
              background: '#4F46E5',
              border: '1px solid #4F46E5',
              color: '#FFFFFF',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(79, 70, 229, 0.3)'
            }}
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Background soft circular blur orbs & dotted grid */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '2%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(248,250,252,0) 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '25%',
        right: '2%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(248,250,252,0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Decorative dots / subtle geometric accents */}
      <div style={{ position: 'absolute', top: '150px', left: '60px', opacity: 0.35, pointerEvents: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 6px)', gap: '12px' }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94A3B8' }} />
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '160px', right: '60px', opacity: 0.35, pointerEvents: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 6px)', gap: '12px' }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94A3B8' }} />
          ))}
        </div>
      </div>

      {/* Floating soft colored accent pills/dots */}
      <div style={{ position: 'absolute', top: '220px', left: '260px', width: '12px', height: '12px', borderRadius: '50%', background: '#818CF8', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '340px', left: '340px', width: '16px', height: '16px', borderRadius: '50%', background: '#C084FC', opacity: 0.5, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '540px', left: '130px', width: '12px', height: '12px', borderRadius: '50%', background: '#34D399', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '240px', right: '350px', width: '10px', height: '10px', borderRadius: '50%', background: '#818CF8', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '290px', right: '220px', width: '14px', height: '14px', borderRadius: '50%', background: '#C084FC', opacity: 0.5, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '540px', right: '110px', width: '12px', height: '12px', borderRadius: '50%', background: '#FBBF24', opacity: 0.7, pointerEvents: 'none' }} />

      {/* Main Login Viewport Layout */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 1.5rem 2rem',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Central Brand Welcome Text */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            }}>
              <Brain size={26} color="white" />
            </div>
            <span className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Mind<span style={{ color: '#4F46E5' }}>Forge</span>
            </span>
          </div>

          <h1 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Welcome back! 👋
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.925rem', fontWeight: 500 }}>
            Continue your journey and train your mind
          </p>
        </div>

        {/* 3-Column Center Stage (Left Feature Cards, Center Login Card, Right Feature Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 260px) minmax(360px, 440px) minmax(220px, 260px)',
          gap: '2.5rem',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1080px',
          margin: '0 auto 2.5rem'
        }}
        className="login-responsive-grid"
        >
          {/* Left Side Feature Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="login-side-features">
            {/* Daily Challenges card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '1.25rem',
                padding: '1.35rem 1.25rem',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#F3E8FF', border: '1px solid #E9D5FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Target size={20} color="#7E22CE" />
              </div>
              <div>
                <h3 className="font-accent" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                  Daily Challenges
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4, fontWeight: 500 }}>
                  New challenges every day to keep your mind sharp
                </p>
              </div>
            </motion.div>

            {/* Track Progress card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '1.25rem',
                padding: '1.35rem 1.25rem',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#ECFDF5', border: '1px solid #A7F3D0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Award size={20} color="#059669" />
              </div>
              <div>
                <h3 className="font-accent" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                  Track Progress
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4, fontWeight: 500 }}>
                  Monitor your improvement and unlock achievements
                </p>
              </div>
            </motion.div>
          </div>

          {/* Center Main Sign In Card */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1.5rem',
              padding: '2.5rem 2.25rem',
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.02)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <h2 className="font-display" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              Sign In
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem', fontWeight: 500 }}>
              Enter your credentials to continue your journey
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: '#FFF1F2',
                  border: '1px solid #FECDD3',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <AlertCircle size={16} color="#E11D48" />
                <span style={{ color: '#BE123C', fontSize: '0.875rem', fontWeight: 500 }}>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Email Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.45rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.6rem',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.625rem',
                      fontSize: '0.9rem',
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.45rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.85rem 0.75rem 2.6rem',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.625rem',
                      fontSize: '0.9rem',
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '0.625rem',
                  background: '#4F46E5',
                  border: '1px solid #4F46E5',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.35)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4338CA'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4F46E5'; }}
              >
                {loading ? (
                  <>
                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Signing in...
                  </>
                ) : 'Sign In →'}
              </button>
            </form>
          </motion.div>

          {/* Right Side Feature Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="login-side-features">
            {/* Boost Skills card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '1.25rem',
                padding: '1.35rem 1.25rem',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#FFFBEB', border: '1px solid #FDE68A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={20} color="#D97706" />
              </div>
              <div>
                <h3 className="font-accent" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                  Boost Skills
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4, fontWeight: 500 }}>
                  Improve logic, memory, speed and more
                </p>
              </div>
            </motion.div>

            {/* Climb Ranks card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '1.25rem',
                padding: '1.35rem 1.25rem',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#F0F9FF', border: '1px solid #BAE6FD',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Trophy size={20} color="#0284C7" />
              </div>
              <div>
                <h3 className="font-accent" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                  Climb Ranks
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4, fontWeight: 500 }}>
                  Compete, earn rewards and reach the top
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Create account link */}
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748B', fontWeight: 500, marginBottom: '2.5rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: 700 }}>
            Create one free →
          </Link>
        </p>

        {/* Bottom 4-Column Feature Bar (Secure, Train, Personalized, Earn Rewards) */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '1.25rem',
          padding: '1.5rem 2rem',
          width: '100%',
          maxWidth: '1080px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {/* Item 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EEF2FF', border: '1px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={20} color="#4F46E5" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>Secure & Private</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>Your data is encrypted and always safe</div>
            </div>
          </div>

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3E8FF', border: '1px solid #E9D5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={20} color="#7E22CE" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>Train Anywhere</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>Access MindForge on any device</div>
            </div>
          </div>

          {/* Item 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EEF2FF', border: '1px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Brain size={20} color="#4F46E5" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>Personalized Experience</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>Smart recommendations just for you</div>
            </div>
          </div>

          {/* Item 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FDF4FF', border: '1px solid #F5D0FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trophy size={20} color="#A21CAF" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>Earn Rewards</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>Collect coins, unlock badges and more</div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 992px) {
          .login-responsive-grid {
            grid-template-columns: 1fr !important;
            max-width: 440px !important;
          }
          .login-side-features {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
