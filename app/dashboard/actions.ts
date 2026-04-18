'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getUserId } from '@/lib/session';

export async function checkNickname(nickname: string) {
  const existing = await prisma.user.findUnique({
    where: { nickname: nickname.toLowerCase() },
  });
  return !!existing;
}

export async function saveNickname(nickname: string) {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  const guestId = cookieStore.get('playerone_guest_id')?.value;

  let userId = (session?.user as any)?.id;

  // Final check for duplicate
  const existingNickname = await prisma.user.findUnique({
    where: { nickname: nickname.toLowerCase() },
  });

  if (existingNickname) {
    return { error: 'Nickname já utilizado por outro herói.' };
  }

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { nickname: nickname.toLowerCase() },
    });
  } else {
    // É um convidado. Se já tiver guestId, atualiza. Senão, cria.
    if (guestId) {
      const guest = await prisma.user.findUnique({ where: { id: guestId } });
      if (guest) {
        await prisma.user.update({
          where: { id: guestId },
          data: { nickname: nickname.toLowerCase() },
        });
        userId = guestId;
      }
    }
    
    if (!userId) {
      const newGuest = await prisma.user.create({
        data: {
          nickname: nickname.toLowerCase(),
          isGuest: true,
          isVerified: true,
          plan: 'INICIANTE',
        },
      });
      userId = newGuest.id;
      cookieStore.set('playerone_guest_id', userId, { maxAge: 60 * 60 * 24 * 7 }); // 7 dias
    }
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function completeTutorial() {
  const userId = await getUserId();

  if (!userId) throw new Error('Unauthorized');

  await prisma.user.update({
    where: { id: userId },
    data: { hasCompletedTutorial: true },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function simulateExpiration() {
  const userId = await getUserId();
  if (!userId) return { error: 'Unauthorized' };

  // Define a data para 8 dias atrás
  const eightDaysAgo = new Date();
  eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

  await prisma.user.update({
    where: { id: userId },
    data: { createdAt: eightDaysAgo },
  });

  revalidatePath('/dashboard');
  return { success: true };
}
export async function resetExpiration() {
  const userId = await getUserId();
  if (!userId) return { error: 'Unauthorized' };

  await prisma.user.update({
    where: { id: userId },
    data: { createdAt: new Date() },
  });

  revalidatePath('/dashboard');
  return { success: true };
}
