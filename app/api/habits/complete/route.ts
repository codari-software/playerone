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
    const { habitId } = body;

    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }

    // Get habit
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Check if already completed today
    const isCompletedToday =
      habit.isCompleted &&
      habit?.completedAt &&
      new Date(habit.completedAt).toDateString() === new Date().toDateString();

    if (isCompletedToday) {
      return NextResponse.json(
        { error: 'Habit already completed today' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const oldLevel = calculateLevel(user.xp);
    const newXp = user.xp + habit.xpReward;
    const newLevel = calculateLevel(newXp);
    const levelUp = newLevel > oldLevel;

    // Update habit and user in a transaction
    await prisma.$transaction([
      prisma.habit.update({
        where: { id: habitId },
        data: {
          isCompleted: true,
          completedAt: new Date(),
          streak: habit.streak + 1,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          xp: newXp,
          level: newLevel,
          currentStreak: user.currentStreak + 1,
          longestStreak: Math.max(user.longestStreak, user.currentStreak + 1),
          lastActiveAt: new Date(),
        },
      }),
    ]);

    // CHECK FOR ACHIEVEMENTS
    const { checkAchievements } = await import('@/lib/achievements');
    const unlockedAchievements = await checkAchievements(user.id);

    return NextResponse.json({
      success: true,
      xpEarned: habit.xpReward,
      newXp,
      levelUp,
      newLevel,
      unlockedAchievements,
    });
  } catch (error: any) {
    console.error('Complete habit error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
