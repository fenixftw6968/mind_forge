import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Flame,
  Coins,
  Clock,
  Sparkles,
  KeyRound,
  Zap,
  Users,
  Swords,
  UserPlus,
  Check,
  Code2,
  Puzzle,
  Hash,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [daily, setDaily] = useState(null);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
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

  const [timeLeft, setTimeLeft] = useState(() => getDailyCountdown().formatted);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getDailyCountdown().formatted);
    }, 1000);
    const unsubscribe = subscribeToMidnightIST(() => {
      // Auto-refresh daily challenge on IST midnight
      api.get('/api/games/daily').then(res => setDaily(res.data)).catch(() => {});
    });
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleSendFriendRequest = async (targetUser) => {
    if (!targetUser?.userId || requestedUserIds.has(targetUser.userId)) return;
    setSendingRequestId(targetUser.userId);
    try {
      await api.post('/api/friends/requests', { receiverId: targetUser.userId });
      setRequestedUserIds(prev => new Set([...prev, targetUser.userId]));
    } catch (e) {
      console.warn("Could not send friend request", e);
      setRequestedUserIds(prev => new Set([...prev, targetUser.userId]));
    } finally {
      setSendingRequestId(null);
    }
  };

  if (!user) return null;

  const userLevel = user.level || 1;
  const userXP = user.xp || 0;
  const rank = getRankForLevel(userLevel);
  const xpCurrent = getXPForCurrentLevel(userLevel);
  const xpNext = getXPForNextLevel(userLevel);
  const progressPercent = Math.min(100, Math.max(0, ((userXP - xpCurrent) / (xpNext - xpCurrent)) * 100));

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      paddingTop: '6rem',
      color: '#F8FAFC',
      position: 'relative'
    }}>
      {/* Background Starfield & Texture */}
      <div className="star-field" />
      <div className="binary-texture" />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {currentDateFormatted}
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Welcome back, <span style={{ color: '#60A5FA' }}>{user.username}</span>
          </h1>
        </motion.div>

        {/* Quick Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.15rem', marginBottom: '1.75rem' }} className="dashboard-stats-grid">
          <div className="stat-pod" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={20} color="#38BDF8" />
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>{user.currentStreak || 0}d</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500, marginTop: '0.15rem' }}>Daily Streak</div>
            </div>
          </div>

          <div className="stat-pod" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coins size={20} color="#FBBF24" />
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>{user.coins || 0}</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500, marginTop: '0.15rem' }}>Coins Balance</div>
            </div>
          </div>

          <div className="stat-pod" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Swords size={18} color="#60A5FA" />
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>{user.competitiveRating || 500}</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500, marginTop: '0.15rem' }}>Rating Elo</div>
            </div>
          </div>

          <div className="stat-pod" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gamepad2 size={20} color="#34D399" />
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>{user.gamesCompleted || 0}</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500, marginTop: '0.15rem' }}>Games Solved</div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Daily Focus + Quick Play & Rank Status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.85fr)', gap: '1.25rem', marginBottom: '1.75rem' }} className="dashboard-two-col">
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Daily Challenge Card */}
            <div style={{
              background: 'rgba(8, 14, 33, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.15rem',
              padding: '1.75rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    // DAILY MISSION
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA' }}>
                  <Clock size={12} color="#60A5FA" />
                  <span className="font-mono">{timeLeft}</span>
                </div>
              </div>

              <h3 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.4rem' }}>
                {daily?.title || "The Arithmetic Equipment Puzzle"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {daily?.description || "A classic cognitive reflection test testing your immediate mathematical deduction."}
              </p>

              <Link
                to="/daily-challenge"
                className="pill-btn-blue"
                style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
              >
                Accept Mission <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick Play Arena */}
            <div style={{
              background: 'rgba(8, 14, 33, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.15rem',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Gamepad2 size={18} color="#60A5FA" />
                  <span className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>
                    Quick Arenas
                  </span>
                </div>
                <Link to="/games" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA', textDecoration: 'none' }}>
                  View All &rarr;
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {games.slice(0, 6).map((game) => {
                  const IconComp = SLUG_ICONS[game.slug] || Gamepad2;
                  return (
                    <Link
                      key={game.slug}
                      to={`/games/${game.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'; e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
                    >
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconComp size={16} color="#60A5FA" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="font-display" style={{ fontSize: '0.825rem', fontWeight: 600, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{game.category}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Account Level & XP Card */}
            <div style={{
              background: 'rgba(8, 14, 33, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.15rem',
              padding: '1.5rem 1.65rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#60A5FA',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)'
                  }}>
                    {userLevel}
                  </div>
                  <div>
                    <div className="font-display" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }}>
                      Account Level {userLevel}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>
                      {rank.name} • {userXP.toLocaleString()} XP
                    </div>
                  </div>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div style={{
                height: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '999px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '0.5rem'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #2563eb, #3b82f6, #38bdf8)', borderRadius: '999px', boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)' }}
                />
              </div>
            </div>

            {/* Competitive Rank Card */}
            <RankCard rating={user.competitiveRating || 500} matchesPlayed={user.matchesPlayed || 0} matchesWon={user.matchesWon || 0} />

            {/* Cognitive Breakdown Pod */}
            <div style={{
              background: 'rgba(8, 14, 33, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.15rem',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
                <Zap size={16} color="#38BDF8" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Cognitive Breakdown
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { label: 'Programming & DSA', acc: 85, color: '#3B82F6' },
                  { label: 'Reasoning & Sequences', acc: 78, color: '#38BDF8' },
                  { label: 'Brain Training & Aptitude', acc: 72, color: '#60A5FA' },
                  { label: 'Visual Memory & Recall', acc: 80, color: '#818CF8' }
                ].map((skill, sIdx) => (
                  <div key={sIdx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      <span>{skill.label}</span>
                      <span className="font-mono" style={{ color: skill.color, fontWeight: 700 }}>{skill.acc}% Acc</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ width: `${skill.acc}%`, height: '100%', background: skill.color, borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Players / Social */}
        <div style={{
          background: 'rgba(8, 14, 33, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.15rem',
          padding: '1.65rem 1.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
          marginTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <UserPlus size={18} color="#60A5FA" />
              </div>
              <div>
                <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
                  Active Challengers
                </h3>
                <p style={{ fontSize: '0.775rem', color: '#94A3B8' }}>
                  Challenge competitive minds in your rating bracket
                </p>
              </div>
            </div>

            <button
              onClick={() => setSocialOpen(true)}
              className="pill-btn-ghost"
              style={{ padding: '0.4rem 1.15rem', fontSize: '0.8rem' }}
            >
              <Users size={14} /> Open Friends Hub
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            {recommendedUsers.map((recUser) => {
              const isRequested = requestedUserIds.has(recUser.userId);
              const isSending = sendingRequestId === recUser.userId;
              return (
                <div
                  key={recUser.userId}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: '#3B82F6', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.8rem'
                    }}>
                      {recUser.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-display" style={{ fontSize: '0.825rem', fontWeight: 600, color: '#F8FAFC' }}>
                        {recUser.username}
                      </div>
                      <div className="font-mono" style={{ fontSize: '0.7rem', color: '#60A5FA' }}>
                        {recUser.competitiveRating || 500} Elo
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendFriendRequest(recUser)}
                    disabled={isRequested || isSending}
                    className="pill-btn-ghost"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    {isRequested ? <Check size={12} /> : isSending ? '...' : <UserPlus size={12} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Social Drawer */}
      <SocialDrawer
        isOpen={socialOpen}
        onClose={() => setSocialOpen(false)}
        onInviteFriendToGame={() => {
          setSocialOpen(false);
          navigate('/games');
        }}
      />
    </div>
  );
}
