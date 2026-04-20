import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { BossesClient } from './_components/bosses-client';

export const dynamic = 'force-dynamic';

export default async function BossesPage() {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;

  if (!userId) return null;

  // Garantir que o usuário tenha progresso inicial
  const firstBoss = await prisma.boss.findFirst({ where: { order: 1 } });
  if (firstBoss) {
    await prisma.userBoss.upsert({
      where: { userId_bossId: { userId, bossId: firstBoss.id } },
      update: {},
      create: { userId, bossId: firstBoss.id, status: 'UNLOCKED' }
    });
  }

  const userProgress = await prisma.userBoss.findMany({
    where: { userId },
    include: { 
      boss: {
        include: {
          objectives: {
            include: {
              userCompletions: {
                where: { userId }
              }
            }
          }
        }
      } 
    },
    orderBy: { boss: { order: 'asc' } }
  });

  return (
    <BossesClient progress={userProgress.map(p => ({
      id: p.id,
      status: p.status as any,
      boss: {
        id: p.boss.id,
        name: p.boss.name,
        description: p.boss.description,
        level: p.boss.level,
        hp: p.boss.hp,
        xpReward: p.boss.xpReward,
        difficulty: p.boss.difficulty,
        imageUrl: p.boss.imageUrl,
        order: p.boss.order,
        objectives: p.boss.objectives.map(obj => ({
          id: obj.id,
          description: obj.description,
          hpDamage: obj.hpDamage,
          isCompleted: obj.userCompletions.length > 0 && obj.userCompletions[0].isCompleted
        }))
      }
    }))} />
  );
}
