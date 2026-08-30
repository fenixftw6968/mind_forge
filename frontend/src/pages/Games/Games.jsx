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
    const matchDiff = difficulty === 'All' || g.difficulty === difficulty;
    const matchSrc  = !search || g.title.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDiff && matchSrc;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', color: '#F8FAFC' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Gamepad2 size={22} color="#22C55E" />
            <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.15rem)', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              Games & Training Library
            </h1>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.925rem' }}>
            Select your discipline. Each game trains a distinct cognitive skill set.
          </p>
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
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search games or skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark"
              style={{ paddingLeft: '2.5rem', background: '#1C1C1C', border: '1px solid #2E2E2E', borderRadius: '0.625rem', fontSize: '0.9rem', color: '#F8FAFC' }}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '0.4rem 0.95rem',
                    borderRadius: '999px',
                    border: active ? '1px solid #22C55E' : '1px solid #2E2E2E',
                    background: active ? '#242424' : '#1C1C1C',
                    color: active ? '#4ADE80' : '#94A3B8',
                    fontSize: '0.8rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.color = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#3D3D3D';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.color = '#94A3B8';
                      e.currentTarget.style.borderColor = '#2E2E2E';
                    }
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Difficulty filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>
              <Filter size={13} />
              Difficulty:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {DIFFICULTIES.map(d => {
                const color = d === 'EASY' ? '#4ADE80' : d === 'MEDIUM' ? '#FBBF24' : d === 'HARD' ? '#FB7185' : '#CBD5E1';
                const bg = d === 'EASY' ? 'rgba(34, 197, 94, 0.12)' : d === 'MEDIUM' ? 'rgba(245, 158, 11, 0.12)' : d === 'HARD' ? 'rgba(244, 63, 94, 0.12)' : '#242424';
                const border = d === 'EASY' ? 'rgba(34, 197, 94, 0.25)' : d === 'MEDIUM' ? 'rgba(245, 158, 11, 0.25)' : d === 'HARD' ? 'rgba(244, 63, 94, 0.25)' : '#2E2E2E';
                const isActive = difficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      border: isActive ? `1px solid ${border}` : '1px solid #2E2E2E',
                      background: isActive ? bg : '#1C1C1C',
                      color: isActive ? color : '#94A3B8',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
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
        <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
          Showing <strong style={{ color: '#F8FAFC' }}>{filtered.length}</strong> challenges
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
            style={{ textAlign: 'center', padding: '4rem 2rem', background: '#242424', borderRadius: '1rem', border: '1px solid #2E2E2E' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>No games found matching your filters.</p>
            <button onClick={() => { setCategory('All'); setDifficulty('All'); setSearch(''); }} style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: '#22C55E', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'underline' }}>
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
