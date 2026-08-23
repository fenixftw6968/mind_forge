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
  { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', emoji: '🥇' },
  { color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0', emoji: '🥈' },
  { color: '#B45309', bg: '#FFEDD5', border: '#FED7AA', emoji: '🥉' }
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
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.35rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p style={{ color: '#64748B', marginTop: '0.35rem', fontSize: '0.95rem' }}>The top minds in MindForge</p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', background: '#FFFFFF', padding: '0.35rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', marginBottom: '2rem', width: 'fit-content', margin: '0 auto 2rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
          {TABS.map(t => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: active ? '#EEF2FF' : 'transparent',
                  color: active ? '#4F46E5' : '#64748B',
                  cursor: 'pointer',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.85rem',
                  transition: 'all 0.15s ease'
                }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Top 3 podium */}
        {board.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '2.5rem' }}
          >
            {[1, 0, 2].map((boardIdx, i) => { // 2nd, 1st, 3rd
              const displayEntry = board[boardIdx];
              if (!displayEntry) return null;
              const rank = boardIdx + 1;
              const heights = ['90px', '115px', '75px'];
              const accent = RANK_ACCENTS[rank - 1];
              const compRank = getRankFromRating(displayEntry.competitiveRating || 500);

              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: '1', maxWidth: '140px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: rank === 1 ? '58px' : '48px', height: rank === 1 ? '58px' : '48px', borderRadius: '50%', background: accent.bg, border: `2px solid ${accent.border}`, fontSize: rank === 1 ? '1.35rem' : '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: accent.color, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                    {displayEntry.username?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>{displayEntry.username}</div>
                  <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>
                    {activeTab === 'Ranked' ? `${displayEntry.competitiveRating || 500} pts` : `Lv.${displayEntry.level}`}
                  </div>
                  <div style={{ width: '100%', height: heights[i], background: '#FFFFFF', border: `1px solid ${accent.border}`, borderBottom: 'none', borderRadius: '0.75rem 0.75rem 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '0.65rem', fontSize: '1.4rem', boxShadow: '0 -2px 6px rgba(0,0,0,0.02)' }}>
                    {accent.emoji}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '3.5rem 1fr 6rem 6rem 5.5rem', gap: '0.75rem', padding: '0.85rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            {['#', 'Player', activeTab === 'Ranked' ? 'Rating' : 'Level', activeTab === 'Ranked' ? 'Rank Tier' : 'XP', activeTab === 'Ranked' ? 'Wins' : 'Streak'].map(h => (
              <div key={h} style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>

          {board.map((entry, i) => {
            const isCurrentUser = entry.username === user?.username;
            const compRank = getRankFromRating(entry.competitiveRating || 500);

            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3.5rem 1fr 6rem 6rem 5.5rem',
                  gap: '0.75rem',
                  padding: '0.9rem 1.5rem',
                  alignItems: 'center',
                  background: isCurrentUser ? '#EEF2FF' : 'transparent',
                  borderBottom: i < board.length - 1 ? '1px solid #F1F5F9' : 'none',
                  borderLeft: isCurrentUser ? '3px solid #6366F1' : '3px solid transparent',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { if (!isCurrentUser) e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={e => { if (!isCurrentUser) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Rank */}
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: entry.rank <= 3 ? RANK_ACCENTS[entry.rank - 1]?.color : '#64748B', display: 'flex', alignItems: 'center' }}>
                  {entry.rank <= 3 ? RANK_ACCENTS[entry.rank - 1]?.emoji : `#${entry.rank}`}
                </div>

                {/* Player */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isCurrentUser ? 'linear-gradient(135deg, #6366F1, #4F46E5)' : '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: isCurrentUser ? '#FFFFFF' : '#4F46E5', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                    {entry.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: isCurrentUser ? 800 : 600, color: isCurrentUser ? '#4F46E5' : '#0F172A' }}>
                      {entry.username}
                      {isCurrentUser && <span style={{ fontSize: '0.65rem', background: '#C7D2FE', color: '#3730A3', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.45rem', fontWeight: 700 }}>You</span>}
                    </div>
                  </div>
                </div>

                {/* Column 3: Rating or Level */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {activeTab === 'Ranked' ? (
                    <>
                      <Swords size={13} color="#2563EB" />
                      <span style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 800 }}>{entry.competitiveRating || 500} pts</span>
                    </>
                  ) : (
                    <>
                      <Zap size={13} color="#6366F1" />
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Lv.{entry.level}</span>
                    </>
                  )}
                </div>

                {/* Column 4: Rank Tier or XP */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {activeTab === 'Ranked' ? (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: compRank.color,
                      background: compRank.bg,
                      border: `1px solid ${compRank.border}`,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px'
                    }}>
                      {compRank.badge} {compRank.name}
                    </span>
                  ) : (
                    <>
                      <Trophy size={13} color="#D97706" />
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{entry.xp.toLocaleString()}</span>
                    </>
                  )}
                </div>

                {/* Column 5: Wins or Streak */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {activeTab === 'Ranked' ? (
                    <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                      {entry.matchesWon || 0}W
                    </span>
                  ) : (
                    <>
                      <Flame size={13} color="#E11D48" />
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{entry.streak}d</span>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
          Leaderboard updates every hour · Play more to climb the ranks
        </p>
      </div>
    </div>
  );
}
