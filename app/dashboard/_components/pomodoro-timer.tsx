'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      toast.success(isBreak ? 'Fim do descanso! Hora de farmar XP.' : 'Foco total! Você ganhou +30 XP.');
      setIsActive(false);
      // Reset logic
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = (forcedBreak?: boolean) => {
    setIsActive(false);
    const useBreak = forcedBreak !== undefined ? forcedBreak : isBreak;
    setTimeLeft(useBreak ? 5 * 60 : 25 * 60);
  };

  const progress = (timeLeft / (isBreak ? 5 * 60 : 25 * 60)) * 100;

  return (
    <div className="p-8 pixel-corners bg-[#18181b] flex flex-col items-center justify-center space-y-8 relative overflow-hidden h-full min-h-[400px]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b6b] to-transparent opacity-50" />
      
      <div className="text-center">
        <h3 className="font-press-start text-white text-lg mb-2">POMODORO</h3>
        <p className="font-vt323 text-2xl text-gray-400 uppercase tracking-widest">{isActive ? 'EM FOCO!' : 'REQUISITAR QUEST DE FOCO'}</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Progress Circle (SVG) */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#222"
            strokeWidth="8"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke={isBreak ? '#3b82f6' : '#ff6b6b'}
            strokeWidth="8"
            strokeDasharray={754}
            strokeDashoffset={754 * (1 - progress / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>

        <div className="flex flex-col items-center">
          <span className="font-vt323 text-7xl text-white tracking-widest tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-[#ff6b6b]/20 border border-[#ff6b6b]/40 pixel-corners">
            <Flame className="w-3 h-3 text-[#ff6b6b]" />
            <span className="font-press-start text-[8px] text-[#ff6b6b]">+30 XP</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <button
          onClick={toggleTimer}
          className={cn(
            "flex-1 py-4 font-press-start text-xs pixel-corners transition-all flex items-center justify-center gap-2",
            isActive ? "bg-[#333] text-white" : "bg-green-600 text-white hover:bg-green-500"
          )}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isActive ? 'PAUSAR' : 'INICIAR'}
        </button>
        <button
          onClick={() => resetTimer()}
          className="p-4 bg-[#222] text-gray-500 hover:text-white pixel-corners transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => { setIsBreak(false); resetTimer(false); }}
          className={cn("px-4 py-1.5 font-press-start text-[8px] pixel-corners", !isBreak ? "bg-red-500 text-white" : "bg-[#222] text-gray-500")}
        >
          FOCO
        </button>
        <button 
          onClick={() => { setIsBreak(true); resetTimer(true); }}
          className={cn("px-4 py-1.5 font-press-start text-[8px] pixel-corners", isBreak ? "bg-blue-500 text-white" : "bg-[#222] text-gray-500")}
        >
          DESCANSO
        </button>
      </div>
    </div>
  );
}
