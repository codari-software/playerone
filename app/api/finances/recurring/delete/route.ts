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
    const { billId } = body;

    if (!billId) {
      return NextResponse.json({ error: 'Bill ID is required' }, { status: 400 });
    }

    await prisma.recurringBill.delete({
      where: { 
        id: billId,
        userId: userId // Security check
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete recurring bill error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
