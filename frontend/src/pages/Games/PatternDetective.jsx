import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import XPPopup from '../../components/XPPopup/XPPopup';
import api from '../../utils/api';

export default function PatternDetective() {
  const { refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState(null);
  const [puzzles, setPuzzles]       = useState([]);
  const [index, setIndex]           = useState(0);
  const [selected, setSelected]     = useState(null);
  const [hintUsed, setHintUsed]     = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore]           = useState(0);
  const [totalXP, setTotalXP]       = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [latestUser, setLatestUser] = useState(null);

  const puzzle = puzzles[index];

  const startGame = async (diff) => {
    try {
      const res = await api.get(`/api/games/pattern-detective/puzzles?difficulty=${diff}`);
      const puzzlesData = res.data.map(p => {
        const parsedContent = JSON.parse(p.content);
        const parsedAns = JSON.parse(p.correctAnswer);
        return {
          ...p,
          description: parsedContent.description,
          grid: parsedContent.grid,
          choices: parsedContent.choices,
          hint: parsedContent.hint,
          answer: parsedAns.answer
        };
      });
      setPuzzles(puzzlesData);
      setDifficulty(diff); setIndex(0); setScore(0); setTotalXP(0);
      setSelected(null); setHintUsed(false); setShowResult(false); setShowComplete(false);
      setLatestUser(null);
    } catch (e) {
      console.error("Failed to load puzzles", e);
    }
  };

  const handleAnswer = async (choice) => {
    if (showResult) return;
    const isCorrect = choice === puzzle.answer;
    setSelected(choice);
    setShowResult(true);

    try {
      const res = await api.post('/api/games/pattern-detective/attempts', {
        puzzleId: puzzle.id,
        userAnswer: choice,
        hintUsed: hintUsed,
        timeTakenSeconds: 15
      });

      if (isCorrect) {
        const earned = res.data.xpEarned;
        setScore(s => s + 1);
        setTotalXP(t => t + earned);
        showXPPopup(earned);
      }

      if (res.data.user) {
        setLatestUser(res.data.user);
      }
    } catch (e) {
      console.error("Failed to submit attempt", e);
    }
  };

  const handleNext = () => {
    if (index + 1 >= puzzles.length) {
      if (latestUser) {
        refreshUser(latestUser);
      }
      setShowComplete(true);
    } else {
      setIndex(i => i + 1);
      setSelected(null); setHintUsed(false); setShowResult(false);
    }
  };

  if (!difficulty) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '560px', width: '100%', padding: '2rem' }}>
          <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Back to Games
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🧩</div>
              <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Pattern Detective</h1>
              <p style={{ color: '#a1a1b5' }}>Spot the hidden relationship in the grid. Find the missing piece.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {['EASY', 'MEDIUM', 'HARD'].map(d => {
                const colors = { EASY: '#10b981', MEDIUM: '#f59e0b', HARD: '#f43f5e' };
                const descs  = { EASY: 'Row/column relationships', MEDIUM: 'Multi-rule patterns', HARD: 'Complex mathematical patterns' };
                const c = colors[d];
                return (
                  <motion.button key={d} whileHover={{ scale: 1.02 }} onClick={() => startGame(d)}
                    style={{ width: '100%', padding: '1.25rem', borderRadius: '1rem', background: `${c}12`, border: `1px solid ${c}25`, cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center', textAlign: 'left' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${c}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                      {d === 'EASY' ? '🌱' : d === 'MEDIUM' ? '🧠' : '🔥'}
                    </div>
                    <div>
                      <div className="font-accent" style={{ fontWeight: 700, color: c }}>{d}</div>
                      <div style={{ fontSize: '0.8rem', color: '#a1a1b5', marginTop: '0.15rem' }}>{descs[d]}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '440px', padding: '2rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>{score >= puzzles.length * 0.7 ? '🏆' : '💪'}</div>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
            {score >= puzzles.length * 0.7 ? 'Pattern Master!' : 'Keep Practicing!'}
          </h1>
          <p style={{ color: '#a1a1b5', marginBottom: '2rem' }}>{score}/{puzzles.length} correct</p>
          <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#a78bfa' }}>+{totalXP}</div>
              <div style={{ fontSize: '0.75rem', color: '#52526a' }}>XP</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>+{Math.floor(totalXP / 2.5)}</div>
              <div style={{ fontSize: '0.75rem', color: '#52526a' }}>Coins</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={() => startGame(difficulty)} className="btn-primary">Play Again</button>
            <button onClick={() => navigate('/games')} className="btn-secondary">Games</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!puzzle) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button onClick={() => setDifficulty(null)} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Exit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#52526a' }}>Puzzle {index + 1}/{puzzles.length}</span>
            <Star size={13} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>Score: {score}</span>
          </div>
        </div>

        <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', marginBottom: '2rem', overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', borderRadius: '999px' }} animate={{ width: `${((index + 1) / puzzles.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#52526a', marginBottom: '1.25rem' }}>{puzzle.description}</p>

              {/* Grid */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${puzzle.grid[0].length}, 1fr)`, gap: '0.6rem', maxWidth: '280px', width: '100%' }}>
                  {puzzle.grid.flat().map((cell, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={cell === '?' ? 'pattern-cell missing' : 'pattern-cell'}
                      style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: cell === '?' ? 'rgba(139,92,246,0.08)' : '#0f0f1a', border: `1px solid ${cell === '?' ? '#8b5cf6' : 'rgba(255,255,255,0.06)'}`, borderRadius: '0.6rem', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: cell === '?' ? '#a78bfa' : '#67e8f9', animation: cell === '?' ? 'pulse-glow 2s infinite' : 'none' }}
                    >
                      {cell}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Hint */}
              {hintUsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '0.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
                  <Lightbulb size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.85rem', color: '#fbbf24' }}>{puzzle.hint}</p>
                </motion.div>
              )}

              {/* Choices */}
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a1a1b5', marginBottom: '0.75rem', textAlign: 'center' }}>What replaces the ?</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                  {puzzle.choices.map(choice => {
                    let borderColor = 'rgba(255,255,255,0.06)';
                    let bg = 'rgba(255,255,255,0.02)';
                    let color = '#a1a1b5';
                    if (selected === choice) { borderColor = selected === puzzle.answer ? '#10b981' : '#f43f5e'; bg = selected === puzzle.answer ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)'; color = selected === puzzle.answer ? '#10b981' : '#f43f5e'; }
                    if (showResult && choice === puzzle.answer && selected !== choice) { borderColor = '#10b981'; bg = 'rgba(16,185,129,0.08)'; color = '#10b981'; }
                    return (
                      <motion.button key={choice} whileHover={!showResult ? { scale: 1.03 } : {}} onClick={() => handleAnswer(choice)} disabled={showResult}
                        style={{ padding: '0.9rem', borderRadius: '0.75rem', border: `1px solid ${borderColor}`, background: bg, color, cursor: showResult ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {showResult && choice === puzzle.answer && <CheckCircle size={14} color="#10b981" />}
                        {showResult && selected === choice && choice !== puzzle.answer && <XCircle size={14} color="#f43f5e" />}
                        {choice}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Explanation */}
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Pattern Explained</p>
                  <p style={{ fontSize: '0.875rem', color: '#a1a1b5', lineHeight: 1.7 }}>{puzzle.explanation}</p>
                </div>
                <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {index + 1 >= puzzles.length ? 'See Results 🏆' : 'Next Pattern →'}
                </button>
              </motion.div>
            )}

            {!showResult && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!hintUsed && (
                  <button onClick={() => setHintUsed(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', borderRadius: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <Lightbulb size={13} /> Hint
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
