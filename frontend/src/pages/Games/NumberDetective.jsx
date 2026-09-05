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
          localStorage.removeItem('activeMatchId_number-detective');
        }
      } catch (e) {
        console.error("Failed to check active match", e);
        localStorage.removeItem('activeMatchId_number-detective');
      }
    };
    
    checkActiveMatch();
  }, [user, clearMatchStorage]);

  // Save active match progress in localStorage
  useEffect(() => {
    if (currentMatch && currentMatch.status !== 'FINISHED' && puzzles.length > 0) {
      localStorage.setItem('activeMatchId_number-detective', currentMatch.id);
      localStorage.setItem('activeMatchIndex_' + currentMatch.id, index);
      localStorage.setItem('activeMatchScore_' + currentMatch.id, score);
      localStorage.setItem('activeMatchMistakes_' + currentMatch.id, mistakes);
    }
  }, [index, score, mistakes, currentMatch, puzzles]);

  const puzzle = puzzles[index];
  const timerLimit = difficulty ? TIMER_SECONDS[difficulty.toUpperCase()] || 90 : 90;

  const { timeLeft, formattedTime, urgency, start, reset } = useTimer(
    timerLimit,
    { onComplete: () => handleSubmit(true) }
  );

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
        await api.post('/api/matches/queue/cancel?gameSlug=number-detective');
      } catch (e) {}
    }
    navigate('/games');
  };

  const handleMatchReady = (match) => {
    setShowMatchmaking(false);
    setShowSocialDrawer(false);
    setShowModeModal(false);
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
    const matchDiff = match.difficulty || 'MEDIUM';
    setDifficulty(matchDiff);
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

  const startGame = async (diff) => {
    setLoadingDifficulty(diff);
    try {
      const selected = await selectQuestionsForGame({
        gameSlug: 'number-detective',
        difficulty: diff,
        questionBank: numberDetectiveQuestions,
        count: 10,
        userShuffle: true
      });

      const activeList = Array.isArray(selected) && selected.length > 0
        ? selected
        : numberDetectiveQuestions.filter(q => q.difficulty && q.difficulty.toLowerCase() === diff.toLowerCase());

      setPuzzles(activeList);
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
    } catch (e) {
      console.warn("Could not start game via service, falling back to local pool", e);
      const activeList = numberDetectiveQuestions.filter(q => q.difficulty && q.difficulty.toLowerCase() === diff.toLowerCase());
      setPuzzles(activeList.slice(0, 10));
      setDifficulty(diff);
    } finally {
      setLoadingDifficulty(null);
    }
  };

  // Guarantee clean answer state and fresh timer on every question index change
  useEffect(() => {
    setAnswer('');
    setHintUsed(false);
    setResult(null);
    setShowResult(false);
    if (puzzles.length > 0 && !showComplete) {
      const currentDiff = (puzzles[index]?.difficulty || difficulty || 'MEDIUM').toUpperCase();
      reset(TIMER_SECONDS[currentDiff] || 90);
      start();
    }
  }, [index, puzzles, showComplete]);

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
  }, [puzzle, answer, hintUsed, result, difficulty, playMode, showXPPopup]);

  const handleNext = async () => {
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

        // Offline / fallback simulation if server was unreachable
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
        difficulty={difficulty}
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

  // === COMPETITIVE MATCH RESULTS SCREEN ===
  if (competitiveResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', paddingBottom: '3rem', color: '#F8FAFC' }}>
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
      <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>You finished!</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Your score: <strong style={{ color: '#4ADE80' }}>{scoreRef.current} / {puzzles.length}</strong></p>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Waiting for your opponent to finish...</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
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
    <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', color: '#F8FAFC' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
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
            transition={{ duration: 0.3 }}
            style={{
              background: '#242424',
              border: '1px solid #2E2E2E',
              borderRadius: '1.25rem',
              padding: '2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Find the missing number in the sequence
              </p>
              <div
                className="font-display"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.3rem)',
                  fontWeight: 800,
                  color: '#4ADE80',
                  letterSpacing: '0.05em',
                  padding: '1.5rem',
                  background: '#1A1A1A',
                  borderRadius: '1rem',
                  border: '1px solid #333333'
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
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: '0.75rem',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <Lightbulb size={16} color="#4ADE80" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: '#4ADE80', lineHeight: 1.5, fontWeight: 500 }}>{puzzle.hint}</p>
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
                          border: answer === opt ? '2px solid #22C55E' : '1px solid #2E2E2E',
                          background: answer === opt ? 'rgba(34, 197, 94, 0.15)' : '#1C1C1C',
                          color: answer === opt ? '#4ADE80' : '#F8FAFC',
                          fontSize: '1.25rem',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
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
                      style={{ flex: 1, textAlign: 'center', fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800, background: '#1C1C1C', border: '1px solid #2E2E2E', borderRadius: '0.75rem', padding: '0.85rem', color: '#F8FAFC' }}
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
                    background: result === 'correct' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                    border: `1px solid ${result === 'correct' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                    marginBottom: '1rem'
                  }}
                >
                  {result === 'correct' ? <CheckCircle size={22} color="#4ADE80" /> : <XCircle size={22} color="#FB7185" />}
                  <div>
                    <div style={{ fontWeight: 800, color: result === 'correct' ? '#4ADE80' : '#FB7185', fontSize: '0.95rem' }}>
                      {result === 'correct' ? '🎉 Correct!' : `Incorrect — The correct answer was ${puzzle.correctAnswer || puzzle.answer}`}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', background: '#1C1C1C', border: '1px solid #2E2E2E', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.725rem', fontWeight: 800, color: '#38BDF8', marginBottom: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Explanation</p>
                  <p style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.6, fontWeight: 500 }}>{puzzle.explanation}</p>
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
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 600
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
