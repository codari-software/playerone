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
    const { name, description, xpReward, frequency } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const habit = await prisma.habit.create({
      data: {
        userId: userId,
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
