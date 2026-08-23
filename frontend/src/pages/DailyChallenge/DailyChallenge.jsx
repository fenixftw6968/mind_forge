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
            correct: res.data.isCorrect,
            xpEarned: res.data.xpEarned || 0,
            coinEarned: res.data.coinsEarned || 0,
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
        userAnswer: answer.trim(),
        answer: answer.trim(),
        hintUsed: hintUsed
      });

      const parsedPuzzle = JSON.parse(challenge.puzzle);

      setResult({
        correct: res.data.isCorrect,
        xpEarned: res.data.xpEarned,
        coinEarned: res.data.coinEarned,
        explanation: parsedPuzzle.explanation
      });

      if (res.data.isCorrect && res.data.xpEarned > 0) {
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
      <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#64748B', fontSize: '1.1rem', fontWeight: 600 }} className="font-accent">Loading Today's Challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem', background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ color: '#64748B', marginBottom: '1.5rem', fontWeight: 500 }}>No daily challenge available for today. Check back later!</div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const puzzleData = JSON.parse(challenge.puzzle);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '580px', width: '100%', padding: '2rem 1.5rem' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '1.25rem',
            padding: '2rem',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Flame size={20} color="#E11D48" fill="#E11D48" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E11D48', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Daily Challenge</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#FFF1F2', padding: '0.25rem 0.65rem', borderRadius: '999px', border: '1px solid #FECDD3' }}>
              <Clock size={12} color="#E11D48" />
              <span style={{ fontSize: '0.725rem', color: '#BE123C', fontWeight: 700 }}>Resets in {timeLeft}</span>
            </div>
          </div>

          <h1 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {challenge.title}
          </h1>
          <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {challenge.description}
          </p>

          {/* Rewards Panel */}
          <div style={{ display: 'flex', gap: '1rem', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.75rem 1rem', borderRadius: '0.875rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={16} color="#D97706" fill="#D97706" />
              <span style={{ fontSize: '0.85rem', color: '#B45309', fontWeight: 800 }}>+{challenge.xpReward} XP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Coins size={16} color="#D97706" />
              <span style={{ fontSize: '0.85rem', color: '#B45309', fontWeight: 800 }}>+{challenge.coinReward} Coins</span>
            </div>
            <div style={{ marginLeft: 'auto', background: '#EEF2FF', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid #C7D2FE' }}>
              <span style={{ fontSize: '0.7rem', color: '#4F46E5', fontWeight: 800 }}>{challenge.difficulty}</span>
            </div>
          </div>

          {/* Puzzle Area */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.725rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>Sequence</div>
            <div className="font-accent" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '0.02em' }}>
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
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.75rem',
                    color: '#0F172A',
                    fontSize: '1rem',
                    fontWeight: 600,
                    outline: 'none',
                    textAlign: 'center',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.03)'; }}
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
                      background: '#EEF2FF',
                      border: '1px solid #C7D2FE',
                      borderRadius: '0.75rem',
                      padding: '0.85rem',
                      display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
                    }}
                  >
                    <Lightbulb size={16} color="#4F46E5" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                    <span style={{ fontSize: '0.825rem', color: '#3730A3', lineHeight: 1.4, fontWeight: 500 }}>{puzzleData.hint}</span>
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
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      color: '#475569',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                      transition: 'all 0.15s ease'
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
                    fontSize: '0.925rem',
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
                border: `1px solid ${result.correct ? '#A7F3D0' : '#FECDD3'}`,
                background: result.correct ? '#ECFDF5' : '#FFF1F2',
                borderRadius: '1rem',
                padding: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                {result.correct ? (
                  <CheckCircle size={38} color="#059669" />
                ) : (
                  <XCircle size={38} color="#E11D48" />
                )}
              </div>

              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: result.correct ? '#047857' : '#BE123C', marginBottom: '0.5rem' }}>
                {result.correct ? 'Excellent Work!' : 'Incorrect Answer'}
              </h3>

              {challenge.completedToday ? (
                <p style={{ fontSize: '0.875rem', color: '#059669', marginBottom: '1rem', fontWeight: 600 }}>
                  You have already completed today's challenge!
                </p>
              ) : (
                result.correct ? (
                  <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem', fontWeight: 500 }}>
                    You earned <strong style={{ color: '#D97706', fontWeight: 800 }}>+{result.xpEarned} XP</strong> and <strong style={{ color: '#D97706', fontWeight: 800 }}>+{result.coinEarned} Coins</strong>!
                  </p>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
                    The correct answer was <strong style={{ color: '#0F172A', fontWeight: 800 }}>{puzzleData.answer}</strong>.
                  </p>
                )
              )}

              <div style={{ textAlign: 'left', background: '#FFFFFF', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.725rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.25rem' }}>Explanation</div>
                <div style={{ fontSize: '0.825rem', color: '#334155', lineHeight: 1.5, fontWeight: 500 }}>{result.explanation}</div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontWeight: 700,
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
