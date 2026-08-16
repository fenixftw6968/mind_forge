import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import XPPopup from '../../components/XPPopup/XPPopup';
import api from '../../utils/api';

export default function SpotFallacy() {
  const { refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();

  const [started, setStarted]   = useState(false);
  const [puzzles, setPuzzles]   = useState([]);
  const [index, setIndex]       = useState(0);
  const [selected, setSelected] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore]       = useState(0);
  const [totalXP, setTotalXP]   = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [latestUser, setLatestUser] = useState(null);

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const res = await api.get('/api/games/spot-fallacy/puzzles');
        const parsed = res.data.map(p => {
          const content = typeof p.content === 'string' ? JSON.parse(p.content) : p.content;
          const ans = typeof p.correctAnswer === 'string' ? JSON.parse(p.correctAnswer) : p.correctAnswer;
          return {
            ...p,
            statement: content.statement,
            question: content.question,
            choices: content.choices,
            hint: content.hint,
            answer: ans.answer,
            description: content.description
          };
        });
        setPuzzles(parsed);
      } catch (e) {
        console.error("Failed to fetch fallacy puzzles", e);
      }
    };
    fetchPuzzles();
  }, []);

  const puzzle  = puzzles[index];

  const startGame = () => setStarted(true);

  const handleAnswer = async (choice) => {
    if (showResult) return;
    setSelected(choice);
    const isCorrect = choice === puzzle.answer;
    setShowResult(true);

    try {
      const res = await api.post('/api/games/spot-fallacy/attempts', {
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

  if (puzzles.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#52526a' }}>Loading Puzzles...</div>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '560px', width: '100%', padding: '2rem' }}>
          <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Back to Games
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚖️</div>
            <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>Spot the Fallacy</h1>
            <p style={{ color: '#a1a1b5', lineHeight: 1.7, marginBottom: '2rem' }}>
              Read each argument carefully. Identify the logical fallacy that makes the argument flawed. 
              <strong style={{ color: '#a78bfa' }}> {puzzles.length} challenges</strong> await.
            </p>
            <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1rem', padding: '1.25rem', textAlign: 'left', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fallacies You'll Encounter</p>
              {['Correlation vs Causation', 'False Dilemma', 'Hasty Generalization', 'Slippery Slope', 'Appeal to False Authority', 'Appeal to Tradition'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem', color: '#a1a1b5' }}>
                  <span style={{ color: '#8b5cf6', fontSize: '0.7rem' }}>▸</span> {f}
                </div>
              ))}
            </div>
            <button onClick={startGame} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}>
              Start Challenge →
            </button>
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
            {score >= puzzles.length * 0.7 ? 'Logic Legend!' : 'Keep Learning!'}
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
            <button onClick={() => { setStarted(false); setIndex(0); setScore(0); setTotalXP(0); setSelected(null); setHintUsed(false); setShowResult(false); setShowComplete(false); }} className="btn-primary">Play Again</button>
            <button onClick={() => navigate('/games')} className="btn-secondary">Games</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button onClick={() => setStarted(false)} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Exit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#52526a' }}>Q {index + 1}/{puzzles.length}</span>
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
              <div style={{ display: 'flex', align: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', background: puzzle.difficulty === 'EASY' ? 'rgba(16,185,129,0.12)' : puzzle.difficulty === 'MEDIUM' ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)', color: puzzle.difficulty === 'EASY' ? '#10b981' : puzzle.difficulty === 'MEDIUM' ? '#f59e0b' : '#f43f5e', fontSize: '0.7rem', fontWeight: 600, border: `1px solid ${puzzle.difficulty === 'EASY' ? 'rgba(16,185,129,0.25)' : puzzle.difficulty === 'MEDIUM' ? 'rgba(245,158,11,0.25)' : 'rgba(244,63,94,0.25)'}` }}>{puzzle.difficulty}</span>
              </div>

              <blockquote style={{ fontSize: '1.05rem', color: '#e1e1f0', lineHeight: 1.75, fontStyle: 'italic', padding: '1.25rem 1.5rem', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.12)', borderLeft: '3px solid #8b5cf6', borderRadius: '0 0.75rem 0.75rem 0', marginBottom: '1.5rem' }}>
                {puzzle.statement}
              </blockquote>

              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a1a1b5', marginBottom: '1rem' }}>{puzzle.question}</p>

              {hintUsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '0.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
                  <Lightbulb size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.85rem', color: '#fbbf24' }}>{puzzle.hint}</p>
                </motion.div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {puzzle.choices.map(choice => {
                  let borderColor = 'rgba(255,255,255,0.06)';
                  let bg = 'rgba(255,255,255,0.02)';
                  let color = '#a1a1b5';
                  if (showResult && choice === puzzle.answer) { borderColor = '#10b981'; bg = 'rgba(16,185,129,0.1)'; color = '#10b981'; }
                  else if (selected === choice && showResult) { borderColor = '#f43f5e'; bg = 'rgba(244,63,94,0.1)'; color = '#f43f5e'; }
                  else if (selected === choice) { borderColor = '#8b5cf6'; bg = 'rgba(139,92,246,0.1)'; color = '#a78bfa'; }
                  return (
                    <button key={choice} onClick={() => handleAnswer(choice)} disabled={showResult}
                      style={{ padding: '0.85rem 1.1rem', borderRadius: '0.75rem', border: `1px solid ${borderColor}`, background: bg, color, textAlign: 'left', cursor: showResult ? 'default' : 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {showResult && choice === puzzle.answer && <CheckCircle size={14} color="#10b981" />}
                      {showResult && selected === choice && choice !== puzzle.answer && <XCircle size={14} color="#f43f5e" />}
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>

            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Why This Is a Fallacy</p>
                  <p style={{ fontSize: '0.875rem', color: '#a1a1b5', lineHeight: 1.7 }}>{puzzle.explanation}</p>
                </div>
                <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {index + 1 >= puzzles.length ? 'See Results 🏆' : 'Next Fallacy →'}
                </button>
              </motion.div>
            )}

            {!showResult && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!hintUsed && (
                  <button onClick={() => setHintUsed(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', borderRadius: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <Lightbulb size={13} /> Hint (-30% XP)
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
