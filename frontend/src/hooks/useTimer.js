import { useState, useEffect, useRef } from 'react';

export function useTimer(initialSeconds, { autoStart = false, onComplete } = {}) {
  const [timeLeft, setTimeLeft]   = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isDone, setIsDone]       = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsDone(true);
            onComplete?.();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onComplete]);

  const start  = () => { setIsRunning(true); setIsDone(false); };
  const pause  = () => setIsRunning(false);
  const reset  = (secs = initialSeconds) => {
    clearInterval(intervalRef.current);
    setTimeLeft(secs);
    setIsRunning(false);
    setIsDone(false);
  };

  const urgency = timeLeft <= 10 ? 'critical' : timeLeft <= 30 ? 'warning' : 'normal';
  const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  return { timeLeft, isRunning, isDone, urgency, formattedTime, start, pause, reset };
}
