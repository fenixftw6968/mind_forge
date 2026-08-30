import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lightbulb, CheckCircle, XCircle, Clock, Swords, Code2, BookOpen, Target, Sparkles } from 'lucide-react';
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
import ExitModal from '../../components/ExitModal/ExitModal';
import { getDailyQuestionSet } from '../../services/dailyQuestionService';
import { getRandomQuestionSet } from '../../services/randomQuestionService';
import api from '../../utils/api';
import { useMatchSocket } from '../../hooks/useMatchSocket';

const TIMER_SECONDS = { EASY: 90, MEDIUM: 60, HARD: 45 };
const XP_PER_DIFFICULTY = { EASY: 15, MEDIUM: 30, HARD: 60 };

export default function MCQGameEngine({
  gameSlug,
  gameTitle,
  gameIcon = '🧠',
  category = 'Logic',
  questionBank = [],
  customDifficulties = null,
  codeLanguage = 'cpp'
}) {
  const { user, refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();
  const location = useLocation();
  const acceptedMatch = location.state?.acceptedMatch;

  // Mode & Lobby states
  const [showModeModal, setShowModeModal] = useState(!acceptedMatch);
  const [playMode, setPlayMode] = useState(acceptedMatch ? 'FRIEND' : 'PRACTICE');
  const [showMatchmaking, setShowMatchmaking] = useState(!!acceptedMatch);
  const [showSocialDrawer, setShowSocialDrawer] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [invitedFriend, setInvitedFriend] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(acceptedMatch || null);
  const [competitiveResult, setCompetitiveResult] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  // Gameplay states
  const [difficulty, setDifficulty] = useState(null); // null = selecting difficulty
  const [puzzles, setPuzzles] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null); // null | 'correct' | 'wrong'
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [latestUser, setLatestUser] = useState(null);

  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const mistakesRef = useRef(0);
  const durationRef = useRef(0);

  const clearMatchStorage = useCallback((matchId) => {
    localStorage.removeItem(`activeMatchId_${gameSlug}`);
    if (matchId) {
      localStorage.removeItem(`activeMatchIndex_${matchId}`);
      localStorage.removeItem(`activeMatchScore_${matchId}`);
      localStorage.removeItem(`activeMatchMistakes_${matchId}`);
    }
  }, [gameSlug]);

  // WebSocket listener for real-time 1v1 match results
  useMatchSocket(currentMatch?.id, (event) => {
    if (event.type === 'MATCH_FINISHED' || event.type === 'MATCH_COMPLETED' || event.data?.status === 'FINISHED') {
      setWaitingForOpponent(false);
      setCompetitiveResult(event.data);
      clearMatchStorage(currentMatch?.id);
    }
  });

  // Polling fallback when waiting for opponent
  useEffect(() => {
    if (!waitingForOpponent || !currentMatch?.id) return;
    let isCancelled = false;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/api/matches/${currentMatch.id}`);
        if (!isCancelled && res.status === 200 && res.data?.status === 'FINISHED') {
          setWaitingForOpponent(false);
          setCompetitiveResult(res.data);
          clearMatchStorage(currentMatch.id);
        }
      } catch (e) {
        console.warn('Match poll check:', e);
      }
    }, 1500);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [waitingForOpponent, currentMatch?.id, clearMatchStorage]);

  // Timer hook
  const { timeLeft, formattedTime: formatted, urgency, reset, pause, start } = useTimer(
    TIMER_SECONDS.MEDIUM,
    {
      autoStart: false,
      onComplete: () => {
        handleTimeout();
      }
    }
  );

  const puzzle = puzzles[index];

  // Initialize practice game session
  const initGameSession = useCallback((selectedDiff) => {
    setDifficulty(selectedDiff);
    setIndex(0);
    setScore(0);
    setMistakes(0);
    setSelectedOption(null);
    setShowResult(false);
    setHintUsed(false);
    setShowHint(false);
    setShowComplete(false);
    scoreRef.current = 0;
    mistakesRef.current = 0;
    startTimeRef.current = Date.now();

    const questions = getRandomQuestionSet({
      gameType: gameSlug,
      difficulty: selectedDiff,
      questionBank: questionBank,
      count: 10,
      userShuffle: true
    });

    setPuzzles(questions);
    reset(TIMER_SECONDS[selectedDiff?.toUpperCase()] || 60);
    start();
  }, [gameSlug, questionBank, reset, start]);

  // Handle timeout on a question
  const handleTimeout = () => {
    pause();
    mistakesRef.current += 1;
    setMistakes(mistakesRef.current);
    setResult('wrong');
    setShowResult(true);
  };

  // Submit selected option
  const handleSubmit = async () => {
    if (!selectedOption || showResult || !puzzle) return;
    pause();

    const isCorrect = selectedOption.trim().toLowerCase() === puzzle.correctAnswer.trim().toLowerCase();
    const currentDiff = (puzzle.difficulty || difficulty || 'MEDIUM').toUpperCase();
    const baseXP = XP_PER_DIFFICULTY[currentDiff] || 30;
    const earnedXP = isCorrect ? (hintUsed ? Math.round(baseXP * 0.7) : baseXP) : 0;
    const earnedCoins = isCorrect ? Math.max(1, Math.round(earnedXP / 2.5)) : 0;

    if (isCorrect) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setTotalXP(prev => prev + earnedXP);
      setResult('correct');
      showXPPopup(earnedXP);

      if (playMode === 'PRACTICE') {
        try {
          const res = await api.post(`/api/games/${gameSlug}/attempts`, {
            puzzleId: typeof puzzle.id === 'number' ? puzzle.id : null,
            userAnswer: selectedOption,
            hintUsed: hintUsed,
            timeTakenSeconds: (TIMER_SECONDS[currentDiff] || 60) - seconds
          });
          if (res.data?.user) {
            setLatestUser(res.data.user);
            refreshUser(res.data.user);
          }
        } catch (e) {
          console.warn('Could not record attempt to backend:', e);
        }
      }
    } else {
      mistakesRef.current += 1;
      setMistakes(mistakesRef.current);
      setResult('wrong');
    }

    setShowResult(true);
  };

  // Progress to next question or show completion screen
  const handleNext = async () => {
    if (index + 1 >= puzzles.length) {
      pause();
      durationRef.current = Math.round((Date.now() - startTimeRef.current) / 1000);
      setShowComplete(true);

      // Submit final match score if multiplayer
      if (currentMatch && currentMatch.id) {
        try {
          setWaitingForOpponent(true);
          const res = await api.post(`/api/matches/${currentMatch.id}/submit`, {
            score: scoreRef.current,
            mistakes: mistakesRef.current,
            timeTakenSeconds: durationRef.current
          });
          if (res.data?.status === 'FINISHED') {
            setWaitingForOpponent(false);
            setCompetitiveResult(res.data);
            clearMatchStorage(currentMatch.id);
          }
        } catch (e) {
          console.error('Failed to submit competitive score:', e);
        }
      }
    } else {
      setIndex(prev => prev + 1);
      setSelectedOption('');
      setShowResult(false);
      setResult(null);
      setShowHint(false);
      setHintUsed(false);
      const nextDiff = (puzzles[index + 1]?.difficulty || difficulty || 'MEDIUM').toUpperCase();
      reset(TIMER_SECONDS[nextDiff] || 60);
      start();
    }
  };

  // Handle multiplayer match ready event
  const handleMatchReady = (matchData) => {
    setShowMatchmaking(false);
    setCurrentMatch(matchData);
    localStorage.setItem(`activeMatchId_${gameSlug}`, matchData.id);

    let matchPuzzles = [];
    if (matchData.challengeData) {
      try {
        matchPuzzles = JSON.parse(matchData.challengeData);
      } catch (e) {}
    }
    if (!matchPuzzles || matchPuzzles.length === 0) {
      matchPuzzles = getRandomQuestionSet({
        gameType: gameSlug,
        difficulty: matchData.difficulty || 'MEDIUM',
        questionBank: questionBank,
        count: 10,
        userShuffle: false
      });
    }

    setPuzzles(matchPuzzles);
    setDifficulty(matchData.difficulty || 'MEDIUM');
    setIndex(0);
    setScore(0);
    setMistakes(0);
    setTotalXP(0);
    setShowComplete(false);
    setShowResult(false);
    setSelectedOption('');
    setShowHint(false);
    setHintUsed(false);
    scoreRef.current = 0;
    mistakesRef.current = 0;
    startTimeRef.current = Date.now();
    reset(TIMER_SECONDS[(matchData.difficulty || 'MEDIUM').toUpperCase()] || 60);
    start();
  };

  // Render Code Block helper
  const renderFormattedQuestion = (text) => {
    if (!text) return null;
    const parts = text.split('```');
    if (parts.length === 1) {
      return <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.55 }}>{text}</div>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
        {parts.map((part, idx) => {
          if (idx % 2 === 1) {
            // Code snippet segment
            const lines = part.replace(/^cpp\n|^c\n|^python\n|^java\n/, '');
            return (
              <div
                key={idx}
                style={{
                  background: '#0D0D0D',
                  border: '1px solid #2A2A2A',
                  borderRadius: '0.75rem',
                  padding: '1rem 1.25rem',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '0.875rem',
                  color: '#4ADE80',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)'
                }}
              >
                <pre style={{ margin: 0, fontFamily: 'inherit' }}>{lines.trim()}</pre>
              </div>
            );
          }
          return part.trim() ? (
            <div key={idx} style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.55 }}>
              {part.trim()}
            </div>
          ) : null;
        })}
      </div>
    );
  };

  // 1. Play Mode Selector Modal
  if (showModeModal) {
    return (
      <>
        <PlayModeModal
          isOpen={showModeModal}
          onClose={() => navigate('/games')}
          gameTitle={gameTitle}
          gameIcon={gameIcon}
          onSelectMode={(mode) => {
            setPlayMode(mode);
            setShowModeModal(false);
            if (mode === 'PRACTICE') {
              setDifficulty(null);
            } else if (mode === 'RANKED') {
              setShowMatchmaking(true);
            } else if (mode === 'FRIEND') {
              setShowSocialDrawer(true);
            }
          }}
        />
        <SocialDrawer
          isOpen={showSocialDrawer}
          onClose={() => setShowSocialDrawer(false)}
          onInviteFriendToGame={(friend) => {
            setInvitedFriend(friend);
            setShowSocialDrawer(false);
            setShowMatchmaking(true);
          }}
        />
      </>
    );
  }

  // 2. Matchmaking Lobby Overlay
  if (showMatchmaking) {
    return (
      <MatchmakingLobby
        isOpen={showMatchmaking}
        onClose={() => {
          setShowMatchmaking(false);
          setShowModeModal(true);
        }}
        gameSlug={gameSlug}
        gameTitle={gameTitle}
        mode={playMode === 'FRIEND' ? 'FRIEND' : 'RANKED'}
        friendTarget={invitedFriend}
        difficulty={difficulty || 'MEDIUM'}
        onMatchReady={handleMatchReady}
      />
    );
  }

  // 3. Competitive 1v1 Final Results Screen
  if (competitiveResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', padding: '2rem 1.5rem', color: '#F8FAFC' }}>
        <CompetitiveResults
          matchResult={competitiveResult}
          currentUserId={user?.id}
          onRematch={() => {
            setCompetitiveResult(null);
            setShowModeModal(true);
          }}
          onDashboard={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  // 4. Single-Player / Practice Summary Screen
  if (showComplete) {
    return (
      <GameResults
        score={score}
        total={puzzles.length}
        xpEarned={totalXP}
        onPlayAgain={() => initGameSession(difficulty || 'MEDIUM')}
        gameTitle={gameTitle}
      />
    );
  }

  // 5. Difficulty Selection Screen
  if (!difficulty) {
    return (
      <DifficultySelector
        title={gameTitle}
        subtitle={`Select challenge level to begin your ${category} training session.`}
        icon={gameIcon}
        customTiers={customDifficulties}
        onSelectDifficulty={(diff) => initGameSession(diff)}
        onBack={() => setShowModeModal(true)}
      />
    );
  }

  // 6. Active MCQ Question Gameplay Screen
  return (
    <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', color: '#F8FAFC' }}>
      <XPPopup popups={xpPopups} />

      <ExitModal
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => navigate('/games')}
      />

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {/* Progress & Header Bar */}
        <GameProgress
          current={index + 1}
          total={puzzles.length}
          score={score}
          difficulty={difficulty}
          onExit={() => setShowExitModal(true)}
          formattedTime={formatted}
          urgency={urgency}
          scoreLabel="Correct"
        />

        <AnimatePresence mode="wait">
          {puzzle && (
            <motion.div
              key={puzzle.id || index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{
                background: '#242424',
                border: '1px solid #2E2E2E',
                borderRadius: '1.25rem',
                padding: '2rem 2.25rem',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                marginBottom: '1.5rem'
              }}
            >
              {/* Formatted Question Body */}
              <div style={{ marginBottom: '1.75rem' }}>
                {renderFormattedQuestion(puzzle.question)}
              </div>

              {/* Four Multiple-Choice Options */}
              {!showResult ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {puzzle.options?.map((opt, optIdx) => {
                    const isSelected = selectedOption === opt;
                    const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                    return (
                      <motion.button
                        key={optIdx}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          padding: '1.1rem 1.25rem',
                          borderRadius: '0.875rem',
                          background: isSelected ? 'rgba(34, 197, 94, 0.15)' : '#1C1C1C',
                          border: `1px solid ${isSelected ? '#22C55E' : '#2E2E2E'}`,
                          color: isSelected ? '#4ADE80' : '#F8FAFC',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}
                      >
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isSelected ? '#22C55E' : '#282828',
                            color: isSelected ? '#05200C' : '#94A3B8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            flexShrink: 0
                          }}
                        >
                          {optionLetter}
                        </span>
                        <span style={{ fontSize: '0.925rem', fontWeight: isSelected ? 700 : 500, lineHeight: 1.4 }}>
                          {opt}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                /* Post-Submission Result & Explanation Card */
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '0.85rem',
                      background: result === 'correct' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                      border: `1px solid ${result === 'correct' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                      marginBottom: '1rem'
                    }}
                  >
                    {result === 'correct' ? <CheckCircle size={22} color="#4ADE80" /> : <XCircle size={22} color="#FB7185" />}
                    <div>
                      <div style={{ fontWeight: 800, color: result === 'correct' ? '#4ADE80' : '#FB7185', fontSize: '0.95rem' }}>
                        {result === 'correct' ? '🎉 Correct Answer!' : `Incorrect — The correct answer is: ${puzzle.correctAnswer}`}
                      </div>
                    </div>
                  </div>

                  {puzzle.explanation && (
                    <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: '#1C1C1C', border: '1px solid #2E2E2E', marginBottom: '1.25rem' }}>
                      <p style={{ fontSize: '0.725rem', fontWeight: 800, color: '#38BDF8', marginBottom: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Explanation
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.6, fontWeight: 500 }}>
                        {puzzle.explanation}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                  >
                    {index + 1 >= puzzles.length ? 'See Final Results 🏆' : 'Next Question →'}
                  </button>
                </motion.div>
              )}

              {/* Submit & Hint Actions */}
              {!showResult && (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Hint Card */}
                  <AnimatePresence>
                    {showHint && puzzle.hint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          background: 'rgba(34, 197, 94, 0.08)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          borderRadius: '0.625rem',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'flex-start'
                        }}
                      >
                        <Lightbulb size={16} color="#4ADE80" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.825rem', color: '#4ADE80', lineHeight: 1.5, fontWeight: 500 }}>
                          {puzzle.hint}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {!showHint && puzzle.hint && (
                      <button
                        type="button"
                        onClick={() => { setShowHint(true); setHintUsed(true); }}
                        className="btn-secondary"
                        style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}
                      >
                        <Lightbulb size={15} /> Use Hint (-30% XP)
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={!selectedOption}
                      onClick={handleSubmit}
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: '0.8rem 1.25rem',
                        fontSize: '0.95rem',
                        opacity: selectedOption ? 1 : 0.5
                      }}
                    >
                      Submit Answer →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
