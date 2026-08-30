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
  { color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.25)', emoji: '🥇' },
  { color: '#CBD5E1', bg: 'rgba(203, 213, 225, 0.12)', border: 'rgba(203, 213, 225, 0.25)', emoji: '🥈' },
  { color: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.25)', emoji: '🥉' }
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
    <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', color: '#F8FAFC' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{ fontSize: '2.25rem', marginBottom: '0.4rem' }}>🏆</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Leaderboard
          </h1>
          <p style={{ color: '#94A3B8', marginTop: '0.25rem', fontSize: '0.925rem' }}>
            Top ranked minds across the MindForge network
          </p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', background: '#1C1C1C', padding: '0.35rem', borderRadius: '0.75rem', border: '1px solid #2E2E2E', marginBottom: '2rem', width: 'fit-content', margin: '0 auto 2rem', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)' }}>
          {TABS.map(t => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '0.45rem 1.15rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: active ? '#242424' : 'transparent',
                  color: active ? '#4ADE80' : '#94A3B8',
                  cursor: 'pointer',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.825rem',
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
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '2.25rem' }}
          >
            {[1, 0, 2].map((boardIdx, i) => { // 2nd, 1st, 3rd
              const displayEntry = board[boardIdx];
              if (!displayEntry) return null;
              const rank = boardIdx + 1;
              const heights = ['85px', '110px', '70px'];
              const accent = RANK_ACCENTS[rank - 1];

              return (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: '1', maxWidth: '140px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: rank === 1 ? '54px' : '44px', height: rank === 1 ? '54px' : '44px', borderRadius: '50%', background: accent.bg, border: `2px solid ${accent.border}`, fontSize: rank === 1 ? '1.25rem' : '1rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: accent.color, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    {displayEntry.username?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#F8FAFC', textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>{displayEntry.username}</div>
                  <div style={{ fontSize: '0.725rem', color: '#94A3B8', fontWeight: 600 }}>
                    {activeTab === 'Ranked' ? `${displayEntry.competitiveRating || 500} pts` : `Lv.${displayEntry.level}`}
                  </div>
                  <div style={{ width: '100%', height: heights[i], background: '#242424', border: `1px solid ${accent.border}`, borderBottom: 'none', borderRadius: '0.75rem 0.75rem 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '0.55rem', fontSize: '1.3rem', boxShadow: '0 -2px 6px rgba(0,0,0,0.2)' }}>
                    {accent.emoji}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '3.5rem 1fr 6rem 6rem 5.5rem', gap: '0.75rem', padding: '0.75rem 1.5rem', background: '#1C1C1C', borderBottom: '1px solid #2E2E2E' }}>
            {['#', 'Player', activeTab === 'Ranked' ? 'Rating' : 'Level', activeTab === 'Ranked' ? 'Rank Tier' : 'XP', activeTab === 'Ranked' ? 'Wins' : 'Streak'].map(h => (
              <div key={h} style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>

          {board.map((entry, i) => {
            const isCurrentUser = entry.username === user?.username;
            const compRank = getRankFromRating(entry.competitiveRating || 500);

            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.02 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3.5rem 1fr 6rem 6rem 5.5rem',
                  gap: '0.75rem',
                  padding: '0.85rem 1.5rem',
                  alignItems: 'center',
                  background: isCurrentUser ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  borderBottom: i < board.length - 1 ? '1px solid #2A2A2A' : 'none',
                  borderLeft: isCurrentUser ? '3px solid #22C55E' : '3px solid transparent',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { if (!isCurrentUser) e.currentTarget.style.background = '#2A2A2A'; }}
                onMouseLeave={e => { if (!isCurrentUser) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Rank */}
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: entry.rank <= 3 ? RANK_ACCENTS[entry.rank - 1]?.color : '#64748B', display: 'flex', alignItems: 'center' }}>
                  {entry.rank <= 3 ? RANK_ACCENTS[entry.rank - 1]?.emoji : `#${entry.rank}`}
                </div>

                {/* Player */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: isCurrentUser ? '#22C55E' : '#1C1C1C', border: '1px solid #333333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: isCurrentUser ? '#05200C' : '#4ADE80', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                    {entry.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: isCurrentUser ? 800 : 600, color: isCurrentUser ? '#4ADE80' : '#F8FAFC' }}>
                      {entry.username}
                      {isCurrentUser && <span style={{ fontSize: '0.625rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', padding: '0.1rem 0.35rem', borderRadius: '4px', marginLeft: '0.4rem', fontWeight: 700 }}>You</span>}
                    </div>
                  </div>
                </div>

                {/* Column 3: Rating or Level */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {activeTab === 'Ranked' ? (
                    <>
                      <Swords size={13} color="#38BDF8" />
                      <span style={{ fontSize: '0.825rem', color: '#F8FAFC', fontWeight: 800 }}>{entry.competitiveRating || 500} pts</span>
                    </>
                  ) : (
                    <>
                      <Zap size={13} color="#4ADE80" />
                      <span style={{ fontSize: '0.825rem', color: '#94A3B8', fontWeight: 600 }}>Lv.{entry.level}</span>
                    </>
                  )}
                </div>

                {/* Column 4: Rank Tier or XP */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {activeTab === 'Ranked' ? (
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      color: compRank.color,
                      background: compRank.bg,
                      border: `1px solid ${compRank.border}`,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px'
                    }}>
                      {compRank.badge} {compRank.name}
                    </span>
                  ) : (
                    <>
                      <Trophy size={13} color="#FBBF24" />
                      <span style={{ fontSize: '0.825rem', color: '#94A3B8', fontWeight: 600 }}>{entry.xp.toLocaleString()}</span>
                    </>
                  )}
                </div>

                {/* Column 5: Wins or Streak */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {activeTab === 'Ranked' ? (
                    <span style={{ fontSize: '0.825rem', color: '#4ADE80', fontWeight: 700 }}>
                      {entry.matchesWon || 0}W
                    </span>
                  ) : (
                    <>
                      <Flame size={13} color="#FB7185" />
                      <span style={{ fontSize: '0.825rem', color: '#94A3B8', fontWeight: 600 }}>{entry.streak}d</span>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.775rem', color: '#64748B', fontWeight: 500 }}>
          Leaderboard syncs dynamically · Compete in Ranked and Daily matches to climb
        </p>
      </div>
    </div>
  );
}
