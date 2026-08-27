import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Trophy, Flame, Coins, LogOut, Menu, X, ChevronDown, Users, Swords } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRankFromRating } from '../../utils/rankUtils';
import SocialDrawer from '../SocialDrawer/SocialDrawer';
import IncomingInviteModal from '../IncomingInviteModal/IncomingInviteModal';
import { useUserInvitationsSocket } from '../../hooks/useUserInvitationsSocket';
import api from '../../utils/api';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [pendingInvite, setPendingInvite] = useState(null);
  const [processingInviteId, setProcessingInviteId] = useState(null);
  const acceptedInviteIdsRef = useRef(new Set());

  // Real-time WebSocket listener for invitations to this user
  useUserInvitationsSocket(user?.id, (event) => {
    if (event.type === 'NEW_INVITATION') {
      const inviteId = event.data?.id;
      if (inviteId && !acceptedInviteIdsRef.current.has(inviteId) && processingInviteId !== inviteId) {
        setPendingInvite(event.data);
      }
    } else if (event.type === 'INVITATION_CANCELLED' || event.type === 'INVITATION_DECLINED' || event.type === 'INVITATION_ACCEPTED') {
      setPendingInvite(prev => (prev?.id === event.data?.id ? null : prev));
    }
  });

  // Initial check on mount + fallback check every 10s
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const checkInvites = async () => {
      if (processingInviteId) return;
      try {
        const res = await api.get('/api/matches/invitations/pending');
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          const invite = res.data[0];
          if (invite.id && !acceptedInviteIdsRef.current.has(invite.id) && invite.id !== processingInviteId) {
            setPendingInvite(invite);
          }
        } else if (isMounted) {
          setPendingInvite(null);
        }
      } catch (e) {
        // Silently catch error
      }
    };

    checkInvites();
    const interval = setInterval(checkInvites, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, processingInviteId]);

  const handleAcceptInvite = async (invite) => {
    if (!invite?.id) return;
    acceptedInviteIdsRef.current.add(invite.id);
    setProcessingInviteId(invite.id);
    setPendingInvite(null);
    try {
      const res = await api.post(`/api/matches/${invite.id}/accept`);
      // Navigate to game with active match state
      navigate(`/games/${invite.gameSlug}`, { state: { acceptedMatch: res.data } });
    } catch (e) {
      console.error("Failed to accept invite", e);
    } finally {
      setTimeout(() => {
        setProcessingInviteId(null);
      }, 2000);
    }
  };

  const handleDeclineInvite = async (invite) => {
    if (!invite?.id) return;
    acceptedInviteIdsRef.current.add(invite.id);
    setProcessingInviteId(invite.id);
    setPendingInvite(null);
    try {
      await api.post(`/api/matches/${invite.id}/decline`);
    } catch (e) {
      console.error("Failed to decline invite", e);
    } finally {
      setTimeout(() => {
        setProcessingInviteId(null);
      }, 2000);
    }
  };

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
  const currentRank = getRankFromRating(user?.competitiveRating || 500);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: '64px', gap: '2rem' }}>
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
            }}>
              <Brain size={20} color="white" />
            </div>
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Mind<span style={{ color: '#6366F1' }}>Forge</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.35rem', flex: 1 }}>
              {navLinks.map(link => {
                const active = isActive(link.to);
                return (
                  <Link key={link.to} to={link.to} style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? '#4F46E5' : '#475569',
                    background: active ? '#EEF2FF' : 'transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { if (!active) { e.target.style.color = '#0F172A'; e.target.style.background = '#F1F5F9'; }}}
                  onMouseLeave={e => { if (!active) { e.target.style.color = '#475569'; e.target.style.background = 'transparent'; }}}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {isAuthenticated && user ? (
              <>
                {/* Stats pills */}
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {/* Competitive Rank Pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '999px',
                    background: currentRank.bg,
                    border: `1px solid ${currentRank.border}`
                  }}>
                    <span style={{ fontSize: '0.85rem' }}>{currentRank.badge}</span>
                    <span style={{ fontSize: '0.775rem', fontWeight: 800, color: currentRank.color }}>{user.competitiveRating || 500} pts</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.65rem', borderRadius: '999px', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <Coins size={13} style={{ color: '#D97706' }} />
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#B45309' }}>{user.coins}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.65rem', borderRadius: '999px', background: '#FFF1F2', border: '1px solid #FECDD3' }}>
                    <Flame size={13} style={{ color: '#E11D48' }} />
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#BE123C' }}>{user.currentStreak}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.65rem', borderRadius: '999px', background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                    <Zap size={13} style={{ color: '#6366F1' }} />
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#4338CA' }}>Lv.{user.level}</span>
                  </div>
                </div>

                {/* Friends & Chat Trigger Button */}
                <button
                  onClick={() => setSocialOpen(true)}
                  title="Friends & Social"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    color: '#4F46E5',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
                >
                  <Users size={17} />
                </button>

              {/* User menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: '0.625rem', padding: '0.35rem 0.75rem',
                    cursor: 'pointer', color: '#0F172A', transition: 'all 0.15s ease',
                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#CBD5E1'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.username}</span>
                  <ChevronDown size={14} style={{ color: '#64748B', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
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
                        background: '#FFFFFF', border: '1px solid #E2E8F0',
                        borderRadius: '0.75rem', padding: '0.5rem',
                        minWidth: '170px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                        zIndex: 200,
                      }}
                    >
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', color: '#334155', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.target.style.background = '#EEF2FF'; e.target.style.color = '#4F46E5'; }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#334155'; }}>
                        👤 Profile
                      </Link>
                      <button
                        onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', color: '#E11D48', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FFF1F2'; }}
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

      {/* Incoming Friend Match Invitation Popup */}
      <IncomingInviteModal
        invite={pendingInvite}
        onAccept={handleAcceptInvite}
        onDecline={handleDeclineInvite}
      />

      {/* Friends & Social Drawer */}
      <SocialDrawer
        isOpen={socialOpen}
        onClose={() => setSocialOpen(false)}
        onInviteFriendToGame={(friend) => {
          setSocialOpen(false);
          navigate('/games');
        }}
      />
    </>
  );
}
