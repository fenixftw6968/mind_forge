import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const TABS = ['Global', 'Streaks', 'Games'];

const RANK_COLORS = ['#f59e0b', '#a1a1b5', '#cd7f32'];
const RANK_EMOJIS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('Global');
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        let sortBy = 'xp';
        if (activeTab === 'Streaks') sortBy = 'streak';
        if (activeTab === 'Games') sortBy = 'games';
        const res = await api.get(`/api/leaderboard?sortBy=${sortBy}`);
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
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏆</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'white' }}>
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p style={{ color: '#a1a1b5', marginTop: '0.5rem' }}>The top minds in MindMaze</p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '0.75rem', marginBottom: '2rem', width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: activeTab === t ? 'rgba(139,92,246,0.2)' : 'transparent', color: activeTab === t ? '#a78bfa' : '#a1a1b5', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}
        >
          {board.slice(0, 3).map((entry, i) => {
            const order = [1, 0, 2]; // 2nd, 1st, 3rd
            const displayEntry = board[order[i]];
            const rank = order[i] + 1;
            const heights = ['80px', '100px', '60px'];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg, ${RANK_COLORS[rank - 1]}30, ${RANK_COLORS[rank - 1]}10)`, border: `2px solid ${RANK_COLORS[rank - 1]}50`, fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: RANK_COLORS[rank - 1] }}>
                  {displayEntry.username?.[0]?.toUpperCase()}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>{displayEntry.username}</div>
                <div style={{ fontSize: '0.65rem', color: '#52526a' }}>Lv.{displayEntry.level}</div>
                <div style={{ width: '80px', height: heights[i], background: `${RANK_COLORS[rank - 1]}15`, border: `1px solid ${RANK_COLORS[rank - 1]}30`, borderRadius: '0.5rem 0.5rem 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '0.5rem', fontSize: '1.25rem' }}>
                  {RANK_EMOJIS[rank - 1]}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.12)', borderRadius: '1.25rem', overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '3rem 1fr 5rem 6rem 5rem', gap: '0.75rem', padding: '0.85rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['#', 'Player', 'Level', 'XP', 'Streak'].map(h => (
              <div key={h} style={{ fontSize: '0.7rem', fontWeight: 600, color: '#52526a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>

          {board.map((entry, i) => {
            const isCurrentUser = entry.username === user?.username;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3rem 1fr 5rem 6rem 5rem',
                  gap: '0.75rem',
                  padding: '1rem 1.5rem',
                  alignItems: 'center',
                  background: isCurrentUser ? 'rgba(139,92,246,0.08)' : 'transparent',
                  borderBottom: i < board.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  borderLeft: isCurrentUser ? '3px solid #8b5cf6' : '3px solid transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!isCurrentUser) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={e => { if (!isCurrentUser) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Rank */}
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: entry.rank <= 3 ? RANK_COLORS[entry.rank - 1] : '#52526a', display: 'flex', alignItems: 'center' }}>
                  {entry.rank <= 3 ? RANK_EMOJIS[entry.rank - 1] : `#${entry.rank}`}
                </div>

                {/* Player */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isCurrentUser ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                    {entry.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: isCurrentUser ? 700 : 500, color: isCurrentUser ? '#a78bfa' : 'white' }}>
                      {entry.username}
                      {isCurrentUser && <span style={{ fontSize: '0.65rem', color: '#8b5cf6', marginLeft: '0.4rem' }}>You</span>}
                    </div>
                  </div>
                </div>

                {/* Level */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Zap size={12} color="#a78bfa" />
                  <span style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>{entry.level}</span>
                </div>

                {/* XP */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Trophy size={12} color="#f59e0b" />
                  <span style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>{entry.xp.toLocaleString()}</span>
                </div>

                {/* Streak */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Flame size={12} color="#f43f5e" />
                  <span style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>{entry.streak}d</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#52526a' }}>
          Leaderboard updates every hour · Play more to climb the ranks
        </p>
      </div>
    </div>
  );
}
