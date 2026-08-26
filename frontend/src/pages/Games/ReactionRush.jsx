import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, AlertTriangle, Play, RefreshCw, Trophy, ArrowRight, Swords, Users, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import DifficultySelector from '../../components/DifficultySelector/DifficultySelector';
import GameResults from '../../components/GameResults/GameResults';
import PlayModeModal from '../../components/PlayModeModal/PlayModeModal';
import MatchmakingLobby from '../../components/MatchmakingLobby/MatchmakingLobby';
import CompetitiveResults from '../../components/CompetitiveResults/CompetitiveResults';
import SocialDrawer from '../../components/SocialDrawer/SocialDrawer';
import ExitModal from '../../components/ExitModal/ExitModal';
import api from '../../utils/api';

const TOTAL_ROUNDS = 5;

// Ratings based on reaction time (in ms)
const getRating = (ms) => {
  if (ms < 250) return { label: '⚡ Lightning Fast', color: '#059669', emoji: '⚡' };
  if (ms < 350) return { label: '🔥 Excellent', color: '#0284C7', emoji: '🔥' };
  if (ms < 450) return { label: '👍 Good', color: '#D97706', emoji: '👍' };
  return { label: '💪 Keep Practicing', color: '#4F46E5', emoji: '💪' };
};

// Delay configurations by difficulty
const DELAY_CONFIG = {
  EASY: { min: 2000, max: 4500, xpPerRound: 8 },
  MEDIUM: { min: 1500, max: 5000, xpPerRound: 15 },
  HARD: { min: 1000, max: 5500, xpPerRound: 25 },
};

export default function ReactionRush() {
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
  const [gameState, setGameState] = useState('idle'); // idle | waiting | ready | clicked | early | complete
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTimes, setRoundTimes] = useState([]);
  const [currentReactionTime, setCurrentReactionTime] = useState(null);
  const [totalXP, setTotalXP] = useState(0);

  const startTimeRef = useRef(0);
  const timerRef = useRef(null);

  const config = DELAY_CONFIG[difficulty] || DELAY_CONFIG.MEDIUM;

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
    setDifficulty(null);
  };

  const handleExitGame = async () => {
    setShowExitModal(false);
    if (currentMatch?.id) {
      try {
        await api.post(`/api/matches/${currentMatch.id}/abandon`);
      } catch (e) {}
    } else if (showMatchmaking) {
      try {
        await api.post('/api/matches/queue/cancel?gameSlug=reaction-rush');
      } catch (e) {}
    }
    navigate('/games');
  };

  const handleMatchReady = (match) => {
    setShowMatchmaking(false);
    setShowSocialDrawer(false);
    setCurrentMatch(match);

    const matchDiff = match.difficulty || 'MEDIUM';
    setDifficulty(matchDiff);
    setCurrentRound(1);
    setRoundTimes([]);
    setCurrentReactionTime(null);
    setTotalXP(0);
    setGameState('idle');
    setCompetitiveResult(null);
  };

  const startRound = useCallback(() => {
    setGameState('waiting');
    setCurrentReactionTime(null);

    const randomDelay = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState('ready');
    }, randomDelay);
  }, [config.min, config.max]);

  const startGame = (diff) => {
    setDifficulty(diff);
    setCurrentRound(1);
    setRoundTimes([]);
    setCurrentReactionTime(null);
    setTotalXP(0);
    setGameState('idle');
    setCompetitiveResult(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClickArea = () => {
    if (gameState === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setCurrentReactionTime(elapsed);
      const newTimes = [...roundTimes, elapsed];
      setRoundTimes(newTimes);
      setGameState('clicked');

      if (playMode === 'PRACTICE') {
        const baseXP = config.xpPerRound;
        const speedBonus = elapsed < 250 ? 10 : elapsed < 350 ? 5 : 0;
        const earned = baseXP + speedBonus;
        setTotalXP(x => x + earned);
        showXPPopup(earned);
      }
    }
  };

  const handleNextRound = async () => {
    if (currentRound >= TOTAL_ROUNDS) {
      const avg = Math.round(roundTimes.reduce((a, b) => a + b, 0) / roundTimes.length);

      if (playMode === 'PRACTICE') {
        setGameState('complete');
        try {
          const res = await api.post('/api/games/reaction-rush/attempts', {
            timeTakenSeconds: Math.round(avg / 1000),
            userAnswer: `${avg}ms`,
            hintUsed: false
          });
          if (res.data?.user) {
            refreshUser(res.data.user);
          }
        } catch (e) {}
      } else if (currentMatch) {
        try {
          const score = roundTimes.filter(t => t < 380).length * 20;
          if (currentMatch.player2Id === 999999) {
            const botAvg = avg + Math.floor(Math.random() * 80 - 40);
            const botScore = botAvg < 350 ? 80 : 60;
            const myDelta = avg < botAvg ? 24 : (avg === botAvg ? 0 : -18);
            const botDelta = avg < botAvg ? -16 : 16;
            const simResult = {
              ...currentMatch,
              player1Score: 1000 - avg,
              player2Score: 1000 - botAvg,
              player1RatingChange: myDelta,
              player2RatingChange: botDelta,
              winnerId: avg < botAvg ? currentMatch.player1Id : (avg > botAvg ? 999999 : null)
            };
            setCompetitiveResult(simResult);
          } else {
            const res = await api.post(`/api/matches/${currentMatch.id}/submit`, {
              score: Math.max(0, 1000 - avg),
              timeTakenSeconds: Math.round(avg / 100),
              mistakes: roundTimes.filter(t => t > 450).length,
              detailedAnswers: `Avg Reaction: ${avg}ms`
            });
            setCompetitiveResult(res.data);
          }
        } catch (e) {
          console.error("Reaction rush submit error", e);
        }
      }
    } else {
      setCurrentRound(r => r + 1);
      startRound();
    }
  };

  // === PLAY MODE SELECT MODAL ===
  if (showModeModal) {
    return (
      <PlayModeModal
        isOpen={showModeModal}
        gameTitle="Reaction Rush"
        gameIcon="⚡"
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
        gameSlug="reaction-rush"
        gameTitle="Reaction Rush"
        mode={playMode === 'FRIEND' ? 'FRIEND' : 'RANKED'}
        friendTarget={invitedFriend}
        difficulty={difficulty}
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

  if (!difficulty && !showModeModal) {
    return (
      <DifficultySelector
        title="Reaction Rush"
        subtitle="Test your visual reflexes! Wait for the signal, then click as fast as humanly possible when it turns GREEN."
        icon="⚡"
        onSelectDifficulty={(diff) => {
          setDifficulty(diff);
          if (playMode === 'PRACTICE') {
            startGame(diff);
          } else if (playMode === 'RANKED') {
            setInvitedFriend(null);
            setShowMatchmaking(true);
          } else if (playMode === 'FRIEND') {
            setShowSocialDrawer(true);
          }
        }}
        onBack={() => setShowModeModal(true)}
      />
    );
  }

  if (gameState === 'complete') {
    const avgTime = roundTimes.length > 0
      ? Math.round(roundTimes.reduce((a, b) => a + b, 0) / roundTimes.length)
      : 0;

    return (
      <GameResults
        score={roundTimes.filter(t => t < 400).length}
        total={TOTAL_ROUNDS}
        xpEarned={totalXP}
        onPlayAgain={() => startGame(difficulty)}
        gameTitle="Reaction Rush"
        customMessage={`Your average reaction time across ${TOTAL_ROUNDS} rounds was `}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header navigation & status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowExitModal(true)}
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', color: '#64748B', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          >
            ← Exit Game
          </button>

          {/* Exit Game Confirmation Modal */}
          <ExitModal
            isOpen={showExitModal}
            onCancel={() => setShowExitModal(false)}
            onConfirm={handleExitGame}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              Round <strong style={{ color: '#0F172A', fontWeight: 800 }}>{currentRound}</strong> / {TOTAL_ROUNDS}
            </span>
            <span style={{ padding: '0.2rem 0.65rem', borderRadius: '999px', background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4F46E5', fontSize: '0.75rem', fontWeight: 700 }}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Interactive Click Pad */}
        <div
          onClick={handleClickArea}
          style={{
            minHeight: '420px',
            borderRadius: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            cursor: gameState === 'waiting' || gameState === 'ready' ? 'pointer' : 'default',
            userSelect: 'none',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            background:
              gameState === 'waiting'
                ? '#FFF1F2'
                : gameState === 'ready'
                ? '#ECFDF5'
                : gameState === 'early'
                ? '#FFFBEB'
                : '#FFFFFF',
            border:
              gameState === 'waiting'
                ? '2px solid #E11D48'
                : gameState === 'ready'
                ? '3px solid #059669'
                : gameState === 'early'
                ? '2px solid #D97706'
                : '1px solid #E2E8F0',
            boxShadow:
              gameState === 'ready'
                ? '0 0 40px rgba(5,150,105,0.25)'
                : '0 4px 20px -2px rgba(0,0,0,0.05)'
          }}
        >
          {gameState === 'idle' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚡</div>
              <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                Get Ready
              </h2>
              <p style={{ color: '#64748B', maxWidth: '400px', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: 500 }}>
                Click start. When the screen turns <span style={{ color: '#059669', fontWeight: 800 }}>GREEN</span>, click as fast as you can!
              </p>
              <button onClick={startRound} className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem', borderRadius: '0.75rem' }}>
                <Play size={18} /> Start Round {currentRound}
              </button>
            </motion.div>
          )}

          {gameState === 'waiting' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#E11D48', margin: '0 auto 1.5rem', boxShadow: '0 0 25px rgba(225,29,72,0.5)', animation: 'pulse 1s infinite' }} />
              <h2 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#BE123C', letterSpacing: '0.04em' }}>
                WAIT FOR GREEN...
              </h2>
              <p style={{ color: '#E11D48', opacity: 0.9, fontSize: '0.925rem', marginTop: '0.5rem', fontWeight: 600 }}>
                Don't click yet!
              </p>
            </motion.div>
          )}

          {gameState === 'ready' && (
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#059669', margin: '0 auto 1.5rem', boxShadow: '0 0 40px rgba(5,150,105,0.6)' }} />
              <h1 className="font-display" style={{ fontSize: '3.5rem', fontWeight: 900, color: '#047857', letterSpacing: '-0.02em' }}>
                CLICK NOW!
              </h1>
            </motion.div>
          )}

          {gameState === 'early' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <AlertTriangle size={56} color="#D97706" style={{ margin: '0 auto 1rem' }} />
              <h2 className="font-display" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#B45309', marginBottom: '0.5rem' }}>
                Too Early!
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '1.5rem', fontWeight: 500 }}>
                You clicked before the signal turned green. Take a breath and try again.
              </p>
              <button onClick={startRound} className="btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', borderRadius: '0.625rem' }}>
                <RefreshCw size={16} /> Retry Round
              </button>
            </motion.div>
          )}

          {gameState === 'clicked' && currentReactionTime && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                {getRating(currentReactionTime).emoji}
              </div>
              <div className="font-display" style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                {currentReactionTime} <span style={{ fontSize: '1.5rem', color: '#64748B', fontWeight: 600 }}>ms</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: getRating(currentReactionTime).color, margin: '0.75rem 0 1.5rem' }}>
                {getRating(currentReactionTime).label}
              </div>
              <button onClick={handleNextRound} className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '0.625rem' }}>
                {currentRound < TOTAL_ROUNDS ? 'Next Round →' : 'See Results 🏆'}
              </button>
            </motion.div>
          )}
        </div>

        {/* Round History Tracker */}
        {roundTimes.length > 0 && (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {roundTimes.map((time, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '0.75rem',
                  padding: '0.5rem 0.85rem',
                  textAlign: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>R{idx + 1}</div>
                <div className="font-display" style={{ fontSize: '1rem', fontWeight: 800, color: getRating(time).color }}>
                  {time}ms
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
