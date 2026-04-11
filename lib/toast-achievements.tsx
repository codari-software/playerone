import toast from 'react-hot-toast';
import { Trophy } from 'lucide-react';

export function showAchievementToast(achievement: { name: string; icon: string; xpReward: number }) {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-[#111] border-4 border-yellow-500 p-4 pixel-corners pointer-events-auto flex items-center shadow-[8px_8px_0px_rgba(0,0,0,0.5)]`}
    >
      <div className="flex-shrink-0 pt-0.5">
        <div className="p-3 bg-yellow-500/20 pixel-corners border-2 border-yellow-500/40">
           <Trophy className="h-8 w-8 text-yellow-500" />
        </div>
      </div>
      <div className="ml-4 flex-1">
        <p className="font-press-start text-[10px] text-yellow-500 uppercase mb-1">
          CONQUISTA DESBLOQUEADA!
        </p>
        <p className="font-press-start text-xs text-white uppercase mb-2">
          {achievement.name}
        </p>
        <div className="flex items-center gap-2">
           <div className="bg-blue-500/10 px-2 py-1 pixel-corners border border-blue-500/20">
              <span className="font-press-start text-[8px] text-blue-400">+{achievement.xpReward} XP</span>
           </div>
        </div>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="ml-4 font-press-start text-[10px] text-gray-600 hover:text-white"
      >
        [X]
      </button>
    </div>
  ), { duration: 5000 });
}

export function handleUnlockedAchievements(unlocked: any[]) {
  if (!unlocked || unlocked.length === 0) return;
  
  unlocked.forEach((achievement, index) => {
    setTimeout(() => {
      showAchievementToast(achievement);
    }, index * 1000); // Espaçar se houver várias
  });
}
