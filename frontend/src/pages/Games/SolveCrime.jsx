import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Search, Clock, FileText, Send, CheckCircle, XCircle, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import XPPopup from '../../components/XPPopup/XPPopup';
import api from '../../utils/api';

const TABS = [
  { id: 'overview',   label: 'Overview',  icon: <FileText size={14} /> },
  { id: 'suspects',   label: 'Suspects',  icon: <Users size={14} /> },
  { id: 'evidence',   label: 'Evidence',  icon: <Search size={14} /> },
  { id: 'timeline',   label: 'Timeline',  icon: <Clock size={14} /> },
  { id: 'notebook',   label: 'Notebook',  icon: <BookOpen size={14} /> },
  { id: 'submit',     label: 'Submit',    icon: <Send size={14} /> },
];

export default function SolveCrime() {
  const { refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [caseIndex] = useState(0);
  const [tab, setTab]            = useState('overview');
  const [notebook, setNotebook]  = useState('');
  const [selectedCulprit, setSelectedCulprit] = useState('');
  const [selectedMotive, setSelectedMotive]   = useState('');
  const [keyEvidence, setKeyEvidence]         = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult]       = useState(null); // { correct, score, feedback }

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get('/api/mystery');
        const parsed = res.data.map(c => {
          return {
            ...c,
            suspects: typeof c.suspects === 'string' ? JSON.parse(c.suspects) : c.suspects,
            evidence: typeof c.evidence === 'string' ? JSON.parse(c.evidence) : c.evidence,
            timeline: typeof c.timeline === 'string' ? JSON.parse(c.timeline) : c.timeline,
            correctAnswer: typeof c.correctAnswer === 'string' ? JSON.parse(c.correctAnswer) : c.correctAnswer,
            culpritChoices: typeof c.culpritChoices === 'string' ? JSON.parse(c.culpritChoices) : c.culpritChoices,
            motiveChoices: typeof c.motiveChoices === 'string' ? JSON.parse(c.motiveChoices) : c.motiveChoices,
          };
        });
        setCases(parsed);
      } catch (e) {
        console.error("Failed to load mystery cases", e);
      }
    };
    fetchCases();
  }, []);

  const myCase = cases[caseIndex];

  const toggleEvidence = (id) => {
    setKeyEvidence(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    if (!selectedCulprit || !selectedMotive) return;
    try {
      const res = await api.post(`/api/mystery/${myCase.id}/solve`, {
        culprit: selectedCulprit,
        motive: selectedMotive,
        keyEvidence: keyEvidence
      });

      if (res.data.correctCulprit) {
        showXPPopup(myCase.xpReward);
      }

      setResult({
        correct: res.data.correct,
        score: res.data.score,
        correctCulprit: res.data.correctCulprit,
        correctMotive: res.data.correctMotive,
        evidenceMatches: res.data.evidenceMatches
      });
      setSubmitted(true);
      setTab('submit');

      if (res.data.user) {
        refreshUser(res.data.user);
      }
    } catch (e) {
      console.error("Failed to solve mystery case", e);
    }
  };

  if (cases.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#52526a' }}>Loading Mystery Case...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: '#a1a1b5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{myCase.coverEmoji}</span>
              <div>
                <h1 className="font-display" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.75rem)', fontWeight: 700, color: 'white' }}>{myCase.title}</h1>
                <p style={{ fontSize: '0.8rem', color: '#52526a' }}>{myCase.subtitle}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', align: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.4rem 0.85rem', borderRadius: '999px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600 }}>{myCase.difficulty}</div>
            <div style={{ padding: '0.4rem 0.85rem', borderRadius: '999px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>+{myCase.xpReward} XP</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1rem', border: 'none', borderBottom: `2px solid ${tab === t.id ? '#8b5cf6' : 'transparent'}`, background: tab === t.id ? 'rgba(139,92,246,0.08)' : 'transparent', color: tab === t.id ? '#a78bfa' : '#a1a1b5', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.25rem', padding: '1.75rem' }}>
                  <h2 className="font-accent" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>🔍 Crime Description</h2>
                  <p style={{ color: '#a1a1b5', lineHeight: 1.8, fontSize: '0.95rem' }}>{myCase.crimeDescription}</p>
                </div>
                <div style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: '1rem', padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#f43f5e', fontWeight: 600, marginBottom: '0.5rem' }}>🎯 Your Mission</p>
                  <ul style={{ color: '#a1a1b5', fontSize: '0.875rem', lineHeight: 2, paddingLeft: '1.25rem' }}>
                    <li>Identify the culprit</li>
                    <li>Determine the motive</li>
                    <li>Select the key evidence</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SUSPECTS */}
            {tab === 'suspects' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myCase.suspects.map(s => (
                  <div key={s.id} style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', border: '2px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                        {s.avatar}
                      </div>
                      <div>
                        <h3 className="font-accent" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white' }}>{s.name}</h3>
                        <p style={{ fontSize: '0.75rem', color: '#8b5cf6', marginBottom: '0.25rem' }}>{s.role}</p>
                        <p style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Motive: {s.motive}</p>
                      </div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#52526a', fontWeight: 600, marginBottom: '0.35rem' }}>STATEMENT</p>
                      <p style={{ fontSize: '0.875rem', color: '#e1e1f0', fontStyle: 'italic', lineHeight: 1.6 }}>"{s.statement}"</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>⚠️ Suspicious Points</p>
                      <ul style={{ color: '#a1a1b5', fontSize: '0.8rem', lineHeight: 1.9 }}>
                        {s.suspicious.map((p, i) => <li key={i} style={{ paddingLeft: '0.5rem' }}>• {p}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EVIDENCE */}
            {tab === 'evidence' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {myCase.evidence.map(ev => (
                  <div key={ev.id} style={{ background: '#13131f', border: `1px solid ${ev.isKey ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '1rem', padding: '1.25rem', position: 'relative' }}>
                    {ev.isKey && <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(6,182,212,0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}><Key size={10} color="#06b6d4" /><span style={{ fontSize: '0.65rem', color: '#06b6d4' }}>Key</span></div>}
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{ev.emoji}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{ev.type}</span>
                      <h4 className="font-accent" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{ev.title}</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#a1a1b5', lineHeight: 1.65, marginBottom: '1rem' }}>{ev.content}</p>
                    <button onClick={() => toggleEvidence(ev.id)}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: keyEvidence.includes(ev.id) ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)', background: keyEvidence.includes(ev.id) ? 'rgba(139,92,246,0.12)' : 'transparent', color: keyEvidence.includes(ev.id) ? '#a78bfa' : '#52526a', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {keyEvidence.includes(ev.id) ? '✓ In Notebook' : '+ Add to Notebook'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TIMELINE */}
            {tab === 'timeline' && (
              <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.25rem', padding: '1.75rem' }}>
                <h2 className="font-accent" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>📅 Event Timeline</h2>
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                  <div style={{ position: 'absolute', left: '0.5rem', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, #8b5cf6, rgba(139,92,246,0.1))' }} />
                  {myCase.timeline.map((event, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ display: 'flex', gap: '1.25rem', paddingBottom: '1.5rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-1.65rem', top: '0.2rem', width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6', border: '2px solid #0a0a0f', boxShadow: '0 0 8px rgba(139,92,246,0.5)' }} />
                      <div>
                        <div className="font-display" style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 600, marginBottom: '0.2rem' }}>{event.time}</div>
                        <div style={{ fontSize: '0.9rem', color: '#e1e1f0' }}>{event.event}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTEBOOK */}
            {tab === 'notebook' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                  <h2 className="font-accent" style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>📓 Detective's Notebook</h2>
                  <textarea
                    value={notebook}
                    onChange={e => setNotebook(e.target.value)}
                    placeholder="Write your deductions here..."
                    style={{ width: '100%', minHeight: '180px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', padding: '1rem', color: '#67e8f9', fontFamily: 'Courier New, monospace', fontSize: '0.9rem', lineHeight: 1.8, resize: 'vertical', outline: 'none' }}
                  />
                </div>
                {keyEvidence.length > 0 && (
                  <div style={{ background: '#13131f', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '1rem', padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#06b6d4', marginBottom: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pinned Evidence</p>
                    {keyEvidence.map(eId => {
                      const ev = myCase.evidence.find(e => e.id === eId);
                      return ev ? (
                        <div key={eId} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem', color: '#a1a1b5' }}>
                          <span>{ev.emoji}</span> {ev.title}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SUBMIT */}
            {tab === 'submit' && !submitted && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.25rem', padding: '1.75rem' }}>
                  <h2 className="font-accent" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>⚖️ Submit Your Solution</h2>

                  {/* Culprit */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#a1a1b5', marginBottom: '0.75rem' }}>Who committed the crime?</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {myCase.culpritChoices.map(c => (
                        <button key={c.id} onClick={() => setSelectedCulprit(c.id)}
                          style={{ padding: '0.85rem 1.1rem', borderRadius: '0.75rem', border: `1px solid ${selectedCulprit === c.id ? '#8b5cf6' : 'rgba(255,255,255,0.06)'}`, background: selectedCulprit === c.id ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)', color: selectedCulprit === c.id ? '#a78bfa' : '#a1a1b5', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s' }}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Motive */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#a1a1b5', marginBottom: '0.75rem' }}>What was the motive?</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {myCase.motiveChoices.map(m => (
                        <button key={m.id} onClick={() => setSelectedMotive(m.id)}
                          style={{ padding: '0.85rem 1.1rem', borderRadius: '0.75rem', border: `1px solid ${selectedMotive === m.id ? '#06b6d4' : 'rgba(255,255,255,0.06)'}`, background: selectedMotive === m.id ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.02)', color: selectedMotive === m.id ? '#67e8f9' : '#a1a1b5', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleSubmit} disabled={!selectedCulprit || !selectedMotive} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: selectedCulprit && selectedMotive ? 1 : 0.5 }}>
                    🔍 Submit Solution
                  </button>
                </div>
              </div>
            )}

            {/* RESULT */}
            {tab === 'submit' && submitted && result && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{result.correct ? '🏆' : '🕵️'}</div>
                  <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: result.correct ? '#10b981' : '#f59e0b', marginBottom: '0.5rem' }}>
                    {result.correct ? 'Case Solved!' : 'Partial Solution'}
                  </h2>
                  <p style={{ color: '#a1a1b5' }}>Score: <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '1.25rem' }}>{result.score}/100</span></p>
                </div>

                {/* Score breakdown */}
                <div style={{ background: '#13131f', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Culprit', correct: result.correctCulprit, points: 60 },
                    { label: 'Motive', correct: result.correctMotive, points: 25 },
                    { label: 'Evidence', correct: result.evidenceMatches > 0, points: result.evidenceMatches * 5 },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      {r.correct ? <CheckCircle size={16} color="#10b981" /> : <XCircle size={16} color="#f43f5e" />}
                      <span style={{ flex: 1, color: '#a1a1b5', fontSize: '0.875rem' }}>{r.label}</span>
                      <span style={{ color: r.correct ? '#10b981' : '#f43f5e', fontWeight: 600, fontSize: '0.875rem' }}>+{r.points} pts</span>
                    </div>
                  ))}
                </div>

                {/* Solution */}
                <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Full Solution</p>
                  <p style={{ fontSize: '0.875rem', color: '#a1a1b5', lineHeight: 1.75 }}>{myCase.solution}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button onClick={() => navigate('/games')} className="btn-primary">More Cases</button>
                  <button onClick={() => navigate('/dashboard')} className="btn-secondary">Dashboard</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
