import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Coins, Trophy, Zap, ArrowRight, BookOpen, Swords, Star, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import XPBar from '../../components/XPBar/XPBar';
import GameCard from '../../components/GameCard/GameCard';
import { getRankForLevel, getXPForNextLevel, getXPForCurrentLevel } from '../../data/mockUser';
import api from '../../utils/api';

function StatCard({ icon, value, label, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: '#13131f',
        border: `1px solid ${color}20`,
        borderRadius: '1rem',
        padding: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}
    >
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: '#52526a', marginTop: '0.2rem' }}>{label}</div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (!user) return null;

  const rank          = getRankForLevel(user.level);
  const xpCurrent     = user.xp - getXPForCurrentLevel(user.level);
  const xpNext        = getXPForNextLevel(user.level) - getXPForCurrentLevel(user.level);
  const featuredGames = games.filter(g => g.isFeatured).slice(0, 3);

  const timeLeft = (() => {
    if (!daily || !daily.expiresAt) return "0h 0m";
    const exp   = new Date(daily.expiresAt);
    const now   = new Date();
    const diff  = exp - now;
    if (diff <= 0) return "0h 0m";
    const h     = Math.floor(diff / 3600000);
    const m     = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  })();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: '#52526a', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'white' }}>
                Welcome back, <span className="gradient-text">{user.username}</span> 👋
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: `${rank.color}12`, border: `1px solid ${rank.color}30`, borderRadius: '0.75rem', padding: '0.6rem 1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{rank.icon}</span>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#52526a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Current Rank</div>
                <div className="font-accent" style={{ fontWeight: 700, color: rank.color, fontSize: '0.95rem' }}>{rank.name}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #13131f, #0f0f1a)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-display" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{user.level}</span>
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Level {user.level}</div>
                <div style={{ color: '#52526a', fontSize: '0.75rem' }}>{user.xp.toLocaleString()} total XP</div>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#a1a1b5' }}>
              {(xpNext - xpCurrent).toLocaleString()} XP to Level {user.level + 1}
            </div>
          </div>
          <XPBar current={xpCurrent} total={xpNext} level={user.level} />
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
          <StatCard icon={<Flame size={18} />}  value={`${user.currentStreak} days`} label="Current Streak"   color="#f43f5e" delay={0.1} />
          <StatCard icon={<Coins size={18} />}  value={user.coins.toLocaleString()}  label="Coins"            color="#f59e0b" delay={0.15} />
          <StatCard icon={<Swords size={18} />} value={user.gamesCompleted}          label="Games Completed"  color="#8b5cf6" delay={0.2} />
          <StatCard icon={<Trophy size={18} />} value={user.mysteriesSolved || 3}   label="Cases Solved"     color="#06b6d4" delay={0.25} />
        </div>

        {/* Daily Challenge + Continue Playing */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {/* Daily Challenge */}
          {daily ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '1.25rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.06 }}>🔥</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Flame size={16} color="#f43f5e" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Daily Challenge</span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(244,63,94,0.1)', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                  <Clock size={10} color="#f43f5e" />
                  <span style={{ fontSize: '0.65rem', color: '#f43f5e', fontWeight: 600 }}>{timeLeft}</span>
                </div>
              </div>
              <h3 className="font-accent" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{daily.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#a1a1b5', marginBottom: '1rem', lineHeight: 1.5 }}>{daily.description}</p>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Star size={13} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>+{daily.xpReward} XP</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Coins size={13} color="#f59e0b" />
                  <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>+{daily.coinReward} Coins</span>
                </div>
              </div>
              <Link to="/daily-challenge" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', fontSize: '0.875rem', padding: '0.65rem', background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)' }}>
                Accept Challenge →
              </Link>
            </motion.div>
          ) : (
            <div style={{ background: '#13131f', borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ color: '#52526a', fontSize: '0.95rem' }}>Loading Daily Challenge...</div>
            </div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.12)', borderRadius: '1.25rem', padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Zap size={16} color="#8b5cf6" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Quick Actions</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Continue Playing',    to: '/games',       icon: '🎮', color: '#8b5cf6' },
                { label: 'Solve a Mystery',     to: '/games/solve-crime', icon: '🔍', color: '#06b6d4' },
                { label: 'View Leaderboard',    to: '/leaderboard', icon: '🏆', color: '#f59e0b' },
                { label: 'Check Achievements',  to: '/profile',     icon: '🎯', color: '#10b981' },
              ].map((item, i) => (
                <Link key={i} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${item.color}10`; e.currentTarget.style.borderColor = `${item.color}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.875rem', color: '#a1a1b5', fontWeight: 500, flex: 1 }}>{item.label}</span>
                  <ArrowRight size={13} color="#52526a" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Featured Games */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>🎮 Featured Games</h2>
            <Link to="/games" style={{ fontSize: '0.8rem', color: '#8b5cf6', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem' }}>
            {featuredGames.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.12)', borderRadius: '1.25rem', padding: '1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BookOpen size={16} color="#a78bfa" />
            <h2 className="font-accent" style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Recent Activity</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {user.recentActivity?.map((act, i) => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 0', borderBottom: i < user.recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                  {act.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', color: '#e1e1f0', fontWeight: 500 }}>{act.action}</div>
                  <div style={{ fontSize: '0.7rem', color: '#52526a', marginTop: '0.15rem' }}>
                    {new Date(act.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={11} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>+{act.xpGained} XP</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
