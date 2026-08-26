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
import { getRandomQuestionSet } from '../../services/randomQuestionService';
import { whoIsLyingQuestions } from '../../data/whoIsLyingQuestions';
import api from '../../utils/api';

const XP_PER_DIFFICULTY = { EASY: 15, MEDIUM: 30, HARD: 60 };

export default function WhoIsLying() {
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
      gameType: 'who-is-lying',
      difficulty: diff,
      questionBank: whoIsLyingQuestions,
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

  const handleSelect = (choiceId) => {
    if (showResult) return;
    setSelected(choiceId);
  };

  const handleAnswer = async () => {
    if (!selected || showResult) return;
    const isCorrect = selected === puzzle.correctAnswer;
    setShowResult(true);

    const baseXP = XP_PER_DIFFICULTY[(puzzle.difficulty || difficulty || 'MEDIUM').toUpperCase()] || 25;
    const earned = isCorrect ? (hintUsed ? Math.floor(baseXP * 0.7) : baseXP) : 0;

    if (isCorrect) {
      setScore(s => s + 1);
      setTotalXP(t => t + earned);
      showXPPopup(earned);
    }

    try {
      const res = await api.post('/api/games/who-is-lying/attempts', {
        puzzleId: puzzle.id,
        userAnswer: selected,
        hintUsed: hintUsed,
        timeTakenSeconds: 15
      });

      if (res.data?.user) {
        setLatestUser(res.data.user);
      }
    } catch (e) {
      // Fallback
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
        title="Who Is Lying?"
        subtitle="Characters make contradictory statements. Use pure deductive logic to identify the liar."
        icon="🎭"
        onSelectDifficulty={(diff) => startGame(diff)}
        onBack={() => navigate('/games')}
        customTiers={[
          { id: 'EASY', label: 'Easy', icon: '😊', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', xp: '+15 XP', time: 'Relaxed', desc: '3 suspects with simple direct contradiction' },
          { id: 'MEDIUM', label: 'Medium', icon: '🤔', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', xp: '+30 XP', time: 'Moderate', desc: '4 suspects requiring case-by-case truth testing' },
          { id: 'HARD', label: 'Hard', icon: '😈', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', xp: '+60 XP', time: 'Intense', desc: '5+ suspects with multi-layered conditional logic' }
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
        gameTitle="Who Is Lying?"
        onPlayAgain={() => startGame(difficulty)}
      />
    );
  }

  if (!puzzle) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Header Progress Bar */}
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
            {/* Scenario Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '1.25rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>The Scenario</p>
              <p style={{ color: '#1E293B', lineHeight: 1.7, fontSize: '0.95rem', fontWeight: 500 }}>{puzzle.scenario}</p>
              {puzzle.rule && (
                <div style={{ marginTop: '0.85rem', padding: '0.75rem 1rem', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.75rem' }}>
                  <span style={{ fontSize: '0.825rem', color: '#0369A1', fontWeight: 700 }}>📋 Rule: {puzzle.rule}</span>
                </div>
              )}
            </div>

            {/* Characters Statements */}
            {Array.isArray(puzzle.characters) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {puzzle.characters.map((char) => (
                  <div key={char.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>{char.avatar}</span>
                      <span className="font-accent" style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{char.name}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.55, fontStyle: 'italic' }}>"{char.statement}"</p>
                  </div>
                ))}
              </div>
            )}

            {/* Hint */}
            {hintUsed && puzzle.hint && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '0.5rem', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
                <Lightbulb size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '0.85rem', color: '#B45309', lineHeight: 1.5, fontWeight: 500 }}>{puzzle.hint}</p>
              </motion.div>
            )}

            {/* Choices */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>{puzzle.question}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {puzzle.choices.map(choice => {
                  let borderColor = '#E2E8F0';
                  let bg = '#FFFFFF';
                  let color = '#334155';
                  
                  if (selected === choice.id) {
                    borderColor = '#C7D2FE';
                    bg = '#EEF2FF';
                    color = '#4338CA';
                  }
                  if (showResult && choice.id === puzzle.correctAnswer) {
                    borderColor = '#A7F3D0';
                    bg = '#ECFDF5';
                    color = '#047857';
                  }
                  if (showResult && selected === choice.id && choice.id !== puzzle.correctAnswer) {
                    borderColor = '#FECDD3';
                    bg = '#FFF1F2';
                    color = '#BE123C';
                  }

                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleSelect(choice.id)}
                      disabled={showResult}
                      style={{
                        padding: '0.95rem 1.15rem',
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
                      {showResult && choice.id === puzzle.correctAnswer && <CheckCircle size={17} color="#059669" />}
                      {showResult && selected === choice.id && choice.id !== puzzle.correctAnswer && <XCircle size={17} color="#E11D48" />}
                      {choice.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0284C7', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Explanation</p>
                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>{puzzle.explanation}</p>
                </div>
                <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                  {index + 1 >= puzzles.length ? 'See Results 🏆' : 'Next Mystery →'}
                </button>
              </motion.div>
            )}

            {/* Actions */}
            {!showResult && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!hintUsed && puzzle.hint ? (
                  <button onClick={() => setHintUsed(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309', borderRadius: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                    <Lightbulb size={14} /> Hint (-30% XP)
                  </button>
                ) : <div />}
                <button onClick={handleAnswer} disabled={!selected} className="btn-primary" style={{ opacity: selected ? 1 : 0.5, padding: '0.75rem 1.75rem' }}>
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
