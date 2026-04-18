import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { itemId } = await request.json();

    const item = await prisma.avatarItem.findUnique({
      where: { id: itemId }
    });

    if (!item) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true }
    });

    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    if (user.xp < item.priceXP) {
      return NextResponse.json({ error: 'XP insuficiente' }, { status: 400 });
    }

    // Check if player already has the item
    const existingItem = await prisma.userItem.findUnique({
      where: {
        userId_itemId: { userId, itemId }
      }
    });

    if (existingItem) return NextResponse.json({ error: 'Você já possui este item' }, { status: 400 });

    // Transaction to subtract XP and add item
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { xp: { decrement: item.priceXP } }
      }),
      prisma.userItem.create({
        data: {
          userId,
          itemId,
          isEquipped: false
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Buy item error:', error);
    return NextResponse.json({ error: 'Erro ao comprar item' }, { status: 500 });
  }
}
