import { prisma } from './prisma';
import { calculateLevel } from './xp-system';

export interface UnlockedAchievement {
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}

export async function checkAchievements(userId: string): Promise<UnlockedAchievement[]> {
  try {
    // 1. Pegar todas as conquistas que o usuário AINDA NÃO tem
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true }
    });
    
    const ownedIds = userAchievements.map(ua => ua.achievementId);
    
    const lockedAchievements = await prisma.achievement.findMany({
      where: {
        id: { notIn: ownedIds }
      }
    });

    if (lockedAchievements.length === 0) return [];

    // 2. Pegar dados atuais do usuário para validação
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            habits: { where: { isCompleted: true } },
            financeTransactions: true,
            healthLogs: true,
            userAchievements: true
          }
        },
        financeTransactions: true,
        healthLogs: true,
        habits: true
      }
    });

    if (!user) return [];

    const unlocked: UnlockedAchievement[] = [];

    // 3. Lógica de validação para cada tipo de requisito
    for (const achievement of lockedAchievements) {
      let isEligible = false;
      const val = achievement.requirementValue;

      switch (achievement.requirement) {
        case 'HABITS_COMPLETED':
          const completedCount = await prisma.habit.count({
             where: { userId, isCompleted: true }
          });
          if (completedCount >= val) isEligible = true;
          break;
          
        case 'STREAK_DAYS':
          if (user.currentStreak >= val) isEligible = true;
          break;

        case 'FINANCE_INCOME_COUNT':
          const incomeCount = user.financeTransactions.filter(t => t.type === 'INCOME').length;
          if (incomeCount >= val) isEligible = true;
          break;

        case 'FINANCE_BALANCE':
          const totalIncome = user.financeTransactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
          const totalExpenses = user.financeTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
          if ((totalIncome - totalExpenses) >= val) isEligible = true;
          break;

        case 'FINANCE_TOTAL_COUNT':
          if (user._count.financeTransactions >= val) isEligible = true;
          break;

        case 'HEALTH_EXERCISE_MINUTES':
          const exerciseMinutes = user.healthLogs
            .filter(l => l.type === 'EXERCISE')
            .reduce((sum, l) => sum + (l.value || 0), 0);
          if (exerciseMinutes >= val) isEligible = true;
          break;

        case 'HEALTH_WATER_GLASSES':
          const waterCount = user.healthLogs.filter(l => l.type === 'WATER').length;
          if (waterCount >= val) isEligible = true;
          break;

        case 'HEALTH_SLEEP_COUNT':
          const sleepCount = user.healthLogs.filter(l => l.type === 'SLEEP').length;
          if (sleepCount >= val) isEligible = true;
          break;

        case 'HEALTH_TOTAL_COUNT':
          if (user._count.healthLogs >= val) isEligible = true;
          break;

        case 'USER_LEVEL':
          if (user.level >= val) isEligible = true;
          break;

        case 'ACHIEVEMENTS_UNLOCKED':
          if (user._count.userAchievements >= val) isEligible = true;
          break;
          
        case 'MODULES_ACCESSED':
           // Simples checagem se tem pelo menos um registro em cada
           if (user._count.habits > 0 && user._count.financeTransactions > 0 && user._count.healthLogs > 0) {
             isEligible = true;
           }
           break;
      }

      if (isEligible) {
        // Desbloquear!
        await prisma.$transaction([
          prisma.userAchievement.create({
            data: {
              userId: user.id,
              achievementId: achievement.id
            }
          }),
          prisma.user.update({
            where: { id: user.id },
            data: {
              xp: { increment: achievement.xpReward },
              level: calculateLevel(user.xp + achievement.xpReward)
            }
          })
        ]);

        unlocked.push({
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          xpReward: achievement.xpReward
        });
      }
    }

    return unlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}
