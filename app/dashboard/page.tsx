import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlayerCard } from './_components/player-card';
import { ModuleAccess } from './_components/module-access';
import { RecentActivity } from './_components/recent-activity';
import { LeaderboardWidget } from './_components/leaderboard-widget';
import { getXpProgress, calculateLevel } from '@/lib/xp-system';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // Fetching data in parallel to improve performance
  const [user, topPlayers] = await Promise.all([
    prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        habits: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        financeTransactions: {
          orderBy: { date: 'desc' },
          take: 5,
        },
        healthLogs: {
          orderBy: { date: 'desc' },
          take: 5,
        },
        userAchievements: {
          include: {
            achievement: true,
          },
          orderBy: { unlockedAt: 'desc' },
          take: 3,
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        xp: true,
        level: true,
      },
    })
  ]);

  if (!user) {
    return (
      <div className="p-[2px] pixel-corners bg-[#333]">
        <div className="pixel-corners bg-[#18181b] p-10 text-center">
          <p className="font-press-start text-[#ff6b6b]">ERRO: PERSONAGEM NÃO ENCONTRADO</p>
          <Link href="/login" className="mt-4 inline-block text-xl underline text-gray-400">Voltar ao Login</Link>
        </div>
      </div>
    );
  }

  const xpProgress = getXpProgress(user.xp);
  const currentLevel = calculateLevel(user.xp);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-press-start text-white text-2xl mb-4 leading-relaxed">
          BEM-VINDO DE VOLTA, <span className="text-[#ff6b6b]">{user.name}</span>!
        </h1>
        <p className="text-2xl text-gray-400">Pronto para continuar sua jornada hoje?</p>
      </div>

      <PlayerCard user={user} xpProgress={xpProgress} currentLevel={currentLevel} />

      <div className="grid lg:grid-cols-2 gap-10">
        <ModuleAccess user={user} />
        <LeaderboardWidget topPlayers={topPlayers} currentUserId={user.id} />
      </div>

      <RecentActivity
        habits={user.habits}
        transactions={user.financeTransactions}
        healthLogs={user.healthLogs}
        achievements={user.userAchievements}
      />
    </div>
  );
}
