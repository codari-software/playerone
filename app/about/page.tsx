import Image from 'next/image';
import Link from 'next/link';

const RetroButton = ({ active, children, className = "" }: { active?: boolean, children: React.ReactNode, className?: string }) => (
  <div className={`p-[2px] pixel-corners cursor-pointer transition-transform hover:scale-105 active:scale-95 inline-block ${active ? 'bg-[#ff6b6b]' : 'bg-[#333333] hover:bg-[#ff6b6b]'} ${className}`}>
    <div className={`pixel-corners w-full h-full flex items-center justify-center px-6 py-3 text-2xl tracking-wide ${active ? 'bg-[#ff6b6b] text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]' : 'bg-[#18181b] text-gray-300 hover:text-white'}`}>
       {children}
    </div>
  </div>
);

const LoreCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="p-[2px] pixel-corners bg-[#333333] hover:bg-gray-400 transition-all group flex-1">
    <div className="pixel-corners w-full h-full bg-[#18181b] p-6 lg:p-8 flex flex-col items-center text-center">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-press-start text-[#ff6b6b] text-sm sm:text-base mb-4 leading-relaxed">{title}</h3>
      <p className="text-gray-400 text-xl">{desc}</p>
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white font-vt323 selection:bg-[#ff6b6b] selection:text-white flex flex-col overflow-x-hidden">
      
      {/* --- Navegação --- */}
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

      <main className="flex-1 w-full flex flex-col items-center py-16 px-4">
        <div className="w-full max-w-5xl">
          
          {/* Header */}
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            <h1 className="font-press-start text-3xl sm:text-5xl text-white mb-6">
              A LORE DO <span className="text-[#ff6b6b]">PLAYERONE</span>
            </h1>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
              Nossa missão é transformar a sua rotina diária no RPG mais épico que você já jogou. 
              Acreditamos que a vida real merece o mesmo engajamento de um grande lançamento AAA.
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col md:flex-row gap-6 w-full mb-16">
            <LoreCard 
              icon="🎯" 
              title="A MISSÃO" 
              desc="Capacitar pessoas a atingirem seus objetivos usando gamificação pesada e reforços positivos constantes." 
            />
            <LoreCard 
              icon="⚡" 
              title="A VISÃO" 
              desc="Um mundo onde o crescimento pessoal é acessível, divertido e instantaneamente recompensador para qualquer um." 
            />
            <LoreCard 
              icon="🤝" 
              title="A GUILDA" 
              desc="Milhares de jogadores ao redor do globo subindo de nível juntos e se apoiando em cada nova quest." 
            />
          </div>

          {/* Por que Gamificação */}
          <div className="p-[4px] pixel-corners bg-gradient-to-r from-blue-600 to-purple-600 mb-16 relative z-10">
            <div className="pixel-corners bg-[#111] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-6xl opacity-10">🎮</div>
              <h2 className="font-press-start text-2xl text-white mb-6">POR QUE GAMIFICAÇÃO?</h2>
              <p className="text-2xl text-gray-300 mb-6">
                Estudos mostram que a mecânica dos jogos hackeia o sistema de dopamina do nosso cérebro, aumentando absurdamente o foco e o engajamento. Ao invés de usar isso para rolar o feed de redes sociais, o PlayerOne usa isso a seu favor nas seguintes áreas:
              </p>
              <ul className="text-2xl text-gray-400 space-y-4 list-none">
                <li className="flex gap-3"><span className="text-[#ff6b6b]">▶</span> Construir hábitos inquebráveis através de loots consistentes.</li>
                <li className="flex gap-3"><span className="text-[#ff6b6b]">▶</span> Celebrar pequenos marcos com alertas visuais gratificantes.</li>
                <li className="flex gap-3"><span className="text-[#ff6b6b]">▶</span> Manter a adrenalina alta protegendo suas "ofensivas" (streaks).</li>
                <li className="flex gap-3"><span className="text-[#ff6b6b]">▶</span> Transformar a louça suja em uma Boss Fight emocionante.</li>
              </ul>
            </div>
          </div>

          {/* Como tudo começou */}
          <div className="mb-20">
            <h2 className="font-press-start text-2xl text-white mb-6">CÓDIGO FONTE (A ORIGEM)</h2>
            <div className="p-6 bg-[#18181b] border-2 border-[#333] border-l-[#ff6b6b] border-l-4">
              <p className="text-2xl text-gray-400 leading-relaxed">
                Tudo começou com um simples bug na vida real: por que nos dedicávamos tanto para melhorar os stats de um boneco virtual, enquanto pulávamos a academia e comíamos mal no mundo físico? Nossa equipe juntou especialistas em UI/UX, psicologia comportamental e desenvolvimento de games para escrever o patch de correção definitivo pra vida das pessoas.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/signup">
              <RetroButton active className="scale-110 sm:scale-125">ENTRAR PARA O MUNDO DO JOGO</RetroButton>
            </Link>
          </div>

        </div>
      </main>

    </div>
  );
}
