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

export async function saveCharacterClass(characterClass: 'WARRIOR' | 'MAGE' | 'ARCHER') {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.user.update({
    where: { id: userId },
    data: { characterClass },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function saveCharacterSkin(gender: string, characterSkin: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.user.update({
    where: { id: userId },
    data: { 
      gender,
      characterSkin 
    },
  });

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

export async function toggleHabitDay(habitId: string, day: number) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: 'Unauthorized' };

    // Pegar data do dia solicitado (mês atual)
    const date = new Date();
    date.setDate(day);
    date.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Verificar se já existe log para esse hábito neste dia
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId,
        date: {
          gte: date,
          lte: endOfDay,
        },
      },
    });

    if (existingLog) {
      await prisma.habitLog.delete({
        where: { id: existingLog.id },
      });
    } else {
      await prisma.habitLog.create({
        data: {
          habitId,
          date,
        },
      });

      // Dar recompensa de XP
      const habit = await prisma.habit.findUnique({
        where: { id: habitId },
        select: { xpReward: true }
      });

      if (habit) {
        await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: habit.xpReward } }
        });
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/bosses'); // Bosses dependem de hábitos concluídos
    return { success: true };
  } catch (error) {
    console.error('Error toggling habit:', error);
    return { error: 'Falha ao salvar no banco de dados.' };
  }
}

export async function deleteHabit(habitId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.habit.delete({
    where: { 
      id: habitId,
      userId: userId // Garantir que pertence ao usuário
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function saveNote(title: string, content: string, category: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.note.create({
    data: {
      userId,
      title,
      content,
      category
    },
  });

  revalidatePath('/dashboard/lore');
  return { success: true };
}

export async function updateUserWeight(weight: number) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.user.update({
    where: { id: userId },
    data: { weight },
  });

  revalidatePath('/dashboard/water');
  return { success: true };
}

export async function logWaterIntake(amountMl: number) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.healthLog.create({
    data: {
      userId,
      type: 'WATER',
      value: amountMl,
      unit: 'ml',
      description: `Bebeu ${amountMl}ml de água`,
      xpEarned: 10
    },
  });

  // Recompensa de XP
  await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: 10 } }
  });

  revalidatePath('/dashboard/water');
  return { success: true };
}

export async function deleteNote(noteId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.note.delete({
    where: { 
      id: noteId,
      userId: userId
    },
  });

  revalidatePath('/dashboard/lore');
  return { success: true };
}

export async function defeatBoss(bossId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  const progress = await prisma.userBoss.findUnique({
    where: { userId_bossId: { userId, bossId } },
    include: { boss: true }
  });

  if (!progress || progress.status !== 'UNLOCKED') return { success: false };

  await prisma.$transaction(async (tx) => {
    // Marcar como derrotado
    await tx.userBoss.update({
      where: { id: progress.id },
      data: { status: 'DEFEATED', lastDefeatedAt: new Date() }
    });

    // Dar recompensa
    await tx.user.update({
      where: { id: userId },
      data: { xp: { increment: progress.boss.xpReward } }
    });

    // Desbloquear o próximo
    const nextBoss = await tx.boss.findFirst({ 
      where: { order: progress.boss.order + 1 } 
    });

    if (nextBoss) {
      await tx.userBoss.upsert({
        where: { userId_bossId: { userId, bossId: nextBoss.id } },
        update: { status: 'UNLOCKED' },
        create: { userId, bossId: nextBoss.id, status: 'UNLOCKED' }
      });
    }
  });

  revalidatePath('/dashboard/bosses');
  return { success: true };
}

export async function toggleBossObjective(objectiveId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  const existing = await prisma.userBossObjective.findUnique({
    where: { userId_objectiveId: { userId, objectiveId } }
  });

  if (existing) {
    await prisma.userBossObjective.update({
      where: { id: existing.id },
      data: { isCompleted: !existing.isCompleted, completedAt: !existing.isCompleted ? new Date() : null }
    });
  } else {
    await prisma.userBossObjective.create({
      data: { userId, objectiveId, isCompleted: true, completedAt: new Date() }
    });
  }

  revalidatePath('/dashboard/bosses');
  return { success: true };
}
