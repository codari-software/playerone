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
    const { logId } = body;

    if (!logId) {
      return NextResponse.json({ error: 'Log ID is required' }, { status: 400 });
    }

    // Verify log ownership
    const log = await prisma.healthLog.findUnique({
      where: { id: logId },
    });

    if (!log || log.userId !== userId) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    await prisma.healthLog.delete({
      where: { id: logId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete health log error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
