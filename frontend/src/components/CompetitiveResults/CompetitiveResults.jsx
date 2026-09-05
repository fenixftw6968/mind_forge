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
        background: '#242424',
        border: '1px solid #2E2E2E',
        borderRadius: '1.5rem',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        color: '#F8FAFC'
      }}
    >
      {/* Header banner */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: isWinner ? 'rgba(34, 197, 94, 0.15)' : (isDraw ? 'rgba(56, 189, 248, 0.15)' : 'rgba(244, 63, 94, 0.15)'),
          border: `2px solid ${isWinner ? 'rgba(34, 197, 94, 0.35)' : (isDraw ? 'rgba(56, 189, 248, 0.35)' : 'rgba(244, 63, 94, 0.35)')}`,
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
          color: isWinner ? '#4ADE80' : (isDraw ? '#38BDF8' : '#F8FAFC'),
          fontFamily: 'var(--font-display)',
          marginBottom: '0.35rem'
        }}>
          {isWinner ? 'YOU WON!' : (isDraw ? 'DRAW MATCH' : 'DEFEAT')}
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
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
        background: '#1C1C1C',
        border: '1px solid #2E2E2E',
        borderRadius: '1.25rem',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Your Score</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4ADE80', fontFamily: 'var(--font-display)' }}>
            {myScore ?? 0}
          </div>
        </div>

        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748B', padding: '0 0.5rem' }}>
          VS
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>{oppName}</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#94A3B8', fontFamily: 'var(--font-display)' }}>
            {oppScore ?? 0}
          </div>
        </div>
      </div>

      {/* Rating Delta Box */}
      {matchResult.mode !== 'RANKED' && matchResult.isBotMatch ? (
        <div style={{
          background: '#1C1C1C',
          border: '1px solid #2E2E2E',
          borderRadius: '1rem',
          padding: '0.85rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: '#94A3B8',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          🤖 <span>Custom Bot Match — Competitive Elo rating was not modified.</span>
        </div>
      ) : (
        <div style={{
          background: myDelta > 0 ? 'rgba(34, 197, 94, 0.1)' : (myDelta < 0 ? 'rgba(244, 63, 94, 0.1)' : '#1C1C1C'),
          border: `1px solid ${myDelta > 0 ? 'rgba(34, 197, 94, 0.25)' : (myDelta < 0 ? 'rgba(244, 63, 94, 0.25)' : '#2E2E2E')}`,
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
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F8FAFC' }}>
                {currentRank.name} Tier
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Rating: {myBefore} → <strong style={{ color: '#F8FAFC' }}>{myAfter}</strong>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: myDelta > 0 ? '#4ADE80' : (myDelta < 0 ? '#FB7185' : '#94A3B8')
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
          className="btn-primary"
          style={{
            flex: 1,
            padding: '0.85rem 1.25rem',
            fontSize: '0.9rem'
          }}
        >
          <RotateCcw size={16} /> Play Again / Rematch
        </button>

        <button
          onClick={() => onDashboard ? onDashboard() : navigate('/dashboard')}
          className="btn-secondary"
          style={{
            flex: 1,
            padding: '0.85rem 1.25rem',
            fontSize: '0.9rem'
          }}
        >
          <Home size={16} /> Dashboard
        </button>
      </div>
    </motion.div>
  );
}
