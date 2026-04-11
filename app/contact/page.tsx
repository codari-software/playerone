import Image from 'next/image';
import Link from 'next/link';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { ContactForm } from './_components/contact-form';

const RetroButton = ({ children }: { children: React.ReactNode }) => (
  <div className="p-[2px] pixel-corners cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-[#333333] hover:bg-[#ff6b6b]">
    <div className="pixel-corners w-full h-full flex items-center justify-center px-6 py-3 text-2xl tracking-wide bg-[#18181b] text-gray-300 hover:text-white">
       {children}
    </div>
  </div>
);

const SupportCard = ({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) => (
  <div className="p-[2px] pixel-corners bg-[#333333] hover:bg-[#ff6b6b] transition-all group flex-1">
    <div className="pixel-corners w-full h-full bg-[#18181b] p-6 text-center flex flex-col items-center">
      <Icon className="w-10 h-10 text-[#ff6b6b] mb-4 group-hover:scale-110 transition-transform" />
      <h3 className="font-press-start text-white text-sm mb-2">{title}</h3>
      <p className="text-gray-400 text-xl">{desc}</p>
    </div>
  </div>
);

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white font-vt323 selection:bg-[#ff6b6b] selection:text-white flex flex-col">
      <nav className="w-full flex justify-center border-b-[4px] border-[#222]">
        <div className="w-full max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="font-press-start text-white text-xl sm:text-2xl tracking-widest uppercase hover:text-[#ff6b6b] transition-colors cursor-pointer">PlayerOne</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <RetroButton>Voltar</RetroButton>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-16">
        <h1 className="font-press-start text-3xl sm:text-5xl text-white mb-6 text-center">
          SINAL DE <span className="text-[#ff6b6b]">FUMAÇA</span> (SUPORTE)
        </h1>
        
        <p className="text-2xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Encontrou um bug na matriz? Tem uma sugestão de quest? Ou só quer mandar um salve pra guilda? O nosso canal direto está aberto!
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <SupportCard 
            icon={Mail} 
            title="MENSAGEM VIA CORVO" 
            desc="suporte@playerone.com.br" 
          />
          <SupportCard 
            icon={MessageCircle} 
            title="TEMPO DE RESPAWN" 
            desc="Respondemos em até 24 horas" 
          />
          <SupportCard 
            icon={HelpCircle} 
            title="HORÁRIO DA TAVERNA" 
            desc="Aberto 7 dias por semana" 
          />
        </div>

        <div className="p-[2px] pixel-corners bg-[#333333] relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
          <div className="pixel-corners bg-[#18181b] p-8 md:p-12 relative z-10">
            <h2 className="font-press-start text-white text-xl mb-8">ENVIE SEU REPORT</h2>
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
}
