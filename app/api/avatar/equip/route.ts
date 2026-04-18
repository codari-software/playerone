import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { itemId } = await request.json();

    const userItem = await prisma.userItem.findUnique({
      where: { userId_itemId: { userId, itemId } },
      include: { item: true }
    });

    if (!userItem) return NextResponse.json({ error: 'Item não encontrado no seu inventário' }, { status: 404 });

    // Unequip others of same type
    await prisma.userItem.updateMany({
      where: {
        userId,
        item: { type: userItem.item.type }
      },
      data: { isEquipped: false }
    });

    // Equip this one
    await prisma.userItem.update({
      where: { id: userItem.id },
      data: { isEquipped: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Equip item error:', error);
    return NextResponse.json({ error: 'Erro ao equipar item' }, { status: 500 });
  }
}
