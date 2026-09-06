import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
      background: '#020617',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#F8FAFC'
    }}>
      {/* Background Starfield & Mesh Glow */}
      <div className="star-field" />
      <div className="binary-texture" />
      <div className="mesh-glow" style={{ top: '50%', opacity: 0.6 }} />

      {/* Top Header Navbar */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 10
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.35)',
          }}>
            <Brain size={18} color="#60A5FA" />
          </div>
          <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Algo<span style={{ color: '#60A5FA' }}>Arena</span>
          </span>
        </Link>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link
            to="/signup"
            className="pill-btn-ghost"
            style={{ padding: '0.4rem 1.15rem', fontSize: '0.825rem' }}
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Login Viewport */}
      <main style={{
        maxWidth: '440px',
        margin: '0 auto',
        padding: '1.5rem 1.5rem 4rem',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Central Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(8, 14, 33, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.25rem',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.12)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              // AUTHENTICATION PROTOCOL
            </span>
            <h1 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.35rem', marginBottom: '0.35rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 400 }}>
              Enter your credentials to access the cognitive network
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.65rem 0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={15} color="#f87171" />
              <span style={{ color: '#f87171', fontSize: '0.825rem', fontWeight: 500 }}>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="solver@algoarena.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#CBD5E1' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#60A5FA', textDecoration: 'none', fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="pill-btn-blue"
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Card footer */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.825rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>
                Sign up free
              </Link>
            </span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', padding: '1.25rem 2rem', textAlign: 'center', zIndex: 10 }}>
        <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
          &copy; {new Date().getFullYear()} AlgoArena. Algorithmic Arena Platform.
        </p>
      </footer>
    </div>
  );
}
