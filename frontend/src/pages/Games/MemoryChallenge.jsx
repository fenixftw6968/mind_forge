import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, XCircle, Swords, Users, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
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
import { memoryChallengeQuestions } from '../../data/memoryChallengeQuestions';
import { balanceAndRandomizeQuestionOptions, createSeededRandom } from '../../utils/optionRandomizer';
import { shuffleArray } from '../../utils/shuffleQuestions';
import api from '../../utils/api';
import { useMatchSocket } from '../../hooks/useMatchSocket';

const XP_PER_DIFFICULTY = { EASY: 15, MEDIUM: 25, HARD: 50 };

export default function MemoryChallenge() {
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

  const [difficulty, setDifficulty]     = useState(null); // null = selecting
  const [loadingDifficulty, setLoadingDifficulty] = useState(null);
  const [scenes, setScenes]             = useState([]);
  const [sceneIndex, setSceneIndex]     = useState(0);
  const [phase, setPhase]               = useState('reveal'); // reveal | recall | result
  const [timeLeft, setTimeLeft]         = useState(8);
  const [selected, setSelected]         = useState(null);
  const [showResult, setShowResult]     = useState(false);
  const [score, setScore]               = useState(0);
  const [mistakes, setMistakes]         = useState(0);
  const [totalXP, setTotalXP]           = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [latestUser, setLatestUser]     = useState(null);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const mistakesRef = useRef(0);
  const isSubmittingRef = useRef(false);

  const clearMatchStorage = useCallback((matchId) => {
    localStorage.removeItem('activeMatchId_memory-challenge');
    if (matchId) {
      localStorage.removeItem('activeMatchIndex_' + matchId);
      localStorage.removeItem('activeMatchScore_' + matchId);
      localStorage.removeItem('activeMatchMistakes_' + matchId);
    }
  }, []);

  // Listen for MATCH_FINISHED from opponent
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
    const activeMatchId = localStorage.getItem('activeMatchId_memory-challenge');
    if (!activeMatchId) return;
    
    const checkActiveMatch = async () => {
      try {
        const res = await api.get(`/api/matches/active?gameSlug=memory-challenge`);
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
              
              if (savedIndex !== null) setSceneIndex(parseInt(savedIndex, 10));
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
          localStorage.removeItem('activeMatchId_memory-challenge');
        }
      } catch (e) {
        console.error("Failed to check active match", e);
        localStorage.removeItem('activeMatchId_memory-challenge');
      }
    };
    
    checkActiveMatch();
  }, [user, clearMatchStorage]);

  const scene = scenes[sceneIndex];

  // Reveal countdown timer
  useEffect(() => {
    if (phase !== 'reveal' || !scene) return;
    const t = scene.revealTime || 8;
    setTimeLeft(t);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('recall');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, sceneIndex, scene]);

  const startGame = useCallback(async (diff) => {
    setLoadingDifficulty(diff);
    try {
      const selected = await selectQuestionsForGame({
        gameSlug: 'memory-challenge',
        difficulty: diff,
        questionBank: memoryChallengeQuestions,
        count: 5,
        userShuffle: true
      });
      let activeList = Array.isArray(selected) && selected.length > 0 ? selected : [];
      if (activeList.length === 0) {
        const fallback = memoryChallengeQuestions.filter(q => q.difficulty.toLowerCase() === diff.toLowerCase());
        activeList = fallback.length > 0 ? fallback.slice(0, 5) : memoryChallengeQuestions.slice(0, 5);
      }
      setScenes(activeList);
      setDifficulty(diff);
      setSceneIndex(0);
      setPhase('reveal');
      setSelected(null);
      setShowResult(false);
      setScore(0);
      setMistakes(0);
      setTotalXP(0);
      setShowComplete(false);
      scoreRef.current = 0;
      mistakesRef.current = 0;
      startTimeRef.current = Date.now();
    } catch (e) {
      console.warn("Failed to load questions, using fallback set:", e);
      const fallback = memoryChallengeQuestions.filter(q => q.difficulty.toLowerCase() === diff.toLowerCase());
      const activeList = fallback.length > 0 ? fallback.slice(0, 5) : memoryChallengeQuestions.slice(0, 5);
      setScenes(activeList);
      setDifficulty(diff);
      setPhase('reveal');
      setSceneIndex(0);
    } finally {
      setLoadingDifficulty(null);
    }
  }, []);

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

    const matchSeed = matchData.id || matchData.createdAt || 'match-seed';
    const seededRandom = createSeededRandom(matchSeed);

    if (!parsedQuestions || !Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      const matchDiff = matchData.difficulty ? matchData.difficulty.toLowerCase() : 'medium';
      const filtered = memoryChallengeQuestions.filter(q => q.difficulty.toLowerCase() === matchDiff);
      const pool = filtered.length > 0 ? filtered : memoryChallengeQuestions;
      const shuffledPool = shuffleArray(pool, seededRandom);
      parsedQuestions = shuffledPool.slice(0, 5);
    }

    parsedQuestions = balanceAndRandomizeQuestionOptions(parsedQuestions, seededRandom);

    setScenes(parsedQuestions);
    setDifficulty((matchData.difficulty || 'MEDIUM').toUpperCase());
    setSceneIndex(0);
    setPhase('reveal');
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setMistakes(0);
    setTotalXP(0);
    setShowComplete(false);
    scoreRef.current = 0;
    mistakesRef.current = 0;
    startTimeRef.current = Date.now();
  }, []);

  const handleExitGame = () => {
    setShowExitModal(false);
    if (currentMatch) {
      clearMatchStorage(currentMatch.id);
    }
    navigate('/games');
  };

  const handleAnswer = async (choice) => {
    if (isSubmittingRef.current || selected || phase !== 'recall') return;
    isSubmittingRef.current = true;
    setSelected(choice);
    setShowResult(true);

    const isCorrect = choice === scene.correctAnswer;
    if (isCorrect) {
      const baseXP = XP_PER_DIFFICULTY[difficulty] || 25;
      scoreRef.current += 1;
      setScore(s => s + 1);
      setTotalXP(t => t + baseXP);
      showXPPopup(baseXP);
    } else {
      mistakesRef.current += 1;
      setMistakes(m => m + 1);
    }

    if (playMode === 'PRACTICE') {
      try {
        const res = await api.post('/api/games/memory-challenge/attempts', {
          puzzleId: scene.id,
          userAnswer: choice,
          hintUsed: false,
          timeTakenSeconds: 8
        });

        if (res.data?.user) {
          setLatestUser(res.data.user);
        }
      } catch (e) {
        // Offline / fallback mode
      }
    }
  };

  const handleNext = async () => {
    isSubmittingRef.current = false;
    setSelected(null);
    setShowResult(false);
    if (sceneIndex + 1 >= scenes.length) {
      if (playMode === 'PRACTICE') {
        if (latestUser) {
          refreshUser(latestUser);
        }
        setShowComplete(true);
      } else if (currentMatch) {
        const totalDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
        try {
          if (currentMatch.id) {
            setWaitingForOpponent(true);
            const res = await api.post(`/api/matches/${currentMatch.id}/submit`, {
              score: scoreRef.current,
              timeTakenSeconds: totalDuration,
              mistakes: mistakesRef.current,
              detailedAnswers: 'Memory Challenge Set Completed'
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
          const botScore = Math.max(0, scoreRef.current + (Math.random() > 0.4 ? 0 : -1));
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
      setSceneIndex(i => i + 1);
      setPhase('reveal');
    }
  };

  // === PLAY MODE SELECT MODAL ===
  if (showModeModal) {
    return (
      <PlayModeModal
        isOpen={showModeModal}
        gameTitle="Memory Challenge"
        gameIcon="👁️"
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
        gameSlug="memory-challenge"
        gameTitle="Memory Challenge"
        mode={playMode === 'FRIEND' ? 'FRIEND' : 'RANKED'}
        friendTarget={invitedFriend}
        difficulty={difficulty || 'MEDIUM'}
        onMatchReady={handleMatchReady}
      />
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
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Your score: <strong className="font-mono" style={{ color: '#38bdf8' }}>{scoreRef.current} / {scenes.length}</strong></p>
          <p className="font-mono" style={{ color: '#38bdf8', fontSize: '0.8rem' }}>Waiting for opponent synchronization...</p>
        </div>
      </div>
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

  // === DIFFICULTY SELECT (Practice Mode) ===
  if (!difficulty && playMode === 'PRACTICE') {
    return (
      <DifficultySelector
        title="Memory Challenge"
        subtitle="Study the complex scene carefully before it disappears. Then answer from memory."
        icon="👁️"
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
        total={scenes.length}
        xpEarned={totalXP}
        gameTitle="Memory Challenge"
        onPlayAgain={() => startGame(difficulty)}
      />
    );
  }

  if (!scene) return null;

  const choicesList = scene.options || (scene.questions?.[0]?.choices) || [];

  return (
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', color: '#F8FAFC', position: 'relative' }}>
      <XPPopup popups={xpPopups} />
      <div className="star-field" />

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem', position: 'relative', zIndex: 1 }}>
        
        {/* Progress Header */}
        <GameProgress
          current={sceneIndex + 1}
          total={scenes.length}
          score={score}
          difficulty={difficulty}
          onExit={() => setShowExitModal(true)}
          formattedTime={phase === 'reveal' ? `${timeLeft}s` : null}
          urgency={timeLeft <= 2 ? 'critical' : 'normal'}
          onMidnightRollover={() => startGame(difficulty)}
        />

        {/* Exit Game Confirmation Modal */}
        <ExitModal
          isOpen={showExitModal}
          onCancel={() => setShowExitModal(false)}
          onConfirm={handleExitGame}
        />

        {/* REVEAL PHASE */}
        {phase === 'reveal' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Eye size={20} color="#38bdf8" />
                <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                  {scene.title}
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: 400 }}>{scene.description}</p>
            </div>

            {/* Scene Matrix Display */}
            <div style={{
              background: 'rgba(8, 14, 33, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.25rem',
              padding: '2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${scene.items.length > 6 ? 3 : 3}, 1fr)`, gap: '1rem' }}>
                {scene.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1.25rem 0.75rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '0.875rem',
                      gap: '0.5rem',
                      textAlign: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{item.emoji}</span>
                    <span className="font-mono" style={{ fontSize: '0.8rem', color: '#F8FAFC', fontWeight: 700, lineHeight: 1.3 }}>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Countdown bar */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden', maxWidth: '300px', margin: '0 auto' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: '999px', background: timeLeft <= 2 ? '#f43f5e' : 'linear-gradient(90deg, #3b82f6, #38bdf8, #60a5fa)' }}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / (scene.revealTime || 8)) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
              <p className="font-mono" style={{ marginTop: '0.75rem', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>Scene obscured in {timeLeft}s...</p>
            </div>
          </motion.div>
        )}

        {/* RECALL PHASE */}
        {phase === 'recall' && (
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <EyeOff size={18} color="#38bdf8" />
                  <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                    // SCENE OBSCURED — RECALL FROM MEMORY
                  </span>
                </div>
              </div>

              <div style={{
                background: 'rgba(8, 14, 33, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1.25rem',
                padding: '2rem',
                marginBottom: '1.25rem',
                boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
              }}>
                <p className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1.75rem', textAlign: 'center', lineHeight: 1.6 }}>
                  {scene.question}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {choicesList.map(choice => {
                    let borderColor = 'rgba(255, 255, 255, 0.08)';
                    let bg = 'rgba(255, 255, 255, 0.02)';
                    let color = '#F8FAFC';

                    if (selected) {
                      if (choice === scene.correctAnswer) {
                        borderColor = 'rgba(56, 189, 248, 0.5)';
                        bg = 'rgba(56, 189, 248, 0.12)';
                        color = '#38bdf8';
                      } else if (selected === choice) {
                        borderColor = 'rgba(244, 63, 94, 0.5)';
                        bg = 'rgba(244, 63, 94, 0.12)';
                        color = '#f43f5e';
                      }
                    }

                    return (
                      <motion.button
                        key={choice}
                        whileHover={!selected ? { scale: 1.01, borderColor: 'rgba(59, 130, 246, 0.4)' } : {}}
                        onClick={() => handleAnswer(choice)}
                        disabled={!!selected}
                        style={{
                          padding: '1.1rem',
                          borderRadius: '0.875rem',
                          border: `1px solid ${borderColor}`,
                          background: bg,
                          color,
                          cursor: selected ? 'default' : 'pointer',
                          fontSize: '0.95rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          textAlign: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {choice}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Reveal Result Info */}
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '0.85rem',
                      background: selected === scene.correctAnswer ? 'rgba(56, 189, 248, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                      border: `1px solid ${selected === scene.correctAnswer ? 'rgba(56, 189, 248, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                      marginBottom: '1rem'
                    }}
                  >
                    {selected === scene.correctAnswer ? <CheckCircle size={22} color="#38bdf8" /> : <XCircle size={22} color="#f43f5e" />}
                    <div>
                      <div className="font-mono" style={{ fontWeight: 800, color: selected === scene.correctAnswer ? '#38bdf8' : '#f43f5e', fontSize: '0.95rem' }}>
                        {selected === scene.correctAnswer ? '🎉 Perfect Recall!' : `Incorrect — The correct item was: ${scene.correctAnswer}`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '0.9rem',
                      borderRadius: '9999px',
                      background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {sceneIndex + 1 >= scenes.length ? 'Final Summary & Rewards 🏆' : 'Next Scene →'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
