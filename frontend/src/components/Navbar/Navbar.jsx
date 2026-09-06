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
      {/* Floating Frosted Pill Nav Header */}
      <header style={{
        position: 'fixed',
        top: '1rem',
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 1rem',
        pointerEvents: 'none'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          background: 'rgba(13, 13, 20, 0.78)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          height: '58px',
          padding: '0 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          pointerEvents: 'auto'
        }}>
          
          {/* Left: Brand Logo + Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.35)'
              }}>
                <Brain size={18} color="#60A5FA" />
              </div>
              <span className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                Algo<span style={{ color: '#60A5FA' }}>Arena</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            {isAuthenticated && (
              <div className="hidden md:flex" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                {navLinks.map(link => {
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        textDecoration: 'none',
                        fontSize: '0.825rem',
                        fontFamily: 'var(--font-body)',
                        fontWeight: active ? 600 : 500,
                        color: active ? '#FFFFFF' : '#94A3B8',
                        background: active ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                        border: active ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid transparent',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => { if (!active) { e.target.style.color = '#F8FAFC'; e.target.style.background = 'rgba(255, 255, 255, 0.05)'; }}}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {isAuthenticated && user ? (
              <>
                {/* Stats pills */}
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  {/* Competitive Rank Pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    background: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    <span style={{ fontSize: '0.8rem' }}>{currentRank.badge}</span>
                    <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA' }}>
                      {user.competitiveRating || 500}
                    </span>
                  </div>

                  {/* Coins Pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)'
                  }}>
                    <Coins size={12} style={{ color: '#FBBF24' }} />
                    <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24' }}>
                      {user.coins}
                    </span>
                  </div>
                  
                  {/* Streak Pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <Flame size={12} style={{ color: '#38BDF8' }} />
                    <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F8FAFC' }}>
                      {user.currentStreak}
                    </span>
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
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: 'pointer',
                    color: '#F8FAFC',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; }}
                >
                  <Users size={14} />
                </button>

                {/* User menu dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '999px',
                      padding: '0.2rem 0.6rem 0.2rem 0.25rem',
                      cursor: 'pointer',
                      color: '#F8FAFC',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      color: '#050507',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.725rem',
                      fontWeight: 800
                    }}>
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.username}</span>
                    <ChevronDown size={12} style={{ color: '#94A3B8', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 10px)',
                          right: 0,
                          background: 'rgba(13, 13, 20, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '0.75rem',
                          padding: '0.4rem',
                          minWidth: '160px',
                          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
                          zIndex: 200,
                        }}
                      >
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            color: '#CBD5E1',
                            textDecoration: 'none',
                            fontSize: '0.825rem',
                            fontWeight: 500,
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => { e.target.style.background = 'rgba(255, 255, 255, 0.08)'; e.target.style.color = '#FFFFFF'; }}
                          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#CBD5E1'; }}
                        >
                          <User size={13} /> Profile
                        </Link>
                        <button
                          onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            color: '#f87171',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.825rem',
                            fontWeight: 500,
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <LogOut size={13} /> Log Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <Link
                  to="/login"
                  style={{
                    padding: '0.4rem 1.05rem',
                    borderRadius: '9999px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: '#F8FAFC',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(59, 130, 246, 0.12)'; e.target.style.borderColor = 'rgba(59, 130, 246, 0.35)'; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'; }}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="pill-btn-blue"
                  style={{
                    padding: '0.4rem 1.25rem',
                    fontSize: '0.825rem'
                  }}
                >
                  Explore AlgoArena
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

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
