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
import { spotFallacyQuestions } from '../../data/spotFallacyQuestions';
import api from '../../utils/api';

const XP_PER_DIFFICULTY = { EASY: 15, MEDIUM: 25, HARD: 50 };

export default function SpotFallacy() {
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
      gameType: 'spot-fallacy',
      difficulty: diff,
      questionBank: spotFallacyQuestions,
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

  const handleAnswer = async (choice) => {
    if (showResult) return;
    setSelected(choice);
    const isCorrect = choice === puzzle.correctAnswer;
    setShowResult(true);

    const baseXP = XP_PER_DIFFICULTY[(puzzle.difficulty || difficulty || 'MEDIUM').toUpperCase()] || 25;
    const earned = isCorrect ? (hintUsed ? Math.floor(baseXP * 0.7) : baseXP) : 0;

    if (isCorrect) {
      setScore(s => s + 1);
      setTotalXP(t => t + earned);
      showXPPopup(earned);
    }

    try {
      const res = await api.post('/api/games/spot-fallacy/attempts', {
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
    if (index + 1 >= puzzles.length) {
      if (latestUser) {
        refreshUser(latestUser);
      }
      setShowComplete(true);
    } else {
      setIndex(i => i + 1);
      setSelected(null);
      setHintUsed(false);
      setShowResult(false);
    }
  };

  if (!difficulty) {
    return (
      <DifficultySelector
        title="Spot the Fallacy"
        subtitle="Deconstruct deceptive arguments and uncover the underlying logical fallacy."
        icon="⚖️"
        onSelectDifficulty={(diff) => startGame(diff)}
        onBack={() => navigate('/games')}
        customTiers={[
          { id: 'EASY', label: 'Easy', icon: '🌱', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', xp: '+15 XP', time: 'Relaxed', desc: 'Classic fallacies: Ad Hominem, Straw Man, False Dilemma' },
          { id: 'MEDIUM', label: 'Medium', icon: '🧠', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', xp: '+25 XP', time: 'Moderate', desc: 'Composition, Equivocation, Tu Quoque, and Texas Sharpshooter' },
          { id: 'HARD', label: 'Hard', icon: '🔥', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', xp: '+50 XP', time: 'Intense', desc: 'Sunk Cost, Fallacy Fallacy, Continuum Fallacy, and Genetic Fallacy' }
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
        gameTitle="Spot the Fallacy"
        onPlayAgain={() => startGame(difficulty)}
      />
    );
  }

  if (!puzzle) return null;

  const optionsList = puzzle.options || puzzle.choices || [];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '750px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Header Progress */}
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
              
              {/* Argument Statement */}
              <p style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                The Argument
              </p>
              <blockquote
                style={{
                  fontSize: '1.1rem',
                  color: '#1E293B',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  padding: '1.25rem 1.5rem',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderLeft: '4px solid #6366F1',
                  borderRadius: '0 0.75rem 0.75rem 0',
                  marginBottom: '1.5rem'
                }}
              >
                "{puzzle.statement}"
              </blockquote>

              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
                {puzzle.question || "Which logical fallacy is committed in this statement?"}
              </p>

              {/* Hint */}
              {hintUsed && puzzle.hint && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '0.5rem', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
                  <Lightbulb size={16} color="#D97706" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.85rem', color: '#B45309', fontWeight: 500 }}>{puzzle.hint}</p>
                </motion.div>
              )}

              {/* Choices */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {optionsList.map(choice => {
                  let borderColor = '#E2E8F0';
                  let bg = '#FFFFFF';
                  let color = '#334155';

                  if (showResult && choice === puzzle.correctAnswer) {
                    borderColor = '#A7F3D0';
                    bg = '#ECFDF5';
                    color = '#047857';
                  } else if (selected === choice && showResult) {
                    borderColor = '#FECDD3';
                    bg = '#FFF1F2';
                    color = '#BE123C';
                  } else if (selected === choice) {
                    borderColor = '#C7D2FE';
                    bg = '#EEF2FF';
                    color = '#4338CA';
                  }

                  return (
                    <button
                      key={choice}
                      onClick={() => handleAnswer(choice)}
                      disabled={showResult}
                      style={{
                        padding: '0.95rem 1.25rem',
                        borderRadius: '0.75rem',
                        border: `1px solid ${borderColor}`,
                        background: bg,
                        color,
                        textAlign: 'left',
                        cursor: showResult ? 'default' : 'pointer',
                        fontSize: '0.925rem',
                        fontWeight: 600,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      {showResult && choice === puzzle.correctAnswer && <CheckCircle size={17} color="#059669" />}
                      {showResult && selected === choice && choice !== puzzle.correctAnswer && <XCircle size={17} color="#E11D48" />}
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0284C7', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Logical Fallacy Breakdown</p>
                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>{puzzle.explanation}</p>
                </div>
                <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                  {index + 1 >= puzzles.length ? 'See Results 🏆' : 'Next Fallacy →'}
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
