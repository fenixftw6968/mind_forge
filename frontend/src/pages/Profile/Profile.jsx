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
  COMMON:    { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.25)', label: 'Common' },
  UNCOMMON:  { color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.25)',  label: 'Uncommon' },
  RARE:      { color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.25)',  label: 'Rare' },
  EPIC:      { color: '#818CF8', bg: 'rgba(129, 140, 248, 0.12)', border: 'rgba(129, 140, 248, 0.25)', label: 'Epic' },
  LEGENDARY: { color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.25)', label: 'Legendary' },
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
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', color: '#F8FAFC', position: 'relative' }}>
      
      {/* Background Starfield & Texture */}
      <div className="star-field" />
      <div className="binary-texture" />

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>

        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(8, 14, 33, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1.25rem',
            padding: '2rem',
            marginBottom: '1.75rem',
            display: 'flex',
            gap: '1.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
              color: '#FFFFFF',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              boxShadow: '0 0 25px rgba(59, 130, 246, 0.45)'
            }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#060B1E',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontSize: '0.85rem'
            }}>
              {rank.icon}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              // THINKER PROFILE
            </div>
            <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              {user.username}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA', background: 'rgba(59, 130, 246, 0.12)', padding: '0.15rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                {rank.name}
              </span>
              <span style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 400 }}>
                Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <XPBar current={xpCurrent} total={xpNext} level={user.level} />
          </div>

          {/* Quick stats metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', minWidth: '220px' }}>
            {[
              { icon: <Flame size={14} />, value: `${user.currentStreak || 0}d`, label: 'Streak',  color: '#38BDF8', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.25)' },
              { icon: <Coins size={14} />, value: user.coins || 0, label: 'Coins',   color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.2)' },
              { icon: <Trophy size={14} />, value: user.gamesCompleted || 0, label: 'Games', color: '#34D399', bg: 'rgba(52, 211, 153, 0.08)', border: 'rgba(52, 211, 153, 0.2)' },
              { icon: <Star size={14} />, value: `${user.longestStreak || 0}d`, label: 'Best Streak', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.08)', border: 'rgba(96, 165, 250, 0.2)' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: '0.2rem' }}>{s.icon}</div>
                <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>{s.value}</div>
                <div style={{ fontSize: '0.675rem', color: '#94A3B8', fontWeight: 500 }}>{s.label}</div>
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
            <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
              🏆 Achievements
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
              {unlockedIds.size} of {achievements.length} unlocked
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {achievements.map((ach) => {
              const isUnlocked = unlockedIds.has(ach.achievementKey);
              const rarity = RARITY_COLORS[ach.rarity] || RARITY_COLORS.COMMON;

              return (
                <div
                  key={ach.id || ach.achievementKey}
                  style={{
                    background: isUnlocked ? 'rgba(8, 14, 33, 0.8)' : 'rgba(8, 14, 33, 0.4)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${isUnlocked ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)'}`,
                    borderRadius: '0.875rem',
                    padding: '1.15rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    opacity: isUnlocked ? 1 : 0.5,
                    boxShadow: isUnlocked ? '0 0 15px rgba(59, 130, 246, 0.12)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: isUnlocked ? rarity.bg : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isUnlocked ? rarity.border : 'rgba(255, 255, 255, 0.06)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0
                  }}>
                    {isUnlocked ? ach.icon || '🏅' : <Lock size={16} color="#64748B" />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span className="font-display" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ach.title}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.625rem', fontWeight: 700, color: rarity.color }}>
                        {rarity.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.725rem', color: '#94A3B8', lineHeight: 1.4 }}>
                      {ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
