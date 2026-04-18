import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { DashboardNav } from './_components/dashboard-nav';
import { DashboardHeader } from './_components/dashboard-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;

  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, nickname: true }
    });
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-vt323 selection:bg-[#ff6b6b] selection:text-white">
      <DashboardHeader 
        userName={user?.nickname || user?.name || 'Jogador'} 
        isGuest={!session}
      />
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row">
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
