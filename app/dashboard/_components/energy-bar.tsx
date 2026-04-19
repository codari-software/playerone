'use client';

import { Zap } from 'lucide-react';

export function EnergyBar({ current, max }: { current: number, max: number }) {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center font-press-start text-[10px]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-gray-400">ENERGIA</span>
        </div>
        <span className={percentage < 20 ? 'text-red-500 animate-bounce' : 'text-blue-400'}>
          {current} / {max}
        </span>
      </div>
      
      <div className="h-4 w-full bg-[#111] pixel-corners p-[2px] relative overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 pixel-corners transition-all duration-1000 relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_50%,transparent_50%)] bg-[length:100%_4px]" />
          
          {/* Pulsing tip */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white blur-[2px] shadow-[0_0_10px_#fff]" />
        </div>
      </div>
    </div>
  );
}
