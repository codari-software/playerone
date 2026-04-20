import { Shield, Sword as SwordIcon, User as UserIcon, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface EquippedItem {
  id: string;
  name: string;
  type: 'SKIN' | 'WEAPON' | 'SHIELD' | 'HAT';
}

interface CharacterDisplayProps {
  equipped: EquippedItem[];
  skinUrl?: string | null;
  weaponUrl?: string | null;
}

export function CharacterDisplay({ equipped, skinUrl, weaponUrl }: CharacterDisplayProps) {
  const hasWeapon = equipped.find(i => i.type === 'WEAPON');
  const hasShield = equipped.find(i => i.type === 'SHIELD');
  const hasHat = equipped.find(i => i.type === 'HAT');
  const skin = equipped.find(i => i.type === 'SKIN');

  const skinColor = skin?.id === 'mago-das-chamas' ? 'bg-orange-600' : 
                   skin?.id === 'paladino-de-ouro' ? 'bg-yellow-500' :
                   skin?.id === 'sombra-da-noite' ? 'bg-gray-800' : 'bg-[#f8d5b4]'; // Light skin default

  return (
    <div className="relative w-80 h-96 flex flex-col items-center justify-center animate-in fade-in duration-1000">
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 blur-[100px] opacity-20 rounded-full",
        skinColor
      )} />

      {skinUrl ? (
        <div className="relative w-80 h-96 z-10 transition-all duration-700">
          <Image 
            src={skinUrl} 
            alt="Character" 
            fill
            className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          />
          
          {/* Weapon Overlay */}
          <div className="absolute top-[20%] -right-8 z-30 animate-bounce-slow">
             {hasWeapon && (
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                   {weaponUrl ? (
                      <div className="relative w-16 h-16">
                        <Image src={weaponUrl} alt="Weapon" fill className="object-contain" />
                      </div>
                   ) : (
                      <SwordIcon className="w-16 h-16 text-gray-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" />
                   )}
                </div>
             )}
          </div>

          {/* Shield Overlay */}
          <div className="absolute top-[20%] -left-8 z-30">
             {hasShield && (
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                   <Shield className="w-16 h-16 text-gray-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" />
                </div>
             )}
          </div>
        </div>
      ) : (
        /* CHARACTER BODY FALLBACK (Pixel Art Style) */
        <div className="relative w-40 h-64 flex flex-col items-center scale-110">
          
          {/* Head & Hat Area */}
          <div className="relative w-24 h-24 mb-[-4px] z-20">
            <div className={cn("w-full h-full pixel-corners", skinColor)}>
              <div className="absolute top-1/2 left-4 w-2 h-2 bg-black pixel-corners" />
              <div className="absolute top-1/2 right-4 w-2 h-2 bg-black pixel-corners" />
            </div>

            {hasHat ? (
               <div className="absolute -top-4 -left-2 w-28 h-14 bg-red-600 pixel-corners-sm">
                  <div className="absolute top-0 right-0 w-10 h-5 bg-red-800" />
                  <div className="font-press-start text-[8px] text-white absolute top-1 left-4">P1</div>
               </div>
            ) : (
              <div className="absolute -top-2 left-0 w-24 h-12 bg-[#5d4037] pixel-corners opacity-80" />
            )}
          </div>

          {/* Torso & Arms */}
          <div className="relative w-28 h-28 z-10">
            <div className="w-full h-full bg-white pixel-corners flex items-center justify-center">
               <div className="w-8 h-8 bg-yellow-400 pixel-corners flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                  <span className="font-press-start text-[10px] text-white">1</span>
               </div>
            </div>
            <div className={cn("absolute top-2 -left-4 w-8 h-14 pixel-corners", skinColor)} />
            <div className={cn("absolute top-2 -right-4 w-8 h-14 pixel-corners", skinColor)} />
            <div className="absolute -top-2 -left-2 w-32 h-24 bg-blue-500 pixel-corners -z-10 shadow-lg" />
          </div>

          {/* Legs & Feet */}
          <div className="relative w-24 h-20 mt-[-4px] flex gap-2">
             <div className="w-1/2 h-full bg-[#3e2723] pixel-corners" />
             <div className="w-1/2 h-full bg-[#3e2723] pixel-corners" />
             <div className="absolute bottom-[-10px] left-0 w-10 h-5 bg-black pixel-corners" />
             <div className="absolute bottom-[-10px] right-0 w-10 h-5 bg-black pixel-corners" />
          </div>

          {/* WEAPON & SHIELD OVERLAYS (Fallback Mode) */}
          <div className="absolute top-[20%] -right-16 z-30 animate-bounce-slow">
             {hasWeapon && (
                <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                   {weaponUrl ? (
                      <div className="relative w-12 h-12">
                        <Image src={weaponUrl} alt="Weapon" fill className="object-contain" />
                      </div>
                   ) : (
                      <SwordIcon className="w-10 h-10 text-gray-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" />
                   )}
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
      )}

      {/* Base Shadow */}
      <div className="mt-8 w-52 h-6 bg-black/40 blur-md rounded-full" />
    </div>
  );
}
