import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING ACHIEVEMENTS START ---');

  const achievements = [
    // HÁBITOS
    {
      name: 'Primeira Missão',
      description: 'Complete seu primeiro hábito diário.',
      icon: 'Target',
      xpReward: 50,
      requirement: 'HABITS_COMPLETED',
      requirementValue: 1,
      category: 'HABITS'
    },
    {
      name: 'Guerreiro da Rotina',
      description: 'Complete 10 hábitos.',
      icon: 'Shield',
      xpReward: 100,
      requirement: 'HABITS_COMPLETED',
      requirementValue: 10,
      category: 'HABITS'
    },
    {
      name: 'Mestre da Disciplina',
      description: 'Complete 100 hábitos.',
      icon: 'Sword',
      xpReward: 500,
      requirement: 'HABITS_COMPLETED',
      requirementValue: 100,
      category: 'HABITS'
    },
    {
      name: 'Ofensiva de Fogo',
      description: 'Mantenha uma streak de 7 dias.',
      icon: 'Flame',
      xpReward: 200,
      requirement: 'STREAK_DAYS',
      requirementValue: 7,
      category: 'HABITS'
    },
    {
      name: 'Inabalável',
      description: 'Mantenha uma streak de 30 dias.',
      icon: 'Zap',
      xpReward: 1000,
      requirement: 'STREAK_DAYS',
      requirementValue: 30,
      category: 'HABITS'
    },

    // FINANÇAS
    {
      name: 'Primeiro Loot',
      description: 'Registre seu primeiro ganho de ouro.',
      icon: 'Coins',
      xpReward: 50,
      requirement: 'FINANCE_INCOME_COUNT',
      requirementValue: 1,
      category: 'FINANCES'
    },
    {
      name: 'Poupador Aprendiz',
      description: 'Acumule R$ 1.000,00 de saldo.',
      icon: 'Wallet',
      xpReward: 150,
      requirement: 'FINANCE_BALANCE',
      requirementValue: 1000,
      category: 'FINANCES'
    },
    {
      name: 'Investidor de Elite',
      description: 'Acumule R$ 10.000,00 de saldo.',
      icon: 'Gem',
      xpReward: 500,
      requirement: 'FINANCE_BALANCE',
      requirementValue: 10000,
      category: 'FINANCES'
    },
    {
      name: 'Mestre do Tesouro',
      description: 'Acumule R$ 100.000,00 de saldo.',
      icon: 'Crown',
      xpReward: 2000,
      requirement: 'FINANCE_BALANCE',
      requirementValue: 100000,
      category: 'FINANCES'
    },
    {
      name: 'Dízimo Ativo',
      description: 'Registre 50 transações de qualquer tipo.',
      icon: 'Calculator',
      xpReward: 200,
      requirement: 'FINANCE_TOTAL_COUNT',
      requirementValue: 50,
      category: 'FINANCES'
    },

    // SAÚDE
    {
      name: 'Atleta Iniciante',
      description: 'Registre 60 minutos de exercícios.',
      icon: 'Activity',
      xpReward: 100,
      requirement: 'HEALTH_EXERCISE_MINUTES',
      requirementValue: 60,
      category: 'HEALTH'
    },
    {
      name: 'Maratonista Digital',
      description: 'Registre 1000 minutos de exercícios.',
      icon: 'Trophy',
      xpReward: 1000,
      requirement: 'HEALTH_EXERCISE_MINUTES',
      requirementValue: 1000,
      category: 'HEALTH'
    },
    {
      name: 'Hidratado',
      description: 'Beba 100 copos de água.',
      icon: 'Droplets',
      xpReward: 300,
      requirement: 'HEALTH_WATER_GLASSES',
      requirementValue: 100,
      category: 'HEALTH'
    },
    {
      name: 'Sono dos Deuses',
      description: 'Registre 50 noites de sono.',
      icon: 'Moon',
      xpReward: 250,
      requirement: 'HEALTH_SLEEP_COUNT',
      requirementValue: 50,
      category: 'HEALTH'
    },
    {
      name: 'Corpo de Aço',
      description: 'Registre 100 atividades de saúde.',
      icon: 'Heart',
      xpReward: 500,
      requirement: 'HEALTH_TOTAL_COUNT',
      requirementValue: 100,
      category: 'HEALTH'
    },

    // GLOBAL / LEVEL
    {
      name: 'Level Up!',
      description: 'Alcance o Nível 5.',
      icon: 'Star',
      xpReward: 200,
      requirement: 'USER_LEVEL',
      requirementValue: 5,
      category: 'GLOBAL'
    },
    {
      name: 'Veterano',
      description: 'Alcance o Nível 10.',
      icon: 'Medal',
      xpReward: 500,
      requirement: 'USER_LEVEL',
      requirementValue: 10,
      category: 'GLOBAL'
    },
    {
      name: 'Lenda Viva',
      description: 'Alcance o Nível 50.',
      icon: 'Crown',
      xpReward: 5000,
      requirement: 'USER_LEVEL',
      requirementValue: 50,
      category: 'GLOBAL'
    },
    {
      name: 'Explorador',
      description: 'Acesse todos os 3 módulos do sistema.',
      icon: 'Compass',
      xpReward: 100,
      requirement: 'MODULES_ACCESSED',
      requirementValue: 3,
      category: 'GLOBAL'
    },
    {
      name: 'Colecionador',
      description: 'Desbloqueie 10 conquistas.',
      icon: 'Gift',
      xpReward: 500,
      requirement: 'ACHIEVEMENTS_UNLOCKED',
      requirementValue: 10,
      category: 'GLOBAL'
    }
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.name.toLowerCase().replace(/\s+/g, '-') }, // Usando slug como ID temporário para o upsert
      update: achievement,
      create: {
        ...achievement,
        id: achievement.name.toLowerCase().replace(/\s+/g, '-')
      }
    });
  }

  console.log('--- SEEDING ACHIEVEMENTS COMPLETE: 20 ITEMS ADDED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
