import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import api from '../../utils/api';

export default function ResetPassword() {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const tokenFromUrl            = searchParams.get('token') || '';

  const [token, setToken]               = useState(tokenFromUrl);
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthColors = ['#f87171', '#FBBF24', '#60A5FA', '#34D399'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Password reset token is missing. Please use the link sent to your email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', {
        token: token.trim(),
        newPassword: password
      });
      setSuccess(true);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to reset password. The link may have expired or is invalid.';
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
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.35)',
          }}>
            <Brain size={18} color="#60A5FA" />
          </div>
          <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Algo<span style={{ color: '#60A5FA' }}>Arena</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link
            to="/login"
            className="pill-btn-ghost"
            style={{ padding: '0.4rem 1.15rem', fontSize: '0.825rem' }}
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Container */}
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
          {success ? (
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
                Password Updated
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Your credentials have been securely refreshed. You can now log into your account.
              </p>
              <Link
                to="/login"
                className="pill-btn-blue"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                Proceed to Login
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  // SECURITY OVERRIDE
                </span>
                <h1 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.35rem', marginBottom: '0.35rem' }}>
                  Create New Password
                </h1>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 400 }}>
                  Enter and confirm your new secure password credentials
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
                {/* Reset Token */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                    Reset Security Token
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      placeholder="Paste your reset token..."
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="input-dark"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                    New Password
                  </label>
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div style={{ marginTop: '0.45rem' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
                        {[1, 2, 3, 4].map(idx => (
                          <div
                            key={idx}
                            style={{
                              height: '3px',
                              flex: 1,
                              borderRadius: '999px',
                              background: idx <= strength ? strengthColors[strength - 1] : 'rgba(255, 255, 255, 0.1)',
                              transition: 'all 0.2s ease'
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: strengthColors[strength - 1] || '#94A3B8', fontWeight: 600 }}>
                        {strengthLabels[strength - 1] || 'Too short'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="input-dark"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="pill-btn-blue"
                  style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
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
