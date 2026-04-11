import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, amount, category, description } = body;

    if (!type || !amount || !category) {
      return NextResponse.json(
        { error: 'Type, amount, and category are required' },
        { status: 400 }
      );
    }

    const transaction = await prisma.financeTransaction.create({
      data: {
        userId: (session.user as any).id,
        type,
        amount: parseFloat(amount),
        category,
        description: description ?? '',
      },
    });

    // CHECK FOR ACHIEVEMENTS
    const { checkAchievements } = await import('@/lib/achievements');
    const unlockedAchievements = await checkAchievements((session.user as any).id);

    return NextResponse.json({
      ...transaction,
      unlockedAchievements
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create transaction error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
