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

  const strengthColors = ['#E11D48', '#D97706', '#059669', '#059669'];
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
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5.5rem 1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
              <Brain size={24} color="white" />
            </div>
            <span className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>Mind<span style={{ color: '#6366F1' }}>Forge</span></span>
          </Link>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.4rem', fontWeight: 500 }}>Train Your Mind. Forge Your Skills.</p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '2.25rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)' }}>
          <h1 className="font-display" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Create Account</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Free forever. No credit card needed.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}
            >
              <AlertCircle size={16} color="#E11D48" />
              <span style={{ color: '#BE123C', fontSize: '0.875rem', fontWeight: 500 }}>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input type="text" value={form.username} onChange={update('username')} placeholder="Your detective alias" required className="input-dark" style={{ paddingLeft: '2.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.625rem' }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required className="input-dark" style={{ paddingLeft: '2.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.625rem' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="Create a strong password" required className="input-dark" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.625rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength */}
              {form.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: '4px', borderRadius: '999px', background: i <= strength ? strengthColors[strength - 1] : '#E2E8F0', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.725rem', fontWeight: 600, color: strengthColors[strength - 1] || '#94A3B8' }}>{strength > 0 ? strengthLabels[strength - 1] : ''}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input type="password" value={form.confirm} onChange={update('confirm')} placeholder="Repeat your password" required className="input-dark" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.625rem' }} />
                {form.confirm && (
                  <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                    {form.confirm === form.password
                      ? <CheckCircle size={16} color="#059669" />
                      : <AlertCircle size={16} color="#E11D48" />}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem', opacity: loading ? 0.7 : 1, fontSize: '0.925rem' }}>
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Creating account...
                </>
              ) : 'Enter MindForge →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748B' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: 700 }}>Sign in →</Link>
        </p>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
