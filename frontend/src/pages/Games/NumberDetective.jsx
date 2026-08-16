import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Clock, Star, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { useTimer } from '../../hooks/useTimer';
import Modal from '../../components/Modal/Modal';
import XPPopup from '../../components/XPPopup/XPPopup';
import api from '../../utils/api';

const DIFF_COLORS = {
  EASY:   { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
  MEDIUM: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  HARD:   { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.25)' },
};

const TIMER_SECONDS = { EASY: 120, MEDIUM: 90, HARD: 60 };

export default function NumberDetective() {
  const { refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState(null); // null = selecting
  const [puzzles, setPuzzles]       = useState([]);
  const [index, setIndex]           = useState(0);
  const [answer, setAnswer]         = useState('');
  const [hintUsed, setHintUsed]     = useState(false);
  const [result, setResult]         = useState(null); // null | 'correct' | 'wrong'
  const [showResult, setShowResult] = useState(false);
  const [score, setScore]           = useState(0);
  const [totalXP, setTotalXP]       = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [latestUser, setLatestUser] = useState(null);

  const puzzle = puzzles[index];
  const { timeLeft, formattedTime, urgency, start, reset } = useTimer(
    puzzle ? TIMER_SECONDS[puzzle.difficulty] : 90,
    { onComplete: () => handleSubmit(true) }
  );

  const startGame = async (diff) => {
    try {
      const res = await api.get(`/api/games/number-detective/puzzles?difficulty=${diff}`);
      const puzzlesData = res.data.map(p => {
        const content = typeof p.content === 'string' ? JSON.parse(p.content) : p.content;
        const ans = typeof p.correctAnswer === 'string' ? JSON.parse(p.correctAnswer) : p.correctAnswer;
        return {
          ...p,
          question: content.question,
          choices: content.choices,
          hint: content.hint,
          answer: ans.answer
        };
      });
      const shuffled = [...puzzlesData].sort(() => Math.random() - 0.5).slice(0, 5);
      setPuzzles(shuffled);
      setDifficulty(diff);
      setIndex(0);
      setScore(0);
      setTotalXP(0);
      setAnswer('');
      setHintUsed(false);
      setResult(null);
      setShowResult(false);
      setShowComplete(false);
      setLatestUser(null);
    } catch (e) {
      console.error("Failed to load puzzles", e);
    }
  };

  useEffect(() => {
    if (puzzles.length > 0 && !showResult) {
      reset(TIMER_SECONDS[puzzles[index]?.difficulty]);
      start();
    }
  }, [index, puzzles, showResult]);

  const handleSubmit = useCallback(async (timedOut = false) => {
    if (!puzzle || result) return;
    const isCorrect = !timedOut && answer.trim().toLowerCase() === puzzle.answer.toLowerCase();
    setResult(isCorrect ? 'correct' : 'wrong');
    setShowResult(true);

    try {
      const res = await api.post('/api/games/number-detective/attempts', {
        puzzleId: puzzle.id,
        userAnswer: answer.trim(),
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
  }, [puzzle, answer, hintUsed, result, showXPPopup]);

  const handleNext = () => {
    if (index + 1 >= puzzles.length) {
      if (latestUser) {
        refreshUser(latestUser);
      }
      setShowComplete(true);
    } else {
      setIndex(i => i + 1);
      setAnswer('');
      setHintUsed(false);
      setResult(null);
      setShowResult(false);
    }
  };

  // === DIFFICULTY SELECT ===
  if (!difficulty) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
          <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Back to Games
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔢</div>
              <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Number Detective</h1>
              <p style={{ color: '#a1a1b5' }}>Find the missing number in the sequence. Choose your difficulty.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {['EASY', 'MEDIUM', 'HARD'].map(d => {
                const dc = DIFF_COLORS[d];
                const info = { EASY: { xp: '10 XP', time: '2 min', desc: 'Simple arithmetic sequences' }, MEDIUM: { xp: '25 XP', time: '90 sec', desc: 'Multi-step patterns' }, HARD: { xp: '50 XP', time: '60 sec', desc: 'Complex mathematical sequences' } };
                return (
                  <motion.button key={d} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => startGame(d)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', borderRadius: '1rem', background: dc.bg, border: `1px solid ${dc.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${dc.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.3rem' }}>
                      {d === 'EASY' ? '🌱' : d === 'MEDIUM' ? '⚡' : '🔥'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="font-accent" style={{ fontWeight: 700, color: dc.color, fontSize: '1rem' }}>{d}</div>
                      <div style={{ fontSize: '0.8rem', color: '#a1a1b5', marginTop: '0.15rem' }}>{info[d].desc}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>{info[d].xp}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#52526a', fontSize: '0.75rem' }}>
                        <Clock size={11} /> {info[d].time}
                      </div>
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

  // === COMPLETE SCREEN ===
  if (showComplete) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '480px', padding: '2rem' }}>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }} style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>
            {score >= puzzles.length * 0.8 ? '🏆' : score >= puzzles.length * 0.5 ? '⭐' : '💪'}
          </motion.div>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
            {score >= puzzles.length * 0.8 ? 'Brilliant!' : score >= puzzles.length * 0.5 ? 'Well Done!' : 'Keep Practicing!'}
          </h1>
          <p style={{ color: '#a1a1b5', marginBottom: '2rem' }}>
            You solved <span style={{ color: '#a78bfa', fontWeight: 700 }}>{score}/{puzzles.length}</span> puzzles
          </p>
          <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#a78bfa' }}>+{totalXP}</div>
                <div style={{ fontSize: '0.75rem', color: '#52526a' }}>XP Earned</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>+{Math.floor(totalXP / 2.5)}</div>
                <div style={{ fontSize: '0.75rem', color: '#52526a' }}>Coins</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>{Math.round((score/puzzles.length)*100)}%</div>
                <div style={{ fontSize: '0.75rem', color: '#52526a' }}>Accuracy</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={() => startGame(difficulty)} className="btn-primary">Play Again</button>
            <button onClick={() => navigate('/games')} className="btn-secondary">Back to Games</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!puzzle) return null;
  const dc = DIFF_COLORS[puzzle.difficulty];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button onClick={() => setDifficulty(null)} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Exit
          </button>
          <div style={{ display: 'flex', align: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#52526a' }}>{index + 1} / {puzzles.length}</span>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', background: dc.bg, color: dc.color, border: `1px solid ${dc.border}`, fontSize: '0.75rem', fontWeight: 600 }}>{difficulty}</span>
          </div>
          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: urgency === 'critical' ? 'rgba(244,63,94,0.15)' : urgency === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${urgency === 'critical' ? 'rgba(244,63,94,0.3)' : urgency === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.3s' }}>
            <Clock size={13} color={urgency === 'critical' ? '#f43f5e' : urgency === 'warning' ? '#f59e0b' : '#52526a'} />
            <span className="font-display" style={{ fontSize: '0.85rem', fontWeight: 700, color: urgency === 'critical' ? '#f43f5e' : urgency === 'warning' ? '#f59e0b' : '#a1a1b5' }}>{formattedTime}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', marginBottom: '2rem', overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', borderRadius: '999px' }} animate={{ width: `${((index + 1) / puzzles.length) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>

        {/* Puzzle card */}
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
            style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#52526a', marginBottom: '0.75rem' }}>Find the missing number</p>
              <div className="font-display" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', letterSpacing: '0.05em', padding: '1.5rem', background: 'rgba(139,92,246,0.06)', borderRadius: '1rem', border: '1px solid rgba(139,92,246,0.12)' }}>
                {puzzle.question}
              </div>
            </div>

            {/* Hint */}
            {hintUsed && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '0.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
                <Lightbulb size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '0.85rem', color: '#fbbf24', lineHeight: 1.5 }}>{puzzle.hint}</p>
              </motion.div>
            )}

            {/* Input */}
            {!showResult ? (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && answer && handleSubmit()}
                  placeholder="Enter your answer..."
                  className="input-dark"
                  style={{ flex: 1, textAlign: 'center', fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}
                  autoFocus
                />
                <button onClick={() => answer && handleSubmit()} className="btn-primary" style={{ flexShrink: 0, padding: '0.75rem 1.5rem' }}>
                  Submit
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                {/* Result banner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderRadius: '0.85rem', background: result === 'correct' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', border: `1px solid ${result === 'correct' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, marginBottom: '1rem' }}>
                  {result === 'correct' ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#f43f5e" />}
                  <div>
                    <div style={{ fontWeight: 700, color: result === 'correct' ? '#10b981' : '#f43f5e', fontSize: '0.95rem' }}>
                      {result === 'correct' ? '🎉 Correct!' : `Wrong — The answer was ${puzzle.answer}`}
                    </div>
                    {result === 'correct' && <div style={{ fontSize: '0.8rem', color: '#10b981' }}>+{hintUsed ? Math.floor(puzzle.xpReward * 0.7) : puzzle.xpReward} XP earned</div>}
                  </div>
                </div>
                {/* Explanation */}
                <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#06b6d4', marginBottom: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Explanation</p>
                  <p style={{ fontSize: '0.875rem', color: '#a1a1b5', lineHeight: 1.65 }}>{puzzle.explanation}</p>
                </div>
                <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {index + 1 >= puzzles.length ? 'See Results' : 'Next Puzzle →'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom actions */}
        {!showResult && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={13} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>Score: {score}</span>
            </div>
            {!hintUsed && (
              <button onClick={() => setHintUsed(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', borderRadius: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s' }}>
                <Lightbulb size={13} /> Use Hint (-30% XP)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
