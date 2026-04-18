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

import { cookies } from 'next/headers';
import { SetupWizard } from './_components/setup-wizard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  const guestId = cookieStore.get('playerone_guest_id')?.value;
  
  // Identifica o usuário: Sessão Logada ou Cookie de Convidado
  const userId = (session?.user as any)?.id || guestId || null;

  const [user, topPlayers] = await Promise.all([
    userId ? prisma.user.findUnique({
      where: { id: userId },
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
    }) : null,
    prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        nickname: true,
        xp: true,
        level: true,
      },
    })
  ]);

  // Se não tiver usuário (Convidado Novo) ou não tiver nickname/tutorial, mostra o setup
  const needsSetup = !user || !user.nickname || !user.hasCompletedTutorial;

  const xpProgress = getXpProgress(user?.xp || 0);
  const currentLevel = calculateLevel(user?.xp || 0);

  return (
    <div className="relative">
      {needsSetup && <SetupWizard userEmail={user?.email || ''} />}
      
      <div className="space-y-10">
        <div>
          <h1 className="font-press-start text-white text-2xl mb-4 leading-relaxed">
            BEM-VINDO DE VOLTA, <span className="text-[#ff6b6b]">{user?.nickname || user?.name || 'EXPLORADOR'}</span>!
          </h1>
          <p className="text-2xl text-gray-400">Pronto para continuar sua jornada hoje?</p>
        </div>

        {user && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
