import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Lightbulb, CheckCircle2, XCircle, Sparkles, Delete, Swords, Users, Clock, Shield, Lock } from 'lucide-react';
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
  const [loadingDifficulty, setLoadingDifficulty] = useState(null);
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
  const isSubmittingRef = useRef(false);

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

  // Auto-start match if accepted from invite
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

  const startGame = async (diff) => {
    setLoadingDifficulty(diff);
    try {
      const selected = await selectQuestionsForGame({
        gameSlug: 'code-breaker',
        difficulty: diff,
        questionBank: codeBreakerQuestions,
        count: 6,
        userShuffle: true
      });

      const activeList = Array.isArray(selected) && selected.length > 0
        ? selected
        : codeBreakerQuestions.filter(q => q.difficulty && q.difficulty.toLowerCase() === diff.toLowerCase());

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
    } catch (e) {
      console.warn("Could not start code breaker via service, using local pool", e);
      const activeList = codeBreakerQuestions.filter(q => q.difficulty && q.difficulty.toLowerCase() === diff.toLowerCase());
      setPuzzles(activeList.slice(0, 6));
      setDifficulty(diff);
      const count = activeList[0]?.digitCount || (diff === 'HARD' ? 4 : 3);
      setDigits(new Array(count).fill(''));
      setActiveDigit(0);
    } finally {
      setLoadingDifficulty(null);
    }
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
    if (isSubmittingRef.current || !puzzle || result) return;
    isSubmittingRef.current = true;
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
    isSubmittingRef.current = false;
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
          if (currentMatch.id) {
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
              refreshUser();
              return;
            }
          }
        } catch (e) {
          console.warn("Code Breaker match submit error, using offline fallback", e);
          setWaitingForOpponent(false);
        }

        if (currentMatch.player2Id === 999999 || currentMatch.isBotMatch) {
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
      <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="star-field" />
        <div className="binary-texture" />
        <div className="mesh-glow" style={{ top: '30%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />
        
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(8, 14, 33, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1.75rem', maxWidth: '420px', width: '90%', position: 'relative', zIndex: 10 }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#60a5fa' }}>
            <Clock size={32} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            SET COMPLETED
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Synchronizing neural stream. Awaiting opponent submission...
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // === COMPETITIVE MATCH RESULTS SCREEN ===
  if (competitiveResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', paddingBottom: '3rem', position: 'relative' }}>
        <div className="star-field" />
        <div className="binary-texture" />
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
        subtitle="Deduce the multi-digit classified access code using cryptographic feedback clues."
        icon="🔐"
        loadingTier={loadingDifficulty}
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
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="star-field" />
      <div className="binary-texture" />
      <div className="mesh-glow" style={{ top: '25%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '1rem 1.5rem 4rem', position: 'relative', zIndex: 10 }}>
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
                background: 'rgba(8, 14, 33, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1.75rem',
                padding: '2rem 2.25rem',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                position: 'relative'
              }}
            >
              {/* Header Title */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <KeyRound size={22} color="#60a5fa" />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                      {puzzle.title || "DECRYPT CIPHER"}
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)', margin: '0.2rem 0 0', fontFamily: 'var(--font-mono)' }}>
                      Crack the {digitCount}-digit secret sequence using the constraints
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { setShowHint(true); setHintUsed(true); }}
                  disabled={showHint || showResult}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.45rem 1rem', borderRadius: '999px',
                    background: showHint ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontSize: '0.75rem', fontWeight: 700,
                    color: showHint ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    cursor: showHint || showResult ? 'default' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Lightbulb size={13} color={showHint ? '#64748B' : '#FBBF24'} /> {showHint ? 'HINT ACTIVE' : 'REQUEST HINT'}
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
                      gap: '1.25rem',
                      background: 'rgba(10, 18, 42, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '1rem',
                      padding: '0.85rem 1.25rem',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    {/* Clue Guess Code */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                      {clue.guess.split('').map((char, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            width: '34px',
                            height: '38px',
                            borderRadius: '8px',
                            background: '#060b1e',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 800,
                            fontSize: '1.15rem',
                            color: '#38bdf8'
                          }}
                        >
                          {char}
                        </div>
                      ))}
                    </div>

                    {/* Clue Text */}
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500, flex: 1, lineHeight: 1.4 }}>
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
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: '1rem',
                    padding: '0.9rem 1.25rem',
                    marginBottom: '2rem',
                    fontSize: '0.825rem',
                    color: '#93c5fd',
                    display: 'flex',
                    gap: '0.65rem',
                    alignItems: 'center'
                  }}
                >
                  <Lightbulb size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
                  <span><strong>DECRYPT HINT:</strong> {puzzle.hint}</span>
                </motion.div>
              )}

              {/* Player Code Input Slots */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.725rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                  [ ENTER SECRET CODE ]
                </div>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  {digits.map((digit, dIdx) => {
                    const isSelected = activeDigit === dIdx;
                    return (
                      <button
                        key={dIdx}
                        onClick={() => !showResult && setActiveDigit(dIdx)}
                        style={{
                          width: '64px',
                          height: '72px',
                          borderRadius: '1rem',
                          background: digit !== '' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(10, 18, 42, 0.7)',
                          border: isSelected ? '2px solid #3b82f6' : (digit !== '' ? '1px solid rgba(59, 130, 246, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          fontWeight: 900,
                          color: '#ffffff',
                          fontFamily: 'var(--font-mono)',
                          cursor: showResult ? 'default' : 'pointer',
                          boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {digit || (isSelected ? <span style={{ opacity: 0.5, color: '#38bdf8' }}>_</span> : '')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Keypad */}
              {!showResult && (
                <div style={{ maxWidth: '340px', margin: '0 auto 1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleDigitInput(n)}
                      style={{
                        height: '52px',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        borderRadius: '0.85rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={handleBackspace}
                    style={{
                      height: '52px',
                      borderRadius: '0.85rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#ffffff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; }}
                  >
                    <Delete size={18} />
                  </button>
                  <button
                    onClick={() => handleDigitInput(0)}
                    style={{
                      height: '52px',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      borderRadius: '0.85rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                  >
                    0
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={digits.some(d => d === '')}
                    style={{
                      height: '52px',
                      borderRadius: '0.85rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      background: digits.some(d => d === '') ? 'rgba(255, 255, 255, 0.08)' : 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                      color: digits.some(d => d === '') ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
                      border: 'none',
                      opacity: digits.some(d => d === '') ? 0.4 : 1,
                      cursor: digits.some(d => d === '') ? 'not-allowed' : 'pointer',
                      boxShadow: digits.some(d => d === '') ? 'none' : '0 0 15px rgba(59, 130, 246, 0.4)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    UNLOCK
                  </button>
                </div>
              )}

              {/* Results feedback */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: result === 'correct' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    border: `1px solid ${result === 'correct' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                    borderRadius: '1.25rem',
                    padding: '1.5rem',
                    marginTop: '1.5rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {result === 'correct' ? <CheckCircle2 size={24} color="#22c55e" /> : <XCircle size={24} color="#f43f5e" />}
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: result === 'correct' ? '#22c55e' : '#f43f5e', margin: 0 }}>
                      {result === 'correct' ? 'VAULT UNLOCKED' : 'ACCESS DENIED'}
                    </h3>
                  </div>

                  <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.5, fontWeight: 500 }}>
                    {puzzle.explanation}
                  </p>

                  <button
                    onClick={handleNext}
                    style={{
                      padding: '0.75rem 2.25rem',
                      borderRadius: '999px',
                      background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      letterSpacing: '0.02em',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                    }}
                  >
                    {index + 1 < puzzles.length ? 'NEXT CIPHER →' : 'VIEW CLASSIFICATION'}
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
