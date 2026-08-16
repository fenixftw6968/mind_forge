import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import XPBar from '../../components/XPBar/XPBar';
import { getRankForLevel, getXPForNextLevel, getXPForCurrentLevel } from '../../data/mockUser';
import { Flame, Coins, Trophy, Star, Lock } from 'lucide-react';
import api from '../../utils/api';

const RARITY_COLORS = {
  COMMON:    { color: '#a1a1b5', bg: 'rgba(161,161,181,0.1)', border: 'rgba(161,161,181,0.2)', label: 'Common' },
  UNCOMMON:  { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  label: 'Uncommon' },
  RARE:      { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.2)',   label: 'Rare' },
  EPIC:      { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.2)',  label: 'Epic' },
  LEGENDARY: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  label: 'Legendary' },
};

export default function Profile() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const [achRes, unlockedRes] = await Promise.all([
          api.get('/api/achievements'),
          api.get('/api/achievements/me')
        ]);
        setAchievements(achRes.data);
        setUnlockedAchievements(unlockedRes.data);
      } catch (e) {
        console.error("Failed to load achievements", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (!user) return null;

  const unlockedIds = new Set(unlockedAchievements.map(ua => ua.achievement.achievementKey));
  const rank        = getRankForLevel(user.level);
  const xpCurrent  = user.xp - getXPForCurrentLevel(user.level);
  const xpNext     = getXPForNextLevel(user.level) - getXPForCurrentLevel(user.level);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, #13131f, #0f0f1a)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: rank.color, borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a0a0f', fontSize: '0.9rem' }}>
              {rank.icon}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.3rem' }}>{user.username}</h1>
            <div style={{ display: 'flex', align: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: rank.color, background: `${rank.color}15`, padding: '0.2rem 0.6rem', borderRadius: '999px', border: `1px solid ${rank.color}30` }}>{rank.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#52526a' }}>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <XPBar current={xpCurrent} total={xpNext} level={user.level} />
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', minWidth: '200px' }}>
            {[
              { icon: <Flame size={14} />, value: `${user.currentStreak}d`, label: 'Streak',  color: '#f43f5e' },
              { icon: <Coins size={14} />, value: user.coins, label: 'Coins',   color: '#f59e0b' },
              { icon: <Trophy size={14} />, value: user.gamesCompleted, label: 'Games', color: '#8b5cf6' },
              { icon: <Star size={14} />, value: user.longestStreak + 'd', label: 'Best Streak', color: '#06b6d4' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>{s.icon}</div>
                <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', color: '#52526a' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>🏆 Achievements</h2>
            <span style={{ fontSize: '0.8rem', color: '#52526a' }}>{unlockedIds.size} / {achievements.length} unlocked</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
            {achievements.map((ach, i) => {
              const unlocked = unlockedIds.has(ach.achievementKey);
              const rc = RARITY_COLORS[ach.rarity];
              const unlockedData = unlockedAchievements.find(a => a.achievement.achievementKey === ach.achievementKey);
              return (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    background: unlocked ? '#13131f' : '#0f0f18',
                    border: `1px solid ${unlocked ? rc.border : 'rgba(255,255,255,0.04)'}`,
                    borderRadius: '1rem',
                    padding: '1.1rem',
                    opacity: unlocked ? 1 : 0.5,
                    filter: unlocked ? 'none' : 'grayscale(0.8)',
                    boxShadow: unlocked ? `0 0 15px ${rc.color}10` : 'none',
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {unlocked && <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', borderRadius: '0 1rem 0 100%', background: `${rc.color}12` }} />}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ fontSize: '1.75rem', filter: unlocked ? 'none' : 'grayscale(1)' }}>
                      {unlocked ? ach.emoji : <Lock size={20} color="#52526a" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <span className="font-accent" style={{ fontWeight: 700, color: unlocked ? 'white' : '#52526a', fontSize: '0.9rem' }}>{ach.title}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: unlocked ? '#a1a1b5' : '#52526a', lineHeight: 1.5 }}>{ach.description}</p>
                      <div style={{ display: 'flex', align: 'center', gap: '0.5rem', marginTop: '0.6rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '999px', background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>{rc.label}</span>
                        <span style={{ fontSize: '0.65rem', color: '#f59e0b' }}>+{ach.xpReward} XP</span>
                        {unlocked && unlockedData && (
                          <span style={{ fontSize: '0.65rem', color: '#10b981', marginLeft: 'auto' }}>
                            ✓ {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '2rem', background: '#13131f', border: '1px solid rgba(139,92,246,0.12)', borderRadius: '1.25rem', padding: '1.5rem' }}>
          <h2 className="font-accent" style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>📋 Recent Activity</h2>
          {user.recentActivity?.map((act, i) => (
            <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 0', borderBottom: i < user.recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontSize: '1.25rem' }}>{act.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', color: '#e1e1f0' }}>{act.action}</div>
                <div style={{ fontSize: '0.7rem', color: '#52526a' }}>{new Date(act.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>+{act.xpGained} XP</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
