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

  const clearMatchStorage = useCallback((matchId) => {
    localStorage.removeItem('activeMatchId_memory-challenge');
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

  const intervalRef = useRef(null);
  const scene = scenes[sceneIndex];

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
              // Restore questions and progress
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

  // Save active match progress in localStorage
  useEffect(() => {
    if (currentMatch && currentMatch.status !== 'FINISHED' && scenes.length > 0) {
      localStorage.setItem('activeMatchId_memory-challenge', currentMatch.id);
      localStorage.setItem('activeMatchIndex_' + currentMatch.id, sceneIndex);
      localStorage.setItem('activeMatchScore_' + currentMatch.id, score);
      localStorage.setItem('activeMatchMistakes_' + currentMatch.id, mistakes);
    }
  }, [sceneIndex, score, mistakes, currentMatch, scenes]);

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
        await api.post('/api/matches/queue/cancel?gameSlug=memory-challenge');
      } catch (e) {}
    }
    navigate('/games');
  };

  const handleMatchReady = (match) => {
    setShowMatchmaking(false);
    setShowSocialDrawer(false);
    setCurrentMatch(match);
    startTimeRef.current = Date.now();

    let challengeScenes = [];
    try {
      if (match.challengeData) {
        const parsed = typeof match.challengeData === 'string' ? JSON.parse(match.challengeData) : match.challengeData;
        if (Array.isArray(parsed) && parsed.length > 0) {
          challengeScenes = parsed.map((p, idx) => {
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

            const items = p.items || contentObj.items || ['Red Bag', 'Silver Key', 'Laptop', 'Notebook', 'Coffee Mug', 'Pen'];
            const question = p.question || contentObj.question || 'Which item was located in the scene?';
            const options = p.options || contentObj.options || contentObj.choices || ['Silver Key', 'Golden Watch', 'Blue Folder', 'USB Flash'];

            return {
              id: p.id || idx + 1,
              title: p.title || contentObj.title || 'Memory Crime Scene',
              revealTime: p.revealTime || contentObj.revealTime || 6,
              items: items,
              question: question,
              options: options,
              correctAnswer: correctAns || (typeof options[0] === 'string' ? options[0] : 'Silver Key'),
              explanation: p.explanation || contentObj.explanation || 'Visual observation test.'
            };
          });
        }
      }
    } catch (e) {
      console.warn("Could not parse match challengeData, falling back to local set", e);
    }

    if (challengeScenes.length === 0) {
      challengeScenes = getDailyQuestionSet({
        gameType: 'memory-challenge',
        difficulty: 'MEDIUM',
        questionBank: memoryChallengeQuestions,
        count: 5,
        userShuffle: false
      });
    }

    setScenes(challengeScenes);
    const matchDiff = match.difficulty || 'MEDIUM';
    setDifficulty(matchDiff);
    setSceneIndex(0);
    setScore(0);
    setMistakes(0);
    setTotalXP(0);
    setSelected(null);
    setShowResult(false);
    setShowComplete(false);
    setPhase('reveal');
    setTimeLeft(challengeScenes[0]?.revealTime || 6);
    setCompetitiveResult(null);
  };

  const startGame = async (diff) => {
    setLoadingDifficulty(diff);
    try {
      const selectedList = await selectQuestionsForGame({
        gameSlug: 'memory-challenge',
        difficulty: diff,
        questionBank: memoryChallengeQuestions,
        count: 10,
        userShuffle: true
      });

      const activeList = Array.isArray(selectedList) && selectedList.length > 0
        ? selectedList
        : memoryChallengeQuestions.filter(q => q.difficulty && q.difficulty.toLowerCase() === diff.toLowerCase());

      setScenes(activeList);
      setDifficulty(diff);
      setSceneIndex(0);
      setScore(0);
      setMistakes(0);
      setTotalXP(0);
      setSelected(null);
      setShowResult(false);
      setShowComplete(false);
      setLatestUser(null);
      setPhase('reveal');
      setTimeLeft(activeList[0]?.revealTime || 8);
      setCompetitiveResult(null);
    } catch (e) {
      console.warn("Could not start memory challenge via service, using local pool", e);
      const activeList = memoryChallengeQuestions.filter(q => q.difficulty && q.difficulty.toLowerCase() === diff.toLowerCase());
      setScenes(activeList.slice(0, 10));
      setDifficulty(diff);
      setPhase('reveal');
      setTimeLeft(activeList[0]?.revealTime || 8);
    } finally {
      setLoadingDifficulty(null);
    }
  };

  useEffect(() => {
    if (difficulty && !showComplete && scene) {
      setPhase('reveal');
      setTimeLeft(scene.revealTime || 8);
      setSelected(null);
      setShowResult(false);
    }
  }, [sceneIndex, difficulty, showComplete]);

  useEffect(() => {
    if (phase === 'reveal' && timeLeft > 0) {
      intervalRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (phase === 'reveal' && timeLeft === 0) {
      setPhase('recall');
    }
    return () => clearTimeout(intervalRef.current);
  }, [phase, timeLeft]);

  const handleAnswer = async (choice) => {
    if (selected || showResult) return;
    setSelected(choice);
    const isCorrect = choice === scene.correctAnswer;
    setShowResult(true);

    if (!isCorrect) {
      setMistakes(m => m + 1);
    }

    if (playMode === 'PRACTICE') {
      const baseXP = XP_PER_DIFFICULTY[(scene.difficulty || difficulty || 'MEDIUM').toUpperCase()] || 20;
      const earned = isCorrect ? baseXP : 0;

      if (isCorrect) {
        setScore(s => s + 1);
        setTotalXP(t => t + earned);
        showXPPopup(earned);
      }

      try {
        const res = await api.post('/api/games/memory-challenge/attempts', {
          puzzleId: scene.id,
          userAnswer: choice,
          hintUsed: false,
          timeTakenSeconds: (scene.revealTime || 8) - timeLeft
        });

        if (res.data?.user) {
          setLatestUser(res.data.user);
        }
      } catch (e) {
        // Offline fallback
      }
    } else {
      if (isCorrect) {
        setScore(s => {
          scoreRef.current = s + 1;
          return s + 1;
        });
      } else {
        mistakesRef.current = mistakesRef.current + 1;
      }
    }
  };

  const handleNext = async () => {
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
          console.warn("Memory match submit error, using offline fallback", e);
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
    } else {
      setSceneIndex(i => i + 1);
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
        onSelectMode={handleSelectMode}
      />
    );
  }

  // === MATCHMAKING LOBBY ===
  if (showMatchmaking) {
    return (
      <MatchmakingLobby
        isOpen={showMatchmaking}
        gameSlug="memory-challenge"
        gameTitle="Memory Challenge"
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
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Your score: <strong style={{ color: '#4F46E5' }}>{scoreRef.current} / {scenes.length}</strong></p>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Waiting for your opponent to finish...</p>
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
        title="Memory Challenge"
        subtitle="Study the complex scene carefully before it disappears. Then answer from memory."
        icon="🧠"
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
    <div style={{ minHeight: '100vh', background: '#151515', paddingTop: '64px', color: '#F8FAFC' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '750px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
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
                <Eye size={20} color="#4ADE80" />
                <span className="font-accent" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4ADE80' }}>
                  {scene.title}
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: 500 }}>{scene.description}</p>
            </div>

            {/* Scene Matrix Display */}
            <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '1.25rem', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
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
                      background: '#1A1A1A',
                      border: '1px solid #333333',
                      borderRadius: '0.875rem',
                      gap: '0.5rem',
                      textAlign: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{item.emoji}</span>
                    <span style={{ fontSize: '0.8rem', color: '#F8FAFC', fontWeight: 700, lineHeight: 1.3 }}>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Countdown bar */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '6px', background: '#2E2E2E', borderRadius: '999px', overflow: 'hidden', maxWidth: '300px', margin: '0 auto' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: '999px', background: timeLeft <= 2 ? '#FB7185' : 'linear-gradient(90deg, #22C55E, #4ADE80)' }}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / (scene.revealTime || 8)) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
              <p style={{ marginTop: '0.75rem', color: '#94A3B8', fontSize: '0.825rem', fontWeight: 600 }}>Scene hidden in {timeLeft}s...</p>
            </div>
          </motion.div>
        )}

        {/* RECALL PHASE */}
        {phase === 'recall' && (
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <EyeOff size={18} color="#FB7185" />
                  <span className="font-accent" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FB7185' }}>
                    Scene Hidden — Answer from Memory
                  </span>
                </div>
              </div>

              <div style={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '1.25rem', padding: '2rem', marginBottom: '1.25rem', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '1.75rem', textAlign: 'center' }}>
                  {scene.question}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {choicesList.map(choice => {
                    let borderColor = '#2E2E2E';
                    let bg = '#1C1C1C';
                    let color = '#F8FAFC';

                    if (selected) {
                      if (choice === scene.correctAnswer) {
                        borderColor = 'rgba(34, 197, 94, 0.5)';
                        bg = 'rgba(34, 197, 94, 0.15)';
                        color = '#4ADE80';
                      } else if (selected === choice) {
                        borderColor = 'rgba(244, 63, 94, 0.5)';
                        bg = 'rgba(244, 63, 94, 0.15)';
                        color = '#FB7185';
                      }
                    }

                    return (
                      <motion.button
                        key={choice}
                        whileHover={!selected ? { scale: 1.01 } : {}}
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
                      background: selected === scene.correctAnswer ? 'rgba(34, 197, 94, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                      border: `1px solid ${selected === scene.correctAnswer ? 'rgba(34, 197, 94, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                      marginBottom: '1rem'
                    }}
                  >
                    {selected === scene.correctAnswer ? <CheckCircle size={22} color="#4ADE80" /> : <XCircle size={22} color="#FB7185" />}
                    <div>
                      <div style={{ fontWeight: 800, color: selected === scene.correctAnswer ? '#4ADE80' : '#FB7185', fontSize: '0.95rem' }}>
                        {selected === scene.correctAnswer ? '🎉 Perfect Recall!' : `Incorrect — The correct item was: ${scene.correctAnswer}`}
                      </div>
                    </div>
                  </div>

                  <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                    {sceneIndex + 1 >= scenes.length ? 'See Results 🏆' : 'Next Scene →'}
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
