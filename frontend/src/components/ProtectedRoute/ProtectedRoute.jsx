import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', position: 'relative', overflow: 'hidden' }}>
        <div className="star-field" />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.1)', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.25rem', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }} />
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.08em' }}>SYNCHRONIZING ALGOARENA...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
