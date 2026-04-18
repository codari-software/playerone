import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const currentUserId = (session?.user as any)?.id || guestId;
  
  const topPlayers = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    take: 100,
    select: {
      id: true,
      name: true,
      nickname: true,
      xp: true,
      level: true,
      currentStreak: true,
    },
  });


  return (
    <div className="space-y-10">
      <div className="animate-in fade-in slide-in-from-left duration-500">
        <h1 className="font-press-start text-white text-2xl mb-4 flex items-center gap-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          RANKING GLOBAL
        </h1>
        <p className="text-2xl text-gray-400">Compita com jogadores de todo o mundo pelo topo do servidor.</p>
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
        {topPlayers?.map?.((player: any, index: number) => {
          const isCurrentUser = player?.id === currentUserId;
          const isTopThree = index < 3;
          
          return (
            <div
              key={player?.id ?? index}
              className={cn(
                "p-[2px] pixel-corners transition-all",
                isCurrentUser ? "bg-[#ff6b6b] scale-[1.02] shadow-[0_0_20px_rgba(255,107,107,0.2)]" : "bg-[#333] hover:bg-[#444]"
              )}
            >
              <div className={cn(
                "pixel-corners p-4 sm:p-6 flex items-center gap-6",
                isCurrentUser ? "bg-[#18181b]" : "bg-[#111]"
              )}>
                {/* Rank Number / Trophy */}
                <div className="w-16 flex justify-center items-center">
                  {index === 0 && <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />}
                  {index === 1 && <Trophy className="w-7 h-7 text-gray-400" />}
                  {index === 2 && <Trophy className="w-6 h-6 text-orange-600" />}
                  {index > 2 && (
                    <span className="font-press-start text-sm text-gray-600">#{index + 1}</span>
                  )}
                </div>
                
                {/* Player Info */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "font-press-start text-xs sm:text-sm uppercase whitespace-nowrap",
                      isCurrentUser ? "text-[#ff6b6b]" : "text-white"
                    )}>
                      {player?.nickname || player?.name || "Player Unknown"}
                    </span>
                    {isCurrentUser && (
                      <span className="font-press-start text-[8px] bg-[#ff6b6b]/20 text-[#ff6b6b] px-2 py-1 pixel-corners uppercase">
                        VOCÊ
                      </span>
                    )}
                  </div>
                  <div className="font-vt323 text-xl text-gray-500 flex items-center gap-4">
                     <span className="bg-[#222] px-2 pixel-corners">LEVEL {player?.level}</span>
                     <span className="flex items-center gap-1 text-orange-500/80">
                        🔥 {player?.currentStreak} DAY STREAK
                     </span>
                  </div>
                </div>
                
                {/* XP Score */}
                <div className="text-right">
                  <div className={cn(
                    "font-press-start text-sm sm:text-base",
                    isTopThree ? "text-yellow-400" : "text-blue-400"
                  )}>
                    {player?.xp ?? 0}
                  </div>
                  <div className="font-press-start text-[8px] text-gray-700 mt-1">XP TOTAL</div>
                </div>
              </div>
            </div>
          );
        }) ?? []}
      </div>
    </div>
  );
}
