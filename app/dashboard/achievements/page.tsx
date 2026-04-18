import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;
  
  if (!userId) {
    redirect('/');
  }

  // Fetch user and all possible achievements in parallel
  const [user, allAchievements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAchievements: {
          include: {
            achievement: true,
          },
        },
      },
    }),
    prisma.achievement.findMany({
      orderBy: { category: 'asc' },
    })
  ]);

  if (!user) {
    redirect('/');
  }


  const unlockedIds = new Set(user.userAchievements?.map?.((ua: any) => ua?.achievementId) ?? []);

  return (
    <div className="space-y-10">
      <div className="animate-in fade-in slide-in-from-left duration-500">
        <h1 className="font-press-start text-white text-2xl mb-4 flex items-center gap-4">
          <Award className="w-8 h-8 text-purple-500" />
          CONQUISTAS & BADGES
        </h1>
        <p className="text-2xl text-gray-400">Desbloqueie insígnias raras e prove que você é o jogador número 1.</p>
      </div>

      <div className="p-[2px] pixel-corners bg-[#333] animate-in fade-in slide-in-from-top duration-700 delay-100">
        <div className="pixel-corners bg-[#18181b] p-8 flex items-center justify-around">
          <div className="text-center">
            <div className="font-press-start text-4xl text-blue-400 mb-2">
              {user.userAchievements?.length ?? 0}
            </div>
            <div className="font-vt323 text-2xl text-gray-600 uppercase">Desbloqueadas</div>
          </div>
          <div className="w-[4px] h-12 bg-[#222] pixel-corners" />
          <div className="text-center">
            <div className="font-press-start text-4xl text-gray-500 mb-2">
              {allAchievements?.length ?? 0}
            </div>
            <div className="font-vt323 text-2xl text-gray-600 uppercase">Total Disponível</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
        {allAchievements?.map?.((achievement: any) => {
          const isUnlocked = unlockedIds.has(achievement?.id);
          
          return (
            <div
              key={achievement?.id}
              className={cn(
                "p-[2px] pixel-corners transition-all group",
                isUnlocked 
                  ? "bg-[#ff6b6b]/40 hover:bg-[#ff6b6b]" 
                  : "bg-[#222]"
              )}
            >
              <div className={cn(
                "pixel-corners h-full bg-[#18181b] p-6 flex flex-col justify-between",
                !isUnlocked && "opacity-60 grayscale"
              )}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{achievement?.icon}</div>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-700" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className={cn(
                      "font-press-start text-[10px] uppercase mb-2",
                      isUnlocked ? "text-white" : "text-gray-600"
                    )}>
                      {achievement?.name}
                    </h3>
                    <p className={cn(
                      "font-vt323 text-xl leading-snug",
                      isUnlocked ? "text-gray-400" : "text-gray-700"
                    )}>
                      {achievement?.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t-2 border-[#222] pt-4">
                  <span className="font-vt323 text-lg text-gray-600 uppercase tracking-widest leading-none">
                    {achievement?.category}
                  </span>
                  <div className="bg-[#111] px-2 py-1 pixel-corners whitespace-nowrap">
                    <span className={cn(
                      "font-press-start text-[8px]",
                      isUnlocked ? "text-yellow-400" : "text-gray-800"
                    )}>
                      +{achievement?.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }) ?? []}
      </div>
    </div>
  );
}
