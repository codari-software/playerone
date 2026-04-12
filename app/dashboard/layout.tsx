import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardNav } from './_components/dashboard-nav';
import { DashboardHeader } from './_components/dashboard-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-vt323 selection:bg-[#ff6b6b] selection:text-white">
      <DashboardHeader />
        <DashboardNav />
        <main className="flex-1 p-4 md:p-8 min-h-[calc(100vh-4rem)] w-full overflow-hidden">
          <div className="w-full">
            {children}
          </div>
        </main>
    </div>
  );
}
