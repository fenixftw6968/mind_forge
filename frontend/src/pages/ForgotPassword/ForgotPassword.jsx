import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, AlertCircle, CheckCircle2, ArrowLeft, Send } from 'lucide-react';
import api from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      setSubmitted(true);
      setMessage(res.data?.message || 'If an account with this email exists, a password reset link has been sent.');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to send reset link. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
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
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.35)'
          }}>
            <Brain size={18} color="#60A5FA" />
          </div>
          <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Algo<span style={{ color: '#60A5FA' }}>Arena</span>
          </span>
        </Link>

        <Link
          to="/login"
          className="pill-btn-ghost"
          style={{ padding: '0.4rem 1.15rem', fontSize: '0.825rem' }}
        >
          Back to Login
        </Link>
      </header>

      {/* Main Form Viewport */}
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
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle2 size={24} color="#34D399" />
              </div>
              <h2 className="font-display" style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                Check Your Inbox
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {message}
              </p>
              <Link
                to="/login"
                className="pill-btn-blue"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  // RECOVERY PROTOCOL
                </span>
                <h1 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.35rem', marginBottom: '0.35rem' }}>
                  Reset Password
                </h1>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 400 }}>
                  Enter your email address and we will dispatch a reset link
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

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="pill-btn-blue"
                  style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Dispatching...' : 'Send Recovery Link'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Link to="/login" style={{ color: '#60A5FA', fontSize: '0.825rem', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowLeft size={13} /> Back to Sign In
                </Link>
              </div>
            </>
          )}
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
