import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { WaterClient } from './_components/water-client';

export const dynamic = 'force-dynamic';

export default async function WaterPage() {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { weight: true }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await prisma.healthLog.findMany({
    where: {
      userId,
      type: 'WATER',
      date: {
        gte: today
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <WaterClient 
      initialWeight={user?.weight || null} 
      todayLogs={logs.map(l => ({
        id: l.id,
        amountMl: l.value,
        createdAt: l.createdAt
      }))}
    />
  );
}
