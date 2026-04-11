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
    const { name, description, xpReward, frequency } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const habit = await prisma.habit.create({
      data: {
        userId: (session.user as any).id,
        name,
        description: description ?? '',
        xpReward: xpReward ?? 10,
        frequency: frequency ?? 'DAILY',
      },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error: any) {
    console.error('Create habit error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
