'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Target,
  DollarSign,
  Heart,
  Trophy,
  Award,
  User,
  Dumbbell,
  FileText,
} from 'lucide-react';

const navItems = [
  { name: 'Início', href: '/dashboard', icon: Home },
  { name: 'Finanças', href: '/dashboard/finances', icon: DollarSign },
  { name: 'Treino', href: '/dashboard/workout', icon: Dumbbell },
  { name: 'Lore & Notas', href: '/dashboard/lore', icon: FileText },
  { name: 'Conquistas', href: '/dashboard/achievements', icon: Award },
  { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
  { name: 'Perfil', href: '/dashboard/profile', icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="relative z-40 hidden md:block">
      {/* Spacer to keep content in place when sidebar is collapsed */}
      <div className="w-16 md:w-20 h-full shrink-0" />
      
      <nav className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-16 md:w-20 hover:w-64 bg-[#111] border-r-[4px] border-[#222] transition-all duration-300 ease-in-out group/nav p-4 overflow-hidden z-50">
        <div className="flex flex-col space-y-4 w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block group shrink-0"
              >
                <div className={cn(
                  'p-[1px] pixel-corners transition-all',
                  isActive ? 'bg-[#ff6b6b]' : 'bg-transparent group-hover:bg-[#333]'
                )}>
                  <div className={cn(
                    'pixel-corners flex items-center h-12 w-full transition-all overflow-hidden',
                    isActive ? 'bg-[#ff6b6b] text-white' : 'bg-[#18181b] text-gray-400 group-hover:bg-[#222] group-hover:text-white'
                  )}>
                    {/* Icon Container - Always centered in the collapsed width */}
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                      <Icon className={cn("w-6 h-6", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                    </div>
                    
                    {/* Label - Only shows when parent nav is hovered */}
                    <span className="font-press-start text-[8px] whitespace-nowrap opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 group-hover:pl-2">
                      {item.name}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// Mobile version remains as a scrollable bar or we can optimize it later
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden w-full bg-[#111] border-b-[4px] border-[#222] p-2 overflow-x-auto scroller-none">
       <div className="flex gap-2 w-max">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "p-2 pixel-corners flex items-center gap-2",
              isActive ? "bg-[#ff6b6b] text-white" : "bg-[#222] text-gray-500"
            )}>
              <Icon className="w-4 h-4" />
              <span className="font-press-start text-[8px]">{item.name}</span>
            </Link>
          );
        })}
       </div>
    </nav>
  );
}

