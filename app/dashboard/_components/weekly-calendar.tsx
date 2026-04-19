'use client';

import { cn } from '@/lib/utils';

export function WeeklyCalendar() {
  const days = [
    { name: 'SEG', num: 5, progress: '3/5', status: 'partial' },
    { name: 'TER', num: 6, progress: '5/5', status: 'full' },
    { name: 'QUA', num: 7, progress: '0/5', status: 'none' },
    { name: 'QUI', num: 8, progress: '0/5', status: 'none' },
    { name: 'SEX', num: 9, progress: '0/5', status: 'none' },
    { name: 'SÁB', num: 10, progress: '0/5', status: 'none' },
    { name: 'DOM', num: 11, progress: '0/5', status: 'none' },
  ];

  return (
    <div className="flex justify-between items-center gap-4 py-6 overflow-x-auto no-scrollbar">
      {days.map((day, i) => (
        <div key={i} className="flex flex-col items-center gap-2 min-w-[70px]">
          <span className="font-press-start text-[8px] text-gray-500 uppercase">{day.name}</span>
          <div className={cn(
            "w-12 h-12 pixel-corners flex flex-col items-center justify-center transition-all border-2",
            day.status === 'full' ? "bg-green-500/20 border-green-500 text-green-500" :
            day.status === 'partial' ? "bg-orange-500/20 border-orange-500 text-orange-500" :
            "bg-[#111] border-[#222] text-gray-700"
          )}>
            <span className="font-press-start text-xs">{day.num}</span>
            <span className="font-vt323 text-[10px] opacity-70">{day.progress}</span>
          </div>
          {day.status === 'full' && (
            <div className="w-1.5 h-1.5 bg-green-500 pixel-corners animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
}
