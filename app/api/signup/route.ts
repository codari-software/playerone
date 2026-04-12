import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verifica se existe um plano pendente no cookie de compra
    const purchaseCookie = cookies().get('playerone_access');
    const pendingPlan = purchaseCookie?.value || 'INICIANTE';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with the purchased plan
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        isVerified: false,
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        plan: pendingPlan as any,
      },
    });

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing tokens for this email just in case
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    // Save token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: code,
        expires: new Date(Date.now() + 1000 * 60 * 15), // 15 mins
      }
    });

    // Send email using nodemailer
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: `"PlayerOne Suporte" <${process.env.SMTP_USER || 'suporte@playerone.tech'}>`,
      to: email,
      subject: `[PlayerOne] Seu código central: ${code}`,
      html: `
        <div style="font-family: monospace; padding: 20px; background-color: #111; color: #fff;">
          <h2 style="color: #ff6b6b;">BEM-VINDO À GUILDA! ⚔️</h2>
          <p>Você está quase lá. Seu código secreto de verificação é:</p>
          <h1 style="color: #ff6b6b; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p>Este código expira em 15 minutos.</p>
        </div>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Código enviado',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
