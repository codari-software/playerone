'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShoppingCart, Check, Shield, Sword, Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Item {
  id: string;
  name: string;
  type: string;
  priceXP: number;
  rarity: string;
  isUnlocked: boolean;
  isEquipped: boolean;
}

interface AvatarStoreProps {
  items: Item[];
  userXP: number;
  gender?: string | null;
}

export function AvatarStore({ items: initialItems, userXP, gender }: AvatarStoreProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const filteredItems = filter === 'ALL' ? initialItems : initialItems.filter(i => i.type === filter);

  const getItemImage = (item: Item) => {
    if (item.type === 'SKIN') {
      if (item.name === 'Guerreiro Padrão') {
        return `/images/skins/paid/${gender || 'male'}/guerreiro_padrao.png`;
      }
      if (item.name === 'Mago das Chamas') {
        return `/images/skins/paid/${gender || 'male'}/mago_chamas.png`;
      }
      if (item.name === 'Sombra da Noite') {
        return `/images/skins/paid/${gender || 'male'}/sombra_noite.png`;
      }
      if (item.name === 'Paladino de Ouro') {
        return `/images/skins/paid/${gender || 'male'}/paladino_ouro.png`;
      }
      // Outras skins free/base podem usar o caminho correspondente
      return `/images/skins/free/${gender || 'male'}/skin01.png`;
    }
    if (item.type === 'WEAPON') {
      if (item.name === 'Espada de Madeira') {
        return `/images/items/weapons/espada_madeira.png`;
      }
      if (item.name === 'Lâmina de Aço') {
        return `/images/items/weapons/lamina_aco.png`;
      }
      if (item.name === 'Excalibur Pixelada') {
        return `/images/items/weapons/excalibur_pixelada.png`;
      }
    }
    // Fallback para ícones ou outras imagens
    return null;
  };

  const handleBuy = async (itemId: string) => {
    setIsLoading(itemId);
    try {
      const res = await fetch('/api/avatar/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Item forjado com sucesso!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(null);
    }
  };

  const handleEquip = async (itemId: string) => {
    setIsLoading(itemId);
    try {
      const res = await fetch('/api/avatar/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao equipar');

      if (data.action === 'unequipped') {
        toast.success('Item removido!');
      } else {
        toast.success('Equipamento pronto!');
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 border-b-2 border-[#222] pb-6">
        {['ALL', 'SKIN', 'WEAPON'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 font-press-start text-[10px] pixel-corners transition-all",
              filter === f ? "bg-blue-500 text-white" : "bg-[#222] text-gray-500 hover:bg-[#333]"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const itemImage = getItemImage(item);
          
          return (
            <div 
              key={item.id} 
              className={cn(
                "p-[2px] pixel-corners transition-all group",
                item.rarity === 'EPIC' ? "bg-purple-500" : 
                item.rarity === 'RARE' ? "bg-blue-400" : "bg-[#333]"
              )}
            >
              <div className="pixel-corners bg-[#111] p-6 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "text-[8px] font-press-start px-2 py-1 pixel-corners uppercase",
                      item.rarity === 'EPIC' ? "bg-purple-500/20 text-purple-400" :
                      item.rarity === 'RARE' ? "bg-blue-500/20 text-blue-400" : "bg-[#222] text-gray-400"
                    )}>
                      {item.rarity}
                    </div>
                    {item.isEquipped && <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />}
                  </div>

                  {/* Item Image Preview */}
                  <div className="relative w-full aspect-square bg-[#0a0a0a] pixel-corners overflow-hidden flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                    {itemImage ? (
                      <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                        <Image 
                          src={itemImage} 
                          alt={item.name} 
                          fill 
                          className="object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" 
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 opacity-20">
                        {item.type === 'WEAPON' && <Sword className="w-12 h-12" />}
                        {item.type === 'SHIELD' && <Shield className="w-12 h-12" />}
                        <span className="font-press-start text-[8px] uppercase">No Icon</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-press-start text-xs text-white uppercase break-words">{item.name}</h3>
                    <p className="font-vt323 text-lg text-gray-600 uppercase tracking-widest">{item.type}</p>
                  </div>
                </div>

                <div className="mt-8">
                  {item.isUnlocked ? (
                    <button
                      onClick={() => handleEquip(item.id)}
                      disabled={isLoading === item.id || (item.isEquipped && item.type === 'SKIN')}
                      className={cn(
                        "w-full py-4 font-press-start text-[10px] pixel-corners transition-all group/btn",
                        item.isEquipped && item.type !== 'SKIN'
                          ? "bg-green-500/20 text-green-500 hover:bg-red-500/20 hover:text-red-500" 
                          : item.isEquipped
                          ? "bg-green-500/20 text-green-500 cursor-default"
                          : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
                      )}
                    >
                      {item.isEquipped && item.type !== 'SKIN' ? (
                        <>
                          <span className="group-hover/btn:hidden">EQUIPADO</span>
                          <span className="hidden group-hover/btn:inline">DESEQUIPAR</span>
                        </>
                      ) : item.isEquipped ? 'EQUIPADO' : 'EQUIPAR'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item.id)}
                      disabled={isLoading === item.id || userXP < item.priceXP}
                      className={cn(
                        "w-full py-4 font-press-start text-[10px] pixel-corners flex items-center justify-center gap-2 transition-all active:scale-95",
                        userXP >= item.priceXP 
                          ? "bg-[#ff6b6b] text-white hover:bg-red-600" 
                          : "bg-[#222] text-gray-600 cursor-not-allowed"
                      )}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {item.priceXP} XP
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
