const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bosses = [
    {
      name: 'Lodo da Procrastinação',
      description: 'Uma massa viscosa que te prende ao sofá e sussurra: "Só mais 5 minutos".',
      level: 1,
      hp: 100,
      xpReward: 50,
      difficulty: 2,
      order: 1,
      imageUrl: '/images/bosses/boss_01_procrastinacao.png',
      objectives: [
        { description: '10 minutos de leitura', hpDamage: 34 },
        { description: 'Beber 500ml de água', hpDamage: 33 },
        { description: 'Organizar a mesa de trabalho', hpDamage: 33 }
      ]
    },
    {
      name: 'Espectro da Distração',
      description: 'Cintilante e barulhento, ele rouba seu foco com notificações e luzes brilhantes.',
      level: 3,
      hp: 250,
      xpReward: 120,
      difficulty: 4,
      order: 2,
      imageUrl: '/images/bosses/boss_02_distracao.png',
      objectives: [
        { description: '30m de foco total (sem celular)', hpDamage: 100 },
        { description: 'Beber 1L de água', hpDamage: 75 },
        { description: 'Uma refeição seguindo a dieta', hpDamage: 75 }
      ]
    },
    {
      name: 'Gorath, o Insaciável',
      description: 'Devora metas inteiras e ainda deixa você com sede de evolução.',
      level: 7,
      hp: 700,
      xpReward: 350,
      difficulty: 7,
      order: 3,
      imageUrl: '/images/bosses/boss_03_insaciavel.png',
      objectives: [
        { description: 'Concluir a tarefa mais difícil (Frog)', hpDamage: 300 },
        { description: '45m de estudo focado', hpDamage: 200 },
        { description: 'Bater a meta diária de água', hpDamage: 100 },
        { description: 'Meditação ou respiração de 5m', hpDamage: 100 }
      ]
    },
    {
      name: 'Dragão do Esgotamento',
      description: 'As chamas do burnout consomem sua energia. Enfrente-o com estratégia.',
      level: 12,
      hp: 1500,
      xpReward: 800,
      difficulty: 9,
      order: 4,
      imageUrl: '/images/bosses/boss_04_esgotamento.png',
      objectives: [
        { description: 'Concluir 3 tarefas do projeto principal', hpDamage: 600 },
        { description: 'Treino físico intenso', hpDamage: 400 },
        { description: 'Dormir antes das 23h (noite anterior)', hpDamage: 300 },
        { description: 'Zero açúcar ou doces no dia', hpDamage: 200 }
      ]
    },
    {
      name: 'O Vazio da Inércia',
      description: 'O desafio final. Onde a falta de movimento se torna uma barreira intransponível.',
      level: 20,
      hp: 5000,
      xpReward: 2500,
      difficulty: 10,
      order: 5,
      imageUrl: '/images/bosses/boss_05_inercia.png',
      objectives: [
        { description: 'Finalizar um Milestone/Projeto', hpDamage: 2000 },
        { description: '4 horas de Deep Work (Foco Profundo)', hpDamage: 1500 },
        { description: 'Planejar detalhadamente a próxima semana', hpDamage: 1000 },
        { description: 'Jejum de dopamina (sem redes sociais)', hpDamage: 500 }
      ]
    }
  ];

  console.log('Seeding bosses and objectives...');
  
  for (const b of bosses) {
    const { objectives, ...bossData } = b;
    const boss = await prisma.boss.upsert({
      where: { order: b.order },
      update: bossData,
      create: bossData,
    });

    // Seed objectives for this boss
    for (const obj of objectives) {
      await prisma.bossObjective.upsert({
        where: { id: `${boss.id}-${obj.description}` }, // Unique identifier for seed
        update: { ...obj, bossId: boss.id },
        create: { ...obj, bossId: boss.id, id: `${boss.id}-${obj.description}` },
      });
    }
  }

  console.log('Bosses and objectives seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
