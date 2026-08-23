import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, RotateCcw, Home, Swords, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRankFromRating } from '../../utils/rankUtils';

export default function CompetitiveResults({
  matchResult,
  currentUserId,
  onRematch,
  onDashboard
}) {
  const navigate = useNavigate();

  if (!matchResult) return null;

  const isPlayer1 = matchResult.player1Id === currentUserId;
  const myScore = isPlayer1 ? matchResult.player1Score : matchResult.player2Score;
  const oppScore = isPlayer1 ? matchResult.player2Score : matchResult.player1Score;
  const oppName = isPlayer1 ? (matchResult.player2Username || 'Opponent') : (matchResult.player1Username || 'Opponent');

  const myDelta = isPlayer1 ? matchResult.player1RatingChange : matchResult.player2RatingChange;
  const myBefore = isPlayer1 ? matchResult.player1Rating : matchResult.player2Rating;
  const myAfter = (myBefore || 500) + (myDelta || 0);

  const isWinner = matchResult.winnerId === currentUserId;
  const isDraw = matchResult.winnerId === null && matchResult.player1Score === matchResult.player2Score;

  const currentRank = getRankFromRating(myAfter);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        maxWidth: '560px',
        margin: '2rem auto',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '1.5rem',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}
    >
      {/* Header banner */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: isWinner ? '#ECFDF5' : (isDraw ? '#EFF6FF' : '#FFF1F2'),
          border: `2px solid ${isWinner ? '#A7F3D0' : (isDraw ? '#BFDBFE' : '#FECDD3')}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2.2rem'
        }}>
          {isWinner ? '🏆' : (isDraw ? '🤝' : '⚔️')}
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: isWinner ? '#059669' : (isDraw ? '#2563EB' : '#0F172A'),
          fontFamily: 'var(--font-display)',
          marginBottom: '0.35rem'
        }}>
          {isWinner ? 'YOU WON!' : (isDraw ? 'DRAW MATCH' : 'DEFEAT')}
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          {isWinner
            ? 'Exceptional focus and problem-solving speed!'
            : (isDraw ? 'Well played! Both players performed with equal skill.' : 'Good effort! Review mistakes and challenge again.')}
        </p>
      </div>

      {/* Head to Head Score comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '1.25rem',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Your Score</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-display)' }}>
            {myScore ?? 0}
          </div>
        </div>

        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#94A3B8', padding: '0 0.5rem' }}>
          VS
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>{oppName}</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#64748B', fontFamily: 'var(--font-display)' }}>
            {oppScore ?? 0}
          </div>
        </div>
      </div>

      {/* Rating Delta Box */}
      {matchResult.isBotMatch ? (
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '1rem',
          padding: '0.85rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: '#64748B',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          🤖 <span>Practice AI Bot Match — Competitive Elo rating was not modified.</span>
        </div>
      ) : (
        <div style={{
          background: myDelta > 0 ? '#F0FDF4' : (myDelta < 0 ? '#FFF5F5' : '#F8FAFC'),
          border: `1px solid ${myDelta > 0 ? '#BBF7D0' : (myDelta < 0 ? '#FED7D7' : '#E2E8F0')}`,
          borderRadius: '1rem',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: currentRank.bg,
              border: `1px solid ${currentRank.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              {currentRank.badge}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                {currentRank.name} Tier
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Rating: {myBefore} → <strong style={{ color: '#0F172A' }}>{myAfter}</strong>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: myDelta > 0 ? '#16A34A' : (myDelta < 0 ? '#DC2626' : '#64748B')
          }}>
            {myDelta > 0 ? <TrendingUp size={18} /> : (myDelta < 0 ? <TrendingDown size={18} /> : null)}
            {myDelta > 0 ? `+${myDelta}` : myDelta} Elo
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={onRematch}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '0.875rem',
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
          }}
        >
          <RotateCcw size={16} /> Play Again / Rematch
        </button>

        <button
          onClick={() => onDashboard ? onDashboard() : navigate('/dashboard')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '0.875rem',
            background: '#FFFFFF',
            color: '#334155',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1px solid #CBD5E1',
            cursor: 'pointer'
          }}
        >
          <Home size={16} /> Dashboard
        </button>
      </div>
    </motion.div>
  );
}
