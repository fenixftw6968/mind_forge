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
            // Poll for opponent every 1.5s (up to 60 seconds / 40 polls)
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
                } else if (elapsedPolls >= 40) { // 60 seconds queue timeout
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

          // Poll for friend acceptance
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
              } else if (elapsedPolls >= 40) { // ~60 seconds timeout
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
      player2Ready: true,
      isBotMatch: true,
      mode: 'RANKED',
      status: 'READY'
    };
    setMatchData(botOpponent);
    handleMatchFound(botOpponent);
  };

  const handleSimulatedMatch = async () => {
    await connectRankedBot(matchData?.id);
  };

  const handleContinueWaiting = () => {
    setStatus('QUEUING');
    setQueueTime(0);
    let elapsedPolls = 0;
    const pollInterval = setInterval(async () => {
      elapsedPolls++;
      try {
        if (!matchData?.id || matchStartedRef.current) {
          clearInterval(pollInterval);
          return;
        }
        const pollRes = await api.get(`/api/matches/${matchData.id}`);
        const currentMatch = pollRes.data;
        setMatchData(currentMatch);

        if (currentMatch.status === 'READY' || (currentMatch.player1Id && currentMatch.player2Id)) {
          clearInterval(pollInterval);
          handleMatchFound(currentMatch);
        } else if (elapsedPolls >= 40) {
          clearInterval(pollInterval);
          await connectRankedBot(matchData.id);
        }
      } catch (e) {
        console.warn("Match status poll error", e);
      }
    }, 1500);
  };

  const handleCancelInvitation = async () => {
    if (matchData?.id) {
      try {
        await api.post(`/api/matches/${matchData.id}/cancel`);
      } catch (e) {}
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            background: '#242424',
            borderRadius: '1.75rem',
            width: '100%',
            maxWidth: '520px',
            border: '1px solid #2E2E2E',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            position: 'relative',
            color: '#F8FAFC'
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
                background: '#1C1C1C',
                border: '1px solid #2E2E2E',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94A3B8'
              }}
            >
              <X size={18} />
            </button>
          )}

          {/* QUEUING STATE */}
          {status === 'QUEUING' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 1.5rem' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '3px dashed #22C55E',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: '8px',
                  borderRadius: '50%',
                  background: '#1C1C1C',
                  border: '1px solid #2E2E2E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Swords size={32} color="#22C55E" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
                Finding Ranked Opponent...
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Searching for available players near your Elo rating in {gameTitle}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#1C1C1C',
                border: '1px solid #2E2E2E',
                padding: '0.45rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '0.65rem'
              }}>
                <Loader2 size={16} className="animate-spin" color="#22C55E" />
                Queue Time: {Math.floor(queueTime / 60)}:{(queueTime % 60).toString().padStart(2, '0')}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <Sparkles size={13} color="#FBBF24" /> Auto-matching with Ranked AI bot after 60s
              </div>

              <div>
                <button
                  onClick={onClose}
                  className="btn-secondary"
                  style={{
                    padding: '0.65rem 1.5rem',
                    color: '#FB7185',
                    borderColor: 'rgba(244, 63, 94, 0.3)',
                    background: 'rgba(244, 63, 94, 0.1)'
                  }}
                >
                  Cancel Matchmaking
                </button>
              </div>
            </motion.div>
          )}

          {/* WAITING FOR FRIEND ACCEPTANCE STATE */}
          {status === 'WAITING_FRIEND' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 1.5rem' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '3px dashed #22C55E',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: '8px',
                  borderRadius: '50%',
                  background: '#1C1C1C',
                  border: '1px solid #2E2E2E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={32} color="#4ADE80" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
                Invitation Sent!
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Waiting for <strong style={{ color: '#F8FAFC' }}>{friendTarget?.username || 'your friend'}</strong> to accept the challenge...
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#1C1C1C',
                border: '1px solid #2E2E2E',
                padding: '0.45rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '1.5rem'
              }}>
                <Loader2 size={16} className="animate-spin" color="#22C55E" />
                Waiting: {Math.floor(queueTime / 60)}:{(queueTime % 60).toString().padStart(2, '0')}
              </div>

              <div>
                <button
                  onClick={handleCancelInvitation}
                  className="btn-secondary"
                  style={{
                    padding: '0.65rem 1.5rem',
                    color: '#FB7185',
                    borderColor: 'rgba(244, 63, 94, 0.3)',
                    background: 'rgba(244, 63, 94, 0.1)'
                  }}
                >
                  Cancel Invitation
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
                background: 'rgba(245, 158, 11, 0.12)',
                border: '2px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: '#FBBF24'
              }}>
                <Bot size={36} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
                No Ranked Opponent Found Yet
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Queue search timed out. Would you like to continue searching for a live player, or challenge an AI Bot?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={handleSimulatedMatch}
                  className="btn-primary"
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <Bot size={18} /> Play vs AI Bot (Ranked Match)
                </button>

                <button
                  onClick={handleContinueWaiting}
                  className="btn-secondary"
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <RefreshCw size={16} /> Keep Searching for Players
                </button>

                <button
                  onClick={onClose}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0.75rem',
                    background: 'transparent',
                    color: '#64748B',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancel Matchmaking
                </button>
              </div>
            </motion.div>
          )}

          {/* DECLINED STATE */}
          {status === 'DECLINED' && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '2px solid rgba(244, 63, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: '#FB7185'
              }}>
                <X size={36} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
                Invitation Declined
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {friendTarget?.username || 'Your friend'} declined the match invitation.
              </p>

              <button
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '0.65rem 1.5rem' }}
              >
                Close
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
                border: '2px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                color: '#4ADE80'
              }}>
                <CheckCircle size={32} />
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
                Match Ready!
              </h2>

              {/* Player vs Player card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#1C1C1C',
                border: '1px solid #2E2E2E',
                borderRadius: '1.25rem',
                padding: '1rem 1.25rem',
                margin: '0.85rem 0'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>You</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>
                    {matchData?.player1Username || 'You'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600 }}>
                    {matchData?.player1Rating || 500} pts
                  </div>
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#22C55E' }}>
                  VS
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    {matchData?.isBotMatch ? 'AI Challenger' : 'Opponent'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>
                    {matchData?.player2Username || 'Challenger'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: matchData?.isBotMatch ? '#38BDF8' : '#FB7185', fontWeight: 600 }}>
                    {matchData?.isBotMatch ? `⚡ Ranked Bot (${matchData?.player2Rating || 500} pts)` : `${matchData?.player2Rating || 500} pts`}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                {matchData?.isBotMatch ? '⚡ Ranked AI Match — Starting In' : 'Ranked Match Starting In'}
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
                  fontFamily: 'var(--font-display)',
                  color: countdown <= 1 ? '#4ADE80' : '#22C55E',
                  lineHeight: 1,
                  margin: '0.4rem 0 0.85rem'
                }}
              >
                {countdown > 0 ? countdown : 'GO!'}
              </motion.div>

              <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
                Synchronizing challenge puzzles...
              </p>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {status === 'ERROR' && (
            <div>
              <ShieldAlert size={42} color="#FB7185" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>Matchmaking Error</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{error}</p>
              <button
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '0.6rem 1.5rem' }}
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
