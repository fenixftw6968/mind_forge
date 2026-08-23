import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '3px solid #E2E8F0', borderTopColor: '#4F46E5', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p className="font-display" style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 600 }}>Loading MindForge...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
