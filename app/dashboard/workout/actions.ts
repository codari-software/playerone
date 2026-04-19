'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createWorkout(name: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  const workout = await prisma.workout.create({
    data: {
      userId,
      name,
    },
  });

  revalidatePath('/dashboard/workout');
  return workout;
}

export async function addExercise(workoutId: string, name: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  const exercise = await prisma.exercise.create({
    data: {
      workoutId,
      name,
    },
  });

  revalidatePath('/dashboard/workout');
  return exercise;
}

export async function addSet(exerciseId: string, reps?: number, weight?: number) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  const set = await prisma.set.create({
    data: {
      exerciseId,
      reps,
      weight,
    },
  });

  revalidatePath('/dashboard/workout');
  return set;
}

export async function deleteWorkout(workoutId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.workout.delete({
    where: { id: workoutId, userId },
  });

  revalidatePath('/dashboard/workout');
  return { success: true };
}

export async function toggleSet(setId: string, isCompleted: boolean) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.set.update({
    where: { id: setId },
    data: { isCompleted },
  });

  revalidatePath('/dashboard/workout');
  return { success: true };
}

export async function updateSet(setId: string, reps: number, weight: number) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.set.update({
    where: { id: setId },
    data: { reps, weight },
  });

  revalidatePath('/dashboard/workout');
  return { success: true };
}

export async function deleteExercise(exerciseId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.exercise.delete({
    where: { id: exerciseId },
  });

  revalidatePath('/dashboard/workout');
  return { success: true };
}

export async function deleteSet(setId: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.set.delete({
    where: { id: setId },
  });

  revalidatePath('/dashboard/workout');
  return { success: true };
}

export async function toggleExerciseCompletion(exerciseId: string, isCompleted: boolean) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  await prisma.exercise.update({
    where: { id: exerciseId },
    data: { isCompleted },
  });

  revalidatePath('/dashboard/workout');
  return { success: true };
}
