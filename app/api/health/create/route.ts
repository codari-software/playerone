import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateLevel } from '@/lib/xp-system';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, value, unit, description } = body;

    if (!type || value === undefined || !unit) {
      return NextResponse.json(
        { error: 'Type, value, and unit are required' },
        { status: 400 }
      );
    }

    // Calculate XP based on activity
    let xpEarned = 5;
    if (type === 'EXERCISE') {
      xpEarned = Math.min(Math.floor(value / 10) * 5, 50); // 5 XP per 10 min, max 50
    } else if (type === 'WATER') {
      xpEarned = Math.min(value * 2, 20); // 2 XP per glass, max 20
    } else if (type === 'SLEEP') {
      xpEarned = value >= 7 ? 15 : 10; // Bonus XP for 7+ hours
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const oldLevel = calculateLevel(user.xp);
    const newXp = user.xp + xpEarned;
    const newLevel = calculateLevel(newXp);

    // Create log and update user
    const [log] = await prisma.$transaction([
      prisma.healthLog.create({
        data: {
          userId: user.id,
          type,
          value: parseFloat(value),
          unit,
          description: description ?? '',
          xpEarned,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          xp: newXp,
          level: newLevel,
          lastActiveAt: new Date(),
        },
      }),
    ]);

    // CHECK FOR ACHIEVEMENTS
    const { checkAchievements } = await import('@/lib/achievements');
    const unlockedAchievements = await checkAchievements(user.id);

    return NextResponse.json(
      {
        ...log,
        levelUp: newLevel > oldLevel,
        newLevel,
        unlockedAchievements,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create health log error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
