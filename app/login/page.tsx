import { LoginForm } from './_components/login-form';
import Link from 'next/link';
import { RetroButton } from '../../components/RetroButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white font-vt323 selection:bg-[#ff6b6b] selection:text-white flex items-center justify-center p-4 overflow-x-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#ff6b6b] hover:text-white mb-6 transition-colors text-2xl"
        >
          <span className="font-press-start text-xs">{"<-"}</span>
          <span>VOLTAR PARA O MENU</span>
        </Link>
        
        <div className="p-[2px] pixel-corners bg-[#333333] shadow-2xl shadow-[#ff6b6b]/10">
          <div className="pixel-corners bg-[#18181b] p-8">
            <div className="flex flex-col items-center mb-8 border-b-2 border-[#333] pb-6">
              <h1 className="font-press-start text-xl text-[#ff6b6b] mb-4 text-center tracking-widest">LOGIN DO JOGADOR</h1>
              <p className="text-gray-400 text-center text-2xl">Insira suas credenciais para continuar sua jornada</p>
            </div>

            <LoginForm />

          </div>
        </div>
      </div>
    </div>
  );
}
