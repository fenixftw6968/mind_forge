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
  COMMON:    { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.25)', label: 'Common' },
  UNCOMMON:  { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.12)',  border: 'rgba(74, 222, 128, 0.25)',  label: 'Uncommon' },
  RARE:      { color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)',   border: 'rgba(56, 189, 248, 0.25)',   label: 'Rare' },
  EPIC:      { color: '#C084FC', bg: 'rgba(192, 132, 252, 0.12)',  border: 'rgba(192, 132, 252, 0.25)',  label: 'Epic' },
  LEGENDARY: { color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.12)',  border: 'rgba(251, 191, 36, 0.25)',  label: 'Legendary' },
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
    <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', color: '#F8FAFC' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#242424',
            border: '1px solid #2E2E2E',
            borderRadius: '1.25rem',
            padding: '2rem',
            marginBottom: '1.75rem',
            display: 'flex',
            gap: '1.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: '#1C1C1C',
              border: '2px solid #22C55E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#4ADE80',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 0 16px rgba(34, 197, 94, 0.25)'
            }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#242424',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #2E2E2E',
              fontSize: '0.85rem'
            }}>
              {rank.icon}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
              {user.username}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ADE80', background: 'rgba(34, 197, 94, 0.12)', padding: '0.15rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                {rank.name}
              </span>
              <span style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 500 }}>
                Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <XPBar current={xpCurrent} total={xpNext} level={user.level} />
          </div>

          {/* Quick stats metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', minWidth: '220px' }}>
            {[
              { icon: <Flame size={14} />, value: `${user.currentStreak || 0}d`, label: 'Streak',  color: '#FB7185', bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.25)' },
              { icon: <Coins size={14} />, value: user.coins || 0, label: 'Coins',   color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)' },
              { icon: <Trophy size={14} />, value: user.gamesCompleted || 0, label: 'Games', color: '#4ADE80', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.25)' },
              { icon: <Star size={14} />, value: `${user.longestStreak || 0}d`, label: 'Best Streak', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.25)' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: '0.2rem' }}>{s.icon}</div>
                <div className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>{s.value}</div>
                <div style={{ fontSize: '0.675rem', color: '#94A3B8', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Competitive Career Summary */}
        <div style={{ marginBottom: '1.75rem' }}>
          <RankCard
            rating={user.competitiveRating || 500}
            matchesPlayed={user.matchesPlayed || 0}
            matchesWon={user.matchesWon || 0}
          />
        </div>

        {/* Achievements Section */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>
              🏆 Achievements
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
              {unlockedIds.size} of {achievements.length} unlocked
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
            {achievements.map((ach, i) => {
              const unlocked = unlockedIds.has(ach.achievementKey);
              const rc = RARITY_COLORS[ach.rarity] || RARITY_COLORS.COMMON;
              const unlockedData = unlockedAchievements.find(a => a.achievement?.achievementKey === ach.achievementKey);
              return (
                <div
                  key={ach.id}
                  style={{
                    background: unlocked ? '#242424' : '#1C1C1C',
                    border: `1px solid ${unlocked ? rc.border : '#2E2E2E'}`,
                    borderRadius: '0.875rem',
                    padding: '1.1rem',
                    opacity: unlocked ? 1 : 0.5,
                    boxShadow: unlocked ? '0 2px 6px rgba(0, 0, 0, 0.2)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                      {unlocked ? ach.emoji : <Lock size={18} color="#64748B" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="font-accent" style={{ fontWeight: 700, color: unlocked ? '#F8FAFC' : '#94A3B8', fontSize: '0.875rem', marginBottom: '0.2rem' }}>
                        {ach.title}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: unlocked ? '#CBD5E1' : '#64748B', lineHeight: 1.45, marginBottom: '0.5rem' }}>
                        {ach.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '999px', background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                          {rc.label}
                        </span>
                        <span style={{ fontSize: '0.675rem', color: '#FBBF24', fontWeight: 700 }}>
                          +{ach.xpReward} XP
                        </span>
                        {unlocked && unlockedData && (
                          <span style={{ fontSize: '0.675rem', color: '#4ADE80', marginLeft: 'auto', fontWeight: 600 }}>
                            ✓ {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Competitive Matches */}
        {recentMatches && recentMatches.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginTop: '2rem', background: '#242424', border: '1px solid #2E2E2E', borderRadius: '1.15rem', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)' }}>
            <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Swords size={16} color="#22C55E" /> Recent 1v1 Matches
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recentMatches.map((m) => {
                const isP1 = m.player1Id === user.id;
                const myDelta = isP1 ? m.player1RatingChange : m.player2RatingChange;
                const oppName = isP1 ? (m.player2Username || 'Challenger') : (m.player1Username || 'Challenger');
                const isWon = m.winnerId === user.id;
                const isDraw = m.winnerId === null && m.player1Score === m.player2Score;

                return (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', background: '#1C1C1C', borderRadius: '0.75rem', border: '1px solid #2E2E2E' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{isWon ? '🏆' : (isDraw ? '🤝' : '⚔️')}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC' }}>
                          vs @{oppName} • <span style={{ fontWeight: 500, color: '#94A3B8' }}>{m.gameSlug?.replace('-', ' ')}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: isWon ? '#4ADE80' : (isDraw ? '#38BDF8' : '#FB7185') }}>
                        {isWon ? 'VICTORY' : (isDraw ? 'DRAW' : 'DEFEAT')}
                      </div>
                      {myDelta !== undefined && myDelta !== null && (
                        <div style={{ fontSize: '0.725rem', fontWeight: 700, color: myDelta >= 0 ? '#4ADE80' : '#FB7185' }}>
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
      </div>
    </div>
  );
}
