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
        background: 'rgba(10, 10, 10, 0.75)',
        backdropFilter: 'blur(6px)',
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
            background: '#1C1C1C',
            borderLeft: '1px solid #2E2E2E',
            boxShadow: '-8px 0 35px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            color: '#F8FAFC'
          }}
        >
          {/* Drawer Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #2E2E2E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#22C55E" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-display)', margin: 0 }}>
                Community & Friends
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#242424',
                border: '1px solid #2E2E2E',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94A3B8'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #2E2E2E', background: '#181818' }}>
            <button
              onClick={() => { setActiveTab('FRIENDS'); setSelectedFriend(null); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: activeTab === 'FRIENDS' ? '#1C1C1C' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'FRIENDS' ? '2px solid #22C55E' : '2px solid transparent',
                fontWeight: activeTab === 'FRIENDS' ? 700 : 500,
                color: activeTab === 'FRIENDS' ? '#4ADE80' : '#94A3B8',
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
                background: activeTab === 'REQUESTS' ? '#1C1C1C' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'REQUESTS' ? '2px solid #22C55E' : '2px solid transparent',
                fontWeight: activeTab === 'REQUESTS' ? 700 : 500,
                color: activeTab === 'REQUESTS' ? '#4ADE80' : '#94A3B8',
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
                  background: activeTab === 'CHAT' ? '#1C1C1C' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'CHAT' ? '2px solid #22C55E' : '2px solid transparent',
                  fontWeight: activeTab === 'CHAT' ? 700 : 500,
                  color: activeTab === 'CHAT' ? '#4ADE80' : '#94A3B8',
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
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="Search your friends..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                    borderRadius: '0.625rem',
                    background: '#151515',
                    border: '1px solid #2E2E2E',
                    fontSize: '0.825rem',
                    color: '#F8FAFC',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Friends list */}
              {filteredFriends.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B' }}>
                  <Users size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
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
                          background: '#242424',
                          border: '1px solid #2E2E2E',
                          borderRadius: '0.875rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: '#1C1C1C',
                              border: '1px solid #333333',
                              color: '#4ADE80',
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
                              background: friend.isOnline ? '#22C55E' : '#64748B',
                              border: '2px solid #242424'
                            }} />
                          </div>

                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F8FAFC' }}>
                              {friend.username}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#94A3B8' }}>
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
                              background: '#1C1C1C',
                              border: '1px solid #2E2E2E',
                              cursor: 'pointer',
                              color: '#CBD5E1'
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
                                background: 'rgba(34, 197, 94, 0.12)',
                                border: '1px solid rgba(34, 197, 94, 0.25)',
                                cursor: 'pointer',
                                color: '#4ADE80',
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.35rem' }}>
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
                      background: '#151515',
                      border: '1px solid #2E2E2E',
                      fontSize: '0.85rem',
                      color: '#F8FAFC',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      padding: '0.55rem 1rem',
                      fontSize: '0.825rem'
                    }}
                  >
                    Add
                  </button>
                </div>
                {addStatus && (
                  <p style={{
                    fontSize: '0.775rem',
                    marginTop: '0.4rem',
                    color: addStatus.type === 'error' ? '#FB7185' : '#4ADE80'
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
                  <p style={{ fontSize: '0.8rem', color: '#64748B' }}>No pending requests.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {incomingRequests.map(req => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#242424', borderRadius: '0.75rem', border: '1px solid #2E2E2E' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F8FAFC' }}>{req.username}</div>
                          <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>Rating: {req.competitiveRating || 500} pts</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleRespondRequest(req.id, true)}
                            style={{ padding: '0.4rem 0.6rem', borderRadius: '0.5rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ADE80', cursor: 'pointer' }}
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => handleRespondRequest(req.id, false)}
                            style={{ padding: '0.4rem 0.6rem', borderRadius: '0.5rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#FB7185', cursor: 'pointer' }}
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
                  <p style={{ fontSize: '0.8rem', color: '#64748B' }}>No outgoing requests sent.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {outgoingRequests.map(req => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#242424', borderRadius: '0.75rem', border: '1px solid #2E2E2E' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#CBD5E1' }}>@{req.username}</span>
                        <span style={{ fontSize: '0.725rem', color: '#94A3B8', background: '#1C1C1C', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Pending</span>
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
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B', fontSize: '0.85rem' }}>
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
                          background: isMine ? '#22C55E' : '#242424',
                          color: isMine ? '#05200C' : '#F8FAFC',
                          border: isMine ? 'none' : '1px solid #2E2E2E',
                          padding: '0.65rem 0.9rem',
                          borderRadius: isMine ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                          fontSize: '0.85rem',
                          lineHeight: 1.4,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
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
              <form onSubmit={handleSendMessage} style={{ padding: '0.75rem 1rem', borderTop: '1px solid #2E2E2E', display: 'flex', gap: '0.5rem', background: '#1C1C1C' }}>
                <input
                  type="text"
                  placeholder={`Message @${selectedFriend.username}...`}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    borderRadius: '0.75rem',
                    background: '#151515',
                    border: '1px solid #2E2E2E',
                    fontSize: '0.85rem',
                    color: '#F8FAFC',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: '0.75rem'
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
