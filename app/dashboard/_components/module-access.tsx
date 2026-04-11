'use client';

import { Target, DollarSign, Heart, Lock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModuleAccessProps {
  user: any;
}

export function ModuleAccess({ user }: ModuleAccessProps) {
  const plan = user?.plan ?? 'INICIANTE';
  const canAccessAll = plan === 'HERO' || plan === 'LEGEND';

  const modules = [
    {
      name: 'Módulo de Hábitos',
      href: '/dashboard/habits',
      icon: Target,
      color: '#ff6b6b',
    },
    {
      name: 'Módulo de Finanças',
      href: '/dashboard/finances',
      icon: DollarSign,
      color: '#4dbdff',
    },
    {
      name: 'Módulo de Saúde',
      href: '/dashboard/health',
      icon: Heart,
      color: '#ff6b6b',
    },
  ];

  return (
    <div className="p-[2px] pixel-corners bg-[#333]">
      <div className="pixel-corners bg-[#18181b] p-6 lg:p-8">
        <h2 className="font-press-start text-white text-lg mb-6 tracking-wider">MÓDULOS DE JOGO</h2>
        
        <div className="space-y-4">
          {modules.map((module) => {
            const Icon = module.icon;
            const isLocked = !canAccessAll && user?.activeModule !== module.name.split(' ')[2].toUpperCase();

            return (
              <Link key={module.name} href={isLocked ? '#' : module.href} className="block group">
                <div className={cn(
                  "p-[2px] pixel-corners transition-all",
                  isLocked ? "bg-[#222]" : "bg-[#333] group-hover:bg-[#ff6b6b]"
                )}>
                  <div className={cn(
                    "pixel-corners px-4 py-4 flex items-center justify-between transition-colors",
                    isLocked ? "bg-[#111] opacity-50" : "bg-[#111] group-hover:bg-[#18181b]"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#222] pixel-corners">
                         {isLocked ? <Lock className="w-5 h-5 text-gray-700" /> : <Icon style={{ color: module.color }} className="w-5 h-5" />}
                      </div>
                      <span className="font-press-start text-[10px] sm:text-xs text-white uppercase">{module.name}</span>
                    </div>
                    {!isLocked && <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!canAccessAll && (
          <div className="mt-8 pt-8 border-t-[4px] border-[#222]">
            <p className="text-xl text-gray-500 mb-6 font-vt323 leading-tight">Melhore seu plano para desbloquear todos os módulos mundiais!</p>
            <Link href="/dashboard/profile#upgrade" className="block">
              <div className="p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] transition-colors">
                <div className="pixel-corners bg-[#ff6b6b] text-white px-6 py-4 text-center font-press-start text-[10px] sm:text-xs shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]">
                  LEVEL UP PARA HERÓI
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
