'use client';

import { Shield, Sword as SwordIcon, User as UserIcon, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EquippedItem {
  id: string;
  name: string;
  type: 'SKIN' | 'WEAPON' | 'SHIELD' | 'HAT';
}

interface CharacterDisplayProps {
  equipped: EquippedItem[];
}

export function CharacterDisplay({ equipped }: CharacterDisplayProps) {
  const hasWeapon = equipped.find(i => i.type === 'WEAPON');
  const hasShield = equipped.find(i => i.type === 'SHIELD');
  const hasHat = equipped.find(i => i.type === 'HAT');
  const skin = equipped.find(i => i.type === 'SKIN');

  const skinColor = skin?.id === 'mago-das-chamas' ? 'bg-orange-600' : 
                   skin?.id === 'paladino-de-ouro' ? 'bg-yellow-500' :
                   skin?.id === 'sombra-da-noite' ? 'bg-gray-800' : 'bg-[#f8d5b4]'; // Light skin default

  return (
    <div className="relative w-48 h-64 flex flex-col items-center justify-center animate-in fade-in duration-1000">
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 blur-3xl opacity-20 rounded-full",
        skinColor
      )} />

      {/* CHARACTER BODY (Pixel Art Style) */}
      <div className="relative w-32 h-52 flex flex-col items-center">
        
        {/* Head & Hat Area */}
        <div className="relative w-20 h-20 mb-[-4px] z-20">
          {/* Default Hair/Head */}
          <div className={cn("w-full h-full pixel-corners", skinColor)}>
            {/* Eyes */}
            <div className="absolute top-1/2 left-4 w-2 h-2 bg-black pixel-corners" />
            <div className="absolute top-1/2 right-4 w-2 h-2 bg-black pixel-corners" />
          </div>

          {/* HAT (Like the red cap in the image) */}
          {hasHat ? (
             <div className="absolute -top-4 -left-2 w-24 h-12 bg-red-600 pixel-corners-sm">
                <div className="absolute top-0 right-0 w-8 h-4 bg-red-800" /> {/* Cap Visor */}
                <div className="font-press-start text-[6px] text-white absolute top-1 left-4">P1</div>
             </div>
          ) : (
            <div className="absolute -top-2 left-0 w-20 h-10 bg-[#5d4037] pixel-corners opacity-80" /> /* Base Hair */
          )}
        </div>

        {/* Torso & Arms */}
        <div className="relative w-24 h-24 z-10">
          {/* T-Shirt (White like the image) */}
          <div className="w-full h-full bg-white pixel-corners flex items-center justify-center">
             {/* Logo/Crest */}
             <div className="w-6 h-6 bg-yellow-400 pixel-corners flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                <span className="font-press-start text-[8px] text-white">1</span>
             </div>
          </div>

          {/* Arms */}
          <div className={cn("absolute top-2 -left-4 w-6 h-12 pixel-corners", skinColor)} />
          <div className={cn("absolute top-2 -right-4 w-6 h-12 pixel-corners", skinColor)} />
          
          {/* Bag (Blue like the image) */}
          <div className="absolute -top-2 -left-2 w-28 h-20 bg-blue-500 pixel-corners -z-10 shadow-lg" />
        </div>

        {/* Legs & Feet */}
        <div className="relative w-20 h-16 mt-[-4px] flex gap-2">
           {/* Brown Pants */}
           <div className="w-1/2 h-full bg-[#3e2723] pixel-corners" />
           <div className="w-1/2 h-full bg-[#3e2723] pixel-corners" />
           
           {/* Black Feet */}
           <div className="absolute bottom-[-10px] left-0 w-8 h-4 bg-black pixel-corners" />
           <div className="absolute bottom-[-10px] right-0 w-8 h-4 bg-black pixel-corners" />
        </div>

        {/* WEAPON & SHIELD OVERLAYS */}
        <div className="absolute top-[20%] -right-16 z-30 animate-bounce-slow">
           {hasWeapon && (
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                 <SwordIcon className="w-10 h-10 text-gray-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" />
              </div>
           )}
        </div>

        <div className="absolute top-[20%] -left-16 z-30">
           {hasShield && (
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                 <Shield className="w-10 h-10 text-gray-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" />
              </div>
           )}
        </div>
      </div>

      {/* Base Shadow */}
      <div className="mt-8 w-40 h-4 bg-black/40 blur-md rounded-full" />
    </div>
  );
}
