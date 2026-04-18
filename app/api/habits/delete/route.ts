import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { habitId } = body;

    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }

    // Verify habit ownership
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.userId !== userId) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete habit error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
