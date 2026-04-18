import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Target, Flame, Lock } from 'lucide-react';
import Link from 'next/link';
import { CreateHabitButton } from './_components/create-habit-button';
import { HabitList } from './_components/habit-list';

import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function HabitsPage() {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;
  
  if (!userId) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      habits: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    redirect('/');
  }


  // Check if user can access this module
  const canAccess = user.plan === 'HERO' || user.plan === 'LEGEND' || user.isGuest || user.activeModule === 'HABITS';

  if (!canAccess && user.plan === 'INICIANTE') {
    return (
      <div className="text-center py-20 px-4">
        <div className="p-[2px] pixel-corners bg-[#333] inline-block mb-6">
          <div className="pixel-corners bg-[#18181b] p-6">
            <Lock className="w-16 h-16 text-gray-700 mx-auto" />
          </div>
        </div>
        <h2 className="font-press-start text-white text-xl mb-4">MÓDULO BLOQUEADO</h2>
        <p className="text-2xl text-gray-500 mb-10 max-w-lg mx-auto">
          Usuários do plano Free podem acessar apenas um módulo por vez. Suba de nível para desbloquear tudo!
        </p>
        <Link href="/dashboard/profile#upgrade">
          <div className="p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] transition-colors inline-block">
            <div className="pixel-corners bg-[#ff6b6b] text-white px-8 py-4 font-press-start text-sm shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]">
              FAZER UPGRADE AGORA
            </div>
          </div>
        </Link>
      </div>
    );
  }

  const completedToday = user.habits?.filter?.(
    (h: any) =>
      h?.isCompleted &&
      h?.completedAt &&
      new Date(h.completedAt).toDateString() === new Date().toDateString()
  )?.length ?? 0;

  const totalHabits = user.habits?.length ?? 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="font-press-start text-white text-2xl mb-4 flex items-center gap-4">
            <Target className="w-8 h-8 text-[#ff6b6b]" />
            HÁBITOS & MISSÕES
          </h1>
          <p className="text-2xl text-gray-400">Complete quests diárias para ganhar XP e subir de nível.</p>
        </div>
        <CreateHabitButton />
      </div>

      <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6">
            <h3 className="text-gray-500 text-xl uppercase mb-2">Total de Hábitos</h3>
            <div className="font-press-start text-3xl text-blue-400 font-bold">{totalHabits}</div>
          </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6">
            <h3 className="text-gray-500 text-xl uppercase mb-2">Feitos Hoje</h3>
            <div className="font-press-start text-3xl text-green-500 font-bold">{completedToday}</div>
          </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6 flex flex-col">
            <h3 className="text-gray-500 text-xl uppercase mb-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Sua Ofensiva
            </h3>
            <div className="font-press-start text-3xl text-orange-500 font-bold">{user.currentStreak}</div>
          </div>
        </div>
      </div>

      <div className="p-[2px] pixel-corners bg-[#333] animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
        <div className="pixel-corners bg-[#18181b] p-6 lg:p-8">
           <HabitList habits={user.habits ?? []} />
        </div>
      </div>
    </div>
  );
}
