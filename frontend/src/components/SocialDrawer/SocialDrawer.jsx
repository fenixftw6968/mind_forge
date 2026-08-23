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
      setAddStatus({ type: 'loading', msg: 'Sending request...' });
      await api.post('/api/friends/request', { username: addUsername.trim() });
      setAddStatus({ type: 'success', msg: `Friend request sent to @${addUsername}!` });
      setAddUsername('');
      fetchFriends();
    } catch (e) {
      const msg = e.response?.data?.message || 'User not found or already added';
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
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
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
            maxWidth: '420px',
            height: '100%',
            background: '#FFFFFF',
            boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Drawer Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#4F46E5" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-display)', margin: 0 }}>
                Social & Friends
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <button
              onClick={() => { setActiveTab('FRIENDS'); setSelectedFriend(null); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: activeTab === 'FRIENDS' ? '#FFFFFF' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'FRIENDS' ? '2px solid #4F46E5' : '2px solid transparent',
                fontWeight: activeTab === 'FRIENDS' ? 700 : 500,
                color: activeTab === 'FRIENDS' ? '#4F46E5' : '#64748B',
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              Friends ({acceptedFriends.length})
            </button>

            <button
              onClick={() => { setActiveTab('REQUESTS'); setSelectedFriend(null); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: activeTab === 'REQUESTS' ? '#FFFFFF' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'REQUESTS' ? '2px solid #4F46E5' : '2px solid transparent',
                fontWeight: activeTab === 'REQUESTS' ? 700 : 500,
                color: activeTab === 'REQUESTS' ? '#4F46E5' : '#64748B',
                fontSize: '0.825rem',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              Requests {incomingRequests.length > 0 && `(${incomingRequests.length})`}
            </button>

            {selectedFriend && (
              <button
                onClick={() => setActiveTab('CHAT')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: activeTab === 'CHAT' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'CHAT' ? '2px solid #4F46E5' : '2px solid transparent',
                  fontWeight: activeTab === 'CHAT' ? 700 : 500,
                  color: activeTab === 'CHAT' ? '#4F46E5' : '#64748B',
                  fontSize: '0.825rem',
                  cursor: 'pointer'
                }}
              >
                Chat: {selectedFriend.username}
              </button>
            )}
          </div>

          {/* TAB 1: FRIENDS LIST */}
          {activeTab === 'FRIENDS' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {/* Search friend */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search your friends..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                    borderRadius: '0.625rem',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.825rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Friends list */}
              {filteredFriends.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94A3B8' }}>
                  <Users size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
                  <p style={{ fontSize: '0.875rem' }}>No friends yet. Add a friend by username in the Requests tab!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredFriends.map(friend => {
                    const rank = getRankFromRating(friend.competitiveRating || 500);
                    return (
                      <div
                        key={friend.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem',
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '0.875rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '1rem'
                            }}>
                              {friend.username[0]?.toUpperCase()}
                            </div>
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: friend.isOnline ? '#10B981' : '#94A3B8',
                              border: '2px solid white'
                            }} />
                          </div>

                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
                              {friend.username}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748B' }}>
                              <span>{rank.badge} {rank.name}</span>
                              <span>•</span>
                              <span>{friend.competitiveRating || 500} pts</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            title="Direct Message"
                            onClick={() => {
                              setSelectedFriend(friend);
                              setActiveTab('CHAT');
                            }}
                            style={{
                              padding: '0.45rem',
                              borderRadius: '0.5rem',
                              background: '#F1F5F9',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#475569'
                            }}
                          >
                            <MessageSquare size={16} />
                          </button>

                          {onInviteFriendToGame && (
                            <button
                              title="Invite to Game"
                              onClick={() => onInviteFriendToGame(friend)}
                              style={{
                                padding: '0.45rem 0.65rem',
                                borderRadius: '0.5rem',
                                background: '#EEF2FF',
                                border: '1px solid #C7D2FE',
                                cursor: 'pointer',
                                color: '#4F46E5',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}
                            >
                              <Swords size={14} /> Invite
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
              <form onSubmit={handleSendRequest} style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Send Friend Request
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter username (e.g. AlexSolver)"
                    value={addUsername}
                    onChange={e => setAddUsername(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.75rem',
                      borderRadius: '0.625rem',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '0.625rem',
                      background: '#4F46E5',
                      color: 'white',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.825rem',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
                {addStatus && (
                  <p style={{
                    fontSize: '0.775rem',
                    marginTop: '0.4rem',
                    color: addStatus.type === 'error' ? '#E11D48' : '#059669'
                  }}>
                    {addStatus.msg}
                  </p>
                )}
              </form>

              {/* Incoming requests */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Incoming Requests ({incomingRequests.length})
                </h3>
                {incomingRequests.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>No pending requests.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {incomingRequests.map(req => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>{req.username}</div>
                          <div style={{ fontSize: '0.725rem', color: '#64748B' }}>Rating: {req.competitiveRating || 500} pts</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleRespondRequest(req.id, true)}
                            style={{ padding: '0.4rem 0.6rem', borderRadius: '0.5rem', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', cursor: 'pointer' }}
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => handleRespondRequest(req.id, false)}
                            style={{ padding: '0.4rem 0.6rem', borderRadius: '0.5rem', background: '#FFF1F2', border: '1px solid #FECDD3', color: '#E11D48', cursor: 'pointer' }}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Outgoing requests */}
              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Outgoing Requests ({outgoingRequests.length})
                </h3>
                {outgoingRequests.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>No outgoing requests sent.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {outgoingRequests.map(req => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>@{req.username}</span>
                        <span style={{ fontSize: '0.725rem', color: '#64748B', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Pending</span>
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
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {chatMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                    No messages yet with @{selectedFriend.username}. Say hello! 👋
                  </div>
                ) : (
                  chatMessages.map(msg => {
                    const isMine = msg.senderId !== selectedFriend.userId;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: isMine ? 'flex-end' : 'flex-start',
                          maxWidth: '78%',
                          background: isMine ? '#4F46E5' : '#F1F5F9',
                          color: isMine ? '#FFFFFF' : '#0F172A',
                          padding: '0.65rem 0.9rem',
                          borderRadius: isMine ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                          fontSize: '0.85rem',
                          lineHeight: 1.4,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
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
              <form onSubmit={handleSendMessage} style={{ padding: '0.75rem 1rem', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.5rem', background: '#FFFFFF' }}>
                <input
                  type="text"
                  placeholder={`Message @${selectedFriend.username}...`}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: '0.75rem',
                    background: '#4F46E5',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
