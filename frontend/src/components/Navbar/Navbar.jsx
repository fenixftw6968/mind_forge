import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Trophy, Flame, Coins, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/games',     label: 'Games' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/profile',   label: 'Profile' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(139,92,246,0.15)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: '64px', gap: '2rem' }}>
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(139,92,246,0.4)',
          }}>
            <Brain size={20} color="white" />
          </div>
          <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>
            Mind<span style={{ color: '#a78bfa' }}>Maze</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        {isAuthenticated && (
          <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive(link.to) ? '#a78bfa' : '#a1a1b5',
                background: isActive(link.to) ? 'rgba(139,92,246,0.12)' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive(link.to)) { e.target.style.color = 'white'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}}
              onMouseLeave={e => { if (!isActive(link.to)) { e.target.style.color = '#a1a1b5'; e.target.style.background = 'transparent'; }}}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated && user ? (
            <>
              {/* Stats pills */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <Coins size={13} style={{ color: '#f59e0b' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>{user.coins}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                  <Flame size={13} style={{ color: '#f43f5e' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f43f5e' }}>{user.currentStreak}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <Zap size={13} style={{ color: '#a78bfa' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a78bfa' }}>Lv.{user.level}</span>
                </div>
              </div>

              {/* User menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
                    borderRadius: '0.75rem', padding: '0.4rem 0.75rem',
                    cursor: 'pointer', color: 'white', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.username}</span>
                  <ChevronDown size={14} style={{ color: '#a1a1b5', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: '#13131f', border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: '0.75rem', padding: '0.5rem',
                        minWidth: '160px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        zIndex: 200,
                      }}
                    >
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', color: '#a1a1b5', textDecoration: 'none', fontSize: '0.875rem', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.target.style.background = 'rgba(139,92,246,0.1)'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#a1a1b5'; }}>
                        👤 Profile
                      </Link>
                      <button
                        onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', color: '#f43f5e', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Log In</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
