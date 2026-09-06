import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lightbulb, CheckCircle, XCircle, Clock, Swords, Code2, BookOpen, Target, Sparkles, Loader2 } from 'lucide-react';
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
  const [loadingDifficulty, setLoadingDifficulty] = useState(null);
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

  const isSubmittingRef = useRef(false);
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
      } catch (err) {
        console.warn("Polling match status fallback failed:", err);
      }
    }, 2000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [waitingForOpponent, currentMatch, clearMatchStorage]);

  // Handle timeout on a question
  const handleTimeout = () => {
    if (isSubmittingRef.current || showResult || result) return;
    isSubmittingRef.current = true;
    pause();
    mistakesRef.current += 1;
    setMistakes(mistakesRef.current);
    setResult('wrong');
    setShowResult(true);
  };

  // Setup question timer
  const puzzle = puzzles[index];
  const { timeLeft, formatted, urgency, reset, start, pause } = useTimer(
    TIMER_SECONDS[difficulty?.toUpperCase()] || 60,
    () => handleTimeout()
  );

  // Initialize a practice session with questions
  const initGameSession = useCallback(async (selectedDiff) => {
    setLoadingDifficulty(selectedDiff);
    isSubmittingRef.current = false;
    try {
      const selected = await selectQuestionsForGame({
        gameSlug,
        difficulty: selectedDiff,
        questionBank,
        count: 10,
        userShuffle: true
      });

      let activeList = Array.isArray(selected) && selected.length > 0 ? selected : [];

      if (activeList.length === 0 && Array.isArray(questionBank) && questionBank.length > 0) {
        const matching = questionBank.filter(q => q.difficulty && q.difficulty.toLowerCase() === selectedDiff.toLowerCase());
        activeList = matching.length > 0 ? matching.slice(0, 10) : questionBank.slice(0, 10);
      }

      setPuzzles(activeList);
      setDifficulty(selectedDiff);
      setIndex(0);
      setSelectedOption('');
      setScore(0);
      setMistakes(0);
      setTotalXP(0);
      setShowResult(false);
      setResult(null);
      setHintUsed(false);
      setShowHint(false);
      setShowComplete(false);
      scoreRef.current = 0;
      mistakesRef.current = 0;
      startTimeRef.current = Date.now();
      reset(TIMER_SECONDS[selectedDiff?.toUpperCase()] || 60);
      start();
    } catch (err) {
      console.warn("Failed to load questions, using fallback set:", err);
      const fallback = questionBank.filter(q => q.difficulty && q.difficulty.toLowerCase() === selectedDiff.toLowerCase());
      const activeList = fallback.length > 0 ? fallback.slice(0, 10) : questionBank.slice(0, 10);
      setPuzzles(activeList);
      setDifficulty(selectedDiff);
      reset(TIMER_SECONDS[selectedDiff?.toUpperCase()] || 60);
      start();
    } finally {
      setLoadingDifficulty(null);
    }
  }, [gameSlug, questionBank, reset, start]);

  // Submit selected option (Protected against duplicate triggers)
  const handleSubmit = async () => {
    if (isSubmittingRef.current || showResult || result || !selectedOption || !puzzle) return;
    isSubmittingRef.current = true;
    pause();

    const isCorrect = selectedOption.trim().toLowerCase() === puzzle.correctAnswer.trim().toLowerCase();
    const currentDiff = (puzzle.difficulty || difficulty || 'MEDIUM').toUpperCase();
    const baseXP = XP_PER_DIFFICULTY[currentDiff] || 30;
    const earnedXP = isCorrect ? (hintUsed ? Math.round(baseXP * 0.7) : baseXP) : 0;
    const earnedCoins = isCorrect ? Math.max(1, Math.round(earnedXP / 2.5)) : 0;

    setResult(isCorrect ? 'correct' : 'wrong');
    setShowResult(true);

    if (isCorrect) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setTotalXP(prev => prev + earnedXP);
      showXPPopup(earnedXP);

      if (playMode === 'PRACTICE') {
        try {
          const res = await api.post(`/api/games/${gameSlug}/attempts`, {
            puzzleId: typeof puzzle.id === 'number' ? puzzle.id : null,
            userAnswer: selectedOption,
            hintUsed: hintUsed,
            timeTakenSeconds: (TIMER_SECONDS[currentDiff] || 60) - (timeLeft !== undefined ? timeLeft : 0)
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
    }
  };

  // Progress to next question or show completion screen
  const handleNext = async () => {
    isSubmittingRef.current = false;
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
            refreshUser();
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
      reset(TIMER_SECONDS[(puzzle?.difficulty || difficulty || 'MEDIUM').toUpperCase()] || 60);
      start();
    }
  };

  // Handle competitive match start from MatchmakingLobby
  const handleMatchReady = (matchData) => {
    isSubmittingRef.current = false;
    setCurrentMatch(matchData);
    setShowMatchmaking(false);
    setShowModeModal(false);

    let parsedQuestions = [];
    const rawChallenge = matchData.challengeData || matchData.puzzleSet;
    if (rawChallenge) {
      try {
        parsedQuestions = typeof rawChallenge === 'string' ? JSON.parse(rawChallenge) : rawChallenge;
      } catch (err) {
        console.warn("Could not parse match challengeData/puzzleSet JSON", err);
      }
    }

    if (!parsedQuestions || !Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      const matchDiff = (matchData.difficulty || 'MEDIUM').toUpperCase();
      const filtered = questionBank.filter(q => (q.difficulty || 'MEDIUM').toUpperCase() === matchDiff);
      const pool = filtered.length > 0 ? filtered : questionBank;
      parsedQuestions = pool.slice(0, 10);
    }

    setPuzzles(parsedQuestions);
    setDifficulty(matchData.difficulty || 'MEDIUM');
    setIndex(0);
    setScore(0);
    setMistakes(0);
    setTotalXP(0);
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
      return <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>{text}</div>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
        {parts.map((part, idx) => {
          if (idx % 2 === 1) {
            const lines = part.replace(/^cpp\n|^c\n|^python\n|^java\n/, '');
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(2, 6, 23, 0.95)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: '0.85rem',
                  padding: '1.1rem 1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: '#38bdf8',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)'
                }}
              >
                <pre style={{ margin: 0, fontFamily: 'inherit' }}>{lines.trim()}</pre>
              </div>
            );
          }
          return part.trim() ? (
            <div key={idx} style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
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
    );
  }

  // 2. Social Drawer (Play with Friend)
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

  // 2. Matchmaking Lobby Overlay
  if (showMatchmaking) {
    return (
      <MatchmakingLobby
        isOpen={showMatchmaking}
        onClose={() => {
          setShowMatchmaking(false);
          setShowModeModal(true);
          setPlayMode('PRACTICE');
        }}
        gameSlug={gameSlug}
        gameTitle={gameTitle}
        mode={playMode === 'FRIEND' ? 'FRIEND' : 'RANKED'}
        friendTarget={invitedFriend}
        difficulty={difficulty || 'MEDIUM'}
        onMatchReady={handleMatchReady}
        initialMatch={currentMatch}
      />
    );
  }

  // 3. Competitive 1v1 Final Results Screen
  if (competitiveResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', padding: '2rem 1.5rem', color: '#FFFFFF', position: 'relative' }}>
        <div className="star-field" />
        <div className="binary-texture" />
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

  // 4. Waiting for Opponent in Competitive 1v1
  if (waitingForOpponent) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="star-field" />
        <div className="binary-texture" />
        <div className="mesh-glow" style={{ top: '50%', opacity: 0.5 }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(8, 14, 33, 0.9)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '1.5rem',
          padding: '2.5rem 2rem',
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Loader2 size={32} className="animate-spin" color="#60a5fa" />
          </div>

          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            CALCULATING RESULTS
          </h2>

          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: 'var(--font-mono)',
            marginBottom: '1.5rem'
          }}>
            Your submission has been recorded. Waiting for your opponent to complete their challenge...
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0.75rem',
            padding: '0.85rem 1rem',
            display: 'flex',
            justifyContent: 'space-around',
            fontSize: '0.825rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Your Score: </span>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>{score}</span>
            </div>
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Mistakes: </span>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>{mistakes}</span>
            </div>
          </div>
        </div>
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
        loadingTier={loadingDifficulty}
        onSelectDifficulty={(diff) => initGameSession(diff)}
        onBack={() => setShowModeModal(true)}
      />
    );
  }

  // 6. Active MCQ Question Gameplay Screen
  return (
    <div style={{ minHeight: '100vh', background: '#020617', paddingTop: '6.5rem', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <XPPopup popups={xpPopups} />
      <div className="star-field" />
      <div className="binary-texture" />
      <div className="mesh-glow" style={{ top: '25%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />

      <ExitModal
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => navigate('/games')}
      />

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '1rem 1.5rem 4rem', position: 'relative', zIndex: 10 }}>
        {/* Progress & Header Bar */}
        <GameProgress
          current={index + 1}
          total={puzzles.length || 1}
          score={score}
          difficulty={difficulty}
          onExit={() => setShowExitModal(true)}
          formattedTime={formatted}
          urgency={urgency}
          scoreLabel="Correct"
        />

        {puzzles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(8, 14, 33, 0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1.75rem' }}>
            <Loader2 size={32} className="animate-spin" color="#3b82f6" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
              SYNCHRONIZING PROBLEM SET...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {puzzle && (
              <motion.div
                key={puzzle.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'rgba(8, 14, 33, 0.75)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1.75rem',
                  padding: '2rem 2.25rem',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                  marginBottom: '1.5rem',
                  position: 'relative'
                }}
              >
                {/* Formatted Question Body */}
                <div style={{ marginBottom: '2rem' }}>
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
                            gap: '1rem',
                            padding: '1.1rem 1.25rem',
                            borderRadius: '1rem',
                            background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(10, 18, 42, 0.65)',
                            border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none'
                          }}
                        >
                          <span
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
                              background: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.06)',
                              border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              fontFamily: 'var(--font-mono)',
                              flexShrink: 0
                            }}
                          >
                            {optionLetter}
                          </span>
                          <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 700 : 500, lineHeight: 1.4, color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)' }}>
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
                        padding: '1.1rem 1.35rem',
                        borderRadius: '1rem',
                        background: result === 'correct' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                        border: `1px solid ${result === 'correct' ? 'rgba(34, 197, 94, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
                        marginBottom: '1.25rem'
                      }}
                    >
                      {result === 'correct' ? <CheckCircle size={22} color="#22c55e" /> : <XCircle size={22} color="#f43f5e" />}
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: result === 'correct' ? '#22c55e' : '#f43f5e', fontSize: '0.95rem' }}>
                          {result === 'correct' ? 'CORRECT EVALUATION' : `INCORRECT — EXPECTED: ${puzzle.correctAnswer}`}
                        </div>
                      </div>
                    </div>

                    {puzzle.explanation && (
                      <div style={{ padding: '1.25rem', borderRadius: '1rem', background: 'rgba(10, 18, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          // DECRYPTED ANALYSIS
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, fontWeight: 400, margin: 0 }}>
                          {puzzle.explanation}
                        </p>
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
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        letterSpacing: '0.02em',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      {index + 1 >= puzzles.length ? 'VIEW FINAL CLASSIFICATION →' : 'NEXT CHALLENGE →'}
                    </button>
                  </motion.div>
                )}

                {/* Submit & Hint Actions */}
                {!showResult && (
                  <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {/* Hint Card */}
                    <AnimatePresence>
                      {showHint && puzzle.hint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{
                            background: 'rgba(59, 130, 246, 0.08)',
                            border: '1px solid rgba(59, 130, 246, 0.25)',
                            borderRadius: '1rem',
                            padding: '0.9rem 1.25rem',
                            display: 'flex',
                            gap: '0.65rem',
                            alignItems: 'flex-start'
                          }}
                        >
                          <Lightbulb size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '0.825rem', color: '#93c5fd', lineHeight: 1.5, fontWeight: 500 }}>
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
                          style={{
                            padding: '0.75rem 1.25rem',
                            borderRadius: '999px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <Lightbulb size={14} color="#FBBF24" /> HINT (-30% XP)
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={!selectedOption || showResult || !!result}
                        onClick={handleSubmit}
                        style={{
                          flex: 1,
                          padding: '0.85rem 1.25rem',
                          borderRadius: '999px',
                          background: selectedOption && !showResult && !result ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255, 255, 255, 0.08)',
                          color: selectedOption && !showResult && !result ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                          border: 'none',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          cursor: selectedOption && !showResult && !result ? 'pointer' : 'not-allowed',
                          boxShadow: selectedOption && !showResult && !result ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        CONFIRM CHOICE →
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
