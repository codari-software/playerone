'use client';

import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LeaderboardWidgetProps {
  topPlayers: any[];
  currentUserId: string;
}

export function LeaderboardWidget({ topPlayers, currentUserId }: LeaderboardWidgetProps) {
  return (
    <div className="p-[2px] pixel-corners bg-[#333]">
      <div className="pixel-corners bg-[#18181b] p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="font-press-start text-white text-lg tracking-wider uppercase">Ranking Global</h2>
        </div>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {topPlayers?.map?.((player: any, index: number) => (
            <motion.div
              key={player?.id ?? index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className={cn(
                "p-[2px] pixel-corners transition-all",
                player?.id === currentUserId ? "bg-[#ff6b6b]" : "bg-[#222]"
              )}>
                <div className={cn(
                  "pixel-corners px-4 py-3 flex items-center justify-between",
                  player?.id === currentUserId ? "bg-[#ff6b6b] text-white" : "bg-[#111] text-gray-400 group-hover:bg-[#18181b]"
                )}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center font-press-start text-xs sm:text-sm">
                      {index === 0 && <span className="text-yellow-400">#1</span>}
                      {index === 1 && <span className="text-gray-300">#2</span>}
                      {index === 2 && <span className="text-orange-500">#3</span>}
                      {index > 2 && <span>{index + 1}</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn(
                        "font-press-start text-[10px] sm:text-xs uppercase",
                        player?.id === currentUserId ? "text-white" : "text-gray-300 group-hover:text-white"
                      )}>
                        {player?.name}
                      </span>
                      <span className="text-xl">LVL {player?.level}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "font-press-start text-[10px]",
                    player?.id === currentUserId ? "text-white" : "text-[#ff6b6b]"
                  )}>
                    {player?.xp ?? 0}G
                  </div>
                </div>
              </div>
            </motion.div>
          )) ?? []}
        </div>
      </div>
    </div>
  );
}
