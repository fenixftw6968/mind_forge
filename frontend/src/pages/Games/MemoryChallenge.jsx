import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle, XCircle, Star, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import XPPopup from '../../components/XPPopup/XPPopup';
import api from '../../utils/api';

export default function MemoryChallenge() {
  const { refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();

  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase]   = useState('select'); // select | reveal | recall | result | complete
  const [timeLeft, setTimeLeft] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers]   = useState([]);
  const [score, setScore]       = useState(0);
  const [totalXP, setTotalXP]   = useState(0);
  const [latestUser, setLatestUser] = useState(null);

  const intervalRef = useRef(null);
  const scene   = scenes[sceneIndex];
  const question = scene?.questions[qIndex];

  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const res = await api.get('/api/games/memory-challenge/puzzles');
        const parsed = res.data.map(p => {
          const content = typeof p.content === 'string' ? JSON.parse(p.content) : p.content;
          return {
            ...p,
            revealTime: content.revealTime,
            items: content.items,
            questions: content.questions,
            description: content.description
          };
        });
        setScenes(parsed);
      } catch (e) {
        console.error("Failed to load memory scenes", e);
      } finally {
        setLoading(false);
      }
    };
    fetchScenes();
  }, []);

  const startScene = (idx) => {
    setSceneIndex(idx);
    setPhase('reveal');
    setTimeLeft(scenes[idx].revealTime);
    setQIndex(0); setAnswers([]); setSelected(null); setLatestUser(null);
  };

  useEffect(() => {
    if (phase === 'reveal' && timeLeft > 0) {
      intervalRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (phase === 'reveal' && timeLeft === 0) {
      setPhase('recall');
    }
    return () => clearTimeout(intervalRef.current);
  }, [phase, timeLeft]);

  const handleAnswer = (choice) => {
    if (selected) return;
    setSelected(choice);
    const isCorrect = choice === question.answer;
    const newAnswers = [...answers, { qId: question.id, choice, correct: isCorrect }];
    setAnswers(newAnswers);

    setTimeout(async () => {
      if (qIndex + 1 >= scene.questions.length) {
        const correct = newAnswers.filter(a => a.correct).length;
        const passed = correct >= Math.ceil(scene.questions.length * 0.7);
        const ansValue = passed ? "correct" : "incorrect";
        setScore(correct);

        try {
          const res = await api.post('/api/games/memory-challenge/attempts', {
            puzzleId: scene.id,
            userAnswer: ansValue,
            hintUsed: false,
            timeTakenSeconds: 30
          });

          const earned = res.data.xpEarned;
          setTotalXP(earned);
          if (earned > 0) showXPPopup(earned);

          if (res.data.user) {
            setLatestUser(res.data.user);
          }
        } catch (e) {
          console.error("Failed to submit attempt", e);
        }

        setPhase('result');
      } else {
        setQIndex(q => q + 1);
        setSelected(null);
      }
    }, 900);
  };

  const handleComplete = () => {
    if (latestUser) {
      refreshUser(latestUser);
    }
    setPhase('complete');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#52526a' }}>Loading Memory Scenes...</div>
      </div>
    );
  }

  if (phase === 'select') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '560px', width: '100%', padding: '2rem' }}>
          <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Back to Games
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>👁️</div>
              <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Memory Challenge</h1>
              <p style={{ color: '#a1a1b5' }}>Study the scene carefully. Then answer questions from memory.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {scenes.map((s, i) => (
                <motion.button key={i} whileHover={{ scale: 1.02 }} onClick={() => startScene(i)}
                  style={{ width: '100%', padding: '1.25rem', borderRadius: '1rem', background: s.difficulty === 'EASY' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${s.difficulty === 'EASY' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.75rem' }}>{s.difficulty === 'EASY' ? '🌱' : '🔥'}</div>
                  <div>
                    <div className="font-accent" style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{s.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#a1a1b5', marginTop: '0.15rem' }}>{s.difficulty} • {s.revealTime}s to memorize • {s.questions.length} questions</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '440px', padding: '2rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🧠</div>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Memory Logged!</h1>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={() => setPhase('select')} className="btn-primary">Play Again</button>
            <button onClick={() => navigate('/games')} className="btn-secondary">Games</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => setPhase('select')} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Exit
          </button>
          <div style={{ display: 'flex', align: 'center', gap: '0.5rem' }}>
            {phase === 'reveal' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: timeLeft <= 3 ? 'rgba(244,63,94,0.15)' : 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <Eye size={13} color={timeLeft <= 3 ? '#f43f5e' : '#a78bfa'} />
                <span className="font-display" style={{ fontSize: '0.85rem', fontWeight: 700, color: timeLeft <= 3 ? '#f43f5e' : '#a78bfa' }}>{timeLeft}s</span>
              </div>
            )}
            {phase === 'recall' && (
              <span style={{ fontSize: '0.8rem', color: '#52526a' }}>Q {qIndex + 1}/{scene.questions.length}</span>
            )}
          </div>
        </div>

        {/* REVEAL PHASE */}
        {phase === 'reveal' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Eye size={16} color="#8b5cf6" />
                <span className="font-accent" style={{ fontSize: '1rem', fontWeight: 600, color: '#a78bfa' }}>Memorize This Scene</span>
              </div>
              <p style={{ color: '#52526a', fontSize: '0.8rem' }}>{scene.description}</p>
            </div>

            {/* Scene display */}
            <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {scene.items.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                    className="memory-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', gap: '0.4rem' }}>
                    <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1b5', textAlign: 'center' }}>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Countdown */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', maxWidth: '300px', margin: '0 auto' }}>
                <motion.div style={{ height: '100%', borderRadius: '999px', background: timeLeft <= 3 ? '#f43f5e' : 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / scene.revealTime) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
              <p style={{ marginTop: '0.75rem', color: '#52526a', fontSize: '0.8rem' }}>Scene hidden in {timeLeft}s...</p>
            </div>
          </motion.div>
        )}

        {/* RECALL PHASE */}
        {phase === 'recall' && question && (
          <AnimatePresence mode="wait">
            <motion.div key={qIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <EyeOff size={16} color="#f43f5e" />
                  <span className="font-accent" style={{ fontSize: '1rem', fontWeight: 600, color: '#f43f5e' }}>Scene Hidden — Answer from Memory</span>
                </div>
              </div>
              <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.5rem', padding: '2rem' }}>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>
                  {question.question}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                  {question.choices.map(choice => {
                    let borderColor = 'rgba(255,255,255,0.06)';
                    let bg = 'rgba(255,255,255,0.02)';
                    let color = '#a1a1b5';
                    if (selected) {
                      if (choice === question.answer) { borderColor = '#10b981'; bg = 'rgba(16,185,129,0.1)'; color = '#10b981'; }
                      else if (selected === choice) { borderColor = '#f43f5e'; bg = 'rgba(244,63,94,0.1)'; color = '#f43f5e'; }
                    }
                    return (
                      <motion.button key={choice} whileHover={!selected ? { scale: 1.02 } : {}} onClick={() => handleAnswer(choice)} disabled={!!selected}
                        style={{ padding: '0.9rem', borderRadius: '0.75rem', border: `1px solid ${borderColor}`, background: bg, color, cursor: selected ? 'default' : 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {selected && choice === question.answer && <CheckCircle size={14} color="#10b981" />}
                        {selected === choice && choice !== question.answer && <XCircle size={14} color="#f43f5e" />}
                        {choice}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{score >= scene.questions.length ? '🏆' : score > 0 ? '⭐' : '💪'}</div>
            <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              {score}/{scene.questions.length} Correct
            </h2>
            <p style={{ color: '#a1a1b5', marginBottom: '2rem' }}>
              {score === scene.questions.length ? 'Perfect memory! 🧠' : 'Keep training your observation skills.'}
            </p>
            <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#a78bfa' }}>+{totalXP}</div>
                <div style={{ fontSize: '0.75rem', color: '#52526a' }}>XP</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>+{Math.floor(totalXP / 2.5)}</div>
                <div style={{ fontSize: '0.75rem', color: '#52526a' }}>Coins</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={handleComplete} className="btn-primary">Claim Rewards</button>
              <button onClick={() => navigate('/games')} className="btn-secondary">Back to Games</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
