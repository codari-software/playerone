'use client';

import { Zap, Flame, Trophy, Crown } from 'lucide-react';
import { getLevelTitle } from '@/lib/xp-system';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  user: any;
  xpProgress: any;
  currentLevel: number;
}

export function PlayerCard({ user, xpProgress, currentLevel }: PlayerCardProps) {
  const title = getLevelTitle(currentLevel);

  return (
    <div className="p-[2px] pixel-corners bg-[#333]">
      <div className="pixel-corners bg-[#18181b] p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <Crown className="w-8 h-8 text-[#ff6b6b]" />
          <h2 className="font-press-start text-white text-lg tracking-wider">STATUS DO PERSONAGEM</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="flex items-end gap-6 border-b-2 border-[#222] pb-6">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xl mb-1 uppercase tracking-tighter">Level</span>
                <span className="font-press-start text-5xl text-[#ff6b6b] leading-none">{currentLevel}</span>
              </div>
              <div className="flex-1">
                <p className="font-press-start text-[#ff6b6b] text-base mb-1 uppercase">{title}</p>
                <div className="h-4 w-full bg-[#111] pixel-corners overflow-hidden relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#ff6b6b] transition-all duration-1000"
                    style={{ width: `${xpProgress?.progressPercentage ?? 0}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 font-vt323 text-xl">
                  <span className="text-gray-400">XP {user?.xp ?? 0}</span>
                  <span className="text-gray-500">Próximo: {xpProgress?.xpForNextLevel ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-2xl">
              <Zap className="w-6 h-6 text-blue-500" />
              <span>{xpProgress?.xpNeeded ?? 0} XP necessários para o Level {xpProgress?.nextLevel ?? 0}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-[2px] pixel-corners bg-[#333] hover:bg-orange-500 transition-colors">
              <div className="pixel-corners bg-[#111] p-6 flex flex-col items-center">
                <Flame className="w-10 h-10 text-orange-500 mb-4" />
                <div className="font-press-start text-3xl text-white mb-2">{user?.currentStreak ?? 0}</div>
                <div className="text-gray-500 text-xl uppercase text-center">Ofensiva Atual</div>
              </div>
            </div>

            <div className="p-[2px] pixel-corners bg-[#333] hover:bg-[#ff6b6b] transition-colors">
              <div className="pixel-corners bg-[#111] p-6 flex flex-col items-center">
                <Trophy className="w-10 h-10 text-[#ff6b6b] mb-4" />
                <div className="font-press-start text-3xl text-white mb-2">{user?.userAchievements?.length ?? 0}</div>
                <div className="text-gray-500 text-xl uppercase text-center">Conquistas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
