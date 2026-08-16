import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Games from './pages/Games/Games';
import Profile from './pages/Profile/Profile';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import DailyChallenge from './pages/DailyChallenge/DailyChallenge';

// Game pages
import NumberDetective from './pages/Games/NumberDetective';
import WhoIsLying from './pages/Games/WhoIsLying';
import PatternDetective from './pages/Games/PatternDetective';
import SolveCrime from './pages/Games/SolveCrime';
import SpotFallacy from './pages/Games/SpotFallacy';
import MemoryChallenge from './pages/Games/MemoryChallenge';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/"       element={<Home />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected */}
            <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/games"           element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/leaderboard"     element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/daily-challenge" element={<ProtectedRoute><DailyChallenge /></ProtectedRoute>} />

            {/* Game routes */}
            <Route path="/games/number-detective"  element={<ProtectedRoute><NumberDetective /></ProtectedRoute>} />
            <Route path="/games/who-is-lying"      element={<ProtectedRoute><WhoIsLying /></ProtectedRoute>} />
            <Route path="/games/pattern-detective" element={<ProtectedRoute><PatternDetective /></ProtectedRoute>} />
            <Route path="/games/solve-crime"       element={<ProtectedRoute><SolveCrime /></ProtectedRoute>} />
            <Route path="/games/spot-fallacy"      element={<ProtectedRoute><SpotFallacy /></ProtectedRoute>} />
            <Route path="/games/memory-challenge"  element={<ProtectedRoute><MemoryChallenge /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
