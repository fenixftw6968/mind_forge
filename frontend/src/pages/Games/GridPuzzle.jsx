import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Grid3x3, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { useTimer } from '../../hooks/useTimer';
import XPPopup from '../../components/XPPopup/XPPopup';
import DifficultySelector from '../../components/DifficultySelector/DifficultySelector';
import GameProgress from '../../components/GameProgress/GameProgress';
import GameResults from '../../components/GameResults/GameResults';
import ExitModal from '../../components/ExitModal/ExitModal';
import { getDailyQuestionSet } from '../../services/dailyQuestionService';
import { gridPuzzleQuestions } from '../../data/gridPuzzleQuestions';
import api from '../../utils/api';

const TIMER_SECONDS = { EASY: 120, MEDIUM: 90, HARD: 60 };
const XP_PER_DIFFICULTY = { EASY: 15, MEDIUM: 25, HARD: 50 };

export default function GridPuzzle() {
  const { refreshUser } = useAuth();
  const { showXPPopup } = useGame();
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [puzzles, setPuzzles] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  const puzzle = puzzles[index];
  const currentDiff = (puzzle?.difficulty || difficulty || 'MEDIUM').toUpperCase();
  const timerLimit = TIMER_SECONDS[currentDiff] || 90;

  const { formattedTime, urgency, start, reset, pause } = useTimer(
    timerLimit,
    { onComplete: () => handleSelect(null, true) }
  );

  const startGame = (diff) => {
    const selected = getDailyQuestionSet({
      gameType: 'grid-puzzle',
      difficulty: diff,
      questionBank: gridPuzzleQuestions,
      count: 6,
      userShuffle: true
    });

    const activeList = selected.length > 0 ? selected : gridPuzzleQuestions.filter(q => q.difficulty === diff);
    setPuzzles(activeList);
    setDifficulty(diff);
    setIndex(0);
    setScore(0);
    setTotalXP(0);
    setSelectedChoice(null);
    setHintUsed(false);
    setShowHint(false);
    setResult(null);
    setShowResult(false);
    setShowComplete(false);
  };

  // Guarantee complete reset on any question index change
  useEffect(() => {
    setSelectedChoice(null);
    setHintUsed(false);
    setShowHint(false);
    setResult(null);
    setShowResult(false);
    if (puzzles.length > 0 && !showComplete) {
      reset(TIMER_SECONDS[(puzzles[index]?.difficulty || difficulty || 'MEDIUM').toUpperCase()] || 90);
      start();
    }
  }, [index, puzzles, showComplete]);

  const handleSelect = async (choice, timedOut = false) => {
    if (selectedChoice || showResult || !puzzle) return;
    pause();
    setSelectedChoice(choice);

    const isCorrect = !timedOut && choice === puzzle.correctAnswer;
    setResult(isCorrect ? 'correct' : 'wrong');
    setShowResult(true);

    const baseXP = XP_PER_DIFFICULTY[currentDiff] || 25;
    const earned = isCorrect ? (hintUsed ? Math.floor(baseXP * 0.7) : baseXP) : 0;

    if (isCorrect) {
      setScore(s => s + 1);
      setTotalXP(t => t + earned);
      showXPPopup(earned);
    }

    try {
      const res = await api.post('/api/games/grid-puzzle/attempts', {
        puzzleId: puzzle.id,
        userAnswer: choice || 'TIMEOUT',
        hintUsed,
        timeTakenSeconds: 15
      });
      if (res.data?.user) {
        refreshUser(res.data.user);
      }
    } catch (e) {}
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setHintUsed(false);
    setShowHint(false);
    setResult(null);
    setShowResult(false);
    if (index + 1 < puzzles.length) {
      setIndex(i => i + 1);
    } else {
      setShowComplete(true);
    }
  };

  if (!difficulty) {
    return (
      <DifficultySelector
        title="Grid Puzzle"
        subtitle="Study the matrix patterns, find the missing piece, and crack the transformation rule."
        icon="🧩"
        onSelectDifficulty={startGame}
        onBack={() => navigate('/games')}
      />
    );
  }

  if (showComplete) {
    return (
      <GameResults
        score={score}
        total={puzzles.length}
        xpEarned={totalXP}
        onPlayAgain={() => startGame(difficulty)}
        gameTitle="Grid Puzzle"
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <GameProgress
          current={index + 1}
          total={puzzles.length}
          score={score}
          difficulty={difficulty}
          onExit={() => setShowExitModal(true)}
          formattedTime={formattedTime}
          urgency={urgency}
        />

        {/* Exit Confirmation Modal */}
        <ExitModal
          isOpen={showExitModal}
          onCancel={() => setShowExitModal(false)}
          onConfirm={() => {
            setShowExitModal(false);
            navigate('/games');
          }}
        />

        <AnimatePresence mode="wait">
          {puzzle && (
            <motion.div
              key={puzzle.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '1.25rem',
                padding: '2rem',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EEF2FF', border: '1px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid3x3 size={22} color="#4F46E5" />
                  </div>
                  <div>
                    <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      {puzzle.title}
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
                      {puzzle.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { setShowHint(true); setHintUsed(true); }}
                  disabled={showHint || showResult}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.4rem 0.85rem', borderRadius: '8px',
                    background: showHint ? '#FFFBEB' : '#FFFFFF',
                    border: '1px solid #FDE68A',
                    color: '#B45309', fontSize: '0.8rem', fontWeight: 700,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    cursor: showHint || showResult ? 'default' : 'pointer'
                  }}
                >
                  <Lightbulb size={14} /> Hint
                </button>
              </div>

              {/* Matrix Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${puzzle.grid[0]?.length || 3}, 1fr)`,
                  gap: '0.75rem',
                  maxWidth: '380px',
                  margin: '0 auto 2rem',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '1rem',
                  padding: '1rem'
                }}
              >
                {puzzle.grid.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isTarget = cell === '?';
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        style={{
                          aspectRatio: '1',
                          borderRadius: '0.75rem',
                          background: isTarget ? '#EEF2FF' : '#FFFFFF',
                          border: isTarget ? '2px dashed #6366F1' : '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 800,
                          color: isTarget ? '#4F46E5' : '#0F172A',
                          fontFamily: 'var(--font-display)',
                          boxShadow: isTarget ? '0 0 10px rgba(99,102,241,0.15)' : '0 1px 2px rgba(0,0,0,0.02)'
                        }}
                      >
                        {cell}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Hint Box */}
              {showHint && puzzle.hint && (
                <div
                  style={{
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '0.75rem',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                    color: '#B45309',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}
                >
                  <Lightbulb size={16} style={{ flexShrink: 0 }} />
                  <span><strong>Hint:</strong> {puzzle.hint}</span>
                </div>
              )}

              {/* Option Choices */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {puzzle.choices.map((choice, cIdx) => {
                  const isSelected = selectedChoice === choice;
                  const isCorrect = choice === puzzle.correctAnswer;

                  let border = '1px solid #E2E8F0';
                  let bg = '#FFFFFF';
                  let textCol = '#0F172A';

                  if (showResult) {
                    if (isCorrect) {
                      border = '1px solid #A7F3D0';
                      bg = '#ECFDF5';
                      textCol = '#047857';
                    } else if (isSelected) {
                      border = '1px solid #FECDD3';
                      bg = '#FFF1F2';
                      textCol = '#BE123C';
                    }
                  }

                  return (
                    <motion.button
                      key={cIdx}
                      whileHover={!showResult ? { scale: 1.01 } : {}}
                      onClick={() => handleSelect(choice)}
                      disabled={showResult}
                      style={{
                        padding: '1.1rem',
                        borderRadius: '0.875rem',
                        background: bg,
                        border: border,
                        color: textCol,
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        cursor: showResult ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{choice}</span>
                      {showResult && isCorrect && <CheckCircle size={18} color="#059669" />}
                      {showResult && isSelected && !isCorrect && <XCircle size={18} color="#E11D48" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Result explanation */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: result === 'correct' ? '#ECFDF5' : '#FFF1F2',
                    border: `1px solid ${result === 'correct' ? '#A7F3D0' : '#FECDD3'}`,
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    marginTop: '1.5rem',
                    textAlign: 'center'
                  }}
                >
                  <p style={{ color: '#334155', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5, fontWeight: 500 }}>
                    {puzzle.explanation}
                  </p>
                  <button onClick={handleNext} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                    {index + 1 < puzzles.length ? 'Next Pattern →' : 'View Results'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
