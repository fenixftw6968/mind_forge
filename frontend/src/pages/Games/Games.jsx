import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Gamepad2 } from 'lucide-react';
import GameCard from '../../components/GameCard/GameCard';
import { getAllGamesList } from '../../data/gameRegistry';
import api from '../../utils/api';

const CATEGORIES = ['All', 'Programming / DSA', 'Reasoning', 'Brain Training'];
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
    const matchDiff = difficulty === 'All' 
      || g.difficulty === difficulty 
      || (g.xpReward && g.xpReward[difficulty.toLowerCase()] !== undefined)
      || (Array.isArray(g.difficulties) && g.difficulties.includes(difficulty));
    const matchSrc  = !search || g.title.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDiff && matchSrc;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6rem', color: '#F8FAFC', position: 'relative' }}>
      
      {/* Background Starfield & Texture */}
      <div className="star-field" />
      <div className="binary-texture" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              // DISCIPLINE LIBRARY
            </span>
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Cognitive Arenas
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Select your discipline. Each arena targets specific algorithmic and analytical faculties.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: '440px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search arenas or algorithmic topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark"
              style={{
                paddingLeft: '2.5rem',
                background: 'rgba(8, 14, 33, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                fontSize: '0.875rem',
                color: '#F8FAFC'
              }}
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
                    padding: '0.45rem 1.15rem',
                    borderRadius: '999px',
                    border: active ? '1px solid rgba(96, 165, 250, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: active ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255, 255, 255, 0.04)',
                    color: active ? '#FFFFFF' : '#94A3B8',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.825rem',
                    fontWeight: active ? 700 : 500,
                    boxShadow: active ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.color = '#F8FAFC';
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.color = '#94A3B8';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Difficulty filter row */}
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.725rem', color: '#64748B', marginRight: '0.35rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Complexity:
            </span>
            {DIFFICULTIES.map(d => {
              const active = difficulty === d;
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    padding: '0.25rem 0.8rem',
                    borderRadius: '999px',
                    border: active ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: active ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                    color: active ? '#60A5FA' : '#94A3B8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    boxShadow: active ? '0 0 12px rgba(59, 130, 246, 0.25)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Game grid */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(8, 14, 33, 0.6)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>No arenas found matching your current filter criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((game, i) => (
              <GameCard key={game.slug} game={game} index={i} activeDifficulty={difficulty} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
