import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import GameCard from '../../components/GameCard/GameCard';
import { getAllGamesList } from '../../data/gameRegistry';
import api from '../../utils/api';

const CATEGORIES = ['All', 'Logic', 'Memory', 'Reaction', 'Patterns', 'Decision Making'];
const DIFFICULTIES = ['All', 'EASY', 'MEDIUM', 'HARD'];

export default function Games() {
  const [category,   setCategory]   = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search,     setSearch]     = useState('');
  const [games,      setGames]      = useState(() => getAllGamesList());

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get('/api/games');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setGames(res.data);
        }
      } catch (e) {
        console.warn("Using local game registry for games list");
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
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.35rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            🎮 Game <span className="gradient-text">Library</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Choose your challenge. Each game trains a different dimension of intelligence.</p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: '420px' }}>
            <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark"
              style={{ paddingLeft: '2.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.625rem' }}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '999px',
                    border: active ? '1px solid #C7D2FE' : '1px solid #E2E8F0',
                    background: active ? '#EEF2FF' : '#FFFFFF',
                    color: active ? '#4F46E5' : '#475569',
                    fontSize: '0.825rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Difficulty filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.825rem', fontWeight: 600 }}>
              <Filter size={14} />
              Difficulty:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {DIFFICULTIES.map(d => {
                const color = d === 'EASY' ? '#059669' : d === 'MEDIUM' ? '#D97706' : d === 'HARD' ? '#E11D48' : '#475569';
                const bg = d === 'EASY' ? '#ECFDF5' : d === 'MEDIUM' ? '#FFFBEB' : d === 'HARD' ? '#FFF1F2' : '#F1F5F9';
                const border = d === 'EASY' ? '#A7F3D0' : d === 'MEDIUM' ? '#FDE68A' : d === 'HARD' ? '#FECDD3' : '#E2E8F0';
                const isActive = difficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '999px',
                      border: isActive ? `1px solid ${border}` : '1px solid #E2E8F0',
                      background: isActive ? bg : '#FFFFFF',
                      color: isActive ? color : '#64748B',
                      fontSize: '0.775rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.15s ease',
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
        <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '1.25rem' }}>
          Showing <span style={{ color: '#4F46E5', fontWeight: 700 }}>{filtered.length}</span> games
        </p>

        {/* Games grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: '#64748B', fontSize: '1rem' }}>No games found matching your filters.</p>
            <button onClick={() => { setCategory('All'); setDifficulty('All'); setSearch(''); }} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'underline' }}>
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
