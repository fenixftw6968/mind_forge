import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import GuestRoute from './components/GuestRoute/GuestRoute';

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
import MemoryChallenge from './pages/Games/MemoryChallenge';
import CodeBreaker from './pages/Games/CodeBreaker';
import ReactionRush from './pages/Games/ReactionRush';
import GridPuzzle from './pages/Games/GridPuzzle';
import SpeedMatch from './pages/Games/SpeedMatch';

import { runDataMigration } from './utils/dataMigration';

// Run backward compatibility migration
runDataMigration();

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/"       element={<Home />} />
            <Route path="/login"  element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

            {/* Protected */}
            <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/games"           element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/leaderboard"     element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/daily-challenge" element={<ProtectedRoute><DailyChallenge /></ProtectedRoute>} />

            {/* Game routes */}
            <Route path="/games/number-detective"  element={<ProtectedRoute><NumberDetective /></ProtectedRoute>} />
            <Route path="/games/memory-challenge"  element={<ProtectedRoute><MemoryChallenge /></ProtectedRoute>} />
            <Route path="/games/code-breaker"      element={<ProtectedRoute><CodeBreaker /></ProtectedRoute>} />
            <Route path="/games/reaction-rush"     element={<ProtectedRoute><ReactionRush /></ProtectedRoute>} />
            <Route path="/games/grid-puzzle"       element={<ProtectedRoute><GridPuzzle /></ProtectedRoute>} />
            <Route path="/games/speed-match"       element={<ProtectedRoute><SpeedMatch /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
