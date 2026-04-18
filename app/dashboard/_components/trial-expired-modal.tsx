'use client';

import { useEffect } from 'react';
import { StripeCheckoutButton } from '@/components/StripeCheckoutButton';
import { Crown, Star, ShieldCheck, Zap, Lock, Sword } from 'lucide-react';

export function TrialExpiredModal() {
  useEffect(() => {
    // Desabilita o scroll do body quando o modal abre
    document.body.style.overflow = 'hidden';
    return () => {
      // Reabilita quando o modal fecha (unmount)
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl p-[2px] pixel-corners bg-[#ff6b6b] animate-in zoom-in duration-500 my-auto">
        <div className="pixel-corners bg-[#111] p-6 md:p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 pixel-corners bg-[#ff6b6b]/20 relative">
               <Lock className="w-12 h-12 text-[#ff6b6b]" />
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6b6b] pixel-corners animate-ping opacity-75" />
            </div>
          </div>

          <h1 className="font-press-start text-white text-xl md:text-2xl lg:text-3xl mb-4 tracking-tight leading-tight break-words px-4">
            GAME OVER
          </h1>
          <p className="font-vt323 text-2xl text-gray-400 mb-8 max-w-2xl mx-auto leading-tight uppercase px-4">
            Sua jornada experimental acabou. Escolha sua classe para continuar a evolução!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* ADVENTURER PLAN (19,90) */}
            <div className="p-[2px] pixel-corners bg-[#222] hover:bg-blue-500 transition-all group">
              <div className="pixel-corners bg-[#18181b] p-6 h-full flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                    <Sword className="w-5 h-5 text-blue-400" />
                    <h2 className="font-press-start text-xs text-white group-hover:text-blue-400 transition-colors">AVENTUREIRO</h2>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <div className="font-press-start text-2xl text-white">R$ 19,90</div>
                    <p className="font-vt323 text-lg text-gray-600 uppercase mt-1">Acesso Básico Vitalício</p>
                  </div>

                  <ul className="space-y-2 pt-4 border-t-2 border-[#222]">
                    <li className="flex items-center gap-2 font-vt323 text-lg text-gray-500">
                      <Zap className="w-3 h-3 text-blue-400" /> Acesso a 1 Módulo
                    </li>
                    <li className="flex items-center gap-2 font-vt323 text-lg text-gray-500">
                      <Zap className="w-3 h-3 text-blue-400" /> Leaderboard Global
                    </li>
                    <li className="flex items-center gap-2 font-vt323 text-lg text-gray-500">
                      <Zap className="w-3 h-3 text-blue-400" /> Sistema de XP & Level
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <StripeCheckoutButton planId="aventureiro" active>
                    ESCOLHER
                  </StripeCheckoutButton>
                </div>
              </div>
            </div>

            {/* HERO PLAN (29,90) */}
            <div className="p-[2px] pixel-corners bg-[#333] hover:bg-[#ff6b6b] scale-105 shadow-xl transition-all group relative z-10">
              <div className="pixel-corners bg-[#18181b] p-6 h-full flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                    <ShieldCheck className="w-5 h-5 text-[#ff6b6b]" />
                    <h2 className="font-press-start text-xs text-white group-hover:text-[#ff6b6b] transition-colors">HERÓI</h2>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <div className="font-press-start text-2xl text-white">R$ 29,90</div>
                    <p className="font-vt323 text-lg text-gray-600 uppercase mt-1">Acesso Total Vitalício</p>
                  </div>

                  <ul className="space-y-2 pt-4 border-t-2 border-[#222]">
                    <li className="flex items-center gap-2 font-vt323 text-lg text-gray-400">
                      <Zap className="w-3 h-3 text-[#ff6b6b]" /> Todos os Módulos Atuais
                    </li>
                    <li className="flex items-center gap-2 font-vt323 text-lg text-gray-400">
                      <Zap className="w-3 h-3 text-[#ff6b6b]" /> Sem Limite de Hábitos
                    </li>
                    <li className="flex items-center gap-2 font-vt323 text-lg text-gray-400">
                      <Zap className="w-3 h-3 text-[#ff6b6b]" /> Dashboard de Ouro
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <StripeCheckoutButton planId="heroi" active>
                    SELECIONAR
                  </StripeCheckoutButton>
                </div>
              </div>
            </div>

            {/* LEGEND PLAN (49,90) */}
            <div className="p-[2px] pixel-corners bg-[#ff6b6b]/40 hover:bg-yellow-500 transition-all group">
              <div className="pixel-corners bg-[#18181b] p-6 h-full flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <h2 className="font-press-start text-xs text-white group-hover:text-yellow-500 transition-colors">LENDA</h2>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <div className="font-press-start text-2xl text-white">R$ 49,90</div>
                    <p className="font-vt323 text-lg text-gray-600 uppercase mt-1">Acesso Full + Futuro</p>
                  </div>

                  <ul className="space-y-2 pt-4 border-t-2 border-[#222]">
                    <li className="flex items-center gap-2 font-vt323 text-lg text-yellow-500/60">
                      <Star className="w-3 h-3" /> Tudo do Plano Herói
                    </li>
                    <li className="flex items-center gap-2 font-vt323 text-lg text-yellow-500/60">
                      <Star className="w-3 h-3" /> Novos Módulos Grátis
                    </li>
                    <li className="flex items-center gap-2 font-vt323 text-lg text-yellow-500/60">
                      <Star className="w-3 h-3" /> Emblema Exclusivo
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <StripeCheckoutButton planId="lenda" active>
                    ATIVAR
                  </StripeCheckoutButton>
                </div>
              </div>
            </div>
          </div>

          <p className="font-vt323 text-lg text-gray-700 tracking-[4px] uppercase px-4">
            ⚔️ Evolua para seu nível máximo ⚔️
          </p>
        </div>
      </div>
    </div>
  );
}
