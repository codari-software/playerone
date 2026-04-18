import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all recurring bills for the user
    const bills = await prisma.recurringBill.findMany({
      where: { userId },
    });

    if (bills.length === 0) {
      return NextResponse.json({ error: 'Nenhuma conta recorrente encontrada.' }, { status: 400 });
    }

    // Create transactions for each bill
    const transactions = await Promise.all(
      bills.map((bill) =>
        prisma.financeTransaction.create({
          data: {
            userId,
            type: 'EXPENSE',
            amount: bill.amount,
            category: bill.category,
            description: `Recorrente: ${bill.name}`,
            date: new Date(),
          },
        })
      )
    );

    // CHECK FOR ACHIEVEMENTS (Optional, but good for gamification)
    const { checkAchievements } = await import('@/lib/achievements');
    const unlockedAchievements = await checkAchievements(userId);

    return NextResponse.json({
      success: true,
      count: transactions.length,
      unlockedAchievements
    }, { status: 201 });
  } catch (error: any) {
    console.error('Batch add recurring bills error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
