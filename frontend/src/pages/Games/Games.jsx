import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import GameCard from '../../components/GameCard/GameCard';
import api from '../../utils/api';

const CATEGORIES = ['All', 'Logic', 'Mystery', 'Critical Thinking', 'Patterns', 'Memory', 'Decision Making'];
const DIFFICULTIES = ['All', 'EASY', 'MEDIUM', 'HARD'];

export default function Games() {
  const [category,   setCategory]   = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search,     setSearch]     = useState('');
  const [games,      setGames]      = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get('/api/games');
        setGames(res.data);
      } catch (e) {
        console.error("Failed to fetch games list", e);
      }
    };
    fetchGames();
  }, []);

  const filtered = games.filter(g => {
    const matchCat  = category   === 'All' || g.category   === category;
    const matchDiff = difficulty === 'All' || g.difficulty === difficulty;
    const matchSrc  = !search || g.title.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDiff && matchSrc;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
            🎮 Game <span className="gradient-text">Library</span>
          </h1>
          <p style={{ color: '#a1a1b5' }}>Choose your challenge. Each game trains a different dimension of intelligence.</p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52526a' }} />
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  border: category === cat ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  background: category === cat ? 'rgba(139,92,246,0.15)' : 'transparent',
                  color: category === cat ? '#a78bfa' : '#a1a1b5',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#52526a', fontSize: '0.8rem' }}>
              <Filter size={13} />
              Difficulty:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {DIFFICULTIES.map(d => {
                const color = d === 'EASY' ? '#10b981' : d === 'MEDIUM' ? '#f59e0b' : d === 'HARD' ? '#f43f5e' : '#a1a1b5';
                const isActive = difficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      border: isActive ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.06)',
                      background: isActive ? `${color}15` : 'transparent',
                      color: isActive ? color : '#a1a1b5',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {d === 'All' ? 'All' : d.charAt(0) + d.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <p style={{ fontSize: '0.8rem', color: '#52526a', marginBottom: '1.25rem' }}>
          Showing <span style={{ color: '#a78bfa', fontWeight: 600 }}>{filtered.length}</span> games
        </p>

        {/* Games grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '4rem 2rem' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: '#a1a1b5', fontSize: '1rem' }}>No games found matching your filters.</p>
            <button onClick={() => { setCategory('All'); setDifficulty('All'); setSearch(''); }} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}>
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
