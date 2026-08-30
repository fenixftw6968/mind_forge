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
  LogOut,
  ChevronDown,
  Brain,
  Users,
  Swords,
  UserPlus,
  Check,
  Code2,
  Puzzle,
  Hash,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GameCard from '../../components/GameCard/GameCard';
import RankCard from '../../components/RankCard/RankCard';
import SocialDrawer from '../../components/SocialDrawer/SocialDrawer';
import { getRankForLevel, getXPForNextLevel, getXPForCurrentLevel } from '../../data/mockUser';
import { getDailyCountdown, subscribeToMidnightIST } from '../../services/dailyQuestionService';
import api from '../../utils/api';

const SLUG_ICONS = {
  'dsa-master-quiz': Code2,
  'logic-puzzle': Puzzle,
  'brain-teaser-battle': Sparkles,
  'number-detective': Hash,
  'memory-challenge': Eye,
  'code-breaker': KeyRound,
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [daily, setDaily] = useState(null);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [requestedUserIds, setRequestedUserIds] = useState(new Set());
  const [sendingRequestId, setSendingRequestId] = useState(null);

  const DEFAULT_RECOMMENDED_PLAYERS = [
    { userId: 101, username: 'Alex_Algorithms', level: 6, competitiveRating: 540, competitiveRank: 'Thinker', isOnline: true },
    { userId: 102, username: 'Priya_Logic',      level: 7, competitiveRating: 620, competitiveRank: 'Guardian', isOnline: true },
    { userId: 103, username: 'Vikram_Byte',      level: 5, competitiveRating: 480, competitiveRank: 'Thinker', isOnline: false },
    { userId: 104, username: 'CodeNinja_99',    level: 8, competitiveRating: 710, competitiveRank: 'Master', isOnline: true }
  ];

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
        console.warn("Failed to load games/daily from API, falling back to mock data", e);
        const { mockGames, mockDailyChallenge } = await import('../../data/mockGames');
        setGames(mockGames);
        setDaily(mockDailyChallenge);
      } finally {
        setLoading(false);
      }

      // Fetch recommended players
      try {
        const recsRes = await api.get('/api/friends/recommendations?limit=4');
        if (Array.isArray(recsRes.data) && recsRes.data.length > 0) {
          setRecommendedUsers(recsRes.data);
        } else {
          setRecommendedUsers(DEFAULT_RECOMMENDED_PLAYERS);
        }
      } catch (err) {
        console.warn("Could not fetch recommendations, using defaults", err);
        setRecommendedUsers(DEFAULT_RECOMMENDED_PLAYERS);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSendFriendRequest = async (targetUser) => {
    if (!targetUser?.username || requestedUserIds.has(targetUser.userId)) return;
    try {
      setSendingRequestId(targetUser.userId);
      await api.post('/api/friends/request', { username: targetUser.username });
      setRequestedUserIds(prev => new Set([...prev, targetUser.userId]));
    } catch (e) {
      setRequestedUserIds(prev => new Set([...prev, targetUser.userId]));
    } finally {
      setSendingRequestId(null);
    }
  };

  if (!user) return null;

  const rank = getRankForLevel(user.level);
  const xpCurrent = user.xp - getXPForCurrentLevel(user.level);
  const xpNext = getXPForNextLevel(user.level) - getXPForCurrentLevel(user.level);
  const progressPercent = Math.min(100, Math.max(5, (xpCurrent / Math.max(1, xpNext)) * 100));

  const sidebarNavItems = [
    { to: '/dashboard',       label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/games',           label: 'Games',       icon: Gamepad2 },
    { to: '/daily-challenge', label: 'Challenges',  icon: Target },
    { to: '/leaderboard',     label: 'Progress',    icon: Trophy },
  ];

  const [timeLeft, setTimeLeft] = useState(() => getDailyCountdown().formatted);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getDailyCountdown().formatted);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#151515', display: 'flex', color: '#F8FAFC' }}>
      <aside
        style={{
          width: '260px',
          background: '#1C1C1C',
          borderRight: '1px solid #2E2E2E',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.75rem 1.25rem',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40
        }}
        className="dashboard-sidebar"
      >
        <div>
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem', marginBottom: '2.5rem' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: '#242424',
              border: '1px solid #383838',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(34, 197, 94, 0.15)',
            }}>
              <Brain size={22} color="#22C55E" />
            </div>
            <div>
              <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                MindForge
              </span>
              <span style={{ fontSize: '0.675rem', color: '#4ADE80', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Competitive Arena
              </span>
            </div>
          </Link>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.7rem 0.95rem',
                    borderRadius: '0.625rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#4ADE80' : '#94A3B8',
                    background: isActive ? '#242424' : 'transparent',
                    borderLeft: isActive ? '3px solid #22C55E' : '3px solid transparent',
                    borderTop: isActive ? '1px solid #2E2E2E' : '1px solid transparent',
                    borderRight: isActive ? '1px solid #2E2E2E' : '1px solid transparent',
                    borderBottom: isActive ? '1px solid #2E2E2E' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#22C55E' : '#64748B'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ borderTop: '1px solid #2E2E2E', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <Link
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: location.pathname === '/profile' ? '#4ADE80' : '#94A3B8',
              background: location.pathname === '/profile' ? '#242424' : 'transparent'
            }}
          >
            <Settings size={18} color={location.pathname === '/profile' ? '#22C55E' : '#64748B'} />
            <span>Profile & Settings</span>
          </Link>

          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '0.5rem',
              background: 'transparent',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#F43F5E',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: '260px', minWidth: 0 }} className="dashboard-main-content">
        <header style={{
          height: '64px',
          background: 'rgba(21, 21, 21, 0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #242424',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>Dashboard Overview</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: '#242424', border: '1px solid #2E2E2E', borderRadius: '999px',
                  padding: '0.25rem 0.75rem 0.25rem 0.35rem', cursor: 'pointer'
                }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#22C55E', color: '#05200C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#F8FAFC' }}>{user.username}</span>
                <ChevronDown size={13} color="#94A3B8" />
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '180px',
                  background: '#1C1C1C', border: '1px solid #2E2E2E', borderRadius: '0.75rem', padding: '0.5rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)', zIndex: 100
                }}>
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', color: '#F8FAFC', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                    <User size={14} color="#94A3B8" /> Profile
                  </Link>
                  <button onClick={() => { setUserMenuOpen(false); logout(); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.5rem', color: '#F43F5E', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 2.5rem 4rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{currentDateFormatted}</div>
              <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                Welcome back, <span style={{ color: '#22C55E' }}>{user.username}</span>
              </h1>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.15rem', marginBottom: '1.5rem' }} className="dashboard-stats-grid">
            <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '0.875rem', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={22} color="#FB7185" />
              </div>
              <div>
                <div className="font-display" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>{user.currentStreak}d</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, marginTop: '0.15rem' }}>Daily Streak</div>
              </div>
            </div>
            <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '0.875rem', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Coins size={22} color="#FBBF24" />
              </div>
              <div>
                <div className="font-display" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>{user.coins}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, marginTop: '0.15rem' }}>Coins Balance</div>
              </div>
            </div>
            <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '0.875rem', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Swords size={20} color="#38BDF8" />
              </div>
              <div>
                <div className="font-display" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>{user.competitiveRating || 500}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, marginTop: '0.15rem' }}>Rating Elo</div>
              </div>
            </div>
            <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '0.875rem', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gamepad2 size={22} color="#22C55E" />
              </div>
              <div>
                <div className="font-display" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>{user.gamesCompleted || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, marginTop: '0.15rem' }}>Games Solved</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.85fr)', gap: '1.25rem', marginBottom: '1.75rem' }} className="dashboard-two-col">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '1.15rem', padding: '1.5rem 1.65rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>📅</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Daily Focus Mission</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '6px', padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700, color: '#4ADE80' }}>
                    <Clock size={12} color="#4ADE80" />
                    <span>{timeLeft}</span>
                  </div>
                </div>
                <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem' }}>{daily?.title || "DSA Master Complexity"}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '1.25rem' }}>{daily?.description || "Test your cognitive reasoning and complexity analysis on today's curated challenge."}</p>
                <Link to="/daily-challenge" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0.8rem 1.25rem', background: '#22C55E', color: '#05200C', borderRadius: '0.625rem', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>Accept Mission →</Link>
              </div>

              <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '1.15rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Gamepad2 size={18} color="#22C55E" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>Quick Play Arena</span>
                  </div>
                  <Link to="/games" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ADE80', textDecoration: 'none' }}>View All →</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {games.slice(0, 6).map((game) => {
                    const IconComp = SLUG_ICONS[game.slug] || Gamepad2;
                    return (
                      <Link key={game.slug} to={`/games/${game.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1rem', borderRadius: '0.75rem', background: '#1C1C1C', border: '1px solid #2E2E2E', textDecoration: 'none' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconComp size={18} color="#4ADE80" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.title}</div>
                          <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>{game.category}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 3. Recent 1v1 Battle Activity & Weekly Streak Tracker */}
              <div style={{
                background: '#242424',
                border: '1px solid #2E2E2E',
                borderRadius: '1.15rem',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Swords size={16} color="#38BDF8" />
                    <span style={{ fontSize: '0.925rem', fontWeight: 800, color: '#F8FAFC' }}>
                      Recent Arena Activity & Streaks
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#4ADE80', fontWeight: 700 }}>
                    <span>🔥 {user.currentStreak} Day Streak</span>
                  </div>
                </div>

                {/* 7-Day Weekly Streak Dots */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#1C1C1C',
                  border: '1px solid #2E2E2E',
                  borderRadius: '0.75rem',
                  padding: '0.85rem 1.25rem',
                  marginBottom: '1rem'
                }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dIdx) => {
                    const isToday = dIdx === (new Date().getDay() + 6) % 7;
                    const isCompleted = dIdx <= (new Date().getDay() + 6) % 7;
                    return (
                      <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: isCompleted ? 'rgba(34, 197, 94, 0.15)' : '#242424',
                          border: `1.5px solid ${isToday ? '#22C55E' : isCompleted ? 'rgba(34, 197, 94, 0.4)' : '#333333'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isCompleted ? '#4ADE80' : '#64748B',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          boxShadow: isToday ? '0 0 8px rgba(34, 197, 94, 0.35)' : 'none'
                        }}>
                          {isCompleted ? '✓' : '•'}
                        </div>
                        <span style={{ fontSize: '0.675rem', color: isToday ? '#4ADE80' : '#64748B', fontWeight: isToday ? 700 : 500 }}>
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Match Snippets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {[
                    { game: 'DSA Master Quiz', mode: '1v1 Ranked', result: 'VICTORY', rating: '+24 Elo', time: '2h ago' },
                    { game: 'Brain Teaser Battle', mode: 'Friend Match', result: 'VICTORY', rating: '+18 Elo', time: '5h ago' },
                    { game: 'Logic Puzzle', mode: '1v1 Ranked', result: 'DEFEAT', rating: '-12 Elo', time: '1d ago' },
                  ].map((item, mIdx) => (
                    <div
                      key={mIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '0.5rem',
                        background: '#1C1C1C',
                        border: '1px solid #2E2E2E'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: item.result === 'VICTORY' ? '#22C55E' : '#FB7185'
                        }} />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#F8FAFC' }}>{item.game}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{item.mode} • {item.time}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: item.result === 'VICTORY' ? '#4ADE80' : '#FB7185'
                        }}>
                          {item.rating}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>{item.result}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '1.15rem', padding: '1.5rem 1.65rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#1A1A1A', border: '1px solid #333333', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800 }}>{user.level}</div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC' }}>Account Level {user.level}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>{rank.name} • {user.xp.toLocaleString()} XP</div>
                    </div>
                  </div>
                </div>
                <div style={{ height: '7px', background: '#1A1A1A', borderRadius: '999px', overflow: 'hidden', border: '1px solid #2E2E2E', marginBottom: '0.85rem' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #22C55E)', borderRadius: '999px' }} />
                </div>
              </div>

              <RankCard rating={user.competitiveRating || 500} matchesPlayed={user.matchesPlayed || 0} matchesWon={user.matchesWon || 0} />

              <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '1.15rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
                  <Zap size={16} color="#4ADE80" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cognitive Breakdown</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { label: 'Programming & DSA', acc: 85, color: '#22C55E' },
                    { label: 'Reasoning & Sequences', acc: 78, color: '#38BDF8' },
                    { label: 'Brain Training & Aptitude', acc: 72, color: '#FBBF24' },
                    { label: 'Visual Memory & Recall', acc: 80, color: '#A855F7' }
                  ].map((skill, sIdx) => (
                    <div key={sIdx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                        <span>{skill.label}</span>
                        <span style={{ color: skill.color, fontWeight: 700 }}>{skill.acc}% Acc</span>
                      </div>
                      <div style={{ height: '5px', background: '#1A1A1A', borderRadius: '999px', overflow: 'hidden', border: '1px solid #2E2E2E' }}>
                        <div style={{ width: `${skill.acc}%`, height: '100%', background: skill.color, borderRadius: '999px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#242424',
            border: '1px solid #2E2E2E',
            borderRadius: '1.15rem',
            padding: '1.65rem 1.75rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
            marginTop: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserPlus size={18} color="#4ADE80" />
                </div>
                <div>
                  <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>
                    Recommended Challengers & Players
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: '#94A3B8' }}>
                    Send friend requests or challenge competitive minds in your rating bracket
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSocialOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '0.5rem',
                  background: '#1C1C1C',
                  border: '1px solid #2E2E2E',
                  color: '#4ADE80',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Users size={14} /> Open Friends Hub
              </button>
            </div>

            {/* Grid of Recommended Users */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem'
            }}
            className="dashboard-recs-grid"
            >
              {recommendedUsers.map((recUser) => {
                const isRequested = requestedUserIds.has(recUser.userId);
                const isSending = sendingRequestId === recUser.userId;

                return (
                  <div
                    key={recUser.userId}
                    style={{
                      background: '#1C1C1C',
                      border: '1px solid #2E2E2E',
                      borderRadius: '0.875rem',
                      padding: '1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.95rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#383838'; e.currentTarget.style.background = '#222222'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2E2E2E'; e.currentTarget.style.background = '#1C1C1C'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* Avatar */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#242424',
                        border: '1px solid #383838',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: '#4ADE80',
                        flexShrink: 0
                      }}>
                        {recUser.username?.[0]?.toUpperCase() || 'U'}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {recUser.username}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
                          <span style={{ color: '#38BDF8', fontWeight: 700 }}>{recUser.competitiveRating || 500} Elo</span>
                          <span>•</span>
                          <span>Lv.{recUser.level || 1}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleSendFriendRequest(recUser)}
                        disabled={isRequested || isSending}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          padding: '0.55rem 0.65rem',
                          borderRadius: '0.5rem',
                          background: isRequested ? 'rgba(34, 197, 94, 0.15)' : '#242424',
                          border: `1px solid ${isRequested ? '#22C55E' : '#2E2E2E'}`,
                          color: isRequested ? '#4ADE80' : '#F8FAFC',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          cursor: isRequested ? 'default' : 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isRequested ? (
                          <>
                            <Check size={13} color="#4ADE80" /> Sent
                          </>
                        ) : isSending ? (
                          '...'
                        ) : (
                          <>
                            <UserPlus size={13} /> Add Friend
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSocialOpen(true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.55rem 0.65rem',
                          borderRadius: '0.5rem',
                          background: '#242424',
                          border: '1px solid #2E2E2E',
                          color: '#38BDF8',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        title="1v1 Battle"
                      >
                        <Swords size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <SocialDrawer isOpen={socialOpen} onClose={() => setSocialOpen(false)} onInviteFriendToGame={() => { setSocialOpen(false); navigate('/games'); }} />

      <style>{`
        @media (max-width: 1180px) { .dashboard-recs-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 1080px) { .dashboard-stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .dashboard-two-col { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .dashboard-sidebar { display: none !important; } .dashboard-main-content { margin-left: 0 !important; } .dashboard-stats-grid { grid-template-columns: 1fr !important; } .dashboard-recs-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
