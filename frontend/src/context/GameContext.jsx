import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [xpPopups, setXpPopups]     = useState([]);
  const [coinPopups, setCoinPopups] = useState([]);
  const [activeGame, setActiveGame] = useState(null);

  const showXPPopup = useCallback((amount) => {
    const id = Date.now();
    setXpPopups(prev => [...prev, { id, amount }]);
    setTimeout(() => {
      setXpPopups(prev => prev.filter(p => p.id !== id));
    }, 1600);
  }, []);

  const showCoinPopup = useCallback((amount) => {
    const id = Date.now();
    setCoinPopups(prev => [...prev, { id, amount }]);
    setTimeout(() => {
      setCoinPopups(prev => prev.filter(p => p.id !== id));
    }, 1600);
  }, []);

  return (
    <GameContext.Provider value={{
      xpPopups,
      coinPopups,
      activeGame,
      setActiveGame,
      showXPPopup,
      showCoinPopup,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
