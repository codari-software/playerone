import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'suporte@playerone.tech';
  const password = 'Gabriel8&@';
  
  console.log(`--- CONFIGURANDO CONTA DE ADMIN: ${email} ---`);

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      plan: 'LEGEND',
      isVerified: true,
      isGuest: false,
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Suporte PlayerOne',
      nickname: 'admin_playerone',
      plan: 'LEGEND',
      isVerified: true,
      isGuest: false,
      xp: 5000,
      level: 20,
      characterClass: 'WARRIOR',
      characterSkin: 'warrior_legendary',
      energy: 100,
      maxEnergy: 100,
      power: 50,
      strength: 20,
      intelligence: 20,
      constitution: 20,
      willpower: 20,
    },
  });

  console.log('✅ Conta de Admin configurada com sucesso!');
  console.log('📧 Email:', user.email);
  console.log('⭐ Plano:', user.plan);
  console.log('🆔 ID:', user.id);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao configurar conta de admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
