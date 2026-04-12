import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Configurando o transportador do Nodemailer com as variáveis de ambiente
    // É necessário ter as variáveis SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS no seu arquivo .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com', // ou servidor do titan/hostinger/etc
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', // true para 465, false para outras portas (587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Ignora a verificação de certificados (corrige erro 'self-signed certificate in certificate chain')
        rejectUnauthorized: false
      }
    });

    // Enviar o email para suporte@playerone.tech
    const info = await transporter.sendMail({
      // Se SMTP_USER for diferente do "from" real, isso pode dar problema dependendo do provedor (use SMTP_USER no fallback)
      from: `"PlayerOne Suporte Web" <${process.env.SMTP_USER || 'suporte@playerone.tech'}>`,
      replyTo: email,
      to: 'suporte@playerone.tech', 
      subject: `[Quest Report] ${subject} - de ${name}`,
      text: `Nome do Jogador: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
      html: `
        <div style="font-family: monospace; padding: 20px; background-color: #111; color: #fff;">
          <h2 style="color: #ff6b6b;">NOVO REPORT DA GUILDA ⚔️</h2>
          <p><strong>Jogador:</strong> ${name}</p>
          <p><strong>Email (Reply-to):</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <hr style="border-color: #333;" />
          <p><strong>Mensagem Secreta:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    console.log('Mensagem enviada com sucesso: %s', info.messageId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error);
    return NextResponse.json(
      { error: 'Falha ao enviar e-mail da quest', details: error.message },
      { status: 500 }
    );
  }
}
