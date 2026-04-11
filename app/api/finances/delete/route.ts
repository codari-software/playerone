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
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Verify transaction ownership
    const transaction = await prisma.financeTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    await prisma.financeTransaction.delete({
      where: { id: transactionId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete transaction error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
