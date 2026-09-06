import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, MessageSquare, Swords, Check, X, Send, Search, Circle, Shield } from 'lucide-react';
import api from '../../utils/api';
import { getRankFromRating } from '../../utils/rankUtils';

export default function SocialDrawer({ isOpen, onClose, onInviteFriendToGame }) {
  const [activeTab, setActiveTab] = useState('FRIENDS'); // 'FRIENDS', 'REQUESTS', 'CHAT'
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addUsername, setAddUsername] = useState('');
  const [addStatus, setAddStatus] = useState(null);

  // Chat state
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef(null);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/friends');
      setFriends(res.data);
    } catch (e) {
      console.warn("Could not load friends list", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  // Load chat messages when selecting friend
  useEffect(() => {
    let interval = null;
    if (activeTab === 'CHAT' && selectedFriend) {
      const fetchChat = async () => {
        try {
          const res = await api.get(`/api/chat/${selectedFriend.userId}`);
          setChatMessages(res.data);
        } catch (e) {
          console.error("Failed to load chat", e);
        }
      };
      fetchChat();
      interval = setInterval(fetchChat, 2000);
    }
    return () => clearInterval(interval);
  }, [activeTab, selectedFriend]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!addUsername.trim()) return;
    try {
      setAddStatus({ type: 'loading', msg: 'Transmitting request...' });
      await api.post('/api/friends/request', { username: addUsername.trim() });
      setAddStatus({ type: 'success', msg: `Node link request dispatched to @${addUsername}` });
      setAddUsername('');
      fetchFriends();
    } catch (e) {
      const msg = e.response?.data?.message || 'User not found or connection already established';
      setAddStatus({ type: 'error', msg });
    }
  };

  const handleRespondRequest = async (friendshipId, accept) => {
    try {
      await api.post('/api/friends/respond', { friendshipId, accept });
      fetchFriends();
    } catch (e) {
      console.error("Failed to respond to request", e);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedFriend) return;
    const text = chatInput.trim();
    setChatInput('');
    try {
      const res = await api.post(`/api/chat/${selectedFriend.userId}`, { content: text });
      setChatMessages(prev => [...prev, res.data]);
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  if (!isOpen) return null;

  const acceptedFriends = friends.filter(f => f.status === 'ACCEPTED');
  const incomingRequests = friends.filter(f => f.status === 'PENDING_INCOMING');
  const outgoingRequests = friends.filter(f => f.status === 'PENDING_OUTGOING');

  const filteredFriends = acceptedFriends.filter(f =>
    f.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            width: '100%',
            maxWidth: '440px',
            height: '100%',
            background: 'rgba(8, 14, 33, 0.98)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '-15px 0 50px rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            color: '#FFFFFF'
          }}
        >
          {/* Drawer Header */}
          <div style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} color="#60a5fa" />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: 0 }}>
                NEURAL NETWORK
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.6)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: '#060b1e' }}>
            <button
              onClick={() => { setActiveTab('FRIENDS'); setSelectedFriend(null); }}
              style={{
                flex: 1,
                padding: '0.85rem 0.5rem',
                background: activeTab === 'FRIENDS' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'FRIENDS' ? '2px solid #3b82f6' : '2px solid transparent',
                fontWeight: 700,
                color: activeTab === 'FRIENDS' ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              FRIENDS ({acceptedFriends.length})
            </button>

            <button
              onClick={() => { setActiveTab('REQUESTS'); setSelectedFriend(null); }}
              style={{
                flex: 1,
                padding: '0.85rem 0.5rem',
                background: activeTab === 'REQUESTS' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'REQUESTS' ? '2px solid #3b82f6' : '2px solid transparent',
                fontWeight: 700,
                color: activeTab === 'REQUESTS' ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              REQUESTS {incomingRequests.length > 0 && `(${incomingRequests.length})`}
            </button>

            {selectedFriend && (
              <button
                onClick={() => setActiveTab('CHAT')}
                style={{
                  flex: 1,
                  padding: '0.85rem 0.5rem',
                  background: activeTab === 'CHAT' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'CHAT' ? '2px solid #3b82f6' : '2px solid transparent',
                  fontWeight: 700,
                  color: activeTab === 'CHAT' ? '#38bdf8' : 'rgba(255, 255, 255, 0.45)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                CHAT: @{selectedFriend.username}
              </button>
            )}
          </div>

          {/* TAB 1: FRIENDS LIST */}
          {activeTab === 'FRIENDS' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {/* Search friend */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
                <input
                  type="text"
                  placeholder="Filter nodes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                    borderRadius: '999px',
                    background: '#060b1e',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Friends list */}
              {filteredFriends.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                  <Users size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.825rem', fontFamily: 'var(--font-mono)' }}>No connected peers found. Send requests in the Requests tab!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {filteredFriends.map(friend => {
                    const rank = getRankFromRating(friend.competitiveRating || 500);
                    return (
                      <div
                        key={friend.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1rem',
                          background: 'rgba(10, 18, 42, 0.65)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '1rem',
                          transition: 'border-color 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: '#060b1e',
                              border: '1px solid rgba(59, 130, 246, 0.25)',
                              color: '#60a5fa',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.95rem'
                            }}>
                              {friend.username[0]?.toUpperCase()}
                            </div>
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: '9px',
                              height: '9px',
                              borderRadius: '50%',
                              background: friend.isOnline ? '#22c55e' : 'rgba(255, 255, 255, 0.3)',
                              border: '2px solid #060b1e'
                            }} />
                          </div>

                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#ffffff' }}>
                              @{friend.username}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)' }}>
                              <span>{rank.badge} {rank.name}</span>
                              <span>•</span>
                              <span>{friend.competitiveRating || 500} pts</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            title="Direct Message"
                            onClick={() => {
                              setSelectedFriend(friend);
                              setActiveTab('CHAT');
                            }}
                            style={{
                              padding: '0.45rem',
                              borderRadius: '0.5rem',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              cursor: 'pointer',
                              color: 'rgba(255, 255, 255, 0.7)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <MessageSquare size={14} />
                          </button>

                          {onInviteFriendToGame && (
                            <button
                              title="Invite to Game"
                              onClick={() => onInviteFriendToGame(friend)}
                              style={{
                                padding: '0.45rem 0.75rem',
                                borderRadius: '999px',
                                background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.7rem',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 800,
                                boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
                              }}
                            >
                              <Swords size={12} /> 1V1
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REQUESTS & ADD FRIEND */}
          {activeTab === 'REQUESTS' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {/* Add friend form */}
              <form onSubmit={handleSendRequest} style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.45rem' }}>
                  DISPATCH PEER INVITATION
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter peer handle..."
                    value={addUsername}
                    onChange={e => setAddUsername(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.75rem',
                      background: '#060b1e',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.6rem 1.1rem',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
                    }}
                  >
                    LINK
                  </button>
                </div>
                {addStatus && (
                  <p style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    marginTop: '0.5rem',
                    color: addStatus.type === 'error' ? '#f43f5e' : '#22c55e'
                  }}>
                    {addStatus.msg}
                  </p>
                )}
              </form>

              {/* Incoming requests */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  INCOMING REQUESTS ({incomingRequests.length})
                </h3>
                {incomingRequests.length === 0 ? (
                  <p style={{ fontSize: '0.775rem', color: 'rgba(255, 255, 255, 0.35)', fontFamily: 'var(--font-mono)' }}>No pending requests.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {incomingRequests.map(req => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(10, 18, 42, 0.65)', borderRadius: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>@{req.username}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)' }}>Rating: {req.competitiveRating || 500} pts</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleRespondRequest(req.id, true)}
                            style={{ padding: '0.4rem 0.65rem', borderRadius: '0.5rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', cursor: 'pointer' }}
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleRespondRequest(req.id, false)}
                            style={{ padding: '0.4rem 0.65rem', borderRadius: '0.5rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', cursor: 'pointer' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Outgoing requests */}
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  OUTGOING REQUESTS ({outgoingRequests.length})
                </h3>
                {outgoingRequests.length === 0 ? (
                  <p style={{ fontSize: '0.775rem', color: 'rgba(255, 255, 255, 0.35)', fontFamily: 'var(--font-mono)' }}>No pending transmissions.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {outgoingRequests.map(req => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(10, 18, 42, 0.65)', borderRadius: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>@{req.username}</span>
                        <span style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>PENDING</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRIVATE CHAT */}
          {activeTab === 'CHAT' && selectedFriend && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {chatMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.825rem', fontFamily: 'var(--font-mono)' }}>
                    Neural link initialized with @{selectedFriend.username}. Transmit telemetry.
                  </div>
                ) : (
                  chatMessages.map(msg => {
                    const isMine = msg.senderId !== selectedFriend.userId;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: isMine ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          background: isMine ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          border: isMine ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '0.65rem 0.95rem',
                          borderRadius: isMine ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                          fontSize: '0.825rem',
                          lineHeight: 1.4,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        {msg.content}
                      </div>
                    );
                  })
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat input form */}
              <form onSubmit={handleSendMessage} style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '0.5rem', background: '#060b1e' }}>
                <input
                  type="text"
                  placeholder={`Message @${selectedFriend.username}...`}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.9rem',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.825rem',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 0.9rem',
                    borderRadius: '999px',
                    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
