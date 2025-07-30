import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface StopwatchTimerProps {
  className?: string;
}

const StopwatchTimer: React.FC<StopwatchTimerProps> = ({ className = '' }) => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedTime = Cookies.get('stopwatch_time');
    const savedIsRunning = Cookies.get('stopwatch_running');
    const savedStartTime = Cookies.get('stopwatch_start_time');
    
    if (savedTime) {
      const parsedTime = parseInt(savedTime);
      setTime(parsedTime);
    }
    
    if (savedIsRunning === 'true' && savedStartTime) {
      const startTime = parseInt(savedStartTime);
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      
      setTime(elapsedTime);
      setIsRunning(true);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const startTime = parseInt(Cookies.get('stopwatch_start_time') || '0');
        if (startTime) {
          const currentTime = Date.now();
          const elapsedTime = Math.floor((currentTime - startTime) / 1000);
          setTime(elapsedTime);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    Cookies.set('stopwatch_time', time.toString(), { expires: 7 });
    Cookies.set('stopwatch_running', isRunning.toString(), { expires: 7 });
  }, [time, isRunning]);

  const handleStart = (): void => {
    const startTime = Date.now() - (time * 1000);
    Cookies.set('stopwatch_start_time', startTime.toString(), { expires: 7 });
    setIsRunning(true);
  };

  const handlePause = (): void => {
    setIsRunning(false);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setTime(0);
    
    Cookies.remove('stopwatch_time');
    Cookies.remove('stopwatch_running');
    Cookies.remove('stopwatch_start_time');
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`group flex items-center  bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700/50 font-mono text-sm transition-all hover:bg-gray-800/80 ${className}`}>
      <div className="flex items-center gap-2 text-white font-medium">
        {/* <span className="text-sm opacity-70">⏱️</span> */}
        <span className="tracking-wider font-mono text-sm min-w-[45px] pl-2">
          {formatTime(time)}
        </span>
      </div>
      
      <div className="flex items-center ml-2 gap-1  transition-opacity duration-200">
        <button 
          className="p-1 hover:bg-gray-700/50 rounded transition-colors"
          onClick={isRunning ? handlePause : handleStart}
          title={isRunning ? 'Pause' : (time > 0 ? 'Resume' : 'Start')}
        >
          {isRunning ? (
            <Pause size={14} className="text-red-400" />
          ) : (
            <Play size={14} className="text-emerald-400" />
          )}
        </button>
        
        <button 
          className="p-1 hover:bg-gray-700/50 rounded transition-colors"
          onClick={handleReset}
          title="Reset"
        >
          <RotateCcw size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default StopwatchTimer;
