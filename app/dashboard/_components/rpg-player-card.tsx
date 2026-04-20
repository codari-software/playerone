'use client';

import { Crown, Star, Shield, Zap, Sparkles, Sword } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CharacterDisplay } from '../profile/_components/character-display';

interface RPGPlayerCardProps {
  user: any;
  xpProgress: {
    currentLevel: number;
    xpIntoLevel: number;
    xpForNextLevel: number;
    progressPercentage: number;
  };
}

export function RPGPlayerCard({ user, xpProgress }: RPGPlayerCardProps) {
  const equippedItems = user.inventory
    ? user.inventory.filter((ui: any) => ui.isEquipped).map((ui: any) => ui.item)
    : [];
    
  const equippedSkin = equippedItems.find((i: any) => i.type === 'SKIN');
  const equippedWeapon = equippedItems.find((i: any) => i.type === 'WEAPON');
  
  let skinUrl = null;
  let displayWeaponUrl = null;

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
      // Tentar usar imagem integrada: /images/skins/{folder}/{gender}/items/weapons/{weaponSlug}/{skinFilename}
      skinUrl = `/images/skins/${folder}/${gender}/items/weapons/${weaponSlug}/${skinFilename}`;
      displayWeaponUrl = null; // A arma já está na imagem da skin
    } else {
      // Skin normal sem arma integrada
      skinUrl = `/images/skins/${folder}/${gender}/${skinFilename}`;
      displayWeaponUrl = null;
    }
  } else if (user.characterSkin && user.gender) {
    skinUrl = `/images/skins/free/${user.gender}/${user.characterSkin}`;
  }

  // Se não houver skinUrl integrada ou se for uma arma sem skin compatível, 
  // poderíamos usar o overlay antigo, mas o usuário pediu para usar as novas imagens.
  // Vou manter o overlay apenas se não houver skin equipada (o que é raro) 
  // ou se a arma não tiver slug mapeado.
  if (!displayWeaponUrl && equippedWeapon && !skinUrl?.includes('/items/weapons/')) {
    displayWeaponUrl = 
      equippedWeapon.name === 'Espada de Madeira' ? '/images/items/weapons/espada_madeira.png' :
      equippedWeapon.name === 'Lâmina de Aço' ? '/images/items/weapons/lamina_aco.png' :
      equippedWeapon.name === 'Excalibur Pixelada' ? '/images/items/weapons/excalibur_pixelada.png' :
      null;
  }

  return (
    <div className="p-[2px] pixel-corners bg-gradient-to-r from-[#ff6b6b] via-purple-500 to-blue-500 animate-in fade-in slide-in-from-top duration-700">
      <div className="pixel-corners bg-[#18181b] p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="absolute -inset-8 bg-[#ff6b6b]/20 blur-3xl group-hover:bg-[#ff6b6b]/40 transition-all duration-500 rounded-full" />
            <div className="relative">
              <CharacterDisplay 
                equipped={equippedItems} 
                skinUrl={skinUrl} 
                weaponUrl={displayWeaponUrl}
              />
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#222] pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h2 className="font-press-start text-2xl text-white uppercase tracking-tighter">
                    {user.nickname || user.name || 'JOGADOR'}
                  </h2>
                  <div className="px-3 py-1 bg-[#ff6b6b]/20 border border-[#ff6b6b]/40 pixel-corners flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#ff6b6b]" />
                    <span className="font-press-start text-[8px] text-[#ff6b6b] uppercase">HERÓI</span>
                  </div>
                </div>
                <div className="font-vt323 text-3xl text-gray-400 leading-none">Nível {user.level || 1} — Explorador da Matriz</div>
              </div>
              
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-[#111] border-2 border-[#222] pixel-corners flex flex-col items-center">
                  <span className="font-press-start text-[8px] text-blue-400 mb-1">PA</span>
                  <span className="font-vt323 text-2xl text-white">{user.power || 10}</span>
                </div>
                <div className="px-4 py-2 bg-[#111] border-2 border-[#222] pixel-corners flex flex-col items-center">
                  <span className="font-press-start text-[8px] text-green-400 mb-1">STATS</span>
                  <span className="font-vt323 text-2xl text-white">{user.strength + user.intelligence + user.constitution + user.willpower}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between font-press-start text-[10px]">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400">XP PROGRESS</span>
                </div>
                <span className="text-gray-500">{user.xp} / {xpProgress.xpForNextLevel} XP</span>
              </div>
              <div className="h-4 w-full bg-[#111] pixel-corners p-[2px] relative overflow-hidden group">
                <div 
                  className="h-full bg-blue-500 pixel-corners transition-all duration-1000 relative"
                  style={{ width: `${xpProgress.progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
