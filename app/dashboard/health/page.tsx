import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Heart, Activity, Droplets, Moon, Lock } from 'lucide-react';
import { HealthLogList } from './_components/health-log-list';
import { AddHealthLogButton } from './_components/add-health-log-button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HealthPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      healthLogs: {
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  const canAccess = user.plan === 'HERO' || user.plan === 'LEGEND' || user.activeModule === 'HEALTH';

  if (!canAccess && user.plan === 'FREE') {
    return (
      <div className="text-center py-20 px-4">
        <div className="p-[2px] pixel-corners bg-[#333] inline-block mb-6">
          <div className="pixel-corners bg-[#18181b] p-6">
             <Heart className="w-16 h-16 text-gray-700 mx-auto" />
          </div>
        </div>
        <h2 className="font-press-start text-white text-xl mb-4">MÓDULO BLOQUEADO</h2>
        <p className="text-2xl text-gray-500 mb-10 max-w-lg mx-auto">
          Ficar em forma dá muito XP! Melhore seu plano para monitorar sua saúde e HP.
        </p>
        <Link href="/dashboard/profile#upgrade">
          <div className="p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] transition-colors inline-block text-white">
            <div className="pixel-corners bg-[#ff6b6b] px-8 py-4 font-press-start text-sm shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]">
              UPGRADE PARA HERÓI
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Get today's logs
  const today = new Date().toDateString();
  const todayLogs = user.healthLogs?.filter?.(
    (log: any) => new Date(log?.date ?? new Date()).toDateString() === today
  ) ?? [];

  const exerciseToday = todayLogs
    ?.filter?.((l: any) => l?.type === 'EXERCISE')
    ?.reduce?.((sum: number, l: any) => sum + (l?.value ?? 0), 0) ?? 0;

  const waterToday = todayLogs
    ?.filter?.((l: any) => l?.type === 'WATER')
    ?.reduce?.((sum: number, l: any) => sum + (l?.value ?? 0), 0) ?? 0;

  const sleepToday = todayLogs
    ?.filter?.((l: any) => l?.type === 'SLEEP')
    ?.reduce?.((sum: number, l: any) => sum + (l?.value ?? 0), 0) ?? 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="font-press-start text-white text-2xl mb-4 flex items-center gap-4">
            <Heart className="w-8 h-8 text-[#ff6b6b]" />
            SAÚDE & HP
          </h1>
          <p className="text-2xl text-gray-400">Monitore sua saúde física para manter seu personagem no topo.</p>
        </div>
        <AddHealthLogButton />
      </div>

      <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6">
            <div className="flex items-center gap-2 text-gray-500 text-xl uppercase mb-2 text-orange-500/80">
              <Activity className="w-5 h-5" />
              Exercício Hoje
            </div>
            <div className="font-press-start text-3xl text-orange-500 font-bold">{exerciseToday.toFixed(0)}</div>
            <div className="text-gray-500 text-xl">minutos</div>
          </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6">
            <div className="flex items-center gap-2 text-gray-500 text-xl uppercase mb-2 text-blue-400/80">
              <Droplets className="w-5 h-5" />
              Água Hoje
            </div>
            <div className="font-press-start text-3xl text-blue-400 font-bold">{waterToday.toFixed(0)}</div>
            <div className="text-gray-500 text-xl">copos</div>
          </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6">
            <div className="flex items-center gap-2 text-gray-500 text-xl uppercase mb-2 text-purple-400/80">
              <Moon className="w-5 h-5" />
              Sono Logado
            </div>
            <div className="font-press-start text-3xl text-purple-400 font-bold">{sleepToday.toFixed(1)}</div>
            <div className="text-gray-500 text-xl">horas</div>
          </div>
        </div>
      </div>

      <div className="p-[2px] pixel-corners bg-[#333] animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
        <div className="pixel-corners bg-[#18181b] p-6 lg:p-10">
           <HealthLogList logs={user.healthLogs ?? []} />
        </div>
      </div>
    </div>
  );
}
