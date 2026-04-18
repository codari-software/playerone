import Image from 'next/image';
import Link from 'next/link';
import { RetroButton } from '../components/RetroButton';
import { StripeCheckoutButton } from '../components/StripeCheckoutButton';

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="p-[2px] pixel-corners bg-[#333333] hover:bg-[#ff6b6b] transition-all group flex-1">
    <div className="pixel-corners w-full h-full bg-[#18181b] p-6 sm:p-8 flex flex-col items-center text-center">
      <div className="text-4xl sm:text-5xl mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-press-start text-[#ff6b6b] text-sm sm:text-base mb-4 leading-relaxed group-hover:text-white transition-colors">{title}</h3>
      <p className="text-gray-400 text-xl md:text-2xl">{desc}</p>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white font-vt323 selection:bg-[#ff6b6b] selection:text-white flex flex-col overflow-x-hidden">
      
      {/* --- Navegação --- */}
      <nav className="w-full border-b-[4px] border-[#222]">
        <div className="w-full max-w-7xl mx-auto px-4 py-6 block sm:flex sm:items-center sm:justify-between text-center sm:text-left">
          <div className="mb-6 sm:mb-0">
            <h1 className="font-press-start text-white text-xl sm:text-2xl tracking-widest uppercase inline-block hover:text-[#ff6b6b] transition-colors cursor-pointer">PlayerOne</h1>
          </div>
          <div className="block sm:flex sm:items-center space-y-4 sm:space-y-0 sm:gap-4">
            <div className="block w-full sm:w-auto">
              <Link href="/login" className="block w-full sm:inline-block">
                <RetroButton className="w-full sm:w-auto text-center !block sm:!inline-block">ENTRAR</RetroButton>
              </Link>
            </div>
            <div className="block w-full sm:w-auto">
              <Link href="#planos" className="block w-full sm:inline-block">
                <RetroButton active className="w-full sm:w-auto text-center !block sm:!inline-block">Jogar Agora</RetroButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* --- Hero Section --- */}
        <section className="w-full max-w-7xl px-4 pt-4 pb-12 lg:pt-8 lg:pb-16 flex flex-col items-center text-center relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
          
          <div className="inline-block p-[2px] pixel-corners bg-gradient-to-r from-purple-600 to-pink-500 mb-4 animate-pulse shadow-[0_0_20px_rgba(255,107,107,0.3)]">
            <div className="pixel-corners bg-[#18181b] px-4 py-2">
              <span className="font-press-start text-xs sm:text-sm text-[#ff6b6b]">A Viseira da Vida Real Foi Atualizada</span>
            </div>
          </div>
          
          <h1 className="font-press-start text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white mb-6 leading-tight max-w-5xl drop-shadow-lg">
            TRANSFORME SUA VIDA EM UMA <span className="text-[#ff6b6b]">JORNADA ÉPICA</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-400 max-w-4xl mb-8">
            O mundo real é entediante. Mas e se a cada tarefa completada você ganhasse XP? 
            PlayerOne gamifica seus hábitos, finanças e saúde. PARE DE APENAS SOBREVIVER. COMECE A JOGAR!
          </p>
          
          <Link href="/dashboard">
            <RetroButton active className="scale-105 sm:scale-110 mb-2">TESTE GRÁTIS POR 7 DIAS »</RetroButton>
          </Link>
          <span className="text-gray-500 text-base mt-4 block">Aproveite a Season 1 sem custos iniciais</span>
        </section>

        {/* --- Social Proof / Status Section --- */}
        <section className="w-full border-y-[4px] border-[#222] bg-[#151515] py-10">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center text-center gap-6">
            <div className="flex-1 min-w-[200px]">
              <div className="font-press-start text-3xl text-blue-500 mb-2">98%</div>
              <div className="text-gray-400 text-2xl">Mais produtividade</div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="font-press-start text-3xl text-green-500 mb-2">50k+</div>
              <div className="text-gray-400 text-2xl">Desafios completos</div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="font-press-start text-3xl text-purple-500 mb-2">XP ∞</div>
              <div className="text-gray-400 text-2xl">Motivação diária</div>
            </div>
          </div>
        </section>

        {/* --- Agitação Mencionando o Problema e Apresentando a Solução --- */}
        <section className="w-full max-w-7xl px-4 py-24 flex flex-col items-center">
          <div className="text-center mb-16 max-w-4xl">
            <h2 className="font-press-start text-2xl sm:text-4xl text-white mb-6 leading-relaxed">
              SUA ROTINA NÃO PRECISA SER UM <span className="text-gray-500 line-through">GAME OVER</span>
            </h2>
            <p className="text-2xl text-gray-400">
              Sabe quando você promete que vai na academia, vai juntar dinheiro e ler um livro... e acaba scrollando o celular o dia todo?
              Isso acontece porque o mundo real não tem recompensas instantâneas. Nós mudamos esse código.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            <FeatureCard 
              icon="⚔️" 
              title="MISSÕES E HÁBITOS" 
              desc="Transforme 'lavar louça' e 'estudar' em Missões Diárias. Cumpra objetivos, mantenha sua ofensiva e escale o ranking de experiência." 
            />
            <FeatureCard 
              icon="💰" 
              title="MERCADOR e FINANÇAS" 
              desc="Pare de gastar seu ouro à toa. Registre ganhos, categorize como tesouros e bata suas metas para desbloquear recompensas reais." 
            />
            <FeatureCard 
              icon="❤️" 
              title="STATUS DE SAÚDE" 
              desc="Durma bem, beba poções (água) e treine. Seus atributos físicos afetam a sua gameplay. Vida cheia = mais stamina para o dia." 
            />
          </div>
        </section>

        {/* --- Gamification Showcase / Mechanics --- */}
        <section className="w-full bg-[#18181b] border-y-[4px] border-[#222] py-24">
          <div className="w-full max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 flex justify-center">
              <div className="p-[4px] bg-[#333] pixel-corners rotate-2 shadow-2xl shadow-[#ff6b6b]/10 max-w-lg w-full">
                <div className="bg-[#111] pixel-corners p-6">
                  <div className="flex justify-between items-center border-b-2 border-[#333] pb-4 mb-4">
                    <span className="font-press-start text-[#ff6b6b] text-sm">LEVEL UP!</span>
                    <span className="font-press-start text-yellow-400 text-xs">Ouro: 1540G</span>
                  </div>
                  <div className="space-y-4">
                    <div className="w-full bg-[#222] h-6 pixel-corners relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-blue-500 w-[70%]" />
                      <span className="absolute inset-0 flex items-center justify-center font-press-start text-[10px] text-white z-10 drop-shadow-md">XP 700/1000 - LEVEL 14</span>
                    </div>
                    <div className="p-3 bg-[#18181b] pixel-corners flex items-center justify-between">
                      <span className="text-xl text-gray-300">Missão: Treino Pesado completada</span>
                      <span className="font-press-start text-green-400 text-xs">+50 XP</span>
                    </div>
                    <div className="p-3 bg-[#18181b] pixel-corners flex items-center justify-between">
                      <span className="text-xl text-gray-300">Conquista: Uma Semana Invicta</span>
                      <span className="font-press-start text-green-400 text-xs">+100 XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-press-start text-2xl sm:text-4xl text-white mb-6 leading-relaxed">
                MECÂNICAS FEITAS PARA VICIAR NO <span className="text-[#ff6b6b]">SEU SUCESSO</span>
              </h2>
              <ul className="text-2xl text-gray-400 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="font-press-start text-[#ff6b6b] mt-1">{">"}</span>
                  <p><strong>Suba de Nível:</strong> Ganhe XP por viver a vida do jeito certo.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-press-start text-yellow-400 mt-1">{">"}</span>
                  <p><strong>Conquistas (Badges):</strong> Libere insígnias raras que provam que você zera todos os desafios.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-press-start text-blue-400 mt-1">{">"}</span>
                  <p><strong>Leaderboard Global:</strong> Prove seu valor competindo com amigos para ver quem realmente evolui na vida real.</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- Trial Offer Section (Replaces Pricing) --- */}
        <section id="planos" className="w-full max-w-7xl px-4 py-24 flex flex-col items-center scroll-mt-20">
          <div className="text-center mb-16 max-w-4xl">
            <h2 className="font-press-start text-2xl sm:text-4xl text-white mb-6">
              ACESSO COMPLETO LIBERADO
            </h2>
            <div className="inline-block p-[2px] pixel-corners bg-gradient-to-r from-green-500 to-emerald-400 mb-8 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              <div className="pixel-corners bg-[#18181b] px-8 py-4">
                <span className="font-press-start text-lg sm:text-2xl text-green-400">TESTE GRATUITAMENTE POR 7 DIAS</span>
              </div>
            </div>
            <p className="text-2xl text-gray-300 mb-10">
              Não queremos o seu ouro agora. Queremos o seu progresso. 
              Experimente todas as funções premium do PlayerOne sem pagar nada por uma semana inteira.
            </p>

            <Link href="/dashboard">
              <RetroButton active className="scale-125 mb-10">DESBLOQUEAR TUDO AGORA »</RetroButton>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-10">
              <div className="bg-[#18181b] p-6 pixel-corners border-2 border-[#333]">
                <h4 className="font-press-start text-[#ff6b6b] text-xs mb-4">MÁXIMO XP</h4>
                <p className="text-gray-400">Acesso ilimitado a todos os módulos de hábitos, finanças e saúde.</p>
              </div>
              <div className="bg-[#18181b] p-6 pixel-corners border-2 border-[#333]">
                <h4 className="font-press-start text-blue-400 text-xs mb-4">RANKING GLOBAL</h4>
                <p className="text-gray-400">Sua jornada conta para o leaderboard oficial da Season 1.</p>
              </div>
              <div className="bg-[#18181b] p-6 pixel-corners border-2 border-[#333]">
                <h4 className="font-press-start text-yellow-400 text-xs mb-4">CANCELAMENTO FÁCIL</h4>
                <p className="text-gray-400">Zero compromisso. Cancele com um clique antes dos 7 dias se não gostar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Trust Badge / Guarantee --- */}
        <section className="w-full max-w-3xl px-4 py-10">
          <div className="w-full flex items-center gap-6 p-[2px] pixel-corners bg-gradient-to-r from-green-500 to-emerald-400 opacity-90 hover:opacity-100 transition-opacity">
            <div className="pixel-corners bg-[#111] p-6 sm:p-8 flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 w-full">
              <div className="text-6xl sm:animate-bounce">🛡️</div>
              <div>
                <h3 className="font-press-start text-green-400 text-lg mb-3">CONTRATO DO JOGADOR</h3>
                <p className="text-gray-300 text-xl">
                  Se você não sentir que a sua produtividade se transformou num jogo em até 7 dias, você não paga nada. Sem letras miúdas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA / Final Push --- */}
        <section className="w-full max-w-5xl px-4 py-24 mb-10 text-center">
          <div className="p-[4px] pixel-corners bg-gradient-to-r from-[#ff6b6b] to-orange-500">
            <div className="pixel-corners bg-[#111] p-10 md:p-16 flex flex-col items-center">
              <h2 className="font-press-start text-2xl md:text-4xl text-white mb-6 leading-normal">
                CHEGA DE FAZER RESPAWN NA MESMA ROTINA
              </h2>
              <p className="text-2xl text-gray-400 mb-10 max-w-2xl">
                Pare de ver as outras pessoas upando enquanto você fica pra trás. Comece seu teste agora e escreva sua própria lenda.
              </p>
              <Link href="/dashboard">
                <RetroButton active className="scale-110">CLIQUE PARA DAR START (GRÁTIS 7D)</RetroButton>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="w-full border-t-[4px] border-[#222] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-gray-500 text-xl">© 2026 PLAYERONE. TODOS OS DIREITOS RESERVADOS.</span>
          <div className="flex gap-6">
            <Link href="/about" className="text-gray-400 hover:text-[#ff6b6b] text-xl transition-colors">SOBRE O PROJETO</Link>
            <Link href="/contact" className="text-gray-400 hover:text-[#ff6b6b] text-xl transition-colors">SUPORTE</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
