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
import { memoryChallengeQuestions } from '../../data/memoryChallengeQuestions';
import api from '../../utils/api';

const XP_PER_DIFFICULTY = { EASY: 15, MEDIUM: 25, HARD: 50 };

export default function MemoryChallenge() {
  const { user, refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode state
  const [showModeModal, setShowModeModal] = useState(true);
  const [playMode, setPlayMode] = useState('PRACTICE'); // 'PRACTICE' | 'RANKED' | 'FRIEND'
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [showSocialDrawer, setShowSocialDrawer] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [invitedFriend, setInvitedFriend] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [competitiveResult, setCompetitiveResult] = useState(null);

  const [difficulty, setDifficulty]     = useState(null); // null = selecting
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

  const intervalRef = useRef(null);
  const scene = scenes[sceneIndex];

  // Auto-start match if accepted from invite
  useEffect(() => {
    if (location.state?.acceptedMatch) {
      handleMatchReady(location.state.acceptedMatch);
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
    setDifficulty('MEDIUM');
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

  const startGame = (diff) => {
    const selectedList = getDailyQuestionSet({
      gameType: 'memory-challenge',
      difficulty: diff,
      questionBank: memoryChallengeQuestions,
      count: 10,
      userShuffle: true
    });

    setScenes(selectedList);
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
    setTimeLeft(selectedList[0]?.revealTime || 8);
    setCompetitiveResult(null);
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
        setScore(s => s + 1);
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
            const res = await api.post(`/api/matches/${currentMatch.id}/submit`, {
              score: score,
              timeTakenSeconds: totalDuration,
              mistakes: mistakes,
              detailedAnswers: 'Memory Challenge Set Completed'
            });
            setCompetitiveResult(res.data);
          }
        } catch (e) {
          console.error("Memory match submit error", e);
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

  if (!difficulty && playMode === 'PRACTICE') {
    return (
      <DifficultySelector
        title="Memory Challenge"
        subtitle="Study the complex scene carefully before it disappears. Then answer from memory."
        icon="👁️"
        onSelectDifficulty={(diff) => startGame(diff)}
        onBack={() => setShowModeModal(true)}
        customTiers={[
          { id: 'EASY', label: 'Easy', icon: '🌱', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', xp: '+15 XP', time: '8s Study', desc: '6 everyday objects with clear colors and positions' },
          { id: 'MEDIUM', label: 'Medium', icon: '🧠', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', xp: '+25 XP', time: '6s Study', desc: '6 detailed technical items with sub-descriptors' },
          { id: 'HARD', label: 'Hard', icon: '🔥', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', xp: '+50 XP', time: '5s Study', desc: '9 complex forensic/cyber metrics with numbers and parameters' }
        ]}
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
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
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
                <Eye size={20} color="#4F46E5" />
                <span className="font-accent" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4F46E5' }}>
                  {scene.title}
                </span>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 500 }}>{scene.description}</p>
            </div>

            {/* Scene Matrix Display */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
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
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.875rem',
                      gap: '0.5rem',
                      textAlign: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{item.emoji}</span>
                    <span style={{ fontSize: '0.8rem', color: '#1E293B', fontWeight: 700, lineHeight: 1.3 }}>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Countdown bar */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', maxWidth: '300px', margin: '0 auto' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: '999px', background: timeLeft <= 2 ? '#E11D48' : 'linear-gradient(90deg, #6366F1, #4F46E5)' }}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / (scene.revealTime || 8)) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
              <p style={{ marginTop: '0.75rem', color: '#64748B', fontSize: '0.825rem', fontWeight: 600 }}>Scene hidden in {timeLeft}s...</p>
            </div>
          </motion.div>
        )}

        {/* RECALL PHASE */}
        {phase === 'recall' && (
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <EyeOff size={18} color="#E11D48" />
                  <span className="font-accent" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#E11D48' }}>
                    Scene Hidden — Answer from Memory
                  </span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '2rem', marginBottom: '1.25rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.75rem', textAlign: 'center' }}>
                  {scene.question}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {choicesList.map(choice => {
                    let borderColor = '#E2E8F0';
                    let bg = '#FFFFFF';
                    let color = '#1E293B';

                    if (selected) {
                      if (choice === scene.correctAnswer) {
                        borderColor = '#A7F3D0';
                        bg = '#ECFDF5';
                        color = '#047857';
                      } else if (selected === choice) {
                        borderColor = '#FECDD3';
                        bg = '#FFF1F2';
                        color = '#BE123C';
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
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {selected && choice === scene.correctAnswer && <CheckCircle size={17} color="#059669" />}
                        {selected === choice && choice !== scene.correctAnswer && <XCircle size={17} color="#E11D48" />}
                        {choice}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation & Next */}
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ padding: '1rem 1.25rem', borderRadius: '0.875rem', background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0284C7', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Memory Recall Verified</p>
                    <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>{scene.explanation}</p>
                  </div>
                  <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                    {sceneIndex + 1 >= scenes.length ? 'See Results 🏆' : 'Next Memory Challenge →'}
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
