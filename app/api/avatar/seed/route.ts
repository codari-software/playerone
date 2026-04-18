import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Available Prisma Models:', Object.keys(prisma).filter(k => !k.startsWith('_')));
    
    // Tenta encontrar o modelo independente da capitalização (backup)
    const modelName = 'avatarItem';
    const client = (prisma as any)[modelName];
    
    if (!client) {
      throw new Error(`Modelo "${modelName}" não encontrado no Prisma Client. Modelos disponíveis: ${Object.keys(prisma).filter(k => !k.startsWith('_')).join(', ')}`);
    }

    const items = [
      // SKINS
      { name: 'Guerreiro Padrão', type: 'SKIN', priceXP: 0, rarity: 'COMMON' },
      { name: 'Mago das Chamas', type: 'SKIN', priceXP: 500, rarity: 'RARE' },
      { name: 'Paladino de Ouro', type: 'SKIN', priceXP: 2000, rarity: 'EPIC' },
      { name: 'Sombra da Noite', type: 'SKIN', priceXP: 1000, rarity: 'RARE' },

      // WEAPONS
      { name: 'Espada de Madeira', type: 'WEAPON', priceXP: 50, rarity: 'COMMON' },
      { name: 'Lâmina de Aço', type: 'WEAPON', priceXP: 300, rarity: 'RARE' },
      { name: 'Excalibur Pixelada', type: 'WEAPON', priceXP: 1500, rarity: 'EPIC' },

      // SHIELDS
      { name: 'Escudo de Tábua', type: 'SHIELD', priceXP: 100, rarity: 'COMMON' },
      { name: 'Brasão do Reino', type: 'SHIELD', priceXP: 600, rarity: 'RARE' },
      { name: 'Escudo do Dragão', type: 'SHIELD', priceXP: 1200, rarity: 'EPIC' },

      // HATS
      { name: 'Elmo de Ferro', type: 'HAT', priceXP: 150, rarity: 'COMMON' },
      { name: 'Coroa do Rei', type: 'HAT', priceXP: 3000, rarity: 'LEGENDARY' },
    ];

    for (const item of items) {
      await (prisma as any).avatarItem.upsert({
        where: { id: item.name.toLowerCase().replace(/ /g, '-') },
        update: {},
        create: {
          id: item.name.toLowerCase().replace(/ /g, '-'),
          name: item.name,
          type: item.type,
          priceXP: item.priceXP,
          rarity: item.rarity,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Avatar items seeded!' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
