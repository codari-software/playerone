import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Dumbbell, Plus, Calendar, ChevronRight, Activity, Trophy } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { cn } from '@/lib/utils';
import { WorkoutList } from './_components/workout-list';
import { CreateWorkoutButton } from './_components/create-workout-button';

export const dynamic = 'force-dynamic';

export default async function WorkoutPage() {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;
  
  if (!userId) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workouts: {
        orderBy: { date: 'desc' },
        include: {
          exercises: {
            include: {
              sets: true
            }
          }
        }
      },
    },
  });

  if (!user) {
    redirect('/');
  }

  const workouts = (user as any).workouts || [];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="font-press-start text-white text-2xl mb-4 flex items-center gap-4">
            <Dumbbell className="w-8 h-8 text-[#ff6b6b]" />
            CENTRAL DE TREINO
          </h1>
          <p className="text-2xl text-gray-400">Gerencie sua força física e suba de nível no mundo real.</p>
        </div>
        <CreateWorkoutButton />
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6">
            <div className="flex items-center gap-2 text-gray-500 text-xl uppercase mb-2 text-[#ff6b6b]">
              <Activity className="w-5 h-5" />
              Treinos Realizados
            </div>
            <div className="font-press-start text-3xl text-white font-bold">{workouts.length}</div>
          </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6">
            <div className="flex items-center gap-2 text-gray-500 text-xl uppercase mb-2 text-blue-400">
              <Calendar className="w-5 h-5" />
              Frequência Semanal
            </div>
            <div className="font-press-start text-3xl text-white font-bold">0</div>
            <div className="text-gray-500 text-xl">dias este mês</div>
          </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6">
            <div className="flex items-center gap-2 text-gray-500 text-xl uppercase mb-2 text-yellow-500">
              <Trophy className="w-5 h-5" />
              Total de Séries
            </div>
            <div className="font-press-start text-3xl text-white font-bold">
              {workouts.reduce((acc: number, w: any) => acc + w.exercises.reduce((accE: number, e: any) => accE + e.sets.length, 0), 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-[2px] pixel-corners bg-[#222] animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
        <div className="pixel-corners bg-[#18181b] p-6 lg:p-10">
           <WorkoutList workouts={workouts} />
        </div>
      </div>
    </div>
  );
}
