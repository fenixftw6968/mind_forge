import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Star, Coins, Lightbulb, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import XPPopup from '../../components/XPPopup/XPPopup';
import { getDailyCountdown, subscribeToMidnightIST } from '../../services/dailyQuestionService';
import api from '../../utils/api';

const GAME_TYPE_LABELS = {
  'dsa-master-quiz':     { label: 'DSA & Algorithms', icon: '🧠' },
  'logic-puzzle':        { label: 'Logic & Reasoning', icon: '🧩' },
  'brain-teaser-battle': { label: 'Brain Teaser Battle', icon: '⚡' },
  'number-detective':    { label: 'Number Sequence', icon: '🔢' },
  'memory-challenge':    { label: 'Memory & Recall', icon: '🧠' },
  'code-breaker':        { label: 'Code Breaker', icon: '🔐' },
};

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
  const [result, setResult]       = useState(null);
  const [timeLeft, setTimeLeft]   = useState(() => getDailyCountdown().formatted);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/games/daily');
      setChallenge(res.data);
      if (res.data.completedToday) {
        setSubmitted(true);
        let expl = "";
        try {
          expl = JSON.parse(res.data.puzzle).explanation;
        } catch (e) {}
        setResult({
          correct: res.data.isCorrect,
          xpEarned: res.data.xpEarned || 0,
          coinEarned: res.data.coinsEarned || 0,
          explanation: expl
        });
      } else {
        setSubmitted(false);
        setResult(null);
        setAnswer('');
        setShowHint(false);
        setHintUsed(false);
      }
    } catch (e) {
      console.error("Failed to load daily challenge", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  // Sync live countdown to 12:00:00 AM IST & auto-refresh challenge when date flips
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getDailyCountdown().formatted);
    }, 1000);

    const unsubscribe = subscribeToMidnightIST(() => {
      fetchChallenge();
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!answer.trim() || submitted) return;

    try {
      const res = await api.post('/api/games/daily/attempts', {
        userAnswer: answer.trim(),
        answer: answer.trim(),
        hintUsed: hintUsed
      });

      let parsedPuzzle = {};
      try {
        parsedPuzzle = JSON.parse(challenge.puzzle);
      } catch (err) {}

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
      <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#94A3B8', fontSize: '1rem', fontWeight: 600 }}>Loading Today's Challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2.5rem', background: '#242424', borderRadius: '1rem', border: '1px solid #2E2E2E', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
          <div style={{ color: '#94A3B8', marginBottom: '1.25rem', fontWeight: 500 }}>No daily challenge available for today. Check back later!</div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  let puzzleData = {};
  try {
    puzzleData = JSON.parse(challenge.puzzle);
  } catch (err) {
    puzzleData = { question: challenge.puzzle, hint: "" };
  }

  const typeConfig = GAME_TYPE_LABELS[challenge.type] || { label: 'Daily Challenge', icon: '🎮' };
  const hasOptions = Array.isArray(puzzleData.options) && puzzleData.options.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F8FAFC' }}>
      <XPPopup popups={xpPopups} />
      
      <div style={{ maxWidth: '620px', width: '100%', padding: '2rem 1.5rem' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#242424',
            border: '1px solid #2E2E2E',
            borderRadius: '1.25rem',
            padding: '2.25rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.1rem' }}>{typeConfig.icon}</span>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#FB7185', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Daily Challenge • {typeConfig.label}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(244, 63, 94, 0.12)', padding: '0.2rem 0.55rem', borderRadius: '999px', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
              <Clock size={12} color="#FB7185" />
              <span style={{ fontSize: '0.7rem', color: '#FB7185', fontWeight: 700 }}>Resets in {timeLeft}</span>
            </div>
          </div>

          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            {challenge.title}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
            {challenge.description}
          </p>

          {/* Rewards Panel */}
          <div style={{ display: 'flex', gap: '1rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.65rem 0.85rem', borderRadius: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Star size={15} color="#FBBF24" fill="#FBBF24" />
              <span style={{ fontSize: '0.8rem', color: '#FBBF24', fontWeight: 800 }}>+{challenge.xpReward} XP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Coins size={15} color="#FBBF24" />
              <span style={{ fontSize: '0.8rem', color: '#FBBF24', fontWeight: 800 }}>+{challenge.coinReward} Coins</span>
            </div>
            <div style={{ marginLeft: 'auto', background: 'rgba(34, 197, 94, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
              <span style={{ fontSize: '0.675rem', color: '#4ADE80', fontWeight: 800 }}>{challenge.difficulty}</span>
            </div>
          </div>

          {/* Puzzle Challenge Area */}
          <div style={{ background: '#1C1C1C', border: '1px solid #2E2E2E', borderRadius: '0.875rem', padding: '1.35rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', fontWeight: 700 }}>
              Challenge Puzzle
            </div>
            <div className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.5, wordBreak: 'break-word' }}>
              {puzzleData.question}
            </div>
          </div>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {hasOptions ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {puzzleData.options.map((opt) => {
                    const isSelected = answer === opt;
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setAnswer(opt)}
                        style={{
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          background: isSelected ? 'rgba(34, 197, 94, 0.15)' : '#1C1C1C',
                          border: `1px solid ${isSelected ? '#22C55E' : '#2E2E2E'}`,
                          color: isSelected ? '#4ADE80' : '#F8FAFC',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Enter your solution..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                    className="input-dark"
                    style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 600, padding: '0.85rem', background: '#1C1C1C', border: '1px solid #2E2E2E' }}
                  />
                </div>
              )}

              {/* Hint */}
              <AnimatePresence>
                {showHint && puzzleData.hint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      background: 'rgba(34, 197, 94, 0.08)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: '0.625rem',
                      padding: '0.75rem',
                      display: 'flex', gap: '0.45rem', alignItems: 'flex-start'
                    }}
                  >
                    <Lightbulb size={15} color="#4ADE80" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                    <span style={{ fontSize: '0.8rem', color: '#4ADE80', lineHeight: 1.4, fontWeight: 500 }}>{puzzleData.hint}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {!showHint && puzzleData.hint && (
                  <button
                    type="button"
                    onClick={() => { setShowHint(true); setHintUsed(true); }}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
                  >
                    <Lightbulb size={14} /> Use Hint
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!answer.trim()}
                  className="btn-primary"
                  style={{ flex: 2, padding: '0.75rem', fontSize: '0.875rem', opacity: answer.trim() ? 1 : 0.5 }}
                >
                  Submit Solution →
                </button>
              </div>
            </form>
          ) : (
            /* Results View */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                padding: '1.25rem',
                borderRadius: '0.875rem',
                background: result?.correct ? 'rgba(34, 197, 94, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                border: `1px solid ${result?.correct ? 'rgba(34, 197, 94, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  {result?.correct ? <CheckCircle size={20} color="#4ADE80" /> : <XCircle size={20} color="#FB7185" />}
                  <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: result?.correct ? '#4ADE80' : '#FB7185' }}>
                    {result?.correct ? 'Correct! Puzzle Solved' : 'Incorrect Attempt'}
                  </span>
                </div>

                {result?.correct && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4ADE80' }}>+{result.xpEarned} XP</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4ADE80' }}>+{result.coinEarned} Coins</span>
                  </div>
                )}
              </div>

              {/* Explanation */}
              {result?.explanation && (
                <div style={{ textAlign: 'left', background: '#1C1C1C', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #2E2E2E', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Explanation</div>
                  <div style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.5 }}>{result.explanation}</div>
                </div>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
