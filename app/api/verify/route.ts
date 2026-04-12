import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email e código são obrigatórios.' }, { status: 400 });
    }

    const token = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code,
      }
    });

    if (!token) {
      return NextResponse.json({ error: 'Código inválido ou incorreto.' }, { status: 400 });
    }

    if (token.expires < new Date()) {
      return NextResponse.json({ error: 'Este código já expirou. Crie uma nova conta.' }, { status: 400 });
    }

    // Marca o usuário como verificado
    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    // Remove tokens usados
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    return NextResponse.json({ success: true, message: 'Conta verificada com sucesso!' }, { status: 200 });
  } catch (error: any) {
    console.error('Erro na API Verification:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
