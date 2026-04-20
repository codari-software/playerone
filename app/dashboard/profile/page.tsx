import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Crown, Zap, Flame, Trophy, Star, IdCard, Wallet, Sparkles } from 'lucide-react';
import { getLevelTitle, getXpProgress } from '@/lib/xp-system';
import { cn } from '@/lib/utils';
import { StripeCheckoutButton } from '@/components/StripeCheckoutButton';
import { CharacterDisplay } from './_components/character-display';
import { AvatarStore } from './_components/avatar-store';

import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;
  
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      habits: true,
      financeTransactions: true,
      healthLogs: true,
      userAchievements: {
        include: {
          achievement: true,
        },
      },
      inventory: {
        include: {
          item: true
        }
      }
    },
  });

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="font-press-start text-[#ff6b6b]">ERRO: USUÁRIO NÃO ENCONTRADO</p>
      </div>
    );
  }

  const xpProgress = getXpProgress(user.xp);
  const title = getLevelTitle(user.level);

  // Get all potential shop items
  const allItems = await prisma.avatarItem.findMany({
    orderBy: { priceXP: 'asc' }
  });

  const equippedItems = user.inventory
    .filter(ui => ui.isEquipped)
    .map(ui => ({
      id: ui.item.id,
      name: ui.item.name,
      type: ui.item.type as 'SKIN' | 'WEAPON' | 'SHIELD' | 'HAT',
      priceXP: ui.item.priceXP,
      imageUrl: ui.item.imageUrl
    }));

  const storeItems = allItems.map(item => {
    const userOwned = user.inventory.find(ui => ui.itemId === item.id);
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      priceXP: item.priceXP,
      rarity: item.rarity,
      isUnlocked: !!userOwned,
      isEquipped: userOwned?.isEquipped || false
    };
  });

  return (
    <div className="space-y-10">
      <div className="animate-in fade-in slide-in-from-left duration-500">
        <h1 className="font-press-start text-white text-2xl mb-4 flex items-center gap-4">
          <IdCard className="w-8 h-8 text-blue-400" />
          PERFIL DO JOGADOR
        </h1>
        <p className="text-2xl text-gray-400">Suas estatísticas vitais e status de assinante.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Personagem Card */}
        <div className="animate-in fade-in slide-in-from-top duration-700 delay-100 min-w-0">
           <div className="p-6 md:p-10 h-full">
            <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 h-full">
               {/* Visual Display */}
               <div className="flex-shrink-0">
                  <CharacterDisplay 
                    equipped={equippedItems} 
                    skinUrl={(() => {
                      const equippedSkin = equippedItems.find(i => i.type === 'SKIN');
                      const equippedWeapon = equippedItems.find(i => i.type === 'WEAPON');
                      
                      if (equippedSkin) {
                        const skinNames: Record<string, string> = {
                          'Guerreiro Padrão': 'guerreiro_padrao.png',
                          'Mago das Chamas': 'mago_chamas.png',
                          'Sombra da Noite': 'sombra_noite.png',
                          'Paladino de Ouro': 'paladino_ouro.png'
                        };

                        const weaponSlugs: Record<string, string> = {
                          'Espada de Madeira': 'espada_madeira',
                          'Lâmina de Aço': 'lamina_aco',
                          'Excalibur Pixelada': 'excalibur_pixelada'
                        };

                        const skinFilename = skinNames[equippedSkin.name] || equippedSkin.imageUrl || `${equippedSkin.id}.png`;
                        const isPaid = !!skinNames[equippedSkin.name] || (equippedSkin.priceXP && equippedSkin.priceXP > 0);
                        const folder = isPaid ? 'paid' : 'free';
                        const gender = user.gender || 'male';
                        const weaponSlug = equippedWeapon ? weaponSlugs[equippedWeapon.name] : null;

                        if (weaponSlug) {
                          return `/images/skins/${folder}/${gender}/items/weapons/${weaponSlug}/${skinFilename}`;
                        }
                        
                        return `/images/skins/${folder}/${gender}/${skinFilename}`;
                      }
                      return user.characterSkin && user.gender ? `/images/skins/free/${user.gender}/${user.characterSkin}` : null;
                    })()}
                    weaponUrl={(() => {
                      const equippedSkin = equippedItems.find(i => i.type === 'SKIN');
                      const equippedWeapon = equippedItems.find(i => i.type === 'WEAPON');
                      
                      // Se temos uma skin e uma arma com slug, a arma já está na imagem da skin
                      const weaponSlugs: Record<string, string> = {
                        'Espada de Madeira': 'espada_madeira',
                        'Lâmina de Aço': 'lamina_aco',
                        'Excalibur Pixelada': 'excalibur_pixelada'
                      };

                      if (equippedSkin && equippedWeapon && weaponSlugs[equippedWeapon.name]) {
                        return null;
                      }

                      // Caso contrário, usa o overlay antigo
                      return equippedWeapon?.name === 'Espada de Madeira' ? '/images/items/weapons/espada_madeira.png' :
                             equippedWeapon?.name === 'Lâmina de Aço' ? '/images/items/weapons/lamina_aco.png' :
                             equippedWeapon?.name === 'Excalibur Pixelada' ? '/images/items/weapons/excalibur_pixelada.png' :
                             null;
                    })()}
                  />
               </div>

               <div className="flex-1 w-full min-w-0 space-y-6">
                  <div className="border-b-2 border-[#222] pb-6 space-y-2">
                    <div className="p-3 pixel-corners bg-[#ff6b6b]/20 inline-block">
                      <Crown className="w-8 h-8 text-[#ff6b6b]" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-press-start text-lg md:text-xl text-white uppercase break-all">{user.nickname || user.name || 'Jogador'}</h2>
                      <div className="font-press-start text-[8px] md:text-[10px] text-[#ff6b6b] mt-1">{title}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between font-press-start text-[8px] md:text-[10px]">
                        <span className="text-blue-400">LEVEL {user.level}</span>
                        <span className="text-gray-500">{user.xp} / {xpProgress.xpForNextLevel} XP</span>
                    </div>
                    <div className="h-4 w-full bg-[#111] pixel-corners p-[2px]">
                        <div 
                          className="h-full bg-blue-500 pixel-corners transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                          style={{ width: `${xpProgress.progressPercentage}%` }}
                        />
                    </div>
                  </div>
               </div>
            </div>
           </div>
        </div>

        {/* Plano/Assinatura Card */}
        <div className="p-[2px] pixel-corners bg-[#ff6b6b]/30 animate-in fade-in slide-in-from-top duration-700 delay-200">
          <div className="pixel-corners bg-[#18181b] p-8 h-full flex flex-col justify-between">
            <div className="space-y-6">
               <div className="flex items-center gap-3 font-press-start text-xs text-yellow-500 uppercase">
                  <Star className="w-5 h-5" />
                  Plano Atual
               </div>
               
               <div className="font-press-start text-4xl text-white uppercase tracking-widest">{user.isGuest ? 'EXPERIMENTAL' : user.plan}</div>
               
               {user.isGuest ? (
                 <p className="font-vt323 text-2xl text-green-500/80 leading-tight">
                   Você está no modo Experimental! Aproveite 7 dias de acesso total para testar todos os módulos.
                 </p>
               ) : user.plan === 'INICIANTE' ? (
                 <p className="font-vt323 text-2xl text-gray-500 leading-tight">
                   Seu status atual é limitado. Faça o upgrade para se tornar um Herói ou Lenda e desbloquear todos os módulos do sistema.
                 </p>
               ) : (
                 <p className="font-vt323 text-2xl text-green-500/80 leading-tight">
                   Parabéns! Você tem acesso total a todas as funcionalidades do sistema PlayerOne.
                 </p>
               )}
            </div>

            {(user.plan === 'INICIANTE' || user.isGuest) && (
              <div id="upgrade" className="mt-8 pt-8 border-t-2 border-[#222]">
                <StripeCheckoutButton planId="heroi" active>
                   {user.isGuest ? 'GARANTIR ACESSO VITALÍCIO' : 'DAR UPGRADE AGORA'}
                </StripeCheckoutButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Mundiais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
        <div className="p-[2px] pixel-corners bg-[#333]">
           <div className="pixel-corners bg-[#18181b] p-6 text-center">
              <Zap className="w-6 h-6 text-blue-400 mx-auto mb-3" />
              <div className="font-press-start text-xl text-blue-400 mb-1">{user.xp}</div>
              <div className="font-vt323 text-xl text-gray-600 uppercase">XP TOTAL</div>
           </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
           <div className="pixel-corners bg-[#18181b] p-6 text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-3" />
              <div className="font-press-start text-xl text-orange-500 mb-1">{user.currentStreak}</div>
              <div className="font-vt323 text-xl text-gray-600 uppercase">OFFENSIVE</div>
           </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
           <div className="pixel-corners bg-[#18181b] p-6 text-center">
              <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-3" />
              <div className="font-press-start text-xl text-purple-500 mb-1">{user.userAchievements?.length ?? 0}</div>
              <div className="font-vt323 text-xl text-gray-600 uppercase">CONQUISTAS</div>
           </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
           <div className="pixel-corners bg-[#18181b] p-6 text-center">
              <Wallet className="w-6 h-6 text-green-500 mx-auto mb-3" />
              <div className="font-press-start text-xl text-green-500 mb-1">{user.financeTransactions?.length ?? 0}</div>
              <div className="font-vt323 text-xl text-gray-600 uppercase">LOGS</div>
           </div>
        </div>
      </div>

      {/* Avatar Shop & Inventory */}
      <div className="animate-in fade-in duration-1000 delay-500">
         <div className="flex items-center gap-4 mb-8">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <h2 className="font-press-start text-white text-xl">FORJA E INVENTÁRIO</h2>
         </div>
         
         <div className="p-[2px] pixel-corners bg-[#222]">
            <div className="pixel-corners bg-[#111] p-6 md:p-10">
               <AvatarStore items={storeItems} userXP={user.xp} gender={user.gender} />
            </div>
         </div>
      </div>
    </div>
  );
}
