'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShoppingCart, Check, Shield, Sword, Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

export function AvatarStore({ items: initialItems, userXP }: AvatarStoreProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const filteredItems = filter === 'ALL' ? initialItems : initialItems.filter(i => i.type === filter);

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

      if (!res.ok) throw new Error('Erro ao equipar');

      toast.success('Equipamento pronto!');
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
        {['ALL', 'SKIN', 'WEAPON', 'SHIELD', 'HAT'].map((f) => (
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
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "p-[2px] pixel-corners transition-all",
              item.rarity === 'EPIC' ? "bg-purple-500" : 
              item.rarity === 'RARE' ? "bg-blue-400" : "bg-[#333]"
            )}
          >
            <div className="pixel-corners bg-[#111] p-6 h-full flex flex-col justify-between">
              <div className="space-y-3">
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

                <h3 className="font-press-start text-xs text-white uppercase mt-2">{item.name}</h3>
                <p className="font-vt323 text-lg text-gray-600 uppercase tracking-widest">{item.type}</p>
              </div>

              <div className="mt-8">
                {item.isUnlocked ? (
                  <button
                    onClick={() => handleEquip(item.id)}
                    disabled={isLoading === item.id || item.isEquipped}
                    className={cn(
                      "w-full py-4 font-press-start text-[10px] pixel-corners transition-all",
                      item.isEquipped 
                        ? "bg-green-500/20 text-green-500 cursor-default" 
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    )}
                  >
                    {item.isEquipped ? 'EQUIPADO' : 'EQUIPAR'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(item.id)}
                    disabled={isLoading === item.id || userXP < item.priceXP}
                    className={cn(
                      "w-full py-4 font-press-start text-[10px] pixel-corners flex items-center justify-center gap-2 transition-all",
                      userXP >= item.priceXP 
                        ? "bg-[#ff6b6b] text-white hover:bg-red-600" 
                        : "bg-[#222] text-gray-600 cursor-not-allowed"
                    )}
                  >
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    {item.priceXP} XP
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
