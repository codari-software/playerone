'use client';

import { CheckCircle2, Circle, Zap, Flame, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: any;
}

export function HabitCard({ habit }: HabitCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/habits/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId: habit.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error ?? 'Falha ao completar missão');
        return;
      }

      const { handleUnlockedAchievements } = await import('@/lib/toast-achievements');
      handleUnlockedAchievements(data?.unlockedAchievements);

      toast.success(`+${habit.xpReward} XP ganhos! ${data?.levelUp ? '🎉 LEVEL UP!' : ''}`);
      router.refresh();
    } catch (error: any) {
      console.error('Complete habit error:', error);
      toast.error('Ocorreu um erro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este hábito?')) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/habits/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId: habit.id }),
      });

      if (!res.ok) {
        toast.error('Falha ao deletar hábito');
        return;
      }

      toast.success('Hábito removido do log');
      router.refresh();
    } catch (error: any) {
      console.error('Delete habit error:', error);
      toast.error('Ocorreu um erro');
    } finally {
      setIsLoading(false);
    }
  };

  const isCompletedToday =
    habit?.isCompleted &&
    habit?.completedAt &&
    new Date(habit.completedAt).toDateString() === new Date().toDateString();

  return (
    <div className={cn(
      "p-[2px] pixel-corners transition-all group",
      isCompletedToday ? "bg-green-500" : "bg-[#333] hover:bg-blue-400"
    )}>
      <div className="pixel-corners bg-[#18181b] p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className={cn(
               "p-1 pixel-corners",
               isCompletedToday ? "bg-green-500" : "bg-[#222]"
             )}>
                {isCompletedToday ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-700" />
                )}
             </div>
             <div>
                <h3 className={cn(
                  "font-press-start text-[10px] sm:text-xs uppercase tracking-wider",
                  isCompletedToday ? "text-green-500" : "text-white"
                )}>
                  {habit?.name}
                </h3>
                {habit?.description && (
                  <p className="text-gray-500 text-xl font-vt323 mt-1">{habit.description}</p>
                )}
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-[1px] pixel-corners bg-[#222]">
              <div className="bg-[#111] px-2 py-1 flex items-center gap-1 font-vt323 text-xl text-blue-400">
                <Zap className="w-4 h-4" />
                +{habit?.xpReward}G
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="text-gray-700 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t-2 border-[#222] pt-4 mt-4">
          <div className="flex items-center gap-6 font-vt323 text-xl">
            <span className="text-gray-600 uppercase tracking-tighter">{habit?.frequency?.toLowerCase?.()}</span>
            <span className="flex items-center gap-1 text-orange-500/80">
              <Flame className="w-4 h-4" />
              STREAK: {habit?.streak ?? 0}
            </span>
          </div>

          {!isCompletedToday && (
            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] active:scale-95 transition-all text-white disabled:opacity-50"
            >
              <div className="pixel-corners bg-[#ff6b6b] px-4 py-2 font-press-start text-[8px] uppercase shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]">
                {isLoading ? 'QUEST...' : 'COMPLETAR'}
              </div>
            </button>
          )}

          {isCompletedToday && (
            <div className="font-press-start text-[8px] text-green-500">QUEST DONE</div>
          )}
        </div>
      </div>
    </div>
  );
}
