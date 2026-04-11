import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white font-vt323 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-[2px] pixel-corners bg-[#ff6b6b] animate-in zoom-in duration-500">
        <div className="pixel-corners bg-[#18181b] p-10 text-center">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="font-press-start text-xl text-[#ff6b6b] mb-6 leading-relaxed">
            COMPRA CONFIRMADA!
          </h1>
          <p className="text-2xl text-gray-400 mb-10">
            Seu portal para a evolução está aberto. Agora você pode criar seu personagem ou entrar no sistema.
          </p>
          
          <div className="space-y-4">
            <Link href="/signup">
              <div className="p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] transition-all cursor-pointer inline-block w-full">
                <div className="pixel-corners bg-[#ff6b6b] px-6 py-4 font-press-start text-sm text-white shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)]">
                  CRIAR CONTA
                </div>
              </div>
            </Link>
            
            <div className="pt-4">
               <Link href="/login" className="text-gray-500 hover:text-white transition-colors text-xl underline">
                  Já tenho conta, fazer login
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
