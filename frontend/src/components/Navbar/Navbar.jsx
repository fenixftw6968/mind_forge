import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Trophy, Flame, Coins, LogOut, Menu, X, ChevronDown, Users, Swords, User } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    { to: '/dashboard',       label: 'Dashboard' },
    { to: '/games',           label: 'Games' },
    { to: '/daily-challenge', label: 'Challenges' },
    { to: '/leaderboard',     label: 'Progress' },
    { to: '/profile',         label: 'Profile' },
  ];

  const isActive = (to) => location.pathname === to;
  const currentRank = getRankFromRating(user?.competitiveRating || 500);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(21, 21, 21, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #282828',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: '64px', justifyContent: 'space-between' }}>
          
          {/* Left: Brand Logo + Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
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

            {/* Desktop Nav Links */}
            {isAuthenticated && (
              <div className="hidden md:flex" style={{ display: 'flex', gap: '0.35rem' }}>
                {navLinks.map(link => {
                  const active = isActive(link.to);
                  return (
                    <Link key={link.to} to={link.to} style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? '#4ADE80' : '#94A3B8',
                      background: active ? '#242424' : 'transparent',
                      border: active ? '1px solid #2E2E2E' : '1px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { if (!active) { e.target.style.color = '#F8FAFC'; e.target.style.background = '#1E1E1E'; }}}
                    onMouseLeave={e => { if (!active) { e.target.style.color = '#94A3B8'; e.target.style.background = 'transparent'; }}}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: User Stats & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.65rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                    <Coins size={13} style={{ color: '#FBBF24' }} />
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#FBBF24' }}>{user.coins}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.65rem', borderRadius: '999px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
                    <Flame size={13} style={{ color: '#FB7185' }} />
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#FB7185' }}>{user.currentStreak}</span>
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
                    background: '#242424',
                    border: '1px solid #2E2E2E',
                    cursor: 'pointer',
                    color: '#4ADE80',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2A2A2A'; e.currentTarget.style.borderColor = '#22C55E'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#242424'; e.currentTarget.style.borderColor = '#2E2E2E'; }}
                >
                  <Users size={16} />
                </button>

                {/* User menu dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.45rem',
                      background: '#242424', border: '1px solid #2E2E2E',
                      borderRadius: '999px', padding: '0.25rem 0.65rem 0.25rem 0.35rem',
                      cursor: 'pointer', color: '#F8FAFC', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#3D3D3D'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2E2E2E'; }}
                  >
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#22C55E', color: '#05200C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700 }}>{user.username}</span>
                    <ChevronDown size={13} style={{ color: '#94A3B8', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                          background: '#222222', border: '1px solid #2E2E2E',
                          borderRadius: '0.75rem', padding: '0.4rem',
                          minWidth: '170px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                          zIndex: 200,
                        }}
                      >
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', color: '#CBD5E1', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.target.style.background = '#2A2A2A'; e.target.style.color = '#4ADE80'; }}
                          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#CBD5E1'; }}>
                          <User size={14} /> Profile
                        </Link>
                        <button
                          onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', color: '#F43F5E', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'; }}
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
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Link to="/login" className="btn-secondary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.85rem' }}>Log In</Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.85rem' }}>Sign Up</Link>
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
        onInviteFriendToGame={() => {
          setSocialOpen(false);
          navigate('/games');
        }}
      />
    </>
  );
}
