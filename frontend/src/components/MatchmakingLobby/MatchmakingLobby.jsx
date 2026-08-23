import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Loader2, X, CheckCircle, ShieldAlert, Sparkles, User, Trophy } from 'lucide-react';
import api from '../../utils/api';
import { getRankFromRating } from '../../utils/rankUtils';

export default function MatchmakingLobby({
  isOpen,
  onClose,
  gameSlug,
  gameTitle,
  mode = 'RANKED', // 'RANKED' or 'FRIEND'
  friendTarget = null,
  onMatchReady,
}) {
  const [status, setStatus] = useState('QUEUING'); // 'QUEUING', 'FOUND', 'COUNTDOWN', 'ERROR'
  const [matchData, setMatchData] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [queueTime, setQueueTime] = useState(0);
  const [error, setError] = useState(null);

  // Queue timer
  useEffect(() => {
    let interval;
    if (isOpen && status === 'QUEUING') {
      interval = setInterval(() => {
        setQueueTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, status]);

  // Initial Queue / Match creation
  useEffect(() => {
    if (!isOpen) {
      setStatus('QUEUING');
      setMatchData(null);
      setQueueTime(0);
      setError(null);
      return;
    }

    let pollInterval = null;
    let isCancelled = false;

    const startQueue = async () => {
      try {
        if (mode === 'RANKED') {
          const res = await api.post(`/api/matches/queue?gameSlug=${gameSlug}`);
          const match = res.data;
          setMatchData(match);

          if (match.status === 'READY' || match.player2Id) {
            handleMatchFound(match);
          } else {
            // Poll for opponent or bot fallback after 6s
            let pollCount = 0;
            pollInterval = setInterval(async () => {
              pollCount++;
              try {
                const pollRes = await api.get(`/api/matches/${match.id}`);
                const currentMatch = pollRes.data;
                setMatchData(currentMatch);

                if (currentMatch.status === 'READY' || (currentMatch.player2Id && currentMatch.player1Id)) {
                  clearInterval(pollInterval);
                  handleMatchFound(currentMatch);
                } else if (pollCount >= 6) {
                  // Fallback match with simulated skilled challenger if no real user in queue
                  clearInterval(pollInterval);
                  handleSimulatedMatch(match);
                }
              } catch (e) {
                console.error("Match status poll error", e);
              }
            }, 1200);
          }
        } else if (mode === 'FRIEND' && friendTarget) {
          const res = await api.post('/api/matches/invite', {
            friendId: friendTarget.userId || friendTarget.id,
            gameSlug: gameSlug
          });
          const match = res.data;
          setMatchData(match);

          // Poll for friend acceptance
          pollInterval = setInterval(async () => {
            try {
              const pollRes = await api.get(`/api/matches/${match.id}`);
              const currentMatch = pollRes.data;
              setMatchData(currentMatch);

              if (currentMatch.status === 'READY' || currentMatch.player2Ready) {
                clearInterval(pollInterval);
                handleMatchFound(currentMatch);
              }
            } catch (e) {
              console.error("Friend match poll error", e);
            }
          }, 1500);
        }
      } catch (err) {
        if (!isCancelled) {
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
  }, [isOpen, gameSlug, mode, friendTarget]);

  const handleMatchFound = (match) => {
    setStatus('FOUND');
    setTimeout(() => {
      setStatus('COUNTDOWN');
      startCountdown(match);
    }, 1500);
  };

  const handleSimulatedMatch = async (match) => {
    // If waiting too long in queue, auto-create a friendly bot challenger
    const simulatedOpponent = {
      ...match,
      player2Id: 999999,
      player2Username: 'ChallengerBot_99',
      player2Rating: Math.max(100, (match.player1Rating || 500) + Math.floor(Math.random() * 40 - 20)),
      player2Rank: 'Knight',
      player2Ready: true,
      status: 'READY'
    };
    setMatchData(simulatedOpponent);
    handleMatchFound(simulatedOpponent);
  };

  const startCountdown = (match) => {
    let count = 3;
    setCountdown(3);
    const cInterval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(cInterval);
        if (onMatchReady) {
          onMatchReady(match);
        }
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
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
            background: '#FFFFFF',
            borderRadius: '1.75rem',
            width: '100%',
            maxWidth: '520px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Close / Cancel Button */}
          {status === 'QUEUING' && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B'
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
                    border: '3px dashed #6366F1',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: '8px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Swords size={32} color="#4F46E5" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
                {mode === 'RANKED' ? 'Finding Competitive Opponent...' : `Inviting ${friendTarget?.username || 'Friend'}...`}
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Searching for players near your rating in {gameTitle}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '0.45rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '1.5rem'
              }}>
                <Loader2 size={16} className="animate-spin" color="#6366F1" />
                Queue Time: {Math.floor(queueTime / 60)}:{(queueTime % 60).toString().padStart(2, '0')}
              </div>

              <div>
                <button
                  onClick={onClose}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: '0.75rem',
                    background: '#FFF1F2',
                    border: '1px solid #FECDD3',
                    color: '#E11D48',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel Matchmaking
                </button>
              </div>
            </motion.div>
          )}

          {/* OPPONENT FOUND STATE */}
          {status === 'FOUND' && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#ECFDF5',
                border: '2px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: '#059669'
              }}>
                <CheckCircle size={38} />
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-display)', marginBottom: '0.35rem' }}>
                Match Found!
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Prepare your mind. Synchronizing puzzle data...
              </p>

              {/* Player vs Player card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '1.25rem',
                padding: '1.25rem 1.5rem',
                marginBottom: '1rem'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>You</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                    {matchData?.player1Username || 'You'}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#2563EB', fontWeight: 600 }}>
                    {matchData?.player1Rating || 500} pts
                  </div>
                </div>

                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#6366F1' }}>
                  VS
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Opponent</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                    {matchData?.player2Username || 'Challenger'}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#E11D48', fontWeight: 600 }}>
                    {matchData?.player2Rating || 500} pts
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* COUNTDOWN STATE */}
          {status === 'COUNTDOWN' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                Starting In
              </div>

              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: '4.5rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  color: countdown === 1 ? '#059669' : '#4F46E5',
                  lineHeight: 1,
                  margin: '1rem 0 1.5rem'
                }}
              >
                {countdown > 0 ? countdown : 'GO!'}
              </motion.div>

              <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
                Answer quickly and accurately to claim victory!
              </p>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {status === 'ERROR' && (
            <div>
              <ShieldAlert size={42} color="#E11D48" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>Matchmaking Error</h3>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{error}</p>
              <button
                onClick={onClose}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '0.75rem',
                  background: '#0F172A',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: 'none'
                }}
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
