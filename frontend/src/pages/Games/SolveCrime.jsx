import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Search, Clock, FileText, Send, CheckCircle, XCircle, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import XPPopup from '../../components/XPPopup/XPPopup';
import DifficultySelector from '../../components/DifficultySelector/DifficultySelector';
import GameProgress from '../../components/GameProgress/GameProgress';
import GameResults from '../../components/GameResults/GameResults';
import { getDailyQuestionSet } from '../../services/dailyQuestionService';
import { getRandomQuestionSet } from '../../services/randomQuestionService';
import { solveCrimeQuestions } from '../../data/solveCrimeQuestions';
import api from '../../utils/api';

const TABS = [
  { id: 'overview',   label: 'Overview',  icon: <FileText size={15} /> },
  { id: 'suspects',   label: 'Suspects',  icon: <Users size={15} /> },
  { id: 'evidence',   label: 'Evidence',  icon: <Search size={15} /> },
  { id: 'timeline',   label: 'Timeline',  icon: <Clock size={15} /> },
  { id: 'notebook',   label: 'Notebook',  icon: <BookOpen size={15} /> },
  { id: 'submit',     label: 'Solve Case',icon: <Send size={15} /> },
];

export default function SolveCrime() {
  const { refreshUser } = useAuth();
  const { xpPopups, showXPPopup } = useGame();
  const navigate = useNavigate();

  const [difficulty, setDifficulty]           = useState(null); // null = selecting
  const [cases, setCases]                     = useState([]);
  const [caseIndex, setCaseIndex]             = useState(0);
  const [tab, setTab]                         = useState('overview');
  const [notebook, setNotebook]               = useState('');
  const [selectedCulprit, setSelectedCulprit] = useState('');
  const [selectedMotive, setSelectedMotive]   = useState('');
  const [keyEvidence, setKeyEvidence]         = useState([]);
  const [submitted, setSubmitted]             = useState(false);
  const [result, setResult]                   = useState(null);
  const [score, setScore]                     = useState(0);
  const [totalXP, setTotalXP]                 = useState(0);
  const [showComplete, setShowComplete]       = useState(false);
  const [latestUser, setLatestUser]           = useState(null);

  const myCase = cases[caseIndex];

  const startGame = (diff) => {
    const selectedCases = getDailyQuestionSet({
      gameType: 'solve-crime',
      difficulty: diff,
      questionBank: solveCrimeQuestions,
      count: 10,
      userShuffle: true
    });

    setCases(selectedCases);
    setDifficulty(diff);
    setCaseIndex(0);
    setScore(0);
    setTotalXP(0);
    setTab('overview');
    setNotebook('');
    setSelectedCulprit('');
    setSelectedMotive('');
    setKeyEvidence([]);
    setSubmitted(false);
    setResult(null);
    setShowComplete(false);
    setLatestUser(null);
  };

  const toggleEvidence = (id) => {
    setKeyEvidence(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    if (!selectedCulprit) return;
    const isCorrect = selectedCulprit === myCase.correctAnswer;
    const caseReward = myCase.xpReward || 50;
    const earned = isCorrect ? caseReward : Math.floor(caseReward * 0.2);

    if (isCorrect) {
      setScore(s => s + 1);
      setTotalXP(t => t + earned);
      showXPPopup(earned);
    }

    setResult({
      correct: isCorrect,
      score: isCorrect ? 100 : 30,
      correctCulprit: isCorrect,
      solution: myCase.solution || myCase.explanation
    });
    setSubmitted(true);
    setTab('submit');

    try {
      const res = await api.post(`/api/mystery/${myCase.id}/solve`, {
        culprit: selectedCulprit,
        motive: selectedMotive,
        keyEvidence: keyEvidence
      });

      if (res.data?.user) {
        setLatestUser(res.data.user);
      }
    } catch (e) {
      // Offline fallback
    }
  };

  const handleNextCase = () => {
    if (caseIndex + 1 >= cases.length) {
      if (latestUser) {
        refreshUser(latestUser);
      }
      setShowComplete(true);
    } else {
      setCaseIndex(i => i + 1);
      setTab('overview');
      setSelectedCulprit('');
      setSelectedMotive('');
      setKeyEvidence([]);
      setSubmitted(false);
      setResult(null);
    }
  };

  if (!difficulty) {
    return (
      <DifficultySelector
        title="Solve the Crime"
        subtitle="Examine suspects, physical evidence, and timelines to crack real mystery dossiers."
        icon="🕵️"
        onSelectDifficulty={(diff) => startGame(diff)}
        onBack={() => navigate('/games')}
        customTiers={[
          { id: 'EASY', label: 'Easy Dossiers', icon: '🔍', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', xp: '+40 XP', time: 'Clear Clues', desc: 'Thefts & break-ins with direct physical evidence' },
          { id: 'MEDIUM', label: 'Medium Investigations', icon: '💼', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', xp: '+60 XP', time: 'Subtle Clues', desc: 'Poisonings, sabotage, and broken flight alibis' },
          { id: 'HARD', label: 'Hard Conspiracies', icon: '🔥', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', xp: '+100 XP', time: 'Masterminds', desc: 'Locked-room mysteries, deep sea saboteurs & cyber heists' }
        ]}
      />
    );
  }

  if (showComplete) {
    return (
      <GameResults
        score={score}
        total={cases.length}
        xpEarned={totalXP}
        gameTitle="Solve the Crime"
        onPlayAgain={() => startGame(difficulty)}
      />
    );
  }

  if (!myCase) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '64px' }}>
      <XPPopup popups={xpPopups} />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Progress Header */}
        <GameProgress
          current={caseIndex + 1}
          total={cases.length}
          score={score}
          difficulty={difficulty}
          onExit={() => setDifficulty(null)}
          scoreLabel="Solved"
          onMidnightRollover={() => startGame(difficulty)}
        />

        {/* Case Title Card */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '2.5rem' }}>{myCase.coverEmoji || "🕵️"}</span>
            <div>
              <h1 className="font-display" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.75rem)', fontWeight: 800, color: '#0F172A' }}>
                {myCase.title}
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>{myCase.subtitle}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.35rem 0.85rem', borderRadius: '999px', background: '#FFFBEB', border: '1px solid #FDE68A', fontSize: '0.8rem', color: '#B45309', fontWeight: 800 }}>
              +{myCase.xpReward || 50} XP
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.1rem',
                borderRadius: '0.625rem',
                border: tab === t.id ? '1px solid #C7D2FE' : '1px solid transparent',
                background: tab === t.id ? '#EEF2FF' : 'transparent',
                color: tab === t.id ? '#4F46E5' : '#64748B',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: tab === t.id ? 700 : 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
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
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '1.75rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
                  <h2 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>🔍 Crime Incident Report</h2>
                  <p style={{ color: '#334155', lineHeight: 1.8, fontSize: '0.95rem', fontWeight: 500 }}>{myCase.crimeDescription}</p>
                </div>
                <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '1rem', padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#BE123C', fontWeight: 800, marginBottom: '0.5rem' }}>🎯 Your Detective Directives</p>
                  <ul style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 2, paddingLeft: '1.25rem', fontWeight: 500 }}>
                    <li>Cross-examine the suspect statements and uncover contradictions.</li>
                    <li>Inspect physical and digital evidence traces.</li>
                    <li>Align the timeline and submit your final indictment in the <strong>Solve Case</strong> tab.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SUSPECTS */}
            {tab === 'suspects' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Array.isArray(myCase.suspects) && myCase.suspects.map(s => (
                  <div key={s.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#EEF2FF', border: '2px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                        {s.avatar}
                      </div>
                      <div>
                        <h3 className="font-accent" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{s.name}</h3>
                        <p style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600, marginBottom: '0.25rem' }}>{s.role}</p>
                        <p style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600 }}>Motive: {s.motive}</p>
                      </div>
                    </div>
                    <div style={{ padding: '1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, marginBottom: '0.35rem' }}>STATEMENT</p>
                      <p style={{ fontSize: '0.875rem', color: '#1E293B', fontStyle: 'italic', lineHeight: 1.6 }}>"{s.statement}"</p>
                    </div>
                    {s.suspicious && s.suspicious.length > 0 && (
                      <div>
                        <p style={{ fontSize: '0.7rem', color: '#E11D48', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>⚠️ Suspicious Factors</p>
                        <ul style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.8, paddingLeft: '1rem', fontWeight: 500 }}>
                          {s.suspicious.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* EVIDENCE */}
            {tab === 'evidence' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {Array.isArray(myCase.evidence) && myCase.evidence.map(ev => (
                  <div key={ev.id} style={{ background: '#FFFFFF', border: `1px solid ${ev.isKey ? '#BAE6FD' : '#E2E8F0'}`, borderRadius: '1rem', padding: '1.25rem', position: 'relative', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
                    {ev.isKey && <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '0.15rem 0.5rem', borderRadius: '999px' }}><Key size={10} color="#0284C7" /><span style={{ fontSize: '0.65rem', color: '#0369A1', fontWeight: 700 }}>Key Clue</span></div>}
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{ev.emoji}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{ev.type}</span>
                      <h4 className="font-accent" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{ev.title}</h4>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.65, marginBottom: '1rem', fontWeight: 500 }}>{ev.content}</p>
                    <button
                      onClick={() => toggleEvidence(ev.id)}
                      style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: keyEvidence.includes(ev.id) ? '1px solid #C7D2FE' : '1px solid #E2E8F0', background: keyEvidence.includes(ev.id) ? '#EEF2FF' : '#F8FAFC', color: keyEvidence.includes(ev.id) ? '#4338CA' : '#64748B', cursor: 'pointer', transition: 'all 0.15s ease' }}
                    >
                      {keyEvidence.includes(ev.id) ? '✓ Pinned to Notebook' : '+ Pin to Notebook'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TIMELINE */}
            {tab === 'timeline' && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '1.75rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
                <h2 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>📅 Event Sequence Timeline</h2>
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                  <div style={{ position: 'absolute', left: '0.5rem', top: 0, bottom: 0, width: '2px', background: '#E2E8F0' }} />
                  {Array.isArray(myCase.timeline) && myCase.timeline.map((event, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ display: 'flex', gap: '1.25rem', paddingBottom: '1.5rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-1.65rem', top: '0.2rem', width: '10px', height: '10px', borderRadius: '50%', background: '#6366F1', border: '2px solid #FFFFFF', boxShadow: '0 0 4px rgba(99,102,241,0.5)' }} />
                      <div>
                        <div className="font-display" style={{ fontSize: '0.825rem', color: '#4F46E5', fontWeight: 800, marginBottom: '0.2rem' }}>{event.time}</div>
                        <div style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500 }}>{event.event}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTEBOOK */}
            {tab === 'notebook' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
                  <h2 className="font-accent" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>📓 Detective's Deduction Pad</h2>
                  <textarea
                    value={notebook}
                    onChange={e => setNotebook(e.target.value)}
                    placeholder="Type your deductions and hypotheses here..."
                    style={{ width: '100%', minHeight: '180px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1rem', color: '#0F172A', fontFamily: 'Courier New, monospace', fontSize: '0.9rem', lineHeight: 1.8, resize: 'vertical', outline: 'none' }}
                  />
                </div>
                {keyEvidence.length > 0 && (
                  <div style={{ background: '#FFFFFF', border: '1px solid #BAE6FD', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284C7', marginBottom: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pinned Clues</p>
                    {keyEvidence.map(eId => {
                      const ev = myCase.evidence?.find(e => e.id === eId);
                      return ev ? (
                        <div key={eId} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem', borderBottom: '1px solid #F1F5F9', fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                          <span>{ev.emoji}</span> {ev.title}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SUBMIT / SOLVE */}
            {tab === 'submit' && !submitted && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1.25rem', padding: '1.75rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
                  <h2 className="font-accent" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>⚖️ Submit Case Indictment</h2>

                  {/* Culprit choice */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                      Who committed the crime?
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Array.isArray(myCase.culpritChoices) && myCase.culpritChoices.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCulprit(c.id)}
                          style={{
                            padding: '0.95rem 1.15rem',
                            borderRadius: '0.75rem',
                            border: `1px solid ${selectedCulprit === c.id ? '#6366F1' : '#E2E8F0'}`,
                            background: selectedCulprit === c.id ? '#EEF2FF' : '#FFFFFF',
                            color: selectedCulprit === c.id ? '#4338CA' : '#334155',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '0.925rem',
                            fontWeight: 600,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!selectedCulprit}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem', opacity: selectedCulprit ? 1 : 0.5 }}
                  >
                    🔍 Solve Case
                  </button>
                </div>
              </div>
            )}

            {/* RESULTS VIEW */}
            {tab === 'submit' && submitted && result && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{result.correct ? '🏆' : '🕵️'}</div>
                  <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: result.correct ? '#059669' : '#D97706', marginBottom: '0.5rem' }}>
                    {result.correct ? 'Case Solved Successfully!' : 'Deduction Incomplete'}
                  </h2>
                  <p style={{ color: '#64748B', fontWeight: 600 }}>Case Rating: <span style={{ color: '#4F46E5', fontWeight: 800, fontSize: '1.25rem' }}>{result.score}/100</span></p>
                </div>

                {/* Solution Summary */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0284C7', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Case Breakdown & Solution</p>
                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.75, fontWeight: 500 }}>{result.solution}</p>
                </div>

                <button onClick={handleNextCase} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                  {caseIndex + 1 >= cases.length ? 'See Final Session Results 🏆' : 'Next Mystery Case →'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
