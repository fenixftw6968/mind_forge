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
      background: '#151515',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#F8FAFC'
    }}>
      {/* Top Header Navbar */}
      <header style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 10
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#242424',
            border: '1px solid #383838',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.15)',
          }}>
            <Brain size={20} color="#22C55E" />
          </div>
          <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Mind<span style={{ color: '#22C55E' }}>Forge</span>
          </span>
        </Link>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link
            to="/signup"
            className="btn-primary"
            style={{ padding: '0.45rem 1.15rem', fontSize: '0.85rem' }}
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Login Viewport */}
      <main style={{
        maxWidth: '460px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
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
            background: '#242424',
            border: '1px solid #2E2E2E',
            borderRadius: '1.25rem',
            padding: '2.25rem 2rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500 }}>
              Enter your credentials to access your account
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
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '0.625rem',
                padding: '0.65rem 0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={15} color="#FB7185" />
              <span style={{ color: '#FB7185', fontSize: '0.825rem', fontWeight: 500 }}>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-dark"
                  style={{ paddingLeft: '2.5rem', background: '#1C1C1C', border: '1px solid #2E2E2E' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1' }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: '0.785rem',
                    color: '#4ADE80',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-dark"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', background: '#1C1C1C', border: '1px solid #2E2E2E' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '0.5rem',
                padding: '0.8rem 1.25rem',
                fontSize: '0.9rem',
                opacity: loading ? 0.75 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Bottom Link */}
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8', marginTop: '1.5rem', fontWeight: 500 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#4ADE80', textDecoration: 'none', fontWeight: 700 }}>
              Sign up free
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid #242424', background: '#1A1A1A' }}>
        <p style={{ fontSize: '0.775rem', color: '#64748B' }}>© 2026 MindForge. All rights reserved.</p>
      </footer>
    </div>
  );
}
