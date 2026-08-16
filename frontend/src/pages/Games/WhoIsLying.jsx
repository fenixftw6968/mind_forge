import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import XPPopup from '../../components/XPPopup/XPPopup';
import api from '../../utils/api';

export default function WhoIsLying() {
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
      const res = await api.get(`/api/games/who-is-lying/puzzles?difficulty=${diff}`);
      const puzzlesData = res.data.map(p => {
        const content = typeof p.content === 'string' ? JSON.parse(p.content) : p.content;
        const ans = typeof p.correctAnswer === 'string' ? JSON.parse(p.correctAnswer) : p.correctAnswer;
        return {
          ...p,
          scenario: content.scenario,
          rule: content.rule,
          characters: content.characters,
          choices: content.choices,
          hint: content.hint,
          question: content.question,
          answer: ans.answer
        };
      });
      const shuffled = [...puzzlesData].sort(() => Math.random() - 0.5).slice(0, 3);
      setPuzzles(shuffled);
      setDifficulty(diff);
      setIndex(0); setScore(0); setTotalXP(0);
      setSelected(null); setHintUsed(false); setShowResult(false); setShowComplete(false);
      setLatestUser(null);
    } catch (e) {
      console.error("Failed to load puzzles", e);
    }
  };

  const handleSelect = (choiceId) => {
    if (showResult) return;
    setSelected(choiceId);
  };

  const handleAnswer = async () => {
    if (!selected || showResult) return;
    const isCorrect = selected === puzzle.answer;
    setShowResult(true);

    try {
      const res = await api.post('/api/games/who-is-lying/attempts', {
        puzzleId: puzzle.id,
        userAnswer: selected,
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
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎭</div>
              <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Who Is Lying?</h1>
              <p style={{ color: '#a1a1b5' }}>Characters make contradictory statements. Use pure logic to find the liar.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {['EASY', 'MEDIUM', 'HARD'].map(d => {
                const colors = { EASY: '#10b981', MEDIUM: '#f59e0b', HARD: '#f43f5e' };
                const descs  = { EASY: '3 characters, simple contradiction', MEDIUM: '4 characters, requires testing each case', HARD: '5+ characters, complex conditionals' };
                const c      = colors[d];
                return (
                  <motion.button key={d} whileHover={{ scale: 1.02 }} onClick={() => startGame(d)}
                    style={{ width: '100%', padding: '1.25rem', borderRadius: '1rem', background: `${c}12`, border: `1px solid ${c}25`, cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center', textAlign: 'left' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${c}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                      {d === 'EASY' ? '😊' : d === 'MEDIUM' ? '🤔' : '😈'}
                    </div>
                    <div>
                      <div className="font-accent" style={{ fontWeight: 700, color: c, fontSize: '1rem' }}>{d}</div>
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
            {score >= puzzles.length * 0.7 ? 'Lie Detector!' : 'Keep Practicing!'}
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
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button onClick={() => setDifficulty(null)} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Exit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#52526a' }}>Puzzle {index + 1}/{puzzles.length}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Star size={13} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>Score: {score}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', marginBottom: '2rem', overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', borderRadius: '999px' }} animate={{ width: `${((index + 1) / puzzles.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            {/* Scenario */}
            <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>The Scenario</p>
              <p style={{ color: '#e1e1f0', lineHeight: 1.7, fontSize: '0.95rem' }}>{puzzle.scenario}</p>
              {puzzle.rule && (
                <div style={{ marginTop: '0.85rem', padding: '0.75rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#67e8f9', fontWeight: 500 }}>📋 Rule: {puzzle.rule}</span>
                </div>
              )}
            </div>

            {/* Characters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {puzzle.characters.map((char) => (
                <div key={char.id} style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.1rem', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{char.avatar}</span>
                    <span className="font-accent" style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{char.name}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#a1a1b5', lineHeight: 1.55, fontStyle: 'italic' }}>"{char.statement}"</p>
                </div>
              ))}
            </div>

            {/* Hint */}
            {hintUsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '0.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
                <Lightbulb size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '0.85rem', color: '#fbbf24', lineHeight: 1.5 }}>{puzzle.hint}</p>
              </motion.div>
            )}

            {/* Choices */}
            <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a1a1b5', marginBottom: '1rem' }}>{puzzle.question}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {puzzle.choices.map(choice => {
                  let borderColor = 'rgba(255,255,255,0.06)';
                  let bg = 'rgba(255,255,255,0.02)';
                  let color = '#a1a1b5';
                  if (selected === choice.id) { borderColor = '#8b5cf6'; bg = 'rgba(139,92,246,0.1)'; color = '#a78bfa'; }
                  if (showResult && choice.id === puzzle.answer) { borderColor = '#10b981'; bg = 'rgba(16,185,129,0.1)'; color = '#10b981'; }
                  if (showResult && selected === choice.id && choice.id !== puzzle.answer) { borderColor = '#f43f5e'; bg = 'rgba(244,63,94,0.1)'; color = '#f43f5e'; }
                  return (
                    <button key={choice.id} onClick={() => handleSelect(choice.id)} disabled={showResult}
                      style={{ padding: '0.85rem 1.1rem', borderRadius: '0.75rem', border: `1px solid ${borderColor}`, background: bg, color, textAlign: 'left', cursor: showResult ? 'default' : 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {showResult && choice.id === puzzle.answer && <CheckCircle size={15} color="#10b981" />}
                      {showResult && selected === choice.id && choice.id !== puzzle.answer && <XCircle size={15} color="#f43f5e" />}
                      {choice.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation (after reveal) */}
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Explanation</p>
                  <p style={{ fontSize: '0.875rem', color: '#a1a1b5', lineHeight: 1.7 }}>{puzzle.explanation || puzzle.answerExplanation}</p>
                </div>
                <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {index + 1 >= puzzles.length ? 'See Results 🏆' : 'Next Puzzle →'}
                </button>
              </motion.div>
            )}

            {/* Actions */}
            {!showResult && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!hintUsed ? (
                  <button onClick={() => setHintUsed(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', borderRadius: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
                    <Lightbulb size={13} /> Hint (-30% XP)
                  </button>
                ) : <div />}
                <button onClick={handleAnswer} disabled={!selected} className="btn-primary" style={{ opacity: selected ? 1 : 0.5 }}>
                  Submit Answer
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
