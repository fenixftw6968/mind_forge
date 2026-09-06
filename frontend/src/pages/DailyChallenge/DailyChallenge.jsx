import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Star, Coins, Lightbulb, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
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
  'memory-challenge':    { label: 'Memory & Recall', icon: '👁️' },
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
  const isSubmittingRef           = useRef(false);

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
        isSubmittingRef.current = false;
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
    if (isSubmittingRef.current || !answer.trim() || submitted) return;
    isSubmittingRef.current = true;
    setSubmitted(true);

    try {
      const res = await api.post('/api/games/daily/attempts', {
        userAnswer: answer.trim(),
        answer: answer.trim(),
        hintUsed: hintUsed
      });

      let parsedPuzzle = {};
      try {
        parsedPuzzle = typeof challenge?.puzzle === 'string' ? JSON.parse(challenge.puzzle) : (challenge?.puzzle || {});
      } catch (err) {}

      const isCorrect = res.data.correct;
      const xpEarned = isCorrect ? (hintUsed ? Math.floor(challenge.xpReward / 2) : challenge.xpReward) : 0;
      const coinEarned = isCorrect ? challenge.coinReward : 0;

      setResult({
        correct: isCorrect,
        xpEarned,
        coinEarned,
        explanation: parsedPuzzle.explanation || ""
      });

      if (isCorrect) {
        showXPPopup(xpEarned, 'Daily Mission Complete!');
      }

      await refreshUser();
    } catch (e) {
      console.error("Failed to submit daily challenge attempt", e);
      setResult({
        correct: false,
        xpEarned: 0,
        coinEarned: 0,
        explanation: "Network verification error. Please retry."
      });
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
        Loading synchronized challenge...
      </div>
    );
  }

  if (!challenge) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F8FAFC', padding: '2rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Active Daily Challenge</h2>
        <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>Check back later for the next daily synchronization.</p>
        <button onClick={() => navigate('/dashboard')} className="pill-btn-blue">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const typeConfig = GAME_TYPE_LABELS[challenge.gameSlug] || { label: 'Daily Cognitive Challenge', icon: '🧠' };

  let puzzleData = {};
  try {
    puzzleData = typeof challenge.puzzle === 'string' ? JSON.parse(challenge.puzzle) : (challenge.puzzle || {});
  } catch (e) {
    puzzleData = { question: challenge.description };
  }

  const hasOptions = Array.isArray(puzzleData.options) && puzzleData.options.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6rem', color: '#F8FAFC', position: 'relative' }}>
      {/* Background Starfield & Texture */}
      <div className="star-field" />
      <div className="binary-texture" />

      {/* Top back navigation */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 1.5rem 0', position: 'relative', zIndex: 10 }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            padding: '0.4rem 1rem',
            color: '#CBD5E1',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#CBD5E1'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Main Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(8, 14, 33, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1.75rem',
            padding: '2.25rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.12)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.2rem' }}>{typeConfig.icon}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              // DAILY SEED • {typeConfig.label}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(59, 130, 246, 0.12)', padding: '0.3rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <Clock size={12} color="#60A5FA" />
              <span className="font-mono" style={{ fontSize: '0.7rem', color: '#60A5FA', fontWeight: 700 }}>RESETS {timeLeft}</span>
            </div>
          </div>

          <h1 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            {challenge.title}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {challenge.description}
          </p>

          {/* Rewards Panel */}
          <div style={{ display: 'flex', gap: '1rem', background: 'rgba(13, 23, 56, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '0.75rem 1rem', borderRadius: '1rem', marginBottom: '1.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={15} color="#FBBF24" fill="#FBBF24" />
              <span className="font-mono" style={{ fontSize: '0.8rem', color: '#FBBF24', fontWeight: 800 }}>+{challenge.xpReward} XP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Coins size={15} color="#FBBF24" />
              <span className="font-mono" style={{ fontSize: '0.8rem', color: '#FBBF24', fontWeight: 800 }}>+{challenge.coinReward} COINS</span>
            </div>
            <div style={{ marginLeft: 'auto', background: 'rgba(59, 130, 246, 0.15)', padding: '0.2rem 0.65rem', borderRadius: '999px', border: '1px solid rgba(59, 130, 246, 0.35)' }}>
              <span className="font-mono" style={{ fontSize: '0.675rem', color: '#60A5FA', fontWeight: 800 }}>{challenge.difficulty}</span>
            </div>
          </div>

          {/* Puzzle Challenge Area */}
          <div style={{ background: 'rgba(13, 23, 56, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem', fontWeight: 700 }}>
              // PROBLEM STATEMENT
            </div>
            <div className="font-display" style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.6, wordBreak: 'break-word' }}>
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
                          borderRadius: '1rem',
                          background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(13, 23, 56, 0.65)',
                          border: `1px solid ${isSelected ? '#3B82F6' : 'rgba(255, 255, 255, 0.08)'}`,
                          color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          fontFamily: 'var(--font-display)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: isSelected ? '0 0 15px rgba(59, 130, 246, 0.25)' : 'none',
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
                    placeholder="Enter your sequence answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                    className="input-dark"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '1rem',
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 700,
                      outline: 'none'
                    }}
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
                      background: 'rgba(59, 130, 246, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '1rem',
                      padding: '0.85rem 1.15rem',
                      display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
                    }}
                  >
                    <Lightbulb size={15} color="#60A5FA" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                    <span style={{ fontSize: '0.825rem', color: '#93C5FD', lineHeight: 1.4, fontWeight: 500 }}>{puzzleData.hint}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {!showHint && puzzleData.hint && (
                  <button
                    type="button"
                    onClick={() => { setShowHint(true); setHintUsed(true); }}
                    className="pill-btn-ghost"
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <Lightbulb size={13} color="#FBBF24" /> HINT
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!answer.trim()}
                  className="pill-btn-blue"
                  style={{
                    flex: 2,
                    padding: '0.8rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    opacity: answer.trim() ? 1 : 0.5,
                    cursor: answer.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  SUBMIT SOLUTION →
                </button>
              </div>
            </form>
          ) : (
            /* Results View */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                padding: '1.35rem',
                borderRadius: '1.25rem',
                background: result?.correct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${result?.correct ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  {result?.correct ? <CheckCircle size={22} color="#34d399" /> : <XCircle size={22} color="#f87171" />}
                  <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: result?.correct ? '#34d399' : '#f87171' }}>
                    {result?.correct ? 'CORRECT SOLUTION VERIFIED' : 'INCORRECT ATTEMPT'}
                  </span>
                </div>

                {result?.correct && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399' }}>+{result.xpEarned} XP</span>
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399' }}>+{result.coinEarned} COINS</span>
                  </div>
                )}
              </div>

              {/* Explanation */}
              {result?.explanation && (
                <div style={{ textAlign: 'left', background: 'rgba(13, 23, 56, 0.65)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>// DECRYPTED ANALYSIS</div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>{result.explanation}</div>
                </div>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="pill-btn-blue"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                RETURN TO DASHBOARD
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
