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
        {/* Meta Pixel - Base Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1702390777841107');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1702390777841107&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={`${vt323.variable} ${pressStart2P.variable} font-vt323 text-xl bg-[#111111] text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
