import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { DashboardNav } from './_components/dashboard-nav';
import { DashboardHeader } from './_components/dashboard-header';
import { TrialExpiredModal } from './_components/trial-expired-modal';
import { cn } from '@/lib/utils';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;

  let user = null;
  let isTrialExpired = false;

  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        name: true, 
        nickname: true, 
        isGuest: true, 
        createdAt: true,
        plan: true 
      }
    });

    if (user?.isGuest && user.plan === 'INICIANTE') {
      const trialDuration = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms
      const timeSinceCreation = Date.now() - new Date(user.createdAt).getTime();
      if (timeSinceCreation > trialDuration) {
        isTrialExpired = true;
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-vt323 selection:bg-[#ff6b6b] selection:text-white">
      {isTrialExpired && <TrialExpiredModal />}
      
      <DashboardHeader 
        userName={user?.nickname || user?.name || 'Jogador'} 
        isGuest={!session}
      />
      
      <div className={cn(
        "w-full max-w-7xl mx-auto flex flex-col md:flex-row",
        isTrialExpired && "blur-sm pointer-events-none select-none opacity-50"
      )}>
        <DashboardNav />
        <main className="flex-1 p-4 md:p-8 min-h-[calc(100vh-4rem)] w-full">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
