import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import XPBar from '../../components/XPBar/XPBar';
import RankCard from '../../components/RankCard/RankCard';
import { getRankForLevel, getXPForNextLevel, getXPForCurrentLevel } from '../../data/mockUser';
import { getRankFromRating } from '../../utils/rankUtils';
import { Flame, Coins, Trophy, Star, Lock, Swords, Clock } from 'lucide-react';
import api from '../../utils/api';

const RARITY_COLORS = {
  COMMON:    { color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0', label: 'Common' },
  UNCOMMON:  { color: '#059669', bg: '#ECFDF5',  border: '#A7F3D0',  label: 'Uncommon' },
  RARE:      { color: '#0284C7', bg: '#F0F9FF',   border: '#BAE6FD',   label: 'Rare' },
  EPIC:      { color: '#6366F1', bg: '#EEF2FF',  border: '#C7D2FE',  label: 'Epic' },
  LEGENDARY: { color: '#D97706', bg: '#FFFBEB',  border: '#FDE68A',  label: 'Legendary' },
};

export default function Profile() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievementsAndMatches = async () => {
      try {
        const [achRes, unlockedRes, matchesRes] = await Promise.all([
          api.get('/api/achievements').catch(() => ({ data: [] })),
          api.get('/api/achievements/me').catch(() => ({ data: [] })),
          api.get('/api/matches/recent').catch(() => ({ data: [] }))
        ]);
        setAchievements(achRes.data || []);
        setUnlockedAchievements(unlockedRes.data || []);
        setRecentMatches(matchesRes.data || []);
      } catch (e) {
        console.error("Failed to load profile data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievementsAndMatches();
  }, []);

  if (!user) return null;

  const unlockedIds = new Set(unlockedAchievements.map(ua => ua.achievement?.achievementKey));
  const rank        = getRankForLevel(user.level);
  const xpCurrent  = user.xp - getXPForCurrentLevel(user.level);
  const xpNext     = getXPForNextLevel(user.level) - getXPForCurrentLevel(user.level);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '2rem', marginBottom: '2rem', display: 'flex', gap: '1.75rem', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)' }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#FFFFFF', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #E2E8F0', fontSize: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {rank.icon}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>{user.username}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', background: '#EEF2FF', padding: '0.2rem 0.65rem', borderRadius: '999px', border: '1px solid #C7D2FE' }}>{rank.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <XPBar current={xpCurrent} total={xpNext} level={user.level} />
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', minWidth: '220px' }}>
            {[
              { icon: <Flame size={15} />, value: `${user.currentStreak || 0}d`, label: 'Streak',  color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3' },
              { icon: <Coins size={15} />, value: user.coins || 0, label: 'Coins',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
              { icon: <Trophy size={15} />, value: user.gamesCompleted || 0, label: 'Games', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
              { icon: <Star size={15} />, value: `${user.longestStreak || 0}d`, label: 'Best Streak', color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '0.875rem', padding: '0.85rem', textAlign: 'center' }}>
                <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>{s.icon}</div>
                <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Competitive Career Summary */}
        <div style={{ marginBottom: '2rem' }}>
          <RankCard
            rating={user.competitiveRating || 500}
            matchesPlayed={user.matchesPlayed || 0}
            matchesWon={user.matchesWon || 0}
          />
        </div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 className="font-accent" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>🏆 Achievements</h2>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>{unlockedIds.size} / {achievements.length} unlocked</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {achievements.map((ach, i) => {
              const unlocked = unlockedIds.has(ach.achievementKey);
              const rc = RARITY_COLORS[ach.rarity] || RARITY_COLORS.COMMON;
              const unlockedData = unlockedAchievements.find(a => a.achievement.achievementKey === ach.achievementKey);
              return (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    background: unlocked ? '#FFFFFF' : '#F8FAFC',
                    border: `1px solid ${unlocked ? rc.border : '#E2E8F0'}`,
                    borderRadius: '1rem',
                    padding: '1.2rem',
                    opacity: unlocked ? 1 : 0.6,
                    filter: unlocked ? 'none' : 'grayscale(0.8)',
                    boxShadow: unlocked ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {unlocked && <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', borderRadius: '0 1rem 0 100%', background: `${rc.bg}` }} />}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ fontSize: '1.75rem', filter: unlocked ? 'none' : 'grayscale(1)' }}>
                      {unlocked ? ach.emoji : <Lock size={20} color="#94A3B8" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <span className="font-accent" style={{ fontWeight: 700, color: unlocked ? '#0F172A' : '#64748B', fontSize: '0.925rem' }}>{ach.title}</span>
                      </div>
                      <p style={{ fontSize: '0.775rem', color: unlocked ? '#475569' : '#94A3B8', lineHeight: 1.5 }}>{ach.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem' }}>
                        <span style={{ fontSize: '0.675rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>{rc.label}</span>
                        <span style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700 }}>+{ach.xpReward} XP</span>
                        {unlocked && unlockedData && (
                          <span style={{ fontSize: '0.7rem', color: '#059669', marginLeft: 'auto', fontWeight: 600 }}>
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

        {/* Recent Competitive Matches */}
        {recentMatches && recentMatches.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginTop: '2.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <h2 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Swords size={18} color="#4F46E5" /> Recent Competitive Matches
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentMatches.map((m) => {
                const isP1 = m.player1Id === user.id;
                const myDelta = isP1 ? m.player1RatingChange : m.player2RatingChange;
                const oppName = isP1 ? (m.player2Username || 'Challenger') : (m.player1Username || 'Challenger');
                const isWon = m.winnerId === user.id;
                const isDraw = m.winnerId === null && m.player1Score === m.player2Score;

                return (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: '0.875rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{isWon ? '🏆' : (isDraw ? '🤝' : '⚔️')}</span>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                          vs @{oppName} • <span style={{ fontWeight: 600, color: '#64748B' }}>{m.gameSlug?.replace('-', ' ')}</span>
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>
                          {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isWon ? '#059669' : (isDraw ? '#2563EB' : '#E11D48') }}>
                        {isWon ? 'VICTORY' : (isDraw ? 'DRAW' : 'DEFEAT')}
                      </div>
                      {myDelta !== undefined && myDelta !== null && (
                        <div style={{ fontSize: '0.775rem', fontWeight: 700, color: myDelta >= 0 ? '#16A34A' : '#DC2626' }}>
                          {myDelta > 0 ? `+${myDelta}` : myDelta} Elo
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '2rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <h2 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>📋 Recent Activity</h2>
          {user.recentActivity?.map((act, i) => (
            <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 0', borderBottom: i < user.recentActivity.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
              <span style={{ fontSize: '1.25rem' }}>{act.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 600 }}>{act.action}</div>
                <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '0.15rem' }}>{new Date(act.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706' }}>+{act.xpGained} XP</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
