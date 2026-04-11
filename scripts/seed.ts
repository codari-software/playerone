import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- INICIANDO SEED DO PLAYERONE ---');

  // Criar usuário admin de teste se não existir
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'Admin Player',
      xp: 1500,
      level: 5,
      currentStreak: 7,
      longestStreak: 15,
      plan: 'HERO',
    },
  });

  console.log('Usuário Admin verificado:', adminUser.email);

  // Lista de 22 Conquistas Épicas (Portugues / 8-bit style)
  const achievements = [
    // HÁBITOS & MISSÕES
    {
      name: 'Primeira Missão',
      description: 'Cumpriu seu primeiro hábito diário.',
      icon: 'Target',
      xpReward: 50,
      requirement: 'HABITS_COMPLETED',
      requirementValue: 1,
      category: 'HABITS'
    },
    {
      name: 'Soldado da Rotina',
      description: 'Completou 10 missões com sucesso.',
      icon: 'Shield',
      xpReward: 100,
      requirement: 'HABITS_COMPLETED',
      requirementValue: 10,
      category: 'HABITS'
    },
    {
      name: 'Veterano de Guerra',
      description: 'Completou 50 missões no total.',
      icon: 'Sword',
      xpReward: 300,
      requirement: 'HABITS_COMPLETED',
      requirementValue: 50,
      category: 'HABITS'
    },
    {
      name: 'Grão-Mestre da Disciplina',
      description: 'Alcançou a marca de 100 hábitos completados.',
      icon: 'Trophy',
      xpReward: 1000,
      requirement: 'HABITS_COMPLETED',
      requirementValue: 100,
      category: 'HABITS'
    },
    {
      name: 'Chama Viva',
      description: 'Manteve uma sequência (streak) de 7 dias.',
      icon: 'Flame',
      xpReward: 200,
      requirement: 'STREAK_DAYS',
      requirementValue: 7,
      category: 'HABITS'
    },
    {
      name: 'Fênix Imortal',
      description: 'Manteve uma sequência de 30 dias sem falhar.',
      icon: 'Zap',
      xpReward: 1500,
      requirement: 'STREAK_DAYS',
      requirementValue: 30,
      category: 'HABITS'
    },

    // FINANÇAS & OURO
    {
      name: 'Primeiro Drop de Ouro',
      description: 'Registrou seu primeiro ganho financeiro.',
      icon: 'Coins',
      xpReward: 50,
      requirement: 'FINANCE_INCOME_COUNT',
      requirementValue: 1,
      category: 'FINANCES'
    },
    {
      name: 'Mercador Aprendiz',
      description: 'Acumulou R$ 1.000,00 de saldo líquido.',
      icon: 'Wallet',
      xpReward: 200,
      requirement: 'FINANCE_BALANCE',
      requirementValue: 1000,
      category: 'FINANCES'
    },
    {
      name: 'Lorde do Comércio',
      description: 'Acumulou R$ 10.000,00 de saldo líquido.',
      icon: 'Gem',
      xpReward: 750,
      requirement: 'FINANCE_BALANCE',
      requirementValue: 10000,
      category: 'FINANCES'
    },
    {
      name: 'Rei do Tesouro',
      description: 'Acumulou a fortuna de R$ 100.000,00.',
      icon: 'Crown',
      xpReward: 5000,
      requirement: 'FINANCE_BALANCE',
      requirementValue: 100000,
      category: 'FINANCES'
    },
    {
      name: 'Calculista de Masmorra',
      description: 'Registrou 50 transações no livro contábil.',
      icon: 'Calculator',
      xpReward: 300,
      requirement: 'FINANCE_TOTAL_COUNT',
      requirementValue: 50,
      category: 'FINANCES'
    },
    {
      name: 'Mão de Vaca de Ouro',
      description: 'Manteve saldo positivo por 30 dias seguidos.',
      icon: 'Lock',
      xpReward: 500,
      requirement: 'FINANCE_POSITIVE_STREAK',
      requirementValue: 30,
      category: 'FINANCES'
    },

    // SAÚDE & STATUS VITAL
    {
      name: 'Início do Treinamento',
      description: 'Dedicou seus primeiros 60 minutos à saúde física.',
      icon: 'Activity',
      xpReward: 150,
      requirement: 'HEALTH_EXERCISE_MINUTES',
      requirementValue: 60,
      category: 'HEALTH'
    },
    {
      name: 'Monge da Hidratação',
      description: 'Bebeu um total de 100 copos de água.',
      icon: 'Droplets',
      xpReward: 400,
      requirement: 'HEALTH_WATER_GLASSES',
      requirementValue: 100,
      category: 'HEALTH'
    },
    {
      name: 'Repouso do Herói',
      description: 'Registrou 20 noites de sono reparador.',
      icon: 'Moon',
      xpReward: 150,
      requirement: 'HEALTH_SLEEP_COUNT',
      requirementValue: 20,
      category: 'HEALTH'
    },
    {
      name: 'Berserker',
      description: 'Completou 500 minutos de atividade física intensa.',
      icon: 'Heart',
      xpReward: 800,
      requirement: 'HEALTH_EXERCISE_MINUTES',
      requirementValue: 500,
      category: 'HEALTH'
    },
    {
      name: 'Paladino da Vitalidade',
      description: 'Registrou 100 atividades de saúde no total.',
      icon: 'Shield',
      xpReward: 600,
      requirement: 'HEALTH_TOTAL_COUNT',
      requirementValue: 100,
      category: 'HEALTH'
    },

    // GLOBAL & NÍVEIS
    {
      name: 'Level Up!',
      description: 'Alcançou o Nível 5 de personagem.',
      icon: 'Star',
      xpReward: 250,
      requirement: 'USER_LEVEL',
      requirementValue: 5,
      category: 'GLOBAL'
    },
    {
      name: 'Veterano de Elite',
      description: 'Alcançou o Nível 15 de personagem.',
      icon: 'Medal',
      xpReward: 800,
      requirement: 'USER_LEVEL',
      requirementValue: 15,
      category: 'GLOBAL'
    },
    {
      name: 'Sábio do Mundo Antigo',
      description: 'Alcançou o Nível 50 de personagem.',
      icon: 'Crown',
      xpReward: 10000,
      requirement: 'USER_LEVEL',
      requirementValue: 50,
      category: 'GLOBAL'
    },
    {
      name: 'Mestre de Todos os Reinos',
      description: 'Desbloqueou 20 conquistas diferentes.',
      icon: 'Trophy',
      xpReward: 2000,
      requirement: 'ACHIEVEMENTS_UNLOCKED',
      requirementValue: 20,
      category: 'GLOBAL'
    },
    {
      name: 'Explorador Completo',
      description: 'Utilizou o Módulo de Hábitos, Finanças e Saúde.',
      icon: 'Compass',
      xpReward: 500,
      requirement: 'MODULES_ACCESSED',
      requirementValue: 3,
      category: 'GLOBAL'
    }
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: {
        id: achievement.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
      },
      update: achievement,
      create: {
        id: achievement.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
        ...achievement,
      },
    });
  }

  console.log(`--- SEED FINALIZADO: ${achievements.length} CONQUISTAS CRIADAS ---`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
