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

  const strengthColors = ['#FB7185', '#FBBF24', '#4ADE80', '#22C55E'];
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
            Sign In
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
              <KeyRound size={24} />
            </div>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              Set new password
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500 }}>
              Must be at least 6 characters with good complexity
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

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '0.75rem',
                padding: '1.5rem 1.25rem',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#4ADE80', marginBottom: '0.4rem' }}>
                Password Updated!
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Your password has been successfully reset. You can now sign in with your new credentials.
              </p>
              <Link
                to="/login"
                className="btn-primary"
                style={{ width: '100%', fontSize: '0.9rem', padding: '0.75rem' }}
              >
                Continue to Sign In →
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* If token wasn't in URL, allow user to input token */}
              {!tokenFromUrl && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                    Reset Token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="Enter reset token from email"
                    required
                    className="input-dark"
                    style={{ background: '#1C1C1C', border: '1px solid #2E2E2E' }}
                  />
                </div>
              )}

              {/* New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter new password"
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
                      display: 'flex'
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {password && (
                  <div style={{ marginTop: '0.45rem' }}>
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '0.2rem' }}>
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: '3px',
                            borderRadius: '999px',
                            background: i <= strength ? strengthColors[strength - 1] : '#333333',
                            transition: 'background 0.2s'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: strengthColors[strength - 1] || '#64748B' }}>
                      {strength > 0 ? strengthLabels[strength - 1] : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="input-dark"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', background: '#1C1C1C', border: '1px solid #2E2E2E' }}
                  />
                  {confirmPassword && (
                    <div style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}>
                      {confirmPassword === password ? (
                        <CheckCircle2 size={16} color="#4ADE80" />
                      ) : (
                        <AlertCircle size={16} color="#FB7185" />
                      )}
                    </div>
                  )}
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
                {loading ? 'Updating password...' : 'Reset Password →'}
              </button>
            </form>
          )}

          {!success && (
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
