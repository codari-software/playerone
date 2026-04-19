import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getXpProgress } from '@/lib/xp-system';
import { cookies } from 'next/headers';

import { SetupWizard } from './_components/setup-wizard';
import { WeeklyCalendar } from './_components/weekly-calendar';
import { RPGPlayerCard } from './_components/rpg-player-card';
import { EnergyBar } from './_components/energy-bar';
import { HabitGrid } from './_components/habit-grid';
import { AttributeRadar } from './_components/attribute-radar';
import { PomodoroTimer } from './_components/pomodoro-timer';
import { MonthlyProgressChart } from './_components/monthly-progress-chart';
import { Swords, Target, TrendingUp, Sparkles, ScrollText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  const guestId = cookieStore.get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId || null;

  const user = userId ? await prisma.user.findUnique({
    where: { id: userId },
    include: {
      habits: {
        include: {
          logs: {
            where: {
              date: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      },
      inventory: {
        include: { item: true }
      }
    },
  }) : null;

  if (!user || !user.nickname || !user.characterClass || !user.hasCompletedTutorial) {
    return <SetupWizard userEmail={user?.email || ''} />;
  }

  const xpProgress = getXpProgress(user.xp);

  // Calcular progresso mensal para o gráfico
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthlyChartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const totalHabits = user.habits.length;
    if (totalHabits === 0) return { day, value: 0 };

    const completedOnDay = user.habits.filter(h => 
      h.logs.some((l: any) => new Date(l.date).getDate() === day && new Date(l.date).getMonth() === now.getMonth())
    ).length;

    return { day, value: Math.round((completedOnDay / totalHabits) * 100) };
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Main Profile Header */}
      <RPGPlayerCard user={user} xpProgress={xpProgress} />

      {/* NOVO: Gráfico de Progresso Mensal */}
      <MonthlyProgressChart data={monthlyChartData} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Habits & Energy */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-[2px] pixel-corners bg-[#222]">
            <div className="pixel-corners bg-[#18181b] p-6 space-y-6">
              <EnergyBar current={user.energy || 100} max={user.maxEnergy || 100} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Target className="w-8 h-8 text-[#ff6b6b]" />
              <h2 className="font-press-start text-white text-xl">HABIT TRACKER</h2>
            </div>
            <HabitGrid habits={user.habits} />
          </div>

          {/* Daily Quests List */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ScrollText className="w-8 h-8 text-yellow-500" />
              <h2 className="font-press-start text-white text-xl">MISSÕES DO DIA</h2>
            </div>
            <div className="grid gap-4">
              {user.habits.slice(0, 3).map((habit, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#18181b] border-2 border-[#222] pixel-corners hover:border-[#ff6b6b] transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#222] pixel-corners flex items-center justify-center font-press-start text-xs text-gray-500 group-hover:text-[#ff6b6b]">
                        0{i + 1}
                      </div>
                      <div>
                        <div className="font-press-start text-[10px] text-white uppercase">{habit.name}</div>
                        <div className="font-vt323 text-lg text-gray-500">RECOMPENSA: +{habit.xpReward} XP</div>
                      </div>
                   </div>
                   <button className="px-6 py-2 bg-[#ff6b6b]/10 text-[#ff6b6b] font-press-start text-[8px] pixel-corners hover:bg-[#ff6b6b] hover:text-white transition-all">
                      COMPLETAR
                   </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attributes & Pomodoro */}
        <div className="space-y-8">
          {/* Attributes Radar */}
          <div className="p-[2px] pixel-corners bg-[#222]">
            <div className="pixel-corners bg-[#18181b] p-8 space-y-8 text-center uppercase">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-press-start text-xs text-white">ATRIBUTOS</h3>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
              
              <AttributeRadar stats={{
                strength: user.strength || 5,
                intelligence: user.intelligence || 5,
                constitution: user.constitution || 5,
                energy: user.energy || 100,
                willpower: user.willpower || 5
              }} />

              <div className="grid grid-cols-1 gap-2 text-left pt-4 border-t border-[#222]">
                <div className="flex justify-between font-vt323 text-2xl">
                  <span className="text-orange-500">💪 FORÇA</span>
                  <span className="text-white">{user.strength || 5}</span>
                </div>
                <div className="flex justify-between font-vt323 text-2xl">
                  <span className="text-blue-400">🧠 INTELIGÊNCIA</span>
                  <span className="text-white">{user.intelligence || 5}</span>
                </div>
                <div className="flex justify-between font-vt323 text-2xl">
                  <span className="text-red-400">🛡️ CONSTITUIÇÃO</span>
                  <span className="text-white">{user.constitution || 5}</span>
                </div>
                <div className="flex justify-between font-vt323 text-2xl">
                  <span className="text-yellow-600">⚡ ENERGIA</span>
                  <span className="text-white">{user.energy || 100}</span>
                </div>
                <div className="flex justify-between font-vt323 text-2xl">
                  <span className="text-purple-400">🔥 VONTADE</span>
                  <span className="text-white">{user.willpower || 5}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div className="p-[2px] pixel-corners bg-[#ff6b6b]/30">
            <PomodoroTimer />
          </div>
        </div>
      </div>
    </div>
  );
}
