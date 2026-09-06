import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Crown, Swords, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRankFromRating } from '../../utils/rankUtils';
import api from '../../utils/api';

const TABS = [
  { id: 'Ranked', label: '⚔️ Ranked Elo', sortBy: 'rating' },
  { id: 'Global', label: '⭐ Account XP', sortBy: 'xp' },
  { id: 'Streaks', label: '🔥 Streaks', sortBy: 'streak' },
  { id: 'Games', label: '🎮 Games Won', sortBy: 'games' }
];

const RANK_ACCENTS = [
  { color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.3)', emoji: '🥇' },
  { color: '#93C5FD', bg: 'rgba(147, 197, 253, 0.12)', border: 'rgba(147, 197, 253, 0.3)', emoji: '🥈' },
  { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.3)', emoji: '🥉' }
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('Ranked');
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const tabObj = TABS.find(t => t.id === activeTab) || TABS[0];
        const res = await api.get(`/api/leaderboard?sortBy=${tabObj.sortBy}`);
        setBoard(res.data);
      } catch (e) {
        console.error("Failed to fetch leaderboard", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', color: '#F8FAFC', position: 'relative' }}>
      
      {/* Background Starfield & Texture */}
      <div className="star-field" />
      <div className="binary-texture" />

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '1.5rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            // GLOBAL CLASSIFICATION
          </span>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#FFFFFF', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
            Leaderboard
          </h1>
          <p style={{ color: '#94A3B8', marginTop: '0.35rem', fontSize: '0.95rem' }}>
            Top ranked analytical minds across the AlgoArena network
          </p>
        </motion.div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'rgba(8, 14, 33, 0.85)',
          padding: '0.35rem',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem',
          width: 'fit-content',
          margin: '0 auto 2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}>
          {TABS.map(t => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '0.45rem 1.25rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: active ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
                  color: active ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.825rem',
                  fontFamily: 'var(--font-display)',
                  boxShadow: active ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Board container */}
        <div style={{
          background: 'rgba(8, 14, 33, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              Querying ranking index...
            </div>
          ) : (
            <div>
              {board.map((player, idx) => {
                const isCurrentUser = user && user.username === player.username;
                const topAccent = RANK_ACCENTS[idx];
                const rankObj = getRankFromRating(player.competitiveRating || 500);

                let displayVal = `${player.competitiveRating || 500} Elo`;
                if (activeTab === 'Global') displayVal = `${(player.xp || 0).toLocaleString()} XP`;
                if (activeTab === 'Streaks') displayVal = `${player.currentStreak || 0}d streak`;
                if (activeTab === 'Games') displayVal = `${player.matchesWon || 0} won`;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3.5rem 1fr auto auto',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.5rem',
                      borderBottom: idx < board.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      background: isCurrentUser ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Rank number / medal */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {topAccent ? (
                        <span style={{ fontSize: '1.25rem' }}>{topAccent.emoji}</span>
                      ) : (
                        <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748B' }}>
                          #{idx + 1}
                        </span>
                      )}
                    </div>

                    {/* User info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: isCurrentUser ? '#3B82F6' : 'rgba(59, 130, 246, 0.12)',
                        color: isCurrentUser ? '#FFFFFF' : '#60A5FA',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}>
                        {player.username?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span className="font-display" style={{ fontSize: '0.925rem', fontWeight: 700, color: isCurrentUser ? '#FFFFFF' : '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {player.username}
                          </span>
                          {isCurrentUser && (
                            <span style={{ fontSize: '0.625rem', background: 'rgba(59, 130, 246, 0.25)', color: '#60A5FA', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                              YOU
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>
                          Level {player.level || 1} • {rankObj.name}
                        </div>
                      </div>
                    </div>

                    {/* Rank Badge */}
                    <div className="hidden sm:block">
                      <span style={{
                        fontSize: '0.725rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        color: '#60A5FA'
                      }}>
                        {rankObj.badge} {rankObj.name}
                      </span>
                    </div>

                    {/* Stat Value */}
                    <div style={{ textAlign: 'right' }}>
                      <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: topAccent ? topAccent.color : '#F8FAFC' }}>
                        {displayVal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
