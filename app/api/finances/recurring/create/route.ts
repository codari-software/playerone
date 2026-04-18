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

    const body = await request.json();
    const { name, amount, category } = body;

    if (!name || amount === undefined || !category) {
      return NextResponse.json(
        { error: 'Name, amount, and category are required' },
        { status: 400 }
      );
    }

    const bill = await prisma.recurringBill.create({
      data: {
        userId,
        name,
        amount: parseFloat(amount),
        category,
      },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (error: any) {
    console.error('Create recurring bill error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
