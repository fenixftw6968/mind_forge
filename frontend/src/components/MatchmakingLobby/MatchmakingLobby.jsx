import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Loader2, X, CheckCircle, ShieldAlert, Sparkles, User, Trophy, Bot, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import { getRankFromRating } from '../../utils/rankUtils';
import { useMatchSocket } from '../../hooks/useMatchSocket';

export default function MatchmakingLobby({
  isOpen,
  onClose,
  gameSlug,
  gameTitle,
  mode = 'RANKED', // 'RANKED' or 'FRIEND'
  friendTarget = null,
  difficulty = null,
  onMatchReady,
  initialMatch = null,
}) {
  const [status, setStatus] = useState(() => {
    return mode === 'FRIEND' ? 'WAITING_FRIEND' : 'QUEUING';
  }); // 'QUEUING', 'WAITING_FRIEND', 'FOUND', 'COUNTDOWN', 'TIMEOUT_PROMPT', 'DECLINED', 'ERROR'
  const [matchData, setMatchData] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [queueTime, setQueueTime] = useState(0);
  const [error, setError] = useState(null);
  const matchStartedRef = useRef(false);

  const onMatchReadyRef = useRef(onMatchReady);
  onMatchReadyRef.current = onMatchReady;

  // Queue timer
  useEffect(() => {
    let interval;
    if (isOpen && (status === 'QUEUING' || status === 'WAITING_FRIEND')) {
      interval = setInterval(() => {
        setQueueTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, status]);

  // Trigger countdown and match start
  const handleMatchFound = useCallback((match) => {
    if (!match) return;
    if (matchStartedRef.current) return;
    matchStartedRef.current = true;

    setMatchData(match);
    setStatus('COUNTDOWN');
  }, []);

  // Dedicated countdown timer effect that ticks continuously until 0
  useEffect(() => {
    if (status !== 'COUNTDOWN' || !matchData) return;

    const serverTimeOffset = Date.now() - (matchData.serverTimeMillis || Date.now());
    const targetTime = matchData.startedAtMillis || (Date.now() + 4000);
    let timerInterval = null;

    const updateTimer = () => {
      const currentServerTime = Date.now() - serverTimeOffset;
      const remainingMs = targetTime - currentServerTime;
      const remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));

      setCountdown(remainingSecs);

      if (remainingMs <= 0) {
        if (timerInterval) clearInterval(timerInterval);
        if (onMatchReadyRef.current) {
          onMatchReadyRef.current(matchData);
        }
      }
    };

    updateTimer();
    timerInterval = setInterval(updateTimer, 100);

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [status, matchData]);

  // Listen to WebSockets for real-time instant notification
  useMatchSocket(matchData?.id, (event) => {
    if (event.type === 'MATCH_READY' || event.type === 'INVITATION_ACCEPTED') {
      handleMatchFound(event.data);
    } else if (event.type === 'MATCH_CANCELLED' || event.type === 'MATCH_ABANDONED' || event.type === 'INVITATION_DECLINED') {
      setStatus('DECLINED');
      setTimeout(onClose, 2000);
    }
  });

  // Initial Queue / Match creation & Polling loop
  useEffect(() => {
    if (!isOpen) {
      setStatus(mode === 'FRIEND' ? 'WAITING_FRIEND' : 'QUEUING');
      setMatchData(null);
      setCountdown(3);
      setQueueTime(0);
      setError(null);
      matchStartedRef.current = false;
      return;
    }

    let pollInterval = null;
    let isCancelled = false;

    const startQueue = async () => {
      try {
        if (initialMatch) {
          setMatchData(initialMatch);
          if (initialMatch.status === 'READY' || initialMatch.player2Ready) {
            handleMatchFound(initialMatch);
          } else {
            setStatus(mode === 'FRIEND' ? 'WAITING_FRIEND' : 'QUEUING');
          }
          return;
        }

        if (mode === 'RANKED') {
          setStatus('QUEUING');
          const diffQuery = difficulty ? `&difficulty=${difficulty}` : '';
          const res = await api.post(`/api/matches/queue?gameSlug=${gameSlug}${diffQuery}`);
          if (isCancelled) return;

          const match = res.data;
          setMatchData(match);

          if (match.status === 'READY' || (match.player1Id && match.player2Id)) {
            handleMatchFound(match);
          } else {
            let elapsedPolls = 0;
            pollInterval = setInterval(async () => {
              elapsedPolls++;
              try {
                if (matchStartedRef.current) {
                  clearInterval(pollInterval);
                  return;
                }
                const pollRes = await api.get(`/api/matches/${match.id}`);
                const currentMatch = pollRes.data;
                setMatchData(currentMatch);

                if (currentMatch.status === 'READY' || (currentMatch.player1Id && currentMatch.player2Id)) {
                  clearInterval(pollInterval);
                  handleMatchFound(currentMatch);
                } else if (elapsedPolls >= 40) {
                  clearInterval(pollInterval);
                  await connectRankedBot(match.id);
                }
              } catch (e) {
                console.warn("Match status poll error", e);
              }
            }, 1500);
          }
        } else if (mode === 'FRIEND') {
          if (!friendTarget && !initialMatch) {
            return;
          }
          if (!friendTarget) {
            return;
          }
          setStatus('WAITING_FRIEND');
          const res = await api.post('/api/matches/invite', {
            friendId: friendTarget.userId || friendTarget.id,
            gameSlug: gameSlug,
            difficulty: difficulty
          });
          if (isCancelled) return;

          const match = res.data;
          setMatchData(match);

          let elapsedPolls = 0;
          pollInterval = setInterval(async () => {
            elapsedPolls++;
            try {
              if (matchStartedRef.current) {
                clearInterval(pollInterval);
                return;
              }
              const pollRes = await api.get(`/api/matches/${match.id}`);
              const currentMatch = pollRes.data;
              setMatchData(currentMatch);

              if (currentMatch.status === 'READY' || currentMatch.player2Ready) {
                clearInterval(pollInterval);
                handleMatchFound(currentMatch);
              } else if (currentMatch.status === 'CANCELLED') {
                clearInterval(pollInterval);
                if (currentMatch.cancelledReason === 'DECLINED') {
                  setStatus('DECLINED');
                } else {
                  setError("Friend invitation was cancelled.");
                  setStatus('ERROR');
                }
              } else if (elapsedPolls >= 40) {
                clearInterval(pollInterval);
                setError("Friend did not respond in time.");
                setStatus('ERROR');
              }
            } catch (e) {
              console.warn("Friend match poll error", e);
            }
          }, 1500);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Queue error:", err);
          setError(err.response?.data?.message || err.message || 'Failed to start matchmaking');
          setStatus('ERROR');
        }
      }
    };

    startQueue();

    return () => {
      isCancelled = true;
      if (pollInterval) clearInterval(pollInterval);
      if (mode === 'RANKED') {
        api.post(`/api/matches/queue/cancel?gameSlug=${gameSlug}`).catch(() => {});
      }
    };
  }, [isOpen, gameSlug, mode, friendTarget, difficulty, initialMatch]);

  const connectRankedBot = async (matchId) => {
    if (matchStartedRef.current) return;
    try {
      const targetId = matchId || matchData?.id;
      if (targetId) {
        const res = await api.post(`/api/matches/${targetId}/connect-bot`);
        if (res.data) {
          setMatchData(res.data);
          handleMatchFound(res.data);
          return;
        }
      }
    } catch (e) {
      console.warn("API connect-bot error, using fallback bot match", e);
    }

    const botOpponent = {
      ...(matchData || {}),
      player2Id: 999999,
      player2Username: 'CortexAI_Bot',
      player2Rating: Math.max(100, (matchData?.player1Rating || 500) + Math.floor(Math.random() * 30 - 15)),
      player2Rank: 'Knight',
      isBotMatch: true,
      status: 'READY'
    };
    setMatchData(botOpponent);
    handleMatchFound(botOpponent);
  };

  const handleCancelInvitation = async () => {
    if (matchData?.id) {
      try {
        await api.post(`/api/matches/${matchData.id}/cancel`);
      } catch (e) {}
    }
    onClose();
  };

  const handleSimulatedMatch = () => {
    connectRankedBot(matchData?.id);
  };

  const handleContinueWaiting = () => {
    setStatus('QUEUING');
    setQueueTime(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          style={{
            background: 'rgba(8, 14, 33, 0.95)',
            borderRadius: '1.75rem',
            width: '100%',
            maxWidth: '520px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.15)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            position: 'relative',
            color: '#FFFFFF',
            overflow: 'hidden'
          }}
        >
          {/* Close / Cancel Button */}
          {(status === 'QUEUING' || status === 'WAITING_FRIEND' || status === 'TIMEOUT_PROMPT') && (
            <button
              onClick={status === 'WAITING_FRIEND' ? handleCancelInvitation : onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.6)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
            >
              <X size={16} />
            </button>
          )}

          {/* QUEUING STATE */}
          {status === 'QUEUING' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 1.5rem' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px dashed #3b82f6',
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '50%',
                    border: '1px solid rgba(59, 130, 246, 0.35)',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: '8px',
                  borderRadius: '50%',
                  background: '#060b1e',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Swords size={32} color="#3b82f6" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                SCANNING LOBBY...
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Locating active neural challengers in {gameTitle} matching your classification tier.
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                padding: '0.45rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '0.75rem'
              }}>
                <Loader2 size={14} className="animate-spin" color="#3b82f6" />
                QUEUE DURATION: {Math.floor(queueTime / 60)}:{(queueTime % 60).toString().padStart(2, '0')}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                <Sparkles size={12} color="#FBBF24" /> Auto-assigning Cortex AI Challenger after 60s
              </div>

              <div>
                <button
                  onClick={onClose}
                  style={{
                    padding: '0.55rem 1.4rem',
                    borderRadius: '999px',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    background: 'rgba(59, 130, 246, 0.08)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ABORT QUEUE
                </button>
              </div>
            </motion.div>
          )}

          {/* WAITING FOR FRIEND ACCEPTANCE STATE */}
          {status === 'WAITING_FRIEND' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 1.5rem' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px dashed #22c55e',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: '8px',
                  borderRadius: '50%',
                  background: '#060b1e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={32} color="#22c55e" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
                INVITATION DISPATCHED
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Awaiting connection from <strong style={{ color: '#ffffff' }}>{friendTarget?.username || 'Challenger'}</strong>...
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.45rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1.75rem'
              }}>
                <Loader2 size={14} className="animate-spin" color="#22c55e" />
                ELAPSED: {Math.floor(queueTime / 60)}:{(queueTime % 60).toString().padStart(2, '0')}
              </div>

              <div>
                <button
                  onClick={handleCancelInvitation}
                  style={{
                    padding: '0.55rem 1.4rem',
                    borderRadius: '999px',
                    color: '#f43f5e',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    background: 'rgba(244, 63, 94, 0.08)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  CANCEL CHALLENGE
                </button>
              </div>
            </motion.div>
          )}

          {/* TIMEOUT PROMPT */}
          {status === 'TIMEOUT_PROMPT' && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: '#60a5fa'
              }}>
                <Bot size={36} />
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
                QUEUE TIMEOUT REACHED
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                No active human challenger found. Engage AI Neural Core or extend lobby search?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={handleSimulatedMatch}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '999px',
                    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Bot size={16} /> ENGAGE CORTEX AI (RANKED)
                </button>

                <button
                  onClick={handleContinueWaiting}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <RefreshCw size={14} /> EXTEND SEARCH
                </button>

                <button
                  onClick={onClose}
                  style={{
                    padding: '0.5rem',
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          )}

          {/* DECLINED STATE */}
          {status === 'DECLINED' && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: '#f43f5e'
              }}>
                <X size={32} />
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
                INVITATION DECLINED
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {friendTarget?.username || 'Opponent'} declined the match request.
              </p>

              <button
                onClick={onClose}
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                RETURN
              </button>
            </motion.div>
          )}

          {/* OPPONENT FOUND & COUNTDOWN STATE */}
          {(status === 'COUNTDOWN' || status === 'FOUND') && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                color: '#22c55e'
              }}>
                <CheckCircle size={30} />
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
                MATCH PROTOCOL INITIALIZED
              </h2>

              {/* Player vs Player card */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                background: 'rgba(10, 18, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1.25rem',
                padding: '1.1rem 1.35rem',
                margin: '1.25rem 0'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>PLAYER 1</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {matchData?.player1Username || 'You'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {matchData?.player1Rating || 500} Elo
                  </div>
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)', padding: '0 0.5rem' }}>
                  VS
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                    {matchData?.isBotMatch ? 'AI CORE' : 'CHALLENGER'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {matchData?.player2Username || 'Challenger'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: matchData?.isBotMatch ? '#38bdf8' : '#60a5fa', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {matchData?.isBotMatch ? `⚡ ${matchData?.player2Rating || 500} Elo` : `${matchData?.player2Rating || 500} Elo`}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                SYNCHRONIZING IN
              </div>

              <motion.div
                key={countdown}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  fontSize: '3.75rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: countdown <= 1 ? '#22c55e' : '#ffffff',
                  lineHeight: 1,
                  margin: '0.4rem 0 0.85rem'
                }}
              >
                {countdown > 0 ? countdown : 'GO'}
              </motion.div>

              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>
                Initializing competitive neural stream...
              </p>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {status === 'ERROR' && (
            <div>
              <ShieldAlert size={42} color="#f43f5e" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>MATCHMAKING ERROR</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{error}</p>
              <button
                onClick={onClose}
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                DISMISS
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
