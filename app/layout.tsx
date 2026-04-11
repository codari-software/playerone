import type { Metadata } from 'next';
import { VT323, Press_Start_2P } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-vt323' });
const pressStart2P = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-press-start' });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: 'PlayerOne - Gamifique Sua Vida',
  description: 'Transforme sua vida diária em uma aventura épica. Acompanhe hábitos, gerencie finanças e melhore a saúde através da gamificação.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'PlayerOne - Gamifique Sua Vida',
    description: 'Transforme sua vida diária em uma aventura épica. Acompanhe hábitos, gerencie finanças e melhore a saúde através da gamificação.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={`${vt323.variable} ${pressStart2P.variable} font-vt323 text-xl bg-[#111111] text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
