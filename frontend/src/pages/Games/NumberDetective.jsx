import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, CheckCircle, XCircle, Clock, Swords, Shield, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { useTimer } from '../../hooks/useTimer';
import XPPopup from '../../components/XPPopup/XPPopup';
import DifficultySelector from '../../components/DifficultySelector/DifficultySelector';
import GameProgress from '../../components/GameProgress/GameProgress';
import GameResults from '../../components/GameResults/GameResults';
import PlayModeModal from '../../components/PlayModeModal/PlayModeModal';
import MatchmakingLobby from '../../components/MatchmakingLobby/MatchmakingLobby';
import CompetitiveResults from '../../components/CompetitiveResults/CompetitiveResults';
import SocialDrawer from '../../components/SocialDrawer/SocialDrawer';
import { getDailyQuestionSet } from '../../services/dailyQuestionService';
import { numberDetectiveQuestions } from '../../data/numberDetectiveQuestions';
import api from '../../utils/api';

const TIMER_SECONDS = { EASY: 120, MEDIUM: 90, HARD: 60 };
const XP_PER_DIFFICULTY = { EASY: 10, MEDIUM: 25, HARD: 50 };

export default function NumberDetective() {
  const { user, refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();

  // Mode state
  const [showModeModal, setShowModeModal] = useState(true);
  const [playMode, setPlayMode] = useState('PRACTICE'); // 'PRACTICE' | 'RANKED' | 'FRIEND'
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [showSocialDrawer, setShowSocialDrawer] = useState(false);
  const [invitedFriend, setInvitedFriend] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [competitiveResult, setCompetitiveResult] = useState(null);

  const [difficulty, setDifficulty]   = useState(null); // null = selecting
  const [puzzles, setPuzzles]         = useState([]);
  const [index, setIndex]             = useState(0);
  const [answer, setAnswer]           = useState('');
  const [hintUsed, setHintUsed]       = useState(false);
  const [result, setResult]           = useState(null); // null | 'correct' | 'wrong'
  const [showResult, setShowResult]   = useState(false);
  const [score, setScore]             = useState(0);
  const [mistakes, setMistakes]       = useState(0);
  const [totalXP, setTotalXP]         = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [latestUser, setLatestUser]   = useState(null);
  const startTimeRef = useRef(Date.now());

  const puzzle = puzzles[index];
  const timerLimit = difficulty ? TIMER_SECONDS[difficulty.toUpperCase()] || 90 : 90;

  const { timeLeft, formattedTime, urgency, start, reset } = useTimer(
    timerLimit,
    { onComplete: () => handleSubmit(true) }
  );

  const handleSelectMode = (mode) => {
    setPlayMode(mode);
    setShowModeModal(false);
    if (mode === 'RANKED') {
      setInvitedFriend(null);
      setShowMatchmaking(true);
    } else if (mode === 'FRIEND') {
      setShowSocialDrawer(true);
    }
  };

  const handleMatchReady = (match) => {
    setShowMatchmaking(false);
    setShowSocialDrawer(false);
    setCurrentMatch(match);
    startTimeRef.current = Date.now();

    // Parse challenge data if present
    let challengeQuestions = [];
    try {
      if (match.challengeData) {
        const parsed = typeof match.challengeData === 'string' ? JSON.parse(match.challengeData) : match.challengeData;
        if (Array.isArray(parsed) && parsed.length > 0) {
          challengeQuestions = parsed.map((p, idx) => {
            let contentObj = {};
            if (typeof p.content === 'string') {
              try { contentObj = JSON.parse(p.content); } catch (e) {}
            } else if (typeof p.content === 'object' && p.content !== null) {
              contentObj = p.content;
            }

            let correctAns = p.correctAnswer || p.answer || '';
            if (typeof correctAns === 'string' && correctAns.trim().startsWith('{')) {
              try {
                const parsedAns = JSON.parse(correctAns);
                correctAns = parsedAns.answer || correctAns;
              } catch (e) {}
            }

            return {
              id: p.id || idx + 1,
              question: p.question || contentObj.question || p.title || '',
              correctAnswer: correctAns,
              options: p.options || contentObj.options || contentObj.choices || [],
              hint: p.hint || contentObj.hint || '',
              explanation: p.explanation || contentObj.explanation || 'Mathematical logic pattern.'
            };
          }).filter(q => q.question);
        }
      }
    } catch (e) {
      console.warn("Could not parse match challengeData, falling back to generated set", e);
    }

    if (challengeQuestions.length === 0) {
      challengeQuestions = getDailyQuestionSet({
        gameType: 'number-detective',
        difficulty: 'MEDIUM',
        questionBank: numberDetectiveQuestions,
        count: 5,
        userShuffle: false
      });
    }

    setPuzzles(challengeQuestions);
    setDifficulty('MEDIUM');
    setIndex(0);
    setScore(0);
    setMistakes(0);
    setTotalXP(0);
    setAnswer('');
    setHintUsed(false);
    setResult(null);
    setShowResult(false);
    setShowComplete(false);
    setCompetitiveResult(null);
  };

  const startGame = (diff) => {
    const selected = getDailyQuestionSet({
      gameType: 'number-detective',
      difficulty: diff,
      questionBank: numberDetectiveQuestions,
      count: 10,
      userShuffle: true
    });

    setPuzzles(selected);
    setDifficulty(diff);
    setIndex(0);
    setScore(0);
    setMistakes(0);
    setTotalXP(0);
    setAnswer('');
    setHintUsed(false);
    setResult(null);
    setShowResult(false);
    setShowComplete(false);
    setLatestUser(null);
    setCompetitiveResult(null);
  };

  useEffect(() => {
    if (puzzles.length > 0 && !showResult && !showComplete) {
      const currentDiff = (puzzles[index]?.difficulty || difficulty || 'MEDIUM').toUpperCase();
      reset(TIMER_SECONDS[currentDiff] || 90);
      start();
    }
  }, [index, puzzles, showResult, showComplete]);

  const handleSubmit = useCallback(async (timedOut = false) => {
    if (!puzzle || result) return;
    const isCorrect = !timedOut && answer.trim().toLowerCase() === String(puzzle.correctAnswer || puzzle.answer).toLowerCase();
    setResult(isCorrect ? 'correct' : 'wrong');
    setShowResult(true);

    if (!isCorrect) {
      setMistakes(m => m + 1);
    }

    if (playMode === 'PRACTICE') {
      const baseXP = XP_PER_DIFFICULTY[(puzzle.difficulty || difficulty || 'MEDIUM').toUpperCase()] || 15;
      const earned = isCorrect ? (hintUsed ? Math.floor(baseXP * 0.7) : baseXP) : 0;

      if (isCorrect) {
        setScore(s => s + 1);
        setTotalXP(t => t + earned);
        showXPPopup(earned);
      }

      try {
        const res = await api.post('/api/games/number-detective/attempts', {
          puzzleId: puzzle.id,
          userAnswer: answer.trim(),
          hintUsed: hintUsed,
          timeTakenSeconds: 15
        });

        if (res.data?.user) {
          setLatestUser(res.data.user);
        }
      } catch (e) {
        // Offline / fallback mode
      }
    } else {
      // In competitive mode: track score directly
      if (isCorrect) {
        setScore(s => s + 1);
      }
    }
  }, [puzzle, answer, hintUsed, result, difficulty, playMode, showXPPopup]);

  const handleNext = async () => {
    if (index + 1 >= puzzles.length) {
      if (playMode === 'PRACTICE') {
        if (latestUser) {
          refreshUser(latestUser);
        }
        setShowComplete(true);
      } else if (currentMatch) {
        const totalDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
        try {
          // If solo bot match
          if (currentMatch.player2Id === 999999) {
            // Simulated opponent score
            const botScore = Math.max(0, score + (Math.random() > 0.4 ? (Math.random() > 0.5 ? 0 : -1) : 1));
            const botDelta = score >= botScore ? -16 : 16;
            const myDelta = score > botScore ? 24 : (score === botScore ? 0 : -18);
            const simResult = {
              ...currentMatch,
              player1Score: score,
              player2Score: botScore,
              player1RatingChange: myDelta,
              player2RatingChange: botDelta,
              winnerId: score > botScore ? currentMatch.player1Id : (score < botScore ? 999999 : null)
            };
            setCompetitiveResult(simResult);
          } else {
            const res = await api.post(`/api/matches/${currentMatch.id}/submit`, {
              score: score,
              timeTakenSeconds: totalDuration,
              mistakes: mistakes,
              detailedAnswers: 'Number Detective Set Completed'
            });
            setCompetitiveResult(res.data);
          }
        } catch (e) {
          console.error("Match result submit error", e);
        }
      }
    } else {
      setIndex(i => i + 1);
      setAnswer('');
      setHintUsed(false);
      setResult(null);
      setShowResult(false);
    }
  };

  // === PLAY MODE SELECT MODAL ===
  if (showModeModal) {
    return (
      <PlayModeModal
        isOpen={showModeModal}
        gameTitle="Number Detective"
        gameIcon="🔢"
        onClose={() => navigate('/games')}
        onSelectMode={handleSelectMode}
      />
    );
  }

  // === MATCHMAKING RADAR / LOBBY ===
  if (showMatchmaking) {
    return (
      <MatchmakingLobby
        isOpen={showMatchmaking}
        gameSlug="number-detective"
        gameTitle="Number Detective"
        mode={playMode === 'FRIEND' ? 'FRIEND' : 'RANKED'}
        friendTarget={invitedFriend}
        onClose={() => {
          setShowMatchmaking(false);
          setInvitedFriend(null);
          setShowModeModal(true);
        }}
        onMatchReady={handleMatchReady}
      />
    );
  }

  // === SOCIAL DRAWER (PLAY WITH FRIEND) ===
  if (showSocialDrawer) {
    return (
      <SocialDrawer
        isOpen={showSocialDrawer}
        onClose={() => {
          setShowSocialDrawer(false);
          setShowModeModal(true);
        }}
        onInviteFriendToGame={(friend) => {
          setShowSocialDrawer(false);
          setInvitedFriend(friend);
          setPlayMode('FRIEND');
          setShowMatchmaking(true);
        }}
      />
    );
  }

  // === COMPETITIVE MATCH RESULTS SCREEN ===
  if (competitiveResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px', paddingBottom: '3rem' }}>
        <CompetitiveResults
          matchResult={competitiveResult}
          currentUserId={user?.id || currentMatch?.player1Id}
          onRematch={() => {
            setCompetitiveResult(null);
            setShowMatchmaking(true);
          }}
          onDashboard={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  // === DIFFICULTY SELECT (Practice Mode) ===
  if (!difficulty && playMode === 'PRACTICE') {
    return (
      <DifficultySelector
        title="Number Detective"
        subtitle="Spot the hidden mathematical rule in the sequence. Choose your difficulty level."
        icon="🔢"
        onSelectDifficulty={(diff) => startGame(diff)}
        onBack={() => setShowModeModal(true)}
        customTiers={[
          { id: 'EASY', label: 'Easy', icon: '🌱', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', xp: '+10 XP', time: '2 min', desc: 'Simple arithmetic and doubling sequences' },
          { id: 'MEDIUM', label: 'Medium', icon: '⚡', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', xp: '+25 XP', time: '90 sec', desc: 'Multi-step formulas, primes, and squares' },
          { id: 'HARD', label: 'Hard', icon: '🔥', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', xp: '+50 XP', time: '60 sec', desc: 'Cubes, factorials, and complex recursive rules' }
        ]}
      />
    );
  }

  // === COMPLETE SCREEN (Practice Mode) ===
  if (showComplete) {
    return (
      <GameResults
        score={score}
        total={puzzles.length}
        xpEarned={totalXP}
        gameTitle="Number Detective"
        onPlayAgain={() => startGame(difficulty)}
      />
    );
  }

  if (!puzzle) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Reusable Header Progress Bar */}
        <GameProgress
          current={index + 1}
          total={puzzles.length}
          score={score}
          difficulty={difficulty}
          onExit={() => setDifficulty(null)}
          formattedTime={formattedTime}
          urgency={urgency}
          onMidnightRollover={() => startGame(difficulty)}
        />

        {/* Puzzle Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1.25rem',
              padding: '2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Find the missing number in the sequence
              </p>
              <div
                className="font-display"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.3rem)',
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '0.05em',
                  padding: '1.5rem',
                  background: '#F8FAFC',
                  borderRadius: '1rem',
                  border: '1px solid #E2E8F0'
                }}
              >
                {puzzle.question}
              </div>
            </div>

            {/* Hint */}
            {hintUsed && puzzle.hint && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '0.75rem',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <Lightbulb size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: '#B45309', lineHeight: 1.5, fontWeight: 500 }}>{puzzle.hint}</p>
              </motion.div>
            )}

            {/* Options or Text Input */}
            {!showResult ? (
              <div>
                {Array.isArray(puzzle.options) && puzzle.options.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {puzzle.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setAnswer(opt); }}
                        style={{
                          padding: '1.1rem',
                          borderRadius: '0.875rem',
                          border: answer === opt ? '2px solid #6366F1' : '1px solid #E2E8F0',
                          background: answer === opt ? '#EEF2FF' : '#FFFFFF',
                          color: answer === opt ? '#4F46E5' : '#0F172A',
                          fontSize: '1.25rem',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                      type="text"
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && answer && handleSubmit()}
                      placeholder="Enter your answer..."
                      className="input-dark"
                      style={{ flex: 1, textAlign: 'center', fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '0.85rem' }}
                      autoFocus
                    />
                  </div>
                )}

                <button
                  onClick={() => answer && handleSubmit()}
                  disabled={!answer}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem', justifyContent: 'center', opacity: answer ? 1 : 0.5, fontSize: '0.95rem' }}
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                {/* Result banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '0.85rem',
                    background: result === 'correct' ? '#ECFDF5' : '#FFF1F2',
                    border: `1px solid ${result === 'correct' ? '#A7F3D0' : '#FECDD3'}`,
                    marginBottom: '1rem'
                  }}
                >
                  {result === 'correct' ? <CheckCircle size={22} color="#059669" /> : <XCircle size={22} color="#E11D48" />}
                  <div>
                    <div style={{ fontWeight: 800, color: result === 'correct' ? '#047857' : '#BE123C', fontSize: '0.95rem' }}>
                      {result === 'correct' ? '🎉 Correct!' : `Incorrect — The correct answer was ${puzzle.correctAnswer || puzzle.answer}`}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0284C7', marginBottom: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Explanation</p>
                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>{puzzle.explanation}</p>
                </div>

                <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                  {index + 1 >= puzzles.length ? 'See Results 🏆' : 'Next Puzzle →'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom actions */}
        {!showResult && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {!hintUsed && puzzle.hint && (
              <button
                onClick={() => setHintUsed(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  color: '#B45309',
                  borderRadius: '0.75rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Lightbulb size={14} /> Use Hint (-30% XP)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
