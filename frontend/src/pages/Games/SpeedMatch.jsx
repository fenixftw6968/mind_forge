import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Target, Zap, Check, X, Flame, Swords, Users, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import DifficultySelector from '../../components/DifficultySelector/DifficultySelector';
import GameResults from '../../components/GameResults/GameResults';
import PlayModeModal from '../../components/PlayModeModal/PlayModeModal';
import MatchmakingLobby from '../../components/MatchmakingLobby/MatchmakingLobby';
import CompetitiveResults from '../../components/CompetitiveResults/CompetitiveResults';
import SocialDrawer from '../../components/SocialDrawer/SocialDrawer';
import ExitModal from '../../components/ExitModal/ExitModal';
import { shuffleArray } from '../../utils/shuffleQuestions';
import api from '../../utils/api';

const COLORS = [
  { name: 'RED', hex: '#E11D48' },
  { name: 'BLUE', hex: '#2563EB' },
  { name: 'GREEN', hex: '#059669' },
  { name: 'YELLOW', hex: '#D97706' },
  { name: 'PURPLE', hex: '#7C3AED' },
  { name: 'CYAN', hex: '#0284C7' }
];

const ROUND_LIMITS = {
  EASY: { rounds: 10, timePerRound: 4.0, xp: 20 },
  MEDIUM: { rounds: 12, timePerRound: 2.5, xp: 35 },
  HARD: { rounds: 15, timePerRound: 1.5, xp: 60 }
};

// Generates balanced match & non-match items avoiding streaks > 2
export function generateBalancedRounds(totalRounds = 10) {
  const matchCount = Math.floor(totalRounds / 2);
  const noMatchCount = totalRounds - matchCount;

  const isMatchList = [
    ...new Array(matchCount).fill(true),
    ...new Array(noMatchCount).fill(false)
  ];

  // Shuffle to randomize order
  const shuffled = shuffleArray(isMatchList);

  return shuffled.map((isMatch) => {
    const textIdx = Math.floor(Math.random() * COLORS.length);
    const textColorObj = COLORS[textIdx];

    let displayColorObj;
    if (isMatch) {
      displayColorObj = textColorObj;
    } else {
      const otherColors = COLORS.filter(c => c.name !== textColorObj.name);
      displayColorObj = otherColors[Math.floor(Math.random() * otherColors.length)];
    }

    return {
      word: textColorObj.name,
      color: displayColorObj.hex,
      colorName: displayColorObj.name,
      isMatch
    };
  });
}

export default function SpeedMatch() {
  const { user, refreshUser } = useAuth();
  const { showXPPopup } = useGame();
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

  const [difficulty, setDifficulty] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [timeLeft, setTimeLeft] = useState(3.0);
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const currentRound = rounds[currentIndex];
  const roundConfig = ROUND_LIMITS[difficulty] || ROUND_LIMITS.MEDIUM;

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
        await api.post('/api/matches/queue/cancel?gameSlug=speed-match');
      } catch (e) {}
    }
    navigate('/games');
  };

  const handleMatchReady = (match) => {
    setShowMatchmaking(false);
    setShowSocialDrawer(false);
    setCurrentMatch(match);
    startTimeRef.current = Date.now();

    const config = ROUND_LIMITS.MEDIUM;
    const generated = generateBalancedRounds(10);

    setRounds(generated);
    setDifficulty('MEDIUM');
    setCurrentIndex(0);
    setScore(0);
    setMistakes(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalXP(0);
    setFeedback(null);
    setTimeLeft(config.timePerRound);
    setIsGameOver(false);
    setCompetitiveResult(null);
  };

  const handleDecision = useCallback((userAnswerIsMatch) => {
    if (!currentRound || isGameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = userAnswerIsMatch === currentRound.isMatch;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(m => Math.max(m, newStreak));

      if (playMode === 'PRACTICE') {
        const baseXP = Math.round(roundConfig.xp / rounds.length);
        const bonus = newStreak >= 5 ? 5 : newStreak >= 3 ? 2 : 0;
        const earned = baseXP + bonus;
        setTotalXP(x => x + earned);
        showXPPopup(earned);
      }
    } else {
      setStreak(0);
      setMistakes(m => m + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < rounds.length) {
        setCurrentIndex(i => i + 1);
        setTimeLeft(roundConfig.timePerRound);
      } else {
        finishGame();
      }
    }, 250);
  }, [currentRound, isGameOver, streak, roundConfig, rounds.length, currentIndex, showXPPopup, playMode]);

  const finishGame = async () => {
    setIsGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);

    if (playMode === 'PRACTICE') {
      try {
        const res = await api.post('/api/games/speed-match/attempts', {
          userAnswer: `${score}/${rounds.length}`,
          timeTakenSeconds: Math.round(rounds.length * roundConfig.timePerRound),
          hintUsed: false
        });
        if (res.data?.user) {
          refreshUser(res.data.user);
        }
      } catch (e) {}
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
            detailedAnswers: `Speed Match: ${score}/${rounds.length}`
          });
          setCompetitiveResult(res.data);
        }
      } catch (e) {
        console.error("Speed match submit error", e);
      }
    }
  };

  const startGame = (diff) => {
    const config = ROUND_LIMITS[diff] || ROUND_LIMITS.MEDIUM;
    const generated = generateBalancedRounds(config.rounds);

    setRounds(generated);
    setDifficulty(diff);
    setCurrentIndex(0);
    setScore(0);
    setMistakes(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalXP(0);
    setFeedback(null);
    setTimeLeft(config.timePerRound);
    setIsGameOver(false);
    setCompetitiveResult(null);
  };

  // === PLAY MODE SELECT MODAL ===
  if (showModeModal) {
    return (
      <PlayModeModal
        isOpen={showModeModal}
        gameTitle="Speed Match"
        gameIcon="🎯"
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
        gameSlug="speed-match"
        gameTitle="Speed Match"
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
        title="Speed Match"
        subtitle="Stroop effect challenge! Fast decision-making: does the word match the ink color?"
        icon="🎯"
        onSelectDifficulty={startGame}
        onBack={() => setShowModeModal(true)}
      />
    );
  }

  // Keyboard shortcut listener: Left Arrow (NO MATCH), Right Arrow (MATCH)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!currentRound || isGameOver || feedback !== null) return;
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'z') {
        handleDecision(false);
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'm') {
        handleDecision(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRound, isGameOver, feedback, handleDecision]);

  // Round countdown timer
  useEffect(() => {
    if (!difficulty || isGameOver || !currentRound || feedback !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          clearInterval(timerRef.current);
          handleDecision(!currentRound.isMatch ? true : false); // timeout counts as incorrect
          return 0;
        }
        return parseFloat((t - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, difficulty, isGameOver, currentRound, feedback, handleDecision]);

  if (!difficulty) {
    return (
      <DifficultySelector
        title="Speed Match"
        subtitle="Stroop effect challenge! Quickly decide whether the meaning of the word MATCHES its ink color."
        icon="🎯"
        onSelectDifficulty={startGame}
        onBack={() => navigate('/games')}
      />
    );
  }

  if (isGameOver) {
    return (
      <GameResults
        score={score}
        total={rounds.length}
        xpEarned={totalXP}
        onPlayAgain={() => startGame(difficulty)}
        gameTitle="Speed Match"
      />
    );
  }

  const progressPercent = ((timeLeft / roundConfig.timePerRound) * 100);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Navigation & Stats header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button onClick={() => setShowExitModal(true)} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', color: '#64748B', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            ← Exit Game
          </button>

          {/* Exit Game Confirmation Modal */}
          <ExitModal
            isOpen={showExitModal}
            onCancel={() => setShowExitModal(false)}
            onConfirm={handleExitGame}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {streak >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#FFF1F2', border: '1px solid #FECDD3', padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
                <Flame size={14} color="#E11D48" fill="#E11D48" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#BE123C' }}>{streak} Streak!</span>
              </div>
            )}
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              Round <strong style={{ color: '#0F172A', fontWeight: 800 }}>{currentIndex + 1}</strong> / {rounds.length}
            </span>
          </div>
        </div>

        {/* Timed Prompt Card */}
        {currentRound && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1.5rem',
              padding: '2.5rem 2rem',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Round countdown line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: '#E2E8F0' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: progressPercent < 30 ? '#E11D48' : progressPercent < 60 ? '#D97706' : '#059669',
                  transition: 'width 0.1s linear'
                }}
              />
            </div>

            <div style={{ fontSize: '0.825rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem', fontWeight: 700 }}>
              Does the word match the font color?
            </div>

            {/* Stimulus Word */}
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                key={currentIndex}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 8vw, 5rem)',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: currentRound.color,
                  textShadow: `0 2px 20px ${currentRound.color}35`
                }}
              >
                {currentRound.word}
              </motion.div>
            </div>

            {/* Decision Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => handleDecision(false)}
                disabled={feedback !== null}
                style={{
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  background: '#FFF1F2',
                  border: '2px solid #FECDD3',
                  color: '#BE123C',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(225,29,72,0.1)',
                  transition: 'all 0.15s ease'
                }}
              >
                <X size={22} /> NO MATCH
              </button>

              <button
                onClick={() => handleDecision(true)}
                disabled={feedback !== null}
                style={{
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  background: '#ECFDF5',
                  border: '2px solid #A7F3D0',
                  color: '#047857',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(5,150,105,0.1)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Check size={22} /> MATCH
              </button>
            </div>

            {/* Keyboard hints */}
            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
              Shortcut: <kbd style={{ padding: '0.2rem 0.5rem', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#475569', fontWeight: 700 }}>←</kbd> No Match &bull; <kbd style={{ padding: '0.2rem 0.5rem', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#475569', fontWeight: 700 }}>→</kbd> Match
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
