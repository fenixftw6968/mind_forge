import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Star, Coins, Lightbulb, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import XPPopup from '../../components/XPPopup/XPPopup';
import api from '../../utils/api';

export default function DailyChallenge() {
  const { user, refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [answer, setAnswer]       = useState('');
  const [hintUsed, setHintUsed]   = useState(false);
  const [showHint, setShowHint]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult]       = useState(null); // { correct, xpEarned, coinEarned, explanation }

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await api.get('/api/games/daily');
        setChallenge(res.data);
        if (res.data.completedToday) {
          setSubmitted(true);
          setResult({
            correct: true,
            xpEarned: 0,
            coinEarned: 0,
            explanation: JSON.parse(res.data.puzzle).explanation
          });
        }
      } catch (e) {
        console.error("Failed to load daily challenge", e);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || submitted) return;

    try {
      const res = await api.post('/api/games/daily/attempts', {
        answer: answer.trim()
      });

      const parsedPuzzle = JSON.parse(challenge.puzzle);

      setResult({
        correct: res.data.correct,
        xpEarned: res.data.xpEarned,
        coinEarned: res.data.coinEarned,
        explanation: parsedPuzzle.explanation
      });

      if (res.data.correct && res.data.xpEarned > 0) {
        showXPPopup(res.data.xpEarned);
      }

      setSubmitted(true);

      if (res.data.user) {
        refreshUser(res.data.user);
      }
    } catch (err) {
      console.error("Failed to submit daily challenge attempt", err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#52526a', fontSize: '1.1rem' }} className="font-accent">Loading Today's Challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ color: '#a1a1b5', marginBottom: '1.5rem' }}>No daily challenge available for today. Check back later!</div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const puzzleData = JSON.parse(challenge.puzzle);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '580px', width: '100%', padding: '2rem 1.5rem' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={15} /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(20,20,35,0.8), rgba(10,10,20,0.9))',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Flame size={20} color="#f43f5e" fill="#f43f5e" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f43f5e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Daily Challenge</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.04)', padding: '0.25rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Clock size={12} color="#a1a1b5" />
              <span style={{ fontSize: '0.7rem', color: '#a1a1b5', fontWeight: 600 }}>Resets in {timeLeft}</span>
            </div>
          </div>

          <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
            {challenge.title}
          </h1>
          <p style={{ color: '#a1a1b5', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {challenge.description}
          </p>

          {/* Rewards Panel */}
          <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '0.75rem 1rem', borderRadius: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>+{challenge.xpReward} XP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Coins size={16} color="#f59e0b" />
              <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>+{challenge.coinReward} Coins</span>
            </div>
            <div style={{ marginLeft: 'auto', background: 'rgba(139,92,246,0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(139,92,246,0.25)' }}>
              <span style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 700 }}>{challenge.difficulty}</span>
            </div>
          </div>

          {/* Puzzle Area */}
          <div style={{ background: '#07070c', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#52526a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Sequence</div>
            <div className="font-accent" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', letterSpacing: '0.02em' }}>
              {puzzleData.question}
            </div>
          </div>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <input
                  type="text"
                  placeholder="Enter the missing number..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    textAlign: 'center',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Hint */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      background: 'rgba(139,92,246,0.05)',
                      border: '1px solid rgba(139,92,246,0.15)',
                      borderRadius: '0.75rem',
                      padding: '0.85rem',
                      display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
                    }}
                  >
                    <Lightbulb size={16} color="#a78bfa" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                    <span style={{ fontSize: '0.8rem', color: '#c084fc', lineHeight: 1.4 }}>{puzzleData.hint}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {!showHint && (
                  <button
                    type="button"
                    onClick={() => { setShowHint(true); setHintUsed(true); }}
                    style={{
                      flex: 1,
                      padding: '0.85rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.02)',
                      color: '#a1a1b5',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      transition: 'background 0.2s'
                    }}
                  >
                    <Lightbulb size={15} /> Use Hint
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    flex: 2,
                    padding: '0.85rem',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  Submit Answer
                </button>
              </div>
            </form>
          ) : (
            /* Result Panel */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                border: `1px solid ${result.correct ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                background: result.correct ? 'rgba(16,185,129,0.04)' : 'rgba(244,63,94,0.04)',
                borderRadius: '1rem',
                padding: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                {result.correct ? (
                  <CheckCircle size={36} color="#10b981" />
                ) : (
                  <XCircle size={36} color="#f43f5e" />
                )}
              </div>

              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                {result.correct ? 'Excellent Work!' : 'Incorrect Answer'}
              </h3>

              {challenge.completedToday ? (
                <p style={{ fontSize: '0.85rem', color: '#10b981', marginBottom: '1rem' }}>
                  You have already completed today's challenge!
                </p>
              ) : (
                result.correct ? (
                  <p style={{ fontSize: '0.85rem', color: '#a1a1b5', marginBottom: '1rem' }}>
                    You earned <strong style={{ color: '#f59e0b' }}>+{result.xpEarned} XP</strong> and <strong style={{ color: '#f59e0b' }}>+{result.coinEarned} Coins</strong>!
                  </p>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#a1a1b5', marginBottom: '1rem' }}>
                    The correct answer was <strong style={{ color: 'white' }}>{puzzleData.answer}</strong>.
                  </p>
                )
              )}

              <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '0.7rem', color: '#52526a', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Explanation</div>
                <div style={{ fontSize: '0.8rem', color: '#a1a1b5', lineHeight: 1.5 }}>{result.explanation}</div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <XPPopup popups={xpPopups} />
    </div>
  );
}
