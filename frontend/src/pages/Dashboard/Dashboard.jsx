import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  Trophy,
  User,
  Settings,
  Flame,
  Coins,
  Clock,
  Sparkles,
  ChevronRight,
  Target,
  KeyRound,
  Shield,
  Star,
  Zap,
  Award,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GameCard from '../../components/GameCard/GameCard';
import RankCard from '../../components/RankCard/RankCard';
import { getRankForLevel, getXPForNextLevel, getXPForCurrentLevel } from '../../data/mockUser';
import api from '../../utils/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [gamesRes, dailyRes] = await Promise.all([
          api.get('/api/games'),
          api.get('/api/games/daily')
        ]);
        setGames(gamesRes.data);
        setDaily(dailyRes.data);
      } catch (e) {
        console.warn("Failed to load dashboard data from API, falling back to mock data", e);
        const { mockGames, mockDailyChallenge } = await import('../../data/mockGames');
        setGames(mockGames);
        setDaily(mockDailyChallenge);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (!user) return null;

  const rank = getRankForLevel(user.level);
  const xpCurrent = user.xp - getXPForCurrentLevel(user.level);
  const xpNext = getXPForNextLevel(user.level) - getXPForCurrentLevel(user.level);
  const progressPercent = Math.min(100, Math.max(5, (xpCurrent / Math.max(1, xpNext)) * 100));

  // 6 Primary featured games for the 2x3 grid
  const displayedGames = games.slice(0, 6);

  const timeLeft = (() => {
    if (!daily || !daily.expiresAt) return "14h 41m";
    const exp = new Date(daily.expiresAt);
    const now = new Date();
    const diff = exp - now;
    if (diff <= 0) return "14h 41m";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  })();

  const sidebarLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/games',     label: 'Games',     icon: Gamepad2 },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/profile',   label: 'Profile',   icon: User },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex' }}>
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: '230px',
          background: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 1rem',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40
        }}
        className="dashboard-sidebar"
      >
        <div>
          {/* Brand Logo Header */}
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 0.5rem', marginBottom: '2.5rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
            }}>
              <span style={{ fontSize: '1.25rem' }}>🧠</span>
            </div>
            <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Mind<span style={{ color: '#4F46E5' }}>Forge</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '0.625rem',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#4F46E5' : '#64748B',
                    background: active ? '#EEF2FF' : 'transparent',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.color = '#0F172A';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748B';
                    }
                  }}
                >
                  <Icon size={18} color={active ? '#4F46E5' : '#64748B'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Settings Link */}
        <div>
          <Link
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.85rem',
              borderRadius: '0.625rem',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#64748B',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ flex: 1, marginLeft: '230px', minWidth: 0 }} className="dashboard-main-content">
        
        {/* Top Sticky Header */}
        <header style={{
          height: '64px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.25rem',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          {/* Header Horizontal Tabs */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/games',     label: 'Games' },
              { to: '/leaderboard', label: 'Leaderboard' },
              { to: '/profile',   label: 'Profile' },
            ].map(item => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#4F46E5' : '#64748B',
                    position: 'relative',
                    padding: '0.4rem 0',
                    transition: 'color 0.15s ease'
                  }}
                >
                  {item.label}
                  {active && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-14px',
                      left: 0,
                      right: 0,
                      height: '2.5px',
                      background: '#4F46E5',
                      borderRadius: '999px'
                    }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Stat Badges & Profile Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Coins Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800 }}>$</div>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>{user.coins}</span>
            </div>

            {/* Streak Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Flame size={14} color="#E11D48" fill="#E11D48" />
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>{user.currentStreak}</span>
            </div>

            {/* Level Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Zap size={14} color="#4F46E5" fill="#4F46E5" />
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>Lv. {user.level}</span>
            </div>

            {/* User Avatar & Name Button */}
            <div style={{ position: 'relative', marginLeft: '0.25rem' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '999px',
                  padding: '0.25rem 0.65rem 0.25rem 0.35rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#4F46E5', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>{user.username}</span>
                <ChevronDown size={14} color="#94A3B8" />
              </button>

              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.75rem',
                    padding: '0.5rem',
                    minWidth: '160px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    zIndex: 100
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', color: '#334155', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); navigate('/'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', color: '#E11D48', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body Container */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2.25rem 3rem' }}>
          
          {/* Welcome Banner Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#64748B', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                {currentDateFormatted}
              </div>
              <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Welcome back, <span style={{ color: '#4F46E5' }}>{user.username}</span> 👋
              </h1>
            </div>

            {/* Current Rank Pill Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '0.75rem',
              padding: '0.55rem 1.15rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <Trophy size={18} color="#4F46E5" />
              <div>
                <div style={{ fontSize: '0.625rem', color: '#94A3B8', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  CURRENT RANK
                </div>
                <div className="font-accent" style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.925rem' }}>
                  {rank.name}
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress & Competitive Rank (Side by Side) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
            gap: '1.25rem',
            marginBottom: '1.5rem'
          }}
          className="dashboard-two-col"
          >
            {/* Account Level Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1.25rem',
              padding: '1.5rem 1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-display)',
                      boxShadow: '0 2px 6px rgba(99, 102, 241, 0.25)'
                    }}>
                      {user.level}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                        Account Level {user.level}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                        {rank.name} • {user.xp.toLocaleString()} Total XP
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                    {(xpNext - xpCurrent).toLocaleString()} XP to Lv.{user.level + 1}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ height: '100%', background: '#4F46E5', borderRadius: '999px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>⭐ XP gains from Practice, Daily & Case Solving</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>
                  <strong style={{ color: '#4F46E5' }}>{xpCurrent}</strong> / {xpNext} XP
                </span>
              </div>
            </div>

            {/* Competitive Rank Card */}
            <RankCard
              rating={user.competitiveRating || 500}
              matchesPlayed={user.matchesPlayed || 0}
              matchesWon={user.matchesWon || 0}
            />
          </div>

          {/* 4 Statistics Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
          className="dashboard-stats-grid"
          >
            {/* 1. Day Streak */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1rem',
              padding: '1.35rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <span style={{ fontSize: '1.85rem' }}>🔥</span>
              <div>
                <div className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {user.currentStreak}
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 600, marginTop: '0.2rem' }}>
                  Day Streak
                </div>
              </div>
            </div>

            {/* 2. Coins */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1rem',
              padding: '1.35rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <span style={{ fontSize: '1.85rem' }}>🪙</span>
              <div>
                <div className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {user.coins}
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 600, marginTop: '0.2rem' }}>
                  Coins
                </div>
              </div>
            </div>

            {/* 3. Games Completed */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1rem',
              padding: '1.35rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <Gamepad2 size={32} color="#4F46E5" />
              <div>
                <div className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {user.gamesCompleted || 1}
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 600, marginTop: '0.2rem' }}>
                  Games Completed
                </div>
              </div>
            </div>

            {/* 4. Cases Solved */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1rem',
              padding: '1.35rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <Trophy size={32} color="#4F46E5" />
              <div>
                <div className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {user.mysteriesSolved || 3}
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 600, marginTop: '0.2rem' }}>
                  Cases Solved
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column Section: Daily Challenge (Left) & Quick Actions (Right) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}
          className="dashboard-two-col"
          >
            {/* Daily Challenge Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1rem',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>📅</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                      Daily Challenge
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#EEF2FF',
                    border: '1px solid #C7D2FE',
                    borderRadius: '6px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#4F46E5'
                  }}>
                    <Clock size={12} color="#4F46E5" />
                    <span>{timeLeft}</span>
                  </div>
                </div>

                <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {daily?.title || "The Paradox Sequence"}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.55, marginBottom: '1.25rem', fontWeight: 500 }}>
                  {daily?.description || "A master-level number sequence that has stumped 80% of players. Do you have what it takes?"}
                </p>

                {/* Reward Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Star size={15} color="#D97706" fill="#D97706" />
                    <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                      +{daily?.xpReward || 100} XP
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 800 }}>$</div>
                    <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                      +{daily?.coinReward || 50} Coins
                    </span>
                  </div>
                </div>
              </div>

              {/* Prominent Blue Action Button */}
              <Link
                to="/daily-challenge"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: '#4F46E5',
                  color: '#FFFFFF',
                  padding: '0.8rem 1.25rem',
                  borderRadius: '0.625rem',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#4338CA'}
                onMouseLeave={e => e.currentTarget.style.background = '#4F46E5'}
              >
                Accept Challenge →
              </Link>
            </div>

            {/* Quick Actions Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1rem',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Zap size={16} color="#4F46E5" fill="#4F46E5" />
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Quick Actions
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { label: 'Continue Playing',   to: '/games',             icon: Gamepad2 },
                  { label: 'Crack a Code',       to: '/games/code-breaker', icon: KeyRound },
                  { label: 'View Leaderboard',   to: '/leaderboard',       icon: Trophy },
                  { label: 'Check Achievements', to: '/profile',           icon: Target },
                ].map((action, idx) => {
                  const IconComponent = action.icon;
                  return (
                    <Link
                      key={idx}
                      to={action.to}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: '0.625rem',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.borderColor = '#C7D2FE';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <IconComponent size={16} color="#4F46E5" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                          {action.label}
                        </span>
                      </div>
                      <ChevronRight size={16} color="#94A3B8" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Featured Games Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gamepad2 size={18} color="#4F46E5" />
                <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                  Featured Games
                </h2>
              </div>
              <Link to="/games" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4F46E5', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {/* 3 Columns x 2 Rows Grid of Compact Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.25rem'
            }}
            className="dashboard-games-grid"
            >
              {displayedGames.map((game, i) => (
                <GameCard key={game.id || game.slug} game={game} index={i} isDashboardFeatured={false} />
              ))}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .dashboard-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .dashboard-games-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .dashboard-sidebar {
            display: none !important;
          }
          .dashboard-main-content {
            margin-left: 0 !important;
          }
          .dashboard-two-col {
            grid-template-columns: 1fr !important;
          }
          .dashboard-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-games-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
