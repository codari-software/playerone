import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { LoreClient } from './_components/lore-client';

export const dynamic = 'force-dynamic';

export default async function LorePage() {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;

  if (!userId) return null;

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <LoreClient initialNotes={notes.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      category: n.category,
      date: n.createdAt.toISOString().split('T')[0]
    }))} />
  );
}
