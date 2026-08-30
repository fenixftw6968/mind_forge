import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const [form, setForm]         = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { signup }              = useAuth();
  const navigate                = useNavigate();

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthColors = ['#FB7185', '#FBBF24', '#4ADE80', '#22C55E'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await signup(form.username, form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error || 'Signup failed');
  };

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#F8FAFC' }}>
      
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
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#242424', border: '1px solid #383838', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(34, 197, 94, 0.15)' }}>
            <Brain size={20} color="#22C55E" />
          </div>
          <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Mind<span style={{ color: '#22C55E' }}>Forge</span>
          </span>
        </Link>

        <Link to="/login" className="btn-secondary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.85rem' }}>
          Log In
        </Link>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '460px', margin: '0 auto', padding: '1.5rem 1.5rem 3rem', width: '100%', boxSizing: 'border-box' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: '#242424',
            border: '1px solid #2E2E2E',
            borderRadius: '1.25rem',
            padding: '2.25rem 2rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              Create an account
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Free forever · No credit card required</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '0.625rem', padding: '0.65rem 0.85rem', marginBottom: '1.25rem' }}
            >
              <AlertCircle size={15} color="#FB7185" />
              <span style={{ color: '#FB7185', fontSize: '0.825rem', fontWeight: 500 }}>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input type="text" value={form.username} onChange={update('username')} placeholder="Your username" required className="input-dark" style={{ paddingLeft: '2.5rem', background: '#1C1C1C', border: '1px solid #2E2E2E' }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required className="input-dark" style={{ paddingLeft: '2.5rem', background: '#1C1C1C', border: '1px solid #2E2E2E' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="Create a password" required className="input-dark" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', background: '#1C1C1C', border: '1px solid #2E2E2E' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '0.2rem' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '999px', background: i <= strength ? strengthColors[strength - 1] : '#333333', transition: 'background 0.2s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: strengthColors[strength - 1] || '#64748B' }}>{strength > 0 ? strengthLabels[strength - 1] : ''}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input type="password" value={form.confirm} onChange={update('confirm')} placeholder="Confirm password" required className="input-dark" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', background: '#1C1C1C', border: '1px solid #2E2E2E' }} />
                {form.confirm && (
                  <div style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}>
                    {form.confirm === form.password
                      ? <CheckCircle size={16} color="#4ADE80" />
                      : <AlertCircle size={16} color="#FB7185" />}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem', opacity: loading ? 0.75 : 1, fontSize: '0.9rem' }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4ADE80', textDecoration: 'none', fontWeight: 700 }}>Log in</Link>
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
