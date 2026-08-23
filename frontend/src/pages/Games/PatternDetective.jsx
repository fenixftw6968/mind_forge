import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import XPPopup from '../../components/XPPopup/XPPopup';
import DifficultySelector from '../../components/DifficultySelector/DifficultySelector';
import GameProgress from '../../components/GameProgress/GameProgress';
import GameResults from '../../components/GameResults/GameResults';
import { getDailyQuestionSet } from '../../services/dailyQuestionService';
import { patternDetectiveQuestions } from '../../data/patternDetectiveQuestions';
import api from '../../utils/api';

const XP_PER_DIFFICULTY = { EASY: 15, MEDIUM: 25, HARD: 50 };

export default function PatternDetective() {
  const { refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();

  const [difficulty, setDifficulty]     = useState(null);
  const [puzzles, setPuzzles]           = useState([]);
  const [index, setIndex]               = useState(0);
  const [selected, setSelected]         = useState(null);
  const [hintUsed, setHintUsed]         = useState(false);
  const [showResult, setShowResult]     = useState(false);
  const [score, setScore]               = useState(0);
  const [totalXP, setTotalXP]           = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [latestUser, setLatestUser]     = useState(null);

  const puzzle = puzzles[index];

  const startGame = (diff) => {
    const selectedList = getDailyQuestionSet({
      gameType: 'pattern-detective',
      difficulty: diff,
      questionBank: patternDetectiveQuestions,
      count: 10,
      userShuffle: true
    });

    setPuzzles(selectedList);
    setDifficulty(diff);
    setIndex(0);
    setScore(0);
    setTotalXP(0);
    setSelected(null);
    setHintUsed(false);
    setShowResult(false);
    setShowComplete(false);
    setLatestUser(null);
  };

  // Guarantee clean answer state on every question index change
  useEffect(() => {
    setSelected(null);
    setHintUsed(false);
    setShowResult(false);
  }, [index, puzzles]);

  const handleAnswer = async (choice) => {
    if (showResult || selected) return;
    const isCorrect = choice === puzzle.correctAnswer;
    setSelected(choice);
    setShowResult(true);

    const baseXP = XP_PER_DIFFICULTY[(puzzle.difficulty || difficulty || 'MEDIUM').toUpperCase()] || 20;
    const earned = isCorrect ? (hintUsed ? Math.floor(baseXP * 0.7) : baseXP) : 0;

    if (isCorrect) {
      setScore(s => s + 1);
      setTotalXP(t => t + earned);
      showXPPopup(earned);
    }

    try {
      const res = await api.post('/api/games/pattern-detective/attempts', {
        puzzleId: puzzle.id,
        userAnswer: choice,
        hintUsed: hintUsed,
        timeTakenSeconds: 15
      });

      if (res.data?.user) {
        setLatestUser(res.data.user);
      }
    } catch (e) {
      // Offline fallback
    }
  };

  const handleNext = () => {
    setSelected(null);
    setHintUsed(false);
    setShowResult(false);
    if (index + 1 >= puzzles.length) {
      if (latestUser) {
        refreshUser(latestUser);
      }
      setShowComplete(true);
    } else {
      setIndex(i => i + 1);
    }
  };

  if (!difficulty) {
    return (
      <DifficultySelector
        title="Pattern Detective"
        subtitle="Spot the hidden relationship in the grid. Find the missing piece."
        icon="🧩"
        onSelectDifficulty={(diff) => startGame(diff)}
        onBack={() => navigate('/games')}
        customTiers={[
          { id: 'EASY', label: 'Easy', icon: '🌱', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', xp: '+15 XP', time: 'Relaxed', desc: 'Row and column sequence rules' },
          { id: 'MEDIUM', label: 'Medium', icon: '🧠', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', xp: '+25 XP', time: 'Moderate', desc: 'Multi-rule mathematical matrices and geometric transforms' },
          { id: 'HARD', label: 'Hard', icon: '🔥', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', xp: '+50 XP', time: 'Intense', desc: 'Complex polynomials, binary logic, and factorials' }
        ]}
      />
    );
  }

  if (showComplete) {
    return (
      <GameResults
        score={score}
        total={puzzles.length}
        xpEarned={totalXP}
        gameTitle="Pattern Detective"
        onPlayAgain={() => startGame(difficulty)}
      />
    );
  }

  if (!puzzle) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Progress Header */}
        <GameProgress
          current={index + 1}
          total={puzzles.length}
          score={score}
          difficulty={difficulty}
          onExit={() => setDifficulty(null)}
          onMidnightRollover={() => startGame(difficulty)}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '2rem', marginBottom: '1.25rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
              {puzzle.description && (
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.25rem', textAlign: 'center', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {puzzle.description}
                </p>
              )}

              {/* Matrix Grid */}
              {Array.isArray(puzzle.grid) && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${puzzle.grid[0].length}, 1fr)`, gap: '0.65rem', maxWidth: '280px', width: '100%' }}>
                    {puzzle.grid.flat().map((cell, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className={cell === '?' ? 'pattern-cell missing' : 'pattern-cell'}
                        style={{
                          aspectRatio: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: cell === '?' ? '#EEF2FF' : '#F8FAFC',
                          border: `1px solid ${cell === '?' ? '#6366F1' : '#E2E8F0'}`,
                          borderRadius: '0.65rem',
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: cell === '?' ? '#4F46E5' : '#0F172A',
                          animation: cell === '?' ? 'pulse-glow 2s infinite' : 'none'
                        }}
                      >
                        {cell}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hint */}
              {hintUsed && puzzle.hint && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '0.5rem', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
                  <Lightbulb size={16} color="#D97706" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.85rem', color: '#B45309', fontWeight: 500 }}>{puzzle.hint}</p>
                </motion.div>
              )}

              {/* Choices */}
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', textAlign: 'center' }}>
                  {puzzle.question || "What replaces the ?"}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                  {puzzle.choices.map(choice => {
                    let borderColor = '#E2E8F0';
                    let bg = '#FFFFFF';
                    let color = '#0F172A';

                    if (selected === choice) {
                      borderColor = selected === puzzle.correctAnswer ? '#A7F3D0' : '#FECDD3';
                      bg = selected === puzzle.correctAnswer ? '#ECFDF5' : '#FFF1F2';
                      color = selected === puzzle.correctAnswer ? '#047857' : '#BE123C';
                    }
                    if (showResult && choice === puzzle.correctAnswer && selected !== choice) {
                      borderColor = '#A7F3D0';
                      bg = '#ECFDF5';
                      color = '#047857';
                    }

                    return (
                      <motion.button
                        key={choice}
                        whileHover={!showResult ? { scale: 1.01 } : {}}
                        onClick={() => handleAnswer(choice)}
                        disabled={showResult}
                        style={{
                          padding: '0.95rem',
                          borderRadius: '0.75rem',
                          border: `1px solid ${borderColor}`,
                          background: bg,
                          color,
                          cursor: showResult ? 'default' : 'pointer',
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.03)',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {showResult && choice === puzzle.correctAnswer && <CheckCircle size={17} color="#059669" />}
                        {showResult && selected === choice && choice !== puzzle.correctAnswer && <XCircle size={17} color="#E11D48" />}
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
                <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0284C7', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Pattern Explained</p>
                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>{puzzle.explanation}</p>
                </div>
                <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                  {index + 1 >= puzzles.length ? 'See Results 🏆' : 'Next Pattern →'}
                </button>
              </motion.div>
            )}

            {!showResult && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!hintUsed && puzzle.hint && (
                  <button onClick={() => setHintUsed(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309', borderRadius: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                    <Lightbulb size={14} /> Hint (-30% XP)
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
