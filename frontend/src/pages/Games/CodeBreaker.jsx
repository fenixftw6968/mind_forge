import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Lightbulb, CheckCircle2, XCircle, Sparkles, Delete, Swords, Users, Clock, Shield } from 'lucide-react';
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
import { codeBreakerQuestions } from '../../data/codeBreakerQuestions';
import api from '../../utils/api';
import { useMatchSocket } from '../../hooks/useMatchSocket';

const TIMER_SECONDS = { EASY: 150, MEDIUM: 120, HARD: 90 };
const XP_PER_DIFFICULTY = { EASY: 15, MEDIUM: 30, HARD: 60 };

export default function CodeBreaker() {
  const { user, refreshUser } = useAuth();
  const { showXPPopup } = useGame();
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

  const [difficulty, setDifficulty] = useState(null);
  const [puzzles, setPuzzles] = useState([]);
  const [index, setIndex] = useState(0);
  const [digits, setDigits] = useState(['', '', '']);
  const [activeDigit, setActiveDigit] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const mistakesRef = useRef(0);

  const clearMatchStorage = useCallback((matchId) => {
    localStorage.removeItem('activeMatchId_code-breaker');
    if (matchId) {
      localStorage.removeItem('activeMatchIndex_' + matchId);
      localStorage.removeItem('activeMatchScore_' + matchId);
      localStorage.removeItem('activeMatchMistakes_' + matchId);
    }
  }, []);

  // Listen for MATCH_FINISHED / MATCH_COMPLETED from opponent
  useMatchSocket(currentMatch?.id, (event) => {
    if (event.type === 'MATCH_FINISHED' || event.type === 'MATCH_COMPLETED' || event.data?.status === 'FINISHED') {
      setWaitingForOpponent(false);
      setCompetitiveResult(event.data);
      clearMatchStorage(currentMatch?.id);
    }
  });

  // Poll for match completion while waiting for opponent (as bulletproof fallback)
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

  const puzzle = puzzles[index];
  const digitCount = puzzle?.digitCount || 3;
  const currentDiff = (puzzle?.difficulty || difficulty || 'MEDIUM').toUpperCase();
  const timerLimit = TIMER_SECONDS[currentDiff] || 120;

  const { timeLeft, formattedTime, urgency, start, reset, pause } = useTimer(
    timerLimit,
    { onComplete: () => handleSubmit(true) }
  );

  // Check for active match on mount
  useEffect(() => {
    if (!user) return;
    const activeMatchId = localStorage.getItem('activeMatchId_code-breaker');
    if (!activeMatchId) return;
    
    const checkActiveMatch = async () => {
      try {
        const res = await api.get(`/api/matches/active?gameSlug=code-breaker`);
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
              // Restore questions and progress
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
          localStorage.removeItem('activeMatchId_code-breaker');
        }
      } catch (e) {
        console.error("Failed to check active match", e);
        localStorage.removeItem('activeMatchId_code-breaker');
      }
    };
    
    checkActiveMatch();
  }, [user, clearMatchStorage]);

  // Save active match progress in localStorage
  useEffect(() => {
    if (currentMatch && currentMatch.status !== 'FINISHED' && puzzles.length > 0) {
      localStorage.setItem('activeMatchId_code-breaker', currentMatch.id);
      localStorage.setItem('activeMatchIndex_' + currentMatch.id, index);
      localStorage.setItem('activeMatchScore_' + currentMatch.id, score);
      localStorage.setItem('activeMatchMistakes_' + currentMatch.id, mistakes);
    }
  }, [index, score, mistakes, currentMatch, puzzles]);

  // Auto-start match if accepted from invite (go through countdown lobby first)
  useEffect(() => {
    if (location.state?.acceptedMatch) {
      const match = location.state.acceptedMatch;
      setCurrentMatch(match);
      setPlayMode('FRIEND');
      setShowModeModal(false);
      setShowMatchmaking(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  const handleExitGame = async () => {
    setShowExitModal(false);
    if (currentMatch?.id) {
      try {
        await api.post(`/api/matches/${currentMatch.id}/abandon`);
      } catch (e) {}
      clearMatchStorage(currentMatch.id);
    } else if (showMatchmaking) {
      try {
        await api.post('/api/matches/queue/cancel?gameSlug=code-breaker');
      } catch (e) {}
    }
    navigate('/games');
  };

  const handleMatchReady = (match) => {
    setShowMatchmaking(false);
    setShowSocialDrawer(false);
    setCurrentMatch(match);
    startTimeRef.current = Date.now();

    let challengeQuestions = [];
    try {
      if (match.challengeData) {
        const parsed = typeof match.challengeData === 'string' ? JSON.parse(match.challengeData) : match.challengeData;
        if (Array.isArray(parsed) && parsed.length > 0) {
          challengeQuestions = parsed;
        }
      }
    } catch (e) {
      console.warn("Could not parse match challengeData", e);
    }

    if (challengeQuestions.length === 0) {
      const selected = getDailyQuestionSet({
        gameType: 'code-breaker',
        difficulty: 'MEDIUM',
        questionBank: codeBreakerQuestions,
        count: 4,
        userShuffle: false
      });
      challengeQuestions = selected.length > 0 ? selected : codeBreakerQuestions.slice(0, 4);
    }

    setPuzzles(challengeQuestions);
    const matchDiff = match.difficulty || 'MEDIUM';
    setDifficulty(matchDiff);
    setIndex(0);
    setScore(0);
    setMistakes(0);
    setTotalXP(0);
    setHintUsed(false);
    setShowHint(false);
    setResult(null);
    setShowResult(false);
    setShowComplete(false);
    setCompetitiveResult(null);

    const count = challengeQuestions[0]?.digitCount || 3;
    setDigits(new Array(count).fill(''));
    setActiveDigit(0);
  };

  const startGame = (diff) => {
    const selected = getRandomQuestionSet({
      gameType: 'code-breaker',
      difficulty: diff,
      questionBank: codeBreakerQuestions,
      count: 6,
      userShuffle: true
    });

    const activeList = selected.length > 0 ? selected : codeBreakerQuestions.filter(q => q.difficulty === diff);
    setPuzzles(activeList);
    setDifficulty(diff);
    setIndex(0);
    setScore(0);
    setMistakes(0);
    setTotalXP(0);
    setHintUsed(false);
    setShowHint(false);
    setResult(null);
    setShowResult(false);
    setShowComplete(false);
    setCompetitiveResult(null);

    const count = activeList[0]?.digitCount || (diff === 'HARD' ? 4 : 3);
    setDigits(new Array(count).fill(''));
    setActiveDigit(0);
  };

  // Guarantee clean input and result state on every question index change
  useEffect(() => {
    if (puzzles.length > 0) {
      const count = puzzles[index]?.digitCount || 3;
      setDigits(new Array(count).fill(''));
      setActiveDigit(0);
      setHintUsed(false);
      setShowHint(false);
      setResult(null);
      setShowResult(false);
      if (!showComplete) {
        reset(TIMER_SECONDS[(puzzles[index]?.difficulty || difficulty || 'MEDIUM').toUpperCase()] || 120);
        start();
      }
    }
  }, [index, puzzles, showComplete]);

  const handleDigitInput = (val) => {
    if (showResult || !puzzle) return;
    const newDigits = [...digits];
    newDigits[activeDigit] = String(val);
    setDigits(newDigits);
    if (activeDigit < digitCount - 1) {
      setActiveDigit(activeDigit + 1);
    }
  };

  const handleBackspace = () => {
    if (showResult || !puzzle) return;
    const newDigits = [...digits];
    if (newDigits[activeDigit] !== '') {
      newDigits[activeDigit] = '';
      setDigits(newDigits);
    } else if (activeDigit > 0) {
      newDigits[activeDigit - 1] = '';
      setDigits(newDigits);
      setActiveDigit(activeDigit - 1);
    }
  };

  const handleSubmit = useCallback(async (timedOut = false) => {
    if (!puzzle || result) return;
    pause();

    const userGuess = digits.join('');
    const correctSecret = String(puzzle.secret || puzzle.correctAnswer).trim();
    const isCorrect = !timedOut && userGuess === correctSecret;

    setResult(isCorrect ? 'correct' : 'wrong');
    setShowResult(true);

    if (!isCorrect) {
      setMistakes(m => m + 1);
    }

    if (playMode === 'PRACTICE') {
      const baseXP = XP_PER_DIFFICULTY[currentDiff] || 30;
      const earned = isCorrect ? (hintUsed ? Math.floor(baseXP * 0.7) : baseXP) : 0;

      if (isCorrect) {
        setScore(s => s + 1);
        setTotalXP(t => t + earned);
        showXPPopup(earned);
      }

      try {
        const res = await api.post('/api/games/code-breaker/attempts', {
          puzzleId: puzzle.id,
          userAnswer: userGuess,
          hintUsed,
          timeTakenSeconds: timerLimit - timeLeft
        });
        if (res.data?.user) {
          refreshUser(res.data.user);
        }
      } catch (e) {
        // Offline fallback
      }
    } else {
      if (isCorrect) {
        setScore(s => s + 1);
      }
    }
  }, [puzzle, result, digits, hintUsed, currentDiff, timerLimit, timeLeft, pause, showXPPopup, refreshUser, playMode]);

  const handleNext = async () => {
    const nextCount = puzzles[index + 1]?.digitCount || 3;
    setDigits(new Array(nextCount).fill(''));
    setActiveDigit(0);
    setHintUsed(false);
    setShowHint(false);
    setResult(null);
    setShowResult(false);
    if (index + 1 < puzzles.length) {
      setIndex(i => i + 1);
    } else {
      if (playMode === 'PRACTICE') {
        setShowComplete(true);
      } else if (currentMatch) {
        const totalDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
        try {
          if (currentMatch.player2Id === 999999) {
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
            setWaitingForOpponent(true);
            const res = await api.post(`/api/matches/${currentMatch.id}/submit`, {
              score: score,
              timeTakenSeconds: totalDuration,
              mistakes: mistakes,
              detailedAnswers: 'Code Breaker Set Completed'
            });
             if (res.data?.status === 'FINISHED') {
              setWaitingForOpponent(false);
              setCompetitiveResult(res.data);
              clearMatchStorage(currentMatch.id);
            }
          }
        } catch (e) {
          console.error("Match result submit error", e);
          setWaitingForOpponent(false);
        }
      }
    }
  };

  // === PLAY MODE SELECT MODAL ===
  if (showModeModal) {
    return (
      <PlayModeModal
        isOpen={showModeModal}
        gameTitle="Code Breaker"
        gameIcon="🔐"
        onClose={() => navigate('/games')}
        onSelectMode={handleSelectMode}
      />
    );
  }

  // === MATCHMAKING LOBBY ===
  if (showMatchmaking) {
    return (
      <MatchmakingLobby
        isOpen={showMatchmaking}
        gameSlug="code-breaker"
        gameTitle="Code Breaker"
        mode={playMode === 'FRIEND' ? 'FRIEND' : 'RANKED'}
        friendTarget={invitedFriend}
        initialMatch={currentMatch}
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

  // === WAITING FOR OPPONENT TO FINISH ===
  if (waitingForOpponent) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>You finished!</h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Waiting for your opponent to finish...</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366F1', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
        </div>
      </div>
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

  // === DIFFICULTY SELECT (Practice Mode) ===
  if (!difficulty && playMode === 'PRACTICE') {
    return (
      <DifficultySelector
        title="Code Breaker"
        subtitle="Crack the vault! Use logical deduction clues to identify the secret combination."
        icon="🔐"
        onSelectDifficulty={(diff) => startGame(diff)}
        onBack={() => setShowModeModal(true)}
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
        gameTitle="Code Breaker"
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

        {/* Exit Game Confirmation Modal */}
        <ExitModal
          isOpen={showExitModal}
          onCancel={() => setShowExitModal(false)}
          onConfirm={handleExitGame}
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
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
                position: 'relative'
              }}
            >
              {/* Header Title */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EEF2FF', border: '1px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <KeyRound size={22} color="#4F46E5" />
                  </div>
                  <div>
                    <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      {puzzle.title || "Crack the Code"}
                    </h2>
                    <p style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 500 }}>
                      Deduce the {digitCount}-digit secret code using the clues below
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

              {/* Clues Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                {puzzle.clues.map((clue, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.75rem',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    {/* Clue Guess Code */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                      {clue.guess.split('').map((char, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            width: '32px',
                            height: '36px',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            border: '1px solid #C7D2FE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            color: '#4F46E5'
                          }}
                        >
                          {char}
                        </div>
                      ))}
                    </div>

                    {/* Clue Text */}
                    <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: 600, flex: 1 }}>
                      {clue.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hint Box */}
              {showHint && puzzle.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
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
                </motion.div>
              )}

              {/* Player Code Input Slots */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Enter Your Secret Code
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {digits.map((digit, dIdx) => {
                    const isSelected = activeDigit === dIdx;
                    return (
                      <button
                        key={dIdx}
                        onClick={() => !showResult && setActiveDigit(dIdx)}
                        style={{
                          width: '56px',
                          height: '64px',
                          borderRadius: '12px',
                          background: digit !== '' ? '#EEF2FF' : '#F8FAFC',
                          border: isSelected ? '2px solid #6366F1' : '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.85rem',
                          fontWeight: 800,
                          color: '#0F172A',
                          fontFamily: 'var(--font-display)',
                          cursor: showResult ? 'default' : 'pointer',
                          boxShadow: isSelected ? '0 0 0 3px rgba(99, 102, 241, 0.15)' : '0 1px 2px rgba(0,0,0,0.03)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {digit || (isSelected ? <span style={{ opacity: 0.3 }}>_</span> : '')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Keypad */}
              {!showResult && (
                <div style={{ maxWidth: '320px', margin: '0 auto 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleDigitInput(n)}
                      className="btn-secondary"
                      style={{ height: '48px', fontSize: '1.25rem', fontWeight: 700, borderRadius: '8px' }}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={handleBackspace}
                    className="btn-secondary"
                    style={{ height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Delete size={18} />
                  </button>
                  <button
                    onClick={() => handleDigitInput(0)}
                    className="btn-secondary"
                    style={{ height: '48px', fontSize: '1.25rem', fontWeight: 700, borderRadius: '8px' }}
                  >
                    0
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={digits.some(d => d === '')}
                    className="btn-primary"
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      opacity: digits.some(d => d === '') ? 0.4 : 1,
                      cursor: digits.some(d => d === '') ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Unlock
                  </button>
                </div>
              )}

              {/* Results feedback */}
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {result === 'correct' ? <CheckCircle2 size={24} color="#059669" /> : <XCircle size={24} color="#E11D48" />}
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: result === 'correct' ? '#047857' : '#BE123C' }}>
                      {result === 'correct' ? 'Vault Unlocked! 🎉' : 'Incorrect Code'}
                    </h3>
                  </div>

                  <p style={{ color: '#334155', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5, fontWeight: 500 }}>
                    {puzzle.explanation}
                  </p>

                  <button
                    onClick={handleNext}
                    className="btn-primary"
                    style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
                  >
                    {index + 1 < puzzles.length ? 'Next Puzzle →' : 'View Results'}
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
