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
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      style={{
        maxWidth: '560px',
        margin: '2rem auto',
        background: 'rgba(8, 14, 33, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.75rem',
        padding: '2.5rem 2.25rem',
        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.1)',
        textAlign: 'center',
        color: '#FFFFFF',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Header banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: isWinner ? 'rgba(34, 197, 94, 0.15)' : (isDraw ? 'rgba(56, 189, 248, 0.15)' : 'rgba(244, 63, 94, 0.15)'),
          border: `1px solid ${isWinner ? 'rgba(34, 197, 94, 0.4)' : (isDraw ? 'rgba(56, 189, 248, 0.4)' : 'rgba(244, 63, 94, 0.4)')}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          fontSize: '2.2rem'
        }}>
          {isWinner ? '🏆' : (isDraw ? '🤝' : '⚔️')}
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: isWinner ? '#22c55e' : (isDraw ? '#38bdf8' : '#f43f5e'),
          fontFamily: 'var(--font-display)',
          marginBottom: '0.4rem',
          letterSpacing: '-0.02em'
        }}>
          {isWinner ? 'VICTORY' : (isDraw ? 'DRAW PROTOCOL' : 'DEFEAT')}
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
          {isWinner
            ? 'Superior deduction speed and accuracy verified.'
            : (isDraw ? 'Equal cognitive performance registered across both nodes.' : 'Review mistake analysis to recalibrate your competitive strategy.')}
        </p>
      </div>

      {/* Head to Head Score comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        background: 'rgba(10, 18, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.25rem',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>YOUR SCORE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#22c55e', fontFamily: 'var(--font-mono)' }}>
            {myScore ?? 0}
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)', padding: '0 0.5rem' }}>
          VS
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{oppName}</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'var(--font-mono)' }}>
            {oppScore ?? 0}
          </div>
        </div>
      </div>

      {/* Rating Delta Box */}
      {matchResult.mode !== 'RANKED' && matchResult.isBotMatch ? (
        <div style={{
          background: 'rgba(10, 18, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1rem',
          padding: '0.85rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: 'rgba(255, 255, 255, 0.55)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)'
        }}>
          🤖 <span>Custom Bot Simulation — Ranked Elo rating unaffected.</span>
        </div>
      ) : (
        <div style={{
          background: myDelta > 0 ? 'rgba(34, 197, 94, 0.08)' : (myDelta < 0 ? 'rgba(244, 63, 94, 0.08)' : 'rgba(10, 18, 42, 0.65)'),
          border: `1px solid ${myDelta > 0 ? 'rgba(34, 197, 94, 0.25)' : (myDelta < 0 ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.08)')}`,
          borderRadius: '1.25rem',
          padding: '1.1rem 1.35rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
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
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {currentRank.name} TIER
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)' }}>
                {myBefore} → <strong style={{ color: '#ffffff' }}>{myAfter}</strong> Elo
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '1.15rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: myDelta > 0 ? '#22c55e' : (myDelta < 0 ? '#f43f5e' : 'rgba(255, 255, 255, 0.6)')
          }}>
            {myDelta > 0 ? <TrendingUp size={18} /> : (myDelta < 0 ? <TrendingDown size={18} /> : null)}
            {myDelta > 0 ? `+${myDelta}` : myDelta} Elo
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
        <button
          onClick={onRematch}
          style={{
            flex: 1,
            padding: '0.85rem 1.25rem',
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
          <RotateCcw size={15} /> REMATCH / REQUEUE
        </button>

        <button
          onClick={() => onDashboard ? onDashboard() : navigate('/dashboard')}
          style={{
            flex: 1,
            padding: '0.85rem 1.25rem',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <Home size={15} /> DASHBOARD
        </button>
      </div>
    </motion.div>
  );
}
