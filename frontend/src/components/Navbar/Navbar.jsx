import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const links = isAuthenticated
    ? [{ to: '/dashboard', label: 'Dashboard' }, { to: '/games', label: 'Games' }, { to: '/daily-challenge', label: 'Challenges' }, { to: '/leaderboard', label: 'Progress' }, { to: '/profile', label: 'Profile' }]
    : [{ to: '/', label: 'Home' }, { to: '/games', label: 'Product' }, { to: '/leaderboard', label: 'Case Studies' }, { to: '/signup', label: 'Contact' }];

  if (location.pathname === '/') return null;
  return (
    <header className="site-nav">
      <Link className="brand-mark" to={isAuthenticated ? '/dashboard' : '/'} aria-label="MindForge home"><img src="/assets/logo.webp" alt="" width="52" height="52" /></Link>
      <nav className="nav-pill">{links.map(link => <Link className={location.pathname === link.to ? 'active' : ''} key={link.to} to={link.to}>{link.label}</Link>)}</nav>
      {isAuthenticated ? <div className="nav-user"><span>{user?.username}</span><button onClick={() => { logout(); navigate('/'); }}>Sign out</button></div> : <Link className="sign-in" to="/login">Sign in</Link>}
    </header>
  );
}
