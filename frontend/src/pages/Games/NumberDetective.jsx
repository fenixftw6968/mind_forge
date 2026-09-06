import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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
import ExitModal from '../../components/ExitModal/ExitModal';
import { getDailyQuestionSet } from '../../services/dailyQuestionService';
import { getRandomQuestionSet } from '../../services/randomQuestionService';
import { selectQuestionsForGame } from '../../services/questionHistoryService';
import { numberDetectiveQuestions } from '../../data/numberDetectiveQuestions';
import api from '../../utils/api';
import { useMatchSocket } from '../../hooks/useMatchSocket';

const TIMER_SECONDS = { EASY: 120, MEDIUM: 90, HARD: 60 };
const XP_PER_DIFFICULTY = { EASY: 10, MEDIUM: 25, HARD: 50 };

export default function NumberDetective() {
  const { user, refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();
  const location = useLocation();
  const acceptedMatch = location.state?.acceptedMatch;

  // Mode state
  const [showModeModal, setShowModeModal] = useState(!acceptedMatch);
  const [playMode, setPlayMode] = useState(acceptedMatch ? 'FRIEND' : 'PRACTICE');
  const [showMatchmaking, setShowMatchmaking] = useState(!!acceptedMatch);
  const [showSocialDrawer, setShowSocialDrawer] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [invitedFriend, setInvitedFriend] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(acceptedMatch || null);
  const [competitiveResult, setCompetitiveResult] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  const [difficulty, setDifficulty]   = useState(null); // null = selecting
  const [loadingDifficulty, setLoadingDifficulty] = useState(null);
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
  const scoreRef = useRef(0);
  const mistakesRef = useRef(0);
  const durationRef = useRef(0);
  const isSubmittingRef = useRef(false);

  const clearMatchStorage = useCallback((matchId) => {
    localStorage.removeItem('activeMatchId_number-detective');
    if (matchId) {
      localStorage.removeItem('activeMatchIndex_' + matchId);
      localStorage.removeItem('activeMatchScore_' + matchId);
      localStorage.removeItem('activeMatchMistakes_' + matchId);
    }
  }, []);

  // Listen for MATCH_FINISHED / MATCH_COMPLETED from opponent's submission
  useMatchSocket(currentMatch?.id, (event) => {
    if (event.type === 'MATCH_FINISHED' || event.type === 'MATCH_COMPLETED' || event.data?.status === 'FINISHED') {
      setWaitingForOpponent(false);
      setCompetitiveResult(event.data);
      clearMatchStorage(currentMatch?.id);
    }
  });

  // Poll for match completion while waiting for opponent (fallback)
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
        console.warn("Match status check while waiting:", e);
      }
    }, 1500);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [waitingForOpponent, currentMatch?.id, clearMatchStorage]);

  // Check for active match on mount
  useEffect(() => {
    if (!user) return;
    const activeMatchId = localStorage.getItem('activeMatchId_number-detective');
    if (!activeMatchId) return;
    
    const checkActiveMatch = async () => {
      try {
        const res = await api.get(`/api/matches/active?gameSlug=number-detective`);
        if (res.status === 200 && res.data) {
          const match = res.data;
          
          if (match.status === 'FINISHED') {
            setCurrentMatch(match);
            setCompetitiveResult(match);
            setShowModeModal(false);
            clearMatchStorage(match.id);
          } else {
            setCurrentMatch(match);
            setShowModeModal(false);
            
            const isP1 = match.player1Id === user.id;
            const finished = isP1 ? match.player1Finished : match.player2Finished;
            
            if (finished) {
              setWaitingForOpponent(true);
            } else {
              handleMatchReady(match);
              
              const savedIndex = localStorage.getItem('activeMatchIndex_' + match.id);
              const savedScore = localStorage.getItem('activeMatchScore_' + match.id);
              const savedMistakes = localStorage.getItem('activeMatchMistakes_' + match.id);
              
              if (savedIndex !== null) setIndex(parseInt(savedIndex, 10));
              if (savedScore !== null) {
                setScore(parseInt(savedScore, 10));
                scoreRef.current = parseInt(savedScore, 10);
              }
              if (savedMistakes !== null) {
                setMistakes(parseInt(savedMistakes, 10));
                mistakesRef.current = parseInt(savedMistakes, 10);
              }
            }
          }
        } else {
          localStorage.removeItem('activeMatchId_number-detective');
        }
      } catch (e) {
        console.error("Failed to check active match", e);
        localStorage.removeItem('activeMatchId_number-detective');
      }
    };
    
    checkActiveMatch();
  }, [user, clearMatchStorage]);

  const handleTimeout = useCallback(() => {
    if (isSubmittingRef.current || showResult || result !== null) return;
    isSubmittingRef.current = true;
    setResult('wrong');
    setShowResult(true);
    setMistakes(m => {
      mistakesRef.current = m + 1;
      return m + 1;
    });
  }, [showResult, result]);

  const { timeLeft, formatted: formattedTime, urgency, reset, start, pause } = useTimer(
    TIMER_SECONDS[difficulty] || 90,
    handleTimeout
  );

  const startGame = useCallback(async (diff) => {
    setLoadingDifficulty(diff);
    isSubmittingRef.current = false;
    try {
      const selected = await selectQuestionsForGame({
        gameSlug: 'number-detective',
        difficulty: diff,
        questionBank: numberDetectiveQuestions,
        count: 10,
        userShuffle: true
      });
      let activeList = Array.isArray(selected) && selected.length > 0 ? selected : [];
      if (activeList.length === 0) {
        const fallback = numberDetectiveQuestions.filter(q => q.difficulty.toLowerCase() === diff.toLowerCase());
        activeList = fallback.length > 0 ? fallback.slice(0, 10) : numberDetectiveQuestions.slice(0, 10);
      }
      setPuzzles(activeList);
      setDifficulty(diff);
      setIndex(0);
      setAnswer('');
      setHintUsed(false);
      setResult(null);
      setShowResult(false);
      setScore(0);
      setMistakes(0);
      setTotalXP(0);
      setShowComplete(false);
      scoreRef.current = 0;
      mistakesRef.current = 0;
      startTimeRef.current = Date.now();
      reset(TIMER_SECONDS[diff] || 90);
      start();
    } catch (e) {
      console.warn("Failed to load questions, using fallback set:", e);
      const fallback = numberDetectiveQuestions.filter(q => q.difficulty.toLowerCase() === diff.toLowerCase());
      const activeList = fallback.length > 0 ? fallback.slice(0, 10) : numberDetectiveQuestions.slice(0, 10);
      setPuzzles(activeList);
      setDifficulty(diff);
      reset(TIMER_SECONDS[diff] || 90);
      start();
    } finally {
      setLoadingDifficulty(null);
    }
  }, [reset, start]);

  const handleMatchReady = useCallback((matchData) => {
    setCurrentMatch(matchData);
    setShowMatchmaking(false);
    setShowModeModal(false);

    let parsedQuestions = [];
    const rawChallenge = matchData.challengeData || matchData.puzzleSet;
    if (rawChallenge) {
      try {
        parsedQuestions = typeof rawChallenge === 'string' ? JSON.parse(rawChallenge) : rawChallenge;
      } catch (e) {
        console.warn("Could not parse match challengeData/puzzleSet JSON", e);
      }
    }

    if (!parsedQuestions || !Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      const matchDiff = matchData.difficulty ? matchData.difficulty.toLowerCase() : 'medium';
      parsedQuestions = numberDetectiveQuestions.filter(q => q.difficulty.toLowerCase() === matchDiff).slice(0, 10);
    }

    setPuzzles(parsedQuestions);
    setDifficulty((matchData.difficulty || 'MEDIUM').toUpperCase());
    setIndex(0);
    setAnswer('');
    setHintUsed(false);
    setResult(null);
    setShowResult(false);
    setScore(0);
    setMistakes(0);
    setTotalXP(0);
    setShowComplete(false);
    scoreRef.current = 0;
    mistakesRef.current = 0;
    startTimeRef.current = Date.now();
    reset(TIMER_SECONDS[(matchData.difficulty || 'MEDIUM').toUpperCase()] || 90);
    start();
  }, [reset, start]);

  const handleExitGame = () => {
    setShowExitModal(false);
    if (currentMatch) {
      clearMatchStorage(currentMatch.id);
    }
    navigate('/games');
  };

  const puzzle = puzzles[index];

  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current || !puzzle || !answer.trim() || result !== null) return;
    isSubmittingRef.current = true;

    pause();

    const expectedAnswer = String(puzzle.answer !== undefined ? puzzle.answer : (puzzle.correctAnswer !== undefined ? puzzle.correctAnswer : '')).trim().toLowerCase();
    const isCorrect = answer.trim().toLowerCase() === expectedAnswer;

    setResult(isCorrect ? 'correct' : 'wrong');
    setShowResult(true);

    if (playMode === 'PRACTICE') {
      const baseXP = XP_PER_DIFFICULTY[difficulty] || 25;
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
      if (isCorrect) {
        setScore(s => {
          scoreRef.current = s + 1;
          return s + 1;
        });
      }
      setMistakes(m => {
        mistakesRef.current = m + (!isCorrect ? 1 : 0);
        return m + (!isCorrect ? 1 : 0);
      });
    }
  }, [puzzle, answer, hintUsed, result, difficulty, playMode, showXPPopup, pause]);

  const handleNext = async () => {
    isSubmittingRef.current = false;
    setAnswer('');
    setHintUsed(false);
    setResult(null);
    setShowResult(false);
    if (index + 1 >= puzzles.length) {
      if (playMode === 'PRACTICE') {
        if (latestUser) {
          refreshUser(latestUser);
        }
        setShowComplete(true);
      } else if (currentMatch) {
        const totalDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
        durationRef.current = totalDuration;
        try {
          if (currentMatch.id) {
            setWaitingForOpponent(true);
            const res = await api.post(`/api/matches/${currentMatch.id}/submit`, {
              score: scoreRef.current,
              timeTakenSeconds: totalDuration,
              mistakes: mistakesRef.current,
              detailedAnswers: 'Number Detective Set Completed'
            });
            if (res.data?.status === 'FINISHED') {
              setWaitingForOpponent(false);
              setCompetitiveResult(res.data);
              clearMatchStorage(currentMatch.id);
              refreshUser();
              return;
            }
          }
        } catch (e) {
          console.warn("Match result submit error, using offline simulation fallback", e);
          setWaitingForOpponent(false);
        }

        if (currentMatch.player2Id === 999999 || currentMatch.isBotMatch) {
          const botScore = Math.max(0, scoreRef.current + (Math.random() > 0.4 ? (Math.random() > 0.5 ? 0 : -1) : 1));
          const botDelta = scoreRef.current >= botScore ? -16 : 16;
          const myDelta = scoreRef.current > botScore ? 24 : (scoreRef.current === botScore ? 0 : -18);
          const simResult = {
            ...currentMatch,
            player1Score: scoreRef.current,
            player2Score: botScore,
            player1RatingChange: myDelta,
            player2RatingChange: botDelta,
            winnerId: scoreRef.current > botScore ? currentMatch.player1Id : (scoreRef.current < botScore ? 999999 : null)
          };
          setCompetitiveResult(simResult);
        }
      }
    } else {
      setIndex(i => i + 1);
      reset(TIMER_SECONDS[difficulty] || 90);
      start();
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
    );
  }

  // === SOCIAL DRAWER ===
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

  // === MATCHMAKING LOBBY ===
  if (showMatchmaking) {
    return (
      <MatchmakingLobby
        isOpen={showMatchmaking}
        onClose={() => {
          setShowMatchmaking(false);
          setShowModeModal(true);
        }}
        gameSlug="number-detective"
        gameTitle="Number Detective"
        mode={playMode === 'FRIEND' ? 'FRIEND' : 'RANKED'}
        friendTarget={invitedFriend}
        difficulty={difficulty || 'MEDIUM'}
        onMatchReady={handleMatchReady}
      />
    );
  }

  // === COMPETITIVE MATCH RESULTS SCREEN ===
  if (competitiveResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', paddingBottom: '3rem', color: '#F8FAFC', position: 'relative' }}>
        <div className="star-field" />
        <CompetitiveResults
          matchResult={competitiveResult}
          currentUserId={user?.id || currentMatch?.player1Id}
          onRematch={() => {
            if (playMode === 'FRIEND' && currentMatch) {
              const oppId = currentMatch.player1Id === user?.id ? currentMatch.player2Id : currentMatch.player1Id;
              const oppName = currentMatch.player1Id === user?.id ? currentMatch.player2Username : currentMatch.player1Username;
              if (oppId && oppId !== 999999) {
                setInvitedFriend({ id: oppId, username: oppName });
              }
            }
            clearMatchStorage(currentMatch?.id);
            setCompetitiveResult(null);
            setShowMatchmaking(true);
          }}
          onDashboard={() => {
            clearMatchStorage(currentMatch?.id);
            navigate('/dashboard');
          }}
        />
      </div>
    );
  }

  // === WAITING FOR OPPONENT TO FINISH ===
  if (waitingForOpponent) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div className="star-field" />
        <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(8, 14, 33, 0.85)', borderRadius: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Challenge Completed</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Your score: <strong className="font-mono" style={{ color: '#38bdf8' }}>{scoreRef.current} / {puzzles.length}</strong></p>
          <p className="font-mono" style={{ color: '#38bdf8', fontSize: '0.8rem' }}>Waiting for opponent synchronization...</p>
        </div>
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
        loadingTier={loadingDifficulty}
        onSelectDifficulty={(diff) => startGame(diff)}
        onBack={() => setShowModeModal(true)}
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
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', color: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
      <XPPopup popups={xpPopups} />
      <div className="star-field" />

      <div style={{ maxWidth: '740px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem', position: 'relative', zIndex: 1 }}>
        
        {/* Reusable Header Progress Bar */}
        <GameProgress
          current={index + 1}
          total={puzzles.length}
          score={score}
          difficulty={difficulty}
          onExit={() => setShowExitModal(true)}
          formattedTime={formattedTime}
          urgency={urgency}
          onMidnightRollover={() => startGame(difficulty)}
        />

        {/* Exit Game Confirmation Modal */}
        <ExitModal
          isOpen={showExitModal}
          onCancel={() => setShowExitModal(false)}
          onConfirm={handleExitGame}
        />

        {/* Puzzle Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              background: 'rgba(8, 14, 33, 0.85)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.25rem',
              padding: '2.25rem',
              marginBottom: '1.5rem',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.08)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block' }}>
                // SEQUENCE RECOGNITION
              </span>
              <div
                className="font-mono"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.3rem)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.05em',
                  padding: '1.5rem',
                  background: 'rgba(10, 18, 42, 0.65)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(59, 130, 246, 0.25)'
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
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: '0.75rem',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <Lightbulb size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: '#93c5fd', lineHeight: 1.5, fontWeight: 500 }}>{puzzle.hint}</p>
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
                          border: answer === opt ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                          background: answer === opt ? 'rgba(59, 130, 246, 0.15)' : 'rgba(10, 18, 42, 0.65)',
                          color: answer === opt ? '#FFFFFF' : '#CBD5E1',
                          fontSize: '1.25rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: answer === opt ? '0 0 20px rgba(59, 130, 246, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.2)',
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
                      placeholder="Enter solution number..."
                      className="input-dark"
                      style={{ flex: 1, textAlign: 'center', fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 800, padding: '0.85rem' }}
                      autoFocus
                    />
                  </div>
                )}

                <button
                  onClick={() => answer && handleSubmit()}
                  disabled={!answer}
                  style={{
                    width: '100%',
                    marginTop: '1.25rem',
                    padding: '0.85rem',
                    borderRadius: '999px',
                    background: answer ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255, 255, 255, 0.08)',
                    color: answer ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                    border: 'none',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    cursor: answer ? 'pointer' : 'not-allowed',
                    boxShadow: answer ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Submit Solution &rarr;
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
                    background: result === 'correct' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                    border: `1px solid ${result === 'correct' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                    marginBottom: '1rem'
                  }}
                >
                  {result === 'correct' ? <CheckCircle size={22} color="#22c55e" /> : <XCircle size={22} color="#f43f5e" />}
                  <div>
                    <div className="font-mono" style={{ fontWeight: 800, color: result === 'correct' ? '#22c55e' : '#f43f5e', fontSize: '0.95rem' }}>
                      {result === 'correct' ? '🎉 Correct Number Found!' : `Incorrect — The correct answer was ${puzzle.correctAnswer || puzzle.answer}`}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {puzzle.explanation && (
                  <div style={{ padding: '1.15rem', borderRadius: '0.85rem', background: 'rgba(10, 18, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.25rem' }}>
                    <p className="font-mono" style={{ fontSize: '0.725rem', fontWeight: 700, color: '#38BDF8', marginBottom: '0.35rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>// SEQUENCE RULE</p>
                    <p style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.6, fontWeight: 400 }}>{puzzle.explanation}</p>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '999px',
                    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  {index + 1 >= puzzles.length ? 'Final Summary & Rewards 🏆' : 'Next Puzzle &rarr;'}
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
                className="pill-btn-ghost"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <Lightbulb size={14} /> Hint (-30% XP)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
