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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link
            to="/login"
            className="btn-secondary"
            style={{ padding: '0.45rem 1.15rem', fontSize: '0.85rem' }}
          >
            Back to Sign In
          </Link>
        </div>
      </header>

      {/* Main Container */}
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
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(34, 197, 94, 0.12)', color: '#4ADE80',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              border: '1px solid rgba(34, 197, 94, 0.25)'
            }}>
              <Mail size={24} />
            </div>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              Forgot password?
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500 }}>
              No worries, enter your email and we will send you password reset instructions.
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
              <AlertCircle size={16} color="#FB7185" style={{ flexShrink: 0 }} />
              <span style={{ color: '#FB7185', fontSize: '0.825rem', fontWeight: 500 }}>{error}</span>
            </motion.div>
          )}

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                <CheckCircle2 size={22} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#4ADE80', marginBottom: '0.35rem' }}>
                Instructions Dispatched
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {message}
              </p>
              <p style={{ fontSize: '0.775rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
                Please check your inbox (and spam folder) for the 15-minute secure reset link.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setEmail(''); }}
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}
                >
                  Send to another email
                </button>
                <Link
                  to="/login"
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}
                >
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                  Registered Email Address
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
                {loading ? 'Sending link...' : 'Send Reset Link →'}
              </button>
            </form>
          )}

          {/* Bottom Link */}
          {!submitted && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8', marginTop: '1.5rem', fontWeight: 500 }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#4ADE80', textDecoration: 'none', fontWeight: 700 }}>
                Sign in
              </Link>
            </p>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid #242424', background: '#1A1A1A' }}>
        <p style={{ fontSize: '0.775rem', color: '#64748B' }}>© 2026 MindForge. All rights reserved.</p>
      </footer>
    </div>
  );
}
